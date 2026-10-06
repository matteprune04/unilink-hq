"""Copia i file condivisi (strumenti) da demo-landing/ a demo-webapp/.

tools.js e tools.css devono restare IDENTICI nelle due demo (ognuna si scarica e si apre da sola,
per questo non sono un file unico). Si modificano in demo-landing/ e poi:  python _src/sync_shared.py
Con --verifica non copia: esce con errore se i file sono diversi (utile prima di un push).
"""
import filecmp
import shutil
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
FILE = ["tools.js", "tools.css"]
verifica = "--verifica" in sys.argv
diversi = [f for f in FILE if not (REPO / "demo-webapp" / f).exists() or not filecmp.cmp(REPO / "demo-landing" / f, REPO / "demo-webapp" / f, shallow=False)]
if verifica:
    print("Diversi:", diversi) if diversi else print("Identici: ok")
    sys.exit(1 if diversi else 0)
for f in FILE:
    shutil.copy2(REPO / "demo-landing" / f, REPO / "demo-webapp" / f)
print("Copiati:", ", ".join(FILE))
