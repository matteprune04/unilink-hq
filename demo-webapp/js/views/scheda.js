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
      <div class="banner" style="margin:18px 0 0">${icon("lock")}<span><b>Pagamento simulato.</b> Nella demo non vengono richiesti dati di carta e non avviene nessun addebito.</span></div>
      <div class="row" style="justify-content:flex-end;margin-top:18px"><button class="btn btn-ghost" data-close>Annulla</button><button class="btn btn-orange btn-arrow" data-pay>Conferma acquisto <span class="arr">${icon("arrow")}</span></button></div>`, { width: 560 });
    const cp = m.el.querySelector("#coupon");
    const tot = m.el.querySelector("[data-tot]");
    cp.addEventListener("input", () => {
      const d = B.COUPONS[cp.value.trim().toUpperCase()] || 0;
      tot.innerHTML = d ? `<s class="muted" style="font-size:18px">${B.eur(item.price)}</s> ${B.eur(Math.round(item.price * (1 - d) * 100) / 100)}` : B.eur(item.price);
    });
    m.el.querySelector("[data-pay]").addEventListener("click", () => {
      const p = B.buy(user, item, cp.value.trim());
      m.close();
      UL.ui.toast(`Acquisto completato: ${item.label}`);
      onDone && onDone(p);
    });
  };
  B.examItem = (c) => ({
    type: "exam", slug: c.slug, price: B.PRICES.exam, label: "Pacchetto " + c.title,
    incl: ["Dispensa completa e aggiornata", c.mappe ? "Mappe & schemi" : "Schemi riassuntivi", B.hasQuiz(c.slug) ? `${B.questions(c.slug).length} domande con spiegazione` : "Quiz & simulazioni (PDF)", "Simulazioni a tempo e ripasso degli errori", "Aggiornamenti fino a fine anno accademico"],
  });
  B.semItem = (cds, anno, sem) => ({
    type: "semester", cds, anno: Number(anno), sem: Number(sem), price: B.PRICES.semester,
    label: `Pacchetto ${ROMAN[anno]} anno · ${ROMAN[sem]} semestre ${cds}`,
    incl: B.semesterCourses(cds, anno, sem).map((c) => c.title).concat(["Tutto ciò che è incluso nei pacchetti esame"]),
  });

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
      const sem = B.semesterCourses(c.cds.includes(user.profile.cds || "EA") ? user.profile.cds || "EA" : c.cds.split("/")[0], c.anno, c.sem).filter((x) => x.slug !== c.slug);
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
        <div class="buy-card">
          <div class="row between"><b class="display" style="color:var(--navy)">Pacchetto esame</b><span class="display" style="font-size:28px;color:var(--navy)">${B.eur(B.PRICES.exam)}</span></div>
          <ul class="incl">
            <li class="free">${icon("check")}<span>Scheda, partizioni e consigli — gratis</span></li>
            ${B.hasQuiz(c.slug) ? `<li class="free">${icon("check")}<span>Prova gratuita di 3 domande — gratis</span></li>` : ""}
            ${B.examItem(c).incl.map((x) => `<li class="paid">${icon(owned ? "check" : "lock")}<span>${esc(x)}</span></li>`).join("")}
          </ul>
          ${owned ? `<a class="btn btn-primary btn-block" href="${esc(c.pdf || "#")}" target="_blank" rel="noopener">${icon("download")} Apri la dispensa</a>` : `<button class="btn btn-orange btn-block" data-buy>Sblocca il pacchetto</button>`}
          <span class="lock">${icon("lock")} Pagamento simulato nella demo</span>
        </div>
      </div>
      <div class="grid g-ov" style="margin-top:20px">
        <div class="card c-7"><div class="card-head"><h3>${icon("info")} Informazioni utili</h3></div><div class="syllabus">${c.info || '<p class="muted">Informazioni in arrivo.</p>'}</div>
          ${c.unifi ? `<a class="btn btn-sm btn-ghost" style="margin-top:14px" href="${esc(c.unifi)}" target="_blank" rel="noopener">${icon("ext")} Scheda ufficiale UniFi</a>` : ""}</div>
        <div class="c-5 stack">
          ${B.hasQuiz(c.slug) ? (owned ? `<div class="card"><h3>Esercitazioni sbloccate</h3><p class="small muted" style="margin:6px 0 12px">${B.questions(c.slug).length} domande, simulazioni e ripasso errori.</p><a class="btn btn-primary btn-sm" href="#/app/esercitazioni/${c.slug}">Vai alle esercitazioni</a></div>` : miniQuiz(c.slug, 3))
            : `<div class="card beige"><h3>Esercitazioni in arrivo</h3><p class="small muted" style="margin-top:6px">Si parte da Microeconomia, Economia Aziendale e Statistica. Per questo esame il pacchetto include quiz e simulazioni in PDF.</p></div>`}
          ${sem.length ? `<div class="card"><h3>Stesso semestre</h3><p class="small muted" style="margin:6px 0 12px">Con il pacchetto semestre (${B.eur(B.PRICES.semester)}) prendi anche:</p>
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
      const b = root.querySelector("[data-buy]");
      b && b.addEventListener("click", () => B.checkout(user, B.examItem(c), () => UL.app.refresh()));
      const add = root.querySelector("[data-add]");
      add && add.addEventListener("click", () => {
        user.activity.exams.push({ slug: c.slug, partizione: "", appello: "", obiettivo: "", status: "todo" });
        UL.store.save(); UL.ui.toast("Aggiunto ai tuoi esami"); UL.app.refresh();
      });
    },
  };
})();

