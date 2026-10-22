# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Délégué : HTML/CSS/JS statique sans framework ni build (une page, routage par hash, données en JS local), servi en local par `python -m http.server` ; polices Google (connexion requise) tant qu'elles ne sont pas auto-hébergées. Raison : prototype démontrable immédiatement, migrable ensuite vers une app Infomaniak (VPS ou Public Cloud) + Postgres/pgvector + LLM Infomaniak. Choisi le 21.10.2026.

## Users

- **Conseiller·ère de l'agence Levier** (agence présidée par Alexandre Cazes, d'autres conseillers possibles) : gère plusieurs clients et plusieurs campagnes de recherche de fonds en parallèle. Travail de bureau, sessions longues, sur ordinateur portable. Tâche : trouver les fondations pertinentes pour chaque client, préparer une lettre par fondation, suivre les envois, relances et réponses, respecter les délais de dépôt.
- **Client** (association, start-up, étudiant·e master/doctorat, consultant·e) : ne se connecte pas ; reçoit la carte de ses financeurs, les lettres à valider et des points d'avancement. Un espace client limité est prévu plus tard.
- **Association prospecte** : arrive sur la page publique d'Appui (appui.levierconseil.ch), comprend ce que Levier peut faire pour elle et réserve 15 minutes en visio.

## Product Purpose

Outil interne d'agence pour piloter des campagnes de recherche de fonds auprès des fondations suisses, de façon quasi automatique sur la préparation et humaine sur la décision et l'envoi. Il lit le site web d'un client, en tire un profil, classe les fondations susceptibles de le financer (base issue du registre du commerce, enrichie), propose des brouillons de lettres et suit chaque demande jusqu'à la réponse. Succès : plus de dossiers de qualité par conseiller et par semaine, aucun délai manqué, un taux de réponse positive mesuré.

## Positioning

Ce n'est pas un annuaire en libre-service (Spheriq, ex-StiftungSchweiz, 0 à 1'650 CHF/an) : c'est l'outil d'une agence qui fait le travail. Le matching est expliqué (citation du but social de la fondation, raisons, risques) et l'IA tourne chez Infomaniak, en Suisse. Honoraires fixes, jamais de pourcentage sur les fonds obtenus. Une lettre par fondation, relue par un humain.

## Operating Context

- Cycle d'une campagne : appel gratuit, analyse du client (site web, documents), carte des financeurs, sélection, rédaction, validation client, envoi, relances, réponse, bilan.
- Plusieurs campagnes actives en même temps, avec des délais de dépôt propres à chaque fondation.
- Données : registre du commerce (Zefix, public) pour l'identité et le but social ; enrichissements à venir (sites des fondations, rapports annuels, listes de bénéficiaires).
- Langues de rédaction : français, allemand, anglais.

## Capabilities and Constraints

- Capacités du prototype : tableau de bord agence, clients, campagnes (pipeline), explorateur de fondations avec filtres, matching expliqué, éditeur de lettre, relances, vue client en lecture.
- Le matching IA est simulé dans le prototype (score par mots-clés sur les vraies données Zefix) ; le vrai moteur (embeddings + re-ranking LLM Infomaniak) est documenté dans `docs/`.
- Aucun envoi automatique de lettres : l'humain valide et envoie.
- Contraintes nLPD : minimiser les données personnelles (pas de noms des membres de conseil dans la base), hébergement suisse visé.
- Ne jamais réutiliser la base de Spheriq.
- Propriété : Appui (code, données, nom) appartient à Alexandre Cazes / Levier depuis le 22.10.2026.
- Multi-utilisateur : serveur PocketBase hébergé chez Infomaniak (VPS), comptes créés par l'administrateur ; IA Infomaniak (Qwen 3.5).
- Les clients ne se connectent pas : ils reçoivent les résultats. Un espace client limité viendra plus tard.

## Brand Commitments

- Nom : **Levier**. Logo actuel : mot-symbole textuel « Levier. » avec un point final. Logo retravaillé le 21.10.2026 (icône carrée marine, L blanc, point terre cuite ; mot-symbole « levier. »), congruent avec le site levierconseil.ch.
- Voix : directe, sobre, vouvoiement envers les clients, phrases courtes, pas de jargon marketing, insistance sur la rigueur (sources, honoraires fixes, relecture par le client). Formule récurrente : « Parlons de votre projet. »
- Charte existante du site (binding, à respecter) : Spectral (titres) + Hanken Grotesk (texte) ; papier `#F5F1E8`, encre `#1F2A44`, encre douce `#4A5470`, accent terre cuite `#B8613F`, teinte `#EDE6D8`, filet `#D9D2C3` ; mode sombre existant (papier `#161D2E`, encre `#EEE8DB`, accent `#E08B66`).
- Écriture inclusive avec point médian utilisée sur le site (« consultant·e·s »).

## Evidence on Hand

- Site : https://levierconseil.ch/ (source HTML copiée dans le scratchpad de la session du 21.10.2026).
- Preuves publiques du fondateur (site) : conseiller scientifique pour la RTS, mémoire IHEID, 100'000 CHF obtenus auprès de fondations pour deux masters, trois langues.
- Données réelles : `data/fondations_romandes.json` (extraction Zefix du 21.10.2026).
- Absences : aucun client, aucune campagne, aucun taux de réussite réels. Le prototype utilise des clients fictifs clairement marqués comme démonstration ; ne jamais présenter de chiffres de résultats inventés comme réels.

## Product Principles

1. Le conseiller décide, la machine prépare : chaque score s'explique, chaque lettre est relue.
2. Une fondation, une lettre : jamais d'envoi de masse.
3. Les délais d'abord : ce qui expire bientôt est toujours visible.
4. Sourcer tout : chaque information sur une fondation dit d'où elle vient et de quand elle date.
5. Le client voit l'avancement sans pouvoir rien casser.

## Accessibility & Inclusion

WCAG 2.1 AA visé (contraste, clavier, lecteurs d'écran). Interface en français, rédaction FR/DE/EN.
