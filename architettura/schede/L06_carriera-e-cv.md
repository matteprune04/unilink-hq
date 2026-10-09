# L06 · Carriera e CV

Gruppo: Dopo · Stato: Da decidere · Impatto 4/5 · Sforzo 2/5 · Web app: D05

## Problema
Chi pensa a magistrali e stage non sa quanto il proprio CV sia vicino al profilo tipo.

## Proposta
Nella fase «Dopo»: guida breve (CV, colloquio, LinkedIn) e, nell'area personale, confronto del CV con un profilo tipo. Career Score e opportunità solo nella visione.

## Consiglio (parere di Claude)
Quick win: parte da contenuti scritti dal team, costa poco e dà traffico organico. Evita le promesse sulle opportunità finché non hai partner reali.

## Panoramica
- **Obiettivo:** Dare ai laureandi e ai laureati i primi passi di carriera: CV in ordine, colloquio e scelta del percorso, senza promettere opportunità.
- **Per chi:** Studenti degli ultimi anni e neolaureati che pensano a stage, lavoro o magistrale.
- **Quando serve:** Insieme alla fase Dopo: ha senso quando la pagina Tesi e laurea è online e ci sono studenti al terzo anno.
- **Stima:** 7–10 giorni di lavoro (guida e controllo CV a checklist)

### MVP
- Guida in quattro mosse (profilo, CV in una pagina, colloquio, LinkedIn)
- «Controlla il tuo CV»: checklist di 10 punti nel browser, senza caricare file
- Quattro profili tipo (Finance, Consulenza, Marketing, Impresa) con tre azioni ciascuno
- Rimando al template e al confronto del CV nell'area personale

### Dopo
- Confronto del CV con un profilo tipo nell'area, con caricamento privato
- Career Score
- Opportunità, solo con partner reali

### Non lo facciamo
- Offerte di lavoro o di stage proprie senza partner
- Promesse di assunzione
- Valutazione del CV con AI senza consenso

## Pagine

### Carriera e CV
`carriera.html` — Nuova pagina nella fase Dopo: sostituisce la scheda «Carriera e CV» di dopo.html, che diventa un rimando.

1. **Hero** (C1)
   - Contenuto: Dopo · Carriera e CV · Un CV in ordine, un passo alla volta · Guide brevi e una checklist per controllare il tuo CV in due minuti. Senza caricare niente. · Controlla il tuo CV / Leggi la guida
   - Perché: Promette un risultato piccolo e immediato, con una garanzia di privacy.
   - Si può cambiare: Titolo, frase e foto.
   - Componenti: LP/Hero
2. **La guida in quattro mosse** (C2)
   - Contenuto: 1 — Scegli il profilo — Quale strada ti interessa davvero. · 2 — Scrivi il CV in una pagina — Poche righe e risultati concreti. · 3 — Prepara il colloquio — Le domande che tornano sempre. · 4 — Cura il tuo profilo online — Un riassunto chiaro e una foto sobria.
   - Perché: Il percorso è lineare: si può leggere tutto o saltare alla checklist.
   - Si può cambiare: Quattro testi; ogni card può linkare una guida più lunga.
   - Componenti: LP/Card
3. **Controlla il tuo CV** (C3)
   - Contenuto: 7/10 — punti a posto · 3 — da migliorare · 0 — file caricati || Una sola pagina — Un CV da neolaureato sta in una pagina — ✓ — on · Risultati, non solo compiti — Cosa hai ottenuto, con numeri se possibile — Da fare · Lingua e test — Livello indicato e, se c'è, certificazione — ✓ — on · Contatti aggiornati — Email professionale e telefono — ✓ — on
   - Perché: È lo strumento che fa tornare: dieci spunte, un punteggio, tre consigli. Tutto nel browser.
   - Si può cambiare: I dieci punti e i consigli sono nella collezione «Checklist CV».
   - Componenti: LP/Checklist, LP/Strumento
4. **Profili tipo** (C4)
   - Contenuto: F — Finance — Basi di matematica finanziaria e contabilità, inglese solido. — Vedi il profilo — ar · C — Consulenza — Ragionamento strutturato, presentazioni, esperienze di gruppo. — Vedi il profilo — nt · M — Marketing — Dati, comunicazione, un progetto concreto da mostrare. — Vedi il profilo —  · I — Impresa — Visione d'insieme, organizzazione, iniziativa. — Vedi il profilo — ar
   - Perché: Il profilo tipo dà un riferimento, non un obbligo: descrive il «tipico», non il «requisito».
   - Si può cambiare: Una riga della collezione «Profili tipo» per profilo.
   - Componenti: LP/Card
5. **Nell'area personale** (C5)
   - Contenuto: [decidere-career-opportunita]
   - Perché: Mostra il passo successivo con una schermata vera.
   - Si può cambiare: Lo screenshot si rifà dalla web app.
   - Componenti: Schermata reale (img/app)
6. **Template del CV** (C6)
   - Contenuto: Un modello già impaginato · Scarica nell'area / Come usarlo · Un template pulito in formato Word e PDF, disponibile nell'area personale.
   - Perché: Una cosa concreta da portarsi via, che porta all'area.
   - Si può cambiare: Testo e file (collezione «Template»).
   - Componenti: LP/Finale
7. **Domande frequenti** (C7)
   - Contenuto: Caricate il mio CV? — No. La checklist funziona nel tuo browser e non salva niente. · Mi trovate un lavoro? — No: non promettiamo opportunità. Ti aiutiamo a presentarti meglio. · I profili tipo sono requisiti? — No: sono esempi di ciò che di solito si cerca.
   - Perché: Dice subito privacy e limiti.
   - Si può cambiare: CMS «FAQ».
   - Componenti: LP/FAQ

## Dati · Collezione «Profili tipo»
Dove: Framer CMS · Chi: Autori dei contenuti, con revisione di un laureato nel settore · Quando: Una volta l'anno

| Campo | Tipo | Esempio / regola |
|---|---|---|
| nome | testo | Finance |
| descrizione | testo | Cosa fa chi lavora in questo campo |
| competenze | elenco | Contabilità, inglese, Excel |
| esperienze_tipiche | elenco | Stage, progetto, associazione |
| azioni | 3 testi | Le tre azioni consigliate |
| fonte | testo | Da dove viene l'informazione |
| ultimo_controllo | data | Annuale |

## Dati · Collezione «Checklist CV»
Dove: tools.js o Framer CMS · Chi: Team · Quando: Una volta l'anno

| Campo | Tipo | Esempio / regola |
|---|---|---|
| punto | testo | Una sola pagina |
| peso | numero | 1 |
| consiglio | testo | Se non c'è, cosa fare |
| ordine | numero | 1…10 |

## Dati · Collezione «Template»
Dove: Area personale (file) · Chi: Team · Quando: Quando cambia il modello

| Campo | Tipo | Esempio / regola |
|---|---|---|
| nome | testo | CV neolaureato |
| file | file | Word e PDF |
| versione | testo | 1.0 |
| licenza | testo | Uso libero da parte dello studente |

## Regole
- La checklist funziona solo nel browser: nessun file caricato, nessun dato salvato.
- Il punteggio è un semplice conteggio dei punti a posto; i consigli sono sempre gentili e concreti.
- I profili tipo descrivono ciò che è tipico, mai ciò che è richiesto.
- Nessuna offerta di lavoro o stage finché non ci sono partner reali.
- Il confronto del CV con un profilo (caricamento) esiste solo nell'area, con privacy e cancellazione.

## Stati
| Stato | Cosa vede | Testo |
|---|---|---|
| Checklist vuota | Dieci punti da spuntare | Spunta ciò che il tuo CV ha già. |
| Risultato alto | Messaggio positivo e un solo consiglio | Ottimo! Ti manca un solo punto. |
| Risultato basso | Tre consigli in ordine di priorità | Partiamo da tre cose semplici. |
| Profilo non ancora disponibile | Messaggio onesto | Questo profilo arriva presto. |

## Testi
| Elemento | Testo |
|---|---|
| Titolo | Un CV in ordine, un passo alla volta |
| Frase | Guide brevi e una checklist per controllare il tuo CV in due minuti. Senza caricare niente. |
| Pulsante principale | Controlla il tuo CV |
| Garanzia | Non carichiamo né salviamo il tuo CV. |
| Avviso profili | Sono esempi di ciò che di solito si cerca, non requisiti. |
| Passaggio all'area | Scarica il template nell'area personale |

## Misure
| Evento | Quando | Perché |
|---|---|---|
| checklist_iniziata | Prima spunta | Chi prova |
| checklist_completata | Ultima spunta | Chi arriva in fondo |
| punteggio_cv | Punteggio a fine checklist | Dove sono i problemi tipici |
| clic_profilo_tipo | Clic su un profilo | Quali carriere interessano |
| clic_verso_area | Clic verso l'area personale | Il passaggio al prodotto |

## Integrazioni
| Strumento | Cosa fa | Come |
|---|---|---|
| tools.js (checklist) | Calcola il punteggio | Componente di codice in Framer |
| CMS «Profili tipo» | Contenuti dei profili | Collezione collegata alla pagina |
| Area personale (modulo Career, proposta D05/D06 nella web app) | Template e confronto del CV | Link con l'area di studio nei parametri |
| Partner (solo in futuro) | Opportunità | Accordo scritto prima di pubblicare qualsiasi offerta |

## Da verificare (legale/privacy)
- Il CV contiene dati personali: nessun caricamento nella landing; nell'area solo con consenso, archivio privato e cancellazione.
- Nessuna promessa di assunzione o di risultato.
- Template: verificare la licenza dei font e delle immagini.
- Profili tipo: non attribuire requisiti a aziende o professioni specifiche senza fonte.

## Manutenzione
| Cosa | Chi | Ogni quanto | Come |
|---|---|---|---|
| Profili tipo | Autori + un laureato del settore | Una volta l'anno | Rileggere, aggiornare competenze ed esperienze |
| Checklist del CV | Team | Una volta l'anno | Controllare che i punti siano ancora validi |
| Template | Team | Quando serve | Aggiornare e ripubblicare la versione |
| Guide | Autori | Ogni 6 mesi | Rileggere e correggere |

## Piano di lavoro (7–10 giorni di lavoro (guida e controllo CV a checklist))
| N. | Passo | Dove | Giorni |
|---|---|---|---|
| 1 | Scrivere i dieci punti della checklist e i consigli | Contenuti | 1 |
| 2 | Logica della checklist (spunte, punteggio, consigli) | tools.js | 1,5 |
| 3 | Scrivere i quattro profili tipo con revisione | Collezione «Profili tipo» | 2 |
| 4 | Pagina «Carriera e CV» | carriera.html | 3 |
| 5 | Template del CV | Area personale | 1 |
| 6 | Eventi di misura | Analytics | 0,5 |
| 7 | Prova con 5 laureandi | Tutta la pagina | 1 |

## Rischi
| Rischio | Come lo riduci |
|---|---|
| Contenuti generici | Scrivere con laureati del settore e rivedere ogni anno. |
| Promesse implicite di lavoro | Avvisi chiari e nessuna offerta senza partner. |
| Privacy sul CV | Nessun caricamento in landing; nell'area solo con consenso. |
| Poco traffico | È un contenuto che dà traffico organico nel tempo: valutare dopo 3 mesi. |

## Successo
| Metrica | Soglia | Entro |
|---|---|---|
| Checklist completate | Almeno 100 | 8 settimane |
| Passaggi verso l'area | Almeno 15% delle checklist | 8 settimane |
| Download del template | Almeno 50 | 8 settimane |

Regola di stop: Se dopo 8 settimane le checklist completate sono meno di 30, non investire in Career Score o opportunità: tenere solo la guida.

## Prompt per l'AI

Richiesta di tipo C (promuovi) per la landing UniLink.

Contesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L06 («Carriera e CV») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).

Cosa fare:
- Crea carriera.html con le 7 sezioni della scheda; la scheda «Carriera e CV» di dopo.html diventa un rimando.
- Aggiungi in tools.js la checklist del CV (10 punti, punteggio, consigli) che funziona solo nel browser.
- Crea le collezioni «Profili tipo» e «Template».
- Nessun caricamento di file, nessuna offerta di lavoro.

Regole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.
