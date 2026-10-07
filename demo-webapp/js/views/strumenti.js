/* js/views/strumenti.js — web app v8 · STRUMENTI (decisione di Matteo dell'8/10: «tool solo nella web app»).
   Gli strumenti sono quelli della landing (js/tools.js è una COPIA di demo-landing/tools.js: se ne cambi uno, copia l'altro).
   La landing li mostra in vetrina e il pulsante «Usalo gratis» porta qui: #/app/strumenti/<id>. Servono l'account (anche gratuito).
   I numeri d'uso (activity.tool[id]) alimenteranno le metriche della vetrina, mostrate solo sopra una soglia. */
(function () {
  const UL = window.UL, B = UL.B;
  const { icon, esc } = UL.ui;
  const HUB = { economia: "economia", giurisprudenza: "giurisprudenza", medicina: "medicina" };
  UL.views.strumentiU = {
    title: "Strumenti",
    render(u, params) {
      if (!window.ULTools) return `<div class="card empty">Strumenti non disponibili.</div>`;
      const hub = HUB[u.profile.area] || "economia";
      const L = window.ULTools.lista(hub).filter((t, i, a) => !(t.id === "voto-cdl" && a.some((x) => x.id === "voto")));
      const sel = L.find((t) => t.id === params[0]) || L[0];
      return `<div class="page-head"><div><div class="eyebrow">${icon("calc")} Studio</div><h1>Strumenti che fanno i <span class="accent">conti</span></h1>
          <p class="lead">Gratis con il tuo account. Le regole vengono dalla Scuola di Economia UniFi; quelle segnate «da verificare» sono di esempio.</p></div></div>
        <div class="st-tool ul-tools"><nav class="st-tlist" aria-label="Strumenti">${L.map((t) => `<a href="#/app/strumenti/${t.id}" class="${t.id === sel.id ? "on" : ""}"><span class="ico">${esc(t.icona)}</span><span><b>${esc(t.nome)}</b><small>${esc(t.desc)}${t.stato === "demo" ? " · da verificare" : ""}</small></span></a>`).join("")}</nav>
          <section><h2 style="margin-bottom:12px">${esc(sel.nome)}</h2><div data-tool-qui></div>
            <p class="tiny muted" style="margin-top:10px">Il risultato è una stima: decide sempre l'Ateneo. Per salvare media ed esami usa <a href="#/app/percorso/libretto">Il mio percorso</a>.</p></section></div>`;
    },
    mount(root, u, params) {
      const el = root.querySelector("[data-tool-qui]"); if (!el || !window.ULTools) return;
      const hub = HUB[u.profile.area] || "economia", L = window.ULTools.lista(hub), sel = L.find((t) => t.id === params[0]) || L[0];
      window.ULTools.monta(el, sel.id);
      const T = (u.activity.tool = u.activity.tool || {}); T[sel.id] = (T[sel.id] || 0) + 1; UL.store.save(); B.track("tool-" + sel.id);
    },
  };
})();
