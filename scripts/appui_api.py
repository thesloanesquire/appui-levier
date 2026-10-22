"""Envoi des résultats des scripts (analyses du bot, fiches pratiques) vers le serveur Appui (PocketBase).
Configuration dans Levier/.env :  APPUI_URL=https://appui.levierconseil.ch  APPUI_EMAIL=...  APPUI_PASSWORD=...
Sans ces variables, les scripts restent en mode local (fichiers src/data/*.js)."""
import json, os, urllib.request, urllib.parse
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent


def charger_env():
    f = RACINE / ".env"
    if f.exists():
        for l in f.read_text().splitlines():
            if "=" in l and not l.strip().startswith("#"):
                k, v = l.split("=", 1); os.environ.setdefault(k.strip(), v.strip().strip('"'))


def _req(url, data=None, token=None, method=None):
    h = {"Content-Type": "application/json"}
    if token: h["Authorization"] = token
    r = urllib.request.Request(url, data=json.dumps(data).encode() if data is not None else None, headers=h, method=method)
    with urllib.request.urlopen(r, timeout=60) as x:
        return json.load(x)


def actif():
    charger_env()
    return all(os.environ.get(k) for k in ("APPUI_URL", "APPUI_EMAIL", "APPUI_PASSWORD"))


def envoyer(collection, ref, data):
    """Crée ou met à jour l'enregistrement « ref » de la collection. Renvoie True si envoyé."""
    if not actif(): return False
    base = os.environ["APPUI_URL"].rstrip("/")
    tok = _req(f"{base}/api/collections/users/auth-with-password", {"identity": os.environ["APPUI_EMAIL"], "password": os.environ["APPUI_PASSWORD"]})["token"]
    filtre = urllib.parse.quote(f'ref="{ref}"')
    ex = _req(f"{base}/api/collections/{collection}/records?filter={filtre}&perPage=1", token=tok)["items"]
    if ex:
        _req(f"{base}/api/collections/{collection}/records/{ex[0]['id']}", {"data": data}, tok, "PATCH")
    else:
        _req(f"{base}/api/collections/{collection}/records", {"ref": ref, "data": data}, tok, "POST")
    return True
