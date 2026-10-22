# Appui : benchmark des fonctionnalités (ce qui rendrait l'outil « ouf » pour un conseiller)

22.10.2026 · étude 3 · outil interne de Levier (levierconseil.ch) · sources publiques consultées le 22.10.2026, aucun compte créé

Complète, sans les répéter, `../2026-10-21_Audit_Plateforme_Levier_v1.md` (corrections du prototype) et `../2026-10-21_Sources_Donnees_Fondations_v1.md` (sources de données). Ici : ce que font les meilleurs outils du monde, et ce qu'Appui doit leur prendre.

## Verdict en cinq lignes

1. Aucun outil étudié ne fait ce qu'Appui fait déjà : multi-clients + lettre par fondation + données suisses. Instrumentl est le plus proche (plans consultants, profils clients), mais il est américain (données 990) et coûte de 299 à 999 USD par mois.
2. Ce que les utilisateurs adorent partout tient en quatre choses : moins de recherche (« plus de 50 % de temps de recherche en moins », avis Capterra Instrumentl), des données de générosité réelles (montant médian, ouverture aux nouveaux bénéficiaires), des rappels de délais fiables, et des rapports exportables pour les clients.
3. Le gain le plus rapide pour Alexandre n'est pas plus d'IA de rédaction, mais une **file « Aujourd'hui »** qui pousse les bonnes actions, une **analyse automatique des règlements** des fondations, et une **bibliothèque de blocs par client**.
4. Le gain le plus fort sur le taux de réussite : le **montant à demander** et les **pairs financés** (Loterie Romande + mémoire d'agence), et une **relecture « comme le conseil de fondation »** avant dépôt.
5. Pour vendre Levier : des livrables qui arrivent seuls chez le client (rapport PDF mensuel, carte des financeurs) et un **diagnostic offert** qui sert de prétexte de prise de contact, dans le respect de la LCD (pas d'envoi de masse sans consentement).

## Limites de l'étude

- Reddit (r/grantwriting, r/nonprofit) n'a pas pu être lu par les outils de recherche (accès refusé, aucun fil retourné). Les attentes des utilisateurs viennent des avis Capterra, GetApp et Software Advice, et des pages des éditeurs. Biais : avis souvent positifs, pages éditeurs promotionnelles.
- Plusieurs prix publiés par des tiers se contredisent. Le tableau donne le prix de la page officielle quand elle a pu être lue, sinon la source tierce, signalée comme telle.
- Notion, HubSpot (portail client) et Bonterra (côté demandeur) n'ont pas de prix ou de fonctions vérifiés sur une page officielle : mentionnés seulement comme modèles d'usage.

---

## 1. Panorama des outils

### 1.1 Outils de recherche de fonds (côté demandeur)

| Outil | Pays | Fonctions clés | Ce que les utilisateurs aiment / reprochent | Prix | Source |
|---|---|---|---|---|---|
| **Instrumentl** | US | Matching continu (450k+ financeurs, 37k+ appels actifs), suivi pipeline et tâches, délais ; « Apply » : analyse IA de l'appel, plan de sections, limites de caractères consolidées, liste des annexes, bibliothèque de réponses réutilisables ; « Award assistant » qui extrait délais et exigences des lettres d'accord ; synchro Google/Outlook ; post-accord (dépenses, budget/réel) ; **plan consultants** : profils par client, bascule sans reconnexion, envoi d'opportunités au client par e-mail, rapports PDF/CSV | Aime : temps de recherche divisé par deux, profils 990 (montant médian, ouverture aux nouveaux), rappels e-mail. Reproche : prix, gestion multi-clients perfectible, pas d'intégration Asana, rapports limités | Discover 299 USD/mois, Pre-Award 499, Full Lifecycle 999 (annuel) ; 349/579/1'159 en mensuel ; essai 14 j | [instrumentl.com/pricing](https://www.instrumentl.com/pricing), [consultants](https://instrumentl.com/solutions/grant-writing-consultants), [blog IA](https://www.instrumentl.com/blog/best-ai-for-grant-writing), [avis Capterra](https://www.capterra.com/p/233384/Instrumentl/reviews/), [GetApp](https://www.getapp.com/nonprofit-software/a/instrumentl) |
| **Candid (Foundation Directory / Candid Search)** | US | Historique de dons détaillé, « Fundraising assistant » qui rend une liste de financeurs avec la raison du match et rédige une lettre d'intention et un budget estimatif ; financeurs de vos pairs ; tableaux de bord ; « Landscapes » (visualisation du paysage des financements) et statut de conformité dans Ultimate | Force reconnue : profondeur des données de dons | Premium 219 USD/mois ou 2'199 USD/an ; Ultimate 2'499 USD/an (page officielle) ; des tiers citent d'autres montants | [candid.org/candid-search](https://candid.org/candid-search/), [grantsights (tiers, concurrent)](https://grantsights.com/blog/candid-foundation-directory-pricing) |
| **Grantable** | US | Bibliothèque de contenus (propositions, chiffres) réinjectée dans les brouillons ; appel converti en checklist ; rédaction section par section ; « Prospecting desk » (score + raisons en langage clair) ; **routines planifiées** de veille ; **Agency Hub** : tableaux multi-clients, facturation consolidée, rapports transversaux, bibliothèques partagées | Point faible relevé par un concurrent : peu de recherche de financeurs historiquement (corrigé depuis selon la page officielle) | Gratuit ; Starter 50 USD/mois ; Pro 150 ; Agency Hub +300 USD/mois | [grantable.co](https://grantable.co/) |
| **Granter.ai** | PT (UE) | Matching IA sur fonds publics UE, brouillon de candidature, relecture par expert, suivi après octroi | Modèle hybride IA + expert | « SMART Application Package » dès 500 EUR + 2 % au succès (annuaire tiers, juillet 2024) | [toolify (tiers)](https://www.toolify.ai/tool/granter-ai), [Portugal Global](https://www.portugalglobal.pt/en/news/portuguese-ai-startup-generates-applications-for-eu-funding/) |
| **GrantStation** | US | Annuaire de financeurs, tableau de bord, recherches sauvegardées, **alertes financeurs**, tutoriels, lettre hebdo « Insider » | Prix bas via associations | 699 USD/an prix public, 75 à 199 USD via partenaires | [Nonprofit Maine](https://www.nonprofitmaine.org/grantstation), [TechSoup](https://support.techsoup.org/hc/en-us/articles/29273095360027-GrantStation-Savings-on-TechSoup) |
| **OpenGrants** | US | Matching IA, rédacteur IA, chatbot 24/7, suivi des demandes ; **place de marché de consultants** | | 29 USD/mois ou 228 USD/an par utilisateur ; ancienne commission plateforme 20 % (page 2021, à vérifier) | [opengrants.io](https://www.opengrants.io/?p=4366), [roadmap](https://opengrants.io/product-roadmap/) |
| **GrantMatch** (racheté par BDO Canada) | CA | 10'000+ programmes publics, algorithme de matching ; **benchmark sur 1,6 million d'octrois historiques** ; **FAST**, score d'éligibilité « comme un score de crédit » ; Hub en libre-service PME | | Non publié | [BDO](https://www.bdo.ca/fr-ca/about/news/bdo-canada-acquires-grantmatch), [communiqué 2020](https://www.globenewswire.com/de/news-release/2020/10/13/2107945/0/en/GrantMatch-Canada-s-Leading-Government-Incentives-Firm-is-Expanding-its-Software-Platform-to-Assist-Companies-in-Accessing-COVID-19-Stimulus-Funding.html) |
| **FundsforNGOs Premium** | Intl | 5'000+ profils de bailleurs, alertes prioritaires, bibliothèque de guides, webinaires | | Prix non trouvé | [fundsforngos.org](https://www.fundsforngos.org/?p=64664) |
| **Spheriq** (ex-StiftungSchweiz) | CH | Registre des fondations, listes intelligentes, assistant IA, gestion des demandes (côté fondations), plateforme de dons SpendenSchweiz ; partenariat SwissFoundations et proFonds ; actionnaire ZKB | Concurrent suisse direct sur la recherche ; CGU interdisant l'extraction (voir audit Spheriq) | Experts/ONG : gratuit ; Starter CHF 300/an ; Pro CHF 650/an ; Partner dès CHF 1'650/an (HT) | [spheriq.ch/en/prices](https://spheriq.ch/en/prices/), [ZKB](https://www.zkb.ch/de/blog/themen/aus-stiftungschweiz-wird-spheriq.html) |
| **Fundraiso** | CH | Annuaire CH/FL (inclut fondations cantonales et non inscrites), filtres géographie/thème, listes de favoris, exports, API | Accès offert aux chercheurs (Uni Berne) | Gratuit (20 résultats) ; payant « dès CHF 290/an » ; Enterprise sur devis | [fundraiso.ch/en/pricing](https://www.fundraiso.ch/en/pricing), [Uni Berne](https://unibe.ch/research/funding_and_prizes/funding_search/fundraiso/index_eng.html) |

### 1.2 Outils côté fondations (pour comprendre ce que voit l'examinateur)

| Outil | Ce qui compte pour Appui | Prix | Source |
|---|---|---|---|
| **Fluxx Grantmaker** | Les examinateurs notent **sur une grille, côte à côte avec le dossier** ; totaux, moyennes, pondérations, classements ; critères d'éligibilité par appel. Conséquence : un dossier gagne s'il répond critère par critère | Dès 13'000 USD/an + mise en place (Capterra ; une autre fiche dit autre chose) | [TechImpact](https://guides.techimpact.org/grants-management-systems/?p=474), [Capterra](https://www.capterra.com/p/186702/Fluxx-Grantseeker/) |
| **Submittable** | Expérience candidat très soignée, notation et revue au même endroit (4,8/5 sur 398 avis Capterra) | Sur devis | [Capterra](https://www.capterra.ca/reviews/158382/submittable), [G2](https://www.g2.com/compare/blackbaud-grantmaking-vs-submittable) |
| **Bonterra (CyberGrants)** | Questionnaires de pré-qualification ; plainte côté demandeurs : un compte par fondation, connexion pénible. Conséquence : la mémoire des identifiants de portails par client a de la valeur | Non publié | [GetApp](https://www.getapp.com/nonprofit-software/a/bonterra-grants-management/), [Plinth](https://www.plinth.org.uk/complete-guide/bonterra-grants-management-review) |
| **Salesforce Nonprofit Cloud (Grantmaking)** | Portails « grantseeker » et « grantee », gestion des budgets de demande | Enterprise 175 USD, Unlimited 225 USD par utilisateur/mois (pages régionales, chiffres contradictoires) | [Salesforce AP](https://www.salesforce.com/ap/nonprofit/grantmaking-pricing/), [guide US PDF](https://www.salesforce.com/en-us/wp-content/uploads/sites/4/Salesforce-for-Nonprofits-Pricing-Guide.pdf) |

### 1.3 Outils de flux et d'enrichissement (modèles d'usage)

| Outil | Mécanisme à reprendre | Prix | Source |
|---|---|---|---|
| **Clay** | Enrichissement en cascade (plusieurs sources jusqu'à trouver la donnée) ; agent de recherche web « Claygent » sur chaque ligne ; exécutions planifiées | Gratuit (200 lignes/table) ; Launch 185 USD/mois ; Growth 495 (tiers, après mars 2026) | [Crustdata (tiers)](https://crustdata.com/reviews/clay) |
| **Apollo** | Séquences multi-étapes ; **alertes de changement** (poste) qui déclenchent une action ; « Plays » sur signaux | Basic 49, Professional 79, Organization 119 USD/utilisateur/mois (annuel) | [Apollo vs FullEnrich](https://www.apollo.io/insights/apollo-vs-fullenrich), [aide Apollo](https://knowledge.apollo.io/hc/en-us/articles/5130064363661) |
| **Linear** | **Boîte de triage** avec raccourcis (accepter, doublon, refuser, reporter), règles automatiques, SLA par priorité | Triage sur tous les plans ; SLA Business/Enterprise | [linear.app/docs/triage](https://linear.app/docs/triage), [guide routage](https://linear.app/enablement/guide/routing) |
| **HubSpot** | Pipelines personnalisés ; séquences qui s'arrêtent si le contact répond ; journal d'activités | Non vérifié sur page officielle | [Supademo (tiers)](https://supademo.com/blog/guides/how-to-create-sequences-in-hubspot) |
| **FundraisingBox** | Logiciel de dons arrivé en Suisse en septembre 2024 (Twint, CRM, 2'000+ organisations clientes, tous pays) : ce que les clients associatifs de Levier utilisent peut-être déjà | Prix non trouvé | [communiqué](https://www.prnewswire.com/de/pressemitteilungen/fundraisingbox-startet-in-der-schweiz-innovative-digitale-fundraising-losungen-mit-lokaler-zahlungsintegration-fur-schweizer-npos-302235820.html), [Capterra](https://www.capterra.com/p/213681/FundraisingBox/reviews/) |

## 2. Ce que réclament les rédacteurs de demandes (synthèse des avis)

1. **Moins de recherche manuelle** : l'argument n° 1 des avis Instrumentl (« reduced our grant research time by more than 50 % », Capterra).
2. **Des données de générosité, pas seulement des buts** : montant médian, fourchette, part de nouveaux bénéficiaires ; un avis dit avoir obtenu des montants plus élevés grâce à ces données (Capterra).
3. **Des rappels fiables** et une vue calendrier ; la vue chronologique devient « fastidieuse » en fin d'année (Capterra).
4. **Mieux gérer plusieurs clients** : demande explicite d'un consultant gérant plus d'une association (Capterra).
5. **Des rapports exportables** plus souples (GetApp, Grantseeker sur Capterra : retour aux tableurs faute de rapports adaptés).
6. **Des intégrations** avec l'outil de tâches existant (Asana cité).
7. **Ne pas ressaisir** : Fluxx met en avant l'absence de ressaisie ; Bonterra est critiqué pour l'inverse.
8. **Une bibliothèque cloisonnée par client**, pour qu'un texte d'un client ne fuie pas chez un autre (point non couvert par les outils trouvés : à faire mieux qu'eux).

## 3. Idées de fonctionnalités (38)

Légende. **Temps** et **Réussite** : impact de 0 à 3 sur le temps du conseiller et sur le taux d'accord. **Effort** : F (faible, moins d'une semaine), M (moyen, 1 à 3 semaines), E (élevé, plus d'un mois). **Dépendances** : IA = LLM Infomaniak (voir architecture du 21.10.2026), Données = source à intégrer.

### (a) Gains de temps immédiats

| # | Fonctionnalité | Temps | Réussite | Effort | Qui le fait | Adaptation suisse | Dépendances |
|---|---|---|---|---|---|---|---|
| A1 | **File « Aujourd'hui »** façon triage : toutes les actions du jour, tous clients confondus (relance due, délai à J-14, réponse reçue, validation client en attente), traitées au clavier : faire, reporter, déléguer, ignorer | 3 | 1 | F | Linear (triage, raccourcis, règles, SLA) | Échéances calées sur les séances des conseils de fondation ; fériés cantonaux | Pipeline existant |
| A2 | **Lecture automatique du règlement / formulaire** de la fondation (PDF ou page) : critères, pièces exigées, limites de caractères, montant max, délai ; checklist générée et cochée au fil du dossier | 3 | 2 | M | Instrumentl Apply (analyse de l'appel, liste des annexes, limites consolidées), Grantable (appel en checklist) | Règlements FR/DE/IT ; extraction dans la langue d'origine, affichage en FR | IA, crawl |
| A3 | **Bibliothèque de blocs par client** (mission, équipe, budget, impact chiffré, revue de presse) en FR/DE/EN, datés, avec alerte « chiffre de plus de 12 mois » ; réutilisés par l'IA dans chaque lettre | 3 | 2 | M | Grantable (content library), Instrumentl (Cross-Grant Knowledge Library) | Trois langues alignées ; cloisonnement strict par client (nLPD art. 6, finalité) | IA, stockage documents |
| A4 | **Assistant de remplissage des formulaires en ligne** des fondations : pour chaque champ, la réponse proposée à copier, avec compteur de caractères | 2 | 1 | E | Instrumentl (formulaires dans l'application), Fluxx (pas de ressaisie) | Beaucoup de fondations suisses passent à des portails (dont Spheriq côté fondations) | IA, extension navigateur éventuelle |
| A5 | **Lecture des réponses** (accord, refus, demande de complément) : montant, conditions, rapports dus, motif de refus ; mise à jour du pipeline et de la mémoire | 2 | 1 | F | Instrumentl Award assistant | Lettres FR/DE ; motifs de refus normalisés (hors but, budget épuisé, géographie) | IA |
| A6 | **Synchro calendrier** (ICS/CalDAV) des délais, séances et relances | 2 | 0 | F | Instrumentl (Google, Outlook) | Calendrier Infomaniak (CalDAV), données en Suisse | Aucune |
| A7 | **Veille planifiée des fondations ciblées** : relecture hebdomadaire du site (nouveau délai, nouveau règlement, appel thématique, pause des demandes) et alerte | 2 | 2 | M | Grantable (routines planifiées), GrantStation (alertes), Instrumentl (matching continu) | Respect robots.txt ; sites FR/DE | Crawl, IA |
| A8 | **Assistant conversationnel sur la base de l'agence** : « quelles fondations vaudoises ont accordé plus de CHF 10'000 à un projet culturel ? », « qui nous a refusé pour budget épuisé cette année ? » | 2 | 1 | M | Spheriq (assistant IA), Candid (Fundraising assistant) | Requêtes sur Loterie Romande, ASF, As-So, mémoire | IA, base structurée |
| A9 | **Préparation par lots** : générer 10 lettres d'un client, puis les relire dans une file de validation côte à côte (lettre / but statutaire / checklist) | 2 | 1 | M | Fluxx (revue côte à côte) | Langue proposée selon la langue du but | IA |
| A10 | **Devis et suivi des honoraires** par client depuis la fiche (forfait × nombre de fondations, heures passées) ; export pour la facture | 1 | 0 | F | Grantable Agency Hub (facturation consolidée) | CHF, TVA, QR-facture (via l'outil comptable existant) | Aucune |
| A11 | **Dictée après un appel** à une fondation : note vocale transcrite, résumée et classée dans la mémoire de la fondation | 1 | 1 | F | Journal d'activités CRM (HubSpot) | Transcription hébergée en Suisse si possible ; pas d'enregistrement de tiers sans accord | IA (transcription) |

### (b) Qualité des dossiers

| # | Fonctionnalité | Temps | Réussite | Effort | Qui le fait | Adaptation suisse | Dépendances |
|---|---|---|---|---|---|---|---|
| B1 | **Relecture « comme le conseil de fondation »** : l'IA note la lettre critère par critère selon le but statutaire et le règlement (grille pondérée), liste les manques avant dépôt | 1 | 3 | F | Fluxx et Submittable (grilles de notation des examinateurs), Grantable (détection des manques) | Critères fréquents en Suisse : ancrage local, cofinancement, exonération, budget détaillé | IA, A2 |
| B2 | **Pairs financés** : « cette fondation a déjà soutenu des projets comme le vôtre » avec les exemples (bénéficiaire, année, montant) | 1 | 3 | M | Instrumentl (peer prospecting, non disponible sur ses plans consultants), Candid (pairs) | Loterie Romande (5'658 soutiens 2025 déjà intégrés), rapports annuels des fondations, mémoire d'agence | Données |
| B3 | **Montant à demander recommandé** : fourchette par fondation (médiane observée, plafond du règlement, historique de l'agence) | 0 | 3 | M | Instrumentl (montant médian issu des 990), GrantMatch (benchmark sur octrois historiques) | Pas de 990 en Suisse : reconstruire depuis Loterie Romande, rapports annuels, mémoire | Données, B2 |
| B4 | **Plan de financement multi-sources** : fondations + Loterie Romande + commune + canton + fonds propres, avec taux de couverture ; joint à chaque demande | 2 | 2 | M | Instrumentl (import de budgets) | Les fondations suisses demandent souvent qui d'autre finance ; subventions publiques cantonales et communales | Aucune |
| B5 | **Contrôle d'éligibilité du client** : statut au RC, forme juridique, exonération, comptes et statuts à jour, label ZEWO le cas échéant ; feu rouge si une pièce manque | 1 | 2 | M | Candid Ultimate (statut de conformité) | Zefix/LINDAS pour le statut ; exonération : pas de liste publique à Genève ni Vaud, donc attestation fiscale à déposer par le client | Données |
| B6 | **Vérification « chaque affirmation sourcée »** : chaque phrase de la lettre est reliée à un bloc du dossier client ; les phrases sans source sont surlignées | 1 | 2 | M | Aucun outil ne l'affiche clairement : différenciation possible | Crédibilité auprès de fondations suisses attentives à l'exactitude | IA, A3 |
| B7 | **Langue et registre de la fondation** : lettre en DE avec orthographe suisse (« ss »), formules d'usage, vouvoiement ; IT pour le Tessin | 1 | 2 | F | Pas d'équivalent ciblé | 60 % des fondations en Suisse alémanique (audit du 21.10.2026) | IA, glossaire |
| B8 | **Apprentissage du style** : écart entre brouillon IA et version envoyée mesuré et réinjecté (exemples préférés d'Alexandre) | 2 | 1 | F | Instrumentl (historique des versions) | | IA |
| B9 | **Bibliothèque de lettres gagnantes** (anonymisées) par type de fondation et domaine | 1 | 2 | F | Instrumentl (« winning responses ») | Cloisonnement : réutiliser la structure, jamais les données d'un autre client | A5 |
| B10 | **Pièces jointes générées** : budget de projet, plan de financement, fiche projet d'une page, au format du client | 2 | 1 | M | Instrumentl (checklist d'annexes) | Modèles Word en CHF | A3, B4 |

### (c) Suivi et relation avec les fondations

| # | Fonctionnalité | Temps | Réussite | Effort | Qui le fait | Adaptation suisse | Dépendances |
|---|---|---|---|---|---|---|---|
| C1 | **Après l'accord** : échéancier des rapports et justificatifs dus, brouillon de rapport intermédiaire et final, lettre de remerciement | 2 | 2 | M | Instrumentl Full Lifecycle et Award assistant | Fondations suisses : rapport et décompte exigés avant tout nouveau soutien | A5, IA |
| C2 | **Politique anti-saturation** : plafond de sollicitations par fondation et par trimestre, tous clients confondus, et arbitrage entre clients | 1 | 2 | F | Aucun (problème propre aux agences) | Petit marché romand : réputation de Levier auprès des secrétariats de fondation | Mémoire existante |
| C3 | **Veille officielle FOSC / Zefix** : liquidation, changement de but, nouvelle fondation donatrice, déménagement ; alerte sur les dossiers ouverts | 1 | 2 | M | Apollo (alertes de changement qui déclenchent une action) | Amtsblattportal (API publique), ZefixPublicREST `sogc/bydate`, LINDAS | Données |
| C4 | **Benchmark interne par fondation** : délai réel de réponse, taux d'accord, montant moyen accordé à Levier, motifs de refus | 1 | 2 | F | GrantMatch (benchmark sur octrois historiques) | Actif propre de Levier, non copiable | A5 |
| C5 | **Calendrier des séances** des conseils de fondation (2 à 4 décisions par an, souvent) et date de dépôt conseillée | 1 | 2 | M | Pas d'équivalent direct | Information souvent sur le site ou au téléphone : à saisir dans la mémoire | A7 |
| C6 | **Contacts institutionnels** : secrétariat, rôle, canal préféré, historique des échanges par fondation, partagé entre conseillers | 1 | 1 | F | HubSpot (journal d'activités), Instrumentl (contacts exportables) | nLPD : coordonnées professionnelles publiées seulement, finalité limitée, pas de membres du conseil en base | Aucune |
| C7 | **Relances en séquence** (J+21, J+45, après séance) avec arrêt automatique si une réponse arrive ; toujours en brouillon validé | 2 | 1 | M | HubSpot et Apollo (séquences qui s'arrêtent à la réponse) | Envoi depuis l'adresse du client ou de Levier, jamais de masse | Intégration e-mail |
| C8 | **Lecture de la boîte de réception** (IMAP Infomaniak) : rattachement des réponses au bon dossier | 2 | 0 | E | HubSpot (journalisation e-mail) | Hébergement en Suisse ; accès limité à une adresse dédiée | Intégration e-mail, IA |
| C9 | **Mémoire des portails** : quel compte, quel identifiant (sans mot de passe en clair), quel format par fondation | 1 | 0 | F | Réponse à la plainte Bonterra (un compte par financeur) | Mots de passe dans un gestionnaire, jamais dans Appui | Aucune |

### (d) Livrables clients sans connexion

| # | Fonctionnalité | Temps | Réussite | Effort | Qui le fait | Adaptation suisse | Dépendances |
|---|---|---|---|---|---|---|---|
| D1 | **Rapport mensuel PDF automatique** par client : démarches, fondations sollicitées, CHF demandés / obtenus, refus et leçons, prochaines étapes ; envoyé après relecture | 2 | 0 | F | Instrumentl (rapports PDF/CSV), Grantable Agency Hub (rapports transversaux) | FR/DE selon client ; montants en CHF ; format 07.10.2026 | Pipeline |
| D2 | **Carte des financeurs** : carte de Suisse des fondations ciblées et des pairs financés, par canton et domaine, avec statut | 1 | 0 | M | Candid Ultimate (« Landscapes ») | Communes OFS déjà en base (LINDAS), fond de carte swisstopo | Données géographiques |
| D3 | **Récap hebdo en trois lignes** par e-mail au client (fait, en attente, décision attendue de sa part) | 1 | 0 | F | Instrumentl (envoi d'opportunités au client), lettre GrantStation | Brouillon validé par le conseiller, pas d'envoi automatique | D1 |
| D4 | **Stratégie de financement d'entrée** : document de démarrage (30 fondations classées, raisons citées, montant potentiel, calendrier sur 12 mois) | 2 | 1 | F | Candid (liste de financeurs avec raisons) | Base Appui + Loterie Romande | Matching existant, B3 |
| D5 | **Bilan de fin de mandat** : CHF obtenus, rapport honoraires / fonds levés, fondations à recontacter l'an prochain | 1 | 0 | F | Aucun outil ne le fait pour le compte du consultant | Sert de référence commerciale (avec accord du client) | C4 |
| D6 | **Portail refait** : lien magique, validation de la lettre avec commentaires en marge, dépôt de pièces par le client | 1 | 1 | M | Submittable (expérience candidat), Instrumentl (comptes clients liés) | Journal d'accès (nLPD), hébergement Infomaniak | Comptes |

### (e) Prospection de nouvelles associations

| # | Fonctionnalité | Temps | Réussite | Effort | Qui le fait | Adaptation suisse | Dépendances |
|---|---|---|---|---|---|---|---|
| E1 | **Diagnostic offert** : page publique où une association saisit son nom ou son UID, reçoit 5 fondations compatibles avec la raison citée et un appel à prendre rendez-vous | 0 | 0 | M | Candid (accès gratuit), Spheriq (offre gratuite), essai Instrumentl | Recherche UID via Zefix ; consentement explicite avant tout suivi (LCD, nLPD) | Matching existant |
| E2 | **Rapport offert personnalisé** (2 pages) remis lors d'un premier contact individuel : 5 fondations, pourquoi, montant indicatif | 0 | 0 | F | Clay (agent de recherche par ligne), Candid (lettre d'intention) | Envoi individuel et personnalisé, pas de masse ; adresse générique de l'organisation | D4 |
| E3 | **Repérage de prospects** : associations et fondations opérationnelles récemment inscrites (FOSC), bénéficiaires de la Loterie Romande qui cherchent déjà des fonds | 0 | 0 | M | Apollo et Clay (signaux), GrantMatch Hub | Sources publiques ; LCD art. 3 al. 1 let. o : pas d'envoi automatisé de masse sans consentement | Données |
| E4 | **Enrichissement en cascade** des prospects : site, domaine, taille, contact générique, présence sur les réseaux | 0 | 0 | M | Clay (enrichissement en cascade) | Pas de données de personnes privées ; finalité documentée | Crawl, IA |
| E5 | **Baromètre romand des fondations** (trimestriel, public) : nouvelles fondations, tendances Loterie Romande, conseils de dépôt ; support LinkedIn et lettre d'information avec inscription | 0 | 0 | F | GrantStation Insider, FundsforNGOs (alertes) | Données publiques citées ; inscription en double opt-in | C3, Loterie Romande |

## 4. Classement global (Temps + Réussite, puis effort)

| Rang | # | Fonctionnalité | T+R | Effort |
|---|---|---|---|---|
| 1 | A2 | Lecture automatique du règlement → checklist | 5 | M |
| 2 | A3 | Bibliothèque de blocs par client FR/DE/EN | 5 | M |
| 3 | A1 | File « Aujourd'hui » | 4 | F |
| 4 | B1 | Relecture « comme le conseil de fondation » | 4 | F |
| 5 | A7 | Veille planifiée des fondations ciblées | 4 | M |
| 6 | B2 | Pairs financés | 4 | M |
| 7 | B4 | Plan de financement multi-sources | 4 | M |
| 8 | C1 | Après l'accord : rapports et remerciements | 4 | M |
| 9 | B3 | Montant à demander | 3 | M |
| 10 | B7 | Langue et registre (DE suisse, IT) | 3 | F |
| 11 | B8, B9, C2, C4, A5, D4 | (F, T+R = 3) | 3 | F |
| 12 | A8, A9, B5, B6, B10, C3, C5, C7 | (M, T+R = 3) | 3 | M |
| ensuite | D1, D3, D5, E2, E5 | Faible impact direct, fort impact commercial | | F |

Les livrables (d) et la prospection (e) ont un impact nul sur le temps ou la réussite des dossiers, mais ce sont eux qui font vendre des mandats : le top 10 ci-dessous en garde deux.

## 5. Top 10 à intégrer en premier

Ordre de réalisation conseillé (dépendances respectées), pas d'importance.

| Ordre | Fonctionnalité | Pourquoi d'abord | Effort |
|---|---|---|---|
| 1 | **A1 File « Aujourd'hui »** (avec A6 synchro calendrier) | Le conseiller ouvre Appui chaque matin pour ça ; rien d'autre ne crée l'habitude | F |
| 2 | **A3 Bibliothèque de blocs par client** | Socle de toutes les lettres, pièces et rapports ; supprime la ressaisie | M |
| 3 | **A2 Lecture du règlement → checklist** | Le plus gros temps caché : lire les conditions de chaque fondation | M |
| 4 | **B1 Relecture « conseil de fondation »** (avec B6 phrases sourcées) | Les fondations notent sur grille (Fluxx, Submittable) : on note avant elles | F |
| 5 | **B2 + B3 Pairs financés et montant à demander** | Le signal qui fait monter les montants obtenus selon les avis Instrumentl ; données Loterie Romande déjà là | M |
| 6 | **A7 Veille planifiée des fondations** (alimente C5 séances) | Les délais sont la faiblesse n° 1 relevée par l'audit du 21.10.2026 | M |
| 7 | **A5 + C1 Lecture des réponses et suivi après accord** | Ferme la boucle, nourrit la mémoire d'agence, fidélise les fondations | M |
| 8 | **C2 Politique anti-saturation** (avec C4 benchmark interne) | Protège la réputation de Levier ; aucun concurrent ne le fait | F |
| 9 | **D1 Rapport mensuel PDF** (avec D3 récap hebdo) | Le client voit le travail sans se connecter ; argument de renouvellement | F |
| 10 | **D4 Stratégie d'entrée + E2 rapport offert** | Même moteur pour onboarder un client et ouvrir une prise de contact | F |

Hors top 10 mais à planifier : C3 veille FOSC (dès que la base dépasse 30 dossiers ouverts), B4 plan de financement, B7 registre DE/IT, D2 carte des financeurs (impact commercial fort en rendez-vous).

## 6. Garde-fous suisses

- **nLPD** : pas de membres de conseil de fondation en base (déjà la règle du 21.10.2026) ; cloisonnement des bibliothèques par client ; journal d'accès ; si un modèle d'IA ou un hébergeur est hors de Suisse, garanties de transfert de l'art. 16 nLPD (guide du PFPDT : [edoeb.admin.ch](https://WWW.EDOEB.ADMIN.CH/dam/edoeb/fr/Dokumente/datenschutz/Anleitung%20f%C3%BCr%20die%20Pr%C3%BCfung%20von%20Daten%C3%BCbermittlungen%20mit%20Auslandbezug%20FR%20V1.1%20(3).pdf.download.pdf/Anleitung%20f%C3%BCr%20die%20Pr%C3%BCfung%20von%20Daten%C3%BCbermittlungen%20mit%20Auslandbezug%20FR%20V1.1%20(3).pdf)). Préférer l'IA Infomaniak.
- **LCD art. 3 al. 1 let. o** : l'envoi automatisé de publicité de masse par e-mail exige un consentement préalable, l'identification de l'expéditeur et un lien de désinscription ([OFCOM](https://www.bakom.admin.ch/en/when-is-mass-sending-allowed)). La prospection (e) reste donc individuelle et personnalisée ; la lettre d'information passe par un double opt-in. Texte exact à vérifier sur Fedlex avant lancement.
- **Exonération fiscale** : Genève ne publie plus la liste des institutions exonérées (secret fiscal) et Vaud n'a pas de registre public ([Le Temps](https://www.letemps.ch/economie/investir-autrement-don-letat-encourage-donation-deductions-fiscales), [UNIGE](https://unige.ch/philanthropie/download_file/489/0)) : B5 repose sur l'attestation fournie par le client.
- **Honoraires** : ne pas reprendre le modèle au succès de Granter.ai (2 %) ni la commission d'OpenGrants : Levier facture des honoraires fixes (déontologie Swissfundraising, règle du projet). A10 et D5 restent en forfait.
- **Diagnostic public (E1)** : à greffer sur la page `landing/` existante, sans afficher de taux de réussite tant qu'il n'y a pas de chiffres réels.
- **Spheriq et Fundraiso** : ne pas extraire leurs bases (CGU, voir audit Spheriq du 21.10.2026). Se différencier par le service (lettre par fondation, mémoire, livrables), pas par l'annuaire.
- **Loterie Romande** : les contributions doivent être publiées par les organes de répartition (art. 128 al. 1 LJAr, cité dans le questionnaire CPOR : [gespa.ch](https://www.gespa.ch/download/pictures/a6/lg6qnmcph2bk0vfwy4j72mw019qcm7/cpor_formulaire_2023.pdf)) : source durable pour B2 et B3, à rafraîchir chaque année.

## 7. Sources complémentaires (consultées le 22.10.2026)

- Instrumentl, avis : [Capterra](https://www.capterra.com/p/233384/Instrumentl/reviews/), [Software Advice](https://www.softwareadvice.com/grant-management/instrumentl-profile/), [blog gestion des clients](https://www.instrumentl.com/blog/grant-consulting-client-management)
- Spheriq, contexte : [communiqué de relance 01.10.2025](https://spheriq.ch/wp-content/uploads/2025/10/DE_Medienmitteilung-Relaunch-Spheriq-1.10.2025.pdf), [support](https://support.spheriq.ch/en/articles/424288-stiftungschweiz-becomes-spheriq)
- Fundraiso : [fondations en Suisse](https://www.fundraiso.com/de/page/stiftungen-schweiz-de)
- Registre fédéral : [EFK, 13'375 fondations dont 36 % sous surveillance fédérale (rapport 2022)](https://efk.admin.ch/wp-content/uploads/publikationen/berichte/wirtschaft_und_verwaltung/diverses/21267/21267be-endgueltige-fassung-v04.pdf)
- LINDAS : [culture.ld.admin.ch, à propos](https://culture.ld.admin.ch/ecosystem/about-LINDAS) ; Zefix sur LINDAS : [opendata.swiss](https://opendata.swiss/en/dataset/zefix-zentraler-firmenindex/resource/0b0bf0ff-d8d4-4db9-bad7-d4381a282db7)
- FOSC : [client non officiel de l'API Amtsblattportal (piste, non vérifié)](https://pypi.org/project/shab-parser/)
- Loterie Romande, Vaud : [règlement de répartition 2021](https://vd.ch/fileadmin/user_upload/accueil/fichiers_pdf/2021_octobre_actus/R%C3%A8glement_sur_la_r%C3%A9partition_du_b%C3%A9n%C3%A9fice_net_r%C3%A9siduel_des_loteries_et_paris_sportifs_de_grand_envergure.akn.pdf)

## Décisions à prendre par Tim

1. Valider le top 10 et l'ordre (proposition : 1 à 4 dans le premier sprint de deux semaines, à mesurer sur les 2 clients test de l'audit).
2. Choisir si la prospection (e) est confiée à Appui ou reste manuelle chez Levier : impact LCD et image de marque.
3. Décider si D2 (carte) et E1 (diagnostic public) justifient une page publique, donc un déploiement à faire valider avant publication.
