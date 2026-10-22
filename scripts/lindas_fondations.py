#!/usr/bin/env python3
"""Base nationale des fondations depuis LINDAS (registre du commerce en open data, OFJ).

Licence des données : OGD « Open use. Must provide the source » — citer « Registre du
commerce (Zefix), OFJ, via LINDAS ». Aucun compte, aucun scraping.

Usage : python3.12 lindas_fondations.py   → data/fondations_ch.json, data/fondations_ch.csv,
                                              src/data/fondations.js (pour l'application)
"""
import json, csv, time, urllib.request, urllib.parse, datetime
from collections import Counter
from pathlib import Path
from zefix_fondations import classer, DOMAINES, PORTEE
import re

RACINE = Path(__file__).resolve().parent.parent
ENDPOINT = "https://lindas.admin.ch/query"
CANTONS = {1:"ZH",2:"BE",3:"LU",4:"UR",5:"SZ",6:"OW",7:"NW",8:"GL",9:"ZG",10:"FR",11:"SO",12:"BS",13:"BL",
           14:"SH",15:"AR",16:"AI",17:"SG",18:"GR",19:"AG",20:"TG",21:"TI",22:"VD",23:"VS",24:"NE",25:"GE",26:"JU"}
REQUETE = """
PREFIX schema: <http://schema.org/>
SELECT ?s ?nom ?but ?uid ?commune ?canton WHERE {
  GRAPH <https://lindas.admin.ch/foj/zefix> {
    ?s schema:additionalType <https://ld.admin.ch/ech/97/legalforms/0110> ;
       schema:legalName ?nom .
    OPTIONAL { ?s schema:description ?but }
    OPTIONAL { ?s schema:identifier ?uid . FILTER(CONTAINS(STR(?uid), "/UID/")) }
    OPTIONAL { ?s <https://schema.ld.admin.ch/municipality> ?m }
  }
  OPTIONAL { ?m schema:name ?commune ; schema:containedInPlace ?canton .
             FILTER(STRSTARTS(STR(?canton), "https://ld.admin.ch/canton/")) }
} ORDER BY ?s LIMIT %d OFFSET %d
"""


def sparql(q):
    data = urllib.parse.urlencode({"query": q}).encode()
    req = urllib.request.Request(ENDPOINT, data=data, headers={
        "Accept": "application/sparql-results+json", "User-Agent": "Levier-fondations/0.1"})
    with urllib.request.urlopen(req, timeout=180) as r:
        return json.load(r)["results"]["bindings"]


def main():
    lignes, off, pas = {}, 0, 5000
    while True:
        lot = sparql(REQUETE % (pas, off))
        for b in lot:
            s = b["s"]["value"]
            uid = b.get("uid", {}).get("value", "").rsplit("/", 1)[-1]
            cid = b.get("canton", {}).get("value", "").rsplit("/", 1)[-1]
            lignes[s] = {
                "ehraid": s.rsplit("/", 1)[-1],
                "uid": f"{uid[:3]}-{uid[3:6]}.{uid[6:9]}.{uid[9:12]}" if len(uid) == 12 else uid,
                "nom": b["nom"]["value"], "purpose": b.get("but", {}).get("value", ""),
                "siege": b.get("commune", {}).get("value", ""),
                "canton": CANTONS.get(int(cid), "") if cid.isdigit() else "",
            }
        print(f"offset {off}: +{len(lot)} -> {len(lignes)}", flush=True)
        if len(lot) < pas:
            break
        off += pas
        time.sleep(1)

    enr_f = RACINE / "data/sources_enrichissement.json"
    enr = json.loads(enr_f.read_text()) if enr_f.exists() else {}
    out = []
    for r in lignes.values():
        r["type"] = classer(r)
        e = enr.get(r["uid"], {})
        r["asf"] = bool(e.get("asf")); r["asso_types"] = e.get("sous_types", [])
        st = " ".join(r["asso_types"])
        if r["type"] != "prevoyance" and "Soutien financier" in st:
            r["type"] = "donatrice_probable"
        elif r["type"] != "prevoyance" and re.search(r"Hôpitaux|Logements", st) and "Soutien financier" not in st:
            r["type"] = "operationnelle"
        txt = r["nom"] + " " + r["purpose"]
        r["domaines"] = [k for k, rx in DOMAINES.items() if rx.search(txt)]
        r["portee"] = next((p for p, rx in PORTEE if re.search(rx, r["purpose"], re.I)), "non_precise")
        r["en_liquidation"] = "liquidation" in r["nom"].lower()
        out.append(r)
    out.sort(key=lambda r: (r["canton"], r["nom"].lower()))
    (RACINE / "data/fondations_ch.json").write_text(json.dumps(out, ensure_ascii=False))
    with (RACINE / "data/fondations_ch.csv").open("w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(out[0].keys()))
        w.writeheader()
        for r in out:
            w.writerow({**r, "domaines": ";".join(r["domaines"])})

    # Export compact pour l'application : sans les fondations de prévoyance ni celles en liquidation.
    app = [{"id": r["ehraid"], "u": r["uid"], "n": r["nom"], "s": r["siege"], "c": r["canton"],
            "p": r["purpose"], "t": r["type"], "d": r["domaines"], "o": r["portee"],
            **({"sv": "ASF"} if r["asf"] else {}), **({"st": r["asso_types"]} if r["asso_types"] else {})}
           for r in out if r["type"] != "prevoyance" and not r["en_liquidation"]]
    jour = datetime.date.today().strftime("%d.%m.%Y")
    (RACINE / "src/data/fondations.js").write_text(
        f"/* Registre du commerce (Zefix), OFJ, via LINDAS (OGD, open use, source citée). Extrait le {jour}. Enrichi : répertoire ASF (17.09.2026), répertoire As-So (13.05.2026). "
        f"Classement et domaines : règles Levier (mots-clés), à valider. */\n"
        f"window.FONDATIONS_DATE='{jour}';\nwindow.FONDATIONS=" + json.dumps(app, ensure_ascii=False, separators=(",", ":")) + ";\n")

    # Instantané des identifiants : permet à enrichir_fondations.py --nouvelles de repérer les créations.
    (RACINE / f"data/ids_{datetime.date.today().isoformat()}.json").write_text(json.dumps(sorted(r["ehraid"] for r in out)))
    print("total", len(out), "| app", len(app))
    print(Counter(r["type"] for r in out))
    print(Counter(r["canton"] for r in out).most_common())
    print(Counter(d for r in out if r["type"] in ("donatrice_probable", "mixte") for d in r["domaines"]).most_common())


if __name__ == "__main__":
    main()
