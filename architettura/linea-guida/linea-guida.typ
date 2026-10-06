// Generato da _src/linea_guida/build_linea_guida.py: non modificare a mano, si rigenera.
#let navy = rgb("#172554")
#let crema = rgb("#f4f1ea")
#let arancio = rgb("#cf7527")
#let ar2 = rgb("#f6e4d1")
#let ar3 = rgb("#9a5417")
#let crema2 = rgb("#ebe4d5")
#let nv2 = rgb("#4b5675")
#let linea = rgb("#e2dccf")
#let nvt = rgb("#dfe4f1")
#set document(title: "UniLink — Linea guida", author: "UniLink")
#set text(font: "Croogla 4F", size: 9.4pt, fill: navy, lang: "it")
#set par(leading: 0.62em, justify: false)
#set list(indent: 4pt, body-indent: 5pt, spacing: 0.5em)
#set enum(indent: 4pt, body-indent: 5pt, spacing: 0.5em)
#set page(paper: "a4", margin: (x: 18mm, top: 20mm, bottom: 18mm),
  header: context { if counter(page).get().first() > 1 [
    #set text(size: 7.5pt, fill: nv2)
    UniLink · Linea guida #h(1fr) Demo v2
  ] },
  footer: context { if counter(page).get().first() > 1 [
    #set text(size: 7.5pt, fill: nv2)
    #h(1fr) #counter(page).display()
  ] })
#let spaziato(t) = text(size: 7.4pt, fill: ar3, tracking: 0.14em, upper(t))
#let cap(n, titolo, sotto) = {
  pagebreak(weak: true)
  block(below: 3pt, spaziato("Parte " + str(n)))
  block(below: 4pt, text(size: 21pt, titolo))
  block(below: 12pt, text(size: 9pt, fill: nv2, sotto))
}
#let cap0(titolo, sotto) = {
  pagebreak(weak: true)
  block(below: 4pt, text(size: 21pt, titolo))
  block(below: 12pt, text(size: 9pt, fill: nv2, sotto))
}
#let sub(t) = block(sticky: true, above: 14pt, below: 6pt, text(size: 12.5pt, t))
#let sub3(t) = block(sticky: true, above: 9pt, below: 3pt, text(size: 9.8pt, fill: ar3, t))
#let nota(body) = block(fill: ar2, radius: 8pt, inset: 10pt, width: 100%, below: 8pt, text(fill: ar3, body))
#let tab(cols, widths, righe) = {
  set text(size: 8.2pt)
  table(columns: widths, stroke: (x, y) => (bottom: 0.5pt + linea), inset: (x: 5pt, y: 4.5pt),
    fill: (x, y) => if y == 0 { crema } else { none },
    ..cols.map(c => text(fill: nv2, size: 7.6pt, c)), ..righe.flatten().map(c => [#c]))
}

#page(fill: navy, margin: 22mm, header: none, footer: none)[
  #set text(fill: white)
  #grid(columns: (auto, auto), gutter: 8pt, align: horizon, image("../../demo-landing/img/logo-white.png", width: 26pt), text(size: 22pt)[unilink])
  #v(1fr)
  #text(size: 8pt, fill: arancio, tracking: 0.16em)[LINEA GUIDA · MANUALE UNICO]
  #v(10pt)
  #text(size: 40pt)[UniLink, \ landing, web app \ e prodotto.]
  #v(14pt)
  #text(size: 11pt)[Un solo documento, senza data, che tiene insieme il report «Dalla vetrina alla piattaforma», la landing e la web app attuali. Dove dicono cose diverse non sceglie: mostra tutte le versioni e le lascia da decidere.]
  #v(1fr)
  #set text(size: 8pt)
  #grid(columns: (1fr, 1fr, 1fr), gutter: 10pt,
    [Demo v2 \ landing-v3 · webapp-v3], [Per i founder \ Matteo, Cosimo, Niccolò, Gianmarco], [Da allegare a ogni richiesta \ anche in Markdown: LINEA\_GUIDA\_UNILINK.md])
]

#cap0("Come si usa questa linea guida", "prima di tutto: i termini e le regole di lettura")
#"Questa linea guida è il manuale unico di UniLink: tiene insieme la landing, la web app e tutto ciò che il report «Dalla vetrina alla piattaforma» aveva già raccolto, in un documento senza data che si aggiorna invece di sostituirsi. Serve a tre cose: capire com'è UniLink oggi, sapere cosa è stato proposto e non ancora deciso, e dare a chi lavora (persone o AI) il contesto per fare modifiche senza rompere ciò che va bene."

#sub[#"I termini"]
#tab(("Termine", "Cosa significa qui"), (22%, 78%), (("Demo v1", "La demo descritta dal report del 4 ottobre 2026 (cartella 06_Demo_UniLink): landing generale con 10 scuole, hub di Economia, web app con filigrana, simulatore, piano di studio, Career, inviti e pannello del team."), ("Demo v2", "Le versioni attuali di landing e web app, pubblicate nel repository matteprune04/unilink-hq. Nel registro dell'HQ si chiamano landing-v3 e webapp-v3 (numeri delle release); in questo manuale sono insieme «la demo v2»."), ("Report", "Il documento «Dalla vetrina alla piattaforma» (demo v1). Il suo contenuto è integrato qui (parte 5) e nelle card «Report · …» dei due registri."), ("Card Lxx / Dxx", "Una idea ancora da decidere: Lxx nella sezione «Da decidere» della landing, Dxx in quella della web app. Il codice non cambia mai."), ("Deciso / da decidere", "Ciò che è deciso appare nelle pagine come sarà davvero. Ciò che non lo è vive solo nelle card «Da decidere», con bordo tratteggiato."), ("Ipotesi", "Numero o regola non validati: prezzi, soglie, stime. Vanno sempre etichettati come tali.")))

#sub[#"Regole di lettura e di modifica"]
+ #"Esplicito vale più di una deduzione. Se una cosa non è scritta nel report o non c'è nelle demo, qui lo si dice invece di immaginarla."
+ #"Dove report e demo v2 dicono cose diverse non si sceglie: la parte 6 riporta entrambe le versioni affiancate, con la dicitura «non risolta, da decidere». Nessuna discordanza è stata corretta in silenzio."
+ #"Solo aggiunte: il contenuto esistente (card, pagine, testi) non viene tolto né riscritto per forza di sintesi. Una modifica a ciò che esiste si fa solo dopo un consenso esplicito."
+ #"Il design non si tocca quando si cambia un contenuto: i contenuti stanno in file di configurazione e nei registri, non nel CSS."
+ #"Nulla di inventato presentato come vero: niente numeri, prezzi, testimonianze o regole senza fonte. Gli esempi si etichettano «Esempio»."

#sub[#"Come è organizzato"]
#tab(("Parte", "Contenuto"), (26%, 74%), (("1 · UniLink in breve", "Cos'è, a chi serve, principi, le tre parti della piattaforma."), ("2 · Mappa", "Dove vive cosa (repository, demo, HQ, backup) e cosa c'è in demo v1 e demo v2."), ("3 · La landing", "Pagine, navigazione, hub, fasi, strumenti, area personale in schermate, card, regole di grafica."), ("4 · La web app", "Mappa, accesso e primo accesso, tipologie di account, sezioni decise, moduli da decidere, file."), ("5 · Prodotto e business", "Tutti gli argomenti del report, uno per uno: proposta, alternative, cosa serve, cosa decidere, cosa c'è oggi nelle demo."), ("6 · Discordanze", "Dove report e demo v2 dicono cose diverse. Non risolte."), ("7 · Registro unico", "Tutte le card Lxx e Dxx, con i rimandi tra landing e web app."), ("8 · Decisioni aperte", "Le domande da chiudere, nell'ordine in cui conviene farlo."), ("9 · Manutenzione", "Come chiedere modifiche, come si salva e si verifica, limiti noti, percorso verso la versione vera."), ("10 · Glossario e fonti", "Termini, versioni e fonti.")))


#cap(1, "UniLink in breve", "cos'è, per chi, con quali principi")
#"UniLink è «da studenti, per studenti»: appunti, mappe, quiz e strumenti per gli esami di Economia all'Università di Firenze (EA ed EC), con l'ambizione di diventare una piattaforma per tutto il percorso: scegliere il corso, studiare, andare in Erasmus, laurearsi, scegliere la magistrale e il lavoro. Oggi il sito pubblico è unilinkfirenze.it, fatto con Framer; il gruppo WhatsApp è il canale principale."

#sub[#"I numeri che si possono citare"]
#tab(("Numero", "Fonte e data"), (58%, 42%), (("876 persone, 7.855 pagine viste, 34 esami", "Landing demo v2: Google Analytics 4 e catalogo · 8 set – 5 ott 2026"), ("856 utenti, 7.549 visualizzazioni in 28 giorni; 102 clic da Google in 28 giorni (17 il mese prima); 18 pagine indicizzate su 50; 78 studenti registrati", "Report (demo v1): Google Analytics e file di contesto, al 4 ottobre 2026")))

#nota[#"I due gruppi di numeri sono scatti diversi nel tempo, non una discordanza. I contatori «200+ studenti» e «95% soddisfatti» del sito di oggi non sono dimostrabili (nell'HQ risultano 78 iscritti): non vanno usati."]
#sub[#"Le tre parti della piattaforma"]
#tab(("Parte", "Cosa è", "Dove vive"), (22%, 46%, 32%), (("Landing pubblica", "Ciò che resterebbe su Framer: orienta, spiega, fa provare gli strumenti e porta all'area personale. Si vede senza account.", "Demo: demo-landing/ · Produzione: Framer, unilinkfirenze.it"), ("Web app (area personale)", "Il posto dove si studia: dispense, esami, esercitazioni, percorso dopo gli esami, abbonamento, profilo.", "Demo: demo-webapp/ · Produzione (proposta): app.unilinkfirenze.it"), ("Pannello del team", "Dove i founder guardano numeri e materiale: metriche, controllo del materiale, domanda, ambassador, vendite.", "Nella demo v2: solo «Metriche» per l'admin; il pannello completo del report è una proposta (card della parte 5)")))

#sub[#"Chi c'è dietro"]
#"Quattro founder, tutti con accesso a tutto: Matteo (sito, prodotto e strumenti; di solito Framer), Cosimo (strategia e nuovi hub), Niccolò (dispense e materiali), Gianmarco (community e ambassador). Le ripartizioni sono quelle scritte nella landing demo v2."

#sub[#"Principi che non si rompono"]
+ #"Deciso / da decidere: ciò che è deciso appare come sarà davvero; il resto vive solo nella sezione arancio «Da decidere». Una card esce solo quando è decisa, rispondendo a quattro domande: esiste davvero? per chi? cosa togliamo? come misuriamo?"
+ #"Nella landing nessun link al sito attuale: gli strumenti stanno dentro la demo e le dispense nell'area personale."
+ #"Mai dati inventati come veri. Numeri solo da fonte; esempi etichettati; nessuna testimonianza finta (card L09)."
+ #"Tutto da dati: cambiare un contenuto è cambiare una riga di configurazione, non il design."
+ #"Grafica: solo Croogla 4F, un peso. Colori: navy #172554, crema #f4f1ea, arancio #cf7527 (con le varianti scure per il testo piccolo). Una parola accento per titolo."
+ #"Tre dispositivi: desktop da 1101 px, tablet 701–1100 px, telefono fino a 700 px (si disegna prima a 390 px)."
+ #"Anti-sovraccarico: nella landing al massimo sei voci in barra, più la pillola «Da decidere» e «Area personale»."
+ #"Lingua: italiano, «tu» al singolo, frasi brevi, si dice cosa c'è, cosa arriva e cosa no."
+ #"Accessibilità: contrasto almeno 4,5:1 sul testo piccolo, tutto raggiungibile da tastiera, un solo h1 per pagina, titoli in ordine."

#sub[#"Posizionamento"]
#"Il report propone: «Da studenti per studenti, gli appunti da 30 e lode e un piano per arrivarci». Onesto, mai aziendale, con una promessa più concreta: non solo materiale, anche metodo. La landing demo v2 apre invece con «Studia, orientati, scegli.». Le due formulazioni coesistono nei documenti: vedi la discordanza 12 nella parte 6."


#cap(2, "Mappa: dove vive cosa", "repository, demo, HQ, backup")
#tab(("Cosa", "Dove"), (22%, 78%), (("Repository", "github.com/matteprune04/unilink-hq"), ("Demo landing", "demo-landing/ → matteprune04.github.io/unilink-hq/demo-landing/"), ("Demo web app", "demo-webapp/ → matteprune04.github.io/unilink-hq/demo-webapp/"), ("HQ", "index.html (generato) e _src/online.js: sezione Laboratorio AI → DEMO, con le due demo incorporate, anteprima Desktop/Tablet/Telefono, «Scarica l'ultima versione» e storico."), ("Backup e storico", "Action «Backup demo»: a ogni push che tocca una demo crea lo ZIP, una Release (landing-vN, webapp-vN) e una riga in demos/registro.json. La nota della versione è l'oggetto dell'ultimo commit che tocca la cartella: va scritto come frase chiara."), ("Documenti", "architettura/: PDF di architettura della landing e della web app, PDF delle schede «Da decidere», CONTESTO_DEMO.md (contesto compatto) e questa linea guida."), ("Strumenti di verifica", "_src/verifica_landing.js (errori, file mancanti, scorrimento laterale, accessibilità su 3 formati), _src/build_schede.js, _src/screenshot_webapp.js.")))

#sub[#"Demo v1 e demo v2: cosa c'era e cosa c'è"]
#tab(("Area", "Demo v1 (report)", "Demo v2 (attuale)"), (14%, 43%, 43%), (("Struttura", "Landing generale UniLink per tutta l'Università di Firenze + hub di Economia + pagine delle altre scuole «in arrivo» + web app + pannello del team.", "Landing con hub (Economia attivo, Giurisprudenza e Medicina in arrivo) e fasi Prima/Durante/Dopo; web app con Studio, Dopo gli esami, Account e sezione Da decidere; pannello «Metriche» per l'admin."), ("Accesso", "Email @stud.unifi.it con link via email, niente password.", "Web app: accesso con email e password, accesso rapido con account demo, primo accesso in 6 passi, «Visualizza come». Landing: nessun accesso."), ("Dispense", "PDF privati con filigrana personale, marcatura invisibile, link temporanei.", "Catalogo, anteprima e «Apri dispensa» che apre il PDF; il lettore protetto è una proposta (D23)."), ("Studio", "Simulatore d'esame (114 domande vere) e piano di studio a sessioni con calendario e ottimizzatore.", "Esercitazioni con quiz di prova, quiz rapido, ripasso errori e simulazione (15 domande di esempio per 3 esami); nella landing lo strumento «Piano per l'appello»."), ("Percorso", "Libretto con gauge, scenari, grafico dei voti, bonus; Career con CV benchmark.", "Il mio percorso: media e voto di laurea con scenari, Erasmus, magistrali, mentor; Career come modulo da decidere."), ("Prezzi", "Appunti 4,99 · Completa 12,99 · Semestre 29,99 · Anno 49,99 · Plus 14,99 una tantum · tutoring 20 €/ora.", "Landing: pagina Prezzi di esempio fuori dalla barra. Web app: Gratuito, Pacchetto esame, Pacchetto semestre, Plus (ipotesi)."), ("Community", "Referral con codice fisso, programma ambassador con dashboard.", "Landing: Community con gruppi WhatsApp e ambassador. Web app: nessun referral deciso."), ("Misure", "Piano di tracciamento (GTM, Cookie Banner, ?from=) e pannello del team a sette schede.", "Nessun tracciamento a eventi; commenti del team sulle demo; pannello «Metriche» dell'admin con dati di esempio."), ("Idee", "Decisioni per la call (16 voci).", "Sezioni «Da decidere»: 26 card nella landing, 44 proposte nella web app.")))


#cap(3, "La landing (demo v2)", "pagine, navigazione, hub, strumenti, card")
#"Navigazione: Hub ▾ · Prima ▾ · Durante ▾ · Dopo ▾ · Strumenti · Community, più la pillola arancio «Da decidere» e il pulsante «Area personale». Nav, footer e versione vengono dalla configurazione (UL_CFG) e da app.js. Da tablet in giù il menu è a tutto schermo."

#sub[#"Le pagine"]
#tab(("Codice", "Pagina", "File"), (16%, 62%, 22%), (("S01", "Home: hero, numeri reali, hub, «parti da dove sei», catalogo, area personale in anteprima, come funziona, strumenti, chi c'è dietro, FAQ, finale", "index.html"), ("S02 · S03 · S04", "Hub Economia (attivo) · Giurisprudenza · Medicina (in arrivo, con lista d'attesa)", "hub-*.html"), ("S05 · S06 · S07", "Prima · Durante · Dopo", "prima.html, durante.html, dopo.html"), ("S08", "Tesi e laurea (checklist in 6 passi che si ricorda)", "tesi.html"), ("S09", "Strumenti (una scheda per hub e il pannello funzionante)", "tools.html"), ("S10", "Area personale: galleria di 19 schermate reali della web app in 3 formati, solo da guardare", "area.html"), ("S11", "Community (gruppi WhatsApp per anno, ambassador)", "community.html"), ("S12", "Prezzi (di esempio, fuori dalla barra di navigazione)", "prezzi.html"), ("S13", "Commenti del team (rapporto ed esportazione)", "commenti.html"), ("S90", "Da decidere: indice e schede (26 card L01…)", "decidere.html")))

#sub[#"Hub"]
#tab(("Hub", "Stato", "Descrizione nella landing"), (20%, 14%, 66%), (("Economia", "attivo", "34 esami di EA ed EC con appunti, mappe e quiz. Strumenti per Erasmus, media e laurea."), ("Giurisprudenza", "in arrivo", "Lo stesso metodo, per un ciclo unico di cinque anni. Lo costruiamo con chi studia lì."), ("Medicina", "in arrivo", "Dal semestre filtro (Fisica, Chimica, Biologia) agli esami del corso. Stiamo raccogliendo interesse.")))

#"Un hub passa da «in arrivo» ad «attivo» cambiando una riga della configurazione e collegando i materiali. Il report propone 10 scuole invece di 3 (discordanza 6)."

#sub[#"Le fasi"]
#tab(("Fase", "Voci"), (28%, 72%), (("Prima di iscriverti", "Scegliere il corso · Come funziona l'università · Borse e tasse · Test d'ingresso"), ("Durante gli studi", "Il tuo semestre · Strumenti · Metodo e piano · Erasmus · La tua area personale"), ("Dopo e verso la laurea", "Tesi e laurea · Magistrali e master · Carriera e CV")))

#sub[#"Strumenti"]
#tab(("Strumento", "Per", "Stato", "Descrizione"), (22%, 14%, 20%, 44%), (("Voto di laurea", "economia", "regole certe", "Dalla media ponderata al voto finale."), ("Media e voto obiettivo", "tutti", "regole certe", "Che voto serve negli esami che restano."), ("Piano per l'appello", "tutti", "regole certe", "Argomenti e giorni: quanto ripassare ogni giorno."), ("Punteggio Erasmus", "economia", "esempio, regole da verificare", "Una stima del tuo punteggio per il bando."), ("Voto di laurea · ciclo unico", "giurisprudenza", "esempio, regole da verificare", "Media, tesi e bonus per Giurisprudenza."), ("Piano semestre filtro", "medicina", "esempio, regole da verificare", "Settimane, ore e materie fino all'appello.")))

#"Aggiungere uno strumento è una voce in UL_TOOLS e una funzione in IMPL (tools.js). Uno strumento di stato «esempio» non si pubblica come vero finché le regole non sono verificate sul regolamento ufficiale. Le voci «solo area personale» sono bloccate nella landing e rimandano alla web app: Erasmus completo (#/app/percorso/erasmus), Media e voto di laurea completo (#/app/percorso/libretto)."

#sub[#"Area personale in schermate reali"]
#"L'area personale si mostra con immagini scattate dalla web app vera (non con un riquadro vivo e non navigabile): nessun dato si modifica e la pagina funziona anche da sola. I gruppi sono: Studio (7); Il mio percorso (4); Piano e account (2); Moduli da decidere (4); Accesso e aree in arrivo (2). Le immagini sono in demo-landing/img/app/ (3 file per schermata: -desk, -tab, -ph) e si rifanno con _src/screenshot_webapp.js e _src/png_to_webp.py quando la web app cambia."

#sub[#"Prezzi (pagina di esempio)"]
#"La pagina Prezzi legge il listino da UL_CFG.prezzi: quando il listino è deciso si cambiano i numeri lì e la pagina si ridisegna. Oggi mostra, per esame: Appunti di un esame € 4,99; Dispensa completa € 12,99; Due esami € 22,99; per semestre: Semestre · 1 esame € 12,99; Pacchetto semestre € 29,99; Pacchetto anno € 49,99. Sono prezzi di esempio dalle ipotesi del 4 ottobre."

#sub[#"Commenti del team e schede"]
- #"Pulsante «Commenti» in basso a destra: si commenta una sezione (tocca la parte) o tutta la pagina. Ogni commento salva pagina, codice e titolo della sezione, estratto del testo, categoria, autore, data, stato, dispositivo e versione."
- #"Esportazione in PDF, Markdown o JSON (il JSON si reimporta e unisce i commenti di più persone senza duplicati). I commenti stanno nel browser di chi li scrive: per condividerli in tempo reale serve una tabella Supabase."
- #"Le 9 schede L01–L09 hanno l'architettura completa (pagine annotate, dati, regole, stati, testi, misure, integrazioni, manutenzione, piano di lavoro con stime, rischi, successo, prompt per l'AI); sono nel PDF «Schede Da decidere». Le card L10–L26 nascono dal report e non hanno ancora l'architettura completa."

#sub[#"Dati e file"]
#tab(("Cosa vuoi cambiare", "Dove"), (46%, 54%), (("Contenuti (hub, fasi, numeri, prezzi, schermate, riassunto delle card)", "demo-landing/config.js → UL_CFG"), ("Architettura completa delle card L01–L09", "demo-landing/decidere-arch.js → UL_ARCH (poi node _src/build_schede.js)"), ("Strumenti", "demo-landing/tools.js e tools.css"), ("Logica e componenti", "demo-landing/app.js"), ("Grafica", "demo-landing/ul.css (non toccare per cambiare un contenuto)"), ("Commenti", "demo-landing/commenti.js e commenti.css (si spengono con UL_CFG.commenti.attivi = false)")))

#sub[#"Componenti"]
#"LP/Navbar, Hero, Sticker, CardHub, Livello+Risposta, CardDispensa, Card (.cd), Strumento, Dispositivo, Checklist, Fase, Finale, CardDecidere, Schermo, Bottone, Badge, Footer. Blocchi delle card: hero, cards, steps, list, stats, chips, nota, piano, prezzi, appshot."


#cap(4, "La web app (demo v2)", "area personale: mappa, accesso, account demo, moduli")
#"Il design è quello della «demo A» (Area personale e versioni B, C, D) usato senza modifiche: pillola navy in alto con cerchio arancio e iniziali, sidebar navy flottante, login diviso, Croogla e Instrument Sans. L'architettura è un mix: la parte decisa viene da A + B, le proposte da decidere sono i moduli completi di C (Career) e D (Network). Il modello «area di studio × percorso (Test Prep, Studio, Futuro) × piano» è stato scartato."

#sub[#"La mappa"]
#tab(("Gruppo della sidebar", "Voci", "Cosa contiene"), (22%, 30%, 48%), (("Studio (deciso)", "Dashboard · I miei esami · Materiali · Esercitazioni", "«Cosa ti serve adesso?», esami con data e obiettivo, catalogo e pacchetti, quiz e ripasso errori. Materiali ed Esercitazioni mostrano «in arrivo» se l'area non è attiva."), ("Dopo gli esami (deciso)", "Il mio percorso", "Media e voto di laurea con scenari, Erasmus, magistrali, mentor."), ("Account (deciso)", "Abbonamento · Profilo e account", "Piano, upgrade, disdetta, ordini; area di studio, ateneo, corso, anno e colore del profilo."), ("Da decidere", "Tutte le proposte · Career (demo C) · Network (demo D) · Configurazione · Metriche (admin)", "Una voce per modulo; dentro, un sotto-menu e un banner tratteggiato «Da decidere · Dxx» che porta all'architettura.")))

#sub[#"Tre regole che decidono cosa vede lo studente"]
- #"Area di studio: Economia attiva; Giurisprudenza in arrivo; Medicina in arrivo; Un'altra area proposta. Se l'area è in arrivo, Dashboard, Materiali ed Esercitazioni mostrano la lista d'attesa; esami, libretto e profilo funzionano per tutti."
- #"Ateneo: la parte decisa copre UniFi. Chi sceglie un altro ateneo usa la app e vede un banner verso la proposta Network (D12)."
- #"Piano: Gratuito, Pacchetto esame, Pacchetto semestre, Plus (si sommano). Plus è un solo campo (activity.plus) per tutta la app, anche per i moduli Career."

#sub[#"Accesso e primo accesso"]
#"Accesso con email e password, oppure «Accesso rapido» con un account demo; «Crea un account gratuito» porta alla registrazione. Il primo accesso è in sei passi: area di studio · ateneo, corso e anno · da dove partire · dopo la laurea · ritmo e avvisi (consensi separati) · il tuo piano (Gratuito, Pacchetto semestre o Plus, con checkout simulato). Il piano si cambia sempre dopo: pagina Abbonamento, finestra «Sblocca» su ogni lucchetto, card in fondo alla sidebar. Le regole di sblocco stanno in un solo file (js/core.js)."

#sub[#"Tipologie demo e «Visualizza come»"]
#tab(("Tipologia", "Descrizione"), (28%, 72%), (("Gratuito", "Economia · I anno · Studio"), ("Pacchetto esame", "Economia · I anno · ha Microeconomia"), ("Pacchetto semestre", "Economia · I anno, II semestre"), ("Plus", "Economia · III anno · dati del modulo Career"), ("Area in arrivo", "Giurisprudenza · lista d'attesa"), ("Altro ateneo", "Economia · UniPi · dati del modulo Network (Pass)"), ("Admin", "Team UniLink · metriche")))

#"Il pulsante fisso «Visualizza come» cambia account senza uscire. Per aggiungere una tipologia: una riga in UL.DEMO e un utente in UL.SEED (js/seed.js) con la stessa email. Password demo degli studenti: UniLink2026!, admin: AdminDemo!2026 (account fittizi)."

#sub[#"Piani e prezzi nella demo v2"]
#tab(("Piano", "Prezzo", "Cosa include"), (20%, 26%, 54%), (("Gratuito", "0 € · per sempre", "Schede, partizioni e consigli di ogni esame; Quiz di prova (5 domande) e ripasso errori; I miei esami, libretto e voto di laurea; Erasmus, magistrali e strumenti del sito"), ("Pacchetto esame", "14,99 € · per esame · ipotesi", "Dispensa completa, mappe, quiz in PDF; Esercitazioni complete e simulazioni dell'esame; Aggiornamenti fino a fine anno accademico"), ("Pacchetto semestre", "29,99 € · tutti gli esami del semestre · ipotesi", "Tutti i pacchetti esame del semestre; Conviene da 3 esami in su; Gli esami già comprati vengono scalati (da decidere)"), ("UniLink Plus", "4,99 € · al mese · prezzo da decidere", "Esercitazioni complete su tutti gli esami; Simulazioni a tempo e ripasso errori ovunque; Sconto sui mentor; Si disdice quando vuoi")))

#nota[#"Sono ipotesi dell'HQ (dispensa 12–15 €, semestre 25–30 €, Plus da decidere), non i prezzi del report: vedi la discordanza 1 e 2 nella parte 6."]
#sub[#"Esercitazioni"]
#"Quiz di prova, quiz rapido, ripasso errori e simulazione dell'esame. Le domande sono scritte per la demo: 15 per ciascuno dei tre esami con banca (Microeconomia, Economia Aziendale, Statistica); il formato è quello di js/data-quiz.js."

#sub[#"Pannello «Metriche» (admin)"]
#"Per il ruolo admin: incassi, ordini, funnel e un simulatore economico con acquirenti nel semestre, spesa media, compenso degli autori, revisione per esame, esami, piattaforma e marketing. I dati sono di esempio."

#sub[#"Moduli da decidere: Career e Network"]
#"Sono i moduli completi delle demo C e D, funzionanti nella demo, in cartelle separate (js/da-decidere/career/ e js/da-decidere/network/): si attivano spostando la voce in js/boot.js e si tolgono senza rompere il resto. Career: punteggio e piano (D03), Studio con Plus (D04), Opportunità (D05), Profilo talento (D06), Track (D07), Mentor (D08), Eventi (D09), Plus e inviti (D10), Business cockpit (D11, admin). Network: più atenei (D12), dispense dalla community con crediti (D13), calcolatori e guide (D14), mercatino (D15), test d'ingresso e simulazioni (D16), ammissioni MSc (D17), Academy (D18), club ed eventi (D19), Pass e crediti (D20), La rete (D21, admin). Idee dell'HQ da costruire: raccolta domande d'esame (D22), lettore protetto (D23), borse di studio (D24), guida tesi (D25)."

#"Come una proposta diventa decisa: si apre la scheda, si guarda il modulo, si discute; se decisa, si seguono i passi «Per attivarla» (la voce passa da UL.NAV.dd a UL.NAV.decise in js/boot.js); se scartata si tolgono voce, rotta e script, e la scheda resta nel registro con lo storico. In entrambi i casi si aggiunge una riga di storico."

#sub[#"Dati e file"]
#tab(("Cosa vuoi cambiare", "File"), (40%, 60%), (("Prezzi e piani", "js/config.js → UL.PIANI (ipotesi)"), ("Modello dati (profilo, attività)", "js/config.js → UL.CONFIG.profileDefaults / activityDefaults"), ("Aree di studio, proposte da decidere", "js/unilink-dati.js → UL_AREE, UL_DA_DECIDERE"), ("Voci della sidebar e rotte", "js/boot.js → UL.NAV.decise, UL.NAV.dd, appRoutes"), ("Account demo / tipologie", "js/seed.js → UL.DEMO, UL.SEED"), ("Esami, dispense, domande", "js/data-dispense.js, js/data-quiz.js"), ("Regole di sblocco", "js/core.js → owns, ownsPractice, plus, planName"), ("Primo accesso, abbonamento, Da decidere, Visualizza come", "js/views/unilink.js"), ("Pagine della parte decisa", "js/views/area.js, scheda.js, pratica.js, percorso.js"), ("Commenti del team", "js/commenti.js"), ("Design", "css/style.css (demo A, non toccare) · css/unilink.css (aggiunte)")))

#nota[#"Cose che la landing racconta e la web app non ha ancora: percorso Test Prep, calendario del piano di studio, template della tesi, borse, gruppi di studio. La web app non ha un layout tablet dedicato (un tablet in verticale riceve il layout del telefono)."]

#cap(5, "Prodotto e business", "tutti gli argomenti del report, uno per uno")
#"Ogni argomento ha la stessa forma: dove vive, la proposta del report (demo v1), le alternative scartate, cosa serve, cosa decidere e cosa c'è oggi nelle demo v2. Il contenuto del report è riportato così com'è: le cifre segnate come ipotesi vanno validate. Dove le demo v2 dicono altro, c'è il rimando alla parte 6."

#sub[#"Dalla vetrina alla piattaforma: cosa cambia"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 1 e 4"), ("Card", "landing L10 · web app D26"), ("Dove vive · landing", "Landing pubblica (Framer): vedi anche la card D26 nella web app."), ("Dove vive · web app", "Tutta la piattaforma: landing su Framer, web app su app.unilinkfirenze.it, pannello del team.")))

#sub3[#"Proposta del report (demo v1)"]
#"La demo è una versione funzionante in locale di come potrebbe diventare UniLink, in tre parti. 1) Landing pubblica: quello che resterebbe su Framer (una landing generale UniLink per tutta l'Università di Firenze, l'hub di Economia con catalogo con anteprime, schede corso e prezzi, le pagine delle altre scuole «in arrivo», l'architettura dei tool, la pagina Plus, ambassador e pagine legali). 2) Web app: l'area personale di ogni studente (dispense con filigrana, simulatore d'esame, piano di studio a sessioni per più esami, libretto e voto con scenari, Career, inviti, profilo). 3) Pannello del team: metriche, controllo del materiale, domanda, ambassador, vendite. Tutto quello che è una scelta di business (prezzi, testi, regole, soglie) sta in file di configurazione separati, così si cambia senza toccare il codice."

#sub3[#"I tre cambiamenti di fondo"]
#tab(("Voce", "Testo"), (24%, 76%), (("Account e freemium", "Oggi: sito aperto e gratuito, i PDF sono file pubblici su Framer. Nella demo: account con email @stud.unifi.it (gratis) + freemium: 1 dispensa gratis, poi singoli, pacchetti e Plus. Perché: servono ricavi e serve sapere chi usa cosa; le schede restano pubbliche per non perdere Google."), ("Il valore non è solo il PDF", "Oggi: il prodotto è il PDF. Nella demo: il PDF ha la filigrana personale, ma il valore sta anche fuori (simulatore, piano di studio, aggiornamenti, Career). Perché: un PDF si può sempre copiare; un account con piano e simulatore no."), ("Misurare per decidere", "Oggi: si misurano visite e pagine (GA4). Nella demo: piano di tracciamento completo (funnel, attivazione, ricerche senza risultato, «porte finte», feedback dopo l'esame). Perché: decidere su dati cosa produrre, cosa costruire, quanto far pagare.")))

#sub3[#"Mappa di cosa cambia (oggi → nella demo → perché)"]
#tab(("Voce", "Testo"), (24%, 76%), (("Struttura", "Un sito unico su Framer → landing su Framer + web app su app.unilinkfirenze.it → Framer non gestisce login, pagamenti e dati degli utenti."), ("Brand", "UniLink = Economia → landing generale UniLink + un hub per scuola (Economia attiva, 9 in arrivo) → non legarsi a una sola facoltà; misurare la domanda."), ("Accesso", "Nessun account → account con email UniFi e link via email → sappiamo chi scarica; solo studenti UniFi."), ("Dispense", "PDF pubblici → PDF privati con filigrana personale al download → rendere scomodo e tracciabile girare i file."), ("Catalogo", "Schede con informazioni utili → + anteprime, indice, struttura della prova, versione e «aggiornata il» → convincere prima di registrarsi; fiducia."), ("Prezzi", "Tutto gratis → 1 gratis su 3 + regalo per invito; singoli, pacchetti, Plus una tantum → ricavi senza perdere chi non paga."), ("Studio", "— → simulatore d'esame; piano di studio a sessioni per più esami con calendario e ottimizzatore → valore che un PDF girato non ha."), ("Carriera", "Esploratore di carriera (pubblico) → + CV benchmark per carriera, template UniLink, checklist LinkedIn → diventare il metro di «CV fatto bene»."), ("Percorso", "Calcolatori separati → libretto con gauge, grafico dei voti, scenari, obiettivo e simulazione; si riempie da solo dal piano → inserire i dati una volta sola."), ("Tool", "5 tool su Framer → registro dei tool: universali, di scuola, di livello; tenere, unire, spostare → crescere su altre scuole e sulla magistrale senza rifare tutto."), ("Community", "WhatsApp, «Diventa mentor» → + referral con codice fisso, programma ambassador con dashboard → crescere con il passaparola."), ("Corsi di laurea", "EA ed EC → + SUSBUS e SECI: iscrizione e richieste → misurare la domanda prima di produrre."), ("Misure", "GA4 su pagine → piano di tracciamento + pannello team → decidere con i dati."), ("Legale", "— → bozze di privacy, termini, fonti; consenso cookie e recesso → obbligatori quando si vende.")))

#nota[#"Cosa la demo del report non è: non è online (gira sul computer, i dati stanno nel browser); non incassa soldi (il checkout è simulato: per incassare serve prima un soggetto legale); non usa l'AI (dove servirebbe, per rifinire il piano, c'è una spiegazione di come funzionerebbe); utenti, ordini e grafici del pannello sono in parte di esempio."]
#sub3[#"Alternative e parere del report"]
#"Dal report: la struttura proposta è «landing su Framer, app su app.unilinkfirenze.it» (decisione 1). Framer non gestisce login, pagamenti e dati degli utenti."

#sub3[#"Cosa serve"]
- #"Un soggetto legale per incassare (vedi «Pagamenti»)"
- #"Un backend per account, dati e PDF (vedi «Per andare online»)"

#sub3[#"Da decidere nella call"]
- #"Il sito diventa landing + app separata? (proposta nella demo: sì, landing su Framer, app su app.unilinkfirenze.it)"

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Home, hub, fasi Prima/Durante/Dopo, Strumenti, Community, Area personale in schermate, Prezzi fuori barra, Da decidere, Commenti."
- #"Web app: Area personale (Studio, Dopo gli esami, Account), Da decidere, Metriche admin, Visualizza come, commenti del team."

#sub[#"Il sito di oggi: errori da sistemare"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 3"), ("Card", "landing L11"), ("Dove vive · landing", "Sito attuale su Framer (unilinkfirenze.it): home, guida, pagine dispense, PDF Appunti e Quiz, Excel dei tool.")))

#sub3[#"Proposta del report (demo v1)"]
#"Mentre si analizzava il sito sono emerse alcune cose da sistemare comunque: sono elencate qui sotto con il punto del sito in cui compaiono. Il report li considera indipendenti dalla demo."

#sub3[#"Piccoli errori trovati sul sito"]
#tab(("Voce", "Testo"), (24%, 76%), (("Home, riquadro «Entra in unilink»", "Il pulsante «Gruppo WhatsApp» porta al catalogo dispense, non al gruppo."), ("/tools/calcolatore-voto-di-laurea", "Il sottotitolo del calcolatore voto di laurea è quello dell'Erasmus («…trova la destinazione più adatta a te») e la pagina si chiama «Calcolatore Media»."), ("Home e Guida", "Refuso «Quello che avremo voluto sapere» (avremmo)."), ("Home", "I contatori in home dicono 200+ studenti e 95% di soddisfatti; nell'HQ risultano 78 iscritti. I numeri pubblici devono essere dimostrabili."), ("Pagine dispense", "Indirizzi con refusi o parentesi: economia-dell-imrpresa-agroalimentare, topics-in-management-and-marketing-(), marketing-(principi-e-strumenti), contabilit%C3%A1; nel CSV anche il titolo «Imrpresa»."), ("PDF Appunti (Economia Aziendale)", "La copertina riporta il codice B014272, il sito B018991."), ("PDF Appunti (Matematica II, Agroalimentare, Economia Finanziaria)", "Le copertine non hanno il codice esame: verificare che siano quelle ufficiali."), ("PDF Quiz (Banca; Statistica per le app. aziendali)", "La risposta giusta segue sempre A-D-C-B e le domande sono un glossario (vedi «Simulatore d'esame»)."), ("Excel dei tool", "Il foglio Erasmus si chiama «2021-2» e il regolamento della prova finale è del 2017/2018: verificare che siano aggiornati.")))

#tab(("Numero", "Cosa"), (22%, 78%), (("856", "utenti in 28 giorni (Google Analytics, al 4 ottobre)"), ("7.549", "visualizzazioni in 28 giorni"), ("102", "clic da Google in 28 giorni (erano 17 il mese prima)"), ("18 su 50", "pagine indicizzate"), ("78", "studenti registrati")))

#nota[#"Come girano oggi i materiali: i PDF delle dispense sono caricati su Framer come file pubblici: chi ha il link può scaricarli e girarli per sempre. Nelle pagine corso pubblicate oggi non ci sono pulsanti di download (controllato su Microeconomia ed Economia Aziendale). Non c'è login, non c'è pagamento, e Google Analytics vede le pagine ma non i clic sui pulsanti."]
#sub3[#"Cosa contiene il sito di oggi"]
#tab(("Voce", "Testo"), (24%, 76%), (("Home", "Contatori, vetrina dei corsi del 1° anno, guida in PDF, tool, invito al gruppo WhatsApp."), ("Dispense", "Catalogo di 34 corsi (EA ed EC) alimentato da un file CSV. Ogni scheda ha le «Informazioni utili» per partizione (modalità d'esame, CFU, prove intermedie, quanto seguire le lezioni, difficoltà, «Il nostro consiglio»)."), ("Tools", "Calcolatore voto di laurea, calcolatore Erasmus, destinazioni Erasmus (140 università), Master/Magistrale (163 programmi), Esploratore di carriera (aree e percorsi con stipendi, ore, aziende target)."), ("Altro", "Guida (PDF), FAQ, Contatti, Diventa mentor.")))

#sub3[#"Alternative e parere del report"]
#"Dal report: sono errori «indipendenti dalla demo»; la decisione 16 chiede solo chi li sistema. I contatori in home devono essere dimostrabili (200+ studenti e 95% di soddisfatti contro 78 iscritti nell'HQ)."

#sub3[#"Cosa serve"]
- #"Qualcuno che sistemi gli errori elencati (fase 1 di «Per andare online», costo 0 €)"

#sub3[#"Da decidere nella call"]
- #"Errori del sito (elencati in «Il sito di oggi»): chi li sistema?"

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: La landing demo v2 non rimanda al sito attuale: gli errori elencati sono del sito di oggi (Framer) e non compaiono nella demo."

#sub[#"Un brand, tanti hub: le 10 scuole"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 5"), ("Card", "landing L12"), ("Dove vive · landing", "Landing generale UniLink con la griglia «Scegli la tua scuola»; una pagina per ogni scuola in arrivo (lista d'attesa, idee di tool da votare, «fonda l'hub»).")))

#sub3[#"Proposta del report (demo v1)"]
#"UniLink è il brand: la landing generale parla a tutta l'Università di Firenze («Studia meglio, ovunque studi»). Ogni scuola ha il suo hub (UniLink Economia, UniLink Ingegneria…): stesso account, stesso piano di studio, stesso libretto e Career, ma appunti e tool propri. Le 10 scuole sono quelle dell'Università di Firenze. Economia è attiva. Le altre sono «in arrivo»: hanno una pagina con le idee di tool, una lista d'attesa e un invito a fondare l'hub (un piccolo gruppo di studenti di quella scuola che diventano ambassador e scelgono i primi esami). Si apre un hub quando ci sono il team e la domanda. I tool universali (voto di laurea, libretto, piano di studio, Erasmus, CV) funzionano da subito per tutti: portano iscritti da ogni scuola prima ancora dei contenuti."

#"Perché: Se UniLink si fa conoscere solo come «la cosa di Economia», quando vorremo aprire a Ingegneria o Giurisprudenza ripartiremo da zero. Ma se diventa troppo generico, a Economia perdiamo la cosa che oggi funziona: essere specifici sui loro esami."

#sub3[#"Le 10 scuole dell'Università di Firenze e i tool pensati per ciascuna"]
#tab(("Voce", "Testo"), (24%, 76%), (("Economia · attiva", "Dispense da 30 e lode, simulatore per gli esami a quiz, carriere in finance, consulting e audit."), ("Ingegneria · in arrivo", "Esercizi passo passo di Analisi e Fisica, propedeuticità e sbarramenti, progetti di gruppo."), ("Giurisprudenza · in arrivo", "Flashcard sugli articoli dei codici, simulazione dell'orale, percorsi dopo la laurea (avvocatura, magistratura, notariato)."), ("Medicina e Salute · in arrivo", "Banca domande per gli esami a quiz, tracker di tirocini e frequenze, simulatore del concorso di specializzazione."), ("Scienze · in arrivo", "Esercizi guidati, relazioni di laboratorio, dottorati e ricerca."), ("Scienze Politiche · in arrivo", "Concorsi pubblici e carriere internazionali (UE, ONG), tirocini."), ("Studi Umanistici · in arrivo", "Percorsi abilitanti all'insegnamento, bibliografie e citazioni, tesi."), ("Psicologia · in arrivo", "Tirocinio post-laurea ed esame di Stato, magistrali e scuole di specializzazione."), ("Architettura · in arrivo", "Calendario di consegne e revisioni, portfolio, concorsi di progettazione."), ("Agraria · in arrivo", "Tirocini in azienda, laboratori, sbocchi nell'agroalimentare.")))

#nota[#"I nomi delle scuole e le descrizioni dei tool sono letti dalla schermata «Scegli la tua scuola» del report (pagina 10): nel testo del report si cita solo «10 scuole» e gli esempi Ingegneria, Giurisprudenza e Medicina."]
#sub3[#"Cosa fanno le realtà che ci assomigliano (analisi del report)"]
#tab(("Voce", "Testo"), (24%, 76%), (("Studocu", "Cosa fa: appunti caricati dagli studenti, organizzati per università e corso, con pagine pubbliche indicizzate. Modello: freemium, circa l'80% gratis, il resto Premium a pagamento o in cambio di documenti caricati. Cosa prendiamo: pagine pubbliche per corso (Google) e premi a chi contribuisce."), ("Knowunity", "Cosa fa: appunti e community per studenti, oltre 20 milioni di utenti in 15 paesi. Modello: freemium con abbonamento + employer branding pagato da aziende. Cosa prendiamo: le aziende pagano per farsi conoscere: base per Career."), ("Amboss", "Cosa fa: solo medicina, libreria + banca domande, oltre il 60% delle facoltà di medicina tedesche. Modello: abbonamento annuale; oltre 100 milioni di € di ricavi ricorrenti (2023). Cosa prendiamo: un verticale profondo per area vale più di tanti contenuti generici."), ("Target Test Prep", "Cosa fa: corso GMAT con capitoli, lezioni, quiz di capitolo, piano personalizzato, registro errori, statistiche. Modello: abbonamento a tempo. Cosa prendiamo: il piano a missioni e calendario (vedi «Piano di studio»)."), ("Testbusters", "Cosa fa: preparazione ai test d'ammissione (medicina, professioni sanitarie, IMAT), in 34 città. Modello: corsi, simulazioni, tutor; crescita con acquisizioni (Ammesso.it). Cosa prendiamo: un verticale per tipo di prova, simulazioni come prodotto."), ("Uniwhere", "Cosa fa: libretto e carriera per università italiane e tedesche. Modello: le aziende pagano per proporre formazione e opportunità agli studenti profilati. Cosa prendiamo: il libretto come aggancio, le aziende come cliente.")))

#nota[#"Il filo comune (dal report): chi funziona ha un marchio unico e contenuti verticali (per corso o per prova). I ricavi arrivano da freemium + abbonamento o pacchetti, e quasi sempre da una seconda gamba B2B (aziende)."]
#sub3[#"Alternative e parere del report"]
#"Dal report: più avanti, se si esce da Firenze, «UniLink Firenze» diventa una città del brand. Per ora il dominio resta unilinkfirenze.it. Il report indica come criterio per le scuole dopo Economia: quelle con più iscritti in lista d'attesa e un team fondatore."

#sub3[#"Cosa serve"]
- #"Il team e la domanda: si apre un hub quando ci sono entrambi"
- #"Un piccolo gruppo di studenti di quella scuola che diventano ambassador e scelgono i primi esami (i «fondatori» dell'hub)"

#sub3[#"Da decidere nella call"]
- #"Il brand è «UniLink» con hub per scuola? Quali scuole dopo Economia (proposta: quelle con più iscritti in lista d'attesa e un team fondatore)?"
- #"Brand: UniLink con un hub per scuola; Economia attiva, le altre «in arrivo» con lista d'attesa e team fondatore. Quale scuola dopo?"

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Tre hub: Economia attivo; Giurisprudenza e Medicina in arrivo, con lista d'attesa e idea di costruirli con chi studia lì."
- #"Web app: Aree di studio: Economia attiva, Giurisprudenza e Medicina in arrivo, «un'altra area» come proposta."

#nota[#"Discordanze con il report su questo argomento (parte 6): n. 6. Non risolte: si decidono, non si correggono in silenzio."]
#sub[#"L'hub di Economia: «solo landing e poco altro»"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 5"), ("Card", "landing L13"), ("Dove vive · landing", "Landing su Framer: hub di Economia e pagine collegate.")))

#sub3[#"Proposta del report (demo v1)"]
#"L'hub di Economia è la landing di oggi rifatta con un solo scopo: far creare l'account. Sezioni: promessa e «Inizia gratis», tre passi, vetrina dei corsi, cosa c'è dentro l'account, ultimi aggiornamenti, tool gratuiti, prezzi, ambassador e mentor, FAQ. Il «poco altro» sono le pagine che servono a Google e alla fiducia: catalogo, schede corso, prezzi, Plus, ambassador, tool, pagine legali. La landing resta su Framer (si modifica come oggi). I pulsanti portano all'app con un parametro che dice da dove arrivano (?from=hero, ?from=corso…). La demo riproduce struttura e testi; la grafica definitiva si fa con i componenti Framer già esistenti."

#"Perché: Le schede corso e i tool sono quello che Google ci porta (102 clic al mese e in crescita). Se le chiudiamo dietro il login perdiamo traffico: tutto si vede, si scarica solo con l'account."

#sub3[#"Sezioni dell'hub di Economia (in ordine)"]
+ #"Promessa e «Inizia gratis»"
+ #"Tre passi"
+ #"Vetrina dei corsi"
+ #"Cosa c'è dentro l'account"
+ #"Ultimi aggiornamenti"
+ #"Tool gratuiti"
+ #"Prezzi"
+ #"Ambassador e mentor"
+ #"FAQ"

- #"Catalogo"
- #"Schede corso"
- #"Prezzi"
- #"Plus"
- #"Ambassador"
- #"Tool"
- #"Pagine legali"

#sub3[#"Pensata prima per il telefono"]
#tab(("Voce", "Testo"), (24%, 76%), (("Landing", "Costruita per lo smartphone (lì arrivano i link di WhatsApp e Instagram): pulsanti grandi, menu a tendina, numeri in tre riquadri."), ("Area personale", "Pensata per tablet e computer, dove si studia, ma funziona anche da telefono con una barra di navigazione in basso.")))

#sub3[#"Alternative e parere del report"]
#"Alternative scartate (dal report): tutto dentro l'app (si perde Google e la comodità di modificare i testi su Framer); landing minimale senza catalogo (si perde il traffico delle 34 schede); rifare il sito con un framework (costi e competenze che oggi non abbiamo)."

#sub3[#"Cosa serve"]
- #"Parametro ?from=… su ogni pulsante verso l'app (hero, corso, prezzi…), letto da Google Tag Manager e salvato dall'app con l'iscrizione"
- #"Componenti Framer già esistenti per la grafica definitiva"

#sub3[#"Da decidere nella call"]
- #"Struttura: landing su Framer + app su app.unilinkfirenze.it. Va bene?"

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Hub Economia: catalogo di anteprime, strumenti di Economia e rimandi all'area personale; le card aprono il catalogo dell'area."

#nota[#"Discordanze con il report su questo argomento (parte 6): n. 13. Non risolte: si decidono, non si correggono in silenzio."]
#sub[#"Catalogo e scheda corso con anteprime"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 5"), ("Card", "landing L14"), ("Dove vive · landing", "Hub di Economia: pagine catalogo e scheda corso (34 corsi di EA ed EC).")))

#sub3[#"Proposta del report (demo v1)"]
#"Il catalogo ha filtri per corso di laurea, anno, semestre e area. La ricerca senza risultati propone «Chiedi questo esame»: è un dato su cosa manca. Ogni scheda corso mostra: anteprima delle prime pagine (la quarta è sfocata fino all'accesso), com'è la prova (dai PDF Quiz), le informazioni utili prese dal sito, l'indice della dispensa (dai sorgenti), il registro degli aggiornamenti e un riquadro di acquisto che cambia in base a chi guarda (ospite, chi ha già la dispensa, chi ha ancora il gratuito)."

#"Perché: Convincere prima di registrarsi e creare fiducia: anteprime, indice, struttura della prova, versione e «aggiornata il»."

#sub3[#"Cosa mostra la scheda corso"]
+ #"Anteprima delle prime pagine (la quarta è sfocata fino all'accesso)"
+ #"Com'è la prova (dai PDF Quiz)"
+ #"Informazioni utili, prese dal sito"
+ #"Indice della dispensa (dai sorgenti)"
+ #"Registro degli aggiornamenti"
+ #"Riquadro di acquisto: cambia per ospite, chi ha già la dispensa, chi ha ancora il gratuito"

#sub3[#"Catalogo"]
#tab(("Voce", "Testo"), (24%, 76%), (("Filtri", "Per corso di laurea, anno, semestre e area."), ("Ricerca senza risultati", "Propone «Chiedi questo esame»: è un dato su cosa manca.")))

#sub3[#"Alternative e parere del report"]
#"Dal report: i dati dei 34 corsi si generano da soli con uno script (tools/genera_corsi.py) che legge il CSV del sito, scarica le informazioni utili dalle pagine pubblicate, trova i PDF, conta le pagine, prende la data del file, crea le anteprime e legge i capitoli dai sorgenti Typst."

#sub3[#"Cosa serve"]
- #"Script che genera il catalogo da CSV, sito e PDF (nel report: tools/genera_corsi.py)"
- #"Informazioni utili per partizione prese dalle pagine pubblicate"

#sub3[#"Da decidere nella call"]
- #"Nel report la scheda corso non ha domande aperte: la decisione 16 («Errori del sito») riguarda, tra l'altro, codici copertina e indirizzi con refusi delle pagine dispense."

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Carosello di dispense nell'hub Economia: ogni card apre il catalogo dell'area personale."
- #"Web app: Materiali: I miei pacchetti · Catalogo · Pacchetti semestre; card con copertina, anteprima, prezzo e «Apri dispensa». Non ci sono l'anteprima con quarta pagina sfocata né «Chiedi questo esame»."

#sub[#"Ultimo aggiornamento e registro versioni"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 8"), ("Card", "landing L15 · web app D27"), ("Dove vive · landing", "Landing (riquadro «Ultimi aggiornamenti», scheda corso) e area personale (avviso)."), ("Dove vive · web app", "Area personale: avviso «Nuova versione disponibile, riscaricala gratis»; pannello del team: colonna «programma verificato il».")))

#sub3[#"Proposta del report (demo v1)"]
#"Ogni dispensa ha versione e data. Nella landing c'è il riquadro «Ultimi aggiornamenti»; nella scheda corso il registro completo; nell'area personale l'avviso «Nuova versione disponibile, riscaricala gratis». Le revisioni vere (es. Marketing Internazionale v1.1 del 7 settembre, allineata al sillabo) si scrivono a mano nel registro aggiornamenti (nel report: config/sito.js)."

#"Perché: È il modo più economico per creare fiducia e dare un motivo per tornare. Risponde anche alla domanda tipica «ma è aggiornata al programma di quest'anno?»."

#nota[#"Attenzione (dal report): oggi la data «aggiornata il» viene dal file PDF. Per renderla affidabile serve una regola: ogni volta che si ricarica una dispensa si aggiunge una riga al registro con versione e cosa è cambiato. Nel pannello c'è anche una colonna «programma verificato il» da compilare corso per corso."]
#sub3[#"Dove compare"]
+ #"Landing: riquadro «Ultimi aggiornamenti»"
+ #"Scheda corso: registro completo"
+ #"Area personale: «Nuova versione disponibile, riscaricala gratis»"

#sub3[#"Alternative e parere del report"]
#"Alternative scartate (dal report): mostrare solo la data senza versione (non dice cosa è cambiato); notifiche via email a ogni aggiornamento (utili più avanti, quando ci sarà un servizio di email)."

#sub3[#"Cosa serve"]
- #"La regola del registro: una riga con versione e cosa è cambiato a ogni ricarica"
- #"«Programma verificato il» compilato corso per corso"

#sub3[#"Da decidere nella call"]
- #"Concordare la regola: a ogni ricarica di una dispensa si aggiunge una riga al registro con versione e cosa è cambiato (il report la indica come necessaria per rendere affidabile «aggiornata il»)."

#sub3[#"Nelle demo v2 oggi"]
- #"Web app: Dashboard: riquadro «Aggiornamenti ai tuoi materiali». Non esistono il registro versioni per corso né «Nuova versione disponibile»."

#sub[#"Prezzi e piani: la proposta del report"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 9"), ("Card", "landing L16 · web app D28"), ("Dove vive · landing", "Pagina Prezzi (con calcolo del pacchetto per corso, anno e semestre) e scheda corso."), ("Dove vive · web app", "Checkout e area personale (acquisti).")))

#sub3[#"Proposta del report (demo v1)"]
#"Listino proposto nel report (ipotesi da validare col sondaggio): account gratuito, Appunti, Dispensa completa 30L, Pacchetto Semestre, Pacchetto Anno, UniLink Plus (una tantum) e Tutoring 1-1. Il pacchetto semestre è il prodotto da spingere (in evidenza nella pagina prezzi). La pagina prezzi calcola il pacchetto per corso, anno e semestre."

#"Perché: Ricavi senza perdere chi non paga: un account gratuito con 1 dispensa a scelta, poi singoli, pacchetti e Plus. I prezzi vanno confermati col sondaggio."

#sub3[#"Cosa c'è nella demo del report (prezzi = ipotesi)"]
#tab(("Voce", "Descrizione", "Valore"), (24%, 56%, 20%), (("Account gratuito", "1 Appunti a scelta tra 3 esami (uno per anno: Microeconomia, Macroeconomia, Finanza Aziendale, si cambiano in config) + 1 Appunti in regalo quando il primo amico invitato conferma l'email", "0 €"), ("Appunti", "La dispensa Appunti/Sbobine di un esame. Prezzo di lancio, poi 9,99 €", "4,99 €"), ("Dispensa completa 30L", "Appunti + Mappe (dove ci sono) + Quiz & Simulazioni + simulatore. Prezzo di lancio, poi 18,99 €", "12,99 €"), ("Pacchetto Semestre", "Tutte le dispense complete di un semestre del proprio corso (3–4 esami). Il «invece di» si calcola da solo (38,97–51,96 €)", "29,99 €"), ("Pacchetto Anno", "I due semestri. Proposta di Claude: da vendere soprattutto a settembre–ottobre", "49,99 €"), ("UniLink Plus", "Piano di studio per tutti gli esami, 30 giorni di esercizi, ripasso errori, CV benchmark completo. Vale fino a fine sessione (28/2, 31/7 o 30/9). Con un pacchetto costa 10 € in meno", "14,99 € una tantum"), ("Tutoring 1-1", "Con chi ha preso 30 in quell'esame; pacchetto 3 ore 54 €; 75% al mentor, 25% a UniLink. Proposta di Claude", "20 €/ora")))

#sub3[#"Il parere sulla vostra proposta (dal report)"]
+ #"4,99 € per gli Appunti: giusto come prezzo d'impulso. Per confronto, Studocu Premium costa circa 3–5 € al mese secondo fonti terze, ma è generico; il nostro è specifico per l'esame UniFi."
+ #"12,99 € per la completa: ha senso se dentro ci sono davvero mappe, quiz e simulatore. Oggi le mappe esistono per 17 corsi su 34 e il simulatore per 2: o si produce prima il materiale, o per i corsi senza mappe si scende a 9,99 €."
+ #"«4,99 invece di 9,99» con il prezzo barrato: per legge (art. 17-bis del Codice del Consumo, direttiva Omnibus) il prezzo barrato deve essere il più basso praticato nei 30 giorni prima. Se non abbiamo mai venduto a 9,99 € non possiamo barrarlo. Si può invece dire «prezzo di lancio fino al 31 dicembre, poi 9,99 €», che è un'eccezione prevista: la demo fa così."
+ #"29,99 € «invece di 54,97»: il confronto è corretto solo se si calcola sui prezzi singoli veri. Con la completa a 12,99 € un semestre da 3–4 esami vale 38,97–51,96 €: la demo lo calcola da sola per ogni semestre."
+ #"Pacchetto anno: sì. Si vende a inizio anno quando la motivazione è alta, incassa subito e fidelizza. Il rischio di «cannibalizzare» il semestre è basso: chi compra l'anno è chi avrebbe comprato due semestri."
+ #"Plus una tantum: sì. Si studia a sessioni: un abbonamento mensile si disdice dopo l'esame e richiede gestione dei rinnovi e dei rimborsi. Una tantum per sessione è più semplice per tutti e si ricompra in modo naturale alla sessione dopo."
+ #"Tutoring: a Firenze la media è circa 21,60 €/ora e gli studenti UniFi su Superprof chiedono 15–18 €/ora. A 20 €/ora con un mentor «certificato UniLink» siamo nella media; la piattaforma tiene il 25%."
+ #"Potere d'acquisto: il pacchetto semestre è il prodotto da spingere (in evidenza nella pagina prezzi). I prezzi vanno comunque confermati col sondaggio."

#sub3[#"Alternative e parere del report"]
#"Dal report (il parere sulla vostra proposta): 4,99 € per gli Appunti è giusto come prezzo d'impulso; 12,99 € per la completa ha senso se dentro ci sono davvero mappe, quiz e simulatore (oggi le mappe esistono per 17 corsi su 34 e il simulatore per 2: o si produce prima il materiale, o per i corsi senza mappe si scende a 9,99 €); pacchetto anno sì; Plus una tantum sì; tutoring in linea con la media di Firenze."

#sub3[#"Cosa serve"]
- #"Sondaggio sui prezzi (vedi «Marketing, posizionamento e sondaggio»)"
- #"Materiale prodotto: mappe (oggi 17 corsi su 34) e simulatore (oggi 2 corsi)"
- #"Soggetto legale per incassare (vedi «Pagamenti»)"

#sub3[#"Da decidere nella call"]
- #"Confermate i prezzi di partenza? Quali 3 esami nel gratuito? Il regalo per invito resta 1 o cresce (1 ogni amico, massimo 3)? Plus ha senso già al lancio o dopo, quando il simulatore copre più esami?"
- #"Prezzi: 4,99 / 12,99 / 29,99 / 49,99 / Plus 14,99 una tantum / tutoring 20 €/ora. Lanciamo il sondaggio a metà ottobre?"
- #"Prezzo di lancio fino al 31/12 al posto del prezzo barrato: d'accordo?"
- #"Gratuito: quali 3 esami (uno per anno)? Regalo per invito: 1 o più?"

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Pagina Prezzi di esempio (fuori barra), letta da UL_CFG.prezzi."
- #"Web app: UL.PIANI: Gratuito, Pacchetto esame, Pacchetto semestre, Plus (ipotesi HQ)."

#nota[#"Discordanze con il report su questo argomento (parte 6): n. 1, n. 2, n. 3, n. 4. Non risolte: si decidono, non si correggono in silenzio."]
#sub[#"UniLink Plus: il metodo, non i contenuti"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 10"), ("Card", "landing L17 · web app D29"), ("Dove vive · landing", "Pagina pubblica «Plus» (#/plus) con il confronto gratuito/Plus."), ("Dove vive · web app", "Area personale: limiti visibili del piano gratuito e sblocchi di Plus.")))

#sub3[#"Proposta del report (demo v1)"]
#"Plus è il «metodo», non i contenuti: le dispense si comprano a parte. Costa 14,99 € una tantum e vale fino alla fine della sessione; con un pacchetto costa 10 € in meno. Pagina pubblica #/plus con il confronto gratuito/Plus e i vantaggi per Economia; nell'app i limiti sono visibili (es. il piano gratuito segue un esame alla volta, il CV gratuito mostra 5 regole su 17)."

#"Perché: Le dispense sono il prodotto più facile da copiare; il metodo (piano, test, simulazioni, registro errori, carriera) no. Plus è anche il prodotto che regge l'espansione: è uguale per tutte le scuole."

#sub3[#"Gratis e Plus, a confronto"]
#tab(("Voce", "Testo"), (24%, 76%), (("Piano di studio", "Gratis: 1 esame alla volta. Plus: tutti gli esami della sessione, calendario unico, ottimizzatore degli obiettivi, coach."), ("Test e simulatore", "Gratis: prova da 5 domande. Plus: simulazioni a tempo con il punteggio vero e test dopo ogni capitolo, per tutti gli esami che hai."), ("Registro errori", "Gratis: —. Plus: le domande sbagliate tornano finché non le sai, con il motivo dell'errore."), ("Esercizi quotidiani", "Gratis: —. Plus: 30 giorni di «missioni» brevi."), ("Career", "Gratis: template CV e prime 5 regole. Plus: benchmark completo per 8 carriere, template in inglese, shortlist dei master con scadenze."), ("Avvisi", "Gratis: nuove versioni delle dispense. Plus: appelli, bandi Erasmus, scadenze dei master (nel report il testo di Plus è preceduto da «1.»: probabilmente un «+» venuto male, da confermare).")))

#sub3[#"Perché conviene a chi studia Economia (dal report)"]
+ #"Esami diversissimi nello stesso semestre: matematica, diritto e aziendale insieme. Il piano cambia metodo per ognuno invece di dare lo stesso calendario a tutti."
+ #"Tanti esami a quiz ed esercizi (Statistica, Matematica, Banca, Bilancio): il simulatore con il punteggio vero è l'allenamento più vicino alla prova."
+ #"La media conta per il dopo: magistrali e master (Bocconi, LSE, HEC…) guardano la media; l'ottimizzatore distribuisce il tempo per tenerla più alta possibile."
+ #"Carriere con standard rigidi: finance, consulting e audit scartano i CV fatti male in pochi secondi; il benchmark dice cosa manca."

#sub3[#"Alternative e parere del report"]
#"Alternative scartate (dal report): Plus con dentro le dispense (prezzo alto e confuso); abbonamento mensile (si disdice dopo l'esame); tutto gratis (niente ricavi dalla parte che costa di più costruire)."

#sub3[#"Cosa serve"]
- #"Piano di studio multi-esame, simulatore, registro errori ed esercizi quotidiani costruiti (vedi le card su simulatore e piano di studio)"
- #"Career completo (CV benchmark per 8 carriere)"

#sub3[#"Da decidere nella call"]
- #"Plus: piano multi-esame, test e simulatore, registro errori, Career completo; le dispense restano a parte. D'accordo?"
- #"Plus ha senso già al lancio o dopo, quando il simulatore copre più esami?"

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Nessuna pagina Plus; la card L07 cita «Plus mensile» come ipotesi."
- #"Web app: Plus a 4,99 € al mese («prezzo da decidere»): esercitazioni complete, simulazioni a tempo e ripasso errori, sconto sui mentor, si disdice quando vuoi."

#nota[#"Discordanze con il report su questo argomento (parte 6): n. 2, n. 3. Non risolte: si decidono, non si correggono in silenzio."]
#sub[#"Pagamenti e soggetto legale"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 11"), ("Card", "landing L18 · web app D30"), ("Dove vive · landing", "Checkout e pagine «Termini» e «Privacy»."), ("Dove vive · web app", "Checkout (con casella di rinuncia al recesso) e acquisti.")))

#sub3[#"Proposta del report (demo v1)"]
#"Le strade tipiche per avere un soggetto sono un'associazione, una partita IVA (regime forfettario) di uno dei founder o una società: ognuna ha costi e obblighi diversi e va scelta con un commercialista. Poi si incassa con Stripe Checkout (consigliato nel report). Nel checkout c'è già la casella per rinunciare al recesso sui contenuti digitali; le pagine «Termini» e «Privacy» sono bozze da far scrivere bene quando esiste il soggetto."

#"Perché: Oggi UniLink non ha un soggetto legale: senza, non si può vendere né pagare ambassador e mentor. Finché non c'è, nella demo il pagamento è simulato."

#sub3[#"Come incassare: le opzioni"]
#tab(("Voce", "Testo"), (24%, 76%), (("Stripe Checkout (consigliato)", "Pro: carta, Apple Pay, Google Pay; nessun canone; per le carte europee standard 1,5% + 0,25 € a transazione; si collega a Supabase; esistono anche «payment link» senza codice. Contro: serve un soggetto con conto e dati fiscali."), ("PayPal", "Pro: molto conosciuto. Contro: commissioni più alte, esperienza meno fluida."), ("Satispay", "Pro: diffuso tra gli studenti italiani. Contro: da aggiungere dopo, non come unico metodo."), ("Rivenditori «merchant of record» (es. Paddle, Lemon Squeezy)", "Pro: gestiscono loro IVA e fatture. Contro: commissioni più alte; serve comunque qualcuno che riceva i soldi.")))

#sub3[#"Strade per avere un soggetto legale"]
+ #"Un'associazione"
+ #"Una partita IVA (regime forfettario) di uno dei founder"
+ #"Una società"

#nota[#"Già previsto nella demo del report: per i contenuti digitali il diritto di recesso si perde solo se il cliente chiede di riceverli subito e lo accetta espressamente: nel checkout c'è la casella apposita. Le pagine «Termini» e «Privacy» sono bozze da far scrivere bene quando esiste il soggetto."]
#sub3[#"Alternative e parere del report"]
#"Dal report: Stripe Checkout è l'opzione consigliata. Per i contenuti digitali il diritto di recesso si perde solo se il cliente chiede di riceverli subito e lo accetta espressamente: nel checkout c'è la casella apposita."

#sub3[#"Cosa serve"]
- #"Un soggetto legale (scelto con un commercialista)"
- #"Un conto e dati fiscali per Stripe"
- #"Pagine «Termini» e «Privacy» scritte bene"

#sub3[#"Da decidere nella call"]
- #"Chi parla con un commercialista e entro quando? Domande da fare: forma più semplice per vendere contenuti digitali a studenti; IVA sui contenuti digitali; come pagare mentor e ambassador."
- #"Soggetto legale: chi sente un commercialista e entro quando?"

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Nessun checkout."
- #"Web app: Checkout simulato con coupon; nessun addebito reale."

#sub[#"Referral e campus ambassador"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 12"), ("Card", "landing L19 · web app D31"), ("Dove vive · landing", "Pagina pubblica «Ambassador» con candidatura; volantini con QR e codice in aula e a Novoli."), ("Dove vive · web app", "Area personale: «Invita amici» (codice fisso, link, WhatsApp, avanzamento) e dashboard dell'ambassador.")))

#sub3[#"Proposta del report (demo v1)"]
#"Referral: ogni account ha un codice fisso e unico (es. UL-D96C) e un link …?ref=UL-D96C. Chi si iscrive col link vede chi l'ha invitato; quando conferma l'email UniFi scatta il regalo per chi ha invitato. Un'email, un regalo: non si può barare con account falsi. Ambassador: pagina pubblica con candidatura; nell'area personale l'ambassador vede iscritti, confermati, venduto, i suoi crediti (20% del venduto) e un messaggio pronto per il gruppo WhatsApp col suo codice. Si possono avere più ambassador per anno e corso, ognuno col suo codice. Percorso verso il ruolo di mentor. All'inizio gli ambassador ricevono crediti (dispense, Plus) invece di soldi; quando c'è il soggetto legale si passa alla commissione in denaro con le regole giuste."

#"Perché: Il canale principale oggi è WhatsApp: le persone che stanno nei gruppi valgono più di qualsiasi pubblicità. Un codice fisso si ricorda e si può stampare su un volantino."

#sub3[#"Come funziona"]
#tab(("Voce", "Testo"), (24%, 76%), (("Referral", "Codice fisso e unico per account (es. UL-D96C) e link …?ref=UL-D96C. Chi si iscrive col link vede chi l'ha invitato; quando conferma l'email UniFi scatta il regalo per chi ha invitato. Le regole (quanti amici per un regalo, quanti regali al massimo) sono nel config dei piani."), ("Ambassador", "Pagina pubblica con candidatura. Nell'area personale: iscritti, confermati, venduto, crediti (20% del venduto) e messaggio pronto per il gruppo WhatsApp col suo codice. Più ambassador per anno e corso, ognuno col suo codice."), ("Crediti", "All'inizio gli ambassador ricevono crediti (dispense, Plus) invece di soldi. Quando c'è il soggetto legale si passa alla commissione in denaro con le regole giuste.")))

#sub3[#"Alternative e parere del report"]
#"Alternative scartate (dal report): codici diversi a ogni invito (più complicati da ricordare); pagare gli ambassador in denaro da subito (senza soggetto legale crea problemi fiscali a loro e a noi); sconti al posto dei regali (abbassano il prezzo percepito)."

#sub3[#"Cosa serve"]
- #"Soggetto legale per passare dai crediti alla commissione in denaro"
- #"Regole del regalo: quanti amici per un regalo, quanti regali al massimo"

#sub3[#"Da decidere nella call"]
- #"Ambassador: commissione 20% in crediti finché non si può pagare. Quanti per anno?"
- #"Gratuito: quali 3 esami (uno per anno)? Regalo per invito: 1 o più? (1 ogni amico, massimo 3?)"

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Community: gruppi WhatsApp per anno e ambassador, senza codici."
- #"Web app: Nessun referral nella parte decisa; D10 (Career) ha un codice invito con crediti, D19 un club con ambassador."

#nota[#"Discordanze con il report su questo argomento (parte 6): n. 10. Non risolte: si decidono, non si correggono in silenzio."]
#sub[#"SUSBUS e SECI: iscrizione e richieste"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 17"), ("Card", "landing L20 · web app D32"), ("Dove vive · landing", "Catalogo (filtro per corso di laurea) e scelta del corso alla registrazione."), ("Dove vive · web app", "Registrazione (scelta del corso di laurea) e pannello del team (richieste).")))

#sub3[#"Proposta del report (demo v1)"]
#"SUSBUS (Sustainable Business for Societal Challenges, B314) è della Scuola di Economia, interamente in inglese, a numero programmato: condivide con EA le basi aziendali (contabilità, diritto, statistica) ma ha esami propri su sostenibilità e impatto. SECI (Sviluppo sostenibile, cooperazione e gestione dei conflitti) è un corso di scienze sociali con tre curricula al terzo anno (Economia Politica, Scienza Politica, Sociologia, Relazioni internazionali, Diritto internazionale): con EA/EC coincide poco. Si possono scegliere alla registrazione. Nel catalogo, scegliendo SUSBUS o SECI compare la lista dei loro esami (dalle pagine ufficiali) con la dispensa UniLink «più vicina» e il pulsante «Chiedi». Le richieste finiscono nel pannello."

#"Perché: Produrre dispense costa molto: prima si misura quanta domanda c'è e per quali esami."

#sub3[#"I due corsi"]
#tab(("Voce", "Testo"), (24%, 76%), (("SUSBUS (B314)", "Sustainable Business for Societal Challenges: Scuola di Economia, interamente in inglese, a numero programmato. Condivide con EA le basi aziendali (contabilità, diritto, statistica); esami propri su sostenibilità e impatto."), ("SECI", "Sviluppo sostenibile, cooperazione e gestione dei conflitti: corso di scienze sociali con tre curricula al terzo anno: Economia Politica, Scienza Politica, Sociologia, Relazioni internazionali, Diritto internazionale. Con EA/EC coincide poco.")))

#sub3[#"Come funziona"]
+ #"Il corso si sceglie alla registrazione"
+ #"Nel catalogo compare la lista degli esami (dalle pagine ufficiali) con la dispensa UniLink «più vicina» e il pulsante «Chiedi»"
+ #"Le richieste finiscono nel pannello"
+ #"Quando un esame supera una soglia di richieste, si cercano i materiali e si produce come per gli altri corsi"

#sub3[#"Alternative e parere del report"]
#"Alternative scartate (dal report): produrre subito per tutti e due (rischio di lavorare per pochi); ignorarli (si perde un pubblico vicino che è già a Novoli)."

#sub3[#"Cosa serve"]
- #"Lista degli esami per corso (nel report: config/corsi-di-laurea.js, con EA, EC, SUSBUS, SECI)"
- #"Una soglia di richieste oltre la quale produrre la dispensa"

#sub3[#"Da decidere nella call"]
- #"SUSBUS e SECI: richieste ora, dispense quando superano una soglia (quale?)."

#sub3[#"Nelle demo v2 oggi"]
- #"Web app: Il corso si sceglie nel primo accesso; le aree contengono solo EA ed EC. SUSBUS e SECI non ci sono."

#sub[#"Metriche e tracciamento"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 18"), ("Card", "landing L21 · web app D33"), ("Dove vive · landing", "Sito Framer: Google Tag Manager + Cookie Banner; parametro ?from= sui pulsanti verso l'app."), ("Dove vive · web app", "App (con il consenso) e pannello del team (schede «Tracciamento» e «Panoramica»).")))

#sub3[#"Proposta del report (demo v1)"]
#"Un piano di tracciamento: per ogni evento dice dove si misura, quando, con quali dati e quale decisione aiuta a prendere. Due livelli: sul sito Framer (anonimo) click sui pulsanti per posizione, apertura delle anteprime, sezione prezzi vista, uso dei tool, provenienza (WhatsApp, Instagram, Google, referral), con Google Tag Manager (due righe nelle impostazioni del sito Framer, sezione Custom Code) più il Cookie Banner di Framer per il consenso; nell'app (con il consenso) registrazione, email confermata, dispensa gratis scelta, download, quiz, piani, sessioni spuntate, questionario dopo l'esame, CV, checkout, acquisti, condivisioni del link, clic sulle «porte finte», richieste di materiale, segnalazioni di errori."

#"Perché: Il sito carica Google Analytics 4: conta visite, pagine e provenienza, ma non sa quale pulsante viene cliccato, quanti arrivano alla registrazione o cosa succede dopo."

#sub3[#"I numeri da guardare ogni settimana (obiettivi iniziali = ipotesi)"]
#tab(("Voce", "Descrizione", "Valore"), (24%, 56%, 20%), (("Conversione landing → account", "iscrizioni / visitatori unici", "> 8%"), ("Attivazione", "account con un download entro 24 ore / nuovi account", "> 60%"), ("Ritorno a 4 settimane", "attivi nella settimana 4 / iscritti di quella settimana", "> 25%"), ("Fattore referral", "amici confermati / utenti che condividono", "> 0,5"), ("Conversione a pagamento", "acquirenti / account attivi", "> 5% nella prima sessione"), ("North Star", "studenti attivi a settimana (download, quiz o piano)", "crescita costante")))

#nota[#"«Porte finte» (dal report): sono pulsanti di funzioni che non esistono ancora (lettera di presentazione, mentor 1-1, offerte di stage, piano con AI, simulatore per altri esami, tutoring). Chi clicca viene messo in lista d'attesa e il clic viene contato. È il modo più economico per sapere cosa costruire prima di spendere tempo e soldi."]
#sub3[#"I due livelli"]
#tab(("Voce", "Testo"), (24%, 76%), (("Sul sito Framer (anonimo)", "Click sui pulsanti per posizione, apertura delle anteprime, sezione prezzi vista, uso dei tool, provenienza (WhatsApp, Instagram, Google, referral)."), ("Nell'app (con il consenso)", "Registrazione, email confermata, dispensa gratis scelta, download, quiz, piani, sessioni spuntate, questionario dopo l'esame, CV, checkout, acquisti, condivisioni del link, clic sulle «porte finte», richieste di materiale, segnalazioni di errori.")))

#sub3[#"Alternative e parere del report"]
#"Dal report: il trucco principale è senza codice: ogni pulsante verso l'app ha un parametro (?from=hero, ?from=corso, ?from=prezzi) che Tag Manager legge e che l'app salva con l'iscrizione. Senza consenso alle statistiche gli eventi restano anonimi."

#sub3[#"Cosa serve"]
- #"Google Tag Manager installato su Framer (due righe in Custom Code)"
- #"Cookie Banner di Framer per il consenso"
- #"Guida passo passo (nel report: docs/framer_tracking.md)"

#sub3[#"Da decidere nella call"]
- #"Tracciamento: chi installa Google Tag Manager e il Cookie Banner su Framer?"

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Nessun tracciamento a eventi; mancano privacy, cookie e termini."
- #"Web app: Nessun tracciamento a eventi; commenti del team sulle demo."

#nota[#"Discordanze con il report su questo argomento (parte 6): n. 14. Non risolte: si decidono, non si correggono in silenzio."]
#sub[#"Architettura dei tool: universali, di scuola, di livello"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 20"), ("Card", "landing L22 · web app D34"), ("Dove vive · landing", "Pagina Tools (filtri per scuola e per livello; «Idea» con pulsante «Mi serve»)."), ("Dove vive · web app", "Area personale: libretto, shortlist e scadenze, checklist; pulsante «segnala» al posto del gruppo WhatsApp per i problemi dei tool.")))

#sub3[#"Proposta del report (demo v1)"]
#"Tre famiglie. Universali: un solo motore, con le regole di ogni scuola (voto di laurea, libretto, piano di studio, Erasmus, CV, scadenze, tasse e borse). Di scuola: utili solo lì, e spesso il valore è il tool stesso (a Economia simulatore e Master finder; a Ingegneria esercizi passo passo e propedeuticità; a Giurisprudenza flashcard sui codici e simulatore d'orale; a Medicina tracker dei tirocini). Di livello: tesi, stage e placement, dottorati, per magistrale e ciclo unico. Nella pagina Tools si filtrano per scuola e per livello; quelli che non esistono ancora sono segnati come «Idea» e hanno un pulsante «Mi serve» che conta l'interesse."

#"Perché: Crescere su altre scuole e sulla magistrale senza rifare tutto: per ogni tool si deve sapere a chi serve, in che stato è e cosa facciamo di quelli che esistono già."

#sub3[#"Le tre famiglie"]
#tab(("Voce", "Testo"), (24%, 76%), (("Universali", "Un solo motore, con le regole di ogni scuola: voto di laurea, libretto, piano di studio, Erasmus, CV, scadenze, tasse e borse."), ("Di scuola", "Utili solo lì: Economia simulatore e Master finder; Ingegneria esercizi passo passo e propedeuticità; Giurisprudenza flashcard sui codici e simulatore d'orale; Medicina tracker dei tirocini."), ("Di livello", "Tesi, stage e placement, dottorati, per magistrale e ciclo unico.")))

#sub3[#"Tool di oggi: decisione e perché"]
#tab(("Voce", "Descrizione", "Valore"), (24%, 56%, 20%), (("Calcolatore voto di laurea", "Il più cercato su Google: resta pubblico; nell'account ricorda i voti", "Tenere"), ("Calcolatore Erasmus + Destinazioni", "Un solo tool «Erasmus»: punteggio, mete compatibili, learning agreement. Lista da aggiornare a ogni bando", "Unire"), ("Master / Magistrale", "Consultazione pubblica; shortlist e scadenze nell'account", "Tenere"), ("Esploratore di carriera", "Contenuto unico; da collegare al CV benchmark della stessa traiettoria", "Tenere"), ("Guida (PDF)", "Meglio pagine web (Google) + checklist nell'account", "Nell'account")))

#sub3[#"Da verificare"]
#tab(("Voce", "Testo"), (24%, 76%), (("Dati Erasmus", "Il foglio si chiama «2021-2»: aggiornare al bando 2026/27."), ("Prova finale", "Il regolamento usato è del 2017/2018: confermare quello in vigore."), ("Master finder", "Righe incomplete (nell'Excel il ritorno sull'investimento dà errore); spiegare in pagina i criteri delle fasce."), ("Supporto", "«Scrivi sul gruppo WhatsApp» per i problemi dei tool diventa il pulsante «segnala» nell'app.")))

#sub3[#"Alternative e parere del report"]
#"Dal report: il calcolatore voto di laurea resta pubblico (è il più cercato su Google) e nell'account ricorda i voti; Erasmus + Destinazioni si uniscono in un solo tool; Master/Magistrale resta con consultazione pubblica e shortlist nell'account; la Guida PDF va nell'account (meglio pagine web per Google + checklist nell'account)."

#sub3[#"Cosa serve"]
- #"Registro dei tool (nel report: config/hub.js) con scuole, livelli, stato e decisione"
- #"Le quattro verifiche elencate in «Da verificare»"

#sub3[#"Da decidere nella call"]
- #"Nel report l'architettura dei tool non ha una domanda esplicita per la call; le «Da verificare» (dati Erasmus, regolamento prova finale, Master finder, supporto) sono da chiudere."

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Strumenti: Voto di laurea, Media e voto obiettivo, Piano per l'appello, Punteggio Erasmus, Voto di laurea · ciclo unico, Piano semestre filtro."
- #"Web app: «Tools» nell'intestazione rimanda agli strumenti del sito."

#sub[#"Marketing e sondaggio sui prezzi"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 21"), ("Card", "landing L23"), ("Dove vive · landing", "Fuori dal sito: gruppi WhatsApp, Instagram, Google (Search Console), volantini in aula e a Novoli; sondaggio su Tally.")))

#sub3[#"Proposta del report (demo v1)"]
#"Posizionamento: «Da studenti per studenti, gli appunti da 30 e lode e un piano per arrivarci». Onesto, mai aziendale (come oggi), ma con una promessa più concreta: non solo materiale, anche metodo. Canali in ordine di priorità: WhatsApp, referral e ambassador, Google, Instagram, in aula e a Novoli. Sondaggio sui prezzi: 12 domande in 3 minuti su Tally (gratuito), con 4 domande «Van Westendorp» sul pacchetto semestre."

#"Perché: Servono prezzi fissati su dati veri: capire quale pacchetto preferiscono gli studenti e se Plus interessa."

#sub3[#"Canali, in ordine di priorità"]
+ #"WhatsApp: resta il canale principale (libreria messaggi già pronta). Ogni messaggio con utm_source=whatsapp e, per gli ambassador, il loro codice."
+ #"Referral e ambassador: il codice fisso trasforma ogni studente in un canale."
+ #"Google: le schede corso pubbliche; inviare la sitemap a Search Console (oggi 32 pagine su 50 non sono note a Google) e correggere gli indirizzi con refusi."
+ #"Instagram: reel e caroselli brevi del tipo «come si passa Microeconomia», con link alla scheda corso. Il canale dove gli studenti passano più tempo dopo WhatsApp."
+ #"In aula e a Novoli: QR sui volantini con il codice dell'ambassador del corso."

#sub3[#"Sondaggio sui prezzi"]
#tab(("Voce", "Testo"), (24%, 76%), (("Perché", "Per fissare i prezzi su dati veri, capire quale pacchetto preferiscono e se Plus interessa."), ("Come", "12 domande in 3 minuti su Tally (gratuito); 4 domande «Van Westendorp» sul pacchetto semestre (a che prezzo è troppo economico, un affare, caro ma lo prenderei, troppo caro)."), ("Dove", "Gruppi WhatsApp di 1°, 2° e 3° anno, storia Instagram, email ai 78 iscritti, ambassador in aula."), ("Quando", "Da metà ottobre per 10 giorni, analisi entro fine mese, prezzi pronti a novembre, prima della sessione invernale."), ("Incentivo", "Una dispensa Appunti gratis a chi risponde (porta anche iscrizioni)."), ("Obiettivo", "Almeno 100 risposte, almeno 30 per anno. Testo pronto nel report (docs/sondaggio_prezzi.md).")))

#sub3[#"Alternative e parere del report"]
#"Dal report: il sondaggio parte da metà ottobre per 10 giorni, analisi entro fine mese, prezzi pronti a novembre, prima della sessione invernale."

#sub3[#"Cosa serve"]
- #"Tally (gratuito)"
- #"Sitemap inviata a Search Console e indirizzi con refusi corretti"
- #"Libreria di messaggi WhatsApp (già pronta) con utm_source=whatsapp"

#sub3[#"Da decidere nella call"]
- #"Prezzi: lanciamo il sondaggio a metà ottobre? (decisione 7 del report)"

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Nessuna parte di marketing nelle demo."

#sub[#"Rischi e cose legali"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 22"), ("Card", "landing L24 · web app D35"), ("Dove vive · landing", "Pagine «Termini», «Privacy», «Fonti e diritti», footer, checkout, banner cookie."), ("Dove vive · web app", "Registrazione (consensi separati), profilo (esportazione e cancellazione dati), checkout (recesso), termini d'uso.")))

#sub3[#"Proposta del report (demo v1)"]
#"Il report elenca nove temi con cosa fare per ciascuno (tabella qui sotto). Alcuni sono già nella demo del report (nome UniFi nel footer, casella di recesso, informativa e consensi separati, esportazione e cancellazione dei dati dal profilo)."

#"Perché: Obbligatori quando si vende: soggetto legale, privacy, termini, fonti, consenso cookie e recesso."

#sub3[#"Tema → cosa fare"]
#tab(("Voce", "Testo"), (24%, 76%), (("Soggetto legale", "Senza, non si può vendere né pagare ambassador e mentor. Prima cosa da sistemare (vedi «Pagamenti»)."), ("Contenuti e diritti", "Le dispense rielaborano programmi e testi dei docenti. Regola: solo rielaborazioni originali, niente copie di slide o capitoli; pagina «Fonti e diritti»; rimozione rapida su segnalazione."), ("Nome e logo UniFi", "UniLink è indipendente: dirlo chiaramente (già nel footer della demo). Attenzione all'uso del logo dell'Università nelle copertine e sul sito se si vende."), ("Prezzi barrati", "Solo «prezzo di lancio» con aumento annunciato, o prezzi davvero praticati nei 30 giorni prima (art. 17-bis Codice del Consumo)."), ("Recesso", "Casella di rinuncia al recesso per i contenuti digitali nel checkout (già nella demo)."), ("Privacy (GDPR)", "Informativa, consensi separati, banner cookie con Consent Mode, esportazione e cancellazione dei dati dal profilo (già nella demo). Se in futuro i profili vengono mostrati ad aziende serve un consenso specifico."), ("Numeri pubblici", "I contatori in home (200+ studenti, 95% soddisfatti) devono essere dimostrabili."), ("PACRAR", "Citare la fonte o chiedere il permesso prima di usare il nome in un prodotto a pagamento."), ("Qualità dei quiz", "Correggere sequenza delle risposte e stile delle domande prima di venderli.")))

#sub3[#"Alternative e parere del report"]
#"Dal report: senza soggetto legale non si può vendere né pagare ambassador e mentor: è la prima cosa da sistemare (vedi «Pagamenti»)."

#sub3[#"Cosa serve"]
- #"Soggetto legale"
- #"Pagine «Termini», «Privacy» e «Fonti e diritti» scritte bene"
- #"Consenso specifico se in futuro i profili vengono mostrati ad aziende"

#sub3[#"Da decidere nella call"]
- #"Soggetto legale: chi sente un commercialista e entro quando?"
- #"Piano di studio: contattiamo Alessandro de Concini? (nome PACRAR)"

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Nessuna pagina legale; lista d'attesa e acquisti simulati."
- #"Web app: Consensi separati nel primo accesso; nessuna pagina Termini/Privacy."

#sub[#"Per andare online: le sei fasi"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 23"), ("Card", "landing L25 · web app D36"), ("Dove vive · landing", "Fase 1 sul sito Framer (sitemap, Google Tag Manager, Cookie Banner, pulsanti con ?from=)."), ("Dove vive · web app", "Fasi 2, 3 e 6: Supabase, web app su app.unilinkfirenze.it, AI per piano e CV (solo Plus).")))

#sub3[#"Proposta del report (demo v1)"]
#"Il report indica sei fasi in ordine, ognuna con il costo stimato (tabella qui sotto). Il codice della demo è pensato per questo passaggio: lo store ha le stesse tabelle che andrebbero su Supabase, le scelte di business sono già in file separati e le pagine non cambiano."

#"Perché: La demo del report gira sul computer e i dati stanno nel browser: per andare online servono backend, hosting, soggetto legale e contenuti."

#sub3[#"Le sei fasi"]
+ #"Sistemare il sito di oggi: errori elencati in «Il sito di oggi», sitemap, Google Tag Manager e Cookie Banner su Framer, pulsanti con ?from= · Costo stimato: 0 €"
+ #"Backend: Supabase (login con link email, database con le stesse tabelle della demo, storage privato dei PDF, filigrana sul server). Il piano gratuito include 50.000 utenti attivi al mese, 500 MB di database e 1 GB di file; i progetti gratuiti si mettono in pausa dopo una settimana senza attività · Costo stimato: 0 € all'inizio, poi il piano Pro"
+ #"Web app su app.unilinkfirenze.it (hosting statico gratuito, es. GitHub Pages, già usato per l'HQ), partendo dal codice della demo · Costo stimato: 0 € + dominio già nostro"
+ #"Soggetto legale + Stripe · Costo stimato: costi del commercialista e della forma scelta; Stripe solo a commissione"
+ #"Contenuti: quiz corretti, più esami nel simulatore, mappe del 3° anno, Topics in Corporate Finance e Diritto del Lavoro · Costo stimato: tempo"
+ #"AI per rifinire piano e CV, solo in Plus · Costo stimato: pochi centesimi per studente"

#sub3[#"Alternative e parere del report"]
#"Dal report: Supabase ha un piano gratuito (50.000 utenti attivi al mese, 500 MB di database, 1 GB di file); attenzione, i progetti gratuiti si mettono in pausa dopo una settimana senza attività."

#sub3[#"Cosa serve"]
- #"Account Supabase"
- #"Dominio app.unilinkfirenze.it (già nostro)"
- #"Soggetto legale + Stripe"
- #"Quiz corretti e più esami nel simulatore"

#sub3[#"Da decidere nella call"]
- #"Struttura: landing su Framer + app su app.unilinkfirenze.it. Va bene? (decisione 1 del report)"

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Deploy: GitHub Pages con backup automatico."
- #"Web app: Il PDF di architettura propone Next.js su Vercel + Supabase."

#nota[#"Discordanze con il report su questo argomento (parte 6): n. 11. Non risolte: si decidono, non si correggono in silenzio."]
#sub[#"Decisioni per la call e fonti del report"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 1, 24 e 25"), ("Card", "landing L26 · web app D37"), ("Dove vive · landing", "Questa card raccoglie le domande che nel report stanno a fine sezione; ogni voce rimanda alla card della sezione corrispondente."), ("Dove vive · web app", "Idem: ogni decisione ha la sua card.")))

#sub3[#"Proposta del report (demo v1)"]
#"Le decisioni per la call sono elencate qui sotto come nel report (sezione 24, 16 voci) e come nella sintesi (sezione 1, 10 voci con la proposta nella demo). In fondo le fonti usate dal report (sezione 25)."

#"Perché: Il report chiude con le decisioni da prendere nella call: ogni voce ha una proposta già scritta nella demo del report."

#sub3[#"Decisioni per la call (sezione 24 del report)"]
+ #"Struttura: landing su Framer + app su app.unilinkfirenze.it. Va bene?"
+ #"Brand: UniLink con un hub per scuola; Economia attiva, le altre «in arrivo» con lista d'attesa e team fondatore. Quale scuola dopo?"
+ #"Plus: piano multi-esame, test e simulatore, registro errori, Career completo; le dispense restano a parte. D'accordo?"
+ #"Accesso: email UniFi + link via email. Email personale aggiuntiva per chi si laurea?"
+ #"PDF: filigrana + marcatura invisibile + PDF privati + limite giornaliero. Limite a 15 download al giorno?"
+ #"Gratuito: quali 3 esami (uno per anno)? Regalo per invito: 1 o più?"
+ #"Prezzi: 4,99 / 12,99 / 29,99 / 49,99 / Plus 14,99 una tantum / tutoring 20 €/ora. Lanciamo il sondaggio a metà ottobre?"
+ #"Prezzo di lancio fino al 31/12 al posto del prezzo barrato: d'accordo?"
+ #"Soggetto legale: chi sente un commercialista e entro quando?"
+ #"Ambassador: commissione 20% in crediti finché non si può pagare. Quanti per anno?"
+ #"Simulatore: correggere i PDF Quiz e partire dagli esami a risposta chiusa. Chi se ne occupa?"
+ #"Piano di studio: percorso a sessioni da 45 minuti, voto bloccato dopo l'esame, interviste degli ambassador. Contattiamo Alessandro de Concini?"
+ #"Career: CV benchmark e template subito; lettera, mentor e stage solo se le porte finte lo giustificano."
+ #"SUSBUS e SECI: richieste ora, dispense quando superano una soglia (quale?)."
+ #"Tracciamento: chi installa Google Tag Manager e il Cookie Banner su Framer?"
+ #"Errori del sito (elencati in «Il sito di oggi»): chi li sistema?"

#sub3[#"Le 10 decisioni della sintesi (sezione 1) e la proposta nella demo"]
#tab(("Voce", "Descrizione", "Valore"), (24%, 56%, 20%), (("Il sito diventa landing + app separata?", "Sì: landing su Framer, app su app.unilinkfirenze.it", "1"), ("Accesso", "Email universitaria, link via email (niente password)", "2"), ("Protezione PDF", "Filigrana + marcatura invisibile + PDF privati + limiti", "3"), ("Prezzi", "4,99 / 12,99 / 29,99 / 49,99 / Plus 14,99 una tantum, da validare col sondaggio", "4"), ("Soggetto legale e pagamenti", "Decidere la forma con un commercialista, poi Stripe", "5"), ("Referral e ambassador", "Codice fisso per account; ambassador pagati in crediti all'inizio", "6"), ("Cosa costruire dopo", "Simulatore per gli esami a risposta chiusa, poi piano con AI", "7"), ("SUSBUS e SECI", "Iscrizione e richieste di materiale ora, dispense quando c'è domanda", "8"), ("Brand e altre scuole", "Un brand UniLink con un hub per scuola; Economia attiva, le altre con lista d'attesa e team fondatore", "9"), ("Cosa c'è in Plus", "Piano per tutti gli esami + ottimizzatore, test e simulatore, registro errori, Career completo", "10")))

- #"Sito attuale: unilinkfirenze.it (analizzato il 4 ottobre 2026)"
- #"CareerSet TU Dublin"
- #"Metodo PACRAR (Alessandro de Concini)"
- #"SUSBUS: pagina ufficiale UniFi"
- #"SECI: Booklet 2026/27"
- #"Prezzi barrati: art. 17-bis Codice del Consumo (D.lgs. 26/2023, direttiva Omnibus)"
- #"Studocu Premium: prezzi secondo fonti terze"
- #"Tutoring a Firenze: Superprof"
- #"Stripe: tariffe area economica europea"
- #"Supabase: limiti del piano gratuito 2026"
- #"Target Test Prep, GMAT Club"
- #"Knowunity, Amboss, Studocu"
- #"Testbusters (Ammesso.it), Uniwhere"
- #"Scuole dell'Università di Firenze: guida ai corsi di laurea"
- #"Framer e Google Tag Manager: guida ufficiale, BRIX Templates"

#sub3[#"Alternative e parere del report"]
#"Dal report: ogni sezione ha un riquadro «Da decidere nella call»; qui sono raccolti in un elenco unico."

#sub3[#"Cosa serve"]
- #"Una persona che porti le decisioni alla call e le registri"

#sub3[#"Da decidere nella call"]
- #"Tutte le decisioni dell'elenco, a partire dalla 1 (struttura) e dalla 9 (soggetto legale), che bloccano le altre."

#sub3[#"Nelle demo v2 oggi"]
- #"Non presente nelle demo v2: è una proposta del report."

#sub[#"Account e accesso con email UniFi"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 6"), ("Card", "web app D38"), ("Dove vive · web app", "Registrazione e login dell'app (app.unilinkfirenze.it).")))

#sub3[#"Proposta del report (demo v1)"]
#"Registrazione con nome, email universitaria, corso di laurea, anno, codice invito facoltativo e consensi. Niente password: si riceve un link via email. Al primo accesso lo studente sceglie la dispensa gratuita."

#sub3[#"Dati e regole del report"]
- #"Registrazione: nome, email universitaria (@stud.unifi.it), corso di laurea, anno, codice invito facoltativo, consensi"
- #"Consensi separati: termini e privacy obbligatori; statistiche e marketing facoltativi (senza consenso alle statistiche gli eventi restano anonimi)"
- #"Dispensa gratuita scelta al primo accesso"

#sub3[#"Come funziona, perché, alternative scartate"]
- #"Login con link via email (nella versione vera è una funzione già pronta di Supabase, il database consigliato)"
- #"Perché: con @stud.unifi.it entrano solo studenti UniFi, il referral non si può gonfiare con account falsi e non dobbiamo custodire password; lo stesso metodo lo usa CareerSet (la piattaforma CV di TU Dublin)"
- #"Alternative scartate: password (più assistenza «ho perso la password» e più rischi); login con Google (comodo ma non verifica che sei di UniFi); una chiave per ogni utente (si condivide come il PDF); massimo 2 sessioni attive (complicato da gestire e utile poco)"

#sub3[#"Cosa serve"]
- #"Supabase (login con link email)"
- #"Servizio di invio email"

#sub3[#"Da decidere nella call"]
- #"Chi si laurea perde l'email @stud.unifi.it: permettiamo di aggiungere un'email personale dopo la verifica? (Consigliato sì, per Career e magistrali.)"
- #"Accesso: email UniFi + link via email. Email personale aggiuntiva per chi si laurea?"

#sub3[#"Nelle demo v2 oggi"]
- #"Web app: Accesso con email e password, accesso rapido demo, registrazione, recupero password, primo accesso in 6 passi."

#nota[#"Discordanze con il report su questo argomento (parte 6): n. 5. Non risolte: si decidono, non si correggono in silenzio."]
#sub[#"Proteggere i PDF: filigrana, marcatura invisibile, link temporanei"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 7"), ("Card", "web app D39"), ("Dove vive · web app", "Pulsante «Scarica» nell'area personale; server (Edge Function di Supabase) in produzione.")))

#sub3[#"Proposta del report (demo v1)"]
#"Una password legata all'account da sola non basta: chi gira il file può girare anche la password, e chi apre il PDF può «stamparlo» in un nuovo PDF senza password in pochi secondi. Il report propone misure gratis o quasi."

#sub3[#"Dati e regole del report"]
- #"Filigrana personale visibile — su ogni pagina: nome, email, codice licenza e data, in diagonale leggera e in una riga in basso; se il file gira, si sa da chi è partito — gratis"
- #"Marcatura invisibile — un testo trasparente e i metadati del PDF contengono un codice diverso per ogni copia; resta anche se qualcuno cancella la filigrana visibile — gratis"
- #"PDF privati e link temporanei — i PDF escono da Framer e vanno in uno storage privato; l'app genera un link che vale pochi minuti — gratis fino a 1 GB"
- #"Limite e allarmi — massimo 15 download al giorno (si cambia); troppi download in poco tempo segnalano l'account — gratis"
- #"Regole d'uso — nei termini: condividere significa perdere l'account e i crediti — gratis"
- #"Valore fuori dal PDF — simulatore, piano, aggiornamenti e Career esistono solo nell'account"

#sub3[#"Come funziona, perché, alternative scartate"]
- #"Al clic su «Scarica» l'app prende il PDF vero, aggiunge la filigrana su tutte le pagine (nella demo del report: 31 pagine in mezzo secondo) e lo fa scaricare; nei metadati c'è la riga «Licenza LD96C-… per Nome Cognome»"
- #"In produzione lo stesso codice gira sul server (una «Edge Function» di Supabase: il piano gratuito ne include 500.000 al mese), così il PDF originale non passa mai dal browser"
- #"Alternative scartate: visualizzatori con DRM a pagamento (costosi e scomodi: niente tablet, niente sottolineature); lettura solo online (gli studenti vogliono il PDF per annotarlo sul tablet); password al PDF"

#sub3[#"Cosa serve"]
- #"Storage privato (Supabase, gratis fino a 1 GB)"
- #"Edge Function di Supabase"

#sub3[#"Da decidere nella call"]
- #"PDF: filigrana + marcatura invisibile + PDF privati + limite giornaliero. Limite a 15 download al giorno?"

#sub3[#"Nelle demo v2 oggi"]
- #"Web app: «Apri dispensa» apre il PDF direttamente, senza filigrana. Il lettore protetto è la proposta D23."

#nota[#"Discordanze con il report su questo argomento (parte 6): n. 7. Non risolte: si decidono, non si correggono in silenzio."]
#sub[#"Simulatore d'esame"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 13"), ("Card", "web app D40"), ("Dove vive · web app", "Area personale: «Simulatore d'esame».")))

#sub3[#"Proposta del report (demo v1)"]
#"Un simulatore sul modello del software costruito per il test Bocconi («Aula 28»): quiz rapido con spiegazione, simulazione a tempo con il punteggio vero della prova, registro degli errori (una domanda esce quando la indovini 2 volte di fila), storico e miglior voto."

#sub3[#"Dati e regole del report"]
- #"Banca e Sistema Finanziario — 30 domande in 30 minuti"
- #"Statistica per le applicazioni aziendali — 18 domande in 45 minuti, punteggio +2 / −0,5 / 0"
- #"114 domande vere dai PDF Quiz dei due esami (estratte con uno script; per ogni nuovo corso basta aggiungere il PDF e il formato della prova)"
- #"Per gli altri esami: prova di 5 domande e «lo voglio nel simulatore» (porta finta che conta l'interesse)"

#sub3[#"Come funziona, perché, alternative scartate"]
- #"Perché: è la parte che un PDF girato non può dare, e quella che giustifica la dispensa completa e Plus"
- #"Il simulatore rimescola le risposte a ogni prova"
- #"Per gli esami con domande aperte o esercizi (la maggioranza): modalità di autovalutazione, lo studente risponde, vede la soluzione e segna giusto/parziale/sbagliato"
- #"Esami da cui partire (risposta chiusa): Banca, Statistica app. aziendali, Matematica II, Matematica Finanziaria, Topics in M&M, Bilancio"
- #"Alternative scartate: comprare una piattaforma di quiz esterna (costa e non conosce i nostri esami); solo PDF di simulazioni (niente correzione, niente statistiche)"

#sub3[#"Cosa serve"]
- #"Banca di domande (il vero collo di bottiglia)"
- #"PDF Quiz corretti: oggi la risposta giusta segue sempre la sequenza A, D, C, B, A, D… e le domande sono un glossario (gli stessi concetti ripresi in 2–3 formati, a volte con frasi poco naturali)"

#sub3[#"Da decidere nella call"]
- #"Simulatore: correggere i PDF Quiz e partire dagli esami a risposta chiusa. Chi se ne occupa?"

#sub3[#"Nelle demo v2 oggi"]
- #"Web app: Esercitazioni con quiz di esempio (15 domande × 3 esami), ripasso errori e simulazione."

#nota[#"Discordanze con il report su questo argomento (parte 6): n. 15. Non risolte: si decidono, non si correggono in silenzio."]
#sub[#"Piano di studio a sessioni (stile Target Test Prep)"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 14"), ("Card", "web app D41"), ("Dove vive · web app", "Area personale: «Oggi» (sessioni suggerite), «Calendario», «Esami» (attivi, da fare, finiti).")))

#sub3[#"Proposta del report (demo v1)"]
#"Ogni esame ha il suo percorso: fasi (Avvio, Basi, Approfondimento, Allenamento d'esame, Rifinitura) → capitoli della dispensa → sessioni da 45 minuti (lezione, esercizi, mappa, ripetizione orale, test di capitolo, ripasso, simulazione, registro errori, vigilia). Più esami insieme finiscono in un calendario unico. Ogni esame è attivo, da fare o finito."

#sub3[#"Dati e regole del report"]
- #"Schema dei capitoli per gruppo d'esame — Quantitativo (matematica, statistica): Lezione → Esercizi → Esercizi → Test di capitolo"
- #"Modelli economici (micro, macro): Lezione → Esercizi (grafico + calcolo) → Test di capitolo"
- #"Aziendale e contabile: Lezione → Esercizi (scritture, casi) → Test di capitolo"
- #"Giuridico: Lezione (con il codice) → Mappa → Ripetizione orale → Test di capitolo"
- #"Teorico (management, marketing, storia): Lezione → Mappa → Risposte scritte → Test di capitolo"
- #"Ogni 3 capitoli un ripasso di blocco; alla fine simulazioni a tempo alternate al registro errori, poi la vigilia"
- #"Ogni lezione indica le pagine da leggere della dispensa (trovate nei PDF veri per 485 capitoli su 580)"
- #"Dati passivi: sessioni fatte e quando, «quanto ti senti sicuro» sui test, ritmo reale, aderenza al piano (le ore studiate si calcolano dalle sessioni)"
- #"Una sola richiesta attiva: dopo l'appello l'app chiede il voto (o non superato / ritirato); una volta confermato non si può più modificare e finisce nel libretto da solo; due domande facoltative a un clic: «la prova era come la scheda?» e «cosa ti è servito di più?»"

#sub3[#"Come funziona, perché, alternative scartate"]
- #"Perché (come in Target Test Prep): il percorso è una lista di missioni, il calendario è solo una proiezione; oggi puoi fare 2 sessioni o 10: il calendario si ricalcola, il percorso non si rompe"
- #"Test di capitolo: lo studente segna «da rivedere», «così così» o «sicuro»; con «da rivedere» compare subito un ripasso mirato (con Plus lo farebbe l'AI usando anche gli errori nel simulatore)"
- #"Proiezione: ogni giorno le sessioni disponibili si dividono tra gli esami: prima il minimo che serve a ognuno per finire in tempo, partendo dall'appello più vicino; il tempo che avanza va a chi ha più lavoro per giorno rimasto; la vigilia cade il giorno prima dell'esame"
- #"Stato di ogni esame: «in linea», «in anticipo di N giorni» o «in ritardo: N sessioni non entrano»"
- #"Ottimizzatore: lo studente sceglie il voto ideale per ogni esame; se il tempo non basta prova tutte le combinazioni di obiettivi uguali o più bassi e propone quella con la media ponderata sui CFU più alta che sta nei tempi (esempio: con 4 sessioni al giorno non si tengono 29–30 a Banca; l'app propone 27–28, media attesa 26,9); se nemmeno gli obiettivi minimi ci stanno, dice quante sessioni al giorno servono"
- #"Con 30 risposte per gruppo d'esame il pannello segnala «pronto per ricalibrare»; si aggiungono le interviste degli ambassador (10 minuti con chi ha preso 28+)"
- #"Alternative scartate: calendario rigido giorno per giorno (se salti un giorno si scombina tutto); piano scritto interamente dall'AI (costoso, imprevedibile, sbaglia le date); un piano diverso per ognuno dei 34 esami a mano (non scala)"

#sub3[#"Cosa serve"]
- #"Profili di studio per gruppo d'esame (ore per CFU, obiettivi, livelli di partenza, tipi di sessione, schema dei capitoli, fasi)"
- #"Pagine della dispensa per ogni capitolo"
- #"Interviste degli ambassador"

#sub3[#"Da decidere nella call"]
- #"Sessioni da 45 minuti vanno bene? Il piano gratuito segue un esame alla volta e il multi-esame è in Plus: d'accordo? Chi raccoglie le prime interviste per gruppo d'esame?"
- #"Piano di studio: percorso a sessioni da 45 minuti, voto bloccato dopo l'esame, interviste degli ambassador. Contattiamo Alessandro de Concini?"

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Strumento «Piano per l'appello» con regole semplici; card L02 «Metodo e piano di studio»."
- #"Web app: Nessun piano a sessioni nella parte decisa. D03 «Il mio piano» è il Career Score: stesso nome, altra cosa."

#nota[#"Discordanze con il report su questo argomento (parte 6): n. 9. Non risolte: si decidono, non si correggono in silenzio."]
#sub[#"Career: il CV benchmark"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 15"), ("Card", "web app D42"), ("Dove vive · web app", "Area personale: «Career» (CV benchmark, template UniLink, LinkedIn, In arrivo).")))

#sub3[#"Proposta del report (demo v1)"]
#"UniLink diventa il metro con cui uno studente capisce se il suo CV è fatto bene per la carriera che vuole: sceglie una traiettoria, compila il CV a campi e ottiene un punteggio 0–100 in quattro aree, il «profilo tipo» della traiettoria e l'elenco di cosa sistemare prima."

#sub3[#"Dati e regole del report"]
- #"Traiettorie (le aree dell'Esploratore di carriera del sito): Investment Banking, Consulting, Corporate Finance e Controllo, Audit, Marketing, Data, Asset Management, Startup"
- #"17 regole in quattro aree, ognuna con la sua fonte dichiarata: «template» (la struttura del template CV, collegato all'Excel «UNILINK Tools x CV»), «convenzione» (regole diffuse: una pagina, verbi d'azione, numeri nei risultati), «ipotesi» (soglie da validare con mentor e CV di chi è entrato davvero)"
- #"Versione gratuita: prime 5 regole; Plus: tutte (benchmark completo per 8 carriere, template in inglese)"
- #"Tre moduli (da CareerSet): CV (completo nella demo del report), lettera di presentazione («porta finta»), LinkedIn (checklist)"
- #"Esempio: CV valutato per Consulting 63/100, con l'elenco di cosa sistemare e lo stesso CV nel template UniLink, pronto da salvare in PDF"

#sub3[#"Come funziona, perché, alternative scartate"]
- #"Perché: il CV a campi è più facile da valutare di un PDF qualsiasi e produce il template UniLink già pronto da scaricare; è anche la base dati per il futuro «UniLink Career»"
- #"La tab «In arrivo» misura l'interesse per lettera di presentazione, mentor 1-1, offerte di stage e magistrali: ogni clic finisce nel pannello; così si decide se vale la pena costruire «UniLink Career» o «UniLink Network», e per chi (anche per le magistrali, in futuro)"
- #"Da CareerSet (piattaforma CV usata da TU Dublin) abbiamo preso i tre moduli, l'accesso con email universitaria e il link via email; non abbiamo preso il modello di vendita (CareerSet lo comprano le università) né il giudizio automatico con AI, che rimandiamo"
- #"Alternative scartate: un'AI che legge il CV (utile dopo, ma costa a ogni uso e i giudizi non sono spiegabili); matching con offerte di aziende (serve prima avere le aziende)"

#sub3[#"Cosa serve"]
- #"Soglie «ipotesi» da validare con mentor e CV di chi è entrato davvero"
- #"Excel «UNILINK Tools x CV» (template)"
- #"Aziende (solo per un futuro matching)"

#sub3[#"Da decidere nella call"]
- #"Career: CV benchmark e template subito; lettera, mentor e stage solo se le porte finte lo giustificano."

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Card L06 «Carriera e CV»; nessuno strumento CV."
- #"Web app: Moduli Career D03–D11 funzionanti come proposte; non c'è il CV benchmark con 17 regole."

#sub[#"Libretto e voto di laurea con scenari"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 16"), ("Card", "web app D43"), ("Dove vive · web app", "Area personale: «Libretto e voto».")))

#sub3[#"Proposta del report (demo v1)"]
#"In alto il voto di laurea stimato su un indicatore a semicerchio con l'obiettivo, media ponderata, CFU fatti, lodi ed esami. Poi: la media che hai e quella che ti serve su una scala 18–30, tre scenari (prudente, realistico, ambizioso), i bonus della Scuola di Economia, il grafico dei voti colorato per area con la media nel tempo, la simulazione dei prossimi esami (scegli un voto ipotetico e tutto si aggiorna), «dove vai meglio» per area e il libretto."

#sub3[#"Dati e regole del report"]
- #"Formula (la stessa del calcolatore del sito): media × 110/30 + 0,333 per lode + bonus"
- #"Obiettivo e bonus si salvano nel profilo; gli esami ipotetici no"
- #"I voti confermati nel piano di studio arrivano da soli nel libretto"

#sub3[#"Come funziona, perché, alternative scartate"]
- #"Perché: il calcolatore di oggi è utile ma si usa una volta e si dimentica; con obiettivo, scenari e simulazione diventa uno strumento a cui tornare dopo ogni esame"
- #"Il calcolatore pubblico resta gratuito sul sito (porta traffico da Google); la versione nell'account ricorda i dati"
- #"Per le altre scuole cambia solo il regolamento dei bonus"
- #"Alternative scartate: solo il numero finale (non dice cosa fare); previsioni «intelligenti» sui voti futuri (con pochi dati sarebbero inventate; gli scenari sono trasparenti)"

#sub3[#"Cosa serve"]
- #"Regolamento dei bonus della Scuola di Economia (il report segnala che il regolamento della prova finale usato è del 2017/2018: da confermare)"
- #"Voti confermati dal piano di studio"

#sub3[#"Da decidere nella call"]
- #"Nel report il libretto non ha domande aperte per la call."

#sub3[#"Nelle demo v2 oggi"]
- #"Landing: Strumenti «Voto di laurea» e «Media e voto obiettivo»."
- #"Web app: Il mio percorso → Media e voto di laurea: esami superati, media pesata, tre scenari (prudente, realistico, ambizioso) e bonus."

#sub[#"Pannello del team: metriche, materiale, domanda, ambassador, vendite"]
#tab(("Riferimento", "Dettaglio"), (22%, 78%), (("Report", "sezione 19"), ("Card", "web app D44"), ("Dove vive · web app", "App, ruolo «team» (pannello del team).")))

#sub3[#"Proposta del report (demo v1)"]
#"Il pannello è dove i founder guardano i numeri e il materiale. Sette schede: Panoramica, Tracciamento, Controllo materiale, Domanda, Profili di studio, Ambassador, Vendite e prezzi."

#sub3[#"Dati e regole del report"]
- #"Panoramica — nuovi account, attivazione, studenti attivi, ricavi; funnel dalla visita all'acquisto con la percentuale di ogni passo; iscrizioni al giorno; provenienza"
- #"Tracciamento — il piano degli eventi con i conteggi e gli ultimi eventi registrati"
- #"Controllo materiale — per ogni corso: versione, data, pagine, materiali presenti, «programma verificato il», download, voto degli studenti, segnalazioni aperte, avvisi automatici (codici di copertina diversi, quiz da correggere, indirizzi con refusi)"
- #"Domanda — clic sulle porte finte, iscritti per corso di laurea, materiale richiesto, ricerche senza risultato"
- #"Profili di studio — per gruppo d'esame: ore stimate contro ore reali, voto medio, quante risposte mancano per ricalibrare"
- #"Ambassador — codici, iscritti portati, venduto, crediti; candidature da accettare o rifiutare"
- #"Vendite e prezzi — venduto per prodotto, scontrino medio, listino attuale"

#sub3[#"Come funziona, perché, alternative scartate"]
- #"Utenti, ordini e grafici sono in parte di esempio nella demo del report (interruttore «Includi dati di esempio» per nasconderli)"
- #"La tabella «Controllo materiale» sostituisce le verifiche a mano"

#sub3[#"Cosa serve"]
- #"Piano di tracciamento (card @D:metriche@)"
- #"Registro versioni (card @D:aggiornamento@)"

#sub3[#"Da decidere nella call"]
- #"Nel report il pannello non ha domande aperte per la call."

#sub3[#"Nelle demo v2 oggi"]
- #"Web app: Metriche (admin): incassi, ordini, funnel, simulatore economico. Business cockpit (D11) e La rete (D21) come proposte."

#nota[#"Discordanze con il report su questo argomento (parte 6): n. 16. Non risolte: si decidono, non si correggono in silenzio."]

#cap(6, "Discordanze tra report e demo v2", "non risolte: si riportano entrambe, si decide dopo")
#"Queste sono le cose su cui il report (demo v1) e le demo v2 attuali dicono cose diverse. Non sono errori da correggere: sono scelte da fare. Per ciascuna sono riportate le tre versioni affiancate. Finché non c'è una decisione esplicita, nessuna viene modificata e le card del report e le proposte delle demo coesistono."

#nota[#"Stato di tutte: non risolta, da decidere. Ordine consigliato per decidere: 5 (accesso), 6 (scuole), 1, 2, 3 e 4 (prezzi e piani), 7 (PDF), 11 (stack), poi le altre."]
#tab(("N.", "Tema", "Report (demo v1)", "Landing v2", "Web app v2"), (5%, 11%, 30%, 27%, 27%), (("1", "Listino per esame", "Appunti 4,99 € (lancio, poi 9,99) · Dispensa completa 30L 12,99 € (lancio, poi 18,99) · Semestre 29,99 € · Anno 49,99 €.", "Pagina Prezzi di esempio: Appunti 4,99 · Dispensa completa 12,99 · Due esami 22,99 · Semestre (1 esame) 12,99 · Pacchetto semestre 29,99 · Pacchetto anno 49,99. «Due esami» e «Semestre · 1 esame» non sono nel report.", "Pacchetto esame 14,99 € (ipotesi HQ: dispensa 12–15 €) · Pacchetto semestre 29,99 €. Nessun Appunti singolo né pacchetto anno."), ("2", "Plus: prezzo e formula", "14,99 € una tantum, vale fino a fine sessione; con un pacchetto 10 € in meno. Abbonamento mensile esplicitamente scartato (si disdice dopo l'esame).", "Nessuna pagina Plus. La card L07 cita «Plus mensile» come ipotesi.", "4,99 € al mese, «prezzo da decidere», si disdice quando vuoi. D10: Plus 39 €/semestre nella demo C."), ("3", "Contenuto di Plus", "Piano di studio per tutti gli esami, simulazioni a tempo, registro errori, 30 giorni di esercizi, CV benchmark completo (8 carriere), avvisi su appelli, bandi Erasmus e master. Le dispense restano a parte.", "—", "Esercitazioni complete su tutti gli esami · simulazioni a tempo e ripasso errori ovunque · sconto sui mentor."), ("4", "Piano gratuito", "1 Appunti a scelta tra 3 esami (uno per anno) + 1 in regalo al primo amico invitato; piano di studio a un esame alla volta; simulatore a prova da 5 domande; registro errori solo Plus; CV: prime 5 regole su 17.", "Gratuiti: anteprime, informazioni sugli esami e strumenti rapidi (FAQ della pagina Prezzi).", "Gratuito: schede e consigli di ogni esame, quiz di prova (5 domande) e ripasso errori, esami, libretto e voto, Erasmus e magistrali. Nessuna dispensa gratuita."), ("5", "Accesso", "Email @stud.unifi.it con link via email, niente password (login con Google, password e una chiave per utente scartati).", "Nessun accesso: l'area personale si mostra in schermate.", "Email e password, accesso rapido demo, registrazione, recupero password."), ("6", "Scuole e hub", "10 scuole dell'Università di Firenze (Economia attiva, 9 in arrivo): Ingegneria, Giurisprudenza, Medicina e Salute, Scienze, Scienze Politiche, Studi Umanistici, Psicologia, Architettura, Agraria.", "3 hub: Economia (attivo), Giurisprudenza e Medicina (in arrivo).", "Aree di studio: Economia (attiva), Giurisprudenza e Medicina (in arrivo), «un'altra area»."), ("7", "Protezione dei PDF", "Il PDF si scarica con filigrana personale visibile (nome, email, licenza, data), marcatura invisibile, storage privato con link temporanei, massimo 15 download al giorno. «Lettura solo online» scartata perché gli studenti vogliono annotare il PDF sul tablet.", "—", "D23 (proposta HQ): lettore con PDF.js e filigrana, «il PDF non si scarica». Nella parte decisa «Apri dispensa» apre il PDF senza filigrana."), ("8", "Mentor e tutoring", "Tutoring 1-1 a 20 €/ora (pacchetto 3 ore 54 €; 75% al mentor, 25% a UniLink). Mentor e lettera: porte finte finché i clic non li giustificano (decisione 13).", "Card L03 «Mentoring tra pari»: gratuito, con crediti o a pagamento da decidere; prova manuale con 5 ambassador.", "Il mio percorso → Mentor è nella parte decisa, con prenotazione e pagamento simulato di 35 €."), ("9", "Piano di studio", "Percorso per esame con fasi, capitoli e sessioni da 45 minuti; più esami in un calendario unico; ottimizzatore dei voti; piano gratuito a un esame, multi-esame in Plus.", "Strumento «Piano per l'appello» con regole semplici; card L02 «Metodo e piano di studio» (calendario che si aggiorna).", "Nessun piano a sessioni. D03 «Il mio piano» è il Career Score (altra cosa con lo stesso nome)."), ("10", "Referral e ambassador", "Codice fisso per account, regalo per invito, ambassador con dashboard e crediti (20% del venduto).", "Community: gruppi WhatsApp per anno e ambassador, senza codici.", "Nessun referral deciso; D10 (Career) ha un codice invito con crediti, D19 un club con ambassador."), ("11", "Stack e hosting", "Web app statica su app.unilinkfirenze.it (es. GitHub Pages) + Supabase; landing su Framer.", "Demo statica su GitHub Pages, landing destinata a Framer.", "Il PDF di architettura propone Next.js su Vercel + Supabase."), ("12", "Posizionamento", "«Studia meglio, ovunque studi» (landing generale) e «Da studenti per studenti, gli appunti da 30 e lode e un piano per arrivarci».", "«Studia, orientati, scegli.», con fasi Prima/Durante/Dopo.", "—"), ("13", "Struttura della landing", "Landing generale + hub per scuola + tool universali; nessuna struttura per fasi.", "Hub + fasi Prima/Durante/Dopo + Strumenti + Community.", "Parte decisa: Studio, Dopo gli esami, Account (nomi diversi dalle fasi della landing)."), ("14", "Tracciamento e consenso", "Piano di eventi con Google Tag Manager, Cookie Banner di Framer, parametro ?from=, KPI settimanali, «porte finte».", "Nessun tracciamento; mancano privacy, cookie e termini.", "Nessun tracciamento a eventi; pannello «Metriche» con dati di esempio."), ("15", "Banca di domande del simulatore", "114 domande vere dai PDF Quiz di Banca e Sistema Finanziario (30 in 30 minuti) e Statistica app. aziendali (18 in 45 minuti, +2/−0,5/0).", "—", "Quiz di esempio scritti per la demo: 15 domande per Microeconomia, Economia Aziendale e Statistica."), ("16", "Pannello del team", "Sette schede: panoramica, tracciamento, controllo materiale, domanda, profili di studio, ambassador, vendite e prezzi.", "—", "«Metriche» (admin): incassi, ordini, funnel, simulatore economico; Business cockpit (D11) e La rete (D21) come proposte.")))

#sub[#"Differenze di completezza (non sono discordanze)"]
#"Molti argomenti del report non sono ancora nelle demo v2 e vi compaiono solo come card «Da decidere»: referral e ambassador con dashboard, filigrana, simulatore con PDF Quiz reali, piano di studio a sessioni, CV benchmark con 17 regole, libretto con semicerchio e grafico dei voti, SUSBUS e SECI, ultimo aggiornamento con registro versioni, pannello del team a sette schede, tracciamento. La parte 5 dice, per ciascuno, cosa c'è oggi."

#sub[#"Nomi da allineare"]
#"Landing: Prima · Durante · Dopo, hub. Web app: Studio · Dopo gli esami, area di studio. Il report: scuole, hub. Sono idee vicine ma non uguali; conviene sceglierne una sola e usarla ovunque (menu, PDF, messaggi). Non è stato scelto nulla."


#cap(7, "Registro unico delle idee da decidere", "tutte le card Lxx (landing) e Dxx (web app)")
#"La landing ha 26 card (L01–L26); la web app ha 44 proposte (D01–D44). Le card L10–L26 e D26–D44 nascono dal report e sono marcate con il gruppo «Report · …». Dove una idea vive in entrambe, le due card si rimandano."

#sub[#"Landing: card L01–L26"]
#tab(("Cod.", "Titolo", "Gruppo", "Web app"), (8%, 52%, 28%, 12%), (("L01", "Gruppi di studio", "Community", "—"), ("L02", "Metodo e piano di studio", "Metodo", "D04"), ("L03", "Mentoring tra pari", "Community", "D08"), ("L04", "Test d'ingresso (TOLC)", "Orientamento", "D16"), ("L05", "Borse di studio e tasse", "Orientamento", "—"), ("L06", "Carriera e CV", "Dopo", "D05"), ("L07", "Listino e pacchetti", "Monetizzazione", "—"), ("L08", "Quale hub parte per primo", "Hub", "D01"), ("L09", "Voci degli studenti", "Fiducia", "—"), ("L10", "Dalla vetrina alla piattaforma: cosa cambia", "Report · Misure, legale e lancio", "D26"), ("L11", "Il sito di oggi: errori da sistemare", "Report · Struttura e sito", "—"), ("L12", "Un brand, tanti hub: le 10 scuole", "Report · Struttura e sito", "—"), ("L13", "L'hub di Economia: «solo landing e poco altro»", "Report · Struttura e sito", "—"), ("L14", "Catalogo e scheda corso con anteprime", "Report · Struttura e sito", "—"), ("L15", "Ultimo aggiornamento e registro versioni", "Report · Struttura e sito", "D27"), ("L16", "Prezzi e piani: la proposta del report", "Report · Prezzi e pagamenti", "D28"), ("L17", "UniLink Plus: il metodo, non i contenuti", "Report · Prezzi e pagamenti", "D29"), ("L18", "Pagamenti e soggetto legale", "Report · Prezzi e pagamenti", "D30"), ("L19", "Referral e campus ambassador", "Report · Crescita", "D31"), ("L20", "SUSBUS e SECI: iscrizione e richieste", "Report · Crescita", "D32"), ("L21", "Metriche e tracciamento", "Report · Misure, legale e lancio", "D33"), ("L22", "Architettura dei tool: universali, di scuola, di livello", "Report · Struttura e sito", "D34"), ("L23", "Marketing e sondaggio sui prezzi", "Report · Crescita", "—"), ("L24", "Rischi e cose legali", "Report · Misure, legale e lancio", "D35"), ("L25", "Per andare online: le sei fasi", "Report · Misure, legale e lancio", "D36"), ("L26", "Decisioni per la call e fonti del report", "Report · Misure, legale e lancio", "D37")))

#sub[#"Web app: proposte D01–D44"]
#tab(("Cod.", "Titolo", "Gruppo", "Stato", "Modulo", "Landing"), (7%, 34%, 24%, 12%, 12%, 11%), (("D01", "Area Giurisprudenza", "Nuove aree", "In arrivo", "nella app", "—"), ("D02", "Area Medicina", "Nuove aree", "In arrivo", "da costruire", "—"), ("D03", "Il mio piano · Career Score", "Career (demo C)", "Da valutare", "nella app", "—"), ("D04", "Studio con Plus", "Career (demo C)", "Da valutare", "nella app", "—"), ("D05", "Opportunità: stage e graduate program", "Career (demo C)", "Da valutare", "nella app", "—"), ("D06", "Profilo talento", "Career (demo C)", "Da valutare", "nella app", "—"), ("D07", "Track (percorsi guidati)", "Career (demo C)", "Da valutare", "nella app", "—"), ("D08", "Mentor marketplace", "Career (demo C)", "Da valutare", "nella app", "—"), ("D09", "Eventi", "Career (demo C)", "Da valutare", "nella app", "—"), ("D10", "Plus e inviti (referral)", "Career (demo C)", "Da valutare", "nella app", "—"), ("D11", "Business cockpit (admin)", "Career (demo C)", "Da valutare", "nella app", "—"), ("D12", "Più atenei: home dell'ateneo", "Network (demo D)", "Da valutare", "nella app", "—"), ("D13", "Dispense dalla community (+ crediti)", "Network (demo D)", "Da valutare", "nella app", "—"), ("D14", "Calcolatori e guide per ateneo", "Network (demo D)", "Da valutare", "nella app", "—"), ("D15", "Mercatino dei libri", "Network (demo D)", "Da valutare", "nella app", "—"), ("D16", "Test d'ingresso e simulazioni", "Network (demo D)", "Nuova (HQ)", "nella app", "—"), ("D17", "Ammissioni MSc", "Network (demo D)", "Da valutare", "nella app", "—"), ("D18", "Academy (corsi on-demand)", "Network (demo D)", "Da valutare", "nella app", "—"), ("D19", "Club ed eventi per ateneo", "Network (demo D)", "Da valutare", "nella app", "—"), ("D20", "Pass e crediti", "Network (demo D)", "Da valutare", "nella app", "—"), ("D21", "La rete (admin)", "Network (demo D)", "Da valutare", "nella app", "—"), ("D22", "Raccolta domande d'esame", "Idee HQ da costruire", "In sviluppo (HQ)", "da costruire", "—"), ("D23", "Lettore protetto delle dispense", "Idee HQ da costruire", "Nuova (HQ)", "da costruire", "—"), ("D24", "Borse di studio", "Idee HQ da costruire", "Nuova (HQ)", "da costruire", "—"), ("D25", "Guida tesi", "Idee HQ da costruire", "Nuova (HQ)", "da costruire", "—"), ("D26", "Dalla vetrina alla piattaforma: cosa cambia", "Report · Misure, legale e lancio", "Da valutare", "da costruire", "L10"), ("D27", "Ultimo aggiornamento e registro versioni", "Report · Accesso e materiali", "Da valutare", "da costruire", "L15"), ("D28", "Prezzi e piani: la proposta del report", "Report · Prezzi e pagamenti", "Da valutare", "da costruire", "L16"), ("D29", "UniLink Plus: il metodo, non i contenuti", "Report · Prezzi e pagamenti", "Da valutare", "da costruire", "L17"), ("D30", "Pagamenti e soggetto legale", "Report · Prezzi e pagamenti", "Da valutare", "da costruire", "L18"), ("D31", "Referral e campus ambassador", "Report · Crescita", "Da valutare", "da costruire", "L19"), ("D32", "SUSBUS e SECI: iscrizione e richieste", "Report · Studio e carriera", "Da valutare", "da costruire", "L20"), ("D33", "Metriche e tracciamento", "Report · Crescita e team", "Da valutare", "da costruire", "L21"), ("D34", "Architettura dei tool: universali, di scuola, di livello", "Report · Crescita e team", "Da valutare", "da costruire", "L22"), ("D35", "Rischi e cose legali", "Report · Misure, legale e lancio", "Da valutare", "da costruire", "L24"), ("D36", "Per andare online: le sei fasi", "Report · Misure, legale e lancio", "Da valutare", "da costruire", "L25"), ("D37", "Decisioni per la call e fonti del report", "Report · Misure, legale e lancio", "Da valutare", "da costruire", "L26"), ("D38", "Account e accesso con email UniFi", "Report · Accesso e materiali", "Da valutare", "da costruire", "—"), ("D39", "Proteggere i PDF: filigrana, marcatura invisibile, link temporanei", "Report · Accesso e materiali", "Da valutare", "da costruire", "—"), ("D40", "Simulatore d'esame", "Report · Studio e carriera", "Da valutare", "da costruire", "—"), ("D41", "Piano di studio a sessioni (stile Target Test Prep)", "Report · Studio e carriera", "Da valutare", "da costruire", "—"), ("D42", "Career: il CV benchmark", "Report · Studio e carriera", "Da valutare", "da costruire", "—"), ("D43", "Libretto e voto di laurea con scenari", "Report · Studio e carriera", "Da valutare", "da costruire", "—"), ("D44", "Pannello del team: metriche, materiale, domanda, ambassador, vendite", "Report · Crescita e team", "Da valutare", "da costruire", "—")))

#nota[#"Impatto e sforzo delle card L10–L26 e D26–D44 non sono valutati: il report non dà un punteggio e non è stato inventato (nella landing compaiono come pallini vuoti)."]

#cap(8, "Decisioni aperte", "da chiudere in call")
#sub[#"Dal report (demo v1): le 16 decisioni"]
+ #"Struttura: landing su Framer + app su app.unilinkfirenze.it. Va bene?"
+ #"Brand: UniLink con un hub per scuola; Economia attiva, le altre «in arrivo» con lista d'attesa e team fondatore. Quale scuola dopo?"
+ #"Plus: piano multi-esame, test e simulatore, registro errori, Career completo; le dispense restano a parte. D'accordo?"
+ #"Accesso: email UniFi + link via email. Email personale aggiuntiva per chi si laurea?"
+ #"PDF: filigrana + marcatura invisibile + PDF privati + limite giornaliero. Limite a 15 download al giorno?"
+ #"Gratuito: quali 3 esami (uno per anno)? Regalo per invito: 1 o più?"
+ #"Prezzi: 4,99 / 12,99 / 29,99 / 49,99 / Plus 14,99 una tantum / tutoring 20 €/ora. Lanciamo il sondaggio a metà ottobre?"
+ #"Prezzo di lancio fino al 31/12 al posto del prezzo barrato: d'accordo?"
+ #"Soggetto legale: chi sente un commercialista e entro quando?"
+ #"Ambassador: commissione 20% in crediti finché non si può pagare. Quanti per anno?"
+ #"Simulatore: correggere i PDF Quiz e partire dagli esami a risposta chiusa. Chi se ne occupa?"
+ #"Piano di studio: percorso a sessioni da 45 minuti, voto bloccato dopo l'esame, interviste degli ambassador. Contattiamo Alessandro de Concini?"
+ #"Career: CV benchmark e template subito; lettera, mentor e stage solo se le porte finte lo giustificano."
+ #"SUSBUS e SECI: richieste ora, dispense quando superano una soglia (quale?)."
+ #"Tracciamento: chi installa Google Tag Manager e il Cookie Banner su Framer?"
+ #"Errori del sito (elencati in «Il sito di oggi»): chi li sistema?"

#sub[#"Dalla web app (demo v2)"]
+ #"Abbonamento: Plus (C) o Pass (D)? Mensile, semestrale o annuale? Prezzo (D10, D20)."
+ #"Gratuito: dispense gratis + Plus (D04) o pacchetti a pagamento (parte decisa)?"
+ #"Quale area parte prima: Giurisprudenza o Medicina (D01, D02), guardando la lista d'attesa."
+ #"Career: quali moduli prima di avere aziende partner (D03, D06, D07)?"
+ #"Network: quando uscire da Firenze (D12) e con quali regole per le dispense della community (D13)."
+ #"Commenti condivisi: tabella Supabase o file da passarsi?"

#sub[#"Dalla landing (demo v2)"]
- #"Quale hub parte per primo (L08): soglia minima di iscritti e quali 3 esami per primi."
- #"Nomi tra landing e web app: Prima/Durante/Dopo e hub, oppure Studio/Dopo gli esami e area."
- #"Test d'ingresso (L04) prima dei nuovi hub? Gruppi di studio (L01) con matching o solo WhatsApp? Mentoring (L03) gratuito, a crediti o a pagamento?"

#sub[#"Dalle discordanze (parte 6)"]
#"Ognuna delle 16 discordanze è una decisione: nessuna è chiusa. Ordine consigliato nella parte 6."


#cap(9, "Manutenzione e richieste", "come si cambia, si salva e si verifica")
#sub[#"Come chiedere una modifica"]
#tab(("Tipo", "Esempio", "Cosa si fa"), (18%, 26%, 56%), (("A · Nuova idea", "«Nuova idea: …»", "Nuova card (Lxx nella landing, Dxx nella web app) in «Da decidere» con problema, proposta, dove vivrebbe, parere, cosa serve, domande, origine, storico. Le pagine decise non cambiano."), ("B · Modifica card", "«In L02 aggiungi…»", "Aggiorna la card e il suo storico."), ("C · Promuovi", "«L02 è decisa» / «Decidiamo D05»", "Si applicano le quattro domande, si porta la card nella pagina o nella sidebar, si aggiornano menu, PDF e storico; la card esce da «Da decidere»."), ("D · Pagina decisa", "«In S06 metti…»", "Si modifica la pagina; se cambia struttura si aggiorna il PDF."), ("E · Grafica", "«Card più grande su tablet»", "Si modifica il componente nel CSS: vale ovunque. È l'unico caso in cui si tocca il design."), ("F · Hub / area", "«Accendi Giurisprudenza»", "stato «attivo» nella configurazione + materiali collegati (passi della card D01)."), ("G · Strumento", "«Aggiungi uno strumento…»", "Voce in UL_TOOLS + funzione in IMPL."), ("H · Listino", "«Il semestre costa 27,99 €»", "Solo UL_CFG.prezzi (landing) e UL.PIANI (web app); restano ipotesi finché non decise."), ("M · Commenti", "«Applica i commenti aperti»", "Si applica ogni commento aperto con la modifica minima e si dice quali; i risolti sono storico."), ("N · Tipologia demo", "«Nuova tipologia demo: …»", "Riga in UL.DEMO e utente in UL.SEED."), ("I · Ripristina", "«Riporta la landing alla v2» / «ripristina la web app alla v2»", "La cartella torna al tag; la Action crea una nuova versione (lo storico non si perde)."), ("L · Rimuovi", "«Togli L04»", "La card esce; resta nel registro.")))

#"Se è ambiguo: «la metto in Da decidere (A) o già nelle pagine (C)?». Senza decisione, un'idea va in Da decidere. Per far costruire una scheda: allegare questo manuale (o CONTESTO_DEMO.md) e il prompt della scheda."

#sub[#"Dopo ogni modifica"]
+ #"Aggiornare la versione (UL_CFG.versione nella landing, UL.VERSIONE nella web app)."
+ #"Verificare: node _src/verifica_landing.js (con python -m http.server 8765 acceso) deve scrivere «tutto ok»; per la web app, aprire ogni rotta con ogni tipologia senza errori."
+ #"Se cambia l'architettura, ricompilare i PDF e questa linea guida."
+ #"Commit con una frase chiara: diventa la nota della versione nell'HQ."
+ #"Push: l'Action «Backup demo» crea ZIP, release e riga nel registro."

#sub[#"Comandi utili"]
#tab(("Cosa", "Comando (dalla radice del repository)"), (34%, 66%), (("Verifica della landing", "node _src/verifica_landing.js"), ("Schede «Da decidere» (immagini, Markdown, PDF)", "node _src/build_schede.js"), ("Schermate reali della web app", "node _src/screenshot_webapp.js http://localhost:8765/ <cartella> poi python _src/png_to_webp.py <cartella>"), ("Questa linea guida", "python _src/linea_guida/build_linea_guida.py (richiede node e pip install typst)"), ("PDF di architettura", "python -c \"import typst; typst.compile('architettura/landing/architettura.typ', output='architettura/UniLink_Architettura_Landing.pdf', root='.', font_paths=['.'])\"")))

#sub[#"Limiti noti della demo"]
- #"I dati stanno nel browser: due persone su due computer vedono due «database» diversi."
- #"Lista d'attesa, newsletter e acquisti sono simulati."
- #"I commenti non sono condivisi in tempo reale (servirebbe una tabella Supabase, 1–2 giorni)."
- #"Il carosello della landing apre la web app: lo ZIP della sola landing non la trova; la galleria dell'area funziona anche da sola. La web app non conserva il link profondo dopo il login."
- #"Le stime e le soglie nelle schede sono ipotesi; le note legali indicano cosa far verificare a un consulente, non sono pareri."
- #"Mancano privacy, cookie e termini, foto proprie, pagina 404, SEO per pagina e il backend della lista d'attesa."
- #"GitHub non dice chi ha scaricato uno ZIP: lo storico mostra chi ha modificato la demo; ogni release ha solo un contatore di download."

#sub[#"Verso la versione vera"]
#"Il report indica sei fasi con costo stimato (card «Per andare online»): sistemare il sito di oggi (0 €) · backend Supabase (0 € all'inizio, poi piano Pro) · web app su app.unilinkfirenze.it · soggetto legale + Stripe · contenuti · AI solo in Plus. Il PDF di architettura della web app propone invece un percorso per fasi (demo, MVP, piani, moduli) con Next.js su Vercel; sono due strade diverse (discordanza 11). Roadmap sintetica della landing: breve (ott–nov 2026) approvare la demo v2 e le prime card, allineare i nomi, landing su Framer, lista d'attesa unica, pagine legali; medio (dic 2026–apr 2027) metodo e piano, gruppi di studio minimi, primo nuovo hub, listino e pagamenti, esercitazioni; lungo (da mag 2027) Medicina 2027/28, più atenei, Career completa, piano adattivo con AI."


#cap(10, "Glossario, versioni e fonti", "termini, storia delle versioni, riferimenti")
#sub[#"Glossario"]
#tab(("Termine", "Significato"), (24%, 76%), (("EA / EC", "Corsi di laurea Economia Aziendale ed Economia e Commercio."), ("SUSBUS / SECI", "Sustainable Business for Societal Challenges (B314) e Sviluppo sostenibile, cooperazione e gestione dei conflitti: due corsi triennali UniFi diversi da EA ed EC."), ("Appunti / Dispensa completa 30L", "Appunti/Sbobine di un esame; Appunti + Mappe + Quiz & Simulazioni + simulatore."), ("Hub", "Pagina di una scuola (o di un corso) con i suoi materiali e strumenti."), ("Area di studio", "Nella web app: Economia, Giurisprudenza, Medicina, altra."), ("Una tantum", "Pagamento unico per sessione, senza rinnovo."), ("Porta finta", "Pulsante di una funzione che non esiste ancora: il clic viene contato e chi clicca va in lista d'attesa."), ("Freemium", "Parte gratis, parte a pagamento."), ("North Star", "Metrica principale: studenti attivi a settimana (download, quiz o piano)."), ("Prezzo di lancio", "Prezzo temporaneo con aumento annunciato (alternativa lecita al prezzo barrato, art. 17-bis del Codice del Consumo)."), ("PACRAR", "Metodo di studio con cui si presenta Alessandro de Concini: non usarlo come nome senza permesso."), ("GA4 · GTM", "Google Analytics 4 · Google Tag Manager."), ("Supabase", "Database e accesso consigliati per la versione vera (login con link via email, tabelle, storage privato, funzioni sul server)."), ("Framer", "Strumento con cui è fatto il sito di oggi e dove resterebbe la landing."), ("HQ", "Il centro di controllo dei founder; contiene la sezione Laboratorio AI → DEMO."), ("Typst", "Strumento con cui si compilano i PDF di architettura.")))

#sub[#"Versioni"]
#tab(("Versione", "Cosa è", "Riferimento"), (16%, 52%, 32%), (("Demo v1", "Demo del report: landing generale, hub, web app con filigrana e simulatore, pannello del team.", "Report «Dalla vetrina alla piattaforma», 4 ottobre 2026"), ("Demo v2", "Landing e web app attuali: landing con fasi, strumenti, schermate reali, commenti, 26 card; web app con design A, mix B/C/D, 44 proposte.", "Registro HQ: landing-v3, webapp-v3"), ("Linea guida", "Questo manuale: unisce report, landing e web app senza risolvere le discordanze.", "Versione 1; si aggiorna rigenerandola")))

#sub[#"Fonti usate nel report"]
- #"Sito attuale: unilinkfirenze.it (home, dispense, tools, mentor), analizzato il 4 ottobre 2026."
- #"CareerSet TU Dublin (careerset.com/tudublin)."
- #"Metodo PACRAR: sintesi delle sei fasi e sito di Alessandro de Concini."
- #"SUSBUS: pagina ufficiale UniFi. SECI: Booklet 2026/27."
- #"Prezzi barrati: art. 17-bis Codice del Consumo (D.lgs. 26/2023, direttiva Omnibus)."
- #"Studocu Premium: prezzi secondo fonti terze. Tutoring a Firenze: medie per città e profili su Superprof."
- #"Stripe: tariffe per l'area economica europea. Supabase, piano gratuito: sintesi dei limiti 2026."
- #"Target Test Prep: recensione con struttura del corso e del piano, recensioni GMAT Club."
- #"Studocu, Knowunity, Amboss; Testbusters (acquisizione di Ammesso.it); Uniwhere."
- #"Scuole dell'Università di Firenze: guida ai corsi di laurea. Framer e Google Tag Manager: guida ufficiale e tracciamento dei clic (BRIX Templates)."

#sub[#"File della demo v1 citati dal report"]
#"Il report descrive i file della demo v1 (config/hub.js, piani.js, sito.js, corsi-di-laurea.js, profili-studio.js, cv-benchmark.js, tracking.js, simulatore.js; tools/genera_corsi.py, estrai_quiz.py; README.md). Quei file non esistono nelle demo v2, che hanno una struttura diversa (parti 3 e 4): sono citati solo come riferimento di cosa conteneva la demo v1."

