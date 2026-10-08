/* js/views/lettore.js — web app v7 · LETTORE DELLE DISPENSE (decisione del 7/10: «materiali non scaricabili: consultabili e
   annotabili solo nell'area personale della web app»). Rotta: #/app/leggi/<slug>.
   - Il PDF si disegna pagina per pagina su un <canvas> con PDF.js (cdnjs, versione fissa): niente pulsante di download o stampa,
     niente tasto destro, niente selezione del testo, Ctrl/Cmd+S e Ctrl/Cmd+P bloccati mentre il lettore è aperto.
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
      const pag = (u.activity.letture || {})[c.slug] || 1, n = quante(u, c.slug), aperte = (u.activity.ltNote || "") === "aperte";
      const fil = `UniLink · ${[u.profile.nome, u.profile.cognome].filter(Boolean).join(" ")} · ${u.email}`;
      return `<a href="#/app/materiali" class="small display" style="text-decoration:none">← Materiali</a>
        <div class="page-head" style="margin-top:12px"><div><div class="eyebrow">${icon("book")} Lettore · ${esc(c.code || "")}</div><h1>${esc(c.title)}</h1>
          <p class="lead">Leggi e annota qui. Le note restano nel tuo account; la dispensa non si scarica e porta la tua filigrana.</p></div>
          <div class="row"><a class="btn btn-ghost btn-sm" href="#/app/scheda/${c.slug}">${icon("info")} Scheda</a>${B.hasQuiz(c.slug) ? `<a class="btn btn-ghost btn-sm" href="#/app/esercitazioni/${c.slug}">${icon("quiz")} Allenati</a>` : ""}</div></div>
        <div class="lt-wrap ${aperte ? "" : "note-chiuse"}" data-lt="${esc(c.slug)}">
          <section class="lt-main card">
            <div class="lt-bar"><select class="select lt-ind" data-lt-ind aria-label="Indice e segnalibri"><option value="">Indice</option></select>
              <button class="icon-btn" data-lt-prev aria-label="Pagina precedente (freccia sinistra)">‹</button><span class="small lt-pp"><label for="lt-p" class="sr-only">Pagina</label><input id="lt-p" class="input lt-num" type="number" min="1" value="${pag}"> / <b data-lt-tot>…</b></span><button class="icon-btn" data-lt-next aria-label="Pagina successiva (freccia destra)">›</button>
              <button class="icon-btn" data-lt-seg aria-pressed="false" title="Segnalibro su questa pagina">☆</button>
              <span class="lt-sp"></span><span class="lt-colori" role="group" aria-label="Evidenziatore">${[["g", "giallo"], ["v", "verde"], ["a", "azzurro"], ["r", "rosa"]].map(([k, n]) => `<button type="button" class="lt-col c-${k}" data-col="${k}" aria-pressed="false" title="Evidenzia in ${n}"></button>`).join("")}<button type="button" class="icon-btn" data-col="x" aria-pressed="false" title="Gomma: tocca un'evidenziazione per toglierla">${icon("trash")}</button></span>
              <button class="icon-btn" data-lt-zoom="-1" aria-label="Rimpicciolisci">−</button><button class="icon-btn" data-lt-zoom="1" aria-label="Ingrandisci">+</button>
              <button class="btn btn-ghost btn-sm" data-lt-timer title="Sessione di lettura di 25 minuti">⏱ 25:00</button>
              <button class="btn btn-ghost btn-sm" data-lt-notebtn>${icon("edit")} Note <span class="cnt" data-lt-ncnt>${n}</span></button>
              <button class="btn btn-primary btn-sm" data-lt-focus title="Leggi a schermo intero (F)">Schermo intero</button></div>
            <div class="lt-avanz"><i data-lt-av></i></div>
            <div class="lt-pagina" data-lt-pag><div class="lt-foglio"><canvas aria-label="Pagina della dispensa"></canvas><div class="lt-evid" data-lt-evid></div></div><div class="lt-wm" aria-hidden="true"><span>${esc(fil)}</span><b data-lt-wmp></b></div><div class="lt-stato small muted" data-lt-stato>Carico la dispensa…</div></div>
          </section>
          <aside class="lt-note card">
            <div class="card-head"><h3>${icon("edit")} Note · p. <span data-lt-np>${pag}</span></h3><span class="badge badge-soft" data-lt-cnt>${n} in tutto</span><button class="icon-btn" data-lt-notebtn aria-label="Chiudi le note">${icon("x")}</button></div>
            <form data-lt-form><label class="sr-only" for="lt-t">Scrivi una nota</label><textarea class="textarea" id="lt-t" rows="3" maxlength="600" placeholder="Scrivi una nota su questa pagina…"></textarea><button class="btn btn-primary btn-sm" style="margin-top:8px">Aggiungi la nota</button></form>
            <ul class="lt-lista" data-lt-qui></ul>
            <details class="lt-tutte"><summary class="small">Tutte le note della dispensa</summary><ul class="lt-lista" data-lt-tutte></ul></details>
            <details class="lt-tutte"><summary class="small">Crea una flashcard da questa pagina</summary><form data-lt-fc style="display:grid;gap:8px;margin-top:8px"><input class="input" name="f" placeholder="Fronte: domanda o termine" maxlength="200"><textarea class="textarea" name="b" rows="2" placeholder="Retro: risposta" maxlength="600"></textarea><button class="btn btn-sm btn-ghost">Aggiungi al mazzo</button></form></details>
            <p class="tiny muted" style="margin-top:10px">${icon("lock")} Niente download, stampa o copia: la dispensa è tua da leggere qui, sempre aggiornata.</p>
          </aside>
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
      const cv = wrap.querySelector("canvas"), stato = wrap.querySelector("[data-lt-stato]"), inp = wrap.querySelector("#lt-p");
      const st = { pag: Math.max(1, Number(inp.value) || 1), tot: 0, zoom: 1, doc: null, render: null };
      const N = note(u, c.slug);
      const disegnaNote = () => {
        const qui = N[st.pag] || [];
        wrap.querySelector("[data-lt-np]").textContent = st.pag;
        wrap.querySelector("[data-lt-cnt]").textContent = quante(u, c.slug) + " in tutto"; wrap.querySelector("[data-lt-ncnt]").textContent = quante(u, c.slug);
        wrap.querySelector("[data-lt-qui]").innerHTML = qui.map((x) => `<li><p>${esc(x.testo)}</p><span class="tiny muted">${fmtDate(x.at, true)}</span><button class="icon-btn" data-lt-del="${x.id}" aria-label="Cancella la nota">${icon("trash")}</button></li>`).join("") || '<li class="small muted">Nessuna nota su questa pagina.</li>';
        const tutte = Object.entries(N).flatMap(([p, l]) => l.map((x) => [Number(p), x])).sort((a, b) => a[0] - b[0]);
        wrap.querySelector("[data-lt-tutte]").innerHTML = tutte.map(([p, x]) => `<li><button class="link small" data-lt-vai="${p}">p. ${p}</button> ${esc(x.testo.length > 90 ? x.testo.slice(0, 90) + "…" : x.testo)}</li>`).join("") || '<li class="small muted">Ancora nessuna nota.</li>';
        wrap.querySelectorAll("[data-lt-del]").forEach((b) => b.addEventListener("click", () => { N[st.pag] = (N[st.pag] || []).filter((x) => x.id !== b.dataset.ltDel); if (!N[st.pag].length) delete N[st.pag]; UL.store.save(); disegnaNote(); }));
        wrap.querySelectorAll("[data-lt-vai]").forEach((b) => b.addEventListener("click", () => vai(Number(b.dataset.ltVai))));
      };
      const disegna = async () => {
        if (!st.doc) return;
        const p = await st.doc.getPage(st.pag), box = wrap.querySelector("[data-lt-pag]");
        const base = p.getViewport({ scale: 1 }), altezza = Math.max(320, window.innerHeight - (wrap.classList.contains("lt-focus") ? 110 : Math.max(150, box.getBoundingClientRect().top + 46))), scala = Math.max(0.3, Math.min((box.clientWidth - 2) / base.width, altezza / base.height) * st.zoom), dpr = Math.min(2, window.devicePixelRatio || 1);
        const vp = p.getViewport({ scale: scala * dpr });
        cv.width = vp.width; cv.height = vp.height; cv.style.width = vp.width / dpr + "px"; cv.style.height = vp.height / dpr + "px";
        if (st.render) try { st.render.cancel(); } catch (e) { /* già finita */ }
        st.render = p.render({ canvasContext: cv.getContext("2d"), viewport: vp });
        try { await st.render.promise; } catch (e) { return; }
        stato.hidden = true;
        wrap.querySelector("[data-lt-wmp]").textContent = `p. ${st.pag} di ${st.tot}`;
        wrap.querySelector("[data-lt-av]").style.width = (st.tot ? (st.pag / st.tot) * 100 : 0) + "%";
        const SG = segn(); wrap.querySelector("[data-lt-seg]").textContent = SG.includes(st.pag) ? "★" : "☆"; wrap.querySelector("[data-lt-seg]").setAttribute("aria-pressed", String(SG.includes(st.pag)));
        disegnaEvid();
      };
      // evidenziatore: si trascina sulla pagina; le aree si salvano in coordinate relative (0–1), così restano giuste a ogni zoom
      const EV = ((u.activity.evid = u.activity.evid || {})[c.slug] = (u.activity.evid[c.slug] || {}));
      const strato = wrap.querySelector("[data-lt-evid]");
      let col = "";
      const disegnaEvid = () => { strato.innerHTML = (EV[st.pag] || []).map((r, i) => `<i class="c-${r.c}" data-ev="${i}" style="left:${r.x * 100}%;top:${r.y * 100}%;width:${r.w * 100}%;height:${r.h * 100}%"></i>`).join(""); strato.classList.toggle("attivo", !!col); strato.classList.toggle("gomma", col === "x"); };
      wrap.querySelectorAll("[data-col]").forEach((b) => b.addEventListener("click", () => { col = col === b.dataset.col ? "" : b.dataset.col; wrap.querySelectorAll("[data-col]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.col === col))); disegnaEvid(); }));
      let inizio = null, bozza = null;
      const pos = (e) => { const r = strato.getBoundingClientRect(); return [Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))]; };
      strato.addEventListener("pointerdown", (e) => {
        if (col === "x") { const i = e.target.dataset && e.target.dataset.ev; if (i != null) { EV[st.pag].splice(Number(i), 1); if (!EV[st.pag].length) delete EV[st.pag]; UL.store.save(); disegnaEvid(); } return; }
        if (!col) return; e.preventDefault(); strato.setPointerCapture(e.pointerId); inizio = pos(e);
        bozza = document.createElement("i"); bozza.className = "c-" + col; strato.appendChild(bozza);
      });
      strato.addEventListener("pointermove", (e) => { if (!inizio) return; const [x, y] = pos(e); Object.assign(bozza.style, { left: Math.min(x, inizio[0]) * 100 + "%", top: Math.min(y, inizio[1]) * 100 + "%", width: Math.abs(x - inizio[0]) * 100 + "%", height: Math.abs(y - inizio[1]) * 100 + "%" }); });
      strato.addEventListener("pointerup", (e) => { if (!inizio) return; const [x, y] = pos(e), r = { x: Math.min(x, inizio[0]), y: Math.min(y, inizio[1]), w: Math.abs(x - inizio[0]), h: Math.abs(y - inizio[1]), c: col }; inizio = null;
        if (r.w > 0.01 && r.h > 0.004) { (EV[st.pag] = EV[st.pag] || []).push(r); UL.store.save(); } disegnaEvid(); });
      const fcf = wrap.querySelector("[data-lt-fc]");
      fcf && fcf.addEventListener("submit", (e) => { e.preventDefault(); const f = fcf.f.value.trim(), b = fcf.b.value.trim(); if (!f || !b) return UL.ui.toast("Scrivi fronte e retro");
        const F = (u.activity.fc = u.activity.fc || {}); F[c.slug] = Object.assign({ mie: [], s: {}, nuoveOggi: { data: "", n: 0 } }, F[c.slug] || {});
        F[c.slug].mie.push({ id: "mia-" + Date.now().toString(36), f, b, cap: 0, pag: st.pag, at: new Date().toISOString() }); UL.store.save(); fcf.reset(); UL.ui.toast("Flashcard aggiunta al mazzo dell'esame"); });
      const vai = (n) => {
        st.pag = Math.min(Math.max(1, n), st.tot || n); inp.value = st.pag;
        (u.activity.letture = u.activity.letture || {})[c.slug] = st.pag; UL.store.save();
        disegnaNote(); disegna();
      };
      // v11 (commento 6 del 8/10): pagina intera nello schermo, schermo intero, frecce, indice dal PDF, segnalibri, note a scomparsa, timer
      const segn = () => ((u.activity.segnalibri = u.activity.segnalibri || {})[c.slug] = (u.activity.segnalibri[c.slug] || []));
      const ind = wrap.querySelector("[data-lt-ind]"), voci = [];
      const indice = () => { const SG = segn().slice().sort((a, b) => a - b);
        ind.innerHTML = `<option value="">Indice${voci.length ? "" : " e segnalibri"}</option>${voci.length ? `<optgroup label="Capitoli">${voci.map(([t, p2]) => `<option value="${p2}">${esc(t.length > 48 ? t.slice(0, 48) + "…" : t)} · p. ${p2}</option>`).join("")}</optgroup>` : ""}${SG.length ? `<optgroup label="Segnalibri">${SG.map((p2) => `<option value="${p2}">★ Pagina ${p2}</option>`).join("")}</optgroup>` : ""}`; };
      ind.addEventListener("change", () => { if (ind.value) vai(Number(ind.value)); ind.value = ""; });
      wrap.querySelector("[data-lt-seg]").addEventListener("click", () => { const SG = segn(), i = SG.indexOf(st.pag); i >= 0 ? SG.splice(i, 1) : SG.push(st.pag); UL.store.save(); indice(); disegna(); UL.ui.toast(i >= 0 ? "Segnalibro tolto" : "Segnalibro aggiunto"); });
      wrap.querySelectorAll("[data-lt-notebtn]").forEach((b) => b.addEventListener("click", () => { const chiuse = wrap.classList.toggle("note-chiuse"); u.activity.ltNote = chiuse ? "" : "aperte"; UL.store.save(); setTimeout(disegna, 50); }));
      const focus = (on) => { wrap.classList.toggle("lt-focus", on); document.body.style.overflow = on ? "hidden" : ""; wrap.querySelector("[data-lt-focus]").textContent = on ? "Esci (Esc)" : "Schermo intero"; setTimeout(disegna, 60); };
      wrap.querySelector("[data-lt-focus]").addEventListener("click", () => focus(!wrap.classList.contains("lt-focus")));
      const frecce = (e) => { if (!document.body.contains(wrap)) { document.removeEventListener("keydown", frecce); document.body.style.overflow = ""; return; } if (e.target.closest("input,textarea,select")) return;
        if (["ArrowRight", "PageDown"].includes(e.key)) { e.preventDefault(); vai(st.pag + 1); } else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); vai(st.pag - 1); }
        else if (e.key === "Escape" && wrap.classList.contains("lt-focus")) focus(false); else if (e.key.toLowerCase() === "f") focus(!wrap.classList.contains("lt-focus")); };
      document.addEventListener("keydown", frecce);
      let rit; window.addEventListener("resize", () => { clearTimeout(rit); rit = setTimeout(() => document.body.contains(wrap) && disegna(), 150); });
      const tb = wrap.querySelector("[data-lt-timer]"); let fine = 0, tic = null;
      tb.addEventListener("click", () => { if (tic) { clearInterval(tic); tic = null; tb.textContent = "⏱ 25:00"; return; } fine = Date.now() + 25 * 60000;
        tic = setInterval(() => { if (!document.body.contains(tb)) return clearInterval(tic); const r = Math.max(0, fine - Date.now()), m = Math.floor(r / 60000), sx = Math.floor((r % 60000) / 1000); tb.textContent = `⏱ ${m}:${String(sx).padStart(2, "0")}`; if (!r) { clearInterval(tic); tic = null; tb.textContent = "⏱ 25:00"; UL.ui.toast("25 minuti fatti: 5 minuti di pausa, poi riparti"); } }, 1000); });
      wrap.querySelector("[data-lt-prev]").addEventListener("click", () => vai(st.pag - 1));
      wrap.querySelector("[data-lt-next]").addEventListener("click", () => vai(st.pag + 1));
      inp.addEventListener("change", () => vai(Number(inp.value) || 1));
      wrap.querySelectorAll("[data-lt-zoom]").forEach((b) => b.addEventListener("click", () => { st.zoom = Math.min(2, Math.max(0.6, st.zoom + Number(b.dataset.ltZoom) * 0.2)); wrap.querySelector("[data-lt-z]").textContent = Math.round(st.zoom * 100) + "%"; disegna(); }));
      wrap.querySelector("[data-lt-form]").addEventListener("submit", (e) => {
        e.preventDefault(); const t = wrap.querySelector("#lt-t"), testo = t.value.trim(); if (!testo) return;
        (N[st.pag] = N[st.pag] || []).push({ id: "n" + Date.now().toString(36), testo, at: new Date().toISOString() });
        UL.store.addLog(u, "nota", `Nota a p. ${st.pag} di ${c.title}`); UL.store.save(); t.value = ""; disegnaNote(); UL.ui.toast("Nota salvata");
      });
      disegnaNote();
      if (!c.pdf) { stato.textContent = "Il file di questa dispensa non è ancora nella demo."; return; }
      indice();
      apri(c).then((doc) => { doc.getOutline().then(async (ol) => { for (const it of (ol || []).slice(0, 80)) { try { const d = typeof it.dest === "string" ? await doc.getDestination(it.dest) : it.dest; if (d && d[0]) voci.push([it.title, (await doc.getPageIndex(d[0])) + 1]); } catch (e) { /* voce senza pagina */ } } indice(); }).catch(() => {});
        st.doc = doc; st.tot = doc.numPages; wrap.querySelector("[data-lt-tot]").textContent = doc.numPages; inp.max = doc.numPages; vai(Math.min(st.pag, doc.numPages)); })
        .catch(() => { stato.innerHTML = "Non riesco a caricare la dispensa (serve la connessione). Riprova tra poco."; });
    },
  };
})();
