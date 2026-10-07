# UniLink · demo navigabile della landing v9

Demo HTML statica della landing, costruita sull'architettura `architettura/UniLink_Architettura_Landing.pdf` (contesto compatto per l'AI: `architettura/CONTESTO_DEMO.md`). È un **riferimento per Framer**, non il sito vero.

- Online: https://matteprune04.github.io/unilink-hq/demo-landing/
- In HQ: Laboratorio AI → sezione **DEMO** (anteprima Desktop · Tablet · Telefono, download, storico delle versioni)

## Pagine
| Codice | File | Cosa |
|---|---|---|
| S01 | `index.html` | Home: hero con nastro, numeri reali GA4, **anteprima a numero chiuso** (form), hub, «parti da dove sei», più cercati (aprono l'anteprima), prezzi di lancio, anteprima area personale, come funziona, strumenti, **Ambassador (20%)**, FAQ |
| S02–S03 | `hub-economia.html`, `hub-giurisprudenza.html` | Hub attivo / in arrivo (lista d'attesa simulata, strumenti dell'hub). Medicina: archiviata |
| S05–S07 | `prima.html`, `durante.html`, `dopo.html` | Le tre fasi del percorso (tab Scegliere · Studiare · Dopo la laurea). In Studiare: esempio del Planner (P3) |
| S09 | `tools.html` | Strumenti per hub, funzionanti |
| S10 | `area.html` | Galleria di 19 schermate **reali** della web app in desktop / tablet / telefono (solo immagini, con ingrandimento) |
| S13 | `commenti.html` | Rapporto dei commenti del team, con esportazione e storico delle esportazioni |
| S15 | `materiali.html` | Materiali: listino di lancio deciso il 7/10, calcolatore del pacchetto per **corso + curriculum** (`percorsi.js`), collezione completa |
| S16 | `preview.html?esame=slug` | Anteprima di un esame: copertina, indice (completo e reale per Economia Aziendale, per moduli del programma UniFi), perché, tips sfocati, acquisto |
| S90 | `decidere.html` | Sezione arancio **Da decidere**: card L01–L28 (stati aggiornati al meeting del 7/10) |
| S91 | `archivio/index.html` | **Archivio** (solo founder): le parti tolte il 7/10, con perché, fonte e come rimetterle. Le pagine archiviate sono in `archivio/` (Guida, Community, Tesi, Dopo v7, hub Medicina, Prezzi) e usano `<base href="../">` |

Navbar: **Hub ▾ · Guida · Materiali · Strumenti · Ambassador** + menu **Founder ▾** (Area personale, Da decidere, Archivio, Commenti) + **Accedi** (web app).

## v9 (8/10) · risposte di Matteo e PDF «Architettura della landing reale»
Barra Hub ▾ · Guida · Materiali · Strumenti · Ambassador. Guida e hub Medicina «in arrivo» di nuovo nel sito. Registrazione aperta a tutti (niente anteprima a numero chiuso). Si paga solo nella web app: nella landing i pulsanti dicono «Sblocca» e portano all'area (costante `VENDE_QUI` in app.js). Strumenti in vetrina (`config.js → vetrina`: domanda, tempo, esempio, fonte, metrica sopra soglia; costante `FUNZIONANTI`), si usano nella web app (`#/app/strumenti/<id>`). Nuova pagina `ambassador.html` (profili con foto e nome, solo con liberatoria; candidatura). Footer: «Avvisami quando apre», link legali, dati del venditore da definire.
Quello che nel sito vero non ci sarà resta nella demo, per i founder: **Founder → Archivio** (versioni v8 funzionanti in `archivio/*-v8.html`, Community, Tesi, profili dei founder, listino P2…).

## Decisioni del 7/10 applicate (v8)
Listino di lancio (Simulazione 4,99 · Dispensa completa 12,99 · Pacchetto semestre 29,99 con 3 esami / 34,99 con 4, per percorso · Plus 14,99 o 7,99 con un pacchetto, in valutazione), prezzi mostrati come sconto con il prezzo pieno barrato, niente Appunti singoli / Pacchetto anno / «fuori sessione», Economia Aziendale gratis per tutti, dispense solo da leggere e annotare nell'area personale, ambassador solo a commissione (20%), niente profili dei founder, Guida / Community / Tesi / CV / Medicina archiviati. Tutto quello che è stato tolto è in **Founder → Archivio** (`config.js → archivio`).

## Cosa funziona davvero
Navigazione (menu a tutto schermo da tablet in giù, da tastiera), strumenti (voto di laurea, media e voto obiettivo, piano per l'appello, e di esempio Erasmus, ciclo unico, semestre filtro), ricerca e filtri dispense, galleria delle schermate reali, checklist tesi, FAQ, toggle prezzi, **commenti del team** (pulsante in basso a destra), **schede Da decidere complete** (copia prompt, scarica .md, stampa).

## Cosa è simulato o fittizio
Lista d'attesa e newsletter (solo nel browser), acquisti, prezzi, regole degli strumenti «Esempio», testi degli ambassador. Nessun link al sito attuale: gli strumenti sono dentro la demo e le dispense nell'area personale.

## Modificare
- **Cosa c'è** (hub, fasi, numeri, listino, elenco delle schermate, riassunto delle card): `config.js`. È il file da toccare per i contenuti.
- **Schede «Da decidere»**: `decidere-arch.js` (pagine annotate, dati, regole, piano, prompt…). Dopo una modifica: `node _src/build_schede.js` rigenera immagini, Markdown (`architettura/schede/`) e sorgente del PDF.
- **Schermate reali** (`img/app/`): `node _src/screenshot_webapp.js` poi `python _src/png_to_webp.py <cartella>`.
- **Commenti**: `commenti.js/css` (si spengono con `UL_CFG.commenti.attivi = false`).
- **Strumenti**: `tools.js` (una voce + una funzione). Oggi li usa solo la landing; le voci «solo area» rimandano a pagine della web app (`href`).
- **Pagine**: un file HTML per pagina. Navbar, footer, animazioni, strumenti, anteprima area e Da decidere: `app.js`.
- **Grafica**: `ul.css` (token e componenti; in fondo le aggiunte v2 con tablet 701–1100 px e telefono ≤ 700 px).
- Font: `fonts/Croogla4F.ttf`. Dispense: `data.js`. Anteprime dell'area in home: `img/area-*.jpg` (screenshot della web app).
- `?statico` nell'URL disattiva le animazioni d'ingresso (utile per screenshot).
- Ogni modifica: aggiorna `UL_CFG.versione` in `config.js`, poi commit con una frase chiara (diventa la nota della versione) e push.

## Campi per Framer
Ogni testo e immagine delle aggiunte del 7 ottobre sta in un campo: in Framer va reso modificabile (proprietà del componente o collezione CMS).
| Dove | Campo | Usato in |
|---|---|---|
| `config.js` | `nav` (etichette della barra) | tutte le pagine |
| `config.js` | `home.hero` (4 foto, 2 sticker) · `home.numeri` (voci, immagine) | H02, H03 |
| `config.js` | `hub[].icoImg` (icona dell'hub, vuota = simbolo) | H04, hub |
| `config.js` | `catalogo.piuScaricati[hub]` (slug degli esami) | H06 |
| `config.js` | `listino` (stato, prezzi, gratis, mesi in sessione, nota Plus) | H06c, Materiali, Anteprima |
| `config.js` | `anteprima` (argomenti per esame, perché, tips) | Anteprima, Planner |
| `config.js` | `team[]` (nome, ruolo, corso, foto, LinkedIn, bio, punti) — oggi segnaposto | H09 |
| `config.js` | `faq[]` ([domanda, risposta, testo link, link]; `@app` = web app) | H11 |
| `config.js` | `fasi[].tab` (nome della tab) | tab degli hub |
| `config.js` | `planner` (esame, fasce di voto, fasi, giorni, ore, margine, oggi, completate) | Studiare (S06) |
| `guida-dati.js` | `UL_GUIDA.facolta[]` · `schema` · `economia.capitoli[].sezioni[].blocchi[]` | Guida (S14) → collezione CMS «Guide» |

## Versioni e backup
A ogni push che tocca questa cartella la GitHub Action **Backup demo** crea uno ZIP, una Release (`landing-vN`) e una riga in `demos/registro.json`. Per tornare indietro: scarica lo ZIP dall'HQ, oppure ripristina la cartella dal tag `landing-vN`.

## Verifica prima di pubblicare
`node _src/verifica_landing.js` (con `python -m http.server 8765` acceso, `npm i playwright axe-core`): controlla errori, file mancanti, scorrimento laterale e accessibilità su tutte le pagine in tre formati. Deve scrivere «tutto ok».

## Limiti
Il carosello della home apre `../demo-webapp/`: funziona su GitHub Pages e con lo ZIP completo del repo (uno ZIP della sola landing non lo trova). La galleria dell'area è fatta di immagini e funziona da sola; se la web app cambia grafica o rotte, rifare le schermate e controllare i link (`href` in `tools.js`, campo `area` delle card).
I commenti sono salvati nel browser di chi li scrive: per unirli, esportare il JSON e importarlo.
