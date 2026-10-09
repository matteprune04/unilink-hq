# UniLink HQ — versione online

Spazio di lavoro privato dei founder UniLink. Sito statico (GitHub Pages) + database Supabase.
Accesso: nome (solo per firmare) + password unica del team. Senza password i dati non sono leggibili:
lo impediscono le regole del database (Row Level Security), non solo la pagina.

- `index.html` — generato da `_src/build_online.py` partendo da `../04_FoundersHQ/index.src.html`. Non modificarlo a mano.
- `config.js` — URL e chiave pubblica (anon) di Supabase, email dell'account unico del team.
- `supabase/schema.sql` — tabelle e regole di accesso.
- `sync/google_sync.py` + `.github/workflows/google-sync.yml` — ogni giorno legge Google Analytics e Search Console in sola lettura e aggiorna la sezione "Sito e Google".

Segreti (solo in GitHub → Settings → Secrets, mai nel codice): `GOOGLE_KEY_JSON`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`.

## Brand (rebranding 9 ottobre 2026)
- `brand/` contiene **solo** i file che la pagina deve mostrare: simbolo, marchio orizzontale, favicon, icone e `site.webmanifest`. Il vecchio logo è in `brand/_archivio/`.
- Colori e regole sono nel manuale del brand (`11_Logo/UniLink_Brand.pdf`); i token sono nelle variabili `:root` di `index.html`.
- Il resto del kit e i modelli **non stanno nel repository** (è pubblico): si importano dentro l'HQ da **Materiali → Importa zip**, che li apre nel browser e li carica nell'archivio privato (bucket `hq-files`), segnandoli "da verificare".

## Materiali
- Sezione **Materiali** dell'HQ: Panoramica, Didattica (esame per esame), Fonti raw (zip per tipo e per esame), Brand, Modelli, Database.
- La fotografia del database del sito (`MAT_DB` in `index.html`) è statica: va aggiornata a mano quando cambia `contenuti_studio`.
