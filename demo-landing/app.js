// UniLink — demo navigabile della landing v2.
// Riferimento per Framer: niente backend, niente invii reali. Le preferenze della demo stanno solo in questo browser.
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pagina = document.body.dataset.page || "home";
  const SITO = "https://www.unilinkfirenze.it";
  const WA = "https://chat.whatsapp.com/KdA4r1POh6MAiBbLmmES0L";
  const ACC = '<svg class="u" viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M3 13 C 55 4, 130 3, 197 9" stroke="#cf7527" stroke-width="5" fill="none" stroke-linecap="round"/></svg>';
  const store = {
    get(k, d) { try { const v = localStorage.getItem("ul-demo-" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("ul-demo-" + k, JSON.stringify(v)); } catch (e) {} },
  };

  // ---------- navbar e footer comuni ----------
  const HUB = [
    { slug: "economia", nome: "Economia", stato: "Attivo", href: "hub-economia.html" },
    { slug: "giurisprudenza", nome: "Giurisprudenza", stato: "In arrivo", href: "hub-giurisprudenza.html" },
    { slug: "medicina", nome: "Medicina", stato: "In arrivo", href: "hub-medicina.html" },
  ];
  const att = (p) => (pagina === p ? "att" : "");
  const navHTML = `
    <div class="topbar">Demo navigabile · contenuti in parte fittizi, nessun invio reale · <a href="${SITO}" target="_blank" rel="noopener">sito attuale</a></div>
    <div class="navwrap"><div class="nav">
      <a class="logo" href="index.html"><img src="img/logo-blu.png" alt="">unilink</a>
      <div class="menu">
        <span class="tendina"><a class="tend ${pagina.startsWith("hub") ? "att" : ""}">Hub</a>
          <div class="pan">${HUB.map((h) => `<a href="${h.href}">${h.nome}<span class="badge ${h.stato === "Attivo" ? "on" : ""}">${h.stato}</span></a>`).join("")}</div></span>
        <a class="${att("dispense")}" href="dispense.html">Dispense</a>
        <a class="${att("tools")}" href="tools.html">Tools</a>
        <a href="index.html#chi-siamo">Chi siamo</a>
      </div>
      <a class="btn btn-p" href="${WA}" target="_blank" rel="noopener">Gruppo WhatsApp</a>
      <button class="burger" aria-label="Apri il menu">≡</button>
    </div></div>
    <div class="mmenu"><button class="x" aria-label="Chiudi">✕</button>
      ${HUB.map((h) => `<a href="${h.href}">${h.nome} <span class="badge ${h.stato === "Attivo" ? "on" : ""}" style="font-size:12px;vertical-align:middle">${h.stato}</span></a>`).join("")}
      <a href="dispense.html">Dispense</a><a href="tools.html">Tools</a><a href="index.html#chi-siamo">Chi siamo</a>
      <a class="btn btn-a" href="${WA}" target="_blank" rel="noopener">Entra nel gruppo WhatsApp</a></div>`;
  const onda = (c) => `<svg class="top" viewBox="0 0 1440 60" preserveAspectRatio="none"><path fill="${c}" d="M0 60 L0 32 ${"a40 28 0 0 1 80 0 ".repeat(18)}L1440 60 Z"/></svg>`;
  const footHTML = `<footer>${onda("#172554")}<div class="wrap"><div class="fgrid">
      <div><a class="logo w" href="index.html"><img src="img/logo-white.png" alt="">unilink</a><p style="opacity:.75;font-size:15px;margin-top:14px;max-width:300px">Da studenti, per studenti. Da Firenze, un passo alla volta.</p></div>
      <div><h4>Hub</h4>${HUB.map((h) => `<a href="${h.href}">${h.nome}${h.stato === "Attivo" ? "" : " · in arrivo"}</a>`).join("")}</div>
      <div><h4>UniLink</h4><a href="dispense.html">Dispense</a><a href="tools.html">Tools</a><a href="index.html#chi-siamo">Chi siamo</a><a href="index.html#faq">FAQ</a><a href="prezzi.html">Prezzi (esempio)</a></div>
      <div><h4>Resta aggiornato</h4><p style="font-size:14.5px;opacity:.75">Una mail quando escono dispense o hub nuovi. Niente spam.</p><form class="nl" id="nl"><input type="email" placeholder="La tua email" aria-label="La tua email" style="background:transparent;border:0;outline:0;color:#f4f1ea;font:inherit;flex:1;min-width:0"><button class="nlb" style="width:34px;height:34px;border-radius:50%;background:#cf7527;border:0;color:#fff;cursor:pointer">→</button></form></div>
    </div><div class="fbase"><span>© 2026 UniLink Firenze · Progetto indipendente, non affiliato all'Università di Firenze</span><span>Instagram · LinkedIn · WhatsApp</span></div></div></footer>
    <div class="toast" id="toast"></div>`;
  $("#ul-nav") && ($("#ul-nav").outerHTML = navHTML);
  $("#ul-foot") && ($("#ul-foot").outerHTML = footHTML);

  const toast = (t) => { const el = $("#toast"); if (!el) return; el.textContent = t; el.classList.add("vis"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("vis"), 2800); };
  $(".burger")?.addEventListener("click", () => $(".mmenu").classList.add("open"));
  $(".mmenu .x")?.addEventListener("click", () => $(".mmenu").classList.remove("open"));
  $(".tendina > a")?.addEventListener("click", (e) => { e.preventDefault(); e.currentTarget.parentElement.classList.toggle("open"); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".tendina")) $(".tendina")?.classList.remove("open"); });
  $("#nl")?.addEventListener("submit", (e) => { e.preventDefault(); const i = $("input", e.target); if (!/^\S+@\S+\.\S+$/.test(i.value)) { toast("Scrivi un'email valida"); return; } i.value = ""; toast("Demo: iscrizione simulata, nessuna email inviata."); });

  // ---------- comparsa allo scorrimento ----------
  const io = "IntersectionObserver" in window && !/statico/.test(location.search) ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); } }), { threshold: 0.12 }) : null;
  // .app sposta e fa comparire; .app-o solo dissolvenza, per gli elementi che hanno già una rotazione
  $$(".testa, .hubs > *, .livelli, .garanzie, .tools, .team > *, .qa, .finale, .fasi3 > *, .piano, .form, .costruisci, .step, .voce, .cardnum, .fotonum").forEach((el, i) => {
    if (!io) return; el.classList.add(el.matches(".step, .voce, .cardnum, .fotonum, .piano.top") ? "app-o" : "app"); el.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(el);
  });

  // ---------- nastro che scorre ----------
  const tp = $(".ribbon textPath");
  if (tp && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let o = 0; const giro = () => { o = (o - 0.35) % 600; tp.setAttribute("startOffset", o); requestAnimationFrame(giro); }; giro();
  }

  // ---------- FAQ ----------
  $$(".qa").forEach((q) => $(".d", q).addEventListener("click", () => { const ap = !q.classList.contains("open"); $$(".qa", q.parentElement).forEach((x) => { x.classList.remove("open"); $(".d span", x).textContent = "+"; }); if (ap) { q.classList.add("open"); $(".d span", q).textContent = "−"; } }));

  // ---------- "Parti da dove sei" ----------
  const FASI = {
    matricola: { k: "Per le matricole", t: "Tre cose da fare nel primo mese", r: [["Guida", "Come leggere il piano di studi", SITO + "/guide"], ["Dispense del I anno", "Economia Aziendale, Diritto Pubblico…", "dispense.html?anno=I"], ["Community", "Il gruppo WhatsApp del tuo anno", WA]] },
    esame: { k: "Prepari un esame", t: "Parti dalla dispensa giusta", r: [["Catalogo", "Cerca il tuo esame per nome o anno", "dispense.html"], ["Informazioni utili", "Modalità d'esame e consigli su ogni scheda", "dispense.html"], ["Quiz", "Allenati al formato dell'esame", "dispense.html"]] },
    erasmus: { k: "Pensi all'Erasmus", t: "Arriva al bando preparato", r: [["Calcolatore Erasmus", "Il tuo punteggio per il bando", SITO + "/tools/calcolatore-erasmus"], ["Destinazioni", "Le mete con informazioni ordinate", SITO + "/tools/destinazioni-erasmus"], ["Guida", "Learning Agreement senza panico", SITO + "/guide"]] },
    dopo: { k: "Pensi al dopo", t: "Scegli con più elementi", r: [["Voto di laurea", "Da dove parti alla discussione", "tools.html#calcolatore"], ["Master e magistrali", "Confronta i percorsi", SITO + "/tools/master-magistrale"], ["Carriera", "Primi passi e CV", SITO + "/guide"]] },
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

  // ---------- dispense: card, ricerca, filtri ----------
  const D = window.UL_DISPENSE || [];
  const card = (d) => `<a class="disp" href="${SITO}/dispense/${encodeURIComponent(d.slug)}" target="_blank" rel="noopener" title="Apri la scheda sul sito attuale">
      <div class="cop"><img src="img/cop/${d.cop}" alt="Copertina ${d.nome}" loading="lazy"><span class="badge on">${d.anno} anno</span></div>
      <h3>${d.nome}</h3><div class="meta"><span>${d.sem} semestre</span>${d.mod ? `<span>· ${d.mod.length > 22 ? d.mod.split(" ")[0] + "…" : d.mod}</span>` : ""}</div>
      <div class="piede"><span class="tipi">${d.tipi.map((t) => `<span>${t}</span>`).join("")}</span><span>→</span></div></a>`;
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  function catalogo(box, { q = "", anno = "Tutti", area = "Tutte", limite = 99 } = {}) {
    const l = D.filter((d) => (anno === "Tutti" || d.anno === anno) && (area === "Tutte" || d.area === area) && (!q || norm(d.nome).includes(norm(q))));
    box.innerHTML = l.length ? l.slice(0, limite).map(card).join("") : `<div class="vuoto">Nessun esame trovato per "${q}". Prova con un'altra parola, o <a href="${WA}" target="_blank" rel="noopener"><u>chiedicelo nel gruppo</u></a>.</div>`;
    return l.length;
  }
  function filtri(root, box, opz) {
    const st = { q: "", anno: opz.anno || "Tutti", area: "Tutte" };
    const combina = !!$('.chip[data-area="Tutte"]', root);
    const conta = $(".conta", root);
    const run = () => { const n = catalogo(box, { ...st, limite: opz.limite }); if (conta) conta.textContent = `${n} ${n === 1 ? "esame" : "esami"}`; if (box.classList.contains("scroller")) box.scrollLeft = 0; };
    const inp = $(".cerca input", root);
    inp?.addEventListener("input", () => { st.q = inp.value.trim(); run(); });
    $(".cerca", root)?.addEventListener("submit", (e) => { e.preventDefault(); st.q = inp.value.trim(); run(); });
    $$(".chip", root).forEach((c) => c.addEventListener("click", () => {
      const tipo = c.dataset.anno ? "anno" : "area"; const val = c.dataset.anno || c.dataset.area;
      $$(`.chip[data-${tipo}]`, root).forEach((x) => x.classList.remove("on"));
      c.classList.add("on"); st[tipo] = val;
      // In home c'è una sola riga di filtri: anno e area si escludono. Nel catalogo completo si combinano.
      if (!combina) {
        if (tipo === "area") { st.anno = "Tutti"; $$(".chip[data-anno]", root).forEach((x) => x.classList.toggle("on", x.dataset.anno === "Tutti")); }
        else st.area = "Tutte";
        if (tipo === "anno") $$(".chip[data-area]", root).forEach((x) => x.classList.remove("on"));
      }
      run();
    }));
    $$(".chip[data-anno]", root).forEach((c) => c.classList.toggle("on", c.dataset.anno === st.anno));
    $$(".chip[data-area]", root).forEach((c) => c.classList.toggle("on", c.dataset.area === "Tutte"));
    if (opz.anno && opz.anno !== "Tutti") root.scrollIntoView();
    run();
  }
  const catRoot = $("#catalogo");
  if (catRoot) {
    const box = $(".dispense, .scroller, .catgrid", catRoot);
    const anno = new URLSearchParams(location.search).get("anno");
    filtri(catRoot, box, { limite: pagina === "home" ? 12 : 99, anno: anno || "Tutti" });
    $$(".frecce span", catRoot).forEach((f, i) => f.addEventListener("click", () => box.scrollBy({ left: (i ? 1 : -1) * box.clientWidth * 0.8, behavior: "smooth" })));
  }
  // anni nel hub Economia
  const anniRoot = $("#anni");
  if (anniRoot) {
    const box = $(".dispense", anniRoot);
    const mostra = (a) => { catalogo(box, { anno: a, limite: 8 }); };
    $$(".toggle span", anniRoot).forEach((s) => s.addEventListener("click", () => { $$(".toggle span", anniRoot).forEach((x) => x.classList.remove("on")); s.classList.add("on"); mostra(s.dataset.anno); }));
    mostra("I");
  }

  // ---------- calcolatore voto di laurea (regole di UniLinkVotoLaurea.v5) ----------
  const calc = $(".calc[data-live]");
  if (calc) {
    const st = { media: 27.4, lodi: 2, tesi: 2, corso: 2 };
    const fmt = (n) => n.toFixed(1).replace(".", ",");
    const upd = () => {
      const pres = (st.media * 11) / 3 + st.lodi * 0.333;
      const fin = Math.min(110, pres + st.tesi + st.corso);
      const lode = Math.round(fin) >= 110 && pres >= 104.5 && st.tesi === 3;
      $("#v-media").textContent = fmt(st.media); $("#v-lodi").textContent = st.lodi;
      $("#v-pres").textContent = fmt(pres);
      $("#v-fin").innerHTML = Math.round(fin) + (lode ? " e lode" : "");
      $("#v-nota").textContent = lode ? "Hai i requisiti per la lode." : Math.round(fin) >= 110 ? "110: per la lode servono presentazione ≥ 104,5 e tesi Ottimo." : "Stima indicativa: decide la commissione.";
      $$(".calc input[type=range]").forEach((r) => r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min)) * 100 + "%"));
    };
    $("#r-media").addEventListener("input", (e) => { st.media = +e.target.value; upd(); });
    $("#r-lodi").addEventListener("input", (e) => { st.lodi = +e.target.value; upd(); });
    $$(".cscelte[data-k]").forEach((g) => $$("span", g).forEach((s) => s.addEventListener("click", () => { $$("span", g).forEach((x) => x.classList.remove("on")); s.classList.add("on"); st[g.dataset.k] = +s.dataset.v; upd(); })));
    upd();
  }
  $$(".tool[data-sel]").forEach((t) => t.addEventListener("click", (e) => {
    if (t.dataset.sel === "calc") { e.preventDefault(); $$(".tool").forEach((x) => x.classList.remove("sel")); t.classList.add("sel"); $(".calc").animate([{ transform: "scale(.98)" }, { transform: "scale(1)" }], { duration: 250 }); }
  }));

  // ---------- lista d'attesa ----------
  const form = $("#lista-form");
  if (form) {
    const hub = form.dataset.hub; const chiave = "attesa-" + hub;
    const mostraGrazie = (email) => { form.innerHTML = `<div class="grazie"><div class="ok">✓</div><h3>Ci sei!</h3><p class="small" style="margin-top:8px">Demo: abbiamo segnato <b style="font-weight:400;color:var(--navy)">${email}</b> solo in questo browser. Nel sito vero ti scriveremo quando l'hub di ${hub[0].toUpperCase() + hub.slice(1)} parte.</p><button class="btn btn-s" style="margin-top:18px" id="annulla">Annulla iscrizione (demo)</button></div>`; $("#annulla").addEventListener("click", () => { store.set(chiave, null); location.reload(); }); };
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
  $$("[data-avvisami]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); location.href = b.dataset.avvisami + "#lista"; }));

  // ---------- prezzi ----------
  const PREZZI = {
    esame: [["Appunti di un esame", "€ 4,99", "Gli appunti completi, da tenere."], ["Dispensa completa", "€ 12,99", "Tutto per un esame."], ["Due esami", "€ 22,99", "Due dispense complete a scelta."]],
    semestre: [["Semestre · 1 esame", "€ 12,99", "Una dispensa completa del semestre."], ["Pacchetto semestre", "€ 29,99", "Gli esami del tuo semestre."], ["Pacchetto anno", "€ 49,99", "Due semestri, un solo acquisto."]],
  };
  const tg = $("#toggle-prezzi");
  tg && $$("span", tg).forEach((s) => s.addEventListener("click", () => {
    $$("span", tg).forEach((x) => x.classList.remove("on")); s.classList.add("on");
    $$(".piano").forEach((p, i) => { const [n, pz, d] = PREZZI[s.dataset.k][i]; p.querySelector(".nome").textContent = n; p.querySelector(".pz").textContent = pz; p.querySelector(".desc").textContent = d; p.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 260 }); });
  }));
  $$("[data-demo]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); toast(b.dataset.demo); }));
})();
