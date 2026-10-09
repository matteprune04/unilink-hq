/* js/views/v4-community.js — web app v4 · gruppo «Community» (sezioni promosse dai moduli C e D, commento del 7/10).
   1 Aula studio (P1): gruppi per esame e per appello, gratuiti, moderati dagli ambassador, con i materiali UniLink come base.
     Con Plus: «Studia con altri» = il piano del gruppo con l'avanzamento di tutti e una sessione settimanale guidata da un
     ambassador che ha preso 28 o più. Eventi (dai moduli Club ed Eventi): ripassi guidati prima degli appelli.
   2 Ambassador (v7, decisione del 7/10): solo a commissione, il 20% degli acquisti fatti con il proprio codice, nessun accesso
     gratuito. La vecchia sezione «Mentor e ambassador» (tutoring 1-1, inviti con Appunti gratis) è in js/archivio/mentor.js.
   Stessa regola di tutta l'app: le parti incluse nel piano si usano, le altre si vedono con il lucchetto (U.lock).
   Dati: activity.aula { gruppi[], creati[], post{}, rsvp[] } · activity.referral · activity.ambassador */
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

  /* ---------- 2 · Ambassador (v7, decisione del 7/10): solo a commissione ----------
     Il 20% degli acquisti fatti con il codice dell'ambassador è suo. Nessun accesso gratuito alla piattaforma.
     Ogni studente ha il suo codice d'invito; diventa una commissione solo se è ambassador (candidatura approvata dal team).
     Cosa ricevono gli altri studenti per un invito non è deciso: card L27 della landing (Founder → Da decidere).
     Dati: activity.referral { code, invited, confirmed, vendite: [{ cosa, prezzo, at }] } · activity.ambassador ("" | "inviata" | "attivo") */
  const COMM = 0.2;
  const VENDITE_DEMO = [["Dispensa completa · Microeconomia", 12.99], ["Pacchetto semestre · I anno, II semestre", 29.99], ["Simulazione d'esame · Statistica", 5.99]];
  UL.views.ambassadorU = {
    title: "Ambassador",
    render(u, params) {
      const tab = params[0] === "codice" ? "codice" : "programma";
      const R = (u.activity.referral = Object.assign({ code: "", invited: 0, confirmed: 0, vendite: [] }, u.activity.referral || {}));
      if (!R.code) { R.code = (u.profile.nome || "UL").toUpperCase().slice(0, 6) + "-" + Math.random().toString(36).slice(2, 5).toUpperCase(); UL.store.save(); }
      R.vendite = R.vendite || [];
      const amb = u.activity.ambassador === "attivo", tot = R.vendite.reduce((n, v) => n + v.prezzo, 0);
      const tabs = `<div class="tabs"><a href="#/app/ambassador" class="${tab === "programma" ? "on" : ""}">${icon("shield")} Il programma</a><a href="#/app/ambassador/codice" class="${tab === "codice" ? "on" : ""}">${icon("spark")} Il tuo codice</a></div>`;
      const body = tab === "programma"
        ? `<div class="grid g-ov"><section class="card c-7"><div class="card-head"><h3>${icon("shield")} Come funziona</h3><span class="badge badge-green">Deciso il 7/10</span></div>
            <ul class="v4-task">${[["Hai un codice tuo", "Lo condividi nel tuo anno, nel gruppo WhatsApp, con chi prepara i tuoi esami."], ["Il 20% di ogni acquisto è tuo", "Su tutto quello che compra chi usa il tuo codice: simulazioni, dispense, pacchetti."], ["Vedi tutto qui", "Iscritti, acquisti e commissione maturata, aggiornati a ogni vendita."], ["Ci dici cosa manca", "Esami scoperti, errori nelle dispense, domande che tornano agli appelli."]].map(([t, d], i) => `<li><span class="v4-cb" aria-hidden="true">${i + 1}</span><span>${esc(t)}<small>${esc(d)}</small></span></li>`).join("")}</ul>
            <p class="small" style="margin-top:12px">Solo commissione: essere ambassador non dà accesso gratuito ai materiali. I pagamenti delle commissioni partono quando UniLink avrà un soggetto legale.</p>
            ${u.activity.ambassador ? `<span class="badge ${amb ? "badge-green" : "badge-yellow"}" style="margin-top:10px">${amb ? "Sei ambassador" : "Candidatura inviata"}</span>${amb ? "" : ' <button class="btn btn-sm btn-ghost" style="margin-top:10px" data-approva>Demo: il team approva</button>'}` : `<button class="btn btn-orange" style="margin-top:12px" data-candidati>Candidati come ambassador</button>`}</section>
          <section class="c-5 stack"><div class="card navy"><span class="badge badge-orange">Esempio</span><h3 style="margin:10px 0 6px;color:#fff">10 amici, una dispensa a testa</h3>
            <p style="color:rgba(255,255,255,.78)">10 × ${B.eur(B.prezzo("completa"))} = ${B.eur(10 * B.prezzo("completa"))} di acquisti → ${B.eur(Math.round(10 * B.prezzo("completa") * COMM * 100) / 100)} per te.</p></div>
            <div class="card beige"><h3>Per chi non è ambassador</h3><p class="small" style="margin-top:6px">Anche tu hai un codice d'invito. Cosa ricevi quando lo usa un amico non è ancora deciso: è una delle proposte per il lancio.</p></div></section></div>`
        : `<div class="grid g-ov"><section class="card navy c-7"><span class="badge badge-orange">Il tuo codice · sempre lo stesso</span><h2 style="margin:12px 0 6px;letter-spacing:.06em">${esc(R.code)}</h2>
            <p style="color:rgba(255,255,255,.78)">${amb ? `Il ${Math.round(COMM * 100)}% di quello che compra chi usa il tuo codice è tuo.` : "Condividilo con chi prepara i tuoi esami. Se diventi ambassador, ogni acquisto con il tuo codice ti dà il 20%."}</p>
            <div class="row" style="margin-top:16px"><button class="btn btn-white" data-copia>Copia il link d'invito</button>${amb ? `<button class="btn btn-ghost" style="color:#fff;border-color:rgba(255,255,255,.4)" data-vendita>Demo: un amico compra</button>` : ""}</div></section>
          <section class="c-5 stack"><div class="stat"><span class="k">Iscritti con il tuo codice</span><span class="v">${R.confirmed || 0}</span><span class="s">${R.invited || 0} inviti mandati</span></div>
            <div class="stat"><span class="k">Commissione maturata</span><span class="v">${amb ? B.eur(Math.round(tot * COMM * 100) / 100) : "—"}</span><span class="s">${amb ? `${R.vendite.length} acquisti · ${B.eur(tot)} in tutto` : "solo per gli ambassador"}</span></div></section>
          ${amb && R.vendite.length ? `<section class="card c-12"><div class="card-head"><h3>${icon("euro")} Acquisti con il tuo codice</h3></div><div class="table-wrap"><table class="table"><thead><tr><th>Cosa</th><th>Prezzo</th><th>Tua commissione</th><th>Quando</th></tr></thead><tbody>${R.vendite.map((v) => `<tr><td>${esc(v.cosa)}</td><td>${B.eur(v.prezzo)}</td><td>${B.eur(Math.round(v.prezzo * COMM * 100) / 100)}</td><td class="small muted">${fmtDate(v.at)}</td></tr>`).join("")}</tbody></table></div></section>` : ""}</div>`;
      return head("Community", "shield", `<span class="accent">Ambassador</span>`, "Il 20% degli acquisti fatti con il tuo codice, senza accesso gratuito: è la regola decisa dai founder il 7/10.") + tabs + body;
    },
    mount(root, u) {
      const cand = root.querySelector("[data-candidati]");
      cand && cand.addEventListener("click", () => {
        const m = UL.ui.modal(`<div class="modal-head"><div><span class="sq-label">Candidatura</span><h2 style="margin-top:8px">Diventa ambassador</h2></div><button class="icon-btn" data-close aria-label="Chiudi">${icon("x")}</button></div>
          <div class="field"><label for="cd-why">Anno, corso e perché ti va</label><textarea class="textarea" id="cd-why" maxlength="500"></textarea></div>
          <p class="tiny muted">Il team ti risponde su WhatsApp. Solo commissione (20%), nessun accesso gratuito.</p>
          <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn btn-primary" data-ok>Invia candidatura</button></div>`, { width: 520 });
        m.el.querySelector("[data-ok]").addEventListener("click", () => { u.activity.ambassador = "inviata"; UL.store.addLog(u, "community", "Candidatura ambassador"); UL.store.save(); m.close(); UL.ui.toast("Candidatura inviata: ti scriviamo noi"); UL.app.refresh(); });
      });
      const ok = root.querySelector("[data-approva]");
      ok && ok.addEventListener("click", () => { u.activity.ambassador = "attivo"; UL.store.save(); UL.ui.toast("Sei ambassador (demo)"); UL.app.refresh(); });
      const cp = root.querySelector("[data-copia]");
      cp && cp.addEventListener("click", () => { const t = "https://www.unilinkfirenze.it/?ref=" + u.activity.referral.code; try { navigator.clipboard.writeText(t); } catch (e) { /* noop */ } UL.ui.toast("Link copiato: " + t); });
      const v = root.querySelector("[data-vendita]");
      v && v.addEventListener("click", () => { const R = u.activity.referral, x = VENDITE_DEMO[R.vendite.length % VENDITE_DEMO.length]; R.confirmed = (R.confirmed || 0) + 1; R.invited = Math.max(R.invited || 0, R.confirmed); R.vendite.push({ cosa: x[0], prezzo: x[1], at: new Date().toISOString() }); UL.store.save(); UL.ui.toast(`+ ${B.eur(Math.round(x[1] * COMM * 100) / 100)} di commissione (demo)`); UL.app.refresh(); });
    },
  };
})();
