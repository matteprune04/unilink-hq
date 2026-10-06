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
- `demo-landing/` — demo navigabile della landing v2 · `demo-webapp/` — demo della web app (area personale) v2. Gli strumenti (`tools.js/css`) sono condivisi: `python _src/sync_shared.py` li copia da una cartella all'altra.
- `.github/workflows/demo-backup.yml` + `_src/demo_snapshot.py` — a ogni modifica delle demo: ZIP, Release GitHub (`landing-vN`, `webapp-vN`) e riga in `demos/registro.json`.
- In HQ, Laboratorio AI → sezione **DEMO** legge il registro (anteprima, download, storico). Il codice sta in `_src/online.js`, quindi resta dopo ogni build.
- `architettura/` — PDF di architettura di landing e web app (sorgenti Typst in `architettura/landing/` e `architettura/webapp/`) e `CONTESTO_DEMO.md`: la versione compatta da allegare come contesto quando si chiede una modifica alle demo.
