/* js/views/libretto.js — web app v9 · commenti «Il mio percorso» del 7/10.
   1 LIBRETTO E VOTO DI LAUREA (commento 5, proposta D43): dentro «I miei esami» (scheda «Libretto e voto di laurea»), non una sezione
     a parte. Regole UFFICIALI della Scuola di Economia e Management UniFi per EA ed EC («Modalità di svolgimento della prova finale
     delle lauree di I livello ex DM 270», approvate il 20/6/2017, integrate il 22/5/2018): voto di presentazione = media ponderata
     × 110/30 + 0,333 per lode; produttività 0–3; rapidità 0–2; prova finale 1–3; arrotondamento all'intero; lode con 110,
     presentazione ≥ 104,5 e prova finale «ottimo». Lo strumento «Voto di laurea» (tools.js) usa le stesse regole.
   2 «COM'È ANDATO L'ESAME?» (commento 4, proposta D22): il giorno dopo la data d'appello, in Dashboard, un questionario breve e
     obbligatorio per continuare. Le risposte vanno nel profilo (il voto entra da solo nel libretto) e nel database del team
     (demo: localStorage «ul_esiti_db»; in produzione la tabella «esiti» di Supabase), visibile in Metriche e nel Kit per esame. */
(function () {
  const UL = window.UL, B = UL.B, U = UL.U;
  const { icon, esc, fmtDate } = UL.ui;
  const n2 = (x, d = 2) => (x == null || isNaN(x) ? "—" : Number(x).toLocaleString("it-IT", { minimumFractionDigits: d, maximumFractionDigits: d }));
  const REG = {
    nome: "Scuola di Economia e Management UniFi · lauree triennali (EA, EC)",
    fonte: "Modalità di svolgimento della prova finale delle lauree di I livello ex DM 270 (approvate il 20/6/2017, integrate il 22/5/2018)",
    url: "https://www.economia.unifi.it/upload/sub/tesi-di-laurea/modalit%C3%A0%20di%20svolgimento%20prova%20finale%2022.05.2018.pdf",
    lode: 0.333, sogliaLode: 104.5,
    regole: [["Voto di presentazione", "Media dei voti pesata sui CFU, portata in centodecimi (× 110/30), + 0,333 per ogni lode"],
      ["Produttività in itinere · 0–3", "Per ogni anno solare da studente regolare: 1 punto con 40 CFU o più, 0,5 con 20–39 CFU, 0 sotto i 20"],
      ["Rapidità · 0–2", "2 punti se ti laurei entro il 31 dicembre del III anno, 1 entro il 30 aprile successivo, poi 0"],
      ["Prova finale · 1–3", "1 sufficiente · 2 buono · 3 ottimo, la decide la Commissione"],
      ["Voto e lode", "Si sommano le quattro parti e si arrotonda all'intero più vicino (massimo 110). Lode: 110, presentazione ≥ 104,5 e prova finale «ottimo»"]],
  };
  const lib = (u) => (u.activity.libretto = Object.assign({ prod: [1, 1, 1], rap: 2, tesi: 2, obiettivo: 105, mediaPrev: 27 }, u.activity.libretto || {}));
  const fatti = (u) => u.activity.exams.filter((e) => e.status === "done" && Number(e.voto)).map((e) => ({ e, c: B.course(e.slug) })).filter((x) => x.c);
  const cfuDi = (c) => ((UL.ORE && UL.ORE.esami[c.code]) || {}).cfu || c.cfu || 9;
  U.calcoloLaurea = (u) => {
    const L = lib(u), F = fatti(u), cfu = F.reduce((s, x) => s + cfuDi(x.c), 0), lodi = F.filter((x) => x.e.lode).length;
    const media = cfu ? F.reduce((s, x) => s + Number(x.e.voto) * cfuDi(x.c), 0) / cfu : null;
    const resto = Math.max(0, 180 - cfu - 21); // ~21 CFU tra prova finale, idoneità e attività a scelta senza voto (stima)
    const mediaFin = media == null ? L.mediaPrev : (media * cfu + L.mediaPrev * resto) / Math.max(1, cfu + resto);
    const pres = (mediaFin * 110) / 30 + lodi * REG.lode, prod = Math.min(3, L.prod.reduce((a, b) => a + b, 0));
    const tot = pres + prod + L.rap + L.tesi, voto = Math.min(110, Math.round(tot)), lode = voto >= 110 && pres >= REG.sogliaLode && L.tesi === 3;
    // media che serve negli esami che restano per arrivare all'obiettivo (con gli stessi bonus)
    const presServe = L.obiettivo - prod - L.rap - L.tesi - lodi * REG.lode, mediaTot = (presServe * 30) / 110;
    const serve = resto ? (mediaTot * (cfu + resto) - (media || 0) * cfu) / resto : null;
    return { F, cfu, lodi, media, resto, mediaFin, pres, prod, tot, voto, lode, serve, L };
  };
  const gauge = (v) => { const p = Math.max(0, Math.min(1, (v - 66) / (110 - 66))), a = Math.PI * (1 - p), x = 100 + 80 * Math.cos(a), y = 100 - 80 * Math.sin(a);
    return `<svg viewBox="0 0 200 112" class="lb-gauge" role="img" aria-label="Voto stimato ${v} su 110"><path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--beige)" stroke-width="16" stroke-linecap="round"/><path d="M20 100 A80 80 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}" fill="none" stroke="var(--orange)" stroke-width="16" stroke-linecap="round"/><text x="100" y="92" text-anchor="middle" class="lb-g-v">${v}</text><text x="100" y="108" text-anchor="middle" class="lb-g-s">su 110</text></svg>`; };
  U.librettoHTML = (u) => {
    const cds = u.profile.cds || "EA", ok = ["EA", "EC"].includes(cds), R = U.calcoloLaurea(u), L = R.L;
    const seg = (k, opts, cur) => `<div class="seg">${opts.map(([v, t]) => `<button type="button" class="${String(v) === String(cur) ? "on" : ""}" data-lb="${k}" data-v="${v}">${t}</button>`).join("")}</div>`;
    return `${ok ? "" : `<div class="banner" style="margin-bottom:14px">${icon("info")}<span>Le regole qui sotto sono quelle della Scuola di Economia (EA ed EC). Per il tuo corso arrivano quando apre il suo hub.</span></div>`}
      <div class="grid g-ov">
        <section class="card navy c-5 lb-top">${gauge(R.voto)}<p style="text-align:center;margin-top:4px">${R.lode ? '<span class="badge badge-orange">con lode</span>' : `<span class="small" style="color:rgba(255,255,255,.75)">voto di laurea stimato · totale ${n2(R.tot)}</span>`}</p>
          <div class="lb-parti">${[["Presentazione", n2(R.pres, 3)], ["Produttività", n2(R.prod, 1)], ["Rapidità", L.rap], ["Prova finale", L.tesi]].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("")}</div></section>
        <section class="c-7 stack">
          <div class="stats"><div class="stat"><span class="k">${icon("calc")} Media ponderata</span><span class="v">${n2(R.media)}</span><span class="s">${R.F.length} esami · ${R.cfu} CFU · ${R.lodi} lodi</span></div>
            <div class="stat"><span class="k">${icon("target")} Per arrivare a ${L.obiettivo}</span><span class="v">${R.serve == null ? "—" : R.serve > 30 ? "oltre 30" : n2(Math.max(18, R.serve))}</span><span class="s">media che serve nei ${R.resto} CFU che restano${R.serve != null && R.serve > 30 ? " · obiettivo non raggiungibile" : ""}</span></div></div>
          <div class="card"><div class="lb-campi">
            <label>Media prevista negli esami che restano <b>${n2(L.mediaPrev, 1)}</b><input type="range" min="18" max="30" step="0.5" value="${L.mediaPrev}" data-lbr="mediaPrev"></label>
            <label>Voto obiettivo <b>${L.obiettivo}</b><input type="range" min="66" max="110" step="1" value="${L.obiettivo}" data-lbr="obiettivo"></label>
            <div><span class="sq-label">Produttività · CFU per anno solare da regolare</span><div class="lb-anni">${[0, 1, 2].map((i) => `<div><small>${i + 1}° anno</small>${seg("prod" + i, [[1, "40+"], [0.5, "20–39"], [0, "&lt;20"]], L.prod[i])}</div>`).join("")}</div></div>
            <div><span class="sq-label">Rapidità · quando ti laurei</span>${seg("rap", [[2, "Entro il 31/12 del III anno"], [1, "Entro il 30/4"], [0, "Dopo"]], L.rap)}</div>
            <div><span class="sq-label">Prova finale</span>${seg("tesi", [[1, "Sufficiente"], [2, "Buono"], [3, "Ottimo"]], L.tesi)}</div></div></div>
        </section>
        <section class="card c-7"><div class="card-head"><h3>${icon("layers")} Il tuo libretto</h3><span class="small muted">i voti arrivano anche da «Com'è andato l'esame?»</span></div>
          ${R.F.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Esame</th><th class="num">CFU</th><th class="num">Voto</th><th>Lode</th></tr></thead><tbody>${R.F.map(({ e, c }) => `<tr><td>${esc(c.title)}</td><td class="num">${cfuDi(c)}</td><td class="num">${esc(e.voto)}</td><td>${Number(e.voto) === 30 ? `<label class="check"><input type="checkbox" data-lode="${c.slug}" ${e.lode ? "checked" : ""}> lode</label>` : ""}</td></tr>`).join("")}</tbody></table></div>`
            : '<p class="small muted">Nessun esame superato: segna un esame come «Superato» con il voto, oppure rispondi a «Com\'è andato l\'esame?» dopo l\'appello.</p>'}</section>
        <section class="card beige c-5"><span class="sq-label">Le regole · ${esc(REG.nome)}</span>
          <ul class="lb-regole">${REG.regole.map(([t, d]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join("")}</ul>
          <p class="tiny muted">Fonte: <a href="${REG.url}" target="_blank" rel="noopener">${esc(REG.fonte)} ↗</a>. La produttività si conta sugli anni solari: è una stima, decide la Commissione.</p></section>
      </div>`;
  };
  U.bindLibretto = (root, u) => {
    const L = lib(u), salva = () => { UL.store.save(); UL.app.refresh(); };
    root.querySelectorAll("[data-lb]").forEach((b) => b.addEventListener("click", () => { const k = b.dataset.lb, v = Number(b.dataset.v); if (k.startsWith("prod")) L.prod[Number(k.slice(4))] = v; else L[k] = v; salva(); }));
    root.querySelectorAll("[data-lbr]").forEach((r) => { r.addEventListener("input", () => { r.parentElement.querySelector("b").textContent = r.dataset.lbr === "mediaPrev" ? n2(Number(r.value), 1) : r.value; }); r.addEventListener("change", () => { L[r.dataset.lbr] = Number(r.value); salva(); }); });
    root.querySelectorAll("[data-lode]").forEach((c) => c.addEventListener("change", () => { const e = u.activity.exams.find((x) => x.slug === c.dataset.lode); if (e) e.lode = c.checked; salva(); }));
  };

  /* ---------- «Com'è andato l'esame?» ---------- */
  const DB = "ul_esiti_db";
  B.esitiDb = () => { try { return JSON.parse(localStorage.getItem(DB) || "[]"); } catch (e) { return []; } };
  const salvaDb = (r) => { try { const l = B.esitiDb(); l.push(r); localStorage.setItem(DB, JSON.stringify(l.slice(-500))); } catch (e) { /* storage non disponibile */ } };
  const ieri = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.toISOString().slice(0, 10); };
  // dal giorno dopo l'appello: data dell'appello prima di oggi, esame non ancora segnato come superato, nessuna risposta per quell'appello
  B.esitiInSospeso = (u) => u.activity.exams.filter((e) => e.appello && e.status !== "done" && String(e.appello).slice(0, 10) < ieri() && !(u.activity.esiti || []).some((x) => x.slug === e.slug && x.appello === e.appello) && B.course(e.slug));
  function questionario(u) {
    const e = B.esitiInSospeso(u)[0]; if (!e || document.querySelector(".es-q-modal")) return;
    const c = B.course(e.slug), caps = (UL.STRUTTURA && UL.STRUTTURA[c.slug]) ? UL.STRUTTURA[c.slug].moduli.flatMap((m) => m.capitoli) : [];
    const r = { dato: "", esito: "", voto: 27, lode: false, formato: "", minuti: "", domande: "", argomenti: [], diff: 0, utile: 0, ricordo: "" };
    const m = UL.ui.modal(`<div class="es-q-modal"><div class="modal-head"><div><span class="sq-label">Obbligatorio · 1 minuto</span><h2 style="margin-top:8px">Com'è andato l'esame di ${esc(c.title)}?</h2>
        <p class="small muted" style="margin-top:4px">Appello del ${fmtDate(e.appello)}. Le risposte ci servono per tenere aggiornate dispense e simulazioni (anonime per gli altri studenti). Il voto entra da solo nel tuo libretto.</p></div></div>
      <div data-q></div></div>`, { width: 640, obbligatorio: true }); // non si chiude con Esc né cliccando fuori
    const box = m.el.querySelector("[data-q]");
    const seg = (k, opts) => `<div class="seg" style="flex-wrap:wrap">${opts.map(([v, t]) => `<button type="button" class="${String(r[k]) === String(v) ? "on" : ""}" data-k="${k}" data-v="${v}">${t}</button>`).join("")}</div>`;
    const stelle = (k) => `<div class="seg">${[1, 2, 3, 4, 5].map((v) => `<button type="button" class="${r[k] === v ? "on" : ""}" data-k="${k}" data-v="${v}">${v}</button>`).join("")}</div>`;
    const draw = () => {
      box.innerHTML = `<div class="field"><label>Hai sostenuto l'esame?</label>${seg("dato", [["si", "Sì"], ["no", "No, l'ho rimandato"]])}</div>
        ${r.dato === "no" ? `<div class="field"><label for="es-nuova">Nuova data dell'appello (facoltativa)</label><input class="input" type="date" id="es-nuova"></div>` : ""}
        ${r.dato === "si" ? `<div class="field"><label>Com'è andata?</label>${seg("esito", [["superato", "Superato"], ["non", "Non superato"], ["ritirato", "Mi sono ritirato"]])}</div>
          ${r.esito === "superato" ? `<div class="field"><label for="es-voto">Voto</label><div class="row"><input class="input" type="number" min="18" max="30" id="es-voto" value="${r.voto}" style="max-width:110px"><label class="check"><input type="checkbox" id="es-lode" ${r.lode ? "checked" : ""}> lode</label></div></div>` : ""}
          <div class="field"><label>Com'era la prova?</label>${seg("formato", [["scritto", "Scritto"], ["orale", "Orale"], ["entrambi", "Scritto e orale"]])}</div>
          <div class="grid-2"><div class="field"><label for="es-min">Durata (minuti, facoltativa)</label><input class="input" type="number" min="0" id="es-min" value="${esc(r.minuti)}"></div><div class="field"><label for="es-dom">Numero di domande (facoltativo)</label><input class="input" type="number" min="0" id="es-dom" value="${esc(r.domande)}"></div></div>
          ${caps.length ? `<div class="field"><label>Su cosa ti hanno chiesto? (tocca i capitoli)</label><div class="chips">${caps.map((k) => `<button type="button" class="chip ${r.argomenti.includes(k.n) ? "on" : ""}" data-arg="${k.n}">${k.n} · ${esc(k.titolo)}</button>`).join("")}</div></div>` : ""}
          <div class="grid-2"><div class="field"><label>Difficoltà (1 facile · 5 difficilissimo)</label>${stelle("diff")}</div><div class="field"><label>Quanto ti è servito UniLink (1–5)</label>${stelle("utile")}</div></div>
          <div class="field"><label for="es-ric">Una domanda che ricordi (facoltativa: la rielaboriamo, non la copiamo)</label><textarea class="textarea" id="es-ric" rows="2" maxlength="500">${esc(r.ricordo)}</textarea></div>` : ""}
        <div class="row" style="justify-content:space-between;margin-top:14px"><span class="tiny muted">Serve per continuare: lo chiediamo una volta per appello.</span><button class="btn btn-primary" data-invia ${r.dato && (r.dato === "no" || (r.esito && r.formato && r.diff && r.utile)) ? "" : "disabled"}>Invia</button></div>`;
      const leggi = () => { const g = (id) => box.querySelector(id); if (g("#es-voto")) r.voto = Number(g("#es-voto").value) || r.voto; if (g("#es-lode")) r.lode = g("#es-lode").checked; if (g("#es-min")) r.minuti = g("#es-min").value; if (g("#es-dom")) r.domande = g("#es-dom").value; if (g("#es-ric")) r.ricordo = g("#es-ric").value; };
      box.querySelectorAll("[data-k]").forEach((b) => (b.onclick = () => { leggi(); const v = b.dataset.v; r[b.dataset.k] = /^\d+$/.test(v) ? Number(v) : v; draw(); }));
      box.querySelectorAll("[data-arg]").forEach((b) => (b.onclick = () => { leggi(); const n = Number(b.dataset.arg); r.argomenti = r.argomenti.includes(n) ? r.argomenti.filter((x) => x !== n) : r.argomenti.concat(n); draw(); }));
      box.querySelector("[data-invia]").onclick = () => {
        leggi(); const nuova = box.querySelector("#es-nuova");
        const rec = { slug: c.slug, codice: c.code, appello: e.appello, at: new Date().toISOString(), cds: u.profile.cds || "", anno: u.profile.anno || "", dato: r.dato, esito: r.esito, voto: r.esito === "superato" ? Math.min(30, Math.max(18, r.voto)) : null, lode: r.esito === "superato" && r.voto >= 30 && r.lode, formato: r.formato, minuti: Number(r.minuti) || null, domande: Number(r.domande) || null, argomenti: r.argomenti, difficolta: r.diff, utilita: r.utile, ricordo: r.ricordo.trim() };
        (u.activity.esiti = u.activity.esiti || []).push(rec); salvaDb(Object.assign({}, rec)); // nel database del team: senza nome né email
        if (r.dato === "no") { if (nuova && nuova.value) e.appello = nuova.value; else e.appello = ""; }
        else if (r.esito === "superato") { e.status = "done"; e.voto = String(rec.voto); e.lode = rec.lode; }
        UL.store.addLog(u, "esame", `Com'è andato: ${c.title}`); UL.store.save(); m.close(); UL.ui.toast(r.esito === "superato" ? "Grazie! Il voto è nel tuo libretto" : "Grazie, risposta salvata"); UL.app.refresh();
      };
    };
    draw();
  }
  // in Dashboard (e a ogni accesso), finché ci sono appelli passati senza risposta
  const orig = UL.views.dashboardU;
  UL.views.dashboardU = Object.assign({}, orig, { mount(r, u, p) { orig.mount && orig.mount(r, u, p); setTimeout(() => questionario(u), 300); } });
  // per il team: riepilogo del database degli esiti (sezione Metriche e Kit per esame)
  U.esitiRiepilogo = () => { const L = B.esitiDb(), per = {};
    L.forEach((x) => { const p = (per[x.slug] = per[x.slug] || { n: 0, sup: 0, voti: [], diff: [], util: [], args: {} }); p.n++; if (x.esito === "superato") { p.sup++; p.voti.push(x.voto); } if (x.difficolta) p.diff.push(x.difficolta); if (x.utilita) p.util.push(x.utilita); (x.argomenti || []).forEach((a) => (p.args[a] = (p.args[a] || 0) + 1)); });
    const m = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null);
    return Object.entries(per).map(([slug, p]) => ({ slug, n: p.n, sup: p.sup, voto: m(p.voti), diff: m(p.diff), util: m(p.util), args: Object.entries(p.args).sort((a, b) => b[1] - a[1]).slice(0, 3) })); };
})();
