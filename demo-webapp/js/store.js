/* ../../02_AreaPersonale/assets/js/store.js */
/* ============================================================
   Store — "backend" simulato nel browser (localStorage).
   In produzione questo file va sostituito con chiamate a un vero
   backend (es. Supabase / Firebase / API propria): le funzioni
   esposte in UL.store sono già pensate come endpoint.
   ============================================================ */
(function () {
  const UL = (window.UL = window.UL || {});
  // Le varianti della web app (03_Varianti_WebApp) definiscono UL.CONFIG prima di questo file
  // per usare un database separato e campi aggiuntivi.
  const CFG = UL.CONFIG || {};
  const DB_KEY = CFG.dbKey || "ul_area_db_v1";
  const SES_KEY = CFG.sessionKey || "ul_area_session_v1";
  const SESSION_HOURS = 8;

  /* ---------- utilità ---------- */
  const uid = () => "u" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
  const now = () => new Date().toISOString();
  const clone = (o) => JSON.parse(JSON.stringify(o));

  // Se il browser vieta la memoria locale (es. demo dentro un iframe "sandbox", navigazione privata)
  // si usa una memoria temporanea: l'app funziona, i dati si azzerano ricaricando la pagina.
  function memStorage() {
    const m = new Map();
    return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
  }
  function storageOf(kind) {
    try {
      const st = window[kind + "Storage"];
      st.setItem("__ul_test", "1");
      st.removeItem("__ul_test");
      return st;
    } catch (e) { UL.persistent = false; return memStorage(); }
  }
  UL.persistent = true;
  const LOCAL = storageOf("local");
  const SESSION = storageOf("session");

  function safeGet(storage, key) {
    try { return storage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(storage, key, val) {
    try { storage.setItem(key, val); return true; } catch (e) { return false; }
  }
  function safeDel(storage, key) {
    try { storage.removeItem(key); } catch (e) { /* noop */ }
  }

  async function hashPassword(pw, salt) {
    const data = new TextEncoder().encode(salt + "::" + pw);
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    // fallback (contesti non sicuri): FNV-1a — sufficiente per una bozza locale
    let h = 2166136261;
    for (const b of data) { h ^= b; h = Math.imul(h, 16777619); }
    return "fnv" + (h >>> 0).toString(16);
  }

  /* ---------- profilo vuoto ---------- */
  function emptyProfile() {
    return {
      nome: "", cognome: "", telefono: "", dataNascita: "", citta: "", nazionalita: "Italiana",
      cds: "", percorso: "", anno: "", matricola: "", annoImmatricolazione: "", sede: "Firenze — Novoli",
      mediaManuale: "", cfuManuali: "", laureaPrevista: "", usaLibretto: true,
      esami: [], // {id, slug, nome, cfu, voto, lode, data}
      inglese: "", certInglese: "Nessuna", scoreInglese: "", altreLingue: [], // {lingua, livello}
      gmat: "", gre: "",
      erasmus: "no", erasmusDove: "",
      stage: [], // {id, azienda, ruolo, settore, mesi}
      extracurricolari: "",
      dopoLaurea: "", areeProf: [], areeDispense: [], geo: [], budget: "", durata: "indifferente",
      startTarget: "", obiettivi: "", ruoli: "", mediaObiettivo: "",
      newsletter: true, mentor: false, network: true,
    };
  }

  /* ---------- DB ---------- */
  let db = null;

  // Il DB resta in memoria: le viste lavorano sugli stessi oggetti che vengono salvati.
  // Si rilegge da localStorage solo all'avvio o se un'altra scheda lo modifica.
  function load() {
    if (db) return db;
    const raw = safeGet(LOCAL, DB_KEY);
    if (raw) {
      try { db = JSON.parse(raw); } catch (e) { db = null; }
    }
    if (!db || !Array.isArray(db.users)) {
      db = { users: [], createdAt: now(), version: 1 };
    }
    return db;
  }
  function save() {
    if (!safeSet(LOCAL, DB_KEY, JSON.stringify(db))) {
      UL.ui && UL.ui.toast("Impossibile salvare: storage del browser non disponibile", "err");
    }
  }

  async function makeUser({ email, password, role = "student", profile = {}, onboarded = true, createdAt, lastLogin, activity }) {
    const salt = Math.random().toString(36).slice(2, 10);
    return {
      id: uid(),
      email: email.trim().toLowerCase(),
      salt,
      pwHash: await hashPassword(password, salt),
      role,
      createdAt: createdAt || now(),
      lastLogin: lastLogin || null,
      loginCount: 0,
      onboarded,
      profile: Object.assign(emptyProfile(), clone(CFG.profileDefaults || {}), profile),
      activity: Object.assign({ downloads: [], favorites: [], shortlist: [], notify: [], log: [], readNotif: [] }, clone(CFG.activityDefaults || {}), activity || {}),
    };
  }

  async function ensureSeed() {
    load();
    if (db.users.length) return;
    const seed = UL.SEED || [];
    for (const s of seed) db.users.push(await makeUser(s));
    db.seededAt = now();
    save();
  }

  async function resetDemo() {
    safeDel(LOCAL, DB_KEY);
    logout();
    db = null;
    await ensureSeed();
  }

  /* ---------- sessione ---------- */
  function readSession() {
    const raw = safeGet(SESSION, SES_KEY) || safeGet(LOCAL, SES_KEY);
    if (!raw) return null;
    try {
      const s = JSON.parse(raw);
      if (!s || new Date(s.exp) < new Date()) { logout(); return null; }
      return s;
    } catch (e) { return null; }
  }
  function currentUser() {
    const s = readSession();
    if (!s) return null;
    load();
    return db.users.find((u) => u.id === s.userId) || null;
  }

  async function login(email, password, remember) {
    load();
    const u = db.users.find((x) => x.email === String(email).trim().toLowerCase());
    if (!u) throw new Error("Nessun account associato a questa email.");
    const h = await hashPassword(password, u.salt);
    if (h !== u.pwHash) throw new Error("Password non corretta.");
    const ses = { userId: u.id, exp: new Date(Date.now() + SESSION_HOURS * 3600e3 * (remember ? 21 : 1)).toISOString() };
    safeSet(remember ? LOCAL : SESSION, SES_KEY, JSON.stringify(ses));
    u.lastLogin = now();
    u.loginCount = (u.loginCount || 0) + 1;
    addLog(u, "login", "Accesso effettuato");
    save();
    return u;
  }
  function logout() {
    safeDel(SESSION, SES_KEY);
    safeDel(LOCAL, SES_KEY);
  }

  async function register({ nome, cognome, email, password, cds, anno }) {
    load();
    const em = String(email).trim().toLowerCase();
    if (db.users.some((u) => u.email === em)) throw new Error("Esiste già un account con questa email.");
    const u = await makeUser({ email: em, password, onboarded: false, profile: { nome, cognome, cds, anno } });
    addLog(u, "account", "Account creato");
    db.users.push(u);
    save();
    await login(em, password, false);
    return u;
  }

  async function changePassword(user, oldPw, newPw) {
    const h = await hashPassword(oldPw, user.salt);
    if (h !== user.pwHash) throw new Error("La password attuale non è corretta.");
    user.salt = Math.random().toString(36).slice(2, 10);
    user.pwHash = await hashPassword(newPw, user.salt);
    addLog(user, "account", "Password modificata");
    save();
  }

  function deleteAccount(user) {
    load();
    db.users = db.users.filter((u) => u.id !== user.id);
    save();
    logout();
  }

  /* ---------- profilo & attività ---------- */
  function updateProfile(user, patch) {
    Object.assign(user.profile, patch);
    save();
  }
  function addLog(user, type, msg, extra) {
    user.activity.log.unshift(Object.assign({ t: now(), type, msg }, extra || {}));
    user.activity.log = user.activity.log.slice(0, 60);
  }
  function logDownload(user, slug, kind) {
    user.activity.downloads.unshift({ slug, kind: kind || "appunti", at: now() });
    const c = (window.UL_DISPENSE || []).find((d) => d.slug === slug);
    addLog(user, "download", `Scaricato ${kind === "mappe" ? "Mappe & Schemi" : kind === "quiz" ? "Quiz" : "Appunti"} — ${c ? c.title : slug}`);
    save();
  }
  function toggleFavorite(user, slug) {
    const f = user.activity.favorites;
    const i = f.indexOf(slug);
    if (i >= 0) f.splice(i, 1); else f.push(slug);
    save();
    return i < 0;
  }
  function toggleShortlist(user, pid) {
    const s = user.activity.shortlist;
    const i = s.findIndex((x) => x.pid === pid);
    if (i >= 0) { s.splice(i, 1); save(); return false; }
    s.push({ pid, status: "valutare", note: "", deadline: "", at: now() });
    const p = (window.UL_PROGRAMMI || []).find((x) => x.id === pid);
    addLog(user, "master", `Aggiunto alla shortlist — ${p ? p.school + " · " + p.program : pid}`);
    save();
    return true;
  }
  function toggleNotify(user, key) {
    const n = user.activity.notify;
    const i = n.indexOf(key);
    if (i >= 0) n.splice(i, 1); else n.push(key);
    save();
    return i < 0;
  }
  function markOnboarded(user) { user.onboarded = true; save(); }

  /* ---------- calcoli carriera ---------- */
  function career(p) {
    const esami = (p.esami || []).filter((e) => e.voto && e.cfu);
    const cfuLib = esami.reduce((s, e) => s + Number(e.cfu), 0);
    const pond = cfuLib ? esami.reduce((s, e) => s + Number(e.voto) * Number(e.cfu), 0) / cfuLib : null;
    const arit = esami.length ? esami.reduce((s, e) => s + Number(e.voto), 0) / esami.length : null;
    const useLib = p.usaLibretto && esami.length > 0;
    const media = useLib ? pond : (parseFloat(String(p.mediaManuale).replace(",", ".")) || null);
    const cfu = useLib ? cfuLib : (parseInt(p.cfuManuali, 10) || 0);
    const base = media ? (media * 110) / 30 : null;
    const lodi = esami.filter((e) => e.lode).length;
    return { media, arit, cfu, base, lodi, nEsami: esami.length, fonte: useLib ? "libretto" : "manuale" };
  }

  function completeness(user) {
    const p = user.profile;
    const c = career(p);
    const items = [
      { k: "Dati anagrafici", ok: !!(p.nome && p.cognome && p.citta), tab: "anagrafica" },
      { k: "Corso, percorso e anno", ok: !!(p.cds && p.anno && p.matricola), tab: "percorso" },
      { k: "Media e CFU", ok: !!c.media && c.cfu > 0, tab: "libretto" },
      { k: "Livello d'inglese", ok: !!p.inglese, tab: "lingue" },
      { k: "Esperienze (stage/Erasmus)", ok: (p.stage || []).length > 0 || p.erasmus !== "no" || !!p.extracurricolari, tab: "esperienze" },
      { k: "Obiettivi dopo la laurea", ok: !!p.dopoLaurea && (p.areeProf || []).length > 0, tab: "obiettivi" },
      { k: "Paesi e budget target", ok: (p.geo || []).length > 0 && !!p.budget, tab: "obiettivi" },
    ];
    const pct = Math.round((items.filter((i) => i.ok).length / items.length) * 100);
    return { items, pct };
  }

  function exportUser(user) {
    const u = clone(user);
    delete u.pwHash; delete u.salt;
    return u;
  }

  window.addEventListener("storage", (e) => {
    if (e.key === DB_KEY) { db = null; UL.app && UL.app.refresh(); }
  });

  UL.store = {
    ensureSeed, resetDemo, load, save, currentUser, login, logout, register, changePassword, deleteAccount,
    updateProfile, addLog, logDownload, toggleFavorite, toggleShortlist, toggleNotify, markOnboarded,
    career, completeness, exportUser, emptyProfile, uid,
    allUsers: () => (load(), db.users),
  };
})();

