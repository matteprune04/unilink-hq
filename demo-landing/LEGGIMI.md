# UniLink · demo navigabile della landing v2

Demo HTML statica della landing, costruita sull'architettura `architettura/UniLink_Architettura_Landing.pdf` (contesto compatto per l'AI: `architettura/CONTESTO_DEMO.md`). È un **riferimento per Framer**, non il sito vero.

- Online: https://matteprune04.github.io/unilink-hq/demo-landing/
- In HQ: Laboratorio AI → sezione **DEMO** (anteprima Desktop · Tablet · Telefono, download, storico delle versioni)

## Pagine
| Codice | File | Cosa |
|---|---|---|
| S01 | `index.html` | Home: hero con nastro, numeri reali GA4, hub, «parti da dove sei», catalogo (apre l'area personale), anteprima area personale, come funziona, strumenti, team, FAQ |
| S02–S04 | `hub-economia.html`, `hub-giurisprudenza.html`, `hub-medicina.html` | Hub attivo / in arrivo (lista d'attesa simulata, strumenti dell'hub) |
| S05–S07 | `prima.html`, `durante.html`, `dopo.html` | Le tre fasi del percorso |
| S08 | `tesi.html` | Checklist in 6 passi (si ricorda cosa spunti) + voto di laurea |
| S09 | `tools.html` | Strumenti per hub, funzionanti |
| S10 | `area.html` | La web app vera in un riquadro desktop / tablet / telefono |
| S11 | `community.html` | Gruppi per anno, ambassador |
| S12 | `prezzi.html` | Prezzi **di esempio**, dal listino in `config.js` (non in navbar) |
| S90 | `decidere.html` | Sezione arancio **Da decidere**: card L01–L09 |

## Cosa funziona davvero
Navigazione (menu a tutto schermo da tablet in giù), strumenti (voto di laurea, media e voto obiettivo, piano per l'appello, e di esempio Erasmus, ciclo unico, semestre filtro), ricerca e filtri dispense, anteprima dell'area (iframe sulla web app), checklist tesi, FAQ, toggle prezzi, schede Da decidere.

## Cosa è simulato o fittizio
Lista d'attesa e newsletter (solo nel browser), acquisti, prezzi, regole degli strumenti «Esempio», testi degli ambassador. Nessun link al sito attuale: gli strumenti sono dentro la demo e le dispense nell'area personale.

## Modificare
- **Cosa c'è** (hub, fasi, numeri, listino, card Da decidere): `config.js`. È il file da toccare per i contenuti.
- **Strumenti**: `tools.js` (una voce + una funzione). `tools.js/css` sono **identici** nella web app: dopo averli modificati, `python _src/sync_shared.py`.
- **Pagine**: un file HTML per pagina. Navbar, footer, animazioni, strumenti, anteprima area e Da decidere: `app.js`.
- **Grafica**: `ul.css` (token e componenti; in fondo le aggiunte v2 con tablet 701–1100 px e telefono ≤ 700 px).
- Font: `fonts/Croogla4F.ttf`. Dispense: `data.js`. Anteprime dell'area in home: `img/area-*.jpg` (screenshot della web app).
- `?statico` nell'URL disattiva le animazioni d'ingresso (utile per screenshot).
- Ogni modifica: aggiorna `UL_CFG.versione` in `config.js`, poi commit con una frase chiara (diventa la nota della versione) e push.

## Versioni e backup
A ogni push che tocca questa cartella la GitHub Action **Backup demo** crea uno ZIP, una Release (`landing-vN`) e una riga in `demos/registro.json`. Per tornare indietro: scarica lo ZIP dall'HQ, oppure ripristina la cartella dal tag `landing-vN`.

## Limiti
`area.html` e il carosello della home usano `../demo-webapp/`: funzionano su GitHub Pages e con lo ZIP completo del repo; uno ZIP della sola landing mostra l'anteprima vuota.
