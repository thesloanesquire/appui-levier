#!/bin/zsh
# Télécharge les répertoires officiels utilisés par import_sources.py (documents publics).
# Les URL changent chaque année : vérifier les pages sources si un lien ne répond plus.
set -e
cd "${0:A:h}/../data" && mkdir -p sources && cd sources
curl -sfL -o 2026-09-17_ASF_repertoire.xlsx "https://backend.esa.admin.ch/fileservice/sdweb-docs-prod-esaadminch-files/files/2026/09/22/070d4af5-a5ac-47df-acf2-b3aa448f4a0a.xlsx"   # https://www.esa.admin.ch/fr/repertoire-des-fondations
curl -sfL -o 2026-05-13_AsSo_repertoire.pdf "https://www.as-so.ch/fileadmin/user_upload/Documents/AS-SO/WWW/Editors/CLA/CLA_REP_repertoire-13.5.26.pdf"
curl -sfL -o 2025_LoRo_beneficiaires.pdf "https://soutien-loro.ch/sites/default/files/2026-05/BRB2025.pdf"                                        # https://soutien-loro.ch/fr/beneficiaires
ls -la
echo "Ensuite : brew install poppler (pour lire les PDF), puis python3 ../../scripts/import_sources.py && python3 ../../scripts/lindas_fondations.py"
