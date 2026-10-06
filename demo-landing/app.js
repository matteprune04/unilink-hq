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
    <div class="topbar">Demo navigabile v${CFG.versione.n} · contenuti in parte fittizi, nessun invio reale · <a href="area.html">anteprima area personale</a> · <a href="decidere.html">cosa è ancora da decidere</a></div>
    <div class="navwrap"><div class="nav">
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
    </div></div>
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
      <div><h4>Hub</h4>${CFG.hub.map((h) => `<a href="${h.href}">${h.nome}${h.stato === "attivo" ? "" : " · in arrivo"}</a>`).join("")}</div>
      <div><h4>Percorso</h4>${CFG.fasi.map((f) => `<a href="${f.href}">${f.titolo}</a>`).join("")}<a href="tools.html">Strumenti</a><a href="area.html">Area personale</a></div>
      <div><h4>UniLink</h4><a href="community.html">Community</a><a href="index.html#chi-siamo">Chi siamo</a><a href="index.html#faq">FAQ</a><a href="prezzi.html">Prezzi (esempio)</a><a href="decidere.html">Da decidere</a></div>
      <div class="fnl"><h4>Resta aggiornato</h4><p style="font-size:14.5px;opacity:.75">Una mail quando escono strumenti o hub nuovi. Niente spam.</p><form class="nl" id="nl"><input type="email" placeholder="La tua email" aria-label="La tua email" style="background:transparent;border:0;outline:0;color:#f4f1ea;font:inherit;flex:1;min-width:0"><button class="nlb" style="width:34px;height:34px;border-radius:50%;background:#cf7527;border:0;color:#fff;cursor:pointer">→</button></form></div>
    </div><div class="fbase"><span>© 2026 UniLink Firenze · Progetto indipendente, non affiliato all'Università di Firenze</span><span>Demo v${CFG.versione.n} · ${new Date(CFG.versione.data).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}</span></div></div></footer>
    <div class="toast" id="toast"></div>`;
  $("#ul-nav") && ($("#ul-nav").outerHTML = navHTML);
  $("#ul-foot") && ($("#ul-foot").outerHTML = footHTML);
  $(".burger")?.addEventListener("click", () => $(".mmenu").classList.add("open"));
  $(".mmenu .x")?.addEventListener("click", () => $(".mmenu").classList.remove("open"));
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
  const card = (d) => `<a class="disp" href="${SITOAPP}#/dispense/${encodeURIComponent(d.slug)}" title="Apri l'anteprima nell'area personale">
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
      lista.innerHTML = l.map((t) => `<div class="tool ${t.id === sel ? "sel" : ""}" data-id="${t.id}" tabindex="0" role="button"><div class="ico">${esc(t.icona)}</div><div><h3>${esc(t.nome)}${t.stato === "demo" ? ' <span class="badge" style="font-size:11px;padding:2px 8px;margin-left:4px">Esempio</span>' : ""}</h3><p>${esc(t.desc)}</p></div><span class="go">→</span></div>`).join("")
        + ar.map((t) => `<a class="tool lock" href="${APP}#/strumenti"><div class="ico">${esc(t.icona)}</div><div><h3>${esc(t.nome)} <span class="badge on" style="font-size:11px;padding:2px 8px;margin-left:4px">Nell'area</span></h3><p>${esc(t.desc)}</p></div><span class="go">↗</span></a>`).join("");
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

  /* ---------- 6 · area personale: anteprima in tre dispositivi (la app vera, in un riquadro) ---------- */
  const dp = $("[data-devprev]");
  if (dp) {
    const DEV = { desk: [1280, 800, 1000, "Desktop"], tab: [820, 1080, 560, "Tablet"], ph: [390, 780, 290, "Telefono"] };
    const SCH = [["oggi", "Oggi"], ["esami", "I miei esami"], ["dispense", "Dispense"], ["strumenti", "Strumenti"]];
    const st = { dev: new URLSearchParams(location.search).get("dev") || "desk", sch: (location.hash || "#oggi").slice(1) };
    if (!SCH.find((s) => s[0] === st.sch)) st.sch = "oggi";
    $("[data-devbtns]", dp).innerHTML = Object.entries(DEV).map(([k, v]) => `<button class="${st.dev === k ? "on" : ""}" data-dev="${k}">${v[3]}</button>`).join("");
    $("[data-schbtns]", dp).innerHTML = SCH.map(([k, n]) => `<button class="${st.sch === k ? "on" : ""}" data-sch="${k}">${n}</button>`).join("");
    const stage = $(".devstage", dp), fr = $("iframe", dp), shell = $(".devshell", dp);
    const BEZEL = { desk: 8, tab: 12, ph: 10 };
    const fit = () => {
      const [w, h, fw] = DEV[st.dev], b = BEZEL[st.dev], W = Math.min(fw, stage.clientWidth - 8), k = (W - 2 * b) / w;
      shell.className = "devshell " + st.dev; shell.style.width = W + "px"; shell.style.height = h * k + 2 * b + "px";
      fr.style.width = w + "px"; fr.style.height = h + "px"; fr.style.transform = `scale(${k})`;
    };
    const load = () => { const u = APP + "#/" + st.sch; if (fr.dataset.u !== u) { fr.dataset.u = u; fr.src = u; } };
    dp.addEventListener("click", (e) => {
      const b = e.target.closest("[data-dev],[data-sch]"); if (!b) return;
      if (b.dataset.dev) { st.dev = b.dataset.dev; $$("[data-dev]", dp).forEach((x) => x.classList.toggle("on", x === b)); fit(); }
      if (b.dataset.sch) { st.sch = b.dataset.sch; $$("[data-sch]", dp).forEach((x) => x.classList.toggle("on", x === b)); load(); }
    });
    window.addEventListener("resize", fit); fit(); load();
    $$("[data-opendev]").forEach((a) => (a.href = APP));
  }

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
    cards: (b) => `<div>${b.titolo ? `<h4 class="bk-h">${esc(b.titolo)}</h4>` : ""}<div class="bk-g3">${b.items.map((c) => `<div class="bk-card"><h3>${esc(c[0])}</h3><p class="small">${esc(c[1])}</p></div>`).join("")}</div></div>`,
    steps: (b) => `<div class="bk-card">${b.titolo ? `<h4 class="bk-h">${esc(b.titolo)}</h4>` : ""}${b.items.map((r) => { const [n, ...t] = Array.isArray(r) ? r : [r]; return `<div class="bk-row"><span class="n">${esc(n)}</span><div>${esc(t.join(" · "))}</div></div>`; }).join("")}</div>`,
    list: (b) => `<div class="bk-card">${b.titolo ? `<h4 class="bk-h">${esc(b.titolo)}</h4>` : ""}${b.items.map((r) => `<div class="bk-row"><div class="g"><div>${esc(r[0])}</div><div class="small">${esc(r[1])}</div></div><span class="badge">${esc(r[2])}</span></div>`).join("")}</div>`,
    stats: (b) => `<div class="bk-g3">${b.items.map((s) => `<div class="bk-card bk-stat"><b>${esc(s[0])}</b><span class="small">${esc(s[1])}</span></div>`).join("")}</div>`,
    chips: (b) => `<div class="chips" style="margin:0">${b.items.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>`,
    nota: (b) => `<div class="dec-banner">${esc(b.testo)}</div>`,
    piano: () => `<div data-tool="piano"></div>`,
    prezzi: () => `<div class="bk-g3">${CFG.prezzi.modi.esame.piani.map((p) => `<div class="bk-card ${p.top ? "ev" : ""}"><h3>${esc(p.nome)}</h3><b class="bk-p">${esc(p.prezzo)}</b><span class="small">${esc(p.desc)}</span><span class="badge">Esempio</span></div>`).join("")}</div>`,
  };
  const dec = $("#decroot");
  if (dec) {
    const sez = (k, h, cls = "") => `<div class="dsez ${cls}"><div class="k">${k}</div><div>${h}</div></div>`;
    const lista = (l) => `<ul>${l.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
    const indice = () => { const gruppi = [...new Set(CFG.decidere.map((x) => x.gruppo))];
      return `<div class="dec-banner"><span><b>Regola.</b> Le cose decise sono già nelle pagine, come saranno davvero. Qui ogni card è una proposta con la sua architettura demo: si apre, si discute, si decide. Una card esce da qui solo quando è decisa. Ogni card ha un codice (L01…) che non cambia: usalo per chiedere modifiche.</span></div>`
        + gruppi.map((g) => `<div class="dec-gruppo"><h2>${esc(g)}</h2></div><div class="cds">${CFG.decidere.filter((x) => x.gruppo === g).map((x) => `<a class="dcard" href="#${x.id}"><span class="id">${x.id}${x.area ? " · app " + x.area : ""}</span><h3>${esc(x.titolo)}</h3><p>${esc(x.problema)}</p><div class="piede"><span class="badge">${esc(x.stato)}</span><span>Impatto ${punti(x.impatto)}</span></div></a>`).join("")}</div>`).join(""); };
    const dettaglio = (x) => `<a class="link" href="#">← Tutte le card</a>
      <div class="dec-top"><span class="eyebrow">${x.id} · ${esc(x.gruppo)}</span><h1 class="display" style="font-size:56px;margin-top:10px">${esc(x.titolo)}</h1><div style="margin-top:14px"><span class="badge">${esc(x.stato)}</span></div></div>
      <div class="dec-banner"><span><b>Architettura demo, non decisa.</b> Serve a vedere come risulterebbe. Impatto ${punti(x.impatto)} · Sforzo ${punti(x.sforzo)}.</span></div>
      <div class="deccard">
        ${sez("Il problema", `<p>${esc(x.problema)}</p>`)}${sez("La proposta", `<p>${esc(x.proposta)}</p>`)}${sez("Dove vivrebbe", `<p>${esc(x.dove)}</p>`)}
        ${sez("Il consiglio", `<p>${esc(x.consiglio)}</p><p class="small" style="margin-top:8px">Parere di Claude per la discussione: la decisione è vostra.</p>`, "cons")}
        ${sez("Come risulterebbe", `<div class="schermo">${x.schermata.map((b) => (BLOCCHI[b.t] ? BLOCCHI[b.t](b) : "")).join("")}</div>`)}
        ${sez("Cosa serve", lista(x.serve))}${sez("Da decidere", lista(x.domande))}
        ${x.area ? sez("Nella web app", `<p>La parte dentro l'area personale è la card <b style="font-weight:400">${x.area}</b>. <a class="link" href="${APP}#/decidere/${x.area}">Apri la card nella web app →</a></p>`) : ""}
        ${sez("Origine", `<p>${esc(x.origine)}</p>`)}
        ${sez("Storico richieste", `<div class="storico">${x.storico.map((s) => `<div><span class="small">${new Date(s[0]).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}</span><span>${esc(s[1])}</span></div>`).join("")}</div>`)}
      </div>`;
    const disegna = () => { const id = location.hash.replace("#", ""), x = CFG.decidere.find((c) => c.id === id); dec.innerHTML = x ? dettaglio(x) : indice(); $$("[data-tool]", dec).forEach((el) => ULTools.monta(el, el.dataset.tool)); $(".dec-lead") && ($(".dec-lead").style.display = x ? "none" : ""); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", disegna); disegna();
  }

  /* ---------- 10 · piccole interazioni ---------- */
  // checklist (pagina Tesi): si ricorda cosa hai spuntato, solo in questo browser
  $$("[data-checklist]").forEach((box) => {
    const k = "check-" + box.dataset.checklist, fatti = new Set(store.get(k, [])), items = $$("[data-ck]", box), cnt = $("[data-ckn]", box);
    const up = () => { items.forEach((i) => i.classList.toggle("done", fatti.has(i.dataset.ck))); cnt && (cnt.textContent = `${fatti.size}/${items.length}`); const b = $(".ckbar i", box); b && (b.style.width = (fatti.size / items.length) * 100 + "%"); };
    items.forEach((i) => i.addEventListener("click", () => { fatti.has(i.dataset.ck) ? fatti.delete(i.dataset.ck) : fatti.add(i.dataset.ck); store.set(k, [...fatti]); up(); }));
    up();
  });
  $$("[data-demo]").forEach((b) => { if (!pr) b.addEventListener("click", (e) => { e.preventDefault(); toast(b.dataset.demo); }); });
  $$("[data-avvisami]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); location.href = b.dataset.avvisami + "#lista"; }));
  // le dimensioni dei dispositivi cambiano al ridimensionamento: la pagina intera non deve scorrere di lato
  document.documentElement.style.overflowX = "hidden";
})();
