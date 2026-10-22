#!/bin/zsh
# Lance Appui sur cet ordinateur : http://127.0.0.1:8090/app/  (Ctrl-C pour arrêter)
set -e
cd "${0:A:h}/.."
[ -x serveur/bin/pocketbase ] || { echo "Lance d'abord ./scripts/installer.sh"; exit 1; }
[ -f .env ] && set -a && . ./.env && set +a
PB="serveur/bin/pocketbase"; ARGS=(--dir=serveur/pb_data --migrationsDir=serveur/pb_migrations --hooksDir=serveur/pb_hooks --publicDir=site)
$PB migrate up "${ARGS[@]}" >/dev/null
if [ ! -f serveur/pb_data/.compte_cree ]; then
  echo "Premier lancement : création de ton compte (administrateur + utilisateur d'Appui)."
  read "EMAIL?E-mail : "; read -s "MDP?Mot de passe (10 caractères ou plus) : "; echo
  $PB superuser upsert "$EMAIL" "$MDP" --dir=serveur/pb_data >/dev/null
  $PB serve --http=127.0.0.1:8090 "${ARGS[@]}" >/dev/null 2>&1 & SRV=$!; sleep 2
  python3 - "$EMAIL" "$MDP" <<'PYEOF'
import json, sys, urllib.request
e, p = sys.argv[1], sys.argv[2]
def req(u, d, t=None):
    h = {"Content-Type": "application/json"}; t and h.update(Authorization=t)
    return json.load(urllib.request.urlopen(urllib.request.Request("http://127.0.0.1:8090" + u, json.dumps(d).encode(), h)))
tok = req("/api/collections/_superusers/auth-with-password", {"identity": e, "password": p})["token"]
req("/api/collections/users/records", {"email": e, "password": p, "passwordConfirm": p, "name": e.split("@")[0], "role": "admin", "verified": True}, tok)
print("Compte créé. Connecte-toi avec cet e-mail et ce mot de passe.")
PYEOF
  kill $SRV; touch serveur/pb_data/.compte_cree
fi
echo "Appui : http://127.0.0.1:8090/app/   ·   administration : http://127.0.0.1:8090/_/"
exec $PB serve --http=127.0.0.1:8090 "${ARGS[@]}"
