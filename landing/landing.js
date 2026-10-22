/* Appui · page publique. L'essai en direct compare une phrase de projet aux buts statutaires
   de 2'000 fondations romandes au but donateur (registre du commerce, noms masqués).
   Tout se passe dans le navigateur : rien n'est envoyé. */
(function (root) {
  "use strict";
  const STOP = new Set("dans pour avec sans sous entre leur leurs nous vous sont cette plus moins tout tous toute toutes autre autres ainsi aussi notamment fondation fondations projet projets association associations peut peuvent etre avoir faire selon dont depuis comme mais donc encore tres bien afin travers notre votre leurs suisse canton personnes activite activites domaine general cadre soutenir soutien promouvoir favoriser encourager developper permettre".split(" "));
  const DOM = {
    "l'enfance et la jeunesse": /enfan|jeune|ecole|eleve|scolaire|adolesc/,
    "la santé": /sante|soin|maladi|medic|prevention|handicap/,
    "la culture": /cultur|musique|theatre|artist|cinema|danse|lecture|livre|biblioth/,
    "la formation": /formation|educat|etude|apprenti|bourse|enseign/,
    "le social": /social|precar|pauvre|demuni|insertion|exclusion|famille/,
    "l'intégration": /migra|integration|refugi|asile/,
    "l'environnement": /environnement|nature|climat|biodivers|durable|mobilite/,
    "le sport": /\bsport|athlet|football|basket/,
    "les aînés": /agees|aine|senior|vieillesse/,
    "le patrimoine": /patrimoine|musee|histoire|monument/,
  };
  // Synonymes : le vocabulaire des projets n'est pas celui des statuts.
  const SYN = { aines: "agees vieill senior retrai person", senior: "agees vieill aines", isole: "solitu isolem", enfant: "enfanc jeunes", lectur: "livres biblio litter", migran: "refugi integr asile etrang",
    theatr: "spectac scene cultur artist", festiv: "manife cultur", ecole: "scolai eleves", sante: "soins maladi", sport: "sporti", nature: "enviro biodiv", climat: "enviro energi", handic: "invali", famill: "parent" };
  const CANT = { VD: /vaud|lausanne|vevey|montreux|yverdon|nyon|morges/, GE: /geneve|carouge|vernier|onex/, NE: /neuchatel|chaux-de-fonds|locle/, FR: /fribourg|bulle|morat/, VS: /valais|sion|martigny|monthey|sierre/, JU: /jura|delemont|porrentruy/ };
  const ETRANGER = /haiti|afrique|asie|inde|developpement|tiers.monde|etranger|monde entier/;
  const ADJ = { VD: "vaudoise", GE: "genevoise", NE: "neuchâteloise", FR: "fribourgeoise", VS: "valaisanne", JU: "jurassienne" };
  const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const stems = (s) => { const o = new Set(); for (const w of norm(s).split(/[^a-z]+/)) if (w.length >= 5 && !STOP.has(w)) o.add(w.slice(0, 6)); return o; };
  let IDX = null;
  function index(F) {
    if (IDX) return IDX;
    const df = new Map(), toks = F.map((f) => { const s = stems(f.p); s.forEach((w) => df.set(w, (df.get(w) || 0) + 1)); return s; });
    IDX = { F, toks, idf: (w) => Math.log((F.length + 1) / ((df.get(w) || 0) + 1)) };
    return IDX;
  }
  function domaines(txt) { const t = norm(txt); return Object.keys(DOM).filter((k) => DOM[k].test(t)); }
  let idf = () => 1;
  function citation(p, kw) {
    const parts = p.split(/(?<=[.;:,])\s+/).filter((x) => x.length > 30);
    let best = parts[0] || p, bs = -1;
    for (const x of parts) { let v = 0; stems(x).forEach((w) => { if (kw.has(w)) v += idf(w); }); if (v > bs) { bs = v; best = x; } }
    best = best.replace(/^(la fondation a pour but|elle a pour but|les buts de la fondation sont)\s*(de |d'|:)?\s*/i, "").replace(/^(notamment|en particulier|ainsi que|et|ou|[a-z]\)|\d+\.)\s+/i, "").replace(/[.;:,]$/, "");
    return best.length > 190 ? best.slice(0, 190).replace(/\s+\S*$/, "") + " …" : best;
  }
  function chercher(F, phrase, canton, n = 8) {
    const X = index(F), kw = stems(phrase), dq = domaines(phrase), res = [];
    idf = X.idf;
    [...kw].forEach((w) => { const k = Object.keys(SYN).find((x) => w.startsWith(x.slice(0, 5))); if (k) SYN[k].split(" ").forEach((y) => kw.add(y.slice(0, 6))); });
    const np = norm(phrase);
    canton = canton || Object.keys(CANT).find((c) => CANT[c].test(np)) || "";
    const local = !ETRANGER.test(np);
    if (!kw.size) return [];
    X.F.forEach((f, i) => {
      let s = 0; const hit = [];
      X.toks[i].forEach((w) => { if (kw.has(w)) { s += X.idf(w); hit.push(w); } });
      if (!hit.length) return;
      const dd = domaines(f.p).filter((d) => dq.includes(d));
      s = s * (1 + 0.6 * (hit.length - 1)) + dd.length * 1.5 + (canton && f.c === canton ? 4 : 0) - (f.p.length > 1400 ? 2 : 0) - (local && ETRANGER.test(norm(f.p)) ? 8 : 0);
      res.push({ f, s, dd, hit });
    });
    res.sort((a, b) => b.s - a.s);
    return res.slice(0, n).map((r) => ({ nom: "Fondation " + (ADJ[r.f.c] || "romande"), canton: r.f.c, domaine: r.dd[0] || domaines(r.f.p)[0] || "plusieurs domaines", mots: r.hit.length, quote: citation(r.f.p, kw) }));
  }
  root.AppuiEssai = { chercher };

  if (typeof document === "undefined") return;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // Essai en direct
  const form = $("#essai-form"), board = $("#board");
  let open = 3;
  function rendre(rows) {
    if (!rows.length) { board.innerHTML = `<li class="row row-vide"><span class="row-name">Aucune phrase de but ne reprend ces mots. Essayez avec le public et le lieu : « enfants », « aînés », « Lausanne ».</span></li>`; return; }
    board.innerHTML = rows.map((r, i) => `<li class="row ${i === open ? "is-open" : ""}" tabindex="0" data-i="${i}">
        <span class="row-name">${esc(r.nom)}</span><span class="row-fact">${esc(r.canton)}</span><span class="row-fact row-dom">${esc(r.domaine)}</span>
        <span class="row-status">À vérifier</span>
        <span class="row-detail"><q>${esc(r.quote)}</q><span>Phrase de son but statutaire, registre du commerce. Avant toute lettre, Levier vérifie si elle accepte les demandes, ses délais et ses pièces.</span></span></li>`).join("");
  }
  let rows = [];
  function lancer() {
    if (!root.APPUI_ESSAI) return;
    rows = chercher(root.APPUI_ESSAI, $("#essai-phrase").value, $("#essai-canton").value);
    open = Math.min(3, Math.max(0, rows.length - 1)); rendre(rows);
  }
  if (form) {
    form.addEventListener("submit", (e) => { e.preventDefault(); lancer(); board.scrollIntoView({ behavior: "smooth", block: "nearest" }); });
    board.addEventListener("click", (e) => { const li = e.target.closest(".row[data-i]"); if (!li) return; open = +li.dataset.i; rendre(rows); });
    board.addEventListener("keydown", (e) => { if (e.key === "Enter") { const li = e.target.closest(".row[data-i]"); if (li) { open = +li.dataset.i; rendre(rows); board.querySelector(`[data-i="${open}"]`).focus(); } } });
    const s = document.createElement("script"); s.src = "essai.js"; s.onload = lancer; document.body.appendChild(s);
  }

  // Entrées des sections (le contenu reste visible sans script ou en mouvement réduit)
  const reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduit && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-motion");
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.15 });
    document.querySelectorAll("[data-in]").forEach((el) => io.observe(el));
  }
})(typeof window !== "undefined" ? window : globalThis);
