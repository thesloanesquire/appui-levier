"""Lecteur XLSX minimal (bibliothèque standard) : renvoie les lignes de la première feuille."""
import re, zipfile, xml.etree.ElementTree as ET
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}

def lignes(path, feuille=1):
    z = zipfile.ZipFile(path)
    ss = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", NS):
            ss.append("".join(t.text or "" for t in si.iter("{%s}t" % NS["m"])))
    sh = ET.fromstring(z.read(f"xl/worksheets/sheet{feuille}.xml"))
    for row in sh.iter("{%s}row" % NS["m"]):
        out = {}
        for c in row.findall("m:c", NS):
            col = re.match(r"[A-Z]+", c.get("r")).group(0)
            v = c.find("m:v", NS); t = c.get("t")
            if t == "s" and v is not None: val = ss[int(v.text)]
            elif t == "inlineStr": val = "".join(x.text or "" for x in c.iter("{%s}t" % NS["m"]))
            else: val = v.text if v is not None else ""
            out[col] = val
        yield out
