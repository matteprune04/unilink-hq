/* archivio-commenti.js — ARCHIVIO CONDIVISO dei commenti delle demo (uguale in demo-landing/ e demo-webapp/js/).
   Quando si scaricano i commenti, l'esportazione viene archiviata nell'HQ: database Supabase dell'HQ, tabella «docs»,
   sezione (col) «demo_commenti». Così chi accede all'HQ la vede e la riscarica (Laboratorio AI → la demo → Commenti archiviati,
   oppure dal pannello Commenti della demo). Le demo sono sullo stesso sito dell'HQ: si usa la sessione dell'HQ salvata in
   questo browser (accesso con la password del team). Senza sessione l'esportazione resta archiviata nel browser e
   viene caricata nell'HQ la prima volta che c'è una sessione valida (basta aprire l'HQ ed entrare).
   Dati: { id, demo: "landing"|"webapp", data, autore, formato, file, versione, n, commenti[], md } · nessun dato personale oltre al nome scelto. */
(function () {
  const BASE = "https://ixlxtbmvlqevlrkdhkwx.supabase.co", KEY = "sb_publishable_cXTrHtLDLRGEu46Ps1C46A_4Do-sQst", COL = "demo_commenti";
  // token della sessione HQ (supabase-js la salva in localStorage come «sb-<progetto>-auth-token»); solo se non è scaduto
  const token = () => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!/^sb-.*-auth-token$/.test(k)) continue;
        const s = JSON.parse(localStorage.getItem(k)) || {}, x = s.currentSession || s;
        if (x.access_token && (!x.expires_at || x.expires_at * 1000 > Date.now() + 30000)) return x.access_token;
      }
    } catch (e) { /* storage non disponibile */ }
    return null;
  };
  const head = (t) => ({ apikey: KEY, Authorization: "Bearer " + t, "Content-Type": "application/json" });
  window.UL_ARCHIVIO = {
    collegato: () => !!token(),
    async salva(entry) {
      const t = token(); if (!t) return false;
      try {
        const r = await fetch(BASE + "/rest/v1/docs", { method: "POST", headers: { ...head(t), Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ col: COL, id: entry.id, data: entry, updated_at: new Date().toISOString() }) });
        return r.ok;
      } catch (e) { return false; }
    },
    // archivi condivisi di una demo (null = non collegato o offline)
    async elenco(demo) {
      const t = token(); if (!t) return null;
      try {
        const r = await fetch(BASE + "/rest/v1/docs?col=eq." + COL + "&select=id,data", { headers: head(t) });
        if (!r.ok) return null;
        return (await r.json()).map((x) => x.data).filter((d) => d && (!demo || d.demo === demo)).sort((a, b) => String(b.data).localeCompare(String(a.data)));
      } catch (e) { return null; }
    },
    // carica nell'HQ le esportazioni archiviate solo nel browser
    async sincronizza(storico, demo) {
      let n = 0;
      for (const e of storico.filter((x) => !x.condiviso)) if (await this.salva({ ...e, demo })) { e.condiviso = true; n++; }
      return n;
    },
  };
})();
