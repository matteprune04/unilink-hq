/* UniLink — contenuti della pagina Guida (S14), separati dalla grafica.
   In Framer: una collezione CMS «Guide» (una voce per facoltà) con capitoli → sezioni → blocchi.
   Economia (triennale) = testo della «Guida essenziale» (aggiornata ad agosto 2026), ridotto al minimo indispensabile.
   Le altre facoltà = solo architettura (stessi capitoli, contenuti da scrivere con chi studia lì).
   «breve» = sintesi UniLink del capitolo, scritta per la pagina (non è testo del PDF).
   Tipi di blocco: cards · passi · tabella · frase · box · cta · formula · lista · mappa. «apri: true» = sezione apribile. */
window.UL_GUIDA = {
  aggiornata: "agosto 2026",
  facolta: [
    { id: "economia", nome: "Economia", sotto: "triennale · EA ed EC", ico: "€", stato: "completa" },
    { id: "giurisprudenza", nome: "Giurisprudenza", sotto: "ciclo unico", ico: "§", stato: "architettura", hub: "giurisprudenza", dopo: "Professioni legali" },
    { id: "medicina", nome: "Medicina", sotto: "Scienze della Salute Umana", ico: "+", stato: "architettura", hub: "medicina", dopo: "Tirocini e specializzazione" },
    { id: "ingegneria", nome: "Ingegneria", sotto: "", ico: "△", stato: "architettura" },
    { id: "scienze", nome: "Scienze", sotto: "Matematiche, Fisiche e Naturali", ico: "∑", stato: "architettura" },
    { id: "architettura", nome: "Architettura", sotto: "", ico: "⌂", stato: "architettura" },
    { id: "psicologia", nome: "Psicologia", sotto: "", ico: "ψ", stato: "architettura" },
    { id: "politiche", nome: "Scienze Politiche", sotto: "", ico: "◎", stato: "architettura" },
    { id: "umanistici", nome: "Studi Umanistici", sotto: "e della Formazione", ico: "¶", stato: "architettura" },
    { id: "agraria", nome: "Agraria", sotto: "", ico: "✿", stato: "architettura" },
  ],

  // Architettura comune per le facoltà non ancora scritte: stessi capitoli della guida Economia.
  schema: [
    { n: "01", titolo: "Orientarsi", sezioni: ["Come funziona il corso", "Piano di studi e curriculum"] },
    { n: "02", titolo: "Metodo e sessione", sezioni: ["Metodo per tipo di esame", "Devo seguire le lezioni?", "Come preparare la sessione", "Quali materiali usare", "La media: quanto conta davvero"] },
    { n: "03", titolo: "Erasmus e vita universitaria", sezioni: ["Erasmus: cosa guarda la selezione", "Erasmus in pratica", "Università oltre gli esami"] },
    { n: "04", titolo: "Sbocchi professionali", sezioni: ["La career map della facoltà", "Le aree principali, una per una", "Confrontare le carriere", "Se non sai cosa scegliere"] },
    { n: "05", titolo: "Dopo la laurea", sezioni: ["Cosa puoi fare dopo", "Percorsi post-laurea", "Lavoro, tirocinio o gap"] },
    { n: "06", titolo: "Chiudere bene", sezioni: ["Gli errori che avremmo evitato", "Il punto di UniLink", "Fonti utili"] },
  ],

  economia: {
    titolo: "Guida essenziale · Economia UniFi",
    intro: "Il primo anno di Economia ha una caratteristica strana: nessuna singola cosa è davvero complicatissima da capire, ma nessuno ti spiega il sistema nel suo insieme. Questa guida traduce l’università dal linguaggio amministrativo al linguaggio di uno studente.",
    uso: [
      "Leggila una volta tutta, senza trasformarla in un altro esame da studiare.",
      "Torna alle sezioni quando devi prendere una decisione concreta.",
      "Usa i link UniLink per passare dalla spiegazione al tool, al corso o alla risorsa.",
      "Controlla le fonti ufficiali quando si parla di scadenze, bandi o regole.",
    ],
    obiettivo: "Capire come funziona il gioco prima che siano gli errori a spiegartelo.",
    capitoli: [
      // ───────────────────────────────── 01
      { id: "orientarsi", n: "01", titolo: "Orientarsi", sotto: "Come è costruito il percorso", img: "novoli-piazza.jpg", ico: "bussola",
        breve: ["180 CFU: i CFU pesano anche nella media.", "EA ed EC condividono quasi tutto il primo anno.", "Il curriculum orienta, non firma un contratto."],
        sezioni: [
          { titolo: "Come funziona Economia UniFi", sotto: "Non è il liceo con lezioni più lunghe",
            intro: "In realtà cambia soprattutto una cosa: sei tu a dover gestire il percorso. Nessuno ti rincorre se rimani indietro, e proprio per questo conviene capire subito come è costruito.",
            blocchi: [
              { t: "cards", cols: 3, items: [
                { k: "180 CFU", h: "La laurea sono 180 CFU", p: "I CFU misurano il peso delle attività. Un esame da 12 CFU pesa più di uno da 6 anche nella media ponderata: non è sempre «il doppio più difficile», ma ha più peso accademico." },
                { k: "Primo anno", h: "EA ed EC partono molto vicine", p: "Nel 2026/27 condividono Microeconomia, Matematica I, Diritto Pubblico, Economia Aziendale, Economia e Gestione delle Imprese e Statistica. Il primo anno serve anche a capire quale modo di ragionare ti viene più naturale." },
                { k: "Calendario", h: "Appelli e sessioni", p: "L’esame non si dà «quando finisce il corso». Hai appelli distribuiti nelle sessioni e scegli tu quando presentarti: libertà utile, finché non rimandi ogni decisione alla settimana prima." },
                { k: "Frequenza", h: "Frequentante e non frequentante", p: "Non è un’etichetta morale. In alcuni corsi cambia davvero materiale, prova o modo di prepararsi; in altri poco. Guarda il corso specifico, non la regola generale." },
                { k: "Piano", h: "Il piano di studi non è un dettaglio", p: "È l’elenco ufficiale degli esami per laurearti. Va presentato nelle finestre previste, con curriculum ed esami a scelta. Se qualcosa non torna, non aspettare il terzo anno." },
                { k: "Voto finale", h: "Media e voto di laurea", p: "Il voto finale non è semplicemente «media × 110 / 30»: regolamento, prova finale e altri elementi possono cambiare il risultato. Usa il simulatore, non andare a sensazione." },
              ] },
              { t: "cta", testo: "Simula il voto di laurea", href: "tools.html#voto-cdl" },
            ] },
          { titolo: "Curriculum", sotto: "Scegliere dove mettere il peso",
            intro: "Arriva il momento in cui UniFi ti lascia un po’ di spazio per scegliere. E compare il metodo più diffuso: «qual è quello più facile?». Domanda legittima, ma non dovrebbe essere l’unica.",
            blocchi: [
              { t: "cards", cols: 2, items: [
                { k: "Corso", h: "Economia Aziendale", lista: ["Management", "Marketing, Internazionalizzazione e Qualità (MIQ)"] },
                { k: "Corso", h: "Economia e Commercio", lista: ["Economia e Diritto", "Economia Politica e Mercati Finanziari", "Economics and Data"] },
              ] },
              { t: "frase", testo: "Il curriculum orienta il percorso, non ti firma un contratto per il resto della vita." },
              { t: "passi", stile: "riga", items: [
                { h: "Parti da quello che vuoi capire", p: "Usa gli opzionali per approfondire un’area o testarne una nuova. Non serve avere già una carriera definita." },
                { h: "Guarda il semestre intero", p: "Un esame interessante ma pesantissimo in un semestre già saturo può essere peggio di un corso leggermente meno «perfetto»." },
                { h: "Non comprare solo il titolo", p: "Due esami di finanza non creano un «minor in investment banking». Ti danno competenze e segnali utili, ed è già abbastanza." },
              ] },
            ] },
        ] },

      // ───────────────────────────────── 02
      { id: "metodo", n: "02", titolo: "Metodo e sessione", sotto: "Studiare nella forma in cui dovrai performare", img: "biblioteca.jpg", ico: "libro",
        breve: ["Il metodo dipende dalla prova, non da te.", "Simula presto: il mock è diagnosi, non premio.", "La sessione è un portafoglio: proteggi il collo di bottiglia."],
        sezioni: [
          { titolo: "Metodo di studio intelligente", sotto: "Il metodo dipende dalla prova",
            intro: "Non esiste un sistema unico per qualunque materia. Se studi Statistica come Diritto Privato, o il contrario, puoi impegnarti tantissimo e ottenere comunque un risultato mediocre.",
            blocchi: [
              { t: "cards", cols: 2, items: [
                { k: "Matematica, Statistica", h: "Quantitativi", p: "Capisci la logica minima, poi fai esercizi. Gli errori finiscono in un error log, gli esercizi difficili si rifanno a distanza. Il punto è ricostruire il procedimento senza guardare." },
                { k: "Bilancio, contabilità, finanza", h: "Contabili", p: "Teoria ed esercizio insieme: impara le regole, applicale subito, controlla dove sbagli il processo. Un esercizio sbagliato ma capito vale moltissimo." },
                { k: "Organizzazione, management, EGI", h: "Teorici a domande aperte", p: "Costruisci la struttura dell’argomento, richiamala senza appunti, poi rispondi come all’esame: definizione, nesso logico, applicazione." },
                { k: "Privato, commerciale, pubblico", h: "Giuridici / orali", p: "Parti dagli istituti e dai rapporti tra concetti, poi allena l’esposizione ad alta voce. Se sai una cosa solo quando la leggi, all’orale non la sai ancora." },
              ] },
              { t: "frase", testo: "Studia nella stessa forma in cui dovrai performare. Orale? Parla. Esercizio? Calcola. Risposta aperta? Scrivi." },
              { t: "passi", items: [
                { h: "Active recall", p: "Chiudi il materiale e prova a ricostruire. Non «mi sembra familiare?», ma «riesco a produrlo da zero?»." },
                { h: "Simulazioni, prima di sentirti pronto", p: "La simulazione è uno strumento diagnostico: prima scopri dove crolli, prima puoi correggere." },
                { h: "Registro degli errori", p: "Ogni errore ricorrente diventa una riga: cosa ho sbagliato, perché, la regola corretta, come riconoscerlo la prossima volta." },
                { h: "Spaced repetition", p: "Ripassare tutto da capo è inefficiente. Torna sui punti importanti a intervalli, soprattutto su ciò che hai già sbagliato." },
              ] },
            ] },
          { titolo: "Devo seguire le lezioni?", sotto: "Valutala come un investimento di tempo",
            intro: "Alcuni corsi diventano molto più semplici se segui il professore, altri sono gestibili benissimo con materiale strutturato.",
            blocchi: [
              { t: "cards", cols: 3, items: [
                { k: "Prima", h: "Apri programma e slide", p: "Sapere di che argomento si parlerà, non studiarlo in anticipo. Una mappa mentale minima ti fa capire molto di più." },
                { k: "Durante", h: "Non trascrivere ogni frase", p: "Segna esempi, passaggi enfatizzati, differenze rispetto alle slide, indicazioni sull’esame e punti non chiari." },
                { k: "Dopo", h: "Sistema il minimo", p: "Integra due note, evidenzia il dubbio, crea una domanda di richiamo. Non tre ore di «bella copia»." },
              ] },
              { t: "box", tono: "attenzione", h: "Cosa non fare", p: "«Ho seguito tutto il corso» non è una misura di preparazione. Se a fine settimana non sai richiamare, applicare o spiegare quello che hai visto, hai frequentato ma non hai ancora studiato." },
            ] },
          { titolo: "Come preparare la sessione", sotto: "Portfolio management, ma con gli esami",
            intro: "Il problema non è solo quanto studiare ma come distribuire tempo, rischio e attenzione tra esami diversi. Se metti tutto sulle materie più pesanti nello stesso momento, la volatilità sale parecchio.",
            blocchi: [
              { t: "passi", stile: "riga", items: [
                { h: "Proteggi il collo di bottiglia", p: "L’esame che richiede più tempo o ha meno appelli utili detta il calendario, non quello che ti piace di più." },
                { h: "Non aprire quattro fronti", p: "Due esami seri insieme sono già abbastanza. Aprirne quattro «così porto avanti tutto» spesso significa non portare avanti niente." },
                { h: "Usa gli appelli", p: "Il primo appello non è obbligatorio e il secondo non è una punizione. Scegli per preparazione ed effetto sugli esami successivi." },
              ] },
              { t: "box", h: "Accettare o rifiutare un voto?", p: "Guarda peso in CFU, media attuale e costo reale del tentativo successivo. Rifiutare un 24 da 6 CFU con una media alta può spostare pochissimo e costarti settimane. Non esiste una regola unica, esiste un calcolo." },
              { t: "cta", testo: "Forecast · simula la media", href: "tools.html#media" },
            ] },
          { titolo: "Quali materiali usare", sotto: "Non diventare un collezionista di PDF",
            intro: "Il problema raramente è la mancanza di materiale: ne hai così tanto che passi più tempo a scegliere cosa usare che a usarlo.",
            blocchi: [
              { t: "passi", items: [
                { h: "Parti dalla prova", p: "Il materiale serve a preparare quella performance, non a «sapere tutto»." },
                { h: "Scegli una fonte base", p: "Slide + appunti, libro, sbobine o combinazione minima. Evita tre fonti complete in parallelo." },
                { h: "Aggiungi pratica", p: "Esercizi, domande aperte, prove passate, mock: qui trasformi il materiale in prestazione." },
                { h: "Usa gli schemi per ripassare", p: "Lo schema è ottimo quando hai già capito. Come prima esposizione a un argomento complesso nasconde i buchi." },
              ] },
              { t: "cta", testo: "Apri i materiali", href: "materiali.html" },
            ] },
          { titolo: "La media: quanto conta davvero", sotto: "Importante, ma non è la tua identità",
            intro: "Può influire su Erasmus, selezioni, magistrali e voto di laurea. Trattarla come un indice giornaliero del tuo valore è il modo più veloce per decidere peggio.",
            blocchi: [
              { t: "formula", h: "Media ponderata", testo: "Σ (voto × CFU) / Σ CFU" },
              { t: "cards", cols: 3, items: [
                { k: "+", h: "Quando conta di più", p: "Programmi selettivi, borse, Erasmus o margine alto sul voto finale." },
                { k: "−", h: "Quando non va feticizzata", p: "Quando mezzo punto significa bruciare un mese, bloccare altri esami o rifiutare voti senza ritorno concreto." },
                { k: "→", h: "Cosa guardare davvero", p: "Trend, CFU ancora da sostenere, distribuzione dei voti e obiettivi futuri. Una media è un sistema." },
              ] },
              { t: "cta", testo: "Fai una simulazione", href: "tools.html#media" },
            ] },
        ] },

      // ───────────────────────────────── 03
      { id: "erasmus", n: "03", titolo: "Erasmus e vita universitaria", sotto: "Pensarci presto senza viverci sopra", img: "studenti-gruppo.jpg", ico: "aereo",
        breve: ["Regolarità, profitto e lingue contano già adesso.", "Prima della città, il Learning Agreement.", "Core prima, extra dopo."],
        sezioni: [
          { titolo: "Erasmus: tutto quello da sapere", sotto: "Cosa guarda la selezione",
            intro: "Al primo anno sembra lontanissimo, finché esce il bando e scopri che media, CFU, lingua e scelta delle sedi non si improvvisano in due settimane.",
            blocchi: [
              { t: "cards", cols: 3, items: [
                { k: "1", h: "Regolarità", p: "Nel bando 2026/27 la carriera premia anche la regolarità. Accumulare esami non dati ha un costo che va oltre la sessione." },
                { k: "2", h: "Profitto", p: "Media e risultati incidono sulla graduatoria. Non serve vivere per il 30, ma sapere che i voti hanno anche questa funzione." },
                { k: "3", h: "Lingue", p: "La lingua della sede va dimostrata secondo il bando. Arrivare al secondo anno senza aver controllato requisiti è evitabile." },
              ] },
              { t: "box", h: "La scelta della sede", p: "Non scegliere solo la città: lingua, corsi del tuo accordo, compatibilità col piano di studi, periodo, costi e probabilità realistica. Una sede bellissima senza un Learning Agreement sensato diventa un problema molto poco instagrammabile." },
            ] },
          { titolo: "Erasmus in pratica", sotto: "Il percorso, senza burocratese",
            blocchi: [
              { t: "passi", stile: "timeline", items: [
                { h: "Prima del bando", p: "Requisiti linguistici, carriera e sedi dell’anno precedente: le liste cambiano, la logica no." },
                { h: "Quando esce il bando", p: "Leggilo davvero: scadenza, criteri, numero di preferenze, certificazioni accettate, accordi per la tua area." },
                { h: "Scelta delle sedi", p: "Ordina per desiderabilità e fattibilità: qualità accademica, corsi, lingua, costi, città, probabilità di ingresso." },
                { h: "Learning Agreement", p: "Il ponte tra esami all’estero e piano UniFi. Prima di innamorarti di una destinazione, controlla il riconoscimento." },
                { h: "Partenza e rientro", p: "Possibili modifiche al piano durante la mobilità; al rientro conta il riconoscimento corretto. Tieni tutto ordinato." },
              ] },
              { t: "box", tono: "nota", h: "Nota importante", p: "Requisiti, sedi, punteggi e scadenze cambiano ogni anno. La guida ti spiega cosa guardare; la fonte finale resta sempre UniFi." },
              { t: "cta", testo: "Calcola il punteggio Erasmus", href: "tools.html#erasmus" },
            ] },
          { titolo: "Università oltre gli esami", sotto: "Quello che vale la pena fare fuori dall’aula",
            intro: "Le esperienze fuori dall’aula servono quando ti fanno fare qualcosa di reale: lavorare con persone, prenderti responsabilità, provare un settore, usare una competenza.",
            blocchi: [
              { t: "cards", cols: 2, items: [
                { k: "Fare", h: "Associazioni", p: "Entraci se puoi contribuire davvero. Organizzare un evento, gestire un budget o coordinare persone vale più della riga «member»." },
                { k: "Aprire", h: "Inglese", p: "Apre insieme Erasmus, magistrali, internship e lavoro. Se oggi è debole, il primo anno è il momento più economico per sistemarlo." },
                { k: "Chiedere", h: "Eventi e persone", p: "Non serve «networkare» col badge: domande intelligenti a studenti più avanti, per capire decisioni che prenderai tra un anno." },
                { k: "Provare", h: "Internship e progetti", p: "Al primo anno non serve lo stage in IB. Puoi capire cosa ti incuriosisce e costruire piccole esperienze che rendano più facile scegliere." },
              ] },
              { t: "frase", testo: "Core prima, extra dopo. Se gli extra migliorano l’università, bene. Se diventano una scusa per non affrontare gli esami, no." },
            ] },
        ] },

      // ───────────────────────────────── 04
      { id: "sbocchi", n: "04", titolo: "Sbocchi professionali", sotto: "La mappa prima dei dettagli", img: "carriera.jpg", ico: "mappa",
        breve: ["Da 30 possibilità indistinte a 2–3 aree da esplorare.", "Il nome del ruolo non basta: confronta il lavoro vero.", "Indeciso? Tre aree, persone vere, un test piccolo."],
        sezioni: [
          { titolo: "La career map che ti serve davvero", sotto: "Otto famiglie, non trenta titoli",
            intro: "«Con Economia puoi fare tantissime cose» è vero e abbastanza inutile. Il problema non è avere poche alternative: è averne così tante da non sapere quali esistano.",
            blocchi: [
              { t: "mappa", items: [
                { h: "Finance", k: "Aziende + numeri + investimenti", p: "IB · PE · VC · Asset Management · Banking", vai: "s-finance" },
                { h: "Consulting", k: "Problemi diversi + team + clienti", p: "Strategy · Management · Advisory", vai: "s-consulting" },
                { h: "Corporate", k: "Far funzionare un’azienda", p: "Finance · Strategy · Operations · CorpDev", vai: "s-corporate" },
                { h: "Marketing & Sales", k: "Cliente + prodotto + crescita", p: "Brand · Growth · Sales · Business Dev", vai: "s-marketing" },
                { h: "Audit & Accounting", k: "Bilanci + processi + rigore", p: "Audit · Accounting · Tax · Deals", vai: "s-marketing" },
                { h: "Data & Economics", k: "Dati + statistica + decisioni", p: "Analytics · BI · Research · Economics", vai: "s-data" },
                { h: "Institutions", k: "Economia + impatto pubblico", p: "Banche centrali · policy · regolazione", vai: "s-data" },
                { h: "Entrepreneurship", k: "Costruire + imparare veloce", p: "Startup · scaleup · founder path", vai: "s-data" },
              ] },
              { t: "frase", testo: "Obiettivo: passare da 30 possibilità indistinte a 2–3 aree da esplorare sul serio." },
            ] },
          { id: "s-finance", titolo: "Finance", sotto: "«Lavorare in finanza» non è un lavoro", apri: true,
            intro: "Aiutare un’azienda a comprare un concorrente, investire per un fondo, studiare società quotate, finanziare imprese o gestire patrimoni. Prima di dire «mi piace la finanza», capisci quale pezzo.",
            blocchi: [
              { t: "lista", stile: "ruoli", items: [
                { h: "Investment Banking", k: "MSc forte → internship → analyst · Milano / Londra / Parigi / Francoforte", p: "M&A, IPO, debito, valutazioni ed execution. Curva di apprendimento rapidissima, selezione forte, orari spesso molto intensi." },
                { h: "Private Equity", k: "IB → PE · Londra / Parigi / Milano / DACH", p: "Valuti aziende da comprare e segui gli investimenti. Più investitore che advisor; il percorso IB → PE resta molto comune." },
                { h: "VC & Growth", k: "Finance / consulting / startup → VC · Londra / Parigi / Berlino / Amsterdam", p: "Startup, tecnologia, team, mercato e crescita contano più della storia finanziaria lunga. Percorso meno standardizzato." },
                { h: "Asset Management / Research", k: "MSc Finance/Econ → internship · Londra / Zurigo / Parigi / Milano", p: "Società quotate, mercati, portafogli, investment thesis e rischio: «cosa vale la pena comprare»." },
                { h: "Corporate / Private Banking", k: "Triennale/MSc → graduate · Milano / Zurigo / Londra", p: "Finanziamenti alle imprese o gestione patrimoniale. Più componente commerciale e relazionale." },
              ] },
              { t: "frase", testo: "Aziende + numeri + operazioni → IB / Corporate Finance. Investimenti → AM / PE / VC." },
              { t: "fonte", testo: "Sintesi orientativa: pattern WSO/LinkedIn. Ruoli e recruiting variano per team e mercato." },
            ] },
          { id: "s-consulting", titolo: "Consulting", sotto: "Stesso titolo, lavori molto diversi", apri: true,
            intro: "Un’azienda ha un problema e paga un team esterno per risolverlo: strategia, pricing, organizzazione, tecnologia, operations, M&A o risk. «Consultant» da solo dice pochissimo.",
            blocchi: [
              { t: "cards", cols: 2, items: [
                { k: "MBB e non solo", h: "Strategy Consulting", p: "Crescita, mercato, pricing, portfolio, due diligence. McKinsey, BCG e Bain sono i più noti, ma esistono molte firm forti. Selezione: CV + test/case interview + fit." },
                { k: "Big Four, Accenture", h: "Management / Advisory", p: "Trasformazione, processi, finance, operations, tech, risk e implementazione. Guarda practice e team, non soltanto il logo." },
              ] },
              { t: "tabella", head: ["Perché piace", ""], rows: [
                ["Varietà", "Aziende e problemi diversi prima di specializzarti."],
                ["Problem solving", "Scomporre problemi grandi, usare dati, comunicare una raccomandazione."],
                ["Exit", "Corporate strategy, business development, startup, ruoli manageriali, a volte investing."],
                ["Trade-off", "Selezione competitiva, ritmi intensi, esperienza molto dipendente da progetto e team."],
              ] },
              { t: "box", h: "Il vero test non è «mi piacciono i case?»", p: "Ti piace risolvere un problema che non conosci, strutturarlo in fretta e spiegarlo? Testalo con una case competition o un’associazione. Se ti piace «possedere» il risultato nel tempo, forse preferisci il corporate." },
            ] },
          { id: "s-corporate", titolo: "Corporate", sotto: "Vuoi stare dentro l’azienda?", apri: true,
            intro: "Una parte enorme dei laureati lavora dentro aziende industriali, tech, consumer, luxury, healthcare o energy. La domanda è: come facciamo funzionare e crescere questa azienda?",
            blocchi: [
              { t: "lista", stile: "ruoli", items: [
                { h: "Corporate Finance / FP&A", k: "Numeri + business", p: "Budget, forecast, performance, business case. Una delle strade più naturali dopo Economia, fino a Finance Manager / CFO." },
                { h: "Treasury / Controlling", k: "Rigore + continuità", p: "Liquidità, debito, rischio, reporting e controllo. Meno glamour, molto utile per capire l’impresa." },
                { h: "Corporate Development", k: "M&A + ownership", p: "M&A e partnership per l’azienda. Spesso dopo IB/Deals, ma esistono ingressi graduate." },
                { h: "Corporate Strategy", k: "Strategia + profondità", p: "Mercati, crescita, priorità e supporto al management. Exit classica dalla consulenza." },
                { h: "Operations / Supply Chain", k: "Execution + sistemi", p: "Produzione, logistica, procurement, fornitori. Conseguenze molto concrete delle decisioni." },
              ] },
              { t: "box", tono: "nota", h: "Cosa guardare", p: "Nel corporate meno «tier list», più qualità del team, responsabilità, settore, internazionalità e mobilità interna." },
            ] },
          { id: "s-marketing", titolo: "Marketing, Sales & Audit", sotto: "Tre mondi molto più grandi di come sembrano", apri: true,
            intro: "Online alcune carriere sembrano «serie A» e le altre un ripiego. È un modo pessimo di scegliere: questi sono enormi mercati di ingresso, con competenze molto diverse.",
            blocchi: [
              { t: "cards", cols: 3, items: [
                { k: "P&G · Unilever · L’Oréal · luxury · tech", h: "Marketing / Brand", p: "Cliente, mercato, posizionamento, pricing, campagne e prodotto. Non è «fare post Instagram»: è capire perché un prodotto viene scelto." },
                { k: "Tech · SaaS · industrial · servizi", h: "Sales / Business Development", p: "Ricavi, clienti, partnership, negoziazione. Ottimo se ti piace la parte relazionale e il risultato misurabile." },
                { k: "Deloitte · PwC · EY · KPMG", h: "Audit / Accounting / Tax", p: "Bilanci, controlli, processi e normativa. Ingresso strutturato e base tecnica verso Controlling, FP&A, Internal Audit o Deals." },
              ] },
              { t: "frase", testo: "Domanda giusta: quale lavoro mi fa accumulare skill che voglio davvero usare per anni?" },
            ] },
          { id: "s-data", titolo: "Data, Institutions & Startup", sotto: "Quando Economia si sposta ai bordi", apri: true,
            intro: "Puoi combinare Economia con dati, politica economica, tecnologia o imprenditorialità. Qui conta ancora di più che cosa sai fare, non soltanto che esami hai passato.",
            blocchi: [
              { t: "cards", cols: 2, items: [
                { k: "Statistica + coding", h: "Data / Business Analytics", p: "SQL, Python/R, statistica, BI e capacità di tradurre dati in decisioni." },
                { k: "Econometria + teoria", h: "Economics / Research", p: "Micro/macro, econometria, ricerca e modelli. Più accademico; la magistrale diventa molto importante." },
                { k: "Roma · Francoforte · Bruxelles", h: "Institutions / Policy", p: "Banca d’Italia, BCE, Commissione, authority. Percorso accademico, lingue e selezioni contano parecchio." },
                { k: "Execution + mercato + network", h: "Startup / Entrepreneurship", p: "Nessuna laurea garantisce di diventare founder. Entrare prima in una startup può essere un ottimo test." },
              ] },
              { t: "frase", testo: "Se ti incuriosisce una di queste aree, inserisci una skill o un progetto concreto nel prossimo anno." },
            ] },
          { titolo: "Confrontare le carriere", sotto: "Il nome del ruolo non basta",
            intro: "Confronta le strade su ciò che cambia la vita quotidiana. La tabella è orientativa: serve a fare domande migliori, non a trasformare la carriera in un videogioco.",
            blocchi: [
              { t: "tabella", head: ["Area", "Ingresso", "Intensità", "Comp. iniziale", "Exit / mobilità"], rows: [
                ["IB / PE", "Molto selettivo", "Molto alta", "Alta / molto alta", "Molto ampia in finance / corpdev"],
                ["Strategy Consulting", "Molto selettivo", "Alta", "Alta", "Corporate strategy / startup / management"],
                ["Corporate Finance", "Media", "Media", "Media", "Crescita interna / CFO path"],
                ["Marketing / Sales", "Media", "Variabile", "Media", "Brand / growth / commercial leadership"],
                ["Audit / Accounting", "Accesso strutturato", "Media-alta a picchi", "Media", "Finance / controlling / deals"],
                ["Data / Economics", "Dipende dalla tecnica", "Media", "Media-alta", "Analytics / research / institutions"],
              ] },
              { t: "lista", stile: "citta", h: "Geografia: scegliere un lavoro significa spesso scegliere un mercato", items: [
                { h: "Milano", p: "Finance, consulting, corporate HQ, marketing, tech/startup." },
                { h: "Firenze", p: "Luxury/fashion, corporate/industriali, audit/consulting; mercato finance più piccolo." },
                { h: "Londra", p: "Finance, consulting, investing, tech internazionale; recruiting più strutturato e competitivo." },
                { h: "Parigi", p: "Finance, consulting, luxury, corporate; il francese pesa molto." },
                { h: "Francoforte / Zurigo", p: "Banking, AM, wealth, DACH corporate; lingua locale spesso vantaggio forte." },
                { h: "Bruxelles / Francoforte", p: "Istituzioni UE / BCE e policy." },
              ] },
            ] },
          { titolo: "Se non sai che carriera scegliere", sotto: "Ridurre il rumore, aumentare l’informazione reale",
            intro: "Studiare a UniFi non rende «vietati» certi percorsi. Significa una cosa più concreta: se punti a mercati molto selettivi devi costruire il profilo più intenzionalmente.",
            blocchi: [
              { t: "passi", stile: "riga", items: [
                { h: "Scegli 3 aree", p: "Non tre aziende: tre famiglie. Esempio: Finance / Consulting / Corporate." },
                { h: "Parla con chi lo fa", p: "LinkedIn, alumni, studenti magistrali, associazioni. Cosa fanno davvero, come sono entrati, cosa rifarebbero." },
                { h: "Fai un test piccolo", p: "Progetto, case competition, associazione, internship, corso quantitativo, part-time pertinente." },
                { h: "Aggiorna la shortlist", p: "Dopo ogni test: mi piace il problema? il modo di lavorare? voglio diventare bravo in questo?" },
              ] },
              { t: "frase", testo: "Se punti a IB / PE / Strategy Consulting, master + internship + inglese + networking contano molto di più." },
              { t: "cta", testo: "Vai a «Dopo la laurea»", href: "dopo.html" },
            ] },
        ] },

      // ───────────────────────────────── 05
      { id: "dopo", n: "05", titolo: "Dopo la triennale", sotto: "Non è «magistrale o lavoro»", img: "laurea.jpg", ico: "scala",
        breve: ["Quattro leve: studiare, lavorare, esperienza mirata o un mix.", "Non chiamare tutto «master»: guarda per chi è pensato.", "Il ranking è un input, non un algoritmo."],
        sezioni: [
          { titolo: "Cosa puoi fare dopo la triennale", sotto: "Quattro leve, da combinare",
            intro: "La scelta giusta dipende da quale porta vuoi aprire e da cosa ti manca. Da evitare: arrivare a marzo del terzo anno e scoprire adesso requisiti, test e scadenze.",
            blocchi: [
              { t: "cards", cols: 2, items: [
                { k: "Se il ruolo richiede più profondità o un mercato nuovo", h: "Laurea Magistrale / MSc", p: "Specializzazione + recruiting. In Italia spesso 2 anni; all’estero durata e struttura cambiano." },
                { k: "Se hai un obiettivo molto mirato", h: "Master universitario", p: "Più professionalizzante e specifico. Non è automaticamente equivalente a una Laurea Magistrale." },
                { k: "Se l’offerta è di qualità", h: "Lavoro", p: "Ha senso con un’opportunità buona dove la triennale basta per iniziare e imparare sul campo. Non «per smettere di studiare»." },
                { k: "Se stai colmando un gap concreto", h: "Internship / gap mirato", p: "3–12 mesi per esperienza, lingua, test, skill o chiarezza. Deve avere un obiettivo misurabile." },
              ] },
              { t: "frase", testo: "Domanda utile: quale scelta aumenta di più le opzioni che voglio avere tra 2–3 anni?" },
            ] },
          { titolo: "Magistrale, MSc, Master, MBA", sotto: "Non chiamare tutto «master»",
            blocchi: [
              { t: "tabella", head: ["Tipo", "In pratica", "Per chi"], rows: [
                ["Laurea Magistrale", "Secondo ciclo italiano, normalmente 2 anni", "Neolaureati; specializzazione accademico-professionale"],
                ["MSc / MiM pre-experience", "Programmi europei spesso 1–2 anni", "Neolaureati / poca esperienza; forte componente recruiting"],
                ["Master universitario", "Titolo post-laurea professionalizzante", "Dipende da livello e settore; controllare riconoscimento"],
                ["MBA", "General management post-experience", "Dopo alcuni anni di lavoro; non il passo standard dopo la triennale"],
                ["MiF / MFin", "Finanza, spesso post-experience", "Non tutti i «Master in Finance» sono per neolaureati"],
              ] },
              { t: "box", h: "Esempio importante", p: "Il LBS Masters in Financial Analysis (MFA) è per recent graduates; il LBS Masters in Finance (MiF) richiede normalmente almeno due anni di esperienza. Anche il Cambridge MFin è post-experience. Non confrontare programmi solo perché nel nome c’è «Finance»." },
              { t: "box", tono: "nota", h: "Da dove partire", p: "Finendo la triennale a UniFi, le categorie da guardare per prime sono Laurea Magistrale, MSc/MiM pre-experience e programmi specialistici equivalenti. Verifica sempre i requisiti aggiornati." },
            ] },
          { titolo: "Come scegliere il master", sotto: "Il ranking è solo uno dei pezzi",
            intro: "Un programma può essere altissimo nel ranking generale e mediocre per il mercato e il lavoro che vuoi. Il confronto parte dall’output, non dal logo.",
            blocchi: [
              { t: "cards", cols: 3, items: [
                { k: "1", h: "Recruiting", p: "Quali aziende assumono davvero da quel programma? In quale ufficio/Paese? Career fair e pipeline on-campus?" },
                { k: "2", h: "Alumni density", p: "Quante persone nel settore e nella città che ti interessa? Un network vale quando puoi usarlo." },
                { k: "3", h: "Location", p: "Londra, Parigi o Milano aumentano eventi, internship e networking. Non sostituisce il brand, ma aiuta." },
                { k: "4", h: "Program design", p: "1 o 2 anni? Gap year? Internship curriculare? La struttura può contare più del nome." },
                { k: "5", h: "Admissions + timing", p: "Test, media, inglese, prerequisiti e deadline. Alcuni recruiting iniziano prestissimo." },
                { k: "6", h: "Costo / ROI", p: "Retta + vita + tempo. Il programma più caro deve comprare qualcosa di concreto." },
              ] },
              { t: "frase", testo: "FT/QS misurano tante cose. Per il tuo obiettivo guarda employment report, alumni LinkedIn e recruiting reale." },
            ] },
          { titolo: "Il master per area", sotto: "Finance · Consulting · Corporate · Data", apri: true,
            intro: "Programmi citati come esempi da approfondire, non come classifica ufficiale. Nessuna tier list è «ufficiale».",
            blocchi: [
              { t: "tabella", h: "Se vuoi Finance / IB / PE — qui il master può cambiare davvero il recruiting", head: ["Fascia", "Programmi / scuole da approfondire", "Perché"], rows: [
                ["Target forti per Londra", "LSE MSc Finance / F&PE; LBS MFA; Oxford MFE; HEC Paris; Bocconi MSc Finance", "Brand + alumni + recruiting"],
                ["Molto forti / semi-target", "Imperial MSc Finance; ESSEC; ESCP; St. Gallen; Warwick/UCL a seconda del programma", "Accesso reale, più dipendente da mercato/lingua/network"],
                ["Target regionali", "WHU / Mannheim / Frankfurt; SSE; CBS; RSM; ESADE", "Forti nei rispettivi mercati; Londra richiede più strategia"],
              ] },
              { t: "tabella", h: "Se vuoi Consulting — il mercato locale conta più di una tier list unica", head: ["Obiettivo", "Programmi / scuole", "Cosa guardare"], rows: [
                ["MBB / Strategy — Europa", "HEC, LBS, INSEAD MiM, Bocconi, LSE, ESSEC/ESCP, St. Gallen, ESADE/IESE", "Recruiting per office, case prep, alumni e lingua"],
                ["Consulting generalista", "MiM / Strategy / Management forti nel Paese target", "Placement locale e breadth dei progetti"],
                ["Advisory / Big Four", "LM/MSc + stage congruenti col settore", "Practice specifica: Deals, Risk, Tech"],
              ] },
              { t: "cards", cols: 2, items: [
                { k: "Competenze + multinazionali", h: "Corporate Finance / FP&A", p: "MSc Finance, Accounting, Management con track finance. Cerca accounting serio, corporate finance, data e stage." },
                { k: "Settore + internship", h: "Marketing / Brand", p: "Marketing, MiM, Management, Consumer/Luxury tracks. HEC, ESSEC ed ESCP tra i nomi forti." },
                { k: "Tecnica + accesso strutturato", h: "Audit / Accounting / Tax", p: "LM/MSc Accounting, Finance o Management. Per le Big Four contano stage e basi tecniche, non una target school «da IB»." },
                { k: "Quanto diventi quantitativo", h: "Data / Economics / Institutions", p: "Econometria, statistica, coding. Esempi: LSE, Bocconi, PSE, TSE, Oxford. Per BCE / Banca d’Italia: quantitative skills + lingue." },
              ] },
              { t: "frase", testo: "Filtro: apri il syllabus e guarda quanta matematica, statistica, econometria e coding c’è davvero." },
              { t: "fonte", testo: "Fonti: WSO (European Masters, target-school threads), Coffee Chat/LinkedIn 2026; requisiti LBS/Cambridge dai siti ufficiali." },
            ] },
          { titolo: "Target school: cosa significa davvero", sotto: "Accesso, non offerta",
            intro: "Alcune università hanno più alumni, eventi, recruiter e processi strutturati in certi settori. Questo aumenta le opportunità di colloquio. Non ti fa superare il colloquio al posto tuo.",
            blocchi: [
              { t: "cards", cols: 3, items: [
                { h: "Target è locale", p: "HEC a Parigi, Bocconi a Milano, WHU a Francoforte, LSE/LBS a Londra. Le gerarchie cambiano col mercato." },
                { h: "La location aiuta", p: "A Londra eventi e networking sono fisicamente più vicini. Vantaggio, non garanzia." },
                { h: "Alumni density conta", p: "LinkedIn serve più del ranking per capire dove sono davvero gli ex-studenti." },
                { h: "Il recruiting inizia presto", p: "Per IB e consulting, conoscere le finestre prima del master conta più di un elective." },
                { h: "Non-target non è impossibile", p: "Meno pipeline automatica, più internship, networking e preparazione." },
                { h: "Ranking non è placement", p: "Usalo come input, non come algoritmo." },
              ] },
              { t: "frase", testo: "La scuola può aprirti la porta; esperienza, preparazione e networking decidono quanto sei pronto quando si apre." },
            ] },
          { titolo: "Lavoro, internship o gap", sotto: "Quando il master non è automaticamente la risposta",
            blocchi: [
              { t: "lista", stile: "check", h: "Quando lavorare subito può avere senso", items: [
                { p: "Hai un’offerta concreta in un ruolo che ti interessa e un team da cui imparare." },
                { p: "Il settore assume bene dalla triennale e premia l’esperienza sul campo." },
                { p: "Vuoi testare un lavoro prima di investire 1–2 anni e molto denaro in un master." },
                { p: "Hai un piano di rivalutazione tra 6–12 mesi." },
              ] },
              { t: "cards", cols: 3, items: [
                { k: "Prima", h: "Quale gap sto colmando?", p: "Qual è il risultato finale?" },
                { k: "Durante", h: "Sto costruendo?", p: "Skill, prove e contatti, oppure sto solo occupando tempo?" },
                { k: "Dopo", h: "Quale porta si è aperta?", p: "Cosa è più aperto rispetto a prima?" },
              ] },
              { t: "cta", testo: "Guarda cosa c’è dopo", href: "dopo.html" },
            ] },
        ] },

      // ───────────────────────────────── 06
      { id: "chiudere", n: "06", titolo: "Chiudere bene", sotto: "Gli errori che avremmo evitato", img: "alloro.jpg", ico: "bandiera",
        breve: ["Non serve fare tutto perfettamente.", "Serve non ripetere per tre anni gli errori ad alto costo.", "Quando hai un problema, non ricominciare da Google."],
        sezioni: [
          { titolo: "Gli errori che avrei evitato", sotto: "Dodici, dal metodo alle scelte",
            blocchi: [
              { t: "lista", stile: "errori", items: [
                { h: "Studiare tutti gli esami nello stesso modo", p: "Se la prova cambia, deve cambiare anche il metodo." },
                { h: "Iniziare davvero solo a lezioni finite", p: "La sessione trasforma una preparazione già avviata in performance." },
                { h: "Fare riassunti infiniti", p: "Se non ti testa, rischia di diventare procrastinazione produttiva." },
                { h: "Accumulare materiale", p: "Otto dispense non ti rendono più preparato: ti rendono una persona con otto dispense." },
                { h: "Prendere il gruppo WhatsApp come fonte ufficiale", p: "Regole d’esame, scadenze e piano di studi vanno verificati altrove." },
                { h: "Aspettare di sentirti pronto per un mock", p: "Il mock serve proprio a mostrarti perché non sei ancora pronto." },
                { h: "Rifiutare voti senza fare i conti", p: "Un voto brutto da pochi CFU può costare meno di un esame ripetuto." },
                { h: "Scegliere gli opzionali solo perché «facili»", p: "È l’unico pezzo di piano che puoi costruire davvero su misura." },
                { h: "Pensare all’Erasmus quando esce il bando", p: "Lingua, media e regolarità si costruiscono prima." },
                { h: "Fare extracurricular solo per il CV", p: "Se non impari e non conosci nessuno, la riga vale poco anche per te." },
                { h: "Confrontarti con la timeline degli altri", p: "Informazioni diverse, problemi diversi." },
                { h: "Arrivare al terzo anno senza guardare cosa c’è dopo", p: "Esplora abbastanza presto da non essere costretto a scegliere male." },
              ] },
              { t: "frase", testo: "Il vero errore non è prendere un brutto voto o cambiare idea. È continuare a usare un sistema che sai già che non funziona." },
            ] },
          { titolo: "Il punto di UniLink", sotto: "Dalla mappa all’azione",
            intro: "La guida ti dà la mappa mentale. UniLink serve a trasformarla in azione: apri il punto giusto, trovi l’informazione, prendi la decisione e torni a studiare o a vivere.",
            blocchi: [
              { t: "mappa", stile: "azioni", items: [
                { h: "Materiali", k: "Devo preparare un esame", p: "Modalità, difficoltà, frequenza, appunti, schemi, esercizi e mock.", href: "materiali.html" },
                { h: "Strumenti", k: "Devo decidere sui voti", p: "Media, forecast e voto di laurea senza calcoli manuali.", href: "tools.html" },
                { h: "Erasmus", k: "Voglio capire dove partire", p: "Sedi, informazioni pratiche e calcolatore punteggio.", href: "tools.html#erasmus" },
                { h: "Dopo la laurea", k: "Non so cosa fare dopo", p: "Carriere, magistrali, master e internship.", href: "dopo.html" },
              ] },
            ] },
          { titolo: "Prima di chiudere", sotto: "L’università non deve essere un gioco a informazioni nascoste",
            intro: "Non possiamo rendere gli esami facili, scegliere al posto tuo il curriculum o garantirti un Erasmus perfetto. Possiamo togliere una parte dell’attrito inutile: informazioni sparse, dubbi ricorrenti e decisioni prese senza dati.",
            blocchi: [
              { t: "box", tono: "nota", h: "Aggiornamento", p: "Guida costruita per studenti di Economia UniFi e aggiornata ad agosto 2026. Regole, programmi, docenti, bandi e scadenze possono cambiare: quando una decisione dipende da un dato ufficiale, verifica sempre il sito UniFi e la pagina del tuo corso." },
              { t: "lista", stile: "fonti", h: "Fonti utili", items: [
                { h: "Economia Aziendale — UniFi", href: "https://www.ea.unifi.it/" },
                { h: "Insegnamenti e piano di studio — Economia Aziendale", href: "https://www.ea.unifi.it/vp-95-insegnamenti-e-piano-di-studio.html" },
                { h: "Programma Erasmus+ — Scuola di Economia e Management", href: "https://www.economia.unifi.it/vp-273-programma-erasmus-2021-27.html" },
                { h: "Wall Street Oasis — recruiting community", href: "https://www.wallstreetoasis.com/" },
              ] },
            ] },
        ] },
    ],
  },
};
