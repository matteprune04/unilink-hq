# L09 · Voci degli studenti

Gruppo: Fiducia · Stato: Da decidere · Impatto 3/5 · Sforzo 1/5

## Problema
La v1 mostrava testimonianze di esempio: pubblicate come vere sarebbero recensioni false (vietate dalla normativa europea sulle pratiche commerciali).

## Proposta
Tolta dalla home. La sezione si accende solo con almeno tre feedback reali raccolti con il form sulle dispense, con consenso scritto.

## Consiglio (parere di Claude)
Meglio un numero vero («876 persone nell'ultimo mese») che tre frasi inventate: la home usa già i numeri di Google.

## Panoramica
- **Obiettivo:** Mostrare feedback veri degli studenti, solo con consenso, per dare fiducia senza inventare niente.
- **Per chi:** Chi arriva per la prima volta e vuole sapere se UniLink funziona davvero.
- **Quando serve:** Quando ci sono almeno tre feedback veri e pubblicabili. Prima la sezione resta spenta.
- **Stima:** 3–4 giorni di lavoro (form e sezione), poi la raccolta richiede settimane

### MVP
- Form «Com'è andato l'esame?» dopo l'uso di una dispensa
- Registro dei feedback con consenso alla citazione
- Sezione «Cosa dicono gli studenti» che si accende da sola con almeno 3 voci
- Revisione mensile

### Dopo
- Valutazione di utilità per dispensa (stelle) visibile nell'area
- Risposte del team alle critiche
- Numeri aggregati (es. «8 su 10 la consigliano»)

### Non lo facciamo
- Testimonianze scritte da noi
- Voti o stelle senza persone vere dietro
- Ricompense che influenzano il giudizio senza dichiararlo

## Pagine

### Home · Cosa dicono gli studenti
`index.html (dopo «Chi c'è dietro»)` — La sezione compare solo se ci sono almeno tre voci pubblicabili. Qui è disegnata con testi di esempio, che in produzione non esistono.

1. **Le voci** (V1)
   - Contenuto: Cosa dicono gli studenti · Esempio, NON vero: in produzione compaiono solo feedback reali con consenso. || ★ — «Testo di esempio: cosa ha aiutato davvero, in una o due frasi.» — Nome C. · II anno · EA —  — nt · ★ — «Testo di esempio: anche una critica gentile può comparire.» — Nome C. · I anno · EC —  — ar · ★ — «Testo di esempio: la sezione si accende da sola.» — Nome C. · III anno · EA —  — nt
   - Perché: Il giudizio degli altri studenti pesa più di qualsiasi nostra frase. Ma deve essere vero.
   - Si può cambiare: Le voci vengono dalla collezione «Voci»: una riga = una voce con consenso.
   - Componenti: LP/Voce
2. **Numeri veri** (V2)
   - Contenuto: 876 — persone nell'ultimo mese · 34 — esami con la dispensa · — — feedback raccolti (solo se veri)
   - Perché: Se i feedback sono pochi, i numeri veri di Google tengono la fiducia.
   - Si può cambiare: I numeri vengono da UL_CFG.numeri e dalla tabella dei feedback.
   - Componenti: LP/Numeri
3. **Raccolta del feedback** (V3)
   - Contenuto: Com'è andato l'esame? · Esame: Es. Microeconomia · Quanto ti è servita la dispensa? (1–5): 4 · Cosa ti è servito di più?: … · Come vuoi comparire (se ti citiamo): Es. Giulia R. · II anno EA · Acconsento a essere citato con il nome indicato. · Invia il feedback
   - Perché: Il consenso è una scelta esplicita e separata: senza il «Puoi citarmi» il testo non esce mai.
   - Si può cambiare: Domande e scelte del form; il consenso resta obbligatorio per la citazione.
   - Componenti: LP/Form
4. **Regola della sezione** (V4)
   - Contenuto: Se le voci pubblicabili sono meno di 3, la sezione non si vede. Se ci sono critiche ricorrenti, il team le legge e risponde nel gruppo.
   - Perché: Evita la sezione «vuota» e la tentazione di riempirla con testi finti.
   - Si può cambiare: Soglia (3) nella configurazione.
   - Componenti: Regola

## Dati · Tabella «Feedback»
Dove: Supabase, scritta dal form · Chi: Team (revisione) · Quando: Ogni mese

| Campo | Tipo | Esempio / regola |
|---|---|---|
| id | identificativo | automatico |
| esame | testo | microeconomia |
| voto_utilita | 1–5 | 4 |
| testo | testo | Quello che ha scritto lo studente, senza modifiche |
| nome_pubblico | testo | Giulia R. · II anno EA |
| consenso_citazione | data | Senza data il testo non si pubblica |
| pubblicabile | sì/no | Deciso dal team dopo la lettura |
| verificato_da | testo | Chi ha controllato che sia una persona vera |
| creato_il | data | automatico |

## Dati · Collezione «Voci»
Dove: Framer CMS · Chi: Team · Quando: Quando un feedback diventa pubblicabile

| Campo | Tipo | Esempio / regola |
|---|---|---|
| feedback_id | testo | Riferimento alla tabella |
| testo_mostrato | testo | Uguale al feedback; accorciare solo con il consenso dell'autore |
| nome_pubblico | testo | Come richiesto dallo studente |
| ordine | numero | Più recenti prima |

## Regole
- Mai testi inventati o modificati nel senso: si accorcia solo con il consenso dell'autore.
- Si pubblica solo con consenso scritto alla citazione (con la data).
- Nessuna ricompensa che influenzi il giudizio; se c'è un incentivo, lo si dichiara.
- La sezione si accende da sola con almeno 3 voci pubblicabili e si spegne se scendono sotto.
- Non si selezionano solo i feedback positivi: le critiche ricorrenti si leggono e si risolvono.
- Le persone citate possono chiedere di essere tolte in qualsiasi momento.

## Stati
| Stato | Cosa vede | Testo |
|---|---|---|
| Meno di 3 voci | Sezione non visibile | — |
| 3 o più voci | Sezione visibile con le voci più recenti | Cosa dicono gli studenti |
| Form inviato | Conferma | Grazie! Il tuo feedback ci aiuta. |
| Senza consenso alla citazione | Si salva come statistica anonima | Va bene: non ti citeremo. |

## Testi
| Elemento | Testo |
|---|---|
| Titolo | Cosa dicono gli studenti |
| Frase del form | Com'è andato l'esame? |
| Consenso | Acconsento a essere citato con il nome indicato. |
| Ringraziamento | Grazie! Il tuo feedback ci aiuta. |
| Fiducia | Pubblichiamo solo feedback veri, con il consenso di chi li ha scritti. |

## Misure
| Evento | Quando | Perché |
|---|---|---|
| feedback_inviato | Invio del form | Quanti rispondono |
| feedback_con_consenso | «Puoi citarmi» | Quante voci pubblicabili |
| sezione_voci_vista | La sezione entra nello schermo | Se viene letta |
| feedback_negativo | Voto 1–2 | Dove migliorare |

## Integrazioni
| Strumento | Cosa fa | Come |
|---|---|---|
| Form → Supabase | Salva i feedback | Form Framer o dalla scheda dispensa con webhook |
| Framer CMS «Voci» | Mostra le voci approvate | Collezione collegata alla sezione |
| Email (facoltativa) | Invito al feedback dopo l'appello | Messaggio opt-in nell'area personale |

## Da verificare (legale/privacy)
- Recensioni e testimonianze finte o manipolate sono vietate dalla normativa europea sulle pratiche commerciali: pubblicare solo feedback veri e senza modifiche di senso.
- Se si offre un incentivo per lasciare un feedback va dichiarato: verificare con un consulente.
- Consenso alla citazione: scritto, con data, revocabile.
- Informativa sul trattamento dei dati del form.

## Manutenzione
| Cosa | Chi | Ogni quanto | Come |
|---|---|---|---|
| Lettura dei feedback | Founder responsabile | Ogni mese | Leggere tutto, anche le critiche; marcare «pubblicabile» |
| Voci mostrate | Team | Ogni mese | Aggiungere le nuove e togliere chi lo chiede |
| Risposte alle critiche | Team | Entro 1 settimana | Rispondere nel gruppo o correggere il problema |
| Informativa | Team | Una volta l'anno | Rileggere |

## Piano di lavoro (3–4 giorni di lavoro (form e sezione), poi la raccolta richiede settimane)
| N. | Passo | Dove | Giorni |
|---|---|---|---|
| 1 | Scrivere il form e il consenso alla citazione | Form | 1 |
| 2 | Tabella «Feedback» e collezione «Voci» | Supabase + Framer | 1 |
| 3 | Sezione «Cosa dicono gli studenti» con la regola delle 3 voci | index.html | 1 |
| 4 | Invito al feedback dopo l'appello (opt-in) | Area personale + email | 1 |
| 5 | Raccogliere i primi feedback veri | Lavoro umano | settimane |

## Rischi
| Rischio | Come lo riduci |
|---|---|
| Pochi feedback | Tenere spenta la sezione; usare i numeri veri di Google. |
| Pubblicare solo il positivo | Regola: si leggono e si affrontano anche le critiche. |
| Citazioni senza consenso | Nessuna pubblicazione senza data di consenso. |
| Percezione di recensioni false | Dichiarare come si raccolgono i feedback. |

## Successo
| Metrica | Soglia | Entro |
|---|---|---|
| Feedback ricevuti | Almeno 15 | 8 settimane |
| Feedback pubblicabili | Almeno 3 | 8 settimane |
| Voto medio di utilità | Almeno 4 su 5 | 8 settimane |

Regola di stop: Se dopo 8 settimane i feedback pubblicabili sono meno di 3, la sezione resta spenta: puntare sui numeri veri e sul gruppo WhatsApp.

## Prompt per l'AI

Richiesta di tipo C (promuovi) per la landing UniLink.

Contesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L09 («Voci degli studenti») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).

Cosa fare:
- Aggiungi il form di feedback con consenso separato alla citazione e la tabella «Feedback».
- Crea la collezione «Voci» e la sezione in index.html che si accende da sola con almeno 3 voci pubblicabili.
- Nessun testo di esempio in produzione; nessuna modifica di senso ai testi.
- Aggiungi gli eventi di misura.

Regole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.
