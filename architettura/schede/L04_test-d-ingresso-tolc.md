# L04 · Test d'ingresso (TOLC)

Gruppo: Orientamento · Stato: Da decidere · Impatto 5/5 · Sforzo 5/5 · Web app: D12

## Problema
Far conoscere UniLink ai futuri studenti prima dell'iscrizione: è il momento in cui scelgono come studiare.

## Proposta
Nella fase «Prima»: diagnostico gratuito di 20 domande e un percorso di preparazione per materia.

## Consiglio (parere di Claude)
Settore competitivo e a Firenze molti corsi sono ad accesso libero. Valuta dopo i nuovi hub: per Medicina il semestre filtro è un'opportunità più concreta del TOLC.

## Panoramica
- **Obiettivo:** Far incontrare UniLink ai futuri studenti prima dell'iscrizione, con un diagnostico gratuito e un percorso di preparazione nell'area personale (percorso Test Prep).
- **Per chi:** Studenti dell'ultimo anno di superiori e chi si iscrive a corsi con test d'ingresso o con semestre filtro.
- **Quando serve:** Dopo i nuovi hub (L08), o in parallelo solo per Medicina: il semestre filtro è l'occasione più concreta. Se e come il test è richiesto a UniFi va verificato sul bando.
- **Stima:** 15–20 giorni, di cui 6–8 per scrivere e verificare le domande

### MVP
- Pagina «Test d'ingresso» nella fase Prima, con scelta del corso e rimando alla fonte ufficiale
- Diagnostico gratuito di 20 domande originali (logica e matematica), senza account
- Risultato con punti forti e deboli e invito al percorso Test Prep nell'area
- Banca iniziale di 80 domande originali, verificate da due persone

### Dopo
- Simulazioni a tempo nel formato del test
- Registro errori e ripasso (già visibile nella web app demo)
- Banca per le tre materie di Medicina (Fisica, Chimica, Biologia)
- Piani a pagamento (L07)

### Non lo facciamo
- Copiare o parafrasare quesiti ufficiali
- Promettere ammissione o punteggi
- Dichiarare regole di ammissione senza fonte

## Pagine

### Test d'ingresso
`test-ingresso.html` — Nuova pagina nella fase Prima: sostituisce la scheda «Test d'ingresso» di prima.html, che diventa un rimando.

1. **Hero** (I1)
   - Contenuto: Prima · Test d'ingresso · Capisci dove sei, prima del test · 20 domande per vedere da dove partire. Gratis, senza account, due minuti. · Fai il diagnostico / Quale test devo fare?
   - Perché: Promette una cosa piccola e subito utile; chi arriva dai social deve poter iniziare senza registrarsi.
   - Si può cambiare: Titolo, frase e foto.
   - Componenti: LP/Hero
2. **Quale test devo fare?** (I2)
   - Contenuto: € — Economia — Test CISIA (TOLC-E): verifica sul bando del tuo ateneo se e come è richiesto. — Fonte ufficiale — ar · + — Medicina — Semestre filtro: Fisica, Chimica, Biologia. Date e regole solo da fonti ufficiali. — Fonte ufficiale — nt · § — Giurisprudenza — Verifica sul bando: non diamo per scontato che ci sia un test. — Fonte ufficiale — 
   - Perché: Prima di allenarsi bisogna sapere cosa serve davvero: UniLink indirizza alla fonte, non la sostituisce.
   - Si può cambiare: Una riga per area dalla configurazione delle aree (nome, nota, fonte, ultimo controllo).
   - Componenti: LP/Card
3. **Il diagnostico** (I3)
   - Contenuto: 1/20 — domanda · 2 min — tempo stimato · 0 € — costo || Una domanda di esempio · Un prodotto costa 80 €. Dopo uno sconto del 25% e poi un aumento del 10% sul prezzo scontato, quanto costa? || A · 66 € · B · 68 € · C · 70 € · D · 72 €
   - Perché: Il quiz è il prodotto: una domanda per schermo, avanzamento sempre visibile, nessuna registrazione.
   - Si può cambiare: Le domande vengono dalla banca; numero e mix per materia sono parametri.
   - Componenti: LP/Strumento (variante quiz)
4. **Il risultato** (I4)
   - Contenuto: 14/20 — risposte giuste · Logica — punto di forza · Matematica — da rafforzare || Allenati sui punti deboli · Apri Test Prep / Rifai il diagnostico · Nell'area personale trovi allenamento e registro errori. Il risultato non viene salvato se non lo chiedi.
   - Perché: Il risultato dà una direzione concreta e porta al prodotto, senza chiedere dati.
   - Si può cambiare: Testi e soglie dei messaggi.
   - Componenti: LP/Finale
5. **Dopo l'accesso** (I5)
   - Contenuto: [test-test] || [test-allenamento]
   - Perché: Mostra cosa si ottiene dopo il diagnostico, con schermate vere della web app.
   - Si può cambiare: Gli screenshot si rifanno dalla web app.
   - Componenti: Schermate reali (img/app)
6. **Cosa è gratis** (I6)
   - Contenuto: ✓ — Gratis — Diagnostico e quiz rapido (10 domande al giorno). —  — ar · ★ — Plus (ipotesi) — Simulazioni a tempo, registro errori, piano guidato. —  — nv — Da decidere · ? — Da decidere — Il confine tra gratis e Plus: card L07. —  — nt
   - Perché: Onestà sul modello: niente prezzi inventati.
   - Si può cambiare: Testi; il listino vero arriva con L07.
   - Componenti: LP/Card
7. **Domande frequenti** (I7)
   - Contenuto: Devo fare il test per iscrivermi a UniFi? — Dipende dal corso e dall'anno: guarda sempre il bando ufficiale. Noi ti diciamo dove cercare. · Le domande sono quelle vere? — No: sono domande originali, scritte per allenarti. Non copiamo i quesiti ufficiali. · Il diagnostico garantisce l'ammissione? — No: ti dice da dove partire.
   - Perché: Chiarisce i due equivoci che creano problemi (obbligo del test e domande «vere»).
   - Si può cambiare: CMS «FAQ».
   - Componenti: LP/FAQ

## Dati · Banca domande
Dove: Foglio CSV nel repository o tabella Supabase · Chi: Autori e verificatori · Quando: Ogni anno e a ogni modifica del test

| Campo | Tipo | Esempio / regola |
|---|---|---|
| id | identificativo | q-0042 |
| area | scelta | economia · medicina |
| materia | scelta | logica · matematica · fisica · chimica · biologia |
| testo | testo | Un prodotto costa 80 €… |
| opzioni | 4 testi | A, B, C, D |
| corretta | scelta | A |
| spiegazione | testo | Passaggi del calcolo |
| difficolta | 1–3 | 2 |
| autore | testo | Chi l'ha scritta |
| verificata_da | 2 nomi | Obbligatori: senza due verifiche non entra in banca |
| origine | scelta | originale (l'unico valore ammesso) |

## Dati · Test per area
Dove: Configurazione delle aree (come nella web app) · Chi: Founder responsabile dei contenuti · Quando: Ogni 30 giorni nel periodo di iscrizione

| Campo | Tipo | Esempio / regola |
|---|---|---|
| area | riferimento | economia |
| nome_test | testo | TOLC-E |
| nota | testo | Verifica sul bando del tuo ateneo se e come è richiesto. |
| fonte_url | URL | Pagina ufficiale |
| ultimo_controllo | data | Se più vecchio di 60 giorni la nota si nasconde |

## Dati · Risultati (facoltativi)
Dove: Supabase, solo con consenso · Chi: Nessuno: servono solo per le statistiche aggregate · Quando: Mai a mano

| Campo | Tipo | Esempio / regola |
|---|---|---|
| data | data | automatico |
| area | scelta | economia |
| punteggio_per_materia | numeri | logica 8/10, matematica 6/10 |
| consenso | sì/no | Senza consenso non si salva nulla |

## Regole
- Tutte le domande sono originali: nessun quesito ufficiale, nemmeno parafrasato.
- Ogni domanda è verificata da due persone prima di entrare in banca.
- Il diagnostico estrae 20 domande bilanciate per materia e difficoltà.
- Senza consenso il risultato non si salva: senza account non resta nulla.
- Le informazioni sul test (date, regole) mostrano sempre la fonte e la data dell'ultimo controllo.
- Nessuna promessa su punteggi o ammissione.

## Stati
| Stato | Cosa vede | Testo |
|---|---|---|
| Prima domanda | Barra di avanzamento | Domanda 1 di 20 |
| In corso | Una domanda per schermo, si può tornare indietro | Domanda 12 di 20 |
| Risultato | Punteggi per materia e consiglio | Hai risposto bene a 14 domande su 20. |
| Test non noto | Messaggio con rimando alla fonte | Per questo corso non abbiamo informazioni verificate: controlla il bando. |
| Informazioni vecchie | La nota sul test si nasconde | Stiamo ricontrollando le informazioni su questo test. |
| Interrotto | Riprende dal punto in cui eri (solo in questa visita) | Vuoi riprendere da dove eri? |

## Testi
| Elemento | Testo |
|---|---|
| Titolo | Capisci dove sei, prima del test |
| Frase | 20 domande per vedere da dove partire. Gratis, senza account, due minuti. |
| Pulsante principale | Fai il diagnostico |
| Avviso domande | Domande originali scritte per allenarti: non sono quelle del test ufficiale. |
| Avviso risultato | Il risultato non viene salvato se non lo chiedi. |
| Rimando alla fonte | Controlla sempre il bando ufficiale del tuo ateneo. |

## Misure
| Evento | Quando | Perché |
|---|---|---|
| diagnostico_iniziato | Prima risposta | Quante persone provano |
| diagnostico_completato | Ultima domanda | Quante arrivano in fondo |
| diagnostico_punteggio | Punteggio per materia | Dove sono i punti deboli |
| clic_verso_area | Clic verso l'area personale | Il passaggio al prodotto |
| clic_fonte_ufficiale | Clic al sito del test | Interesse reale per il test |

## Integrazioni
| Strumento | Cosa fa | Come |
|---|---|---|
| Banca domande | Fonte delle domande | Foglio CSV o tabella: il diagnostico ne estrae 20 |
| Logica del quiz (tools.js) | Corregge e calcola | Componente di codice in Framer |
| Area personale (percorso Test Prep) | Allenamento e registro errori | Link con l'area di studio nei parametri |
| Fonti ufficiali (CISIA, MUR, ateneo) | Informazioni sul test | Solo link e breve riepilogo, con data di controllo |

## Da verificare (legale/privacy)
- Diritto d'autore: non riprodurre né parafrasare quesiti dei test ufficiali; chiedere un parere se si usano materiali pubblici.
- Marchi (CISIA, TOLC): citarli solo per indicare il test, senza far credere a un'affiliazione; UniLink è indipendente.
- Nessuna promessa di ammissione o di punteggio.
- Se si salva il risultato: informativa e consenso. Molti utenti possono essere minorenni: verificare con un consulente come raccogliere il consenso.

## Manutenzione
| Cosa | Chi | Ogni quanto | Come |
|---|---|---|---|
| Banca domande | Autori e verificatori | Ogni anno e dopo ogni modifica del test | Aggiungere, correggere o ritirare domande |
| Informazioni sul test (date, regole) | Founder responsabile dei contenuti | Ogni 30 giorni nel periodo di iscrizione | Ricontrollare la fonte e aggiornare «ultimo controllo» |
| Qualità delle domande | Team | Ogni mese | Guardare le domande con troppi errori o troppo facili |
| Segnalazioni | Team | Entro 3 giorni | Correggere o ritirare |

## Piano di lavoro (15–20 giorni, di cui 6–8 per scrivere e verificare le domande)
| N. | Passo | Dove | Giorni |
|---|---|---|---|
| 1 | Scegliere aree e materie del diagnostico (Economia: logica e matematica) | Decisione | 1 |
| 2 | Scrivere 80 domande originali con spiegazione | Banca domande | 6–8 |
| 3 | Verifica incrociata a due | Banca domande | 2 |
| 4 | Logica del diagnostico (20 domande, correzione, risultato) | tools.js | 2 |
| 5 | Pagina «Test d'ingresso» | test-ingresso.html | 3 |
| 6 | Risultato e passaggio verso l'area personale | Landing + web app | 1,5 |
| 7 | Informazioni sul test con fonte e data di controllo | Configurazione aree | 1 |
| 8 | Eventi di misura | Analytics | 0,5 |
| 9 | Prova con 5 studenti dell'ultimo anno | Tutta la pagina | 1,5 |

## Rischi
| Rischio | Come lo riduci |
|---|---|
| Diritto d'autore sulle domande | Solo domande originali e verificate; mai copiare. |
| Informazioni sul test sbagliate o vecchie | Fonte e data di controllo visibili; se vecchie, si nascondono. |
| Settore competitivo | Non competere sul volume: diagnostico gratuito e registro errori. |
| Utenti minorenni | Nessun dato salvato senza consenso; verifica con un consulente. |
| Costo di scrittura delle domande | Partire da 80 domande e crescere solo se il diagnostico viene usato. |

## Successo
| Metrica | Soglia | Entro |
|---|---|---|
| Diagnostici completati | Almeno 100 | 8 settimane |
| Passaggi verso Test Prep | Almeno il 20% dei diagnostici | 8 settimane |
| Iscritti all'area o alla lista d'attesa da questa pagina | Almeno 30 | 8 settimane |

Regola di stop: Se dopo 8 settimane i diagnostici completati sono meno di 40, fermarsi: il settore è competitivo e le risorse rendono di più sui nuovi hub (L08).

## Prompt per l'AI

Richiesta di tipo C (promuovi) per la landing UniLink.

Contesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L04 («Test d'ingresso (TOLC)») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).

Cosa fare:
- Crea test-ingresso.html con le 7 sezioni della scheda; la scheda «Test d'ingresso» di prima.html diventa un rimando.
- Aggiungi la logica del diagnostico (20 domande) in tools.js e la banca domande come CSV (solo domande originali, due verificatori).
- Aggiungi le informazioni sul test per area con fonte e «ultimo controllo».
- Nessun salvataggio del risultato senza consenso; nessuna promessa su ammissione o punteggio.

Regole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.
