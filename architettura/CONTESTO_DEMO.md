# UniLink · Contesto per modificare le demo (landing v3 + web app)

Versione compatta dei PDF (`UniLink_Architettura_Landing.pdf`, `UniLink_Architettura_WebApp.pdf`, `UniLink_Schede_Da_Decidere.pdf`), pensata per essere **allegata a una richiesta**: dice cosa è deciso, dove vive ogni cosa, quali regole non si rompono e come si risponde a una richiesta. Se qualcosa qui contraddice i PDF, vale il PDF (e questo file va aggiornato). **Dettaglio completo della landing: questo file + PDF landing. Dettaglio della web app: `demo-webapp/LEGGIMI.md` + PDF web app** (qui solo i punti di contatto).

## 1 · Dove sta cosa
| Cosa | Dove |
|---|---|
| Demo landing | `demo-landing/` → https://matteprune04.github.io/unilink-hq/demo-landing/ |
| Demo web app | `demo-webapp/` → https://matteprune04.github.io/unilink-hq/demo-webapp/ |
| Strumenti della landing | `demo-landing/tools.js` + `tools.css` (oggi solo landing; riusabili nella web app) |
| Backup e storico | Action `Backup demo`: a ogni push che tocca una demo crea ZIP, Release `landing-vN` / `webapp-vN` e una riga in `demos/registro.json`. **La nota della versione è l'oggetto dell'ultimo commit che tocca la cartella**: scrivilo come frase chiara |
| HQ | `index.html` (generato) + `_src/online.js` (sezione Laboratorio AI → DEMO: anteprima Desktop/Tablet/Telefono, download, storico) |
| PDF | `architettura/*.pdf`, sorgenti Typst in `architettura/landing/`, `architettura/webapp/` e `architettura/schede/` (quest'ultimo è generato: non si modifica a mano) |
| Schede «Da decidere» complete | `demo-landing/decidere-arch.js` (fonte unica) → demo (`decidere.html#L01`…), `architettura/schede/Lxx_*.md`, `architettura/UniLink_Schede_Da_Decidere.pdf`. Si rigenerano con `node _src/build_schede.js` |
| Commenti del team | `demo-landing/commenti.js/css/html` (salvati nel browser; si scaricano in PDF/Markdown/JSON) |
| Verifica prima del push | `node _src/verifica_landing.js` (errori, 404, scorrimento laterale, accessibilità con axe, 23 pagine × 3 formati) |
| Schermate reali della web app | `demo-landing/img/app/` (51 WebP). Si rifanno con `node _src/screenshot_webapp.js` + `python _src/png_to_webp.py` |

## 2 · Regole che non si rompono
1. **Deciso / da decidere.** Ciò che è deciso appare come sarà davvero. Ciò che non lo è vive solo nella sezione arancio «Da decidere» (landing: card `L01…`, web app: card `D01…`), con bordo tratteggiato e etichetta. Una card esce solo quando è decisa (quattro domande: esiste davvero? per chi? cosa togliamo? come misuriamo?).
2. **Nella landing, nessun link al sito attuale (unilinkfirenze.it).** Gli strumenti stanno dentro la demo; le dispense stanno nell'area personale (la landing ne mostra solo l'anteprima: il carosello apre `../demo-webapp/#/materiali?q=…`). **L'area personale si mostra con schermate reali (immagini, solo da guardare), non con un riquadro vivo.**
3. **Mai dati inventati come veri.** Numeri solo da fonte (Google Analytics 4: 876 persone nell'ultimo mese, 7.855 pagine in 28 giorni, 34 esami). Testi, date, prezzi, regole di esempio: etichetta «Esempio». Niente testimonianze finte (card L09).
4. **Tutto da dati.** Landing: `demo-landing/config.js` (`UL_CFG`) e `tools.js`. Web app: `demo-webapp/config.js`. Cambiare un contenuto = una riga, non il design.
5. **Grafica.** Solo Croogla 4F (un peso). Token: navy `#172554`, crema `#f4f1ea`, arancio `#cf7527`, crema scuro `#ebe4d5`, arancio chiaro `#f6e4d1`, arancio scuro `#a95d1c` (testo arancio piccolo), navy testo 2 `#4b5675`, linea `#e2dccf`, navy chiaro `#dfe4f1`. **Una parola accento per titolo** (`*parola*` → arancio con sottolineatura a mano).
6. **Tre dispositivi**: desktop ≥ 1101 px · **tablet 701–1100 px** · telefono ≤ 700 px (si disegna prima a 390 px). Da tablet in giù il menu della landing è a tutto schermo. *La web app ha oggi breakpoint a 1100 e 860 px: un tablet in verticale riceve il layout del telefono (da allineare).*
7. **Anti-sovraccarico.** Landing: massimo sei voci in barra + la pillola «Da decidere» + «Area personale». Web app: vedi il suo LEGGIMI (menu per area × percorso × piano).
8. **Lingua.** Italiano, tu al singolo, frasi brevi, diciamo cosa c'è, cosa arriva e cosa no.
9. **Prima di ogni push** che tocca `demo-landing/`: `node _src/verifica_landing.js` deve scrivere «tutto ok». Accessibilità: contrasto minimo 4,5:1 sul testo piccolo (usare le varianti `--arancio-bt` per i fondi con testo bianco, `--arancio-t` per le parole accento, `--ar3` per le etichette; l'arancio del brand `#cf7527` solo per elementi decorativi), tutto raggiungibile da tastiera, un solo `h1` per pagina, titoli in ordine.

## 3 · Landing v2 (`demo-landing/`)
Navbar: **Hub ▾ · Prima ▾ · Durante ▾ · Dopo ▾ · Strumenti · Community** + pillola arancio **Da decidere** + pulsante **Area personale**. Tutto (nav, footer, versione) viene da `UL_CFG` e `app.js`.

| Codice | Pagina | File |
|---|---|---|
| S01 | Home (sezioni H02 hero · H03 numeri · H04 hub · H05 parti da dove sei · H06 catalogo · H06b area personale · H07 come funziona · H08 strumenti · H09 chi c'è dietro · H11 FAQ · H12 finale) | `index.html` |
| S02 / S03 / S04 | Hub Economia (attivo) / Giurisprudenza / Medicina (in arrivo, lista d'attesa) | `hub-*.html` |
| S05 / S06 / S07 | Prima / Durante / Dopo | `prima.html`, `durante.html`, `dopo.html` |
| S08 | Tesi e laurea (checklist 6 passi che si ricorda) | `tesi.html` |
| S09 | Strumenti (tab per hub + pannello funzionante) | `tools.html` |
| S10 | Area personale: galleria di 17 schermate reali della web app in 3 formati, solo da guardare (`area.html?dev=tab#futuro-career`) | `area.html` |
| S11 | Community (gruppi WhatsApp per anno, ambassador) | `community.html` |
| S12 | Prezzi (di esempio, **fuori dalla navbar**, letto da `UL_CFG.prezzi`) | `prezzi.html` |
| S13 | Commenti del team (rapporto, esportazione) | `commenti.html` |
| S90 | Da decidere (indice + scheda completa `#L01`…`#L09`) | `decidere.html` |

`UL_CFG`: `versione` · `commenti` (`attivi`: true in demo, false in produzione) · `app` (percorso della web app) · `numeri` · `schermate` (gruppi e elenco delle 17 schermate reali) · `hub` (stato `attivo`/`in_arrivo`) · `fasi` (voci dei dropdown) · `prezzi` (listino + FAQ) · `decidere` (riassunto delle card L01–L09).
Card landing: L01 Gruppi di studio · L02 Metodo e piano · L03 Mentoring tra pari · L04 Test d'ingresso (TOLC) · L05 Borse e tasse · L06 Carriera e CV · L07 Listino e pacchetti · L08 Quale hub parte per primo · L09 Voci degli studenti. Ogni card ha un campo `consiglio` (parere di Claude, da discutere) e `area` (card Dxx corrispondente).
Blocchi delle card: `hero, cards, steps, list, stats, chips, nota, piano, prezzi, appshot` (`BLOCCHI` in `app.js`, riassunto) e, per le pagine intere delle schede, `hero, testo, cards, steps, list, stats, faq, form, cta, profile, table, chips, cerca, tool, appshot, prezzi` (`MK`). `appshot` = schermata reale della web app (id da `UL_CFG.schermate`).
Componenti: `LP/Navbar, Hero, Sticker, CardHub, Livello+Risposta, CardDispensa, Card(.cd), Strumento, Dispositivo, Checklist, Fase, Finale, CardDecidere, Schermo, Bottone, Badge, Footer`.

## 4 · Web app (`demo-webapp/`): punti di contatto
La web app è mantenuta a parte (vedi `demo-webapp/LEGGIMI.md` e il PDF della web app). Modello: **tre livelli indipendenti** — *area di studio* (Economia attiva · Giurisprudenza e Medicina in arrivo · altre), *percorso* (**Test Prep · Studio · Futuro**), *piano* (Gratuito · Appunti · Dispensa · Semestre · Plus; prezzi = ipotesi). Si entra da un account demo (Giulia, Marco, Sara, Luca, Elena, Pietro) o dal primo accesso in 7 passi. Pagine: `oggi, piano, esami, materiali, pratica, libretto, test, allenamento, errori, orientamento, magistrali, erasmus, career, salvati, abbonamento, profilo` + `decidere` (card D01–D12) e `configurazione`.
Cosa usa la landing: le *schermate* (immagini rifatte con `_src/screenshot_webapp.js`, che entra con gli account Giulia, Pietro, Luca ed Elena) e i link `#/materiali?q=<nome esame>` (carosello), `#/erasmus`, `#/career`, `#/decidere/D09 · D10 · D11 · D12` (strumenti «solo area» e card `area` di `UL_CFG.decidere`). **Se una rotta, un account o la grafica della web app cambia: rifare le schermate e controllare questi link (`href` in `tools.js`, campo `area` delle card).**
Differenze di nome da allineare: landing *Prima · Durante · Dopo* e *hub* ↔ web app *Test Prep · Studio · Futuro* e *area*.

## 5 · Strumenti (`tools.js`)
`UL_TOOLS`: id, nome, desc, `hub` (`["tutti"]` o slug), `stato` (`live` = regole certe · `demo` = regole di ESEMPIO da verificare), `dove` (`landing` rapido / `area` completo), icona. Funzione omonima in `IMPL`. `UL_TOOLS_AREA` = voci «solo area» (bloccate in landing, rimandano alle card).
Oggi: `voto` (Economia, regole v5) · `media` (tutti, esatto) · `piano` (tutti) · `erasmus` (demo) · `voto-lmg` (Giurisprudenza, demo) · `filtro` (Medicina, demo). Solo area (rimandano a pagine/card della web app tramite `href`): Erasmus completo, Confronto CV, Template tesi (D11), Borse (D10).
**Aggiungere uno strumento** = voce in `UL_TOOLS` + funzione in `IMPL`. Non pubblicare come «vero» uno strumento `demo` finché le regole non sono verificate sul regolamento ufficiale.

## 6 · Come si risponde a una richiesta
| Tipo | Esempio | Cosa si fa |
|---|---|---|
| A · Nuova idea | «Nuova idea: …» | Nuova card (L10 / D15) in Da decidere con: problema, proposta, dove vivrebbe, consiglio, mini demo, cosa serve, domande, origine, storico. Nessuna pagina decisa cambia |
| B · Modifica card | «In L02 aggiungi…» | Aggiorna mini demo e storico della card |
| C · Promuovi | «L02 è decisa» | Applica le quattro domande, porta la card nella pagina/voce, aggiorna menu, PDF e storico; la card esce da Da decidere |
| D · Pagina decisa | «In S06 metti…» | Modifica la pagina; se cambia struttura aggiorna il PDF |
| E · Grafica | «LP/CardDispensa più grande su tablet» | Modifica il componente nel CSS (vale ovunque) |
| F · Hub | «Accendi Giurisprudenza» | `stato: "attivo"` nella config + materiali collegati |
| G · Strumento | «Aggiungi uno strumento…» | Vedi §5 |
| H · Listino | «Il semestre costa € 27,99» | Solo `UL_CFG.prezzi` |
| M · Commenti | «Applica i commenti aperti» (con il PDF/Markdown scaricato dai commenti) | Per ogni commento aperto: modifica minima (tipo D/E) e file toccati; applica quelli chiari, chiede degli altri; i risolti sono storico |
| I · Ripristina | «Riporta la landing alla v2» | Cartella al tag `landing-v2`, push, nuova versione |
| L · Rimuovi | «Togli L04» | La card esce; resta nel registro |
Se è ambiguo: «la metto in Da decidere (A) o già nelle pagine (C)?». **Senza decisione, un'idea va in Da decidere.**

**Dopo ogni modifica**: aggiorna `UL_CFG.versione` (landing) o `UL_VERSIONE` (web app); se cambia l'architettura, ricompila il PDF; commit con una frase chiara (diventa la nota nello storico).
- Compilare i PDF (dalla radice del repo): `python -c "import typst; typst.compile('architettura/landing/architettura.typ', output='architettura/UniLink_Architettura_Landing.pdf', root='.', font_paths=['.'])"` (idem per `webapp/architettura.typ` → `UniLink_Architettura_WebApp.pdf`). Richiede `pip install typst`.
- Le immagini dei PDF (`architettura/*/img/`) e le anteprime `demo-landing/img/area-*.jpg` sono screenshot delle demo: si rigenerano con le demo in esecuzione.

## 7 · Roadmap (sintesi; dettagli nei PDF, cap. 14 landing / cap. 15 web app)
- **Breve (ott–nov 2026)**: approvare la v2 e le prime card (L02, L01, L08), allineare i nomi tra landing e web app · landing su Framer (home, hub, Prima/Durante/Dopo, Strumenti, Community) · lista d'attesa unica (form → Supabase) · pagine legali e consenso cookie GA4 · strumenti con regole certe online · foto vere · MVP area personale.
- **Medio (dic 2026–apr 2027)**: metodo e piano (L02/D04) · gruppi di studio minimi (L01) · primo nuovo hub (L08/D01–D02) · listino e pagamenti (L07/D05+D06) · esercitazioni (D03) · strumenti verificati per hub (L08) · prova manuale mentoring (L03).
- **Lungo (da mag 2027)**: Medicina 2027/28 (D02) · più atenei · Career completa (L06/D09) · piano adattivo con AI · community e mentoring stabili · Test Prep/TOLC (L04/D12) solo se ha ancora senso.

## 8 · Limiti noti della demo
- Il carosello della home apre `../demo-webapp/`: un ZIP della sola landing non lo trova. Porta alla schermata di accesso (poi si sceglie un account demo): la web app non conserva il link profondo dopo il login. La galleria dell'area (S10) è fatta di immagini: funziona anche da sola.
- I commenti sono salvati nel browser di chi li scrive e non sono condivisi in tempo reale: per unirli si esporta il JSON e lo si importa. Per condividerli davvero serve una tabella Supabase (1–2 giorni).
- Le stime e le soglie nelle schede «Da decidere» sono ipotesi; le note legali indicano cosa far verificare a un consulente, non sono pareri.
- Lista d'attesa, newsletter, acquisti: simulati (solo nel browser).
- Mancano privacy/cookie/termini, foto proprie, 404, SEO per pagina, backend della lista d'attesa (PDF landing, cap. 15).
- GitHub non dice chi ha scaricato uno ZIP: lo storico mostra chi ha *modificato* la demo; ogni release ha solo un contatore di download.

## 9 · Commenti e schede (come si usano)
- **Commentare**: pulsante «Commenti» in basso a destra → «Commenta una sezione» (tocca la parte) o «Tutta la pagina». Ogni commento salva pagina, codice e titolo della sezione, estratto del testo, categoria, autore, data, stato, dispositivo e versione. Si scarica in **PDF, Markdown o JSON** (il JSON si reimporta e unisce i commenti di più persone senza duplicati).
- **Scheda «Da decidere» completa**: in `decidere.html#Lxx` ci sono pagine annotate, dati, regole, stati, testi, misure, integrazioni, manutenzione, piano di lavoro con stime, rischi, successo e un **prompt già pronto** (pulsante «Copia il prompt»). «Scarica la scheda (.md)» la esporta.
- **Per far costruire una scheda**: allega `CONTESTO_DEMO.md` e il prompt copiato dalla scheda (richiesta di tipo C).
