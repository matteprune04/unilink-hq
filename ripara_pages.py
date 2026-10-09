# GitHub Pages (Jekyll) non pubblica file e cartelle che iniziano con «_». Le build di Astro ne creano (es. «_slug_.abc.js»
# per le pagine [slug]). Questo script rinomina quei file nella cartella data e aggiorna tutti i riferimenti.
# Uso: python -I ripara_pages.py demo-app demo-sito …   (lo lanciano già i pubblica.py delle demo)
import pathlib, sys, re
QUI = pathlib.Path(__file__).parent
for nome in sys.argv[1:]:
    radice = QUI / nome
    rin = {}
    for f in sorted(radice.rglob("_*"), key=lambda p: -len(p.parts)):
        if f.name in ("_redirects", "_headers"): continue
        nuovo = f.with_name("u" + f.name); f.rename(nuovo); rin[f.name] = nuovo.name
    if not rin: print(nome, "nessun file da rinominare"); continue
    pat = re.compile(r"(?<=[/\"'`])(" + "|".join(re.escape(k) for k in sorted(rin, key=len, reverse=True)) + r")")
    n = 0
    for f in radice.rglob("*"):
        if f.is_file() and f.suffix in (".html", ".js", ".mjs", ".css", ".json", ".webmanifest"):
            s = f.read_text(encoding="utf-8", errors="ignore"); t = pat.sub(lambda m: rin[m.group(1)], s)
            if t != s: f.write_text(t, encoding="utf-8"); n += 1
    print(nome, len(rin), "file rinominati,", n, "file aggiornati")
