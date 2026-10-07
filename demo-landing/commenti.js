// UniLink — commenti del team sulla demo della landing.
// Si commenta una pagina intera o una singola sezione; i commenti restano salvati nel browser (localStorage),
// si esportano in PDF / Markdown / JSON (il JSON si reimporta: i commenti dei founder si uniscono per id).
// Allo scarico i commenti esportati vengono ARCHIVIATI: spariscono da pagine e pannello (i commenti nuovi valgono per la
// versione successiva) ma restano nello «Storico esportazioni» della pagina Commenti, da cui si riscaricano o si ripristinano.
// In produzione (Framer) si spegne con UL_CFG.commenti.attivi = false. Indice: 1 dati · 2 sezioni · 3 pannello
// · 4 modalità «commenta» · 5 esportazione (PDF, Markdown, JSON) · 6 pagina rapporto (commenti.html)
(function () {
  "use strict";
  const CFG = window.UL_CFG;
  if (!CFG || !CFG.commenti || !CFG.commenti.attivi) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const PAGE = document.body.dataset.page || "home";
  const FILE = location.pathname.split("/").pop() || "index.html";
  const KEY = CFG.commenti.chiave || "ul-commenti-v1";
  const PAGINE = { home: ["S01", "Home"], "hub-economia": ["S02", "Hub Economia"], "hub-giurisprudenza": ["S03", "Hub Giurisprudenza"], "hub-medicina": ["S04", "Hub Medicina"], prima: ["S05", "Scegliere (Prima)"], durante: ["S06", "Studiare (Durante)"], dopo: ["S07", "Dopo la laurea"], tesi: ["S08", "Tesi e laurea"], tools: ["S09", "Strumenti"], area: ["S10", "Area personale"], community: ["S11", "Community"], prezzi: ["S12", "Prezzi (esempio)"], decidere: ["S90", "Da decidere"], commenti: ["—", "Commenti"], guida: ["S14", "Guida"], materiali: ["S15", "Materiali"], preview: ["S16", "Anteprima esame"] };
  const TIPI = [["testo", "Testo"], ["grafica", "Grafica"], ["struttura", "Struttura"], ["idea", "Idea"], ["errore", "Errore"], ["domanda", "Domanda"]];
  const TIPO = Object.fromEntries(TIPI);
  const dispositivo = () => (innerWidth <= 700 ? "telefono" : innerWidth <= 1100 ? "tablet" : "desktop");
  const toast = (t) => { const el = $("#toast"); if (!el) return alert(t); el.textContent = t; el.classList.add("vis"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("vis"), 3200); };

  /* ---------- 1 · dati ---------- */
  const leggi = () => { let d = null; try { d = JSON.parse(localStorage.getItem(KEY)); } catch (e) { d = null; } d = d && Array.isArray(d.commenti) ? d : { autore: "", commenti: [] }; if (!Array.isArray(d.storico)) d.storico = []; return d; };
  // storico: [{ id, data, autore, formato, file, versione, commenti: [...] }] · i commenti archiviati non tornano più (neanche importando)
  const archiviati = () => new Set(D.storico.flatMap((e) => e.commenti.map((c) => c.id)));
  let D = leggi();
  const salva = () => { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) { toast("Non riesco a salvare: lo spazio del browser è bloccato o pieno. Scarica i commenti adesso."); } };
  const uid = () => "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const quando = (iso) => new Date(iso).toLocaleString("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const pagKey = () => FILE + (PAGE === "decidere" && location.hash ? location.hash : "");
  const nomePag = (k) => { const f = k.split("#")[0].replace(".html", ""); const p = PAGINE[f === "index" ? "home" : f] || ["", f]; return { codice: p[0], nome: p[1] + (k.includes("#") ? " · " + k.split("#")[1] : "") }; };

  /* ---------- 2 · sezioni della pagina ---------- */
  const slug = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  let SEZ = [];
  function indicizza() {
    const main = $("main"); if (!main) return;
    const els = [...$$(":scope > section", main), ...$$("#decroot .dsez, #decroot .schermo", main)];
    const visti = {}; const pc = (PAGINE[PAGE] || ["", ""])[0];
    SEZ = els.map((el, i) => {
      const h = ((el.querySelector("h1,h2,.k,h3,.eyebrow") || {}).textContent || "").replace(/\s+/g, " ").trim();
      let id = slug(h) || "s" + (i + 1); visti[id] = (visti[id] || 0) + 1; if (visti[id] > 1) id += "-" + visti[id];
      const codice = el.dataset.code || pc + "." + (i + 1);
      const estratto = (el.innerText || "").replace(/\s+/g, " ").replace(/Commenti\s*\d*/g, "").trim().slice(0, 170);
      el.dataset.cmId = id; el.classList.add("cm-sec");
      return { el, id, codice, etichetta: h.slice(0, 70) || "Sezione " + (i + 1), estratto };
    });
  }
  const sezDi = (el) => { const s = el.closest(".cm-sec"); return s && SEZ.find((x) => x.el === s); };

  /* ---------- 3 · pannello ---------- */
  let tab = "qui", filtro = "aperti", modo = false, bozza = null;
  const qui = () => D.commenti.filter((c) => c.pagina === pagKey());
  const visibili = () => (tab === "qui" ? qui() : D.commenti).filter((c) => filtro === "tutti" || (filtro === "aperti" ? c.stato === "aperto" : c.stato === "risolto")).sort((a, b) => b.creato.localeCompare(a.creato));
  const ui = `
    <div class="cm-ui cm-fab"><button type="button" id="cm-open" aria-haspopup="dialog">Commenti <b>0</b></button></div>
    <div class="cm-ui cm-panel" id="cm-panel" role="dialog" aria-label="Commenti del team" hidden>
      <div class="cm-head"><div><h2>Commenti del team</h2><p>Demo v${CFG.versione.n} · salvati in questo browser</p></div><button type="button" id="cm-x" aria-label="Chiudi">✕</button></div>
      <div class="cm-body">
        <label class="cm-who">Il tuo nome<input id="cm-nome" placeholder="Es. Matteo" autocomplete="given-name"></label>
        <div class="cm-act"><button type="button" class="cm-btn pri" id="cm-add">+ Commenta una sezione</button><button type="button" class="cm-btn" id="cm-pg">+ Tutta la pagina</button></div>
        <div id="cm-comp"></div>
        <div class="cm-tabs" role="tablist"><button type="button" role="tab" data-t="qui">Questa pagina <b></b></button><button type="button" role="tab" data-t="tutti">Tutte <b></b></button></div>
        <div class="cm-flt" aria-label="Filtro">${[["aperti", "Aperti"], ["risolti", "Risolti"], ["tutti", "Tutti"]].map(([k, l]) => `<button type="button" data-f="${k}">${l}</button>`).join("")}</div>
        <div id="cm-list" aria-live="polite"></div>
      </div>
      <div class="cm-foot">
        <div class="cm-exp"><button type="button" class="cm-btn pri" data-e="pdf">Scarica PDF</button><button type="button" class="cm-btn" data-e="md">Markdown</button><button type="button" class="cm-btn" data-e="json">JSON</button><label class="cm-btn" tabindex="0">Importa<input type="file" id="cm-imp" accept=".json,application/json" hidden></label></div>
        <p class="small" id="cm-sto"></p>
        <a href="commenti.html">Apri il rapporto e lo storico →</a>
      </div>
    </div>
    <div class="cm-tag cm-ui" id="cm-tag" hidden></div>`;

  function badge() { const n = D.commenti.filter((c) => c.stato === "aperto").length; const b = $("#cm-open b"); if (b) b.textContent = n; }
  function pins() {
    $$(".cm-pin").forEach((p) => p.remove());
    SEZ.forEach((s) => { const n = qui().filter((c) => c.sezione && c.sezione.id === s.id).length; if (!n) return; if (getComputedStyle(s.el).position === "static") s.el.style.position = "relative"; s.el.insertAdjacentHTML("beforeend", `<button type="button" class="cm-pin cm-ui" data-pin="${s.id}" aria-label="${n} commenti su ${esc(s.etichetta)}">${n}</button>`); });
  }
  function riga(c) {
    const p = nomePag(c.pagina);
    return `<article class="cm-c ${c.stato}" data-id="${c.id}">
      <div class="cm-m"><span class="cm-t">${esc(TIPO[c.tipo] || "Commento")}</span><span>${esc(c.autore || "Anonimo")} · ${quando(c.creato)}</span></div>
      <div class="cm-w">${tab === "tutti" ? esc(p.codice + " " + p.nome) + " › " : ""}${c.sezione ? esc(c.sezione.codice + " · " + c.sezione.etichetta) : "Pagina intera"}</div>
      <p class="cm-p">${esc(c.testo).replace(/\n/g, "<br>")}</p>
      <div class="cm-r"><button type="button" data-a="vai">${tab === "tutti" && c.pagina !== pagKey() ? "Apri la pagina" : "Vai alla sezione"}</button><button type="button" data-a="stato">${c.stato === "aperto" ? "Segna risolto" : "Riapri"}</button><button type="button" data-a="mod">Modifica</button><button type="button" data-a="del">Elimina</button></div>
    </article>`;
  }
  function disegna() {
    badge(); pins();
    const st = $("#cm-sto"); if (st) st.textContent = D.storico.length ? `Scaricando, i commenti vengono archiviati. Storico: ${D.storico.length} esportazioni, ${D.storico.reduce((n, e) => n + e.commenti.length, 0)} commenti.` : "Scaricando, i commenti vengono archiviati nello storico (pagina Commenti).";
    const l = $("#cm-list"); if (!l) return;
    $$(".cm-tabs button").forEach((b) => { b.classList.toggle("on", b.dataset.t === tab); b.setAttribute("aria-selected", b.dataset.t === tab); $("b", b).textContent = b.dataset.t === "qui" ? qui().length : D.commenti.length; });
    $$(".cm-flt button").forEach((b) => b.classList.toggle("on", b.dataset.f === filtro));
    const v = visibili();
    l.innerHTML = v.length ? v.map(riga).join("") : `<p class="cm-vuoto">${D.commenti.length ? "Nessun commento in questo filtro." : "Ancora nessun commento. Premi «Commenta una sezione» e tocca la parte che vuoi migliorare."}</p>`;
    const comp = $("#cm-comp");
    comp.innerHTML = bozza ? `<form class="cm-form" id="cm-form"><div class="cm-w"><b>${bozza.id ? "Modifica" : "Nuovo commento"}</b> · ${bozza.sezione ? esc(bozza.sezione.codice + " · " + bozza.sezione.etichetta) : "pagina intera"}</div>
        <label>Tipo<select name="tipo">${TIPI.map(([k, t]) => `<option value="${k}" ${bozza.tipo === k ? "selected" : ""}>${t}</option>`).join("")}</select></label>
        <label>Cosa vorresti cambiare, e perché?<textarea name="testo" rows="4" required placeholder="Es. Il titolo è troppo lungo su telefono; vorrei una frase più semplice.">${esc(bozza.testo || "")}</textarea></label>
        <div class="cm-act"><button class="cm-btn pri" type="submit">Salva</button><button class="cm-btn" type="button" id="cm-ann">Annulla</button></div></form>` : "";
    if (bozza) $("textarea", comp).focus();
  }
  function apri(v) { const p = $("#cm-panel"); p.hidden = !v; document.body.classList.toggle("cm-on", v); if (v) { $("#cm-nome").value = D.autore || ""; disegna(); } else esciModo(); }

  /* ---------- 4 · modalità «commenta» ---------- */
  function entraModo() { modo = true; document.body.classList.add("cm-add"); $("#cm-add").textContent = "Tocca una sezione… (Esc per annullare)"; }
  function esciModo() { modo = false; document.body.classList.remove("cm-add"); $$(".cm-hot").forEach((e) => e.classList.remove("cm-hot")); const t = $("#cm-tag"); if (t) t.hidden = true; const b = $("#cm-add"); if (b) b.textContent = "+ Commenta una sezione"; }
  function nuovo(sez) { bozza = { sezione: sez ? { id: sez.id, codice: sez.codice, etichetta: sez.etichetta, estratto: sez.estratto } : null, tipo: "testo", testo: "" }; esciModo(); apri(true); disegna(); }
  document.addEventListener("mouseover", (e) => {
    if (!modo || e.target.closest(".cm-ui")) return; const s = sezDi(e.target); $$(".cm-hot").forEach((x) => x.classList.remove("cm-hot")); const t = $("#cm-tag");
    if (!s) { t.hidden = true; return; } s.el.classList.add("cm-hot"); const r = s.el.getBoundingClientRect(); t.hidden = false; t.textContent = "Commenta · " + s.codice + " " + s.etichetta; t.style.top = Math.max(8, Math.min(r.top + 8, innerHeight - 50)) + "px"; t.style.left = Math.max(8, r.left + 8) + "px";
  });
  document.addEventListener("click", (e) => {
    if (!modo || e.target.closest(".cm-ui")) return; const s = sezDi(e.target);
    e.preventDefault(); e.stopPropagation(); if (s) nuovo(s);
  }, true);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if (modo) esciModo(); else if (bozza) { bozza = null; disegna(); } else if (!$("#cm-panel").hidden) apri(false); } });

  /* ---------- 5 · esportazione ---------- */
  const scarica = (nome, tipo, dati) => { const url = URL.createObjectURL(new Blob([dati], { type: tipo })); const a = document.createElement("a"); a.href = url; a.download = nome; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); };
  const stamp = () => new Date().toISOString().slice(0, 10);
  const raggruppa = (lista = D.commenti) => { const m = new Map(); lista.slice().sort((a, b) => a.pagina.localeCompare(b.pagina) || (a.sezione ? a.sezione.codice : "").localeCompare(b.sezione ? b.sezione.codice : "") || a.creato.localeCompare(b.creato)).forEach((c) => { if (!m.has(c.pagina)) m.set(c.pagina, []); m.get(c.pagina).push(c); }); return m; };
  const aperti = (lista = D.commenti) => lista.filter((c) => c.stato === "aperto").length;
  function markdown(lista = D.commenti, ora = new Date().toISOString()) {
    let t = `# Commenti del team · landing UniLink v${CFG.versione.n}\n\nEsportati il ${new Date(ora).toLocaleString("it-IT")} · ${lista.length} commenti (${aperti(lista)} aperti).\n\n`;
    t += `> **Per l'AI.** Questi sono i commenti dei founder sulla demo della landing (https://matteprune04.github.io/unilink-hq/demo-landing/). Ogni voce indica pagina (S…), sezione (H…/S…n), estratto del testo e categoria. Usa \`architettura/CONTESTO_DEMO.md\` come contesto e il PDF di architettura per i codici. Per ogni commento *aperto*: proponi la modifica minima (tipo D/E del vocabolario), dì quali file tocca, e applicala solo se la richiesta è chiara; se è ambigua, chiedi. I commenti *risolti* sono solo storico.\n\n`;
    raggruppa(lista).forEach((l, k) => { const p = nomePag(k); t += `## ${p.codice} · ${p.nome}\n\nPagina: \`${k}\`\n\n`; l.forEach((c) => { t += `### ${c.sezione ? c.sezione.codice + " · " + c.sezione.etichetta : "Pagina intera"}  \`[${c.stato}]\` \`${TIPO[c.tipo] || c.tipo}\`\n\n`; if (c.sezione && c.sezione.estratto) t += `> Estratto: «${c.sezione.estratto}…»\n\n`; t += `${c.testo}\n\n— ${c.autore || "Anonimo"}, ${quando(c.creato)}, ${c.dispositivo || ""}, demo v${c.versione || "?"}\n\n`; }); });
    return t;
  }
  const json = (lista = D.commenti, ora = new Date().toISOString()) => JSON.stringify({ app: "UniLink landing", versione: CFG.versione, esportato: ora, commenti: lista }, null, 1);

  // PDF vero, senza librerie: testo su A4 con Helvetica (il browser non apre finestre di stampa)
  function pdf(lista = D.commenti, ora = new Date().toISOString()) {
    const W = 595.28, H = 841.89, M = 50, MAXW = W - 2 * M; const pagine = [[]]; let y = H - M - 24;
    const STILE = { h1: [17, 24, 2], h2: [12.5, 18, 2], p: [10, 14, 1], m: [8.5, 12, 1], q: [9, 13, 1] };
    const wansi = (s) => s.replace(/[’‘]/g, "'").replace(/[“”«»]/g, '"').replace(/[–—]/g, "-").replace(/•/g, "-").replace(/→/g, "->").replace(/…/g, "...").replace(/€/g, "EUR").replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");
    const wrap = (txt, size) => { const max = Math.floor(MAXW / (size * 0.53)); const out = []; txt.split("\n").forEach((par) => { let r = ""; par.split(" ").forEach((w) => { while (w.length > max) { if (r) { out.push(r); r = ""; } out.push(w.slice(0, max)); w = w.slice(max); } if ((r + " " + w).trim().length > max) { out.push(r); r = w; } else r = (r + " " + w).trim(); }); out.push(r); }); return out; };
    const riga = (tipo, txt, extra = 0) => { const [size, lead, font] = STILE[tipo]; wrap(wansi(txt), size).forEach((ln) => { if (y < M + 20) { pagine.push([]); y = H - M - 24; } pagine[pagine.length - 1].push({ x: M + extra, y, size, font, ln }); y -= lead; }); };
    const gap = (n) => { y -= n; };
    riga("h1", `Commenti del team - landing UniLink v${CFG.versione.n}`); riga("m", `Esportati il ${new Date(ora).toLocaleString("it-IT")} - ${lista.length} commenti (${aperti(lista)} aperti) - ${location.origin}${location.pathname.replace(/[^/]*$/, "")}`); gap(6);
    riga("q", "Per l'AI: ogni voce indica pagina (S..), sezione e un estratto del testo. Usa CONTESTO_DEMO.md e il PDF di architettura per i codici. Applica solo le richieste chiare dei commenti aperti; se sono ambigue, chiedi."); gap(10);
    raggruppa(lista).forEach((l, k) => { const p = nomePag(k); if (y < M + 90) { pagine.push([]); y = H - M - 24; } gap(6); riga("h2", `${p.codice} - ${p.nome}  (${k})`); l.forEach((c) => { gap(2); riga("m", `${c.sezione ? c.sezione.codice + " - " + c.sezione.etichetta : "Pagina intera"}   [${c.stato}]  [${TIPO[c.tipo] || c.tipo}]`, 6); if (c.sezione && c.sezione.estratto) riga("q", `Estratto: "${c.sezione.estratto}..."`, 6); riga("p", c.testo, 6); riga("m", `${c.autore || "Anonimo"} - ${quando(c.creato)} - ${c.dispositivo || ""} - demo v${c.versione || "?"}`, 6); gap(5); }); });
    // costruzione del file PDF
    const oggetti = []; const add = (s) => oggetti.push(s) && oggetti.length;
    add("<< /Type /Catalog /Pages 2 0 R >>"); add(""); add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"); add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
    const figli = [];
    pagine.forEach((pg, n) => {
      const esc2 = (s) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
      let cs = pg.map((r) => `BT /F${r.font} ${r.size} Tf ${r.x.toFixed(1)} ${r.y.toFixed(1)} Td (${esc2(r.ln)}) Tj ET`).join("\n");
      cs += `\nBT /F1 7.5 Tf ${M} 28 Td (${esc2(`UniLink - commenti demo v${CFG.versione.n} - pagina ${n + 1} di ${pagine.length}`)}) Tj ET`;
      const c = add(`<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`); const p = add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${c} 0 R >>`); figli.push(p + " 0 R");
    });
    oggetti[1] = `<< /Type /Pages /Kids [${figli.join(" ")}] /Count ${figli.length} >>`;
    let out = "%PDF-1.4\n"; const off = [];
    oggetti.forEach((o, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const xr = out.length; out += `xref\n0 ${oggetti.length + 1}\n0000000000 65535 f \n` + off.map((o) => String(o).padStart(10, "0") + " 00000 n \n").join("") + `trailer\n<< /Size ${oggetti.length + 1} /Root 1 0 R >>\nstartxref\n${xr}\n%%EOF`;
    const b = new Uint8Array(out.length); for (let i = 0; i < out.length; i++) b[i] = out.charCodeAt(i) & 255;
    return b;
  }
  // crea e scarica il file di una lista di commenti; restituisce il nome del file
  const scaricaFile = (k, lista, ora, versione = CFG.versione.n) => {
    const nome = `UniLink_commenti_landing_v${versione}_${ora.slice(0, 10)}_${ora.slice(11, 16).replace(":", "")}`;
    if (k === "pdf") scarica(nome + ".pdf", "application/pdf", pdf(lista, ora));
    if (k === "md") scarica(nome + ".md", "text/markdown", markdown(lista, ora));
    if (k === "json") scarica(nome + ".json", "application/json", json(lista, ora));
    return nome + "." + k;
  };
  // scarica i commenti attuali e li ARCHIVIA: escono da pagine e pannello, restano nello storico
  const esporta = (k) => {
    if (!D.commenti.length) return toast(D.storico.length ? "Nessun commento nuovo da scaricare. Le esportazioni passate sono nello storico (pagina Commenti)." : "Non ci sono ancora commenti da scaricare.");
    const ora = new Date().toISOString(), lista = D.commenti.slice();
    const file = scaricaFile(k, lista, ora);
    D.storico.unshift({ id: "e" + Date.now().toString(36), data: ora, autore: D.autore || "", formato: k, file, versione: CFG.versione.n, commenti: lista.map((c) => ({ ...c, archiviato: ora })) });
    D.commenti = []; salva(); disegna();
    toast(`Scaricati ${lista.length} commenti e archiviati: da qui in poi i commenti valgono per la nuova versione. Lo storico è nella pagina Commenti.`);
  };
  // ripristina un'esportazione (per errore): i suoi commenti tornano attivi e la voce esce dallo storico
  const ripristina = (id) => {
    const e = D.storico.find((x) => x.id === id); if (!e) return;
    const attivi = new Set(D.commenti.map((c) => c.id));
    e.commenti.forEach((c) => { if (!attivi.has(c.id)) { const r = { ...c }; delete r.archiviato; D.commenti.push(r); } });
    D.storico = D.storico.filter((x) => x.id !== id); salva(); disegna();
    toast(`Ripristinati ${e.commenti.length} commenti.`);
  };
  function importa(file) {
    const r = new FileReader();
    r.onload = () => { try { const j = JSON.parse(r.result); const arch = archiviati(); const tutti = (j.commenti || []).filter((c) => c && c.id && c.testo && c.pagina); const nuovi = tutti.filter((c) => !arch.has(c.id)); let agg = 0, agg2 = 0;
      nuovi.forEach((c) => { const e = D.commenti.find((x) => x.id === c.id); if (!e) { D.commenti.push(c); agg++; } else if ((c.modificato || c.creato) > (e.modificato || e.creato)) { Object.assign(e, c); agg2++; } });
      salva(); disegna(); toast(`Importati: ${agg} nuovi, ${agg2} aggiornati` + (tutti.length > nuovi.length ? `, ${tutti.length - nuovi.length} già archiviati (non tornano).` : ".")); } catch (e) { toast("Il file non è un export di commenti valido."); } };
    r.readAsText(file);
  }

  /* ---------- 6 · pagina rapporto ---------- */
  function rapporto() {
    const root = $("#cm-rapporto"); if (!root) return;
    const draw = () => {
      const g = raggruppa();
      root.innerHTML = `<div class="cm-rep-top"><p><b>${D.commenti.length}</b> commenti attivi · <b>${aperti()}</b> aperti · salvati in questo browser. Scaricando (PDF, Markdown o JSON) i commenti attivi vengono archiviati: escono dalle pagine e restano nello storico qui sotto. Per unire quelli dei founder: ognuno importa il JSON degli altri (i commenti già archiviati non tornano).</p>
        <div class="cm-exp"><button type="button" class="cm-btn pri" data-e="pdf">Scarica PDF</button><button type="button" class="cm-btn" data-e="md">Markdown</button><button type="button" class="cm-btn" data-e="json">JSON</button><label class="cm-btn" tabindex="0">Importa<input type="file" id="cm-imp2" accept=".json,application/json" hidden></label></div></div>`
        + (g.size ? [...g].map(([k, l]) => { const p = nomePag(k); return `<section class="cm-rep"><h2>${esc(p.codice)} · ${esc(p.nome)}</h2><p class="small"><a href="${esc(k)}">${esc(k)}</a></p>${l.map((c) => `<article class="cm-c ${c.stato}"><div class="cm-m"><span class="cm-t">${esc(TIPO[c.tipo] || "")}</span><span>${esc(c.autore || "Anonimo")} · ${quando(c.creato)} · ${esc(c.dispositivo || "")}</span></div><div class="cm-w">${c.sezione ? esc(c.sezione.codice + " · " + c.sezione.etichetta) : "Pagina intera"} · ${c.stato}</div>${c.sezione && c.sezione.estratto ? `<blockquote>${esc(c.sezione.estratto)}…</blockquote>` : ""}<p class="cm-p">${esc(c.testo).replace(/\n/g, "<br>")}</p></article>`).join("")}</section>`; }).join("") : `<p class="cm-vuoto">${D.storico.length ? "Nessun commento attivo: quelli scaricati sono nello storico qui sotto." : "Ancora nessun commento. Vai in una pagina, premi «Commenti» e tocca una sezione."}</p>`)
        + `<section class="cm-rep cm-storico"><h2>Storico esportazioni</h2>${D.storico.length ? D.storico.map((e) => `<article class="cm-c"><div class="cm-m"><span class="cm-t">${esc(e.formato.toUpperCase())}</span><span>${new Date(e.data).toLocaleString("it-IT")} · ${esc(e.autore || "Anonimo")} · demo v${esc(e.versione)}</span></div><div class="cm-w">${e.commenti.length} commenti · file ${esc(e.file)}</div><div class="cm-r"><button type="button" data-ri="${e.id}" data-k="pdf">Riscarica PDF</button><button type="button" data-ri="${e.id}" data-k="md">Markdown</button><button type="button" data-ri="${e.id}" data-k="json">JSON</button><button type="button" data-rp="${e.id}">Ripristina</button></div><details><summary>Vedi i commenti</summary>${e.commenti.map((c) => `<p class="cm-p"><b>${esc(nomePag(c.pagina).codice)} ${c.sezione ? esc(c.sezione.codice) : "pagina"}</b> · ${esc(c.testo).replace(/\n/g, "<br>")} <span class="small">(${esc(c.autore || "Anonimo")}, ${quando(c.creato)})</span></p>`).join("")}</details></article>`).join("") : `<p class="cm-vuoto">Nessuna esportazione ancora.</p>`}</section>`;
      $$("[data-e]", root).forEach((b) => (b.onclick = () => { esporta(b.dataset.e); draw(); }));
      $$("[data-ri]", root).forEach((b) => (b.onclick = () => { const e = D.storico.find((x) => x.id === b.dataset.ri); if (e) scaricaFile(b.dataset.k, e.commenti, e.data, e.versione); }));
      $$("[data-rp]", root).forEach((b) => (b.onclick = () => { if (confirm("Ripristinare questi commenti? Tornano attivi sulle pagine e la voce esce dallo storico.")) { ripristina(b.dataset.rp); draw(); } }));
      const f = $("#cm-imp2"); if (f) f.onchange = (e) => { if (e.target.files[0]) { importa(e.target.files[0]); setTimeout(draw, 200); } };
    };
    draw();
  }

  /* ---------- avvio ---------- */
  function avvia() {
    if (PAGE === "commenti") { rapporto(); return; }
    document.body.insertAdjacentHTML("beforeend", ui);
    indicizza(); disegna();
    $("#cm-open").addEventListener("click", () => apri($("#cm-panel").hidden));
    $("#cm-x").addEventListener("click", () => apri(false));
    $("#cm-add").addEventListener("click", () => (modo ? esciModo() : entraModo()));
    $("#cm-pg").addEventListener("click", () => nuovo(null));
    $("#cm-nome").addEventListener("input", (e) => { D.autore = e.target.value.trim(); salva(); });
    $$(".cm-tabs button").forEach((b) => b.addEventListener("click", () => { tab = b.dataset.t; disegna(); }));
    $$(".cm-flt button").forEach((b) => b.addEventListener("click", () => { filtro = b.dataset.f; disegna(); }));
    $$("[data-e]", $("#cm-panel")).forEach((b) => b.addEventListener("click", () => esporta(b.dataset.e)));
    $("#cm-imp").addEventListener("change", (e) => { if (e.target.files[0]) importa(e.target.files[0]); e.target.value = ""; });
    $("#cm-comp").addEventListener("submit", (e) => {
      e.preventDefault(); const f = new FormData(e.target), testo = (f.get("testo") || "").trim(); if (!testo) return;
      if (bozza.id) { const c = D.commenti.find((x) => x.id === bozza.id); Object.assign(c, { testo, tipo: f.get("tipo"), modificato: new Date().toISOString() }); }
      else D.commenti.push({ id: uid(), pagina: pagKey(), sezione: bozza.sezione, testo, tipo: f.get("tipo"), autore: D.autore || "", stato: "aperto", creato: new Date().toISOString(), dispositivo: dispositivo(), versione: CFG.versione.n });
      bozza = null; salva(); disegna(); toast("Commento salvato.");
    });
    $("#cm-comp").addEventListener("click", (e) => { if (e.target.id === "cm-ann") { bozza = null; disegna(); } });
    $("#cm-list").addEventListener("click", (e) => {
      const b = e.target.closest("[data-a]"); if (!b) return; const id = b.closest(".cm-c").dataset.id, c = D.commenti.find((x) => x.id === id); if (!c) return;
      if (b.dataset.a === "del") { if (confirm("Eliminare questo commento?")) { D.commenti = D.commenti.filter((x) => x.id !== id); salva(); disegna(); } }
      if (b.dataset.a === "stato") { c.stato = c.stato === "aperto" ? "risolto" : "aperto"; c.modificato = new Date().toISOString(); salva(); disegna(); }
      if (b.dataset.a === "mod") { bozza = { id: c.id, sezione: c.sezione, tipo: c.tipo, testo: c.testo }; disegna(); }
      if (b.dataset.a === "vai") { if (c.pagina !== pagKey()) { try { sessionStorage.setItem("ul-cm-focus", c.sezione ? c.sezione.id : ""); } catch (er) {} location.href = c.pagina; return; } vai(c.sezione && c.sezione.id); }
    });
    document.addEventListener("click", (e) => { const p = e.target.closest("[data-pin]"); if (p) { apri(true); tab = "qui"; filtro = "tutti"; disegna(); const c = qui().find((x) => x.sezione && x.sezione.id === p.dataset.pin); if (c) { const el = $(`.cm-c[data-id="${c.id}"]`); el && el.scrollIntoView({ block: "center" }); el && el.classList.add("cm-flash"); } } });
    window.addEventListener("hashchange", () => { if (PAGE === "decidere") { setTimeout(() => { indicizza(); disegna(); }, 60); } });
    // cambia pagina/sezioni dinamiche (card Da decidere): reindicizza dopo il disegno
    if (PAGE === "decidere") new MutationObserver(() => { clearTimeout(avvia._t); avvia._t = setTimeout(() => { indicizza(); pins(); }, 120); }).observe($("#decroot"), { childList: true });
    let f = null; try { f = sessionStorage.getItem("ul-cm-focus"); sessionStorage.removeItem("ul-cm-focus"); } catch (e) {}
    if (f !== null) setTimeout(() => vai(f), 500);
  }
  function vai(id) { const s = SEZ.find((x) => x.id === id); const el = s ? s.el : null; if (!el) return; el.scrollIntoView({ behavior: "smooth", block: "start" }); el.classList.add("cm-flash"); setTimeout(() => el.classList.remove("cm-flash"), 2400); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(avvia, 0)); else setTimeout(avvia, 0);
})();
