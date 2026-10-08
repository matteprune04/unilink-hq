/* js/views/v4.js — web app v4: tutto segue il listino P2 della landing v5 (config.js → UL.PIANI).
   REGOLA GENERALE: ogni parte dell'app esiste per tutti; se il tuo piano non la include la vedi lo stesso,
   con il lucchetto e il piano che la sblocca (U.lock / B.upsell). Mai pagine nascoste o vuote.
   1 scheda esame: cosa compri (Simulazione, Completa; Economia Aziendale gratis)     2 «Sblocca»: il piano giusto per quello che ti manca
   3 Abbonamento: card, Cosa c'è dentro, calcolatore, ordini   4 UniLink Planner (P3): Plus = piano personale, gli altri = metodo standard
   5–6 Tesi, CV e Guida: archiviati il 7/10 (js/archivio/tesi-cv-guida.js) */
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

  /* ---------- 1 · scheda esame: cosa compri (v7: Simulazione · Dispensa completa · pacchetto del percorso) ---------- */
  const barrato = (k, n) => `<s class="tiny muted">${eur(B.prezzoPieno(k, n))}</s>`;
  U.buyCard = (user, c) => {
    const lv = B.level(user, c.slug), free = B.gratisPerTutti(c.slug);
    const riga = (k, nome, sub, attivo, cta) => `<div class="v4-buy ${attivo ? "on" : ""}"><div><b>${nome}</b><span class="tiny muted">${sub}</span></div>
      <div class="v4-pr"><b>${eur(B.prezzo(k, c))}</b><span class="tiny muted">${barrato(k)} · prezzo di lancio</span></div>${cta}</div>`;
    const sem = B.semesterCourses(c.cds.includes(cdsDi(user)) ? cdsDi(user) : c.cds.split("/")[0], c.anno, c.sem, B.currDi(user));
    const leggi = `<a class="btn btn-sm btn-primary" href="#/app/leggi/${c.slug}">${icon("book")} Leggi</a>`;
    if (free) return `<div class="row between"><b class="display" style="color:var(--navy)">Studia ${esc(c.title)}</b><span class="badge badge-green">Gratis per tutti</span></div>
      <div class="v4-gratis">${icon("spark")}<div><b>La dispensa completa è gratis</b><span class="tiny">È l'esempio dell'offerta UniLink: dispensa, quiz e simulazioni, da leggere e annotare qui.</span></div>${leggi}</div>
      ${B.hasQuiz(c.slug) ? `<a class="btn btn-sm btn-ghost" href="#/app/esercitazioni/${c.slug}">${icon("quiz")} Allenati</a>` : ""}`;
    return `<div class="row between"><b class="display" style="color:var(--navy)">Studia ${esc(c.title)}</b>${lv !== "none" ? `<span class="badge badge-green">${lv === "completa" ? "Completa" : "Simulazione"} attiva</span>` : ""}</div>
      ${B.haSimulazione(c) ? riga("simulazione", "Simulazione d'esame", "Una prova nel formato dell'appello, con correzione", lv !== "none",
        lv !== "none" ? `<a class="btn btn-sm btn-ghost" href="#/app/esercitazioni/${c.slug}">${icon("quiz")} Falla</a>` : `<button class="btn btn-sm btn-ghost" data-v4k="simulazione">Scegli</button>`)
        : `<p class="tiny muted">La simulazione d'esame per questo esame è in preparazione.</p>`}
      ${riga("completa", "Dispensa completa", "Dispensa da leggere e annotare qui, quiz e simulazioni", lv === "completa",
        lv === "completa" ? leggi : `<button class="btn btn-sm ${lv === "simulazione" ? "btn-orange" : "btn-primary"}" data-v4k="completa">${lv === "simulazione" ? "Passa alla completa" : "Scegli"}</button>`)}
      ${sem.length >= 3 && lv !== "completa" ? `<p class="small" style="margin-top:4px">Nel <b>pacchetto semestre</b> del tuo percorso (${eur(B.prezzo("semester", null, sem.length))}) con altri ${Math.min(sem.length, UL.PIANI.maxEsamiPacchetto) - 1} esami. <a href="#/app/abbonamento/calcola">Calcola</a></p>` : ""}
      <span class="lock">${icon("lock")} Si legge solo nell'area personale · pagamento con Stripe (simulato) · ${esc(P.stato)}</span>`;
  };
  U.bindBuyCard = (root, user, c) => root.querySelectorAll("[data-v4k]").forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.v4k, item = k === "simulazione" ? B.simulazioneItem(c) : B.completaItem(c);
    // passare dalla Simulazione alla Completa riconosce quanto già pagato
    if (k === "completa" && B.level(user, c.slug) === "simulazione") {
      const pagato = (user.activity.purchases || []).filter((p) => p.slug === c.slug && p.type === "simulazione").reduce((n, p) => n + p.price, 0);
      item.price = Math.max(0, Math.round((item.price - pagato) * 100) / 100); item.label = "Passa alla completa · " + c.title; item.incl = [`Paghi la differenza: ${eur(pagato)} già pagati per la simulazione`].concat(item.incl);
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
      if (lv === "none" && !opz.pianifica && B.haSimulazione(c)) o.push({ t: "Simulazione d'esame", p: B.prezzo("simulazione", c), s: "invece di " + eur(B.prezzoPieno("simulazione")), incl: B.simulazioneItem(c).incl.slice(0, 3), item: () => B.simulazioneItem(c) });
      if (lv !== "completa") o.push({ t: lv === "simulazione" ? "Passa alla completa" : "Dispensa completa", p: B.prezzo("completa", c), s: "invece di " + eur(B.prezzoPieno("completa")), incl: B.completaItem(c).incl.slice(0, 4), item: () => B.completaItem(c), hot: true, tag: "Per questo esame" });
      const sem = B.semesterCourses(cds, anno, c.sem, B.currDi(user)), n = Math.min(sem.length, UL.PIANI.maxEsamiPacchetto);
      if (sem.length >= 3 && lv !== "completa") o.push({ t: "Pacchetto semestre", p: B.prezzo("semester", null, n), s: `${n} complete · invece di ${eur(B.valoreSingoli(sem.slice(0, n)))}`, incl: sem.slice(0, n).map((x) => x.title), item: () => B.semItem(cds, anno, c.sem, B.currDi(user), sem.length > n ? [c.slug].concat(sem.filter((x) => x.slug !== c.slug).map((x) => x.slug)) : null) });
    }
    if (!o.length) return UL.ui.toast("Hai già tutto quello che serve qui");
    const m = UL.ui.modal(`
      <div class="modal-head"><div><span class="sq-label">Sblocca</span><h2 style="margin-top:8px">${esc(opz.plus ? "Con UniLink Plus" : opz.pianifica ? "Il piano di " + (c ? c.title : "questo esame") : c ? c.title : "")}</h2><p class="small muted" style="margin-top:4px">${opz.plus ? "Plus è il metodo: Planner personale e ripasso degli errori su tutti gli esami. Le dispense si comprano a parte." : opz.pianifica ? "Il piano personale stile TTP è di UniLink Plus, su tutti i tuoi esami." : "Scegli tu cosa ti serve. " + esc(P.stato) + "."}</p></div>
        <button class="icon-btn" data-close aria-label="Chiudi">${icon("x")}</button></div>
      <div class="pricing" style="grid-template-columns:repeat(${o.length},1fr)">${o.map((x, i) => `<div class="plan ${x.hot ? "hot" : ""}" data-hot="${esc(x.tag || "")}"><h3>${esc(x.t)}</h3><div class="price">${x.p ? eur(x.p) : "Gratis"} <small>${esc(x.s)}</small></div>
        <ul>${x.incl.map((y) => `<li>${icon("check")}${esc(y)}</li>`).join("")}</ul><button class="btn ${x.hot ? "btn-orange" : "btn-primary"}" data-pick="${i}">Scegli</button></div>`).join("")}</div>
      <p class="tiny muted" style="margin-top:12px">Le differenze tra i piani: <a href="#/app/abbonamento" data-close>Abbonamento → Cosa c'è dentro</a></p>`, { width: Math.min(980, 300 * o.length + 80) });
    m.el.querySelectorAll("[data-pick]").forEach((b) => b.addEventListener("click", () => { m.close(); B.checkout(user, o[Number(b.dataset.pick)].item(), () => UL.app.refresh()); }));
  };

  /* ---------- 3 · Abbonamento ---------- */
  const COLS = ["free", "simulazione", "completa", "semester", "plus"];
  const colonnaUtente = (user) => {
    const ps = user.activity.purchases || [];
    return B.plus(user) ? "plus" : ps.some((p) => p.type === "semester" || p.type === "anno") ? "semester"
      : ps.some((p) => ["completa", "appunti", "gratis"].includes(p.type)) ? "completa" : ps.some((p) => p.type === "simulazione") ? "simulazione" : "free";
  };
  // v7: niente «quando conviene comprare» (prezzi uguali tutto l'anno): al suo posto la regola del prezzo di lancio
  const quando = () => `<div class="v4-quando"><div><span class="sq-label">Prezzi di lancio</span><p class="small muted" style="margin-top:6px">I prezzi sono scontati per il lancio: il prezzo pieno è quello barrato. Uguali tutto l'anno, senza abbonamenti né rinnovi.</p></div>
    <p class="small"><span class="badge badge-green">${esc(P.stato)}</span></p></div>`;
  const tabellaDentro = (user) => {
    const me = colonnaUtente(user), L = Object.fromEntries(P.lista.map((x) => [x.k, x]));
    const cella = (v) => v === 1 ? `<span class="v4-ok">${icon("check")}</span>` : v === 0 ? '<span class="v4-no">—</span>' : `<span class="tiny muted">${esc(v)}</span>`;
    return `<div class="card section" id="dentro"><div class="card-head"><h3>${icon("layers")} Cosa c'è dentro</h3><span class="small muted">la colonna «Tu» è il tuo piano di oggi</span></div>
      <div class="table-wrap"><table class="table v4-tab"><thead><tr><th></th>${COLS.map((k) => `<th class="${k === me ? "me" : ""}">${esc(L[k].nome)}${k === me ? ' <span class="badge badge-orange">Tu</span>' : ""}<br><span class="tiny muted">${esc(L[k].prezzo || "")}</span></th>`).join("")}</tr></thead>
      <tbody>${P.dentro.map(([g, righe]) => `<tr class="gr"><td colspan="${COLS.length + 1}">${esc(g)}</td></tr>` + righe.map(([n, ...v]) => `<tr><th scope="row">${esc(n)}</th>${v.map((x, i) => `<td class="${COLS[i] === me ? "me" : ""}">${cella(x)}</td>`).join("")}</tr>`).join("")).join("")}</tbody></table></div>
      <p class="tiny muted" style="margin-top:10px">${esc(P.gratis.testo)} Le dispense non si scaricano: si leggono e si annotano nell'area personale.</p></div>`;
  };
  const cardPrezzi = (user) => {
    const ps = user.activity.purchases || [], plus = B.plus(user);
    const studio = U.attiva(user) && U.ateneoAttivo(user);
    const C = [
      { k: "simulazione", p: B.prezzo("simulazione"), sub: "invece di " + eur(B.prezzoPieno("simulazione")) + " · prezzo di lancio", on: ps.some((x) => x.type === "simulazione"), cta: studio ? `<a class="btn btn-ghost" href="#/app/materiali/catalogo">Scegli l'esame</a>` : "" },
      { k: "completa", p: B.prezzo("completa"), sub: "invece di " + eur(B.prezzoPieno("completa")) + " · prezzo di lancio", on: ps.some((x) => x.type === "completa"), cta: studio ? `<a class="btn btn-ghost" href="#/app/materiali/catalogo">Scegli l'esame</a>` : "" },
      { k: "semester", p: B.prezzo("semester", null, 3), sub: `3 esami · 4 esami ${eur(B.prezzo("semester", null, 4))} · invece di ${eur(B.prezzoPieno("semester", 3))} / ${eur(B.prezzoPieno("semester", 4))}`, on: ps.some((x) => x.type === "semester"), cta: studio ? `<a class="btn btn-orange" href="#/app/abbonamento/calcola">Calcola il tuo pacchetto</a>` : "" },
      { k: "plus", p: B.prezzoPlus(user), sub: B.haPacchetto(user) ? "una tantum · prezzo con pacchetto" : "una tantum · con un pacchetto " + eur(P.prezzi.plusConPacchetto), on: plus, cta: plus ? `<span class="small muted">Fino al ${fmtDate(user.activity.plus.until || B.fineSessione().toISOString())}</span>` : `<button class="btn btn-primary" data-plus>Prendi Plus</button>` },
    ];
    const L = Object.fromEntries(P.lista.map((x) => [x.k, x]));
    return `<div class="v4-pz">${C.map((x) => `<div class="v4-pzc ${L[x.k].hot ? "ev" : ""} ${x.k === "plus" ? "plus" : ""}">${L[x.k].hot ? '<span class="v4-tag">Il più scelto</span>' : ""}
      <span class="sq-label">${esc(L[x.k].tipo)}</span><h3>${esc(L[x.k].nome)}</h3><div class="v4-p"><b>${eur(x.p).replace("€", "")}</b><span>€</span></div><p class="tiny ${x.k === "plus" ? "" : "muted"}">${esc(x.sub)}</p>
      <p class="small" style="flex:1">${esc(L[x.k].d)}</p>${x.on ? '<span class="badge badge-green">Attivo</span>' : x.cta || '<span class="small muted">Quando la tua area sarà attiva</span>'}</div>`).join("")}</div>`;
  };
  // calcolatore del pacchetto (stessa logica della landing v8): percorso (corso + curriculum) → esami del semestre → prezzo per numero
  // di esami (3 → 29,99 · 4 → 34,99). Con più di 4 esami si scelgono i 4 del proprio piano di studi; con 2 o meno conviene la singola.
  function calcolatore(root, user) {
    const box = root.querySelector("[data-calc]"); if (!box) return;
    const PERC = window.UL_PERCORSI, MAX = P.maxEsamiPacchetto || 4;
    const sc = { cds: cdsDi(user), curr: B.currDi(user), anno: String(annoDi(user)), sem: "1", plus: false, scelti: null };
    const draw = () => {
      const serveCurr = B.serveCurriculum(sc.cds, sc.anno), curricula = Object.entries(((PERC && PERC.corsi[sc.cds]) || {}).curricula || {});
      if (serveCurr && !sc.curr && curricula.length) sc.curr = curricula[0][0];
      const tutti = B.semesterCourses(sc.cds, sc.anno, sc.sem, serveCurr ? sc.curr : "");
      if (!sc.scelti || sc.scelti.some((s) => !tutti.find((c) => c.slug === s))) sc.scelti = tutti.slice(0, MAX).map((c) => c.slug);
      const gia = (c) => B.owns(user, c.slug);
      const presi = tutti.filter((c) => sc.scelti.includes(c.slug)), n = presi.length;
      const daPagare = presi.filter((c) => !gia(c)), singoli = daPagare.reduce((t, c) => t + B.prezzo("completa", c), 0);
      const pac = n >= 3 ? B.prezzo("semester", null, n) : null, pieno = n >= 3 ? B.prezzoPieno("semester", n) : null;
      const totS = singoli + (sc.plus ? P.prezzi.plus : 0), totP = pac == null ? null : pac + (sc.plus ? P.prezzi.plusConPacchetto : 0);
      const pct = (x) => Math.max(6, Math.round((x / Math.max(totS, totP || 0, 1)) * 100));
      let tit, txt, forte = false;
      if (tutti.length < 3) { tit = tutti.length ? "Qui il pacchetto non c'è" : "Nessuna dispensa per questo semestre"; txt = tutti.length ? `Nel tuo percorso questo semestre ha ${tutti.length === 1 ? "una sola dispensa" : "due dispense"}: prendi ${tutti.length === 1 ? "la completa" : "le complete"} a ${eur(P.prezzi.completa[0])} l'una.` : "Prova un altro semestre o un altro curriculum."; }
      else if (n < 3) { tit = "Scegli almeno 3 esami"; txt = `Il pacchetto parte da 3 esami (${eur(B.prezzo("semester", null, 3))}). Con meno conviene la dispensa singola a ${eur(P.prezzi.completa[0])}.`; }
      else if (totP <= totS) { forte = true; tit = `Prendi il pacchetto: risparmi ${eur(totS - totP)}`; txt = `${n} dispense complete a ${eur(pac)} invece di ${eur(B.valoreSingoli(presi))} comprate una per una.`; }
      else { tit = "Ti conviene comprare le singole"; txt = `Hai già ${presi.length - daPagare.length} di questi esami: le altre ${daPagare.length} costano ${eur(singoli)}, meno del pacchetto.`; }
      const seg = (k, v, t, on) => `<button type="button" data-${k}="${v}" class="${on ? "on" : ""}">${t}</button>`;
      box.innerHTML = `<div class="v4-calc"><div class="card">
          <div class="field"><label>Corso di laurea</label><div class="seg">${Object.entries((PERC && PERC.corsi) || { EA: { nome: "Economia Aziendale" }, EC: { nome: "Economia e Commercio" } }).map(([k, x]) => seg("cc", k, x.nome, k === sc.cds)).join("")}</div></div>
          <div class="field"><label>Anno</label><div class="seg">${["1", "2", "3"].map((a) => seg("ca", a, ROMAN[a] + " anno", a === sc.anno)).join("")}</div></div>
          ${serveCurr ? `<div class="field"><label>Curriculum</label><div class="seg" style="flex-wrap:wrap">${curricula.map(([k, nm]) => seg("cu", k, nm, k === sc.curr)).join("")}</div></div>` : ""}
          <div class="field"><label>Semestre</label><div class="seg">${[["1", "I semestre"], ["2", "II semestre"]].map(([v, t]) => seg("cs", v, t, v === sc.sem)).join("")}</div></div>
          <label class="sq-label" style="margin-top:10px;display:block">Le dispense del tuo semestre${tutti.length > MAX ? ` · scegline ${MAX} (quelle del tuo piano di studi)` : ""}</label>
          <ul class="v4-esami">${tutti.map((c) => { const on = sc.scelti.includes(c.slug); return `<li class="${on ? "" : "off"}"><span>${esc(c.title)}<small>${ROMAN[c.sem]} sem.${gia(c) ? " · già tua" : ""}</small></span>
            <span class="seg sm">${seg("ce", c.slug, on ? "Inclusa" : "Aggiungi", on)}</span><b>${eur(B.prezzo("completa", c))}</b></li>`; }).join("") || '<li class="small muted">Nessuna dispensa in questo semestre.</li>'}</ul>
          <p class="tiny muted" style="margin-top:8px">${esc((PERC && PERC.fonte) || "")}. Gli esami del III anno spesso sono a scelta: controlla il tuo piano di studi.</p>
          <label class="check" style="margin-top:10px"><input type="checkbox" data-cp ${sc.plus ? "checked" : ""}> Aggiungi UniLink Plus</label></div>
        <div class="card stack">
          <div class="v4-r"><span>Una per una · ${daPagare.length} ${daPagare.length === 1 ? "dispensa" : "dispense"}${sc.plus ? " + Plus" : ""}</span><b>${eur(totS)}</b></div><div class="v4-bar"><i style="width:${pct(totS)}%"></i></div>
          ${totP != null ? `<div class="v4-r ev"><span>Pacchetto semestre · ${n} esami${sc.plus ? " + Plus" : ""} <s class="tiny muted">${eur(pieno)}</s></span><b>${eur(totP)}</b></div><div class="v4-bar ev"><i style="width:${pct(totP)}%"></i></div>` : ""}
          <div class="v4-cons ${forte ? "forte" : ""}"><span class="sq-label">Il nostro consiglio</span><h3>${tit}</h3><p class="small">${txt}</p></div>
          ${totP != null ? `<button class="btn ${forte ? "btn-orange" : "btn-primary"} btn-block" data-compra>Prendi il pacchetto · ${eur(totP)}</button>` : ""}
          <p class="tiny muted">${esc(P.stato)} · pagamento simulato.</p></div></div>`;
      const on = (sel, fn) => box.querySelectorAll(sel).forEach((b) => (b.onclick = () => { fn(b); draw(); }));
      on("[data-cc]", (b) => { sc.cds = b.dataset.cc; sc.curr = ""; sc.scelti = null; }); on("[data-cu]", (b) => { sc.curr = b.dataset.cu; sc.scelti = null; });
      on("[data-ca]", (b) => { sc.anno = b.dataset.ca; sc.scelti = null; }); on("[data-cs]", (b) => { sc.sem = b.dataset.cs; sc.scelti = null; });
      on("[data-ce]", (b) => { const s = b.dataset.ce; if (sc.scelti.includes(s)) sc.scelti = sc.scelti.filter((x) => x !== s); else if (sc.scelti.length < MAX) sc.scelti.push(s); else UL.ui.toast(`Al massimo ${MAX} esami per pacchetto: togline uno`); });
      box.querySelector("[data-cp]").onchange = (e) => { sc.plus = e.target.checked; draw(); };
      const cb = box.querySelector("[data-compra]");
      cb && (cb.onclick = () => B.checkout(user, B.semItem(sc.cds, sc.anno, sc.sem, serveCurr ? sc.curr : "", sc.scelti), () => { if (sc.plus && !B.plus(user)) B.checkout(user, B.plusItem(user), () => UL.app.refresh()); else UL.app.refresh(); }));
    };
    draw();
  }
  UL.views.abbonamentoU = {
    title: "Abbonamento",
    render(user, params) {
      const tab = ["calcola", "ordini"].includes(params[0]) ? params[0] : "piano", plus = B.plus(user), ps = user.activity.purchases;
      const tuoi = user.activity.exams.map((e) => B.course(e.slug)).filter(Boolean);
      const LV = { none: ["Solo scheda e quiz di prova", "badge-soft"], simulazione: ["Simulazione", "badge-yellow"], completa: ["Completa", "badge-green"] };
      return `${head("Account", "euro", `Il tuo <span class="accent">piano</span>`, `Simulazioni, dispense complete, pacchetti del tuo percorso e Plus. Quello che compri resta tuo e si legge qui; Plus vale fino a fine sessione. ${esc(P.stato)}.`)}
        <div class="tabs"><a href="#/app/abbonamento" class="${tab === "piano" ? "on" : ""}">${icon("spark")} Il tuo piano</a><a href="#/app/abbonamento/calcola" class="${tab === "calcola" ? "on" : ""}">${icon("calc")} Calcola il pacchetto</a><a href="#/app/abbonamento/ordini" class="${tab === "ordini" ? "on" : ""}">${icon("file")} Ordini <span class="cnt">${ps.length}</span></a></div>
        ${tab === "ordini" ? UL.views.acquistiB.render(user).replace(/<div class="page-head">[\s\S]*?<\/div><\/div>/, "")
        : tab === "calcola" ? `<p class="muted" style="margin-bottom:16px">Scegli corso, curriculum e semestre: vedi quali dispense entrano nel pacchetto e quanto costa (3 esami o 4). Le dispense che hai già non si pagano due volte.</p><div data-calc></div>${quando()}`
        : `<div class="grid g-ov" style="margin-bottom:22px">
          <section class="card navy c-7"><span class="badge badge-orange">Il tuo piano</span><h2 style="margin:12px 0 8px">${esc(B.planName(user))}</h2>
            <p style="color:rgba(255,255,255,.78)">${plus ? `Plus attivo fino al ${fmtDate(user.activity.plus.until || B.fineSessione().toISOString())}: Planner personale e ripasso degli errori su tutti gli esami.` : "Le dispense si comprano per esame o con il pacchetto del tuo semestre; il metodo (Planner su tutti gli esami, ripasso errori) è Plus, una volta per sessione."}</p>
            <div class="row" style="margin-top:18px">${plus ? `<a class="btn btn-white" href="#/app/planner">Apri il Planner</a>` : `<button class="btn btn-white btn-arrow" data-plus>Prendi Plus · ${eur(B.prezzoPlus(user))} <span class="arr">${icon("arrow")}</span></button>`}<a class="btn btn-ghost" style="color:#fff;border-color:rgba(255,255,255,.4)" href="#/app/abbonamento/calcola">Calcola il pacchetto</a></div></section>
          <section class="c-5 stack">
            <div class="stat"><span class="k">${icon("book")} Dispense da leggere</span><span class="v">${B.courses().filter((c) => B.owns(user, c.slug)).length}</span><span class="s">compresa Economia Aziendale, gratis per tutti</span></div>
            <div class="stat"><span class="k">${icon("quiz")} Simulazioni</span><span class="v">${B.courses().filter((c) => B.ownsSimulazione(user, c.slug)).length}</span><span class="s">esami in cui puoi fare la simulazione d'esame</span></div></section></div>
        ${cardPrezzi(user)}${quando()}
        ${tuoi.length ? `<div class="card section" style="margin-top:22px"><div class="card-head"><h3>${icon("layers")} I tuoi esami: cosa hai e cosa puoi sbloccare</h3></div><div class="table-wrap"><table class="table"><thead><tr><th>Esame</th><th>Hai</th><th>Ti manca</th><th></th></tr></thead><tbody>
          ${tuoi.map((c) => { const lv = B.level(user, c.slug); return `<tr><td><a href="#/app/scheda/${c.slug}">${esc(c.title)}</a></td><td><span class="badge ${LV[lv][1]}">${LV[lv][0]}</span></td>
            <td class="small">${lv === "completa" ? "Niente: hai tutto per questo esame" : lv === "simulazione" ? "La dispensa completa e i quiz per argomento" : "Dispensa, quiz e simulazioni"}</td>
            <td>${lv === "completa" ? `<a class="btn btn-sm btn-ghost" href="#/app/leggi/${c.slug}">Leggi</a>` : `<button class="btn btn-sm btn-orange" data-up="${c.slug}">Sblocca</button>`}</td></tr>`; }).join("")}</tbody></table></div></div>` : ""}
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
     Ore utili = giorni × ore nette × (1 − margine 15–20%). Sessioni da 45′.
     v8 (commento 12 del 7/10): le ore che servono partono dal dato UFFICIALE, non da numeri inventati: studio individuale =
     CFU × 25 − ore di lezione (DM 270/2004 + Course Catalogue UniFi, js/studio-dati.js → UL.ORE), meno quello che hai già studiato
     durante il corso, più metà delle ore di lezione se non le hai seguite; × il moltiplicatore della fascia (IPOTESI da calibrare con
     i tempi veri registrati). Giudizio: Fattibile · Tirato · Difficile · Non realistico (UL.METODO.giudizi). Fonti: UL.METODO.fonti. */
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
    TIPI: { Lezione: "t-lez", Esercizi: "t-ese", Test: "t-test", Flashcard: "t-test", Ripasso: "t-rip", Simulazione: "t-sim", Errori: "t-err" },
  };
  const n1 = (x) => Number(x).toLocaleString("it-IT", { maximumFractionDigits: 1 });
  // chi può creare il piano personale di un esame: Completa di quell'esame (anche da pacchetto) oppure Plus (tutti gli esami)
  // v10 (commenti 4 e 7 del 8/10): il piano personale stile TTP è ESCLUSIVO di Plus; per tutti resta il giudizio «ci stai nei tempi?»
  B.puoPianificare = (user) => B.plus(user);
  const fascia = (id) => PL.fasce.find((f) => f.id === id) || PL.fasce[2];
  const capitoli = (c) => { const t = [...new Set(B.questions(c.slug).map((q) => q.topic))]; return t.length ? t : Array.from({ length: Math.max(5, Math.round((c.cfu || 6) * 0.8)) }, (_, i) => "Capitolo " + (i + 1)); };
  // ore ufficiali di studio individuale dell'esame (UniFi: 17 h per CFU) e ore che servono per fascia e situazione dello studente
  const M = UL.METODO || { fasce: {}, giudizi: [[0, "—", "badge-soft"]], lezioniNonSeguite: 0.5 };
  const oreUff = (c) => { const o = UL.ORE && UL.ORE.esami[c.code], cfu = (o && o.cfu) || c.cfu || 9, lez = (o && o.ore) != null ? o.ore : cfu * 8; return { cfu, lez, studio: cfu * 25 - lez, vero: !!o }; };
  const oreServono = (c, f, cfg = {}) => { const u = oreUff(c), gia = Number(cfg.gia || 0), extra = cfg.lezioni === "no" ? u.lez * M.lezioniNonSeguite : 0;
    return Math.max(4, (u.studio * (1 - gia) + extra) * (M.fasce[f] || 1)); };
  const sessioniTot = (c, f, cfg) => Math.round((oreServono(c, f, cfg) * 60) / PL.min);
  const giudizio = (utili, serve) => { const r = utili / Math.max(serve, 0.1); return (M.giudizi.find(([soglia]) => r >= soglia) || M.giudizi[M.giudizi.length - 1]).concat([r]); };
  const giorno0 = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const iso = (d) => giorno0(d).toISOString().slice(0, 10);
  const giorniUtili = (cfg) => { let n = 0; const fine = giorno0(cfg.appello); for (let d = giorno0(cfg.dal || new Date()); d < fine; d.setDate(d.getDate() + 1)) if (cfg.giorni.includes(d.getDay())) n++; return n; };
  const perGiorno = (cfg) => Math.max(1, Math.floor((cfg.ore * 60 * (1 - cfg.margine)) / PL.min));
  const stima = (c, cfg) => { const tot = sessioniTot(c, cfg.fascia, cfg), gu = giorniUtili(cfg), utili = gu * cfg.ore * (1 - cfg.margine), serve = (tot * PL.min) / 60, g = giudizio(utili, serve); return { tot, gu, utili, serve, ok: utili >= serve, giudizio: g }; };
  function genera(c, cfg) {
    const tot = sessioniTot(c, cfg.fascia, cfg), caps = capitoli(c), pf = PL.fasi.map(([, q]) => Math.round(tot * q)); pf[4] += tot - pf.reduce((a, b) => a + b, 0);
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
        <div class="v4-fasce">${PL.fasce.map((f) => `<button type="button" class="${f.id === cfg.fascia ? "on" : ""}" data-pf="${f.id}"><b>${f.nome}</b><span>${f.voto}</span><small>${n1(oreServono(c, f.id, cfg))} h</small></button>`).join("")}</div>
        <p class="small" style="margin-top:8px">${esc(fascia(cfg.fascia).cosa)}</p><p class="tiny muted">${esc(PL.disclaimer)}</p>
        <div class="grid-2" style="margin-top:12px"><div class="field"><label>Quanto hai già studiato durante il corso</label><select class="select" data-pv="gia">${[["0", "Niente, parto da zero"], ["0.25", "Circa un quarto"], ["0.5", "Circa metà"], ["0.75", "Quasi tutto, devo ripassare"]].map(([v, t]) => `<option value="${v}" ${String(cfg.gia || 0) === v ? "selected" : ""}>${t}</option>`).join("")}</select></div>
          <div class="field"><label>Lezioni</label><select class="select" data-pv="lezioni">${[["si", "Le ho seguite"], ["no", "Non le ho seguite"]].map(([v, t]) => `<option value="${v}" ${(cfg.lezioni || "si") === v ? "selected" : ""}>${t}</option>`).join("")}</select></div></div>
        <p class="tiny muted" style="margin-top:6px">${(() => { const u = oreUff(c); return `${esc(c.title)}: ${u.cfu} CFU = ${u.cfu * 25} ore di impegno, ${u.lez} di lezione e ${u.studio} di studio individuale${u.vero ? " (dati ufficiali UniFi)" : " (stima: 8 ore di lezione per CFU)"}.`; })()}</p>
        <label class="sq-label" style="display:block;margin:14px 0 8px">Giorni in cui studi</label>
        <div class="v4-gg">${[1, 2, 3, 4, 5, 6, 0].map((g) => `<button type="button" class="${cfg.giorni.includes(g) ? "on" : ""}" data-pg="${g}">${PL.giorni[g][0].toUpperCase()}</button>`).join("")}</div>
        <div class="grid-2" style="margin-top:12px"><div class="field"><label>Ore nette al giorno</label><input class="input" type="number" min="0.5" max="10" step="0.5" data-pv="ore" value="${cfg.ore}"></div>
          <div class="field"><label>Margine per imprevisti (consigliato 15–20%)</label><input class="input" type="number" min="0" max="40" step="1" data-pv="margine" value="${Math.round(cfg.margine * 100)}"></div></div></section>
      <section class="c-5 stack"><div class="card ${st.ok ? "" : "beige"}"><span class="sq-label">Ci stai nei tempi?</span>
          <div class="v4-r" style="margin-top:10px"><span>Ore che servono (${fascia(cfg.fascia).nome})</span><b>${n1(st.serve)} h</b></div><div class="v4-bar ev"><i style="width:${Math.min(100, (st.serve / Math.max(st.utili, st.serve, 1)) * 100)}%"></i></div>
          <div class="v4-r"><span>Ore utili fino all'appello</span><b>${n1(st.utili)} h</b></div><div class="v4-bar"><i style="width:${Math.min(100, (st.utili / Math.max(st.utili, st.serve, 1)) * 100)}%"></i></div>
          <p class="tiny muted">${st.gu} giorni × ${n1(cfg.ore)} h − margine ${Math.round(cfg.margine * 100)}% · ${st.tot} sessioni da ${PL.min}′ · ${perGiorno(cfg)} al giorno</p>
          <p style="margin-top:10px"><span class="badge ${st.giudizio[2]}">${st.giudizio[1]}</span> <span class="small">${st.ok ? `${n1(st.utili - st.serve)} h di riserva` : `mancano ${n1(st.serve - st.utili)} h`} · copri il ${Math.round(Math.min(9.99, st.giudizio[3]) * 100)}% delle ore che servono</span></p>
          ${st.giudizio[1] === "Fattibile" ? "" : `<p class="small" style="margin-top:8px">${st.giudizio[1] === "Non realistico" ? "Con questi tempi l'obiettivo non è realistico: scegli una fascia più bassa, sposta l'appello o aggiungi giorni e ore." : "Aggiungi giorni o ore, oppure scegli una fascia più bassa."}</p>`}
          <p class="tiny muted" style="margin-top:8px">Fattibile ≥ 110% · Tirato 90–110% · Difficile 70–90% · Non realistico &lt; 70%. Le fasce moltiplicano le ore ufficiali (ipotesi da calibrare con i tempi veri).</p></div>
        ${plus ? `<button class="btn btn-orange btn-arrow btn-block" data-crea>${piani(user)[c.slug] ? "Rigenera il piano" : "Crea il piano"} <span class="arr">${icon("arrow")}</span></button><p class="tiny muted">Il piano si calcola una volta sola: ${piani(user)[c.slug] ? "rigenerarlo azzera le date (le sessioni fatte restano fatte)." : "se salti una sessione, le missioni restano in ordine e vedi il ritardo."}</p>`
          : U.lock("Il piano personale di " + c.title, `Con UniLink Plus: piano stile TTP su tutti i tuoi esami, ${eur(B.prezzoPlus(user))} una tantum`, `data-v4plan="${c.slug}"`)}</section></div>`;
  }
  function metodoStandard(c) {
    const caps = capitoli(c);
    return `<div class="card section"><div class="card-head"><h3>${icon("book")} Il metodo standard di ${esc(c.title)}</h3><span class="badge badge-green">per tutti</span></div>
      <p class="small muted" style="margin-bottom:12px">Fasi uguali per tutti gli esami; cambiano capitoli e numero di sessioni per fascia. È il metodo: il piano personale lo mette sui tuoi giorni.</p>
      <div class="v4-fasi">${PL.fasi.map(([n, q], i) => `<div><span class="sq-label">Fase ${i + 1}</span><b>${n}</b><span class="tiny muted">${Math.round(q * 100)}% delle sessioni</span></div>`).join("")}</div>
      <div class="table-wrap" style="margin-top:14px"><table class="table"><thead><tr><th>Fascia</th><th>Voto</th><th class="num">Sessioni da 45′</th><th class="num">Ore</th><th>Cosa cambia</th></tr></thead><tbody>${PL.fasce.map((f) => `<tr><td>${f.nome}</td><td>${f.voto}</td><td class="num">${sessioniTot(c, f.id, {})}</td><td class="num">${Math.round((sessioniTot(c, f.id) * PL.min) / 60)}</td><td class="small">${f.cosa}</td></tr>`).join("")}</tbody></table></div>
      <p class="small" style="margin-top:12px">Capitoli: ${caps.map(esc).join(" · ")}</p>
      <h3 style="margin:18px 0 8px">Che cosa fai in ogni sessione, e perché</h3>
      <div class="table-wrap"><table class="table"><thead><tr><th>Sessione</th><th>Tecnica</th><th>Prova scientifica</th></tr></thead><tbody>${(M.tecniche || []).map(([t, d, f]) => `<tr><td><span class="v4-t ${PL.TIPI[t] || ""}">${esc(t)}</span></td><td class="small">${esc(d)}</td><td class="small muted">${esc(f)}</td></tr>`).join("")}</tbody></table></div>
      <p class="small" style="margin-top:8px">${esc(M.sconsigliate || "")}</p>
      <details style="margin-top:10px"><summary class="small display">Fonti del metodo</summary><ul class="feed" style="margin-top:8px">${(M.fonti || []).map(([t, u]) => `<li><span class="ic">${icon("file")}</span><div><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a></div></li>`).join("")}</ul></details></div>`;
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
      <div class="v4-blur-msg"><span class="badge badge-orange">UniLink Plus</span><h3>Il piano di ${esc(c.title)}, sui tuoi giorni</h3><p class="small">Percorso per fasi, missioni da spuntare, calendario, «oggi» e completate, su tutti i tuoi esami. È il cuore di Plus. Qui sopra un esempio.</p>
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
      return `${head("Studio · UniLink Planner", "target", `Il tuo <span class="accent">piano</span>`, "Per tutti: il metodo standard e il giudizio «ci stai nei tempi?». Con Plus: il piano personale stile TTP, calcolato sui tuoi giorni, diviso in fasi e sessioni da 45 minuti, su tutti i tuoi esami.", plus ? `<span class="badge badge-orange">Plus · tutti gli esami</span>` : `<span class="badge badge-soft">${icon("lock")} Piano personale: con Plus</span>`)}
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
        cfg[k] = k === "ore" ? Number(el.value) || 1 : k === "margine" ? Math.min(0.4, Math.max(0, Number(el.value) / 100)) : k === "gia" ? Number(el.value) : el.value; redraw();
      }));
      root.querySelectorAll("[data-pf]").forEach((b) => b.addEventListener("click", () => { cfg.fascia = b.dataset.pf; redraw(); }));
      root.querySelectorAll("[data-pg]").forEach((b) => b.addEventListener("click", () => { const g = Number(b.dataset.pg); cfg.giorni = cfg.giorni.includes(g) ? cfg.giorni.filter((x) => x !== g) : cfg.giorni.concat(g); if (!cfg.giorni.length) cfg.giorni = [g]; redraw(); }));
      const crea = root.querySelector("[data-crea]");
      crea && crea.addEventListener("click", async () => {
        const c = B.course(cfg.slug), PI = piani(user), vecchio = PI[cfg.slug];
        if (vecchio && !(await UL.ui.confirmBox("Rigenerare il piano?", "Le date delle sessioni vengono ricalcolate da oggi con le nuove variabili. Le sessioni già fatte restano fatte.", "Rigenera"))) return;
        const S = genera(c, { ...cfg, dal: new Date() });
        if (vecchio) vecchio.sessioni.filter((s) => s.fatto).forEach((s, i) => { if (S[i]) Object.assign(S[i], { fatto: s.fatto, esito: s.esito, errori: s.errori }); });
        PI[cfg.slug] = { fascia: cfg.fascia, appello: cfg.appello, giorni: cfg.giorni.slice(), ore: cfg.ore, margine: cfg.margine, gia: cfg.gia || 0, lezioni: cfg.lezioni || "si", creato: new Date().toISOString(), sessioni: S };
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

  /* 5 · Tesi e CV · 6 · Guida: ARCHIVIATI il 7/10 → js/archivio/tesi-cv-guida.js (si aprono da Da decidere → Archivio) */
})();
