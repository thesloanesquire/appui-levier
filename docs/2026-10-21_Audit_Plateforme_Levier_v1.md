# Audit de la plateforme Levier : ce qu'il faut améliorer, selon l'usage réel

21.10.2026 · prototype v0.2 (`src/`) · sources : audit Spheriq, cartographie des données, architecture Infomaniak (même dossier `docs/`)

## Verdict en trois lignes

1. Le prototype démontre le bon mécanisme : base nationale réelle (17'779 fondations, 14'980 retenues), matching expliqué qui cite le but statutaire, lettre sur mesure, suivi et portail client. Aucun concurrent suisse ne combine multi-clients + lettre par fondation + délais.
2. Ses trois faiblesses bloquantes pour un usage réel : le matching repose sur des mots-clés (pas encore d'IA), il ne connaît ni les délais ni les montants des fondations, et il n'y a ni comptes ni serveur (tout vit dans un navigateur).
3. Avant d'investir dans l'IA, il faut tester l'outil sur 2 vrais clients de Levier pendant 4 semaines et mesurer : temps par lettre, taux de réponse, taux d'accord.

## 0. Déjà réalisé le 21.10.2026 (v0.3)

- Bot IA (`scripts/bot_fondations.py`) : critères établis par l'IA, recherche, évaluation avec citations vérifiées, résultats dans l'application.
- Répertoires officiels intégrés : ASF (5'379 fondations), As-So (1'281, sous-types de l'autorité), Loterie Romande 2025 (5'658 soutiens, onglet par client).
- Mémoire de l'agence par fondation (délai, montant habituel, modalités, notes) + alerte si la fondation est déjà sollicitée pour un autre client.
- Refus avec motif, date de dépôt modifiable, export Word, champs « À éviter » et « Exonération fiscale » dans le profil.
- Polices auto-hébergées : l'application fonctionne hors connexion.

## 1. Parcours par parcours : ce qui manque

### A. Le conseiller, chaque matin (Aperçu)

| Constat | Amélioration | Impact | Effort |
|---|---|---|---|
| Les échéances sont fictives : aucune source ne donne les délais de dépôt des fondations | Champ « délai » saisi à la qualification + extraction automatique depuis le site de la fondation (crawl, phase 2) | Élevé | Moyen |
| « À faire » mélange urgence et routine | Trois blocs : aujourd'hui / cette semaine / à planifier ; rappel e-mail quotidien à 8 h | Moyen | Faible |
| Pas de vue charge par conseiller | Attribution d'un conseiller par client, filtre « mes dossiers » | Moyen (dès 2 conseillers) | Faible |
| Aucune mesure de performance | Tableau de bord : taux de réponse, taux d'accord, CHF obtenus par heure passée, délai moyen de réponse par fondation | Élevé (argument commercial) | Moyen |

### B. Arrivée d'un nouveau client (Nouveau client)

| Constat | Amélioration | Impact | Effort |
|---|---|---|---|
| Le navigateur ne peut pas lire la plupart des sites (CORS) | Lecture côté serveur : crawl de 5 à 15 pages, extraction du profil en JSON par le LLM Infomaniak (prompt prêt dans l'architecture) | Élevé | Moyen |
| Le profil n'a pas de champs « exclusions » | Ajouter : ce que le client ne veut pas (ex. fondations religieuses), statut fiscal (exonéré ou non), forme juridique | Élevé (beaucoup de fondations exigent l'exonération) | Faible |
| Pas de documents | Dépôt des statuts, comptes, budget, rapport : réutilisés comme annexes de chaque demande | Élevé | Moyen |
| Pas de devis | Générer l'offre d'honoraires fixes depuis la fiche (nombre de fondations × forfait) | Moyen | Faible |

### C. Matching (onglet Fondations)

| Constat | Amélioration | Impact | Effort |
|---|---|---|---|
| Classement par mots-clés : quelques faux positifs (fondations actives à l'étranger, buts très larges) | Embeddings (Qwen3-Embedding-8B, CHF 0.07 par million de tokens) + re-ranking LLM avec score et raisons en JSON | Très élevé | Moyen |
| Le type « donatrice » est deviné par des verbes | Croiser avec les répertoires des autorités de surveillance (ASF fédérale en XLSX, As-So en PDF) qui disent si la fondation est classique ou opérationnelle | Élevé | Moyen |
| Aucun montant ni bénéficiaire passé | Importer les listes de bénéficiaires (Loterie Romande ~5'000 soutiens/an, rapports annuels) : « a déjà financé des projets comme le vôtre » | Très élevé | Élevé |
| Pas de mémoire d'agence | Pour chaque fondation : réponses reçues, délais réels, montants accordés, motifs de refus, contact institutionnel. Alerte si la même fondation est ciblée pour deux clients le même mois | Très élevé (actif propre, non copiable) | Faible |
| Pas de raison de refus enregistrée | Bouton « Refus » avec motif (hors but, budget épuisé, géographie…) : nourrit le score | Élevé | Faible |

### D. Rédaction des lettres

| Constat | Amélioration | Impact | Effort |
|---|---|---|---|
| Lettres générées par règles : justes et sourcées, mais structure répétitive | Brouillon par LLM (Mistral-Small, non bêta) à partir du profil + but + mémoire, avec contrainte « chaque affirmation vient d'un fait du client » | Très élevé | Faible |
| DE et EN plus courtes que le FR | Lexique complet DE/EN ; détection de la langue du but (déjà faite) pour proposer la bonne langue | Élevé (Suisse alémanique = 60 % des fondations) | Faible |
| Pas de gabarits par type de fondation | Variantes : lettre courte (premier contact), dossier complet, formulaire en ligne (aide au remplissage champ par champ) | Élevé | Moyen |
| Pas de suivi des versions | Historique des versions et diff entre le brouillon IA et la version envoyée (mesure de la qualité du brouillon) | Moyen | Faible |
| Export | Export Word (.docx) en plus du PDF, avec en-tête du client | Moyen | Faible |

### E. Envoi, relances, réponses

| Constat | Amélioration | Impact | Effort |
|---|---|---|---|
| Le statut « Envoyée » est déclaratif | Envoi depuis l'adresse du client (lien mailto pré-rempli ou brouillon Gmail/Outlook) ; jamais d'envoi automatique en masse | Moyen | Faible |
| Relance à J+21 codée en dur | Relance paramétrable par fondation (selon délais observés) avec brouillon de relance | Moyen | Faible |
| Accord sans suivi | Après accord : échéancier des rapports dus à la fondation, rappel, modèle de rapport et de remerciement | Élevé (fidélise les fondations) | Moyen |

### F. Portail client

| Constat | Amélioration | Impact | Effort |
|---|---|---|---|
| Lien sans authentification (démo) | Lien magique par e-mail, accès limité à son dossier, journal des consultations | Bloquant pour la production | Moyen |
| Validation binaire | Commentaires dans la marge de la lettre, validation partielle | Élevé | Moyen |
| Pas de vue « argent » | Graphique objectif / demandé / obtenu dans le temps | Moyen | Faible |

## 2. Données : les prochaines sources, par ordre

1. **Registre du commerce via LINDAS** (fait) : 17'779 fondations, but social, commune, canton. Rafraîchissement hebdomadaire : relancer `scripts/lindas_fondations.py`.
2. **Répertoire de l'ASF (XLSX, 5'520 fondations surveillées)** et **As-So (PDF, VD/NE/JU, domaines attribués par l'autorité)** : demander l'accord de réutilisation par e-mail avant import.
3. **Loterie Romande, liste des soutiens** : montants et bénéficiaires réels, le meilleur signal pour le matching en Romandie.
4. **Sites et rapports annuels des fondations** (crawl qui respecte robots.txt) : délais, modalités, montants typiques.
5. **FOSC (API publique)** : créations, changements de but, liquidations, pour alerter sur les fondations dissoutes.

Exclus : la base de Spheriq (CGU ch. 5.1, 7.5, 10.13 : extraction et usage commercial interdits), Moneyhouse, Fundraiso.

## 3. Technique : passer du prototype à l'outil réel

| Étape | Contenu | Coût indicatif (à confirmer) |
|---|---|---|
| 1. Serveur | VPS Infomaniak, Docker Compose : Postgres 16 + pgvector, app, worker de crawl, sauvegarde chiffrée hors serveur | ~CHF 16 à 18 / mois HT (source : architecture, 21.10.2026) |
| 2. Comptes | Connexion agence (2 à 5 conseillers), liens magiques clients, rôles | Temps de dev |
| 3. IA | AI Services Infomaniak (API compatible OpenAI) : extraction du profil, embeddings, re-ranking, brouillons | ~CHF 3 à 55 / mois pour 20 clients selon modèle |
| 4. Journal nLPD | Qui a vu, généré, envoyé quoi ; pas de noms de membres de conseil dans la base ; registre des traitements | Temps de dev |

## 4. Ce qu'il ne faut pas faire

- Copier Spheriq (annuaire en libre-service à CHF 300 à 1'650 par an) : Levier vend un service, l'outil le rend plus rapide et plus crédible.
- Envoyer des lettres en masse : c'est l'argument « une lettre par fondation » qui convainc.
- Afficher des chiffres de réussite avant d'en avoir : le portail doit rester factuel.

## 5. Prochain test (une semaine)

1. Choisir 2 clients réels d'Alexandre (une association, un·e étudiant·e).
2. Saisir leurs profils, qualifier 10 fondations chacun, produire 10 lettres, chronométrer le temps par lettre (avant / avec l'outil).
3. Faire valider par les clients via le portail.
4. Mesurer à 6 semaines : réponses, accords, montant obtenu. Décider ensuite de l'étape serveur + IA.

## Points ouverts

- Accords à obtenir avant import : ASF, As-So, accès Zefix PublicREST (zefix@bj.admin.ch).
