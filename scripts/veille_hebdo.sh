#!/bin/zsh
# Veille hebdomadaire Appui : base des fondations à jour, fiches des nouvelles fondations romandes, site reconstruit.
# Journal : data/logs/veille_AAAA-MM-JJ.log
set -e
cd "${0:A:h}"
LOG="../data/logs/veille_$(date +%F).log"
{
  echo "=== Veille Levier $(date '+%d.%m.%Y %H:%M') ==="
  PY=$(command -v python3.12 || command -v python3)
  $PY lindas_fondations.py | tail -3
  $PY enrichir_fondations.py --nouvelles --cantons VD,GE,FR,NE,VS,JU --max 30   # fiches envoyées au serveur si .env configuré
  ./construire_site.sh
  if [ -x ./mettre_en_ligne.sh ]; then ./mettre_en_ligne.sh; elif [ -x ./deployer.sh ]; then ./deployer.sh "veille hebdo $(date +%F)" | grep -E "Production URL|Deploy complete"; else echo "(mise en ligne : voir docs/HEBERGEMENT_INFOMANIAK.md)"; fi
  echo "=== Terminé $(date '+%H:%M') ==="
} 2>&1 | tee "$LOG"
