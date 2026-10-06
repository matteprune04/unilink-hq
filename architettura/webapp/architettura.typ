// UniLink · Architettura della web app (area personale) — sorgente Typst
// Compilare dalla radice del repository:  python -c "import typst; typst.compile('architettura/webapp/architettura.typ', output='architettura/UniLink_Architettura_WebApp.pdf', font_paths=['.'])"

#let navy = rgb("#172554")
#let crema = rgb("#f4f1ea")
#let arancio = rgb("#cf7527")
#let ar2 = rgb("#f6e4d1")
#let ar3 = rgb("#a95d1c")
#let crema2 = rgb("#ebe4d5")
#let nv2 = rgb("#4b5675")
#let linea = rgb("#e2dccf")
#let nvt = rgb("#dfe4f1")

#set document(title: "UniLink — Architettura della web app", author: "UniLink")
#set text(font: "Croogla 4F", size: 9.6pt, fill: navy, lang: "it")
#set par(leading: 0.62em, justify: false)
#show strong: set text(fill: navy)

#let versione = "v1 · 6 ottobre 2026"

#set page(paper: "a4", margin: (x: 18mm, top: 20mm, bottom: 18mm),
  header: context { if counter(page).get().first() > 1 [
    #set text(size: 7.5pt, fill: nv2)
    UniLink · Architettura della web app #h(1fr) #versione
  ] },
  footer: context { if counter(page).get().first() > 1 [
    #set text(size: 7.5pt, fill: nv2)
    #h(1fr) #counter(page).display()
  ] })

#let spaziato(t) = text(size: 7.4pt, fill: ar3, tracking: 0.14em, upper(t))
#let cap(n, titolo, sotto) = {
  pagebreak(weak: true)
  block(below: 4pt, text(size: 21pt)[#n · #titolo])
  block(below: 12pt, spaziato(sotto))
}
#let sub(t) = block(above: 12pt, below: 6pt, text(size: 13pt, t))
#let box-crema(body, fill: crema2) = block(fill: fill, radius: 8pt, inset: 10pt, width: 100%, below: 10pt, body)
#let nota(body) = box-crema(fill: ar2, text(fill: ar3, body))
#let tag(t, f: ar2, c: ar3) = box(fill: f, radius: 99pt, inset: (x: 6pt, y: 2.5pt), text(size: 7.4pt, fill: c, t))
#let sicura = tag("Sicura", f: navy, c: crema)
#let arrivo = tag("In arrivo")
#let decid = tag("Da decidere", f: arancio, c: white)
#let tab(cols, ..righe) = {
  set text(size: 8.6pt)
  table(columns: cols, stroke: (x, y) => (bottom: 0.5pt + linea), inset: (x: 5pt, y: 5.5pt),
    fill: (x, y) => if y == 0 { crema } else { none },
    ..righe.pos().enumerate().map(((i, c)) => if i < cols.len() { text(fill: nv2, size: 8pt, c) } else { c }))
}
#let img(p, w: 100%, didascalia: none) = figure(image(p, width: w), caption: if didascalia != none { text(size: 8pt, fill: nv2, didascalia) }, supplement: none, numbering: none)

// ---------------------------------------------------------------- copertina
#page(fill: navy, margin: 22mm, header: none, footer: none)[
  #set text(fill: white)
  #grid(columns: (auto, auto), gutter: 8pt, align: horizon, image("../../demo-webapp/img/logo-white.png", width: 26pt), text(size: 22pt)[unilink])
  #v(1fr)
  #text(size: 8pt, fill: arancio, tracking: 0.16em)[ARCHITETTURA DI DESIGN · WEB APP]
  #v(10pt)
  #text(size: 40pt)[L'area personale \ di UniLink.]
  #v(14pt)
  #text(size: 11pt)[Le sezioni decise, come saranno davvero. \ Una sezione «Da decidere» per tutte le idee aperte. \ Giurisprudenza e Medicina già previste, senza promettere niente. \ Con gli strumenti per farla funzionare e il modo di chiedere modifiche.]
  #v(1fr)
  #set text(size: 8pt)
  #grid(columns: (1fr, 1fr, 1fr), gutter: 10pt,
    [Versione 1 \ 6 ottobre 2026], [Per i founder \ Matteo, Cosimo, Niccolò, Gianmarco], [Demo e backup \ repository unilink-hq · demo-webapp/])
]

// ---------------------------------------------------------------- in breve
#block(below: 4pt, text(size: 21pt)[In breve])
#block(below: 12pt, spaziato("cosa trovi in questo documento"))

Questo PDF è la mappa completa dell'area personale (web app) di UniLink: cosa contiene, perché è fatta così, come si costruisce davvero e *come si chiede una modifica alla demo* in modo che sia chiaro dove va e perché. È il gemello del PDF della landing: stessi colori, stesso font, stesso principio «tutto da dati».

#sub[Le decisioni prese (6/10/2026)]
#tab((28%, 72%),
  [Tema], [Decisione],
  [Base grafica], [Combinazione: *guscio* delle demo «file unico / Versione B» (crema, solo Croogla, parola accento), *logica* della Testing Version («Oggi» con il prossimo passo, barra in basso su telefono, selettore in cima alla sidebar), *copertine vere* di Demo_2.],
  [Navigazione], [Solo sidebar a sinistra (niente doppia barra in alto). *Cinque voci sicure*: Oggi, I miei esami, Dispense, Strumenti, Profilo. Massimo sei.],
  [Da decidere], [Tutto ciò che non è deciso vive in una voce separata, *arancio*, «Da decidere»: card con codice (D01…) che si aprono sull'architettura demo.],
  [Hub], [Economia attivo. Giurisprudenza e Medicina *in arrivo*: lo studente si registra, vede la lista d'attesa e gli strumenti per tutti. L'hub attivo è già disegnato in D01 e D02.],
  [Font e colori], [Croogla 4F ovunque. Navy \#172554, crema \#f4f1ea, arancio \#cf7527. Gli stessi token della landing.],
  [Strumenti], [Landing su Framer (invariata). Web app su *Next.js + Supabase + Vercel* all'indirizzo app.unilinkfirenze.it. Pagamenti (Stripe) e lettore protetto solo se decisi.],
  [Demo], [Pubblicata su GitHub Pages accanto alla landing: matteprune04.github.io/unilink-hq/demo-webapp/],
  [Backup], [Automatico: ogni modifica alle demo crea uno ZIP e una versione nello storico. L'HQ (Laboratorio AI → DEMO) mostra anteprima, download e storico, senza caricare nulla a mano.],
)

#sub[Come è organizzato]
#tab((34%, 66%),
  [Capitolo], [A cosa serve],
  [1–3 · Punto di partenza, demo, principi], [Da dove partiamo e cosa abbiamo preso da ogni demo.],
  [4–7 · Struttura, pagine, hub, Da decidere], [Il guscio, le cinque sezioni sicure, Giurisprudenza e Medicina, la sezione arancio.],
  [8–9 · Design system e configurazione], [Token, componenti WA/, il file config.js che governa tutto.],
  [10–12 · Farla funzionare davvero], [Strumenti, dati, sicurezza, misure, fasi di sviluppo.],
  [13 · Demo, backup e HQ], [Dove sono le demo, come si salvano le versioni, come si torna indietro.],
  [14 · Come chiedere modifiche], [Il «vocabolario» per chiedere un'idea in demo: cosa dici, cosa succede.],
  [15–16 · Checklist e demo grafiche], [Decisioni aperte e render della demo.],
)

// ---------------------------------------------------------------- 1
#cap("1", "Il punto di partenza", "cosa abbiamo e cosa no al 6 ottobre 2026")

#sub[Cosa abbiamo]
- *34 dispense* di Economia (EA ed EC), con copertina, codice, anno, semestre e modalità d'esame (catalogo del sito).
- *Landing* in rifacimento su Framer, con l'architettura v2 già decisa e la sua demo navigabile.
- *HQ online* (GitHub Pages + Supabase): il team usa già Supabase per login e dati, quindi la web app non introduce uno strumento nuovo.
- *Strumenti* già sul sito: calcolatore voto di laurea (regole v5), calcolatore Erasmus, destinazioni Erasmus, master e magistrali, guide.
- *Sette demo* dell'area personale, in realtà tre famiglie (cap. 2).

#sub[Cosa ci dicono i numeri (dal PDF della landing, GA4)]
- *Tre visitatori su quattro arrivano da smartphone*, quasi sempre da un link su WhatsApp: la web app si disegna prima a 390 px, con la barra in basso.
- La North Star dell'HQ è *studenti attivi settimanali* (obiettivo 150): la web app deve misurare proprio questo (cap. 10).

#sub[Cosa non abbiamo ancora]
Nessun backend per la web app, nessun account studente reale, listino non deciso, nessun materiale né studente nel team per Giurisprudenza e Medicina. Per questo la prima versione è *piccola e vera*: poche sezioni che funzionano, tutto il resto visibile solo al team nella sezione «Da decidere».

#nota[Regola HQ: una demo non dimostra che un servizio esiste. Nella demo i dati sono di esempio (Giulia Rossi, date d'esame, argomenti) e sono sempre etichettati come tali.]

// ---------------------------------------------------------------- 2
#cap("2", "Le demo analizzate", "tre famiglie, cosa prendiamo e cosa lasciamo")

#tab((22%, 26%, 26%, 26%),
  [Famiglia], [File], [Prendiamo], [Lasciamo],
  [A · «Il tuo spazio» (Testing Version)], [UniLink_Area_Utente (identico nello zip), unilink-area-utente (variante Network)], [«Oggi» con il prossimo passo; barra in basso su telefono; selettore in cima alla sidebar (diventa il selettore hub); idea «Da valutare» (diventa «Da decidere»).], [Più di 20 voci in sidebar; font Inter; sfondo grigio-azzurro; codice React compilato da 2 MB, difficile da modificare.],
  [B · Area personale + Versioni B/C/D], [AreaPersonale_file-unico, Versione_B_Esami, Versione_C_Career, Versione_D_Network], [Guscio grafico (crema, solo Croogla, parola accento, card bianche); badge «Presto» = scala di visibilità; dashboard «Cosa ti serve adesso?» e ripasso errori (B).], [Doppia navigazione (barra in alto + sidebar); prezzi visibili (€24, €59, €290…); numeri inventati (C, D); multi-ateneo e colori verdi (D).],
  [C · Demo_2_Corretta], [UniLink_Demo_2_Corretta], [Copertine vere delle dispense; accesso con link via email (niente password); sidebar navy a tutta altezza.], [Parte landing multicolore, «9 scuole in arrivo» (già scartata nel PDF della landing).],
)

#sub[Le Versioni B, C e D sono strategie, non design]
- *B · Esami* è il presente: preparare gli esami. Entra nella v1 come contenuto di «Oggi» e «I miei esami»; esercitazioni e ripasso errori vanno in *D03*.
- *C · Career* è il medio periodo: entra come *D09* (prima un tool leggero di confronto CV, il Career Score solo nella visione).
- *D · Network* è la visione multi-ateneo: non entra ora. La struttura la permette già (campo Ateneo nell'hub, come nella landing).

// ---------------------------------------------------------------- 3
#cap("3", "Principi di design", "le sei regole che decidono ogni scelta")

#grid(columns: (1fr, 1fr), gutter: 10pt,
  box-crema[*1 · Da studenti a studenti.* Frasi brevi, tu al singolo. Diciamo cosa c'è, cosa arriva e cosa no («Non abbiamo ancora materiali per Giurisprudenza»).],
  box-crema[*2 · Prima il telefono.* Si disegna a 390 px: barra in basso con le cinque voci, pulsanti alti almeno 44 px, testo almeno 14 px.],
  box-crema[*3 · Un prossimo passo.* Ogni giorno «Oggi» dice una sola cosa da fare, con un pulsante. Il resto è un clic più in là.],
  box-crema[*4 · Massimo sei voci.* Il «Tuo spazio» ha cinque voci sicure. Una nuova entra solo se è decisa, e se sono già sei ne esce un'altra.],
  box-crema[*5 · Deciso / da decidere.* Ciò che è deciso appare come sarà. Ciò che non è deciso vive solo nella sezione arancio, sempre etichettato.],
  box-crema[*6 · Tutto da dati.* Hub, voci, strumenti e card «Da decidere» stanno in config.js: cambiare = modificare una riga, non il design.],
)

// ---------------------------------------------------------------- 4
#cap("4", "Struttura dell'app", "il guscio e la mappa delle pagine")

#sub[Il guscio (uguale per ogni hub e ogni pagina)]
#tab((22%, 39%, 39%),
  [Parte], [Desktop], [Telefono (≤ 860 px)],
  [Sidebar], [Navy a tutta altezza: logo · selettore hub · «Il tuo spazio» (5 voci) · «Sezione di lavoro» (Da decidere, arancio) · utente · versione della demo.], [Si apre dal pulsante menu (cassetto da sinistra).],
  [Testata], [Percorso («Il tuo spazio / Oggi»), data, link al sito pubblico, etichetta DEMO.], [Menu · logo · pulsante arancio «Da decidere» · DEMO.],
  [Barra in basso], [—], [Oggi · Esami · Dispense · Strumenti · Profilo. È la navigazione principale su telefono.],
  [Contenuto], [Fondo crema, massimo 1180 px, card bianche.], [Margini 16 px, una colonna.],
)

#sub[Mappa delle pagine (i codici non cambiano: usali per chiedere modifiche)]
#tab((10%, 22%, 26%, 14%, 28%),
  [Codice], [Pagina], [Indirizzo nella demo], [Stato], [Note],
  [P00], [Accesso], [\#/accedi], [#sicura], [Link via email (Supabase Auth). In demo: «Entra con l'account demo».],
  [P01], [Oggi], [\#/oggi], [#sicura], [Cambia contenuto se l'hub è in arrivo (cap. 6).],
  [P02], [I miei esami], [\#/esami], [#sicura], [Funziona per ogni hub (date e argomenti inseriti dallo studente).],
  [P03], [Dispense], [\#/dispense], [#sicura], [Libreria + catalogo. P03a scheda: \#/dispense/\[slug\].],
  [P04], [Strumenti], [\#/strumenti], [#sicura], [P04a calcolatore voto: \#/strumenti/voto.],
  [P05], [Profilo], [\#/profilo], [#sicura], [Dati, hub, privacy, esci.],
  [P90], [Da decidere], [\#/decidere], [#decid], [Indice delle card. Dettaglio: \#/decidere/D01…],
)

#nota[«Da decidere» esiste nella demo e nell'ambiente di prova del team. Nella web app pubblicata per gli studenti è *spenta* (un interruttore in configurazione): gli studenti vedono solo le sezioni sicure.]

// ---------------------------------------------------------------- 5
#cap("5", "Le sezioni sicure", "pagina per pagina, come saranno davvero")

#sub[P01 · Oggi]
#tab((6%, 26%, 48%, 20%),
  [N.], [Blocco], [Contenuto], [Dati],
  [1], [Intestazione], [Etichetta «Economia · UniFi · il tuo spazio», titolo «Cosa prepari *oggi*, Giulia?».], [profilo],
  [2], [Il prossimo passo], [Card navy: esame più vicino e primo argomento non ripassato; «Segna come ripassato» e «Apri la dispensa».], [esami_utente],
  [3], [Quattro numeri], [Giorni al prossimo appello, argomenti ripassati, media, dispense salvate. Solo dati dello studente.], [esami_utente, profilo],
  [4], [I tuoi esami / Le tue dispense], [Due card affiancate con barre di avanzamento e copertine vere.], [esami_utente, salvate],
  [5], [Strumenti per te · Community], [Tre strumenti dell'hub; link al gruppo WhatsApp dell'hub.], [strumenti, hub],
)

#sub[P02 · I miei esami]
Per ogni esame: cerchio di avanzamento, data dell'appello (inserita dallo studente: «controllala sempre sulla pagina ufficiale»), voto obiettivo, argomenti come pulsanti da spuntare, link alla dispensa. «Aggiungi esame» apre un modulo: esame dal catalogo (o nome libero negli hub in arrivo), data, obiettivo, argomenti. In fondo: rimandi a *D04* (piano guidato) e *D08* (gruppi).

#sub[P03 · Dispense e P03a · scheda]
Libreria «Salvate» (segnalibro su ogni copertina) e catalogo completo con ricerca, filtro per anno e per area: gli stessi 34 esami e le stesse copertine della landing. La scheda mostra codice, anno, semestre, modalità d'esame, contenuto e tre azioni: *Apri la scheda sul sito* (oggi le dispense si aprono su unilinkfirenze.it), *Salva*, *Aggiungi ai miei esami*. Rimandi a *D06* (lettore) e *D05* (pacchetti).

#sub[P04 · Strumenti e P04a · calcolatore]
Elenco filtrato per hub. Il calcolatore del voto di laurea funziona dentro la app con le regole di UniLinkVotoLaurea.v5 (media × 110/30, +0,333 per lode, tesi +0…+3, in corso +2, lode con presentazione ≥ 104,5 e tesi +3) e parte dalla media del profilo. Gli altri strumenti aprono le pagine attuali del sito.

#sub[P05 · Profilo]
Nome, cognome, email (non modificabile), hub, corso, anno, media. Privacy e avvisi email (solo opt-in). Esci. Rimando a *D05* (acquisti).

// ---------------------------------------------------------------- 6
#cap("6", "Hub: Economia, Giurisprudenza, Medicina", "due soluzioni insieme: lo stato vero di oggi e l'architettura di domani")

Lo stesso guscio serve tutti gli hub. Il selettore in cima alla sidebar (nella app vera: il campo Hub del profilo) decide i contenuti. Ogni hub è una riga in UL_HUB, con gli stessi campi di hub.csv della landing.

#tab((22%, 39%, 39%),
  [Sezione], [Economia (attivo)], [Giurisprudenza / Medicina (in arrivo)],
  [P01 Oggi], [Prossimo passo, numeri, esami, dispense.], [«Ciao Giulia, *Giurisprudenza* sta arrivando»: cosa vorremmo fare (Inizia · Studia · Prosegui, tratteggiate), lista d'attesa con domanda e consenso, «Costruiscilo con noi», strumenti per tutti, rimando a D01/D02.],
  [P02 Esami], [Con link alle dispense.], [Funziona (nome libero), senza dispense.],
  [P03 Dispense], [Catalogo completo.], [Stato vuoto onesto + lista d'attesa.],
  [P04 Strumenti], [Tutti.], [Solo quelli con Hub = «tutti» (magistrali, guide).],
)

#sub[Lo stato vero (oggi) e l'architettura (domani)]
- *Oggi* lo studente di Giurisprudenza o Medicina può registrarsi: ogni iscrizione è una misura reale della domanda, la stessa che la landing raccoglie con «Avvisami». Le due liste finiscono nella stessa tabella (cap. 10).
- *Domani* l'hub attivo è già disegnato in *D01 (Giurisprudenza)* e *D02 (Medicina)*: stesso guscio, contenuti dalla configurazione. Per Medicina la fase «Inizia» è il semestre filtro (date da fonti ufficiali; obiettivo realistico 2027/28, come nel PDF della landing).
- *Accendere un hub* = cambiare stato da in_arrivo ad attivo e collegare le dispense con il campo Hub. Nessuna pagina nuova da disegnare.

#nota[Prima di promettere esami o materiali per un nuovo hub, il piano ufficiale del corso va verificato sul Course Catalogue UniFi.]

// ---------------------------------------------------------------- 7
#cap("7", "La sezione «Da decidere»", "tutte le idee aperte, ognuna con la sua architettura demo")

È una voce separata della sidebar, *arancio* e con bordo tratteggiato, sotto «Sezione di lavoro». Dentro, card raggruppate per tema. Ogni card aperta mostra sempre le stesse otto parti, così si confrontano a colpo d'occhio:

#tab((24%, 76%),
  [Parte], [Cosa contiene],
  [Il problema], [Perché ci serve, dall'HQ o dalle demo.],
  [La proposta], [Cosa faremmo, in due righe.],
  [Dove vivrebbe], [In quale voce o pagina sicura entrerebbe se decisa (mai «una voce nuova» senza dire cosa esce).],
  [Come risulterebbe], [La mini demo: blocchi veri della app dentro un riquadro tratteggiato «Architettura demo · non decisa».],
  [Cosa serve], [Dati, strumenti, persone, dipendenze da altre card.],
  [Da decidere], [Le domande per la call.],
  [Origine], [Da quale idea HQ, demo o nota nasce.],
  [Storico richieste], [Data e descrizione di ogni modifica chiesta (si allunga nel tempo).],
)

#sub[Le card di oggi]
#tab((8%, 32%, 18%, 14%, 28%),
  [Codice], [Titolo], [Gruppo], [Stato HQ], [Dove vivrebbe],
  [D01], [Hub Giurisprudenza attivo], [Nuovi hub], [In arrivo], [Tutte le sezioni, via selettore hub],
  [D02], [Hub Medicina attivo], [Nuovi hub], [In arrivo], [Oggi con conto alla rovescia del semestre filtro],
  [D03], [Esercitazioni e simulatore], [Studio], [In arrivo], [6ª voce, tra Dispense e Strumenti],
  [D04], [Piano di studio guidato], [Studio], [In arrivo], [Scheda dentro I miei esami],
  [D05], [Pacchetti, prezzi e Plus], [Monetizzazione], [Nuova], [Profilo (acquisti) + «Sblocca» sulla scheda],
  [D06], [Lettore protetto], [Studio], [Nuova], [Pulsante «Leggi» sulla scheda dispensa],
  [D07], [Raccolta domande d'esame], [Community], [In sviluppo], [Card in Oggi dopo un appello],
  [D08], [Community e gruppi di studio], [Community], [Nuova], [Scheda «Gruppi» dentro I miei esami],
  [D09], [Career: CV e percorso], [Dopo la laurea], [Nuova], [Tool in Strumenti],
  [D10], [Borse di studio], [Orientamento], [Nuova], [Guida in Strumenti],
  [D11], [Guida tesi], [Dopo la laurea], [Nuova], [Guida in Strumenti],
  [D12], [Test d'ingresso (TOLC)], [Orientamento], [Nuova], [Hub o modalità dedicata],
)

#sub[Come una card diventa sicura (stessa scala della landing)]
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  box-crema(fill: ar2)[*Da decidere* \ Solo nella sezione arancio, visibile al team.],
  box-crema(fill: crema2)[*Decisa · in costruzione* \ Resta la card, con lo storico «decisa il …». Nella app: nessuna traccia, oppure una riga «in arrivo».],
  box-crema(fill: nvt)[*Sicura* \ Entra nella sua voce del «Tuo spazio». La card esce dalla sezione arancio (resta nello storico del registro).],
)
Le quattro domande prima di promuovere una card: *esiste davvero?* *per chi?* (un hub, tutti) *cosa togliamo?* (se le voci sono già sei) *come misuriamo?* (un evento, cap. 10).

// ---------------------------------------------------------------- 8
#cap("8", "Design system", "gli stessi token della landing, più i componenti della app")

#sub[Colori e tipografia]
Identici al cap. 13 della landing: navy \#172554 (testo, sidebar, card scure), crema \#f4f1ea (fondo), arancio \#cf7527 (accento, una parola per titolo, sezione Da decidere), bianco (card), navy testo 2 \#4b5675, linea \#e2dccf, crema scuro \#ebe4d5, arancio chiaro \#f6e4d1, arancio scuro \#a95d1c (testo arancio piccolo), navy chiaro \#dfe4f1. Croogla 4F a un solo peso: la gerarchia si fa con dimensione e colore. Titolo pagina 44 px (telefono 32), titolo card 26 px, testo 16 px, piccolo 14 px.

#sub[Due linguaggi, ben distinti]
#tab((24%, 38%, 38%),
  [], [Sezioni sicure], [Da decidere],
  [Bordi], [Card bianche, bordo pieno leggerissimo.], [Bordo *tratteggiato* arancio.],
  [Colore guida], [Navy.], [Arancio, fondo arancio chiaro.],
  [Etichetta], [Nessuna.], [Sempre: «Da decidere · D0x», «Architettura demo · non decisa».],
)

#sub[Componenti (nomi da usare nelle richieste)]
#tab((26%, 46%, 28%),
  [Componente], [Cosa è], [Dove],
  [WA/Sidebar], [Logo, selettore hub, voci, Da decidere, utente.], [Tutte le pagine],
  [WA/TabBar], [Cinque voci in basso su telefono.], [Telefono],
  [WA/Testata], [Percorso, data, sito, DEMO.], [Tutte le pagine],
  [WA/Intestazione], [Etichetta + titolo con parola accento + sottotitolo.], [Inizio di ogni pagina],
  [WA/Passo], [Card navy del prossimo passo con due pulsanti.], [P01, mini demo],
  [WA/Numero], [Valore grande + etichetta.], [P01],
  [WA/CardEsame], [Cerchio, data, obiettivo, argomenti spuntabili.], [P02],
  [WA/CardDispensa], [Copertina vera, anno, segnalibro, meta.], [P03],
  [WA/RigaStrumento], [Icona, nome, descrizione, freccia.], [P01, P04],
  [WA/Calcolatore], [Cursori + risultato navy.], [P04a],
  [WA/ListaAttesa], [Domanda, consenso, «Avvisami».], [P01 hub in arrivo],
  [WA/Vuoto], [Stato vuoto onesto con un'azione.], [Ovunque serva],
  [WA/Rimando], [Banda arancio tratteggiata verso una card Dxx.], [In fondo alle pagine sicure],
  [WA/CardDecidere], [Codice, titolo, problema, stato, impatto.], [P90],
  [WA/Schermo], [Riquadro tratteggiato della mini demo.], [Dettaglio Dxx],
  [WA/Bottone], [Primario navy · Secondario bianco · Crema · Contorno · Accento arancio.], [Ovunque],
  [WA/Badge], [Neutro · Attivo · In arrivo · Iscritto.], [Ovunque],
)

// ---------------------------------------------------------------- 9
#cap("9", "La configurazione", "config.js: l'unico file da toccare per cambiare cosa c'è")

#tab((22%, 44%, 34%),
  [Blocco], [Campi], [Esempio di modifica],
  [UL_HUB], [slug, nome, stato (attivo/in_arrivo), tinta, ateneo, corsi, fasi (Inizia/Studia/Prosegui), domanda della lista d'attesa, card Da decidere collegata.], [Accendere Giurisprudenza: stato «attivo».],
  [UL_MODULI], [id, nome, icona, hub (tutti o slug), tab (in barra in basso).], [Aggiungere «Esercitazioni» quando D03 è decisa.],
  [UL_STRUMENTI], [id, nome, desc, hub, tipo (interno/link), url.], [Un nuovo calcolatore per Giurisprudenza.],
  [UL_UTENTE], [Account demo: dati di esempio, esami, salvate.], [Cambiare l'esempio mostrato.],
  [UL_DA_DECIDERE], [id, titolo, gruppo, stato, origine, impatto, sforzo, problema, proposta, dove, schermata, serve, domande, storico.], [Una nuova idea = un nuovo blocco D13.],
  [UL_VERSIONE], [Numero, data, nota.], [Si aggiorna a ogni versione.],
)

#sub[I blocchi della mini demo (campo «schermata»)]
Ogni card «Da decidere» si disegna con blocchi già pronti, quindi una nuova architettura non richiede design nuovo:
#tab((16%, 84%),
  [Blocco], [Cosa mostra],
  [hero], [Etichetta + titolo con \*parola accento\* + testo.],
  [navy], [Card del prossimo passo con badge e pulsanti.],
  [stats], [Tre numeri.],
  [cards], [Tre card con titolo e testo.],
  [list], [Righe con titolo, sottotitolo, etichetta.],
  [steps], [Passi numerati o per giorno.],
  [form], [Modulo con campi e pulsante.],
  [progress], [Barre di avanzamento.],
  [quiz], [Domanda a scelta multipla cliccabile.],
  [prezzi], [Card prezzo «DA DECIDERE», nascoste.],
  [chips], [Etichette in fila.],
  [nota], [Avviso arancio.],
)
Se un'idea ha bisogno di qualcosa che i blocchi non sanno fare, si aggiunge un tipo di blocco (una funzione in app.js) e si documenta qui.

#sub[I file della demo]
#tab((24%, 76%),
  [File], [Cosa contiene],
  [index.html], [Il guscio vuoto: sidebar, testata, contenuto, barra in basso.],
  [config.js], [Tutto ciò che si può cambiare senza toccare il design (questo capitolo).],
  [app.js], [Le pagine (VISTE), i blocchi della mini demo (BLOCCHI), gli eventi.],
  [app.css], [Token e componenti, sezione per sezione (1 token · 2 base · 3 guscio · 4 componenti · 5 Da decidere · 6 telefono).],
  [dispense.js], [Le 34 dispense (stessa fonte della landing).],
  [img/, fonts/], [Copertine vere, loghi, Croogla.],
  [LEGGIMI.md], [Istruzioni rapide per founder e AI.],
)

// ---------------------------------------------------------------- 10
#cap("10", "Farla funzionare davvero", "pochi strumenti, sicuri, che il team conosce già")

#sub[Lo schema]
#box-crema[
  #grid(columns: (1fr, auto, 1fr, auto, 1fr), gutter: 6pt, align: center + horizon,
    box(fill: white, radius: 6pt, inset: 8pt)[*Landing* \ Framer \ unilinkfirenze.it], [→ «Accedi»],
    box(fill: navy, radius: 6pt, inset: 8pt, text(fill: white)[*Web app* \ Next.js su Vercel \ app.unilinkfirenze.it]), [↔],
    box(fill: white, radius: 6pt, inset: 8pt)[*Supabase* \ accesso · database \ archivio file])
  #v(4pt)
  #align(center, text(size: 8pt, fill: nv2)[Lista d'attesa della landing (form Framer → webhook) e della app finiscono nella stessa tabella. Più avanti: Stripe → webhook → Supabase.])
]

#tab((18%, 30%, 52%),
  [Strumento], [A cosa serve], [Perché questo],
  [Supabase], [Accesso con link via email, database, archivio privato per i PDF.], [Lo usate già per l'HQ (stesso account, nuovo progetto separato). Regole di sicurezza nel database: ogni studente vede solo i suoi dati.],
  [Next.js], [Le pagine della app (P00–P05), una cartella per pagina.], [Lo standard più diffuso: l'AI lo scrive bene e chiunque lo può riprendere. Le VISTE della demo diventano le pagine 1 a 1.],
  [Vercel], [Pubblica la app a ogni push su GitHub, con anteprima per ogni modifica.], [Collegato al repository, zero server da gestire.],
  [GitHub], [Codice, storico, backup, Action.], [Già in uso per HQ e demo.],
  [Stripe (dopo)], [Pagamenti, solo se D05 è decisa.], [Checkout pronto, webhook verso Supabase per sbloccare i contenuti.],
  [PDF.js + pdf-lib (dopo)], [Lettore protetto con filigrana, solo se D06 è decisa.], [Open source, nessuna licenza.],
)

#nota[Costi: Supabase e Vercel partono con piani gratuiti adatti alle prime centinaia di studenti; le soglie e i prezzi vanno verificati sui listini ufficiali quando si attivano. Stripe applica una commissione per transazione (vedi la scheda HQ «Sistema di Pagamento»).]

#sub[I dati (tabelle Supabase della v1)]
#tab((22%, 50%, 28%),
  [Tabella], [Campi principali], [Chi la vede],
  [profili], [id (utente), nome, cognome, email, hub, corso, anno, media, consensi, creato_il], [Solo il proprietario],
  [esami_utente], [utente, dispensa (o nome libero), data_appello, obiettivo, argomenti, fatti], [Solo il proprietario],
  [salvate], [utente, dispensa], [Solo il proprietario],
  [lista_attesa], [email, hub, risposta, consenso, origine (landing/app), data], [Solo il team],
  [dispense], [slug, nome, codice, anno, sem, modalità, tipi, area, copertina, hub, aggiornata_il], [Tutti (lettura)],
  [hub, strumenti], [Come config.js (e come hub.csv / tools.csv della landing)], [Tutti (lettura)],
  [eventi], [utente, tipo, dettagli, data], [Solo il team (misure)],
)
Le tabelle dispense, hub e strumenti si caricano dagli stessi CSV della landing: *una sola fonte* per sito e app.

#sub[Cosa misuriamo]
#tab((30%, 70%),
  [Evento], [Quando],
  [accesso], [Lo studente entra (base degli studenti attivi settimanali, la North Star).],
  [apri_dispensa / salva_dispensa], [Apertura o salvataggio di una dispensa (slug).],
  [aggiungi_esame / argomento_fatto], [Uso di «I miei esami»: misura se il prossimo passo serve.],
  [usa_strumento], [Calcolatore o link a uno strumento (id).],
  [lista_attesa], [Iscrizione a un hub in arrivo (slug): decide quale hub parte prima.],
)

#sub[Privacy, senza complicarsi]
Informativa chiara al primo accesso; email usata solo per l'accesso e per gli avvisi scelti; nessuno vede cosa scarichi; profilo privato; «scarica i miei dati» ed «elimina l'account» nel Profilo. Il consenso della lista d'attesa è separato.

// ---------------------------------------------------------------- 11
#cap("11", "Fasi di sviluppo", "dalla demo alla app vera, un pezzo alla volta")

#tab((16%, 44%, 40%),
  [Fase], [Cosa], [Pronta quando],
  [0 · Demo (ora)], [Questa demo, la sezione Da decidere, il PDF. Decisioni in call.], [Approvata dal team.],
  [1 · MVP], [Accesso via email, profilo con hub, I miei esami, Dispense (libreria + link al sito), Strumenti, lista d'attesa unica con la landing, eventi. «Accedi» nella navbar della landing.], [10 studenti di Economia la usano per una settimana senza aiuto.],
  [2 · Card decise], [Le card promosse in call, una alla volta (probabili: D03 Esercitazioni, D07 Domande d'esame, D05 Pacchetti + D06 Lettore insieme).], [Ogni card ha il suo evento e dopo un mese viene usata.],
  [3 · Nuovi hub], [D01 o D02, quello con più iscritti in lista d'attesa e almeno uno o due studenti disposti a costruirlo.], [Materiali e persone ci sono.],
  [Visione], [Più atenei (livello sotto l'hub), Career, community.], [Quando i numeri lo giustificano.],
)

#sub[Struttura del codice nella app vera]
#box-crema[#set text(size: 8.4pt)
`app/(spazio)/oggi` · `esami` · `dispense/[slug]` · `strumenti/[id]` · `profilo` · `app/accedi` \
`config/` hub, moduli, strumenti (gli stessi campi di config.js) \
`components/WA/` i componenti del cap. 8 · `lib/supabase` accesso e dati \
`supabase/` tabelle e regole di sicurezza (come lo schema dell'HQ)]

// ---------------------------------------------------------------- 12
#cap("12", "Regole anti-sovraccarico", "come crescere senza riempire")

- *Sei voci al massimo* nel «Tuo spazio». Oggi sono cinque: resta un solo posto libero, che va a chi lo merita.
- *Prima dentro una voce, poi voce propria.* Piano, gruppi, career e guide entrano come schede o strumenti dentro le voci esistenti.
- *Un prossimo passo.* «Oggi» non diventa una bacheca: un passo, quattro numeri, due liste.
- *Niente prezzi né numeri inventati* nelle sezioni sicure. Prezzi solo in D05, sempre «DA DECIDERE».
- *Ogni novità ha un evento.* Se dopo un mese nessuno la usa, torna in «Da decidere».

// ---------------------------------------------------------------- 13
#cap("13", "Demo, backup e HQ", "dove sono, come si salvano, come si torna indietro")

#tab((26%, 74%),
  [Cosa], [Dove],
  [Demo web app], [matteprune04.github.io/unilink-hq/demo-webapp/],
  [Demo landing], [matteprune04.github.io/unilink-hq/demo-landing/],
  [Sorgenti], [Repository GitHub matteprune04/unilink-hq, cartelle demo-webapp/ e demo-landing/],
  [Registro versioni], [demos/registro.json (scritto in automatico)],
  [Backup], [Release GitHub con tag webapp-vN e landing-vN, ognuna con lo ZIP allegato],
  [In HQ], [Laboratorio AI → sezione *DEMO*: anteprima desktop/telefono, «Scarica l'ultima versione», storico con data, autore, nota e ZIP di ogni versione],
  [Questo documento], [architettura/UniLink_Architettura_WebApp.pdf (sorgente Typst accanto)],
)

#sub[Come funziona il backup automatico]
+ Claude (o chiunque) modifica una demo e fa push su GitHub con una frase che descrive la modifica.
+ La GitHub Action «Backup demo» vede che demo-webapp/ o demo-landing/ sono cambiate.
+ Crea lo ZIP della cartella e una Release GitHub (tag webapp-v2, v3…): il backup sta fuori dal repository, che resta leggero.
+ Aggiunge la versione a demos/registro.json: numero, data, autore, nota (la frase del push), dimensione, link.
+ L'HQ legge il registro: la sezione DEMO mostra subito la nuova versione e lo storico. Nessun caricamento a mano.

#sub[Come si torna a una versione]
Dall'HQ: «Scarica ZIP» sulla versione voluta (si apre senza installare nulla: index.html). Oppure chiedi «ripristina la web app alla v3»: Claude riporta la cartella al tag webapp-v3 e fa push; la Action crea una nuova versione (la storia non si perde mai).

#nota[La sezione DEMO sta nel file \_src/online.js dell'HQ, che la build inserisce in index.html: sopravvive quando si rigenera l'HQ dal sorgente locale.]

// ---------------------------------------------------------------- 14
#cap("14", "Come chiedere modifiche", "il vocabolario comune: cosa dici, cosa succede")

Ogni richiesta ha un *tipo*. Basta nominarlo con il codice della pagina (P01…), della card (D01…) o del componente (WA/…): così è chiaro dove va, come si fa e perché.

#tab((17%, 33%, 50%),
  [Tipo], [Cosa dici (esempio)], [Cosa faccio],
  [A · Nuova idea], [«Nuova idea per la web app: promemoria via email il giorno prima dell'appello.»], [Creo la card *D13* in Da decidere con le otto parti (problema, proposta, dove vivrebbe, mini demo, cosa serve, domande, origine, storico). Nessuna sezione sicura cambia.],
  [B · Modifica una card], [«In D03 aggiungi la simulazione a tempo con il punteggio in trentesimi.»], [Aggiorno la mini demo e lo storico richieste di D03.],
  [C · Promuovi], [«D03 è decisa: mettila nella app.»], [Applico le quattro domande, la porto nella sua voce (o 6ª voce), aggiorno UL_MODULI, il cap. 5 e la mappa; la card esce da Da decidere con lo storico «decisa il …».],
  [D · Modifica una pagina sicura], [«In P01 Oggi metti la community prima degli strumenti.»], [Modifico la vista P01; se cambia la struttura aggiorno il cap. 5.],
  [E · Grafica], [«WA/CardDispensa: copertina più grande su telefono.»], [Modifico il componente in app.css; vale ovunque è usato.],
  [F · Hub], [«Accendi Giurisprudenza» oppure «aggiungi l'hub Ingegneria in arrivo».], [Riga in UL_HUB (stato, fasi, domanda) e card D collegata.],
  [G · Ripristina], [«Riporta la web app alla v2.»], [Riporto la cartella al tag webapp-v2, push, nuova versione nello storico.],
  [H · Rimuovi / archivia], [«Togli D12, non la facciamo.»], [La card esce dalla sezione; resta nel registro e nell'HQ (Decisioni).],
)

#sub[Cosa succede dopo ogni richiesta]
Nuova versione della demo (numero in fondo alla sidebar) → backup automatico → nell'HQ, Laboratorio AI → DEMO, compare la versione con la nota. Se la richiesta cambia l'architettura, aggiorno anche questo PDF (nuova versione in copertina) e lo storico nella card.

#nota[Se un'idea è ambigua, ti chiedo prima il tipo: «la metto in Da decidere (A) o la vuoi già nella app (C)?». Senza decisione, un'idea va sempre in Da decidere.]

// ---------------------------------------------------------------- 15
#cap("15", "Checklist e decisioni aperte", "prima di passare alla fase 1")

#sub[Da decidere in call]
#tab((32%, 68%),
  [Tema], [Serve decidere],
  [Approvazione], [Questo documento e le cinque voci sicure.],
  [Prime card da promuovere], [Probabili D03 (esercitazioni) e D07 (domande d'esame): cosa entra nella fase 2?],
  [Pacchetti e lettore], [D05 e D06 insieme o separati? Dopo il sondaggio prezzi.],
  [Primo nuovo hub], [Dopo 3–4 settimane di lista d'attesa (landing + app).],
  [Chi costruisce], [Chi segue la fase 1 (con l'AI) e chi testa con i 10 studenti.],
  [Indirizzo], [app.unilinkfirenze.it e «Accedi» nella navbar della landing.],
)

#sub[Checklist della fase 1]
- Progetto Supabase separato dall'HQ, tabelle del cap. 10 con regole di sicurezza.
- Accesso via email provato su telefono (link aperto dal client di posta).
- Tutte le pagine provate a 390 px, solo Croogla e i colori dello stile.
- Nessun prezzo, nessun numero senza fonte, «Da decidere» spenta per gli studenti.
- Informativa privacy, consensi separati, «elimina account».
- Eventi del cap. 10 registrati; lista d'attesa unica con la landing.

// ---------------------------------------------------------------- 16
#cap("16", "Demo grafiche", "render della demo v1 · dati di esempio")

#img("img/d_oggi.png", didascalia: [P01 · Oggi (desktop): prossimo passo, quattro numeri, sidebar con la voce arancio «Da decidere».])
#img("img/d_esami.png", didascalia: [P02 · I miei esami: argomenti da spuntare e rimandi a D04 e D08.])
#pagebreak()
#img("img/d_dispense.png", didascalia: [P03 · Dispense: libreria e catalogo con le copertine vere.])
#img("img/d_strumenti-voto.png", didascalia: [P04a · Calcolatore voto di laurea (regole v5).])
#pagebreak()
#img("img/d_giuri-oggi.png", w: 82%, didascalia: [P01 con hub in arrivo (Giurisprudenza): stato vero di oggi + rimando a D01.])
#pagebreak()
#img("img/d_decidere.png", didascalia: [P90 · Da decidere: card per gruppo, codice, stato e impatto.])
#img("img/d_decidere-D03.png", didascalia: [D03 · dettaglio: le parti fisse e la mini demo nel riquadro tratteggiato.])
#pagebreak()
#grid(columns: (1fr, 1fr, 1fr), gutter: 10pt,
  img("img/m_oggi.png", didascalia: [Telefono · Oggi]),
  img("img/m_esami.png", didascalia: [Telefono · Esami]),
  img("img/m_dispense-microeconomia.png", didascalia: [Telefono · scheda dispensa]),
)
#grid(columns: (1fr, 1fr, 1fr), gutter: 10pt,
  img("img/m_accedi.png", didascalia: [Telefono · Accesso]),
  img("img/m_decidere.png", didascalia: [Telefono · Da decidere]),
  [],
)
#pagebreak()
#img("img/hq_lab_d.png", didascalia: [HQ · Laboratorio AI → DEMO: le due demo sempre all'ultima versione, con download.])
#img("img/hq_demo_d.png", w: 80%, didascalia: [HQ · dettaglio demo: anteprima desktop/telefono e storico delle versioni (backup).])
