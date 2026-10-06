/* network · community-vista.js
   Modulo Network · VISTE clubD (rotta club), mercatinoD (mercatino), strumentiD (strumenti). Architettura: network/core.js. */
/* Variante D — Club & eventi (modello club universitari), convenzioni, mercatino; strumenti (calcolatori e guide) */
(function () {
  const UL = window.UL;
  const D = UL.D;
  const DATA = window.UL_D;
  const { icon, esc, fmtDate, num } = UL.ui;
  const head = (e, i, t, l, r) => `<div class="page-head"><div><div class="eyebrow">${icon(i)} ${esc(e)}</div><h1>${t}</h1>${l ? `<p class="lead">${l}</p>` : ""}</div>${r || ""}</div>`;
  const inD = (d) => new Date(Date.now() + d * 864e5).toISOString();

  /* ---------------- CLUB, EVENTI, CONVENZIONI ---------------- */
  UL.views.clubD = {
    title: "Club ed eventi",
    render(u, params) {
      const tab = ["eventi", "convenzioni"].includes(params[0]) ? params[0] : "club";
      const me = D.myUni(u);
      const tabs = `<div class="tabs"><a href="#/app/club" class="${tab === "club" ? "on" : ""}">${icon("users")} Club</a><a href="#/app/club/eventi" class="${tab === "eventi" ? "on" : ""}">${icon("calendar")} Eventi</a><a href="#/app/club/convenzioni" class="${tab === "convenzioni" ? "on" : ""}">${icon("spark")} Convenzioni</a></div>`;
      let body = "";
      if (tab === "club") {
        body = `<div class="mentor-grid">${DATA.unis.map((x) => {
          const c = DATA.chapters[x.id];
          const mine = u.activity.chapter === x.id;
          return `<div class="mentor" style="${x.id === me.id ? "border:2px solid var(--orange)" : ""}">
            <div class="top"><span class="logo-sq" style="background:${x.color};width:46px;height:46px;font-size:14px">${esc(x.s.slice(0, 3))}</span><div><b class="display" style="font-weight:400;color:var(--navy)">Club UniLink ${esc(x.s)}</b><div class="small muted">${esc(x.city)}${x.id === me.id ? " · il tuo ateneo" : ""}</div></div></div>
            <div class="row between"><span class="badge ${D.ST[x.status].c}">${D.ST[x.status].l}</span><span class="small">${c.members ? `<b>${c.members}</b> membri` : "Nessun membro"}</span></div>
            <p class="small muted">Ambassador: ${esc(c.amb)}${c.next ? ` · prossimo: ${esc(c.next)}` : ""}</p>
            ${x.status === "attivo" ? (mine ? '<span class="badge badge-green">Sei iscritto</span>' : `<button class="btn btn-sm btn-primary" data-join="${x.id}">Iscriviti al club</button>`)
              : `<button class="btn btn-sm btn-orange" data-amb="${x.id}" ${u.activity.ambassador ? "disabled" : ""}>${u.activity.ambassador ? "Candidatura inviata" : "Diventa ambassador"}</button>`}
          </div>`;
        }).join("")}</div>
        <div class="card beige" style="margin-top:20px"><h3>Come funziona un club</h3><p class="small muted" style="margin-top:6px">Ogni ateneo ha un club UniLink con un ambassador e un piccolo team: revisiona le dispense del proprio ateneo, organizza eventi e porta le convenzioni locali. In cambio: crediti, formazione, visibilità con le aziende partner e una quota dei ricavi locali.</p></div>`;
      } else if (tab === "eventi") {
        body = `<div class="stack" style="gap:12px">${DATA.events.slice().sort((a, b) => a.d - b.d).map((e) => {
          const d = new Date(inD(e.d)); const on = u.activity.rsvp.includes(e.id);
          return `<article class="job"><span class="logo-sq" style="background:${e.uni ? D.uni(e.uni).color : "var(--orange)"};flex-direction:column;font-size:12px;line-height:1.1">${d.getDate()}<br>${d.toLocaleDateString("it-IT", { month: "short" })}</span>
            <div><div class="row" style="gap:8px"><span class="badge badge-soft">${e.uni ? "Club " + esc(D.uni(e.uni).s) : "Evento nazionale"}</span>${e.sponsored ? '<span class="sponsored">CON PARTNER</span>' : ""}${e.free ? '<span class="badge badge-green">Gratuito</span>' : ""}</div>
              <h3>${esc(e.t)}</h3><div class="facts"><span>${icon("pin")} ${esc(e.city)}</span><span>${icon("calendar")} ${fmtDate(inD(e.d))}</span></div>${e.desc ? `<p class="small" style="margin-top:6px">${esc(e.desc)}</p>` : ""}</div>
            <div><button class="btn btn-sm ${on ? "btn-orange" : "btn-primary"}" data-rsvp="${e.id}">${on ? icon("check") + " Biglietto preso" : e.uni ? "Partecipa" : "Prendi il biglietto"}</button></div></article>`;
        }).join("")}</div>
        <p class="tiny muted" style="margin-top:12px">Gli eventi nazionali sono gratuiti per gli studenti e finanziati dagli sponsor.</p>`;
      } else {
        const ds = DATA.deals.filter((x) => !x.uni || x.uni === me.id);
        body = `<p class="muted" style="margin-bottom:14px">Sconti di negozi e servizi convenzionati vicino al tuo ateneo (${esc(me.city)}) e convenzioni nazionali. Mostra la tessera digitale in cassa.</p>
          <div class="grid g-ov"><section class="c-8 mentor-grid">${ds.map((x) => `<div class="mentor"><span class="badge badge-soft" style="align-self:flex-start">${esc(x.cat)}</span><h3>${esc(x.n)}</h3><p class="small">${esc(x.d)}</p>${x.uni ? "" : '<span class="tiny muted">Nazionale · Pass</span>'}</div>`).join("") || '<p class="small muted">Nessuna convenzione nella tua città per ora.</p>'}</section>
          <section class="card navy c-4" style="align-self:start"><span class="sq-label" style="color:#fff">Tessera UniLink</span><h2 style="margin:10px 0 4px">${esc(UL.ui.fullName(u.profile))}</h2><p class="small" style="color:rgba(255,255,255,.75)">${esc(me.n)} · ${esc(u.profile.corso || "")}</p>
            <div class="display" style="font-size:22px;letter-spacing:.12em;margin-top:16px">UL-${esc(me.s.toUpperCase())}-${esc(u.id.slice(-5).toUpperCase())}</div><p class="tiny" style="color:rgba(255,255,255,.6);margin-top:10px">Esercenti di esempio.</p></section></div>`;
      }
      return head("Community", "users", 'Club, eventi e <span class="accent">convenzioni</span>', "Un club UniLink in ogni ateneo, eventi locali e nazionali, sconti vicino al campus.") + tabs + body;
    },
    mount(root, u) {
      root.querySelectorAll("[data-join]").forEach((b) => b.addEventListener("click", () => { u.activity.chapter = b.dataset.join; UL.store.addLog(u, "club", `Iscrizione al club ${D.uni(b.dataset.join).s}`); UL.store.save(); UL.ui.toast("Benvenuto/a nel club"); UL.app.refresh(); }));
      root.querySelectorAll("[data-amb]").forEach((b) => b.addEventListener("click", () => {
        const x = D.uni(b.dataset.amb);
        const m = UL.ui.modal(`<div class="modal-head"><div><span class="sq-label">Ambassador</span><h2 style="margin-top:8px">Apri il club UniLink ${esc(x.s)}</h2></div><button class="icon-btn" data-close>${icon("x")}</button></div>
          <p class="small">Cosa fa un ambassador: forma un team di 3-5 studenti, revisiona le dispense dell'ateneo, organizza 2 eventi a semestre e cerca convenzioni locali. Riceve formazione, crediti e una quota dei ricavi locali.</p>
          <div class="field" style="margin-top:12px"><label for="amb-why">Perché vuoi aprire il club?</label><textarea class="textarea" id="amb-why" maxlength="500"></textarea></div>
          <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn btn-primary" data-ok>Invia candidatura</button></div>`, { width: 560 });
        m.el.querySelector("[data-ok]").addEventListener("click", () => { u.activity.ambassador = "inviata"; UL.store.addLog(u, "club", `Candidatura ambassador — ${x.s}`); UL.store.save(); m.close(); UL.ui.toast("Candidatura inviata"); UL.app.refresh(); });
      }));
      root.querySelectorAll("[data-rsvp]").forEach((b) => b.addEventListener("click", () => {
        const r = u.activity.rsvp; const i = r.indexOf(b.dataset.rsvp);
        i >= 0 ? r.splice(i, 1) : r.push(b.dataset.rsvp);
        UL.store.save(); UL.ui.toast(i >= 0 ? "Partecipazione annullata" : "Ci vediamo lì!"); UL.app.refresh();
      }));
    },
  };

  /* ---------------- MERCATINO ---------------- */
  const MF = { uni: "" };
  UL.views.mercatinoD = {
    title: "Mercatino",
    render(u) {
      const uni = MF.uni || u.profile.ateneo;
      const all = DATA.listings.concat(UL.store.allUsers().flatMap((x) => x.activity.listings));
      const list = all.filter((l) => l.uni === uni).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      return `
      ${head("Mercatino", "book", 'Libri usati del tuo <span class="accent">corso</span>', "Compra e vendi manuali tra studenti dello stesso ateneo. Nessuna commissione; l'annuncio in evidenza costa 50 crediti o 1,99 €.")}
      <div class="row between" style="margin-bottom:16px"><div class="chips">${DATA.unis.filter((x) => x.status === "attivo").map((x) => `<span class="chip ${x.id === uni ? "on" : ""}" data-u="${x.id}">${esc(x.s)}</span>`).join("")}</div>
        <button class="btn btn-primary" data-new>${icon("plus")} Vendi un libro</button></div>
      <div class="mentor-grid">${list.map((l) => `<div class="mentor" style="${l.featured ? "border:2px solid var(--orange)" : ""}">
        <div class="row between"><span class="badge badge-soft">${esc(l.course)}</span>${l.featured ? '<span class="sponsored">IN EVIDENZA</span>' : ""}</div>
        <h3>${esc(l.t)}</h3><p class="small muted">${esc(l.cond)} · venduto da ${esc(l.seller)}</p>
        <div class="row between"><b class="display" style="font-weight:400;font-size:24px">${D.eur(l.price)}</b>${u.activity.listings.some((x) => x.id === l.id) ? `${l.featured ? "" : `<button class="btn btn-sm btn-ghost" data-feat="${l.id}">Metti in evidenza</button>`}` : `<button class="btn btn-sm btn-primary" data-contact="${esc(l.seller)}">Contatta</button>`}</div></div>`).join("") || '<div class="card empty">Nessun annuncio per questo ateneo.</div>'}</div>
      <p class="tiny muted" style="margin-top:12px">Annunci di esempio.</p>`;
    },
    mount(root, u) {
      root.querySelectorAll("[data-u]").forEach((c) => c.addEventListener("click", () => { MF.uni = c.dataset.u; UL.app.refresh(); }));
      root.querySelectorAll("[data-contact]").forEach((b) => b.addEventListener("click", () => UL.ui.toast(`Demo: messaggio a ${b.dataset.contact} non inviato`)));
      root.querySelectorAll("[data-feat]").forEach((b) => b.addEventListener("click", () => {
        const l = u.activity.listings.find((x) => x.id === b.dataset.feat);
        if (u.activity.credits >= 50) { D.addCredits(u, -50, "annuncio in evidenza"); }
        else D.buy(u, { type: "featured", ref: l.id, label: "Annuncio in evidenza", price: 1.99 });
        l.featured = true; UL.store.save(); UL.ui.toast("Annuncio in evidenza"); UL.app.refresh();
      }));
      root.querySelector("[data-new]").addEventListener("click", () => {
        const me = D.myUni(u);
        const m = UL.ui.modal(`<div class="modal-head"><h2>Vendi un libro</h2><button class="icon-btn" data-close>${icon("x")}</button></div>
          <form class="stack" style="gap:12px" data-f>
            <div class="field"><label for="ml-t">Titolo</label><input class="input" id="ml-t" name="t" required></div>
            <div class="grid-2"><div class="field"><label for="ml-c">Esame</label><input class="input" id="ml-c" name="course" placeholder="es. Statistica"></div>
              <div class="field"><label for="ml-p">Prezzo (€)</label><input class="input" id="ml-p" name="price" inputmode="decimal"></div></div>
            <div class="field"><label for="ml-s">Condizioni</label><select class="select" id="ml-s" name="cond"><option>Come nuovo</option><option>Buono</option><option>Sottolineato</option></select></div>
            <div class="row" style="justify-content:flex-end"><button class="btn btn-primary" type="submit">Pubblica su ${esc(me.s)}</button></div></form>`, { width: 520 });
        m.el.querySelector("[data-f]").addEventListener("submit", (e) => {
          e.preventDefault();
          const f = Object.fromEntries(new FormData(e.target));
          u.activity.listings.push({ id: "l" + D.uid(), uni: me.id, course: f.course || "—", t: f.t, price: parseFloat(String(f.price).replace(",", ".")) || 0, cond: f.cond, seller: `${u.profile.nome} ${(u.profile.cognome || "")[0] || ""}.` });
          UL.store.save(); m.close(); MF.uni = me.id; UL.ui.toast("Annuncio pubblicato"); UL.app.refresh();
        });
      });
    },
  };

  /* ---------------- STRUMENTI: calcolatori e guide ---------------- */
  const LS = {};
  UL.views.strumentiD = {
    title: "Strumenti",
    render(u, params) {
      const tab = ["exchange", "guide"].includes(params[0]) ? params[0] : "laurea";
      const me = D.myUni(u);
      const pre = D.PRESETS[me.id];
      if (!LS.media) Object.assign(LS, { media: UL.store.career(u.profile).media || 27, lodi: 1, inCorso: true, erasmusFatto: false, cfu: 90, cfuAttesi: 120, lingua: "B2" }, pre);
      const tabs = `<div class="tabs"><a href="#/app/strumenti" class="${tab === "laurea" ? "on" : ""}">${icon("calc")} Voto di laurea</a><a href="#/app/strumenti/exchange" class="${tab === "exchange" ? "on" : ""}">${icon("plane")} Punteggio exchange</a><a href="#/app/strumenti/guide" class="${tab === "guide" ? "on" : ""}">${icon("file")} Guide ${esc(me.s)}</a></div>`;
      let body = "";
      if (tab === "laurea") {
        const R = D.laurea(LS);
        const fld = (k, l, step) => `<div class="field"><label for="l-${k}">${l}</label><input class="input" id="l-${k}" data-ls="${k}" value="${LS[k]}" type="number" step="${step}"></div>`;
        body = `<div class="grid g-ov"><section class="card c-7"><div class="card-head"><h3>Regole di ${esc(me.s)}</h3><span class="small muted">valori di esempio: verifica il regolamento</span></div>
          <div class="grid-3">${fld("media", "Media ponderata", 0.01)}${fld("lodi", "Numero di lodi", 1)}${fld("tesi", "Punti tesi (max)", 0.5)}${fld("lode", "Bonus per lode", 0.05)}${fld("corso", "Bonus laurea in corso", 0.5)}${fld("erasmus", "Bonus Erasmus", 0.5)}</div>
          <div class="row" style="margin-top:12px"><label class="check"><input type="checkbox" data-lc="inCorso" ${LS.inCorso ? "checked" : ""}> Mi laureo in corso</label><label class="check"><input type="checkbox" data-lc="erasmusFatto" ${LS.erasmusFatto ? "checked" : ""}> Ho fatto l'Erasmus</label></div></section>
          <section class="card navy c-5"><span class="sq-label" style="color:#fff">Voto di laurea stimato</span>
            <div class="display" style="font-size:64px;margin:10px 0" data-out>${num(R.tot, 1)}</div>
            <p class="small" style="color:rgba(255,255,255,.78)">Base: <b data-base>${num(R.base, 2)}</b>/110 · ${R.lode ? "possibile lode" : "lode non raggiunta"}</p></section></div>`;
      } else if (tab === "exchange") {
        const sc = D.exchange(LS);
        body = `<div class="grid g-ov"><section class="card c-5"><div class="card-head"><h3>I tuoi dati</h3></div>
          <div class="grid-2"><div class="field"><label for="x-media">Media</label><input class="input" id="x-media" data-ls="media" type="number" step="0.01" value="${LS.media}"></div>
            <div class="field"><label for="x-l">Inglese</label><select class="select" id="x-l" data-ls="lingua">${["B1", "B2", "C1", "C2"].map((l) => `<option ${LS.lingua === l ? "selected" : ""}>${l}</option>`).join("")}</select></div>
            <div class="field"><label for="x-cfu">CFU conseguiti</label><input class="input" id="x-cfu" data-ls="cfu" type="number" value="${LS.cfu}"></div>
            <div class="field"><label for="x-att">CFU attesi a oggi</label><input class="input" id="x-att" data-ls="cfuAttesi" type="number" value="${LS.cfuAttesi}"></div></div>
          <div class="row between" style="margin-top:16px"><span class="label">Exchange score</span><b class="display" style="font-size:40px;font-weight:400;color:var(--navy)">${sc}</b></div></section>
          <section class="card c-7"><div class="card-head"><h3>Destinazioni e soglie</h3><span class="small muted">esempio</span></div>
            <div class="table-wrap"><table class="table"><thead><tr><th>Università</th><th class="num">Soglia anno scorso</th><th class="num">Posti</th><th>Per te</th></tr></thead>
            <tbody>${D.DESTINATIONS.map((d) => `<tr><td><b class="display" style="font-weight:400;color:var(--navy)">${esc(d.n)}</b><div class="tiny muted">${esc(d.c)}</div></td><td class="num">${d.soglia}</td><td class="num">${d.posti}</td><td><span class="badge ${sc >= d.soglia + 5 ? "fit-safe" : sc >= d.soglia - 3 ? "fit-match" : "fit-reach"}">${sc >= d.soglia + 5 ? "Alla portata" : sc >= d.soglia - 3 ? "In linea" : "Ambiziosa"}</span></td></tr>`).join("")}</tbody></table></div></section></div>`;
      } else {
        body = `<div class="feature-grid">${[
          ["euro", "Agevolazioni e borse", `Borse di studio, esoneri e alloggi: l'ente di riferimento per ${esc(me.s)} è ${esc(me.dsu)}. Scadenze, ISEE e documenti in una pagina.`],
          ["home", "Residenze e affitti", `Residenze universitarie e quartieri consigliati a ${esc(me.city)}, con i prezzi medi segnalati dagli studenti.`],
          ["plane", "Erasmus passo per passo", "Bando, scelta delle destinazioni, Learning Agreement e riconoscimento degli esami al rientro."],
          ["layers", "Piano di studi", "Come compilarlo, esami a scelta e propedeuticità del tuo corso di laurea."],
          ["cap", "Dopo la laurea", "Magistrali in Italia e all'estero, tempi delle candidature e test richiesti."],
          ["users", "Rappresentanza", "Chi sono i rappresentanti del tuo ateneo e come segnalare un problema."],
        ].map(([i, t, d]) => `<div class="feature"><span class="ic">${icon(i)}</span><h3>${t}</h3><p>${d}</p><span class="badge badge-soft" style="align-self:flex-start">Guida PDF · demo</span></div>`).join("")}</div>`;
      }
      return head("Strumenti", "calc", 'Calcolatori e <span class="accent">guide</span>', `Regole e guide di ${esc(me.n)}. Ogni ateneo ha i suoi parametri.`) + tabs + body;
    },
    mount(root) {
      const live = !!root.querySelector("[data-out]");
      root.querySelectorAll("[data-ls]").forEach((i) => i.addEventListener(i.tagName === "SELECT" || !live ? "change" : "input", () => {
        LS[i.dataset.ls] = i.tagName === "SELECT" ? i.value : Number(i.value);
        const out = root.querySelector("[data-out]");
        if (out) { const R = D.laurea(LS); out.textContent = num(R.tot, 1); root.querySelector("[data-base]").textContent = num(R.base, 2); }
        else UL.app.refresh();
      }));
      root.querySelectorAll("[data-lc]").forEach((c) => c.addEventListener("change", () => { LS[c.dataset.lc] = c.checked; UL.app.refresh(); }));
    },
  };
})();

