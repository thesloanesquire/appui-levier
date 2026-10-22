/* Levier · moteur local : profil client, matching expliqué, lettres sur mesure.
   Version prototype sans serveur : règles + pondération lexicale (IDF) sur le but social Zefix.
   Le moteur de production (embeddings + re-ranking LLM Infomaniak) est décrit dans docs/. */
(function () {
  "use strict";

  const CANTONS = { VD: "Vaud", GE: "Genève", NE: "Neuchâtel", FR: "Fribourg", VS: "Valais", JU: "Jura", BE: "Berne",
    ZH: "Zurich", BS: "Bâle-Ville", BL: "Bâle-Campagne", TI: "Tessin", LU: "Lucerne", AG: "Argovie", SG: "Saint-Gall",
    GR: "Grisons", ZG: "Zoug", SZ: "Schwyz", SO: "Soleure", TG: "Thurgovie", GL: "Glaris", SH: "Schaffhouse",
    AR: "Appenzell Rh.-Ext.", AI: "Appenzell Rh.-Int.", NW: "Nidwald", OW: "Obwald", UR: "Uri" };
  const ROMANDS = new Set(["VD", "GE", "NE", "FR", "VS", "JU"]);

  // Taxonomie : libellé, motif de détection, et les « bons mots » par langue.
  const DOMAINES = {
    social_precarite: { label: "Social et précarité", rx: /pauvret|precarit|demunis|social|exclusion|necessiteux|bedurftig|armut|sozial/,
      fr: { cause: "la lutte contre la précarité et l'exclusion", pour: "les personnes les plus fragiles" },
      de: { cause: "die Bekämpfung von Armut und Ausgrenzung", pour: "Menschen in schwierigen Lebenslagen" },
      en: { cause: "the fight against poverty and exclusion", pour: "people in vulnerable situations" } },
    enfance_jeunesse: { label: "Enfance et jeunesse", rx: /enfan|jeune|adolesc|kinder|jugend|eleves|ecole|scolaire/,
      fr: { cause: "l'épanouissement et la sécurité des enfants et des jeunes", pour: "les enfants et les jeunes" },
      de: { cause: "das Wohl und die Entwicklung von Kindern und Jugendlichen", pour: "Kinder und Jugendliche" },
      en: { cause: "the wellbeing and development of children and young people", pour: "children and young people" } },
    personnes_agees: { label: "Personnes âgées", rx: /agees|seniors?|vieillesse|aines|alter[sn]/,
      fr: { cause: "la qualité de vie et le lien social des personnes âgées", pour: "les personnes âgées" },
      de: { cause: "die Lebensqualität älterer Menschen", pour: "ältere Menschen" },
      en: { cause: "the quality of life of older people", pour: "older people" } },
    handicap: { label: "Handicap", rx: /handicap|invalid|behinder/,
      fr: { cause: "l'autonomie et l'inclusion des personnes en situation de handicap", pour: "les personnes en situation de handicap" },
      de: { cause: "die Selbstständigkeit und Inklusion von Menschen mit Behinderung", pour: "Menschen mit Behinderung" },
      en: { cause: "the independence and inclusion of people with disabilities", pour: "people with disabilities" } },
    sante_medical: { label: "Santé", rx: /sante|medic|maladi|cancer|soins|patient|gesundheit|krank|medizin|prevention/,
      fr: { cause: "la santé et la prévention", pour: "les patients et leurs proches" },
      de: { cause: "Gesundheit und Prävention", pour: "Patientinnen, Patienten und Angehörige" },
      en: { cause: "health and prevention", pour: "patients and their families" } },
    recherche_science: { label: "Recherche et science", rx: /recherche|scientifi|forschung|wissenschaft|universit/,
      fr: { cause: "l'avancement de la recherche scientifique", pour: "la communauté scientifique" },
      de: { cause: "den wissenschaftlichen Fortschritt", pour: "die Forschung" },
      en: { cause: "the advancement of scientific research", pour: "the research community" } },
    formation_education: { label: "Formation", rx: /formation|education|enseignement|etudes|apprenti|bildung|ausbildung|bourse|stipend|master|doctorat/,
      fr: { cause: "l'accès à la formation et la réussite des études", pour: "les étudiantes et étudiants" },
      de: { cause: "den Zugang zu Bildung und den Studienerfolg", pour: "Studierende" },
      en: { cause: "access to education and academic success", pour: "students" } },
    culture_arts: { label: "Culture et arts", rx: /cultur|artisti|\barts?\b|musique|theatre|litterat|cinema|danse|kultur|kunst|musik|spectacle/,
      fr: { cause: "la création artistique et l'accès à la culture", pour: "le public et les artistes" },
      de: { cause: "das künstlerische Schaffen und den Zugang zur Kultur", pour: "Publikum und Kunstschaffende" },
      en: { cause: "artistic creation and access to culture", pour: "audiences and artists" } },
    patrimoine: { label: "Patrimoine", rx: /patrimoine|monument|histor|musee|denkmal|erbe/,
      fr: { cause: "la sauvegarde et la transmission du patrimoine", pour: "les générations futures" },
      de: { cause: "die Erhaltung und Vermittlung des Kulturerbes", pour: "künftige Generationen" },
      en: { cause: "preserving and passing on heritage", pour: "future generations" } },
    environnement_climat: { label: "Environnement et climat", rx: /environnement|nature|climat|biodiversit|ecolog|durable|umwelt|natur|klima|mobilite douce|eau potable/,
      fr: { cause: "la protection de l'environnement et la transition écologique", pour: "les générations futures" },
      de: { cause: "den Umweltschutz und den ökologischen Wandel", pour: "künftige Generationen" },
      en: { cause: "environmental protection and the ecological transition", pour: "future generations" } },
    animaux: { label: "Animaux", rx: /animaux|animal|faune|\btier/,
      fr: { cause: "la protection des animaux", pour: "les animaux" }, de: { cause: "den Tierschutz", pour: "Tiere" }, en: { cause: "animal welfare", pour: "animals" } },
    sport: { label: "Sport", rx: /\bsport|basket|football|athlet/,
      fr: { cause: "le sport comme école de vie et de cohésion", pour: "les sportives et sportifs" },
      de: { cause: "den Sport als Schule fürs Leben", pour: "Sportlerinnen und Sportler" },
      en: { cause: "sport as a school of life and cohesion", pour: "athletes" } },
    cooperation_internationale: { label: "Coopération internationale", rx: /pays en developpement|cooperation|humanitaire|tiers.monde|afrique|internation|entwicklungs/,
      fr: { cause: "le développement et la coopération internationale", pour: "les populations des pays du Sud" },
      de: { cause: "die internationale Zusammenarbeit", pour: "Menschen in Ländern des Südens" },
      en: { cause: "international development and cooperation", pour: "communities in the Global South" } },
    migration_integration: { label: "Migration et intégration", rx: /migra|refugi|integration|asile|fluecht|fluchtling/,
      fr: { cause: "l'accueil et l'intégration des personnes migrantes", pour: "les personnes migrantes" },
      de: { cause: "die Integration von Migrantinnen und Migranten", pour: "Migrantinnen und Migranten" },
      en: { cause: "the inclusion of migrants and refugees", pour: "migrants and refugees" } },
    religion: { label: "Religion", rx: /eglise|paroiss|religi|chretien|catholi|protestant|kirch|juive|islam/,
      fr: { cause: "la vie spirituelle et communautaire", pour: "la communauté" }, de: { cause: "das kirchliche Leben", pour: "die Gemeinschaft" }, en: { cause: "spiritual and community life", pour: "the community" } },
    innovation_entrepreneuriat: { label: "Innovation et entrepreneuriat", rx: /innovation|entrepren|start.?up|economi|unternehm|technolog/,
      fr: { cause: "l'innovation et l'entrepreneuriat en Suisse", pour: "les jeunes entreprises" },
      de: { cause: "Innovation und Unternehmertum in der Schweiz", pour: "Jungunternehmen" },
      en: { cause: "innovation and entrepreneurship in Switzerland", pour: "young companies" } },
    droits_humains_democratie: { label: "Droits humains et démocratie", rx: /droits? (de l.homme|humains)|democrat|paix|menschenrecht|citoyen|politique/,
      fr: { cause: "les droits humains et la vie démocratique", pour: "les citoyennes et citoyens" },
      de: { cause: "Menschenrechte und Demokratie", pour: "die Bürgerinnen und Bürger" },
      en: { cause: "human rights and democratic life", pour: "citizens" } },
    egalite_genre: { label: "Égalité", rx: /femmes|egalit|genre|frauen|gleichstell/,
      fr: { cause: "l'égalité entre femmes et hommes", pour: "les femmes" }, de: { cause: "die Gleichstellung", pour: "Frauen" }, en: { cause: "gender equality", pour: "women" } },
    agriculture_alimentation: { label: "Agriculture et alimentation", rx: /agricult|alimentation|paysan|landwirt/,
      fr: { cause: "une agriculture et une alimentation durables", pour: "les paysannes et paysans" }, de: { cause: "eine nachhaltige Landwirtschaft", pour: "die Landwirtschaft" }, en: { cause: "sustainable farming and food", pour: "farmers" } },
    medias_journalisme: { label: "Médias", rx: /medias|journalis|presse/,
      fr: { cause: "une information indépendante et de qualité", pour: "le public" }, de: { cause: "unabhängigen Journalismus", pour: "die Öffentlichkeit" }, en: { cause: "independent, high-quality journalism", pour: "the public" } },
  };

  const STOP = new Set(("dans pour avec sans sous entre leur leurs elle elles nous vous ils sont cette celui celle ceux " +
    "plus moins tout tous toute toutes autre autres ainsi aussi notamment fondation fondations stiftung stiftungen " +
    "foundation fonds peut peuvent etre avoir faire celle selon dont lequel laquelle lesquels apres avant depuis " +
    "comme mais donc encore toujours tres bien sein lors afin travers notre votre leur projet projets " +
    "durch eine einer eines einem einen sowie oder auch nicht nach diese dieser dieses werden wird kann soll " +
    "zweck bezweckt insbesondere uber unter fuer from with that this which their have been will also " +
    "suisse schweiz canton kanton personnes activites activite domaine domaines general generale cadre buts " +
    "permettre permettant permet rendre accomplir accomplissement nouvelles nouveaux nouvelle lien liens former " +
    "offrir offrant mener developper developpement soutenir soutien promouvoir encourager favoriser ensemble " +
    "realiser realisation contribuer accompagner accompagnes chaque jour annee annees")
    .split(" "));

  const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const stems = (s) => {
    const out = new Set();
    for (const w of norm(s).split(/[^a-z]+/)) if (w.length >= 5 && !STOP.has(w)) out.add(w.slice(0, 7));
    return out;
  };
  const detectDomains = (text) => {
    const t = norm(text);
    return Object.keys(DOMAINES).filter((k) => DOMAINES[k].rx.test(t));
  };
  const langOf = (s) => {
    const t = " " + norm(s) + " ";
    const c = (re) => (t.match(re) || []).length;
    const de = c(/ (der|die|und|zur|des|von|ist|im|zu|mit|den) /g), fr = c(/ (le|la|les|et|du|de|en|un|une|aux) /g), it = c(/ (il|della|degli|nel|alla|per|che|delle) /g);
    if (de > fr && de > it) return "de"; if (it > fr && it > de) return "it"; return "fr";
  };

  // ---- Index (calculé une fois, à la demande) ----
  let IDX = null;
  function index() {
    if (IDX) return IDX;
    const F = window.FONDATIONS || [];
    const df = new Map(), toks = new Array(F.length);
    F.forEach((f, i) => { const s = stems(f.n + " " + f.p); toks[i] = s; s.forEach((w) => df.set(w, (df.get(w) || 0) + 1)); });
    const byId = new Map(F.map((f, i) => [f.id, i]));
    IDX = { F, df, toks, byId, N: F.length };
    return IDX;
  }
  const idf = (w) => { const { df, N } = index(); return Math.log((N + 1) / ((df.get(w) || 0) + 1)); };
  const fondation = (id) => { const x = index(); const i = x.byId.get(String(id)); return i === undefined ? null : x.F[i]; };

  // ---- Profil client ----
  function profile(c) {
    const text = [c.mission, c.description, c.projet && c.projet.titre, c.projet && c.projet.resume].join(" ");
    const doms = c.domaines && c.domaines.length ? c.domaines : detectDomains(text);
    const kw = [...stems(text)].map((w) => [w, idf(w)]).filter(([, v]) => v > 2.2).sort((a, b) => b[1] - a[1]).slice(0, 45);
    return { domaines: doms, kw: new Map(kw), intl: doms.includes("cooperation_internationale") };
  }

  // ---- Matching expliqué ----
  function score(c, prof, f, i) {
    const x = index();
    const reasons = [], risks = [];
    let s = 0;
    const common = prof.domaines.filter((d) => f.d.includes(d));
    common.forEach((d, k) => { s += k === 0 ? 24 : 12; });
    s = Math.min(s, 44) * (f.d.length > 6 ? 0.72 : f.d.length > 4 ? 0.86 : 1);
    if (common.length) reasons.push("Domaine commun : " + common.map((d) => DOMAINES[d].label.toLowerCase()).join(", "));
    const shared = [];
    let kws = 0;
    x.toks[i].forEach((w) => { if (prof.kw.has(w)) { kws += prof.kw.get(w); shared.push(w); } });
    s += Math.min(28, kws * 2.1);
    if (shared.length) reasons.push("Mots en commun avec la mission : " + shared.slice(0, 4).map((w) => wordFor(w, f.p)).join(", "));
    const cc = c.canton;
    if (f.c === cc) { s += 12; reasons.push("Même canton (" + (CANTONS[cc] || cc) + ")"); }
    else if (f.o === "romandie" && ROMANDS.has(cc)) { s += 8; reasons.push("Portée romande"); }
    else if (f.o === "suisse") { s += 5; reasons.push("Portée nationale"); }
    else if (f.o === "cantonal" && f.c !== cc) { s -= 16; risks.push("Soutient en priorité son propre canton (" + (CANTONS[f.c] || f.c) + ")"); }
    else if (f.o === "international") { if (prof.intl) { s += 6; reasons.push("Portée internationale, comme le projet"); } else { s -= 6; risks.push("Portée internationale : vérifier qu'elle finance aussi en Suisse"); } }
    else if (ROMANDS.has(cc) && !ROMANDS.has(f.c)) { s -= 4; }
    if (!prof.intl && f.o !== "suisse" && f.o !== "romandie" && /\b(pays|monde|haiti|afrique|asie|amerique|etranger|tiers.monde|developpement|ausland|entwicklungslander)\b/.test(norm(f.p))) {
      s -= 10; risks.push("Semble agir surtout hors de Suisse");
    }
    const st = (f.st || []).join(" ");
    if (/Soutien financier/.test(st)) { s += 8; reasons.push("Classée « Soutien financier » par l'autorité de surveillance (As-So)"); }
    if (/Hôpitaux|Logements/.test(st) && !/Soutien financier/.test(st)) { s -= 10; risks.push("Classée « " + (f.st.find((x) => /Hôpitaux|Logements/.test(x)) || "") + " » par l'As-So : gère surtout sa propre institution"); }
    if (f.sv === "ASF" && ROMANDS.has(cc) && !ROMANDS.has(f.c)) reasons.push("Sous surveillance fédérale : portée nationale ou internationale");
    if (c.exclusions && c.exclusions.length && c.exclusions.some((x) => x.length > 3 && norm(f.n + " " + f.p).includes(norm(x)))) { s -= 25; risks.push("Contient un critère que le client veut éviter"); }
    const fiche = (window.LEVIER_ENRICHI || {})[f.id];
    if (fiche && fiche.demande) {
      if (fiche.demande.accepte_demandes === "non") { s -= 35; risks.unshift("Fiche pratique : n'accepte pas de demandes de tiers"); }
      else if (fiche.demande.accepte_demandes === "sur invitation") { s -= 20; risks.unshift("Fiche pratique : sur invitation seulement"); }
      else if (fiche.demande.accepte_demandes === "oui") { s += 6; reasons.push("Fiche pratique : accepte les demandes" + (fiche.demande.delais && fiche.demande.delais.length ? " (délais : " + fiche.demande.delais.join(", ") + ")" : "")); }
    }
    const instit = /\b(ems|etablissement medico|home|residence|foyer|clinique|hopital|creche|internat|wohnheim|altersheim|pflegeheim|spital)\b/.test(norm(f.n));
    if (instit) { s -= 18; risks.push("Le nom évoque une institution (EMS, foyer, clinique) : finance rarement des tiers"); }
    if (f.t === "donatrice_probable" && !instit) { s += 10; reasons.push("Le but décrit un soutien à des tiers"); }
    else if (f.t === "mixte") { s += 4; risks.push("Fondation mixte : elle gère aussi ses propres activités"); }
    else if (f.t === "operationnelle") { s -= 22; risks.push("Fondation opérationnelle : gère sa propre institution, finance rarement des tiers"); }
    else s -= 2;
    const lang = langOf(f.p);
    if (lang !== (c.langue || "fr")) risks.push("But rédigé en " + ({ de: "allemand", it: "italien", fr: "français" })[lang] + " : prévoir une lettre dans cette langue");
    if ((f.p || "").length < 90) risks.push("But très court : peu d'information, vérifier sur son site");
    return { f, score: Math.max(0, Math.min(99, Math.round(s))), reasons, risks, common, lang, quote: quote(f, prof) };
  }
  function wordFor(stem, text) { const m = norm(text).match(new RegExp("\\b" + stem + "[a-z]*")); return m ? m[0] : stem; }
  function quote(f, prof) {
    const parts = (f.p || "").split(/(?<=[.;])\s+/).filter((p) => p.trim().length > 25);
    if (!parts.length) return (f.p || "").slice(0, 220);
    let best = parts[0], bs = -1;
    for (const p of parts) {
      let v = 0; stems(p).forEach((w) => { if (prof.kw.has(w)) v += prof.kw.get(w); });
      prof.domaines.forEach((d) => { if (DOMAINES[d].rx.test(norm(p))) v += 4; });
      if (v > bs) { bs = v; best = p; }
    }
    if (/^(notamment|et |ou |en particulier|ainsi|insbesondere|sowie|dans ce cadre|a cet effet|à cet effet|pour ce faire)/i.test(best.trim())) best = parts[0];
    best = best.trim().replace(/^([a-z]|\d{1,2}|[ivx]{1,4})[).]\s+/i, "").replace(/^(la fondation a pour but|la fondation a pour buts|elle a pour but|die stiftung bezweckt|die stiftung hat zum zweck)\s*(de |d'|:)?\s*/i, "").replace(/[.;:]$/, "");
    if (best.length > 230) best = best.slice(0, 230).replace(/\s+\S*$/, "") + " …";
    return best;
  }
  function match(c, opts = {}) {
    const x = index(), prof = profile(c), res = [];
    const minScore = opts.min ?? 35;
    for (let i = 0; i < x.N; i++) {
      const f = x.F[i];
      if (opts.canton && f.c !== opts.canton) continue;
      const r = score(c, prof, f, i);
      if (r.score >= minScore) res.push(r);
    }
    res.sort((a, b) => b.score - a.score || a.f.n.localeCompare(b.f.n));
    return { prof, res: res.slice(0, opts.limit || 120) };
  }
  function explain(c, fid) {
    const x = index(), i = x.byId.get(String(fid));
    if (i === undefined) return null;
    return score(c, profile(c), x.F[i], i);
  }

  // ---- Lettres sur mesure ----
  const chf = (n) => "CHF " + Math.round(n || 0).toLocaleString("fr-CH").replace(/ |\s/g, "'");
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const fmtDate = (d) => d.toLocaleDateString("fr-CH", { day: "2-digit", month: "2-digit", year: "numeric" });

  function letter(c, fid, d, opt = {}) {
    const m = explain(c, fid);
    if (!m) return null;
    if (opt.quote) m.quote = opt.quote.replace(/\s+/g, " ").trim().replace(/[.;:]$/, "");
    const f = m.f, L = opt.lang || "fr", ton = opt.ton || "sobre";
    const P = c.projet || {};
    const montant = d && d.montant ? d.montant : P.montant;
    const dom = m.common[0] || (profile(c).domaines[0]) || "social_precarite";
    const lex = (DOMAINES[dom] || DOMAINES.social_precarite)[L];
    const je = c.type === "etudiant";
    const memeCanton = f.c === c.canton;
    const angles = [];
    angles.push({ k: "Citation du but", v: m.quote });
    if (m.common.length) angles.push({ k: "Domaine commun", v: m.common.map((x) => DOMAINES[x].label).join(", ") });
    if (memeCanton) angles.push({ k: "Ancrage", v: "même canton : " + CANTONS[c.canton] });
    angles.push({ k: "Demande", v: chf(montant) + (P.budget ? " · " + pct(montant, P.budget) + " % du budget" : "") });

    let o, p = [];
    if (L === "fr") {
      o = `Demande de soutien de ${chf(montant)} : ${P.titre}`;
      const depuis = c.fondee && !je ? `depuis ${c.fondee}` : "";
      p.push(`Selon ses statuts, ${f.n} s'est donné pour mission : « ${m.quote} ». ` + (je
        ? `C'est ce qui m'amène à vous écrire : ${c.mission}`
        : `C'est précisément sur ce terrain que ${c.nom} agit ${depuis ? depuis + " " : ""}${memeCanton ? "dans le canton de " + CANTONS[c.canton] : "en Suisse romande"} : ${lcFirst(c.mission)}`));
      p.push((je ? `Je sollicite votre soutien pour ${lcFirst(P.titre)}. ` : `Nous sollicitons votre soutien pour ${lcFirst(P.titre)}. `) + ensureDot(P.resume) +
        (P.beneficiaires ? ` ${je ? "Ce projet" : "Il"} bénéficiera directement ${aux(P.beneficiaires)}.` : "") + (P.debut ? ` Le démarrage est prévu ${P.debut}.` : ""));
      if (c.preuves && c.preuves.length) p.push((je ? "Quelques éléments de mon parcours : " : "Quelques repères sur notre action : ") + c.preuves.join(" ; ") + ".");
      if (P.budget) p.push(`Le budget total s'élève à ${chf(P.budget)}. ` + (je ? "Je vous demande" : "Nous vous demandons") + ` une contribution de ${chf(montant)}, soit ${pct(montant, P.budget)} % du budget` +
        (P.autres ? `, le solde étant couvert par ${P.autres}.` : ". Les autres démarches de financement sont en cours."));
      p.push(`En ${je ? "me" : "nous"} soutenant, ${f.n} contribuerait concrètement à ${lex.cause}` + (memeCanton ? `, ici, dans le canton de ${CANTONS[c.canton]}` : "") +
        (ton === "chaleureux" ? `. Votre engagement aurait aussi valeur de signal : il ${je ? "me" : "nous"} aiderait à convaincre d'autres partenaires de ${je ? "me" : "nous"} rejoindre.` : `. Un premier soutien de votre part aurait en outre un effet de levier auprès d'autres partenaires.`));
      p.push(je ? "Je m'engage à vous transmettre un bref rapport à la fin de mes études et à mentionner votre soutien si vous le souhaitez."
        : "Nous nous engageons à vous adresser un rapport d'activité et un décompte à l'issue du projet, et à mentionner votre soutien dans nos communications si vous le souhaitez.");
      p.push((je ? "Je reste" : "Nous restons") + ` volontiers à votre disposition pour ${ton === "chaleureux" ? "vous présenter ce projet de vive voix, ou vous accueillir sur place" : "un entretien"}. En vous remerciant de l'attention portée à ${je ? "ma" : "notre"} demande, ${je ? "je vous prie" : "nous vous prions"} d'agréer, Madame, Monsieur, ${je ? "mes" : "nos"} salutations distinguées.`);
    } else if (L === "de") {
      o = `Gesuch um Unterstützung von ${chf(montant)}: ${P.titre_de || P.titre}`;
      p.push(`Ihre Stiftung verfolgt den Zweck «${m.quote}». ` + (je ? "Genau deshalb wende ich mich an Sie." : `Genau in diesem Bereich engagiert sich ${c.nom}${c.fondee ? " seit " + c.fondee : ""}.`) + " " + (c.mission_de || c.mission));
      p.push((je ? "Ich ersuche Sie" : "Wir ersuchen Sie") + ` um Unterstützung für das Projekt «${P.titre_de || P.titre}». ` + ensureDot(P.resume_de || P.resume));
      p.push(`Das Gesamtbudget beträgt ${chf(P.budget)}. ` + (je ? "Ich beantrage" : "Wir beantragen") + ` einen Beitrag von ${chf(montant)}, das heisst ${pct(montant, P.budget)} % des Budgets.`);
      p.push(`Mit Ihrer Unterstützung würde ${f.n} einen konkreten Beitrag für ${lex.cause} leisten. Ein erster Beitrag hätte zudem eine Hebelwirkung bei weiteren Partnern.`);
      p.push((je ? "Ich verpflichte mich" : "Wir verpflichten uns") + ", Ihnen nach Projektabschluss einen Bericht und eine Abrechnung zuzustellen.");
      p.push((je ? "Für ein Gespräch stehe ich" : "Für ein Gespräch stehen wir") + " Ihnen gerne zur Verfügung. Mit freundlichen Grüssen");
    } else {
      o = `Funding request of ${chf(montant)}: ${P.titre_en || P.titre}`;
      p.push(`Your foundation's purpose is "${m.quote}". ` + (je ? "This is why I am writing to you." : `This is exactly where ${c.nom} works${c.fondee ? " since " + c.fondee : ""}.`) + " " + (c.mission_en || c.mission));
      p.push((je ? "I am" : "We are") + ` requesting your support for "${P.titre_en || P.titre}". ` + ensureDot(P.resume_en || P.resume));
      p.push(`The total budget is ${chf(P.budget)}. ` + (je ? "I am" : "We are") + ` asking for a contribution of ${chf(montant)}, i.e. ${pct(montant, P.budget)}% of the budget.`);
      p.push(`By supporting ${je ? "me" : "us"}, ${f.n} would make a direct contribution to ${lex.cause}. An early commitment would also help ${je ? "me" : "us"} secure other partners.`);
      p.push((je ? "I will" : "We will") + " send you a report and a financial statement at the end of the project.");
      p.push((je ? "I would" : "We would") + " be glad to present the project in person. Yours faithfully,");
    }
    const salut = L === "de" ? "Sehr geehrte Damen und Herren" : L === "en" ? "Dear Sir or Madam," : "Madame, Monsieur,";
    const verif = ["Vérifier sur le site de la fondation qu'elle accepte les demandes spontanées et ses délais",
      "Vérifier le montant habituel de ses soutiens (rapport annuel)", "Faire relire et valider la lettre par le client"];
    if (m.lang !== L) verif.unshift("Le but de la fondation est rédigé en " + ({ de: "allemand", it: "italien", fr: "français" })[m.lang] + " : envisager cette langue");
    return { objet: o, salut, paras: p, angles, verif, match: m, signature: [c.contact && c.contact.nom, c.contact && c.contact.fonction, je ? "" : c.nom].filter(Boolean),
      annexes: je ? ["Curriculum vitae", "Attestation d'immatriculation", "Budget des études", "Lettre de recommandation"] : ["Budget détaillé", "Statuts", "Derniers comptes approuvés", "Rapport d'activité"] };
  }
  const lcFirst = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : "");
  const ensureDot = (s) => (s ? (/[.!?]$/.test(s.trim()) ? s.trim() : s.trim() + ".") : "");
  const aux = (s) => (/^(les|des) /i.test(s) ? s.replace(/^les /i, "aux ").replace(/^des /i, "à des ") : /^(le) /i.test(s) ? s.replace(/^le /i, "au ") : "à " + s);

  // ---- Loterie Romande : soutiens comparables (répartition 2025) ----
  function loro(c, n = 12) {
    const L = window.LORO || [];
    if (!L.length) return { list: [], total: 0 };
    const prof = profile(c), out = [];
    for (const x of L) {
      if (x.c !== c.canton && x.c !== "CH-R") continue;
      let v = 0; stems(x.n + " " + x.t).forEach((w) => { if (prof.kw.has(w)) v += prof.kw.get(w); });
      const dm = detectDomains(x.n + " " + x.t).filter((d) => prof.domaines.includes(d)).length;
      v += dm * 3;
      if (v > 2) out.push({ x, v });
    }
    out.sort((a, b) => b.v - a.v || b.x.m - a.x.m);
    const list = out.slice(0, n).map((o) => o.x);
    const m = list.map((x) => x.m).sort((a, b) => a - b);
    return { list, total: out.length, median: m.length ? m[Math.floor(m.length / 2)] : 0, min: m[0] || 0, max: m[m.length - 1] || 0 };
  }

  window.LevierEngine = { loro, stems, CANTONS, ROMANDS, DOMAINES, norm, detectDomains, langOf, index, fondation, profile, match, explain, letter, chf, pct, fmtDate };
})();
