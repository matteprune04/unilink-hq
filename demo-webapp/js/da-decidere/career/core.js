/* ============================================================================================
   MODULO «CAREER» (dalla demo Versione C) · motore            — sezione DA DECIDERE (D03–D11)
   ============================================================================================
   COSA FA   Career Score (0–100 in 5 aree), 5 fasi del percorso con checklist, prossime 3 azioni,
             stato Plus, pipeline B2B del cockpit admin.
   FILE      dati.js            → window.UL_C (aziende, annunci, track, mentor, eventi, perk, pipeline) — TUTTO FITTIZIO
             core.js            → questo file (UL.C)
             viste-percorso.js  → pianoC, studioC, opportunitaC, profiloC, eventiC, plusC, onboardingC
             viste-crescita.js  → trackC, mentorC, masterC, adminC
   ROTTE     (registrate in js/boot.js → appRoutes)  piano · studio · opportunita · profilo · eventi · plus
             · track · mentor · master · cockpit (admin)
   DATI      profile:  headline, skills[], linkedin, areeProf[], inglese, certInglese, gmat, gre, stage[],
                       erasmus (si|candidatura|no), extracurricolari, dopoLaurea  (+ media/CFU da UL.store.career)
             activity: plus{active,plan,since} · applications[] · tracks[] · bookings[] · rsvp[]
                       · talent{visible} · referral{code,invited,credits} · shortlist[] (condivisa con B)
             I default stanno in js/config.js → UL.CONFIG (unione B + C + D).
   CONDIVISO activity.plus è IL Plus di tutta la app: UL.B.plus() delega a C.isPlus().
             activity.bookings è condivisa con il Mentor di «Il mio percorso» (B): C.mentor() ha un fallback.
   ATTIVARE  1) spostare le voci dal gruppo «Da decidere» al gruppo giusto in js/boot.js (NAV)
             2) sostituire UL_C con dati veri (Supabase) mantenendo gli stessi campi
             3) rivedere pesi e soglie in C.score / C.phases (oggi ipotesi della demo C)
   RIMUOVERE togliere i 4 <script> da index.html e le rotte del gruppo DD_CAREER in js/boot.js.
   ============================================================================================ */
(function () {
  const UL = window.UL;
  const D = window.UL_C;
  const C = (UL.C = {});
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  C.eur = (n) => {
    const v = Math.round(Math.abs(Number(n)) * 100) / 100;
    const [i, d] = v.toFixed(v % 1 ? 2 : 0).split(".");
    return (Number(n) < 0 ? "−" : "") + "€" + i.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (d ? "," + d : "");
  };
  C.co = (id) => D.companies.find((c) => c.id === id) || { n: "UniLink", c: "#172554", s: "" };
  C.isPlus = (u) => !!(u && u.activity.plus.active) || (u && u.role === "admin");
  C.track = (id) => D.tracks.find((t) => t.id === id);
  // fallback: le prenotazioni fatte dal Mentor di «Il mio percorso» (B) usano altri id
  C.mentor = (id) => D.mentors.find((m) => m.id === id) || { id, n: "Mentor UniLink", r: "", cat: "Mentor", price: 0 };
  C.inDays = (d) => new Date(Date.now() + d * 864e5);

  C.talentPct = (u) => {
    const p = u.profile;
    const c = UL.store.career(p);
    const items = [!!p.headline, (p.skills || []).length >= 3, !!c.media, !!p.inglese, (p.stage || []).length > 0 || !!p.extracurricolari, !!p.linkedin, (p.areeProf || []).length > 0];
    return Math.round((items.filter(Boolean).length / items.length) * 100);
  };

  C.score = (u) => {
    const p = u.profile;
    const a = u.activity;
    const c = UL.store.career(p);
    const ENG = { B2: 5, C1: 8, C2: 10, Madrelingua: 10 };
    const g = parseInt(p.gmat, 10);
    const acc = (c.media ? clamp((c.media - 22) / 8, 0, 1) * 25 : 0) + clamp((c.cfu || 0) / 120, 0, 1) * 5;
    const lang = (ENG[p.inglese] || 0) + (p.certInglese && p.certInglese !== "Nessuna" ? 2 : 0) + (g ? clamp((g - 505) / 200, 0, 1) * 8 : 0);
    const exp = Math.min(12, (p.stage || []).length * 6) + (p.erasmus === "si" ? 5 : p.erasmus === "candidatura" ? 2 : 0) + (p.extracurricolari ? 3 : 0);
    const net = (C.talentPct(u) / 100) * 8 + (a.talent.visible ? 3 : 0) + Math.min(2, a.rsvp.length) * 2;
    const prep = (a.tracks.length ? 6 : 0) + (a.tracks.length ? (a.tracks.reduce((s, t) => s + t.done.length / C.track(t.id).mods.length, 0) / a.tracks.length) * 5 : 0) + Math.min(2, a.bookings.length) * 2;
    const parts = [
      { k: "Percorso accademico", v: acc, max: 30 }, { k: "Lingue e test", v: Math.min(20, lang), max: 20 },
      { k: "Esperienze", v: Math.min(20, exp), max: 20 }, { k: "Profilo e network", v: Math.min(15, net), max: 15 },
      { k: "Preparazione", v: Math.min(15, prep), max: 15 },
    ];
    return { total: Math.round(parts.reduce((s, x) => s + x.v, 0)), parts };
  };

  C.phases = (u) => {
    const p = u.profile;
    const a = u.activity;
    const c = UL.store.career(p);
    const apps = a.applications;
    const ph = [
      { k: "Esami", items: [
        { t: "Media e CFU aggiornati", ok: !!c.media, to: "#/app/profilo" },
        { t: "Media ≥ 27", ok: (c.media || 0) >= 27, to: "#/app/studio" },
        { t: "In pari con gli esami degli anni precedenti", ok: (c.cfu || 0) >= ((Number(p.anno) || 1) - 1) * 55, to: "#/app/studio" },
      ] },
      { k: "Esperienze", items: [
        { t: "Certificazione d'inglese", ok: !!p.certInglese && p.certInglese !== "Nessuna", to: "#/app/profilo" },
        { t: "Erasmus fatto o candidatura inviata", ok: p.erasmus === "si" || p.erasmus === "candidatura", to: "#/app/track" },
        { t: "Associazione o progetto extra", ok: !!p.extracurricolari, to: "#/app/profilo" },
      ] },
      { k: "Stage", items: [
        { t: "Profilo talento completo all'80%", ok: C.talentPct(u) >= 80, to: "#/app/profilo" },
        { t: "Prima candidatura inviata", ok: apps.length > 0, to: "#/app/opportunita" },
        { t: "Uno stage svolto", ok: (p.stage || []).length > 0, to: "#/app/opportunita" },
      ] },
      { k: "Magistrale", items: [
        { t: "Shortlist di almeno 3 programmi", ok: a.shortlist.length >= 3, to: "#/app/master" },
        { t: "GMAT o GRE sostenuto", ok: !!(p.gmat || p.gre), to: "#/app/track" },
        { t: "Prima candidatura MSc inviata", ok: a.shortlist.some((s) => ["inviata", "ammesso"].includes(s.status)), to: "#/app/master" },
      ] },
      { k: "Lavoro", items: [
        { t: "Profilo visibile alle aziende partner", ok: a.talent.visible, to: "#/app/profilo" },
        { t: "Un colloquio ottenuto", ok: apps.some((x) => ["colloquio", "offerta"].includes(x.st)), to: "#/app/opportunita" },
        { t: "Un'offerta ricevuta", ok: apps.some((x) => x.st === "offerta"), to: "#/app/opportunita" },
      ] },
    ];
    const now = ph.findIndex((x) => x.items.some((i) => !i.ok));
    ph.forEach((x, i) => (x.state = i < now || now === -1 ? "done" : i === now ? "now" : "next"));
    return ph;
  };
  C.nextActions = (u) => C.phases(u).filter((x) => x.state !== "done").flatMap((x) => x.items.filter((i) => !i.ok).map((i) => ({ ...i, ph: x.k }))).slice(0, 3);

  /* pipeline B2B (pannello admin) in localStorage separato */
  const PK = "ul_varC_b2b";
  C.pipeline = () => {
    try { const v = JSON.parse(localStorage.getItem(PK) || "null"); if (v) return v; } catch (e) { /* noop */ }
    return JSON.parse(JSON.stringify(D.pipeline));
  };
  C.savePipeline = (list) => { try { localStorage.setItem(PK, JSON.stringify(list)); } catch (e) { /* noop */ } };

  C.APP_ST = { inviata: { l: "Inviata", c: "stage-lead" }, colloquio: { l: "Colloquio", c: "stage-prop" }, offerta: { l: "Offerta", c: "stage-won" }, chiusa: { l: "Chiusa", c: "stage-lead" } };
})();

