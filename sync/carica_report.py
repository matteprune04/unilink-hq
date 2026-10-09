"""Carica un report settimanale in UniLink HQ (sezione Metriche → Report settimanali).

Uso:  C:\\Users\\matte\\.google\\mcp-venv\\Scripts\\python.exe carica_report.py <cartella del report>
La cartella (es. 13_Report_Settimanali/2026-10-12) deve contenere dati.json e un solo PDF.
- il PDF va nell'archivio privato «hq-files» in report/<settimana>.pdf (sostituisce quello vecchio della stessa settimana)
- riassunto, cose da fare e numeri chiave vanno nel documento «reports/<settimana>» della tabella docs

La chiave di servizio dell'HQ NON sta nel progetto: la legge da C:\\Users\\matte\\.unilink\\hq-service-key.txt
(una riga, creata a mano da Matteo dal pannello di Supabase). Lo script non la stampa mai.
"""
import datetime as dt
import json
import re
import sys
from pathlib import Path

import requests

CHIAVE = Path.home() / ".unilink" / "hq-service-key.txt"
CONFIG = Path(__file__).resolve().parent.parent / "config.js"

cartella = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else None
if not cartella or not (cartella / "dati.json").exists():
    sys.exit("Indica la cartella del report (con dati.json e il PDF).")
pdfs = list(cartella.glob("*.pdf"))
if len(pdfs) != 1:
    sys.exit(f"Nella cartella serve un solo PDF, ne ho trovati {len(pdfs)}.")
if not CHIAVE.exists():
    sys.exit(f"Manca la chiave dell'HQ in {CHIAVE}: il report è pronto in locale ma non è stato caricato.")

url = re.search(r'supabaseUrl:\s*"([^"]+)"', CONFIG.read_text(encoding="utf-8")).group(1).rstrip("/")
key = CHIAVE.read_text(encoding="utf-8").strip()
H = {"apikey": key, "Authorization": "Bearer " + key}
D = json.loads((cartella / "dati.json").read_text(encoding="utf-8"))
week = D["week"]
pdf = pdfs[0]
path = f"report/{week}.pdf"

r = requests.post(f"{url}/storage/v1/object/hq-files/{path}", data=pdf.read_bytes(), timeout=60,
                  headers={**H, "Content-Type": "application/pdf", "x-upsert": "true"})
if not r.ok:
    sys.exit(f"Caricamento del PDF non riuscito ({r.status_code}): {r.text[:200]}")

doc = {
    "week": week, "from": D["from"], "to": D["to"],
    "summary": D.get("summary", []), "todo": D.get("todo", []), "kpi": D.get("kpi", []),
    "pdf": {"path": path, "name": pdf.name, "size": pdf.stat().st_size, "type": "application/pdf"},
    "createdAt": dt.datetime.now(dt.timezone.utc).isoformat(), "by": "Report automatico",
}
now = dt.datetime.now(dt.timezone.utc).isoformat()
r = requests.post(f"{url}/rest/v1/docs?on_conflict=col,id", json=[{"col": "reports", "id": week, "data": doc, "updated_at": now}],
                  timeout=60, headers={**H, "Prefer": "resolution=merge-duplicates,return=minimal"})
if not r.ok:
    sys.exit(f"Salvataggio del riassunto non riuscito ({r.status_code}): {r.text[:200]}")
print(f"OK: report {week} caricato nell'HQ (PDF {pdf.stat().st_size // 1024} KB, {len(doc['summary'])} punti di riassunto)")
