# UniLink HQ — versione online

Spazio di lavoro privato dei founder UniLink. Sito statico (GitHub Pages) + database Supabase.
Accesso: nome (solo per firmare) + password unica del team. Senza password i dati non sono leggibili:
lo impediscono le regole del database (Row Level Security), non solo la pagina.

- `index.html` — generato da `_src/build_online.py` partendo da `../04_FoundersHQ/index.src.html`. Non modificarlo a mano.
- `config.js` — URL e chiave pubblica (anon) di Supabase, email dell'account unico del team.
- `supabase/schema.sql` — tabelle e regole di accesso.
- `sync/google_sync.py` + `.github/workflows/google-sync.yml` — ogni giorno legge Google Analytics e Search Console in sola lettura e aggiorna la sezione "Sito e Google".

Segreti (solo in GitHub → Settings → Secrets, mai nel codice): `GOOGLE_KEY_JSON`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`.
