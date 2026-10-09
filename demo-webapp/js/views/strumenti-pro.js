/* js/views/strumenti-pro.js — web app v14 · STRUMENTI COMPLETI (richiesta di Matteo del 9/10: «i tool che abbiamo detto di volere,
   fatti come quelli del sito attuale www.unilinkfirenze.it/tools, ma coerenti con la nuova landing, più belli e più comprensibili»).
   Tre strumenti, con la stessa architettura del sito attuale ma una pagina per volta, a passi numerati e risultato sempre visibile:
     · voto     «Quanto prendo alla laurea?»  — calcolatore voto di laurea del sito (media → presentazione → bonus → voto finale)
                                                + «Simula i prossimi esami»
     · media    «Che media mi serve?»         — la parte «Voglio arrivare a…» del sito, resa uno strumento a sé (obiettivo: media o voto)
     · erasmus  «Erasmus: punteggio e mete»   — calcolatore Erasmus + destinazioni del sito, in un solo strumento con due schede
   Regole: quelle del sito attuale (prova finale della Scuola di Economia; formula Erasmus: regolarità 35 + media 35 + lingue 15).
   Dati Erasmus: js/data-erasmus.js (140 mete con la media dell'ultima graduatoria, copiate dal sito il 9/10).
   I valori inseriti restano nel profilo (activity.toolDati[id]); media, CFU e lodi partono dal libretto se c'è.
   Si aggancia a UL.views.strumentiU (views/strumenti.js): la vetrina resta quella, cambia la pagina dello strumento aperto. */
(function () {
  const UL = window.UL, B = UL.B, U = UL.U;
  const { icon, esc } = UL.ui;
  const base = UL.views.strumentiU; if (!base) return;
  if (window.ULTools && !window.ULTools._pro) { const L0 = window.ULTools.lista; window.ULTools._pro = true;
    window.ULTools.lista = (hub) => { const L = L0(hub).filter((t) => t.id !== "media"); if (!L.some((t) => t.id === "magistrali")) { const i = L.findIndex((t) => t.id === "erasmus"); L.splice(i + 1, 0, { id: "magistrali", nome: "Magistrali e master", desc: "163 programmi in Italia e in Europa: filtra, salva e confronta.", hub: ["economia"], stato: "live" }); } return L; }; }
  const VV = (window.UL_VETRINA = window.UL_VETRINA || { illus: {}, perche: {}, tools: {} });
  VV.illus.magistrali = VV.illus.magistrali || `<svg viewBox="0 0 220 150" fill="none"><rect x="34" y="28" width="152" height="100" rx="18" fill="#f4f1ea"/><path d="M60 62l50-22 50 22z" fill="#172554"/><rect x="66" y="64" width="88" height="8" rx="2" fill="#172554" opacity=".8"/><rect x="72" y="74" width="10" height="34" rx="3" fill="#172554" opacity=".55"/><rect x="92" y="74" width="10" height="34" rx="3" fill="#172554" opacity=".55"/><rect x="118" y="74" width="10" height="34" rx="3" fill="#172554" opacity=".55"/><rect x="138" y="74" width="10" height="34" rx="3" fill="#172554" opacity=".55"/><rect x="62" y="108" width="96" height="8" rx="2" fill="#172554"/><circle cx="168" cy="44" r="14" fill="#cf7527"/><path d="M162 44l4 4 8-9" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  VV.perche.magistrali = "Quattro domande e ti consigliamo le magistrali e i master adatti a te.";
  VV.tools.magistrali = VV.tools.magistrali || { domanda: "Quale magistrale o master fa per me, dove e quanto costa?", esempio: "Finanza · in Italia · costo basso → 6 magistrali consigliate, con il perché", tempo: "3 minuti", fonte: "163 programmi del tool «Master / Magistrale» di unilinkfirenze.it (classificazione editoriale UniLink)" };
  VV.perche.voto = "Il voto di laurea da dove sei oggi, e la media che ti serve per arrivare dove vuoi.";
  if (VV.tools.voto) { VV.tools.voto.domanda = "Che voto prendo alla laurea, e che media mi serve per arrivare a quello che voglio?"; }
  const PRO = ["voto", "erasmus", "magistrali"]; // v14b: «Che media mi serve?» è il passo 4 del voto di laurea (come sul sito attuale)
  const n2 = (x, d = 2) => (x == null || isNaN(x) ? "—" : Number(x).toFixed(d).replace(".", ","));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const seg = (k, opts, cur, extra = "") => `<div class="seg tp-seg" role="group">${opts.map(([v, t]) => `<button type="button" class="${String(v) === String(cur) ? "on" : ""}" data-k="${k}" data-v="${v}" ${extra}>${t}</button>`).join("")}</div>`;
  const dati = (u, id, def) => { const T = (u.activity.toolDati = u.activity.toolDati || {}); T[id] = Object.assign({}, def, T[id] || {}); return T[id]; };
  let salva = null; const salvaPoi = () => { clearTimeout(salva); salva = setTimeout(() => UL.store.save(), 400); };
  const passo = (n, tit, sotto, corpo, extra = "") => `<section class="card tp-passo"><div class="tp-ph"><span class="tp-n">${n}</span><div><h3>${tit}</h3>${sotto ? `<p class="small muted">${sotto}</p>` : ""}</div>${extra}</div>${corpo}</section>`;
  const campo = (k, lab, val, attrs, aiuto) => `<label class="tp-campo"><span>${lab}${aiuto ? ` <i class="tp-aiuto" title="${esc(aiuto)}">?</i>` : ""}</span><input class="input" type="number" data-k="${k}" value="${val ?? ""}" ${attrs}></label>`;
  const libretto = (u) => { try { return U.calcoloLaurea ? U.calcoloLaurea(u) : null; } catch (e) { return null; } };

  /* ======================= REGOLE (come il sito attuale) ======================= */
  const LODE = 0.333; // punti per lode sul voto di presentazione
  const votoLaurea = (d) => {
    const m110 = (d.media * 110) / 30, pres = m110 + LODE * d.lodi;
    const regol = d.anni.reduce((s, x) => s + Number(x), 0), bonus = Number(d.quando) + Number(d.tesi) + regol;
    const tot = pres + bonus, voto = Math.min(110, Math.round(tot)), lode = tot >= 110 && pres >= 104.5 && Number(d.tesi) === 3;
    return { m110, pres, regol, bonus, tot, voto, lode, lodiPt: LODE * d.lodi };
  };
  const QT = { none: 0, A1: 1, A2: 2, B1: 4, B2: 7, C1: 8, C2: 10 };
  const puntiErasmus = (d) => {
    const soglia = d.anno === 1 ? 30 : d.anno === 2 ? 90 : 150;
    const regol = Math.min(35, (Math.max(0, d.cfu) / soglia) * 35), media = clamp((35 / 12) * (d.media - 18), 0, 35);
    const lingue = Math.min(15, d.lingue.reduce((s, x) => s + (QT[x.liv] || 0), 0));
    return { regol, media, lingue, tot: regol + media + lingue, soglia };
  };
  const PROB = { very: ["Molto probabile", "pr-v"], likely: ["Probabile", "pr-l"], low: ["Poco probabile", "pr-b"], unlikely: ["Difficile", "pr-u"] };
  const prob = (tot, avg) => (tot > avg + 7 ? "very" : tot >= avg - 7 ? "likely" : tot >= avg - 12 ? "low" : "unlikely");
  const bando = () => { const d = new Date(); let y = d.getFullYear(); if (d.getMonth() === 0 && d.getDate() < 15) y--; return `https://www.economia.unifi.it/vp-274-erasmus-per-studio-${y}-${String((y + 1) % 100).padStart(2, "0")}.html`; };

  /* ======================= 1 · QUANTO PRENDO ALLA LAUREA ======================= */
  const defVoto = (u) => { const R = libretto(u); const cfu = R && R.cfu ? R.cfu : 96; return { cds: u.profile.cds === "EC" ? "EC" : "EA", media: R && R.media ? Math.round(R.media * 100) / 100 : 27, cfu, lodi: R ? R.lodi : 1, quando: 2, tesi: 2, anni: [1, 1, 0.5], sim: [], ob: 108, resto: Math.max(0, 180 - 21 - cfu), dalLibretto: !!(R && R.media) }; };
  function htmlVoto(u) {
    const d = dati(u, "voto", defVoto(u));
    return `<div class="tp-grid"><div class="tp-col">
      ${passo(1, "La tua situazione", d.dalLibretto ? `${icon("check")} Presi dal tuo libretto: puoi cambiarli per provare.` : "Media ponderata, CFU con voto e lodi.", `
        <div class="tp-campi">${seg("cds", [["EA", "Economia Aziendale"], ["EC", "Economia e Commercio"]], d.cds)}</div>
        <div class="tp-campi c3">${campo("media", "Media ponderata", d.media, 'min="18" max="30" step="0.01"', "La media pesata sui CFU: il 30 e lode vale 30.")}${campo("cfu", "CFU con voto", d.cfu, 'min="0" max="180" step="1"', "I CFU degli esami con voto già verbalizzati.")}
          <label class="tp-campo"><span>Lodi</span><div class="tp-step"><button type="button" data-st="lodi" data-d="-1" aria-label="Una lode in meno">−</button><b data-v-lodi>${d.lodi}</b><button type="button" data-st="lodi" data-d="1" aria-label="Una lode in più">+</button></div></label></div>
        <input class="tp-range" type="range" min="18" max="30" step="0.05" value="${d.media}" data-k="media" aria-label="Media ponderata">`)}
      ${passo(2, "I punti bonus", "Ogni blocco si somma. Scegli quello che pensi ti succederà.", `
        <div class="tp-bonus"><div class="tp-bh"><b>Quando ti laurei</b><span class="tp-pt" data-pt="quando"></span></div>${seg("quando", [[2, "Entro il 31/12 · +2"], [1, "Entro il 30/4 · +1"], [0, "Più tardi · +0"]], d.quando)}</div>
        <div class="tp-bonus"><div class="tp-bh"><b>La tesi</b><span class="tp-pt" data-pt="tesi"></span></div>${seg("tesi", [[1, "Sufficiente · +1"], [2, "Buona · +2"], [3, "Ottima · +3"]], d.tesi)}</div>
        <div class="tp-bonus"><div class="tp-bh"><b>Regolarità: CFU presi in ogni anno</b><span class="tp-pt" data-pt="regol"></span></div>
          ${[0, 1, 2].map((i) => `<div class="tp-anno"><span>${["I", "II", "III"][i]} anno</span>${seg("anno" + i, [[0, "meno di 20 · +0"], [0.5, "20–39 · +0,5"], [1, "40 o più · +1"]], d.anni[i])}</div>`).join("")}</div>`)}
      ${passo(3, "Simula i prossimi esami", "Aggiungi i voti che pensi di prendere: vedi subito come cambiano media e voto.", `<div data-sim></div><button type="button" class="btn btn-ghost btn-sm" data-sim-add>${icon("plus")} Aggiungi un esame</button>`)}
      ${passo(4, "Voglio arrivare a…", "Scegli il voto che vuoi: ti diciamo che media ti serve negli esami che restano, con i bonus che hai scelto sopra.", `
        ${seg("ob", [[100, "100"], [105, "105"], [108, "108"], [110, "110"], [111, "110 e lode"]], d.ob)}
        <div class="tp-campi c2" style="margin-top:12px">${campo("resto", "CFU con voto che restano", d.resto, 'min="0" max="180"', "Di solito: 180 meno quelli fatti meno circa 21 CFU senza voto (prova finale, idoneità, attività a scelta).")}<div></div></div>
        <div class="tp-serve" data-serve></div>`)}
    </div>
    <aside class="tp-col tp-side"><section class="card navy tp-ris" data-ris></section>
      <a class="tp-poi" href="#/app/strumenti/magistrali">${icon("cap")} <span><b>E dopo la laurea?</b><br>Trova e confronta magistrali e master →</span></a></aside></div>
    ${comeFunziona([["01", "Media ponderata", "Ogni voto pesa per i CFU dell'esame; il 30 e lode vale 30."], ["02", "Voto di presentazione", "Media × 110 ÷ 30, più 0,333 punti per ogni lode."], ["03", "Bonus", "Rapidità (fino a +2), tesi (fino a +3), regolarità (fino a +3): si sommano."], ["04", "Voto finale e obiettivo", "Presentazione + bonus, arrotondato, massimo 110 (lode con presentazione da almeno 104,5 e tesi ottima). Per l'obiettivo si fa il conto al contrario: voto − bonus − lodi → media che serve."]])}`;
  }
  function risVoto(el, d) {
    const r = votoLaurea(d), p = clamp((r.voto - 66) / 44, 0, 1);
    el.querySelector("[data-ris]").innerHTML = `<span class="sq-label">Voto finale stimato</span>
      <div class="tp-big"><b>${r.voto}</b><span>/110</span>${r.lode ? '<em class="tp-lode">e lode</em>' : ""}</div>
      <div class="tp-scala"><i style="width:${p * 100}%"></i></div><div class="tp-scala-l"><span>66</span><span>110</span></div>
      <ul class="tp-comp">${[["Media in 110", n2(r.m110), r.m110, 110], ["Lodi", "+" + n2(r.lodiPt), r.lodiPt, 4], ["Voto di presentazione", n2(r.pres), r.pres, 110], ["Bonus", "+" + n2(r.bonus, 1), r.bonus, 8]].map(([k, v, x, m], i) => `<li class="${i === 2 ? "forte" : ""}"><span>${k}</span><b>${v}</b><i style="--w:${clamp((x / m) * 100, 2, 100)}%"></i></li>`).join("")}</ul>
      <p class="tp-frase">${r.tot >= 110 ? (r.lode ? "Con questi dati arrivi a 110 e lode." : r.pres >= 104.5 ? "Arrivi a 110: con la tesi ottima puoi puntare alla lode." : "Arrivi a 110. Per la lode serve una presentazione da almeno 104,5.") : `Ti mancano ${n2(110 - r.tot, 1)} punti per il 110.`}</p>
      <p class="tiny" style="opacity:.7">Stima con le regole della Scuola di Economia (EA ed EC): decide sempre la commissione.</p>`;
    el.querySelector('[data-pt="quando"]').textContent = "+" + d.quando; el.querySelector('[data-pt="tesi"]').textContent = "+" + d.tesi; el.querySelector('[data-pt="regol"]').textContent = "+" + n2(d.anni.reduce((s, x) => s + Number(x), 0), 1);
    // simulazione
    const S = d.sim, box = el.querySelector("[data-sim]");
    const cfuS = S.reduce((s, x) => s + x.cfu, 0), sommaS = S.reduce((s, x) => s + Math.min(30, x.v) * x.cfu, 0), lodiS = S.filter((x) => x.v > 30).length;
    const nm = d.cfu + cfuS ? (d.media * d.cfu + sommaS) / (d.cfu + cfuS) : d.media, r2 = votoLaurea(Object.assign({}, d, { media: nm, lodi: d.lodi + lodiS }));
    // passo 4 · «Voglio arrivare a…» (la vecchia «Che media mi serve?»): stesso conto del sito, all'indietro
    const ob = Math.min(110, Number(d.ob)), resto = Math.max(0, d.resto), totC = d.cfu + resto, lodeOb = Number(d.ob) > 110;
    const mediaOb = ((ob - r.bonus - LODE * d.lodi) * 30) / 110, serve = resto ? (mediaOb * totC - d.media * d.cfu) / resto : null, maxM = totC ? (d.media * d.cfu + 30 * resto) / totC : d.media;
    let st, cl, fr;
    if (serve == null) { st = r.voto >= ob ? "Già raggiunto" : "Non raggiungibile"; cl = r.voto >= ob ? "ok" : "no"; fr = "Non restano CFU con voto: conta quello che hai."; }
    else if (serve <= 18) { st = "Già raggiunto"; cl = "ok"; fr = "Anche con tutti 18 ci arrivi: puoi puntare più in alto."; }
    else if (serve <= d.media) { st = "Sei in linea"; cl = "ok"; fr = `Basta restare sotto la media di oggi: voti tra ${Math.floor(serve)} e ${Math.min(30, Math.ceil(serve) + 1)}.`; }
    else if (serve <= Math.min(30, d.media + 1.5)) { st = "Fattibile"; cl = "ok"; fr = `Un piccolo passo in più: voti tra ${Math.floor(serve)} e ${Math.min(30, Math.ceil(serve) + 1)}.`; }
    else if (serve <= 30) { st = "Impegnativo"; cl = "warn"; fr = `Quasi tutti gli esami che restano tra ${Math.floor(serve)} e 30.`; }
    else { st = "Non raggiungibile"; cl = "no"; fr = `Anche con tutti 30 arrivi a ${n2(maxM)} di media (circa ${Math.min(110, Math.round((maxM * 110) / 30 + LODE * d.lodi + r.bonus))}/110): prova un obiettivo più basso o più bonus.`; }
    const pos = (v) => clamp(((v - 18) / 12) * 100, 0, 100);
    el.querySelector("[data-serve]").innerHTML = `<div class="tp-serve-g"><div><span>Media che ti serve nei prossimi ${resto} CFU</span><b>${serve == null ? "—" : serve > 30 ? "oltre 30" : n2(Math.max(18, serve))}</b><em class="tp-stato ${cl}">${st}</em></div>
      <div class="tp-linea chiara"><div class="tp-lbar"></div><i class="m-oggi" style="left:${pos(d.media)}%"><span>oggi ${n2(d.media, 1)}</span></i>${serve != null && serve <= 30 && serve >= 18 ? `<i class="m-serve" style="left:${pos(serve)}%"><span>serve ${n2(serve, 1)}</span></i>` : ""}<div class="tp-lscala"><span>18</span><span>24</span><span>30</span></div></div></div>
      <p class="tp-frase chiara">${fr}${lodeOb ? " Per la lode servono anche presentazione da almeno 104,5 e tesi ottima." : ""}</p>`;
    box.innerHTML = S.length ? `<div class="tp-simrighe">${S.map((x, i) => `<div class="tp-sim"><span>Esame ${i + 1}</span><select class="select" data-sv="${i}" aria-label="Voto">${[18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((v) => `<option value="${v}" ${x.v === v ? "selected" : ""}>${v === 31 ? "30L" : v}</option>`).join("")}</select><select class="select" data-sc="${i}" aria-label="CFU">${[6, 9, 12].map((c) => `<option value="${c}" ${x.cfu === c ? "selected" : ""}>${c} CFU</option>`).join("")}</select><button type="button" class="icon-btn" data-sx="${i}" aria-label="Togli">${icon("trash")}</button></div>`).join("")}</div>
      <div class="tp-simris"><div><span>Nuova media</span><b>${n2(nm)}</b><small class="${nm >= d.media ? "su" : "giu"}">${nm >= d.media ? "+" : ""}${n2(nm - d.media)}</small></div><div><span>Nuovo voto stimato</span><b>${r2.voto}${r2.lode ? " e lode" : ""}</b><small class="${r2.voto >= votoLaurea(d).voto ? "su" : "giu"}">${r2.voto - votoLaurea(d).voto >= 0 ? "+" : ""}${r2.voto - votoLaurea(d).voto}</small></div></div>` : `<p class="small muted" style="margin-bottom:10px">Nessun esame simulato.</p>`;
  }

  /* ======================= (archiviato) «Che media mi serve?» come strumento a sé: dal 9/10 è il passo 4 del voto ======================= */
  const defMedia = (u) => { const R = libretto(u); const cfu = R && R.cfu ? R.cfu : 96; return { modo: "media", media: R && R.media ? Math.round(R.media * 100) / 100 : 26.1, cfu, resto: Math.max(0, 180 - 21 - cfu) || 63, obMedia: 27, obVoto: 108, lodi: R ? R.lodi : 1, bonus: 5, dalLibretto: !!(R && R.media) }; };
  function htmlMedia(u) {
    const d = dati(u, "media", defMedia(u));
    return `<div class="tp-grid"><div class="tp-col">
      ${passo(1, "Da dove parti", d.dalLibretto ? `${icon("check")} Presi dal tuo libretto: puoi cambiarli.` : "La media che hai oggi e quanti CFU con voto ti mancano.", `
        <div class="tp-campi c3">${campo("media", "Media di oggi", d.media, 'min="18" max="30" step="0.01"')}${campo("cfu", "CFU con voto fatti", d.cfu, 'min="0" max="180"')}${campo("resto", "CFU con voto che restano", d.resto, 'min="1" max="180"', "Di solito: 180 meno quelli fatti meno circa 21 CFU senza voto (prova finale, idoneità, attività a scelta).")}</div>`)}
      ${passo(2, "Dove vuoi arrivare", "Scegli se ragionare sulla media o sul voto di laurea.", `
        ${seg("modo", [["media", "Una media"], ["voto", "Un voto di laurea"]], d.modo)}
        <div class="tp-ob" data-ob-media ${d.modo === "media" ? "" : "hidden"}><div class="tp-obv"><span>Media obiettivo</span><b data-v-obMedia>${n2(d.obMedia)}</b></div><input class="tp-range" type="range" min="18" max="30" step="0.1" value="${d.obMedia}" data-k="obMedia"></div>
        <div class="tp-ob" data-ob-voto ${d.modo === "voto" ? "" : "hidden"}><div class="tp-obv"><span>Voto di laurea obiettivo</span><b data-v-obVoto>${d.obVoto}</b></div>${seg("obVoto", [[95, "95"], [100, "100"], [105, "105"], [108, "108"], [110, "110"]], d.obVoto)}
          <div class="tp-bonus" style="margin-top:12px"><div class="tp-bh"><b>Bonus che ti aspetti</b><span class="small muted">rapidità + tesi + regolarità</span></div>${seg("bonus", [[3, "+3"], [5, "+5"], [7, "+7"], [8, "+8 (massimo)"]], d.bonus)}</div></div>`)}
    </div>
    <aside class="tp-col tp-side"><section class="card navy tp-ris" data-ris></section>
      <a class="tp-poi" href="#/app/strumenti/voto">${icon("calc")} <span><b>Vuoi vedere il voto di laurea completo?</b><br>Quanto prendo alla laurea →</span></a></aside></div>
    ${comeFunziona([["01", "La media che serve", "(obiettivo × CFU totali − media di oggi × CFU fatti) ÷ CFU che restano."], ["02", "Obiettivo di laurea", "Dal voto obiettivo si tolgono i bonus e le lodi, si ottiene la presentazione e da lì la media."], ["03", "Fattibile?", "Se ti serve meno della media di oggi sei in linea; oltre 30 non è raggiungibile."], ["04", "Il consiglio", "Ti diciamo tra quali voti stare negli esami che restano."]])}`;
  }
  function risMedia(el, d) {
    const tot = d.cfu + d.resto;
    const obMedia = d.modo === "voto" ? (((d.obVoto - d.bonus - LODE * d.lodi) * 30) / 110) : d.obMedia;
    const serve = d.resto ? (obMedia * tot - d.media * d.cfu) / d.resto : null;
    const maxM = (d.media * d.cfu + 30 * d.resto) / tot;
    let st, cl, fr;
    if (serve == null) { st = "—"; cl = ""; fr = "Inserisci i CFU che restano."; }
    else if (serve <= 18) { st = "Già raggiunto"; cl = "ok"; fr = "Anche con tutti 18 arrivi all'obiettivo: puoi puntare più in alto."; }
    else if (serve <= d.media) { st = "Sei in linea"; cl = "ok"; fr = `Ti basta restare sotto la media di oggi: punta a voti tra ${Math.floor(serve)} e ${Math.min(30, Math.ceil(serve) + 1)}.`; }
    else if (serve <= Math.min(30, d.media + 1.5)) { st = "Fattibile"; cl = "ok"; fr = `Serve un piccolo passo in più: punta a voti tra ${Math.floor(serve)} e ${Math.min(30, Math.ceil(serve) + 1)}.`; }
    else if (serve <= 30) { st = "Impegnativo"; cl = "warn"; fr = `Serve alzare il ritmo: quasi tutti gli esami che restano tra ${Math.floor(serve)} e 30.`; }
    else { st = "Non raggiungibile"; cl = "no"; fr = `Anche con tutti 30 arrivi a ${n2(maxM)} di media${d.modo === "voto" ? ` (circa ${Math.min(110, Math.round((maxM * 110) / 30 + LODE * d.lodi + d.bonus))}/110)` : ""}. Prova un obiettivo più basso.`; }
    const pos = (v) => clamp(((v - 18) / 12) * 100, 0, 100);
    el.querySelector("[data-ris]").innerHTML = `<span class="sq-label">${d.modo === "voto" ? `Per arrivare a ${d.obVoto}/110` : `Per arrivare a ${n2(d.obMedia)} di media`}</span>
      <div class="tp-big"><b>${serve == null ? "—" : serve > 30 ? "oltre 30" : n2(Math.max(18, serve))}</b><span>${serve != null && serve <= 30 ? "di media" : ""}</span></div>
      <p class="tp-sub">nei prossimi ${d.resto} CFU con voto</p>
      <span class="tp-stato ${cl}">${st}</span>
      <div class="tp-linea"><div class="tp-lbar"></div>
        <i class="m-oggi" style="left:${pos(d.media)}%"><span>oggi ${n2(d.media, 1)}</span></i>
        ${serve != null && serve <= 30 && serve >= 18 ? `<i class="m-serve" style="left:${pos(serve)}%"><span>serve ${n2(serve, 1)}</span></i>` : ""}
        <div class="tp-lscala"><span>18</span><span>24</span><span>30</span></div></div>
      <p class="tp-frase">${fr}</p>
      ${d.modo === "voto" ? `<p class="tiny" style="opacity:.7">Media finale che serve: ${n2(obMedia)} · lodi contate: ${d.lodi} · bonus ipotizzati: +${d.bonus}.</p>` : ""}`;
    const b1 = el.querySelector("[data-v-obMedia]"); b1 && (b1.textContent = n2(d.obMedia)); const b2 = el.querySelector("[data-v-obVoto]"); b2 && (b2.textContent = d.obVoto);
  }

  /* ======================= 3 · ERASMUS: PUNTEGGIO E METE ======================= */
  const LINGUE = ["Inglese", "Francese", "Tedesco", "Spagnolo", "Portoghese", "Altra lingua"];
  const defEra = (u) => { const R = libretto(u); return { tab: "punteggio", cds: u.profile.cds === "EC" ? "EC" : "EA", anno: Number(u.profile.anno) || 2, media: R && R.media ? Math.round(R.media * 100) / 100 : 27.45, cfu: R && R.cfu ? R.cfu : 76, lingue: [{ l: "Inglese", liv: "B2" }], cmp: [], q: "", paese: "", mesi: "", portata: false, conMedia: false, fav: [], quante: 24, dalLibretto: !!(R && R.media) }; };
  const ME = () => (window.UL_ERASMUS || { mete: [], mediaGenerale: 56.46 });
  const reqOk = (m, d) => { const r = (m.languageRequirement || "").trim(); if (!r || /nessun/i.test(r)) return true; const mm = r.match(/(A1|A2|B1|B2|C1|C2)\s*(\w+)/i); if (!mm) return null;
    const lv = Object.keys(QT), need = lv.indexOf(mm[1].toUpperCase()), lng = mm[2].toLowerCase(); const mio = d.lingue.find((x) => x.l.toLowerCase().startsWith(lng.slice(0, 4))); return mio ? lv.indexOf(mio.liv) >= need : false; };
  function htmlErasmus(u) {
    const d = dati(u, "erasmus", defEra(u));
    return `<div class="tabs tp-tabs">${[["punteggio", "Il tuo punteggio", "calc"], ["mete", `Le mete · ${ME().mete.length}`, "globe"]].map(([k, t, i]) => `<button type="button" data-k="tab" data-v="${k}" class="${d.tab === k ? "on" : ""}">${icon(i)} ${t}</button>`).join("")}${d.fav.length ? `<span class="tp-favn">★ ${d.fav.length} salvate</span>` : ""}</div>
      <div data-era-punteggio ${d.tab === "punteggio" ? "" : "hidden"}><div class="tp-grid"><div class="tp-col">
        ${passo(1, "Il tuo percorso", d.dalLibretto ? `${icon("check")} Media e CFU dal tuo libretto.` : "Corso, anno, media e CFU di oggi.", `
          <div class="tp-campi">${seg("cds", [["EA", "Economia Aziendale"], ["EC", "Economia e Commercio"]], d.cds)}</div>
          <div class="tp-campi">${seg("anno", [[1, "I anno"], [2, "II anno"], [3, "III anno"]], d.anno)}</div>
          <div class="tp-campi c2">${campo("media", "Media ponderata", d.media, 'min="18" max="30" step="0.01"')}${campo("cfu", "CFU di oggi", d.cfu, 'min="0" max="180"', "La regolarità si calcola sui CFU: servono 30 al I anno, 90 al II, 150 al III per il massimo.")}</div>`)}
        ${passo(2, "Le lingue", "Una riga per ogni certificazione. Fino a 15 punti in tutto.", `<div data-lingue></div><button type="button" class="btn btn-ghost btn-sm" data-lng-add>${icon("plus")} Aggiungi una lingua</button>`)}
        ${passo(3, "Una meta che ti interessa", "Facoltativo: confronta il tuo punteggio con la media della sua ultima graduatoria.", `<select class="select" data-k="meta"><option value="">Nessuna meta</option>${ME().mete.map((m) => `<option value="${esc(m.code)}" ${d.meta === m.code ? "selected" : ""}>${esc(m.name)} · ${esc(m.country.trim())}</option>`).join("")}</select><div data-meta-ris></div>`)}
      </div>
      <aside class="tp-col tp-side"><section class="card navy tp-ris" data-ris></section>
        <a class="tp-poi" href="${bando()}" target="_blank" rel="noopener">${icon("file")} <span><b>Il bando Erasmus di quest'anno</b><br>Preparati in anticipo: leggilo sul sito della Scuola →</span></a></aside></div>
      ${comeFunziona([["01", "Regolarità · 35", "CFU di oggi ÷ soglia (30 al I anno, 90 al II, 150 al III) × 35."], ["02", "Media · 35", "35 ÷ 12 × (media − 18): con 30 di media prendi 35."], ["03", "Lingue · 15", "A1 1 · A2 2 · B1 4 · B2 7 · C1 8 · C2 10 punti, sommati fino a 15."], ["04", "La meta", "Confronto con la media dell'ultima graduatoria: molto probabile, probabile, poco probabile, difficile."]])}</div>
      <div data-era-mete ${d.tab === "mete" ? "" : "hidden"}>
        <div class="card tp-filtri"><input class="input" type="search" data-k="q" value="${esc(d.q)}" placeholder="Cerca università, città o codice">
          <select class="select" data-k="paese"><option value="">Tutti i paesi</option>${[...new Set(ME().mete.map((m) => m.country.trim()))].sort().map((p) => `<option ${d.paese === p ? "selected" : ""}>${esc(p)}</option>`).join("")}</select>
          <select class="select" data-k="mesi"><option value="">Qualsiasi durata</option>${[5, 6, 10].map((m) => `<option value="${m}" ${String(d.mesi) === String(m) ? "selected" : ""}>${m} mesi</option>`).join("")}</select>
          <label class="tp-chk"><input type="checkbox" data-k="portata" ${d.portata ? "checked" : ""}> Solo alla mia portata</label>
          <label class="tp-chk"><input type="checkbox" data-k="conMedia" ${d.conMedia ? "checked" : ""}> Solo con media storica</label>
          <label class="tp-chk"><input type="checkbox" data-k="soloFav" ${d.soloFav ? "checked" : ""}> ★ Solo salvate</label></div>
        <p class="small muted" data-mete-n></p><div class="tp-mete" data-mete></div><div style="text-align:center;margin-top:14px"><button type="button" class="btn btn-ghost" data-piu>Mostra altre</button></div><div data-tray></div>
        <p class="tiny muted" style="margin-top:10px">Media storica = punteggio medio dell'ultima graduatoria di quella sede. Dove manca usiamo la media generale (${n2(ME().mediaGenerale)}). Requisiti, posti e corsi vanno sempre verificati sul bando e sulla scheda della sede.</p></div>`;
  }
  function risErasmus(el, d) {
    const r = puntiErasmus(d), m = ME().mete;
    el.querySelector("[data-lingue]").innerHTML = d.lingue.map((x, i) => `<div class="tp-lng"><select class="select" data-ll="${i}" aria-label="Lingua">${LINGUE.map((l) => `<option ${x.l === l ? "selected" : ""}>${l}</option>`).join("")}</select>${seg("liv" + i, Object.keys(QT).filter((k) => k !== "none").map((k) => [k, k]), x.liv)}<span class="tp-pt">+${QT[x.liv] || 0}</span><button type="button" class="icon-btn" data-lx="${i}" aria-label="Togli">${icon("trash")}</button></div>`).join("") || '<p class="small muted">Nessuna certificazione.</p>';
    const vicine = m.filter((x) => x.historicalAverage != null && d.anno >= (x.minYear || 1) && ["very", "likely"].includes(prob(r.tot, x.historicalAverage))).sort((a, b) => b.historicalAverage - a.historicalAverage);
    el.querySelector("[data-ris]").innerHTML = `<span class="sq-label">Il tuo punteggio stimato</span>
      <div class="tp-big"><b>${n2(r.tot)}</b><span>/85</span></div>
      <ul class="tp-comp">${[["Regolarità", r.regol, 35], ["Media", r.media, 35], ["Lingue", r.lingue, 15]].map(([k, v, mx]) => `<li><span>${k}</span><b>${n2(v)} / ${mx}</b><i style="--w:${clamp((v / mx) * 100, 2, 100)}%"></i></li>`).join("")}</ul>
      <p class="tp-frase"><b>${vicine.length}</b> mete con media storica sono alla tua portata (molto probabile o probabile).</p>
      ${vicine.length ? `<div class="tp-top">${vicine.slice(0, 4).map((x) => `<span>${esc(x.name.length > 34 ? x.name.slice(0, 34) + "…" : x.name)}<small>${n2(x.historicalAverage, 1)}</small></span>`).join("")}</div>` : ""}
      <button type="button" class="btn btn-white btn-sm" data-k="tab" data-v="mete" style="margin-top:12px">Vedi tutte le mete →</button>`;
    const mr = el.querySelector("[data-meta-ris]"), sel = m.find((x) => x.code === d.meta);
    if (mr) mr.innerHTML = sel ? (() => { const avg = sel.historicalAverage ?? ME().mediaGenerale, p = prob(r.tot, avg), ok = reqOk(sel, d);
      return `<div class="tp-meta"><div><b>${esc(sel.name)}</b><span class="small muted">${esc(sel.country.trim())} · ${sel.places} posti · ${sel.durationMonths} mesi</span></div>
        <div class="tp-meta-n"><span>Media ultima graduatoria</span><b>${n2(avg)}</b>${sel.historicalAverage == null ? '<small>media generale: questa sede non ha storico</small>' : ""}</div>
        <span class="tp-prob ${PROB[p][1]}">${PROB[p][0]}</span>
        ${ok === false ? `<p class="small" style="color:var(--red,#9b2c2c)">${icon("alert")} Requisito di lingua: ${esc(sel.languageRequirement)}</p>` : ""}${d.anno < (sel.minYear || 1) ? `<p class="small" style="color:#9b2c2c">${icon("alert")} Si parte dal ${["", "I", "II", "III"][sel.minYear]} anno</p>` : ""}</div>`; })() : "";
    // elenco delle mete
    const q = (d.q || "").toLowerCase().trim();
    const L = m.filter((x) => (!d.paese || x.country.trim() === d.paese) && (!d.mesi || x.durationMonths === Number(d.mesi)) && (!d.conMedia || x.historicalAverage != null) && (!d.soloFav || d.fav.includes(x.code))
      && (!q || `${x.name} ${x.code} ${x.country}`.toLowerCase().includes(q)) && (!d.portata || ["very", "likely"].includes(prob(r.tot, x.historicalAverage ?? ME().mediaGenerale))));
    el.querySelector("[data-mete-n]").textContent = `${L.length} mete${L.length !== m.length ? " su " + m.length : ""} · confrontate con il tuo punteggio di ${n2(r.tot, 1)}`;
    el.querySelector("[data-mete]").innerHTML = L.slice(0, d.quante).map((x) => { const avg = x.historicalAverage ?? ME().mediaGenerale, p = prob(r.tot, avg), ok = reqOk(x, d), fav = d.fav.includes(x.code);
      return `<article class="tp-meta-c"><div class="tp-mc-top"><span class="tp-paese">${esc(x.country.trim())}</span><button type="button" class="tp-fav ${fav ? "on" : ""}" data-fav="${esc(x.code)}" aria-label="${fav ? "Togli dalle salvate" : "Salva"}">${fav ? "★" : "☆"}</button></div>
        <h4>${esc(x.name)}</h4><span class="tiny muted">${esc(x.code)}</span>
        <div class="tp-mc-dati"><span>${x.places} ${x.places === 1 ? "posto" : "posti"}</span><span>${x.durationMonths} mesi</span><span>${esc((x.languageRequirement || "nessun requisito").replace(/^nessuno$/i, "nessun requisito di lingua"))}${ok === false ? " ⚠" : ""}</span>${x.minYear > 1 ? `<span>dal ${["", "I", "II", "III"][x.minYear]} anno</span>` : ""}</div>
        <div class="tp-mc-fondo"><div><small>media storica</small><b>${x.historicalAverage == null ? "—" : n2(x.historicalAverage, 1)}</b></div><span class="tp-prob ${PROB[p][1]}">${PROB[p][0]}</span></div>
        <div class="tp-mc-link">${x.factsheet ? `<a href="${esc(x.factsheet)}" target="_blank" rel="noopener">Scheda della sede</a>` : ""}${x.courses ? `<a href="${esc(x.courses)}" target="_blank" rel="noopener">Corsi</a>` : ""}<span style="flex:1"></span>${cmpBtn(d, x.code)}</div></article>`; }).join("") || '<div class="card empty">Nessuna meta con questi filtri.</div>';
    el.querySelector("[data-piu]").hidden = L.length <= d.quante;
    el.querySelector("[data-tray]").innerHTML = trayHtml(d, (c) => { const x = m.find((y) => y.code === c); return x ? x.name.slice(0, 24) : c; });
  }

  /* ======================= CONFRONTO fianco a fianco (fino a 3), per mete Erasmus e magistrali ======================= */
  const MAXC = 3;
  const cmpBtn = (d, id) => `<button type="button" class="tp-cmpb ${d.cmp.includes(id) ? "on" : ""}" data-cmp="${esc(id)}">${d.cmp.includes(id) ? "✓ Nel confronto" : "+ Confronta"}</button>`;
  const trayHtml = (d, nome) => d.cmp.length ? `<div class="tp-tray"><span>${d.cmp.length} ${d.cmp.length === 1 ? "selezionato" : "selezionati"} · fino a ${MAXC}</span><div class="tp-tray-n">${d.cmp.map((id) => `<em>${esc(nome(id))}<button type="button" data-cmp="${esc(id)}" aria-label="Togli">×</button></em>`).join("")}</div><button type="button" class="btn btn-orange btn-sm" data-cmp-apri ${d.cmp.length < 2 ? "disabled" : ""}>Confronta${d.cmp.length < 2 ? " (almeno 2)" : ""}</button></div>` : "";
  const apriConfronto = (titolo, cols, righe) => {
    const ov = document.createElement("div"); ov.className = "tp-cmp-ov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true");
    ov.innerHTML = `<div class="tp-cmp card"><div class="tp-cmp-h"><h2>${titolo}</h2><button type="button" class="btn btn-ghost btn-sm" data-chiudi>Chiudi</button></div>
      <div class="tp-cmp-t" style="--n:${cols.length}"><div class="tp-cmp-k"></div>${cols.map((c) => `<div class="tp-cmp-c"><span class="tp-paese">${esc(c.sopra)}</span><b>${esc(c.nome)}</b></div>`).join("")}
        ${righe.map(([k, f, meglio]) => { const v = cols.map(f); const best = meglio ? meglio(v) : -1; return `<div class="tp-cmp-k">${k}</div>${v.map((x, i) => `<div class="tp-cmp-v ${i === best ? "best" : ""}">${x}</div>`).join("")}`; }).join("")}</div></div>`;
    document.body.appendChild(ov); document.body.style.overflow = "hidden";
    const chiudi = () => { ov.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", esc2); };
    const esc2 = (e) => e.key === "Escape" && chiudi(); document.addEventListener("keydown", esc2);
    ov.addEventListener("click", (e) => { if (e.target === ov || e.target.closest("[data-chiudi]")) chiudi(); });
  };
  const migliore = (dir) => (v) => { const n = v.map((x) => parseFloat(String(x).replace(/<[^>]*>/g, "").replace(",", ".").replace(/[^\d.]/g, ""))); const ok = n.filter((x) => !isNaN(x)); if (ok.length < 2) return -1; const t = dir > 0 ? Math.max(...ok) : Math.min(...ok); return n.filter((x) => x === t).length > 1 ? -1 : n.indexOf(t); };

  /* ======================= 4 · MAGISTRALI E MASTER (v16: semplice) =======================
     Commento di Matteo (9/10): «così è overwhelming; la maggior parte di chi studia in un'università pubblica non sa niente di
     queste cose». Ora: 1) quattro domande con risposte grandi e illustrate; 2) «Consigliati per te» (6 schede grandi, con logo,
     un'immagine della città e il perché); 3) le parole da sapere; 4) solo se lo chiedi, «Esplora tutti» con due filtri.
     Dati: i 163 programmi del sito attuale + le 7 magistrali della Scuola di Economia UniFi (pagina «Offerta formativa», 9/10/2026). */
  const UNIFI = [
    ["Accounting, Auditing e Controllo", "Italiano", "AUD CF", "Per chi vuole fare il commercialista, il revisore o il controller in azienda."],
    ["Governo e direzione d'impresa", "Italiano", "CON MKT ENT", "Per chi vuole guidare un'impresa: strategia, organizzazione, marketing."],
    ["Finance and Risk Management", "Inglese", "FIN Q CF", "Per chi vuole lavorare in banca, nella finanza o nella gestione del rischio."],
    ["Economia, istituzioni, sostenibilità (EIS)", "Italiano e inglese", "ECO", "Per chi è interessato a politiche economiche, istituzioni, ambiente e territorio."],
    ["Economics and Development", "Inglese", "ECO", "Per chi vuole lavorare nello sviluppo, nella cooperazione e nelle organizzazioni internazionali."],
    ["Design of Sustainable Tourism Systems", "Inglese", "MKT ENT", "Per chi vuole progettare il turismo sostenibile, in impresa o nei territori."],
    ["Statistica e data science", "Italiano", "DATA Q", "Per chi ama i numeri: analisi dei dati, statistica, modelli."],
  ];
  const AREA_COD = { FIN: "Finance / IB / PE", CF: "Corporate Finance / FP&A", Q: "Quant / Risk", CON: "Consulting / Strategy", MKT: "Marketing / Sales", DATA: "Data / Analytics", FT: "Fintech / Data", ECO: "Economics / Institutions", ENT: "Entrepreneurship", AUD: "Audit / Accounting / Tax", OPS: "Operations / Supply Chain" };
  const PR = () => { if (!window.UL_PROGRAMMI_TUTTI) { const base = (window.UL_PROGRAMMI || []).filter((p) => !/FIRENZE/i.test(p.school));
      window.UL_PROGRAMMI_TUTTI = UNIFI.map(([prog, lingua, aree, perChi], i) => ({ id: "unifi" + i, tier: "U", cems: false, school: "UNIVERSITÀ DI FIRENZE", program: prog, loc: "Firenze, Italia", durata: "2 anni", retta: "Contributo in base all'ISEE", lingua, aree: aree.split(" ").map((k) => AREA_COD[k]), test: "Laurea triennale in Economia; serve il nulla osta del corso per l'accesso.", url: "https://www.economia.unifi.it/vp-49-lauree-magistrali.html", perChi })).concat(base); }
    return window.UL_PROGRAMMI_TUTTI; };
  const REG = [["UK & Irlanda", /Regno Unito|Irlanda/], ["Italia", /Italia/], ["Francia", /Francia/], ["Germania", /Germania/], ["Spagna", /Spagna/], ["Olanda", /Paesi Bassi|Olanda/], ["BELUX", /Belgio|Lussemburgo/], ["Svizzera", /Svizzera/], ["Austria", /Austria/], ["Portogallo", /Portogallo/], ["Nordics", /Danimarca|Svezia|Norvegia|Finlandia/], ["East EU", /Polonia|Cechia|Ungheria|Slovenia|Romania|Slovacchia|Croazia|Estonia|Lettonia|Lituania|Bulgaria/], ["Asia", /Singapore|Cina|Hong Kong|Giappone|Corea|India/]];
  const regione = (p) => (REG.find(([, r]) => r.test(p.loc || "")) || ["Altro"])[0];
  const mesi = (p) => { const m = String(p.durata || "").match(/(\d+)/); return m ? Number(m[1]) : null; };
  const fascia = (p) => { const m = mesi(p); return m == null ? "" : m <= 12 ? "12" : m <= 18 ? "18" : "24"; };
  const TIER = { U: ["La tua università", "tg-u"], T: ["Target", "tg-t"], S: ["Semi-target", "tg-s"], R: ["Regional", "tg-r"] };
  // costo indicativo all'anno: «ISEE / pubblica» = basso; altrimenti il primo importo della retta (in € o £)
  const costo = (p) => { const r = String(p.retta || ""); if (/ISEE|pubblic|Contributo/i.test(r)) return 1500; const m = r.replace(/\./g, "").match(/(\d{3,6})/); if (!m) return null; let v = Number(m[1]) * (/£/.test(r) ? 1.17 : 1); if (!/anno/i.test(r) && mesi(p) > 12) v = v / 2; return v; };
  const fasciaCosto = (p) => { const c = costo(p); return c == null ? "?" : c <= 4000 ? "basso" : c <= 12000 ? "medio" : "alto"; };
  const COSTO_T = { basso: "€ · costo basso", medio: "€€ · costo medio", alto: "€€€ · costo alto", "?": "costo da verificare" };
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } };
  const sigla = (s) => s.replace(/[—–-].*$/, "").replace(/UNIVERSIT[ÀA]|UNIVERSITY|OF|DI|DE|THE|SCHOOL|BUSINESS|COLLEGE/gi, " ").trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("") || s[0];
  const logo = (p) => { const h = host(p.url); return `<span class="mg-logo" data-sigla="${esc(sigla(p.school))}">${h ? `<img src="https://www.google.com/s2/favicons?domain=${esc(h)}&sz=64" alt="" loading="lazy" onerror="this.remove()">` : ""}</span>`; };
  const CITTA_COL = { "Italia": ["#172554", "#cf7527"], "UK & Irlanda": ["#1d3a8a", "#9b2c2c"], "Francia": ["#23408e", "#c8553d"], "Olanda": ["#1f4e79", "#e07b29"], "Spagna": ["#8a1c1c", "#e0a526"], "Germania": ["#2b2b2b", "#c8a227"], "Svizzera": ["#9b2c2c", "#e8e1d4"] };
  const banner = (p) => { const reg = regione(p), [a, b] = CITTA_COL[reg] || ["#172554", "#4b5675"], citta = (p.loc || "").split(",")[0].split("/")[0].trim();
    return `<div class="mg-ban" style="--a:${a};--b:${b}"><svg viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70V52h18V38h14v14h10V28h8v-8h6v8h8v24h12V34h16v18h10V44h14V22l10-10 10 10v30h12V40h18v12h8V30h6v-8h8v8h6v22h14V36h20v16h10V46h16v24z" fill="rgba(255,255,255,.18)"/></svg><span>${esc(citta)}</span><em>${esc(reg === "UK & Irlanda" ? "Regno Unito / Irlanda" : reg)}</em></div>`; };
  // le 4 domande
  const DOM = [
    ["cosa", "Cosa ti piacerebbe fare dopo?", "Scegli quello che ti attira di più: non è una scelta per la vita.", [
      ["fin", "Finanza e banche", "Investimenti, mercati, banche", "FIN CF Q"], ["con", "Consulenza e strategia", "Aiutare le aziende a crescere", "CON"],
      ["mkt", "Marketing e comunicazione", "Brand, clienti, prodotti", "MKT"], ["dati", "Dati e numeri", "Analisi, statistica, tecnologia", "DATA FT Q"],
      ["aud", "Contabilità e controllo", "Bilanci, revisione, fisco", "AUD"], ["eco", "Economia e società", "Istituzioni, sviluppo, sostenibilità", "ECO"],
      ["ent", "Creare un'impresa", "Startup, innovazione", "ENT"], ["boh", "Non lo so ancora", "Ti mostriamo un po' di tutto", ""]]],
    ["dove", "Dove vorresti studiare?", "", [["firenze", "Restare a Firenze", "Le magistrali della tua Scuola"], ["italia", "In Italia", "Firenze, Milano, Roma, Bologna…"], ["estero", "All'estero", "Europa e non solo"], ["tutto", "Non importa", "Fammi vedere tutto"]]],
    ["lingua", "In che lingua?", "", [["it", "Preferisco l'italiano", "Corsi in italiano"], ["en", "L'inglese va bene", "La maggior parte dei master è in inglese"], ["tutto", "Non importa", ""]]],
    ["soldi", "Quanto potresti spendere all'anno?", "Le università pubbliche costano in base all'ISEE: spesso meno di 2.000 € l'anno.", [["basso", "Il meno possibile", "Università pubbliche"], ["medio", "Fino a circa 12.000 €", ""], ["alto", "Anche di più", "Business school private"], ["tutto", "Non lo so", ""]]],
  ];
  const ICO_DOM = { fin: "€", con: "◆", mkt: "★", dati: "▤", aud: "≡", eco: "◎", ent: "✦", boh: "?", firenze: "F", italia: "IT", estero: "EU", tutto: "∗", it: "IT", en: "EN", basso: "€", medio: "€€", alto: "€€€" };
  const defMag = (u) => ({ ris: {}, passo: 0, fatto: false, esplora: false, q: "", reg: "", area: "", fav: [], cmp: [], quante: 12, aperto: "" });
  const punteggio = (p, R) => { let s = 0; const why = [];
    const cod = (DOM[0][3].find((o) => o[0] === R.cosa) || [])[3] || "";
    if (cod) { const want = cod.split(" ").map((k) => AREA_COD[k]), hit = (p.aree || []).filter((a) => want.includes(a)); if (hit.length) { s += 4 + hit.length; why.push("è nell'area che ti interessa"); } else s -= 3; }
    if (R.dove === "firenze") { if (p.tier === "U") { s += 6; why.push("è a Firenze, nella tua Scuola"); } else if (/Italia/.test(p.loc)) s += 1; else s -= 4; }
    if (R.dove === "italia") { if (/Italia/.test(p.loc)) { s += 4; why.push("è in Italia"); } else s -= 4; }
    if (R.dove === "estero") { if (!/Italia/.test(p.loc)) { s += 3; why.push("è all'estero"); } else s -= 3; }
    if (R.lingua === "it") { if (/Italiano/.test(p.lingua || "")) { s += 4; why.push("si studia in italiano"); } else s -= 2; }
    if (R.soldi && R.soldi !== "tutto") { const f = fasciaCosto(p), ord = { basso: 0, medio: 1, alto: 2, "?": 1 }; if (ord[f] <= ord[R.soldi]) { s += 2; if (f === "basso") why.push("costa poco"); } else s -= 3 * (ord[f] - ord[R.soldi]); }
    if (p.tier === "T") s += 0.6; if (p.tier === "U") s += 0.8;
    return { s, why }; };
  function htmlMag(u) {
    dati(u, "magistrali", defMag(u));
    return `<div class="mg" data-mg></div><div data-tray></div>`;
  }
  const cardMag = (p, d, why) => { const fav = d.fav.includes(p.id);
    return `<article class="mg-card">${banner(p)}<div class="mg-body"><div class="mg-testa">${logo(p)}<div><span class="mg-scuola">${esc(p.school)}</span><span class="tp-tier ${TIER[p.tier][1]}">${TIER[p.tier][0]}</span></div><button type="button" class="tp-fav ${fav ? "on" : ""}" data-fav="${esc(p.id)}" aria-label="${fav ? "Togli dai salvati" : "Salva"}">${fav ? "★" : "☆"}</button></div>
      <h4>${esc(p.program)}</h4>
      ${p.perChi ? `<p class="small">${esc(p.perChi)}</p>` : ""}
      <div class="mg-pill"><span>${esc(p.lingua || "")}</span><span>${esc(p.durata || "")}</span><span>${COSTO_T[fasciaCosto(p)]}</span></div>
      ${why && why.length ? `<p class="mg-why">${icon("check")} Te lo consigliamo perché ${esc(why.slice(0, 2).join(" e ").replace(" e è", " ed è"))}.</p>` : ""}
      ${d.aperto === p.id ? `<div class="tp-det"><span class="sq-label">Cosa serve per entrare</span><p class="small">${esc(p.test || "—")}</p><span class="sq-label">Retta</span><p class="small">${esc(p.retta || "—")}</p>${p.url ? `<a class="small" href="${esc(p.url)}" target="_blank" rel="noopener">Vai al sito del corso →</a>` : ""}</div>` : ""}
      <div class="tp-mag-az"><button type="button" class="link small" data-apri="${esc(p.id)}">${d.aperto === p.id ? "Chiudi" : "Scopri di più"}</button>${cmpBtn(d, p.id)}</div></div></article>`; };
  function risMag(el, d) {
    const box = el.querySelector("[data-mg]"), P = PR();
    if (!d.fatto) { // il questionario: una domanda alla volta
      const [k, tit, sotto, opts] = DOM[d.passo];
      box.innerHTML = `<section class="card mg-quiz"><div class="mg-qtop"><span class="sq-label">Domanda ${d.passo + 1} di ${DOM.length}</span><div class="mg-dots">${DOM.map((_, i) => `<i class="${i < d.passo ? "ok" : i === d.passo ? "on" : ""}"></i>`).join("")}</div></div>
        <h2>${tit}</h2>${sotto ? `<p class="muted">${sotto}</p>` : ""}
        <div class="mg-opts ${opts.length > 4 ? "molte" : ""}">${opts.map(([v, t, s2]) => `<button type="button" class="mg-opt ${d.ris[k] === v ? "on" : ""}" data-mg-r="${k}" data-v="${v}"><span class="mg-ic">${ICO_DOM[v] || "•"}</span><b>${t}</b>${s2 ? `<small>${s2}</small>` : ""}</button>`).join("")}</div>
        <div class="row mg-nav">${d.passo ? `<button type="button" class="btn btn-ghost btn-sm" data-mg-indietro>← Indietro</button>` : "<span></span>"}<button type="button" class="link small" data-mg-salta>Salta e mostrami tutto</button></div></section>
        <section class="mg-parole"><h3>Le parole da sapere</h3><div class="tp-come-g">${[["Magistrale", "I due anni dopo la triennale, in un'università italiana (laurea magistrale)."], ["MSc / Master", "Lo stesso livello all'estero: «Master of Science». Spesso dura 1 anno ed è in inglese."], ["Target", "Scuole dove le grandi aziende vanno a cercare laureati: aprono porte, ma sono selettive e costose."], ["GMAT", "Un test di logica e matematica che molte business school chiedono per entrare."]].map(([t, x]) => `<div class="card"><b>${t}</b><p class="small">${x}</p></div>`).join("")}</div></section>`;
      return;
    }
    const R = d.ris, cl = P.map((p) => Object.assign({ p }, punteggio(p, R))).sort((a, b) => b.s - a.s), top = cl.slice(0, 6);
    const riass = DOM.map(([k, , , o]) => (o.find((x) => x[0] === R[k]) || [, "—"])[1]).join(" · ");
    const q = (d.q || "").toLowerCase().trim(), L = P.filter((p) => (!q || `${p.school} ${p.program} ${p.loc}`.toLowerCase().includes(q)) && (!d.area || (p.aree || []).includes(d.area)) && (!d.reg || regione(p) === d.reg));
    box.innerHTML = `<section class="mg-res-h"><div><span class="sq-label">Consigliati per te</span><h2>Le magistrali che <span class="accent">fanno per te</span></h2><p class="small muted">${esc(riass)}</p></div><button type="button" class="btn btn-ghost btn-sm" data-mg-rifai>Rifai le domande</button></section>
      <div class="mg-grid">${top.map((x) => cardMag(x.p, d, x.why)).join("")}</div>
      ${d.fav.length ? `<p class="small" style="margin-top:12px">★ Hai salvato ${d.fav.length} ${d.fav.length === 1 ? "programma" : "programmi"}: li trovi in «Esplora tutti» con il filtro salvati.</p>` : ""}
      <section class="mg-esplora"><button type="button" class="btn btn-primary" data-mg-esplora>${d.esplora ? "Nascondi l'elenco completo" : `Esplora tutti i ${P.length} programmi`}</button>
        ${d.esplora ? `<div class="card mg-filtri"><input class="input" type="search" data-k="q" value="${esc(d.q)}" placeholder="Cerca università, corso o città">
          <select class="select" data-k="area"><option value="">Tutte le aree</option>${Object.values(AREA_COD).map((a) => `<option ${d.area === a ? "selected" : ""}>${esc(a)}</option>`).join("")}</select>
          <select class="select" data-k="reg"><option value="">Ovunque</option>${REG.map(([r]) => `<option ${d.reg === r ? "selected" : ""}>${esc(r)}</option>`).join("")}</select></div>
          <p class="small muted">${L.length} programmi</p><div class="mg-lista">${L.slice(0, d.quante).map((p) => `<div class="mg-riga">${logo(p)}<div><b>${esc(p.program)}</b><span class="small muted">${esc(p.school)} · ${esc(p.loc)}</span></div><span class="tp-tier ${TIER[p.tier][1]}">${TIER[p.tier][0]}</span><span class="small">${COSTO_T[fasciaCosto(p)]}</span>${cmpBtn(d, p.id)}</div>`).join("")}</div>
          ${L.length > d.quante ? `<button type="button" class="btn btn-ghost" data-piu style="margin-top:10px">Mostra altri</button>` : ""}` : ""}</section>
      <p class="tiny muted" style="margin-top:14px">I consigli sono un orientamento: rette, durate e requisiti cambiano ogni anno, verifica sempre sul sito del corso. Le magistrali UniFi sono quelle della Scuola di Economia (offerta 2026/27); le altre vengono dal tool «Master / Magistrale» di UniLink. I loghi servono solo a riconoscere le università.</p>`;
    el.querySelector("[data-tray]").innerHTML = trayHtml(d, (id) => { const p = P.find((x) => x.id === id); return p ? p.program.slice(0, 26) : id; });
  }
  const confrontaMag = (d) => { const cols = d.cmp.map((id) => PR().find((p) => p.id === id)).filter(Boolean).map((p) => Object.assign({ sopra: p.school, nome: p.program }, p));
    apriConfronto("Confronta i programmi", cols, [["Dove", (p) => esc(p.loc)], ["Classificazione", (p) => `<span class="tp-tier ${TIER[p.tier][1]}">${TIER[p.tier][0]}</span>${p.cems ? " · CEMS" : ""}`], ["Durata", (p) => esc(p.durata), migliore(-1)], ["Costo", (p) => esc(COSTO_T[fasciaCosto(p)]) + "<br><small>" + esc(p.retta) + "</small>"], ["Lingua", (p) => esc(p.lingua || "—")],
      ["Aree professionali", (p) => (p.aree || []).map(esc).join("<br>")], ["Test e profilo", (p) => esc(p.test || "—")], ["Link", (p) => p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">Sito del programma</a>` : "—"]]); };
  const confrontaEra = (d) => { const r = puntiErasmus(d); const cols = d.cmp.map((c) => ME().mete.find((m) => m.code === c)).filter(Boolean).map((m) => Object.assign({ sopra: m.country.trim(), nome: m.name }, m));
    apriConfronto("Confronta le mete", cols, [["Codice", (m) => esc(m.code)], ["Posti", (m) => m.places, migliore(1)], ["Durata", (m) => m.durationMonths + " mesi"], ["Lingua richiesta", (m) => esc((m.languageRequirement || "nessuna").replace(/^nessuno$/i, "nessuna")) + (reqOk(m, d) === false ? " ⚠" : "")], ["Da quale anno", (m) => ["", "I", "II", "III"][m.minYear || 1] + " anno"],
      ["Media ultima graduatoria", (m) => m.historicalAverage == null ? "—" : n2(m.historicalAverage, 1), migliore(-1)], [`Con il tuo ${n2(r.tot, 1)}`, (m) => { const p = prob(r.tot, m.historicalAverage ?? ME().mediaGenerale); return `<span class="tp-prob ${PROB[p][1]}">${PROB[p][0]}</span>`; }],
      ["Schede", (m) => [m.factsheet ? `<a href="${esc(m.factsheet)}" target="_blank" rel="noopener">Sede</a>` : "", m.courses ? `<a href="${esc(m.courses)}" target="_blank" rel="noopener">Corsi</a>` : ""].filter(Boolean).join(" · ") || "—"]]); };

  /* ======================= pezzi comuni ======================= */
  const comeFunziona = (L) => `<section class="tp-come"><h2>Come si <span class="accent">calcola</span></h2><div class="tp-come-g">${L.map(([n, t, x]) => `<div class="card"><span class="tp-cn">${n}</span><b>${t}</b><p class="small">${x}</p></div>`).join("")}</div></section>`;
  const HTML = { voto: htmlVoto, erasmus: htmlErasmus, magistrali: htmlMag }, RIS = { voto: risVoto, erasmus: risErasmus, magistrali: risMag };
  const DEF = { voto: defVoto, erasmus: defEra, magistrali: defMag };

  const origRender = base.render.bind(base), origMount = base.mount.bind(base);
  base.render = function (u, params) {
    if (params[0] === "media") { setTimeout(() => UL.app.go("#/app/strumenti/voto"), 0); params = ["voto"]; }
    const out = origRender(u, params);
    if (!PRO.includes(params[0])) return out;
    // si tiene la testata della vetrina (← Strumenti, gli altri strumenti, illustrazione e domanda) e si mette sotto lo strumento completo
    const i = out.indexOf('<section class="card vt-calcolo');
    const testa = (i > 0 ? out.slice(0, i) : out);
    return (params[0] === "magistrali" ? testa.replace(/ · i voti arrivano già dal tuo libretto/, "").replace("i voti arrivano già dal tuo libretto", "") : testa) + `<div class="tp-wrap" data-tp="${params[0]}">${HTML[params[0]](u)}</div><div class="tp-mobile" data-tp-mob></div>`;
  };
  base.mount = function (root, u, params) {
    const id = params[0] === "media" ? "voto" : params[0]; if (!PRO.includes(id)) return origMount(root, u, params);
    const el = root.querySelector("[data-tp]"); if (!el) return;
    const d = dati(u, id, DEF[id](u));
    const T = (u.activity.tool = u.activity.tool || {}); T[id] = (T[id] || 0) + 1; B.track("tool-" + id);
    const mob = root.querySelector("[data-tp-mob]");
    const aggiorna = () => { const fo = document.activeElement, fk = fo && el.contains(fo) && fo.dataset && fo.dataset.k, fc = fk && fo.selectionStart; RIS[id](el, d); if (fk) { const n = el.querySelector(`[data-k="${fk}"]`); if (n && n !== fo) { n.focus(); try { n.setSelectionRange(fc, fc); } catch (e) {} } } const big = el.querySelector(".tp-big"); mob.innerHTML = big ? `<span>${esc(el.querySelector("[data-ris] .sq-label").textContent)}</span>${big.outerHTML}` : ""; salvaPoi(); };
    const num = (k, v) => { const x = parseFloat(String(v).replace(",", ".")); return isNaN(x) ? d[k] : x; };
    el.addEventListener("input", (e) => {
      const k = e.target.dataset.k; if (!k) return;
      if (e.target.type === "checkbox") d[k] = e.target.checked;
      else if (e.target.type === "number" || e.target.type === "range") { d[k] = num(k, e.target.value); el.querySelectorAll(`[data-k="${k}"]`).forEach((x) => { if (x !== e.target && (x.type === "number" || x.type === "range")) x.value = d[k]; }); }
      else d[k] = e.target.value;
      if (["q", "paese", "mesi", "portata", "conMedia", "soloFav", "cems"].includes(k)) d.quante = id === "magistrali" ? 18 : 24;
      aggiorna();
    });
    el.addEventListener("change", (e) => { const t = e.target;
      if (t.dataset.k === "meta" || t.dataset.k === "paese" || t.dataset.k === "mesi") { d[t.dataset.k] = t.value; aggiorna(); }
      if (t.dataset.sv) { d.sim[t.dataset.sv].v = Number(t.value); aggiorna(); } if (t.dataset.sc) { d.sim[t.dataset.sc].cfu = Number(t.value); aggiorna(); }
      if (t.dataset.ll) { d.lingue[t.dataset.ll].l = t.value; aggiorna(); } });
    el.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.k && b.dataset.v !== undefined) { const k = b.dataset.k, v = b.dataset.v;
        if (/^anno\d$/.test(k)) d.anni[Number(k.slice(4))] = Number(v);
        else if (/^liv\d+$/.test(k)) d.lingue[Number(k.slice(3))].liv = v;
        else d[k] = isNaN(Number(v)) || ["cds", "modo", "tab", "area", "reg", "tier", "dur"].includes(k) || v === "" ? v : Number(v);
        if (["area", "reg", "tier", "dur"].includes(k)) d.quante = 18;
        if (k === "tab") { el.querySelector("[data-era-punteggio]").hidden = v !== "punteggio"; el.querySelector("[data-era-mete]").hidden = v !== "mete"; el.querySelectorAll('.tp-tabs [data-k="tab"]').forEach((x) => x.classList.toggle("on", x.dataset.v === v)); window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 90, behavior: "smooth" }); }
        if (k === "modo") { el.querySelector("[data-ob-media]").hidden = v !== "media"; el.querySelector("[data-ob-voto]").hidden = v !== "voto"; }
        const g = b.closest(".tp-seg"); g && g.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
        aggiorna(); return; }
      if (b.dataset.st) { d[b.dataset.st] = clamp((d[b.dataset.st] || 0) + Number(b.dataset.d), 0, 20); el.querySelector("[data-v-lodi]").textContent = d.lodi; aggiorna(); }
      if (b.hasAttribute("data-sim-add")) { d.sim.push({ v: 27, cfu: 9 }); aggiorna(); }
      if (b.dataset.sx) { d.sim.splice(Number(b.dataset.sx), 1); aggiorna(); }
      if (b.hasAttribute("data-lng-add")) { d.lingue.push({ l: LINGUE.find((l) => !d.lingue.some((x) => x.l === l)) || "Altra lingua", liv: "B1" }); aggiorna(); }
      if (b.dataset.lx) { d.lingue.splice(Number(b.dataset.lx), 1); aggiorna(); }
      if (b.dataset.fav) { const i = d.fav.indexOf(b.dataset.fav); i >= 0 ? d.fav.splice(i, 1) : d.fav.push(b.dataset.fav); aggiorna(); const n = el.querySelector(".tp-favn"); if (n) n.textContent = `★ ${d.fav.length} salvate`; }
      if (b.hasAttribute("data-piu")) { d.quante += id === "magistrali" ? 18 : 24; aggiorna(); }
      if (b.dataset.cmp) { const i = d.cmp.indexOf(b.dataset.cmp); if (i >= 0) d.cmp.splice(i, 1); else if (d.cmp.length >= MAXC) { UL.ui.toast(`Puoi confrontarne fino a ${MAXC}: togline uno`); return; } else d.cmp.push(b.dataset.cmp); aggiorna(); }
      if (b.hasAttribute("data-cmp-apri")) { (id === "magistrali" ? confrontaMag : confrontaEra)(d); }
      if (b.dataset.mgR) { d.ris[b.dataset.mgR] = b.dataset.v; if (d.passo < DOM.length - 1) d.passo++; else d.fatto = true; aggiorna(); el.scrollIntoView({ block: "start" }); window.scrollBy(0, -90); return; }
      if (b.hasAttribute("data-mg-indietro")) { d.passo = Math.max(0, d.passo - 1); aggiorna(); return; }
      if (b.hasAttribute("data-mg-salta")) { d.fatto = true; d.esplora = true; aggiorna(); return; }
      if (b.hasAttribute("data-mg-rifai")) { d.fatto = false; d.passo = 0; aggiorna(); return; }
      if (b.hasAttribute("data-mg-esplora")) { d.esplora = !d.esplora; aggiorna(); return; }
      if (b.dataset.apri) { d.aperto = d.aperto === b.dataset.apri ? "" : b.dataset.apri; aggiorna(); }
      if (b.hasAttribute("data-azzera")) { Object.assign(d, { q: "", reg: "", area: "", tier: "", dur: "", cems: false, soloFav: false, quante: 18 }); el.querySelector('[data-k="q"]').value = ""; el.querySelectorAll(".tp-mag-f input[type=checkbox]").forEach((x) => (x.checked = false)); aggiorna(); }
    });
    aggiorna();
  };
})();
