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
