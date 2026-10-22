# Audit concurrentiel : Spheriq (ex-StiftungSchweiz)

Pour : Levier (Alexandre Cazes), outil interne d'agence de recherche de fonds
Version : v1, 21.10.2026
Méthode : sources publiques uniquement (site spheriq.ch FR/DE/EN, blog, CGU, déclaration de confidentialité, communiqués, Registre du commerce / FOSC via amtsblattportal.ch, presse, sites concurrents). Aucun compte créé, aucun formulaire rempli.
Date de consultation de toutes les sources : 21.10.2026, sauf mention contraire.
Règle : chaque chiffre est sourcé. « non public » = introuvable dans les sources publiques consultées.

---

## 0. Résumé en 10 lignes

1. Spheriq est la plateforme de référence alémanique (Bâle) qui relie OBNL et fondations : répertoire, recherche, listes, CRM léger, IA, dons, gestion des demandes côté fondations.
2. Prix : Free CHF 0, Starter CHF 300/an, Pro CHF 650/an, Partner dès CHF 1'650/an, hors TVA, abonnements annuels uniquement.
3. Légitimité institutionnelle forte : ZKB + consortium de 10 fondations donatrices au capital, partenariats SwissFoundations et proFonds.
4. Côté demandeur, c'est un outil de recherche en libre-service, pas un service : aucun multi-clients, aucun pipeline de campagne, aucune séquence de relances, aucun budget côté demandeur.
5. L'IA (lancée le 18.05.2026) est contextuelle et prudente, mais opaque : modèle non nommé, limites non chiffrées, hébergement décrit tantôt « Suisse », tantôt « UE (DE, FR, CH) ».
6. Les CGU interdisent le scraping et toute utilisation commerciale sans accord écrit (art. 5.1, 7.5, 10.13) : Levier ne doit pas bâtir sa base sur des données Spheriq.
7. La donnée de base (registre du commerce, FOSC) est publique : Levier peut la reconstituer légalement à sa source.
8. Le vrai terrain libre pour Levier : la couche agence (multi-clients, lettres par fondation en FR/DE, relances, mémoire des campagnes, reporting client), qui n'existe pas chez Spheriq.
9. Recommandation : prendre Spheriq Pro (CHF 650/an) comme outil de recherche manuel si l'usage pour clients est validé par écrit avec Spheriq, et construire uniquement la couche agence.
10. Ne pas copier : répertoire national maintenu, côté fondations, dons, réseaux, magazine, notation publique.

---

## 1. Fiche d'identité

| Élément | Donnée | Source |
|---|---|---|
| Raison sociale | Spheriq AG (traductions : Spheriq SA, Spheriq Ltd.), ex-Philanthropy Services AG | FOSC 10.10.2025, publ. HR02-1006455265 (amtsblattportal.ch) |
| UID | CHE-473.785.853, siège Bâle, Centralbahnstrasse 10, 4051 Bâle | Zefix / FOSC 12.01.2026 |
| Changement de raison sociale | Modification des statuts du 03.10.2025, publiée FOSC 10.10.2025 | FOSC HR02-1006455265 |
| Capital-actions | CHF 561'434 (5'614'340 actions nominatives à CHF 0.10), contre CHF 537'684 auparavant ; augmentation ordinaire dans la marge de fluctuation, statuts du 19.12.2025 | FOSC 12.01.2026, publ. HR02-1006534992 |
| Prix d'émission de l'augmentation 2025 | non public | |
| Actionnaires | Banque cantonale de Zurich (ZKB) + consortium de 10 fondations donatrices : Age-Stiftung, Arcanum, Ernst Göhner, Fondation Botnar, Gebert Rüf, Green Leaves Education Foundation, Hirschmann, Minerva, Mercator Suisse, Velux | https://spheriq.ch/fr/a-propos-de-nous/ ; communiqué FR 01.10.2025 |
| Part de la ZKB | « participation minoritaire importante », pourcentage non public ; montant investi non public | Communiqué ZKB 15.11.2018 : https://www.zkb.ch/de/ueber-uns/medien/medienmitteilungen/2018/investition-weiterentwicklung-stiftungschweiz.html |
| Présidente du CA | Florence Schnydrig Moser (depuis mars 2024) | https://spheriq.ch/fr/a-propos-de-nous/ |
| CEO | Stefan Schöbi (nommé 31.05.2022, en fonction dès 01.11.2022 ; ex-responsable du Fonds pionnier Migros) | Communiqué 31.05.2022 (PDF swissfoundations.ch) |
| Fondateur | Dr Peter Buss | Communiqués ZKB 2018 et 31.05.2022 |
| Équipe affichée | 12 personnes nommées sur la page « À propos » (CEO, marketing digital, médias, rédaction The Philanthropist x2, contenu, customer success, digital fundraising, qualité des données x2, support, comptabilité) | https://spheriq.ch/fr/a-propos-de-nous/ |
| Nombre d'utilisateurs / clients payants | non public | |
| Chiffre d'affaires, résultat | non public | |
| Plateforme sœur | SpendenSchweiz (spendenschweiz.ch), plateforme de dons | https://app.spheriq.ch/llms.txt ; CGU art. 1.2 |

### Historique

| Date | Événement | Source |
|---|---|---|
| 2014 | Création de StiftungSchweiz.ch (selon la ZKB) | Communiqué ZKB 15.11.2018 |
| 14.11.2018 | Entrée de la ZKB au capital (minoritaire importante) ; à l'époque : plus de 13'000 fondations en base, magazine trimestriel envoyé aux 13'000 fondations | Communiqué ZKB 15.11.2018 |
| 20.10.2019 | Lancement du portail « première plateforme du secteur » | https://spheriq.ch/fr/a-propos-de-nous/ |
| 31.05.2022 | Stefan Schöbi nommé CEO ; consortium de 9 fondations entre au capital (minoritaire), coordonné par SwissFoundations ; Fondation Botnar comme partenaire technologique | Communiqué 31.05.2022 |
| Mars 2024 | Florence Schnydrig Moser présidente du CA | https://spheriq.ch/fr/a-propos-de-nous/ |
| 30.09 / 01.10.2025 | Annonce et relance sous le nom Spheriq ; lancement des notes « Fit » et « Hope » ; partenariat associatif avec proFonds (lancement officiel prévu le 18.11.2025, Journée suisse des fondations à Aarau) | Communiqué FR 01.10.2025 : https://spheriq.ch/wp-content/uploads/2025/10/FR_Comm.-de-presse-Relaunch-Spheriq_1.10.2025.pdf |
| 18.05.2026 | Lancement de Spheriq AI (release datée du 15.05.2026 dans le blog) | https://spheriq.ch/fr/a-propos-de-nous/ ; https://spheriq.ch/blog/en/spheriq-ai-release-all-new-features-at-a-glance/ |

Raison du changement de nom (selon le communiqué du 01.10.2025) : se positionner comme « infrastructure digitale » pour tout le secteur d'utilité publique, au-delà des seules fondations ; « Sphère » pour la diversité des domaines d'action, « IQ » pour la compétence données et technologie. Le communiqué annonce aussi un renforcement en Suisse romande et au Tessin, ce qui confirme que la Romandie est encore un territoire secondaire pour eux.

---

## 2. Fonctions (pages /fr/fonctions/*)

| Fonction | Ce qui est publié | Palier | Source |
|---|---|---|---|
| Recherche | « plus de 15 000 » / « environ 15 000 » organisations suisses ; plus de 10 filtres combinables (thème, forme juridique, ODD, zone d'impact, date de fondation, canton) ; tri par pertinence assisté par IA ; recherches sauvegardées avec alerte e-mail quotidienne / hebdo / mensuelle | Free : filtres et résultats limités ; Starter+ : illimité | https://spheriq.ch/fr/fonctions/recherche/ |
| Listes | Export .xls ou .csv à tout moment ; partage avec rôles modérateur / contributeur / spectateur ; commentaires, étiquettes, votes ; listes intelligentes (Pro) avec suggestions IA et mise à jour ; vue tableau, champs personnalisés, Fit et Hope par ligne (Pro) | Starter : listes illimitées ; Pro : tableau + IA | https://spheriq.ch/fr/fonctions/listen/ |
| Portraits | Organisations : description, thèmes, publics, zone, coordonnées, priorités. Bailleurs : critères d'éligibilité, exclusions, priorités, procédure (accepte ou non des demandes, comment). Montants, délais, rapports annuels : non mentionnés. Profil créé ou revendiqué par l'organisation elle-même ; badges (complet, actif, vérifié) | Free : création illimitée ; Pro : Pro-Insights | https://spheriq.ch/fr/fonctions/portraits/ |
| Gestion des contacts | Suivi des demandes (statut, interlocuteurs, notes, pièces jointes), historique partagé dans l'organisation, Fit/Hope modifiables à la main, notes internes privées | Free : 3 dernières entrées visibles ; Starter+ : complet ; rappels e-mail : Pro | https://spheriq.ch/fr/fonctions/gestion-des-contacts/ ; page prix |
| Gestion des demandes | Côté OBNL : dépôt en ligne auprès des fondations participantes depuis leur portrait, assistant de demande, gratuit dès Free. Côté fondations : formulaires, pré-demandes, statuts, contrôle d'éligibilité IA, module budget, évaluation par le conseil via lien, suivi de projets | OBNL : Free ; fondations : Partner dès CHF 1'650/an, certaines fonctions dès « Partner Plus » / « Partner Team » (prix non public) | https://spheriq.ch/fr/fonctions/gestion-des-demandes-et-des-subventions/ |
| Nombre de fondations utilisant le formulaire de demande | non public | | |
| Outils de don | Bouton, formulaire, QR, campagnes ; dons sans frais jusqu'à CHF 2'000 / 5'000 / 10'000 (Starter / Pro / Partner) | Starter+ | https://spheriq.ch/fr/prix/ |
| Réseaux et workspaces | Réseaux tendance / échange / promotion ; limites par palier (ex. 1 réseau tendance public dès Free, 3 dès Starter ; 10 réseaux propres dès Pro, 100 dès Partner) | | CGU art. 10.11 |
| Webinaires et formations | Bootcamp « recherche de fondations » CHF 250 (sessions 17.11.2025 et 04.02.2026) ; webinaires gratuits, souvent en allemand | | https://spheriq.ch/fr/solutions/pour-experts/ ; https://spheriq.ch/fr/solutions/pour-les-organisations-a-but-non-lucratif/ |
| Extras | Rapport sectoriel, blog, magazine The Philanthropist, services d'experts payants (« les prix varient »), aucun tarif publié | | https://spheriq.ch/fr/fonctions/extras/ |
| Mandats de recherche (prix) | Mentionnés dans la FAQ recherche comme alternative au Starter ; prix non public | | https://spheriq.ch/fr/fonctions/recherche/ |
| API | Les CGU évoquent des « API documentées » et des sous-licences API (art. 5.2, 7.5) ; aucune API publique documentée trouvée ; prix non public | | CGU |

### Solutions et cas d'utilisation

- Trois cibles principales : bailleurs (« Funders »), OBNL, experts ; une page « entreprises » existe dans le pied de page. Aucune page pour start-ups, étudiants ou chercheurs individuels. Source : https://spheriq.ch/fr/ (menu), https://spheriq.ch/fr/conditions-dutilisation/ (pied de page).
- Offre « Experts » : recherche, alertes, listes, réseaux. Aucune gestion multi-clients ni gestion de mandats décrite. Partner Experts sur demande uniquement. Source : https://spheriq.ch/fr/solutions/pour-experts/ et page prix.
- Assistants IA cités sur la page OBNL : « Magic List » (jusqu'à 30 fondations suggérées), générateur de lettres d'accompagnement, analyse de portraits de projet. Ces noms ne figurent pas sur la page Spheriq AI elle-même, qui parle de « launchers ». Source : https://spheriq.ch/fr/solutions/pour-les-organisations-a-but-non-lucratif/.
- Cas publié : Hospiz Oberwallis, une quinzaine de fondations contactées, environ CHF 300'000 réunis, certaines fondations à CHF 50'000. Durée, temps passé et palier : non public. Source : https://spheriq.ch/fr/etudes-de-cas/recherche-etude-de-cas-hospiz-oberwallis-hope/.

---

## 3. Prix par palier

Source : https://spheriq.ch/fr/prix/ et https://spheriq.ch/preise/ (identiques). Tous les prix sont annuels, hors TVA (taux non indiqué sur la page). Aucun abonnement mensuel. Pas d'essai limité dans le temps : le palier Free sert d'essai. Paiement par facture ou carte (FAQ).

| Palier | Prix | Utilisateurs | Principaux ajouts | Limites publiées |
|---|---|---|---|---|
| Free | CHF 0 | 3 | Portrait, projets, demandes en ligne, recherche limitée, webinaires | Spheriq AI en « essai limité » ; contacts : 3 dernières entrées ; pas de rappels |
| Starter | CHF 300/an | 5 | Recherche et listes illimitées, gestion des contacts, réseaux, dons sans frais jusqu'à CHF 2'000, magazine papier | Spheriq AI en « essai limité » ; pas de listes intelligentes ni de rappels |
| Pro | CHF 650/an | 10 | Spheriq AI sans restriction, listes intelligentes, tableau, Fit & Hope, abonnements de recherche, rappels e-mail, réseaux propres, dons jusqu'à CHF 5'000, support individuel | Pas de gestion des demandes côté fondations |
| Partner | dès CHF 1'650/an | 15 + 1 formulaire (extensible) | Workspaces, documents, réunions et tâches, échange d'informations exclusif, revue de presse, gestion du conseil ; côté fondations : gestion des demandes | Partner Plus / Partner Team : prix non public |

- Quotas IA (nombre de requêtes, crédits) : non public. La page Spheriq AI dit seulement « Free suffit pour commencer, Pro débloque tout ». Source : https://spheriq.ch/fr/fonctions/spheriq-ai/.
- Prix identiques pour OBNL, fondations et experts ; seules les fonctions changent.
- Accès via partenariats : membres SwissFoundations (abonnement d'essai) et membres proFonds (avantages via partenariat associatif). Détail et prix : non public. Sources : https://www.swissfoundations.ch/ ; communiqué 01.10.2025.

---

## 4. Taille et origine de la base

Les chiffres publiés ne concordent pas, car ils ne comptent pas la même chose :

| Chiffre | Ce qu'il compte | Source |
|---|---|---|
| plus de 13'000 fondations | « fondations répertoriées » (FAQ, texte qui cite encore stiftungschweiz.ch) | https://spheriq.ch/fr/faq/ |
| environ 14'000 fondations | fondations saisies sur la carte du répertoire | https://spheriq.ch/stiftungsverzeichnis/ |
| plus de 15'000 / environ 15'000 organisations | fondations + associations d'utilité publique inscrites au RC, y c. fondations ecclésiastiques | https://spheriq.ch/fr/fonctions/recherche/ |
| plus de 16'000 profils d'organisations, plus de 1'400 projets et demandes, plus de 200 réseaux actifs | données utilisées par Spheriq AI | https://spheriq.ch/fr/fonctions/spheriq-ai/ |
| « plus d'une centaine » de bailleurs avec une logique de soutien détaillée | profils exploitables finement par l'IA | https://spheriq.ch/blog/en/fit-hope-badges-and-promotion-logic-the-key-to-ai/ (18.05.2026) |

Point de comparaison neutre : 13'782 fondations d'utilité publique en Suisse fin 2025, fortune CHF 159,6 milliards (Rapport sur les fondations en Suisse 2026, communiqué du 27.05.2026 : https://www.swissfoundations.ch/wp-content/uploads/2026/05/MM_Sftungsreport_2026-FR_final.pdf). La couverture de Spheriq correspond donc à l'univers légal des fondations d'utilité publique.

Sources de données déclarées :
- Fondations tirées du registre du commerce suisse ; classement thématique à partir du but inscrit au RC ; mutations du RC reprises automatiquement (FAQ).
- Associations, coopératives et Sàrl d'utilité publique : inscription volontaire (FAQ).
- Entrées « codées manuellement et vérifiées par l'équipe » (page recherche) ; depuis mai 2026, les utilisateurs peuvent proposer des organisations manquantes, validées par l'équipe (blog release).
- Exclus : fondations de famille et de prévoyance ; uniquement la Suisse (FAQ et support : https://support.spheriq.ch/en/articles/233766-is-spheriq-only-active-in-switzerland).
- Rapports annuels, montants usuels, délais : non mentionnés comme source ou champ standard (page portraits). Les délais n'apparaissent que dans la logique de soutien détaillée des « plus d'une centaine » de bailleurs.
- Une fondation peut indiquer qu'elle n'accepte pas de demandes ou seulement par e-mail ; masquage complet possible à titre exceptionnel (FAQ).

---

## 5. Comment fonctionne l'IA (Spheriq AI)

Sources : https://spheriq.ch/fr/fonctions/spheriq-ai/ ; blog 18.05.2026 (release, protection des données, Fit/Hope) ; blog 08.07.2026 https://spheriq.ch/blog/en/artificial-intelligence-productive-and-without-compromise/.

- Architecture : système guidé par « launchers » (boutons d'action prédéfinis placés sur profils, recherches, listes, réseaux, gestion des demandes), puis chat libre. Présenté comme un pipeline de composants spécialisés, pas un chatbot libre. Nombre d'étapes : non public.
- Données : base Spheriq (profils, projets, demandes, réseaux) + contexte de la page (ID d'organisation, projet, historique) + documents stockés. Présentée comme données propres, pas du web général.
- Fit : 0 à 5 étoiles, correspondance thématique, géographique et de publics ; pour les bailleurs avec logique détaillée, contrôle critère par critère (exclusions, exigences formelles, délais). Formule et pondération : non public.
- Hope : signal de fiabilité basé sur la qualité de l'information et les retours d'autres utilisateurs (ex. adresse RC erronée = Hope baisse ; relations de financement documentées = Hope monte). Échelle : non public.
- Fonctions côté OBNL : trouver des bailleurs, renforcer le profil, vérifier l'adéquation, rédiger (appels aux dons, campagnes, demandes), préparer une due diligence, viser le badge suivant.
- Fonctions côté fondations : « Concierge IA » de pré-tri des demandes, tri d'une boîte entière, demandes similaires, comparaison d'organisations, préparation de rapports. Prompt personnalisé dès Partner Plus.
- Modèle d'IA : non public.
- Prestataire : PeakPrivacy, plateforme suisse d'IA dite souveraine, centres de données en Suisse, Allemagne et France ; pas d'entraînement sur les données des utilisateurs (blog protection des données, 18.05.2026). La page fonctions dit à un endroit « hébergé en Suisse », à un autre « hébergé dans l'UE ». La déclaration de confidentialité ne nomme pas PeakPrivacy.
- Supervision humaine : Spheriq insiste sur le fait que ce n'est pas un système de décision automatisée.
- Langues prises en charge par l'IA : non public. Webinaire IA du 01.06.2026 en allemand.
- Quotas, taille des fichiers, métriques de précision : non public.

---

## 6. Langues

- Site et app : FR, DE, EN (https://spheriq.ch/fr/, https://spheriq.ch/, https://spheriq.ch/en/). Plusieurs blocs de la page d'accueil FR restent en allemand.
- CGU : la version allemande fait foi, les versions FR et EN sont des traductions (CGU art. 1.9). La déclaration de confidentialité FR est une traduction automatique de l'allemand.
- Factsheets par palier en DE, EN, FR (FAQ prix).
- Webinaires et bootcamps : majoritairement en allemand.
- Italien : aucune interface IT trouvée, alors que le communiqué 2025 annonce un renforcement au Tessin.

---

## 7. CGU : extraction, scraping, réutilisation

Document : « Conditions d'utilisation », situation au 01.10.2025, https://spheriq.ch/fr/conditions-dutilisation/. Contractant : Spheriq AG, Bâle (art. 1.1, qui contient une coquille : « Spheriq AG (anciennement Spheriq AG) »). Droit suisse, for à Bâle (art. 13.4). La version allemande fait foi (art. 1.9). Le texte a été vérifié sur le HTML de la page.

| Article | Contenu (paraphrase sauf citation) |
|---|---|
| 5.1 | Contenus protégés ; usage permis seulement dans les fonctions de la plateforme (consulter, rechercher, lier). Framing ou embedding donnant l'impression d'en être l'auteur interdit. Toute autre utilisation, notamment reproduction, transmission, modification ou utilisation commerciale, exige l'accord écrit préalable de Spheriq ou des titulaires des droits. |
| 5.2 | Spheriq peut sous-licencier des contenus à des tiers via des services API pour une mission similaire (donc une licence data/API est envisageable, sur demande). |
| 7.5 « Automatisation et scraping » | Requêtes automatisées et extraction massive hors des interfaces fournies interdites ; automatisation permise seulement via les API documentées, dans le cadre de l'art. 5, avec limites de débit. |
| 10.13 | Pour les réseaux : « Le scraping (extraction automatisée de données) ou toute utilisation autre que celle prévue » est interdit. Contenus de réseaux publics diffusables avec mention de Spheriq et lien. |
| 4.9 | Export ou impression permis pour sauvegarde ou décisions hors plateforme ; l'utilisateur devient seul responsable au sens de la LPD ; s'il utilise ses propres systèmes ou un cloud tiers, il doit informer les personnes concernées et conclure les contrats de sous-traitance. |
| 2.4 (comptes) | Identifiants confidentiels, pas de transmission à des tiers. |
| 10.12 | Les réseaux ne sont ni un canal publicitaire ni un espace de prospection. |
| 9.1, 9.2, 12.5 | Spheriq corrige les erreurs signalées mais ne contrôle pas en permanence les contenus tiers et décline la responsabilité pour les contenus utilisateurs et tiers. |
| IA | Aucune clause dédiée (entraînement, propriété des sorties). L'art. 10.11 permet seulement de limiter l'« assistance IA intégrée » selon le palier. |
| Agences / consultants agissant pour des clients | Aucune clause spécifique. |

robots.txt de app.spheriq.ch : aucun chemin bloqué (https://app.spheriq.ch/robots.txt). Cela ne lève pas l'interdiction contractuelle des art. 5.1 et 7.5 pour un utilisateur inscrit.

Conséquences pour Levier :
1. Ne jamais scraper Spheriq ni importer en masse ses exports dans la base de l'outil Levier.
2. Usage manuel d'un compte Pro pour la recherche : couvert par les CGU. Réutiliser les exports pour produire un livrable payé par un client se situe en zone grise (art. 5.1, « utilisation commerciale »). Il faut demander à Spheriq un accord écrit simple, ou passer par une offre Experts / Partner.
3. Construire la base Levier à partir des sources primaires publiques (Zefix, FOSC, répertoire de l'ESA, sites et rapports des fondations), qui ne relèvent pas des CGU Spheriq. Vérifier les conditions d'utilisation de chaque source et la LPD pour les données de personnes (membres de conseil).

---

## 8. Confidentialité et tracking

Source : https://spheriq.ch/fr/declaration-de-confidentialite/ (sans date de version affichée).

- Responsable : Spheriq AG, Centralbahnstr. 10, 4051 Bâle.
- Infrastructure nommée : Microsoft Azure (stockage et infrastructure), WordPress.com (site, blog). Traitement « en principe » en Suisse et dans l'EEE ; exports vers d'autres États possibles avec garanties (clauses types).
- Tracking : Google Analytics (avec transfert possible d'IP complètes aux États-Unis), Matomo Cloud (InnoCraft, Nouvelle-Zélande), pixel Meta (Facebook et Instagram Ads), Google Ads, LinkedIn Insight, Mailchimp.
- Sous-traitant IA (PeakPrivacy) : non nommé dans la déclaration.
- Durées de conservation : non chiffrées.
- Profils de fondations et de membres de conseils : pas de section dédiée ; seule mention de données reçues de tiers et de sources publiques.

Lecture pour Levier : l'argument « 100 % Suisse, aucun tracker publicitaire, modèle et hébergeur nommés » est différenciant et vérifiable. Spheriq ne peut pas le revendiquer en l'état.

---

## 9. Avis et critiques publics

- Aucune critique indépendante, aucun avis utilisateur noté (forums, portails d'avis, presse) trouvé sur Spheriq ou StiftungSchweiz dans les recherches effectuées le 21.10.2026. Les contenus trouvés sont des communiqués ou des reprises de communiqués (organisator.ch, markt-kom.com).
- Seul indicateur tiers : dans le rapport Zewo sur les dons 2021, cité par Fundraiso, StiftungSchweiz était 3e en popularité auprès des organisations d'aide suisses, derrière Fundraiso.ch et Deinadieu.ch. Taille de l'échantillon : non publique dans l'article. Source : https://www.fundraiso.com/en/blog/systematic-foundation-search-find-the-right-charitable-foundation-with-online-databases (16.09.2022). Ce classement est rapporté par un concurrent : à prendre avec prudence.
- Même article : des fundraisers estiment qu'aucun répertoire national ou cantonal n'est complet et qu'une recherche efficace exige plusieurs sources. Des agences recommandent à leurs clients un compte premium Fundraiso.
- LinkedIn public : rien d'exploitable trouvé sans connexion.
- Signaux de finition relevés pendant l'audit : FAQ qui renvoie encore à support@stiftungschweiz.ch et à « stiftungschweiz.ch » ; coquille sur l'entité contractante dans l'art. 1.1 des CGU ; blocs allemands sur la page FR ; hébergement IA décrit de manière contradictoire. Ce sont des faiblesses de finition, pas de fond.

---

## 10. Marché : autres acteurs (1 ligne chacun)

### Suisse

| Acteur | Nature | Prix public | Source |
|---|---|---|---|
| Fundraiso (fundraiso.ch / .com) | Base SaaS de fondations, principal concurrent direct de Spheriq côté recherche ; 27'365 fondations et organisations de soutien en Suisse (dont 19'870 organisations de soutien) ; plus de 58'000 à 60'000 organisations au total selon les pages ; rapprochement quotidien avec les registres du commerce ; Premium inclut DE et LI éligibles pour la Suisse | Gratuit EUR 0/an (20 résultats, 1 liste) ; Pro et Business : non public ; Enterprise et API sur demande | https://www.fundraiso.com/de/stiftungen/schweiz ; https://www.fundraiso.com/de/pricing ; https://www.fundraiso.com/de/statistics |
| Répertoire des fondations de l'ESA / DFI | Liste gratuite des fondations sous surveillance fédérale (4'860 en 2021), filtres rudimentaires | Gratuit | Décision d'évaluation AFS 2022 (bar.admin.ch) ; article Fundraiso 2022 |
| Zefix + FOSC (amtsblattportal.ch) | Registres officiels : toutes les fondations inscrites, but statutaire, organes, mutations | Gratuit | https://www.zefix.ch ; https://www.amtsblattportal.ch |
| proFonds | Association faîtière des fondations et associations d'utilité publique ; partenaire de Spheriq depuis 2025 | Cotisation : non public sur la page consultée | https://www.profonds.org/fr/ ; communiqué Spheriq 01.10.2025 |
| SwissFoundations | Association des fondations donatrices (fondée en 2001) ; coéditrice du Rapport sur les fondations ; membres : essai Spheriq | Membres seulement | https://www.swissfoundations.ch/ |
| Swissfundraising | Association professionnelle des fundraisers, plus de 1'000 membres (annonce d'emploi non datée) | Cotisation : non public | kampajobs.ch (annonce Swissfundraising) |
| Fundraisers et consultants indépendants | Concurrence directe de Levier (service), non outillée de façon visible | Honoraires : non public | |

### Benchmarks étrangers

| Acteur | Nature | Prix public | Source |
|---|---|---|---|
| Candid (ex-Foundation Directory Online, US) | 1,9 million d'organisations ; assistant IA avec crédits mensuels | Free ; Premium USD 219/mois ou dès USD 1'199/an ; Ultimate dès USD 1'699/an ; Enterprise sur devis | https://candid.org/pricing |
| Instrumentl (US) | Matching, pipeline, rédaction IA, post-award ; plus de 450'000 profils de bailleurs, plus de 37'000 appels ouverts ; essai 14 jours | Discover USD 299/mois (3 utilisateurs), Pre-Award USD 499/mois (5), Full Lifecycle USD 999/mois (15), facturation annuelle ; Enterprise sur devis | https://www.instrumentl.com/pricing |
| Grantable (US) | Rédaction de demandes assistée par IA ; module « Agency Hub » pour consultants | Free ; Starter USD 50/mois ; Pro USD 150/mois ; Agency Hub USD 300/mois | https://grantable.co/pricing |
| GrantMatch (Canada) | Cabinet de subventions publiques rémunéré au succès : provision + pourcentage des fonds obtenus ; « Hub » USD 240/an | Pourcentages exacts : non public dans une source officielle complète | https://www.rbcroyalbank.com/business/beyond-banking/government-grants.html |
| fundsforNGOs (international) | Veille d'appels et base de bailleurs (plus de 10'000 profils selon le site) | Prix : non public sur le site officiel (un guide tiers non daté indique « dès USD 199/an ») | https://onlinedegrees.sandiego.edu/nonprofit-grant-databases/ |
| FundraisingBox (DE) | CRM de dons, formulaires, SEPA ; pas d'outil de recherche de fondations | Prix : non public (avis utilisateurs : « segment supérieur ») | https://omr.com/de/reviews/product/fundraisingbox |
| stiftungssuche.de (Bundesverband Deutscher Stiftungen) | Recherche de fondations allemandes, partiellement payante (en 2023 : 12'522 entrées gratuites, 29'816 payantes) | Prix : non public dans les sources consultées | Liste de liens skala-campus.org, juin 2023 |

Lecture du marché : aucun acteur suisse ne vend un outil pensé pour une agence (multi-clients, campagnes, lettres individualisées, relances). À l'étranger, Instrumentl et Grantable montrent que le haut de gamme se situe dans le workflow et la rédaction plutôt que dans la base de données, et que les consultants forment un segment payant (Agency Hub de Grantable).

---

## 11. Synthèse

### Forces de Spheriq

1. Légitimité côté bailleurs : ZKB + 10 grandes fondations donatrices au capital, SwissFoundations et proFonds en partenaires. Les fondations y sont présentes, voire y reçoivent leurs demandes.
2. Couverture de l'univers légal (fondations d'utilité publique du RC) mise à jour automatiquement, avec codage manuel.
3. Prix très bas pour un demandeur : CHF 300 à 650 par an.
4. Logique de soutien structurée pour « plus d'une centaine » de bailleurs : un contrôle critère par critère, que personne d'autre ne fait en Suisse.
5. Canal de dépôt en ligne directement chez les fondations partenaires.
6. IA contextuelle prudente (pas de décision automatique), discours de souveraineté des données.
7. Interface trilingue FR/DE/EN, export CSV/XLS, listes collaboratives.

### Faiblesses de Spheriq (vues depuis Levier)

1. Libre-service : l'association doit faire seule la recherche, la rédaction et le suivi. Le temps et la compétence restent son problème.
2. Pas de multi-clients ni de gestion de mandats pour les experts.
3. Pas de séquence de relances ni de calendrier de campagne. Seuls des rappels e-mail (Pro) et des alertes sur les nouvelles organisations.
4. Montants usuels et délais absents des portraits standards.
5. Centre de gravité alémanique : équipe, webinaires, version des CGU qui fait foi, blocs DE sur le site FR. La Romandie est un chantier annoncé, pas un acquis.
6. IA opaque : modèle non nommé, quotas non chiffrés, hébergement décrit de manière contradictoire, sous-traitant absent de la déclaration de confidentialité.
7. Trackers publicitaires américains sur le site.
8. Fit et Hope sont des notes génériques : Hope dépend de retours communautaires, encore peu fournis (1'400 projets et demandes annoncés).
9. Cibles start-ups, étudiants master/doctorat et chercheurs non adressées.
10. Abonnement annuel uniquement.

### Angles d'amélioration exploitables par Levier (classés par impact)

Impact élevé

1. Espace par client et par campagne : chaque client (association, start-up, étudiant, client d'un consultant en marque blanche) a son profil structuré, sa shortlist de 20 à 30 fondations, ses statuts et ses documents. C'est le trou le plus net chez Spheriq.
2. Lettre par fondation ancrée dans le but statutaire : l'IA rapproche le profil du client et le but RC exact de la fondation, puis rédige une lettre d'une page en FR ou en DE. Chaque affirmation est reliée à sa source (URL RC, FOSC, page de la fondation). C'est la promesse de Levier, outillée.
3. Allemand de qualité professionnelle : glossaire, formules de politesse alémaniques, relecture humaine obligatoire avant envoi. Pour un client romand, viser les fondations alémaniques est un levier de volume que Spheriq ne lui donne pas.
4. Calendrier et relances datées : date limite et date de séance du conseil par fondation, relance à J+X, rappel de réponse attendue, export iCal. Spheriq n'a rien de comparable côté demandeur.
5. Mémoire d'agence : pour chaque fondation, garder ce que Levier a appris de campagne en campagne (délai de réponse réel, montant accordé, motif de refus, préférence de format, interlocuteur). Ce « Hope privé » est un actif qu'aucune plateforme publique ne possède.
6. Règle anti-sur-sollicitation inter-clients : alerte si la même fondation est ciblée pour deux clients dans la même fenêtre. Gestion des conflits d'intérêts et de la réputation de Levier auprès des fondations.
7. IA 100 % suisse et transparente : Infomaniak, modèle nommé, pas d'entraînement sur les données clients, pas de tracker publicitaire. L'argument se vend aux associations sensibles (santé, social, asile) et aux chercheurs.

Impact moyen

8. Dossier complet généré : budget chiffré par fondation (adapté au plafond usuel), checklist des pièces (statuts, comptes, rapport d'activité), assemblage PDF. Spheriq n'a de budget que côté fondations.
9. Enrichissement par veille FOSC : fondation en liquidation ou dissoute à exclure, changement de conseil (nouveau contact possible), nouvelle fondation peu sollicitée à cibler. Sources publiques officielles, sans dépendre de Spheriq.
10. Champ « montant usuel » et « délai » renseigné à la main ou depuis les rapports annuels et les sites, pour les fondations réellement utilisées. Ne pas viser l'exhaustivité.
11. Couverture au-delà des fondations du RC : Loterie Romande, fonds cantonaux et communaux, fonds universitaires et bourses (étudiants master/doctorat), soutiens à l'innovation pour start-ups, fondations du Liechtenstein et d'Allemagne éligibles pour la Suisse. Spheriq exclut l'étranger et ces sources n'apparaissent pas dans ses pages consultées.
12. Validation client intégrée : le client approuve ou commente chaque lettre avant envoi. Traçabilité de qui a validé quoi.
13. Reporting client : nombre de fondations sollicitées, réponses, montants obtenus face aux honoraires fixes. C'est la preuve commerciale de Levier, qui ne prend jamais de pourcentage.

Impact plus faible mais rapide

14. Export en marque blanche (Word ou PDF à la charte du consultant ou du client) pour l'offre aux consultants.
15. Questionnaire d'admission unique, réutilisé pour toutes les lettres : on reprend l'idée de Spheriq (profil complété une fois), version agence.
16. Explication du score de matching critère par critère (thème, zone, public, exclusions, forme juridique acceptée), avec le passage du but statutaire qui justifie chaque point. Plus lisible que 4 étoiles.
17. Modèles de lettres par type de client (association, start-up, étudiant) et par langue, versionnés.
18. Tableau de bord de charge : campagnes actives, lettres à rédiger, relances dues cette semaine. Pour piloter une petite équipe.

Option « acheter plutôt que construire » : un compte Spheriq Pro (CHF 650/an hors TVA) ou un compte Fundraiso payant comme outil de recherche manuel coûte moins cher qu'une base maison exhaustive. Condition : obtenir de Spheriq un accord écrit pour l'usage au profit de clients (art. 5.1 CGU) et ne jamais réinjecter automatiquement leurs données dans l'outil Levier.

### Ce que Levier ne doit pas essayer de copier

1. Un répertoire national exhaustif de 14'000 à 16'000 profils maintenu en continu. Spheriq y consacre une équipe qualité de données, financée par la ZKB et 10 fondations.
2. Le côté fondations (formulaires de demande, comités, budget, Concierge IA) : autre client, autre vente, cycle long.
3. Les outils de dons et SpendenSchweiz : métier de paiement, hors sujet.
4. Les réseaux, workspaces, la communauté et le magazine The Philanthropist : effet de réseau impossible à rattraper.
5. Une notation publique des organisations (Hope, badges) : risque réputationnel et juridique, à garder en interne.
6. Un SaaS en libre-service à CHF 300-650/an : Levier vend un service à honoraires fixes. L'outil sert l'agence, pas l'inverse.
7. Le scraping ou l'aspiration des données Spheriq : interdit par les art. 5.1, 7.5 et 10.13 des CGU.
8. Un chatbot généraliste : Spheriq a déjà choisi les launchers ; la valeur de Levier est dans le livrable final (lettre et dossier), pas dans le chat.

---

## 12. Sources (toutes consultées le 21.10.2026)

Spheriq
- https://spheriq.ch/fr/
- https://spheriq.ch/fr/prix/ et https://spheriq.ch/preise/
- https://spheriq.ch/fr/fonctions/spheriq-ai/
- https://spheriq.ch/fr/fonctions/recherche/
- https://spheriq.ch/fr/fonctions/listen/
- https://spheriq.ch/fr/fonctions/portraits/
- https://spheriq.ch/fr/fonctions/gestion-des-contacts/
- https://spheriq.ch/fr/fonctions/gestion-des-demandes-et-des-subventions/
- https://spheriq.ch/fr/fonctions/extras/
- https://spheriq.ch/fr/solutions/pour-experts/
- https://spheriq.ch/fr/solutions/pour-les-organisations-a-but-non-lucratif/
- https://spheriq.ch/fr/etudes-de-cas/recherche-etude-de-cas-hospiz-oberwallis-hope/
- https://spheriq.ch/fr/a-propos-de-nous/
- https://spheriq.ch/fr/faq/
- https://spheriq.ch/stiftungsverzeichnis/
- https://spheriq.ch/fr/conditions-dutilisation/ (situation au 01.10.2025)
- https://spheriq.ch/fr/declaration-de-confidentialite/
- https://app.spheriq.ch/llms.txt ; https://app.spheriq.ch/robots.txt
- https://spheriq.ch/wp-content/uploads/2025/10/FR_Comm.-de-presse-Relaunch-Spheriq_1.10.2025.pdf
- https://spheriq.ch/blog/en/spheriq-ai-release-all-new-features-at-a-glance/
- https://spheriq.ch/blog/en/data-protection-and-sovereign-ai-infrastructure/
- https://spheriq.ch/blog/en/fit-hope-badges-and-promotion-logic-the-key-to-ai/
- https://spheriq.ch/blog/en/artificial-intelligence-productive-and-without-compromise/
- https://support.spheriq.ch/en/articles/233766-is-spheriq-only-active-in-switzerland

Registres et presse
- Zefix, Spheriq AG, CHE-473.785.853 : https://bs.chregister.ch/cr-portal/auszug/auszug.xhtml?uid=CHE-473.785.853
- FOSC 10.10.2025 (HR02-1006455265) et 12.01.2026 (HR02-1006534992), via https://www.amtsblattportal.ch
- ZKB, 15.11.2018 : https://www.zkb.ch/de/ueber-uns/medien/medienmitteilungen/2018/investition-weiterentwicklung-stiftungschweiz.html
- Communiqué 31.05.2022 : https://www.swissfoundations.ch/wp-content/uploads/2022/05/COMMUNIQUE-DE-PRESSE-StiftungSchweiz_nouveau-CEO_consortium-de-fondations_31.05.2022-1.pdf
- https://www.organisator.ch/en/?p=40843
- Rapport sur les fondations 2026, communiqué 27.05.2026 : https://www.swissfoundations.ch/wp-content/uploads/2026/05/MM_Sftungsreport_2026-FR_final.pdf

Concurrents et benchmarks
- https://www.fundraiso.com/de/pricing ; https://www.fundraiso.com/de/stiftungen/schweiz ; https://www.fundraiso.com/de/statistics
- https://www.fundraiso.com/en/blog/systematic-foundation-search-find-the-right-charitable-foundation-with-online-databases
- https://www.profonds.org/fr/ ; https://www.swissfoundations.ch/
- https://candid.org/pricing ; https://www.instrumentl.com/pricing ; https://grantable.co/pricing
- https://www.rbcroyalbank.com/business/beyond-banking/government-grants.html
- https://onlinedegrees.sandiego.edu/nonprofit-grant-databases/
- https://omr.com/de/reviews/product/fundraisingbox
- https://levierconseil.ch/

Limites de cet audit : pas d'accès à l'app connectée (pas de compte), donc aucun test réel de la qualité des données, de l'IA ni des exports. Les chiffres de Spheriq sont déclaratifs. Prochaine étape suggérée : ouvrir un compte Free au nom de Levier (par Alexandre, pas par un agent) pour tester la recherche et l'IA sur 3 cas clients réels.
