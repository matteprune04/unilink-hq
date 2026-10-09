/* UniLink HQ · nuovo strato (v2, 9/10/2026)
   Architettura e regole: 14_HQ_Discovery/HQ_CONTESTO.md (fuori dal repository).
   Si carica dopo lo script di index.html: usa i suoi dati (S, V, COLS), il database (S.db) e le finestre (openModal).
   Non cancella né riscrive i dati esistenti: aggiunge campi e due collezioni (topics, bozze). Alla fine avvia l'HQ. */
"use strict";
(() => {
  /* ================= base ================= */
  ["topics", "bozze"].forEach(c => { if (!COLS.includes(c)) COLS.push(c); S.data[c] = S.data[c] || []; });
  const H = window.H2 = { open: {}, tile: "", tools: true, ff: { q: "", t: "", s: "" } };
  try { H.tools = localStorage.getItem("hq2_tools") !== "0"; } catch (e) {}
  const nowISO = () => new Date().toISOString();
  const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  const first = n => norm(String(n || "").split(/\s+/)[0]);
  const me = () => String(S.uid || "").trim().split(/\s+/)[0];
  const isMe = n => !!n && first(n) === first(me());
  /* un colore fisso per persona, nell'ordine alfabetico della rubrica (nessun nome scritto nel codice: il repository è pubblico) */
  const PCOL = ["var(--p-1)", "var(--p-2)", "var(--p-3)", "var(--p-4)", "var(--p-5)", "var(--p-6)"];
  const pcol = n => { const l = team().map(first).sort(), k = l.indexOf(first(n)); return k < 0 ? "var(--p-altro)" : PCOL[k % PCOL.length]; };
  const av = n => `<span class="av" style="background:${pcol(n)}" title="${esc(n || "")}">${esc(String(n || "?").trim().charAt(0).toUpperCase())}</span>`;
  const avs = list => `<span class="avs">${[...new Set((list || []).filter(Boolean))].map(av).join("")}</span>`;
  const people = () => team().map(n => n.split(" ")[0]);
  const short = (s, n = 140) => { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
  const I = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const IC = {
    oggi: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    arg: I('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>'),
    prop: I('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.4 1 2.5h6c0-1.1.3-1.8 1-2.5A6 6 0 0 0 12 3Z"/>'),
    call: I('<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>'),
    file: I('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/>'),
    q: I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    plus: I('<path d="M12 5v14M5 12h14"/>'),
    chev: I('<path d="m9 6 6 6-6 6"/>'),
    back: I('<path d="M15 6l-6 6 6 6"/>'),
    menu: I('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    task: I('<path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>'),
    dec: I('<path d="M12 3v18M5 7h14M5 7l-2 6h4ZM19 7l-2 6h4Z"/>'),
    goal: I('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
    open: I('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>'),
    users: I('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>'),
    wait: I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    news: I('<path d="M4 5h13v14H6a2 2 0 0 1-2-2Z"/><path d="M17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5"/>'),
    hist: I('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>'),
    mic: I('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
    ai: I('<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2Z"/>'),
    num: I('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    web: I('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
    eur: I('<path d="M17 6a7 7 0 1 0 0 12M4 10h9M4 14h9"/>'),
    hand: I('<path d="m11 17 2 2a1.4 1.4 0 0 0 2-2l-3-3M14 14l2.5 2.5a1.4 1.4 0 0 0 2-2L13 9l-2 2a2 2 0 0 1-3-3l3.5-3.5a3 3 0 0 1 4 0L21 10M3 10l5-5M3 14l5 5"/>'),
    key: I('<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.3-9.3M17 6l3 3M14 9l2 2"/>'),
    book: I('<path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2Z"/><path d="M4 19V5"/>'),
    box: I('<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5Z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>'),
    play: I('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m10 9 5 3-5 3Z"/>'),
    arch: I('<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4"/>'),
  };
  const ext = n => ((String(n || "").match(/\.([A-Za-z0-9]{1,5})$/) || [])[1] || "file").toLowerCase();
  async function put(col, data) { const r = S.db.collection(col).doc(); await guard(() => r.set({ ...data, by: S.uid || "", createdAt: nowISO() })); return r.id; }
  async function upd(col, id, patch) { await guard(() => S.db.collection(col).doc(id).update({ ...patch, updatedAt: nowISO(), updatedBy: S.uid || "" })); }
  const dateIT = s => s ? fmtD(String(s).slice(0, 10), 1) : "";

  /* ================= dati del nuovo HQ ================= */
  const topics = () => S.data.topics.slice().sort((a, b) => String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt)));
  const topic = id => S.data.topics.find(t => t.id === id);
  const inTopic = (d, id) => d.topicId === id || (d.topicIds || []).includes(id);
  const FASI = ["da discutere", "in pausa", "chiusa"];
  const fase = i => i.fase || (i.status === "Stand-by" ? "in pausa" : ["Fatta", "In sviluppo", "Archiviata", "Approvata"].includes(i.status) ? "chiusa" : "da discutere");
  const PAUSA = { scelta: "Rinviata per scelta", informazioni: "Mancano informazioni", disaccordo: "Non siamo d'accordo" };
  const ESITO = { argomento: "Diventata un argomento", unita: "Unita a un argomento", scartata: "Scartata", chiusa: "Chiusa" };
  const tDone = t => t.status === "Fatto" || (!!(t.parts || []).length && t.parts.every(p => p.done));
  const tPeople = t => (t.parts || []).length ? t.parts.map(p => p.who) : t.owner ? [t.owner] : [];
  const decs = () => S.data.decisions.filter(d => (d.topicIds || []).length);
  const tfiles = () => S.data.docs.filter(d => d.topicId || (d.topicIds || []).length);
  const fstato = d => d.stato || "approvato";
  const mineToApprove = d => fstato(d) === "da approvare" && !isMe(d.by) && !(d.approvals || {})[me()] && involved(d).some(isMe);
  /* chi approva: le persone dell'argomento tranne chi ha caricato; se non ce ne sono, basta uno qualsiasi degli altri */
  const involvedStrict = d => { const t = topic(d.topicId); return ((t && t.people) || []).filter(p => first(p) !== first(d.by)); };
  function involved(d) { const ppl = involvedStrict(d); return ppl.length ? ppl : people().filter(p => first(p) !== first(d.by)); }
  const lastCall = () => S.data.meetings.filter(m => m.imported).sort((a, b) => String(b.dataCall || b.when || b.createdAt).localeCompare(String(a.dataCall || a.when || a.createdAt)))[0];
  const nextCall = () => S.data.meetings.filter(m => m.when && new Date(m.when) >= new Date(Date.now() - 3 * 3600e3)).sort((a, b) => String(a.when).localeCompare(String(b.when)))[0];
  const pendingBozze = () => S.data.bozze.filter(b => b.state === "da confermare");
  const pauseDue = () => S.data.ideas.filter(i => fase(i) === "in pausa" && i.pausa && i.pausa.tipo !== "disaccordo" && i.pausa.quando && daysFrom(i.pausa.quando) <= 0);

  /* ---------- novità dall'ultima visita (salvata sul dispositivo, per nome) ---------- */
  const seenKey = () => "hq2_seen_" + first(me());
  function loadSeen() { try { H.prev = localStorage.getItem(seenKey()) || new Date(Date.now() - 7 * 864e5).toISOString(); } catch (e) { H.prev = new Date(Date.now() - 7 * 864e5).toISOString(); } }
  function markSeen() { try { localStorage.setItem(seenKey(), nowISO()); } catch (e) {} }
  window.addEventListener("pagehide", markSeen);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && S.ready) markSeen(); });
  const after = s => s && String(s) > String(H.prev || "");
  function news() {
    const other = d => !isMe(d.by);
    const n = {
      dec: decs().filter(d => after(d.createdAt) && other(d)),
      appr: tfiles().filter(d => fstato(d) === "approvato" && after(d.approvedAt || d.createdAt)),
      wait: tfiles().filter(mineToApprove),
      prop: [],
    };
    S.data.ideas.forEach(i => { if (after(i.createdAt) && other(i)) n.prop.push({ i, what: "nuova proposta", by: i.by, at: i.createdAt }); (i.comments || []).forEach(c => { if (after(c.at) && !isMe(c.by)) n.prop.push({ i, what: "commento", by: c.by, at: c.at, text: c.text }); }); });
    n.prop.sort((a, b) => String(b.at).localeCompare(String(a.at)));
    return n;
  }

  /* ================= barra laterale, barra in alto, barra in basso ================= */
  const MAIN = [["oggi", "Oggi", IC.oggi], ["argomenti", "Argomenti", IC.arg], ["proposte", "Proposte", IC.prop], ["call", "Call", IC.call], ["file", "File", IC.file]];
  const TOOLS = [["goals", "Obiettivi e numeri", IC.num], ["web", "Sito e Google", IC.web], ["finance", "Finanze", IC.eur], ["partners", "Partner e contatti", IC.hand], ["team", "Persone", IC.users], ["accounts", "Strumenti e account", IC.key], ["esami", "Esami e dispense", IC.book], ["mat", "Materiali", IC.box], ["lab", "Laboratorio AI e demo", IC.play], ["aictx", "Contesto per AI", IC.ai], ["archivio", "Archivio del vecchio HQ", IC.arch]];
  const OLD = ["home", "calendar", "ideas", "feedback", "notes", "tasks", "meetings", "decisions", "links", "docs", "okrs", "metrics"];
  function badge(id) {
    if (!S.ready) return 0;
    if (id === "oggi") { const n = news(); return n.dec.length + n.appr.length + n.wait.length + n.prop.length; }
    if (id === "proposte") return S.data.ideas.filter(i => fase(i) === "da discutere").length;
    if (id === "call") return pendingBozze().length;
    if (id === "file") return tfiles().filter(mineToApprove).length;
    return 0;
  }
  const curMain = () => S.view === "argomento" ? "argomenti" : OLD.includes(S.view) ? "archivio" : S.view;
  window.renderSide = function () {
    const cur = curMain();
    const it = ([id, l, ic], sub) => { const b = sub ? 0 : badge(id); return `<button class="s2 ${sub ? "sub" : ""} ${cur === id ? "on" : ""}" data-nav="${id}">${ic}<span>${l}</span>${b ? `<span class="b num">${b}</span>` : ""}</button>`; };
    $("#side").innerHTML = `<div class="brand"><img src="brand/unilink-orizzontale-negativo.png" alt="UniLink"><span>HQ</span></div>` +
      MAIN.map(x => it(x)).join("") +
      `<button class="sgrp" data-h="tools"><span>Strumenti</span><span>${H.tools ? "−" : "+"}</span></button>` +
      (H.tools ? TOOLS.map(x => it(x, 1)).join("") : "") +
      `<div class="sfoot">${av(S.uid)}<span>${esc(me())}</span><button data-logout>Esci</button></div>`;
    let bb = $(".bbar"); if (!bb) { bb = document.createElement("nav"); bb.className = "bbar"; document.body.appendChild(bb); }
    bb.innerHTML = [["oggi", "Oggi", IC.oggi], ["argomenti", "Argomenti", IC.arg]].map(([id, l, ic]) => `<button data-nav="${id}" class="${cur === id ? "on" : ""}">${ic}<span>${l}</span></button>`).join("") +
      `<button class="plus" data-h="newprop"><span class="p">${IC.plus}</span><span>Proposta</span></button>` +
      `<button data-nav="proposte" class="${cur === "proposte" ? "on" : ""}">${IC.prop}<span>Proposte</span></button><button data-menu>${IC.menu}<span>Menu</span></button>`;
  };
  const topbar = pri => `<div class="topbar"><button class="q" data-h="search">${IC.q}<span>Cerca in tutto l'HQ: argomenti, decisioni, file…</span><kbd>Ctrl K</kbd></button><button class="btn ${pri ? "acc" : ""} big" data-h="newprop">${IC.plus.replace("<svg", '<svg width="16" height="16"')} Nuova proposta</button></div>`;
  const page = (title, sub, act = "") => `<div class="h2page"><div><h1>${title}</h1>${sub ? `<div class="sub">${sub}</div>` : ""}</div><div class="row">${act}</div></div>`;
  const card = (ic, cls, title, n, body, act = "") => `<section class="c2"><div class="c2h"><span class="ic ${cls}">${ic}</span><h2>${title}</h2>${n != null ? `<span class="n num">${n}</span>` : ""}${act ? `<div class="act">${act}</div>` : ""}</div>${body}</section>`;

  /* ================= OGGI ================= */
  function taskRow(t, opts = {}) {
    const tp = topic(t.topicId), my = (t.parts || []).find(p => isMe(p.who));
    const done = my ? my.done : tDone(t);
    const title = my && my.text ? `${t.title} · ${my.text}` : t.title;
    const steps = (t.steps || []).filter(s => s.text);
    const hasBody = t.details || steps.length || t.notes || (t.parts || []).length > 1;
    const sum = `<button class="ck ${done ? "on" : ""}" data-h="tick:${t.id}${my ? ":" + esc(first(my.who)) : ""}" aria-label="Fatto"></button><div class="grow"><div class="t">${esc(title)}</div><div class="m">${[tp && !opts.noTopic ? esc(tp.title) : "", t.due ? `<span class="when ${done ? "" : whenCls(t.due)}">${rel(t.due)}</span>` : ""].filter(Boolean).join(" · ")}</div></div>${opts.people ? avs(tPeople(t)) : ""}`;
    if (!hasBody) return `<div class="r2 ${done ? "done" : ""}">${sum}${S.canWrite ? `<button class="btn ghost sm" data-h="etask:${t.id}">⋯</button>` : ""}</div>`;
    return `<details class="dx ${done ? "done" : ""}"><summary>${IC.chev.replace("<svg", '<svg class="chev"')}${sum}</summary><div class="body">
      ${t.details ? `<div><div class="lab">Cosa intendevamo</div><div class="pre">${esc(t.details)}</div></div>` : ""}
      ${steps.length ? `<div><div class="lab">Passi</div>${steps.map((s, k) => `<div class="r2"><button class="ck ${s.done ? "on" : ""}" data-h="step:${t.id}:${k}"></button><div class="grow">${esc(s.text)}</div></div>`).join("")}</div>` : ""}
      ${(t.parts || []).length > 1 ? `<div><div class="lab">Chi fa cosa</div>${t.parts.map((p, k) => `<div class="r2 ${p.done ? "done" : ""}"><button class="ck ${p.done ? "on" : ""}" data-h="part:${t.id}:${k}"></button>${av(p.who)}<div class="grow"><div class="t">${esc(p.text || p.who)}</div></div></div>`).join("")}</div>` : ""}
      ${t.notes ? `<div><div class="lab">Note</div><div class="pre">${esc(t.notes)}</div></div>` : ""}
      <div class="row">${tp && opts.noTopic !== true ? `<button class="tag" data-h="topic:${tp.id}">${esc(tp.title)}</button>` : ""}${S.canWrite ? `<button class="btn sm" data-h="etask:${t.id}">Modifica</button>` : ""}</div></div></details>`;
  }
  const myTasks = () => S.data.tasks.filter(t => { const p = (t.parts || []).find(x => isMe(x.who)); return p ? !p.done : isMe(t.owner) && !tDone(t); }).sort((a, b) => String(a.due || "9999").localeCompare(String(b.due || "9999")));
  V.oggi = () => {
    const n = news(), d = new Date(), h = d.getHours();
    const tiles = [["dec", "Decisioni nuove", n.dec.length], ["wait", "File da approvare", n.wait.length], ["appr", "File approvati", n.appr.length], ["prop", "Proposte e commenti", n.prop.length]];
    const sel = H.tile && n[H.tile] && n[H.tile].length ? H.tile : "";
    const list = !sel ? "" : sel === "prop" ? n.prop.slice(0, 12).map(x => `<div class="r2 click" data-h="prop:${x.i.id}">${av(x.by)}<div class="grow"><div class="t">${esc(x.i.title)}</div><div class="m">${esc(String(x.by || "").split(" ")[0])} · ${x.what}${x.text ? ": " + esc(short(x.text, 90)) : ""} · ${ago(x.at)}</div></div></div>`).join("")
      : sel === "dec" ? n.dec.map(x => `<div class="r2 click" data-h="topic:${(x.topicIds || [])[0]}">${IC.dec.replace("<svg", '<svg width="18" height="18"')}<div class="grow"><div class="t">${esc(x.short || x.title)}</div><div class="m">${(x.topicIds || []).map(id => esc((topic(id) || {}).title || "")).join(", ")} · ${ago(x.createdAt)}</div></div></div>`).join("")
      : n[sel].map(fileRow).join("");
    const mine = myTasks(), others = people().filter(p => !isMe(p));
    const waiting = [...tfiles().filter(mineToApprove).map(f => `<div class="r2 click" data-h="file:${f.id}"><span class="fx">${esc(ext((f.files || [])[0] && f.files[0].name))}</span><div class="grow"><div class="t">Approva «${esc(f.title)}»</div><div class="m">${esc(((topic(f.topicId) || {}).title) || "")} · da ${esc(String(f.by || "").split(" ")[0])}</div></div></div>`),
      ...pauseDue().filter(i => !i.pausa.chi || isMe(i.pausa.chi)).map(i => `<div class="r2 click" data-h="prop:${i.id}">${IC.wait.replace("<svg", '<svg width="18" height="18"')}<div class="grow"><div class="t">Riprendere «${esc(i.title)}»</div><div class="m">${esc(PAUSA[i.pausa.tipo] || "In pausa")}${i.pausa.manca ? " · mancava: " + esc(short(i.pausa.manca, 70)) : ""}</div></div></div>`),
      ...(pendingBozze().length ? [`<div class="r2 click" data-nav="call">${IC.ai.replace("<svg", '<svg width="18" height="18"')}<div class="grow"><div class="t">${pendingBozze().length} bozze dall'AI da confermare</div><div class="m">Dall'ultima call importata</div></div></div>`] : [])];
    const nc = nextCall();
    return `<div class="w2">${topbar(1)}
    <div class="hello"><div><div class="d">${d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}</div><h1>${h < 13 ? "Buongiorno" : h < 18 ? "Buon pomeriggio" : "Buonasera"}, ${esc(me())}</h1></div></div>
    <section class="c2"><div class="c2h"><span class="ic or">${IC.news}</span><h2>Cosa è cambiato</h2><span class="m small muted">dal ${dateIT(H.prev)}</span><div class="act">${tiles.some(t => t[2]) ? `<button class="btn sm ghost" data-h="seen">Segna come visto</button>` : ""}</div></div>
      ${tiles.some(t => t[2]) ? `<div class="tiles">${tiles.map(([k, l, v]) => `<button class="tile ${v ? "" : "zero"} ${sel === k ? "on" : ""}" data-h="tile:${k}"><span class="v num">${v}</span><span class="l">${l}</span></button>`).join("")}</div>${list ? `<div>${list}</div>` : ""}` : `<div class="empty2">Niente di nuovo dall'ultima volta.</div>`}</section>
    <div class="g2">
      ${card(IC.task, "", "Le mie attività", mine.length, mine.length ? `<div>${mine.slice(0, 10).map(t => taskRow(t)).join("")}</div>` : `<div class="empty2">Niente da fare per te. Le attività nascono negli argomenti e dalle call.</div>`)}
      ${card(IC.wait, "or", "Ti aspettano", waiting.length, waiting.length ? `<div>${waiting.join("")}</div>` : `<div class="empty2">Nessuna approvazione o ripresa in sospeso.</div>`)}
    </div>
    <div class="g2">
      ${card(IC.users, "", "Gli altri", null, `<div>${others.map(p => { const ts = S.data.tasks.filter(t => !tDone(t) && tPeople(t).some(x => first(x) === first(p))); const wip = tfiles().filter(f => first(f.by) === first(p) && fstato(f) !== "approvato").sort((a, b) => String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt)))[0]; return `<div class="r2">${av(p)}<div class="grow"><div class="t">${esc(p)}</div><div class="m">${ts.length ? `${ts.length} ${ts.length === 1 ? "attività aperta" : "attività aperte"}` : "nessuna attività aperta"}${wip ? ` · sta lavorando a «${esc(short(wip.title, 40))}»` : ts[0] ? ` · prossima: ${esc(short(ts[0].title, 40))}` : ""}</div></div></div>`; }).join("")}</div>`)}
      ${card(IC.call, "", "Prossima call", null, nc ? `<div class="r2"><div class="grow"><div class="t">${esc(nc.title || "Call")}</div><div class="m">${fmtDT(nc.when)}</div></div>${nc.link ? `<a class="btn sm acc" href="${esc(safeUrl(nc.link))}" target="_blank" rel="noopener">Entra</a>` : ""}</div><div class="row"><button class="btn sm" data-nav="call">Ordine del giorno (${agenda().length})</button></div>` : `<div class="empty2">Nessuna call in calendario. <button class="btn sm" data-h="newcall">Programma</button></div><div class="row"><button class="btn sm" data-nav="call">Ordine del giorno (${agenda().length})</button></div>`)}
    </div></div>`;
  };

  /* ================= ARGOMENTI ================= */
  V.argomenti = () => {
    const f = H.tf || "attivo", all = topics(), list = all.filter(t => (t.status || "attivo") === f);
    const cnt = t => ({ a: S.data.tasks.filter(x => inTopic(x, t.id) && !tDone(x)).length, o: (t.open || []).filter(x => !x.done).length, f: tfiles().filter(x => inTopic(x, t.id)).length, d: decs().filter(x => inTopic(x, t.id)).length });
    const tc = t => { const c = cnt(t), ld = decs().filter(x => inTopic(x, t.id)).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0]; return `<button class="tc" data-h="topic:${t.id}"><h3>${esc(t.title)}</h3><div class="s">${esc(t.summary || (ld ? ld.short : "") || "Ancora nessuno stato scritto.")}</div><div class="foot"><span class="cnts">${[[c.a, "attività", "attività"], [c.d, "decisione", "decisioni"], [c.o, "cosa aperta", "cose aperte"], [c.f, "file", "file"]].filter(x => x[0]).map(([n, s1, s2]) => `<span><b class="num">${n}</b> ${n === 1 ? s1 : s2}</span>`).join("") || "<span>vuoto</span>"}</span><span style="margin-left:auto">${avs(t.people)}</span></div></button>`; };
    const active = all.filter(t => (t.status || "attivo") === "attivo").length;
    return `<div class="w2">${topbar()}
    ${page("Argomenti", "Ogni cosa che portiamo avanti vive in un argomento: decisioni, attività, file.", S.canWrite ? `<button class="btn acc big" data-h="newtopic">${IC.plus.replace("<svg", '<svg width="16" height="16"')} Nuovo argomento</button>` : "")}
    <div class="row"><div class="seg2">${[["attivo", "Attivi"], ["in pausa", "In pausa"], ["chiuso", "Chiusi"]].map(([k, l]) => `<button class="${f === k ? "on" : ""}" data-h="tf:${k}">${l} <span class="num">${all.filter(t => (t.status || "attivo") === k).length}</span></button>`).join("")}</div></div>
    ${active > 10 && f === "attivo" ? `<div class="banner2">Ci sono ${active} argomenti attivi: forse qualcuno si può unire o mettere in pausa.</div>` : ""}
    ${list.length ? `<div class="g3">${list.map(tc).join("")}</div>` : all.length ? `<div class="empty2">Nessun argomento qui.</div>` : `<section class="c2"><div class="empty2">Ancora nessun argomento. Nascono chiudendo una proposta, importando una call o da qui.</div><div class="row">${S.canWrite ? `<button class="btn acc" data-h="newtopic">Crea il primo argomento</button><button class="btn" data-h="import">Importa con l'AI</button>` : ""}</div></section>`}
    </div>`;
  };

  V.argomento = () => {
    const t = topic(S.topicOpen); if (!t) return V.argomenti();
    const id = t.id;
    const ts = S.data.tasks.filter(x => inTopic(x, id)), open = ts.filter(x => !tDone(x)), closed = ts.filter(tDone);
    const ds = decs().filter(x => inTopic(x, id)).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    const gs = S.data.okrs.filter(x => inTopic(x, id));
    const op = (t.open || []);
    const fs = tfiles().filter(x => inTopic(x, id));
    const props = S.data.ideas.filter(i => (i.esito && i.esito.topicId === id));
    const ld = ds[0];
    const decRow = d => `<details class="dx"><summary>${IC.chev.replace("<svg", '<svg class="chev"')}<div class="grow"><div class="t">${esc(d.short || d.title)}</div><div class="m">${dateIT(d.date || d.createdAt)}${d.callTitle ? " · " + esc(d.callTitle) : ""}</div></div></summary><div class="body">
      ${d.why ? `<div><div class="lab">Perché</div><div class="pre">${esc(d.why)}</div></div>` : `<div class="muted small">Il perché non è stato scritto.</div>`}
      ${d.options ? `<div><div class="lab">Alternative scartate</div><div class="pre">${esc(d.options)}</div></div>` : ""}
      ${S.canWrite ? `<div class="row"><button class="btn sm" data-h="edec:${d.id}">Modifica</button></div>` : ""}</div></details>`;
    const goalRow = g => { const cl = g.checklist || [], dn = cl.filter(x => x.done).length; return `<details class="dx ${g.closed ? "done" : ""}"><summary>${IC.chev.replace("<svg", '<svg class="chev"')}<div class="grow"><div class="t">${esc(g.title)}</div><div class="m">${g.closed ? "chiuso" : cl.length ? `${dn}/${cl.length} fatti` : "aperto"}${g.owner ? " · " + esc(g.owner) : ""}</div></div>${cl.length ? `<div class="bar" style="width:70px"><i style="width:${cl.length ? dn / cl.length * 100 : 0}%"></i></div>` : ""}</summary><div class="body">
      ${g.result || g.why ? `<div><div class="lab">Risultato da raggiungere</div><div class="pre">${esc(g.result || g.why)}</div></div>` : ""}
      ${cl.length ? `<div><div class="lab">Checklist</div>${cl.map((c, k) => `<div class="r2 ${c.done ? "done" : ""}"><button class="ck ${c.done ? "on" : ""}" data-h="gck:${g.id}:${k}"></button><div class="grow"><div class="t">${esc(c.text)}</div></div></div>`).join("")}</div>` : ""}
      ${S.canWrite ? `<div class="row"><button class="btn sm" data-h="egoal:${g.id}">Modifica</button></div>` : ""}</div></details>`; };
    const hist = [...ds.map(d => [d.createdAt, "Decisione", d.short || d.title]), ...props.map(i => [i.esito.at || i.createdAt, "Proposta chiusa", i.title]), ...fs.flatMap(f => [[f.createdAt, "File", f.title], ...(f.storico || []).map(s => [s.at, "Versione superata", s.name])]), ...closed.map(x => [x.doneAt || x.updatedAt, "Attività chiusa", x.title])].filter(x => x[0]).sort((a, b) => String(b[0]).localeCompare(String(a[0])));
    const add = k => S.canWrite ? `<button class="btn sm ghost" data-h="add:${k}:${id}">${IC.plus.replace("<svg", '<svg width="15" height="15"')} Aggiungi</button>` : "";
    return `<div class="w2">${topbar()}
    <div><button class="back" data-nav="argomenti">${IC.back.replace("<svg", '<svg width="16" height="16"')} Argomenti</button>
    <section class="thead"><div class="row between"><div class="row" style="gap:12px"><h1>${esc(t.title)}</h1>${(t.status || "attivo") !== "attivo" ? `<span class="tag plain">${esc(t.status)}</span>` : ""}</div><div class="row">${avs(t.people)}${S.canWrite ? `<button class="btn sm" data-h="etopic:${id}">Modifica</button><button class="btn sm acc" data-h="addmenu:${id}">${IC.plus.replace("<svg", '<svg width="15" height="15"')} Aggiungi</button>` : ""}</div></div>
      <div class="now"><b>A che punto siamo</b>${esc(t.summary || "Scrivi in due righe lo stato attuale: si aggiorna quando cambia.")}${ld ? `<div style="margin-top:8px;opacity:.85">Ultima decisione: ${esc(ld.short || ld.title)} <span style="opacity:.7">(${dateIT(ld.date || ld.createdAt)})</span></div>` : ""}</div></section></div>
    <div class="g2">
      ${card(IC.task, "", "Attività", open.length, (open.length ? `<div>${open.map(x => taskRow(x, { noTopic: true, people: 1 })).join("")}</div>` : `<div class="empty2">Nessuna attività aperta.</div>`) + (closed.length ? `<details class="dx"><summary>${IC.chev.replace("<svg", '<svg class="chev"')}<span class="m">${closed.length} chiuse</span></summary><div class="body">${closed.map(x => taskRow(x, { noTopic: true, people: 1 })).join("")}</div></details>` : ""), add("task"))}
      ${card(IC.dec, "", "Decisioni", ds.length, ds.length ? `<div>${ds.map(decRow).join("")}</div>` : `<div class="empty2">Ancora nessuna decisione.</div>`, add("dec"))}
      ${card(IC.goal, "gr", "Obiettivi", gs.filter(g => !g.closed).length, gs.length ? `<div>${gs.map(goalRow).join("")}</div>` : `<div class="empty2">Nessun obiettivo.</div>`, add("goal"))}
      ${card(IC.open, "or", "Cose aperte", op.filter(x => !x.done).length, op.length ? `<div>${op.map((o, k) => `<div class="r2 ${o.done ? "done" : ""}"><button class="ck ${o.done ? "on" : ""}" data-h="open:${id}:${k}"></button><div class="grow"><div class="t">${esc(o.text)}</div></div></div>`).join("")}</div>` : `<div class="empty2">Niente in sospeso.</div>`, add("open"))}
      ${card(IC.file, "", "File", fs.length, fs.length ? `<div>${fs.map(fileRow).join("")}</div>` : `<div class="empty2">Nessun file.</div>`, S.canWrite ? `<button class="btn sm ghost" data-h="upload:${id}">${IC.plus.replace("<svg", '<svg width="15" height="15"')} Carica</button>` : "")}
      ${card(IC.hist, "", "Da dove viene", null, (props.length ? `<div>${props.map(i => `<div class="r2 click" data-h="prop:${i.id}">${IC.prop.replace("<svg", '<svg width="18" height="18"')}<div class="grow"><div class="t">${esc(i.title)}</div><div class="m">proposta di ${esc(String(i.by || "").split(" ")[0])}${i.esito && i.esito.nota ? " · " + esc(short(i.esito.nota, 80)) : ""}</div></div></div>`).join("")}</div>` : "") + (hist.length ? `<details class="dx"><summary>${IC.chev.replace("<svg", '<svg class="chev"')}<span class="m">Storia (${hist.length})</span></summary><div class="body">${hist.map(([at, k, x]) => `<div class="r2"><div class="grow"><div class="t">${esc(x)}</div><div class="m">${k} · ${dateIT(at)}</div></div></div>`).join("")}</div></details>` : "") || `<div class="empty2">Nessuna proposta collegata.</div>`)}
    </div></div>`;
  };

  /* ================= PROPOSTE ================= */
  function propCard(i) {
    const nc = (i.comments || []).length, p = i.pausa || {}, f = fase(i), tp = i.esito && topic(i.esito.topicId);
    return `<div class="pc" data-h="prop:${i.id}"><div class="t">${esc(i.title)}</div>
      <div class="m">${av(i.by)}<span title="Voti">▲ ${votes(i)}</span>${nc ? `<span>${nc} ${nc === 1 ? "commento" : "commenti"}</span>` : f === "da discutere" ? `<span class="sd or">mai discussa</span>` : ""}</div>
      ${f === "in pausa" ? `<div class="m"><span class="sd ${p.tipo === "disaccordo" ? "rd" : ""}">${esc(PAUSA[p.tipo] || "In pausa, motivo da scrivere")}</span>${p.quando ? `<span class="when ${whenCls(p.quando)}">${rel(p.quando)}</span>` : ""}</div>` : ""}
      ${f === "chiusa" ? `<div class="m">${tp ? `<span class="sd gr">${esc(tp.title)}</span>` : i.esito ? `<span class="sd">${esc(ESITO[i.esito.tipo] || "Chiusa")}</span>` : `<span class="sd or">da collegare a un argomento</span>`}</div>` : ""}</div>`;
  }
  V.proposte = () => {
    const by = f => S.data.ideas.filter(i => fase(i) === f).sort((a, b) => votes(b) - votes(a) || String(b.createdAt).localeCompare(String(a.createdAt)));
    const mob = window.matchMedia("(max-width: 880px)").matches, sel = H.pf || "da discutere";
    const col = (f, l) => { const l2 = by(f); return `<div class="pcol"><div class="hd"><span>${l}</span><span class="num muted">${l2.length}</span></div>${l2.map(propCard).join("") || `<div class="empty2" style="padding:6px">Nessuna.</div>`}</div>`; };
    const cols = [["da discutere", "Da discutere"], ["in pausa", "In pausa"], ["chiusa", "Chiuse"]];
    return `<div class="w2">${topbar(1)}
    ${page("Proposte", "Le idee da discutere. Quando la discussione finisce, si chiudono e diventano un argomento.")}
    ${mob ? `<div class="seg2">${cols.map(([f, l]) => `<button class="${sel === f ? "on" : ""}" data-h="pf:${f}">${l} <span class="num">${by(f).length}</span></button>`).join("")}</div><div class="pcols">${col(sel, cols.find(c => c[0] === sel)[1])}</div>` : `<div class="pcols">${cols.map(([f, l]) => col(f, l)).join("")}</div>`}
    </div>`;
  };
  function openProp(id) {
    const i = S.data.ideas.find(x => x.id === id); if (!i) return;
    H.propOpen = id;
    const f = fase(i), p = i.pausa || {}, tp = i.esito && topic(i.esito.topicId), body = String(i.body || i.problem || ""), long = body.length > 320;
    openModal(`${sheetHead(f === "da discutere" ? "Proposta da discutere" : f === "in pausa" ? "Proposta in pausa" : "Proposta chiusa", esc(i.title))}
      <div class="row small muted">${av(i.by)} ${esc(String(i.by || "").split(" ")[0])} · ${dateIT(i.createdAt)}</div>
      ${body ? (long ? `<details class="dx"><summary>${IC.chev.replace("<svg", '<svg class="chev"')}<div class="grow">${esc(short(body, 220))}</div></summary><div class="body pre">${esc(body)}</div></details>` : `<p class="pre">${esc(body)}</p>`) : ""}
      ${i.aiDesc ? `<div class="banner2"><b>Completata dall'AI:</b> ${esc(i.aiDesc)}</div>` : ""}
      ${f === "in pausa" ? `<div class="c2" style="box-shadow:none;background:var(--beige)"><div class="row"><span class="sd ${p.tipo === "disaccordo" ? "rd" : ""}">${esc(PAUSA[p.tipo] || "Motivo non scritto")}</span>${p.quando ? `<span class="when ${whenCls(p.quando)}">riprendere ${rel(p.quando)}</span>` : ""}</div>${p.manca ? `<div><b>Cosa manca:</b> ${esc(p.manca)}</div>` : ""}${p.chi ? `<div class="row">${av(p.chi)} la riprende ${esc(p.chi)}</div>` : ""}${p.note ? `<div class="pre small">${esc(p.note)}</div>` : ""}</div>` : ""}
      ${f === "chiusa" ? `<div class="row"><span class="sd gr">${esc(ESITO[(i.esito || {}).tipo] || "Chiusa")}</span>${tp ? `<button class="tag" data-h="topic:${tp.id}">${esc(tp.title)}</button>` : ""}${i.esito && i.esito.nota ? `<span class="small">${esc(i.esito.nota)}</span>` : ""}</div>` : ""}
      <section class="stack"><h3>Discussione</h3>${(i.comments || []).map(c => `<div class="r2">${av(c.by)}<div class="grow"><div class="pre" style="font-size:14px">${esc(c.text)}</div><div class="m">${esc(String(c.by || "").split(" ")[0])} · ${dateIT(c.at)}</div></div></div>`).join("") || `<div class="empty2">Nessun commento.</div>`}
      ${S.canWrite ? `<form class="row" id="cmt" style="flex-wrap:nowrap"><input class="inp" id="cmt_in" placeholder="Scrivi un commento" style="flex:1;min-width:0"><button class="btn pri">Invia</button></form>` : ""}</section>
      <div class="row between"><div class="row"><button class="vote ${voted(i) ? "on" : ""}" data-vote="${i.id}">▲ <span class="num">${votes(i)}</span> ${voted(i) ? "Hai votato" : "Vota"}</button>${S.canWrite ? `<button class="btn sm" data-h="eprop:${i.id}">Modifica</button>` : ""}</div>
      ${S.canWrite ? (f === "chiusa" ? `<button class="btn sm" data-h="reopen:${i.id}">Riapri</button>` : `<button class="btn acc" data-h="closeprop:${i.id}">Chiudi la discussione</button>`) : ""}</div>`);
    S.ideaOpen = id;
  }
  H.openProp = openProp;
  /* aggiornamento dal vivo della proposta aperta (commenti degli altri) */
  const _refresh = window.refreshOpen;
  const _cm = window.closeModal; window.closeModal = function () { H.propOpen = null; _cm(); };
  window.refreshOpen = function (col) { if (col === "ideas" && H.propOpen && !$("#modal").hidden && $("#cmt") && !S.form) { const v = $("#cmt_in") && $("#cmt_in").value; openProp(H.propOpen); if (v) $("#cmt_in").value = v; return; } return _refresh(col); };

  function similar(text) {
    const w = new Set(norm(text).split(" ").filter(x => x.length > 3)); if (w.size < 1) return [];
    const sc = s => { const v = norm(s).split(" ").filter(x => x.length > 3); if (!v.length) return 0; let k = 0; v.forEach(x => { if (w.has(x)) k++; }); return k / Math.min(w.size, v.length); };
    return [...topics().map(t => ({ k: "t", d: t, s: Math.max(sc(t.title), sc(t.summary) * .8) })), ...S.data.ideas.filter(i => fase(i) !== "chiusa").map(i => ({ k: "i", d: i, s: sc(i.title) }))].filter(x => x.s >= .5).sort((a, b) => b.s - a.s).slice(0, 4);
  }
  function newProp() {
    openModal(`${sheetHead("Nuova proposta", "Cosa proponi?")}<form class="f2" data-hform="prop">
      <label>In una riga<div class="row" style="flex-wrap:nowrap"><input id="np_t" autocomplete="off" placeholder="Es. Simulazioni d'esame cronometrate" required>${H.sr ? `<button type="button" class="mic" data-h="mic:np_t" title="Detta a voce">${IC.mic}</button>` : ""}</div></label>
      <div id="np_dup"></div>
      <details class="dx"><summary>${IC.chev.replace("<svg", '<svg class="chev"')}<span class="m">Aggiungi una spiegazione (facoltativa)</span></summary><div class="body" style="padding-left:0"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><textarea id="np_b" rows="4" placeholder="Il problema, l'idea, cosa servirebbe…"></textarea>${H.sr ? `<button type="button" class="mic" data-h="mic:np_b">${IC.mic}</button>` : ""}</div></div></details>
      <div class="foot"><button type="button" class="btn" data-close>Annulla</button><button class="btn acc">Proponi</button></div></form>`);
    setTimeout(() => $("#np_t") && $("#np_t").focus(), 40);
  }
  document.addEventListener("input", e => {
    if (e.target.id !== "np_t") return;
    const box = $("#np_dup"), list = similar(e.target.value);
    box.innerHTML = list.length ? `<div class="dup"><b>Forse esiste già:</b>${list.map(x => x.k === "t" ? `<div class="r2">${IC.arg.replace("<svg", '<svg width="18" height="18"')}<div class="grow"><div class="t">${esc(x.d.title)}</div><div class="m">argomento</div></div><button type="button" class="btn sm" data-h="dupt:${x.d.id}">Aggiungi lì come cosa aperta</button></div>` : `<div class="r2">${IC.prop.replace("<svg", '<svg width="18" height="18"')}<div class="grow"><div class="t">${esc(x.d.title)}</div><div class="m">proposta ${esc(fase(x.d))}</div></div><button type="button" class="btn sm" data-h="dupi:${x.d.id}">Aggiungi lì come commento</button></div>`).join("")}<span class="small muted">Se è un'altra cosa, continua pure.</span></div>` : "";
  });

  /* chiudere una proposta */
  function closeProp(id) {
    const i = S.data.ideas.find(x => x.id === id); if (!i) return;
    H.cp = { id, k: "" };
    openModal(`${sheetHead("Chiudi la discussione", esc(i.title))}<form class="f2" data-hform="closeprop">
      <div class="opts">${[["unita", "Va in un argomento", "che esiste già"], ["argomento", "Diventa un argomento", "nuovo"], ["pausa", "In pausa", "per ora non si fa"], ["scartata", "Scartata", "non la facciamo"]].map(([k, b, s]) => `<button type="button" class="opt" data-h="cpk:${k}"><b>${b}</b><span>${s}</span></button>`).join("")}</div>
      <div id="cp_more"></div>
      <div class="foot"><button type="button" class="btn" data-close>Annulla</button><button class="btn acc" id="cp_go" disabled>Chiudi</button></div></form>`);
  }
  function cpMore(k) {
    H.cp.k = k; $$(".opt").forEach(b => b.classList.toggle("on", b.dataset.h === "cpk:" + k));
    const i = S.data.ideas.find(x => x.id === H.cp.id), pp = people();
    const dec = `<label>Cosa abbiamo deciso <small>(diventa una decisione dell'argomento)</small><input id="cp_dec" placeholder="In una riga"></label><label>Perché <small>(facoltativo)</small><textarea id="cp_why" rows="2"></textarea></label>`;
    $("#cp_more").innerHTML = k === "unita" ? `<label>Argomento<select id="cp_t">${topics().map(t => `<option value="${t.id}">${esc(t.title)}</option>`).join("")}</select></label>${dec}`
      : k === "argomento" ? `<label>Nome dell'argomento<input id="cp_nt" value="${esc(i.title)}"></label><label>A che punto siamo <small>(2 righe)</small><textarea id="cp_sum" rows="2"></textarea></label>${dec}`
      : k === "pausa" ? `<label>Perché è in pausa<select id="cp_pt">${Object.entries(PAUSA).map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}</select></label><label>Cosa manca per riprenderla<input id="cp_pm"></label><div class="two"><label>Chi la riprende<select id="cp_pc"><option value="">—</option>${pp.map(p => `<option>${esc(p)}</option>`).join("")}</select></label><label>Quando ricontrollarla<input type="date" id="cp_pq"></label></div><label>Cosa ci siamo detti <small>(facoltativo)</small><textarea id="cp_pn" rows="2"></textarea></label><small>Se non siete d'accordo, torna da sola nell'ordine del giorno della prossima call.</small>`
      : `<label>Perché la scartiamo <small>(facoltativo)</small><input id="cp_sn"></label>`;
    if (k === "unita" && !topics().length) $("#cp_more").innerHTML = `<div class="banner2">Non ci sono ancora argomenti: scegli «Diventa un argomento».</div>`;
    $("#cp_go").disabled = k === "unita" && !topics().length;
  }
  async function closePropGo() {
    const id = H.cp.id, k = H.cp.k, v = x => ($("#" + x) || {}).value || "";
    try {
      if (k === "pausa") { await upd("ideas", id, { fase: "in pausa", pausa: { tipo: v("cp_pt"), manca: v("cp_pm").trim(), chi: v("cp_pc"), quando: v("cp_pq"), note: v("cp_pn").trim(), at: nowISO(), by: S.uid } }); }
      else if (k === "scartata") { await upd("ideas", id, { fase: "chiusa", esito: { tipo: "scartata", nota: v("cp_sn").trim(), at: nowISO(), by: S.uid } }); }
      else {
        let tid = v("cp_t");
        if (k === "argomento") { const i = S.data.ideas.find(x => x.id === id); tid = await put("topics", { title: v("cp_nt").trim() || i.title, summary: v("cp_sum").trim(), status: "attivo", people: [...new Set([String(i.by || "").split(" ")[0], me()].filter(Boolean))], open: [] }); }
        if (v("cp_dec").trim()) await put("decisions", { title: v("cp_dec").trim(), short: v("cp_dec").trim(), why: v("cp_why").trim(), topicIds: [tid], date: localISO(), status: "Presa" });
        await upd("ideas", id, { fase: "chiusa", esito: { tipo: k, topicId: tid, nota: v("cp_dec").trim(), at: nowISO(), by: S.uid } });
        await upd("topics", tid, {});
        closeModal(); toast("Discussione chiusa"); go("argomento/" + tid); return;
      }
      closeModal(); toast("Discussione chiusa");
    } catch (e) {}
  }

  /* ================= CALL ================= */
  function agenda() {
    const out = [], lc = lastCall();
    if (lc) S.data.tasks.filter(t => t.callId === lc.id && !t.review).forEach(t => out.push(["rev", `Rivedere: ${t.title}`, "attività dall'ultima call", "task:" + t.id]));
    if (lc) S.data.okrs.filter(g => g.callId === lc.id && !g.review).forEach(g => out.push(["rev", `Rivedere: ${g.title}`, "obiettivo dall'ultima call", "goal:" + g.id]));
    S.data.ideas.filter(i => fase(i) === "in pausa" && i.pausa && i.pausa.tipo === "disaccordo").forEach(i => out.push(["dis", i.title, "non siamo d'accordo", "prop:" + i.id]));
    tfiles().filter(f => fstato(f) === "da approvare").forEach(f => out.push(["app", `Approvare «${f.title}»`, ((topic(f.topicId) || {}).title) || "file", "file:" + f.id]));
    pauseDue().forEach(i => out.push(["due", i.title, "pausa da ricontrollare", "prop:" + i.id]));
    S.data.ideas.filter(i => fase(i) === "da discutere").sort((a, b) => votes(b) - votes(a)).forEach(i => out.push(["prop", i.title, (i.comments || []).length ? `▲ ${votes(i)} · da discutere` : "mai discussa", "prop:" + i.id]));
    return out;
  }
  const REVIEW = ["Chiuso", "In pausa", "Da modificare", "Da ottimizzare", "Altro"];
  V.call = () => {
    const ag = agenda(), bz = pendingBozze(), lc = lastCall(), nc = nextCall();
    const revItems = lc ? [...S.data.tasks.filter(t => t.callId === lc.id).map(t => ["tasks", t]), ...S.data.okrs.filter(g => g.callId === lc.id).map(g => ["okrs", g])] : [];
    const calls = S.data.meetings.filter(m => m.imported || m.when).sort((a, b) => String(b.dataCall || b.when || "").localeCompare(String(a.dataCall || a.when || "")));
    return `<div class="w2">${topbar()}
    ${page("Call", "Prima: l'ordine del giorno. Dopo: la trascrizione all'AI, che prepara le bozze.", S.canWrite ? `<button class="btn" data-h="newcall">Programma la prossima</button><button class="btn acc big" data-h="import">${IC.ai.replace("<svg", '<svg width="16" height="16"')} Importa una call</button>` : "")}
    ${bz.length ? card(IC.ai, "or", "Bozze dall'AI da confermare", bz.length, bozzeHTML(bz), `<button class="btn sm pri" data-h="bzall">Conferma tutte</button>`) : ""}
    <div class="g2">
      ${card(IC.call, "", nc ? esc(nc.title || "Prossima call") : "Prossima call", null, nc ? `<div class="r2"><div class="grow"><div class="t">${fmtDT(nc.when)}</div><div class="m">${rel(nc.when)}</div></div>${nc.link ? `<a class="btn sm acc" href="${esc(safeUrl(nc.link))}" target="_blank" rel="noopener">Entra</a>` : ""}</div>` : `<div class="empty2">Nessuna data. <button class="btn sm" data-h="newcall">Programma</button></div>`)}
      ${card(IC.task, "gr", "Da rivedere insieme", revItems.filter(([, x]) => !x.review).length, revItems.length ? `<div>${revItems.map(([c, x]) => `<div class="r2"><div class="grow"><div class="t">${esc(x.title)}</div><div class="m">${esc(((topic(x.topicId) || {}).title) || "")}${x.review ? " · votato: " + esc(x.review.esito) : ""}</div><div class="vote5" style="margin-top:6px">${REVIEW.map(r => `<button class="${x.review && x.review.esito === r ? "on" : ""}" data-h="rev:${c}:${x.id}:${r}">${r}</button>`).join("")}</div></div></div>`).join("")}</div>` : `<div class="empty2">Dopo la prima call importata, qui votate se attività e obiettivi sono chiusi.</div>`)}
    </div>
    ${card(IC.news, "", "Ordine del giorno", ag.length, ag.length ? `<div class="agenda2">${ag.slice(0, 25).map(([k, t, m, ref]) => `<div class="r2 click" data-h="${ref}"><div class="grow"><div class="t">${esc(t)}</div><div class="m"><span class="sd ${k === "dis" ? "rd" : k === "app" || k === "rev" ? "or" : ""}">${esc(m)}</span></div></div></div>`).join("")}</div><div class="row"><button class="btn sm" data-h="copyag">Copia l'ordine del giorno</button></div>` : `<div class="empty2">Niente in sospeso.</div>`)}
    ${card(IC.hist, "", "Call passate", calls.filter(m => m.imported).length, calls.filter(m => m.imported).length ? `<div>${calls.filter(m => m.imported).map(m => { const md = decs().filter(d => d.callId === m.id), mt = S.data.tasks.filter(t => t.callId === m.id); return `<details class="dx"><summary>${IC.chev.replace("<svg", '<svg class="chev"')}<div class="grow"><div class="t">${esc(m.title || "Call")}</div><div class="m">${dateIT(m.dataCall || m.when)} · ${md.length} decisioni · ${mt.length} attività</div></div></summary><div class="body">${md.map(d => `<div class="r2 click" data-h="topic:${(d.topicIds || [])[0]}"><div class="grow"><div class="t">${esc(d.short || d.title)}</div><div class="m">${(d.topicIds || []).map(x => esc((topic(x) || {}).title || "")).join(", ")}</div></div></div>`).join("")}${mt.map(t => taskRow(t, { people: 1 })).join("")}${m.transcriptBlob ? `<div class="row"><button class="btn sm" data-h="tr:${m.id}">Scarica la trascrizione</button></div>` : ""}</div></details>`; }).join("")}</div>` : `<div class="empty2">Le call importate con l'AI compaiono qui, con le decisioni e le attività che hanno prodotto.</div>`)}
    </div>`;
  };

  /* ---------- AI: richiesta, risposta, bozze ---------- */
  function prompt(tr, meta) {
    const T = topics().map(t => `- ${t.id} | ${t.title} | ${t.status || "attivo"} | ${short(t.summary, 100)}`).join("\n") || "(nessuno)";
    const P = S.data.ideas.filter(i => fase(i) !== "chiusa").map(i => `- ${i.id} | ${i.title} | ${fase(i)}${(i.comments || []).length ? "" : " | MAI DISCUSSA"}${i.pausa && i.pausa.tipo ? " | pausa: " + i.pausa.tipo : ""}`).join("\n") || "(nessuna)";
    const A = S.data.tasks.filter(t => !tDone(t)).map(t => `- ${t.title}${t.topicId ? " | " + ((topic(t.topicId) || {}).title || "") : ""}`).join("\n") || "(nessuna)";
    return `Sei l'assistente di UniLink HQ, lo spazio di lavoro dei 4 founder di UniLink (${people().join(", ")}).
Ti do la trascrizione di una call${meta ? ` (${meta})` : ""}. La trascrizione può contenere errori: se un nome o un fatto è incerto, mettilo in "dubbi" invece di indovinare.

COSA FARE
Estrai SOLO ciò che va conservato: decisioni (con il perché detto in call), attività (chi fa cosa), obiettivi, punti rimasti aperti, proposte messe in pausa o chiuse. Ignora chiacchiere e ripetizioni.
Ogni cosa appartiene a un ARGOMENTO. Usa un argomento esistente (per id) quando corrisponde; creane uno nuovo in "argomenti_nuovi" solo se nessuno corrisponde, e poi riferisciti a lui con il suo "ref".

REGOLE DI BREVITÀ (obbligatorie)
- titoli e decisioni: massimo 12 parole; le attività iniziano con un verbo
- "perche" e "dettagli": massimo 2 frasi; "stato" di un argomento: massimo 2 righe
- niente ripetizioni tra campi; non inventare nulla che non sia nella trascrizione

ARGOMENTI ESISTENTI (id | titolo | stato | a che punto siamo)
${T}

PROPOSTE APERTE (id | titolo | fase)
${P}
Per le proposte MAI DISCUSSE puoi scrivere un "completamento" se in call se n'è parlato.

ATTIVITÀ APERTE (per non duplicarle)
${A}

RISPONDI SOLO CON UN BLOCCO JSON, senza testo prima o dopo, in questo formato (le liste vuote vanno lasciate vuote):
{
 "argomenti_nuovi": [{"ref": "n1", "titolo": "", "stato": "", "persone": [""]}],
 "decisioni": [{"argomento": "id o ref", "testo": "", "perche": "", "alternative": ""}],
 "attivita": [{"argomento": "id o ref", "titolo": "", "chi": [""], "parti": [{"chi": "", "cosa": ""}], "scadenza": "AAAA-MM-GG o vuoto", "dettagli": "", "passi": [""]}],
 "obiettivi": [{"argomento": "id o ref", "titolo": "", "risultato": "", "checklist": [""]}],
 "aperti": [{"argomento": "id o ref", "testo": ""}],
 "pause": [{"proposta": "id", "tipo": "scelta | informazioni | disaccordo", "manca": "", "chi": "", "quando": "AAAA-MM-GG o vuoto"}],
 "proposte_chiuse": [{"proposta": "id", "esito": "argomento | scartata", "argomento": "id o ref", "nota": ""}],
 "completamenti": [{"proposta": "id", "testo": ""}],
 "dubbi": [""]
}
Usa "parti" invece di "chi" quando un lavoro è diviso tra più persone.

TRASCRIZIONE
${tr || "(incollala qui)"}`;
  }
  function openImport() {
    openModal(`${sheetHead("Importa una call", "Dalla trascrizione alle bozze")}<form class="f2" data-hform="import">
      <div class="steps3">
        <div class="step3"><span class="k">1 · La call</span><div class="two"><label>Titolo<input id="im_t" placeholder="Es. Call #3"></label><label>Data<input type="date" id="im_d" value="${localISO()}"></label></div><label>Trascrizione<textarea id="im_tr" rows="5" placeholder="Incolla qui il testo dell'app di trascrizione"></textarea></label></div>
        <div class="step3"><span class="k">2 · Chiedi all'AI</span><p class="small">Copia la richiesta (contiene la trascrizione, gli argomenti e le proposte) e incollala in una chat con Claude o ChatGPT.</p><button type="button" class="btn" data-h="copyprompt">Copia la richiesta per l'AI</button></div>
        <div class="step3"><span class="k">3 · Incolla la risposta</span><label>Risposta dell'AI<textarea id="im_js" rows="5" placeholder='{"argomenti_nuovi": …}'></textarea></label><label class="small">oppure scegli il file .json<input type="file" id="im_file" accept=".json,.txt,application/json"></label></div>
      </div>
      <small>Arriva tutto come bozza: niente diventa ufficiale finché non lo confermi.</small>
      <div class="foot"><button type="button" class="btn" data-close>Annulla</button><button class="btn acc">Crea le bozze</button></div></form>`);
  }
  const BZ_ORDER = ["argomento", "decisione", "attivita", "obiettivo", "aperto", "pausa", "chiusura", "completamento", "collega", "dubbio"];
  const BZ_L = { argomento: "Nuovo argomento", decisione: "Decisione", attivita: "Attività", obiettivo: "Obiettivo", aperto: "Cosa aperta", pausa: "Pausa", chiusura: "Proposta chiusa", completamento: "Completamento", collega: "Collegamento", dubbio: "Dubbio dell'AI" };
  async function importJSON(raw, meta) {
    let j; const s = String(raw || "").replace(/^[\s\S]*?```(?:json)?/i, m => m.includes("```") ? "" : m).replace(/```[\s\S]*$/, "");
    try { j = JSON.parse(s.slice(s.indexOf("{"), s.lastIndexOf("}") + 1)); } catch (e) { toast("La risposta non è un JSON valido: copia solo il blocco tra { e }.", 6000); return false; }
    let callId = "";
    if (meta && (meta.t || meta.tr)) { const blob = meta.tr ? await putBlob(meta.tr) : ""; callId = await put("meetings", { title: meta.t || "Call", dataCall: meta.d || localISO(), when: (meta.d || localISO()) + "T18:00", imported: true, transcriptBlob: blob, kind: "Settimanale founder" }); }
    const add = (kind, data) => put("bozze", { callId, kind, data, state: "da confermare", batch: H.batch });
    H.batch = nowISO();
    const L = (k, kind) => (j[k] || []).forEach(x => out.push([kind, x])); const out = [];
    L("argomenti_nuovi", "argomento"); L("decisioni", "decisione"); L("attivita", "attivita"); L("obiettivi", "obiettivo"); L("aperti", "aperto"); L("pause", "pausa"); L("proposte_chiuse", "chiusura"); L("completamenti", "completamento"); L("collega", "collega");
    (j.dubbi || []).filter(Boolean).forEach(x => out.push(["dubbio", { testo: x }]));
    for (const [k, x] of out) await add(k, x);
    toast(`${out.length} bozze create`); return true;
  }
  function resolveTopic(ref, b) {
    if (!ref) return "";
    if (Array.isArray(ref)) ref = ref[0];
    if (topic(ref)) return ref;
    const bz = S.data.bozze.find(x => x.kind === "argomento" && x.state === "confermata" && x.data && (x.data.ref === ref || norm(x.data.titolo) === norm(ref)) && (!b || x.batch === b.batch));
    if (bz && bz.createdId) return bz.createdId;
    const t = S.data.topics.find(x => norm(x.title) === norm(ref)); return t ? t.id : "";
  }
  const findIdea = r => S.data.ideas.find(i => i.id === r) || S.data.ideas.find(i => norm(i.title) === norm(r));
  const findBy = (col, r) => S.data[col].find(i => norm(i.title || i.name) === norm(r));
  function bzText(b) {
    const d = b.data || {}, tp = d.argomento ? (topic(resolveTopic(d.argomento, b)) || {}).title || d.argomento : "";
    switch (b.kind) {
      case "argomento": return [d.titolo, d.stato];
      case "decisione": return [d.testo, [tp, d.perche && "perché: " + d.perche].filter(Boolean).join(" · ")];
      case "attivita": return [d.titolo, [tp, (d.parti || []).length ? d.parti.map(p => `${p.chi}: ${p.cosa}`).join(", ") : (d.chi || []).join(", "), d.scadenza].filter(Boolean).join(" · ")];
      case "obiettivo": return [d.titolo, [tp, d.risultato].filter(Boolean).join(" · ")];
      case "aperto": return [d.testo, tp];
      case "pausa": return [(findIdea(d.proposta) || {}).title || d.proposta, [PAUSA[d.tipo], d.manca, d.chi].filter(Boolean).join(" · ")];
      case "chiusura": return [(findIdea(d.proposta) || {}).title || d.proposta, [ESITO[d.esito] || d.esito, tp, d.nota].filter(Boolean).join(" · ")];
      case "completamento": return [(findIdea(d.proposta) || {}).title || d.proposta, d.testo];
      case "collega": return [d.titolo, `${d.tipo} → ${[].concat(d.argomento || []).map(a => (topic(resolveTopic(a, b)) || {}).title || a).join(", ")}${(d.parti || []).length ? " · parti: " + d.parti.map(p => p.chi).join(", ") : ""}`];
      default: return [d.testo, ""];
    }
  }
  function bzProblem(b) {
    const d = b.data || {};
    if (["decisione", "attivita", "obiettivo", "aperto"].includes(b.kind) && !resolveTopic(d.argomento, b)) return "Prima conferma il suo argomento";
    if (b.kind === "chiusura" && d.esito !== "scartata" && !resolveTopic(d.argomento, b)) return "Prima conferma il suo argomento";
    if (["pausa", "chiusura", "completamento"].includes(b.kind) && !findIdea(d.proposta)) return "Proposta non trovata";
    if (b.kind === "collega") { const col = { attivita: "tasks", obiettivo: "okrs", file: "docs", decisione: "decisions" }[d.tipo]; if (!col || !findBy(col, d.titolo)) return "Elemento non trovato"; if (![].concat(d.argomento || []).every(a => resolveTopic(a, b))) return "Prima conferma il suo argomento"; }
    return "";
  }
  function bozzeHTML(list) {
    return `<div>${list.slice().sort((a, b) => BZ_ORDER.indexOf(a.kind) - BZ_ORDER.indexOf(b.kind)).map(b => { const [t, m] = bzText(b), pr = bzProblem(b); return `<div class="r2 bz"><div class="grow"><div class="m"><b>${BZ_L[b.kind] || b.kind}</b></div><div class="t">${esc(t || "")}</div>${m ? `<div class="m">${esc(short(m, 220))}</div>` : ""}${pr ? `<div class="m" style="color:var(--orange-dark)">${pr}</div>` : ""}</div><div class="row" style="flex-wrap:nowrap">${b.kind === "dubbio" ? `<button class="btn sm" data-h="bzno:${b.id}">Letto</button>` : `<button class="btn sm pri" data-h="bzok:${b.id}" ${pr ? "disabled" : ""}>Conferma</button><button class="btn sm ghost" data-h="bzno:${b.id}">Scarta</button>`}</div></div>`; }).join("")}</div>`;
  }
  async function bzConfirm(id, quiet) {
    const b = S.data.bozze.find(x => x.id === id); if (!b || b.state !== "da confermare" || bzProblem(b)) return false;
    const d = b.data || {}, base = { callId: b.callId || "", fromAI: true }, tid = () => resolveTopic(d.argomento, b), callT = (S.data.meetings.find(m => m.id === b.callId) || {}).title || "";
    let createdId = "";
    if (b.kind === "argomento") createdId = await put("topics", { title: d.titolo, summary: d.stato || "", people: d.persone || [], status: "attivo", open: [] });
    else if (b.kind === "decisione") { createdId = await put("decisions", { ...base, title: d.testo, short: d.testo, why: d.perche || "", options: d.alternative || "", topicIds: [tid()], date: localISO(), status: "Presa", callTitle: callT }); await upd("topics", tid(), {}); }
    else if (b.kind === "attivita") { const parts = (d.parti || []).filter(p => p.chi).map(p => ({ who: p.chi, text: p.cosa || "", done: false })), chi = (d.chi || []).filter(Boolean); createdId = await put("tasks", { ...base, title: d.titolo, topicId: tid(), owner: parts.length ? "" : chi[0] || "", parts: parts.length ? parts : chi.length > 1 ? chi.map(c => ({ who: c, text: "", done: false })) : [], due: d.scadenza || "", details: d.dettagli || "", steps: (d.passi || []).filter(Boolean).map(t => ({ text: t, done: false })), status: "Da fare", priority: "Media" }); }
    else if (b.kind === "obiettivo") createdId = await put("okrs", { ...base, title: d.titolo, topicId: tid(), result: d.risultato || "", checklist: (d.checklist || []).filter(Boolean).map(t => ({ text: t, done: false })), quarter: curQ(), krs: [] });
    else if (b.kind === "aperto") { const t = topic(tid()); await upd("topics", t.id, { open: [...(t.open || []), { id: Date.now().toString(36), text: d.testo, done: false, by: S.uid, at: nowISO() }] }); }
    else if (b.kind === "pausa") { const i = findIdea(d.proposta); await upd("ideas", i.id, { fase: "in pausa", pausa: { tipo: d.tipo || "scelta", manca: d.manca || "", chi: d.chi || "", quando: d.quando || "", at: nowISO(), by: S.uid, fromAI: true } }); }
    else if (b.kind === "chiusura") { const i = findIdea(d.proposta); await upd("ideas", i.id, { fase: "chiusa", esito: { tipo: d.esito === "scartata" ? "scartata" : "unita", topicId: d.esito === "scartata" ? "" : tid(), nota: d.nota || "", at: nowISO(), by: S.uid } }); }
    else if (b.kind === "completamento") { const i = findIdea(d.proposta); await upd("ideas", i.id, { aiDesc: d.testo }); }
    else if (b.kind === "collega") { const col = { attivita: "tasks", obiettivo: "okrs", file: "docs", decisione: "decisions" }[d.tipo], x = findBy(col, d.titolo), ids = [].concat(d.argomento || []).map(a => resolveTopic(a, b)); const patch = col === "decisions" ? { topicIds: ids, short: d.breve || x.title } : { topicId: ids[0], topicIds: ids }; if (col === "tasks" && (d.parti || []).length) patch.parts = d.parti.map(p => ({ who: p.chi, text: p.cosa || "", done: false })); if (col === "docs") { patch.stato = x.stato || "approvato"; if (d.desc) patch.desc = d.desc; } if (col === "okrs" && d.risultato) patch.result = d.risultato; await upd(col, x.id, patch); }
    await upd("bozze", id, { state: "confermata", createdId });
    if (!quiet) toast("Confermata"); return true;
  }
  async function bzAll() {
    let n = 0;
    for (const k of BZ_ORDER) for (const b of pendingBozze().filter(x => x.kind === k)) { if (k === "dubbio") continue; try { if (await bzConfirm(b.id, true)) n++; } catch (e) { break; } }
    toast(`${n} bozze confermate${pendingBozze().filter(b => b.kind !== "dubbio").length ? ": alcune aspettano qualcosa" : ""}`);
  }

  /* ================= FILE ================= */
  function fileRow(f) {
    const cur = (f.files || [])[0], st = fstato(f), tp = topic(f.topicId), hidden = st === "in lavorazione" && !isMe(f.by);
    const stC = st === "approvato" ? "gr" : st === "da approvare" ? "or" : "";
    const appr = Object.keys(f.approvals || {});
    return `<details class="dx"><summary>${IC.chev.replace("<svg", '<svg class="chev"')}<span class="fx">${esc(cur ? ext(cur.name) : f.url ? "link" : "doc")}</span><div class="grow"><div class="t">${esc(f.title || (cur && cur.name) || "File")}</div><div class="m">${[f.desc && esc(short(f.desc, 80)), tp && esc(tp.title), f.versione > 1 ? "v" + f.versione : "", esc(String(f.by || "").split(" ")[0]), dateIT(f.updatedAt || f.createdAt)].filter(Boolean).join(" · ")}</div></div><span class="sd ${stC}">${st}</span></summary><div class="body">
      ${hidden ? `<div class="muted">${esc(String(f.by || "").split(" ")[0])} ci sta lavorando: lo vedrete quando lo manda in approvazione.</div>` : `<div class="row">${cur ? `<button class="btn sm pri" data-openfile="${esc(cur.path)}">Apri</button>` : ""}${f.url ? `<a class="btn sm" href="${esc(safeUrl(f.url))}" target="_blank" rel="noopener">Apri il link</a>` : ""}${tp ? `<button class="tag" data-h="topic:${tp.id}">${esc(tp.title)}</button>` : ""}</div>`}
      ${st === "da approvare" ? `<div class="row">${appr.length ? `<span class="small">Approvato da ${appr.map(esc).join(", ")}</span>` : `<span class="small muted">Da approvare: ${involvedStrict(f).length ? involved(f).map(esc).join(", ") : "basta uno di " + involved(f).map(esc).join(", ")}</span>`}${mineToApprove(f) ? `<button class="btn sm acc" data-h="approve:${f.id}">Approvo</button>` : ""}</div>` : ""}
      ${S.canWrite && isMe(f.by) && st === "in lavorazione" ? `<div class="row"><button class="btn sm acc" data-h="toappr:${f.id}">Manda in approvazione</button></div>` : ""}
      ${(f.storico || []).length ? `<details class="dx"><summary>${IC.chev.replace("<svg", '<svg class="chev"')}<span class="m">Versioni precedenti (${f.storico.length})</span></summary><div class="body">${f.storico.map(s => `<div class="r2"><div class="grow"><div class="t">${esc(s.name)}</div><div class="m">v${s.v || "?"} · ${dateIT(s.at)}</div></div><button class="btn sm ghost" data-openfile="${esc(s.path)}">Apri</button></div>`).join("")}</div></details>` : ""}
      ${S.canWrite ? `<div class="row"><button class="btn sm" data-h="newver:${f.id}">Carica una nuova versione</button><button class="btn sm ghost" data-h="efile:${f.id}">Modifica</button></div>` : ""}</div></details>`;
  }
  V.file = () => {
    const F = H.ff, q = norm(F.q);
    const list = tfiles().filter(f => (!F.t || inTopic(f, F.t)) && (!F.s || fstato(f) === F.s) && (!q || norm([f.title, f.desc, ...(f.files || []).map(x => x.name), (topic(f.topicId) || {}).title].join(" ")).includes(q))).sort((a, b) => String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt)));
    const legacy = allFiles().filter(x => !(x.src && x.src.col === "docs" && (S.data.docs.find(d => d.id === x.src.id) || {}).topicId)).filter(x => !q || norm([x.name, x.title, x.label].join(" ")).includes(q));
    return `<div class="w2">${topbar()}
    ${page("File", "Ogni file sta in un argomento e dice a cosa si riferisce. Le versioni vecchie restano nello storico.", S.canWrite ? `<button class="btn acc big" data-h="upload:">${IC.plus.replace("<svg", '<svg width="16" height="16"')} Carica un file</button>` : "")}
    <div class="filt"><input id="ff_q" placeholder="Cerca un file" value="${esc(F.q)}" autocomplete="off"><select data-h2sel="t"><option value="">Tutti gli argomenti</option>${topics().map(t => `<option value="${t.id}" ${F.t === t.id ? "selected" : ""}>${esc(t.title)}</option>`).join("")}</select><select data-h2sel="s"><option value="">Ogni stato</option>${["approvato", "da approvare", "in lavorazione"].map(s => `<option ${F.s === s ? "selected" : ""}>${s}</option>`).join("")}</select></div>
    <section class="c2">${list.length ? `<div>${list.map(fileRow).join("")}</div>` : `<div class="empty2">${tfiles().length ? "Nessun file corrisponde." : "Ancora nessun file negli argomenti."}</div>`}</section>
    ${legacy.length ? `<section class="c2"><details class="dx"><summary>${IC.chev.replace("<svg", '<svg class="chev"')}<div class="grow"><div class="t">Dal vecchio HQ</div><div class="m">${legacy.length} allegati di idee, meeting e documenti, non ancora in un argomento</div></div></summary><div class="body" style="padding-left:0">${legacy.slice(0, 80).map(x => `<div class="r2"><span class="fx">${esc(x.link ? "link" : ext(x.name))}</span><div class="grow"><div class="t">${esc(x.name)}</div><div class="m">${esc([x.title, x.label].filter(Boolean).join(" · "))}</div></div>${x.link ? `<a class="btn sm ghost" href="${esc(safeUrl(x.link))}" target="_blank" rel="noopener">Apri</a>` : `<button class="btn sm ghost" data-openfile="${esc(x.path)}">Apri</button>`}</div>`).join("")}</div></details></section>` : ""}
    </div>`;
  };
  function openUpload(tid, verOf) {
    const f = verOf && S.data.docs.find(d => d.id === verOf);
    openModal(`${sheetHead(f ? "Nuova versione" : "Carica un file", f ? esc(f.title) : "")}<form class="f2" data-hform="upload" data-ver="${verOf || ""}">
      <label>File<input type="file" id="up_f" required></label>
      ${f ? "" : `<label>Nome<input id="up_t" placeholder="Si prende dal file se lo lasci vuoto"></label>
      <label>A cosa si riferisce <small>(una riga)</small><input id="up_d" placeholder="Es. Listino definitivo dopo la call del 7/10"></label>
      <label>Argomento<select id="up_tp"><option value="">— nessuno —</option>${topics().map(t => `<option value="${t.id}" ${t.id === tid ? "selected" : ""}>${esc(t.title)}</option>`).join("")}</select></label>`}
      <label>Stato<select id="up_s"><option value="da approvare">Da approvare: lo vedono e lo approvano gli altri</option><option value="in lavorazione">In lavorazione: gli altri vedono solo il titolo</option>${f && fstato(f) !== "approvato" ? "" : ""}</select></label>
      ${f && fstato(f) === "approvato" ? `<small>La versione approvata va nello storico; la nuova va riapprovata.</small>` : ""}
      <div class="foot"><button type="button" class="btn" data-close>Annulla</button><button class="btn acc">Carica</button></div></form>`);
  }
  async function doUpload(form) {
    const file = $("#up_f").files[0]; if (!file) { toast("Scegli un file."); return; }
    if (hasFiles() && file.size > HQ_FILES.max) { toast("Il file supera i 25 MB."); return; }
    const btn = form.querySelector(".btn.acc"); btn.disabled = true; btn.textContent = "Carico…";
    try {
      const up = hasFiles() ? await guard(() => HQ_FILES.upload(file, "argomenti")) : { path: "", name: file.name, size: file.size };
      const entry = { ...up, by: S.uid || "", at: nowISO() }, st = $("#up_s").value, ver = form.dataset.ver;
      if (ver) { const f = S.data.docs.find(d => d.id === ver), old = (f.files || [])[0]; await upd("docs", ver, { files: [entry], storico: [...(old ? [{ ...old, v: f.versione || 1, at: old.at || f.createdAt }] : []), ...(f.storico || [])], versione: (f.versione || 1) + 1, stato: st, approvals: {}, approvedAt: "" }); }
      else { const tp = $("#up_tp").value; await put("docs", { title: $("#up_t").value.trim() || file.name.replace(/\.[^.]+$/, ""), desc: $("#up_d").value.trim(), topicId: tp, topicIds: tp ? [tp] : [], cat: "Altro", files: [entry], stato: st, versione: 1, approvals: {} }); if (tp) await upd("topics", tp, {}); }
      closeModal(); toast("File caricato");
    } catch (e) { btn.disabled = false; btn.textContent = "Riprova"; }
  }
  async function approve(id) {
    const f = S.data.docs.find(d => d.id === id); if (!f) return;
    const ap = { ...(f.approvals || {}), [me()]: nowISO() };
    const strict = involvedStrict(f), done = strict.length ? strict.every(p => Object.keys(ap).some(k => first(k) === first(p))) : true;
    await upd("docs", id, { approvals: ap, ...(done ? { stato: "approvato", approvedAt: nowISO() } : {}) });
    toast(done ? "Approvato da tutti" : "Approvazione registrata");
  }

  /* ================= ricerca globale ================= */
  function searchIdx() {
    const out = [];
    topics().forEach(t => out.push(["Argomenti", t.title, short(t.summary, 80), "topic:" + t.id]));
    decs().forEach(d => out.push(["Decisioni", d.short || d.title, [(topic((d.topicIds || [])[0]) || {}).title, short(d.why, 60)].filter(Boolean).join(" · "), "topic:" + (d.topicIds || [])[0], d.why]));
    S.data.tasks.forEach(t => out.push(["Attività", t.title, [(topic(t.topicId) || {}).title, tDone(t) ? "fatta" : tPeople(t).join(", ")].filter(Boolean).join(" · "), t.topicId ? "topic:" + t.topicId : "etask:" + t.id, t.details]));
    S.data.okrs.forEach(g => out.push(["Obiettivi", g.title, (topic(g.topicId) || {}).title || "", g.topicId ? "topic:" + g.topicId : "nav:goals", g.result]));
    S.data.ideas.forEach(i => out.push(["Proposte", i.title, fase(i), "prop:" + i.id, i.body]));
    tfiles().forEach(f => out.push(["File", f.title, [f.desc, (topic(f.topicId) || {}).title].filter(Boolean).join(" · "), "file:" + f.id, (f.files || []).map(x => x.name).join(" ")]));
    allFiles().filter(x => !(x.src && x.src.col === "docs" && (S.data.docs.find(d => d.id === x.src.id) || {}).topicId)).forEach(x => out.push(["File", x.name, [x.title, x.label].filter(Boolean).join(" · "), x.path ? "of:" + x.path : "nav:docs"]));
    S.data.meetings.forEach(m => out.push(["Call", m.title, dateIT(m.dataCall || m.when), "nav:call", m.notes]));
    S.data.topics.forEach(t => (t.open || []).forEach(o => out.push(["Cose aperte", o.text, t.title, "topic:" + t.id])));
    return out;
  }
  function openSearch() {
    if ($(".qov")) return;
    const ov = document.createElement("div"); ov.className = "qov";
    ov.innerHTML = `<div class="qbox" role="dialog" aria-label="Cerca"><input id="qs_in" placeholder="Cerca argomenti, decisioni, attività, file…" autocomplete="off"><div class="qres" id="qs_r"><div class="qres gh" style="padding:14px">Scrivi almeno due lettere.</div></div></div>`;
    document.body.appendChild(ov); H.qsel = 0; $("#qs_in").focus();
    ov.addEventListener("mousedown", e => { if (e.target === ov) ov.remove(); });
  }
  function drawSearch() {
    const q = norm($("#qs_in").value), box = $("#qs_r"); if (!box) return;
    if (q.length < 2) { box.innerHTML = `<div class="gh" style="padding:14px">Scrivi almeno due lettere.</div>`; H.qres = []; return; }
    const ws = q.split(" ");
    const res = searchIdx().map(r => { const a = norm(r[1]), b = norm([r[2], r[4]].join(" ")); if (!ws.every(w => a.includes(w) || b.includes(w))) return null; return [r, ws.every(w => a.includes(w)) ? 2 : 1]; }).filter(Boolean).sort((x, y) => y[1] - x[1]).slice(0, 30).map(x => x[0]);
    H.qres = res; H.qsel = Math.min(H.qsel || 0, Math.max(0, res.length - 1));
    let g = ""; box.innerHTML = res.length ? res.map((r, k) => `${r[0] !== g ? `<div class="gh">${(g = r[0])}</div>` : ""}<div class="r2 ${k === H.qsel ? "sel" : ""}" data-qk="${k}"><div class="grow"><div class="t">${esc(r[1] || "")}</div>${r[2] ? `<div class="m">${esc(r[2])}</div>` : ""}</div></div>`).join("") : `<div class="gh" style="padding:14px">Nessun risultato.</div>`;
  }
  function pickSearch(k) { const r = (H.qres || [])[k]; if (!r) return; $(".qov") && $(".qov").remove(); act(r[3]); }

  /* ================= archivio ================= */
  V.archivio = () => `<div class="w2">${topbar()}${page("Archivio del vecchio HQ", "Le sezioni di prima, con tutti i loro dati: niente è stato cancellato.")}
    <div class="archg">${[["home", "Cruscotto", "la vecchia pagina iniziale"], ["calendar", "Calendario", "meeting, scadenze, compleanni"], ["ideas", "Bacheca delle idee", "con tipo, natura, impatto e sforzo"], ["feedback", "Voce degli studenti", "cosa dicono gli studenti"], ["notes", "Note rapide", "appunti al volo"], ["tasks", "Scadenze e task", "tutti i task, anche senza argomento"], ["okrs", "Obiettivi (OKR)", "con risultati chiave"], ["meetings", "Meeting e verbali", "agenda, verbali, stanze fisse"], ["decisions", "Registro decisioni", "comprese quelle di prima"], ["links", "Link utili", "cartelle e strumenti"], ["docs", "Documenti", "tutti gli allegati per cartella"]].map(([v, t, s]) => `<button data-nav="${v}"><b>${t}</b><span>${s}</span></button>`).join("")}
    <button data-h="classico"><b>HQ classico</b><span>la versione completa com'era il 9 ottobre</span></button></div></div>`;

  /* ================= moduli piccoli ================= */
  const ppCheck = (sel, name = "pp") => `<div class="row">${people().map(p => `<label class="row" style="flex-direction:row;gap:6px;font-weight:400;color:var(--ink)"><input type="checkbox" name="${name}" value="${esc(p)}" ${(sel || []).some(x => first(x) === first(p)) ? "checked" : ""} style="width:auto">${av(p)} ${esc(p)}</label>`).join("")}</div>`;
  const checked = name => $$(`input[name=${name}]:checked`).map(x => x.value);
  function formTopic(id) {
    const t = id ? topic(id) : null;
    openModal(`${sheetHead(t ? "Modifica argomento" : "Nuovo argomento", t ? esc(t.title) : "")}<form class="f2" data-hform="topic" data-id="${id || ""}">
      <label>Nome<input id="tp_t" value="${esc(t ? t.title : "")}" required placeholder="Es. Prezzi e pagamenti"></label>
      <label>A che punto siamo <small>(al massimo 2 righe)</small><textarea id="tp_s" rows="2">${esc(t ? t.summary || "" : "")}</textarea></label>
      <div class="lab2">Chi è coinvolto <small>(approva i file dell'argomento)</small>${ppCheck(t ? t.people : [me()])}</div>
      ${t ? `<label>Stato<select id="tp_st">${["attivo", "in pausa", "chiuso"].map(s => `<option ${(t.status || "attivo") === s ? "selected" : ""}>${s}</option>`).join("")}</select></label>` : ""}
      <div class="foot"><button type="button" class="btn" data-close>Annulla</button><button class="btn acc">${t ? "Salva" : "Crea"}</button></div></form>`);
  }
  function formTask(id, tid) {
    const t = id ? S.data.tasks.find(x => x.id === id) : null, pp = t ? tPeople(t) : [me()];
    openModal(`${sheetHead(t ? "Modifica attività" : "Nuova attività", t ? esc(t.title) : esc((topic(tid) || {}).title || ""))}<form class="f2" data-hform="task" data-id="${id || ""}" data-tid="${tid || (t && t.topicId) || ""}">
      <label>Cosa fare <small>(inizia con un verbo)</small><input id="tk_t" value="${esc(t ? t.title : "")}" required></label>
      <div class="lab2">Chi ${ppCheck(pp)}</div>
      <div class="two"><label>Entro<input type="date" id="tk_d" value="${esc(t ? t.due || "" : "")}"></label><label>Argomento<select id="tk_tp"><option value="">— nessuno —</option>${topics().map(x => `<option value="${x.id}" ${x.id === (tid || (t && t.topicId)) ? "selected" : ""}>${esc(x.title)}</option>`).join("")}</select></label></div>
      <details class="dx" ${t && (t.details || (t.steps || []).length || (t.parts || []).some(p => p.text)) ? "open" : ""}><summary>${IC.chev.replace("<svg", '<svg class="chev"')}<span class="m">Dettagli, passi, chi fa quale parte</span></summary><div class="body" style="padding-left:0">
        <label>Cosa intendevamo<textarea id="tk_x" rows="2">${esc(t ? t.details || "" : "")}</textarea></label>
        <label>Passi <small>(uno per riga)</small><textarea id="tk_p" rows="3">${esc(t ? (t.steps || []).map(s => s.text).join("\n") : "")}</textarea></label>
        <label>Parti <small>(se è diviso: una riga per persona, «Nome: cosa»)</small><textarea id="tk_parts" rows="3" placeholder="Nome: prima parte&#10;Nome: seconda parte">${esc(t ? (t.parts || []).filter(p => p.text).map(p => `${p.who}: ${p.text}`).join("\n") : "")}</textarea></label></div></details>
      <div class="foot">${t ? `<button type="button" class="btn danger" data-h="deltask:${t.id}">Elimina</button>` : ""}<button type="button" class="btn" data-close>Annulla</button><button class="btn acc">${t ? "Salva" : "Aggiungi"}</button></div></form>`);
  }
  function formDec(id, tid) {
    const d = id ? S.data.decisions.find(x => x.id === id) : null;
    openModal(`${sheetHead(d ? "Modifica decisione" : "Nuova decisione", esc((topic(tid || (d && (d.topicIds || [])[0])) || {}).title || ""))}<form class="f2" data-hform="dec" data-id="${id || ""}" data-tid="${tid || ""}">
      <label>Cosa abbiamo deciso <small>(una riga)</small><input id="dc_s" value="${esc(d ? d.short || d.title : "")}" required></label>
      <label>Perché<textarea id="dc_w" rows="3">${esc(d ? d.why || "" : "")}</textarea></label>
      <label>Alternative scartate <small>(facoltativo)</small><textarea id="dc_o" rows="2">${esc(d ? d.options || "" : "")}</textarea></label>
      <div class="foot"><button type="button" class="btn" data-close>Annulla</button><button class="btn acc">Salva</button></div></form>`);
  }
  function formGoal(id, tid) {
    const g = id ? S.data.okrs.find(x => x.id === id) : null;
    openModal(`${sheetHead(g ? "Modifica obiettivo" : "Nuovo obiettivo", "")}<form class="f2" data-hform="goal" data-id="${id || ""}" data-tid="${tid || (g && g.topicId) || ""}">
      <label>Obiettivo<input id="gl_t" value="${esc(g ? g.title : "")}" required></label>
      <label>Risultato da raggiungere<textarea id="gl_r" rows="2">${esc(g ? g.result || "" : "")}</textarea></label>
      <label>Checklist <small>(una voce per riga)</small><textarea id="gl_c" rows="4">${esc(g ? (g.checklist || []).map(c => (c.done ? "[x] " : "") + c.text).join("\n") : "")}</textarea></label>
      ${g ? `<label class="row" style="flex-direction:row;gap:8px"><input type="checkbox" id="gl_x" ${g.closed ? "checked" : ""} style="width:auto"> Obiettivo chiuso</label>` : ""}
      <div class="foot"><button type="button" class="btn" data-close>Annulla</button><button class="btn acc">Salva</button></div></form>`);
  }
  function formCall() {
    openModal(`${sheetHead("Prossima call", "")}<form class="f2" data-hform="call"><label>Titolo<input id="cl_t" value="Call settimanale"></label><div class="two"><label>Quando<input type="datetime-local" id="cl_w" required></label><label>Link <small>(Meet, Zoom…)</small><input id="cl_l" placeholder="https://…"></label></div><div class="foot"><button type="button" class="btn" data-close>Annulla</button><button class="btn acc">Salva</button></div></form>`);
  }
  function formProp(id) {
    const i = S.data.ideas.find(x => x.id === id);
    openModal(`${sheetHead("Modifica proposta", "")}<form class="f2" data-hform="eprop" data-id="${id}"><label>Titolo<input id="ep_t" value="${esc(i.title)}" required></label><label>Spiegazione<textarea id="ep_b" rows="6">${esc(i.body || "")}</textarea></label><div class="foot"><button type="button" class="btn" data-close>Annulla</button><button class="btn acc">Salva</button></div></form>`);
  }
  function formFile(id) {
    const f = S.data.docs.find(d => d.id === id);
    openModal(`${sheetHead("Modifica file", "")}<form class="f2" data-hform="efile" data-id="${id}"><label>Nome<input id="ef_t" value="${esc(f.title || "")}" required></label><label>A cosa si riferisce<input id="ef_d" value="${esc(f.desc || "")}"></label><label>Argomento<select id="ef_tp"><option value="">— nessuno —</option>${topics().map(t => `<option value="${t.id}" ${t.id === f.topicId ? "selected" : ""}>${esc(t.title)}</option>`).join("")}</select></label><div class="foot"><button type="button" class="btn" data-close>Annulla</button><button class="btn acc">Salva</button></div></form>`);
  }
  function addMenu(tid) {
    openModal(`${sheetHead("Aggiungi a", esc((topic(tid) || {}).title || ""))}<div class="opts">${[["task", "Attività", "chi fa cosa"], ["dec", "Decisione", "con il perché"], ["goal", "Obiettivo", "con checklist"], ["open", "Cosa aperta", "da chiarire"], ["upload", "File", "con stato"]].map(([k, b, s]) => `<button type="button" class="opt" data-h="${k === "upload" ? "upload:" + tid : "add:" + k + ":" + tid}"><b>${b}</b><span>${s}</span></button>`).join("")}</div>`);
  }

  /* ================= azioni ================= */
  async function act(a, el) {
    const [k, x, y, z] = String(a).split(":");
    if (k === "topic") { closeModal(); if (x && x !== "undefined") go("argomento/" + x); return; }
    if (k === "prop") { openProp(x); return; }
    if (k === "file") { closeModal(); H.ff = { q: "", t: "", s: "" }; go("file"); setTimeout(() => { const f = S.data.docs.find(d => d.id === x); if (f) { H.ff.q = f.title; render(); setTimeout(() => { const d = $("#main details.dx"); if (d) d.open = true; }, 60); } }, 30); return; }
    if (k === "nav") { closeModal(); go(x); return; }
    if (k === "of") { HQ_FILES.open(a.slice(3)); return; }
    if (k === "task" || k === "etask") { closeModal(); const t = S.data.tasks.find(q => q.id === x); if (k === "task" && t && t.topicId) { go("argomento/" + t.topicId); return; } formTask(x); return; }
    if (k === "goal") { const g = S.data.okrs.find(q => q.id === x); if (g && g.topicId) go("argomento/" + g.topicId); else go("goals"); return; }
    if (k === "tools") { H.tools = !H.tools; try { localStorage.setItem("hq2_tools", H.tools ? "1" : "0"); } catch (e) {} renderSide(); return; }
    if (k === "search") { openSearch(); return; }
    if (k === "newprop") { closeModal(); newProp(); return; }
    if (k === "newtopic") { formTopic(); return; }
    if (k === "etopic") { formTopic(x); return; }
    if (k === "tf") { H.tf = x; render(); return; }
    if (k === "pf") { H.pf = x; render(); return; }
    if (k === "tile") { H.tile = H.tile === x ? "" : x; render(); return; }
    if (k === "seen") { markSeen(); loadSeen(); H.tile = ""; render(); toast("Segnato come visto"); return; }
    if (k === "addmenu") { addMenu(x); return; }
    if (k === "add") { closeModal(); if (x === "task") formTask(null, y); else if (x === "dec") formDec(null, y); else if (x === "goal") formGoal(null, y); else if (x === "open") openModal(`${sheetHead("Cosa resta aperto", esc((topic(y) || {}).title || ""))}<form class="f2" data-hform="open" data-tid="${y}"><label>Domanda o punto da chiarire<input id="op_t" required></label><div class="foot"><button type="button" class="btn" data-close>Annulla</button><button class="btn acc">Aggiungi</button></div></form>`); return; }
    if (k === "edec") { formDec(x); return; }
    if (k === "egoal") { formGoal(x); return; }
    if (k === "eprop") { formProp(x); return; }
    if (k === "efile") { formFile(x); return; }
    if (k === "upload") { closeModal(); openUpload(x || (S.view === "argomento" ? S.topicOpen : "")); return; }
    if (k === "newver") { openUpload("", x); return; }
    if (k === "approve") { await approve(x); return; }
    if (k === "toappr") { await upd("docs", x, { stato: "da approvare" }); toast("Mandato in approvazione"); return; }
    if (k === "tick") { const t = S.data.tasks.find(q => q.id === x); if (!t) return; if (y) { const parts = (t.parts || []).map(p => first(p.who) === y ? { ...p, done: !p.done } : p); await upd("tasks", x, { parts, ...(parts.every(p => p.done) ? { status: "Fatto", doneAt: localISO() } : { status: "Da fare" }) }); } else { const f = !tDone(t); await upd("tasks", x, { status: f ? "Fatto" : "Da fare", doneAt: f ? localISO() : "" }); } return; }
    if (k === "part") { const t = S.data.tasks.find(q => q.id === x), parts = (t.parts || []).map((p, i) => i === +y ? { ...p, done: !p.done } : p); await upd("tasks", x, { parts, status: parts.every(p => p.done) ? "Fatto" : "Da fare" }); return; }
    if (k === "step") { const t = S.data.tasks.find(q => q.id === x); await upd("tasks", x, { steps: (t.steps || []).map((s, i) => i === +y ? { ...s, done: !s.done } : s) }); return; }
    if (k === "gck") { const g = S.data.okrs.find(q => q.id === x); await upd("okrs", x, { checklist: (g.checklist || []).map((s, i) => i === +y ? { ...s, done: !s.done } : s) }); return; }
    if (k === "open") { const t = topic(x); await upd("topics", x, { open: (t.open || []).map((o, i) => i === +y ? { ...o, done: !o.done } : o) }); return; }
    if (k === "closeprop") { closeProp(x); return; }
    if (k === "cpk") { cpMore(x); return; }
    if (k === "reopen") { await upd("ideas", x, { fase: "da discutere", esito: null, pausa: null }); openProp(x); return; }
    if (k === "dupt") { const t = topic(x), txt = $("#np_t").value.trim(); if (!txt) return; await upd("topics", x, { open: [...(t.open || []), { id: Date.now().toString(36), text: txt, done: false, by: S.uid, at: nowISO() }] }); closeModal(); toast("Aggiunta all'argomento"); go("argomento/" + x); return; }
    if (k === "dupi") { const i = S.data.ideas.find(q => q.id === x), txt = [$("#np_t").value.trim(), ($("#np_b") || {}).value || ""].filter(Boolean).join("\n"); if (!txt) return; await guard(() => S.db.collection("ideas").doc(x).update({ comments: [...(i.comments || []), { by: S.uid || "", at: nowISO(), text: txt }] })); toast("Aggiunta come commento"); openProp(x); return; }
    if (k === "rev") { await upd(x, y, { review: { esito: z, at: nowISO(), by: S.uid }, ...(z === "Chiuso" ? (x === "tasks" ? { status: "Fatto", doneAt: localISO() } : { closed: true }) : {}) }); return; }
    if (k === "import") { closeModal(); openImport(); return; }
    if (k === "copyprompt") { const tr = $("#im_tr").value.trim(); try { await navigator.clipboard.writeText(prompt(tr, [$("#im_t").value, $("#im_d").value].filter(Boolean).join(", "))); toast("Copiata: incollala in Claude o ChatGPT"); } catch (e) { toast("Copia non riuscita"); } return; }
    if (k === "copyag") { try { await navigator.clipboard.writeText("Ordine del giorno\n" + agenda().map(([, t, m], i) => `${i + 1}. ${t} (${m})`).join("\n")); toast("Copiato"); } catch (e) {} return; }
    if (k === "bzok") { el.disabled = true; try { await bzConfirm(x); } catch (e) { el.disabled = false; } return; }
    if (k === "bzno") { await upd("bozze", x, { state: "scartata" }); return; }
    if (k === "bzall") { el.disabled = true; await bzAll(); return; }
    if (k === "newcall") { formCall(); return; }
    if (k === "tr") { const m = S.data.meetings.find(q => q.id === x), t = await getBlob(m.transcriptBlob); downloadText(`Trascrizione_${(m.title || "call").replace(/\W+/g, "_")}.txt`, t, "text/plain"); return; }
    if (k === "deltask") { if (!el.classList.contains("armed")) { el.classList.add("armed"); el.textContent = "Conferma"; return; } await guard(() => S.db.collection("tasks").doc(x).delete()); closeModal(); toast("Eliminata"); return; }
    if (k === "classico") { location.href = "classico/"; return; }
    if (k === "mic") { dictate(x, el); return; }
  }
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-h]"); if (!el) { const q = e.target.closest("[data-qk]"); if (q) pickSearch(+q.dataset.qk); return; }
    if (el.tagName === "SUMMARY" || el.closest("summary")) { if (e.target.closest(".ck, button")) e.preventDefault(); }
    e.preventDefault(); e.stopPropagation(); act(el.dataset.h, el);
  }, true);
  document.addEventListener("change", async e => { if (e.target.id === "im_file" && e.target.files[0]) { $("#im_js").value = await e.target.files[0].text(); toast("File letto: ora premi «Crea le bozze»"); return; } const s = e.target.dataset && e.target.dataset.h2sel; if (s) { H.ff[s] = e.target.value; render(); } });
  document.addEventListener("input", e => { if (e.target.id === "ff_q") { H.ff.q = e.target.value; clearTimeout(H.fft); H.fft = setTimeout(render, 160); } if (e.target.id === "qs_in") { H.qsel = 0; drawSearch(); } });
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); return; }
    const ov = $(".qov"); if (!ov) return;
    if (e.key === "Escape") { ov.remove(); e.stopPropagation(); }
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); H.qsel = Math.max(0, Math.min((H.qres || []).length - 1, (H.qsel || 0) + (e.key === "ArrowDown" ? 1 : -1))); drawSearch(); }
    else if (e.key === "Enter") { e.preventDefault(); pickSearch(H.qsel || 0); }
  }, true);
  document.addEventListener("submit", async e => {
    const f = e.target, k = f.dataset && f.dataset.hform; if (!k) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const v = id => (($("#" + id) || {}).value || "").trim(), id = f.dataset.id, tid = f.dataset.tid;
    try {
      if (k === "prop") { const t = v("np_t"); if (!t) return; const nid = await put("ideas", { title: t, body: v("np_b"), fase: "da discutere", status: "Nuova", comments: [], votes: {} }); closeModal(); toast("Proposta aggiunta"); if (S.view === "proposte") render(); else openProp(nid); }
      else if (k === "closeprop") await closePropGo();
      else if (k === "topic") { const d = { title: v("tp_t"), summary: v("tp_s"), people: checked("pp") }; if (id) await upd("topics", id, { ...d, status: v("tp_st") || "attivo" }); else { const nid = await put("topics", { ...d, status: "attivo", open: [] }); closeModal(); go("argomento/" + nid); return; } closeModal(); }
      else if (k === "task") { const who = checked("pp"), lines = v("tk_parts").split("\n").map(s => s.trim()).filter(Boolean); let parts = lines.map(l => { const m = l.split(/:\s*/); return { who: m[0].trim(), text: m.slice(1).join(": ").trim(), done: false }; }); if (!parts.length && who.length > 1) parts = who.map(w => ({ who: w, text: "", done: false })); const old = id ? S.data.tasks.find(x => x.id === id) : null; if (old && (old.parts || []).length) parts = parts.map(p => ({ ...p, done: !!((old.parts || []).find(o => first(o.who) === first(p.who)) || {}).done })); const d = { title: v("tk_t"), owner: parts.length ? "" : who[0] || "", parts, due: v("tk_d"), topicId: v("tk_tp"), details: v("tk_x"), steps: v("tk_p").split("\n").map(s => s.trim()).filter(Boolean).map((s, i) => ({ text: s, done: !!(((old || {}).steps || [])[i] || {}).done })) }; if (id) await upd("tasks", id, d); else await put("tasks", { ...d, status: "Da fare", priority: "Media" }); if (d.topicId) await upd("topics", d.topicId, {}); closeModal(); toast("Salvata"); }
      else if (k === "dec") { const d = { title: v("dc_s"), short: v("dc_s"), why: v("dc_w"), options: v("dc_o") }; if (id) await upd("decisions", id, d); else { await put("decisions", { ...d, topicIds: [tid], date: localISO(), status: "Presa" }); await upd("topics", tid, {}); } closeModal(); toast("Salvata"); }
      else if (k === "goal") { const d = { title: v("gl_t"), result: v("gl_r"), checklist: v("gl_c").split("\n").map(s => s.trim()).filter(Boolean).map(s => ({ done: /^\[x\]\s*/i.test(s), text: s.replace(/^\[x\]\s*/i, "") })), closed: !!($("#gl_x") || {}).checked, topicId: tid }; if (id) await upd("okrs", id, d); else await put("okrs", { ...d, quarter: curQ(), krs: [] }); closeModal(); toast("Salvato"); }
      else if (k === "open") { const t = topic(tid); await upd("topics", tid, { open: [...(t.open || []), { id: Date.now().toString(36), text: v("op_t"), done: false, by: S.uid, at: nowISO() }] }); closeModal(); }
      else if (k === "call") { await put("meetings", { title: v("cl_t") || "Call", when: v("cl_w"), link: v("cl_l") ? safeUrl(v("cl_l")) : "", kind: "Settimanale founder", agenda: "" }); closeModal(); toast("Call in calendario"); }
      else if (k === "import") { const ok = await importJSON($("#im_js").value, { t: v("im_t"), d: v("im_d"), tr: $("#im_tr").value.trim() }); if (ok) { closeModal(); go("call"); } }
      else if (k === "upload") await doUpload(f);
      else if (k === "eprop") { await upd("ideas", id, { title: v("ep_t"), body: v("ep_b") }); openProp(id); }
      else if (k === "efile") { const tp = v("ef_tp"); await upd("docs", id, { title: v("ef_t"), desc: v("ef_d"), topicId: tp, topicIds: tp ? [tp] : [] }); closeModal(); }
    } catch (er) {}
  }, true);

  /* dettatura (telefono): riconoscimento vocale del browser, se c'è */
  H.sr = window.SpeechRecognition || window.webkitSpeechRecognition;
  function dictate(target, btn) {
    if (!H.sr) return; if (H.rec) { H.rec.stop(); return; }
    const r = new H.sr(); r.lang = "it-IT"; r.interimResults = true; const el = $("#" + target), base = el.value ? el.value + " " : "";
    r.onresult = ev => { el.value = base + Array.from(ev.results).map(x => x[0].transcript).join(""); el.dispatchEvent(new Event("input", { bubbles: true })); };
    r.onend = () => { H.rec = null; btn.classList.remove("rec"); }; r.onerror = () => toast("Non riesco a sentire: controlla il permesso del microfono.");
    H.rec = r; btn.classList.add("rec"); r.start();
  }

  /* ================= strumenti: barra in alto anche lì ================= */
  ["goals", "web", "finance", "partners", "team", "accounts", "esami", "mat", "lab", "aictx", ...OLD.filter(x => !["okrs", "metrics"].includes(x))].forEach(k => { const f = V[k]; if (f) V[k] = () => `<div class="w2" style="margin-bottom:-4px">${topbar()}</div>` + f(); });

  /* ================= navigazione ================= */
  const _go = window.go;
  window.go = function (v) {
    v = String(v || "oggi");
    if (v.startsWith("argomento/")) { S.topicOpen = v.slice(10); _go("argomento"); try { history.replaceState(null, "", "#argomento/" + S.topicOpen); } catch (e) {} return; }
    _go(v);
  };
  window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (h.startsWith("argomento/") && h.slice(10) !== S.topicOpen) go(h); });

  /* ================= avvio ================= */
  const hash = location.hash.slice(1);
  try { if (hash.startsWith("argomento/")) { S.topicOpen = hash.slice(10); localStorage.setItem("ulhq_view", "argomento"); } else if (!hash) localStorage.setItem("ulhq_view", "oggi"); } catch (e) {}
  const _enter = window.enter;
  window.enter = function (name) { _enter(name); loadSeen(); };
  const demo = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && /[?&]demo\b/.test(location.search);
  if (!demo) { boot(); return; }
  /* anteprima locale: niente login né Supabase, dati da _private/demo_data.js, solo in memoria */
  window.loadAll = async () => { const D = window.HQ_DEMO || {}; Object.keys(D).forEach(c => { LOCAL[c] = new Map(D[c].map(d => { const { id, ...r } = d; return [id, r]; })); }); COLS.forEach(c => { if (!LOCAL[c]) LOCAL[c] = new Map(); notify(c); }); };
  window.authed = async () => {};
  window.startRealtime = () => {};
  HQ_FILES.upload = async file => ({ path: "demo/" + file.name, name: file.name, size: file.size, type: file.type || "" });
  HQ_FILES.open = () => toast("Anteprima: i file non si aprono in modalità prova");
  HQ_FILES.remove = async () => {};
  const sc = document.createElement("script"); sc.src = "_private/demo_data.js?" + Date.now();
  if (/[?&]mig=1/.test(location.search)) { const iv = setInterval(async () => { if (!S.ready) return; clearInterval(iv); const j = await fetch("_private/migrazione_bozze.json").then(r => r.text()); await importJSON(j); await bzAll(); const u = new URLSearchParams(location.search), tt = u.get("t"), vv = u.get("v"), pp = u.get("p"); if (tt) { const x = S.data.topics.find(t => norm(t.title).includes(norm(tt))); if (x) go("argomento/" + x.id); } else if (vv) go(vv); if (pp) { const i = S.data.ideas.find(x => norm(x.title).includes(norm(pp))); if (i) openProp(i.id); } if (u.get("x") === "close" && pp) { const i = S.data.ideas.find(x => norm(x.title).includes(norm(pp))); closeProp(i.id); cpMore("pausa"); } if (u.get("x") === "search") { openSearch(); $("#qs_in").value = u.get("q") || ""; drawSearch(); } if (u.get("x") === "new") { newProp(); $("#np_t").value = u.get("q") || ""; $("#np_t").dispatchEvent(new Event("input", { bubbles: true })); } if (u.get("x") === "import") openImport(); render(); }, 200); }
  sc.onload = sc.onerror = () => { S.view = V[S.view] ? S.view : "oggi"; try { S.view = localStorage.getItem("ulhq_view") || "oggi"; } catch (e) {} render(); enter(new URLSearchParams(location.search).get("nome") || "Prova"); };
  document.head.appendChild(sc);
})();
