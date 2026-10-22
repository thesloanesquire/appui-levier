/* Levier · interface. Routage par hash, état local (navigateur), aucune donnée envoyée. */
(function () {
  "use strict";
  const E = window.LevierEngine;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const DAY = 864e5;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const inDays = (n) => new Date(today.getTime() + n * DAY);
  const dshort = (iso) => { if (!iso) return "—"; const d = new Date(iso); return d.toLocaleDateString("fr-CH", { day: "2-digit", month: "2-digit" }); };
  const dlong = (iso) => (iso ? E.fmtDate(new Date(iso)) : "—");
  const daysTo = (iso) => (iso ? Math.round((new Date(iso) - today) / DAY) : null);
  const k = (n) => (n >= 1000 ? Math.round(n / 1000) + "k" : String(n || 0));

  // ---------- Icônes (tracé maison, trait 1.6) ----------
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    landmark: '<path d="M3 21h18M5 18v-7M9.5 18v-7M14.5 18v-7M19 18v-7M12 3l9 5H3z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    cols: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
    check: '<path d="M20 6 9 17l-5-5"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
    pluscircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>', minuscircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
    ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    print: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4L21 8M21 3v5h-5"/>', send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>', lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  };
  const ic = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ""}</svg>`;
  const MARK = `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="var(--ink)"/><path d="M22 16v32h20" stroke="var(--bg)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="47" cy="22" r="6" fill="var(--accent)"/></svg>`;

  // ---------- Statuts ----------
  const STATUTS = [
    ["suggeree", "Suggérée"], ["qualifier", "À qualifier"], ["redaction", "En rédaction"], ["validation", "Validation client"],
    ["prete", "Prête"], ["envoyee", "Envoyée"], ["relancee", "Relancée"], ["accordee", "Accordée"], ["refusee", "Refusée"],
  ];
  const SL = Object.fromEntries(STATUTS);
  const OUVERTS = new Set(["qualifier", "redaction", "validation", "prete"]);
  const scoreHtml = (n) => `<span class="score ${n >= 75 ? "" : n >= 55 ? "mid" : "lo"}" title="Score de pertinence sur 100">${n}</span>`;
  const statusHtml = (s, flap) => `<span class="status" data-s="${s}">${flap ? [...SL[s]].map((ch, i) => `<span class="flap" style="animation-delay:${i * 22}ms">${ch === " " ? "&nbsp;" : esc(ch)}</span>`).join("") : esc(SL[s])}</span>`;

  // ---------- Données de démonstration (clients fictifs) ----------
  const DEMO_CLIENTS = [
    { id: "pedibus", nom: "Pédibus Riviera", type: "association", canton: "VD", ville: "Vevey", fondee: 2019, langue: "fr", site: "https://pedibus-riviera.example",
      mission: "Permettre aux enfants de la Riviera de se rendre à l'école à pied, en sécurité, accompagnés par des parents bénévoles.",
      description: "Lignes de pédibus scolaires, prévention routière, santé par le mouvement, mobilité douce et lien entre familles du quartier.",
      projet: { titre: "Dix nouvelles lignes de pédibus scolaires en 2027", resume: "Ouvrir dix lignes à Vevey, Montreux et La Tour-de-Peilz, former 80 parents conducteurs et équiper les enfants de gilets réfléchissants.", budget: 68000, montant: 15000, objectif: 45000, beneficiaires: "les 400 élèves concernés", debut: "en février 2027" },
      preuves: ["340 enfants accompagnés chaque jour", "48 parents bénévoles formés", "soutien de la commune de Vevey depuis 2021"], contact: { nom: "Claire Dufour", fonction: "Présidente", email: "presidence@pedibus-riviera.example" }, acces: true },
    { id: "aquavia", nom: "Aquavia Sàrl", type: "startup", canton: "GE", ville: "Genève", fondee: 2024, langue: "fr", site: "https://aquavia.example",
      mission: "Développer un filtre à eau solaire à bas coût pour les écoles rurales, conçu et testé à Genève.",
      description: "Innovation technologique, eau potable, santé publique, énergie solaire, coopération avec des écoles en Afrique de l'Ouest, prototype en phase pilote.",
      projet: { titre: "Pilote de 30 filtres solaires dans des écoles du Sénégal", resume: "Produire et installer 30 filtres, mesurer la qualité de l'eau pendant douze mois avec l'HEPIA et publier les résultats.", budget: 210000, montant: 40000, objectif: 120000, beneficiaires: "6'000 élèves", debut: "au printemps 2027" },
      preuves: ["prototype validé en laboratoire", "lauréate d'un concours d'innovation genevois en 2025"], contact: { nom: "Malik Ndiaye", fonction: "Cofondateur" }, acces: false },
    { id: "lea", nom: "Léa Moret", type: "etudiant", canton: "GE", ville: "Genève", langue: "fr", site: "",
      mission: "Je prépare un master en droit international humanitaire à l'IHEID et je finance mes études par mes propres moyens.",
      description: "Formation, études supérieures, droits humains, protection des civils, bourse d'études, master.",
      projet: { titre: "Une bourse pour ma deuxième année de master à l'IHEID", resume: "Couvrir les frais d'écolage et de subsistance de la deuxième année, dont un stage de terrain au CICR.", budget: 38000, montant: 9500, objectif: 25000, beneficiaires: "", debut: "en septembre 2027" },
      preuves: ["moyenne de 5,4 en première année", "bénévole à la Croix-Rouge genevoise depuis 2022"], contact: { nom: "Léa Moret", fonction: "Étudiante en master, IHEID" }, acces: true },
    { id: "memoire", nom: "Atelier Mémoire", type: "association", canton: "VD", ville: "Lausanne", fondee: 2015, langue: "fr", site: "https://atelier-memoire.example",
      mission: "Proposer des ateliers de stimulation cognitive et de lien social aux personnes âgées vivant à domicile.",
      description: "Personnes âgées, seniors, maladie d'Alzheimer, proches aidants, prévention, santé, lien social, ateliers de quartier.",
      projet: { titre: "Ateliers mémoire dans trois nouveaux quartiers de Lausanne", resume: "Ouvrir trois groupes hebdomadaires animés par une neuropsychologue et des bénévoles formés.", budget: 26000, montant: 6000, objectif: 10000, beneficiaires: "les 60 aînés inscrits", debut: "en janvier 2027" },
      preuves: ["120 participants par an", "partenariat avec Pro Senectute Vaud"], contact: { nom: "Jean-Marc Rochat", fonction: "Président" }, acces: false },
    { id: "basket", nom: "Basket Lausanne Jeunesse", type: "association", canton: "VD", ville: "Lausanne", fondee: 2008, langue: "fr", site: "https://blj.example",
      mission: "Offrir à des jeunes de quartiers populaires une pratique sportive encadrée, gratuite et mixte.",
      description: "Sport, jeunesse, intégration, quartiers, mixité, éducation par le sport, entraîneurs bénévoles.",
      projet: { titre: "Un programme basket et devoirs pour 120 jeunes", resume: "Deux entraînements par semaine suivis d'une aide aux devoirs encadrée par des étudiants.", budget: 54000, montant: 12000, objectif: 30000, beneficiaires: "120 jeunes de 10 à 16 ans", debut: "à la rentrée 2027" },
      preuves: ["210 licenciés", "45 % de joueuses"], contact: { nom: "Sofia Bertholet", fonction: "Coordinatrice" }, acces: false },
    { id: "treteaux", nom: "Les Tréteaux du Jura", type: "association", canton: "JU", ville: "Delémont", fondee: 2011, langue: "fr", site: "https://treteaux.example",
      mission: "Faire tourner du théâtre professionnel dans les villages jurassiens, au plus près des habitants.",
      description: "Culture, théâtre, création artistique, médiation culturelle, régions rurales, patrimoine jurassien.",
      projet: { titre: "Une tournée de création dans 15 villages jurassiens", resume: "Créer un spectacle tiré de récits locaux et le jouer dans quinze salles communales, avec des ateliers scolaires.", budget: 84000, montant: 15000, objectif: 40000, beneficiaires: "les habitants de 15 communes", debut: "en mai 2027" },
      preuves: ["4'500 spectateurs en 2025", "soutien de la République et Canton du Jura"], contact: { nom: "Noémie Chappuis", fonction: "Directrice artistique" }, acces: false },
  ];
  const PLAN = [["validation", 2], ["redaction", 3], ["prete", 7], ["qualifier", 9], ["envoyee", -8], ["relancee", -24], ["accordee", -40], ["qualifier", 18], ["redaction", 14], ["refusee", -30]];

  // ---------- État ----------
  const KEY = "levier.v1";
  let S = null;
  const STORE = window.AppuiStore;
  const SERVEUR = () => STORE && STORE.st.mode === "serveur";
  let SYNC = "ok";
  const syncState = (s) => { SYNC = s; const el = document.getElementById("syncdot"); if (el) { el.dataset.s = s; el.title = s === "erreur" ? "Synchronisation impossible : vérifiez la connexion" : s === "sync" ? "Enregistrement…" : "Enregistré sur le serveur"; } };
  const save = () => {
    if (SERVEUR()) return STORE.sync(S, syncState);
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* stockage indisponible : l'état reste en mémoire */ }
  };
  function seed() {
    const clients = JSON.parse(JSON.stringify(DEMO_CLIENTS));
    const demandes = [];
    const pris = new Set();
    clients.forEach((c, ci) => {
      const { res } = E.match(c, { limit: 40 });
      const choix = res.filter((r) => !pris.has(r.f.id)).slice(0, 5 + (ci % 3));
      choix.forEach((r, j) => {
        pris.add(r.f.id);
        const [statut, off] = PLAN[(j + ci * 3) % PLAN.length];
        const montant = Math.round((c.projet.montant * (j % 3 === 0 ? 1 : j % 3 === 1 ? 0.6 : 0.4)) / 500) * 500;
        demandes.push({ id: c.id + "-" + r.f.id, client: c.id, fondation: r.f.id, statut, montant, obtenu: statut === "accordee" ? montant : 0,
          echeance: OUVERTS.has(statut) ? inDays(off + ci).toISOString() : null, envoi: off < 0 ? inDays(off + ci).toISOString() : null, score: r.score, lettre: null });
      });
    });
    return { v: 1, clients, demandes, journal: [], memo: {} };
  }
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) { S = JSON.parse(raw); return; } } catch (e) { /* ignore */ }
    S = seed(); save();
  }
  const memo = (fid) => (S.memo || (S.memo = {}))[fid] || {};
  let BOT = window.LEVIER_BOT || {};
  const botEval = (cid, fid) => (BOT[cid] ? BOT[cid].resultats.find((e) => String(e.id) === String(fid)) : null);
  function mergeBot() {
    let n = 0;
    if (SERVEUR()) S.analyses = BOT;
    Object.values(BOT).forEach((b) => {
      if (S.clients.some((c) => c.id === b.id)) return;
      const p = b.profil, mt = p.projet.montant_estime || 10000;
      S.clients.push({ id: b.id, nom: p.nom, type: p.type === "autre" ? "association" : p.type, canton: p.canton, ville: p.ville || p.canton, fondee: p.fondee || null, langue: p.langue || "fr",
        site: (b.source && b.source.url) || "", mission: p.mission, description: p.description, domaines: b.criteres.domaines,
        projet: { titre: p.projet.titre, resume: p.projet.resume, beneficiaires: p.projet.beneficiaires || "", budget: p.projet.montant_estime ? mt * 4 : 0, montant: Math.round(mt / 4 / 500) * 500 || 5000, objectif: p.projet.montant_estime || 0 },
        preuves: p.preuves || [], contact: { nom: "À compléter", fonction: "" }, acces: false, bot: true });
      b.resultats.filter((e) => e.verdict === "prioritaire").slice(0, 10).forEach((e) => S.demandes.push({ id: b.id + "-" + e.id, client: b.id, fondation: String(e.id), statut: "qualifier",
        montant: Math.round(mt / 4 / 500) * 500 || 5000, obtenu: 0, echeance: inDays(28).toISOString(), envoi: null, score: e.score, lettre: null }));
      S.journal.unshift({ t: new Date().toISOString(), client: b.id, txt: `Client créé par le bot (${b.moteur}, ${b.date}) : ${b.resultats.filter((e) => e.verdict === "prioritaire").length} fondations prioritaires` });
      n++;
    });
    if (n) save();
  }
  const client = (id) => S.clients.find((c) => c.id === id);
  const demandesOf = (cid) => S.demandes.filter((d) => d.client === cid);
  const F = (id) => E.fondation(id) || { id, n: "Fondation introuvable", p: "", c: "", d: [], t: "" };
  function setStatut(d, s, note) {
    const old = d.statut; if (old === s) return;
    d.statut = s;
    if (s === "envoyee" && !d.envoi) d.envoi = today.toISOString();
    if (s === "accordee" && !d.obtenu) d.obtenu = d.montant;
    S.journal.unshift({ t: new Date().toISOString(), client: d.client, txt: `${F(d.fondation).n} : ${SL[old]} → ${SL[s]}${note ? " (" + note + ")" : ""}` });
    FLAP.add(d.id); save();
  }
  const FLAP = new Set();
  const flapOnce = (id) => { const f = FLAP.has(id); FLAP.delete(id); return f; };
  function relanceDue(d) { return (d.statut === "envoyee") && d.envoi && (today - new Date(d.envoi)) / DAY >= 21; }

  // ---------- Toast ----------
  function toast(msg) { const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2600); }

  // ---------- Shell ----------
  function shell(active, crumbs, body, actions = "") {
    const ouvertes = S.demandes.filter((d) => OUVERTS.has(d.statut)).length;
    const urg = (cid) => demandesOf(cid).some((d) => OUVERTS.has(d.statut) && daysTo(d.echeance) !== null && daysTo(d.echeance) <= 3);
    return `<div class="app">
      <aside class="rail" aria-label="Navigation principale">
        <a class="brand" href="#/">${MARK}<b>levier<span>.</span></b></a>
        <button class="cmdk-btn" data-act="palette">${ic("search")}<span>Rechercher</span><kbd>⌘K</kbd></button>
        <nav class="nav">
          <a href="#/" ${active === "apercu" ? 'aria-current="page"' : ""}>${ic("home")}Aperçu</a>
          <a href="#/demandes" ${active === "demandes" ? 'aria-current="page"' : ""}>${ic("cols")}Demandes<span class="count">${ouvertes}</span></a>
          <a href="#/clients" ${active === "clients" ? 'aria-current="page"' : ""}>${ic("users")}Clients<span class="count">${S.clients.length}</span></a>
          <a href="#/fondations" ${active === "fondations" ? 'aria-current="page"' : ""}>${ic("landmark")}Fondations<span class="count">${(window.FONDATIONS || []).length.toLocaleString("fr-CH").replace(/ |\s/g, "'")}</span></a>
          <a href="#/nouveau" ${active === "nouveau" ? 'aria-current="page"' : ""}>${ic("plus")}Nouveau client</a>
          <div class="nav-label">Clients actifs</div>
          ${S.clients.map((c) => `<a class="client-link" href="#/clients/${c.id}">${urg(c.id) ? '<i class="hot"></i>' : "<i></i>"}${esc(c.nom)}</a>`).join("")}
        </nav>
        <div class="rail-foot">${SERVEUR() && STORE.st.user ? `<span class="avatar">${esc((STORE.st.user.name || STORE.st.user.email || "?").slice(0, 2).toUpperCase())}</span><span class="who"><span class="clip">${esc(STORE.st.user.name || STORE.st.user.email)}</span><span class="sub"><i id="syncdot" class="syncdot" data-s="${SYNC}"></i>Partagé · <button class="linkbtn" data-act="logout">Se déconnecter</button></span></span>` : `<span class="avatar">AC</span><span>Mode démo local</span>`}<button data-act="theme" title="Changer de thème" aria-label="Changer de thème">${ic("moon")}</button></div>
      </aside>
      <div class="main">
        <header class="topbar"><div class="crumbs">${crumbs}</div><div class="grow"></div>${SERVEUR() ? "" : '<span class="demo-flag" title="Clients et demandes fictifs ; fondations réelles (registre du commerce)">Démo locale · clients fictifs</span>'}${actions}</header>
        <main class="page" id="content">${body}</main>
      </div></div>`;
  }

  // ---------- Vues ----------
  function vBienvenue() {
    const body = `<div class="page-head"><div><h1>Bienvenue dans Appui</h1><p class="lede">L'outil interne de Levier pour trouver les bonnes fondations et préparer une lettre sur mesure pour chacune.</p></div></div>
      <div class="onboard">${[["1", "Ajouter un client", "Collez le site de l'association et sa présentation : Appui en tire un profil et classe les fondations.", "#/nouveau", "Nouveau client"],
        ["2", "Lancer le bot IA (facultatif)", "Pour une recherche complète : critères établis par l'IA, 60 fondations évaluées, citations vérifiées. Demandez à Claude Code : « lance le bot sur ce client ».", "#/nouveau", "Voir la commande"],
        ["3", "Explorer les fondations", "14'980 fondations actives du registre du commerce, filtrables par canton, domaine et autorité de surveillance.", "#/fondations", "Explorer"]]
        .map(([n, h, p, href, cta]) => `<a class="onboard-step" href="${href}"><span class="mono">${n}</span><span><b>${h}</b><span class="sub">${p}</span></span><span class="btn sm">${cta}</span></a>`).join("")}</div>`;
    return shell("apercu", `<span>${today.toLocaleDateString("fr-CH", { weekday: "long", day: "numeric", month: "long" })}</span>`, body);
  }
  function vApercu() {
    if (!S.clients.length) return vBienvenue();
    const open = S.demandes.filter((d) => OUVERTS.has(d.statut)).sort((a, b) => new Date(a.echeance) - new Date(b.echeance));
    const todo = [];
    S.demandes.forEach((d) => {
      const c = client(d.client), f = F(d.fondation), j = daysTo(d.echeance);
      if (d.statut === "validation") todo.push({ hot: j !== null && j <= 3, h: `Obtenir la validation de ${c.nom}`, s: `${f.n} · dépôt ${j <= 0 ? "aujourd'hui" : "dans " + j + " j"}`, href: `#/lettre/${d.id}`, o: j });
      else if (d.statut === "redaction" && j !== null && j <= 7) todo.push({ hot: j <= 3, h: `Finir la lettre à ${f.n}`, s: `${c.nom} · dépôt le ${dshort(d.echeance)}`, href: `#/lettre/${d.id}`, o: j });
      else if (d.statut === "prete") todo.push({ hot: false, h: `Envoyer la demande à ${f.n}`, s: `${c.nom} · lettre validée`, href: `#/lettre/${d.id}`, o: j ?? 50 });
      else if (relanceDue(d)) todo.push({ hot: false, h: `Relancer ${f.n}`, s: `${c.nom} · envoyée le ${dlong(d.envoi)}`, href: `#/lettre/${d.id}`, o: 40 });
      else if (d.statut === "qualifier") todo.push({ hot: false, h: `Qualifier ${f.n}`, s: `${c.nom} · score ${d.score}`, href: `#/clients/${c.id}/fondations/${f.id}`, o: 60 + (j || 0) });
    });
    todo.sort((a, b) => a.o - b.o);
    const demande = S.demandes.reduce((t, d) => t + (d.statut !== "suggeree" && d.statut !== "refusee" ? d.montant : 0), 0);
    const obtenu = S.demandes.reduce((t, d) => t + (d.obtenu || 0), 0);
    const urg = open.filter((d) => daysTo(d.echeance) <= 3).length;
    const body = `
      <div class="page-head"><div><h1>Aperçu</h1></div>
        <a class="btn primary" href="#/nouveau">${ic("plus")}Nouveau client</a>
        <div class="stats">${urg ? `<span class="stat hot"><b>${urg}</b> dépôt${urg > 1 ? "s" : ""} sous 72 h</span>` : ""}<span class="stat"><b>${S.clients.length}</b> campagnes</span><span class="stat"><b>${open.length}</b> demandes ouvertes</span><span class="stat"><b>${E.chf(demande)}</b> demandés</span><span class="stat"><b>${E.chf(obtenu)}</b> obtenus</span></div></div>
      <div class="overview">
        <section class="panel" aria-labelledby="todo-h"><div class="panel-h"><h2 id="todo-h">À faire</h2><span class="muted">${todo.length} actions</span></div>
          <ul class="todo">${todo.slice(0, 9).map((t) => `<li><span class="dot ${t.hot ? "hot" : ""}"></span><a href="${t.href}"><b>${esc(t.h)}</b><span class="sub">${esc(t.s)}</span></a>${ic("arrow")}</li>`).join("") || '<li><span></span><span class="sub">Rien d\'urgent aujourd\'hui.</span></li>'}</ul></section>
        <div style="display:flex;flex-direction:column;gap:24px;min-width:0">
          <section class="panel" aria-labelledby="dep-h"><div class="panel-h"><h2 id="dep-h">Dépôts à venir</h2><span class="muted">triés par échéance</span></div>
            <div style="overflow:auto"><table class="t"><thead><tr><th>Échéance</th><th>Fondation</th><th class="hide-sm">Client</th><th class="r">Demandé</th><th>Statut</th></tr></thead><tbody>
            ${open.slice(0, 10).map((d) => { const f = F(d.fondation), c = client(d.client), j = daysTo(d.echeance);
              return `<tr class="clickable ${j <= 3 ? "urgent" : ""}" data-href="#/lettre/${d.id}"><td class="when">${dshort(d.echeance)}<div class="sub">${j <= 0 ? "aujourd'hui" : j === 1 ? "demain" : "dans " + j + " j"}</div></td><td style="max-width:0;width:auto"><div class="name clip" title="${esc(f.n)}">${esc(f.n)}</div><div class="sub clip">${esc(f.s || "")}${f.c ? " · " + f.c : ""}</div></td><td class="hide-sm cl"><span class="clip" style="max-width:150px" title="${esc(c.nom)}">${esc(c.nom)}</span></td><td class="r num">${E.chf(d.montant)}</td><td>${statusHtml(d.statut, flapOnce(d.id))}</td></tr>`; }).join("")}
            </tbody></table></div></section>
          <section class="panel" aria-labelledby="camp-h"><div class="panel-h"><h2 id="camp-h">Campagnes</h2><span class="muted">obtenu, puis demandé, sur l'objectif</span></div>
            <div class="camps" style="border-top:0">${S.clients.map((c) => { const ds = demandesOf(c.id), ob = ds.reduce((t, d) => t + (d.obtenu || 0), 0), dm = ds.filter((d) => !["suggeree", "refusee", "accordee"].includes(d.statut)).reduce((t, d) => t + d.montant, 0), obj = c.projet.objectif || c.projet.montant;
              return `<a class="camp" href="#/clients/${c.id}"><div class="name">${esc(c.nom)}</div><div class="sub">${typeLabel(c.type)} · ${c.canton} · ${ds.length} demandes</div><div class="meter" aria-hidden="true"><u style="width:${Math.min(100, E.pct(ob, obj))}%"></u><s style="width:${Math.min(100 - Math.min(100, E.pct(ob, obj)), E.pct(dm, obj))}%"></s></div><div class="sub num"><b style="color:var(--ink)">${E.chf(ob)}</b> obtenus · ${E.chf(dm)} en cours · objectif ${E.chf(obj)}</div></a>`; }).join("")}</div></section>
        </div></div>`;
    return shell("apercu", `<span>${today.toLocaleDateString("fr-CH", { weekday: "long", day: "numeric", month: "long" })}</span>`, body);
  }
  const typeLabel = (t) => ({ association: "Association", startup: "Start-up", etudiant: "Étudiant·e", consultant: "Consultant·e" })[t] || t;

  function vDemandes() {
    const cols = ["qualifier", "redaction", "validation", "prete", "envoyee", "relancee", "accordee"];
    const body = `<div class="page-head"><div><h1>Demandes</h1><p class="lede">Une demande = une fondation pour un client. Changez le statut depuis la lettre ou la fiche.</p></div></div>
      <div class="board">${cols.map((s) => { const ds = S.demandes.filter((d) => d.statut === s).sort((a, b) => new Date(a.echeance || 0) - new Date(b.echeance || 0));
        return `<section class="col" aria-label="${SL[s]}"><div class="col-h"><b>${SL[s]}</b><span>${ds.length} · ${k(ds.reduce((t, d) => t + d.montant, 0))}</span></div>
          ${ds.map((d) => { const f = F(d.fondation), c = client(d.client), j = daysTo(d.echeance);
            return `<a class="card ${j !== null && j <= 3 && OUVERTS.has(s) ? "urgent" : ""}" href="#/lettre/${d.id}"><div class="name" style="font-size:14px">${esc(f.n)}</div><div class="sub">${esc(c.nom)}</div><div class="row"><span>${E.chf(d.montant)}</span><span class="d">${d.echeance && OUVERTS.has(s) ? dshort(d.echeance) : d.envoi ? "env. " + dshort(d.envoi) : ""}</span></div></a>`; }).join("") || '<p class="sub" style="padding:14px">Aucune</p>'}</section>`; }).join("")}</div>`;
    return shell("demandes", "<span>Toutes les campagnes</span>", body);
  }

  function vClients() {
    const body = `<div class="page-head"><div><h1>Clients</h1><p class="lede">Chaque client a sa campagne, sa carte de fondations et son accès en lecture.</p></div><a class="btn primary" href="#/nouveau">${ic("plus")}Nouveau client</a></div>
      <div class="table-wrap"><table class="t"><thead><tr><th>Client</th><th class="hide-sm">Type</th><th>Prochaine échéance</th><th class="r hide-sm">Objectif</th><th class="r">Obtenu</th><th class="hide-sm">Accès client</th></tr></thead><tbody>
      ${S.clients.map((c) => { const ds = demandesOf(c.id), nx = ds.filter((d) => OUVERTS.has(d.statut)).sort((a, b) => new Date(a.echeance) - new Date(b.echeance))[0];
        return `<tr class="clickable" data-href="#/clients/${c.id}"><td><div class="name">${esc(c.nom)}</div><div class="sub">${esc(c.ville)} · ${c.canton}</div></td><td class="hide-sm">${typeLabel(c.type)}</td><td>${nx ? `<b>${dshort(nx.echeance)}</b> <span class="sub">${esc(F(nx.fondation).n)}</span>` : '<span class="sub">—</span>'}</td><td class="r num hide-sm">${E.chf(c.projet.objectif)}</td><td class="r num">${E.chf(ds.reduce((t, d) => t + (d.obtenu || 0), 0))}</td><td class="hide-sm">${c.acces ? `<span class="tag on">Actif</span>` : '<span class="tag">Inactif</span>'}</td></tr>`; }).join("")}
      </tbody></table></div>`;
    return shell("clients", `<span>${S.clients.length} clients actifs</span>`, body);
  }

  function clientHead(c, tab) {
    const ds = demandesOf(c.id), ob = ds.reduce((t, d) => t + (d.obtenu || 0), 0);
    const nx = ds.filter((d) => OUVERTS.has(d.statut)).sort((a, b) => new Date(a.echeance) - new Date(b.echeance))[0];
    const ini = c.nom.split(/\s+/).filter((w) => /^[A-ZÀ-Ý]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
    return `<div class="client-head"><div class="ident"><span class="mono" aria-hidden="true">${esc(ini)}</span><div><h1>${esc(c.nom)}</h1>
        <div class="facts"><span class="tag">${typeLabel(c.type)} · ${esc(c.ville)} (${c.canton})</span><span class="tag">Objectif ${c.projet.objectif ? E.chf(c.projet.objectif) : "à définir"}</span><span class="tag on">Obtenu ${E.chf(ob)}</span><span class="tag">Prochaine échéance ${nx ? dshort(nx.echeance) : "—"}</span></div></div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn" href="#/portail/${c.id}">${ic("eye")}Voir comme le client</a></div></div>
      <nav class="tabs" aria-label="Sections du client">
        <a href="#/clients/${c.id}/fondations" ${tab === "fondations" ? 'aria-current="page"' : ""}>Fondations</a>
        <a href="#/clients/${c.id}/demandes" ${tab === "demandes" ? 'aria-current="page"' : ""}>Demandes<span class="count">${ds.filter((d) => d.statut !== "suggeree").length}</span></a>
        <a href="#/clients/${c.id}/loro" ${tab === "loro" ? 'aria-current="page"' : ""}>Loterie Romande</a>
        <a href="#/clients/${c.id}/profil" ${tab === "profil" ? 'aria-current="page"' : ""}>Profil</a>
        <a href="#/clients/${c.id}/journal" ${tab === "journal" ? 'aria-current="page"' : ""}>Journal</a></nav>`;
  }
  const crumbsClient = (c, extra) => `<a href="#/clients">Clients</a><span>/</span><b>${esc(c.nom)}</b>${extra ? "<span>/</span>" + extra : ""}`;

  const UI = { min: 45, canton: "", type: "" };
  function vClientFondations(c, fid) {
    const b = BOT[c.id];
    if (b && UI.mode !== "regles") return vClientBot(c, b, fid);
    const { res } = E.match(c, { limit: 150, min: UI.min });
    const list = res.filter((r) => (!UI.canton || r.f.c === UI.canton) && (!UI.type || r.f.t === UI.type));
    const sel = fid ? (list.find((r) => r.f.id === fid) || E.explain(c, fid)) : list[0];
    const dem = (id) => S.demandes.find((d) => d.client === c.id && d.fondation === id);
    const cantons = [...new Set(res.map((r) => r.f.c))].filter(Boolean).sort();
    const body = clientHead(c, "fondations") + `<div class="split">
      <div class="list" role="listbox" aria-label="Fondations classées">
        <div class="list-tools">${b ? modeSeg() : ""}<span class="sub" style="margin-right:auto">${list.length} fondations · score ≥ ${UI.min}</span>
          <select class="select" data-ui="canton" aria-label="Canton"><option value="">Tous cantons</option>${cantons.map((x) => `<option ${UI.canton === x ? "selected" : ""}>${x}</option>`).join("")}</select>
          <select class="select" data-ui="type" aria-label="Type"><option value="">Tous types</option><option value="donatrice_probable" ${UI.type === "donatrice_probable" ? "selected" : ""}>Donatrices</option><option value="mixte" ${UI.type === "mixte" ? "selected" : ""}>Mixtes</option></select></div>
        ${list.map((r) => { const d = dem(r.f.id); return `<button class="match" role="option" aria-selected="${sel && sel.f.id === r.f.id}" data-href="#/clients/${c.id}/fondations/${r.f.id}">${scoreHtml(r.score)}<span style="min-width:0"><span class="name clip">${esc(r.f.n)}</span><span class="cite one">${esc(r.quote)}</span><span class="meta"><span class="sub">${esc(r.f.s)} · ${r.f.c}</span>${d ? statusHtml(d.statut) : ""}</span></span></button>`; }).join("") || '<div class="empty"><b>Aucune fondation au-dessus du seuil</b>Baissez le seuil ou complétez le profil du client.</div>'}
        ${list.length ? `<div style="padding:12px"><button class="btn sm" data-act="seuil">${UI.min > 30 ? "Afficher les scores plus faibles" : "Revenir au seuil normal"}</button></div>` : ""}
      </div>
      <div class="detail">${sel ? detailFondation(c, sel, dem(sel.f.id)) : ""}</div></div>`;
    return shell("clients", crumbsClient(c, "Fondations"), body);
  }
  const modeSeg = () => `<div class="seg" role="group" aria-label="Classement"><button data-act="mode" data-v="bot" aria-pressed="${UI.mode !== "regles"}">Bot IA</button><button data-act="mode" data-v="regles" aria-pressed="${UI.mode === "regles"}">Mots-clés</button></div>`;
  const VERDICT = { prioritaire: "Prioritaire", possible: "Possible", ecarter: "À écarter" };
  function vClientBot(c, b, fid) {
    const list = b.resultats.filter((e) => UI.ecarter || e.verdict !== "ecarter");
    const sel = list.find((e) => String(e.id) === String(fid)) || list[0];
    const dem = (id) => S.demandes.find((d) => d.client === c.id && d.fondation === String(id));
    const cr = b.criteres;
    const body = clientHead(c, "fondations") + `<details class="panel botcrit"><summary><span class="score" style="width:auto;padding:0 8px">Bot</span><b>Critères établis par le bot</b><span class="sub">${esc(b.date.split("-").reverse().join("."))} · ${esc(b.moteur)} · ${b.resultats.filter((e) => e.verdict === "prioritaire").length} prioritaires sur ${b.resultats.length} évaluées</span></summary>
        <div class="botcrit-body"><p>${esc(cr.justification)}</p>
        <div class="h3">Domaines</div><div class="tags">${cr.domaines.map((d) => `<span class="tag on">${esc((E.DOMAINES[d] || { label: d }).label)}</span>`).join("")}</div>
        <div class="h3">Mots-clés recherchés dans les buts statutaires</div><div class="tags">${[...cr.mots_cles_fr, ...cr.mots_cles_de].map((w) => `<span class="tag">${esc(w)}</span>`).join("")}</div>
        <div class="h3">Zone et exclusions</div><p class="sub">${esc([...(cr.zone.cantons || []), cr.zone.romandie ? "Suisse romande" : "", cr.zone.suisse ? "toute la Suisse" : "", cr.zone.international ? "international" : ""].filter(Boolean).join(" · "))}${cr.exclusions.length ? " · à éviter : " + esc(cr.exclusions.join(", ")) : ""}</p></div></details>
      <div class="split">
      <div class="list" role="listbox" aria-label="Fondations évaluées par le bot">
        <div class="list-tools">${modeSeg()}<span class="sub" style="margin-right:auto">${list.length} fondations</span><button class="btn sm ghost" data-act="ecarter">${UI.ecarter ? "Masquer les écartées" : "Voir les écartées"}</button></div>
        ${list.map((e) => { const d = dem(e.id); return `<button class="match" role="option" aria-selected="${sel && sel.id === e.id}" data-href="#/clients/${c.id}/fondations/${e.id}">${scoreHtml(e.score)}<span style="min-width:0"><span class="name clip">${esc(e.nom)}</span><span class="cite one">${esc(e.citation)}</span><span class="meta"><span class="sub">${esc(e.siege)} · ${e.canton}</span>${ENR[e.id] && ENR[e.id].demande.accepte_demandes === "non" ? '<span class="tag" style="background:var(--accent-soft);color:var(--accent-ink)">N\'accepte pas de demandes</span>' : ""}${d ? statusHtml(d.statut) : `<span class="tag ${e.verdict === "prioritaire" ? "on" : ""}">${VERDICT[e.verdict]}</span>`}</span></span></button>`; }).join("")}
      </div>
      <div class="detail">${sel ? detailBot(c, sel, dem(sel.id)) : '<div class="empty"><b>Aucune fondation retenue</b>Relancez le bot avec plus de candidates.</div>'}</div></div>`;
    return shell("clients", crumbsClient(c, "Fondations"), body);
  }
  function detailBot(c, e, d) {
    const f = F(e.id);
    return `<h2>${esc(e.nom)}</h2>
      <div class="idline">${esc(e.uid || "")} · ${esc(e.siege)} (${e.canton}) · <span class="tag ${e.verdict === "prioritaire" ? "on" : ""}">${VERDICT[e.verdict]}</span> · <a href="https://www.zefix.ch/fr/search/entity/list?name=${encodeURIComponent(e.nom)}" target="_blank" rel="noopener">Zefix ${ic("ext")}</a></div>
      ${ENR[e.id] && ENR[e.id].demande.accepte_demandes === "non" ? `<p class="alert-soft" style="margin:0 0 16px">${ic("alert")}La fiche pratique indique que cette fondation ne finance pas de projets de tiers. Le score du bot date d'avant cette vérification.</p>` : ""}
      <div class="purpose">${esc(e.citation)}</div>
      ${e.citation_verifiee === false ? '<p class="sub" style="margin:-12px 0 16px">Citation de l\'IA non retrouvée dans le but : début du but affiché à la place.</p>' : ""}
      <div class="h3" style="display:flex;align-items:center;gap:10px">${scoreHtml(e.score)}Analyse du bot</div>
      <ul class="reasons">${e.raisons.map((x) => `<li><span class="plus">${ic("pluscircle")}</span>${esc(x)}</li>`).join("")}${e.risques.map((x) => `<li><span class="minus">${ic("minuscircle")}</span>${esc(x)}</li>`).join("")}</ul>
      <div class="h3">Angle conseillé pour la lettre</div><p class="angle-box">${esc(e.angle_lettre)}</p>
      <details style="margin-top:16px"><summary class="sub" style="cursor:pointer">But social complet</summary><p style="margin-top:8px;font-size:13.5px;line-height:1.6">${esc(f.p)}</p></details>
      ${ficheHtml(String(e.id))}
      ${memoHtml(c, String(e.id))}
      <div class="actions">${d ? `${statusHtml(d.statut)}<a class="btn primary" href="#/lettre/${d.id}">${ic("file")}Ouvrir la lettre</a>` :
        `<button class="btn primary" data-act="ajouter" data-f="${e.id}">${ic("file")}Rédiger la lettre</button><button class="btn" data-act="ajouter" data-f="${e.id}" data-only="1">${ic("plus")}Ajouter à la campagne</button>`}</div>`;
  }
  let ENR = window.LEVIER_ENRICHI || {};
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return u; } };
  function ficheHtml(fid) {
    const x = ENR[fid];
    if (!x) return `<div class="fiche fiche-vide"><b>Fiche pratique pas encore établie</b><span class="sub">Site, contact, délais et modalités : lancer <code>python3.12 scripts/enrichir_fondations.py --id ${esc(fid)}</code></span></div>`;
    const d = x.demande || {}, ct = x.contact || {};
    const ACC = { oui: ["on", "Accepte les demandes"], non: ["", "N'accepte pas de demandes spontanées"], "sur invitation": ["", "Sur invitation seulement"], inconnu: ["", "Demandes : à vérifier"] }[d.accepte_demandes || "inconnu"];
    const row = (k, v) => (v && (!Array.isArray(v) || v.length) ? `<dt>${k}</dt><dd>${Array.isArray(v) ? v.map(esc).join(" · ") : v}</dd>` : "");
    return `<div class="fiche"><div class="fiche-h"><b>Fiche pratique</b><span class="tag ${ACC[0]}">${ACC[1]}</span><span class="sub">${esc(x.date.split("-").reverse().join("."))} · confiance ${esc(x.confiance)}</span></div>
      ${x.resume ? `<p class="fiche-resume">${esc(x.resume)}</p>` : ""}
      <dl>${row("Site", x.site_web ? `<a href="${esc(x.site_web)}" target="_blank" rel="noopener">${esc(host(x.site_web))} ${ic("ext")}</a>` : "")}
        ${row("Déposer", d.url_page_demande ? `<a href="${esc(d.url_page_demande)}" target="_blank" rel="noopener">${esc(d.modalites || "page de demande")} ${ic("ext")}</a>` : esc(d.modalites || ""))}
        ${row("Délais", d.delais)}${row("Montants", esc(d.montants || ""))}${row("Zone", esc(d.zone || ""))}
        ${row("Critères", d.criteres)}${row("Exclusions", d.exclusions)}${row("Documents", d.documents_requis)}${row("Langues", d.langues)}
        ${row("Contact", [ct.responsable_fonction && esc(ct.responsable_fonction), ct.adresse && esc(ct.adresse), ct.email && `<a href="mailto:${esc(ct.email)}">${esc(ct.email)}</a>`, ct.telephone && esc(ct.telephone), ct.formulaire_url && `<a href="${esc(ct.formulaire_url)}" target="_blank" rel="noopener">formulaire de contact ${ic("ext")}</a>`].filter(Boolean).join("<br>"))}
        ${row("Soutiens récents", x.projets_soutenus)}</dl>
      <details><summary class="sub">${x.sources.length} source(s)</summary><ul class="fiche-src">${x.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(host(s.url))}</a> · ${esc(s.apport)}</li>`).join("")}</ul></details></div>`;
  }
  function memoHtml(c, fid) {
    const m = memo(fid), autres = S.demandes.filter((d) => d.fondation === String(fid) && d.client !== c.id);
    const hist = autres.map((d) => `${esc(client(d.client)?.nom || "")} : ${SL[d.statut]}${d.motif ? " (" + esc(d.motif) + ")" : ""}`);
    const f = F(fid);
    return `${autres.some((d) => OUVERTS.has(d.statut) || d.statut === "envoyee") ? `<p class="alert-soft">${ic("alert")}Déjà sollicitée pour un autre client : ${hist.join(" · ")}. Évitez deux demandes Levier le même mois.</p>` : ""}
      ${f.st || f.sv ? `<div class="h3">Autorité de surveillance</div><div class="tags">${f.sv ? '<span class="tag">Surveillance fédérale (ASF)</span>' : ""}${(f.st || []).map((x) => `<span class="tag ${/Soutien financier/.test(x) ? "on" : ""}">As-So : ${esc(x)}</span>`).join("")}</div>` : ""}
      <details class="memo" ${m.notes || m.delai || m.montant ? "open" : ""}><summary>Mémoire de l'agence${hist.length && !autres.some((d) => OUVERTS.has(d.statut)) ? " · " + hist.length + " demande(s) passée(s)" : ""}</summary>
        <form data-form="memo" data-f="${esc(fid)}" class="memo-grid">
          <label>Délai de dépôt habituel<input class="input" name="delai" value="${esc(m.delai || "")}" placeholder="ex. 31 mars et 30 septembre"></label>
          <label>Montant habituel<input class="input" name="montant" value="${esc(m.montant || "")}" placeholder="ex. CHF 5'000 à 20'000"></label>
          <label>Modalités<input class="input" name="modalites" value="${esc(m.modalites || "")}" placeholder="formulaire en ligne, lettre, dossier complet…"></label>
          <label class="full">Notes (contacts institutionnels, retours, conseils)<textarea class="input" name="notes" rows="2">${esc(m.notes || "")}</textarea></label>
          ${hist.length ? `<p class="sub full">Historique : ${hist.join(" · ")}</p>` : ""}
          <div class="full"><button class="btn sm" type="submit">Enregistrer</button></div></form></details>`;
  }
  function detailFondation(c, r, d) {
    const f = r.f;
    return `<h2>${esc(f.n)}</h2>
      <div class="idline">${esc(f.u || "")} · ${esc(f.s)} (${f.c}) · Registre du commerce, extrait du ${window.FONDATIONS_DATE || ""} · <a href="https://www.zefix.ch/fr/search/entity/list?name=${encodeURIComponent(f.n)}" target="_blank" rel="noopener">Zefix ${ic("ext")}</a></div>
      <div class="purpose">${esc(r.quote)}</div>
      <div class="h3" style="display:flex;align-items:center;gap:10px">${scoreHtml(r.score)}Pourquoi elle correspond</div>
      <ul class="reasons">${r.reasons.map((x) => `<li><span class="plus">${ic("pluscircle")}</span>${esc(x)}</li>`).join("")}${r.risks.map((x) => `<li><span class="minus">${ic("minuscircle")}</span>${esc(x)}</li>`).join("")}</ul>
      <div class="h3">Domaines du but social</div><div class="tags">${f.d.map((x) => `<span class="tag ${r.common.includes(x) ? "on" : ""}">${esc((E.DOMAINES[x] || { label: x }).label)}</span>`).join("") || '<span class="sub">Non classés</span>'}</div>
      <details style="margin-top:16px"><summary class="sub" style="cursor:pointer">But social complet</summary><p style="margin-top:8px;font-size:13.5px;line-height:1.6">${esc(f.p)}</p></details>
      ${ficheHtml(f.id)}
      ${memoHtml(c, f.id)}
      <div class="actions">${d ? `${statusHtml(d.statut)}<a class="btn primary" href="#/lettre/${d.id}">${ic("file")}Ouvrir la lettre</a>` :
        `<button class="btn primary" data-act="ajouter" data-f="${f.id}">${ic("file")}Rédiger la lettre</button><button class="btn" data-act="ajouter" data-f="${f.id}" data-only="1">${ic("plus")}Ajouter à la campagne</button>`}</div>`;
  }

  function vClientDemandes(c) {
    const ds = demandesOf(c.id).filter((d) => d.statut !== "suggeree").sort((a, b) => new Date(a.echeance || a.envoi || 0) - new Date(b.echeance || b.envoi || 0));
    const body = clientHead(c, "demandes") + `<div class="table-wrap"><table class="t"><thead><tr><th>Fondation</th><th>Échéance</th><th class="r">Demandé</th><th class="r hide-sm">Score</th><th>Statut</th><th></th></tr></thead><tbody>
      ${ds.map((d) => { const f = F(d.fondation); return `<tr><td><div class="name">${esc(f.n)}</div><div class="sub">${esc(f.s)} · ${f.c}</div></td><td class="num">${OUVERTS.has(d.statut) ? dshort(d.echeance) : d.envoi ? "env. " + dshort(d.envoi) : "—"}</td><td class="r num">${E.chf(d.montant)}</td><td class="r num hide-sm">${d.score}</td><td>${statusHtml(d.statut, flapOnce(d.id))}</td><td class="r"><a class="btn sm" href="#/lettre/${d.id}">Lettre</a></td></tr>`; }).join("") || '<tr><td colspan="6"><div class="empty"><b>Pas encore de demande</b>Ouvrez l\'onglet Fondations et choisissez les premières.</div></td></tr>'}
      </tbody></table></div>`;
    return shell("clients", crumbsClient(c, "Demandes"), body);
  }

  function vClientProfil(c) {
    const prof = E.profile(c);
    const body = clientHead(c, "profil") + `<div class="intake"><form class="profile-form" data-form="profil" data-c="${c.id}">
      <div class="field"><label for="p-mission">Mission (une phrase, telle qu'elle figurera dans les lettres)</label><textarea class="input" id="p-mission" name="mission" rows="2">${esc(c.mission)}</textarea></div>
      <div class="field"><label for="p-desc">Description et mots-clés</label><textarea class="input" id="p-desc" name="description" rows="3">${esc(c.description)}</textarea><span class="help">Sert au matching. Plus c'est concret (public, lieu, méthode), meilleur est le classement.</span></div>
      <div class="field"><label for="p-titre">Projet à financer</label><input class="input" id="p-titre" name="titre" value="${esc(c.projet.titre)}"></div>
      <div class="field"><label for="p-res">Résumé du projet</label><textarea class="input" id="p-res" name="resume" rows="3">${esc(c.projet.resume)}</textarea></div>
      <div class="row2"><div class="field"><label for="p-bud">Budget total (CHF)</label><input class="input num" id="p-bud" name="budget" inputmode="numeric" value="${c.projet.budget}"></div><div class="field"><label for="p-mt">Montant type par fondation (CHF)</label><input class="input num" id="p-mt" name="montant" inputmode="numeric" value="${c.projet.montant}"></div></div>
      <div class="row2"><div class="field"><label for="p-ex">À éviter (mots séparés par des virgules)</label><input class="input" id="p-ex" name="exclusions" value="${esc((c.exclusions || []).join(", "))}" placeholder="ex. église, paroisse"><span class="help">Les fondations dont le but contient ces mots sont reléguées.</span></div>
        <div class="field"><label for="p-fi">Exonération fiscale (utilité publique)</label><select class="select" id="p-fi" name="exonere">${[["", "À vérifier"], ["oui", "Oui, exonéré"], ["non", "Non"]].map(([v, l]) => `<option value="${v}" ${c.exonere === v ? "selected" : ""}>${l}</option>`).join("")}</select><span class="help">Beaucoup de fondations ne financent que des organisations exonérées.</span></div></div>
      <div class="field"><label for="p-pr">Preuves (une par ligne)</label><textarea class="input" id="p-pr" name="preuves" rows="3">${esc((c.preuves || []).join("\n"))}</textarea></div>
      <div><button class="btn dark" type="submit">${ic("refresh")}Enregistrer et recalculer le matching</button></div></form>
      <section class="profile panel" style="padding:16px 18px"><h2 class="name" style="font-size:15px;margin-bottom:10px">Ce que Levier en retient</h2><dl>
        <dt>Domaines</dt><dd><div class="tags">${prof.domaines.map((d) => `<span class="tag on">${esc(E.DOMAINES[d].label)}</span>`).join("")}</div></dd>
        <dt>Zone</dt><dd>${esc(c.ville)}, canton ${esc(E.CANTONS[c.canton] || c.canton)}</dd>
        <dt>Langue</dt><dd>${c.langue === "de" ? "Allemand" : "Français"}</dd>
        <dt>Mots porteurs</dt><dd class="sub">${[...prof.kw.keys()].slice(0, 14).join(", ")}</dd>
        <dt>Contact</dt><dd>${esc(c.contact.nom)}, ${esc(c.contact.fonction)}</dd>
        <dt>Site</dt><dd>${c.site ? `<a href="${esc(c.site)}" target="_blank" rel="noopener">${esc(c.site.replace(/^https?:\/\//, ""))}</a>` : "—"}</dd></dl></section></div>`;
    return shell("clients", crumbsClient(c, "Profil"), body);
  }

  const ORGANES = { VD: "Organe vaudois de répartition", GE: "Commission cantonale de répartition (Genève)", FR: "Commission cantonale de répartition (Fribourg)", NE: "Commission neuchâteloise de répartition", VS: "Commission cantonale de répartition (Valais)", JU: "Commission de répartition du Jura" };
  function vClientLoro(c) {
    const r = E.loro(c, 15);
    const body = clientHead(c, "loro") + `<div class="overview" style="grid-template-columns:minmax(280px,340px) 1fr">
      <section class="panel" style="padding:18px 20px"><h2 class="name" style="font-size:16px;margin-bottom:8px">Un canal à ne pas oublier</h2>
        <p style="font-size:13.5px;color:var(--ink-2)">La Loterie Romande reverse l'intégralité de ses bénéfices à des projets d'utilité publique romands. La demande se dépose auprès de l'organe de répartition du canton : <b>${esc(ORGANES[c.canton] || "organe cantonal de répartition")}</b>.</p>
        ${r.list.length ? `<div class="h3">Montants accordés à des projets comparables en 2025</div><div class="stats" style="margin:0"><span class="stat"><b>${E.chf(r.median)}</b> médiane</span><span class="stat">de <b>${E.chf(r.min)}</b> à <b>${E.chf(r.max)}</b></span></div>
        <p class="sub" style="margin-top:12px">Repère pour calibrer la demande : ${r.total} soutiens proches du projet dans le canton ou à l'échelle romande.</p>` : ""}
        <p class="sub" style="margin-top:12px">Source : Loterie Romande, Répartition des bénéfices 2025 (soutien-loro.ch), extraite le 21.10.2026.</p></section>
      <section class="panel"><div class="panel-h"><h2>Soutiens comparables en 2025</h2><span class="muted">${esc(E.CANTONS[c.canton] || c.canton)} et Suisse romande</span></div>
        ${r.list.length ? `<div style="overflow:auto"><table class="t"><thead><tr><th>Bénéficiaire</th><th class="hide-sm">Type de soutien</th><th class="r">Montant</th></tr></thead><tbody>${r.list.map((x) => `<tr><td><div class="name">${esc(x.n)}</div><div class="sub">${esc(x.l || "")}${x.c === "CH-R" ? " · projet romand" : ""}</div></td><td class="hide-sm sub">${esc(x.t || "—")}</td><td class="r num">${E.chf(x.m)}</td></tr>`).join("")}</tbody></table></div>`
          : '<div class="empty"><b>Aucun soutien comparable trouvé</b>Complétez la description du client (publics, activités, lieux) dans l\'onglet Profil.</div>'}</section></div>`;
    return shell("clients", crumbsClient(c, "Loterie Romande"), body);
  }
  function vClientJournal(c) {
    const j = S.journal.filter((x) => x.client === c.id);
    const body = clientHead(c, "journal") + `<div class="panel">${j.length ? `<ul class="todo">${j.map((x) => `<li><span class="dot"></span><span><b>${esc(x.txt)}</b><span class="sub">${new Date(x.t).toLocaleString("fr-CH")}</span></span><span></span></li>`).join("")}</ul>` : '<div class="empty"><b>Journal vide</b>Chaque changement de statut, validation ou envoi s\'inscrit ici.</div>'}</div>`;
    return shell("clients", crumbsClient(c, "Journal"), body);
  }

  const LETTRE = { lang: "fr", ton: "sobre" };
  async function lettreIA(did, btn) {
    const d = S.demandes.find((x) => x.id === did), c = client(d.client), f = F(d.fondation), be = botEval(c.id, f.id), fiche = ENR[f.id];
    const L = E.letter(c, f.id, d, Object.assign({}, LETTRE, be && be.citation_verifiee ? { quote: be.citation } : {}));
    const langue = { fr: "français", de: "allemand", en: "anglais" }[LETTRE.lang];
    const system = `Tu rédiges, pour l'agence suisse Levier, une lettre de demande de soutien adressée à une fondation, au nom du client. Langue : ${langue}${LETTRE.lang === "de" ? " (orthographe suisse, ss au lieu de ß)" : ""}. Ton ${LETTRE.ton}, sobre, précis, sans superlatifs ni formules creuses. 300 à 420 mots. Règles : n'invente AUCUN fait, chiffre, date ou partenaire ; utilise seulement les faits fournis. Relie explicitement le projet au but statutaire cité (cite-le entre guillemets). Structure : objet, appel, lien avec le but de la fondation, le client et sa légitimité, le projet, le budget et la demande chiffrée, l'impact et le suivi promis, la formule de politesse, la signature. Réponds uniquement avec la lettre, en texte brut, paragraphes séparés par une ligne vide.`;
    const prompt = JSON.stringify({ client: { nom: c.nom, type: c.type, ville: c.ville, canton: c.canton, fondee: c.fondee, mission: c.mission, description: c.description, preuves: c.preuves, contact: c.contact },
      projet: c.projet, montant_demande: d.montant, fondation: { nom: f.n, siege: f.s, but_statutaire: f.p, citation_retenue: L.match.quote, raisons: L.match.reasons, risques: L.match.risks },
      angle_conseille: be ? be.angle_lettre : null, fiche_pratique: fiche ? { modalites: fiche.demande.modalites, montants: fiche.demande.montants, criteres: fiche.demande.criteres } : null,
      brouillon_par_regles: [L.objet, L.salut, ...L.paras].join("\n\n") }, null, 1);
    btn.disabled = true; const old = btn.innerHTML; btn.textContent = "Rédaction en cours…";
    try {
      const r = await STORE.ia({ system, prompt, client: c.id, usage: "lettre " + f.n, temperature: 0.5 });
      const html = r.texte.trim().split(/\n\s*\n/).map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("");
      d.lettre = { html, lang: LETTRE.lang, ton: LETTRE.ton, ia: r.modele }; save(); rerender(); toast("Lettre rédigée par " + (r.modele || "l'IA").split("/").pop() + " : relisez-la avant l'envoi");
    } catch (e) { btn.disabled = false; btn.innerHTML = old; toast(e.data && e.data.erreur ? e.data.erreur : "IA indisponible : " + e.message); }
  }
  function vLettre(id) {
    const d = S.demandes.find((x) => x.id === id);
    if (!d) return vIntrouvable();
    const c = client(d.client), f = F(d.fondation);
    const be = botEval(c.id, f.id);
    const L = E.letter(c, f.id, d, Object.assign({}, LETTRE, be && be.citation_verifiee ? { quote: be.citation } : {}));
    const html = d.lettre && d.lettre.lang === LETTRE.lang && d.lettre.ton === LETTRE.ton ? d.lettre.html : renderLetter(L);
    const j = daysTo(d.echeance);
    const next = { qualifier: "redaction", redaction: "validation", validation: "prete", prete: "envoyee", envoyee: "relancee", relancee: "accordee" }[d.statut];
    const nextLabel = { redaction: "Passer en rédaction", validation: "Envoyer au client pour validation", prete: "Marquer validée par le client", envoyee: "Marquer comme envoyée", relancee: "Marquer comme relancée", accordee: "Enregistrer un accord" }[next];
    const body = `<div class="page-head"><div><h1>Lettre à ${esc(f.n)}</h1><p class="lede" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">${esc(c.nom)} · ${E.chf(d.montant)} ${OUVERTS.has(d.statut) ? `· dépôt le <input class="input" type="date" data-ech="${d.id}" value="${(d.echeance || "").slice(0, 10)}" style="height:28px;width:auto" aria-label="Date de dépôt">${j !== null && j <= 3 ? " <b style='color:var(--accent-ink)'>urgent</b>" : ""}` : ""} ${statusHtml(d.statut, flapOnce(d.id))}</p></div>
        <div class="head-actions">${next ? `<button class="btn primary" data-act="statut" data-d="${d.id}" data-s="${next}">${ic(next === "validation" ? "send" : "check")}${nextLabel}</button>` : ""}${d.statut !== "refusee" && d.statut !== "accordee" ? `<select class="select" data-refus="${d.id}" aria-label="Enregistrer un refus"><option value="">Refus reçu…</option>${["Hors but de la fondation", "Budget annuel épuisé", "Zone géographique", "Dossier incomplet", "Montant trop élevé", "Sans motif"].map((x) => `<option>${x}</option>`).join("")}</select>` : d.motif ? `<span class="tag">Motif : ${esc(d.motif)}</span>` : ""}</div></div>
      <div class="letter-layout"><div>
        <div class="letter-tools no-print">
          <div class="seg" role="group" aria-label="Langue">${["fr", "de", "en"].map((l) => `<button data-act="lang" data-v="${l}" aria-pressed="${LETTRE.lang === l}">${l.toUpperCase()}</button>`).join("")}</div>
          <div class="seg" role="group" aria-label="Ton">${[["sobre", "Sobre"], ["chaleureux", "Chaleureux"]].map(([v, l]) => `<button data-act="ton" data-v="${v}" aria-pressed="${LETTRE.ton === v}">${l}</button>`).join("")}</div>
          <button class="btn sm ghost" data-act="regen" data-d="${d.id}">${ic("refresh")}Régénérer</button>
          ${SERVEUR() ? `<button class="btn sm ${STORE.st.ia ? "dark" : ""}" data-act="ia-lettre" data-d="${d.id}" ${STORE.st.ia ? "" : 'disabled title="IA non configurée sur le serveur (INFOMANIAK_TOKEN)"'}>${ic("send")}Rédiger avec l'IA</button>` : ""}
          <span class="grow" style="flex:1"></span>
          <button class="btn sm" data-act="copy">${ic("copy")}Copier</button><button class="btn sm" data-act="word" data-d="${d.id}">${ic("file")}Word</button><button class="btn sm" data-act="print">${ic("print")}PDF</button></div>
        <article class="sheet">
          <div class="from">${esc(c.nom)}<br>${esc(c.contact.nom)}, ${esc(c.contact.fonction)}<br>${esc(c.ville)}</div>
          <div class="to">${esc(f.n)}<br>${ENR[f.id] && ENR[f.id].contact && ENR[f.id].contact.adresse ? esc(ENR[f.id].contact.adresse).replace(/,\s*/g, "<br>") : esc(f.s)}</div>
          <div class="sub" style="margin-bottom:22px;text-align:right">${esc(c.ville)}, le ${E.fmtDate(today)}</div>
          <div class="letter-body" id="letter" contenteditable="true" spellcheck="true" aria-label="Texte de la lettre, modifiable" data-d="${d.id}">${html}</div>
        </article></div>
        <aside class="margin" aria-label="Sources de la lettre">
          <div class="box"><h3>But social cité</h3><p class="cite">${esc(L.match.quote)}</p><p class="sub" style="margin-top:8px">Registre du commerce · ${esc(f.u || "")}</p></div>
          ${ENR[f.id] ? `<div class="box"><h3>Comment déposer</h3><ul>${[ENR[f.id].demande.modalites, ...(ENR[f.id].demande.delais || []).map((x) => "Délai : " + x), ENR[f.id].demande.montants && "Montants : " + ENR[f.id].demande.montants, ...(ENR[f.id].demande.documents_requis || []).slice(0, 4)].filter(Boolean).map((x) => `<li>${ic("check")}<span>${esc(x)}</span></li>`).join("")}</ul>${ENR[f.id].demande.url_page_demande ? `<p style="margin-top:8px"><a class="btn sm" href="${esc(ENR[f.id].demande.url_page_demande)}" target="_blank" rel="noopener">${ic("ext")}Page de demande</a></p>` : ""}</div>` : ""}
          ${be ? `<div class="box"><h3>Angle conseillé par le bot · score ${be.score}</h3><p style="font-size:13.5px">${esc(be.angle_lettre)}</p></div>` : ""}
          ${(() => { const m = memo(f.id); return m.delai || m.montant || m.modalites || m.notes ? `<div class="box"><h3>Mémoire de l'agence</h3><ul>${[m.delai && "Délai : " + m.delai, m.montant && "Montant habituel : " + m.montant, m.modalites && "Modalités : " + m.modalites, m.notes].filter(Boolean).map((x) => `<li>${ic("check")}<span>${esc(x)}</span></li>`).join("")}</ul></div>` : ""; })()}
          <div class="box"><h3>Angles retenus</h3><ul>${L.angles.slice(1).map((a) => `<li>${ic("check")}<span class="angle"><b>${esc(a.k)}</b> : ${esc(a.v)}</span></li>`).join("")}</ul></div>
          <div class="box"><h3>Faits du client utilisés</h3><ul>${[c.projet.titre, ...(c.preuves || [])].slice(0, 4).map((p) => `<li>${ic("check")}<span>${esc(p)}</span></li>`).join("")}</ul></div>
          <div class="box"><h3>Avant l'envoi</h3><ul>${L.verif.map((v) => `<li><span style="color:var(--accent)">${ic("alert")}</span><span>${esc(v)}</span></li>`).join("")}</ul></div>
          <p class="sub">Brouillon généré par règles, à partir du profil du client et du but de la fondation. Il se modifie directement ; les changements sont gardés.</p>
        </aside></div>`;
    return shell("demandes", `<a href="#/clients/${c.id}/demandes">${esc(c.nom)}</a><span>/</span><b>Lettre</b>`, body);
  }
  function renderLetter(L) {
    return `<p class="obj">${esc(L.objet)}</p><p>${esc(L.salut)}</p>${L.paras.map((p) => `<p>${esc(p)}</p>`).join("")}<p>${L.signature.map(esc).join("<br>")}</p><p class="sub" style="font-family:var(--ui);font-size:13px">Annexes : ${L.annexes.map(esc).join(" · ")}</p>`;
  }

  const FX = { q: "", canton: "", type: "donatrice_probable", dom: "", sv: "", n: 80 };
  let SORTED = null;
  function vFondations() {
    const all = SORTED || (SORTED = [...(window.FONDATIONS || [])].sort((a, b) => (E.ROMANDS.has(b.c) - E.ROMANDS.has(a.c)) || a.n.localeCompare(b.n, "fr")));
    const q = E.norm(FX.q);
    const list = all.filter((f) => (!FX.canton || f.c === FX.canton) && (!FX.type || f.t === FX.type) && (!FX.dom || f.d.includes(FX.dom)) && (!FX.sv || (FX.sv === "asf" ? f.sv === "ASF" : (f.st || []).some((x) => /Soutien financier/.test(x)))) && (!q || E.norm(f.n + " " + f.p).includes(q)));
    const cantons = Object.keys(E.CANTONS).sort();
    const body = `<div class="page-head"><div><h1>Fondations</h1><p class="lede">${(window.FONDATIONS || []).length.toLocaleString("fr-CH").replace(/ |\s/g, "'")} fondations actives du registre du commerce (extrait du ${window.FONDATIONS_DATE || "—"}), sans les fondations de prévoyance. Classement par mots-clés, à valider.</p></div></div>
      <div class="list-tools" style="border:1px solid var(--line);border-radius:14px 14px 0 0;border-bottom:0">
        <input class="input" style="flex:1;min-width:200px" type="search" placeholder="Nom ou mot du but social (ex. enfance, Riviera, bourse)" value="${esc(FX.q)}" data-fx="q" aria-label="Rechercher">
        <select class="select" data-fx="canton" aria-label="Canton"><option value="">Tous cantons</option>${cantons.map((x) => `<option value="${x}" ${FX.canton === x ? "selected" : ""}>${x} · ${E.CANTONS[x]}</option>`).join("")}</select>
        <select class="select" data-fx="type" aria-label="Type"><option value="">Tous types</option>${[["donatrice_probable", "Donatrices probables"], ["mixte", "Mixtes"], ["operationnelle", "Opérationnelles"], ["indetermine", "Indéterminées"]].map(([v, l]) => `<option value="${v}" ${FX.type === v ? "selected" : ""}>${l}</option>`).join("")}</select>
        <select class="select" data-fx="dom" aria-label="Domaine"><option value="">Tous domaines</option>${Object.entries(E.DOMAINES).map(([v, o]) => `<option value="${v}" ${FX.dom === v ? "selected" : ""}>${o.label}</option>`).join("")}</select>
        <select class="select" data-fx="sv" aria-label="Autorité de surveillance"><option value="">Toutes surveillances</option><option value="asf" ${FX.sv === "asf" ? "selected" : ""}>Surveillance fédérale (ASF)</option><option value="soutien" ${FX.sv === "soutien" ? "selected" : ""}>As-So : soutien financier</option></select></div>
      <div class="table-wrap" style="border-radius:0 0 14px 14px"><table class="t"><thead><tr><th>Fondation</th><th class="hide-sm">But social</th><th>Canton</th><th class="hide-sm">Domaines</th></tr></thead><tbody>
      ${list.slice(0, FX.n).map((f) => `<tr><td style="min-width:220px"><div class="name">${esc(f.n)}</div><div class="sub">${esc(f.s)}</div></td><td class="hide-sm"><div class="sub" style="max-width:62ch;color:var(--ink)">${esc(f.p.length > 240 ? f.p.slice(0, 240).replace(/\s+\S*$/, "") + " …" : f.p)}</div></td><td>${f.c}</td><td class="hide-sm"><div class="tags">${ENR[f.id] && ENR[f.id].site_web ? `<a class="tag" href="${esc(ENR[f.id].site_web)}" target="_blank" rel="noopener">site</a>` : ""}${f.sv ? '<span class="tag">ASF</span>' : ""}${(f.st || []).some((x) => /Soutien financier/.test(x)) ? '<span class="tag on">Soutien financier</span>' : ""}${f.d.slice(0, 3).map((x) => `<span class="tag">${esc((E.DOMAINES[x] || { label: x }).label)}</span>`).join("")}</div></td></tr>`).join("") || '<tr><td colspan="4"><div class="empty"><b>Aucun résultat</b>Élargissez les filtres ou cherchez un autre mot.</div></td></tr>'}
      </tbody></table></div>
      <p class="sub" style="margin-top:12px">${Math.min(FX.n, list.length)} sur ${list.length.toLocaleString("fr-CH").replace(/ |\s/g, "'")} résultats${list.length > FX.n ? ` · <button class="btn sm" data-act="plus">Afficher 80 de plus</button>` : ""}</p>`;
    return shell("fondations", "<span>Registre du commerce · LINDAS</span>", body);
  }

  const NV = { url: "", texte: "", nom: "", type: "association", canton: "VD", ville: "", titre: "", montant: 10000, budget: 50000, res: null, prof: null };
  function vNouveau() {
    const r = NV.res;
    const body = `<div class="page-head"><div><h1>Nouveau client</h1><p class="lede">Collez le site du client et sa présentation. Levier en tire un profil et classe les fondations qui ont le plus de chances de le financer.</p></div></div>
      <div class="intake"><form data-form="nouveau">
        <div class="field"><label for="n-url">Site web du client</label><div class="urlbar"><input id="n-url" name="url" type="url" placeholder="https://www.association.ch" value="${esc(NV.url)}"><button class="btn dark" type="button" data-act="lire">${ic("link")}Lire le site</button></div><span class="help" id="lire-msg">Le navigateur lit la page d'accueil quand le site l'autorise. Sinon, collez le texte de la page « À propos » ci-dessous, ou lancez <code>scripts/analyser_site.py</code>.</span></div>
        <div class="field"><label for="n-txt">Présentation du client</label><textarea class="input" id="n-txt" name="texte" rows="6" placeholder="Mission, publics, lieux, projets, chiffres clés…">${esc(NV.texte)}</textarea></div>
        <div class="row2"><div class="field"><label for="n-nom">Nom</label><input class="input" id="n-nom" name="nom" value="${esc(NV.nom)}" required></div>
          <div class="field"><label for="n-type">Type</label><select class="select" id="n-type" name="type">${["association", "startup", "etudiant", "consultant"].map((t) => `<option value="${t}" ${NV.type === t ? "selected" : ""}>${typeLabel(t)}</option>`).join("")}</select></div></div>
        <div class="row2"><div class="field"><label for="n-ct">Canton</label><select class="select" id="n-ct" name="canton">${Object.keys(E.CANTONS).sort().map((x) => `<option value="${x}" ${NV.canton === x ? "selected" : ""}>${x} · ${E.CANTONS[x]}</option>`).join("")}</select></div>
          <div class="field"><label for="n-v">Localité</label><input class="input" id="n-v" name="ville" value="${esc(NV.ville)}"></div></div>
        <div class="field"><label for="n-t">Projet à financer</label><input class="input" id="n-t" name="titre" value="${esc(NV.titre)}" placeholder="Ex. Un camp d'été pour 40 enfants"></div>
        <div class="row2"><div class="field"><label for="n-b">Budget total (CHF)</label><input class="input num" id="n-b" name="budget" inputmode="numeric" value="${NV.budget}"></div><div class="field"><label for="n-m">Montant par fondation (CHF)</label><input class="input num" id="n-m" name="montant" inputmode="numeric" value="${NV.montant}"></div></div>
        <div class="botcmd"><div class="h3" style="margin:0 0 6px">Lancer le bot IA (recherche complète, 3 à 6 min)</div>
          <p class="sub" style="margin-bottom:8px">Le bot lit le site, établit les critères, cherche dans les ${(window.FONDATIONS || []).length.toLocaleString("fr-CH").replace(/\u202f|\s/g, "'")} fondations et évalue les meilleures. Le client apparaît ensuite ici avec son classement.</p>
          <pre id="botcmd">cd "CONSULTING /Levier/scripts" && python3.12 bot_fondations.py --url ${esc(NV.url || "https://site-du-client.ch")} --nom "${esc(NV.nom || "Nom du client")}" --canton ${esc(NV.canton)} --type ${esc(NV.type)}</pre>
          <button class="btn sm" type="button" data-act="copycmd">${ic("copy")}Copier la commande</button></div>
        <div style="display:flex;gap:8px"><button class="btn primary" type="submit">${ic("search")}Analyser et classer</button>${r ? `<button class="btn" type="button" data-act="creer">${ic("plus")}Créer le client avec les 8 premières</button>` : ""}</div></form>
      <section class="panel" aria-live="polite">${r ? `<div class="panel-h"><h2>${r.length} fondations pertinentes</h2><span class="muted">${NV.prof.domaines.map((d) => E.DOMAINES[d].label).join(" · ") || "domaines non détectés"}</span></div>
        ${r.slice(0, 12).map((m) => `<div class="match" style="cursor:default">${scoreHtml(m.score)}<span><span class="name">${esc(m.f.n)}</span><span class="sub" style="display:block">${esc(m.f.s)} · ${m.f.c}</span><span class="cite" style="display:block;margin-top:4px">${esc(m.quote)}</span><span class="sub" style="display:block;margin-top:4px">${esc(m.reasons.slice(0, 2).join(" · "))}${m.risks[0] ? " · " + esc(m.risks[0]) : ""}</span></span></div>`).join("")}`
        : `<div class="empty"><b>Le classement apparaîtra ici</b>Il cite, pour chaque fondation, la phrase de son but qui rejoint la mission du client.</div>`}</section></div>`;
    return shell("nouveau", "<span>Analyse et matching</span>", body);
  }

  function vPortail(id) {
    const c = client(id);
    if (!c) return vIntrouvable();
    const ds = demandesOf(c.id).filter((d) => d.statut !== "suggeree" && d.statut !== "qualifier");
    const ob = ds.reduce((t, d) => t + (d.obtenu || 0), 0);
    const aValider = ds.filter((d) => d.statut === "validation");
    const etape = ds.some((d) => ["accordee", "refusee"].includes(d.statut)) ? 4 : ds.some((d) => ["envoyee", "relancee"].includes(d.statut)) ? 3 : aValider.length ? 2 : 1;
    const pub = { redaction: "En préparation", validation: "À valider par vous", prete: "Validée, prête à l'envoi", envoyee: "Envoyée", relancee: "Relancée", accordee: "Accordée", refusee: "Refusée" };
    return `<div class="portal"><div class="portal-top"><span class="brand">${MARK}<b>levier<span>.</span></b></span><span class="ro">${ic("lock")}<span class="hide-sm">Espace de ${esc(c.nom)} · </span>consultation et validation</span></div>
      <h1>Votre recherche de fonds</h1><p class="lede" style="font-size:15px;margin-top:6px">${esc(c.projet.titre)} · objectif ${E.chf(c.projet.objectif)} · ${E.chf(ob)} obtenus à ce jour</p>
      <div class="steps" aria-label="Avancement">${["Analyse", "Carte des financeurs", "Rédaction et validation", "Envois et relances", "Réponses"].map((s, i) => `<div class="${i < etape ? "done" : i === etape ? "now" : ""}">${s}</div>`).join("")}</div>
      ${aValider.map((d) => `<div class="validate"><p><b>Une lettre attend votre validation</b><br><span class="sub">${esc(F(d.fondation).n)} · ${E.chf(d.montant)} · dépôt prévu le ${dlong(d.echeance)}</span></p><a class="btn" href="#/portail/${c.id}/lettre/${d.id}">${ic("eye")}Lire la lettre</a><button class="btn primary" data-act="valider" data-d="${d.id}">${ic("check")}Je valide</button></div>`).join("")}
      <div class="panel"><ul class="preqs">${ds.map((d) => { const f = F(d.fondation); return `<li class="preq"><span class="name">${esc(f.n)}</span><span class="num">${E.chf(d.montant)}</span><span class="status" data-s="${d.statut}">${pub[d.statut] || SL[d.statut]}</span><span class="cite two">${esc(E.explain(c, f.id).quote)}</span></li>`; }).join("") || '<li class="empty"><b>Votre carte des financeurs est en préparation</b>Vous serez averti·e dès que les premières lettres seront prêtes.</li>'}</ul></div>
      <p class="sub" style="margin-top:24px">Une question ? ${esc(c.contact ? "Votre conseiller : Alexandre Cazes, Levier" : "")} · Honoraires fixes, jamais de pourcentage sur les fonds obtenus.</p>
      <p class="sub no-print" style="margin-top:8px"><a href="#/clients/${c.id}">Retour à l'espace agence</a> (lien visible en démonstration seulement)</p></div>`;
  }
  function vPortailLettre(cid, did) {
    const c = client(cid), d = S.demandes.find((x) => x.id === did);
    if (!c || !d) return vIntrouvable();
    const L = E.letter(c, d.fondation, d, LETTRE);
    return `<div class="portal"><div class="portal-top"><span class="brand">${MARK}<b>levier<span>.</span></b></span><span class="ro">${ic("lock")}Consultation et validation</span></div>
      <p><a href="#/portail/${c.id}" style="display:inline-flex;gap:6px;align-items:center"><svg class="i" viewBox="0 0 24 24" aria-hidden="true" style="transform:scaleX(-1)">${P.arrow}</svg>Votre recherche de fonds</a></p><h1 style="font-size:28px;margin:14px 0 18px">Lettre à ${esc(F(d.fondation).n)}</h1>
      <article class="sheet"><div class="letter-body">${d.lettre ? d.lettre.html : renderLetter(L)}</div></article>
      ${d.statut === "validation" ? `<div class="validate" style="margin-top:20px"><p><b>Cette lettre vous convient ?</b><br><span class="sub">Si quelque chose doit changer, répondez simplement à notre dernier e-mail.</span></p><button class="btn primary" data-act="valider" data-d="${d.id}">${ic("check")}Je valide</button></div>` : ""}</div>`;
  }
  function vIntrouvable() { return shell("", "<b>Introuvable</b>", `<div class="empty"><b>Cette page n'existe pas ou plus</b><a class="btn" href="#/">Revenir à l'aperçu</a></div>`); }

  // ---------- Routeur ----------
  function route() {
    const h = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const root = $("#root");
    let html;
    if (!h.length) html = vApercu();
    else if (h[0] === "demandes") html = vDemandes();
    else if (h[0] === "clients" && !h[1]) html = vClients();
    else if (h[0] === "clients") { const c = client(h[1]); if (!c) html = vIntrouvable();
      else if (!h[2] || h[2] === "fondations") html = vClientFondations(c, h[3]);
      else if (h[2] === "demandes") html = vClientDemandes(c); else if (h[2] === "profil") html = vClientProfil(c); else if (h[2] === "loro") html = vClientLoro(c); else html = vClientJournal(c); }
    else if (h[0] === "fondations") html = vFondations();
    else if (h[0] === "nouveau") html = vNouveau();
    else if (h[0] === "lettre") html = vLettre(h[1]);
    else if (h[0] === "portail") html = h[2] === "lettre" ? vPortailLettre(h[1], h[3]) : vPortail(h[1]);
    else html = vIntrouvable();
    root.innerHTML = html;
    document.title = (document.querySelector("h1")?.textContent || "Levier") + " · Levier";
    if (!ROUTE_SAME) window.scrollTo(0, 0);
    ROUTE_SAME = false;
  }
  let ROUTE_SAME = false;
  const rerender = () => { ROUTE_SAME = true; route(); };

  // ---------- Événements ----------
  document.addEventListener("click", async (e) => {
    const row = e.target.closest("[data-href]");
    const a = e.target.closest("[data-act]");
    if (row && !a && !e.target.closest("a,button:not([data-href])")) { location.hash = row.dataset.href; return; }
    if (!a) return;
    const act = a.dataset.act;
    if (act === "palette") openPalette();
    else if (act === "theme") { const r = document.documentElement, dark = r.dataset.theme ? r.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; r.dataset.theme = dark ? "light" : "dark"; try { localStorage.setItem("levier.theme", r.dataset.theme); } catch (er) { /* ignore */ } }
    else if (act === "seuil") { UI.min = UI.min > 30 ? 20 : 45; rerender(); }
    else if (act === "mode") { UI.mode = a.dataset.v; rerender(); }
    else if (act === "logout") STORE.logout();
    else if (act === "ia-lettre") lettreIA(a.dataset.d, a);
    else if (act === "ecarter") { UI.ecarter = !UI.ecarter; rerender(); }
    else if (act === "copycmd") { try { await navigator.clipboard.writeText($("#botcmd").innerText); toast("Commande copiée : collez-la dans le Terminal"); } catch (er) { toast("Sélectionnez la commande pour la copier"); } }
    else if (act === "plus") { FX.n += 80; rerender(); }
    else if (act === "ajouter") {
      const cid = location.hash.split("/")[2], c = client(cid), fid = a.dataset.f, m = E.explain(c, fid);
      const d = { id: cid + "-" + fid, client: cid, fondation: fid, statut: a.dataset.only ? "qualifier" : "redaction", montant: c.projet.montant, obtenu: 0, echeance: inDays(21).toISOString(), envoi: null, score: m.score, lettre: null };
      S.demandes.push(d); S.journal.unshift({ t: new Date().toISOString(), client: cid, txt: `${F(fid).n} ajoutée à la campagne` }); save();
      if (a.dataset.only) { toast("Ajoutée à la campagne"); rerender(); } else location.hash = "#/lettre/" + d.id;
    }
    else if (act === "statut") { const d = S.demandes.find((x) => x.id === a.dataset.d); setStatut(d, a.dataset.s); toast(SL[a.dataset.s]); rerender(); }
    else if (act === "valider") { const d = S.demandes.find((x) => x.id === a.dataset.d); setStatut(d, "prete", "validée par le client"); toast("Merci, la lettre est validée."); rerender(); }
    else if (act === "lang" || act === "ton") { LETTRE[act] = a.dataset.v; rerender(); }
    else if (act === "regen") { const d = S.demandes.find((x) => x.id === a.dataset.d); d.lettre = null; save(); rerender(); toast("Lettre régénérée"); }
    else if (act === "copy") { const t = $("#letter").innerText; try { await navigator.clipboard.writeText(t); toast("Lettre copiée"); } catch (er) { toast("Copie impossible : sélectionnez le texte"); } }
    else if (act === "print") window.print();
    else if (act === "word") {
      const d = S.demandes.find((x) => x.id === a.dataset.d), f = F(d.fondation), c = client(d.client);
      const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><style>body{font-family:Georgia,serif;font-size:12pt;line-height:1.5}p{margin:0 0 10pt}</style></head><body>${document.querySelector(".sheet").innerHTML}</body></html>`;
      const url = URL.createObjectURL(new Blob(["\ufeff", html], { type: "application/msword" }));
      const el = document.createElement("a"); el.href = url; el.download = `${new Date().toISOString().slice(0, 10)}_Lettre_${c.nom}_${f.n}.doc`.replace(/[\/:*?"<>|]+/g, "-"); el.click(); setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast("Lettre exportée pour Word");
    }
    else if (act === "lire") lireSite();
    else if (act === "creer") creerClient();
  });
  document.addEventListener("input", (e) => {
    const t = e.target;
    if (t.id === "letter") { const d = S.demandes.find((x) => x.id === t.dataset.d); d.lettre = { html: t.innerHTML, lang: LETTRE.lang, ton: LETTRE.ton }; clearTimeout(t._s); t._s = setTimeout(save, 400); }
    if (t.dataset.fx === "q") { FX.q = t.value; FX.n = 80; clearTimeout(t._q); t._q = setTimeout(() => { rerender(); const i = $('[data-fx="q"]'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }, 220); }
  });
  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.refus && t.value) { const d = S.demandes.find((x) => x.id === t.dataset.refus); d.motif = t.value; setStatut(d, "refusee", t.value); toast("Refus enregistré : " + t.value); rerender(); return; }
    if (t.dataset.ech) { const d = S.demandes.find((x) => x.id === t.dataset.ech); if (t.value) { d.echeance = new Date(t.value + "T00:00:00").toISOString(); save(); toast("Date de dépôt enregistrée"); rerender(); } return; }
    if (t.dataset.fx && t.dataset.fx !== "q") { FX[t.dataset.fx] = t.value; FX.n = 80; rerender(); }
    if (t.dataset.ui) { UI[t.dataset.ui] = t.value; rerender(); }
  });
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    const fm = e.target, data = Object.fromEntries(new FormData(fm));
    if (fm.dataset.form === "memo") { (S.memo || (S.memo = {}))[fm.dataset.f] = data; save(); toast("Mémoire de l'agence enregistrée"); rerender(); return; }
    if (fm.dataset.form === "profil") {
      const c = client(fm.dataset.c);
      c.mission = data.mission; c.description = data.description; c.projet.titre = data.titre; c.projet.resume = data.resume;
      c.projet.budget = +String(data.budget).replace(/\D/g, "") || c.projet.budget; c.projet.montant = +String(data.montant).replace(/\D/g, "") || c.projet.montant;
      c.preuves = data.preuves.split("\n").map((x) => x.trim()).filter(Boolean); c.domaines = null;
      c.exclusions = (data.exclusions || "").split(",").map((x) => x.trim()).filter(Boolean); c.exonere = data.exonere; save(); toast("Profil enregistré, matching recalculé"); location.hash = `#/clients/${c.id}/fondations`;
    }
    if (fm.dataset.form === "nouveau") {
      Object.assign(NV, data, { budget: +String(data.budget).replace(/\D/g, "") || 0, montant: +String(data.montant).replace(/\D/g, "") || 0 });
      const c = draftClient();
      const { res, prof } = E.match(c, { limit: 60 });
      NV.res = res; NV.prof = prof; rerender();
    }
  });
  function draftClient() {
    return { id: "c" + Date.now().toString(36), nom: NV.nom || "Nouveau client", type: NV.type, canton: NV.canton, ville: NV.ville || E.CANTONS[NV.canton], langue: "fr", site: NV.url,
      mission: (NV.texte || "").split(/(?<=[.!?])\s/)[0] || NV.titre, description: NV.texte, domaines: null,
      projet: { titre: NV.titre || "Projet à préciser", resume: "", budget: NV.budget, montant: NV.montant, objectif: NV.montant * 4 }, preuves: [], contact: { nom: "À compléter", fonction: "" }, acces: false };
  }
  function creerClient() {
    const c = draftClient(); S.clients.push(c);
    NV.res.slice(0, 8).forEach((m) => S.demandes.push({ id: c.id + "-" + m.f.id, client: c.id, fondation: m.f.id, statut: "qualifier", montant: c.projet.montant, obtenu: 0, echeance: inDays(28).toISOString(), envoi: null, score: m.score, lettre: null }));
    S.journal.unshift({ t: new Date().toISOString(), client: c.id, txt: "Client créé, 8 fondations à qualifier" }); save();
    Object.assign(NV, { url: "", texte: "", nom: "", titre: "", res: null, prof: null });
    location.hash = `#/clients/${c.id}/profil`; toast("Client créé : complétez son profil");
  }
  async function lireSite() {
    const url = $("#n-url").value.trim(), msg = $("#lire-msg");
    if (!/^https?:\/\//.test(url)) { msg.textContent = "Saisissez une adresse complète, qui commence par https://"; msg.style.color = "var(--accent-ink)"; return; }
    NV.url = url; msg.textContent = "Lecture en cours…"; msg.style.color = "";
    try {
      const r = await fetch(url, { mode: "cors" }); const html = await r.text();
      const doc = new DOMParser().parseFromString(html, "text/html"); doc.querySelectorAll("script,style,nav,footer,noscript").forEach((n) => n.remove());
      const txt = (doc.querySelector("main") || doc.body).innerText.replace(/\s+/g, " ").trim().slice(0, 3000);
      NV.texte = txt; NV.nom = NV.nom || (doc.title || "").split(/[|·–-]/)[0].trim(); rerender(); toast("Page d'accueil lue");
    } catch (er) {
      msg.innerHTML = "Ce site ne se laisse pas lire depuis le navigateur (protection CORS). Collez le texte de sa page « À propos », ou lancez <code>python3.12 scripts/analyser_site.py " + esc(url) + "</code>.";
      msg.style.color = "var(--accent-ink)";
    }
  }

  // ---------- Palette ⌘K ----------
  let PAL = null;
  function openPalette() {
    if (!PAL) { PAL = document.createElement("div"); PAL.className = "overlay"; PAL.innerHTML = `<div class="palette" role="dialog" aria-modal="true" aria-label="Recherche"><input type="text" placeholder="Client, fondation, action…" aria-label="Rechercher"><ul role="listbox"></ul></div>`; document.body.appendChild(PAL);
      PAL.addEventListener("click", (e) => { if (e.target === PAL) closePalette(); const li = e.target.closest("li[data-href]"); if (li) { location.hash = li.dataset.href; closePalette(); } });
      const inp = $("input", PAL); inp.addEventListener("input", palRender);
      inp.addEventListener("keydown", (e) => { const items = [...PAL.querySelectorAll("li[data-href]")], i = items.findIndex((x) => x.getAttribute("aria-selected") === "true");
        if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); const n = (i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length; items.forEach((x, j) => x.setAttribute("aria-selected", j === n)); items[n]?.scrollIntoView({ block: "nearest" }); }
        if (e.key === "Enter" && items[i]) { location.hash = items[i].dataset.href; closePalette(); }
        if (e.key === "Escape") closePalette(); }); }
    PAL.classList.add("open"); const inp = $("input", PAL); inp.value = ""; palRender(); inp.focus();
  }
  function closePalette() { PAL && PAL.classList.remove("open"); }
  function palRender() {
    const q = E.norm($("input", PAL).value.trim());
    const acts = [["#/nouveau", "Nouveau client", "plus"], ["#/", "Aperçu", "home"], ["#/demandes", "Demandes", "cols"], ["#/fondations", "Explorer les fondations", "landmark"]].filter((x) => !q || E.norm(x[1]).includes(q));
    const cl = S.clients.filter((c) => !q || E.norm(c.nom).includes(q)).slice(0, 6);
    const fo = q.length > 2 ? (window.FONDATIONS || []).filter((f) => E.norm(f.n).includes(q)).slice(0, 8) : [];
    let html = "";
    if (acts.length) html += '<li class="grp" aria-hidden="true">Actions</li>' + acts.map((x) => `<li data-href="${x[0]}" role="option">${ic(x[2])}${x[1]}</li>`).join("");
    if (cl.length) html += '<li class="grp" aria-hidden="true">Clients</li>' + cl.map((c) => `<li data-href="#/clients/${c.id}" role="option">${ic("users")}${esc(c.nom)}<span class="k">${typeLabel(c.type)}</span></li>`).join("");
    if (fo.length) html += '<li class="grp" aria-hidden="true">Fondations</li>' + fo.map((f) => `<li data-href="#/fondations" data-q="${esc(f.n)}" role="option">${ic("landmark")}${esc(f.n)}<span class="k">${f.c}</span></li>`).join("");
    $("ul", PAL).innerHTML = html || '<li class="grp">Aucun résultat</li>';
    const first = PAL.querySelector("li[data-href]"); if (first) first.setAttribute("aria-selected", "true");
    PAL.querySelectorAll("li[data-q]").forEach((li) => li.addEventListener("click", () => { FX.q = li.dataset.q; FX.type = ""; }, { once: true }));
  }
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); }
    else if (e.key === "/" && !e.target.closest("input,textarea,[contenteditable]")) { e.preventDefault(); openPalette(); }
  });

  // ---------- Démarrage ----------
  try { const t = localStorage.getItem("levier.theme"); if (t) document.documentElement.dataset.theme = t; } catch (e) { /* ignore */ }
  if (!window.FONDATIONS) { $("#root").innerHTML = '<div class="empty" style="padding:80px"><b>Base des fondations absente</b>Lancez <code>python3.12 scripts/lindas_fondations.py</code> pour créer src/data/fondations.js.</div>'; return; }
  function vLogin(msg) {
    $("#root").innerHTML = `<div class="login"><form class="login-card" data-form="login">
      <div class="brand" style="padding:0 0 18px">${MARK}<b>appui<span>.</span></b></div>
      <h1>Connexion</h1><p class="lede">L'outil interne de l'agence Levier.</p>
      <div class="field"><label for="l-email">E-mail</label><input class="input" id="l-email" name="email" type="email" autocomplete="username" required></div>
      <div class="field"><label for="l-pw">Mot de passe</label><input class="input" id="l-pw" name="password" type="password" autocomplete="current-password" required></div>
      ${msg ? `<p class="alert-soft" role="alert">${ic("alert")}${esc(msg)}</p>` : ""}
      <button class="btn primary" type="submit" style="width:100%;height:40px">Se connecter</button>
      <p class="sub" style="margin-top:14px">Pas de compte ? L'administrateur de l'agence le crée depuis l'administration du serveur.</p></form></div>`;
    $("#l-email").focus();
  }
  async function demarrer() {
    await STORE.init();
    if (SERVEUR()) {
      if (!STORE.st.token) return vLogin();
      try {
        const D = await STORE.loadAll();
        S = { v: 1, clients: D.clients, demandes: D.demandes, journal: D.journal, memo: D.memo, analyses: D.analyses };
        window.LEVIER_BOT = BOT = D.analyses;
        window.LEVIER_ENRICHI = ENR = Object.assign({}, window.LEVIER_ENRICHI || {}, D.fiches);
      } catch (e) { return vLogin("Session expirée ou serveur injoignable : reconnectez-vous."); }
    } else {
      load();
    }
    mergeBot();
    window.addEventListener("hashchange", route);
    route();
  }
  document.addEventListener("submit", async (e) => {
    if (e.target.dataset.form !== "login") return;
    e.preventDefault(); e.stopImmediatePropagation();
    const d = Object.fromEntries(new FormData(e.target));
    try { await STORE.login(d.email, d.password); location.reload(); }
    catch (err) { vLogin(err.status === 400 ? "E-mail ou mot de passe incorrect." : "Serveur injoignable : réessayez dans un instant."); }
  }, true);
  demarrer();
  window.LevierReset = () => { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } location.reload(); };
})();
