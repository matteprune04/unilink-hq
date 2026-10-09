/* network · admin-vista.js
   Modulo Network · VISTA adminD (rotta rete, solo admin): revisione dispense, atenei, ricavi, ambassador.
   Architettura: network/core.js. */
/* Variante D — pannello di rete (admin): moderazione dispense, atenei, ricavi, ambassador */
(function () {
  const UL = window.UL;
  const D = UL.D;
  const DATA = window.UL_D;
  const { icon, esc, ago } = UL.ui;
  // ricavi B2B ipotetici per la demo (sponsor del Summit e degli eventi, quote delle convenzioni)
  const B2B = [{ l: "Sponsor Summit nazionale", v: 12000 }, { l: "Sponsor eventi dei club", v: 3500 }, { l: "Convenzioni (quota esercenti)", v: 1800 }];

  UL.views.adminD = {
    title: "Rete",
    render() {
      const users = UL.store.allUsers().filter((u) => u.role !== "admin");
      const pending = users.flatMap((u) => u.activity.uploads.filter((x) => x.status === "pending").map((x) => ({ u, x })));
      const purchases = users.flatMap((u) => u.activity.purchases.map((p) => ({ u, p })));
      const byType = (t) => purchases.filter((x) => x.p.type === t).reduce((s, x) => s + x.p.price, 0);
      const passN = users.filter((u) => u.activity.pass.active).length;
      const streams = [
        { l: "Tutoring 1:1", v: byType("tutoring") }, { l: "Self-study test", v: byType("selfstudy") }, { l: "Academy", v: byType("academy") },
        { l: "Pass (annualizzato)", v: passN * DATA.PASS * 12 }, { l: "Annunci in evidenza", v: byType("featured") }, ...B2B,
      ];
      const tot = streams.reduce((s, x) => s + x.v, 0);
      const max = Math.max(...streams.map((s) => s.v), 1);
      const amb = users.filter((u) => u.activity.ambassador === "inviata");
      const members = Object.values(DATA.chapters).reduce((s, c) => s + c.members, 0);
      return `
      <div class="page-head"><div><div class="eyebrow">${icon("shield")} Team UniLink</div><h1>La <span class="accent">rete</span></h1><p class="lead">Atenei, club, revisione dei contenuti e ricavi della rete.</p></div></div>
      <div class="kpi-row" style="margin-bottom:20px">
        <div class="stat"><span class="k">Atenei attivi</span><span class="v">${DATA.unis.filter((x) => x.status === "attivo").length}<small>/${DATA.unis.length}</small></span></div>
        <div class="stat"><span class="k">Membri dei club</span><span class="v">${members}</span></div>
        <div class="stat"><span class="k">Dispense in revisione</span><span class="v">${pending.length}</span></div>
        <div class="stat"><span class="k">Pass attivi</span><span class="v">${passN}</span></div>
        <div class="stat"><span class="k">Ricavi (demo)</span><span class="v">${D.eur(Math.round(tot))}</span></div>
      </div>
      <div class="grid g-ov">
        <section class="card c-12"><div class="card-head"><h3>${icon("check")} Dispense da revisionare</h3><span class="small muted">approvando, l'autore riceve 50 crediti</span></div>
          <div class="table-wrap"><table class="table"><thead><tr><th>Titolo</th><th>Ateneo · corso</th><th>Autore</th><th>Inviata</th><th></th></tr></thead>
          <tbody>${pending.map(({ u, x }) => `<tr><td><b class="display" style="font-weight:400;color:var(--navy)">${esc(x.title)}</b><div class="tiny muted">${x.pages ? x.pages + " pagine · " : ""}${x.anno}° anno</div></td><td class="small">${esc(D.uni(x.uni).s)} · ${esc(x.cds)}</td><td class="small">${esc(UL.ui.fullName(u.profile))}</td><td class="small muted">${ago(x.at)}</td>
            <td><div class="row" style="flex-wrap:nowrap"><button class="btn btn-sm btn-primary" data-ok="${u.id}|${x.id}">Approva</button><button class="btn btn-sm btn-ghost" data-ko="${u.id}|${x.id}">Rifiuta</button></div></td></tr>`).join("") || '<tr><td colspan="5" class="muted" style="text-align:center;padding:16px">Nessuna dispensa in attesa.</td></tr>'}</tbody></table></div></section>
        <section class="card c-12"><div class="card-head"><h3>${icon("globe")} Atenei</h3></div>
          <div class="table-wrap"><table class="table"><thead><tr><th>Ateneo</th><th>Stato</th><th class="num">Membri club</th><th class="num">Utenti demo</th><th class="num">Dispense</th><th class="num">Pass</th><th class="num">Ricavi studenti</th><th>Ambassador</th></tr></thead>
          <tbody>${DATA.unis.map((x) => {
            const us = users.filter((u) => u.profile.ateneo === x.id);
            const rev = us.flatMap((u) => u.activity.purchases).reduce((s, p) => s + p.price, 0);
            return `<tr><td><b class="display" style="font-weight:400;color:var(--navy)">${esc(x.n)}</b></td><td><span class="badge ${D.ST[x.status].c}">${D.ST[x.status].l}</span></td><td class="num">${DATA.chapters[x.id].members}</td><td class="num">${us.length}</td><td class="num">${D.dispense(x.id).length}</td><td class="num">${us.filter((u) => u.activity.pass.active).length}</td><td class="num">${D.eur(Math.round(rev))}</td><td class="small">${esc(DATA.chapters[x.id].amb)}</td></tr>`;
          }).join("")}</tbody></table></div></section>
        <section class="card c-7"><div class="card-head"><h3>${icon("euro")} Ricavi per fonte</h3><b class="display" style="font-weight:400;color:var(--navy)">${D.eur(Math.round(tot))}</b></div>
          <div class="hbars">${streams.map((s) => `<div class="hbar"><span class="lab">${s.l}</span><span class="trk"><i style="width:${(s.v / max) * 100}%"></i></span><span class="val">${Math.round(s.v)}</span><span class="tip">${s.l}: ${D.eur(Math.round(s.v))}</span></div>`).join("")}</div>
          <p class="tiny muted" style="margin-top:10px">Studenti: acquisti degli account demo. Sponsor e convenzioni: importi ipotetici di un anno.</p></section>
        <section class="card c-5"><div class="card-head"><h3>${icon("users")} Candidature ambassador</h3></div>
          <ul class="feed">${amb.map((u) => `<li><span class="ic">${icon("user")}</span><div style="flex:1">${esc(UL.ui.fullName(u.profile))}<time>${esc(D.myUni(u).n)} · ${esc(u.profile.corso || "")}</time></div><button class="btn btn-sm btn-primary" data-amb="${u.id}">Approva</button></li>`).join("") || '<li class="small muted">Nessuna candidatura in attesa.</li>'}</ul></section>
      </div>`;
    },
    mount(root) {
      const users = UL.store.allUsers();
      const find = (v) => { const [uid, xid] = v.split("|"); const u = users.find((z) => z.id === uid); return { u, x: u.activity.uploads.find((y) => y.id === xid) }; };
      root.querySelectorAll("[data-ok]").forEach((b) => b.addEventListener("click", () => {
        const { u, x } = find(b.dataset.ok); x.status = "approved"; D.addCredits(u, 50, `dispensa approvata — ${x.title}`);
        UL.store.save(); UL.ui.toast("Dispensa approvata e pubblicata"); UL.app.refresh();
      }));
      root.querySelectorAll("[data-ko]").forEach((b) => b.addEventListener("click", () => {
        const { u, x } = find(b.dataset.ko); x.status = "rejected"; UL.store.addLog(u, "dispense", `Dispensa non approvata — ${x.title}`);
        UL.store.save(); UL.ui.toast("Dispensa rifiutata"); UL.app.refresh();
      }));
      root.querySelectorAll("[data-amb]").forEach((b) => b.addEventListener("click", () => {
        const u = users.find((z) => z.id === b.dataset.amb); u.activity.ambassador = "approvata";
        UL.store.addLog(u, "club", "Candidatura ambassador approvata"); UL.store.save(); UL.ui.toast("Ambassador approvato"); UL.app.refresh();
      }));
    },
  };
})();

