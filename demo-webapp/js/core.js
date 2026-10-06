/* js/core.js — MOTORE DELLA PARTE DECISA (dalla demo Versione B «Esami»): UL.B
   Pacchetti esame/semestre, checkout simulato, esercitazioni (stat, errori, progresso), metriche, Plus.
   Plus: UN SOLO campo per tutta la app → activity.plus {active, plan, since, cancelAt} (stesso del modulo Career, C.isPlus).
   Prezzi: UL.PIANI.prezzi in config.js (ipotesi HQ). */
(function () {
  const UL = window.UL;
  const B = (UL.B = {});

  // prezzi da testare (ipotesi della conversazione: pacchetto esame €19–29, semestre €49–69)
  B.PRICES = UL.PIANI.prezzi; // ipotesi: config.js
  B.COUPONS = { BENVENUTO10: 0.1, MATRICOLA20: 0.2 };
  B.FEE = { pct: 0.015, fixed: 0.25 }; // commissione di pagamento ipotetica

  B.courses = () => (window.UL_DISPENSE || []).filter((d) => !d.soon);
  B.course = (slug) => (window.UL_DISPENSE || []).find((d) => d.slug === slug);
  B.hasQuiz = (slug) => !!(window.UL_QUIZ || {})[slug];
  B.questions = (slug) => (window.UL_QUIZ || {})[slug] || [];
  B.eur = (n) => {
    const v = Math.round(Math.abs(Number(n)) * 100) / 100;
    const [i, d] = v.toFixed(v % 1 ? 2 : 0).split(".");
    return (Number(n) < 0 ? "−" : "") + "€" + i.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (d ? "," + d : "");
  };

  B.semesterCourses = (cds, anno, sem) => B.courses().filter((d) => d.anno === Number(anno) && d.sem === Number(sem) && (!cds || d.cds.includes(cds)));

  B.owns = (user, slug) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    const c = B.course(slug);
    return (user.activity.purchases || []).some((p) =>
      (p.type === "exam" && p.slug === slug) ||
      (p.type === "semester" && c && c.anno === p.anno && c.sem === p.sem && (!p.cds || c.cds.includes(p.cds))));
  };

  B.buy = (user, item, coupon) => {
    const disc = B.COUPONS[(coupon || "").toUpperCase()] || 0;
    const price = Math.round(item.price * (1 - disc) * 100) / 100;
    const p = Object.assign({ id: "o" + Date.now().toString(36), at: new Date().toISOString(), coupon: disc ? coupon.toUpperCase() : "" }, item, { price, listPrice: item.price });
    user.activity.purchases.push(p);
    UL.store.addLog(user, "acquisto", `Acquisto — ${item.label} (${B.eur(price)})`);
    if (item.type === "plus") user.activity.plus = { active: true, plan: "mensile", since: p.at, cancelAt: "" };
    if (item.type === "exam" && !user.activity.exams.some((e) => e.slug === item.slug)) user.activity.exams.push({ slug: item.slug, partizione: "", appello: "", obiettivo: "", status: "doing" });
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
  const MK = "ul_unilink_v3_metrics";
  B.metrics = () => { try { return JSON.parse(localStorage.getItem(MK) || "{}"); } catch (e) { return {}; } };
  B.track = (k, slug) => {
    try {
      const m = B.metrics();
      m[k] = (m[k] || 0) + 1;
      if (slug) { m.bySlug = m.bySlug || {}; m.bySlug[slug] = m.bySlug[slug] || {}; m.bySlug[slug][k] = (m.bySlug[slug][k] || 0) + 1; }
      localStorage.setItem(MK, JSON.stringify(m));
    } catch (e) { /* storage non disponibile */ }
  };


  /* ---------- estensioni UniLink v3 ---------- */
  B.plus = (user) => !!(user && (user.role === "admin" || (user.activity.plus && user.activity.plus.active)));
  // materiali (PDF): solo con l'acquisto dell'esame o del semestre. Esercitazioni: anche con Plus.
  B.ownsPractice = (user, slug) => B.plus(user) || B.owns(user, slug);
  B.planName = (user) => {
    if (!user) return "";
    if (user.role === "admin") return "Team";
    const ps = user.activity.purchases || [];
    const parts = [];
    if (B.plus(user)) parts.push("Plus");
    if (ps.some((p) => p.type === "semester")) parts.push("Semestre");
    else if (ps.some((p) => p.type === "exam")) parts.push(ps.filter((p) => p.type === "exam").length + (ps.filter((p) => p.type === "exam").length === 1 ? " pacchetto" : " pacchetti"));
    return parts.join(" + ") || "Gratuito";
  };
  B.plusItem = () => ({ type: "plus", price: B.PRICES.plus, label: "UniLink Plus · mensile", incl: UL.PIANI.lista.find((p) => p.k === "plus").incl });
  B.cancelPlus = (user) => {
    user.activity.plus = Object.assign(user.activity.plus || {}, { active: false, cancelAt: new Date().toISOString() });
    UL.store.addLog(user, "acquisto", "Plus disdetto");
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

