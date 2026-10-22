# Page publique « Appui » (appui.levierconseil.ch) : questions, objections, structure, mentions légales

22.10.2026 · brief 5 de l'étude · sources publiques consultées le 22.10.2026, listées en fin de document

---

## 0. En bref

1. Une association qui arrive sur cette page se pose d'abord trois questions : **« est-ce pour nous ? »**, **« qu'est-ce que vous faites concrètement, et qu'est-ce qui reste à notre charge ? »**, **« combien, et est-ce honnête ? »**. Appui (l'outil) ne l'intéresse que comme preuve de sérieux. La page doit donc montrer le travail produit (une carte des financeurs, une citation de but statutaire mise en regard d'un projet), pas l'outil.
2. L'argument déontologique est solide et sourçable : les principes éthiques de Swissfundraising (approuvés le 28.06.2010) disent que les fundraisers externes ont des honoraires qui « dépendent de la charge de travail » et qu'ils ne touchent « ni commissions ni parts sur les moyens collectés ». La norme n° 23 du code AFP (2024) va dans le même sens.
3. L'objection la plus sérieuse n'est pas le prix, c'est **« les fondations n'aiment pas les intermédiaires »** : l'aide-mémoire rédigé avec SwissFoundations, l'OFC et le Pour-cent culturel Migros déconseille explicitement de faire rédiger sa requête par des professionnels. La page doit y répondre de front (voir 2.7).
4. Démo recommandée : un **exemple réel du bot** où la meilleure correspondance par le but statutaire est **écartée** après vérification de la fiche pratique (la fondation ne finance que ses propres projets). C'est la preuve la plus convaincante que « la machine propose, l'humain décide ».

### Points à régler avant de publier (bloquants)

| # | Constat | Pourquoi c'est bloquant | Action |
|---|---|---|---|
| A | La page promet « IA hébergée en Suisse (Infomaniak) ». État vérifié dans le code le 22.10.2026 : `bot_fondations.py` prend Infomaniak **par défaut seulement s'il est configuré**, sinon la CLI Claude (Anthropic, hors de Suisse) ; `enrichir_fondations.py` (fiches pratiques) tourne **toujours** sur la CLI Claude avec recherche web ; le README dit encore « moteur par défaut : CLI Claude ». | Une affirmation inexacte sur ses propres prestations peut tomber sous l'art. 3 al. 1 let. b LCD (indications inexactes ou fallacieuses) et l'art. 19 nLPD impose d'indiquer les pays de destination. | Écrire la phrase exacte : « les documents de nos clients sont traités par l'IA d'Infomaniak, en Suisse » n'est vrai que si le bot tourne en production avec Infomaniak (à vérifier sur le serveur). Les fiches ne traitent que des données publiques des fondations : le dire ainsi (voir 3.6). |
| B | Le site levierconseil.ch propose un **appel de 20 minutes** ; le brief demande **15 minutes en visio**. | Incohérence visible entre les deux pages. | Choisir un format et l'aligner partout. |
| C | Chiffres internes : 14'980 fondations « retenues » (sur 17'779 actives), 5'379 ASF, 1'281 As-So, Loterie Romande « 5'658 soutiens, CHF 222 mio » (découpage PDF déclaré « approximatif » dans le README). Le chiffre public de la Loterie Romande pour l'exercice 2025 est **CHF 252 millions pour près de 5'000 projets** (communiqué relayé par La Télé, mai 2026). | Afficher un chiffre de découpage approximatif qui contredit le chiffre officiel affaiblit tout le reste. | Ne pas afficher les chiffres Loterie Romande internes. Formuler la base sans gonfler (voir 3.4). |
| D | levierconseil.ch : **aucune mention légale ni déclaration de protection des données** trouvée, polices chargées depuis Google Fonts, adresse e-mail non lisible dans le HTML. | La page Appui héritera du même défaut si elle reprend le gabarit. | Voir partie 4. |
| E | levierconseil.ch affirme « Levier accompagne déjà des associations et des start-up romandes » alors que PRODUCT.md (21.10.2026) note « aucun client, aucune campagne ». | Règle du brief : ne rien affirmer qu'on ne peut prouver. | Faire confirmer par Alexandre ou retirer de la page Appui. |

---

## 1. Les questions qu'une association se pose, dans l'ordre

Trois lecteurs types : **la présidente bénévole** (peu de temps, veut savoir si c'est sérieux et ce que ça coûte au comité), **la coordinatrice salariée** (fera le travail avec Levier, veut savoir ce qu'on lui demandera), **le trésorier** (prix, risque, déontologie, à quel budget imputer). L'ordre ci-dessous suit la lecture d'une page : d'abord « est-ce pour moi », ensuite « comment », enfin « est-ce sûr ».

Sources d'inspiration : FAQ d'Instrumentl (plateforme de matching, États-Unis), page d'honoraires de The Write Source (rédacteurs de demandes, États-Unis), aide-mémoire OFC / SwissFoundations / Pour-cent culturel Migros, Grantee Review Report 2019 (CEPS Bâle et SwissFoundations), conseils du GREA, pages « comment déposer » de fondations (UBS Kulturstiftung), directives IA de Swissfundraising. Aucune FAQ d'agence romande à honoraires fixes n'a été trouvée en ligne : le terrain est libre.

| # | Question (lecteur) | Réponse honnête à donner |
|---|---|---|
| 1 | **C'est quoi, Appui ? Je dois créer un compte ?** (toutes) | Non. Appui est l'outil de travail de Levier. Vous ne vous connectez à rien : vous recevez le résultat (la carte de vos financeurs, les lettres, le calendrier). La page explique comment ce résultat est préparé. |
| 2 | **Est-ce que c'est pour nous ?** (présidente) | Oui si vous avez un projet défini, un budget et un montant manquant, et une structure qui peut recevoir des fonds (association, fondation, coopérative ; certaines fondations exigent l'exonération fiscale pour utilité publique, d'autres financent des particuliers, par exemple des études). Pas adapté si vous cherchez des dons de particuliers, du sponsoring (contrepartie publicitaire, que l'aide-mémoire OFC distingue de l'aide financière) ou un financement de fonctionnement sans projet identifiable. Le premier échange sert justement à le dire. |
| 3 | **Qu'est-ce que vous faites, qu'est-ce qui reste à notre charge ?** (coordinatrice) | Levier : recherche et sélection des fondations, fiche de chacune (site, délais, pièces demandées), une lettre par fondation, budget mis en forme, calendrier de dépôt, rappels de relance. Vous : fournir les informations sur le projet (statuts, comptes, budget, rapport d'activité), relire et valider chaque lettre, **signer et envoyer** depuis votre association, recevoir les réponses. La demande reste la vôtre. |
| 4 | **Combien ça coûte ?** (trésorier) | Honoraires fixes, sur devis écrit avant de commencer, calculés selon le travail (nombre de fondations, langues). Jamais de pourcentage. *Recommandation : publier une fourchette ou au moins l'unité de calcul (par exemple « par fondation » ou « par campagne »). Les pages de référence qui convertissent bien affichent soit un prix, soit une méthode de calcul ; « sur devis » seul fait fuir les petites associations.* Ne publier un montant que lorsqu'Alexandre l'a fixé. |
| 5 | **Pourquoi pas un pourcentage des fonds obtenus ? Ce serait moins risqué pour nous.** (trésorier) | Parce que c'est la règle du métier : Swissfundraising prévoit que les prestataires externes ont des honoraires selon la charge de travail et ne touchent ni commission ni part des fonds. Le code de l'AFP (norme n° 23, 2024) interdit de même la rémunération au pourcentage. Et une fondation qui donne CHF 10'000 pour un projet ne veut pas qu'une part serve à rémunérer un intermédiaire. |
| 6 | **Peut-on payer Levier avec l'argent obtenu ?** (trésorier) | Pas en prélevant sur le soutien : chaque fondation finance ce qu'elle a accepté de financer, selon le budget présenté. Les honoraires relèvent de votre budget de fonctionnement. Si un frais de recherche de fonds doit figurer dans un budget de projet, il doit être visible et accepté par la fondation. *(Les principes Swissfundraising demandent de présenter les coûts de fundraising séparément et de manière transparente.)* |
| 7 | **Garantissez-vous un résultat ?** (présidente) | Non. Personne ne peut le garantir : la décision appartient au conseil de chaque fondation, et la concurrence entre requérants est la principale difficulté citée par les organisations interrogées dans le Grantee Review Report 2019. Ce que Levier garantit : des fondations dont le but correspond au projet, une lettre écrite pour chacune, des délais tenus, des relances faites. |
| 8 | **Combien de fondations allez-vous contacter ?** (coordinatrice) | Le site de Levier parle de 20 à 30 fondations qui correspondent vraiment au projet. Le nombre dépend du projet et du montant. Mieux vaut 20 demandes ciblées que 100 envois standard : l'aide-mémoire OFC rappelle que tout ce qui ressemble à un envoi multiple est généralement voué à l'échec. |
| 9 | **Comment choisissez-vous les fondations ?** (coordinatrice) | Base : les fondations actives inscrites au registre du commerce (données ouvertes de l'Office fédéral de la justice), complétées par les répertoires des autorités de surveillance (fédérale et Suisse occidentale). Pour chaque fondation proposée, Appui cite **la phrase de son but statutaire** qui rejoint votre projet. Ensuite, une fiche pratique vérifie si elle accepte des demandes, ses délais, ses pièces. Alexandre écarte ce qui ne tient pas. |
| 10 | **Les lettres sont-elles écrites par une IA ? Elles seront génériques.** (présidente) | L'outil prépare : il repère la phrase du but statutaire, propose un angle et un premier jet. Alexandre réécrit, vérifie chaque affirmation et chaque citation, puis vous relisez et signez. Une lettre par fondation, jamais de modèle envoyé à plusieurs. *Transparence : les directives IA de Swissfundraising (décembre 2025) demandent que l'humain garde les décisions importantes et que les contenus produits par IA soient signalés. Le dire sur la page est un avantage, pas une faiblesse.* |
| 11 | **Les fondations voient-elles d'un mauvais œil qu'on passe par une agence ?** (présidente, coordinatrice) | Question légitime : l'aide-mémoire OFC / SwissFoundations / Migros déconseille de faire rédiger sa requête par des professionnels, surtout à cause des **commissions**, et demande, si on y recourt, que le prestataire connaisse parfaitement le projet et que la commission soit déclarée. Réponse de Levier : pas de commission, la demande est signée et envoyée par vous, le contenu vient de votre projet, et vous pouvez dire à une fondation que vous avez été aidés pour la rédaction. |
| 12 | **Que devient ce que nous vous confions ?** (trésorier, présidente) | Vos documents servent uniquement à votre campagne. Pas de revente, pas de réutilisation pour un autre client. Ils ne sont pas utilisés pour entraîner un modèle d'IA. Hébergement et traitement : indiquer **exactement** où (voir point bloquant A). Les principes Swissfundraising précisent que les données de fundraising appartiennent à l'organisation qui collecte. |
| 13 | **Combien de temps avant d'avoir une réponse ?** (présidente) | Des semaines à des mois. Beaucoup de conseils de fondation ne se réunissent que quelques fois par an : la fondation culturelle UBS, par exemple, décide deux fois par an après environ trois mois de traitement, et n'accorde rien rétroactivement. D'où un calendrier de dépôt sur six mois (site Levier) et l'intérêt de commencer bien avant le début du projet. |
| 14 | **Nous avons déjà nos fondations habituelles.** (coordinatrice) | Tant mieux : elles restent les vôtres. On les note pour ne pas les solliciter en double et on cherche celles que vous ne connaissez pas encore, y compris alémaniques. |
| 15 | **Vous écrivez en allemand ?** (coordinatrice) | Oui, lettres en français et en allemand, échanges en anglais. Beaucoup de fondations alémaniques ne reçoivent presque pas de demandes romandes. |
| 16 | **Qui est derrière ?** (présidente) | Alexandre Cazes : ancien conseiller scientifique de la RTS, master IHEID ; a financé son propre master en sollicitant plus de cent fondations, et avec un autre étudiant ils ont obtenu plus de CHF 100'000 pour leurs deux masters (site Levier). |
| 17 | **Et maintenant ?** (toutes) | 15 minutes en visio, gratuit, sans engagement : vous présentez le projet, Levier dit honnêtement si des fondations ont des chances de le financer. |

Deux constats chiffrés utiles en interne (pas à afficher tels quels) : dans le Grantee Review Report 2019 (7 fondations, 416 bénéficiaires et 252 requérants refusés interrogés), les organisations financées ont investi en moyenne **63 heures** dans leur demande contre **23 heures** pour les refusées, et **76 %** des bénéficiaires avaient eu un échange direct avec la fondation avant de déposer, contre **35 %** des refusés. Corrélation, pas causalité, et échantillon de sept grandes fondations : à utiliser au mieux comme « une bonne demande prend du temps », jamais comme taux de réussite de Levier.

---

## 2. Objections et réponses

| # | Objection | Réponse (ton de la page) | Preuve ou source |
|---|---|---|---|
| 2.1 | **« C'est trop cher pour une association comme la nôtre. »** | Le devis est fixé avant de commencer, vous savez ce que vous payez. Comparez-le au temps de votre équipe : une demande bien faite prend des heures, multipliées par le nombre de fondations. Et le premier échange vous dit si cela vaut la peine avant de dépenser un franc. | Grantee Review 2019 (63 h en moyenne par demande financée, à citer prudemment) |
| 2.2 | **« On peut le faire nous-mêmes, les annuaires existent. »** | Oui, et c'est souvent la bonne solution si vous avez le temps. Les annuaires (Spheriq, Fundraiso, répertoires des autorités de surveillance) vous donnent des noms ; il reste à lire chaque but statutaire, vérifier si la fondation accepte des demandes, écrire une lettre par fondation, tenir les délais. C'est ce travail-là que Levier fait. | Aide-mémoire OFC : « procédez de manière systématique », lettre personnalisée par organisme |
| 2.3 | **« IA = lettres génériques. »** | L'IA ne rédige pas vos lettres à votre place : elle trouve la phrase du but de la fondation qui rejoint votre projet. Chaque lettre est réécrite par Alexandre, relue et signée par vous. Exemple sur la page (démo). | Directives IA Swissfundraising : décisions importantes sous responsabilité humaine |
| 2.4 | **« Nos données sont confidentielles (bénéficiaires, comptes). »** | On ne demande que ce dont une fondation a besoin (statuts, budget, comptes, rapport). Pas de données sur vos bénéficiaires. Rien n'est revendu ni réutilisé. Lieu de traitement indiqué en clair. | Principes Swissfundraising (données propriété de l'organisation) ; nLPD art. 19 |
| 2.5 | **« Pourquoi pas au succès ? »** | Parce qu'une commission sur un don détourne une partie de l'argent de la fondation vers un intermédiaire, et que c'est contraire aux règles du métier. Honoraires fixes : vous savez ce que vous payez, la fondation sait ce qu'elle finance. | Swissfundraising (ch. 4) ; AFP norme n° 23 |
| 2.6 | **« On a besoin de l'argent dans un mois. »** | Les fondations décident rarement en moins de quelques mois. Si le délai est trop court, Levier vous le dira au premier échange et vous orientera vers les fondations à décision rapide, s'il y en a pour votre projet. | UBS Kulturstiftung : deux décisions par an, environ trois mois de traitement |
| 2.7 | **« Les fondations n'aiment pas les intermédiaires. »** | Elles n'aiment pas les commissions et les dossiers standard. Ici : aucune commission, une lettre par fondation, signée par votre association, à partir de votre projet. Si une fondation demande qui vous a aidés, vous pouvez le dire. | Aide-mémoire OFC / SwissFoundations / Migros |
| 2.8 | **« Vous n'avez pas de références. »** | Ne pas inventer. Montrer : le parcours d'Alexandre (plus de cent fondations sollicitées, plus de CHF 100'000 pour deux masters), la méthode visible (démo), et proposer un premier échange sans engagement. Ajouter des références réelles dès qu'un client les autorise. | Site levierconseil.ch |
| 2.9 | **« Et si toutes les fondations refusent ? »** | Le travail payé reste à vous : la carte des financeurs, les fiches, les lettres et le budget restent réutilisables pour l'année suivante. Les refus motivés sont notés pour ajuster la prochaine vague. | Pratique décrite dans l'outil (refus avec motif) |

---

## 3. Structure de page proposée (textes prêts)

Ton calqué sur levierconseil.ch : phrases courtes, vouvoiement, pas d'adjectifs de vente, une preuve par affirmation. Charte : Spectral / Hanken Grotesk, papier `#F5F1E8`, encre `#1F2A44`, accent `#B8613F` (polices auto-hébergées, pas Google Fonts).

### 3.1 En-tête (hero)

- **Surtitre** : Levier · Appui
- **Titre** : Les fondations qui peuvent financer votre projet, et pourquoi.
- **Sous-titre** : Appui est l'outil de travail de Levier. Il passe en revue les fondations suisses actives, cite pour chacune la phrase de son but qui rejoint votre projet, et prépare une lettre par fondation. Alexandre Cazes relit tout. Vous signez.
- **Boutons** : [Réserver 15 minutes en visio] (mailto) · [+41 78 845 88 38] (tel:)
- **Ligne de réassurance** : Honoraires fixes, sur devis. Jamais un pourcentage des fonds obtenus.

### 3.2 « Ce que vous recevez » (trois cartes)

1. **La carte de vos financeurs** : 20 à 30 fondations retenues, avec la phrase de leur but qui correspond à votre projet, leur site, leurs délais et les pièces demandées.
2. **Une lettre par fondation** : en français ou en allemand, d'une page, écrite pour ce que cette fondation finance. Vous relisez, vous signez, vous envoyez.
3. **Le calendrier et les relances** : les dates de dépôt sur six mois, les rappels au bon moment, les réponses notées.

### 3.3 Démonstration : « Voici comment une fondation est choisie »

Bloc en deux colonnes, clairement étiqueté **« Exemple illustratif. Projet fictif, aucune demande déposée. »**

**Colonne gauche : le projet** (fictif, inspiré d'un cas réel testé le 21.10.2026 sur un site public)
> Association de parents, Vaud et Jura. Des lignes de trajet à pied vers l'école, encadrées par des bénévoles. Besoin : matériel de sécurité et coordination.

**Colonne droite : ce qu'Appui trouve**

| Fondation (anonymisée) | Phrase du but statutaire (registre du commerce) | Décision |
|---|---|---|
| Fondation A, Jura | « Elle promeut une pratique saine et sûre du vélo chez les enfants et les jeunes » | **Écartée après vérification** : son site montre qu'elle finance et exploite ses propres projets, sans procédure de demande pour des tiers. |
| Fondation B, Vaud | « promouvoir l'inclusion, l'intégration et la santé des enfants, des adolescents et des adultes par des activités physiques et sportives mixtes » | **Retenue** : angle « la marche vers l'école, première activité physique accessible à tous les enfants ». Fiche pratique à compléter. |
| Fondation C, Jura | « Promouvoir, soutenir, valoriser et gérer des activités communes dans le domaine du développement durable, de la promotion de la santé, de la prévention primaire » | **À vérifier** : peut gérer ses propres activités ; appel préalable avant d'écrire. |

**Légende sous le tableau** : La correspondance la plus forte sur le papier n'était pas la bonne. C'est pour cela qu'un humain vérifie chaque fondation avant d'écrire.

Notes de mise en œuvre :
- Citations tirées de `data/bot/ate-pedibus.md` et de la fiche `data/enrichi/` (21.10.2026), toutes deux issues de sources publiques. Re-vérifier chaque citation mot pour mot dans le registre avant publication.
- Les noms de fondations sont masqués pour ne pas laisser croire à une relation avec elles ; le but statutaire reste public (registre du commerce). Le nom de l'organisation réelle qui a servi de test n'apparaît pas.
- Ne pas afficher de montants ni de délais inventés dans la démo : seulement ce que la fiche a réellement trouvé.

**Variante courte (mobile)** : une seule carte « projet / phrase du but / pourquoi / ce qu'on vérifie encore ».

### 3.4 « D'où viennent les fondations »

- **Titre** : Une base publique, des sources citées.
- **Texte** : Appui part du registre du commerce : les fondations actives, publiées en données ouvertes par l'Office fédéral de la justice. Nous en retenons 14'980, sans les caisses de prévoyance ni les fondations en liquidation. Elles sont croisées avec les répertoires de l'Autorité fédérale de surveillance des fondations et de l'Autorité de surveillance de Suisse occidentale (As-So). Toutes ne financent pas des projets de tiers : c'est justement ce que la fiche pratique vérifie.
- **Encart** : Repères Loterie Romande. Pour votre canton et votre domaine, nous regardons quels projets comparables ont été soutenus en 2025, d'après la liste publiée par la Loterie Romande. *(Ne pas afficher le total interne ; si un chiffre est voulu, citer le chiffre officiel : CHF 252 millions pour l'exercice 2025, source Loterie Romande, mai 2026.)*

### 3.5 « Ce qui reste humain » (quatre lignes, style liste)

- Le choix final des fondations : Alexandre.
- Chaque lettre : réécrite par Alexandre, relue et validée par vous.
- La signature et l'envoi : votre association.
- Les décisions : celles des fondations. Personne ne peut les garantir.

### 3.6 « Vos données »

- **Titre** : Ce que vous nous confiez sert à votre campagne, et à rien d'autre.
- **Variante A (seulement si le bot tourne en production avec Infomaniak, vérifié sur le serveur)** : Vos documents sont traités en Suisse, par l'IA d'Infomaniak, et ne servent pas à entraîner de modèle (engagement du fournisseur, à confirmer dans son contrat). La recherche d'informations publiques sur les fondations (sites, délais) peut passer par d'autres services : elle ne contient aucune donnée de votre association. Rien n'est revendu ni réutilisé pour un autre client.
- **Variante B (si ce n'est pas encore le cas)** : Nous ne demandons que les documents qu'une fondation exige. Pour l'analyse, Appui utilise un service d'IA ; le prestataire et le pays de traitement sont indiqués dans notre déclaration de protection des données. Vos textes ne sont ni revendus ni réutilisés pour un autre client.
- Lien : Déclaration de protection des données.

### 3.7 Questions fréquentes (accordéon, 7 questions maximum)

Reprendre dans cet ordre les questions 4, 5, 7, 10, 11, 12, 13 de la partie 1, en deux à trois phrases chacune. Baliser en `FAQPage` (JSON-LD) comme le fait Instrumentl.

### 3.8 Qui est derrière

- Photo, nom, trois lignes : ancien conseiller scientifique de la RTS ; master IHEID ; a financé son master en sollicitant plus de cent fondations romandes et alémaniques.
- Lien vers levierconseil.ch/#a-propos.

### 3.9 Appel à l'action final

- **Titre** : Parlons de votre projet. (formule de levierconseil.ch)
- **Texte** : 15 minutes en visio, gratuites. Vous présentez le projet et le montant recherché ; nous vous disons franchement si des fondations ont des chances de le financer, et en combien de temps.
- **Ce qu'il est utile d'avoir sous la main** : le budget du projet, le montant manquant, la date de début.
- **Boutons** : [Écrire pour fixer 15 minutes] → `mailto:[adresse Levier]?subject=Appui%20-%2015%20minutes` (aucune donnée personnelle dans l'URL) · [Appeler le +41 78 845 88 38] → `tel:+41788458838`
- **Sous les boutons** : Visio sur [outil à préciser]. *Recommandation : un outil hébergé en Suisse (par exemple kMeet d'Infomaniak) pour rester cohérent avec le discours ; à vérifier.*

### 3.10 Pied de page

Levier · Alexandre Cazes · [adresse postale] · [e-mail] · Mentions légales · Protection des données · Dernière mise à jour des données : [date de l'extraction du registre].

---

## 4. Mentions légales et nLPD

Rappel : je ne suis pas juriste. Les points ci-dessous résument les règles publiques ; un contrôle par un juriste ou un modèle validé (par exemple celui d'une faîtière) est recommandé avant mise en ligne.

### 4.1 Impressum (identité du prestataire)

- **Base** : art. 3 al. 1 let. s LCD (RS 241) : quiconque offre des biens, des œuvres ou des prestations par commerce électronique doit indiquer clairement son identité et son adresse de contact, y compris le courrier électronique. Selon les commentaires consultés, cela vaut aussi pour les sites vitrines de prestataires.
- **Contenu minimal** : nom de l'entreprise tel qu'inscrit au registre du commerce (ou, à défaut d'inscription, nom et prénom d'Alexandre Cazes avec la mention « Levier »), adresse postale complète (pas une case postale seule), adresse e-mail lisible. Téléphone recommandé. Numéro IDE si l'entreprise est inscrite.
- **Point à vérifier** : le statut juridique de Levier (raison individuelle inscrite ou non) et le statut d'Appui entre Tim et Levier (« décision en attente » dans PRODUCT.md). Si Tim est coauteur ou copropriétaire de l'outil, le dire ou non relève d'une décision, pas de la page.

### 4.2 Déclaration de protection des données (nLPD, en vigueur depuis le 01.09.2023)

Devoir d'informer (art. 19 nLPD). Contenu minimal à couvrir :
1. **Responsable du traitement** : identité et coordonnées.
2. **Données traitées et finalités** :
   - visiteurs de la page : journaux techniques du serveur (adresse IP, date, page) ;
   - personnes qui écrivent ou appellent : nom, e-mail, téléphone, contenu du message, pour répondre et préparer l'échange ;
   - clients (si la même déclaration couvre les mandats) : documents de l'association, données de contact des responsables, pour préparer les demandes.
3. **Destinataires et sous-traitants** (art. 9 nLPD) : hébergeur de la page, messagerie, outil de visio, **fournisseur d'IA**. Contrat de sous-traitance avec chacun.
4. **Pays de destination** (art. 19 al. 4 nLPD) : à nommer si des données quittent la Suisse. Cas à vérifier : Netlify (hébergement du prototype, États-Unis) si la page y est publiée plutôt que sur le VPS Infomaniak prévu ; la CLI Claude (Anthropic, États-Unis) pour les fiches pratiques (données publiques des fondations seulement) et pour le bot s'il n'est pas configuré sur Infomaniak. Indiquer la garantie applicable (pays reconnu adéquat par le Conseil fédéral, ou clauses contractuelles). *À vérifier : statut du Swiss-US Data Privacy Framework pour chaque prestataire.*
5. **Durée de conservation**.
6. **Droits** : accès, rectification, effacement, opposition ; contact pour les exercer.
7. **IA** : le PFPDT a rappelé le 09.11.2023 que la LPD est directement applicable aux traitements par IA, avec transparence sur la finalité, le fonctionnement et les sources de données. Dire quelles données passent par l'IA, chez qui, et qu'elles ne servent pas à l'entraînement (si c'est contractuellement vrai).

Conseils pratiques tirés de la page PME de la Confédération : déclaration « à un endroit facilement accessible », HTTPS, ne demander que les données nécessaires.

### 4.3 Cookies et polices

- **Base** : art. 45c LTC ; guide du PFPDT sur les cookies (version 1.1 du 06.10.2025).
- **Recommandation** : page sans traceurs, sans outil de statistiques tiers et avec **polices auto-hébergées** (comme déjà fait dans l'application). Alors pas de bandeau cookies nécessaire, et une phrase suffit dans la déclaration. levierconseil.ch charge aujourd'hui Google Fonts depuis les serveurs de Google, ce qui transmet l'adresse IP des visiteurs : à corriger aussi.
- Si un jour on ajoute des statistiques : préférer un outil sans cookies hébergé en Suisse ou dans l'UE, et le mentionner.

### 4.4 Ce que la page ne doit pas dire (LCD art. 3 al. 1 let. b, indications inexactes)

- Pas de taux de réussite, pas de montant obtenu « par Appui », pas de témoignage non autorisé.
- Pas « IA suisse » tant que le moteur par défaut n'est pas Infomaniak (point bloquant A).
- Pas « 14'980 fondations qui financent » : la base contient des fondations actives, dont beaucoup ne financent pas de tiers.
- Le chiffre de CHF 100'000 est celui des deux masters, obtenu avant Appui : le dire ainsi.

### 4.5 Données des fondations dans la base

- La nLPD révisée ne protège plus que les personnes physiques (art. 2 al. 1) : les données des fondations elles-mêmes (personnes morales) n'en relèvent plus. En revanche, les noms des membres de conseil sont des données personnelles : PRODUCT.md prévoit déjà de ne pas les stocker. Le dire en une ligne dans la déclaration (« nous n'enregistrons pas les noms des membres des conseils de fondation »).
- Les fiches pratiques ne contiennent que des coordonnées institutionnelles (README). La fiche de test contient toutefois un numéro de téléphone mobile : vérifier qu'il s'agit bien d'un numéro institutionnel publié par la fondation.

---

## 5. Trois pages de référence

| Page | Pourquoi elle est bien faite | Ce qu'on en reprend |
|---|---|---|
| **Instrumentl, FAQ** : https://www.instrumentl.com/faq | Plateforme américaine de matching de subventions. FAQ qui suit l'ordre de l'acheteur (qui l'utilise, pour qui, en quoi c'est différent, combien, qui est derrière), balisée en `FAQPage` pour les moteurs de recherche. Explique le matching et le suivi des sites de bailleurs. | L'ordre des questions, le balisage JSON-LD, la question « qui est derrière ». Ne pas reprendre les témoignages tant qu'on n'en a pas de vrais. |
| **Fundraiso, accueil** : https://www.fundraiso.com/fr | Base suisse de fondations (plus de 58'000 organisations selon le site). Montre dès l'accueil des **fiches réelles de fondations** et une liste des dernières mises à jour datées : la démonstration remplace l'argumentaire. | L'idée de montrer des exemples réels et la date de mise à jour des données. Positionnement inverse : eux vendent l'accès, Levier fait le travail. |
| **The Write Source, honoraires** : https://write-source.com/about-us/fees/ | Rédacteurs de demandes de subventions (États-Unis). Page entièrement consacrée aux honoraires : estimation écrite avant tout travail, pas de frais initiaux, jamais de commission ni de travail au succès, normes éthiques expliquées, appel à demander un devis gratuit. | La transparence du mode de calcul et la section « éthique » liée au prix. Adapter à des honoraires fixes. |

Contre-exemple utile en interne : certaines plateformes britanniques d'IA pour les demandes de subventions se rémunèrent par un pourcentage des fonds obtenus (résultat de recherche du 22.10.2026, page plinth.org.uk aujourd'hui en erreur 404). C'est précisément le modèle dont Levier se distingue.

---

## Sources (consultées le 22.10.2026)

Déontologie et métier
- Swissfundraising, Principes éthiques pour le fundraising, approuvés le 28.06.2010 (copie publiée par la Fondation CHUV) : https://www.chuv.ch/fileadmin/sites/chuv/Fondation_CHUV/documents/chuv-fondation-principes-ethiques-fundraising.pdf
- Swissfundraising, page Principes éthiques : https://swissfundraising.org/fr/organisation/principes-ethiques/
- Swissfundraising, Directives IA (fichier daté 251205) : https://swissfundraising.org/fr/organisation/directives-ai/
- AFP, Code de déontologie et lignes directrices 2024 (français), norme n° 23 : https://afpglobal.org/sites/default/files/attachments/generic/AFP_Code_of_Ethical_Standards_and_Guidelines_2024_FRENCH.pdf
- Aide-mémoire pour l'établissement de demandes de soutien (promotionculturelle.ch, avec SwissFoundations, OFC, Pour-cent culturel Migros), copie Ville de Meyrin : https://meyrin.ch/sites/default/files/3.3_demande_aidememoire.pdf
- CEPS Bâle et SwissFoundations, communiqué Grantee Review Report, 28.02.2020 : https://www.swissfoundations.ch/wp-content/uploads/2020/02/MM_GranteeReviewReport_2020_final_FR-1.pdf
- UBS Kulturstiftung, comment déposer une demande : https://www.ubs.com/global/fr/ubs-society/foundations/culture-foundation/how-to-apply.html
- GREA, conseils pour une demande : https://www.grea.ch/sites/default/files/bec.pdf
- Articles sur les rédacteurs de demandes et les commissions : https://grantwatch.com/grantnews/how-much-should-you-spend-on-hiring-a-grant-writer · https://fundingforgood.org/how-to-determine-grant-writing-fees/

Droit
- nLPD (RS 235.1), Fedlex : https://www.fedlex.admin.ch/eli/cc/2022/491/fr ; commentaire de l'art. 19 : https://onlinekommentar.ch/fr/kommentare/dsg19
- Portail PME de la Confédération, site commercial et protection des données : https://www.kmu.admin.ch/fr/site-commercial-et-protection-des-donnees
- PFPDT, guide cookies, version 1.1 du 06.10.2025 : https://www.edoeb.admin.ch/dam/fr/sd-web/brLL9rM3ny9d/Leitfaden%20des%20ED%C3%96B%20betreffend%20Datenbearbeitungen%20mittels%20Cookies%20und%20%C3%A4hnlichen%20Technologien%20V.%201.1%20vom%2006.10.2025_FR.pdf
- PFPDT, « La LPD est directement applicable à l'IA » (09.11.2023), relayé par Netzwoche : https://www.netzwoche.ch/news/2023-11-10/das-neue-datenschutzgesetz-gilt-auch-fuer-ki-anwendungen
- Impressum, art. 3 al. 1 let. s LCD : https://juriup.ch/terme-juridique/impressum-et-mentions-legales-en-suisse-art-3-lcd/ · https://law.ch/lawinfo/ict-law-informations-und-kommunikationstechnologie/impressumspflicht-e-commerce/

Données et prestataires
- LINDAS, jeu de données Zefix de l'OFJ : https://register.ld.admin.ch/.well-known/dataset/foj-zefix
- Infomaniak AI Tools (déclarations du fournisseur sur l'hébergement en Suisse et la non-utilisation des requêtes) : https://www.infomaniak.com/fr/hebergement/ai-tools
- Loterie Romande, exercice 2025 (CHF 252 millions) : https://latele.ch/articles/exercie-2025-la-loterie-romande-redistribue-252-millions-de-francs
- Spheriq (ex-StiftungSchweiz), aide : https://support.spheriq.ch/en/collections/593179-stiftungschweiz

Pages de référence
- https://www.instrumentl.com/faq
- https://www.fundraiso.com/fr
- https://write-source.com/about-us/fees/

Sources internes
- levierconseil.ch (texte de la page lu le 22.10.2026)
- `README.md`, `PRODUCT.md`, `data/bot/ate-pedibus.md`, `data/enrichi/` (21.10.2026)
