#!/bin/zsh
# Assemble le site servi en production : page publique (landing/) à la racine, outil interne (src/) sous /app/.
# Sortie : site/  (servie par PocketBase via --publicDir, ou publiée telle quelle sur Netlify pour la démo).
set -e
cd "${0:A:h}/.."
mkdir -p site/app
rsync -a --exclude 'assets/*.jpg' --exclude 'assets/*.png' --exclude 'assets/credits.json' --exclude 'src/' landing/ site/
rsync -a --exclude 'assets/logo-options.html' src/ site/app/
# La version publiée ne contient jamais les analyses de clients faites en local : elles vivent sur le serveur.
printf '/* Les analyses du bot sont stockées sur le serveur Appui. */\nwindow.LEVIER_BOT={};\n' > site/app/data/bot.js
echo "site/ prêt ($(du -sh site | cut -f1))"
