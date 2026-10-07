# UniLink · demo navigabile della landing v4

Demo HTML statica della landing, costruita sull'architettura `architettura/UniLink_Architettura_Landing.pdf` (contesto compatto per l'AI: `architettura/CONTESTO_DEMO.md`). È un **riferimento per Framer**, non il sito vero.

- Online: https://matteprune04.github.io/unilink-hq/demo-landing/
- In HQ: Laboratorio AI → sezione **DEMO** (anteprima Desktop · Tablet · Telefono, download, storico delle versioni)

## Pagine
| Codice | File | Cosa |
|---|---|---|
| S01 | `index.html` | Home: hero con nastro, numeri reali GA4, hub, «parti da dove sei», più scaricati (aprono l'anteprima), prezzi, anteprima area personale, come funziona, strumenti, founder (scheda personale), FAQ |
| S02–S04 | `hub-economia.html`, `hub-giurisprudenza.html`, `hub-medicina.html` | Hub attivo / in arrivo (lista d'attesa simulata, strumenti dell'hub) |
| S05–S07 | `prima.html`, `durante.html`, `dopo.html` | Le tre fasi del percorso (tab Scegliere · Studiare · Dopo la laurea). In Studiare: esempio del Planner (P3) |
| S08 | `tesi.html` | Checklist in 6 passi (si ricorda cosa spunti) + voto di laurea |
| S09 | `tools.html` | Strumenti per hub, funzionanti |
| S10 | `area.html` | Galleria di 19 schermate **reali** della web app in desktop / tablet / telefono (solo immagini, con ingrandimento) |
| S11 | `community.html` | Gruppi per anno, ambassador |
| S12 | `prezzi.html` | Prezzi **di esempio**, dal listino in `config.js` (non in navbar) |
| S13 | `commenti.html` | Rapporto dei commenti del team, con esportazione e storico delle esportazioni |
| S14 | `guida.html` | Guida per facoltà: Economia completa (dalla «Guida essenziale»), altre facoltà solo architettura. Contenuti in `guida-dati.js`, grafica in `guida.js` |
| S15 | `materiali.html` | Materiali (P2/P7): listino per hub, calcola il pacchetto, collezione completa |
| S16 | `preview.html?esame=slug` | Anteprima di un esame: copertina, indice, perché, tips sfocati, acquisto |
| S90 | `decidere.html` | Sezione arancio **Da decidere**: 9 schede con architettura completa (L01–L09) |

Navbar: **Hub ▾ · Guida · Materiali · Strumenti · Community** + menu **Founder ▾** (Area personale, Da decidere, Commenti, Prezzi precedente) + **Accedi** (web app).

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
