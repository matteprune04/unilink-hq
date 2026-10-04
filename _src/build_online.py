"""Genera la versione online di UniLink HQ (GitHub Pages + Supabase) a partire
dalla stessa sorgente dell'Artifact: ../04_FoundersHQ/index.src.html.

Uso (dalla cartella 05_HQ_Online):  python _src/build_online.py
Scrive index.html nella radice del repository.
"""
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
SRC = REPO.parent / "04_FoundersHQ" / "index.src.html"

s = SRC.read_text(encoding="utf-8")


def rep(a, b, count=1):
    global s
    n = s.count(a)
    assert n == count, f"atteso {count}, trovato {n}: {a[:70]}"
    s = s.replace(a, b)


rep('url("__FONT__")', 'url("Croogla4F.ttf")')
rep('src="__LOGO__"', 'src="logo-white.png"')
rep('const LOGO = "__LOGO__";', 'const LOGO = "logo-white.png";')
rep('const author = (d) => d.by ? `<span class="who" data-uid="${esc(d.by)}">…</span>` : "";',
    'const author = (d) => d.by && !/^u_/.test(d.by) ? `<span class="who">${esc(d.by)}</span>` : "";')
s, n = re.subn(r"async function hydrate\(root\) \{.*?\n\}\n", "function hydrate(root) { loadImgs(root); }\n", s, flags=re.S)
assert n == 1
rep('S.canWrite = await S.user?.can("data.write") !== false; ', '')
rep('Ogni modifica si salva da sola ed è visibile a tutto il team.</div>`;',
    'Ogni modifica si salva da sola ed è visibile a tutto il team.<br><br>Collegato come <b>${esc(S.uid || "")}</b> · <button class="linkbtn" style="color:#fff" data-logout>Esci</button></div>`;')
rep('  if ("menu" in ds) {', '  if ("logout" in ds) { logout(); return; }\n  if ("menu" in ds) {')
s, n = re.subn(r"async function boot\(\) \{.*?\n\}\n", "", s, flags=re.S)
assert n == 1
rep('window.addEventListener("hashchange"', (HERE / "online.js").read_text(encoding="utf-8") + '\nwindow.addEventListener("hashchange"')

login_css = """
/* reset che su claude.ai aggiungeva lo skeleton dell'Artifact */
[hidden] { display: none !important; }
body { margin: 0; }
img { max-width: 100%; }
#login { position: fixed; inset: 0; z-index: 100; background: var(--navy); display: grid; place-items: center; padding: 24px 16px; overflow-y: auto; }
.login-card { width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 16px; color: #fff; }
.login-card h1 { color: #fff; font-size: 40px; }
.login-card .eyebrow { color: var(--orange); }
.login-card .fld > span { color: #fff; }
.login-card .fld small { color: rgba(255,255,255,.65); }
.login-card input { border: 1px solid rgba(255,255,255,.25); background: #fff; color: var(--ink); border-radius: var(--r-sm); padding: 11px 12px; width: 100%; }
.login-logo { height: 38px; width: auto; align-self: flex-start; }
"""
rep("@media (prefers-reduced-motion: reduce)", login_css + "@media (prefers-reduced-motion: reduce)")

title, rest = s.split("\n", 1)
head = f"""<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#172554">
<link rel="icon" href="logo-white.png">
<link rel="apple-touch-icon" href="logo-white.png">
{title}
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js"></script>
<script src="config.js"></script>
"""
# lo <style> e i <link> dei font vanno nell'head, il resto nel body
body_start = rest.index('<div class="mtop">')
out = head + rest[:body_start] + "</head>\n<body>\n<div id=\"login\" hidden></div>\n" + rest[body_start:] + "\n</body>\n</html>\n"
(REPO / "index.html").write_text(out, encoding="utf-8")
print(f"index.html scritto ({len(out) // 1024} KB)")
