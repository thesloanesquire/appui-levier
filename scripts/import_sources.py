#!/usr/bin/env python3
"""Import des répertoires officiels téléchargés dans data/sources/ (le 21.10.2026, accord de Tim) :

  - ASF (Surveillance fédérale des fondations), XLSX au 17.09.2026 : fondations sous surveillance fédérale.
  - As-So (VD, NE, JU), PDF au 13.05.2026 : sous-types attribués par l'autorité (ex. « Soutien financier, matériel »).
  - BBSA (Berne), PDF au 01.01.2026 : fondations bernoises surveillées (inscription volontaire).
  - Loterie Romande, PDF « Répartition des bénéfices 2025 » : bénéficiaires, montant, type, domaine, canton.

Sorties : data/sources_enrichissement.json (par UID) et src/data/loro.js (soutiens Loterie Romande 2025).
Usage : python3.12 import_sources.py   (puis relancer lindas_fondations.py pour intégrer l'enrichissement)
"""
import json, re, subprocess, sys
from pathlib import Path
from collections import Counter

ICI = Path(__file__).resolve().parent
RACINE = ICI.parent
SRC = RACINE / "data/sources"
sys.path.insert(0, str(ICI))
from xlsx_lire import lignes

UIDRX = re.compile(r"CHE-?\s*(\d{3})\.?(\d{3})\.?(\d{3})")
uidfmt = lambda a, b, c: f"CHE-{a}.{b}.{c}"


def pdf_texte(path, mode="-layout"):
    return subprocess.run(["pdftotext", mode, str(path), "-"], capture_output=True, text=True).stdout


def asf():
    f = next(SRC.glob("*ASF*.xlsx"), None)
    if not f: return {}
    out = {}
    for r in list(lignes(f))[1:]:
        m = UIDRX.search(r.get("B", "") or "")
        if m: out[uidfmt(*m.groups())] = {"asf": True}
    return out


def asso():
    """Découpe le PDF en blocs par fondation (le n° As-So « (1000xx) » clôt chaque bloc) et lit les colonnes sous-types."""
    f = next(SRC.glob("*AsSo*.pdf"), None)
    if not f: return {}
    out, bloc, cols = {}, [], None
    for line in pdf_texte(f).splitlines():
        if "Sous-types 1" in line:
            cols = (line.index("Sous-types 1"), line.index("Sous-types 2"), line.index("Sous-types 3"), line.index(" But") + 1)
            bloc = []; continue
        if not cols: continue
        bloc.append(line)
        if re.search(r"\(\d{6}\)", line):
            txt = "\n".join(bloc)
            m = re.search(r"(\d{3})\.(\d{3})\.(\d{3})", txt)
            if m:
                st = []
                for a, b in ((cols[0], cols[1]), (cols[1], cols[2]), (cols[2], cols[3])):
                    parts = " ".join(l[a - 2:b - 1].strip() for l in bloc if len(l) > a - 2).split()
                    v = re.sub(r"\s+-\s*", " - ", " ".join(parts)).strip(" -")
                    if len(v) > 6: st.append(v)
                out[uidfmt(*m.groups())] = {"asso": True, "sous_types": st}
            bloc = []
    return out


def bbsa():
    f = next(SRC.glob("*BBSA*.pdf"), None)
    if not f: return {}
    return {uidfmt(*m.groups()): {"bbsa": True} for m in UIDRX.finditer(pdf_texte(f, "-raw"))}


LORO_DOM = {"Action sociale et personnes âgées": "social", "Jeunesse et éducation": "jeunesse", "Santé et handicap": "sante",
            "Culture": "culture", "Formation et recherche": "formation", "Conservation du patrimoine": "patrimoine",
            "Environnement": "environnement", "Promotion, tourisme et développement": "promotion", "Sport": "sport"}
TYPES = re.compile(r"^(Activité|Manifestation|Travaux|Aménagements|Acquisition|Équipement|Equipement|Publication|Exposition|Saison|Création|Création artistique|Fonctionnement|Étude|Etude|Projet|Édition|Edition|Enregistrement|Tournée|Production|Infrastructure|Festival|Formation|Recherche|Divers|matériel)")
CANTONS = {"Vaud": "VD", "Genève": "GE", "Fribourg": "FR", "Neuchâtel": "NE", "Valais": "VS", "Jura": "JU", "Suisse romande": "CH-R"}


TOUS = ["Vaud", "Fribourg", "Valais", "Neuchâtel", "Genève", "Jura"]
ONGLET = re.compile(r"((?:Vaud|Fribourg|Valais|Neuchâtel|Genève|Jura)(?: (?:Vaud|Fribourg|Valais|Neuchâtel|Genève|Jura)){4}) Suisse romande$")
MONTANT = r"(\d{1,3}(?:'\d{3})*)\.-"


def loro():
    f = next(SRC.glob("*LoRo*.pdf"), None)
    if not f: return []
    L = [l.strip() for l in pdf_texte(f, "-raw").splitlines() if l.strip()]
    canton, dom, buf, out, skip = None, None, [], [], False

    def emettre(montant):
        nonlocal buf
        if not (canton and buf): buf = []; return
        n = len(buf)
        while n > 1 and (TYPES.match(buf[n - 1]) or buf[n - 1].startswith(("/", "Équipement", "Aménagements", "Soutien"))):
            n -= 1
        nom = " ".join(buf[:n]).replace(" ,", ",")
        loc = nom.rsplit(",", 1)[1].strip() if "," in nom else ""
        out.append({"n": nom.rsplit(",", 1)[0].strip() if loc else nom, "l": loc, "c": canton, "d": dom,
                    "t": " ".join(buf[n:]), "m": int(montant.replace("'", ""))})
        buf = []

    for l in L:
        if skip:  # nom du canton courant, imprimé sous l'onglet
            skip = False
            if re.match(r"^(Vaud|Fribourg|Valais|Neuchâtel|Genève|Jura|Suisse romande)\s*\d*$", l): continue
        m = ONGLET.search(l)
        if m:
            manque = [c for c in TOUS if c not in m.group(1).split()]
            canton = CANTONS[manque[0]] if len(manque) == 1 else "CH-R"
            l = l[:m.start()].strip(); skip = True
            if not l: buf = []; continue
        if re.match(r"^\d{1,3}(’\d{3})+\.-$", l):  # total de domaine (apostrophe typographique)
            lab = " ".join(buf).strip()
            for k, v in LORO_DOM.items():
                if lab.endswith(k): dom = v
            buf = []; continue
        a = re.match("^" + MONTANT + "$", l)
        if a: emettre(a.group(1)); continue
        a = re.match(r"^(.+?)\s+" + MONTANT + "$", l)
        if a: buf.append(a.group(1)); emettre(a.group(2)); continue
        a = re.match("^" + MONTANT + r"\s+(.+)$", l)
        if a: emettre(a.group(1)); buf = [a.group(2)]; continue
        buf.append(l)
        if len(buf) > 8: buf = buf[-8:]
    return [x for x in out if 50 <= x["m"] <= 5_000_000 and len(x["n"]) > 3]


def main():
    enr = {}
    for nom, fn in (("ASF", asf), ("As-So", asso), ("BBSA", bbsa)):
        d = fn()
        for uid, v in d.items(): enr.setdefault(uid, {}).update(v)
        print(f"{nom} : {len(d)} fondations", flush=True)
    (RACINE / "data/sources_enrichissement.json").write_text(json.dumps(enr, ensure_ascii=False))
    st = Counter(s for v in enr.values() for s in v.get("sous_types", []))
    print("Sous-types As-So les plus fréquents :", st.most_common(12))
    lr = loro()
    (RACINE / "src/data/loro.js").write_text("/* Loterie Romande, Répartition des bénéfices 2025 (soutien-loro.ch), extrait le 21.10.2026. Montants en CHF. */\nwindow.LORO=" +
                                             json.dumps(lr, ensure_ascii=False, separators=(",", ":")) + ";\n")
    total = f"{sum(x['m'] for x in lr):,}".replace(",", "'")
    print(f"Loterie Romande : {len(lr)} soutiens, total CHF {total}")
    print("  par canton :", dict(Counter(x["c"] for x in lr)))


if __name__ == "__main__":
    main()
