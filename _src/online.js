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
        const { error } = isImg ? await SB.from("images").upsert({ id, data: d.data, by: d.by || "" })
          : await SB.from("docs").upsert({ col, id, data: d, updated_at: new Date().toISOString() });
        if (error) throw wrapErr(error);
        if (!isImg) applyLocal(col, id, d);
      },
      async update(p) {
        const cur = (LOCAL[col] && LOCAL[col].get(id)) || (await this.get()).data();
        if (!cur) throw { code: "invalid_argument", message: "l'elemento non esiste più" };
        await this.set(deepMerge(cur, p));
      },
      async delete() {
        const { error } = isImg ? await SB.from("images").delete().eq("id", id) : await SB.from("docs").delete().eq("col", col).eq("id", id);
        if (error) throw wrapErr(error);
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
  $("#login").hidden = true; enter(name);
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
