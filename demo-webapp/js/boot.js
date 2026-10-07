/* js/boot.js */
/* NAVIGAZIONE, ROTTE E AVVIO della web app v4.
   UL.NAV.decise = sezioni decise (studente).  UL.NAV.dd = moduli DA DECIDERE (demo C e D), nel gruppo arancione.
   Promuovere un modulo: spostare la sua voce da UL.NAV.dd a UL.NAV.decise e registrare la rotta senza U.dd().
   soloAttiva = se l'area dell'utente è «in arrivo» la voce mostra «Presto» e la pagina «in arrivo». */
(function () {
  const UL = window.UL;
  const B = UL.B, U = UL.U;
  const { icon, esc } = UL.ui;

  UL.NAV = {
    decise: [
      // v8 (commento 11): «I miei esami» è l'unica macrosezione di studio: dentro ogni esame ci sono dispensa, flashcard, esercizi,
      // simulazione, mappa e note (views/studio.js). «Materiali» diventa il catalogo per comprare; «Esercitazioni» è dentro l'esame.
      { g: "Studio", items: [
        { k: "dashboard", l: "Dashboard", i: "home", to: "#/app/dashboard" },
        { k: "esami", l: "I miei esami", i: "book", to: "#/app/esami" },
        { k: "materiali", l: "Catalogo e pacchetti", i: "layers", to: "#/app/materiali/catalogo", soloAttiva: true },
        { k: "planner", l: "Planner", i: "target", to: "#/app/planner", soloAttiva: true },
        { k: "strumenti", l: "Strumenti", i: "calc", to: "#/app/strumenti" },
        // «Guida» archiviata il 7/10; «Aula studio» e «Ambassador» spostate nelle proposte l'8/10 (D45, D46)
      ] },
      // «Dopo gli esami» (Il mio percorso) è una proposta dall'8/10 (D50); il libretto è in «I miei esami»
      { g: "Account", items: [
        { k: "abbonamento", l: "Abbonamento", i: "euro", to: "#/app/abbonamento" },
        { k: "account", l: "Profilo e account", i: "user", to: "#/app/account" },
      ] },
    ],
    // k = rotta, v = vista originale del modulo (UL.views[v]); admin = solo team
    dd: [
      { modulo: "Career (demo C)", i: "brief", items: [
        { k: "piano", l: "Il mio piano", i: "target", v: "pianoC" },
        { k: "studio", l: "Studio con Plus", i: "book", v: "studioC" },
        { k: "opportunita", l: "Opportunità", i: "brief", v: "opportunitaC" },
        { k: "profilo", l: "Profilo talento", i: "user", v: "profiloC" },
        { k: "track", l: "Track", i: "layers", v: "trackC" },
        { k: "mentor", l: "Mentor", i: "users", v: "mentorC" },
        { k: "master", l: "Master", i: "cap", v: "masterC" },
        { k: "eventi", l: "Eventi", i: "calendar", v: "eventiC" },
        { k: "plus", l: "Plus e inviti", i: "spark", v: "plusC" },
        { k: "cockpit", l: "Business cockpit", i: "chart", v: "adminC", admin: true },
      ] },
      { modulo: "Network (demo D)", i: "globe", items: [
        { k: "home", l: "Home dell'ateneo", i: "home", v: "homeD" },
        { k: "dispense", l: "Dispense per ateneo", i: "book", v: "dispenseD" },
        { k: "test", l: "Test e simulazioni", i: "quiz", v: "testD" },
        { k: "ammissioni", l: "Ammissioni MSc", i: "cap", v: "ammissioniD" },
        { k: "academy", l: "Academy", i: "spark", v: "academyD" },
        { k: "club", l: "Club ed eventi", i: "users", v: "clubD" },
        { k: "mercatino", l: "Mercatino", i: "bookmark", v: "mercatinoD" },
        { k: "calcolatori", l: "Calcolatori e guide", i: "calc", v: "strumentiD" },
        { k: "pass", l: "Pass e crediti", i: "star", v: "passD" },
        { k: "rete", l: "La rete", i: "shield", v: "adminD", admin: true },
      ] },
    ],
  };

  /* ---------- viste-cornice ---------- */
  UL.views.materialiU = U.soloAttiva("materialiB", "Materiali");
  UL.views.praticaU = U.soloAttiva("praticaB", "Esercitazioni");
  UL.views.schedaU = U.soloAttiva("schedaB", "Scheda esame");
  const ddRoutes = {};
  UL.NAV.dd.forEach((g) => g.items.forEach((it) => {
    UL.views["dd_" + it.k] = U.dd(it.k, it.v);
    ddRoutes[it.k] = { view: "dd_" + it.k, admin: !!it.admin };
  }));
  // sotto-menu del modulo in cima a ogni sua pagina (così la sidebar resta corta)
  U.ddTabs = (route, user) => {
    const g = UL.NAV.dd.find((x) => x.items.some((i) => i.k === route));
    if (!g) return "";
    return `<div class="tabs" style="overflow-x:auto">${g.items.filter((i) => !i.admin || user.role === "admin").map((i) => `<a href="#/app/${i.k}" class="${i.k === route ? "on" : ""}">${icon(i.i)} ${esc(i.l)}</a>`).join("")}</div>`;
  };

  /* ---------- profilo (account.js della demo A): area, ateneo, corso, anno, colore del cerchio ---------- */
  UL.CONFIG.skipCdsAtRegister = true; // corso, anno, area e piano si scelgono nel primo accesso
  UL.CONFIG.accountFields = (user) => {
    const p = user.profile;
    const opt = (v, l, cur) => `<option value="${v}" ${String(cur) === String(v) ? "selected" : ""}>${esc(l)}</option>`;
    return `
    <div class="field"><label for="ac-area">Area di studio</label><select class="select" id="ac-area" name="area">${window.UL_AREE.map((a) => opt(a.slug, a.nome + (a.stato === "attiva" ? "" : a.stato === "in_arrivo" ? " (in arrivo)" : " (proposta)"), p.area)).join("")}</select></div>
    <div class="field"><label for="ac-ateneo">Ateneo</label><select class="select" id="ac-ateneo" name="ateneo">${[["unifi", "Università di Firenze"]].concat((window.UL_D ? window.UL_D.unis : []).filter((u) => u.id !== "unifi").map((u) => [u.id, u.n || u.id])).map(([k, l]) => opt(k, l + (k === "unifi" ? "" : " (da decidere)"), p.ateneo || "unifi")).join("")}</select></div>
    <div class="field"><label for="ac-cds">Corso di laurea</label><select class="select" id="ac-cds" name="cds">${[["EA", "Economia Aziendale"], ["EC", "Economia e Commercio"], ["", "Altro / nessuno"]].map(([k, l]) => opt(k, l, p.cds)).join("")}</select></div>
    <div class="field"><label for="ac-curr">Curriculum (III anno; II anno per EC)</label><select class="select" id="ac-curr" name="curriculum">${[["", "Non ancora scelto"]].concat(window.UL_PERCORSI ? Object.entries(window.UL_PERCORSI.corsi).flatMap(([cds, c]) => Object.entries(c.curricula).map(([k, n]) => [k, cds + " · " + n])) : []).map(([k, l]) => opt(k, l, p.curriculum || "")).join("")}</select></div>
    <div class="field"><label for="ac-anno">Anno</label><select class="select" id="ac-anno" name="anno">${[["1", "I anno"], ["2", "II anno"], ["3", "III anno"], ["FC", "Fuori corso"]].map(([k, l]) => opt(k, l, p.anno)).join("")}</select></div>
    <div class="field span-2"><label>Colore del tuo cerchio (in alto a destra)</label><div class="row colori-cerchio">${U.COLORI.map((c) => `<label style="cursor:pointer"><input type="radio" name="colore" value="${c}" ${p.colore === c ? "checked" : ""} class="sr-only"><span class="avatar" style="background:${c};color:#fff">${esc(UL.ui.initials(p))}</span></label>`).join("")}</div><p class="tiny muted" style="margin-top:6px">Quello scelto ha il bordo e la spunta: si applica quando salvi.</p></div>`;
  };

  const soon = (user, it) => it.soloAttiva && !U.attiva(user);
  // pagina corrente: la app usa sia «#/app/pagina» sia il token «#app.pagina» nell'URL
  const curPage = () => (location.hash.replace(/^#\/?app[./]/, "").split(/[./]/)[0] || "dashboard");
  UL.shell.start({
    key: "ul_unilink_v4",
    name: "UniLink",
    tag: "Area Personale",
    flag: "DEMO v9 · dati di esempio",
    home: "#/app/dashboard",
    homeKey: "dashboard",
    onboarding: "onboardingU",
    publicRoutes: { "": "login", login: "login", registrati: "register", recupero: "recover" },
    appRoutes: Object.assign({
      // parte decisa
      dashboard: { view: "dashboardU" }, esami: { view: "studioU" }, strumenti: { view: "strumentiU" }, kit: { view: "kitU" },
      materiali: { view: "materialiU" }, esercitazioni: { view: "praticaU" }, scheda: { view: "schedaU" },
      percorso: { view: "percorsoProp" }, planner: { view: "plannerU" }, leggi: { view: "lettoreU" },
      aula: { view: "aulaProp" }, ambassador: { view: "ambassadorProp" },   // v8: proposte D45 e D46, fuori dalla sidebar
      // archiviati il 7/10: si aprono solo dall'Archivio (guida tiene la sua rotta per i link interni, con il banner)
      archivio: { view: "archivioU" }, guida: { view: "guidaArch" }, mentoring: { view: "ambassadorProp" },
      abbonamento: { view: "abbonamentoU" }, acquisti: { view: "abbonamentoU" }, account: { view: "account" },
      // sezione di lavoro
      decidere: { view: "decidereU" }, configurazione: { view: "configU" },
      metriche: { view: "adminB", admin: true },
    }, ddRoutes), // moduli da decidere: piano, studio, opportunita, …, home, dispense, test, …
    nav(user) {
      const err = Object.keys(window.UL_QUIZ).reduce((s, k) => s + B.errors(user, k).length, 0);
      const badge = (it) => it.k === "esami" ? (err ? err + " errori" : user.activity.exams.filter((e) => e.status !== "done").length || "") : it.k === "abbonamento" && B.plus(user) ? "Plus" : "";
      const toItem = (it) => Object.assign({}, it, { soon: soon(user, it), badge: soon(user, it) ? "" : badge(it) });
      const g = UL.NAV.decise.map((x) => ({ g: x.g, items: x.items.map(toItem) }));
      // gruppo arancione: solo il catalogo delle proposte (i moduli C e D si aprono dalle card, non più dalla sidebar) + configurazione
      const cur = curPage(), inModulo = UL.NAV.dd.some((m) => m.items.some((i) => i.k === cur));
      const ddItems = [{ k: inModulo ? cur : "decidere", l: "Tutte le proposte", i: "alert", to: "#/app/decidere", badge: String(window.UL_DA_DECIDERE.length) }]
        .concat([{ k: "kit", l: "Kit per esame", i: "layers", to: "#/app/kit" }, { k: "archivio", l: "Archivio", i: "file", to: "#/app/archivio", badge: String((UL.ARCHIVIO || []).length) }, { k: "configurazione", l: "Configurazione", i: "settings", to: "#/app/configurazione" }])
        .concat(user.role === "admin" ? [{ k: "metriche", l: "Metriche", i: "shield", to: "#/app/metriche" }] : []);
      g.push({ g: "Da decidere", cls: "dd", items: ddItems });
      return g;
    },
    userMenu(user) {
      return [{ l: "Abbonamento", i: "euro", to: "#/app/abbonamento" }, { l: "Profilo e colore", i: "user", to: "#/app/account" }, { l: "Configurazione", i: "settings", to: "#/app/configurazione" }]
        .concat(user.role === "admin" ? [{ l: "Metriche", i: "shield", to: "#/app/metriche" }] : []);
    },
    // riquadro in cima alla sidebar: area di studio e ateneo
    sideHead(user) {
      const a = U.area(user);
      const ateneo = U.ateneoAttivo(user) ? "UniFi" : (window.UL_D && UL.D ? UL.D.myUni(user).s || user.profile.ateneo : user.profile.ateneo);
      return `<div class="row between"><span class="sq-label">La tua area</span>${U.attiva(user) ? '<span class="badge badge-green">attiva</span>' : '<span class="badge badge-yellow">in arrivo</span>'}</div>
        <p class="display" style="color:var(--navy);font-size:18px;margin-top:8px">${esc(a.nome)}</p>
        <p class="tiny muted" style="margin-top:4px">${icon("globe")} ${esc(ateneo)}${U.ateneoAttivo(user) ? "" : " (da decidere)"} · <a href="#/app/account">cambia</a></p>`;
    },
    // card in fondo alla sidebar: il piano attuale e l'upgrade
    sideFoot(user) {
      const plus = B.plus(user);
      const n = B.courses().filter((c) => B.owns(user, c.slug)).length;
      return `<div class="row between"><span class="display small" style="color:var(--navy)">Il tuo piano</span><b class="display" style="color:var(--orange);font-weight:400">${esc(B.planName(user))}</b></div>
        <p class="tiny muted" style="margin:6px 0 10px">${plus ? "Planner personale e ripasso errori su tutti gli esami." : n > 1 ? `${n} dispense da leggere. Il Planner su tutti gli esami è con Plus.` : "Economia Aziendale è gratis per tutti: sblocchi solo ciò che ti serve."}</p>
        <a href="#/app/abbonamento" class="small display" style="text-decoration:none">${plus ? "Il tuo piano →" : "Vedi piani e prezzi →"}</a>`;
    },
    notifications(user) {
      const out = [];
      user.activity.exams.filter((e) => e.status !== "done" && e.appello).forEach((e) => {
        const d = B.daysTo(e.appello);
        if (d >= 0 && d <= 30 && B.course(e.slug)) out.push({ id: "app-" + e.slug + e.appello, t: `${B.course(e.slug).title}: appello tra ${d} giorni.`, to: "#/app/esami/" + e.slug });
      });
      Object.keys(window.UL_QUIZ).forEach((k) => { const n = B.errors(user, k).length; if (n) out.push({ id: "err-" + k + n, t: `${B.course(k).title}: ${n} domande da ripassare.`, to: `#/app/esercitazioni/${k}/errori` }); });
      if (!U.attiva(user)) out.push({ id: "arrivo-" + user.profile.area, t: `${U.area(user).nome}: sei in lista d'attesa, ti avvisiamo quando parte.`, to: "#/app/dashboard" });
      return out;
    },
  });
})();
