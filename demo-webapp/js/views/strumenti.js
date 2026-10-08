/* js/views/strumenti.js — web app v12 · STRUMENTI (decisione di Matteo dell'8/10: «tool solo nella web app»).
   Gli strumenti sono quelli della landing (js/tools.js è una COPIA di demo-landing/tools.js: se ne cambi uno, copia l'altro).
   v12 (commento 2 dell'8/10): la pagina è UGUALE alla vetrina della landing: stessi strumenti (Quanto prendo alla laurea?,
   Che media mi serve?, Erasmus, e il Planner di Plus), stesse illustrazioni e stesse frasi, da js/strumenti-vetrina.js
   (generato da demo-landing/config.js con: node -e "…" — vedi l'intestazione del file). Prima si sceglie con un colpo d'occhio,
   poi lo strumento si apre con la sua illustrazione, la domanda a cui risponde e un esempio; i calcoli partono dal libretto.
   I numeri d'uso (activity.tool[id]) alimenteranno le metriche della vetrina, mostrate solo sopra una soglia. */
(function () {
  const UL = window.UL, B = UL.B, U = UL.U;
  const { icon, esc } = UL.ui;
  const HUB = { economia: "economia", giurisprudenza: "giurisprudenza", medicina: "medicina" };
  const V = () => window.UL_VETRINA || { illus: {}, perche: {}, tools: {} };
  const elenco = (u) => {
    const hub = HUB[u.profile.area] || "economia", VV = V();
    const L = window.ULTools.lista(hub).filter((t, i, a) => !(t.id === "voto-cdl" && a.some((x) => x.id === "voto")));
    const out = L.map((t) => ({ id: t.id, nome: t.nome, perche: VV.perche[t.id] || t.desc, v: VV.tools[t.id] || {}, demo: t.stato === "demo", href: "#/app/strumenti/" + t.id }));
    if (hub === "economia") out.push({ id: "planner", nome: "Il Planner", plus: true, perche: VV.perche.planner || "", v: {}, href: "#/app/planner" });
    return out;
  };
  const badge = (x) => (x.plus ? '<span class="badge vt-bplus">UniLink Plus</span>' : '<span class="badge badge-soft">Gratis</span>');
  UL.views.strumentiU = {
    title: "Strumenti",
    render(u, params) {
      if (!window.ULTools) return `<div class="card empty">Strumenti non disponibili.</div>`;
      const L = elenco(u), IL = V().illus, sel = L.find((t) => t.id === params[0] && !t.plus);
      // senza strumento scelto: le tessere grandi, come nella landing
      if (!sel) return `<div class="page-head"><div><div class="eyebrow">${icon("calc")} Studio</div><h1>Strumenti</h1>
          <p class="lead">Rispondono a una domanda in un minuto, partendo dai voti del tuo libretto.</p></div></div>
        <div class="vt-show">${L.map((x) => `<a class="vt-tile ${x.plus ? "plus" : ""}" href="${x.href}"><div class="vt-ill">${IL[x.id] || ""}</div>
          <div class="vt-txt">${badge(x)}<h3>${esc(x.nome)}</h3><p>${esc(x.perche)}</p><span class="vt-link">${x.plus ? "Apri il Planner" : "Apri"} →</span></div></a>`).join("")}</div>`;
      // strumento aperto: testata con illustrazione, domanda ed esempio; sotto il calcolo; in alto si passa agli altri
      return `<div class="vt-nav"><a href="#/app/strumenti" class="small display" style="text-decoration:none">← Strumenti</a>
          <div class="vt-altri">${L.map((x) => `<a href="${x.href}" class="${x.id === sel.id ? "on" : ""}"><span class="vt-mini">${IL[x.id] || ""}</span>${esc(x.nome)}${x.plus ? " · Plus" : ""}</a>`).join("")}</div></div>
        <section class="vt-testa"><div class="vt-ill">${IL[sel.id] || ""}</div>
          <div class="vt-txt">${badge(sel)}<h1>${esc(sel.nome)}</h1><p class="vt-dom">${esc(sel.v.domanda || sel.perche)}</p>
            ${sel.v.esempio ? `<div class="vt-es2"><span>Esempio</span>${esc(sel.v.esempio)}</div>` : ""}
            <p class="small muted">${sel.v.tempo ? `${icon("clock")} ${esc(sel.v.tempo)} · ` : ""}${U.calcoloLaurea ? "i voti arrivano già dal tuo libretto" : ""}</p></div></section>
        <section class="card vt-calcolo ul-tools"><div data-tool-qui></div></section>
        <p class="tiny muted" style="margin-top:10px">${sel.demo ? "Regole d'esempio, da verificare sul bando. " : ""}${sel.v.fonte ? "Fonte: " + esc(sel.v.fonte) + ". " : ""}Il risultato è una stima: decide sempre l'Ateneo. Media ed esami si salvano in <a href="#/app/esami/libretto">Libretto e voto di laurea</a>.</p>`;
    },
    mount(root, u, params) {
      const el = root.querySelector("[data-tool-qui]"); if (!el || !window.ULTools) return;
      // v10: gli strumenti partono dai tuoi dati (libretto), così sono completi senza ricopiare niente
      if (U.calcoloLaurea) { const R = U.calcoloLaurea(u); window.UL_PREFILL = { media: R.media ? Math.round(R.media * 10) / 10 : null, lodi: R.lodi, esami: R.F.map((x) => [Number(x.e.voto), ((UL.ORE && UL.ORE.esami[x.c.code]) || {}).cfu || x.c.cfu || 9]), rest: R.resto, obiettivo: 27 }; }
      const id = params[0];
      window.ULTools.monta(el, id);
      const T = (u.activity.tool = u.activity.tool || {}); T[id] = (T[id] || 0) + 1; UL.store.save(); B.track("tool-" + id);
    },
  };
})();
