# Sources de données légales : profil type des fondations donatrices suisses

Projet : outil de matching « association ↔ fondations susceptibles de la financer » (Levier, focus Suisse romande, base nationale).
Version 1, établie le 21.10.2026. Toutes les URL ont été consultées le 21.10.2026 sauf mention contraire.

Principe directeur : la base est construite à partir de sources officielles et de publications des fondations elles-mêmes. Aucune extraction de la base Spheriq (ex-StiftungSchweiz) : ses conditions d'utilisation (version du 01.10.2025, ch. 7.5) interdisent les requêtes automatisées et l'extraction de masse hors des interfaces fournies (https://spheriq.ch/en/terms-of-use/), et la reprise systématique du travail d'un concurrent tomberait sous l'art. 5 let. c LCD.

---

## 1. Synthèse classée par valeur pour le matching

| Rang | Source | Accès | Coût | Valeur | Champs du profil alimentés |
|---|---|---|---|---|---|
| 1 | Zefix via LINDAS (SPARQL, graphe `foj/zefix`) | SPARQL public, sans compte, testé et fonctionnel | Gratuit | Élevée | Identité, UID, forme juridique, siège, adresse, but statutaire |
| 2 | Répertoire As-So des fondations classiques (VD, NE, JU) | PDF public (136 p.) | Gratuit | Élevée | But, sous-types de domaine (taxonomie officielle), adresse |
| 3 | Répertoire ASF / ESA (fondations sous surveillance fédérale) | XLSX public (5,4 Mo) | Gratuit | Élevée | Liste nationale/internationale des fondations surveillées par la Confédération |
| 4 | Sites web et rapports annuels des fondations | Crawl respectueux de robots.txt, PDF | Gratuit (coût de traitement) | Élevée | Délais de dépôt, modalités, montants, projets soutenus, critères d'exclusion, langue |
| 5 | Loterie Romande, liste des soutiens 2025 (BRB2025) | PDF public | Gratuit | Élevée (calibrage) | Bénéficiaires passés, montants typiques, type de soutien, domaine, canton |
| 6 | ZefixPublicREST (API officielle) | REST, identifiants à demander à l'OFRC | Gratuit (selon sources tierces, à confirmer) | Élevée | But, publications FOSC, statut, anciens noms, organe de révision |
| 7 | Répertoire BBSA (Berne, fondations classiques) | PDF public (115 p.) | Gratuit | Moyenne à élevée | Domaine d'activité (« Tätigkeitsbereich »), but, adresse |
| 8 | Amtsblattportal / FOSC (API publique) | REST JSON sans compte, testée | Gratuit | Moyenne | Événements : création, modification du but, liquidation |
| 9 | SwissFoundations, annuaire des membres | Consultation web (filtres domaines, régions) | Gratuit | Moyenne | Signal « fondation donatrice active », domaines |
| 10 | Rapport sur les fondations en Suisse 2026 (CEPS) | PDF | Gratuit | Moyenne (cadrage) | Chiffres de marché, taux de couverture |
| 11 | Registre des fondations surveillées, Fribourg | PDF public (6 p.) | Gratuit | Moyenne | Liste de contrôle (nom, numéro, siège) |
| 12 | Wikidata (SPARQL) | SPARQL public, testé | Gratuit, CC0 | Faible à moyenne | URL du site officiel, date de création |
| 13 | Pro Helvetia, « contributions attribuées » | Base consultable en ligne, 5 dernières années | Gratuit | Moyenne (associations culturelles) | Calibrage montants culture |
| 14 | opendata.swiss : fonds Swisslos (BL, BS, ZG, TG, GR), FNS, BFS loteries | CSV/JSON/XLS | Gratuit (licence « BY ») | Faible à moyenne | Calibrage hors Romandie, statistiques |
| 15 | Listes cantonales d'exonération fiscale (ZH, BE, AG, NE 2019…) | Web/PDF | Gratuit | Faible à moyenne | Statut d'utilité publique (pas de liste publique à GE ni VD) |
| 16 | ZEWO | Base en ligne | Gratuit | Faible | Surtout des bénéficiaires (œuvres d'entraide), utile côté associations |
| 17 | proFonds | Site web | Gratuit | Faible | Réseau, pas de données structurées |
| 18 | Innosuisse / ARAMIS, Startupticker | CSV (ARAMIS), web | Gratuit | Faible | Hors cible (recherche, start-up) |
| 19 | Common Crawl | Index et archives WARC | Gratuit (coût de calcul) | Faible | Alternative au crawl direct, peu utile à cette échelle |
| 20 | Moneyhouse, Easymonitoring, Fundraiso, Spheriq | Plateformes commerciales | Payant | Exclu comme source de base | CGU restrictives (voir fiches) |

---

## 2. Fiches par source

### 2.1 Zefix via LINDAS (SPARQL) : source socle

- Contenu vérifié par requête réelle le 21.10.2026 : pour chaque entité active, `schema:legalName`, `schema:name`, `schema:description` (= but social / purpose), `schema:additionalType` (forme juridique, nomenclature eCH-0097, `0110` = fondation), `schema:identifier` (UID `CHE…`, CHID, EHRAID), `schema:address` (rue, NPA, localité, canton en `schema:addressRegion`), `https://schema.ld.admin.ch/municipality` (numéro OFS de la commune).
- Pas de membres du conseil de fondation dans ce graphe (seuls `givenName`/`familyName` présents concernent le point de contact du jeu de données). Avantage nLPD important.
- Couverture : 17 779 entités de forme « Fondation » (0110), toutes catégories confondues, y compris les fondations de prévoyance. Romandie (VD, GE, VS, FR, NE, JU) : 4 585 fondations après exclusion par le nom des fondations de prévoyance ; 842 d'entre elles ont un but contenant un vocabulaire d'octroi (subside, bourse, soutien financier, distribuer, etc.), filtre heuristique à affiner. Répartition de l'extrait : GE 1 527, VD 1 444, VS 687, FR 473, NE 320, JU 134. 110 noms portent la mention « en liquidation ». Source : requêtes ci-dessous, 21.10.2026.
- Mise à jour : quotidienne (métadonnée `accrualPeriodicity` DAILY ; `dateModified` 2026-10-20).
- Licence : « Provide-the-Source » sur LINDAS ; sur opendata.swiss, conditions « terms_by » : utilisation libre, y compris commerciale, avec obligation d'indiquer la source (https://opendata.swiss/terms-of-use#terms_by).
- Endpoints testés : `https://ld.admin.ch/query` et `https://lindas.admin.ch/query` (POST, les deux renvoient le même résultat).
- Limite : le but statutaire est souvent large ; il ne dit ni les montants, ni les délais, ni si la fondation accepte des demandes spontanées.
- Valeur : élevée. Alimente : identité, UID, forme juridique, siège, commune OFS, canton, but, langue (déduite du but).

Requête qui fonctionne (fondations romandes avec but) :

```sparql
PREFIX schema: <http://schema.org/>
SELECT ?uid ?nom ?canton ?commune ?but WHERE {
  GRAPH <https://lindas.admin.ch/foj/zefix> {
    ?f schema:additionalType <https://ld.admin.ch/ech/97/legalforms/0110> ;
       schema:legalName ?nom ;
       schema:address ?a ;
       schema:identifier ?id .
    ?id schema:name "CompanyUID" ; schema:value ?uid .
    ?a schema:addressRegion ?canton ; schema:addressLocality ?commune .
    OPTIONAL { ?f schema:description ?but }
    FILTER(?canton IN ("VD","GE","VS","NE","FR","JU"))
    FILTER(!REGEX(?nom, "pr[ée]voyance|Vorsorge|pension|personalvorsorge|LPP|BVG", "i"))
  }
} ORDER BY ?canton ?nom
```

Appel en ligne de commande :

```bash
curl -s -X POST https://ld.admin.ch/query \
  -H "Accept: text/csv" \
  --data-urlencode "query@zefix_fondations_romandes.rq" > fondations_romandes.csv
```

Exemple de résultat (extrait réel, 21.10.2026) :

```
uid,nom,canton,commune,but
CHE104001766,Fondation Leenaards,VD,Lausanne,"accorder des subsides à des oeuvres philanthropiques ou d'utilité publique à caractère scientifique, culturel, social ou de santé publique."
CHE116081772,Fondation d'aide sociale et culturelle du Canton de Vaud,VD,Lausanne,"Venir en aide aux institutions d'utilité publique en particulier à caractère social, culturel, de recherche et d'environnement exerçant leur activité dans le canton de Vaud, en leur répartissant le bénéfice de la Loterie Romande attribué au dit Canton; [...]"
CHE261257569,Fonds du sport vaudois,VD,Le Mont-sur-Lausanne,"la Fondation a pour but de venir en aide aux institutions d'utilité publique, en particulier aux associations sportives [...]"
```

Requête de comptage par canton (fonctionne) :

```sparql
PREFIX schema: <http://schema.org/>
SELECT ?canton (COUNT(DISTINCT ?f) AS ?n) WHERE {
  GRAPH <https://lindas.admin.ch/foj/zefix> {
    ?f schema:additionalType <https://ld.admin.ch/ech/97/legalforms/0110> ;
       schema:address ?a . ?a schema:addressRegion ?canton } }
GROUP BY ?canton ORDER BY DESC(?n)
```

Résultat (toutes fondations, prévoyance incluse) : ZH 3 075, BE 1 808, GE 1 665, VD 1 550, BS 1 118, TI 919, … VS 714, FR 495, NE 348, JU 146.

Note : ces comptes diffèrent du Rapport sur les fondations (13 782 fondations d'utilité publique, voir 2.10) parce que LINDAS inclut les fondations de prévoyance et les fondations de famille ou ecclésiastiques inscrites. Le filtrage par but est donc indispensable.

### 2.2 ZefixPublicREST (API officielle de l'OFRC)

- Spécification OpenAPI publique : https://www.zefix.admin.ch/ZefixPublicREST/v3/api-docs (version 2.7.2.4, consultée le 21.10.2026). Endpoints : `/api/v1/company/search`, `/company/uid/{id}`, `/company/ehraid/{id}`, `/sogc/{id}`, `/sogc/bydate/{date}`, `/legalForm`, `/community`, etc.
- Champs `CompanyFull` : name, uid, chid, ehraid, legalForm, legalSeat, status, purpose, address, canton, sogcPub (publications FOSC), oldNames, auditCompanies, deletionDate, hasTakenOver, etc.
- Accès : schéma de sécurité « Zefix-Credentials » (identifiant et mot de passe). Selon des projets tiers non affiliés (https://github.com/jschwendener/zefix-php), la demande se fait par e-mail à zefix@bj.admin.ch. Aucune page officielle trouvée sur la gratuité ou les conditions : à confirmer auprès de l'OFRC avant usage. Pas de compte créé ici.
- Intérêt par rapport à LINDAS : statut (y compris radiées), publications FOSC liées, anciens noms, `sogc/bydate` pour un suivi quotidien des créations et modifications.
- Valeur : élevée en complément de LINDAS, surtout pour le suivi des changements. Alimente : statut, historique, fraîcheur.

### 2.3 FOSC / Amtsblattportal (API publique)

- Endpoint testé sans compte le 21.10.2026 : `https://www.amtsblattportal.ch/api/v1/publications?publicationStates=PUBLISHED&rubrics=HR&pageRequest.page=0&pageRequest.size=1` renvoie du JSON (id, rubrique `HR02` mutation, date, cantons, titre multilingue, numéro de publication).
- Contrôle par UID réussi (via l'outil swiss-register connecté à cette session) : 19 publications pour la Fondation Leenaards (CHE-104.001.766), la dernière le 20.10.2026 (rubrique HR02, mutation).
- Contenu : créations (HR01), mutations (HR02, dont changements de but, de siège, d'organes), radiations (HR03). Les textes de mutation contiennent des noms de personnes (membres du conseil).
- Conditions d'utilisation : aucune condition de réutilisation officielle trouvée sur le portail (exploité par le SECO). Le PFPDT a rappelé dès 2007 que les données du registre du commerce sont des données personnelles lorsqu'elles concernent des personnes physiques (https://www.edoeb.admin.ch, recommandation du 02.05.2007).
- Valeur : moyenne. Usage recommandé : déclencheur de mise à jour (nouvelle fondation, changement de but, liquidation), sans stocker les noms de personnes.

### 2.4 Autorité fédérale de surveillance des fondations (ASF / ESA)

- Liste publique : oui. Page « Répertoire des fondations » (https://www.esa.admin.ch/fr/repertoire-des-fondations) avec un fichier XLSX « Répertoire des fondations ASF au 17 septembre 2026 » (5 426 355 octets, modifié le 22.09.2026, contrôlé par requête d'en-tête uniquement). La page précise que le répertoire porte principalement sur les fondations actives.
- Colonnes : non vérifiées. Le fichier n'a pas été téléchargé (voir « décisions » en fin de document).
- Couverture : 5 520 fondations sous surveillance fédérale fin 2024 (rétrospective annuelle ASF 2024, https://www.esa.admin.ch/dam/fr/sd-web/cg8oGwKgvhbp/Jahresr%C3%BCckblick%20ESA%202024%20fr.pdf). Ce sont les fondations à but national ou international, en moyenne les plus dotées : 85,7 milliards CHF de total des bilans pour 5 184 fondations recensées (Rapport sur les fondations 2026, fig. 11, comptes 2023).
- Licence : conditions générales d'utilisation de admin.ch (la page ne fixe pas de licence spécifique).
- Mise à jour : ponctuelle (fichier daté).
- Valeur : élevée. Seule liste nationale officielle de fondations classiques surveillées. Alimente : statut « surveillance fédérale » (proxy de rayon d'action national ou international), identité.

### 2.5 Autorités cantonales romandes

| Autorité | Périmètre fondations classiques | Liste publique | Contenu | Chiffre |
|---|---|---|---|---|
| As-So (Lausanne) | VD, NE, JU | Oui, PDF « Répertoire des fondations classiques, état au 13.05.2026 » (https://www.as-so.ch/fileadmin/user_upload/Documents/AS-SO/WWW/Editors/CLA/CLA_REP_repertoire-13.5.26.pdf) | UID, n° As-So, dénomination, adresse, NPA/ville, sous-types 1 à 3, but | 1 300 fondations classiques fin 2025 : VD 971, NE 227, JU 102 (rapport annuel 2025, https://www.as-so.ch/fileadmin/user_upload/Documents/AS-SO/WWW/Editors/ORG/ORG_RAPPORT_RA2025_F.pdf) |
| ASFIP (Genève) | GE (activité principalement cantonale) | Non pour les fondations classiques (seul un répertoire des institutions de prévoyance est publié) | – | 608 fondations classiques au 31.12.2025, total des bilans 2024 : 7 890 118 967 CHF (rapport d'activité 2025, https://www.asfip-ge.ch/storage/2023/04/ASFIP_RA_2025.pdf) |
| Fribourg (Service de la justice) | FR | Oui, PDF « Registre des fondations classiques surveillées », état au 31.12.2023 (https://www.fr.ch/document/329036) | Nom, numéro, siège, lien Zefix | 231 entrées |
| Valais | Département (but cantonal), préfets (district), communes (but communal) | Aucune liste publique trouvée (https://www.vs.ch/web/sjsj/surveillance-des-fondations) | – | – |
| BBSA (Berne, y c. Jura bernois) | BE | Oui, PDF « Verzeichnis der beaufsichtigten Stiftungen per 1. Januar 2026 » (https://www.aufsichtbern.ch/files/02_Klassische-Stiftungen/07_Stiftungsverzeichnis/Verzeichnis-der-beaufsichtigten-Stiftungen-per-1.-Januar-2026.pdf), 115 pages | Nom, siège, domicile, domaine d'activité, but | Inscription volontaire et gratuite selon la page, donc liste incomplète |

Point fort de l'As-So : la colonne « sous-types » est une taxonomie de domaines attribuée par l'autorité (exemples relevés : Formation - Education - Ecole ; Enfants - Jeunesse ; Handicapés - malades ; Arts ; Musées ; Personnes âgées ; Précarité ; Logements ; Hôpitaux - Foyers ; Religion ; Sports ; Recherches ; Patrimoine). C'est la meilleure base gratuite pour amorcer la normalisation des domaines en Suisse romande.

Licence : aucune condition de réutilisation explicite sur ces PDF (BBSA : mention « © 2026 BBSA »). Données publiées volontairement à des fins d'information : reprise des données factuelles (nom, but, domaine) défendable, reproduction intégrale du document à éviter. Demander une confirmation écrite à l'As-So et à la BBSA avant une exploitation commerciale (voir section 5).

Valeur : élevée pour As-So (domaines + but), moyenne à élevée pour BBSA, moyenne pour Fribourg (liste sans but).

### 2.6 Exonérations fiscales (utilité publique)

- Genève : pas de liste publique ; l'administration invoque le secret fiscal (article du Temps cité dans les résultats, et plaidoyer pour un registre public dans un article de l'Université de Genève, juin 2024, https://unige.ch/philanthropie/download_file/489/0).
- Vaud : aucune liste publique trouvée ; l'ACI a publié en janvier 2024 des directives sur l'indemnisation des organes d'entités exonérées (postulat 24_POS_28, site vd.ch).
- Neuchâtel : liste PDF des institutions pour lesquelles les dons sont déductibles, révision du 26.07.2019 (https://www.ne.ch/autorites/DFS/SCCO/Documents/PP/2019/ListeDons.pdf) ; actualité à vérifier.
- Hors Romandie : Zurich publie une liste en ligne (5 045 institutions en 2012, communiqué https://www.zh.ch/de/news-uebersicht/medienmitteilungen/2012/01/031_steuerbefreite_institutionen.html) ; Berne publie un répertoire incomplet (les institutions peuvent faire bloquer leur inscription) ; Argovie, Bâle-Campagne, Obwald, Appenzell Rhodes-Extérieures publient des listes.
- AFC fédérale : pas de liste nationale ; l'exonération est décidée par le canton du siège.
- Valeur : faible à moyenne. Ces listes mélangent bénéficiaires et donateurs. Utiles seulement pour confirmer le statut d'utilité publique.

### 2.7 Labels et réseaux

- ZEWO : base en ligne des organisations certifiées sur zewo.ch (prévue par le règlement du label). Il s'agit d'œuvres d'entraide qui collectent des dons, donc surtout des bénéficiaires. Nombre actuel non vérifié (rapport annuel 2025 trop volumineux pour être lu ici). Valeur faible pour le profil fondation, utile côté profil association (signal de qualité).
- SwissFoundations : 240 membres en juin 2025 (https://philea.eu/members/swissfoundations/). Annuaire public « Nos membres » (https://my.swissfoundations.ch/fr/nos-membres/) avec filtres « Domaines de soutien » et « Région ». L'adhésion est réservée aux fondations donatrices dotées d'un patrimoine propre (statuts SwissFoundations). Valeur moyenne : excellent signal « fondation donatrice active et professionnalisée ». Consultation manuelle ou crawl respectueux, sans reprise des textes intégraux.
- proFonds : association faîtière des fondations et associations d'utilité publique ; pas de base de données publique identifiée. Valeur faible.
- CEPS Bâle : voir 2.10.

### 2.8 Données d'octroi effectif (signal fort)

Loterie Romande
- Liste nominative des soutiens 2025 : https://soutien-loro.ch/sites/default/files/2026-05/BRB2025.pdf (page « Bénéficiaires », https://soutien-loro.ch/fr/beneficiaires). Par bénéficiaire : nom, localité, montant, type de soutien (activité, travaux / aménagements, acquisition de matériel, manifestation, publication), domaine, canton, plus une rubrique « Suisse romande » (projets intercantonaux). Environ 4 970 montants relevés dans le PDF ; le document indique que près de 5 000 projets sont soutenus chaque année.
- Totaux (https://soutien-loro.ch/fr/chiffres) : bénéfice réparti 2025 : 252 005 294 CHF ; VD 84 697 934, GE 50 718 507, VS 38 408 720, FR 29 784 159, NE 18 406 841, JU 7 509 865. Soutiens attribués aux projets 2025 : 229 973 997 CHF, dont culture 88 648 314 (38,5 %), sport 41 977 691 (18,3 %), action sociale et personnes âgées 36 926 809 (16,1 %).
- Organes de répartition : ce sont eux-mêmes des fondations ou des fonds (Vaud : Fondation d'aide sociale et culturelle, Fonds du sport vaudois, Fonds d'utilité publique du Conseil d'État ; Genève : Fonds de soutien genevois de la Loterie romande). Ils doivent figurer dans la base comme « bailleurs ».
- Format : PDF mis en page (Illustrator), extraction possible avec `pdftotext -layout` puis nettoyage. Pas de licence explicite ; publication prévue par le droit fédéral sur les jeux d'argent.
- Valeur : élevée. C'est le seul jeu de données romand public qui relie bailleur, bénéficiaire, montant et type de soutien. Il calibre les montants typiques par domaine et canton, et permet d'entraîner le matching (associations semblables déjà financées).

Swisslos et fonds cantonaux (Suisse alémanique)
- opendata.swiss : « Swisslos-Fonds : projets soutenus par domaine et montant (depuis 2011) » (Bâle-Campagne, CSV/JSON/Parquet, licence BY, mise à jour annuelle), « Swisslos-Sportfonds Basel-Stadt », sport Zoug et Thurgovie, utilisation des fonds Grisons. API CKAN : `https://ckan.opendata.swiss/api/3/action/package_search?q=Swisslos` (fonctionne avec un User-Agent explicite ; sans User-Agent, réponse 403).
- Valeur : faible à moyenne pour la Romandie, utile pour la base nationale.

Pro Helvetia
- « Contributions attribuées » : base en ligne des cinq dernières années, avec bénéficiaire, type de projet et montant (https://prohelvetia.ch/en/contributions-attributed/). Pas d'export ni de licence indiqués. Valeur moyenne pour les associations culturelles (calibrage public, pas une fondation privée).

FNS (Fonds national suisse)
- Exports CSV quotidiens via opendata.swiss (`snsf-data-portal-exports`) : https://data.snf.ch/datasets/Grant.csv, `grants_with_abstracts.csv`, `persons.csv`, etc. Licence « BY ». Contient des noms de chercheurs (données personnelles). Valeur faible pour des associations, sauf associations de recherche.

Innosuisse / ARAMIS
- ARAMIS (base des projets de recherche de la Confédération) est publié en CSV sur opendata.swiss (jeu `aramis`), dernière modification de la fiche en avril 2021 selon les résultats consultés. Aucun jeu ouvert Innosuisse trouvé. Valeur faible.

Statistique BFS
- « Contributions annuelles des loteries destinées à la culture, par canton » (XLS, opendata.swiss). Agrégé, utile pour le cadrage seulement.

Fondations universitaires et rapports annuels
- Pas de base consolidée. Les rapports annuels (PDF) des grandes fondations et les pages « projets soutenus » sont la vraie source des montants et bénéficiaires privés (voir 2.9).

### 2.9 Enrichissement web

Sites des fondations
- Contenu attendu : domaines prioritaires, critères d'exclusion, zone géographique, fourchette de montants, délais ou dates de comité, portail de dépôt, langue, projets soutenus, rapport annuel.
- Accès : crawl ciblé (page d'accueil, « soutien », « demande », « projets soutenus », « rapport annuel »), respect de robots.txt, User-Agent identifié, débit faible. Contrôles faits le 21.10.2026 : robots.txt de oakfnd.org et leenaards.ch sans interdiction générale ; Easymonitoring renvoie 403 aux clients automatisés.
- Droit : les textes sont protégés par le droit d'auteur ; extraire des faits (dates, montants, domaines) et résumer, ne pas republier les textes. Lien vers la page source pour chaque champ.
- Valeur : élevée, c'est la seule source des champs opérationnels (délais, modalités). Coût : extraction et vérification humaine.

Rapports annuels PDF
- Montants distribués, liste des bénéficiaires, ventilation par domaine. Valeur élevée pour les 100 à 200 plus grandes fondations romandes ; extraction semi-automatique puis contrôle.

Wikidata
- SPARQL testé le 21.10.2026 sur https://query.wikidata.org/sparql : 322 entités typées « fondation » (Q157031 et sous-classes) avec pays Suisse ; 265 ont un site officiel (P856), 26 un UID suisse (P4829). Licence CC0.
- Requête qui fonctionne :

```sparql
SELECT ?f ?fLabel ?uid ?site WHERE {
  ?f wdt:P31 wd:Q157031 ; wdt:P17 wd:Q39 .
  OPTIONAL { ?f wdt:P4829 ?uid }
  OPTIONAL { ?f wdt:P856 ?site }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,de,en". }
} LIMIT 6
```

  Exemple de résultat : « Swiss Re Foundation, https://www.swissrefoundation.org/ » ; « Thomi-Hopf-Stiftung, https://thomi-hopf-stiftung.ch/ » (sans UID).
- Valeur : faible à moyenne. Sert surtout à trouver l'URL du site ; couverture très partielle.

Common Crawl
- Index et archives publics. Conditions : licence limitée, respect des droits des tiers sur le contenu archivé ; conseil juridique recommandé pour un usage commercial (https://commoncrawl.org/terms-of-use). Valeur faible : un crawl direct de quelques milliers de sites est plus simple et plus frais.

opendata.swiss (recherche du 21.10.2026)
- Pertinents : Zefix (service LINDAS), Swisslos (BL, BS, ZG, TG, GR), FNS, ARAMIS, BFS loteries/culture, subventions culturelles cantonales et communales par type de bénéficiaire (agrégées), « Firmen nach Zweck, Rechtsform und Standort » (Bâle-Campagne). Aucun jeu romand de bénéficiaires de fondations.

Startupticker
- Actualité des start-up suisses ; hors cible pour des associations. Valeur faible.

### 2.10 Chiffres de cadrage (Rapport sur les fondations en Suisse 2026, CEPS / SwissFoundations / UZH, publié le 27.05.2026)

Source : https://www.swissfoundations.ch/wp-content/uploads/2026/05/25069_Sf_Rap.-26_F_DEF_Digital.pdf et communiqué https://www.swissfoundations.ch/wp-content/uploads/2026/05/MM_Sftungsreport_2026-FR_final.pdf

- 13 984 fondations d'utilité publique inscrites au registre du commerce fin 2025, dont 202 en liquidation ; analyse sur 13 782 fondations.
- 325 créations et 253 liquidations en 2025.
- Par canton (fin 2025) : GE 1 401, VD 1 333, VS 600, FR 403, NE 295, JU 122 (ZH 2 218, BE 1 417).
- Types (fig. 9) : 6 809 fondations donatrices, 4 513 opérationnelles, 2 573 mixtes, 34 abritantes (total 13 929 dans cette figure) ; seules 10,4 % des fondations donatrices ont une direction inscrite au registre du commerce.
- 51,6 % des fondations ont un rayon d'action local, communal, cantonal ou régional.
- Patrimoine : 159,6 milliards CHF (total des bilans, comptes 2023, 13 071 fondations recensées auprès des autorités), dont 85,7 milliards sous surveillance fédérale ; moyenne 12,2 millions CHF. VD/NE/JU (As-So) : 1 307 fondations, 9 372 000 000 CHF.
- Distributions des fondations donatrices : environ 6 milliards CHF par an (estimation du Rapport 2025, rappelée dans le Rapport 2026).
- À noter : le rapport 2026 mentionne un projet « Data Alliance » réunissant le CEPS, Spheriq, le Geneva Centre for Philanthropy, l'ASF, des autorités cantonales et SwissFoundations pour collecter des indicateurs structurels sur les fondations. Spheriq est donc associé à la future source de données semi-officielle : à suivre de près.

### 2.11 Plateformes commerciales (à ne pas utiliser comme source de base)

- Spheriq (ex-StiftungSchweiz, Spheriq AG, Bâle) : plus de 13 000 fondations selon sa FAQ ; CGU du 01.10.2025, ch. 7.5 : « Automated queries and mass data extraction (scraping) outside the provided interfaces are prohibited. » Exclu.
- Moneyhouse (NZZ) : CGU du 01.01.2020, ch. 4.1 usage personnel et non commercial ; ch. 4.8 interdiction de transmettre les données à des tiers (https://www.moneyhouse.ch/fr/terms). Exclu pour une base revendue.
- Easymonitoring : site inaccessible aux clients automatisés (403 le 21.10.2026), tarif non trouvé. Exclu.
- Fundraiso : base commerciale (offre gratuite limitée, abonnements Pro/Business annuels, offre API Enterprise sur devis, https://www.fundraiso.com/fr/pricing) ; plus de 58 000 organisations dans 28 pays selon sa page statistiques. Licence API possible mais dépendance à un concurrent indirect. À considérer seulement comme partenariat de données négocié.

---

## 3. Profil type « fondation » : schéma de champs et sources

| Bloc | Champ | Type | Source principale | Source de secours | Fraîcheur visée |
|---|---|---|---|---|---|
| Identité | `uid` (CHE…) | texte, clé | LINDAS Zefix | ZefixPublicREST | quotidienne |
| Identité | `nom_officiel`, `noms_alternatifs` | texte | LINDAS Zefix | ZefixPublicREST (`oldNames`, `translation`) | quotidienne |
| Identité | `forme_juridique` (0110), `statut` (active / en liquidation / radiée) | code | LINDAS Zefix | ZefixPublicREST, FOSC HR03 | quotidienne |
| Identité | `type_fondation` (donatrice / opérationnelle / mixte / abritante) | énumération | Déduit du but (classifieur) + site web | SwissFoundations (membre = donatrice) | annuelle |
| Identité | `autorite_surveillance` (ASF, As-So, ASFIP, FR, VS, BBSA…) | énumération | Répertoires ASF, As-So, FR, BBSA | Déduction par canton | annuelle |
| But | `but_statutaire` | texte long | LINDAS Zefix (`schema:description`) | ZefixPublicREST `purpose` | quotidienne |
| But | `but_resume` | texte court | Généré à partir du but + site | – | à chaque changement |
| Domaines | `domaines_normalises` (liste) | taxonomie interne | Classifieur sur but + site | Sous-types As-So, Tätigkeitsbereich BBSA, filtres SwissFoundations, domaines LoRo | annuelle |
| Domaines | `publics_cibles` (enfants, personnes âgées, handicap, migrants…) | taxonomie | But + site | Sous-types As-So | annuelle |
| Domaines | `exclusions` (pas de frais de fonctionnement, pas de particuliers…) | liste | Site web (lignes directrices) | Rapport annuel | annuelle |
| Géographie | `siege_commune_ofs`, `siege_canton` | code | LINDAS Zefix | – | quotidienne |
| Géographie | `zone_intervention` (commune, canton, Romandie, Suisse, international) | énumération + liste | But (extraction) + site web | Surveillance ASF = proxy national/international | annuelle |
| Montants | `montant_min`, `montant_max`, `montant_typique` | CHF | Site web, rapport annuel | Calibrage LoRo par domaine et canton (pour les organes LoRo) | annuelle |
| Montants | `volume_annuel_distribue` | CHF | Rapport annuel | – | annuelle |
| Bénéficiaires | `beneficiaires_passes` (nom, UID si dispo, année, montant, domaine) | table liée | Rapports annuels, pages « projets soutenus », BRB LoRo | Communiqués | annuelle |
| Calendrier | `delais_depot` (dates ou « en continu »), `dates_comite` | dates | Site web | Contact institutionnel | à chaque saison |
| Modalités | `mode_demande` (portail, e-mail, courrier, sur invitation seulement), `url_formulaire`, `documents_requis` | énumération + texte | Site web | – | annuelle |
| Modalités | `accepte_demandes_spontanees` | booléen | Site web | – | annuelle |
| Langue | `langues_acceptees` | liste | Site web | Langue du but Zefix | annuelle |
| Contact | `email_generique`, `telephone_standard`, `adresse_postale`, `site_web` | texte | Site web, Zefix (adresse) | Wikidata (P856) | annuelle |
| Signaux | `membre_swissfoundations`, `organe_lotterie` | booléen | Annuaire SwissFoundations, liste des organes LoRo | – | annuelle |
| Signaux | `derniere_mutation_rc`, `changement_but_recent` | date, booléen | FOSC API | ZefixPublicREST `sogc/bydate` | quotidienne |
| Traçabilité | `sources` (URL par champ), `date_collecte`, `date_verification`, `score_confiance` | méta | Pipeline | – | à chaque collecte |

Règles :
- Clé de jointure unique : l'UID. Toute source sans UID (LoRo, sites web, SwissFoundations) passe par un rapprochement nom + commune, validé manuellement en cas de doute.
- Pas de champ « personne » dans le profil (pas de membres du conseil, pas de noms de collaborateurs). Contact = adresse générique ou formulaire.
- Chaque champ garde sa source et sa date ; un champ de plus de 18 mois est signalé comme « à revérifier ».

---

## 4. Précautions nLPD et LCD

1. Membres de conseil de fondation : données personnelles (même publiées au registre du commerce ; position du PFPDT, recommandation du 02.05.2007). Ne pas les stocker dans le profil ni les utiliser pour du profilage de personnes. LINDAS ne les contient pas, ce qui facilite la conformité. Si un besoin apparaît (ex. détecter un lien d'intérêt), traiter à la volée, sans conservation.
2. Principes de l'art. 6 nLPD : finalité (matching d'organisations, pas de prospection de personnes), proportionnalité (minimum de champs), exactitude (dates de vérification), durée de conservation définie.
3. Devoir d'informer (art. 19 nLPD) : s'applique dès qu'on traite des données personnelles, même collectées auprès de tiers. L'art. 20 al. 2 nLPD prévoit des exceptions lorsque l'information est impossible ou exige des efforts disproportionnés, à interpréter strictement. Le plus simple : ne pas collecter de données de personnes. Publier une déclaration de protection des données sur l'outil Levier.
4. Contacts : uniquement adresses institutionnelles génériques (info@, secretariat@). Les adresses nominatives trouvées sur les sites ne sont pas reprises.
5. Bénéficiaires passés : ce sont des organisations, mais certains bénéficiaires LoRo ou Pro Helvetia sont des personnes physiques (artistes, chercheurs FNS). Filtrer : ne garder que les personnes morales.
6. Droit d'auteur : extraire des faits, ne pas republier les textes des sites ou des rapports ; lien vers la source.
7. LCD art. 5 let. c : ne jamais reprendre une base compilée par un tiers (Spheriq, Fundraiso, Moneyhouse) par procédé technique, ni « nettoyer » nos données en les comparant automatiquement à la leur.
8. Crawl : respecter robots.txt, User-Agent identifié avec adresse de contact générique de Levier (pas d'adresse personnelle), débit faible, arrêt immédiat sur demande d'un site.
9. Données hors Suisse : si l'hébergement ou un sous-traitant d'IA est hors de Suisse, vérifier les garanties de transfert (art. 16 nLPD) ; les buts statutaires et profils d'organisations posent peu de risque, mais la règle s'applique dès qu'une donnée personnelle passe.
10. Recours à un juriste : avant commercialisation, faire valider la réutilisation des PDF des autorités (As-So, BBSA, FR) et des listes LoRo, et le texte de la déclaration de protection des données. Ce document n'est pas un avis de droit.

---

## 5. Ordre de mise en œuvre recommandé

1. Semaine 1 : socle Zefix. Exécuter la requête LINDAS pour toute la Suisse (fondations 0110 avec but), exclure prévoyance et familles par le but, stocker UID, nom, canton, commune OFS, but, date d'extraction. Résultat attendu : environ 4 500 fondations romandes, dont environ 840 avec signal d'octroi explicite (heuristique à améliorer).
2. Semaine 1 : surveillance. Joindre le répertoire As-So (sous-types, but) et la liste Fribourg ; demander à l'As-So et à la BBSA par écrit si une version tableur peut être fournie et à quelles conditions de réutilisation.
3. Semaine 2 : couche nationale. Charger le XLSX ASF (après feu vert de téléchargement), marquer les fondations à rayon national ou international.
4. Semaine 2 : classifieur de domaines. Construire la taxonomie Levier à partir des sous-types As-So, des domaines LoRo et des filtres SwissFoundations ; classer les 4 500 buts ; contrôle manuel d'un échantillon de 200.
5. Semaines 3 à 4 : données d'octroi. Extraire le PDF LoRo 2025 (et années précédentes si disponibles), relier les organes de répartition à leur UID, calculer les montants typiques par domaine et canton.
6. Semaines 3 à 6 : enrichissement web des 300 fondations donatrices romandes les plus pertinentes (signal d'octroi + membres SwissFoundations + surveillance ASF) : site, délais, modalités, montants, projets soutenus, langue. Wikidata pour retrouver les sites manquants.
7. Ensuite : suivi quotidien via FOSC API (créations, changements de but, liquidations), demande d'accès ZefixPublicREST pour le statut et l'historique, extension nationale (BBSA, listes fiscales ZH/BE).
8. En continu : vérification humaine des champs opérationnels avant chaque saison de dépôt.

## Décisions à prendre par Tim

- Télécharger le répertoire ASF (fichier « Répertoire des fondations ASF au 17 septembre 2026 », XLSX, 5,4 Mo, source backend.esa.admin.ch) pour vérifier ses colonnes : non fait sans ton accord.
- Écrire à zefix@bj.admin.ch pour un accès ZefixPublicREST (adresse issue de projets tiers, à confirmer sur le site de l'OFRC).
- Écrire à l'As-So et à la BBSA pour obtenir leurs répertoires en tableur et une confirmation des conditions de réutilisation.
