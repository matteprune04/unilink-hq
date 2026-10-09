"""Estrae dal materiale vero di Economia Aziendale (00_DISPENSE_BUILD/estratti) la banca esercizi (70 domande con risposta)
e il mazzo standard di flashcard (glossario) e li classifica nei 12 capitoli della dispensa per parole chiave.
uso: python -I estrai_studio.py <cartella estratti EA> <file js di uscita>"""
import sys, re, json, os
src, out = sys.argv[1], sys.argv[2]
rd = lambda f: open(os.path.join(src, f), encoding="utf-8", newline="").read().replace("\r\r\n", "\n").replace("\r\n", "\n")
pul = lambda x: re.sub(r"\s+", " ", x).strip()

# capitoli della dispensa (00_DISPENSE_BUILD/sorgenti) e parole chiave per classificare
CAP = {
 1: ["azienda di erogazione", "aziende di erogazione", "soggetto giuridico", "soggetto economico", "azienda pubblica", "gruppo", "consolidato", "stakeholder", "impresa familiare", "aziende di produzione", "economia aziendale"],
 2: ["ambiente", "concorren", "innovazione", "rischio d'impresa", "mercato", "settore"],
 3: ["capitale intellettuale", "capitale umano", "capitale finanziario", "sistema aziendale", "valori guida", "formula imprenditoriale", "governance", "capitale sociale", "mission", "vision", "patrimonio"],
 4: ["gestione", "catena del valore", "provvista", "trasformazione", "scambio", "operazioni"],
 5: ["valori", "costi e ricavi", "ricavi", "valori numerari", "valori economici", "entrate", "uscite"],
 6: ["reddito", "utile", "perdita", "risultato economico", "competenza", "esercizio"],
 7: ["equilibrio economico", "break even", "punto di pareggio", "costi fissi", "costi variabili", "margine di contribuzione", "costo del capitale", "roe", "roi", "redditività"],
 8: ["equilibrio finanziario", "fabbisogno", "autofinanziamento", "leva finanziaria", "liquidità", "circolante", "indebitamento", "solvibilità", "finanziamento", "fonti"],
 9: ["controllo", "rilevazion", "budget", "forecasting", "revisore", "contabilità analitica", "sistema informativo", "conto"],
 10: ["partita doppia", "dare", "avere", "scrittura", "libro giornale", "piano dei conti", "contabilità generale", "fattura", "iva"],
 11: ["ammortament", "rimanenze", "ratei", "risconti", "accantonament", "fondo", "assestamento", "bilancio d'esercizio", "stato patrimoniale", "conto economico", "chiusura", "riapertura", "inventario", "bilancio"],
 12: ["valore economico del capitale", "avviamento", "valutazione d'azienda", "metodo reddituale", "metodo patrimoniale", "metodi misti"],
}
def cap_di(testo):
    t = testo.lower(); best, punti = 0, 0   # 0 = «Ripasso generale»: domande che non cadono in un capitolo preciso
    for c, kw in CAP.items():
        p = sum(len(k) for k in kw if k in t)
        if p > punti: best, punti = c, p
    return best

t = re.sub(r"\[\[[^\]]*\]\]", "\n", rd("DOMANDE ECONOMIA AZIENDALE CON RISPOSTE.txt"))
qs = re.findall(r"(\d+)\.\s+(.+?)\n\s*A\)\s*(.+?)\n\s*B\)\s*(.+?)\n\s*C\)\s*(.+?)\n\s*D\)\s*(.+?)\n\s*Risposta corretta:\s*([ABCD])", t, re.S)
esercizi = []
for n, q, a, b, c, d, r in qs:
    opts = [pul(a), pul(b), pul(c), pul(d)]
    esercizi.append({"id": "ea-d%02d" % int(n), "cap": cap_di(q + " " + opts["ABCD".index(r)]), "q": pul(q), "opts": opts, "a": "ABCD".index(r)})

g = re.sub(r"\[\[[^\]]*\]\]", "\n", rd("GLOSSARIO PAROLE CHIAVE ECONOMIA AZIENDALE.txt"))
g = g[g.find("GLOSSARIO ECONOMIA AZIENDALE"):]
carte = []
for m in re.finditer(r"#([A-Za-zÀ-ÿ'’]+)\s*(.*?)(?=\n\s*\n|\n?#[A-ZÀ-Ý]|\Z)", g, re.S):
    term = re.sub(r"(?<=[a-zà-ÿ])(?=[A-Z])", " ", m.group(1)).strip()
    term = term[0].upper() + term[1:]
    dfn = pul(m.group(2)).lstrip(":–—- ").strip()
    if len(dfn) < 12: continue
    if dfn.lower().startswith(("è ", "e' ", "sono ")): dfn = dfn[0].upper() + dfn[1:]
    carte.append({"id": "ea-f%03d" % (len(carte) + 1), "cap": cap_di(term + " " + dfn), "f": term, "b": dfn[:600]})

js = "/* GENERATO da estrai_studio.py (8/10/2026) dal materiale vero di Economia Aziendale in 00_DISPENSE_BUILD/estratti:\n   «DOMANDE ECONOMIA AZIENDALE CON RISPOSTE» (esercizi) e «GLOSSARIO PAROLE CHIAVE» (flashcard standard).\n   Il capitolo (cap) è assegnato per parole chiave: da controllare a mano prima del lancio. Non modificare a mano: rigenerare. */\n"
js += "window.UL_STUDIO_EA = " + json.dumps({"esercizi": esercizi, "carte": carte}, ensure_ascii=False, indent=0) + ";\n"
open(out, "w", encoding="utf-8", newline="\n").write(js)
from collections import Counter
print("esercizi", len(esercizi), dict(sorted(Counter(e["cap"] for e in esercizi).items())))
print("carte", len(carte), dict(sorted(Counter(e["cap"] for e in carte).items())))
print(carte[1]); print(carte[-1])
