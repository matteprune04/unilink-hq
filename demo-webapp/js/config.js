/* js/config.js */
/* UniLink · web app (area personale) — demo v4.
   DESIGN       quello della demo A («Area personale» e versioni B/C/D), riusato così com'è (css/style.css, ui.js, shell.js, auth.js).
   ARCHITETTURA mix delle demo: la parte DECISA viene da A + B (Studio: dashboard, esami, materiali, esercitazioni;
                «Dopo gli esami»: il mio percorso), le proposte DA DECIDERE sono i moduli completi di C (Career) e D (Network),
                attivabili spostando le voci in js/boot.js. Registro delle proposte: js/unilink-dati.js → UL_DA_DECIDERE.
   Caricato PRIMA di store.js: chiavi del database, MODELLO DATI (default di profilo e attività) e testi del login. */
window.UL = window.UL || {};

UL.VERSIONE = { n: 18, data: "2026-10-09", nota: "v18, audit UX: Planner fuori da menu e strumenti (una riga in dashboard, chiudibile); menu Dashboard · I miei esami · Strumenti · Catalogo · Profilo, barra in basso sul telefono con gli stessi; pagina esame a quattro schede (Panoramica · Dispensa con il programma per capitoli · Allenati con domande, carte di oggi, errori e simulazione se esiste · Note) e gli «in arrivo» in una riga; primo accesso che finisce aprendo la dispensa; niente prezzi nelle liste; dubbi aperti al posto del riquadro aggiornamenti vuoto; catalogo senza «Le mie dispense», ordini nel profilo; lettore sul telefono con «Larghezza» e menu «⋯». Prima, v17: nuovo logo (libro aperto + persona, testa più bassa), con favicon e icona per il telefono. Prima, v16: Magistrali e master più semplice: quattro domande (cosa ti piace, dove, lingua, quanto spendere), sei consigliati con logo, immagine della città e il perché, le parole da sapere, l'elenco completo solo se lo chiedi; aggiunte le 7 magistrali della Scuola di Economia UniFi (anche in italiano). Prima, v15: «Che media mi serve?» diventa il passo 4 di «Quanto prendo alla laurea?» (Voglio arrivare a…); nuovo strumento «Magistrali e master» (163 programmi, filtri per area professionale, paese, classificazione, durata, CEMS, salvati); confronto fianco a fianco fino a 3, per magistrali e mete Erasmus. Prima, v14, strumenti completi (come quelli del sito attuale, con la grafica nuova): Quanto prendo alla laurea? con bonus e simulazione dei prossimi esami; Che media mi serve? con obiettivo di media o di voto di laurea; Erasmus: punteggio e 140 mete con la media dell'ultima graduatoria, filtri e mete salvate. Passi numerati a sinistra, risultato sempre visibile a destra (sul telefono in basso). Prima, v13, studio (idee ChatGPT + Claude): card «Riprendi» con un solo pulsante in cima all'esame; «A che punto sei» con quattro misure separate e una frase sul capitolo debole al posto di «pronto al 72%»; «Mappa del corso» diventa «Programma e progressi», con Leggi · Carte · Domande per ogni capitolo; nel lettore capitolo corrente, proposta di 5 domande a fine capitolo, ricerca nel testo, flashcard dalla frase selezionata con capitolo e pagina, etichette sulle note (Non ho capito, Da ricordare, Da chiedere, Esempio utile), preferenze ricordate; dopo un errore «Rileggi nella dispensa»; nelle flashcard «Apri il passaggio originale»; Note filtrabili, con i dubbi da segnare come risolti. Prima, v12, commenti del 8/10 (Microeconomia, Strumenti): lettore con PDF a sinistra e note sempre a destra, zoom chiaro (− % + · Pagina / Larghezza), seleziona una frase → evidenzia o commenta, a schermo intero le note restano in un riquadro che si sposta; Strumenti uguali alla landing (tessere con illustrazione, testata con domanda ed esempio). Prima, v11, commenti del 8/10 (Diritto Pubblico): primo accesso senza ateneo, esami per anno a scomparsa con aggiunta manuale, piano consigliato dagli esami scelti, «Il primo esame» al posto di «Ritmo e avvisi»; una scala sola di grandezze; lettore a pagina intera con indice, segnalibri, schermo intero, frecce e timer. Prima, v10: I miei esami diviso in «pronti da studiare», «da sbloccare», «superati» con cosa ottieni per ogni piano; flashcard stile Anki (mazzi e ripasso a pagina intera); esercizi in tre scelte; mappa essenziale; dispensa e note proporzionate; «pronto per l'esame?»; Planner personale solo con Plus (D51); barra in alto senza link; Catalogo vicino ad Abbonamento; strumenti partono dal libretto, «Ci stai nei tempi?» nel Planner. Prima, v9: libretto, questionario dopo l'esame." };

/* PIANI — decisi nel meeting del 7/10/2026 (HQ → Decisioni «MEETING 7/10»), uguali alla landing v8 (demo-landing/config.js → listino).
   Prezzi comunicati come SCONTO DI LANCIO: [prezzo di lancio, prezzo pieno barrato]. Niente prezzi «in sessione / fuori sessione».
   Niente Appunti singoli e niente Pacchetto anno (archiviati). Plus è in stand-by: si vende a parte (14,99) o con un pacchetto (7,99).
   Il pacchetto semestre costa in base a quanti esami ha il semestre del TUO percorso (corso + curriculum, js/percorsi.js):
   3 esami 29,99 € · 4 esami 34,99 €; se il semestre ne ha più di 4 ne scegli 4; con 2 o meno conviene comprare le singole.
   Le dispense NON si scaricano: si leggono e si annotano solo qui (lettore, js/views/lettore.js). Cambiarli qui li cambia ovunque. */
UL.PIANI = {
  stato: "Prezzi di lancio · decisi il 7/10",
  prezzi: { simulazione: [5.99, 9.99], completa: [12.99, 18.99], semestre: { 3: [29.99, 39.99], 4: [34.99, 44.99] }, plus: 14.99, plusConPacchetto: 7.99 },
  maxEsamiPacchetto: 4,
  // fine della sessione in corso o della prossima: fino a quando vale Plus (una tantum)
  fineSessioni: ["02-28", "07-31", "09-30"],
  // gratis per tutti, come esempio dell'offerta: la dispensa completa di Economia Aziendale (I anno)
  gratis: { esame: "economia-aziendale",
    testo: "Gratis per tutti: schede degli esami, quiz di prova, strumenti e la dispensa completa di Economia Aziendale (I anno), per vedere com'è fatta prima di comprare." },
  lista: [
    { k: "free", nome: "Gratuito", tipo: "Account", prezzo: "0 €", sub: "per sempre", d: "Schede, quiz di prova, libretto e strumenti. Economia Aziendale completa, gratis." },
    { k: "simulazione", prezzo: "5,99 € · invece di 9,99 €", nome: "Simulazione d'esame", tipo: "Singolo esame", d: "Una prova nel formato dell'appello, con correzione e spiegazioni." },
    { k: "completa", prezzo: "12,99 € · invece di 18,99 €", nome: "Dispensa completa", tipo: "Singolo esame", d: "Tutto per un esame: dispensa, quiz e simulazioni, da leggere e annotare qui." },
    { k: "semester", prezzo: "29,99 € o 34,99 €", nome: "Pacchetto semestre", tipo: "Pacchetto", d: "Le dispense complete del semestre del tuo percorso: 3 esami 29,99 €, 4 esami 34,99 €.", hot: true },
    { k: "plus", prezzo: "14,99 € · 7,99 € con un pacchetto", nome: "UniLink Plus", tipo: "Il coach", d: "Planner stile TTP su tutti gli esami, analisi degli errori, «pronto per l'esame?». Una volta per sessione." },
  ],
  // «Cosa c'è dentro»: colonne Gratuito · Simulazione · Completa · Semestre · Plus. 1 sì, 0 no, testo = condizione.
  dentro: [
    ["Per tutti", [
      ["Schede, partizioni e informazioni utili", 1, 1, 1, 1, 1],
      ["Quiz di prova (5 domande)", 1, 1, 1, 1, 1],
      ["Economia Aziendale completa", 1, 1, 1, 1, 1],
      ["I miei esami, libretto e voto di laurea", 1, 1, 1, 1, 1],
    ]],
    ["Materiali · da leggere e annotare nell'app", [
      ["Dispensa completa (appunti e sbobine)", 0, 0, 1, 1, 0],
      ["Quiz per argomento e quiz rapido", 0, 0, 1, 1, 0],
      ["Simulazione d'esame con correzione", 0, "1 esame", 1, 1, 0],
      ["Esami inclusi", "—", "1", "1", "3 o 4 del tuo percorso", "—"],
      ["Aggiornamenti della stessa edizione", 0, 1, 1, 1, 0],
    ]],
    ["Il metodo", [
      ["Giudizio «ci stai nei tempi?» e metodo standard", 1, 1, 1, 1, 1],
      ["Planner stile TTP: piano personale, calendario, «oggi»", 0, 0, 0, 0, "tutti gli esami"],
      ["Analisi degli errori e «pronto per l'esame?»", 0, 0, "per quell'esame", "esami del pacchetto", "tutti gli esami"],
      ["Ripasso degli errori mescolato tra gli esami", 0, 0, 0, 0, 1],
    ]],
  ],
};

UL.CONFIG = {
  dbKey: "ul_unilink_v9_db"   /* v9: nuovo seed (appello passato per il questionario) */,
  sessionKey: "ul_unilink_v9_session",

  /* MODELLO DATI — ogni utente = { email, role, profile, activity }. store.js fonde questi default nei nuovi utenti.
     [A/B] = parte decisa · [C] = modulo Career (da decidere) · [D] = modulo Network (da decidere). */
  profileDefaults: {
    area: "economia",      // [v3] area di studio: UL_AREE (economia attiva; giurisprudenza/medicina in arrivo)
    ateneo: "unifi",       // [D]  ateneo (oggi solo UniFi attivo)
    corso: "",             // [D]  corso di laurea libero (altri atenei)
    curriculum: "",        // [v7] curriculum (E94/E95 per EA, F011/F013/F084 per EC): serve per il pacchetto semestre
    colore: "",            // [v3] colore del cerchio in alto a destra
    headline: "", skills: [], linkedin: "", // [C] profilo talento
  },
  activityDefaults: {
    // [A/B] parte decisa
    exams: [],             // {slug, partizione, appello, obiettivo, status: todo|doing|done, voto}
    purchases: [],         // {id, type: simulazione|completa|semester|plus [v7] · appunti|anno|gratis|mentor = archiviati [B] · selfstudy|tutoring|academy|featured [D], label, price, coupon, at}
    quiz: { sessions: [], stats: {} },
    bookings: [],          // {id, mentor, topic, when, price} — Mentor di «Il mio percorso» [B] e Mentor marketplace [C]
    erasmus: { lista: [], check: [] },
    scenari: { media: 27, esamiRestanti: 6 },
    waitlist: {},          // [v3] area in arrivo → risposta alla domanda della lista d'attesa
    cv: [],
    // Plus — UNICO per tutta la app (B.plus e C.isPlus leggono questo campo)
    plus: { active: false, plan: "", since: "", cancelAt: "" },
    note: {},              // [v7] annotazioni del lettore: slug → { pagina: [{ id, testo, at }] }
    letture: {},           // [v7] lettore: slug → ultima pagina aperta
    // [v4] UniLink Planner (P3, solo Plus): un piano per esame, calcolato una volta alla creazione
    planner: {},           // slug → { fascia, appello, giorni[0-6], ore, margine, creato, sessioni: [{ fase, cap, tipo, data, fatto, esito, errori }] }
    // [C] Career
    applications: [], tracks: [], rsvp: [], talent: { visible: false }, referral: { code: "", invited: 0, credits: 0 },
    // [D] Network
    credits: 0, pass: { active: false, since: "" }, uploads: [], tests: { sessions: [], stats: {} },
    courses: [], chapter: "", listings: [], admissions: [], ambassador: "",
  },

  auth: {
    flag: "Demo · UniLink v12",
    title: 'La tua <span class="accent">Area Personale</span> UniLink',
    sub: "Accedi per ritrovare le tue dispense, i tuoi esami e gli strumenti per scegliere. Da studenti, per studenti.",
    regTitle: 'Il tuo spazio, <span class="accent">gratis</span>',
    regSub: "Crei l'account in un minuto, scegli area e piano, e decidi tu se e quando passare a un pacchetto o a Plus.",
    feats: [
      { i: "book", t: "Dispense", d: "Da leggere e annotare qui, per anno e partizione." },
      { i: "quiz", t: "Esercitazioni", d: "Quiz con spiegazioni, simulazioni e ripasso errori." },
      { i: "cap", t: "Il tuo percorso", d: "Libretto, voto di laurea, Erasmus e magistrali." },
      { i: "spark", t: "E presto…", d: "Giurisprudenza e Medicina: lista d'attesa aperta." },
    ],
  },
};
