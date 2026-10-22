---
version: 1
slug: "src-index-html"
primary_target: "src/index.html"
related_targets: []
---

# Surface : application d'agence Levier (src/index.html)

Mode : Operate. Utilisateurs : conseiller·ère·s de l'agence (quotidien, ordinateur) ; client en lecture (#/portail, souvent mobile).
Tâche : piloter plusieurs campagnes de recherche de fonds ; matcher client ↔ fondations (données Zefix réelles) ; rédiger une lettre sur mesure par fondation ; suivre échéances, validations, relances, réponses.
Contraintes : HTML/CSS/JS statique servi en local (python -m http.server ; connexion requise pour les polices Google, auto-hébergement à faire avant usage hors ligne), données de démonstration marquées comme telles, aucun envoi automatique.
Choix de composition : Tim a délégué le choix le 21.10.2026 (« choisis et intègre les bonnes idées ») et demande le standard des meilleures interfaces du domaine (Linear, Attio, Notion) avec l'esthétique Levier.

## Direction contract

THESIS : Un poste de travail d'agence au niveau de Linear/Attio, où chaque fondation proposée cite son propre but social et chaque lettre naît du croisement client × fondation. Refuse le tableau de bord à tuiles KPI et l'annuaire en libre-service.

OWN-WORLD : (révisé le 21.10.2026 après retour de Tim : « vieillot », logo rejeté.) Interface contemporaine claire au niveau Linear/Attio : fond #FAF9F7, barre latérale #F3F1ED, surfaces blanches, filets #E9E5DE, rayons 8-14px, ombres douces. Marque Levier tenue par l'encre marine #1F2A44, la terre cuite #B8613F (action principale, urgence, score) et le point final. Hanken Grotesk partout (700-800 pour titres serrés) ; Spectral réservé à la lettre et aux citations du but statutaire. Logo B choisi par Tim : carré marine, L blanc, point terre cuite ; mot-symbole « levier. » en minuscules. Mode sombre marine.

STORY : Le conseiller voit d'abord ce qui part bientôt et ce qu'il doit faire aujourd'hui, ouvre un client, voit ses fondations classées et justifiées, génère la lettre, l'envoie au client pour validation ; le client valide depuis son portail.

FIRST VIEWPORT : Barre latérale claire à gauche (logo B, recherche ⌘K, Aperçu, Demandes, Clients, Fondations, Nouveau client ; « Lettres » devient « Demandes » car chaque lettre appartient à une demande, décision de construction du 21.10.2026). Centre : titre « Aperçu » + pastilles de synthèse (urgence en terre cuite) ; colonne « À faire » (gauche, 380px, actions triées par urgence sur 7 jours) et tableau « Dépôts à venir » (droite) trié par échéance, lignes urgentes marquées terre cuite ; sous le tableau, campagnes avec obtenu/objectif. Action principale « Nouveau client » en haut à droite.

FORM : Fusion de l'échéancier (rang 3, tirage initial), de la fiche client CRM à onglets, de l'aperçu « Aujourd'hui » et du triple panneau fondations/détail/lettre ; le matching par URL devient le flux « Nouveau client ». Signature : le but social cité entre crochets en marge, et les statuts qui se retournent lettre par lettre sur place quand ils changent (tableau des départs). seed:159da3fb1eccb9d4

FINISH : unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
