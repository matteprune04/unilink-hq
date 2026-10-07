/* js/config.js */
/* UniLink · web app (area personale) — demo v4.
   DESIGN       quello della demo A («Area personale» e versioni B/C/D), riusato così com'è (css/style.css, ui.js, shell.js, auth.js).
   ARCHITETTURA mix delle demo: la parte DECISA viene da A + B (Studio: dashboard, esami, materiali, esercitazioni;
                «Dopo gli esami»: il mio percorso), le proposte DA DECIDERE sono i moduli completi di C (Career) e D (Network),
                attivabili spostando le voci in js/boot.js. Registro delle proposte: js/unilink-dati.js → UL_DA_DECIDERE.
   Caricato PRIMA di store.js: chiavi del database, MODELLO DATI (default di profilo e attività) e testi del login. */
window.UL = window.UL || {};

UL.VERSIONE = { n: 6, data: "2026-10-07", nota: "Pagamento con Stripe Checkout (simulato): carta, Apple Pay, Google Pay, Klarna; sblocco dopo il webhook; netto dopo Stripe nelle metriche. Prima, v5: Commenti del 7/10: Croogla 4F ovunque, login con foto di Novoli sotto il blu, nuova sezione Community (Aula studio P1 e Mentor e ambassador, promossi dai moduli C e D), moduli C e D solo come card nelle proposte, commenti scaricati archiviati e condivisi nell'HQ." };

/* PIANI — proposta P2 (7/10/2026), uguale alla landing v5 (demo-landing/config.js → listino). Prezzi NON decisi.
   Fuori sessione costa meno; i pacchetti costano uguale tutto l'anno. Cambiarli qui li cambia ovunque (B.PRICES punta qui).
   Regola della Completa: 12,99 € dove ci sono le mappe, 9,99 € dove ci sono appunti e quiz; solo Appunti se c'è solo quello. */
UL.PIANI = {
  stato: "Proposta P2 · prezzi non decisi",
  prezzi: { appunti: [4.99, 9.99], completa: [12.99, 18.99], completaSenzaMappe: [9.99, 14.99], semester: 29.99, anno: 49.99, plus: 14.99, plusConPacchetto: 4.99, mentor: 20 },
  // mesi di sessione (Economia UniFi: invernale gen–feb, estiva giu–lug, autunnale set). Indice 0 = gennaio.
  sessione: [1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0],
  // fine della sessione in corso o della prossima: fino a quando vale Plus (una tantum)
  fineSessioni: ["02-28", "07-31", "09-30"],
  // account gratuito: 1 Appunti a scelta tra questi 3 (uno per anno) + 1 in regalo quando un amico invitato conferma l'email
  gratis: { scelta: ["microeconomia", "macroeconomia", "finanza-aziendale"], regaloInvito: 1,
    testo: "Con l'account gratis scegli 1 Appunti tra 3 esami (uno per anno), e un altro in regalo quando un amico invitato conferma l'email." },
  lista: [
    { k: "free", nome: "Gratuito", tipo: "Account", prezzo: "0 €", sub: "per sempre", d: "Schede degli esami, quiz di prova, libretto e strumenti. 1 Appunti a scelta in regalo." },
    { k: "appunti", prezzo: "4,99 € · in sessione 9,99 €", nome: "Appunti", tipo: "Singolo esame", d: "Gli appunti completi di un esame, da tenere." },
    { k: "completa", prezzo: "12,99 € · in sessione 18,99 €", nome: "Dispensa completa", tipo: "Singolo esame", d: "Tutto per un esame. Senza mappe: 9,99 €." },
    { k: "semester", prezzo: "29,99 €", nome: "Pacchetto semestre", tipo: "Pacchetto", d: "Tutte le dispense complete del tuo semestre.", hot: true },
    { k: "anno", prezzo: "49,99 €", nome: "Pacchetto anno", tipo: "Pacchetto", d: "I due semestri, un solo acquisto." },
    { k: "plus", prezzo: "14,99 € una tantum", nome: "UniLink Plus", tipo: "Il metodo", d: "Planner personalizzato su tutti gli esami. Una volta per sessione." },
  ],
  // «Cosa c'è dentro»: colonne Gratuito · Appunti · Completa · Semestre · Anno · Plus. 1 sì, 0 no, testo = condizione.
  dentro: [
    ["Per tutti", [
      ["Schede, partizioni e informazioni utili", 1, 1, 1, 1, 1, 1],
      ["Quiz di prova (5 domande)", 1, 1, 1, 1, 1, 1],
      ["I miei esami, libretto, voto di laurea, Guida", 1, 1, 1, 1, 1, 1],
      ["Metodo standard del Planner e «Ci stai nei tempi?»", 1, 1, 1, 1, 1, 1],
    ]],
    ["Materiali", [
      ["Appunti / Sbobine (PDF con filigrana)", "1 a scelta", 1, 1, 1, 1, 0],
      ["Mappe per ripassare", 0, 0, "dove ci sono", "dove ci sono", "dove ci sono", 0],
      ["Quiz e simulazioni dell'appello", 0, 0, 1, 1, 1, 0],
      ["Esami inclusi", "—", "1", "1", "3–4 del semestre", "tutto l'anno", "—"],
    ]],
    ["Il metodo", [
      ["UniLink Planner: piano personale (percorso, missioni, calendario)", 0, 0, "per quell'esame", "esami del semestre", "esami dell'anno", "tutti gli esami"],
      ["Ripasso del registro errori su tutti gli esami", 0, 0, 0, 0, 0, 1],
      ["CV benchmark completo", 0, 0, 0, 0, 0, 1],
    ]],
  ],
};

UL.CONFIG = {
  dbKey: "ul_unilink_v4_db",
  sessionKey: "ul_unilink_v4_session",

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
    purchases: [],         // {id, type: appunti|completa|semester|anno|plus|gratis|mentor [B] · selfstudy|tutoring|academy|featured [D], label, price, coupon, at}
    quiz: { sessions: [], stats: {} },
    bookings: [],          // {id, mentor, topic, when, price} — Mentor di «Il mio percorso» [B] e Mentor marketplace [C]
    erasmus: { lista: [], check: [] },
    scenari: { media: 27, esamiRestanti: 6 },
    waitlist: {},          // [v3] area in arrivo → risposta alla domanda della lista d'attesa
    cv: [],
    // Plus — UNICO per tutta la app (B.plus e C.isPlus leggono questo campo)
    plus: { active: false, plan: "", since: "", cancelAt: "" },
    // [v4] UniLink Planner (P3, solo Plus): un piano per esame, calcolato una volta alla creazione
    planner: {},           // slug → { fascia, appello, giorni[0-6], ore, margine, creato, sessioni: [{ fase, cap, tipo, data, fatto, esito, errori }] }
    // [C] Career
    applications: [], tracks: [], rsvp: [], talent: { visible: false }, referral: { code: "", invited: 0, credits: 0 },
    // [D] Network
    credits: 0, pass: { active: false, since: "" }, uploads: [], tests: { sessions: [], stats: {} },
    courses: [], chapter: "", listings: [], admissions: [], ambassador: "",
  },

  auth: {
    flag: "Demo · UniLink v6",
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
