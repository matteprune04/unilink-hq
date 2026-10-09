/* network · home-vista.js
   Modulo Network · VISTE onboardingD (non usata nella v3), homeD (rotta home), passD (pass). Architettura: network/core.js. */
/* Variante D — onboarding (scelta ateneo), home del proprio ateneo, Pass e crediti */
(function () {
  const UL = window.UL;
  const D = UL.D;
  const DATA = window.UL_D;
  const { icon, esc, ago, fmtDate } = UL.ui;
  const ST = { attivo: { l: "Attivo", c: "badge-green" }, apertura: { l: "In apertura", c: "badge-yellow" } };
  D.ST = ST;

  UL.views.onboardingD = {
    title: "Benvenuto",
    render: (u) => `
    <div class="auth" style="grid-template-columns:1fr"><section class="auth-form-wrap" style="min-height:100vh"><div style="width:100%;max-width:760px">
      <a class="brand" style="margin-bottom:20px"><img src="img/logo-blu.png" alt=""><span>unilink</span></a>
      <div class="card" style="padding:30px">
        <span class="sq-label">Primo accesso</span><h2 style="margin:10px 0 6px">Ciao ${esc(u.profile.nome)}, in quale ateneo studi?</h2>
        <p class="muted" style="margin-bottom:18px">Vedrai dispense, club, guide e convenzioni del tuo ateneo. Puoi sempre esplorare gli altri.</p>
        <div class="feature-grid" data-unis>${DATA.unis.map((x) => `<button class="feature" data-v="${x.id}" style="text-align:left;cursor:pointer;border:2px solid ${u.profile.ateneo === x.id ? "var(--orange)" : "transparent"}">
          <span class="logo-sq" style="background:${x.color};width:40px;height:40px;font-size:14px">${esc(x.s.slice(0, 3))}</span><h3>${esc(x.n)}</h3><span class="badge ${ST[x.status].c}" style="align-self:flex-start">${ST[x.status].l}</span></button>`).join("")}</div>
        <div class="grid-2" style="margin-top:18px"><div class="field"><label for="ob-cds">Corso di laurea</label><select class="select" id="ob-cds"></select></div>
          <div class="field"><label for="ob-anno">Anno</label><select class="select" id="ob-anno">${[1, 2, 3].map((y) => `<option value="${y}">${y}° anno</option>`).join("")}<option value="M">Magistrale</option></select></div></div>
        <div class="row" style="justify-content:flex-end;margin-top:22px"><button class="btn btn-primary btn-arrow" data-go>Entra <span class="arr">${icon("arrow")}</span></button></div>
      </div></div></section></div>`,
    mount(root, u) {
      let sel = u.profile.ateneo || "unifi";
      const fill = () => { root.querySelector("#ob-cds").innerHTML = D.uni(sel).cds.map((c) => `<option>${esc(c)}</option>`).join(""); };
      root.querySelectorAll("[data-unis] [data-v]").forEach((b) => b.addEventListener("click", () => {
        sel = b.dataset.v;
        root.querySelectorAll("[data-unis] [data-v]").forEach((x) => (x.style.borderColor = x === b ? "var(--orange)" : "transparent"));
        fill();
      }));
      fill();
      root.querySelector("[data-go]").addEventListener("click", () => {
        Object.assign(u.profile, { ateneo: sel, corso: root.querySelector("#ob-cds").value, anno: root.querySelector("#ob-anno").value });
        UL.store.markOnboarded(u);
        UL.app.go("#/app/home");
      });
    },
  };

  UL.views.homeD = {
    title: "Home",
    render(u) {
      const me = D.myUni(u);
      const ch = DATA.chapters[me.id];
      const disp = D.dispense(me.id).filter((d) => !u.profile.corso || d.cds.includes(u.profile.corso)).slice(0, 4);
      const evs = DATA.events.filter((e) => !e.uni || e.uni === me.id).sort((a, b) => a.d - b.d).slice(0, 3);
      const best = D.best(u);
      const subs = D.subjects(u);
      const totU = DATA.unis.filter((x) => x.status === "attivo").length;
      const members = Object.values(DATA.chapters).reduce((s, c) => s + c.members, 0);
      return `
      <div class="hero" style="background:${me.color}">
        <img class="net" src="img/logo-white.png" alt="">
        <div style="position:relative;z-index:1">
          <span class="badge ${ST[me.status].c}">${ST[me.status].l}</span>
          <h1 style="margin-top:10px">${esc(me.n)}</h1>
          <p style="margin-top:8px;color:rgba(255,255,255,.8)">${esc(u.profile.nome)} · ${esc(u.profile.corso || "Corso non indicato")} · ${esc(u.profile.anno)}° anno</p>
          <div class="meta"><span>Club UniLink ${esc(me.s)}: ${ch.members} membri</span><span>${D.dispense(me.id).length} dispense</span><span>${esc(me.city)}</span></div>
          <div class="row" style="margin-top:18px"><a class="btn btn-white btn-arrow" href="#/app/dispense">Dispense del tuo corso <span class="arr">${icon("arrow")}</span></a>
            <a class="btn btn-ghost" style="color:#fff;border-color:rgba(255,255,255,.3)" href="#/app/club">Il tuo club</a></div>
        </div>
        <div class="hero-side">
          <span class="display small">La rete UniLink</span>
          <div class="stats" style="grid-template-columns:1fr 1fr;gap:10px;margin-top:10px">
            <div><b class="display" style="font-size:28px;font-weight:400">${totU}</b><div class="tiny" style="color:rgba(255,255,255,.7)">atenei attivi</div></div>
            <div><b class="display" style="font-size:28px;font-weight:400">${members}</b><div class="tiny" style="color:rgba(255,255,255,.7)">membri dei club</div></div>
            <div><b class="display" style="font-size:28px;font-weight:400">${DATA.unis.length - totU}</b><div class="tiny" style="color:rgba(255,255,255,.7)">in apertura</div></div>
            <div><b class="display" style="font-size:28px;font-weight:400">${u.activity.credits}</b><div class="tiny" style="color:rgba(255,255,255,.7)">i tuoi crediti</div></div>
          </div>
        </div>
      </div>
      <div class="grid g-ov" style="margin-top:20px">
        <section class="card c-7"><div class="card-head"><h3>${icon("book")} Nuove dispense del tuo corso</h3><a class="more" href="#/app/dispense">Tutte ${icon("arrow")}</a></div>
          <ul class="feed">${disp.map((d) => `<li><span class="ic">${icon(d.official ? "shield" : "book")}</span><div style="flex:1">${esc(d.title)}<time>${d.anno}° anno · ${esc(d.author)}${d.official ? " · ufficiale" : ""}</time></div></li>`).join("") || `<li class="small muted">Ancora nessuna dispensa per il tuo corso: <a href="#/app/dispense/carica">carica la prima</a> e guadagna crediti.</li>`}</ul></section>
        <section class="card c-5"><div class="card-head"><h3>${icon("quiz")} I tuoi test</h3><a class="more" href="#/app/test">Allenati ${icon("arrow")}</a></div>
          <div class="row between"><span class="label">Miglior simulazione</span><b class="display" style="font-size:26px;font-weight:400;color:var(--navy)">${best == null ? "—" : best + "%"}</b></div>
          <div class="bars-mini" style="margin-top:12px">${subs.map((s) => `<div class="r"><span>${s.s}</span><span class="t"><i style="width:${s.acc || 0}%"></i></span><b>${s.acc == null ? "—" : s.acc + "%"}</b></div>`).join("")}</div></section>
        <section class="card c-7"><div class="card-head"><h3>${icon("calendar")} Eventi per te</h3><a class="more" href="#/app/club/eventi">Tutti ${icon("arrow")}</a></div>
          <ul class="feed">${evs.map((e) => `<li><span class="ic">${icon("spark")}</span><div style="flex:1">${esc(e.t)}<time>${fmtDate(new Date(Date.now() + e.d * 864e5).toISOString())} · ${esc(e.city)}${e.uni ? "" : " · evento nazionale"}</time></div>${u.activity.rsvp.includes(e.id) ? '<span class="badge badge-green">Iscritto</span>' : ""}</li>`).join("")}</ul></section>
        <section class="card c-5"><div class="card-head"><h3>${icon("clock")} Attività</h3></div>
          <ul class="feed">${u.activity.log.slice(0, 5).map((l) => `<li><span class="ic">${icon("spark")}</span><div>${esc(l.msg)}<time>${ago(l.t)}</time></div></li>`).join("") || '<li class="small muted">Nessuna attività.</li>'}</ul></section>
        <section class="card beige c-12"><div class="card-head"><h3>${icon("globe")} Esplora gli altri atenei</h3></div>
          <div class="chips">${DATA.unis.filter((x) => x.id !== me.id).map((x) => `<a class="chip" href="#/app/dispense/${x.id}">${esc(x.s)} <span class="n">${ST[x.status].l}</span></a>`).join("")}</div></section>
      </div>`;
    },
  };

  UL.views.passD = {
    title: "Pass e crediti",
    render(u) {
      const a = u.activity;
      return `
      <div class="page-head"><div><div class="eyebrow">${icon("spark")} Account</div><h1>Pass e <span class="accent">crediti</span></h1><p class="lead">Le funzioni base restano gratis. Con il Pass sblocchi tutte le simulazioni e l'academy di base; i crediti li guadagni aiutando la community.</p></div></div>
      <div class="grid g-ov">
        <section class="card c-6">
          <div class="card-head"><h3>${icon("spark")} UniLink Pass</h3>${D.isPass(u) ? '<span class="badge badge-green">Attivo</span>' : ""}</div>
          <div class="price display" style="font-size:38px;color:var(--navy)">${D.eur(DATA.PASS)} <small class="muted" style="font-size:14px">/ mese</small></div>
          <ul class="incl" style="margin:14px 0">${["Tutte le simulazioni e l'allenamento per materia", "Predittore di ammissione", "Corsi base dell'academy", "−15% sui corsi avanzati e sul tutoring", "Convenzioni nazionali"].map((x) => `<li class="paid">${icon("check")}<span>${x}</span></li>`).join("")}</ul>
          ${D.isPass(u) ? `<p class="small muted">Attivo dal ${fmtDate(a.pass.since)}.</p>${u.role === "admin" ? "" : '<button class="btn btn-ghost btn-sm" style="margin-top:10px" data-stop>Disattiva il rinnovo</button>'}` : `<button class="btn btn-orange" data-pass>Attiva il Pass</button><p class="tiny muted" style="margin-top:8px">Pagamento simulato.</p>`}
        </section>
        <section class="card navy c-6">
          <span class="badge badge-orange">I tuoi crediti</span>
          <div class="display" style="font-size:54px;margin:10px 0">${a.credits}</div>
          <p class="small" style="color:rgba(255,255,255,.78)">Come guadagnarli</p>
          <ul class="feed">${[["Dispensa approvata", "+50"], ["Risultato di ammissione condiviso", "+20"], ["Recensione a una dispensa", "+5"], ["Amico iscritto con il tuo invito", "+30"]].map(([t, n]) => `<li style="border-color:rgba(255,255,255,.12)"><span class="ic" style="background:rgba(255,255,255,.1);color:#fff">${icon("plus")}</span><div style="flex:1">${t}</div><b class="display" style="font-weight:400">${n}</b></li>`).join("")}</ul>
          <p class="small" style="color:rgba(255,255,255,.78);margin-top:10px">Come usarli: 100 crediti = una simulazione completa, 50 = annuncio in evidenza nel mercatino.</p>
        </section>
        <section class="card c-12"><div class="card-head"><h3>${icon("euro")} Acquisti</h3></div>
          <div class="table-wrap"><table class="table"><thead><tr><th>Data</th><th>Prodotto</th><th class="num">Importo</th></tr></thead>
          <tbody>${a.purchases.slice().reverse().map((p) => `<tr><td class="small">${fmtDate(p.at)}</td><td>${esc(p.label)}</td><td class="num">${D.eur(p.price)}</td></tr>`).join("") || '<tr><td colspan="3" class="muted" style="text-align:center;padding:16px">Nessun acquisto.</td></tr>'}</tbody></table></div></section>
      </div>`;
    },
    mount(root, u) {
      const p = root.querySelector("[data-pass]");
      p && p.addEventListener("click", () => { u.activity.pass = { active: true, since: new Date().toISOString() }; D.buy(u, { type: "pass", label: "UniLink Pass (mensile)", price: DATA.PASS }); UL.ui.toast("Pass attivato (demo)"); UL.app.refresh(); });
      const s = root.querySelector("[data-stop]");
      s && s.addEventListener("click", () => { u.activity.pass.active = false; UL.store.save(); UL.ui.toast("Rinnovo disattivato"); UL.app.refresh(); });
    },
  };
})();

