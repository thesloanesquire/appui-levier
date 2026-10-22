# Levier : architecture du moteur de matching IA (client → fondations suisses), hébergé chez Infomaniak

Version 1, 21.10.2026. Toutes les pages citées ont été consultées le 21.10.2026. Prix hors TVA, tels qu'affichés par les fournisseurs. Toute valeur non trouvée sur une source officielle est marquée « à vérifier ».

---

## 0. Résumé en 10 lignes

1. Infomaniak propose aujourd'hui (21.10.2026) une API LLM compatible OpenAI, hébergée dans ses centres de données en Suisse, sans stockage des requêtes et sans entraînement sur les données.
2. Base URL compatible OpenAI (v2) : `https://api.infomaniak.com/2/ai/{product_id}/openai/v1` (endpoints `/chat/completions`, `/embeddings`, `/models`, `/completions`). Il existe aussi un re-ranker au format Cohere (`/2/ai/{product_id}/cohere/v2/rerank`) et un endpoint au format Anthropic (`/2/ai/{product_id}/anthropic/v1/messages`).
3. Modèle recommandé pour l'extraction, le re-ranking et les lettres : `mistralai/Mistral-Small-4-119B-2603` (CHF 0.20 / 0.75 par million de tokens en entrée / sortie, contexte de 256'000 tokens, pas en bêta).
4. Embeddings : `Qwen/Qwen3-Embedding-8B` (CHF 0.07 par million de tokens) ou `Bge Multilingual Gemma2` (CHF 0.065 par million de tokens).
5. La base des fondations peut être amorcée sans compte ni API payante : le registre du commerce est publié en open data sur LINDAS (SPARQL). Au 21.10.2026, on y trouve 17'779 fondations actives (forme juridique 0110), toutes avec leur but social.
6. PostgreSQL managé n'est **pas encore disponible** chez Infomaniak (« Bientôt disponible », seul MySQL est proposé). Postgres + pgvector doit donc tourner sur un VPS ou une instance Public Cloud.
7. Option recommandée : **A, tout chez Infomaniak**. Un VPS avec Docker Compose (Postgres 16 + pgvector, app, worker de crawl), plus Infomaniak AI Services.
8. Coût mensuel estimé (20 clients, 30 lettres par client) : hébergement de CHF 16.10 à 18.00, plus LLM d'environ CHF 3 (scénario économique) à CHF 55 (scénario prudent). Sauvegardes hors serveur : prix à vérifier.
9. Embarquer une fois les 13'000 fondations coûte en appels IA environ CHF 10 à 20 (classification, résumés de sites, embeddings).
10. Le vrai coût est le temps humain : relecture des lettres, qualité de la base, suivi des réponses.

---

## 1. Recherche : ce qu'Infomaniak offre réellement (21.10.2026)

### 1.1 AI Services (API LLM)

Sources :
- Présentation : https://www.infomaniak.com/fr/hebergement/ai-tools (redirige vers « AI Services »)
- Tarifs : https://www.infomaniak.com/fr/hebergement/ai-services/tarifs
- Modèles : https://www.infomaniak.com/fr/hebergement/ai-services/open-source-models
- Référence API (OpenAPI) : https://developer.infomaniak.com/openapi.json, interface : https://developer.infomaniak.com/docs/api
- Guide de démarrage : https://www.infomaniak.com/fr/support/faq/2845/getting-started-guide-ai-services-sovereign-ai-services

**Ce que disent les pages officielles :**
- L'API est « compatible OpenAI ». La description de l'endpoint précise : « OpenAI compatible chat completion ».
- Vie privée (citation de la page de présentation) : « Vos requêtes ne sont ni enregistrées ni utilisées pour entraîner les modèles ou améliorer nos services. »
- Localisation : les services IA tournent dans les data centers d'Infomaniak en Suisse. Le guide 2845 parle d'un traitement « de bout en bout en Suisse ».
- Conformité revendiquée : LPD et RGPD.
- Facturation à l'usage, sans engagement. Une carte bancaire est exigée à l'ouverture (mesure anti-fraude). On peut fixer une limite de dépense. Une facture impayée entraîne la suspension du service.
- Essai : « 1M de crédits gratuits » pendant un mois de test. La conversion de ces crédits en tokens ou en CHF n'est pas précisée : à vérifier.
- Un seul produit AI Services par organisation, mais plusieurs tokens API possibles.
- Fine-tuning sur ses propres données : non proposé pour l'instant (FAQ de la page).
- Modèles en bêta : Kimi-K2.6, Qwen3.5-397B, Qwen3.8-27B, Apertus-v1.5-70B. Ils peuvent changer. Pour le chemin critique, privilégier un modèle non bêta.

**Endpoints (extraits du fichier OpenAPI officiel) :**

| Usage | Méthode et chemin (hôte `https://api.infomaniak.com`) |
|---|---|
| Chat (compatible OpenAI) | `POST /2/ai/{product_id}/openai/v1/chat/completions` |
| Embeddings (compatible OpenAI) | `POST /2/ai/{product_id}/openai/v1/embeddings` |
| Liste des modèles | `GET /2/ai/{product_id}/openai/v1/models` ou `GET /1/ai/models` (indique les bêtas) |
| Re-ranking (format Cohere v2) | `POST /2/ai/{product_id}/cohere/v2/rerank` |
| Messages (format Anthropic) | `POST /2/ai/{product_id}/anthropic/v1/messages` |
| Consommation | `GET /1/ai/{product_id}/consumptions` |
| Résultat de batch asynchrone | `GET /1/ai/{product_id}/results/{batch_id}` |
| Ancienne version (dépréciée) | `POST /1/ai/{product_id}/openai/chat/completions` |

- Authentification : `Authorization: Bearer <token API>`. Le token se crée dans le Manager (FAQ https://faq.infomaniak.com/2582). Le `product_id` se trouve dans Manager > Cloud Computing > AI Tools.
- Paramètres documentés sur `chat/completions` v2 : `response_format` avec `json_schema` (Structured Outputs), `tools` et `tool_choice` (function calling selon le modèle), `stream` (**activé par défaut** : à mettre à `false` en traitement par lots), `max_completion_tokens`, `temperature`, `reasoning_effort`. Pour `reasoning_effort`, la valeur `"none"` désactive le mode réflexion, actif par défaut sur la plupart des modèles. Le désactiver est important pour maîtriser le coût en tokens de sortie.
- Embeddings : 8'192 tokens maximum en entrée pour tous les modèles d'embedding. Paramètre `dimensions` disponible, mais « may not be supported by all the available models » : à tester avec Qwen3-Embedding-8B.
- Rerank : 1'000 documents maximum recommandés par requête, `max_tokens_per_doc` de 4'096 par défaut.
- Débit : la documentation (v1) indique que le nombre de requêtes par minute est limité par défaut, sans publier la valeur. Il faut contacter le support pour la connaître ou l'augmenter : à vérifier avant l'embarquement initial de 13'000 fondations. Pour mémoire, l'API générale d'Infomaniak est plafonnée à 60 requêtes/minute (FAQ 2581), mais rien n'indique que ce plafond s'applique à l'IA.
- Langues : la documentation (v1) cite EN, DE, ES, FR, IT comme langues supportées. Le portugais, le polonais, le néerlandais, le roumain, le tchèque et le suédois sont annoncés avec des capacités limitées.
- Retour terrain (forum communautaire n8n, janvier 2025, donc ancienne API v1) : un utilisateur signalait que le function calling et le mode JSON ne fonctionnaient pas. La v2 documente désormais `json_schema`. Il faut le tester modèle par modèle avant de s'y fier : https://community.n8n.io/t/add-new-language-model-informaniak-ai/73182

**Prix et caractéristiques des modèles (page Tarifs et page Modèles, 21.10.2026) :**

LLM (CHF par million de tokens) :

| Modèle (identifiant API) | Entrée | Sortie | Contexte max (entrée) | Statut | Remarque Infomaniak |
|---|---|---|---|---|---|
| `google/gemma-4-31B-it` | 0.20 | 0.40 | 100'000 | stable | « L'équilibre parfait », texte uniquement, 140+ langues |
| `mistralai/Ministral-3-14B-Instruct-2512` | 0.30 | 0.40 | 100'000 | stable | « Le plus polyvalent », EN/ES/FR/DE/IT |
| `mistralai/Mistral-Small-4-119B-2603` | 0.20 | 0.75 | 256'000 | stable | « Le plus efficace pour l'instruction et le raisonnement » |
| `moonshotai/Kimi-K2.6` | 0.60 | 3.00 | 256'000 | bêta | orienté code |
| `Qwen/Qwen3.5-397B-A17B-FP8` | 0.80 | 3.60 | 200'000 | bêta | « Le plus puissant » |
| `Qwen/Qwen3.8-27B-FP8` | 0.40 | 3.00 | non affiché (« NaN » sur la page) | bêta | réflexion activée par défaut |
| `swiss-ai/Apertus-v1.5-70B` | 0.70 | 2.50 | 100'000 | bêta | modèle suisse (EPFL/ETH), « le plus éthique » |

Embeddings (CHF par million de tokens) :

| Modèle | Prix | Dimensions | Entrée max |
|---|---|---|---|
| `Qwen/Qwen3-Embedding-8B` | 0.07 | 4'096 (configurable selon Infomaniak) | 8'192 |
| `Bge Multilingual Gemma2` | 0.065 | 3'584 | 8'000 |
| `All MiniLM L12 v2` | gratuit | 384 | 128 (trop court pour nos textes) |

Re-rankers (CHF par million de tokens en entrée) : `BAAI/bge-reranker-v2-m3` à 0.01, `Qwen/Qwen3-Reranker-0.6B` à 0.009.

Pour mémoire : Whisper V3 coûte CHF 0.006 par minute, Flux schnell et Photomaker V2 CHF 0.30 par minute.

### 1.2 Hébergement de l'application et de la base

| Produit | Ce qui est publié (21.10.2026) | Source |
|---|---|---|
| **Database Service (managé)** | MySQL seulement. **PostgreSQL « Bientôt disponible »**, de même que MariaDB, OpenSearch et Redis. MySQL Essential dès CHF 0.03 par heure (1 vCPU, 4 Go, 80 Go, sans SLA). Donc **pas de Postgres ni de pgvector managé aujourd'hui** | https://www.infomaniak.com/fr/hebergement/public-cloud/database |
| **VPS Lite** | 4 vCPU, 8 Go de RAM, 160 Go : CHF 18.00 par mois. 2 vCPU, 4 Go, 60 Go : CHF 7.20 par mois. Ces prix supposent un **engagement annuel payé en une fois**. Pas de SLA, pas de snapshots, 500 Mbit/s. Accès root, hébergé en Suisse | https://www.infomaniak.com/fr/hebergement/vps-lite |
| **VPS Cloud** | Dès CHF 38.41 par mois (configuration d'entrée non détaillée dans le texte récupéré : à vérifier). SLA de 99.99 %, 1 snapshot inclus, ressources modifiables à la hausse comme à la baisse | https://www.infomaniak.com/fr/hebergement/vps-cloud |
| **Public Cloud (OpenStack)** | Instance de 4 vCPU, 8 Go, 50 Go et 1 To de trafic : CHF 16.10 par mois (comparatif publié par Infomaniak). Facturation horaire, CHF 300 de crédits offerts sur 3 mois. Prix détaillés du stockage et des snapshots : à vérifier dans le calculateur | https://www.infomaniak.com/fr/hebergement/public-cloud et .../public-cloud/tarifs |
| **Kubernetes Service** | Control plane dédié dès CHF 0.04 par heure, nœuds en plus. Surdimensionné pour ce projet | https://www.infomaniak.com/fr/hebergement/public-cloud/kubernetes |
| **Jelastic Cloud (PaaS)** | Facturation à l'heure par conteneur (exemple affiché : 1 conteneur de 128 Mo, 20 Go et une IP pour CHF 6.31 par mois). Disponibilité de l'extension pgvector dans les nœuds PostgreSQL Jelastic : à vérifier | https://www.infomaniak.com/fr/hebergement/serveurs-dedies-et-cloud/jelastic-cloud |
| **Swiss Backup** | Tarifs 2026 par licence. Prix au Go pour un dépôt de sauvegarde Postgres : à vérifier | https://www.infomaniak.com/fr/support/faq/2832/comprendre-levolution-tarifaire-swiss-backup-2026-chf |

### 1.3 Source des fondations : registre du commerce

Deux accès officiels, tous deux sous licence OGD « Open use. Must provide the source » :

1. **LINDAS (open data, sans compte, sans plafond de requêtes)**. Endpoint SPARQL : `https://lindas.admin.ch/query`, graphe `https://lindas.admin.ch/foj/zefix`, fiche du jeu de données : https://register.ld.admin.ch/.well-known/dataset/foj-zefix. Il contient les données de base des entités actives : nom, UID, commune, adresse et but social dans `schema:description`.
   - **Vérifié le 21.10.2026 par requête** : 17'779 fondations actives (forme juridique eCH-0097 `0110`), toutes avec un but social renseigné. Longueur moyenne du but : 588 caractères (maximum 7'073), soit 10.45 millions de caractères au total.
   - Ce total inclut les fondations de prévoyance (LPP, fonds de bienfaisance) et les fondations opérationnelles, qui gèrent une institution sans financer de tiers. Un filtre par mots-clés (prévoyance, Vorsorge, LPP, BVG, Pensionskasse, Wohlfahrtsfonds, libre passage) isole environ 2'444 fondations de prévoyance probables. Ce n'est qu'un ordre de grandeur, à affiner.
   - Référence externe : le Schweizer Stiftungsreport 2026 (CEPS, Université de Bâle) compte **13'782 fondations d'utilité publique actives à fin 2025** (https://ceps.unibas.ch/fileadmin/user_upload/ceps/6_Ueber_uns/Medienmitteilungen/MM_Preview_Schweizer_Stiftungsreport_2026__05._Februar_2026_.pdf). L'hypothèse de 13'000 fondations utiles est cohérente.
2. **Zefix PublicREST** (`https://www.zefix.admin.ch/ZefixPublicREST/api/v1`). Spécification : https://www.zefix.admin.ch/ZefixPublicREST/v3/api-docs. Elle exige une **authentification Basic** : les identifiants se demandent par courriel à zefix@bj.admin.ch (information tirée d'un SDK tiers : à confirmer auprès de l'OFJ). Elle apporte le détail complet : `purpose`, `sogcPub` (publications FOSC), `oldNames`, `auditCompanies` et le lien vers l'extrait cantonal. À utiliser seulement pour compléter, la recherche exigeant un nom d'au moins 3 caractères.

Les membres du conseil de fondation ne figurent pas dans LINDAS. Ils apparaissent dans les extraits cantonaux et les publications FOSC. Voir les précautions nLPD au chapitre 5.

---

## 2. Architecture recommandée (la plus simple qui tient 6 mois)

### 2.1 Vue d'ensemble

```
                 Infomaniak (Suisse)
 ┌─────────────────────────────────────────────────────────────┐
 │  1 VPS (Docker Compose)                                     │
 │   ├─ caddy        : TLS + authentification (agence)          │
 │   ├─ app          : Python FastAPI + HTMX (UI interne)       │
 │   ├─ worker       : jobs (crawl, extraction, matching)       │
 │   │                 file d'attente = table Postgres          │
 │   │                 (SELECT ... FOR UPDATE SKIP LOCKED)      │
 │   └─ postgres 16  : image pgvector/pgvector:pg16             │
 │                     + unaccent + pg_trgm                     │
 │  Sauvegarde : pg_dump chiffré quotidien → stockage hors VPS │
 │                                                             │
 │  AI Services : api.infomaniak.com/2/ai/{id}/openai/v1       │
 │   (chat, embeddings) + /cohere/v2/rerank                    │
 └─────────────────────────────────────────────────────────────┘
      ▲ SPARQL (LINDAS)   ▲ HTTP (sites des fondations et des clients)
```

Choix assumés pour rester simple : pas de Redis, pas de Kubernetes, pas de base vectorielle séparée. À 13'000 lignes, pgvector suffit largement : un parcours exact (sans index) répond en une fraction de seconde. L'index n'est utile que pour gagner du temps.

### 2.2 Modèle de données (tables principales)

- `fondations` : id, uid (CHE-xxx), lindas_uri, nom, forme (`0110`), commune_bfs, canton, but_social, but_langue (fr/de/it/rm), statut (`active`/`radiée`), `type_fondation` (`donatrice`/`operationnelle`/`mixte`/`prevoyance`/`inconnu`), `domaines text[]` (codes de la taxonomie), `zone_activite text[]` (`CH`, `VD`, `Suisse romande`, `international`...), `beneficiaires text[]` (association, personne physique, start-up, étudiant...), `accepte_demandes_spontanees` (bool ou null), site_web, `carte_texte` (résumé normalisé), `tsv tsvector`, `embedding vector(1024)`, `maj_le`.
- `sources` : fondation_id, url, type (`registre`/`site`/`rapport_annuel`/`liste_beneficiaires`), récupéré_le, hash, extrait (texte court), robots_ok (bool).
- `clients`, `profils_client` (JSON de profil versionné, embedding, URL des pages lues, date).
- `matchings` : profil_id, fondation_id, score_vectoriel, score_lexical, score_rrf, score_llm (0-100), raisons, risques, citation_but, modèle, version_prompt, créé_le.
- `demandes` : matching_id, statut (`brouillon`/`validée`/`envoyée`/`acceptée`/`refusée`/`sans_réponse`), montant demandé, montant obtenu, motif de refus, date, validée_par.
- `journal` : qui, quoi, quand, modèle, version de prompt, hash d'entrée (pas le texte complet). Voir le chapitre 5.

### 2.3 Ingestion : LINDAS vers Postgres

1. Requête SPARQL hebdomadaire sur la forme `0110` : nom, identifiant, commune, adresse, but social. Les noms de prédicats exacts sont à relever sur les requêtes d'exemple de la fiche foj-zefix. Upsert par URI ou UID. Une fondation absente de deux extractions de suite passe au statut `radiée`.
2. Pré-classement par règles : mots-clés de prévoyance → `type_fondation = prevoyance`, exclue du matching.
3. Classification LLM du but social, une seule fois puis seulement sur les deltas. Elle produit : `type_fondation`, `domaines[]`, `zone_activite[]`, `beneficiaires[]` et la langue. On utilise `response_format` json_schema avec `reasoning_effort: "none"`.
4. Carte normalisée (`carte_texte`, environ 150 à 300 mots en français) : nom, siège, but social original, domaines, zone, bénéficiaires, et plus tard le résumé du site. C'est **ce texte** qui est embarqué, pas le HTML brut.

### 2.4 Enrichissement : sites des fondations, rapports annuels, listes de bénéficiaires

- Trouver le site : beaucoup de fondations n'en ont pas, et la proportion est inconnue (à mesurer). Ordre de recherche : (1) domaine dans le nom ou l'adresse, (2) annuaires publics (autorités de surveillance cantonales, Surveillance fédérale des fondations, membres de SwissFoundations ou de proFonds), (3) saisie manuelle par l'agence au fil des dossiers. Ne pas aspirer de bases commerciales comme StiftungSchweiz sans licence : leurs conditions d'utilisation sont à vérifier.
- Crawl poli : lecture de `robots.txt` (RFC 9309) avant toute requête, avec un User-Agent identifiable (`LevierBot/1.0 (+https://levier.ch/bot ; contact@...)`). Une requête par seconde et par domaine au plus, 20 pages maximum par site, cache HTTP (ETag), revisite tous les 6 à 12 mois. Pages ciblées par mots-clés d'URL : `soutien|gesuch|demande|förder|antrag|criteres|richtlinien|projets|projekte|jahresbericht|rapport-annuel|beneficiaires|unterstützte`.
- Extraction du texte avec trafilatura (HTML) et pypdf (rapports PDF), puis résumé structuré par LLM : critères, montants indicatifs **seulement s'ils sont écrits**, délais, comité, « pas de demandes spontanées », exemples de projets soutenus. Chaque champ garde l'URL source et la date.
- On ne stocke pas les pages entières : seulement un extrait court plus le lien, ce qui limite le risque au regard du droit d'auteur et de la LCD. Statut juridique du scraping à faire valider par un juriste si la base devient un produit vendu.

### 2.5 Taxonomie des domaines (20 codes, FR/DE)

Code stable en ASCII, libellés FR/DE (IT à ajouter pour le Tessin). Plusieurs codes possibles par fondation et par client.

| Code | Français | Deutsch |
|---|---|---|
| `SOC` | Action sociale, pauvreté, précarité | Soziales, Armut |
| `SAN` | Santé, soins, recherche médicale | Gesundheit, medizinische Forschung |
| `HAN` | Handicap, inclusion | Behinderung, Inklusion |
| `AGE` | Personnes âgées | Alter |
| `ENF` | Enfance, jeunesse | Kinder, Jugend |
| `EDU` | Éducation, formation, bourses d'études | Bildung, Ausbildung, Stipendien |
| `SCI` | Recherche scientifique, hautes écoles | Wissenschaft, Forschung, Hochschulen |
| `CUL` | Arts et culture (musique, scène, arts visuels, littérature, cinéma) | Kunst, Kultur |
| `PAT` | Patrimoine, monuments, archéologie, musées | Kulturerbe, Denkmalpflege, Museen |
| `ENV` | Environnement, climat, biodiversité, énergie | Umwelt, Klima, Biodiversität, Energie |
| `ANI` | Protection des animaux | Tierschutz |
| `DEV` | Coopération au développement, aide humanitaire | Entwicklungszusammenarbeit, humanitäre Hilfe |
| `MIG` | Migration, asile, intégration | Migration, Asyl, Integration |
| `DRH` | Égalité, droits humains, lutte contre les discriminations | Gleichstellung, Menschenrechte |
| `SPO` | Sport, loisirs, mouvement | Sport, Freizeit |
| `ECO` | Entrepreneuriat, innovation, emploi, start-up | Unternehmertum, Innovation, Arbeit |
| `REG` | Régions de montagne, agriculture, développement régional | Berggebiete, Landwirtschaft, Regionalentwicklung |
| `REL` | Religion, Églises, dialogue interreligieux | Religion, Kirchen |
| `CIV` | Démocratie, société civile, médias, éducation civique | Demokratie, Zivilgesellschaft, Medien |
| `HAB` | Logement, quartiers, cohésion sociale locale | Wohnen, Quartierentwicklung |

En dehors des domaines, on stocke trois drapeaux qui servent de filtres durs :
- `type_fondation` : `prevoyance` est toujours exclu, `operationnelle` est exclu par défaut ;
- `beneficiaires` : personne physique, association, entreprise ;
- `accepte_demandes_spontanees`.

### 2.6 Lecture du site du client (5 à 15 pages, JSON structuré)

1. L'agence colle l'URL. Le système lit `robots.txt`, puis `sitemap.xml` s'il existe, sinon les liens internes de la page d'accueil.
2. Il retient au plus 15 pages par score d'URL et de titre (`a-propos|about|ueber-uns|mission|projets|projekte|equipe|team|rapport|jahresbericht|soutenir|dons|spenden|impressum|contact|budget`) et toujours la page d'accueil. Les PDF (rapport annuel, budget) sont lus s'ils sont liés.
3. Le texte est extrait avec trafilatura, découpé à environ 1'500 tokens par page, puis concaténé avec des balises `[[PAGE n | url]]` pour permettre la citation.
4. Un appel LLM (prompt (a) ci-dessous) avec `response_format` json_schema produit le profil.
5. L'agence relit et corrige le profil dans l'UI avant tout matching. Le profil validé est versionné.
6. On calcule l'embedding de la « carte client », un texte dérivé du JSON et construit sur le même gabarit que les cartes des fondations.

### 2.7 Matching hybride en trois étages

1. **Filtres durs (SQL)** : fondation active ; `type_fondation` dans (`donatrice`, `mixte`, `inconnu`) ; zone d'activité compatible avec le canton ou la région du client (`CH` et `international` acceptés selon le cas) ; type de bénéficiaire compatible (une association n'est pas une personne physique, un étudiant n'est pas une start-up) ; exclusions manuelles (fondations déjà sollicitées dans les 12 derniers mois pour ce client).
2. **Rappel hybride** : similarité vectorielle (cosinus pgvector) et recherche lexicale (`tsvector` en configuration `simple` plus `unaccent`, mots-clés générés en FR, DE et IT par le LLM au moment du profil). Les deux listes sont fusionnées par Reciprocal Rank Fusion (k = 60), avec un bonus pour le recouvrement de domaines. On garde les 300 premières.
3. **Re-ranking** :
   - 3a, facultatif et très bon marché : `bge-reranker-v2-m3` (CHF 0.01 par million de tokens) pour passer de 300 à 100 candidats ;
   - 3b : re-ranking LLM des 100 à 150 restantes avec le prompt (b). On obtient un score de 0 à 100, des raisons, des risques et une `citation_but`.
   - **Contrôle automatique** : `citation_but` doit être une sous-chaîne exacte de `fondations.but_social`. Sinon le résultat est rejeté et relancé une fois, puis marqué « citation non vérifiée ». C'est le garde-fou principal contre les hallucinations.
4. Affichage : liste triée, avec pour chaque fondation le score, les raisons, les risques, la citation surlignée dans le but social et les liens vers les sources (Zefix, site, date de récupération).

### 2.8 Boucle de feedback

- Chaque demande envoyée devient une ligne `demandes` dont le statut est mis à jour à la main par l'agence : acceptée, refusée, sans réponse après 6 mois, et motif du refus.
- Court terme, dès les premiers retours :
  - un refus motivé « hors but » corrige la classification de la fondation ;
  - le motif « pas de demandes spontanées » met à jour le drapeau ;
  - un succès est injecté en exemple (few-shot) dans le prompt de re-ranking pour des profils proches.
- Moyen terme, à partir d'environ 100 issues connues (seuil indicatif, pas une règle statistique) : une régression logistique sur les variables score_llm, score_rrf, recouvrement de domaines, correspondance géographique, type et taux de réponse historique de la fondation. Elle calibre une **probabilité** de réponse positive affichée à côté du score LLM. Mise à jour mensuelle.
- Indicateurs à suivre :
  - taux de réponse positive par tranche de score (le score doit être monotone) ;
  - part des 30 fondations retenues qui figuraient dans les 30 premières du classement ;
  - temps de relecture par lettre.

---

## 3. Estimation des coûts mensuels

### 3.1 Hypothèses (toutes modifiables)

- Base : 13'000 fondations utiles (CEPS : 13'782 d'utilité publique à fin 2025). Il y a 17'779 fondations actives dans LINDAS au 21.10.2026.
- Tokens : environ 3.5 caractères par token pour du FR/DE. C'est une hypothèse : Infomaniak cite 4 caractères par token pour l'anglais. Les buts sociaux représentent 10.45 millions de caractères, soit environ 3 millions de tokens.
- Fondations avec un site exploitable : hypothèse de 6'000, à mesurer.
- Par client :
  - extraction du site : 25'000 tokens en entrée et 1'500 en sortie ;
  - re-ranking LLM : 100 à 200 fondations, 2'500 à 3'000 tokens en entrée et 400 à 1'500 en sortie par fondation ;
  - lettres : 30, avec 1 à 2 versions chacune, 4'000 à 5'000 tokens en entrée et 1'200 à 4'000 en sortie.
- Scénario « économique » : `Mistral-Small-4-119B-2603` partout, mode réflexion désactivé, 100 re-rankings et une version par lettre.
- Scénario « prudent » : `Qwen3.5-397B` (bêta) partout, réflexion activée (sorties plus longues), 200 re-rankings et deux versions par lettre.
- Prix : grille Infomaniak du 21.10.2026, hors TVA.

### 3.2 Coût unique : embarquer la base

| Poste | Calcul | CHF |
|---|---|---|
| Embeddings des buts seuls | 3 M tokens × 0.07 | 0.21 |
| Embeddings des cartes enrichies | 13'000 × 1'500 tokens × 0.07 / 1 M | 1.37 |
| Classification des buts (Mistral Small 4) | 13'000 × (1'200 en entrée × 0.20 + 150 en sortie × 0.75) / 1 M | 4.58 |
| Résumés de sites (Mistral Small 4) | 6'000 × (6'000 × 0.20 + 500 × 0.75) / 1 M | 9.45 |
| **Total** | | **environ 15.60** |

Il faut compter une ou deux itérations de mise au point des prompts, soit environ CHF 30 à 50 au total pour la phase de construction. La contrainte réelle est le débit (requêtes par minute non publiées) : à demander au support, ou passer par le mode batch asynchrone, dont les conditions sont à vérifier.

### 3.3 Coût récurrent : 20 clients par mois

| Poste par client | Économique (CHF) | Prudent (CHF) |
|---|---|---|
| Extraction du profil | 0.006 | 0.042 |
| Re-ranking LLM | 0.080 | 1.560 |
| Lettres | 0.051 | 1.104 |
| **Total par client** | **0.14** | **2.71** |
| **20 clients** | **2.74** | **54.11** |

S'ajoutent des postes négligeables : re-ranker bge (environ CHF 0.06 par mois), embeddings des profils clients (moins de CHF 0.01 par mois), mise à jour mensuelle des fondations, c'est-à-dire les deltas LINDAS et un douzième des sites recrawlés (moins de CHF 2 par mois).

### 3.4 Total mensuel estimé (option A recommandée)

| Poste | CHF par mois | Source |
|---|---|---|
| VPS Lite 4 vCPU, 8 Go, 160 Go (engagement annuel) | 18.00 | page VPS Lite |
| *ou* instance Public Cloud 4 vCPU, 8 Go, 50 Go (horaire) | 16.10 | page Public Cloud |
| Appels IA (20 clients) | 3 à 55 | calcul 3.3 |
| Sauvegardes hors serveur (Swiss Backup ou Object Storage) | à vérifier (faible volume, base de quelques Go) | — |
| Nom de domaine et certificat | certificat gratuit via Let's Encrypt et Caddy ; domaine existant | — |
| **Total hors sauvegarde** | **environ CHF 19 à 73 par mois HT** | |

Lecture : le coût IA est marginal. Pour éviter un poste d'environ CHF 50 par mois, un modèle bêta « plus puissant » ne se justifie que si un test à l'aveugle sur 20 dossiers montre une meilleure qualité de lettre. **Le coût dominant reste le temps humain** de relecture : 30 lettres × 10 à 20 minutes, soit 5 à 10 heures par client. C'est une hypothèse à mesurer, mais c'est là que se joue la rentabilité.

---

## 4. Comparaison de deux options

| | **A. Tout Infomaniak** (VPS + Postgres/pgvector auto-géré + AI Services) | **B. Supabase (pgvector, Zurich) + Infomaniak AI Services** |
|---|---|---|
| Localisation des données | Suisse, opérateur suisse (Infomaniak) | Supabase propose la région `eu-central-2` (Zurich, AWS). Supabase Inc. est une société américaine : exposition au CLOUD Act, transfert à analyser (art. 16 LPD) ; certification Swiss-US DPF de Supabase à vérifier |
| Coût hébergement | CHF 16.10 à 18.00 par mois | Plan Pro à USD 25 par mois avec USD 10 de crédits compute (couvre une instance Micro), Small à USD 15 par mois, 8 Go de disque inclus puis USD 0.125 par Go. **Plus** un serveur pour le worker de crawl, car les tâches longues n'ont pas leur place dans des Edge Functions : environ CHF 7 à 18 par mois chez Infomaniak. Total d'environ USD 25 à 30 plus CHF 7 à 18 |
| Mise en route | Plus de travail initial : Docker Compose, sauvegardes, mises à jour de sécurité, monitoring | Plus rapide : authentification, interface de tables, API REST et RLS fournis ; Tim connaît Supabase |
| Exploitation | À la charge de Levier ou de son prestataire : correctifs OS, rotation des sauvegardes, tests de restauration | Sauvegardes, PITR (en option) et mises à jour gérés |
| Argument commercial | « 100 % hébergé en Suisse chez un opérateur suisse », message fort pour des fondations et associations sensibles à la souveraineté | Hébergé à Zurich mais par un acteur américain, plus difficile à défendre auprès de clients exigeants |
| Verrouillage | Aucun : Postgres standard, API au format OpenAI | Faible : Postgres standard, mais l'auth et les fonctions sont propres à Supabase |
| Risque principal | Panne ou perte de données si les sauvegardes ne sont pas testées (pas de SLA ni de snapshots sur VPS Lite) | Double fournisseur, analyse de transfert nLPD, coût en USD |

**Recommandation : option A.** Raisons :
1. Le positionnement « souverain suisse » est un argument de vente direct auprès des clients de Levier et des fondations.
2. Le volume est minuscule (13'000 lignes, 20 clients par mois) : un seul VPS suffit largement pendant 6 mois.
3. Le worker de crawl a de toute façon besoin d'un serveur, donc B ajoute un fournisseur sans supprimer le VPS.

**Conditions** :
- sauvegarde quotidienne chiffrée hors du VPS, avec **un test de restauration mensuel** ;
- mises à jour de sécurité automatiques (unattended-upgrades) ;
- Postgres jamais exposé sur Internet.

Pour un SLA, passer en VPS Cloud (dès CHF 38.41 par mois, SLA de 99.99 %, snapshot inclus). Quand Infomaniak ouvrira PostgreSQL managé (« Bientôt disponible »), y migrer la base, sous réserve que pgvector soit proposé (à vérifier le moment venu).

---

## 5. Précautions nLPD, journalisation, humain dans la boucle

Base légale : loi fédérale sur la protection des données (LPD, RS 235.1), https://www.fedlex.admin.ch/eli/cc/2022/491/fr. Les numéros d'articles ci-dessous sont à relire sur le texte en vigueur. Ceci n'est pas un avis juridique : à faire valider par un juriste ou un DPO si Levier commercialise l'outil.

**Données des clients (associations, start-up, étudiants)**
- Le site du client est public. En revanche, les compléments transmis par l'agence (budget, statuts, informations sur un étudiant) peuvent contenir des données personnelles. Pour un étudiant, ce sont des données personnelles directes.
- Contrat de mandat avec le client : finalité (recherche de fonds), durée de conservation, mention de l'usage d'un traitement automatisé hébergé en Suisse. C'est le devoir d'informer (art. 19).
- Infomaniak est un sous-traitant (art. 9) : conclure ou accepter son contrat de sous-traitance (document à identifier dans les documents légaux d'Infomaniak) et documenter le fait que les requêtes IA ne sont ni stockées ni utilisées pour l'entraînement (page AI Services, citée au 1.1).
- Protection dès la conception et par défaut (art. 7) : ne jamais envoyer au LLM plus que nécessaire. Pour l'extraction du profil, retirer les courriels, numéros de téléphone et IBAN du texte avant l'appel (expressions régulières).
- Sécurité (art. 8) : TLS, 2FA sur le Manager Infomaniak, secrets dans `.env` hors du dépôt, token API dédié et révocable, base non exposée, sauvegardes chiffrées.
- Option B (Supabase) : transfert ou accès possible depuis les États-Unis (art. 16 et 17). Les États-Unis figurent sur la liste des États adéquats uniquement pour les entreprises certifiées Swiss-US DPF, depuis le 15.09.2024 (communiqué du Conseil fédéral : https://www.bj.admin.ch/fr/nsb?id=102054). Certification de Supabase à vérifier.

**Membres des conseils de fondation**
- Ces noms sont publics (registre du commerce, FOSC), mais leur réutilisation reste un traitement de données personnelles. Principes de finalité et de proportionnalité (art. 6).
- Recommandation : ne pas les stocker dans la V1. Si on en a besoin pour adresser une lettre (« Madame la Présidente »), stocker seulement le nom, la fonction, la source et la date, à la demande et pour la fondation concernée.
- Pas d'enrichissement depuis LinkedIn ou la presse, pas de profil de personne, pas de score par personne. Prévoir la suppression sur demande et le droit d'accès (art. 25).

**Fondations (personnes morales)** : la nLPD ne protège plus les données des personnes morales. Le risque principal est ailleurs : réputation, droit d'auteur et concurrence déloyale si on reproduit leurs contenus. D'où des extraits courts, des liens vers les sources et le respect de robots.txt.

**Analyse d'impact (art. 22) et registre (art. 12)** : a priori pas de risque élevé (pas de données sensibles au sens de l'art. 5, pas de profilage de personnes physiques). Documenter cette évaluation en une page. Exemption du registre pour les entreprises de moins de 250 collaborateurs sans traitement à risque élevé (OPDo) : à vérifier.

**Décision individuelle automatisée (art. 21)** : le classement n'est pas une décision qui produit des effets juridiques pour une personne. Pour un étudiant client, on garde quand même un humain qui valide la shortlist.

**Journalisation (table `journal`, conservation proposée de 24 mois)**
- Pour chaque appel IA : date, utilisateur, client, modèle exact, version du prompt (hash), nombre de tokens, coût, hash de l'entrée et sortie JSON. Pas le texte complet des documents du client.
- Pour chaque fondation présentée : sources utilisées (URL et date), citation vérifiée ou non.
- Pour chaque lettre : versions successives, auteur de la validation, date d'envoi. Statut obligatoire `validée` avant export.
- Revue mensuelle : coût IA, taux de citations rejetées, taux de réponse.

**Humain dans la boucle (bloquant dans l'UI)**
1. Le profil client est validé par l'agence avant le matching.
2. La shortlist est choisie par l'agence (30 fondations sur 100 à 150 classées).
3. Chaque lettre est relue, éditée et validée nominativement. Aucun envoi automatique. Les lettres contiennent des balises `[À COMPLÉTER]` qui bloquent l'export tant qu'elles subsistent.
4. Les montants, chiffres et faits du client n'apparaissent dans une lettre que s'ils figurent dans le profil validé.

---

## 6. Prompts système (FR) et requête SQL

Paramètres d'appel communs : `model: "mistralai/Mistral-Small-4-119B-2603"`, `stream: false`, `temperature: 0.2` (0.5 pour les lettres), `reasoning_effort: "none"` pour (a) et (b), `response_format: {"type":"json_schema", ...}` pour (a) et (b). Tester le respect du schéma : en cas d'échec, valider côté code (pydantic) et relancer une fois.

### 6.a Extraction du profil client depuis le texte du site

**Prompt système :**

```
Tu es analyste chez Levier, agence suisse de recherche de fonds auprès de fondations.
On te donne le texte de 5 à 15 pages du site web d'un porteur de projet (association,
start-up, étudiant·e, institution). Chaque page commence par [[PAGE n | url]].

Ta tâche : produire un profil structuré qui servira à trouver des fondations suisses
susceptibles de le financer.

Règles strictes :
1. N'invente rien. Si une information n'est pas dans le texte, mets null (ou [] pour
   une liste) et ajoute le champ concerné dans "informations_manquantes".
2. Chaque affirmation factuelle importante doit être justifiée dans "preuves" par une
   citation exacte (copiée mot pour mot, 30 mots maximum) et le numéro de page.
3. Les montants (budget, besoin de financement) ne sont renseignés que s'ils sont écrits
   explicitement. Ne fais aucune estimation.
4. "domaines" : choisis 1 à 4 codes UNIQUEMENT dans cette liste :
   SOC, SAN, HAN, AGE, ENF, EDU, SCI, CUL, PAT, ENV, ANI, DEV, MIG, DRH, SPO, ECO, REG,
   REL, CIV, HAB. Le premier code est le domaine principal.
5. "zone_geographique" : où le projet a lieu et qui en bénéficie (commune, canton,
   région linguistique, Suisse, international). Utilise les abréviations cantonales
   (VD, GE, FR, VS, NE, JU, BE, ZH, ...).
6. "mots_cles" : 8 à 15 termes de recherche dans les trois langues (fr, de, it),
   utiles pour retrouver le but social d'une fondation (ex. "jeunesse", "Jugend",
   "gioventù").
7. Ignore les mentions légales, les cookies et la navigation. Ne recopie aucune donnée
   personnelle (courriel, téléphone, adresse privée, IBAN).
8. Réponds uniquement par un objet JSON conforme au schéma fourni.
```

**Schéma JSON (`response_format.json_schema.schema`) :**

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["nom", "type_porteur", "forme_juridique", "mission", "domaines",
               "public_cible", "zone_geographique", "projets", "besoins_financement",
               "langue_principale", "langues_site", "statut_utilite_publique",
               "mots_cles", "preuves", "informations_manquantes"],
  "properties": {
    "nom": {"type": "string"},
    "type_porteur": {"type": "string",
      "enum": ["association", "fondation", "cooperative", "start-up", "entreprise",
               "etudiant", "institution_publique", "autre", "inconnu"]},
    "forme_juridique": {"type": ["string", "null"]},
    "uid_che": {"type": ["string", "null"], "description": "CHE-xxx.xxx.xxx si présent sur le site"},
    "siege": {"type": ["object", "null"], "additionalProperties": false,
      "required": ["commune", "canton"],
      "properties": {"commune": {"type": ["string", "null"]}, "canton": {"type": ["string", "null"]}}},
    "mission": {"type": "string", "description": "2 à 3 phrases, en français"},
    "domaines": {"type": "array", "minItems": 1, "maxItems": 4,
      "items": {"type": "string", "enum": ["SOC","SAN","HAN","AGE","ENF","EDU","SCI","CUL","PAT","ENV","ANI","DEV","MIG","DRH","SPO","ECO","REG","REL","CIV","HAB"]}},
    "public_cible": {"type": "array", "items": {"type": "string"}},
    "zone_geographique": {"type": "object", "additionalProperties": false,
      "required": ["niveau", "lieux"],
      "properties": {
        "niveau": {"type": "string", "enum": ["local", "cantonal", "regional", "national", "international", "inconnu"]},
        "lieux": {"type": "array", "items": {"type": "string"}}}},
    "projets": {"type": "array", "maxItems": 5, "items": {"type": "object", "additionalProperties": false,
      "required": ["titre", "description"],
      "properties": {"titre": {"type": "string"}, "description": {"type": "string"}}}},
    "besoins_financement": {"type": "object", "additionalProperties": false,
      "required": ["objet", "montant_chf", "type_besoin", "echeance"],
      "properties": {
        "objet": {"type": ["string", "null"]},
        "montant_chf": {"type": ["number", "null"]},
        "type_besoin": {"type": "array", "items": {"type": "string",
          "enum": ["projet", "fonctionnement", "investissement", "bourse", "demarrage", "recherche", "evenement", "inconnu"]}},
        "echeance": {"type": ["string", "null"]}}},
    "langue_principale": {"type": "string", "enum": ["fr", "de", "it", "en", "rm"]},
    "langues_site": {"type": "array", "items": {"type": "string"}},
    "statut_utilite_publique": {"type": "string", "enum": ["oui_mentionne", "non_mentionne", "non"]},
    "mots_cles": {"type": "array", "minItems": 8, "maxItems": 15, "items": {"type": "string"}},
    "preuves": {"type": "array", "items": {"type": "object", "additionalProperties": false,
      "required": ["champ", "citation", "page"],
      "properties": {"champ": {"type": "string"}, "citation": {"type": "string"}, "page": {"type": "integer"}}}},
    "informations_manquantes": {"type": "array", "items": {"type": "string"}}
  }
}
```

Message utilisateur : `URL du client : {url}\n\n{texte_concatene_des_pages}`

Contrôle côté code : chaque `preuves[].citation` doit se trouver dans la page indiquée, après normalisation des espaces. Sinon, le champ concerné est marqué « à vérifier » dans l'UI.

### 6.b Re-ranking d'une fondation par rapport au profil client

**Prompt système :**

```
Tu évalues, pour l'agence Levier, la probabilité qu'une fondation suisse finance un
porteur de projet donné. Tu reçois : (1) le profil validé du porteur (JSON) ;
(2) la fiche de la fondation : nom, siège, but social officiel tiré du registre du
commerce (texte faisant foi), et éventuellement un résumé de son site avec la date
de lecture.

Méthode :
- Le but social du registre du commerce fait foi. Le résumé du site sert à préciser
  (critères, exclusions, "pas de demandes spontanées") mais ne contredit pas le but.
- Évalue cinq critères : (1) adéquation thématique ; (2) adéquation géographique
  (le but limite-t-il à un canton, une commune, une région ?) ; (3) type de
  bénéficiaire autorisé (personnes physiques, associations, entreprises, institutions
  précises) ; (4) type de soutien (projet, fonctionnement, bourse...) ; (5) signaux
  d'exclusion (fondation de prévoyance, fondation opérationnelle qui gère sa propre
  institution, bénéficiaires nommément désignés, "keine Gesuche", "pas de demandes
  spontanées").
- Barème du score (0-100) :
  85-100 : but social explicitement aligné sur le domaine, le public ET la zone du
           porteur, aucune exclusion.
  65-84  : bon alignement thématique, zone compatible, un point incertain.
  40-64  : alignement partiel (thème voisin ou formulation générale de type
           "buts d'utilité publique"), à examiner par un humain.
  15-39  : faible ; un critère important ne correspond probablement pas.
  0-14   : exclu (zone incompatible, bénéficiaire incompatible, prévoyance,
           fondation opérationnelle, refus explicite des demandes).
- "citation_but" : copie MOT POUR MOT le passage le plus pertinent du but social
  (15 à 60 mots), sans le modifier, le traduire ni le résumer. S'il n'existe aucun
  passage pertinent, mets "".
- "raisons" : 2 à 4 phrases courtes, chacune reliant un élément du profil à un
  élément du but ou du site. Écris en français, même si le but est en allemand.
- "risques" : 0 à 4 points d'attention concrets (ex. "le but limite le soutien au
  canton de Berne", "le site indique ne pas accepter de demandes spontanées
  (lu le 12.09.2026)").
- N'invente aucun montant, aucun délai, aucun nom de personne.
- Réponds uniquement par le JSON demandé.
```

**Schéma JSON :**

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["score", "raisons", "risques", "citation_but"],
  "properties": {
    "score": {"type": "integer", "minimum": 0, "maximum": 100},
    "raisons": {"type": "array", "minItems": 1, "maxItems": 4, "items": {"type": "string"}},
    "risques": {"type": "array", "maxItems": 4, "items": {"type": "string"}},
    "citation_but": {"type": "string"}
  }
}
```

Message utilisateur :

```
PROFIL DU PORTEUR (validé le {date}) :
{profil_json}

FONDATION :
Nom : {nom} | UID : {uid} | Siège : {commune} ({canton})
But social (registre du commerce, langue {langue}) :
"""{but_social}"""
Résumé du site (source : {url_site}, lu le {date_lecture}) :
"""{resume_site_ou_"aucun"}"""
```

Contrôles côté code :
- `citation_but` doit être une sous-chaîne de `but_social` après normalisation des espaces et des guillemets ; sinon, relance une fois puis drapeau `citation_non_verifiee` ;
- le score est borné de 0 à 100 ;
- journalisation du modèle et de la version du prompt.

### 6.c Brouillon de lettre de demande (FR/DE/EN)

**Prompt système :**

```
Tu rédiges, pour l'agence Levier, le BROUILLON d'une lettre de demande de soutien
adressée à une fondation suisse au nom d'un porteur de projet. La lettre sera relue,
corrigée et validée par un humain avant tout envoi.

Langue : rédige en {langue_lettre} (fr, de ou en).
- fr : registre soutenu, vouvoiement, formules usuelles en Suisse romande
  ("Madame, Monsieur," ... "Nous vous prions d'agréer, Madame, Monsieur,
  l'expression de nos salutations distinguées.").
- de : Hochdeutsch avec les conventions suisses (pas de "ß", "ss" à la place), forme
  de politesse "Sie" ("Sehr geehrte Damen und Herren" ... "Freundliche Grüsse").
- en : British English, formal.

Contenu obligatoire (environ 350 à 500 mots, une page A4) :
1. Objet : demande de soutien pour {objet_du_projet}.
2. Introduction : qui est le porteur (1 à 2 phrases, uniquement d'après le profil).
3. Pourquoi cette fondation : relie explicitement le projet au but de la fondation en
   reprenant fidèlement l'idée de la citation fournie. Ne recopie pas mot pour mot
   plus de 20 mots.
4. Le projet : besoin, public, lieu, résultats attendus (uniquement d'après le profil).
5. La demande : montant et usage SI ET SEULEMENT SI ils figurent dans le profil ;
   sinon écris [À COMPLÉTER : montant demandé et affectation].
6. Pièces jointes usuelles (budget, statuts, comptes, rapport d'activité), sous forme
   de liste avec [À CONFIRMER].
7. Formule de politesse et signature : [À COMPLÉTER : nom, fonction, coordonnées].

Règles strictes :
- N'invente AUCUN fait, chiffre, partenaire, résultat, nom de personne, date ni
  distinction. Tout élément manquant devient une balise [À COMPLÉTER : ...].
- N'affirme pas que la fondation a déjà soutenu des projets similaires, sauf si c'est
  fourni dans la fiche avec sa source.
- N'utilise pas de superlatifs creux ("unique", "révolutionnaire") ni de flatterie
  appuyée envers la fondation.
- Respecte les critères et exclusions indiqués dans la fiche. Si la fiche signale un
  risque (ex. "pas de demandes spontanées"), ne le contourne pas : signale-le dans
  "points_a_verifier".

Format de sortie (texte brut, dans cet ordre) :
=== LETTRE ===
(la lettre complète)
=== FAITS UTILISÉS ===
(liste à puces : chaque fait du profil ou de la fiche repris dans la lettre)
=== POINTS À VÉRIFIER ===
(liste à puces : balises à compléter, risques, formulations à confirmer)
```

Message utilisateur : profil validé (JSON), fiche de la fondation (nom, adresse postale si connue, but social, `citation_but`, `raisons`, `risques`, résumé du site avec sa date) et consignes particulières de l'agence (ton, longueur, montant).

Contrôle côté code : l'export de la lettre est bloqué tant qu'il reste `[À COMPLÉTER` ou `[À CONFIRMER`. La validation est nominative.

### 6.d Requête SQL hybride (pgvector + plein texte + filtres durs + RRF)

Prérequis :

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Dimension : 1024 si l'API respecte "dimensions" pour Qwen3-Embedding-8B (à tester).
-- Sinon, avec bge-multilingual-gemma2 (3584 dims), utiliser halfvec(3584) : les index
-- HNSW de pgvector acceptent jusqu'à 2'000 dimensions en vector et 4'000 en halfvec.
-- À 13'000 lignes, un parcours exact sans index reste rapide.
ALTER TABLE fondations ADD COLUMN IF NOT EXISTS embedding vector(1024);
CREATE INDEX IF NOT EXISTS fondations_emb_hnsw ON fondations
  USING hnsw (embedding vector_cosine_ops);

-- unaccent n'étant pas IMMUTABLE, le tsvector est rempli par le worker (ou un trigger)
-- au lieu d'une colonne générée.
ALTER TABLE fondations ADD COLUMN IF NOT EXISTS tsv tsvector;
-- Exemple de mise à jour :
-- UPDATE fondations SET tsv = to_tsvector('simple', unaccent(nom || ' ' || but_social || ' ' || coalesce(carte_texte,'')));
CREATE INDEX IF NOT EXISTS fondations_tsv_gin ON fondations USING gin (tsv);
CREATE INDEX IF NOT EXISTS fondations_domaines_gin ON fondations USING gin (domaines);
CREATE INDEX IF NOT EXISTS fondations_zone_gin ON fondations USING gin (zone_activite);
```

Requête de rappel (paramètres : `$1` embedding du profil, `$2` mots-clés FR/DE/IT séparés par des espaces, `$3` zones acceptées `text[]`, ex. `{CH,VD,Suisse romande}`, `$4` domaines du client `text[]`, `$5` type de bénéficiaire, ex. `association`, `$6` id du client) :

```sql
WITH
q AS (
  -- Mots-clés combinés en OU (websearch_to_tsquery ferait un ET trop restrictif)
  SELECT to_tsquery('simple',
           array_to_string(
             ARRAY(SELECT quote_literal(unaccent(lower(m))) || ':*'
                   FROM unnest(string_to_array($2, ' ')) AS m
                   WHERE length(m) > 2),
             ' | ')) AS tsq
),
candidats AS (                      -- 1. filtres durs
  SELECT f.id, f.embedding, f.tsv, f.domaines
  FROM fondations f
  WHERE f.statut = 'active'
    AND f.type_fondation IN ('donatrice', 'mixte', 'inconnu')
    AND (f.zone_activite = '{}' OR f.zone_activite && $3)
    AND (f.beneficiaires = '{}' OR $5 = ANY (f.beneficiaires))
    AND NOT EXISTS (                -- pas déjà sollicitée pour ce client depuis 12 mois
      SELECT 1 FROM demandes d
      JOIN matchings m ON m.id = d.matching_id
      JOIN profils_client p ON p.id = m.profil_id
      WHERE m.fondation_id = f.id AND p.client_id = $6
        AND d.statut IN ('envoyée', 'refusée', 'acceptée')
        AND d.date >= now() - interval '12 months')
),
sem AS (                            -- 2a. similarité vectorielle
  SELECT id, row_number() OVER (ORDER BY embedding <=> $1) AS rang,
         1 - (embedding <=> $1) AS sim
  FROM candidats
  ORDER BY embedding <=> $1
  LIMIT 300
),
lex AS (                            -- 2b. plein texte
  SELECT c.id, row_number() OVER (ORDER BY ts_rank_cd(c.tsv, q.tsq) DESC) AS rang
  FROM candidats c, q
  WHERE c.tsv @@ q.tsq
  ORDER BY ts_rank_cd(c.tsv, q.tsq) DESC
  LIMIT 300
),
fusion AS (                         -- 2c. Reciprocal Rank Fusion (k = 60) + bonus domaines
  SELECT c.id,
         COALESCE(1.0 / (60 + sem.rang), 0)
       + COALESCE(1.0 / (60 + lex.rang), 0)
       + 0.005 * cardinality(ARRAY(SELECT unnest(c.domaines) INTERSECT SELECT unnest($4::text[]))) AS score_rrf,
         sem.sim, sem.rang AS rang_sem, lex.rang AS rang_lex
  FROM candidats c
  LEFT JOIN sem ON sem.id = c.id
  LEFT JOIN lex ON lex.id = c.id
  WHERE sem.id IS NOT NULL OR lex.id IS NOT NULL
)
SELECT f.id, f.uid, f.nom, f.canton, f.but_social, f.site_web,
       fu.score_rrf, fu.sim, fu.rang_sem, fu.rang_lex
FROM fusion fu
JOIN fondations f ON f.id = fu.id
ORDER BY fu.score_rrf DESC
LIMIT 150;                          -- 3. vers le re-ranker, puis le re-ranking LLM (prompt b)
```

Avec l'index HNSW et un filtre sélectif, le parcours approximatif peut renvoyer moins de 300 lignes. Régler `SET hnsw.ef_search = 400;` ou, à ce volume, supprimer l'index pour un parcours exact (pgvector 0.8+ propose aussi `hnsw.iterative_scan`).

---

## 7. Prochaines étapes (une semaine de test)

1. Créer le produit AI Services (1M de crédits offerts) et un token dédié. Tester `json_schema` et `dimensions` sur Mistral-Small-4 et Qwen3-Embedding-8B. Demander au support la limite de requêtes par minute.
2. Extraire les 17'779 fondations de LINDAS, filtrer la prévoyance, classifier un échantillon de 300 fondations et le contrôler à la main (précision des domaines et du type).
3. Prendre 5 anciens dossiers de Levier dont les réponses sont connues. Vérifier si les fondations qui ont dit oui figurent dans le top 30 du système. C'est le seul test qui compte avant d'investir davantage.
4. Seulement ensuite : UI, crawl des sites de fondations, lettres.

## Sources principales (consultées le 21.10.2026)

- Infomaniak AI Services, présentation : https://www.infomaniak.com/fr/hebergement/ai-tools
- Infomaniak AI Services, tarifs : https://www.infomaniak.com/fr/hebergement/ai-services/tarifs
- Infomaniak AI Services, modèles : https://www.infomaniak.com/fr/hebergement/ai-services/open-source-models
- Infomaniak API, OpenAPI : https://developer.infomaniak.com/openapi.json ; docs : https://developer.infomaniak.com/docs/api
- Infomaniak, guide AI Services : https://www.infomaniak.com/fr/support/faq/2845/getting-started-guide-ai-services-sovereign-ai-services
- Infomaniak, limites de l'API générale : https://www.infomaniak.com/en/support/faq/2581/quick-start-guide-infomaniak-api
- Infomaniak Database Service : https://www.infomaniak.com/fr/hebergement/public-cloud/database
- Infomaniak VPS Lite : https://www.infomaniak.com/fr/hebergement/vps-lite ; VPS Cloud : https://www.infomaniak.com/fr/hebergement/vps-cloud
- Infomaniak Public Cloud : https://www.infomaniak.com/fr/hebergement/public-cloud ; Kubernetes : https://www.infomaniak.com/fr/hebergement/public-cloud/kubernetes ; Jelastic : https://www.infomaniak.com/fr/hebergement/serveurs-dedies-et-cloud/jelastic-cloud
- LINDAS, jeu de données Zefix : https://register.ld.admin.ch/.well-known/dataset/foj-zefix ; endpoint : https://lindas.admin.ch/query
- Zefix PublicREST, spécification : https://www.zefix.admin.ch/ZefixPublicREST/v3/api-docs
- CEPS, Schweizer Stiftungsreport 2026 (preview) : https://ceps.unibas.ch/fileadmin/user_upload/ceps/6_Ueber_uns/Medienmitteilungen/MM_Preview_Schweizer_Stiftungsreport_2026__05._Februar_2026_.pdf
- Supabase, tarifs : https://supabase.com/pricing ; régions : https://supabase.com/docs/guides/platform/regions
- Conseil fédéral, Swiss-US DPF : https://www.bj.admin.ch/fr/nsb?id=102054
- LPD (RS 235.1) : https://www.fedlex.admin.ch/eli/cc/2022/491/fr
