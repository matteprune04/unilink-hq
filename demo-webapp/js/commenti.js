/* js/commenti.js — COMMENTI DEL TEAM SULLA DEMO (strumento di lavoro, non fa parte del prodotto)
   Cosa fa   Pulsante «Commenti» fisso: commenti su una SEZIONE (clic sulla sezione) o su tutta la PAGINA.
             Ogni commento resta sulla pagina con un segnaposto numerato; elenco per pagina o completo;
             risolvi/riapri/elimina; download in PDF (stampa → «Salva come PDF»), in Markdown (da dare all'AI)
             e in JSON (per passarli a un altro membro del team, che li importa).
   Dove      I commenti stanno nel browser (localStorage, chiave KEY) e NON si cancellano con «Ripristina dati demo».
   Archivio  [v4] Scaricandoli (PDF, .md o JSON) i commenti vengono ARCHIVIATI: escono dalle pagine e restano nella scheda
             «Archivio» del pannello, da cui si riscaricano o si ripristinano. L'archivio va anche nell'HQ (js/archivio-commenti.js:
             Supabase, tabella docs, col «demo_commenti») così chi accede all'HQ lo vede e lo scarica.
   Comment   { id, n, versione, rotta, pagina, sezione (titolo leggibile), path (posizione nel DOM), tipo, priorita,
             testo, autore, vista (account con cui si guardava), stato: aperto|risolto, at }
   Rimuovere togliere <script src="js/commenti.js"> da index.html. */
(function () {
  const UL = window.UL;
  const { icon, esc } = UL.ui;
  const KEY = "ul_unilink_commenti", AUT = "ul_unilink_commenti_autore", STO = "ul_unilink_commenti_storico";
  const ARC = window.UL_ARCHIVIO;
  const storico = () => get(STO, []);
  const saveSto = (l) => put(STO, l);
  const TIPI = ["Miglioramento", "Problema", "Domanda", "Idea"], PRIO = ["Alta", "Media", "Bassa"];
  // elementi che contano come «sezione» commentabile (classi del design A)
  const SEZ = ".page-head, .card, .plan, .mode, .stat, .exam-hero, .feature, .course, .banner, .tabs, .side-card, .side-foot, .topbar, .table-wrap, .soon-hero, .auth-side, .auth-form-wrap, [data-onb], .pricing, .modal";

  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || "null") || d; } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { UL.ui.toast("Impossibile salvare i commenti in questo browser", "err"); } };
  const all = () => get(KEY, []);
  const saveAll = (l) => { put(KEY, l); refresh(); };
  const rotta = () => (location.hash.replace(/^#\/?/, "").replace(/\//g, ".") || "login");
  const pagina = () => document.title.replace(/ · unilink$/, "");
  const vista = () => { const u = UL.store.currentUser && UL.store.currentUser(); if (!u) return "non connesso"; const d = (UL.DEMO || []).find((x) => x.email === u.email); return (d ? d.label + " · " : "") + u.profile.nome; };
  const when = (iso) => new Date(iso).toLocaleString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  /* ---------- posizione di una sezione: percorso di indici dal body (stabile finché la pagina non cambia struttura) ---------- */
  function pathOf(el) {
    const out = [];
    for (let n = el; n && n !== document.body; n = n.parentElement) out.unshift([...n.parentElement.children].filter((c) => !c.classList.contains("comm-ui")).indexOf(n));
    return out.join(".");
  }
  function byPath(p) {
    let n = document.body;
    for (const i of String(p).split(".")) { const kids = [...n.children].filter((c) => !c.classList.contains("comm-ui")); n = kids[Number(i)]; if (!n) return null; }
    return n;
  }
  function labelOf(el) {
    const h = el.querySelector("h1, h2, h3, .sq-label, .eyebrow, b, th");
    const t = ((h && h.innerText) || el.innerText || "").replace(/\s+/g, " ").trim();
    return (t.slice(0, 70) || el.className.split(" ")[0]) + (t.length > 70 ? "…" : "");
  }

  /* ---------- interfaccia fissa ---------- */
  const btn = document.createElement("button");
  btn.className = "btn btn-sm btn-orange comm-btn comm-ui";
  btn.addEventListener("click", () => panel());
  document.body.appendChild(btn);
  const hint = document.createElement("div");
  hint.className = "comm-hint comm-ui";
  hint.innerHTML = `${icon("edit")} <span>Clicca la sezione da commentare · <b>Esc</b> per annullare</span>`;
  document.body.appendChild(hint);

  /* ---------- segnaposto sulle sezioni commentate ---------- */
  let busy = false;
  function placePins() {
    busy = true;
    document.querySelectorAll(".comm-pin").forEach((x) => x.remove());
    document.querySelectorAll(".comm-host").forEach((x) => x.classList.remove("comm-host"));
    const qui = all().filter((c) => c.rotta === rotta() && c.stato !== "risolto");
    qui.forEach((c) => {
      const el = c.path ? byPath(c.path) : null;
      if (!el || el === document.body) return;
      if (getComputedStyle(el).position === "static") el.classList.add("comm-host"); // non toccare elementi fixed/sticky
      const pin = document.createElement("button");
      pin.className = "comm-pin comm-ui"; pin.textContent = c.n; pin.title = c.testo;
      pin.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); panel(c.id); });
      el.appendChild(pin);
    });
    const n = all().filter((c) => c.rotta === rotta() && c.stato !== "risolto").length, tot = all().filter((c) => c.stato !== "risolto").length;
    btn.innerHTML = `${icon("edit")} Commenti${n ? ` <span class="comm-cnt">${n}</span>` : tot ? ` <span class="comm-cnt comm-cnt-soft">${tot}</span>` : ""}`;
    setTimeout(() => (busy = false), 0);
  }
  let t = null;
  const refresh = () => { clearTimeout(t); t = setTimeout(placePins, 120); };
  new MutationObserver(() => { if (!busy) refresh(); }).observe(document.getElementById("app"), { childList: true, subtree: true });
  window.addEventListener("hashchange", refresh);

  /* ---------- modalità «scegli la sezione» ---------- */
  let picking = false, over = null;
  const stopPick = () => { picking = false; document.body.classList.remove("comm-pick"); over && over.classList.remove("comm-over"); over = null; };
  function startPick() { picking = true; document.body.classList.add("comm-pick"); }
  document.addEventListener("mouseover", (e) => {
    if (!picking) return;
    const el = e.target.closest(SEZ);
    if (over && over !== el) over.classList.remove("comm-over");
    over = el && !el.closest(".comm-ui") ? el : null;
    over && over.classList.add("comm-over");
  }, true);
  document.addEventListener("click", (e) => {
    if (!picking || e.target.closest(".comm-ui")) return;
    e.preventDefault(); e.stopPropagation();
    const el = e.target.closest(SEZ) || document.querySelector("#app");
    stopPick();
    form({ path: pathOf(el), sezione: labelOf(el) });
  }, true);
  document.addEventListener("keydown", (e) => { if (picking && e.key === "Escape") stopPick(); });

  /* ---------- nuovo commento / modifica ---------- */
  function form(base, old) {
    const c = old || base;
    const m = UL.ui.modal(`
      <div class="modal-head"><div><span class="badge badge-orange">Commento</span><h2 style="margin-top:10px">${esc(pagina())}</h2>
        <p class="small muted" style="margin-top:4px">${c.path ? "Sezione: «" + esc(c.sezione) + "»" : "Tutta la pagina"} · <code>${esc(rotta())}</code></p></div>
        <button class="icon-btn" data-close aria-label="Chiudi">${icon("x")}</button></div>
      <div class="grid-2"><div class="field"><label>Tipo</label><div class="seg" data-g="tipo">${TIPI.map((x) => `<button class="${(c.tipo || "Miglioramento") === x ? "on" : ""}" data-v="${x}">${x}</button>`).join("")}</div></div>
        <div class="field"><label>Priorità</label><div class="seg" data-g="priorita">${PRIO.map((x) => `<button class="${(c.priorita || "Media") === x ? "on" : ""}" data-v="${x}">${x}</button>`).join("")}</div></div></div>
      <div class="field" style="margin-top:12px"><label for="cm-t">Cosa cambieresti? (scrivilo come lo diresti all'AI)</label><textarea class="input" id="cm-t" rows="5" style="resize:vertical">${esc(c.testo || "")}</textarea></div>
      <div class="field" style="margin-top:12px"><label for="cm-a">Il tuo nome</label><input class="input" id="cm-a" value="${esc(c.autore || get(AUT, ""))}"></div>
      <div class="row" style="justify-content:flex-end;margin-top:18px"><button class="btn btn-ghost" data-close>Annulla</button><button class="btn btn-orange" data-save>${old ? "Salva" : "Aggiungi commento"}</button></div>`, { width: 620 });
    const val = { tipo: c.tipo || "Miglioramento", priorita: c.priorita || "Media" };
    m.el.querySelectorAll("[data-g]").forEach((g) => g.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { val[g.dataset.g] = b.dataset.v; g.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); })));
    m.el.querySelector("#cm-t").focus();
    m.el.querySelector("[data-save]").addEventListener("click", () => {
      const testo = m.el.querySelector("#cm-t").value.trim(), autore = m.el.querySelector("#cm-a").value.trim();
      if (!testo) return UL.ui.toast("Scrivi il commento", "err");
      put(AUT, autore);
      const l = all();
      if (old) Object.assign(l.find((x) => x.id === old.id), { testo, autore, ...val });
      else l.push(Object.assign({ id: "c" + Date.now().toString(36), n: l.reduce((s, x) => Math.max(s, x.n || 0), 0) + 1, versione: "v" + UL.VERSIONE.n, rotta: rotta(), pagina: pagina(), vista: vista(), stato: "aperto", at: new Date().toISOString(), autore, testo }, base, val));
      saveAll(l); m.close(); UL.ui.toast(old ? "Commento aggiornato" : "Commento salvato su questa pagina");
    });
  }

  /* ---------- pannello laterale ---------- */
  let scope = "pagina", condivisi = null;
  function panel(focusId) {
    const m = UL.ui.modal("", { drawer: true, width: 560 });
    m.el.classList.add("comm-ui");
    // carica nell'HQ le esportazioni rimaste solo nel browser e legge l'archivio condiviso
    if (ARC) { const st = storico(); ARC.sincronizza(st, "webapp").then((n) => { if (n) saveSto(st); return ARC.elenco("webapp"); }).then((x) => { condivisi = x; if (scope === "archivio") draw(); }); }
    const draw = () => {
      if (scope === "archivio") return drawArchivio();
      const l = all(), qui = l.filter((c) => c.rotta === rotta());
      const list = scope === "pagina" ? qui : l;
      const aperti = list.filter((c) => c.stato !== "risolto");
      m.el.querySelector(".modal").innerHTML = `
        <div class="modal-head"><div><span class="badge badge-orange">Commenti del team</span><h2 style="margin-top:10px">${scope === "pagina" ? esc(pagina()) : "Tutti i commenti"}</h2>
          <p class="small muted" style="margin-top:4px">${aperti.length} aperti · ${list.length - aperti.length} risolti · restano in questo browser</p></div>
          <button class="icon-btn" data-close aria-label="Chiudi">${icon("x")}</button></div>
        <div class="row" style="gap:8px"><button class="btn btn-sm btn-orange" data-pick>${icon("edit")} Commenta una sezione</button><button class="btn btn-sm btn-ghost" data-page>Commenta la pagina</button></div>
        <div class="tabs" style="margin-top:16px"><a href="#" data-scope="pagina" class="${scope === "pagina" ? "on" : ""}">Questa pagina <span class="cnt">${qui.length}</span></a><a href="#" data-scope="tutti" class="${scope === "tutti" ? "on" : ""}">Tutti <span class="cnt">${l.length}</span></a><a href="#" data-scope="archivio">Archivio <span class="cnt">${storico().length}</span></a></div>
        <ul class="feed">${list.slice().sort((a, b) => (a.stato === "risolto") - (b.stato === "risolto") || b.at.localeCompare(a.at)).map((c) => `
          <li class="${c.id === focusId ? "comm-focus" : ""}" style="${c.stato === "risolto" ? "opacity:.55" : ""};align-items:flex-start"><span class="comm-pin comm-pin-static">${c.n}</span><div style="flex:1;min-width:0">
            <div class="row" style="gap:6px;flex-wrap:wrap"><span class="badge ${c.tipo === "Problema" ? "badge-orange" : "badge-soft"}">${esc(c.tipo)}</span><span class="badge ${c.priorita === "Alta" ? "badge-yellow" : "badge-soft"}">${esc(c.priorita)}</span>${c.stato === "risolto" ? '<span class="badge badge-green">Risolto</span>' : ""}</div>
            <p style="margin:6px 0;white-space:pre-wrap">${esc(c.testo)}</p>
            <time>${scope === "tutti" ? `<a href="#/${esc(c.rotta.replace(/\./g, "/"))}">${esc(c.pagina)}</a> · ` : ""}${c.path ? "«" + esc(c.sezione) + "»" : "Tutta la pagina"} · ${esc(c.autore || "anonimo")} · ${when(c.at)} · ${esc(c.vista)}</time>
            <div class="row" style="gap:12px;margin-top:6px"><a href="#" class="small display" data-edit="${c.id}">Modifica</a><a href="#" class="small display" data-toggle="${c.id}">${c.stato === "risolto" ? "Riapri" : "Segna risolto"}</a><a href="#" class="small display" style="color:var(--red,#b42318)" data-del="${c.id}">Elimina</a></div></div></li>`).join("") || `<li class="small muted">Nessun commento${scope === "pagina" ? " su questa pagina" : ""}.</li>`}</ul>
        <div class="card beige" style="margin-top:18px"><h3>Scarica e passali all'AI</h3><p class="small muted" style="margin:6px 0 12px">Il PDF e il file .md contengono pagina, rotta, sezione e testo di ogni commento, con le istruzioni per l'AI. <b>Scaricando, i commenti vengono archiviati</b>: escono dalle pagine e restano nella scheda «Archivio» ${ARC && ARC.collegato() ? "e nell'HQ, dove chiunque acceda li riscarica" : "(nell'HQ appena entri nell'HQ da questo browser)"}.</p>
          <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn btn-sm btn-primary" data-pdf>${icon("download")} PDF</button><button class="btn btn-sm btn-ghost" data-md>${icon("file")} .md per l'AI</button><button class="btn btn-sm btn-ghost" data-json>Esporta JSON</button><label class="btn btn-sm btn-ghost" style="cursor:pointer">Importa JSON<input type="file" accept=".json" data-imp hidden></label></div>
          <label class="check small" style="margin-top:10px"><input type="checkbox" data-solo checked> Solo i commenti aperti</label></div>`;
      const q = (s) => m.el.querySelector(s);
      q("[data-pick]").addEventListener("click", () => { m.close(); startPick(); });
      q("[data-page]").addEventListener("click", () => { m.close(); form({ path: "", sezione: "" }); });
      m.el.querySelectorAll("[data-scope]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); scope = a.dataset.scope; draw(); }));
      m.el.querySelectorAll("[data-edit]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); m.close(); form(null, all().find((c) => c.id === a.dataset.edit)); }));
      m.el.querySelectorAll("[data-toggle]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); const l = all(); const c = l.find((x) => x.id === a.dataset.toggle); c.stato = c.stato === "risolto" ? "aperto" : "risolto"; saveAll(l); draw(); }));
      m.el.querySelectorAll("[data-del]").forEach((a) => a.addEventListener("click", async (e) => { e.preventDefault(); if (await UL.ui.confirmBox("Eliminare il commento?", "Non si può annullare.", "Elimina", true)) { saveAll(all().filter((x) => x.id !== a.dataset.del)); draw(); } }));
      m.el.querySelectorAll("[data-sel]").forEach((a) => a.addEventListener("click", () => m.close()));
      const scelti = () => all().filter((c) => !q("[data-solo]").checked || c.stato !== "risolto");
      q("[data-pdf]").addEventListener("click", () => { const l = scelti(); if (!l.length) return UL.ui.toast("Nessun commento da scaricare", "err"); pdf(l); archivia(l, "pdf", nomeFile() + ".pdf"); draw(); });
      q("[data-md]").addEventListener("click", () => { const l = scelti(); if (!l.length) return UL.ui.toast("Nessun commento da scaricare", "err"); scarica(nomeFile() + ".md", markdown(l), "text/markdown"); archivia(l, "md", nomeFile() + ".md"); draw(); });
      q("[data-json]").addEventListener("click", () => { const l = scelti(); if (!l.length) return UL.ui.toast("Nessun commento da scaricare", "err"); scarica(nomeFile() + ".json", JSON.stringify(l, null, 2), "application/json"); archivia(l, "json", nomeFile() + ".json"); draw(); });
      q("[data-imp]").addEventListener("change", (e) => importa(e.target.files[0], draw));
      const f = m.el.querySelector(".comm-focus"); f && f.scrollIntoView({ block: "center" });
    };
    // scheda Archivio: esportazioni di questo browser + quelle condivise nell'HQ (anche degli altri founder)
    const drawArchivio = () => {
      const loc = storico(), idLoc = new Set(loc.map((e) => e.id));
      const lista = loc.map((e) => ({ ...e, locale: true })).concat((condivisi || []).filter((e) => !idLoc.has(e.id))).sort((a, b) => String(b.data).localeCompare(String(a.data)));
      m.el.querySelector(".modal").innerHTML = `
        <div class="modal-head"><div><span class="badge badge-orange">Commenti del team</span><h2 style="margin-top:10px">Archivio</h2>
          <p class="small muted" style="margin-top:4px">${lista.length} esportazioni · ${ARC && ARC.collegato() ? (condivisi ? "condivise nell'HQ: le vede chi accede" : "collegamento all'HQ…") : "non collegato all'HQ: entra nell'HQ in questo browser per condividerle"}</p></div>
          <button class="icon-btn" data-close aria-label="Chiudi">${icon("x")}</button></div>
        <div class="tabs"><a href="#" data-scope="pagina">Questa pagina</a><a href="#" data-scope="tutti">Tutti <span class="cnt">${all().length}</span></a><a href="#" data-scope="archivio" class="on">Archivio <span class="cnt">${loc.length}</span></a></div>
        <ul class="feed">${lista.map((e) => `<li style="align-items:flex-start"><span class="ic">${icon("file")}</span><div style="flex:1;min-width:0">
            <div class="row" style="gap:6px;flex-wrap:wrap"><span class="badge badge-soft">${esc(String(e.formato || "").toUpperCase())}</span><span class="badge ${e.condiviso || !e.locale ? "badge-green" : "badge-yellow"}">${e.condiviso || !e.locale ? "nell'HQ" : "solo in questo browser"}</span></div>
            <p style="margin:6px 0"><b class="display" style="font-weight:400">${(e.commenti || []).length} commenti</b> · web app v${esc(e.versione)} · ${when(e.data)} · ${esc(e.autore || "anonimo")}</p>
            <details><summary class="small">Vedi i commenti</summary>${(e.commenti || []).map((c) => `<p class="small" style="margin:6px 0">#${c.n} · <b>${esc(c.pagina)}</b> · ${esc(c.testo)}</p>`).join("")}</details>
            <div class="row" style="gap:12px;margin-top:6px"><a href="#" class="small display" data-ri="${e.id}" data-k="pdf">PDF</a><a href="#" class="small display" data-ri="${e.id}" data-k="md">.md</a><a href="#" class="small display" data-ri="${e.id}" data-k="json">JSON</a>${e.locale ? `<a href="#" class="small display" data-rp="${e.id}">Ripristina</a>` : ""}</div></div></li>`).join("") || '<li class="small muted">Nessuna esportazione ancora: scarica i commenti da «Tutti».</li>'}</ul>`;
      const trova = (id) => lista.find((x) => x.id === id);
      m.el.querySelectorAll("[data-scope]").forEach((a) => a.addEventListener("click", (ev) => { ev.preventDefault(); scope = a.dataset.scope; draw(); }));
      m.el.querySelectorAll("[data-ri]").forEach((a) => a.addEventListener("click", (ev) => { ev.preventDefault(); const e = trova(a.dataset.ri); if (!e) return; const nome = (e.file || "commenti").replace(/\.\w+$/, "");
        if (a.dataset.k === "pdf") pdf(e.commenti, e.data); else if (a.dataset.k === "md") scarica(nome + ".md", e.md || markdown(e.commenti), "text/markdown"); else scarica(nome + ".json", JSON.stringify(e.commenti, null, 2), "application/json"); }));
      m.el.querySelectorAll("[data-rp]").forEach((a) => a.addEventListener("click", async (ev) => { ev.preventDefault();
        if (!(await UL.ui.confirmBox("Ripristinare questi commenti?", "Tornano attivi sulle pagine e l'esportazione esce dall'archivio di questo browser (nell'HQ resta).", "Ripristina"))) return;
        const st = storico(), e = st.find((x) => x.id === a.dataset.rp); if (!e) return; const l = all(), ids = new Set(l.map((c) => c.id));
        e.commenti.forEach((c) => { if (!ids.has(c.id)) { const r = { ...c }; delete r.archiviato; l.push(r); } }); saveAll(l); saveSto(st.filter((x) => x.id !== e.id)); UL.ui.toast(`Ripristinati ${e.commenti.length} commenti`); draw(); }));
    };
    draw();
  }
  // archivia i commenti appena scaricati: escono dalle pagine, restano nell'archivio (browser + HQ)
  const nomeFile = () => `UniLink_commenti_webapp_v${UL.VERSIONE.n}_${new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "")}`;
  function archivia(lista, formato, file) {
    const ora = new Date().toISOString(), ids = new Set(lista.map((c) => c.id));
    const e = { id: "w" + Date.now().toString(36), demo: "webapp", data: ora, autore: get(AUT, "") || "", formato, file, versione: UL.VERSIONE.n, n: lista.length, commenti: lista.map((c) => ({ ...c, archiviato: ora })), md: markdown(lista), condiviso: false };
    const st = storico(); st.unshift(e); saveSto(st);
    saveAll(all().filter((c) => !ids.has(c.id)));
    UL.ui.toast(`Scaricati e archiviati ${lista.length} commenti`);
    if (ARC) ARC.salva(e).then((ok) => { if (ok) { const s2 = storico(), x = s2.find((y) => y.id === e.id); if (x) { x.condiviso = true; saveSto(s2); } UL.ui.toast("Archivio caricato nell'HQ: chi accede lo può scaricare"); } });
  }

  /* ---------- esportazioni ---------- */
  const gruppi = (l) => { const g = {}; l.forEach((c) => (g[c.rotta] = g[c.rotta] || { pagina: c.pagina, items: [] }).items.push(c)); return g; };
  const ISTR = "Istruzioni per l'AI: questi sono i commenti del team sulla demo della web app UniLink (repository unilink-hq, cartella demo-webapp/). Per ogni commento: «rotta» = indirizzo della pagina (#/app/… o pagina pubblica), «sezione» = titolo del blocco commentato, «vista» = tipologia di account con cui la si guardava. Applica le modifiche rispettando il design della demo A e l'architettura del PDF architettura/UniLink_Architettura_WebApp.pdf; se una richiesta è ambigua chiedi prima di procedere. Segna nel registro «Da decidere» (js/unilink-dati.js) le richieste che cambiano una proposta.";
  function markdown(l) {
    const g = gruppi(l);
    return `# Commenti sulla demo UniLink · web app v${UL.VERSIONE.n}\n\nEsportati il ${new Date().toLocaleString("it-IT")} · ${l.length} commenti\n\n> ${ISTR}\n\n` +
      Object.entries(g).map(([r, x]) => `## ${x.pagina} — \`${r}\`\n\n` + x.items.map((c) => `### #${c.n} · ${c.tipo} · priorità ${c.priorita}${c.stato === "risolto" ? " · RISOLTO" : ""}\n- **Sezione:** ${c.path ? c.sezione + " (posizione " + c.path + ")" : "tutta la pagina"}\n- **Autore:** ${c.autore || "anonimo"} · ${when(c.at)} · vista: ${c.vista} · ${c.versione}\n\n${c.testo}\n`).join("\n")).join("\n");
  }
  function pdf(l, quando) {
    if (!l.length) return UL.ui.toast("Nessun commento da scaricare", "err");
    const g = gruppi(l);
    const html = `<!doctype html><html lang="it"><head><meta charset="utf-8"><title>Commenti UniLink v${UL.VERSIONE.n}</title>
      <link rel="stylesheet" href="${new URL("css/style.css", location.href)}"><style>body{background:#fff;padding:28px;font-size:13px}h1{font-size:28px}h2{font-size:18px;margin:22px 0 8px;border-bottom:1px solid var(--line);padding-bottom:6px}
      .c{border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:8px 0;break-inside:avoid}.m{color:#5b6476;font-size:11px;margin-top:6px}.n{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--orange);color:#fff;font-size:11px;margin-right:6px}
      .i{background:var(--orange-soft);border-radius:10px;padding:10px 12px;font-size:12px;margin-top:10px}p{white-space:pre-wrap;margin:6px 0 0}@page{margin:14mm}</style></head><body>
      <h1>Commenti sulla demo UniLink · web app v${UL.VERSIONE.n}</h1><div class="m">Esportati il ${new Date(quando || Date.now()).toLocaleString("it-IT")} · ${l.length} commenti</div><div class="i">${esc(ISTR)}</div>
      ${Object.entries(g).map(([r, x]) => `<h2>${esc(x.pagina)} <span class="m">${esc(r)}</span></h2>${x.items.map((c) => `<div class="c"><b><span class="n">${c.n}</span>${esc(c.tipo)} · priorità ${esc(c.priorita)}${c.stato === "risolto" ? " · risolto" : ""}</b>
        <div class="m">Sezione: ${c.path ? "«" + esc(c.sezione) + "» (" + esc(c.path) + ")" : "tutta la pagina"}</div><p>${esc(c.testo)}</p><div class="m">${esc(c.autore || "anonimo")} · ${when(c.at)} · vista: ${esc(c.vista)} · ${esc(c.versione)}</div></div>`).join("")}`).join("")}</body></html>`;
    // stampa da un iframe nascosto: nel dialogo scegliere «Salva come PDF»
    const f = document.createElement("iframe");
    f.className = "comm-ui"; f.style.cssText = "position:fixed;width:0;height:0;border:0;right:0;bottom:0";
    document.body.appendChild(f);
    f.contentDocument.open(); f.contentDocument.write(html); f.contentDocument.close();
    setTimeout(() => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) { scarica("commenti-unilink.html", html, "text/html"); } setTimeout(() => f.remove(), 60000); }, 500);
    UL.ui.toast("Nel dialogo di stampa scegli «Salva come PDF»");
  }
  function scarica(nome, testo, tipo) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([testo], { type: tipo + ";charset=utf-8" }));
    a.download = nome; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function importa(file, done) {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const nuovi = JSON.parse(r.result); if (!Array.isArray(nuovi)) throw new Error();
        const l = all(), ids = new Set(l.map((c) => c.id).concat(storico().flatMap((e) => e.commenti.map((c) => c.id))));
        let n = l.reduce((s, x) => Math.max(s, x.n || 0), 0), add = 0;
        nuovi.filter((c) => c && c.id && c.testo && !ids.has(c.id)).forEach((c) => { l.push(Object.assign({}, c, { n: ++n })); add++; });
        saveAll(l); UL.ui.toast(`Importati ${add} commenti`); done();
      } catch (e) { UL.ui.toast("File non valido", "err"); }
    };
    r.readAsText(file);
  }

  UL.commenti = { all, panel, startPick, markdown };
  refresh();
})();
