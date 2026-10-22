#!/usr/bin/env python3
"""Page de remise à Alexandre : présente la page publique, la plateforme, le kit de vente et les données,
explique la mise en ligne et l'évolution. Réservée à la démo Netlify : elle n'entre jamais dans la version
servie par le serveur Appui (site/ construit par construire_site.sh ne la contient pas).

    python3 scripts/construire_hub.py          # écrit site/<identifiant>/ (après construire_site.sh)

L'identifiant de l'adresse est tiré une fois et gardé dans hub/.slug (ignoré par Git) : la page n'est pas
référencée (noindex) et son adresse n'est pas devinable. Ce n'est pas un mot de passe : ne pas y mettre de donnée
de client. Les chiffres (fondations, fiches vérifiées) sont recalculés à chaque lancement."""
import collections, datetime, json, re, secrets, shutil, subprocess
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
HUB, SITE = RACINE / "hub", RACINE / "site"
fmt = lambda n: f"{n:,}".replace(",", "'")
CANT = {"GE", "VD", "VS", "FR", "NE", "JU"}

KIT = [
    ("2026-10-22_Levier_Prospectus_FR.pdf", "prospectus-fr.pdf", "Prospectus (français)", "2 pages A4. À joindre à un e-mail ou à imprimer : la douleur, la méthode, les prix, la garantie, qui est derrière.", False),
    ("2026-10-22_Levier_Prospekt_DE.pdf", "prospekt-de.pdf", "Prospekt (Deutsch)", "Même contenu en allemand, pour les fondations et associations alémaniques.", False),
    ("2026-10-22_Levier_Brochure_EN.pdf", "brochure-en.pdf", "Brochure (English)", "Même contenu en anglais, pour les projets internationaux et les étudiants.", False),
    ("2026-10-22_Levier_Barometre_fondations_romandes.pdf", "barometre-fondations-romandes.pdf", "Baromètre des fondations romandes", "4 pages. Les chiffres du registre et des fiches vérifiées : le document qui installe Alexandre comme expert. Librement partageable.", False),
    ("2026-10-22_Levier_Presentation_premier_rendez-vous.pdf", "presentation-premier-rendez-vous.pdf", "Présentation du premier rendez-vous", "13 diapositives à projeter pendant les 15 minutes : douleur, calendrier, fiche réelle, lettre, offre, questions à poser.", True),
]


def stats():
    base = json.load(open(RACINE / "data/fondations_ch.json"))
    rom = [f for f in base if f["canton"] in CANT and not f["en_liquidation"]]
    don = [f for f in rom if f["type"] in ("donatrice_probable", "mixte")]
    app = [f for f in base if f["type"] != "prevoyance" and not f["en_liquidation"]]
    par_id = {f["ehraid"]: f for f in base}
    fiches = []
    for p in sorted((RACINE / "data/enrichi").glob("*.json")):
        try:
            x = json.load(open(p))
        except Exception:
            continue
        if isinstance(x, dict) and x.get("demande") and x.get("id") in par_id:
            fiches.append(x)
    n = len(fiches)
    pc = lambda k: f"{k} ({round(100 * k / n)} %)" if n else "0"
    c = lambda x, k: (x.get("contact") or {}).get(k)
    acc = collections.Counter(x["demande"].get("accepte_demandes", "inconnu") for x in fiches)
    moteurs = collections.Counter(re.sub(r" \+.*", "", x.get("moteur", "inconnu")).replace("claude CLI ", "").strip("()") for x in fiches)
    cant = collections.Counter(par_id[x["id"]]["canton"] for x in fiches)
    return {
        "n_total": fmt(len(base)), "n_app": fmt(len(app)), "n_rom": fmt(len(rom)), "n_don": fmt(len(don)), "n_fiches": str(n),
        "p_site": pc(sum(1 for x in fiches if x.get("site_web"))), "p_delais": pc(sum(1 for x in fiches if x["demande"].get("delais"))),
        "p_crit": pc(sum(1 for x in fiches if x["demande"].get("criteres"))),
        "p_oui": pc(acc.get("oui", 0)), "p_non": pc(acc.get("non", 0)), "p_inc": pc(acc.get("inconnu", 0) + acc.get("sur invitation", 0)),
        "n_sures": str(sum(1 for x in fiches if x["demande"].get("accepte_demandes") == "oui" and x.get("confiance") == "haute")),
        "moteurs": ", ".join(f"{k} : {v}" for k, v in moteurs.most_common()),
        "cantons": ", ".join(f"{k} {v}" for k, v in cant.most_common()),
    }


def vignette(pdf, out):
    import tempfile
    from PIL import Image
    with tempfile.TemporaryDirectory() as d:  # dossier temporaire, nettoyé automatiquement
        racine = Path(d) / "p"
        subprocess.run(["pdftoppm", "-r", "50", "-png", "-f", "1", "-l", "1", "-singlefile", str(pdf), str(racine)], check=True)
        Image.open(str(racine) + ".png").convert("RGB").save(out, "WEBP", quality=82)


def main():
    slug_f = HUB / ".slug"
    if not slug_f.exists():
        slug_f.write_text("remise-" + secrets.token_hex(4))
    slug = slug_f.read_text().strip()
    out = SITE / slug
    (out / "assets").mkdir(parents=True, exist_ok=True)
    (out / "kit").mkdir(exist_ok=True)
    for f in HUB.glob("assets/*.webp"):
        shutil.copy2(f, out / "assets" / f.name)
    shutil.copy2(HUB / "hub.css", out / "hub.css")
    cartes = []
    for src, nom, titre, texte, paysage in KIT:
        pdf = RACINE / "kit/pdf" / src
        if not pdf.exists():
            raise SystemExit(f"PDF manquant : {pdf} (lancer python3 scripts/construire_kit.py)")
        shutil.copy2(pdf, out / "kit" / nom)
        vignette(pdf, out / "assets" / (nom[:-4] + ".webp"))
        ko = round(pdf.stat().st_size / 1024)
        taille = f"{ko / 1024:.1f} Mo" if ko > 1024 else f"{ko} Ko"
        cartes.append(f'    <a class="k" href="kit/{nom}" target="_blank" rel="noopener"><div class="th{" land" if paysage else ""}"><img src="assets/{nom[:-4]}.webp" alt="" loading="lazy"></div><div class="bd"><b>{titre}</b><span>{texte}</span><em>PDF · {taille}</em></div></a>')
    page = (HUB / "page.html").read_text()
    v = stats()
    v.update(date=datetime.date.today().strftime("%d.%m.%Y"), kit_cards="\n".join(cartes))
    for k, val in v.items():
        page = page.replace("{{" + k + "}}", val)
    assert "{{" not in page, re.findall(r"\{\{\w+\}\}", page)
    (out / "index.html").write_text(page)
    print(f"hub : site/{slug}/ ({v['n_fiches']} fiches)")
    print(f"adresse : /{slug}/")


if __name__ == "__main__":
    main()
