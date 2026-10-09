/* js/views/scheda.js */
/* Variante B — scheda esame dentro l'area personale (anteprima gratuita, prova di 3 domande, sblocco) + checkout simulato */
(function () {
  const UL = window.UL;
  const B = UL.B;
  const { icon, esc, ROMAN } = UL.ui;

  /* ---------- checkout simulato ---------- */
  B.checkout = (user, item, onDone) => {
    const m = UL.ui.modal(`
      <div class="modal-head"><div><span class="sq-label">Riepilogo ordine</span><h2 style="margin-top:8px">${esc(item.label)}</h2></div>
        <button class="icon-btn" data-close aria-label="Chiudi">${icon("x")}</button></div>
      <ul class="incl" style="margin-bottom:16px">${(item.incl || []).map((x) => `<li class="paid">${icon("check")}<span>${esc(x)}</span></li>`).join("")}</ul>
      <div class="grid-2" style="align-items:end">
        <div class="field"><label for="coupon">Codice sconto</label><input class="input" id="coupon" placeholder="es. BENVENUTO10"></div>
        <div style="text-align:right"><span class="small muted">Totale</span><div class="display" style="font-size:34px;color:var(--navy)" data-tot>${B.eur(item.price)}</div></div>
      </div>
      <div class="banner" style="margin:18px 0 0">${icon("lock")}<span><b>Si paga con Stripe:</b> carta, Apple Pay, Google Pay o Klarna. Nella demo il pagamento è simulato (carta di prova, nessun addebito).</span></div>
      <div class="row" style="justify-content:flex-end;margin-top:18px"><button class="btn btn-ghost" data-close>Annulla</button><button class="btn btn-orange btn-arrow" data-pay>Vai al pagamento <span class="arr">${icon("arrow")}</span></button></div>`, { width: 560 });
    const cp = m.el.querySelector("#coupon");
    const tot = m.el.querySelector("[data-tot]");
    cp.addEventListener("input", () => {
      const d = B.COUPONS[cp.value.trim().toUpperCase()] || 0;
      tot.innerHTML = d ? `<s class="muted" style="font-size:18px">${B.eur(item.price)}</s> ${B.eur(Math.round(item.price * (1 - d) * 100) / 100)}` : B.eur(item.price);
    });
    // v5: pagamento con Stripe Checkout (simulato, checkout-stripe.js). Lo sblocco avviene a pagamento riuscito (webhook).
    m.el.querySelector("[data-pay]").addEventListener("click", () => {
      const code = cp.value.trim(), d = B.COUPONS[code.toUpperCase()] || 0, prezzo = Math.round(item.price * (1 - d) * 100) / 100;
      let p = null;
      m.close();
      const fine = () => { UL.ui.toast(`Acquisto completato: ${item.label}`); onDone && onDone(p); };
      if (!window.UL_CHECKOUT) { p = B.buy(user, item, code); return fine(); }
      window.UL_CHECKOUT.apri({ voci: [{ id: item.type + (item.slug ? ":" + item.slug : ""), nome: item.label, nota: d ? `codice ${code.toUpperCase()} · prezzo pieno ${B.eur(item.price)}` : "", prezzo }],
        email: user.email, cosa: item.label, dove: "webapp", dopo: "Torna all'area personale",
        onPagato: (r) => { p = B.buy(user, item, code); p.pagamento = { via: "stripe", metodo: r.metodo, commissione: r.commissione }; UL.store.save(); }, onFatto: fine });
    });
  };
  /* ---------- v7 · articoli del listino (decisioni del 7/10: prezzi di lancio, niente Appunti singoli né Pacchetto anno) ---------- */
  const lancio = (k, n) => `Prezzo di lancio: invece di ${B.eur(B.prezzoPieno(k, n))}`;
  B.simulazioneItem = (c) => ({ type: "simulazione", slug: c.slug, price: B.prezzo("simulazione", c), label: "Simulazione d'esame · " + c.title,
    incl: ["Una simulazione nel formato dell'appello, a tempo", "Correzione con le spiegazioni e il registro dei tuoi errori", "Informazioni utili su esame e partizioni", lancio("simulazione")] });
  B.completaItem = (c) => ({ type: "completa", slug: c.slug, price: B.prezzo("completa", c), label: "Dispensa completa · " + c.title,
    incl: ["La dispensa completa, da leggere e annotare nell'area personale (non si scarica)", B.hasQuiz(c.slug) ? `Esercitazioni complete: ${B.questions(c.slug).length} domande, quiz rapido e simulazione d'esame` : "Quiz e simulazioni dell'appello", "Il piano personale del Planner per questo esame", "Aggiornamenti della stessa edizione", lancio("completa")] });
  B.examItem = B.completaItem; // compatibilità con le viste della demo A/B
  // pacchetto semestre del PERCORSO (corso + curriculum): 3 esami 29,99 · 4 esami 34,99; con più di 4 esami lo studente ne sceglie 4
  B.semItem = (cds, anno, sem, curr, scelti) => {
    const tutti = B.semesterCourses(cds, anno, sem, curr), max = UL.PIANI.maxEsamiPacchetto || 4;
    const esami = (scelti && scelti.length ? tutti.filter((c) => scelti.includes(c.slug)) : tutti).slice(0, max);
    const nc = curr && window.UL_PERCORSI ? " · " + window.UL_PERCORSI.nomeCurr(cds, curr) : "";
    return { type: "semester", cds, curr: curr || "", anno: Number(anno), sem: Number(sem), esami: esami.map((c) => c.slug), price: B.prezzo("semester", null, esami.length),
      label: `Pacchetto semestre · ${ROMAN[anno]} anno, ${ROMAN[sem]} semestre ${cds}${nc}`,
      incl: esami.map((c) => "Dispensa completa · " + c.title).concat([`${esami.length} esami · ${lancio("semester", esami.length)}`, "Con un pacchetto Plus costa " + B.eur(B.PRICES.plusConPacchetto)]) };
  };
  // valore delle complete comprate una per una (per i confronti «invece di»)
  B.valoreSingoli = (list) => list.reduce((n, c) => n + B.prezzo("completa", c), 0);

  /* ---------- prova gratuita (3 domande) ---------- */
  function miniQuiz(slug, n) {
    const qs = B.questions(slug).slice(0, n);
    return `<div class="quiz" data-mini style="max-width:none">
      <div class="quiz-top"><span class="sq-label">Prova gratuita · ${qs.length} domande</span><span class="small muted" data-mscore></span></div>
      ${qs.map((q, i) => `<div data-mq="${i}" ${i ? "hidden" : ""}>
        <p class="quiz-q">${esc(q.q)}</p>
        <div class="opts">${q.opts.map((o, j) => `<button class="opt" data-o="${j}"><span class="k">${"ABCD"[j]}</span><span>${esc(o)}</span></button>`).join("")}</div>
        <div class="explain" hidden><b>Spiegazione</b><br>${esc(q.x)}</div>
        <div class="row" style="justify-content:flex-end;margin-top:12px" hidden data-next><button class="btn btn-sm btn-primary">${i < qs.length - 1 ? "Prossima domanda" : "Vedi risultato"}</button></div>
      </div>`).join("")}
      <div data-mend hidden></div>
    </div>`;
  }
  function bindMiniQuiz(root, slug, user) {
    const box = root.querySelector("[data-mini]");
    if (!box) return;
    const qs = B.questions(slug);
    let ok = 0, started = false;
    box.querySelectorAll("[data-mq]").forEach((el) => {
      const i = Number(el.dataset.mq);
      el.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => {
        if (!started) { started = true; B.track("prova", slug); }
        const right = Number(b.dataset.o) === qs[i].a;
        if (right) ok++;
        B.answer(user, qs[i].id, right);
        el.querySelectorAll(".opt").forEach((x) => { x.disabled = true; if (Number(x.dataset.o) === qs[i].a) x.classList.add("ok"); });
        if (!right) b.classList.add("ko");
        el.querySelector(".explain").hidden = false;
        el.querySelector("[data-next]").hidden = false;
        box.querySelector("[data-mscore]").textContent = `${ok} corrette`;
      }));
      el.querySelector("[data-next] button").addEventListener("click", () => {
        el.hidden = true;
        const nx = box.querySelector(`[data-mq="${i + 1}"]`);
        if (nx) { nx.hidden = false; return; }
        UL.store.save();
        const end = box.querySelector("[data-mend]");
        end.hidden = false;
        end.innerHTML = `<p class="quiz-q">Hai risposto correttamente a ${ok} domande su ${box.querySelectorAll("[data-mq]").length}.</p>
          <p class="small muted">Con il pacchetto trovi tutte le ${qs.length} domande, le simulazioni a tempo e il ripasso automatico degli errori.</p>
          <div class="row" style="margin-top:12px"><a class="btn btn-primary" href="#/app/esercitazioni/${slug}">Vai alle esercitazioni</a></div>`;
      });
    });
  }

  UL.views.schedaB = {
    title: (p) => (B.course(p[0]) || {}).title || "Scheda esame",
    render(user, params) {
      const c = B.course(params[0]);
      if (!c) return `<div class="empty">Esame non trovato. <a href="#/app/materiali/catalogo">Torna al catalogo</a></div>`;
      const owned = B.owns(user, c.slug);
      const mine = user.activity.exams.some((e) => e.slug === c.slug);
      const semTutti = B.semesterCourses(c.cds.includes(B.cdsDi(user)) ? B.cdsDi(user) : c.cds.split("/")[0], c.anno, c.sem, B.currDi(user)), sem = semTutti.filter((x) => x.slug !== c.slug);
      return `
      <a href="#/app/materiali/catalogo" class="small display" style="text-decoration:none">← Catalogo</a>
      <div class="exam-hero" style="margin-top:14px">
        <div>
          <span class="sq-label" style="color:#fff">${esc(c.cds)} · ${ROMAN[c.anno]} anno · ${ROMAN[c.sem]} semestre</span>
          <h1 style="margin-top:12px">${esc(c.title)}</h1>
          <div class="meta">${c.code ? `<span>${esc(c.code)}</span>` : ""}${c.cfu ? `<span>${c.cfu} CFU</span>` : ""}${c.diff ? `<span>Difficoltà: ${esc(c.diff)}</span>` : ""}${c.voto ? `<span>Voto degli appunti ${esc(c.voto.replace(/\s*\/\s*/g, "/"))}</span>` : ""}</div>
          ${c.docenti.length ? `<p class="small" style="margin-top:16px;color:rgba(255,255,255,.75)">Partizioni: ${c.docenti.map(esc).join(" · ")}</p>` : ""}
          <div class="row" style="margin-top:18px">${mine ? `<a class="btn btn-white btn-sm" href="#/app/esami/${c.slug}">Nei miei esami</a>` : `<button class="btn btn-white btn-sm" data-add>${icon("plus")} Aggiungi ai miei esami</button>`}</div>
        </div>
        <div class="buy-card">${UL.U && UL.U.buyCard ? UL.U.buyCard(user, c) : ""}</div>
      </div>
      <div class="grid g-ov" style="margin-top:20px">
        <div class="card c-7"><div class="card-head"><h3>${icon("info")} Informazioni utili</h3></div><div class="syllabus">${c.info || '<p class="muted">Informazioni in arrivo.</p>'}</div>
          ${c.unifi ? `<a class="btn btn-sm btn-ghost" style="margin-top:14px" href="${esc(c.unifi)}" target="_blank" rel="noopener">${icon("ext")} Scheda ufficiale UniFi</a>` : ""}</div>
        <div class="c-5 stack">
          ${B.hasQuiz(c.slug) ? (B.ownsCompleta(user, c.slug) ? `<div class="card"><h3>Esercitazioni sbloccate</h3><p class="small muted" style="margin:6px 0 12px">${B.questions(c.slug).length} domande, simulazioni e ripasso errori.</p><a class="btn btn-primary btn-sm" href="#/app/esercitazioni/${c.slug}">Vai alle esercitazioni</a></div>` : miniQuiz(c.slug, 3))
            : `<div class="card beige"><h3>Esercitazioni in arrivo</h3><p class="small muted" style="margin-top:6px">Si parte da Microeconomia, Economia Aziendale e Statistica. Per questo esame la dispensa completa include quiz e simulazioni da fare nell'app.</p></div>`}
          ${sem.length ? `<div class="card"><h3>Stesso semestre</h3><p class="small muted" style="margin:6px 0 12px">Con il pacchetto semestre del tuo percorso (${B.eur(B.prezzo("semester", null, semTutti.length))}) hai le complete anche di:</p>
            <ul class="feed">${sem.slice(0, 5).map((x) => `<li><span class="ic">${icon("book")}</span><div><a href="#/app/scheda/${x.slug}" style="text-decoration:none;color:var(--ink)">${esc(x.title)}</a></div></li>`).join("")}</ul>
            <a class="btn btn-sm btn-ghost" style="margin-top:10px" href="#/app/materiali/semestre">Pacchetti semestre</a></div>` : ""}
        </div>
      </div>`;
    },
    mount(root, user, params) {
      const c = B.course(params[0]);
      if (!c) return;
      B.track("visita", c.slug);
      bindMiniQuiz(root, c.slug, user);
      UL.U && UL.U.bindBuyCard && UL.U.bindBuyCard(root, user, c);
      const add = root.querySelector("[data-add]");
      add && add.addEventListener("click", () => {
        user.activity.exams.push({ slug: c.slug, partizione: "", appello: "", obiettivo: "", status: "todo" });
        UL.store.save(); UL.ui.toast("Aggiunto ai tuoi esami"); UL.app.refresh();
      });
    },
  };
})();

