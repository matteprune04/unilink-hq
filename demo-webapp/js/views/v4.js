/* js/views/v4.js — web app v4: tutto segue il listino P2 della landing v5 (config.js → UL.PIANI).
   REGOLA GENERALE: ogni parte dell'app esiste per tutti; se il tuo piano non la include la vedi lo stesso,
   con il lucchetto e il piano che la sblocca (U.lock / B.upsell). Mai pagine nascoste o vuote.
   1 scheda esame: cosa compri (Appunti, Completa, gratis)     2 «Sblocca»: il piano giusto per quello che ti manca
   3 Abbonamento: card, Cosa c'è dentro, calcolatore, ordini   4 UniLink Planner (P3): Plus = piano personale, gli altri = metodo standard
   5 Il mio percorso: Tesi (per tutti) e CV (5 regole gratis, 17 con Plus)   6 Guida per facoltà (dalla landing) */
(function () {
  const UL = window.UL, B = UL.B, U = UL.U;
  const { icon, esc, ROMAN, fmtDate } = UL.ui;
  const eur = (n) => B.eur(n);
  const P = UL.PIANI;
  const head = (eyebrow, ic, title, lead, right) => `
    <div class="page-head"><div><div class="eyebrow">${icon(ic)} ${esc(eyebrow)}</div><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}</div>${right || ""}</div>`;
  const cdsDi = (user) => user.profile.cds || "EA";
  const annoDi = (user) => Math.min(3, Math.max(1, Number(user.profile.anno) || 1));

  /* lucchetto standard: stessa grafica ovunque, dice cosa serve e apre «Sblocca» */
  U.lock = (titolo, serve, attr) => `<div class="v4-lock"><span class="ic">${icon("lock")}</span><div><b>${esc(titolo)}</b><span>${esc(serve)}</span></div><button class="btn btn-sm btn-orange" ${attr || "data-v4plus"}>Sblocca</button></div>`;
  const bindPlus = (root, user, slug) => root.querySelectorAll("[data-v4plus]").forEach((b) => b.addEventListener("click", () => B.upsell(user, slug, { plus: true })));

  /* ---------- 1 · scheda esame: cosa compri ---------- */
  U.buyCard = (user, c) => {
    const lv = B.level(user, c.slug), fs = B.inSessione() ? 1 : 0;
    const pa = P.prezzi.appunti, pc = B.prezzoCompleta(c);
    const riga = (k, nome, prezzi, sub, attivo, cta) => `<div class="v4-buy ${attivo ? "on" : ""}"><div><b>${nome}</b><span class="tiny muted">${sub}</span></div>
      <div class="v4-pr"><b>${eur(prezzi[fs])}</b><span class="tiny muted">${fs ? "in sessione" : "fuori sessione · in sessione " + eur(prezzi[1])}</span></div>${cta}</div>`;
    const sem = B.semesterCourses(c.cds.includes(cdsDi(user)) ? cdsDi(user) : c.cds.split("/")[0], c.anno, c.sem);
    return `<div class="row between"><b class="display" style="color:var(--navy)">Studia ${esc(c.title)}</b>${lv !== "none" ? `<span class="badge badge-green">${lv === "completa" ? "Completa" : "Appunti"} attivi</span>` : ""}</div>
      ${B.puoGratis(user, c.slug) ? `<div class="v4-gratis">${icon("spark")}<div><b>Gratis con il tuo account</b><span class="tiny">1 Appunti a scelta tra 3 esami</span></div><button class="btn btn-sm btn-primary" data-v4k="gratis">Prendilo gratis</button></div>` : ""}
      ${riga("appunti", "Appunti", pa, "Appunti/Sbobine in PDF", lv !== "none", lv !== "none" ? `<a class="btn btn-sm btn-ghost" href="${esc(c.pdf || "#")}" target="_blank" rel="noopener">${icon("download")} Apri</a>` : `<button class="btn btn-sm btn-ghost" data-v4k="appunti">Scegli</button>`)}
      ${B.haCompleta(c) ? riga("completa", "Dispensa completa", pc, c.mappe ? "Appunti + mappe + quiz e simulazioni" : "Appunti + quiz e simulazioni · senza mappe", lv === "completa",
        lv === "completa" ? `<a class="btn btn-sm btn-ghost" href="#/app/esercitazioni/${c.slug}">${icon("quiz")} Allenati</a>` : `<button class="btn btn-sm ${lv === "appunti" ? "btn-orange" : "btn-primary"}" data-v4k="completa">${lv === "appunti" ? "Passa alla completa" : "Scegli"}</button>`)
        : `<p class="tiny muted">Per questo esame ci sono gli Appunti: mappe e quiz non ancora.</p>`}
      ${sem.length >= 3 && lv !== "completa" ? `<p class="small" style="margin-top:4px">Nel <b>pacchetto semestre</b> (${eur(P.prezzi.semester)}) con altri ${sem.length - 1} esami. <a href="#/app/abbonamento/calcola">Calcola</a></p>` : ""}
      <span class="lock">${icon("lock")} Pagamento con Stripe · simulato nella demo · ${esc(P.stato)}</span>`;
  };
  U.bindBuyCard = (root, user, c) => root.querySelectorAll("[data-v4k]").forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.v4k;
    if (k === "gratis") { B.buy(user, B.gratisItem(c)); UL.ui.toast(`Appunti di ${c.title} sbloccati: sono tuoi`); return UL.app.refresh(); }
    const item = k === "appunti" ? B.appuntiItem(c) : B.completaItem(c);
    // passare dagli Appunti alla Completa riconosce quanto già pagato (proposta P2)
    if (k === "completa" && B.level(user, c.slug) === "appunti") {
      const pagato = (user.activity.purchases || []).filter((p) => p.slug === c.slug && p.type === "appunti").reduce((n, p) => n + p.price, 0);
      item.price = Math.max(0, Math.round((item.price - pagato) * 100) / 100); item.label = "Passa alla completa · " + c.title; item.incl = [`Paghi la differenza: ${eur(pagato)} già pagati per gli Appunti`].concat(item.incl);
    }
    B.checkout(user, item, () => UL.app.refresh());
  }));

  /* ---------- 2 · «Sblocca»: le opzioni giuste per quello che manca ---------- */
  B.upsell = (user, slug, opz = {}) => {
    const c = slug && B.course(slug), lv = c ? B.level(user, slug) : "none";
    const anno = c ? c.anno : annoDi(user), cds = c && !c.cds.includes(cdsDi(user)) ? c.cds.split("/")[0] : cdsDi(user);
    const o = [];
    if (opz.plus || opz.pianifica) { if (!B.plus(user)) o.push({ t: "UniLink Plus", p: B.prezzoPlus(user), s: "una tantum · fino al " + B.fineSessione().toLocaleDateString("it-IT", { day: "numeric", month: "long" }), incl: B.plusItem(user).incl, item: () => B.plusItem(user), hot: true, tag: "Il metodo" }); }
    if (!opz.plus && c) {
      if (B.puoGratis(user, slug) && !opz.pianifica) o.push({ t: "Appunti gratis", p: 0, s: "il regalo del tuo account", incl: B.gratisItem(c).incl, item: () => B.gratisItem(c) });
      else if (lv === "none" && !opz.pianifica) o.push({ t: "Appunti", p: B.prezzo("appunti", c), s: B.quandoVale(), incl: B.appuntiItem(c).incl.slice(0, 3), item: () => B.appuntiItem(c) });
      if (B.haCompleta(c) && lv !== "completa") o.push({ t: lv === "appunti" ? "Passa alla completa" : "Dispensa completa", p: B.prezzo("completa", c), s: B.quandoVale(), incl: B.completaItem(c).incl.slice(0, 4), item: () => B.completaItem(c), hot: true, tag: "Per questo esame" });
      const sem = B.semesterCourses(cds, anno, c.sem);
      if (sem.length >= 2 && lv !== "completa") o.push({ t: "Pacchetto semestre", p: P.prezzi.semester, s: `${sem.length} complete · invece di ${eur(B.valoreSingoli(sem))}`, incl: sem.map((x) => x.title), item: () => B.semItem(cds, anno, c.sem) });
    }
    if (!o.length) return UL.ui.toast("Hai già tutto quello che serve qui");
    const m = UL.ui.modal(`
      <div class="modal-head"><div><span class="sq-label">Sblocca</span><h2 style="margin-top:8px">${esc(opz.plus ? "Con UniLink Plus" : opz.pianifica ? "Il piano di " + (c ? c.title : "questo esame") : c ? c.title : "")}</h2><p class="small muted" style="margin-top:4px">${opz.plus ? "Plus è il metodo: Planner personale, ripasso degli errori e CV completo su tutti gli esami. Le dispense si comprano a parte." : opz.pianifica ? "Il piano personale si crea con la dispensa completa dell'esame (o un pacchetto che lo include), oppure con Plus per tutti i tuoi esami." : "Scegli tu cosa ti serve. " + esc(P.stato) + "."}</p></div>
        <button class="icon-btn" data-close aria-label="Chiudi">${icon("x")}</button></div>
      <div class="pricing" style="grid-template-columns:repeat(${o.length},1fr)">${o.map((x, i) => `<div class="plan ${x.hot ? "hot" : ""}" data-hot="${esc(x.tag || "")}"><h3>${esc(x.t)}</h3><div class="price">${x.p ? eur(x.p) : "Gratis"} <small>${esc(x.s)}</small></div>
        <ul>${x.incl.map((y) => `<li>${icon("check")}${esc(y)}</li>`).join("")}</ul><button class="btn ${x.hot ? "btn-orange" : "btn-primary"}" data-pick="${i}">Scegli</button></div>`).join("")}</div>
      <p class="tiny muted" style="margin-top:12px">Le differenze tra i piani: <a href="#/app/abbonamento" data-close>Abbonamento → Cosa c'è dentro</a></p>`, { width: Math.min(980, 300 * o.length + 80) });
    m.el.querySelectorAll("[data-pick]").forEach((b) => b.addEventListener("click", () => {
      m.close(); const it = o[Number(b.dataset.pick)].item();
      if (it.type === "gratis") { B.buy(user, it); UL.ui.toast("Appunti sbloccati: sono tuoi"); return UL.app.refresh(); }
      B.checkout(user, it, () => UL.app.refresh());
    }));
  };

  /* ---------- 3 · Abbonamento ---------- */
  const COLS = ["free", "appunti", "completa", "semester", "anno", "plus"];
  const colonnaUtente = (user) => {
    const ps = user.activity.purchases || [];
    return B.plus(user) ? "plus" : ps.some((p) => p.type === "anno") ? "anno" : ps.some((p) => p.type === "semester") ? "semester"
      : B.courses().some((c) => B.ownsCompleta(user, c.slug)) ? "completa" : ps.some((p) => p.type === "appunti") ? "appunti" : "free";
  };
  const mesi = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
  const quando = () => `<div class="v4-quando"><div><span class="sq-label">Quando conviene comprare</span><p class="small muted" style="margin-top:6px">Gli esami singoli costano meno fuori sessione. I pacchetti e Plus costano uguale tutto l'anno.</p></div>
    <div class="v4-mesi">${mesi.map((m, i) => `<span class="${P.sessione[i] ? "s" : ""} ${i === new Date().getMonth() ? "ora" : ""}"><i></i>${m}</span>`).join("")}</div>
    <p class="small">${B.inSessione() ? '<span class="badge badge-orange">Adesso: in sessione</span>' : '<span class="badge badge-green">Adesso: fuori sessione, costa meno</span>'}</p></div>`;
  const tabellaDentro = (user) => {
    const me = colonnaUtente(user), L = Object.fromEntries(P.lista.map((x) => [x.k, x]));
    const cella = (v) => v === 1 ? `<span class="v4-ok">${icon("check")}</span>` : v === 0 ? '<span class="v4-no">—</span>' : `<span class="tiny muted">${esc(v)}</span>`;
    return `<div class="card section" id="dentro"><div class="card-head"><h3>${icon("layers")} Cosa c'è dentro</h3><span class="small muted">la colonna «Tu» è il tuo piano di oggi</span></div>
      <div class="table-wrap"><table class="table v4-tab"><thead><tr><th></th>${COLS.map((k) => `<th class="${k === me ? "me" : ""}">${esc(L[k].nome)}${k === me ? ' <span class="badge badge-orange">Tu</span>' : ""}<br><span class="tiny muted">${esc(L[k].prezzo || "")}</span></th>`).join("")}</tr></thead>
      <tbody>${P.dentro.map(([g, righe]) => `<tr class="gr"><td colspan="7">${esc(g)}</td></tr>` + righe.map(([n, ...v]) => `<tr><th scope="row">${esc(n)}</th>${v.map((x, i) => `<td class="${COLS[i] === me ? "me" : ""}">${cella(x)}</td>`).join("")}</tr>`).join("")).join("")}</tbody></table></div>
      <p class="tiny muted" style="margin-top:10px">${esc(P.gratis.testo)}</p></div>`;
  };
  const cardPrezzi = (user) => {
    const ps = user.activity.purchases || [], plus = B.plus(user), fs = B.inSessione() ? 1 : 0;
    const studio = U.attiva(user) && U.ateneoAttivo(user);
    const C = [
      { k: "appunti", p: P.prezzi.appunti[fs], sub: fs ? "in sessione" : "fuori sessione · in sessione " + eur(P.prezzi.appunti[1]), on: ps.some((x) => x.type === "appunti" || x.type === "gratis"), cta: studio ? `<a class="btn btn-ghost" href="#/app/materiali/catalogo">Scegli l'esame</a>` : "" },
      { k: "completa", p: P.prezzi.completa[fs], sub: fs ? "in sessione" : "fuori sessione · in sessione " + eur(P.prezzi.completa[1]), on: ps.some((x) => x.type === "completa"), cta: studio ? `<a class="btn btn-ghost" href="#/app/materiali/catalogo">Scegli l'esame</a>` : "" },
      { k: "semester", p: P.prezzi.semester, sub: "stesso prezzo tutto l'anno", on: ps.some((x) => x.type === "semester"), cta: studio ? `<a class="btn btn-orange" href="#/app/abbonamento/calcola">Calcola il tuo pacchetto</a>` : "" },
      { k: "anno", p: P.prezzi.anno, sub: "stesso prezzo tutto l'anno", on: ps.some((x) => x.type === "anno"), cta: studio ? `<a class="btn btn-ghost" href="#/app/abbonamento/calcola">Calcola il tuo pacchetto</a>` : "" },
      { k: "plus", p: B.prezzoPlus(user), sub: B.haPacchetto(user) ? "una tantum · prezzo con pacchetto" : "una tantum · con un pacchetto " + eur(P.prezzi.plusConPacchetto), on: plus, cta: plus ? `<span class="small muted">Fino al ${fmtDate(user.activity.plus.until || B.fineSessione().toISOString())}</span>` : `<button class="btn btn-primary" data-plus>Prendi Plus</button>` },
    ];
    const L = Object.fromEntries(P.lista.map((x) => [x.k, x]));
    return `<div class="v4-pz">${C.map((x) => `<div class="v4-pzc ${L[x.k].hot ? "ev" : ""} ${x.k === "plus" ? "plus" : ""}">${L[x.k].hot ? '<span class="v4-tag">Il più scelto</span>' : ""}
      <span class="sq-label">${esc(L[x.k].tipo)}</span><h3>${esc(L[x.k].nome)}</h3><div class="v4-p"><b>${eur(x.p).replace("€", "")}</b><span>€</span></div><p class="tiny ${x.k === "plus" ? "" : "muted"}">${esc(x.sub)}</p>
      <p class="small" style="flex:1">${esc(L[x.k].d)}</p>${x.on ? '<span class="badge badge-green">Attivo</span>' : x.cta || '<span class="small muted">Quando la tua area sarà attiva</span>'}</div>`).join("")}</div>`;
  };
  // calcolatore del pacchetto (stessa logica della landing v5), con acquisto vero nella demo
  function calcolatore(root, user) {
    const box = root.querySelector("[data-calc]"); if (!box) return;
    const cds = cdsDi(user), sc = { anno: String(annoDi(user)), sem: "1", quando: B.inSessione() ? "in" : "fuori", plus: false, scelte: {} };
    const esamiDi = (a, s) => B.courses().filter((c) => c.anno === Number(a) && (s === "entrambi" || c.sem === Number(s)) && c.cds.includes(cds));
    const prezzoDi = (c, t, q) => { const v = t === "completa" && B.haCompleta(c) ? B.prezzoCompleta(c) : P.prezzi.appunti; return v[q === "fuori" ? 0 : 1]; };
    const tipoDi = (c) => B.owns(user, c.slug) && sc.scelte[c.slug] === undefined ? "gia" : sc.scelte[c.slug] || (B.haCompleta(c) ? "completa" : "appunti");
    const draw = () => {
      const tutti = esamiDi(sc.anno, sc.sem), presi = tutti.filter((c) => !["no", "gia"].includes(tipoDi(c)));
      const singoli = presi.reduce((n, c) => n + prezzoDi(c, tipoDi(c), sc.quando), 0);
      const valore = tutti.reduce((n, c) => n + prezzoDi(c, "completa", sc.quando), 0);
      const pac = sc.sem === "entrambi" ? P.prezzi.anno : P.prezzi.semester, nomePac = sc.sem === "entrambi" ? "Pacchetto anno" : "Pacchetto semestre";
      const totS = singoli + (sc.plus ? P.prezzi.plus : 0), totP = pac + (sc.plus ? P.prezzi.plusConPacchetto : 0), diff = totS - totP;
      const pct = (x) => Math.max(6, Math.round((x / Math.max(totS, totP, 1)) * 100));
      let tit, txt, forte = true;
      if (!presi.length) { tit = "Scegli almeno un esame"; txt = "Tocca gli esami che pensi di preparare: ti diciamo come spendere meno."; forte = false; }
      else if (diff >= 0) { tit = `Prendi il ${nomePac}: risparmi ${eur(diff)}`; txt = `${tutti.length} dispense complete a ${eur(pac)} invece di ${eur(singoli)} per ${presi.length === tutti.length ? "comprarle una per una" : `i ${presi.length} esami che hai scelto`}.`; }
      else if (-diff <= 12 && valore > pac) { tit = `Con ${eur(-diff)} in più hai ${sc.sem === "entrambi" ? "tutto l'anno" : "tutto il semestre"}`; txt = `Il ${nomePac} include le complete di tutti i ${tutti.length} esami: una per una costerebbero ${eur(valore)}.`; }
      else if (-diff <= 12) { tit = "Costano quasi uguale: scegli tu"; txt = `Qui il pacchetto non fa risparmiare sulle dispense, ma è un solo acquisto${sc.plus ? "" : ` e con un pacchetto Plus costa ${eur(P.prezzi.plus - P.prezzi.plusConPacchetto)} in meno`}.`; forte = false; }
      else { tit = "Per questi esami ti bastano i singoli"; txt = `Il ${nomePac} conviene se pensi di dare anche gli altri: ${tutti.length} complete a ${eur(pac)} invece di ${eur(valore)}.`; forte = false; }
      const seg = (k, v, t, on) => `<button type="button" data-${k}="${v}" class="${on ? "on" : ""}">${t}</button>`;
      box.innerHTML = `<div class="v4-calc"><div class="card">
          <div class="field"><label>Anno</label><div class="seg">${["1", "2", "3"].map((a) => seg("ca", a, ROMAN[a] + " anno", a === sc.anno)).join("")}</div></div>
          <div class="field"><label>Semestre</label><div class="seg">${[["1", "I semestre"], ["2", "II semestre"], ["entrambi", "Tutto l'anno"]].map(([v, t]) => seg("cs", v, t, v === sc.sem)).join("")}</div></div>
          <div class="field"><label>Quando compri</label><div class="seg">${seg("cq", "fuori", "Fuori sessione", sc.quando === "fuori")}${seg("cq", "in", "In sessione", sc.quando === "in")}</div></div>
          <label class="sq-label" style="margin-top:10px;display:block">I tuoi esami · cosa compreresti singolarmente</label>
          <ul class="v4-esami">${tutti.map((c) => { const t = tipoDi(c); return `<li class="${["no", "gia"].includes(t) ? "off" : ""}"><span>${esc(c.title)}<small>${ROMAN[c.sem]} sem.${t === "gia" ? " · già tuo" : ""}</small></span>
            <span class="seg sm">${seg("ce", c.slug + "|appunti", "Appunti", t === "appunti")}${B.haCompleta(c) ? seg("ce", c.slug + "|completa", "Completa", t === "completa") : ""}${seg("ce", c.slug + "|no", "✕", t === "no" || t === "gia")}</span>
            <b>${["no", "gia"].includes(t) ? "—" : eur(prezzoDi(c, t, sc.quando))}</b></li>`; }).join("")}</ul>
          <label class="check" style="margin-top:10px"><input type="checkbox" data-cp ${sc.plus ? "checked" : ""}> Aggiungi UniLink Plus</label></div>
        <div class="card stack">
          <div class="v4-r"><span>Uno per uno · ${presi.length} ${presi.length === 1 ? "esame" : "esami"}${sc.plus ? " + Plus" : ""}</span><b>${eur(totS)}</b></div><div class="v4-bar"><i style="width:${pct(totS)}%"></i></div>
          <div class="v4-r ev"><span>${nomePac} · ${tutti.length} complete${sc.plus ? " + Plus" : ""}</span><b>${eur(totP)}</b></div><div class="v4-bar ev"><i style="width:${pct(totP)}%"></i></div>
          <div class="v4-cons ${forte ? "forte" : ""}"><span class="sq-label">Il nostro consiglio</span><h3>${tit}</h3><p class="small">${txt}</p></div>
          <button class="btn ${forte ? "btn-orange" : "btn-primary"} btn-block" data-compra>${forte && presi.length ? "Prendi il " + nomePac : "Prendi il " + nomePac + " comunque"}</button>
          <p class="tiny muted">Prezzi ${sc.quando === "fuori" ? "fuori sessione" : "in sessione"} · ${esc(P.stato)} · pagamento simulato.</p></div></div>`;
      const on = (sel, fn) => box.querySelectorAll(sel).forEach((b) => (b.onclick = () => { fn(b); draw(); }));
      on("[data-ca]", (b) => (sc.anno = b.dataset.ca)); on("[data-cs]", (b) => (sc.sem = b.dataset.cs)); on("[data-cq]", (b) => (sc.quando = b.dataset.cq));
      on("[data-ce]", (b) => { const [s, t] = b.dataset.ce.split("|"); sc.scelte[s] = t; });
      box.querySelector("[data-cp]").onchange = (e) => { sc.plus = e.target.checked; draw(); };
      box.querySelector("[data-compra]").onclick = () => {
        const it = sc.sem === "entrambi" ? B.annoItem(cds, sc.anno) : B.semItem(cds, sc.anno, sc.sem);
        B.checkout(user, it, () => { if (sc.plus && !B.plus(user)) B.checkout(user, B.plusItem(user), () => UL.app.refresh()); else UL.app.refresh(); });
      };
    };
    draw();
  }
  UL.views.abbonamentoU = {
    title: "Abbonamento",
    render(user, params) {
      const tab = ["calcola", "ordini"].includes(params[0]) ? params[0] : "piano", plus = B.plus(user), ps = user.activity.purchases;
      const tuoi = user.activity.exams.map((e) => B.course(e.slug)).filter(Boolean);
      const LV = { none: ["Solo scheda e quiz di prova", "badge-soft"], appunti: ["Appunti", "badge-yellow"], completa: ["Completa", "badge-green"] };
      return `${head("Account", "euro", `Il tuo <span class="accent">piano</span>`, `Singoli esami, pacchetti e Plus. Quello che compri resta tuo; Plus vale fino a fine sessione. ${esc(P.stato)}.`)}
        <div class="tabs"><a href="#/app/abbonamento" class="${tab === "piano" ? "on" : ""}">${icon("spark")} Il tuo piano</a><a href="#/app/abbonamento/calcola" class="${tab === "calcola" ? "on" : ""}">${icon("calc")} Calcola il pacchetto</a><a href="#/app/abbonamento/ordini" class="${tab === "ordini" ? "on" : ""}">${icon("file")} Ordini <span class="cnt">${ps.length}</span></a></div>
        ${tab === "ordini" ? UL.views.acquistiB.render(user).replace(/<div class="page-head">[\s\S]*?<\/div><\/div>/, "")
        : tab === "calcola" ? `<p class="muted" style="margin-bottom:16px">Scegli i tuoi esami e cosa compreresti: vedi quanto spenderesti uno per uno e il modo per spendere meno. Gli esami che hai già non si pagano due volte.</p><div data-calc></div>${quando()}`
        : `<div class="grid g-ov" style="margin-bottom:22px">
          <section class="card navy c-7"><span class="badge badge-orange">Il tuo piano</span><h2 style="margin:12px 0 8px">${esc(B.planName(user))}</h2>
            <p style="color:rgba(255,255,255,.78)">${plus ? `Plus attivo fino al ${fmtDate(user.activity.plus.until || B.fineSessione().toISOString())}: Planner personale, ripasso degli errori e CV completo su tutti gli esami.` : "Le dispense si comprano per esame o a pacchetti; il metodo (Planner, ripasso errori, CV) è Plus, una volta per sessione."}</p>
            <div class="row" style="margin-top:18px">${plus ? `<a class="btn btn-white" href="#/app/planner">Apri il Planner</a>` : `<button class="btn btn-white btn-arrow" data-plus>Prendi Plus · ${eur(B.prezzoPlus(user))} <span class="arr">${icon("arrow")}</span></button>`}<a class="btn btn-ghost" style="color:#fff;border-color:rgba(255,255,255,.4)" href="#/app/abbonamento/calcola">Calcola il pacchetto</a></div></section>
          <section class="c-5 stack">
            <div class="stat"><span class="k">${icon("book")} Esami con materiali</span><span class="v">${B.courses().filter((c) => B.owns(user, c.slug)).length}</span><span class="s">${B.courses().filter((c) => B.ownsCompleta(user, c.slug)).length} con la dispensa completa</span></div>
            <div class="stat"><span class="k">${icon("spark")} Regali dell'account</span><span class="v">${Math.max(0, B.gratisDisponibili(user))}</span><span class="s">Appunti gratis da scegliere · ${B.gratisUsati(user)} già usati</span></div></section></div>
        ${cardPrezzi(user)}${quando()}
        ${tuoi.length ? `<div class="card section" style="margin-top:22px"><div class="card-head"><h3>${icon("layers")} I tuoi esami: cosa hai e cosa puoi sbloccare</h3></div><div class="table-wrap"><table class="table"><thead><tr><th>Esame</th><th>Hai</th><th>Ti manca</th><th></th></tr></thead><tbody>
          ${tuoi.map((c) => { const lv = B.level(user, c.slug); return `<tr><td><a href="#/app/scheda/${c.slug}">${esc(c.title)}</a></td><td><span class="badge ${LV[lv][1]}">${LV[lv][0]}</span></td>
            <td class="small">${lv === "completa" ? "Niente: hai tutto per questo esame" : lv === "appunti" ? (B.haCompleta(c) ? (c.mappe ? "Mappe, quiz e simulazioni" : "Quiz e simulazioni") : "Mappe e quiz non ancora disponibili") : "Appunti" + (B.haCompleta(c) ? ", quiz e simulazioni" : "")}</td>
            <td>${lv === "completa" || (lv === "appunti" && !B.haCompleta(c)) ? "" : `<button class="btn btn-sm ${B.puoGratis(user, c.slug) ? "btn-primary" : "btn-orange"}" data-up="${c.slug}">${B.puoGratis(user, c.slug) ? "Gratis per te" : "Sblocca"}</button>`}</td></tr>`; }).join("")}</tbody></table></div></div>` : ""}
        <div style="margin-top:22px">${tabellaDentro(user)}</div>`}`;
    },
    mount(root, user) {
      root.querySelectorAll("[data-plus]").forEach((b) => b.addEventListener("click", () => B.checkout(user, B.plusItem(user), () => UL.app.refresh())));
      root.querySelectorAll("[data-up]").forEach((b) => b.addEventListener("click", () => B.upsell(user, b.dataset.up)));
      calcolatore(root, user);
    },
  };

  /* ---------- 4 · UniLink Planner (P3) ----------
     Deciso in chat: il piano si calcola UNA volta alla creazione (niente ricalcolo); se salti, le missioni restano in ordine
     e si mostra il ritardo; rigenerare è una scelta dello studente. Fasce: Passare 18–21 · Buono 22–25 · Ottimo 26–28 · Massimo 29–30L.
     Ore utili = giorni × ore nette × (1 − margine 15–20%). Sessioni da 45′. Numeri di sessioni per fascia: da calibrare con dati veri. */
  const PL = {
    min: 45,
    fasce: [
      { id: "passare", nome: "Passare", voto: "18–21", s: 40, cosa: "Lezione + un esercizio per capitolo, 2 simulazioni" },
      { id: "buono", nome: "Buono", voto: "22–25", s: 52, cosa: "+ ripassi di blocco, 3 simulazioni" },
      { id: "ottimo", nome: "Ottimo", voto: "26–28", s: 64, cosa: "+ seconda sessione di esercizi, 4 simulazioni, registro errori" },
      { id: "massimo", nome: "Massimo", voto: "29–30L", s: 78, cosa: "+ approfondimenti, domande d'orale, 6 simulazioni" },
    ],
    fasi: [["Avvio", 0.06], ["Basi", 0.32], ["Approfondimento", 0.27], ["Allenamento d'esame", 0.23], ["Rifinitura", 0.12]],
    giorni: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
    disclaimer: "Le fasce dicono quanto lavoro prevede il metodo per quel voto: non garantiamo il risultato.",
    TIPI: { Lezione: "t-lez", Esercizi: "t-ese", Test: "t-test", Ripasso: "t-rip", Simulazione: "t-sim", Errori: "t-err" },
  };
  const n1 = (x) => Number(x).toLocaleString("it-IT", { maximumFractionDigits: 1 });
  // chi può creare il piano personale di un esame: Completa di quell'esame (anche da pacchetto) oppure Plus (tutti gli esami)
  B.puoPianificare = (user, slug) => B.plus(user) || B.ownsCompleta(user, slug);
  const fascia = (id) => PL.fasce.find((f) => f.id === id) || PL.fasce[2];
  const capitoli = (c) => { const t = [...new Set(B.questions(c.slug).map((q) => q.topic))]; return t.length ? t : Array.from({ length: Math.max(5, Math.round((c.cfu || 6) * 0.8)) }, (_, i) => "Capitolo " + (i + 1)); };
  const sessioniTot = (c, f) => Math.round(fascia(f).s * ((c.cfu || 9) / 9));
  const giorno0 = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const iso = (d) => giorno0(d).toISOString().slice(0, 10);
  const giorniUtili = (cfg) => { let n = 0; const fine = giorno0(cfg.appello); for (let d = giorno0(cfg.dal || new Date()); d < fine; d.setDate(d.getDate() + 1)) if (cfg.giorni.includes(d.getDay())) n++; return n; };
  const perGiorno = (cfg) => Math.max(1, Math.floor((cfg.ore * 60 * (1 - cfg.margine)) / PL.min));
  const stima = (c, cfg) => { const tot = sessioniTot(c, cfg.fascia), gu = giorniUtili(cfg), utili = gu * cfg.ore * (1 - cfg.margine), serve = (tot * PL.min) / 60; return { tot, gu, utili, serve, ok: utili >= serve }; };
  function genera(c, cfg) {
    const tot = sessioniTot(c, cfg.fascia), caps = capitoli(c), pf = PL.fasi.map(([, q]) => Math.round(tot * q)); pf[4] += tot - pf.reduce((a, b) => a + b, 0);
    const S = [];
    const add = (fase, cap, tipo) => S.push({ fase, cap, tipo, data: "", fatto: "", esito: "", errori: 0 });
    for (let i = 0; i < pf[0]; i++) add(0, i === 0 ? "Indice e programma" : "Prova diagnostica", i === 0 ? "Lezione" : "Test");
    for (let i = 0; i < pf[1]; i++) add(1, caps[Math.floor(i / 3) % caps.length], ["Lezione", "Esercizi", "Test"][i % 3]);
    for (let i = 0; i < pf[2]; i++) add(2, i % 4 === 3 ? `Ripasso di blocco` : caps[Math.floor(i / 1.4) % caps.length], i % 4 === 3 ? "Ripasso" : i % 2 ? "Esercizi" : "Lezione");
    for (let i = 0; i < pf[3]; i++) add(3, i % 2 ? "Registro errori" : `Simulazione ${Math.floor(i / 2) + 1}`, i % 2 ? "Errori" : "Simulazione");
    for (let i = 0; i < pf[4]; i++) add(4, i === pf[4] - 1 ? "Vigilia: ripasso leggero" : caps[i % caps.length], "Ripasso");
    // calendario: dalla data di creazione all'appello escluso, nei giorni scelti, «perGiorno» sessioni al giorno
    const fine = giorno0(cfg.appello), pg = perGiorno(cfg); let k = 0;
    for (let d = giorno0(cfg.dal || new Date()); d < fine && k < S.length; d.setDate(d.getDate() + 1)) if (cfg.giorni.includes(d.getDay())) for (let j = 0; j < pg && k < S.length; j++) S[k++].data = iso(d);
    return S;
  }
  const piani = (user) => (user.activity.planner = user.activity.planner || {});
  // account di esempio: il piano viene generato al primo accesso con qualche sessione già fatta
  const prepara = (user) => Object.entries(piani(user)).forEach(([slug, p]) => {
    if (p.sessioni || !B.course(slug)) return;
    p.sessioni = genera(B.course(slug), { ...p, dal: p.creato });
    p.sessioni.forEach((s, i) => { if (i < (p.fatte || 0)) { s.fatto = s.data || iso(p.creato); if (["Test", "Simulazione"].includes(s.tipo)) { s.esito = ["Sicuro", "Così così", "Da rivedere"][i % 3]; s.errori = i % 3; } } });
    delete p.fatte; UL.store.save();
  });
  const stato = (p) => { const oggi = iso(new Date()); const indietro = p.sessioni.filter((s) => !s.fatto && s.data && s.data < oggi).length; const fuori = p.sessioni.filter((s) => !s.data).length; return { indietro, fuori }; };

  function variabiliForm(user, c, cfg, plus) {
    const st = stima(c, cfg), mine = user.activity.exams.map((e) => B.course(e.slug)).filter((x) => x && x.anno);
    const opzioni = (mine.length ? mine : B.courses().filter((x) => B.hasQuiz(x.slug)));
    return `<div class="grid g-ov"><section class="card c-7">
        <div class="card-head"><h3>${icon("target")} Costruisci il tuo piano</h3><span class="badge badge-soft">metodo standard · ${esc(c.title)}</span></div>
        <div class="grid-2"><div class="field"><label>Esame</label><select class="select" data-pv="slug">${opzioni.map((x) => `<option value="${x.slug}" ${x.slug === c.slug ? "selected" : ""}>${esc(x.title)} · ${x.cfu || "?"} CFU</option>`).join("")}</select></div>
          <div class="field"><label>Data dell'appello</label><input class="input" type="date" data-pv="appello" value="${esc(cfg.appello)}"></div></div>
        <label class="sq-label" style="display:block;margin:12px 0 8px">Fascia di voto obiettivo</label>
        <div class="v4-fasce">${PL.fasce.map((f) => `<button type="button" class="${f.id === cfg.fascia ? "on" : ""}" data-pf="${f.id}"><b>${f.nome}</b><span>${f.voto}</span><small>${sessioniTot(c, f.id)} sessioni</small></button>`).join("")}</div>
        <p class="small" style="margin-top:8px">${esc(fascia(cfg.fascia).cosa)}</p><p class="tiny muted">${esc(PL.disclaimer)}</p>
        <label class="sq-label" style="display:block;margin:14px 0 8px">Giorni in cui studi</label>
        <div class="v4-gg">${[1, 2, 3, 4, 5, 6, 0].map((g) => `<button type="button" class="${cfg.giorni.includes(g) ? "on" : ""}" data-pg="${g}">${PL.giorni[g][0].toUpperCase()}</button>`).join("")}</div>
        <div class="grid-2" style="margin-top:12px"><div class="field"><label>Ore nette al giorno</label><input class="input" type="number" min="0.5" max="10" step="0.5" data-pv="ore" value="${cfg.ore}"></div>
          <div class="field"><label>Margine per imprevisti (consigliato 15–20%)</label><input class="input" type="number" min="0" max="40" step="1" data-pv="margine" value="${Math.round(cfg.margine * 100)}"></div></div></section>
      <section class="c-5 stack"><div class="card ${st.ok ? "" : "beige"}"><span class="sq-label">Ci stai nei tempi?</span>
          <div class="v4-r" style="margin-top:10px"><span>Ore che servono (${fascia(cfg.fascia).nome})</span><b>${n1(st.serve)} h</b></div><div class="v4-bar ev"><i style="width:${Math.min(100, (st.serve / Math.max(st.utili, st.serve, 1)) * 100)}%"></i></div>
          <div class="v4-r"><span>Ore utili fino all'appello</span><b>${n1(st.utili)} h</b></div><div class="v4-bar"><i style="width:${Math.min(100, (st.utili / Math.max(st.utili, st.serve, 1)) * 100)}%"></i></div>
          <p class="tiny muted">${st.gu} giorni × ${n1(cfg.ore)} h − margine ${Math.round(cfg.margine * 100)}% · ${st.tot} sessioni da ${PL.min}′ · ${perGiorno(cfg)} al giorno</p>
          <p style="margin-top:10px"><span class="badge ${st.ok ? "badge-green" : "badge-red"}">${st.ok ? `Fattibile · ${n1(st.utili - st.serve)} h di riserva` : `Non ci stai: mancano ${n1(st.serve - st.utili)} h`}</span></p>
          ${st.ok ? "" : '<p class="small" style="margin-top:8px">Aggiungi giorni o ore, oppure scegli una fascia più bassa.</p>'}</div>
        ${plus ? `<button class="btn btn-orange btn-arrow btn-block" data-crea>${piani(user)[c.slug] ? "Rigenera il piano" : "Crea il piano"} <span class="arr">${icon("arrow")}</span></button><p class="tiny muted">Il piano si calcola una volta sola: ${piani(user)[c.slug] ? "rigenerarlo azzera le date (le sessioni fatte restano fatte)." : "se salti una sessione, le missioni restano in ordine e vedi il ritardo."}</p>`
          : U.lock("Il piano personale di " + c.title, B.haCompleta(c) ? `Con la dispensa completa (${eur(B.prezzo("completa", c))}) o con Plus per tutti gli esami (${eur(B.prezzoPlus(user))})` : `Con Plus (${eur(B.prezzoPlus(user))}): per questo esame la completa non c'è ancora`, `data-v4plan="${c.slug}"`)}</section></div>`;
  }
  function metodoStandard(c) {
    const caps = capitoli(c);
    return `<div class="card section"><div class="card-head"><h3>${icon("book")} Il metodo standard di ${esc(c.title)}</h3><span class="badge badge-green">per tutti</span></div>
      <p class="small muted" style="margin-bottom:12px">Fasi uguali per tutti gli esami; cambiano capitoli e numero di sessioni per fascia. È il metodo: il piano personale lo mette sui tuoi giorni.</p>
      <div class="v4-fasi">${PL.fasi.map(([n, q], i) => `<div><span class="sq-label">Fase ${i + 1}</span><b>${n}</b><span class="tiny muted">${Math.round(q * 100)}% delle sessioni</span></div>`).join("")}</div>
      <div class="table-wrap" style="margin-top:14px"><table class="table"><thead><tr><th>Fascia</th><th>Voto</th><th class="num">Sessioni da 45′</th><th class="num">Ore</th><th>Cosa cambia</th></tr></thead><tbody>${PL.fasce.map((f) => `<tr><td>${f.nome}</td><td>${f.voto}</td><td class="num">${sessioniTot(c, f.id)}</td><td class="num">${Math.round((sessioniTot(c, f.id) * PL.min) / 60)}</td><td class="small">${f.cosa}</td></tr>`).join("")}</tbody></table></div>
      <p class="small" style="margin-top:12px">Capitoli: ${caps.map(esc).join(" · ")}</p></div>`;
  }
  const VISTE = [["variabili", "Variabili", "settings"], ["percorso", "Percorso", "chart"], ["missioni", "Missioni", "check"], ["calendario", "Calendario", "calendar"], ["oggi", "Oggi", "clock"], ["completate", "Completate", "file"]];
  function vistaPlus(user, c, p, v) {
    const S = p.sessioni, fatte = S.filter((s) => s.fatto).length, st = stato(p), oggi = iso(new Date());
    const tag = (s) => `<span class="v4-t ${PL.TIPI[s.tipo] || ""}">${esc(s.tipo)}</span>`;
    const pf = PL.fasi.map((_, i) => S.filter((s) => s.fase === i)), faseOra = Math.max(0, pf.findIndex((l) => l.some((s) => !s.fatto)));
    const prossima = S.find((s) => !s.fatto);
    const caps = capitoli(c), DESC = ["Indice, prova d'esame, diagnostico", `${caps.length} capitoli: lezione, esercizi, test`, "Seconda passata e ripassi di blocco", "Simulazioni a tempo + registro errori", "Ripasso finale e vigilia"];
    if (v === "percorso") return `<div class="v4-pt"><div class="ring">${UL.ui.ring(Math.round((fatte / S.length) * 100), 110, 12)}<div class="lbl"><b>${Math.round((fatte / S.length) * 100)}%</b><span class="tiny muted">completato</span></div></div><div class="stats">
        <div class="stat"><span class="k">Sessioni fatte</span><span class="v">${fatte} / ${S.length}</span><span class="s">da ${PL.min} minuti</span></div>
        <div class="stat"><span class="k">Ore studiate</span><span class="v">${n1((fatte * PL.min) / 60)} h</span><span class="s">ritmo ${n1(p.ore)} h al giorno</span></div>
        <div class="stat"><span class="k">Rispetto al piano</span><span class="v" style="color:${st.indietro ? "var(--red)" : "var(--green)"}">${st.indietro ? st.indietro + " indietro" : "In linea"}</span><span class="s">piano creato il ${fmtDate(p.creato)}</span></div>
        <div class="stat"><span class="k">Appello</span><span class="v">${B.daysTo(p.appello)}<small> giorni</small></span><span class="s">${fmtDate(p.appello)} · ${fascia(p.fascia).nome} ${fascia(p.fascia).voto}</span></div></div></div>
      <div class="v4-fasi big">${pf.map((l, i) => { const f = l.filter((s) => s.fatto).length; return `<div class="${f === l.length ? "fatta" : i === faseOra ? "ora" : ""}"><span class="sq-label">Fase ${i + 1}${i === faseOra ? " · ora" : ""}</span><b>${PL.fasi[i][0]}</b><span class="tiny muted">${DESC[i]}</span><div class="v4-bar ${i === faseOra ? "ev" : ""}"><i style="width:${(f / Math.max(1, l.length)) * 100}%"></i></div><span class="tiny muted">${f} / ${l.length} sessioni</span></div>`; }).join("")}</div>
      ${prossima ? `<div class="card" style="margin-top:16px"><div class="row between"><div><span class="sq-label">Prossima sessione · ${PL.min} min</span><h3 style="margin-top:6px">${esc(prossima.cap)} · ${esc(prossima.tipo)}</h3><p class="small muted">${prossima.data ? "prevista " + fmtDate(prossima.data) : "fuori dal tempo disponibile"}</p></div><div class="row"><a class="btn btn-ghost" href="${B.hasQuiz(c.slug) && ["Test", "Simulazione", "Errori"].includes(prossima.tipo) ? "#/app/esercitazioni/" + c.slug : esc(c.pdf || "#")}" ${B.hasQuiz(c.slug) && ["Test", "Simulazione", "Errori"].includes(prossima.tipo) ? "" : 'target="_blank" rel="noopener"'}>Inizia →</a><button class="btn btn-primary" data-fatto="${S.indexOf(prossima)}">Segna come fatta</button></div></div></div>` : `<div class="card"><h3>Piano completato</h3><p class="muted">Tutte le sessioni sono fatte. In bocca al lupo!</p></div>`}
      ${st.fuori ? `<div class="banner" style="margin-top:14px">${icon("info")}<span>${st.fuori} sessioni non entrano prima dell'appello: aggiungi giorni o ore e rigenera il piano.</span></div>` : ""}`;
    if (v === "missioni") { const tutte = S.map((s, i) => ({ s, i })).filter(({ s }) => s.fase === faseOra), fatteF = tutte.filter((x) => x.s.fatto), daFare = tutte.filter((x) => !x.s.fatto);
      const lista = fatteF.slice(-2).concat(daFare.slice(0, 7)), altre = daFare.length - Math.min(7, daFare.length);
      return `<div class="grid g-ov"><section class="card c-8"><div class="card-head"><h3>Fase ${faseOra + 1} · ${PL.fasi[faseOra][0]}</h3><span class="small muted">${fatteF.length} di ${tutte.length} sessioni</span></div>
        <ul class="v4-task">${lista.map(({ s, i }) => `<li class="${s.fatto ? "done" : ""}"><button class="v4-cb" data-fatto="${i}" aria-label="Segna">${s.fatto ? icon("check") : ""}</button><span>${esc(s.cap)}${s.data ? `<small>${fmtDate(s.data)}${!s.fatto && s.data < oggi ? " · in ritardo" : ""}</small>` : "<small>fuori tempo</small>"}</span>${tag(s)}<span class="tiny muted">${PL.min}′</span></li>`).join("")}${altre > 0 ? `<li class="muted"><span class="v4-cb"></span><span>+ ${altre} missioni in questa fase</span></li>` : ""}</ul></section>
        <section class="c-4 stack"><div class="card beige"><span class="sq-label">Metodo standard</span><p class="small" style="margin-top:6px">Ogni capitolo: Lezione → Esercizi → Test. Ogni tre capitoli un ripasso di blocco. Lo stesso schema per tutti gli esami del gruppo.</p></div>
          <div class="card"><span class="sq-label">Dopo un test</span><p class="small" style="margin-top:6px">Quando segni un Test o una Simulazione scegli «Da rivedere», «Così così» o «Sicuro»: «Da rivedere» aggiunge un ripasso mirato senza spostare il resto del piano.</p></div></section></div>`; }
    if (v === "calendario") { const lun = giorno0(new Date()); lun.setDate(lun.getDate() - ((lun.getDay() + 6) % 7));
      return `<div class="row between" style="margin-bottom:10px"><b class="display">Le prossime tre settimane</b><span class="v4-leg">${Object.keys(PL.TIPI).map((t) => `<span class="v4-t ${PL.TIPI[t]}">${t}</span>`).join("")}</span></div>
        <div class="v4-cal">${["lun", "mar", "mer", "gio", "ven", "sab", "dom"].map((g) => `<span class="h">${g}</span>`).join("")}${Array.from({ length: 21 }, (_, k) => { const d = new Date(lun); d.setDate(d.getDate() + k); const id = iso(d), del = S.filter((s) => s.data === id);
          return `<div class="${id === oggi ? "oggi" : ""} ${id < oggi ? "pass" : ""} ${id === iso(p.appello) ? "esame" : ""}"><span>${d.getDate()}${id === oggi ? " · oggi" : ""}</span>${id === iso(p.appello) ? `<b>Esame</b>` : del.length ? del.map((s) => `<i class="${PL.TIPI[s.tipo]} ${s.fatto ? "f" : ""}" title="${esc(s.cap)}">${esc(s.cap.length > 14 ? s.cap.slice(0, 13) + "…" : s.cap)}</i>`).join("") : `<em>${p.giorni.includes(d.getDay()) ? "" : "riposo"}</em>`}</div>`; }).join("")}</div>
        <p class="tiny muted" style="margin-top:10px">Le sessioni sono fissate alla creazione del piano: il calendario non si riorganizza da solo.</p>`; }
    if (v === "oggi") { const og = S.map((s, i) => ({ s, i })).filter(({ s }) => s.data === oggi), rit = S.map((s, i) => ({ s, i })).filter(({ s }) => !s.fatto && s.data && s.data < oggi);
      const riga = ({ s, i }) => `<li class="${s.fatto ? "done" : ""}"><button class="v4-cb" data-fatto="${i}">${s.fatto ? icon("check") : ""}</button><span>${esc(s.cap)}<small>${esc(s.tipo)} · ${PL.min}′</small></span>${tag(s)}</li>`;
      return `<div class="grid g-ov"><section class="card c-8"><div class="card-head"><h3>${icon("clock")} Cosa fai oggi</h3><span class="small muted">${og.length} sessioni · ${n1((og.length * PL.min) / 60)} h</span></div>
        ${og.length ? `<ul class="v4-task">${og.map(riga).join("")}</ul>` : '<p class="muted">Oggi è un giorno di riposo nel tuo piano.</p>'}
        ${rit.length ? `<h3 style="margin:16px 0 8px">In ritardo</h3><ul class="v4-task">${rit.slice(0, 6).map(riga).join("")}</ul>` : ""}</section>
        <section class="c-4 stack"><div class="stat"><span class="k">Stato del piano</span><span class="v" style="color:${st.indietro ? "var(--red)" : "var(--green)"}">${st.indietro ? st.indietro + " indietro" : "In linea"}</span><span class="s">${st.indietro ? `Domani avrai ${og.length + st.indietro} sessioni da recuperare: il piano non cambia, ti mostriamo il ritardo.` : "Il piano non cambia da solo: se resti indietro, rigeneralo da «Variabili»."}</span></div>
          ${(() => { const lun = giorno0(new Date()); lun.setDate(lun.getDate() - ((lun.getDay() + 6) % 7)); const dom = new Date(lun); dom.setDate(dom.getDate() + 7); const sett = S.filter((s) => s.data && s.data >= iso(lun) && s.data < iso(dom)), ok = sett.filter((s) => s.fatto).length;
            return `<div class="card"><span class="sq-label">Settimana</span><div class="v4-r" style="margin-top:8px"><span>Sessioni fatte</span><b style="font-size:18px">${ok} / ${sett.length}</b></div><div class="v4-bar ev"><i style="width:${sett.length ? (ok / sett.length) * 100 : 0}%"></i></div>
              <div class="v4-r"><span>Ore nette</span><b style="font-size:18px">${n1((ok * PL.min) / 60)} / ${n1((sett.length * PL.min) / 60)} h</b></div><div class="v4-bar"><i style="width:${sett.length ? (ok / sett.length) * 100 : 0}%"></i></div></div>`; })()}</section></div>`; }
    if (v === "completate") { const fl = S.map((s, i) => ({ s, i })).filter(({ s }) => s.fatto).reverse(), err = S.reduce((n, s) => n + (s.errori || 0), 0), ult = (fl.find(({ s }) => ["Test", "Simulazione"].includes(s.tipo)) || {}).s;
      return `${ult ? `<div class="card" style="margin-bottom:16px"><div class="row between"><div><span class="sq-label">Ultimo test completato</span><h2 style="margin-top:6px">Fatto: ${esc(ult.cap)} · <span class="accent">${esc(ult.tipo)}</span></h2></div><span class="badge badge-green">${icon("check")} ${fatte} / ${S.length} sessioni</span></div>
          <div class="row" style="gap:28px;margin-top:12px"><div><b class="display" style="font-size:28px;color:var(--navy)">${Math.max(0, 10 - (ult.errori || 0))} / 10</b><div class="tiny muted">risposte giuste</div></div><div><b class="display" style="font-size:28px;color:var(--navy)">${ult.errori || 0}</b><div class="tiny muted">errori nel registro</div></div>
            <div><span class="sq-label">Come ti senti su questo capitolo?</span><div class="seg" style="margin-top:6px">${["Da rivedere", "Così così", "Sicuro"].map((x) => `<button class="${ult.esito === x ? "on" : ""}" disabled>${x}</button>`).join("")}</div></div></div>
          <p class="tiny muted" style="margin-top:10px">Gli errori tornano nel registro finché non li indovini due volte di fila. Nessuna sessione si sposta.</p></div>` : ""}
        <div class="grid g-ov"><section class="card c-8"><div class="card-head"><h3>${icon("file")} Completate</h3><span class="small muted">${fl.length} sessioni</span></div>
        <ul class="v4-task">${fl.slice(0, 20).map(({ s, i }) => `<li class="done"><span class="v4-cb">${icon("check")}</span><span>${esc(s.cap)}<small>${fmtDate(s.fatto)}${s.errori ? ` · ${s.errori} errori nel registro` : ""}</small></span>${s.esito ? `<span class="badge ${s.esito === "Sicuro" ? "badge-green" : s.esito === "Così così" ? "badge-yellow" : "badge-red"}">${s.esito}</span>` : tag(s)}</li>`).join("") || '<li class="muted">Nessuna sessione ancora.</li>'}</ul></section>
        <section class="c-4 stack"><div class="stat"><span class="k">Errori nel registro</span><span class="v">${err}</span><span class="s">tornano nelle sessioni di ripasso finché non li indovini due volte di fila</span></div>
          <a class="btn btn-ghost" href="#/app/esercitazioni/${c.slug}">${icon("quiz")} Ripassa gli errori</a></section></div>`; }
    return "";
  }
  function anteprimaBloccata(user, c) {
    // ciò che vede chi non ha Plus: le sezioni del piano con dati di esempio, sfocate, e cosa serve per averle
    return `<div class="v4-blur"><div class="v4-blur-in" aria-hidden="true">
        <div class="stats"><div class="stat"><span class="k">Completato</span><span class="v">38%</span></div><div class="stat"><span class="k">Ore studiate</span><span class="v">18 h</span></div><div class="stat"><span class="k">Rispetto al piano</span><span class="v">In linea</span></div><div class="stat"><span class="k">Appello</span><span class="v">26 giorni</span></div></div>
        <div class="v4-fasi big" style="margin-top:14px">${PL.fasi.map(([n], i) => `<div class="${i < 2 ? "fatta" : i === 2 ? "ora" : ""}"><span class="sq-label">Fase ${i + 1}</span><b>${n}</b><div class="v4-bar"><i style="width:${[100, 100, 20, 0, 0][i]}%"></i></div></div>`).join("")}</div></div>
      <div class="v4-blur-msg"><span class="badge badge-orange">Completa o Plus</span><h3>Il piano di ${esc(c.title)}, sui tuoi giorni</h3><p class="small">Percorso per fasi, missioni da spuntare, calendario, «oggi» e completate. Si crea con la dispensa completa di ${esc(c.title)}, oppure con Plus per tutti i tuoi esami. Qui sopra un esempio.</p>
        <button class="btn btn-orange" data-v4plan="${c.slug}">Sblocca il piano</button><span class="tiny muted">una tantum, fino al ${B.fineSessione().toLocaleDateString("it-IT", { day: "numeric", month: "long" })}${B.haPacchetto(user) ? "" : ` · con un pacchetto ${eur(P.prezzi.plusConPacchetto)}`}</span></div></div>`;
  }
  UL.views.plannerU = {
    title: "Planner",
    render(user, params) {
      if (!U.attiva(user)) return U.arrivo(user, "Il Planner");
      prepara(user);
      const plus = B.plus(user), PI = piani(user);
      const esami = user.activity.exams.filter((e) => B.course(e.slug) && e.status !== "done");
      const slug = (params[0] && B.course(params[0]) && params[0]) || Object.keys(PI)[0] || (esami[0] || {}).slug || "microeconomia";
      const c = B.course(slug), p = PI[slug];
      const puoi = B.puoPianificare(user, slug);
      const v = VISTE.some((x) => x[0] === params[1]) ? params[1] : p && puoi ? "percorso" : "variabili";
      U.plCfg = U.plCfg && U.plCfg.slug === slug ? U.plCfg : { slug, appello: (p && p.appello) || (user.activity.exams.find((e) => e.slug === slug) || {}).appello || iso(new Date(Date.now() + 40 * 864e5)), fascia: (p && p.fascia) || "ottimo", giorni: (p && p.giorni) || [1, 2, 3, 4, 5, 6], ore: (p && p.ore) || 2.5, margine: (p && p.margine) || 0.18 };
      const cfg = U.plCfg;
      return `${head("Studio · UniLink Planner", "target", `Il tuo <span class="accent">piano</span>`, "Il metodo standard e «Ci stai nei tempi?» sono per tutti. Il piano personale, calcolato una volta sui tuoi giorni e diviso in fasi e sessioni da 45 minuti, si crea con la dispensa completa dell'esame o con Plus per tutti gli esami.", plus ? `<span class="badge badge-orange">Plus · tutti gli esami</span>` : puoi ? `<span class="badge badge-green">Completa · piano attivabile</span>` : `<span class="badge badge-soft">${icon("lock")} Piano personale: Completa o Plus</span>`)}
        ${Object.keys(PI).length ? `<div class="chips" style="margin-bottom:12px">${Object.keys(PI).filter((s) => B.course(s)).map((s) => `<a class="chip ${s === slug ? "on" : ""}" href="#/app/planner/${s}">${esc(B.course(s).title)}</a>`).join("")}<a class="chip" href="#/app/planner/${(esami.find((e) => !PI[e.slug]) || {}).slug || slug}/variabili">${icon("plus")} Nuovo piano</a></div>` : ""}
        <div class="tabs">${VISTE.map(([k, l, i]) => { const bloccata = k !== "variabili" && !puoi; return `<a href="#/app/planner/${slug}/${k}" class="${k === v ? "on" : ""}">${icon(bloccata ? "lock" : i)} ${l}</a>`; }).join("")}</div>
        ${v === "variabili" ? variabiliForm(user, c, cfg, puoi) + metodoStandard(c)
          : !puoi ? anteprimaBloccata(user, c) + `<div style="margin-top:16px">${metodoStandard(c)}</div>`
          : !p ? `<div class="card empty">${icon("target")}<p>Per ${esc(c.title)} non hai ancora un piano.</p><a class="btn btn-primary" style="margin-top:12px" href="#/app/planner/${slug}/variabili">Crealo da «Variabili»</a></div>`
          : vistaPlus(user, c, p, v)}`;
    },
    mount(root, user, params) {
      bindPlus(root, user);
      root.querySelectorAll("[data-v4plan]").forEach((b) => b.addEventListener("click", () => B.upsell(user, b.dataset.v4plan, { pianifica: true })));
      const cfg = U.plCfg; if (!cfg) return;
      const redraw = () => UL.app.refresh();
      root.querySelectorAll("[data-pv]").forEach((el) => el.addEventListener("change", () => {
        const k = el.dataset.pv;
        if (k === "slug") return UL.app.go(`#/app/planner/${el.value}/variabili`);
        cfg[k] = k === "ore" ? Number(el.value) || 1 : k === "margine" ? Math.min(0.4, Math.max(0, Number(el.value) / 100)) : el.value; redraw();
      }));
      root.querySelectorAll("[data-pf]").forEach((b) => b.addEventListener("click", () => { cfg.fascia = b.dataset.pf; redraw(); }));
      root.querySelectorAll("[data-pg]").forEach((b) => b.addEventListener("click", () => { const g = Number(b.dataset.pg); cfg.giorni = cfg.giorni.includes(g) ? cfg.giorni.filter((x) => x !== g) : cfg.giorni.concat(g); if (!cfg.giorni.length) cfg.giorni = [g]; redraw(); }));
      const crea = root.querySelector("[data-crea]");
      crea && crea.addEventListener("click", async () => {
        const c = B.course(cfg.slug), PI = piani(user), vecchio = PI[cfg.slug];
        if (vecchio && !(await UL.ui.confirmBox("Rigenerare il piano?", "Le date delle sessioni vengono ricalcolate da oggi con le nuove variabili. Le sessioni già fatte restano fatte.", "Rigenera"))) return;
        const S = genera(c, { ...cfg, dal: new Date() });
        if (vecchio) vecchio.sessioni.filter((s) => s.fatto).forEach((s, i) => { if (S[i]) Object.assign(S[i], { fatto: s.fatto, esito: s.esito, errori: s.errori }); });
        PI[cfg.slug] = { fascia: cfg.fascia, appello: cfg.appello, giorni: cfg.giorni.slice(), ore: cfg.ore, margine: cfg.margine, creato: new Date().toISOString(), sessioni: S };
        const e = user.activity.exams.find((x) => x.slug === cfg.slug); if (e && !e.appello) e.appello = cfg.appello;
        UL.store.addLog(user, "piano", `Planner: piano ${fascia(cfg.fascia).nome} per ${c.title}`); UL.store.save();
        UL.ui.toast("Piano creato"); UL.app.go(`#/app/planner/${cfg.slug}/percorso`);
      });
      root.querySelectorAll("[data-fatto]").forEach((b) => b.addEventListener("click", async () => {
        const p = piani(user)[cfg.slug]; if (!p) return; const s = p.sessioni[Number(b.dataset.fatto)];
        if (s.fatto) { s.fatto = ""; s.esito = ""; s.errori = 0; }
        else {
          s.fatto = new Date().toISOString();
          if (["Test", "Simulazione"].includes(s.tipo)) {
            const m = UL.ui.modal(`<div class="modal-head"><div><span class="sq-label">Sessione completata</span><h2 style="margin-top:8px">${esc(s.cap)} · ${esc(s.tipo)}</h2></div><button class="icon-btn" data-close>${icon("x")}</button></div>
              <p class="muted">Come ti senti su questo capitolo?</p><div class="seg" style="margin-top:12px">${["Da rivedere", "Così così", "Sicuro"].map((x) => `<button data-es="${x}">${x}</button>`).join("")}</div>
              <p class="tiny muted" style="margin-top:12px">«Da rivedere» aggiunge un ripasso mirato alla fine della fase, senza spostare il resto del piano.</p>`, { width: 520 });
            m.el.querySelectorAll("[data-es]").forEach((x) => x.addEventListener("click", () => {
              s.esito = x.dataset.es;
              if (s.esito === "Da rivedere") { const ultimo = p.sessioni.map((y, i) => (y.fase === s.fase ? i : -1)).filter((i) => i >= 0).pop(); p.sessioni.splice(ultimo + 1, 0, { fase: s.fase, cap: "Ripasso mirato · " + s.cap, tipo: "Ripasso", data: "", fatto: "", esito: "", errori: 0 }); }
              UL.store.save(); m.close(); redraw();
            }));
          }
        }
        UL.store.save(); redraw();
      }));
    },
  };

  /* ---------- 5 · Il mio percorso: Tesi (per tutti) e CV (5 regole gratis, 17 con Plus) ---------- */
  const TESI = [["Scegli la materia", "Dove hai i voti migliori, o cosa ti serve per la magistrale."], ["Scegli il relatore", "Arriva con una proposta di due o tre righe. Guida «come scegliere il relatore», non una classifica."], ["Domanda di ricerca", "Una domanda precisa vale più di un titolo ambizioso."], ["Indice", "Concordalo presto: è la mappa del lavoro."], ["Stesura", "Un capitolo alla volta, fonti annotate subito."], ["Consegna", "Scadenze e formato: controlla il sito della tua Scuola."]];
  const CV = [
    ["Una pagina", "Fino alla magistrale, una pagina sola."], ["Formazione in alto", "Corso, ateneo, media e anno previsto di laurea."], ["Esperienze con risultati", "Verbi d'azione e numeri: cosa hai ottenuto, non cosa facevi."], ["Competenze verificabili", "Excel, lingue con certificazione, strumenti: niente «buona conoscenza del pacchetto Office»."], ["Contatti puliti", "Email con nome e cognome, LinkedIn aggiornato."],
    ["Ordine per traiettoria", "Finance, consulting e marketing leggono il CV in modo diverso."], ["Media e lodi", "Quando metterle e quando no."], ["Progetti universitari", "Come trasformare un lavoro di gruppo in un'esperienza."], ["Associazioni", "Cosa conta davvero per i recruiter."], ["Lingue", "Livelli e certificazioni che servono per stage all'estero."], ["Lettera", "Quando serve e come tenerla breve."], ["Parole chiave", "Gli ATS leggono prima di una persona."], ["Errori tipici", "I 10 errori che vediamo più spesso."], ["Stage curricolari", "Come raccontarli."], ["Erasmus", "Come farlo valere."], ["Formato", "PDF, nome del file, font."], ["Benchmark", "Il CV UniLink per la tua traiettoria, da confrontare con il tuo."],
  ];
  U.tesiTab = (user) => {
    const done = (user.activity.tesi = user.activity.tesi || []);
    return `<div class="grid g-ov"><section class="card c-7"><div class="card-head"><h3>${icon("file")} La tesi, tappa per tappa</h3><span class="badge badge-green">per tutti</span></div>
      <ul class="v4-task">${TESI.map(([t, d], i) => `<li class="${done.includes(i) ? "done" : ""}"><button class="v4-cb" data-tesi="${i}">${done.includes(i) ? icon("check") : ""}</button><span>${i + 1} · ${esc(t)}<small>${esc(d)}</small></span></li>`).join("")}</ul></section>
      <section class="c-5 stack"><div class="card beige"><h3>Regole della prova finale</h3><p class="small" style="margin-top:6px">Economia UniFi: media + costante + premio di velocità (2 punti entro il 31/12 del terzo anno, 1 entro il 30/4, poi 0). Ogni corso ha le sue regole nel catalogo unico dei corsi.</p><a class="btn btn-sm btn-ghost" style="margin-top:10px" href="#/app/percorso/libretto">Calcola il voto</a></div>
        <div class="card"><h3>Template Word e LaTeX</h3><p class="small muted" style="margin:6px 0 10px">Impaginato secondo le regole della Scuola. In arrivo per tutti.</p><span class="badge badge-soft">in arrivo</span></div></section></div>`;
  };
  U.cvTab = (user) => {
    const plus = B.plus(user), mine = user.activity.cv || [], vis = plus ? CV : CV.slice(0, 5);
    return `<div class="grid g-ov"><section class="card c-8"><div class="card-head"><h3>${icon("brief")} CV benchmark</h3><span class="small muted">${plus ? "17 regole" : "5 regole su 17"}</span></div>
      <ul class="v4-task">${vis.map(([t, d], i) => `<li class="${mine.includes("cv" + i) ? "done" : ""}"><button class="v4-cb" data-cv="${i}">${mine.includes("cv" + i) ? icon("check") : ""}</button><span>${esc(t)}<small>${esc(d)}</small></span></li>`).join("")}</ul>
      ${plus ? "" : `<div style="margin-top:14px">${U.lock("Altre 12 regole e il CV benchmark per traiettoria", "Con Plus: finance, consulting, marketing · " + eur(B.prezzoPlus(user)) + " una tantum")}</div>`}</section>
      <section class="c-4 stack"><div class="stat"><span class="k">Regole spuntate</span><span class="v">${mine.filter((x) => Number(x.slice(2)) < vis.length).length} / ${vis.length}</span><span class="s">si salvano nel tuo account</span></div></section></div>`;
  };
  U.bindPercorsoV4 = (root, user) => {
    root.querySelectorAll("[data-tesi]").forEach((b) => b.addEventListener("click", () => { const a = (user.activity.tesi = user.activity.tesi || []), i = Number(b.dataset.tesi); a.includes(i) ? a.splice(a.indexOf(i), 1) : a.push(i); UL.store.save(); UL.app.refresh(); }));
    root.querySelectorAll("[data-cv]").forEach((b) => b.addEventListener("click", () => { const a = (user.activity.cv = user.activity.cv || []), k = "cv" + b.dataset.cv; a.includes(k) ? a.splice(a.indexOf(k), 1) : a.push(k); UL.store.save(); UL.app.refresh(); }));
    bindPlus(root, user);
  };

  /* ---------- 6 · Guida per facoltà (contenuti della landing: js/guida-dati.js) ---------- */
  const IMG = "../demo-landing/img/";
  const GB = {
    cards: (b) => `<div class="g-cards c${b.cols || 2}">${b.items.map((c) => `<div class="g-card">${c.k ? `<span class="g-k">${esc(c.k)}</span>` : ""}<h4>${esc(c.h)}</h4>${c.p ? `<p>${esc(c.p)}</p>` : ""}${c.lista ? `<ul>${c.lista.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</div>`).join("")}</div>`,
    passi: (b) => `<ol class="g-passi">${b.items.map((x, i) => `<li><span class="g-n">${i + 1}</span><div><h4>${esc(x.h)}</h4><p>${esc(x.p)}</p></div></li>`).join("")}</ol>`,
    tabella: (b) => `<div class="table-wrap" style="margin:12px 0">${b.h ? `<p class="sq-label" style="margin-bottom:6px">${esc(b.h)}</p>` : ""}<table class="table"><thead><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`,
    frase: (b) => `<blockquote class="g-frase">${esc(b.testo)}</blockquote>`,
    box: (b) => `<div class="banner" style="margin:12px 0">${icon("info")}<span><b>${esc(b.h)}</b> ${esc(b.p)}</span></div>`,
    cta: (b) => /materiali|tools|strumenti/.test(b.href) ? `<a class="btn btn-sm btn-ghost" style="margin:8px 0" href="${/materiali/.test(b.href) ? "#/app/materiali" : "#/app/percorso/libretto"}">${esc(b.testo)} →</a>` : "",
    formula: (b) => `<div class="card beige" style="margin:12px 0"><span class="sq-label">${esc(b.h)}</span><p class="display" style="font-size:20px;color:var(--navy);margin-top:6px">${esc(b.testo)}</p></div>`,
    fonte: (b) => `<p class="tiny muted">${esc(b.testo)}</p>`,
    lista: (b) => `${b.h ? `<h4 style="margin:12px 0 6px">${esc(b.h)}</h4>` : ""}<ul class="g-lista">${b.items.map((x) => `<li>${x.href ? `<a href="${esc(x.href)}" target="_blank" rel="noopener">${esc(x.h)} ↗</a>` : `${x.h ? `<b>${esc(x.h)}</b>${x.k ? ` <span class="tiny muted">${esc(x.k)}</span>` : ""} ` : ""}${esc(x.p || "")}`}</li>`).join("")}</ul>`,
    mappa: (b) => `<div class="g-cards c${Math.min(4, b.items.length)}">${b.items.map((x) => `<div class="g-card"><span class="g-k">${esc(x.k)}</span><h4>${esc(x.h)}</h4><p>${esc(x.p)}</p></div>`).join("")}</div>`,
  };
  UL.views.guidaU = {
    title: "Guida",
    render(user, params) {
      const G = window.UL_GUIDA;
      if (!G) return `<div class="card empty">Guida non disponibile.</div>`;
      const f = G.facolta.find((x) => x.id === (params[0] || user.profile.area)) || G.facolta[0];
      const fac = `<div class="chips" style="margin-bottom:14px">${G.facolta.slice(0, 6).map((x) => `<a class="chip ${x.id === f.id ? "on" : ""}" href="#/app/guida/${x.id}">${esc(x.nome)}${x.stato === "completa" ? "" : " · in arrivo"}</a>`).join("")}</div>`;
      if (f.stato !== "completa") return `${head("Guida", "map", `Guida <span class="accent">${esc(f.nome)}</span>`, "Stessa struttura della guida di Economia. I testi li scriviamo con chi studia lì.")}${fac}
        <div class="grid g-ov">${G.schema.map((s) => `<div class="card c-4"><span class="sq-label">${s.n}</span><h3 style="margin:6px 0">${esc(s.titolo)}</h3><ul class="g-lista">${s.sezioni.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><span class="badge badge-soft">da scrivere</span></div>`).join("")}</div>`;
      const E = G[f.id], c = E.capitoli.find((x) => x.id === params[1]) || E.capitoli[0], i = E.capitoli.indexOf(c);
      return `${head(`Guida · aggiornata ad ${G.aggiornata}`, "map", `${esc(E.titolo.split("·")[0])}<span class="accent">${esc(f.nome)}</span>`, esc(E.obiettivo || ""))}${fac}
        <div class="tabs" style="overflow-x:auto">${E.capitoli.map((x) => `<a href="#/app/guida/${f.id}/${x.id}" class="${x.id === c.id ? "on" : ""}">${x.n} ${esc(x.titolo)}</a>`).join("")}</div>
        <div class="grid g-ov"><section class="card c-8"><span class="sq-label">Capitolo ${c.n}</span><h2 style="margin:6px 0">${esc(c.titolo)}</h2><p class="muted">${esc(c.sotto)}</p>
            ${c.sezioni.map((s) => `<div class="g-sez"><span class="sq-label">${esc(s.sotto || "")}</span><h3>${esc(s.titolo)}</h3>${s.intro ? `<p>${esc(s.intro)}</p>` : ""}${(s.blocchi || []).map((b) => (GB[b.t] ? GB[b.t](b) : "")).join("")}</div>`).join("")}
            <div class="row between" style="margin-top:18px">${i ? `<a class="btn btn-ghost" href="#/app/guida/${f.id}/${E.capitoli[i - 1].id}">← ${esc(E.capitoli[i - 1].titolo)}</a>` : "<span></span>"}${E.capitoli[i + 1] ? `<a class="btn btn-primary" href="#/app/guida/${f.id}/${E.capitoli[i + 1].id}">${esc(E.capitoli[i + 1].titolo)} →</a>` : ""}</div></section>
          <aside class="c-4 stack">${c.img ? `<img src="${IMG + esc(c.img)}" alt="" style="width:100%;border-radius:18px" onerror="this.remove()">` : ""}<div class="card beige"><span class="sq-label">In breve</span><ul class="g-lista" style="margin-top:8px">${c.breve.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></aside></div>`;
    },
  };
})();
