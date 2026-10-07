/* js/archivio/tesi-cv-guida.js — ARCHIVIATO il 7/10/2026 (meeting dei founder: «tool tesi», «curriculum» in stand-by;
   «guida da togliere» dal sito). Codice spostato così com'era da js/views/v4.js (sezioni 5 e 6 della web app v4–v6).
   Non è più nella sidebar: si apre solo da Da decidere → Archivio (js/archivio/archivio.js).
   Per ripristinarlo: rimettere le voci in boot.js (UL.NAV e rotte) e le tab «tesi» / «cv» in views/percorso.js (TABS). */
(function () {
  const UL = window.UL, B = UL.B, U = UL.U;
  const { icon, esc } = UL.ui;
  const eur = (n) => B.eur(n);
  const head = (eyebrow, ic, title, lead, right) => `
    <div class="page-head"><div><div class="eyebrow">${icon(ic)} ${esc(eyebrow)}</div><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}</div>${right || ""}</div>`;
  const bindPlus = (root, user, slug) => root.querySelectorAll("[data-v4plus]").forEach((b) => b.addEventListener("click", () => B.upsell(user, slug, { plus: true })));

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
