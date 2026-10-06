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
  const navHTML = `
    <div class="topbar" role="region" aria-label="Avviso demo">Demo navigabile v${CFG.versione.n} · contenuti in parte fittizi, nessun invio reale · <a href="area.html">anteprima area personale</a> · <a href="decidere.html">cosa è ancora da decidere</a>${CFG.commenti && CFG.commenti.attivi ? " · <b>commenta</b> con il pulsante in basso" : ""}</div>
    <header class="navwrap"><div class="nav">
      <a class="logo" href="index.html"><img src="img/logo-blu.png" alt="">unilink</a>
      <div class="menu">
        ${tend("Hub", "#", CFG.hub.map((h) => `<a href="${h.href}">${h.nome}${badge(h)}</a>`).join(""), pagina.startsWith("hub"))}
        ${CFG.fasi.map((f) => tend(f.nome, f.href, f.voci.map((v) => `<a href="${v[1]}">${v[0]}</a>`).join(""), fasePag === f.id)).join("")}
        <a class="${att(pagina === "tools")}" href="tools.html">Strumenti</a>
        <a class="${att(pagina === "community")}" href="community.html">Community</a>
      </div>
      <a class="decpill ${att(pagina === "decidere")}" href="decidere.html" title="Idee ancora da decidere: solo in demo">Da decidere <span>${nDec}</span></a>
      <a class="btn btn-p navcta" href="area.html">Area personale</a>
      <button class="burger" aria-label="Apri il menu">≡</button>
    </div></header>
    <div class="mmenu"><button class="x" aria-label="Chiudi">✕</button>
      <div class="mg">Hub</div>
      ${CFG.hub.map((h) => `<a href="${h.href}">${h.nome} ${badge(h)}</a>`).join("")}
      <div class="mg">Il tuo percorso</div>
      ${CFG.fasi.map((f) => `<a href="${f.href}">${f.nome}<small>${f.titolo}</small></a>`).join("")}
      <a href="tools.html">Strumenti</a><a href="community.html">Community</a><a href="area.html">Area personale</a>
      <a class="mdec" href="decidere.html">Da decidere · ${nDec}</a>
      <a class="btn btn-a" href="${WA}" target="_blank" rel="noopener">Entra nel gruppo WhatsApp</a></div>`;
  const onda = (c) => `<svg class="top" viewBox="0 0 1440 60" preserveAspectRatio="none"><path fill="${c}" d="M0 60 L0 32 ${"a40 28 0 0 1 80 0 ".repeat(18)}L1440 60 Z"/></svg>`;
  const footHTML = `<footer>${onda("#172554")}<div class="wrap"><div class="fgrid">
      <div><a class="logo w" href="index.html"><img src="img/logo-white.png" alt="">unilink</a><p style="opacity:.75;font-size:15px;margin-top:14px;max-width:300px">Da studenti, per studenti. Da Firenze, un passo alla volta.</p></div>
      <div><h2 class="fh">Hub</h2>${CFG.hub.map((h) => `<a href="${h.href}">${h.nome}${h.stato === "attivo" ? "" : " · in arrivo"}</a>`).join("")}</div>
      <div><h2 class="fh">Percorso</h2>${CFG.fasi.map((f) => `<a href="${f.href}">${f.titolo}</a>`).join("")}<a href="tools.html">Strumenti</a><a href="area.html">Area personale</a></div>
      <div><h2 class="fh">UniLink</h2><a href="community.html">Community</a><a href="index.html#chi-siamo">Chi siamo</a><a href="index.html#faq">FAQ</a><a href="prezzi.html">Prezzi (esempio)</a><a href="decidere.html">Da decidere</a>${CFG.commenti && CFG.commenti.attivi ? '<a href="commenti.html">Commenti del team</a>' : ""}</div>
      <div class="fnl"><h2 class="fh">Resta aggiornato</h2><p style="font-size:14.5px;opacity:.75">Una mail quando escono strumenti o hub nuovi. Niente spam.</p><form class="nl" id="nl"><input type="email" placeholder="La tua email" aria-label="La tua email" style="background:transparent;border:0;outline:0;color:#f4f1ea;font:inherit;flex:1;min-width:0"><button class="nlb" style="width:34px;height:34px;border-radius:50%;background:#cf7527;border:0;color:#fff;cursor:pointer">→</button></form></div>
    </div><div class="fbase"><span>© 2026 UniLink Firenze · Progetto indipendente, non affiliato all'Università di Firenze</span><span>Demo v${CFG.versione.n} · ${new Date(CFG.versione.data).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}</span></div></div></footer>
    <div class="toast" id="toast"></div>`;
  $("#ul-nav") && ($("#ul-nav").outerHTML = navHTML);
  $("#ul-foot") && ($("#ul-foot").outerHTML = footHTML);
  /* struttura: link «vai al contenuto», <main>, briciole di pane */
  document.body.insertAdjacentHTML("afterbegin", '<a class="skip" href="#main">Vai al contenuto</a>');
  const mmenu = $(".mmenu"), foot = $("footer");
  if (mmenu && foot) { const main = document.createElement("main"); main.id = "main"; main.tabIndex = -1; let n = mmenu.nextElementSibling; while (n && n !== foot) { const nx = n.nextElementSibling; main.appendChild(n); n = nx; } mmenu.after(main); }
  const CRUMB = { prima: [["Prima"]], durante: [["Durante"]], dopo: [["Dopo"]], tesi: [["Dopo", "dopo.html"], ["Tesi e laurea"]], tools: [["Strumenti"]], area: [["Area personale"]], community: [["Community"]], prezzi: [["Prezzi (esempio)"]], decidere: [["Da decidere"]], commenti: [["Commenti del team"]],
    "hub-economia": [["Hub"], ["Economia"]], "hub-giurisprudenza": [["Hub"], ["Giurisprudenza"]], "hub-medicina": [["Hub"], ["Medicina"]] }[pagina];
  if (CRUMB && $("#main")) { const it = [["Home", "index.html"], ...CRUMB]; $("#main").insertAdjacentHTML("afterbegin", `<nav class="crumbs" aria-label="Percorso"><div class="wrap">${it.map((c, i) => (i === it.length - 1 ? `<span aria-current="page">${esc(c[0])}</span>` : c[1] ? `<a href="${c[1]}">${esc(c[0])}</a>` : `<span>${esc(c[0])}</span>`)).join("<i>›</i>")}</div></nav>`); }
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
  const card = (d) => `<a class="disp" href="${SITOAPP}#/app/materiali/catalogo" title="Apri il catalogo nell'area personale (si entra con un account demo)">
      <div class="cop"><img src="img/cop/${d.cop}" alt="Copertina ${esc(d.nome)}" loading="lazy"><span class="badge on">${d.anno} anno</span></div>
      <h3>${esc(d.nome)}</h3><div class="meta"><span>${d.sem} semestre</span>${d.mod ? `<span>· ${esc(d.mod.length > 22 ? d.mod.split(" ")[0] + "…" : d.mod)}</span>` : ""}</div>
      <div class="piede"><span class="tipi">${d.tipi.map((t) => `<span>${t}</span>`).join("")}</span><span>→</span></div></a>`;
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

  /* ---------- 5 · strumenti (da tools.js, dentro la demo) ---------- */
  $$("[data-toolshell]").forEach((root) => {
    const limit = +root.dataset.limit || 99;
    let hub = root.dataset.hub || "economia", sel = (location.hash || "").replace("#", "");
    const lista = $(".tlist", root), pan = $(".tpanel", root);
    const draw = () => {
      const l = ULTools.lista(hub).slice(0, limit), ar = root.dataset.limit ? [] : ULTools.area(hub);
      if (!l.find((t) => t.id === sel)) sel = l[0] && l[0].id;
      lista.innerHTML = l.map((t) => `<div class="tool ${t.id === sel ? "sel" : ""}" data-id="${t.id}" tabindex="0" role="button"><div class="ico">${esc(t.icona)}</div><div><h3 aria-level="${pagina === "tools" ? 2 : 3}">${esc(t.nome)}${t.stato === "demo" ? ' <span class="badge" style="font-size:11px;padding:2px 8px;margin-left:4px">Esempio</span>' : ""}</h3><p>${esc(t.desc)}</p></div><span class="go">→</span></div>`).join("")
        + ar.map((t) => `<a class="tool lock" href="${APP}${t.href || ""}"><div class="ico">${esc(t.icona)}</div><div><h3 aria-level="${pagina === "tools" ? 2 : 3}">${esc(t.nome)} <span class="badge on" style="font-size:11px;padding:2px 8px;margin-left:4px">Nell'area</span></h3><p>${esc(t.desc)}</p></div><span class="go">↗</span></a>`).join("");
      const t = ULTools.trova(sel);
      pan.innerHTML = t ? `<span class="eyebrow">Provalo qui · ${esc(window.UL_HUB_NOMI[hub] || "")}</span><h3 style="margin:6px 0 16px">${esc(t.nome)}</h3><div class="tl-mount"></div>` : `<p class="small">Per questo hub gli strumenti arrivano con l'hub.</p>`;
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
