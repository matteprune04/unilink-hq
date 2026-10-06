/* js/views/area.js */
/* Variante B — area personale: onboarding, dashboard, i miei esami, materiali, acquisti */
(function () {
  const UL = window.UL;
  const B = UL.B;
  const { icon, esc, ROMAN, ago, fmtDate } = UL.ui;

  const head = (eyebrow, ic, title, lead) => `
    <div class="page-head"><div><div class="eyebrow">${icon(ic)} ${esc(eyebrow)}</div><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}</div></div>`;

  const examCourses = (user) => user.activity.exams.map((e) => ({ e, c: B.course(e.slug) })).filter((x) => x.c);

  function examRow(user, e, c) {
    const pr = B.progress(user, c.slug);
    const d = B.daysTo(e.appello);
    const st = B.STATUS[e.status || "todo"];
    return `
    <div class="exam-row">
      <div class="ring">${UL.ui.ring(pr, 64, 7, e.status === "done" ? "var(--green)" : "var(--orange)")}<div class="lbl"><b>${pr}%</b></div></div>
      <div>
        <div class="row" style="gap:8px"><span class="pill-status ${st.c}">${st.l}</span>${B.owns(user, c.slug) ? '<span class="badge badge-navy">Pacchetto attivo</span>' : '<span class="badge badge-soft">Gratis</span>'}
          ${d !== null && d >= 0 && e.status !== "done" ? `<span class="badge ${d <= 14 ? "badge-red" : "badge-soft"}">${icon("calendar")} Appello tra ${d} giorni</span>` : ""}</div>
        <h3 style="margin-top:8px">${esc(c.title)}</h3>
        <p class="small muted">${e.partizione ? esc(e.partizione) : "Partizione non indicata"}${e.obiettivo ? " · obiettivo " + esc(e.obiettivo) : ""}${e.status === "done" && e.voto ? " · voto " + esc(e.voto) : ""}</p>
      </div>
      <div class="row">
        ${B.hasQuiz(c.slug) && e.status !== "done" ? `<a class="btn btn-sm btn-primary" href="#/app/esercitazioni/${c.slug}">${icon("quiz")} Esercitati</a>` : ""}
        <a class="btn btn-sm btn-ghost" href="#/app/esami/${c.slug}">Gestisci</a>
      </div>
    </div>`;
  }

  /* ---------------- ONBOARDING ---------------- */
  UL.views.onboardingB = {
    title: "Benvenuto",
    render: (user) => `
    <div class="auth" style="grid-template-columns:1fr"><section class="auth-form-wrap" style="min-height:100vh"><div style="width:100%;max-width:720px">
      <a class="brand" href="#/app/dashboard" style="margin-bottom:20px"><img src="img/logo-blu.png" alt=""><span>unilink</span></a>
      <div class="card" style="padding:30px">
        <span class="sq-label">Primo accesso</span>
        <h2 style="margin:10px 0 6px">Ciao ${esc(user.profile.nome)}, quali esami stai preparando?</h2>
        <p class="muted" style="margin-bottom:18px">Scegli gli esami del tuo anno: la dashboard partirà da questi.</p>
        <div class="seg" data-y style="margin-bottom:14px">${[1, 2, 3].map((y) => `<button class="${String(y) === String(user.profile.anno || 1) ? "on" : ""}" data-v="${y}">${ROMAN[y]} anno</button>`).join("")}</div>
        <div class="chips" data-pick></div>
        <div class="row between" style="margin-top:24px"><a href="#" data-skip class="small display">Salta</a><button class="btn btn-primary btn-arrow" data-go>Vai alla dashboard <span class="arr">${icon("arrow")}</span></button></div>
      </div></div></section></div>`,
    mount(root, user) {
      const sel = new Set(user.activity.exams.map((e) => e.slug));
      let y = Number(user.profile.anno || 1);
      const draw = () => {
        const list = B.courses().filter((c) => c.anno === y && (!user.profile.cds || c.cds.includes(user.profile.cds)));
        root.querySelector("[data-pick]").innerHTML = list.map((c) => `<span class="chip ${sel.has(c.slug) ? "on" : ""}" data-v="${c.slug}">${esc(c.title)}${B.hasQuiz(c.slug) ? ` ${icon("quiz")}` : ""}</span>`).join("");
        root.querySelectorAll("[data-pick] .chip").forEach((ch) => ch.addEventListener("click", () => { sel.has(ch.dataset.v) ? sel.delete(ch.dataset.v) : sel.add(ch.dataset.v); draw(); }));
      };
      root.querySelectorAll("[data-y] button").forEach((b) => b.addEventListener("click", () => { y = Number(b.dataset.v); root.querySelectorAll("[data-y] button").forEach((x) => x.classList.toggle("on", x === b)); draw(); }));
      const finish = () => {
        sel.forEach((s) => user.activity.exams.some((e) => e.slug === s) || user.activity.exams.push({ slug: s, partizione: "", appello: "", obiettivo: "", status: "doing" }));
        UL.store.markOnboarded(user);
        B.track("registrazione");
        UL.app.go("#/app/dashboard");
      };
      root.querySelector("[data-go]").addEventListener("click", finish);
      root.querySelector("[data-skip]").addEventListener("click", (e) => { e.preventDefault(); finish(); });
      draw();
    },
  };

  /* ---------------- DASHBOARD ---------------- */
  UL.views.dashboardB = {
    title: "Dashboard",
    render(user) {
      const a = user.activity;
      const ex = examCourses(user).filter((x) => x.e.status !== "done");
      const last = a.quiz.sessions[0];
      const errSlug = last && B.errors(user, last.slug).length ? last.slug : (ex.find((x) => B.errors(user, x.c.slug).length) || {}).c?.slug;
      const next = ex.filter((x) => x.e.appello && B.daysTo(x.e.appello) >= 0).sort((p, q) => new Date(p.e.appello) - new Date(q.e.appello))[0];
      const owned = B.courses().filter((c) => B.owns(user, c.slug));
      const ups = B.UPDATES.filter((u) => owned.some((c) => c.slug === u.slug));
      const sem = new Date().getMonth() + 1 >= 9 || new Date().getMonth() + 1 <= 1 ? 1 : 2;
      const hasSem = a.purchases.some((p) => p.type === "semester");
      const totalDone = a.quiz.sessions.reduce((s, x) => s + x.n, 0);
      return `
      ${head("Dashboard", "home", `Cosa ti serve <span class="accent">adesso</span>, ${esc(user.profile.nome)}?`)}
      <div class="grid g-ov">
        <section class="card navy c-7">
          ${errSlug ? `
            <span class="badge badge-orange">Riprendi da dove eri</span>
            <h2 style="margin:12px 0 8px">${esc(B.course(errSlug).title)}: ${B.errors(user, errSlug).length} domande da ripassare</h2>
            <p style="color:rgba(255,255,255,.78)">Le domande che hai sbagliato tornano finché non le azzecchi due volte di fila.</p>
            <div class="row" style="margin-top:18px"><a class="btn btn-white btn-arrow" href="#/app/esercitazioni/${errSlug}/errori">Ripassa gli errori <span class="arr">${icon("arrow")}</span></a>
              <a class="btn btn-ghost" style="color:#fff;border-color:rgba(255,255,255,.3)" href="#/app/esercitazioni/${errSlug}">Altre modalità</a></div>`
          : ex.length ? `
            <span class="badge badge-orange">Prossimo passo</span>
            <h2 style="margin:12px 0 8px">Inizia a esercitarti su ${esc(ex[0].c.title)}</h2>
            <p style="color:rgba(255,255,255,.78)">Un quiz rapido da 10 domande ti dice subito su quali argomenti concentrarti.</p>
            <div class="row" style="margin-top:18px"><a class="btn btn-white btn-arrow" href="#/app/esercitazioni/${ex[0].c.slug}">Inizia <span class="arr">${icon("arrow")}</span></a></div>`
          : `<h2>Aggiungi i tuoi esami</h2><p style="color:rgba(255,255,255,.78);margin-top:8px">Scegli cosa stai preparando per vedere materiali ed esercitazioni giuste.</p><div class="row" style="margin-top:18px"><a class="btn btn-white" href="#/app/esami">Aggiungi esami</a></div>`}
        </section>
        <section class="c-5 stack">
          <div class="stat"><span class="k">${icon("calendar")} Prossimo appello</span>${next ? `<span class="v">${B.daysTo(next.e.appello)}<small> giorni</small></span><span class="s">${esc(next.c.title)} · ${fmtDate(next.e.appello)}</span>` : `<span class="v">—</span><span class="s"><a href="#/app/esami">Imposta le date d'appello</a></span>`}</div>
          <div class="stat"><span class="k">${icon("quiz")} Domande svolte</span><span class="v">${totalDone}</span><span class="s">${a.quiz.sessions.length} sessioni · ultima ${last ? ago(last.at) : "mai"}</span></div>
        </section>
        <section class="card c-8">
          <div class="card-head"><h3>${icon("layers")} Gli esami che stai preparando</h3><a class="more" href="#/app/esami">Gestisci ${icon("arrow")}</a></div>
          <div class="exam-list">${ex.map((x) => examRow(user, x.e, x.c)).join("") || '<div class="empty">Nessun esame in preparazione.</div>'}</div>
        </section>
        <section class="card c-4">
          <div class="card-head"><h3>${icon("bell")} Aggiornamenti ai tuoi materiali</h3></div>
          <ul class="feed">${ups.map((u) => `<li><span class="ic">${icon("file")}</span><div><b class="display" style="font-weight:400">${esc(B.course(u.slug).title)} ${u.v}</b><br><span class="small">${esc(u.d)}</span></div></li>`).join("") || '<li class="small muted">Nessun aggiornamento: qui compaiono le nuove versioni dei pacchetti che possiedi.</li>'}</ul>
          ${!hasSem && user.profile.cds ? `<hr class="divider"><p class="small">Ti mancano altri esami del ${ROMAN[sem]} semestre? Con il <b>pacchetto semestre</b> (${B.eur(B.PRICES.semester)}) li sblocchi tutti.</p><a class="btn btn-sm btn-orange" style="margin-top:10px" href="#/app/materiali">Vedi il pacchetto</a>` : ""}
        </section>
      </div>`;
    },
  };

  /* ---------------- I MIEI ESAMI ---------------- */
  UL.views.esamiB = {
    title: "I miei esami",
    render(user, params) {
      if (params[0]) return detail(user, params[0]);
      const list = examCourses(user);
      return `
      ${head("I miei esami", "layers", 'I miei <span class="accent">esami</span>', "Partizione, data d'appello, obiettivo e avanzamento di ogni esame.")}
      <div class="row between" style="margin-bottom:16px"><div class="seg" data-f>${[["doing", "In preparazione"], ["todo", "Da iniziare"], ["done", "Superati"], ["all", "Tutti"]].map(([v, l], i) => `<button class="${i === 3 ? "on" : ""}" data-v="${v}">${l}</button>`).join("")}</div>
        <button class="btn btn-primary" data-add>${icon("plus")} Aggiungi esame</button></div>
      <div class="exam-list" data-list>${list.map((x) => examRow(user, x.e, x.c)).join("") || '<div class="card empty">Non hai ancora aggiunto esami.</div>'}</div>`;
    },
    mount(root, user, params) {
      if (params[0]) return mountDetail(root, user, params[0]);
      root.querySelectorAll("[data-f] button").forEach((b) => b.addEventListener("click", () => {
        root.querySelectorAll("[data-f] button").forEach((x) => x.classList.toggle("on", x === b));
        root.querySelector("[data-list]").innerHTML = examCourses(user).filter((x) => b.dataset.v === "all" || (x.e.status || "todo") === b.dataset.v).map((x) => examRow(user, x.e, x.c)).join("") || '<div class="card empty">Nessun esame.</div>';
      }));
      root.querySelector("[data-add]").addEventListener("click", () => {
        const have = new Set(user.activity.exams.map((e) => e.slug));
        const m = UL.ui.modal(`<div class="modal-head"><h2>Aggiungi esami</h2><button class="icon-btn" data-close>${icon("x")}</button></div>
          ${[1, 2, 3].map((y) => `<p class="label" style="margin:14px 0 8px">${ROMAN[y]} anno</p><div class="chips">${B.courses().filter((c) => c.anno === y && !have.has(c.slug)).map((c) => `<span class="chip" data-v="${c.slug}">${esc(c.title)}</span>`).join("")}</div>`).join("")}
          <div class="row" style="justify-content:flex-end;margin-top:20px"><button class="btn btn-primary" data-ok>Aggiungi</button></div>`);
        m.el.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => c.classList.toggle("on")));
        m.el.querySelector("[data-ok]").addEventListener("click", () => {
          m.el.querySelectorAll(".chip.on").forEach((c) => user.activity.exams.push({ slug: c.dataset.v, partizione: "", appello: "", obiettivo: "", status: "todo" }));
          UL.store.save(); m.close(); UL.app.refresh();
        });
      });
    },
  };

  function detail(user, slug) {
    const c = B.course(slug);
    const e = user.activity.exams.find((x) => x.slug === slug);
    if (!c || !e) return `<div class="empty">Esame non trovato. <a href="#/app/esami">Torna ai tuoi esami</a></div>`;
    const tp = B.topics(user, slug);
    return `
      <a href="#/app/esami" class="small display" style="text-decoration:none">← I miei esami</a>
      ${head(`${c.cds} · ${ROMAN[c.anno]} anno`, "layers", esc(c.title))}
      <div class="grid g-ov">
        <section class="card c-6">
          <div class="card-head"><h3>${icon("settings")} Impostazioni dell'esame</h3></div>
          <div class="grid-2">
            <div class="field"><label>Partizione / docente</label><select class="select" data-k="partizione"><option value="">Non indicata</option>${c.docenti.map((d) => `<option ${e.partizione === d ? "selected" : ""}>${esc(d)}</option>`).join("")}</select></div>
            <div class="field"><label>Stato</label><select class="select" data-k="status">${Object.entries(B.STATUS).map(([k, v]) => `<option value="${k}" ${e.status === k ? "selected" : ""}>${v.l}</option>`).join("")}</select></div>
            <div class="field"><label>Data dell'appello</label><input class="input" type="date" data-k="appello" value="${esc(e.appello || "")}"></div>
            <div class="field"><label>Voto obiettivo</label><select class="select" data-k="obiettivo"><option value="">—</option>${Array.from({ length: 13 }, (_, i) => 18 + i).concat(["30L"]).map((v) => `<option ${String(e.obiettivo) === String(v) ? "selected" : ""}>${v}</option>`).join("")}</select></div>
            ${e.status === "done" ? `<div class="field"><label>Voto ottenuto</label><input class="input" data-k="voto" value="${esc(e.voto || "")}" inputmode="numeric"></div>` : ""}
            ${!B.hasQuiz(slug) && e.status !== "done" ? `<div class="field span-2"><label>Autovalutazione della preparazione: <b data-autov>${e.auto || 0}%</b></label><input type="range" min="0" max="100" step="5" value="${e.auto || 0}" data-k="auto" style="accent-color:var(--orange)"></div>` : ""}
          </div>
          <div class="row" style="margin-top:16px"><button class="btn btn-ghost btn-sm" data-remove>${icon("trash")} Rimuovi dai miei esami</button></div>
        </section>
        <section class="card c-6">
          <div class="card-head"><h3>${icon("chart")} Avanzamento per argomento</h3><span class="display" style="color:var(--orange);font-size:22px">${B.progress(user, slug)}%</span></div>
          ${tp.length ? `<div class="bars-mini">${tp.map((t) => `<div class="r"><span>${esc(t.t)}</span><span class="t"><i style="width:${t.n ? (t.ok / t.n) * 100 : 0}%"></i></span><b>${t.ok}/${t.n}</b></div>`).join("")}</div>
            <p class="tiny muted" style="margin-top:12px">Una domanda conta come acquisita quando l'ultima risposta è corretta.</p>
            <a class="btn btn-primary btn-sm" style="margin-top:12px" href="#/app/esercitazioni/${slug}">${icon("quiz")} Vai alle esercitazioni</a>`
          : '<p class="small muted">Le esercitazioni interattive per questo esame non sono ancora disponibili: usa l\'autovalutazione.</p>'}
        </section>
        <section class="card c-12">
          <div class="card-head"><h3>${icon("book")} Materiali</h3>${B.owns(user, slug) ? '<span class="badge badge-navy">Pacchetto attivo</span>' : ""}</div>
          ${materialLinks(user, c)}
        </section>
      </div>`;
  }
  function mountDetail(root, user, slug) {
    const e = user.activity.exams.find((x) => x.slug === slug);
    if (!e) return;
    root.querySelectorAll("[data-k]").forEach((el) => el.addEventListener(el.type === "range" ? "input" : "change", () => {
      e[el.dataset.k] = el.value;
      if (el.dataset.k === "auto") { root.querySelector("[data-autov]").textContent = el.value + "%"; }
      UL.store.save();
      if (el.dataset.k === "status") { UL.store.addLog(user, "esame", `${B.course(slug).title}: ${B.STATUS[el.value].l}`); UL.app.refresh(); }
      else if (el.type !== "range") UL.ui.toast("Salvato");
    }));
    root.querySelector("[data-remove]").addEventListener("click", () => {
      user.activity.exams = user.activity.exams.filter((x) => x.slug !== slug);
      UL.store.save(); UL.app.go("#/app/esami");
    });
    bindBuy(root, user);
  }

  function materialLinks(user, c) {
    const own = B.owns(user, c.slug);
    const item = (ok, href, ic, label, sub) => ok && href
      ? `<a class="feature" href="${esc(href)}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit"><span class="ic">${icon(ic)}</span><h3>${label}</h3><p>${sub}</p></a>`
      : `<div class="feature" style="opacity:.75"><span class="ic">${icon(ok ? ic : "lock")}</span><h3>${label}</h3><p>${ok ? sub : "Incluso nel pacchetto esame"}</p></div>`;
    return `<div class="feature-grid">
      ${item(own, c.pdf, "book", "Dispensa completa", "Appunti e sbobine · a.a. 2025/26")}
      ${item(own, c.mappe || c.pdf, "map", "Mappe & schemi", c.mappe ? "Schemi riassuntivi in PDF" : "Schemi nella dispensa")}
      ${item(own, c.quiz, "quiz", "Quiz & simulazioni (PDF)", "Esercizi d'esame con soluzioni")}
    </div>
    ${own ? "" : `<div class="row" style="margin-top:16px"><button class="btn btn-orange" data-buyslug="${c.slug}">Sblocca a ${B.eur(B.PRICES.exam)}</button><a class="btn btn-ghost" href="#/app/scheda/${c.slug}">Anteprima gratuita</a></div>`}`;
  }
  function bindBuy(root, user) {
    root.querySelectorAll("[data-buyslug]").forEach((b) => b.addEventListener("click", () => B.checkout(user, B.examItem(B.course(b.dataset.buyslug)), () => UL.app.refresh())));
    root.querySelectorAll("[data-buysem]").forEach((b) => b.addEventListener("click", () => {
      const [cds, anno, sem] = b.dataset.buysem.split("|");
      B.checkout(user, B.semItem(cds, anno, sem), () => UL.app.refresh());
    }));
  }

  /* ---------------- MATERIALI ---------------- */
  UL.views.materialiB = {
    title: "Materiali",
    render(user, params) {
      const tab = params[0] || "miei";
      const p = user.profile;
      const owned = B.courses().filter((c) => B.owns(user, c.slug));
      const cds = p.cds || "EA";
      const semOpts = [[1, 1], [1, 2], [2, 1], [2, 2], [3, 1], [3, 2]];
      const card = (c) => {
        const own = B.owns(user, c.slug);
        return `<article class="course">
          <div class="thumb"><div class="ph area-${c.area}">${icon(own ? "book" : "lock")}<span>${esc(UL.ui.areaLabel(c.area))}</span></div>
            ${c.img ? `<img src="${esc(c.img)}?scale-down-to=512" alt="" loading="lazy" onerror="this.remove()">` : ""}
            <span class="badge ${own ? "badge-green" : "badge-orange"}">${own ? "Attivo" : B.eur(B.PRICES.exam)}</span></div>
          <div class="body"><span class="sq-label">${esc(c.cds)} · ${ROMAN[c.anno]} anno · ${ROMAN[c.sem]} sem.</span><h3><a href="#/app/scheda/${c.slug}" style="text-decoration:none;color:inherit">${esc(c.title)}</a></h3>
            <div class="foot">${own
              ? `<a class="btn btn-primary btn-sm btn-arrow" href="${esc(c.pdf || "#")}" target="_blank" rel="noopener">Apri dispensa <span class="arr">${icon("download")}</span></a><a class="icon-btn" href="#/app/esami/${c.slug}" title="Dettagli">${icon("info")}</a>`
              : `<button class="btn btn-orange btn-sm" data-buyslug="${c.slug}">Sblocca</button><a class="btn btn-ghost btn-sm" href="#/app/scheda/${c.slug}">Anteprima</a>`}</div></div>
        </article>`;
      };
      return `
      ${head("Materiali", "book", 'La tua <span class="accent">libreria</span>', "I pacchetti che possiedi, sempre aggiornati, e il catalogo degli altri esami.")}
      <div class="tabs"><a href="#/app/materiali" class="${tab === "miei" ? "on" : ""}">${icon("book")} I miei pacchetti <span class="cnt">${owned.length}</span></a><a href="#/app/materiali/catalogo" class="${tab === "catalogo" ? "on" : ""}">${icon("layers")} Catalogo</a><a href="#/app/materiali/semestre" class="${tab === "semestre" ? "on" : ""}">${icon("spark")} Pacchetti semestre</a></div>
      ${tab === "miei" ? (owned.length ? `<div class="course-grid">${owned.map(card).join("")}</div>` : `<div class="card empty">${icon("book")}<p>Non hai ancora pacchetti. Prova gratis un esame dal catalogo.</p><a class="btn btn-primary" style="margin-top:12px" href="#/app/materiali/catalogo">Apri il catalogo</a></div>`)
        : tab === "catalogo" ? [1, 2, 3].map((y) => `<div class="year-head"><h2>${ROMAN[y]} anno</h2><span class="line"></span></div><div class="course-grid">${B.courses().filter((c) => c.anno === y && (!p.cds || c.cds.includes(p.cds))).map(card).join("")}</div>`).join("")
        : `<p class="muted" style="margin-bottom:16px">Tutti gli esami di un semestre del corso ${esc(UL.ui.CDS[cds])} a ${B.eur(B.PRICES.semester)} invece di ${B.eur(B.PRICES.exam)} l'uno.</p>
          <div class="pricing three">${semOpts.map(([a, s]) => {
            const list = B.semesterCourses(cds, a, s);
            if (!list.length) return "";
            const have = user.activity.purchases.some((x) => x.type === "semester" && x.anno === a && x.sem === s);
            const full = list.length * B.PRICES.exam;
            return `<div class="plan ${String(a) === String(p.anno) ? "hot" : ""}" data-hot="Il tuo anno"><h3>${ROMAN[a]} anno · ${ROMAN[s]} semestre</h3><div class="price">${B.eur(B.PRICES.semester)} <small>invece di ${B.eur(full)}</small></div>
              <ul>${list.map((c) => `<li>${icon("check")}${esc(c.title)}</li>`).join("")}</ul>
              ${have ? '<span class="badge badge-green">Già attivo</span>' : `<button class="btn btn-primary" data-buysem="${cds}|${a}|${s}">Acquista</button>`}</div>`;
          }).join("")}</div>`}`;
    },
    mount(root, user) { bindBuy(root, user); },
  };

  /* ---------------- ACQUISTI ---------------- */
  UL.views.acquistiB = {
    title: "Acquisti",
    render(user) {
      const ps = user.activity.purchases.slice().reverse();
      const tot = ps.reduce((s, p) => s + p.price, 0);
      return `
      ${head("Account", "euro", 'Acquisti e <span class="accent">accessi</span>', "Pacchetti attivi, ricevute e sessioni prenotate.")}
      <div class="stats" style="margin-bottom:20px">
        <div class="stat"><span class="k">Pacchetti attivi</span><span class="v">${ps.filter((p) => p.type !== "mentor").length}</span></div>
        <div class="stat"><span class="k">Esami sbloccati</span><span class="v">${B.courses().filter((c) => B.owns(user, c.slug)).length}</span></div>
        <div class="stat"><span class="k">Sessioni mentor</span><span class="v">${user.activity.bookings.length}</span></div>
        <div class="stat"><span class="k">Totale speso</span><span class="v">${B.eur(Math.round(tot * 100) / 100)}</span></div>
      </div>
      <div class="card"><div class="table-wrap"><table class="table">
        <thead><tr><th>Data</th><th>Prodotto</th><th>Codice</th><th class="num">Importo</th><th>Accesso</th></tr></thead>
        <tbody>${ps.map((p) => `<tr><td class="small">${fmtDate(p.at)}</td><td><b class="display" style="font-weight:400;color:var(--navy)">${esc(p.label)}</b></td><td class="small">${esc(p.coupon || "—")}</td><td class="num">${B.eur(p.price)}</td><td class="small muted">${p.type === "mentor" ? "Sessione singola" : "Fino al 30/09/2027"}</td></tr>`).join("") || '<tr><td colspan="5" class="muted" style="text-align:center;padding:20px">Nessun acquisto.</td></tr>'}</tbody>
      </table></div></div>
      <p class="tiny muted" style="margin-top:12px">Demo: gli acquisti sono simulati e salvati solo in questo browser.</p>`;
    },
  };
})();

