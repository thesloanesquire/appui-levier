#!/usr/bin/env python3
"""Génère la page publique en français, allemand et anglais à partir de landing/src/page.html.
Les textes sont ci-dessous ; modifier une phrase ici, puis relancer :  python3 scripts/construire_landing.py
Sorties : landing/index.html (FR), landing/de/index.html, landing/en/index.html."""
import json, urllib.parse
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
TPL = (RACINE / "landing/src/page.html").read_text()
EMAIL = "levier.conseil@gmail.com"

def mailto(sujet, corps):
    return "mailto:" + EMAIL + "?subject=" + urllib.parse.quote(sujet) + "&amp;body=" + urllib.parse.quote(corps)

T = {}
T["fr"] = dict(
 meta_title="Levier · Trouver les fondations qui financeront votre projet",
 meta_desc="Des semaines de demandes de fonds, souvent sans réponse ? Levier cible les fondations suisses dont le but correspond à votre projet et écrit à chacune. Honoraires fixes.",
 nav_label="Sections", nav_methode="Méthode", nav_offre="Offre", nav_faq="Questions",
 cta_short="15 minutes", cta="Réserver 15 minutes", cta2="Tester avec mon projet",
 h1="Des semaines de demandes de fonds. Et souvent, aucune réponse.",
 lead="Levier cible pour vous les fondations suisses dont le but correspond vraiment à votre projet, et écrit à chacune une lettre sur mesure. Vous gagnez des semaines, et vos demandes sont lues.",
 check1="Honoraires fixes, jamais de pourcentage", check2="Vous signez : la demande reste la vôtre", check3="Lettres en français, allemand et anglais",
 demo_match="Correspond · 92", demo_fond="Fondation vaudoise", demo_why="Enfance et canton de Vaud · accepte les demandes",
 demo_letter="Lettre sur mesure", demo_ready="Prête à signer", demo_deadline="<b>Dépôt avant le 31.01</b> · séance de mars",
 stat1="de travail en moyenne derrière une demande acceptée", stat2="des refus arrivent sans aucune explication", stat3="séances de décision par an dans la plupart des fondations",
 stat_src="Sources : Grantee Review Report (CEPS, Université de Bâle, et SwissFoundations, données 2019) ; pratiques publiées par les fondations.",
 pains_t="Vous vous reconnaissez ?",
 pain1_say="« Nous n'avons pas le temps de faire des demandes. »", pain1_real="Chaque dossier prend des dizaines d'heures, souvent le soir, sur du temps bénévole. Pendant ce temps, le projet attend.",
 pain2_say="« Nous ne savons pas à quelles fondations écrire. »", pain2_real="Il existe plus de 13'000 fondations d'utilité publique en Suisse. La plupart ne financeront jamais votre projet, et ce n'est écrit nulle part.",
 pain3_say="« Les refus arrivent sans explication. »", pain3_real="Hors but, hors délai, lettre trop générale : les fondations écartent ces dossiers sans les lire en détail. On recommence alors, sans savoir pourquoi.",
 cause="Le problème n'est pas votre projet. Ce sont des demandes envoyées aux mauvaises fondations, avec des lettres trop générales, trop tard.",
 urg_t="Une séance manquée, c'est six mois de retard.",
 urg_lead="La plupart des fondations décident deux à quatre fois par an et demandent votre dossier environ quatre mois avant le début du projet. Un projet déjà commencé n'est en général plus financé.",
 calc_label="Quand votre projet commence-t-il ?", calc_hint="Indiquez une date : nous calculons quand déposer.",
 calc_note="Ordre de grandeur tiré des règles publiées par plusieurs fondations romandes (environ 4 mois avant le début, 5 pour certaines grandes fondations). Chaque fondation a ses dates : nous les vérifions une par une.",
 met_t="Comment Levier s'en charge",
 met_lead="Des étapes et des livrables fixés dès le premier jour. Vous savez ce que vous recevez, et quand.",
 s1_when="15 minutes", s1_t="Un premier échange", s1_p="Vous présentez le projet et le montant manquant. Nous vous disons franchement si des fondations ont des chances de le financer.",
 s2_when="2 semaines", s2_t="La carte de vos financeurs", s2_p="20 à 30 fondations retenues parmi plus de 14'000 : pour chacune, la phrase de son but qui rejoint votre projet, son site, ses délais et les pièces demandées.",
 s3_when="4 semaines", s3_t="Une lettre par fondation", s3_p="Écrite pour ce que cette fondation finance, en français, en allemand ou en anglais. Vous relisez, vous signez, vous envoyez.",
 s4_when="6 mois", s4_t="Le calendrier tenu", s4_p="Dépôts dans les délais, relances au bon moment, réponses notées, rapport chaque mois. Après un accord, les rapports à rendre à la fondation.",
 ess_t="Testez avec votre projet", ess_lead="Décrivez votre projet en une phrase. Voici des fondations romandes dont le but statutaire y répond.",
 ess_label="Votre projet en une phrase", ess_default="Des ateliers de lecture pour enfants et familles migrantes à Lausanne", ess_btn="Chercher",
 ess_note="2'000 fondations romandes au but donateur, tirées du registre du commerce. Noms masqués : la liste complète, vérifiée, se prépare avec vous. Rien de ce que vous tapez ne quitte votre navigateur.",
 off_t="Une offre claire, des honoraires fixes",
 off_lead="Devis écrit avant de commencer. Jamais de pourcentage sur les fonds obtenus. Montants indicatifs.",
 p1_t="Diagnostic", p1_price="CHF 750", p1_p="Pour savoir si et où chercher.", p1_list="<li>5 fondations prioritaires vérifiées</li><li>Repères Loterie Romande</li><li>Calendrier de dépôt</li>",
 p2_tag="Le plus choisi", p2_t="Campagne", p2_price="CHF 3'500", p2_p="Pour financer un projet précis.", p2_list="<li>Carte de 20 à 30 fondations</li><li>10 lettres sur mesure</li><li>Calendrier et relances sur 6 mois</li><li>Rapport mensuel</li>",
 p3_t="Accompagnement", p3_price="CHF 650 / mois", p3_p="Pour les organisations qui financent plusieurs projets.", p3_list="<li>Campagnes en continu</li><li>Rapports aux fondations après accord</li><li>Veille des nouvelles fondations</li>",
 g_t="Notre garantie", g_p="Si nous ne trouvons pas au moins 15 fondations dont le but correspond à votre projet, le Diagnostic vous est offert. Personne ne peut garantir la décision d'une fondation ; nous garantissons le travail.",
 eth_t="Pas de commission. La demande reste la vôtre.",
 eth_p="Les fondations rejettent les intermédiaires payés au pourcentage, et les règles éthiques de Swissfundraising l'excluent. Levier travaille à honoraires fixes ; c'est votre association qui signe et qui envoie chaque demande.",
 qui_t="Qui est derrière Levier",
 qui_p="Alexandre Cazes, ancien conseiller scientifique de la RTS et diplômé de l'IHEID. Pour financer son propre master, il a sollicité plus de cent fondations romandes et alémaniques. Il connaît ce qu'elles lisent, et ce qu'elles écartent.",
 qui_f1="obtenus auprès de fondations pour deux masters", qui_f2="fondations sollicitées pour son propre financement", qui_f3="lettres rédigées dans les trois langues",
 faq_t="Questions fréquentes",
 faq=[("Garantissez-vous un financement ?", "Non, personne ne le peut : la décision appartient au conseil de chaque fondation. Nous garantissons le travail : des fondations dont le but correspond, une lettre écrite pour chacune, des délais tenus."),
      ("Pourquoi pas un pourcentage des fonds obtenus ?", "Parce que les fondations refusent de financer des commissions et que les règles éthiques de Swissfundraising l'excluent. Avec des honoraires fixes, vous savez ce que vous payez."),
      ("Les fondations n'aiment-elles pas les agences ?", "Elles n'aiment pas les commissions et les lettres types. Ici, aucune commission, une lettre par fondation, signée et envoyée par votre association."),
      ("Utilisez-vous l'intelligence artificielle ?", "Pour chercher et vérifier : lire les buts de milliers de fondations, repérer leurs délais. Chaque lettre est relue, ajustée et validée par un humain, puis par vous."),
      ("Que devez-vous fournir ?", "Le budget du projet, vos statuts et derniers comptes, une présentation de l'association. Nous vous disons dès le départ quelles pièces chaque fondation exige."),
      ("Combien de temps avant une réponse ?", "Trois à six mois en général, selon les séances des fondations. D'où l'intérêt de commencer au moins six mois avant le début du projet.")],
 fin_t="Parlons de votre projet.", fin_p="15 minutes en visio, gratuites. Ayez sous la main le budget du projet, le montant manquant et la date de début.",
 foot_tag="Recherche de fonds auprès des fondations suisses.", foot_addr="[Adresse postale à compléter]",
 foot_privacy="Cette page n'utilise ni cookie ni outil de statistiques. L'outil de test fonctionne dans votre navigateur : rien n'est envoyé. Si vous nous écrivez, vos coordonnées servent seulement à vous répondre.",
 foot_data="Données : registre du commerce (OFJ, données ouvertes via LINDAS), autorités de surveillance des fondations, Loterie Romande.",
 mail_subject="15 minutes avec Levier", mail_body="Bonjour,\n\nNotre projet en deux phrases :\n\nMontant recherché :\nDébut prévu :\n\nMerci !",
 js=dict(depose="Déposez au plus tard le", grand="Pour les grandes fondations, plutôt le", reste="Il vous reste {n} semaines pour préparer vos dossiers.", tard="C'est déjà serré : parlons-en rapidement, certaines fondations décident plus vite.", rien="Aucune phrase de but ne reprend ces mots. Essayez avec le public et le lieu : enfants, aînés, Lausanne.", verif="À vérifier", fond="Fondation", fmt="{f} {a}", adj=dict(VD="vaudoise",GE="genevoise",NE="neuchâteloise",FR="fribourgeoise",VS="valaisanne",JU="jurassienne")),
)
T["de"] = dict(
 meta_title="Levier · Die Stiftungen finden, die Ihr Projekt fördern",
 meta_desc="Wochen für Fördergesuche, oft ohne Antwort? Levier findet die Schweizer Stiftungen, deren Zweck zu Ihrem Projekt passt, und schreibt jeder einzeln. Festes Honorar.",
 nav_label="Abschnitte", nav_methode="Vorgehen", nav_offre="Angebot", nav_faq="Fragen",
 cta_short="15 Minuten", cta="15 Minuten vereinbaren", cta2="Mit meinem Projekt testen",
 h1="Wochen für Fördergesuche. Und oft keine Antwort.",
 lead="Levier findet für Sie die Schweizer Stiftungen, deren Zweck wirklich zu Ihrem Projekt passt, und schreibt jeder einen eigenen Brief. Sie gewinnen Wochen, und Ihre Gesuche werden gelesen.",
 check1="Festes Honorar, nie ein Prozentsatz", check2="Sie unterschreiben: Das Gesuch bleibt Ihres", check3="Briefe auf Deutsch, Französisch und Englisch",
 demo_match="Passt · 92", demo_fond="Waadtländer Stiftung", demo_why="Kinder und Kanton Waadt · nimmt Gesuche an",
 demo_letter="Massgeschneiderter Brief", demo_ready="Bereit zur Unterschrift", demo_deadline="<b>Eingabe bis 31.01.</b> · Sitzung im März",
 stat1="Arbeit stecken im Schnitt hinter einem bewilligten Gesuch", stat2="der Absagen kommen ohne jede Begründung", stat3="Entscheidsitzungen pro Jahr bei den meisten Stiftungen",
 stat_src="Quellen: Grantee Review Report (CEPS, Universität Basel, und SwissFoundations, Daten 2019); veröffentlichte Praxis der Stiftungen.",
 pains_t="Kommt Ihnen das bekannt vor?",
 pain1_say="«Wir haben keine Zeit für Gesuche.»", pain1_real="Jedes Dossier kostet Dutzende Stunden, oft abends und ehrenamtlich. Das Projekt wartet so lange.",
 pain2_say="«Wir wissen nicht, welchen Stiftungen wir schreiben sollen.»", pain2_real="Die Schweiz zählt über 13'000 gemeinnützige Stiftungen. Die meisten werden Ihr Projekt nie fördern, und das steht nirgends.",
 pain3_say="«Die Absagen kommen ohne Begründung.»", pain3_real="Ausserhalb des Zwecks, zu spät, zu allgemein: Solche Gesuche werden aussortiert. Man beginnt von vorn, ohne zu wissen, warum.",
 cause="Das Problem ist nicht Ihr Projekt. Es sind Gesuche an die falschen Stiftungen, mit zu allgemeinen Briefen, zu spät.",
 urg_t="Eine verpasste Sitzung bedeutet sechs Monate Verzug.",
 urg_lead="Die meisten Stiftungen entscheiden zwei- bis viermal pro Jahr und verlangen Ihr Dossier rund vier Monate vor Projektbeginn. Ein bereits begonnenes Projekt wird in der Regel nicht mehr gefördert.",
 calc_label="Wann beginnt Ihr Projekt?", calc_hint="Geben Sie ein Datum ein: Wir berechnen, wann Sie einreichen sollten.",
 calc_note="Richtwert aus den veröffentlichten Regeln mehrerer Stiftungen (rund 4 Monate vor Beginn, bei einigen grossen Stiftungen 5). Jede Stiftung hat eigene Termine: Wir prüfen sie einzeln.",
 met_t="So übernimmt Levier",
 met_lead="Schritte und Ergebnisse stehen ab dem ersten Tag fest. Sie wissen, was Sie erhalten, und wann.",
 s1_when="15 Minuten", s1_t="Ein erstes Gespräch", s1_p="Sie stellen das Projekt und den fehlenden Betrag vor. Wir sagen Ihnen offen, ob Stiftungen es fördern könnten.",
 s2_when="2 Wochen", s2_t="Ihre Geldgeberkarte", s2_p="20 bis 30 ausgewählte Stiftungen aus über 14'000: für jede der Satz ihres Zwecks, der zu Ihrem Projekt passt, ihre Website, Fristen und verlangten Unterlagen.",
 s3_when="4 Wochen", s3_t="Ein Brief pro Stiftung", s3_p="Geschrieben für das, was diese Stiftung fördert, auf Deutsch, Französisch oder Englisch. Sie lesen, unterschreiben und senden.",
 s4_when="6 Monate", s4_t="Der Zeitplan, eingehalten", s4_p="Fristgerechte Eingaben, Nachfassen zur richtigen Zeit, Antworten erfasst, monatlicher Bericht. Nach einer Zusage die Berichte an die Stiftung.",
 ess_t="Testen Sie mit Ihrem Projekt", ess_lead="Beschreiben Sie Ihr Projekt in einem Satz. Hier sind Westschweizer Stiftungen, deren Zweck dazu passt.",
 ess_label="Ihr Projekt in einem Satz", ess_default="Leseförderung für Kinder und Migrantenfamilien in Lausanne", ess_btn="Suchen",
 ess_note="2'000 Westschweizer Förderstiftungen aus dem Handelsregister (Zwecktexte meist auf Französisch). Namen ausgeblendet. Ihre Eingabe verlässt Ihren Browser nicht.",
 off_t="Ein klares Angebot, feste Honorare",
 off_lead="Schriftliche Offerte vor Beginn. Nie ein Prozentsatz der erhaltenen Mittel. Richtpreise.",
 p1_t="Diagnose", p1_price="CHF 750", p1_p="Um zu wissen, ob und wo sich die Suche lohnt.", p1_list="<li>5 geprüfte Prioritätsstiftungen</li><li>Hinweise Loterie Romande</li><li>Eingabekalender</li>",
 p2_tag="Am häufigsten gewählt", p2_t="Kampagne", p2_price="CHF 3'500", p2_p="Um ein bestimmtes Projekt zu finanzieren.", p2_list="<li>Karte mit 20 bis 30 Stiftungen</li><li>10 massgeschneiderte Briefe</li><li>Zeitplan und Nachfassen über 6 Monate</li><li>Monatlicher Bericht</li>",
 p3_t="Begleitung", p3_price="CHF 650 / Monat", p3_p="Für Organisationen mit mehreren Projekten.", p3_list="<li>Laufende Kampagnen</li><li>Berichte an Stiftungen nach Zusage</li><li>Beobachtung neuer Stiftungen</li>",
 g_t="Unsere Garantie", g_p="Finden wir nicht mindestens 15 Stiftungen, deren Zweck zu Ihrem Projekt passt, ist die Diagnose kostenlos. Niemand kann den Entscheid einer Stiftung garantieren; wir garantieren die Arbeit.",
 eth_t="Keine Provision. Das Gesuch bleibt Ihres.",
 eth_p="Stiftungen lehnen prozentual bezahlte Vermittler ab, und die ethischen Grundsätze von Swissfundraising schliessen sie aus. Levier arbeitet zu festen Honoraren; Ihre Organisation unterschreibt und versendet jedes Gesuch.",
 qui_t="Wer hinter Levier steht",
 qui_p="Alexandre Cazes, ehemaliger wissenschaftlicher Berater der RTS und Absolvent des IHEID. Für sein eigenes Masterstudium hat er über hundert Stiftungen in der Romandie und der Deutschschweiz angeschrieben. Er weiss, was sie lesen und was sie aussortieren.",
 qui_f1="von Stiftungen für zwei Masterstudien erhalten", qui_f2="Stiftungen für die eigene Finanzierung angeschrieben", qui_f3="Briefe in allen drei Sprachen",
 faq_t="Häufige Fragen",
 faq=[("Garantieren Sie eine Finanzierung?", "Nein, das kann niemand: Der Entscheid liegt beim Stiftungsrat. Wir garantieren die Arbeit: passende Stiftungen, ein eigener Brief für jede, eingehaltene Fristen."),
      ("Warum kein Prozentsatz der erhaltenen Mittel?", "Weil Stiftungen keine Provisionen finanzieren und die ethischen Grundsätze von Swissfundraising sie ausschliessen. Mit festen Honoraren wissen Sie, was Sie bezahlen."),
      ("Mögen Stiftungen keine Agenturen?", "Sie mögen keine Provisionen und keine Serienbriefe. Hier: keine Provision, ein Brief pro Stiftung, unterschrieben und versendet von Ihrer Organisation."),
      ("Nutzen Sie künstliche Intelligenz?", "Zum Suchen und Prüfen: Zwecktexte von Tausenden Stiftungen lesen, Fristen erkennen. Jeder Brief wird von einem Menschen geprüft und angepasst, dann von Ihnen freigegeben."),
      ("Was müssen Sie liefern?", "Projektbudget, Statuten und letzte Jahresrechnung, eine Vorstellung Ihrer Organisation. Wir sagen Ihnen von Anfang an, welche Unterlagen jede Stiftung verlangt."),
      ("Wie lange dauert es bis zur Antwort?", "In der Regel drei bis sechs Monate, je nach Sitzungen der Stiftungen. Deshalb mindestens sechs Monate vor Projektbeginn starten.")],
 fin_t="Sprechen wir über Ihr Projekt.", fin_p="15 Minuten per Video, kostenlos. Halten Sie Projektbudget, fehlenden Betrag und Startdatum bereit.",
 foot_tag="Mittelbeschaffung bei Schweizer Stiftungen.", foot_addr="[Postadresse zu ergänzen]",
 foot_privacy="Diese Seite verwendet weder Cookies noch Statistik-Tools. Das Testwerkzeug läuft in Ihrem Browser: Es wird nichts gesendet. Wenn Sie uns schreiben, nutzen wir Ihre Angaben nur für die Antwort.",
 foot_data="Daten: Handelsregister (BJ, offene Daten über LINDAS), Stiftungsaufsichten, Loterie Romande.",
 mail_subject="15 Minuten mit Levier", mail_body="Guten Tag\n\nUnser Projekt in zwei Sätzen:\n\nGesuchter Betrag:\nGeplanter Beginn:\n\nDanke!",
 js=dict(depose="Spätestens einreichen am", grand="Bei grossen Stiftungen eher am", reste="Sie haben noch {n} Wochen für Ihre Dossiers.", tard="Das wird knapp: Sprechen wir rasch darüber, einige Stiftungen entscheiden schneller.", rien="Kein Zwecktext enthält diese Wörter. Versuchen Sie es mit Zielgruppe und Ort.", verif="Zu prüfen", fond="Stiftung", fmt="{f}, {a}", adj=dict(VD="Waadt",GE="Genf",NE="Neuenburg",FR="Freiburg",VS="Wallis",JU="Jura")),
)
T["en"] = dict(
 meta_title="Levier · Find the Swiss foundations that will fund your project",
 meta_desc="Weeks spent on funding applications, often with no reply? Levier targets the Swiss foundations whose purpose fits your project and writes to each one. Fixed fees.",
 nav_label="Sections", nav_methode="Method", nav_offre="Pricing", nav_faq="Questions",
 cta_short="15 minutes", cta="Book 15 minutes", cta2="Try it with my project",
 h1="Weeks spent on funding applications. And often, no reply.",
 lead="Levier finds the Swiss foundations whose purpose truly fits your project, and writes each one a tailored letter. You save weeks, and your applications get read.",
 check1="Fixed fees, never a percentage", check2="You sign: the application stays yours", check3="Letters in English, French and German",
 demo_match="Fits · 92", demo_fond="Vaud foundation", demo_why="Children and canton of Vaud · accepts applications",
 demo_letter="Tailored letter", demo_ready="Ready to sign", demo_deadline="<b>Submit by 31.01</b> · March board meeting",
 stat1="of work on average behind a successful application", stat2="of rejections come with no explanation", stat3="decision meetings a year at most foundations",
 stat_src="Sources: Grantee Review Report (CEPS, University of Basel, and SwissFoundations, 2019 data); practices published by foundations.",
 pains_t="Does this sound familiar?",
 pain1_say="“We don't have time for applications.”", pain1_real="Each application takes dozens of hours, often in the evening on volunteer time. Meanwhile, the project waits.",
 pain2_say="“We don't know which foundations to write to.”", pain2_real="Switzerland has over 13,000 charitable foundations. Most will never fund your project, and that is written nowhere.",
 pain3_say="“Rejections come with no explanation.”", pain3_real="Off-purpose, late, too generic: foundations set these aside. You start again without knowing why.",
 cause="The problem is not your project. It is applications sent to the wrong foundations, with generic letters, too late.",
 urg_t="One missed board meeting means six months of delay.",
 urg_lead="Most foundations decide two to four times a year and want your file about four months before the project starts. A project already under way is usually no longer funded.",
 calc_label="When does your project start?", calc_hint="Enter a date: we work out when to apply.",
 calc_note="Rule of thumb from rules published by several foundations (about 4 months before the start, 5 for some large foundations). Each foundation has its own dates: we check them one by one.",
 met_t="How Levier takes care of it",
 met_lead="Steps and deliverables fixed from day one. You know what you get, and when.",
 s1_when="15 minutes", s1_t="A first conversation", s1_p="You present the project and the missing amount. We tell you frankly whether foundations are likely to fund it.",
 s2_when="2 weeks", s2_t="Your funder map", s2_p="20 to 30 foundations selected from over 14,000: for each, the sentence of its purpose that matches your project, its website, deadlines and required documents.",
 s3_when="4 weeks", s3_t="One letter per foundation", s3_p="Written for what that foundation funds, in English, French or German. You read, sign and send.",
 s4_when="6 months", s4_t="The calendar, kept", s4_p="On-time submissions, timely follow-ups, replies logged, a monthly report. After a grant, the reports owed to the foundation.",
 ess_t="Try it with your project", ess_lead="Describe your project in one sentence. Here are French-speaking Swiss foundations whose purpose matches it.",
 ess_label="Your project in one sentence", ess_default="Reading workshops for children and migrant families in Lausanne", ess_btn="Search",
 ess_note="2,000 grant-making foundations in French-speaking Switzerland, from the commercial register (purposes mostly in French). Names hidden. Nothing you type leaves your browser.",
 off_t="A clear offer, fixed fees",
 off_lead="Written quote before we start. Never a percentage of funds raised. Indicative prices.",
 p1_t="Diagnosis", p1_price="CHF 750", p1_p="To know whether and where to look.", p1_list="<li>5 verified priority foundations</li><li>Loterie Romande benchmarks</li><li>Submission calendar</li>",
 p2_tag="Most chosen", p2_t="Campaign", p2_price="CHF 3,500", p2_p="To fund a specific project.", p2_list="<li>Map of 20 to 30 foundations</li><li>10 tailored letters</li><li>Calendar and follow-ups over 6 months</li><li>Monthly report</li>",
 p3_t="Retainer", p3_price="CHF 650 / month", p3_p="For organisations funding several projects.", p3_list="<li>Ongoing campaigns</li><li>Reports to foundations after a grant</li><li>Watch for new foundations</li>",
 g_t="Our guarantee", g_p="If we cannot find at least 15 foundations whose purpose fits your project, the Diagnosis is free. No one can guarantee a foundation's decision; we guarantee the work.",
 eth_t="No commission. The application stays yours.",
 eth_p="Foundations reject intermediaries paid on commission, and Swissfundraising's ethical principles rule it out. Levier works for fixed fees; your organisation signs and sends every application.",
 qui_t="Who is behind Levier",
 qui_p="Alexandre Cazes, former science adviser at Swiss public broadcaster RTS and graduate of the Geneva Graduate Institute (IHEID). To fund his own master's degree, he applied to over a hundred foundations across Switzerland. He knows what they read, and what they set aside.",
 qui_f1="raised from foundations for two master's degrees", qui_f2="foundations approached for his own funding", qui_f3="letters written in all three languages",
 faq_t="Frequently asked questions",
 faq=[("Do you guarantee funding?", "No one can: the decision belongs to each foundation's board. We guarantee the work: foundations whose purpose fits, a letter written for each, deadlines kept."),
      ("Why not a percentage of funds raised?", "Because foundations refuse to fund commissions and Swissfundraising's ethical principles rule them out. With fixed fees, you know what you pay."),
      ("Don't foundations dislike agencies?", "They dislike commissions and form letters. Here: no commission, one letter per foundation, signed and sent by your organisation."),
      ("Do you use artificial intelligence?", "To search and check: reading the purposes of thousands of foundations, spotting deadlines. Every letter is reviewed and adjusted by a person, then approved by you."),
      ("What do you need from us?", "The project budget, your statutes and latest accounts, a short presentation of your organisation. We tell you from the start which documents each foundation requires."),
      ("How long until a reply?", "Usually three to six months, depending on board meetings. Hence starting at least six months before the project begins.")],
 fin_t="Let's talk about your project.", fin_p="15 minutes by video, free of charge. Have the project budget, the missing amount and the start date to hand.",
 foot_tag="Fundraising from Swiss foundations.", foot_addr="[Postal address to be added]",
 foot_privacy="This page uses no cookies and no analytics. The test tool runs in your browser: nothing is sent. If you write to us, your details are used only to reply.",
 foot_data="Data: commercial register (Federal Office of Justice, open data via LINDAS), foundation supervisory authorities, Loterie Romande.",
 mail_subject="15 minutes with Levier", mail_body="Hello,\n\nOur project in two sentences:\n\nAmount sought:\nPlanned start:\n\nThank you!",
 js=dict(depose="Submit by", grand="For large foundations, rather by", reste="You have {n} weeks left to prepare your files.", tard="That is already tight: let's talk soon, some foundations decide faster.", rien="No purpose sentence contains these words. Try the audience and the place.", verif="To check", fond="Foundation", fmt="{f}, {a}", adj=dict(VD="Vaud",GE="Geneva",NE="Neuchâtel",FR="Fribourg",VS="Valais",JU="Jura")),
)

def langs(cur, root):
    out = []
    for code, path in (("fr", root), ("de", root + "de/"), ("en", root + "en/")):
        out.append(f'<b aria-current="page">{code.upper()}</b>' if code == cur else f'<a href="{path}" hreflang="{code}">{code.upper()}</a>')
    return " ".join(out)

for code, t in T.items():
    root = "" if code == "fr" else "../"
    v = dict(t)
    v.update(lang=code, root=root, home=root or "./", langs=langs(code, root), mailto=mailto(t["mail_subject"], t["mail_body"]),
             faq="".join(f'<details class="qa reveal"><summary>{q}</summary><p>{a}</p></details>' for q, a in t["faq"]),
             js_t=json.dumps(t["js"], ensure_ascii=False))
    html = TPL
    for k, val in v.items():
        if isinstance(val, str): html = html.replace("{{" + k + "}}", val)
    assert "{{" not in html, [x for x in html.split("{{")[1:3]]
    out = RACINE / "landing" / ("index.html" if code == "fr" else f"{code}/index.html")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html)
    print("écrit", out.relative_to(RACINE))
