/* js/core.js — MOTORE DELLA PARTE DECISA (dalla demo Versione B «Esami»): UL.B
   Simulazione, Dispensa completa, Pacchetto semestre per percorso (v7), checkout simulato, esercitazioni (stat, errori, progresso), metriche, Plus.
   Plus: UN SOLO campo per tutta la app → activity.plus {active, plan, since, cancelAt} (stesso del modulo Career, C.isPlus).
   Prezzi: UL.PIANI.prezzi in config.js (ipotesi HQ). */
(function () {
  const UL = window.UL;
  const B = (UL.B = {});

  // prezzi da testare (ipotesi della conversazione: pacchetto esame €19–29, semestre €49–69)
  B.PRICES = UL.PIANI.prezzi; // ipotesi: config.js
  B.COUPONS = { BENVENUTO10: 0.1, MATRICOLA20: 0.2 };
  B.FEE = { pct: 0.015, fixed: 0.25 }; // Stripe Italia, carte UE standard / Apple Pay / Google Pay: 1,5% + 0,25 € a transazione, 0 € al mese (uguale in checkout-stripe.js)

  B.courses = () => (window.UL_DISPENSE || []).filter((d) => !d.soon);
  B.course = (slug) => (window.UL_DISPENSE || []).find((d) => d.slug === slug);
  B.hasQuiz = (slug) => !!(window.UL_QUIZ || {})[slug];
  B.questions = (slug) => (window.UL_QUIZ || {})[slug] || [];
  B.eur = (n) => {
    const v = Math.round(Math.abs(Number(n)) * 100) / 100;
    const [i, d] = v.toFixed(v % 1 ? 2 : 0).split(".");
    return (Number(n) < 0 ? "−" : "") + "€" + i.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (d ? "," + d : "");
  };

  /* ---------- v7 · percorso dello studente (corso + curriculum) → esami del pacchetto semestre (js/percorsi.js) ---------- */
  const PERC = window.UL_PERCORSI;
  B.cdsDi = (user) => (user && user.profile.cds) || "EA";
  B.currDi = (user) => (user && user.profile.curriculum) || "";
  B.inPercorso = (c, cds, curr) => (PERC && c.code && PERC.esami[c.code] ? PERC.include(c.code, cds, curr) : !cds || c.cds.includes(cds));
  B.semesterCourses = (cds, anno, sem, curr) => B.courses().filter((d) => d.anno === Number(anno) && d.sem === Number(sem) && (!cds || B.inPercorso(d, cds, curr)));
  B.serveCurriculum = (cds, anno) => !!PERC && PERC.serveCurriculum(B.courses().filter((d) => d.anno === Number(anno)), cds);

  /* ---------- v7 · livelli di accesso per esame (decisioni del 7/10) ----------
     "none"        → solo scheda e quiz di prova
     "simulazione" → + la simulazione d'esame di quell'esame (acquisto «simulazione», 4,99 €)
     "completa"    → dispensa da leggere e annotare nell'app, quiz, simulazioni, piano personale del Planner.
     La Completa arriva da: acquisto «completa», pacchetto semestre che include l'esame, team, ed è GRATIS per tutti
     per l'esame di UL.PIANI.gratis.esame (Economia Aziendale). Plus NON dà materiali.
     Acquisti archiviati (Appunti, Appunti gratis, Pacchetto anno) restano validi per chi li aveva: valgono come Completa. */
  const RANK = { none: 0, simulazione: 1, completa: 2 };
  B.copre = (p, c) => !!c && ((p.type === "semester" && (p.esami ? p.esami.includes(c.slug) : c.anno === p.anno && c.sem === p.sem && (!p.cds || c.cds.includes(p.cds)))) || (p.type === "anno" && c.anno === p.anno && (!p.cds || c.cds.includes(p.cds))));
  B.gratisPerTutti = (slug) => slug === UL.PIANI.gratis.esame;
  B.level = (user, slug) => {
    if (!user) return "none";
    if (user.role === "admin" || B.gratisPerTutti(slug)) return "completa";
    const c = B.course(slug); let lv = "none";
    (user.activity.purchases || []).forEach((p) => {
      let l = "none";
      if (["completa", "exam", "appunti", "gratis"].includes(p.type) && p.slug === slug) l = "completa";
      else if (p.type === "simulazione" && p.slug === slug) l = "simulazione";
      else if (B.copre(p, c)) l = "completa";
      if (RANK[l] > RANK[lv]) lv = l;
    });
    return lv;
  };
  B.owns = (user, slug) => B.level(user, slug) === "completa";         // ha la dispensa (da leggere nell'app)
  B.ownsCompleta = B.owns;                                              // compatibilità: dispensa, quiz e simulazioni
  B.ownsSimulazione = (user, slug) => B.level(user, slug) !== "none";  // può fare la simulazione d'esame
  B.haCompleta = (c) => !!c;                                            // ogni esame del catalogo ha la sua dispensa completa
  B.haSimulazione = (c) => !!c && (!!c.quiz || B.hasQuiz(c.slug));      // la simulazione c'è dove ci sono già quiz
  B.haPacchetto = (user) => (user.activity.purchases || []).some((p) => p.type === "semester" || p.type === "anno");

  /* ---------- prezzi di lancio: [prezzo, prezzo pieno barrato] ---------- */
  B.prezzoSem = (n) => (n >= 4 ? B.PRICES.semestre[4] : B.PRICES.semestre[3]);   // [lancio, pieno]
  B.prezzo = (k, c, n) => k === "simulazione" ? B.PRICES.simulazione[0] : k === "completa" ? B.PRICES.completa[0]
    : k === "semester" ? B.prezzoSem(n || 3)[0] : k === "plus" ? B.PRICES.plus : 0;
  B.prezzoPieno = (k, n) => k === "simulazione" ? B.PRICES.simulazione[1] : k === "completa" ? B.PRICES.completa[1] : k === "semester" ? B.prezzoSem(n || 3)[1] : 0;
  B.prezzoPlus = (user) => (B.haPacchetto(user) ? B.PRICES.plusConPacchetto : B.PRICES.plus);
  B.quandoVale = () => "prezzo di lancio";
  // fine della sessione in corso o della prossima (fino a quando vale Plus)
  B.fineSessione = (d = new Date()) => {
    const y = d.getFullYear();
    const date = UL.PIANI.fineSessioni.map((x) => new Date(`${y}-${x}T23:59:00`)).concat([new Date(`${y + 1}-${UL.PIANI.fineSessioni[0]}T23:59:00`)]);
    return date.find((x) => x >= d);
  };
  // v7: niente più «1 Appunti gratis a scelta» (Appunti singoli tolti il 7/10): restano le funzioni per il codice vecchio
  B.gratisUsati = () => 0;
  B.gratisDisponibili = () => 0;
  B.puoGratis = () => false;

  B.buy = (user, item, coupon) => {
    const disc = B.COUPONS[(coupon || "").toUpperCase()] || 0;
    const price = Math.round(item.price * (1 - disc) * 100) / 100;
    const p = Object.assign({ id: "o" + Date.now().toString(36), at: new Date().toISOString(), coupon: disc ? coupon.toUpperCase() : "" }, item, { price, listPrice: item.price });
    user.activity.purchases.push(p);
    UL.store.addLog(user, "acquisto", `Acquisto — ${item.label} (${B.eur(price)})`);
    if (item.type === "plus") user.activity.plus = { active: true, plan: "sessione", since: p.at, until: B.fineSessione().toISOString(), cancelAt: "" };
    if (["simulazione", "completa"].includes(item.type) && !user.activity.exams.some((e) => e.slug === item.slug)) user.activity.exams.push({ slug: item.slug, partizione: "", appello: "", obiettivo: "", status: "doing" });
    UL.store.save();
    B.track("acquisto");
    return p;
  };

  /* ---------- quiz ---------- */
  B.stat = (user, qid) => user.activity.quiz.stats[qid] || { seen: 0, wrong: 0, streak: 0 };
  B.answer = (user, qid, ok) => {
    const s = (user.activity.quiz.stats[qid] = B.stat(user, qid));
    s.seen++; s.last = new Date().toISOString();
    if (ok) s.streak++; else { s.wrong++; s.streak = 0; }
  };
  B.errors = (user, slug) => B.questions(slug).filter((q) => { const s = B.stat(user, q.id); return s.wrong > 0 && s.streak < 2; });
  B.progress = (user, slug) => {
    const qs = B.questions(slug);
    if (!qs.length) {
      const e = user.activity.exams.find((x) => x.slug === slug);
      return e && e.status === "done" ? 100 : Number((e && e.auto) || 0);
    }
    return Math.round((qs.filter((q) => B.stat(user, q.id).streak > 0).length / qs.length) * 100);
  };
  B.topics = (user, slug) => {
    const m = {};
    B.questions(slug).forEach((q) => {
      const s = B.stat(user, q.id);
      m[q.topic] = m[q.topic] || { n: 0, seen: 0, ok: 0 };
      m[q.topic].n++;
      if (s.seen) { m[q.topic].seen++; if (s.streak > 0) m[q.topic].ok++; }
    });
    return Object.entries(m).map(([t, v]) => ({ t, ...v }));
  };
  B.saveSession = (user, sess) => {
    user.activity.quiz.sessions.unshift(sess);
    user.activity.quiz.sessions = user.activity.quiz.sessions.slice(0, 80);
    const c = B.course(sess.slug);
    UL.store.addLog(user, "quiz", `${sess.modeLabel} — ${c ? c.title : sess.slug}: ${sess.correct}/${sess.n}`);
    UL.store.save();
  };
  B.shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------- metriche anonime della landing (solo in questo browser) ---------- */
  const MK = "ul_unilink_v4_metrics";
  B.metrics = () => { try { return JSON.parse(localStorage.getItem(MK) || "{}"); } catch (e) { return {}; } };
  B.track = (k, slug) => {
    try {
      const m = B.metrics();
      m[k] = (m[k] || 0) + 1;
      if (slug) { m.bySlug = m.bySlug || {}; m.bySlug[slug] = m.bySlug[slug] || {}; m.bySlug[slug][k] = (m.bySlug[slug][k] || 0) + 1; }
      localStorage.setItem(MK, JSON.stringify(m));
    } catch (e) { /* storage non disponibile */ }
  };


  /* ---------- estensioni UniLink v3 → v4 ---------- */
  // Plus: una tantum, vale fino alla fine della sessione (niente rinnovi). Il team lo ha sempre.
  B.plus = (user) => !!(user && (user.role === "admin" || (user.activity.plus && user.activity.plus.active && (!user.activity.plus.until || new Date(user.activity.plus.until) >= new Date()))));
  // esercitazioni complete (quiz rapido, simulazione d'esame) = Completa dell'esame. Il ripasso del registro errori = Plus.
  B.ownsPractice = (user, slug) => B.ownsCompleta(user, slug);
  B.planName = (user) => {
    if (!user) return "";
    if (user.role === "admin") return "Team";
    const ps = user.activity.purchases || [];
    const parts = [];
    if (B.plus(user)) parts.push("Plus");
    if (ps.some((p) => p.type === "semester" || p.type === "anno")) parts.push("Semestre");
    const n = B.courses().filter((c) => !B.gratisPerTutti(c.slug) && (ps || []).some((p) => p.slug === c.slug) && B.owns(user, c.slug)).length;
    const s = B.courses().filter((c) => !B.owns(user, c.slug) && B.ownsSimulazione(user, c.slug)).length;
    if (!parts.includes("Semestre") && n) parts.push(n + (n === 1 ? " esame" : " esami"));
    if (s) parts.push(s + (s === 1 ? " simulazione" : " simulazioni"));
    return parts.join(" + ") || "Gratuito";
  };
  B.plusItem = (user) => {
    const pr = user ? B.prezzoPlus(user) : B.PRICES.plus, fino = B.fineSessione();
    return { type: "plus", price: pr, label: "UniLink Plus · fino al " + fino.toLocaleDateString("it-IT", { day: "numeric", month: "long" }),
      incl: ["Planner stile TTP su tutti i tuoi esami: piano, calendario, «oggi», ritardi", "Analisi degli errori su tutti gli esami: cause, tempi, capitoli deboli", "«Pronto per l'esame?»: quanto sei pronto per ogni appello", "Ripasso degli errori mescolato tra gli esami", "Una volta per sessione, nessun rinnovo automatico" + (user && B.haPacchetto(user) ? " · prezzo con pacchetto" : "")] };
  };
  B.cancelPlus = (user) => {
    user.activity.plus = Object.assign(user.activity.plus || {}, { active: false, cancelAt: new Date().toISOString() });
    UL.store.addLog(user, "acquisto", "Plus annullato (demo)");
    UL.store.save();
  };

  B.daysTo = (iso) => (iso ? Math.ceil((new Date(iso) - new Date(new Date().toDateString())) / 864e5) : null);

  B.STATUS = { todo: { l: "Da iniziare", c: "st-todo" }, doing: { l: "In preparazione", c: "st-doing" }, done: { l: "Superato", c: "st-done" } };

  // registro aggiornamenti dei materiali (esempio per la demo)
  B.UPDATES = [
    { slug: "statistica", v: "v2.1", d: "Aggiunti esercizi svolti sulla regressione lineare e 15 domande di esercitazione." },
    { slug: "microeconomia", v: "v1.4", d: "Nuovo capitolo di esercizi sul monopolio con soluzioni passo passo." },
    { slug: "economia-aziendale", v: "v1.2", d: "Esempi di scritture di assestamento (ratei e risconti) allineati alla partizione A-B." },
  ];

  B.MENTORS = [
    { id: "m1", n: "Lorenzo B.", r: "III anno EA · 30L in Microeconomia", tags: ["Microeconomia", "Matematica"], rating: 4.9, rev: 31 },
    { id: "m2", n: "Chiara D.", r: "Laureata EA · Erasmus a Rotterdam", tags: ["Erasmus", "Economia Aziendale"], rating: 4.8, rev: 22 },
    { id: "m3", n: "Tommaso G.", r: "MSc Finance · ex rappresentante", tags: ["Statistica", "Magistrali"], rating: 5.0, rev: 14 },
  ];
})();

