/* ============================================================================================
   MODULO «NETWORK» (dalla demo Versione D) · motore           — sezione DA DECIDERE (D12–D21)
   ============================================================================================
   COSA FA   UniLink su più atenei: home dell'ateneo, dispense della community con crediti, test e
             simulazioni con predittore, calcolatori (voto di laurea, exchange), club, mercatino,
             academy, Pass, pannello di rete per il team.
   FILE      dati.js              → window.UL_D (atenei, dispense community, domande, test, academy,
                                     ammissioni, eventi, convenzioni, annunci) — FITTIZIO tranne UniFi
             core.js              → questo file (UL.D)
             home-vista.js        → onboardingD, homeD, passD
             dispense-vista.js    → dispenseD (+ caricamento con revisione)
             prep-vista.js        → testD, academyD, ammissioniD
             community-vista.js   → clubD, mercatinoD, strumentiD
             admin-vista.js       → adminD
   ROTTE     home · dispense · test · academy · ammissioni · club · mercatino · strumenti · pass · rete (admin)
   DATI      profile:  ateneo, corso
             activity: credits · pass{active,since} · uploads[] · tests{sessions,stats} · courses[]
                       · chapter · rsvp[] · listings[] · admissions[] · ambassador
                       · purchases[] (condivisa con B: tipi selfstudy|tutoring|academy|featured)
   CONDIVISO D.dispense("unifi") legge le dispense vere di window.UL_DISPENSE (stesse di «Materiali»).
   ATTIVARE  1) scegliere un solo abbonamento: Pass (qui) o Plus (Career) — vedi D20
             2) dati veri degli atenei e regole ufficiali nei PRESETS del voto di laurea
             3) spostare le voci scelte dal gruppo «Da decidere» in js/boot.js
   RIMUOVERE togliere i 7 <script> da index.html e le rotte del gruppo DD_NETWORK in js/boot.js.
   ============================================================================================ */
(function () {
  const UL = window.UL;
  const DATA = window.UL_D;
  const D = (UL.D = {});
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  D.eur = (n) => {
    const v = Math.round(Math.abs(Number(n)) * 100) / 100;
    const [i, d] = v.toFixed(v % 1 ? 2 : 0).split(".");
    return (Number(n) < 0 ? "−" : "") + "€" + i.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (d ? "," + d : "");
  };
  D.uni = (id) => DATA.unis.find((u) => u.id === id) || DATA.unis[0];
  D.myUni = (u) => D.uni(u.profile.ateneo);
  D.isPass = (u) => u.role === "admin" || !!u.activity.pass.active;
  D.hasPrep = (u) => D.isPass(u) || u.activity.purchases.some((p) => p.type === "selfstudy" || p.type === "tutoring");
  D.uid = () => Math.random().toString(36).slice(2, 9);

  D.addCredits = (u, n, why) => {
    u.activity.credits = Math.max(0, (u.activity.credits || 0) + n);
    UL.store.addLog(u, "crediti", `${n > 0 ? "+" : ""}${n} crediti — ${why}`);
  };
  D.buy = (u, item) => {
    u.activity.purchases.push(Object.assign({ id: "o" + Date.now().toString(36), at: new Date().toISOString() }, item));
    UL.store.addLog(u, "acquisto", `${item.label} (${D.eur(item.price)})`);
    UL.store.save();
  };

  /* ---------- dispense multi-ateneo ---------- */
  const CDS_NAME = { EA: "Economia Aziendale", EC: "Economia e Commercio" };
  D.dispense = (uniId) => {
    if (uniId === "unifi") {
      return (window.UL_DISPENSE || []).filter((d) => !d.soon).map((d) => ({
        id: d.slug, uni: "unifi", cds: d.cds.split("/").map((x) => CDS_NAME[x]).join(" / "), anno: d.anno, title: d.title,
        author: "Team UniLink", official: true, rating: 4.9, dl: null, pages: null, pdf: d.pdf, code: d.code,
      }));
    }
    const fromUsers = UL.store.allUsers().flatMap((u) => u.activity.uploads.filter((x) => x.status === "approved" && x.uni === uniId)
      .map((x) => ({ ...x, author: `${u.profile.nome} ${(u.profile.cognome || "")[0] || ""}.`, rating: null, dl: 0 })));
    return DATA.community.filter((d) => d.uni === uniId).concat(fromUsers);
  };

  /* ---------- test ---------- */
  D.stat = (u, qid) => u.activity.tests.stats[qid] || { seen: 0, ok: 0, last: false };
  D.answer = (u, qid, ok) => {
    const s = (u.activity.tests.stats[qid] = D.stat(u, qid));
    s.seen++; if (ok) s.ok++; s.last = ok;
  };
  D.subjects = (u) => DATA.subjects.map((s) => {
    const qs = DATA.apt.filter((q) => q.s === s);
    const seen = qs.filter((q) => D.stat(u, q.id).seen);
    const ans = seen.reduce((a, q) => a + D.stat(u, q.id).seen, 0);
    const ok = seen.reduce((a, q) => a + D.stat(u, q.id).ok, 0);
    return { s, n: qs.length, seen: seen.length, acc: ans ? Math.round((ok / ans) * 100) : null };
  });
  D.best = (u, test) => {
    const ss = u.activity.tests.sessions.filter((x) => x.mode === "simulazione" && (!test || x.test === test));
    return ss.length ? Math.max(...ss.map((x) => Math.round((x.correct / x.n) * 100))) : null;
  };

  /* ---------- predittore di ammissione (illustrativo) ---------- */
  D.predict = (media, score, prog) => {
    if (!prog) return null;
    const base = { T: 80, S: 68, R: 55 }[prog.tier];
    const req = clamp(Math.round(base - ((Number(media) || 27) - 27) * 4), 40, 95);
    if (score == null) return { req, band: "nodata" };
    const d = score - req;
    return { req, band: d >= 5 ? "sopra" : d >= -5 ? "linea" : "sotto", d };
  };

  /* ---------- calcolatori ---------- */
  D.PRESETS = {
    unifi: { tesi: 6, lode: 0.2, corso: 2, erasmus: 1 },
    unipi: { tesi: 6, lode: 0.2, corso: 1, erasmus: 1 },
    bocconi: { tesi: 5, lode: 0.25, corso: 2, erasmus: 1 },
    unibo: { tesi: 7, lode: 0.2, corso: 1, erasmus: 1 },
    luiss: { tesi: 5, lode: 0.25, corso: 2, erasmus: 1 },
    unisi: { tesi: 6, lode: 0.2, corso: 1, erasmus: 1 },
  };
  D.laurea = (x) => {
    const base = (Number(x.media) * 110) / 30;
    const tot = base + Number(x.tesi) + Number(x.lodi) * Number(x.lode) + (x.inCorso ? Number(x.corso) : 0) + (x.erasmusFatto ? Number(x.erasmus) : 0);
    return { base, tot: Math.min(113, tot), lode: tot >= 112.5 };
  };
  D.exchange = (x) => {
    const m = clamp((Number(x.media) - 18) / 12, 0, 1) * 60;
    const c = clamp(Number(x.cfu) / Math.max(1, Number(x.cfuAttesi)), 0, 1) * 30;
    const l = { B1: 2, B2: 6, C1: 10, C2: 10 }[x.lingua] || 0;
    return Math.round(m + c + l);
  };
  D.DESTINATIONS = [
    { n: "Universidade Nova de Lisboa", c: "Portogallo", soglia: 72, posti: 4 },
    { n: "Erasmus University Rotterdam", c: "Paesi Bassi", soglia: 84, posti: 2 },
    { n: "Universidad de Sevilla", c: "Spagna", soglia: 61, posti: 6 },
    { n: "Universität Wien", c: "Austria", soglia: 68, posti: 3 },
    { n: "Copenhagen Business School", c: "Danimarca", soglia: 86, posti: 2 },
    { n: "Université Lyon 3", c: "Francia", soglia: 58, posti: 5 },
  ];
})();

