# UniLink · demo della web app (area personale) · v2

Demo HTML statica dell'area personale, costruita su `architettura/UniLink_Architettura_WebApp.pdf` (v2).
Base grafica: demo **A** «Il tuo spazio» (Testing Version), con dettagli della demo C. È un riferimento per lo sviluppo vero (Next.js + Supabase): i dati sono di esempio.

- Online: https://matteprune04.github.io/unilink-hq/demo-webapp/
- In HQ: Laboratorio AI → sezione **DEMO** (anteprima, download, storico)

## Il modello: tre livelli indipendenti
1. **Area di studio** (Economia attiva · Giurisprudenza e Medicina in arrivo · altre): cosa studi.
2. **Percorso** (Test Prep · Studio · Futuro): in che momento sei. Selettore in cima alla sidebar.
3. **Piano** (Gratuito · Appunti · Dispensa · Semestre · Plus): cosa è sbloccato. Prezzi = ipotesi.

## Come provarla
Dal login scegli un account demo: Giulia (gratuito), Marco (dispensa), Sara (semestre), Luca (Plus, Futuro), Elena (Giurisprudenza in arrivo), Pietro (Test Prep), oppure «Nuovo account» per il primo accesso in 7 passi. Il cerchio in alto a destra apre il menu (cambia account, rifai il primo accesso).

## Modificare
- **Cosa c'è**: `config.js` (aree, percorsi, moduli, piani, strumenti, domande, account demo, card «Da decidere»).
- **Regole dei piani**: `app.js` → `accesso()` (un solo punto).
- **Pagine**: `app.js` → oggetto `P` (indice in testa al file). **Grafica**: `app.css`.
- Ogni modifica: aggiornare `UL_VERSIONE` in `config.js`, commit con una frase chiara (diventa la nota della versione), push.
- Sezione di lavoro: **Da decidere** (idee aperte) e **Configurazione** (tabelle di config.js).

## Versioni e backup
A ogni push su questa cartella la GitHub Action **Backup demo** crea ZIP, Release (`webapp-vN`) e riga in `demos/registro.json`.

## Cosa è simulato
Accesso, email, pagamenti, lista d'attesa, estratti delle dispense, domande di quiz (scritte per la demo). Schede e strumenti «sul sito» aprono le pagine vere di unilinkfirenze.it.
