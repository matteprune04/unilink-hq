/* ================= versione online: accesso con password unica + database Supabase ================= */
const SB = supabase.createClient(HQ_CONFIG.supabaseUrl, HQ_CONFIG.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true } });
const LOCAL = {};            // collezione -> Map(id -> data)
const LISTEN = {};           // collezione -> [callback]
let loadAllP = null;
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
const wrapErr = e => ({ code: /JWT|auth|permission|policy|42501/i.test((e && (e.message || e.code)) || "") ? "invalid_argument" : "unavailable", message: (e && e.message) || "errore" });
const isPlain = v => v && typeof v === "object" && !Array.isArray(v);
function deepMerge(a, b) { const o = { ...(a || {}) }; for (const k in b) o[k] = isPlain(b[k]) && isPlain(o[k]) ? deepMerge(o[k], b[k]) : b[k]; return o; }
function snapOf(col) { return { docs: [...(LOCAL[col] || new Map()).entries()].map(([id, data]) => ({ id, exists: true, data: () => data })) }; }
function notify(col) { (LISTEN[col] || []).forEach(fn => { try { fn(snapOf(col)); } catch (e) { console.error(e); } }); }
function applyLocal(col, id, data) { const m = LOCAL[col] || (LOCAL[col] = new Map()); if (data == null) m.delete(id); else m.set(id, data); notify(col); }

async function loadAll() {
  const fresh = {}; let from = 0;
  for (;;) {
    const { data, error } = await SB.from("docs").select("col,id,data").range(from, from + 999);
    if (error) throw wrapErr(error);
    data.forEach(r => (fresh[r.col] || (fresh[r.col] = new Map())).set(r.id, r.data));
    if (data.length < 1000) break; from += 1000;
  }
  const cols = new Set([...Object.keys(LOCAL), ...Object.keys(fresh)]);
  cols.forEach(c => { LOCAL[c] = fresh[c] || new Map(); notify(c); });
}
const sessErr = () => ({ code: "session_expired", message: "Sessione scaduta" });
/* prima di scrivere: rinnova la sessione se serve e, se il database rifiuta, riprova una volta con una sessione nuova */
async function renew() {
  const { data } = await SB.auth.getSession();
  if (data && data.session) return "ok";
  const r = await SB.auth.refreshSession();
  if (r.data && r.data.session) return "ok";
  return r.error && /fetch|network|timeout|load failed/i.test(r.error.message || "") ? "offline" : "expired";
}
async function authed(fn) {
  const st = await renew();
  if (st === "offline") throw { code: "unavailable", message: "offline" };
  if (st === "expired") throw sessErr();
  try { return await fn(); }
  catch (e) {
    if (!e || e.code !== "invalid_argument") throw e;
    const r = await SB.auth.refreshSession();
    if (!r.data || !r.data.session) throw sessErr();
    try { return await fn(); } catch (e2) { throw e2 && e2.code === "invalid_argument" ? sessErr() : e2; }
  }
}
const DB = {
  collection(col) {
    return {
      onSnapshot(next, err) {
        (LISTEN[col] || (LISTEN[col] = [])).push(next);
        (loadAllP || (loadAllP = loadAll())).then(() => next(snapOf(col))).catch(e => err && err(e));
        return () => {};
      },
      doc(id) { return DB.doc(col + "/" + (id || newId())); },
    };
  },
  doc(path) {
    const [col, id] = path.split("/");
    const isImg = col === "images";
    return {
      id,
      async get() {
        const q = isImg ? SB.from("images").select("data").eq("id", id) : SB.from("docs").select("data").eq("col", col).eq("id", id);
        const { data, error } = await q.maybeSingle(); if (error) throw wrapErr(error);
        const body = data ? (isImg ? { data: data.data } : data.data) : undefined;
        return { exists: !!data, data: () => body };
      },
      async set(d) {
        await authed(async () => {
          const { error } = isImg ? await SB.from("images").upsert({ id, data: d.data, by: d.by || "" })
            : await SB.from("docs").upsert({ col, id, data: d, updated_at: new Date().toISOString() });
          if (error) throw wrapErr(error);
        });
        if (!isImg) applyLocal(col, id, d);
      },
      async update(p) {
        const cur = (LOCAL[col] && LOCAL[col].get(id)) || (await this.get()).data();
        if (!cur) throw { code: "invalid_argument", message: "l'elemento non esiste più" };
        await this.set(deepMerge(cur, p));
      },
      async delete() {
        await authed(async () => {
          const { error } = isImg ? await SB.from("images").delete().eq("id", id) : await SB.from("docs").delete().eq("col", col).eq("id", id);
          if (error) throw wrapErr(error);
        });
        if (!isImg) applyLocal(col, id, null);
      },
    };
  },
};
let rtStarted = false;
function startRealtime() {
  if (rtStarted) return; rtStarted = true;
  SB.channel("hq-docs").on("postgres_changes", { event: "*", schema: "public", table: "docs" }, p => {
    if (p.eventType === "DELETE") { if (p.old && p.old.col) applyLocal(p.old.col, p.old.id, null); }
    else if (p.new && p.new.col) applyLocal(p.new.col, p.new.id, p.new.data);
  }).subscribe();
  // al ritorno sulla scheda ricarica tutto: recupera eventuali modifiche perse mentre il telefono dormiva
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && S.ready) loadAll().catch(() => {}); });
}

/* ---------- allegati: Supabase Storage (bucket privato "hq-files") ---------- */
window.HQ_FILES = {
  max: 25 * 1024 * 1024,
  async upload(file, folder) {
    const safe = file.name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9._-]+/g, "_").slice(-80);
    const path = `${folder}/${newId()}-${safe}`;
    const { error } = await SB.storage.from("hq-files").upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
    if (error) {
      const m = error.message || "";
      let msg = "Non sono riuscito a caricare il file. Riprova.";
      if (/bucket/i.test(m)) msg = "Per allegare file manca un'impostazione del database: esegui il file supabase/files.sql (vedi istruzioni).";
      else if (/size|exceed|too large/i.test(m)) msg = `“${file.name}” è troppo grande (massimo 25 MB).`;
      else if (/jwt|auth|expired/i.test(m)) msg = "Sessione scaduta: ricarica la pagina e rientra con la password.";
      throw { code: "file_error", message: msg };
    }
    return { path, name: file.name, size: file.size, type: file.type || "" };
  },
  async remove(paths) { if (paths && paths.length) await SB.storage.from("hq-files").remove(paths); },
  async open(path) {
    const w = window.open("", "_blank");
    const { data, error } = await SB.storage.from("hq-files").createSignedUrl(path, 600);
    if (error || !data) { if (w) w.close(); toast("Non riesco ad aprire il file."); return; }
    if (w) w.location = data.signedUrl; else location.href = data.signedUrl;
  },
};

/* ---------- schermata di accesso ---------- */
function showLogin(msg) {
  const box = document.getElementById("login");
  let name = ""; try { name = localStorage.getItem("ulhq_name") || ""; } catch (e) {}
  box.innerHTML = `<form class="login-card" id="loginForm" novalidate>
    <img src="logo-white.png" alt="UniLink" class="login-logo">
    <div class="stack" style="gap:6px"><span class="eyebrow">Area riservata ai founder</span><h1>UniLink HQ</h1></div>
    <label class="fld"><span>Il tuo nome</span><input id="lg_name" autocomplete="nickname" value="${esc(name)}" placeholder="Es. Matteo" list="lg_names"><datalist id="lg_names">${(HQ_CONFIG.founders || []).map(n => `<option value="${esc(n)}">`).join("")}</datalist><small>Serve solo a firmare idee, voti e commenti.</small></label>
    <label class="fld"><span>Password del team</span><input id="lg_pass" type="password" autocomplete="current-password"></label>
    ${msg ? `<div class="banner warn">${esc(msg)}</div>` : ""}
    <button class="btn acc" style="justify-content:center">Entra</button>
    <p class="small" style="opacity:.75">Una volta entrato, questo dispositivo resta collegato finché non premi “Esci”.</p></form>`;
  box.hidden = false;
  setTimeout(() => (name ? $("#lg_pass") : $("#lg_name")).focus(), 30);
}
document.addEventListener("submit", async e => {
  if (e.target.id !== "loginForm") return;
  e.preventDefault(); e.stopImmediatePropagation();
  const name = $("#lg_name").value.trim(), pass = $("#lg_pass").value;
  if (!name) { showLogin("Scrivi il tuo nome."); return; }
  if (!pass) { showLogin("Scrivi la password."); return; }
  const btn = $("#loginForm button"); btn.disabled = true; btn.textContent = "Accesso…";
  const { error } = await SB.auth.signInWithPassword({ email: HQ_CONFIG.teamEmail, password: pass });
  if (error) { showLogin(/invalid/i.test(error.message) ? "Password sbagliata." : "Accesso non riuscito: controlla la connessione e riprova."); return; }
  try { localStorage.setItem("ulhq_name", name); } catch (er) {}
  $("#login").hidden = true; if (S.ready) toast("Accesso rinnovato: riprova a salvare."); else enter(name);
}, true);
async function logout() { await SB.auth.signOut(); location.reload(); }

/* ================= avvio ================= */
function enter(name) {
  S.uid = name; S.canWrite = true; S.db = DB;
  COLS.forEach(c => {
    S.db.collection(c).onSnapshot(snap => {
      S.data[c] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      S.loaded.add(c); if (S.loaded.size === COLS.length) S.ready = true;
      if (S.ready) { render(); refreshOpen(c); }
    }, err => { if (err && err.code === "invalid_argument") { SB.auth.signOut(); showLogin("Sessione scaduta: rientra con la password."); } S.loaded.add(c); if (S.loaded.size === COLS.length) { S.ready = true; render(); } });
  });
  startRealtime();
}
async function boot() {
  let v = (location.hash || "").slice(1); if (!V[v]) { try { v = localStorage.getItem("ulhq_view") || "home"; } catch (e) { v = "home"; } }
  S.view = V[v] ? v : "home"; render();
  const { data } = await SB.auth.getSession();
  let name = ""; try { name = localStorage.getItem("ulhq_name") || ""; } catch (e) {}
  if (data && data.session && name) enter(name); else showLogin();
}

/* ================= Laboratorio AI → DEMO (landing + web app) =================
   Le demo vivono nel repository (demo-landing/, demo-webapp/) e si aggiornano con un push.
   La GitHub Action "Backup demo" crea a ogni modifica uno ZIP (Release GitHub) e una riga in
   demos/registro.json: qui si legge il registro e si mostrano anteprima, download e storico.
   Nessun caricamento a mano. Questo blocco sta in _src/online.js, quindi sopravvive alle build. */
const DEMO_REG = ["https://raw.githubusercontent.com/matteprune04/unilink-hq/main/demos/registro.json", "demos/registro.json"];
const DEMO_BASE = [
  { id: "landing", titolo: "Landing", cartella: "demo-landing", descrizione: "Landing v2: Prima · Durante · Dopo, strumenti, anteprima area personale, Da decidere (riferimento per Framer).", url: "demo-landing/", versioni: [] },
  { id: "webapp", titolo: "Web app · area personale", cartella: "demo-webapp", descrizione: "Web app v2: sezioni decise, strumenti per hub, tablet, sezione «Da decidere».", url: "demo-webapp/", versioni: [] },
];
const DM = { reg: null, err: "", busy: false, open: "", dev: "desk" };
// Anteprima tablet (820 px): lo stile del telefono è nel sorgente dell'HQ, questo si aggiunge da qui
document.head.insertAdjacentHTML("beforeend", "<style>.fr-b.tab iframe { width: 820px; max-width: 100%; border-left: 1px solid var(--line); border-right: 1px solid var(--line); }</style>");
async function demoLoad(force) {
  if (DM.busy || (DM.reg && !force)) return;
  DM.busy = true; DM.err = "";
  for (const u of DEMO_REG) {
    try { const r = await fetch(u + "?t=" + Date.now(), { cache: "no-store" }); if (r.ok) { DM.reg = await r.json(); break; } } catch (e) {}
  }
  if (!DM.reg) DM.err = "Registro non ancora disponibile: si crea al primo backup automatico.";
  DM.busy = false; if (S.view === "lab") render();
}
const demoList = () => DEMO_BASE.map(b => ({ ...b, ...((DM.reg && DM.reg.demo || []).find(x => x.id === b.id) || {}) }));
const demoDate = s => s ? new Date(s).toLocaleString("it-IT", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
function demoSection() {
  demoLoad();
  const card = d => { const v = (d.versioni || [])[0];
    return `<article class="card click labcard" data-demoopen="${d.id}" style="--tc:#cf7527;--ts:#f6e4d1">
      <div class="row">${chip("Demo live", "or")}${v ? `<span class="vbadge">v${v.n}</span><span class="muted small">${(d.versioni || []).length} ${(d.versioni || []).length === 1 ? "versione" : "versioni"}</span>` : ""}</div>
      <h3>${esc(d.titolo)}</h3><div class="excerpt">${esc(d.descrizione)}</div>
      <div class="small muted">${v ? `Ultima: ${esc(demoDate(v.data))} · ${esc(v.autore)} · «${esc(v.nota)}»` : "Storico in preparazione"}</div>
      <div class="row">${v ? `<a class="btn sm pri" href="${esc(v.download)}" data-stop>Scarica v${v.n}</a>` : ""}<a class="btn sm" href="${esc(d.url)}" target="_blank" rel="noopener" data-stop>Apri in una scheda</a></div></article>`; };
  return `<section class="stack" id="demo-sez"><div class="gh" style="--tc:#cf7527;--ts:#f6e4d1"><h2>DEMO</h2><span class="num muted">sempre all'ultima versione · backup automatico</span></div>
    <div class="grid">${demoList().map(card).join("")}</div>${DM.err ? `<p class="small muted">${esc(DM.err)}</p>` : ""}</section>`;
}
function demoDetail(d) {
  demoLoad();
  const vs = d.versioni || [], v = vs[0];
  return `<div class="wrap">
    <div class="row between"><button class="btn sm" data-demoback>← Laboratorio AI</button><div class="row"><div class="seg">${[["desk", "Desktop"], ["tab", "Tablet"], ["mob", "Telefono"]].map(([m, l]) => `<button class="${DM.dev === m ? "on" : ""}" data-demodev="${m}">${l}</button>`).join("")}</div><a class="btn sm" href="${esc(d.url)}" target="_blank" rel="noopener">Schermo intero</a></div></div>
    ${head("Laboratorio AI · DEMO", esc(d.titolo), esc(d.descrizione) + (d.architettura ? ` Architettura: <b>${esc(d.architettura)}</b>.` : ""), v ? `<a class="btn pri" href="${esc(v.download)}">Scarica l'ultima versione (v${v.n})</a>` : "")}
    <div class="fr"><div class="fr-h"><b>${v ? "v" + v.n : "Dal vivo"}</b>${chip("attuale", "gr")}<span class="small muted">${esc(d.url)}</span></div><div class="fr-b ${DM.dev === "mob" ? "mob" : DM.dev === "tab" ? "tab" : ""}"><iframe class="demo full" src="${esc(d.cartella)}/" title="${esc(d.titolo)}"></iframe></div></div>
    <section class="card panel"><div class="panel-h"><h2>Storico delle versioni</h2><span class="small muted">ogni versione è un backup scaricabile</span></div>
      ${vs.length ? vs.map((x, i) => `<div class="li"><div class="grow"><div class="t">v${x.n} ${i === 0 ? chip("attuale", "gr") : ""} <span class="small muted">· ${esc(demoDate(x.data))} · ${esc(x.autore)}</span></div><div class="small muted">${esc(x.nota)} · ${nf(x.kb)} KB · commit ${esc(x.commit || "")}</div></div><div class="row"><a class="btn sm" href="${esc(x.download)}">Scarica ZIP</a><a class="btn sm ghost" href="${esc(x.sorgente)}" target="_blank" rel="noopener">File su GitHub</a></div></div>`).join("")
        : `<p class="muted small">Il primo backup compare qui pochi minuti dopo la prima pubblicazione.</p>`}
      <p class="small muted" style="margin-top:10px">Per tornare a una versione: scarica lo ZIP, oppure chiedi a Claude «ripristina ${esc(d.id)} alla v…» (usa il tag <code>${esc(d.id)}-vN</code> su GitHub).</p></section>
  </div>`;
}
const _labView = V.lab;
V.lab = () => {
  if (DM.open) { const d = demoList().find(x => x.id === DM.open); if (d) return demoDetail(d); }
  const html = _labView();
  if (S.labOpen) return html;
  const i = html.indexOf("</header>");
  return i < 0 ? html : html.slice(0, i + 9) + demoSection() + html.slice(i + 9);
};
document.addEventListener("click", e => {
  if (e.target.closest("[data-stop]")) return;
  const o = e.target.closest("[data-demoopen]"); if (o) { DM.open = o.dataset.demoopen; S.labOpen = null; window.scrollTo(0, 0); render(); return; }
  if (e.target.closest("[data-demoback]") || (DM.open && e.target.closest('[data-nav="lab"]'))) { DM.open = ""; render(); return; }
  const dv = e.target.closest("[data-demodev]"); if (dv) { DM.dev = dv.dataset.demodev; render(); }
});
