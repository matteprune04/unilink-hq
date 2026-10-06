# L07 · Listino e pacchetti

Gruppo: Monetizzazione · Stato: Da decidere · Impatto 3/5 · Sforzo 3/5 · Web app: D05

## Problema
Il listino non è deciso: appunti singoli, dispensa completa, bundle semestre/anno, Plus mensile sono ipotesi.

## Proposta
Una pagina Prezzi pronta ma fuori dalla navigazione, che legge il listino da UL_CFG.prezzi: quando il listino è deciso si cambiano i numeri qui e la pagina si ridisegna.

## Consiglio (parere di Claude)
Tienila fuori dalla navbar: mostrare prezzi non decisi confonde. Se pensate a prezzi di lancio o sconti, indicate fino a quando valgono e fate verificare da un consulente le regole sugli annunci di riduzione di prezzo (Codice del Consumo) prima di pubblicarli.

## Panoramica
- **Obiettivo:** Avere una pagina Prezzi pronta, che legge il listino da un punto solo, e un acquisto che sblocca i contenuti nell'area personale.
- **Per chi:** Studenti che hanno provato il gratuito e vogliono la dispensa completa di un esame o di un semestre.
- **Quando serve:** Dopo che il listino è deciso (sondaggio) e il soggetto legale è pronto a incassare. Fino ad allora la pagina resta fuori dalla barra.
- **Stima:** 15–20 giorni di lavoro, più i tempi legali e amministrativi esterni

### MVP
- Pagina Prezzi dal listino (collezione «Piani»), con confronto tra i piani
- Acquisto di un esame (appunti o dispensa) con Stripe Checkout
- Sblocco automatico nell'area personale dopo il pagamento
- Termini di vendita, informativa e ricevuta per email

### Dopo
- Pacchetto semestre e anno
- Piano Plus (ripasso errori, simulazioni, piano guidato), anche in abbonamento
- Upgrade che riconosce quanto già pagato
- Codici sconto

### Non lo facciamo
- Prezzi mostrati senza un listino deciso
- Rinnovi automatici nascosti
- Conservare dati della carta (li gestisce Stripe)

## Pagine

### Prezzi
`prezzi.html` — Pagina esistente (S12), oggi con prezzi di esempio da config. Quando il listino è deciso entra in barra o nell'area personale.

1. **Hero e scelta** (P1)
   - Contenuto: Paghi solo quello che studi · Per esame o per semestre. Nessun rinnovo automatico. || Per esame · Per semestre
   - Perché: Il titolo dice il principio (paghi ciò che usi) e la scelta cambia i piani sotto.
   - Si può cambiare: Titolo e le due etichette del selettore.
   - Componenti: LP/Toggle
2. **I piani** (P2)
   - Contenuto: 
   - Perché: Tre piani al massimo, uno «il più scelto»: troppi piani paralizzano.
   - Si può cambiare: Si cambiano i numeri nella collezione «Piani» (o in UL_CFG.prezzi): il design non si tocca.
   - Componenti: LP/Piano
3. **Confronto** (P3)
   - Contenuto: 
   - Perché: Fa vedere cosa si ottiene salendo di piano: è dove si decide.
   - Si può cambiare: Una riga per funzione; le colonne vengono dai piani.
   - Componenti: Tabella
4. **Dopo l'acquisto** (P4)
   - Contenuto: [altro-piano]
   - Perché: Mostra dove finisce ciò che si compra: dà fiducia.
   - Si può cambiare: Lo screenshot si rifà dalla web app.
   - Componenti: Schermata reale (img/app)
5. **Cosa resta gratis** (P5)
   - Contenuto: ✓ — Estratti e quiz rapido — Sempre gratuiti, con l'account. —  — ar · ✓ — Strumenti — Voto di laurea, media, piano: senza account. —  — ar · ✓ — Informazioni sugli esami — Modalità d'esame e consigli. —  — ar
   - Perché: Il gratuito è il motivo per cui la gente arriva: dirlo toglie la paura del «pay-wall».
   - Si può cambiare: Tre testi.
   - Componenti: LP/Card
6. **Regole chiare** (P6)
   - Contenuto: ⟳ — Nessun rinnovo automatico — Per gli acquisti singoli: paghi una volta. —  — nt · ✓ — Restano tuoi — Ciò che compri resta nella tua area. —  — nt · ↑ — Upgrade senza perdere — Passare a un piano più alto riconosce ciò che hai pagato (ipotesi). —  — nt — Da decidere · @ — Ricevuta — Ricevi la ricevuta per email. —  — nt
   - Perché: Le quattro cose che frenano un acquisto.
   - Si può cambiare: Testi; il punto sull'upgrade va confermato prima.
   - Componenti: LP/Card
7. **Domande frequenti** (P7)
   - Contenuto: C'è qualcosa di gratis? — Sì: estratti, quiz rapido, strumenti e informazioni sugli esami. · Come pago? — Con carta e portafogli digitali tramite un checkout sicuro. I dati della carta non passano da UniLink. · Posso avere un rimborso? — Da definire con il consulente: le regole per i contenuti digitali hanno condizioni precise.
   - Perché: Risponde sul pagamento e sul rimborso, il punto più delicato.
   - Si può cambiare: CMS «FAQ».
   - Componenti: LP/FAQ

## Dati · Collezione «Piani»
Dove: Framer CMS (e la web app legge la stessa fonte) · Chi: Team (una sola persona può cambiare i prezzi) · Quando: Alla decisione del listino e a ogni modifica

| Campo | Tipo | Esempio / regola |
|---|---|---|
| id | testo | dispensa |
| nome | testo | Dispensa completa |
| tipo | scelta | base · acquisto · abbonamento |
| prezzo | testo | Quello deciso: mai un valore di esempio in produzione |
| prezzo_lancio | testo | Facoltativo |
| lancio_fino_al | data | Obbligatoria se c'è un prezzo di lancio |
| sblocca | elenco di regole | dispensa:esame |
| include | elenco | Appunti, mappe, quiz |
| evidenza | sì/no | Un solo piano «il più scelto» |
| attivo | sì/no | Spegne il piano senza cancellarlo |

## Dati · Acquisti
Dove: Supabase, scritta dal webhook di Stripe · Chi: Nessuno a mano · Quando: A ogni pagamento

| Campo | Tipo | Esempio / regola |
|---|---|---|
| utente | riferimento | L'account dello studente |
| piano | riferimento | dispensa |
| oggetto | testo | L'esame o il semestre acquistato |
| importo | numero | Quanto pagato |
| stripe_id | testo | Identificativo del pagamento |
| stato | scelta | pagato · rimborsato · contestato |
| data | data | automatico |

## Regole
- I prezzi stanno in un solo posto (collezione «Piani»): pagina, area personale e checkout li leggono da lì.
- Un solo piano ha «il più scelto»; al massimo tre piani visibili per volta.
- Ogni piano dice cosa sblocca: senza descrizione non si pubblica.
- Prezzi di lancio: indicare fino a quando valgono; per sconti e annunci di riduzione verificare con un consulente le regole del Codice del Consumo.
- Lo sblocco avviene solo dopo la conferma del pagamento da Stripe (webhook), mai dal browser.
- Gli acquisti singoli non si rinnovano da soli.
- Se un pagamento fallisce non si sblocca niente e si spiega cosa fare.

## Stati
| Stato | Cosa vede | Testo |
|---|---|---|
| Listino non deciso | Pagina fuori dalla barra, piani «Esempio» | Prezzi di esempio, ancora da decidere. |
| Piano attivo | Prezzo e pulsante «Scegli» | Scegli |
| Pagamento riuscito | Pagina di conferma e sblocco | Fatto! La tua dispensa è nella tua area. |
| Pagamento fallito | Messaggio e nuovo tentativo | Il pagamento non è andato a buon fine: non ti è stato addebitato niente. Riprova. |
| Già acquistato | Pulsante «Apri» | Hai già questa dispensa. |
| Prezzo di lancio scaduto | Prezzo normale | Il prezzo di lancio è terminato. |

## Testi
| Elemento | Testo |
|---|---|
| Titolo | Paghi solo quello che studi |
| Frase | Per esame o per semestre. Nessun rinnovo automatico. |
| Pulsante piano | Scegli |
| Garanzia | I dati della carta non passano da UniLink. |
| Gratis | Estratti, quiz rapido, strumenti e informazioni sugli esami restano gratuiti. |
| Conferma | Fatto! La tua dispensa è nella tua area. |

## Misure
| Evento | Quando | Perché |
|---|---|---|
| pagina_prezzi_vista | Si apre la pagina | Interesse |
| cambio_modo_prezzi | Per esame ↔ per semestre | Cosa interessa di più |
| clic_scegli_piano | Clic su «Scegli» (con il piano) | Quale piano attira |
| checkout_iniziato | Si apre il checkout | Dove si perde chi esce |
| acquisto_completato | Pagamento riuscito | Conversione |
| pagamento_fallito | Errore di pagamento | Problemi tecnici o di fiducia |

## Integrazioni
| Strumento | Cosa fa | Come |
|---|---|---|
| Stripe Checkout | Pagamento sicuro | Pagina ospitata da Stripe; si passa il piano e l'account |
| Webhook Stripe → Supabase | Registra l'acquisto e sblocca | Funzione server che verifica la firma e scrive «Acquisti» |
| Framer CMS «Piani» | Prezzi e descrizioni | Collezione letta dalla pagina; la web app legge la stessa fonte |
| Email | Ricevuta e conferma | Ricevuta di Stripe + email di conferma con il link all'area |
| Analytics (GA4) | Misura il percorso | Eventi dalla scheda; solo con consenso ai cookie |

## Da verificare (legale/privacy)
- Serve un soggetto legale che incassa (e un account Stripe intestato): da decidere prima di costruire.
- Termini di vendita, informativa privacy e prezzi con le imposte indicate: da far redigere o rivedere.
- Contenuti digitali: regole sul diritto di recesso e sul consenso all'accesso immediato da verificare con un consulente.
- Sconti e prezzi di lancio: regole su come annunciare le riduzioni di prezzo (Codice del Consumo) da verificare prima di pubblicare promozioni.
- Fatturazione e IVA: da concordare con un commercialista.
- Se un giorno ci sarà un abbonamento: rendere la disdetta semplice quanto l'acquisto e verificare gli obblighi.

## Manutenzione
| Cosa | Chi | Ogni quanto | Come |
|---|---|---|---|
| Listino | Una persona (da nominare) | A ogni decisione | Cambiare i piani nel CMS e controllare pagina e checkout |
| Acquisti e rimborsi | Founder responsabile | Ogni settimana | Controllare Stripe e la tabella «Acquisti» |
| Termini e informativa | Team + consulente | Una volta l'anno | Rileggere e aggiornare la data |
| Prove di pagamento | Team | A ogni modifica | Fare un acquisto di prova in modalità test |

## Piano di lavoro (15–20 giorni di lavoro, più i tempi legali e amministrativi esterni)
| N. | Passo | Dove | Giorni |
|---|---|---|---|
| 1 | Decidere il listino con il sondaggio | Decisione | 2 |
| 2 | Soggetto legale e account Stripe | Esterno | tempi esterni |
| 3 | Termini di vendita e informativa | Consulente | tempi esterni |
| 4 | Collezione «Piani» e pagina Prezzi dal CMS | Framer | 2 |
| 5 | Checkout, webhook e sblocco | Stripe + Supabase | 5 |
| 6 | Pagina «Piano e acquisti» nell'area personale | Web app | 3 |
| 7 | Email di conferma e ricevute | Email | 1 |
| 8 | Prove in modalità test e gestione degli errori | Checkout | 2 |
| 9 | Lancio con 10 studenti | Tutto | 2 |

## Rischi
| Rischio | Come lo riduci |
|---|---|
| Prezzi sbagliati o incoerenti tra pagina e checkout | Un'unica fonte (collezione «Piani»). |
| Sblocco che non arriva | Webhook con verifica e riprova; pagina di assistenza. |
| Problemi legali (recesso, sconti) | Consulente prima di pubblicare. |
| Pochi acquisti | Misurare e non aggiungere piani: rivedere cosa è gratis. |
| Carico di assistenza | Messaggi chiari e un indirizzo unico. |

## Successo
| Metrica | Soglia | Entro |
|---|---|---|
| Studenti attivi che acquistano | Almeno il 3% | 60 giorni |
| Pagamenti falliti | Meno del 10% dei tentativi | Sempre |
| Richieste di rimborso | Meno del 5% | 60 giorni |

Regola di stop: Se dopo 60 giorni, con almeno 300 studenti attivi, acquista meno dell'1%, non aggiungere pacchetti: rivedere cosa resta gratis e cosa sblocca ogni piano.

## Prompt per l'AI

Richiesta di tipo C (promuovi) per la landing UniLink.

Contesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L07 («Listino e pacchetti») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).

Cosa fare:
- Crea la collezione «Piani» come nei dati e fai leggere prezzi e descrizioni alla pagina prezzi.html.
- Aggiungi il confronto tra i piani e le regole della scheda.
- Collega Stripe Checkout e il webhook verso la tabella «Acquisti» con sblocco automatico; modalità test.
- Non pubblicare prezzi di esempio in produzione e non attivare promozioni senza il parere del consulente.

Regole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.
