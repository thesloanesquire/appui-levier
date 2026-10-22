/// <reference path="../pb_data/types.d.ts" />
// Appui : collections partagées par l'équipe Levier. Chaque enregistrement garde l'objet de l'application
// tel quel dans « data » (JSON) et sa clé métier dans « ref ». Seuls les comptes connectés lisent et écrivent.
migrate((app) => {
  const connecte = "@request.auth.id != ''";
  const base = (name, extra = []) => new Collection({
    type: "base",
    name,
    listRule: connecte, viewRule: connecte, createRule: connecte, updateRule: connecte, deleteRule: connecte,
    fields: [
      { name: "ref", type: "text", required: true, max: 200 },
      { name: "data", type: "json", maxSize: 5000000 },
      ...extra,
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
    indexes: [`CREATE UNIQUE INDEX idx_${name}_ref ON ${name} (ref)`],
  });
  // clients, demandes (une fondation pour un client), memos (mémoire d'agence par fondation),
  // analyses (résultats du bot par client), fiches (fiches pratiques des fondations), journal.
  for (const n of ["clients", "demandes", "memos", "analyses", "fiches"]) app.save(base(n));
  app.save(base("journal", [{ name: "auteur", type: "text", max: 200 }]));

  // Rôle des comptes : « conseiller » par défaut, « admin » pour Alexandre.
  const users = app.findCollectionByNameOrId("users");
  users.fields.add(new SelectField({ name: "role", values: ["admin", "conseiller"], maxSelect: 1 }));
  app.save(users);
}, (app) => {
  for (const n of ["clients", "demandes", "memos", "analyses", "fiches", "journal"]) {
    try { app.delete(app.findCollectionByNameOrId(n)); } catch (e) { /* déjà absente */ }
  }
});
