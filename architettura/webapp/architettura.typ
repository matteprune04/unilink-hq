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

#let versione = "v2 · 6 ottobre 2026"

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
  #text(size: 8pt, fill: arancio, tracking: 0.16em)[ARCHITETTURA DI DESIGN · WEB APP · VERSIONE 2]
  #v(10pt)
  #text(size: 40pt)[L'area personale \ di UniLink.]
  #v(14pt)
  #text(size: 11pt)[Base grafica «Il tuo spazio» (demo A), con i dettagli della demo C. \ Tre livelli: area di studio, percorso, piano. \ Primo accesso in 7 passi, account demo per ogni abbonamento. \ Una sezione «Da decidere» e una «Configurazione» per il team.]
  #v(1fr)
  #set text(size: 8pt)
  #grid(columns: (1fr, 1fr, 1fr), gutter: 10pt,
    [Versione 2 \ 6 ottobre 2026], [Per i founder \ Matteo, Cosimo, Niccolò, Gianmarco], [Demo e backup \ repository unilink-hq · demo-webapp/])
]

// ---------------------------------------------------------------- in breve
#block(below: 4pt, text(size: 21pt)[In breve])
#block(below: 12pt, spaziato("cosa trovi in questo documento"))

Questo PDF è la mappa completa dell'area personale (web app) di UniLink: cosa contiene, perché è fatta così, come si costruisce davvero e *come si chiede una modifica alla demo*. È il gemello del PDF della landing. La versione 2 sostituisce la v1: la base grafica è la demo *A* («Il tuo spazio»), come richiesto.

#sub[Le decisioni prese (6/10/2026)]
#tab((26%, 74%),
  [Tema], [Decisione],
  [Base grafica], [*Demo A* («Il tuo spazio», Testing Version): sidebar navy con riquadro «Il tuo percorso», testata bianca con data, «Nuova attività» e *cerchio con iniziali e colore della persona* (con menu), sottobarra crema, card bianche su fondo grigio chiaro, titoli Croogla con il punto finale. Dalla *C*: copertine vere, «Pacchetti e Plus», «Sblocchi».],
  [Font], [Titoli Croogla, testo Inter (come la A). Un interruttore (--font-testo) riporta tutto a Croogla se si vuole la regola della landing «solo Croogla».],
  [Login e primo accesso], [Login della A («Il tuo spazio. Il tuo percorso.») con link via email. Primo accesso in *7 passi*: chi sei, cosa studi, percorso, da dove partire, ritmo, privacy, come iniziare.],
  [Divisione delle aree], [*Tre livelli indipendenti* (cap. 6): Area di studio (cosa studi) · Percorso (Test Prep / Studio / Futuro: quando) · Piano (cosa è sbloccato). Il menu nasce da area × percorso; il piano mette lucchetti.],
  [Abbonamenti], [Gratuito (estratti + una dispensa completa a scelta + 10 quiz al giorno), Appunti, Dispensa completa, Pacchetto semestre, Plus. *Prezzi = ipotesi HQ*, non decisi (D05).],
  [Da decidere], [Voce arancio della sidebar con 12 card (D01–D12). «Vedi nella app» quando la proposta è già visibile come ipotesi.],
  [Configurazione], [Nuova voce per il team: legge config.js e mostra aree, moduli × percorsi × aree, piani × funzioni, account demo.],
  [Strumenti], [Landing su Framer. Web app su *Next.js + Supabase + Vercel* (app.unilinkfirenze.it). Stripe e lettore protetto solo se decisi.],
  [Demo e backup], [GitHub Pages (…/demo-webapp/). Backup automatico a ogni modifica; HQ → Laboratorio AI → DEMO con anteprima, download e storico.],
)

#sub[Come è organizzato]
#tab((34%, 66%),
  [Capitolo], [A cosa serve],
  [1–3 · Punto di partenza, demo, principi], [Da dove partiamo e cosa abbiamo preso da ogni demo.],
  [4–5 · Struttura e pagine], [Il guscio A, la mappa delle pagine, accesso e primo accesso.],
  [6 · Aree, percorsi, piani], [La divisione tra Economia, Giurisprudenza, Medicina e le future; gli abbonamenti.],
  [7 · Da decidere], [Le idee aperte con la loro architettura demo.],
  [8–9 · Design system e configurazione], [Token A, componenti WA/, config.js, account demo, pagina Configurazione.],
  [10–12 · Farla funzionare davvero], [Strumenti, dati, misure, fasi, regole anti-sovraccarico.],
  [13–14 · Demo, backup, richieste], [Dove sono le demo e il vocabolario per chiedere modifiche.],
  [15–16 · Checklist e render], [Decisioni aperte e demo grafiche.],
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
  [A · «Il tuo spazio» (Testing Version)], [UniLink\_Area\_Utente (identico nello zip), unilink-area-utente (variante Network)], [*Base grafica di tutta la app (v2)*: sidebar con «Il tuo percorso», testata con cerchio delle iniziali, card, titoli con il punto, «Oggi» con il prossimo passo, barra in basso, login «Il tuo spazio. Il tuo percorso.», tre percorsi, Biblioteca e Offerte.], [Più di 20 voci in sidebar (ridotte con le regole del cap. 6); codice React compilato da 2 MB (riscritto in file semplici).],
  [B · Area personale + Versioni B/C/D], [AreaPersonale\_file-unico, Versione\_B\_Esami, Versione\_C\_Career, Versione\_D\_Network], [Guscio grafico (crema, solo Croogla, parola accento, card bianche); badge «Presto» = scala di visibilità; dashboard «Cosa ti serve adesso?» e ripasso errori (B).], [Doppia navigazione (barra in alto + sidebar); prezzi visibili (€24, €59, €290…); numeri inventati (C, D); multi-ateneo e colori verdi (D).],
  [C · Demo\_2\_Corretta], [UniLink\_Demo\_2\_Corretta], [Copertine vere delle dispense; pagina «Pacchetti e Plus»; riepilogo «Sblocchi»; accesso con link via email.], [Parte landing multicolore, «9 scuole in arrivo» (già scartata nel PDF della landing).],
)

#sub[Le Versioni B, C e D sono strategie, non design]
- *B · Esami* è il presente: preparare gli esami. Entra nella v1 come contenuto di «Oggi» e «I miei esami»; esercitazioni e ripasso errori vanno in *D03*.
- *C · Career* è il medio periodo: entra come *D09* (prima un tool leggero di confronto CV, il Career Score solo nella visione).
- *D · Network* è la visione multi-ateneo: non entra ora. La struttura la permette già (campo Ateneo nell'hub, come nella landing).

// ---------------------------------------------------------------- 3
#cap("3", "Principi di design", "le sei regole che decidono ogni scelta")

#grid(columns: (1fr, 1fr), gutter: 10pt,
  box-crema[*1 · Da studenti a studenti.* Frasi brevi, tu al singolo. Diciamo cosa c'è, cosa arriva e cosa no («Medicina sta arrivando»).],
  box-crema[*2 · Prima il telefono.* Si disegna a 390 px: barra in basso con cinque voci, menu laterale a cassetto, pulsanti alti almeno 44 px.],
  box-crema[*3 · Un prossimo passo.* «Oggi» dice una cosa da fare, con un pulsante, diversa per percorso (esame, test, magistrale).],
  box-crema[*4 · Area, percorso, piano.* Tre scelte indipendenti: mai mescolarle (una voce di menu non dipende dal piano, un lucchetto non dipende dal percorso).],
  box-crema[*5 · Onesti sul gratuito.* Ogni lucchetto dice cosa sblocca e con cosa. Prezzi solo come «ipotesi» finché non sono decisi.],
  box-crema[*6 · Tutto da dati.* Aree, percorsi, moduli, piani, account demo e card «Da decidere» stanno in config.js: cambiare = una riga.],
)

// ---------------------------------------------------------------- 4
#cap("4", "Struttura dell'app", "il guscio della demo A e la mappa delle pagine")

#sub[Il guscio]
#tab((20%, 42%, 38%),
  [Parte], [Desktop], [Telefono (≤ 860 px)],
  [Sidebar navy], [Logo · riquadro *Il tuo percorso* (selettore Test Prep / Studio / Futuro + pallino colore area · ateneo) · Oggi, Il mio piano · voci del percorso · *Il tuo account* (Salvati, Piano e acquisti, Profilo) · *Sezione di lavoro* (Da decidere, Configurazione, arancio tratteggiate) · persona e piano.], [Cassetto da sinistra con il pulsante menu.],
  [Testata bianca], [Percorso («Il tuo spazio / Materiali»), data, «Nuova attività», *cerchio con iniziali e colore* + nome e piano. Il cerchio apre il menu: profilo e colore, piano e acquisti, come funziona l'area, configurazione, cambia account demo, rifai il primo accesso, esci.], [Menu · logo · cerchio.],
  [Sottobarra crema], [Riassunto «DEMO · persona · area · percorso · piano», pillola DA DECIDERE, «Come funziona l'area», sito pubblico.], [Riassunto e pillola.],
  [Barra in basso], [—], [Cinque voci: Oggi, Piano, le due voci principali del percorso, Profilo.],
)

#sub[Mappa delle pagine (codici fissi: usali per chiedere modifiche)]
#tab((9%, 23%, 22%, 16%, 30%),
  [Codice], [Pagina], [Indirizzo], [Percorso], [Note],
  [P00], [Accesso], [\#/accedi], [—], [Link via email + account demo.],
  [P00b], [Primo accesso], [\#/benvenuto/1…7], [—], [Sette passi (cap. 5).],
  [P01], [Oggi], [\#/oggi], [Sempre], [Prossimo passo diverso per percorso; sblocchi; community.],
  [P02], [Il mio piano], [\#/piano], [Sempre], [Settimana o lista; «Organizza sessioni» (Plus, D04).],
  [P10], [I miei esami], [\#/esami], [Studio], [Card A con appello, obiettivo, argomenti.],
  [P11], [Materiali], [\#/materiali], [Studio], [Biblioteca con copertine, stato per piano, lettore.],
  [P12], [Esercitazioni], [\#/pratica], [Studio], [Quiz rapido · ripasso errori · simulazione.],
  [P13], [Libretto e obiettivi], [\#/libretto], [Studio], [Voti, media ponderata, voto di laurea.],
  [P20], [Il mio test], [\#/test], [Test Prep], [Conto alla rovescia, come prepararti.],
  [P21], [Allenamento], [\#/allenamento], [Test Prep], [Stesso motore quiz di P12.],
  [P22], [Registro errori], [\#/errori], [Test Prep], [Ultimi 3 gratis, tutti con Plus.],
  [P23], [Orientamento], [\#/orientamento], [Test Prep], [Link ufficiali, aree di UniLink.],
  [P30], [Magistrali e MSc], [\#/magistrali], [Futuro], [Checklist requisiti + shortlist personale.],
  [P31], [Erasmus], [\#/erasmus], [Futuro], [Checklist + strumenti del sito.],
  [P32], [Carriere e CV], [\#/career], [Futuro], [Checklist + confronto CV (Plus, D09).],
  [P40], [Salvati], [\#/salvati], [Account], [Dispense con segnalibro.],
  [P41], [Piano e acquisti], [\#/abbonamento], [Account], [Il tuo piano · Offerte · Ordini.],
  [P42], [Profilo], [\#/profilo], [Account], [Dati, area, percorso, *colore del cerchio*.],
  [P90], [Da decidere], [\#/decidere/Dxx], [Lavoro], [Card con architettura demo.],
  [P91], [Configurazione], [\#/configurazione], [Lavoro], [Tabelle di config.js.],
)
#nota[Sezione di lavoro (P90, P91) e account demo esistono nella demo e nell'ambiente di prova del team; nella app pubblicata per gli studenti sono spenti.]

// ---------------------------------------------------------------- 5
#cap("5", "Le pagine", "accesso, primo accesso e le pagine di ogni percorso")

#sub[P00 · Accesso]
Card bianca centrata su crema, come il login della A: «Il tuo spazio. Il tuo percorso.», email, «Mandami il link» (Supabase Auth, niente password). Sotto, nella demo, gli *account demo* (cap. 9) e «Nuovo account» per provare il primo accesso.

#sub[P00b · Primo accesso (7 passi, barra di avanzamento)]
#tab((8%, 22%, 70%),
  [Passo], [Titolo], [Cosa chiede e perché],
  [1], [Chi sei], [Nome, cognome, email. Servono al saluto e al cerchio con le iniziali.],
  [2], [Cosa studi], [Area (Economia attiva · Giurisprudenza e Medicina in arrivo · un'altra area) + ateneo + corso + anno. L'area decide catalogo e strumenti.],
  [3], [Da dove parti], [Percorso: Test Prep, Studio o Futuro (scelte della A). Decide la home.],
  [4], [Da dove partire], [Dipende dalle scelte: esami del semestre (Studio), test e data (Test Prep), obiettivo dopo la laurea (Futuro), lista d'attesa (area in arrivo).],
  [5], [Il tuo ritmo], [Minuti al giorno, giorni preferiti, obiettivo: base del piano.],
  [6], [Privacy e avvisi], [Consenso obbligatorio separato dagli avvisi facoltativi (dispense seguite, novità mensili).],
  [7], [Come iniziare], [Gratuito (con una dispensa completa a scelta) o Plus. Gli acquisti si fanno dopo, quando servono.],
)

#sub[Le pagine principali]
- *P01 Oggi* — card navy del prossimo passo (Studio: argomento dell'esame più vicino; Test Prep: allenamento del giorno; Futuro: prossima azione), quattro numeri, «I tuoi esami / Le tue scelte», «Nel tuo piano», «I tuoi sblocchi» (dalla C), community.
- *P10 I miei esami* — card della A: iniziali, «In preparazione», appello pianificato, voto obiettivo, corso, anno e modalità, barra degli argomenti; «Apri l'esame» per spuntare gli argomenti.
- *P11 Materiali* — «La tua biblioteca.»: ricerca, anno, tipo (appunti, mappe, quiz), «Le mie complete»; card con *copertina vera* e stato *Estratto / Completa ✓*; «Usa la dispensa gratis» finché non è scelta; lettore con estratto e velo «Il resto è nella dispensa completa».
- *P12 / P21 Esercitazioni e Allenamento* — stesso motore: quiz rapido con spiegazione, contatore «Oggi 4/10» per il gratuito, ripasso errori e simulazione con lucchetto Plus.
- *P13 Libretto* — voti con CFU, media ponderata, calcolatore del voto di laurea (regole v5).
- *P41 Piano e acquisti* — tre schede: *Il tuo piano* (sblocchi e tabella «cosa puoi fare adesso»), *Offerte* (pacchetto semestre e Plus come nella C, poi le card dei piani), *Ordini*.
- *P42 Profilo* — form della A, *scelta del colore del cerchio*, «Come funziona l'area», rifai il primo accesso, esci.

// ---------------------------------------------------------------- 6
#cap("6", "Aree, percorsi e piani", "la divisione tra Economia, Giurisprudenza, Medicina e tutte le prossime")

Nelle demo le tre cose erano mescolate (la A usava i percorsi, la D gli atenei, la C i piani). La v2 le separa in *tre livelli indipendenti*:

#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  box-crema(fill: ar2)[*1 · Area di studio* \ _Cosa studi._ Economia, Giurisprudenza, Medicina, … Decide catalogo, corsi, strumenti, colore. Stato: attiva · in arrivo · proposta. Sotto: l'ateneo (oggi solo UniFi). Si sceglie nel primo accesso, si cambia dal profilo.],
  box-crema(fill: nvt)[*2 · Percorso* \ _In che momento sei._ Test Prep (prima) · Studio (durante) · Futuro (dopo). Uguale per ogni area. Si cambia dal riquadro in cima alla sidebar, senza perdere dati.],
  box-crema(fill: crema2)[*3 · Piano* \ _Cosa è sbloccato._ Gratuito · Appunti · Dispensa · Semestre · Plus. Non cambia il menu: mette lucchetti e sblocchi dentro le pagine. Si cambia da «Piano e acquisti».],
)

#sub[Come nasce il menu]
Ogni voce (UL\_MODULI) dichiara *in quale percorso* sta e *in quali aree ha contenuto*. Se l'area non è attiva la voce resta visibile con «presto» e apre lo stato onesto «in arrivo» con lista d'attesa e «Costruiscila con noi». Esempi: *Medicina × Test Prep* = semestre filtro; *Economia × Futuro* = magistrali ed Erasmus; *Giurisprudenza × Studio* = esami e piano funzionanti, materiali «in arrivo».

#sub[Aggiungere o accendere un'area]
+ Una riga in UL\_AREE con stato «in\_arrivo»: compare nel primo accesso e nel profilo, raccoglie la lista d'attesa.
+ Quando parte: stato «attiva», dispense con Area = slug, slug aggiunto ai moduli che hanno contenuto.
+ Più atenei: righe in «atenei» dell'area. Nessuna pagina nuova da disegnare.

#sub[Le regole dei piani (un solo punto: accesso() in app.js)]
#tab((34%, 13%, 13%, 13%, 13%, 14%),
  [Funzione], [Gratuito], [Appunti], [Dispensa], [Semestre], [Plus],
  [Estratti di tutte le dispense], [Sì], [Sì], [Sì], [Sì], [Sì],
  [Una dispensa completa a scelta], [Sì], [—], [—], [—], [—],
  [Dispensa completa (appunti, mappe, quiz)], [—], [solo appunti], [Sì, 1 esame], [Sì, il semestre], [—],
  [Quiz], [10 al giorno], [10 al giorno], [illimitati], [illimitati], [illimitati],
  [Ripasso errori · simulazione], [—], [—], [—], [—], [Sì],
  [Piano guidato · confronto CV], [—], [—], [—], [—], [Sì],
  [Prezzo (ipotesi HQ)], [0 €], [5–8 €], [12–15 €], [25–30 €], [da decidere],
)
Gli acquisti si sommano; Plus apre gli strumenti, non le dispense. Tutto è un'ipotesi da validare in call (D05).

#sub[Gli account demo: una combinazione per ognuno]
#tab((18%, 82%),
  [Account], [Cosa mostra],
  [Giulia], [Economia · Studio · Gratuito, dispensa gratuita già usata (Microeconomia).],
  [Marco], [Economia · Studio · ha comprato la Dispensa completa di Statistica.],
  [Sara], [Economia · Studio · Pacchetto semestre (II anno, I semestre).],
  [Luca], [Economia · Futuro · Plus: tutto sbloccato, confronto CV.],
  [Elena], [Giurisprudenza · area in arrivo: esami funzionano, materiali «presto».],
  [Pietro], [Maturando · Test Prep · TOLC-E.],
  [Nuovo account], [Il primo accesso completo in 7 passi.],
)

// ---------------------------------------------------------------- 7
#cap("7", "La sezione «Da decidere»", "tutte le idee aperte, ognuna con la sua architettura demo")

Nella v2 alcune proposte sono già visibili nella app come *ipotesi* (Esercitazioni, Piano e acquisti, Test Prep): la card resta qui finché il punto aperto (listino, banca domande…) non è deciso, e un pulsante «Vedi nella app» porta alla pagina o all'account demo giusto.

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
  [D01], [Area Giurisprudenza attiva], [Aree], [In arrivo], [Tutte le pagine (account Elena)],
  [D02], [Area Medicina attiva], [Aree], [In arrivo], [Test Prep = semestre filtro],
  [D03], [Banca domande e simulazioni], [Studio], [In arrivo], [Esercitazioni e Allenamento],
  [D04], [Piano guidato], [Studio], [In arrivo], [Il mio piano · Organizza sessioni],
  [D05], [Listino: prezzi, pacchetti, Plus], [Piani], [Nuova], [Piano e acquisti + lucchetti],
  [D06], [Lettore protetto], [Studio], [Nuova], [Materiali → Leggi],
  [D07], [Raccolta domande d'esame], [Community], [In sviluppo], [Card in Oggi dopo un appello],
  [D08], [Community e gruppi di studio], [Community], [Nuova], [Scheda «Gruppi» dentro I miei esami],
  [D09], [Career: CV e Career Score], [Futuro], [Nuova], [Carriere e CV],
  [D10], [Borse di studio], [Orientamento], [Nuova], [Guide (Studio e Futuro)],
  [D11], [Guida tesi], [Futuro], [Nuova], [Libretto e obiettivi],
  [D12], [Test Prep: quali test], [Orientamento], [Nuova], [Percorso Test Prep (account Pietro)],
)

#sub[Come una card diventa sicura (stessa scala della landing)]
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  box-crema(fill: ar2)[*Da decidere* \ Solo nella sezione arancio, visibile al team.],
  box-crema(fill: crema2)[*Decisa · in costruzione* \ Resta la card, con lo storico «decisa il …». Nella app: nessuna traccia, oppure una riga «in arrivo».],
  box-crema(fill: nvt)[*Sicura* \ Entra nella sua pagina senza etichetta «ipotesi». La card esce dalla sezione arancio (resta nel registro).],
)
Le quattro domande prima di promuovere una card: *esiste davvero?* *per chi?* (un hub, tutti) *cosa togliamo?* (regole del cap. 12) *come misuriamo?* (un evento, cap. 10).

// ---------------------------------------------------------------- 8
#cap("8", "Design system", "i token della demo A e i componenti della app")

#sub[Colori, font, misure (app.css · sezione 1)]
#tab((26%, 74%),
  [Token], [Valore],
  [Colori brand], [Navy \#172554 · crema \#f4f1ea · arancio \#cf7527 · verde \#1a453c (come nella A).],
  [Superfici], [Fondo \#f6f7fa · card bianche · linee \#e2e5ed / \#ccd2df · testo secondario \#646b7b.],
  [Stati], [Arancio chiaro \#fff0df / testo \#8b4616 (in arrivo, lucchetti, Da decidere) · verde chiaro \#e3efe6 (attivo, completa).],
  [Font], [Titoli *Croogla* (h1 con il punto finale: «I miei esami.») · testo *Inter* 15 px. --font-testo per tornare a solo Croogla.],
  [Forme], [Card raggio 22 px · bottoni a pillola alti 43 px · sidebar 242 px · testata 78 px.],
  [Cerchio persona], [38 px in testata, 56 px nel menu e nel profilo; iniziali in Croogla su colore scelto tra 8 tinte (profilo → «Il tuo cerchio»).],
)

#sub[Due linguaggi distinti]
Sezioni dello studente: card bianche, bordo pieno, guida navy. Sezione di lavoro (Da decidere, Configurazione): *arancio tratteggiato*, sempre etichettata «Architettura demo · non decisa».

#sub[Componenti (nomi da usare nelle richieste)]
#tab((27%, 45%, 28%),
  [Componente], [Cosa è], [Dove],
  [WA/Sidebar], [Logo, riquadro percorso, gruppi di voci, sezione di lavoro, persona.], [Sempre],
  [WA/Percorso], [Il riquadro «Il tuo percorso» con pallino dell'area.], [Sidebar],
  [WA/Testata], [Percorso, data, Nuova attività, cerchio.], [Sempre],
  [WA/Cerchio + WA/MenuPersona], [Iniziali e colore; menu account.], [Testata, sidebar, profilo],
  [WA/Sottobarra], [Riassunto demo e pillola DA DECIDERE.], [Sotto la testata],
  [WA/Passo], [Card navy del prossimo passo.], [P01],
  [WA/Numero], [Valore grande + etichetta.], [P01, P13, P20],
  [WA/CardEsame], [Card A con meta e barra argomenti.], [P10],
  [WA/CardMateriale], [Copertina vera, stato, segnalibro, azioni.], [P11, P40],
  [WA/Lettore], [Schede appunti/mappe/quiz, velo «solo estratto».], [P11],
  [WA/Quiz], [Domanda, opzioni, spiegazione, contatore.], [P12, P21],
  [WA/Settimana], [Sette giorni con attività colorate per percorso.], [P02],
  [WA/Lucchetto], [Etichetta «Con Plus · ipotesi» e velo.], [Ovunque serva],
  [WA/Piano], [Card di un piano con prezzo e inclusioni.], [P41, primo accesso],
  [WA/Sblocchi], [Riepilogo stile C.], [P01, P41],
  [WA/Scelta], [Card selezionabile (area, percorso, piano).], [Primo accesso],
  [WA/InArrivo], [Stato onesto con lista d'attesa.], [Aree in arrivo],
  [WA/Rimando, WA/CardDecidere, WA/Schermo], [Collegamenti e mini demo «Da decidere».], [P90],
)

// ---------------------------------------------------------------- 9
#cap("9", "La configurazione", "config.js: l'unico file da toccare per cambiare cosa c'è")

#tab((22%, 46%, 32%),
  [Blocco], [Campi], [Esempio di modifica],
  [UL\_AREE], [slug, nome, stato, colore, tinta, atenei, corsi, test, domanda lista d'attesa, card collegata.], [Aggiungere «Ingegneria» in arrivo.],
  [UL\_PERCORSI], [id, nome, quando, icona, descrizione.], [Rinominare «Futuro».],
  [UL\_MODULI], [id, nome, icona, percorso, aree con contenuto, posizione nella barra in basso.], [Spostare Erasmus in Studio.],
  [UL\_PIANI], [id, nome, tipo, prezzo (ipotesi), cosa sblocca, cosa include.], [Cambiare un prezzo o un'inclusione.],
  [UL\_STRUMENTI], [id, nome, desc, aree, tipo (interno/link), url.], [Un nuovo calcolatore.],
  [UL\_DOMANDE], [esame, domanda, opzioni, giusta, spiegazione.], [Aggiungere domande (D03).],
  [UL\_PERSONE], [Account demo: area, percorso, piano, acquisti, esami, libretto, colore.], [Un account per una nuova combinazione.],
  [UL\_DA\_DECIDERE], [id, titolo, gruppo, stato, problema, proposta, dove, vedi, schermata, serve, domande, storico.], [Una nuova idea = D13.],
)
Le regole dei piani stanno in *un solo punto*, la funzione accesso() di app.js: «materiale», «quiz», «ripasso», «simulazione», «piano\_guidato», «cv\_confronto». Il limite dei quiz gratuiti è LIMITE\_QUIZ.

#sub[La pagina Configurazione (P91)]
Mostra le quattro tabelle lette da config.js: aree, moduli × percorsi × aree, piani × funzioni, account demo (con «Entra»). Serve al team per capire *come è configurata* la app senza aprire il codice, e per verificare una modifica appena fatta.

#sub[I blocchi della mini demo «Da decidere»]
hero · navy · stats · cards · list · steps · form · progress · prezzi · chips · nota. Un'idea che richiede altro aggiunge un tipo di blocco in app.js (BLOCCHI) e una riga qui.

#sub[I file]
#tab((24%, 76%),
  [File], [Cosa contiene],
  [index.html], [Il guscio vuoto.],
  [config.js], [Tutto ciò che si cambia senza toccare il design.],
  [app.js], [Pagine (P.oggi, P.esami…), regole accesso(), primo accesso, blocchi, eventi. Indice in testa al file.],
  [app.css], [1 token · 2 base · 3 guscio · 4 componenti · 5 accesso · 6 piani e lucchetti · 7 Da decidere · 8 telefono.],
  [dispense.js, img/, fonts/], [34 dispense e copertine vere (come la landing), loghi, Croogla.],
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
  [profili], [id (utente), nome, cognome, email, hub, corso, anno, media, consensi, creato\_il], [Solo il proprietario],
  [esami\_utente], [utente, dispensa (o nome libero), data\_appello, obiettivo, argomenti, fatti], [Solo il proprietario],
  [salvate], [utente, dispensa], [Solo il proprietario],
  [lista\_attesa], [email, hub, risposta, consenso, origine (landing/app), data], [Solo il team],
  [dispense], [slug, nome, codice, anno, sem, modalità, tipi, area, copertina, hub, aggiornata\_il], [Tutti (lettura)],
  [hub, strumenti], [Come config.js (e come hub.csv / tools.csv della landing)], [Tutti (lettura)],
  [eventi], [utente, tipo, dettagli, data], [Solo il team (misure)],
)
Le tabelle dispense, hub e strumenti si caricano dagli stessi CSV della landing: *una sola fonte* per sito e app.

#sub[Cosa misuriamo]
#tab((30%, 70%),
  [Evento], [Quando],
  [accesso], [Lo studente entra (base degli studenti attivi settimanali, la North Star).],
  [apri\_dispensa / salva\_dispensa], [Apertura o salvataggio di una dispensa (slug).],
  [aggiungi\_esame / argomento\_fatto], [Uso di «I miei esami»: misura se il prossimo passo serve.],
  [usa\_strumento], [Calcolatore o link a uno strumento (id).],
  [lista\_attesa], [Iscrizione a un hub in arrivo (slug): decide quale hub parte prima.],
)

#sub[Privacy, senza complicarsi]
Informativa chiara al primo accesso; email usata solo per l'accesso e per gli avvisi scelti; nessuno vede cosa scarichi; profilo privato; «scarica i miei dati» ed «elimina l'account» nel Profilo. Il consenso della lista d'attesa è separato.

// ---------------------------------------------------------------- 11
#cap("11", "Fasi di sviluppo", "dalla demo alla app vera, un pezzo alla volta")

#tab((16%, 44%, 40%),
  [Fase], [Cosa], [Pronta quando],
  [0 · Demo (ora)], [Demo v2, sezione Da decidere, Configurazione, PDF. Decisioni in call.], [Approvata dal team.],
  [1 · MVP], [Accesso via email, primo accesso, profilo (area, percorso, colore), Oggi, Il mio piano, I miei esami, Materiali (estratti + dispensa gratuita + link al sito), Libretto, liste d'attesa delle aree, eventi. «Accedi» nella navbar della landing.], [10 studenti di Economia la usano per una settimana senza aiuto.],
  [2 · Piani], [Listino deciso (D05), Stripe, lettore protetto (D06), Esercitazioni con banca vera (D03).], [Sondaggio prezzi fatto, soggetto legale pronto.],
  [3 · Percorsi e aree], [Futuro completo, Test Prep (D12) se deciso, prima area nuova (D01 o D02).], [Iscritti in lista e studenti disposti a costruirla.],
  [Visione], [Più atenei sotto ogni area, Career, community.], [Quando i numeri lo giustificano.],
)

#sub[Struttura del codice nella app vera]
#box-crema[#set text(size: 8.4pt)
`app/(spazio)/oggi` · `piano` · `esami` · `materiali` · `pratica` · `libretto` · `test` · `magistrali` · `abbonamento` · `profilo` · `app/accedi` · `app/benvenuto/[passo]` \
`config/` aree, percorsi, moduli, piani (gli stessi campi di config.js) · `lib/accesso.ts` (le regole dei piani) \
`components/WA/` i componenti del cap. 8 · `supabase/` tabelle e regole di sicurezza]

// ---------------------------------------------------------------- 12
#cap("12", "Regole anti-sovraccarico", "come crescere senza riempire")

- *Massimo quattro voci per percorso*, più Oggi e Il mio piano. Una nuova voce entra solo uscendo un'altra, o dentro una voce esistente.
- *Il percorso filtra*: chi studia non vede Test Prep e Futuro finché non li sceglie.
- *Un prossimo passo* in «Oggi», mai una bacheca.
- *Lucchetti onesti*: dicono cosa sbloccano e con cosa; mai prezzi barrati, mai urgenza artificiale.
- *Ogni novità ha un evento* (cap. 10). Se dopo un mese nessuno la usa, torna in «Da decidere».

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
  [Questo documento], [architettura/UniLink\_Architettura\_WebApp.pdf (sorgente Typst accanto)],
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

Ogni richiesta ha un *tipo*. Basta nominarlo con il codice della pagina (P…), della card (D…), del componente (WA/…) o del blocco di configurazione (UL\_…).

#tab((17%, 35%, 48%),
  [Tipo], [Cosa dici (esempio)], [Cosa faccio],
  [A · Nuova idea], [«Nuova idea: promemoria via email il giorno prima dell'appello.»], [Creo la card *D13* in Da decidere con le otto parti. Nessuna pagina dello studente cambia.],
  [B · Modifica una card], [«In D03 aggiungi la simulazione con punteggio in trentesimi.»], [Aggiorno mini demo e storico di D03.],
  [C · Promuovi], [«D03 è decisa.»], [La porto nella sua pagina senza «ipotesi», aggiorno UL\_MODULI e i cap. 4–6; la card esce con «decisa il …».],
  [D · Modifica una pagina], [«In P01 Oggi metti gli sblocchi prima del piano.»], [Modifico la pagina; se cambia la struttura aggiorno il cap. 5.],
  [E · Grafica], [«WA/Cerchio: più grande in testata.»], [Modifico il componente in app.css: vale ovunque.],
  [F · Area], [«Aggiungi Ingegneria in arrivo» / «Accendi Giurisprudenza».], [Riga in UL\_AREE (e card D collegata).],
  [G · Percorso o modulo], [«Sposta Erasmus in Studio.»], [Riga in UL\_MODULI; controllo la regola delle quattro voci.],
  [H · Piani], [«Il gratuito dà 5 quiz al giorno» / «Plus include le dispense».], [UL\_PIANI e accesso(); aggiorno la tabella del cap. 6.],
  [I · Account demo], [«Aggiungi un account Medicina con Plus.»], [Riga in UL\_PERSONE: compare nel login e in Configurazione.],
  [L · Primo accesso], [«Al passo 4 chiedi anche la sede.»], [Modifico il passo in app.js (benvenuto) e il cap. 5.],
  [M · Ripristina], [«Riporta la web app alla v1.»], [Riporto la cartella al tag webapp-v1, push, nuova versione nello storico.],
  [N · Rimuovi], [«Togli D12.»], [La card esce dalla sezione; resta nel registro.],
)

#sub[Cosa succede dopo ogni richiesta]
Nuova versione della demo (numero in UL\_VERSIONE e nella sottobarra) → backup automatico → in HQ, Laboratorio AI → DEMO, compare la versione con la nota. Se cambia l'architettura aggiorno anche questo PDF.
#nota[Se un'idea è ambigua chiedo il tipo: «la metto in Da decidere (A) o la vuoi già nella app (C)?». Senza decisione, un'idea va sempre in Da decidere.]

// ---------------------------------------------------------------- 15
#cap("15", "Checklist e decisioni aperte", "prima di passare alla fase 1")

#sub[Da decidere in call]
#tab((32%, 68%),
  [Tema], [Serve decidere],
  [Approvazione], [Base grafica A, i tre livelli, le voci per percorso.],
  [Font], [Testo in Inter (come la A) o solo Croogla (come la landing)?],
  [Gratuito], [Una dispensa completa gratis e 10 quiz al giorno: confermati?],
  [Listino], [Prezzi e Plus (D05) dopo il sondaggio.],
  [Percorsi], [Test Prep e Futuro già nella fase 1 o dopo?],
  [Prima area nuova], [Dopo 3–4 settimane di lista d'attesa (landing + app).],
)

#sub[Checklist della fase 1]
- Progetto Supabase separato dall'HQ, tabelle del cap. 10 con regole di sicurezza; campo percorso e colore nel profilo.
- Accesso via email provato su telefono; primo accesso completo in meno di due minuti.
- Pagine provate a 390 px; nessun prezzo senza «ipotesi» finché non è deciso.
- Sezione di lavoro e account demo spenti per gli studenti.
- Informativa privacy, consensi separati, «elimina account».

// ---------------------------------------------------------------- 16
#cap("16", "Demo grafiche", "render della demo v2 · dati di esempio")

#img("img/giulia_oggi.png", didascalia: [P01 · Oggi (Giulia, Gratuito): sidebar A con «Il tuo percorso», cerchio con iniziali e colore in alto a destra.])
#img("img/accedi.png", w: 62%, didascalia: [P00 · Accesso della A con gli account demo.])
#pagebreak()
#grid(columns: (1fr, 1fr), gutter: 10pt,
  img("img/onb2.png", didascalia: [Primo accesso · passo 2: area di studio.]),
  img("img/onb7.png", didascalia: [Primo accesso · passo 7: come iniziare.]))
#img("img/int_avatar.png", didascalia: [Menu del cerchio persona.])
#pagebreak()
#img("img/giulia_materiali.png", didascalia: [P11 · Materiali: copertine vere, stato per piano, «Usa la dispensa gratis».])
#img("img/int_lettore.png", didascalia: [Lettore: estratto e velo «solo estratto».])
#pagebreak()
#img("img/giulia_abbonamento_tab_offerte.png", didascalia: [P41 · Piano e acquisti → Offerte (struttura C, prezzi «ipotesi»).])
#img("img/int_quiz.png", didascalia: [P12 · Esercitazioni: quiz rapido con contatore del gratuito.])
#pagebreak()
#grid(columns: (1fr, 1fr), gutter: 10pt,
  img("img/pietro_oggi.png", didascalia: [Pietro · Test Prep.]),
  img("img/luca_oggi.png", didascalia: [Luca · Futuro · Plus.]),
  img("img/elena_oggi.png", didascalia: [Elena · Giurisprudenza in arrivo.]),
  img("img/elena_materiali.png", didascalia: [Materiali «in arrivo» con lista d'attesa.]))
#pagebreak()
#img("img/giulia_configurazione.png", didascalia: [P91 · Configurazione: le tabelle di config.js.])
#img("img/giulia_decidere.png", didascalia: [P90 · Da decidere.])
#pagebreak()
#grid(columns: (1fr, 1fr, 1fr, 1fr), gutter: 8pt,
  img("img/m_accedi.png", didascalia: [Accesso]), img("img/m_oggi.png", didascalia: [Oggi]),
  img("img/m_materiali.png", didascalia: [Materiali]), img("img/m_menu.png", didascalia: [Menu]))
#img("img/hq_demo_d.png", w: 74%, didascalia: [HQ · Laboratorio AI → DEMO: anteprima, download e storico delle versioni.])
