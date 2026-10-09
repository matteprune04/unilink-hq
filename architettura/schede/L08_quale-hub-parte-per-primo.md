# L08 · Quale hub parte per primo

Gruppo: Hub · Stato: Da decidere · Impatto 5/5 · Sforzo 4/5 · Web app: D01

## Problema
Giurisprudenza e Medicina sono «in arrivo»: raccogliamo la lista d'attesa ma non ci sono materiali né studenti nel team.

## Proposta
Dopo 3–4 settimane di lista d'attesa si guarda quale hub ha più iscritti e almeno uno o due studenti disposti a costruirlo; quello passa ad «attivo» cambiando una riga della config.

## Consiglio (parere di Claude)
Decidi sui numeri veri della lista d'attesa, non sull'intuito. Per Medicina l'obiettivo realistico è il 2027/28 (il semestre filtro 2026/27 è troppo vicino).

## Panoramica
- **Obiettivo:** Decidere con dati veri quale hub accendere per primo (Giurisprudenza o Medicina) e avere la checklist per accenderlo senza promettere ciò che non c'è.
- **Per chi:** I founder (decisione) e gli studenti dell'hub scelto (che trovano un hub vero, non una promessa).
- **Quando serve:** Dopo 3–4 settimane di lista d'attesa con i numeri veri. Per Medicina l'obiettivo realistico è il 2027/28.
- **Stima:** 5–6 giorni di lavoro per accendere un hub, dopo che i materiali esistono

### MVP
- Scheda di valutazione degli hub con criteri e soglie (documento interno)
- Pagina dell'hub scelto con stato «attivo» (stesso schema di Economia)
- Checklist di lancio dell'hub (12 punti)
- Email di annuncio alla lista d'attesa

### Dopo
- Secondo hub
- Più atenei sotto lo stesso hub
- Cruscotto con i numeri della lista d'attesa aggiornati in automatico

### Non lo facciamo
- Accendere un hub senza materiali né persone
- Pubblicare dispense non verificate
- Promettere date di apertura

## Pagine

### Hub Giurisprudenza, quando è attivo
`hub-giurisprudenza.html` — È la pagina esistente con stato «attivo» (una riga in UL_CFG.hub) e con contenuti veri. I numeri sono segnaposto.

1. **Hero** (H1)
   - Contenuto: Hub attivo · UniFi · Giurisprudenza · Schemi, casi e domande per i primi esami del ciclo unico, scritti da chi li ha dati. · Sfoglia le dispense / Gruppo WhatsApp
   - Perché: Stesso schema di Economia: chi conosce un hub conosce gli altri.
   - Si può cambiare: Testi e foto; lo stato «attivo» cambia badge e pulsanti da solo.
   - Componenti: LP/Hero
2. **Prima · Durante · Dopo** (H2)
   - Contenuto: 1 — Prima — Come funziona un ciclo unico e come si studia un codice. — Prima di iscriverti — ar · 2 — Durante — Gli esami istituzionali, con schemi e domande. — Gli esami — nv · 3 — Dopo — Tesi, pratica e concorsi: cosa sapere prima di scegliere. — Professioni legali — ar
   - Perché: Le tre fasi sono la struttura comune di tutti gli hub.
   - Si può cambiare: Testi dei tre blocchi dalla configurazione dell'hub.
   - Componenti: LP/Fase
3. **Dispense** (H3)
   - Contenuto: I primi esami (esempio) · Istituzioni di diritto privato — I anno · schemi e domande — Disponibile — on · Diritto costituzionale — I anno · schemi — In preparazione · Storia del diritto — I anno — Cerchiamo autori
   - Perché: Onestà: si vede cosa c'è e cosa no. Meglio tre dispense vere che trenta promesse.
   - Si può cambiare: Una riga per esame, con stato.
   - Componenti: Lista
4. **Strumenti** (H4)
   - Contenuto: [voto-lmg]
   - Perché: Uno strumento funzionante, ma solo con regole verificate (qui sono di esempio).
   - Si può cambiare: Si sostituisce con regole verificate o si toglie.
   - Componenti: LP/Strumento
5. **Com'è oggi nell'app** (H5)
   - Contenuto: [altro-in-arrivo]
   - Perché: Documenta il «prima» reale: al lancio questa schermata cambia con i contenuti veri.
   - Si può cambiare: Lo screenshot si rifà.
   - Componenti: Schermata reale (img/app)
6. **Community** (H6)
   - Contenuto: Il gruppo del tuo anno · Entra nel gruppo / Diventa ambassador · Novità, dispense nuove e domande nel gruppo WhatsApp di Giurisprudenza.
   - Perché: Senza community l'hub è solo un archivio.
   - Si può cambiare: Link e testo.
   - Componenti: LP/Finale

### Scheda di valutazione (documento interno, non pubblico)
`foglio interno · non pubblicato` — Serve a decidere. Si compila con i numeri veri della lista d'attesa e le risposte del team.

1. **Numeri** (V1)
   - Contenuto: — — iscritti Giurisprudenza · — — iscritti Medicina · — — persone disponibili a costruire
   - Perché: Senza numeri veri la scelta è un'opinione.
   - Si può cambiare: Si leggono dalla tabella «Lista d'attesa».
   - Componenti: Foglio
2. **Criteri** (V2)
   - Contenuto: 
   - Perché: Rende esplicito perché si sceglie uno e non l'altro.
   - Si può cambiare: Pesi e criteri si cambiano nel foglio.
   - Componenti: Tabella
3. **Checklist di lancio** (V3)
   - Contenuto: Si accende solo se tutto è spuntato · Piano ufficiale verificato sul Course Catalogue UniFi —  — 1 · Almeno 3 esami pronti con due revisori —  — 2 · Almeno 2 studenti nel team o ambassador —  — 3 · Dispense collegate all'hub nel catalogo —  — 4 · Strumenti dell'hub verificati (niente «Esempio») —  — 5 · Gruppo WhatsApp e ambassador —  — 6 · Pagina hub e FAQ aggiornate —  — 7 · Eventi di misura attivi —  — 8 · Prova a tre formati con screenshot —  — 9 · Email di annuncio alla lista d'attesa pronta —  — 10 · Messaggio nei gruppi esistenti —  — 11 · Stato dell'hub cambiato in «attivo» —  — 12
   - Perché: È il confine tra «in arrivo» e «attivo»: evita di promettere ciò che non c'è.
   - Si può cambiare: Voci e ordine si cambiano nel foglio.
   - Componenti: Lista

## Dati · Tabella «Lista d'attesa»
Dove: Supabase (la stessa per landing e area personale) · Chi: Nessuno a mano · Quando: A ogni iscrizione

| Campo | Tipo | Esempio / regola |
|---|---|---|
| email | email | Solo per l'annuncio |
| hub | scelta | giurisprudenza · medicina |
| risposta | testo | «A che anno sei?» / «Sei nel semestre filtro?» |
| consenso | sì/no | Obbligatorio |
| origine | scelta | landing · app |
| creato_il | data | automatico |

## Dati · Stato dell'hub
Dove: UL_CFG.hub (config.js) o CMS «Hub» · Chi: Team · Quando: Al lancio

| Campo | Tipo | Esempio / regola |
|---|---|---|
| slug | testo | giurisprudenza |
| stato | scelta | attivo · in_arrivo |
| fasi | 3 testi | Prima · Durante · Dopo |
| materiali_pronti | numero | Quanti esami hanno la dispensa (solo informativo) |

## Regole
- Un hub passa ad «attivo» solo quando tutta la checklist di 12 punti è spuntata.
- La scelta si fa sui numeri veri della lista d'attesa e sulle persone disponibili, non sull'intuito.
- Soglia di partenza (ipotesi): almeno 100 iscritti in lista e almeno 2 persone disposte a costruire l'hub.
- Per Medicina l'obiettivo realistico è il 2027/28: il semestre filtro 2026/27 è troppo vicino.
- Mai pubblicare una data di apertura se non è certa.
- L'annuncio alla lista parte solo a hub pronto.

## Stati
| Stato | Cosa vede | Testo |
|---|---|---|
| In arrivo | Lista d'attesa e «cosa vorremmo fare» | Stiamo costruendo questo hub con chi lo studia. |
| In costruzione (interno) | Nessuna differenza pubblica | — |
| Attivo | Dispense, strumenti, community | Hub attivo · UniFi |
| Attivo con pochi esami | Elenco con «In preparazione» | Ci stiamo lavorando: ecco cosa c'è già. |

## Testi
| Elemento | Testo |
|---|---|
| Annuncio alla lista | L'hub di Giurisprudenza è partito: ecco i primi esami e il gruppo del tuo anno. |
| Badge | Hub attivo · UniFi |
| Stato dispensa | In preparazione |
| Messaggio nei gruppi | Novità: oggi apre l'hub di Giurisprudenza. Chi vuole dare una mano scriva qui. |

## Misure
| Evento | Quando | Perché |
|---|---|---|
| iscrizione_lista_hub | Iscrizione alla lista d'attesa | Il numero che decide la scelta |
| clic_avvisami | Clic su «Avvisami» | Interesse prima di iscriversi |
| visita_hub_attivo | Visita alla pagina dell'hub attivo | Se l'annuncio funziona |
| clic_dispensa_hub | Clic su una dispensa dell'hub | Quali esami servono davvero |

## Integrazioni
| Strumento | Cosa fa | Come |
|---|---|---|
| Supabase | Tabella «Lista d'attesa» | Form Framer e area personale scrivono nella stessa tabella |
| Email | Annuncio di lancio | Invio a chi ha dato il consenso |
| Framer CMS / config | Stato dell'hub | Un campo che cambia badge e pulsanti |
| Foglio di valutazione | Criteri e punteggi | Foglio condiviso del team |

## Da verificare (legale/privacy)
- Le email della lista si usano solo per annunciare l'hub per cui l'utente si è iscritto.
- Consenso separato per altre comunicazioni.
- Piano ufficiale e regole del corso: citare la fonte e la data (Course Catalogue UniFi).
- Nessuna promessa di date o contenuti prima che esistano.

## Manutenzione
| Cosa | Chi | Ogni quanto | Come |
|---|---|---|---|
| Lista d'attesa | Founder responsabile | Ogni settimana nel periodo di raccolta | Leggere i numeri e annotarli nel foglio |
| Scheda di valutazione | Team | Dopo 3–4 settimane e prima della decisione | Compilare i criteri e decidere in call |
| Materiali dell'hub | Autori + revisori | Continuamente dopo il lancio | Aggiungere esami e aggiornare lo stato delle righe |

## Piano di lavoro (5–6 giorni di lavoro per accendere un hub, dopo che i materiali esistono)
| N. | Passo | Dove | Giorni |
|---|---|---|---|
| 1 | Raccogliere 3–4 settimane di lista d'attesa (landing + app) | Tabella «Lista d'attesa» | tempo di raccolta |
| 2 | Compilare la scheda di valutazione e decidere in call | Foglio | 1 |
| 3 | Raccogliere materiali e persone dell'hub scelto | Lavoro umano | dipende |
| 4 | Pagina dell'hub con contenuti veri e stato «attivo» | hub-*.html + config | 2 |
| 5 | Strumenti verificati dell'hub | tools.js | 1 |
| 6 | Prova a tre formati e correzioni | Tutta la pagina | 1 |
| 7 | Email di annuncio e messaggio nei gruppi | Email + WhatsApp | 1 |

## Rischi
| Rischio | Come lo riduci |
|---|---|
| Scegliere senza dati | Soglie e scheda di valutazione obbligatorie. |
| Accendere un hub vuoto | Checklist di 12 punti: se manca un punto, resta «in arrivo». |
| Promettere date | Nessuna data pubblica finché non è certa. |
| Lista d'attesa troppo piccola | Se sotto soglia dopo 4 settimane: rafforzare la raccolta prima di decidere. |

## Successo
| Metrica | Soglia | Entro |
|---|---|---|
| Iscritti alla lista dell'hub scelto | Almeno 100 | 4 settimane di raccolta |
| Visite all'hub nelle 2 settimane dopo il lancio | Almeno il 40% degli iscritti | 2 settimane |
| Esami pronti al lancio | Almeno 3 | Al lancio |

Regola di stop: Se dopo 4 settimane nessun hub supera la soglia, rimandare la decisione di un mese e investire nella raccolta (gruppi, ambassador) prima di costruire materiali.

## Prompt per l'AI

Richiesta di tipo C (promuovi) per la landing UniLink.

Contesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L08 («Quale hub parte per primo») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).

Cosa fare:
- Prepara la scheda di valutazione (foglio) con i criteri e le soglie.
- Quando l'hub è scelto e la checklist è completa, cambia lo stato in UL_CFG.hub e aggiorna la pagina dell'hub come nella scheda.
- Aggiungi gli eventi di misura e prepara l'email di annuncio.
- Non accendere l'hub se anche un solo punto della checklist manca.

Regole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.
