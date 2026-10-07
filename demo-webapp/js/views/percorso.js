/* js/views/percorso.js */
/* Variante B — Il mio percorso (libretto e scenari di voto, Erasmus, magistrali, mentor) + pannello admin */
(function () {
  const UL = window.UL;
  const B = UL.B;
  const { icon, esc, num, fmtDate, ago } = UL.ui;

  const TABS = [["libretto", "Media e voto di laurea", "calc"], ["tesi", "Tesi", "file"], ["erasmus", "Erasmus", "plane"], ["magistrali", "Magistrali", "cap"], ["cv", "CV", "brief"]]; // Mentor spostato in Community → «Mentor e ambassador» (v4-community.js)
  const ERASMUS_CHECK = [
    { k: "bando", t: "Leggere il bando Erasmus+ della Scuola di Economia", d: "dicembre" },
    { k: "dest", t: "Scegliere 3 destinazioni compatibili con il piano di studi", d: "gennaio" },
    { k: "lingua", t: "Certificazione linguistica richiesta dalle destinazioni", d: "gennaio" },
    { k: "domanda", t: "Inviare la domanda online", d: "febbraio" },
    { k: "la", t: "Learning Agreement firmato", d: "maggio" },
  ];

  function libretto(user) {
    const done = user.activity.exams.filter((e) => e.status === "done" && Number(e.voto)).map((e) => ({ e, c: B.course(e.slug) })).filter((x) => x.c);
    const cfu = done.reduce((s, x) => s + (x.c.cfu || 9), 0);
    const media = cfu ? done.reduce((s, x) => s + Number(x.e.voto) * (x.c.cfu || 9), 0) / cfu : null;
    const sc = user.activity.scenari;
    const rest = Math.max(0, 180 - cfu - 21); // ~21 CFU tra tesi, idoneità e attività a scelta (stima)
    const scen = [["Prudente", Number(sc.media) - 1.5], ["Realistico", Number(sc.media)], ["Ambizioso", Math.min(30, Number(sc.media) + 1.5)]].map(([l, m]) => {
      const fin = media ? (media * cfu + m * rest) / (cfu + rest) : m;
      return { l, m, fin, base: (fin * 110) / 30 };
    });
    return `
      <div class="grid g-ov">
        <section class="card c-5">
          <div class="card-head"><h3>${icon("layers")} Esami superati</h3></div>
          <ul class="feed">${done.map((x) => `<li><span class="ic">${icon("check")}</span><div>${esc(x.c.title)}<time>${x.c.cfu || 9} CFU · voto ${esc(x.e.voto)}</time></div></li>`).join("") || '<li class="small muted">Segna un esame come "Superato" in I miei esami per vederlo qui.</li>'}</ul>
          <hr class="divider"><div class="row between"><span class="label">Media ponderata</span><b class="display" style="font-size:26px;color:var(--navy);font-weight:400">${num(media, 2)}</b></div>
          <div class="row between"><span class="label">CFU registrati</span><b class="display" style="font-weight:400">${cfu}</b></div>
        </section>
        <section class="card c-7">
          <div class="card-head"><h3>${icon("calc")} Scenari di voto di laurea</h3></div>
          <div class="slider-row"><span>Media prevista negli esami che mancano</span><input type="range" min="18" max="30" step="0.5" value="${esc(sc.media)}" data-sc="media"><b>${num(Number(sc.media), 1)}</b></div>
          <p class="small muted" style="margin:6px 0 16px">CFU da sostenere stimati: ${rest} (180 meno CFU registrati e ~21 tra tesi, idoneità e attività a scelta).</p>
          <div class="stats three">${scen.map((s) => `<div class="stat" style="box-shadow:none;background:var(--cream)"><span class="k">${s.l} · ${num(s.m, 1)}</span><span class="v">${num(s.base, 1)}<small>/110</small></span><span class="s">media finale ${num(s.fin, 2)}</span></div>`).join("")}</div>
          <p class="tiny muted" style="margin-top:12px">Base di partenza prima dei punti tesi e degli eventuali bonus previsti dal regolamento.</p>
        </section>
      </div>`;
  }

  function erasmus(user) {
    const E = user.activity.erasmus;
    return `
      <div class="grid g-ov">
        <section class="card c-6"><div class="card-head"><h3>${icon("check")} Checklist e scadenze</h3><span class="small muted">${E.check.length}/${ERASMUS_CHECK.length}</span></div>
          <div class="stack" style="gap:4px">${ERASMUS_CHECK.map((c) => `<label class="check" style="padding:10px 0;border-bottom:1px solid var(--beige)"><input type="checkbox" data-chk="${c.k}" ${E.check.includes(c.k) ? "checked" : ""}><span>${esc(c.t)}<br><span class="tiny muted">Indicativamente: ${c.d}</span></span></label>`).join("")}</div>
          <p class="tiny muted" style="margin-top:10px">Le date esatte sono nel bando dell'anno: verificale sempre sul sito UniFi.</p></section>
        <section class="card c-6"><div class="card-head"><h3>${icon("pin")} Destinazioni salvate</h3></div>
          <ul class="feed" data-dest>${E.lista.map((d, i) => `<li><span class="ic">${icon("plane")}</span><div style="flex:1">${esc(d.u)}<time>${esc(d.p)}${d.note ? " · " + esc(d.note) : ""}</time></div><button class="icon-btn" data-deld="${i}">${icon("trash")}</button></li>`).join("") || '<li class="small muted">Nessuna destinazione salvata.</li>'}</ul>
          <form class="grid-2" data-addd style="margin-top:14px;align-items:end"><div class="field"><label for="du">Università</label><input class="input" id="du" required></div><div class="field"><label for="dp">Paese</label><input class="input" id="dp"></div>
            <div class="field span-2"><label for="dn">Nota</label><input class="input" id="dn" placeholder="es. corsi in inglese, esami convalidabili"></div><button class="btn btn-primary" type="submit">Salva destinazione</button></form>
          <a class="btn btn-sm btn-ghost" style="margin-top:12px" href="https://www.unilinkfirenze.it/tools/calcolatore-erasmus" target="_blank" rel="noopener">${icon("ext")} Calcolatore Erasmus UniLink</a></section>
      </div>`;
  }

  function mentor(user) {
    const bk = user.activity.bookings;
    const M = (id) => B.MENTORS.find((m) => m.id === id) || {};
    return `
      <div class="mentor-grid">${B.MENTORS.map((m) => `<div class="mentor">
        <div class="top"><span class="avatar">${esc(m.n.split(" ").map((x) => x[0]).join(""))}</span><div><b class="display" style="font-weight:400;color:var(--navy)">${esc(m.n)}</b><div class="small muted">${esc(m.r)}</div></div></div>
        <div class="chips">${m.tags.map((t) => `<span class="chip chip-static">${esc(t)}</span>`).join("")}</div>
        <div class="row between"><span class="rate">★ ${m.rating.toFixed(1)} · ${m.rev} recensioni</span><b class="display" style="font-weight:400">${B.eur(B.PRICES.mentor)}</b></div>
        <button class="btn btn-primary btn-sm" data-book="${m.id}">Prenota 45 min</button></div>`).join("")}</div>
      <section class="card" style="margin-top:20px"><div class="card-head"><h3>${icon("calendar")} Le mie sessioni</h3></div>
        <ul class="feed">${bk.map((b) => `<li><span class="ic">${icon("users")}</span><div>${esc(M(b.mentor).n)} — ${esc(b.topic)}<time>${fmtDate(b.when, true)} · ${B.eur(b.price)}</time></div></li>`).join("") || '<li class="small muted">Nessuna sessione prenotata.</li>'}</ul></section>
      <p class="tiny muted" style="margin-top:10px">Mentor di esempio. UniLink trattiene una commissione su ogni sessione; il resto va al mentor.</p>`;
  }

  UL.views.percorsoB = {
    title: "Il mio percorso",
    render(user, params) {
      const tab = TABS.some((t) => t[0] === params[0]) ? params[0] : "libretto";
      return `
      <div class="page-head"><div><div class="eyebrow">${icon("cap")} Il mio percorso</div><h1>Oltre gli <span class="accent">esami</span></h1><p class="lead">Media, voto di laurea, Erasmus e magistrali come prosecuzione del tuo percorso.</p></div></div>
      <div class="tabs">${TABS.map(([k, l, i]) => `<a href="#/app/percorso/${k}" class="${k === tab ? "on" : ""}">${icon(i)} ${l}</a>`).join("")}</div>
      ${tab === "libretto" ? libretto(user) : tab === "tesi" ? UL.U.tesiTab(user) : tab === "cv" ? UL.U.cvTab(user) : tab === "erasmus" ? erasmus(user) : tab === "mentor" ? mentor(user)
        : `<div class="card"><h3>Magistrali</h3><p class="muted" style="margin:8px 0 16px">In questa variante la parte magistrali resta leggera: si parte dagli esami e si estende la relazione dopo. Il tool completo con 163 programmi è sul sito.</p>
            <a class="btn btn-primary" href="https://www.unilinkfirenze.it/tools/master-magistrale" target="_blank" rel="noopener">${icon("ext")} Apri il tool Master / Magistrale</a></div>`}`;
    },
    mount(root, user) {
      UL.U.bindPercorsoV4 && UL.U.bindPercorsoV4(root, user);
      const sl = root.querySelector('[data-sc="media"]');
      sl && sl.addEventListener("change", () => { user.activity.scenari.media = Number(sl.value); UL.store.save(); UL.app.refresh(); });
      sl && sl.addEventListener("input", () => { sl.nextElementSibling.textContent = num(Number(sl.value), 1); });
      root.querySelectorAll("[data-chk]").forEach((c) => c.addEventListener("change", () => {
        const a = user.activity.erasmus.check;
        c.checked ? a.push(c.dataset.chk) : a.splice(a.indexOf(c.dataset.chk), 1);
        UL.store.save(); UL.app.refresh();
      }));
      const f = root.querySelector("[data-addd]");
      f && f.addEventListener("submit", (e) => {
        e.preventDefault();
        user.activity.erasmus.lista.push({ u: f.du.value.trim(), p: f.dp.value.trim(), note: f.dn.value.trim() });
        UL.store.save(); UL.app.refresh();
      });
      root.querySelectorAll("[data-deld]").forEach((b) => b.addEventListener("click", () => { user.activity.erasmus.lista.splice(Number(b.dataset.deld), 1); UL.store.save(); UL.app.refresh(); }));
      root.querySelectorAll("[data-book]").forEach((b) => b.addEventListener("click", () => {
        const m = B.MENTORS.find((x) => x.id === b.dataset.book);
        const days = [2, 3, 5, 7].map((d) => new Date(Date.now() + d * 864e5));
        const md = UL.ui.modal(`<div class="modal-head"><div><span class="sq-label">Prenota</span><h2 style="margin-top:8px">${esc(m.n)}</h2></div><button class="icon-btn" data-close>${icon("x")}</button></div>
          <div class="field"><label for="tp">Di cosa vuoi parlare?</label><input class="input" id="tp" placeholder="es. esercizi sul monopolio"></div>
          <p class="label" style="margin:16px 0 8px">Scegli uno slot</p>
          <div class="slots">${days.flatMap((d) => ["17:00", "18:00"].map((h) => `<span class="chip" data-slot="${d.toISOString().slice(0, 10)}T${h}">${d.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" })} · ${h}</span>`)).join("")}</div>
          <div class="banner" style="margin:16px 0 0">${icon("lock")}<span>Pagamento simulato di ${B.eur(B.PRICES.mentor)}: nessun addebito reale.</span></div>
          <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-primary" data-ok disabled>Conferma prenotazione</button></div>`, { width: 560 });
        let slot = null;
        md.el.querySelectorAll("[data-slot]").forEach((s) => s.addEventListener("click", () => {
          md.el.querySelectorAll("[data-slot]").forEach((x) => x.classList.toggle("on", x === s));
          slot = s.dataset.slot; md.el.querySelector("[data-ok]").disabled = false;
        }));
        md.el.querySelector("[data-ok]").addEventListener("click", () => {
          const topic = md.el.querySelector("#tp").value.trim() || "Sessione generale";
          user.activity.bookings.push({ id: "b" + Date.now().toString(36), mentor: m.id, topic, when: slot, price: B.PRICES.mentor, at: new Date().toISOString() });
          user.activity.purchases.push({ id: "o" + Date.now().toString(36), type: "mentor", label: `Mentoring con ${m.n}`, price: B.PRICES.mentor, listPrice: B.PRICES.mentor, coupon: "", at: new Date().toISOString() });
          UL.store.addLog(user, "mentor", `Prenotata sessione con ${m.n}`);
          UL.store.save(); md.close(); UL.ui.toast("Sessione prenotata"); UL.app.refresh();
        });
      }));
    },
  };

  /* ---------------- ADMIN: metriche di prodotto ---------------- */
  const SIM = { buyers: 150, avg: 35, author: 30, review: 150, exams: 3, platform: 40, marketing: 400 };

  function simControls() {
    const R = (k, l, min, max, step) => `<div class="slider-row"><span>${l}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${SIM[k]}" data-sim="${k}" aria-label="${l}"><b data-out="${k}"></b></div>`;
    return `
      ${R("buyers", "Acquirenti nel semestre", 20, 600, 10)}
      ${R("avg", "Spesa media per acquirente", 15, 80, 1)}
      ${R("author", "Compenso autori (% incassi)", 0, 60, 5)}
      ${R("review", "Revisione per esame / semestre", 0, 500, 25)}
      ${R("exams", "Esami attivi", 1, 33, 1)}
      ${R("platform", "Piattaforma al mese", 0, 200, 5)}
      ${R("marketing", "Promozione nel semestre", 0, 3000, 50)}`;
  }
  const FMT = { buyers: (v) => v, avg: (v) => B.eur(v), author: (v) => v + "%", review: (v) => B.eur(v), exams: (v) => v, platform: (v) => B.eur(v), marketing: (v) => B.eur(v) };

  function simResults() {
    const s = SIM;
    const rev = s.buyers * s.avg;
    const tx = Math.round(s.buyers * 1.3);
    const costs = [
      { l: "Compensi autori", v: rev * (s.author / 100) },
      { l: "Revisione dei pacchetti", v: s.review * s.exams },
      { l: "Commissioni di pagamento", v: rev * B.FEE.pct + tx * B.FEE.fixed },
      { l: "Piattaforma (6 mesi)", v: s.platform * 6 },
      { l: "Promozione", v: s.marketing },
    ];
    const tot = costs.reduce((a, c) => a + c.v, 0);
    const margin = rev - tot;
    const fixed = s.review * s.exams + s.platform * 6 + s.marketing;
    const unit = s.avg * (1 - s.author / 100 - B.FEE.pct) - 1.3 * B.FEE.fixed;
    const be = unit > 0 ? Math.ceil(fixed / unit) : "—";
    const max = Math.max(...costs.map((c) => c.v), 1);
    return `
      <div class="stats" style="grid-template-columns:repeat(2,1fr)">
        <div class="stat" style="box-shadow:none;background:var(--cream)"><span class="k">Incassi lordi</span><span class="v">${B.eur(Math.round(rev))}</span></div>
        <div class="stat" style="box-shadow:none;background:var(--cream)"><span class="k">Margine</span><span class="v" style="color:${margin >= 0 ? "var(--green)" : "var(--red)"}">${B.eur(Math.round(margin))}</span><span class="s">${rev ? Math.round((margin / rev) * 100) : 0}% degli incassi</span></div>
        <div class="stat" style="box-shadow:none;background:var(--cream)"><span class="k">Costi totali</span><span class="v">${B.eur(Math.round(tot))}</span></div>
        <div class="stat" style="box-shadow:none;background:var(--cream)"><span class="k">Acquirenti di pareggio</span><span class="v">${be}</span></div>
      </div>
      <div class="hbars" style="margin-top:16px">${costs.map((c) => `<div class="hbar"><span class="lab">${c.l}</span><span class="trk"><i style="width:${(c.v / max) * 100}%"></i></span><span class="val">${Math.round(c.v)}</span><span class="tip">${c.l}: ${B.eur(Math.round(c.v))}</span></div>`).join("")}</div>`;
  }

  UL.views.adminB = {
    title: "Metriche",
    render() {
      const users = UL.store.allUsers().filter((u) => u.role !== "admin");
      const m = B.metrics();
      const buyers = users.filter((u) => u.activity.purchases.some((p) => p.type !== "mentor"));
      const all = users.flatMap((u) => u.activity.purchases.map((p) => ({ u, p })));
      const revenue = all.reduce((s, x) => s + x.p.price, 0);
      const second = buyers.filter((u) => u.activity.purchases.length >= 2).length;
      const using = buyers.filter((u) => u.activity.quiz.sessions.length > 0).length;
      const practicers = users.filter((u) => u.activity.quiz.sessions.length);
      const returning = practicers.filter((u) => new Set(u.activity.quiz.sessions.map((s) => s.at.slice(0, 10))).size >= 2).length;
      const tried = users.filter((u) => u.activity.quiz.sessions.length || Object.keys(u.activity.quiz.stats).length).length;
      const steps = [
        ["Account attivi", users.length], ["Hanno provato un quiz", tried],
        ["Acquirenti", buyers.length], ["Usano le esercitazioni", using], ["Secondo acquisto", second],
      ];
      const max = steps[0][1] || 1;
      const examRows = B.courses().filter((c) => B.hasQuiz(c.slug) || all.some((x) => x.p.slug === c.slug)).map((c) => {
        const bs = (m.bySlug || {})[c.slug] || {};
        const packs = all.filter((x) => ["exam", "completa", "appunti", "gratis"].includes(x.p.type) && x.p.slug === c.slug);
        const sems = all.filter((x) => x.p.type === "semester" && x.p.anno === c.anno && x.p.sem === c.sem).length;
        return { c, v: bs.visita || 0, t: bs.prova || 0, n: packs.length, sems, rev: packs.reduce((s, x) => s + x.p.price, 0) };
      });
      return `
      <div class="page-head"><div><div class="eyebrow">${icon("shield")} Team UniLink</div><h1>Metriche di <span class="accent">prodotto</span></h1>
        <p class="lead">Le registrazioni da sole non dimostrano che il modello funzioni: contano acquisti per esame, ritorno alle esercitazioni, secondo acquisto e margine.</p></div></div>
      <div class="stats" style="margin-bottom:20px">
        <div class="stat"><span class="k">${icon("euro")} Incassi</span><span class="v">${B.eur(Math.round(revenue))}</span><span class="s">${all.length} ordini · ${buyers.length} acquirenti</span></div>
        <div class="stat"><span class="k">${icon("user")} Spesa media per acquirente</span><span class="v">${buyers.length ? B.eur(Math.round(revenue / buyers.length)) : "—"}</span></div>
        <div class="stat"><span class="k">${icon("spark")} Secondo acquisto</span><span class="v">${buyers.length ? Math.round((second / buyers.length) * 100) : 0}<small>%</small></span><span class="s">${second} su ${buyers.length} acquirenti</span></div>
        <div class="stat"><span class="k">${icon("clock")} Ritorno alle esercitazioni</span><span class="v">${practicers.length ? Math.round((returning / practicers.length) * 100) : 0}<small>%</small></span><span class="s">si esercitano in ≥2 giorni diversi</span></div>
      </div>
      <section class="card" style="margin-bottom:20px"><div class="card-head"><h3>${icon("chart")} Percorso di conversione</h3><span class="small muted">account → prova → acquisto → utilizzo → secondo acquisto</span></div>
        <div class="funnel">${steps.map(([l, v], i) => `<div class="f"><span class="lab">${l}</span><span><span class="bar" style="width:${Math.max(4, (v / max) * 100)}%">${v}</span></span><span class="cv">${i ? (steps[i - 1][1] ? Math.round((v / steps[i - 1][1]) * 100) + "%" : "—") : ""}</span></div>`).join("")}</div>
        <p class="tiny muted" style="margin-top:10px">Dagli account demo. Nella tabella sotto: schede esame aperte e prove gratuite iniziate nell'area personale.</p></section>
      <section class="card" style="margin-bottom:20px"><div class="card-head"><h3>${icon("book")} Esami: dalla prova all'acquisto</h3></div>
        <div class="table-wrap"><table class="table"><thead><tr><th>Esame</th><th class="num">Schede aperte</th><th class="num">Prove</th><th class="num">Pacchetti</th><th class="num">In pacchetti semestre</th><th class="num">Incassi pacchetti</th><th class="num">Prova → acquisto</th></tr></thead>
        <tbody>${examRows.map((r) => `<tr><td><b class="display" style="font-weight:400;color:var(--navy)">${esc(r.c.title)}</b></td><td class="num">${r.v}</td><td class="num">${r.t}</td><td class="num">${r.n}</td><td class="num">${r.sems}</td><td class="num">${B.eur(Math.round(r.rev))}</td><td class="num">${r.t ? ((r.n / r.t) * 100).toFixed(1) + "%" : "—"}</td></tr>`).join("")}</tbody></table></div></section>
      <section class="card"><div class="card-head"><h3>${icon("calc")} Margine di un semestre</h3></div>
        <div class="grid g-ov"><div class="c-6 stack" style="gap:12px">${simControls()}</div><div class="c-6" data-simres>${simResults()}</div></div>
        <p class="tiny muted" style="margin-top:12px">Scenario illustrativo (base: 150 acquirenti × €35 = €5.250 lordi). Commissione di pagamento ipotetica 1,5% + €0,25 a transazione. Il margine non include il tempo del team né la fiscalità.</p></section>`;
    },
    mount(root) {
      const res = root.querySelector("[data-simres]");
      const out = () => root.querySelectorAll("[data-out]").forEach((o) => (o.textContent = FMT[o.dataset.out](SIM[o.dataset.out])));
      root.querySelectorAll("input[data-sim]").forEach((r) => r.addEventListener("input", () => {
        SIM[r.dataset.sim] = Number(r.value);
        out();
        res.innerHTML = simResults();
      }));
      out();
    },
  };
})();

