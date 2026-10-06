// UniLink · Landing (demo v2) — CONFIGURAZIONE
// -----------------------------------------------------------------------------
// Questo è il file da toccare per cambiare COSA c'è nella demo; il design (ul.css) e il
// funzionamento (app.js) leggono da qui. Riferimento: architettura/UniLink_Architettura_Landing.pdf
//
//   UL_CFG.versione   → numero, data e nota (compare nel footer)
//   UL_CFG.numeri     → numeri reali di Google Analytics (home)
//   UL_CFG.hub        → le aree di studio: stato "attivo" | "in_arrivo"
//   UL_CFG.fasi       → Prima · Durante · Dopo: voci del menu e delle pagine
//   UL_CFG.prezzi     → il LISTINO (da decidere): si cambia qui, la pagina Prezzi si ridisegna
//   UL_CFG.decidere   → le card della sezione arancio DA DECIDERE (una card = un'idea con la sua architettura)
//   Gli strumenti stanno in tools.js (condiviso con la web app).
// -----------------------------------------------------------------------------
window.UL_CFG = {
  versione: { n: 2, data: "2026-10-06", nota: "Landing v2: navigazione Prima · Durante · Dopo, strumenti dentro la demo, anteprima dell'area personale, sezione Da decidere, versione tablet." },
  wa: "https://chat.whatsapp.com/KdA4r1POh6MAiBbLmmES0L",
  app: "../demo-webapp/",   // la demo della web app (stesso repository, cartella accanto)

  // Numeri REALI (Google Analytics 4 e catalogo): aggiornare a mano o con il sync giornaliero dell'HQ
  numeri: { utenti: "876", pagine: "7.855", esami: "34", fonte: "Google Analytics 4 e catalogo · 8 set – 5 ott 2026" },

  hub: [
    { slug: "economia", nome: "Economia", stato: "attivo", href: "hub-economia.html", ico: "€", cls: "eco", img: "novoli-piazza.jpg",
      desc: "34 esami di EA ed EC con appunti, mappe e quiz. Strumenti per Erasmus, media e laurea.", tag: ["Matricole", "Esami", "Dopo la laurea"] },
    { slug: "giurisprudenza", nome: "Giurisprudenza", stato: "in_arrivo", href: "hub-giurisprudenza.html", ico: "§", cls: "giu", img: "palazzo.jpg",
      desc: "Lo stesso metodo, per un ciclo unico di cinque anni. Lo costruiamo con chi studia lì.", tag: ["Primo anno", "Esami", "Professioni legali"] },
    { slug: "medicina", nome: "Medicina", stato: "in_arrivo", href: "hub-medicina.html", ico: "+", cls: "med", img: "aula.jpg",
      desc: "Dal semestre filtro (Fisica, Chimica, Biologia) agli esami del corso. Stiamo raccogliendo interesse.", tag: ["Semestre filtro", "Esami", "Tirocini"] },
  ],

  // Le tre fasi (stesso modello in ogni hub: cambiano i contenuti, non la struttura).
  // I nomi sono volutamente generici ("Dopo", non "Dopo la triennale"): valgono anche per i cicli unici.
  fasi: [
    { id: "prima", nome: "Prima", href: "prima.html", titolo: "Prima di iscriverti", sotto: "Scegliere bene, senza perdersi tra bandi e scadenze.",
      voci: [["Scegliere il corso", "prima.html#scegliere"], ["Come funziona l'università", "prima.html#funziona"], ["Borse e tasse", "prima.html#borse"], ["Test d'ingresso", "prima.html#test"]] },
    { id: "durante", nome: "Durante", href: "durante.html", titolo: "Durante gli studi", sotto: "Esami, metodo, Erasmus: quello che serve ogni settimana.",
      voci: [["Il tuo semestre", "durante.html#semestre"], ["Strumenti", "tools.html"], ["Metodo e piano", "durante.html#metodo"], ["Erasmus", "durante.html#erasmus"], ["La tua area personale", "area.html"]] },
    { id: "dopo", nome: "Dopo", href: "dopo.html", titolo: "Dopo e verso la laurea", sotto: "Tesi, magistrali, master e primi passi di carriera.",
      voci: [["Tesi e laurea", "tesi.html"], ["Magistrali e master", "dopo.html#magistrali"], ["Carriera e CV", "dopo.html#carriera"]] },
  ],

  // LISTINO DI ESEMPIO (ipotesi del 4 ottobre): da decidere. Cambia solo questi numeri/testi.
  prezzi: {
    nota: "Prezzi di esempio, dalle ipotesi del 4 ottobre: il listino è ancora da decidere e si cambia da questo file (UL_CFG.prezzi) senza toccare il design.",
    modi: {
      esame: { etichetta: "Per esame", piani: [
        { nome: "Appunti di un esame", prezzo: "€ 4,99", desc: "Gli appunti completi, da tenere.", voci: ["Appunti/Sbobine del corso", "Aggiornamenti della stessa edizione", "Filigrana personale"] },
        { nome: "Dispensa completa", prezzo: "€ 12,99", desc: "Tutto per un esame.", top: true, voci: ["Appunti, mappe e quiz", "Informazioni utili sull'esame", "Simulazioni nel formato dell'appello"] },
        { nome: "Due esami", prezzo: "€ 22,99", desc: "Due dispense complete a scelta.", voci: ["Dispense complete del semestre", "Si vedono gli esami inclusi", "Upgrade che riconosce quanto già pagato"] },
      ] },
      semestre: { etichetta: "Per semestre", piani: [
        { nome: "Semestre · 1 esame", prezzo: "€ 12,99", desc: "Una dispensa completa del semestre.", voci: ["Appunti, mappe e quiz", "Informazioni sull'esame", "Aggiornamenti"] },
        { nome: "Pacchetto semestre", prezzo: "€ 29,99", desc: "Gli esami del tuo semestre.", top: true, voci: ["Tutte le dispense del semestre", "Simulazioni", "Aggiornamenti"] },
        { nome: "Pacchetto anno", prezzo: "€ 49,99", desc: "Due semestri, un solo acquisto.", voci: ["Tutte le dispense dell'anno", "Simulazioni", "Aggiornamenti"] },
      ] },
    },
    faq: [
      ["C'è qualcosa di gratis?", "Sì: anteprime, informazioni sugli esami e gli strumenti rapidi restano gratuiti."],
      ["Posso passare da Appunti alla dispensa completa?", "Nell'ipotesi in valutazione sì: l'upgrade riconosce quanto hai già pagato."],
      ["Come pago?", "Da decidere: l'ipotesi è carta, Apple Pay e Google Pay tramite un checkout sicuro."],
    ],
  },

  // ---------------------------------------------------------------------------
  // DA DECIDERE — ogni card è una proposta NON decisa, con la sua architettura demo.
  // Campi: id (Lxx: non cambia mai) · titolo · gruppo · stato · impatto/sforzo (1–5) · origine · problema · proposta
  //        · dove (dove vivrebbe nella landing) · schermata (blocchi della mini demo) · serve · domande
  //        · consiglio (il parere di Claude, da discutere) · area (card Dxx corrispondente nella web app) · storico
  // Blocchi per "schermata": hero, cards, steps, list, stats, chips, nota, device, piano, prezzi.
  // ---------------------------------------------------------------------------
  decidere: [
    {
      id: "L01", titolo: "Gruppi di studio", gruppo: "Community", stato: "Da decidere", impatto: 3, sforzo: 3, area: "D08",
      origine: "Nota Matteo 6/10 · HQ SOCIALNETWORK (Gianmarco)",
      problema: "Trovare compagni con lo stesso esame oggi passa solo da WhatsApp e dal passaparola.",
      proposta: "Pagina «Studia insieme» nella Community: per ogni esame un gruppo (link WhatsApp) e, dopo l'accesso, «cerco un gruppo» come scelta esplicita. Niente social generalista.",
      dove: "Pagina Community (sezione «Studia insieme»); il matching vero vive nell'area personale (D08).",
      consiglio: "Sì, ma piccolo: parti con un gruppo WhatsApp per esame, gestito dagli ambassador, e misura quanti entrano. Il matching dentro l'app solo se i gruppi funzionano. Un social network completo costa moderazione e privacy: non ora.",
      schermata: [
        { t: "hero", eyebrow: "Community · Studia insieme", titolo: "Prepara *Microeconomia* con altri", testo: "Scegli il tuo esame: ti mostriamo i gruppi del tuo anno." },
        { t: "list", titolo: "Gruppi per Microeconomia (esempio)", items: [["Novoli · martedì pomeriggio", "4 persone · in presenza", "Unisciti"], ["Serale online", "3 persone · online", "Unisciti"], ["Gruppo ufficiale del corso", "128 persone · WhatsApp", "Entra"]] },
        { t: "nota", testo: "Privacy: nessuno vede cosa hai scaricato. La partecipazione è sempre una scelta esplicita." },
      ],
      serve: ["Un ambassador per esame (o per anno)", "Regole di moderazione scritte", "Informativa privacy per chi cerca un gruppo"],
      domande: ["Basta il gruppo WhatsApp per esame o serve il matching?", "Chi modera? (ambassador, team)", "I profili sono visibili tra studenti?"],
      storico: [["2026-10-06", "Prima architettura: pagina Community + gruppi per esame."]],
    },
    {
      id: "L02", titolo: "Metodo e piano di studio", gruppo: "Metodo", stato: "Da decidere", impatto: 5, sforzo: 3, area: "D04",
      origine: "Nota Matteo 6/10 · riferimento «piano» stile TTP (GMAT)",
      problema: "Lo studente ha dispense e data d'appello, ma non sa come distribuire lo studio: è dove oggi UniLink non aiuta.",
      proposta: "Una pagina «Il metodo» che spiega come studiamo (capire → fissare → allenarsi) e mostra il piano personalizzato: dalla data dell'appello e dagli argomenti, un calendario che si aggiorna mentre studi. Prima a regole semplici, poi adattivo.",
      dove: "Pagina «Durante» (sezione Metodo e piano) + strumento «Piano per l'appello» (già in tools) + scheda Piano nell'area personale (D04).",
      consiglio: "È il tuo differenziatore più forte: le dispense le hanno tutti, il metodo no. Parti con il piano a regole (già funzionante nella demo) e contenuti scritti dal team; l'AI adattiva è una fase successiva, quando ci sono dati di studio reali.",
      schermata: [
        { t: "hero", eyebrow: "Il metodo UniLink", titolo: "Studia con un *piano*, non a caso", testo: "Dalla data dell'appello al giorno dell'esame, passo per passo." },
        { t: "steps", titolo: "Le tre mosse", items: [["1", "Capisci · appunti e mappe, un argomento alla volta"], ["2", "Fissa · quiz e ripasso degli errori"], ["3", "Allenati · simulazione nel formato dell'appello"]] },
        { t: "piano" },
      ],
      serve: ["Argomenti ufficiali per esame (dal programma)", "Regola di distribuzione (già in tools.js)", "Dati di studio reali per renderlo adattivo (fase 2)"],
      domande: ["Il piano è gratis o fa parte di un pacchetto?", "Promemoria via email il giorno prima?", "Quando introdurre l'AI?"],
      storico: [["2026-10-06", "Prima architettura: pagina metodo + piano a regole semplici."]],
    },
    {
      id: "L03", titolo: "Mentoring tra pari", gruppo: "Community", stato: "Da decidere", impatto: 4, sforzo: 5, area: "D13",
      origine: "Nota Matteo 6/10 (con punto interrogativo) · ambassador attuali",
      problema: "Gli studenti più avanti sanno cose che i più giovani cercano, ma oggi lo scambio non è organizzato.",
      proposta: "Un mentore (studente dell'ultimo anno o laureato) per ogni esame o per il percorso: una chiamata, domande ricorrenti, consigli. Si parte dagli ambassador che già avete.",
      dove: "Pagina Community (sezione «Parla con chi ci è già passato») e, più avanti, prenotazione nell'area personale.",
      consiglio: "Bello per la fiducia, ma è il più costoso da gestire (selezione, qualità, pagamenti, responsabilità). Non al lancio: fai una prova manuale con 5 ambassador e 20 studenti, misura se si ripete, poi decidi se costruirlo.",
      schermata: [
        { t: "hero", eyebrow: "Community · Mentoring", titolo: "Parla con chi ci è già *passato*", testo: "Un mentore per il tuo esame, una chiamata da 20 minuti." },
        { t: "cards", titolo: "Mentori (esempio)", items: [["Giulia · III anno EA", "Microeconomia, Statistica · martedì e giovedì"], ["Marco · laureato EC", "Tesi, Erasmus, magistrali · sabato"], ["Sara · II anno", "Diritto privato · tutta la settimana"]] },
        { t: "nota", testo: "Prima della prova serve decidere: gratis o a pagamento? chi garantisce la qualità? chi risponde se qualcosa va storto?" },
      ],
      serve: ["Criteri di selezione dei mentori", "Regole di comportamento e privacy", "Decisione su gratuito/pagamento (e soggetto che incassa)", "Strumento di prenotazione"],
      domande: ["Prova manuale con 5 ambassador prima di costruire?", "Gratuito, con crediti o a pagamento?", "Per esame o per percorso (tesi, Erasmus, magistrali)?"],
      storico: [["2026-10-06", "Prima architettura: mentori per esame e per percorso. Consiglio: prova manuale."]],
    },
    {
      id: "L04", titolo: "Test d'ingresso (TOLC)", gruppo: "Orientamento", stato: "Da decidere", impatto: 5, sforzo: 5, area: "D12",
      origine: "HQ · TOLC",
      problema: "Far conoscere UniLink ai futuri studenti prima dell'iscrizione: è il momento in cui scelgono come studiare.",
      proposta: "Nella fase «Prima»: diagnostico gratuito di 20 domande e un percorso di preparazione per materia.",
      dove: "Pagina «Prima» (sezione Test d'ingresso), con diagnostico dentro la landing e percorso nell'area personale.",
      consiglio: "Settore competitivo e a Firenze molti corsi sono ad accesso libero. Valuta dopo i nuovi hub: per Medicina il semestre filtro è un'opportunità più concreta del TOLC.",
      schermata: [
        { t: "stats", items: [["20", "domande diagnostiche"], ["4", "materie"], ["0 €", "diagnostico"]] },
        { t: "nota", testo: "Serve una banca domande propria e verificata: è il lavoro più grosso." },
      ],
      serve: ["Banca domande TOLC", "Decisione strategica rispetto ai nuovi hub"],
      domande: ["Ha senso prima dei nuovi hub?", "Solo diagnostico gratuito o anche percorso?"],
      storico: [["2026-10-06", "Prima architettura."]],
    },
    {
      id: "L05", titolo: "Borse di studio e tasse", gruppo: "Orientamento", stato: "Da decidere", impatto: 4, sforzo: 4, area: "D10",
      origine: "HQ · BORSE DI STUDIO",
      problema: "Molti studenti non sanno dove trovare bandi e scadenze (DSU e altri).",
      proposta: "Una guida nella fase «Prima» con le informazioni chiave del bando, le scadenze e i link alle fonti ufficiali. Promemoria nell'area personale.",
      dove: "Pagina «Prima» (sezione Borse e tasse) + promemoria in area (D10).",
      consiglio: "Alto valore e poco sforzo di design, ma richiede qualcuno che aggiorni le scadenze ogni anno: senza responsabile, meglio non pubblicarla.",
      schermata: [
        { t: "list", titolo: "Scadenze (esempio, da verificare)", items: [["Borsa DSU", "Fonte: bando ufficiale", "Vedi guida"], ["Esonero tasse", "Fonte: UniFi", "Vedi guida"]] },
        { t: "nota", testo: "All'UniFi non esistono borse per merito (commento Cosimo): solo per reddito." },
      ],
      serve: ["Fonti ufficiali aggiornate", "Un responsabile degli aggiornamenti annuali"],
      domande: ["Guida statica o aggiornamento automatico?", "Chi la mantiene?"],
      storico: [["2026-10-06", "Prima architettura."]],
    },
    {
      id: "L06", titolo: "Carriera e CV", gruppo: "Dopo", stato: "Da decidere", impatto: 4, sforzo: 2, area: "D09",
      origine: "HQ · CURRICULUM (quick win) · Demo Versione C",
      problema: "Chi pensa a magistrali e stage non sa quanto il proprio CV sia vicino al profilo tipo.",
      proposta: "Nella fase «Dopo»: guida breve (CV, colloquio, LinkedIn) e, nell'area personale, confronto del CV con un profilo tipo. Career Score e opportunità solo nella visione.",
      dove: "Pagina «Dopo» (sezione Carriera e CV) + strumento in area (D09).",
      consiglio: "Quick win: parte da contenuti scritti dal team, costa poco e dà traffico organico. Evita le promesse sulle opportunità finché non hai partner reali.",
      schermata: [
        { t: "steps", titolo: "Le prossime 3 azioni (esempio)", items: [["1", "Certificazione d'inglese"], ["2", "Uno stage o un progetto"], ["3", "Shortlist di 3 magistrali"]] },
      ],
      serve: ["Profili tipo scritti dal team", "Upload CV privato (solo area)"],
      domande: ["Solo guida ora, Career Score dopo?"],
      storico: [["2026-10-06", "Prima architettura."]],
    },
    {
      id: "L07", titolo: "Listino e pacchetti", gruppo: "Monetizzazione", stato: "Da decidere", impatto: 3, sforzo: 3, area: "D05",
      origine: "HQ · Prezzi & abbonamenti · Stripe",
      problema: "Il listino non è deciso: appunti singoli, dispensa completa, bundle semestre/anno, Plus mensile sono ipotesi.",
      proposta: "Una pagina Prezzi pronta ma fuori dalla navigazione, che legge il listino da UL_CFG.prezzi: quando il listino è deciso si cambiano i numeri qui e la pagina si ridisegna.",
      dove: "Footer (non in navbar) finché non è deciso; poi voce in navbar o dentro Area personale.",
      consiglio: "Tienila fuori dalla navbar: mostrare prezzi non decisi confonde. Se usate prezzi di lancio: «prezzo di lancio fino al…, poi…», mai il prezzo barrato (art. 17-bis Codice del Consumo).",
      schermata: [
        { t: "prezzi" },
        { t: "nota", testo: "Prezzi di esempio: si cambiano in UL_CFG.prezzi." },
      ],
      serve: ["Listino deciso (sondaggio)", "Soggetto legale e account Stripe", "Termini di vendita e privacy"],
      domande: ["Cosa resta gratis?", "Per esame o per semestre?", "Upgrade che riconosce quanto già pagato?"],
      storico: [["2026-10-06", "Pagina pronta e config-driven, fuori dalla navbar."]],
    },
    {
      id: "L08", titolo: "Quale hub parte per primo", gruppo: "Hub", stato: "Da decidere", impatto: 5, sforzo: 4, area: "D01",
      origine: "Nota Cosimo 6/10 · landing cap. 10",
      problema: "Giurisprudenza e Medicina sono «in arrivo»: raccogliamo la lista d'attesa ma non ci sono materiali né studenti nel team.",
      proposta: "Dopo 3–4 settimane di lista d'attesa si guarda quale hub ha più iscritti e almeno uno o due studenti disposti a costruirlo; quello passa ad «attivo» cambiando una riga della config.",
      dove: "Sezione Hub della home e pagine hub: stato da «in arrivo» ad «attivo».",
      consiglio: "Decidi sui numeri veri della lista d'attesa, non sull'intuito. Per Medicina l'obiettivo realistico è il 2027/28 (il semestre filtro 2026/27 è troppo vicino).",
      schermata: [
        { t: "stats", items: [["—", "iscritti Giurisprudenza"], ["—", "iscritti Medicina"], ["0", "studenti nel team"]] },
        { t: "nota", testo: "I numeri compaiono quando la lista d'attesa ha dati reali." },
      ],
      serve: ["Dati della lista d'attesa", "Studenti disposti a costruire l'hub", "Piano ufficiale verificato sul Course Catalogue UniFi"],
      domande: ["Soglia minima di iscritti?", "Quali 3 esami per primi?"],
      storico: [["2026-10-06", "Criterio: iscritti + persone disponibili."]],
    },
    {
      id: "L09", titolo: "Voci degli studenti", gruppo: "Fiducia", stato: "Da decidere", impatto: 3, sforzo: 1, area: "",
      origine: "Landing v1 (sezione «Cosa dicono gli studenti»)",
      problema: "La v1 mostrava testimonianze di esempio: pubblicate come vere sarebbero recensioni false (vietate dalla normativa europea sulle pratiche commerciali).",
      proposta: "Tolta dalla home. La sezione si accende solo con almeno tre feedback reali raccolti con il form sulle dispense, con consenso scritto.",
      dove: "Home, dopo «Chi c'è dietro».",
      consiglio: "Meglio un numero vero («876 persone nell'ultimo mese») che tre frasi inventate: la home usa già i numeri di Google.",
      schermata: [
        { t: "cards", titolo: "Come apparirebbe (esempio, NON vero)", items: [["«Testo di esempio»", "Nome Cognome · II anno · EA"], ["«Testo di esempio»", "Nome Cognome · I anno · EC"], ["«Testo di esempio»", "Nome Cognome · III anno · EA"]] },
        { t: "nota", testo: "Si accende solo con feedback reali e consenso." },
      ],
      serve: ["Form di feedback sulle dispense", "Consenso scritto di chi viene citato"],
      domande: ["Quanti feedback prima di accenderla (3? 5?)"],
      storico: [["2026-10-06", "Rimossa dalla home della v2: card in attesa di feedback reali."]],
    },
  ],
};
