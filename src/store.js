/* Appui · stockage. Deux modes :
   - « serveur » : l'application est servie par le serveur Appui (PocketBase) ; données partagées entre conseillers,
     connexion obligatoire, IA Infomaniak disponible.
   - « local »   : fichier ouvert seul (démo) ; données dans ce navigateur uniquement. */
(function () {
  "use strict";
  const COLS = ["clients", "demandes", "memos", "analyses", "fiches", "journal"];
  const TOKEN_KEY = "appui.token";
  const st = { mode: "local", token: null, user: null, ia: false, modele: "", ids: {}, last: {}, timer: null, pending: false };
  const lsGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } };

  async function api(path, opt = {}) {
    const r = await fetch(path, { ...opt, headers: { "Content-Type": "application/json", ...(st.token ? { Authorization: st.token } : {}), ...(opt.headers || {}) } });
    const txt = await r.text();
    const data = txt ? JSON.parse(txt) : {};
    if (!r.ok) { const err = new Error(data.message || data.erreur || ("HTTP " + r.status)); err.status = r.status; err.data = data; throw err; }
    return data;
  }

  async function init() {
    try {
      const e = await api("/api/appui/etat");
      st.mode = "serveur"; st.ia = !!e.ia; st.modele = e.modele || "";
      st.token = lsGet(TOKEN_KEY);
      if (st.token) {
        try { const r = await api("/api/collections/users/auth-refresh", { method: "POST" }); st.token = r.token; st.user = r.record; lsSet(TOKEN_KEY, r.token); }
        catch (err) { st.token = null; lsSet(TOKEN_KEY, null); }
      }
    } catch (e) { st.mode = "local"; }
    return st;
  }

  async function login(email, password) {
    const r = await api("/api/collections/users/auth-with-password", { method: "POST", body: JSON.stringify({ identity: email, password }) });
    st.token = r.token; st.user = r.record; lsSet(TOKEN_KEY, r.token);
    return r.record;
  }
  function logout() { st.token = null; st.user = null; lsSet(TOKEN_KEY, null); location.hash = "#/"; location.reload(); }

  async function listAll(col) {
    let page = 1, out = [];
    for (;;) {
      const r = await api(`/api/collections/${col}/records?perPage=500&page=${page}&sort=created`);
      out = out.concat(r.items);
      if (page >= r.totalPages) break;
      page++;
    }
    return out;
  }

  // Charge tout l'état partagé et le convertit au format de l'application.
  async function loadAll() {
    const res = {};
    for (const c of COLS) {
      const items = await listAll(c);
      st.ids[c] = {}; st.last[c] = {};
      for (const it of items) { st.ids[c][it.ref] = it.id; st.last[c][it.ref] = JSON.stringify(it.data); }
      res[c] = items;
    }
    return {
      v: 1,
      clients: res.clients.map((x) => x.data),
      demandes: res.demandes.map((x) => x.data),
      memo: Object.fromEntries(res.memos.map((x) => [x.ref, x.data])),
      journal: res.journal.map((x) => ({ ...x.data, auteur: x.auteur, _ref: x.ref })).sort((a, b) => (a.t < b.t ? 1 : -1)),
      analyses: Object.fromEntries(res.analyses.map((x) => [x.ref, x.data])),
      fiches: Object.fromEntries(res.fiches.map((x) => [x.ref, x.data])),
    };
  }

  async function upsert(col, ref, data, extra = {}) {
    const json = JSON.stringify(data);
    if (st.last[col] && st.last[col][ref] === json) return;
    const id = st.ids[col] && st.ids[col][ref];
    const body = JSON.stringify({ ref, data, ...extra });
    const r = id ? await api(`/api/collections/${col}/records/${id}`, { method: "PATCH", body })
                 : await api(`/api/collections/${col}/records`, { method: "POST", body });
    (st.ids[col] = st.ids[col] || {})[ref] = r.id;
    (st.last[col] = st.last[col] || {})[ref] = json;
  }

  // Envoie au serveur ce qui a changé (différé de 500 ms pour regrouper les frappes).
  function sync(S, onState) {
    clearTimeout(st.timer);
    st.timer = setTimeout(async () => {
      onState && onState("sync");
      try {
        for (const c of S.clients) await upsert("clients", c.id, c);
        for (const d of S.demandes) await upsert("demandes", d.id, d);
        for (const [fid, m] of Object.entries(S.memo || {})) await upsert("memos", String(fid), m);
        for (const [cid, a] of Object.entries(S.analyses || {})) await upsert("analyses", cid, a);
        for (const j of S.journal) {
          if (j._ref) continue;
          j._ref = "j-" + Date.parse(j.t) + "-" + Math.random().toString(36).slice(2, 8);
          const { _ref, auteur, ...data } = j;
          await upsert("journal", _ref, data, { auteur: st.user ? st.user.email : "" });
        }
        onState && onState("ok");
      } catch (e) { onState && onState("erreur", e); }
    }, 500);
  }

  async function ia(payload) { return api("/api/appui/ia", { method: "POST", body: JSON.stringify(payload) }); }

  window.AppuiStore = { st, init, login, logout, loadAll, sync, ia };
})();
