#!/bin/zsh
# Installation d'Appui sur un Mac (ou Linux). Sans effet ailleurs que dans ce dossier.
set -e
cd "${0:A:h}/.."
PB_VERSION=0.40.5
echo "== Appui : installation =="

# 1. Python 3
PY=$(command -v python3.12 || command -v python3 || true)
if [ -z "$PY" ]; then echo "Python 3 manquant : installe-le depuis https://www.python.org/downloads/ puis relance."; exit 1; fi
echo "Python : $($PY --version)"

# 2. PocketBase (serveur d'Appui), vérifié par somme de contrôle
case "$(uname -s)-$(uname -m)" in
  Darwin-arm64) ARCH=darwin_arm64 ;; Darwin-x86_64) ARCH=darwin_amd64 ;; Linux-x86_64) ARCH=linux_amd64 ;; Linux-aarch64) ARCH=linux_arm64 ;;
  *) echo "Système non prévu : $(uname -s)-$(uname -m)"; exit 1 ;;
esac
if [ ! -x serveur/bin/pocketbase ]; then
  mkdir -p serveur/bin && cd serveur/bin
  URL=https://github.com/pocketbase/pocketbase/releases/download/v$PB_VERSION
  curl -sfLO $URL/pocketbase_${PB_VERSION}_${ARCH}.zip && curl -sfLO $URL/checksums.txt
  grep "pocketbase_${PB_VERSION}_${ARCH}.zip" checksums.txt | shasum -a 256 -c -
  unzip -oq pocketbase_${PB_VERSION}_${ARCH}.zip pocketbase && rm pocketbase_${PB_VERSION}_${ARCH}.zip checksums.txt
  cd ../..
fi
echo "PocketBase : $(serveur/bin/pocketbase --version)"

# 3. Base des fondations (registre du commerce via LINDAS, 13 secondes)
(cd scripts && $PY lindas_fondations.py | tail -1)

# 4. Site (page publique + outil)
[ -f src/data/bot.js ] || printf '/* Analyses du bot : stockées sur le serveur Appui. */\nwindow.LEVIER_BOT={};\n' > src/data/bot.js
./scripts/construire_site.sh

# 5. Fichier de configuration
[ -f .env ] || { cp .env.example .env; echo "Fichier .env créé : ajoute-y ton token Infomaniak (voir DEMARRER.md, étape 3)."; }
echo "== Installation terminée. Lance : ./scripts/lancer_local.sh =="
