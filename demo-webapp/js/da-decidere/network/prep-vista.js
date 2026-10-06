/* network · prep-vista.js
   Modulo Network · VISTE testD (rotta test), academyD (academy), ammissioniD (ammissioni). Architettura: network/core.js. */
/* Variante D — Test & simulazioni (stile Sarfatti Strategy / TopSquad), Academy (stile Starting Finance), Ammissioni (stile Astra) */
(function () {
  const UL = window.UL;
  const D = UL.D;
  const DATA = window.UL_D;
  const { icon, esc, ago, num } = UL.ui;
  let timer = null;
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const MODE = { diagnostico: "Test diagnostico", materia: "Allenamento per materia", simulazione: "Simulazione completa" };
  const head = (e, i, t, l, r) => `<div class="page-head"><div><div class="eyebrow">${icon(i)} ${esc(e)}</div><h1>${t}</h1>${l ? `<p class="lead">${l}</p>` : ""}</div>${r || ""}</div>`;
  const pay = (title, price, note, ok) => {
    const m = UL.ui.modal(`<div class="modal-head"><div><span class="sq-label">Conferma</span><h2 style="margin-top:8px">${esc(title)}</h2></div><button class="icon-btn" data-close>${icon("x")}</button></div>
      <p>${note}</p><div class="row between" style="margin-top:14px"><span class="label">Totale</span><b class="display" style="font-size:30px;font-weight:400;color:var(--navy)">${D.eur(price)}</b></div>
      <div class="banner" style="margin:14px 0 0">${icon("lock")}<span>Pagamento simulato: nessun addebito.</span></div>
      <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-ghost" data-close>Annulla</button><button class="btn btn-orange" data-ok>Conferma</button></div>`, { width: 520 });
    m.el.querySelector("[data-ok]").addEventListener("click", () => { ok(); m.close(); });
  };

  /* ---------------- TEST: hub ---------------- */
  function hub(u) {
    const prep = D.hasPrep(u);
    const subs = D.subjects(u);
    const sess = u.activity.tests.sessions;
    const media = UL.store.career(u.profile).media || 27;
    return `
      ${head("Test e simulazioni", "quiz", 'Prepara il tuo <span class="accent">test</span>', "Test d'ingresso alla triennale, test per le magistrali, GMAT. Banca domande per materia, simulazioni a tempo e statistiche.", prep ? '<span class="badge badge-green">Accesso completo</span>' : `<button class="btn btn-orange" data-self>Self-study 6 mesi · ${D.eur(DATA.selfStudy)}</button>`)}
      <div class="stack" style="gap:14px">${DATA.tests.map((t) => `<div class="exam-row" style="grid-template-columns:1fr auto">
        <div><h3>${esc(t.t)}</h3><p class="small muted" style="margin-top:4px">${esc(t.d)}</p>
          <p class="small" style="margin-top:6px">Miglior simulazione: <b>${D.best(u, t.id) == null ? "—" : D.best(u, t.id) + "%"}</b> · ${sess.filter((s) => s.test === t.id).length} sessioni</p></div>
        <div class="row">
          <a class="btn btn-sm btn-ghost" href="#/app/test/${t.id}/diagnostico">Diagnostico gratuito</a>
          ${prep ? `<a class="btn btn-sm btn-primary" href="#/app/test/${t.id}/simulazione">Simulazione · ${t.sim.n} domande, ${t.sim.min} min</a>`
            : `<button class="btn btn-sm btn-primary" data-credits="${t.id}" ${u.activity.credits < 100 ? "disabled" : ""}>Simulazione con 100 crediti</button>`}
        </div></div>`).join("")}</div>
      <div class="grid g-ov" style="margin-top:20px">
        <section class="card c-6"><div class="card-head"><h3>${icon("chart")} Le tue statistiche per materia</h3></div>
          <div class="stack" style="gap:10px">${subs.map((s) => `<div class="row between" style="flex-wrap:nowrap"><div style="flex:1"><div class="row between"><span>${s.s}</span><b class="display" style="font-weight:400">${s.acc == null ? "—" : s.acc + "%"}</b></div>
            <div class="progress" style="margin-top:6px"><i style="width:${s.acc || 0}%"></i></div><span class="tiny muted">${s.seen}/${s.n} domande viste</span></div>
            ${prep ? `<a class="btn btn-sm btn-ghost" href="#/app/test/msc/materia/${encodeURIComponent(s.s)}">Allenati</a>` : `<span class="lock">${icon("lock")}</span>`}</div>`).join("")}</div></section>
        <section class="card c-6"><div class="card-head"><h3>${icon("target")} Predittore di ammissione</h3><span class="small muted">illustrativo</span></div>
          <div class="grid-2">
            <div class="field"><label for="pr-media">La tua media</label><input class="input" id="pr-media" value="${num(media, 1).replace(",", ".")}" inputmode="decimal"></div>
            <div class="field"><label for="pr-score">Punteggio simulazione (%)</label><input class="input" id="pr-score" value="${D.best(u) == null ? "" : D.best(u)}" inputmode="numeric" placeholder="fai una simulazione"></div>
            <div class="field span-2"><label for="pr-prog">Programma obiettivo</label><select class="select" id="pr-prog">${window.UL_PROGRAMMI.filter((p) => /BOCCONI|LUISS|FIRENZE|BOLOGNA|CATTOLICA|ROTTERDAM|NOVA|ESADE/.test(p.school)).slice(0, 40).map((p) => `<option value="${p.id}">${esc(p.school)} — ${esc(p.program)}</option>`).join("")}</select></div>
          </div>
          <div data-pred style="margin-top:14px"></div></section>
      </div>
      <section class="card" style="margin-top:20px"><div class="card-head"><h3>${icon("users")} Tutoring 1:1</h3><span class="small muted">con studenti che hanno superato il test di recente</span></div>
        <div class="pricing three">${DATA.tutoring.map((t, i) => `<div class="plan ${i === 1 ? "hot" : ""}" data-hot="Più scelto"><h3>${t.t}</h3><div class="price">${D.eur(D.isPass(u) ? Math.round(t.price * 0.85) : t.price)} <small>/ ${t.h} ore</small></div><p class="small">${esc(t.d)}</p>
          ${u.activity.purchases.some((p) => p.ref === t.id) ? '<span class="badge badge-green">Acquistato</span>' : `<button class="btn btn-primary" data-tut="${t.id}">Scegli</button>`}</div>`).join("")}</div>
        <p class="tiny muted" style="margin-top:10px">Prezzi ipotetici; con il Pass −15%.</p></section>`;
  }

  function predHtml(root) {
    const media = parseFloat(root.querySelector("#pr-media").value.replace(",", "."));
    const sc = root.querySelector("#pr-score").value;
    const prog = window.UL_PROGRAMMI.find((p) => p.id === root.querySelector("#pr-prog").value);
    const r = D.predict(media, sc === "" ? null : Number(sc), prog);
    if (!r) return "";
    const B = { sopra: ["Sopra il riferimento", "fit-safe"], linea: ["In linea con il riferimento", "fit-match"], sotto: ["Sotto il riferimento", "fit-reach"], nodata: ["Fai una simulazione per il confronto", "badge-soft"] }[r.band];
    return `<div class="row between"><span class="label">Punteggio di riferimento stimato</span><b class="display" style="font-size:26px;font-weight:400;color:var(--navy)">${r.req}%</b></div>
      <span class="badge ${B[1]}" style="margin-top:8px">${B[0]}</span>
      <p class="tiny muted" style="margin-top:8px">Stima basata sulla classificazione ${window.UL.reco.TIER[prog.tier].label} del programma e sulla tua media: ogni punto di media sopra il 27 abbassa il riferimento di 4 punti. Non è una previsione ufficiale.</p>`;
  }

  UL.views.testD = {
    title: "Test e simulazioni",
    render(u, params) {
      stop();
      const [tid, mode] = params;
      if (!tid) return hub(u);
      return `<a href="#/app/test" class="small display" style="text-decoration:none">← Test e simulazioni</a><div style="margin-top:14px" data-run></div>`;
    },
    mount(root, u, params) {
      const [tid, mode, subj] = params;
      if (!tid) {
        const pr = root.querySelector("[data-pred]");
        const upd = () => (pr.innerHTML = predHtml(root));
        ["#pr-media", "#pr-score", "#pr-prog"].forEach((s) => root.querySelector(s).addEventListener("input", upd));
        root.querySelector("#pr-prog").addEventListener("change", upd);
        upd();
        const self = root.querySelector("[data-self]");
        self && self.addEventListener("click", () => pay("Self-study (6 mesi)", DATA.selfStudy, "Banca domande completa, allenamento per materia e simulazioni illimitate.", () => { D.buy(u, { type: "selfstudy", ref: "all", label: "Self-study test (6 mesi)", price: DATA.selfStudy }); UL.ui.toast("Accesso attivato"); UL.app.refresh(); }));
        root.querySelectorAll("[data-tut]").forEach((b) => b.addEventListener("click", () => {
          const t = DATA.tutoring.find((x) => x.id === b.dataset.tut);
          const price = D.isPass(u) ? Math.round(t.price * 0.85) : t.price;
          pay(`Tutoring ${t.t}`, price, `${t.h} ore con un tutor. ${t.d}`, () => { D.buy(u, { type: "tutoring", ref: t.id, label: `Tutoring ${t.t} (${t.h} ore)`, price }); UL.ui.toast("Tutoring acquistato: il tutor ti scriverà entro 24 ore (demo)"); UL.app.refresh(); });
        }));
        root.querySelectorAll("[data-credits]").forEach((b) => b.addEventListener("click", () => {
          D.addCredits(u, -100, "simulazione"); UL.store.save(); UL.app.go(`#/app/test/${b.dataset.credits}/simulazione`);
        }));
        return;
      }
      const t = DATA.tests.find((x) => x.id === tid);
      if (!t || !MODE[mode]) return UL.app.go("#/app/test");
      if (mode === "materia" && !D.hasPrep(u)) { UL.ui.toast("Allenamento per materia incluso nel Pass o nel self-study", "err"); return UL.app.go("#/app/test"); }
      run(root.querySelector("[data-run]"), u, t, mode, subj ? decodeURIComponent(subj) : null);
    },
  };

  function run(box, u, t, mode, subj) {
    const sh = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
    const qs = mode === "diagnostico" ? DATA.subjects.flatMap((s) => sh(DATA.apt.filter((q) => q.s === s)).slice(0, s === "Comprensione verbale" ? 2 : 3)).slice(0, 10)
      : mode === "materia" ? sh(DATA.apt.filter((q) => q.s === subj))
      : sh(DATA.apt).slice(0, t.sim.n);
    const exam = mode === "simulazione";
    const ans = [];
    let i = 0, left = t.sim.min * 60;
    const t0 = Date.now();
    function draw() {
      const q = qs[i];
      box.innerHTML = `<div class="quiz">
        <div class="quiz-top"><span class="sq-label">${esc(t.t)} · ${MODE[mode]}${subj ? " · " + esc(subj) : ""} · ${i + 1}/${qs.length}</span>${exam ? `<span class="timer">${icon("clock")} <span data-t>${mmss(left)}</span></span>` : `<span class="badge badge-soft">${esc(q.s)}</span>`}</div>
        <div class="qprog"><i style="width:${(i / qs.length) * 100}%"></i></div>
        <p class="quiz-q">${esc(q.q)}</p>
        <div class="opts">${q.opts.map((o, j) => `<button class="opt" data-o="${j}"><span class="k">${"ABCD"[j]}</span><span>${esc(o)}</span></button>`).join("")}</div>
        <div class="explain" hidden><b>Spiegazione</b><br>${esc(q.x)}</div>
        <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-primary" data-next hidden>${i < qs.length - 1 ? "Avanti" : "Risultato"}</button></div></div>`;
      box.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => {
        const p = Number(b.dataset.o); ans[i] = p;
        box.querySelectorAll(".opt").forEach((x) => (x.disabled = true));
        if (exam) b.classList.add("picked");
        else { box.querySelectorAll(".opt").forEach((x) => Number(x.dataset.o) === q.a && x.classList.add("ok")); if (p !== q.a) b.classList.add("ko"); box.querySelector(".explain").hidden = false; }
        box.querySelector("[data-next]").hidden = false;
      }));
      box.querySelector("[data-next]").addEventListener("click", () => (i < qs.length - 1 ? (i++, draw()) : finish()));
    }
    function finish() {
      stop();
      let ok = 0; const by = {};
      qs.forEach((q, k) => { const right = ans[k] === q.a; if (right) ok++; if (ans[k] !== undefined) D.answer(u, q.id, right); by[q.s] = by[q.s] || { n: 0, c: 0 }; by[q.s].n++; if (right) by[q.s].c++; });
      const dur = Math.round((Date.now() - t0) / 1000);
      u.activity.tests.sessions.unshift({ test: t.id, mode, n: qs.length, correct: ok, dur, at: new Date().toISOString() });
      UL.store.addLog(u, "test", `${MODE[mode]} ${t.t}: ${ok}/${qs.length}`);
      UL.store.save();
      const pct = Math.round((ok / qs.length) * 100);
      box.innerHTML = `<div class="quiz"><span class="sq-label">${MODE[mode]} completato</span>
        <div class="row" style="gap:24px;margin:14px 0;align-items:flex-end"><div class="result-big">${ok}<small>/${qs.length}</small></div><div><span class="small muted">Punteggio</span><div class="result-big" style="font-size:44px">${pct}<small>%</small></div></div><div><span class="small muted">Tempo</span><div class="display" style="font-size:26px">${mmss(dur)}</div></div></div>
        <div class="bars-mini">${Object.entries(by).map(([s, v]) => `<div class="r"><span>${esc(s)}</span><span class="t"><i style="width:${(v.c / v.n) * 100}%"></i></span><b>${v.c}/${v.n}</b></div>`).join("")}</div>
        ${exam ? qs.map((q, k) => (ans[k] === q.a ? "" : `<div class="explain" style="margin-top:10px"><b>${esc(q.q)}</b><br><span class="small">Corretta: <b>${esc(q.opts[q.a])}</b></span><br>${esc(q.x)}</div>`)).join("") : ""}
        <div class="row" style="margin-top:18px"><a class="btn btn-primary" href="#/app/test">Torna ai test</a>${mode === "diagnostico" && !D.hasPrep(u) ? `<a class="btn btn-orange" href="#/app/pass">Sblocca le simulazioni con il Pass</a>` : ""}</div></div>`;
    }
    draw();
    if (exam) timer = setInterval(() => { left--; const el = box.querySelector("[data-t]"); if (el) el.textContent = mmss(Math.max(0, left)); if (left <= 0) { UL.ui.toast("Tempo scaduto"); finish(); } if (!document.body.contains(box)) stop(); }, 1000);
  }

  /* ---------------- ACADEMY ---------------- */
  UL.views.academyD = {
    title: "Academy",
    render(u) {
      const mine = u.activity.courses;
      return `
      ${head("Academy", "layers", 'Competenze per il <span class="accent">lavoro</span>', "Corsi on-demand tenuti da studenti e professionisti: Excel, investimenti, modelli finanziari, colloqui. I corsi base sono inclusi nel Pass.")}
      ${mine.length ? `<section class="card" style="margin-bottom:20px"><div class="card-head"><h3>${icon("check")} I tuoi corsi</h3></div>
        ${mine.map((m) => { const c = DATA.academy.find((x) => x.id === m.id); const pct = Math.round((m.done / c.mods) * 100); return `<div class="row between" style="padding:10px 0;border-bottom:1px solid var(--beige)"><div style="flex:1;min-width:200px"><b class="display" style="font-weight:400;color:var(--navy)">${esc(c.t)}</b><div class="progress" style="margin-top:6px"><i style="width:${pct}%"></i></div><span class="tiny muted">${m.done}/${c.mods} moduli</span></div>
          ${m.done < c.mods ? `<button class="btn btn-sm btn-primary" data-next="${c.id}">Prossimo modulo</button>` : '<span class="badge badge-green">Completato · attestato</span>'}</div>`; }).join("")}</section>` : ""}
      <div class="mentor-grid">${DATA.academy.map((c) => {
        const own = mine.some((m) => m.id === c.id);
        const incl = D.isPass(u) && c.lvl === "Base";
        return `<div class="mentor"><div class="row between"><span class="badge badge-soft">${c.lvl}</span><span class="small muted">${c.h} ore · ${c.mods} moduli</span></div>
          <h3>${esc(c.t)}</h3>
          <div class="row between"><b class="display" style="font-weight:400;font-size:22px">${incl ? "Incluso nel Pass" : D.eur(D.isPass(u) ? Math.round(c.price * 0.85) : c.price)}</b>
          ${own ? '<span class="badge badge-green">Iscritto</span>' : `<button class="btn btn-primary btn-sm" data-enroll="${c.id}">Iscriviti</button>`}</div></div>`;
      }).join("")}</div>`;
    },
    mount(root, u) {
      root.querySelectorAll("[data-enroll]").forEach((b) => b.addEventListener("click", () => {
        const c = DATA.academy.find((x) => x.id === b.dataset.enroll);
        const go = (price) => { u.activity.courses.push({ id: c.id, done: 0 }); if (price) D.buy(u, { type: "academy", ref: c.id, label: "Academy: " + c.t, price }); else UL.store.save(); UL.ui.toast("Iscrizione confermata"); UL.app.refresh(); };
        if (D.isPass(u) && c.lvl === "Base") return go(0);
        const price = D.isPass(u) ? Math.round(c.price * 0.85) : c.price;
        pay("Academy: " + c.t, price, `${c.h} ore, ${c.mods} moduli, accesso illimitato.`, () => go(price));
      }));
      root.querySelectorAll("[data-next]").forEach((b) => b.addEventListener("click", () => {
        const m = u.activity.courses.find((x) => x.id === b.dataset.next); m.done++;
        UL.store.save(); UL.app.refresh();
      }));
    },
  };

  /* ---------------- AMMISSIONI MSc (risultati della community) ---------------- */
  const AF = { prog: "", from: "", esito: "" };
  UL.views.ammissioniD = {
    title: "Ammissioni",
    render(u) {
      const all = DATA.admissions.concat(UL.store.allUsers().flatMap((x) => x.activity.admissions));
      const P = (id) => window.UL_PROGRAMMI.find((p) => p.id === id) || { school: "?", program: "?" };
      const rows = all.filter((r) => (!AF.prog || r.pid === AF.prog) && (!AF.from || r.from === AF.from) && (!AF.esito || r.esito === AF.esito));
      const adm = rows.filter((r) => r.esito === "ammesso");
      const avg = adm.length ? adm.reduce((s, r) => s + r.media, 0) / adm.length : null;
      const progs = [...new Set(all.map((r) => r.pid))];
      const E = { ammesso: "fit-safe", rifiutato: "fit-reach", waitlist: "fit-match" };
      return `
      ${head("Ammissioni", "cap", 'Chi è entrato <span class="accent">dove</span>', "Risultati di ammissione ai master condivisi in forma anonima dagli studenti di tutti gli atenei.")}
      <div class="stats" style="margin-bottom:18px">
        <div class="stat"><span class="k">Risultati condivisi</span><span class="v">${rows.length}</span></div>
        <div class="stat"><span class="k">Ammessi</span><span class="v">${adm.length}</span></div>
        <div class="stat"><span class="k">Media degli ammessi</span><span class="v">${num(avg, 1)}</span></div>
        <div class="stat"><span class="k">Atenei di provenienza</span><span class="v">${new Set(rows.map((r) => r.from)).size}</span></div>
      </div>
      <div class="filters"><div class="frow">
        <select class="select" data-af="prog" style="width:auto"><option value="">Tutti i programmi</option>${progs.map((id) => `<option value="${id}" ${AF.prog === id ? "selected" : ""}>${esc(P(id).school)} — ${esc(P(id).program)}</option>`).join("")}</select>
        <select class="select" data-af="from" style="width:auto"><option value="">Tutti gli atenei</option>${DATA.unis.map((x) => `<option value="${x.id}" ${AF.from === x.id ? "selected" : ""}>${esc(x.s)}</option>`).join("")}</select>
        <select class="select" data-af="esito" style="width:auto"><option value="">Tutti gli esiti</option>${["ammesso", "waitlist", "rifiutato"].map((e) => `<option ${AF.esito === e ? "selected" : ""}>${e}</option>`).join("")}</select></div></div>
      <div class="grid g-ov">
        <section class="card c-8"><div class="table-wrap"><table class="table"><thead><tr><th>Programma</th><th>Da</th><th class="num">Media</th><th>Test</th><th>Esito</th><th class="num">Anno</th></tr></thead>
          <tbody>${rows.map((r) => `<tr><td><b class="display" style="font-weight:400;color:var(--navy)">${esc(P(r.pid).program)}</b><div class="tiny muted">${esc(P(r.pid).school)}</div></td><td class="small">${esc(D.uni(r.from).s)}<div class="tiny muted">${esc(r.cds)}</div></td><td class="num">${num(r.media, 1)}</td><td class="small">${esc(r.test)}</td><td><span class="badge ${E[r.esito]}">${r.esito}</span></td><td class="num">${r.anno}</td></tr>`).join("") || '<tr><td colspan="6" class="muted" style="text-align:center;padding:16px">Nessun risultato.</td></tr>'}</tbody></table></div>
          <p class="tiny muted" style="margin-top:10px">Risultati di esempio nella demo.</p></section>
        <section class="card c-4"><div class="card-head"><h3>${icon("plus")} Condividi il tuo</h3><span class="badge badge-orange">+20 crediti</span></div>
          <form class="stack" style="gap:10px" data-addr>
            <div class="field"><label for="ar-p">Programma</label><select class="select" id="ar-p" name="pid">${window.UL_PROGRAMMI.slice(0, 163).map((p) => `<option value="${p.id}">${esc(p.school)} — ${esc(p.program)}</option>`).join("")}</select></div>
            <div class="grid-2"><div class="field"><label for="ar-m">Media</label><input class="input" id="ar-m" name="media" inputmode="decimal" placeholder="27,5"></div>
              <div class="field"><label for="ar-t">Test</label><input class="input" id="ar-t" name="test" placeholder="GMAT 645"></div></div>
            <div class="field"><label for="ar-e">Esito</label><select class="select" id="ar-e" name="esito"><option>ammesso</option><option>waitlist</option><option>rifiutato</option></select></div>
            <button class="btn btn-primary" type="submit">Condividi in forma anonima</button></form></section>
      </div>`;
    },
    mount(root, u) {
      root.querySelectorAll("[data-af]").forEach((s) => s.addEventListener("change", () => { AF[s.dataset.af] = s.value; UL.app.refresh(); }));
      root.querySelector("[data-addr]").addEventListener("submit", (e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.target));
        const media = parseFloat(String(f.media).replace(",", "."));
        if (!(media >= 18 && media <= 30)) return UL.ui.toast("Inserisci una media tra 18 e 30", "err");
        u.activity.admissions.push({ from: u.profile.ateneo, cds: u.profile.corso || "", media, test: f.test || "—", pid: f.pid, esito: f.esito, anno: new Date().getFullYear() });
        D.addCredits(u, 20, "risultato di ammissione condiviso");
        UL.store.save(); UL.ui.toast("Grazie! +20 crediti"); UL.app.refresh();
      });
    },
  };
})();

