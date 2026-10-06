// Rigenera le schermate REALI della web app usate dalla landing (galleria di area.html e blocchi «appshot» delle schede).
// Entra con gli account demo della web app (Giulia, Pietro, Luca, Elena) e scatta 17 schermate in 3 formati:
//   desktop 1280×900 · tablet 820×1080 · telefono 390×780 (@2x). Scrive PNG in una cartella temporanea;
//   poi `python _src/png_to_webp.py <cartella>` li converte in WebP dentro demo-landing/img/app/.
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
// [id schermata (come in UL_CFG.schermate), account demo, rotta]  — account null = schermata di accesso
const SCHERMATE = [
  ["studio-oggi", "giulia", "#/oggi"], ["studio-piano", "giulia", "#/piano"], ["studio-esami", "giulia", "#/esami"], ["studio-materiali", "giulia", "#/materiali"], ["studio-pratica", "giulia", "#/pratica"], ["studio-libretto", "giulia", "#/libretto"],
  ["test-oggi", "pietro", "#/oggi"], ["test-test", "pietro", "#/test"], ["test-allenamento", "pietro", "#/allenamento"], ["test-errori", "pietro", "#/errori"], ["test-orientamento", "pietro", "#/orientamento"],
  ["futuro-erasmus", "luca", "#/erasmus"], ["futuro-magistrali", "luca", "#/magistrali"], ["futuro-career", "luca", "#/career"],
  ["altro-piano", "giulia", "#/abbonamento"], ["altro-in-arrivo", "elena", "#/oggi"], ["altro-accesso", null, ""],
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
      if (acc !== "null") { await p.click(`[data-persona="${acc}"]`); await p.waitForTimeout(800); }
      await p.addStyleTag({ content: ".toast{display:none!important}" });
      for (const [id, , rotta] of lista) {
        if (rotta) { await p.evaluate((r) => { location.hash = r; }, rotta); await p.waitForTimeout(900); }
        await p.evaluate(() => window.scrollTo(0, 0));
        await p.screenshot({ path: path.join(RAW, `${id}-${dev}.png`), clip: { x: 0, y: 0, width: w, height: h } });
      }
      await ctx.close();
    }
    console.log("formato", dev, "ok");
  }
  await br.close();
  console.log("PNG in", RAW, "→ ora: python _src/png_to_webp.py", RAW);
})().catch((e) => { console.error(e); process.exit(1); });
