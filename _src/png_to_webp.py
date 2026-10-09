"""Converte i PNG delle schermate della web app in WebP dentro demo-landing/img/app/ (qualità 80).
Uso: python _src/png_to_webp.py <cartella-con-i-png>      (richiede: pip install pillow)
I nomi restano uguali: <id>-desk.webp, <id>-tab.webp, <id>-ph.webp."""
import os
import sys
from pathlib import Path
from PIL import Image

src = Path(sys.argv[1])
out = Path(__file__).resolve().parent.parent / "demo-landing" / "img" / "app"
out.mkdir(parents=True, exist_ok=True)
tot = 0
for f in sorted(src.glob("*.png")):
    dest = out / (f.stem + ".webp")
    Image.open(f).convert("RGB").save(dest, "WEBP", quality=80, method=6)
    tot += os.path.getsize(dest)
print(f"{len(list(src.glob('*.png')))} immagini → {out} ({tot / 1048576:.1f} MB)")
