# UniLink HQ · mette ?v=<data-ora> a tutti i file locali (js e css) delle pagine HTML delle due demo.
# Serve perché GitHub Pages fa tenere i file in cache al browser: senza questo, dopo un rilascio
# si continua a vedere la versione precedente. Si lancia prima di ogni commit:  python versiona.py
import re, pathlib, time
v = time.strftime("%Y%m%d%H%M")
radice = pathlib.Path(__file__).parent
patt = re.compile(r'''((?:src|href)=")(?!https?:|//|#|mailto:|data:)([^"?#]+\.(?:js|css))(?:\?v=\d+)?"''')
n = 0
for d in ("demo-webapp", "demo-landing"):
    for f in (radice / d).rglob("*.html"):
        s = f.read_text(encoding="utf-8")
        t = patt.sub(lambda m: f'{m.group(1)}{m.group(2)}?v={v}"', s)
        if t != s:
            f.write_text(t, encoding="utf-8", newline="\n"); n += 1
print(f"versione {v} su {n} pagine")
