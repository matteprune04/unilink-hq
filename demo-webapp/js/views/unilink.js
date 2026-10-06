/* js/views/unilink.js */
/* Estensioni UniLink v3, costruite SOLO con i componenti e le classi della demo A (css/style.css).
   1 regole (area di studio, ateneo)           2 sblocco: pacchetto esame o Plus (da ogni lucchetto)
   3 primo accesso in 6 passi + scelta piano   4 dashboard (parte decisa = dashboard della demo B)
   5 area in arrivo (Giurisprudenza, Medicina) 6 Abbonamento: upgrade, disdetta, ordini
   7 Visualizza come (tipologie demo)          8 cornice dei moduli DA DECIDERE (banner + rimando all'architettura)
   9 Da decidere: catalogo e scheda di architettura   10 Configurazione (tabelle che governano la app) */
(function () {
  const UL = window.UL;
  const B = UL.B;
  const { icon, esc, ROMAN, fmtDate } = UL.ui;
  const AREE = window.UL_AREE, DEC = window.UL_DA_DECIDERE;
  const head = (eyebrow, ic, title, lead, right) => `
    <div class="page-head"><div><div class="eyebrow">${icon(ic)} ${esc(eyebrow)}</div><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}</div>${right || ""}</div>`;

  /* ---------- 1 · regole ---------- */
  const U = (UL.U = {});
  U.area = (user) => AREE.find((a) => a.slug === (user.profile.area || "economia")) || AREE[0];
  U.attiva = (user) => U.area(user).stato === "attiva";
  // la parte decisa copre solo UniFi: gli altri atenei sono la proposta «Network» (D12)
  U.ateneoAttivo = (user) => !user.profile.ateneo || user.profile.ateneo === "unifi";
  U.COLORI = ["#cf7527", "#172554", "#1a453c", "#7a4fa0", "#2f4a8a", "#a95d1c", "#9d174d", "#0f5f6b"];

  /* ---------- 2 · sblocco: pacchetto esame o Plus ---------- */
  B.upsell = (user, slug) => {
    const c = B.course(slug);
    const opz = [];
    if (c) opz.push({ t: "Pacchetto " + c.title, p: B.PRICES.exam, s: "una volta · resta tuo", incl: B.examItem(c).incl, item: () => B.examItem(c) });
    if (!B.plus(user)) opz.push({ t: "UniLink Plus", p: B.PRICES.plus, s: "al mese · disdici quando vuoi", incl: UL.PIANI.lista.find((x) => x.k === "plus").incl, item: B.plusItem, hot: true });
    const m = UL.ui.modal(`
      <div class="modal-head"><div><span class="sq-label">Sblocca</span><h2 style="margin-top:8px">${esc(c ? c.title : "Esercitazioni")}</h2><p class="small muted" style="margin-top:4px">Scegli tu: il pacchetto di questo esame oppure Plus su tutto. Prezzi: ipotesi.</p></div>
        <button class="icon-btn" data-close aria-label="Chiudi">${icon("x")}</button></div>
      <div class="pricing" style="grid-template-columns:repeat(${opz.length},1fr)">${opz.map((o, i) => `<div class="plan ${o.hot ? "hot" : ""}" data-hot="Tutto incluso"><h3>${esc(o.t)}</h3><div class="price">${B.eur(o.p)} <small>${esc(o.s)}</small></div>
        <ul>${o.incl.map((x) => `<li>${icon("check")}${esc(x)}</li>`).join("")}</ul><button class="btn ${o.hot ? "btn-orange" : "btn-primary"}" data-pick="${i}">Scegli</button></div>`).join("")}</div>`, { width: 760 });
    m.el.querySelectorAll("[data-pick]").forEach((b) => b.addEventListener("click", () => { m.close(); B.checkout(user, opz[Number(b.dataset.pick)].item(), () => UL.app.refresh()); }));
  };

  /* ---------- 3 · primo accesso (dopo la registrazione): 6 passi, l'ultimo è la scelta del piano ---------- */
  const PASSI = ["Area di studio", "Ateneo, corso e anno", "Da dove partire", "Dopo la laurea", "Ritmo e avvisi", "Il tuo piano"];
  UL.views.onboardingU = {
    title: "Primo accesso",
    render: () => `
    <div class="auth" style="grid-template-columns:1fr"><section class="auth-form-wrap" style="min-height:100vh"><div style="width:100%;max-width:760px">
      <a class="brand" href="#/app/dashboard" style="margin-bottom:20px"><img src="img/logo-blu.png" alt=""><span>unilink</span></a>
      <div class="card" style="padding:30px" data-onb></div></div></section></div>`,
    mount(root, user) {
      const p = user.profile;
      // stato del wizard in memoria (si perde solo ricaricando la pagina)
      const o = U.onb || (U.onb = { n: 0, area: p.area || "economia", ateneo: p.ateneo || "unifi", cds: p.cds || "EA", anno: p.anno || "1", corso: p.corso || "", esami: new Set(user.activity.exams.map((e) => e.slug)), dopo: p.dopoLaurea || "", minuti: 60, avvisi: true, novita: false, attesa: "", piano: "free", sem: "2" });
      const box = root.querySelector("[data-onb]");
      const a = () => AREE.find((x) => x.slug === o.area);
      const unifi = () => o.ateneo === "unifi";
      const draw = () => {
        const n = o.n;
        let body = "";
        if (n === 0) body = `<h2 style="margin:10px 0 6px">Ciao ${esc(p.nome)}, cosa studi?</h2><p class="muted" style="margin-bottom:18px">L'area decide materiali, corsi e strumenti. Puoi cambiarla dal profilo.</p>
          <div class="stack" style="gap:10px">${AREE.map((x) => `<button class="mode ${o.area === x.slug ? "focus" : ""}" data-area="${x.slug}" style="text-align:left;cursor:pointer"><div class="row between"><h3>${esc(x.nome)}</h3><span class="badge ${x.stato === "attiva" ? "badge-green" : x.stato === "in_arrivo" ? "badge-yellow" : "badge-soft"}">${x.stato === "attiva" ? "Attiva" : x.stato === "in_arrivo" ? "In arrivo" : "Dicci quale"}</span></div>
            <p>${x.stato === "attiva" ? esc(x.corsi.join(" · ")) : x.stato === "in_arrivo" ? "Ti registri ora e ti avvisiamo quando parte: intanto esami, libretto e strumenti per tutti." : "Le richieste decidono le prossime aree."}</p></button>`).join("")}</div>`;
        if (n === 1) body = `<h2 style="margin:10px 0 6px">Ateneo, corso e anno</h2><p class="muted" style="margin-bottom:18px">Per filtrare esami e materiali del tuo anno.</p>
          <div class="grid-2"><div class="field"><label>Ateneo</label><select class="select" data-k="ateneo"><option value="unifi" ${unifi() ? "selected" : ""}>Università di Firenze</option><option value="altro" ${unifi() ? "" : "selected"}>Altro ateneo (in arrivo)</option></select></div>
            <div class="field"><label>Corso</label>${o.area === "economia" && unifi() ? `<select class="select" data-k="cds"><option value="EA" ${o.cds === "EA" ? "selected" : ""}>Economia Aziendale</option><option value="EC" ${o.cds === "EC" ? "selected" : ""}>Economia e Commercio</option></select>` : `<input class="input" data-k="corso" value="${esc(o.corso || a().corsi[0] || "")}">`}</div>
            <div class="field"><label>Anno</label><select class="select" data-k="anno">${[["1", "I anno"], ["2", "II anno"], ["3", "III anno"], ["FC", "Fuori corso"]].map(([v, l]) => `<option value="${v}" ${o.anno === v ? "selected" : ""}>${l}</option>`).join("")}</select></div></div>
          ${unifi() ? "" : `<div class="banner" style="margin-top:14px">${icon("info")}<span>Oggi UniLink copre UniFi. Gli altri atenei sono una proposta in valutazione (D12): ti registri lo stesso e usi gli strumenti per tutti.</span></div>`}`;
        if (n === 2) {
          if (a().stato !== "attiva") body = `<h2 style="margin:10px 0 6px">${esc(a().nome)} sta arrivando</h2><p class="muted" style="margin-bottom:18px">Non abbiamo ancora materiali per ${esc(a().nome)}: ti mettiamo in lista d'attesa. È il numero che decide quale area parte prima.</p>
            <div class="field"><label>${esc(a().domanda || "A che anno sei?")}</label><input class="input" data-k="attesa" value="${esc(o.attesa)}"></div>`;
          else { const y = Math.min(3, Math.max(1, Number(o.anno) || 1));
            body = `<h2 style="margin:10px 0 6px">Quali esami stai preparando?</h2><p class="muted" style="margin-bottom:18px">Scegli gli esami del tuo anno: la dashboard partirà da questi.</p>
            <div class="chips">${B.courses().filter((c) => c.anno === y && c.cds.includes(o.cds)).map((c) => `<span class="chip ${o.esami.has(c.slug) ? "on" : ""}" data-es="${c.slug}">${esc(c.title)}${B.hasQuiz(c.slug) ? ` ${icon("quiz")}` : ""}</span>`).join("")}</div>`; }
        }
        if (n === 3) body = `<h2 style="margin:10px 0 6px">E dopo la laurea?</h2><p class="muted" style="margin-bottom:18px">Serve a «Il mio percorso» per proporti magistrali, Erasmus e i prossimi passi. Puoi non saperlo ancora.</p>
          <div class="chips">${Object.entries(UL.ui.DOPO).map(([k, l]) => `<span class="chip ${o.dopo === k ? "on" : ""}" data-dopo="${k}">${esc(l)}</span>`).join("")}</div>`;
        if (n === 4) body = `<h2 style="margin:10px 0 6px">Il tuo ritmo</h2><p class="muted" style="margin-bottom:18px">Per proporti le sessioni giuste. Niente di vincolante.</p>
          <div class="field"><label>Quanto tempo al giorno?</label><div class="seg">${[30, 45, 60, 90].map((m) => `<button class="${o.minuti === m ? "on" : ""}" data-min="${m}">${m} min</button>`).join("")}</div></div>
          <label class="check" style="margin-top:16px"><input type="checkbox" data-k="avvisi" ${o.avvisi ? "checked" : ""}> Email quando esce o si aggiorna una dispensa che segui</label>
          <label class="check" style="margin-top:8px"><input type="checkbox" data-k="novita" ${o.novita ? "checked" : ""}> Email con le novità di UniLink (al massimo una al mese)</label>`;
        if (n === 5) {
          const anno = Math.min(3, Math.max(1, Number(o.anno) || 1));
          const semOk = a().stato === "attiva" && unifi();
          body = `<h2 style="margin:10px 0 6px">Come vuoi iniziare?</h2><p class="muted" style="margin-bottom:18px">Si parte gratis. Puoi anche passare subito a un pacchetto o a Plus: in ogni caso lo cambi quando vuoi da «Abbonamento». Prezzi: ipotesi.</p>
          <div class="pricing three">
            ${[["free", "Gratuito", "0 €", "per sempre", UL.PIANI.lista[0].incl],
              ["semester", `Pacchetto ${ROMAN[anno]} anno · ${ROMAN[o.sem]} sem.`, B.eur(B.PRICES.semester), "una volta · ipotesi", B.semesterCourses(o.cds, anno, o.sem).map((c) => c.title)],
              ["plus", "UniLink Plus", B.eur(B.PRICES.plus), "al mese · ipotesi", UL.PIANI.lista[3].incl]].filter(([k]) => k !== "semester" || semOk).map(([k, t, pr, s, incl]) => `
              <div class="plan ${o.piano === k ? "hot" : ""}" data-hot="Scelto"><h3>${esc(t)}</h3><div class="price">${pr} <small>${esc(s)}</small></div>
                <ul>${incl.slice(0, 5).map((x) => `<li>${icon("check")}${esc(x)}</li>`).join("")}</ul>
                ${k === "semester" ? `<div class="seg" style="align-self:flex-start">${[1, 2].map((v) => `<button class="${String(o.sem) === String(v) ? "on" : ""}" data-sem="${v}">${ROMAN[v]} sem.</button>`).join("")}</div>` : ""}
                <button class="btn ${o.piano === k ? "btn-orange" : "btn-ghost"}" data-piano="${k}">${o.piano === k ? "Scelto" : "Scegli"}</button></div>`).join("")}
          </div>${semOk ? "" : `<div class="banner" style="margin-top:16px">${icon("info")}<span>Il pacchetto semestre riguarda gli esami di Economia UniFi: per te conviene partire gratis, e passare a un pacchetto quando la tua area o il tuo ateneo saranno attivi.</span></div>`}`;
        }
        box.innerHTML = `<div class="row between"><span class="sq-label">Primo accesso · passo ${n + 1} di ${PASSI.length} · ${PASSI[n]}</span>${n ? `<a href="#" class="small display" data-back>← Indietro</a>` : ""}</div>
          <div class="steps" style="margin-top:14px">${PASSI.map((_, i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</div>${body}
          <div class="row between" style="margin-top:24px"><a href="#" data-skip class="small display">${n < PASSI.length - 1 ? "Salta questo passo" : ""}</a>
            <button class="btn btn-primary btn-arrow" data-next>${n < PASSI.length - 1 ? "Continua" : o.piano === "free" ? "Entra nel tuo spazio" : "Vai al pagamento"} <span class="arr">${icon("arrow")}</span></button></div>`;
        bind();
      };
      const read = () => box.querySelectorAll("[data-k]").forEach((el) => { o[el.dataset.k] = el.type === "checkbox" ? el.checked : el.value; });
      const finish = () => {
        const eco = o.area === "economia" && unifi();
        Object.assign(p, { area: o.area, ateneo: o.ateneo, cds: eco ? o.cds : "", corso: eco ? "" : o.corso, anno: o.anno, dopoLaurea: o.dopo, newsletter: !!o.novita, colore: p.colore || U.COLORI[(p.nome.length + p.cognome.length) % U.COLORI.length] });
        if (eco) o.esami.forEach((s) => user.activity.exams.some((e) => e.slug === s) || user.activity.exams.push({ slug: s, partizione: "", appello: "", obiettivo: "", status: "doing" }));
        if (o.attesa) user.activity.waitlist[o.area] = o.attesa;
        const done = () => { UL.store.markOnboarded(user); B.track("registrazione"); U.onb = null; UL.ui.toast("Il tuo spazio è pronto"); UL.app.go("#/app/dashboard"); };
        if (o.piano === "free") return done();
        const anno = Math.min(3, Math.max(1, Number(o.anno) || 1));
        B.checkout(user, o.piano === "plus" ? B.plusItem() : B.semItem(o.cds, anno, o.sem), done);
      };
      function bind() {
        box.querySelectorAll("[data-area]").forEach((b) => b.addEventListener("click", () => { o.area = b.dataset.area; if (o.area !== "economia" && o.piano === "semester") o.piano = "free"; draw(); }));
        box.querySelectorAll('[data-k="ateneo"]').forEach((s) => s.addEventListener("change", () => { read(); if (!unifi() && o.piano === "semester") o.piano = "free"; draw(); }));
        box.querySelectorAll("[data-es]").forEach((b) => b.addEventListener("click", () => { o.esami.has(b.dataset.es) ? o.esami.delete(b.dataset.es) : o.esami.add(b.dataset.es); b.classList.toggle("on"); }));
        box.querySelectorAll("[data-dopo]").forEach((b) => b.addEventListener("click", () => { o.dopo = b.dataset.dopo; draw(); }));
        box.querySelectorAll("[data-min]").forEach((b) => b.addEventListener("click", () => { read(); o.minuti = Number(b.dataset.min); draw(); }));
        box.querySelectorAll("[data-sem]").forEach((b) => b.addEventListener("click", () => { o.sem = b.dataset.sem; o.piano = "semester"; draw(); }));
        box.querySelectorAll("[data-piano]").forEach((b) => b.addEventListener("click", () => { o.piano = b.dataset.piano; draw(); }));
        const back = box.querySelector("[data-back]"); back && back.addEventListener("click", (e) => { e.preventDefault(); read(); o.n--; draw(); });
        box.querySelector("[data-skip]").addEventListener("click", (e) => { e.preventDefault(); if (o.n < PASSI.length - 1) { o.n++; draw(); } });
        box.querySelector("[data-next]").addEventListener("click", () => { read(); if (o.n < PASSI.length - 1) { o.n++; draw(); } else finish(); });
      }
      draw();
    },
  };

  /* ---------- 4 · dashboard: quella della demo B; area in arrivo → pagina «in arrivo» ---------- */
  const altroAteneo = (user) => U.ateneoAttivo(user) ? "" : `<div class="banner dd-banner">${icon("globe")}<span><b>Il tuo ateneo non è ancora attivo.</b> La parte decisa copre UniFi; la versione per più atenei è una proposta da decidere.</span><a class="btn btn-sm btn-orange" href="#/app/home">Vedi la proposta (D12)</a></div>`;
  UL.views.dashboardU = {
    title: "Dashboard",
    render(user, params) { return U.attiva(user) ? altroAteneo(user) + UL.views.dashboardB.render(user, params) : arrivo(user, "Dashboard"); },
    mount(root, user, params) { if (U.attiva(user)) UL.views.dashboardB.mount && UL.views.dashboardB.mount(root, user, params); else bindArrivo(root, user); },
  };

  /* ---------- 5 · area in arrivo (Giurisprudenza, Medicina, …) ---------- */
  function arrivo(user, cosa) {
    const a = U.area(user), dentro = user.activity.waitlist[a.slug];
    return `${head(a.nome + " · in arrivo", "clock", `${esc(a.nome)} sta <span class="accent">arrivando</span>`, `${esc(cosa)}: per ${esc(a.nome)} non c'è ancora. Ti diciamo la verità e ti avvisiamo quando parte.`)}
      <div class="soon-hero"><div class="stack">
          <div class="card">${dentro ? `<div class="card-head"><h3>${icon("check")} Sei in lista d'attesa</h3><span class="badge badge-green">Iscritto/a</span></div><p class="muted">Risposta salvata: «${esc(dentro)}». Ti scriviamo solo quando l'area parte.</p>`
            : `<div class="card-head"><h3>${icon("bell")} Avvisami quando parte</h3></div><div class="field"><label>${esc(a.domanda || "A che anno sei?")}</label><input class="input" data-wl></div>
              <label class="check small" style="margin-top:10px"><input type="checkbox" data-wlok> Usate la mia email solo per avvisarmi quando l'area parte.</label><button class="btn btn-primary" style="margin-top:14px" data-wlgo>Avvisami</button>`}</div>
          <div class="card beige"><h3>Studi ${esc(a.nome)}?</h3><p class="small muted" style="margin:6px 0 12px">Cerchiamo i primi studenti dell'area: materiali, idee, ambassador. Ogni area parte quando c'è chi la costruisce.</p>
            <a class="btn btn-orange btn-sm" href="https://chat.whatsapp.com/KdA4r1POh6MAiBbLmmES0L" target="_blank" rel="noopener">Costruiscila con noi</a></div>
          <p class="small">Intanto funzionano per tutti: <a href="#/app/esami">I miei esami</a> · <a href="#/app/percorso">Libretto e voto</a> · <a href="#/app/account">Profilo</a>${a.decidere ? ` · <a href="#/app/decidere/${a.decidere}">come sarà ${esc(a.nome)} (${a.decidere})</a>` : ""}</p></div>
        <div class="soon-art">${icon("clock", "big")}</div></div>`;
  }
  U.arrivo = arrivo;
  function bindArrivo(root, user) {
    const go = root.querySelector("[data-wlgo]");
    go && go.addEventListener("click", () => {
      if (!root.querySelector("[data-wlok]").checked) return UL.ui.toast("Serve il consenso per avvisarti", "err");
      user.activity.waitlist[U.area(user).slug] = root.querySelector("[data-wl]").value || "—";
      UL.store.addLog(user, "account", "Lista d'attesa " + U.area(user).nome); UL.store.save(); UL.ui.toast("Fatto: ti avvisiamo quando parte"); UL.app.refresh();
    });
  }
  U.bindArrivo = bindArrivo;
  // avvolge una vista della demo A/B: se l'area non è attiva mostra «in arrivo» (voci con soloAttiva in boot.js)
  U.soloAttiva = (key, nome) => ({ title: nome, render: (u, p) => (U.attiva(u) ? UL.views[key].render(u, p) : arrivo(u, nome)), mount: (r, u, p) => (U.attiva(u) ? UL.views[key].mount && UL.views[key].mount(r, u, p) : bindArrivo(r, u)) });

  /* ---------- 6 · Abbonamento: upgrade, disdetta, ordini (rotta «abbonamento») ---------- */
  UL.views.abbonamentoU = {
    title: "Abbonamento",
    render(user, params) {
      const tab = params[0] === "ordini" ? "ordini" : "piano";
      const plus = B.plus(user), ps = user.activity.purchases;
      const anno = Math.min(3, Math.max(1, Number(user.profile.anno) || 1));
      const semGia = (s) => ps.some((x) => x.type === "semester" && x.anno === anno && x.sem === s);
      const studio = U.attiva(user) && U.ateneoAttivo(user);
      const cards = [
        { k: "free", attivo: true, cta: `<span class="badge badge-green">Sempre incluso</span>` },
        { k: "exam", attivo: ps.some((x) => x.type === "exam"), cta: studio ? `<a class="btn btn-ghost" href="#/app/materiali/catalogo">Scegli un esame</a>` : `<span class="small muted">Quando la tua area sarà attiva</span>` },
        { k: "semester", attivo: ps.some((x) => x.type === "semester"), cta: studio ? `<div class="row">${[1, 2].map((s) => semGia(s) ? `<span class="badge badge-green">${ROMAN[s]} sem. attivo</span>` : `<button class="btn btn-primary btn-sm" data-sem="${s}">${ROMAN[anno]} anno · ${ROMAN[s]} sem.</button>`).join("")}</div>` : `<span class="small muted">Quando la tua area sarà attiva</span>` },
        { k: "plus", attivo: plus, cta: plus ? `<button class="btn btn-ghost" data-cancel>Disdici Plus</button>` : `<button class="btn btn-orange" data-plus>Passa a Plus</button>` },
      ];
      const since = user.activity.plus && user.activity.plus.since;
      return `${head("Account", "euro", `Il tuo <span class="accent">abbonamento</span>`, "Il materiale comprato resta tuo. Plus vale finché è attivo e si disdice quando vuoi. Prezzi: ipotesi da decidere.")}
        <div class="tabs"><a href="#/app/abbonamento" class="${tab === "piano" ? "on" : ""}">${icon("spark")} Il tuo piano</a><a href="#/app/abbonamento/ordini" class="${tab === "ordini" ? "on" : ""}">${icon("file")} Ordini e ricevute <span class="cnt">${ps.length}</span></a></div>
        ${tab === "ordini" ? UL.views.acquistiB.render(user).replace(/<div class="page-head">[\s\S]*?<\/div><\/div>/, "") : `
        <div class="grid g-ov" style="margin-bottom:22px">
          <section class="card navy c-7"><span class="badge badge-orange">Il tuo piano</span><h2 style="margin:12px 0 8px">${esc(B.planName(user))}</h2>
            <p style="color:rgba(255,255,255,.78)">${plus ? `Plus attivo${since ? " dal " + fmtDate(since) : ""}: esercitazioni complete su tutti gli esami, simulazioni e sconto sui mentor.` : "Puoi aggiungere un pacchetto o passare a Plus in qualsiasi momento: niente rinnovi automatici nei pacchetti."}</p>
            <div class="row" style="margin-top:18px">${plus ? `<button class="btn btn-white" data-cancel>Disdici Plus</button>` : `<button class="btn btn-white btn-arrow" data-plus>Passa a Plus · ${B.eur(B.PRICES.plus)}/mese <span class="arr">${icon("arrow")}</span></button>`}</div></section>
          <section class="c-5 stack">
            <div class="stat"><span class="k">${icon("book")} Esami sbloccati</span><span class="v">${B.courses().filter((c) => B.owns(user, c.slug)).length}</span><span class="s">materiali completi in PDF</span></div>
            <div class="stat"><span class="k">${icon("quiz")} Esercitazioni complete</span><span class="v">${plus ? "Tutte" : Object.keys(window.UL_QUIZ).filter((s) => B.ownsPractice(user, s)).length}</span><span class="s">${plus ? "con Plus" : "per gli esami sbloccati"}</span></div></section></div>
        <div class="pricing">${cards.map((x) => { const pl = UL.PIANI.lista.find((p) => p.k === x.k); return `
          <div class="plan ${x.k === "plus" && !plus ? "hot" : ""}" data-hot="Consigliato"><div class="row between"><h3>${esc(pl.nome)}</h3>${x.attivo ? '<span class="badge badge-green">Attivo</span>' : ""}</div>
            <div class="price">${esc(pl.prezzo)} <small>${esc(pl.sub)}</small></div><ul>${pl.incl.map((i) => `<li>${icon("check")}${esc(i)}</li>`).join("")}</ul>${x.cta}</div>`; }).join("")}</div>
        <div class="card section" style="margin-top:22px"><div class="card-head"><h3>${icon("layers")} Cosa puoi fare adesso</h3><span class="small muted">regole: config.js → UL.PIANI · core.js → owns / ownsPractice / plus</span></div>
          <div class="table-wrap"><table class="table"><thead><tr><th>Funzione</th><th>Per te</th></tr></thead><tbody>
          ${[["Schede, partizioni, quiz di prova", true], ["Dispense complete (PDF)", B.courses().some((c) => B.owns(user, c.slug)) ? "Solo gli esami sbloccati" : false], ["Quiz rapidi e simulazioni", plus ? true : Object.keys(window.UL_QUIZ).some((s) => B.ownsPractice(user, s)) ? "Solo gli esami sbloccati" : false], ["Sconto sui mentor", plus], ["Libretto, voto di laurea, Erasmus, magistrali", true]].map(([t, v]) => `<tr><td>${t}</td><td>${v === true ? `<span class="badge badge-green">${icon("check")} Sì</span>` : v ? `<span class="badge badge-yellow">${esc(v)}</span>` : `<span class="lock">${icon("lock")} Pacchetto o Plus</span>`}</td></tr>`).join("")}</tbody></table></div></div>`}`;
    },
    mount(root, user) {
      const anno = Math.min(3, Math.max(1, Number(user.profile.anno) || 1));
      root.querySelectorAll("[data-plus]").forEach((b) => b.addEventListener("click", () => B.checkout(user, B.plusItem(), () => UL.app.refresh())));
      root.querySelectorAll("[data-sem]").forEach((b) => b.addEventListener("click", () => B.checkout(user, B.semItem(user.profile.cds || "EA", anno, b.dataset.sem), () => UL.app.refresh())));
      root.querySelectorAll("[data-cancel]").forEach((b) => b.addEventListener("click", async () => {
        if (!(await UL.ui.confirmBox("Disdire Plus?", "Le esercitazioni complete tornano disponibili solo per gli esami che hai acquistato. I materiali comprati restano tuoi.", "Disdici", true))) return;
        B.cancelPlus(user); UL.ui.toast("Plus disdetto"); UL.app.refresh();
      }));
    },
  };

  /* ---------- 7 · Visualizza come: cambia tipologia di account senza uscire ---------- */
  // to = rotta da aprire dopo il cambio (dalla scheda di una proposta); k = tipologia da evidenziare
  function visualizzaCome(to, k) {
    const cur = UL.store.currentUser();
    const enter = async (d) => {
      UL.store.logout();
      try { const u = await UL.store.login(d.email, d.password, false); m.close(); UL.app.go(to || "#/app/dashboard"); UL.ui.toast("Stai guardando: " + d.label + " · " + u.profile.nome); }
      catch (e) { UL.ui.toast("Account demo non trovato: usa «Ripristina dati demo» nel login", "err"); }
    };
    const m = UL.ui.modal(`
      <div class="modal-head"><div><span class="badge badge-orange">Demo</span><h2 style="margin-top:10px">Visualizza come</h2><p class="muted" style="margin-top:6px">Guarda la stessa area personale con un'altra tipologia di account. I dati sono di esempio.</p></div>
        <button class="icon-btn" data-close aria-label="Chiudi">${icon("x")}</button></div>
      <ul class="feed">${UL.DEMO.map((d, i) => `<li style="align-items:center"><span class="ic">${icon(d.icon)}</span><div style="flex:1"><b class="display" style="font-weight:400;color:var(--navy)">${esc(d.label)}</b>${d.k === k ? ' <span class="badge badge-orange">consigliata</span>' : ""}<time>${esc(d.desc)}</time></div>
        ${cur && cur.email === d.email ? '<span class="badge badge-green">Stai guardando</span>' : `<button class="btn btn-sm btn-primary" data-as="${i}">Visualizza</button>`}</li>`).join("")}
        <li style="align-items:center"><span class="ic">${icon("plus")}</span><div style="flex:1"><b class="display" style="font-weight:400;color:var(--navy)">Nuovo account</b><time>Registrazione + primo accesso con scelta del piano</time></div><button class="btn btn-sm btn-ghost" data-new>Prova</button></li></ul>`, { width: 620 });
    m.el.querySelectorAll("[data-as]").forEach((b) => b.addEventListener("click", () => enter(UL.DEMO[Number(b.dataset.as)])));
    m.el.querySelector("[data-new]").addEventListener("click", () => { UL.store.logout(); m.close(); UL.app.go("#/registrati"); });
  }
  U.visualizzaCome = visualizzaCome;
  const vbtn = document.createElement("button");
  vbtn.className = "btn btn-sm btn-white vista-btn";
  vbtn.innerHTML = `${icon("eye")} Visualizza come`;
  vbtn.addEventListener("click", () => visualizzaCome());
  document.body.appendChild(vbtn);

  /* ---------- 8 · cornice dei moduli DA DECIDERE ---------- */
  // rotta → proposta (es. "opportunita" → D05), costruita dal registro: una sola fonte di verità
  U.DD_ROTTE = {};
  DEC.forEach((x) => x.modulo && x.modulo.rotte.forEach(([r]) => { if (r !== "dashboard") U.DD_ROTTE[r] = x; }));
  // avvolge una vista di un modulo C/D: banner «da decidere» + la vista originale, invariata
  U.dd = (route, viewKey) => ({
    get title() { return UL.views[viewKey].title; },
    render(u, p) {
      const x = U.DD_ROTTE[route];
      return `<div class="banner dd-banner">${icon("alert")}<span><b>Da decidere · ${x ? x.id : ""}</b> — modulo proposto dalla ${esc(x ? x.gruppo.replace(/.*\((.*)\)/, "$1") : "demo")}, non ancora deciso. Funziona con dati di esempio.</span>${x ? `<a class="btn btn-sm btn-orange" href="#/app/decidere/${x.id}">Architettura</a>` : ""}</div>` + (U.ddTabs ? U.ddTabs(route, u) : "") + UL.views[viewKey].render(u, p);
    },
    mount(r, u, p) { UL.views[viewKey].mount && UL.views[viewKey].mount(r, u, p); },
  });

  /* ---------- 9 · Da decidere: catalogo + scheda di architettura ---------- */
  const punti = (n) => n ? `<span style="color:var(--orange)">${"●".repeat(n)}<span style="color:var(--line)">${"●".repeat(5 - n)}</span></span>` : '<span class="small muted">non valutato</span>';
  const lista = (l) => l && l.length ? `<ul class="incl">${l.map((i) => `<li class="paid">${icon("arrow")}<span>${esc(i)}</span></li>`).join("")}</ul>` : '<p class="small muted">—</p>';
  const mono = (l) => l && l.length ? `<ul class="feed">${l.map((i) => `<li><span class="ic">${icon("file")}</span><div><code style="font-size:13px;white-space:normal;word-break:break-word">${esc(i)}</code></div></li>`).join("")}</ul>` : '<p class="small muted">—</p>';
  const persona = (k) => UL.DEMO.find((d) => d.k === k);
  UL.views.decidereU = {
    title: "Da decidere",
    render(user, params) {
      if (params[0]) {
        const x = DEC.find((d) => d.id === params[0]);
        if (!x) return `<div class="empty">Proposta non trovata. <a href="#/app/decidere">Torna a Da decidere</a></div>`;
        const mod = x.modulo, pers = mod && persona(mod.persona);
        const azioni = mod ? `<div class="row">${mod.rotte[0][0] !== "dashboard" ? `<a class="btn btn-sm btn-orange" href="#/app/${mod.rotte[0][0]}">${icon("eye")} Apri il modulo</a>` : ""}${pers ? `<button class="btn btn-sm btn-ghost" data-vista="${pers.k}" data-to="#/app/${mod.rotte[0][0]}">Visualizza come «${esc(pers.label)}»</button>` : ""}</div>` : `<span class="badge badge-soft">Modulo da costruire</span>`;
        const sec = (ic, t, body, cls) => `<section class="card ${cls || "c-6"}"><div class="card-head"><h3>${icon(ic)} ${t}</h3></div>${body}</section>`;
        return `<a href="#/app/decidere" class="small display" style="text-decoration:none">← Da decidere</a>
          ${head(x.id + " · " + x.gruppo, "alert", esc(x.titolo), esc(x.cosa), azioni)}
          <div class="banner dd-banner">${icon("alert")}<span><b>${esc(x.stato)} · non deciso.</b> Origine: ${esc(x.origine)}. Impatto ${punti(x.impatto)} · Sforzo ${punti(x.sforzo)}${x.impatto ? " (dall'HQ)" : ""}.</span></div>
          <div class="grid g-ov">
            ${sec("layers", "Pagine e rotte", mod ? `<div class="table-wrap"><table class="table"><thead><tr><th>Rotta</th><th>Pagina</th><th></th></tr></thead><tbody>${mod.rotte.map(([r, l]) => `<tr><td><code>#/app/${esc(r)}</code></td><td>${esc(l)}</td><td>${r !== "dashboard" ? `<a class="small display" href="#/app/${esc(r)}">Apri →</a>` : ""}</td></tr>`).join("")}</tbody></table></div><p class="tiny muted" style="margin-top:10px">Vista: <code>${esc(mod.vista)}</code></p>` : '<p class="muted">Nessuna pagina ancora: è un concetto. Vedi «File» per dove nascerebbe.</p>', "c-7")}
            ${sec("euro", "Ricavi (ipotesi)", `<p>${esc(x.ricavi || "—")}</p><p class="tiny muted" style="margin-top:8px">Numeri delle demo, non validati: regola HQ, niente prezzi o statistiche inventate come veri.</p>`, "c-5")}
            ${sec("file", "File", mono(x.file))}
            ${sec("db", "Dati salvati", mono(x.dati))}
            ${sec("settings", "Funzioni del motore", mono(x.funzioni))}
            ${sec("users", "Dipendenze", lista(x.dipendenze))}
            ${sec("check", "Per attivarla", `<ol class="small" style="padding-left:18px;display:grid;gap:6px">${(x.attivare || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`)}
            ${sec("info", "Domande aperte", lista(x.domande))}
            ${sec("clock", "Storico", `<ul class="feed">${x.storico.map((s) => `<li><span class="ic">${icon("edit")}</span><div>${esc(s[1])}<time>${fmtDate(s[0])}</time></div></li>`).join("")}</ul>`, "c-12")}
          </div>`;
      }
      const gruppi = [...new Set(DEC.map((x) => x.gruppo))];
      const nMod = DEC.filter((x) => x.modulo).length;
      return `${head("Sezione di lavoro del team", "alert", `Da <span class="accent">decidere</span>`, "Le sezioni dello studente sono quelle decise. Qui ogni proposta ha la sua architettura completa: pagine, file, dati, funzioni, ricavi, come attivarla.")}
        <div class="banner dd-banner">${icon("info")}<span><b>${nMod} proposte su ${DEC.length} funzionano già nella app</b> (moduli delle demo C e D, nel gruppo arancione della sidebar). Ogni codice (D01, D02…) non cambia: usalo per chiedere modifiche o per decidere.</span></div>
        ${gruppi.map((g) => `<div class="year-head"><h2>${esc(g)}</h2><span class="line"></span></div><div class="mode-grid">${DEC.filter((x) => x.gruppo === g).map((x) => `
          <a class="mode dd-card" href="#/app/decidere/${x.id}" style="text-decoration:none;color:inherit"><div class="row between"><span class="sq-label">${x.id}</span><span class="badge ${x.modulo ? "badge-orange" : "badge-soft"}">${x.modulo ? "Modulo nella app" : "Da costruire"}</span></div><h3>${esc(x.titolo)}</h3><p>${esc(x.cosa)}</p><span class="small muted">${esc(x.stato)}${x.impatto ? " · impatto " + x.impatto + "/5" : ""}</span></a>`).join("")}</div>`).join("")}`;
    },
    mount(root) {
      root.querySelectorAll("[data-vista]").forEach((b) => b.addEventListener("click", () => visualizzaCome(b.dataset.to, b.dataset.vista)));
    },
  };

  /* ---------- 10 · Configurazione (team): le tabelle che governano la app ---------- */
  UL.views.configU = {
    title: "Configurazione",
    render() {
      const si = (v) => (v ? `<span class="badge badge-green">${icon("check")} Sì</span>` : `<span class="small muted">—</span>`);
      const card = (ic, t, src, body) => `<div class="card" style="margin-top:20px"><div class="card-head"><h3>${icon(ic)} ${t}</h3><span class="small muted">${src}</span></div>${body}</div>`;
      const tab = (cols, rows) => `<div class="table-wrap"><table class="table"><thead><tr>${cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      return `${head("Sezione di lavoro del team", "settings", `Come è <span class="accent">configurata</span>`, "Tutto quello che vedi qui si cambia in un file: nessun design da rifare.")}
        ${card("globe", "1 · Aree di studio", "js/unilink-dati.js → UL_AREE", tab(["Area", "Stato", "Atenei", "Corsi"], AREE.map((a) => [`<b class="display" style="font-weight:400;color:var(--navy)">${esc(a.nome)}</b>`, `<span class="badge ${a.stato === "attiva" ? "badge-green" : a.stato === "in_arrivo" ? "badge-yellow" : "badge-soft"}">${esc(a.stato.replace("_", " "))}</span>`, esc(a.atenei.map((x) => x.nome).join(", ") || "—"), esc(a.corsi.join(", ") || "—")]))
          + `<p class="tiny muted" style="margin-top:10px">Nuova area: una riga con stato «in_arrivo» (lista d'attesa automatica). Accenderla: stato «attiva» + materiali con quell'area.</p>`)}
        ${card("layers", "2 · Sidebar: sezioni decise", "js/boot.js → UL.NAV.decise", tab(["Gruppo", "Voci (rotta)", "Se l'area è in arrivo"], UL.NAV.decise.map((g) => [`<b>${esc(g.g)}</b>`, g.items.map((i) => `${esc(i.l)} <code>${esc(i.k)}</code>`).join(" · "), g.items.filter((i) => i.soloAttiva).map((i) => esc(i.l)).join(", ") || "—"])))}
        ${card("alert", "3 · Sidebar: moduli da decidere", "js/boot.js → UL.NAV.dd · js/da-decidere/…", tab(["Modulo", "Voce", "Rotta → vista", "Proposta"], UL.NAV.dd.flatMap((g) => g.items.map((i) => [esc(g.modulo), esc(i.l), `<code>${esc(i.k)} → ${esc(i.v)}</code>`, U.DD_ROTTE[i.k] ? `<a href="#/app/decidere/${U.DD_ROTTE[i.k].id}">${U.DD_ROTTE[i.k].id}</a>` : "—"])))
          + `<p class="tiny muted" style="margin-top:10px">Promuovere un modulo: spostare la voce da UL.NAV.dd a UL.NAV.decise (e togliere U.dd() dalla rotta). Rimuoverlo: togliere voce, rotta e i suoi &lt;script&gt; da index.html.</p>`)}
        ${card("euro", "4 · Piani × funzioni", "js/config.js → UL.PIANI · prezzi = ipotesi",
          `<div class="table-wrap"><table class="table"><thead><tr><th>Funzione</th>${UL.PIANI.lista.map((p) => `<th>${esc(p.nome)}<br><span class="tiny muted">${esc(p.prezzo)}</span></th>`).join("")}</tr></thead><tbody>
          ${[["Schede, quiz di prova, ripasso errori", [1, 1, 1, 1]], ["Dispensa completa (PDF)", [0, 1, 1, 0]], ["Quiz rapidi e simulazioni", [0, 1, 1, 1]], ["…su tutti gli esami", [0, 0, 0, 1]], ["Sconto sui mentor", [0, 0, 0, 1]], ["Libretto, voto di laurea, Erasmus, magistrali", [1, 1, 1, 1]]].map(([t, v]) => `<tr><td>${t}</td>${v.map((x) => `<td>${si(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
          <p class="tiny muted" style="margin-top:10px">Gli acquisti si sommano. Plus apre le esercitazioni, non le dispense in PDF. Upgrade: nel primo accesso, in «Abbonamento», su ogni lucchetto. Plus è un solo campo (activity.plus) anche per i moduli Career.</p>`)}
        ${card("users", "5 · Tipologie demo", "js/seed.js → UL.DEMO e UL.SEED",
          `<ul class="feed">${UL.DEMO.map((d) => `<li style="align-items:center"><span class="ic">${icon(d.icon)}</span><div style="flex:1"><b class="display" style="font-weight:400;color:var(--navy)">${esc(d.label)}</b><time>${esc(d.desc)} · ${esc(d.email)}</time></div></li>`).join("")}</ul>
          <button class="btn btn-primary btn-sm" style="margin-top:12px" data-vista>${icon("eye")} Visualizza come…</button>`)}
        ${card("file", "6 · Dove si cambia cosa", "architettura/UniLink_Architettura_WebApp.pdf", tab(["Cosa", "File"], [
          ["Prezzi e piani", "js/config.js → UL.PIANI"], ["Modello dati (profilo, attività)", "js/config.js → UL.CONFIG"], ["Aree e proposte da decidere", "js/unilink-dati.js"],
          ["Voci della sidebar e rotte", "js/boot.js"], ["Account demo", "js/seed.js"], ["Esami, dispense, domande", "js/data-dispense.js · js/data-quiz.js"],
          ["Regole di sblocco", "js/core.js → owns, ownsPractice, plus"], ["Moduli Career / Network", "js/da-decidere/career · js/da-decidere/network (intestazione di core.js)"], ["Design", "css/style.css (demo A) · css/unilink.css (aggiunte)"], ["Commenti del team (pulsante «Commenti»)", "js/commenti.js · export PDF, .md per l'AI, JSON"]].map(([a, b]) => [esc(a), `<code>${esc(b)}</code>`])))}`;
    },
    mount(root) { const b = root.querySelector("[data-vista]"); b && b.addEventListener("click", () => visualizzaCome()); },
  };
})();
