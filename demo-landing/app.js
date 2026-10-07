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
  const fondItems = `<a href="area.html">Area personale · schermate</a><a href="decidere.html">Da decidere <span class="badge">${nDec}</span></a>${COMM ? '<a href="commenti.html">Commenti del team</a>' : ""}<a href="prezzi.html">Prezzi · pagina precedente</a>`;
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
        <a class="${att(pagina === "community")}" href="community.html">${esc(NAV.community || "Community")}</a>
      </div>
      <span class="tendina fondatori"><a class="tend decpill ${att(["decidere", "area", "commenti"].includes(pagina))}" href="#" title="Strumenti del team: solo in demo">${esc(NAV.founder || "Founder")} <span>${nDec}</span></a><div class="pan">${fondItems}</div></span>
      <a class="btn btn-p navcta" href="${APP}">${esc(NAV.accedi || "Accedi")}</a>
      <button class="burger" aria-label="Apri il menu">≡</button>
    </div></header>
    <div class="mmenu"><button class="x" aria-label="Chiudi">✕</button>
      <div class="mg">Hub</div>
      ${CFG.hub.map((h) => `<a href="${h.href}">${h.nome} ${badge(h)}</a>`).join("")}
      <div class="mg">UniLink</div>
      <a href="guida.html">${esc(NAV.guida || "Guida")}</a><a href="materiali.html">${esc(NAV.materiali || "Materiali")}</a><a href="tools.html">${esc(NAV.strumenti || "Strumenti")}</a><a href="community.html">${esc(NAV.community || "Community")}</a>
      <a class="btn btn-p" href="${APP}">${esc(NAV.accedi || "Accedi")}</a>
      <div class="mg">${esc(NAV.founder || "Founder")} · solo demo</div>
      <a class="mdec" href="decidere.html">Da decidere · ${nDec}</a><a href="area.html">Area personale · schermate</a>${COMM ? '<a href="commenti.html">Commenti del team</a>' : ""}
      <a class="btn btn-a" href="${WA}" target="_blank" rel="noopener">Entra nel gruppo WhatsApp</a></div>`;
  const onda = (c) => `<svg class="top" viewBox="0 0 1440 60" preserveAspectRatio="none"><path fill="${c}" d="M0 60 L0 32 ${"a40 28 0 0 1 80 0 ".repeat(18)}L1440 60 Z"/></svg>`;
  const footHTML = `<footer>${onda("#172554")}<div class="wrap"><div class="fgrid">
      <div><a class="logo w" href="index.html"><img src="img/logo-white.png" alt="">unilink</a><p style="opacity:.75;font-size:15px;margin-top:14px;max-width:300px">Da studenti, per studenti. Da Firenze, un passo alla volta.</p></div>
      <div><h2 class="fh">Hub</h2>${CFG.hub.map((h) => `<a href="${h.href}">${h.nome}${h.stato === "attivo" ? "" : " · in arrivo"}</a>`).join("")}</div>
      <div><h2 class="fh">In ogni hub</h2>${CFG.fasi.map((f) => `<a href="${f.href}">${f.tab}</a>`).join("")}<a href="guida.html">${esc(NAV.guida || "Guida")}</a><a href="materiali.html">${esc(NAV.materiali || "Materiali")}</a><a href="tools.html">Strumenti</a></div>
      <div><h2 class="fh">UniLink</h2><a href="community.html">Community</a><a href="index.html#chi-siamo">Chi siamo</a><a href="index.html#faq">FAQ</a><a href="${APP}">Accedi all’area personale</a><a href="decidere.html">Da decidere (founder)</a></div>
      <div class="fnl"><h2 class="fh">Resta aggiornato</h2><p style="font-size:14.5px;opacity:.75">Una mail quando escono strumenti o hub nuovi. Niente spam.</p><form class="nl" id="nl"><input type="email" placeholder="La tua email" aria-label="La tua email" style="background:transparent;border:0;outline:0;color:#f4f1ea;font:inherit;flex:1;min-width:0"><button class="nlb" style="width:34px;height:34px;border-radius:50%;background:#cf7527;border:0;color:#fff;cursor:pointer">→</button></form></div>
    </div><div class="fbase"><span>© 2026 UniLink Firenze · Progetto indipendente, non affiliato all'Università di Firenze</span><span>Demo v${CFG.versione.n} · ${new Date(CFG.versione.data).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}</span></div></div></footer>
    <div class="toast" id="toast"></div>`;
  $("#ul-nav") && ($("#ul-nav").outerHTML = navHTML);
  $("#ul-foot") && ($("#ul-foot").outerHTML = footHTML);
  /* struttura: link «vai al contenuto», <main>, briciole di pane */
  document.body.insertAdjacentHTML("afterbegin", '<a class="skip" href="#main">Vai al contenuto</a>');
  const mmenu = $(".mmenu"), foot = $("footer");
  if (mmenu && foot) { const main = document.createElement("main"); main.id = "main"; main.tabIndex = -1; let n = mmenu.nextElementSibling; while (n && n !== foot) { const nx = n.nextElementSibling; main.appendChild(n); n = nx; } mmenu.after(main); }
  const CRUMB = { prima: [["Scegliere"]], durante: [["Studiare"]], dopo: [["Dopo la laurea"]], tesi: [["Dopo la laurea", "dopo.html"], ["Tesi e laurea"]], guida: [["Guida"]], materiali: [[NAV.materiali || "Materiali"]], preview: [[NAV.materiali || "Materiali", "materiali.html"], ["Anteprima"]], tools: [["Strumenti"]], area: [["Area personale"]], community: [["Community"]], prezzi: [["Prezzi (esempio)"]], decidere: [["Da decidere"]], commenti: [["Commenti del team"]],
    "hub-economia": [["Hub"], ["Economia"]], "hub-giurisprudenza": [["Hub"], ["Giurisprudenza"]], "hub-medicina": [["Hub"], ["Medicina"]] }[pagina];
  if (CRUMB && $("#main")) { const it = [["Home", "index.html"], ...CRUMB]; $("#main").insertAdjacentHTML("afterbegin", `<nav class="crumbs" aria-label="Percorso"><div class="wrap">${it.map((c, i) => (i === it.length - 1 ? `<span aria-current="page">${esc(c[0])}</span>` : c[1] ? `<a href="${c[1]}">${esc(c[0])}</a>` : `<span>${esc(c[0])}</span>`)).join("<i>›</i>")}</div></nav>`); }
  /* schede dell'hub (P7): le fasi non sono più nella barra, stanno dentro ogni hub. L'hub scelto si ricorda. */
  const hubDaPag = (CFG.hub.find((h) => pagina === "hub-" + h.slug) || {}).slug;
  if (hubDaPag) store.set("hub", hubDaPag);
  const hubCorr = hubDaPag || new URLSearchParams(location.search).get("hub") || store.get("hub", "economia");
  if ((hubDaPag || fasePagine.includes(pagina)) && $("#main")) {
    const h = CFG.hub.find((x) => x.slug === hubCorr) || CFG.hub[0];
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
    erasmus: { k: "Pensi all'Erasmus", t: "Arriva al bando preparato", r: [["Punteggio", "Stima del tuo punteggio per il bando", "tools.html#erasmus"], ["Durante", "Learning Agreement senza panico", "durante.html#erasmus"], ["Community", "Chiedi a chi ci è già stato", "community.html"]] },
    dopo: { k: "Pensi al dopo", t: "Scegli con più elementi", r: [["Voto di laurea", "Da dove parti alla discussione", "tools.html#voto"], ["Tesi", "Dall'argomento alla consegna", "tesi.html"], ["Carriera", "Magistrali, master e primi passi", "dopo.html"]] },
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
  // regola P2: Completa a prezzo pieno solo con le mappe, ridotta con appunti e quiz, assente se c'è solo «Appunti»
  const completaDi = (d) => (!LIS || !d.tipi.includes("Quiz") ? null : d.tipi.includes("Mappe") ? LIS.prezzi.completa : LIS.prezzi.completaSenzaMappe);
  window.UL_PREZZO = { eur, completaDi };
  const card = (d) => `<a class="disp" href="preview.html?esame=${encodeURIComponent(d.slug)}" title="Apri l'anteprima di ${esc(d.nome)}">
      <div class="cop"><img src="img/cop/${d.cop}" alt="Copertina ${esc(d.nome)}" loading="lazy"><span class="badge on">${d.anno} anno</span></div>
      <h3>${esc(d.nome)}</h3><div class="meta"><span>${d.sem} semestre</span>${d.mod ? `<span>· ${esc(d.mod.length > 22 ? d.mod.split(" ")[0] + "…" : d.mod)}</span>` : ""}</div>
      <div class="piede"><span class="tipi">${d.tipi.map((t) => `<span>${t}</span>`).join("")}</span><span>${LIS ? "da " + eur(LIS.prezzi.appunti[0]) : "→"}</span></div></a>`;
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
  // listino (proposta P2): singoli · pacchetti · Plus, prezzo fuori sessione e in sessione. Usato in home e in Materiali.
  const listinoHTML = () => { if (!LIS) return ""; const P = LIS.prezzi;
    const due = (n, a) => `<div class="li-card ${a.top ? "ev" : ""}"><div class="r"><span>${n}</span><b>${eur(a.p[0])}</b></div><p class="small">${a.d}</p><div class="r"><span class="badge ok">prezzo fuori sessione</span><span class="small">in sessione ${eur(a.p[1])}</span></div></div>`;
    return `<div class="listino">
      <div><h3 class="li-h">Singoli esami</h3>${due("Appunti", { p: P.appunti, d: "Appunti/Sbobine di un esame, con filigrana personale." })}${due("Dispensa completa", { p: P.completa, d: "Appunti + mappe + quiz e simulazioni dell'appello.", top: true })}<p class="small li-n">Dove le mappe non ci sono, la completa costa ${eur(P.completaSenzaMappe[0])}: ogni esame dice cosa include.</p></div>
      <div><h3 class="li-h">Pacchetti</h3><div class="li-card ev"><div class="r"><span>Pacchetto semestre <span class="badge">il più scelto</span></span><b>${eur(P.semestre)}</b></div><p class="small">Tutte le dispense complete del tuo semestre (3–4 esami). Comprate una per una: da ${eur(P.completa[0] * 3)} a ${eur(P.completa[0] * 4)}.</p></div><div class="li-card"><div class="r"><span>Pacchetto anno</span><b>${eur(P.anno)}</b></div><p class="small">I due semestri. Il momento giusto: settembre–ottobre.</p></div></div>
      <div><h3 class="li-h">Il metodo</h3><div class="li-card plus"><div class="r"><span>UniLink Plus</span><b>${eur(P.plus)}</b></div><p class="small">Una volta per sessione, nessun abbonamento. Planner per tutti gli esami, simulazioni, registro errori, CV benchmark. Con un pacchetto: ${eur(P.plusConPacchetto)}.</p></div>
        <div class="li-card"><span class="small">QUANDO CONVIENE COMPRARE</span><div class="li-mesi" role="img" aria-label="Mesi di sessione e fuori sessione">${LIS.mesi.map(([m, ses]) => `<span class="${ses ? "s" : ""}"><i></i>${m}</span>`).join("")}</div><p class="small"><span class="badge ok">fuori sessione</span> costa meno · <span class="badge">in sessione</span> costa di più</p></div></div>
    </div><p class="small li-n"><b>Gratis:</b> ${esc(LIS.gratis)} · <span class="badge">${esc(LIS.stato)}</span></p>`; };
  $$("[data-listino]").forEach((el) => (el.innerHTML = listinoHTML()));
  // founder (H09): scheda personale con breve presentazione e LinkedIn (foto e testi: segnaposto da sostituire)
  $$("[data-team]").forEach((box) => {
    const T = CFG.team || [];
    box.innerHTML = T.map((p, i) => `<button type="button" class="persona p${i + 1}" data-pid="${p.id}" aria-haspopup="dialog"><div class="av">${p.foto ? `<img src="img/${esc(p.foto)}" alt="">` : esc(p.nome[0])}</div><h3>${esc(p.nome.split(" ")[0])}</h3><p>Founder · ${esc(p.corso)}</p><p>${esc(p.ruolo)}</p><span class="small" style="text-decoration:underline">Profilo →</span></button>`).join("");
    $$("[data-pid]", box).forEach((b) => b.addEventListener("click", () => {
      const p = T.find((x) => x.id === b.dataset.pid);
      document.body.insertAdjacentHTML("beforeend", `<div class="prof-bg" role="dialog" aria-modal="true" aria-label="Profilo di ${esc(p.nome)}"><div class="prof"><button type="button" class="prof-x" aria-label="Chiudi">✕</button>
        <div class="prof-top"><div class="av">${p.foto ? `<img src="img/${esc(p.foto)}" alt="">` : esc(p.nome[0])}</div><div><span class="eyebrow">Founder · ${esc(p.corso)}</span><h2>${esc(p.nome)}</h2><p class="small">${esc(p.ruolo)}</p></div></div>
        <p>${esc(p.bio)}</p><ul class="prof-p">${p.punti.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <a class="btn btn-p" href="${esc(p.linkedin)}" target="_blank" rel="noopener">Profilo LinkedIn ↗</a><p class="small" style="margin-top:10px">Foto, testo e link sono segnaposto: si sostituiscono in config.js (team).</p></div></div>`);
      const bg = $(".prof-bg"), chiudi = () => { bg.remove(); document.removeEventListener("keydown", k); b.focus(); }, k = (e) => { if (e.key === "Escape") chiudi(); };
      bg.addEventListener("click", (e) => { if (e.target === bg) chiudi(); }); $(".prof-x", bg).addEventListener("click", chiudi); document.addEventListener("keydown", k); $(".prof-x", bg).focus();
    }));
  });
  // FAQ (H11) dalla configurazione: ogni risposta porta verso l'account o l'acquisto
  $$("[data-faq]").forEach((box) => {
    box.innerHTML = (CFG.faq || []).map(([d, r, t, h], i) => `<div class="qa ${i ? "" : "open"}"><div class="d">${esc(d)}<span>${i ? "+" : "−"}</span></div><div class="r">${esc(r)}${t ? ` <a class="faq-cta" href="${h === "@app" ? APP : esc(h)}">${esc(t)} →</a>` : ""}</div></div>`).join("");
    $$(".qa", box).forEach((q) => $(".d", q).addEventListener("click", () => { const ap = !q.classList.contains("open"); $$(".qa", box).forEach((x) => { x.classList.remove("open"); $(".d span", x).textContent = "+"; }); if (ap) { q.classList.add("open"); $(".d span", q).textContent = "−"; } }));
  });
  /* ---------- 4c · Materiali (P2) e Anteprima dell'esame ---------- */
  const SEM = { I: "I semestre", II: "II semestre" };
  const prezziEsame = (d) => { if (!LIS) return ""; const c = completaDi(d);
    return `<div class="pz"><span>Appunti <b>${eur(LIS.prezzi.appunti[0])}</b></span>${c ? `<span>Completa <b>${eur(c[0])}</b></span>` : ""}</div>`; };
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
    // calcolatore del pacchetto semestre: esami del semestre con la loro Completa contro il prezzo del pacchetto
    const cal = $("[data-calcola]");
    if (cal && LIS) {
      const sc = { anno: "I", sem: "II" };
      const draw = () => {
        const es = D.filter((d) => d.anno === sc.anno && d.sem === sc.sem), somma = es.reduce((n, d) => n + (completaDi(d) || LIS.prezzi.appunti)[0], 0), risp = somma - LIS.prezzi.semestre;
        cal.innerHTML = `<div class="calc-sel"><div class="tl-l">Anno</div><div class="seg-cal">${["I", "II", "III"].map((a) => `<button type="button" data-ca="${a}" class="${a === sc.anno ? "on" : ""}" aria-pressed="${a === sc.anno}">${a} anno</button>`).join("")}</div><div class="tl-l">Semestre</div><div class="seg-cal">${["I", "II"].map((x) => `<button type="button" data-cs="${x}" class="${x === sc.sem ? "on" : ""}" aria-pressed="${x === sc.sem}">${x} semestre</button>`).join("")}</div></div>
          <div class="calc-out"><ul>${es.map((d) => `<li><span>${esc(d.nome)}</span><b>${eur((completaDi(d) || LIS.prezzi.appunti)[0])}</b></li>`).join("")}</ul>
          <div class="calc-tot"><span>Comprati uno per uno</span><b>${eur(somma)}</b></div><div class="calc-tot big"><span>Pacchetto semestre</span><b>${eur(LIS.prezzi.semestre)}</b></div>
          <p class="small">${risp > 0 ? `Risparmi ${eur(risp)} su ${es.length} esami.` : `Con ${es.length} esami conviene comprarli singoli: il pacchetto conviene da 3 esami in su.`} Prezzi fuori sessione, in valutazione.</p></div>`;
        $$("[data-ca]", cal).forEach((b) => (b.onclick = () => { sc.anno = b.dataset.ca; draw(); })); $$("[data-cs]", cal).forEach((b) => (b.onclick = () => { sc.sem = b.dataset.cs; draw(); }));
      };
      draw();
    }
    disegna();
  }
  const prevRoot = $("[data-preview]");
  if (prevRoot) {
    const slug = new URLSearchParams(location.search).get("esame"), d = D.find((x) => x.slug === slug) || D[0], A = CFG.anteprima || {}, arg = (A.argomenti || {})[d.slug];
    const c = completaDi(d), stessi = D.filter((x) => x.anno === d.anno && x.sem === d.sem);
    document.title = `UniLink · Anteprima di ${d.nome}`;
    prevRoot.innerHTML = `<div class="prev">
      <div class="prev-cop"><img src="img/cop/${d.cop}" alt="Copertina della dispensa di ${esc(d.nome)}"></div>
      <div class="prev-main"><span class="eyebrow">${d.anno} anno · ${SEM[d.sem] || ""} · ${esc(d.codice)}</span><h1 class="h2" style="margin:8px 0 10px">${esc(d.nome)}</h1>
        <div class="chips" style="margin:0 0 18px">${d.tipi.map((t) => `<span class="chip on">${t}</span>`).join("")}<span class="chip">${esc(d.mod)}</span></div>
        <h2 class="prev-h">Indice</h2>
        ${arg ? `<ol class="prev-ind">${arg.map((a) => `<li>${esc(a)}</li>`).join("")}</ol><p class="small">Argomenti della banca di quiz di esempio. In produzione qui c'è l'indice vero del PDF, capitolo per capitolo.</p>` : `<p class="small prev-vuoto">L'indice completo si legge dal PDF della dispensa: in produzione appare qui, capitolo per capitolo, prima di comprare.</p>`}
        <h2 class="prev-h">Perché la dispensa ${c ? "completa" : "UniLink"}</h2><ul class="prev-ok">${(A.perche || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <h2 class="prev-h">Tips per passare l'esame</h2>
        <div class="prev-lock"><ul>${(A.tips || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul><div class="prev-lock-v"><p>Le tips su prof ed esame sono per chi ha l'account.</p><a class="btn btn-a" href="${APP}">Accedi per scoprirle</a></div></div>
      </div>
      <aside class="prev-buy"><h2 class="li-h">Studia ${esc(d.nome)}</h2>
        ${LIS ? `<div class="li-card"><div class="r"><span>Appunti</span><b>${eur(LIS.prezzi.appunti[0])}</b></div><span class="small">in sessione ${eur(LIS.prezzi.appunti[1])}</span></div>
        ${c ? `<div class="li-card ev"><div class="r"><span>Dispensa completa</span><b>${eur(c[0])}</b></div><span class="small">in sessione ${eur(c[1])}${d.tipi.includes("Mappe") ? "" : " · senza mappe per questo esame"}</span></div>` : `<p class="small">Per questo esame ci sono gli Appunti: mappe e quiz non ancora.</p>`}
        ${stessi.length >= 3 ? `<div class="li-card"><div class="r"><span>Nel pacchetto semestre</span><b>${eur(LIS.prezzi.semestre)}</b></div><span class="small">${stessi.length} esami del ${SEM[d.sem]} del ${d.anno} anno · <a href="materiali.html#calcola"><u>calcola</u></a></span></div>` : ""}
        <a class="btn btn-p" href="${APP}" style="justify-content:center">Compra · accedi o crea l'account</a><p class="small">${esc(LIS.gratis)}</p><span class="badge">${esc(LIS.stato)}</span>` : ""}
      </aside></div>`;
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

  /* ---------- 5 · strumenti (da tools.js, dentro la demo) ---------- */
  $$("[data-toolshell]").forEach((root) => {
    const limit = +root.dataset.limit || 99;
    let hub = root.dataset.hub || "economia", sel = (location.hash || "").replace("#", "");
    const lista = $(".tlist", root), pan = $(".tpanel", root);
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
  // le dimensioni dei dispositivi cambiano al ridimensionamento: la pagina intera non deve scorrere di lato
  document.documentElement.style.overflowX = "hidden";
})();
