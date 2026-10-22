#!/usr/bin/env python3
"""Bot Levier : détermine les critères d'un client et va chercher les bonnes fondations.

Étapes
  1. Lecture du site du client (pages d'accueil, « à propos », « projets »…), robots.txt respecté.
  2. IA : profil du client + critères de recherche (domaines, mots-clés FR/DE, zone, exclusions).
  3. Recherche locale dans la base des 14'980 fondations (registre du commerce, LINDAS).
  4. IA : évaluation de chaque candidate (score, raisons, risques, citation exacte du but, angle de lettre).
     Une citation qui n'est pas mot pour mot dans le but est rejetée (anti-invention).
  5. Sorties : data/bot/<client>.json, rapport .md, et src/data/bot.js lu par l'application.

Moteurs IA
  --moteur infomaniak  (défaut si configuré) AI Services Infomaniak, données traitées en Suisse. Variables dans Levier/.env :
                       INFOMANIAK_TOKEN, INFOMANIAK_PRODUCT_ID, INFOMANIAK_MODEL (défaut Qwen/Qwen3.5-397B-A17B-FP8 ;
                       repli stable : mistralai/Mistral-Small-4-119B-2603)
  --moteur claude      CLI Claude Code en mode non interactif. Prérequis : `claude auth login` une fois.

Exemples
  python3.12 bot_fondations.py --url https://www.association.ch --nom "Association X" --canton VD
  python3.12 bot_fondations.py --texte presentation.txt --nom "Léa M." --canton GE --type etudiant
  python3.12 bot_fondations.py --tous          # relance tous les clients déjà analysés (veille hebdo)

Données envoyées à l'IA : texte public du site du client et buts statutaires publics. Rien d'autre.
"""
import argparse, datetime, json, os, re, subprocess, sys, time, unicodedata
from pathlib import Path

ICI = Path(__file__).resolve().parent
RACINE = ICI.parent
sys.path.insert(0, str(ICI))

DOMAINES = ["social_precarite", "enfance_jeunesse", "personnes_agees", "handicap", "sante_medical", "recherche_science",
            "formation_education", "culture_arts", "patrimoine", "environnement_climat", "animaux", "sport",
            "cooperation_internationale", "migration_integration", "religion", "innovation_entrepreneuriat",
            "droits_humains_democratie", "egalite_genre", "agriculture_alimentation", "medias_journalisme"]
ROMANDS = {"VD", "GE", "NE", "FR", "VS", "JU"}

# ---------------------------------------------------------------- schémas de sortie
SCHEMA_CRITERES = {
    "type": "object", "required": ["profil", "criteres"],
    "properties": {
        "profil": {"type": "object", "required": ["nom", "type", "mission", "description", "canton", "ville", "langue", "projet"],
            "properties": {
                "nom": {"type": "string"}, "type": {"type": "string", "enum": ["association", "startup", "etudiant", "consultant", "autre"]},
                "mission": {"type": "string"}, "description": {"type": "string"}, "canton": {"type": "string"}, "ville": {"type": "string"},
                "langue": {"type": "string", "enum": ["fr", "de", "it", "en"]}, "fondee": {"type": ["integer", "null"]},
                "preuves": {"type": "array", "items": {"type": "string"}},
                "projet": {"type": "object", "required": ["titre", "resume"], "properties": {
                    "titre": {"type": "string"}, "resume": {"type": "string"}, "beneficiaires": {"type": "string"},
                    "montant_estime": {"type": ["integer", "null"]}}}}},
        "criteres": {"type": "object", "required": ["domaines", "mots_cles_fr", "mots_cles_de", "zone", "beneficiaires", "exclusions", "justification"],
            "properties": {
                "domaines": {"type": "array", "items": {"type": "string", "enum": DOMAINES}},
                "mots_cles_fr": {"type": "array", "items": {"type": "string"}},
                "mots_cles_de": {"type": "array", "items": {"type": "string"}},
                "zone": {"type": "object", "required": ["cantons", "romandie", "suisse", "international"], "properties": {
                    "cantons": {"type": "array", "items": {"type": "string"}}, "romandie": {"type": "boolean"},
                    "suisse": {"type": "boolean"}, "international": {"type": "boolean"}}},
                "beneficiaires": {"type": "array", "items": {"type": "string"}},
                "exclusions": {"type": "array", "items": {"type": "string"}},
                "justification": {"type": "string"}}}}}

SCHEMA_EVAL = {
    "type": "object", "required": ["evaluations"],
    "properties": {"evaluations": {"type": "array", "items": {"type": "object",
        "required": ["id", "score", "verdict", "raisons", "risques", "citation", "angle_lettre"],
        "properties": {"id": {"type": "string"}, "score": {"type": "integer", "minimum": 0, "maximum": 100},
            "verdict": {"type": "string", "enum": ["prioritaire", "possible", "ecarter"]},
            "raisons": {"type": "array", "items": {"type": "string"}}, "risques": {"type": "array", "items": {"type": "string"}},
            "citation": {"type": "string"}, "angle_lettre": {"type": "string"}}}}}}

PROMPT_CRITERES = """Tu es chargé·e de recherche de fonds chez Levier, agence romande qui sollicite des fondations suisses
pour ses clients. À partir du texte public du site d'un client, établis son profil et les critères qui
permettront de trouver les fondations susceptibles de le financer.

Règles :
- N'invente rien : chaque élément du profil vient du texte. Si une information manque, laisse une chaîne vide ou null.
- mission : une phrase, en français, telle qu'elle pourrait figurer dans une lettre à une fondation.
- domaines : uniquement parmi ces codes : {domaines}.
- mots_cles_fr et mots_cles_de : 12 à 20 termes chacun, ceux qu'une fondation emploierait dans SON but statutaire
  pour décrire ce type de projet (synonymes, termes institutionnels, publics), pas le jargon du client.
- zone : cantons où le client agit ; romandie/suisse/international selon la portée réelle du projet.
- exclusions : types de fondations à éviter (ex. confessionnelles si le client est laïque) ; liste vide si aucune.
- justification : 3 phrases maximum expliquant la stratégie de recherche.

Client : {nom} · type indiqué : {type} · canton indiqué : {canton}
Notes de l'agence : {notes}

Texte du site (extrait) :
<<<
{texte}
>>>"""

PROMPT_EVAL = """Tu évalues des fondations suisses pour un client de Levier (agence de recherche de fonds).
Pour CHAQUE fondation de la liste, donne :
- score 0-100 : probabilité qu'elle finance CE projet (but compatible, zone, type de bénéficiaires, fondation donatrice).
- verdict : prioritaire (score ≥ 75), possible (50-74), ecarter (< 50).
- raisons : 1 à 3 raisons concrètes, chacune reliée au but de la fondation.
- risques : 0 à 2 risques (zone, but trop large, fondation qui gère sa propre institution, langue…).
- citation : un passage COPIÉ MOT POUR MOT du but de la fondation (15 à 40 mots) qui justifie le mieux le lien.
  Ne reformule pas, ne corrige pas. Si rien ne justifie, cite le début du but.
- angle_lettre : une phrase indiquant comment ouvrir la lettre à cette fondation (le lien à mettre en avant).
Sois exigeant·e : une fondation dont le but ne mentionne ni le domaine ni le public du client ne dépasse pas 45.

Profil du client :
{profil}

Critères :
{criteres}

Fondations à évaluer (id, nom, canton, siège, [autorité de surveillance], but). Une fondation classée « Soutien financier » par l'As-So finance des tiers ; « Hôpitaux - Foyers » ou « Logements » gère surtout sa propre institution :
{candidats}"""


# ---------------------------------------------------------------- moteurs IA
def env():
    f = RACINE / ".env"
    if f.exists():
        for l in f.read_text().splitlines():
            if "=" in l and not l.strip().startswith("#"):
                k, v = l.split("=", 1); os.environ.setdefault(k.strip(), v.strip().strip('"'))


def ia(prompt, schema, moteur, modele):
    if moteur == "claude":
        cmd = ["claude", "-p", "Suis exactement les instructions reçues sur l'entrée standard et réponds au format demandé.",
               "--output-format", "json", "--json-schema", json.dumps(schema), "--tools", "",
               "--no-session-persistence", "--model", modele or "sonnet"]
        r = subprocess.run(cmd, input=prompt, capture_output=True, text=True, timeout=600)
        try:
            d = json.loads(r.stdout)
        except json.JSONDecodeError:
            raise SystemExit(f"Réponse illisible du CLI Claude :\n{r.stdout[:500]}\n{r.stderr[:500]}")
        if d.get("is_error"):
            msg = d.get("result", "")
            if "login" in msg.lower():
                raise SystemExit("Le CLI Claude n'est pas connecté. Ouvre un terminal, tape `claude`, puis /login (une seule fois).")
            raise SystemExit("Erreur du CLI Claude : " + msg)
        out = d.get("structured_output")
        if out is None:
            m = re.search(r"\{.*\}", d.get("result", ""), re.S)
            out = json.loads(m.group(0)) if m else None
        return out
    if moteur == "infomaniak":
        import urllib.request
        env()
        tok, pid = os.environ.get("INFOMANIAK_TOKEN"), os.environ.get("INFOMANIAK_PRODUCT_ID")
        if not tok or not pid:
            raise SystemExit("INFOMANIAK_TOKEN et INFOMANIAK_PRODUCT_ID manquent dans Levier/.env")
        body = {"model": modele or os.environ.get("INFOMANIAK_MODEL", "Qwen/Qwen3.5-397B-A17B-FP8"),
                "messages": [{"role": "system", "content": "Réponds uniquement par un objet JSON conforme à ce schéma : " + json.dumps(schema)},
                             {"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"}, "temperature": 0.2}
        req = urllib.request.Request(f"https://api.infomaniak.com/2/ai/{pid}/openai/v1/chat/completions",
                                     data=json.dumps(body).encode(), headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=300) as r:
            return json.loads(json.load(r)["choices"][0]["message"]["content"])
    raise SystemExit("moteur inconnu : " + moteur)


# ---------------------------------------------------------------- recherche locale
norm = lambda s: unicodedata.normalize("NFD", (s or "").lower()).encode("ascii", "ignore").decode()
racine = lambda w: norm(w)[:7]


def charger_base():
    data = RACINE / "data/fondations_ch.json"
    if not data.exists():
        raise SystemExit("Base absente : lancer d'abord scripts/lindas_fondations.py")
    return [f for f in json.loads(data.read_text()) if f["type"] != "prevoyance" and not f["en_liquidation"]]


ETRANGER = re.compile(r"\b(pays en developpement|tiers.monde|afrique|asie|amerique|inde|haiti|monde entier|a travers le monde|a l.etranger|international|ausland|entwicklungslander|weltweit)\b")
_IDF = {}


def prefiltre(base, crit, canton, n):
    import math
    toks_all = [{racine(t) for t in re.findall(r"[a-z]{4,}", norm(f["nom"] + " " + f["purpose"]))} for f in base]
    if not _IDF:
        from collections import Counter
        df = Counter(w for t in toks_all for w in t)
        _IDF.update({w: math.log((len(base) + 1) / (c + 1)) for w, c in df.items()})
    mots = {}
    for w in crit["mots_cles_fr"] + crit["mots_cles_de"]:
        for t in re.findall(r"[a-z]{4,}", norm(w)):
            r = racine(t)
            if len(r) >= 5: mots[r] = _IDF.get(r, 0)
    excl = [racine(t) for e in crit.get("exclusions", []) for t in re.findall(r"[a-z]{6,}", norm(e))]
    zc = set(crit["zone"].get("cantons") or []) | ({canton} if canton else set())
    intl = crit["zone"].get("international")
    res = []
    for f, toks in zip(base, toks_all):
        kw = sum(v for m, v in mots.items() if m in toks)
        dom = len(set(crit["domaines"]) & set(f["domaines"]))
        if kw < 2 and not dom:
            continue
        s = kw * 1.4 + dom * 4
        if f["canton"] in zc: s += 5
        elif crit["zone"].get("romandie") and f["canton"] in ROMANDS: s += 3
        if f["portee"] == "cantonal" and f["canton"] not in zc: s -= 6
        if not intl and (f["portee"] == "international" or ETRANGER.search(norm(f["purpose"]))) and not re.search(r"\bsuisse|schweiz", norm(f["purpose"])):
            s -= 14
        ast = " ".join(f.get("asso_types") or [])
        if "Soutien financier" in ast: s += 6
        if f["type"] == "donatrice_probable": s += 4
        elif f["type"] == "operationnelle": s -= 8
        if any(e in toks for e in excl): s -= 6
        if len(f["domaines"]) > 6: s -= 4
        res.append((s, f))
    res.sort(key=lambda x: -x[0])
    return [f for _, f in res[:n]]


def citation_ok(cit, but):
    c, b = re.sub(r"\s+", " ", norm(cit)).strip(" .…«»\"'"), re.sub(r"\s+", " ", norm(but))
    return len(c) > 12 and c in b


# ---------------------------------------------------------------- pipeline
def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", norm(s)).strip("-")[:40] or "client"


def analyser(a):
    texte = ""
    if a.texte:
        texte = Path(a.texte).read_text()
    if a.url:
        from analyser_site import collecter
        texte = collecter(a.url) + "\n" + texte
    if len(texte.strip()) < 200:
        raise SystemExit("Pas assez de texte sur le client (200 caractères minimum). Ajoute --texte fichier.txt.")
    print(f"1/4 Texte du client : {len(texte)} caractères", flush=True)

    p = PROMPT_CRITERES.format(domaines=", ".join(DOMAINES), nom=a.nom or "?", type=a.type or "?", canton=a.canton or "?",
                               notes=a.notes or "aucune", texte=texte[:12000])
    t = time.time(); out = ia(p, SCHEMA_CRITERES, a.moteur, a.modele)
    profil, crit = out["profil"], out["criteres"]
    if a.nom: profil["nom"] = a.nom
    if a.canton: profil["canton"] = a.canton
    print(f"2/4 Critères établis en {time.time()-t:.0f} s : {', '.join(crit['domaines'])} · {len(crit['mots_cles_fr'])}+{len(crit['mots_cles_de'])} mots-clés", flush=True)

    base = charger_base()
    cands = prefiltre(base, crit, profil.get("canton"), a.candidats)
    print(f"3/4 Recherche : {len(cands)} candidates retenues sur {len(base)} fondations", flush=True)

    evals, idx = [], {f["ehraid"]: f for f in cands}
    for i in range(0, len(cands), a.lot):
        lot = cands[i:i + a.lot]
        liste = "\n".join(f"- id={f['ehraid']} | {f['nom']} | {f['canton']} | {f['siege']}" + (" | surveillance fédérale" if f.get("asf") else "") +
                          (" | As-So : " + ", ".join(f["asso_types"]) if f.get("asso_types") else "") + f" | {f['purpose'][:900]}" for f in lot)
        p = PROMPT_EVAL.format(profil=json.dumps(profil, ensure_ascii=False), criteres=json.dumps(crit, ensure_ascii=False), candidats=liste)
        t = time.time(); r = ia(p, SCHEMA_EVAL, a.moteur, a.modele)
        for e in r["evaluations"]:
            f = idx.get(str(e["id"]))
            if not f: continue
            e["citation_verifiee"] = citation_ok(e["citation"], f["purpose"])
            if not e["citation_verifiee"]:
                e["risques"].append("Citation proposée par l'IA introuvable dans le but : remplacée par le début du but")
                e["citation"] = f["purpose"][:220]
            e.update({"nom": f["nom"], "canton": f["canton"], "siege": f["siege"], "uid": f["uid"]})
            evals.append(e)
        print(f"4/4 Évaluation {min(i + a.lot, len(cands))}/{len(cands)} ({time.time()-t:.0f} s)", flush=True)

    evals.sort(key=lambda e: -e["score"])
    slug = a.id or slugify(profil["nom"])
    res = {"id": slug, "date": datetime.date.today().isoformat(), "moteur": a.moteur, "modele": a.modele or "défaut",
           "source": {"url": a.url, "texte": bool(a.texte)}, "profil": profil, "criteres": crit, "resultats": evals,
           "args": {k: v for k, v in vars(a).items() if k in ("url", "texte", "nom", "canton", "type", "notes")}}
    sortir(res)
    return res


def sortir(res):
    d = RACINE / "data/bot"; d.mkdir(parents=True, exist_ok=True)
    (d / f"{res['id']}.json").write_text(json.dumps(res, ensure_ascii=False, indent=1))
    pr = [e for e in res["resultats"] if e["verdict"] == "prioritaire"]
    md = [f"# {res['profil']['nom']} : fondations proposées par le bot ({res['date']})", "",
          f"**Mission** : {res['profil']['mission']}", "", f"**Stratégie** : {res['criteres']['justification']}", "",
          f"**Domaines** : {', '.join(res['criteres']['domaines'])}", "",
          f"{len(pr)} prioritaires, {sum(e['verdict']=='possible' for e in res['resultats'])} possibles, moteur {res['moteur']}.", ""]
    for e in res["resultats"]:
        if e["verdict"] == "ecarter": continue
        md += [f"## {e['score']} · {e['nom']} ({e['canton']})", f"> [ {e['citation']} ]", "",
               *[f"- + {x}" for x in e["raisons"]], *[f"- − {x}" for x in e["risques"]], f"- Angle : {e['angle_lettre']}", ""]
    (d / f"{res['id']}.md").write_text("\n".join(md))
    tous = {}
    for f in sorted(d.glob("*.json")):
        x = json.loads(f.read_text()); tous[x["id"]] = x
    (RACINE / "src/data/bot.js").write_text("/* Généré par scripts/bot_fondations.py. */\nwindow.LEVIER_BOT=" +
                                            json.dumps(tous, ensure_ascii=False, separators=(",", ":")) + ";\n")
    try:
        from appui_api import envoyer
        if envoyer("analyses", res["id"], res): print("Analyse envoyée sur le serveur Appui (visible par toute l'équipe).")
    except Exception as e:
        print("Envoi au serveur Appui impossible :", e)
    print(f"\nTerminé : {len(pr)} fondations prioritaires. Rapport : data/bot/{res['id']}.md · visible dans l'application (onglet Fondations du client).")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--url"); ap.add_argument("--texte"); ap.add_argument("--nom"); ap.add_argument("--canton")
    ap.add_argument("--type", choices=["association", "startup", "etudiant", "consultant", "autre"])
    ap.add_argument("--notes", help="consignes de l'agence (ex. pas de fondations confessionnelles)")
    ap.add_argument("--id", help="identifiant du client dans l'application")
    env()
    defaut = "infomaniak" if os.environ.get("INFOMANIAK_TOKEN") and os.environ.get("INFOMANIAK_PRODUCT_ID") else "claude"
    ap.add_argument("--moteur", default=defaut, choices=["claude", "infomaniak"], help=f"défaut ici : {defaut}"); ap.add_argument("--modele")
    ap.add_argument("--candidats", type=int, default=60); ap.add_argument("--lot", type=int, default=15)
    ap.add_argument("--tous", action="store_true", help="relancer tous les clients de data/bot")
    a = ap.parse_args()
    if a.tous:
        for f in sorted((RACINE / "data/bot").glob("*.json")):
            x = json.loads(f.read_text()); args = x.get("args", {})
            print(f"\n=== {x['id']} ===")
            ns = ap.parse_args([]); vars(ns).update({k: v for k, v in args.items() if v}); ns.id = x["id"]; ns.moteur = a.moteur; ns.modele = a.modele
            analyser(ns)
        return
    if not (a.url or a.texte):
        ap.error("--url ou --texte requis")
    analyser(a)


if __name__ == "__main__":
    main()
