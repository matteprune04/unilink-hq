// UniLink · Architettura della landing (v2) — sorgente Typst
// Compilare dalla radice del repository:
//   python -c "import typst; typst.compile('architettura/landing/architettura.typ', output='architettura/UniLink_Architettura_Landing.pdf', root='.', font_paths=['.'])"
// Le immagini (img/) sono screenshot della demo: si rigenerano con le demo in esecuzione (vedi demo-landing/LEGGIMI.md).

#let navy = rgb("#172554")
#let crema = rgb("#f4f1ea")
#let arancio = rgb("#cf7527")
#let ar2 = rgb("#f6e4d1")
#let ar3 = rgb("#a95d1c")
#let crema2 = rgb("#ebe4d5")
#let nv2 = rgb("#4b5675")
#let linea = rgb("#e2dccf")
#let nvt = rgb("#dfe4f1")

#set document(title: "UniLink — Architettura della landing", author: "UniLink")
#set text(font: "Croogla 4F", size: 9.6pt, fill: navy, lang: "it")
#set par(leading: 0.62em, justify: false)
#show strong: set text(fill: navy)

#let versione = "v3 · 6 ottobre 2026"

#set page(paper: "a4", margin: (x: 18mm, top: 20mm, bottom: 18mm),
  header: context { if counter(page).get().first() > 1 [
    #set text(size: 7.5pt, fill: nv2)
    UniLink · Architettura della landing #h(1fr) #versione
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
#let sicura = tag("Deciso", f: navy, c: crema)
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
  #grid(columns: (auto, auto), gutter: 8pt, align: horizon, image("../../demo-landing/img/logo-white.png", width: 26pt), text(size: 22pt)[unilink])
  #v(1fr)
  #text(size: 8pt, fill: arancio, tracking: 0.16em)[ARCHITETTURA DI DESIGN · LANDING]
  #v(10pt)
  #text(size: 40pt)[La landing \ di UniLink, v3.]
  #v(14pt)
  #text(size: 11pt)[Prima · Durante · Dopo. \ Strumenti dentro la demo, schermate reali dell'area personale, \ nove schede «Da decidere» con architettura completa, \ commenti del team, accessibilità verificata, versione tablet. \ Pensato per essere usato come contesto: ogni pagina, card e componente ha un codice.]
  #v(1fr)
  #set text(size: 8pt)
  #grid(columns: (1fr, 1fr, 1fr), gutter: 10pt,
    [Versione 3 \ 6 ottobre 2026], [Per i founder \ Matteo, Cosimo, Niccolò, Gianmarco], [Demo e backup \ repository unilink-hq · demo-landing/])
]

// ---------------------------------------------------------------- in breve
#block(below: 4pt, text(size: 21pt)[In breve])
#block(below: 12pt, spaziato("cosa trovi in questo documento"))

Questo PDF è la mappa completa della landing v2: cosa contiene, perché è fatta così, come si trasforma in Framer e *come si chiede una modifica alla demo*. È il gemello del PDF della web app (e dei PDF «Schede Da decidere» e «Commenti»): stessi colori, stesso font, stesso principio «tutto da dati».

#sub[Come usarlo come contesto]
Quando chiedi una modifica alla demo, nomina il *codice* (pagina S01…, sezione H04…, card L01…, componente LP/…) e il *tipo* di richiesta (cap. 13). Così è chiaro dove va, come si fa e perché. Lo stesso contenuto, in forma compatta per l'AI, è in `architettura/CONTESTO_DEMO.md`.

#sub[Le decisioni (6/10/2026)]
#tab((26%, 74%),
  [Tema], [Decisione],
  [Base grafica], [*Resta la v1*: crema, navy, arancio, solo Croogla, parola accento sottolineata a mano, hero con nastro e collage, numeri reali di Google. Le parti principali non cambiano.],
  [Navigazione], [Hub ▾ · Prima ▾ · Durante ▾ · Dopo ▾ · Strumenti · Community, più la pillola arancio «Da decidere» e il pulsante «Area personale». Niente «Dispense», niente «Chi siamo» in barra.],
  [Dispense], [Tolte dalla barra e dalle pagine: vivono nell'*area personale*. In home resta il carosello di anteprima, che apre l'area (non più il sito attuale).],
  [Strumenti], [Dentro la demo, funzionanti, per hub. *Nessun link al sito attuale.* Rapidi in landing, completi (salvati nel profilo) nell'area personale.],
  [Area personale], [Anteprima in home e pagina dedicata con una *galleria di 19 schermate reali* della web app, in desktop / tablet / telefono. Solo da guardare (con ingrandimento): nessun riquadro vivo, nessun dato che si modifica.],
  [Da decidere], [Una voce arancio in barra: 9 card (L01–L09). Ognuna ha l'*architettura completa*: pagine intere annotate, dati e campi, regole e stati, testi, misure, manutenzione, piano di lavoro con stime, rischi, prompt per l'AI (cap. 9 e PDF «Schede Da decidere»).],
  [Commenti], [Pulsante «Commenti» su ogni pagina: si commenta la pagina o una sezione; i commenti restano salvati e si scaricano in *PDF, Markdown o JSON* da dare all'AI (cap. 16).],
  [Ottimizzazione], [Accessibilità verificata con axe (da 292 problemi a 0), immagini alleggerite (loghi da 3,4 MB a 40 KB), primo accesso più chiaro: rassicurazioni, briciole, spiegazione di «hub», barra con un solo pulsante su telefono (cap. 17).],
  [Dispositivi], [Desktop, *tablet (701–1100 px)* e telefono (≤ 700 px), tutti disegnati e verificati.],
  [Listino], [Si cambia da un punto solo (`UL_CFG.prezzi`); la pagina Prezzi non è in barra finché non è deciso.],
  [Demo e backup], [GitHub Pages `/demo-landing/` e `/demo-webapp/`; a ogni push ZIP + Release + riga nel registro; in HQ, Laboratorio AI → DEMO.],
)

#sub[Come è organizzato]
#tab((34%, 66%),
  [Capitolo], [A cosa serve],
  [1–3 · Punto di partenza, cosa cambia, principi], [Da dove partiamo, cosa tengo / cambio / tolgo dalla v1, le regole di design.],
  [4–6 · Struttura, pagine, dispositivi], [Mappa del sito, sezione per sezione, desktop / tablet / telefono.],
  [7–8 · Strumenti e area personale], [Il registro strumenti, quali costruire, l'anteprima dell'app.],
  [9 · Da decidere], [Le 9 card con il mio consiglio per ognuna.],
  [10–12 · Design system, configurazione, demo e backup], [Token, componenti, `config.js`, passaggio a Framer, dove sta tutto.],
  [13 · Come chiedere modifiche], [Il vocabolario: cosa dici, cosa succede.],
  [14–15 · Roadmap e osservazioni], [Breve / medio / lungo termine con i punti da cui ripartire; cosa tenere, cosa è superfluo, cosa manca.],
  [16 · Commenti del team], [Come si commenta, cosa viene salvato, come si scarica e si passa all'AI.],
  [17 · Ottimizzazione e prima visita], [Cosa è stato misurato e cosa è cambiato; come ripetere le verifiche.],
  [18 · Demo grafiche], [Render desktop, tablet e telefono, commenti e schede.],
)

// ---------------------------------------------------------------- 1
#cap("1", "Il punto di partenza", "cosa abbiamo e cosa no al 6 ottobre 2026")

#sub[Cosa abbiamo]
- *Hub Economia attivo*: 34 dispense (EA ed EC) con copertina, codice, anno, semestre e modalità d'esame.
- *Numeri reali* (Google Analytics 4 e catalogo, 8 set – 5 ott 2026): *876* persone nell'ultimo mese, *7.855* pagine in 28 giorni, *34* esami con la dispensa. Sono l'unico «social proof» che usiamo.
- *Calcolatore del voto di laurea* con regole v5 (media × 110/30, +0,333 per lode, tesi +1…+3, in corso +2, lode con presentazione ≥ 104,5 e tesi Ottima).
- *Gruppo WhatsApp* come canale principale di community e *ambassador* già attivi.
- *Web app demo* dell'area personale (PDF gemello) e *HQ* con Laboratorio AI → DEMO.
- *Giurisprudenza e Medicina* previsti come prossimi hub, già nella struttura come «in arrivo».

#sub[Cosa ci dicono i numeri]
Tre visitatori su quattro arrivano da smartphone, quasi sempre da un link su WhatsApp: ogni pagina si disegna prima a 390 px. Il tablet è il formato meno frequente ma il più ambiguo da progettare: per questo ha regole sue (cap. 6).

#sub[Cosa non abbiamo ancora]
Nessun materiale né studente nel team per Giurisprudenza e Medicina; listino non deciso; nessuna pagina legale (privacy, cookie, termini); foto proprie del team; backend per la lista d'attesa. Per questo la v2 mostra *solo ciò che è deciso come sarà davvero* e tutto il resto va in «Da decidere» (cap. 9).

#nota[Regola HQ: una demo non dimostra che un servizio esiste. Testi, date, prezzi e feedback di esempio sono sempre etichettati come tali.]

// ---------------------------------------------------------------- 2
#cap("2", "Cosa tengo, cosa cambia, cosa tolgo", "dalla v1 alla v2, con il perché")

#tab((20%, 16%, 30%, 34%),
  [Elemento], [v1], [v2], [Perché],
  [Hero con nastro e collage], [c'era], [*invariato*], [È l'identità visiva: la parte più riconoscibile.],
  [Numeri reali di Google], [c'erano], [*invariati*, letti da config], [Numeri veri battono frasi inventate.],
  [Tre hub (Economia / Giurisprudenza / Medicina)], [c'erano], [*invariati*], [È la promessa di espansione.],
  [«Parti da dove sei»], [4 scelte], [*invariato*, link ora interni], [Scorciatoia verso Prima / Durante / Dopo.],
  [Come funziona · Chi c'è dietro · FAQ], [c'erano], [*invariati* (una FAQ in più)], [Funzionano già.],
  [Carosello «Trova la tua dispensa»], [apre il sito attuale], [apre l'*anteprima nell'area personale*], [Le dispense vivono nell'area; la landing le mostra soltanto.],
  [Pagina «Dispense»], [c'era], [*tolta*], [Richiesta del team: le dispense sono area personale.],
  [Navbar], [Hub · Dispense · Tools · Chi siamo], [Hub · Prima · Durante · Dopo · Strumenti · Community + «Da decidere»], [Segue il percorso dello studente, non i prodotti.],
  [Tool], [1 funzionante + 3 link al sito], [*6 funzionanti* dentro la demo + 4 «solo area»], [Nessun link al sito attuale; uno strumento per corso.],
  [Voci degli studenti], [3 testimonianze di esempio], [*tolte* → card L09], [Testimonianze finte pubblicate sarebbero recensioni false.],
  [Pagina Prezzi], [fissa, in footer], [da config, *fuori dalla barra*], [Prezzi non decisi in primo piano confondono.],
  [Tablet], [non disegnato], [*disegnato* (701–1100 px)], [Il passaggio da desktop a telefono era ambiguo.],
  [Area personale], [assente], [*anteprima in home + pagina*], [Mostra cosa c'è dopo l'accesso.],
  [Da decidere], [assente], [*sezione arancio, 9 card*], [Separa ciò che è deciso da ciò che si discute.],
)

// ---------------------------------------------------------------- 3
#cap("3", "Principi di design", "le sette regole che decidono ogni scelta")

#grid(columns: (1fr, 1fr), gutter: 10pt,
  box-crema[*1 · Da studenti a studenti.* Frasi brevi, tu al singolo. Diciamo cosa c'è, cosa arriva e cosa no.],
  box-crema[*2 · Prima il telefono.* Si disegna a 390 px; poi tablet; poi desktop. Pulsanti alti almeno 44 px, testo almeno 14 px.],
  box-crema[*3 · Una cosa per volta.* Ogni sezione ha un solo compito e un solo pulsante principale. Più voci = più confusione.],
  box-crema[*4 · Deciso / da decidere.* Ciò che è deciso appare come sarà. Ciò che non lo è vive solo nella sezione arancio, sempre etichettato.],
  box-crema[*5 · Mai dati inventati come veri.* Numeri solo da fonti; testi, date, prezzi e regole di esempio con etichetta «Esempio».],
  box-crema[*6 · Tutto da dati.* Hub, fasi, listino, card e strumenti stanno in file di configurazione: cambiare = modificare una riga, non il design.],
  box-crema[*7 · Una parola accento.* Una sola parola per titolo in arancio con sottolineatura a mano: è la firma del brand, non va diluita.],
  box-crema(fill: ar2)[*Regola anti-sovraccarico.* In barra al massimo sei voci e una pillola. Una pagina nuova entra solo se qualcosa esce o confluisce in una voce esistente.],
)

// ---------------------------------------------------------------- 4
#cap("4", "Struttura del sito", "la navigazione e la mappa delle pagine")

#sub[La barra di navigazione]
#tab((22%, 78%),
  [Voce], [Cosa contiene],
  [Hub ▾], [Economia (attivo) · Giurisprudenza (in arrivo) · Medicina (in arrivo).],
  [Prima ▾], [Scegliere il corso · Come funziona l'università · Borse e tasse · Test d'ingresso.],
  [Durante ▾], [Il tuo semestre · Strumenti · Metodo e piano · Erasmus · La tua area personale.],
  [Dopo ▾], [Tesi e laurea · Magistrali e master · Carriera e CV.],
  [Strumenti], [Pagina con elenco per hub e pannello funzionante.],
  [Community], [Gruppo WhatsApp, ambassador, idee in valutazione.],
  [Da decidere (pillola arancio)], [Solo nella demo e nell'ambiente del team: indice delle card L01–L09.],
  [Area personale (pulsante)], [Anteprima della web app in tre dispositivi.],
)
#nota[*Perché Prima · Durante · Dopo.* Segue il percorso dello studente e vale per ogni hub: cambiano i contenuti, non la struttura. I nomi sono volutamente generici («Dopo», non «Dopo la triennale»): reggono Giurisprudenza (ciclo unico) e Medicina senza cambiare la barra. Il dropdown mostra le voci di ogni fase: chi arriva da una ricerca va diretto alla sezione giusta.]

#sub[Mappa delle pagine (i codici non cambiano)]
#tab((8%, 22%, 22%, 14%, 34%),
  [Codice], [Pagina], [File], [Stato], [Note],
  [S01], [Home], [index.html], [#sicura], [Sezioni H02–H12 (cap. 5).],
  [S02], [Hub Economia], [hub-economia.html], [#sicura], [Hub attivo: fasi, dispense per anno (anteprima), strumenti, community.],
  [S03], [Hub Giurisprudenza], [hub-giurisprudenza.html], [#sicura], [In arrivo: lista d'attesa, anteprima, strumenti di esempio.],
  [S04], [Hub Medicina], [hub-medicina.html], [#sicura], [Come S03; fase «Inizia» = semestre filtro.],
  [S05], [Prima], [prima.html], [#sicura], [Scegliere, come funziona, borse e test (rimandi L04, L05).],
  [S06], [Durante], [durante.html], [#sicura], [Semestre, strumenti, metodo (rimando L02), Erasmus.],
  [S07], [Dopo], [dopo.html], [#sicura], [Tesi, magistrali, carriera (rimandi L06, L03).],
  [S08], [Tesi e laurea], [tesi.html], [#sicura], [Checklist in 6 passi + voto di laurea.],
  [S09], [Strumenti], [tools.html], [#sicura], [Elenco per hub + pannello; «solo area» bloccati.],
  [S10], [Area personale], [area.html], [#sicura], [Galleria di 19 schermate reali della web app in tre formati, solo da guardare.],
  [S11], [Community], [community.html], [#sicura], [Gruppo per anno, ambassador, idee L01 e L03.],
  [S12], [Prezzi (esempio)], [prezzi.html], [#decid], [Letto da `UL_CFG.prezzi`; fuori dalla barra (L07).],
  [S13], [Commenti del team], [commenti.html], [#decid], [Rapporto di tutti i commenti, con esportazione. Solo demo.],
  [S90], [Da decidere], [decidere.html], [#decid], [Indice delle card; dettaglio con \#L01…L09 (architettura completa).],
)

// ---------------------------------------------------------------- 5
#cap("5", "Le pagine, sezione per sezione", "come saranno davvero")

#sub[S01 · Home]
#tab((8%, 20%, 52%, 20%),
  [N.], [Sezione], [Contenuto], [Dati],
  [H02], [Hero], [Etichetta «Da studenti, per studenti», titolo «Studia, orientati, *scegli.*», due pulsanti, nastro animato con collage di foto.], [testi],
  [H03], [Numeri reali], [Scheda navy inclinata: 876 · 7.855 · 34 + fonte «Google Analytics 4 e catalogo» con date.], [`UL_CFG.numeri`],
  [H04], [Hub], [Tre card (Economia attivo; Giurisprudenza e Medicina in arrivo con «Avvisami»).], [`UL_CFG.hub`],
  [H05], [Parti da dove sei], [Quattro scelte (matricola · esame · Erasmus · dopo); la risposta si cambia al clic. Link a Prima / Durante / Dopo.], [`FASI` in app.js],
  [H06], [Trova la tua dispensa], [Ricerca, filtri e carosello di copertine vere: ogni card apre l'anteprima nell'area personale.], [dispense (data.js)],
  [H06b], [La tua area personale], [Testo, quattro voci (Dashboard, Esercitazioni, I miei esami, Materiali), tre foto sovrapposte (desktop, tablet, telefono) generate dalla web app.], [img/area-\*.jpg],
  [H07], [Come funziona], [Tre passi e quattro garanzie.], [testi],
  [H08], [Strumenti], [Elenco + pannello funzionante (Economia, primi quattro).], [`UL_TOOLS`],
  [H09], [Chi c'è dietro], [Quattro founder.], [testi],
  [H11], [FAQ], [Cinque domande (compare «Dove trovo le dispense?»).], [testi],
  [H12], [Chiamata finale], [«Il prossimo esame parte da *qui.*» + WhatsApp + area personale.], [testi],
)
#nota[La sezione «Cosa dicono gli studenti» (H10) non c'è più: è la card L09 e si accende solo con feedback reali.]

#sub[S02–S04 · Hub]
*Economia (attivo)*: hero con foto e tre numeri; le tre fasi (Prima · Durante · Dopo) che rimandano alle pagine S05–S07; dispense per anno (anteprima con toggle I / II / III); strumenti dell'hub (pannello funzionante); community. *Giurisprudenza e Medicina (in arrivo)*: lista d'attesa (email, anno, consenso; in demo solo nel browser), le tre fasi tratteggiate «cosa vorremmo fare», «Costruiscilo con noi» (WhatsApp e ambassador) e gli strumenti di esempio dell'hub.

#sub[S05–S07 · Prima · Durante · Dopo]
#tab((14%, 43%, 43%),
  [Pagina], [Cosa c'è (deciso)], [Cosa rimanda a «Da decidere»],
  [Prima], [Scegliere il corso (3 domande), i tre hub, come funziona l'università (immatricolazione, piano di studi, CFU, appelli).], [Borse e tasse (L05) · Test d'ingresso (L04).],
  [Durante], [Il tuo semestre (4 azioni), strumenti rapidi funzionanti, piano per l'appello funzionante, Erasmus (punteggio di esempio + 3 passi).], [Metodo e piano di studio (L02).],
  [Dopo], [Tesi e laurea, voto di laurea, magistrali e master (4 criteri).], [Carriera e CV (L06) · Mentoring (L03).],
)
Le sezioni «da decidere» sono cartoncini con bordo *arancio tratteggiato*, etichetta «Da decidere · Lxx» e link alla card.

#sub[S08 · Tesi e laurea]
Checklist in sei passi (argomento, relatore, piano, scrittura, consegna, discussione) che *si ricorda cosa hai spuntato* (solo nel browser), due card di consigli, voce «Template e scadenze» bloccata *nell'area personale* e il calcolatore del voto di laurea. Le *cose effettive* (template, scadenze con promemoria) stanno nell'area; la landing dà consigli e checklist.

#sub[S09 · Strumenti]
Tre tab (Economia · Giurisprudenza · Medicina); a sinistra l'elenco, a destra il pannello navy con lo strumento funzionante. Gli strumenti con regole di esempio hanno il badge «Esempio»; quelli «solo area» sono voci tratteggiate con badge «Nell'area» (cap. 7).

#sub[S11 · Community]
Un gruppo WhatsApp per anno (I · II · III), sezione Ambassador (3 cose che fa; testi di esempio) e due rimandi a «Da decidere» (L01 gruppi di studio, L03 mentoring).

// ---------------------------------------------------------------- 6
#cap("6", "Dispositivi: desktop, tablet, telefono", "tre disegni, non uno che si adatta")

#tab((18%, 28%, 54%),
  [Formato], [Larghezza], [Come cambia],
  [Desktop], [≥ 1101 px], [Barra completa con dropdown e pillola arancio; contenuti a 1180 px; griglie a 3–4 colonne.],
  [*Tablet*], [*701–1100 px*], [Barra compatta (logo + menu a tutto schermo con le stesse voci); testo 74 px nei titoli; hub 2 + 1; dispense 2 per riga; fasi e prezzi a 3 colonne; strumenti e pannelli a una colonna.],
  [Telefono], [≤ 700 px], [Menu a tutto schermo; una colonna; collage ridotto; due dispense per riga; pulsanti a larghezza piena.],
)
#nota[*Perché il tablet è un caso a parte.* A 820 px il desktop è troppo largo (colonne strette, dropdown da hover che non funziona al tocco) e il telefono troppo piccolo (una colonna spreca spazio). La regola: *dal tablet in giù il menu è a tutto schermo*, e le griglie scalano a 2–3 colonne. *La web app v2 non segue ancora questo criterio*: ha breakpoint a 1100 e 860 px, quindi un tablet in verticale riceve il layout del telefono. Da allineare (cap. 15).]

#grid(columns: (1fr, 1fr, 1fr), gutter: 10pt,
  img("img/t_home.jpg", didascalia: [Tablet · home]),
  img("img/t_tools.jpg", didascalia: [Tablet · strumenti]),
  img("img/t_decidere.jpg", didascalia: [Tablet · Da decidere]),
)

// ---------------------------------------------------------------- 7
#cap("7", "Gli strumenti", "dentro la demo, uno per corso, aggiungibili in una riga")

Gli strumenti vivono in `tools.js`, dentro la demo. Oggi li usa solo la landing, ma sono scritti senza dipendenze per poter essere riusati nella web app (ne esiste una versione già collegata nel ramo `claude/landing-v2-completo`). Nessuno apre il sito attuale.

#tab((14%, 24%, 12%, 14%, 36%),
  [Hub], [Strumento], [Stato], [Dove], [Cosa fa],
  [Economia], [Voto di laurea], [live], [landing], [Regole v5. Media ponderata, lodi, tesi, in corso → voto di presentazione e finale; avviso sulla lode.],
  [Tutti], [Media e voto obiettivo], [live], [landing], [Media ponderata sui CFU e *media da tenere* nei CFU rimanenti per arrivare all'obiettivo (conto esatto).],
  [Tutti], [Piano per l'appello], [live], [landing], [Data, argomenti, giorni di ripasso → ritmo e calendario a regole semplici.],
  [Economia], [Punteggio Erasmus], [demo], [landing], [Formula di *esempio* (media, CFU, lingua). Da sostituire con il bando.],
  [Giurisprudenza], [Voto di laurea ciclo unico], [demo], [landing], [Base 110 e bonus tesi di *esempio*. Regole da verificare.],
  [Medicina], [Piano semestre filtro], [demo], [landing], [Settimane, ore e peso di Fisica / Chimica / Biologia → ore per materia.],
  [Economia], [Erasmus completo], [solo area], [area], [Punteggio e mete salvati nel profilo (pagina Erasmus della web app).],
  [Tutti], [Confronto CV], [solo area], [area], [Il CV contro un profilo tipo (L06 / D09).],
  [Tutti], [Template e scadenze tesi], [solo area], [area], [Modello impaginato e calendario (D11).],
  [Tutti], [Borse e scadenze], [solo area], [area], [Bandi con promemoria (L05 / D10).],
)
#nota[*live* = regole certe, pubblicabili. *demo* = funziona ma con regole di esempio: porta l'etichetta «Esempio» e il riquadro «Regole di ESEMPIO: da sostituire con quelle ufficiali prima del lancio». Non si pubblica come vero finché qualcuno non verifica il regolamento.]

#sub[Aggiungere uno strumento (3 minuti)]
+ In `tools.js`, una voce in `UL_TOOLS`: id, nome, desc, hub, stato, dove, icona.
+ Una funzione con lo stesso id in `IMPL`: disegna i comandi e aggiorna il risultato.
+ Compare da solo nell'elenco del suo hub (e nei tab di Strumenti). Se serve anche nella web app, la funzione si copia così com'è.

#sub[Quali strumenti costruire per gli altri corsi (il mio consiglio)]
#tab((16%, 44%, 40%),
  [Hub], [Candidati], [Giudizio],
  [Tutti], [Media e voto obiettivo, piano per l'appello], [*Già pronti*, regole certe. Portano traffico e fiducia.],
  [Economia], [Erasmus completo, confronto magistrali, simulatore del voto con esami futuri], [Utili: servono solo le regole ufficiali del bando e dei requisiti.],
  [Giurisprudenza], [Piano di studio sul codice (articoli e istituti al giorno), scadenze concorsi e pratica, voto di laurea ciclo unico], [Il piano sul codice è il più «da Giurisprudenza»: studiare un codice non è studiare un manuale.],
  [Medicina], [Piano semestre filtro, simulatore a tempo per materia, calendario appelli nazionali], [Il simulatore dipende dalla banca domande (D03): non prima.],
)
Regola: *prima gli strumenti con regole certe*; quelli con regole da verificare restano «Esempio» finché non c'è un responsabile che controlla ogni anno. La card L08 raccoglie questa discussione.

#grid(columns: (1fr, 1fr), gutter: 10pt,
  img("img/l_tools.jpg", didascalia: [S09 · Strumenti (desktop): elenco per hub e pannello funzionante.]),
  img("img/m_tools.jpg", didascalia: [Telefono · Strumenti: elenco sopra, pannello sotto.]),
)

// ---------------------------------------------------------------- 8
#cap("8", "L'area personale, in schermate reali", "una galleria da guardare, non una app da usare")

La sezione H06b della home mostra tre foto sovrapposte dell'area; la pagina S10 mostra una *galleria di 19 schermate reali* della web app demo (versione 3), scattate dalla web app vera con gli account demo. Sono immagini: non si può modificare niente e non c'è nessun riquadro vivo. Tocca la schermata per ingrandirla.

#tab((24%, 76%),
  [Parte], [Come funziona],
  [Selettori], [Cinque gruppi (*Studio · Durante*, *Il mio percorso · Dopo*, *Piano e account*, *Moduli da decidere*, *Accesso e aree in arrivo*), l'elenco delle schermate del gruppo e tre dispositivi (Desktop · Tablet · Telefono).],
  [Schermate], [19 schermate × 3 formati = 57 immagini WebP in `img/app/`. Ogni schermata ha titolo, account demo usato (es. Giulia · Economia · piano Gratuito, Luca · piano Plus) e una frase su cosa guardare.],
  [Perché immagini], [La landing non dipende più dalla web app che cambia mentre la guardi; funziona anche nello ZIP della sola landing e si carica prima.],
  [Indirizzo], [`area.html?dev=tab#percorso-erasmus` apre direttamente quella schermata in quel formato: utile per condividere un punto preciso.],
  [Nelle schede «Da decidere»], [Dove esiste una schermata vera (pagina dell'esame, quiz, abbonamento, area in arrivo, modulo Career) la scheda la usa nel mockup (blocco `appshot`), con il suo ingrandimento.],
  [Aggiornamento], [Quando la web app cambia: `node _src/screenshot_webapp.js` e `python _src/png_to_webp.py` rifanno i file (`<id>-desk.webp`, `-tab`, `-ph`). Se cambiano rotte o account, vanno aggiornati anche l'elenco nello script e `UL_CFG.schermate`.],
)
#nota[*Corrispondenza dei nomi.* La galleria mostra le due nomenclature insieme: le sezioni della web app v3 (Studio · Il mio percorso) e le fasi della landing (Prima · Durante · Dopo). Sono idee vicine ma non uguali: conviene sceglierne una sola (cap. 15). Alcune cose che la landing racconta non ci sono ancora nella web app: percorso Test Prep, calendario del piano, template tesi, borse.]

#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  img("img/l_area_desk.jpg", didascalia: [Desktop]),
  img("img/l_area_tab.jpg", didascalia: [Tablet]),
  img("img/l_area_ph.jpg", didascalia: [Telefono]),
)

#cap("9", "La sezione «Da decidere»", "tutte le idee aperte, ognuna con la sua architettura demo")

È la pillola arancio in barra (con il numero di card) e la pagina S90. Dentro, card raggruppate per tema, con bordo *arancio tratteggiato*. Ogni card aperta ha sempre le stesse parti, così si confrontano a colpo d'occhio:

#tab((24%, 76%),
  [Parte], [Cosa contiene],
  [Il problema / La proposta / Il consiglio], [Perché serve, cosa faremmo e il parere di Claude (da discutere: la decisione è del team).],
  [Panoramica], [Obiettivo, per chi, quando serve, stima di lavoro; e tre elenchi: versione minima (MVP), dopo, non lo facciamo.],
  [Pagine annotate], [Le pagine *intere* come sarebbero, in una finestra di browser. Ogni sezione ha un numero e una nota: *perché c'è* e *cosa puoi cambiare da solo*, con i componenti usati.],
  [Dati e campi], [Tabelle o collezioni: campo, tipo, esempio; chi le aggiorna e ogni quanto.],
  [Regole e stati], [Come si comporta la funzione e cosa vede lo studente in ogni situazione, con i testi.],
  [Testi, misure, integrazioni], [Testi proposti; eventi da misurare; strumenti da collegare; cosa far verificare (legale e privacy).],
  [Manutenzione], [Cosa tenere aggiornato dopo il lancio, da chi, ogni quanto, come.],
  [Piano di lavoro], [Passi numerati con dove si lavora e giorni stimati; totale.],
  [Rischi e successo], [Cosa può andare storto, come lo riduci, quali numeri dicono che funziona, regola di stop.],
  [Prompt per l'AI], [Il testo da incollare per far costruire la scheda, scritto come richiesta di tipo C. Con un pulsante «Copia».],
  [Azioni], [«Copia il prompt», «Scarica la scheda (.md)», «Stampa / salva PDF», barra interna per saltare tra le parti.],
)
#nota[*Dove stanno.* In demo: decidere.html, ogni card. Come documento: `architettura/UniLink_Schede_Da_Decidere.pdf` (69 pagine) e i file `architettura/schede/Lxx_*.md`, generati dagli *stessi dati* della demo (`demo-landing/decidere-arch.js`): se cambi una scheda, rigeneri tutto con `_src/build_schede.js`. Stime e soglie sono ipotesi; le note legali indicano cosa far verificare a un consulente, non sono pareri.]

#sub[Le card di oggi e il consiglio in una riga]
#tab((7%, 21%, 14%, 14%, 44%),
  [Cod.], [Titolo], [Gruppo], [Impatto / sforzo], [Consiglio],
  [L01], [Gruppi di studio], [Community], [3 / 3], [Sì, ma piccolo: un gruppo WhatsApp per esame gestito dagli ambassador; il matching dentro l'app solo se funziona.],
  [L02], [Metodo e piano di studio], [Metodo], [5 / 3], [Il differenziatore più forte: le dispense le hanno tutti, il metodo no. Parti dal piano a regole (già in demo), l'AI dopo.],
  [L03], [Mentoring tra pari], [Community], [4 / 5], [Non al lancio: è il più costoso da gestire. Prova manuale con 5 ambassador e 20 studenti.],
  [L04], [Test d'ingresso (TOLC)], [Orientamento], [5 / 5], [Dopo i nuovi hub: settore competitivo; per Medicina il semestre filtro è più concreto.],
  [L05], [Borse e tasse], [Orientamento], [4 / 4], [Alto valore, ma serve chi aggiorna le scadenze ogni anno: senza responsabile non pubblicarla.],
  [L06], [Carriera e CV], [Dopo], [4 / 2], [Quick win: contenuti scritti dal team. Niente promesse su opportunità senza partner.],
  [L07], [Listino e pacchetti], [Monetizzazione], [3 / 3], [Fuori dalla barra finché non è deciso. Se prezzo di lancio: mai il prezzo barrato.],
  [L08], [Quale hub parte per primo], [Hub], [5 / 4], [Decidi sui numeri veri della lista d'attesa. Medicina: obiettivo realistico 2027/28.],
  [L09], [Voci degli studenti], [Fiducia], [3 / 1], [Si accende con almeno tre feedback reali e consenso scritto; meglio un numero vero di tre frasi inventate.],
)

#sub[Come una card diventa «deciso»]
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  box-crema(fill: ar2)[*Da decidere* \ Solo nella sezione arancio.],
  box-crema(fill: crema2)[*Deciso · in costruzione* \ Resta la card con lo storico «deciso il …».],
  box-crema(fill: nvt)[*Deciso* \ Entra nella sua pagina; la card esce (resta nello storico).],
)
Quattro domande prima di promuoverla: *esiste davvero?* *per chi?* (un hub, tutti) *cosa togliamo?* (regola anti-sovraccarico) *come misuriamo?* (un evento).

#grid(columns: (1fr, 1fr), gutter: 10pt,
  img("img/l_decidere.jpg", didascalia: [S90 · indice delle card, per gruppo.]),
  img("img/l_decidere_L03.jpg", didascalia: [L03 · dettaglio: le parti fisse, il consiglio e la mini demo.]),
)

// ---------------------------------------------------------------- 10
#cap("10", "Design system", "i token della v1, più i componenti nuovi")

#sub[Colori e tipografia (invariati)]
Navy \#172554 (testo, scheda numeri, pannelli), crema \#f4f1ea (fondo), arancio \#cf7527 (accento, una parola per titolo, «Da decidere»), bianco (card), navy testo 2 \#4b5675, linea \#e2dccf, crema scuro \#ebe4d5, arancio chiaro \#f6e4d1, arancio scuro \#a95d1c (testo arancio piccolo), navy chiaro \#dfe4f1. Croogla 4F a un solo peso: la gerarchia si fa con dimensione e colore. Titolo hero 92 px (tablet 74, telefono 50); titolo sezione 54 (44, 36); testo 17 px.

#sub[Due linguaggi, ben distinti]
#tab((24%, 38%, 38%),
  [], [Pagine decise], [Da decidere],
  [Bordi], [Card bianche, ombra morbida.], [Bordo *tratteggiato* arancio.],
  [Colore guida], [Navy e crema.], [Arancio e arancio chiaro.],
  [Etichetta], [Nessuna.], [Sempre «Da decidere · Lxx» / «Architettura demo · non decisa».],
)

#sub[Componenti (nomi da usare nelle richieste)]
#tab((24%, 50%, 26%),
  [Componente], [Cosa è], [Dove],
  [LP/Navbar], [Pillola bianca con dropdown, pillola «Da decidere», pulsante area; menu a tutto schermo da tablet in giù.], [Tutte le pagine],
  [LP/Hero], [Etichetta, titolo con parola accento, lead, pulsanti; in home nastro e collage.], [S01–S11],
  [LP/Sticker], [Etichetta bianca inclinata sulle foto.], [Hero, hub],
  [LP/CardHub], [Card colorata con icona, fasi e foto.], [H04],
  [LP/Livello + Risposta], [Scelte «parti da dove sei» e pannello navy che cambia.], [H05],
  [LP/CardDispensa], [Copertina vera, anno, formati; apre l'anteprima nell'area.], [H06, hub],
  [LP/Card (.cd)], [Card bianca / navy / arancio / blu con icona, titolo, testo, link.], [Prima, Durante, Dopo…],
  [LP/Strumento], [Elenco a sinistra, pannello navy a destra, strumento funzionante.], [H08, S09, hub],
  [LP/Dispositivo], [Riquadro con la web app, selettori dispositivo e sezione.], [S10],
  [LP/Checklist], [Voci spuntabili con avanzamento che si ricorda.], [S08],
  [LP/Fase], [Card delle tre fasi (piena o tratteggiata).], [Hub],
  [LP/Finale], [Chiamata finale con due foto.], [H12],
  [LP/CardDecidere], [Codice, titolo, problema, stato, impatto.], [S90],
  [LP/Schermo], [Riquadro tratteggiato della mini demo.], [Dettaglio Lxx],
  [LP/Bottone], [Primario navy · Secondario bianco · Accento arancio.], [Ovunque],
  [LP/Badge], [Neutro · Attivo · In arrivo · Esempio · Nell'area · Da decidere.], [Ovunque],
  [LP/Footer], [Onda, quattro colonne, newsletter, versione della demo.], [Tutte le pagine],
)

// ---------------------------------------------------------------- 11
#cap("11", "La configurazione e Framer", "cosa si tocca per cambiare, e come si trasforma in Framer")

#tab((22%, 44%, 34%),
  [Blocco (`config.js`)], [Campi], [Esempio di modifica],
  [versione], [Numero, data, nota (compare nel footer).], [Si aggiorna a ogni versione.],
  [numeri], [utenti, pagine, esami, fonte.], [Nuovo mese: cambiare tre numeri.],
  [hub], [slug, nome, stato (attivo / in_arrivo), href, icona, foto, descrizione, fasi.], [Accendere Giurisprudenza: stato «attivo».],
  [fasi], [id, nome, titolo, voci del menu.], [Aggiungere una voce al dropdown di Durante.],
  [prezzi], [Per «esame» e «semestre»: nome, prezzo, descrizione, voci, piano consigliato; FAQ.], [Cambiare € 12,99 in € 14,99.],
  [decidere], [id Lxx, titolo, gruppo, stato, impatto, sforzo, problema, proposta, dove, consiglio, schermata, serve, domande, area, storico.], [Una nuova idea = un nuovo blocco L10.],
)
Gli *strumenti* stanno in `tools.js` (cap. 7).

#sub[Blocchi della mini demo (campo «schermata»)]
#tab((14%, 86%),
  [Blocco], [Cosa mostra],
  [hero], [Etichetta + titolo con \*parola accento\* + testo.],
  [cards], [Tre card con titolo e testo.],
  [steps], [Passi numerati.],
  [list], [Righe con titolo, sottotitolo, etichetta.],
  [stats], [Tre numeri.],
  [chips], [Etichette in fila.],
  [nota], [Avviso arancio.],
  [piano], [Lo strumento «Piano per l'appello» funzionante.],
  [prezzi], [Le tre card del listino (da config).],
)
Un'idea che chiede qualcosa che i blocchi non sanno fare: si aggiunge un tipo di blocco (una riga in `BLOCCHI`, `app.js`) e si documenta qui.

#sub[I file della demo]
#tab((26%, 74%),
  [File], [Cosa contiene],
  [\*.html], [Una pagina per file (S01–S12, S90); nav e footer vengono da `app.js`.],
  [config.js], [Tutto ciò che si cambia senza toccare il design (questo capitolo).],
  [tools.js · tools.css], [Gli strumenti (oggi solo landing, riusabili nella web app).],
  [app.js], [Navbar, footer, animazioni, strumenti, anteprima area, prezzi, Da decidere.],
  [ul.css], [Token e componenti; in fondo le aggiunte v2: tablet e telefono.],
  [data.js], [Le 34 dispense (stessa fonte del catalogo).],
  [decidere-arch.js], [Architettura completa delle 9 card (UL_ARCH): pagine annotate, dati, regole, stati, testi, misure, piano, rischi, prompt. Fonte unica per demo, PDF e Markdown.],
  [commenti.js · commenti.css · commenti.html], [Il sistema di commenti del team e la pagina rapporto (cap. 16). Si spegne con `UL_CFG.commenti.attivi = false`.],
  [img/ · fonts/], [Foto, copertine, loghi (leggeri: 256 px), Croogla; `area-*.jpg` = foto dell'area in home; `img/app/` = 51 schermate reali della web app.],
  [`_src/verifica_landing.js`], [Verifica prima del push: errori, file mancanti, scorrimento laterale e accessibilità (axe) su tutte le pagine in tre formati (cap. 17).],
  [`_src/build_schede.js`], [Genera immagini, Markdown e PDF delle schede dai dati di decidere-arch.js.],
)

#sub[Dalla demo a Framer: cosa diventa cosa]
#tab((28%, 36%, 36%),
  [Nella demo], [In Framer], [Note],
  [`UL_CFG.hub`], [Collezione CMS «Hub»], [Il campo Stato accende/spegne un hub (come in hub.csv).],
  [`UL_CFG.prezzi`], [Collezione CMS «Prezzi»], [Il listino si cambia senza toccare il design.],
  [`UL_CFG.numeri`], [Variabili o CMS «Numeri»], [Aggiornati dal sync giornaliero di Google dell'HQ.],
  [`tools.js`], [Componenti di codice (uno per strumento)], [Le funzioni si copiano quasi tali e quali.],
  [Pagine S01–S11], [Pagine Framer con gli stessi nomi], [I codici S/H/LP restano per le richieste.],
  [«Da decidere» (S90, L01–L09)], [*Non si pubblica*], [Resta nella demo e nell'ambiente del team: in Framer una pagina nascosta o un progetto a parte.],
  [Anteprima area (S10)], [Immagini + link «Accedi»], [In Framer l'iframe non serve: bastano gli screenshot.],
)
#nota[Ordine consigliato per Framer: stile (token) → home → hub → Prima / Durante / Dopo → Strumenti (componenti di codice) → Community. «Da decidere» e Prezzi dopo la decisione.]

// ---------------------------------------------------------------- 12
#cap("12", "Demo, backup e HQ", "dove sono, come si salvano, come si torna indietro")

#tab((26%, 74%),
  [Cosa], [Dove],
  [Demo landing], [matteprune04.github.io/unilink-hq/demo-landing/],
  [Demo web app], [matteprune04.github.io/unilink-hq/demo-webapp/ (link diverso, stessa struttura)],
  [Sorgenti], [Repository GitHub matteprune04/unilink-hq, cartelle `demo-landing/` e `demo-webapp/`],
  [Registro versioni], [`demos/registro.json` (scritto in automatico)],
  [Backup], [Release GitHub con tag `landing-vN` / `webapp-vN`, ognuna con lo ZIP allegato],
  [In HQ], [Laboratorio AI → sezione *DEMO*: le due demo incorporate, anteprima *Desktop · Tablet · Telefono*, «Scarica l'ultima versione» e storico (data, autore, nota, ZIP) sotto ciascuna],
  [Questo documento], [`architettura/UniLink_Architettura_Landing.pdf` (sorgente Typst accanto) e `CONTESTO_DEMO.md`],
)

#sub[Come funziona il backup automatico]
+ Claude (o chiunque) modifica una demo e fa push su GitHub con una frase chiara: *diventa la nota della versione*.
+ La GitHub Action «Backup demo» vede che `demo-landing/` o `demo-webapp/` sono cambiate.
+ Crea lo ZIP e una Release (tag `landing-v3`…): il backup sta fuori dal repository.
+ Aggiunge la versione a `demos/registro.json`: numero, data, autore, nota, dimensione, link.
+ L'HQ legge il registro: la sezione DEMO mostra subito la nuova versione e lo storico. Nessun caricamento a mano.

#sub[Come si torna a una versione]
Dall'HQ: «Scarica ZIP» sulla versione voluta (si apre senza installare: `index.html`). Oppure: «ripristina la landing alla v2»: si riporta la cartella al tag `landing-v2`, push, nuova versione nello storico (la storia non si perde).

#nota[Lo «storico» mostra le versioni (chi ha modificato, quando, cosa) e ognuna è un backup scaricabile. GitHub non dice *chi ha scaricato* uno ZIP: mostra solo un contatore di download per ogni release.]

// ---------------------------------------------------------------- 13
#cap("13", "Come chiedere modifiche", "il vocabolario comune: cosa dici, cosa succede")

Ogni richiesta ha un *tipo*. Nomina il codice della pagina (S01…), della sezione (H04…), della card (L01…) o del componente (LP/…): così è chiaro dove va, come si fa e perché.

#tab((17%, 33%, 50%),
  [Tipo], [Cosa dici (esempio)], [Cosa faccio],
  [A · Nuova idea], [«Nuova idea: sezione “Prepara il colloquio” in Dopo.»], [Creo la card *L10* in Da decidere con tutte le parti (problema, proposta, dove, mini demo, consiglio, serve, domande, origine, storico). Nessuna pagina decisa cambia.],
  [B · Modifica una card], [«In L02 aggiungi i promemoria via email.»], [Aggiorno mini demo e storico della card.],
  [C · Promuovi], [«L02 è decisa: mettila nelle pagine.»], [Applico le quattro domande, la porto in S06 (e nel menu), la tolgo da Da decidere con lo storico «deciso il …», aggiorno questo PDF.],
  [D · Pagina decisa], [«In S06 metti Erasmus prima del metodo.»], [Modifico la pagina; se cambia la struttura aggiorno cap. 5.],
  [E · Grafica], [«LP/CardDispensa: copertina più grande su tablet.»], [Modifico il componente in `ul.css`: vale ovunque è usato.],
  [F · Hub], [«Accendi Giurisprudenza.»], [`stato: "attivo"` in `UL_CFG.hub` + materiali collegati.],
  [G · Strumento], [«Aggiungi uno strumento “Scadenze concorsi” per Giurisprudenza.»], [Voce in `UL_TOOLS` + funzione in `IMPL`, aggiorno cap. 7.],
  [H · Listino], [«Il pacchetto semestre costa € 27,99.»], [Cambio `UL_CFG.prezzi`.],
  [I · Ripristina], [«Riporta la landing alla v2.»], [Riporto la cartella al tag `landing-v2`, push, nuova versione.],
  [L · Rimuovi / archivia], [«Togli L04, non la facciamo.»], [La card esce; resta nel registro e nelle Decisioni dell'HQ.],
  [M · Commenti], [Allegando il PDF o il Markdown scaricato dai commenti: «Applica i commenti aperti».], [Per ogni commento aperto: propongo la modifica minima (tipo D o E), dico quali file tocca, la applico se è chiara, altrimenti chiedo. I commenti risolti restano storico.],
)

#sub[Cosa succede dopo ogni richiesta]
Nuova versione della demo (numero nel footer) → backup automatico → in HQ, Laboratorio AI → DEMO, compare la versione con la nota. Se la richiesta cambia l'architettura, aggiorno anche questo PDF (nuova versione in copertina) e lo storico della card.

#nota[Se un'idea è ambigua ti chiedo prima il tipo: «la metto in Da decidere (A) o la vuoi già nelle pagine (C)?». Senza decisione, un'idea va sempre in Da decidere.]

// ---------------------------------------------------------------- 14
#cap("14", "Roadmap e punti di ripartenza", "dove ripartire per ampliare, a breve, medio e lungo termine")

Per ogni passo: *riparti da* = pagina, card o file da cui cominciare. I tempi sono indicativi e dipendono da chi costruisce.

#sub[Breve termine · 0–2 mesi (ottobre–novembre 2026)]
#tab((32%, 30%, 38%),
  [Cosa], [Riparti da], [Pronto quando],
  [Approvare la v3, commentarla e decidere le prime card], [Cap. 16 (commenti) · schede L02, L01, L08], [I founder commentano la demo, scaricano i commenti e li passano all'AI (tipo M); decisioni scritte nello storico delle card.],
  [Portare la landing su Framer], [Cap. 11 · S01–S11, `config.js`], [Home, hub, Prima / Durante / Dopo, Strumenti e Community online.],
  [Lista d'attesa unica (landing + app)], [S03, S04 · tabella `lista_attesa` (PDF web app, cap. 10)], [Il form salva davvero e conta gli iscritti per hub.],
  [Pagine legali e consenso cookie (GA4)], [Cap. 15], [Privacy, cookie, termini e banner attivi prima di raccogliere email.],
  [Strumenti con regole certe online], [Cap. 7 · `tools.js` (voto, media, piano)], [Funzionano su Framer come componenti di codice.],
  [Foto vere e team], [S01 (H02, H09), S11], [Sostituiscono le foto del sito attuale e le iniziali.],
  [MVP area personale], [PDF web app, cap. 11 (fase 1)], [10 studenti la usano per una settimana senza aiuto.],
)

#sub[Medio termine · 3–6 mesi (dicembre 2026–aprile 2027)]
#tab((32%, 30%, 38%),
  [Cosa], [Riparti da], [Pronto quando],
  [Metodo e piano come pagina], [Card L02 · piano in `tools.js`], [Pagina «Il metodo» + scheda Piano nell'area (D04).],
  [Gruppi di studio minimi], [Card L01], [Un gruppo per esame con ambassador; si misura quanti entrano.],
  [Primo nuovo hub], [Card L08 · D01 / D02 · PDF web app cap. 6], [Lista d'attesa con numeri e almeno 1–2 studenti disposti a costruirlo.],
  [Listino e pagamenti], [Card L07 · D05 + D06], [Listino deciso, soggetto legale, Stripe, termini di vendita.],
  [Esercitazioni e simulatore], [Web app D03], [Banca domande per i primi 3 esami.],
  [Strumenti verificati per hub], [Cap. 7 · card L08], [Regole ufficiali controllate: spariscono le etichette «Esempio».],
  [Prova manuale del mentoring], [Card L03], [5 mentori, 20 studenti, risultato misurato.],
)

#sub[Lungo termine · 6–18 mesi (da maggio 2027)]
#tab((32%, 30%, 38%),
  [Cosa], [Riparti da], [Pronto quando],
  [Medicina (obiettivo 2027/28)], [Card D02 · hub-medicina.html], [Materiali e persone per il semestre filtro; date da fonti ufficiali.],
  [Secondo nuovo hub e più atenei], [`UL_CFG.hub` (campo ateneo) · PDF web app «Visione»], [Livello sotto l'hub: una riga nuova, non una pagina nuova.],
  [Career completa], [Card L06 · D09], [Profili tipo, Career Score e (solo con partner reali) opportunità.],
  [Metodo adattivo con AI], [Card L02 fase 2 · D04], [Dati di studio reali sufficienti per adattare il piano.],
  [Community più ricca / mentoring stabile], [Card L01, L03 · D08], [La prova manuale ha funzionato e c'è chi la gestisce.],
  [Test d'ingresso (TOLC)], [Card L04 · D12], [Solo se ha ancora senso dopo i nuovi hub.],
)

// ---------------------------------------------------------------- 15
#cap("15", "Osservazioni: tenere, tagliare, aggiungere", "il mio parere, da discutere")

#sub[Cosa ha senso tenere]
- *Prima · Durante · Dopo* come spina dorsale: spiega il prodotto in tre parole e si applica a ogni hub.
- *Strumenti dentro la landing*: sono il motivo per cui qualcuno torna e il miglior biglietto da visita (come in Sarfatti Prep).
- *Numeri reali di Google*: l'unico social proof vero che abbiamo.
- *Anteprima dell'area personale*: fa capire cosa c'è «dopo il clic» senza chiedere un account.
- *«Da decidere» separato*: evita che idee non decise sembrino promesse.

#sub[Cosa è superfluo o da ridurre]
#tab((30%, 70%),
  [Elemento], [Perché ridurlo],
  [Fascia «Demo navigabile…» in alto], [Serve solo in demo: in Framer va tolta.],
  [Tre pulsanti WhatsApp ripetuti], [Home, hub e finale ripetono lo stesso invito: tenerne uno principale per pagina.],
  [Onde decorative tra le sezioni], [Belle ma ripetitive: in Framer tenerne due (sopra i numeri e sopra il footer).],
  [Iniziali al posto delle foto del team], [Funzionano in demo; con le foto vere la sezione cambia peso.],
  [Newsletter nel footer senza strumento], [Non raccogliere email senza un servizio e un'informativa.],
  [«Parti da dove sei» + Prima / Durante / Dopo], [Si sovrappongono: tenere la prima come scorciatoia in home, la seconda come navigazione.],
  [Pagina Prezzi in primo piano], [Listino non deciso: fuori dalla barra (già così).],
)

#sub[Cosa manca e va deciso o fatto]
#tab((28%, 72%),
  [Mancante], [Perché conta],
  [Privacy, cookie, termini], [Obbligatorie con form, email e analytics; servono prima di raccogliere la lista d'attesa e prima dei pagamenti.],
  [Banner di consenso (GA4)], [I numeri di Google sono un punto di forza: vanno raccolti nel rispetto del consenso.],
  [Foto proprie e diritti d'uso], [Le foto della v1 vengono dal sito attuale e dall'ateneo: verificare liberatorie.],
  [Pagina 404 e redirect dal sito attuale], [Non perdere il traffico organico quando cambia l'indirizzo.],
  [SEO e anteprime social], [Titolo, descrizione e anteprima per WhatsApp sono già in ogni pagina della demo (con `noindex`). Mancano i testi definitivi, la sitemap e i redirect dal sito attuale.],
  [Backend della lista d'attesa], [Ora è simulata: serve un form Framer → webhook → tabella Supabase (`lista_attesa`).],
  [Responsabile degli aggiornamenti], [Scadenze, borse, regole degli strumenti e numeri cambiano ogni anno: serve un nome per ciascuno.],
  [Eventi di misura], [Almeno: clic su hub, uso degli strumenti, iscrizione lista d'attesa, accesso area personale.],
  [Accessibilità: prove reali], [La demo passa i controlli automatici (axe, WCAG AA, 0 problemi) in tre formati. Mancano le prove con screen reader veri e con persone: i controlli automatici trovano solo una parte dei problemi.],
  [Nomi allineati tra landing e web app], [La landing dice *Prima · Durante · Dopo* e *hub*; la web app v3 dice *Studio · Dopo gli esami* e *area di studio*: sono idee vicine con nomi diversi. Conviene sceglierne uno solo (il mio voto: Prima · Durante · Dopo e hub, che reggono anche Giurisprudenza e Medicina) e usarlo ovunque, nel menu, nei PDF e nei messaggi.],
  [Tablet nella web app], [La web app v2 passa dal desktop al telefono a 860 px: a 820 px riceve il layout del telefono. La landing ha già il layout tablet (701–1100 px); nel ramo `claude/landing-v2-completo` c'è una versione della web app con tablet da portare.],
)

// ---------------------------------------------------------------- 16
#cap("16", "Commenti del team", "commentare pagine e sezioni, salvarli, scaricarli per l'AI")

Ogni pagina della demo ha in basso a destra il pulsante *Commenti*. Serve ai founder per segnare cosa migliorare, dove e perché; i commenti restano salvati e si scaricano in un file da dare all'AI.

#tab((26%, 74%),
  [Passo], [Cosa succede],
  [1 · Apri], [Premi «Commenti». Scrivi il tuo nome una volta: si ricorda.],
  [2 · Scegli dove], [«Commenta una sezione»: ogni sezione si evidenzia al passaggio (o al tocco, su tablet e telefono) con il suo codice; i link non si aprono mentre sei in questa modalità. Oppure «Tutta la pagina».],
  [3 · Scrivi], [Scegli la categoria (Testo, Grafica, Struttura, Idea, Errore, Domanda) e scrivi cosa cambieresti e perché. Si salva subito.],
  [4 · Ritrovalo], [Sulla sezione compare un numero; nel pannello vedi «Questa pagina» e «Tutte», filtri Aperti / Risolti, e puoi modificare, segnare risolto o eliminare. «Vai alla sezione» ti porta lì.],
  [5 · Scarica], [PDF, Markdown o JSON dal pannello o dalla pagina «Commenti del team» (commenti.html).],
)

#sub[Cosa viene salvato con ogni commento]
#tab((26%, 74%),
  [Campo], [Esempio e perché],
  [Pagina e sezione], [`durante.html` · S06.4 «Studiare con un piano»: il codice dice all'AI *dove* si trova. Per le card: `decidere.html\#L04` e la sezione.],
  [Estratto], [Le prime righe del testo della sezione: l'AI capisce *cosa* si vedeva, anche se la pagina cambia.],
  [Testo e categoria], [Quello che hai scritto e il tipo di commento.],
  [Autore, data, stato], [Chi, quando, aperto o risolto.],
  [Dispositivo e versione], [Desktop, tablet o telefono, e la versione della demo: un problema «solo su telefono» si riconosce subito.],
)

#sub[Esportare e unire]
- *PDF*: un vero file scaricabile con un clic (non una finestra di stampa), con istruzioni per l'AI in testa.
- *Markdown*: lo stesso contenuto con una nota «Per l'AI» e i titoli per pagina e sezione: il formato migliore da incollare in una chat.
- *JSON*: serve a *unire* i commenti di più founder. Ognuno scarica il suo JSON; chi riceve lo importa (pulsante «Importa»): i commenti con lo stesso identificativo non si duplicano, se uno è stato modificato vince il più recente.

#sub[Come passarli all'AI]
Allega il file e scrivi: «Applica i commenti aperti della landing» (tipo M, cap. 13). L'AI usa i codici (S, H, L) e CONTESTO_DEMO.md, propone la modifica minima per ciascuno, applica quelli chiari e chiede degli altri.

#sub[Limiti da conoscere]
#tab((26%, 74%),
  [Limite], [Cosa significa e cosa fare],
  [Salvati nel browser], [I commenti stanno nel browser di chi li scrive (non su un server). Se si svuotano i dati del browser si perdono: scarica spesso il JSON.],
  [Non condivisi in tempo reale], [Un founder non vede i commenti degli altri finché non importa il loro file.],
  [Per condividerli davvero], [Serve una tabella su Supabase (con accesso solo al team, come l'HQ): circa 1–2 giorni di lavoro. Non è attiva: dimmi se la vuoi.],
  [Solo in demo], [In produzione si spegne con `UL_CFG.commenti.attivi = false`: i visitatori non vedono né il pulsante né il link nel footer.],
)

#grid(columns: (1.4fr, 1fr), gutter: 10pt,
  img("img/l_commenti_desk.jpg", didascalia: [Modalità «commenta»: la sezione sotto il cursore si evidenzia; il pannello elenca i commenti.]),
  img("img/l_commenti_ph.jpg", didascalia: [Su telefono il pannello è un foglio dal basso.]),
)
#img("img/l_rapporto.jpg", didascalia: [Pagina «Commenti del team»: tutto raggruppato per pagina, con esportazione.])

// ---------------------------------------------------------------- 17
#cap("17", "Ottimizzazione e prima visita", "cosa è stato misurato, cosa è cambiato, come ripetere le verifiche")

Le modifiche partono da *misure*, non da sensazioni. Sono tutte verificabili con `_src/verifica_landing.js`.

#tab((22%, 30%, 48%),
  [Area], [Prima], [Dopo e perché],
  [Peso dei loghi], [2 immagini da 4000×4000 px, 3,4 MB, usate a 34 px su ogni pagina], [256 px, 40 KB in totale: la pagina si carica prima, soprattutto da telefono.],
  [Nitidezza delle foto], [6 foto ingrandite oltre ×1,25 nel loro spazio (es. 576 px in un riquadro di 625×485)], [Foto sostituite o spazi ridotti: nessuna ingrandita su desktop; sui telefoni ad alta densità al massimo ×1,25.],
  [Contrasto dei colori], [Testo bianco su arancio 3,37:1; etichette arancio 3,9:1 (minimo 4,5)], [Tre varianti dello stesso arancio *solo dove c'è testo* (`\#b05d19`, `\#c26a1e`, `\#9a5417`); l'arancio del brand resta per tutto ciò che è decorativo.],
  [Accessibilità automatica (axe)], [292 elementi con problemi sulle pagine controllate], [*0 problemi* in 23 pagine × 3 formati, anche con il pannello commenti aperto.],
  [Tastiera e screen reader], [Chip, scelte e domande non raggiungibili; menu senza stato; nessun «vai al contenuto»], [Tutto raggiungibile e attivabile da tastiera, con lo stato annunciato; menu e tendine con Esc e focus corretto; area principale, titoli e aree della pagina in ordine.],
  [Intestazioni], [Senza descrizione e anteprima], [Descrizione, anteprima per WhatsApp e social, colore della barra, precaricamento del font; `noindex` finché è una demo.],
  [Movimento], [—], [Animazioni ridotte per chi lo chiede; niente «hover» che resta appiccicato al tocco.],
)

#sub[Per chi arriva la prima volta]
#tab((30%, 70%),
  [Cosa], [Perché],
  [Tre rassicurazioni sotto i pulsanti dell'hero], [«Gratis per iniziare · Senza account per esplorare · Fatto da studenti di UniFi»: tolgono le due paure principali (costo e registrazione).],
  [Spiegazione di «hub»], [«Un hub è lo spazio di un corso di studi…»: «hub» è gergo per chi non è mai stato su UniLink.],
  [Briciole di pane («Home › Durante › Strumenti»)], [Chi atterra da un link WhatsApp su una pagina interna capisce dove si trova e come tornare.],
  [Barra con un solo pulsante (tablet e telefono)], [Dopo l'hero compare un'azione sola, pertinente alla pagina (es. «Trova la tua dispensa»); si chiude con ✕ e sparisce vicino al footer.],
  [Un'azione sola per pagina], [Ogni pagina ha un pulsante principale; gli altri sono secondari.],
  [Ordine e linguaggio], [Titoli semplici, frasi brevi, nessuna promessa non mantenibile.],
)

#sub[Come ripetere le verifiche]
+ `python -m http.server 8765` dalla radice del repository.
+ `npm i playwright axe-core` (una volta).
+ `node _src/verifica_landing.js` → deve scrivere «tutto ok». Se trova problemi li elenca per pagina e formato.
+ Fare questo prima di ogni push che tocca `demo-landing/`.

#nota[*Cosa le verifiche automatiche non coprono:* prove con screen reader veri, con persone che non conoscono UniLink, su telefoni reali e con connessione lenta. Conviene farne una con 5 persone prima del lancio in Framer.]

#cap("18", "Demo grafiche", "render della demo v3 · dati di esempio")

#img("img/l_home_hero.jpg", didascalia: [S01 · Home (desktop): hero con nastro e collage; barra con Hub, Prima, Durante, Dopo, Strumenti, Community, «Da decidere» e «Area personale».])
#img("img/l_home_hub.jpg", didascalia: [H04 · Hub: Economia attivo; Giurisprudenza e Medicina in arrivo.])
#pagebreak()
#img("img/l_home_fasi.jpg", didascalia: [H05 · Parti da dove sei: scelte e risposta (interattivo).])
#img("img/l_home_area.jpg", didascalia: [H06b · Anteprima dell'area personale.])
#img("img/l_home_tools.jpg", didascalia: [H08 · Strumenti: elenco e pannello funzionante.])
#pagebreak()
#img("img/l_prima.jpg", didascalia: [S05 · Prima.])
#img("img/l_durante.jpg", didascalia: [S06 · Durante: strumenti rapidi e piano per l'appello.])
#pagebreak()
#img("img/l_dopo.jpg", didascalia: [S07 · Dopo.])
#img("img/l_tesi.jpg", didascalia: [S08 · Tesi e laurea: checklist che si ricorda.])
#pagebreak()
#img("img/l_community.jpg", didascalia: [S11 · Community.])
#img("img/l_hub_giu.jpg", didascalia: [S03 · Hub Giurisprudenza (in arrivo): lista d'attesa e strumenti di esempio.])
#pagebreak()
#grid(columns: (1fr, 1fr, 1fr), gutter: 10pt,
  img("img/m_home.jpg", didascalia: [Telefono · home]),
  img("img/m_menu.jpg", didascalia: [Telefono · menu]),
  img("img/m_hub.jpg", didascalia: [Telefono · hub in arrivo]),
)
#grid(columns: (1fr, 1fr, 1fr), gutter: 10pt,
  img("img/m_decidere.jpg", didascalia: [Telefono · Da decidere]),
  img("img/t_durante.jpg", didascalia: [Tablet · Durante]),
  img("img/t_hub.jpg", didascalia: [Tablet · Hub]),
)
