// Rigenera le schermate REALI della web app usate dalla landing (galleria di area.html e blocchi «appshot» delle schede).
// Entra con gli account demo della web app (pulsanti «Accesso rapido» della schermata di login: UL.DEMO in demo-webapp/js/seed.js)
// e scatta 19 schermate in 3 formati: desktop 1280×900 · tablet 820×1080 · telefono 390×780 (@2x).
// Scrive PNG in una cartella temporanea; poi `python _src/png_to_webp.py <cartella>` li converte in WebP in demo-landing/img/app/.
//
// Uso (dalla radice del repository):
//   python -m http.server 8765 &
//   NODE_PATH=<cartella di playwright> node _src/screenshot_webapp.js [http://localhost:8765/] [cartella-png]
//   python _src/png_to_webp.py <cartella-png>
// Se la web app cambia rotte o account, aggiornare l'elenco SCHERMATE qui sotto e UL_CFG.schermate in demo-landing/config.js.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const BASE = process.argv[2] || "http://localhost:8765/";
const RAW = process.argv[3] || path.join(require("os").tmpdir(), "ul-app-png");
fs.mkdirSync(RAW, { recursive: true });
// [id schermata (come in UL_CFG.schermate), indice dell'account in UL.DEMO (0 Gratuito · 1 Pacchetto esame · 3 Plus · 4 Area in arrivo · 5 Altro ateneo; null = schermata di accesso), rotta]
const SCHERMATE = [
  ["studio-dashboard", 0, "#/app/dashboard"], ["studio-esami", 0, "#/app/esami"], ["studio-esame", 0, "#/app/esami/microeconomia"], ["studio-materiali", 1, "#/app/materiali"],
  ["studio-catalogo", 0, "#/app/materiali/catalogo"], ["studio-esercitazioni", 0, "#/app/esercitazioni"], ["studio-quiz", 0, "#/app/esercitazioni/microeconomia"],
  ["percorso-libretto", 3, "#/app/percorso/libretto"], ["percorso-erasmus", 3, "#/app/percorso/erasmus"], ["percorso-magistrali", 3, "#/app/percorso/magistrali"], ["percorso-mentor", 3, "#/app/percorso/mentor"],
  ["account-abbonamento", 0, "#/app/abbonamento"], ["account-profilo", 0, "#/app/account"],
  ["decidere-elenco", 0, "#/app/decidere"], ["decidere-career-piano", 3, "#/app/piano"], ["decidere-career-opportunita", 3, "#/app/opportunita"], ["decidere-network-home", 5, "#/app/home"],
  ["altro-in-arrivo", 4, "#/app/dashboard"], ["altro-accesso", null, ""],
];
const DEV = { desk: [1280, 900, 1], tab: [820, 1080, 1], ph: [390, 780, 2] };
(async () => {
  const br = await chromium.launch();
  for (const [dev, [w, h, dpr]] of Object.entries(DEV)) {
    const perAccount = {};
    for (const s of SCHERMATE) (perAccount[s[1]] = perAccount[s[1]] || []).push(s);
    for (const [acc, lista] of Object.entries(perAccount)) {
      const ctx = await br.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
      const p = await ctx.newPage();
      await p.goto(BASE + "demo-webapp/index.html", { waitUntil: "networkidle" });
      if (acc !== "null") { await p.click(`[data-demo="${acc}"]`); await p.waitForTimeout(1200); }
      await p.addStyleTag({ content: ".toast{display:none!important}" });
      for (const [id, , rotta] of lista) {
        if (rotta) { await p.evaluate((r) => { location.hash = r; }, rotta); await p.waitForTimeout(900); }
        await p.evaluate(() => window.scrollTo(0, 0));
        // la web app ha propri elementi fissi (Commenti, «Visualizza come», badge DEMO): non devono finire nelle immagini della landing
        await p.evaluate(() => document.querySelectorAll("body *").forEach((e) => { if (getComputedStyle(e).position === "fixed" && /Commenti|Visualizza come|DEMO v/.test(e.innerText || "") && !e.querySelector("nav,main,aside")) e.style.display = "none"; }));
        await p.screenshot({ path: path.join(RAW, `${id}-${dev}.png`), clip: { x: 0, y: 0, width: w, height: h } });
      }
      await ctx.close();
    }
    console.log("formato", dev, "ok");
  }
  await br.close();
  console.log("PNG in", RAW, "→ ora: python _src/png_to_webp.py", RAW);
})().catch((e) => { console.error(e); process.exit(1); });
