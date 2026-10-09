/* network · dati.js
   Modulo Network · DATI DI ESEMPIO (window.UL_D). Atenei diversi da UniFi, club, community, annunci: FITTIZI;
   prezzi = ipotesi della demo D. Architettura: network/core.js. */
/* Variante D — UniLink multi-ateneo. Dati di esempio: club, utenti, dispense community, annunci e convenzioni
   sono FITTIZI; i corsi di laurea degli atenei diversi da UniFi sono indicativi. Prezzi = ipotesi. */
window.UL_D = {
  unis: [
    { id: "unifi", n: "Università di Firenze", s: "UniFi", city: "Firenze", status: "attivo", color: "#172554", dsu: "DSU Toscana",
      cds: ["Economia Aziendale", "Economia e Commercio"] },
    { id: "unipi", n: "Università di Pisa", s: "UniPi", city: "Pisa", status: "attivo", color: "#1a453c", dsu: "DSU Toscana",
      cds: ["Economia Aziendale", "Economia e Commercio", "Banca, Finanza e Mercati Finanziari"] },
    { id: "bocconi", n: "Università Bocconi", s: "Bocconi", city: "Milano", status: "attivo", color: "#914809", dsu: "Servizi agevolazioni dell'ateneo",
      cds: ["CLEAM", "CLEF", "CLEACC", "BIEM", "BIEF", "BESS"] },
    { id: "unibo", n: "Università di Bologna", s: "UniBo", city: "Bologna", status: "apertura", color: "#a4321f", dsu: "ER.GO",
      cds: ["Economia Aziendale", "Economia e Commercio", "Economics and Finance"] },
    { id: "luiss", n: "LUISS Guido Carli", s: "LUISS", city: "Roma", status: "apertura", color: "#2b5c52", dsu: "Servizi agevolazioni dell'ateneo",
      cds: ["Economia e Management", "Economics and Business"] },
    { id: "unisi", n: "Università di Siena", s: "UniSi", city: "Siena", status: "apertura", color: "#cf7527", dsu: "DSU Toscana",
      cds: ["Economia e Commercio", "Economia e Gestione Aziendale"] },
  ],

  // club UniLink per ateneo (modello club universitari)
  chapters: {
    unifi: { members: 412, amb: "Matteo P.", since: 2024, next: "Workshop Excel per la finanza" },
    unipi: { members: 187, amb: "Martina C.", since: 2026, next: "Aperitivo di benvenuto matricole" },
    bocconi: { members: 96, amb: "Alessandro V.", since: 2026, next: "Talk: preparare il test MSc" },
    unibo: { members: 0, amb: "Cercasi ambassador", since: null, next: "" },
    luiss: { members: 0, amb: "Cercasi ambassador", since: null, next: "" },
    unisi: { members: 0, amb: "Cercasi ambassador", since: null, next: "" },
  },

  // dispense caricate dalla community negli altri atenei (UniFi usa il catalogo ufficiale UniLink)
  community: [
    { id: "c1", uni: "unipi", cds: "Banca, Finanza e Mercati Finanziari", anno: 2, title: "Economia degli intermediari finanziari", author: "Martina C.", rating: 4.8, dl: 312, pages: 64 },
    { id: "c2", uni: "unipi", cds: "Economia Aziendale", anno: 1, title: "Economia aziendale — esercizi di contabilità", author: "Davide R.", rating: 4.6, dl: 280, pages: 41 },
    { id: "c3", uni: "unipi", cds: "Economia e Commercio", anno: 1, title: "Matematica generale — formulario", author: "Sara L.", rating: 4.9, dl: 455, pages: 12 },
    { id: "c4", uni: "unipi", cds: "Economia e Commercio", anno: 2, title: "Macroeconomia — riassunto completo", author: "Luca B.", rating: 4.5, dl: 198, pages: 58 },
    { id: "c5", uni: "bocconi", cds: "CLEF", anno: 2, title: "Corporate Finance — esercizi svolti", author: "Alessandro V.", rating: 4.7, dl: 521, pages: 72 },
    { id: "c6", uni: "bocconi", cds: "CLEAM", anno: 1, title: "Mathematics — formulario", author: "Giulia T.", rating: 4.8, dl: 610, pages: 15 },
    { id: "c7", uni: "bocconi", cds: "BIEM", anno: 1, title: "Microeconomics — summary", author: "Pietro S.", rating: 4.4, dl: 233, pages: 49 },
    { id: "c8", uni: "bocconi", cds: "CLEACC", anno: 1, title: "Management — mappe concettuali", author: "Elena F.", rating: 4.6, dl: 176, pages: 30 },
    { id: "c9", uni: "unibo", cds: "Economia e Commercio", anno: 1, title: "Statistica — esercizi d'esame commentati", author: "Fondatore club (in apertura)", rating: 4.3, dl: 54, pages: 37 },
    { id: "c10", uni: "luiss", cds: "Economia e Management", anno: 1, title: "Diritto privato — schemi", author: "Fondatore club (in apertura)", rating: 4.2, dl: 31, pages: 26 },
  ],

  subjects: ["Matematica", "Logica", "Comprensione verbale", "Ragionamento numerico"],
  // banca domande attitudinali (stile test d'ammissione: logica, matematica, verbale, numerico)
  apt: [
    { id: "t01", s: "Matematica", q: "Se 3x − 7 = 11, quanto vale x?", opts: ["4", "6", "5", "7"], a: 1, x: "3x = 18, quindi x = 6." },
    { id: "t02", s: "Matematica", q: "La retta passante per (0, 2) e (2, 6) ha pendenza:", opts: ["1", "2", "3", "4"], a: 1, x: "m = (6 − 2) / (2 − 0) = 2." },
    { id: "t03", s: "Matematica", q: "Quanto vale log₂ 32?", opts: ["4", "5", "6", "16"], a: 1, x: "2⁵ = 32, quindi log₂ 32 = 5." },
    { id: "t04", s: "Matematica", q: "Le soluzioni di x² − 5x + 6 = 0 sono:", opts: ["1 e 6", "−2 e −3", "2 e 3", "nessuna soluzione reale"], a: 2, x: "x² − 5x + 6 = (x − 2)(x − 3)." },
    { id: "t05", s: "Matematica", q: "Un prezzo aumenta del 20% e poi diminuisce del 20%. La variazione complessiva è:", opts: ["0%", "−4%", "+4%", "−2%"], a: 1, x: "1,2 × 0,8 = 0,96: il prezzo finale è il 96% di quello iniziale." },
    { id: "t06", s: "Logica", q: "Qual è il numero successivo nella serie 2, 6, 12, 20, 30, …?", opts: ["40", "42", "44", "36"], a: 1, x: "Le differenze crescono di 2: +4, +6, +8, +10, +12 → 42." },
    { id: "t07", s: "Logica", q: "\"Tutti gli A sono B. Alcuni B sono C.\" Quale conclusione è necessariamente vera?", opts: ["Alcuni A sono C", "Tutti i B sono A", "Nessun A è C", "Nessuna delle precedenti"], a: 3, x: "I B che sono C potrebbero non essere A: nessuna delle tre conclusioni segue necessariamente." },
    { id: "t08", s: "Logica", q: "La negazione di \"Tutti gli studenti hanno superato l'esame\" è:", opts: ["Nessuno studente ha superato l'esame", "Almeno uno studente non ha superato l'esame", "Alcuni studenti hanno superato l'esame", "Tutti gli studenti non hanno superato l'esame"], a: 1, x: "La negazione di \"per ogni\" è \"esiste almeno uno che non\"." },
    { id: "t09", s: "Logica", q: "Se piove, la strada è bagnata. La strada non è bagnata. Quindi:", opts: ["Piove", "Non piove", "Non si può concludere nulla", "La strada è asciutta perché c'è il sole"], a: 1, x: "Modus tollens: se A implica B e B è falso, allora A è falso." },
    { id: "t10", s: "Logica", q: "In una fila Anna è la 7ª da sinistra e la 12ª da destra. Quante persone ci sono?", opts: ["18", "19", "17", "20"], a: 0, x: "7 + 12 − 1 = 18 (Anna è contata due volte)." },
    { id: "t11", s: "Comprensione verbale", q: "Quale parola è sinonimo di \"ubiquo\"?", opts: ["Raro", "Onnipresente", "Ambiguo", "Antico"], a: 1, x: "Ubiquo: che è o sembra essere presente ovunque." },
    { id: "t12", s: "Comprensione verbale", q: "Medico sta a ospedale come insegnante sta a:", opts: ["Studente", "Lezione", "Scuola", "Libro"], a: 2, x: "Relazione professionista–luogo di lavoro." },
    { id: "t13", s: "Comprensione verbale", q: "Il contrario di \"effimero\" è:", opts: ["Fugace", "Duraturo", "Leggero", "Evidente"], a: 1, x: "Effimero significa di breve durata." },
    { id: "t14", s: "Comprensione verbale", q: "Quale frase è grammaticalmente corretta?", opts: ["Se avrei tempo, verrei", "Se avessi tempo, verrei", "Se avessi tempo, venivo", "Se avrei avuto tempo, sarei venuto"], a: 1, x: "Periodo ipotetico della possibilità: congiuntivo imperfetto + condizionale presente." },
    { id: "t15", s: "Ragionamento numerico", q: "I ricavi passano da 200 a 250. La crescita percentuale è:", opts: ["20%", "25%", "50%", "12,5%"], a: 1, x: "(250 − 200) / 200 = 25%." },
    { id: "t16", s: "Ragionamento numerico", q: "La media di 4 numeri è 10. Aggiungendo un quinto numero la media diventa 12. Il quinto numero è:", opts: ["12", "14", "20", "22"], a: 2, x: "5 × 12 − 4 × 10 = 60 − 40 = 20." },
    { id: "t17", s: "Ragionamento numerico", q: "Un treno percorre 180 km in 1 ora e 30 minuti. La velocità media è:", opts: ["90 km/h", "120 km/h", "135 km/h", "150 km/h"], a: 1, x: "180 / 1,5 = 120 km/h." },
    { id: "t18", s: "Ragionamento numerico", q: "Da un mazzo di 40 carte con 4 assi si estrae una carta. La probabilità che sia un asso è:", opts: ["1/4", "1/10", "1/13", "4/52"], a: 1, x: "4 / 40 = 1/10." },
    { id: "t19", s: "Ragionamento numerico", q: "1.000 € investiti al 10% annuo con interesse composto diventano, dopo 2 anni:", opts: ["1.200 €", "1.210 €", "1.100 €", "1.221 €"], a: 1, x: "1.000 × 1,1² = 1.210 €." },
    { id: "t20", s: "Matematica", q: "Quanto vale 20% di 150 + 15% di 200?", opts: ["45", "50", "60", "65"], a: 2, x: "30 + 30 = 60." },
  ],

  tests: [
    { id: "msc", t: "Test magistrale stile Bocconi", d: "Logica, matematica, verbale e numerico come nel test online per le MSc. Nella demo: simulazione ridotta.", sim: { n: 16, min: 24 } },
    { id: "tolc", t: "TOLC-E (CISIA)", d: "Il test d'ingresso di molte facoltà di Economia: logica, comprensione verbale, matematica.", sim: { n: 12, min: 18 } },
    { id: "gmat", t: "GMAT Focus — basi", d: "Allenamento sulle basi di Quantitative e Verbal Reasoning prima dei materiali ufficiali.", sim: { n: 12, min: 18 } },
  ],

  tutoring: [
    { id: "boost", t: "Boost", h: 5, price: 149, d: "Piano di studio sui punti deboli, accesso self-study incluso." },
    { id: "complete", t: "Complete", h: 10, price: 279, d: "Strategia, revisione delle simulazioni, contatto diretto con il tutor." },
    { id: "intensive", t: "Intensive", h: 20, price: 499, d: "Strategia di ammissione completa, CV e motivation letter, mock interview." },
  ],
  selfStudy: 49,

  academy: [
    { id: "a1", t: "Excel per la finanza", h: 6, price: 39, lvl: "Base", mods: 8 },
    { id: "a2", t: "Investire: le basi", h: 4, price: 29, lvl: "Base", mods: 6 },
    { id: "a3", t: "Financial modeling: three-statement model", h: 10, price: 89, lvl: "Avanzato", mods: 12 },
    { id: "a4", t: "Colloqui in finance e consulting", h: 5, price: 59, lvl: "Intermedio", mods: 7 },
    { id: "a5", t: "Python per l'analisi dei dati", h: 8, price: 69, lvl: "Intermedio", mods: 10 },
  ],
  PASS: 5.99,

  // risultati di ammissione ai master segnalati dalla community (esempi)
  admissions: [
    { from: "unifi", cds: "Economia Aziendale", media: 28.4, test: "GMAT 635", pid: "p120", esito: "ammesso", anno: 2026 },
    { from: "unifi", cds: "Economia e Commercio", media: 29.1, test: "GRE 326", pid: "p146", esito: "ammesso", anno: 2026 },
    { from: "unifi", cds: "Economia Aziendale", media: 26.2, test: "—", pid: "p150", esito: "ammesso", anno: 2026 },
    { from: "unipi", cds: "Banca, Finanza e Mercati Finanziari", media: 27.9, test: "GMAT 605", pid: "p20", esito: "rifiutato", anno: 2026 },
    { from: "unipi", cds: "Economia e Commercio", media: 28.8, test: "GMAT 655", pid: "p20", esito: "ammesso", anno: 2026 },
    { from: "bocconi", cds: "CLEF", media: 27.5, test: "Test Bocconi", pid: "p20", esito: "ammesso", anno: 2026 },
    { from: "bocconi", cds: "CLEAM", media: 26.9, test: "GMAT 645", pid: "p1", esito: "waitlist", anno: 2026 },
    { from: "unifi", cds: "Economia Aziendale", media: 27.6, test: "GMAT 615", pid: "p139", esito: "ammesso", anno: 2025 },
    { from: "unipi", cds: "Economia Aziendale", media: 26.7, test: "—", pid: "p144", esito: "ammesso", anno: 2025 },
    { from: "unifi", cds: "Economia e Commercio", media: 25.8, test: "GMAT 585", pid: "p120", esito: "rifiutato", anno: 2025 },
    { from: "bocconi", cds: "BIEM", media: 28.1, test: "GMAT 675", pid: "p5", esito: "ammesso", anno: 2025 },
    { from: "unifi", cds: "Economia Aziendale", media: 28.9, test: "GMAT 665", pid: "p27", esito: "ammesso", anno: 2025 },
  ],

  events: [
    { id: "ev1", t: "UniLink Summit 2027 — economia, finanza e carriere", uni: null, city: "Firenze", d: 45, free: true, sponsored: true, desc: "Una giornata con aziende, business school e i club di tutti gli atenei. Biglietto gratuito." },
    { id: "ev2", t: "Workshop Excel per la finanza", uni: "unifi", city: "Firenze · Novoli", d: 8, free: true },
    { id: "ev3", t: "Aperitivo di benvenuto matricole", uni: "unipi", city: "Pisa", d: 5, free: true },
    { id: "ev4", t: "Talk: preparare il test MSc", uni: "bocconi", city: "Milano", d: 12, free: true },
    { id: "ev5", t: "Case challenge inter-ateneo (sponsor partner)", uni: null, city: "Online", d: 21, free: true, sponsored: true },
  ],

  deals: [
    { uni: "unifi", n: "Copisteria Lungarno", d: "−20% su stampe e rilegature", cat: "Studio" },
    { uni: "unifi", n: "Caffè Novoli", d: "Colazione a 2 € con la tessera", cat: "Food" },
    { uni: "unipi", n: "Libreria Borgo Stretto", d: "−10% sui manuali", cat: "Studio" },
    { uni: "bocconi", n: "Palestra Campus Sud", d: "−25% sull'abbonamento", cat: "Sport" },
    { uni: null, n: "Corso d'inglese online", d: "−15% per gli iscritti Pass", cat: "Lingue" },
  ],

  listings: [
    { id: "l1", uni: "unifi", course: "Microeconomia", t: "Manuale di microeconomia (ultima edizione)", price: 22, cond: "Come nuovo", seller: "Giulia R.", featured: true },
    { id: "l2", uni: "unifi", course: "Statistica", t: "Eserciziario di statistica", price: 10, cond: "Buono", seller: "Marco B." },
    { id: "l3", uni: "unipi", course: "Matematica generale", t: "Manuale di matematica generale", price: 18, cond: "Sottolineato", seller: "Sara L." },
    { id: "l4", uni: "bocconi", course: "Corporate Finance", t: "Corporate Finance textbook", price: 35, cond: "Buono", seller: "Pietro S.", featured: true },
    { id: "l5", uni: "unifi", course: "Diritto commerciale", t: "Codice civile commentato", price: 15, cond: "Buono", seller: "Andrea G." },
  ],
};

