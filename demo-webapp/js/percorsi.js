// UniLink · PERCORSI (corso di laurea + curriculum) → quali dispense entrano nel pacchetto semestre.
// File UGUALE in demo-landing/percorsi.js e demo-webapp/js/percorsi.js: se lo cambi, copialo nell'altro.
// Fonte: Course Catalogue UniFi, offerta 2026/27 (B395 Economia Aziendale, B402 Economia e Commercio), API /api/v1/corsi;
// per i tre esami che lì non compaiono (Economia Internazionale, Diritto Commerciale, Storia della Pubblicità) vale il CSV
// delle dispense (00_FONTI/Dispense_aggiornato.csv, colonne «Corso di studio» e pds del link UniFi). Verificato il 7/10/2026.
// Chiave = codice dell'insegnamento (uguale in landing e web app). Valori: "EA" / "EC" = tutto il corso di laurea;
// "EA-E94" = solo quel curriculum. Gli esami del III anno spesso sono a scelta: il pacchetto si sceglie sul proprio piano di studi.
window.UL_PERCORSI = {
  fonte: "Catalogo UniFi 2026/27 (B395 · B402) e CSV delle dispense · verificato il 7/10/2026",
  corsi: {
    EA: { nome: "Economia Aziendale", curricula: { E94: "Management", E95: "Marketing, internazionalizzazione e qualità" } },
    EC: { nome: "Economia e Commercio", curricula: { F011: "Economia politica e mercati finanziari", F013: "Economia e diritto", F084: "Economics and data" } },
  },
  esami: {
    B018991: ["EA", "EC"], B001296: ["EA", "EC"], B001284: ["EA", "EC"], B018992: ["EA", "EC"], B001283: ["EA", "EC"], B018993: ["EA", "EC"],
    B000293: ["EA", "EC"], B001286: ["EA", "EC"], B028378: ["EA", "EC"], B000265: ["EC"],
    B001456: ["EA", "EC-F011", "EC-F013"], B028392: ["EA", "EC-F011"], B028565: ["EA"], B000269: ["EA"],
    B028354: ["EC-F011"], B015424: ["EC-F013"], B001287: ["EC"],
    B028560: ["EA"], B028590: ["EA-E94", "EC-F011"], B018990: ["EC-F011", "EC-F084"], B028363: ["EC-F011", "EC-F084"],
    B001292: ["EC"], B018994: ["EC-F011", "EC-F084"], B028383: ["EA", "EC-F013"],
    B029774: ["EA-E94"], B016337: ["EA-E94"], B029734: ["EA-E94"], B029735: ["EA-E94"], B032781: ["EA-E94"], B019043: ["EA-E94"],
    B003981: ["EC-F011"], B030858: ["EC-F011"], B019053: ["EA-E95"], B028582: ["EA-E95"],
  },
};
(function () {
  const P = window.UL_PERCORSI;
  // l'esame (codice) fa parte del percorso cds (+ curriculum)?
  P.include = (codice, cds, curr) => { const l = P.esami[codice] || []; return l.includes(cds) || (!!curr && l.includes(cds + "-" + curr)); };
  // serve scegliere il curriculum per questo anno? (sì se almeno un esame di quell'anno è legato a un curriculum)
  P.serveCurriculum = (lista, cds) => lista.some((d) => (P.esami[d.codice || d.code] || []).some((x) => x.startsWith(cds + "-")));
  P.nomeCurr = (cds, curr) => ((P.corsi[cds] || {}).curricula || {})[curr] || "";
})();
