// Intestazione del PDF «Schede Da decidere» (usata da _src/build_schede.js: non modificare schede.typ a mano, si rigenera)
#let navy = rgb("#172554")
#let crema = rgb("#f4f1ea")
#let arancio = rgb("#cf7527")
#let ar2 = rgb("#f6e4d1")
#let ar3 = rgb("#9a5417")
#let crema2 = rgb("#ebe4d5")
#let nv2 = rgb("#4b5675")
#let linea = rgb("#e2dccf")
#let nvt = rgb("#dfe4f1")

#set document(title: "UniLink — Schede «Da decidere»: architettura completa", author: "UniLink")
#set text(font: "Croogla 4F", size: 9.4pt, fill: navy, lang: "it")
#set par(leading: 0.62em, justify: false)
#show strong: set text(fill: navy)
#show raw: set text(font: "Croogla 4F")
#set list(indent: 4pt, body-indent: 5pt, spacing: 0.5em)

#set page(paper: "a4", margin: (x: 18mm, top: 20mm, bottom: 18mm),
  header: context { if counter(page).get().first() > 1 [
    #set text(size: 7.5pt, fill: nv2)
    UniLink · Schede «Da decidere» #h(1fr) v3 · 6 ottobre 2026
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
#let scheda(id, titolo, sotto) = {
  pagebreak(weak: true)
  block(below: 2pt, spaziato(id))
  block(below: 4pt, text(size: 21pt, titolo))
  block(below: 12pt, text(size: 8.5pt, fill: nv2, sotto))
}
#let sub(t) = block(above: 12pt, below: 6pt, text(size: 12.5pt, t))
#let box-crema(body, fill: crema2) = block(fill: fill, radius: 8pt, inset: 10pt, width: 100%, below: 8pt, body)
#let nota(body) = box-crema(fill: ar2, text(fill: ar3, body))
#let tab(cols, widths, righe) = {
  set text(size: 8.4pt)
  table(columns: widths, stroke: (x, y) => (bottom: 0.5pt + linea), inset: (x: 5pt, y: 5pt),
    fill: (x, y) => if y == 0 { crema } else { none },
    ..cols.map(c => text(fill: nv2, size: 7.8pt, c)), ..righe.flatten().map(c => [#c]))
}
// una sezione del mockup: l'immagine e, sotto, la sua nota (numero, nome, perché, cosa si può cambiare)
#let sezione(n, nome, codice, perche, modifica, comp, img) = block(breakable: false, below: 10pt, {
  block(stroke: 0.6pt + linea, radius: 6pt, clip: true, image(img, width: 100%))
  v(3pt)
  grid(columns: (16pt, 1fr), gutter: 6pt,
    box(width: 14pt, height: 14pt, radius: 7pt, fill: ar3, align(center + horizon, text(fill: white, size: 8pt, str(n)))),
    [*#nome* #h(4pt) #text(size: 7.5pt, fill: nv2, codice) \
     #text(size: 8.6pt)[_Perché c'è._ #perche \ _Cosa puoi cambiare da solo._ #modifica]
     #if comp != "" [ \ #text(size: 7.6pt, fill: nv2)[Componenti: #comp]]])
})

// ---------------------------------------------------------------- copertina
#page(fill: navy, margin: 22mm, header: none, footer: none)[
  #set text(fill: white)
  #grid(columns: (auto, auto), gutter: 8pt, align: horizon, image("../../demo-landing/img/logo-white.png", width: 26pt), text(size: 22pt)[unilink])
  #v(1fr)
  #text(size: 8pt, fill: arancio, tracking: 0.16em)[ARCHITETTURA COMPLETA · SCHEDE «DA DECIDERE»]
  #v(10pt)
  #text(size: 38pt)[Nove idee, \ pronte da costruire.]
  #v(14pt)
  #text(size: 11pt)[Per ogni scheda: la pagina intera disegnata e annotata, i dati e i campi, le regole e gli stati, i testi, le misure, le note legali da verificare, chi la mantiene, il piano di lavoro con le stime, i rischi, come capire se funziona e il prompt per l'AI.]
  #v(1fr)
  #set text(size: 8pt)
  #grid(columns: (1fr, 1fr, 1fr), gutter: 10pt,
    [Landing demo \ __VERSIONE__], [Per i founder \ Matteo, Cosimo, Niccolò, Gianmarco], [Da usare con \ CONTESTO_DEMO.md e il PDF di architettura della landing])
]

#block(below: 4pt, text(size: 21pt)[Come leggere una scheda])
#block(below: 12pt, spaziato("prima di aprire le nove schede"))
Ogni scheda ha la stessa struttura, così si confrontano a colpo d'occhio e si decide con gli stessi criteri.

#tab(("Parte", "Cosa trovi"), (26%, 74%), (
  ("Problema, proposta, consiglio", "Perché esiste l'idea, cosa faremmo e il parere di Claude (da discutere: la decisione è vostra)."),
  ("Panoramica", "Obiettivo, per chi, quando serve, stima di lavoro e tre elenchi: versione minima, dopo, non lo facciamo."),
  ("Pagine annotate", "Le pagine come sarebbero, sezione per sezione. Sotto ogni sezione: perché c'è e cosa puoi cambiare da solo (senza rifare il design)."),
  ("Dati e campi", "Le tabelle o collezioni: campi, tipo, un esempio, chi le aggiorna e ogni quanto."),
  ("Regole e stati", "Come si comporta la funzione e cosa vede lo studente in ogni situazione, con i testi."),
  ("Testi, misure, integrazioni", "I testi proposti; gli eventi da misurare; gli strumenti da collegare; cosa verificare dal punto di vista legale e della privacy."),
  ("Manutenzione", "Cosa va tenuto aggiornato dopo il lancio, da chi, ogni quanto e come."),
  ("Piano di lavoro", "Passi numerati con dove si lavora e i giorni stimati."),
  ("Rischi e successo", "Cosa può andare storto, come lo riduci, quali numeri dicono che funziona e la regola di stop."),
  ("Prompt per l'AI", "Il testo da incollare per far costruire la scheda, già scritto come richiesta di tipo C."),
))

#nota[Le stime e le soglie sono *ipotesi* di lavoro: servono per discutere, non sono dati. Le note legali indicano cosa far verificare a un consulente: non sono pareri legali. Gli esempi nei mockup (numeri, nomi, date) sono segnaposto: in produzione non esistono.]

#cap("Indice", "Le nove schede", "una riga per scheda: stima, impatto e sforzo")
#tab(("Cod.", "Scheda", "Gruppo", "Impatto / sforzo", "Stima di lavoro"), (8%, 30%, 16%, 14%, 32%), (("L01", "Gruppi di studio", "Community", "3 / 3", "8–10 giorni di lavoro (pilota con 5 esami)"), ("L02", "Metodo e piano di studio", "Metodo", "5 / 3", "10–14 giorni di lavoro (fase 1: piano a regole, senza AI)"), ("L03", "Mentoring tra pari", "Community", "4 / 5", "12–16 giorni, in gran parte lavoro umano (pilota di 4 settimane)"), ("L04", "Test d'ingresso (TOLC)", "Orientamento", "5 / 5", "15–20 giorni, di cui 6–8 per scrivere e verificare le domande"), ("L05", "Borse di studio e tasse", "Orientamento", "4 / 4", "6–8 giorni di lavoro, più una persona responsabile degli aggiornamenti"), ("L06", "Carriera e CV", "Dopo", "4 / 2", "7–10 giorni di lavoro (guida e controllo CV a checklist)"), ("L07", "Listino e pacchetti", "Monetizzazione", "3 / 3", "15–20 giorni di lavoro, più i tempi legali e amministrativi esterni"), ("L08", "Quale hub parte per primo", "Hub", "5 / 4", "5–6 giorni di lavoro per accendere un hub, dopo che i materiali esistono"), ("L09", "Voci degli studenti", "Fiducia", "3 / 1", "3–4 giorni di lavoro (form e sezione), poi la raccolta richiede settimane")))

#scheda("L01", "Gruppi di studio", "Community · impatto 3/5 · sforzo 3/5 · web app D08")
#box-crema[*Il problema.* #"Trovare compagni con lo stesso esame oggi passa solo da WhatsApp e dal passaparola." \ \ *La proposta.* #"Pagina «Studia insieme» nella Community: per ogni esame un gruppo (link WhatsApp) e, dopo l'accesso, «cerco un gruppo» come scelta esplicita. Niente social generalista."]
#nota[*Il consiglio* (parere di Claude, da discutere: la decisione è vostra). #"Sì, ma piccolo: parti con un gruppo WhatsApp per esame, gestito dagli ambassador, e misura quanti entrano. Il matching dentro l'app solo se i gruppi funzionano. Un social network completo costa moderazione e privacy: non ora."]
#sub[Panoramica]
#tab(("", ""), (22%, 78%), (("Obiettivo", "Far trovare a chi prepara un esame un gruppo di compagni, senza creare un social network da moderare."), ("Per chi", "Studenti di Economia (I–III anno) che preparano un appello e studiano meglio in compagnia; ambassador che li accolgono."), ("Quando serve", "Prima della sessione d'esame di gennaio: i gruppi servono quando le persone studiano."), ("Stima", "8–10 giorni di lavoro (pilota con 5 esami)"), ("Dove vive", "Pagina Community (sezione «Studia insieme»); il matching vero vive nell'area personale (D08).")))
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  box-crema(fill: nvt)[*Versione minima (MVP)* \
- #"Sezione «Studia insieme» nella pagina Community, con ricerca dell'esame"
- #"Un gruppo WhatsApp per esame, aperto e gestito da un ambassador"
- #"Pilota con 5 esami del I e II anno"
- #"Regole del gruppo scritte e visibili prima di entrare"
- #"Form per proporre un gruppo o candidarsi come ambassador"],
  box-crema(fill: ar2)[*Dopo* \
- #"«Cerco un gruppo» nell'area personale, con scelta esplicita (card D08 della web app)"
- #"Gruppi in presenza a Novoli per fascia oraria"
- #"Estensione a tutti i 34 esami e agli altri hub"],
  box-crema(fill: crema2)[*Non lo facciamo* \
- #"Chat o forum dentro UniLink"
- #"Profili pubblici degli studenti"
- #"Messaggi privati tra studenti"
- #"Moderazione automatica con AI"])
#sub[Pagine annotate]
Le pagine come sarebbero, sezione per sezione. Ogni numero è seguito da: perché la sezione c'è e cosa puoi cambiare senza rifare il design.
#block(above: 10pt, below: 2pt, text(size: 11.5pt)[#"Community · Studia insieme"]) #text(size: 8pt, fill: nv2)[#"community.html#studia-insieme — Nuova sezione nella pagina Community (S11). Si raggiunge anche dal link «Gruppi di studio» nella scheda di ogni esame dell'area personale."]
#sezione(1, "Hero", "G1", "Dice subito cosa si ottiene e porta alla ricerca: chi arriva da un link WhatsApp deve capire in cinque secondi.", "Titolo, frase e foto (CMS «Pagine» o direttamente in Framer). Il pulsante primario deve restare uno solo.", "LP/Hero · LP/Bottone", "img/L01-p0-s1.jpg")
#sezione(2, "Trova il tuo esame", "G2", "È la funzione vera della pagina: dal nome dell'esame al gruppo in due tocchi.", "L'elenco si legge dal CMS «Gruppi»: aggiungere un gruppo = una riga. Lo stato (attivo, in creazione, nessuno) decide badge e pulsante.", "Ricerca (LP/Cerca) · Chips · Riga esame (variante di LP/CardDispensa)", "img/L01-p0-s2.jpg")
#sezione(3, "Come funziona", "G3", "Toglie l'ansia del «cosa succede se clicco»: tre passi, nessun account.", "Tre frasi di testo (CMS «Pagine»).", "LP/Passo", "img/L01-p0-s3.jpg")
#sezione(4, "Le regole del gruppo", "G4", "Il numero visibile è ciò che sorprende di più: dirlo prima evita lamentele e protegge UniLink.", "I quattro testi si cambiano dal CMS «Regole»; la regola sul numero va sempre mantenuta.", "LP/Card", "img/L01-p0-s4.jpg")
#sezione(5, "Per gli ambassador", "G5", "Senza ambassador i gruppi non partono: la domanda e l'offerta stanno nella stessa pagina.", "Testi del riquadro e delle tre scelte del form; i campi si aggiungono dal form di Framer.", "LP/Finale (variante) · Form lista d'attesa", "img/L01-p0-s5.jpg")
#sezione(6, "Domande frequenti", "G6", "Risponde alle quattro paure tipiche (privacy, chi comanda, esame senza gruppo, uscire).", "Domande e risposte dal CMS «FAQ» (una per riga).", "LP/FAQ", "img/L01-p0-s6.jpg")
#sub[Dati · #"Collezione «Gruppi»"]
#text(size: 8pt, fill: nv2)[#"Dove: Framer CMS · Chi lo aggiorna: Ambassador, con controllo del founder responsabile · Quando: All'apertura, ogni mese e a fine sessione"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("esame", "riferimento a Dispense", "microeconomia (stesso identificativo del catalogo)"), ("hub", "testo", "economia"), ("anno_accademico", "testo", "2026/27"), ("stato", "scelta", "attivo · in_creazione · pieno · chiuso"), ("link_invito", "URL", "https://chat.whatsapp.com/… — mai mostrato se lo stato non è «attivo»"), ("ambassador", "testo", "Solo il nome di battesimo"), ("membri_stimati", "numero", "Aggiornato a mano: serve solo a dare un ordine di grandezza"), ("ultimo_controllo", "data", "Se più vecchio di 30 giorni il badge diventa «Da verificare» e il link si nasconde"), ("note_interne", "testo", "Non pubblicato")))
#sub[Dati · #"Tabella «Proposte gruppo»"]
#text(size: 8pt, fill: nv2)[#"Dove: Supabase, alimentata dal form · Chi lo aggiorna: Il founder responsabile della community · Quando: Entro 3 giorni dalla richiesta"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("id", "identificativo", "automatico"), ("esame", "testo", "Statistica"), ("anno", "scelta", "I · II · III"), ("ruolo", "scelta", "vorrei_entrare · voglio_aprirlo · ambassador"), ("email", "email", "Solo per rispondere. Cancellata dopo 6 mesi (ipotesi)."), ("consenso", "sì/no", "Obbligatorio per inviare"), ("creato_il", "data", "automatico"), ("stato", "scelta", "nuova · in_corso · chiusa")))
#sub[Regole]
- #"Un solo gruppo ufficiale per esame e anno accademico: due gruppi dello stesso esame dividono le persone e nessuno dei due funziona."
- #"Il link d'invito si mostra solo se lo stato è «attivo» e l'ultimo controllo ha meno di 30 giorni."
- #"Ogni gruppo ha almeno un ambassador noto al team; senza ambassador il gruppo passa a «in creazione»."
- #"Un gruppo si chiude (stato «chiuso», link nascosto) a fine sessione d'esame e si riapre il semestre dopo."
- #"UniLink non entra nei gruppi per leggerli: l'ambassador segnala al team solo ciò che serve."
- #"Le regole del gruppo (quattro punti) si mostrano sempre prima del link."
#sub[Stati]
#tab(("Stato", "Cosa vede lo studente", "Testo"), (22%, 38%, 40%), (("Gruppo attivo", "Badge «Attivo» e pulsante «Entra»", "Entra nel gruppo"), ("In creazione", "Badge «In creazione», pulsante «Aiutaci»", "Lo stiamo aprendo: vuoi dare una mano?"), ("Nessun gruppo", "Nessun badge, pulsante «Proponilo»", "Nessun gruppo ancora per questo esame. Proponilo: se siete in tre, lo apriamo."), ("Gruppo pieno", "Badge «Pieno», link nascosto", "Il gruppo è pieno. Scrivici: ne apriamo un altro."), ("Link scaduto o vecchio", "Come «In creazione», senza link", "Il link non funziona più: ci stiamo lavorando."), ("Errore del form", "Messaggio sotto il campo", "Scrivi un'email valida. / Serve il consenso per risponderti.")))
#sub[Testi proposti]
#tab(("Elemento", "Testo"), (28%, 72%), (("Titolo", "Prepara l'esame con altri"), ("Frase", "Trova il gruppo del tuo esame, entra con un tocco e studia con chi è nel tuo stesso punto."), ("Pulsante principale", "Trova il tuo esame"), ("Campo di ricerca", "Cerca il tuo esame, es. Microeconomia"), ("Badge gruppo attivo", "Attivo"), ("Pulsante del gruppo", "Entra nel gruppo"), ("Avviso sul numero", "In WhatsApp il tuo numero è visibile a chi è nel gruppo."), ("Stato vuoto", "Nessun gruppo ancora per questo esame. Proponilo: se siete in tre, lo apriamo."), ("Conferma del form", "Fatto! Ti scriviamo entro 3 giorni."), ("Consenso", "Usate la mia email solo per rispondermi su questo gruppo.")))
#sub[Misure]
#tab(("Evento", "Quando scatta", "Perché"), (28%, 36%, 36%), (("cerca_esame_gruppi", "Si scrive nella ricerca", "Capire quali esami cercano di più"), ("clic_entra_gruppo", "Clic su «Entra nel gruppo» (con il nome dell'esame)", "Misura l'interesse vero, esame per esame"), ("proposta_gruppo", "Invio del form", "Domanda di gruppi che non esistono ancora"), ("candidatura_ambassador", "Invio del form con ruolo ambassador", "Quanti vogliono aiutare"), ("clic_esame_senza_gruppo", "Clic su un esame senza gruppo", "Dove aprire il prossimo gruppo")))
#sub[Integrazioni]
#tab(("Strumento", "Cosa fa", "Come si collega"), (24%, 30%, 46%), (("WhatsApp", "Link d'invito a un gruppo per esame", "Il link chat.whatsapp.com lo copia l'ambassador nel CMS; nessuna API"), ("Framer CMS", "Elenco dei gruppi e testi delle regole", "Collezione «Gruppi» collegata alla lista, con filtro per anno e ricerca"), ("Form → Supabase", "Salva proposte e candidature", "Form Framer con webhook verso la tabella «Proposte gruppo» (come la lista d'attesa)"), ("Analytics (GA4)", "Conta gli eventi", "Eventi con il nome dell'esame; solo con il consenso ai cookie")))
#sub[Da verificare (legale e privacy)]
- #"Il numero di telefono è visibile ai membri del gruppo WhatsApp: scriverlo nelle regole e nella pagina, prima del link."
- #"Email dei form: informativa, consenso separato, conservazione limitata (proposta: 6 mesi) e cancellazione su richiesta."
- #"UniLink non raccoglie né legge i dati dei membri: l'ambassador è un volontario. Verificare con un consulente se il ruolo richiede un'informativa specifica."
- #"Regole contro la vendita di appunti e contro i contenuti protetti da diritto d'autore: scriverle con chiarezza e farle rispettare."
#sub[Manutenzione]
#tab(("Cosa", "Chi", "Ogni quanto", "Come"), (26%, 22%, 22%, 30%), (("Link d'invito dei gruppi", "Ambassador", "Ogni mese e a inizio semestre", "Provare il link da un telefono e aggiornare «ultimo controllo»"), ("Nuovi gruppi e candidature", "Founder responsabile della community", "Entro 3 giorni", "Leggere le proposte, rispondere, aggiungere la riga nel CMS"), ("Chiusura a fine sessione", "Founder responsabile", "Dopo ogni sessione", "Stato «chiuso» e link nascosto"), ("Regole del gruppo", "Team", "Una volta l'anno o se succede un problema", "Aggiornare il testo nel CMS «Regole»"), ("Controllo dei risultati", "Team", "Ogni mese", "Guardare gli eventi e decidere se continuare")))
#sub[Piano di lavoro · #"8–10 giorni di lavoro (pilota con 5 esami)"]
#tab(("N.", "Passo", "Dove", "Giorni"), (6%, 52%, 26%, 16%), (("1", "Scrivere le regole del gruppo e la frase sul numero visibile", "Documento + CMS «Regole»", "0,5"), ("2", "Collezione «Gruppi» e dati del pilota (5 esami)", "Framer CMS", "1"), ("3", "Sezione «Studia insieme»: hero, ricerca, elenco, passi, regole", "community.html", "3"), ("4", "Stati dei gruppi e stato vuoto", "community.html", "1"), ("5", "Form «Proponi un gruppo / ambassador» e tabella", "Framer + Supabase", "1,5"), ("6", "Eventi di misura e consenso ai cookie", "Analytics", "0,5"), ("7", "Aprire i 5 gruppi con gli ambassador (lavoro umano)", "WhatsApp", "2"), ("8", "Prova con 3 studenti su telefono e correzioni", "Tutta la pagina", "1"), ("9", "Annuncio nei gruppi esistenti", "WhatsApp", "0,5")))
#sub[Rischi]
#tab(("Rischio", "Come lo riduci"), (38%, 62%), (("Gruppi che si svuotano subito", "Pilota su 5 esami e regola di chiusura: meglio pochi gruppi vivi che 34 morti."), ("Spam o vendita di appunti", "Regole in vista, ambassador che rimuove, segnalazione al team."), ("Link scaduti o gruppi pieni", "Controllo mensile e «ultimo controllo» che nasconde il link se vecchio."), ("Un ambassador sparisce", "Un secondo riferimento nel team; il gruppo passa a «in creazione»."), ("Carico sul team", "Un solo founder responsabile e limite di 5 gruppi nel pilota.")))
#sub[Come capisci se funziona]
#tab(("Metrica", "Soglia (ipotesi)", "Entro"), (44%, 34%, 22%), (("Gruppi pilota con almeno 15 membri", "4 su 5", "4 settimane dal lancio"), ("Clic su «Entra nel gruppo» a settimana", "Almeno 30", "4 settimane"), ("Candidature da ambassador", "Almeno 3", "4 settimane")))
#nota[*Regola di stop.* #"Se dopo 4 settimane meno di 2 gruppi su 5 sono attivi (almeno 15 membri) e i clic sono sotto 10 a settimana, non estendere: lasciare solo il gruppo per anno e riconsiderare con il matching dell'area personale (D08)."]
#sub[Prompt per l'AI]
Da incollare insieme a CONTESTO_DEMO.md.
#block(fill: navy, radius: 8pt, inset: 10pt, width: 100%, text(fill: crema, size: 8pt)[#raw("Richiesta di tipo C (promuovi) per la landing UniLink.\n\nContesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L01 («Gruppi di studio») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).\n\nCosa fare:\n- Aggiungi in community.html la sezione «Studia insieme» come nella scheda (6 sezioni, testi e stati).\n- Crea la collezione «Gruppi» e la tabella «Proposte gruppo» come nei dati.\n- Aggiungi gli eventi di misura, il consenso ai cookie e il form con consenso.\n- Parti dal pilota con 5 esami; non fare il matching nell'area personale (resta D08).\n\nRegole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.", block: false)])
#sub[Cosa serve · da decidere · origine]
- #"Un ambassador per esame (o per anno)"
- #"Regole di moderazione scritte"
- #"Informativa privacy per chi cerca un gruppo"
- #"Basta il gruppo WhatsApp per esame o serve il matching?"
- #"Chi modera? (ambassador, team)"
- #"I profili sono visibili tra studenti?"
#text(size: 8pt, fill: nv2)[#"Origine: Nota Matteo 6/10 · HQ SOCIALNETWORK (Gianmarco)"]

#scheda("L02", "Metodo e piano di studio", "Metodo · impatto 5/5 · sforzo 3/5 · web app D04")
#box-crema[*Il problema.* #"Lo studente ha dispense e data d'appello, ma non sa come distribuire lo studio: è dove oggi UniLink non aiuta." \ \ *La proposta.* #"Una pagina «Il metodo» che spiega come studiamo (capire → fissare → allenarsi) e mostra il piano personalizzato: dalla data dell'appello e dagli argomenti, un calendario che si aggiorna mentre studi. Prima a regole semplici, poi adattivo."]
#nota[*Il consiglio* (parere di Claude, da discutere: la decisione è vostra). #"È il tuo differenziatore più forte: le dispense le hanno tutti, il metodo no. Parti con il piano a regole (già funzionante nella demo) e contenuti scritti dal team; l'AI adattiva è una fase successiva, quando ci sono dati di studio reali."]
#sub[Panoramica]
#tab(("", ""), (22%, 78%), (("Obiettivo", "Far capire come si studia con UniLink e dare a ogni studente un piano dalla data dell'appello: il motivo per scegliere UniLink invece di una dispensa qualsiasi."), ("Per chi", "Chi ha una data d'esame e non sa come distribuire gli argomenti, in particolare matricole e studenti con poco tempo."), ("Quando serve", "Prima della sessione di gennaio: il piano è la funzione più utile nelle settimane prima degli appelli."), ("Stima", "10–14 giorni di lavoro (fase 1: piano a regole, senza AI)"), ("Dove vive", "Pagina «Durante» (sezione Metodo e piano) + strumento «Piano per l'appello» (già in tools) + scheda Piano nell'area personale (D04).")))
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  box-crema(fill: nvt)[*Versione minima (MVP)* \
- #"Pagina «Il metodo» con le tre mosse e un esempio vero su un esame"
- #"Piano per l'appello a regole semplici (già nella demo): data, argomenti, giorni di ripasso"
- #"Argomenti ufficiali per i primi 5 esami"
- #"Passaggio verso «Il mio piano» nell'area personale"
- #"Messaggi chiari su cosa è gratuito"],
  box-crema(fill: ar2)[*Dopo* \
- #"Piano che si ricalcola se salti un giorno"
- #"Promemoria via email il giorno prima"
- #"Piano adattivo che pesa gli errori dei quiz, con AI"
- #"Tutti i 34 esami"],
  box-crema(fill: crema2)[*Non lo facciamo* \
- #"Promesse sul voto finale"
- #"Consigli su benessere o salute"
- #"Calendari condivisi tra studenti"])
#sub[Pagine annotate]
Le pagine come sarebbero, sezione per sezione. Ogni numero è seguito da: perché la sezione c'è e cosa puoi cambiare senza rifare il design.
#block(above: 10pt, below: 2pt, text(size: 11.5pt)[#"Il metodo"]) #text(size: 8pt, fill: nv2)[#"metodo.html — Nuova pagina nella fase Durante. La sezione «Metodo e piano» di durante.html diventa un'anteprima con link."]
#sezione(1, "Hero", "M1", "Promette una cosa sola e concreta: un piano. Il pulsante porta direttamente allo strumento.", "Titolo, frase, foto (CMS «Pagine»). Tenere un solo pulsante primario.", "LP/Hero", "img/L02-p0-s1.jpg")
#sezione(2, "Le tre mosse", "M2", "È il «metodo»: tre verbi che si ricordano. Rende UniLink diverso da un archivio di PDF.", "Tre titoli e tre frasi (CMS). Se cambia il metodo, cambiano solo queste righe.", "LP/Passo", "img/L02-p0-s2.jpg")
#sezione(3, "Prova il piano", "M3", "Il piano funziona subito, senza account: chi lo prova capisce il valore in 20 secondi.", "Parametri (giorni di ripasso, massimo al giorno) in tools.js; l'aspetto è lo stesso di tutti gli strumenti.", "LP/Strumento", "img/L02-p0-s3.jpg")
#sezione(4, "Un esempio vero", "M4", "Un esempio concreto convince più di una spiegazione.", "Si sostituisce con l'esame più cercato; gli argomenti vengono dalla collezione «Argomenti».", "LP/Card · Lista", "img/L02-p0-s4.jpg")
#sezione(5, "Dopo l'accesso", "M5", "Mostra cosa succede dopo: il piano non resta una pagina, diventa un calendario.", "Lo screenshot si rifà dalla web app quando cambia.", "Schermata reale (img/app)", "img/L02-p0-s5.jpg")
#sezione(6, "Cosa è gratis", "M6", "Onestà sul prezzo: dice cosa c'è e cosa è ancora da decidere, senza inventare prezzi.", "Testi; quando L07 è decisa si sostituisce con il listino vero.", "LP/Card", "img/L02-p0-s6.jpg")
#sezione(7, "Domande frequenti", "M7", "Toglie l'equivoco più pericoloso (promessa sul voto) e spiega la fonte.", "Domande dal CMS «FAQ».", "LP/FAQ", "img/L02-p0-s7.jpg")
#sezione(8, "Chiamata finale", "M8", "Una sola azione a fine pagina.", "Testo e due pulsanti.", "LP/Finale", "img/L02-p0-s8.jpg")
#sub[Dati · #"Collezione «Argomenti»"]
#text(size: 8pt, fill: nv2)[#"Dove: Framer CMS (o CSV: stessa fonte delle dispense) · Chi lo aggiorna: Autori delle dispense · Quando: Ogni anno e se cambia il programma"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("esame", "riferimento a Dispense", "microeconomia"), ("ordine", "numero", "1…n: ordine consigliato di studio"), ("titolo", "testo", "Domanda e offerta"), ("ore_stimate", "numero", "3 (stima di studio, non di lezione)"), ("tipo", "scelta", "base · avanzato · ripasso"), ("fonte", "testo", "Programma ufficiale, a.a. 2026/27"), ("verificato", "sì/no", "Controllato da chi ha dato l'esame")))
#sub[Dati · #"Parametri del piano"]
#text(size: 8pt, fill: nv2)[#"Dove: tools.js (o variabili Framer) · Chi lo aggiorna: Team · Quando: Dopo i primi 100 piani"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("giorni_ripasso_default", "numero", "2"), ("min_giorni_prima", "numero", "3: sotto questa soglia si avvisa «poco tempo»"), ("max_argomenti_giorno", "numero", "3"), ("durata_sessione_min", "numero", "45"), ("ricalcolo", "sì/no", "no nella fase 1; sì nella fase 2")))
#sub[Regole]
- #"Tutti gli argomenti prima, poi i giorni di ripasso: l'ultimo giorno è sempre ripasso e simulazione."
- #"Un argomento al giorno è il ritmo base; se mancano pochi giorni se ne mettono due, mai più del massimo."
- #"Se i giorni non bastano il piano lo dice, invece di nascondere il problema, e propone cosa togliere (il ripasso)."
- #"L'ordine degli argomenti è quello del programma, non quello più facile."
- #"Il piano usa solo dati inseriti dallo studente (data, argomenti): nessuna previsione del voto."
- #"Fase 2: ricalcolo e AI possono cambiare l'ordine, mai nascondere argomenti del programma."
#sub[Stati]
#tab(("Stato", "Cosa vede lo studente", "Testo"), (22%, 38%, 40%), (("Nessuna data", "Il piano chiede la data dell'appello", "Scegli la data del tuo appello per creare il piano."), ("Pochi giorni", "Avviso arancio e piano compresso", "Hai poco tempo: abbiamo messo due argomenti al giorno."), ("Impossibile", "Il piano spiega e propone un'alternativa", "Con questi giorni non bastano: togli il ripasso o sposta l'appello."), ("Piano pronto", "Calendario con le sessioni", "Il tuo piano è pronto: 7 argomenti in 21 giorni."), ("Appello passato", "Invito a creare un nuovo piano", "Questo appello è passato. Vuoi preparare il prossimo?")))
#sub[Testi proposti]
#tab(("Elemento", "Testo"), (28%, 72%), (("Titolo", "Studia con un piano, non a caso"), ("Frase", "Dalla data dell'appello al giorno dell'esame, un passo per volta."), ("Pulsante principale", "Crea il tuo piano"), ("Tre mosse", "Capisci · Fissa · Allenati"), ("Avviso onestà", "Il piano ti aiuta a organizzarti: non garantisce il voto."), ("Passaggio all'area", "Portalo nella tua area personale"), ("Fonte", "Argomenti dal programma ufficiale, aggiornato a ottobre 2026")))
#sub[Misure]
#tab(("Evento", "Quando scatta", "Perché"), (28%, 36%, 36%), (("piano_creato", "Si genera un piano", "Quanti lo usano davvero"), ("piano_data_scelta", "Si imposta la data", "Quanto manca in media: serve a tarare i giorni di ripasso"), ("piano_verso_area", "Clic su «Apri l'area personale» dal piano", "Passaggio da landing ad area"), ("piano_impossibile", "Il piano non basta", "Se le regole sono troppo severe"), ("metodo_esempio_visto", "L'esempio entra nello schermo", "Se la pagina viene letta fino in fondo")))
#sub[Integrazioni]
#tab(("Strumento", "Cosa fa", "Come si collega"), (24%, 30%, 46%), (("tools.js (funzione «piano»)", "Calcola il calendario", "In Framer come componente di codice: la funzione si copia così com'è"), ("Collezione «Argomenti»", "Fornisce gli argomenti dell'esame", "Lettura dal CMS o da CSV: stessa fonte delle dispense"), ("Area personale (web app)", "Salva e mostra il piano", "Il piano si porta nell'area con un link (parametri: esame e data) e diventa «Il mio piano»"), ("AI (fase 2)", "Rende il piano adattivo", "API del modello a scelta; costi per richiesta e limiti da decidere")))
#sub[Da verificare (legale e privacy)]
- #"Nessuna promessa sul voto o sull'esito dell'esame."
- #"Il programma degli esami è quello ufficiale: citare la fonte e la data."
- #"Fase 2 con AI: informativa su cosa viene inviato al modello; niente dati personali nei prompt."
- #"Dati dello studente (date, argomenti spuntati) nell'area: informativa e cancellazione."
#sub[Manutenzione]
#tab(("Cosa", "Chi", "Ogni quanto", "Come"), (26%, 22%, 22%, 30%), (("Argomenti degli esami", "Autori delle dispense", "Ogni anno e se cambia il programma", "Aggiornare la collezione «Argomenti» e la data di verifica"), ("Parametri del piano", "Team", "Dopo i primi 100 piani", "Guardare gli eventi e cambiare giorni di ripasso e massimo al giorno"), ("Testi dell'esempio", "Team", "Una volta l'anno", "Ricontrollare che l'esempio rispecchi il programma"), ("Costi dell'AI (fase 2)", "Founder responsabile del prodotto", "Ogni mese", "Controllare consumi e limiti")))
#sub[Piano di lavoro · #"10–14 giorni di lavoro (fase 1: piano a regole, senza AI)"]
#tab(("N.", "Passo", "Dove", "Giorni"), (6%, 52%, 26%, 16%), (("1", "Raccogliere gli argomenti ufficiali dei primi 5 esami", "Collezione «Argomenti»", "2"), ("2", "Pagina «Il metodo»: hero, tre mosse, esempio, FAQ", "metodo.html", "3"), ("3", "Collegare lo strumento «Piano» agli argomenti dell'esame", "tools.js + CMS", "2"), ("4", "Passaggio verso l'area personale (parametri esame e data)", "Landing + web app", "2"), ("5", "Trasformare la sezione «Metodo» di Durante in anteprima con link", "durante.html", "0,5"), ("6", "Eventi di misura", "Analytics", "0,5"), ("7", "Prova con 5 studenti con un appello vero", "Tutta la pagina", "2"), ("8", "Correzioni e annuncio", "Landing + WhatsApp", "1")))
#sub[Rischi]
#tab(("Rischio", "Come lo riduci"), (38%, 62%), (("Il piano sembra una promessa", "Testi chiari: aiuta a organizzare, non garantisce il voto."), ("Argomenti sbagliati o vecchi", "Verifica annuale e data della fonte visibile."), ("Chi non ha tempo riceve un piano impossibile", "Stato «impossibile» onesto, con alternativa."), ("Costi e complessità dell'AI", "Non in fase 1: partire a regole e decidere dopo, con i dati veri."), ("Sovrapposizione con il piano guidato Plus dell'app", "Decidere il confine gratis/Plus in L07 e D04 prima di promettere.")))
#sub[Come capisci se funziona]
#tab(("Metrica", "Soglia (ipotesi)", "Entro"), (44%, 34%, 22%), (("Piani creati a settimana", "Almeno 50 nel mese prima della sessione", "Sessione di gennaio"), ("Passaggi verso l'area personale", "Almeno il 20% di chi crea un piano", "4 settimane"), ("Chi dice «mi ha aiutato»", "Almeno 7 su 10", "Dopo l'appello")))
#nota[*Regola di stop.* #"Se meno del 10% di chi apre la pagina crea un piano, il problema è il messaggio, non la funzione: riscrivere hero e passi prima di aggiungere l'AI."]
#sub[Prompt per l'AI]
Da incollare insieme a CONTESTO_DEMO.md.
#block(fill: navy, radius: 8pt, inset: 10pt, width: 100%, text(fill: crema, size: 8pt)[#raw("Richiesta di tipo C (promuovi) per la landing UniLink.\n\nContesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L02 («Metodo e piano di studio») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).\n\nCosa fare:\n- Crea metodo.html con le 8 sezioni della scheda e collega «Il metodo» dal menu Durante.\n- Aggiungi la collezione «Argomenti» e collega lo strumento «piano» agli argomenti dell'esame.\n- Trasforma la sezione Metodo di durante.html in anteprima con link.\n- Fase 1 soltanto: regole semplici, nessuna AI.\n\nRegole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.", block: false)])
#sub[Cosa serve · da decidere · origine]
- #"Argomenti ufficiali per esame (dal programma)"
- #"Regola di distribuzione (già in tools.js)"
- #"Dati di studio reali per renderlo adattivo (fase 2)"
- #"Il piano è gratis o fa parte di un pacchetto?"
- #"Promemoria via email il giorno prima?"
- #"Quando introdurre l'AI?"
#text(size: 8pt, fill: nv2)[#"Origine: Nota Matteo 6/10 · riferimento «piano» stile TTP (GMAT)"]

#scheda("L03", "Mentoring tra pari", "Community · impatto 4/5 · sforzo 5/5")
#box-crema[*Il problema.* #"Gli studenti più avanti sanno cose che i più giovani cercano, ma oggi lo scambio non è organizzato." \ \ *La proposta.* #"Un mentore (studente dell'ultimo anno o laureato) per ogni esame o per il percorso: una chiamata, domande ricorrenti, consigli. Si parte dagli ambassador che già avete."]
#nota[*Il consiglio* (parere di Claude, da discutere: la decisione è vostra). #"Bello per la fiducia, ma è il più costoso da gestire (selezione, qualità, pagamenti, responsabilità). Non al lancio: fai una prova manuale con 5 ambassador e 20 studenti, misura se si ripete, poi decidi se costruirlo."]
#sub[Panoramica]
#tab(("", ""), (22%, 78%), (("Obiettivo", "Far parlare chi prepara un esame o una scelta con chi ci è già passato, in modo sicuro e misurabile, prima di costruire strumenti."), ("Per chi", "Matricole e studenti che scelgono Erasmus, tesi o magistrale; mentori: studenti avanzati e laureati."), ("Quando serve", "Dopo i gruppi di studio (L01): prima servono ambassador che funzionano."), ("Stima", "12–16 giorni, in gran parte lavoro umano (pilota di 4 settimane)"), ("Dove vive", "Pagina Community (sezione «Parla con chi ci è già passato») e, più avanti, prenotazione nell'area personale.")))
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  box-crema(fill: nvt)[*Versione minima (MVP)* \
- #"Prova manuale con 5 mentori e 20 studenti, per 4 settimane"
- #"Form di richiesta e abbinamento a mano (WhatsApp o Google Meet)"
- #"Sezione in Community con come funziona, regole e profili (solo con consenso)"
- #"Chiamata di 20 minuti, gratuita"
- #"Feedback di due domande dopo ogni chiamata"],
  box-crema(fill: ar2)[*Dopo* \
- #"Prenotazione in autonomia con un calendario"
- #"Mentoring per percorso (tesi, Erasmus, magistrali)"
- #"Crediti o compenso per i mentori"
- #"«I miei mentori» nell'area personale"],
  box-crema(fill: crema2)[*Non lo facciamo* \
- #"Pagamenti al lancio"
- #"Chat dentro UniLink"
- #"Ripetizioni a pagamento a nome di UniLink"
- #"Promesse di risultato"])
#sub[Pagine annotate]
Le pagine come sarebbero, sezione per sezione. Ogni numero è seguito da: perché la sezione c'è e cosa puoi cambiare senza rifare il design.
#block(above: 10pt, below: 2pt, text(size: 11.5pt)[#"Community · Parla con chi ci è già passato"]) #text(size: 8pt, fill: nv2)[#"community.html#mentori — Nuova sezione nella pagina Community (S11), dopo «Studia insieme»."]
#sezione(1, "Hero", "T1", "Promette una cosa precisa (20 minuti) e dice a chi serve.", "Titolo, frase, foto.", "LP/Hero", "img/L03-p0-s1.jpg")
#sezione(2, "Come funziona", "T2", "Spiega che l'abbinamento è fatto da persone, non da un algoritmo: dà fiducia.", "Tre frasi.", "LP/Passo", "img/L03-p0-s2.jpg")
#sezione(3, "Alcuni mentori", "T3", "Le persone convincono più delle promesse: ma si pubblica solo chi acconsente.", "Un profilo = una riga del CMS «Mentori» con il consenso registrato.", "LP/Persona (variante)", "img/L03-p0-s3.jpg")
#sezione(4, "Le regole", "T4", "Mette per iscritto i limiti: protegge studenti, mentori e UniLink.", "Testi dal CMS «Regole».", "LP/Card", "img/L03-p0-s4.jpg")
#sezione(5, "Chiedi un mentore", "T5", "L'unica azione della pagina: breve e con il consenso in vista.", "Campi del form (Framer); il consenso resta obbligatorio.", "LP/Form", "img/L03-p0-s5.jpg")
#sezione(6, "Diventa mentore", "T6", "Senza mentori il servizio non esiste: l'offerta ha lo stesso peso della domanda.", "Testo e pulsanti.", "LP/Finale", "img/L03-p0-s6.jpg")
#sezione(7, "Domande frequenti", "T7", "Prezzo, chi sono, scelta, dati: le quattro domande che bloccano la richiesta.", "CMS «FAQ».", "LP/FAQ", "img/L03-p0-s7.jpg")
#sub[Dati · #"Collezione «Mentori» (pubblica)"]
#text(size: 8pt, fill: nv2)[#"Dove: Framer CMS · Chi lo aggiorna: Team, con i mentori · Quando: Ogni mese"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("nome_pubblico", "testo", "Giulia"), ("corso_anno", "testo", "III anno EA"), ("aiuta_su", "elenco", "Microeconomia, Statistica"), ("disponibilita", "testo", "Martedì e giovedì"), ("foto", "immagine", "Facoltativa, solo con consenso"), ("consenso_pubblicazione", "data", "Data del consenso scritto; senza data il profilo non si pubblica"), ("attivo", "sì/no", "Si spegne se il mentore non è disponibile")))
#sub[Dati · #"Tabella «Mentori» (privata)"]
#text(size: 8pt, fill: nv2)[#"Dove: Supabase, accesso solo al team · Chi lo aggiorna: Founder responsabile della community · Quando: Alla selezione"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("id", "identificativo", "automatico"), ("email", "email", "Contatto reale: mai pubblicato"), ("telefono", "testo", "Facoltativo"), ("regole_firmate", "data", "Obbligatoria prima della prima chiamata"), ("chiamate_settimana", "numero", "Massimo 3 nel pilota"), ("note", "testo", "Solo per il team")))
#sub[Dati · #"Tabella «Richieste mentore»"]
#text(size: 8pt, fill: nv2)[#"Dove: Supabase, alimentata dal form · Chi lo aggiorna: Founder responsabile della community · Quando: Entro 3 giorni lavorativi"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("argomento", "testo", "Statistica"), ("disponibilita", "testo", "Martedì pomeriggio"), ("email", "email", "Solo per organizzare. Cancellata dopo 6 mesi (ipotesi)."), ("consenso", "sì/no", "Obbligatorio"), ("stato", "scelta", "nuova · abbinata · svolta · annullata"), ("mentore_id", "riferimento", "Chi è stato abbinato"), ("feedback_voto", "1–5", "Dopo la chiamata"), ("feedback_testo", "testo", "Facoltativo")))
#sub[Regole]
- #"Il mentore non pubblica mai il suo contatto: l'abbinamento passa dal team."
- #"Un mentore ha al massimo 3 chiamate a settimana nel pilota."
- #"Il team abbina entro 3 giorni lavorativi o scrive il motivo del ritardo."
- #"Una chiamata dura 20 minuti, su Meet o in presenza in un luogo pubblico."
- #"Dopo la chiamata partono due domande di feedback (voto 1–5 e «lo consiglieresti?»)."
- #"Un mentore con due feedback negativi viene sospeso e rivisto dal team."
- #"Niente pagamenti né regali nel pilota."
#sub[Stati]
#tab(("Stato", "Cosa vede lo studente", "Testo"), (22%, 38%, 40%), (("Nessun mentore disponibile", "Messaggio onesto e lista d'attesa", "Per questo argomento non abbiamo ancora un mentore. Ti avvisiamo appena c'è."), ("Richiesta inviata", "Conferma con i tempi", "Fatto! Ti scriviamo entro 3 giorni lavorativi."), ("Abbinato", "Email con il nome del mentore e gli orari", "Ti presentiamo Giulia: ecco gli orari possibili."), ("Svolta", "Richiesta di feedback", "Com'è andata? Bastano due domande."), ("Annullata", "Conferma", "Chiamata annullata: puoi richiederne un'altra.")))
#sub[Testi proposti]
#tab(("Elemento", "Testo"), (28%, 72%), (("Titolo", "Parla con chi ci è già passato"), ("Frase", "Una chiamata di 20 minuti con uno studente più avanti di te."), ("Pulsante principale", "Chiedi un mentore"), ("Regola chiave", "Un mentore dà consigli, non promette voti."), ("Consenso", "Ho letto l'informativa: usate i miei dati solo per organizzare la chiamata."), ("Conferma", "Fatto! Ti scriviamo entro 3 giorni lavorativi."), ("Feedback", "Com'è andata? Dai un voto da 1 a 5.")))
#sub[Misure]
#tab(("Evento", "Quando scatta", "Perché"), (28%, 36%, 36%), (("richiesta_mentore", "Invio del form", "Domanda reale"), ("candidatura_mentore", "Invio del form dei mentori", "Offerta"), ("tempo_abbinamento", "Giorni tra richiesta e abbinamento", "Capacità del team"), ("chiamata_svolta", "Chiamata effettuata", "Quante richieste diventano chiamate"), ("feedback_voto", "Voto 1–5", "Qualità")))
#sub[Integrazioni]
#tab(("Strumento", "Cosa fa", "Come si collega"), (24%, 30%, 46%), (("Form → Supabase", "Salva richieste e candidature", "Form Framer con webhook; tabelle private con accesso solo al team"), ("Google Meet / presenza", "Luogo della chiamata", "Link creato a mano dal team nel pilota"), ("Email", "Conferme e feedback", "Tre email manuali nel pilota; un servizio di invio solo dopo"), ("Calendario (fase 2)", "Prenotazione in autonomia", "Strumento a scelta, solo se il pilota funziona")))
#sub[Da verificare (legale e privacy)]
- #"Consenso scritto del mentore per pubblicare nome, corso e foto."
- #"Informativa sulle richieste: cosa raccogliamo, perché, per quanto tempo (proposta 6 mesi)."
- #"Regole di comportamento firmate dai mentori; niente registrazioni delle chiamate."
- #"Se un giorno ci sarà un compenso: aspetti fiscali e contrattuali da verificare con un consulente prima del lancio."
- #"Non offrire consulenza professionale (psicologica, legale) e dirlo."
#sub[Manutenzione]
#tab(("Cosa", "Chi", "Ogni quanto", "Come"), (26%, 22%, 22%, 30%), (("Abbinamenti e risposte", "Founder responsabile della community", "Entro 3 giorni", "Leggere la tabella e scrivere a entrambi"), ("Profili dei mentori", "Founder + mentori", "Ogni mese", "Aggiornare disponibilità e «attivo»"), ("Feedback", "Team", "Ogni 2 settimane", "Leggere voti e testi; sospendere o ringraziare"), ("Regole e informativa", "Team", "Una volta l'anno", "Rileggere con un consulente"), ("Pulizia dei dati", "Founder", "Ogni 6 mesi", "Cancellare le richieste chiuse da più di 6 mesi")))
#sub[Piano di lavoro · #"12–16 giorni, in gran parte lavoro umano (pilota di 4 settimane)"]
#tab(("N.", "Passo", "Dove", "Giorni"), (6%, 52%, 26%, 16%), (("1", "Decidere regole, criteri di selezione e informativa", "Documento", "1"), ("2", "Selezionare 5 mentori tra gli ambassador e raccogliere i consensi", "Lavoro umano", "2"), ("3", "Tabelle private e form (richiesta e candidatura)", "Supabase + Framer", "2"), ("4", "Sezione «Mentori» in Community: hero, passi, profili, regole, form, FAQ", "community.html", "3"), ("5", "Email manuali di conferma, abbinamento e feedback", "Email", "1"), ("6", "Pilota di 4 settimane: 20 richieste", "Lavoro umano", "4 settimane (poco tempo attivo)"), ("7", "Leggere i risultati e decidere", "Call", "0,5")))
#sub[Rischi]
#tab(("Rischio", "Come lo riduci"), (38%, 62%), (("Qualità dei mentori", "Selezione dal team, feedback dopo ogni chiamata, sospensione dopo due negativi."), ("Troppa richiesta e pochi mentori", "Limite di richieste in lista; messaggio onesto sui tempi."), ("Comportamenti scorretti", "Regole firmate, Meet o luoghi pubblici, segnalazione diretta al team."), ("Costo di gestione", "Pilota piccolo e a tempo: niente strumenti nuovi finché non si dimostra la domanda."), ("Aspettative di compenso o di risultato", "Dirlo nelle regole; niente promesse.")))
#sub[Come capisci se funziona]
#tab(("Metrica", "Soglia (ipotesi)", "Entro"), (44%, 34%, 22%), (("Richieste ricevute", "Almeno 20", "4 settimane"), ("Chiamate svolte", "Almeno 12 (60% delle richieste)", "4 settimane"), ("Voto medio di feedback", "Almeno 4 su 5", "4 settimane"), ("Chi ne rifarebbe una", "Almeno 7 su 10", "4 settimane")))
#nota[*Regola di stop.* #"Se le chiamate svolte restano sotto 8 su 20 richieste, o il voto medio è sotto 3,5, non costruire la prenotazione: tenere solo ambassador e gruppi."]
#sub[Prompt per l'AI]
Da incollare insieme a CONTESTO_DEMO.md.
#block(fill: navy, radius: 8pt, inset: 10pt, width: 100%, text(fill: crema, size: 8pt)[#raw("Richiesta di tipo C (promuovi) per la landing UniLink.\n\nContesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L03 («Mentoring tra pari») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).\n\nCosa fare:\n- Aggiungi in community.html la sezione «Mentori» come nella scheda (7 sezioni).\n- Crea le tre tabelle (pubblica, privata, richieste) con i campi indicati e il form con consenso.\n- Imposta il pilota manuale: nessuna prenotazione automatica, nessun pagamento.\n- Prepara i tre testi email (conferma, abbinamento, feedback).\n\nRegole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.", block: false)])
#sub[Cosa serve · da decidere · origine]
- #"Criteri di selezione dei mentori"
- #"Regole di comportamento e privacy"
- #"Decisione su gratuito/pagamento (e soggetto che incassa)"
- #"Strumento di prenotazione"
- #"Prova manuale con 5 ambassador prima di costruire?"
- #"Gratuito, con crediti o a pagamento?"
- #"Per esame o per percorso (tesi, Erasmus, magistrali)?"
#text(size: 8pt, fill: nv2)[#"Origine: Nota Matteo 6/10 (con punto interrogativo) · ambassador attuali"]

#scheda("L04", "Test d'ingresso (TOLC)", "Orientamento · impatto 5/5 · sforzo 5/5 · web app D12")
#box-crema[*Il problema.* #"Far conoscere UniLink ai futuri studenti prima dell'iscrizione: è il momento in cui scelgono come studiare." \ \ *La proposta.* #"Nella fase «Prima»: diagnostico gratuito di 20 domande e un percorso di preparazione per materia."]
#nota[*Il consiglio* (parere di Claude, da discutere: la decisione è vostra). #"Settore competitivo e a Firenze molti corsi sono ad accesso libero. Valuta dopo i nuovi hub: per Medicina il semestre filtro è un'opportunità più concreta del TOLC."]
#sub[Panoramica]
#tab(("", ""), (22%, 78%), (("Obiettivo", "Far incontrare UniLink ai futuri studenti prima dell'iscrizione, con un diagnostico gratuito e un percorso di preparazione nell'area personale (percorso Test Prep)."), ("Per chi", "Studenti dell'ultimo anno di superiori e chi si iscrive a corsi con test d'ingresso o con semestre filtro."), ("Quando serve", "Dopo i nuovi hub (L08), o in parallelo solo per Medicina: il semestre filtro è l'occasione più concreta. Se e come il test è richiesto a UniFi va verificato sul bando."), ("Stima", "15–20 giorni, di cui 6–8 per scrivere e verificare le domande"), ("Dove vive", "Pagina «Prima» (sezione Test d'ingresso), con diagnostico dentro la landing e percorso nell'area personale.")))
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  box-crema(fill: nvt)[*Versione minima (MVP)* \
- #"Pagina «Test d'ingresso» nella fase Prima, con scelta del corso e rimando alla fonte ufficiale"
- #"Diagnostico gratuito di 20 domande originali (logica e matematica), senza account"
- #"Risultato con punti forti e deboli e invito al percorso Test Prep nell'area"
- #"Banca iniziale di 80 domande originali, verificate da due persone"],
  box-crema(fill: ar2)[*Dopo* \
- #"Simulazioni a tempo nel formato del test"
- #"Registro errori e ripasso (già visibile nella web app demo)"
- #"Banca per le tre materie di Medicina (Fisica, Chimica, Biologia)"
- #"Piani a pagamento (L07)"],
  box-crema(fill: crema2)[*Non lo facciamo* \
- #"Copiare o parafrasare quesiti ufficiali"
- #"Promettere ammissione o punteggi"
- #"Dichiarare regole di ammissione senza fonte"])
#sub[Pagine annotate]
Le pagine come sarebbero, sezione per sezione. Ogni numero è seguito da: perché la sezione c'è e cosa puoi cambiare senza rifare il design.
#block(above: 10pt, below: 2pt, text(size: 11.5pt)[#"Test d'ingresso"]) #text(size: 8pt, fill: nv2)[#"test-ingresso.html — Nuova pagina nella fase Prima: sostituisce la scheda «Test d'ingresso» di prima.html, che diventa un rimando."]
#sezione(1, "Hero", "I1", "Promette una cosa piccola e subito utile; chi arriva dai social deve poter iniziare senza registrarsi.", "Titolo, frase e foto.", "LP/Hero", "img/L04-p0-s1.jpg")
#sezione(2, "Quale test devo fare?", "I2", "Prima di allenarsi bisogna sapere cosa serve davvero: UniLink indirizza alla fonte, non la sostituisce.", "Una riga per area dalla configurazione delle aree (nome, nota, fonte, ultimo controllo).", "LP/Card", "img/L04-p0-s2.jpg")
#sezione(3, "Il diagnostico", "I3", "Il quiz è il prodotto: una domanda per schermo, avanzamento sempre visibile, nessuna registrazione.", "Le domande vengono dalla banca; numero e mix per materia sono parametri.", "LP/Strumento (variante quiz)", "img/L04-p0-s3.jpg")
#sezione(4, "Il risultato", "I4", "Il risultato dà una direzione concreta e porta al prodotto, senza chiedere dati.", "Testi e soglie dei messaggi.", "LP/Finale", "img/L04-p0-s4.jpg")
#sezione(5, "Dopo l'accesso", "I5", "Mostra cosa si ottiene dopo il diagnostico, con schermate vere della web app.", "Gli screenshot si rifanno dalla web app.", "Schermate reali (img/app)", "img/L04-p0-s5.jpg")
#sezione(6, "Cosa è gratis", "I6", "Onestà sul modello: niente prezzi inventati.", "Testi; il listino vero arriva con L07.", "LP/Card", "img/L04-p0-s6.jpg")
#sezione(7, "Domande frequenti", "I7", "Chiarisce i due equivoci che creano problemi (obbligo del test e domande «vere»).", "CMS «FAQ».", "LP/FAQ", "img/L04-p0-s7.jpg")
#sub[Dati · #"Banca domande"]
#text(size: 8pt, fill: nv2)[#"Dove: Foglio CSV nel repository o tabella Supabase · Chi lo aggiorna: Autori e verificatori · Quando: Ogni anno e a ogni modifica del test"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("id", "identificativo", "q-0042"), ("area", "scelta", "economia · medicina"), ("materia", "scelta", "logica · matematica · fisica · chimica · biologia"), ("testo", "testo", "Un prodotto costa 80 €…"), ("opzioni", "4 testi", "A, B, C, D"), ("corretta", "scelta", "A"), ("spiegazione", "testo", "Passaggi del calcolo"), ("difficolta", "1–3", "2"), ("autore", "testo", "Chi l'ha scritta"), ("verificata_da", "2 nomi", "Obbligatori: senza due verifiche non entra in banca"), ("origine", "scelta", "originale (l'unico valore ammesso)")))
#sub[Dati · #"Test per area"]
#text(size: 8pt, fill: nv2)[#"Dove: Configurazione delle aree (come nella web app) · Chi lo aggiorna: Founder responsabile dei contenuti · Quando: Ogni 30 giorni nel periodo di iscrizione"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("area", "riferimento", "economia"), ("nome_test", "testo", "TOLC-E"), ("nota", "testo", "Verifica sul bando del tuo ateneo se e come è richiesto."), ("fonte_url", "URL", "Pagina ufficiale"), ("ultimo_controllo", "data", "Se più vecchio di 60 giorni la nota si nasconde")))
#sub[Dati · #"Risultati (facoltativi)"]
#text(size: 8pt, fill: nv2)[#"Dove: Supabase, solo con consenso · Chi lo aggiorna: Nessuno: servono solo per le statistiche aggregate · Quando: Mai a mano"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("data", "data", "automatico"), ("area", "scelta", "economia"), ("punteggio_per_materia", "numeri", "logica 8/10, matematica 6/10"), ("consenso", "sì/no", "Senza consenso non si salva nulla")))
#sub[Regole]
- #"Tutte le domande sono originali: nessun quesito ufficiale, nemmeno parafrasato."
- #"Ogni domanda è verificata da due persone prima di entrare in banca."
- #"Il diagnostico estrae 20 domande bilanciate per materia e difficoltà."
- #"Senza consenso il risultato non si salva: senza account non resta nulla."
- #"Le informazioni sul test (date, regole) mostrano sempre la fonte e la data dell'ultimo controllo."
- #"Nessuna promessa su punteggi o ammissione."
#sub[Stati]
#tab(("Stato", "Cosa vede lo studente", "Testo"), (22%, 38%, 40%), (("Prima domanda", "Barra di avanzamento", "Domanda 1 di 20"), ("In corso", "Una domanda per schermo, si può tornare indietro", "Domanda 12 di 20"), ("Risultato", "Punteggi per materia e consiglio", "Hai risposto bene a 14 domande su 20."), ("Test non noto", "Messaggio con rimando alla fonte", "Per questo corso non abbiamo informazioni verificate: controlla il bando."), ("Informazioni vecchie", "La nota sul test si nasconde", "Stiamo ricontrollando le informazioni su questo test."), ("Interrotto", "Riprende dal punto in cui eri (solo in questa visita)", "Vuoi riprendere da dove eri?")))
#sub[Testi proposti]
#tab(("Elemento", "Testo"), (28%, 72%), (("Titolo", "Capisci dove sei, prima del test"), ("Frase", "20 domande per vedere da dove partire. Gratis, senza account, due minuti."), ("Pulsante principale", "Fai il diagnostico"), ("Avviso domande", "Domande originali scritte per allenarti: non sono quelle del test ufficiale."), ("Avviso risultato", "Il risultato non viene salvato se non lo chiedi."), ("Rimando alla fonte", "Controlla sempre il bando ufficiale del tuo ateneo.")))
#sub[Misure]
#tab(("Evento", "Quando scatta", "Perché"), (28%, 36%, 36%), (("diagnostico_iniziato", "Prima risposta", "Quante persone provano"), ("diagnostico_completato", "Ultima domanda", "Quante arrivano in fondo"), ("diagnostico_punteggio", "Punteggio per materia", "Dove sono i punti deboli"), ("clic_verso_area", "Clic verso l'area personale", "Il passaggio al prodotto"), ("clic_fonte_ufficiale", "Clic al sito del test", "Interesse reale per il test")))
#sub[Integrazioni]
#tab(("Strumento", "Cosa fa", "Come si collega"), (24%, 30%, 46%), (("Banca domande", "Fonte delle domande", "Foglio CSV o tabella: il diagnostico ne estrae 20"), ("Logica del quiz (tools.js)", "Corregge e calcola", "Componente di codice in Framer"), ("Area personale (percorso Test Prep)", "Allenamento e registro errori", "Link con l'area di studio nei parametri"), ("Fonti ufficiali (CISIA, MUR, ateneo)", "Informazioni sul test", "Solo link e breve riepilogo, con data di controllo")))
#sub[Da verificare (legale e privacy)]
- #"Diritto d'autore: non riprodurre né parafrasare quesiti dei test ufficiali; chiedere un parere se si usano materiali pubblici."
- #"Marchi (CISIA, TOLC): citarli solo per indicare il test, senza far credere a un'affiliazione; UniLink è indipendente."
- #"Nessuna promessa di ammissione o di punteggio."
- #"Se si salva il risultato: informativa e consenso. Molti utenti possono essere minorenni: verificare con un consulente come raccogliere il consenso."
#sub[Manutenzione]
#tab(("Cosa", "Chi", "Ogni quanto", "Come"), (26%, 22%, 22%, 30%), (("Banca domande", "Autori e verificatori", "Ogni anno e dopo ogni modifica del test", "Aggiungere, correggere o ritirare domande"), ("Informazioni sul test (date, regole)", "Founder responsabile dei contenuti", "Ogni 30 giorni nel periodo di iscrizione", "Ricontrollare la fonte e aggiornare «ultimo controllo»"), ("Qualità delle domande", "Team", "Ogni mese", "Guardare le domande con troppi errori o troppo facili"), ("Segnalazioni", "Team", "Entro 3 giorni", "Correggere o ritirare")))
#sub[Piano di lavoro · #"15–20 giorni, di cui 6–8 per scrivere e verificare le domande"]
#tab(("N.", "Passo", "Dove", "Giorni"), (6%, 52%, 26%, 16%), (("1", "Scegliere aree e materie del diagnostico (Economia: logica e matematica)", "Decisione", "1"), ("2", "Scrivere 80 domande originali con spiegazione", "Banca domande", "6–8"), ("3", "Verifica incrociata a due", "Banca domande", "2"), ("4", "Logica del diagnostico (20 domande, correzione, risultato)", "tools.js", "2"), ("5", "Pagina «Test d'ingresso»", "test-ingresso.html", "3"), ("6", "Risultato e passaggio verso l'area personale", "Landing + web app", "1,5"), ("7", "Informazioni sul test con fonte e data di controllo", "Configurazione aree", "1"), ("8", "Eventi di misura", "Analytics", "0,5"), ("9", "Prova con 5 studenti dell'ultimo anno", "Tutta la pagina", "1,5")))
#sub[Rischi]
#tab(("Rischio", "Come lo riduci"), (38%, 62%), (("Diritto d'autore sulle domande", "Solo domande originali e verificate; mai copiare."), ("Informazioni sul test sbagliate o vecchie", "Fonte e data di controllo visibili; se vecchie, si nascondono."), ("Settore competitivo", "Non competere sul volume: diagnostico gratuito e registro errori."), ("Utenti minorenni", "Nessun dato salvato senza consenso; verifica con un consulente."), ("Costo di scrittura delle domande", "Partire da 80 domande e crescere solo se il diagnostico viene usato.")))
#sub[Come capisci se funziona]
#tab(("Metrica", "Soglia (ipotesi)", "Entro"), (44%, 34%, 22%), (("Diagnostici completati", "Almeno 100", "8 settimane"), ("Passaggi verso Test Prep", "Almeno il 20% dei diagnostici", "8 settimane"), ("Iscritti all'area o alla lista d'attesa da questa pagina", "Almeno 30", "8 settimane")))
#nota[*Regola di stop.* #"Se dopo 8 settimane i diagnostici completati sono meno di 40, fermarsi: il settore è competitivo e le risorse rendono di più sui nuovi hub (L08)."]
#sub[Prompt per l'AI]
Da incollare insieme a CONTESTO_DEMO.md.
#block(fill: navy, radius: 8pt, inset: 10pt, width: 100%, text(fill: crema, size: 8pt)[#raw("Richiesta di tipo C (promuovi) per la landing UniLink.\n\nContesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L04 («Test d'ingresso (TOLC)») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).\n\nCosa fare:\n- Crea test-ingresso.html con le 7 sezioni della scheda; la scheda «Test d'ingresso» di prima.html diventa un rimando.\n- Aggiungi la logica del diagnostico (20 domande) in tools.js e la banca domande come CSV (solo domande originali, due verificatori).\n- Aggiungi le informazioni sul test per area con fonte e «ultimo controllo».\n- Nessun salvataggio del risultato senza consenso; nessuna promessa su ammissione o punteggio.\n\nRegole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.", block: false)])
#sub[Cosa serve · da decidere · origine]
- #"Banca domande TOLC"
- #"Decisione strategica rispetto ai nuovi hub"
- #"Ha senso prima dei nuovi hub?"
- #"Solo diagnostico gratuito o anche percorso?"
#text(size: 8pt, fill: nv2)[#"Origine: HQ · TOLC"]

#scheda("L05", "Borse di studio e tasse", "Orientamento · impatto 4/5 · sforzo 4/5 · web app D10")
#box-crema[*Il problema.* #"Molti studenti non sanno dove trovare bandi e scadenze (DSU e altri)." \ \ *La proposta.* #"Una guida nella fase «Prima» con le informazioni chiave del bando, le scadenze e i link alle fonti ufficiali. Promemoria nell'area personale."]
#nota[*Il consiglio* (parere di Claude, da discutere: la decisione è vostra). #"Alto valore e poco sforzo di design, ma richiede qualcuno che aggiorni le scadenze ogni anno: senza responsabile, meglio non pubblicarla."]
#sub[Panoramica]
#tab(("", ""), (22%, 78%), (("Obiettivo", "Aiutare a trovare bandi e scadenze su borse e tasse, sempre con rimando alle fonti ufficiali."), ("Per chi", "Matricole e famiglie; studenti con ISEE basso che non conoscono le agevolazioni."), ("Quando serve", "Prima delle scadenze dei bandi (le date cambiano ogni anno: vanno prese dalle fonti ufficiali)."), ("Stima", "6–8 giorni di lavoro, più una persona responsabile degli aggiornamenti"), ("Dove vive", "Pagina «Prima» (sezione Borse e tasse) + promemoria in area (D10).")))
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  box-crema(fill: nvt)[*Versione minima (MVP)* \
- #"Pagina «Borse e tasse» nella fase Prima: cosa esiste, come fare domanda, cosa preparare"
- #"Elenco delle scadenze con fonte, apertura, chiusura e «ultimo controllo»"
- #"Checklist dei documenti (ISEE e altri, da verificare sul bando)"
- #"Rimando sempre alla fonte ufficiale"],
  box-crema(fill: ar2)[*Dopo* \
- #"Promemoria via email nell'area personale, con consenso"
- #"Calendario .ics delle scadenze"
- #"Guide per altri atenei"],
  box-crema(fill: crema2)[*Non lo facciamo* \
- #"Consulenza personale su ISEE o reddito"
- #"Compilare le domande al posto dello studente"
- #"Raccogliere ISEE o dati economici"])
#sub[Pagine annotate]
Le pagine come sarebbero, sezione per sezione. Ogni numero è seguito da: perché la sezione c'è e cosa puoi cambiare senza rifare il design.
#block(above: 10pt, below: 2pt, text(size: 11.5pt)[#"Borse e tasse"]) #text(size: 8pt, fill: nv2)[#"borse.html — Nuova pagina nella fase Prima. Le date nel disegno sono segnaposto: i dati veri vengono dalla collezione «Scadenze»."]
#sezione(1, "Hero", "B1", "Il tema è l'ansia dei soldi: il titolo parla di certezza e la frase promette fonti, non consigli.", "Titolo e frase.", "LP/Hero", "img/L05-p0-s1.jpg")
#sezione(2, "Cosa esiste", "B2", "Dà la mappa dei tipi di aiuto senza entrare nei dettagli che cambiano ogni anno.", "Tre card dal CMS; ogni riga ha il link alla fonte.", "LP/Card", "img/L05-p0-s2.jpg")
#sezione(3, "Scadenze", "B3", "È il cuore della pagina: la data giusta salva una domanda. «Controllato» dice quanto è fresca.", "Una riga = una riga della collezione «Scadenze». Se «controllato» è vecchio, le date si nascondono.", "Tabella (LP/Lista)", "img/L05-p0-s3.jpg")
#sezione(4, "Come fare domanda", "B4", "Chiarisce che UniLink non riceve domande: evita equivoci e responsabilità.", "Tre frasi.", "LP/Passo", "img/L05-p0-s4.jpg")
#sezione(5, "Cosa preparare", "B5", "Una checklist concreta riduce gli errori e dà senso di controllo.", "Righe della checklist dal CMS.", "Lista", "img/L05-p0-s5.jpg")
#sezione(6, "Domande frequenti", "B6", "Toglie il rischio di consulenza e di raccolta di dati sensibili.", "CMS «FAQ».", "LP/FAQ", "img/L05-p0-s6.jpg")
#sezione(7, "Promemoria", "B7", "Porta al prodotto con un vantaggio concreto.", "Testo; i promemoria sono fase 2.", "LP/Finale", "img/L05-p0-s7.jpg")
#sub[Dati · #"Collezione «Scadenze»"]
#text(size: 8pt, fill: nv2)[#"Dove: Framer CMS · Chi lo aggiorna: Una persona responsabile (da nominare) · Quando: Ogni mese e a ogni nuovo bando"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("nome", "testo", "Borsa di studio per il diritto allo studio"), ("ente", "testo", "Ente regionale / Ateneo"), ("tipo", "scelta", "borsa · esonero · alloggio · altro"), ("apertura", "data", "Dal bando ufficiale"), ("chiusura", "data", "Dal bando ufficiale"), ("requisiti_sintesi", "testo breve", "Solo un riassunto, mai l'unica fonte"), ("documenti", "elenco", "ISEE, documento, …"), ("fonte_url", "URL", "Pagina ufficiale del bando (obbligatoria)"), ("ultimo_controllo", "data", "Se più vecchio di 30 giorni: badge «Da riverificare» e date nascoste"), ("stato", "scelta", "attiva · scaduta · da_verificare")))
#sub[Regole]
- #"Ogni riga ha un link alla fonte ufficiale: senza link non si pubblica."
- #"Se «ultimo controllo» ha più di 30 giorni il badge diventa «Da riverificare» e le date si nascondono."
- #"Scaduta la chiusura la riga passa in archivio e non compare più nell'elenco principale."
- #"UniLink non scrive requisiti completi: riassume e rimanda al bando."
- #"Nessun dato economico viene richiesto o salvato."
- #"Se non c'è una persona responsabile degli aggiornamenti, la pagina non va pubblicata."
#sub[Stati]
#tab(("Stato", "Cosa vede lo studente", "Testo"), (22%, 38%, 40%), (("Scadenza attiva", "Date e pulsante «Vai al bando»", "Chiude il gg/mm"), ("Da riverificare", "Badge arancio, date nascoste", "Stiamo ricontrollando questa scadenza: guarda il bando ufficiale."), ("Scaduta", "Nell'archivio", "Questo bando è chiuso."), ("Nessuna scadenza", "Messaggio onesto", "In questo momento non ci sono bandi aperti che conosciamo: controlla le fonti ufficiali.")))
#sub[Testi proposti]
#tab(("Elemento", "Testo"), (28%, 72%), (("Titolo", "Sapere prima quanto costa"), ("Frase", "Bandi, scadenze e agevolazioni in un posto solo, sempre con il link alla fonte ufficiale."), ("Avviso", "UniLink non ti dice se hai diritto: solo il bando ufficiale lo stabilisce."), ("Pulsante riga", "Vai al bando"), ("Badge controllo", "Controllato il gg/mm"), ("Promemoria", "Attiva il promemoria")))
#sub[Misure]
#tab(("Evento", "Quando scatta", "Perché"), (28%, 36%, 36%), (("clic_vai_al_bando", "Clic su «Vai al bando»", "Interesse reale, per bando"), ("clic_promemoria", "Clic su «Attiva i promemoria»", "Quanti vogliono il promemoria"), ("apertura_checklist", "Si apre la checklist dei documenti", "Se serve"), ("dati_vecchi_mostrati", "Una riga «Da riverificare» è visibile", "Se la manutenzione regge")))
#sub[Integrazioni]
#tab(("Strumento", "Cosa fa", "Come si collega"), (24%, 30%, 46%), (("CMS «Scadenze»", "Elenco e checklist", "Collezione collegata alla tabella con filtro su stato e controllo"), ("Promemoria email (fase 2)", "Avviso prima della chiusura", "Servizio di invio e consenso nell'area personale"), ("Calendario .ics (fase 2)", "Scadenze nel calendario", "File generato dalle righe attive")))
#sub[Da verificare (legale e privacy)]
- #"Informazione, non consulenza: dirlo in pagina e rimandare sempre alla fonte ufficiale."
- #"Non raccogliere ISEE o dati economici."
- #"Informazioni sbagliate su soldi e scadenze possono far perdere un diritto: senza un responsabile degli aggiornamenti non pubblicare."
- #"Promemoria email: consenso separato e cancellazione facile."
#sub[Manutenzione]
#tab(("Cosa", "Chi", "Ogni quanto", "Come"), (26%, 22%, 22%, 30%), (("Controllo di ogni scadenza", "Persona responsabile (da nominare)", "Ogni mese", "Aprire la fonte, confrontare, aggiornare «ultimo controllo»"), ("Nuovi bandi", "Persona responsabile", "A ogni apertura", "Aggiungere la riga con fonte e documenti"), ("Archivio", "Persona responsabile", "A fine anno accademico", "Spostare i bandi scaduti"), ("Testi della pagina", "Team", "Una volta l'anno", "Rileggere e controllare i rimandi")))
#sub[Piano di lavoro · #"6–8 giorni di lavoro, più una persona responsabile degli aggiornamenti"]
#tab(("N.", "Passo", "Dove", "Giorni"), (6%, 52%, 26%, 16%), (("1", "Nominare la persona responsabile e il calendario dei controlli", "Decisione", "0,5"), ("2", "Raccogliere i bandi dell'anno con fonte", "Collezione «Scadenze»", "2"), ("3", "Collezione e regole (controllo, archivio)", "Framer CMS", "1"), ("4", "Pagina «Borse e tasse»", "borse.html", "3"), ("5", "Eventi di misura", "Analytics", "0,5"), ("6", "Prova con 3 matricole e correzioni", "Tutta la pagina", "1")))
#sub[Rischi]
#tab(("Rischio", "Come lo riduci"), (38%, 62%), (("Date sbagliate o vecchie", "Controllo mensile, «ultimo controllo» visibile, date nascoste se vecchie."), ("Percepita come consulenza", "Avvisi in pagina e rimando al bando."), ("Nessuno aggiorna", "Senza responsabile non si pubblica."), ("Carico alto a ridosso dei bandi", "Calendario dei controlli intorno alle scadenze.")))
#sub[Come capisci se funziona]
#tab(("Metrica", "Soglia (ipotesi)", "Entro"), (44%, 34%, 22%), (("Clic su «Vai al bando»", "Almeno 100 nel periodo dei bandi", "Stagione dei bandi"), ("Righe con controllo entro 30 giorni", "100%", "Sempre"), ("Segnalazioni di errori", "0 non risolti entro 3 giorni", "Sempre")))
#nota[*Regola di stop.* #"Se un controllo mensile salta due volte di fila, ritirare la pagina finché non c'è di nuovo un responsabile."]
#sub[Prompt per l'AI]
Da incollare insieme a CONTESTO_DEMO.md.
#block(fill: navy, radius: 8pt, inset: 10pt, width: 100%, text(fill: crema, size: 8pt)[#raw("Richiesta di tipo C (promuovi) per la landing UniLink.\n\nContesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L05 («Borse di studio e tasse») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).\n\nCosa fare:\n- Crea borse.html con le 7 sezioni della scheda e collega la scheda di prima.html.\n- Crea la collezione «Scadenze» con le regole di controllo (30 giorni) e il link alla fonte obbligatorio.\n- Non pubblicare date inventate: usa solo dati con fonte; senza dati mostra lo stato «Nessuna scadenza».\n- Nessun dato economico richiesto o salvato.\n\nRegole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.", block: false)])
#sub[Cosa serve · da decidere · origine]
- #"Fonti ufficiali aggiornate"
- #"Un responsabile degli aggiornamenti annuali"
- #"Guida statica o aggiornamento automatico?"
- #"Chi la mantiene?"
#text(size: 8pt, fill: nv2)[#"Origine: HQ · BORSE DI STUDIO"]

#scheda("L06", "Carriera e CV", "Dopo · impatto 4/5 · sforzo 2/5 · web app D09")
#box-crema[*Il problema.* #"Chi pensa a magistrali e stage non sa quanto il proprio CV sia vicino al profilo tipo." \ \ *La proposta.* #"Nella fase «Dopo»: guida breve (CV, colloquio, LinkedIn) e, nell'area personale, confronto del CV con un profilo tipo. Career Score e opportunità solo nella visione."]
#nota[*Il consiglio* (parere di Claude, da discutere: la decisione è vostra). #"Quick win: parte da contenuti scritti dal team, costa poco e dà traffico organico. Evita le promesse sulle opportunità finché non hai partner reali."]
#sub[Panoramica]
#tab(("", ""), (22%, 78%), (("Obiettivo", "Dare ai laureandi e ai laureati i primi passi di carriera: CV in ordine, colloquio e scelta del percorso, senza promettere opportunità."), ("Per chi", "Studenti degli ultimi anni e neolaureati che pensano a stage, lavoro o magistrale."), ("Quando serve", "Insieme alla fase Dopo: ha senso quando la pagina Tesi e laurea è online e ci sono studenti al terzo anno."), ("Stima", "7–10 giorni di lavoro (guida e controllo CV a checklist)"), ("Dove vive", "Pagina «Dopo» (sezione Carriera e CV) + strumento in area (D09).")))
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  box-crema(fill: nvt)[*Versione minima (MVP)* \
- #"Guida in quattro mosse (profilo, CV in una pagina, colloquio, LinkedIn)"
- #"«Controlla il tuo CV»: checklist di 10 punti nel browser, senza caricare file"
- #"Quattro profili tipo (Finance, Consulenza, Marketing, Impresa) con tre azioni ciascuno"
- #"Rimando al template e al confronto del CV nell'area personale"],
  box-crema(fill: ar2)[*Dopo* \
- #"Confronto del CV con un profilo tipo nell'area, con caricamento privato"
- #"Career Score"
- #"Opportunità, solo con partner reali"],
  box-crema(fill: crema2)[*Non lo facciamo* \
- #"Offerte di lavoro o di stage proprie senza partner"
- #"Promesse di assunzione"
- #"Valutazione del CV con AI senza consenso"])
#sub[Pagine annotate]
Le pagine come sarebbero, sezione per sezione. Ogni numero è seguito da: perché la sezione c'è e cosa puoi cambiare senza rifare il design.
#block(above: 10pt, below: 2pt, text(size: 11.5pt)[#"Carriera e CV"]) #text(size: 8pt, fill: nv2)[#"carriera.html — Nuova pagina nella fase Dopo: sostituisce la scheda «Carriera e CV» di dopo.html, che diventa un rimando."]
#sezione(1, "Hero", "C1", "Promette un risultato piccolo e immediato, con una garanzia di privacy.", "Titolo, frase e foto.", "LP/Hero", "img/L06-p0-s1.jpg")
#sezione(2, "La guida in quattro mosse", "C2", "Il percorso è lineare: si può leggere tutto o saltare alla checklist.", "Quattro testi; ogni card può linkare una guida più lunga.", "LP/Card", "img/L06-p0-s2.jpg")
#sezione(3, "Controlla il tuo CV", "C3", "È lo strumento che fa tornare: dieci spunte, un punteggio, tre consigli. Tutto nel browser.", "I dieci punti e i consigli sono nella collezione «Checklist CV».", "LP/Checklist · LP/Strumento", "img/L06-p0-s3.jpg")
#sezione(4, "Profili tipo", "C4", "Il profilo tipo dà un riferimento, non un obbligo: descrive il «tipico», non il «requisito».", "Una riga della collezione «Profili tipo» per profilo.", "LP/Card", "img/L06-p0-s4.jpg")
#sezione(5, "Nell'area personale", "C5", "Mostra il passo successivo con una schermata vera.", "Lo screenshot si rifà dalla web app.", "Schermata reale (img/app)", "img/L06-p0-s5.jpg")
#sezione(6, "Template del CV", "C6", "Una cosa concreta da portarsi via, che porta all'area.", "Testo e file (collezione «Template»).", "LP/Finale", "img/L06-p0-s6.jpg")
#sezione(7, "Domande frequenti", "C7", "Dice subito privacy e limiti.", "CMS «FAQ».", "LP/FAQ", "img/L06-p0-s7.jpg")
#sub[Dati · #"Collezione «Profili tipo»"]
#text(size: 8pt, fill: nv2)[#"Dove: Framer CMS · Chi lo aggiorna: Autori dei contenuti, con revisione di un laureato nel settore · Quando: Una volta l'anno"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("nome", "testo", "Finance"), ("descrizione", "testo", "Cosa fa chi lavora in questo campo"), ("competenze", "elenco", "Contabilità, inglese, Excel"), ("esperienze_tipiche", "elenco", "Stage, progetto, associazione"), ("azioni", "3 testi", "Le tre azioni consigliate"), ("fonte", "testo", "Da dove viene l'informazione"), ("ultimo_controllo", "data", "Annuale")))
#sub[Dati · #"Collezione «Checklist CV»"]
#text(size: 8pt, fill: nv2)[#"Dove: tools.js o Framer CMS · Chi lo aggiorna: Team · Quando: Una volta l'anno"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("punto", "testo", "Una sola pagina"), ("peso", "numero", "1"), ("consiglio", "testo", "Se non c'è, cosa fare"), ("ordine", "numero", "1…10")))
#sub[Dati · #"Collezione «Template»"]
#text(size: 8pt, fill: nv2)[#"Dove: Area personale (file) · Chi lo aggiorna: Team · Quando: Quando cambia il modello"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("nome", "testo", "CV neolaureato"), ("file", "file", "Word e PDF"), ("versione", "testo", "1.0"), ("licenza", "testo", "Uso libero da parte dello studente")))
#sub[Regole]
- #"La checklist funziona solo nel browser: nessun file caricato, nessun dato salvato."
- #"Il punteggio è un semplice conteggio dei punti a posto; i consigli sono sempre gentili e concreti."
- #"I profili tipo descrivono ciò che è tipico, mai ciò che è richiesto."
- #"Nessuna offerta di lavoro o stage finché non ci sono partner reali."
- #"Il confronto del CV con un profilo (caricamento) esiste solo nell'area, con privacy e cancellazione."
#sub[Stati]
#tab(("Stato", "Cosa vede lo studente", "Testo"), (22%, 38%, 40%), (("Checklist vuota", "Dieci punti da spuntare", "Spunta ciò che il tuo CV ha già."), ("Risultato alto", "Messaggio positivo e un solo consiglio", "Ottimo! Ti manca un solo punto."), ("Risultato basso", "Tre consigli in ordine di priorità", "Partiamo da tre cose semplici."), ("Profilo non ancora disponibile", "Messaggio onesto", "Questo profilo arriva presto.")))
#sub[Testi proposti]
#tab(("Elemento", "Testo"), (28%, 72%), (("Titolo", "Un CV in ordine, un passo alla volta"), ("Frase", "Guide brevi e una checklist per controllare il tuo CV in due minuti. Senza caricare niente."), ("Pulsante principale", "Controlla il tuo CV"), ("Garanzia", "Non carichiamo né salviamo il tuo CV."), ("Avviso profili", "Sono esempi di ciò che di solito si cerca, non requisiti."), ("Passaggio all'area", "Scarica il template nell'area personale")))
#sub[Misure]
#tab(("Evento", "Quando scatta", "Perché"), (28%, 36%, 36%), (("checklist_iniziata", "Prima spunta", "Chi prova"), ("checklist_completata", "Ultima spunta", "Chi arriva in fondo"), ("punteggio_cv", "Punteggio a fine checklist", "Dove sono i problemi tipici"), ("clic_profilo_tipo", "Clic su un profilo", "Quali carriere interessano"), ("clic_verso_area", "Clic verso l'area personale", "Il passaggio al prodotto")))
#sub[Integrazioni]
#tab(("Strumento", "Cosa fa", "Come si collega"), (24%, 30%, 46%), (("tools.js (checklist)", "Calcola il punteggio", "Componente di codice in Framer"), ("CMS «Profili tipo»", "Contenuti dei profili", "Collezione collegata alla pagina"), ("Area personale (percorso Futuro)", "Template e confronto del CV", "Link con l'area di studio nei parametri"), ("Partner (solo in futuro)", "Opportunità", "Accordo scritto prima di pubblicare qualsiasi offerta")))
#sub[Da verificare (legale e privacy)]
- #"Il CV contiene dati personali: nessun caricamento nella landing; nell'area solo con consenso, archivio privato e cancellazione."
- #"Nessuna promessa di assunzione o di risultato."
- #"Template: verificare la licenza dei font e delle immagini."
- #"Profili tipo: non attribuire requisiti a aziende o professioni specifiche senza fonte."
#sub[Manutenzione]
#tab(("Cosa", "Chi", "Ogni quanto", "Come"), (26%, 22%, 22%, 30%), (("Profili tipo", "Autori + un laureato del settore", "Una volta l'anno", "Rileggere, aggiornare competenze ed esperienze"), ("Checklist del CV", "Team", "Una volta l'anno", "Controllare che i punti siano ancora validi"), ("Template", "Team", "Quando serve", "Aggiornare e ripubblicare la versione"), ("Guide", "Autori", "Ogni 6 mesi", "Rileggere e correggere")))
#sub[Piano di lavoro · #"7–10 giorni di lavoro (guida e controllo CV a checklist)"]
#tab(("N.", "Passo", "Dove", "Giorni"), (6%, 52%, 26%, 16%), (("1", "Scrivere i dieci punti della checklist e i consigli", "Contenuti", "1"), ("2", "Logica della checklist (spunte, punteggio, consigli)", "tools.js", "1,5"), ("3", "Scrivere i quattro profili tipo con revisione", "Collezione «Profili tipo»", "2"), ("4", "Pagina «Carriera e CV»", "carriera.html", "3"), ("5", "Template del CV", "Area personale", "1"), ("6", "Eventi di misura", "Analytics", "0,5"), ("7", "Prova con 5 laureandi", "Tutta la pagina", "1")))
#sub[Rischi]
#tab(("Rischio", "Come lo riduci"), (38%, 62%), (("Contenuti generici", "Scrivere con laureati del settore e rivedere ogni anno."), ("Promesse implicite di lavoro", "Avvisi chiari e nessuna offerta senza partner."), ("Privacy sul CV", "Nessun caricamento in landing; nell'area solo con consenso."), ("Poco traffico", "È un contenuto che dà traffico organico nel tempo: valutare dopo 3 mesi.")))
#sub[Come capisci se funziona]
#tab(("Metrica", "Soglia (ipotesi)", "Entro"), (44%, 34%, 22%), (("Checklist completate", "Almeno 100", "8 settimane"), ("Passaggi verso l'area", "Almeno 15% delle checklist", "8 settimane"), ("Download del template", "Almeno 50", "8 settimane")))
#nota[*Regola di stop.* #"Se dopo 8 settimane le checklist completate sono meno di 30, non investire in Career Score o opportunità: tenere solo la guida."]
#sub[Prompt per l'AI]
Da incollare insieme a CONTESTO_DEMO.md.
#block(fill: navy, radius: 8pt, inset: 10pt, width: 100%, text(fill: crema, size: 8pt)[#raw("Richiesta di tipo C (promuovi) per la landing UniLink.\n\nContesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L06 («Carriera e CV») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).\n\nCosa fare:\n- Crea carriera.html con le 7 sezioni della scheda; la scheda «Carriera e CV» di dopo.html diventa un rimando.\n- Aggiungi in tools.js la checklist del CV (10 punti, punteggio, consigli) che funziona solo nel browser.\n- Crea le collezioni «Profili tipo» e «Template».\n- Nessun caricamento di file, nessuna offerta di lavoro.\n\nRegole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.", block: false)])
#sub[Cosa serve · da decidere · origine]
- #"Profili tipo scritti dal team"
- #"Upload CV privato (solo area)"
- #"Solo guida ora, Career Score dopo?"
#text(size: 8pt, fill: nv2)[#"Origine: HQ · CURRICULUM (quick win) · Demo Versione C"]

#scheda("L07", "Listino e pacchetti", "Monetizzazione · impatto 3/5 · sforzo 3/5 · web app D05")
#box-crema[*Il problema.* #"Il listino non è deciso: appunti singoli, dispensa completa, bundle semestre/anno, Plus mensile sono ipotesi." \ \ *La proposta.* #"Una pagina Prezzi pronta ma fuori dalla navigazione, che legge il listino da UL_CFG.prezzi: quando il listino è deciso si cambiano i numeri qui e la pagina si ridisegna."]
#nota[*Il consiglio* (parere di Claude, da discutere: la decisione è vostra). #"Tienila fuori dalla navbar: mostrare prezzi non decisi confonde. Se pensate a prezzi di lancio o sconti, indicate fino a quando valgono e fate verificare da un consulente le regole sugli annunci di riduzione di prezzo (Codice del Consumo) prima di pubblicarli."]
#sub[Panoramica]
#tab(("", ""), (22%, 78%), (("Obiettivo", "Avere una pagina Prezzi pronta, che legge il listino da un punto solo, e un acquisto che sblocca i contenuti nell'area personale."), ("Per chi", "Studenti che hanno provato il gratuito e vogliono la dispensa completa di un esame o di un semestre."), ("Quando serve", "Dopo che il listino è deciso (sondaggio) e il soggetto legale è pronto a incassare. Fino ad allora la pagina resta fuori dalla barra."), ("Stima", "15–20 giorni di lavoro, più i tempi legali e amministrativi esterni"), ("Dove vive", "Footer (non in navbar) finché non è deciso; poi voce in navbar o dentro Area personale.")))
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  box-crema(fill: nvt)[*Versione minima (MVP)* \
- #"Pagina Prezzi dal listino (collezione «Piani»), con confronto tra i piani"
- #"Acquisto di un esame (appunti o dispensa) con Stripe Checkout"
- #"Sblocco automatico nell'area personale dopo il pagamento"
- #"Termini di vendita, informativa e ricevuta per email"],
  box-crema(fill: ar2)[*Dopo* \
- #"Pacchetto semestre e anno"
- #"Piano Plus (ripasso errori, simulazioni, piano guidato), anche in abbonamento"
- #"Upgrade che riconosce quanto già pagato"
- #"Codici sconto"],
  box-crema(fill: crema2)[*Non lo facciamo* \
- #"Prezzi mostrati senza un listino deciso"
- #"Rinnovi automatici nascosti"
- #"Conservare dati della carta (li gestisce Stripe)"])
#sub[Pagine annotate]
Le pagine come sarebbero, sezione per sezione. Ogni numero è seguito da: perché la sezione c'è e cosa puoi cambiare senza rifare il design.
#block(above: 10pt, below: 2pt, text(size: 11.5pt)[#"Prezzi"]) #text(size: 8pt, fill: nv2)[#"prezzi.html — Pagina esistente (S12), oggi con prezzi di esempio da config. Quando il listino è deciso entra in barra o nell'area personale."]
#sezione(1, "Hero e scelta", "P1", "Il titolo dice il principio (paghi ciò che usi) e la scelta cambia i piani sotto.", "Titolo e le due etichette del selettore.", "LP/Toggle", "img/L07-p0-s1.jpg")
#sezione(2, "I piani", "P2", "Tre piani al massimo, uno «il più scelto»: troppi piani paralizzano.", "Si cambiano i numeri nella collezione «Piani» (o in UL_CFG.prezzi): il design non si tocca.", "LP/Piano", "img/L07-p0-s2.jpg")
#sezione(3, "Confronto", "P3", "Fa vedere cosa si ottiene salendo di piano: è dove si decide.", "Una riga per funzione; le colonne vengono dai piani.", "Tabella", "img/L07-p0-s3.jpg")
#sezione(4, "Dopo l'acquisto", "P4", "Mostra dove finisce ciò che si compra: dà fiducia.", "Lo screenshot si rifà dalla web app.", "Schermata reale (img/app)", "img/L07-p0-s4.jpg")
#sezione(5, "Cosa resta gratis", "P5", "Il gratuito è il motivo per cui la gente arriva: dirlo toglie la paura del «pay-wall».", "Tre testi.", "LP/Card", "img/L07-p0-s5.jpg")
#sezione(6, "Regole chiare", "P6", "Le quattro cose che frenano un acquisto.", "Testi; il punto sull'upgrade va confermato prima.", "LP/Card", "img/L07-p0-s6.jpg")
#sezione(7, "Domande frequenti", "P7", "Risponde sul pagamento e sul rimborso, il punto più delicato.", "CMS «FAQ».", "LP/FAQ", "img/L07-p0-s7.jpg")
#sub[Dati · #"Collezione «Piani»"]
#text(size: 8pt, fill: nv2)[#"Dove: Framer CMS (e la web app legge la stessa fonte) · Chi lo aggiorna: Team (una sola persona può cambiare i prezzi) · Quando: Alla decisione del listino e a ogni modifica"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("id", "testo", "dispensa"), ("nome", "testo", "Dispensa completa"), ("tipo", "scelta", "base · acquisto · abbonamento"), ("prezzo", "testo", "Quello deciso: mai un valore di esempio in produzione"), ("prezzo_lancio", "testo", "Facoltativo"), ("lancio_fino_al", "data", "Obbligatoria se c'è un prezzo di lancio"), ("sblocca", "elenco di regole", "dispensa:esame"), ("include", "elenco", "Appunti, mappe, quiz"), ("evidenza", "sì/no", "Un solo piano «il più scelto»"), ("attivo", "sì/no", "Spegne il piano senza cancellarlo")))
#sub[Dati · #"Acquisti"]
#text(size: 8pt, fill: nv2)[#"Dove: Supabase, scritta dal webhook di Stripe · Chi lo aggiorna: Nessuno a mano · Quando: A ogni pagamento"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("utente", "riferimento", "L'account dello studente"), ("piano", "riferimento", "dispensa"), ("oggetto", "testo", "L'esame o il semestre acquistato"), ("importo", "numero", "Quanto pagato"), ("stripe_id", "testo", "Identificativo del pagamento"), ("stato", "scelta", "pagato · rimborsato · contestato"), ("data", "data", "automatico")))
#sub[Regole]
- #"I prezzi stanno in un solo posto (collezione «Piani»): pagina, area personale e checkout li leggono da lì."
- #"Un solo piano ha «il più scelto»; al massimo tre piani visibili per volta."
- #"Ogni piano dice cosa sblocca: senza descrizione non si pubblica."
- #"Prezzi di lancio: indicare fino a quando valgono; per sconti e annunci di riduzione verificare con un consulente le regole del Codice del Consumo."
- #"Lo sblocco avviene solo dopo la conferma del pagamento da Stripe (webhook), mai dal browser."
- #"Gli acquisti singoli non si rinnovano da soli."
- #"Se un pagamento fallisce non si sblocca niente e si spiega cosa fare."
#sub[Stati]
#tab(("Stato", "Cosa vede lo studente", "Testo"), (22%, 38%, 40%), (("Listino non deciso", "Pagina fuori dalla barra, piani «Esempio»", "Prezzi di esempio, ancora da decidere."), ("Piano attivo", "Prezzo e pulsante «Scegli»", "Scegli"), ("Pagamento riuscito", "Pagina di conferma e sblocco", "Fatto! La tua dispensa è nella tua area."), ("Pagamento fallito", "Messaggio e nuovo tentativo", "Il pagamento non è andato a buon fine: non ti è stato addebitato niente. Riprova."), ("Già acquistato", "Pulsante «Apri»", "Hai già questa dispensa."), ("Prezzo di lancio scaduto", "Prezzo normale", "Il prezzo di lancio è terminato.")))
#sub[Testi proposti]
#tab(("Elemento", "Testo"), (28%, 72%), (("Titolo", "Paghi solo quello che studi"), ("Frase", "Per esame o per semestre. Nessun rinnovo automatico."), ("Pulsante piano", "Scegli"), ("Garanzia", "I dati della carta non passano da UniLink."), ("Gratis", "Estratti, quiz rapido, strumenti e informazioni sugli esami restano gratuiti."), ("Conferma", "Fatto! La tua dispensa è nella tua area.")))
#sub[Misure]
#tab(("Evento", "Quando scatta", "Perché"), (28%, 36%, 36%), (("pagina_prezzi_vista", "Si apre la pagina", "Interesse"), ("cambio_modo_prezzi", "Per esame ↔ per semestre", "Cosa interessa di più"), ("clic_scegli_piano", "Clic su «Scegli» (con il piano)", "Quale piano attira"), ("checkout_iniziato", "Si apre il checkout", "Dove si perde chi esce"), ("acquisto_completato", "Pagamento riuscito", "Conversione"), ("pagamento_fallito", "Errore di pagamento", "Problemi tecnici o di fiducia")))
#sub[Integrazioni]
#tab(("Strumento", "Cosa fa", "Come si collega"), (24%, 30%, 46%), (("Stripe Checkout", "Pagamento sicuro", "Pagina ospitata da Stripe; si passa il piano e l'account"), ("Webhook Stripe → Supabase", "Registra l'acquisto e sblocca", "Funzione server che verifica la firma e scrive «Acquisti»"), ("Framer CMS «Piani»", "Prezzi e descrizioni", "Collezione letta dalla pagina; la web app legge la stessa fonte"), ("Email", "Ricevuta e conferma", "Ricevuta di Stripe + email di conferma con il link all'area"), ("Analytics (GA4)", "Misura il percorso", "Eventi dalla scheda; solo con consenso ai cookie")))
#sub[Da verificare (legale e privacy)]
- #"Serve un soggetto legale che incassa (e un account Stripe intestato): da decidere prima di costruire."
- #"Termini di vendita, informativa privacy e prezzi con le imposte indicate: da far redigere o rivedere."
- #"Contenuti digitali: regole sul diritto di recesso e sul consenso all'accesso immediato da verificare con un consulente."
- #"Sconti e prezzi di lancio: regole su come annunciare le riduzioni di prezzo (Codice del Consumo) da verificare prima di pubblicare promozioni."
- #"Fatturazione e IVA: da concordare con un commercialista."
- #"Se un giorno ci sarà un abbonamento: rendere la disdetta semplice quanto l'acquisto e verificare gli obblighi."
#sub[Manutenzione]
#tab(("Cosa", "Chi", "Ogni quanto", "Come"), (26%, 22%, 22%, 30%), (("Listino", "Una persona (da nominare)", "A ogni decisione", "Cambiare i piani nel CMS e controllare pagina e checkout"), ("Acquisti e rimborsi", "Founder responsabile", "Ogni settimana", "Controllare Stripe e la tabella «Acquisti»"), ("Termini e informativa", "Team + consulente", "Una volta l'anno", "Rileggere e aggiornare la data"), ("Prove di pagamento", "Team", "A ogni modifica", "Fare un acquisto di prova in modalità test")))
#sub[Piano di lavoro · #"15–20 giorni di lavoro, più i tempi legali e amministrativi esterni"]
#tab(("N.", "Passo", "Dove", "Giorni"), (6%, 52%, 26%, 16%), (("1", "Decidere il listino con il sondaggio", "Decisione", "2"), ("2", "Soggetto legale e account Stripe", "Esterno", "tempi esterni"), ("3", "Termini di vendita e informativa", "Consulente", "tempi esterni"), ("4", "Collezione «Piani» e pagina Prezzi dal CMS", "Framer", "2"), ("5", "Checkout, webhook e sblocco", "Stripe + Supabase", "5"), ("6", "Pagina «Piano e acquisti» nell'area personale", "Web app", "3"), ("7", "Email di conferma e ricevute", "Email", "1"), ("8", "Prove in modalità test e gestione degli errori", "Checkout", "2"), ("9", "Lancio con 10 studenti", "Tutto", "2")))
#sub[Rischi]
#tab(("Rischio", "Come lo riduci"), (38%, 62%), (("Prezzi sbagliati o incoerenti tra pagina e checkout", "Un'unica fonte (collezione «Piani»)."), ("Sblocco che non arriva", "Webhook con verifica e riprova; pagina di assistenza."), ("Problemi legali (recesso, sconti)", "Consulente prima di pubblicare."), ("Pochi acquisti", "Misurare e non aggiungere piani: rivedere cosa è gratis."), ("Carico di assistenza", "Messaggi chiari e un indirizzo unico.")))
#sub[Come capisci se funziona]
#tab(("Metrica", "Soglia (ipotesi)", "Entro"), (44%, 34%, 22%), (("Studenti attivi che acquistano", "Almeno il 3%", "60 giorni"), ("Pagamenti falliti", "Meno del 10% dei tentativi", "Sempre"), ("Richieste di rimborso", "Meno del 5%", "60 giorni")))
#nota[*Regola di stop.* #"Se dopo 60 giorni, con almeno 300 studenti attivi, acquista meno dell'1%, non aggiungere pacchetti: rivedere cosa resta gratis e cosa sblocca ogni piano."]
#sub[Prompt per l'AI]
Da incollare insieme a CONTESTO_DEMO.md.
#block(fill: navy, radius: 8pt, inset: 10pt, width: 100%, text(fill: crema, size: 8pt)[#raw("Richiesta di tipo C (promuovi) per la landing UniLink.\n\nContesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L07 («Listino e pacchetti») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).\n\nCosa fare:\n- Crea la collezione «Piani» come nei dati e fai leggere prezzi e descrizioni alla pagina prezzi.html.\n- Aggiungi il confronto tra i piani e le regole della scheda.\n- Collega Stripe Checkout e il webhook verso la tabella «Acquisti» con sblocco automatico; modalità test.\n- Non pubblicare prezzi di esempio in produzione e non attivare promozioni senza il parere del consulente.\n\nRegole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.", block: false)])
#sub[Cosa serve · da decidere · origine]
- #"Listino deciso (sondaggio)"
- #"Soggetto legale e account Stripe"
- #"Termini di vendita e privacy"
- #"Cosa resta gratis?"
- #"Per esame o per semestre?"
- #"Upgrade che riconosce quanto già pagato?"
#text(size: 8pt, fill: nv2)[#"Origine: HQ · Prezzi & abbonamenti · Stripe"]

#scheda("L08", "Quale hub parte per primo", "Hub · impatto 5/5 · sforzo 4/5 · web app D01")
#box-crema[*Il problema.* #"Giurisprudenza e Medicina sono «in arrivo»: raccogliamo la lista d'attesa ma non ci sono materiali né studenti nel team." \ \ *La proposta.* #"Dopo 3–4 settimane di lista d'attesa si guarda quale hub ha più iscritti e almeno uno o due studenti disposti a costruirlo; quello passa ad «attivo» cambiando una riga della config."]
#nota[*Il consiglio* (parere di Claude, da discutere: la decisione è vostra). #"Decidi sui numeri veri della lista d'attesa, non sull'intuito. Per Medicina l'obiettivo realistico è il 2027/28 (il semestre filtro 2026/27 è troppo vicino)."]
#sub[Panoramica]
#tab(("", ""), (22%, 78%), (("Obiettivo", "Decidere con dati veri quale hub accendere per primo (Giurisprudenza o Medicina) e avere la checklist per accenderlo senza promettere ciò che non c'è."), ("Per chi", "I founder (decisione) e gli studenti dell'hub scelto (che trovano un hub vero, non una promessa)."), ("Quando serve", "Dopo 3–4 settimane di lista d'attesa con i numeri veri. Per Medicina l'obiettivo realistico è il 2027/28."), ("Stima", "5–6 giorni di lavoro per accendere un hub, dopo che i materiali esistono"), ("Dove vive", "Sezione Hub della home e pagine hub: stato da «in arrivo» ad «attivo».")))
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  box-crema(fill: nvt)[*Versione minima (MVP)* \
- #"Scheda di valutazione degli hub con criteri e soglie (documento interno)"
- #"Pagina dell'hub scelto con stato «attivo» (stesso schema di Economia)"
- #"Checklist di lancio dell'hub (12 punti)"
- #"Email di annuncio alla lista d'attesa"],
  box-crema(fill: ar2)[*Dopo* \
- #"Secondo hub"
- #"Più atenei sotto lo stesso hub"
- #"Cruscotto con i numeri della lista d'attesa aggiornati in automatico"],
  box-crema(fill: crema2)[*Non lo facciamo* \
- #"Accendere un hub senza materiali né persone"
- #"Pubblicare dispense non verificate"
- #"Promettere date di apertura"])
#sub[Pagine annotate]
Le pagine come sarebbero, sezione per sezione. Ogni numero è seguito da: perché la sezione c'è e cosa puoi cambiare senza rifare il design.
#block(above: 10pt, below: 2pt, text(size: 11.5pt)[#"Hub Giurisprudenza, quando è attivo"]) #text(size: 8pt, fill: nv2)[#"hub-giurisprudenza.html — È la pagina esistente con stato «attivo» (una riga in UL_CFG.hub) e con contenuti veri. I numeri sono segnaposto."]
#sezione(1, "Hero", "H1", "Stesso schema di Economia: chi conosce un hub conosce gli altri.", "Testi e foto; lo stato «attivo» cambia badge e pulsanti da solo.", "LP/Hero", "img/L08-p0-s1.jpg")
#sezione(2, "Prima · Durante · Dopo", "H2", "Le tre fasi sono la struttura comune di tutti gli hub.", "Testi dei tre blocchi dalla configurazione dell'hub.", "LP/Fase", "img/L08-p0-s2.jpg")
#sezione(3, "Dispense", "H3", "Onestà: si vede cosa c'è e cosa no. Meglio tre dispense vere che trenta promesse.", "Una riga per esame, con stato.", "Lista", "img/L08-p0-s3.jpg")
#sezione(4, "Strumenti", "H4", "Uno strumento funzionante, ma solo con regole verificate (qui sono di esempio).", "Si sostituisce con regole verificate o si toglie.", "LP/Strumento", "img/L08-p0-s4.jpg")
#sezione(5, "Com'è oggi nell'app", "H5", "Documenta il «prima» reale: al lancio questa schermata cambia con i contenuti veri.", "Lo screenshot si rifà.", "Schermata reale (img/app)", "img/L08-p0-s5.jpg")
#sezione(6, "Community", "H6", "Senza community l'hub è solo un archivio.", "Link e testo.", "LP/Finale", "img/L08-p0-s6.jpg")
#block(above: 10pt, below: 2pt, text(size: 11.5pt)[#"Scheda di valutazione (documento interno, non pubblico)"]) #text(size: 8pt, fill: nv2)[#"foglio interno · non pubblicato — Serve a decidere. Si compila con i numeri veri della lista d'attesa e le risposte del team."]
#sezione(1, "Numeri", "V1", "Senza numeri veri la scelta è un'opinione.", "Si leggono dalla tabella «Lista d'attesa».", "Foglio", "img/L08-p1-s1.jpg")
#sezione(2, "Criteri", "V2", "Rende esplicito perché si sceglie uno e non l'altro.", "Pesi e criteri si cambiano nel foglio.", "Tabella", "img/L08-p1-s2.jpg")
#sezione(3, "Checklist di lancio", "V3", "È il confine tra «in arrivo» e «attivo»: evita di promettere ciò che non c'è.", "Voci e ordine si cambiano nel foglio.", "Lista", "img/L08-p1-s3.jpg")
#sub[Dati · #"Tabella «Lista d'attesa»"]
#text(size: 8pt, fill: nv2)[#"Dove: Supabase (la stessa per landing e area personale) · Chi lo aggiorna: Nessuno a mano · Quando: A ogni iscrizione"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("email", "email", "Solo per l'annuncio"), ("hub", "scelta", "giurisprudenza · medicina"), ("risposta", "testo", "«A che anno sei?» / «Sei nel semestre filtro?»"), ("consenso", "sì/no", "Obbligatorio"), ("origine", "scelta", "landing · app"), ("creato_il", "data", "automatico")))
#sub[Dati · #"Stato dell'hub"]
#text(size: 8pt, fill: nv2)[#"Dove: UL_CFG.hub (config.js) o CMS «Hub» · Chi lo aggiorna: Team · Quando: Al lancio"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("slug", "testo", "giurisprudenza"), ("stato", "scelta", "attivo · in_arrivo"), ("fasi", "3 testi", "Prima · Durante · Dopo"), ("materiali_pronti", "numero", "Quanti esami hanno la dispensa (solo informativo)")))
#sub[Regole]
- #"Un hub passa ad «attivo» solo quando tutta la checklist di 12 punti è spuntata."
- #"La scelta si fa sui numeri veri della lista d'attesa e sulle persone disponibili, non sull'intuito."
- #"Soglia di partenza (ipotesi): almeno 100 iscritti in lista e almeno 2 persone disposte a costruire l'hub."
- #"Per Medicina l'obiettivo realistico è il 2027/28: il semestre filtro 2026/27 è troppo vicino."
- #"Mai pubblicare una data di apertura se non è certa."
- #"L'annuncio alla lista parte solo a hub pronto."
#sub[Stati]
#tab(("Stato", "Cosa vede lo studente", "Testo"), (22%, 38%, 40%), (("In arrivo", "Lista d'attesa e «cosa vorremmo fare»", "Stiamo costruendo questo hub con chi lo studia."), ("In costruzione (interno)", "Nessuna differenza pubblica", "—"), ("Attivo", "Dispense, strumenti, community", "Hub attivo · UniFi"), ("Attivo con pochi esami", "Elenco con «In preparazione»", "Ci stiamo lavorando: ecco cosa c'è già.")))
#sub[Testi proposti]
#tab(("Elemento", "Testo"), (28%, 72%), (("Annuncio alla lista", "L'hub di Giurisprudenza è partito: ecco i primi esami e il gruppo del tuo anno."), ("Badge", "Hub attivo · UniFi"), ("Stato dispensa", "In preparazione"), ("Messaggio nei gruppi", "Novità: oggi apre l'hub di Giurisprudenza. Chi vuole dare una mano scriva qui.")))
#sub[Misure]
#tab(("Evento", "Quando scatta", "Perché"), (28%, 36%, 36%), (("iscrizione_lista_hub", "Iscrizione alla lista d'attesa", "Il numero che decide la scelta"), ("clic_avvisami", "Clic su «Avvisami»", "Interesse prima di iscriversi"), ("visita_hub_attivo", "Visita alla pagina dell'hub attivo", "Se l'annuncio funziona"), ("clic_dispensa_hub", "Clic su una dispensa dell'hub", "Quali esami servono davvero")))
#sub[Integrazioni]
#tab(("Strumento", "Cosa fa", "Come si collega"), (24%, 30%, 46%), (("Supabase", "Tabella «Lista d'attesa»", "Form Framer e area personale scrivono nella stessa tabella"), ("Email", "Annuncio di lancio", "Invio a chi ha dato il consenso"), ("Framer CMS / config", "Stato dell'hub", "Un campo che cambia badge e pulsanti"), ("Foglio di valutazione", "Criteri e punteggi", "Foglio condiviso del team")))
#sub[Da verificare (legale e privacy)]
- #"Le email della lista si usano solo per annunciare l'hub per cui l'utente si è iscritto."
- #"Consenso separato per altre comunicazioni."
- #"Piano ufficiale e regole del corso: citare la fonte e la data (Course Catalogue UniFi)."
- #"Nessuna promessa di date o contenuti prima che esistano."
#sub[Manutenzione]
#tab(("Cosa", "Chi", "Ogni quanto", "Come"), (26%, 22%, 22%, 30%), (("Lista d'attesa", "Founder responsabile", "Ogni settimana nel periodo di raccolta", "Leggere i numeri e annotarli nel foglio"), ("Scheda di valutazione", "Team", "Dopo 3–4 settimane e prima della decisione", "Compilare i criteri e decidere in call"), ("Materiali dell'hub", "Autori + revisori", "Continuamente dopo il lancio", "Aggiungere esami e aggiornare lo stato delle righe")))
#sub[Piano di lavoro · #"5–6 giorni di lavoro per accendere un hub, dopo che i materiali esistono"]
#tab(("N.", "Passo", "Dove", "Giorni"), (6%, 52%, 26%, 16%), (("1", "Raccogliere 3–4 settimane di lista d'attesa (landing + app)", "Tabella «Lista d'attesa»", "tempo di raccolta"), ("2", "Compilare la scheda di valutazione e decidere in call", "Foglio", "1"), ("3", "Raccogliere materiali e persone dell'hub scelto", "Lavoro umano", "dipende"), ("4", "Pagina dell'hub con contenuti veri e stato «attivo»", "hub-*.html + config", "2"), ("5", "Strumenti verificati dell'hub", "tools.js", "1"), ("6", "Prova a tre formati e correzioni", "Tutta la pagina", "1"), ("7", "Email di annuncio e messaggio nei gruppi", "Email + WhatsApp", "1")))
#sub[Rischi]
#tab(("Rischio", "Come lo riduci"), (38%, 62%), (("Scegliere senza dati", "Soglie e scheda di valutazione obbligatorie."), ("Accendere un hub vuoto", "Checklist di 12 punti: se manca un punto, resta «in arrivo»."), ("Promettere date", "Nessuna data pubblica finché non è certa."), ("Lista d'attesa troppo piccola", "Se sotto soglia dopo 4 settimane: rafforzare la raccolta prima di decidere.")))
#sub[Come capisci se funziona]
#tab(("Metrica", "Soglia (ipotesi)", "Entro"), (44%, 34%, 22%), (("Iscritti alla lista dell'hub scelto", "Almeno 100", "4 settimane di raccolta"), ("Visite all'hub nelle 2 settimane dopo il lancio", "Almeno il 40% degli iscritti", "2 settimane"), ("Esami pronti al lancio", "Almeno 3", "Al lancio")))
#nota[*Regola di stop.* #"Se dopo 4 settimane nessun hub supera la soglia, rimandare la decisione di un mese e investire nella raccolta (gruppi, ambassador) prima di costruire materiali."]
#sub[Prompt per l'AI]
Da incollare insieme a CONTESTO_DEMO.md.
#block(fill: navy, radius: 8pt, inset: 10pt, width: 100%, text(fill: crema, size: 8pt)[#raw("Richiesta di tipo C (promuovi) per la landing UniLink.\n\nContesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L08 («Quale hub parte per primo») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).\n\nCosa fare:\n- Prepara la scheda di valutazione (foglio) con i criteri e le soglie.\n- Quando l'hub è scelto e la checklist è completa, cambia lo stato in UL_CFG.hub e aggiorna la pagina dell'hub come nella scheda.\n- Aggiungi gli eventi di misura e prepara l'email di annuncio.\n- Non accendere l'hub se anche un solo punto della checklist manca.\n\nRegole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.", block: false)])
#sub[Cosa serve · da decidere · origine]
- #"Dati della lista d'attesa"
- #"Studenti disposti a costruire l'hub"
- #"Piano ufficiale verificato sul Course Catalogue UniFi"
- #"Soglia minima di iscritti?"
- #"Quali 3 esami per primi?"
#text(size: 8pt, fill: nv2)[#"Origine: Nota Cosimo 6/10 · landing cap. 10"]

#scheda("L09", "Voci degli studenti", "Fiducia · impatto 3/5 · sforzo 1/5")
#box-crema[*Il problema.* #"La v1 mostrava testimonianze di esempio: pubblicate come vere sarebbero recensioni false (vietate dalla normativa europea sulle pratiche commerciali)." \ \ *La proposta.* #"Tolta dalla home. La sezione si accende solo con almeno tre feedback reali raccolti con il form sulle dispense, con consenso scritto."]
#nota[*Il consiglio* (parere di Claude, da discutere: la decisione è vostra). #"Meglio un numero vero («876 persone nell'ultimo mese») che tre frasi inventate: la home usa già i numeri di Google."]
#sub[Panoramica]
#tab(("", ""), (22%, 78%), (("Obiettivo", "Mostrare feedback veri degli studenti, solo con consenso, per dare fiducia senza inventare niente."), ("Per chi", "Chi arriva per la prima volta e vuole sapere se UniLink funziona davvero."), ("Quando serve", "Quando ci sono almeno tre feedback veri e pubblicabili. Prima la sezione resta spenta."), ("Stima", "3–4 giorni di lavoro (form e sezione), poi la raccolta richiede settimane"), ("Dove vive", "Home, dopo «Chi c'è dietro».")))
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  box-crema(fill: nvt)[*Versione minima (MVP)* \
- #"Form «Com'è andato l'esame?» dopo l'uso di una dispensa"
- #"Registro dei feedback con consenso alla citazione"
- #"Sezione «Cosa dicono gli studenti» che si accende da sola con almeno 3 voci"
- #"Revisione mensile"],
  box-crema(fill: ar2)[*Dopo* \
- #"Valutazione di utilità per dispensa (stelle) visibile nell'area"
- #"Risposte del team alle critiche"
- #"Numeri aggregati (es. «8 su 10 la consigliano»)"],
  box-crema(fill: crema2)[*Non lo facciamo* \
- #"Testimonianze scritte da noi"
- #"Voti o stelle senza persone vere dietro"
- #"Ricompense che influenzano il giudizio senza dichiararlo"])
#sub[Pagine annotate]
Le pagine come sarebbero, sezione per sezione. Ogni numero è seguito da: perché la sezione c'è e cosa puoi cambiare senza rifare il design.
#block(above: 10pt, below: 2pt, text(size: 11.5pt)[#"Home · Cosa dicono gli studenti"]) #text(size: 8pt, fill: nv2)[#"index.html (dopo «Chi c'è dietro») — La sezione compare solo se ci sono almeno tre voci pubblicabili. Qui è disegnata con testi di esempio, che in produzione non esistono."]
#sezione(1, "Le voci", "V1", "Il giudizio degli altri studenti pesa più di qualsiasi nostra frase. Ma deve essere vero.", "Le voci vengono dalla collezione «Voci»: una riga = una voce con consenso.", "LP/Voce", "img/L09-p0-s1.jpg")
#sezione(2, "Numeri veri", "V2", "Se i feedback sono pochi, i numeri veri di Google tengono la fiducia.", "I numeri vengono da UL_CFG.numeri e dalla tabella dei feedback.", "LP/Numeri", "img/L09-p0-s2.jpg")
#sezione(3, "Raccolta del feedback", "V3", "Il consenso è una scelta esplicita e separata: senza il «Puoi citarmi» il testo non esce mai.", "Domande e scelte del form; il consenso resta obbligatorio per la citazione.", "LP/Form", "img/L09-p0-s3.jpg")
#sezione(4, "Regola della sezione", "V4", "Evita la sezione «vuota» e la tentazione di riempirla con testi finti.", "Soglia (3) nella configurazione.", "Regola", "img/L09-p0-s4.jpg")
#sub[Dati · #"Tabella «Feedback»"]
#text(size: 8pt, fill: nv2)[#"Dove: Supabase, scritta dal form · Chi lo aggiorna: Team (revisione) · Quando: Ogni mese"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("id", "identificativo", "automatico"), ("esame", "testo", "microeconomia"), ("voto_utilita", "1–5", "4"), ("testo", "testo", "Quello che ha scritto lo studente, senza modifiche"), ("nome_pubblico", "testo", "Giulia R. · II anno EA"), ("consenso_citazione", "data", "Senza data il testo non si pubblica"), ("pubblicabile", "sì/no", "Deciso dal team dopo la lettura"), ("verificato_da", "testo", "Chi ha controllato che sia una persona vera"), ("creato_il", "data", "automatico")))
#sub[Dati · #"Collezione «Voci»"]
#text(size: 8pt, fill: nv2)[#"Dove: Framer CMS · Chi lo aggiorna: Team · Quando: Quando un feedback diventa pubblicabile"]
#tab(("Campo", "Tipo", "Esempio / regola"), (24%, 18%, 58%), (("feedback_id", "testo", "Riferimento alla tabella"), ("testo_mostrato", "testo", "Uguale al feedback; accorciare solo con il consenso dell'autore"), ("nome_pubblico", "testo", "Come richiesto dallo studente"), ("ordine", "numero", "Più recenti prima")))
#sub[Regole]
- #"Mai testi inventati o modificati nel senso: si accorcia solo con il consenso dell'autore."
- #"Si pubblica solo con consenso scritto alla citazione (con la data)."
- #"Nessuna ricompensa che influenzi il giudizio; se c'è un incentivo, lo si dichiara."
- #"La sezione si accende da sola con almeno 3 voci pubblicabili e si spegne se scendono sotto."
- #"Non si selezionano solo i feedback positivi: le critiche ricorrenti si leggono e si risolvono."
- #"Le persone citate possono chiedere di essere tolte in qualsiasi momento."
#sub[Stati]
#tab(("Stato", "Cosa vede lo studente", "Testo"), (22%, 38%, 40%), (("Meno di 3 voci", "Sezione non visibile", "—"), ("3 o più voci", "Sezione visibile con le voci più recenti", "Cosa dicono gli studenti"), ("Form inviato", "Conferma", "Grazie! Il tuo feedback ci aiuta."), ("Senza consenso alla citazione", "Si salva come statistica anonima", "Va bene: non ti citeremo.")))
#sub[Testi proposti]
#tab(("Elemento", "Testo"), (28%, 72%), (("Titolo", "Cosa dicono gli studenti"), ("Frase del form", "Com'è andato l'esame?"), ("Consenso", "Acconsento a essere citato con il nome indicato."), ("Ringraziamento", "Grazie! Il tuo feedback ci aiuta."), ("Fiducia", "Pubblichiamo solo feedback veri, con il consenso di chi li ha scritti.")))
#sub[Misure]
#tab(("Evento", "Quando scatta", "Perché"), (28%, 36%, 36%), (("feedback_inviato", "Invio del form", "Quanti rispondono"), ("feedback_con_consenso", "«Puoi citarmi»", "Quante voci pubblicabili"), ("sezione_voci_vista", "La sezione entra nello schermo", "Se viene letta"), ("feedback_negativo", "Voto 1–2", "Dove migliorare")))
#sub[Integrazioni]
#tab(("Strumento", "Cosa fa", "Come si collega"), (24%, 30%, 46%), (("Form → Supabase", "Salva i feedback", "Form Framer o dalla scheda dispensa con webhook"), ("Framer CMS «Voci»", "Mostra le voci approvate", "Collezione collegata alla sezione"), ("Email (facoltativa)", "Invito al feedback dopo l'appello", "Messaggio opt-in nell'area personale")))
#sub[Da verificare (legale e privacy)]
- #"Recensioni e testimonianze finte o manipolate sono vietate dalla normativa europea sulle pratiche commerciali: pubblicare solo feedback veri e senza modifiche di senso."
- #"Se si offre un incentivo per lasciare un feedback va dichiarato: verificare con un consulente."
- #"Consenso alla citazione: scritto, con data, revocabile."
- #"Informativa sul trattamento dei dati del form."
#sub[Manutenzione]
#tab(("Cosa", "Chi", "Ogni quanto", "Come"), (26%, 22%, 22%, 30%), (("Lettura dei feedback", "Founder responsabile", "Ogni mese", "Leggere tutto, anche le critiche; marcare «pubblicabile»"), ("Voci mostrate", "Team", "Ogni mese", "Aggiungere le nuove e togliere chi lo chiede"), ("Risposte alle critiche", "Team", "Entro 1 settimana", "Rispondere nel gruppo o correggere il problema"), ("Informativa", "Team", "Una volta l'anno", "Rileggere")))
#sub[Piano di lavoro · #"3–4 giorni di lavoro (form e sezione), poi la raccolta richiede settimane"]
#tab(("N.", "Passo", "Dove", "Giorni"), (6%, 52%, 26%, 16%), (("1", "Scrivere il form e il consenso alla citazione", "Form", "1"), ("2", "Tabella «Feedback» e collezione «Voci»", "Supabase + Framer", "1"), ("3", "Sezione «Cosa dicono gli studenti» con la regola delle 3 voci", "index.html", "1"), ("4", "Invito al feedback dopo l'appello (opt-in)", "Area personale + email", "1"), ("5", "Raccogliere i primi feedback veri", "Lavoro umano", "settimane")))
#sub[Rischi]
#tab(("Rischio", "Come lo riduci"), (38%, 62%), (("Pochi feedback", "Tenere spenta la sezione; usare i numeri veri di Google."), ("Pubblicare solo il positivo", "Regola: si leggono e si affrontano anche le critiche."), ("Citazioni senza consenso", "Nessuna pubblicazione senza data di consenso."), ("Percezione di recensioni false", "Dichiarare come si raccolgono i feedback.")))
#sub[Come capisci se funziona]
#tab(("Metrica", "Soglia (ipotesi)", "Entro"), (44%, 34%, 22%), (("Feedback ricevuti", "Almeno 15", "8 settimane"), ("Feedback pubblicabili", "Almeno 3", "8 settimane"), ("Voto medio di utilità", "Almeno 4 su 5", "8 settimane")))
#nota[*Regola di stop.* #"Se dopo 8 settimane i feedback pubblicabili sono meno di 3, la sezione resta spenta: puntare sui numeri veri e sul gruppo WhatsApp."]
#sub[Prompt per l'AI]
Da incollare insieme a CONTESTO_DEMO.md.
#block(fill: navy, radius: 8pt, inset: 10pt, width: 100%, text(fill: crema, size: 8pt)[#raw("Richiesta di tipo C (promuovi) per la landing UniLink.\n\nContesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L09 («Voci degli studenti») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).\n\nCosa fare:\n- Aggiungi il form di feedback con consenso separato alla citazione e la tabella «Feedback».\n- Crea la collezione «Voci» e la sezione in index.html che si accende da sola con almeno 3 voci pubblicabili.\n- Nessun testo di esempio in produzione; nessuna modifica di senso ai testi.\n- Aggiungi gli eventi di misura.\n\nRegole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.", block: false)])
#sub[Cosa serve · da decidere · origine]
- #"Form di feedback sulle dispense"
- #"Consenso scritto di chi viene citato"
- #"Quanti feedback prima di accenderla (3? 5?)"
#text(size: 8pt, fill: nv2)[#"Origine: Landing v1 (sezione «Cosa dicono gli studenti»)"]
