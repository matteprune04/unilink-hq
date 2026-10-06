# UniLink · demo navigabile della landing v2

Demo HTML statica della nuova landing, costruita esattamente sull'architettura v2 (`08_Sito_Framer/architettura/UniLink_Architettura_Landing.pdf`). È un **riferimento per Framer**, non il sito vero.

## Pagine
| File | Cosa |
|---|---|
| `index.html` | Home: hero con nastro animato, numeri reali GA4, hub, "Parti da dove sei", ricerca dispense, come funziona, calcolatore voto, team, voci (esempio), FAQ |
| `hub-economia.html` | Hub attivo: tre fasi, dispense per anno, tool, community |
| `hub-giurisprudenza.html`, `hub-medicina.html` | Hub in arrivo: lista d'attesa (simulata), anteprima, "costruiscilo con noi" |
| `dispense.html` | Catalogo completo delle 34 dispense con ricerca e filtri anno + area |
| `tools.html` | Calcolatore voto di laurea funzionante + link ai tool del sito attuale |
| `prezzi.html` | Prezzi **di esempio** (ipotesi del 4/10), toggle per esame / per semestre |

## Cosa funziona davvero
Navigazione, menu Hub e menu da telefono, ricerca e filtri sulle 34 dispense (dati da `00_FONTI/Dispense_aggiornato.csv`), calcolatore con le regole di `UniLinkVotoLaurea.v5.tsx` (media·110/30, +0,333 per lode, tesi +1/+2/+3, in corso +2, lode con presentazione ≥ 104,5 e tesi Ottimo), FAQ, toggle prezzi. Le card delle dispense e i tool aprono le pagine vere su unilinkfirenze.it.

## Cosa è simulato o fittizio
Lista d'attesa e newsletter (salvate solo nel browser, nessun invio), acquisti, testimonianze, date "Aggiornata il", prezzi. Foto: dal sito attuale e dalle demo, da sostituire con foto vostre.

## Modificare
- Stili: `ul.css` (token del cap. 13 del PDF). Font: `fonts/Croogla4F.ttf`.
- Interazioni, navbar e footer: `app.js`. Dati dispense: `data.js`.
- Le pagine si rigenerano da `../demo_grafiche/` con `python _build/build_home.py` e `python _build/build_pagine.py` (dalla cartella `demo_navigabile`).
- `?statico` nell'URL disattiva le animazioni d'ingresso (utile per screenshot).
- Pubblicata in `05_HQ_Online/demo-landing/` (GitHub Pages): dopo una modifica ricopiare la cartella e fare commit + push.
