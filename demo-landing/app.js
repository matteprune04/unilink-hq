// UniLink — demo navigabile della landing v2.
// Riferimento per Framer: niente backend, niente invii reali. Le preferenze della demo stanno solo in questo browser.
// Indice: 1 utilità · 2 navbar e footer · 3 animazioni · 4 home (fasi, catalogo) · 5 strumenti · 6 area personale (anteprima)
//         · 7 lista d'attesa · 8 prezzi · 9 DA DECIDERE · 10 piccole interazioni
(function () {
  "use strict";
  /* ---------- 1 · utilità ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const CFG = window.UL_CFG;
  const pagina = document.body.dataset.page || "home";
  const WA = CFG.wa, APP = CFG.app;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const UND = '<svg class="u" viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M3 13 C 55 4, 130 3, 197 9" stroke="#cf7527" stroke-width="5" fill="none" stroke-linecap="round"/></svg>';
  const SPK = '<svg class="s" viewBox="0 0 20 20"><path d="M3 17 L7 8 M10 18 L16 11 M12 5 L15 1" stroke="#cf7527" stroke-width="2.4" stroke-linecap="round"/></svg>';
  // «parola accento» della landing: *parola* → arancio sottolineato a mano (una per titolo)
  const acc = (t) => esc(t).replace(/\*(.+?)\*/, '<span class="acc">$1' + UND + "</span>");
  const store = {
    get(k, d) { try { const v = localStorage.getItem("ul-demo-" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("ul-demo-" + k, JSON.stringify(v)); } catch (e) {} },
  };
  const toast = (t) => { const el = $("#toast"); if (!el) return; el.textContent = t; el.classList.add("vis"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("vis"), 2800); };
  // le sottolineature a mano si aggiungono da sole alle parole accento scritte senza SVG
  $$(".acc").forEach((a) => { if (!$(".u", a)) a.insertAdjacentHTML("beforeend", UND + (a.hasAttribute("data-s") ? SPK : "")); });
  $$("[data-n]").forEach((el) => { const v = CFG.numeri[el.dataset.n]; if (v) el.textContent = v; });

  /* ---------- 2 · navbar e footer comuni (tutto da UL_CFG) ---------- */
  const fasePag = { prima: "prima", durante: "durante", dopo: "dopo", tesi: "dopo" }[pagina];
  const att = (c) => (c ? "att" : "");
  const badge = (h) => `<span class="badge ${h.stato === "attivo" ? "on" : ""}">${h.stato === "attivo" ? "Attivo" : "In arrivo"}</span>`;
  const tend = (label, href, items, on) => `<span class="tendina"><a class="tend ${att(on)}" href="${href}">${label}</a><div class="pan">${items}</div></span>`;
  const nDec = CFG.decidere.length;
  const NAV = CFG.nav || {};
  const COMM = CFG.commenti && CFG.commenti.attivi;
  // menu «Founder»: strumenti di lavoro della demo, NON vanno nel sito finale (P7)
  const nArc = (CFG.archivio || []).length;
  const fondItems = `<a href="area.html">Area personale · schermate</a><a href="decidere.html">Da decidere <span class="badge">${nDec}</span></a><a href="archivio/index.html">Archivio <span class="badge">${nArc}</span></a>${COMM ? '<a href="commenti.html">Commenti del team</a>' : ""}`;
  const fasePagine = ["prima", "durante", "dopo", "tesi"];
  const navHTML = `
    <div class="topbar" role="region" aria-label="Avviso demo">Demo navigabile v${CFG.versione.n} · contenuti in parte fittizi, nessun invio reale · strumenti del team nel menu <b>${esc(NAV.founder || "Founder")}</b>${COMM ? " · <b>commenta</b> con il pulsante in basso" : ""}</div>
    <header class="navwrap"><div class="nav">
      <a class="logo" href="index.html"><img src="img/logo-blu.png" alt="">unilink</a>
      <div class="menu">
        ${tend("Hub", "#", CFG.hub.map((h) => `<a href="${h.href}">${h.nome}${badge(h)}</a>`).join(""), pagina.startsWith("hub") || fasePagine.includes(pagina))}
        <a class="${att(pagina === "guida")}" href="guida.html">${esc(NAV.guida || "Guida")}</a>
        <a class="${att(pagina === "materiali" || pagina === "preview")}" href="materiali.html">${esc(NAV.materiali || "Materiali")}</a>
        <a class="${att(pagina === "tools")}" href="tools.html">${esc(NAV.strumenti || "Strumenti")}</a>
        <a class="${att(pagina === "ambassador")}" href="ambassador.html">${esc(NAV.ambassador || "Ambassador")}</a>
      </div>
      <span class="tendina fondatori"><a class="tend decpill ${att(["decidere", "area", "commenti", "archivio"].includes(pagina))}" href="#" title="Strumenti del team: solo in demo">${esc(NAV.founder || "Founder")} <span>${nDec}</span></a><div class="pan">${fondItems}</div></span>
      <a class="btn btn-p navcta" href="${APP}">${esc(NAV.accedi || "Accedi")}</a>
      <button class="burger" aria-label="Apri il menu">≡</button>
    </div></header>
    <div class="mmenu"><button class="x" aria-label="Chiudi">✕</button>
      <div class="mg">Hub</div>
      ${CFG.hub.map((h) => `<a href="${h.href}">${h.nome} ${badge(h)}</a>`).join("")}
      <div class="mg">UniLink</div>
      <a href="guida.html">${esc(NAV.guida || "Guida")}</a><a href="materiali.html">${esc(NAV.materiali || "Materiali")}</a><a href="tools.html">${esc(NAV.strumenti || "Strumenti")}</a><a href="ambassador.html">${esc(NAV.ambassador || "Ambassador")}</a>
      <a class="btn btn-p" href="${APP}">${esc(NAV.accedi || "Accedi")}</a>
      <div class="mg">${esc(NAV.founder || "Founder")} · solo demo</div>
      <a class="mdec" href="decidere.html">Da decidere · ${nDec}</a><a href="archivio/index.html">Archivio · ${nArc}</a><a href="area.html">Area personale · schermate</a>${COMM ? '<a href="commenti.html">Commenti del team</a>' : ""}
      <a class="btn btn-a" href="${WA}" target="_blank" rel="noopener">Entra nel gruppo WhatsApp</a></div>`;
  const onda = (c) => `<svg class="top" viewBox="0 0 1440 60" preserveAspectRatio="none"><path fill="${c}" d="M0 60 L0 32 ${"a40 28 0 0 1 80 0 ".repeat(18)}L1440 60 Z"/></svg>`;
  const footHTML = `<footer>${onda("#172554")}<div class="wrap"><div class="fgrid">
      <div><a class="logo w" href="index.html"><img src="img/logo-white.png" alt="">unilink</a><p style="opacity:.75;font-size:15px;margin-top:14px;max-width:300px">Da studenti, per studenti. Da Firenze, un passo alla volta.</p></div>
      <div><h2 class="fh">Hub</h2>${CFG.hub.map((h) => `<a href="${h.href}">${h.nome}${h.stato === "attivo" ? "" : " · in arrivo"}</a>`).join("")}</div>
      <div><h2 class="fh">In ogni hub</h2>${CFG.fasi.map((f) => `<a href="${f.href}">${f.tab}</a>`).join("")}<a href="guida.html">${esc(NAV.guida || "Guida")}</a><a href="materiali.html">${esc(NAV.materiali || "Materiali")}</a><a href="tools.html">Strumenti</a></div>
      <div><h2 class="fh">UniLink</h2><a href="${WA}" target="_blank" rel="noopener">Gruppo WhatsApp</a><a href="ambassador.html">Diventa ambassador</a><a href="index.html#faq">FAQ</a><a href="${APP}">Accedi all’area personale</a><a href="decidere.html">Da decidere (founder)</a></div>
      <div class="fnl"><h2 class="fh">Avvisami quando apre</h2><p style="font-size:14.5px;opacity:.75">Giurisprudenza o Medicina: una sola email, quando l'hub apre.</p><form class="nl" id="nl"><input type="email" placeholder="La tua email" aria-label="La tua email" style="background:transparent;border:0;outline:0;color:#f4f1ea;font:inherit;flex:1;min-width:0"><button class="nlb" style="width:34px;height:34px;border-radius:50%;background:#cf7527;border:0;color:#fff;cursor:pointer">→</button></form></div>
    </div><div class="fbase"><span>© 2026 UniLink Firenze · Progetto indipendente, non affiliato all'Università di Firenze · Venditore: dati da definire (soggetto legale) · <a href="#" data-legale>Privacy</a> · <a href="#" data-legale>Cookie</a> · <a href="#" data-legale>Termini</a> · <a href="#" data-legale>Gestisci cookie</a></span><span>Demo v${CFG.versione.n} · ${new Date(CFG.versione.data).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}</span></div></div></footer>
    <div class="toast" id="toast"></div>`;
  $("#ul-nav") && ($("#ul-nav").outerHTML = navHTML);
  $("#ul-foot") && ($("#ul-foot").outerHTML = footHTML);
  /* struttura: link «vai al contenuto», <main>, briciole di pane */
  document.body.insertAdjacentHTML("afterbegin", '<a class="skip" href="#main">Vai al contenuto</a>');
  const mmenu = $(".mmenu"), foot = $("footer");
  if (mmenu && foot) { const main = document.createElement("main"); main.id = "main"; main.tabIndex = -1; let n = mmenu.nextElementSibling; while (n && n !== foot) { const nx = n.nextElementSibling; main.appendChild(n); n = nx; } mmenu.after(main); }
  const CRUMB = { prima: [["Scegliere"]], durante: [["Studiare"]], dopo: [["Dopo la laurea"]], tesi: [["Dopo la laurea", "dopo.html"], ["Tesi e laurea"]], guida: [["Guida"]], materiali: [[NAV.materiali || "Materiali"]], preview: [[NAV.materiali || "Materiali", "materiali.html"], ["Anteprima"]], tools: [["Strumenti"]], area: [["Area personale"]], community: [["Community"]], prezzi: [["Prezzi (esempio)"]], decidere: [["Da decidere"]], commenti: [["Commenti del team"]], archivio: [["Archivio"]], ambassador: [["Ambassador"]],
    "hub-economia": [["Hub"], ["Economia"]], "hub-giurisprudenza": [["Hub"], ["Giurisprudenza"]], "hub-medicina": [["Hub"], ["Medicina"]] }[pagina];
  // pagine ARCHIVIATE (archivio/*.html, body data-archiviata="id"): briciole verso l'Archivio e banner con il perché
  const ARC = document.body.dataset.archiviata && (CFG.archivio || []).find((a) => a.id === document.body.dataset.archiviata);
  if (ARC && $("#main")) $("#main").insertAdjacentHTML("afterbegin", `<div class="arc-banner" role="note"><div class="wrap"><b>Pagina archiviata il ${new Date(ARC.quando).toLocaleDateString("it-IT")}</b> · ${esc(ARC.perche)} <a href="archivio/index.html"><u>← Archivio</u></a></div></div>`);
  if (CRUMB && $("#main")) { const it = [["Home", "index.html"], ...CRUMB]; $("#main").insertAdjacentHTML("afterbegin", `<nav class="crumbs" aria-label="Percorso"><div class="wrap">${it.map((c, i) => (i === it.length - 1 ? `<span aria-current="page">${esc(c[0])}</span>` : c[1] ? `<a href="${c[1]}">${esc(c[0])}</a>` : `<span>${esc(c[0])}</span>`)).join("<i>›</i>")}</div></nav>`); }
  /* schede dell'hub (P7): le fasi non sono più nella barra, stanno dentro ogni hub. L'hub scelto si ricorda. */
  const HUBALL = CFG.hub.concat(CFG.hubArchiviati || []);
  const hubDaPag = (HUBALL.find((h) => pagina === "hub-" + h.slug) || {}).slug;
  if (hubDaPag) store.set("hub", hubDaPag);
  const hubCorr = hubDaPag || new URLSearchParams(location.search).get("hub") || store.get("hub", "economia");
  if ((hubDaPag || fasePagine.includes(pagina)) && $("#main")) {
    const h = HUBALL.find((x) => x.slug === hubCorr) || CFG.hub[0];
    const voci = [["Panoramica", h.href, !!hubDaPag], ...CFG.fasi.map((f) => [f.tab, `${f.href}?hub=${h.slug}`, pagina === f.id || (f.id === "dopo" && pagina === "tesi")])];
    const html = `<nav class="hubtabs" aria-label="Sezioni dell'hub ${esc(h.nome)}"><div class="wrap"><span class="hubnome">${esc(h.nome)}${h.stato === "attivo" ? "" : " · in arrivo"}</span>${voci.map(([t, href, on]) => `<a href="${href}" ${on ? 'aria-current="page" class="on"' : ""}>${esc(t)}</a>`).join("")}</div></nav>`;
    const cr = $(".crumbs", $("#main")); cr ? cr.insertAdjacentHTML("afterend", html) : $("#main").insertAdjacentHTML("afterbegin", html);
  }
  /* menu: tastiera, focus e blocco dello scorrimento */
  const burger = $(".burger");
  if (burger && mmenu) {
    mmenu.id = "mmenu"; mmenu.setAttribute("role", "dialog"); mmenu.setAttribute("aria-modal", "true"); mmenu.setAttribute("aria-label", "Menu");
    burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-controls", "mmenu");
    const apri = () => { mmenu.classList.add("open"); burger.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; $(".x", mmenu).focus(); };
    const chiudi = (torna) => { mmenu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; if (torna) burger.focus(); };
    burger.addEventListener("click", apri); $(".x", mmenu).addEventListener("click", () => chiudi(true));
    mmenu.addEventListener("click", (e) => { if (e.target.closest("a")) chiudi(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && mmenu.classList.contains("open")) chiudi(true); });
  }
  /* tendine della barra: stato annunciato, Esc le chiude */
  $$(".tendina").forEach((t) => {
    const a = $(".tend", t), set = (v) => a.setAttribute("aria-expanded", v);
    a.setAttribute("aria-haspopup", "true"); set("false");
    t.addEventListener("mouseenter", () => set("true")); t.addEventListener("mouseleave", () => set("false")); t.addEventListener("focusin", () => set("true"));
    t.addEventListener("focusout", (e) => { if (!t.contains(e.relatedTarget)) set("false"); });
    t.addEventListener("keydown", (e) => { if (e.key === "Escape") { set("false"); t.classList.add("closed"); a.focus(); setTimeout(() => t.classList.remove("closed"), 400); } });
  });
  $$(".tendina > a[href='#']").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); a.parentElement.classList.toggle("open"); }));
  document.addEventListener("click", (e) => { if (!e.target.closest(".tendina")) $$(".tendina.open").forEach((t) => t.classList.remove("open")); });
  $$("[data-legale]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); toast("Testi legali in preparazione (banner cookie e privacy prima del lancio)"); }));
  $("#nl")?.addEventListener("submit", (e) => { e.preventDefault(); const i = $("input", e.target); if (!/^\S+@\S+\.\S+$/.test(i.value)) { toast("Scrivi un'email valida"); return; } i.value = ""; toast("Demo: iscrizione simulata, nessuna email inviata."); });

  /* ---------- 3 · animazioni ---------- */
  const io = "IntersectionObserver" in window && !/statico/.test(location.search) ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); } }), { threshold: 0.12 }) : null;
  // .app sposta e fa comparire; .app-o solo dissolvenza, per gli elementi che hanno già una rotazione
  $$(".testa, .hubs > *, .livelli, .garanzie, .tools, .team > *, .qa, .finale, .fasi3 > *, .piano, .form, .costruisci, .step, .cardnum, .fotonum, .cds > *, .devprev").forEach((el, i) => {
    if (!io) return; el.classList.add(el.matches(".step, .cardnum, .fotonum, .piano.top") ? "app-o" : "app"); el.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(el);
  });
  const tp = $(".ribbon textPath");
  if (tp && !matchMedia("(prefers-reduced-motion: reduce)").matches) { let o = 0; const giro = () => { o = (o - 0.35) % 600; tp.setAttribute("startOffset", o); requestAnimationFrame(giro); }; giro(); }

  /* ---------- 4 · home: FAQ, «parti da dove sei», catalogo ---------- */
  $$(".qa").forEach((q) => $(".d", q).addEventListener("click", () => { const ap = !q.classList.contains("open"); $$(".qa", q.parentElement).forEach((x) => { x.classList.remove("open"); $(".d span", x).textContent = "+"; }); if (ap) { q.classList.add("open"); $(".d span", q).textContent = "−"; } }));

  const FASI = {
    matricola: { k: "Per le matricole", t: "Tre cose da fare nel primo mese", r: [["Prima", "Come funziona l'università, passo per passo", "prima.html#funziona"], ["Strumenti", "Piano per il tuo primo appello", "tools.html#piano"], ["Community", "Il gruppo WhatsApp del tuo anno", WA]] },
    esame: { k: "Prepari un esame", t: "Parti dalla dispensa giusta", r: [["Area personale", "Le tue dispense e i tuoi esami", "area.html"], ["Metodo", "Un piano dalla data dell'appello", "durante.html#metodo"], ["Strumenti", "Media e voto che ti serve", "tools.html#media"]] },
    erasmus: { k: "Pensi all'Erasmus", t: "Arriva al bando preparato", r: [["Punteggio", "Stima del tuo punteggio per il bando", "tools.html#erasmus"], ["Durante", "Learning Agreement senza panico", "durante.html#erasmus"], ["WhatsApp", "Chiedi a chi ci è già stato, nel gruppo", WA]] },
    dopo: { k: "Pensi al dopo", t: "Scegli con più elementi", r: [["Voto di laurea", "Da dove parti alla discussione", "tools.html#voto"], ["Magistrali", "Confronta i percorsi prima di scegliere", "dopo.html#magistrali"], ["Media", "Il voto che ti serve agli esami che restano", "tools.html#media"]] },
  };
  const risp = $("#risposta");
  $$(".liv[data-fase]").forEach((l) => l.addEventListener("click", () => {
    $$(".liv").forEach((x) => x.classList.remove("sel")); l.classList.add("sel");
    const f = FASI[l.dataset.fase]; risp.style.opacity = 0;
    setTimeout(() => {
      risp.innerHTML = `<div><span class="eyebrow" style="color:#f0b37c">${f.k}</span><h3 style="margin-top:6px">${f.t}</h3></div>` + f.r.map(([s, t, h]) => `<a class="r" href="${h}" ${h.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}><small>${s}</small>${t} →</a>`).join("");
      risp.style.opacity = 1;
    }, 180);
  }));
  $(".liv.sel")?.click();

  // catalogo: le card aprono l'anteprima nell'area personale (le dispense vivono lì, non in landing)
  const SITOAPP = APP;
  const D = window.UL_DISPENSE || [];
  const LIS = CFG.listino || null;
  const eur = (n) => Number(n).toFixed(2).replace(".", ",") + " €";
  // v8 · listino deciso il 7/10: Simulazione (dove ci sono i quiz), Dispensa completa per ogni esame, Economia Aziendale gratis
  const completaDi = (d) => (!LIS ? null : LIS.prezzi.completa);
  const simulazioneDi = (d) => (!LIS || !d.tipi.includes("Quiz") ? null : LIS.prezzi.simulazione);
  const gratisDi = (d) => !!LIS && d.slug === LIS.gratisEsame;
  const daPrezzo = (d) => (gratisDi(d) ? "Gratis" : "da " + eur((simulazioneDi(d) || completaDi(d))[0]));
  window.UL_PREZZO = { eur, completaDi, simulazioneDi, gratisDi };
  const card = (d) => `<a class="disp" href="preview.html?esame=${encodeURIComponent(d.slug)}" title="Apri l'anteprima di ${esc(d.nome)}">
      <div class="cop"><img src="img/cop/${d.cop}" alt="Copertina ${esc(d.nome)}" loading="lazy"><span class="badge on">${gratisDi(d) ? "Gratis per tutti" : d.anno + " anno"}</span></div>
      <h3>${esc(d.nome)}</h3><div class="meta"><span>${d.sem} semestre</span>${d.mod ? `<span>· ${esc(d.mod.length > 22 ? d.mod.split(" ")[0] + "…" : d.mod)}</span>` : ""}</div>
      <div class="piede"><span class="tipi">${d.tipi.map((t) => `<span>${t}</span>`).join("")}</span><span>${LIS ? daPrezzo(d) : "→"}</span></div></a>`;
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  function catalogo(box, { q = "", anno = "Tutti", area = "Tutte", limite = 99 } = {}) {
    const l = D.filter((d) => (anno === "Tutti" || d.anno === anno) && (area === "Tutte" || d.area === area) && (!q || norm(d.nome).includes(norm(q))));
    box.innerHTML = l.length ? l.slice(0, limite).map(card).join("") : `<div class="vuoto">Nessun esame trovato per "${esc(q)}". Prova con un'altra parola, o <a href="${WA}" target="_blank" rel="noopener"><u>chiedicelo nel gruppo</u></a>.</div>`;
    return l.length;
  }
  const catRoot = $("#catalogo");
  if (catRoot) {
    const box = $(".scroller", catRoot), st = { q: "", anno: "Tutti", area: "Tutte" }, conta = $(".conta", catRoot);
    const run = () => { const n = catalogo(box, { ...st, limite: 12 }); if (conta) conta.textContent = `${n} ${n === 1 ? "esame" : "esami"}`; box.scrollLeft = 0; };
    const inp = $(".cerca input", catRoot);
    inp?.addEventListener("input", () => { st.q = inp.value.trim(); run(); });
    $(".cerca", catRoot)?.addEventListener("submit", (e) => { e.preventDefault(); st.q = inp.value.trim(); run(); });
    $$(".chip", catRoot).forEach((c) => c.addEventListener("click", () => {
      const tipo = c.dataset.anno ? "anno" : "area"; $$(".chip", catRoot).forEach((x) => x.classList.remove("on")); c.classList.add("on");
      st.anno = "Tutti"; st.area = "Tutte"; st[tipo] = c.dataset.anno || c.dataset.area; run();
    }));
    $$(".frecce span", catRoot).forEach((f, i) => f.addEventListener("click", () => box.scrollBy({ left: (i ? 1 : -1) * box.clientWidth * 0.8, behavior: "smooth" })));
    run();
  }
  const anniRoot = $("#anni");
  if (anniRoot) {
    const box = $(".dispense", anniRoot);
    const mostra = (a) => catalogo(box, { anno: a, limite: 8 });
    $$(".toggle span", anniRoot).forEach((s) => s.addEventListener("click", () => { $$(".toggle span", anniRoot).forEach((x) => x.classList.remove("on")); s.classList.add("on"); mostra(s.dataset.anno); }));
    mostra("I");
  }

  /* ---------- 4b · home: contenuti dalla configurazione (campi modificabili in Framer) ---------- */
  // data-cfg="percorso.nel.config" → testo · data-cfg-img="percorso" → { img, alt } su un <img>
  const dalCfg = (p) => p.split(".").reduce((o, k) => (o == null ? o : o[k]), CFG);
  $$("[data-cfg]").forEach((el) => { const v = dalCfg(el.dataset.cfg); if (typeof v === "string") el.textContent = v; });
  $$("[data-cfg-img]").forEach((el) => { const v = dalCfg(el.dataset.cfgImg); if (v && v.img) { el.src = "img/" + v.img; el.alt = v.alt || ""; } });
  // card degli hub (H04) dalla configurazione: icona testuale o immagine (icoImg), foto, testi
  $$("[data-hubs]").forEach((box) => {
    box.innerHTML = CFG.hub.map((h) => { const on = h.stato === "attivo";
      return `<a class="hub ${h.cls} ${on ? "" : "arrivo"}" href="${h.href}"><span class="badge ${on ? "on" : ""}">${on ? "Attivo" : "In arrivo"}</span><div class="ico">${h.icoImg ? `<img src="img/${esc(h.icoImg)}" alt="">` : esc(h.ico)}</div><h3>${esc(h.nome)}</h3><p>${esc(h.desc)}</p><div class="fasi">${h.tag.map((t) => `<span>${esc(t)}</span>`).join("")}</div><div class="img"><img src="img/${esc(h.img)}" alt="" loading="lazy"><div class="avv">${on ? `Entra nell'hub <span class="btn btn-p">Entra →</span>` : `Ti scriviamo quando parte <span class="btn btn-a">Avvisami</span>`}</div></div></a>`; }).join("");
  });
  // catalogo della home (H06): per hub, i corsi più scaricati e «Scopri la collezione completa» → Materiali
  const catHome = $("#catalogo-home");
  if (catHome) {
    const box = $(".scroller", catHome), tutti = $("[data-tutti]", catHome), tabs = $("[data-hubcat-tabs]", catHome);
    tabs.innerHTML = CFG.hub.map((h) => `<button type="button" class="chip" data-hubcat="${h.slug}">${esc(h.nome)}${h.stato === "attivo" ? "" : " · in arrivo"}</button>`).join("");
    const draw = (slug) => {
      const h = CFG.hub.find((x) => x.slug === slug); $$("[data-hubcat]", tabs).forEach((b) => { b.classList.toggle("on", b.dataset.hubcat === slug); b.setAttribute("aria-pressed", b.dataset.hubcat === slug); });
      const lista = ((CFG.catalogo && CFG.catalogo.piuScaricati[slug]) || []).map((sl) => D.find((d) => d.slug === sl)).filter(Boolean);
      box.innerHTML = lista.length ? lista.map(card).join("") : `<div class="vuoto">${esc(h.nome)} è in arrivo: le dispense nascono con chi studia lì. <a href="${h.href}"><u>Iscriviti alla lista d'attesa</u></a>.</div>`;
      tutti.href = "materiali.html#" + slug; tutti.firstChild.textContent = `Tutta la collezione di ${h.nome} `; box.scrollLeft = 0;
    };
    $$("[data-hubcat]", tabs).forEach((b) => b.addEventListener("click", () => draw(b.dataset.hubcat)));
    $$(".frecce span", catHome).forEach((f, i) => f.addEventListener("click", () => box.scrollBy({ left: (i ? 1 : -1) * box.clientWidth * 0.8, behavior: "smooth" })));
    draw(store.get("hub", "economia"));
  }
  // listino (proposta P2) · v5: card pulite (nome, prezzo, una riga, pulsante) + «Cosa c'è dentro» + «Quando conviene comprare».
  // Il contenuto dei piani NON sta nelle card: sta nella tabella di confronto (LIS.dentro in config). In home: solo card + mesi.
  // v7 · pagamento con Stripe Checkout (simulato: checkout-stripe.js). Dalla landing (in Framer: il bottone «Acquista»)
  // si paga senza account; il webhook registra l'ordine sull'email e lo studente lo trova sbloccato entrando con quella email.
  // listino · v8 (decisioni del meeting del 7/10, HQ → Decisioni): Simulazione · Dispensa completa · Pacchetto semestre (3 o 4 esami
  // del TUO percorso) · Plus (in valutazione). Prezzi comunicati come sconto di lancio: [prezzo, prezzo pieno barrato]. Niente Appunti
  // singoli, niente Pacchetto anno, niente «fuori sessione» (sono in archivio/). Il contenuto dei piani sta nella tabella «Cosa c'è dentro».
  // Pagamento con Stripe Checkout (simulato: checkout-stripe.js): dalla landing si paga senza account; lo sblocco arriva sull'email.
  const PERC = window.UL_PERCORSI;
  // v9: si paga nella web app dopo il login (risposta di Matteo, PDF landing reale cap. 9). Nella landing «Sblocca» porta all'area.
  // Il pagamento dalla landing della v8 resta per i founder nelle pagine archivio/*-v8.html (VENDE_QUI).
  const VENDE_QUI = /-v8$/.test(document.body.dataset.archiviata || "");
  const ACQ = VENDE_QUI ? "Acquista" : "Sblocca";
  const slugApp = (s) => (s === "economia_aziendale" ? "economia-aziendale" : String(s).replace(/_/g, "-").replace("contabilitá", "contabilita"));
  const paga = (voci, cosa, rotta) => VENDE_QUI && window.UL_CHECKOUT ? window.UL_CHECKOUT.apri({ voci, cosa, dove: "landing", dopo: "Vai all'area personale", onFatto: () => { location.href = APP; } }) : (location.href = APP + (rotta || "#/registrati"));
  const barr = (p) => `<s class="pz-pieno">${eur(p)}</s>`;
  const semPrezzo = (n) => LIS.prezzi.semestre[n >= 4 ? 4 : 3];
  const PIANI = () => { const P = LIS.prezzi; return [
    { id: "simulazione", tipo: "Singolo esame", nome: "Simulazione d'esame", p: P.simulazione[0], pieno: P.simulazione[1], d: "Una prova nel formato dell'appello, con correzione.", cta: ["Scegli l'esame", "materiali.html#collezione"] },
    { id: "completa", tipo: "Singolo esame", nome: "Dispensa completa", p: P.completa[0], pieno: P.completa[1], d: "Tutto per un esame: dispensa, quiz e simulazioni.", cta: ["Scegli l'esame", "materiali.html#collezione"] },
    { id: "semestre", tipo: "Pacchetto", nome: "Pacchetto semestre", p: P.semestre[3][0], pieno: P.semestre[3][1], d: `Il tuo semestre: 3 esami ${eur(P.semestre[3][0])}, 4 esami ${eur(P.semestre[4][0])}.`, top: true, cta: ["Calcola il tuo pacchetto", "materiali.html#calcola"] },
    { id: "plus", tipo: "Il metodo · in valutazione", nome: "UniLink Plus", p: P.plus, d: `Una volta per sessione. Con un pacchetto: ${eur(P.plusConPacchetto)}.`, unaTantum: true, cta: [`${ACQ} Plus`, "#dentro"], paga: true },
  ]; };
  const lancioHTML = () => `<div class="li-quando"><div><span class="eyebrow">Prezzi di lancio</span><p class="small" style="margin-top:6px">${esc(LIS.lancio)}</p></div><p class="small"><span class="badge ok">${esc(LIS.stato)}</span></p></div>`;
  const listinoHTML = (compatto) => { if (!LIS) return "";
    const card = (x) => `<div class="pz-card ${x.top ? "ev" : ""} ${x.id === "plus" ? "plus" : ""}">${x.top ? '<span class="pz-tab">Il più scelto</span>' : ""}
      <span class="pz-tipo">${x.tipo}</span><h3 class="pz-nome">${x.nome}</h3>
      <div class="pz-prezzo"><b>${eur(x.p).replace(" €", "")}</b><span>€${x.unaTantum ? " una tantum" : ""}</span></div>
      ${x.pieno ? `<span class="pz-sconto">−${Math.round((1 - x.p / x.pieno) * 100)}%</span>` : ""}
      <p class="pz-sotto">${x.pieno ? `invece di ${barr(x.pieno)} · prezzo di lancio` : x.unaTantum ? "nessun abbonamento" : ""}</p>${x.pieno ? `<span class="pz-risp">Risparmi ${eur(x.pieno - x.p)}${x.id === "semestre" ? ` (4 esami: ${eur(LIS.prezzi.semestre[4][1] - LIS.prezzi.semestre[4][0])})` : ""}</span>` : ""}
      <p class="pz-d">${x.d}</p>
      ${x.paga ? `<button type="button" class="btn btn-s" data-paga-piano="${x.id}">${x.cta[0]}</button>` : `<a class="btn ${x.top ? "btn-a" : "btn-s"}" href="${x.cta[1]}">${x.cta[0]}</a>`}</div>`;
    const P = PIANI(), D2 = LIS.dentro || [];
    const cella = (v) => v === 1 ? '<span class="ok" aria-label="incluso">✓</span>' : v === 0 ? '<span class="no" aria-label="non incluso">—</span>' : `<span class="pz-parz">${esc(v)}</span>`;
    const tabella = compatto || !D2.length ? "" : `<div class="pz-dentro" id="dentro"><div class="testa" style="margin:56px 0 22px"><div><span class="eyebrow">Le differenze</span><h2 style="margin-top:10px">Cosa c'è <span class="acc">dentro</span></h2></div><p>Le card dicono il prezzo; qui vedi cosa cambia da un piano all'altro.</p></div>
      <div class="pz-tab-wrap"><table class="pz-tabella"><thead><tr><th></th>${P.map((x) => `<th class="${x.top ? "ev" : ""}">${x.nome}<small>${eur(x.p)}</small></th>`).join("")}</tr></thead>
      <tbody>${D2.map(([gr, righe]) => `<tr class="gr"><td colspan="${P.length + 1}">${esc(gr)}</td></tr>` + righe.map(([nome, ...v]) => `<tr><th scope="row">${esc(nome)}</th>${v.map((c, k) => `<td class="${P[k].top ? "ev" : ""}">${cella(c)}</td>`).join("")}</tr>`).join("")).join("")}</tbody></table></div></div>`;
    const fee = (p) => window.UL_CHECKOUT ? window.UL_CHECKOUT.commissione(p) : Math.round((p * 0.015 + 0.25) * 100) / 100;
    const pc = (p) => (fee(p) / p * 100).toFixed(1).replace(".", ",") + "%";
    const LP = LIS.prezzi, righeFee = [["Simulazione d'esame", LP.simulazione[0]], ["Dispensa completa", LP.completa[0]], ["Pacchetto semestre · 3 esami", LP.semestre[3][0]], ["Pacchetto semestre · 4 esami", LP.semestre[4][0]], ["UniLink Plus", LP.plus], ["Plus con un pacchetto", LP.plusConPacchetto]];
    const comeSiPaga = compatto ? "" : `<div class="pz-paga" id="pagamento"><div class="testa" style="margin:56px 0 22px"><div><span class="eyebrow">Pagamento</span><h2 style="margin-top:10px">Come si <span class="acc">paga</span></h2></div><p>${VENDE_QUI ? "Un clic su «Acquista», si paga su Stripe e la dispensa è subito nella tua area." : "Crei l'account gratis, scegli cosa sbloccare e paghi nell'area personale, su Stripe."} Senza abbonamenti, senza rinnovi.</p></div>
      <ol class="pz-passi"><li><b>1</b><h3>${VENDE_QUI ? "Clicchi «Acquista»" : "Entri nell'area personale"}</h3><p>${VENDE_QUI ? "Qui sul sito o dentro l'area personale." : "Con l'account gratuito: lo crei in un minuto."}</p></li><li><b>2</b><h3>Paghi su Stripe</h3><p>Carta di credito o debito, Apple Pay, Google Pay, Klarna (3 rate). La carta non passa da noi.</p></li><li><b>3</b><h3>È già sbloccato</h3><p>Stripe ci avvisa in automatico e la dispensa compare nella tua area personale: entra con la stessa email.</p></li></ol>
      <div class="pz-metodi"><span>Visa</span><span>Mastercard</span><span>Maestro</span><span>Apple Pay</span><span>Google Pay</span><span>Klarna</span>${VENDE_QUI ? '<button type="button" class="btn btn-s" data-paga-prova>Prova il pagamento</button>' : `<a class="btn btn-s" href="${APP}#/registrati">Crea l'account gratis</a>`}</div>
      ${VENDE_QUI ? `<details class="pz-fee"><summary>Per i founder · commissioni Stripe sul listino del 7/10 (1,5% + 0,25 € a transazione, 0 € al mese)</summary>
        <div class="pz-tab-wrap"><table class="pz-tabella"><thead><tr><th>Prodotto</th><th>Prezzo</th><th>Commissione</th><th>Netto UniLink</th><th>Quota persa</th></tr></thead><tbody>${righeFee.map(([n, p]) => `<tr><th scope="row">${n}</th><td>${eur(p)}</td><td>${eur(fee(p))}</td><td>${eur(p - fee(p))}</td><td>${pc(p)}</td></tr>`).join("")}</tbody></table></div>
        <p class="small">La quota fissa pesa di più sui prezzi bassi: sulla Simulazione a ${eur(LP.simulazione[0])} se ne va il ${pc(LP.simulazione[0])}, sul pacchetto da 4 esami il ${pc(LP.semestre[4][0])}. Più esami nello stesso carrello pagano una sola quota fissa. Klarna, carte premium o aziendali e carte non UE hanno tariffe più alte (da verificare sul listino Stripe Italia).</p></details>` : ""}</div>`;
    return `<div class="pz-grid pz-4">${P.map(card).join("")}</div>${lancioHTML()}${tabella}${comeSiPaga}
      <p class="small li-n"><b>Gratis:</b> ${esc(LIS.gratis)} · <span class="badge">${esc(LIS.stato)}</span>${compatto ? ' · <a href="materiali.html#dentro"><u>Cosa c\'è dentro ogni piano</u></a>' : ""}</p>`; };
  $$("[data-listino]").forEach((el) => (el.innerHTML = listinoHTML(el.dataset.listino === "compatto")));
  $$("[data-paga-piano]").forEach((b) => (b.onclick = () => paga([{ id: "plus", nome: "UniLink Plus", nota: "fino a fine sessione · una tantum", prezzo: LIS.prezzi.plus }], "UniLink Plus su tutti i tuoi esami", "#/app/abbonamento")));
  $$("[data-paga-prova]").forEach((b) => (b.onclick = () => paga([{ id: "simulazione:microeconomia", nome: "Simulazione d'esame · Microeconomia", nota: "prezzo di lancio, invece di " + eur(LIS.prezzi.simulazione[1]), prezzo: LIS.prezzi.simulazione[0] }], "Simulazione d'esame di Microeconomia")));

  /* ---------- 4b2 · home: anteprima a numero chiuso (nota di Matteo del 7/10: al posto di «scarica gli appunti») ---------- */
  const LAN = CFG.lancio, anteRoot = $("[data-anteprima]");
  if (LAN) $$("[data-ante-ricevi]").forEach((ul) => (ul.innerHTML = LAN.ricevi.map((x) => `<li>${esc(x)}</li>`).join("")));
  if (LAN && anteRoot) {
    const fatto = (x) => { anteRoot.innerHTML = `<div class="ante-ok"><div class="ok">✓</div><h3>Sei dentro, ${esc(x.nome || "")}!</h3><p>Posto n. ${x.posto} su ${LAN.posti}. Ti scriviamo a <b style="font-weight:400">${esc(x.email)}</b> quando apre l'anteprima, con il tuo <b style="font-weight:400">codice invito personale</b>.</p><p class="small">Demo: niente email inviata, la registrazione resta solo in questo browser.</p></div>`; };
    const gia = store.get("anteprima", null);
    if (gia) fatto(gia);
    else {
      const iscritti = LAN.iscrittiDemo, rimasti = Math.max(0, LAN.posti - iscritti);
      anteRoot.innerHTML = `<form class="ante-form" novalidate>
        <div class="ante-posti"><b>${rimasti}</b> posti su ${LAN.posti}<i style="--p:${Math.round((iscritti / LAN.posti) * 100)}%"></i><span class="small">numeri di esempio</span></div>
        <div class="ante-campi"><label>Nome<input name="nome" autocomplete="given-name" required></label><label>Email<input name="email" type="email" autocomplete="email" placeholder="nome.cognome@stud.unifi.it" required></label>
          <label>Corso<select name="corso">${[["EA", "Economia Aziendale"], ["EC", "Economia e Commercio"], ["altro", "Altro corso"]].map(([v, t]) => `<option value="${v}">${t}</option>`).join("")}</select></label>
          <label>Anno<select name="anno">${["I", "II", "III", "Magistrale"].map((a) => `<option>${a}</option>`).join("")}</select></label></div>
        <label class="ante-ck"><input type="checkbox" name="privacy"> Accetto l'informativa privacy: usiamo l'email solo per l'anteprima.</label>
        <button class="btn btn-a" type="submit">${esc(LAN.cta)} <span class="freccia">→</span></button><p class="small msg" aria-live="polite"></p></form>`;
      $("form", anteRoot).addEventListener("submit", (e) => {
        e.preventDefault(); const f = e.target, msg = $(".msg", f), em = f.email.value.trim();
        if (!f.nome.value.trim()) { msg.textContent = "Scrivi il tuo nome."; return; }
        if (!/^\S+@\S+\.\S+$/.test(em)) { msg.textContent = "Scrivi un'email valida."; return; }
        if (!f.privacy.checked) { msg.textContent = "Serve il consenso privacy per scriverti."; return; }
        const x = { nome: f.nome.value.trim(), email: em, corso: f.corso.value, anno: f.anno.value, posto: iscritti + 1, quando: new Date().toISOString() };
        store.set("anteprima", x); fatto(x);
      });
    }
  }
  /* ---------- 4b3 · home: Ambassador (al posto di «Studenti, come te» con i profili dei founder, archiviati il 7/10) ---------- */
  const AMB = CFG.ambassador;
  $$("[data-ambassador]").forEach((box) => {
    if (!AMB) return;
    const es = LIS ? LIS.prezzi.completa[0] : 12.99, guad = Math.round(AMB.esempio * es * AMB.commissione) / 100;
    box.innerHTML = `<div class="amb-grid"><ol class="amb-passi">${AMB.passi.map(([t, d], i) => `<li><b>${i + 1}</b><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`).join("")}</ol>
      <div class="amb-box"><span class="eyebrow" style="color:#f0b37c">La regola · decisa il 7/10</span><div class="amb-pc"><b>${AMB.commissione}%</b><span>di ogni acquisto fatto con il tuo codice</span></div>
        <p>Esempio: ${AMB.esempio} amici prendono una dispensa completa a ${eur(es)} → ${eur(guad)} per te.</p><p class="small">${esc(AMB.nota)}</p>
        <a class="btn btn-a" href="${pagina === "ambassador" ? "#candidati" : "ambassador.html#candidati"}">${esc(AMB.cta)}</a></div></div>`;
  });
  // profili degli ambassador (v9: foto e nomi, solo con liberatoria) e candidatura (simulata: in produzione va in Supabase con anti-bot)
  $$("[data-amb-profili]").forEach((box) => {
    const P = (AMB && AMB.profili) || [];
    box.innerHTML = `<div class="amb-cards">${P.map((x) => `<article class="amb-card"><div class="amb-foto">${x.foto ? `<img src="img/${esc(x.foto)}" alt="Foto di ${esc(x.nome)}">` : `<span aria-hidden="true">${esc(x.nome[0])}</span>`}</div>
      <h3>${esc(x.nome)}</h3><p class="small">${esc(x.corso)} · ${esc(x.anno)}</p><p class="amb-frase">«${esc(x.frase)}»</p></article>`).join("")}</div>${AMB && AMB.segnaposto ? `<p class="small" style="margin-top:12px"><span class="badge">Esempio</span> ${esc(AMB.segnaposto)}</p>` : ""}`;
  });
  $$("[data-amb-form]").forEach((box) => {
    const gia = store.get("candidatura", null);
    const fatto = (x) => { box.innerHTML = `<div class="ante-ok"><div class="ok">✓</div><h3>Candidatura inviata, ${esc(x.nome)}!</h3><p>Ti scriviamo noi entro qualche giorno. Demo: niente viene inviato, resta solo in questo browser.</p></div>`; };
    if (gia) return fatto(gia);
    box.innerHTML = `<form class="ante-form" novalidate><div class="ante-campi"><label>Nome<input name="nome" autocomplete="given-name"></label><label>Email<input name="email" type="email" autocomplete="email" placeholder="nome.cognome@stud.unifi.it"></label>
      <label>Corso<select name="corso"><option>Economia Aziendale</option><option>Economia e Commercio</option><option>Giurisprudenza</option><option>Medicina</option><option>Altro</option></select></label><label>Anno<select name="anno"><option>I</option><option>II</option><option>III</option><option>Magistrale</option></select></label></div>
      <label class="ante-campi" style="grid-template-columns:1fr"><span class="small">Perché ti va? (facoltativo)</span><textarea name="perche" rows="3" maxlength="400" style="font:inherit;font-size:16px;border:1.5px solid var(--linea);border-radius:12px;padding:11px 12px;background:var(--crema)"></textarea></label>
      <label class="ante-ck"><input type="checkbox" name="privacy"> Accetto l'informativa privacy: usiamo questi dati solo per la candidatura.</label>
      <p class="small">Se vieni scelto, foto, nome e frase compaiono sul sito solo dopo che firmi la liberatoria (puoi ritirarla quando vuoi).</p>
      <button class="btn btn-a" type="submit">Invia la candidatura <span class="freccia">→</span></button><p class="small msg" aria-live="polite"></p></form>`;
    $("form", box).addEventListener("submit", (e) => { e.preventDefault(); const f = e.target, msg = $(".msg", f);
      if (!f.nome.value.trim()) { msg.textContent = "Scrivi il tuo nome."; return; }
      if (!/^\S+@\S+\.\S+$/.test(f.email.value.trim())) { msg.textContent = "Scrivi un'email valida."; return; }
      if (!f.privacy.checked) { msg.textContent = "Serve il consenso privacy."; return; }
      const x = { nome: f.nome.value.trim(), email: f.email.value.trim(), corso: f.corso.value, anno: f.anno.value, quando: new Date().toISOString() }; store.set("candidatura", x); fatto(x); });
  });
  // FAQ (H11) dalla configurazione: ogni risposta porta verso l'account o l'acquisto
  $$("[data-faq]").forEach((box) => {
    box.innerHTML = (CFG.faq || []).map(([d, r, t, h], i) => `<div class="qa ${i ? "" : "open"}"><div class="d">${esc(d)}<span>${i ? "+" : "−"}</span></div><div class="r">${esc(r)}${t ? ` <a class="faq-cta" href="${h === "@app" ? APP : h.startsWith("@app#") ? APP + h.slice(4) : esc(h)}">${esc(t)} →</a>` : ""}</div></div>`).join("");
    $$(".qa", box).forEach((q) => $(".d", q).addEventListener("click", () => { const ap = !q.classList.contains("open"); $$(".qa", box).forEach((x) => { x.classList.remove("open"); $(".d span", x).textContent = "+"; }); if (ap) { q.classList.add("open"); $(".d span", q).textContent = "−"; } }));
  });
  /* ---------- 4c · Materiali e Anteprima dell'esame ---------- */
  const SEM = { I: "I semestre", II: "II semestre" };
  const prezziEsame = (d) => { if (!LIS) return ""; if (gratisDi(d)) return `<div class="pz"><span><b>Gratis per tutti</b> · completa</span></div>`; const s = simulazioneDi(d), c = completaDi(d);
    return `<div class="pz">${s ? `<span>Simulazione <b>${eur(s[0])}</b></span>` : ""}<span>Completa <b>${eur(c[0])}</b> ${barr(c[1])}</span></div>`; };
  const matRoot = $("#mat-top");
  if (matRoot) {
    const tabs = $("[data-mat-hub]"), arrivo = $("[data-mat-arrivo]"), lista = $("[data-mat-lista]"), st = { q: "", anno: "Tutti" };
    let hub = (location.hash || "").replace("#", "") || store.get("hub", "economia"); if (!CFG.hub.find((h) => h.slug === hub)) hub = "economia";
    tabs.innerHTML = CFG.hub.map((h) => `<button type="button" class="chip" data-mh="${h.slug}">${esc(h.nome)}${h.stato === "attivo" ? "" : " · in arrivo"}</button>`).join("");
    const disegna = () => {
      const h = CFG.hub.find((x) => x.slug === hub), on = h.stato === "attivo";
      $$("[data-mh]", tabs).forEach((b) => { b.classList.toggle("on", b.dataset.mh === hub); b.setAttribute("aria-pressed", b.dataset.mh === hub); });
      arrivo.innerHTML = on ? "" : `<div class="dec-banner" style="margin-bottom:20px"><span><b>${esc(h.nome)} è in arrivo.</b> I materiali nascono con chi studia lì: il listino qui sotto è quello che varrà anche per ${esc(h.nome)}. <a href="${h.href}"><u>Iscriviti alla lista d'attesa</u></a>.</span></div>`;
      $("[data-mat-nome]").firstChild.textContent = h.nome;
      const l = on ? D.filter((d) => (st.anno === "Tutti" || d.anno === st.anno) && (!st.q || norm(d.nome).includes(norm(st.q)))) : [];
      lista.innerHTML = !on ? `<div class="vuoto">La collezione di ${esc(h.nome)} non c'è ancora. <a href="${h.href}"><u>Avvisami quando parte</u></a>.</div>`
        : l.length ? l.map((d) => `<a class="mat-card" href="preview.html?esame=${encodeURIComponent(d.slug)}"><img src="img/cop/${d.cop}" alt="" loading="lazy"><div><span class="eyebrow">${d.anno} anno · ${SEM[d.sem] || ""}</span><h3>${esc(d.nome)}</h3><p class="small">${d.tipi.join(" · ")} · ${esc(d.mod)}</p>${prezziEsame(d)}<span class="go">Anteprima →</span></div></a>`).join("")
        : `<div class="vuoto">Nessun esame trovato per "${esc(st.q)}". <a href="${WA}" target="_blank" rel="noopener"><u>Chiedi questo esame</u></a>: è un dato su cosa manca.</div>`;
    };
    $$("[data-mh]", tabs).forEach((b) => b.addEventListener("click", () => { hub = b.dataset.mh; store.set("hub", hub); history.replaceState(null, "", "#" + hub); disegna(); }));
    const inp = $("[data-mat-cerca] input"); inp.addEventListener("input", () => { st.q = inp.value.trim(); disegna(); });
    $("[data-mat-cerca]").addEventListener("submit", (e) => { e.preventDefault(); st.q = inp.value.trim(); disegna(); });
    $$("[data-mat-anni] .chip").forEach((c) => c.addEventListener("click", () => { $$("[data-mat-anni] .chip").forEach((x) => x.classList.remove("on")); c.classList.add("on"); st.anno = c.dataset.anno; disegna(); }));
    // calcolatore del pacchetto semestre per PERCORSO (commento S15 di Matteo): corso → anno → curriculum → semestre; si vede quali
    // dispense sono incluse e il prezzo dipende da quante sono (3 → 29,99 · 4 → 34,99). Con più di 4 esami si scelgono i 4 del
    // proprio piano di studi; con meno di 3 il pacchetto non c'è (conviene la dispensa singola). Dati: percorsi.js (catalogo UniFi).
    const cal = $("[data-calcola]");
    if (cal && LIS && PERC) {
      const MAX = LIS.maxEsamiPacchetto || 4, sc = { cds: "EA", curr: "", anno: "I", sem: "I", plus: false, scelti: null, extra: [] };
      const N = { I: 1, II: 2, III: 3 };
      const draw = () => {
        const anno = D.filter((d) => d.anno === sc.anno), curricula = Object.entries(PERC.corsi[sc.cds].curricula);
        const serveCurr = PERC.serveCurriculum(anno, sc.cds); if (serveCurr && !sc.curr) sc.curr = curricula[0][0];
        // v10 (commento S15.1): oltre agli esami del percorso si possono aggiungere esami A SCELTA dello stesso anno e semestre
        const base = anno.filter((d) => d.sem === sc.sem && PERC.include(d.codice, sc.cds, serveCurr ? sc.curr : ""));
        const altri = anno.filter((d) => d.sem === sc.sem && !base.includes(d));
        const tutti = base.concat(altri.filter((d) => sc.extra.includes(d.slug)));
        if (!sc.scelti || sc.scelti.some((s) => !tutti.find((d) => d.slug === s))) sc.scelti = tutti.slice(0, MAX).map((d) => d.slug);
        const presi = tutti.filter((d) => sc.scelti.includes(d.slug)), n = presi.length;
        const singoli = presi.reduce((t, d) => t + (gratisDi(d) ? 0 : completaDi(d)[0]), 0), pac = n >= 3 ? semPrezzo(n) : null;
        const totS = singoli + (sc.plus ? LIS.prezzi.plus : 0), totP = pac ? pac[0] + (sc.plus ? LIS.prezzi.plusConPacchetto : 0) : null;
        const pct = (x) => Math.max(6, Math.round((x / Math.max(totS, totP || 0, 1)) * 100));
        const nomeCurr = serveCurr ? " · " + PERC.nomeCurr(sc.cds, sc.curr) : "", per = `${sc.anno} anno, ${sc.sem} semestre · ${PERC.corsi[sc.cds].nome}${nomeCurr}`;
        let tit, txt, forte = false;
        if (tutti.length < 3) { tit = tutti.length ? "Qui il pacchetto non c'è" : "Nessuna dispensa per questo semestre"; txt = tutti.length ? `Nel tuo percorso questo semestre ha ${tutti.length === 1 ? "una sola dispensa" : "due dispense"}: prendile singole a ${eur(LIS.prezzi.completa[0])} l'una.` : "Prova un altro semestre o un altro curriculum."; }
        else if (n < 3) { tit = "Scegli almeno 3 esami"; txt = `Il pacchetto parte da 3 esami (${eur(semPrezzo(3)[0])}). Con meno conviene la dispensa singola a ${eur(LIS.prezzi.completa[0])}.`; }
        else if (totP <= totS) { forte = true; tit = `Prendi il pacchetto: risparmi ${eur(totS - totP)}`; txt = `Le ${n} dispense complete del tuo semestre a ${eur(pac[0])} invece di ${eur(singoli)} comprate una per una.`; }
        else { tit = "Qui ti convengono le singole"; txt = `Una delle dispense è già gratis per tutti (${esc(presi.find(gratisDi)?.nome || "")}): le altre costano ${eur(singoli)}.`; }
        const seg = (k, v, t, on) => `<button type="button" data-${k}="${v}" class="${on ? "on" : ""}" aria-pressed="${on}">${t}</button>`;
        cal.innerHTML = `<div class="calc-sel">
            <div class="tl-l">Corso di laurea</div><div class="seg-cal">${Object.entries(PERC.corsi).map(([k, x]) => seg("cc", k, x.nome, k === sc.cds)).join("")}</div>
            <div class="tl-l">Anno</div><div class="seg-cal">${["I", "II", "III"].map((a) => seg("ca", a, a + " anno", a === sc.anno)).join("")}</div>
            ${serveCurr ? `<div class="tl-l">Curriculum</div><div class="seg-cal">${curricula.map(([k, nm]) => seg("cu", k, nm, k === sc.curr)).join("")}</div>` : ""}
            <div class="tl-l">Semestre</div><div class="seg-cal">${[["I", "I semestre"], ["II", "II semestre"]].map(([v, t]) => seg("cs", v, t, v === sc.sem)).join("")}</div>
            <div class="tl-l">Le dispense incluse${tutti.length > MAX ? ` · il semestre ne ha ${tutti.length}: scegli le ${MAX} del tuo piano di studi` : ""}</div>
            ${altri.length ? `<div class="calc-scelta"><label class="small" for="calc-extra">Hai un esame a scelta?</label><select id="calc-extra" data-extra><option value="">Aggiungi un esame a scelta del ${sc.anno} anno…</option>${altri.filter((d) => !sc.extra.includes(d.slug)).map((d) => `<option value="${d.slug}">${esc(d.nome)}</option>`).join("")}</select></div>` : ""}
            <ul class="calc-esami">${tutti.map((d) => { const on = sc.scelti.includes(d.slug); return `<li class="${on ? "" : "off"}"><span class="n">${esc(d.nome)}${sc.extra.includes(d.slug) ? '<span class="tag-scelta">a scelta</span>' : ""}<small>${esc(d.codice)}${gratisDi(d) ? " · gratis per tutti" : ""}</small></span>
              <span class="seg-mini">${seg("ce", d.slug, on ? "✓ Inclusa" : "Aggiungi", on)}</span><b>${gratisDi(d) ? "0 €" : eur(completaDi(d)[0])}</b></li>`; }).join("") || '<li class="off"><span class="n">Nessuna dispensa per questo semestre</span></li>'}</ul>
            <p class="small" style="margin:8px 0 0">${esc(PERC.fonte)}. Gli esami del III anno spesso sono a scelta: controlla il tuo piano di studi.</p>
            <label class="calc-plus"><input type="checkbox" data-cp ${sc.plus ? "checked" : ""}> Aggiungi UniLink Plus</label>
          </div>
          <div class="calc-out">
            <div class="calc-conf">
              <div class="cc-r"><span>Una per una · ${n} ${n === 1 ? "dispensa" : "dispense"}${sc.plus ? " + Plus" : ""}</span><b>${eur(totS)}</b></div><div class="cc-bar"><i style="width:${pct(totS)}%"></i></div>
              ${pac ? `<div class="cc-r ev"><span>Pacchetto semestre · ${n} esami ${barr(pac[1])}${sc.plus ? " + Plus" : ""}</span><b>${eur(totP)}</b></div><div class="cc-bar ev"><i style="width:${pct(totP)}%"></i></div>` : ""}
            </div>
            <div class="calc-cons ${forte ? "forte" : ""}"><span class="eyebrow">Il nostro consiglio</span><h3>${tit}</h3><p>${txt}</p></div>
            ${pac ? `<button type="button" class="btn ${forte ? "btn-a" : "btn-p"}" data-cpaga="pac" style="justify-content:center">${ACQ} il pacchetto · ${eur(totP)}</button>` : ""}
            ${n ? `<button type="button" class="btn btn-s" data-cpaga="sing" style="justify-content:center">${pac ? "oppure le singole" : ACQ + " le singole"} · ${eur(totS)}</button>` : ""}
            <p class="small">${esc(per)} · ${esc(LIS.stato)}. ${VENDE_QUI ? "Si paga con Stripe, tutto in un solo pagamento (simulato nella demo)." : "Si paga nell'area personale, con l'account gratuito."}</p>
          </div>`;
        const on = (sel, fn) => $$(sel, cal).forEach((b) => (b.onclick = () => { fn(b); draw(); }));
        on("[data-cc]", (b) => { sc.cds = b.dataset.cc; sc.curr = ""; sc.scelti = null; sc.extra = []; }); on("[data-cu]", (b) => { sc.curr = b.dataset.cu; sc.scelti = null; sc.extra = []; });
        on("[data-ca]", (b) => { sc.anno = b.dataset.ca; sc.scelti = null; sc.extra = []; }); on("[data-cs]", (b) => { sc.sem = b.dataset.cs; sc.scelti = null; sc.extra = []; });
        const ex = $("[data-extra]", cal); ex && (ex.onchange = () => { if (!ex.value) return; sc.extra.push(ex.value); if (sc.scelti.length < MAX) sc.scelti.push(ex.value); else toast(`Il pacchetto ha al massimo ${MAX} esami: togline uno per includere quello a scelta`); draw(); });
        on("[data-ce]", (b) => { const s = b.dataset.ce; if (sc.scelti.includes(s)) sc.scelti = sc.scelti.filter((x) => x !== s); else if (sc.scelti.length < MAX) sc.scelti.push(s); else toast(`Al massimo ${MAX} esami per pacchetto: togline uno`); });
        $("[data-cp]", cal).onchange = (e) => { sc.plus = e.target.checked; draw(); };
        const vociPac = pac ? [{ id: "pacchetto:" + sc.cds + (sc.curr || "") + N[sc.anno] + sc.sem, nome: "Pacchetto semestre · " + per, nota: presi.map((d) => d.nome).join(", "), prezzo: pac[0] }].concat(sc.plus ? [{ id: "plus", nome: "UniLink Plus", nota: "con un pacchetto", prezzo: LIS.prezzi.plusConPacchetto }] : []) : [];
        const vociSing = presi.filter((d) => !gratisDi(d)).map((d) => ({ id: "completa:" + d.slug, nome: "Dispensa completa · " + d.nome, nota: "prezzo di lancio", prezzo: completaDi(d)[0] })).concat(sc.plus ? [{ id: "plus", nome: "UniLink Plus", nota: "fino a fine sessione", prezzo: LIS.prezzi.plus }] : []);
        $$("[data-cpaga]", cal).forEach((b) => (b.onclick = () => b.dataset.cpaga === "pac" ? paga(vociPac, "Pacchetto semestre (" + per + ")", "#/app/abbonamento/calcola") : vociSing.length ? paga(vociSing, presi.map((d) => d.nome).join(", "), "#/app/materiali/catalogo") : toast("Queste dispense le hai già gratis")));
      };
      draw();
    }
    disegna();
  }
  const prevRoot = $("[data-preview]");
  if (prevRoot) {
    const slug = new URLSearchParams(location.search).get("esame"), d = D.find((x) => x.slug === slug) || D[0], A = CFG.anteprima || {}, arg = (A.argomenti || {})[d.slug], IND = (A.indice || {})[d.slug];
    const c = completaDi(d), s = simulazioneDi(d), free = gratisDi(d), stessi = D.filter((x) => x.anno === d.anno && x.sem === d.sem && PERC && (PERC.esami[x.codice] || []).some((p) => (PERC.esami[d.codice] || []).some((q) => q.split("-")[0] === p.split("-")[0])));
    document.title = `UniLink · Anteprima di ${d.nome}`;
    // indice completo: capitoli della dispensa raggruppati per i moduli del programma ufficiale UniFi (config.js → anteprima.indice)
    const indice = IND ? `<p class="small" style="margin:-4px 0 12px">${esc(IND.fonte)}</p>${IND.moduli.map((m, i) => `<details class="prev-mod" ${i ? "" : "open"}><summary><span class="eyebrow">Modulo ${i + 1} del programma UniFi</span><b>${esc(m.titolo)}</b><span class="small">${m.capitoli.length} ${m.capitoli.length === 1 ? "capitolo" : "capitoli"}</span></summary>
        <ol class="prev-ind" start="${m.capitoli[0].n}">${m.capitoli.map((k) => `<li value="${k.n}"><b>${esc(k.titolo)}</b><ul>${k.sezioni.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></li>`).join("")}</ol></details>`).join("")}
        <div class="prev-cop2"><span class="eyebrow">Copertura del programma ufficiale</span><ul>${IND.copertura.map(([p, cap]) => `<li><span>${esc(p)}</span><b>${esc(cap)}</b></li>`).join("")}</ul><p class="small">${esc(IND.nota)}</p></div>`
      : arg ? `<ol class="prev-ind">${arg.map((a) => `<li>${esc(a)}</li>`).join("")}</ol><p class="small">Argomenti della banca di quiz di esempio. In produzione qui c'è l'indice vero della dispensa, capitolo per capitolo.</p>`
      : `<p class="small prev-vuoto">L'indice completo si legge dalla dispensa: in produzione appare qui, capitolo per capitolo, prima di comprare.</p>`;
    const leggi = APP + "#/app/leggi/" + slugApp(d.slug);
    prevRoot.innerHTML = `<div class="prev">
      <div class="prev-cop"><img src="img/cop/${d.cop}" alt="Copertina della dispensa di ${esc(d.nome)}">${free ? '<span class="badge on prev-free">Gratis per tutti</span>' : ""}</div>
      <div class="prev-main"><span class="eyebrow">${d.anno} anno · ${SEM[d.sem] || ""} · ${esc(d.codice)}</span><h1 class="h2" style="margin:8px 0 10px">${esc(d.nome)}</h1>
        <div class="chips" style="margin:0 0 18px">${d.tipi.map((t) => `<span class="chip on">${t}</span>`).join("")}<span class="chip">${esc(d.mod)}</span></div>
        <h2 class="prev-h">Indice${IND ? " completo" : ""}</h2>${indice}
        <h2 class="prev-h">Perché la dispensa UniLink</h2><ul class="prev-ok">${(A.perche || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <h2 class="prev-h">Tips per passare l'esame</h2>
        <div class="prev-lock"><ul>${(A.tips || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul><div class="prev-lock-v"><p>Le tips su prof ed esame sono per chi ha l'account.</p><a class="btn btn-a" href="${APP}">Accedi per scoprirle</a></div></div>
      </div>
      <aside class="prev-buy"><h2 class="li-h">Studia ${esc(d.nome)}</h2>
        ${!LIS ? "" : free ? `<div class="li-card ev"><div class="r"><span>Dispensa completa</span><b>Gratis</b></div><span class="small">${esc(LIS.gratisNota)}</span></div>
          <a class="btn btn-a" href="${leggi}" style="justify-content:center">Leggila nell'area personale</a><p class="small">Si legge e si annota nell'area personale: non si scarica.</p>`
        : `${s ? `<div class="li-card"><div class="r"><span>Simulazione d'esame</span><b>${eur(s[0])}</b></div><span class="small">invece di ${barr(s[1])} · prezzo di lancio</span></div>` : `<p class="small">La simulazione d'esame per questo esame è in preparazione.</p>`}
        <div class="li-card ev"><div class="r"><span>Dispensa completa</span><b>${eur(c[0])}</b></div><span class="small">invece di ${barr(c[1])} · dispensa, quiz e simulazioni</span></div>
        ${stessi.length >= 3 ? `<div class="li-card"><div class="r"><span>Nel pacchetto semestre</span><b>${eur(semPrezzo(3)[0])}</b></div><span class="small">3 esami del tuo percorso, ${eur(semPrezzo(4)[0])} con 4 · <a href="materiali.html#calcola"><u>calcola il tuo</u></a></span></div>` : ""}
        ${s ? `<button type="button" class="btn btn-s" data-pv-paga="simulazione" style="justify-content:center">${ACQ} la Simulazione · ${eur(s[0])}</button>` : ""}<button type="button" class="btn btn-a" data-pv-paga="completa" style="justify-content:center;margin-top:8px">${ACQ} la Completa · ${eur(c[0])}</button>
        <p class="small">Si legge e si annota nell'area personale: non si scarica. ${VENDE_QUI ? "Paghi con carta, Apple Pay, Google Pay o Klarna su Stripe." : "Si paga nell'area personale (Stripe), con l'account gratuito."}</p><p class="small">${esc(LIS.gratis)}</p><span class="badge">${esc(LIS.stato)}</span>`}
      </aside></div>`;
    $$("[data-pv-paga]", prevRoot).forEach((b) => (b.onclick = () => { const k = b.dataset.pvPaga, nome = (k === "completa" ? "Dispensa completa" : "Simulazione d'esame") + " · " + d.nome;
      paga([{ id: k + ":" + d.slug, nome, nota: "prezzo di lancio", prezzo: (k === "completa" ? c : s)[0] }], nome, "#/app/scheda/" + slugApp(d.slug)); }));
  }

  // link verso l'accesso alla web app (H06b, H12): data-app="#/rotta" o vuoto
  $$("[data-app]").forEach((a) => (a.href = APP + (a.dataset.app || "")));

  /* ---------- 4d · Planner: esempio solo da guardare (P3), dati in CFG.planner ---------- */
  const PL = CFG.planner, plRoot = $("[data-planner]");
  if (PL && plRoot) {
    const caps = (CFG.anteprima?.argomenti || {})[PL.esame] || [];
    const st = { fascia: PL.fascia, vista: "variabili" };
    const VISTE = [["variabili", "Variabili"], ["percorso", "Percorso"], ["calendario", "Calendario"], ["dafare", "Da fare"], ["completate", "Completate"]];
    const n1 = (x) => x.toLocaleString("it-IT", { maximumFractionDigits: 1 });
    const fx = () => PL.fasce.find((f) => f.id === st.fascia) || PL.fasce[0];
    const utili = PL.giorni * PL.oreNette * (1 - PL.margine);
    const perFase = (tot) => { const r = PL.fasi.map(([, q]) => Math.round(tot * q)); r[r.length - 1] += tot - r.reduce((a, b) => a + b, 0); return r; };
    const alGiorno = Math.floor((PL.oreNette * 60) / PL.minuti);
    const TIPI = { Lezione: "t-lez", Esercizi: "t-ese", Ripasso: "t-rip", Simulazione: "t-sim", "Simulazione breve": "t-sim" };
    const ESITO = { "Da rivedere": "no", "Così così": "mid", Sicuro: "ok" };
    const bar = (p) => `<div class="pl-bar"><i style="width:${Math.max(0, Math.min(100, p))}%"></i></div>`;

    const indicatore = () => {
      const f = fx(), serve = (f.sessioni * PL.minuti) / 60, diff = utili - serve, ok = diff >= 0;
      return `<div class="pl-ind ${ok ? "ok" : "no"}"><span class="g-k">Ci stai nei tempi?</span><b>${ok ? `Sì, con ${n1(diff)} h di margine` : `No: mancano ${n1(-diff)} h`}</b>${bar((serve / utili) * 100)}
        <p>Servono <b>${n1(serve)} h</b> (${f.sessioni} sessioni da ${PL.minuti}′). Hai <b>${n1(utili)} h</b> utili: ${PL.giorni} giorni × ${n1(PL.oreNette)} h nette, meno il ${Math.round(PL.margine * 100)}% di margine per gli imprevisti.</p>
        ${ok ? "" : "<p>Aggiungi giorni o ore, oppure scegli una fascia più bassa.</p>"}</div>`;
    };
    const V = {
      variabili: () => `<div class="pl-2">
        <div><dl class="pl-var">${[["Esame", `${PL.nome} · ${PL.cfu} CFU`], ["Appello", PL.appello], ["Gruppo d'esame", PL.gruppo], ["Giorni di studio", `${PL.giorni} · riposo la ${PL.riposo}`], ["Ore nette al giorno", `${n1(PL.oreNette)} h · ${alGiorno} sessioni`], ["Margine", `${Math.round(PL.margine * 100)}%`]].map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
          <span class="g-k" style="margin-top:18px">Obiettivo di voto</span>
          <div class="pl-fasce" role="radiogroup" aria-label="Fascia di voto">${PL.fasce.map((f) => `<button type="button" role="radio" aria-checked="${f.id === st.fascia}" data-fascia="${f.id}" class="${f.id === st.fascia ? "on" : ""}"><b>${esc(f.nome)}</b><span>${esc(f.voto)}</span><small>${f.sessioni} sessioni</small></button>`).join("")}</div>
          <p class="pl-cosa">${esc(fx().cosa)}</p><p class="pl-disc">${esc(PL.disclaimer)}</p></div>
        <div>${indicatore()}</div></div>`,
      percorso: () => {
        const f = fx(), pf = perFase(f.sessioni); let resto = PL.fatte; let corrente = -1;
        const righe = PL.fasi.map(([nome], i) => { const fatte = Math.min(resto, pf[i]); resto -= fatte; if (corrente < 0 && fatte < pf[i]) corrente = i;
          return `<li class="${fatte === pf[i] ? "fatta" : i === corrente ? "ora" : ""}"><span class="pl-fn">${i + 1}</span><div><b>${esc(nome)}</b>${i === corrente ? ' <span class="badge" style="font-size:11px;padding:2px 8px">in corso</span>' : ""}${bar((fatte / pf[i]) * 100)}<small>${fatte}/${pf[i]} sessioni</small></div></li>`; }).join("");
        return `<div class="pl-2"><ol class="pl-fasi">${righe}</ol><div class="pl-stat">
          <div><span class="g-k">Sessioni fatte</span><b>${Math.min(PL.fatte, f.sessioni)}/${f.sessioni}</b></div>
          <div><span class="g-k">Ore studiate</span><b>${n1((Math.min(PL.fatte, f.sessioni) * PL.minuti) / 60)} h</b></div>
          <div class="pl-wide"><span class="g-k">Rispetto al piano</span><b>1 sessione indietro</b><small>Il piano non si ricalcola da solo: puoi rigenerarlo tu.</small></div>
          <div class="pl-next"><span class="g-k">Prossima sessione</span><b>${esc(PL.oggi[0][0])} · ${esc(PL.oggi[0][1])}</b></div></div></div>`;
      },
      calendario: () => {
        const G = ["lun", "mar", "mer", "gio", "ven", "sab", "dom"], seq = ["Lezione", "Esercizi", "Ripasso"];
        const celle = Array.from({ length: 14 }, (_, d) => {
          const g = G[d % 7], num = 14 + d, oggi = d === 3;
          if (g === "dom") return `<div class="pl-day riposo"><span>${g} ${num}</span><em>riposo</em></div>`;
          const bl = Array.from({ length: alGiorno }, (_, k) => (g === "sab" && k === 0 ? "Simulazione" : seq[(d + k) % 3]));
          return `<div class="pl-day${oggi ? " oggi" : ""}${d < 3 ? " passato" : ""}"><span>${g} ${num}${oggi ? " · oggi" : ""}</span>${bl.map((t) => `<i class="${TIPI[t]}" title="${t}">${t}</i>`).join("")}</div>`;
        }).join("");
        return `<div class="pl-cal-h"><b>Dicembre · settimane 3 e 4</b><span class="pl-leg">${["Lezione", "Esercizi", "Ripasso", "Simulazione"].map((t) => `<i class="${TIPI[t]}"></i>${t}`).join("")}</span></div>
          <div class="pl-cal">${G.map((g) => `<span class="pl-gh">${g}</span>`).join("")}${celle}</div>
          <p class="small" style="margin-top:10px">Le sessioni sono fissate alla creazione del piano: il calendario non si riorganizza da solo.</p>`;
      },
      dafare: () => `<div class="pl-2"><div><span class="g-k">Oggi · ${PL.oggi.length} sessioni da ${PL.minuti}′</span>
          <ul class="pl-task">${PL.oggi.map(([t, d], i) => `<li class="${i === 0 ? "ora" : ""}"><i class="${TIPI[t]}"></i><div><b>${esc(t)}</b><small>${esc(d)}</small></div><span>${i === 0 ? "Inizia →" : PL.minuti + "′"}</span></li>`).join("")}</ul></div>
        <div><span class="g-k">Questa settimana</span><div class="pl-sett"><b>7/15</b> sessioni${bar((7 / 15) * 100)}</div>
          <span class="g-k" style="margin-top:16px">Capitoli dell'esame</span><ol class="pl-caps">${caps.map((c, i) => `<li class="${i < 2 ? "fatto" : i === 2 ? "ora" : ""}">${esc(c)}</li>`).join("")}</ol></div></div>`,
      completate: () => `<div class="pl-2"><ul class="pl-task fatte">${PL.completate.map(([t, c, e, err, q]) => `<li><i class="${TIPI[t]}"></i><div><b>${esc(t)} · ${esc(c)}</b><small>${esc(q)}${err ? ` · ${err} errori nel registro` : ""}</small></div><span class="pl-esito ${ESITO[e]}">${esc(e)}</span></li>`).join("")}</ul>
        <div><span class="g-k">Dopo ogni test</span><p class="small" style="margin:6px 0 12px">Segni com'è andata: «Da rivedere», «Così così», «Sicuro». Gli errori finiscono nel registro e tornano nei ripassi.</p>
          <div class="pl-stat"><div><span class="g-k">Errori nel registro</span><b>${PL.completate.reduce((a, x) => a + x[3], 0)}</b></div><div><span class="g-k">Capitoli sicuri</span><b>1 di ${caps.length}</b></div></div></div></div>`,
    };
    const disegnaPl = () => {
      plRoot.innerHTML = `<div class="pl-top"><div><span class="badge">${esc(PL.stato)}</span><h3>UniLink Planner · ${esc(PL.nome)}</h3></div>
          <div class="pl-tabs" role="tablist" aria-label="Sezioni del planner">${VISTE.map(([id, t]) => `<button type="button" role="tab" aria-selected="${id === st.vista}" data-vista="${id}" class="${id === st.vista ? "on" : ""}">${t}</button>`).join("")}</div></div>
        <div class="pl-body" role="tabpanel">${V[st.vista]()}</div>
        <div class="pl-foot"><p>Il piano si calcola una volta, sui tuoi giorni e sulle tue ore. Nell'area personale lo crei per ogni esame (serve la dispensa Completa o Plus).</p><a class="btn btn-a" href="${APP}">Crea il tuo piano <span class="freccia">→</span></a></div>`;
    };
    plRoot.addEventListener("click", (e) => {
      const v = e.target.closest("[data-vista]"), f = e.target.closest("[data-fascia]");
      if (v) st.vista = v.dataset.vista; else if (f) st.fascia = f.dataset.fascia; else return;
      disegnaPl(); (v ? $(`[data-vista="${st.vista}"]`, plRoot) : $(`[data-fascia="${st.fascia}"]`, plRoot))?.focus();
    });
    disegnaPl();
  }

  /* ---------- 5 · strumenti ----------
     v9 (risposte di Matteo + PDF «Architettura della landing reale», cap. 8): nella landing gli strumenti sono una VETRINA
     (cosa ti dice, quanto ci metti, un risultato d'esempio, la fonte della regola, numeri veri solo sopra una soglia) e si usano
     solo nella web app con l'account gratuito («Usalo gratis»). La versione funzionante della v8 resta per i founder:
     archivio/tools-v8.html e archivio/index-v8.html (body data-archiviata «…-v8») e nelle schede «Da decidere». */
  const FUNZIONANTI = /-v8$/.test(document.body.dataset.archiviata || "") || pagina === "decidere";
  if (/-v8$/.test(document.body.dataset.archiviata || "")) window.UL_TOOLS_TUTTI = true; // le pagine v8 mostrano anche gli strumenti archiviati
  const VT = CFG.vetrina || {};
  const usaloHref = (id) => APP + "#/app/strumenti/" + id;
  const metrica = (v) => (v && v.metrica && v.metrica.valore != null && v.metrica.valore >= (VT.soglia || 50) ? `<p class="vt-num"><b>${esc(String(v.metrica.valore))}</b> ${esc(v.metrica.testo)}</p>` : "");
  const vetrinaCard = (t, ricco) => { const v = (VT.tools || {})[t.id] || {};
    return `<article class="vt-card"><div class="vt-top"><span class="ico">${esc(t.icona)}</span><div><h3>${esc(t.nome)}</h3><p class="small">${esc(v.domanda || t.desc)}</p></div></div>
      ${ricco ? `<div class="vt-es"><span class="badge">Esempio</span><p>${esc(v.esempio || "")}</p></div>` : ""}
      <div class="vt-piede"><span class="small">⏱ ${esc(v.tempo || "1 minuto")}${t.stato === "demo" ? " · regole da verificare" : ""}</span>${metrica(v)}</div>
      ${ricco && v.fonte ? `<p class="vt-fonte">Fonte: ${esc(v.fonte)}</p>` : ""}
      <a class="btn ${ricco ? "btn-a" : "btn-s"}" href="${usaloHref(t.id)}">Usalo gratis <span class="freccia">→</span></a></article>`; };
  $$("[data-toolshell]").forEach((root) => {
    const limit = +root.dataset.limit || 99;
    let hub = root.dataset.hub || "economia", sel = (location.hash || "").replace("#", "");
    const lista = $(".tlist", root), pan = $(".tpanel", root);
    if (!FUNZIONANTI) {
      // VETRINA: in home 4 card compatte, nella pagina Strumenti tutte le card dell'hub, ricche
      const ricco = pagina === "tools";
      const drawV = () => {
        const ids = root.dataset.ids ? root.dataset.ids.split(",") : null;
        let l = ids ? ids.map((i) => ULTools.trova(i)).filter(Boolean) : ULTools.lista(hub).slice(0, limit), ar = []; // v10: «Erasmus completo» e «Media completa» sono dentro i 4 strumenti
        if (l.some((t) => t.id === "voto")) l = l.filter((t) => t.id !== "voto-cdl"); // un solo «Voto di laurea» per hub
        root.className = "vt-grid" + (ricco ? " ricco" : "");
        root.innerHTML = l.map((t) => vetrinaCard(t, ricco)).join("") + ar.map((t) => `<article class="vt-card area"><div class="vt-top"><span class="ico">${esc(t.icona)}</span><div><h3>${esc(t.nome)}</h3><p class="small">${esc(t.desc)}</p></div></div><a class="btn btn-s" href="${APP}${t.href || ""}">Nell'area personale →</a></article>`).join("");
      };
      const tabs = $("#hubtabs");
      tabs && $$("span", tabs).forEach((s) => s.addEventListener("click", () => { $$("span", tabs).forEach((x) => x.classList.remove("on")); s.classList.add("on"); hub = s.dataset.hub; drawV(); }));
      drawV(); return;
    }
    const draw = () => {
      const ids = root.dataset.ids ? root.dataset.ids.split(",") : null;
      const l = ids ? ids.map((i) => ULTools.trova(i)).filter(Boolean) : ULTools.lista(hub).slice(0, limit), ar = root.dataset.limit || ids ? [] : ULTools.area(hub);
      if (!l.find((t) => t.id === sel)) sel = l[0] && l[0].id;
      lista.innerHTML = l.map((t) => `<div class="tool ${t.id === sel ? "sel" : ""}" data-id="${t.id}" tabindex="0" role="button"><div class="ico">${esc(t.icona)}</div><div><h3 aria-level="${pagina === "tools" ? 2 : 3}">${esc(t.nome)}${t.stato === "demo" ? ' <span class="badge" style="font-size:11px;padding:2px 8px;margin-left:4px">Esempio</span>' : ""}</h3><p>${esc(t.desc)}</p></div><span class="go">→</span></div>`).join("")
        + ar.map((t) => `<a class="tool lock" href="${APP}${t.href || ""}"><div class="ico">${esc(t.icona)}</div><div><h3 aria-level="${pagina === "tools" ? 2 : 3}">${esc(t.nome)} <span class="badge on" style="font-size:11px;padding:2px 8px;margin-left:4px">Nell'area</span></h3><p>${esc(t.desc)}</p></div><span class="go">↗</span></a>`).join("");
      const t = ULTools.trova(sel);
      pan.innerHTML = t ? `<span class="eyebrow">Provalo qui${root.dataset.ids ? " · per tutti i corsi" : " · " + esc(window.UL_HUB_NOMI[hub] || "")}</span><h3 style="margin:6px 0 16px">${esc(t.nome)}</h3><div class="tl-mount"></div>` : `<p class="small">Per questo hub gli strumenti arrivano con l'hub.</p>`;
      if (t) ULTools.monta($(".tl-mount", pan), t.id);
      $$(".tool[data-id]", lista).forEach((x) => { const go = () => { sel = x.dataset.id; history.replaceState(null, "", "#" + sel); draw(); }; x.addEventListener("click", go); x.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); }); });
    };
    const tabs = $("#hubtabs");
    tabs && $$("span", tabs).forEach((s) => s.addEventListener("click", () => { $$("span", tabs).forEach((x) => x.classList.remove("on")); s.classList.add("on"); hub = s.dataset.hub; sel = ""; draw(); }));
    if (tabs && sel) { const t = ULTools.trova(sel); if (t && !t.hub.includes("tutti") && !t.hub.includes(hub)) { hub = t.hub[0]; $$("span", tabs).forEach((x) => x.classList.toggle("on", x.dataset.hub === hub)); } }
    draw();
  });
  $$("[data-tool]").forEach((el) => ULTools.monta(el, el.dataset.tool));

  /* ---------- 6 · area personale: schermate reali della web app (immagini, solo da guardare) ---------- */
  const DIM = { desk: [1280, 900, 1000, "Desktop"], tab: [820, 1080, 520, "Tablet"], ph: [780, 1560, 270, "Telefono"] };
  const lightbox = (src, alt, gruppo, i) => {
    const old = $(".lbx"); old && old.remove();
    document.body.insertAdjacentHTML("beforeend", `<div class="lbx" role="dialog" aria-modal="true" aria-label="Schermata ingrandita"><button type="button" class="lbx-x" aria-label="Chiudi">✕</button><img src="${esc(src)}" alt="${esc(alt)}"></div>`);
    const box = $(".lbx"), chiudi = () => { box.remove(); document.removeEventListener("keydown", key); }, key = (e) => { if (e.key === "Escape") chiudi(); };
    box.addEventListener("click", chiudi); document.addEventListener("keydown", key); $(".lbx-x", box).focus();
  };
  const gal = $("[data-gallery]");
  if (gal) {
    const G = CFG.schermate, q = new URLSearchParams(location.search);
    const st = { dev: DIM[q.get("dev")] ? q.get("dev") : "desk", id: (location.hash || "").slice(1) };
    if (!G.lista.find((s) => s.id === st.id)) st.id = G.lista[0].id;
    const cur = () => G.lista.find((s) => s.id === st.id);
    const draw = () => {
      const s = cur(), gr = s.gruppo, dd = DIM[st.dev];
      $("[data-galgruppi]", gal).innerHTML = G.gruppi.map((g) => `<button type="button" role="tab" aria-selected="${g.id === gr}" data-g="${g.id}" class="${g.id === gr ? "on" : ""}">${esc(g.nome)}<small>${esc(g.quando)}</small></button>`).join("");
      $("[data-galdev]", gal).innerHTML = Object.entries(DIM).map(([k, v]) => `<button type="button" aria-pressed="${k === st.dev}" data-d="${k}" class="${k === st.dev ? "on" : ""}">${v[3]}</button>`).join("");
      $("[data-gallist]", gal).innerHTML = G.lista.filter((x) => x.gruppo === gr).map((x) => `<button type="button" class="${x.id === st.id ? "sel" : ""}" aria-current="${x.id === st.id}" data-s="${x.id}"><b>${esc(x.titolo)}</b><span>${esc(x.account)}</span></button>`).join("");
      const sh = $("[data-galshell]", gal), im = $("img", sh);
      sh.className = "devshell " + st.dev; sh.style.width = "min(" + dd[2] + "px, 100%)"; im.width = dd[0]; im.height = dd[1];
      im.src = `img/app/${s.id}-${st.dev}.webp`; im.alt = `Schermata «${s.titolo}» della web app, formato ${dd[3].toLowerCase()}. ${s.nota}`;
      $("[data-galtitolo]", gal).textContent = s.titolo; $("[data-galacc]", gal).textContent = "Account demo: " + s.account; $("[data-galnota]", gal).textContent = s.nota;
      history.replaceState(null, "", location.pathname + (st.dev !== "desk" ? "?dev=" + st.dev : "") + "#" + s.id);
    };
    const vai = (d) => { const i = G.lista.findIndex((s) => s.id === st.id); st.id = G.lista[(i + d + G.lista.length) % G.lista.length].id; draw(); };
    gal.addEventListener("click", (e) => {
      const g = e.target.closest("[data-g]"), d = e.target.closest("[data-d]"), s = e.target.closest("[data-s]");
      if (g) { st.id = G.lista.find((x) => x.gruppo === g.dataset.g).id; draw(); }
      if (d) { st.dev = d.dataset.d; draw(); }
      if (s) { st.id = s.dataset.s; draw(); }
      if (e.target.closest("[data-galprev]")) vai(-1);
      if (e.target.closest("[data-galnext]")) vai(1);
      if (e.target.closest("[data-galzoom]")) { const im = $("[data-galshell] img", gal); lightbox(im.src, im.alt); }
    });
    draw();
  }
  // schermate nelle schede «Da decidere»: tocca per ingrandire
  document.addEventListener("click", (e) => { const im = e.target.closest(".bk-shot img"); if (im) lightbox(im.src, im.alt); });
  $$("[data-opendev]").forEach((a) => (a.href = APP));

  /* ---------- 7 · lista d'attesa ---------- */
  const form = $("#lista-form");
  if (form) {
    const hub = form.dataset.hub; const chiave = "attesa-" + hub;
    const mostraGrazie = (email) => { form.innerHTML = `<div class="grazie"><div class="ok">✓</div><h3>Ci sei!</h3><p class="small" style="margin-top:8px">Demo: abbiamo segnato <b style="font-weight:400;color:var(--navy)">${esc(email)}</b> solo in questo browser. Nel sito vero ti scriveremo quando l'hub di ${hub[0].toUpperCase() + hub.slice(1)} parte.</p><button class="btn btn-s" style="margin-top:18px" id="annulla">Annulla iscrizione (demo)</button></div>`; $("#annulla").addEventListener("click", () => { store.set(chiave, null); location.reload(); }); };
    const gia = store.get(chiave, null);
    if (gia) mostraGrazie(gia.email);
    else {
      let scelta = $(".scelte span.on", form)?.textContent || "";
      $$(".scelte span", form).forEach((s) => s.addEventListener("click", () => { $$(".scelte span", form).forEach((x) => x.classList.remove("on")); s.classList.add("on"); scelta = s.textContent; }));
      const ck = $(".check i", form); let ok = false; ck.classList.add("off");
      $(".check", form).addEventListener("click", () => { ok = !ok; ck.classList.toggle("off", !ok); });
      $(".btn", form).addEventListener("click", (e) => {
        e.preventDefault(); const em = $("input", form).value.trim(); const msg = $(".msg", form);
        $(".campo", form).classList.toggle("err", !/^\S+@\S+\.\S+$/.test(em));
        if (!/^\S+@\S+\.\S+$/.test(em)) { msg.textContent = "Scrivi un'email valida."; return; }
        if (!ok) { msg.textContent = "Serve il consenso privacy per avvisarti."; return; }
        store.set(chiave, { email: em, scelta, quando: new Date().toISOString() }); mostraGrazie(em);
      });
    }
  }

  /* ---------- 8 · prezzi (dal listino in config) ---------- */
  const pr = $("#prezzi-root");
  if (pr) {
    const P = CFG.prezzi; let modo = "esame";
    const draw = () => {
      $("#piani", pr).innerHTML = P.modi[modo].piani.map((p) => `<div class="piano ${p.top ? "top" : ""}">${p.top ? '<span class="badge" style="align-self:flex-start">Il più scelto</span>' : ""}<span class="small nome" ${p.top ? 'style="color:rgba(244,241,234,.75);margin-top:12px"' : ""}>${esc(p.nome)}</span><div class="pz">${esc(p.prezzo)}</div><p class="small desc" ${p.top ? 'style="color:rgba(244,241,234,.75)"' : ""}>${esc(p.desc)}</p><ul>${p.voci.map((v) => `<li>${esc(v)}</li>`).join("")}</ul><a class="btn ${p.top ? "btn-a" : "btn-s"}" href="#" data-demo="Demo: nessun pagamento. Il checkout arriverà con l'area personale.">Scegli</a></div>`).join("");
      $$("[data-demo]", pr).forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); toast(b.dataset.demo); }));
    };
    $("#toggle-prezzi", pr).innerHTML = Object.entries(P.modi).map(([k, m]) => `<span class="${k === modo ? "on" : ""}" data-k="${k}">${esc(m.etichetta)}</span>`).join("");
    $$("#toggle-prezzi span", pr).forEach((s) => s.addEventListener("click", () => { modo = s.dataset.k; $$("#toggle-prezzi span", pr).forEach((x) => x.classList.toggle("on", x === s)); draw(); }));
    $("#prezzi-nota", pr).textContent = P.nota;
    $("#prezzi-faq", pr) && ($("#prezzi-faq", pr).innerHTML = P.faq.map((f, i) => `<div class="qa ${i ? "" : "open"}"><div class="d">${esc(f[0])}<span>${i ? "+" : "−"}</span></div><div class="r">${esc(f[1])}</div></div>`).join(""));
    $$("#prezzi-faq .qa").forEach((q) => $(".d", q).addEventListener("click", () => { const ap = !q.classList.contains("open"); $$("#prezzi-faq .qa").forEach((x) => { x.classList.remove("open"); $(".d span", x).textContent = "+"; }); if (ap) { q.classList.add("open"); $(".d span", q).textContent = "−"; } }));
    draw();
  }

  /* ---------- 9 · DA DECIDERE (cards + architettura demo) ---------- */
  const punti = (n) => `<span class="punti">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
  // I blocchi della mini demo: aggiungere un tipo = una riga qui + una riga nel PDF (cap. Blocchi)
  const BLOCCHI = {
    hero: (b) => `<div class="bk-hero"><span class="eyebrow">${esc(b.eyebrow || "")}</span><h3>${acc(b.titolo)}</h3>${b.testo ? `<p class="small">${esc(b.testo)}</p>` : ""}</div>`,
    cards: (b) => `<div>${b.titolo ? `<h3 class="bk-h">${esc(b.titolo)}</h3>` : ""}<div class="bk-g3">${b.items.map((c) => `<div class="bk-card"><h3>${esc(c[0])}</h3><p class="small">${esc(c[1])}</p></div>`).join("")}</div></div>`,
    steps: (b) => `<div class="bk-card">${b.titolo ? `<h3 class="bk-h">${esc(b.titolo)}</h3>` : ""}${b.items.map((r) => { const [n, ...t] = Array.isArray(r) ? r : [r]; return `<div class="bk-row"><span class="n">${esc(n)}</span><div>${esc(t.join(" · "))}</div></div>`; }).join("")}</div>`,
    list: (b) => `<div class="bk-card">${b.titolo ? `<h3 class="bk-h">${esc(b.titolo)}</h3>` : ""}${b.items.map((r) => `<div class="bk-row"><div class="g"><div>${esc(r[0])}</div><div class="small">${esc(r[1])}</div></div><span class="badge">${esc(r[2])}</span></div>`).join("")}</div>`,
    stats: (b) => `<div class="bk-g3">${b.items.map((s) => `<div class="bk-card bk-stat"><b>${esc(s[0])}</b><span class="small">${esc(s[1])}</span></div>`).join("")}</div>`,
    chips: (b) => `<div class="chips" style="margin:0">${b.items.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>`,
    nota: (b) => `<div class="dec-banner">${esc(b.testo)}</div>`,
    piano: () => `<div data-tool="piano"></div>`,
    // schermata REALE della web app (img/app/<id>-<dev>.webp): solo da guardare, tocca per ingrandire
    appshot: (b) => { const s = (CFG.schermate.lista.find((x) => x.id === b.id) || {}); return `<figure class="bk-shot ${b.dev === "ph" ? "ph" : ""}"><img src="img/app/${esc(b.id)}-${esc(b.dev || "desk")}.webp" alt="Schermata reale: ${esc(s.titolo || b.id)}" loading="lazy" decoding="async"><figcaption><b>Web app · ${esc(s.titolo || b.id)}</b> ${esc(b.nota || s.nota || "")} <span class="small">Schermata reale, solo da guardare · ${esc(s.account || "")}</span></figcaption></figure>`; },
    prezzi: () => `<div class="bk-g3">${CFG.prezzi.modi.esame.piani.map((p) => `<div class="bk-card ${p.top ? "ev" : ""}"><h3>${esc(p.nome)}</h3><b class="bk-p">${esc(p.prezzo)}</b><span class="small">${esc(p.desc)}</span><span class="badge">Esempio</span></div>`).join("")}</div>`,
  };
  const dec = $("#decroot");
  if (dec) {
    const sez = (k, h, cls = "") => `<div class="dsez ${cls}"><h2 class="k">${k}</h2><div>${h}</div></div>`;
    const lista = (l) => `<ul>${l.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
    const indice = () => { const gruppi = [...new Set(CFG.decidere.map((x) => x.gruppo))];
      return `<div class="dec-banner"><span><b>Regola.</b> Le cose decise sono già nelle pagine, come saranno davvero. Qui ogni card è una proposta con la sua architettura demo: si apre, si discute, si decide. Una card esce da qui solo quando è decisa. Ogni card ha un codice (L01…) che non cambia: usalo per chiedere modifiche.</span></div>`
        + gruppi.map((g) => `<div class="dec-gruppo"><h2>${esc(g)}</h2></div><div class="cds">${CFG.decidere.filter((x) => x.gruppo === g).map((x) => `<a class="dcard" href="#${x.id}"><span class="id">${x.id}${x.area ? " · app " + x.area : ""}</span><h3>${esc(x.titolo)}</h3><p>${esc(x.problema)}</p><div class="piede"><span class="badge">${esc(x.stato)}</span>${(window.UL_ARCH || {})[x.id] ? '<span class="badge on">Architettura completa</span>' : ""}<span>Impatto ${punti(x.impatto)}</span></div></a>`).join("")}</div>`).join(""); };
    /* ---- architettura completa delle card (decidere-arch.js): pagine annotate, dati, regole, testi, misure, piano di lavoro ---- */
    const A = window.UL_ARCH || {};
    let nTab = 0;
    const tab = (cols, righe, cls = "") => `<div class="tbw" tabindex="0" role="region" aria-label="Tabella ${++nTab}: ${esc(cols.join(", "))} (scorri di lato se serve)"><table class="tb ${cls}"><thead><tr>${cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${righe.map((r) => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="first"' : ""}>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    const tit = (b) => (b.titolo ? `<h3 class="bk-h">${esc(b.titolo)}</h3>` : "");
    // blocchi per disegnare le pagine intere (stessi componenti della landing)
    const MK = {
      hero: (b) => `<div class="mk-hero"><div><span class="badge ${b.on ? "on" : ""}">${esc(b.badge || "")}</span><h3 class="mk-t">${acc(b.titolo)}</h3>${b.lead ? `<p class="lead">${esc(b.lead)}</p>` : ""}<div class="mk-cta">${(b.cta || []).map((c, i) => `<span class="btn ${i ? "btn-s" : "btn-p"}">${esc(c)}</span>`).join("")}</div></div>${b.img ? `<div class="mk-img"><img src="img/${esc(b.img)}" alt="" loading="lazy"></div>` : ""}</div>`,
      testo: (b) => `<div class="mk-testo">${b.titolo ? `<h3>${acc(b.titolo)}</h3>` : ""}${(b.par || []).map((t) => `<p>${esc(t)}</p>`).join("")}</div>`,
      cards: (b) => `${tit(b)}<div class="bk-g3 ${b.c4 ? "c4" : ""}">${b.items.map((c) => `<div class="cd ${c[4] || ""}"><div class="ico">${esc(c[0])}</div>${c[5] ? `<span class="badge">${esc(c[5])}</span>` : ""}<h3>${esc(c[1])}</h3><p>${esc(c[2])}</p>${c[3] ? `<span class="go">${esc(c[3])}</span>` : ""}</div>`).join("")}</div>`,
      steps: (b) => `${tit(b)}<div class="bk-g3">${b.items.map((s, i) => `<div class="bk-card"><span class="mk-num">${i + 1}</span><h3>${esc(s[0])}</h3><p class="small">${esc(s[1])}</p></div>`).join("")}</div>`,
      list: (b) => `<div class="bk-card">${tit(b)}${b.items.map((r) => `<div class="bk-row"><div class="g"><div>${esc(r[0])}</div><div class="small">${esc(r[1])}</div></div>${r[2] ? `<span class="badge ${r[3] === "on" ? "on" : ""}">${esc(r[2])}</span>` : ""}</div>`).join("")}</div>`,
      stats: (b) => `<div class="bk-g3">${b.items.map((s) => `<div class="bk-card bk-stat"><b>${esc(s[0])}</b><span class="small">${esc(s[1])}</span></div>`).join("")}</div>`,
      faq: (b) => `${tit(b)}<div class="mk-faq">${b.items.map((f) => `<div class="qa open"><div class="d">${esc(f[0])}<span>−</span></div><div class="r" style="display:block">${esc(f[1])}</div></div>`).join("")}</div>`,
      form: (b) => `<div class="mk-form"><h3>${esc(b.titolo)}</h3>${(b.campi || []).map((c) => `<div class="mk-f"><span>${esc(c[0])}</span><span class="mk-in ${c[2] === "area" ? "area" : ""}">${esc(c[1] || "")}</span></div>`).join("")}${b.scelte ? `<div class="scelte">${b.scelte.map((s, i) => `<span class="${i === 0 ? "on" : ""}">${esc(s)}</span>`).join("")}</div>` : ""}${b.consenso ? `<div class="check"><i>✓</i>${esc(b.consenso)}</div>` : ""}<span class="btn btn-a">${esc(b.cta)}</span></div>`,
      cta: (b) => `<div class="mk-cta2"><h3>${acc(b.titolo)}</h3><p>${esc(b.testo || "")}</p><div class="mk-cta">${(b.cta || []).map((c, i) => `<span class="btn ${i ? "btn-s" : "btn-a"}">${esc(c)}</span>`).join("")}</div></div>`,
      profile: (b) => `${tit(b)}<div class="bk-g3">${b.items.map((p) => `<div class="bk-card mk-prof"><span class="av">${esc(p[0])}</span><h3>${esc(p[1])}</h3><p class="small">${esc(p[2])}</p><div class="chips" style="margin:6px 0">${(p[3] || []).map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div><span class="btn btn-s">${esc(p[4] || "Richiedi")}</span></div>`).join("")}</div>`,
      table: (b) => `${tit(b)}${tab(b.cols, b.righe, "mk-tb")}`,
      chips: (b) => `<div class="chips" style="margin:0">${b.items.map((c, i) => `<span class="chip ${i === 0 ? "on" : ""}">${esc(c)}</span>`).join("")}</div>`,
      cerca: (b) => `<div class="cerca" style="max-width:none"><span class="lente">⌕</span><span style="flex:1;color:var(--nv2)">${esc(b.placeholder)}</span><span class="btn btn-p">Cerca</span></div>`,
      tool: (b) => `<div class="tpanel"><span class="eyebrow">Provalo qui</span><div data-tool="${esc(b.id)}" style="margin-top:12px"></div></div>`,
      appshot: (b) => BLOCCHI.appshot(b),
      prezzi: () => BLOCCHI.prezzi(),
    };
    const NAV = [["panoramica", "Panoramica"], ["pagine", "Pagine annotate"], ["dati", "Dati e campi"], ["regole", "Regole e stati"], ["testi", "Testi"], ["misure", "Misure"], ["integrazioni", "Integrazioni"], ["manutenzione", "Manutenzione"], ["lavoro", "Piano di lavoro"], ["rischi", "Rischi e successo"], ["prompt", "Prompt per l'AI"]];
    const lista2 = (l) => `<ul>${l.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
    const completo = (x, a) => {
      const S = (id, k, h, cls = "") => `<div class="dsez ${cls}" id="a-${id}"><h2 class="k">${k}</h2><div>${h}</div></div>`;
      const pagine = a.pagine.map((p, pi) => `<div class="mk-wrap"><h3 class="mk-pt">${esc(p.titolo)}</h3><p class="small">${esc(p.nota || "")}</p>
          <div class="schermo mk-page"><div class="mk-bar"><i></i><i></i><i></i><span>${esc(p.url)}</span></div><div class="mk-body">${p.sezioni.map((s, i) => `<div class="mk-sec"><span class="mk-n" aria-label="Sezione ${i + 1}">${i + 1}</span>${(s.blocchi || [s.blocco]).map((b) => (MK[b.t] || (() => ""))(b)).join('<div class="mk-gap"></div>')}</div>`).join("")}</div></div>
          <ol class="mk-note">${p.sezioni.map((s, i) => `<li><span class="mk-n">${i + 1}</span><div><b>${esc(s.nome)}</b> <span class="small">${esc(s.codice || "")}</span><p><i>Perché c'è.</i> ${esc(s.perche)}</p><p><i>Cosa puoi cambiare da solo.</i> ${esc(s.modifica)}</p>${s.comp ? `<p class="small">Componenti: ${esc(s.comp.join(" · "))}</p>` : ""}</div></li>`).join("")}</ol></div>`).join("");
      return `<nav class="dec-nav" aria-label="In questa scheda">${NAV.map(([id, n]) => `<a href="#" data-goto="a-${id}">${n}</a>`).join("")}</nav>
        <div class="dec-azioni"><button type="button" class="btn btn-p" data-copia>Copia il prompt per l'AI</button><button type="button" class="btn btn-s" data-scheda-md="${x.id}">Scarica la scheda (.md)</button><button type="button" class="btn btn-s" data-stampa>Stampa / salva PDF</button></div>
        <div class="deccard">
          ${S("problema", "Il problema", `<p>${esc(x.problema)}</p>`)}${S("proposta", "La proposta", `<p>${esc(x.proposta)}</p>`)}
          ${S("consiglio", "Il consiglio", `<p>${esc(x.consiglio)}</p><p class="small" style="margin-top:8px">Parere di Claude per la discussione: la decisione è vostra.</p>`, "cons")}
          ${S("panoramica", "Panoramica", `<div class="mk-pan"><div><b>Obiettivo</b><p>${esc(a.obiettivo)}</p></div><div><b>Per chi</b><p>${esc(a.per)}</p></div><div><b>Quando serve</b><p>${esc(a.quando)}</p></div><div><b>Stima di lavoro</b><p>${esc(a.stima)}</p></div></div>
            <div class="mk-scope"><div class="si"><h3>Versione minima (MVP)</h3>${lista2(a.ambito.mvp)}</div><div class="poi"><h3>Dopo</h3>${lista2(a.ambito.dopo)}</div><div class="no"><h3>Non lo facciamo</h3>${lista2(a.ambito.fuori)}</div></div>
            <p class="small" style="margin-top:12px"><b style="font-weight:400">Dove vive nella landing:</b> ${esc(x.dove)}${x.area ? ` · <b style="font-weight:400">Nella web app:</b> card ${x.area}` : ""}</p>`)}
          ${S("pagine", "Pagine annotate", `<p class="small" style="margin-bottom:14px">Le pagine come sarebbero, sezione per sezione. I numeri collegano il disegno alle note: perché la sezione c'è e cosa puoi cambiare senza rifare il design.</p>${pagine}`)}
          ${S("dati", "Dati e campi", a.dati.map((d) => `<div class="mk-dato"><h3>${esc(d.nome)}</h3><p class="small">Dove: ${esc(d.dove)} · Chi lo aggiorna: ${esc(d.chi)} · Quando: ${esc(d.quando)}</p>${tab(["Campo", "Tipo", "Esempio / regola"], d.campi)}</div>`).join(""))}
          ${S("regole", "Regole e stati", `<h3 class="bk-h">Regole</h3>${lista2(a.regole)}<h3 class="bk-h" style="margin-top:18px">Stati</h3>${tab(["Stato", "Cosa vede lo studente", "Testo"], a.stati)}`)}
          ${S("testi", "Testi", `<p class="small" style="margin-bottom:10px">Testi proposti: si cambiano senza toccare il design.</p>${tab(["Elemento", "Testo proposto"], a.copy)}`)}
          ${S("misure", "Misure", `<p class="small" style="margin-bottom:10px">Un evento per ogni cosa che vuoi sapere se funziona.</p>${tab(["Evento", "Quando scatta", "Perché lo misuriamo"], a.eventi)}`)}
          ${S("integrazioni", "Integrazioni e note legali", `${tab(["Strumento", "Cosa fa", "Come si collega"], a.integrazioni)}<h3 class="bk-h" style="margin-top:18px">Da verificare (legale e privacy)</h3>${lista2(a.legale)}`)}
          ${S("manutenzione", "Manutenzione", `<p class="small" style="margin-bottom:10px">Cosa va tenuto aggiornato dopo il lancio, da chi, ogni quanto.</p>${tab(["Cosa", "Chi", "Ogni quanto", "Come"], a.manutenzione)}`)}
          ${S("lavoro", "Piano di lavoro", `${tab(["N.", "Passo", "Dove", "Giorni"], a.passi)}<p style="margin-top:10px"><b style="font-weight:400">Totale stimato:</b> ${esc(a.stima)}. Stime indicative di lavoro effettivo, con l'AI che scrive e un founder che controlla.</p>`)}
          ${S("rischi", "Rischi e successo", `<h3 class="bk-h">Rischi</h3>${tab(["Rischio", "Come lo riduci"], a.rischi)}<h3 class="bk-h" style="margin-top:18px">Come capisci se funziona</h3>${tab(["Metrica", "Soglia (ipotesi)", "Entro"], a.successo)}<p style="margin-top:10px"><b style="font-weight:400">Regola di stop.</b> ${esc(a.stop)}</p>`)}
          ${S("prompt", "Prompt per l'AI", `<p class="small" style="margin-bottom:10px">Se decidete di farla: incollate questo testo (insieme a <code>CONTESTO_DEMO.md</code>). È già scritto come richiesta di tipo C.</p><pre class="mk-prompt" id="mk-prompt">${esc(a.prompt)}</pre>`, "")}
          ${S("serve", "Cosa serve", lista(x.serve))}${S("domande", "Da decidere", lista(x.domande))}
          ${x.area ? S("webapp", "Nella web app", `<p>La parte dentro l'area personale è la card <b style="font-weight:400">${x.area}</b>. <a class="link" href="${APP}#/app/decidere/${x.area}">Apri la card nella web app →</a></p>`) : ""}
          ${S("origine", "Origine", `<p>${esc(x.origine)}</p>`)}
          ${S("storico", "Storico richieste", `<div class="storico">${x.storico.map((s) => `<div><span class="small">${new Date(s[0]).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}</span><span>${esc(s[1])}</span></div>`).join("")}</div>`)}
        </div>`;
    };
    const schedaMd = (x, a) => {
      const L = (l) => l.map((i) => `- ${i}`).join("\n"), T = (cols, r) => `| ${cols.join(" | ")} |\n|${cols.map(() => "---").join("|")}|\n${r.map((x2) => `| ${x2.map((c) => String(c).replace(/\|/g, "/")).join(" | ")} |`).join("\n")}`;
      let m = `# ${x.id} · ${x.titolo}\n\nGruppo: ${x.gruppo} · Stato: ${x.stato} · Impatto ${x.impatto}/5 · Sforzo ${x.sforzo}/5${x.area ? ` · Web app: ${x.area}` : ""}\n\n## Problema\n${x.problema}\n\n## Proposta\n${x.proposta}\n\n## Consiglio (parere di Claude)\n${x.consiglio}\n\n`;
      if (!a) return m + "## Cosa serve\n" + L(x.serve) + "\n\n## Da decidere\n" + L(x.domande) + "\n";
      m += `## Panoramica\n- **Obiettivo:** ${a.obiettivo}\n- **Per chi:** ${a.per}\n- **Quando serve:** ${a.quando}\n- **Stima:** ${a.stima}\n\n### MVP\n${L(a.ambito.mvp)}\n\n### Dopo\n${L(a.ambito.dopo)}\n\n### Non lo facciamo\n${L(a.ambito.fuori)}\n\n## Pagine\n`;
      a.pagine.forEach((p) => { m += `\n### ${p.titolo}\n\`${p.url}\` — ${p.nota || ""}\n\n`; p.sezioni.forEach((s, i) => { m += `${i + 1}. **${s.nome}** ${s.codice ? "(" + s.codice + ")" : ""}\n   - Contenuto: ${(s.blocchi || [s.blocco]).map(blocchiTesto).join(" || ")}\n   - Perché: ${s.perche}\n   - Si può cambiare: ${s.modifica}\n${s.comp ? "   - Componenti: " + s.comp.join(", ") + "\n" : ""}`; }); });
      a.dati.forEach((d) => { m += `\n## Dati · ${d.nome}\nDove: ${d.dove} · Chi: ${d.chi} · Quando: ${d.quando}\n\n${T(["Campo", "Tipo", "Esempio / regola"], d.campi)}\n`; });
      m += `\n## Regole\n${L(a.regole)}\n\n## Stati\n${T(["Stato", "Cosa vede", "Testo"], a.stati)}\n\n## Testi\n${T(["Elemento", "Testo"], a.copy)}\n\n## Misure\n${T(["Evento", "Quando", "Perché"], a.eventi)}\n\n## Integrazioni\n${T(["Strumento", "Cosa fa", "Come"], a.integrazioni)}\n\n## Da verificare (legale/privacy)\n${L(a.legale)}\n\n## Manutenzione\n${T(["Cosa", "Chi", "Ogni quanto", "Come"], a.manutenzione)}\n\n## Piano di lavoro (${a.stima})\n${T(["N.", "Passo", "Dove", "Giorni"], a.passi)}\n\n## Rischi\n${T(["Rischio", "Come lo riduci"], a.rischi)}\n\n## Successo\n${T(["Metrica", "Soglia", "Entro"], a.successo)}\n\nRegola di stop: ${a.stop}\n\n## Prompt per l'AI\n\n${a.prompt}\n`;
      return m;
    };
    const blocchiTesto = (b) => [b.badge, b.titolo, b.lead, ...(b.par || []), ...(b.items || []).map((i) => (Array.isArray(i) ? i.filter((v) => typeof v === "string").join(" — ") : String(i))), ...(b.campi || []).map((c) => c[0] + ": " + (c[1] || "")), b.consenso, b.cta && (Array.isArray(b.cta) ? b.cta.join(" / ") : b.cta), b.testo, b.placeholder, b.id && "[" + b.id + "]"].filter(Boolean).join(" · ").replace(/\*/g, "");
    window.UL_SCHEDA_MD = (id) => schedaMd(CFG.decidere.find((c) => c.id === id), A[id]);   // usata dallo script che genera i file delle schede
    dec.addEventListener("click", (e) => {
      const g = e.target.closest("[data-goto]"); if (g) { e.preventDefault(); const t = document.getElementById(g.dataset.goto); t && t.scrollIntoView({ behavior: "smooth", block: "start" }); }
      if (e.target.closest("[data-stampa]")) window.print();
      const m = e.target.closest("[data-scheda-md]"); if (m) { const x = CFG.decidere.find((c) => c.id === m.dataset.schedaMd), a = A[x.id]; const url = URL.createObjectURL(new Blob([schedaMd(x, a)], { type: "text/markdown" })); const l = document.createElement("a"); l.href = url; l.download = `UniLink_${x.id}_${x.titolo.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`; document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); }
      if (e.target.closest("[data-copia]")) { const t = $("#mk-prompt").textContent; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast("Prompt copiato: incollalo nella chat con l'AI."), () => { const r = document.createRange(); r.selectNodeContents($("#mk-prompt")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast("Selezionato: premi Ctrl/Cmd+C per copiarlo."); }); }
    });
    const dettaglio = (x) => `<a class="link" href="#">← Tutte le card</a>
      <div class="dec-top"><span class="eyebrow">${x.id} · ${esc(x.gruppo)}</span><h1 class="display" style="font-size:56px;margin-top:10px">${esc(x.titolo)}</h1><div style="margin-top:14px"><span class="badge">${esc(x.stato)}</span>${A[x.id] ? ' <span class="badge on">Architettura completa</span>' : ""}</div></div>
      <div class="dec-banner"><span><b>Architettura demo, non decisa.</b> Serve a vedere come risulterebbe e, se la decidete, a costruirla. Impatto ${punti(x.impatto)} · Sforzo ${punti(x.sforzo)}.</span></div>
      ${A[x.id] ? completo(x, A[x.id]) : `<div class="deccard">
        ${sez("Il problema", `<p>${esc(x.problema)}</p>`)}${sez("La proposta", `<p>${esc(x.proposta)}</p>`)}${sez("Dove vivrebbe", `<p>${esc(x.dove)}</p>`)}
        ${sez("Il consiglio", `<p>${esc(x.consiglio)}</p><p class="small" style="margin-top:8px">Parere di Claude per la discussione: la decisione è vostra.</p>`, "cons")}
        ${sez("Come risulterebbe", `<div class="schermo">${x.schermata.map((b) => (BLOCCHI[b.t] ? BLOCCHI[b.t](b) : "")).join("")}</div>`)}
        ${sez("Cosa serve", lista(x.serve))}${sez("Da decidere", lista(x.domande))}
        ${x.area ? sez("Nella web app", `<p>La parte dentro l'area personale è la card <b style="font-weight:400">${x.area}</b>. <a class="link" href="${APP}#/app/decidere/${x.area}">Apri la card nella web app →</a></p>`) : ""}
        ${sez("Origine", `<p>${esc(x.origine)}</p>`)}
        ${sez("Storico richieste", `<div class="storico">${x.storico.map((s) => `<div><span class="small">${new Date(s[0]).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}</span><span>${esc(s[1])}</span></div>`).join("")}</div>`)}
      </div>`}`;
    const disegna = () => { const id = location.hash.replace("#", ""), x = CFG.decidere.find((c) => c.id === id); dec.innerHTML = x ? dettaglio(x) : indice(); $$("[data-tool]", dec).forEach((el) => ULTools.monta(el, el.dataset.tool)); $(".dec-lead") && ($(".dec-lead").style.display = x ? "none" : ""); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", disegna); disegna();
  }

  /* ---------- 10 · piccole interazioni ---------- */
  // elementi cliccabili che non sono <a>/<button>: raggiungibili e attivabili da tastiera, con lo stato annunciato
  const PSEL = ".toggle span, .chip, .scelte span, .liv, .frecce span, .qa .d";
  $$(PSEL).forEach((el) => {
    if (el.closest(".schermo")) return;
    el.tabIndex = 0; el.setAttribute("role", "button");
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); } });
  });
  const syncP = () => $$(PSEL).forEach((el) => { if (el.closest(".schermo") || !el.hasAttribute("role")) return; if (el.matches(".qa .d")) el.setAttribute("aria-expanded", el.parentElement.classList.contains("open") ? "true" : "false"); else if (!el.matches(".frecce span")) el.setAttribute("aria-pressed", el.classList.contains("on") || el.classList.contains("sel") ? "true" : "false"); });
  document.addEventListener("click", (e) => { if (e.target.closest(PSEL)) setTimeout(syncP, 0); });
  syncP();
  // checklist (pagina Tesi): si ricorda cosa hai spuntato, solo in questo browser
  $$("[data-checklist]").forEach((box) => {
    const k = "check-" + box.dataset.checklist, fatti = new Set(store.get(k, [])), items = $$("[data-ck]", box), cnt = $("[data-ckn]", box);
    items.forEach((i) => { i.tabIndex = 0; i.setAttribute("role", "checkbox"); i.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); i.click(); } }); });
    const up = () => { items.forEach((i) => { i.classList.toggle("done", fatti.has(i.dataset.ck)); i.setAttribute("aria-checked", fatti.has(i.dataset.ck) ? "true" : "false"); }); cnt && (cnt.textContent = `${fatti.size}/${items.length}`); const b = $(".ckbar i", box); b && (b.style.width = (fatti.size / items.length) * 100 + "%"); };
    items.forEach((i) => i.addEventListener("click", () => { fatti.has(i.dataset.ck) ? fatti.delete(i.dataset.ck) : fatti.add(i.dataset.ck); store.set(k, [...fatti]); up(); }));
    up();
  });
  $$("[data-demo]").forEach((b) => { if (!pr) b.addEventListener("click", (e) => { e.preventDefault(); toast(b.dataset.demo); }); });
  $$("[data-avvisami]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); location.href = b.dataset.avvisami + "#lista"; }));
  // barra con un solo pulsante: appare dopo l'hero su tablet e telefono, sparisce vicino al footer, si chiude con ✕
  const cta = (document.body.dataset.cta || "").split("|");
  let chiusa = false; try { chiusa = sessionStorage.getItem("ul-cta-chiusa") === "1"; } catch (e) {}
  if (cta[1] && !chiusa) {
    document.body.insertAdjacentHTML("beforeend", `<div class="stcta" role="complementary" aria-label="Azione suggerita"><span>${esc(cta[2] || "")}</span><a class="btn btn-p" href="${esc(cta[1])}">${esc(cta[0])}</a><button type="button" aria-label="Nascondi">✕</button></div>`);
    const bar = $(".stcta"); let nascosta = false;
    const agg = () => bar.classList.toggle("vis", !nascosta && window.scrollY > 650 && $("footer").getBoundingClientRect().top > window.innerHeight - 40);
    window.addEventListener("scroll", agg, { passive: true }); window.addEventListener("resize", agg);
    $("button", bar).addEventListener("click", () => { nascosta = true; bar.classList.remove("vis"); try { sessionStorage.setItem("ul-cta-chiusa", "1"); } catch (e) {} });
    agg();
  }
  /* ---------- 11 · ARCHIVIO (solo founder: archivio/index.html) · dalle voci di CFG.archivio ---------- */
  const arcRoot = $("[data-archivio]");
  if (arcRoot) {
    const A = CFG.archivio || [], T = CFG.team || [];
    const data = (q) => new Date(q).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
    arcRoot.innerHTML = `<div class="arc-lista">${A.map((a) => `<article class="arc-card" id="${a.id}">
        <div class="arc-top"><span class="eyebrow">${esc(a.tipo)} · archiviata il ${data(a.quando)}</span>${a.file ? `<a class="btn btn-s" href="${esc(a.file)}">Apri ${a.tipo.startsWith("Pagina") || a.tipo.startsWith("Versione") ? "la pagina" : ""} →</a>` : ""}</div>
        <h2>${esc(a.titolo)}</h2>
        <p><b>Perché è stata tolta.</b> ${esc(a.perche)}</p>
        <p class="small">Fonte: ${esc(a.fonte)}</p>
        ${a.tabella ? `<div class="pz-tab-wrap"><table class="pz-tabella"><tbody>${a.tabella.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</tbody></table></div>` : ""}
        ${a.team ? `<div class="arc-team">${T.map((p) => `<div class="arc-persona"><div class="av">${esc(p.nome[0])}</div><div><b>${esc(p.nome)}</b><span class="small">${esc(p.ruolo)} · ${esc(p.corso)}</span><span class="small">${esc(p.bio)}</span></div></div>`).join("")}</div>` : ""}
        <p class="small arc-rimetti"><b>Per rimetterla:</b> ${esc(a.rimettere)}</p></article>`).join("")}</div>`;
  }
  // le dimensioni dei dispositivi cambiano al ridimensionamento: la pagina intera non deve scorrere di lato
  document.documentElement.style.overflowX = "hidden";
})();
