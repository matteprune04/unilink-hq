/* UniLink · Web app (area personale) — demo v2 · base grafica A
   Riferimento per lo sviluppo reale (Next.js + Supabase), non codice di produzione.
   Indice: 1 utilità · 2 stato e account · 3 regole (area × percorso × piano) · 4 guscio
           5 accesso e primo accesso · 6 pagine comuni · 7 Studio · 8 Test Prep · 9 Futuro
           10 account (salvati, piano e acquisti, profilo) · 11 Da decidere e Configurazione · 12 avvio ed eventi
   Ogni pagina è una funzione in P (P.oggi, P.esami…). Per aggiungerne una: riga in UL_MODULI + funzione qui. */
(function () {
  "use strict";

  /* ---------------- 1 · utilità ---------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const C = { aree: UL_AREE, percorsi: UL_PERCORSI, moduli: UL_MODULI, piani: UL_PIANI, strumenti: UL_STRUMENTI, domande: UL_DOMANDE, persone: UL_PERSONE, dec: UL_DA_DECIDERE };
  const SITO = UL_SITO, WA = UL_WA, DISP = window.UL_DISPENSE || [];
  const OGGI = "2026-10-06"; // la demo racconta sempre lo stesso giorno
  const dt = (iso) => new Date(iso + "T09:00:00");
  const giorni = (iso) => Math.round((dt(iso) - dt(OGGI)) / 864e5);
  const dataIt = (iso, o = { day: "numeric", month: "long", year: "numeric" }) => dt(iso).toLocaleDateString("it-IT", o);
  const addG = (iso, n) => { const d = dt(iso); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const num = (n, d = 1) => Number(n).toFixed(d).replace(".", ",");
  const disp = (slug) => DISP.find((d) => d.slug === slug);
  const uid = () => Math.random().toString(36).slice(2, 9);
  const COLORI = ["#cf7527", "#172554", "#1a453c", "#7a4fa0", "#2f4a8a", "#a95d1c", "#9d174d", "#0f5f6b"];
  const ARG = {
    microeconomia: ["Domanda e offerta", "Elasticità", "Scelte del consumatore", "Costi di produzione", "Concorrenza perfetta", "Monopolio", "Oligopolio"],
    statistica: ["Statistica descrittiva", "Probabilità", "Variabili aleatorie", "Distribuzione normale", "Inferenza", "Regressione"],
    macroeconomia: ["Contabilità nazionale", "Moneta", "IS-LM", "Mercato del lavoro", "Inflazione", "Economia aperta"],
    "contabilitá": ["Partita doppia", "Operazioni di acquisto", "Operazioni di vendita", "Assestamento", "Bilancio"],
    finanza_aziendale: ["Valore attuale", "Rischio e rendimento", "Costo del capitale", "Struttura finanziaria", "Valutazione d'azienda"],
  };
  const IC = {
    casa: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>', calendario: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    libro: '<path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>', file: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17h.01"/>', grafico: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>', cappello: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    globo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>', valigia: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 12h18"/>',
    salva: '<path d="M6 3h12v18l-6-4-6 4z"/>', carrello: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l3 12h11l2-8H6"/>',
    utente: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>', cantiere: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
    ingranaggio: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    lucchetto: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    freccia: '<path d="M5 12h14M13 6l6 6-6 6"/>', link: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
    esci: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
  };
  const ico = (k) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${IC[k] || ""}</svg>`;

  /* ---------------- 2 · stato e account (in demo: nel browser; nella app vera: Supabase) ---------------- */
  const KEY = "ul-app-v2";
  let S = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } })() || { u: null, onb: null, errori: [], quizOggi: { d: OGGI, n: 0 } };
  const salva = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const U = () => S.u;
  function nuovoUtente(p) {
    const u = JSON.parse(JSON.stringify(p));
    u.esami = (u.esami || []).map((e) => ({ id: uid(), argomenti: e.argomenti || ARG[e.slug] || ["Ripasso generale"], ...e }));
    u.libretto = (u.libretto || []).map((l) => ({ slug: l[0], voto: l[1], cfu: l[2] || 9 }));
    u.tasks = taskIniziali(u); u.check = {}; u.shortlist = u.percorso === "futuro" ? ["Una MSc in Finance (da scegliere)"] : [];
    return u;
  }
  function taskIniziali(u) {
    const t = [], giorniSett = ["2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09"];
    u.esami.forEach((e, k) => e.argomenti.slice(0, 3).forEach((a, i) => t.push({ id: uid(), titolo: nomeEsame(e) + " · " + a, data: giorniSett[(k * 2 + i + 1) % 5], ora: ["16:00", "10:00", "18:00"][i], min: [45, 60, 30][i], tipo: "studio", fatto: e.fatti.includes(i) })));
    if (u.percorso === "test") ["Diagnostico TOLC-E · 20 domande", "Logica · 15 esercizi", "Matematica · percentuali"].forEach((x, i) => t.push({ id: uid(), titolo: x, data: giorniSett[i + 1], ora: "17:00", min: 30, tipo: "test", fatto: i === 0 }));
    if (u.percorso === "futuro") ["Shortlist di 3 magistrali", "Aggiorna il CV in inglese", "Informati sul test d'inglese"].forEach((x, i) => t.push({ id: uid(), titolo: x, data: giorniSett[i + 2], ora: "18:00", min: 40, tipo: "futuro", fatto: false }));
    return t;
  }
  const nomeEsame = (e) => (disp(e.slug) || {}).nome || e.nome || e.slug;
  const ini = (u) => (u.nome[0] || "?") + (u.cognome[0] || "");

  /* ---------------- 3 · regole: AREA × PERCORSO × PIANO ---------------- */
  const area = () => C.aree.find((a) => a.slug === U().area) || C.aree[0];
  const ateneo = () => (area().atenei.find((a) => a.slug === U().ateneo) || area().atenei[0] || { nome: "—" });
  const areaAttiva = () => area().stato === "attiva";
  const percorso = () => C.percorsi.find((p) => p.id === U().percorso) || C.percorsi[1];
  const modulo = (id) => C.moduli.find((m) => m.id === id);
  const haContenuto = (m) => m.aree.includes("tutte") || (m.aree.includes(U().area) && areaAttiva());
  const visibile = (m) => m.percorso === "comune" || m.percorso === "account" || m.percorso === U().percorso;
  // acquisti e piano
  const plus = () => U().piano === "plus" || U().acquisti.some((a) => a.tipo === "plus");
  const gratisUsata = () => U().acquisti.find((a) => a.tipo === "una_gratis");
  function possiede(slug) {
    const d = disp(slug);
    return U().acquisti.find((a) => (["dispensa", "una_gratis", "appunti"].includes(a.tipo) && a.esame === slug) || (a.tipo === "semestre" && d && d.anno === a.anno && d.sem === a.sem));
  }
  // accesso(cosa, esame) → "pieno" | "appunti" | "estratto" | "limitato" | "bloccato". UNICO punto delle regole dei piani.
  function accesso(cosa, slug) {
    const a = slug ? possiede(slug) : null;
    if (cosa === "materiale") return a ? (a.tipo === "appunti" ? "appunti" : "pieno") : "estratto";
    if (cosa === "quiz") return plus() || (a && a.tipo !== "appunti") ? "pieno" : "limitato";
    if (["ripasso", "simulazione", "piano_guidato", "cv_confronto"].includes(cosa)) return plus() ? "pieno" : "bloccato";
    return "pieno";
  }
  const LIMITE_QUIZ = 10;
  function pianoNome() {
    if (plus()) return "Plus";
    if (U().acquisti.some((a) => a.tipo === "semestre")) return "Pacchetto semestre";
    if (U().acquisti.some((a) => a.tipo === "dispensa")) return "Dispensa completa";
    return "Gratuito";
  }
  const lucchetto = (testo = "Con Plus") => `<span class="lock">${ico("lucchetto")} ${esc(testo)}</span>`;

  let toastT;
  const toast = (t) => { const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (el.hidden = true), 2800); };
  const modal = (titolo, corpo, largo) => { const m = $("#modal"); $(".sheet", m).style.width = largo ? "min(1000px,100%)" : ""; $(".sheet", m).innerHTML = `<div class="mh"><h2>${titolo}</h2><button class="x" data-chiudi aria-label="Chiudi">${ico("x")}</button></div><div class="mb">${corpo}</div>`; m.hidden = false; };
  const chiudi = () => ($("#modal").hidden = true);

  /* ---------------- 4 · guscio ---------------- */
  function guscio(id) {
    const u = U(), a = area(), p = percorso();
    const voce = (m) => `<a class="navl ${id === m.id ? "on" : ""}" href="#/${m.id}">${ico(m.icona)}<span>${esc(m.nome)}</span>${!haContenuto(m) ? `<span class="cnt">presto</span>` : m.id === "esami" && u.esami.length ? `<span class="cnt">${u.esami.length}</span>` : m.id === "salvati" ? `<span class="cnt">${u.salvati.length}</span>` : m.id === "errori" && S.errori.length ? `<span class="cnt">${S.errori.length}</span>` : ""}</a>`;
    const gr = (perc) => C.moduli.filter((m) => m.percorso === perc).map(voce).join("");
    $("#side").innerHTML = `
      <a class="brand" href="#/oggi"><img src="img/logo-white.png" alt="">unilink</a>
      <div class="ws"><label for="perc">Il tuo percorso</label>
        <select id="perc">${C.percorsi.map((x) => `<option value="${x.id}" ${x.id === u.percorso ? "selected" : ""}>${esc(x.nome)}</option>`).join("")}</select>
        <div class="ctx"><i style="background:${a.colore}"></i>${esc(a.nome)} · ${esc(ateneo().nome)}${areaAttiva() ? "" : " · in arrivo"}</div></div>
      ${gr("comune")}
      <div class="navg">${esc(p.nome)}</div>${gr(u.percorso)}
      <div class="navg">Il tuo account</div>${gr("account")}
      <div class="navg">Sezione di lavoro</div>
      <a class="navl dec ${id === "decidere" ? "on" : ""}" href="#/decidere">${ico("cantiere")}<span>Da decidere</span><span class="cnt">${C.dec.length}</span></a>
      <a class="navl dec ${id === "configurazione" ? "on" : ""}" href="#/configurazione">${ico("ingranaggio")}<span>Configurazione</span></a>
      <div class="sfoot"><a class="suser" href="#/profilo"><span class="av" style="background:${u.colore}">${esc(ini(u))}</span><span>${esc(u.nome + " " + u.cognome)}<small>${esc(pianoNome())} · ${esc(a.nome)}</small></span></a>
        <span class="ver">Demo v${UL_VERSIONE.n} · dati di esempio</span></div>`;
    const nome = id === "decidere" ? "Da decidere" : id === "configurazione" ? "Configurazione" : (modulo(id) || {}).nome || "";
    $("#top").innerHTML = `
      <button class="menu-btn" data-menu aria-label="Apri il menu">${ico("menu")}</button>
      <a class="mlogo" href="#/oggi"><img src="img/logo-blu.png" alt="">unilink</a>
      <div class="crumb">Il tuo spazio <span>/</span> <b>${esc(nome)}</b></div>
      <div class="tacts"><span class="data">${dt(OGGI).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}</span>
        <button class="btn sec sm nuova" data-nuova-attivita>Nuova attività</button>
        <div class="avwrap"><button class="avbtn" data-avatar aria-haspopup="true" aria-label="Il tuo account"><span class="av" style="background:${u.colore}">${esc(ini(u))}</span><span class="nm">${esc(u.nome)}<small>${esc(pianoNome())}</small></span></button>
          <div class="avmenu" id="avmenu" hidden>
            <div class="hd"><span class="av lg" style="background:${u.colore}">${esc(ini(u))}</span><div><b>${esc(u.nome + " " + u.cognome)}</b><span class="small">${esc(u.email)}</span><br><span class="tag ${plus() ? "nv" : "cr"}" style="margin-top:6px">${esc(pianoNome())}</span></div></div>
            <a href="#/profilo">${ico("utente")} Profilo e colore</a><a href="#/abbonamento">${ico("carrello")} Piano e acquisti</a>
            <button data-come>${ico("info")} Come funziona l'area</button><a href="#/configurazione">${ico("ingranaggio")} Configurazione (team)</a>
            <button data-cambia>${ico("utente")} Cambia account demo</button><button data-rifai>${ico("freccia")} Rifai il primo accesso</button><button data-esci>${ico("esci")} Esci</button>
          </div></div></div>`;
    $("#sub").innerHTML = `<span>DEMO v${UL_VERSIONE.n} · ${esc(u.nome)} · ${esc(a.nome)} · ${esc(p.nome)} · ${esc(pianoNome())} <span class="hide-m">· dati di esempio sul dispositivo</span></span>
      <div class="row"><a class="dd" href="#/decidere">DA DECIDERE</a><a href="#" data-come class="hide-m">Come funziona l'area</a><a href="${SITO}" target="_blank" rel="noopener" class="hide-m">Sito pubblico</a></div>`;
    const tabs = C.moduli.filter((m) => m.tab && visibile(m)).sort((x, y) => x.tab - y.tab).slice(0, 5);
    $("#tabbar").innerHTML = tabs.map((m) => `<a href="#/${m.id}" class="${id === m.id ? "on" : ""}">${ico(m.icona)}<span>${esc(m.nome.replace("I miei esami", "Esami").replace("Il mio piano", "Piano").replace("Magistrali e MSc", "Magistrali"))}</span></a>`).join("");
  }
  const testa = (titolo, sotto, azioni = "", eyebrow) => `<div class="ph"><div><span class="eyebrow">${esc(eyebrow || percorso().nome + " · il tuo spazio")}</span><h1>${esc(titolo)}</h1>${sotto ? `<p>${sotto}</p>` : ""}</div>${azioni ? `<div class="row">${azioni}</div>` : ""}</div>`;
  const rimando = (id, testo) => { const d = C.dec.find((x) => x.id === id); return d ? `<a class="dec-banner section-gap" href="#/decidere/${id}">${ico("cantiere")}<span><b>Da decidere · ${id}</b> — ${esc(testo || d.titolo)}. Apri l'architettura →</span></a>` : ""; };
  // stato «in arrivo» per un modulo senza contenuto nell'area scelta
  function inArrivo(m) {
    const a = area(), dentro = (S.attesa || {})[a.slug];
    return `${testa(m.nome + ".", `Per ${esc(a.nome)} questa sezione non c'è ancora: ti diciamo la verità e ti avvisiamo quando parte.`, "", a.nome + " · in arrivo")}
      <div class="grid g2"><section class="card crema"><span class="tag or">In arrivo</span><h2 style="margin:12px 0 8px">${esc(a.nome)} sta arrivando</h2>
        <p class="muted">Cerchiamo gli studenti che costruiscono con noi materiali e strumenti di ${esc(a.nome)}. Ogni area parte quando c'è chi la costruisce.</p>
        <a class="btn or" href="${WA}" target="_blank" rel="noopener">Costruiscila con noi</a></section>
      <section class="card">${dentro ? `<h2>Sei in lista d'attesa</h2><p class="muted">Risposta salvata: «${esc(dentro)}». Ti scriviamo solo quando l'area parte.</p>` : `<form id="frm-attesa" class="grid" style="gap:12px"><h2>Avvisami quando parte</h2><label class="fld">${esc(a.domanda || "A che anno sei?")}<input name="r" required placeholder="Scrivi qui"></label><label class="chk"><input type="checkbox" required> Usate la mia email solo per avvisarmi quando l'area parte.</label><button class="btn">Avvisami</button></form>`}</section></div>
      ${a.decidere ? rimando(a.decidere, "Come sarebbe " + a.nome + " una volta attiva") : ""}`;
  }

  /* ---------------- 5 · accesso e primo accesso ---------------- */
  const pub = (corpo) => `<div class="pub"><header class="pubtop"><div class="in"><a class="brand"><img src="img/logo-blu.png" alt="">unilink</a><a class="tbtn" href="${SITO}" target="_blank" rel="noopener">Torna al sito</a></div></header>
    <main class="pubmain">${corpo}</main><footer class="pubfoot">UniLink · progetto indipendente, non affiliato all'Università di Firenze · demo v${UL_VERSIONE.n}</footer></div>`;
  // P00 · Accesso (login della A: «Il tuo spazio. Il tuo percorso.»)
  function accedi() {
    return pub(`<div class="entry">
      <span class="tag ok" style="justify-self:start">Accesso</span>
      <h1>Il tuo spazio.<br>Il tuo percorso.</h1>
      <p class="muted">Ti mandiamo un link via email: niente password da ricordare. Funziona con qualsiasi email.</p>
      <form id="frm-accedi" class="grid" style="gap:12px"><label class="fld">Email<input type="email" name="email" placeholder="nome.cognome@stud.unifi.it" autocomplete="email" required></label>
        <button class="btn full">Mandami il link</button></form>
      <div class="sep">oppure prova un account demo</div>
      <div class="persone">${C.persone.map((p) => `<button class="persona" data-persona="${p.id}"><span class="av" style="background:${p.colore}">${esc(p.nome[0] + p.cognome[0])}</span><span><b>${esc(p.nome + " " + p.cognome)}</b><small>${esc(p.etichetta)}</small></span></button>`).join("")}
        <button class="persona" data-nuovo><span class="av" style="background:#e2e5ed;color:#172554">+</span><span><b>Nuovo account</b><small>Prova il primo accesso (7 passi)</small></span></button></div>
      <p class="small">Demo: nessuna email inviata, nessun pagamento. I dati restano su questo dispositivo.</p></div>`);
  }
  // Primo accesso: 7 passi. Ogni passo legge/scrive S.onb; alla fine nasce l'utente.
  const PASSI = ["Chi sei", "Cosa studi", "Il tuo percorso", "Da dove partire", "Il tuo ritmo", "Privacy e avvisi", "Come iniziare"];
  const onbBase = () => ({ nome: "", cognome: "", email: "", area: "economia", ateneo: "unifi", corso: "Economia Aziendale", anno: "I", percorso: "studio", esami: [], minuti: 60, obiettivo: "", giorni: ["Lun", "Mer", "Ven"], avvisi: true, novita: false, privacy: false, piano: "gratuito", dataTest: "2027-04-15", meta: "Magistrale in Italia" });
  function benvenuto(n) {
    const o = S.onb || (S.onb = onbBase());
    n = Math.min(Math.max(+n || 1, 1), 7);
    const a = C.aree.find((x) => x.slug === o.area) || C.aree[0];
    let corpo = "";
    if (n === 1) corpo = `<h1>Ciao! Come ti chiami?</h1><p class="muted">Ci serve solo per salutarti e per il cerchio con le tue iniziali.</p>
      <div class="grid g2" style="gap:12px"><label class="fld">Nome<input name="nome" value="${esc(o.nome)}" required></label><label class="fld">Cognome<input name="cognome" value="${esc(o.cognome)}" required></label></div>
      <label class="fld">Email<input name="email" type="email" value="${esc(o.email)}" placeholder="nome.cognome@stud.unifi.it" required></label>`;
    if (n === 2) corpo = `<h1>Cosa studi?</h1><p class="muted">L'area decide materiali, corsi e strumenti. Puoi cambiarla quando vuoi dal profilo.</p>
      <div class="grid" style="gap:10px">${C.aree.map((x) => `<button type="button" class="choice ${o.area === x.slug ? "on" : ""}" data-onb-area="${x.slug}"><span class="dot" style="background:${x.colore}"></span><div><h3>${esc(x.nome)} ${x.stato === "attiva" ? `<span class="tag ok">Attiva</span>` : x.stato === "in_arrivo" ? `<span class="tag or">In arrivo</span>` : `<span class="tag">Dicci quale</span>`}</h3><p>${x.stato === "attiva" ? esc(x.corsi.join(" · ")) : x.stato === "in_arrivo" ? "Ti registri ora e ti avvisiamo quando parte: intanto hai esami, piano e strumenti per tutti." : "Scrivi la tua area: le richieste decidono le prossime aree."}</p></div></button>`).join("")}</div>
      <div class="grid g3" style="gap:12px">
        <label class="fld">Ateneo<select name="ateneo">${a.atenei.map((x) => `<option value="${x.slug}" ${o.ateneo === x.slug ? "selected" : ""}>${esc(x.nome)}</option>`).join("")}<option value="altro" ${o.ateneo === "altro" ? "selected" : ""}>Altro ateneo (presto)</option></select></label>
        <label class="fld">Corso${a.corsi.length ? `<select name="corso">${a.corsi.map((c) => `<option ${o.corso === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>` : `<input name="corso" value="${esc(o.corso)}" placeholder="Es. Ingegneria">`}</label>
        <label class="fld">Anno<select name="anno">${["Prima dell'università", "I", "II", "III", "IV", "V", "Fuori corso"].map((x) => `<option ${o.anno === x ? "selected" : ""}>${x}</option>`).join("")}</select></label></div>`;
    if (n === 3) corpo = `<h1>Da dove vuoi partire?</h1><p class="muted">Il percorso decide le priorità della tua home. Un account, tre percorsi: lo cambi in ogni momento dalla sidebar.</p>
      <div class="grid" style="gap:10px">${C.percorsi.map((x) => `<button type="button" class="choice ${o.percorso === x.id ? "on" : ""}" data-onb-perc="${x.id}">${ico(x.icona)}<div><h3>${esc(x.nome)} <span class="small">· ${esc(x.quando)}</span></h3><p>${esc(x.desc)}</p></div></button>`).join("")}</div>`;
    if (n === 4) {
      if (a.stato !== "attiva") corpo = `<h1>${esc(a.nome)} sta arrivando</h1><p class="muted">Non abbiamo ancora materiali per ${esc(a.nome)}. Ti mettiamo in lista d'attesa: è il numero che decide quale area parte prima.</p>
        <label class="fld">${esc(a.domanda || "A che anno sei?")}<input name="attesa" value="${esc(o.attesa || "")}" placeholder="Scrivi qui"></label>`;
      else if (o.percorso === "test") corpo = `<h1>Quale test prepari?</h1><p class="muted">${esc(a.test ? a.test.nota : "")}</p>
        <div class="grid g2" style="gap:12px"><label class="fld">Test<select name="test"><option>${esc(a.test ? a.test.nome : "Nessun test")}</option></select></label><label class="fld">Data del test (se la sai)<input type="date" name="dataTest" value="${esc(o.dataTest)}"></label></div>`;
      else if (o.percorso === "futuro") corpo = `<h1>Cosa vuoi dopo?</h1><p class="muted">Ci serve per ordinare Erasmus, magistrali e CV nella tua home.</p>
        <div class="grid" style="gap:10px">${["Magistrale in Italia", "Magistrale o MSc all'estero", "Erasmus", "Lavoro o stage"].map((x) => `<button type="button" class="choice ${o.meta === x ? "on" : ""}" data-onb-meta="${esc(x)}"><div><h3>${esc(x)}</h3></div></button>`).join("")}</div>`;
      else { const l = DISP.filter((d) => d.anno === (["I", "II", "III"].includes(o.anno) ? o.anno : "I"));
        corpo = `<h1>Quali esami prepari?</h1><p class="muted">Scegli gli esami di questo semestre (puoi cambiarli dopo). Le date le aggiungi tu: controllale sempre sul sito del corso.</p>
        <div class="args">${l.map((d) => `<button type="button" class="arg ${o.esami.includes(d.slug) ? "ok" : ""}" data-onb-esame="${d.slug}">${esc(d.nome)}</button>`).join("")}</div>`; }
    }
    if (n === 5) corpo = `<h1>Il tuo ritmo</h1><p class="muted">Lo usiamo per proporti le sessioni della settimana. Niente di vincolante.</p>
      <div class="fld">Quanto tempo al giorno?<div class="seg">${[30, 45, 60, 90].map((m) => `<button type="button" class="${o.minuti === m ? "on" : ""}" data-onb-min="${m}">${m} min</button>`).join("")}</div></div>
      <div class="fld">Giorni preferiti<div class="args">${["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((g) => `<button type="button" class="arg ${o.giorni.includes(g) ? "ok" : ""}" data-onb-giorno="${g}">${g}</button>`).join("")}</div></div>
      <label class="fld">Il tuo obiettivo (facoltativo)<input name="obiettivo" value="${esc(o.obiettivo)}" placeholder="Es. Microeconomia entro novembre"></label>`;
    if (n === 6) corpo = `<h1>Privacy e avvisi</h1><p class="muted">Scegli tu cosa ricevere. Nessuno vede cosa apri o scarichi.</p>
      <label class="chk"><input type="checkbox" name="privacy" ${o.privacy ? "checked" : ""} required> Ho letto informativa privacy e condizioni d'uso <span class="small">(obbligatorio)</span></label>
      <label class="chk"><input type="checkbox" name="avvisi" ${o.avvisi ? "checked" : ""}> Email quando esce o si aggiorna una dispensa che segui</label>
      <label class="chk"><input type="checkbox" name="novita" ${o.novita ? "checked" : ""}> Email con le novità di UniLink (al massimo una al mese)</label>
      <div class="callout">Puoi scaricare o cancellare i tuoi dati in ogni momento dal profilo.</div>`;
    if (n === 7) corpo = `<h1>Come vuoi iniziare?</h1><p class="muted">Si parte gratis. Gli acquisti si fanno quando servono, da «Piano e acquisti». Prezzi: ipotesi, non ancora decisi.</p>
      <div class="grid g2" style="gap:12px">${C.piani.filter((x) => ["gratuito", "plus"].includes(x.id)).map((x) => `<button type="button" class="choice ${o.piano === x.id ? "on" : ""}" data-onb-piano="${x.id}" style="flex-direction:column;gap:6px"><h3>${esc(x.nome)}</h3><span class="tag ${x.id === "plus" ? "or" : "ok"}">${esc(x.prezzo)}</span><p>${x.include.map(esc).join(" · ")}</p></button>`).join("")}</div>
      <p class="small">Con Gratuito hai anche <b>una dispensa completa a scelta</b>: la scegli in «Materiali».</p>`;
    return pub(`<form class="entry wide" id="frm-onb" data-n="${n}">
      <div class="row between"><span class="eyebrow" style="margin:0">Primo accesso · passo ${n} di 7 · ${esc(PASSI[n - 1])}</span>${n > 1 ? `<a class="tbtn" href="#/benvenuto/${n - 1}">← Indietro</a>` : `<a class="tbtn" href="#/accedi">Annulla</a>`}</div>
      <div class="steps">${PASSI.map((_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("")}</div>
      ${corpo}
      <button class="btn full">${n < 7 ? "Continua" : "Entra nel tuo spazio"}</button></form>`);
  }
  function fineOnboarding() {
    const o = S.onb, a = C.aree.find((x) => x.slug === o.area);
    const base = { id: "nuovo", nome: o.nome || "Studente", cognome: o.cognome || "", email: o.email, colore: COLORI[(o.nome.length + o.cognome.length) % COLORI.length],
      area: o.area, ateneo: o.ateneo, corso: o.corso, anno: o.anno, percorso: o.percorso, piano: o.piano, acquisti: o.piano === "plus" ? [{ tipo: "plus", data: OGGI, importo: "ipotesi" }] : [],
      minuti: o.minuti, obiettivo: o.obiettivo, media: 0, lodi: 0, dataTest: o.dataTest, meta: o.meta,
      esami: o.esami.map((s, i) => ({ slug: s, data: addG(OGGI, 28 + i * 14), obiettivo: 27, fatti: [] })), libretto: [], salvati: o.esami.slice(0, 3) };
    S.u = nuovoUtente(base); if (a && a.stato !== "attiva" && o.attesa) { S.attesa = S.attesa || {}; S.attesa[a.slug] = o.attesa; }
    S.errori = []; S.quizOggi = { d: OGGI, n: 0 }; S.calc = null; S.off = null;
    S.onb = null; salva(); location.hash = "#/oggi"; toast("Benvenuto/a, " + S.u.nome + "! Il tuo spazio è pronto.");
  }

  /* ---------------- 6 · pagine comuni ---------------- */
  const P = {};
  // P01 · Oggi
  P.oggi = () => {
    const u = U(), a = area(), es = u.esami.slice().sort((x, y) => x.data.localeCompare(y.data));
    const oggiT = u.tasks.filter((t) => t.data >= OGGI).sort((x, y) => (x.data + x.ora).localeCompare(y.data + y.ora));
    let hero, titolo;
    if (u.percorso === "test") {
      titolo = `Come va la preparazione, ${u.nome}?`;
      hero = a.test && areaAttiva() ? `<span class="tag">Il prossimo passo</span><h2>${esc(a.test.nome)} · allenamento di oggi</h2><p>10 domande di logica e matematica · ${u.dataTest ? "test tra " + giorni(u.dataTest) + " giorni" : "data del test da inserire"}</p><div class="row"><a class="btn light" href="#/allenamento">Inizia l'allenamento</a><a class="btn ghost" href="#/test">Il mio test</a></div>`
        : `<span class="tag">Il prossimo passo</span><h2>Parti dall'orientamento</h2><p>${a.test ? esc(a.test.nome) + " per " + esc(a.nome) + " è in arrivo." : "Per " + esc(a.nome) + " non c'è un test da preparare con UniLink."}</p><div class="row"><a class="btn light" href="#/orientamento">Orientamento</a></div>`;
    } else if (u.percorso === "futuro") {
      const t = oggiT.find((x) => !x.fatto && x.tipo === "futuro");
      titolo = `Il prossimo passo, ${u.nome}.`;
      hero = `<span class="tag">Il prossimo passo</span><h2>${esc(t ? t.titolo : "Costruisci la tua shortlist")}</h2><p>Obiettivo: ${esc(u.meta || u.obiettivo || "da definire")}</p><div class="row"><a class="btn light" href="#/magistrali">Magistrali e MSc</a><a class="btn ghost" href="#/career">Il tuo CV</a></div>`;
    } else {
      titolo = `Cosa prepari oggi, ${u.nome}?`;
      const e = es.find((x) => x.fatti.length < x.argomenti.length);
      if (e) { const i = e.argomenti.findIndex((_, k) => !e.fatti.includes(k));
        hero = `<span class="tag">Il prossimo passo</span><h2>${esc(nomeEsame(e))} · ${esc(e.argomenti[i])}</h2><p>Appello il ${dataIt(e.data, { day: "numeric", month: "short" })} · tra ${giorni(e.data)} giorni · obiettivo ${e.obiettivo}/30</p>
          <div class="row"><button class="btn light" data-fatto="${e.id}" data-i="${i}">Segna come ripassato</button>${disp(e.slug) && areaAttiva() ? `<a class="btn ghost" href="#/pratica?esame=${e.slug}">Quiz rapido</a>` : ""}</div>`;
      } else hero = `<span class="tag">Il prossimo passo</span><h2>Aggiungi il tuo prossimo esame</h2><p>Data e argomenti: ti diciamo ogni giorno da dove ripartire.</p><div class="row"><button class="btn light" data-nuovo-esame>Aggiungi esame</button></div>`;
    }
    const tot = es.reduce((s, x) => s + x.argomenti.length, 0), fatti = es.reduce((s, x) => s + x.fatti.length, 0);
    const met = (n, v, s) => `<div class="card metric"><span class="mn">${n}</span><span class="num ${/^[A-Za-z]/.test(v) ? "txt" : ""}">${v}</span><span class="small">${s}</span></div>`;
    const metriche = u.percorso === "test"
      ? met("Test", u.dataTest ? giorni(u.dataTest) + " <small>giorni</small>" : "—", a.test ? esc(a.test.nome) : "nessuno") + met("Domande oggi", S.quizOggi.n + "<small>/" + (accesso("quiz") === "pieno" ? "∞" : LIMITE_QUIZ) + "</small>", "allenamento") + met("Errori da ripassare", S.errori.length, "registro errori") + met("Piano", esc(pianoNome()), "il tuo account")
      : met("Prossimo appello", es[0] ? giorni(es[0].data) + " <small>giorni</small>" : "—", es[0] ? esc(nomeEsame(es[0])) : "nessun esame") + met("Argomenti ripassati", fatti + "<small>/" + tot + "</small>", "nei tuoi esami") + met("Media", u.media ? num(u.media) + "<small>/30</small>" : "—", "dal libretto") + met("Piano", esc(pianoNome()), plus() ? "tutto sbloccato" : "vedi sblocchi");
    const g = gratisUsata();
    return `${testa(titolo, "Le tue attività, le risorse che usi e le scelte che stai preparando.", `<a class="btn" href="#/piano">Organizza il piano</a>`, percorso().nome + " · " + a.nome + " · il tuo spazio")}
      ${areaAttiva() ? "" : `<div class="callout or" style="margin-bottom:20px"><b>${esc(a.nome)} è in arrivo.</b> Esami, piano e strumenti per tutti funzionano già; materiali ed esercitazioni arrivano quando l'area parte. ${a.decidere ? `<a class="tbtn" href="#/decidere/${a.decidere}">Come sarà →</a>` : ""}</div>`}
      <div class="grid gx"><section class="card navy hero">${hero}</section><div class="grid g4 metrics" style="grid-template-columns:1fr 1fr">${metriche}</div></div>
      <div class="grid g2 section-gap">
        <section class="card"><div class="ch"><h2>${u.percorso === "studio" ? "I tuoi esami" : "Le tue scelte"}</h2><a class="tbtn" href="#/${u.percorso === "studio" ? "esami" : u.percorso === "test" ? "test" : "magistrali"}">Gestisci</a></div>
          ${u.percorso === "studio" ? (es.length ? es.map((x) => { const p = Math.round((x.fatti.length / x.argomenti.length) * 100); return `<div class="li"><span class="ini">${esc(nomeEsame(x).slice(0, 2).toUpperCase())}</span><div class="grow"><div class="t">${esc(nomeEsame(x))}</div><div class="small">${dataIt(x.data, { day: "numeric", month: "short" })} · obiettivo ${x.obiettivo}/30 · ${x.fatti.length}/${x.argomenti.length} argomenti</div><div class="bar" style="margin-top:8px"><i style="width:${p}%"></i></div></div></div>`; }).join("") : `<p class="muted">Nessun esame ancora.</p>`)
            : u.percorso === "test" ? `<div class="li"><span class="ini">${ico("target")}</span><div class="grow"><div class="t">${esc(a.test ? a.test.nome : "Nessun test")}</div><div class="small">${u.dataTest ? "Il " + dataIt(u.dataTest) : "Data da inserire"}</div></div></div><div class="li"><span class="ini">${ico("cappello")}</span><div class="grow"><div class="t">Corso che ti interessa</div><div class="small">${esc(u.corso)}</div></div></div>`
            : (u.shortlist || []).map((s) => `<div class="li"><span class="ini">${ico("cappello")}</span><div class="grow"><div class="t">${esc(s)}</div></div></div>`).join("") || `<p class="muted">La tua shortlist è vuota.</p>`}</section>
        <section class="card"><div class="ch"><h2>Nel tuo piano</h2><a class="tbtn" href="#/piano">Tutte le attività</a></div>
          ${oggiT.slice(0, 4).map((t) => `<label class="li chk" style="align-items:flex-start"><input type="checkbox" data-task="${t.id}" ${t.fatto ? "checked" : ""}><span class="grow"><span class="t" style="font-weight:400">${esc(t.titolo)}</span><br><span class="small">${dataIt(t.data, { day: "numeric", month: "short" })} · ${t.ora} · ${t.min} min</span></span></label>`).join("") || `<p class="muted">Niente in programma.</p>`}</section></div>
      <div class="grid g2 section-gap">
        <section class="card"><div class="ch"><h2>I tuoi sblocchi</h2><a class="tbtn" href="#/abbonamento">Piano e acquisti</a></div>
          <div class="li"><div class="grow">Piano</div><b style="font-weight:500">${esc(pianoNome())}</b></div>
          <div class="li"><div class="grow">Dispensa gratuita</div><b style="font-weight:500">${g ? "usata: " + esc((disp(g.esame) || {}).nome || "") : "da scegliere"}</b></div>
          <div class="li"><div class="grow">Dispense complete</div><b style="font-weight:500">${DISP.filter((d) => possiede(d.slug)).length}</b></div>
          <div class="li"><div class="grow">Plus</div><b style="font-weight:500">${plus() ? "attivo" : "non attivo"}</b></div></section>
        <section class="card navy"><span class="eyebrow">Community</span><h2 style="color:#fff;margin-bottom:8px">Il gruppo di ${esc(a.nome)}</h2><p>Avvisi su dispense nuove, domande e scadenze: è il nostro canale principale.</p><a class="btn light" href="${WA}" target="_blank" rel="noopener">Apri il gruppo WhatsApp</a></section></div>`;
  };

  // P02 · Il mio piano (settimana o lista)
  let sett = 0, vistaPiano = "settimana";
  P.piano = () => {
    const u = U(), lun = addG("2026-10-05", sett * 7), gg = [...Array(7)].map((_, i) => addG(lun, i));
    const cls = (t) => "task " + (t.tipo !== "studio" ? t.tipo : "") + (t.fatto ? " done" : "");
    return `${accesso("piano_guidato") === "pieno" ? "" : `<div class="callout or" style="margin-bottom:20px"><b>Piano guidato</b> · genera le sessioni dalla data dell'esame e dal tempo che hai. ${lucchetto("Con Plus · ipotesi")} <a class="tbtn" href="#/decidere/D04">Da decidere D04</a></div>`}
      ${testa("Il mio piano.", "Tutte le tue attività nello stesso calendario. Il colore identifica il percorso.", `<button class="btn" data-organizza>Organizza sessioni</button><button class="btn sec" data-nuova-attivita>Aggiungi attività</button>`)}
      <div class="row between" style="margin-bottom:16px"><div class="row"><button class="btn sec sm" data-sett="-1" aria-label="Settimana precedente">←</button><b style="font-weight:500">${dataIt(gg[0], { day: "numeric", month: "short" })} – ${dataIt(gg[6], { day: "numeric", month: "short" })}</b><button class="btn sec sm" data-sett="1" aria-label="Settimana successiva">→</button><button class="tbtn" data-sett="0">Oggi</button></div>
        <div class="seg">${["settimana", "lista"].map((v) => `<button class="${vistaPiano === v ? "on" : ""}" data-vista="${v}">${v === "settimana" ? "Settimana" : "Lista"}</button>`).join("")}</div></div>
      ${vistaPiano === "settimana" ? `<div class="week">${gg.map((g, i) => `<div class="day ${g === OGGI ? "oggi" : ""} ${i > 4 ? "we" : ""}"><span class="dn">${dt(g).toLocaleDateString("it-IT", { weekday: "long" })}</span><span class="dd2">${dt(g).getDate()}</span>
          ${u.tasks.filter((t) => t.data === g).sort((a, b) => a.ora.localeCompare(b.ora)).map((t) => `<button class="${cls(t)}" data-task-btn="${t.id}">${esc(t.titolo)}<small>${t.ora} · ${t.min} min</small></button>`).join("")}</div>`).join("")}</div>`
        : `<section class="card">${u.tasks.slice().sort((a, b) => (a.data + a.ora).localeCompare(b.data + b.ora)).map((t) => `<div class="li"><label class="chk grow"><input type="checkbox" data-task="${t.id}" ${t.fatto ? "checked" : ""}><span>${esc(t.titolo)}<br><span class="small">${dataIt(t.data, { weekday: "short", day: "numeric", month: "short" })} · ${t.ora} · ${t.min} min · ${esc((C.percorsi.find((p) => p.id === t.tipo) || { nome: t.tipo }).nome)}</span></span></label><button class="btn sec sm" data-del-task="${t.id}">Elimina</button></div>`).join("") || `<p class="muted">Nessuna attività.</p>`}</section>`}`;
  };
  function nuovaAttivita() {
    modal("Nuova attività", `<form id="frm-task" class="grid" style="gap:12px"><label class="fld">Cosa<input name="titolo" required placeholder="Es. Statistica · esercizi capitolo 3"></label>
      <div class="grid g3" style="gap:12px"><label class="fld">Giorno<input type="date" name="data" value="${OGGI}" required></label><label class="fld">Ora<input type="time" name="ora" value="17:00"></label><label class="fld">Minuti<input type="number" name="min" value="45" min="10" max="240"></label></div>
      <label class="fld">Percorso<select name="tipo">${C.percorsi.map((p) => `<option value="${p.id}" ${p.id === U().percorso ? "selected" : ""}>${p.nome}</option>`).join("")}</select></label>
      <button class="btn">Aggiungi al piano</button></form>`);
  }

  /* ---------------- 7 · Studio ---------------- */
  P.esami = () => {
    const es = U().esami.slice().sort((a, b) => a.data.localeCompare(b.data));
    return `${testa("I miei esami.", "Appelli, obiettivi e argomenti: il punto di partenza del tuo studio. Le date le inserisci tu: controllale sul sito del corso.", `<button class="btn" data-nuovo-esame>Aggiungi un esame</button>`)}
      ${es.length ? `<div class="grid g2">${es.map((x) => { const d = disp(x.slug), p = Math.round((x.fatti.length / x.argomenti.length) * 100);
        return `<section class="card exam"><div class="row between"><span class="ini">${esc(nomeEsame(x).slice(0, 2).toUpperCase())}</span><span class="tag ok">In preparazione</span></div>
          <h3 style="margin-top:14px">${esc(nomeEsame(x))}</h3>
          <div class="meta"><div><span>Appello pianificato</span>${dataIt(x.data)}</div><div><span>Voto obiettivo</span>${x.obiettivo} / 30</div><div><span>Corso</span>${esc(U().corso)}</div><div><span>Anno · modalità</span>${d ? esc(d.anno + " anno · " + d.mod) : "—"}</div></div>
          <div class="row between small"><span>Argomenti ripassati</span><span>${x.fatti.length}/${x.argomenti.length}</span></div><div class="bar" style="margin:8px 0 18px"><i style="width:${p}%"></i></div>
          <div class="row"><button class="btn" data-apri-esame="${x.id}">Apri l'esame</button><button class="btn sec" data-modifica-esame="${x.id}">Modifica</button></div></section>`; }).join("")}</div>`
        : `<div class="vuoto"><h3>Nessun esame ancora</h3><p>Aggiungi il prossimo esame con data e argomenti: «Oggi» ti dirà ogni giorno da dove ripartire.</p><button class="btn" data-nuovo-esame>Aggiungi esame</button></div>`}
      <div class="callout section-gap">La checklist misura gli argomenti segnati come ripassati. Non è una stima del voto.</div>
      <div class="grid g2">${rimando("D04", "Piano guidato dalla data dell'appello")}${rimando("D08", "Gruppi di studio per esame")}</div>`;
  };
  function apriEsame(id) {
    const x = U().esami.find((e) => e.id === id), d = disp(x.slug), m = accesso("materiale", x.slug);
    modal(esc(nomeEsame(x)), `<p class="muted">Appello il ${dataIt(x.data)} · obiettivo ${x.obiettivo}/30. Tocca un argomento quando l'hai ripassato.</p>
      <div class="args">${x.argomenti.map((a, i) => `<button class="arg ${x.fatti.includes(i) ? "ok" : ""}" data-fatto="${x.id}" data-i="${i}">${esc(a)}</button>`).join("")}</div>
      ${d && areaAttiva() ? `<div class="li"><img src="img/cop/${d.cop}" alt="" style="width:72px;height:54px;object-fit:cover;border-radius:10px"><div class="grow"><div class="t">Dispensa di ${esc(d.nome)}</div><div class="small">${m === "pieno" ? "Completa: è tua" : m === "appunti" ? "Appunti completi" : "Estratto · completa con un acquisto o la dispensa gratuita"}</div></div><a class="btn sec sm" href="#/materiali?q=${encodeURIComponent(d.nome)}" data-chiudi>Materiali</a><a class="btn sm" href="#/pratica?esame=${d.slug}" data-chiudi>Quiz</a></div>` : ""}`);
  }
  function formEsame(id) {
    const x = id ? U().esami.find((e) => e.id === id) : null;
    const opz = DISP.filter((d) => !U().esami.some((e) => e.slug === d.slug && (!x || e.id !== x.id))).map((d) => `<option value="${d.slug}" ${x && x.slug === d.slug ? "selected" : ""}>${esc(d.nome)} · ${d.anno} anno</option>`).join("");
    modal(x ? "Modifica esame" : "Aggiungi un esame", `<form id="frm-esame" data-id="${x ? x.id : ""}" class="grid" style="gap:12px">
      ${areaAttiva() ? `<label class="fld">Esame<select name="slug">${opz}</select></label>` : `<label class="fld">Nome dell'esame<input name="nome" required value="${esc(x ? x.nome : "")}" placeholder="Es. Istituzioni di diritto privato"></label>`}
      <div class="grid g2" style="gap:12px"><label class="fld">Data dell'appello<input type="date" name="data" required value="${x ? x.data : addG(OGGI, 40)}"></label><label class="fld">Voto obiettivo<select name="ob">${[30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18].map((v) => `<option ${(x ? x.obiettivo : 27) === v ? "selected" : ""}>${v}</option>`).join("")}</select></label></div>
      <label class="fld">Argomenti (uno per riga; vuoto = quelli del programma, se li abbiamo)<textarea name="arg">${x ? esc(x.argomenti.join("\n")) : ""}</textarea></label>
      <div class="row" style="justify-content:flex-end">${x ? `<button type="button" class="btn sec" data-rimuovi-esame="${x.id}">Rimuovi</button>` : ""}<button class="btn">${x ? "Salva" : "Aggiungi"}</button></div></form>`);
  }

  // P03 · Materiali (biblioteca con copertine vere e stato per piano)
  const F = { q: "", anno: "", tipo: "", mie: false };
  P.materiali = (qs) => {
    if (!haContenuto(modulo("materiali"))) return inArrivo(modulo("materiali"));
    if (qs.q) F.q = qs.q;
    const g = gratisUsata();
    return `${testa("La tua biblioteca.", "Appunti, mappe e quiz per corso. Leggi gli estratti, salva le risorse, sblocca le dispense complete.", `<a class="btn sec" href="#/abbonamento">Piano e acquisti</a>`)}
      ${g ? "" : `<div class="callout or" style="margin-bottom:20px"><b>Hai una dispensa completa gratis con l'account.</b> Scegli quale: tocca «Usa la dispensa gratis» sulla copertina.</div>`}
      <div class="filtri"><input id="q" type="search" placeholder="Cerca un corso o un codice…" value="${esc(F.q)}" aria-label="Cerca">
        <select id="f-anno" aria-label="Anno"><option value="">Tutti gli anni</option>${["I", "II", "III"].map((a) => `<option value="${a}" ${F.anno === a ? "selected" : ""}>${a} anno</option>`).join("")}</select>
        ${[["", "Tutti"], ["Appunti", "Appunti"], ["Mappe", "Mappe"], ["Quiz", "Quiz"]].map(([v, l]) => `<button class="chip ${F.tipo === v ? "on" : ""}" data-ftipo="${v}">${l}</button>`).join("")}
        <button class="chip ${F.mie ? "on" : ""}" data-fmie>Le mie complete</button></div>
      <div class="grid g3" id="catalogo"></div>
      <div class="grid g2">${rimando("D06", "Lettore protetto con filigrana")}${rimando("D05", "Listino e confini del gratuito")}</div>`;
  };
  function catalogo() {
    const box = $("#catalogo"); if (!box) return;
    const q = F.q.trim().toLowerCase(), g = gratisUsata();
    const l = DISP.filter((d) => (!F.anno || d.anno === F.anno) && (!F.tipo || d.tipi.includes(F.tipo)) && (!F.mie || possiede(d.slug)) && (!q || (d.nome + " " + d.codice).toLowerCase().includes(q)));
    box.innerHTML = l.length ? l.map((d) => { const a = accesso("materiale", d.slug), sv = U().salvati.includes(d.slug);
      return `<article class="card mat"><div class="cop"><img src="img/cop/${d.cop}" alt="" loading="lazy"><span class="tag cr">${d.anno} anno · ${d.sem} sem.</span>
          <span class="stato">${a === "pieno" ? `<span class="tag ok">Completa ✓</span>` : a === "appunti" ? `<span class="tag ok">Appunti ✓</span>` : `<span class="tag">Estratto</span>`}</span></div>
        <div class="row between"><span class="small">${esc(d.area)} · ${esc(d.mod)}</span><button class="bm ${sv ? "on" : ""}" data-salva="${d.slug}" aria-label="${sv ? "Rimuovi dai salvati" : "Salva"}">${ico("salva")}</button></div>
        <h3>${esc(d.nome)}</h3><span class="small">${esc(d.tipi.join(" · "))}</span>
        <div class="acts"><button class="btn sm" data-leggi="${d.slug}">Leggi</button>${d.tipi.includes("Quiz") ? `<a class="btn sec sm" href="#/pratica?esame=${d.slug}">Quiz</a>` : ""}
          ${a === "estratto" && !g ? `<button class="btn or sm" data-gratis="${d.slug}">Usa la dispensa gratis</button>` : a === "estratto" ? `<button class="btn sec sm" data-compra="${d.slug}">Sblocca</button>` : ""}</div></article>`; }).join("")
      : `<div class="vuoto" style="grid-column:1/-1"><p>Nessuna dispensa trovata. Manca il tuo esame? Scrivici nel gruppo.</p></div>`;
  }
  function lettore(slug, tab = "Appunti") {
    const d = disp(slug), a = accesso("materiale", slug);
    const pagina = (n) => `<div class="card" style="background:#fbfaf7"><span class="small">${esc(d.nome)} · ${esc(tab)} · pagina ${n}</span><h3 style="margin:8px 0">Capitolo ${n} · estratto di esempio</h3><p class="muted">Testo dimostrativo: nella app vera qui c'è il PDF con filigrana «${esc(U().email)}».</p><div class="bar" style="margin:10px 0"><i style="width:${30 + n * 10}%"></i></div><p class="muted">Definizioni, esempi svolti e schemi riassuntivi del capitolo.</p></div>`;
    modal("Lettore · " + esc(d.nome), `<div class="seg">${d.tipi.map((t) => `<button class="${t === tab ? "on" : ""}" data-leggi="${slug}" data-tab="${t}">${t}</button>`).join("")}</div>
      ${pagina(1)}
      ${a === "pieno" || (a === "appunti" && tab === "Appunti") ? pagina(2) + `<p class="small">Hai la versione completa: ${a === "appunti" ? "appunti" : "appunti, mappe e quiz"}.</p>`
        : `<div class="locked">${pagina(2)}<div class="velo">${lucchetto("Solo estratto")}<b>Il resto è nella dispensa completa.</b><div class="row" style="justify-content:center">${gratisUsata() ? "" : `<button class="btn or sm" data-gratis="${slug}">Usa la dispensa gratis</button>`}<button class="btn sm" data-compra="${slug}">Vedi le offerte</button></div></div></div>`}
      <p class="small">Demo: estratti illustrativi.</p>${rimando("D06", "Lettore protetto")}`, true);
  }

  // P04 · Esercitazioni (Studio) e Allenamento (Test Prep): stesso motore quiz
  let Q = null, modoQuiz = "rapido";
  function motoreQuiz(esame, titolo, sotto) {
    const disponibili = C.domande.filter((d) => d.esame === esame);
    const lim = accesso("quiz", esame), resto = lim === "pieno" ? Infinity : Math.max(0, LIMITE_QUIZ - S.quizOggi.n);
    if (!Q || Q.esame !== esame || Q.modo !== modoQuiz) Q = { esame, modo: modoQuiz, i: 0, scelta: null, giuste: 0, fatte: 0, pool: modoQuiz === "ripasso" ? S.errori.filter((e) => e.esame === esame).map((e) => C.domande[e.k]) : disponibili };
    const modi = [["rapido", "Quiz rapido", "quiz"], ["ripasso", "Ripasso errori", "ripasso"], ["simulazione", "Simulazione a tempo", "simulazione"]];
    const testaModi = `<div class="seg" style="margin-bottom:18px">${modi.map(([m, l, k]) => `<button class="${modoQuiz === m ? "on" : ""}" data-modo="${m}">${l}${k !== "quiz" && accesso(k) !== "pieno" ? " · Plus" : ""}</button>`).join("")}</div>`;
    const k = modi.find((m) => m[0] === modoQuiz)[2];
    let corpo;
    if (k !== "quiz" && accesso(k) !== "pieno") corpo = `<section class="card tratt" style="text-align:center"><span class="lock">${ico("lucchetto")} Con Plus · ipotesi</span><h2 style="margin:12px 0 6px">${modoQuiz === "ripasso" ? "Le domande sbagliate tornano finché non le azzecchi due volte di fila." : "Domande a tempo con il punteggio in trentesimi."}</h2><p class="muted">Fa parte di UniLink Plus (prezzo da decidere).</p><a class="btn or" href="#/abbonamento?tab=offerte">Scopri Plus</a></section>`;
    else if (!Q.pool.length) corpo = `<div class="vuoto"><h3>${modoQuiz === "ripasso" ? "Nessun errore da ripassare" : "Domande in arrivo"}</h3><p>${modoQuiz === "ripasso" ? "Ottimo: qui tornano le domande che sbagli." : "Per questo esame la banca domande è da costruire (D03)."}</p></div>`;
    else if (resto <= 0 && Q.scelta === null) corpo = `<section class="card tratt" style="text-align:center"><span class="lock">${ico("lucchetto")} Limite di oggi raggiunto</span><h2 style="margin:12px 0 6px">Hai fatto ${LIMITE_QUIZ} domande oggi.</h2><p class="muted">Con il piano gratuito: ${LIMITE_QUIZ} al giorno. Illimitate con la dispensa completa di questo esame o con Plus.</p><div class="row" style="justify-content:center"><a class="btn or" href="#/abbonamento?tab=offerte">Vedi le offerte</a></div></section>`;
    else if (Q.i >= Q.pool.length) corpo = `<section class="card navy hero"><span class="tag">Fatto</span><h2>${Q.giuste} giuste su ${Q.fatte}</h2><p>Gli errori finiscono nel registro: li ritrovi in «Registro errori»${accesso("ripasso") === "pieno" ? " e nel ripasso" : ""}.</p><div class="row"><button class="btn light" data-ricomincia>Ricomincia</button></div></section>`;
    else { const q = Q.pool[Q.i], sc = Q.scelta;
      corpo = `<section class="card quiz"><div class="row between small"><span>Domanda ${Q.i + 1} di ${Q.pool.length}${modoQuiz === "simulazione" ? " · 1:30 a domanda" : ""}</span><span>${lim === "pieno" ? "Domande illimitate" : `Oggi: ${S.quizOggi.n}/${LIMITE_QUIZ}`}</span></div>
        <h2 style="font-size:1.3rem">${esc(q.d)}</h2>
        ${q.o.map((o, i) => `<button class="opt ${sc === null ? "" : i === q.g ? "giusta" : i === sc ? "sbagliata" : ""}" data-risposta="${i}" ${sc === null ? "" : "disabled"}>${esc(o)}</button>`).join("")}
        ${sc === null ? "" : `<div class="callout">${sc === q.g ? "Giusta." : "Non è questa."} ${esc(q.s)}</div><button class="btn" data-avanti>Avanti</button>`}</section>`; }
    return `${testa(titolo, sotto)}${testaModi}${corpo}`;
  }
  P.pratica = (qs) => {
    if (!haContenuto(modulo("pratica"))) return inArrivo(modulo("pratica"));
    const esami = [...new Set(C.domande.map((d) => d.esame).filter((e) => e !== "tolc"))];
    const es = qs.esame && esami.includes(qs.esame) ? qs.esame : (Q && esami.includes(Q.esame) ? Q.esame : esami[0]);
    return `<div class="filtri">${esami.map((e) => `<a class="chip ${e === es ? "on" : ""}" href="#/pratica?esame=${e}">${esc((disp(e) || {}).nome || e)}</a>`).join("")}${qs.esame && !esami.includes(qs.esame) ? `<span class="small">Per ${esc((disp(qs.esame) || {}).nome || qs.esame)} la banca domande è da costruire (D03).</span>` : ""}</div>`
      + motoreQuiz(es, "Esercitazioni.", `Domande di esempio scritte per la demo · ${esc((disp(es) || {}).nome || "")}. La banca vera è da decidere (D03).`);
  };

  // P05 · Libretto e obiettivi (+ calcolatore voto di laurea, regole UniLinkVotoLaurea.v5)
  P.libretto = () => {
    const l = U().libretto, cfu = l.reduce((s, x) => s + x.cfu, 0), pond = cfu ? l.reduce((s, x) => s + Math.min(30, x.voto) * x.cfu, 0) / cfu : 0;
    if (pond) U().media = Math.round(pond * 100) / 100;
    const st = S.calc || (S.calc = { lodi: l.filter((x) => x.voto === 31).length || U().lodi || 0, tesi: 2, corso: 2 });
    return `${testa("Libretto e obiettivi.", "I voti che inserisci, la tua media e una stima del voto di laurea (regole della Scuola di Economia: decide sempre la commissione).", `<button class="btn" data-nuovo-voto>Aggiungi un voto</button>`)}
      <div class="grid g4 metrics" style="margin-bottom:20px">
        <div class="card metric"><span class="mn">Media ponderata</span><span class="num">${pond ? num(pond, 2) : "—"}<small>/30</small></span><span class="small">dai voti inseriti</span></div>
        <div class="card metric"><span class="mn">CFU</span><span class="num">${cfu}<small>/180</small></span><div class="bar"><i style="width:${Math.min(100, (cfu / 180) * 100)}%"></i></div></div>
        <div class="card metric"><span class="mn">Esami superati</span><span class="num">${l.length}</span><span class="small">nel libretto</span></div>
        <div class="card metric"><span class="mn">Obiettivo</span><span style="margin-top:8px">${esc(U().obiettivo || "—")}</span></div></div>
      <div class="grid g2">
        <section class="card"><div class="ch"><h2>Il tuo libretto</h2></div>${l.length ? `<div class="tabwrap"><table class="tab"><thead><tr><th>Esame</th><th>CFU</th><th>Voto</th><th></th></tr></thead><tbody>${l.map((x, i) => `<tr><td>${esc((disp(x.slug) || {}).nome || x.slug)}</td><td>${x.cfu}</td><td>${x.voto === 31 ? "30L" : x.voto}</td><td><button class="tbtn" data-del-voto="${i}">Togli</button></td></tr>`).join("")}</tbody></table></div><p class="small" style="margin-top:8px">CFU di esempio (9): correggili quando aggiungi i voti.</p>` : `<div class="vuoto"><p>Nessun voto ancora: aggiungi il primo esame superato.</p></div>`}</section>
        <section class="card"><div class="ch"><h2>Voto di laurea</h2>${areaAttiva() && U().area === "economia" ? "" : `<span class="tag or">Regole di Economia</span>`}</div>
          <div class="calc" id="calc"><div class="grid" style="gap:16px">
            <label>Media: <b id="c-media" style="font-weight:500"></b><input type="range" min="18" max="30" step="0.1" value="${U().media || 27}" data-c="media"></label>
            <label>Lodi: <b id="c-lodi" style="font-weight:500">${st.lodi}</b><input type="range" min="0" max="10" step="1" value="${st.lodi}" data-c="lodi"></label>
            <div class="fld">Punti tesi<div class="seg">${[0, 1, 2, 3].map((v) => `<button type="button" class="${st.tesi === v ? "on" : ""}" data-c="tesi" data-v="${v}">+${v}</button>`).join("")}</div></div>
            <div class="fld">In corso<div class="seg">${[["Sì · +2", 2], ["No", 0]].map((o) => `<button type="button" class="${st.corso === o[1] ? "on" : ""}" data-c="corso" data-v="${o[1]}">${o[0]}</button>`).join("")}</div></div></div>
            <div class="ris"><span class="small" style="color:#d0d3df">Presentazione <b id="c-pres" style="font-weight:500"></b></span><span class="v" id="c-fin"></span><span id="c-nota" class="small" style="color:#d0d3df"></span></div></div></section></div>
      ${rimando("D11", "Guida tesi")}`;
  };
  function aggiornaCalc() {
    const el = $("#calc"); if (!el) return; const st = S.calc; st.media = +$('[data-c="media"]', el).value;
    const pres = (st.media * 11) / 3 + st.lodi * 0.333, fin = Math.min(110, pres + st.tesi + st.corso), lode = Math.round(fin) >= 110 && pres >= 104.5 && st.tesi === 3;
    $("#c-media").textContent = num(st.media); $("#c-lodi").textContent = st.lodi; $("#c-pres").textContent = num(pres);
    $("#c-fin").textContent = Math.round(fin) + (lode ? " e lode" : ""); $("#c-nota").textContent = lode ? "Hai i requisiti per la lode." : "Stima indicativa: decide la commissione.";
  }

  /* ---------------- 8 · Test Prep ---------------- */
  P.test = () => {
    const a = area(), u = U();
    if (!a.test) return `${testa("Il mio test.", `Per ${esc(a.nome)} non c'è un test da preparare con UniLink. Verifica sul bando del tuo ateneo se è previsto.`)}<a class="btn" href="#/orientamento">Vai all'orientamento</a>${rimando("D12")}`;
    if (!areaAttiva()) return inArrivo(modulo("test"));
    const d = C.domande.filter((x) => x.esame === "tolc").length;
    return `${testa("Il mio test.", esc(a.test.nota), `<a class="btn" href="#/allenamento">Allenati</a>`)}
      <div class="grid gx"><section class="card navy hero"><span class="tag">${esc(a.test.nome)}</span><h2>${u.dataTest ? "Mancano " + giorni(u.dataTest) + " giorni" : "Inserisci la data del test"}</h2><p>${u.dataTest ? "Il " + dataIt(u.dataTest) + " · data inserita da te" : ""}</p>
        <form id="frm-datatest" class="row"><input type="date" name="d" value="${esc(u.dataTest || "")}" style="width:auto;background:#fff"><button class="btn light">Salva data</button></form></section>
        <div class="grid" style="align-content:start"><div class="card metric"><span class="mn">Domande di allenamento (demo)</span><span class="num">${d}</span></div><div class="card metric"><span class="mn">Errori nel registro</span><span class="num">${S.errori.length}</span></div></div></div>
      <section class="card section-gap"><div class="ch"><h2>Come prepararti</h2></div>${[["Fai il diagnostico", "20 domande per capire da dove partire (in demo: 4)."], ["Allenati ogni giorno", LIMITE_QUIZ + " domande al giorno gratis, per materia."], ["Ripassa gli errori", "Il registro raccoglie le domande sbagliate."], ["Leggi il bando", "Date e regole solo dalla fonte ufficiale."]].map((x, i) => `<div class="li"><span class="ini">${i + 1}</span><div class="grow"><div class="t">${x[0]}</div><div class="small">${x[1]}</div></div></div>`).join("")}
        <a class="tbtn" href="${a.test.fonte}" target="_blank" rel="noopener">Fonte ufficiale →</a></section>${rimando("D12")}`;
  };
  P.allenamento = () => haContenuto(modulo("allenamento")) && area().test ? motoreQuiz("tolc", "Allenamento.", "Logica e matematica, domande di esempio scritte per la demo.") : inArrivo(modulo("allenamento"));
  P.errori = () => {
    const vis = accesso("ripasso") === "pieno" ? S.errori : S.errori.slice(-3);
    return `${testa("Registro errori.", "Le domande che hai sbagliato, con la spiegazione. Con Plus tornano nel ripasso finché non le azzecchi due volte di fila.")}
      ${S.errori.length ? `<section class="card">${vis.slice().reverse().map((e) => { const q = C.domande[e.k]; return `<div class="li" style="align-items:flex-start"><span class="ini">${ico("quiz")}</span><div class="grow"><div class="t">${esc(q.d)}</div><div class="small">Hai risposto «${esc(q.o[e.r])}» · giusta: «${esc(q.o[q.g])}»</div><div class="small">${esc(q.s)}</div></div></div>`; }).join("")}</section>
        ${S.errori.length > vis.length ? `<div class="card tratt section-gap" style="text-align:center">${lucchetto("Con Plus · ipotesi")}<p style="margin-top:8px">Altri ${S.errori.length - vis.length} errori nel registro completo.</p></div>` : ""}`
        : `<div class="vuoto"><h3>Nessun errore ancora</h3><p>Fai un allenamento: le domande sbagliate finiscono qui.</p><a class="btn" href="#/${U().percorso === "test" ? "allenamento" : "pratica"}">Allenati</a></div>`}`;
  };
  P.orientamento = () => `${testa("Orientamento.", "Scegli il corso con più elementi. Le informazioni ufficiali vengono sempre dalla fonte.")}
    <div class="grid g2">${[["Come leggere un piano di studi", "Guida del sito", SITO + "/guide"], ["Parla con uno studente", "Il gruppo WhatsApp di UniLink", WA], ["Il test d'ingresso", area().test ? area().test.nome + " · fonte ufficiale" : "Verifica sul bando", area().test ? area().test.fonte : SITO + "/guide"], ["Master e magistrali", "Per capire dove porta il corso", SITO + "/tools/master-magistrale"]].map((x) => `<a class="card" href="${x[2]}" target="_blank" rel="noopener"><span class="eyebrow">${esc(x[1])}</span><h3>${esc(x[0])}</h3></a>`).join("")}</div>
    <section class="card section-gap"><div class="ch"><h2>Le aree di UniLink</h2></div>${C.aree.filter((a) => a.stato !== "proposta").map((a) => `<div class="li"><span class="ini" style="background:${a.tinta}">${esc(a.nome[0])}</span><div class="grow"><div class="t">${esc(a.nome)}</div><div class="small">${esc(a.corsi.join(" · "))}</div></div><span class="tag ${a.stato === "attiva" ? "ok" : "or"}">${a.stato === "attiva" ? "Attiva" : "In arrivo"}</span></div>`).join("")}</section>`;

  /* ---------------- 9 · Futuro ---------------- */
  const checklist = (chiave, voci) => `<section class="card"><div class="ch"><h2>Checklist</h2><span class="small">${voci.filter((_, i) => U().check[chiave + i]).length}/${voci.length}</span></div>${voci.map((v, i) => `<label class="li chk"><input type="checkbox" data-check="${chiave + i}" ${U().check[chiave + i] ? "checked" : ""}><span class="grow">${esc(v[0])}<br><span class="small">${esc(v[1])}</span></span></label>`).join("")}</section>`;
  P.magistrali = () => `${testa("Magistrali e MSc.", "La tua shortlist e i requisiti da preparare. Programmi e scadenze solo dalle pagine ufficiali: qui non ne inventiamo.", `<a class="btn sec" href="${SITO}/tools/master-magistrale" target="_blank" rel="noopener">Esplora sul sito</a>`)}
    <div class="grid g2">${checklist("mag", [["Media aggiornata nel libretto", "Molti programmi chiedono una soglia"], ["Certificazione d'inglese", "IELTS o TOEFL: verifica il punteggio richiesto"], ["GMAT o GRE", "Solo se richiesto dal programma"], ["CV in inglese", "Una pagina, risultati concreti"], ["Lettere di referenza", "Chiedile con un mese di anticipo"]])}
      <section class="card"><div class="ch"><h2>La tua shortlist</h2></div>${(U().shortlist || []).map((s, i) => `<div class="li"><span class="ini">${i + 1}</span><div class="grow">${esc(s)}</div><button class="tbtn" data-del-short="${i}">Togli</button></div>`).join("") || `<p class="muted">Ancora vuota.</p>`}
        <form id="frm-short" class="row" style="margin-top:12px"><input name="s" required placeholder="Es. MSc Finance · ateneo" style="flex:1"><button class="btn sm">Aggiungi</button></form></section></div>`;
  P.erasmus = () => haContenuto(modulo("erasmus")) ? `${testa("Erasmus.", "Arriva al bando preparato. Punteggi e mete con gli strumenti del sito; regole solo dal bando ufficiale.")}
    <div class="grid g2">${checklist("era", [["Leggi il bando del tuo corso", "Scadenze e requisiti"], ["Calcola il tuo punteggio", "Con il calcolatore del sito"], ["Scegli 3 mete", "Lingua, esami riconoscibili, costi"], ["Prepara il Learning Agreement", "Con il tuo referente"], ["Certificazione linguistica", "Se richiesta dalla meta"]])}
      <section class="card">${C.strumenti.filter((t) => ["erasmus", "mete"].includes(t.id)).map((t) => `<a class="li" href="${SITO + t.url}" target="_blank" rel="noopener"><span class="ini">${ico("globo")}</span><div class="grow"><div class="t">${esc(t.nome)}</div><div class="small">${esc(t.desc)} · sul sito</div></div>${ico("link")}</a>`).join("")}</section></div>` : inArrivo(modulo("erasmus"));
  P.career = () => `${testa("Carriere e CV.", "Un CV in ordine e i primi passi verso stage e lavoro.")}
    <div class="grid g2">${checklist("cv", [["CV di una pagina", "Formazione, esperienze, competenze"], ["Profilo LinkedIn aggiornato", "Stessa versione del CV"], ["Un'esperienza o un progetto", "Associazioni, stage, progetti"], ["Inglese certificato", "Spesso richiesto"]])}
      <section class="card ${accesso("cv_confronto") === "pieno" ? "" : "tratt"}"><div class="ch"><h2>Il tuo CV vs un profilo tipo</h2>${accesso("cv_confronto") === "pieno" ? `<span class="tag nv">Plus</span>` : lucchetto("Con Plus · ipotesi")}</div>
        ${accesso("cv_confronto") === "pieno" ? [["Percorso accademico", 77], ["Lingue e test", 50], ["Esperienze", 40]].map((p) => `<div style="margin:10px 0"><div class="row between small"><span>${p[0]}</span><span>${p[1]}%</span></div><div class="bar"><i style="width:${p[1]}%"></i></div></div>`).join("") + `<p class="small">Profilo tipo «Finance» di esempio, scritto dal team.</p>` : `<p class="muted">Confronta il tuo CV con il profilo tipo della carriera che vuoi e ricevi le prossime 3 azioni.</p><a class="btn or" href="#/abbonamento?tab=offerte">Scopri Plus</a>`}</section></div>
    ${rimando("D09")}`;

  /* ---------------- 10 · account ---------------- */
  P.salvati = () => { const l = U().salvati.map(disp).filter(Boolean);
    return `${testa("Salvati.", "Le dispense che vuoi ritrovare subito.", "", "Il tuo account")}${l.length ? `<div class="grid g3">${l.map((d) => `<article class="card mat"><div class="cop"><img src="img/cop/${d.cop}" alt=""></div><h3>${esc(d.nome)}</h3><div class="acts"><button class="btn sm" data-leggi="${d.slug}">Leggi</button><button class="btn sec sm" data-salva="${d.slug}">Togli</button></div></article>`).join("")}</div>` : `<div class="vuoto"><p>Tocca il segnalibro in «Materiali» per salvare una dispensa.</p></div>`}`; };

  // P06 · Piano e acquisti: il tuo piano · offerte (layout C «Pacchetti e Plus») · ordini
  P.abbonamento = (qs) => {
    const tab = qs.tab || "piano", u = U(), g = gratisUsata();
    const PROVE = [["Estratti di tutte le dispense", "pieno"], ["Dispense complete", null], ["Quiz rapido", "quiz"], ["Ripasso errori", "ripasso"], ["Simulazione a tempo", "simulazione"], ["Piano guidato", "piano_guidato"], ["Confronto CV", "cv_confronto"]];
    let corpo = "";
    if (tab === "piano") corpo = `<div class="grid g2"><section class="card navy hero" style="min-height:0"><span class="tag">Il tuo piano</span><h2>${esc(pianoNome())}</h2><p>${plus() ? "Tutti gli strumenti di studio sono sbloccati." : "Puoi aggiungere una dispensa, un pacchetto o Plus quando ti serve."}</p><div class="row"><a class="btn light" href="#/abbonamento?tab=offerte">Vedi le offerte</a></div></section>
        <section class="card"><div class="ch"><h2>Sblocchi</h2></div>
          <div class="li"><div class="grow">Dispensa gratuita</div><b style="font-weight:500">${g ? "usata · " + esc((disp(g.esame) || {}).nome || "") : `<a class="tbtn" href="#/materiali">da scegliere</a>`}</b></div>
          <div class="li"><div class="grow">Dispense complete</div><b style="font-weight:500;text-align:right">${DISP.filter((d) => possiede(d.slug)).map((d) => esc(d.nome)).join(", ") || "nessuna"}</b></div>
          <div class="li"><div class="grow">Plus</div><b style="font-weight:500">${plus() ? "attivo" : "non attivo"}</b></div></section></div>
      <section class="card section-gap"><div class="ch"><h2>Cosa puoi fare adesso</h2><span class="small">regole: config.js → UL_PIANI · app.js → accesso()</span></div>
        <div class="tabwrap"><table class="tab mx"><thead><tr><th>Funzione</th><th>Per te</th></tr></thead><tbody>${PROVE.map(([n, k]) => { const v = k === null ? (DISP.some((d) => possiede(d.slug)) ? "par" : "no") : k === "pieno" ? "si" : accesso(k) === "pieno" ? "si" : accesso(k) === "limitato" ? "par" : "no";
          return `<tr><td>${n}</td><td class="${v}">${v === "si" ? "Sì" : v === "par" ? (k === "quiz" ? `${LIMITE_QUIZ} al giorno (illimitati per le dispense complete)` : "Solo quelle sbloccate") : k === null ? "Con un acquisto o la dispensa gratuita" : "Con Plus"}</td></tr>`; }).join("")}</tbody></table></div></section>`;
    if (tab === "offerte") {
      const o = S.off || (S.off = {}); o.anno = o.anno || (["I", "II", "III"].includes(u.anno) ? u.anno : "I"); o.sem = o.sem || "I"; o.esame = o.esame || "microeconomia";
      const lista = DISP.filter((d) => d.anno === o.anno && d.sem === o.sem), gia = lista.filter((d) => possiede(d.slug)).length;
      corpo = `<div class="callout or" style="margin-bottom:6px"><b>Prezzi e catalogo di prova.</b> Sono le ipotesi dell'HQ (5/10): nessuna offerta è in vendita e i pagamenti sono simulati.</div>${rimando("D05", "Listino da decidere")}
      <div class="grid g2 section-gap"><section class="card"><div class="ch"><h2>Pacchetto per il tuo semestre</h2></div>
          <div class="grid g2" style="gap:12px"><label class="fld">Anno<select id="o-anno">${["I", "II", "III"].map((a) => `<option ${o.anno === a ? "selected" : ""}>${a}</option>`).join("")}</select></label><label class="fld">Semestre<select id="o-sem">${["I", "II"].map((a) => `<option ${o.sem === a ? "selected" : ""}>${a}</option>`).join("")}</select></label></div>
          <p class="small" style="margin-top:12px">${lista.map((d) => (possiede(d.slug) ? "✓ " : "") + esc(d.nome)).join(" · ")}</p>${gia ? `<p class="small">Hai già ${gia} di questi esami completi: nella app vera verrebbero scalati dal prezzo.</p>` : ""}
          <div class="row between" style="margin-top:12px"><b class="small">${esc(C.piani.find((p) => p.id === "semestre").prezzo)}</b><button class="btn or" data-acquista="semestre">Acquista (simulato)</button></div></section>
        <section class="card navy"><span class="eyebrow">Abbonamento</span><h2 style="color:#fff;margin-bottom:8px">UniLink Plus</h2><p>${C.piani.find((p) => p.id === "plus").include.map(esc).join(" · ")}.</p><p><b>${esc(C.piani.find((p) => p.id === "plus").prezzo)}</b></p>${plus() ? `<span class="tag">Già attivo</span>` : `<button class="btn or" data-acquista="plus">Attiva Plus (simulato)</button>`}</section></div>
      <div class="grid g4 section-gap">${C.piani.map((p) => `<div class="piano ${p.evidenza ? "ev" : ""} ${(p.id === "gratuito" && pianoNome() === "Gratuito") || (p.id === "plus" && plus()) ? "attivo" : ""}"><span class="tag ${p.tipo === "abbonamento" ? "nv" : p.tipo === "base" ? "ok" : "or"}" style="align-self:flex-start">${esc(p.tipo)}</span><h3>${esc(p.nome)}</h3><span class="p">${esc(p.prezzo)}</span><ul>${p.include.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
        <div class="acts">${p.id === "gratuito" ? `<span class="small">Incluso con l'account</span>` : ["appunti", "dispensa"].includes(p.id) ? `<select data-scegli-esame="${p.id}" aria-label="Esame">${DISP.map((d) => `<option value="${d.slug}" ${o.esame === d.slug ? "selected" : ""}>${esc(d.nome)}</option>`).join("")}</select><button class="btn sec sm" style="margin-top:8px" data-acquista="${p.id}">Acquista (simulato)</button>` : p.id === "semestre" ? `<span class="small">Scegli anno e semestre qui sopra</span>` : ""}</div></div>`).join("")}</div>`;
    }
    if (tab === "ordini") corpo = `<section class="card"><div class="ch"><h2>I tuoi ordini</h2></div>${u.acquisti.length ? `<div class="tabwrap"><table class="tab"><thead><tr><th>Data</th><th>Prodotto</th><th>Contenuto</th><th>Importo</th></tr></thead><tbody>${u.acquisti.map((a) => `<tr><td>${dataIt(a.data, { day: "2-digit", month: "2-digit", year: "numeric" })}</td><td>${esc((C.piani.find((p) => p.id === a.tipo) || { nome: a.tipo === "una_gratis" ? "Dispensa gratuita" : a.tipo }).nome)}</td><td>${esc(a.esame ? (disp(a.esame) || {}).nome : a.anno ? a.anno + " anno · " + a.sem + " semestre" : "Strumenti Plus")}</td><td>${a.tipo === "una_gratis" ? "0 €" : "ipotesi"}</td></tr>`).join("")}</tbody></table></div>` : `<p class="muted">Nessun ordine.</p>`}<p class="small" style="margin-top:10px">Demo: pagamenti simulati, nessun addebito. Nella app vera: Stripe Checkout e ricevuta via email.</p></section>`;
    return `${testa("Piano e acquisti.", "Il materiale comprato resta tuo. Gli strumenti di Plus valgono finché il piano è attivo.", "", "Il tuo account")}
      <div class="seg" style="margin-bottom:20px">${[["piano", "Il tuo piano"], ["offerte", "Offerte"], ["ordini", "Ordini"]].map(([k, l]) => `<button class="${tab === k ? "on" : ""}" data-tab-abb="${k}">${l}</button>`).join("")}</div>${corpo}`;
  };
  function acquista(tipo, slug) {
    const u = U();
    if (tipo === "plus") { u.piano = "plus"; u.acquisti.push({ tipo: "plus", data: OGGI, importo: "ipotesi" }); }
    else if (tipo === "semestre") u.acquisti.push({ tipo: "semestre", anno: S.off.anno, sem: S.off.sem, data: OGGI, importo: "ipotesi" });
    else u.acquisti.push({ tipo, esame: slug || S.off.esame, data: OGGI, importo: "ipotesi" });
    salva(); toast("Acquisto simulato: sbloccato. Nessun addebito."); ridisegna();
  }

  // P07 · Profilo (con colore del cerchio delle iniziali)
  P.profilo = () => { const u = U();
    return `${testa("Il tuo profilo.", "L'area filtra i materiali. Il percorso cambia le priorità. L'account resta lo stesso.", "", "Il tuo account")}
    <div class="grid g2"><section class="card"><form id="frm-profilo" class="grid" style="gap:14px"><h2>Le tue informazioni</h2>
        <div class="grid g2" style="gap:12px"><label class="fld">Nome<input name="nome" value="${esc(u.nome)}" required></label><label class="fld">Cognome<input name="cognome" value="${esc(u.cognome)}"></label></div>
        <label class="fld">Email<input value="${esc(u.email)}" disabled></label>
        <div class="grid g2" style="gap:12px"><label class="fld">Area<select name="area">${C.aree.map((a) => `<option value="${a.slug}" ${a.slug === u.area ? "selected" : ""}>${esc(a.nome)}${a.stato === "attiva" ? "" : a.stato === "in_arrivo" ? " (in arrivo)" : " (proposta)"}</option>`).join("")}</select></label>
          <label class="fld">Ateneo<select name="ateneo">${area().atenei.map((a) => `<option value="${a.slug}" ${a.slug === u.ateneo ? "selected" : ""}>${esc(a.nome)}</option>`).join("")}<option value="altro" ${u.ateneo === "altro" ? "selected" : ""}>Altro (presto)</option></select></label></div>
        <div class="grid g2" style="gap:12px"><label class="fld">Corso<input name="corso" value="${esc(u.corso)}"></label><label class="fld">Anno<select name="anno">${["Prima dell'università", "I", "II", "III", "IV", "V", "Fuori corso"].map((a) => `<option ${a === u.anno ? "selected" : ""}>${a}</option>`).join("")}</select></label></div>
        <label class="fld">Obiettivo<textarea name="obiettivo">${esc(u.obiettivo || "")}</textarea></label>
        <div class="grid g2" style="gap:12px"><label class="fld">Minuti abituali di studio<input type="number" name="minuti" value="${u.minuti}"></label><label class="fld">Percorso principale<select name="percorso">${C.percorsi.map((p) => `<option value="${p.id}" ${p.id === u.percorso ? "selected" : ""}>${p.nome}</option>`).join("")}</select></label></div>
        <button class="btn full">Salva il profilo</button></form></section>
      <div class="grid" style="align-content:start">
        <section class="card"><div class="ch"><h2>Il tuo cerchio</h2><span class="av lg" style="background:${u.colore}">${esc(ini(u))}</span></div><p class="muted">Le tue iniziali e il tuo colore, in alto a destra e nella sidebar.</p><div class="row">${COLORI.map((c) => `<button class="av" style="background:${c};outline:${c === u.colore ? "3px solid #172554" : "0"};outline-offset:2px" data-colore="${c}" aria-label="Colore ${c}"></button>`).join("")}</div></section>
        <section class="card crema"><span class="eyebrow">Un'identità, più percorsi</span><h2 style="margin-bottom:8px">Area, percorso e piano.</h2><p class="muted">Tre scelte indipendenti: cosa studi, in che momento sei, cosa hai sbloccato.</p><button class="btn sec" data-come>Come funziona l'area</button></section>
        <section class="card"><div class="ch"><h2>Account</h2><span class="tag ${plus() ? "nv" : "cr"}">${esc(pianoNome())}</span></div><div class="row"><a class="btn sec" href="#/abbonamento">Piano e acquisti</a><button class="btn sec" data-rifai>Rifai il primo accesso</button><button class="btn sec" data-esci>Esci</button><button class="btn sec" data-reset>Ripristina la demo</button></div></section></div></div>`; };
  function comeFunziona() {
    modal("Come funziona l'area", `<p class="muted">Un account, tre scelte indipendenti. Il menu nasce da area × percorso; il piano mette solo lucchetti e sblocchi.</p>
      <div class="grid g3" style="gap:12px">
        <div class="card crema"><span class="eyebrow">1 · Area</span><h3>${esc(area().nome)}</h3><p class="small">Cosa studi. Decide catalogo, corsi, strumenti, colore. Si cambia dal profilo.</p></div>
        <div class="card crema"><span class="eyebrow">2 · Percorso</span><h3>${esc(percorso().nome)}</h3><p class="small">In che momento sei: prima, durante, dopo. Si cambia dalla sidebar.</p></div>
        <div class="card crema"><span class="eyebrow">3 · Piano</span><h3>${esc(pianoNome())}</h3><p class="small">Cosa è sbloccato. Si cambia da «Piano e acquisti».</p></div></div>
      <div class="callout">Esempi: <b>Medicina × Test Prep</b> = semestre filtro · <b>Economia × Futuro</b> = magistrali ed Erasmus · <b>Giurisprudenza × Studio</b> = esami con materiali «in arrivo».</div>
      <div class="row"><a class="btn" href="#/configurazione" data-chiudi>Vedi la configurazione</a><button class="btn sec" data-chiudi>Chiudi</button></div>`);
  }

  /* ---------------- 11 · Da decidere e Configurazione ---------------- */
  const punti = (n) => `<span class="punti">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
  const vediBtn = (x) => !x.vedi ? "" : x.vedi.startsWith("persona:") ? `<button class="btn sec sm" data-persona="${x.vedi.slice(8)}">Prova nella app come ${esc((C.persone.find((p) => p.id === x.vedi.slice(8)) || {}).nome || "")}</button>` : `<a class="btn sec sm" href="${x.vedi}">Vedi nella app</a>`;
  P.decidere = (qs, r) => {
    if (r[1]) return dettaglio(C.dec.find((x) => x.id === r[1]));
    const gruppi = [...new Set(C.dec.map((x) => x.gruppo))];
    return `${testa("Da decidere.", "Le sezioni del «Tuo spazio» sono quelle decise. Qui ogni card è una proposta con la sua architettura demo: si apre, si discute in call, si decide.", "", "Sezione di lavoro del team")}
      <div class="dec-banner">${ico("cantiere")}<span><b>Regola.</b> Una card esce da qui solo quando è decisa. Ogni card ha un codice (D01, D02…) che non cambia: usalo per chiedere modifiche. «Vedi nella app» = la proposta è già visibile come ipotesi.</span></div>
      ${gruppi.map((g) => { const its = C.dec.filter((x) => x.gruppo === g); return `<div class="dgr"><h2>${esc(g)}</h2><span class="small">${its.length}</span></div><div class="grid g3">${its.map((x) => `<a class="dcard" href="#/decidere/${x.id}"><span class="id">${x.id} · ${esc(x.origine.split("·")[0].trim())}</span><h3>${esc(x.titolo)}</h3><p>${esc(x.problema)}</p><div class="pd"><span class="tag or">${esc(x.stato)}</span><span>Impatto ${punti(x.impatto)}</span></div></a>`).join("")}</div>`; }).join("")}`;
  };
  const BLOCCHI = {
    hero: (b) => `<div><span class="eyebrow">${esc(b.eyebrow || "")}</span><h2>${esc(b.titolo.replace(/\*/g, ""))}</h2>${b.testo ? `<p class="muted" style="margin-top:6px">${esc(b.testo)}</p>` : ""}</div>`,
    navy: (b) => `<div class="card navy hero" style="min-height:0"><span class="tag">${esc(b.badge)}</span><h2>${esc(b.titolo)}</h2><p>${esc(b.testo)}</p><div class="row">${(b.cta || []).map((c, i) => `<span class="btn ${i ? "ghost" : "light"}">${esc(c)}</span>`).join("")}</div></div>`,
    stats: (b) => `<div class="grid g3">${b.items.map((s) => `<div class="card metric"><span class="num">${esc(s[0])}</span><span class="small">${esc(s[1])}</span></div>`).join("")}</div>`,
    cards: (b) => `<div class="grid g3">${b.items.map((c) => `<div class="card"><h3>${esc(c[0])}</h3><p class="small">${esc(c[1])}</p></div>`).join("")}</div>`,
    list: (b) => `<div class="card">${b.titolo ? `<h3 style="margin-bottom:6px">${esc(b.titolo)}</h3>` : ""}${b.items.map((r) => `<div class="li"><div class="grow"><div class="t">${esc(r[0])}</div><div class="small">${esc(r[1])}</div></div><span class="tag">${esc(r[2])}</span></div>`).join("")}</div>`,
    steps: (b) => `<div class="card">${b.titolo ? `<h3>${esc(b.titolo)}</h3>` : ""}${b.items.map((r) => `<div class="li"><span class="ini">${esc(r[0])}</span><div class="grow">${esc(r[1])}</div></div>`).join("")}</div>`,
    form: (b) => `<div class="card grid" style="gap:12px"><h3>${esc(b.titolo)}</h3>${b.campi.map((c) => `<label class="fld">${esc(c)}<input disabled placeholder="…"></label>`).join("")}<span class="btn" style="justify-self:start">${esc(b.cta)}</span></div>`,
    progress: (b) => `<div class="card">${b.titolo ? `<h3>${esc(b.titolo)}</h3>` : ""}${b.items.map((p) => `<div style="margin:10px 0"><div class="row between small"><span>${esc(p[0])}</span><span>${p[1]}%</span></div><div class="bar"><i style="width:${p[1]}%"></i></div></div>`).join("")}</div>`,
    prezzi: (b) => `<div class="grid g3">${b.items.map((p) => `<div class="piano ${p.evidenza ? "ev" : ""}"><h3>${esc(p.nome)}</h3><span class="p">DA DECIDERE</span><ul>${p.include.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("")}</div>`,
    chips: (b) => `<div class="filtri">${b.items.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>`,
    nota: (b) => `<div class="dec-banner">${ico("cantiere")}<span>${esc(b.testo)}</span></div>`,
  };
  function dettaglio(x) {
    if (!x) return `<div class="vuoto"><h3>Card non trovata</h3><a class="btn sec" href="#/decidere">Torna a Da decidere</a></div>`;
    const sez = (k, h) => `<div class="dsez"><div class="k">${k}</div><div>${h}</div></div>`, lista = (l) => `<ul>${l.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
    return `<a class="tbtn" href="#/decidere">← Tutte le card da decidere</a><div style="height:14px"></div>
      ${testa(x.titolo + ".", "", `<span class="tag or">${esc(x.stato)}</span>${vediBtn(x)}`, x.id + " · " + x.gruppo)}
      <div class="dec-banner" style="margin-bottom:20px">${ico("cantiere")}<span><b>Architettura demo, non decisa.</b> Impatto ${punti(x.impatto)} · Sforzo ${punti(x.sforzo)} (valori dall'HQ).</span></div>
      <section class="card">${sez("Il problema", `<p>${esc(x.problema)}</p>`)}${sez("La proposta", `<p>${esc(x.proposta)}</p>`)}${sez("Dove vivrebbe", `<p>${esc(x.dove)}</p>`)}
        ${sez("Come risulterebbe", `<div class="schermo">${x.schermata.map((b) => (BLOCCHI[b.t] ? BLOCCHI[b.t](b) : "")).join("")}</div>`)}
        ${sez("Cosa serve", lista(x.serve))}${sez("Da decidere", lista(x.domande))}${sez("Origine", `<p>${esc(x.origine)}</p>`)}
        ${sez("Storico richieste", `<div class="storico">${x.storico.map((s) => `<div><span class="small">${dataIt(s[0], { day: "numeric", month: "short", year: "numeric" })}</span><span>${esc(s[1])}</span></div>`).join("")}</div>`)}</section>`;
  }
  // Configurazione: le tabelle di config.js rese leggibili (per il team, non per gli studenti)
  P.configurazione = () => {
    const sn = (b) => b ? `<td class="si">Sì</td>` : `<td class="no">—</td>`;
    const CAP = [["Estratti di tutte le dispense", () => true], ["Una dispensa completa gratis", (p) => p.sblocca.includes("una_gratis")], ["Appunti completi di un esame", (p) => p.sblocca.some((s) => s.startsWith("appunti") || s.startsWith("dispensa"))], ["Dispensa completa (appunti, mappe, quiz)", (p) => p.sblocca.some((s) => s.startsWith("dispensa"))], ["Quiz illimitati (per gli esami sbloccati)", (p) => p.sblocca.some((s) => s.startsWith("dispensa")) || p.id === "plus"], ["Ripasso errori · simulazione a tempo", (p) => p.id === "plus"], ["Piano guidato · confronto CV", (p) => p.id === "plus"]];
    const areeV = C.aree.filter((a) => a.stato !== "proposta");
    return `${testa("Configurazione.", "Come è configurata la app, letto direttamente da config.js. Cambiare qui = cambiare una riga lì: nessun design da rifare.", "", "Sezione di lavoro del team")}
      <section class="card"><div class="ch"><h2>1 · Aree di studio</h2><span class="small">UL_AREE</span></div><div class="tabwrap"><table class="tab"><thead><tr><th>Area</th><th>Stato</th><th>Atenei</th><th>Corsi</th><th>Test (Test Prep)</th><th>Moduli con contenuto</th></tr></thead><tbody>
        ${C.aree.map((a) => `<tr><td><span class="row" style="gap:8px"><i style="width:10px;height:10px;border-radius:50%;background:${a.colore};display:inline-block"></i>${esc(a.nome)}</span></td><td><span class="tag ${a.stato === "attiva" ? "ok" : "or"}">${esc(a.stato.replace("_", " "))}</span></td><td>${esc(a.atenei.map((x) => x.nome + (x.stato === "attivo" ? "" : " (in arrivo)")).join(", ") || "—")}</td><td>${esc(a.corsi.join(", ") || "—")}</td><td>${esc(a.test ? a.test.nome : "—")}</td><td>${C.moduli.filter((m) => m.aree.includes("tutte") || (m.aree.includes(a.slug) && a.stato === "attiva")).length}/${C.moduli.length}</td></tr>`).join("")}</tbody></table></div>
        <p class="small" style="margin-top:10px">Aggiungere un'area: una riga in UL_AREE con stato «in_arrivo» → compare nel primo accesso e nel profilo con lista d'attesa. Accenderla: stato «attiva» + dispense con Area = slug + slug nei moduli che hanno contenuto.</p></section>
      <section class="card section-gap"><div class="ch"><h2>2 · Moduli × percorsi × aree</h2><span class="small">UL_MODULI · UL_PERCORSI</span></div><div class="tabwrap"><table class="tab mx"><thead><tr><th>Modulo</th><th>Percorso</th>${areeV.map((a) => `<th>${esc(a.nome)}</th>`).join("")}<th>Telefono</th></tr></thead><tbody>
        ${C.moduli.map((m) => `<tr><td>${esc(m.nome)}</td><td>${esc((C.percorsi.find((p) => p.id === m.percorso) || { nome: m.percorso === "comune" ? "Sempre" : "Account" }).nome)}</td>${areeV.map((a) => m.aree.includes("tutte") ? `<td class="si">Sì</td>` : m.aree.includes(a.slug) && a.stato === "attiva" ? `<td class="si">Sì</td>` : `<td class="par">in arrivo</td>`).join("")}<td>${m.tab ? "barra · " + m.tab : "menu"}</td></tr>`).join("")}</tbody></table></div></section>
      <section class="card section-gap"><div class="ch"><h2>3 · Piani × funzioni</h2><span class="small">UL_PIANI · accesso() in app.js · prezzi = ipotesi</span></div><div class="tabwrap"><table class="tab mx"><thead><tr><th>Funzione</th>${C.piani.map((p) => `<th>${esc(p.nome)}<br><span style="text-transform:none;letter-spacing:0;font-weight:400">${esc(p.prezzo)}</span></th>`).join("")}</tr></thead><tbody>
        ${CAP.map(([n, f]) => `<tr><td>${n}</td>${C.piani.map((p) => sn(f(p))).join("")}</tr>`).join("")}</tbody></table></div>
        <p class="small" style="margin-top:10px">Gli acquisti si sommano: Plus apre gli strumenti, non le dispense. Quiz gratuiti: ${LIMITE_QUIZ} al giorno.</p></section>
      <section class="card section-gap"><div class="ch"><h2>4 · Account demo</h2><span class="small">UL_PERSONE · uno per ogni combinazione da provare</span></div>
        ${C.persone.map((p) => `<div class="li"><span class="av" style="background:${p.colore}">${esc(p.nome[0] + p.cognome[0])}</span><div class="grow"><div class="t">${esc(p.nome + " " + p.cognome)}</div><div class="small">${esc(p.etichetta)} · percorso ${esc((C.percorsi.find((x) => x.id === p.percorso) || {}).nome)}</div></div><button class="btn sec sm" data-persona="${p.id}">Entra</button></div>`).join("")}
        <div class="li"><span class="av" style="background:#e2e5ed;color:#172554">+</span><div class="grow"><div class="t">Nuovo account</div><div class="small">Primo accesso in 7 passi</div></div><button class="btn sec sm" data-nuovo>Prova</button></div></section>`;
  };

  /* ---------------- 12 · avvio, rotte ed eventi ---------------- */
  function rotta() { const [p, q] = (location.hash.replace(/^#\/?/, "") || "oggi").split("?"); return { r: p.split("/").filter(Boolean), qs: Object.fromEntries(new URLSearchParams(q || "")) }; }
  function disegna() {
    let { r, qs } = rotta();
    document.body.classList.remove("menu");
    const fuori = r[0] === "accedi" || r[0] === "benvenuto" || !S.u;
    $("#app").hidden = fuori; $("#fuori").hidden = !fuori; $("#tabbar").hidden = fuori;
    if (fuori) { $("#fuori").innerHTML = r[0] === "benvenuto" ? benvenuto(r[1]) : accedi(); document.title = "UniLink · Accedi"; window.scrollTo(0, 0); return; }
    if (!P[r[0]]) r = ["oggi"];
    guscio(r[0]);
    const m = modulo(r[0]), pc = m && C.percorsi.find((p) => p.id === m.percorso);
    $("#page").innerHTML = m && !visibile(m) ? `<div class="vuoto"><h3>Questa sezione è nel percorso «${esc(pc.nome)}»</h3><p>Cambia percorso dalla sidebar per vederla.</p><button class="btn" data-vai-perc="${m.percorso}">Passa a ${esc(pc.nome)}</button></div>` : P[r[0]](qs, r);
    document.title = "UniLink · " + ((m && m.nome) || (r[0] === "decidere" ? "Da decidere" : "Configurazione"));
    catalogo(); aggiornaCalc();
  }
  const ridisegna = () => { const y = window.scrollY; disegna(); window.scrollTo(0, y); };
  const entra = (id) => { S.u = nuovoUtente(C.persone.find((p) => p.id === id)); S.errori = []; S.quizOggi = { d: OGGI, n: 0 }; S.calc = null; S.off = null; Q = null; sett = 0; salva(); chiudi(); location.hash = "#/oggi"; disegna(); window.scrollTo(0, 0); toast("Sei " + S.u.nome + " · " + S.u.etichetta); };

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-menu],[data-avatar],[data-persona],[data-nuovo],[data-onb-area],[data-onb-perc],[data-onb-esame],[data-onb-min],[data-onb-giorno],[data-onb-piano],[data-onb-meta],[data-fatto],[data-task-btn],[data-del-task],[data-sett],[data-vista],[data-organizza],[data-nuova-attivita],[data-nuovo-esame],[data-apri-esame],[data-modifica-esame],[data-rimuovi-esame],[data-ftipo],[data-fmie],[data-salva],[data-leggi],[data-gratis],[data-compra],[data-modo],[data-risposta],[data-avanti],[data-ricomincia],[data-nuovo-voto],[data-del-voto],[data-c],[data-del-short],[data-acquista],[data-tab-abb],[data-colore],[data-come],[data-cambia],[data-rifai],[data-esci],[data-reset],[data-chiudi],[data-vai-perc]");
    if (!e.target.closest(".avwrap") && $("#avmenu")) $("#avmenu").hidden = true;
    if (!t) { if (e.target.id === "modal") chiudi(); return; }
    const d = t.dataset, u = U();
    if ("chiudi" in d) { chiudi(); if (t.tagName !== "A") return; }
    if ("menu" in d) { document.body.classList.toggle("menu"); return; }
    if ("avatar" in d) { const m = $("#avmenu"); m.hidden = !m.hidden; return; }
    if ("persona" in d) { entra(d.persona); return; }
    if ("nuovo" in d) { S.onb = null; salva(); location.hash = "#/benvenuto/1"; return; }
    // primo accesso
    if ("onbArea" in d) { S.onb.area = d.onbArea; const a = C.aree.find((x) => x.slug === d.onbArea); S.onb.corso = a.corsi[0] || ""; S.onb.ateneo = (a.atenei[0] || { slug: "altro" }).slug; salva(); ridisegna(); return; }
    if ("onbPerc" in d) { S.onb.percorso = d.onbPerc; if (d.onbPerc === "test") S.onb.anno = "Prima dell'università"; salva(); ridisegna(); return; }
    if ("onbEsame" in d) { const l = S.onb.esami, i = l.indexOf(d.onbEsame); i >= 0 ? l.splice(i, 1) : l.push(d.onbEsame); salva(); t.classList.toggle("ok"); return; }
    if ("onbMin" in d) { S.onb.minuti = +d.onbMin; salva(); ridisegna(); return; }
    if ("onbGiorno" in d) { const l = S.onb.giorni, i = l.indexOf(d.onbGiorno); i >= 0 ? l.splice(i, 1) : l.push(d.onbGiorno); salva(); t.classList.toggle("ok"); return; }
    if ("onbPiano" in d) { S.onb.piano = d.onbPiano; salva(); ridisegna(); return; }
    if ("onbMeta" in d) { S.onb.meta = d.onbMeta; salva(); ridisegna(); return; }
    if (!u) return;
    if ("fatto" in d) { const x = u.esami.find((y) => y.id === d.fatto), i = +d.i, k = x.fatti.indexOf(i); k >= 0 ? x.fatti.splice(k, 1) : x.fatti.push(i); salva(); if (k < 0) toast("Ripassato: " + x.argomenti[i]); const aperto = !$("#modal").hidden; ridisegna(); if (aperto) apriEsame(x.id); return; }
    if ("taskBtn" in d) { const x = u.tasks.find((y) => y.id === d.taskBtn); x.fatto = !x.fatto; salva(); ridisegna(); return; }
    if ("delTask" in d) { u.tasks = u.tasks.filter((y) => y.id !== d.delTask); salva(); ridisegna(); return; }
    if ("sett" in d) { sett = +d.sett === 0 ? 0 : sett + +d.sett; ridisegna(); return; }
    if ("vista" in d) { vistaPiano = d.vista; ridisegna(); return; }
    if ("organizza" in d) { if (accesso("piano_guidato") !== "pieno") { modal("Piano guidato", `<p>Genera le sessioni della settimana dalla data degli appelli, dagli argomenti e dai tuoi ${u.minuti} minuti al giorno.</p><div class="callout or">${lucchetto("Con Plus · ipotesi")} È una proposta: <a class="tbtn" href="#/decidere/D04" data-chiudi>Da decidere D04</a></div><a class="btn or" href="#/abbonamento?tab=offerte" data-chiudi>Scopri Plus</a>`); return; }
      const e1 = u.esami.find((x) => x.fatti.length < x.argomenti.length); if (e1) e1.argomenti.forEach((a, i) => { if (!e1.fatti.includes(i)) u.tasks.push({ id: uid(), titolo: nomeEsame(e1) + " · " + a, data: addG(OGGI, 1 + i * 2), ora: "17:00", min: u.minuti, tipo: "studio", fatto: false }); });
      salva(); toast("Piano guidato: sessioni aggiunte (demo)"); ridisegna(); return; }
    if ("nuovaAttivita" in d) { nuovaAttivita(); return; }
    if ("nuovoEsame" in d) { formEsame(); return; }
    if ("apriEsame" in d) { apriEsame(d.apriEsame); return; }
    if ("modificaEsame" in d) { formEsame(d.modificaEsame); return; }
    if ("rimuoviEsame" in d) { u.esami = u.esami.filter((x) => x.id !== d.rimuoviEsame); salva(); chiudi(); toast("Esame rimosso"); ridisegna(); return; }
    if ("ftipo" in d) { F.tipo = d.ftipo; $$("[data-ftipo]").forEach((b) => b.classList.toggle("on", b === t)); catalogo(); return; }
    if ("fmie" in d) { F.mie = !F.mie; t.classList.toggle("on", F.mie); catalogo(); return; }
    if ("salva" in d) { const l = u.salvati, i = l.indexOf(d.salva); i >= 0 ? l.splice(i, 1) : l.push(d.salva); salva(); toast(i >= 0 ? "Rimossa dai salvati" : "Salvata"); if (location.hash.startsWith("#/salvati")) ridisegna(); else { catalogo(); guscio(rotta().r[0]); } return; }
    if ("leggi" in d) { lettore(d.leggi, d.tab || "Appunti"); return; }
    if ("gratis" in d) { u.acquisti.push({ tipo: "una_gratis", esame: d.gratis, data: OGGI }); salva(); chiudi(); toast("Dispensa completa sbloccata: " + disp(d.gratis).nome); ridisegna(); return; }
    if ("compra" in d) { chiudi(); S.off = S.off || {}; S.off.esame = d.compra; salva(); location.hash = "#/abbonamento?tab=offerte"; return; }
    if ("modo" in d) { modoQuiz = d.modo; Q = null; ridisegna(); return; }
    if ("risposta" in d) { if (Q.scelta !== null) return; const q = Q.pool[Q.i]; Q.scelta = +d.risposta; Q.fatte++; S.quizOggi.n++; if (Q.scelta === q.g) Q.giuste++; else if (!S.errori.some((x) => x.k === C.domande.indexOf(q))) S.errori.push({ k: C.domande.indexOf(q), r: Q.scelta, esame: q.esame }); salva(); ridisegna(); return; }
    if ("avanti" in d) { Q.i++; Q.scelta = null; ridisegna(); return; }
    if ("ricomincia" in d) { Q = null; ridisegna(); return; }
    if ("nuovoVoto" in d) { modal("Aggiungi un voto", `<form id="frm-voto" class="grid" style="gap:12px"><label class="fld">Esame<select name="slug">${DISP.filter((x) => !u.libretto.some((l) => l.slug === x.slug)).map((x) => `<option value="${x.slug}">${esc(x.nome)}</option>`).join("")}</select></label><div class="grid g2" style="gap:12px"><label class="fld">Voto<select name="voto">${[31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18].map((v) => `<option value="${v}">${v === 31 ? "30 e lode" : v}</option>`).join("")}</select></label><label class="fld">CFU<input type="number" name="cfu" value="9" min="1" max="30"></label></div><button class="btn">Aggiungi al libretto</button></form>`); return; }
    if ("delVoto" in d) { u.libretto.splice(+d.delVoto, 1); salva(); ridisegna(); return; }
    if ("c" in d && d.v != null) { S.calc[d.c] = +d.v; $$(`[data-c="${d.c}"][data-v]`).forEach((b) => b.classList.toggle("on", b === t)); salva(); aggiornaCalc(); return; }
    if ("delShort" in d) { u.shortlist.splice(+d.delShort, 1); salva(); ridisegna(); return; }
    if ("acquista" in d) { const sel = $(`[data-scegli-esame="${d.acquista}"]`); acquista(d.acquista, sel ? sel.value : null); return; }
    if ("tabAbb" in d) { location.hash = "#/abbonamento?tab=" + d.tabAbb; return; }
    if ("colore" in d) { u.colore = d.colore; salva(); ridisegna(); toast("Colore aggiornato"); return; }
    if ("come" in d) { e.preventDefault(); comeFunziona(); return; }
    if ("cambia" in d || "esci" in d) { S.u = null; salva(); location.hash = "#/accedi"; disegna(); return; }
    if ("rifai" in d) { S.onb = { ...onbBase(), nome: u.nome, cognome: u.cognome, email: u.email, area: u.area, ateneo: u.ateneo, corso: u.corso, anno: u.anno, percorso: u.percorso, esami: u.esami.map((x) => x.slug).filter(disp), minuti: u.minuti, obiettivo: u.obiettivo || "", piano: plus() ? "plus" : "gratuito", dataTest: u.dataTest || "2027-04-15", meta: u.meta || "Magistrale in Italia" }; salva(); location.hash = "#/benvenuto/1"; return; }
    if ("reset" in d) { try { localStorage.removeItem(KEY); } catch (er) {} location.hash = "#/accedi"; location.reload(); return; }
    if ("vaiPerc" in d) { u.percorso = d.vaiPerc; salva(); ridisegna(); return; }
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "q") { F.q = e.target.value; catalogo(); }
    if (e.target.dataset.c && e.target.type === "range") { if (e.target.dataset.c !== "media") S.calc[e.target.dataset.c] = +e.target.value; aggiornaCalc(); }
  });
  document.addEventListener("change", (e) => {
    const id = e.target.id;
    if (id === "perc") { U().percorso = e.target.value; Q = null; salva(); toast("Percorso: " + percorso().nome); location.hash = "#/oggi"; disegna(); }
    if (id === "f-anno") { F.anno = e.target.value; catalogo(); }
    if (id === "o-anno" || id === "o-sem") { S.off[id === "o-anno" ? "anno" : "sem"] = e.target.value; salva(); ridisegna(); }
    if (e.target.dataset.scegliEsame) { S.off.esame = e.target.value; salva(); }
    if (e.target.dataset.check) { U().check[e.target.dataset.check] = e.target.checked; salva(); ridisegna(); }
    if (e.target.dataset.task) { const x = U().tasks.find((y) => y.id === e.target.dataset.task); x.fatto = e.target.checked; salva(); }
  });
  document.addEventListener("submit", (e) => {
    e.preventDefault(); const f = e.target, v = Object.fromEntries(new FormData(f)), u = U();
    if (f.id === "frm-accedi") { toast("Demo: nessuna email inviata. Prosegui con il primo accesso."); S.onb = { ...onbBase(), email: v.email }; salva(); location.hash = "#/benvenuto/1"; return; }
    if (f.id === "frm-onb") { const n = +f.dataset.n, o = S.onb;
      ["nome", "cognome", "email", "ateneo", "corso", "anno", "obiettivo", "dataTest", "attesa"].forEach((k) => { if (k in v) o[k] = v[k]; });
      if (n === 6) { o.privacy = !!v.privacy; o.avvisi = !!v.avvisi; o.novita = !!v.novita; }
      salva(); if (n < 7) location.hash = "#/benvenuto/" + (n + 1); else fineOnboarding(); return; }
    if (!u) return;
    if (f.id === "frm-attesa") { S.attesa = S.attesa || {}; S.attesa[u.area] = v.r; salva(); toast("Fatto: ti avvisiamo quando parte"); ridisegna(); }
    if (f.id === "frm-task") { u.tasks.push({ id: uid(), titolo: v.titolo, data: v.data, ora: v.ora || "17:00", min: +v.min || 45, tipo: v.tipo, fatto: false }); salva(); chiudi(); toast("Attività aggiunta"); ridisegna(); }
    if (f.id === "frm-esame") { const args = (v.arg || "").split("\n").map((s) => s.trim()).filter(Boolean), id = f.dataset.id, slug = v.slug || "x-" + uid();
      const dati = { slug, nome: v.nome, data: v.data, obiettivo: +v.ob, argomenti: args.length ? args : ARG[slug] || ["Ripasso generale"] };
      if (id) { const x = u.esami.find((y) => y.id === id); const cambiato = x.argomenti.join() !== dati.argomenti.join(); Object.assign(x, dati); if (cambiato) x.fatti = []; } else u.esami.push({ id: uid(), fatti: [], ...dati });
      salva(); chiudi(); toast(id ? "Esame aggiornato" : "Esame aggiunto"); ridisegna(); }
    if (f.id === "frm-voto") { u.libretto.push({ slug: v.slug, voto: +v.voto, cfu: +v.cfu || 9 }); salva(); chiudi(); toast("Voto aggiunto"); ridisegna(); }
    if (f.id === "frm-short") { u.shortlist.push(v.s); salva(); ridisegna(); }
    if (f.id === "frm-datatest") { u.dataTest = v.d; salva(); toast("Data del test salvata"); ridisegna(); }
    if (f.id === "frm-profilo") { const cambiaArea = v.area !== u.area; Object.assign(u, { nome: v.nome, cognome: v.cognome, area: v.area, ateneo: v.ateneo, corso: v.corso, anno: v.anno, obiettivo: v.obiettivo, minuti: +v.minuti || u.minuti, percorso: v.percorso });
      if (cambiaArea) { const a = area(); u.ateneo = (a.atenei[0] || { slug: "altro" }).slug; if (a.corsi[0]) u.corso = a.corsi[0]; } salva(); toast("Profilo salvato"); ridisegna(); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { chiudi(); document.body.classList.remove("menu"); $("#avmenu") && ($("#avmenu").hidden = true); } });
  window.addEventListener("hashchange", disegna);
  if (S.quizOggi.d !== OGGI) S.quizOggi = { d: OGGI, n: 0 };
  disegna();
})();
