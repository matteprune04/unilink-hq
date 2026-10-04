"""[Versione online: GitHub Actions -> Supabase]
Legge (in sola lettura) Google Analytics 4 e Search Console di unilinkfirenze.it
e prepara i documenti da scrivere nel database di UniLink HQ.

Uso:  C:\\Users\\matte\\.google\\mcp-venv\\Scripts\\python.exe google_sync.py
Output: _sync/writes.json  -> lista di {collection, doc_id, data}
        - google/latest            istantanea per la sezione "Sito e Google"
        - mvalues/g-<metrica>-<lun> valore settimanale delle metriche collegate
La chiave sta FUORI da OneDrive: C:\\Users\\matte\\.google\\unilink-lettura.json
"""
import datetime as dt
import json
import os
import re
import urllib.request
from pathlib import Path

os.environ.setdefault("GOOGLE_APPLICATION_CREDENTIALS", r"C:\Users\matte\.google\unilink-lettura.json")

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, OrderBy, RunReportRequest
from googleapiclient.discovery import build
import google.auth

PROP = "properties/551156373"
SITE = "https://www.unilinkfirenze.it/"
OUT = Path(__file__).resolve().parent.parent / "_sync"
TODAY = dt.date.today()
YDAY = TODAY - dt.timedelta(days=1)


def d(x):
    return x.isoformat()


# ---------------- Google Analytics 4 ----------------
ga = BetaAnalyticsDataClient()


def report(start, end, metrics, dims=(), order=None, limit=0):
    req = RunReportRequest(property=PROP, date_ranges=[DateRange(start_date=d(start), end_date=d(end))],
                           metrics=[Metric(name=m) for m in metrics], dimensions=[Dimension(name=x) for x in dims],
                           limit=limit or 0)
    if order:
        req.order_bys = [OrderBy(metric=OrderBy.MetricOrderBy(metric_name=order), desc=True)]
    rows = ga.run_report(req).rows
    return [([v.value for v in r.dimension_values], [float(v.value) for v in r.metric_values]) for r in rows]


TOT = ["activeUsers", "newUsers", "screenPageViews", "sessions", "averageSessionDuration"]


def totals(start, end):
    r = report(start, end, TOT)
    v = r[0][1] if r else [0] * len(TOT)
    return {"users": int(v[0]), "newUsers": int(v[1]), "views": int(v[2]), "sessions": int(v[3]), "avgSessionSec": round(v[4])}


l7s, l7e = YDAY - dt.timedelta(days=6), YDAY
p7s, p7e = l7s - dt.timedelta(days=7), l7s - dt.timedelta(days=1)
l28s = YDAY - dt.timedelta(days=27)
daily = report(YDAY - dt.timedelta(days=89), YDAY, ["activeUsers", "screenPageViews"], ["date"])
daily = sorted(({"d": f"{k[0][:4]}-{k[0][4:6]}-{k[0][6:]}", "users": int(v[0]), "views": int(v[1])} for k, v in daily), key=lambda x: x["d"])

GA = {
    "last7": totals(l7s, l7e), "prev7": totals(p7s, p7e), "last28": totals(l28s, YDAY),
    "range7": [d(l7s), d(l7e)],
    "daily": daily,
    "pages": [{"path": k[0], "title": k[1][:80], "views": int(v[0]), "users": int(v[1])}
              for k, v in report(l28s, YDAY, ["screenPageViews", "activeUsers"], ["pagePath", "pageTitle"], "screenPageViews", 10)],
    "channels": [{"name": k[0], "users": int(v[0])} for k, v in report(l28s, YDAY, ["activeUsers"], ["sessionDefaultChannelGroup"], "activeUsers", 8)],
    "devices": [{"name": k[0], "users": int(v[0])} for k, v in report(l28s, YDAY, ["activeUsers"], ["deviceCategory"], "activeUsers", 5)],
    "cities": [{"name": k[0], "users": int(v[0])} for k, v in report(l28s, YDAY, ["activeUsers"], ["city"], "activeUsers", 6)],
}

# ---------------- Search Console ----------------
cr, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
sc = build("searchconsole", "v1", credentials=cr, cache_discovery=False)


def gsc(start, end, dims=(), limit=1000):
    body = {"startDate": d(start), "endDate": d(end), "rowLimit": limit}
    if dims:
        body["dimensions"] = list(dims)
    return sc.searchanalytics().query(siteUrl=SITE, body=body).execute().get("rows", [])


g_daily = gsc(TODAY - dt.timedelta(days=95), TODAY, ["date"])
last_day = dt.date.fromisoformat(g_daily[-1]["keys"][0]) if g_daily else TODAY - dt.timedelta(days=3)


def gtot(start, end):
    r = gsc(start, end)
    r = r[0] if r else {"clicks": 0, "impressions": 0, "ctr": 0, "position": 0}
    return {"clicks": int(r["clicks"]), "impr": int(r["impressions"]), "ctr": round(r["ctr"], 4), "pos": round(r["position"], 1)}


g28s = last_day - dt.timedelta(days=27)
g7s = last_day - dt.timedelta(days=6)
GSC = {
    "lastDay": d(last_day),
    "last28": gtot(g28s, last_day), "prev28": gtot(g28s - dt.timedelta(days=28), g28s - dt.timedelta(days=1)),
    "last7": gtot(g7s, last_day), "range28": [d(g28s), d(last_day)],
    "daily": [{"d": r["keys"][0], "clicks": int(r["clicks"]), "impr": int(r["impressions"])} for r in g_daily][-90:],
    "queries": [{"q": r["keys"][0][:90], "clicks": int(r["clicks"]), "impr": int(r["impressions"]), "ctr": round(r["ctr"], 4), "pos": round(r["position"], 1)}
                for r in sorted(gsc(g28s, last_day, ["query"], 200), key=lambda r: (-r["clicks"], -r["impressions"]))[:15]],
    "pages": [{"url": r["keys"][0].replace("https://www.unilinkfirenze.it", "") or "/", "clicks": int(r["clicks"]), "impr": int(r["impressions"]), "pos": round(r["position"], 1)}
              for r in sorted(gsc(g28s, last_day, ["page"], 200), key=lambda r: (-r["clicks"], -r["impressions"]))[:10]],
}

# ---------------- Indicizzazione ----------------
sitemaps = sc.sitemaps().list(siteUrl=SITE).execute().get("sitemap", [])
xml = urllib.request.urlopen(SITE + "sitemap.xml", timeout=30).read().decode("utf-8", "ignore")
urls = re.findall(r"<loc>(.*?)</loc>", xml)
pages = []
for u in urls[:200]:
    try:
        ir = sc.urlInspection().index().inspect(body={"inspectionUrl": u, "siteUrl": SITE}).execute()["inspectionResult"]["indexStatusResult"]
        pages.append({"url": u.replace("https://www.unilinkfirenze.it", "") or "/", "ok": ir.get("verdict") == "PASS",
                      "state": ir.get("coverageState", ""), "crawl": (ir.get("lastCrawlTime") or "")[:10]})
    except Exception as e:  # una pagina non ispezionabile non blocca il resto
        pages.append({"url": u.replace("https://www.unilinkfirenze.it", "") or "/", "ok": False, "state": "Errore ispezione", "crawl": ""})
INDEX = {"total": len(pages), "indexed": sum(p["ok"] for p in pages),
         "missing": [p for p in pages if not p["ok"]], "sitemapSubmitted": bool(sitemaps)}

latest = {"updatedAt": dt.datetime.now().astimezone().isoformat(timespec="minutes"), "ga": GA, "gsc": GSC, "index": INDEX}

# ---------------- metriche settimanali (settimana corrente, sovrascritta ogni giorno) ----------------
monday = d(TODAY - dt.timedelta(days=TODAY.weekday()))
weekly = {
    "m04-visits": (GA["last7"]["users"], f"GA4: utenti attivi {GA['range7'][0]} – {GA['range7'][1]}"),
    "m16-gclicks": (GSC["last7"]["clicks"], f"Search Console: clic {d(g7s)} – {d(last_day)}"),
    "m17-gimpr": (GSC["last7"]["impr"], f"Search Console: impressioni {d(g7s)} – {d(last_day)}"),
    "m18-gpos": (GSC["last28"]["pos"], f"Search Console: posizione media 28 giorni fino al {d(last_day)}"),
    "m19-indexed": (INDEX["indexed"], f"Pagine indicizzate su {INDEX['total']} nella sitemap"),
}
writes = [{"collection": "google", "doc_id": "latest", "data": latest}]
writes += [{"collection": "mvalues", "doc_id": f"g-{mid}-{monday}",
            "data": {"metricId": mid, "date": monday, "value": v, "note": note + " (aggiornato in automatico)", "by": "Google", "auto": True}}
           for mid, (v, note) in weekly.items()]

OUT.mkdir(exist_ok=True)
(OUT / "writes.json").write_text(json.dumps(writes, ensure_ascii=False, indent=1), encoding="utf-8")
(OUT / "google_latest.json").write_text(json.dumps(latest, ensure_ascii=False), encoding="utf-8")
size = len(json.dumps(latest))
print(f"OK {latest['updatedAt']} | GA utenti 7g {GA['last7']['users']} | GSC clic 28g {GSC['last28']['clicks']} | "
      f"indicizzate {INDEX['indexed']}/{INDEX['total']} | doc {size // 1024} KB | {len(writes)} scritture -> {OUT / 'writes.json'}")

# ---------------- invio al database Supabase (solo se configurato, es. in GitHub Actions) ----------------
SB_URL, SB_KEY = os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_SERVICE_KEY")
if SB_URL and SB_KEY:
    import requests
    now = dt.datetime.now(dt.timezone.utc).isoformat()
    rows = [{"col": w["collection"], "id": w["doc_id"], "data": w["data"], "updated_at": now} for w in writes]
    r = requests.post(SB_URL.rstrip("/") + "/rest/v1/docs?on_conflict=col,id", json=rows, timeout=60,
                      headers={"apikey": SB_KEY, "Authorization": "Bearer " + SB_KEY,
                               "Prefer": "resolution=merge-duplicates,return=minimal"})
    r.raise_for_status()
    print(f"Supabase: {len(rows)} documenti aggiornati")
