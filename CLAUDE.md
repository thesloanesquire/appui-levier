# CLAUDE.md · Appui (outil interne de Levier)

Tu assistes **Alexandre Cazes**, fondateur de Levier (levierconseil.ch), agence romande de recherche de fonds auprès des fondations. Il débute avec Claude Code : explique simplement, une étape à la fois, et fais les commandes à sa place quand c'est possible. Réponds en français, vouvoiement si Alexandre vouvoie, sinon tutoiement.

## Ce qu'est Appui
Un outil **interne** qui rend Alexandre ultra efficace : il trouve les fondations qui ont le plus de chances de financer un client, prépare une lettre sur mesure pour chacune et suit chaque demande jusqu'à la réponse. Les clients ne se connectent pas ; ils reçoivent les résultats (lettres, carte des financeurs).

- Page publique : `landing/` (présente Appui aux associations, appel à 15 minutes en visio).
- Outil : `src/` (HTML/CSS/JS sans build). Servi sous `/app/`.
- Serveur : `serveur/` (PocketBase : comptes, base partagée, proxy IA Infomaniak). Hébergé sur un VPS Infomaniak, voir `docs/HEBERGEMENT_INFOMANIAK.md`.
- Données publiques : `scripts/lindas_fondations.py` (registre du commerce, 14'980 fondations), `scripts/import_sources.py` (ASF, As-So, Loterie Romande).
- Bot de matching : `scripts/bot_fondations.py`. Fiches pratiques : `scripts/enrichir_fondations.py`.

## Demandes fréquentes d'Alexandre et quoi faire
| Il dit | Tu fais |
|---|---|
| « Lance Appui en local » | `./scripts/construire_site.sh` puis `./scripts/lancer_local.sh` et ouvre http://127.0.0.1:8090/app/ |
| « Lance le bot sur <site> » | demande nom, canton, type si absents, puis `python3 scripts/bot_fondations.py --url <site> --nom "<nom>" --canton <XX> --type <type>` (3 à 6 min). Résume les 5 fondations prioritaires. |
| « Fais les fiches des meilleures fondations de <client> » | `python3 scripts/enrichir_fondations.py --client <id> --top 10` (environ 15 min). Signale celles qui n'acceptent pas de demandes. |
| « Mets la base à jour » | `python3 scripts/lindas_fondations.py` puis `./scripts/construire_site.sh` puis déployer. |
| « Mets en ligne » | voir `docs/HEBERGEMENT_INFOMANIAK.md`, section Mise à jour. |
| « Ajoute un conseiller » | dans l'admin du serveur (`https://appui.levierconseil.ch/_/`) > users > New record (e-mail, mot de passe, rôle). Ne jamais écrire un mot de passe dans un fichier versionné. |

## Règles (à respecter sans exception)
- **Jamais** d'extraction de la base Spheriq/StiftungSchweiz, Fundraiso, local.ch, search.ch, Moneyhouse : leurs conditions l'interdisent.
- **Jamais** d'envoi automatique de lettres : Alexandre relit et envoie lui-même.
- **Données personnelles (nLPD)** : pas de noms de membres de conseil dans la base ; seulement des coordonnées institutionnelles. Les documents confidentiels des clients passent par l'IA Infomaniak (Suisse), pas par des services hors de Suisse.
- **Secrets** : `.env` uniquement (jamais versionné, voir `.env.example`). Si tu vois une clé en clair ailleurs, signale-le.
- **Aucun chiffre inventé** dans les lettres ni sur la page publique : pas de taux de réussite, pas de faux témoignages.
- Honoraires fixes, jamais de pourcentage sur les fonds obtenus (déontologie Swissfundraising).
- Ne supprime pas de fichiers ; ne force pas un `git push`.

## Design
Charte dans `DESIGN.md` et `PRODUCT.md` (marine #1F2A44, terre cuite #B8613F, Hanken Grotesk, Spectral pour lettres et citations). Toute modification d'interface suit ces fichiers.

## Où en est le projet
`docs/` contient l'audit de Spheriq, les sources de données, l'architecture IA, l'audit de la plateforme et l'étude de marché (`docs/etude/`). La feuille de route est dans `docs/FEUILLE_DE_ROUTE.md`.
