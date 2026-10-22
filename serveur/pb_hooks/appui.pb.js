/// <reference path="../pb_data/types.d.ts" />
// Appui : proxy IA vers Infomaniak AI Services (API compatible OpenAI, données traitées en Suisse).
// La clé reste sur le serveur (variables d'environnement), jamais dans le navigateur.
//   INFOMANIAK_TOKEN       jeton API Infomaniak (Manager > AI Services > Tokens)
//   INFOMANIAK_PRODUCT_ID  identifiant du produit AI Services
//   INFOMANIAK_MODEL       défaut : Qwen/Qwen3.5-397B-A17B-FP8 (bêta) ; repli conseillé : mistralai/Mistral-Small-4-119B-2603

routerAdd("GET", "/api/appui/etat", (e) => {
  return e.json(200, {
    ok: true,
    ia: !!($os.getenv("INFOMANIAK_TOKEN") && $os.getenv("INFOMANIAK_PRODUCT_ID")),
    modele: $os.getenv("INFOMANIAK_MODEL") || "Qwen/Qwen3.5-397B-A17B-FP8",
  });
});

routerAdd("POST", "/api/appui/ia", (e) => {
  const token = $os.getenv("INFOMANIAK_TOKEN");
  const produit = $os.getenv("INFOMANIAK_PRODUCT_ID");
  if (!token || !produit) {
    return e.json(503, { erreur: "IA non configurée : renseigner INFOMANIAK_TOKEN et INFOMANIAK_PRODUCT_ID sur le serveur." });
  }
  const body = e.requestInfo().body || {};
  const messages = [];
  if (body.system) messages.push({ role: "system", content: String(body.system).slice(0, 20000) });
  messages.push({ role: "user", content: String(body.prompt || "").slice(0, 60000) });
  const modele = body.modele || $os.getenv("INFOMANIAK_MODEL") || "Qwen/Qwen3.5-397B-A17B-FP8";
  const req = { model: modele, messages, temperature: typeof body.temperature === "number" ? body.temperature : 0.4, max_tokens: Math.min(body.max_tokens || 2500, 8000) };
  if (body.json) req.response_format = { type: "json_object" };

  const res = $http.send({
    url: "https://api.infomaniak.com/2/ai/" + produit + "/openai/v1/chat/completions",
    method: "POST",
    headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify(req),
    timeout: 180,
  });
  if (res.statusCode !== 200) {
    return e.json(502, { erreur: "Infomaniak a répondu " + res.statusCode, detail: String(res.raw || "").slice(0, 500) });
  }
  const texte = res.json && res.json.choices && res.json.choices[0] ? res.json.choices[0].message.content : "";
  // Journal minimal (nLPD) : qui, quand, quel modèle ; pas le contenu.
  try {
    const j = new Record($app.findCollectionByNameOrId("journal"));
    j.set("ref", "ia-" + Date.now() + "-" + Math.floor(Math.random() * 1e6));
    j.set("data", { t: new Date().toISOString(), client: body.client || "", txt: "Appel IA (" + modele + ") : " + (body.usage || "texte") });
    j.set("auteur", e.auth ? e.auth.getString("email") : "");
    $app.save(j);
  } catch (err) { /* le journal ne doit pas bloquer la réponse */ }
  return e.json(200, { texte, modele, usage: res.json ? res.json.usage : null });
}, $apis.requireAuth());
