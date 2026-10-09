/* js/seed.js */
/* Account demo (fittizi): uno per ogni TIPOLOGIA da visualizzare (piano × area × modulo).
   UL.DEMO = tipologie mostrate nel login e in «Visualizza come». UL.SEED = utenti creati al primo avvio.
   Per aggiungere una tipologia: una riga in UL.DEMO + un utente in UL.SEED con la stessa email. */
(function () {
  const UL = window.UL;
  const ago = (d, h = 10) => new Date(Date.now() - d * 864e5 - h * 36e5).toISOString();
  const inDays = (d) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);
  const PW = "UniLink2026!";

  UL.DEMO = [
    { k: "free", label: "Gratuito", desc: "Economia · I anno · Simulazione di Microeconomia", icon: "user", email: "giulia.rossi@stud.unifi.it", password: PW },
    { k: "completa", label: "Dispensa completa", desc: "Economia · I anno · Completa di Microeconomia", icon: "book", email: "marco.bianchi@stud.unifi.it", password: PW },
    { k: "semester", label: "Pacchetto semestre", desc: "Economia · I anno, II semestre", icon: "layers", email: "sara.neri@stud.unifi.it", password: PW },
    { k: "plus", label: "Plus", desc: "Economia · III anno · Planner attivo · dati Career", icon: "spark", email: "luca.conti@stud.unifi.it", password: PW },
    { k: "arrivo", label: "Area in arrivo", desc: "Giurisprudenza · lista d'attesa", icon: "clock", email: "elena.ricci@stud.unifi.it", password: PW },
    { k: "network", label: "Altro ateneo", desc: "Economia · UniPi · dati del modulo Network (Pass)", icon: "globe", email: "martina.conti@studenti.unipi.it", password: PW },
    { k: "admin", label: "Admin", desc: "Team UniLink · metriche", icon: "shield", email: "admin@unilinkfirenze.it", password: "AdminDemo!2026" },
  ];

  const dstats = (rows) => Object.fromEntries(rows.map(([q, seen, ok, last]) => [q, { seen, ok, last }])); // formato del modulo Network
  const stats = (rows) => Object.fromEntries(rows.map(([q, seen, wrong, streak]) => [q, { seen, wrong, streak, last: ago(2) }]));
  const P = (type, extra, price, days) => Object.assign({ id: "o" + Math.random().toString(36).slice(2, 8), type, price, listPrice: price, coupon: "", at: ago(days) }, extra);
  const nome = (slug) => ((window.UL_DISPENSE || []).find((d) => d.slug === slug) || {}).title;
  const exam = (slug) => ({ type: "completa", slug, label: "Dispensa completa · " + nome(slug) });
  const simulazione = (slug) => ({ type: "simulazione", slug, label: "Simulazione d'esame · " + nome(slug) });
  const sem = (anno, s, cds) => ({ type: "semester", anno, sem: s, cds, esami: (window.UL_DISPENSE || []).filter((d) => d.anno === anno && d.sem === s && !d.soon && (!window.UL_PERCORSI || !d.code || window.UL_PERCORSI.include(d.code, cds, ""))).slice(0, 4).map((d) => d.slug), label: `Pacchetto semestre · ${["", "I", "II", "III"][anno]} anno, ${s === 1 ? "I" : "II"} semestre ${cds}` });
  const PR = UL.PIANI.prezzi;

  const person = (email, nome, cognome, profile, activity, days) => ({
    email, password: PW, createdAt: ago(days), lastLogin: ago(Math.max(0, days - 3)),
    profile: Object.assign({ nome, cognome, citta: "Firenze" }, profile), activity,
  });

  UL.SEED = [
    { email: "admin@unilinkfirenze.it", password: "AdminDemo!2026", role: "admin", createdAt: ago(200), profile: { nome: "Team", cognome: "UniLink", cds: "EA", anno: "3", area: "economia", colore: "#172554" } },

    person("giulia.rossi@stud.unifi.it", "Giulia", "Rossi", { cds: "EA", anno: "1", area: "economia", colore: "#cf7527" }, {
      exams: [
        { slug: "microeconomia", partizione: "", appello: inDays(28), obiettivo: "28", status: "doing" },
        { slug: "statistica", partizione: "", appello: inDays(42), obiettivo: "27", status: "doing" },
        { slug: "economia-aziendale", status: "done", voto: 27 },
        { slug: "diritto-pubblico", partizione: "", appello: inDays(-1), obiettivo: "26", status: "doing" }, // v9: appello di ieri → «Com'è andato l'esame?»
      ],
      purchases: [P("simulazione", simulazione("microeconomia"), PR.simulazione[0], 10)],
      referral: { code: "GIULIA-3F8", invited: 1, confirmed: 0, credits: 0 },
      quiz: { stats: stats([["mi01", 1, 0, 1], ["mi02", 1, 1, 0], ["mi03", 1, 1, 0], ["mi04", 1, 0, 1], ["mi05", 1, 0, 1]]), sessions: [{ slug: "microeconomia", mode: "prova", modeLabel: "Quiz di prova", n: 5, correct: 3, dur: 160, at: ago(1), topics: {} }] },
    }, 12),

    person("marco.bianchi@stud.unifi.it", "Marco", "Bianchi", { cds: "EC", anno: "1", area: "economia", colore: "#172554" }, {
      exams: [{ slug: "microeconomia", appello: inDays(28), obiettivo: "26", status: "doing" }, { slug: "statistica", appello: inDays(42), obiettivo: "", status: "todo" }],
      purchases: [P("completa", exam("microeconomia"), PR.completa[0], 9)],
      quiz: { stats: stats([["mi01", 2, 0, 2], ["mi02", 2, 1, 1], ["mi03", 2, 2, 0], ["mi06", 1, 1, 0], ["mi09", 2, 1, 0]]),
        sessions: [{ slug: "microeconomia", mode: "rapido", modeLabel: "Quiz rapido", n: 10, correct: 6, dur: 412, at: ago(2), topics: {} }] },
    }, 20),

    person("sara.neri@stud.unifi.it", "Sara", "Neri", { cds: "EA", anno: "1", area: "economia", colore: "#1a453c" }, {
      exams: [
        { slug: "microeconomia", appello: inDays(19), obiettivo: "28", status: "doing" },
        { slug: "statistica", appello: inDays(33), obiettivo: "27", status: "doing" },
        { slug: "economia-aziendale", status: "done", voto: 27 },
      ],
      purchases: [P("semester", sem(1, 2, "EA"), PR.semestre[3][0], 14)],
      quiz: {
        stats: stats([["mi01", 2, 0, 2], ["mi02", 2, 1, 1], ["mi03", 2, 2, 0], ["mi04", 1, 0, 1], ["mi05", 2, 1, 0], ["mi11", 2, 2, 0], ["st01", 1, 0, 1], ["st03", 1, 1, 0], ["st04", 1, 1, 0]]),
        sessions: [
          { slug: "microeconomia", mode: "simulazione", modeLabel: "Simulazione d'esame", n: 12, correct: 8, dur: 1010, at: ago(3), topics: {} },
          { slug: "statistica", mode: "rapido", modeLabel: "Quiz rapido", n: 10, correct: 7, dur: 300, at: ago(5), topics: {} },
        ],
      },
    }, 30),

    person("luca.conti@stud.unifi.it", "Luca", "Conti", {
      cds: "EC", anno: "3", area: "economia", colore: "#7a4fa0", inglese: "C1", certInglese: "IELTS", dopoLaurea: "msc-estero", erasmus: "candidatura",
      headline: "Studente di Economia e Commercio orientato a corporate finance", skills: ["Excel", "Bilancio", "Valutazione d'azienda", "Inglese C1"],
      areeProf: ["Corporate Finance / FP&A", "Finance / IB / PE"], extracurricolari: "Team eventi UniLink",
      esami: [
        { id: "e1", slug: "economia-aziendale", nome: "Economia Aziendale", cfu: 9, voto: 30, lode: true, data: "2024-02-10" },
        { id: "e2", slug: "microeconomia", nome: "Microeconomia", cfu: 9, voto: 29, data: "2024-06-20" },
        { id: "e3", slug: "statistica", nome: "Statistica", cfu: 9, voto: 28, data: "2024-07-05" },
        { id: "e4", slug: "macroeconomia", nome: "Macroeconomia", cfu: 9, voto: 30, data: "2025-01-28" },
        { id: "e5", slug: "matematica-finanziaria", nome: "Matematica Finanziaria", cfu: 6, voto: 28, data: "2025-06-18" },
      ],
    }, {
      plus: { active: true, plan: "sessione", since: ago(12), until: "2027-02-28T23:59:00", cancelAt: "" },
      // [v4] UniLink Planner: piano generato al primo accesso (fatte = sessioni già completate)
      planner: { "finanza-aziendale": { fascia: "ottimo", appello: inDays(56), giorni: [1, 2, 3, 4, 5, 6], ore: 2.5, margine: 0.18, creato: ago(12), fatte: 22 } },
      // [C] Career
      tracks: [{ id: "fin", at: ago(20), done: [0, 1] }], talent: { visible: true }, rsvp: ["e2"],
      applications: [{ id: "a1", job: "j1", st: "colloquio", at: ago(6) }, { id: "a2", job: "j6", st: "inviata", at: ago(2) }],
      referral: { code: "LUCA-7K2", invited: 2, credits: 1 },
      purchases: [P("plus", { label: "UniLink Plus · fino al 28 febbraio" }, PR.plus, 12)],
      exams: [{ slug: "finanza-aziendale", appello: inDays(56), obiettivo: "30", status: "doing" }],
      erasmus: { lista: [{ u: "Erasmus University Rotterdam", p: "Paesi Bassi", note: "Finance" }], check: ["bando", "dest"] },
      cv: ["cv1", "cv2"],
    }, 300),

    person("elena.ricci@stud.unifi.it", "Elena", "Ricci", { cds: "", anno: "1", area: "giurisprudenza", colore: "#2f4a8a" }, {
      waitlist: { giurisprudenza: "I anno" },
    }, 4),

    // [D] Network: studentessa di un altro ateneo (dati della demo D)
    person("martina.conti@studenti.unipi.it", "Martina", "Conti", { ateneo: "unipi", corso: "Banca, Finanza e Mercati Finanziari", cds: "", anno: "2", area: "economia", colore: "#0f5f6b", citta: "Pisa" }, {
      credits: 140, pass: { active: true, since: ago(40) }, chapter: "unipi",
      uploads: [{ id: "u1", uni: "unipi", cds: "Banca, Finanza e Mercati Finanziari", anno: 2, title: "Matematica finanziaria — esercizi d'esame", pages: 33, status: "pending", at: ago(1) }],
      tests: { stats: dstats([["t01", 2, 2, true], ["t02", 1, 1, true], ["t03", 1, 0, false], ["t06", 2, 1, true], ["t07", 1, 0, false], ["t11", 1, 1, true]]),
        sessions: [{ test: "tolc", mode: "diagnostico", n: 10, correct: 7, dur: 540, at: ago(12) }, { test: "msc", mode: "simulazione", n: 16, correct: 11, dur: 1300, at: ago(4) }] },
      courses: [{ id: "a1", done: 5 }], purchases: [{ id: "o1", type: "academy", ref: "a1", label: "Academy: Excel per la finanza", price: 39, at: ago(20) }],
      rsvp: ["ev1", "ev3"],
    }, 60),

    // altri studenti (solo per le metriche dell'admin)
    person("davide.lombardi@stud.unifi.it", "Davide", "Lombardi", { cds: "EC", anno: "1", area: "economia" }, { exams: [{ slug: "microeconomia", status: "todo" }] }, 6),
    person("giorgia.ferri@stud.unifi.it", "Giorgia", "Ferri", { cds: "EA", anno: "1", area: "economia" }, { purchases: [P("semester", sem(1, 2, "EA"), PR.semestre[3][0], 20)] }, 40),
    person("alice.costa@stud.unifi.it", "Alice", "Costa", { cds: "EA", anno: "1", area: "economia" }, { purchases: [P("completa", exam("statistica"), PR.completa[0], 50)] }, 60),
    person("bianca.romani@stud.unifi.it", "Bianca", "Romani", { cds: "EA", anno: "3", area: "economia", inglese: "C2", gmat: "655", headline: "Data & strategy", skills: ["Python", "SQL", "Excel"], areeProf: ["Data / Analytics"] },
      { plus: { active: true, plan: "sessione", since: ago(50), until: "2027-02-28T23:59:00", cancelAt: "" }, tracks: [{ id: "msc", at: ago(25), done: [0, 1, 2] }], talent: { visible: true }, applications: [{ id: "a3", job: "j5", st: "offerta", at: ago(15) }] }, 90),
    person("alessandro.valli@studbocconi.it", "Alessandro", "Valli", { ateneo: "bocconi", corso: "CLEF", cds: "", anno: "3", area: "economia" },
      { chapter: "bocconi", credits: 60, purchases: [{ id: "o2", type: "tutoring", ref: "complete", label: "Tutoring Complete (10 ore)", price: 279, at: ago(15) }], admissions: [{ from: "bocconi", cds: "CLEF", media: 27.5, test: "Test Bocconi", pid: "p20", esito: "ammesso", anno: 2026 }] }, 45),
    person("sofia.re@studio.unibo.it", "Sofia", "Re", { ateneo: "unibo", corso: "Economia e Commercio", cds: "", anno: "1", area: "economia" },
      { ambassador: "inviata", uploads: [{ id: "u3", uni: "unibo", cds: "Economia e Commercio", anno: 1, title: "Microeconomia — esercizi", pages: 28, status: "pending", at: ago(3) }] }, 4),
    person("noemi.greco@stud.unifi.it", "Noemi", "Greco", { cds: "", anno: "1", area: "medicina" }, { waitlist: { medicina: "Sì, sono nel semestre filtro" } }, 2),
  ];

  try {
    if (!localStorage.getItem("ul_unilink_v4_metrics")) {
      localStorage.setItem("ul_unilink_v4_metrics", JSON.stringify({ visita: 14, prova: 9, registrazione: 0, acquisto: 0, bySlug: { microeconomia: { visita: 6, prova: 4 }, statistica: { visita: 5, prova: 3 }, "economia-aziendale": { visita: 3, prova: 2 } } }));
    }
  } catch (e) { /* noop */ }
})();
