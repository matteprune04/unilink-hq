# L02 · Metodo e piano di studio

Gruppo: Metodo · Stato: Da decidere · Impatto 5/5 · Sforzo 3/5 · Web app: D04

## Problema
Lo studente ha dispense e data d'appello, ma non sa come distribuire lo studio: è dove oggi UniLink non aiuta.

## Proposta
Una pagina «Il metodo» che spiega come studiamo (capire → fissare → allenarsi) e mostra il piano personalizzato: dalla data dell'appello e dagli argomenti, un calendario che si aggiorna mentre studi. Prima a regole semplici, poi adattivo.

## Consiglio (parere di Claude)
È il tuo differenziatore più forte: le dispense le hanno tutti, il metodo no. Parti con il piano a regole (già funzionante nella demo) e contenuti scritti dal team; l'AI adattiva è una fase successiva, quando ci sono dati di studio reali.

## Panoramica
- **Obiettivo:** Far capire come si studia con UniLink e dare a ogni studente un piano dalla data dell'appello: il motivo per scegliere UniLink invece di una dispensa qualsiasi.
- **Per chi:** Chi ha una data d'esame e non sa come distribuire gli argomenti, in particolare matricole e studenti con poco tempo.
- **Quando serve:** Prima della sessione di gennaio: il piano è la funzione più utile nelle settimane prima degli appelli.
- **Stima:** 10–14 giorni di lavoro (fase 1: piano a regole, senza AI)

### MVP
- Pagina «Il metodo» con le tre mosse e un esempio vero su un esame
- Piano per l'appello a regole semplici (già nella demo): data, argomenti, giorni di ripasso
- Argomenti ufficiali per i primi 5 esami
- Passaggio verso «Il mio piano» nell'area personale
- Messaggi chiari su cosa è gratuito

### Dopo
- Piano che si ricalcola se salti un giorno
- Promemoria via email il giorno prima
- Piano adattivo che pesa gli errori dei quiz, con AI
- Tutti i 34 esami

### Non lo facciamo
- Promesse sul voto finale
- Consigli su benessere o salute
- Calendari condivisi tra studenti

## Pagine

### Il metodo
`metodo.html` — Nuova pagina nella fase Durante. La sezione «Metodo e piano» di durante.html diventa un'anteprima con link.

1. **Hero** (M1)
   - Contenuto: Durante · Metodo · Studia con un piano, non a caso · Dalla data dell'appello al giorno dell'esame, un passo per volta. Tre mosse semplici e un calendario che si adatta a te. · Crea il tuo piano / Vedi come funziona
   - Perché: Promette una cosa sola e concreta: un piano. Il pulsante porta direttamente allo strumento.
   - Si può cambiare: Titolo, frase, foto (CMS «Pagine»). Tenere un solo pulsante primario.
   - Componenti: LP/Hero
2. **Le tre mosse** (M2)
   - Contenuto: Capisci — Appunti e mappe, un argomento alla volta: prima la struttura, poi i dettagli. · Fissa — Quiz brevi e ripasso degli errori: ciò che sbagli torna finché non lo sai. · Allenati — Simulazione nel formato dell'appello, a tempo, per arrivare senza sorprese.
   - Perché: È il «metodo»: tre verbi che si ricordano. Rende UniLink diverso da un archivio di PDF.
   - Si può cambiare: Tre titoli e tre frasi (CMS). Se cambia il metodo, cambiano solo queste righe.
   - Componenti: LP/Passo
3. **Prova il piano** (M3)
   - Contenuto: [piano]
   - Perché: Il piano funziona subito, senza account: chi lo prova capisce il valore in 20 secondi.
   - Si può cambiare: Parametri (giorni di ripasso, massimo al giorno) in tools.js; l'aspetto è lo stesso di tutti gli strumenti.
   - Componenti: LP/Strumento
4. **Un esempio vero** (M4)
   - Contenuto: Un esempio: Microeconomia in 4 settimane · Sette argomenti, un esame a novembre, un'ora al giorno. Ecco come si distribuiscono. || Settimana 1 — Domanda e offerta · Elasticità · Settimana 2 — Scelte del consumatore · Costi di produzione · Settimana 3 — Concorrenza perfetta · Monopolio · Settimana 4 — Oligopolio · simulazione completa
   - Perché: Un esempio concreto convince più di una spiegazione.
   - Si può cambiare: Si sostituisce con l'esame più cercato; gli argomenti vengono dalla collezione «Argomenti».
   - Componenti: LP/Card, Lista
5. **Dopo l'accesso** (M5)
   - Contenuto: [studio-piano]
   - Perché: Mostra cosa succede dopo: il piano non resta una pagina, diventa un calendario.
   - Si può cambiare: Lo screenshot si rifà dalla web app quando cambia.
   - Componenti: Schermata reale (img/app)
6. **Cosa è gratis** (M6)
   - Contenuto: ✓ — Gratis — Il piano per l'appello e il calendario base. —  — ar · ★ — Plus (ipotesi) — Piano guidato che si ricalcola e ripasso degli errori. —  — nv — Da decidere · ? — Da decidere — Dove passa il confine tra gratis e Plus: card L07 e D04. —  — nt
   - Perché: Onestà sul prezzo: dice cosa c'è e cosa è ancora da decidere, senza inventare prezzi.
   - Si può cambiare: Testi; quando L07 è decisa si sostituisce con il listino vero.
   - Componenti: LP/Card
7. **Domande frequenti** (M7)
   - Contenuto: Il piano garantisce il voto? — No: ti aiuta a organizzare lo studio. Il risultato dipende da te e dall'esame. · Posso cambiare i giorni? — Sì. Nell'area personale sposti le sessioni e il piano si adatta. · Da dove vengono gli argomenti? — Dal programma ufficiale del corso, con la data della fonte.
   - Perché: Toglie l'equivoco più pericoloso (promessa sul voto) e spiega la fonte.
   - Si può cambiare: Domande dal CMS «FAQ».
   - Componenti: LP/FAQ
8. **Chiamata finale** (M8)
   - Contenuto: Parti dal tuo prossimo appello · Crea il tuo piano / Apri l'area personale · Crea il piano in 20 secondi. Poi, se vuoi, portalo nella tua area personale.
   - Perché: Una sola azione a fine pagina.
   - Si può cambiare: Testo e due pulsanti.
   - Componenti: LP/Finale

## Dati · Collezione «Argomenti»
Dove: Framer CMS (o CSV: stessa fonte delle dispense) · Chi: Autori delle dispense · Quando: Ogni anno e se cambia il programma

| Campo | Tipo | Esempio / regola |
|---|---|---|
| esame | riferimento a Dispense | microeconomia |
| ordine | numero | 1…n: ordine consigliato di studio |
| titolo | testo | Domanda e offerta |
| ore_stimate | numero | 3 (stima di studio, non di lezione) |
| tipo | scelta | base · avanzato · ripasso |
| fonte | testo | Programma ufficiale, a.a. 2026/27 |
| verificato | sì/no | Controllato da chi ha dato l'esame |

## Dati · Parametri del piano
Dove: tools.js (o variabili Framer) · Chi: Team · Quando: Dopo i primi 100 piani

| Campo | Tipo | Esempio / regola |
|---|---|---|
| giorni_ripasso_default | numero | 2 |
| min_giorni_prima | numero | 3: sotto questa soglia si avvisa «poco tempo» |
| max_argomenti_giorno | numero | 3 |
| durata_sessione_min | numero | 45 |
| ricalcolo | sì/no | no nella fase 1; sì nella fase 2 |

## Regole
- Tutti gli argomenti prima, poi i giorni di ripasso: l'ultimo giorno è sempre ripasso e simulazione.
- Un argomento al giorno è il ritmo base; se mancano pochi giorni se ne mettono due, mai più del massimo.
- Se i giorni non bastano il piano lo dice, invece di nascondere il problema, e propone cosa togliere (il ripasso).
- L'ordine degli argomenti è quello del programma, non quello più facile.
- Il piano usa solo dati inseriti dallo studente (data, argomenti): nessuna previsione del voto.
- Fase 2: ricalcolo e AI possono cambiare l'ordine, mai nascondere argomenti del programma.

## Stati
| Stato | Cosa vede | Testo |
|---|---|---|
| Nessuna data | Il piano chiede la data dell'appello | Scegli la data del tuo appello per creare il piano. |
| Pochi giorni | Avviso arancio e piano compresso | Hai poco tempo: abbiamo messo due argomenti al giorno. |
| Impossibile | Il piano spiega e propone un'alternativa | Con questi giorni non bastano: togli il ripasso o sposta l'appello. |
| Piano pronto | Calendario con le sessioni | Il tuo piano è pronto: 7 argomenti in 21 giorni. |
| Appello passato | Invito a creare un nuovo piano | Questo appello è passato. Vuoi preparare il prossimo? |

## Testi
| Elemento | Testo |
|---|---|
| Titolo | Studia con un piano, non a caso |
| Frase | Dalla data dell'appello al giorno dell'esame, un passo per volta. |
| Pulsante principale | Crea il tuo piano |
| Tre mosse | Capisci · Fissa · Allenati |
| Avviso onestà | Il piano ti aiuta a organizzarti: non garantisce il voto. |
| Passaggio all'area | Portalo nella tua area personale |
| Fonte | Argomenti dal programma ufficiale, aggiornato a ottobre 2026 |

## Misure
| Evento | Quando | Perché |
|---|---|---|
| piano_creato | Si genera un piano | Quanti lo usano davvero |
| piano_data_scelta | Si imposta la data | Quanto manca in media: serve a tarare i giorni di ripasso |
| piano_verso_area | Clic su «Apri l'area personale» dal piano | Passaggio da landing ad area |
| piano_impossibile | Il piano non basta | Se le regole sono troppo severe |
| metodo_esempio_visto | L'esempio entra nello schermo | Se la pagina viene letta fino in fondo |

## Integrazioni
| Strumento | Cosa fa | Come |
|---|---|---|
| tools.js (funzione «piano») | Calcola il calendario | In Framer come componente di codice: la funzione si copia così com'è |
| Collezione «Argomenti» | Fornisce gli argomenti dell'esame | Lettura dal CMS o da CSV: stessa fonte delle dispense |
| Area personale (web app) | Salva e mostra il piano | Il piano si porta nell'area con un link (parametri: esame e data) e diventa «Il mio piano» |
| AI (fase 2) | Rende il piano adattivo | API del modello a scelta; costi per richiesta e limiti da decidere |

## Da verificare (legale/privacy)
- Nessuna promessa sul voto o sull'esito dell'esame.
- Il programma degli esami è quello ufficiale: citare la fonte e la data.
- Fase 2 con AI: informativa su cosa viene inviato al modello; niente dati personali nei prompt.
- Dati dello studente (date, argomenti spuntati) nell'area: informativa e cancellazione.

## Manutenzione
| Cosa | Chi | Ogni quanto | Come |
|---|---|---|---|
| Argomenti degli esami | Autori delle dispense | Ogni anno e se cambia il programma | Aggiornare la collezione «Argomenti» e la data di verifica |
| Parametri del piano | Team | Dopo i primi 100 piani | Guardare gli eventi e cambiare giorni di ripasso e massimo al giorno |
| Testi dell'esempio | Team | Una volta l'anno | Ricontrollare che l'esempio rispecchi il programma |
| Costi dell'AI (fase 2) | Founder responsabile del prodotto | Ogni mese | Controllare consumi e limiti |

## Piano di lavoro (10–14 giorni di lavoro (fase 1: piano a regole, senza AI))
| N. | Passo | Dove | Giorni |
|---|---|---|---|
| 1 | Raccogliere gli argomenti ufficiali dei primi 5 esami | Collezione «Argomenti» | 2 |
| 2 | Pagina «Il metodo»: hero, tre mosse, esempio, FAQ | metodo.html | 3 |
| 3 | Collegare lo strumento «Piano» agli argomenti dell'esame | tools.js + CMS | 2 |
| 4 | Passaggio verso l'area personale (parametri esame e data) | Landing + web app | 2 |
| 5 | Trasformare la sezione «Metodo» di Durante in anteprima con link | durante.html | 0,5 |
| 6 | Eventi di misura | Analytics | 0,5 |
| 7 | Prova con 5 studenti con un appello vero | Tutta la pagina | 2 |
| 8 | Correzioni e annuncio | Landing + WhatsApp | 1 |

## Rischi
| Rischio | Come lo riduci |
|---|---|
| Il piano sembra una promessa | Testi chiari: aiuta a organizzare, non garantisce il voto. |
| Argomenti sbagliati o vecchi | Verifica annuale e data della fonte visibile. |
| Chi non ha tempo riceve un piano impossibile | Stato «impossibile» onesto, con alternativa. |
| Costi e complessità dell'AI | Non in fase 1: partire a regole e decidere dopo, con i dati veri. |
| Sovrapposizione con il piano guidato Plus dell'app | Decidere il confine gratis/Plus in L07 e D04 prima di promettere. |

## Successo
| Metrica | Soglia | Entro |
|---|---|---|
| Piani creati a settimana | Almeno 50 nel mese prima della sessione | Sessione di gennaio |
| Passaggi verso l'area personale | Almeno il 20% di chi crea un piano | 4 settimane |
| Chi dice «mi ha aiutato» | Almeno 7 su 10 | Dopo l'appello |

Regola di stop: Se meno del 10% di chi apre la pagina crea un piano, il problema è il messaggio, non la funzione: riscrivere hero e passi prima di aggiungere l'AI.

## Prompt per l'AI

Richiesta di tipo C (promuovi) per la landing UniLink.

Contesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L02 («Metodo e piano di studio») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).

Cosa fare:
- Crea metodo.html con le 8 sezioni della scheda e collega «Il metodo» dal menu Durante.
- Aggiungi la collezione «Argomenti» e collega lo strumento «piano» agli argomenti dell'esame.
- Trasforma la sezione Metodo di durante.html in anteprima con link.
- Fase 1 soltanto: regole semplici, nessuna AI.

Regole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.
