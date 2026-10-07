/* js/views/studio.js — web app v8 · «I MIEI ESAMI» COME UNICA MACROSEZIONE DI STUDIO (commento 11 del 7/10).
   Prima: «I miei esami», «Materiali» ed «Esercitazioni» erano tre voci separate. Ora si entra nell'esame e dentro ci sono:
     Panoramica · Dispensa (lettore: evidenziatore a colori, note, flashcard dalla pagina, filigrana sotto il numero di pagina)
     · Flashcard (stile Anki, algoritmo SM-2) · Esercizi (banca per macroargomento → capitolo, tempo per domanda, registro errori)
     · Simulazione · Mappa del corso · Note.  Rotta: #/app/esami/<slug>/<scheda>. Tutto si salva da solo nel profilo.
   Dati: js/studio-dati.js (struttura e ore ufficiali) · js/studio-ea.js (esercizi e glossario veri di Economia Aziendale) · js/data-quiz.js.
   Salvataggi: activity.fc[slug] = { mie[], s{ id: { ef, rep, int, due } }, nuoveOggi{ data, n } } · activity.es = { log[] }
               activity.mappa[slug][capitolo] = "fatto" | "corso" · activity.note / activity.evid (lettore). */
(function () {
  const UL = window.UL, B = UL.B, U = UL.U;
  const { icon, esc, fmtDate } = UL.ui;
  const oggi = () => new Date().toISOString().slice(0, 10);
  const piuGiorni = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const STR = (slug) => (UL.STRUTTURA || {})[slug] || null;
  const capitoliDi = (slug) => { const s = STR(slug); return s ? s.moduli.flatMap((m) => m.capitoli.map((c) => Object.assign({ modulo: m.id, moduloTitolo: m.titolo }, c))) : []; };
  const nomeCap = (slug, n) => { if (!n) return (STR(slug) || {}).generale || "Ripasso generale"; const c = capitoliDi(slug).find((x) => x.n === n); return c ? `${n} · ${c.titolo}` : "Capitolo " + n; };
  const capDiTopic = (slug, t) => ((STR(slug) || {}).topic || {})[t] || 0;

  /* ---------- banche: esercizi e mazzo standard di flashcard ---------- */
  B.banca = (slug) => {
    const q = B.questions(slug).map((x) => ({ id: x.id, q: x.q, opts: x.opts, a: x.a, x: x.x, cap: capDiTopic(slug, x.topic) }));
    if (slug === "economia-aziendale" && window.UL_STUDIO_EA) q.push(...window.UL_STUDIO_EA.esercizi.map((e) => Object.assign({ x: "" }, e)));
    return q;
  };
  const fcStato = (u, slug) => { const F = (u.activity.fc = u.activity.fc || {}); return (F[slug] = Object.assign({ mie: [], s: {}, nuoveOggi: { data: "", n: 0 } }, F[slug] || {})); };
  B.mazzo = (slug, u) => {
    const std = slug === "economia-aziendale" && window.UL_STUDIO_EA ? window.UL_STUDIO_EA.carte.map((c) => ({ id: c.id, f: c.f, b: c.b, cap: c.cap, std: true }))
      : B.questions(slug).map((x) => ({ id: "fc-" + x.id, f: x.q, b: x.opts[x.a] + (x.x ? " — " + x.x : ""), cap: capDiTopic(slug, x.topic), std: true }));
    return std.concat(u ? fcStato(u, slug).mie.map((c) => Object.assign({ mia: true }, c)) : []);
  };
  // SM-2 (Wozniak 1990): voti Di nuovo 1 · Difficile 3 · Bene 4 · Facile 5; intervalli 1, 6, poi × facilità (min 1,3)
  const sm2 = (st, q) => {
    const s = Object.assign({ ef: 2.5, rep: 0, int: 0 }, st || {});
    if (q < 3) { s.rep = 0; s.int = 0; s.due = oggi(); }
    else { s.rep += 1; s.int = s.rep === 1 ? 1 : s.rep === 2 ? 6 : Math.round(s.int * s.ef); s.due = piuGiorni(s.int); }
    s.ef = Math.max(1.3, s.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    return s;
  };
  const anteprimaInt = (st, q) => { const s = sm2(st, q); return q < 3 ? "ora" : s.int === 1 ? "1 giorno" : s.int + " giorni"; };
  const NUOVE_AL_GIORNO = 15;

  /* ---------- scheda Flashcard ---------- */
  function flashcard(u, c) {
    const F = fcStato(u, c.slug), M = B.mazzo(c.slug, u), t = oggi();
    const nuove = M.filter((k) => !F.s[k.id]), daRip = M.filter((k) => F.s[k.id] && F.s[k.id].due <= t), imparate = M.filter((k) => F.s[k.id] && F.s[k.id].int >= 21);
    const fatteOggi = F.nuoveOggi.data === t ? F.nuoveOggi.n : 0;
    const perCap = {}; M.forEach((k) => { const p = (perCap[k.cap] = perCap[k.cap] || { tot: 0, ok: 0 }); p.tot++; if (F.s[k.id] && F.s[k.id].rep > 0) p.ok++; });
    return `<div class="grid g-ov"><section class="card c-8" data-fc-box>
        <div class="card-head"><h3>${icon("layers")} Ripasso di oggi</h3><span class="small muted">${daRip.length} da ripassare · ${Math.max(0, Math.min(nuove.length, NUOVE_AL_GIORNO - fatteOggi))} nuove</span></div>
        <div class="row" style="gap:8px;margin-bottom:12px"><label class="small muted" for="fc-cap">Capitolo</label><select class="select" id="fc-cap" style="max-width:340px"><option value="">Tutti</option>${[...new Set(M.map((k) => k.cap))].sort((a, b) => a - b).map((n) => `<option value="${n}">${esc(nomeCap(c.slug, n))}</option>`).join("")}</select></div>
        <div data-fc-sessione></div></section>
      <section class="c-4 stack">
        <div class="stat"><span class="k">${icon("layers")} Il mazzo</span><span class="v">${M.length}</span><span class="s">${M.filter((k) => k.std).length} carte UniLink${c.slug === "economia-aziendale" ? " (dal glossario vero)" : " (dalle domande)"} · ${F.mie.length} tue</span></div>
        <div class="stat"><span class="k">${icon("check")} Imparate</span><span class="v">${imparate.length}</span><span class="s">intervallo di almeno 21 giorni · ${M.length - nuove.length} viste almeno una volta</span></div>
        <div class="card"><span class="sq-label">Per capitolo</span><div class="bars-mini" style="margin-top:8px">${Object.entries(perCap).sort((a, b) => a[0] - b[0]).map(([n, p]) => `<div class="r"><span>${esc(nomeCap(c.slug, Number(n)).slice(0, 28))}</span><span class="t"><i style="width:${(p.ok / p.tot) * 100}%"></i></span><b>${p.ok}/${p.tot}</b></div>`).join("")}</div></div>
        <div class="card beige"><span class="sq-label">Crea una carta</span>
          <form data-fc-nuova style="display:grid;gap:8px;margin-top:8px"><input class="input" name="f" placeholder="Fronte: domanda o termine" maxlength="200"><textarea class="textarea" name="b" rows="2" placeholder="Retro: risposta" maxlength="600"></textarea>
            <select class="select" name="cap">${capitoliDi(c.slug).map((k) => `<option value="${k.n}">${esc(nomeCap(c.slug, k.n))}</option>`).join("") || '<option value="0">Generale</option>'}</select><button class="btn btn-sm btn-primary">Aggiungi al mazzo</button></form>
          ${F.mie.length ? `<details style="margin-top:8px"><summary class="small">Le tue carte (${F.mie.length})</summary><ul class="lt-lista">${F.mie.map((k) => `<li><p><b style="font-weight:400">${esc(k.f)}</b></p><span class="tiny muted">${esc(k.b)}${k.pag ? " · dalla p. " + k.pag : ""}</span><button class="icon-btn" data-fc-del="${k.id}" aria-label="Cancella la carta">${icon("trash")}</button></li>`).join("")}</ul></details>` : ""}</div>
        <p class="tiny muted">Algoritmo SM-2 (lo stesso storico di Anki): ogni carta torna dopo 1 giorno, poi 6, poi a intervalli che crescono con la facilità. Si salva da solo.</p></section></div>`;
  }
  function montaFlashcard(root, u, c) {
    const box = root.querySelector("[data-fc-sessione]"); if (!box) return;
    const F = fcStato(u, c.slug), sel = root.querySelector("#fc-cap");
    let coda = [], i = 0, girata = false;
    const prepara = () => {
      const t = oggi(), cap = sel.value, M = B.mazzo(c.slug, u).filter((k) => cap === "" || String(k.cap) === cap);
      if (F.nuoveOggi.data !== t) F.nuoveOggi = { data: t, n: 0 };
      const rip = M.filter((k) => F.s[k.id] && F.s[k.id].due <= t).sort((a, b) => (F.s[a.id].due < F.s[b.id].due ? -1 : 1));
      const nuove = M.filter((k) => !F.s[k.id]).slice(0, Math.max(0, NUOVE_AL_GIORNO - F.nuoveOggi.n));
      coda = rip.concat(nuove); i = 0; girata = false; disegna();
    };
    const disegna = () => {
      const k = coda[i];
      if (!k) { box.innerHTML = `<div class="fc-fine"><h3>Per oggi hai finito ${icon("check")}</h3><p class="small muted">Le carte tornano quando serve. Domani: ${B.mazzo(c.slug, u).filter((x) => F.s[x.id] && F.s[x.id].due === piuGiorni(1)).length} da ripassare.</p></div>`; return; }
      const st = F.s[k.id];
      box.innerHTML = `<div class="fc-carta ${girata ? "girata" : ""}"><span class="sq-label">${esc(nomeCap(c.slug, k.cap))} · ${st ? "ripasso" : "nuova"} · ${i + 1} di ${coda.length}</span>
          <p class="fc-f">${esc(k.f)}</p>${girata ? `<hr class="divider"><p class="fc-b">${esc(k.b)}</p>` : ""}</div>
        ${girata ? `<div class="fc-voti">${[[1, "Di nuovo"], [3, "Difficile"], [4, "Bene"], [5, "Facile"]].map(([q, t]) => `<button class="btn btn-sm ${q === 1 ? "btn-ghost" : q === 4 ? "btn-primary" : "btn-ghost"}" data-q="${q}">${t}<small>${anteprimaInt(st, q)}</small></button>`).join("")}</div>`
          : `<button class="btn btn-primary btn-block" data-gira>Mostra la risposta <span class="tiny">(spazio)</span></button>`}`;
      const g = box.querySelector("[data-gira]"); g && (g.onclick = () => { girata = true; disegna(); });
      box.querySelectorAll("[data-q]").forEach((b) => (b.onclick = () => vota(Number(b.dataset.q))));
    };
    const vota = (q) => {
      const k = coda[i], nuova = !F.s[k.id];
      F.s[k.id] = sm2(F.s[k.id], q); if (nuova) F.nuoveOggi.n++;
      if (q < 3) coda.push(k); // «Di nuovo»: torna in fondo alla sessione di oggi
      UL.store.save(); i++; girata = false; disegna();
    };
    const tasti = (e) => { if (!document.body.contains(box)) return document.removeEventListener("keydown", tasti); if (e.target.closest("input,textarea,select")) return;
      if (e.code === "Space" && !girata && coda[i]) { e.preventDefault(); girata = true; disegna(); } else if (girata && ["1", "2", "3", "4"].includes(e.key)) vota([1, 3, 4, 5][Number(e.key) - 1]); };
    document.addEventListener("keydown", tasti);
    sel.onchange = prepara;
    const fn = root.querySelector("[data-fc-nuova]");
    fn && fn.addEventListener("submit", (e) => { e.preventDefault(); const f = fn.f.value.trim(), b = fn.b.value.trim(); if (!f || !b) return UL.ui.toast("Scrivi fronte e retro");
      F.mie.push({ id: "mia-" + Date.now().toString(36), f, b, cap: Number(fn.cap.value) || 0, at: new Date().toISOString() }); UL.store.save(); UL.ui.toast("Carta aggiunta"); UL.app.refresh(); });
    root.querySelectorAll("[data-fc-del]").forEach((b) => b.addEventListener("click", () => { F.mie = F.mie.filter((k) => k.id !== b.dataset.fcDel); delete F.s[b.dataset.fcDel]; UL.store.save(); UL.app.refresh(); }));
    prepara();
  }

  /* ---------- scheda Esercizi: banca per macroargomento → capitolo, tempo per domanda, registro errori ---------- */
  const formato = (slug) => (UL.ESAME_FORMATO || {})[slug] || (UL.ESAME_FORMATO || {})._default || { domande: 12, minuti: 20 };
  const secObiettivo = (slug) => Math.round((formato(slug).minuti * 60) / formato(slug).domande);
  const inErrore = (u, q) => { const s = B.stat(u, q.id); return s.wrong > 0 && s.streak < 2; };
  const ES = (u) => (u.activity.es = Object.assign({ log: [] }, u.activity.es || {}));
  const ultimo = (u, id) => ES(u).log.slice().reverse().find((l) => l.id === id);
  const CAUSE = [["concetto", "Non sapevo il concetto"], ["calcolo", "Errore di calcolo"], ["lettura", "Ho letto male"], ["tempo", "Andavo di fretta"]];
  function esercizi(u, c) {
    const Q = B.banca(c.slug), caps = capitoliDi(c.slug), err = Q.filter((q) => inErrore(u, q)), ob = secObiettivo(c.slug);
    const cnt = (f) => Q.filter(f).length, fatte = (f) => Q.filter((q) => f(q) && B.stat(u, q.id).seen).length;
    const moduli = (STR(c.slug) || { moduli: [] }).moduli;
    const L = ES(u).log.filter((l) => Q.some((q) => q.id === l.id)), tMedio = L.length ? Math.round(L.reduce((n, l) => n + l.t, 0) / L.length) : 0;
    return `<div class="grid g-ov"><section class="card c-8">
        <div class="card-head"><h3>${icon("quiz")} Banca esercizi</h3><span class="small muted">${Q.length} domande${c.slug === "economia-aziendale" ? " · 70 dalla raccolta vera di Economia Aziendale" : ""}</span></div>
        <p class="small muted" style="margin-bottom:10px">Scegli un macroargomento intero o un solo capitolo, come preferisci studiare. ${(STR(c.slug) || {}).vera ? "Capitoli = indice della dispensa." : "Struttura di esempio: diventerà l'indice della dispensa."}</p>
        <div class="es-filtri">
          <label class="sq-label">Macroargomento</label><div class="chips" data-es-mod><button class="chip on" data-m="">Tutti · ${Q.length}</button>${moduli.map((m) => `<button class="chip" data-m="${m.id}">${esc(m.titolo)} · ${cnt((q) => caps.some((k) => k.n === q.cap && k.modulo === m.id))}</button>`).join("")}${cnt((q) => !q.cap) ? `<button class="chip" data-m="0">Generale · ${cnt((q) => !q.cap)}</button>` : ""}</div>
          <label class="sq-label">Capitolo</label><div class="chips" data-es-cap></div>
          <label class="sq-label">Quali domande</label><div class="seg" data-es-tipo><button class="on" data-t="tutte">Tutte</button><button data-t="nuove">Mai fatte</button><button data-t="errori">Registro errori</button></div>
          <label class="sq-label">Quante</label><div class="seg" data-es-n><button data-n="5">5</button><button class="on" data-n="10">10</button><button data-n="20">20</button><button data-n="999">Tutte</button></div>
        </div>
        <div class="row between" style="margin-top:14px"><span class="small" data-es-conta></span><button class="btn btn-orange" data-es-via>Inizia</button></div>
        <div data-es-run style="margin-top:16px"></div></section>
      <section class="c-4 stack">
        <div class="stat"><span class="k">${icon("clock")} Tempo per domanda</span><span class="v">${tMedio ? tMedio + "″" : "—"}</span><span class="s">obiettivo ${ob}″ (${formato(c.slug).domande} domande in ${formato(c.slug).minuti}′${formato(c.slug).vero ? "" : ", formato d'esempio da verificare"})</span></div>
        <div class="stat"><span class="k">${icon("check")} Fatte almeno una volta</span><span class="v">${fatte(() => true)} / ${Q.length}</span><span class="s">${L.length} risposte registrate</span></div>
        <div class="card"><div class="card-head"><h3>${icon("alert")} Registro errori</h3><span class="badge ${err.length ? "badge-red" : "badge-soft"}">${err.length}</span></div>
          ${err.length ? `<ul class="feed">${err.slice(0, 6).map((q) => { const l = ultimo(u, q.id) || {}; return `<li><span class="ic">${icon("x")}</span><div>${esc(q.q.slice(0, 80))}${q.q.length > 80 ? "…" : ""}<time>${esc(nomeCap(c.slug, q.cap))}${l.causa ? " · " + esc((CAUSE.find((x) => x[0] === l.causa) || [])[1] || "") : ""}${l.t ? " · " + l.t + "″" : ""}</time></div></li>`; }).join("")}</ul>
            <button class="btn btn-sm btn-primary" style="margin-top:10px" data-es-rifai>Rifai le sbagliate (${err.length})</button>` : '<p class="small muted">Nessun errore da rifare. Le domande sbagliate restano qui finché non le indovini due volte di fila.</p>'}</div>
        ${(() => { const per = {}; ES(u).log.filter((l) => l.causa && Q.some((q) => q.id === l.id)).forEach((l) => (per[l.causa] = (per[l.causa] || 0) + 1)); const tot = Object.values(per).reduce((a, b) => a + b, 0);
          return tot ? `<div class="card"><span class="sq-label">Perché sbagli</span><div class="bars-mini" style="margin-top:8px">${CAUSE.map(([k, t]) => `<div class="r"><span>${t}</span><span class="t"><i style="width:${((per[k] || 0) / tot) * 100}%"></i></span><b>${per[k] || 0}</b></div>`).join("")}</div></div>` : ""; })()}
      </section></div>`;
  }
  let esTimer = null;
  function montaEsercizi(root, u, c) {
    const box = root.querySelector("[data-es-run]"); if (!box) return;
    const Q = B.banca(c.slug), caps = capitoliDi(c.slug), ob = secObiettivo(c.slug);
    const f = { m: "", cap: "", tipo: "tutte", n: 10 };
    const filtra = () => Q.filter((q) => (f.m === "" || (f.m === "0" ? !q.cap : caps.some((k) => k.n === q.cap && k.modulo === f.m))) && (f.cap === "" || String(q.cap) === f.cap)
      && (f.tipo === "tutte" || (f.tipo === "nuove" ? !B.stat(u, q.id).seen : inErrore(u, q))));
    const capBox = root.querySelector("[data-es-cap]"), conta = root.querySelector("[data-es-conta]");
    const ridisegna = () => {
      const visibili = caps.filter((k) => f.m === "" || k.modulo === f.m);
      capBox.innerHTML = `<button class="chip ${f.cap === "" ? "on" : ""}" data-c="">Tutti</button>` + visibili.map((k) => `<button class="chip ${f.cap === String(k.n) ? "on" : ""}" data-c="${k.n}">${esc(nomeCap(c.slug, k.n))} · ${Q.filter((q) => q.cap === k.n).length}</button>`).join("");
      capBox.querySelectorAll("[data-c]").forEach((b) => (b.onclick = () => { f.cap = b.dataset.c; ridisegna(); }));
      conta.textContent = `${Math.min(f.n, filtra().length)} domande su ${filtra().length} disponibili con questi filtri`;
    };
    const gruppo = (sel, k, cb) => root.querySelectorAll(sel + " button").forEach((b) => (b.onclick = () => { root.querySelectorAll(sel + " button").forEach((x) => x.classList.toggle("on", x === b)); f[k] = b.dataset[cb]; if (k === "m") f.cap = ""; ridisegna(); }));
    gruppo("[data-es-mod]", "m", "m"); gruppo("[data-es-tipo]", "tipo", "t"); gruppo("[data-es-n]", "n", "n");
    const corri = (lista) => {
      if (!lista.length) return UL.ui.toast("Nessuna domanda con questi filtri");
      const R = []; let i = 0, t0 = 0;
      const stop = () => { if (esTimer) { clearInterval(esTimer); esTimer = null; } };
      const fine = () => { stop(); UL.store.save();
        const ok = R.filter((r) => r.ok).length, tm = Math.round(R.reduce((n, r) => n + r.t, 0) / R.length), perCap = {};
        R.forEach((r) => { const p = (perCap[r.cap] = perCap[r.cap] || { n: 0, ok: 0 }); p.n++; if (r.ok) p.ok++; });
        box.innerHTML = `<div class="card beige"><h3>${ok} giuste su ${R.length}</h3><p class="small" style="margin-top:6px">Tempo medio ${tm}″ per domanda · obiettivo ${ob}″ · <b style="font-weight:400;color:${tm <= ob ? "var(--green)" : "var(--red)"}">${tm <= ob ? "sei in linea con i tempi dell'esame" : "sei più lento dell'esame: allena la velocità"}</b></p>
          <div class="table-wrap" style="margin-top:10px"><table class="table"><thead><tr><th>Capitolo</th><th class="num">Giuste</th></tr></thead><tbody>${Object.entries(perCap).map(([n, p]) => `<tr><td>${esc(nomeCap(c.slug, Number(n)))}</td><td class="num">${p.ok}/${p.n}</td></tr>`).join("")}</tbody></table></div>
          <div class="row" style="margin-top:12px">${R.some((r) => !r.ok) ? `<button class="btn btn-primary btn-sm" data-es-rifai2>Rifai le ${R.filter((r) => !r.ok).length} sbagliate</button>` : ""}<button class="btn btn-ghost btn-sm" data-es-chiudi>Aggiorna i numeri</button></div></div>`;
        const r2 = box.querySelector("[data-es-rifai2]"); r2 && (r2.onclick = () => corri(lista.filter((q) => R.some((r) => r.id === q.id && !r.ok))));
        box.querySelector("[data-es-chiudi]").onclick = () => UL.app.refresh();
      };
      const mostra = () => {
        stop(); const q = lista[i]; t0 = Date.now();
        box.innerHTML = `<div class="quiz" style="max-width:none"><div class="quiz-top"><span class="sq-label">${i + 1} di ${lista.length} · ${esc(nomeCap(c.slug, q.cap))}</span><span class="timer">${icon("clock")} <span data-t>0″</span> / ${ob}″</span></div>
          <p class="quiz-q">${esc(q.q)}</p><div class="opts">${q.opts.map((o, j) => `<button class="opt" data-o="${j}"><span class="k">${"ABCD"[j]}</span><span>${esc(o)}</span></button>`).join("")}</div><div data-es-dopo></div></div>`;
        const tt = box.querySelector("[data-t]"); esTimer = setInterval(() => { const s = Math.round((Date.now() - t0) / 1000); tt.textContent = s + "″"; tt.style.color = s > ob ? "var(--red)" : ""; }, 500);
        box.querySelectorAll(".opt").forEach((b) => (b.onclick = () => {
          stop(); const t = Math.round((Date.now() - t0) / 1000), ok = Number(b.dataset.o) === q.a;
          B.answer(u, q.id, ok); const voce = { id: q.id, ok, t, at: new Date().toISOString() }; const L = ES(u).log; L.push(voce); if (L.length > 600) L.splice(0, L.length - 600);
          R.push({ id: q.id, ok, t, cap: q.cap });
          box.querySelectorAll(".opt").forEach((x) => { x.disabled = true; if (Number(x.dataset.o) === q.a) x.classList.add("ok"); }); if (!ok) b.classList.add("ko");
          box.querySelector("[data-es-dopo]").innerHTML = `<p class="small" style="margin-top:10px">${t}″ · ${t <= ob ? '<span class="badge badge-green">in linea con l\'esame</span>' : '<span class="badge badge-orange">più lento dell\'esame</span>'}</p>
            ${q.x ? `<div class="explain"><b>Spiegazione</b><br>${esc(q.x)}</div>` : ""}
            ${ok ? "" : `<p class="sq-label" style="margin-top:10px">Perché hai sbagliato? (resta nel registro)</p><div class="chips">${CAUSE.map(([k, t2]) => `<button class="chip" data-causa="${k}">${t2}</button>`).join("")}</div>`}
            <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn btn-sm btn-primary" data-es-avanti>${i < lista.length - 1 ? "Prossima" : "Risultato"}</button></div>`;
          box.querySelectorAll("[data-causa]").forEach((x) => (x.onclick = () => { voce.causa = x.dataset.causa; box.querySelectorAll("[data-causa]").forEach((y) => y.classList.toggle("on", y === x)); UL.store.save(); }));
          box.querySelector("[data-es-avanti]").onclick = () => { i++; i < lista.length ? mostra() : fine(); };
          UL.store.save();
        }));
      };
      mostra(); box.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    root.querySelector("[data-es-via]").onclick = () => corri(B.shuffle(filtra()).slice(0, f.n));
    const rf = root.querySelector("[data-es-rifai]"); rf && (rf.onclick = () => corri(Q.filter((q) => inErrore(u, q))));
    ridisegna();
  }

  /* ---------- scheda Mappa del corso: l'indice come mappa, con lo stato di ogni capitolo ---------- */
  function mappa(u, c) {
    const S = STR(c.slug), M = ((u.activity.mappa = u.activity.mappa || {})[c.slug] = (u.activity.mappa[c.slug] || {}));
    if (!S) return `<div class="card empty">${icon("map")}<p>La mappa di ${esc(c.title)} nasce dall'indice della dispensa: per questo esame non l'abbiamo ancora caricato.</p></div>`;
    const Q = B.banca(c.slug), D = B.mazzo(c.slug, u), F = fcStato(u, c.slug);
    const dati = (n) => { const q = Q.filter((x) => x.cap === n), giuste = q.filter((x) => B.stat(u, x.id).streak > 0).length, k = D.filter((x) => x.cap === n), imp = k.filter((x) => F.s[x.id] && F.s[x.id].rep > 0).length; return { q: q.length, giuste, k: k.length, imp }; };
    const STATI = [["", "Da studiare"], ["corso", "In corso"], ["fatto", "Fatto"]];
    return `<p class="small muted" style="margin-bottom:12px">La mappa del corso: ${esc(S.fonte)}. Per ogni capitolo vedi esercizi e flashcard e segni a che punto sei. Le mappe concettuali disegnate sono rimandate (meeting del 7/10).</p>
      <div class="mp-mappa">${S.moduli.map((m, i) => `<section class="mp-mod"><span class="sq-label">Macroargomento ${i + 1}</span><h3>${esc(m.titolo)}</h3>
        <div class="mp-caps">${m.capitoli.map((k) => { const d = dati(k.n), st = M[k.n] || ""; return `<div class="mp-cap ${st}"><div class="row between"><b>${k.n} · ${esc(k.titolo)}</b><select class="select mp-sel" data-mp="${k.n}" aria-label="Stato del capitolo ${k.n}">${STATI.map(([v, t]) => `<option value="${v}" ${v === st ? "selected" : ""}>${t}</option>`).join("")}</select></div>
          <div class="mp-num"><span>${icon("quiz")} ${d.giuste}/${d.q} esercizi</span><span>${icon("layers")} ${d.imp}/${d.k} flashcard</span></div>
          ${k.sezioni ? `<details><summary class="tiny">${k.sezioni.length} paragrafi</summary><ul class="g-lista">${k.sezioni.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></details>` : ""}</div>`; }).join("")}</div></section>`).join("")}</div>`;
  }

  /* ---------- scheda Note: note ed evidenziazioni della dispensa, per pagina ---------- */
  function note(u, c) {
    const N = ((u.activity.note || {})[c.slug]) || {}, E = ((u.activity.evid || {})[c.slug]) || {};
    const pagine = [...new Set(Object.keys(N).concat(Object.keys(E)))].map(Number).sort((a, b) => a - b);
    if (!pagine.length) return `<div class="card empty">${icon("edit")}<p>Ancora niente. Nella scheda Dispensa evidenzi a colori e scrivi note su ogni pagina: le ritrovi tutte qui.</p><a class="btn btn-primary" style="margin-top:12px" href="#/app/esami/${c.slug}/dispensa">Apri la dispensa</a></div>`;
    const COL = { g: "giallo", v: "verde", a: "azzurro", r: "rosa" };
    return `<div class="card"><div class="card-head"><h3>${icon("edit")} Le tue note su ${esc(c.title)}</h3><span class="small muted">${pagine.length} pagine</span></div>
      <ul class="feed">${pagine.map((p) => `<li><span class="ic">${icon("file")}</span><div><button class="link small" data-vai-pag="${p}">Pagina ${p} →</button>
        ${(E[p] || []).length ? `<span class="tiny muted"> · ${E[p].length} evidenziazioni (${[...new Set(E[p].map((x) => COL[x.c] || x.c))].join(", ")})</span>` : ""}
        ${(N[p] || []).map((x) => `<p class="small" style="margin-top:4px">${esc(x.testo)}</p>`).join("")}</div></li>`).join("")}</ul></div>`;
  }

  /* ---------- la macrosezione ---------- */
  const SCHEDE = [["panoramica", "Panoramica", "home"], ["dispensa", "Dispensa", "book"], ["flashcard", "Flashcard", "layers"], ["esercizi", "Esercizi", "quiz"], ["simulazione", "Simulazione", "target"], ["mappa", "Mappa del corso", "map"], ["note", "Note", "edit"]];
  const SENZA = (c) => `<div class="card section">${U.lock("Con la dispensa completa di " + c.title, `Dispensa da leggere e annotare, flashcard, esercizi per capitolo e simulazioni: ${B.eur(B.prezzo("completa", c))} (invece di ${B.eur(B.prezzoPieno("completa"))}) o nel pacchetto del tuo semestre`, `data-sblocca="${c.slug}"`)}</div>`;
  UL.views.studioU = {
    title: (p) => (p[0] && B.course(p[0]) ? B.course(p[0]).title : "I miei esami"),
    render(u, params) {
      const c = params[0] && B.course(params[0]);
      if (!c) { // elenco: in preparazione · libretto e voto di laurea (commento 5 del 7/10: dentro «I miei esami», non una sezione a parte)
        const lb = params[0] === "libretto", sosp = B.esitiInSospeso ? B.esitiInSospeso(u).length : 0;
        const tabs = `<div class="tabs" style="margin-bottom:16px"><a href="#/app/esami" class="${lb ? "" : "on"}">${icon("book")} In preparazione</a><a href="#/app/esami/libretto" class="${lb ? "on" : ""}">${icon("calc")} Libretto e voto di laurea</a></div>`;
        if (!lb) return UL.views.esamiB.render(u, []).replace(/(<\/div><\/div>)/, "$1" + tabs);
        return `<div class="page-head"><div><div class="eyebrow">${icon("book")} I miei esami</div><h1>Libretto e <span class="accent">voto di laurea</span></h1><p class="lead">I tuoi voti, la media e il voto di laurea con le regole ufficiali del tuo corso.${sosp ? ` Hai ${sosp} esami da raccontare: rispondi in Dashboard.` : ""}</p></div></div>${tabs}${U.librettoHTML(u)}`;
      }
      const tab = SCHEDE.some((s) => s[0] === params[1]) ? params[1] : "panoramica", own = B.owns(u, c.slug);
      const lv = B.level(u, c.slug);
      const testa = `<a href="#/app/esami" class="small display" style="text-decoration:none">← I miei esami</a>
        <div class="st-testa"><div><span class="sq-label">${esc(c.cds)} · ${UL.ui.ROMAN[c.anno]} anno · ${UL.ui.ROMAN[c.sem]} semestre${c.cfu ? " · " + c.cfu + " CFU" : ""}</span><h1>${esc(c.title)}</h1></div>
          <span class="badge ${own ? "badge-green" : lv === "simulazione" ? "badge-yellow" : "badge-soft"}">${B.gratisPerTutti(c.slug) ? "Gratis per tutti" : own ? "Dispensa completa" : lv === "simulazione" ? "Simulazione" : "Solo anteprima"}</span></div>
        <div class="tabs st-tabs" style="overflow-x:auto">${SCHEDE.map(([k, l, i]) => `<a href="#/app/esami/${c.slug}/${k}" class="${k === tab ? "on" : ""}">${icon(!own && ["dispensa", "flashcard", "esercizi", "note"].includes(k) ? "lock" : i)} ${l}</a>`).join("")}</div>`;
      let body;
      if (tab === "panoramica") body = UL.views.esamiB.render(u, [c.slug]).replace(/^\s*<a href="#\/app\/esami"[^>]*>[^<]*<\/a>/, "");
      else if (tab === "dispensa") body = own ? UL.views.lettoreU.render(u, [c.slug]).replace(/<a href="#\/app\/materiali"[\s\S]*?<div class="lt-wrap"/, '<div class="lt-wrap"') : SENZA(c);
      else if (tab === "flashcard") body = own ? flashcard(u, c) : SENZA(c);
      else if (tab === "esercizi") body = own ? esercizi(u, c) : SENZA(c) + (B.hasQuiz(c.slug) ? `<p class="small muted" style="margin-top:10px">Intanto c'è il <a href="#/app/esami/${c.slug}/simulazione">quiz di prova gratuito</a>.</p>` : "");
      else if (tab === "simulazione") body = UL.views.praticaB.render(u, [c.slug]).replace(/<a href="#\/app\/esercitazioni"[^>]*>[^<]*<\/a>/, "");
      else if (tab === "mappa") body = mappa(u, c);
      else body = own ? note(u, c) : SENZA(c);
      return testa + `<div class="st-corpo">${body}</div>`;
    },
    mount(root, u, params) {
      const c = params[0] && B.course(params[0]);
      if (!c) return params[0] === "libretto" ? U.bindLibretto(root, u) : UL.views.esamiB.mount && UL.views.esamiB.mount(root, u, []);
      const tab = params[1] || "panoramica", own = B.owns(u, c.slug);
      root.querySelectorAll("[data-sblocca]").forEach((b) => b.addEventListener("click", () => B.upsell(u, b.dataset.sblocca)));
      if (tab === "panoramica") UL.views.esamiB.mount && UL.views.esamiB.mount(root, u, [c.slug]);
      else if (tab === "dispensa" && own) UL.views.lettoreU.mount(root, u, [c.slug]);
      else if (tab === "flashcard" && own) montaFlashcard(root, u, c);
      else if (tab === "esercizi" && own) montaEsercizi(root, u, c);
      else if (tab === "simulazione") UL.views.praticaB.mount && UL.views.praticaB.mount(root, u, [c.slug]);
      root.querySelectorAll("[data-mp]").forEach((s) => s.addEventListener("change", () => { const M = (u.activity.mappa = u.activity.mappa || {}); (M[c.slug] = M[c.slug] || {})[s.dataset.mp] = s.value; UL.store.save(); s.closest(".mp-cap").className = "mp-cap " + s.value; UL.ui.toast("Salvato"); }));
      root.querySelectorAll("[data-vai-pag]").forEach((b) => b.addEventListener("click", () => { (u.activity.letture = u.activity.letture || {})[c.slug] = Number(b.dataset.vaiPag); UL.store.save(); UL.app.go(`#/app/esami/${c.slug}/dispensa`); }));
    },
  };

  /* ---------- tabella per esame: cosa c'è e cosa serve per il kit di studio completo (sezione del team) ---------- */
  UL.views.kitU = {
    title: "Kit di studio per esame",
    render() {
      const si = (x) => x ? `<span class="v4-ok">${icon("check")}</span>` : '<span class="v4-no">—</span>';
      const righe = B.courses().map((c) => { const o = (UL.ORE && UL.ORE.esami[c.code]) || null, S = STR(c.slug), q = B.banca(c.slug).length, k = B.mazzo(c.slug).length;
        return `<tr><td><a href="#/app/esami/${c.slug}">${esc(c.title)}</a><div class="tiny muted">${esc(c.code || "")} · ${UL.ui.ROMAN[c.anno]} anno</div></td><td class="num">${o ? o.cfu + " / " + o.ore + " h / " + (o.cfu * 25 - o.ore) + " h" : (c.cfu || "?") + " CFU · stima"}</td>
          <td>${si(!!c.pdf)}</td><td>${S ? (S.vera ? '<span class="badge badge-green">vero</span>' : '<span class="badge badge-yellow">esempio</span>') : si(false)}</td>
          <td class="num">${q || "—"}</td><td class="num">${k || "—"}</td><td>${si(B.haSimulazione(c))}</td><td>${si(!!c.mappe)}</td><td>${((UL.ESAME_FORMATO || {})[c.slug] || {}).vero ? si(true) : '<span class="tiny muted">da Moodle</span>'}</td></tr>`; }).join("");
      const DA = [
        ["Indice della dispensa (macroargomenti → capitoli → paragrafi)", "Dai sorgenti Typst della dispensa, raggruppato nei moduli del programma UniFi (come già fatto per Economia Aziendale)", "Per esercizi, flashcard, mappa del corso e Planner"],
        ["Banca esercizi: almeno 8–10 domande per capitolo, con spiegazione e capitolo", "Dalle raccolte che abbiamo (es. 70 domande vere di Economia Aziendale), dai Moodle e dagli appelli rielaborati (mai copiati, decisione del 7/10); la spiegazione la scrive il team con l'AI", "Esercizi per capitolo, registro errori, simulazioni"],
        ["Mazzo standard di flashcard: 60–120 carte per esame", "Dal glossario della dispensa (Economia Aziendale ne ha già 105) e dalle definizioni chiave dei capitoli", "Flashcard SM-2"],
        ["Formato della prova: numero di domande, minuti, scritto/orale per partizione", "Moodle del corso e Course Catalogue UniFi (verifica_apprendimento): già nelle «Informazioni utili»", "Tempo obiettivo per domanda e simulazione realistica"],
        ["Ore ufficiali (CFU e ore di lezione)", "Course Catalogue UniFi, già scaricate per 31 esami su 34 (js/studio-dati.js)", "Ore che servono nel Planner"],
        ["Tempi reali di studio", "Si misurano: il lettore e gli esercizi registrano i tempi; dopo una sessione d'esame si calibrano le fasce del Planner", "Planner senza numeri inventati"],
        ["Mappe concettuali", "Rimandate (meeting del 7/10); intanto la mappa del corso viene dall'indice", "Ripasso visivo"],
      ];
      return `<div class="page-head"><div><div class="eyebrow">${icon("layers")} Sezione di lavoro del team</div><h1>Kit di studio <span class="accent">per esame</span></h1>
          <p class="lead">Per ogni esame: cosa c'è già e cosa manca per avere dispensa, esercizi per capitolo, flashcard, simulazione e Planner completi.</p></div></div>
        <div class="card section"><div class="table-wrap"><table class="table"><thead><tr><th>Esame</th><th class="num">CFU / lezione / studio</th><th>Dispensa</th><th>Indice per capitoli</th><th class="num">Esercizi</th><th class="num">Flashcard</th><th>Simulazione</th><th>Mappe</th><th>Formato prova</th></tr></thead><tbody>${righe}</tbody></table></div>
          <p class="tiny muted" style="margin-top:8px">${esc((UL.ORE || {}).fonte || "")}. «Esercizi» e «Flashcard» contano quello che c'è oggi nella demo.</p></div>
        <div class="card section"><div class="card-head"><h3>${icon("check")} Cosa serve per ogni esame, e da dove lo prendiamo</h3></div>
          <div class="table-wrap"><table class="table"><thead><tr><th>Cosa</th><th>Da dove</th><th>A cosa serve</th></tr></thead><tbody>${DA.map((r) => `<tr>${r.map((x) => `<td class="small">${esc(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>
        ${(() => { const E = U.esitiRiepilogo ? U.esitiRiepilogo() : []; const n2 = (x) => (x == null ? "—" : x.toFixed(1).replace(".", ","));
          return `<div class="card section"><div class="card-head"><h3>${icon("db")} Esiti degli appelli · database «Com'è andato l'esame?»</h3><span class="small muted">${E.reduce((s, x) => s + x.n, 0)} risposte</span></div>
            ${E.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Esame</th><th class="num">Risposte</th><th class="num">Superati</th><th class="num">Voto medio</th><th class="num">Difficoltà</th><th class="num">Utilità UniLink</th><th>Capitoli più chiesti</th></tr></thead><tbody>${E.map((x) => `<tr><td>${esc((B.course(x.slug) || {}).title || x.slug)}</td><td class="num">${x.n}</td><td class="num">${x.sup}</td><td class="num">${n2(x.voto)}</td><td class="num">${n2(x.diff)}</td><td class="num">${n2(x.util)}</td><td class="small">${x.args.map(([a, k]) => `cap. ${a} (${k})`).join(" · ") || "—"}</td></tr>`).join("")}</tbody></table></div>` : '<p class="small muted">Ancora nessuna risposta. Il questionario compare in Dashboard il giorno dopo l\'appello (prova con l\'account Gratuito: Diritto Pubblico).</p>'}
            <p class="tiny muted" style="margin-top:8px">Demo: le risposte stanno in questo browser (senza nome né email). In produzione: tabella «esiti» su Supabase, letta solo dal team.</p></div>`; })()}`;
    },
  };
})();
