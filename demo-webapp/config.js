// UniLink · Web app (area personale) — CONFIGURAZIONE DELLA DEMO v2
// -----------------------------------------------------------------------------
// Unico file da toccare per cambiare COSA c'è. Design: app.css · funzionamento: app.js.
// Riferimento: architettura/UniLink_Architettura_WebApp.pdf (cap. 6 «Aree, percorsi, piani» e cap. 9).
//
// Il modello a TRE LIVELLI (indipendenti tra loro):
//   1. UL_AREE      → COSA studi (Economia, Giurisprudenza, Medicina…): catalogo, corsi, strumenti, colore.
//   2. UL_PERCORSI  → IN CHE MOMENTO sei (Test Prep = prima, Studio = durante, Futuro = dopo).
//   3. UL_PIANI     → COSA è sbloccato (Gratuito, Dispensa, Semestre, Plus…). Prezzi = IPOTESI.
// Il menu nasce da UL_MODULI filtrati per area × percorso; il piano mette lucchetti e sblocchi.
// -----------------------------------------------------------------------------

window.UL_VERSIONE = { n: 2, data: "2026-10-06", nota: "Base grafica A, login A, primo accesso in 7 passi, modello aree × percorsi × piani, account demo per ogni abbonamento, pagina Configurazione." };
window.UL_SITO = "https://www.unilinkfirenze.it";
window.UL_WA = "https://chat.whatsapp.com/KdA4r1POh6MAiBbLmmES0L";

// 1 · AREE DI STUDIO. stato: attiva | in_arrivo | proposta. colore = tinta derivata dalla palette.
// test: il test d'ingresso mostrato nel percorso Test Prep (null = nessun test da preparare).
window.UL_AREE = [
  { slug: "economia", nome: "Economia", stato: "attiva", colore: "#cf7527", tinta: "#f6e4d1",
    atenei: [{ slug: "unifi", nome: "UniFi", stato: "attivo" }],
    corsi: ["Economia Aziendale", "Economia e Commercio"],
    test: { nome: "TOLC-E", nota: "Test CISIA per i corsi di Economia: verifica sul bando del tuo ateneo se e come è richiesto.", fonte: "https://www.cisiaonline.it" } },
  { slug: "giurisprudenza", nome: "Giurisprudenza", stato: "in_arrivo", colore: "#2f4a8a", tinta: "#dfe4f1", decidere: "D01",
    atenei: [{ slug: "unifi", nome: "UniFi", stato: "in_arrivo" }],
    corsi: ["Giurisprudenza (ciclo unico)"], domanda: "A che anno sei?",
    test: null },
  { slug: "medicina", nome: "Medicina", stato: "in_arrivo", colore: "#1a453c", tinta: "#e3efe8", decidere: "D02",
    atenei: [{ slug: "unifi", nome: "UniFi", stato: "in_arrivo" }],
    corsi: ["Medicina e Chirurgia"], domanda: "Sei nel semestre filtro?",
    test: { nome: "Semestre filtro", nota: "Fisica, Chimica, Biologia: uguale in tutta Italia. Date e regole solo da fonti ufficiali.", fonte: "https://www.mur.gov.it" } },
  { slug: "altra", nome: "Un'altra area", stato: "proposta", colore: "#646b7b", tinta: "#eceef3",
    atenei: [], corsi: [], domanda: "Cosa studi?", test: null },
];

// 2 · PERCORSI (uguali per ogni area). È il selettore «Il tuo percorso» in cima alla sidebar.
window.UL_PERCORSI = [
  { id: "test", nome: "Test Prep", quando: "Prima dell'università", icona: "target", desc: "Test d'ingresso, allenamento, errori e scelta del corso." },
  { id: "studio", nome: "Studio", quando: "Durante l'università", icona: "libro", desc: "Esami, materiali, esercitazioni e libretto." },
  { id: "futuro", nome: "Futuro", quando: "Le scelte successive", icona: "cappello", desc: "Erasmus, magistrali e MSc, CV e carriera." },
];

// 3 · MODULI = le voci della sidebar.
//   percorso: "comune" (sempre) | "test" | "studio" | "futuro" | "account"
//   aree: ["tutte"] o gli slug dove il modulo ha contenuto (altrove mostra lo stato «in arrivo»)
//   tab: posizione nella barra in basso su telefono (1–5), se presente
window.UL_MODULI = [
  { id: "oggi", nome: "Oggi", icona: "casa", percorso: "comune", aree: ["tutte"], tab: 1 },
  { id: "piano", nome: "Il mio piano", icona: "calendario", percorso: "comune", aree: ["tutte"], tab: 2 },
  { id: "esami", nome: "I miei esami", icona: "libro", percorso: "studio", aree: ["tutte"], tab: 3 },
  { id: "materiali", nome: "Materiali", icona: "file", percorso: "studio", aree: ["economia"], tab: 4 },
  { id: "pratica", nome: "Esercitazioni", icona: "quiz", percorso: "studio", aree: ["economia"] },
  { id: "libretto", nome: "Libretto e obiettivi", icona: "grafico", percorso: "studio", aree: ["tutte"] },
  { id: "test", nome: "Il mio test", icona: "target", percorso: "test", aree: ["tutte"], tab: 3 },
  { id: "allenamento", nome: "Allenamento", icona: "quiz", percorso: "test", aree: ["economia"], tab: 4 },
  { id: "errori", nome: "Registro errori", icona: "libro", percorso: "test", aree: ["tutte"] },
  { id: "orientamento", nome: "Orientamento", icona: "cappello", percorso: "test", aree: ["tutte"] },
  { id: "magistrali", nome: "Magistrali e MSc", icona: "cappello", percorso: "futuro", aree: ["tutte"], tab: 3 },
  { id: "erasmus", nome: "Erasmus", icona: "globo", percorso: "futuro", aree: ["economia"], tab: 4 },
  { id: "career", nome: "Carriere e CV", icona: "valigia", percorso: "futuro", aree: ["tutte"] },
  { id: "salvati", nome: "Salvati", icona: "salva", percorso: "account", aree: ["tutte"] },
  { id: "abbonamento", nome: "Piano e acquisti", icona: "carrello", percorso: "account", aree: ["tutte"] },
  { id: "profilo", nome: "Profilo", icona: "utente", percorso: "account", aree: ["tutte"], tab: 5 },
];

// 4 · PIANI. Prezzi = IPOTESI dall'HQ (idea «PREZZI & ABBONAMENTI», 5/10/2026): NON decisi.
// sblocca: cosa apre il piano. Le regole sono in app.js → accesso().
//   "estratti"         estratto di ogni dispensa + quiz rapido (10 domande al giorno)
//   "una_gratis"       una dispensa completa a scelta, con l'account
//   "appunti:esame"    appunti completi dell'esame comprato
//   "dispensa:esame"   appunti + mappe + quiz illimitati dell'esame comprato
//   "dispensa:semestre" come sopra per tutti gli esami di un semestre
//   "plus"             ripasso errori, simulazione a tempo, piano guidato, CV benchmark
window.UL_PIANI = [
  { id: "gratuito", nome: "Gratuito", tipo: "base", prezzo: "0 €", sblocca: ["estratti", "una_gratis"],
    include: ["Estratti di tutte le dispense", "Una dispensa completa a scelta", "Quiz rapido: 10 domande al giorno", "Esami, piano, libretto e strumenti"] },
  { id: "appunti", nome: "Appunti di un esame", tipo: "acquisto", prezzo: "ipotesi 5–8 €", sblocca: ["appunti:esame"],
    include: ["Appunti completi dell'esame", "Restano tuoi"] },
  { id: "dispensa", nome: "Dispensa completa", tipo: "acquisto", prezzo: "ipotesi 12–15 €", sblocca: ["dispensa:esame"], evidenza: true,
    include: ["Appunti, mappe concettuali, esercizi", "Quiz illimitati per l'esame", "Aggiornamenti dell'anno"] },
  { id: "semestre", nome: "Pacchetto semestre", tipo: "acquisto", prezzo: "ipotesi 25–30 €", sblocca: ["dispensa:semestre"],
    include: ["Le dispense complete del tuo semestre (3–4 esami)", "Quiz illimitati per quegli esami"] },
  { id: "plus", nome: "UniLink Plus", tipo: "abbonamento", prezzo: "da decidere", sblocca: ["plus"],
    include: ["Ripasso errori e simulazione a tempo", "Piano guidato dalla data dell'appello", "Confronto del CV con un profilo tipo", "Si somma agli acquisti"] },
];

// 5 · STRUMENTI (stesso modello di tools.csv della landing). interno = funziona nella app.
window.UL_STRUMENTI = [
  { id: "voto", nome: "Calcolatore voto di laurea", desc: "Stima il voto finale dalla tua media.", aree: ["economia"], tipo: "interno", dove: "libretto" },
  { id: "erasmus", nome: "Calcolatore Erasmus", desc: "Il tuo punteggio per il bando.", aree: ["economia"], tipo: "link", url: "/tools/calcolatore-erasmus" },
  { id: "mete", nome: "Destinazioni Erasmus", desc: "Le mete con informazioni ordinate.", aree: ["economia"], tipo: "link", url: "/tools/destinazioni-erasmus" },
  { id: "magistrali", nome: "Master e magistrali", desc: "Confronta i percorsi dopo la triennale.", aree: ["tutte"], tipo: "link", url: "/tools/master-magistrale" },
  { id: "guida", nome: "Guide", desc: "Piano di studi, esami, Learning Agreement.", aree: ["tutte"], tipo: "link", url: "/guide" },
];

// 6 · DOMANDE DI ESEMPIO per esercitazioni e allenamento (scritte per la demo, non una banca ufficiale).
window.UL_DOMANDE = [
  { esame: "microeconomia", d: "Se il prezzo di un bene aumenta e la quantità domandata diminuisce, ci si muove:", o: ["Lungo la curva di domanda", "Spostando la curva di domanda a destra", "Spostando la curva di offerta", "Fuori dall'equilibrio"], g: 0, s: "Una variazione del prezzo del bene stesso provoca un movimento lungo la curva." },
  { esame: "microeconomia", d: "Un'elasticità della domanda al prezzo pari a −2 significa che:", o: ["+1% di prezzo → −2% di quantità", "+2% di prezzo → −1% di quantità", "La domanda è rigida", "Il bene è inferiore"], g: 0, s: "L'elasticità è la variazione percentuale della quantità diviso quella del prezzo." },
  { esame: "microeconomia", d: "In concorrenza perfetta, nel lungo periodo il profitto economico è:", o: ["Positivo", "Nullo", "Negativo", "Massimo"], g: 1, s: "L'entrata di nuove imprese azzera i profitti economici." },
  { esame: "microeconomia", d: "Il monopolista massimizza il profitto dove:", o: ["Prezzo = costo marginale", "Ricavo marginale = costo marginale", "Prezzo = costo medio", "Ricavo totale è massimo"], g: 1, s: "Come ogni impresa: RMg = CMg, poi legge il prezzo sulla domanda." },
  { esame: "microeconomia", d: "Un bene si dice inferiore quando:", o: ["La domanda cala se il reddito aumenta", "Costa poco", "Ha molti sostituti", "La domanda è elastica"], g: 0, s: "Elasticità al reddito negativa." },
  { esame: "statistica", d: "La media aritmetica di 2, 4, 6, 8 è:", o: ["4", "5", "6", "20"], g: 1, s: "(2+4+6+8)/4 = 5." },
  { esame: "statistica", d: "La mediana di 1, 3, 9 è:", o: ["3", "4,3", "9", "1"], g: 0, s: "Il valore centrale dei dati ordinati." },
  { esame: "statistica", d: "Una normale standard ha media e varianza:", o: ["0 e 1", "1 e 0", "0 e 0", "1 e 1"], g: 0, s: "N(0,1)." },
  { esame: "statistica", d: "La varianza di una costante è:", o: ["La costante", "1", "0", "Non definita"], g: 2, s: "Una costante non varia." },
  { esame: "tolc", d: "Se tutti gli A sono B e nessun B è C, allora:", o: ["Nessun A è C", "Qualche A è C", "Tutti i C sono A", "Non si può dire"], g: 0, s: "Gli A stanno dentro B, che non tocca C." },
  { esame: "tolc", d: "Il 15% di 80 è:", o: ["8", "10", "12", "15"], g: 2, s: "0,15 × 80 = 12." },
  { esame: "tolc", d: "La soluzione di 2x + 3 = 11 è:", o: ["x = 3", "x = 4", "x = 7", "x = 5,5"], g: 1, s: "2x = 8 → x = 4." },
  { esame: "tolc", d: "Nella successione 2, 6, 18, 54, … il termine dopo è:", o: ["108", "72", "162", "216"], g: 2, s: "Ogni termine è il triplo del precedente." },
];

// 7 · ACCOUNT DEMO: uno per ogni combinazione utile da provare (area × percorso × piano).
// colore = colore del cerchio con le iniziali in alto a destra.
window.UL_PERSONE = [
  { id: "giulia", nome: "Giulia", cognome: "Rossi", colore: "#cf7527", email: "giulia.rossi@stud.unifi.it",
    etichetta: "Economia · II anno · Gratuito", area: "economia", ateneo: "unifi", corso: "Economia Aziendale", anno: "II", percorso: "studio",
    piano: "gratuito", acquisti: [{ tipo: "una_gratis", esame: "microeconomia", data: "2026-09-12" }],
    minuti: 60, obiettivo: "Passare Micro e Statistica entro novembre", media: 27.4, lodi: 1,
    esami: [{ slug: "microeconomia", data: "2026-11-03", obiettivo: 28, fatti: [0, 1] }, { slug: "statistica", data: "2026-11-17", obiettivo: 27, fatti: [0] }],
    libretto: [["economia_aziendale", 28], ["diritto_pubblico", 26], ["matematica-per-applicazioni-economiche-i", 30], ["economia-e-gestione-delle-imprese", 27]],
    salvati: ["microeconomia", "statistica", "macroeconomia"] },
  { id: "marco", nome: "Marco", cognome: "Bianchi", colore: "#172554", email: "marco.bianchi@stud.unifi.it",
    etichetta: "Economia · I anno · Dispensa completa", area: "economia", ateneo: "unifi", corso: "Economia e Commercio", anno: "I", percorso: "studio",
    piano: "gratuito", acquisti: [{ tipo: "una_gratis", esame: "economia_aziendale", data: "2026-09-20" }, { tipo: "dispensa", esame: "statistica", data: "2026-10-01", importo: "ipotesi" }],
    minuti: 45, obiettivo: "Statistica al primo appello", media: 0, lodi: 0,
    esami: [{ slug: "statistica", data: "2026-11-17", obiettivo: 26, fatti: [] }], libretto: [], salvati: ["statistica"] },
  { id: "sara", nome: "Sara", cognome: "Neri", colore: "#1a453c", email: "sara.neri@stud.unifi.it",
    etichetta: "Economia · II anno · Pacchetto semestre", area: "economia", ateneo: "unifi", corso: "Economia Aziendale", anno: "II", percorso: "studio",
    piano: "gratuito", acquisti: [{ tipo: "semestre", anno: "II", sem: "I", data: "2026-09-28", importo: "ipotesi" }],
    minuti: 90, obiettivo: "Chiudere il I semestre del II anno", media: 26.1, lodi: 0,
    esami: [{ slug: "macroeconomia", data: "2026-11-10", obiettivo: 27, fatti: [0] }, { slug: "contabilitá", data: "2026-11-24", obiettivo: 26, fatti: [] }],
    libretto: [["economia_aziendale", 25], ["microeconomia", 27], ["statistica", 26]], salvati: ["macroeconomia", "contabilitá"] },
  { id: "luca", nome: "Luca", cognome: "Conti", colore: "#7a4fa0", email: "luca.conti@stud.unifi.it",
    etichetta: "Economia · III anno · Plus", area: "economia", ateneo: "unifi", corso: "Economia e Commercio", anno: "III", percorso: "futuro",
    piano: "plus", acquisti: [{ tipo: "plus", data: "2026-09-01", importo: "ipotesi" }],
    minuti: 75, obiettivo: "Una magistrale in finance all'estero", media: 28.6, lodi: 3,
    esami: [{ slug: "finanza_aziendale", data: "2026-12-02", obiettivo: 30, fatti: [0, 1] }],
    libretto: [["economia_aziendale", 30], ["microeconomia", 29], ["statistica", 28], ["macroeconomia", 30], ["matematica_finanziaria", 28]], salvati: ["finanza_aziendale"] },
  { id: "elena", nome: "Elena", cognome: "Ricci", colore: "#2f4a8a", email: "elena.ricci@stud.unifi.it",
    etichetta: "Giurisprudenza · I anno · area in arrivo", area: "giurisprudenza", ateneo: "unifi", corso: "Giurisprudenza (ciclo unico)", anno: "I", percorso: "studio",
    piano: "gratuito", acquisti: [], minuti: 60, obiettivo: "Diritto privato a gennaio", media: 0, lodi: 0,
    esami: [{ slug: "x-privato", nome: "Istituzioni di diritto privato", data: "2027-01-20", obiettivo: 27, argomenti: ["Fonti", "Soggetti", "Obbligazioni", "Contratti", "Proprietà"], fatti: [] }], libretto: [], salvati: [] },
  { id: "pietro", nome: "Pietro", cognome: "Galli", colore: "#a95d1c", email: "pietro.galli@gmail.com",
    etichetta: "Maturando · Test Prep TOLC-E", area: "economia", ateneo: "unifi", corso: "Economia Aziendale", anno: "Prima dell'università", percorso: "test",
    piano: "gratuito", acquisti: [], minuti: 30, obiettivo: "Entrare a Economia", media: 0, lodi: 0, dataTest: "2027-04-15",
    esami: [], libretto: [], salvati: [] },
];

// -----------------------------------------------------------------------------
// DA DECIDERE — proposte NON decise, ognuna con la sua architettura demo (vedi cap. 7 del PDF).
// vedi: se la proposta è già visibile nella app come ipotesi, il link alla pagina.
// Tipi di blocco per "schermata": hero, navy, stats, cards, list, steps, form, progress, quiz, prezzi, chips, nota.
// -----------------------------------------------------------------------------
window.UL_DA_DECIDERE = [
  { id: "D01", titolo: "Area Giurisprudenza attiva", gruppo: "Aree", stato: "In arrivo", origine: "Nota Cosimo 6/10 · landing cap. 10", impatto: 5, sforzo: 4,
    problema: "Oggi l'area è «in arrivo»: raccogliamo la lista d'attesa ma non abbiamo materiali né studenti nel team.",
    proposta: "Quando parte, lo studente di Giurisprudenza vede lo STESSO guscio: cambiano catalogo, corsi e strumenti, presi dalla riga dell'area in UL_AREE.",
    dove: "Profilo → Area. Tutti i moduli con aree: [\"giurisprudenza\"] si accendono.", vedi: "persona:elena",
    schermata: [
      { t: "hero", eyebrow: "Giurisprudenza · UniFi", titolo: "Cosa prepari *oggi*, Elena?", testo: "Il prossimo appello è tra 21 giorni." },
      { t: "navy", badge: "Il prossimo passo", titolo: "Diritto privato · Le obbligazioni", testo: "Ripassa lo schema e fai le 10 domande d'esame.", cta: ["Apri lo schema", "Domande d'esame"] },
      { t: "list", titolo: "Materiali dell'area (esempio)", items: [["Istituzioni di diritto privato", "I anno · schemi + domande", "In preparazione"], ["Diritto costituzionale", "I anno · schemi", "In preparazione"], ["Storia del diritto", "I anno", "Cerchiamo autori"]] },
    ],
    serve: ["1–2 studenti di Giurisprudenza nel team", "Piano ufficiale verificato sul Course Catalogue UniFi", "Riga in UL_AREE: stato da in_arrivo ad attiva", "Dispense con campo Area = giurisprudenza"],
    domande: ["Parte prima Giurisprudenza o Medicina? (decide la lista d'attesa)", "Quali 3 esami per primi?"],
    storico: [["2026-10-06", "v1: stesso guscio, contenuti da configurazione."], ["2026-10-06", "v2: account demo «Elena» per vedere lo stato in arrivo nella app."]] },
  { id: "D02", titolo: "Area Medicina attiva", gruppo: "Aree", stato: "In arrivo", origine: "Nota Cosimo 6/10 · landing cap. 1 e 10", impatto: 5, sforzo: 5,
    problema: "Il semestre filtro è uguale in tutta Italia; per il 2026/27 è tardi, l'obiettivo realistico è il 2027/28.",
    proposta: "Il percorso Test Prep di Medicina diventa «semestre filtro»: conto alla rovescia, piano settimanale e quiz per materia.",
    dove: "Percorso Test Prep con area Medicina.",
    schermata: [
      { t: "hero", eyebrow: "Medicina · semestre filtro", titolo: "Mancano *65 giorni* al primo appello", testo: "Date di esempio: vanno verificate sulle fonti ufficiali." },
      { t: "progress", titolo: "Le tre materie", items: [["Fisica", 40], ["Chimica", 55], ["Biologia", 30]] },
      { t: "nota", testo: "Settore competitivo: decidere se puntare sul semestre filtro o sugli esami successivi." },
    ],
    serve: ["Studenti di Medicina disponibili", "Fonti ufficiali per date e programma", "Banca di domande per le tre materie"],
    domande: ["Semestre filtro o esami del triennio?", "Ciclo realistico: 2027/28?"],
    storico: [["2026-10-06", "Prima architettura con fase «semestre filtro»."]] },
  { id: "D03", titolo: "Banca domande e simulazioni", gruppo: "Studio", stato: "In arrivo", origine: "Demo Versione B · Testing Version", impatto: 5, sforzo: 3,
    problema: "Esercitazioni e Allenamento esistono nella app (v2) con poche domande di esempio: manca una banca vera.",
    proposta: "Banca per esame (CSV: esame, domanda, opzioni, giusta, spiegazione), revisionata dal team; simulazione a tempo in trentesimi per Plus.",
    dove: "Esercitazioni (Studio) e Allenamento (Test Prep): stessa banca.", vedi: "#/pratica",
    schermata: [
      { t: "navy", badge: "Ripassa gli errori", titolo: "Microeconomia · 6 domande da ripassare", testo: "Tornano finché non le azzecchi due volte di fila.", cta: ["Inizia il ripasso", "Simulazione a tempo"] },
      { t: "stats", items: [["45", "domande per esame (obiettivo)"], ["3", "esami pilota"], ["48 h", "revisione"]] },
    ],
    serve: ["Chi scrive e chi revisiona le domande", "Formato CSV unico", "Collegamento con D07"],
    domande: ["Quanto è gratis (oggi: 10 al giorno)?", "Quali esami pilota?"],
    storico: [["2026-10-06", "v2: Esercitazioni nella sidebar (base A) con domande di esempio; resta da decidere la banca."]] },
  { id: "D04", titolo: "Piano guidato", gruppo: "Studio", stato: "In arrivo", origine: "Testing Version (Piano guidato)", impatto: 4, sforzo: 3,
    problema: "Lo studente sa la data dell'appello ma non come distribuire gli argomenti.",
    proposta: "Dalla data e dagli argomenti la app propone le sessioni della settimana; prima con regole semplici, poi con l'AI.",
    dove: "Il mio piano → «Organizza sessioni» (nella v2 è segnato Plus, ipotesi).", vedi: "#/piano",
    schermata: [{ t: "steps", items: [["Sett. 1", "Domanda e offerta · Elasticità"], ["Sett. 2", "Scelte del consumatore · Costi"], ["Sett. 3", "Concorrenza · Monopolio"], ["Sett. 4", "Oligopolio · simulazione"]] }],
    serve: ["Argomenti ufficiali per esame", "Regola di distribuzione semplice"], domande: ["Gratis o Plus?", "Promemoria via email?"],
    storico: [["2026-10-06", "v2: pulsante nel piano, bloccato per i non Plus."]] },
  { id: "D05", titolo: "Listino: prezzi, pacchetti e Plus", gruppo: "Piani", stato: "Nuova", origine: "HQ · Prezzi & abbonamenti · Stripe", impatto: 3, sforzo: 3,
    problema: "La struttura dei piani è nella app (v2), ma prezzi e confini tra gratuito e a pagamento sono ipotesi.",
    proposta: "Decidere listino e regole; la app legge tutto da UL_PIANI. Pagamento con Stripe Checkout, sblocco via webhook su Supabase.",
    dove: "Piano e acquisti (account) + lucchetti dentro Materiali, Esercitazioni, Piano.", vedi: "#/abbonamento",
    schermata: [
      { t: "prezzi", items: [{ nome: "Dispensa completa", include: ["Appunti", "Mappe", "Quiz"] , evidenza: true }, { nome: "Pacchetto semestre", include: ["Gli esami del semestre"] }, { nome: "Plus", include: ["Ripasso, simulazione, piano guidato"] }] },
      { t: "nota", testo: "Prezzi di lancio: «prezzo di lancio fino al …, poi …», mai il prezzo barrato (art. 17-bis Codice del Consumo)." },
    ],
    serve: ["Sondaggio prezzi", "Account Stripe e soggetto legale", "Termini di vendita"],
    domande: ["Cosa resta gratis?", "Plus mensile, a sessione o annuale?", "Upgrade appunti → dispensa che riconosce quanto pagato?"],
    storico: [["2026-10-06", "v1: pagina spenta."], ["2026-10-06", "v2: piani nella app con prezzi «ipotesi» e account demo per ogni piano."]] },
  { id: "D06", titolo: "Lettore protetto", gruppo: "Studio", stato: "Nuova", origine: "HQ · Visualizzazione material in sito", impatto: 3, sforzo: 3,
    problema: "Nella v2 il lettore mostra estratti di esempio; i PDF veri non devono girare senza controllo.",
    proposta: "PDF.js nella app, filigrana con nome ed email generata dal server (pdf-lib), file in archivio privato Supabase.",
    dove: "Materiali → «Leggi».", vedi: "#/materiali",
    schermata: [{ t: "hero", eyebrow: "Lettore · Microeconomia", titolo: "Capitolo 6 · *Monopolio*", testo: "Pagina 47 di 85 · filigrana: giulia.rossi@stud.unifi.it" }, { t: "nota", testo: "Nessuna protezione è assoluta: la filigrana scoraggia, non impedisce." }],
    serve: ["Archivio privato", "Funzione server per la filigrana"], domande: ["Download per chi ha pagato?"],
    storico: [["2026-10-06", "Prima architettura."]] },
  { id: "D07", titolo: "Raccolta domande d'esame", gruppo: "Community", stato: "In sviluppo (HQ)", origine: "HQ · Raccolta domande esami", impatto: 5, sforzo: 3,
    problema: "Le domande vere degli appelli sono la cosa più utile e più dispersa.",
    proposta: "Form «Com'è andato l'esame?» il giorno dopo l'appello; revisione del team; in cambio crediti o riconoscimento.",
    dove: "Card in Oggi dopo un appello di «I miei esami».",
    schermata: [{ t: "form", titolo: "Com'è andato l'esame di Microeconomia?", campi: ["Data dell'appello", "Domande che ti ricordi", "Scritto / orale"], cta: "Invia al team" }],
    serve: ["Regola di ricompensa", "Revisione nell'HQ"], domande: ["Crediti, sconto o commissione?", "Anonimo di default?"],
    storico: [["2026-10-06", "Prima architettura."]] },
  { id: "D08", titolo: "Community e gruppi di studio", gruppo: "Community", stato: "Nuova", origine: "HQ · SOCIALNETWORK · Testing Version Network", impatto: 3, sforzo: 4,
    problema: "Trovare compagni con lo stesso esame passa solo da WhatsApp.",
    proposta: "«Sto preparando questo esame e cerco un gruppo», per esame, su scelta esplicita. Nessuno vede cosa scarichi.",
    dove: "Scheda «Gruppi» dentro I miei esami.",
    schermata: [{ t: "list", titolo: "Gruppi per Microeconomia (esempio)", items: [["Gruppo Novoli · martedì", "4 persone · in presenza", "Unisciti"], ["Serale online", "3 persone · online", "Unisciti"]] }],
    serve: ["Moderazione", "Regole privacy"], domande: ["Basta un gruppo WhatsApp per esame?"],
    storico: [["2026-10-06", "Prima architettura."]] },
  { id: "D09", titolo: "Career: CV e Career Score", gruppo: "Futuro", stato: "Nuova", origine: "HQ · CURRICULUM · Demo Versione C", impatto: 4, sforzo: 2,
    problema: "Nella v2 «Carriere e CV» ha una checklist; il confronto con un profilo tipo non è deciso.",
    proposta: "Confronto CV con profili tipo scritti dal team (Plus, ipotesi); Career Score solo nella visione.",
    dove: "Percorso Futuro → Carriere e CV.", vedi: "#/career",
    schermata: [{ t: "progress", titolo: "Il tuo CV vs profilo «Finance»", items: [["Percorso accademico", 77], ["Lingue e test", 50], ["Esperienze", 40]] }],
    serve: ["Profili tipo", "Upload CV privato"], domande: ["Tool semplice ora, Career Score dopo?"],
    storico: [["2026-10-06", "v2: checklist nella app, confronto bloccato."]] },
  { id: "D10", titolo: "Borse di studio", gruppo: "Orientamento", stato: "Nuova", origine: "HQ · BORSE DI STUDIO", impatto: 4, sforzo: 4,
    problema: "Molti studenti non sanno dove trovare i bandi.",
    proposta: "Mini guida con informazioni chiave e scadenze, sempre con link alla fonte ufficiale.",
    dove: "Strumenti e guide (Futuro e Studio).",
    schermata: [{ t: "list", titolo: "Scadenze (esempio, da verificare)", items: [["Borsa DSU", "Fonte: bando ufficiale", "Vedi guida"], ["Esonero tasse", "Fonte: UniFi", "Vedi guida"]] }],
    serve: ["Fonti ufficiali", "Chi aggiorna"], domande: ["Guida statica o aggiornamento automatico?"],
    storico: [["2026-10-06", "Prima architettura."]] },
  { id: "D11", titolo: "Guida tesi", gruppo: "Futuro", stato: "Nuova", origine: "HQ · NEW Tool - TESI", impatto: 4, sforzo: 3,
    problema: "Argomento, relatore e impaginazione sono confusi.",
    proposta: "Percorso in 4 passi + template già impaginato.", dove: "Percorso Studio → Libretto e obiettivi (ultimo anno).",
    schermata: [{ t: "steps", items: [["1", "Scegli l'argomento"], ["2", "Contatta il relatore"], ["3", "Scrivi con il template"], ["4", "Consegna e scadenze"]] }],
    serve: ["Template", "Regole di consegna"], domande: ["Solo Economia o anche le nuove aree?"],
    storico: [["2026-10-06", "Prima architettura."]] },
  { id: "D12", titolo: "Test Prep: quali test e con che materiali", gruppo: "Orientamento", stato: "Nuova", origine: "HQ · TOLC · Testing Version", impatto: 5, sforzo: 5,
    problema: "Il percorso Test Prep è nella app (v2) con poche domande di esempio TOLC-E; non è deciso se e quanto investirci.",
    proposta: "Diagnostico gratuito + allenamento per materia; prima solo TOLC-E (Economia), poi semestre filtro (Medicina).",
    dove: "Percorso Test Prep.", vedi: "persona:pietro",
    schermata: [{ t: "stats", items: [["20", "domande diagnostiche"], ["4", "materie"], ["0 €", "diagnostico"]] }, { t: "nota", testo: "A Firenze molti corsi sono ad accesso libero: valutare dopo le nuove aree." }],
    serve: ["Banca domande TOLC", "Decisione strategica"], domande: ["Ha senso prima delle nuove aree?"],
    storico: [["2026-10-06", "v2: percorso Test Prep con account demo «Pietro»."]] },
];
