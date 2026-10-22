#!/bin/sh
# Sauvegarde quotidienne de la base Appui (à mettre dans la crontab du serveur : 0 3 * * * /opt/appui/serveur/sauvegarde.sh)
# Copie la base dans /opt/appui/sauvegardes/ et garde 30 jours. Copier ce dossier hors du serveur (kDrive, Swiss Backup).
set -e
DEST=/opt/appui/sauvegardes; mkdir -p "$DEST"
docker compose -f /opt/appui/serveur/docker-compose.yml exec -T appui /pb/pocketbase backup create --dir=/pb/pb_data 2>/dev/null || true
docker cp "$(docker compose -f /opt/appui/serveur/docker-compose.yml ps -q appui)":/pb/pb_data/backups/. "$DEST/"
find "$DEST" -name '*.zip' -mtime +30 -exec rm {} \;
