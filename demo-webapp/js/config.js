/* js/config.js */
/* UniLink · web app (area personale) — demo v3.
   DESIGN       quello della demo A («Area personale» e versioni B/C/D), riusato così com'è (css/style.css, ui.js, shell.js, auth.js).
   ARCHITETTURA mix delle demo: la parte DECISA viene da A + B (Studio: dashboard, esami, materiali, esercitazioni;
                «Dopo gli esami»: il mio percorso), le proposte DA DECIDERE sono i moduli completi di C (Career) e D (Network),
                attivabili spostando le voci in js/boot.js. Registro delle proposte: js/unilink-dati.js → UL_DA_DECIDERE.
   Caricato PRIMA di store.js: chiavi del database, MODELLO DATI (default di profilo e attività) e testi del login. */
window.UL = window.UL || {};

UL.VERSIONE = { n: 3, data: "2026-10-06", nota: "Design della demo A, architettura mix B/C/D, piano aggiornabile in iscrizione e dopo, «Visualizza come»." };

/* PIANI — prezzi = IPOTESI dall'HQ (5/10/2026): dispensa 12–15 €, semestre 25–30 €, Plus da decidere.
   I numeri servono solo a simulare il checkout. Cambiarli qui li cambia ovunque (B.PRICES punta qui). */
UL.PIANI = {
  prezzi: { exam: 14.99, semester: 29.99, plus: 4.99, mentor: 35 },
  lista: [
    { k: "free", nome: "Gratuito", prezzo: "0 €", sub: "per sempre", incl: ["Schede, partizioni e consigli di ogni esame", "Quiz di prova (5 domande) e ripasso errori", "I miei esami, libretto e voto di laurea", "Erasmus, magistrali e strumenti del sito"] },
    { k: "exam", nome: "Pacchetto esame", prezzo: "14,99 €", sub: "per esame · ipotesi", incl: ["Dispensa completa, mappe, quiz in PDF", "Esercitazioni complete e simulazioni dell'esame", "Aggiornamenti fino a fine anno accademico"] },
    { k: "semester", nome: "Pacchetto semestre", prezzo: "29,99 €", sub: "tutti gli esami del semestre · ipotesi", hot: true, incl: ["Tutti i pacchetti esame del semestre", "Conviene da 3 esami in su", "Gli esami già comprati vengono scalati (da decidere)"] },
    { k: "plus", nome: "UniLink Plus", prezzo: "4,99 €", sub: "al mese · prezzo da decidere", incl: ["Esercitazioni complete su tutti gli esami", "Simulazioni a tempo e ripasso errori ovunque", "Sconto sui mentor", "Si disdice quando vuoi"] },
  ],
};

UL.CONFIG = {
  dbKey: "ul_unilink_v3_db",
  sessionKey: "ul_unilink_v3_session",

  /* MODELLO DATI — ogni utente = { email, role, profile, activity }. store.js fonde questi default nei nuovi utenti.
     [A/B] = parte decisa · [C] = modulo Career (da decidere) · [D] = modulo Network (da decidere). */
  profileDefaults: {
    area: "economia",      // [v3] area di studio: UL_AREE (economia attiva; giurisprudenza/medicina in arrivo)
    ateneo: "unifi",       // [D]  ateneo (oggi solo UniFi attivo)
    corso: "",             // [D]  corso di laurea libero (altri atenei)
    colore: "",            // [v3] colore del cerchio in alto a destra
    headline: "", skills: [], linkedin: "", // [C] profilo talento
  },
  activityDefaults: {
    // [A/B] parte decisa
    exams: [],             // {slug, partizione, appello, obiettivo, status: todo|doing|done, voto}
    purchases: [],         // {id, type: exam|semester|plus|mentor [B] · selfstudy|tutoring|academy|featured [D], label, price, coupon, at}
    quiz: { sessions: [], stats: {} },
    bookings: [],          // {id, mentor, topic, when, price} — Mentor di «Il mio percorso» [B] e Mentor marketplace [C]
    erasmus: { lista: [], check: [] },
    scenari: { media: 27, esamiRestanti: 6 },
    waitlist: {},          // [v3] area in arrivo → risposta alla domanda della lista d'attesa
    cv: [],
    // Plus — UNICO per tutta la app (B.plus e C.isPlus leggono questo campo)
    plus: { active: false, plan: "", since: "", cancelAt: "" },
    // [C] Career
    applications: [], tracks: [], rsvp: [], talent: { visible: false }, referral: { code: "", invited: 0, credits: 0 },
    // [D] Network
    credits: 0, pass: { active: false, since: "" }, uploads: [], tests: { sessions: [], stats: {} },
    courses: [], chapter: "", listings: [], admissions: [], ambassador: "",
  },

  auth: {
    flag: "Demo · UniLink v3",
    title: 'La tua <span class="accent">Area Personale</span> UniLink',
    sub: "Accedi per ritrovare le tue dispense, i tuoi esami e gli strumenti per scegliere. Da studenti, per studenti.",
    regTitle: 'Il tuo spazio, <span class="accent">gratis</span>',
    regSub: "Crei l'account in un minuto, scegli area e piano, e decidi tu se e quando passare a un pacchetto o a Plus.",
    feats: [
      { i: "book", t: "Dispense", d: "Appunti, mappe e quiz per anno e partizione." },
      { i: "quiz", t: "Esercitazioni", d: "Quiz con spiegazioni, simulazioni e ripasso errori." },
      { i: "cap", t: "Il tuo percorso", d: "Libretto, Erasmus, magistrali e mentor." },
      { i: "spark", t: "E presto…", d: "Giurisprudenza e Medicina: lista d'attesa aperta." },
    ],
  },
};
