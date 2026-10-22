#!/usr/bin/env python3
"""Lit le site d'un client (page d'accueil + pages « à propos », « projets », « mission ») et
affiche le texte à coller dans Levier > Nouveau client, puis les 15 fondations les mieux classées.

Usage : python3.12 analyser_site.py https://www.association.ch [VD]

Respecte robots.txt, 1 requête par seconde, 8 pages au plus. Aucun envoi de données à un tiers.
Phase 2 : remplacer le classement par mots-clés par le moteur Infomaniak (docs/…Architecture…).
"""
import json, re, sys, time, urllib.parse, urllib.request, urllib.robotparser
from html.parser import HTMLParser
from pathlib import Path

UA = "Levier-analyse-site/0.1"
MOTS = re.compile(r"propos|about|mission|projet|qui-sommes|histoire|association|actions|programme|equipe|team", re.I)


class Texte(HTMLParser):
    def __init__(self):
        super().__init__(); self.out, self.liens, self._skip = [], [], 0
    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "noscript", "nav", "footer", "svg"): self._skip += 1
        if tag == "a":
            href = dict(attrs).get("href")
            if href: self.liens.append(href)
    def handle_endtag(self, tag):
        if tag in ("script", "style", "noscript", "nav", "footer", "svg") and self._skip: self._skip -= 1
    def handle_data(self, d):
        if not self._skip and d.strip(): self.out.append(d.strip())


def lire(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode(r.headers.get_content_charset() or "utf-8", "replace")


def collecter(base, max_pages=8):
    """Texte public du site : accueil + pages « à propos / mission / projets », robots.txt respecté."""
    base = base.rstrip("/")
    rp = urllib.robotparser.RobotFileParser(base + "/robots.txt")
    try: rp.read()
    except Exception: pass
    vus, a_lire, textes = set(), [base], []
    while a_lire and len(vus) < max_pages:
        url = a_lire.pop(0)
        if url in vus or ((rp.default_entry or rp.entries) and not rp.can_fetch(UA, url)):
            continue
        vus.add(url)
        try:
            p = Texte(); p.feed(lire(url))
        except Exception as e:
            print("illisible :", url, e, file=sys.stderr); continue
        textes.append(" ".join(p.out))
        for h in p.liens:
            u = urllib.parse.urljoin(url, h).split("#")[0].rstrip("/")
            if u.startswith(base) and MOTS.search(u) and u not in vus and u not in a_lire:
                a_lire.append(u)
        time.sleep(1)
    return re.sub(r"\s+", " ", " ".join(textes))[:12000]


def main():
    base = sys.argv[1].rstrip("/")
    canton = sys.argv[2] if len(sys.argv) > 2 else ""
    texte = collecter(base)
    print("=== Texte à coller dans « Présentation du client » ===\n")
    print(texte[:3000], "\n")

    data = Path(__file__).resolve().parent.parent / "data/fondations_ch.json"
    if not data.exists():
        print("Base absente : lancer lindas_fondations.py"); return
    F = [f for f in json.loads(data.read_text()) if f["type"] not in ("prevoyance", "operationnelle") and not f["en_liquidation"]]
    norm = lambda s: re.sub(r"[̀-ͯ]", "", __import__("unicodedata").normalize("NFD", s.lower()))
    mots = {w[:7] for w in re.findall(r"[a-z]{5,}", norm(texte))}
    res = []
    for f in F:
        com = mots & {w[:7] for w in re.findall(r"[a-z]{5,}", norm(f["purpose"]))}
        s = len(com) + (4 if canton and f["canton"] == canton else 0)
        if s: res.append((s, f["nom"], f["canton"], sorted(com)[:6]))
    res.sort(reverse=True)
    print("=== 15 premières fondations (pré-classement grossier) ===")
    for s, n, c, com in res[:15]:
        print(f"{s:3d}  {n} ({c})  ·  {', '.join(com)}")


if __name__ == "__main__":
    main()
