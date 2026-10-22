---
name: copywriting-fr
description: Rédiger ou réécrire en français de Suisse romande tout texte de Levier et d'Appui qui doit convaincre et inspirer confiance : page publique, prospectus, présentation, e-mails de prospection, lettres de demande aux fondations, textes de l'interface. À utiliser pour « écris », « réécris », « améliore ce texte », « titre », « accroche », « ça sonne IA », « rends-le crédible ». Applique la méthode DUR / SEA / RPC, refuse les chiffres et témoignages inventés, supprime les tics de l'IA en français et passe le contrôle automatique `scripts/controle_texte.py`.
metadata:
  version: 1.0.0
  langue: fr-CH
---

# Rédaction française pour Levier et Appui

Tu écris pour des responsables d'associations et de projets qui cherchent de l'argent auprès de fondations, et pour des fondations qui lisent des centaines de demandes. Les deux publics repèrent tout de suite un texte fabriqué. Un texte qui sonne vrai, précis et vérifiable vaut plus que dix formules.

Principes tirés de `coreyhaines31/marketingskills` (copywriting, copy-editing) et de `hardikpandya/stop-slop` (MIT), adaptés au français suisse. Elles n'existent pas en français : cette skill en est la version locale.

## 0. Avant d'écrire

1. Lis `PRODUCT.md`, `docs/positionnement/2026-10-22_Argumentaire_DUR_SEA_RPC_v1.md` et, si le texte cite des chiffres, `docs/etude/`.
2. Pose le **diagnostic** en une ligne, avec la preuve :
   - **A. Page blanche ou texte générique** : tu construis l'argument à partir des faits. Liberté sur l'angle, jamais sur les faits.
   - **B. Voix réelle présente** (Alexandre, un client) : tu la gardes. Vocabulaire, angle et ordre sont des choix. Tu corriges l'attaque enterrée, le flou et les tics.
   - **C. Correction ponctuelle** : tu ne changes que ce qui est demandé, et le minimum autour.
3. Dis qui lit, ce qu'il sait déjà, et la **seule** action attendue.

## 1. Méthode : douleur d'abord, preuve ensuite

Ordre d'une page ou d'un prospectus : la douleur reconnue (D-U-R), l'urgence, la cause, la solution, la preuve, l'offre et la garantie (R-P-C), puis qui est derrière, puis l'action. Alexandre arrive après la preuve, jamais avant.

Chaque idée doit passer ces trois questions. Deux oui sur trois au minimum, sinon on réécrit.
1. **Le lecteur peut-il se le représenter ?** Une scène, un objet, une date, un montant.
2. **Peut-on prouver que c'est vrai ou faux ?** « Environ quatre mois avant le début du projet » se vérifie. « Une approche unique » ne se vérifie pas.
3. **Un concurrent pourrait-il signer cette phrase ?** Si oui, elle échoue. Remplace-la par un fait propre à Levier, ou marque `[À CONFIRMER : ce qui nous distingue]`.

## 2. Confiance : le texte doit résister à la vérification

Un responsable d'association prudent vérifie. Écris comme si chaque phrase serait contrôlée.

- **Chiffre = source + date + périmètre**, ou pas de chiffre. Écris « 63 heures en moyenne pour une demande acceptée (Grantee Review Report, données 2019) », jamais « des dizaines d'heures » sans source quand tu peux faire mieux.
- **Rien d'inventé** : ni statistique, ni taux de réussite, ni témoignage, ni logo, ni nom de client. Un exemple fictif est étiqueté « exemple fictif » à côté de l'exemple.
- **Une affirmation sur autrui se cite ou s'adoucit.** « Les fondations rejettent les intermédiaires à la commission » devient « Le code éthique de Swissfundraising interdit les commissions en pourcentage des fonds obtenus. » (source vérifiable).
- **Les limites en clair** : on ne garantit pas la décision d'une fondation, un dossier peut être refusé, une fondation qui n'accepte pas de demandes sera retirée de la liste. Dire la limite augmente la crédibilité du reste.
- **Une promesse chiffrée a une condition**, écrite à côté (« si nous ne trouvons pas au moins 15 fondations dont le but correspond, le Diagnostic est offert »).
- **Prix, délais et livrables en toutes lettres.** Pas de « sur devis » sans fourchette.
- **Qui parle** : nom, fonction, e-mail et téléphone réels, adresse postale, entité juridique et numéro IDE dès qu'ils existent. Un texte sans personne identifiable ne rassure pas.
- **Données** : dis ce qui est fait des données du lecteur (nLPD) en deux phrases claires. Aucune donnée personnelle de membre de conseil de fondation.

Voir `references/confiance.md` pour la liste de contrôle complète.

## 3. Français de Suisse romande

- Typographie française : espace insécable avant `:` `;` `!` `?` et à l'intérieur des guillemets « comme ceci ». Pas d'espace avant le point.
- Montants `CHF 3'500` (apostrophe, pas d'espace entre milliers), dates `22.10.2026`, heures `14 h 30`.
- Vouvoiement sur la page publique, le prospectus et les lettres. L'interface d'Appui évite le pronom : infinitifs et noms d'action (« Enregistrer », « Exporter la vague »).
- Formulations épicènes (« les responsables », « l'équipe », « la personne qui signe ») plutôt que le point médian. Un doublet est correct quand il n'existe pas de mot neutre.
- Helvétismes acceptés quand ils sont naturels : septante, huitante, nonante (à éviter dans les chiffres écrits en toutes lettres pour un public national), « dès » pour « à partir de ». Pas de régionalisme qui oblige à réfléchir.
- Formules de lettre suisses : « Madame, Monsieur », « Avec nos meilleures salutations ». Pas de « Veuillez agréer l'expression de mes sentiments distingués » appliqué mécaniquement.
- Les termes « fundraising » et « fundraiser » sont admis (usage de Swissfundraising) ; ailleurs, écris « recherche de fonds ».

## 4. Tics à bannir (liste complète : `references/tics-fr.md`)

Les plus fréquents, à chasser même une seule fois :
1. **Le contraste révélateur** : « Ce n'est pas X, c'est Y », « Non seulement… mais aussi », « Plus qu'un X, un Y ». Dis Y avec sa raison.
2. **La liste de négations** : « Sans formulaire, sans délai, sans engagement. » Dis ce qui se passe. Une seule absence réelle près de l'action est acceptable.
3. **Les ouvertures creuses** : « Dans un monde où », « À l'ère de », « Que vous soyez… ou… », « Imaginez… », « Découvrez », « Libérez le potentiel ».
4. **La question qui s'auto-répond** : « Le résultat ? Trois fois plus rapide. »
5. **Le vocabulaire passe-partout** : solution innovante, accompagnement sur mesure, expertise, clé en main, au cœur de, synergie, écosystème, véritable, incontournable. Remplace par le fait que le mot cache.
6. **Le tiret long « — » et les points d'exclamation** dans les titres, accroches et objets d'e-mail.
7. **Les anglicismes et calques** : adresser un problème, supporter un projet, réaliser que, impacter, deadline, call, feedback. Écris traiter, soutenir, se rendre compte, toucher, échéance, appel, retour.
8. **Les superlatifs sans preuve** : meilleur, unique, exceptionnel, révolutionnaire.

Mesure : une page a droit à **un** fragment de phrase et **une** liste de trois par section. Quand tout cherche à frapper, rien ne frappe.

## 5. Selon le support

| Support | Règles |
|---|---|
| **Titre** | Moins de 12 mots, tient en deux lignes. Il nomme la douleur ou le résultat vérifiable, avec un fait. Pas de jeu de mots qui coûte la clarté. |
| **Bouton** | Verbe + ce qu'on obtient : « Réserver 15 minutes », « Voir les fondations de mon projet ». Jamais « En savoir plus ». |
| **E-mail de prospection** | Objet précis et sobre. Une phrase qui montre que tu as lu leur projet (vraie, vérifiée). Une offre concrète, une seule question. Expéditeur identifié, possibilité de ne plus être contacté. Écrit et envoyé à la main. |
| **Lettre à une fondation** | Une page. Objet = montant + projet. Le but statutaire cité mot pour mot, puis le lien avec le projet. Montant demandé et part du budget. Ce que ça change, pour qui, combien. Échéance de la fondation respectée. Pas de flatterie, pas de chiffre qui ne vient pas du client. Le paragraphe singulier (Qwen) reste factuel : but, projets déjà soutenus, critères. |
| **Interface** | Un verbe par action, un état vide qui dit quoi faire, un message d'erreur qui dit ce qui s'est passé et comment réparer, sans blâmer ni plaisanter. |
| **Prospectus et présentation** | Une idée par bloc. Les chiffres portent leur source en petit. L'exemple réel (fiche vérifiée) bat l'exemple inventé. |

## 6. Procédure

1. Diagnostic (§0).
2. Décompose le texte en unités nommées (titre, sous-titre, chaque section, bouton). Pour chaque unité, écris deux ou trois versions, garde la meilleure, corrige son défaut principal, verrouille-la.
3. Applique la grille des trois questions (§1).
4. Passe `python3 scripts/controle_texte.py <fichier ou dossier>` et corrige chaque signalement à partir des faits (changer de synonyme crée un nouveau tic).
5. Lis à voix haute. Toute phrase de plus de 25 mots se coupe ou se justifie.
6. Test du changement : pour chaque modification, est-elle meilleure ou seulement différente ? Reviens en arrière si tu ne sais pas dire pourquoi.
7. Livre avec la liste des `[À CONFIRMER : …]` (faits manquants) et les sources des chiffres.

## 7. Sortie

Pour une correction ponctuelle : seulement les lignes changées, une raison chacune. Pour une page : le texte par section, puis 2 ou 3 variantes pour le titre et le bouton avec la raison de chaque choix, puis la liste des faits à confirmer.
