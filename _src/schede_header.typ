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
    UniLink · Schede «Da decidere» #h(1fr) __VERSIONE__
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
