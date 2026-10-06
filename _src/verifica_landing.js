// Verifica della landing prima di ogni push: errori JavaScript, file mancanti (404), scorrimento orizzontale e
// accessibilità (axe-core, regole WCAG A/AA + buone pratiche) su TUTTE le pagine, in desktop, tablet e telefono.
//
// Uso (dalla radice del repository):
//   python -m http.server 8765 &                         # serve il repository
//   npm i playwright axe-core                            # una volta sola (e un browser Chromium)
//   node _src/verifica_landing.js [http://localhost:8765/]
// Esce con codice 1 se trova problemi. Le pagine sono quelle di demo-landing/*.html più tutte le schede decidere.html#L01… (lette da config.js).
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.argv[2] || "http://localhost:8765/";
const DIR = path.join(__dirname, "..", "demo-landing");
const VP = { desktop: [1440, 900], tablet: [820, 1180], telefono: [390, 844] };
let AXE = null;
try { AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8"); } catch (e) { console.log("axe-core non installato: salto il controllo di accessibilità (npm i axe-core)"); }

(async () => {
  const pagine = fs.readdirSync(DIR).filter((f) => f.endsWith(".html")).sort();
  // le card «Da decidere» (L01…) sono lette dalla config: ogni card nuova viene controllata senza toccare questo file
  const codici = [...fs.readFileSync(path.join(DIR, "config.js"), "utf8").matchAll(/id: "(L\d+)"/g)].map((m) => m[1]);
  const lista = [...pagine, ...codici.map((c) => `decidere.html#${c}`)];
  const br = await chromium.launch();
  let problemi = 0;
  for (const [vn, [w, h]] of Object.entries(VP)) {
    const ctx = await br.newContext({ viewport: { width: w, height: h } });
    for (const pg of lista) {
      const p = await ctx.newPage(); const errs = [];
      p.on("pageerror", (e) => errs.push("JS: " + e.message));
      p.on("response", (r) => { if (r.status() >= 400) errs.push(r.status() + " " + r.url().replace(BASE, "")); });
      const [a, hh] = pg.split("#");
      await p.goto(BASE + "demo-landing/" + a + "?statico" + (hh ? "#" + hh : ""), { waitUntil: "networkidle" });
      await p.waitForTimeout(400);
      const ov = await p.evaluate(() => document.body.scrollWidth - window.innerWidth);
      if (ov > 1) errs.push(`scorre di lato (+${ov}px)`);
      if (AXE) {
        await p.evaluate(() => document.querySelectorAll(".app,.app-o").forEach((e) => e.classList.add("vis")));
        await p.addScriptTag({ content: AXE });
        const v = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] }, resultTypes: ["violations"] })).violations.map((x) => `${x.id} ×${x.nodes.length} (${x.help})`));
        v.forEach((x) => errs.push("accessibilità: " + x));
      }
      // il pannello dei commenti è un elemento in più sopra la pagina: controllare anche con il pannello aperto
      if (AXE && ["index.html", "durante.html", "decidere.html#L02"].includes(pg) && (await p.$("#cm-open"))) {
        await p.click("#cm-open"); await p.click("#cm-add");
        const v2 = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] }, resultTypes: ["violations"] })).violations.map((x) => `${x.id} ×${x.nodes.length} (${x.help})`));
        v2.forEach((x) => errs.push("accessibilità (pannello commenti aperto): " + x));
      }
      if (errs.length) { problemi++; console.log(`${vn.padEnd(8)} ${pg.padEnd(24)}\n   ${[...new Set(errs)].join("\n   ")}`); }
      await p.close();
    }
    await ctx.close();
  }
  await br.close();
  console.log(problemi ? `\n${problemi} controlli con problemi` : `\ntutto ok: ${lista.length} pagine × 3 formati`);
  process.exit(problemi ? 1 : 0);
})();
