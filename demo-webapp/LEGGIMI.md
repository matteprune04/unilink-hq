# UniLink · demo della web app (area personale) · v2

Demo HTML statica dell'area personale, costruita sull'architettura `architettura/UniLink_Architettura_WebApp.pdf` (contesto compatto per l'AI: `architettura/CONTESTO_DEMO.md`).
È un **riferimento** per lo sviluppo vero (Next.js + Supabase), non il servizio reale: i dati sono di esempio.

- Online: https://matteprune04.github.io/unilink-hq/demo-webapp/
- In HQ: Laboratorio AI → sezione **DEMO** (anteprima, download, storico delle versioni)

## Cosa c'è
| Codice | Pagina | Stato |
|---|---|---|
| P00 | Accesso (link via email) | sicura |
| P01 | Oggi (prossimo passo, numeri, esami, dispense) | sicura |
| P02 | I miei esami (date, obiettivo, argomenti) | sicura |
| P03 | Dispense (libreria + catalogo 34 esami, scheda) | sicura |
| P04 | Strumenti, **dentro la app** (voto di laurea, media e voto obiettivo, piano per l'appello; di esempio Erasmus, ciclo unico, semestre filtro) | sicura |
| P05 | Profilo | sicura |
| P90 | **Da decidere** (voce arancio): card D01–D14 con architettura demo | da decidere |

Il selettore **Il tuo hub** in cima alla sidebar mostra Economia (attivo) e Giurisprudenza / Medicina (in arrivo).

## Modificare
- **Cosa c'è** (hub, voci, card «Da decidere», account demo): `config.js`. È il file da toccare per i contenuti.
- **Strumenti**: `tools.js` (una voce in `UL_TOOLS` + una funzione). `tools.js/css` sono **identici** nella landing: dopo averli modificati in `demo-landing/`, `python _src/sync_shared.py`.
- **Pagine e mini demo**: `app.js` (VISTE = pagine, BLOCCHI = pezzi delle mini demo).
- **Grafica**: `app.css` (token uguali alla landing; sezioni 1 token · 2 base · 3 guscio · 4 componenti · 5 Da decidere · 6 telefono · 7 tablet). Tre formati: desktop ≥ 1101 px, **tablet 701–1100 px** (sidebar stretta, griglie a due colonne), telefono ≤ 700 px (barra in basso).
- **Dispense**: `dispense.js` (stessa fonte della landing).
- Ogni modifica: aggiornare `UL_VERSIONE` in `config.js`, poi commit con una frase chiara (diventa la nota della versione) e push.

## Versioni e backup
A ogni push che tocca questa cartella la GitHub Action **Backup demo** crea uno ZIP, una Release (`webapp-vN`) e una riga in `demos/registro.json`. Per tornare indietro: scarica lo ZIP dall'HQ, oppure ripristina la cartella dal tag `webapp-vN`.

## Come chiedere modifiche (cap. 14 del PDF)
A nuova idea → card Dxx · B modifica una card · C promuovi una card a sicura · D modifica una pagina Pxx · E grafica WA/… · F hub · G ripristina · H rimuovi.

## Cosa è simulato
Accesso (nessuna email inviata), dati dello studente, date d'esame, lista d'attesa (salvata solo nel browser). Le schede dispensa non aprono un lettore (card D06) e gli strumenti con regole «Esempio» vanno verificati prima del lancio. Nessun link al sito attuale: «Landing (demo)» in testata porta alla demo della landing.
