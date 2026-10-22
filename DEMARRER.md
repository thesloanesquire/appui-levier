# Démarrer avec Appui

Bienvenue Alexandre. Appui est ton outil : il est à toi (code, données, nom). Ce guide tient en 4 étapes. Tu peux aussi simplement ouvrir ce dossier dans Claude Code et écrire : **« Aide-moi à installer Appui »**. Claude lira le fichier `CLAUDE.md` et fera les étapes avec toi.

## 0. Récupérer le projet

```bash
git clone https://github.com/thesloanesquire/appui-levier.git
cd appui-levier
```

Le dépôt est public le temps de la remise. Ensuite, copie-le dans ton propre compte GitHub en dépôt privé (Claude Code peut le faire : « publie ce dossier dans mon GitHub en privé »).

## 1. Installer (une fois, 10 minutes)

Ouvre le Terminal dans ce dossier, puis :

```bash
./scripts/installer.sh
```

Le script vérifie Python, télécharge PocketBase (le petit serveur d'Appui), reconstruit la base des 14'980 fondations depuis le registre du commerce (13 secondes) et prépare le site. Il ne touche à rien d'autre sur ton ordinateur.

## 2. Ouvrir Appui sur ton ordinateur

```bash
./scripts/lancer_local.sh
```

Puis ouvre http://127.0.0.1:8090/app/ dans ton navigateur. Au premier lancement, le script te demande de créer ton compte administrateur.

## 3. Brancher l'IA suisse (Infomaniak)

1. Dans ton Manager Infomaniak : **AI Services** > créer le produit (crédits d'essai offerts) > **Créer un token**.
2. Copie `.env.example` en `.env` et colle le token et le numéro du produit.
3. Relance Appui. Le bouton « Rédiger avec l'IA » apparaît dans chaque lettre (modèle Qwen 3.5).

## 4. Mettre Appui en ligne sur appui.levierconseil.ch

Suis `docs/HEBERGEMENT_INFOMANIAK.md` (environ 45 minutes la première fois, ou demande à Claude Code de te guider). Ensuite, toi et tes conseillers vous connectez depuis n'importe où.

## Au quotidien

| Je veux | Je fais |
|---|---|
| Ajouter un client | Appui > Nouveau client (site + présentation) |
| Une recherche complète par l'IA | Dans Claude Code : « lance le bot sur https://site-du-client.ch » |
| Savoir comment déposer chez une fondation | Dans Claude Code : « fais les fiches des meilleures fondations de <client> » |
| Une lettre | Fiche de la fondation > Rédiger la lettre > « Rédiger avec l'IA » > relire > Word ou PDF |
| Suivre mes dépôts | Aperçu (échéances, à faire) et Demandes (pipeline) |
| Repérer un financement Loterie Romande | Fiche client > onglet Loterie Romande |

Questions ? Ouvre Claude Code dans ce dossier et pose-les en français.
