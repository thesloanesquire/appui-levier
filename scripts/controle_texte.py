#!/usr/bin/env python3
"""Contrôle de rédaction française : tics de l'IA, jargon, anglicismes, ponctuation, chiffres sans source.
Utilisation :
    python3 scripts/controle_texte.py landing/index.html kit/build/ docs/positionnement/
    python3 scripts/controle_texte.py --texte "Votre phrase à tester"
    echo "texte" | python3 scripts/controle_texte.py -

Pour .html : le texte visible seulement. Pour .py et .js : le contenu des chaînes de plus de 25 caractères.
Pour .md et .txt : tout le texte. Code de sortie 1 s'il y a des signalements.
Les règles sont expliquées dans .claude/skills/copywriting-fr/references/tics-fr.md ; le moteur d'IA d'Appui
reçoit la même liste (REGLES_REDACTION dans src/app.js)."""
import html, re, sys
from pathlib import Path

# (identifiant, motif, conseil)
REGLES = [
    ("contraste", r"\b(?:ce|c')\s*n[’']est pas\b[^.;:!?]{0,80}[,;]\s*(?:c[’']est|mais)\b|\bnon seulement\b[^.]{0,80}\bmais (?:aussi|également|encore)\b|\bplus qu[’']une?\b[^.]{0,40},\s*une?\b", "Dis directement la chose et sa raison."),
    ("negations", r"\bsans\s+[^,.;]{2,30},\s*sans\s+[^,.;]{2,30}(?:,\s*sans|\s+et\s+sans)", "Liste de négations : dis ce qui se passe."),
    ("ouverture", r"\bdans un monde (?:où|de)\b|\bà l[’']ère (?:de|du|des|numérique)\b|\bdans le paysage\b|\bque vous soyez\b|\bimaginez\b|\bdécouvrez\b|\bplongez\b|\blibérez\b|\bbienvenue dans\b|\bconstante évolution\b", "Ouverture creuse : commence par le fait."),
    ("remplissage", r"\bil est important de (?:noter|souligner|rappeler)\b|\bforce est de constater\b|\bil convient de\b|\bn[’']hésitez pas à\b|\bnous nous réjouissons de\b|\ben conclusion\b|\ben somme\b|\bau final\b", "Formule de remplissage : supprime."),
    ("question-reponse", r"\ble résultat\s?\?|\bla meilleure partie\s?:|\bla vérité\s?:|\bla bonne nouvelle\s?:", "Question qui s'auto-répond : dis le fait."),
    ("passe-partout", r"\b(?:solutions? innovantes?|approche (?:unique|innovante|holistique)|accompagnement (?:sur mesure|personnalisé)|clés? en main|tout-en-un|au c(?:œ|oe)ur de|pierre angulaire|synergies?|écosystèmes?|holistique|incontournables?|véritables?|expertise|savoir-faire|professionnalisme|dynamis(?:er|ons|ez)|booster?|pérenniser|fédérer|de pointe|performants?)\b", "Mot passe-partout : remplace par le fait qu'il cache."),
    ("levier-figure", r"\b(?:un|le|votre|notre) levier (?:pour|de croissance|stratégique)\b", "« Levier » est le nom de l'agence, pas une figure."),
    ("superlatif", r"\b(?:le meilleur|la meilleure|les meilleurs|unique en suisse|numéro un|n°\s?1|exceptionnel(?:le)?s?|révolutionnaire|inégalé|sans précédent|garanti(?:e|s)? à 100)\b", "Superlatif sans preuve : un chiffre sourcé ou rien."),
    ("anglicisme", r"\badress(?:er|e|ons|ez) (?:un|le|ce|cet|vos?|les|ces) (?:problème|enjeu|défi|besoin|sujet)s?\b|\bsupporte(?:r|ons|z)? (?:un|le|ce|votre|vos|les) projets?\b|\bréalis(?:er|ons|ez) que\b|\bimpact(?:er|e|ons|ez)\b|\bdeadlines?\b|\bfeedbacks?\b|\bchallenges?\b|\bonboarding\b|\bkick-?off\b|\bleads?\b|\bcalls?\b(?! to)|\bmeetings?\b|\bopportunités?\b|\bdéfinitivement\b", "Anglicisme ou calque : voir tics-fr.md."),
    ("tiret-long", r"—", "Tiret long : virgule, point ou deux-points."),
    ("exclamation", r"!(?!\s*[<\)\]\"'])", "Point d'exclamation : retire-le."),
    ("emoji", "[\U0001F300-\U0001FAFF☀-➿]", "Pas d'emoji."),
    ("guillemets-droits", r"(?<![=\w])\"[A-ZÀ-Ý][^\"\n]{12,120}\"", "Guillemets français « » avec espaces insécables."),
    ("espace-avant", r"\S[ ]?[:;!?»](?=\s|$)(?<![   ][:;!?»])(?<!\d:)(?<!https:)(?<!http:)", None),  # désactivé (voir plus bas)
]
REGLES = [r for r in REGLES if r[2]]

# Chiffres : un pourcentage ou un « x fois » sans source proche est signalé.
RE_CHIFFRE = re.compile(r"\b\d+(?:[.,]\d+)?\s?%|\b\d+\s?(?:fois|x)\b|\b(?:taux|dizaines?|centaines?|milliers?) de (?:réussite|succès|demandes? acceptées?)\b", re.I)
RE_SOURCE = re.compile(r"source|rapport|étude|registre|loterie|ofs|lindas|swissfoundations|ceps|zewo|données|selon|d'après|https?://|\(\d{4}\)|20\d\d", re.I)

def texte_html(s):
    s = re.sub(r"(?is)<(script|style).*?</\1>", " ", s)
    s = re.sub(r"(?s)<!--.*?-->", " ", s)
    s = re.sub(r"(?i)<br\s*/?>|</(p|li|h\d|div|section|article|summary|td|tr|figcaption)>", "\n", s)
    return html.unescape(re.sub(r"<[^>]+>", " ", s))

def textes_chaines(s):
    out = []
    for m in re.finditer(r"\"((?:[^\"\\\n]|\\.){25,})\"|'((?:[^'\\\n]|\\.){25,})'|`([^`]{25,})`", s):
        t = m.group(1) or m.group(2) or m.group(3)
        if re.search(r"[a-zàâçéèêëîïôûù]{3,} [a-zàâçéèêëîïôûù]{3,} [a-zàâçéèêëîïôûù]{3,}", t, re.I) and not re.search(r"[{}]|=>|\)\s*;|\.\w+\(|\bconst\b|\blet\b|\bfunction\b|&&|\|\|", t):
            out.append((s.count("\n", 0, m.start()) + 1, t))
    return out

def langue(contenu):
    m = re.search(r"<html[^>]*\blang=[\"']?(\w+)", contenu)
    return m.group(1).lower() if m else "fr"

def lignes(chemin, contenu):
    ext = chemin.suffix.lower()
    if ext in (".html", ".htm") and langue(contenu) != "fr":
        return []
    if ext in (".html", ".htm"):
        return [(i + 1, l) for i, l in enumerate(texte_html(contenu).splitlines())]
    if ext in (".py", ".js"):
        return textes_chaines(contenu)
    return [(i + 1, l) for i, l in enumerate(contenu.splitlines())]

def controler(items, nom):
    res = []
    contexte = [re.sub(r"\s+", " ", l) for _, l in items]
    code = nom.endswith((".py", ".js"))
    for k, (n, l) in enumerate(items):
        t = re.sub(r"\s+", " ", l.replace("\\n", " ")).strip()
        if len(t) < 8:
            continue
        for ident, motif, conseil in REGLES:
            if code and ident in ("guillemets-droits", "exclamation", "anglicisme"):
                continue
            for m in re.finditer(motif, t, re.I):
                a = max(0, m.start() - 30); b = min(len(t), m.end() + 30)
                res.append((nom, n, ident, t[a:b], conseil))
        for m in RE_CHIFFRE.finditer(t):
            voisin = " ".join(contexte[max(0, k - 4):k + 5])
            if len(t) >= 40 and not RE_SOURCE.search(voisin):
                res.append((nom, n, "chiffre-sans-source", t[max(0, m.start() - 30):m.end() + 30], "Chiffre : ajoute la source et la date à côté."))
    return res

def fichiers(args):
    ext = {".html", ".htm", ".md", ".txt", ".py", ".js"}
    for a in args:
        p = Path(a)
        if p.is_dir():
            for f in sorted(p.rglob("*")):
                if f.suffix.lower() in ext and not any(x in f.parts for x in ("node_modules", ".git", "data", "_archive", "archive", "fonts", "assets")):
                    yield f
        elif p.exists():
            yield p
        else:
            print(f"introuvable : {a}", file=sys.stderr)

def main():
    a = sys.argv[1:]
    if not a:
        print(__doc__); return 2
    res = []
    if a[0] == "--texte":
        res = controler([(1, " ".join(a[1:]))], "texte")
    elif a[0] == "-":
        res = controler([(i + 1, l) for i, l in enumerate(sys.stdin.read().splitlines())], "stdin")
    else:
        for f in fichiers(a):
            res += controler(lignes(f, f.read_text(errors="ignore")), str(f))
    par = {}
    for nom, n, ident, extrait, conseil in res:
        print(f"{nom}:{n}  [{ident}]  …{extrait}…\n    {conseil}")
        par[ident] = par.get(ident, 0) + 1
    if res:
        print("\n" + str(len(res)) + " signalement(s) : " + ", ".join(f"{k} {v}" for k, v in sorted(par.items(), key=lambda x: -x[1])))
        return 1
    print("Aucun signalement.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
