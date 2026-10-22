#!/usr/bin/env python3
"""Extraction des fondations romandes depuis Zefix (registre du commerce, données publiques).

Étapes (reprenables, cache local) :
  1. liste  : recherche par termes x office du registre, dédoublonnage par ehraid
  2. détail : but social + publications FOSC pour chaque fondation (1 requête / 0.6 s)
  3. export : classement (donatrice probable / opérationnelle / prévoyance) + domaines

Usage :
  python3.12 zefix_fondations.py liste
  python3.12 zefix_fondations.py detail
  python3.12 zefix_fondations.py export

Note : pour un usage en production, demander un accès ZefixPublicREST (gratuit, OFRC)
plutôt que l'API de l'interface web. Les noms de personnes des publications FOSC
ne sont PAS exportés (nLPD : minimisation).
"""
import json, re, sys, time, csv, urllib.request, urllib.error
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"
LISTE = DATA / "zefix_liste.json"
DETAIL = DATA / "zefix_detail.jsonl"
API = "https://www.zefix.ch/ZefixREST/api/v1"

OFFICES = {550: "VD", 660: "GE", 645: "NE", 217: "FR", 670: "JU", 600: "VS", 621: "VS", 626: "VS"}
TERMES = ["fondation", "stiftung", "foundation", "fondazione", "fonds", "fund", "fondo",
          "pro ", "aide", "hilfe", "œuvre", "oeuvre", "association", "institut", "musée",
          "culture", "home", "ems", "école", "centre", "société", "caisse", "prévoyance",
          "vorsorge", "personal", "bourse", "prix", "patrimoine", "art", "santé"]
PAUSE = 0.6
UA = {"User-Agent": "Levier-recherche-fondations/0.1 (contact: levierconseil.ch)",
      "Content-Type": "application/json", "Accept": "application/json"}


def http(url, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, headers=UA, method="POST" if data else "GET")
    for essai in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 404:  # recherche sans résultat
                return {}
            time.sleep(3 * (essai + 1))
            err = e
        except Exception as e:
            time.sleep(3 * (essai + 1))
            err = e
    raise err


def liste():
    vus = json.loads(LISTE.read_text()) if LISTE.exists() else {}
    for office, canton in OFFICES.items():
        for terme in TERMES:
            # L'API web ignore « offset » : une seule page, jusqu'à 3000 résultats.
            d = http(f"{API}/firm/search.json", {
                "name": terme, "languageKey": "fr", "maxEntries": 3000, "offset": 0,
                "legalForms": [7], "registryOffices": [office], "activeOnly": True})
            lot = d.get("list", [])
            for f in lot:
                f["canton"] = canton
                vus[str(f["ehraid"])] = f
            time.sleep(PAUSE)
            alerte = " (TRONQUÉ)" if d.get("hasMoreResults") else ""
            print(f"{canton} {office} '{terme}' +{len(lot)}{alerte} -> total {len(vus)}", flush=True)
            LISTE.write_text(json.dumps(vus, ensure_ascii=False))
        LISTE.write_text(json.dumps(vus, ensure_ascii=False))
    print("fondations uniques :", len(vus))


def detail():
    vus = json.loads(LISTE.read_text())
    faits = set()
    if DETAIL.exists():
        faits = {json.loads(l)["ehraid"] for l in DETAIL.open()}
    todo = [e for e in vus if int(e) not in faits]
    print(f"à faire : {len(todo)} / {len(vus)}", flush=True)
    with DETAIL.open("a") as out:
        for i, e in enumerate(todo, 1):
            try:
                d = http(f"{API}/firm/{e}.json")
            except Exception as ex:
                print("échec", e, ex, flush=True)
                continue
            pubs = d.get("shabPub") or []
            out.write(json.dumps({
                "ehraid": d["ehraid"], "purpose": d.get("purpose") or "",
                "translation": d.get("translation") or [],
                "derniere_fosc": pubs[0]["shabDate"] if pubs else None,
                "mutations": sorted({m["key"] for p in pubs for m in p.get("mutationTypes", [])}),
                "nb_publications": len(pubs),
            }, ensure_ascii=False) + "\n")
            if i % 100 == 0:
                out.flush()
                print(f"{i}/{len(todo)}", flush=True)
            time.sleep(PAUSE)


# --- Classement --------------------------------------------------------------
RX = lambda *mots: re.compile("|".join(mots), re.I)
PREVOYANCE = RX(r"pr[ée]voyance", r"vorsorge", r"pensionskasse", r"caisse de pension", r"\bLPP\b",
                r"\bBVG\b", r"personalf[üu]rsorge", r"wohlfahrtsfonds", r"fonds de bienfaisance du personnel",
                r"retraite", r"libre passage", r"freiz[üu]gigkeit", r"patronal", r"en faveur du personnel")
DONATRICE = RX(r"soutenir", r"soutien", r"allou", r"octroi", r"subsid", r"subvention", r"bourse",
               r"prix\b", r"aide financi", r"contributions? financi", r"financer", r"encourag", r"promouvoir",
               r"unterst[üu]tz", r"f[öo]rder", r"beitr[äa]g", r"stipendi", r"vergab", r"ausricht", r"zuwend")
OPERATIONNELLE = RX(r"exploit", r"g[ée]rer (un|une|des|l)", r"\bEMS\b", r"home\b", r"\bcr[èe]che",
                    r"[ée]tablissement m[ée]dico", r"logements?", r"betrieb", r"f[üu]hren eine", r"heim\b",
                    r"[ée]cole priv", r"internat", r"h[ôo]pital", r"clinique")

DOMAINES = {
    "social_precarite": r"pauvret|pr[ée]carit|d[ée]munis|social|exclusion|n[ée]cessiteux|bed[üu]rftig|armut|sozial",
    "enfance_jeunesse": r"enfan|jeun|adolesc|kinder|jugend|[ée]l[èe]ves",
    "personnes_agees": r"[âa]g[ée]es|seniors?|vieillesse|alter[sn]",
    "handicap": r"handicap|invalid|behinder",
    "sante_medical": r"sant[ée]|m[ée]dic|maladi|cancer|soins|patient|gesundheit|krank|medizin",
    "recherche_science": r"recherche|scientifi|forschung|wissenschaft|universit",
    "formation_education": r"formation|[ée]ducation|enseignement|[ée]tudes|apprenti|bildung|ausbildung|bourse|stipend",
    "culture_arts": r"cultur|artisti|\barts?\b|musique|th[ée][âa]tre|litt[ée]ra|cin[ée]ma|danse|kultur|kunst|musik",
    "patrimoine": r"patrimoine|monument|histor|mus[ée]e|denkmal|erbe",
    "environnement_climat": r"environnement|nature|climat|biodiversit|[ée]colog|durable|umwelt|natur|klima",
    "animaux": r"animaux|animal|faune|tier",
    "sport": r"\bsport",
    "cooperation_internationale": r"pays en d[ée]veloppement|coop[ée]ration|humanitaire|tiers.monde|afrique|international|entwicklungs",
    "migration_integration": r"migra|r[ée]fugi|int[ée]gration|asile|flücht",
    "religion": r"[ée]glise|paroiss|religi|chr[ée]tien|catholi|protestant|kirch|juive|islam",
    "innovation_entrepreneuriat": r"innovation|entrepren|start.?up|[ée]conomi|unternehm",
    "droits_humains_democratie": r"droits? (de l.homme|humains)|d[ée]mocrat|paix|menschenrecht|citoyen",
    "egalite_genre": r"femmes|[ée]galit[ée]|genre|frauen|gleichstell",
    "agriculture_alimentation": r"agricult|alimentation|paysan|landwirt",
    "medias_journalisme": r"m[ée]dias|journalis|presse",
}
DOMAINES = {k: re.compile(v, re.I) for k, v in DOMAINES.items()}
PORTEE = [("international", r"monde|international|pays en d[ée]veloppement|[ée]tranger"),
          ("suisse", r"suisse|schweiz|national"),
          ("romandie", r"romand"),
          ("cantonal", r"canton|vaud|gen[èe]v|neuch[âa]t|fribourg|valais|jura")]


def classer(f):
    texte = f"{f.get('name') or f.get('nom', '')} {f['purpose']}"
    if PREVOYANCE.search(texte):
        return "prevoyance"
    don, op = bool(DONATRICE.search(f["purpose"])), bool(OPERATIONNELLE.search(texte))
    if don and not op:
        return "donatrice_probable"
    if don and op:
        return "mixte"
    if op:
        return "operationnelle"
    return "indetermine"


def export():
    vus = json.loads(LISTE.read_text())
    det = {json.loads(l)["ehraid"]: json.loads(l) for l in DETAIL.open()}
    lignes = []
    for e, f in vus.items():
        d = det.get(int(e))
        if not d:
            continue
        r = {"uid": f["uidFormatted"], "ehraid": f["ehraid"], "nom": f["name"], "siege": f["legalSeat"],
             "canton": f["canton"], "statut": f["status"], "purpose": d["purpose"],
             "derniere_fosc": d["derniere_fosc"], "nb_publications": d["nb_publications"],
             "extrait_rc": f.get("cantonalExcerptWeb", "")}
        r["type"] = classer(r)
        r["domaines"] = [k for k, rx in DOMAINES.items() if rx.search(r["nom"] + " " + r["purpose"])]
        r["portee"] = next((p for p, rx in PORTEE if re.search(rx, r["purpose"], re.I)), "non_precise")
        r["en_liquidation"] = r["statut"] != "EXISTIEREND" or "liquidation" in r["nom"].lower()
        lignes.append(r)
    lignes.sort(key=lambda r: (r["canton"], r["nom"].lower()))
    (DATA / "fondations_romandes.json").write_text(json.dumps(lignes, ensure_ascii=False))
    with (DATA / "fondations_romandes.csv").open("w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(lignes[0].keys()))
        w.writeheader()
        for r in lignes:
            w.writerow({**r, "domaines": ";".join(r["domaines"])})
    from collections import Counter
    print("total", len(lignes))
    print(Counter(r["type"] for r in lignes))
    print(Counter(r["canton"] for r in lignes))
    print(Counter(d for r in lignes if r["type"] in ("donatrice_probable", "mixte") for d in r["domaines"]).most_common())


if __name__ == "__main__":
    {"liste": liste, "detail": detail, "export": export}[sys.argv[1]]()
