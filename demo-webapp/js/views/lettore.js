/* js/views/lettore.js — web app v7 · LETTORE DELLE DISPENSE (decisione del 7/10: «materiali non scaricabili: consultabili e
   annotabili solo nell'area personale della web app»). Rotta: #/app/leggi/<slug>.
   - Il PDF si disegna pagina per pagina su un <canvas> con PDF.js (cdnjs, versione fissa): niente pulsante di download o stampa,
     niente tasto destro, niente copia (v12: il testo si seleziona solo per evidenziare e commentare), Ctrl/Cmd+S e Ctrl/Cmd+P bloccati mentre il lettore è aperto.
   - v8: filigrana discreta SOTTO la pagina, accanto al numero (stile Studocu): «UniLink · nome · email · p. N di T»
     (in produzione la mette anche il server sul file, vedi Da decidere D39). Evidenziatore a 4 colori (si trascina sulla pagina,
     activity.evid[slug][pagina] = [{ x, y, w, h, c }] in coordinate 0–1), gomma, e «crea una flashcard da questa pagina».
   - Stampa: bloccata. Il browser non permette di distinguere «stampa su carta» da «salva come PDF» nella finestra di stampa,
     quindi consentire la stampa vorrebbe dire consentire il PDF (commento 11: spiegato nella proposta D49).
   - Note per pagina: activity.note[slug][pagina] = [{ id, testo, at }]; ultima pagina letta: activity.letture[slug].
   ATTENZIONE: nella demo il PDF arriva dal suo indirizzo pubblico (framerusercontent): in produzione sta in uno storage privato
   (Supabase) e arriva solo a chi l'ha comprato, con un link temporaneo. Chi ha la dispensa: B.owns (Completa, pacchetto, gratis). */
(function () {
  const UL = window.UL, B = UL.B, U = UL.U;
  const { icon, esc, fmtDate } = UL.ui;
  const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
  let caricamento = null;
  const pdfjs = () => caricamento || (caricamento = new Promise((ok, ko) => {
    if (window.pdfjsLib) return ok(window.pdfjsLib);
    const s = document.createElement("script");
    s.src = PDFJS + "pdf.min.js"; s.crossOrigin = "anonymous";
    s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + "pdf.worker.min.js"; ok(window.pdfjsLib); };
    s.onerror = () => { caricamento = null; ko(new Error("PDF.js non raggiungibile")); };
    document.head.appendChild(s);
  }));
  const documenti = {}; // slug → Promise<PDFDocumentProxy> (resta in memoria finché la pagina è aperta)
  const apri = (c) => documenti[c.slug] || (documenti[c.slug] = pdfjs().then((L) => L.getDocument({ url: c.pdf, disableAutoFetch: true }).promise).catch((e) => { delete documenti[c.slug]; throw e; }));

  const note = (u, slug) => ((u.activity.note = u.activity.note || {})[slug] = (u.activity.note[slug] || {}));
  const quante = (u, slug) => Object.values(note(u, slug)).reduce((n, l) => n + l.length, 0);
  // blocco di salvataggio e stampa solo mentre il lettore è aperto
  const tasti = (e) => { if (!document.querySelector(".lt-wrap")) return document.removeEventListener("keydown", tasti, true); if ((e.ctrlKey || e.metaKey) && ["s", "p"].includes(e.key.toLowerCase())) { e.preventDefault(); UL.ui.toast("Le dispense si leggono solo qui: niente download né stampa"); } };

  UL.views.lettoreU = {
    title: (p) => "Leggi · " + ((B.course(p[0]) || {}).title || "dispensa"),
    render(u, params) {
      const c = B.course(params[0]);
      if (!c) return `<div class="card empty">Dispensa non trovata. <a href="#/app/materiali">Torna ai materiali</a></div>`;
      if (!B.owns(u, c.slug)) return `<a href="#/app/scheda/${c.slug}" class="small display" style="text-decoration:none">← ${esc(c.title)}</a>
        <div class="page-head" style="margin-top:12px"><div><div class="eyebrow">${icon("book")} Lettore</div><h1>${esc(c.title)}</h1><p class="lead">La dispensa si legge e si annota qui, nell'area personale: non si scarica.</p></div></div>
        ${U.lock("La dispensa completa di " + c.title, `Con la dispensa completa (${B.eur(B.prezzo("completa", c))}, invece di ${B.eur(B.prezzoPieno("completa"))}) o con il pacchetto del tuo semestre`, `data-sblocca="${c.slug}"`)}`;
      const pag = (u.activity.letture || {})[c.slug] || 1, n = quante(u, c.slug);
      const fil = `UniLink · ${[u.profile.nome, u.profile.cognome].filter(Boolean).join(" ")} · ${u.email}`;
      // v12 (commento 1 del 8/10, Microeconomia): PDF a sinistra e note SEMPRE a destra; zoom chiaro (− % + e «Pagina intera / Larghezza»);
      // si seleziona il testo sulla pagina e si evidenzia o si commenta (nota rapida legata al punto); a schermo intero le note restano,
      // in un riquadro che si sposta.
      return `<a href="#/app/materiali" class="small display" style="text-decoration:none">← Materiali</a>
        <div class="page-head" style="margin-top:12px"><div><div class="eyebrow">${icon("book")} Lettore · ${esc(c.code || "")}</div><h1>${esc(c.title)}</h1>
          <p class="lead">Leggi e annota qui. Le note restano nel tuo account; la dispensa non si scarica e porta la tua filigrana.</p></div>
          <div class="row"><a class="btn btn-ghost btn-sm" href="#/app/scheda/${c.slug}">${icon("info")} Scheda</a>${B.hasQuiz(c.slug) ? `<a class="btn btn-ghost btn-sm" href="#/app/esercitazioni/${c.slug}">${icon("quiz")} Allenati</a>` : ""}</div></div>
        <div class="lt-wrap" data-lt="${esc(c.slug)}">
          <section class="lt-main card">
            <div class="lt-bar">
              <select class="select lt-ind" data-lt-ind aria-label="Indice e segnalibri"><option value="">☰ Indice</option></select>
              <div class="lt-grp"><button class="icon-btn" data-lt-prev aria-label="Pagina precedente (freccia sinistra)">‹</button><span class="small lt-pp"><label for="lt-p" class="sr-only">Pagina</label><input id="lt-p" class="input lt-num" type="number" min="1" value="${pag}"> / <b data-lt-tot>…</b></span><button class="icon-btn" data-lt-next aria-label="Pagina successiva (freccia destra)">›</button></div>
              <button class="icon-btn lt-segb" data-lt-seg aria-pressed="false" title="Segnalibro su questa pagina">☆</button>
              <span class="lt-sp"></span>
              <div class="lt-grp lt-zoom" role="group" aria-label="Zoom"><button class="icon-btn" data-lt-zoom="-1" aria-label="Rimpicciolisci">−</button><b data-lt-z title="Grandezza rispetto alla pagina adattata">100%</b><button class="icon-btn" data-lt-zoom="1" aria-label="Ingrandisci">+</button></div>
              <div class="lt-fit" role="group" aria-label="Adatta"><button type="button" data-lt-fit="pagina" class="on" aria-pressed="true" title="La pagina intera nello schermo">Pagina</button><button type="button" data-lt-fit="larghezza" aria-pressed="false" title="La pagina larga quanto il riquadro: si scorre dentro">Larghezza</button></div>
              <button class="btn btn-ghost btn-sm" data-lt-timer title="Sessione di lettura di 25 minuti (pomodoro)">⏱ 25</button>
              <button class="btn btn-primary btn-sm" data-lt-focus title="Leggi a schermo intero (F)" aria-label="Schermo intero">⛶ Intero</button></div>
            <div class="lt-avanz"><i data-lt-av></i></div>
            <div class="lt-pagina" data-lt-pag><div class="lt-foglio"><canvas aria-label="Pagina della dispensa"></canvas><div class="lt-evid" data-lt-evid></div><div class="textLayer" data-lt-txt></div></div><div class="lt-wm" aria-hidden="true"><span>${esc(fil)}</span><b data-lt-wmp></b></div><div class="lt-stato small muted" data-lt-stato>Carico la dispensa…</div></div>
          </section>
          <aside class="lt-note card" data-lt-note>
            <div class="card-head lt-nhead"><h3>${icon("edit")} Note · p. <span data-lt-np>${pag}</span></h3><span class="badge badge-soft" data-lt-cnt>${n} in tutto</span><button class="icon-btn lt-mini" data-lt-mini aria-label="Riduci il riquadro delle note" title="Riduci">–</button></div>
            <div class="lt-ncorpo">
            <form data-lt-form><label class="sr-only" for="lt-t">Scrivi una nota</label><textarea class="textarea" id="lt-t" rows="3" maxlength="600" placeholder="Scrivi una nota su questa pagina…"></textarea><button class="btn btn-primary btn-sm" style="margin-top:8px">Aggiungi la nota</button></form>
            <ul class="lt-lista" data-lt-qui></ul>
            <details class="lt-tutte"><summary class="small">Tutte le note della dispensa</summary><ul class="lt-lista" data-lt-tutte></ul></details>
            <details class="lt-tutte"><summary class="small">Crea una flashcard da questa pagina</summary><form data-lt-fc style="display:grid;gap:8px;margin-top:8px"><input class="input" name="f" placeholder="Fronte: domanda o termine" maxlength="200"><textarea class="textarea" name="b" rows="2" placeholder="Retro: risposta" maxlength="600"></textarea><button class="btn btn-sm btn-ghost">Aggiungi al mazzo</button></form></details>
            <p class="tiny muted" style="margin-top:10px">${icon("lock")} Niente download, stampa o copia: la dispensa è tua da leggere qui, sempre aggiornata.</p>
            </div>
          </aside>
          <div class="lt-pop" data-lt-pop hidden></div>
        </div>`;
    },
    mount(root, u, params) {
      const c = B.course(params[0]);
      root.querySelectorAll("[data-sblocca]").forEach((b) => b.addEventListener("click", () => B.upsell(u, b.dataset.sblocca)));
      const wrap = root.querySelector(".lt-wrap"); if (!c || !wrap) return;
      B.track("lettura", c.slug);
      document.addEventListener("keydown", tasti, true);
      wrap.addEventListener("contextmenu", (e) => e.preventDefault());
      wrap.addEventListener("dragstart", (e) => e.preventDefault());
      // si può selezionare per evidenziare e commentare, ma non copiare
      wrap.addEventListener("copy", (e) => { if (e.target.closest && e.target.closest("textarea,input,.lt-lista")) return; e.preventDefault(); UL.ui.toast("La dispensa non si copia: evidenzia o commenta la frase"); });
      const cv = wrap.querySelector("canvas"), stato = wrap.querySelector("[data-lt-stato]"), inp = wrap.querySelector("#lt-p"), tl = wrap.querySelector("[data-lt-txt]"), pop = wrap.querySelector("[data-lt-pop]");
      const st = { pag: Math.max(1, Number(inp.value) || 1), tot: 0, zoom: 1, fit: "pagina", doc: null, render: null, giro: 0 };
      const N = note(u, c.slug);
      const EV = ((u.activity.evid = u.activity.evid || {})[c.slug] = (u.activity.evid[c.slug] || {}));
      const strato = wrap.querySelector("[data-lt-evid]");
      const disegnaEvid = () => { strato.innerHTML = (EV[st.pag] || []).map((r, i) => `<i class="c-${r.c}${r.n ? " con-nota" : ""}" data-ev="${i}" style="left:${r.x * 100}%;top:${r.y * 100}%;width:${r.w * 100}%;height:${r.h * 100}%"></i>`).join(""); };
      const togliGruppo = (g) => { if (!g) return; Object.keys(EV).forEach((p) => { EV[p] = EV[p].filter((r) => r.g !== g); if (!EV[p].length) delete EV[p]; }); };
      const disegnaNote = () => {
        const qui = N[st.pag] || [];
        wrap.querySelector("[data-lt-np]").textContent = st.pag;
        wrap.querySelector("[data-lt-cnt]").textContent = quante(u, c.slug) + " in tutto";
        const voce = (x) => `${x.cit ? `<q class="lt-cit">${esc(x.cit.length > 140 ? x.cit.slice(0, 140) + "…" : x.cit)}</q>` : ""}<p>${esc(x.testo)}</p>`;
        wrap.querySelector("[data-lt-qui]").innerHTML = qui.map((x) => `<li>${voce(x)}<span class="tiny muted">${fmtDate(x.at, true)}</span><button class="icon-btn" data-lt-del="${x.id}" aria-label="Cancella la nota">${icon("trash")}</button></li>`).join("") || '<li class="small muted">Nessuna nota su questa pagina. Seleziona una frase per commentarla.</li>';
        const tutte = Object.entries(N).flatMap(([p, l]) => l.map((x) => [Number(p), x])).sort((a, b) => a[0] - b[0]);
        wrap.querySelector("[data-lt-tutte]").innerHTML = tutte.map(([p, x]) => `<li><button class="link small" data-lt-vai="${p}">p. ${p}</button> ${esc(x.testo.length > 90 ? x.testo.slice(0, 90) + "…" : x.testo)}</li>`).join("") || '<li class="small muted">Ancora nessuna nota.</li>';
        wrap.querySelectorAll("[data-lt-del]").forEach((b) => b.addEventListener("click", () => { const x = (N[st.pag] || []).find((y) => y.id === b.dataset.ltDel); x && togliGruppo(x.g);
          N[st.pag] = (N[st.pag] || []).filter((y) => y.id !== b.dataset.ltDel); if (!N[st.pag].length) delete N[st.pag]; UL.store.save(); disegnaNote(); disegnaEvid(); }));
        wrap.querySelectorAll("[data-lt-vai]").forEach((b) => b.addEventListener("click", () => vai(Number(b.dataset.ltVai))));
      };
      const disegna = async () => {
        if (!st.doc) return;
        const giro = ++st.giro, p = await st.doc.getPage(st.pag), box = wrap.querySelector("[data-lt-pag]");
        if (giro !== st.giro) return;
        const focus = wrap.classList.contains("lt-focus");
        const sopra = box.getBoundingClientRect().top - wrap.getBoundingClientRect().top, altezza = Math.max(320, window.innerHeight - (focus ? 96 : sopra + 72 + ((document.querySelector(".topbar") || {}).offsetHeight || 0)));
        box.style.height = altezza + "px";
        // la prima volta il lettore sale in cima allo schermo (su PC): la pagina si legge tutta senza scorrere
        if (!st.salito) { st.salito = true; if (window.innerWidth > 980 && !focus) window.scrollTo(0, Math.max(0, wrap.getBoundingClientRect().top + window.scrollY - ((document.querySelector(".topbar") || {}).offsetHeight || 0) - 12)); }
        const base = p.getViewport({ scale: 1 }), largo = box.clientWidth - 16;
        const adatta = st.fit === "larghezza" ? largo / base.width : Math.min(largo / base.width, (altezza - 34) / base.height);
        const scala = Math.max(0.3, adatta * st.zoom), dpr = Math.min(2, window.devicePixelRatio || 1);
        const vp = p.getViewport({ scale: scala * dpr }), vpc = p.getViewport({ scale: scala });
        cv.width = vp.width; cv.height = vp.height; cv.style.width = vpc.width + "px"; cv.style.height = vpc.height + "px";
        if (st.render) try { st.render.cancel(); } catch (e) { /* già finita */ }
        st.render = p.render({ canvasContext: cv.getContext("2d"), viewport: vp });
        try { await st.render.promise; } catch (e) { return; }
        stato.hidden = true;
        // strato di testo trasparente sopra la pagina: serve a selezionare le frasi (non a copiarle)
        tl.innerHTML = ""; tl.style.width = vpc.width + "px"; tl.style.height = vpc.height + "px"; tl.style.setProperty("--scale-factor", scala);
        p.getTextContent().then((tc) => { if (giro === st.giro) window.pdfjsLib.renderTextLayer({ textContentSource: tc, container: tl, viewport: vpc }); }).catch(() => {});
        wrap.querySelector("[data-lt-z]").textContent = Math.round(st.zoom * 100) + "%";
        wrap.querySelector("[data-lt-wmp]").textContent = `p. ${st.pag} di ${st.tot}`;
        wrap.querySelector("[data-lt-av]").style.width = (st.tot ? (st.pag / st.tot) * 100 : 0) + "%";
        const SG = segn(); wrap.querySelector("[data-lt-seg]").textContent = SG.includes(st.pag) ? "★" : "☆"; wrap.querySelector("[data-lt-seg]").setAttribute("aria-pressed", String(SG.includes(st.pag)));
        disegnaEvid();
      };
      // ---- selezione sul testo → evidenzia o commenta (nota rapida legata alla frase) ----
      const chiudiPop = () => { pop.hidden = true; pop.innerHTML = ""; };
      const mettiPop = (x, y) => { pop.hidden = false; const w = pop.offsetWidth || 260; pop.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, x - w / 2)) + "px"; pop.style.top = Math.max(8, y - pop.offsetHeight - 10) + "px"; };
      const rettangoli = (range) => { const f = tl.getBoundingClientRect(); return [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1 && r.bottom > f.top && r.top < f.bottom)
        .map((r) => ({ x: (r.left - f.left) / f.width, y: (r.top - f.top) / f.height, w: r.width / f.width, h: r.height / f.height })); };
      const COL = [["g", "giallo"], ["v", "verde"], ["a", "azzurro"], ["r", "rosa"]];
      let sele = null;
      const salvaEvid = (col, nota) => { if (!sele) return null; const g = "g" + Date.now().toString(36); (EV[st.pag] = EV[st.pag] || []).push(...sele.r.map((r) => Object.assign(r, { c: col, g, n: nota || "" }))); return g; };
      tl.addEventListener("mouseup", () => setTimeout(() => {
        const s = window.getSelection(); if (!s || s.isCollapsed || !tl.contains(s.anchorNode)) return;
        const testo = s.toString().replace(/\s+/g, " ").trim(), r = rettangoli(s.getRangeAt(0)); if (!testo || !r.length) return;
        const ul = s.getRangeAt(0).getBoundingClientRect(); sele = { testo, r };
        pop.innerHTML = `<div class="lt-pop-r">${COL.map(([k, n]) => `<button type="button" class="lt-col c-${k}" data-pc="${k}" title="Evidenzia in ${n}" aria-label="Evidenzia in ${n}"></button>`).join("")}<button type="button" class="btn btn-primary btn-sm" data-pnota>${icon("edit")} Commenta</button></div>`;
        mettiPop(ul.left + ul.width / 2, ul.top);
        pop.querySelectorAll("[data-pc]").forEach((b) => b.addEventListener("click", () => { salvaEvid(b.dataset.pc); UL.store.save(); s.removeAllRanges(); chiudiPop(); disegnaEvid(); }));
        pop.querySelector("[data-pnota]").addEventListener("click", () => {
          pop.innerHTML = `<form class="lt-pop-f"><q class="lt-cit">${esc(testo.length > 120 ? testo.slice(0, 120) + "…" : testo)}</q><textarea class="textarea" rows="3" maxlength="600" placeholder="La tua nota su questa frase…"></textarea><div class="row" style="justify-content:flex-end;gap:6px"><button type="button" class="btn btn-ghost btn-sm" data-pann>Annulla</button><button class="btn btn-primary btn-sm">Salva</button></div></form>`;
          mettiPop(ul.left + ul.width / 2, ul.top); const ta = pop.querySelector("textarea"); ta.focus();
          pop.querySelector("[data-pann]").addEventListener("click", chiudiPop);
          pop.querySelector("form").addEventListener("submit", (e) => { e.preventDefault(); const t = ta.value.trim(); if (!t) return ta.focus();
            const id = "n" + Date.now().toString(36), g = salvaEvid("g", id);
            (N[st.pag] = N[st.pag] || []).push({ id, testo: t, cit: testo.slice(0, 300), g, at: new Date().toISOString() });
            UL.store.addLog(u, "nota", `Nota a p. ${st.pag} di ${c.title}`); UL.store.save(); s.removeAllRanges(); chiudiPop(); disegnaNote(); disegnaEvid(); UL.ui.toast("Nota salvata sulla frase"); });
        });
      }, 10));
      // clic su una frase evidenziata: si vede la nota e si può togliere
      tl.addEventListener("click", (e) => {
        const s = window.getSelection(); if (s && !s.isCollapsed) return;
        const f = tl.getBoundingClientRect(), x = (e.clientX - f.left) / f.width, y = (e.clientY - f.top) / f.height;
        const r = (EV[st.pag] || []).find((q) => x >= q.x && x <= q.x + q.w && y >= q.y && y <= q.y + q.h); if (!r) return chiudiPop();
        const nt = r.n && (N[st.pag] || []).find((q) => q.id === r.n);
        pop.innerHTML = `<div class="lt-pop-v">${nt ? `<p>${esc(nt.testo)}</p>` : ""}<div class="row" style="gap:6px;justify-content:flex-end"><button type="button" class="btn btn-ghost btn-sm" data-ptogli>${nt ? "Togli nota ed evidenziazione" : "Togli l'evidenziazione"}</button></div></div>`;
        mettiPop(e.clientX, e.clientY);
        pop.querySelector("[data-ptogli]").addEventListener("click", () => { if (r.g) togliGruppo(r.g); else { EV[st.pag].splice(EV[st.pag].indexOf(r), 1); if (!EV[st.pag].length) delete EV[st.pag]; }
          if (nt) { N[st.pag] = N[st.pag].filter((q) => q.id !== nt.id); if (!N[st.pag].length) delete N[st.pag]; } UL.store.save(); chiudiPop(); disegnaEvid(); disegnaNote(); });
      });
      document.addEventListener("mousedown", function via(e) { if (!document.body.contains(wrap)) return document.removeEventListener("mousedown", via); if (!pop.hidden && !pop.contains(e.target) && !tl.contains(e.target)) chiudiPop(); });
      const fcf = wrap.querySelector("[data-lt-fc]");
      fcf && fcf.addEventListener("submit", (e) => { e.preventDefault(); const f = fcf.f.value.trim(), b = fcf.b.value.trim(); if (!f || !b) return UL.ui.toast("Scrivi fronte e retro");
        const F = (u.activity.fc = u.activity.fc || {}); F[c.slug] = Object.assign({ mie: [], s: {}, nuoveOggi: { data: "", n: 0 } }, F[c.slug] || {});
        F[c.slug].mie.push({ id: "mia-" + Date.now().toString(36), f, b, cap: 0, pag: st.pag, at: new Date().toISOString() }); UL.store.save(); fcf.reset(); UL.ui.toast("Flashcard aggiunta al mazzo dell'esame"); });
      const vai = (n) => {
        st.pag = Math.min(Math.max(1, n), st.tot || n); inp.value = st.pag; chiudiPop();
        (u.activity.letture = u.activity.letture || {})[c.slug] = st.pag; UL.store.save();
        disegnaNote(); disegna(); wrap.querySelector("[data-lt-pag]").scrollTop = 0;
      };
      // indice dal PDF, segnalibri, schermo intero, frecce, timer (v11)
      const segn = () => ((u.activity.segnalibri = u.activity.segnalibri || {})[c.slug] = (u.activity.segnalibri[c.slug] || []));
      const ind = wrap.querySelector("[data-lt-ind]"), voci = [];
      const indice = () => { const SG = segn().slice().sort((a, b) => a - b);
        ind.innerHTML = `<option value="">☰ Indice</option>${voci.length ? `<optgroup label="Capitoli">${voci.map(([t, p2]) => `<option value="${p2}">${esc(t.length > 48 ? t.slice(0, 48) + "…" : t)} · p. ${p2}</option>`).join("")}</optgroup>` : ""}${SG.length ? `<optgroup label="Segnalibri">${SG.map((p2) => `<option value="${p2}">★ Pagina ${p2}</option>`).join("")}</optgroup>` : ""}`; };
      ind.addEventListener("change", () => { if (ind.value) vai(Number(ind.value)); ind.value = ""; });
      wrap.querySelector("[data-lt-seg]").addEventListener("click", () => { const SG = segn(), i = SG.indexOf(st.pag); i >= 0 ? SG.splice(i, 1) : SG.push(st.pag); UL.store.save(); indice(); disegna(); UL.ui.toast(i >= 0 ? "Segnalibro tolto" : "Segnalibro aggiunto"); });
      // riquadro delle note: a schermo intero diventa mobile (si trascina dalla testata) e si può ridurre
      const nb = wrap.querySelector("[data-lt-note]"), nh = nb.querySelector(".lt-nhead");
      wrap.querySelector("[data-lt-mini]").addEventListener("click", (e) => { e.stopPropagation(); nb.classList.toggle("mini"); });
      let trasc = null;
      nh.addEventListener("pointerdown", (e) => { if (!wrap.classList.contains("lt-focus") || e.target.closest("button")) return; const r = nb.getBoundingClientRect(); trasc = [e.clientX - r.left, e.clientY - r.top]; nh.setPointerCapture(e.pointerId); });
      nh.addEventListener("pointermove", (e) => { if (!trasc) return; nb.style.left = Math.max(0, Math.min(window.innerWidth - nb.offsetWidth, e.clientX - trasc[0])) + "px"; nb.style.top = Math.max(0, Math.min(window.innerHeight - 50, e.clientY - trasc[1])) + "px"; nb.style.right = "auto"; });
      nh.addEventListener("pointerup", () => (trasc = null));
      const focus = (on) => { wrap.classList.toggle("lt-focus", on); document.body.style.overflow = on ? "hidden" : ""; if (!on) { nb.style.left = nb.style.top = nb.style.right = ""; nb.classList.remove("mini"); }
        wrap.querySelector("[data-lt-focus]").textContent = on ? "Esci (Esc)" : "⛶ Intero"; chiudiPop(); setTimeout(disegna, 60); };
      wrap.querySelector("[data-lt-focus]").addEventListener("click", () => focus(!wrap.classList.contains("lt-focus")));
      const frecce = (e) => { if (!document.body.contains(wrap)) { document.removeEventListener("keydown", frecce); document.body.style.overflow = ""; return; } if (e.target.closest("input,textarea,select")) return;
        if (["ArrowRight", "PageDown"].includes(e.key)) { e.preventDefault(); vai(st.pag + 1); } else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); vai(st.pag - 1); }
        else if (e.key === "Escape") { if (!pop.hidden) chiudiPop(); else if (wrap.classList.contains("lt-focus")) focus(false); } else if (e.key.toLowerCase() === "f") focus(!wrap.classList.contains("lt-focus"));
        else if (e.key === "+" || e.key === "=") zoom(1); else if (e.key === "-") zoom(-1); };
      document.addEventListener("keydown", frecce);
      let rit; window.addEventListener("resize", () => { clearTimeout(rit); rit = setTimeout(() => document.body.contains(wrap) && disegna(), 150); });
      const tb = wrap.querySelector("[data-lt-timer]"); let fine = 0, tic = null;
      tb.addEventListener("click", () => { if (tic) { clearInterval(tic); tic = null; tb.textContent = "⏱ 25"; return; } fine = Date.now() + 25 * 60000;
        tic = setInterval(() => { if (!document.body.contains(tb)) return clearInterval(tic); const r = Math.max(0, fine - Date.now()), m = Math.floor(r / 60000), sx = Math.floor((r % 60000) / 1000); tb.textContent = `⏱ ${m}:${String(sx).padStart(2, "0")}`; if (!r) { clearInterval(tic); tic = null; tb.textContent = "⏱ 25"; UL.ui.toast("25 minuti fatti: 5 minuti di pausa, poi riparti"); } }, 1000); });
      wrap.querySelector("[data-lt-prev]").addEventListener("click", () => vai(st.pag - 1));
      wrap.querySelector("[data-lt-next]").addEventListener("click", () => vai(st.pag + 1));
      inp.addEventListener("change", () => { const n = Number(inp.value) || 1; if (n !== st.pag) vai(n); });
      // zoom: parte da «adattata» (100%) e va da 50% a 300%; «Pagina intera» la fa stare tutta, «Larghezza» la allarga e si scorre dentro il riquadro
      const zoom = (d) => { st.zoom = Math.round(Math.min(3, Math.max(0.5, st.zoom + d * (st.zoom >= 1 ? 0.25 : 0.1))) * 100) / 100; chiudiPop(); disegna(); };
      wrap.querySelectorAll("[data-lt-zoom]").forEach((b) => b.addEventListener("click", () => zoom(Number(b.dataset.ltZoom))));
      wrap.querySelectorAll("[data-lt-fit]").forEach((b) => b.addEventListener("click", () => { st.fit = b.dataset.ltFit; st.zoom = 1;
        wrap.querySelectorAll("[data-lt-fit]").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", String(x === b)); }); chiudiPop(); disegna(); }));
      wrap.querySelector("[data-lt-form]").addEventListener("submit", (e) => {
        e.preventDefault(); const t = wrap.querySelector("#lt-t"), testo = t.value.trim(); if (!testo) return;
        (N[st.pag] = N[st.pag] || []).push({ id: "n" + Date.now().toString(36), testo, at: new Date().toISOString() });
        UL.store.addLog(u, "nota", `Nota a p. ${st.pag} di ${c.title}`); UL.store.save(); t.value = ""; disegnaNote(); UL.ui.toast("Nota salvata");
      });
      disegnaNote();
      if (!c.pdf) { stato.textContent = "Il file di questa dispensa non è ancora nella demo."; return; }
      indice();
      apri(c).then((doc) => { doc.getOutline().then(async (ol) => { for (const it of (ol || []).slice(0, 80)) { try { const d = typeof it.dest === "string" ? await doc.getDestination(it.dest) : it.dest; if (d && d[0]) voci.push([it.title, (await doc.getPageIndex(d[0])) + 1]); } catch (e) { /* voce senza pagina */ } } indice(); }).catch(() => {});
        st.doc = doc; st.tot = doc.numPages; wrap.querySelector("[data-lt-tot]").textContent = doc.numPages; inp.max = doc.numPages;
        vai(Math.min(st.pag, doc.numPages)); })
        .catch(() => { stato.innerHTML = "Non riesco a caricare la dispensa (serve la connessione). Riprova tra poco."; });
    },
  };
})();
