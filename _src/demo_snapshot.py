"""Backup automatico delle demo (landing e web app) con storico delle versioni.

Lo esegue la GitHub Action .github/workflows/demo-backup.yml a ogni push che tocca
demo-landing/ o demo-webapp/. Per ogni demo cambiata:
  1. crea lo ZIP della cartella (scaricabile e apribile senza installare nulla);
  2. pubblica una Release GitHub con tag <id>-v<N> e lo ZIP allegato (backup fuori dal repository);
  3. aggiunge la versione a demos/registro.json (numero, data, autore, nota, link).
L'HQ (Laboratorio AI → sezione DEMO) legge demos/registro.json e mostra anteprima, download e storico.

Uso locale (senza pubblicare release):  python _src/demo_snapshot.py --prova
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
REGISTRO = REPO / "demos" / "registro.json"
OUT = REPO / "_dist"
GH_REPO = os.environ.get("GITHUB_REPOSITORY", "matteprune04/unilink-hq")
PAGES = "https://matteprune04.github.io/unilink-hq/"

# Le demo seguite. Per aggiungerne una: una riga qui + il percorso in demo-backup.yml.
DEMO = [
    {"id": "landing", "titolo": "Landing", "cartella": "demo-landing",
     "descrizione": "Landing v2: Prima · Durante · Dopo, strumenti, anteprima area personale, Da decidere (riferimento per Framer).",
     "architettura": "UniLink_Architettura_Landing.pdf"},
    {"id": "webapp", "titolo": "Web app · area personale", "cartella": "demo-webapp",
     "descrizione": "Web app v4: listino P2 come la landing (Appunti, Completa, pacchetti, Plus una tantum), ogni sezione presente o da sbloccare secondo il piano, UniLink Planner (P3), Guida per facoltà, Tesi e CV; Da decidere con Career e Network.",
     "architettura": "UniLink_Architettura_WebApp.pdf"},
]
ESCLUDI = {".DS_Store", "Thumbs.db"}


def git(*args):
    return subprocess.run(["git", *args], cwd=REPO, capture_output=True, text=True).stdout.strip()


def file_di(cartella):
    base = REPO / cartella
    return sorted(p for p in base.rglob("*") if p.is_file() and p.name not in ESCLUDI)


def impronta(cartella):
    h = hashlib.sha256()
    for p in file_di(cartella):
        h.update(str(p.relative_to(REPO)).encode())
        h.update(p.read_bytes())
    return h.hexdigest()[:16]


CONFIG = {"demo-landing": "demo-landing/config.js", "demo-webapp": "demo-webapp/js/config.js"}
RE_VER = re.compile(r'versione\s*[:=]\s*\{\s*n:\s*(\d+),\s*data:\s*"([^"]+)"', re.I)  # landing «versione: {…}», web app «UL.VERSIONE = {…}»


def versione_demo(cartella, rev=None):
    """La versione scritta dalla demo stessa (UL_CFG.versione in config.js), quella che compare nel footer.
    Il numero di backup (n) conta i push; questo conta le versioni della demo: servono tutti e due."""
    rel = CONFIG.get(cartella)
    if not rel:
        return None, None
    testo = git("show", f"{rev}:{rel}") if rev else ((REPO / rel).read_text(encoding="utf-8") if (REPO / rel).exists() else "")
    m = RE_VER.search(testo or "")
    return (int(m.group(1)), m.group(2)) if m else (None, None)


def crea_zip(d, n, giorno, dv=None):
    OUT.mkdir(exist_ok=True)
    nome = f"UniLink_{d['id']}_demo-v{dv}_backup{n}_{giorno}.zip" if dv else f"UniLink_{d['id']}_v{n}_{giorno}.zip"
    with zipfile.ZipFile(OUT / nome, "w", zipfile.ZIP_DEFLATED) as z:
        for p in file_di(d["cartella"]):
            z.write(p, Path(d["cartella"]) / p.relative_to(REPO / d["cartella"]))
    return OUT / nome


def main():
    prova = "--prova" in sys.argv
    reg = json.loads(REGISTRO.read_text(encoding="utf-8")) if REGISTRO.exists() else {"demo": []}
    cambiate = []
    for d in DEMO:
        if not (REPO / d["cartella"]).exists():
            continue
        voce = next((x for x in reg["demo"] if x["id"] == d["id"]), None)
        if voce is None:
            voce = {"id": d["id"], "versioni": []}
            reg["demo"].append(voce)
        # i dati descrittivi vengono sempre da DEMO (qui sopra), le versioni si accumulano
        voce.update({k: d[k] for k in ("titolo", "cartella", "descrizione", "architettura")})
        voce["url"] = PAGES + d["cartella"] + "/"
        imp = impronta(d["cartella"])
        if voce["versioni"] and voce["versioni"][0]["impronta"] == imp:
            continue
        n = (voce["versioni"][0]["n"] + 1) if voce["versioni"] else 1
        ora = datetime.now(timezone.utc)
        dv, dd = versione_demo(d["cartella"])
        z = crea_zip(d, n, ora.strftime("%Y-%m-%d"), dv)
        tag = f"{d['id']}-v{n}"
        autore = git("log", "-1", "--format=%an", "--", d["cartella"]) or "n/d"
        nota = git("log", "-1", "--format=%s", "--", d["cartella"]) or "Nuova versione"
        commit = git("log", "-1", "--format=%h", "--", d["cartella"])
        voce["versioni"].insert(0, {
            "n": n, "tag": tag, "data": ora.isoformat(timespec="minutes"), "autore": autore, "nota": nota,
            "commit": commit, "demo_v": dv, "demo_data": dd, "impronta": imp, "kb": z.stat().st_size // 1024, "file": z.name,
            "download": f"https://github.com/{GH_REPO}/releases/download/{tag}/{z.name}",
            "sorgente": f"https://github.com/{GH_REPO}/tree/{tag}/{d['cartella']}",
        })
        cambiate.append((d, n, tag, z, nota, dv))
        print(f"{d['titolo']}: backup {n}{f' (demo v{dv})' if dv else ''} ({z.stat().st_size // 1024} KB) — {nota}")

    if not cambiate:
        print("Nessuna demo cambiata.")
        return
    if not prova:
        for d, n, tag, z, nota, dv in cambiate:
            subprocess.run(["gh", "release", "create", tag, str(z), "--repo", GH_REPO,
                            "--title", f"{d['titolo']} · demo v{dv} · backup {n}" if dv else f"{d['titolo']} · v{n}", "--notes", f"Backup automatico della demo.\n\n{nota}",
                            "--target", git("rev-parse", "HEAD"), "--latest=false"], check=True)
    reg["aggiornato"] = datetime.now(timezone.utc).isoformat(timespec="minutes")
    dest = OUT / "registro_prova.json" if prova else REGISTRO  # in prova non tocca il registro vero
    dest.parent.mkdir(exist_ok=True)
    dest.write_text(json.dumps(reg, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
