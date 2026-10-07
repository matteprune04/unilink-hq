/* js/views/lettore.js — web app v7 · LETTORE DELLE DISPENSE (decisione del 7/10: «materiali non scaricabili: consultabili e
   annotabili solo nell'area personale della web app»). Rotta: #/app/leggi/<slug>.
   - Il PDF si disegna pagina per pagina su un <canvas> con PDF.js (cdnjs, versione fissa): niente pulsante di download o stampa,
     niente tasto destro, niente selezione del testo, Ctrl/Cmd+S e Ctrl/Cmd+P bloccati mentre il lettore è aperto.
   - Filigrana personale sopra ogni pagina: nome, cognome, email dello studente (in produzione la mette anche il server, vedi
     Da decidere D39 · nella demo solo a schermo).
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
      const fil = `${[u.profile.nome, u.profile.cognome].filter(Boolean).join(" ")} · ${u.email} · UniLink`;
      return `<a href="#/app/materiali" class="small display" style="text-decoration:none">← Materiali</a>
        <div class="page-head" style="margin-top:12px"><div><div class="eyebrow">${icon("book")} Lettore · ${esc(c.code || "")}</div><h1>${esc(c.title)}</h1>
          <p class="lead">Leggi e annota qui. Le note restano nel tuo account; la dispensa non si scarica e porta la tua filigrana.</p></div>
          <div class="row"><a class="btn btn-ghost btn-sm" href="#/app/scheda/${c.slug}">${icon("info")} Scheda</a>${B.hasQuiz(c.slug) ? `<a class="btn btn-ghost btn-sm" href="#/app/esercitazioni/${c.slug}">${icon("quiz")} Allenati</a>` : ""}</div></div>
        <div class="lt-wrap" data-lt="${esc(c.slug)}">
          <section class="lt-main card">
            <div class="lt-bar"><button class="icon-btn" data-lt-prev aria-label="Pagina precedente">‹</button><span class="small"><label for="lt-p" class="sr-only">Pagina</label>Pagina <input id="lt-p" class="input lt-num" type="number" min="1" value="${pag}"> di <b data-lt-tot>…</b></span><button class="icon-btn" data-lt-next aria-label="Pagina successiva">›</button>
              <span class="lt-sp"></span><button class="icon-btn" data-lt-zoom="-1" aria-label="Rimpicciolisci">−</button><span class="tiny muted" data-lt-z>100%</span><button class="icon-btn" data-lt-zoom="1" aria-label="Ingrandisci">+</button></div>
            <div class="lt-pagina" data-lt-pag><canvas aria-label="Pagina della dispensa"></canvas><div class="lt-fil" aria-hidden="true">${Array.from({ length: 14 }, () => `<span>${esc(fil)}</span>`).join("")}</div><div class="lt-stato small muted" data-lt-stato>Carico la dispensa…</div></div>
          </section>
          <aside class="lt-note card">
            <div class="card-head"><h3>${icon("edit")} Note · pagina <span data-lt-np>${pag}</span></h3><span class="badge badge-soft" data-lt-cnt>${n} in tutto</span></div>
            <form data-lt-form><label class="sr-only" for="lt-t">Scrivi una nota</label><textarea class="textarea" id="lt-t" rows="3" maxlength="600" placeholder="Scrivi una nota su questa pagina…"></textarea><button class="btn btn-primary btn-sm" style="margin-top:8px">Aggiungi la nota</button></form>
            <ul class="lt-lista" data-lt-qui></ul>
            <details class="lt-tutte"><summary class="small">Tutte le note della dispensa</summary><ul class="lt-lista" data-lt-tutte></ul></details>
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
        wrap.querySelector("[data-lt-cnt]").textContent = quante(u, c.slug) + " in tutto";
        wrap.querySelector("[data-lt-qui]").innerHTML = qui.map((x) => `<li><p>${esc(x.testo)}</p><span class="tiny muted">${fmtDate(x.at, true)}</span><button class="icon-btn" data-lt-del="${x.id}" aria-label="Cancella la nota">${icon("trash")}</button></li>`).join("") || '<li class="small muted">Nessuna nota su questa pagina.</li>';
        const tutte = Object.entries(N).flatMap(([p, l]) => l.map((x) => [Number(p), x])).sort((a, b) => a[0] - b[0]);
        wrap.querySelector("[data-lt-tutte]").innerHTML = tutte.map(([p, x]) => `<li><button class="link small" data-lt-vai="${p}">p. ${p}</button> ${esc(x.testo.length > 90 ? x.testo.slice(0, 90) + "…" : x.testo)}</li>`).join("") || '<li class="small muted">Ancora nessuna nota.</li>';
        wrap.querySelectorAll("[data-lt-del]").forEach((b) => b.addEventListener("click", () => { N[st.pag] = (N[st.pag] || []).filter((x) => x.id !== b.dataset.ltDel); if (!N[st.pag].length) delete N[st.pag]; UL.store.save(); disegnaNote(); }));
        wrap.querySelectorAll("[data-lt-vai]").forEach((b) => b.addEventListener("click", () => vai(Number(b.dataset.ltVai))));
      };
      const disegna = async () => {
        if (!st.doc) return;
        const p = await st.doc.getPage(st.pag), box = wrap.querySelector("[data-lt-pag]");
        const base = p.getViewport({ scale: 1 }), scala = Math.max(0.4, ((box.clientWidth - 2) / base.width) * st.zoom), dpr = Math.min(2, window.devicePixelRatio || 1);
        const vp = p.getViewport({ scale: scala * dpr });
        cv.width = vp.width; cv.height = vp.height; cv.style.width = vp.width / dpr + "px"; cv.style.height = vp.height / dpr + "px";
        if (st.render) try { st.render.cancel(); } catch (e) { /* già finita */ }
        st.render = p.render({ canvasContext: cv.getContext("2d"), viewport: vp });
        try { await st.render.promise; } catch (e) { return; }
        stato.hidden = true;
      };
      const vai = (n) => {
        st.pag = Math.min(Math.max(1, n), st.tot || n); inp.value = st.pag;
        (u.activity.letture = u.activity.letture || {})[c.slug] = st.pag; UL.store.save();
        disegnaNote(); disegna();
      };
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
      apri(c).then((doc) => { st.doc = doc; st.tot = doc.numPages; wrap.querySelector("[data-lt-tot]").textContent = doc.numPages; inp.max = doc.numPages; vai(Math.min(st.pag, doc.numPages)); })
        .catch(() => { stato.innerHTML = "Non riesco a caricare la dispensa (serve la connessione). Riprova tra poco."; });
    },
  };
})();
