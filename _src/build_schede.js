// Genera, a partire da demo-landing/decidere-arch.js (UL_ARCH) e demo-landing/config.js (UL_CFG.decidere):
//   1. architettura/schede/img/Lxx-p<pagina>-s<sezione>.jpg   un'immagine per ogni sezione dei mockup (screenshot della demo)
//   2. architettura/schede/Lxx_<titolo>.md                    la scheda in Markdown (la stessa del pulsante «Scarica la scheda»)
//   3. architettura/schede/schede.typ                         sorgente Typst del PDF «Schede Da decidere»
// Poi: python -c "import typst; typst.compile('architettura/schede/schede.typ', output='architettura/UniLink_Schede_Da_Decidere.pdf', root='.', font_paths=['.'])"
//
// Uso (dalla radice del repository, con la demo servita da un server locale):
//   python -m http.server 8765 &          # serve il repository
//   NODE_PATH=<cartella di playwright> node _src/build_schede.js [http://localhost:8765/]
// Richiede Playwright (npm i playwright) e un browser Chromium.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.argv[2] || "http://localhost:8765/";
const OUT = path.join(__dirname, "..", "architettura", "schede");
const slug = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const S = (s) => JSON.stringify(String(s ?? ""));                 // stringa Typst (le virgolette e i backslash restano al sicuro)
const T = (s) => `#${S(s)}`;                                      // testo semplice dentro il markup
const A = (l) => (l.length === 1 ? `(${l[0]},)` : `(${l.join(", ")})`);   // array Typst
const rows = (r) => A(r.map((x) => A(x.map(S))));
const tab = (cols, widths, r) => `#tab(${A(cols.map(S))}, ${A(widths)}, ${rows(r)})`;
const lista = (l) => l.map((i) => `- ${T(i)}`).join("\n");

(async () => {
  fs.mkdirSync(path.join(OUT, "img"), { recursive: true });
  const br = await chromium.launch();
  const page = await (await br.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.25 })).newPage();
  await page.goto(BASE + "demo-landing/decidere.html?statico", { waitUntil: "networkidle" });
  const { CFG, ARCH } = await page.evaluate(() => ({ CFG: { decidere: UL_CFG.decidere, versione: UL_CFG.versione }, ARCH: UL_ARCH }));
  const ids = CFG.decidere.map((c) => c.id).filter((id) => ARCH[id]);

  // 1 + 2 · immagini delle sezioni e file Markdown
  for (const id of ids) {
    await page.goto(BASE + "demo-landing/decidere.html?statico#" + id, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.addStyleTag({ content: ".navwrap,.topbar,.dec-nav,.stcta,.cm-fab,.toast{display:none!important} .app,.app-o{opacity:1!important;transform:none!important}" });
    const pagine = ARCH[id].pagine;
    for (let pi = 0; pi < pagine.length; pi++) {
      const wraps = page.locator(".mk-wrap").nth(pi);
      const n = await wraps.locator(".mk-sec").count();
      for (let si = 0; si < n; si++) {
        await wraps.locator(".mk-sec").nth(si).screenshot({ path: path.join(OUT, "img", `${id}-p${pi}-s${si + 1}.jpg`), type: "jpeg", quality: 74 });
      }
    }
    const md = await page.evaluate((i) => UL_SCHEDA_MD(i), id);
    const c = CFG.decidere.find((x) => x.id === id);
    fs.writeFileSync(path.join(OUT, `${id}_${slug(c.titolo)}.md`), md, "utf8");
    console.log("scheda", id, "ok");
  }
  await br.close();

  // 3 · sorgente Typst
  const intest = fs.readFileSync(path.join(__dirname, "schede_header.typ"), "utf8");
  let t = intest.replace("__VERSIONE__", `v${CFG.versione.n} · ${new Date(CFG.versione.data).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}`);
  t += `\n#cap("Indice", "Le nove schede", "una riga per scheda: stima, impatto e sforzo")\n`;
  t += tab(["Cod.", "Scheda", "Gruppo", "Impatto / sforzo", "Stima di lavoro"], ["8%", "30%", "16%", "14%", "32%"], CFG.decidere.filter((c) => ARCH[c.id]).map((c) => [c.id, c.titolo, c.gruppo, `${c.impatto} / ${c.sforzo}`, ARCH[c.id].stima])) + "\n";
  for (const id of ids) {
    const c = CFG.decidere.find((x) => x.id === id), a = ARCH[id];
    t += `\n#scheda(${S(id)}, ${S(c.titolo)}, ${S(c.gruppo + " · impatto " + c.impatto + "/5 · sforzo " + c.sforzo + "/5" + (c.area ? " · web app " + c.area : ""))})\n`;
    t += `#box-crema[*Il problema.* ${T(c.problema)} \\ \\ *La proposta.* ${T(c.proposta)}]\n#nota[*Il consiglio* (parere di Claude, da discutere: la decisione è vostra). ${T(c.consiglio)}]\n`;
    t += `#sub[Panoramica]\n#tab(("", ""), (22%, 78%), ${rows([["Obiettivo", a.obiettivo], ["Per chi", a.per], ["Quando serve", a.quando], ["Stima", a.stima], ["Dove vive", c.dove]])})\n`;
    t += `#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,\n  box-crema(fill: nvt)[*Versione minima (MVP)* \\\n${lista(a.ambito.mvp)}],\n  box-crema(fill: ar2)[*Dopo* \\\n${lista(a.ambito.dopo)}],\n  box-crema(fill: crema2)[*Non lo facciamo* \\\n${lista(a.ambito.fuori)}])\n`;
    t += `#sub[Pagine annotate]\nLe pagine come sarebbero, sezione per sezione. Ogni numero è seguito da: perché la sezione c'è e cosa puoi cambiare senza rifare il design.\n`;
    a.pagine.forEach((p, pi) => {
      t += `#block(above: 10pt, below: 2pt, text(size: 11.5pt)[${T(p.titolo)}]) #text(size: 8pt, fill: nv2)[${T(p.url + " — " + (p.nota || ""))}]\n`;
      p.sezioni.forEach((s, si) => {
        t += `#sezione(${si + 1}, ${S(s.nome)}, ${S(s.codice || "")}, ${S(s.perche)}, ${S(s.modifica)}, ${S((s.comp || []).join(" · "))}, "img/${id}-p${pi}-s${si + 1}.jpg")\n`;
      });
    });
    a.dati.forEach((d) => { t += `#sub[Dati · ${T(d.nome)}]\n#text(size: 8pt, fill: nv2)[${T(`Dove: ${d.dove} · Chi lo aggiorna: ${d.chi} · Quando: ${d.quando}`)}]\n${tab(["Campo", "Tipo", "Esempio / regola"], ["24%", "18%", "58%"], d.campi)}\n`; });
    t += `#sub[Regole]\n${lista(a.regole)}\n#sub[Stati]\n${tab(["Stato", "Cosa vede lo studente", "Testo"], ["22%", "38%", "40%"], a.stati)}\n`;
    t += `#sub[Testi proposti]\n${tab(["Elemento", "Testo"], ["28%", "72%"], a.copy)}\n`;
    t += `#sub[Misure]\n${tab(["Evento", "Quando scatta", "Perché"], ["28%", "36%", "36%"], a.eventi)}\n`;
    t += `#sub[Integrazioni]\n${tab(["Strumento", "Cosa fa", "Come si collega"], ["24%", "30%", "46%"], a.integrazioni)}\n#sub[Da verificare (legale e privacy)]\n${lista(a.legale)}\n`;
    t += `#sub[Manutenzione]\n${tab(["Cosa", "Chi", "Ogni quanto", "Come"], ["26%", "22%", "22%", "30%"], a.manutenzione)}\n`;
    t += `#sub[Piano di lavoro · ${T(a.stima)}]\n${tab(["N.", "Passo", "Dove", "Giorni"], ["6%", "52%", "26%", "16%"], a.passi)}\n`;
    t += `#sub[Rischi]\n${tab(["Rischio", "Come lo riduci"], ["38%", "62%"], a.rischi)}\n#sub[Come capisci se funziona]\n${tab(["Metrica", "Soglia (ipotesi)", "Entro"], ["44%", "34%", "22%"], a.successo)}\n#nota[*Regola di stop.* ${T(a.stop)}]\n`;
    t += `#sub[Prompt per l'AI]\nDa incollare insieme a CONTESTO_DEMO.md.\n#block(fill: navy, radius: 8pt, inset: 10pt, width: 100%, text(fill: crema, size: 8pt)[#raw(${S(a.prompt)}, block: false)])\n`;
    t += `#sub[Cosa serve · da decidere · origine]\n${lista(c.serve)}\n${lista(c.domande)}\n#text(size: 8pt, fill: nv2)[${T("Origine: " + c.origine)}]\n`;
  }
  fs.writeFileSync(path.join(OUT, "schede.typ"), t, "utf8");
  console.log("schede.typ scritto:", ids.length, "schede");
})().catch((e) => { console.error(e); process.exit(1); });
