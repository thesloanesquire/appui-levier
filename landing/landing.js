/* Levier · page publique v2 : calcul de la date de dépôt, essai en direct, apparitions.
   L'essai compare une phrase de projet aux buts statutaires de 2'000 fondations romandes
   (registre du commerce, noms masqués). Tout se passe dans le navigateur. */
(function (root) {
  "use strict";
  const T = root.APPUI_T || {};
  const STOP = new Set("dans pour avec sans sous entre leur leurs nous vous sont cette plus moins tout tous toute toutes autre autres ainsi aussi notamment fondation fondations projet projets association associations peut peuvent etre avoir faire selon dont depuis comme mais donc encore tres bien afin travers notre votre suisse canton personnes activite activites domaine general cadre soutenir soutien promouvoir favoriser encourager developper permettre".split(" "));
  const DOM = {
    "enfance": /enfan|jeune|ecole|eleve|scolaire|adolesc|kinder|jugend|child/, "santé": /sante|soin|maladi|medic|prevention|handicap|gesund|health/,
    "culture": /cultur|musique|theatre|artist|cinema|danse|lecture|livre|biblioth|kultur|lese|reading/, "formation": /formation|educat|etude|apprenti|bourse|bildung/,
    "social": /social|precar|pauvre|demuni|insertion|exclusion|famille|famili/, "intégration": /migra|integration|refugi|asile/,
    "environnement": /environnement|nature|climat|biodivers|durable|mobilite|umwelt/, "sport": /\bsport|athlet|football|basket/, "aînés": /agees|aine|senior|vieillesse|alter/,
  };
  const SYN = { aines: "agees vieill senior retrai person", senior: "agees vieill aines", enfant: "enfanc jeunes", lectur: "livres biblio litter", migran: "refugi integr asile etrang",
    theatr: "spectac scene cultur artist", festiv: "manife cultur", ecole: "scolai eleves", sante: "soins maladi", nature: "enviro biodiv", handic: "invali", famill: "parent",
    kinder: "enfant jeunes", lesefo: "lectur livres", migrat: "migran refugi", famil: "famill parent", childr: "enfant jeunes", readin: "lectur livres", migrant: "migran refugi" };
  const CANT = { VD: /vaud|lausanne|vevey|montreux|yverdon|nyon|morges|waadt/, GE: /geneve|carouge|vernier|genf|geneva/, NE: /neuchatel|chaux-de-fonds|neuenburg/, FR: /fribourg|bulle|freiburg/, VS: /valais|sion|martigny|wallis/, JU: /jura|delemont|porrentruy/ };
  const ETRANGER = /haiti|afrique|asie|inde|developpement|tiers.monde|etranger|monde entier|pays defavorises|regions defavorisees|international/;
  const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const stems = (s) => { const o = new Set(); for (const w of norm(s).split(/[^a-z]+/)) if (w.length >= 5 && !STOP.has(w)) o.add(w.slice(0, 6)); return o; };
  let IDX = null, idf = () => 1;
  function index(F) {
    if (IDX) return IDX;
    const df = new Map(), toks = F.map((f) => { const s = stems(f.p); s.forEach((w) => df.set(w, (df.get(w) || 0) + 1)); return s; });
    return (IDX = { F, toks, idf: (w) => Math.log((F.length + 1) / ((df.get(w) || 0) + 1)) });
  }
  const domaines = (t) => Object.keys(DOM).filter((k) => DOM[k].test(norm(t)));
  function citation(p, kw) {
    const parts = p.split(/(?<=[.;:,])\s+/).filter((x) => x.length > 30);
    let best = parts[0] || p, bs = -1;
    for (const x of parts) { let v = 0; stems(x).forEach((w) => { if (kw.has(w)) v += idf(w); }); if (v > bs) { bs = v; best = x; } }
    best = best.replace(/^(la fondation a pour but|elle a pour but|les buts de la fondation sont)\s*(de |d'|:)?\s*/i, "").replace(/^(notamment|en particulier|ainsi que|et|ou|[a-z]\)|\d+\.)\s+/i, "").replace(/[.;:,]$/, "");
    return best.length > 200 ? best.slice(0, 200).replace(/\s+\S*$/, "") + " …" : best;
  }
  function chercher(F, phrase, n = 6) {
    const X = index(F), kw = stems(phrase), dq = domaines(phrase), res = [];
    idf = X.idf;
    [...kw].forEach((w) => { const k = Object.keys(SYN).find((x) => w.startsWith(x.slice(0, 5))); if (k) SYN[k].split(" ").forEach((y) => kw.add(y.slice(0, 6))); });
    const np = norm(phrase), canton = Object.keys(CANT).find((c) => CANT[c].test(np)) || "", local = !ETRANGER.test(np);
    if (!kw.size) return [];
    X.F.forEach((f, i) => {
      let s = 0; const hit = [];
      X.toks[i].forEach((w) => { if (kw.has(w)) { s += X.idf(w); hit.push(w); } });
      if (!hit.length) return;
      const dd = domaines(f.p).filter((d) => dq.includes(d));
      s = s * (1 + 0.6 * (hit.length - 1)) + dd.length * 1.5 + (canton && f.c === canton ? 4 : 0) - (f.p.length > 1400 ? 2 : 0) - (local && ETRANGER.test(norm(f.p)) ? 12 : 0);
      res.push({ f, s, dd });
    });
    res.sort((a, b) => b.s - a.s);
    return res.slice(0, n).map((r) => ({ canton: r.f.c, dom: r.dd[0] || domaines(r.f.p)[0] || "", quote: citation(r.f.p, kw) }));
  }
  root.AppuiEssai = { chercher };
  if (typeof document === "undefined") return;

  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  document.documentElement.classList.add("js");

  // Navigation : filet sous la barre au défilement
  const nav = $(".nav");
  addEventListener("scroll", () => nav && nav.classList.toggle("scrolled", scrollY > 8), { passive: true });

  // Calcul de la date de dépôt
  const calc = $("#calc"), loc = { fr: "fr-CH", de: "de-CH", en: "en-GB" }[calc ? calc.dataset.loc : "fr"] || "fr-CH";
  if (calc) {
    const inp = $("#calc-date"), out = $("#calc-out");
    const d0 = new Date(); d0.setMonth(d0.getMonth() + 8); inp.value = d0.toISOString().slice(0, 10);
    const fmt = (d) => d.toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" });
    const maj = () => {
      if (!inp.value) return;
      const debut = new Date(inp.value + "T00:00:00"), a = new Date(debut), b = new Date(debut);
      a.setMonth(a.getMonth() - 4); b.setMonth(b.getMonth() - 5);
      const sem = Math.floor((b - new Date()) / 6048e5);
      out.innerHTML = `<span>${esc(T.depose)}</span><b>${fmt(a)}</b><span class="muted">${esc(T.grand)} ${fmt(b)}. ${sem > 1 ? esc(T.reste.replace("{n}", sem)) : esc(T.tard)}</span>`;
    };
    inp.addEventListener("input", maj); calc.addEventListener("submit", (e) => { e.preventDefault(); maj(); }); maj();
  }

  // Essai en direct
  const form = $("#essai-form"), board = $("#board");
  function lancer() {
    if (!root.APPUI_ESSAI || !board) return;
    const rows = chercher(root.APPUI_ESSAI, $("#essai-phrase").value);
    board.innerHTML = rows.length ? rows.map((r, i) => `<li class="res" style="animation-delay:${i * 60}ms"><div class="res-top"><span>${esc((T.fmt || "{f} {a}").replace("{f}", T.fond).replace("{a}", (T.adj || {})[r.canton] || r.canton))}</span><span class="pill">${esc(T.verif)}</span></div><p class="q">« ${esc(r.quote)} »</p>${r.dom ? `<span class="pill pill-ok" style="align-self:flex-start">${esc(r.dom)}</span>` : ""}</li>`).join("")
      : `<li class="res res-empty">${esc(T.rien)}</li>`;
  }
  if (form) {
    form.addEventListener("submit", (e) => { e.preventDefault(); lancer(); });
    const s = document.createElement("script"); s.src = (document.documentElement.lang === "fr" ? "" : "../") + "essai.js"; s.onload = lancer; document.body.appendChild(s);
  }

  // Apparitions
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
})(typeof window !== "undefined" ? window : globalThis);
