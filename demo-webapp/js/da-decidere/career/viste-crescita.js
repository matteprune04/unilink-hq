/* career · viste-crescita.js
   Modulo Career · VISTE trackC (rotta track), mentorC (mentor), masterC (master), adminC (cockpit, solo admin).
   Architettura: career/core.js. */
/* Variante C — Track, Mentor, Master + Business cockpit (admin) */
(function () {
  const UL = window.UL;
  const C = UL.C;
  const D = window.UL_C;
  const { icon, esc, fmtDate, num } = UL.ui;
  const head = (eyebrow, ic, title, lead) => `<div class="page-head"><div><div class="eyebrow">${icon(ic)} ${esc(eyebrow)}</div><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}</div></div>`;
  const payModal = (title, price, note, onOk) => {
    const m = UL.ui.modal(`<div class="modal-head"><div><span class="sq-label">Conferma</span><h2 style="margin-top:8px">${esc(title)}</h2></div><button class="icon-btn" data-close>${icon("x")}</button></div>
      <p>${note}</p><div class="row between" style="margin-top:16px"><span class="label">Totale</span><b class="display" style="font-size:30px;color:var(--navy);font-weight:400">${C.eur(price)}</b></div>
      <div class="banner" style="margin:14px 0 0">${icon("lock")}<span>Pagamento simulato: nessun dato di carta, nessun addebito.</span></div>
      <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-ghost" data-close>Annulla</button><button class="btn btn-orange" data-ok>Conferma</button></div>`, { width: 520 });
    m.el.querySelector("[data-ok]").addEventListener("click", () => { onOk(); m.close(); });
  };

  /* ---------------- TRACK ---------------- */
  UL.views.trackC = {
    title: "Track",
    render(u) {
      const mine = u.activity.tracks;
      return `
      ${head("Track", "layers", 'Percorsi a <span class="accent">numero chiuso</span>', "Poche settimane, un obiettivo preciso, mentor che ci sono già passati. Gli iscritti Plus hanno il 10% di sconto e la priorità sui posti.")}
      ${mine.length ? `<section class="card" style="margin-bottom:20px"><div class="card-head"><h3>${icon("check")} I tuoi Track</h3></div>
        <div class="grid g-ov">${mine.map((t) => { const T = C.track(t.id); const pct = Math.round((t.done.length / T.mods.length) * 100); return `<div class="c-6"><div class="row between"><b class="display" style="color:var(--navy)">${esc(T.t)}</b><span class="display" style="color:var(--orange)">${pct}%</span></div>
          <div class="progress" style="margin:8px 0 12px"><i style="width:${pct}%"></i></div>
          ${T.mods.map((m, i) => `<label class="check" style="padding:7px 0"><input type="checkbox" data-mod="${t.id}|${i}" ${t.done.includes(i) ? "checked" : ""}><span class="small">${esc(m)}</span></label>`).join("")}</div>`; }).join("")}</div></section>` : ""}
      <div class="pricing three">${D.tracks.map((t) => {
        const enrolled = mine.some((x) => x.id === t.id);
        const price = C.isPlus(u) ? Math.round(t.price * 0.9) : t.price;
        return `<div class="plan ${t.id === "msc" ? "hot" : ""}" data-hot="Più richiesto">
          <span class="ic" style="width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--cream);color:var(--navy)">${icon(t.i)}</span>
          <h3>${esc(t.t)}</h3><p class="small muted">${esc(t.sub)}</p>
          <div class="price">${C.eur(price)}${C.isPlus(u) ? ` <small><s>${C.eur(t.price)}</s></small>` : ""}</div>
          <p class="small">${t.weeks} settimane · inizio ${fmtDate(C.inDays(t.start).toISOString())} · <b>${t.left} posti su ${t.seats}</b></p>
          <ul>${t.mods.map((m) => `<li>${icon("check")}${esc(m)}</li>`).join("")}</ul>
          ${enrolled ? '<span class="badge badge-green">Iscritto</span>' : `<button class="btn btn-primary" data-enroll="${t.id}">Iscriviti</button>`}</div>`;
      }).join("")}</div>`;
    },
    mount(root, u) {
      root.querySelectorAll("[data-enroll]").forEach((b) => b.addEventListener("click", () => {
        const t = C.track(b.dataset.enroll);
        const price = C.isPlus(u) ? Math.round(t.price * 0.9) : t.price;
        payModal(t.t, price, `${t.weeks} settimane, inizio il ${fmtDate(C.inDays(t.start).toISOString())}.`, () => {
          u.activity.tracks.push({ id: t.id, at: new Date().toISOString(), done: [], price });
          UL.store.addLog(u, "track", `Iscrizione — ${t.t}`);
          UL.store.save(); UL.ui.toast("Iscrizione confermata"); UL.app.refresh();
        });
      }));
      root.querySelectorAll("[data-mod]").forEach((c) => c.addEventListener("change", () => {
        const [id, i] = c.dataset.mod.split("|");
        const t = u.activity.tracks.find((x) => x.id === id);
        const k = Number(i);
        c.checked ? t.done.includes(k) || t.done.push(k) : t.done.splice(t.done.indexOf(k), 1);
        UL.store.save(); UL.app.refresh();
      }));
    },
  };

  /* ---------------- MENTOR ---------------- */
  let cat = "Tutti";
  const EARN = { price: 45, sessions: 6 };
  UL.views.mentorC = {
    title: "Mentor",
    render(u) {
      const cats = ["Tutti", ...new Set(D.mentors.map((m) => m.cat))];
      const list = D.mentors.filter((m) => cat === "Tutti" || m.cat === cat);
      return `
      ${head("Mentor", "users", 'Chi ci è <span class="accent">già passato</span>', "Studenti ed ex studenti UNIFI. Fissano il proprio prezzo; UniLink trattiene il 25%.")}
      <div class="seg" data-cat style="margin-bottom:18px">${cats.map((c) => `<button class="${c === cat ? "on" : ""}" data-v="${c}">${c}</button>`).join("")}</div>
      <div class="mentor-grid">${list.map((m) => `<div class="mentor">
        <div class="top"><span class="avatar">${esc(m.n.split(" ").map((x) => x[0]).join(""))}</span><div><b class="display" style="font-weight:400;color:var(--navy)">${esc(m.n)}</b><div class="small muted">${esc(m.r)}</div></div></div>
        <div class="row between"><span class="badge badge-soft">${esc(m.cat)}</span><span class="rate">★ ${m.rating.toFixed(1)} · ${m.rev}</span></div>
        <div class="row between"><b class="display" style="font-weight:400;font-size:20px">${C.eur(m.price)} <span class="small muted">/ 45 min</span></b><button class="btn btn-primary btn-sm" data-book="${m.id}">Prenota</button></div></div>`).join("")}</div>
      <div class="grid g-ov" style="margin-top:20px">
        <section class="card c-6"><div class="card-head"><h3>${icon("calendar")} Le mie sessioni</h3></div>
          <ul class="feed">${u.activity.bookings.map((b) => `<li><span class="ic">${icon("users")}</span><div>${esc(C.mentor(b.mentor).n)} — ${esc(b.topic)}<time>${fmtDate(b.when, true)} · ${C.eur(b.price)}</time></div></li>`).join("") || '<li class="small muted">Nessuna sessione.</li>'}</ul></section>
        <section class="card beige c-6"><div class="card-head"><h3>${icon("spark")} Diventa mentor</h3></div>
          <p class="small" style="margin-bottom:12px">Hai superato l'esame, fatto Erasmus o sei entrato in un master? Quanto potresti guadagnare al mese:</p>
          <div class="slider-row"><span>Prezzo a sessione</span><input type="range" min="20" max="100" step="5" value="${EARN.price}" data-earn="price" aria-label="Prezzo a sessione"><b data-eo="price">${C.eur(EARN.price)}</b></div>
          <div class="slider-row"><span>Sessioni al mese</span><input type="range" min="1" max="30" step="1" value="${EARN.sessions}" data-earn="sessions" aria-label="Sessioni al mese"><b data-eo="sessions">${EARN.sessions}</b></div>
          <div class="row between" style="margin-top:12px"><span class="label">Guadagno netto al mese (75%)</span><b class="display" style="font-size:28px;color:var(--green);font-weight:400" data-earnout>${C.eur(EARN.price * EARN.sessions * 0.75)}</b></div></section>
      </div>
      <p class="tiny muted" style="margin-top:10px">Mentor di esempio.</p>`;
    },
    mount(root, u) {
      root.querySelectorAll("[data-cat] button").forEach((b) => b.addEventListener("click", () => { cat = b.dataset.v; UL.app.refresh(); }));
      root.querySelectorAll("[data-earn]").forEach((r) => r.addEventListener("input", () => {
        EARN[r.dataset.earn] = Number(r.value);
        root.querySelector('[data-eo="price"]').textContent = C.eur(EARN.price);
        root.querySelector('[data-eo="sessions"]').textContent = EARN.sessions;
        root.querySelector("[data-earnout]").textContent = C.eur(EARN.price * EARN.sessions * 0.75);
      }));
      root.querySelectorAll("[data-book]").forEach((b) => b.addEventListener("click", () => {
        const m = C.mentor(b.dataset.book);
        const when = C.inDays(3).toISOString().slice(0, 10) + "T18:00";
        payModal(`Sessione con ${m.n}`, m.price, `45 minuti, ${fmtDate(when, true)} (primo slot libero).`, () => {
          u.activity.bookings.push({ id: "b" + Date.now().toString(36), mentor: m.id, when, price: m.price, topic: m.cat });
          UL.store.addLog(u, "mentor", `Prenotata sessione con ${m.n}`);
          UL.store.save(); UL.ui.toast("Sessione prenotata"); UL.app.refresh();
        });
      }));
    },
  };

  /* ---------------- MASTER ---------------- */
  UL.views.masterC = {
    title: "Master",
    render(u) {
      const { st, list } = UL.reco.recommend(u, { diversify: true });
      const sl = u.activity.shortlist;
      return `
      ${head("Master", "cap", 'Il tuo <span class="accent">master</span>', "I 163 programmi del tool UniLink, ordinati sul tuo profilo. Shortlist, candidature e un Track per prepararle.")}
      <div class="grid g-ov" style="margin-bottom:20px">
        <section class="card c-4"><div class="card-head"><h3>${icon("chart")} Forza del profilo</h3></div>
          <div class="ring" style="width:120px;height:120px;margin:0 auto">${UL.ui.ring(st.total, 120, 10)}<div class="lbl"><div><b style="font-size:30px">${st.total}</b><span>/100</span></div></div></div>
          <p class="small muted" style="margin-top:12px;text-align:center">Media, test, inglese, esperienze.</p></section>
        <section class="card c-4"><div class="card-head"><h3>${icon("bookmark")} Shortlist</h3><span class="display" style="color:var(--orange);font-size:22px">${sl.length}</span></div>
          <ul class="feed">${sl.slice(0, 4).map((s) => { const p = UL_PROGRAMMI.find((x) => x.id === s.pid); return p ? `<li><span class="ic">${icon("cap")}</span><div>${esc(p.program)}<time>${esc(p.school)}</time></div></li>` : ""; }).join("") || '<li class="small muted">Salva i programmi che ti interessano.</li>'}</ul></section>
        <section class="card navy c-4"><span class="badge badge-orange">MSc Track</span><h3 style="margin:10px 0 6px">Candidature con un mentor ammesso</h3><p class="small" style="color:rgba(255,255,255,.75)">10 settimane: scelta dei programmi, GMAT, CV, motivation letter e mock interview.</p><a class="btn btn-white btn-sm" style="margin-top:14px" href="#/app/track">Scopri il Track</a></section>
      </div>
      <div class="card beige" style="margin-bottom:16px"><div class="row between"><div><span class="sponsored">SPONSORIZZATO</span><h3 style="margin-top:6px">Info session: MSc in Finance (business school partner)</h3><p class="small muted">Online · tra 9 giorni · 18:30</p></div><a class="btn btn-sm btn-primary" href="#/app/eventi">Iscriviti</a></div></div>
      <div class="prog-list" data-progs>${list.slice(0, 8).map((r) => UL.ui.progCard(r, u)).join("")}</div>`;
    },
    mount(root, u) {
      root.querySelector("[data-progs]").addEventListener("click", (e) => {
        const b = e.target.closest('[data-act="short"]');
        if (!b) return;
        const on = UL.store.toggleShortlist(u, b.closest("[data-pid]").dataset.pid);
        UL.ui.toast(on ? "Aggiunto alla shortlist" : "Rimosso dalla shortlist");
        UL.app.refresh();
      });
    },
  };

  /* ---------------- BUSINESS COCKPIT (admin) ---------------- */
  const M = { cities: 6, perCity: 1200, plus: 6, track: 15, mentor: 120, partners: 6, schools: 3, team: 30000 };
  function model() {
    const cities = [1, Math.round((1 + M.cities) / 2), M.cities];
    const ramp = [0.6, 0.85, 1];
    return cities.map((ci, y) => {
      const st = Math.round(ci * M.perCity * ramp[y]);
      const r = {
        Plus: st * (M.plus / 100) * D.PLUS.semestre * 2,
        Track: (st / 1000) * M.track * 260,
        "Mentor (commissione)": (st / 1000) * M.mentor * 48 * D.TAKE_RATE,
        Aziende: ci * M.partners * 3500 * ramp[y],
        "Business school": ci * M.schools * 2000 * ramp[y],
        Affiliazioni: st * 1.5,
      };
      const rev = Object.values(r).reduce((a, b) => a + b, 0);
      const b2c = r.Plus + r.Track;
      const cost = M.team + ci * 18000 + r.Plus * 0.3 + r.Track * 0.45 + ci * 5000 + 6000 + ci * 1000 + b2c * 0.02;
      return { y: y + 1, ci, st, r, rev, cost, ebitda: rev - cost };
    });
  }
  function modelHtml() {
    const Y = model();
    const keys = Object.keys(Y[0].r);
    const max = Math.max(...Y.map((y) => y.rev), 1);
    return `
      <div class="table-wrap"><table class="table"><thead><tr><th></th>${Y.map((y) => `<th class="num">Anno ${y.y}</th>`).join("")}</tr></thead>
        <tbody>
          <tr><td>Città attive</td>${Y.map((y) => `<td class="num">${y.ci}</td>`).join("")}</tr>
          <tr><td>Studenti attivi</td>${Y.map((y) => `<td class="num">${y.st.toLocaleString("it-IT")}</td>`).join("")}</tr>
          ${keys.map((k) => `<tr><td>${k}</td>${Y.map((y) => `<td class="num">${C.eur(Math.round(y.r[k]))}</td>`).join("")}</tr>`).join("")}
          <tr><td><b>Ricavi totali</b></td>${Y.map((y) => `<td class="num"><b>${C.eur(Math.round(y.rev))}</b></td>`).join("")}</tr>
          <tr><td>Costi</td>${Y.map((y) => `<td class="num">${C.eur(Math.round(y.cost))}</td>`).join("")}</tr>
          <tr><td><b>EBITDA</b></td>${Y.map((y) => `<td class="num"><b style="color:${y.ebitda >= 0 ? "var(--green)" : "var(--red)"}">${C.eur(Math.round(y.ebitda))}</b></td>`).join("")}</tr>
          <tr><td>Quota B2B (aziende + scuole)</td>${Y.map((y) => `<td class="num">${Math.round(((y.r.Aziende + y.r["Business school"]) / y.rev) * 100)}%</td>`).join("")}</tr>
        </tbody></table></div>
      <p class="label" style="margin:18px 0 10px">Ricavi totali per anno</p>
      <div class="hbars">${Y.map((y) => `<div class="hbar"><span class="lab">Anno ${y.y} · ${y.ci} città</span><span class="trk"><i style="width:${(y.rev / max) * 100}%"></i></span><span class="val">${Math.round(y.rev / 1000)}k</span><span class="tip">Anno ${y.y}: ${C.eur(Math.round(y.rev))}</span></div>`).join("")}</div>`;
  }
  const SL = [["cities", "Città attive al 3° anno", 1, 15, 1, (v) => v], ["perCity", "Studenti attivi per città (a regime)", 300, 4000, 100, (v) => v.toLocaleString("it-IT")], ["plus", "Conversione a Plus", 1, 20, 1, (v) => v + "%"], ["track", "Iscritti ai Track ogni 1.000 studenti", 0, 60, 1, (v) => v], ["mentor", "Sessioni mentor ogni 1.000 studenti", 0, 400, 10, (v) => v], ["partners", "Aziende partner per città", 0, 20, 1, (v) => v], ["schools", "Business school per città", 0, 10, 1, (v) => v], ["team", "Team centrale (€/anno)", 0, 120000, 5000, (v) => C.eur(v)]];

  UL.views.adminC = {
    title: "Business cockpit",
    render() {
      const users = UL.store.allUsers().filter((u) => u.role !== "admin");
      const pipe = C.pipeline();
      const plus = users.filter((u) => u.activity.plus.active);
      const tracks = users.flatMap((u) => u.activity.tracks.map((t) => ({ u, t })));
      const books = users.flatMap((u) => u.activity.bookings);
      const visible = users.filter((u) => u.activity.talent.visible);
      const apps = users.flatMap((u) => u.activity.applications);
      const won = (k) => pipe.filter((p) => p.st === "won" && p.k === k).reduce((s, p) => s + p.v, 0);
      const mix = [
        { l: "Plus (annualizzato)", v: plus.length * D.PLUS.semestre * 2 },
        { l: "Track", v: tracks.reduce((s, x) => s + (x.t.price || C.track(x.t.id).price), 0) },
        { l: "Mentor (commissione 25%)", v: books.reduce((s, b) => s + b.price, 0) * D.TAKE_RATE },
        { l: "Aziende (contratti firmati)", v: won("Azienda") },
        { l: "Business school", v: won("Business school") },
        { l: "Affiliazioni (stima)", v: users.length * 1.5 },
      ];
      const tot = mix.reduce((s, m) => s + m.v, 0);
      const mmax = Math.max(...mix.map((m) => m.v), 1);
      const areas = {};
      visible.forEach((u) => (u.profile.areeProf || []).slice(0, 1).forEach((a) => (areas[a] = (areas[a] || 0) + 1)));
      const amax = Math.max(1, ...Object.values(areas));
      const W = { lead: 0.1, prop: 0.5, won: 1 };
      const weighted = pipe.reduce((s, p) => s + p.v * W[p.st], 0);
      return `
      ${head("Team UniLink", "shield", 'Business <span class="accent">cockpit</span>', "Ricavi per fonte, pipeline commerciale, talent pool e un modello a tre anni con ipotesi modificabili.")}
      <div class="kpi-row" style="margin-bottom:20px">
        <div class="stat"><span class="k">Studenti iscritti</span><span class="v">${users.length}</span></div>
        <div class="stat"><span class="k">Plus attivi</span><span class="v">${plus.length}</span><span class="s">${users.length ? Math.round((plus.length / users.length) * 100) : 0}% di conversione</span></div>
        <div class="stat"><span class="k">Iscrizioni ai Track</span><span class="v">${tracks.length}</span></div>
        <div class="stat"><span class="k">Talent pool visibile</span><span class="v">${visible.length}</span><span class="s">${apps.length} candidature inviate</span></div>
        <div class="stat"><span class="k">Pipeline ponderata</span><span class="v">${C.eur(Math.round(weighted))}</span></div>
      </div>
      <div class="grid g-ov">
        <section class="card c-6"><div class="card-head"><h3>${icon("euro")} Ricavi per fonte</h3><b class="display" style="font-weight:400;color:var(--navy)">${C.eur(Math.round(tot))}</b></div>
          <div class="hbars">${mix.map((m) => `<div class="hbar"><span class="lab">${m.l}</span><span class="trk"><i style="width:${(m.v / mmax) * 100}%"></i></span><span class="val">${Math.round(m.v)}</span><span class="tip">${m.l}: ${C.eur(Math.round(m.v))}</span></div>`).join("")}</div>
          <p class="tiny muted" style="margin-top:10px">Dati demo: account di esempio e contratti firmati nella pipeline qui a fianco.</p></section>
        <section class="card c-6"><div class="card-head"><h3>${icon("users")} Talent pool per area</h3></div>
          <div class="hbars">${Object.entries(areas).sort((a, b) => b[1] - a[1]).map(([a, v]) => `<div class="hbar"><span class="lab">${esc(a)}</span><span class="trk"><i style="width:${(v / amax) * 100}%"></i></span><span class="val">${v}</span><span class="tip">${esc(a)}: ${v} profili visibili</span></div>`).join("") || '<p class="small muted">Nessun profilo visibile.</p>'}</div>
          <p class="tiny muted" style="margin-top:10px">Solo studenti che hanno scelto di rendere visibile il profilo. È ciò che le aziende partner pagano.</p></section>
        <section class="card c-12"><div class="card-head"><h3>${icon("brief")} Pipeline aziende e business school</h3><span class="small muted">lead 10% · proposta 50% · firmato 100%</span></div>
          <div class="table-wrap"><table class="table"><thead><tr><th>Cliente</th><th>Tipo</th><th>Prodotto</th><th class="num">Valore</th><th>Stato</th></tr></thead>
          <tbody>${pipe.map((p) => `<tr><td><b class="display" style="font-weight:400;color:var(--navy)">${esc(p.n)}</b></td><td class="small">${esc(p.k)}</td><td class="small">${esc(p.plan)}</td><td class="num">${C.eur(p.v)}</td>
            <td><select class="select" data-pipe="${p.id}" style="min-height:34px;padding:4px 10px;width:auto">${[["lead", "Lead"], ["prop", "Proposta"], ["won", "Firmato"]].map(([k, l]) => `<option value="${k}" ${p.st === k ? "selected" : ""}>${l}</option>`).join("")}</select></td></tr>`).join("")}</tbody></table></div>
          <p class="tiny muted" style="margin-top:10px">Clienti di esempio (fittizi).</p></section>
        <section class="card c-12"><div class="card-head"><h3>${icon("euro")} Listino B2B</h3><span class="small muted">ipotesi da validare</span></div>
          <div class="table-wrap"><table class="table"><thead><tr><th>Cliente</th><th>Prodotto</th><th class="num">Prezzo</th><th>Cosa include</th></tr></thead><tbody>
            <tr><td>Azienda</td><td>Annuncio singolo</td><td class="num">${C.eur(290)}</td><td class="small">Stage o graduate program per 60 giorni, candidature con profilo UniLink</td></tr>
            <tr><td>Azienda</td><td>Partner annuale</td><td class="num">${C.eur(4900)}</td><td class="small">Annunci illimitati, talent pool con consenso, un evento, badge partner</td></tr>
            <tr><td>Azienda</td><td>Case competition</td><td class="num">${C.eur(2500)}</td><td class="small">Caso reale, squadre di studenti, shortlist dei migliori profili</td></tr>
            <tr><td>Business school</td><td>Info session</td><td class="num">${C.eur(1500)}</td><td class="small">Promozione alla community e agli iscritti al MSc Track</td></tr>
            <tr><td>Business school</td><td>Contatto con consenso</td><td class="num">${C.eur(40)}</td><td class="small">Solo studenti che chiedono di essere ricontattati</td></tr>
            <tr><td>Business school</td><td>Report annuale</td><td class="num">${C.eur(900)}</td><td class="small">Preferenze aggregate e anonime per area e paese</td></tr>
          </tbody></table></div></section>
        <section class="card c-12"><div class="card-head"><h3>${icon("calc")} Modello a 3 anni</h3><span class="small muted">ipotesi modificabili</span></div>
          <div class="grid g-ov"><div class="c-5 stack" style="gap:12px">${SL.map(([k, l, a, b, s]) => `<div class="slider-row"><span>${l}</span><input type="range" min="${a}" max="${b}" step="${s}" value="${M[k]}" data-m="${k}" aria-label="${l}"><b data-mo="${k}"></b></div>`).join("")}
            <p class="tiny muted">Prezzi medi: Plus ${C.eur(D.PLUS.semestre)}/semestre, Track €260, sessione mentor €48 (commissione 25%), partner €3.500 e business school €2.000 per anno. Costi: team centrale (slider) + €18k per città (referente e ambassador), autori 30% di Plus, erogazione Track 45%, marketing €5k per città, piattaforma, pagamenti 2%. Primi anni al 60% e 85% del regime.</p></div>
            <div class="c-7" data-model>${modelHtml()}</div></div></section>
      </div>`;
    },
    mount(root) {
      root.querySelectorAll("[data-pipe]").forEach((s) => s.addEventListener("change", () => {
        const list = C.pipeline();
        list.find((p) => p.id === s.dataset.pipe).st = s.value;
        C.savePipeline(list); UL.ui.toast("Pipeline aggiornata"); UL.app.refresh();
      }));
      const out = () => SL.forEach(([k, , , , , f]) => { const o = root.querySelector(`[data-mo="${k}"]`); if (o) o.textContent = f(M[k]); });
      root.querySelectorAll("[data-m]").forEach((r) => r.addEventListener("input", () => {
        M[r.dataset.m] = Number(r.value); out();
        root.querySelector("[data-model]").innerHTML = modelHtml();
      }));
      out();
    },
  };
})();

