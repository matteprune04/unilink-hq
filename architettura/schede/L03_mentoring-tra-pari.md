# L03 · Mentoring tra pari

Gruppo: Community · Stato: Da decidere · Impatto 4/5 · Sforzo 5/5

## Problema
Gli studenti più avanti sanno cose che i più giovani cercano, ma oggi lo scambio non è organizzato.

## Proposta
Un mentore (studente dell'ultimo anno o laureato) per ogni esame o per il percorso: una chiamata, domande ricorrenti, consigli. Si parte dagli ambassador che già avete.

## Consiglio (parere di Claude)
Bello per la fiducia, ma è il più costoso da gestire (selezione, qualità, pagamenti, responsabilità). Non al lancio: fai una prova manuale con 5 ambassador e 20 studenti, misura se si ripete, poi decidi se costruirlo.

## Panoramica
- **Obiettivo:** Far parlare chi prepara un esame o una scelta con chi ci è già passato, in modo sicuro e misurabile, prima di costruire strumenti.
- **Per chi:** Matricole e studenti che scelgono Erasmus, tesi o magistrale; mentori: studenti avanzati e laureati.
- **Quando serve:** Dopo i gruppi di studio (L01): prima servono ambassador che funzionano.
- **Stima:** 12–16 giorni, in gran parte lavoro umano (pilota di 4 settimane)

### MVP
- Prova manuale con 5 mentori e 20 studenti, per 4 settimane
- Form di richiesta e abbinamento a mano (WhatsApp o Google Meet)
- Sezione in Community con come funziona, regole e profili (solo con consenso)
- Chiamata di 20 minuti, gratuita
- Feedback di due domande dopo ogni chiamata

### Dopo
- Prenotazione in autonomia con un calendario
- Mentoring per percorso (tesi, Erasmus, magistrali)
- Crediti o compenso per i mentori
- «I miei mentori» nell'area personale

### Non lo facciamo
- Pagamenti al lancio
- Chat dentro UniLink
- Ripetizioni a pagamento a nome di UniLink
- Promesse di risultato

## Pagine

### Community · Parla con chi ci è già passato
`community.html#mentori` — Nuova sezione nella pagina Community (S11), dopo «Studia insieme».

1. **Hero** (T1)
   - Contenuto: Community · Mentoring · Parla con chi ci è già passato · Una chiamata di 20 minuti con uno studente più avanti di te: esame, Erasmus, tesi, magistrale. · Chiedi un mentore / Come funziona
   - Perché: Promette una cosa precisa (20 minuti) e dice a chi serve.
   - Si può cambiare: Titolo, frase, foto.
   - Componenti: LP/Hero
2. **Come funziona** (T2)
   - Contenuto: Raccontaci cosa ti serve — Esame o scelta, e quando sei libero. · Ti abbiniamo — Scegliamo noi il mentore giusto, di solito entro 3 giorni. · Parlate 20 minuti — In videochiamata o in presenza a Novoli. Poi ci dici com'è andata.
   - Perché: Spiega che l'abbinamento è fatto da persone, non da un algoritmo: dà fiducia.
   - Si può cambiare: Tre frasi.
   - Componenti: LP/Passo
3. **Alcuni mentori** (T3)
   - Contenuto: Alcuni mentori (esempio) · G — Giulia · III anno EA — Microeconomia e Statistica — Chiedi a Giulia · M — Marco · laureato EC — Tesi, Erasmus e magistrali — Chiedi a Marco · S — Sara · II anno — Diritto privato — Chiedi a Sara
   - Perché: Le persone convincono più delle promesse: ma si pubblica solo chi acconsente.
   - Si può cambiare: Un profilo = una riga del CMS «Mentori» con il consenso registrato.
   - Componenti: LP/Persona (variante)
4. **Le regole** (T4)
   - Contenuto: ✓ — Gratis nel pilota — Nessun pagamento: è una prova. —  — ar · ⊘ — Niente garanzie — Un mentore dà consigli, non promette voti. —  — ar · ☎ — I tuoi contatti — Li usiamo solo per organizzare la chiamata. —  — nv · ⚑ — Se qualcosa non va — Scrivi al team: interveniamo. —  — ar
   - Perché: Mette per iscritto i limiti: protegge studenti, mentori e UniLink.
   - Si può cambiare: Testi dal CMS «Regole».
   - Componenti: LP/Card
5. **Chiedi un mentore** (T5)
   - Contenuto: Chiedi un mentore · Su cosa vuoi parlare: Es. Statistica, Erasmus… · Quando sei libero: Es. martedì pomeriggio · Email: nome@stud.unifi.it · Cosa vuoi chiedere: … · Ho letto l'informativa: usate i miei dati solo per organizzare la chiamata. · Invia la richiesta
   - Perché: L'unica azione della pagina: breve e con il consenso in vista.
   - Si può cambiare: Campi del form (Framer); il consenso resta obbligatorio.
   - Componenti: LP/Form
6. **Diventa mentore** (T6)
   - Contenuto: Hai già dato l'esame? Aiuta chi arriva dopo · Candidati come mentore / Leggi le regole · Candidati: ti chiediamo poche ore al mese e ti diamo regole chiare.
   - Perché: Senza mentori il servizio non esiste: l'offerta ha lo stesso peso della domanda.
   - Si può cambiare: Testo e pulsanti.
   - Componenti: LP/Finale
7. **Domande frequenti** (T7)
   - Contenuto: È gratis? — Nel pilota sì. Se in futuro cambierà, lo diremo prima. · Chi sono i mentori? — Studenti avanzati e laureati, scelti dal team. Pubblichiamo un profilo solo con il loro consenso. · Posso scegliere il mentore? — Puoi indicare una preferenza; l'abbinamento lo facciamo noi. · Cosa succede ai miei dati? — Servono solo a organizzare la chiamata e vengono cancellati dopo 6 mesi.
   - Perché: Prezzo, chi sono, scelta, dati: le quattro domande che bloccano la richiesta.
   - Si può cambiare: CMS «FAQ».
   - Componenti: LP/FAQ

## Dati · Collezione «Mentori» (pubblica)
Dove: Framer CMS · Chi: Team, con i mentori · Quando: Ogni mese

| Campo | Tipo | Esempio / regola |
|---|---|---|
| nome_pubblico | testo | Giulia |
| corso_anno | testo | III anno EA |
| aiuta_su | elenco | Microeconomia, Statistica |
| disponibilita | testo | Martedì e giovedì |
| foto | immagine | Facoltativa, solo con consenso |
| consenso_pubblicazione | data | Data del consenso scritto; senza data il profilo non si pubblica |
| attivo | sì/no | Si spegne se il mentore non è disponibile |

## Dati · Tabella «Mentori» (privata)
Dove: Supabase, accesso solo al team · Chi: Founder responsabile della community · Quando: Alla selezione

| Campo | Tipo | Esempio / regola |
|---|---|---|
| id | identificativo | automatico |
| email | email | Contatto reale: mai pubblicato |
| telefono | testo | Facoltativo |
| regole_firmate | data | Obbligatoria prima della prima chiamata |
| chiamate_settimana | numero | Massimo 3 nel pilota |
| note | testo | Solo per il team |

## Dati · Tabella «Richieste mentore»
Dove: Supabase, alimentata dal form · Chi: Founder responsabile della community · Quando: Entro 3 giorni lavorativi

| Campo | Tipo | Esempio / regola |
|---|---|---|
| argomento | testo | Statistica |
| disponibilita | testo | Martedì pomeriggio |
| email | email | Solo per organizzare. Cancellata dopo 6 mesi (ipotesi). |
| consenso | sì/no | Obbligatorio |
| stato | scelta | nuova · abbinata · svolta · annullata |
| mentore_id | riferimento | Chi è stato abbinato |
| feedback_voto | 1–5 | Dopo la chiamata |
| feedback_testo | testo | Facoltativo |

## Regole
- Il mentore non pubblica mai il suo contatto: l'abbinamento passa dal team.
- Un mentore ha al massimo 3 chiamate a settimana nel pilota.
- Il team abbina entro 3 giorni lavorativi o scrive il motivo del ritardo.
- Una chiamata dura 20 minuti, su Meet o in presenza in un luogo pubblico.
- Dopo la chiamata partono due domande di feedback (voto 1–5 e «lo consiglieresti?»).
- Un mentore con due feedback negativi viene sospeso e rivisto dal team.
- Niente pagamenti né regali nel pilota.

## Stati
| Stato | Cosa vede | Testo |
|---|---|---|
| Nessun mentore disponibile | Messaggio onesto e lista d'attesa | Per questo argomento non abbiamo ancora un mentore. Ti avvisiamo appena c'è. |
| Richiesta inviata | Conferma con i tempi | Fatto! Ti scriviamo entro 3 giorni lavorativi. |
| Abbinato | Email con il nome del mentore e gli orari | Ti presentiamo Giulia: ecco gli orari possibili. |
| Svolta | Richiesta di feedback | Com'è andata? Bastano due domande. |
| Annullata | Conferma | Chiamata annullata: puoi richiederne un'altra. |

## Testi
| Elemento | Testo |
|---|---|
| Titolo | Parla con chi ci è già passato |
| Frase | Una chiamata di 20 minuti con uno studente più avanti di te. |
| Pulsante principale | Chiedi un mentore |
| Regola chiave | Un mentore dà consigli, non promette voti. |
| Consenso | Ho letto l'informativa: usate i miei dati solo per organizzare la chiamata. |
| Conferma | Fatto! Ti scriviamo entro 3 giorni lavorativi. |
| Feedback | Com'è andata? Dai un voto da 1 a 5. |

## Misure
| Evento | Quando | Perché |
|---|---|---|
| richiesta_mentore | Invio del form | Domanda reale |
| candidatura_mentore | Invio del form dei mentori | Offerta |
| tempo_abbinamento | Giorni tra richiesta e abbinamento | Capacità del team |
| chiamata_svolta | Chiamata effettuata | Quante richieste diventano chiamate |
| feedback_voto | Voto 1–5 | Qualità |

## Integrazioni
| Strumento | Cosa fa | Come |
|---|---|---|
| Form → Supabase | Salva richieste e candidature | Form Framer con webhook; tabelle private con accesso solo al team |
| Google Meet / presenza | Luogo della chiamata | Link creato a mano dal team nel pilota |
| Email | Conferme e feedback | Tre email manuali nel pilota; un servizio di invio solo dopo |
| Calendario (fase 2) | Prenotazione in autonomia | Strumento a scelta, solo se il pilota funziona |

## Da verificare (legale/privacy)
- Consenso scritto del mentore per pubblicare nome, corso e foto.
- Informativa sulle richieste: cosa raccogliamo, perché, per quanto tempo (proposta 6 mesi).
- Regole di comportamento firmate dai mentori; niente registrazioni delle chiamate.
- Se un giorno ci sarà un compenso: aspetti fiscali e contrattuali da verificare con un consulente prima del lancio.
- Non offrire consulenza professionale (psicologica, legale) e dirlo.

## Manutenzione
| Cosa | Chi | Ogni quanto | Come |
|---|---|---|---|
| Abbinamenti e risposte | Founder responsabile della community | Entro 3 giorni | Leggere la tabella e scrivere a entrambi |
| Profili dei mentori | Founder + mentori | Ogni mese | Aggiornare disponibilità e «attivo» |
| Feedback | Team | Ogni 2 settimane | Leggere voti e testi; sospendere o ringraziare |
| Regole e informativa | Team | Una volta l'anno | Rileggere con un consulente |
| Pulizia dei dati | Founder | Ogni 6 mesi | Cancellare le richieste chiuse da più di 6 mesi |

## Piano di lavoro (12–16 giorni, in gran parte lavoro umano (pilota di 4 settimane))
| N. | Passo | Dove | Giorni |
|---|---|---|---|
| 1 | Decidere regole, criteri di selezione e informativa | Documento | 1 |
| 2 | Selezionare 5 mentori tra gli ambassador e raccogliere i consensi | Lavoro umano | 2 |
| 3 | Tabelle private e form (richiesta e candidatura) | Supabase + Framer | 2 |
| 4 | Sezione «Mentori» in Community: hero, passi, profili, regole, form, FAQ | community.html | 3 |
| 5 | Email manuali di conferma, abbinamento e feedback | Email | 1 |
| 6 | Pilota di 4 settimane: 20 richieste | Lavoro umano | 4 settimane (poco tempo attivo) |
| 7 | Leggere i risultati e decidere | Call | 0,5 |

## Rischi
| Rischio | Come lo riduci |
|---|---|
| Qualità dei mentori | Selezione dal team, feedback dopo ogni chiamata, sospensione dopo due negativi. |
| Troppa richiesta e pochi mentori | Limite di richieste in lista; messaggio onesto sui tempi. |
| Comportamenti scorretti | Regole firmate, Meet o luoghi pubblici, segnalazione diretta al team. |
| Costo di gestione | Pilota piccolo e a tempo: niente strumenti nuovi finché non si dimostra la domanda. |
| Aspettative di compenso o di risultato | Dirlo nelle regole; niente promesse. |

## Successo
| Metrica | Soglia | Entro |
|---|---|---|
| Richieste ricevute | Almeno 20 | 4 settimane |
| Chiamate svolte | Almeno 12 (60% delle richieste) | 4 settimane |
| Voto medio di feedback | Almeno 4 su 5 | 4 settimane |
| Chi ne rifarebbe una | Almeno 7 su 10 | 4 settimane |

Regola di stop: Se le chiamate svolte restano sotto 8 su 20 richieste, o il voto medio è sotto 3,5, non costruire la prenotazione: tenere solo ambassador e gruppi.

## Prompt per l'AI

Richiesta di tipo C (promuovi) per la landing UniLink.

Contesto: architettura/CONTESTO_DEMO.md e la scheda completa della card L03 («Mentoring tra pari») in demo-landing/decidere-arch.js (pagine annotate, dati, regole, stati, testi, misure, piano di lavoro).

Cosa fare:
- Aggiungi in community.html la sezione «Mentori» come nella scheda (7 sezioni).
- Crea le tre tabelle (pubblica, privata, richieste) con i campi indicati e il form con consenso.
- Imposta il pilota manuale: nessuna prenotazione automatica, nessun pagamento.
- Prepara i tre testi email (conferma, abbinamento, feedback).

Regole: non toccare altro; nessun dato inventato presentato come vero (esempi etichettati); testi come nella scheda; accessibilità e tre formati (desktop, tablet 701–1100 px, telefono) verificati con screenshot e axe; aggiorna UL_CFG.versione, il menu e il PDF di architettura; togli la card da UL_CFG.decidere con lo storico «deciso il …»; commit con una frase chiara.
