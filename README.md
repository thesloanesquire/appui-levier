# Appui · l'outil interne de Levier

Appui aide l'agence Levier (levierconseil.ch) à trouver les fondations suisses qui ont le plus de chances de financer un client, à préparer une lettre sur mesure pour chacune et à suivre chaque demande jusqu'à la réponse.

**Pour commencer : [DEMARRER.md](DEMARRER.md).** Avec Claude Code, ouvre ce dossier et écris « aide-moi à installer Appui ».

## Ce que fait Appui
- **14'980 fondations actives** issues du registre du commerce (open data OFJ via LINDAS), enrichies avec les répertoires de surveillance (ASF fédérale : 5'379 ; As-So VD/NE/JU : 1'281 avec leurs catégories) et les soutiens 2025 de la Loterie Romande (5'658).
- **Matching expliqué** : pour chaque fondation, la phrase de son but statutaire qui rejoint le projet, les raisons et les risques.
- **Bot IA** (`scripts/bot_fondations.py`) : lit le site du client, fixe les critères, évalue jusqu'à 60 fondations ; chaque citation est vérifiée mot pour mot.
- **Fiches pratiques** (`scripts/enrichir_fondations.py`) : site, contact institutionnel, délais, modalités, montants, sources ; repère les fondations qui n'acceptent pas de demandes.
- **Lettres sur mesure** FR/DE/EN, rédaction par l'IA suisse (Infomaniak, Qwen 3.5) ou par règles, export Word et PDF.
- **Suivi** : aperçu des échéances, pipeline, relances, refus avec motif, mémoire d'agence par fondation, alerte si une fondation est déjà sollicitée pour un autre client.
- **Multi-utilisateur** : serveur PocketBase (comptes, base partagée), hébergé chez Infomaniak.
- **Page publique** (`landing/`) qui présente Appui aux associations et propose 15 minutes en visio.

## Organisation du dossier
| Dossier | Contenu |
|---|---|
| `landing/` | page publique (racine du site) |
| `src/` | l'outil (servi sous `/app/`), sans étape de compilation |
| `serveur/` | PocketBase : collections, proxy IA, Docker, HTTPS, sauvegarde |
| `scripts/` | installation, lancement, base des fondations, bot, fiches, veille hebdomadaire |
| `docs/` | hébergement Infomaniak, audits, sources de données, architecture IA, étude de marché |
| `PRODUCT.md`, `DESIGN.md` | produit et charte graphique |

## Commandes
```bash
./scripts/installer.sh          # une fois
./scripts/lancer_local.sh       # http://127.0.0.1:8090/app/
python3 scripts/bot_fondations.py --url https://site-du-client.ch --nom "Client" --canton VD --type association
python3 scripts/enrichir_fondations.py --client <id-client> --top 10
python3 scripts/lindas_fondations.py && ./scripts/construire_site.sh   # mettre la base à jour
./scripts/veille_hebdo.sh       # base + fiches des nouvelles fondations romandes
```

## Données et règles
- Sources publiques citées : « Registre du commerce (Zefix), OFJ, via LINDAS » (OGD) ; ASF ; As-So ; Loterie Romande. Pour rafraîchir les répertoires : `scripts/telecharger_sources.sh` puis `scripts/import_sources.py`.
- Exclus : bases de Spheriq/StiftungSchweiz, Fundraiso, local.ch, search.ch, Moneyhouse (conditions d'utilisation).
- Pas de données personnelles de membres de conseil ; coordonnées institutionnelles seulement.
- Aucun envoi automatique de lettres. Honoraires fixes, jamais de pourcentage.
- Secrets dans `.env` uniquement (voir `.env.example`).

Appui appartient à Alexandre Cazes / Levier. Créé en octobre 2026.
