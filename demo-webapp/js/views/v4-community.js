/* js/views/v4-community.js — web app v4 · gruppo «Community» (sezioni promosse dai moduli C e D, commento del 7/10).
   1 Aula studio (P1): gruppi per esame e per appello, gratuiti, moderati dagli ambassador, con i materiali UniLink come base.
     Con Plus: «Studia con altri» = il piano del gruppo con l'avanzamento di tutti e una sessione settimanale guidata da un
     ambassador che ha preso 28 o più. Eventi (dai moduli Club ed Eventi): ripassi guidati prima degli appelli.
   2 Mentor e ambassador (da Mentor C e Referral/Ambassador): tutoring 1-1 (P2: 20 €/ora, 3 ore 54 €, 75% al mentor),
     programma ambassador, inviti (ogni amico che conferma l'email = 1 Appunti gratis, regola P2).
   Stessa regola di tutta l'app: le parti incluse nel piano si usano, le altre si vedono con il lucchetto (U.lock).
   Dati: activity.aula { gruppi[], creati[], post{}, rsvp[] } · activity.bookings · activity.referral · activity.ambassador */
(function () {
  const UL = window.UL, B = UL.B, U = UL.U;
  const { icon, esc, fmtDate } = UL.ui;
  const head = (eyebrow, ic, title, lead, right) => `
    <div class="page-head"><div><div class="eyebrow">${icon(ic)} ${esc(eyebrow)}</div><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}</div>${right || ""}</div>`;
  const inDays = (d, h = "18:00") => { const x = new Date(Date.now() + d * 864e5); return x.toISOString().slice(0, 10) + "T" + h; };
  const aula = (u) => (u.activity.aula = Object.assign({ gruppi: [], creati: [], post: {}, rsvp: [] }, u.activity.aula || {}));

  // gruppi di esempio (in produzione: creati dagli studenti e moderati dagli ambassador)
  const AMB = { mi: "Lorenzo B. · 30L in Microeconomia", st: "Tommaso G. · 29 in Statistica", ea: "Chiara D. · 30 in Economia Aziendale", ma: "Sofia P. · 28 in Macroeconomia" };
  const GRUPPI = [
    { id: "g1", slug: "microeconomia", appello: 28, nome: "Micro · appello di gennaio", membri: 14, attivi: 9, amb: AMB.mi, quando: "giovedì 18:00 · biblioteca di Novoli / online" },
    { id: "g2", slug: "microeconomia", appello: 58, nome: "Micro · febbraio, si parte con calma", membri: 6, attivi: 4, amb: AMB.mi, quando: "martedì 17:30 · online" },
    { id: "g3", slug: "statistica", appello: 42, nome: "Statistica · esercizi insieme", membri: 11, attivi: 7, amb: AMB.st, quando: "mercoledì 16:00 · aula studio D6" },
    { id: "g4", slug: "economia-aziendale", appello: 35, nome: "Ec. Aziendale · partita doppia", membri: 9, attivi: 6, amb: AMB.ea, quando: "lunedì 18:00 · online" },
    { id: "g5", slug: "macroeconomia", appello: 30, nome: "Macro · ripasso modelli", membri: 5, attivi: 3, amb: AMB.ma, quando: "venerdì 15:00 · biblioteca di Novoli" },
    { id: "g6", slug: "finanza-aziendale", appello: 56, nome: "Finanza Aziendale · casi e VAN", membri: 8, attivi: 5, amb: "Andrea R. · 30 in Finanza Aziendale", quando: "giovedì 17:00 · online" },
  ];
  const EVENTI = [
    { id: "ev1", d: 6, t: "Ripasso guidato · Microeconomia", c: "Con Lorenzo B. (30L): gli esercizi che tornano più spesso all'appello.", dove: "Novoli, D6 · e online" },
    { id: "ev2", d: 12, t: "Come si prepara una sessione", c: "Metodo, calendario e planner: un'ora con gli ambassador del I anno.", dove: "Online" },
    { id: "ev3", d: 20, t: "Simulazione d'esame collettiva · Statistica", c: "30 domande a tempo, poi correzione insieme.", dove: "Novoli, aula studio" },
  ];
  const BACHECA = { g1: [["Giulia", "Qualcuno ha capito l'esercizio 4 del cap. 5?"], ["Lorenzo B. · ambassador", "Giovedì lo facciamo insieme all'inizio della sessione."], ["Marco", "Ho caricato le mie mappe sul monopolio nel drive del gruppo."]] };
  const tutti = (u) => GRUPPI.concat(aula(u).creati).filter((g) => B.course(g.slug));

  function cardGruppo(u, g) {
    const c = B.course(g.slug), dentro = aula(u).gruppi.includes(g.id), mio = aula(u).creati.some((x) => x.id === g.id);
    const app = typeof g.appello === "number" ? inDays(g.appello).slice(0, 10) : g.appello;
    return `<div class="mentor"><div class="row between"><span class="badge badge-soft">${esc(c.title)}</span>${dentro ? '<span class="badge badge-green">Sei dentro</span>' : ""}</div>
      <h3>${esc(g.nome)}</h3>
      <div class="facts small muted">${icon("calendar")} appello ${fmtDate(app)} · ${icon("users")} ${g.membri + (dentro && !mio ? 1 : 0)} iscritti · ${g.attivi} attivi questa settimana</div>
      <p class="small">${icon("shield")} Modera ${esc(g.amb || "da assegnare (gruppo nuovo)")}<br>${icon("clock")} ${esc(g.quando)}</p>
      <p class="tiny muted">Base comune: le dispense UniLink di ${esc(c.title)} · niente slide dei professori</p>
      ${dentro ? `<button class="btn btn-sm btn-ghost" data-gesci="${g.id}">Esci dal gruppo</button>` : `<button class="btn btn-sm btn-primary" data-gentra="${g.id}">Entra nel gruppo</button>`}</div>`;
  }

  UL.views.aulaU = {
    title: "Aula studio",
    render(u, params) {
      if (!U.attiva(u)) return U.arrivo(u, "L'aula studio");
      const tab = ["insieme", "eventi"].includes(params[0]) ? params[0] : "gruppi", A = aula(u), plus = B.plus(u);
      const miei = u.activity.exams.filter((e) => e.status !== "done").map((e) => e.slug);
      const G = tutti(u), dentro = G.filter((g) => A.gruppi.includes(g.id));
      const tabs = `<div class="tabs"><a href="#/app/aula" class="${tab === "gruppi" ? "on" : ""}">${icon("users")} Gruppi <span class="cnt">${dentro.length}</span></a><a href="#/app/aula/insieme" class="${tab === "insieme" ? "on" : ""}">${icon(plus ? "target" : "lock")} Studia con altri</a><a href="#/app/aula/eventi" class="${tab === "eventi" ? "on" : ""}">${icon("calendar")} Eventi</a></div>`;
      let body = "";
      if (tab === "gruppi") {
        const perEsame = G.filter((g) => miei.includes(g.slug) && !A.gruppi.includes(g.id)), altri = G.filter((g) => !miei.includes(g.slug) && !A.gruppi.includes(g.id));
        body = `${dentro.length ? `<div class="year-head"><h2>I tuoi gruppi</h2><span class="line"></span></div><div class="grid g-ov">
            ${dentro.map((g) => `<section class="card c-6"><div class="card-head"><h3>${icon("users")} ${esc(g.nome)}</h3><button class="btn btn-sm btn-ghost" data-gesci="${g.id}">Esci</button></div>
              <ul class="feed">${(BACHECA[g.id] || []).concat(A.post[g.id] || []).map(([chi, t]) => `<li><span class="ic">${icon("users")}</span><div><b class="display" style="font-weight:400">${esc(chi)}</b><br><span class="small">${esc(t)}</span></div></li>`).join("") || '<li class="small muted">Ancora nessun messaggio: scrivi tu il primo.</li>'}</ul>
              <form class="row" data-post="${g.id}" style="margin-top:10px"><input class="input" placeholder="Scrivi al gruppo…" maxlength="280" style="flex:1"><button class="btn btn-sm btn-primary">Invia</button></form>
              <p class="tiny muted" style="margin-top:8px">Prossimo incontro: ${esc(g.quando)} · i messaggi restano nel gruppo, non su WhatsApp.</p></section>`).join("")}</div>` : ""}
          <div class="year-head"><h2>Per i tuoi esami</h2><span class="line"></span></div>
          ${perEsame.length ? `<div class="mentor-grid">${perEsame.map((g) => cardGruppo(u, g)).join("")}</div>` : `<p class="muted">Nessun gruppo aperto per i tuoi esami: crealo tu qui sotto.</p>`}
          <div class="card beige" style="margin-top:18px"><div class="card-head"><h3>${icon("plus")} Crea un gruppo per esame e appello</h3><span class="badge badge-green">gratis</span></div>
            <form class="grid-2" data-crea style="align-items:end"><div class="field"><label>Esame</label><select class="select" name="slug">${(miei.length ? miei.map((s) => B.course(s)).filter(Boolean) : B.courses().filter((c) => c.anno === 1)).map((c) => `<option value="${c.slug}">${esc(c.title)}</option>`).join("")}</select></div>
              <div class="field"><label>Data dell'appello</label><input class="input" type="date" name="appello" value="${inDays(40).slice(0, 10)}" required></div>
              <div class="field span-2"><label>Quando vi trovate</label><input class="input" name="quando" placeholder="es. martedì 18:00 · biblioteca di Novoli / online" required></div>
              <button class="btn btn-primary" type="submit">Apri il gruppo</button></form>
            <p class="tiny muted" style="margin-top:8px">Un ambassador del tuo anno modera il gruppo. Per partire servono almeno 4 persone.</p></div>
          ${altri.length ? `<div class="year-head"><h2>Altri gruppi</h2><span class="line"></span></div><div class="mentor-grid">${altri.map((g) => cardGruppo(u, g)).join("")}</div>` : ""}`;
      } else if (tab === "insieme") {
        const g = dentro[0] || G.find((x) => miei.includes(x.slug)) || G[0], c = B.course(g.slug);
        const pl = (u.activity.planner || {})[g.slug], mio = pl && pl.sessioni ? Math.round((pl.sessioni.filter((s) => s.fatto).length / pl.sessioni.length) * 100) : 0;
        const compagni = [["Tu", mio], ["Giulia", 41], ["Marco", 36], ["Sara", 52], ["Davide", 18]];
        const vista = `<div class="grid g-ov"><section class="card c-7"><div class="card-head"><h3>${icon("target")} Il piano del gruppo · ${esc(c.title)}</h3><span class="small muted">${esc(g.nome)}</span></div>
            <p class="small muted" style="margin-bottom:10px">Stesso metodo e stesse fasi del Planner per tutti: vedete chi è avanti e vi tenete il ritmo a vicenda.</p>
            ${compagni.map(([n, p]) => `<div class="v4-r"><span>${esc(n)}</span><b style="font-size:16px">${p}%</b></div><div class="v4-bar ${n === "Tu" ? "ev" : ""}"><i style="width:${p}%"></i></div>`).join("")}
            ${pl ? "" : `<p class="small" style="margin-top:10px">Il tuo avanzamento parte quando crei il piano di ${esc(c.title)}: <a href="#/app/planner/${g.slug}/variabili">apri il Planner</a>.</p>`}</section>
          <section class="c-5 stack"><div class="card navy"><span class="badge badge-orange">Sessione guidata</span><h3 style="margin:10px 0 6px;color:#fff">Ogni settimana con un ambassador</h3>
              <p class="small" style="color:rgba(255,255,255,.78)">${esc(g.amb || "Ambassador del tuo anno")} guida 45 minuti sugli errori più comuni della settimana. L'ambassador facilita, non fa lezione.</p>
              <p class="small" style="color:#f0b37c;margin-top:8px">${esc(g.quando)}</p></div>
            <div class="card beige"><h3>Gruppo o tutoring?</h3><p class="small" style="margin-top:6px">Nel gruppo si è pari livello e la struttura la dà il piano; il tutor insegna, uno a uno, a pagamento: lo trovi in <a href="#/app/mentoring">Mentor e ambassador</a>.</p></div></section></div>`;
        body = plus ? vista : `<div class="v4-blur"><div class="v4-blur-in" aria-hidden="true">${vista}</div><div class="v4-blur-msg"><span class="badge badge-orange">UniLink Plus</span><h3>Studia con altri</h3><p class="small">Il piano condiviso del gruppo con l'avanzamento di tutti e una sessione settimanale guidata da un ambassador che ha preso 28 o più. I gruppi restano gratis per tutti.</p>
          <button class="btn btn-orange" data-v4plus>Prendi Plus · ${B.eur(B.prezzoPlus(u))}</button></div></div>`;
      } else {
        body = `<div class="stack" style="gap:12px">${EVENTI.map((e) => { const on = aula(u).rsvp.includes(e.id), d = new Date(inDays(e.d));
          return `<article class="job"><span class="logo-sq" style="background:var(--orange);flex-direction:column;font-size:12px;line-height:1.1">${d.getDate()}<br>${d.toLocaleDateString("it-IT", { month: "short" })}</span>
            <div><div class="row" style="gap:8px"><span class="badge badge-soft">UniLink Firenze</span><span class="badge badge-green">Gratuito</span></div><h3>${esc(e.t)}</h3><div class="facts"><span>${icon("pin")} ${esc(e.dove)}</span><span>${icon("clock")} 18:00</span></div><p class="small" style="margin-top:6px">${esc(e.c)}</p></div>
            <div><button class="btn btn-sm ${on ? "btn-orange" : "btn-primary"}" data-rsvp="${e.id}">${on ? icon("check") + " Ci sei" : "Partecipa"}</button></div></article>`; }).join("")}</div>
          <p class="tiny muted" style="margin-top:12px">Eventi di esempio. Altri atenei e club locali sono una proposta: «Da decidere» → D19.</p>`;
      }
      return head("Community", "users", `Aula <span class="accent">studio</span>`, "Gruppi per esame e per appello, gratis: compagni con cui prepararlo, un ambassador che modera e le dispense UniLink come base comune.") + tabs + body
        + `<div class="card" style="margin-top:20px"><div class="card-head"><h3>${icon("info")} Come funziona</h3><span class="small muted">proposta P1 · approvata</span></div><div class="grid g-ov">
          ${[["Gratis per tutti", "I gruppi sono il motore della community, non un prodotto da vendere: entrare e creare un gruppo è gratuito."], ["Con Plus", "«Studia con altri»: il piano del gruppo con l'avanzamento di tutti e una sessione guidata a settimana."], ["Regole", "Solo materiali UniLink o vostri, niente slide dei professori. Moderazione degli ambassador, privacy dei profili."], ["Come misuriamo", "Iscritti per gruppo, attivi dopo 2 settimane, Appunti comprati. Se meno del 30% è attivo dopo 2 settimane, il gruppo si chiude."]].map(([t, d]) => `<div class="c-3"><b class="display" style="font-weight:400;color:var(--navy)">${t}</b><p class="small muted" style="margin-top:4px">${d}</p></div>`).join("")}</div></div>`;
    },
    mount(root, u) {
      const A = aula(u), save = (t) => { UL.store.save(); t && UL.ui.toast(t); UL.app.refresh(); };
      root.querySelectorAll("[data-v4plus]").forEach((b) => b.addEventListener("click", () => B.upsell(u, null, { plus: true })));
      root.querySelectorAll("[data-gentra]").forEach((b) => b.addEventListener("click", () => { A.gruppi.push(b.dataset.gentra); UL.store.addLog(u, "aula", "Entrato in un gruppo di studio"); save("Sei nel gruppo"); }));
      root.querySelectorAll("[data-gesci]").forEach((b) => b.addEventListener("click", () => { A.gruppi = A.gruppi.filter((x) => x !== b.dataset.gesci); save("Sei uscito dal gruppo"); }));
      root.querySelectorAll("[data-post]").forEach((f) => f.addEventListener("submit", (e) => { e.preventDefault(); const t = f.querySelector("input").value.trim(); if (!t) return; (A.post[f.dataset.post] = A.post[f.dataset.post] || []).push([u.profile.nome, t]); save(); }));
      root.querySelectorAll("[data-rsvp]").forEach((b) => b.addEventListener("click", () => { const i = A.rsvp.indexOf(b.dataset.rsvp); i < 0 ? A.rsvp.push(b.dataset.rsvp) : A.rsvp.splice(i, 1); save(i < 0 ? "Ti aspettiamo" : ""); }));
      const f = root.querySelector("[data-crea]");
      f && f.addEventListener("submit", (e) => { e.preventDefault(); const g = { id: "gu" + Date.now().toString(36), slug: f.slug.value, appello: f.appello.value, nome: `${B.course(f.slug.value).title} · gruppo di ${u.profile.nome}`, membri: 1, attivi: 1, amb: "", quando: f.quando.value.trim() };
        A.creati.push(g); A.gruppi.push(g.id); UL.store.addLog(u, "aula", "Creato un gruppo di studio"); save("Gruppo creato: invita i compagni"); });
    },
  };

  /* ---------- 2 · Mentor e ambassador ---------- */
  const TUT = { ora: 20, pacchetto: 54, ore: 3, quota: 0.75 };
  const AMBS = [["Lorenzo B.", "I anno EA · Microeconomia, Matematica"], ["Chiara D.", "II anno EA · Erasmus a Rotterdam"], ["Tommaso G.", "III anno EC · Statistica, magistrali"]];
  UL.views.mentoringU = {
    title: "Mentor e ambassador",
    render(u, params) {
      const tab = ["ambassador", "inviti"].includes(params[0]) ? params[0] : "tutoring";
      const tabs = `<div class="tabs"><a href="#/app/mentoring" class="${tab === "tutoring" ? "on" : ""}">${icon("users")} Tutoring 1-1</a><a href="#/app/mentoring/ambassador" class="${tab === "ambassador" ? "on" : ""}">${icon("shield")} Ambassador</a><a href="#/app/mentoring/inviti" class="${tab === "inviti" ? "on" : ""}">${icon("spark")} Invita un amico</a></div>`;
      let body = "";
      if (tab === "tutoring") {
        const bk = u.activity.bookings || [], M = (id) => B.MENTORS.find((m) => m.id === id) || {};
        body = `<p class="muted" style="margin-bottom:14px">Un'ora con uno studente che ha preso 30 in quell'esame, online o a Novoli. ${B.eur(TUT.ora)}/ora · pacchetto ${TUT.ore} ore ${B.eur(TUT.pacchetto)} · il ${Math.round(TUT.quota * 100)}% va al mentor. Prezzi: proposta P2.</p>
          <div class="mentor-grid">${B.MENTORS.map((m) => `<div class="mentor">
            <div class="top"><span class="avatar">${esc(m.n.split(" ").map((x) => x[0]).join(""))}</span><div><b class="display" style="font-weight:400;color:var(--navy)">${esc(m.n)}</b><div class="small muted">${esc(m.r)}</div></div></div>
            <div class="chips">${m.tags.map((t) => `<span class="chip chip-static">${esc(t)}</span>`).join("")}</div>
            <div class="row between"><span class="rate">★ ${m.rating.toFixed(1)} · ${m.rev} recensioni</span><b class="display" style="font-weight:400">${B.eur(TUT.ora)}/ora</b></div>
            <button class="btn btn-primary btn-sm" data-book="${m.id}">Prenota</button></div>`).join("")}</div>
          <section class="card" style="margin-top:20px"><div class="card-head"><h3>${icon("calendar")} Le mie sessioni</h3></div>
            <ul class="feed">${bk.map((b) => `<li><span class="ic">${icon("users")}</span><div>${esc(M(b.mentor).n || "Mentor")} — ${esc(b.topic)}<time>${fmtDate(b.when, true)} · ${B.eur(b.price)}</time></div></li>`).join("") || '<li class="small muted">Nessuna sessione prenotata.</li>'}</ul></section>
          <div class="card beige" style="margin-top:16px"><h3>Hai preso 30?</h3><p class="small" style="margin:6px 0 10px">Diventa mentor del tuo esame: scegli tu orari e luogo, il 75% di ogni sessione è tuo.</p><button class="btn btn-sm btn-orange" data-diventa="mentor">Candidati come mentor</button></div>`;
      } else if (tab === "ambassador") {
        body = `<div class="grid g-ov"><section class="card c-7"><div class="card-head"><h3>${icon("shield")} Cosa fa un ambassador</h3></div>
            <ul class="v4-task">${[["Modera i gruppi del suo anno", "Aula studio: accoglie, tiene il ritmo, toglie quello che non va."], ["Guida la sessione settimanale", "45 minuti sugli errori più comuni (con Plus)."], ["Raccoglie feedback", "Cosa manca nelle dispense, domande d'esame, richieste di nuovi esami."], ["Fa conoscere UniLink", "Nel gruppo WhatsApp dell'anno e del corso, con il suo codice."]].map(([t, d]) => `<li><span class="v4-cb">${icon("check")}</span><span>${esc(t)}<small>${esc(d)}</small></span></li>`).join("")}</ul>
            <p class="small" style="margin-top:12px">In cambio: crediti (proposta: 20% di quello che vendono gli inviti), formazione, priorità per diventare mentor. Niente soldi finché non c'è un soggetto legale.</p>
            ${u.activity.ambassador ? '<span class="badge badge-green" style="margin-top:10px">Candidatura inviata</span>' : `<button class="btn btn-orange" style="margin-top:12px" data-diventa="ambassador">Candidati come ambassador</button>`}</section>
          <section class="c-5 stack"><div class="card"><span class="sq-label">Gli ambassador di Economia (esempio)</span><ul class="feed" style="margin-top:8px">${AMBS.map(([n, r]) => `<li><span class="avatar">${esc(n[0])}</span><div><b class="display" style="font-weight:400">${esc(n)}</b><br><span class="small muted">${esc(r)}</span></div></li>`).join("")}</ul></div></section></div>`;
      } else {
        const R = (u.activity.referral = Object.assign({ code: "", invited: 0, confirmed: 0, credits: 0 }, u.activity.referral || {}));
        if (!R.code) { R.code = (u.profile.nome || "UL").toUpperCase().slice(0, 6) + "-" + Math.random().toString(36).slice(2, 5).toUpperCase(); UL.store.save(); }
        const regali = Math.min(UL.PIANI.gratis.regaloInvito, R.confirmed || 0);
        body = `<div class="grid g-ov"><section class="card navy c-7"><span class="badge badge-orange">Il tuo codice · sempre lo stesso</span><h2 style="margin:12px 0 6px;letter-spacing:.06em">${esc(R.code)}</h2>
            <p style="color:rgba(255,255,255,.78)">Quando un amico si iscrive con il tuo codice e conferma l'email, ricevi 1 Appunti gratis da scegliere (fino a ${UL.PIANI.gratis.regaloInvito} per account, proposta P2).</p>
            <div class="row" style="margin-top:16px"><button class="btn btn-white" data-copia>Copia il link d'invito</button><button class="btn btn-ghost" style="color:#fff;border-color:rgba(255,255,255,.4)" data-simula>Demo: un amico conferma</button></div></section>
          <section class="c-5 stack"><div class="stat"><span class="k">Amici invitati</span><span class="v">${R.invited || 0}</span><span class="s">${R.confirmed || 0} hanno confermato l'email</span></div>
            <div class="stat"><span class="k">Appunti gratis guadagnati</span><span class="v">${regali}</span><span class="s">${Math.max(0, B.gratisDisponibili(u))} da scegliere · <a href="#/app/materiali/catalogo">catalogo</a></span></div></section></div>`;
      }
      return head("Community", "users", `Mentor e <span class="accent">ambassador</span>`, "Tutoring uno a uno con chi ha preso 30, gli ambassador che animano i gruppi e gli inviti che ti regalano Appunti.") + tabs + body;
    },
    mount(root, u) {
      root.querySelectorAll("[data-book]").forEach((b) => b.addEventListener("click", () => {
        const m = B.MENTORS.find((x) => x.id === b.dataset.book), days = [2, 3, 5, 7].map((d) => new Date(Date.now() + d * 864e5));
        let slot = null, pac = false;
        const md = UL.ui.modal(`<div class="modal-head"><div><span class="sq-label">Prenota</span><h2 style="margin-top:8px">${esc(m.n)}</h2></div><button class="icon-btn" data-close>${icon("x")}</button></div>
          <div class="seg" style="margin-bottom:12px"><button class="on" data-pac="0">1 ora · ${B.eur(TUT.ora)}</button><button data-pac="1">Pacchetto ${TUT.ore} ore · ${B.eur(TUT.pacchetto)}</button></div>
          <div class="field"><label for="tp">Di cosa vuoi parlare?</label><input class="input" id="tp" placeholder="es. esercizi sul monopolio"></div>
          <p class="label" style="margin:16px 0 8px">Scegli il primo slot</p>
          <div class="slots">${days.flatMap((d) => ["17:00", "18:00"].map((h) => `<span class="chip" data-slot="${d.toISOString().slice(0, 10)}T${h}">${d.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" })} · ${h}</span>`)).join("")}</div>
          <div class="banner" style="margin:16px 0 0">${icon("lock")}<span>Pagamento simulato: nessun addebito reale. Il 75% va al mentor.</span></div>
          <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-primary" data-ok disabled>Conferma prenotazione</button></div>`, { width: 560 });
        md.el.querySelectorAll("[data-pac]").forEach((x) => x.addEventListener("click", () => { pac = x.dataset.pac === "1"; md.el.querySelectorAll("[data-pac]").forEach((y) => y.classList.toggle("on", y === x)); }));
        md.el.querySelectorAll("[data-slot]").forEach((s) => s.addEventListener("click", () => { md.el.querySelectorAll("[data-slot]").forEach((x) => x.classList.toggle("on", x === s)); slot = s.dataset.slot; md.el.querySelector("[data-ok]").disabled = false; }));
        md.el.querySelector("[data-ok]").addEventListener("click", () => {
          const prezzo = pac ? TUT.pacchetto : TUT.ora, topic = md.el.querySelector("#tp").value.trim() || "Sessione generale";
          u.activity.bookings.push({ id: "b" + Date.now().toString(36), mentor: m.id, topic: topic + (pac ? ` · pacchetto ${TUT.ore} ore` : ""), when: slot, price: prezzo, at: new Date().toISOString() });
          u.activity.purchases.push({ id: "o" + Date.now().toString(36), type: "mentor", label: `Tutoring con ${m.n}${pac ? ` · ${TUT.ore} ore` : ""}`, price: prezzo, listPrice: prezzo, coupon: "", at: new Date().toISOString() });
          UL.store.addLog(u, "mentor", `Prenotato tutoring con ${m.n}`); UL.store.save(); md.close(); UL.ui.toast("Sessione prenotata"); UL.app.refresh();
        });
      }));
      root.querySelectorAll("[data-diventa]").forEach((b) => b.addEventListener("click", () => {
        const cosa = b.dataset.diventa;
        const m = UL.ui.modal(`<div class="modal-head"><div><span class="sq-label">Candidatura</span><h2 style="margin-top:8px">${cosa === "mentor" ? "Diventa mentor" : "Diventa ambassador"}</h2></div><button class="icon-btn" data-close>${icon("x")}</button></div>
          <div class="field"><label for="cd-why">${cosa === "mentor" ? "Quale esame e con che voto?" : "Anno, corso e perché ti va"}</label><textarea class="textarea" id="cd-why" maxlength="500"></textarea></div>
          <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn btn-primary" data-ok>Invia candidatura</button></div>`, { width: 520 });
        m.el.querySelector("[data-ok]").addEventListener("click", () => { if (cosa === "ambassador") u.activity.ambassador = "inviata"; UL.store.addLog(u, "community", `Candidatura ${cosa}`); UL.store.save(); m.close(); UL.ui.toast("Candidatura inviata: ti scriviamo noi"); UL.app.refresh(); });
      }));
      const cp = root.querySelector("[data-copia]");
      cp && cp.addEventListener("click", () => { const t = "https://www.unilinkfirenze.it/?ref=" + u.activity.referral.code; try { navigator.clipboard.writeText(t); } catch (e) { /* noop */ } UL.ui.toast("Link copiato: " + t); });
      const sim = root.querySelector("[data-simula]");
      sim && sim.addEventListener("click", () => { const R = u.activity.referral; R.invited = (R.invited || 0) + 1; R.confirmed = (R.confirmed || 0) + 1; UL.store.save(); UL.ui.toast(B.gratisDisponibili(u) > 0 ? "Un amico ha confermato: hai 1 Appunti gratis da scegliere" : "Un amico ha confermato (regali già al massimo)"); UL.app.refresh(); });
    },
  };
})();
