#!/usr/bin/env python3
"""Kit de vente Levier : prospectus (FR/DE/EN), baromètre des fondations romandes, présentation de premier rendez-vous.
Les textes du prospectus reprennent ceux de la page publique (scripts/construire_landing.py) pour rester cohérents.
Les chiffres du baromètre sont recalculés à chaque lancement depuis data/fondations_ch.json et data/enrichi/.

    python3 scripts/construire_kit.py            # HTML + PDF (Chrome)
    python3 scripts/construire_kit.py --html     # HTML seulement

Sorties : kit/build/*.html et kit/pdf/AAAA-MM-JJ_*.pdf"""
import collections, datetime, json, subprocess, sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
KIT = RACINE / "kit"
BUILD, PDF = KIT / "build", KIT / "pdf"
AUJ = datetime.date.today()
DATE = AUJ.isoformat()
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Textes de la page publique (une seule source de vérité)
_src = (RACINE / "scripts/construire_landing.py").read_text()
_ns = {"__file__": str(RACINE / "scripts/construire_landing.py")}
exec(_src.split("\ndef langs(")[0], _ns)
T = _ns["T"]

LOGO = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="{bg}"/><path d="M22 16v32h20" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="47" cy="22" r="6" fill="#B8613F"/></svg>'
def logo(light=False):
    return f'<span class="logo{" light" if light else ""}">{LOGO.format(bg="#9C4D2E" if light else "#1F2A44")}<span>levier<b>.</b></span></span>'
CHECK = '<svg class="i" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>'
SHIELD = '<svg class="i" viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>'
SCALE = '<svg class="i" viewBox="0 0 24 24"><path d="M12 3v18M5 7h14M5 7l-3 7a4 4 0 0 0 6 0zM19 7l-3 7a4 4 0 0 0 6 0z"/></svg>'
EMAIL, TEL, SITE = "levier.conseil@gmail.com", "+41 78 845 88 38", "levierconseil.ch"

def page(title, lang, body):
    return (f'<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><title>{title}</title>'
            f'<link rel="stylesheet" href="../src/kit.css"></head><body>{body}</body></html>')

# ---------------------------------------------------------------- Prospectus
K = {
 "fr": dict(tag="Recherche de fonds auprès des fondations suisses", tl=[("Aujourd'hui", "on prépare"), ("Dossier prêt", "carte et lettres"), ("Dépôt", "≈ 4 mois avant"), ("Séance", "2 à 4 par an"), ("Début du projet", "")],
            met_sub="Livrables et dates écrits dans le devis, avant de commencer.", off_note="Montants indicatifs. Devis écrit avant de commencer, honoraires fixes liés au travail, aucun pourcentage.",
            contact="Écrire ou appeler Alexandre Cazes :", file="Prospectus", title="Levier · Prospectus"),
 "de": dict(tag="Fundraising bei Schweizer Stiftungen", tl=[("Heute", "Vorbereitung"), ("Dossier bereit", "Karte und Briefe"), ("Eingabe", "≈ 4 Monate vorher"), ("Sitzung", "2- bis 4-mal pro Jahr"), ("Projektbeginn", "")],
            met_sub="Ergebnisse und Termine stehen ab dem ersten Tag fest.", off_note="Richtpreise, schriftliche Offerte vor Beginn. Festes Honorar nach Aufwand: nie ein Prozentsatz.",
            contact="Schreiben oder rufen Sie uns an:", file="Prospekt", title="Levier · Prospekt"),
 "en": dict(tag="Fundraising from Swiss foundations", tl=[("Today", "we prepare"), ("File ready", "map and letters"), ("Submission", "≈ 4 months ahead"), ("Board meeting", "2 to 4 a year"), ("Project starts", "")],
            met_sub="Deliverables and dates fixed on day one.", off_note="Indicative prices, written quote before we start. Fixed fees based on the work: never a percentage.",
            contact="Write or call us:", file="Brochure", title="Levier · Brochure"),
}

def prospectus(lang):
    t, k = T[lang], K[lang]
    tl = "".join(f'<div class="{"k" if i in (2, 4) else ""}">{a}<small>{b}</small></div>' for i, (a, b) in enumerate(k["tl"]))
    steps = "".join(f'<li><span class="when">{t[f"s{i}_when"]}</span><h3>{t[f"s{i}_t"]}</h3><p>{t[f"s{i}_p"]}</p></li>' for i in range(1, 5))
    p1 = f'''<section class="a4">
  <div class="p-top">{logo()}<span class="tag">{k["tag"]}</span></div>
  <div class="p-hero"><h1>{t["h1"].replace(". ", ".<br>", 1)}</h1><p class="lead">{t["lead"]}</p>
    <div class="checks"><span>{CHECK}{t["check1"]}</span><span>{CHECK}{t["check2"]}</span><span>{CHECK}{t["check3"]}</span></div></div>
  <div class="stats"><div><b>63 h</b><span>{t["stat1"]}</span></div><div><b>42 %</b><span>{t["stat2"]}</span></div><div><b>2–4</b><span>{t["stat3"]}</span></div><p class="src">{t["stat_src"]}</p></div>
  <h2 class="sec-t">{t["pains_t"]}</h2>
  <div class="pains">{"".join(f'<article class="pain"><p class="say">{t[f"pain{i}_say"]}</p><p>{t[f"pain{i}_real"]}</p></article>' for i in (1, 2, 3))}</div>
  <p class="cause">{t["cause"]}</p>
  <div class="urg"><h2>{t["urg_t"]}</h2><p>{t["urg_lead"]}</p><div class="tl">{tl}</div></div>
</section>'''
    p2 = f'''<section class="a4">
  <div class="p2-head"><h2>{t["met_t"]}</h2><span class="muted" style="font-size:8.6pt">{k["met_sub"]}</span></div>
  <ol class="steps">{steps}</ol>
  <h2 class="sec-t">{t["off_t"]}</h2>
  <div class="plans">
    <article class="plan"><h3>{t["p1_t"]}</h3><p class="price">{t["p1_price"]}</p><p>{t["p1_p"]}</p><ul>{t["p1_list"]}</ul></article>
    <article class="plan plan-main"><span class="pill">{t["p2_tag"]}</span><h3>{t["p2_t"]}</h3><p class="price">{t["p2_price"]}</p><p>{t["p2_p"]}</p><ul>{t["p2_list"]}</ul></article>
    <article class="plan"><h3>{t["p3_t"]}</h3><p class="price">{t["p3_price"]}</p><p>{t["p3_p"]}</p><ul>{t["p3_list"]}</ul></article>
  </div>
  <p class="off-note">{k["off_note"]}</p>
  <div class="duo"><div class="box"><h3>{SHIELD}{t["g_t"]}</h3><p>{t["g_p"]}</p></div><div class="box"><h3>{SCALE}{t["eth_t"]}</h3><p>{t["eth_p"]}</p></div></div>
  <div class="qui"><img src="../../landing/assets/alexandre.webp" alt="Alexandre Cazes"><div><h3>{t["qui_t"]}</h3><p>{t["qui_p"]}</p>
    <div class="facts"><span><b>CHF 100'000+</b>{t["qui_f1"]}</span><span><b>100+</b>{t["qui_f2"]}</span><span><b>FR · DE · EN</b>{t["qui_f3"]}</span></div></div></div>
  <div class="cta"><div><h2>{t["fin_t"]}</h2><p>{t["fin_p"]}</p></div><div class="ct"><span>{k["contact"]}</span>{EMAIL}<br>{TEL}<br>{SITE}</div></div>
  <p class="legal">{t["foot_data"]}</p>
</section>'''
    return page(k["title"], lang, p1 + p2)

# ---------------------------------------------------------------- Baromètre
DOM_FR = {"formation_education": "Formation, éducation", "culture_arts": "Culture et arts", "recherche_science": "Recherche, science",
          "sante_medical": "Santé", "enfance_jeunesse": "Enfance, jeunesse", "social_precarite": "Social, précarité",
          "environnement_climat": "Environnement, climat", "cooperation_internationale": "Coopération internationale",
          "innovation_entrepreneuriat": "Innovation, entrepreneuriat", "animaux": "Animaux", "religion": "Religion",
          "patrimoine": "Patrimoine", "handicap": "Handicap", "sport": "Sport", "personnes_agees": "Personnes âgées",
          "egalite_genre": "Égalité", "droits_humains_democratie": "Droits humains, démocratie",
          "migration_integration": "Migration, intégration", "agriculture_alimentation": "Agriculture, alimentation", "medias_journalisme": "Médias"}
CANT = {"GE": "Genève", "VD": "Vaud", "VS": "Valais", "FR": "Fribourg", "NE": "Neuchâtel", "JU": "Jura"}
fmt = lambda n: f"{n:,}".replace(",", "'")

def stats():
    base = json.load(open(RACINE / "data/fondations_ch.json"))
    rom = [f for f in base if f["canton"] in CANT and not f["en_liquidation"]]
    don = [f for f in rom if f["type"] in ("donatrice_probable", "mixte")]
    allemand = sum(1 for f in don if sum(w in f" {(f['purpose'] or '').lower()} " for w in (" der ", " die ", " und ", " des ")) >= 2)
    romid = {f["ehraid"] for f in rom}
    fiches = []
    for p in sorted((RACINE / "data/enrichi").glob("*.json")):
        try:
            x = json.load(open(p))
            if isinstance(x, dict) and x.get("demande") and x.get("id") in romid: fiches.append(x)
        except Exception:
            pass
    return dict(total=len(base), rom=len(rom), don=len(don), cant_rom=collections.Counter(f["canton"] for f in rom),
                cant_don=collections.Counter(f["canton"] for f in don), dom=collections.Counter(d for f in don for d in f["domaines"]),
                portee=collections.Counter(f["portee"] for f in don), allemand=allemand, fiches=fiches,
                liq=sum(1 for f in base if f["canton"] in CANT and f["en_liquidation"]))

def bars(items, total, hl=(), unit=""):
    mx = max(v for _, _, v in items)
    return '<div class="bars">' + "".join(
        f'<div class="bar{" hl" if k in hl else ""}"><span>{lab}</span><div class="tr"><div class="fl" style="width:{100 * v / mx:.1f}%"></div></div>'
        f'<span class="v">{fmt(v)} <small>{round(100 * v / total)} %</small></span></div>' for k, lab, v in items) + "</div>"

def barometre():
    s = stats()
    don, p = s["don"], s["portee"]
    pct = lambda v, n=don: round(100 * v / n)
    loc = p["cantonal"] + p["romandie"]
    intl = p["international"]
    dom = [(k, DOM_FR.get(k, k), v) for k, v in s["dom"].most_common(20)]
    cant = [(c, CANT[c], s["cant_don"][c]) for c in sorted(CANT, key=lambda c: -s["cant_don"][c])]
    F = s["fiches"]; n = len(F)
    fp = lambda c: round(100 * c / n) if n else 0
    site = sum(1 for x in F if x.get("site_web"))
    acc = collections.Counter(x["demande"].get("accepte_demandes", "inconnu") for x in F)
    delais = sum(1 for x in F if x["demande"].get("delais"))
    form = sum(1 for x in F if (x.get("contact") or {}).get("formulaire_url"))
    img = "../../landing/assets/vevey-and-dent-du-midi-geneva-lake.webp"
    c1 = f'''<section class="a4 cover">
  <div class="cover-img" style="background-image:url('{img}')"></div>
  <div class="cover-in"><span class="kick">BAROMÈTRE LEVIER · {AUJ.strftime("%m.%Y")}</span>
    <h1>Les fondations romandes, en chiffres.</h1>
    <p class="lead">Ce que disent les {fmt(s["rom"])} fondations inscrites au registre du commerce dans les six cantons romands, et ce que cela change pour une association qui prépare ses demandes.</p></div>
  <div class="kpis">
    <div class="kpi"><b>{fmt(s["rom"])}</b><span>fondations actives inscrites à Genève, Vaud, Valais, Fribourg, Neuchâtel et Jura</span></div>
    <div class="kpi"><b>{fmt(don)}</b><span>ont un but qui prévoit de soutenir des tiers (classement Levier)</span></div>
    <div class="kpi"><b>{pct(p["non_precise"])} %</b><span>de ces fondations ne précisent aucune zone géographique dans leur but</span></div>
    <div class="kpi"><b>{pct(loc)} %</b><span>seulement nomment un canton ou la Suisse romande dans leur but</span></div>
  </div>
  <div class="toc"><div><b>Où elles sont</b>Les fondations qui soutiennent des projets, canton par canton.</div><div><b>Ce qu'elles financent</b>Vingt domaines repérés dans leurs buts statutaires.</div><div><b>Ce que cela change</b>Cinq enseignements et {len(s["fiches"])} fiches vérifiées sur le site de chaque fondation.</div></div>
  <div class="cover-foot">{logo(light=True)}<span>Données : registre du commerce (OFJ, LINDAS), état au {AUJ.strftime("%d.%m.%Y")}.<br>Image : Vevey et la Dent du Midi, Photochrom, vers 1895, domaine public.</span></div>
</section>'''
    c2 = f'''<section class="a4">
  <div class="b-head">{logo()}<span>Baromètre des fondations romandes · {AUJ.strftime("%m.%Y")}</span></div>
  <div class="b-sec"><h2>Où sont les fondations qui soutiennent des projets</h2>
    <p>Sur {fmt(s["rom"])} fondations romandes actives, {fmt(don)} ({pct(don, s["rom"])} %) ont un but statutaire qui prévoit d'aider des personnes, des projets ou d'autres organisations. Les autres gèrent surtout leur propre institution (école, EMS, musée) ou un patrimoine. Genève et Vaud en réunissent près de deux sur trois.</p>
    {bars(cant, don)}</div>
  <div class="b-sec"><h2>Ce qu'elles financent</h2>
    <p>Domaines repérés dans le but statutaire des {fmt(don)} fondations qui soutiennent des tiers. Une fondation peut couvrir plusieurs domaines : le total dépasse donc le nombre de fondations.</p>
    {bars(dom, don, hl=("enfance_jeunesse", "social_precarite", "culture_arts"))}</div>
  <p class="pad note" style="margin-top:auto;padding-bottom:10mm">Méthode : extraction du registre du commerce (forme juridique « fondation », sans fondations en liquidation), puis classement du texte du but par Levier (soutien à des tiers, domaines, portée géographique). Le classement est automatique : il oriente la recherche, et chaque but retenu est ensuite lu en entier.</p>
</section>'''
    lessons = [
        ("Pour un projet donné, la plupart des fondations ne sont pas une piste.",
         f"{fmt(s['rom'] - don)} fondations romandes sur {fmt(s['rom'])} ne financent pas de projets extérieurs. Parmi les autres, chaque but est un texte libre, sans grille commune. Écrire à toutes, c'est surtout écrire à celles qui ne peuvent pas dire oui."),
        ("La zone géographique filtre d'abord, souvent sans être écrite.",
         f"{pct(p['non_precise'])} % des fondations qui soutiennent des tiers ne nomment aucune zone dans leur but, {pct(intl)} % visent l'international (registre du commerce, classement Levier). Le siège, les projets déjà soutenus et le site disent si un projet lausannois a ses chances."),
        ("La demande se joue d'abord sur le but exact.",
         "Les fondations écartent d'abord ce qui sort de leur but. Citer la phrase qui rejoint votre projet montre que vous l'avez lu, et distingue votre lettre d'un envoi de masse."),
        ("La Suisse romande écrit aussi en allemand.",
         f"{fmt(s['allemand'])} fondations romandes environ qui soutiennent des tiers ont un but rédigé en allemand (Valais et Fribourg surtout). Une lettre en allemand leur évite une traduction."),
        ("Le calendrier compte autant que le dossier.",
         "Plusieurs grandes fondations décident deux à quatre fois par an et veulent le dossier environ quatre mois avant le début du projet. Un projet déjà commencé n'est en général plus financé."),
    ]
    c3 = f'''<section class="a4">
  <div class="b-head">{logo()}<span>Baromètre des fondations romandes · {AUJ.strftime("%m.%Y")}</span></div>
  <div class="b-sec"><h2>Cinq enseignements pour les associations</h2>
    <ol class="lessons">{"".join(f"<li><div><h3>{a}</h3><p>{b}</p></div></li>" for a, b in lessons)}</ol></div>
  <div class="b-sec"><div class="method"><h3>Comment Levier s'en sert</h3>
    <p>Pour chaque projet, Levier part des {fmt(s["total"])} fondations inscrites en Suisse, lit les buts qui correspondent, vérifie sur le site de chaque fondation qu'elle accepte les demandes, son délai et les pièces exigées, puis écrit une lettre pour chacune. L'association relit, signe et envoie.</p></div></div>
  <p class="pad note" style="margin-top:auto;padding-bottom:10mm">Sources du calendrier : règles publiées par la FASC, Leenaards, la Fondation Sandoz et Ernst Göhner ; Grantee Review Report (CEPS, Université de Bâle, et SwissFoundations, données 2019).</p>
</section>'''
    exemple = ""
    ex = RACINE / "data/enrichi/1205902.json"
    if ex.exists():
        x = json.load(open(ex)); d = x["demande"]
        li = lambda L, k: "".join(f"<li>{v}</li>" for v in (L or [])[:k])
        exemple = f'''<div class="b-sec"><div class="fiche a4f"><div class="fh"><b>{x["nom"]}</b><span class="pill pill-ok">Accepte les demandes</span></div>
      <div class="fc"><div><h4>Critères</h4><ul>{li(d.get("criteres"), 4)}</ul></div><div><h4>Échéances 2026</h4><ul>{li(d.get("delais"), 5)}</ul></div>
      <div><h4>Pièces demandées</h4><ul>{li(d.get("documents_requis"), 5)}</ul></div><div><h4>Ce qu'elle refuse</h4><ul>{li(d.get("exclusions"), 4)}</ul></div></div>
      <p class="note" style="margin-top:3mm">Exemple de fiche, vérifiée le {datetime.date.fromisoformat(x["date"]).strftime("%d.%m.%Y")} sur le site de la fondation ({x.get("site_web") or ""}).</p></div></div>'''
    if n:
        c4_pilot = f'''<div class="b-sec"><h2>Ce que montrent {n} fiches vérifiées</h2>
    <p>Levier a vérifié en ligne {n} fondations romandes parmi les plus susceptibles de soutenir des projets (site officiel, conditions, délais). Échantillon choisi, pas tiré au hasard : ces chiffres décrivent ces {n} fondations, pas l'ensemble.</p>
    <div class="big3"><div><b>{fp(n - site)} %</b><span>n'ont aucun site officiel trouvable</span></div>
      <div><b>{fp(acc.get("non", 0))} %</b><span>indiquent ne pas accepter de demandes spontanées</span></div>
      <div><b>{fp(delais)} %</b><span>publient des délais de dépôt</span></div></div>
    <p class="note" style="margin-top:3mm">Accepte les demandes : oui {acc.get("oui", 0)}, non {acc.get("non", 0)}, inconnu {acc.get("inconnu", 0)}. Formulaire en ligne : {form}. Vérification du {AUJ.strftime("%d.%m.%Y")}.</p></div>
  {exemple}
  <div class="b-sec"><div class="method"><h3>Pourquoi c'est important</h3><p>Une fondation sans site ni délai publié n'est pas fermée : elle se contacte par écrit, à son siège, au bon moment. Une fondation qui écrit « pas de demandes spontanées » doit en revanche sortir de la liste. Un extrait du registre du commerce ne le dit pas.</p></div></div>'''
    else:
        c4_pilot = ""
    c4 = f'''<section class="a4">
  <div class="b-head">{logo()}<span>Baromètre des fondations romandes · {AUJ.strftime("%m.%Y")}</span></div>
  {c4_pilot}
  <div class="cta" style="margin-top:auto"><div><h2>Votre projet a-t-il ses fondations ?</h2><p>15 minutes en visio, gratuites. Nous vous disons si des fondations peuvent le financer, et lesquelles regarder en premier.</p></div><div class="ct"><span>Levier · Alexandre Cazes</span>{EMAIL}<br>{TEL}<br>{SITE}</div></div>
  <p class="legal">Ce baromètre peut être librement partagé. Données ouvertes du registre du commerce (OFJ, via LINDAS) ; classement et vérifications : Levier. Aucune donnée personnelle de membres de conseil n'est utilisée.</p>
</section>'''
    return page("Baromètre des fondations romandes", "fr", c1 + c2 + c3 + c4), s

# ---------------------------------------------------------------- Présentation (premier rendez-vous)
def presentation(s):
    t = T["fr"]
    don, p = s["don"], s["portee"]
    pct = lambda v: round(100 * v / don)
    N = [0]
    def sl(cls, inner):
        N[0] += 1
        brand = f'<div class="brand">{logo(light=cls in ("dark", "acc"))}</div>' if N[0] > 1 else ""
        return f'<section class="slide {cls}">{inner}{brand}<span class="num">{N[0]:02d}</span></section>'
    out = []
    out.append(sl("dark s-title", f'''{logo(light=True)}<h1>Financer votre projet par les fondations.</h1>
      <p class="sub">Premier échange · 15 minutes pour savoir si des fondations peuvent le soutenir, et lesquelles.</p>
      <div class="meta"><span>[Nom de l'association]</span><span>[Date]</span></div>'''))
    out.append(sl("", f'''<h2>Trois difficultés, chiffrées par les enquêtes.</h2>
      <div class="grid3">{"".join(f'<div class="tile"><p class="say">{t[f"pain{i}_say"]}</p><p>{t[f"pain{i}_real"]}</p></div>' for i in (1, 2, 3))}</div>'''))
    out.append(sl("dark", f'''<h2>Le coût réel d'une demande.</h2><p class="sub">{t["cause"]}</p>
      <div class="grid3"><div class="tile"><b class="n">63 h</b><p>{t["stat1"]}</p></div><div class="tile"><b class="n">42 %</b><p>{t["stat2"]}</p></div><div class="tile"><b class="n">2–4</b><p>{t["stat3"]}</p></div></div>
      <p class="sub" style="font-size:9pt;margin-top:5mm">{t["stat_src"]}</p>'''))
    out.append(sl("", f'''<h2>{fmt(s["rom"])} fondations romandes. Peu sont pour vous.</h2>
      <p class="sub">{fmt(don)} ont un but qui prévoit de soutenir des tiers. {pct(p["non_precise"])} % ne nomment aucune zone géographique, {pct(p["international"])} % visent l'international. Le travail : trouver les quelques dizaines qui peuvent dire oui.</p>
      <div class="grid4"><div class="tile"><b class="n">{fmt(s["rom"])}</b><p>fondations actives dans les 6 cantons romands</p></div><div class="tile"><b class="n">{fmt(don)}</b><p>soutiennent des tiers selon leur but</p></div><div class="tile"><b class="n">20–30</b><p>retenues pour un projet type</p></div><div class="tile"><b class="n">10</b><p>lettres écrites une par une</p></div></div>'''))
    out.append(sl("", f'''<h2>{t["urg_t"]}</h2><p class="sub">{t["urg_lead"]}</p>
      <div class="dtl"><div>Aujourd'hui<small>on prépare</small></div><div>Dossier prêt<small>carte et lettres</small></div><div class="k">Dépôt<small>≈ 4 mois avant le début</small></div><div>Séance<small>2 à 4 par an</small></div><div class="k">Début du projet<small>&nbsp;</small></div></div>
      <div class="dspan">environ 4 mois, parfois 5</div>'''))
    out.append(sl("", f'''<h2>{t["met_t"]}</h2><p class="sub">{t["met_lead"]}</p>
      <div class="grid4">{"".join(f'<div class="tile"><span class="when">{t[f"s{i}_when"]}</span><h3>{t[f"s{i}_t"]}</h3><p>{t[f"s{i}_p"]}</p></div>' for i in range(1, 5))}</div>'''))
    ex = RACINE / "data/enrichi/1205902.json"
    if ex.exists():
        x = json.load(open(ex)); d = x["demande"]
        li = lambda L, n: "".join(f"<li>{v}</li>" for v in (L or [])[:n])
        out.append(sl("", f'''<h2>Ce que vous recevez : une fiche par fondation.</h2>
      <p class="sub">Pour chacune des 20 à 30 fondations de votre carte : ce qu'elle exige, quand déposer, quelles pièces, ce qu'elle refuse. Exemple réel, vérifié le {datetime.date.fromisoformat(x["date"]).strftime("%d.%m.%Y")} sur le site de la fondation.</p>
      <div class="fiche"><div class="fh"><b>{x["nom"]}</b><span class="pill pill-ok">Accepte les demandes</span><span class="muted">{x.get("site_web") or ""}</span></div>
        <div class="fc"><div><h4>Critères</h4><ul>{li(d.get("criteres"), 4)}</ul></div><div><h4>Échéances</h4><ul>{li(d.get("delais"), 5)}</ul></div>
        <div><h4>Pièces demandées</h4><ul>{li(d.get("documents_requis"), 5)}</ul></div><div><h4>Ce qu'elle refuse</h4><ul>{li(d.get("exclusions"), 4)}</ul></div></div></div>'''))
    out.append(sl("", '''<div class="split" style="margin-top:0;align-items:start;height:100%">
      <div><h2>Une lettre par fondation.</h2><p class="sub">La structure est commune. Le paragraphe surligné est écrit pour cette fondation seulement, à partir de son but, de ce qu'elle a déjà soutenu et de ses critères.</p>
        <p class="sub" style="font-size:11pt">Vous relisez, signez et envoyez. Aucune lettre ne part sans votre signature.</p></div>
      <div class="letter"><p><b>Demande de soutien de CHF 15'000 : dix nouvelles lignes de pédibus scolaires en 2027</b></p><p>Madame, Monsieur,</p>
        <p>Selon ses statuts, votre fondation a pour but de « venir en aide à l'enfance dans le canton de Vaud ». Notre association agit sur ce terrain depuis 2019, à Vevey.</p>
        <p><span class="mark">Votre fondation a soutenu en 2025 des projets de mobilité scolaire à Vevey ; nos lignes de pédibus prolongent ce travail dans les communes voisines.</span></p>
        <p>Le budget total est de CHF 45'000 …</p><p class="muted" style="font-size:8.5pt;font-family:var(--ui)">Extrait d'exemple, association et fondation fictives.</p></div></div>'''))
    qs = [("Quel est le projet, en deux phrases ?", "Ce qu'il change, pour qui, où."), ("Quand commence-t-il ?", "Fixe les dates de dépôt possibles."),
          ("Quel est le budget total, et le montant manquant ?", "Une fondation complète d'autres financements."), ("Qui finance déjà ?", "Commune, canton, Loterie Romande, fonds propres."),
          ("L'association est-elle exonérée d'impôt pour utilité publique ?", "Ernst Göhner, par exemple, l'exige."), ("Avez-vous déjà déposé des demandes ?", "Auprès de qui, avec quelles réponses."),
          ("Statuts, comptes, rapport d'activité : sont-ils à jour ?", "Un dossier incomplet est écarté sans examen."), ("Qui signera les demandes ?", "Présidence ou direction.")]
    out.append(sl("", f'''<h2>Pour aujourd'hui : huit questions.</h2>
      <ol class="qs">{"".join(f"<li><div>{a}<small>{b}</small></div></li>" for a, b in qs)}</ol>'''))
    out.append(sl("", f'''<h2>{t["off_t"]}</h2><p class="sub">{t["off_lead"]}</p>
      <div class="grid3">
        <div class="tile"><h3>{t["p1_t"]}</h3><b class="n" style="font-size:28pt">{t["p1_price"]}</b><p>{t["p1_p"]}</p><ul style="margin-top:3mm;padding-left:5mm;font-size:10pt">{t["p1_list"]}</ul></div>
        <div class="tile" style="background:var(--ink);color:#fff;box-shadow:none"><span class="pill" style="background:#F0B79E;color:var(--ink)">{t["p2_tag"]}</span><h3>{t["p2_t"]}</h3><b class="n" style="font-size:28pt">{t["p2_price"]}</b><p style="color:#C9CEDA">{t["p2_p"]}</p><ul style="margin-top:3mm;padding-left:5mm;font-size:10pt;color:#D6DAE4">{t["p2_list"]}</ul></div>
        <div class="tile"><h3>{t["p3_t"]}</h3><b class="n" style="font-size:28pt">{t["p3_price"]}</b><p>{t["p3_p"]}</p><ul style="margin-top:3mm;padding-left:5mm;font-size:10pt">{t["p3_list"]}</ul></div></div>'''))
    out.append(sl("acc", f'''<h2>{t["g_t"]}.</h2><p class="sub" style="font-size:24pt;line-height:1.35;max-width:270mm;font-family:var(--display)">{t["g_p"]}</p>
      <div class="split"><div><h3 style="font-size:22pt">{t["eth_t"]}</h3><p class="sub" style="font-size:14pt">{t["eth_p"]}</p></div><div></div></div>'''))
    out.append(sl("", f'''<div class="split" style="margin-top:auto;grid-template-columns:70mm 1fr;align-items:center">
      <img src="../../landing/assets/alexandre.webp" alt="Alexandre Cazes" style="width:70mm;height:70mm;border-radius:50%;object-fit:cover">
      <div><h2>{t["qui_t"]}</h2><p class="sub">{t["qui_p"]}</p>
        <div class="grid3" style="margin-top:8mm"><div><b style="font:600 22pt/1 var(--display)">CHF 100'000+</b><p class="muted">{t["qui_f1"]}</p></div><div><b style="font:600 22pt/1 var(--display)">100+</b><p class="muted">{t["qui_f2"]}</p></div><div><b style="font:600 22pt/1 var(--display)">FR · DE · EN</b><p class="muted">{t["qui_f3"]}</p></div></div></div></div>'''))
    out.append(sl("dark", f'''<h2>Prochaines étapes.</h2>
      <ol class="next"><li><b>Sous 48 h</b><span>Devis écrit, avec les heures prévues et les livrables datés.</span></li>
        <li><b>Jour 1</b><span>Vous envoyez budget, statuts, comptes et présentation. Nous fixons les dates de dépôt.</span></li>
        <li><b>Semaine 2</b><span>Carte des financeurs : 20 à 30 fondations, avec délais et pièces.</span></li>
        <li><b>Semaine 4</b><span>Les lettres, prêtes à relire et à signer.</span></li></ol>
      <p class="sub" style="margin-top:8mm">{EMAIL} · {TEL}</p>'''))
    body = "".join(out)
    return page("Levier · Premier rendez-vous", "fr", body)

# ---------------------------------------------------------------- Sortie
def pdf(html_path, pdf_path):
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files",
                    f"--print-to-pdf={pdf_path}", "--virtual-time-budget=4000", html_path.as_uri()],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def main():
    BUILD.mkdir(parents=True, exist_ok=True); PDF.mkdir(parents=True, exist_ok=True)
    docs = []
    for lang in ("fr", "de", "en"):
        docs.append((f"prospectus_{lang}.html", prospectus(lang), f"{DATE}_Levier_{K[lang]['file']}_{lang.upper()}.pdf"))
    bhtml, s = barometre()
    docs.append(("barometre_fr.html", bhtml, f"{DATE}_Levier_Barometre_fondations_romandes.pdf"))
    docs.append(("presentation_fr.html", presentation(s), f"{DATE}_Levier_Presentation_premier_rendez-vous.pdf"))
    for name, html, pdfname in docs:
        (BUILD / name).write_text(html)
        if "--html" not in sys.argv:
            pdf(BUILD / name, PDF / pdfname)
            print("PDF", (PDF / pdfname).relative_to(RACINE))
        else:
            print("HTML", (BUILD / name).relative_to(RACINE))

if __name__ == "__main__":
    main()
