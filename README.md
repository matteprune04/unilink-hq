# UniLink HQ — versione online

Spazio di lavoro privato dei founder UniLink. Sito statico (GitHub Pages) + database Supabase.
Accesso: nome (solo per firmare) + password unica del team. Senza password i dati non sono leggibili:
lo impediscono le regole del database (Row Level Security), non solo la pagina.

- `index.html` — generato da `_src/build_online.py` partendo da `../04_FoundersHQ/index.src.html`. Non modificarlo a mano.
- `config.js` — URL e chiave pubblica (anon) di Supabase, email dell'account unico del team.
- `supabase/schema.sql` — tabelle e regole di accesso.
- `sync/google_sync.py` + `.github/workflows/google-sync.yml` — ogni giorno legge Google Analytics e Search Console in sola lettura e aggiorna la sezione "Sito e Google".

Segreti (solo in GitHub → Settings → Secrets, mai nel codice): `GOOGLE_KEY_JSON`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`.

## Demo e backup
- `demo-landing/` — demo navigabile della landing v3 (Prima · Durante · Dopo, strumenti, schermate reali dell'area, 9 schede «Da decidere» complete, commenti del team) · `demo-webapp/` — demo della web app (area personale).
- `_src/verifica_landing.js` — verifica prima del push (errori, accessibilità, tre formati) · `_src/build_schede.js` — genera schede e PDF «Da decidere» · `_src/screenshot_webapp.js` — rifà le schermate reali della web app.
- `.github/workflows/demo-backup.yml` + `_src/demo_snapshot.py` — a ogni modifica delle demo: ZIP, Release GitHub (`landing-vN`, `webapp-vN`) e riga in `demos/registro.json`.
- In HQ, Laboratorio AI → sezione **DEMO** legge il registro (anteprima, download, storico). Il codice sta in `_src/online.js`, quindi resta dopo ogni build.
- `architettura/` — PDF di architettura di landing e web app, PDF delle schede «Da decidere» (generato da `architettura/schede/`) e `CONTESTO_DEMO.md`: la versione compatta da allegare come contesto quando si chiede una modifica alle demo. `LINEA_GUIDA_UNILINK.md` (e `UniLink_Linea_Guida.pdf`) è il manuale unico: landing + web app + report del 4 ottobre, con le discordanze non risolte; si rigenera con `_src/linea_guida/build_linea_guida.py`.

## Brand (rebranding 9 ottobre 2026)
- `brand/` contiene **solo** i file che la pagina deve mostrare: simbolo, marchio orizzontale, favicon, icone e `site.webmanifest`. Il vecchio logo è in `brand/_archivio/`.
- Colori e regole sono nel manuale del brand (`11_Logo/UniLink_Brand.pdf`); i token sono nelle variabili `:root` di `index.html`.
- Il resto del kit e i modelli **non stanno nel repository** (è pubblico): si importano dentro l'HQ da **Materiali → Importa zip**, che li apre nel browser e li carica nell'archivio privato (bucket `hq-files`), segnandoli "da verificare".

## Materiali
- Sezione **Materiali** dell'HQ: Panoramica, Didattica (esame per esame), Fonti raw (zip per tipo e per esame), Brand, Modelli, Database.
- La fotografia del database del sito (`MAT_DB` in `index.html`) è statica: va aggiornata a mano quando cambia `contenuti_studio`.

## Esami e dispense (catalogo a tabella)
- Voce **Esami e dispense**: gli esami per corso (EA, EC, SUSBUS, SECI, Giurisprudenza, Medicina), anno e semestre, con spunta a tre stati (manca · da verificare · verificato) su appunti, schemi, esercizi, quiz, simulazione, syllabus.
- Si carica da CSV (stesso formato di `Dispense_1.csv`) o incollando un elenco; gli esami con lo stesso nome in corsi diversi restano distinti. Le spunte non si perdono rimportando. Si scarica anche in CSV.
- I link ai PDF restano nel database privato dell'HQ, non nel repository.
