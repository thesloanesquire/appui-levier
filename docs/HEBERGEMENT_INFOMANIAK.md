# Mettre Appui en ligne chez Infomaniak : appui.levierconseil.ch

Tout reste en Suisse : serveur (VPS Infomaniak), base de données (PocketBase sur ce serveur), IA (Infomaniak AI Services, modèle Qwen 3.5). Durée la première fois : environ 45 minutes. Claude Code peut faire les commandes avec toi : ouvre ce dossier et écris « guide-moi pour mettre Appui en ligne chez Infomaniak ».

## Ce qu'il faut

| Élément | Choix | Coût indicatif (relevé le 21.10.2026, à vérifier) |
|---|---|---|
| Serveur | **VPS Lite** 2 vCPU, 4 Go, 60 Go, Ubuntu 24.04 | CHF 7.20/mois (engagement annuel) · https://www.infomaniak.com/fr/hebergement/vps-lite |
| IA | **AI Services**, modèle `Qwen/Qwen3.5-397B-A17B-FP8` (bêta ; repli stable : `mistralai/Mistral-Small-4-119B-2603`) | à l'usage : CHF 0.80 / 3.60 par million de tokens (entrée / sortie), crédits d'essai offerts · https://www.infomaniak.com/fr/hebergement/ai-services/tarifs |
| Domaine | levierconseil.ch (déjà chez Infomaniak) | 0 |
| Sauvegardes | copie quotidienne du dossier de sauvegarde vers kDrive ou Swiss Backup | selon offre |

Ordre de grandeur pour 20 clients par mois : moins de CHF 20 par mois au total.

## 1. Commander le VPS (10 min)
1. Manager Infomaniak > **VPS Lite** > commander > image **Ubuntu 24.04**.
2. Ajoute ta clé SSH (Claude Code peut la créer : « crée-moi une clé SSH »).
3. Note l'**adresse IP** du serveur.

## 2. Le sous-domaine (5 min, puis jusqu'à 1 h de propagation)
Manager Infomaniak > **Domaines** > levierconseil.ch > **Zone DNS** > Ajouter une entrée :
- Type **A**, nom **appui**, valeur **l'IP du VPS**, TTL 3600.

Ne touche pas aux autres entrées (le site levierconseil.ch reste sur Netlify).

## 3. Préparer le serveur (10 min)
Dans le Terminal (remplace `IP`) :

```bash
ssh ubuntu@IP 'curl -fsSL https://get.docker.com | sudo sh && sudo usermod -aG docker ubuntu && sudo mkdir -p /opt/appui && sudo chown ubuntu /opt/appui'
```

Ouvre les ports 80 et 443 dans le pare-feu du VPS (Manager > VPS > Pare-feu), et seulement ceux-là avec le 22 (SSH).

## 4. Envoyer Appui et démarrer (10 min)
Depuis ce dossier, sur ton Mac :

```bash
./scripts/construire_site.sh && rsync -az --exclude 'serveur/pb_data' --exclude 'serveur/bin' --exclude 'data/' ./ ubuntu@IP:/opt/appui/
```

Puis crée le fichier `.env` sur le serveur (une seule fois) avec ton token Infomaniak et `APPUI_DOMAINE=appui.levierconseil.ch` :

```bash
scp .env ubuntu@IP:/opt/appui/.env
```

Et démarre :

```bash
ssh ubuntu@IP 'cd /opt/appui && docker compose -f serveur/docker-compose.yml up -d --build'
```

Le certificat HTTPS se crée tout seul. Ouvre https://appui.levierconseil.ch/_/ : PocketBase te demande de créer le **compte administrateur** (garde-le dans ton gestionnaire de mots de passe). Puis, dans l'admin, collection **users** > **New record** : ton compte d'utilisateur Appui (rôle admin), et un compte par conseiller.

## 5. Sauvegardes (5 min)

```bash
ssh ubuntu@IP '(crontab -l 2>/dev/null; echo "0 3 * * * /opt/appui/serveur/sauvegarde.sh") | crontab -'
```

Une fois par mois : télécharge une sauvegarde et vérifie qu'elle s'ouvre (un VPS Lite n'a pas de snapshot automatique).

## 6. Brancher les scripts du Mac sur le serveur
Dans `.env` sur ton Mac : `APPUI_URL=https://appui.levierconseil.ch`, `APPUI_EMAIL` et `APPUI_PASSWORD` (ton compte utilisateur Appui). Le bot et les fiches pratiques envoient alors leurs résultats au serveur : toute l'équipe les voit.

## Mise à jour (2 min)
Après une modification ou une mise à jour de la base :

```bash
./scripts/construire_site.sh && rsync -az --exclude 'serveur/pb_data' --exclude 'serveur/bin' --exclude 'data/' ./ ubuntu@IP:/opt/appui/ && ssh ubuntu@IP 'cd /opt/appui && docker compose -f serveur/docker-compose.yml up -d --build'
```

Les données (clients, demandes, lettres) ne sont jamais écrasées : elles vivent dans le volume `appui_data` du serveur.

## Sécurité et nLPD
- Seuls les comptes créés par toi peuvent lire et écrire ; la page publique ne montre aucune donnée.
- La clé IA reste sur le serveur (fichier `.env`), jamais dans le navigateur.
- Données traitées en Suisse (VPS et IA Infomaniak). Exception : le script de fiches pratiques utilise Claude Code (recherche web) sur ton Mac, uniquement pour des informations publiques sur les fondations.
- Mentionne l'outil et l'hébergement dans ta déclaration de confidentialité (levierconseil.ch).
