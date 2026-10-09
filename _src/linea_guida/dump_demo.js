// Estrae i dati vivi delle due demo (landing: UL_CFG, UL_TOOLS; web app: UL_DA_DECIDERE, UL_AREE, UL.PIANI, UL.DEMO) in JSON,
// da cui la «Linea guida» genera registro, tabelle e riferimenti. Uso: node _src/linea_guida/dump_demo.js > dati_demo.json
global.window = global; global.document = { addEventListener() {}, querySelector() { return null; } };
const path = require("path"); const R = path.join(__dirname, "..", "..");
require(path.join(R, "demo-landing/config.js")); require(path.join(R, "demo-landing/tools.js"));
const C = window.UL_CFG;
global.UL = {}; window.UL = global.UL;
require(path.join(R, "demo-webapp/js/unilink-dati.js")); require(path.join(R, "demo-webapp/js/config.js")); require(path.join(R, "demo-webapp/js/seed.js"));
const out = {
  landing: {
    versione: C.versione, numeri: C.numeri, hub: C.hub.map((h) => ({ slug: h.slug, nome: h.nome, stato: h.stato, desc: h.desc })),
    fasi: C.fasi, schermate: C.schermate.gruppi.map((g) => ({ ...g, n: C.schermate.lista.filter((s) => s.gruppo === g.id).length })), nSchermate: C.schermate.lista.length,
    prezzi: C.prezzi, decidere: C.decidere.map((c) => ({ id: c.id, titolo: c.titolo, gruppo: c.gruppo, area: c.area, problema: c.problema, origine: c.origine })),
    tools: (window.UL_TOOLS || []).map((t) => ({ id: t.id, nome: t.nome, desc: t.desc, hub: t.hub, stato: t.stato, dove: t.dove })), toolsArea: (window.UL_TOOLS_AREA || []).map((t) => ({ id: t.id, nome: t.nome, href: t.href })),
  },
  webapp: {
    versione: UL.VERSIONE, aree: window.UL_AREE.map((a) => ({ slug: a.slug, nome: a.nome, stato: a.stato, corsi: a.corsi })), piani: UL.PIANI, demo: UL.DEMO.map((d) => ({ k: d.k, label: d.label, desc: d.desc })),
    decidere: window.UL_DA_DECIDERE.map((r) => ({ id: r.id, gruppo: r.gruppo, titolo: r.titolo, stato: r.stato, cosa: r.cosa, modulo: !!r.modulo, origine: r.origine })),
  },
};
console.log(JSON.stringify(out, null, 1));
