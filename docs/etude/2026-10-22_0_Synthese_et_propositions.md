# Étude de marché Appui : synthèse et intégrations proposées

22.10.2026 · cinq études en parallèle (fichiers 1 à 5 de ce dossier, sources datées dans chacun). Ce document résume et **propose** ; rien n'est encore codé.

## Ce que l'étude dit, en 8 points

1. **Le vrai coût, c'est le temps.** Une demande acceptée a demandé en moyenne 63 h de préparation, une refusée 32 h, un rapport 31 h (Grantee Review Report, 7 grandes fondations, données 2019). 48 % des fonctions de comité ne sont pas rémunérées. (étude 1)
2. **Trouver les bonnes fondations est la 2e difficulté**, après la concurrence. 42 % des refus arrivent sans motif. Le contact préalable fait la différence : 76 % des projets soutenus avaient échangé avec la fondation avant de déposer, contre 35 à 36 % des refusés. (études 1 et 2)
3. **Les fondations détestent l'envoi de masse et les commissions.** Le guide co-signé par SwissFoundations déconseille de faire rédiger sa demande par un professionnel, surtout à cause des commissions ; Ernst Göhner refuse les demandes liées à une commission. Les honoraires fixes de Levier, et une demande signée et portée par l'association, retournent cet argument en faveur de Levier. (études 2 et 5)
4. **Les règles de dépôt sont mécaniques** : environ 4 mois avant le début du projet (Leenaards, FASC, Sandoz), 5 mois chez Ernst Göhner ; dossier incomplet, hors délai ou projet déjà commencé = écarté sans examen ; souvent une demande par an au maximum. Plusieurs grands noms n'acceptent aucune demande spontanée (Jacobs, Fonds pionnier Migros). (étude 2)
5. **L'IA n'est pas sanctionnée en soi** : aucune fondation privée suisse n'a de règle publique ; ce qui est sanctionné, c'est le faux, le générique et l'opacité. Swissfundraising (directives IA, décembre 2025) demande que l'humain garde les décisions. (étude 2)
6. **Le marché adressable est réel** : 4'750 associations inscrites au registre du commerce dans les 6 cantons romands (comptage LINDAS), sans compter les non inscrites. Tarifs observés : CHF 100 à 150/h pour les consultants référencés par Bénévolat-Vaud, jusqu'à CHF 300/h ailleurs ; aucun prix public « par lettre » en Suisse. (étude 4)
7. **Segments prioritaires** : associations moyennes avec au moins un·e salarié·e, projets culturels, consultants qui sous-traiteraient. Petites associations et étudiants : petit forfait sans prospection individuelle. (étude 4)
8. **Ce qui rendrait Appui « ouf » pour Alexandre** : une file « Aujourd'hui » synchronisée au calendrier, une bibliothèque de textes par client, la lecture automatique du règlement de chaque fondation en liste de contrôle, une relecture « comme le conseil de fondation », des projets comparables financés, la veille des sites des fondations ciblées, le suivi après accord, un plafond de sollicitations par fondation, un rapport client mensuel, et une « stratégie de financement » offerte au premier contact. (étude 3)

## Intégrations proposées (à valider une par une)

Classées par impact sur le temps d'Alexandre et sur le taux d'accord. Effort : S = moins d'une demi-journée, M = 1 à 2 jours, L = plus.

### A. Tout de suite (le socle de la crédibilité)
| # | Proposition | Pourquoi | Où dans Appui | Effort |
|---|---|---|---|---|
| A1 | **Statut d'accès par fondation** : accepte les demandes / sur invitation / non / inconnu, en filtre dur du matching et de la page | Évite d'écrire à Jacobs ou à une fondation opérationnelle ; déjà amorcé par les fiches pratiques | fiche fondation, matching, bot | S |
| A2 | **Moteur de délais** : date de début du projet → date limite de dépôt par fondation (4-5 mois avant, séances), alerte « trop tard » | Les dossiers hors délai sont écartés sans examen | profil client (date de début), demandes, Aperçu | M |
| A3 | **Cadence et anti-doublon** : une demande par fondation et par 12 mois, alerte inter-clients, plafond de sollicitations | Protège la réputation de Levier auprès des fondations | demandes, mémoire d'agence | S |
| A4 | **Liste de contrôle des pièces** (statuts, comptes, budget, rapport, exonération) par client et par fondation | Dossier incomplet = refus | profil client, lettre | S |
| A5 | **Garde-fous de rédaction** : longueur 1 page, aucun chiffre sans source du client, citation du but vérifiée, signature et envoi par l'association | Contre le générique et le faux ; argument face au guide SwissFoundations | éditeur de lettre, prompt Qwen | S |

### B. Les gains de temps (ce qui fait gagner des heures)
| # | Proposition | Pourquoi | Effort |
|---|---|---|---|
| B1 | **File « Aujourd'hui »** + export calendrier (.ics) des dépôts et relances | Alexandre n'oublie rien, ne cherche rien | S |
| B2 | **Bibliothèque de textes par client** (mission, projet, budget, impact) en FR/DE, réutilisée par chaque lettre | Une lettre se monte en 15 min au lieu d'une heure | M |
| B3 | **Lecture automatique du règlement** de chaque fondation (PDF ou page) → liste de contrôle et limites de caractères | Supprime la lecture manuelle des guides | M |
| B4 | **Relecture « conseil de fondation »** par Qwen : note critère par critère, chaque phrase reliée à sa source | Qualité avant envoi, en 1 clic | S |
| B5 | **Recherche par le sens** (embeddings Infomaniak + re-ranking Qwen) à la place des mots-clés | Le classement par mots-clés laisse passer des erreurs (ex. une fondation de hockey pour des ateliers de lecture) | M |

### C. Ce que le client voit (sans se connecter)
| # | Proposition | Effort |
|---|---|---|
| C1 | **Carte des financeurs en PDF** à l'image de Levier (fondations, phrase du but, délais, montants) : le livrable phare | S |
| C2 | **Rapport mensuel** automatique par client (envoyées, réponses, prochaines étapes) en PDF ou e-mail rédigé, envoyé par Alexandre | S |
| C3 | **« Stratégie de financement » offerte** au premier contact : 5 fondations + 2 repères Loterie Romande, générée en 10 min après la visio | S |

### D. Prospection (la plateforme comme prétexte honnête)
| # | Proposition | Effort |
|---|---|---|
| D1 | **Liste de prospects** depuis le registre du commerce (4'750 associations romandes inscrites) et les bénéficiaires publiés par la Loterie Romande, avec un pipeline « prospects » dans Appui | M |
| D2 | **Scripts** e-mail, LinkedIn, appel (étude 4), envoyés **un par un, à la main** (LCD art. 3 al. 1 let. o : pas d'envoi automatisé de masse) | S |
| D3 | **Page publique Appui** (faite) + l'essai en direct comme accroche : « voici trois fondations qui citent votre domaine, on en parle 15 minutes ? » | fait |

### E. Offre et prix (décision d'Alexandre)
Forfaits proposés par l'étude 4 (heures estimées, à mesurer sur les premiers mandats) : **Diagnostic CHF 750**, **Campagne 10 fondations CHF 3'500**, **Accompagnement annuel CHF 650/mois** ; étudiant CHF 350 ; sous-traitance pour consultants CHF 950/jour. Les afficher sur la page publique augmenterait la conversion des petites associations.

## Avant de publier la page publique (bloquants)
1. **IA en Suisse** : ne l'affirmer qu'une fois Qwen/Infomaniak branché sur le serveur (la page actuelle ne l'affirme pas ; elle renvoie à la déclaration de protection des données).
2. **Mentions légales** : adresse postale de Levier à compléter (art. 3 al. 1 let. s LCD) ; rédiger la déclaration de protection des données (nLPD art. 19) en nommant les prestataires (Infomaniak, Anthropic pour les fiches publiques).
3. **15 ou 20 minutes** : levierconseil.ch propose 20 minutes, la page 15 : aligner.
4. **« Accompagne déjà des associations »** sur levierconseil.ch : à confirmer ou retirer.
5. **Chiffres Loterie Romande** : ne pas afficher le total interne (découpage approximatif) ; chiffre officiel 2025 : CHF 252 millions, près de 5'000 projets.

## Ma recommandation d'ordre
1. A1 à A5 + B1 (une journée) : Appui devient fiable et sûr.
2. C1 et C3 (une demi-journée) : de quoi convaincre au premier rendez-vous.
3. B5 + B4 avec Qwen (deux jours, une fois Infomaniak branché).
4. D1 + B2 + B3, puis C2.
