---
name: Levier
description: Poste de travail d'agence pour la recherche de fonds auprès des fondations suisses.
colors:
  ink-navy: "#1F2A44"
  ink-2: "#4F5870"
  ink-3: "#5F6679"
  terracotta: "#B8613F"
  terracotta-strong: "#9C4D2E"
  terracotta-ink: "#8A4429"
  terracotta-soft: "#FBEEE7"
  on-accent: "#FFFFFF"
  canvas: "#FAF9F7"
  rail: "#F3F1ED"
  surface: "#FFFFFF"
  hover: "#F5F3EF"
  sunk: "#F1EEE9"
  line: "#E9E5DE"
  line-strong: "#D9D3C9"
  ok: "#2C6E4C"
  ok-soft: "#E5F2EA"
  warn: "#8C5A0E"
  warn-soft: "#FBF0DA"
  info-soft: "#EBEEF6"
  dark-canvas: "#0F1422"
  dark-surface: "#161D2E"
  dark-ink: "#EEE8DB"
  dark-terracotta: "#E08B66"
typography:
  display:
    fontFamily: "Hanken Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Hanken Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Hanken Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.003em"
  caption:
    fontFamily: "Hanken Grotesk"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
  display-mobile:
    fontFamily: "Hanken Grotesk"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.15
  label:
    fontFamily: "Hanken Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 600
  quote:
    fontFamily: "Spectral, Georgia, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  letter:
    fontFamily: "Spectral, Georgia, serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  wordmark:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.045em"
rounded:
  xs: "4px"
  sm: "6px"
  control: "8px"
  md: "10px"
  card: "12px"
  lg: "14px"
  pill: "99px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  page: "32px"
components:
  button-primary:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "34px"
  button-primary-hover:
    backgroundColor: "{colors.terracotta-strong}"
  button-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "34px"
  button-default-hover:
    backgroundColor: "{colors.hover}"
  button-dark:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.control}"
    height: "34px"
  button-sm:
    rounded: "7px"
    padding: "0 10px"
    height: "28px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "36px"
  nav-item:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    height: "34px"
  nav-item-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-navy}"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
  status-pill:
    backgroundColor: "{colors.sunk}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 10px 0 8px"
    height: "24px"
  score-badge:
    backgroundColor: "{colors.terracotta-soft}"
    textColor: "{colors.terracotta-ink}"
    rounded: "{rounded.control}"
    width: "38px"
    height: "28px"
  score-badge-mid:
    backgroundColor: "{colors.info-soft}"
    textColor: "{colors.ink-navy}"
  score-badge-low:
    backgroundColor: "{colors.sunk}"
    textColor: "{colors.ink-3}"
  tag:
    backgroundColor: "{colors.sunk}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "2px 9px"
---

# Design System: Levier

## Overview

**Creative North Star : « Le registre tenu à jour »**

Levier est un poste de travail d'agence au niveau de Linear et Attio : clair, dense sans être serré, construit pour des sessions longues sur ordinateur portable. Le fond est un blanc à peine chaud, la barre latérale un ton plus bas, les surfaces de travail blanches et cernées d'un filet fin. La marque ne passe pas par la décoration mais par trois choses : l'encre marine, la terre cuite réservée à l'action et à l'urgence, et le point final du mot-symbole « levier. ».

Le monde a deux voix typographiques et elles ne se mélangent pas. Hanken Grotesk porte toute l'interface, titres serrés en 700-800. Spectral, serif littéraire hérité du site levierconseil.ch, n'apparaît que lorsque le texte vient d'ailleurs : le but statutaire d'une fondation cité entre crochets, et le corps de la lettre. Une première version crème et serif a été rejetée comme « vieillotte » le 21.10.2026 ; le papier crème du site n'est donc pas repris dans l'application.

Le mode sombre est marine profond, pas gris : mêmes rôles, valeurs inversées, terre cuite éclaircie.

**Key Characteristics:**
- Surfaces blanches à filet fin et ombre presque imperceptible ; profondeur par tons plutôt que par ombres.
- Terre cuite rare : action principale, urgence, score élevé, crochets de citation.
- Hanken Grotesk pour l'interface, Spectral seulement pour le texte cité ou rédigé.
- Statuts en pastilles arrondies qui se retournent lettre par lettre quand ils changent.
- Chiffres tabulaires partout où l'on compare (montants, échéances, scores).

## Colors

Une encre marine, une terre cuite, et une gamme de neutres très légèrement chauds qui ne virent jamais au crème.

### Primary
- **Encre marine** (ink-navy) : texte principal, titres, avatar et monogramme client, bouton sombre, pastille « Envoyée », carré du logo. C'est la couleur de la marque autant que celle du texte.

### Secondary
- **Terre cuite** (terracotta) : action principale (« Nouveau client », « Analyser et classer », « Je valide »), point final du mot-symbole, point du logo, anneau de focus, icône de navigation active, crochets de citation, raisons négatives.
- **Terre cuite appuyée** (terracotta-strong) : survol du bouton principal.
- **Terre cuite encre** (terracotta-ink) : texte terre cuite sur fond clair ou sur fond terre cuite doux (échéance urgente, score élevé, pastille « Validation client », synthèse urgente).
- **Terre cuite douce** (terracotta-soft) : fond du score élevé, de la ligne sélectionnée dans la liste des fondations, de la pastille « Validation client », du bandeau de validation du portail, halo des points urgents.

### Tertiary
- **Vert accordé** (ok / ok-soft) : progression obtenue, statut « Prête » (doux) et « Accordée » (plein), raisons positives, étapes faites.
- **Ambre relance** (warn / warn-soft) : statut « Relancée » et drapeau « Démonstration » de la barre supérieure.
- **Bleu de rédaction** (info-soft) : statut « En rédaction » et score moyen.

### Neutral
- **Fond de page** (canvas) : arrière-plan général et fond de la barre supérieure translucide.
- **Barre latérale** (rail) : un ton sous le fond, sépare la navigation sans bordure épaisse.
- **Surface** (surface) : panneaux, tableaux, cartes, champs, feuille de lettre.
- **Survol** (hover) et **Creux** (sunk) : lignes survolées ; fonds des contrôles segmentés, onglets, colonnes du pipeline, tags, jauges.
- **Filet** (line) et **Filet appuyé** (line-strong) : bordures de panneaux et séparateurs de lignes ; bordures de boutons et de champs, points neutres.
- **Encre 2** (ink-2) et **Encre 3** (ink-3) : texte secondaire ; métadonnées, en-têtes de tableau, compteurs.

### Named Rules
**The One Accent Rule.** La terre cuite signale une action, une urgence ou une pertinence élevée. Elle ne sert jamais de fond décoratif ni de couleur de titre.

**The No Cream Rule.** Les neutres restent dans la gamme #FAF9F7 / #F3F1ED / blanc. Le papier #F5F1E8 du site ne revient pas dans l'application : c'est la version rejetée.

**The Fixed Sheet Rule.** La feuille de lettre reste blanche et à l'encre marine dans les deux modes, parce qu'elle représente le document imprimé.

## Typography

**Display Font:** Hanken Grotesk (avec system-ui, -apple-system, Segoe UI)
**Body Font:** Hanken Grotesk
**Quote / Letter Font:** Spectral (avec Georgia), romain et italique 400, gras 600

**Character :** une grotesque contemporaine, serrée dans les titres, pour l'outil ; une serif littéraire pour la parole des autres et pour la lettre qui part.

### Hierarchy
- **Display** (700, 28px, 1.15, -0.03em) : titre de page (« Aperçu », nom du client). 24px sous 760px ; 34px dans le portail client.
- **Headline** (700, 22px, 1.2, -0.025em) : nom de la fondation dans le panneau de détail.
- **Title** (700, 15px, -0.01em) : titres de panneaux. Le nom d'une ligne (fondation, client) est en 600, 14.5px.
- **Body** (400, 14px, 1.5) : texte courant ; chapeau de page en encre 2, 72ch au plus.
- **Label** (600, 12-12.5px) : en-têtes de tableau, pastilles, sous-titres de section, étiquettes de navigation. Casse normale, jamais de capitales espacées.
- **Quote** (Spectral italique 400, 17px, 1.6, 62ch) : but statutaire cité dans le détail ; 13-14px dans les listes.
- **Letter** (Spectral 400, 16px, 1.7, 66ch) : corps de la lettre.
- **Wordmark** (800, 21px, -0.045em) : « levier » en minuscules suivi du point terre cuite.

### Named Rules
**The Two Voices Rule.** Spectral n'apparaît que pour du texte cité (but statutaire) ou rédigé (lettre). Aucun titre, bouton ou libellé en serif.

**The Tabular Rule.** Montants, dates, scores et compteurs sont en chiffres tabulaires.

## Layout

Coquille à deux colonnes : barre latérale fixe de 248px (logo, bouton ⌘K, navigation, clients actifs, pied avec avatar et bascule de thème), zone principale avec barre supérieure collante de 52px (fil d'Ariane, drapeau de démonstration) floutée sur le fond. La page a une marge de 32px et une largeur maximale de 1440px.

Compositions récurrentes : l'aperçu en deux colonnes (« À faire » de 300 à 380px, tableau des dépôts à droite) ; la fiche client en liste/détail (liste de 340 à 420px, détail fluide) dans un seul panneau ; la lettre avec une marge collante de 340px à droite ; le pipeline en colonnes de 232px minimum défilant horizontalement ; le portail client centré à 920px.

Rythme d'espacement sur une base de 4 : 6, 8, 12, 16, 24, 32px ; 20px entre colonnes, 12px entre cartes. Sous 1100px les grilles passent à une colonne. Sous 760px la barre latérale devient une bande horizontale défilante avec fondu à droite, le mot-symbole et les sections secondaires disparaissent, la page passe à 16px de marge.

## Elevation & Depth

Hybride à dominante tonale. La hiérarchie vient d'abord des tons (fond, barre latérale, creux, surface) et des filets ; les ombres sont teintées marine et très douces. Elles se renforcent seulement en réponse à un état (survol d'une carte) ou pour ce qui flotte (palette ⌘K, notification).

### Shadow Vocabulary
- **Repos** (`box-shadow: 0 1px 2px rgba(31,42,68,.05), 0 0 0 1px rgba(31,42,68,.02)`) : panneaux, boutons, champs, onglet actif, cartes.
- **Soulevé** (`box-shadow: 0 1px 2px rgba(31,42,68,.04), 0 6px 20px -6px rgba(31,42,68,.10)`) : carte de campagne ou de pipeline survolée (avec translation de -1px), feuille de lettre.
- **Flottant** (`box-shadow: 0 24px 64px -16px rgba(31,42,68,.30), 0 4px 12px -4px rgba(31,42,68,.10)`) : palette ⌘K et notification.

En mode sombre, le repos devient un filet blanc à 2 % et les deux autres des ombres noires profondes.

### Named Rules
**The Flat At Rest Rule.** Au repos, une surface n'a que son filet et l'ombre de repos. Le soulèvement est un retour d'état, pas un style.

## Shapes

Coins doucement arrondis, gradués selon la taille : 4px pour les touches clavier et le code, 6px pour la feuille de lettre et les petits boutons d'icône, 7-8px pour les boutons, champs et entrées de navigation, 10px pour les lignes sélectionnables et les onglets, 12px pour les cartes et les encadrés, 14px pour les panneaux et la palette. Tout ce qui est statut, tag, pastille de synthèse ou jauge est en forme de pilule. Le carré du logo a un rayon de 16 sur 64, et le monogramme client reprend cette forme (12px sur 44px). Filets d'1px partout ; seul l'encadré de commande du bot est en tirets.

## Components

### Buttons
Nets et compacts, à la manière de Linear.
- **Shape :** coins arrondis (8px), hauteur 34px ; petite taille 28px (7px de rayon).
- **Primary :** fond terre cuite appuyée (#9C4D2E), texte blanc (5.98:1, AA), 600 13.5px, ombre interne claire en haut. Survol : encre terre cuite (#8A4429). Réservé à l'action principale de la vue. Ne jamais poser du texte blanc sur la terre cuite de base #B8613F (4.36:1, sous AA).
- **Default :** fond surface, filet appuyé, ombre de repos ; survol au ton survol.
- **Dark :** fond marine, texte couleur du fond ; action de traitement dans un formulaire (« Lire le site », « Enregistrer et recalculer le matching »).
- **Ghost :** sans fond ni bordure, survol au ton survol.
- **Hover / Focus / Active :** transitions de 150ms ; enfoncement de 1px à l'appui ; anneau de focus terre cuite de 2px décalé de 2px pour tous les éléments.

### Chips
- **Status pill :** voir composant signature ci-dessous.
- **Tag :** pilule au fond creux, 500 12px, encre 2 ; variante « on » en vert doux pour les fondations prioritaires.
- **Synthèse (stat) :** pilule surface de 30px, valeur en gras tabulaire ; variante urgente sur terre cuite douce.

### Cards / Containers
- **Corner Style :** 14px pour les panneaux et tableaux, 12px pour les cartes de campagne et encadrés, 10px pour les cartes de pipeline.
- **Background :** surface ; colonnes de pipeline en creux.
- **Shadow Strategy :** repos, soulevé au survol (voir Elevation).
- **Border :** filet 1px.
- **Internal Padding :** 16-18px pour les en-têtes de panneau, 12-16px pour les cellules et cartes, 22px pour les formulaires.

### Inputs / Fields
- **Style :** 36px, filet appuyé, fond surface, rayon 8px ; libellé 600 13px au-dessus, aide en encre 3.
- **Focus :** bordure terre cuite et halo de 3px à 18 % de terre cuite. La barre d'URL du flux « Nouveau client » applique le même halo à son conteneur.
- **Segmented / Tabs :** rail creux de 3px de marge intérieure, option active sur surface avec ombre de repos.

### Navigation
- **Barre latérale :** entrées de 34px, 500, encre 2 avec icône en trait de 16px (trait 1.7). Survol au ton survol. Page active : fond surface, filet et ombre de repos, icône terre cuite. Compteurs alignés à droite en tabulaire. Clients actifs en 30px avec un point de 7px, terre cuite cerclé de halo quand un dépôt est urgent.
- **Palette ⌘K :** 620px, coins 14px, ombre flottante, champ de 54px, entrée sélectionnée au ton survol, apparition par montée de 10px en 240ms.

### Signature : citation du but statutaire entre crochets
Le but social de la fondation, tiré du registre du commerce, est cité en Spectral italique encre marine (17px, 62ch), ouvert par un crochet terre cuite de 22px suspendu dans la marge gauche et fermé par « ] » terre cuite. En liste et dans la marge de la lettre, la version compacte (13-14px, encre 2) met les deux crochets en ligne et se tronque à une ou deux lignes. Chaque fondation proposée porte sa citation : c'est la preuve visible du matching.

### Signature : pastille de statut et retournement par lettre
Pilule de 24px, 600 12px, précédée d'un point de 6px à la couleur du texte. Palette des neuf statuts :
- Suggérée, À qualifier : contour en filet appuyé, fond transparent, encre 2.
- En rédaction : bleu de rédaction, encre marine.
- Validation client : terre cuite douce, terre cuite encre.
- Prête : vert doux, vert.
- Envoyée : fond marine plein, texte couleur du fond.
- Relancée : ambre doux, ambre.
- Accordée : vert plein, texte blanc.
- Refusée : fond creux, encre 3, barrée.

Quand un statut change, chaque lettre du nouveau libellé se retourne sur l'axe horizontal (de -90° à 0°, 420ms, courbe `cubic-bezier(.16,1,.3,1)`), décalée de 22ms par lettre, comme un tableau des départs. L'animation ne joue qu'une fois, sur la ligne qui vient de changer, et disparaît avec la réduction des animations.

### Signature : score de pertinence
Badge de 38 × 28px, rayon 8px, 700 13.5px tabulaire. Trois paliers : 75 et plus en terre cuite douce et terre cuite encre ; 55 à 74 en bleu de rédaction et encre marine ; en dessous en creux et encre 3. Il précède toujours le nom de la fondation dans les listes.

### Lettre
Feuille blanche fixe (voir The Fixed Sheet Rule), coins 6px, ombre soulevée, marge intérieure 64 × 72px (28 × 20px sur mobile), 780px au plus. Expéditeur en Hanken 13px encre 2, destinataire aligné à droite, corps en Spectral 16px. Marge droite collante d'encadrés : but social cité, angle conseillé, vérifications avant l'envoi.

## Do's and Don'ts

### Do:
- **Do** tenir la terre cuite pour l'action principale, l'urgence (échéance à 3 jours ou moins) et le score de 75 et plus.
- **Do** citer le but statutaire entre crochets terre cuite en Spectral italique chaque fois qu'une fondation est proposée.
- **Do** utiliser la pastille de statut et sa palette à neuf entrées pour tout état de demande, et retourner les lettres seulement au changement.
- **Do** écrire les textes sur fond terre cuite doux en terre cuite encre (#8A4429), jamais en terre cuite pleine.
- **Do** dessiner les icônes en SVG à trait (16px, trait 1.7, bouts arrondis).
- **Do** marquer les données de démonstration avec le drapeau ambre de la barre supérieure.

### Don't:
- **Don't** reprendre le papier crème, les filets beiges ou les titres en Spectral de la première version : rejetés comme « vieillots ».
- **Don't** construire un tableau de bord à tuiles KPI : les chiffres de synthèse sont des pastilles en ligne sous le titre.
- **Don't** mettre de libellés en capitales espacées ni de surtitres au-dessus des titres.
- **Don't** utiliser d'ombres dures décalées ni de dégradés décoratifs.
- **Don't** employer de caractères typographiques (flèches, puces, coches) en guise d'icônes.
