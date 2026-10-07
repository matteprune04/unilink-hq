/* js/archivio/mentor.js — ARCHIVIATO il 7/10/2026 (meeting dei founder: «sezioni mentor/ambassador da togliere»,
   «tutoraggio a pagamento per ora messo da parte», «ambassador solo a commissione: 20%»).
   È la sezione «Mentor e ambassador» della web app v5–v6, spostata così com'era da js/views/v4-community.js
   (tutoring 1-1, vecchio programma ambassador, inviti con Appunti gratis). Al suo posto c'è «Ambassador» (v4-community.js).
   Non è più nella sidebar: si apre solo da Da decidere → Archivio (js/archivio/archivio.js). */
(function () {
  const UL = window.UL, B = UL.B, U = UL.U;
  const { icon, esc, fmtDate } = UL.ui;
  const head = (eyebrow, ic, title, lead, right) => `
    <div class="page-head"><div><div class="eyebrow">${icon(ic)} ${esc(eyebrow)}</div><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}</div>${right || ""}</div>`;

  /* ---------- 2 · Mentor e ambassador ---------- */
  const TUT = { ora: 20, pacchetto: 54, ore: 3, quota: 0.75 };
  const AMBS = [["Lorenzo B.", "I anno EA · Microeconomia, Matematica"], ["Chiara D.", "II anno EA · Erasmus a Rotterdam"], ["Tommaso G.", "III anno EC · Statistica, magistrali"]];
  UL.views.mentoringArch = {
    title: "Mentor e ambassador",
    render(u, params) {
      const tab = ["ambassador", "inviti"].includes(params[0]) ? params[0] : "tutoring";
      const tabs = `<div class="tabs"><a href="#/app/archivio/mentor" class="${tab === "tutoring" ? "on" : ""}">${icon("users")} Tutoring 1-1</a><a href="#/app/archivio/mentor/ambassador" class="${tab === "ambassador" ? "on" : ""}">${icon("shield")} Ambassador</a><a href="#/app/archivio/mentor/inviti" class="${tab === "inviti" ? "on" : ""}">${icon("spark")} Invita un amico</a></div>`;
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
          <div class="banner" style="margin:16px 0 0">${icon("lock")}<span>Si paga con Stripe (simulato nella demo, nessun addebito). Il 75% va al mentor.</span></div>
          <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-primary" data-ok disabled>Vai al pagamento</button></div>`, { width: 560 });
        md.el.querySelectorAll("[data-pac]").forEach((x) => x.addEventListener("click", () => { pac = x.dataset.pac === "1"; md.el.querySelectorAll("[data-pac]").forEach((y) => y.classList.toggle("on", y === x)); }));
        md.el.querySelectorAll("[data-slot]").forEach((s) => s.addEventListener("click", () => { md.el.querySelectorAll("[data-slot]").forEach((x) => x.classList.toggle("on", x === s)); slot = s.dataset.slot; md.el.querySelector("[data-ok]").disabled = false; }));
        md.el.querySelector("[data-ok]").addEventListener("click", () => {
          const prezzo = pac ? TUT.pacchetto : TUT.ora, topic = md.el.querySelector("#tp").value.trim() || "Sessione generale";
          md.close();
          const registra = () => { u.activity.bookings.push({ id: "b" + Date.now().toString(36), mentor: m.id, topic: topic + (pac ? ` · pacchetto ${TUT.ore} ore` : ""), when: slot, price: prezzo, at: new Date().toISOString() });
          u.activity.purchases.push({ id: "o" + Date.now().toString(36), type: "mentor", label: `Tutoring con ${m.n}${pac ? ` · ${TUT.ore} ore` : ""}`, price: prezzo, listPrice: prezzo, coupon: "", at: new Date().toISOString() });
          UL.store.addLog(u, "mentor", `Prenotato tutoring con ${m.n}`); UL.store.save(); };
          const fine = () => { UL.ui.toast("Sessione prenotata"); UL.app.refresh(); };
          if (!window.UL_CHECKOUT) { registra(); return fine(); }
          window.UL_CHECKOUT.apri({ voci: [{ id: "tutoring:" + m.id, nome: `Tutoring con ${m.n}`, nota: (pac ? `pacchetto ${TUT.ore} ore · ` : "1 ora · ") + topic, prezzo }], email: u.email, cosa: `Sessione con ${m.n} (${fmtDate(slot, true)})`, dove: "webapp", dopo: "Torna alle sessioni", onPagato: registra, onFatto: fine });
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
