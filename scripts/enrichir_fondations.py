#!/usr/bin/env python3
"""Enrichit la fiche d'une fondation : site web officiel, contact institutionnel, modalités et délais
de dépôt, montants, page « demande de soutien », exemples de projets soutenus. Chaque information est sourcée.

Moteur : CLI Claude avec recherche web (WebSearch + WebFetch), sortie JSON validée par schéma.
(Infomaniak AI n'offre pas de recherche web : cette étape reste sur Claude Code.)
Sources visées : site officiel de la fondation, rapports annuels, registre du commerce (Zefix), Wikidata,
pages d'autorités de surveillance. EXCLUES : local.ch, search.ch, moneyhouse.ch, easymonitoring.ch et autres
annuaires dont les conditions interdisent l'extraction automatique, ainsi que les réseaux sociaux.
Données personnelles : uniquement des coordonnées institutionnelles (pas de nom, e-mail ou téléphone
de personne privée ; un·e responsable nommé·e sur le site officiel peut être cité·e par sa fonction).

Usage
  python3.12 enrichir_fondations.py --id 1479589                 # une fondation (ehraid)
  python3.12 enrichir_fondations.py --nom "Fondation Sport-Up"    # recherche par nom dans la base
  python3.12 enrichir_fondations.py --client ate-pedibus --top 10 # les 10 meilleures d'un client analysé par le bot
  python3.12 enrichir_fondations.py --nouvelles --cantons VD,GE,FR,NE,VS,JU --max 30
                                   # nouvelles fondations donatrices depuis la dernière extraction LINDAS
Options : --force (ré-enrichir même si une fiche récente existe), --modele sonnet|opus
"""
import argparse, datetime, json, subprocess, sys, time
from pathlib import Path

ICI = Path(__file__).resolve().parent
RACINE = ICI.parent
DOSSIER = RACINE / "data/enrichi"

SCHEMA = {"type": "object", "required": ["site_web", "contact", "demande", "projets_soutenus", "sources", "confiance", "resume"],
  "properties": {
    "site_web": {"type": ["string", "null"], "description": "URL du site officiel de la fondation, null si introuvable"},
    "resume": {"type": "string", "description": "2 phrases : ce que la fondation finance concrètement aujourd'hui"},
    "contact": {"type": "object", "properties": {
        "adresse": {"type": ["string", "null"]}, "email": {"type": ["string", "null"], "description": "adresse générique uniquement (info@, contact@, secretariat@…)"},
        "telephone": {"type": ["string", "null"], "description": "numéro du secrétariat ou standard uniquement"},
        "formulaire_url": {"type": ["string", "null"]}, "responsable_fonction": {"type": ["string", "null"], "description": "ex. « Secrétariat du conseil de fondation »"}}},
    "demande": {"type": "object", "properties": {
        "accepte_demandes": {"type": "string", "enum": ["oui", "non", "sur invitation", "inconnu"]},
        "modalites": {"type": ["string", "null"], "description": "lettre, formulaire en ligne, dossier complet, plateforme…"},
        "url_page_demande": {"type": ["string", "null"]},
        "delais": {"type": "array", "items": {"type": "string"}, "description": "dates ou rythme de dépôt, ex. « 31 mars », « séances trimestrielles »"},
        "montants": {"type": ["string", "null"], "description": "montants typiques ou fourchette, avec l'année si indiquée"},
        "zone": {"type": ["string", "null"]}, "criteres": {"type": "array", "items": {"type": "string"}},
        "exclusions": {"type": "array", "items": {"type": "string"}}, "langues": {"type": "array", "items": {"type": "string"}},
        "documents_requis": {"type": "array", "items": {"type": "string"}}}},
    "projets_soutenus": {"type": "array", "items": {"type": "string"}, "description": "jusqu'à 6 exemples récents de projets ou organisations soutenus"},
    "rapport_annuel_url": {"type": ["string", "null"]},
    "sources": {"type": "array", "items": {"type": "object", "required": ["url", "apport"], "properties": {"url": {"type": "string"}, "apport": {"type": "string"}}}},
    "confiance": {"type": "string", "enum": ["haute", "moyenne", "faible"], "description": "haute = site officiel trouvé et lu"},
    "remarques": {"type": ["string", "null"]}}}

PROMPT = """Tu es documentaliste chez Levier, agence suisse de recherche de fonds. Constitue la fiche pratique
de cette fondation pour savoir comment la solliciter. Utilise la recherche web puis lis les pages utiles.

Fondation : {nom}
IDE : {uid} · siège : {siege} ({canton})
But statutaire (registre du commerce) : {but}

Méthode :
1. Trouve le site OFFICIEL (vérifie que le nom ou l'IDE correspond ; attention aux homonymes).
2. Lis les pages « soutien », « demandes », « critères », « contact », « projets soutenus », le dernier rapport annuel.
3. Remplis la fiche. N'invente rien : si une information n'est pas trouvée, mets null ou une liste vide.
4. Chaque information importante doit venir d'une URL listée dans « sources ».

Interdits :
- N'utilise pas local.ch, search.ch, moneyhouse.ch, easymonitoring.ch, fundraiso.com, spheriq.ch / stiftungschweiz.ch, ni d'autres annuaires commerciaux, ni les réseaux sociaux.
- Distingue bien une fondation qui FINANCE des projets de tiers d'une fondation qui collecte des fonds pour SES propres projets : dans ce cas, accepte_demandes = « non ».
- Pas de données personnelles : pas de nom, e-mail ou téléphone d'une personne privée. Seulement des coordonnées
  institutionnelles (secrétariat, info@…, adresse du siège). Une fonction (« secrétariat du conseil ») suffit.
- Si la fondation déclare ne pas accepter de demandes spontanées, indique-le clairement.

Rédige en français."""


def charger():
    return {f["ehraid"]: f for f in json.loads((RACINE / "data/fondations_ch.json").read_text())}


def enrichir(f, modele, force=False):
    DOSSIER.mkdir(parents=True, exist_ok=True)
    out = DOSSIER / f"{f['ehraid']}.json"
    if out.exists() and not force:
        ancien = json.loads(out.read_text())
        if (datetime.date.today() - datetime.date.fromisoformat(ancien["date"])).days < 90:
            print(f"  déjà enrichie le {ancien['date']} : {f['nom']}"); return ancien
    p = PROMPT.format(nom=f["nom"], uid=f["uid"], siege=f["siege"], canton=f["canton"], but=f["purpose"][:1500])
    cmd = ["claude", "-p", "Suis exactement les instructions reçues sur l'entrée standard.", "--output-format", "json",
           "--json-schema", json.dumps(SCHEMA), "--tools", "WebSearch,WebFetch", "--allowedTools", "WebSearch", "WebFetch",
           "--no-session-persistence", "--model", modele]
    t = time.time()
    r = subprocess.run(cmd, input=p, capture_output=True, text=True, timeout=900)
    try:
        d = json.loads(r.stdout)
    except json.JSONDecodeError:
        print("  réponse illisible :", r.stdout[:300], r.stderr[:300]); return None
    if d.get("is_error") or not d.get("structured_output"):
        msg = d.get("result", "")
        if "login" in msg.lower(): raise SystemExit("CLI Claude non connecté : `claude auth login`.")
        print("  échec :", msg[:300]); return None
    fiche = d["structured_output"]
    for interdit in ("local.ch", "search.ch", "moneyhouse", "easymonitoring", "fundraiso", "spheriq", "stiftungschweiz"):
        fiche["sources"] = [s for s in fiche["sources"] if interdit not in s["url"]]
    fiche.update({"id": f["ehraid"], "nom": f["nom"], "uid": f["uid"], "date": datetime.date.today().isoformat(), "moteur": f"claude CLI ({modele}) + recherche web"})
    out.write_text(json.dumps(fiche, ensure_ascii=False, indent=1))
    try:
        from appui_api import envoyer
        envoyer("fiches", f["ehraid"], fiche)
    except Exception as e:
        print("  envoi au serveur Appui impossible :", e)
    print(f"  {f['nom']} : site {fiche['site_web'] or '—'} · demandes {fiche['demande'].get('accepte_demandes')} · confiance {fiche['confiance']} ({time.time()-t:.0f} s)")
    return fiche


def exporter():
    tous = {}
    for p in sorted(DOSSIER.glob("*.json")):
        x = json.loads(p.read_text()); tous[x["id"]] = x
    (RACINE / "src/data/enrichi.js").write_text("/* Fiches enrichies par scripts/enrichir_fondations.py (recherche web, sources citées). */\nwindow.LEVIER_ENRICHI=" +
                                                json.dumps(tous, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print(f"{len(tous)} fiches enrichies disponibles dans l'application.")


def nouvelles(base, cantons, maxn):
    snaps = sorted((RACINE / "data").glob("ids_*.json"))
    if len(snaps) < 2:
        print("Il faut au moins deux extractions LINDAS (ids_AAAA-MM-JJ.json) pour détecter les nouvelles fondations."); return []
    avant, apres = set(json.loads(snaps[-2].read_text())), set(json.loads(snaps[-1].read_text()))
    neuves = [base[i] for i in apres - avant if i in base]
    neuves = [f for f in neuves if f["canton"] in cantons and f["type"] in ("donatrice_probable", "mixte") and not f["en_liquidation"]]
    print(f"{len(neuves)} nouvelles fondations donatrices ({snaps[-2].stem[4:]} → {snaps[-1].stem[4:]})")
    return neuves[:maxn]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--id"); ap.add_argument("--nom"); ap.add_argument("--client"); ap.add_argument("--top", type=int, default=10)
    ap.add_argument("--nouvelles", action="store_true"); ap.add_argument("--cantons", default="VD,GE,FR,NE,VS,JU"); ap.add_argument("--max", type=int, default=30)
    ap.add_argument("--force", action="store_true"); ap.add_argument("--modele", default="sonnet")
    a = ap.parse_args()
    base = charger()
    cibles = []
    if a.id: cibles = [base[a.id]]
    elif a.nom:
        n = a.nom.lower(); cibles = [f for f in base.values() if n in f["nom"].lower()][:3]
    elif a.client:
        b = json.loads((RACINE / f"data/bot/{a.client}.json").read_text())
        cibles = [base[str(e["id"])] for e in b["resultats"] if e["verdict"] != "ecarter"][:a.top]
    elif a.nouvelles:
        cibles = nouvelles(base, set(a.cantons.split(",")), a.max)
    else:
        ap.error("--id, --nom, --client ou --nouvelles requis")
    print(f"Enrichissement de {len(cibles)} fondation(s), environ 1 à 3 min chacune")
    for f in cibles:
        enrichir(f, a.modele, a.force)
    exporter()


if __name__ == "__main__":
    main()
