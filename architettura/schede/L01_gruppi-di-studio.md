# L01 · Gruppi di studio

Gruppo: Community · Stato: Da decidere · Impatto 3/5 · Sforzo 3/5 · Web app: D08

## Problema
Trovare compagni con lo stesso esame oggi passa solo da WhatsApp e dal passaparola.

## Proposta
Pagina «Studia insieme» nella Community: per ogni esame un gruppo (link WhatsApp) e, dopo l'accesso, «cerco un gruppo» come scelta esplicita. Niente social generalista.

## Consiglio (parere di Claude)
Sì, ma piccolo: parti con un gruppo WhatsApp per esame, gestito dagli ambassador, e misura quanti entrano. Il matching dentro l'app solo se i gruppi funzionano. Un social network completo costa moderazione e privacy: non ora.

## Panoramica
- **Obiettivo:** Far trovare a chi prepara un esame un gruppo di compagni, senza creare un social network da moderare.
- **Per chi:** Studenti di Economia (I–III anno) che preparano un appello e studiano meglio in compagnia; ambassador che li accolgono.
- **Quando serve:** Prima della sessione d'esame di gennaio: i gruppi servono quando le persone studiano.
- **Stima:** 8–10 giorni di lavoro (pilota con 5 esami)

### MVP
- Sezione «Studia insieme» nella pagina Community, con ricerca dell'esame
- Un gruppo WhatsApp per esame, aperto e gestito da un ambassador
- Pilota con 5 esami del I e II anno
- Regole del gruppo scritte e visibili prima di entrare
- Form per proporre un gruppo o candidarsi come ambassador

### Dopo
- «Cerco un gruppo» nell'area personale, con scelta esplicita (card D08 della web app)
- Gruppi in presenza a Novoli per fascia oraria
- Estensione a tutti i 34 esami e agli altri hub

### Non lo facciamo
- Chat o forum dentro UniLink
- Profili pubblici degli studenti
- Messaggi privati tra studenti
- Moderazione automatica con AI

## Pagine

### Community · Studia insieme
`community.html#studia-insieme` — Nuova sezione nella pagina Community (S11). Si raggiunge anche dal link «Gruppi di studio» nella scheda di ogni esame dell'area personale.

1. **Hero** (G1)
   - Contenuto: Community · Studia insieme · Prepara l'esame con altri · Trova il gruppo del tuo esame, entra con un tocco e studia con chi è nel tuo stesso punto. · Trova il tuo esame / Come funziona
   - Perché: Dice subito cosa si ottiene e porta alla ricerca: chi arriva da un link WhatsApp deve capire in cinque secondi.
   - Si può cambiare: Titolo, frase e foto (CMS «Pagine» o direttamente in Framer). Il pulsante primario deve restare uno solo.
   - Componenti: LP/Hero, LP/Bottone
2. **Trova il tuo esame** (G2)
   - Contenuto: Cerca il tuo esame, es. Microeconomia || Tutti gli anni · I anno · II anno · III anno || Microeconomia — Gruppo attivo · circa 120 persone · controllato il 3 ottobre (esempio) — Entra — on · Statistica — Gruppo attivo · circa 60 persone (esempio) — Entra — on · Economia Aziendale — In creazione · cerchiamo un ambassador — Aiutaci · Diritto Privato — Nessun gruppo ancora — Proponilo
   - Perché: È la funzione vera della pagina: dal nome dell'esame al gruppo in due tocchi.
   - Si può cambiare: L'elenco si legge dal CMS «Gruppi»: aggiungere un gruppo = una riga. Lo stato (attivo, in creazione, nessuno) decide badge e pulsante.
   - Componenti: Ricerca (LP/Cerca), Chips, Riga esame (variante di LP/CardDispensa)
3. **Come funziona** (G3)
   - Contenuto: Scegli l'esame — Cerca il tuo corso e apri il gruppo. · Entra con WhatsApp — Il link ti porta nel gruppo. Leggi le regole prima di entrare. · Studia insieme — Domande, appunti, ripassi. Un ambassador tiene l'ordine.
   - Perché: Toglie l'ansia del «cosa succede se clicco»: tre passi, nessun account.
   - Si può cambiare: Tre frasi di testo (CMS «Pagine»).
   - Componenti: LP/Passo
4. **Le regole del gruppo** (G4)
   - Contenuto: ✓ — Rispetto — Niente insulti né pressioni sul voto. —  — ar · ⊘ — Niente vendita — Non si vendono appunti né dispense: il gruppo serve a studiare. —  — ar · ☎ — Il tuo numero — In WhatsApp il tuo numero è visibile a chi è nel gruppo. —  — nv · ⚑ — Segnala — Se qualcosa non va, scrivi all'ambassador o al team. —  — ar
   - Perché: Il numero visibile è ciò che sorprende di più: dirlo prima evita lamentele e protegge UniLink.
   - Si può cambiare: I quattro testi si cambiano dal CMS «Regole»; la regola sul numero va sempre mantenuta.
   - Componenti: LP/Card
5. **Per gli ambassador** (G5)
   - Contenuto: Gestisci il gruppo del tuo esame · Diventa ambassador / Proponi un gruppo · Se l'hai già dato, puoi aiutare chi lo prepara: apri il gruppo, accogli i nuovi, tieni l'ordine. Ti diamo regole e supporto. || Proponi un gruppo · Esame: Es. Statistica · Il tuo anno: II anno · Email: nome@stud.unifi.it · Usate la mia email solo per rispondermi su questo gruppo. · Invia
   - Perché: Senza ambassador i gruppi non partono: la domanda e l'offerta stanno nella stessa pagina.
   - Si può cambiare: Testi del riquadro e delle tre scelte del form; i campi si aggiungono dal form di Framer.
   - Componenti: LP/Finale (variante), Form lista d'attesa
6. **Domande frequenti** (G6)
   - Contenuto: Devo dare il mio numero a UniLink? — No. Il numero lo vede solo chi è nel gruppo WhatsApp, come in ogni gruppo. · Chi gestisce il gruppo? — Un ambassador: uno studente che ha già dato l'esame. Può rimuovere chi non rispetta le regole. · E se il mio esame non ha un gruppo? — Proponilo: se siete in tre, lo apriamo. · Posso uscire quando voglio? — Sì, come da qualsiasi gruppo WhatsApp.
   - Perché: Risponde alle quattro paure tipiche (privacy, chi comanda, esame senza gruppo, uscire).
   - Si può cambiare: Domande e risposte dal CMS «FAQ» (una per riga).
   - Componenti: LP/FAQ

## Dati · Collezione «Gruppi»
Dove: Framer CMS · Chi: Ambassador, con controllo del founder responsabile · Quando: All'apertura, ogni mese e a fine sessione

| Campo | Tipo | Esempio / regola |
|---|---|---|
| esame | riferimento a Dispense | microeconomia (stesso identificativo del catalogo) |
| hub | testo | economia |
| anno_accademico | testo | 2026/27 |
| stato | scelta | attivo · in_creazione · pieno · chiuso |
| link_invito | URL | https://chat.whatsapp.com/… — mai mostrato se lo stato non è «attivo» |
| ambassador | testo | Solo il nome di battesimo |
| membri_stimati | numero | Aggiornato a mano: serve solo a dare un ordine di grandezza |
| ultimo_controllo | data | Se più vecchio di 30 giorni il badge diventa «Da verificare» e il link si nasconde |
| note_interne | testo | Non pubblicato |

## Dati · Tabella «Proposte gruppo»
Dove: Supabase, alimentata dal form · Chi: Il founder responsabile della community · Quando: Entro 3 giorni dalla richiesta

| Campo | Tipo | Esempio / regola |
|---|---|---|
| id | identificativo | automatico |
| esame | testo | Statistica |
| anno | scelta | I · II · III |
| ruolo | scelta | vorrei_entrare · voglio_aprirlo · ambassador |
| email | email | Solo per rispondere. Cancellata dopo 6 mesi (ipotesi). |
| consenso | sì/no | Obbligatorio per inviare |
| creato_il | data | automatico |
| stato | scelta | nuova · in_corso · chiusa |

## Regole
- Un solo gruppo ufficiale per esame e anno accademico: due gruppi dello stesso esame dividono le persone e nessuno dei due funziona.
- Il link d'invito si mostra solo se lo stato è «attivo» e l'ultimo controllo ha meno di 30 giorni.
- Ogni gruppo ha almeno un ambassador noto al team; senza ambassador il gruppo passa a «in creazione».
- Un gruppo si chiude (stato «chiuso», link nascosto) a fine sessione d'esame e si riapre il semestre dopo.
- UniLink non entra nei gruppi per leggerli: l'ambassador segnala al team solo ciò che serve.
- Le regole del gruppo (quattro punti) si mostrano sempre prima del link.

## Stati
| Stato | Cosa vede | Testo |
|---|---|---|
| Gruppo attivo | Badge «Attivo» e pulsante «Entra» | Entra nel gruppo |
| In creazione | Badge «In creazione», pulsante «Aiutaci» | Lo stiamo aprendo: vuoi dare una mano? |
| Nessun gruppo | Nessun badge, pulsante «Proponilo» | Nessun gruppo ancora per questo esame. Proponilo: se siete in tre, lo apriamo. |
| Gruppo pieno | Badge «Pieno», link nascosto | Il gruppo è pieno. Scrivici: ne apriamo un altro. |
| Link scaduto o vecchio | Come «In creazione», senza link | Il link non funziona più: ci stiamo lavorando. |
| Errore del form | Messaggio sotto il campo | Scrivi un'email valida. / Serve il consenso per risponderti. |

## Testi
| Elemento | Testo |
|---|---|
| Titolo | Prepara l'esame con altri |
| Frase | Trova il gruppo del tuo esame, entra con un tocco e studia con chi è nel tuo stesso punto. |
| Pulsante principale | Trova il tuo esame |
| Campo di ricerca | Cerca il tuo esame, es. Microeconomia |
| Badge gruppo attivo | Attivo |
| Pulsante del gruppo | Entra nel gruppo |
| Avviso sul numero | In WhatsApp il tuo numero è visibile a chi è nel gruppo. |
| Stato vuoto | Nessun gruppo ancora per questo esame. Proponilo: se siete in tre, lo apriamo. |
| Conferma del form | Fatto! Ti scriviamo entro 3 giorni. |
| Consenso | Usate la mia email solo per rispondermi su questo gruppo. |

## Misure
| Evento | Quando | Perché |
|---|---|---|
| cerca_esame_gruppi | Si scrive nella ricerca | Capire quali esami cercano di più |
| clic_entra_gruppo | Clic su «Entra nel gruppo» (con il nome dell'esame) | Misura l'interesse vero, esame per esame |
| proposta_gruppo | Invio del form | Domanda di gruppi che non esistono ancora |
| candidatura_ambassador | Invio del form con ruolo ambassador | Quanti vogliono aiutare |
| clic_esame_senza_gruppo | Clic su un esame senza gruppo | Dove aprire il prossimo gruppo |

## Integrazioni
| Strumento | Cosa fa | Come |
|---|---|---|
| WhatsApp | Link d'invito a un gruppo per esame | Il link chat.whatsapp.com lo copia l'ambassador nel CMS; nessuna API |
| Framer CMS | Elenco dei gruppi e testi delle regole | Collezione «Gruppi» collegata alla lista, con filtro per anno e ricerca |
| Form → Supabase | Salva proposte e candidature | Form Framer con webhook verso la tabella «Proposte gruppo» (come la lista d'attesa) |
| Analytics (GA4) | Conta gli eventi | Eventi con il nome dell'esame; solo con il consenso ai cookie |

## Da verificare (legale/privacy)
- Il numero di telefono è visibile ai membri del gruppo WhatsApp: scriverlo nelle regole e nella pagina, prima del link.
- Email dei form: informativa, consenso separato, conservazione limitata (proposta: 6 mesi) e cancellazione su richiesta.
- UniLink non raccoglie né legge i dati dei membri: l'ambassador è un volontario. Verificare con un consulente se il ruolo richiede un'informativa specifica.
- Regole contro la vendita di appunti e contro i contenuti protetti da diritto d'autore: scriverle con chiarezza e farle rispettare.

## Manutenzione
| Cosa | Chi | Ogni quanto | Come |
|---|---|---|---|
| Link d'invito dei gruppi | Ambassador | Ogni mese e a inizio semestre | Provare il link da un telefono e aggiornare «ultimo controllo» |
| Nuovi gruppi e candidature | Founder responsabile della community | Entro 3 giorni | Leggere le proposte, rispondere, aggiungere la riga nel CMS |
| Chiusura a fine sessione | Founder responsabile | Dopo ogni sessione | Stato «chiuso» e link nascosto |
| Regole del gruppo | Team | Una volta l'anno o se succede un problema | Aggiornare il testo nel CMS «Regole» |
| Controllo dei risultati | Team | Ogni mese | Guardare gli eventi e decidere se continuare |

## Piano di lavoro (8–10 giorni di lavoro (pilota con 5 esami))
| N. | Passo | Dove | Giorni |
|---|---|---|---|
| 1 | Scrivere le regole del gruppo e la frase sul numero visibile | Documento + CMS «Regole» | 0,5 |
| 2 | Collezione «Gruppi» e dati del pilota (5 esami) | Framer CMS | 1 |
| 3 | Sezione «Studia insieme»: hero, ricerca, elenco, passi, regole | community.html | 3 |
| 4 | Stati dei gruppi e stato vuoto | community.html | 1 |
| 5 | Form «Proponi un gruppo / ambassador» e tabella | Framer + Supabase | 1,5 |
| 6 | Eventi di misura e consenso ai cookie | Analytics | 0,5 |
| 7 | Aprire i 5 gruppi con gli ambassador (lavoro umano) | WhatsApp | 2 |
| 8 | Prova con 3 studenti su telefono e correzioni | Tutta la pagina | 1 |
| 9 | Annuncio nei gruppi esistenti | WhatsApp | 0,5 |

## Rischi
| Rischio | Come lo riduci |
|---|---|
| Gruppi che si svuotano subito | Pilota su 5 esami e regola di chiusura: meglio pochi gruppi vivi che 34 morti. |
| Spam o vendita di appunti | Regole in vista, ambassador che rimuove, segnalazione al team. |
| Link scaduti o gruppi pieni | Controllo mensile e «ultimo controllo» che nasconde il link se vecchio. |
| Un ambassador sparisce | Un secondo riferimento nel team; il gruppo passa a «in creazione». |
| Carico sul team | Un solo founder responsabile e limite di 5 gruppi nel pilota. |

## Successo
| Metrica | Soglia | Entro |
|---|---|---|
| Gruppi pilota con almeno 15 membri | 4 su 5 | 4 settimane dal lancio |
| Clic su «Entra nel gruppo» a settimana | Almeno 30 | 4 settimane |
| Candidature da ambassador | Almeno 3 | 4 settimane |

Regola di stop: Se dopo 4 settimane meno di 2 gruppi su 5 sono attivi (almeno 15 membri) e i clic sono sotto 10 a settimana, non estendere: lasciare solo il gruppo per anno e riconsiderare con il matching dell'area personale (D08).

## Prompt per l'AI

Richiesta di tipo C (promuovi) per la landing UniLink.

Contesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L01 («Gruppi di studio») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).

Cosa fare:
- Aggiungi in community.html la sezione «Studia insieme» come nella scheda (6 sezioni, testi e stati).
- Crea la collezione «Gruppi» e la tabella «Proposte gruppo» come nei dati.
- Aggiungi gli eventi di misura, il consenso ai cookie e il form con consenso.
- Parti dal pilota con 5 esami; non fare il matching nell'area personale (resta D08).

Regole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.
