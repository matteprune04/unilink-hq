"""Carica in UniLink HQ l'esito di una verifica di affidabilità e capacità (Sito e Google → «Affidabilità e capacità»).

Uso:  python carica_affidabilita.py <cartella>
La cartella deve contenere dati.json e un solo PDF (il report completo).
- il PDF va nell'archivio privato «hq-files» in affidabilita/<data>.pdf
- la sintesi va nel documento «affidabilita/<data>» della tabella docs
- ogni problema confermato diventa una BOZZA di attività (regola dell'HQ: l'AI propone, le persone confermano),
  collegata all'argomento indicato in dati.json; se esiste già un'attività o una bozza con lo stesso titolo non si duplica.

dati.json: { data, titolo, ambiente, versione, esito {tipo, etichetta, testo}, capacita [{l, v, nota}], limiti [..],
             problemi [{testo, quando, stato}], argomento, attivita [{titolo, dettagli, passi [..], priorita}] }
La chiave di servizio dell'HQ si legge da C:\\Users\\matte\\.unilink\\hq-service-key.txt e non viene mai stampata.
"""
import datetime as dt
import json
import random
import re
import string
import sys
from pathlib import Path

import requests

CHIAVE = Path.home() / ".unilink" / "hq-service-key.txt"
CONFIG = Path(__file__).resolve().parent.parent / "config.js"

cartella = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else None
if not cartella or not (cartella / "dati.json").exists():
    sys.exit("Indica la cartella con dati.json e il PDF del report.")
pdfs = list(cartella.glob("*.pdf"))
if len(pdfs) != 1:
    sys.exit(f"Nella cartella serve un solo PDF, ne ho trovati {len(pdfs)}.")
if not CHIAVE.exists():
    sys.exit(f"Manca la chiave dell'HQ in {CHIAVE}: niente è stato caricato.")

url = re.search(r'supabaseUrl:\s*"([^"]+)"', CONFIG.read_text(encoding="utf-8")).group(1).rstrip("/")
key = CHIAVE.read_text(encoding="utf-8").strip()
H = {"apikey": key, "Authorization": "Bearer " + key}
D = json.loads((cartella / "dati.json").read_text(encoding="utf-8"))
giorno, pdf = D["data"], pdfs[0]
ora = dt.datetime.now(dt.timezone.utc).isoformat()
norm = lambda s: re.sub(r"\s+", " ", str(s or "")).strip().lower()

# 1) report completo nell'archivio privato
path = f"affidabilita/{giorno}.pdf"
r = requests.post(f"{url}/storage/v1/object/hq-files/{path}", data=pdf.read_bytes(), timeout=60,
                  headers={**H, "Content-Type": "application/pdf", "x-upsert": "true"})
if not r.ok:
    sys.exit(f"Caricamento del PDF non riuscito ({r.status_code}): {r.text[:200]}")

def leggi(col):
    r = requests.get(f"{url}/rest/v1/docs?select=id,data&col=eq.{col}", headers=H, timeout=60)
    r.raise_for_status()
    return r.json()

def salva(righe):
    r = requests.post(f"{url}/rest/v1/docs?on_conflict=col,id", json=righe, timeout=60,
                      headers={**H, "Prefer": "resolution=merge-duplicates,return=minimal"})
    if not r.ok:
        sys.exit(f"Salvataggio non riuscito ({r.status_code}): {r.text[:200]}")

# 2) bozze di attività, senza doppioni (titoli di attività esistenti e di bozze non scartate)
topics = leggi("topics")
arg = next((t for t in topics if norm(t["data"].get("title")) == norm(D.get("argomento"))), None)
if not arg:
    sys.exit(f"Argomento «{D.get('argomento')}» non trovato nell'HQ: niente è stato caricato.")
esistenti = {norm(t["data"].get("title")) for t in leggi("tasks")}
bozze = leggi("bozze")
# anche le bozze SCARTATE contano: uno scarto è una decisione dei founder, non si ripropone
esistenti |= {norm((b["data"].get("data") or {}).get("titolo")) for b in bozze}
# bozze di questa stessa verifica ancora da confermare: si aggiornano (dettagli e passi), non si duplicano
mie = {norm((b["data"].get("data") or {}).get("titolo")): b for b in bozze
       if b["data"].get("batch") == f"affidabilita-{giorno}" and b["data"].get("state") == "da confermare"}
nuove, saltate, aggiornate = [], [], []
for a in D.get("attivita", []):
    if norm(a["titolo"]) in mie:
        b = mie[norm(a["titolo"])]
        b["data"]["data"].update({"dettagli": a.get("dettagli", ""), "passi": a.get("passi", [])})
        nuove.append({"col": "bozze", "id": b["id"], "updated_at": ora, "data": b["data"]})
        aggiornate.append(a["titolo"]); continue
    if norm(a["titolo"]) in esistenti:
        saltate.append(a["titolo"]); continue
    bid = "aff" + "".join(random.choices(string.ascii_lowercase + string.digits, k=12))
    nuove.append({"col": "bozze", "id": bid, "updated_at": ora, "data": {
        "id": bid, "callId": "", "kind": "attivita", "state": "da confermare", "batch": f"affidabilita-{giorno}",
        "data": {"titolo": a["titolo"], "argomento": arg["id"], "dettagli": a.get("dettagli", ""), "passi": a.get("passi", []), "chi": a.get("chi", [])},
        "createdAt": ora, "by": "Verifica di affidabilità"}})
    esistenti.add(norm(a["titolo"]))
# attività che la verifica stessa ha già fatto: la bozza ancora da confermare passa a «scartata» (resta consultabile, non si cancella)
superate = []
for t in D.get("attivita_superate", []):
    b = mie.get(norm(t))
    if b:
        b["data"].update({"state": "scartata", "nota": "Fatta durante la verifica"})
        nuove.append({"col": "bozze", "id": b["id"], "updated_at": ora, "data": b["data"]})
        superate.append(t)
if nuove:
    salva(nuove)

# 3) sintesi per la pagina «Sito e Google»
doc = {k: D.get(k) for k in ("data", "titolo", "ambiente", "versione", "esito", "capacita", "limiti", "problemi")}
doc.update({"id": giorno, "pdf": {"path": path, "name": pdf.name, "size": pdf.stat().st_size, "type": "application/pdf"},
            "createdAt": ora, "by": "Verifica di affidabilità"})
salva([{"col": "affidabilita", "id": giorno, "data": doc, "updated_at": ora}])
print(f"OK: verifica {giorno} caricata (PDF {pdf.stat().st_size // 1024} KB) · {len(nuove) - len(aggiornate) - len(superate)} bozze di attività nuove · {len(aggiornate)} aggiornate · {len(superate)} superate"
      + (f" · {len(saltate)} già presenti: {', '.join(saltate)}" if saltate else ""))
