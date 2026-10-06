/* js/views/pratica.js */
/* Esercitazioni (dalla variante B della demo A) — v3: sblocco anche con Plus, test d'ingresso. */
/* Variante B — Esercitazioni: hub, modalità per esame, quiz runner (rapido / errori / simulazione / prova) */
(function () {
  const UL = window.UL;
  const B = UL.B;
  const { icon, esc, ago, ROMAN } = UL.ui;

  const MODES = {
    prova: { l: "Quiz di prova", n: 5, paid: false, d: "5 domande con spiegazione. Gratis per tutti." },
    rapido: { l: "Quiz rapido", n: 10, paid: true, d: "10 domande a caso con correzione immediata e spiegazione." },
    errori: { l: "Ripasso errori", n: 10, paid: false, d: "Solo le domande che hai sbagliato, finché non le azzecchi due volte di fila." },
    simulazione: { l: "Simulazione d'esame", n: 12, paid: true, min: 20, d: "12 domande in 20 minuti, correzione alla fine e voto in trentesimi." },
  };
  let timer = null;
  const stopTimer = () => { if (timer) { clearInterval(timer); timer = null; } };
  const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  function hub(user) {
    const withQ = B.courses().filter((c) => B.hasQuiz(c.slug));
    return `
      <div class="page-head"><div><div class="eyebrow">${icon("quiz")} Esercitazioni</div><h1>Allenati sui tuoi <span class="accent">esami</span></h1>
        <p class="lead">Si parte da tre esami pilota del I anno. Le tue risposte vengono salvate: l'area personale sa cosa ripassare.</p></div></div>
      <div class="exam-list">${withQ.map((c) => {
        const pr = B.progress(user, c.slug);
        const er = B.errors(user, c.slug).length;
        const own = B.ownsPractice(user, c.slug);
        return `<div class="exam-row">
          <div class="ring">${UL.ui.ring(pr, 64, 7)}<div class="lbl"><b>${pr}%</b></div></div>
          <div><div class="row" style="gap:8px">${own ? '<span class="badge badge-navy">Pacchetto attivo</span>' : '<span class="badge badge-soft">Solo prova gratuita</span>'}${er ? `<span class="badge badge-red">${er} da ripassare</span>` : ""}</div>
            <h3 style="margin-top:8px">${esc(c.title)}</h3><p class="small muted">${B.questions(c.slug).length} domande · ${[...new Set(B.questions(c.slug).map((q) => q.topic))].length} argomenti</p></div>
          <a class="btn btn-primary btn-sm" href="#/app/esercitazioni/${c.slug}">Apri</a></div>`;
      }).join("")}</div>
      <div class="card beige" style="margin-top:20px"><h3>Prossimi esami con esercitazioni</h3><p class="small muted" style="margin-top:6px">Dopo i tre esami pilota si aggiungono quelli con più richieste: scrivici quale vorresti.</p>
        <div class="chips" style="margin-top:12px">${B.courses().filter((c) => !B.hasQuiz(c.slug) && c.anno <= 2).slice(0, 8).map((c) => `<span class="chip chip-static">${esc(c.title)}</span>`).join("")}</div></div>`;
  }

  function examModes(user, slug) {
    const c = B.course(slug);
    const own = B.ownsPractice(user, slug);
    const er = B.errors(user, slug).length;
    const sess = user.activity.quiz.sessions.filter((s) => s.slug === slug);
    const tp = B.topics(user, slug);
    return `
      <a href="#/app/esercitazioni" class="small display" style="text-decoration:none">← Esercitazioni</a>
      <div class="page-head"><div><div class="eyebrow">${icon("quiz")} ${ROMAN[c.anno]} anno · ${esc(c.cds)}</div><h1>${esc(c.title)}</h1></div>
        ${own ? "" : `<button class="btn btn-orange" data-buy>Sblocca tutte le modalità</button>`}</div>
      <div class="mode-grid">${Object.entries(MODES).filter(([k]) => k !== "prova" || !own).map(([k, m]) => {
        const locked = m.paid && !own;
        const disabled = k === "errori" && !er;
        return `<div class="mode ${k === "errori" && er ? "focus" : ""}">
          <div class="row between"><h3>${m.l}</h3>${locked ? `<span class="lock">${icon("lock")} Pacchetto o Plus</span>` : k === "errori" ? `<span class="badge ${er ? "badge-red" : "badge-soft"}">${er}</span>` : ""}</div>
          <p>${m.d}</p>
          ${locked ? `<button class="btn btn-sm btn-ghost" data-buy>Sblocca</button>` : disabled ? `<span class="small muted">Nessun errore da ripassare.</span>` : `<a class="btn btn-sm btn-primary" href="#/app/esercitazioni/${slug}/${k}">Inizia</a>`}
        </div>`;
      }).join("")}</div>
      <div class="grid g-ov" style="margin-top:20px">
        <section class="card c-6"><div class="card-head"><h3>${icon("chart")} Argomenti</h3><span class="display" style="color:var(--orange);font-size:22px">${B.progress(user, slug)}%</span></div>
          <div class="bars-mini">${tp.map((t) => `<div class="r"><span>${esc(t.t)}</span><span class="t"><i style="width:${(t.ok / t.n) * 100}%"></i></span><b>${t.ok}/${t.n}</b></div>`).join("")}</div></section>
        <section class="card c-6"><div class="card-head"><h3>${icon("clock")} Storico sessioni</h3></div>
          <div class="table-wrap"><table class="table"><thead><tr><th>Modalità</th><th class="num">Risultato</th><th class="num">Tempo</th><th>Quando</th></tr></thead>
          <tbody>${sess.map((s) => `<tr><td>${esc(s.modeLabel)}</td><td class="num">${s.correct}/${s.n}${s.mode === "simulazione" ? ` · ${Math.round((s.correct / s.n) * 30)}/30` : ""}</td><td class="num">${mmss(s.dur || 0)}</td><td class="small muted">${ago(s.at)}</td></tr>`).join("") || '<tr><td colspan="4" class="muted" style="text-align:center;padding:16px">Nessuna sessione ancora.</td></tr>'}</tbody></table></div></section>
      </div>`;
  }

  function pickQuestions(user, slug, mode) {
    const all = B.questions(slug);
    if (mode === "prova") return all.slice(0, MODES.prova.n);
    if (mode === "errori") return B.shuffle(B.errors(user, slug)).slice(0, MODES.errori.n);
    return B.shuffle(all).slice(0, MODES[mode].n);
  }

  UL.views.praticaB = {
    title: (p) => (p[1] ? MODES[p[1]]?.l || "Esercitazioni" : "Esercitazioni"),
    render(user, params) {
      stopTimer();
      const [slug, mode] = params;
      if (!slug) return hub(user);
      if (!B.hasQuiz(slug)) return `<div class="empty">Esercitazioni non disponibili per questo esame. <a href="#/app/esercitazioni">Torna indietro</a></div>`;
      if (!mode) return examModes(user, slug);
      return `<a href="#/app/esercitazioni/${slug}" class="small display" style="text-decoration:none">← ${esc(B.course(slug).title)}</a><div style="margin-top:14px" data-run></div>`;
    },
    mount(root, user, params) {
      const [slug, mode] = params;
      root.querySelectorAll("[data-buy]").forEach((b) => b.addEventListener("click", () => B.upsell(user, slug)));
      if (!slug || !mode) return;
      const M = MODES[mode];
      if (!M) return UL.app.go(`#/app/esercitazioni/${slug}`);
      if (M.paid && !B.ownsPractice(user, slug)) { UL.ui.toast("Questa modalità è inclusa nel pacchetto esame e in Plus", "err"); return UL.app.go(`#/app/esercitazioni/${slug}`); }
      run(root.querySelector("[data-run]"), user, slug, mode);
    },
  };

  function run(box, user, slug, mode) {
    const M = MODES[mode];
    const qs = pickQuestions(user, slug, mode);
    if (!qs.length) { box.innerHTML = `<div class="card empty">Nessuna domanda da ripassare: ottimo lavoro!</div>`; return; }
    const exam = mode === "simulazione";
    const answers = [];
    let i = 0;
    const t0 = Date.now();
    let left = (M.min || 0) * 60;

    function draw() {
      const q = qs[i];
      box.innerHTML = `
        <div class="quiz">
          <div class="quiz-top"><span class="sq-label">${esc(M.l)} · domanda ${i + 1} di ${qs.length}</span>
            ${exam ? `<span class="timer">${icon("clock")} <span data-t>${mmss(left)}</span></span>` : `<span class="badge badge-soft">${esc(q.topic)}</span>`}</div>
          <div class="qprog"><i style="width:${(i / qs.length) * 100}%"></i></div>
          <p class="quiz-q">${esc(q.q)}</p>
          <div class="opts">${q.opts.map((o, j) => `<button class="opt" data-o="${j}"><span class="k">${"ABCD"[j]}</span><span>${esc(o)}</span></button>`).join("")}</div>
          <div class="explain" hidden><b>Spiegazione</b><br>${esc(q.x)}</div>
          <div class="row between" style="margin-top:16px"><button class="btn btn-sm btn-ghost" data-quit>Interrompi</button><button class="btn btn-primary" data-next hidden>${i < qs.length - 1 ? "Avanti" : "Vedi il risultato"}</button></div>
        </div>`;
      box.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => {
        const pick = Number(b.dataset.o);
        answers[i] = pick;
        box.querySelectorAll(".opt").forEach((x) => (x.disabled = true));
        if (exam) b.classList.add("picked");
        else {
          box.querySelectorAll(".opt").forEach((x) => Number(x.dataset.o) === q.a && x.classList.add("ok"));
          if (pick !== q.a) b.classList.add("ko");
          box.querySelector(".explain").hidden = false;
        }
        box.querySelector("[data-next]").hidden = false;
      }));
      box.querySelector("[data-next]").addEventListener("click", () => { if (i < qs.length - 1) { i++; draw(); } else finish(); });
      box.querySelector("[data-quit]").addEventListener("click", async () => {
        if (await UL.ui.confirmBox("Interrompere la sessione?", "Le risposte date finora vengono salvate.", "Interrompi")) finish(true);
      });
    }

    function finish(partial) {
      stopTimer();
      const done = qs.map((q, k) => ({ q, pick: answers[k] })).filter((x) => x.pick !== undefined || exam);
      const topics = {};
      let correct = 0;
      done.forEach(({ q, pick }) => {
        const ok = pick === q.a;
        if (ok) correct++;
        if (pick !== undefined) B.answer(user, q.id, ok);
        topics[q.topic] = topics[q.topic] || { n: 0, c: 0 };
        topics[q.topic].n++; if (ok) topics[q.topic].c++;
      });
      const n = done.length;
      if (!n) { UL.app.go(`#/app/esercitazioni/${slug}`); return; }
      B.saveSession(user, { slug, mode, modeLabel: M.l, n, correct, dur: Math.round((Date.now() - t0) / 1000), at: new Date().toISOString(), topics });
      const voto = Math.round((correct / n) * 30);
      const wrong = done.filter((x) => x.pick !== x.q.a);
      box.innerHTML = `
        <div class="quiz">
          <span class="sq-label">${esc(M.l)} · ${partial ? "interrotta" : "completata"}</span>
          <div class="row" style="gap:24px;margin:14px 0 6px;align-items:flex-end">
            <div class="result-big">${correct}<small>/${n}</small></div>
            ${exam ? `<div><span class="small muted">Voto stimato</span><div class="result-big" style="font-size:44px;color:${voto >= 18 ? "var(--green)" : "var(--red)"}">${voto}<small>/30</small></div></div>` : ""}
          </div>
          <p class="muted">${correct === n ? "Tutte corrette." : `${wrong.length} domande finiscono nel ripasso degli errori.`}</p>
          <div class="bars-mini" style="margin:18px 0">${Object.entries(topics).map(([t, v]) => `<div class="r"><span>${esc(t)}</span><span class="t"><i style="width:${(v.c / v.n) * 100}%"></i></span><b>${v.c}/${v.n}</b></div>`).join("")}</div>
          ${exam && wrong.length ? `<p class="label" style="margin:10px 0">Correzione</p>${wrong.map(({ q, pick }) => `<div class="explain" style="margin-top:10px"><b>${esc(q.q)}</b><br><span class="small">${pick === undefined ? "Non risposta" : "Hai risposto: " + esc(q.opts[pick])} · Corretta: <b>${esc(q.opts[q.a])}</b></span><br>${esc(q.x)}</div>`).join("")}` : ""}
          <div class="row" style="margin-top:20px">
            ${B.errors(user, slug).length ? `<a class="btn btn-primary" href="#/app/esercitazioni/${slug}/errori">Ripassa gli errori (${B.errors(user, slug).length})</a>` : ""}
            <a class="btn btn-ghost" href="#/app/esercitazioni/${slug}">Altre modalità</a>
            ${!B.ownsPractice(user, slug) ? `<button class="btn btn-orange" data-buy2>Sblocca: pacchetto o Plus</button>` : ""}
          </div>
        </div>`;
      const b2 = box.querySelector("[data-buy2]");
      b2 && b2.addEventListener("click", () => B.upsell(user, slug));
    }

    draw();
    if (exam) {
      timer = setInterval(() => {
        left--;
        const t = box.querySelector("[data-t]");
        if (t) t.textContent = mmss(Math.max(0, left));
        if (left <= 0) { UL.ui.toast("Tempo scaduto"); finish(); }
        if (!document.body.contains(box)) stopTimer();
      }, 1000);
    }
  }
})();

