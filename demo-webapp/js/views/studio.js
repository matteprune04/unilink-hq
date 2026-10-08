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

  /* ---------- scheda Flashcard · v10 stile Anki (commento 5 del 8/10) ----------
     Panoramica dei MAZZI (tutto l'esame, ogni macroargomento, ogni capitolo, le tue carte) con i tre numeri di Anki:
     Nuove (blu) · Da imparare (rosso) · Da ripassare (verde). «Studia» apre la sessione A PAGINA INTERA: solo la carta, i voti e i tasti
     (spazio = gira, 1–4 = voto, Esc = esci). Sotto: aggiungi una carta e sfoglia le tue. */
  const conta = (u, slug, carte) => { const F = fcStato(u, slug), t = oggi(); let nuove = 0, imp = 0, rip = 0;
    carte.forEach((k) => { const s = F.s[k.id]; if (!s) nuove++; else if (s.due <= t) (s.rep === 0 ? imp++ : rip++); });
    return { nuove: Math.min(nuove, Math.max(0, NUOVE_AL_GIORNO - (F.nuoveOggi.data === t ? F.nuoveOggi.n : 0))), imp, rip, tot: carte.length }; };
  const mazzi = (u, c) => { const M = B.mazzo(c.slug, u), S = STR(c.slug), L = [{ id: "tutto", nome: "Tutto l'esame", carte: M, liv: 0 }];
    (S ? S.moduli : []).forEach((m) => { const caps = m.capitoli.map((k) => k.n), cm = M.filter((k) => caps.includes(k.cap)); if (!cm.length) return;
      L.push({ id: m.id, nome: m.titolo, carte: cm, liv: 1 }); m.capitoli.forEach((k) => { const ck = M.filter((x) => x.cap === k.n); if (ck.length) L.push({ id: "c" + k.n, nome: `${k.n} · ${k.titolo}`, carte: ck, liv: 2 }); }); });
    const gen = M.filter((k) => !k.cap); if (gen.length) L.push({ id: "c0", nome: nomeCap(c.slug, 0), carte: gen, liv: 1 });
    const mie = M.filter((k) => k.mia); if (mie.length) L.push({ id: "mie", nome: "Le tue carte", carte: mie, liv: 1 });
    return L; };
  function flashcard(u, c) {
    const F = fcStato(u, c.slug), L = mazzi(u, c), tot = conta(u, c.slug, L[0].carte);
    const n = (x, cl) => `<b class="fc-n ${cl} ${x ? "" : "zero"}">${x}</b>`;
    return `<div class="fc-overview">
      <div class="fc-oggi card"><div><span class="sq-label">Oggi</span><h2>${tot.nuove + tot.imp + tot.rip ? `${tot.nuove + tot.imp + tot.rip} carte da fare` : "Hai finito per oggi"}</h2>
        <p class="small muted">${n(tot.nuove, "nu")} nuove · ${n(tot.imp, "im")} da imparare · ${n(tot.rip, "ri")} da ripassare</p></div>
        <button class="btn btn-orange btn-arrow" data-fc-studia="tutto" ${tot.nuove + tot.imp + tot.rip ? "" : "disabled"}>Studia <span class="arr">${icon("arrow")}</span></button></div>
      <div class="card"><table class="fc-mazzi"><thead><tr><th>Mazzo</th><th title="Nuove">Nuove</th><th title="Da imparare">Imparare</th><th title="Da ripassare">Ripasso</th><th></th></tr></thead><tbody>
        ${L.slice(1).map((d) => { const k = conta(u, c.slug, d.carte); return `<tr class="liv${d.liv}"><td>${esc(d.nome)}<small>${d.carte.length} carte</small></td><td>${n(k.nuove, "nu")}</td><td>${n(k.imp, "im")}</td><td>${n(k.rip, "ri")}</td><td><button class="btn btn-sm ${k.nuove + k.imp + k.rip ? "btn-primary" : "btn-ghost"}" data-fc-studia="${d.id}" ${k.nuove + k.imp + k.rip ? "" : "disabled"}>Studia</button></td></tr>`; }).join("")}
      </tbody></table></div>
      <details class="card fc-agg"><summary><b>${icon("plus")} Aggiungi una carta</b><span class="small muted"> · ${F.mie.length} tue</span></summary>
        <form data-fc-nuova class="fc-form"><input class="input" name="f" placeholder="Fronte: domanda o termine" maxlength="200"><textarea class="textarea" name="b" rows="2" placeholder="Retro: risposta" maxlength="600"></textarea>
          <select class="select" name="cap">${capitoliDi(c.slug).map((k) => `<option value="${k.n}">${esc(nomeCap(c.slug, k.n))}</option>`).join("") || '<option value="0">Generale</option>'}</select><button class="btn btn-sm btn-primary">Aggiungi</button></form>
        ${F.mie.length ? `<ul class="lt-lista">${F.mie.map((k) => `<li><p><b style="font-weight:400">${esc(k.f)}</b></p><span class="tiny muted">${esc(k.b)}${k.pag ? " · dalla p. " + k.pag : ""}</span><button class="icon-btn" data-fc-del="${k.id}" aria-label="Cancella la carta">${icon("trash")}</button></li>`).join("")}</ul>` : ""}</details>
      <p class="tiny muted">Come Anki: ogni carta torna dopo 1 giorno, poi 6, poi a intervalli che crescono con la facilità (algoritmo SM-2). ${NUOVE_AL_GIORNO} carte nuove al giorno.${c.slug === "economia-aziendale" ? " Il mazzo viene dal glossario vero della dispensa." : ""}</p></div>`;
  }
  function montaFlashcard(root, u, c) {
    const F = fcStato(u, c.slug);
    const studia = (id) => {
      const d = mazzi(u, c).find((x) => x.id === id); if (!d) return;
      const t = oggi(); if (F.nuoveOggi.data !== t) F.nuoveOggi = { data: t, n: 0 };
      const rip = d.carte.filter((k) => F.s[k.id] && F.s[k.id].due <= t).sort((a, b) => (F.s[a.id].due < F.s[b.id].due ? -1 : 1));
      const coda = rip.concat(d.carte.filter((k) => !F.s[k.id]).slice(0, Math.max(0, NUOVE_AL_GIORNO - F.nuoveOggi.n)));
      let i = 0, girata = false;
      const ov = document.createElement("div"); ov.className = "fc-focus"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Ripasso flashcard");
      document.body.appendChild(ov); document.body.style.overflow = "hidden";
      const esci = () => { ov.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", tasti); UL.app.refresh(); };
      const disegna = () => {
        const k = coda[i], rest = coda.slice(i), nN = rest.filter((x) => !F.s[x.id]).length, nI = rest.filter((x) => F.s[x.id] && F.s[x.id].rep === 0).length;
        ov.innerHTML = `<div class="fc-f-top"><span>${esc(c.title)} · ${esc(d.nome)}</span><span class="fc-f-n"><b class="fc-n nu">${nN}</b><b class="fc-n im">${nI}</b><b class="fc-n ri">${rest.length - nN - nI}</b></span><button class="btn btn-sm btn-ghost" data-esci>Esci (Esc)</button></div>
          ${k ? `<div class="fc-f-carta"><span class="sq-label">${esc(nomeCap(c.slug, k.cap))}</span><p class="fc-f-fronte">${esc(k.f)}</p>${girata ? `<hr class="divider"><p class="fc-f-retro">${esc(k.b)}</p>` : ""}</div>
            <div class="fc-f-azioni">${girata ? [[1, "Di nuovo", "1"], [3, "Difficile", "2"], [4, "Bene", "3"], [5, "Facile", "4"]].map(([q, tx, tk]) => `<button class="fc-voto v${q}" data-q="${q}"><small>${anteprimaInt(F.s[k.id], q)}</small>${tx}<kbd>${tk}</kbd></button>`).join("") : `<button class="btn btn-primary fc-gira" data-gira>Mostra la risposta <kbd>spazio</kbd></button>`}</div>`
            : `<div class="fc-f-carta fine"><h2>Mazzo finito per oggi ${icon("check")}</h2><p class="muted">Le carte tornano quando serve. Domani riprendi da qui.</p><button class="btn btn-primary" data-esci>Torna ai mazzi</button></div>`}`;
        ov.querySelectorAll("[data-esci]").forEach((b) => (b.onclick = esci));
        const g = ov.querySelector("[data-gira]"); g && (g.onclick = () => { girata = true; disegna(); });
        ov.querySelectorAll("[data-q]").forEach((b) => (b.onclick = () => vota(Number(b.dataset.q))));
      };
      const vota = (q) => { const k = coda[i], nuova = !F.s[k.id]; F.s[k.id] = sm2(F.s[k.id], q); if (nuova) F.nuoveOggi.n++; if (q < 3) coda.push(k); UL.store.save(); i++; girata = false; disegna(); };
      const tasti = (e) => { if (e.key === "Escape") return esci(); if (!coda[i]) return; if (e.code === "Space" && !girata) { e.preventDefault(); girata = true; disegna(); } else if (girata && ["1", "2", "3", "4"].includes(e.key)) vota([1, 3, 4, 5][Number(e.key) - 1]); };
      document.addEventListener("keydown", tasti); disegna(); ov.querySelector("button") && ov.querySelector("button").focus();
    };
    root.querySelectorAll("[data-fc-studia]").forEach((b) => b.addEventListener("click", () => studia(b.dataset.fcStudia)));
    const fn = root.querySelector("[data-fc-nuova]");
    fn && fn.addEventListener("submit", (e) => { e.preventDefault(); const f = fn.f.value.trim(), b = fn.b.value.trim(); if (!f || !b) return UL.ui.toast("Scrivi fronte e retro");
      F.mie.push({ id: "mia-" + Date.now().toString(36), f, b, cap: Number(fn.cap.value) || 0, at: new Date().toISOString() }); UL.store.save(); UL.ui.toast("Carta aggiunta"); UL.app.refresh(); });
    root.querySelectorAll("[data-fc-del]").forEach((b) => b.addEventListener("click", () => { F.mie = F.mie.filter((k) => k.id !== b.dataset.fcDel); delete F.s[b.dataset.fcDel]; UL.store.save(); UL.app.refresh(); }));
  }

  /* ---------- scheda Esercizi · v10 più semplice (commento 2 del 8/10) ----------
     Prima scegli COSA fare con tre carte grandi (per capitolo · rifai gli errori · simulazione d'esame); poi, se serve, il capitolo
     da un elenco unico. Durante l'esercizio: una domanda alla volta, tempo rispetto all'esame, spiegazione e causa dell'errore. */
  const formato = (slug) => (UL.ESAME_FORMATO || {})[slug] || (UL.ESAME_FORMATO || {})._default || { domande: 12, minuti: 20 };
  const secObiettivo = (slug) => Math.round((formato(slug).minuti * 60) / formato(slug).domande);
  const inErrore = (u, q) => { const s = B.stat(u, q.id); return s.wrong > 0 && s.streak < 2; };
  const ES = (u) => (u.activity.es = Object.assign({ log: [] }, u.activity.es || {}));
  const CAUSE = [["concetto", "Non sapevo il concetto"], ["calcolo", "Errore di calcolo"], ["lettura", "Ho letto male"], ["tempo", "Andavo di fretta"]];
  const perc = (u, lista) => { const f = lista.filter((q) => B.stat(u, q.id).seen); return { fatte: f.length, giuste: lista.filter((q) => B.stat(u, q.id).streak > 0).length, tot: lista.length }; };
  function esercizi(u, c) {
    const Q = B.banca(c.slug), err = Q.filter((q) => inErrore(u, q)), ob = secObiettivo(c.slug), S = STR(c.slug), P = perc(u, Q);
    const riga = (titolo, lista, attr, liv) => { const p = perc(u, lista); return lista.length ? `<li class="liv${liv}"><span>${esc(titolo)}<small>${lista.length} domande · ${p.giuste} giuste</small></span><span class="es-bar"><i style="width:${p.tot ? (p.giuste / p.tot) * 100 : 0}%"></i></span><button class="btn btn-sm ${liv === 1 ? "btn-ghost" : "btn-primary"}" ${attr}>Inizia</button></li>` : ""; };
    return `<div class="es-scelte">
        <button class="es-scelta" data-es-vai="cap"><span class="ic">${icon("layers")}</span><b>Esercizi per capitolo</b><span>Scegli un capitolo o un macroargomento intero</span></button>
        <button class="es-scelta ${err.length ? "" : "spenta"}" data-es-rifai ${err.length ? "" : "disabled"}><span class="ic">${icon("alert")}</span><b>Rifai gli errori${err.length ? ` (${err.length})` : ""}</b><span>${err.length ? "Le domande sbagliate, finché non le indovini due volte" : "Nessun errore da rifare"}</span></button>
        <a class="es-scelta" href="#/app/esercitazioni/${c.slug}/simulazione"><span class="ic">${icon("target")}</span><b>Simulazione d'esame</b><span>${formato(c.slug).domande} domande in ${formato(c.slug).minuti} minuti, voto in trentesimi</span></a>
      </div>
      <p class="small muted es-riass">${P.tot} domande${c.slug === "economia-aziendale" ? " (70 dalla raccolta vera di Economia Aziendale)" : ""} · ${P.fatte} fatte · obiettivo ${ob} secondi a domanda${formato(c.slug).vero ? "" : " (formato d'esempio)"}</p>
      <div class="card es-capitoli" data-es-caps hidden><div class="card-head"><h3>${icon("layers")} Scegli cosa ripassare</h3><span class="small muted">10 domande per volta</span></div>
        <ul class="es-lista">${riga("Tutto l'esame", Q, 'data-es-q="tutto"', 1)}${(S ? S.moduli : []).map((m) => riga(m.titolo, Q.filter((q) => m.capitoli.some((k) => k.n === q.cap)), `data-es-q="m:${m.id}"`, 1) + m.capitoli.map((k) => riga(`${k.n} · ${k.titolo}`, Q.filter((q) => q.cap === k.n), `data-es-q="c:${k.n}"`, 2)).join("")).join("")}${riga(nomeCap(c.slug, 0), Q.filter((q) => !q.cap), 'data-es-q="c:0"', 1)}</ul></div>
      <div data-es-run></div>`;
  }
  let esTimer = null;
  function montaEsercizi(root, u, c) {
    const box = root.querySelector("[data-es-run]"); if (!box) return;
    const Q = B.banca(c.slug), S = STR(c.slug), ob = secObiettivo(c.slug);
    const caps = root.querySelector("[data-es-caps]");
    root.querySelector('[data-es-vai="cap"]').onclick = () => { caps.hidden = !caps.hidden; caps.hidden || caps.scrollIntoView({ behavior: "smooth", block: "start" }); };
    const scegli = (k) => { if (k === "tutto") return Q; const [t, v] = k.split(":"); if (t === "c") return Q.filter((q) => q.cap === Number(v)); const m = S.moduli.find((x) => x.id === v); return Q.filter((q) => m.capitoli.some((x) => x.n === q.cap)); };
    root.querySelectorAll("[data-es-q]").forEach((b) => (b.onclick = () => { const l = scegli(b.dataset.esQ), nuove = l.filter((q) => !B.stat(u, q.id).seen); corri(B.shuffle(nuove.length >= 5 ? nuove : l).slice(0, 10)); }));
    const rf = root.querySelector("[data-es-rifai]"); rf && (rf.onclick = () => corri(Q.filter((q) => inErrore(u, q)).slice(0, 15)));
    const corri = (lista) => {
      if (!lista.length) return UL.ui.toast("Nessuna domanda qui");
      caps.hidden = true; root.querySelector(".es-scelte").hidden = true; root.querySelector(".es-riass").hidden = true;
      const R = []; let i = 0, t0 = 0;
      const stop = () => { if (esTimer) { clearInterval(esTimer); esTimer = null; } };
      const fine = () => { stop(); UL.store.save();
        const ok = R.filter((r) => r.ok).length, tm = Math.round(R.reduce((n, r) => n + r.t, 0) / R.length);
        box.innerHTML = `<div class="card es-fine"><span class="sq-label">Risultato</span><h2>${ok} giuste su ${R.length}</h2>
          <p>Tempo medio ${tm} secondi a domanda · ${tm <= ob ? '<span class="badge badge-green">in linea con l\'esame</span>' : '<span class="badge badge-orange">più lento dell\'esame</span>'}</p>
          <div class="row" style="margin-top:14px">${R.some((r) => !r.ok) ? `<button class="btn btn-primary" data-es-rifai2>Rifai le ${R.filter((r) => !r.ok).length} sbagliate</button>` : ""}<button class="btn btn-ghost" data-es-chiudi>Torna agli esercizi</button></div></div>`;
        const r2 = box.querySelector("[data-es-rifai2]"); r2 && (r2.onclick = () => corri(lista.filter((q) => R.some((r) => r.id === q.id && !r.ok))));
        box.querySelector("[data-es-chiudi]").onclick = () => UL.app.refresh(); };
      const mostra = () => {
        stop(); const q = lista[i]; t0 = Date.now();
        box.innerHTML = `<div class="card es-q"><div class="es-q-top"><span class="sq-label">Domanda ${i + 1} di ${lista.length} · ${esc(nomeCap(c.slug, q.cap))}</span><span class="timer">${icon("clock")} <span data-t>0</span> s · obiettivo ${ob} s</span></div>
          <div class="es-prog"><i style="width:${(i / lista.length) * 100}%"></i></div>
          <p class="quiz-q">${esc(q.q)}</p><div class="opts">${q.opts.map((o, j) => `<button class="opt" data-o="${j}"><span class="k">${"ABCD"[j]}</span><span>${esc(o)}</span></button>`).join("")}</div><div data-es-dopo></div>
          <button class="btn btn-sm btn-ghost" style="margin-top:12px" data-es-chiudi>Interrompi</button></div>`;
        box.querySelector("[data-es-chiudi]").onclick = () => { stop(); UL.app.refresh(); };
        const tt = box.querySelector("[data-t]"); esTimer = setInterval(() => { const s = Math.round((Date.now() - t0) / 1000); tt.textContent = s; tt.parentElement.classList.toggle("lento", s > ob); }, 500);
        box.querySelectorAll(".opt").forEach((b) => (b.onclick = () => {
          stop(); const t = Math.round((Date.now() - t0) / 1000), ok = Number(b.dataset.o) === q.a;
          B.answer(u, q.id, ok); const voce = { id: q.id, ok, t, at: new Date().toISOString() }; const L = ES(u).log; L.push(voce); if (L.length > 600) L.splice(0, L.length - 600);
          R.push({ id: q.id, ok, t });
          box.querySelectorAll(".opt").forEach((x) => { x.disabled = true; if (Number(x.dataset.o) === q.a) x.classList.add("ok"); }); if (!ok) b.classList.add("ko");
          box.querySelector("[data-es-dopo]").innerHTML = `<p class="small" style="margin-top:12px">${ok ? "Giusta" : "Sbagliata"} · ${t} secondi${t <= ob ? "" : " · più lento dell'esame"}</p>
            ${q.x ? `<div class="explain"><b>Spiegazione</b><br>${esc(q.x)}</div>` : ""}
            ${ok ? "" : `<p class="sq-label" style="margin-top:12px">Perché hai sbagliato?</p><div class="chips">${CAUSE.map(([k, t2]) => `<button class="chip" data-causa="${k}">${t2}</button>`).join("")}</div>`}
            <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn btn-primary" data-es-avanti>${i < lista.length - 1 ? "Prossima" : "Vedi il risultato"}</button></div>`;
          box.querySelectorAll("[data-causa]").forEach((x) => (x.onclick = () => { voce.causa = x.dataset.causa; box.querySelectorAll("[data-causa]").forEach((y) => y.classList.toggle("on", y === x)); UL.store.save(); }));
          box.querySelector("[data-es-avanti]").onclick = () => { i++; i < lista.length ? mostra() : fine(); };
          UL.store.save();
        }));
      };
      mostra(); box.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }

  /* ---------- scheda Mappa del corso · v10 essenziale (commento 3 del 8/10): un capitolo = una riga, uno stato, una barra ---------- */
  function mappa(u, c) {
    const S = STR(c.slug), M = ((u.activity.mappa = u.activity.mappa || {})[c.slug] = (u.activity.mappa[c.slug] || {}));
    if (!S) return `<div class="card empty">${icon("map")}<p>La mappa di ${esc(c.title)} nasce dall'indice della dispensa: per questo esame non l'abbiamo ancora caricato.</p></div>`;
    const Q = B.banca(c.slug), D = B.mazzo(c.slug, u), F = fcStato(u, c.slug);
    const pct = (n) => { const q = Q.filter((x) => x.cap === n), k = D.filter((x) => x.cap === n), a = q.filter((x) => B.stat(u, x.id).streak > 0).length + k.filter((x) => F.s[x.id] && F.s[x.id].rep > 0).length; return q.length + k.length ? Math.round((a / (q.length + k.length)) * 100) : 0; };
    const ST = { "": ["Da studiare", ""], corso: ["In corso", "corso"], fatto: ["Fatto", "fatto"] };
    const fatti = S.moduli.flatMap((m) => m.capitoli).filter((k) => M[k.n] === "fatto").length, totCap = S.moduli.flatMap((m) => m.capitoli).length;
    return `<div class="mp-testa"><b>${fatti} di ${totCap} capitoli fatti</b><span class="es-bar"><i style="width:${(fatti / totCap) * 100}%"></i></span><span class="small muted">Tocca lo stato per cambiarlo. La barra è quanto sai di quel capitolo (esercizi e flashcard).</span></div>
      <div class="mp-mappa">${S.moduli.map((m, i) => `<section class="mp-mod"><h3><span>${i + 1}</span>${esc(m.titolo)}</h3>
        <ul class="mp-lista">${m.capitoli.map((k) => { const st = M[k.n] || "", p = pct(k.n); return `<li class="${ST[st][1]}"><span class="mp-tit">${k.n} · ${esc(k.titolo)}</span><span class="es-bar" title="${p}% che sai"><i style="width:${p}%"></i></span><button class="mp-stato ${ST[st][1]}" data-mp="${k.n}">${ST[st][0]}</button></li>`; }).join("")}</ul></section>`).join("")}</div>`;
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

  /* ---------- «Pronto per l'esame?» (v10, parte del valore di Plus e della Completa): esercizi 50% · flashcard 30% · mappa 20% ---------- */
  function pronto(u, c) {
    const Q = B.banca(c.slug), D = B.mazzo(c.slug, u), F = fcStato(u, c.slug), S = STR(c.slug), M = ((u.activity.mappa || {})[c.slug]) || {};
    const e = Q.length ? Q.filter((q) => B.stat(u, q.id).streak > 0).length / Q.length : 0, f = D.length ? D.filter((k) => F.s[k.id] && F.s[k.id].rep > 0).length / D.length : 0;
    const caps = S ? S.moduli.flatMap((m) => m.capitoli) : [], m = caps.length ? caps.filter((k) => M[k.n] === "fatto").length / caps.length : 0;
    const v = Math.round((e * 0.5 + f * 0.3 + m * 0.2) * 100), ex = u.activity.exams.find((x) => x.slug === c.slug) || {}, g = ex.appello ? B.daysTo(ex.appello) : null;
    const msg = v >= 80 ? "Sei pronto: tieni il ritmo con ripassi e una simulazione." : v >= 50 ? "Ci sei quasi: rifai gli errori e chiudi i capitoli aperti." : "Sei all'inizio: parti dalla dispensa e dagli esercizi del primo capitolo.";
    return `<div class="card pr-card"><div class="pr-num"><b>${v}%</b><span>pronto</span></div><div><span class="sq-label">Pronto per l'esame?${g != null && g >= 0 ? ` · appello tra ${g} giorni` : ""}</span><p style="margin:4px 0 8px">${msg}</p>
      <div class="pr-parti"><span>Esercizi ${Math.round(e * 100)}%</span><span>Flashcard ${Math.round(f * 100)}%</span><span>Capitoli fatti ${Math.round(m * 100)}%</span></div></div></div>`;
  }

  /* ---------- la macrosezione ---------- */
  // v10: la simulazione è dentro «Esercizi» (una scheda in meno)
  const SCHEDE = [["panoramica", "Panoramica", "home"], ["dispensa", "Dispensa", "book"], ["flashcard", "Flashcard", "layers"], ["esercizi", "Esercizi e simulazioni", "quiz"], ["mappa", "Mappa del corso", "map"], ["note", "Note", "edit"]];
  const SENZA = (c) => `<div class="card section">${U.lock("Con la dispensa completa di " + c.title, `Dispensa da leggere e annotare, flashcard, esercizi per capitolo e simulazioni: ${B.eur(B.prezzo("completa", c))} (invece di ${B.eur(B.prezzoPieno("completa"))}) o nel pacchetto del tuo semestre`, `data-sblocca="${c.slug}"`)}</div>`;
  UL.views.studioU = {
    title: (p) => (p[0] && B.course(p[0]) ? B.course(p[0]).title : "I miei esami"),
    render(u, params) {
      const c = params[0] && B.course(params[0]);
      if (!c) { // v10 (commenti 2 e 8 del 8/10): elenco diviso per quello che puoi fare, e cosa ottieni con ogni piano
        const lb = params[0] === "libretto", sosp = B.esitiInSospeso ? B.esitiInSospeso(u).length : 0;
        const tabs = `<div class="tabs" style="margin-bottom:18px"><a href="#/app/esami" class="${lb ? "" : "on"}">${icon("book")} I miei esami</a><a href="#/app/esami/libretto" class="${lb ? "on" : ""}">${icon("calc")} Libretto e voto di laurea</a></div>`;
        if (lb) return `<div class="page-head"><div><div class="eyebrow">${icon("book")} I miei esami</div><h1>Libretto e <span class="accent">voto di laurea</span></h1><p class="lead">I tuoi voti, la media e il voto di laurea con le regole ufficiali del tuo corso.${sosp ? ` Hai ${sosp} esami da raccontare: rispondi in Dashboard.` : ""}</p></div></div>${tabs}${U.librettoHTML(u)}`;
        const ex = u.activity.exams.map((e) => ({ e, c: B.course(e.slug) })).filter((x) => x.c), aperti = ex.filter((x) => x.e.status !== "done"), fattiE = ex.filter((x) => x.e.status === "done");
        const conDisp = aperti.filter((x) => B.owns(u, x.c.slug)), senza = aperti.filter((x) => !B.owns(u, x.c.slug));
        const giorni = (e) => { const d = e.appello ? B.daysTo(e.appello) : null; return d == null ? "data dell'appello da inserire" : d < 0 ? "appello passato" : d === 0 ? "appello oggi" : `appello tra ${d} giorni`; };
        const daRip = (c) => { const F = fcStato(u, c.slug), t = oggi(); return B.mazzo(c.slug, u).filter((k) => F.s[k.id] && F.s[k.id].due <= t).length; };
        const errori = (c) => B.banca(c.slug).filter((q) => inErrore(u, q)).length;
        const card = ({ e, c }) => { const own = B.owns(u, c.slug), lv = B.level(u, c.slug), r = own ? daRip(c) : 0, er = own ? errori(c) : 0;
          return `<article class="me-card ${own ? "own" : ""}"><div class="me-top"><span class="badge ${own ? "badge-green" : lv === "simulazione" ? "badge-yellow" : "badge-soft"}">${B.gratisPerTutti(c.slug) ? "Gratis per tutti" : own ? "Dispensa completa" : lv === "simulazione" ? "Simulazione" : "Solo anteprima"}</span><span class="small muted">${giorni(e)}</span></div>
            <h3>${esc(c.title)}</h3><p class="small muted">${UL.ui.ROMAN[c.anno]} anno · ${c.cfu || "?"} CFU${e.obiettivo ? " · obiettivo " + esc(e.obiettivo) : ""}</p>
            ${own ? `<div class="me-oggi">${r ? `<span>${icon("layers")} ${r} flashcard da ripassare</span>` : ""}${er ? `<span>${icon("alert")} ${er} errori da rifare</span>` : ""}${!r && !er ? `<span>${icon("check")} Tutto in pari</span>` : ""}</div>
              <div class="row"><a class="btn btn-primary btn-sm" href="#/app/esami/${c.slug}/dispensa">${icon("book")} Studia</a><a class="btn btn-ghost btn-sm" href="#/app/esami/${c.slug}">Apri l'esame</a></div>`
            : `<p class="small">Con la dispensa completa: dispensa da leggere e annotare, flashcard, esercizi per capitolo e simulazioni.</p>
              <div class="row"><button class="btn btn-orange btn-sm" data-sblocca="${c.slug}">Sblocca · ${B.eur(B.prezzo("completa", c))}</button><a class="btn btn-ghost btn-sm" href="#/app/esami/${c.slug}">Anteprima</a></div>`}</article>`; };
        return `<div class="page-head"><div><div class="eyebrow">${icon("book")} Studio</div><h1>I miei <span class="accent">esami</span></h1><p class="lead">Gli esami che stai preparando. Entra in un esame per studiare: dispensa, flashcard, esercizi e mappa sono tutti lì dentro.</p></div>
          <button class="btn btn-primary" data-add>${icon("plus")} Aggiungi esame</button></div>${tabs}
          ${conDisp.length ? `<h2 class="me-h">Pronti da studiare <span class="cnt">${conDisp.length}</span></h2><div class="me-grid">${conDisp.map(card).join("")}</div>` : ""}
          ${senza.length ? `<h2 class="me-h">Da sbloccare <span class="cnt">${senza.length}</span></h2><div class="me-grid">${senza.map(card).join("")}</div>` : ""}
          ${!aperti.length ? `<div class="card empty">${icon("book")}<p>Non stai preparando nessun esame. Aggiungine uno, oppure apri Economia Aziendale: è gratis per tutti.</p></div>` : ""}
          ${fattiE.length ? `<h2 class="me-h">Superati <span class="cnt">${fattiE.length}</span></h2><div class="me-fatti">${fattiE.map(({ e, c }) => `<a href="#/app/esami/libretto"><b>${esc(c.title)}</b><span>${esc(e.voto)}${e.lode ? " e lode" : ""}</span></a>`).join("")}</div>` : ""}
          <div class="me-offerta"><span class="sq-label">Cosa ottieni per ogni esame</span><div>
            <div><b>Gratis</b><span>Scheda, quiz di prova, anteprima. Economia Aziendale completa.</span></div>
            <div><b>Simulazione · ${B.eur(B.prezzo("simulazione"))}</b><span>Una prova nel formato dell'appello con correzione.</span></div>
            <div class="ev"><b>Dispensa completa · ${B.eur(B.prezzo("completa"))}</b><span>Dispensa da annotare, flashcard, esercizi per capitolo, simulazioni.</span></div>
            <div class="plus"><b>Plus · ${B.eur(B.prezzoPlus(u))}</b><span>Il coach: Planner su tutti gli esami, analisi degli errori, «pronto per l'esame?».</span></div></div>
            <a class="small" href="#/app/abbonamento">Confronta i piani →</a></div>`;
      }
      const tab = SCHEDE.some((s) => s[0] === params[1]) ? params[1] : "panoramica", own = B.owns(u, c.slug);
      const lv = B.level(u, c.slug);
      const testa = `<a href="#/app/esami" class="small display" style="text-decoration:none">← I miei esami</a>
        <div class="st-testa"><div><span class="sq-label">${esc(c.cds)} · ${UL.ui.ROMAN[c.anno]} anno · ${UL.ui.ROMAN[c.sem]} semestre${c.cfu ? " · " + c.cfu + " CFU" : ""}</span><h1>${esc(c.title)}</h1></div>
          <span class="badge ${own ? "badge-green" : lv === "simulazione" ? "badge-yellow" : "badge-soft"}">${B.gratisPerTutti(c.slug) ? "Gratis per tutti" : own ? "Dispensa completa" : lv === "simulazione" ? "Simulazione" : "Solo anteprima"}</span></div>
        <div class="tabs st-tabs" style="overflow-x:auto">${SCHEDE.map(([k, l, i]) => `<a href="#/app/esami/${c.slug}/${k}" class="${k === tab ? "on" : ""}">${icon(!own && ["dispensa", "flashcard", "esercizi", "note"].includes(k) ? "lock" : i)} ${l}</a>`).join("")}</div>`;
      let body;
      if (tab === "panoramica") body = (own ? pronto(u, c) : "") + UL.views.esamiB.render(u, [c.slug]).replace(/^\s*<a href="#\/app\/esami"[^>]*>[^<]*<\/a>/, "");
      else if (tab === "dispensa") body = own ? UL.views.lettoreU.render(u, [c.slug]).replace(/<a href="#\/app\/materiali"[\s\S]*?<div class="lt-wrap/, '<div class="lt-wrap') : SENZA(c);
      else if (tab === "flashcard") body = own ? flashcard(u, c) : SENZA(c);
      else if (tab === "esercizi") body = own ? esercizi(u, c) : (B.ownsSimulazione(u, c.slug) || B.hasQuiz(c.slug) ? UL.views.praticaB.render(u, [c.slug]).replace(/<a href="#\/app\/esercitazioni"[^>]*>[^<]*<\/a>/, "") : "") + SENZA(c);
      else if (tab === "mappa") body = mappa(u, c);
      else body = own ? note(u, c) : SENZA(c);
      return testa + `<div class="st-corpo">${body}</div>`;
    },
    mount(root, u, params) {
      const c = params[0] && B.course(params[0]);
      if (!c) { root.querySelectorAll("[data-sblocca]").forEach((b) => b.addEventListener("click", () => B.upsell(u, b.dataset.sblocca))); return params[0] === "libretto" ? U.bindLibretto(root, u) : UL.views.esamiB.mount && UL.views.esamiB.mount(root, u, []); }
      const tab = params[1] || "panoramica", own = B.owns(u, c.slug);
      root.querySelectorAll("[data-sblocca]").forEach((b) => b.addEventListener("click", () => B.upsell(u, b.dataset.sblocca)));
      if (tab === "panoramica") UL.views.esamiB.mount && UL.views.esamiB.mount(root, u, [c.slug]);
      else if (tab === "dispensa" && own) UL.views.lettoreU.mount(root, u, [c.slug]);
      else if (tab === "flashcard" && own) montaFlashcard(root, u, c);
      else if (tab === "esercizi" && own) montaEsercizi(root, u, c);
      else if (tab === "esercizi" && !own) UL.views.praticaB.mount && UL.views.praticaB.mount(root, u, [c.slug]);
      root.querySelectorAll("[data-mp]").forEach((b) => b.addEventListener("click", () => { const M = (u.activity.mappa = u.activity.mappa || {}), m = (M[c.slug] = M[c.slug] || {}), giro = { "": "corso", corso: "fatto", fatto: "" }; m[b.dataset.mp] = giro[m[b.dataset.mp] || ""]; UL.store.save(); UL.app.refresh(); }));
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
