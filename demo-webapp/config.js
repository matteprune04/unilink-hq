// UniLink · Web app (area personale) — CONFIGURAZIONE DELLA DEMO
// -----------------------------------------------------------------------------
// Questo è l'unico file da toccare per cambiare COSA c'è nella demo.
// Il design (app.css) e il funzionamento (app.js) leggono da qui.
// Riferimento: UniLink_Architettura_WebApp.pdf (cap. "Registro" e "Catalogo").
//
//   UL_HUB         → le aree di studio (stesso modello di hub.csv della landing)
//   UL_MODULI      → le voci SICURE della sidebar (decise, mostrate come saranno)
//   (gli strumenti stanno in tools.js, file condiviso con la landing: una voce + una funzione)
//   UL_UTENTE      → l'account demo (dati di esempio)
//   UL_DA_DECIDERE → le card della sezione arancio "DA DECIDERE"
//                    (ogni card = un'architettura demo, non ancora decisa)
// -----------------------------------------------------------------------------

window.UL_VERSIONE = { n: 2, data: "2026-10-06", nota: "Web app v2: strumenti dentro la app (nessun link al sito attuale), strumenti per Giurisprudenza e Medicina, versione tablet, card D13 Mentoring e D14 Strumenti per corso." };

window.UL_LANDING = "../demo-landing/";   // la demo della landing (stesso repository, cartella accanto)
window.UL_WA = "https://chat.whatsapp.com/KdA4r1POh6MAiBbLmmES0L";

// Stato: "attivo" | "in_arrivo". Tinte derivate dalla palette (cap. 4 della landing).
window.UL_HUB = [
  { slug: "economia", nome: "Economia", stato: "attivo", tinta: "#f6e4d1", ateneo: "UniFi",
    corsi: ["Economia Aziendale", "Economia e Commercio"],
    fasi: [["Inizia", "Piano di studi, primi esami, metodo."], ["Studia", "Dispense, mappe e quiz per ogni esame."], ["Prosegui", "Erasmus, voto di laurea, magistrali."]] },
  { slug: "giurisprudenza", nome: "Giurisprudenza", stato: "in_arrivo", tinta: "#dfe4f1", ateneo: "UniFi",
    corsi: ["Giurisprudenza (ciclo unico)"], domanda: "A che anno sei?", decidere: "D01",
    fasi: [["Inizia", "I primi esami istituzionali e come si studia un codice."], ["Studia", "Schemi, casi e domande d'esame."], ["Prosegui", "Tesi, pratica, concorsi."]] },
  { slug: "medicina", nome: "Medicina", stato: "in_arrivo", tinta: "#ebe4d5", ateneo: "UniFi",
    corsi: ["Medicina e Chirurgia"], domanda: "Sei nel semestre filtro?", decidere: "D02",
    fasi: [["Inizia", "Il semestre filtro: Fisica, Chimica, Biologia."], ["Studia", "Esami del triennio pre-clinico."], ["Prosegui", "Clinica, tirocini, specializzazione."]] },
];

// Le voci SICURE della sidebar. "hub": ["tutti"] oppure gli slug degli hub dove la sezione ha contenuto.
// Per aggiungerne una: una riga qui + una funzione in app.js (VISTE). Regola: max 6 voci.
window.UL_MODULI = [
  { id: "oggi", nome: "Oggi", icona: "casa", hub: ["tutti"], tab: true },
  { id: "esami", nome: "I miei esami", icona: "calendario", hub: ["tutti"], tab: true },
  { id: "dispense", nome: "Dispense", icona: "libro", hub: ["economia"], tab: true },
  { id: "strumenti", nome: "Strumenti", icona: "attrezzi", hub: ["tutti"], tab: true },
  { id: "profilo", nome: "Profilo", icona: "utente", hub: ["tutti"], tab: true },
];

// Account demo: dati di ESEMPIO (non reali). Le date d'esame le inserisce lo studente.
window.UL_UTENTE = {
  nome: "Giulia", cognome: "Rossi", email: "giulia.rossi@stud.unifi.it",
  hub: "economia", corso: "Economia Aziendale", anno: "II",
  media: 27.4, lodi: 1,
  esami: [
    { slug: "microeconomia", data: "2026-11-03", obiettivo: 28,
      argomenti: ["Domanda e offerta", "Elasticità", "Scelte del consumatore", "Costi di produzione", "Concorrenza perfetta", "Monopolio", "Oligopolio"], fatti: [0, 1, 2] },
    { slug: "statistica", data: "2026-11-17", obiettivo: 27,
      argomenti: ["Statistica descrittiva", "Probabilità", "Variabili aleatorie", "Distribuzione normale", "Inferenza", "Regressione"], fatti: [0] },
  ],
  salvate: ["microeconomia", "statistica", "macroeconomia"],
};

// -----------------------------------------------------------------------------
// DA DECIDERE — ogni card è una proposta NON decisa, con la sua architettura demo.
// Campi: id (Dxx, non cambia mai), titolo, gruppo, stato (dall'HQ), origine, impatto/sforzo (HQ),
// problema, proposta, dove (in quale punto dell'app vivrebbe), schermata (blocchi della mini demo),
// serve (dati, strumenti, dipendenze), domande (cosa decidere), storico (richieste nel tempo).
// Tipi di blocco per "schermata": hero, navy, stats, cards, list, steps, form, progress, quiz, prezzi, chips, nota.
// -----------------------------------------------------------------------------
window.UL_DA_DECIDERE = [
  {
    id: "D01", titolo: "Hub Giurisprudenza attivo", gruppo: "Nuovi hub", stato: "In arrivo", origine: "Nota Cosimo 6/10 · landing cap. 10",
    impatto: 5, sforzo: 4,
    problema: "Oggi l'hub è «in arrivo»: raccogliamo la lista d'attesa ma non abbiamo materiali né studenti nel team.",
    proposta: "Quando l'hub parte, lo studente di Giurisprudenza vede lo STESSO guscio di Economia: cambiano solo i contenuti, presi dalla configurazione dell'hub.",
    dove: "Selettore hub in cima alla sidebar → tutte le sezioni sicure si riempiono con i contenuti di Giurisprudenza.",
    schermata: [
      { t: "hero", eyebrow: "Giurisprudenza · UniFi", titolo: "Cosa prepari *oggi*, Luca?", testo: "Il prossimo appello è tra 21 giorni." },
      { t: "navy", badge: "Il prossimo passo", titolo: "Diritto privato · Le obbligazioni", testo: "Ripassa lo schema e fai le 10 domande d'esame.", cta: ["Apri lo schema", "Domande d'esame"] },
      { t: "cards", titolo: "Inizia · Studia · Prosegui", items: [["Inizia", "Come si studia sul codice, i primi esami istituzionali."], ["Studia", "Schemi, casi giurisprudenziali, domande raccolte."], ["Prosegui", "Tesi, pratica forense, concorsi."]] },
      { t: "list", titolo: "Dispense dell'hub (esempio)", items: [["Istituzioni di diritto privato", "I anno · schemi + domande", "In preparazione"], ["Diritto costituzionale", "I anno · schemi", "In preparazione"], ["Storia del diritto", "I anno", "Cerchiamo autori"]] },
    ],
    serve: ["Almeno 1–2 studenti di Giurisprudenza nel team (materiali e revisione)", "Piano ufficiale del corso verificato sul Course Catalogue UniFi", "Riga hub in config: stato da in_arrivo ad attivo", "Dispense con campo Hub = giurisprudenza"],
    domande: ["Parte prima Giurisprudenza o Medicina? (decide il numero di iscritti in lista d'attesa)", "Quali 3 esami per primi?", "Le domande d'esame raccolte entrano dal giorno 1?"],
    storico: [["2026-10-06", "Prima architettura: stesso guscio di Economia, contenuti da configurazione."]],
  },
  {
    id: "D02", titolo: "Hub Medicina attivo", gruppo: "Nuovi hub", stato: "In arrivo", origine: "Nota Cosimo 6/10 · landing cap. 1 e 10",
    impatto: 5, sforzo: 5,
    problema: "Il semestre filtro (Fisica, Chimica, Biologia) è uguale in tutta Italia, con esami il 10 dicembre e l'11 gennaio: per il 2026/27 è tardi, l'obiettivo realistico è il 2027/28.",
    proposta: "Hub con una fase «Inizia» dedicata al semestre filtro: conto alla rovescia agli appelli nazionali, piano settimanale e quiz per materia.",
    dove: "Stesso guscio: la home «Oggi» mostra il conto alla rovescia del semestre filtro al posto del prossimo appello.",
    schermata: [
      { t: "hero", eyebrow: "Medicina · semestre filtro", titolo: "Mancano *65 giorni* al primo appello", testo: "Date di esempio: vanno verificate sulle fonti ufficiali." },
      { t: "progress", titolo: "Le tre materie", items: [["Fisica", 40], ["Chimica", 55], ["Biologia", 30]] },
      { t: "steps", titolo: "Questa settimana", items: [["Lun", "Cinematica · 20 quiz"], ["Mer", "Stechiometria · ripasso errori"], ["Ven", "Cellula · schema + 15 quiz"]] },
      { t: "nota", testo: "Settore competitivo: va deciso se puntare sul semestre filtro o sugli esami successivi." },
    ],
    serve: ["Studenti di Medicina disponibili a costruirlo", "Fonti ufficiali per date e programma del semestre filtro", "Banca di domande per le tre materie (vedi D03)"],
    domande: ["Partire dal semestre filtro o dagli esami del triennio?", "Ciclo realistico: 2027/28?", "Quiz in comune con D03 (Esercitazioni)?"],
    storico: [["2026-10-06", "Prima architettura con fase «semestre filtro»."]],
  },
  {
    id: "D03", titolo: "Esercitazioni e simulatore d'esame", gruppo: "Studio", stato: "In arrivo", origine: "Demo Versione B · landing (tools «in arrivo»)",
    impatto: 5, sforzo: 3,
    problema: "I quiz oggi sono dentro le dispense; manca un posto dove allenarsi e ritrovare gli errori.",
    proposta: "Una sezione «Esercitazioni»: quiz rapido, ripasso errori (una domanda sbagliata torna finché non la azzecchi due volte di fila), simulazione a tempo in trentesimi.",
    dove: "Diventerebbe la 6ª voce sicura della sidebar, tra «Dispense» e «Strumenti».",
    schermata: [
      { t: "navy", badge: "Ripassa gli errori", titolo: "Microeconomia · 6 domande da ripassare", testo: "Le domande che hai sbagliato tornano finché non le azzecchi due volte di fila.", cta: ["Inizia il ripasso", "Simulazione a tempo"] },
      { t: "quiz", domanda: "In concorrenza perfetta, nel lungo periodo il profitto economico è:", opzioni: ["Positivo", "Nullo", "Negativo", "Dipende dalla domanda"], giusta: 1 },
      { t: "stats", items: [["28", "domande svolte"], ["71%", "risposte giuste"], ["19 gg", "al prossimo appello"]] },
    ],
    serve: ["Banca di domande per esame (formato CSV: esame, domanda, opzioni, giusta, spiegazione)", "Database per salvare le risposte di ogni studente (Supabase)", "Collegamento con D07 (domande raccolte)"],
    domande: ["Gratis o dentro un pacchetto?", "Quanti esami pilota (3?)", "Chi scrive le spiegazioni?"],
    storico: [["2026-10-06", "Prima architettura ripresa dalla Versione B, senza prezzi."]],
  },
  {
    id: "D04", titolo: "Piano di studio guidato", gruppo: "Studio", stato: "In arrivo", origine: "Testing Version (Il mio piano) · idea pricing (piano con AI)",
    impatto: 4, sforzo: 3,
    problema: "Lo studente sa la data dell'appello ma non come distribuire gli argomenti nei giorni che mancano.",
    proposta: "Dalla data dell'esame e dagli argomenti di «I miei esami» la app propone un calendario settimanale; più avanti con l'AI (stile «TTP» del GMAT).",
    dove: "Dentro «I miei esami» come scheda «Piano», non come voce nuova.",
    schermata: [
      { t: "hero", eyebrow: "Piano · Microeconomia", titolo: "4 settimane, *7 argomenti*", testo: "Il piano si aggiorna quando segni un argomento come ripassato." },
      { t: "steps", items: [["Sett. 1", "Domanda e offerta · Elasticità"], ["Sett. 2", "Scelte del consumatore · Costi"], ["Sett. 3", "Concorrenza · Monopolio"], ["Sett. 4", "Oligopolio · simulazione completa"]] },
    ],
    serve: ["Argomenti ufficiali per esame (dal programma)", "Regola di distribuzione semplice (prima senza AI)", "Eventuale API AI in una fase successiva"],
    domande: ["Versione semplice (regole) prima dell'AI?", "Promemoria via email?"],
    storico: [["2026-10-06", "Prima architettura: scheda dentro «I miei esami»."]],
  },
  {
    id: "D05", titolo: "Pacchetti, prezzi e Plus", gruppo: "Monetizzazione", stato: "Nuova", origine: "HQ · Prezzi & abbonamenti · Stripe",
    impatto: 3, sforzo: 3,
    problema: "Il listino non è deciso: appunti singoli, dispensa completa, bundle semestre/anno, Plus mensile sono tutte ipotesi.",
    proposta: "Una pagina «Pacchetti» pronta ma spenta, che legge il listino dalla configurazione (come /prezzi della landing). Pagamento con Stripe Checkout, sblocco automatico via webhook su Supabase.",
    dove: "Voce in «Profilo» (Acquisti) + pulsante «Sblocca» sulla scheda dispensa. Nessuna voce in sidebar finché non è deciso.",
    schermata: [
      { t: "prezzi", items: [{ nome: "Appunti di un esame", include: ["Appunti completi"] }, { nome: "Dispensa completa", include: ["Appunti", "Mappe", "Quiz ed esercizi"], evidenza: true }, { nome: "Pacchetto semestre", include: ["Gli esami del tuo semestre"] }] },
      { t: "nota", testo: "Prezzi: DA DECIDERE. Se useremo prezzi di lancio: «prezzo di lancio fino al …, poi …», mai il prezzo barrato (art. 17-bis Codice del Consumo)." },
    ],
    serve: ["Listino deciso (sondaggio)", "Account Stripe e soggetto legale", "Webhook Stripe → Supabase", "Termini di vendita e privacy"],
    domande: ["Cosa resta gratis?", "Bundle per anno o per semestre?", "Upgrade da appunti a dispensa che riconosce quanto pagato?"],
    storico: [["2026-10-06", "Pagina pronta ma spenta, prezzi «DA DECIDERE»."]],
  },
  {
    id: "D06", titolo: "Lettore protetto delle dispense", gruppo: "Studio", stato: "Nuova", origine: "HQ · Visualizzazione material in sito",
    impatto: 3, sforzo: 3,
    problema: "Oggi le dispense si aprono sul sito: il PDF può girare senza controllo.",
    proposta: "Lettore nella app con PDF.js: niente download diretto, filigrana con nome ed email generata dal server (pdf-lib), file in archivio privato Supabase.",
    dove: "Pulsante «Leggi» sulla scheda dispensa, a tutto schermo.",
    schermata: [
      { t: "hero", eyebrow: "Lettore · Microeconomia", titolo: "Capitolo 6 · *Monopolio*", testo: "Pagina 47 di 85 · filigrana: giulia.rossi@stud.unifi.it" },
      { t: "chips", items: ["Indice", "Mappe", "Segnalibri", "Vai ai quiz"] },
      { t: "nota", testo: "Nessuna protezione è assoluta (screenshot): la filigrana serve a scoraggiare, non a impedire." },
    ],
    serve: ["Archivio privato (Supabase Storage)", "Funzione server per la filigrana", "PDF.js nel frontend"],
    domande: ["Serve davvero al lancio o dopo i pagamenti?", "Download consentito per chi ha pagato?"],
    storico: [["2026-10-06", "Prima architettura."]],
  },
  {
    id: "D07", titolo: "Raccolta domande d'esame", gruppo: "Community", stato: "In sviluppo (HQ)", origine: "HQ · Raccolta domande esami",
    impatto: 5, sforzo: 3,
    problema: "Le domande vere degli appelli sono la cosa più utile e più dispersa.",
    proposta: "Form «Hai appena fatto l'esame?»: esame, data, domande ricevute. Revisione del team, poi le domande entrano in D03. In cambio crediti o riconoscimento come contributor.",
    dove: "Card in «Oggi» il giorno dopo un appello inserito in «I miei esami».",
    schermata: [
      { t: "form", titolo: "Com'è andato l'esame di Microeconomia?", campi: ["Data dell'appello", "Domande che ti ricordi", "Scritto / orale"], cta: "Invia al team" },
      { t: "stats", items: [["+50", "crediti (ipotesi)"], ["48 h", "tempo di revisione"], ["0", "dati personali pubblicati"]] },
    ],
    serve: ["Regola di ricompensa (crediti, sconto, commissione)", "Flusso di revisione nell'HQ", "Collegamento a D03"],
    domande: ["Crediti, sconto o commissione sugli appunti?", "Anonimo di default?"],
    storico: [["2026-10-06", "Prima architettura: form + revisione."]],
  },
  {
    id: "D08", titolo: "Community e gruppi di studio", gruppo: "Community", stato: "Nuova", origine: "HQ · SOCIALNETWORK (Gianmarco) · Testing Version Network",
    impatto: 3, sforzo: 4,
    problema: "Trovare compagni con lo stesso esame oggi passa solo da WhatsApp.",
    proposta: "Partire piccoli: «Sto preparando questo esame e cerco un gruppo» come scelta esplicita. Nessuno vede cosa hai scaricato. Il social generalista resta un'evoluzione.",
    dove: "Scheda «Gruppi» dentro «I miei esami», per esame.",
    schermata: [
      { t: "list", titolo: "Gruppi per Microeconomia (esempio)", items: [["Gruppo Novoli · martedì", "4 persone · in presenza", "Unisciti"], ["Serale online", "3 persone · online", "Unisciti"]] },
      { t: "nota", testo: "Privacy: profilo privato di default, partecipazione solo su scelta esplicita." },
    ],
    serve: ["Moderazione", "Regole privacy chiare", "Notifiche email"],
    domande: ["Basta il link al gruppo WhatsApp per esame?", "Profili visibili tra studenti?"],
    storico: [["2026-10-06", "Prima architettura: gruppi per esame, non social generalista."]],
  },
  {
    id: "D09", titolo: "Career: CV e percorso", gruppo: "Dopo la laurea", stato: "Nuova", origine: "HQ · CURRICULUM (quick win) · Demo Versione C",
    impatto: 4, sforzo: 2,
    problema: "Chi pensa a magistrali e stage non sa quanto il proprio CV sia vicino al profilo tipo.",
    proposta: "Primo passo leggero: confronto CV con un profilo tipo per carriera (quick win). Career Score e opportunità (Versione C) solo nella visione.",
    dove: "Dentro «Strumenti» come tool, non come sezione.",
    schermata: [
      { t: "progress", titolo: "Il tuo CV vs profilo «Finance»", items: [["Percorso accademico", 77], ["Lingue e test", 50], ["Esperienze", 40]] },
      { t: "steps", titolo: "Prossime 3 azioni", items: [["1", "Certificazione d'inglese"], ["2", "Uno stage o un progetto"], ["3", "Shortlist di 3 magistrali"]] },
    ],
    serve: ["Profili tipo scritti dal team", "Upload CV (privato)"],
    domande: ["Tool semplice ora, Career Score dopo?"],
    storico: [["2026-10-06", "Prima architettura: tool in «Strumenti»."]],
  },
  {
    id: "D10", titolo: "Borse di studio", gruppo: "Orientamento", stato: "Nuova", origine: "HQ · BORSE DI STUDIO",
    impatto: 4, sforzo: 4,
    problema: "Molti studenti non sanno dove trovare i bandi (DSU e altri).",
    proposta: "Mini guida con le informazioni chiave del bando e le scadenze, con link alla fonte ufficiale. Automatismo solo dopo.",
    dove: "Dentro «Strumenti» come guida.",
    schermata: [
      { t: "list", titolo: "Scadenze (esempio, da verificare)", items: [["Borsa DSU", "Fonte: bando ufficiale", "Vedi guida"], ["Esonero tasse", "Fonte: UniFi", "Vedi guida"]] },
      { t: "nota", testo: "All'UniFi non esistono borse per merito (commento Cosimo): solo per reddito." },
    ],
    serve: ["Fonti ufficiali aggiornate", "Chi aggiorna e quando"],
    domande: ["Guida statica o aggiornamento automatico?"],
    storico: [["2026-10-06", "Prima architettura."]],
  },
  {
    id: "D11", titolo: "Guida tesi", gruppo: "Dopo la laurea", stato: "Nuova", origine: "HQ · NEW Tool - TESI",
    impatto: 4, sforzo: 3,
    problema: "Scegliere argomento e relatore e impaginare la tesi è confuso.",
    proposta: "Percorso in 4 passi (argomento, relatore, scrittura, consegna) + template già impaginato da scaricare.",
    dove: "Dentro «Strumenti» come guida.",
    schermata: [
      { t: "steps", items: [["1", "Scegli l'argomento"], ["2", "Contatta il relatore"], ["3", "Scrivi con il template"], ["4", "Consegna e scadenze"]] },
    ],
    serve: ["Template Word/LaTeX", "Regole di consegna ufficiali"],
    domande: ["Solo Economia o anche nuovi hub?"],
    storico: [["2026-10-06", "Prima architettura."]],
  },
  {
    id: "D12", titolo: "Test d'ingresso (TOLC)", gruppo: "Orientamento", stato: "Nuova", origine: "HQ · TOLC",
    impatto: 5, sforzo: 5,
    problema: "Far conoscere UniLink ai futuri studenti prima dell'iscrizione.",
    proposta: "Percorso «Test Prep» separato (come nella Testing Version): diagnostico gratuito e quiz per materia.",
    dove: "Hub dedicato o modalità dell'account, non nella sidebar degli studenti iscritti.",
    schermata: [
      { t: "stats", items: [["20", "domande diagnostiche"], ["4", "materie"], ["0 €", "diagnostico"]] },
      { t: "nota", testo: "Settore competitivo e a Firenze molti corsi sono ad accesso libero: valutare dopo i nuovi hub." },
    ],
    serve: ["Banca domande TOLC", "Decisione strategica"],
    domande: ["Ha senso prima dei nuovi hub?"],
    storico: [["2026-10-06", "Prima architettura."]],
  },
  {
    id: "D13", titolo: "Mentoring tra pari", gruppo: "Community", stato: "Nuova", origine: "Nota Matteo 6/10 · landing L03",
    impatto: 4, sforzo: 5,
    problema: "Gli studenti più avanti sanno cose che i più giovani cercano, ma lo scambio non è organizzato.",
    proposta: "Un mentore (studente avanzato o laureato) per esame o per percorso: una chiamata breve, domande ricorrenti, consigli. Si parte dagli ambassador.",
    dove: "Scheda «Mentori» dentro «I miei esami», per esame; non una voce nuova.",
    consiglio: "Non al lancio: è il più costoso da gestire (selezione, qualità, responsabilità). Prima una prova manuale con 5 ambassador e 20 studenti; se si ripete, si costruisce.",
    schermata: [
      { t: "list", titolo: "Mentori per Microeconomia (esempio)", items: [["Giulia · III anno EA", "Martedì e giovedì · 20 minuti", "Prenota"], ["Marco · laureato EC", "Sabato · tesi, Erasmus", "Prenota"]] },
      { t: "nota", testo: "Da decidere prima: gratuito o a pagamento? chi garantisce la qualità? chi risponde se qualcosa va storto?" },
    ],
    serve: ["Criteri di selezione dei mentori", "Regole di comportamento e privacy", "Prenotazione (calendario)", "Decisione su gratuito / a pagamento"],
    domande: ["Prova manuale prima di costruire?", "Per esame o per percorso?", "Gratuito, con crediti o a pagamento?"],
    storico: [["2026-10-06", "Prima architettura: scheda Mentori dentro I miei esami."]],
  },
  {
    id: "D14", titolo: "Strumenti per corso: quali costruire", gruppo: "Strumenti", stato: "Nuova", origine: "Nota Matteo 6/10 · stile «Sarfatti Prep» (Bocconi)",
    impatto: 4, sforzo: 2,
    problema: "Gli strumenti di Economia non servono a chi studia altro: ogni hub ha bisogno dei suoi, ma non tutti vale la pena costruirli.",
    proposta: "Un registro strumenti in tools.js con il campo hub: aggiungerne uno = una voce + una funzione. Strumenti semplici e veloci in landing, versione completa (salvata nel profilo) nell'area personale.",
    dove: "Voce «Strumenti» (P04): l'elenco si filtra da solo per l'hub dello studente.",
    consiglio: "Costruisci prima gli strumenti con regole certe (media, voto di laurea, piano): sono credibili e portano traffico. Quelli con regole ufficiali da verificare (Erasmus, ciclo unico, semestre filtro) restano «di esempio» finché qualcuno non controlla il regolamento.",
    schermata: [
      { t: "list", titolo: "Per tutti", items: [["Media e voto obiettivo", "Regole certe · già in demo", "Pronto"], ["Piano per l'appello", "Regole semplici · già in demo", "Pronto"], ["Borse e scadenze", "Serve chi aggiorna i bandi", "Idea"]] },
      { t: "list", titolo: "Economia", items: [["Voto di laurea", "Regole v5 · già in demo", "Pronto"], ["Erasmus completo", "Punteggio + mete nel profilo", "Idea"], ["Confronto magistrali", "Requisiti e scadenze", "Idea"]] },
      { t: "list", titolo: "Giurisprudenza", items: [["Voto di laurea ciclo unico", "Regole di esempio da verificare", "Demo"], ["Piano di studio sul codice", "Articoli e istituti per giorno", "Idea"], ["Scadenze concorsi e pratica", "Fonti ufficiali", "Idea"]] },
      { t: "list", titolo: "Medicina", items: [["Piano semestre filtro", "Ore per materia · esempio", "Demo"], ["Simulatore a tempo per materia", "Dipende dalla banca domande (D03)", "Idea"], ["Calendario appelli nazionali", "Fonti ufficiali", "Idea"]] },
    ],
    serve: ["Per ogni strumento: regole ufficiali verificate", "Un responsabile degli aggiornamenti annuali", "Evento di misura (usa_strumento)"],
    domande: ["Quali tre strumenti per hub al lancio?", "Quelli con regole da verificare: pubblicarli come «esempio» o aspettare?"],
    storico: [["2026-10-06", "Prima architettura: registro per hub, strumenti rapidi in landing e completi in area."]],
  },
];
