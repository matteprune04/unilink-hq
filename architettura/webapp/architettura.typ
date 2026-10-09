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

#let versione = "v3 · 6 ottobre 2026"

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
  #text(size: 8pt, fill: arancio, tracking: 0.16em)[ARCHITETTURA DELLA WEB APP · VERSIONE 3]
  #v(10pt)
  #text(size: 40pt)[L'area personale \ di UniLink.]
  #v(14pt)
  #text(size: 11pt)[Design della demo A (Area personale e versioni B, C, D), invariato. \ Architettura: un mix delle vostre demo. Parte decisa da A + B, \ proposte da decidere = moduli completi di C (Career) e D (Network). \ Piano aggiornabile in iscrizione e dopo · «Visualizza come» · commenti del team.]
  #v(1fr)
  #set text(size: 8pt)
  #grid(columns: (1fr, 1fr, 1fr), gutter: 10pt,
    [Versione 3 \ 6 ottobre 2026], [Per i founder \ Matteo, Cosimo, Niccolò, Gianmarco], [Demo e backup \ matteprune04.github.io/unilink-hq/demo-webapp/])
]

// ---------------------------------------------------------------- in breve
#block(below: 4pt, text(size: 21pt)[In breve])
#block(below: 12pt, spaziato("cosa è cambiato rispetto alla v2 e perché"))

Questo PDF è la mappa completa dell'area personale (web app): cosa contiene, perché è fatta così, *quali file toccare* per cambiarla, come si costruisce davvero e come si chiede una modifica. La v3 nasce dalle vostre correzioni sulla v2.

#tab((24%, 38%, 38%),
  [Tema], [Richiesta], [Cosa fa la v3],
  [Design], [«Voglio esattamente la A», cioè la famiglia Area personale / Versione B Esami / C Career / D Network.], [Usa *il loro CSS e i loro componenti senza modifiche* (css/style.css, ui.js, shell.js, auth.js, account.js): pillola navy in alto con cerchio arancio e iniziali, sidebar navy flottante, login diviso, Croogla + Instrument Sans. Le aggiunte sono in un file a parte (css/unilink.css, 40 righe).],
  [Architettura], [«Un mix tra quelle che vi avevo proposto», non aree × percorsi (Test Prep / Studio / Futuro: scartato).], [*Parte decisa* = dashboard, esami, materiali, esercitazioni (B) + Il mio percorso (Area personale). *Da decidere* = i moduli interi di C e D, funzionanti, nel gruppo arancione della sidebar.],
  [Da decidere], [Non uno schema grossolano: l'architettura completa, con codice commentato e manutenibile.], [25 proposte; 20 funzionano già nella app. Ogni scheda: rotte, file, dati salvati, funzioni, ricavi (ipotesi), dipendenze, passi per attivarla, domande aperte, storico. Ogni file dei moduli ha l'intestazione di architettura.],
  [Piano], [Aggiornabile prima e dopo, anche in iscrizione.], [Prima: ultimo passo del primo accesso (Gratuito / Semestre / Plus → pagamento). Dopo: pagina Abbonamento (upgrade, disdetta, ordini) e ogni lucchetto (pacchetto o Plus).],
  [Tipologie], [Vedere la demo con le diverse tipologie.], [«Visualizza come» (pulsante fisso): 7 account demo, cambio senza uscire; dalle schede delle proposte apre il modulo con l'account giusto.],
  [Commenti], [Commentare pagine e sezioni, che restino lì, scaricabili in PDF per l'AI.], [Pulsante «Commenti»: clic su una sezione o sulla pagina, segnaposto numerati, elenco, risolto/aperto, PDF, .md per l'AI, JSON per il team (cap. 7).],
  [Aree], [Giurisprudenza e Medicina in arrivo, con la loro possibile architettura.], [Stato «in arrivo» con lista d'attesa (Elena); schede D01 e D02 con i passi per accenderle.],
)

#nota[Regola HQ rispettata: nessun numero o prezzo presentato come vero. Prezzi = ipotesi dell'HQ (dispensa 12–15 €, semestre 25–30 €, Plus da decidere); quelli dei moduli C e D sono le ipotesi delle loro demo, segnate come tali. Aziende, mentor, atenei diversi da UniFi: fittizi.]

// ---------------------------------------------------------------- 1
#cap("1", "La mappa", "sezioni decise, sezione da decidere, strumenti del team")

#grid(columns: (1fr, 1fr), gutter: 12pt,
  img("img/giulia_dashboard.png", didascalia: [Dashboard (Giulia, gratuito): il design della demo A.]),
  img("img/m_menu.png", w: 62%, didascalia: [Sidebar su telefono: il gruppo arancione è «Da decidere».]))

#tab((22%, 30%, 48%),
  [Gruppo sidebar], [Voci (rotta)], [Da dove viene],
  [Studio #sicura], [Dashboard (dashboard) · I miei esami (esami) · Materiali (materiali) · Esercitazioni (esercitazioni)], [Demo B «Esami»: «Cosa ti serve adesso?», ripasso errori, pacchetti esame e semestre, simulazioni. Materiali ed Esercitazioni mostrano «in arrivo» se l'area non è attiva.],
  [Dopo gli esami #sicura], [Il mio percorso (percorso)], [Area personale: libretto e voto di laurea, Erasmus, magistrali (motore reco.js), mentor.],
  [Account #sicura], [Abbonamento (abbonamento) · Profilo e account (account)], [Piano, upgrade, disdetta, ordini; profilo con area, ateneo, corso, anno e colore del cerchio.],
  [Da decidere #decid], [Tutte le proposte · Career (demo C) · Network (demo D) · Configurazione · Metriche (admin)], [Una voce per modulo (la sidebar resta corta); dentro il modulo un sotto-menu con le sue pagine e un banner tratteggiato «Da decidere · Dxx» che porta all'architettura.],
)

#sub[Tre regole che decidono cosa vede lo studente]
- *Area di studio* (UL_AREE): Economia attiva; Giurisprudenza e Medicina «in arrivo» → Dashboard, Materiali ed Esercitazioni mostrano la lista d'attesa; esami, libretto e profilo funzionano per tutti.
- *Ateneo*: la parte decisa copre UniFi. Chi sceglie un altro ateneo usa la app e vede un banner verso la proposta Network (D12).
- *Piano*: Gratuito, Pacchetto esame, Pacchetto semestre, Plus (si sommano). Plus è *un solo campo* (activity.plus) per tutta la app, anche per i moduli Career.

// ---------------------------------------------------------------- 2
#cap("2", "Accesso, iscrizione e primo accesso", "il piano si sceglie già qui, e si cambia sempre")

#grid(columns: (1fr, 1fr), gutter: 12pt,
  img("img/accedi.png", didascalia: [Accesso (login diviso della demo A) con gli account demo.]),
  img("img/onb_area.png", didascalia: [Primo accesso · passo 1: area di studio, con stato.]))

#tab((8%, 24%, 68%),
  [Passo], [Nome], [Cosa chiede e perché],
  [1], [Area di studio], [Economia / Giurisprudenza / Medicina / altra. Decide materiali e lista d'attesa.],
  [2], [Ateneo, corso e anno], [UniFi o «altro ateneo (in arrivo)»: per filtrare gli esami del proprio anno.],
  [3], [Da dove partire], [Area attiva: esami che sta preparando (la dashboard parte da questi). Area in arrivo: domanda della lista d'attesa.],
  [4], [Dopo la laurea], [Obiettivo (magistrale in Italia, MSc estero, lavoro…): usato da «Il mio percorso» e dal motore delle magistrali.],
  [5], [Ritmo e avvisi], [Minuti al giorno, email sugli aggiornamenti delle dispense, newsletter (consensi separati).],
  [6], [Il tuo piano], [Gratuito / Pacchetto semestre (solo area attiva e UniFi) / Plus → «Vai al pagamento» (checkout simulato con coupon).],
)

#grid(columns: (1fr, 1fr), gutter: 12pt,
  img("img/onb_piano.png", didascalia: [Passo 6: upgrade già in iscrizione.]),
  img("img/abbonamento.png", didascalia: [Abbonamento: upgrade e disdetta dopo.]))

#sub[Upgrade dopo l'iscrizione: tre punti, una sola regola]
- *Abbonamento* (rotta abbonamento): piano attuale, pacchetti del semestre, «Passa a Plus», «Disdici Plus», ordini e ricevute, tabella «cosa puoi fare adesso».
- *Ogni lucchetto* (materiale o esercitazione bloccata): finestra «Sblocca» con due scelte, pacchetto di quell'esame o Plus.
- *Card in fondo alla sidebar*: piano attuale e link all'upgrade.
Le regole di sblocco sono in un solo file: js/core.js → owns (materiali), ownsPractice (esercitazioni), plus.

#img("img/upsell.png", w: 70%, didascalia: [Il lucchetto apre la scelta: pacchetto dell'esame o Plus.])

// ---------------------------------------------------------------- 3
#cap("3", "Tipologie demo e «Visualizza come»", "vedere la stessa app con ogni tipo di account")

#grid(columns: (1.2fr, 1fr), gutter: 12pt,
  tab((24%, 36%, 40%),
    [Tipologia], [Account], [Cosa mostra],
    [Gratuito], [Giulia Rossi · I anno], [Prova gratuita, lucchetti, errori da ripassare.],
    [Pacchetto esame], [Marco Bianchi], [Microeconomia sbloccata, il resto no.],
    [Pacchetto semestre], [Sara Neri], [Tutto il II semestre del I anno.],
    [Plus], [Luca Conti · III anno], [Plus attivo; dati del modulo Career (track, candidature, profilo talento).],
    [Area in arrivo], [Elena Ricci · Giurisprudenza], [Stato «in arrivo» e lista d'attesa.],
    [Altro ateneo], [Martina Conti · UniPi], [Banner ateneo; dati del modulo Network (Pass, crediti, test).],
    [Admin], [Team UniLink], [Metriche, Business cockpit (C), La rete (D).],
  ),
  img("img/vista.png", didascalia: [«Visualizza come»: cambio di account senza uscire; c'è anche «Nuovo account» per provare iscrizione e primo accesso.]))

Password di tutti gli studenti demo: UniLink2026! · Admin: AdminDemo!2026. Per aggiungere una tipologia: una riga in UL.DEMO e un utente in UL.SEED (js/seed.js) con la stessa email.

// ---------------------------------------------------------------- 4
#cap("4", "La sezione «Da decidere»", "25 proposte, ognuna con la sua architettura completa")

#grid(columns: (1fr, 1fr), gutter: 12pt,
  img("img/decidere.png", didascalia: [Catalogo: card tratteggiate, «Modulo nella app» o «Da costruire».]),
  img("img/scheda_d05.png", didascalia: [Scheda D05: rotte, file, dati, funzioni, ricavi, dipendenze, passi, domande, storico.]))

#tab((9%, 30%, 18%, 43%),
  [Cod.], [Proposta], [Rotta], [Stato e nota],
  [D01], [Area Giurisprudenza], [dashboard], [In arrivo · lista d'attesa già attiva (Elena).],
  [D02], [Area Medicina], [—], [In arrivo · semestre filtro con il formato di D16.],
  [D03], [Il mio piano · Career Score], [piano], [Modulo C · punteggio su 100, 5 fasi, prossime 3 azioni.],
  [D04], [Studio con Plus], [studio], [Modulo C · alternativa al modello a pacchetti.],
  [D05], [Opportunità: stage e graduate], [opportunita], [Modulo C · aziende fittizie, servono partner.],
  [D06], [Profilo talento], [profilo], [Modulo C · visibile solo con consenso.],
  [D07], [Track (percorsi guidati)], [track], [Modulo C · MSc, Finance, Erasmus.],
  [D08], [Mentor marketplace], [mentor], [Modulo C · da unire al mentor di «Il mio percorso».],
  [D09], [Eventi], [eventi], [Modulo C · da unire a D19?],
  [D10], [Plus e inviti (referral)], [plus], [Modulo C · un solo prezzo Plus da scegliere.],
  [D11], [Business cockpit], [cockpit], [Modulo C · solo admin; forse va nell'HQ.],
  [D12], [Più atenei: home dell'ateneo], [home], [Modulo D · rete di atenei.],
  [D13], [Dispense dalla community + crediti], [dispense], [Modulo D · revisione e diritti d'autore.],
  [D14], [Calcolatori e guide per ateneo], [strumenti], [Modulo D · preset da verificare.],
  [D15], [Mercatino dei libri], [mercatino], [Modulo D · moderazione.],
  [D16], [Test d'ingresso e simulazioni], [test], [Modulo D · sostituisce il vecchio «Test Prep».],
  [D17], [Ammissioni MSc], [ammissioni], [Modulo D · servono dati veri.],
  [D18], [Academy], [academy], [Modulo D · chi produce i corsi?],
  [D19], [Club ed eventi per ateneo], [club], [Modulo D · ambassador.],
  [D20], [Pass e crediti], [pass], [Modulo D · Pass o Plus: uno solo.],
  [D21], [La rete (admin)], [rete], [Modulo D · revisione dispense.],
  [D22], [Raccolta domande d'esame], [—], [HQ, in sviluppo · da costruire (formato di data-quiz.js).],
  [D23], [Lettore protetto], [—], [HQ · PDF.js + filigrana.],
  [D24], [Borse di studio], [—], [HQ · guida con fonti ufficiali.],
  [D25], [Guida tesi], [—], [HQ · 4 passi + template.],
)

#sub[Come una proposta diventa decisa]
+ Si apre la scheda (Tutte le proposte → Dxx), si guarda il modulo («Apri il modulo» o «Visualizza come…»), si discute in call.
+ Decisa: si seguono i passi «Per attivarla» della scheda; in js/boot.js la voce passa da UL.NAV.dd a UL.NAV.decise e la rotta perde la cornice U.dd().
+ Scartata: si tolgono voce, rotta e gli script del modulo da index.html; la scheda resta nel registro con lo storico.
+ In entrambi i casi si aggiunge una riga allo «storico» della scheda (js/unilink-dati.js).

// ---------------------------------------------------------------- 5
#cap("5", "I moduli Career e Network", "codice completo, commentato, attivabile o rimovibile")

#grid(columns: (1fr, 1fr), gutter: 12pt,
  img("img/career_opportunita.png", didascalia: [Career · Opportunità (Luca, Plus): banner Dxx + sotto-menu del modulo.]),
  img("img/network_home.png", didascalia: [Network · Home dell'ateneo (Martina, UniPi).]))

#sub[Career (dalla demo Versione C) · js/da-decidere/career/]
#tab((26%, 74%),
  [File], [Contenuto],
  [dati.js], [window.UL\_C: aziende, annunci, track, mentor, eventi, perk, pipeline B2B (tutto fittizio).],
  [core.js], [UL.C: score (5 aree, totale 100), phases (5 fasi con checklist), nextActions, talentPct, isPlus, pipeline. *Intestazione con l'architettura completa.*],
  [viste-percorso.js], [pianoC, studioC, opportunitaC, profiloC, eventiC, plusC.],
  [viste-crescita.js], [trackC, mentorC, masterC, adminC (cockpit).],
  [Dati salvati], [profile: headline, skills, linkedin, areeProf, inglese, certInglese, gmat, gre, stage, erasmus · activity: plus, applications, tracks, bookings, rsvp, talent, referral, shortlist.],
)

#sub[Network (dalla demo Versione D) · js/da-decidere/network/]
#tab((26%, 74%),
  [File], [Contenuto],
  [dati.js], [window.UL\_D: atenei, dispense community, domande dei test, academy, ammissioni, eventi, convenzioni, annunci.],
  [core.js], [UL.D: myUni, dispense(ateneo) (per UniFi legge le dispense vere), addCredits, subjects, best, predict, laurea, exchange, PRESETS. *Intestazione con l'architettura completa.*],
  [home-vista.js · dispense-vista.js], [homeD, passD · dispenseD (caricamento → revisione → crediti).],
  [prep-vista.js · community-vista.js], [testD, academyD, ammissioniD · clubD, mercatinoD, strumentiD.],
  [admin-vista.js], [adminD (La rete, solo admin).],
  [Dati salvati], [profile: ateneo, corso · activity: credits, pass, uploads, tests, courses, chapter, rsvp, listings, admissions, ambassador, purchases.],
)

#nota[Come convivono con la parte decisa: namespace separati (UL.B, UL.C, UL.D), viste con suffisso (…B, …C, …D), stessa base (ui, store, shell, auth, account). Il modello dati unico è in js/config.js (default di profilo e attività, ognuno marcato [A/B], [C] o [D]). Plus è condiviso: B.plus legge activity.plus come C.isPlus.]

#grid(columns: (1fr, 1fr), gutter: 12pt,
  img("img/network_dashboard.png", didascalia: [Studentessa di un altro ateneo: banner verso D12.]),
  img("img/arrivo.png", didascalia: [Area in arrivo (Elena, Giurisprudenza).]))

// ---------------------------------------------------------------- 6
#cap("6", "Configurazione e file", "dove si cambia cosa, senza rifare il design")

#img("img/config.png", w: 80%, didascalia: [Pagina Configurazione: aree, sidebar decisa, moduli da decidere, piani × funzioni, tipologie, mappa dei file.])

#tab((34%, 66%),
  [Cosa vuoi cambiare], [File],
  [Prezzi e piani], [js/config.js → UL.PIANI (ipotesi)],
  [Modello dati (profilo, attività)], [js/config.js → UL.CONFIG.profileDefaults / activityDefaults],
  [Aree di studio, proposte da decidere], [js/unilink-dati.js → UL\_AREE, UL\_DA\_DECIDERE],
  [Voci della sidebar e rotte], [js/boot.js → UL.NAV.decise, UL.NAV.dd, appRoutes],
  [Account demo / tipologie], [js/seed.js → UL.DEMO, UL.SEED],
  [Esami, dispense, domande], [js/data-dispense.js, js/data-quiz.js],
  [Regole di sblocco], [js/core.js → owns, ownsPractice, plus, planName],
  [Primo accesso, abbonamento, Da decidere, Visualizza come], [js/views/unilink.js (10 sezioni numerate nel commento iniziale)],
  [Pagine della parte decisa], [js/views/area.js, scheda.js, pratica.js, percorso.js (demo B)],
  [Moduli Career / Network], [js/da-decidere/career/, js/da-decidere/network/],
  [Commenti del team], [js/commenti.js],
  [Design], [css/style.css (demo A, non toccare) · css/unilink.css (aggiunte)],
)

#sub[Ordine di caricamento (index.html)]
#box-crema[#set text(size: 8.4pt)
1 config · unilink-dati · data-dispense · data-quiz · data-programmi → 2 ui · store · reco · seed · core · shell · auth · account → 3 viste B (scheda, area, pratica, percorso) → 4 modulo Career → 5 modulo Network → 6 views/unilink · boot → 7 commenti. Ogni blocco è commentato; i blocchi 4, 5 e 7 si tolgono senza rompere il resto.]

// ---------------------------------------------------------------- 7
#cap("7", "Commenti del team", "su pagine e sezioni, che restano lì, scaricabili per l'AI")

#grid(columns: (1fr, 1fr), gutter: 12pt,
  img("img/commenti_pick.png", didascalia: [«Commenta una sezione»: la sezione si evidenzia, clic per commentare.]),
  img("img/commenti_panel.png", didascalia: [Segnaposto numerato sulla sezione e pannello dei commenti.]))

+ Pulsante arancio *Commenti* (in basso a destra, su ogni pagina, anche login e primo accesso).
+ *Commenta una sezione* (clic sul blocco) o *Commenta la pagina*. Tipo (Miglioramento, Problema, Domanda, Idea), priorità, testo, nome.
+ Il commento resta sulla pagina con un *segnaposto numerato*; si modifica, si segna risolto, si riapre, si elimina.
+ *Scarica*: PDF (dialogo di stampa → «Salva come PDF»), *.md per l'AI* (con le istruzioni per me in testa), JSON per passarli a un altro del team che li importa. Opzione «solo i commenti aperti».
+ Mi passate il PDF o il .md: ogni commento ha pagina, rotta, sezione, account con cui guardavate e versione, quindi so esattamente cosa cambiare.

#nota[Dove stanno: nel browser di chi commenta (localStorage), separati dai dati demo: «Ripristina dati demo» non li cancella. Per vederli tutti insieme senza passarsi file serve un piccolo backend: una tabella «commenti» nel Supabase dell'HQ (stessi campi). È un passo da decidere: ditemi se lo volete.]

#img("img/commenti_form.png", w: 62%, didascalia: [Il modulo del commento: tipo, priorità, testo «come lo diresti all'AI».])

// ---------------------------------------------------------------- 8
#cap("8", "Farla funzionare davvero", "dalla demo alla app vera, con strumenti che il team conosce")

#box-crema[
  #grid(columns: (1fr, auto, 1fr, auto, 1fr), gutter: 6pt, align: center + horizon,
    box(fill: white, radius: 6pt, inset: 8pt)[*Landing* \ Framer \ unilinkfirenze.it], [→ «Accedi»],
    box(fill: navy, radius: 6pt, inset: 8pt, text(fill: white)[*Web app* \ Next.js su Vercel \ app.unilinkfirenze.it]), [↔],
    box(fill: white, radius: 6pt, inset: 8pt)[*Supabase* \ accesso · database \ archivio file])
]

#tab((24%, 76%),
  [Nella demo], [Nella app vera],
  [UL.store (localStorage)], [Supabase: auth con link via email, tabelle con regole di sicurezza (ognuno vede solo i suoi dati). I campi sono quelli di UL.CONFIG.],
  [Viste (render + mount)], [Pagine Next.js, una per rotta (app/(spazio)/dashboard, esami, materiali, …). I moduli C/D in cartelle separate, attivati da un flag.],
  [B.checkout simulato], [Stripe Checkout → webhook → riga in purchases → sblocco (solo quando il listino è deciso).],
  [Dati in file .js], [Tabelle dispense, aree, proposte caricate dagli stessi CSV della landing (una sola fonte).],
  [Commenti in localStorage], [Tabella commenti in Supabase, letta anche dall'HQ (opzionale).],
)

#tab((16%, 44%, 40%),
  [Fase], [Cosa], [Pronta quando],
  [0 · Demo (ora)], [Demo v3, commenti del team, decisioni sulle 25 proposte.], [Il team ha commentato e deciso in call.],
  [1 · MVP], [Accesso, primo accesso, Dashboard, I miei esami, Materiali, Il mio percorso, Abbonamento (gratuito + liste d'attesa).], [10 studenti di Economia la usano una settimana senza aiuto.],
  [2 · Piani], [Listino deciso, Stripe, esercitazioni con banca vera, lettore protetto (D23).], [Prezzi validati, soggetto legale pronto.],
  [3 · Moduli], [I moduli C/D decisi, prima area nuova (D01 o D02).], [Iscritti in lista e persone che la costruiscono.],
)

// ---------------------------------------------------------------- 9
#cap("9", "Demo, backup e HQ", "dove sono, come si salvano, come si torna indietro")

#tab((26%, 74%),
  [Cosa], [Dove],
  [Demo web app], [matteprune04.github.io/unilink-hq/demo-webapp/],
  [Demo landing], [matteprune04.github.io/unilink-hq/demo-landing/],
  [Sorgenti], [Repository matteprune04/unilink-hq, cartelle demo-webapp/ e demo-landing/],
  [Backup], [Action «Backup demo»: a ogni push crea lo ZIP e una Release (tag webapp-vN) e aggiorna demos/registro.json],
  [In HQ], [Laboratorio AI → DEMO: anteprima desktop/telefono, «Scarica l'ultima versione», storico con ZIP di ogni versione],
  [Questo documento], [architettura/UniLink\_Architettura\_WebApp.pdf (sorgente Typst in architettura/webapp/)],
)
#img("img/hq_demo_d.png", w: 78%, didascalia: [La sezione DEMO nell'HQ.])
Tornare a una versione: «Scarica ZIP» nell'HQ, oppure chiedere «ripristina la web app alla v2»: la cartella torna al tag e la Action crea una nuova versione (lo storico non si perde).

// ---------------------------------------------------------------- 10
#cap("10", "Come chiedere modifiche", "il vocabolario comune")

#tab((40%, 60%),
  [Dici], [Succede],
  [«Commenti» dalla demo (PDF o .md)], [Il modo migliore: applico ogni commento sulla pagina e sezione indicate, e vi dico quali ho fatto.],
  [«Decidiamo D05» / «scartiamo D15»], [Sposto la voce tra UL.NAV.dd e UL.NAV.decise (o tolgo il modulo), aggiorno lo storico della scheda e questo PDF.],
  [«Cambia la rotta X / la pagina Y»], [Modifico la vista indicata (nome nella scheda o in Configurazione).],
  [«Nuova tipologia demo: …»], [Riga in UL.DEMO e utente in UL.SEED.],
  [«Accendi Giurisprudenza»], [Passi di D01: stato attiva, corsi e domande.],
  [«Cambia i prezzi»], [UL.PIANI in config.js (restano ipotesi finché non decise).],
  [«Ripristina alla vN»], [Tag webapp-vN dal backup.],
)
Dopo ogni richiesta: modifica, prova di tutte le rotte con ogni tipologia (nessun errore), push, nuova versione nel backup e nell'HQ.

// ---------------------------------------------------------------- 11
#cap("11", "Decisioni aperte", "da chiudere in call, in quest'ordine")

+ *Abbonamento*: Plus (C) o Pass (D)? Mensile, semestrale o annuale? Prezzo (D10, D20).
+ *Gratuito*: dispense gratis + Plus (D04) o pacchetti a pagamento (parte decisa)?
+ *Quale area parte prima*: Giurisprudenza o Medicina (D01, D02), guardando la lista d'attesa.
+ *Career*: quali moduli prima di avere aziende partner (D03, D06, D07)?
+ *Network*: quando uscire da Firenze (D12) e con quali regole per le dispense della community (D13).
+ *Commenti condivisi*: tabella Supabase o file da passarsi?

// ---------------------------------------------------------------- 12
#cap("12", "Altre schermate", "render della demo v3 · dati di esempio")

#grid(columns: (1fr, 1fr), gutter: 12pt,
  img("img/giulia_materiali.png", didascalia: [Materiali · catalogo con lucchetti.]),
  img("img/percorso.png", didascalia: [Il mio percorso.]),
  img("img/career_piano.png", didascalia: [Career · Il mio piano (D03).]),
  img("img/network_test.png", didascalia: [Network · Test e simulazioni (D16).]),
  img("img/onb_esami.png", didascalia: [Primo accesso · esami del tuo anno.]),
  img("img/m_dashboard.png", w: 55%, didascalia: [Dashboard su telefono.]))
