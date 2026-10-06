# L05 · Borse di studio e tasse

Gruppo: Orientamento · Stato: Da decidere · Impatto 4/5 · Sforzo 4/5

## Problema
Molti studenti non sanno dove trovare bandi e scadenze (DSU e altri).

## Proposta
Una guida nella fase «Prima» con le informazioni chiave del bando, le scadenze e i link alle fonti ufficiali. Promemoria nell'area personale.

## Consiglio (parere di Claude)
Alto valore e poco sforzo di design, ma richiede qualcuno che aggiorni le scadenze ogni anno: senza responsabile, meglio non pubblicarla.

## Panoramica
- **Obiettivo:** Aiutare a trovare bandi e scadenze su borse e tasse, sempre con rimando alle fonti ufficiali.
- **Per chi:** Matricole e famiglie; studenti con ISEE basso che non conoscono le agevolazioni.
- **Quando serve:** Prima delle scadenze dei bandi (le date cambiano ogni anno: vanno prese dalle fonti ufficiali).
- **Stima:** 6–8 giorni di lavoro, più una persona responsabile degli aggiornamenti

### MVP
- Pagina «Borse e tasse» nella fase Prima: cosa esiste, come fare domanda, cosa preparare
- Elenco delle scadenze con fonte, apertura, chiusura e «ultimo controllo»
- Checklist dei documenti (ISEE e altri, da verificare sul bando)
- Rimando sempre alla fonte ufficiale

### Dopo
- Promemoria via email nell'area personale, con consenso
- Calendario .ics delle scadenze
- Guide per altri atenei

### Non lo facciamo
- Consulenza personale su ISEE o reddito
- Compilare le domande al posto dello studente
- Raccogliere ISEE o dati economici

## Pagine

### Borse e tasse
`borse.html` — Nuova pagina nella fase Prima. Le date nel disegno sono segnaposto: i dati veri vengono dalla collezione «Scadenze».

1. **Hero** (B1)
   - Contenuto: Prima · Borse e tasse · Sapere prima quanto costa · Bandi, scadenze e agevolazioni in un posto solo, sempre con il link alla fonte ufficiale. · Guarda le scadenze / Cosa preparare
   - Perché: Il tema è l'ansia dei soldi: il titolo parla di certezza e la frase promette fonti, non consigli.
   - Si può cambiare: Titolo e frase.
   - Componenti: LP/Hero
2. **Cosa esiste** (B2)
   - Contenuto: € — Borse per reddito — Aiuti economici legati alla situazione economica (ISEE). Requisiti e importi dal bando ufficiale. — Fonte ufficiale — ar · % — Esoneri e riduzioni — Riduzioni delle tasse per chi rientra in certi requisiti. Verifica sul sito del tuo ateneo. — Fonte ufficiale — nt · ⌂ — Alloggio e servizi — Posti letto e mense per il diritto allo studio, secondo i bandi dell'ente regionale. — Fonte ufficiale —  || Nota per il team: secondo Cosimo, a UniFi non esistono borse per merito, solo per reddito. Da verificare sul bando prima di scriverlo.
   - Perché: Dà la mappa dei tipi di aiuto senza entrare nei dettagli che cambiano ogni anno.
   - Si può cambiare: Tre card dal CMS; ogni riga ha il link alla fonte.
   - Componenti: LP/Card
3. **Scadenze** (B3)
   - Contenuto: 
   - Perché: È il cuore della pagina: la data giusta salva una domanda. «Controllato» dice quanto è fresca.
   - Si può cambiare: Una riga = una riga della collezione «Scadenze». Se «controllato» è vecchio, le date si nascondono.
   - Componenti: Tabella (LP/Lista)
4. **Come fare domanda** (B4)
   - Contenuto: Leggi il bando — Requisiti, importi e scadenze sono solo lì. · Prepara i documenti — ISEE e gli altri documenti richiesti dal bando. · Invia dal sito ufficiale — La domanda si fa sempre sul sito dell'ente, non su UniLink.
   - Perché: Chiarisce che UniLink non riceve domande: evita equivoci e responsabilità.
   - Si può cambiare: Tre frasi.
   - Componenti: LP/Passo
5. **Cosa preparare** (B5)
   - Contenuto: Documenti da avere pronti (da verificare sul bando) · ISEE per il diritto allo studio universitario — Si chiede all'INPS o a un CAF — Controlla · Documento di identità e codice fiscale — In corso di validità —  · Dati dell'iscrizione — Corso, anno, esami e crediti — 
   - Perché: Una checklist concreta riduce gli errori e dà senso di controllo.
   - Si può cambiare: Righe della checklist dal CMS.
   - Componenti: Lista
6. **Domande frequenti** (B6)
   - Contenuto: UniLink mi dice se ho diritto alla borsa? — No: ti dice dove guardare. Solo il bando ufficiale stabilisce i requisiti. · Le date sono sempre aggiornate? — Le controlliamo ogni mese e mostriamo quando. Se una data è vecchia, la nascondiamo. · Raccogliete il mio ISEE? — No. Non ti chiediamo dati economici.
   - Perché: Toglie il rischio di consulenza e di raccolta di dati sensibili.
   - Si può cambiare: CMS «FAQ».
   - Componenti: LP/FAQ
7. **Promemoria** (B7)
   - Contenuto: Non perdere nessuna scadenza · Attiva i promemoria / Entra nel gruppo · Nell'area personale puoi chiedere un promemoria prima della chiusura dei bandi che ti interessano.
   - Perché: Porta al prodotto con un vantaggio concreto.
   - Si può cambiare: Testo; i promemoria sono fase 2.
   - Componenti: LP/Finale

## Dati · Collezione «Scadenze»
Dove: Framer CMS · Chi: Una persona responsabile (da nominare) · Quando: Ogni mese e a ogni nuovo bando

| Campo | Tipo | Esempio / regola |
|---|---|---|
| nome | testo | Borsa di studio per il diritto allo studio |
| ente | testo | Ente regionale / Ateneo |
| tipo | scelta | borsa · esonero · alloggio · altro |
| apertura | data | Dal bando ufficiale |
| chiusura | data | Dal bando ufficiale |
| requisiti_sintesi | testo breve | Solo un riassunto, mai l'unica fonte |
| documenti | elenco | ISEE, documento, … |
| fonte_url | URL | Pagina ufficiale del bando (obbligatoria) |
| ultimo_controllo | data | Se più vecchio di 30 giorni: badge «Da riverificare» e date nascoste |
| stato | scelta | attiva · scaduta · da_verificare |

## Regole
- Ogni riga ha un link alla fonte ufficiale: senza link non si pubblica.
- Se «ultimo controllo» ha più di 30 giorni il badge diventa «Da riverificare» e le date si nascondono.
- Scaduta la chiusura la riga passa in archivio e non compare più nell'elenco principale.
- UniLink non scrive requisiti completi: riassume e rimanda al bando.
- Nessun dato economico viene richiesto o salvato.
- Se non c'è una persona responsabile degli aggiornamenti, la pagina non va pubblicata.

## Stati
| Stato | Cosa vede | Testo |
|---|---|---|
| Scadenza attiva | Date e pulsante «Vai al bando» | Chiude il gg/mm |
| Da riverificare | Badge arancio, date nascoste | Stiamo ricontrollando questa scadenza: guarda il bando ufficiale. |
| Scaduta | Nell'archivio | Questo bando è chiuso. |
| Nessuna scadenza | Messaggio onesto | In questo momento non ci sono bandi aperti che conosciamo: controlla le fonti ufficiali. |

## Testi
| Elemento | Testo |
|---|---|
| Titolo | Sapere prima quanto costa |
| Frase | Bandi, scadenze e agevolazioni in un posto solo, sempre con il link alla fonte ufficiale. |
| Avviso | UniLink non ti dice se hai diritto: solo il bando ufficiale lo stabilisce. |
| Pulsante riga | Vai al bando |
| Badge controllo | Controllato il gg/mm |
| Promemoria | Attiva il promemoria |

## Misure
| Evento | Quando | Perché |
|---|---|---|
| clic_vai_al_bando | Clic su «Vai al bando» | Interesse reale, per bando |
| clic_promemoria | Clic su «Attiva i promemoria» | Quanti vogliono il promemoria |
| apertura_checklist | Si apre la checklist dei documenti | Se serve |
| dati_vecchi_mostrati | Una riga «Da riverificare» è visibile | Se la manutenzione regge |

## Integrazioni
| Strumento | Cosa fa | Come |
|---|---|---|
| CMS «Scadenze» | Elenco e checklist | Collezione collegata alla tabella con filtro su stato e controllo |
| Promemoria email (fase 2) | Avviso prima della chiusura | Servizio di invio e consenso nell'area personale |
| Calendario .ics (fase 2) | Scadenze nel calendario | File generato dalle righe attive |

## Da verificare (legale/privacy)
- Informazione, non consulenza: dirlo in pagina e rimandare sempre alla fonte ufficiale.
- Non raccogliere ISEE o dati economici.
- Informazioni sbagliate su soldi e scadenze possono far perdere un diritto: senza un responsabile degli aggiornamenti non pubblicare.
- Promemoria email: consenso separato e cancellazione facile.

## Manutenzione
| Cosa | Chi | Ogni quanto | Come |
|---|---|---|---|
| Controllo di ogni scadenza | Persona responsabile (da nominare) | Ogni mese | Aprire la fonte, confrontare, aggiornare «ultimo controllo» |
| Nuovi bandi | Persona responsabile | A ogni apertura | Aggiungere la riga con fonte e documenti |
| Archivio | Persona responsabile | A fine anno accademico | Spostare i bandi scaduti |
| Testi della pagina | Team | Una volta l'anno | Rileggere e controllare i rimandi |

## Piano di lavoro (6–8 giorni di lavoro, più una persona responsabile degli aggiornamenti)
| N. | Passo | Dove | Giorni |
|---|---|---|---|
| 1 | Nominare la persona responsabile e il calendario dei controlli | Decisione | 0,5 |
| 2 | Raccogliere i bandi dell'anno con fonte | Collezione «Scadenze» | 2 |
| 3 | Collezione e regole (controllo, archivio) | Framer CMS | 1 |
| 4 | Pagina «Borse e tasse» | borse.html | 3 |
| 5 | Eventi di misura | Analytics | 0,5 |
| 6 | Prova con 3 matricole e correzioni | Tutta la pagina | 1 |

## Rischi
| Rischio | Come lo riduci |
|---|---|
| Date sbagliate o vecchie | Controllo mensile, «ultimo controllo» visibile, date nascoste se vecchie. |
| Percepita come consulenza | Avvisi in pagina e rimando al bando. |
| Nessuno aggiorna | Senza responsabile non si pubblica. |
| Carico alto a ridosso dei bandi | Calendario dei controlli intorno alle scadenze. |

## Successo
| Metrica | Soglia | Entro |
|---|---|---|
| Clic su «Vai al bando» | Almeno 100 nel periodo dei bandi | Stagione dei bandi |
| Righe con controllo entro 30 giorni | 100% | Sempre |
| Segnalazioni di errori | 0 non risolti entro 3 giorni | Sempre |

Regola di stop: Se un controllo mensile salta due volte di fila, ritirare la pagina finché non c'è di nuovo un responsabile.

## Prompt per l'AI

Richiesta di tipo C (promuovi) per la landing UniLink.

Contesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L05 («Borse di studio e tasse») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).

Cosa fare:
- Crea borse.html con le 7 sezioni della scheda e collega la scheda di prima.html.
- Crea la collezione «Scadenze» con le regole di controllo (30 giorni) e il link alla fonte obbligatorio.
- Non pubblicare date inventate: usa solo dati con fonte; senza dati mostra lo stato «Nessuna scadenza».
- Nessun dato economico richiesto o salvato.

Regole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.
