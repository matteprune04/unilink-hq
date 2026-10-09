# -*- coding: utf-8 -*-
"""Genera la «Linea guida UniLink» (manuale unico, senza data) in due formati dalla stessa sorgente:
   architettura/LINEA_GUIDA_UNILINK.md          (da allegare come contesto a una richiesta)
   architettura/linea-guida/linea-guida.typ     (sorgente del PDF)
   architettura/UniLink_Linea_Guida.pdf         (compilato con Typst)

Uso, dalla radice del repository:
   python _src/linea_guida/build_linea_guida.py      # legge i dati vivi delle due demo (node dump_demo.js) e genera MD, Typst e PDF   (pip install typst)

Regole di scrittura (le stesse del manuale):
 1. Esplicito > deduzione: si riporta ciò che il report o le demo dicono; dove manca, lo si dichiara.
 2. Dove report e demo attuali sono discordanti NON si sceglie: si riportano entrambe le versioni (parte 6).
 3. Solo aggiunte: nulla di ciò che esiste viene tolto o riscritto per forza di sintesi.
Per aggiornare il manuale dopo una modifica alle demo: rigenerare il JSON e rilanciare questo script; i testi scritti a mano
sono nelle funzioni parte_*() qui sotto.
"""
import json
import os
import subprocess
import sys

QUI = os.path.dirname(os.path.abspath(__file__))
RADICE = os.path.abspath(os.path.join(QUI, "..", ".."))
sys.path.insert(0, QUI)
import report_topics as R  # noqa: E402  (contenuto del report, diviso per argomento)

JSON_DEMO = os.path.join(QUI, "dati_demo.json")  # file derivato: si rigenera a ogni esecuzione (non va committato)
with open(JSON_DEMO, "w", encoding="utf-8") as f:
    f.write(subprocess.run(["node", os.path.join(QUI, "dump_demo.js")], capture_output=True, text=True, check=True).stdout)
D = json.load(open(JSON_DEMO, encoding="utf-8"))
LD, WD = D["landing"], D["webapp"]
LID, AID = R.LID, R.AID

# ============================================================================================ modello del documento
DOC = []


def H1(t, sotto="", num=True): DOC.append(("h1", t, sotto, num))
def H2(t): DOC.append(("h2", t))
def H3(t): DOC.append(("h3", t))
def P(t): DOC.append(("p", t))
def UL(l): DOC.append(("ul", list(l)))
def OL(l): DOC.append(("ol", list(l)))
def CALL(t): DOC.append(("call", t))
def TB(cols, rows, w=None): DOC.append(("tb", list(cols), [list(map(str, r)) for r in rows], w))


def blocchi(blocks):
    """Trasforma i blocchi delle card (cards, list, steps, nota, stats, chips) in elementi del manuale."""
    for b in blocks:
        t = b["t"]
        if b.get("titolo"):
            H3(b["titolo"])
        if t == "cards":
            TB(["Voce", "Testo"], b["items"], ["24%", "76%"])
        elif t == "list":
            TB(["Voce", "Descrizione", "Valore"], b["items"], ["24%", "56%", "20%"])
        elif t == "steps":
            OL([" · ".join(x[1:]) if isinstance(x, list) and len(x) > 1 else str(x) for x in b["items"]])
        elif t == "nota":
            CALL(b["testo"])
        elif t == "stats":
            TB(["Numero", "Cosa"], b["items"], ["22%", "78%"])
        elif t == "chips":
            UL(b["items"])


def card(key):
    out = []
    if key in LID: out.append(f"landing {LID[key]}")
    if key in AID: out.append(f"web app {AID[key]}")
    return " · ".join(out)


# ============================================================================================ PARTE 0 · come si usa
def parte_0():
    H1("Come si usa questa linea guida", "prima di tutto: i termini e le regole di lettura", num=False)
    P("Questa linea guida è il manuale unico di UniLink: tiene insieme la landing, la web app e tutto ciò che il report «Dalla vetrina alla piattaforma» aveva già raccolto, in un documento senza data che si aggiorna invece di sostituirsi. Serve a tre cose: capire com'è UniLink oggi, sapere cosa è stato proposto e non ancora deciso, e dare a chi lavora (persone o AI) il contesto per fare modifiche senza rompere ciò che va bene.")
    H2("I termini")
    TB(["Termine", "Cosa significa qui"], [
        ["Demo v1", "La demo descritta dal report del 4 ottobre 2026 (cartella 06_Demo_UniLink): landing generale con 10 scuole, hub di Economia, web app con filigrana, simulatore, piano di studio, Career, inviti e pannello del team."],
        ["Demo v2", "Le versioni attuali di landing e web app, pubblicate nel repository matteprune04/unilink-hq. Nel registro dell'HQ si chiamano landing-v3 e webapp-v3 (numeri delle release); in questo manuale sono insieme «la demo v2»."],
        ["Report", "Il documento «Dalla vetrina alla piattaforma» (demo v1). Il suo contenuto è integrato qui (parte 5) e nelle card «Report · …» dei due registri."],
        ["Card Lxx / Dxx", "Una idea ancora da decidere: Lxx nella sezione «Da decidere» della landing, Dxx in quella della web app. Il codice non cambia mai."],
        ["Deciso / da decidere", "Ciò che è deciso appare nelle pagine come sarà davvero. Ciò che non lo è vive solo nelle card «Da decidere», con bordo tratteggiato."],
        ["Ipotesi", "Numero o regola non validati: prezzi, soglie, stime. Vanno sempre etichettati come tali."],
    ], ["22%", "78%"])
    H2("Regole di lettura e di modifica")
    OL([
        "Esplicito vale più di una deduzione. Se una cosa non è scritta nel report o non c'è nelle demo, qui lo si dice invece di immaginarla.",
        "Dove report e demo v2 dicono cose diverse non si sceglie: la parte 6 riporta entrambe le versioni affiancate, con la dicitura «non risolta, da decidere». Nessuna discordanza è stata corretta in silenzio.",
        "Solo aggiunte: il contenuto esistente (card, pagine, testi) non viene tolto né riscritto per forza di sintesi. Una modifica a ciò che esiste si fa solo dopo un consenso esplicito.",
        "Il design non si tocca quando si cambia un contenuto: i contenuti stanno in file di configurazione e nei registri, non nel CSS.",
        "Nulla di inventato presentato come vero: niente numeri, prezzi, testimonianze o regole senza fonte. Gli esempi si etichettano «Esempio».",
    ])
    H2("Come è organizzato")
    TB(["Parte", "Contenuto"], [
        ["1 · UniLink in breve", "Cos'è, a chi serve, principi, le tre parti della piattaforma."],
        ["2 · Mappa", "Dove vive cosa (repository, demo, HQ, backup) e cosa c'è in demo v1 e demo v2."],
        ["3 · La landing", "Pagine, navigazione, hub, fasi, strumenti, area personale in schermate, card, regole di grafica."],
        ["4 · La web app", "Mappa, accesso e primo accesso, tipologie di account, sezioni decise, moduli da decidere, file."],
        ["5 · Prodotto e business", "Tutti gli argomenti del report, uno per uno: proposta, alternative, cosa serve, cosa decidere, cosa c'è oggi nelle demo."],
        ["6 · Discordanze", "Dove report e demo v2 dicono cose diverse. Non risolte."],
        ["7 · Registro unico", "Tutte le card Lxx e Dxx, con i rimandi tra landing e web app."],
        ["8 · Decisioni aperte", "Le domande da chiudere, nell'ordine in cui conviene farlo."],
        ["9 · Manutenzione", "Come chiedere modifiche, come si salva e si verifica, limiti noti, percorso verso la versione vera."],
        ["10 · Glossario e fonti", "Termini, versioni e fonti."],
    ], ["26%", "74%"])


# ============================================================================================ PARTE 1 · UniLink in breve
def parte_1():
    H1("UniLink in breve", "cos'è, per chi, con quali principi")
    P("UniLink è «da studenti, per studenti»: appunti, mappe, quiz e strumenti per gli esami di Economia all'Università di Firenze (EA ed EC), con l'ambizione di diventare una piattaforma per tutto il percorso: scegliere il corso, studiare, andare in Erasmus, laurearsi, scegliere la magistrale e il lavoro. Oggi il sito pubblico è unilinkfirenze.it, fatto con Framer; il gruppo WhatsApp è il canale principale.")
    H2("I numeri che si possono citare")
    TB(["Numero", "Fonte e data"], [
        [f"{LD['numeri']['utenti']} persone, {LD['numeri']['pagine']} pagine viste, {LD['numeri']['esami']} esami", f"Landing demo v2: {LD['numeri']['fonte']}"],
        ["856 utenti, 7.549 visualizzazioni in 28 giorni; 102 clic da Google in 28 giorni (17 il mese prima); 18 pagine indicizzate su 50; 78 studenti registrati", "Report (demo v1): Google Analytics e file di contesto, al 4 ottobre 2026"],
    ], ["58%", "42%"])
    CALL("I due gruppi di numeri sono scatti diversi nel tempo, non una discordanza. I contatori «200+ studenti» e «95% soddisfatti» del sito di oggi non sono dimostrabili (nell'HQ risultano 78 iscritti): non vanno usati.")
    H2("Le tre parti della piattaforma")
    TB(["Parte", "Cosa è", "Dove vive"], [
        ["Landing pubblica", "Ciò che resterebbe su Framer: orienta, spiega, fa provare gli strumenti e porta all'area personale. Si vede senza account.", "Demo: demo-landing/ · Produzione: Framer, unilinkfirenze.it"],
        ["Web app (area personale)", "Il posto dove si studia: dispense, esami, esercitazioni, percorso dopo gli esami, abbonamento, profilo.", "Demo: demo-webapp/ · Produzione (proposta): app.unilinkfirenze.it"],
        ["Pannello del team", "Dove i founder guardano numeri e materiale: metriche, controllo del materiale, domanda, ambassador, vendite.", "Nella demo v2: solo «Metriche» per l'admin; il pannello completo del report è una proposta (card della parte 5)"],
    ], ["22%", "46%", "32%"])
    H2("Chi c'è dietro")
    P("Quattro founder, tutti con accesso a tutto: Matteo (sito, prodotto e strumenti; di solito Framer), Cosimo (strategia e nuovi hub), Niccolò (dispense e materiali), Gianmarco (community e ambassador). Le ripartizioni sono quelle scritte nella landing demo v2.")
    H2("Principi che non si rompono")
    OL([
        "Deciso / da decidere: ciò che è deciso appare come sarà davvero; il resto vive solo nella sezione arancio «Da decidere». Una card esce solo quando è decisa, rispondendo a quattro domande: esiste davvero? per chi? cosa togliamo? come misuriamo?",
        "Nella landing nessun link al sito attuale: gli strumenti stanno dentro la demo e le dispense nell'area personale.",
        "Mai dati inventati come veri. Numeri solo da fonte; esempi etichettati; nessuna testimonianza finta (card L09).",
        "Tutto da dati: cambiare un contenuto è cambiare una riga di configurazione, non il design.",
        "Grafica: solo Croogla 4F, un peso. Colori: navy #172554, crema #f4f1ea, arancio #cf7527 (con le varianti scure per il testo piccolo). Una parola accento per titolo.",
        "Tre dispositivi: desktop da 1101 px, tablet 701–1100 px, telefono fino a 700 px (si disegna prima a 390 px).",
        "Anti-sovraccarico: nella landing al massimo sei voci in barra, più la pillola «Da decidere» e «Area personale».",
        "Lingua: italiano, «tu» al singolo, frasi brevi, si dice cosa c'è, cosa arriva e cosa no.",
        "Accessibilità: contrasto almeno 4,5:1 sul testo piccolo, tutto raggiungibile da tastiera, un solo h1 per pagina, titoli in ordine.",
    ])
    H2("Posizionamento")
    P("Il report propone: «Da studenti per studenti, gli appunti da 30 e lode e un piano per arrivarci». Onesto, mai aziendale, con una promessa più concreta: non solo materiale, anche metodo. La landing demo v2 apre invece con «Studia, orientati, scegli.». Le due formulazioni coesistono nei documenti: vedi la discordanza 12 nella parte 6.")


# ============================================================================================ PARTE 2 · mappa
def parte_2():
    H1("Mappa: dove vive cosa", "repository, demo, HQ, backup")
    TB(["Cosa", "Dove"], [
        ["Repository", "github.com/matteprune04/unilink-hq"],
        ["Demo landing", "demo-landing/ → matteprune04.github.io/unilink-hq/demo-landing/"],
        ["Demo web app", "demo-webapp/ → matteprune04.github.io/unilink-hq/demo-webapp/"],
        ["HQ", "index.html (generato) e _src/online.js: sezione Laboratorio AI → DEMO, con le due demo incorporate, anteprima Desktop/Tablet/Telefono, «Scarica l'ultima versione» e storico."],
        ["Backup e storico", "Action «Backup demo»: a ogni push che tocca una demo crea lo ZIP, una Release (landing-vN, webapp-vN) e una riga in demos/registro.json. La nota della versione è l'oggetto dell'ultimo commit che tocca la cartella: va scritto come frase chiara."],
        ["Documenti", "architettura/: PDF di architettura della landing e della web app, PDF delle schede «Da decidere», CONTESTO_DEMO.md (contesto compatto) e questa linea guida."],
        ["Strumenti di verifica", "_src/verifica_landing.js (errori, file mancanti, scorrimento laterale, accessibilità su 3 formati), _src/build_schede.js, _src/screenshot_webapp.js."],
    ], ["22%", "78%"])
    H2("Demo v1 e demo v2: cosa c'era e cosa c'è")
    TB(["Area", "Demo v1 (report)", "Demo v2 (attuale)"], [
        ["Struttura", "Landing generale UniLink per tutta l'Università di Firenze + hub di Economia + pagine delle altre scuole «in arrivo» + web app + pannello del team.", "Landing con hub (Economia attivo, Giurisprudenza e Medicina in arrivo) e fasi Prima/Durante/Dopo; web app con Studio, Dopo gli esami, Account e sezione Da decidere; pannello «Metriche» per l'admin."],
        ["Accesso", "Email @stud.unifi.it con link via email, niente password.", "Web app: accesso con email e password, accesso rapido con account demo, primo accesso in 6 passi, «Visualizza come». Landing: nessun accesso."],
        ["Dispense", "PDF privati con filigrana personale, marcatura invisibile, link temporanei.", "Catalogo, anteprima e «Apri dispensa» che apre il PDF; il lettore protetto è una proposta (D23)."],
        ["Studio", "Simulatore d'esame (114 domande vere) e piano di studio a sessioni con calendario e ottimizzatore.", "Esercitazioni con quiz di prova, quiz rapido, ripasso errori e simulazione (15 domande di esempio per 3 esami); nella landing lo strumento «Piano per l'appello»."],
        ["Percorso", "Libretto con gauge, scenari, grafico dei voti, bonus; Career con CV benchmark.", "Il mio percorso: media e voto di laurea con scenari, Erasmus, magistrali, mentor; Career come modulo da decidere."],
        ["Prezzi", "Appunti 4,99 · Completa 12,99 · Semestre 29,99 · Anno 49,99 · Plus 14,99 una tantum · tutoring 20 €/ora.", "Landing: pagina Prezzi di esempio fuori dalla barra. Web app: Gratuito, Pacchetto esame, Pacchetto semestre, Plus (ipotesi)."],
        ["Community", "Referral con codice fisso, programma ambassador con dashboard.", "Landing: Community con gruppi WhatsApp e ambassador. Web app: nessun referral deciso."],
        ["Misure", "Piano di tracciamento (GTM, Cookie Banner, ?from=) e pannello del team a sette schede.", "Nessun tracciamento a eventi; commenti del team sulle demo; pannello «Metriche» dell'admin con dati di esempio."],
        ["Idee", "Decisioni per la call (16 voci).", "Sezioni «Da decidere»: 26 card nella landing, 44 proposte nella web app."],
    ], ["14%", "43%", "43%"])


# ============================================================================================ PARTE 3 · landing
def parte_3():
    H1("La landing (demo v2)", "pagine, navigazione, hub, strumenti, card")
    P("Navigazione: Hub ▾ · Prima ▾ · Durante ▾ · Dopo ▾ · Strumenti · Community, più la pillola arancio «Da decidere» e il pulsante «Area personale». Nav, footer e versione vengono dalla configurazione (UL_CFG) e da app.js. Da tablet in giù il menu è a tutto schermo.")
    H2("Le pagine")
    TB(["Codice", "Pagina", "File"], [
        ["S01", "Home: hero, numeri reali, hub, «parti da dove sei», catalogo, area personale in anteprima, come funziona, strumenti, chi c'è dietro, FAQ, finale", "index.html"],
        ["S02 · S03 · S04", "Hub Economia (attivo) · Giurisprudenza · Medicina (in arrivo, con lista d'attesa)", "hub-*.html"],
        ["S05 · S06 · S07", "Prima · Durante · Dopo", "prima.html, durante.html, dopo.html"],
        ["S08", "Tesi e laurea (checklist in 6 passi che si ricorda)", "tesi.html"],
        ["S09", "Strumenti (una scheda per hub e il pannello funzionante)", "tools.html"],
        ["S10", f"Area personale: galleria di {LD['nSchermate']} schermate reali della web app in 3 formati, solo da guardare", "area.html"],
        ["S11", "Community (gruppi WhatsApp per anno, ambassador)", "community.html"],
        ["S12", "Prezzi (di esempio, fuori dalla barra di navigazione)", "prezzi.html"],
        ["S13", "Commenti del team (rapporto ed esportazione)", "commenti.html"],
        ["S90", f"Da decidere: indice e schede ({len(LD['decidere'])} card L01…)", "decidere.html"],
    ], ["16%", "62%", "22%"])
    H2("Hub")
    TB(["Hub", "Stato", "Descrizione nella landing"], [[h["nome"], "attivo" if h["stato"] == "attivo" else "in arrivo", h["desc"]] for h in LD["hub"]], ["20%", "14%", "66%"])
    P("Un hub passa da «in arrivo» ad «attivo» cambiando una riga della configurazione e collegando i materiali. Il report propone 10 scuole invece di 3 (discordanza 6).")
    H2("Le fasi")
    TB(["Fase", "Voci"], [[f["titolo"], " · ".join(v[0] for v in f["voci"])] for f in LD["fasi"]], ["28%", "72%"])
    H2("Strumenti")
    TB(["Strumento", "Per", "Stato", "Descrizione"], [[t["nome"], ", ".join(t["hub"]), "regole certe" if t["stato"] == "live" else "esempio, regole da verificare", t["desc"]] for t in LD["tools"]], ["22%", "14%", "20%", "44%"])
    P("Aggiungere uno strumento è una voce in UL_TOOLS e una funzione in IMPL (tools.js). Uno strumento di stato «esempio» non si pubblica come vero finché le regole non sono verificate sul regolamento ufficiale. Le voci «solo area personale» sono bloccate nella landing e rimandano alla web app: " + ", ".join(f"{t['nome']} ({t['href']})" for t in LD["toolsArea"]) + ".")
    H2("Area personale in schermate reali")
    P("L'area personale si mostra con immagini scattate dalla web app vera (non con un riquadro vivo e non navigabile): nessun dato si modifica e la pagina funziona anche da sola. I gruppi sono: " + "; ".join(f"{g['nome']} ({g['n']})" for g in LD["schermate"]) + ". Le immagini sono in demo-landing/img/app/ (3 file per schermata: -desk, -tab, -ph) e si rifanno con _src/screenshot_webapp.js e _src/png_to_webp.py quando la web app cambia.")
    H2("Prezzi (pagina di esempio)")
    P("La pagina Prezzi legge il listino da UL_CFG.prezzi: quando il listino è deciso si cambiano i numeri lì e la pagina si ridisegna. Oggi mostra, per esame: " + "; ".join(f"{p['nome']} {p['prezzo']}" for p in LD["prezzi"]["modi"]["esame"]["piani"]) + "; per semestre: " + "; ".join(f"{p['nome']} {p['prezzo']}" for p in LD["prezzi"]["modi"]["semestre"]["piani"]) + ". Sono prezzi di esempio dalle ipotesi del 4 ottobre.")
    H2("Commenti del team e schede")
    UL([
        "Pulsante «Commenti» in basso a destra: si commenta una sezione (tocca la parte) o tutta la pagina. Ogni commento salva pagina, codice e titolo della sezione, estratto del testo, categoria, autore, data, stato, dispositivo e versione.",
        "Esportazione in PDF, Markdown o JSON (il JSON si reimporta e unisce i commenti di più persone senza duplicati). I commenti stanno nel browser di chi li scrive: per condividerli in tempo reale serve una tabella Supabase.",
        "Le 9 schede L01–L09 hanno l'architettura completa (pagine annotate, dati, regole, stati, testi, misure, integrazioni, manutenzione, piano di lavoro con stime, rischi, successo, prompt per l'AI); sono nel PDF «Schede Da decidere». Le card L10–L26 nascono dal report e non hanno ancora l'architettura completa.",
    ])
    H2("Dati e file")
    TB(["Cosa vuoi cambiare", "Dove"], [
        ["Contenuti (hub, fasi, numeri, prezzi, schermate, riassunto delle card)", "demo-landing/config.js → UL_CFG"],
        ["Architettura completa delle card L01–L09", "demo-landing/decidere-arch.js → UL_ARCH (poi node _src/build_schede.js)"],
        ["Strumenti", "demo-landing/tools.js e tools.css"],
        ["Logica e componenti", "demo-landing/app.js"],
        ["Grafica", "demo-landing/ul.css (non toccare per cambiare un contenuto)"],
        ["Commenti", "demo-landing/commenti.js e commenti.css (si spengono con UL_CFG.commenti.attivi = false)"],
    ], ["46%", "54%"])
    H2("Componenti")
    P("LP/Navbar, Hero, Sticker, CardHub, Livello+Risposta, CardDispensa, Card (.cd), Strumento, Dispositivo, Checklist, Fase, Finale, CardDecidere, Schermo, Bottone, Badge, Footer. Blocchi delle card: hero, cards, steps, list, stats, chips, nota, piano, prezzi, appshot.")


# ============================================================================================ PARTE 4 · web app
def parte_4():
    H1("La web app (demo v2)", "area personale: mappa, accesso, account demo, moduli")
    P("Il design è quello della «demo A» (Area personale e versioni B, C, D) usato senza modifiche: pillola navy in alto con cerchio arancio e iniziali, sidebar navy flottante, login diviso, Croogla e Instrument Sans. L'architettura è un mix: la parte decisa viene da A + B, le proposte da decidere sono i moduli completi di C (Career) e D (Network). Il modello «area di studio × percorso (Test Prep, Studio, Futuro) × piano» è stato scartato.")
    H2("La mappa")
    TB(["Gruppo della sidebar", "Voci", "Cosa contiene"], [
        ["Studio (deciso)", "Dashboard · I miei esami · Materiali · Esercitazioni", "«Cosa ti serve adesso?», esami con data e obiettivo, catalogo e pacchetti, quiz e ripasso errori. Materiali ed Esercitazioni mostrano «in arrivo» se l'area non è attiva."],
        ["Dopo gli esami (deciso)", "Il mio percorso", "Media e voto di laurea con scenari, Erasmus, magistrali, mentor."],
        ["Account (deciso)", "Abbonamento · Profilo e account", "Piano, upgrade, disdetta, ordini; area di studio, ateneo, corso, anno e colore del profilo."],
        ["Da decidere", "Tutte le proposte · Career (demo C) · Network (demo D) · Configurazione · Metriche (admin)", "Una voce per modulo; dentro, un sotto-menu e un banner tratteggiato «Da decidere · Dxx» che porta all'architettura."],
    ], ["22%", "30%", "48%"])
    H2("Tre regole che decidono cosa vede lo studente")
    UL([
        "Area di studio: " + "; ".join(f"{a['nome']} {a['stato'].replace('_', ' ')}" for a in WD["aree"]) + ". Se l'area è in arrivo, Dashboard, Materiali ed Esercitazioni mostrano la lista d'attesa; esami, libretto e profilo funzionano per tutti.",
        "Ateneo: la parte decisa copre UniFi. Chi sceglie un altro ateneo usa la app e vede un banner verso la proposta Network (D12).",
        "Piano: Gratuito, Pacchetto esame, Pacchetto semestre, Plus (si sommano). Plus è un solo campo (activity.plus) per tutta la app, anche per i moduli Career.",
    ])
    H2("Accesso e primo accesso")
    P("Accesso con email e password, oppure «Accesso rapido» con un account demo; «Crea un account gratuito» porta alla registrazione. Il primo accesso è in sei passi: area di studio · ateneo, corso e anno · da dove partire · dopo la laurea · ritmo e avvisi (consensi separati) · il tuo piano (Gratuito, Pacchetto semestre o Plus, con checkout simulato). Il piano si cambia sempre dopo: pagina Abbonamento, finestra «Sblocca» su ogni lucchetto, card in fondo alla sidebar. Le regole di sblocco stanno in un solo file (js/core.js).")
    H2("Tipologie demo e «Visualizza come»")
    TB(["Tipologia", "Descrizione"], [[d["label"], d["desc"]] for d in WD["demo"]], ["28%", "72%"])
    P("Il pulsante fisso «Visualizza come» cambia account senza uscire. Per aggiungere una tipologia: una riga in UL.DEMO e un utente in UL.SEED (js/seed.js) con la stessa email. Password demo degli studenti: UniLink2026!, admin: AdminDemo!2026 (account fittizi).")
    H2("Piani e prezzi nella demo v2")
    TB(["Piano", "Prezzo", "Cosa include"], [[p["nome"], f"{p['prezzo']} · {p['sub']}", "; ".join(p["incl"])] for p in WD["piani"]["lista"]], ["20%", "26%", "54%"])
    CALL("Sono ipotesi dell'HQ (dispensa 12–15 €, semestre 25–30 €, Plus da decidere), non i prezzi del report: vedi la discordanza 1 e 2 nella parte 6.")
    H2("Esercitazioni")
    P("Quiz di prova, quiz rapido, ripasso errori e simulazione dell'esame. Le domande sono scritte per la demo: 15 per ciascuno dei tre esami con banca (Microeconomia, Economia Aziendale, Statistica); il formato è quello di js/data-quiz.js.")
    H2("Pannello «Metriche» (admin)")
    P("Per il ruolo admin: incassi, ordini, funnel e un simulatore economico con acquirenti nel semestre, spesa media, compenso degli autori, revisione per esame, esami, piattaforma e marketing. I dati sono di esempio.")
    H2("Moduli da decidere: Career e Network")
    P("Sono i moduli completi delle demo C e D, funzionanti nella demo, in cartelle separate (js/da-decidere/career/ e js/da-decidere/network/): si attivano spostando la voce in js/boot.js e si tolgono senza rompere il resto. Career: punteggio e piano (D03), Studio con Plus (D04), Opportunità (D05), Profilo talento (D06), Track (D07), Mentor (D08), Eventi (D09), Plus e inviti (D10), Business cockpit (D11, admin). Network: più atenei (D12), dispense dalla community con crediti (D13), calcolatori e guide (D14), mercatino (D15), test d'ingresso e simulazioni (D16), ammissioni MSc (D17), Academy (D18), club ed eventi (D19), Pass e crediti (D20), La rete (D21, admin). Idee dell'HQ da costruire: raccolta domande d'esame (D22), lettore protetto (D23), borse di studio (D24), guida tesi (D25).")
    P("Come una proposta diventa decisa: si apre la scheda, si guarda il modulo, si discute; se decisa, si seguono i passi «Per attivarla» (la voce passa da UL.NAV.dd a UL.NAV.decise in js/boot.js); se scartata si tolgono voce, rotta e script, e la scheda resta nel registro con lo storico. In entrambi i casi si aggiunge una riga di storico.")
    H2("Dati e file")
    TB(["Cosa vuoi cambiare", "File"], [
        ["Prezzi e piani", "js/config.js → UL.PIANI (ipotesi)"],
        ["Modello dati (profilo, attività)", "js/config.js → UL.CONFIG.profileDefaults / activityDefaults"],
        ["Aree di studio, proposte da decidere", "js/unilink-dati.js → UL_AREE, UL_DA_DECIDERE"],
        ["Voci della sidebar e rotte", "js/boot.js → UL.NAV.decise, UL.NAV.dd, appRoutes"],
        ["Account demo / tipologie", "js/seed.js → UL.DEMO, UL.SEED"],
        ["Esami, dispense, domande", "js/data-dispense.js, js/data-quiz.js"],
        ["Regole di sblocco", "js/core.js → owns, ownsPractice, plus, planName"],
        ["Primo accesso, abbonamento, Da decidere, Visualizza come", "js/views/unilink.js"],
        ["Pagine della parte decisa", "js/views/area.js, scheda.js, pratica.js, percorso.js"],
        ["Commenti del team", "js/commenti.js"],
        ["Design", "css/style.css (demo A, non toccare) · css/unilink.css (aggiunte)"],
    ], ["40%", "60%"])
    CALL("Cose che la landing racconta e la web app non ha ancora: percorso Test Prep, calendario del piano di studio, template della tesi, borse, gruppi di studio. La web app non ha un layout tablet dedicato (un tablet in verticale riceve il layout del telefono).")


# ============================================================================================ PARTE 5 · prodotto e business
OGGI = {
    "vetrina": (["Home, hub, fasi Prima/Durante/Dopo, Strumenti, Community, Area personale in schermate, Prezzi fuori barra, Da decidere, Commenti."], ["Area personale (Studio, Dopo gli esami, Account), Da decidere, Metriche admin, Visualizza come, commenti del team."], []),
    "errori": (["La landing demo v2 non rimanda al sito attuale: gli errori elencati sono del sito di oggi (Framer) e non compaiono nella demo."], [], []),
    "hub10": (["Tre hub: Economia attivo; Giurisprudenza e Medicina in arrivo, con lista d'attesa e idea di costruirli con chi studia lì."], ["Aree di studio: Economia attiva, Giurisprudenza e Medicina in arrivo, «un'altra area» come proposta."], [6]),
    "economia": (["Hub Economia: catalogo di anteprime, strumenti di Economia e rimandi all'area personale; le card aprono il catalogo dell'area."], [], [13]),
    "catalogo": (["Carosello di dispense nell'hub Economia: ogni card apre il catalogo dell'area personale."], ["Materiali: I miei pacchetti · Catalogo · Pacchetti semestre; card con copertina, anteprima, prezzo e «Apri dispensa». Non ci sono l'anteprima con quarta pagina sfocata né «Chiedi questo esame»."], []),
    "aggiornamento": ([], ["Dashboard: riquadro «Aggiornamenti ai tuoi materiali». Non esistono il registro versioni per corso né «Nuova versione disponibile»."], []),
    "prezzi": (["Pagina Prezzi di esempio (fuori barra), letta da UL_CFG.prezzi."], ["UL.PIANI: Gratuito, Pacchetto esame, Pacchetto semestre, Plus (ipotesi HQ)."], [1, 2, 3, 4]),
    "plus": (["Nessuna pagina Plus; la card L07 cita «Plus mensile» come ipotesi."], ["Plus a 4,99 € al mese («prezzo da decidere»): esercitazioni complete, simulazioni a tempo e ripasso errori, sconto sui mentor, si disdice quando vuoi."], [2, 3]),
    "pagamenti": (["Nessun checkout."], ["Checkout simulato con coupon; nessun addebito reale."], []),
    "referral": (["Community: gruppi WhatsApp per anno e ambassador, senza codici."], ["Nessun referral nella parte decisa; D10 (Career) ha un codice invito con crediti, D19 un club con ambassador."], [10]),
    "susbus": ([], ["Il corso si sceglie nel primo accesso; le aree contengono solo EA ed EC. SUSBUS e SECI non ci sono."], []),
    "metriche": (["Nessun tracciamento a eventi; mancano privacy, cookie e termini."], ["Nessun tracciamento a eventi; commenti del team sulle demo."], [14]),
    "tool": (["Strumenti: " + ", ".join(t["nome"] for t in LD["tools"]) + "."], ["«Tools» nell'intestazione rimanda agli strumenti del sito."], []),
    "marketing": (["Nessuna parte di marketing nelle demo."], [], []),
    "rischi": (["Nessuna pagina legale; lista d'attesa e acquisti simulati."], ["Consensi separati nel primo accesso; nessuna pagina Termini/Privacy."], []),
    "online": (["Deploy: GitHub Pages con backup automatico."], ["Il PDF di architettura propone Next.js su Vercel + Supabase."], [11]),
    "decisioni": ([], [], []),
    "account": ([], ["Accesso con email e password, accesso rapido demo, registrazione, recupero password, primo accesso in 6 passi."], [5]),
    "pdf": ([], ["«Apri dispensa» apre il PDF direttamente, senza filigrana. Il lettore protetto è la proposta D23."], [7]),
    "simulatore": ([], ["Esercitazioni con quiz di esempio (15 domande × 3 esami), ripasso errori e simulazione."], [15]),
    "piano": (["Strumento «Piano per l'appello» con regole semplici; card L02 «Metodo e piano di studio»."], ["Nessun piano a sessioni nella parte decisa. D03 «Il mio piano» è il Career Score: stesso nome, altra cosa."], [9]),
    "career": (["Card L06 «Carriera e CV»; nessuno strumento CV."], ["Moduli Career D03–D11 funzionanti come proposte; non c'è il CV benchmark con 17 regole."], []),
    "libretto": (["Strumenti «Voto di laurea» e «Media e voto obiettivo»."], ["Il mio percorso → Media e voto di laurea: esami superati, media pesata, tre scenari (prudente, realistico, ambizioso) e bonus."], []),
    "pannello": ([], ["Metriche (admin): incassi, ordini, funnel, simulatore economico. Business cockpit (D11) e La rete (D21) come proposte."], [16]),
}


def parte_5():
    H1("Prodotto e business", "tutti gli argomenti del report, uno per uno")
    P("Ogni argomento ha la stessa forma: dove vive, la proposta del report (demo v1), le alternative scartate, cosa serve, cosa decidere e cosa c'è oggi nelle demo v2. Il contenuto del report è riportato così com'è: le cifre segnate come ipotesi vanno validate. Dove le demo v2 dicono altro, c'è il rimando alla parte 6.")
    for t in R.T:
        k = t["key"]
        H2(f"{t['titolo']}")
        riga = [["Report", f"sezione {t['sez']}"], ["Card", card(k)]]
        if t.get("dove_l"): riga.append(["Dove vive · landing", t["dove_l"]])
        if t.get("dove_a"): riga.append(["Dove vive · web app", t["dove_a"]])
        TB(["Riferimento", "Dettaglio"], riga, ["22%", "78%"])
        A = t.get("A", {})
        if t.get("proposta"):
            H3("Proposta del report (demo v1)")
            P(t["proposta"])
        elif A.get("cosa"):
            H3("Proposta del report (demo v1)")
            P(A["cosa"])
        if t.get("problema") and t.get("proposta"):
            P("Perché: " + t["problema"])
        if t.get("blocks"):
            blocchi(t["blocks"])
        elif A:
            if A.get("dati"):
                H3("Dati e regole del report")
                UL(A["dati"])
            if A.get("funzioni"):
                H3("Come funziona, perché, alternative scartate")
                UL(A["funzioni"])
        if t.get("consiglio"):
            H3("Alternative e parere del report")
            P(t["consiglio"])
        serve = t.get("serve") or A.get("dipendenze")
        if serve:
            H3("Cosa serve")
            UL(serve)
        call = t.get("call") or A.get("domande")
        if call:
            H3("Da decidere nella call")
            UL(call)
        l, a, disc = OGGI.get(k, ([], [], []))
        H3("Nelle demo v2 oggi")
        UL(([f"Landing: {x}" for x in l] + [f"Web app: {x}" for x in a]) or ["Non presente nelle demo v2: è una proposta del report."])
        if disc:
            CALL("Discordanze con il report su questo argomento (parte 6): " + ", ".join(f"n. {d}" for d in disc) + ". Non risolte: si decidono, non si correggono in silenzio.")


# ============================================================================================ PARTE 6 · discordanze
DISC = [
    ["1", "Listino per esame", "Appunti 4,99 € (lancio, poi 9,99) · Dispensa completa 30L 12,99 € (lancio, poi 18,99) · Semestre 29,99 € · Anno 49,99 €.", "Pagina Prezzi di esempio: Appunti 4,99 · Dispensa completa 12,99 · Due esami 22,99 · Semestre (1 esame) 12,99 · Pacchetto semestre 29,99 · Pacchetto anno 49,99. «Due esami» e «Semestre · 1 esame» non sono nel report.", "Pacchetto esame 14,99 € (ipotesi HQ: dispensa 12–15 €) · Pacchetto semestre 29,99 €. Nessun Appunti singolo né pacchetto anno."],
    ["2", "Plus: prezzo e formula", "14,99 € una tantum, vale fino a fine sessione; con un pacchetto 10 € in meno. Abbonamento mensile esplicitamente scartato (si disdice dopo l'esame).", "Nessuna pagina Plus. La card L07 cita «Plus mensile» come ipotesi.", "4,99 € al mese, «prezzo da decidere», si disdice quando vuoi. D10: Plus 39 €/semestre nella demo C."],
    ["3", "Contenuto di Plus", "Piano di studio per tutti gli esami, simulazioni a tempo, registro errori, 30 giorni di esercizi, CV benchmark completo (8 carriere), avvisi su appelli, bandi Erasmus e master. Le dispense restano a parte.", "—", "Esercitazioni complete su tutti gli esami · simulazioni a tempo e ripasso errori ovunque · sconto sui mentor."],
    ["4", "Piano gratuito", "1 Appunti a scelta tra 3 esami (uno per anno) + 1 in regalo al primo amico invitato; piano di studio a un esame alla volta; simulatore a prova da 5 domande; registro errori solo Plus; CV: prime 5 regole su 17.", "Gratuiti: anteprime, informazioni sugli esami e strumenti rapidi (FAQ della pagina Prezzi).", "Gratuito: schede e consigli di ogni esame, quiz di prova (5 domande) e ripasso errori, esami, libretto e voto, Erasmus e magistrali. Nessuna dispensa gratuita."],
    ["5", "Accesso", "Email @stud.unifi.it con link via email, niente password (login con Google, password e una chiave per utente scartati).", "Nessun accesso: l'area personale si mostra in schermate.", "Email e password, accesso rapido demo, registrazione, recupero password."],
    ["6", "Scuole e hub", "10 scuole dell'Università di Firenze (Economia attiva, 9 in arrivo): Ingegneria, Giurisprudenza, Medicina e Salute, Scienze, Scienze Politiche, Studi Umanistici, Psicologia, Architettura, Agraria.", "3 hub: Economia (attivo), Giurisprudenza e Medicina (in arrivo).", "Aree di studio: Economia (attiva), Giurisprudenza e Medicina (in arrivo), «un'altra area»."],
    ["7", "Protezione dei PDF", "Il PDF si scarica con filigrana personale visibile (nome, email, licenza, data), marcatura invisibile, storage privato con link temporanei, massimo 15 download al giorno. «Lettura solo online» scartata perché gli studenti vogliono annotare il PDF sul tablet.", "—", "D23 (proposta HQ): lettore con PDF.js e filigrana, «il PDF non si scarica». Nella parte decisa «Apri dispensa» apre il PDF senza filigrana."],
    ["8", "Mentor e tutoring", "Tutoring 1-1 a 20 €/ora (pacchetto 3 ore 54 €; 75% al mentor, 25% a UniLink). Mentor e lettera: porte finte finché i clic non li giustificano (decisione 13).", "Card L03 «Mentoring tra pari»: gratuito, con crediti o a pagamento da decidere; prova manuale con 5 ambassador.", "Il mio percorso → Mentor è nella parte decisa, con prenotazione e pagamento simulato di 35 €."],
    ["9", "Piano di studio", "Percorso per esame con fasi, capitoli e sessioni da 45 minuti; più esami in un calendario unico; ottimizzatore dei voti; piano gratuito a un esame, multi-esame in Plus.", "Strumento «Piano per l'appello» con regole semplici; card L02 «Metodo e piano di studio» (calendario che si aggiorna).", "Nessun piano a sessioni. D03 «Il mio piano» è il Career Score (altra cosa con lo stesso nome)."],
    ["10", "Referral e ambassador", "Codice fisso per account, regalo per invito, ambassador con dashboard e crediti (20% del venduto).", "Community: gruppi WhatsApp per anno e ambassador, senza codici.", "Nessun referral deciso; D10 (Career) ha un codice invito con crediti, D19 un club con ambassador."],
    ["11", "Stack e hosting", "Web app statica su app.unilinkfirenze.it (es. GitHub Pages) + Supabase; landing su Framer.", "Demo statica su GitHub Pages, landing destinata a Framer.", "Il PDF di architettura propone Next.js su Vercel + Supabase."],
    ["12", "Posizionamento", "«Studia meglio, ovunque studi» (landing generale) e «Da studenti per studenti, gli appunti da 30 e lode e un piano per arrivarci».", "«Studia, orientati, scegli.», con fasi Prima/Durante/Dopo.", "—"],
    ["13", "Struttura della landing", "Landing generale + hub per scuola + tool universali; nessuna struttura per fasi.", "Hub + fasi Prima/Durante/Dopo + Strumenti + Community.", "Parte decisa: Studio, Dopo gli esami, Account (nomi diversi dalle fasi della landing)."],
    ["14", "Tracciamento e consenso", "Piano di eventi con Google Tag Manager, Cookie Banner di Framer, parametro ?from=, KPI settimanali, «porte finte».", "Nessun tracciamento; mancano privacy, cookie e termini.", "Nessun tracciamento a eventi; pannello «Metriche» con dati di esempio."],
    ["15", "Banca di domande del simulatore", "114 domande vere dai PDF Quiz di Banca e Sistema Finanziario (30 in 30 minuti) e Statistica app. aziendali (18 in 45 minuti, +2/−0,5/0).", "—", "Quiz di esempio scritti per la demo: 15 domande per Microeconomia, Economia Aziendale e Statistica."],
    ["16", "Pannello del team", "Sette schede: panoramica, tracciamento, controllo materiale, domanda, profili di studio, ambassador, vendite e prezzi.", "—", "«Metriche» (admin): incassi, ordini, funnel, simulatore economico; Business cockpit (D11) e La rete (D21) come proposte."],
]


def parte_6():
    H1("Discordanze tra report e demo v2", "non risolte: si riportano entrambe, si decide dopo")
    P("Queste sono le cose su cui il report (demo v1) e le demo v2 attuali dicono cose diverse. Non sono errori da correggere: sono scelte da fare. Per ciascuna sono riportate le tre versioni affiancate. Finché non c'è una decisione esplicita, nessuna viene modificata e le card del report e le proposte delle demo coesistono.")
    CALL("Stato di tutte: non risolta, da decidere. Ordine consigliato per decidere: 5 (accesso), 6 (scuole), 1, 2, 3 e 4 (prezzi e piani), 7 (PDF), 11 (stack), poi le altre.")
    TB(["N.", "Tema", "Report (demo v1)", "Landing v2", "Web app v2"], DISC, ["5%", "11%", "30%", "27%", "27%"])
    H2("Differenze di completezza (non sono discordanze)")
    P("Molti argomenti del report non sono ancora nelle demo v2 e vi compaiono solo come card «Da decidere»: referral e ambassador con dashboard, filigrana, simulatore con PDF Quiz reali, piano di studio a sessioni, CV benchmark con 17 regole, libretto con semicerchio e grafico dei voti, SUSBUS e SECI, ultimo aggiornamento con registro versioni, pannello del team a sette schede, tracciamento. La parte 5 dice, per ciascuno, cosa c'è oggi.")
    H2("Nomi da allineare")
    P("Landing: Prima · Durante · Dopo, hub. Web app: Studio · Dopo gli esami, area di studio. Il report: scuole, hub. Sono idee vicine ma non uguali; conviene sceglierne una sola e usarla ovunque (menu, PDF, messaggi). Non è stato scelto nulla.")


# ============================================================================================ PARTE 7 · registro unico
def parte_7():
    H1("Registro unico delle idee da decidere", "tutte le card Lxx (landing) e Dxx (web app)")
    P(f"La landing ha {len(LD['decidere'])} card (L01–L{len(LD['decidere'])}); la web app ha {len(WD['decidere'])} proposte (D01–D{len(WD['decidere'])}). Le card L10–L26 e D26–D44 nascono dal report e sono marcate con il gruppo «Report · …». Dove una idea vive in entrambe, le due card si rimandano.")
    H2("Landing: card L01–L" + str(len(LD["decidere"])))
    TB(["Cod.", "Titolo", "Gruppo", "Web app"], [[c["id"], c["titolo"], c["gruppo"], c["area"] or "—"] for c in LD["decidere"]], ["8%", "52%", "28%", "12%"])
    H2("Web app: proposte D01–D" + str(len(WD["decidere"])))
    inv = {}
    for k, v in LID.items(): inv.setdefault(AID.get(k), v)
    TB(["Cod.", "Titolo", "Gruppo", "Stato", "Modulo", "Landing"], [[r["id"], r["titolo"], r["gruppo"], r["stato"], "nella app" if r["modulo"] else "da costruire", inv.get(r["id"], "—")] for r in WD["decidere"]], ["7%", "34%", "24%", "12%", "12%", "11%"])
    CALL("Impatto e sforzo delle card L10–L26 e D26–D44 non sono valutati: il report non dà un punteggio e non è stato inventato (nella landing compaiono come pallini vuoti).")


# ============================================================================================ PARTE 8 · decisioni aperte
def parte_8():
    H1("Decisioni aperte", "da chiudere in call")
    H2("Dal report (demo v1): le 16 decisioni")
    for t in R.T:
        if t["key"] == "decisioni":
            for b in t["blocks"]:
                if b["t"] == "steps":
                    OL([" · ".join(x[1:]) for x in b["items"]])
                    break
    H2("Dalla web app (demo v2)")
    OL([
        "Abbonamento: Plus (C) o Pass (D)? Mensile, semestrale o annuale? Prezzo (D10, D20).",
        "Gratuito: dispense gratis + Plus (D04) o pacchetti a pagamento (parte decisa)?",
        "Quale area parte prima: Giurisprudenza o Medicina (D01, D02), guardando la lista d'attesa.",
        "Career: quali moduli prima di avere aziende partner (D03, D06, D07)?",
        "Network: quando uscire da Firenze (D12) e con quali regole per le dispense della community (D13).",
        "Commenti condivisi: tabella Supabase o file da passarsi?",
    ])
    H2("Dalla landing (demo v2)")
    UL([
        "Quale hub parte per primo (L08): soglia minima di iscritti e quali 3 esami per primi.",
        "Nomi tra landing e web app: Prima/Durante/Dopo e hub, oppure Studio/Dopo gli esami e area.",
        "Test d'ingresso (L04) prima dei nuovi hub? Gruppi di studio (L01) con matching o solo WhatsApp? Mentoring (L03) gratuito, a crediti o a pagamento?",
    ])
    H2("Dalle discordanze (parte 6)")
    P("Ognuna delle 16 discordanze è una decisione: nessuna è chiusa. Ordine consigliato nella parte 6.")


# ============================================================================================ PARTE 9 · manutenzione
def parte_9():
    H1("Manutenzione e richieste", "come si cambia, si salva e si verifica")
    H2("Come chiedere una modifica")
    TB(["Tipo", "Esempio", "Cosa si fa"], [
        ["A · Nuova idea", "«Nuova idea: …»", "Nuova card (Lxx nella landing, Dxx nella web app) in «Da decidere» con problema, proposta, dove vivrebbe, parere, cosa serve, domande, origine, storico. Le pagine decise non cambiano."],
        ["B · Modifica card", "«In L02 aggiungi…»", "Aggiorna la card e il suo storico."],
        ["C · Promuovi", "«L02 è decisa» / «Decidiamo D05»", "Si applicano le quattro domande, si porta la card nella pagina o nella sidebar, si aggiornano menu, PDF e storico; la card esce da «Da decidere»."],
        ["D · Pagina decisa", "«In S06 metti…»", "Si modifica la pagina; se cambia struttura si aggiorna il PDF."],
        ["E · Grafica", "«Card più grande su tablet»", "Si modifica il componente nel CSS: vale ovunque. È l'unico caso in cui si tocca il design."],
        ["F · Hub / area", "«Accendi Giurisprudenza»", "stato «attivo» nella configurazione + materiali collegati (passi della card D01)."],
        ["G · Strumento", "«Aggiungi uno strumento…»", "Voce in UL_TOOLS + funzione in IMPL."],
        ["H · Listino", "«Il semestre costa 27,99 €»", "Solo UL_CFG.prezzi (landing) e UL.PIANI (web app); restano ipotesi finché non decise."],
        ["M · Commenti", "«Applica i commenti aperti»", "Si applica ogni commento aperto con la modifica minima e si dice quali; i risolti sono storico."],
        ["N · Tipologia demo", "«Nuova tipologia demo: …»", "Riga in UL.DEMO e utente in UL.SEED."],
        ["I · Ripristina", "«Riporta la landing alla v2» / «ripristina la web app alla v2»", "La cartella torna al tag; la Action crea una nuova versione (lo storico non si perde)."],
        ["L · Rimuovi", "«Togli L04»", "La card esce; resta nel registro."],
    ], ["18%", "26%", "56%"])
    P("Se è ambiguo: «la metto in Da decidere (A) o già nelle pagine (C)?». Senza decisione, un'idea va in Da decidere. Per far costruire una scheda: allegare questo manuale (o CONTESTO_DEMO.md) e il prompt della scheda.")
    H2("Dopo ogni modifica")
    OL([
        "Aggiornare la versione (UL_CFG.versione nella landing, UL.VERSIONE nella web app).",
        "Verificare: node _src/verifica_landing.js (con python -m http.server 8765 acceso) deve scrivere «tutto ok»; per la web app, aprire ogni rotta con ogni tipologia senza errori.",
        "Se cambia l'architettura, ricompilare i PDF e questa linea guida.",
        "Commit con una frase chiara: diventa la nota della versione nell'HQ.",
        "Push: l'Action «Backup demo» crea ZIP, release e riga nel registro.",
    ])
    H2("Comandi utili")
    TB(["Cosa", "Comando (dalla radice del repository)"], [
        ["Verifica della landing", "node _src/verifica_landing.js"],
        ["Schede «Da decidere» (immagini, Markdown, PDF)", "node _src/build_schede.js"],
        ["Schermate reali della web app", "node _src/screenshot_webapp.js http://localhost:8765/ <cartella> poi python _src/png_to_webp.py <cartella>"],
        ["Questa linea guida", "python _src/linea_guida/build_linea_guida.py (richiede node e pip install typst)"],
        ["PDF di architettura", "python -c \"import typst; typst.compile('architettura/landing/architettura.typ', output='architettura/UniLink_Architettura_Landing.pdf', root='.', font_paths=['.'])\""],
    ], ["34%", "66%"])
    H2("Limiti noti della demo")
    UL([
        "I dati stanno nel browser: due persone su due computer vedono due «database» diversi.",
        "Lista d'attesa, newsletter e acquisti sono simulati.",
        "I commenti non sono condivisi in tempo reale (servirebbe una tabella Supabase, 1–2 giorni).",
        "Il carosello della landing apre la web app: lo ZIP della sola landing non la trova; la galleria dell'area funziona anche da sola. La web app non conserva il link profondo dopo il login.",
        "Le stime e le soglie nelle schede sono ipotesi; le note legali indicano cosa far verificare a un consulente, non sono pareri.",
        "Mancano privacy, cookie e termini, foto proprie, pagina 404, SEO per pagina e il backend della lista d'attesa.",
        "GitHub non dice chi ha scaricato uno ZIP: lo storico mostra chi ha modificato la demo; ogni release ha solo un contatore di download.",
    ])
    H2("Verso la versione vera")
    P("Il report indica sei fasi con costo stimato (card «Per andare online»): sistemare il sito di oggi (0 €) · backend Supabase (0 € all'inizio, poi piano Pro) · web app su app.unilinkfirenze.it · soggetto legale + Stripe · contenuti · AI solo in Plus. Il PDF di architettura della web app propone invece un percorso per fasi (demo, MVP, piani, moduli) con Next.js su Vercel; sono due strade diverse (discordanza 11). Roadmap sintetica della landing: breve (ott–nov 2026) approvare la demo v2 e le prime card, allineare i nomi, landing su Framer, lista d'attesa unica, pagine legali; medio (dic 2026–apr 2027) metodo e piano, gruppi di studio minimi, primo nuovo hub, listino e pagamenti, esercitazioni; lungo (da mag 2027) Medicina 2027/28, più atenei, Career completa, piano adattivo con AI.")


# ============================================================================================ PARTE 10 · glossario, versioni, fonti
def parte_10():
    H1("Glossario, versioni e fonti", "termini, storia delle versioni, riferimenti")
    H2("Glossario")
    TB(["Termine", "Significato"], [
        ["EA / EC", "Corsi di laurea Economia Aziendale ed Economia e Commercio."],
        ["SUSBUS / SECI", "Sustainable Business for Societal Challenges (B314) e Sviluppo sostenibile, cooperazione e gestione dei conflitti: due corsi triennali UniFi diversi da EA ed EC."],
        ["Appunti / Dispensa completa 30L", "Appunti/Sbobine di un esame; Appunti + Mappe + Quiz & Simulazioni + simulatore."],
        ["Hub", "Pagina di una scuola (o di un corso) con i suoi materiali e strumenti."],
        ["Area di studio", "Nella web app: Economia, Giurisprudenza, Medicina, altra."],
        ["Una tantum", "Pagamento unico per sessione, senza rinnovo."],
        ["Porta finta", "Pulsante di una funzione che non esiste ancora: il clic viene contato e chi clicca va in lista d'attesa."],
        ["Freemium", "Parte gratis, parte a pagamento."],
        ["North Star", "Metrica principale: studenti attivi a settimana (download, quiz o piano)."],
        ["Prezzo di lancio", "Prezzo temporaneo con aumento annunciato (alternativa lecita al prezzo barrato, art. 17-bis del Codice del Consumo)."],
        ["PACRAR", "Metodo di studio con cui si presenta Alessandro de Concini: non usarlo come nome senza permesso."],
        ["GA4 · GTM", "Google Analytics 4 · Google Tag Manager."],
        ["Supabase", "Database e accesso consigliati per la versione vera (login con link via email, tabelle, storage privato, funzioni sul server)."],
        ["Framer", "Strumento con cui è fatto il sito di oggi e dove resterebbe la landing."],
        ["HQ", "Il centro di controllo dei founder; contiene la sezione Laboratorio AI → DEMO."],
        ["Typst", "Strumento con cui si compilano i PDF di architettura."],
    ], ["24%", "76%"])
    H2("Versioni")
    TB(["Versione", "Cosa è", "Riferimento"], [
        ["Demo v1", "Demo del report: landing generale, hub, web app con filigrana e simulatore, pannello del team.", "Report «Dalla vetrina alla piattaforma», 4 ottobre 2026"],
        ["Demo v2", "Landing e web app attuali: landing con fasi, strumenti, schermate reali, commenti, 26 card; web app con design A, mix B/C/D, 44 proposte.", f"Registro HQ: landing-v{LD['versione']['n']}, webapp-v{WD['versione']['n']}"],
        ["Linea guida", "Questo manuale: unisce report, landing e web app senza risolvere le discordanze.", "Versione 1; si aggiorna rigenerandola"],
    ], ["16%", "52%", "32%"])
    H2("Fonti usate nel report")
    UL([
        "Sito attuale: unilinkfirenze.it (home, dispense, tools, mentor), analizzato il 4 ottobre 2026.",
        "CareerSet TU Dublin (careerset.com/tudublin).",
        "Metodo PACRAR: sintesi delle sei fasi e sito di Alessandro de Concini.",
        "SUSBUS: pagina ufficiale UniFi. SECI: Booklet 2026/27.",
        "Prezzi barrati: art. 17-bis Codice del Consumo (D.lgs. 26/2023, direttiva Omnibus).",
        "Studocu Premium: prezzi secondo fonti terze. Tutoring a Firenze: medie per città e profili su Superprof.",
        "Stripe: tariffe per l'area economica europea. Supabase, piano gratuito: sintesi dei limiti 2026.",
        "Target Test Prep: recensione con struttura del corso e del piano, recensioni GMAT Club.",
        "Studocu, Knowunity, Amboss; Testbusters (acquisizione di Ammesso.it); Uniwhere.",
        "Scuole dell'Università di Firenze: guida ai corsi di laurea. Framer e Google Tag Manager: guida ufficiale e tracciamento dei clic (BRIX Templates).",
    ])
    H2("File della demo v1 citati dal report")
    P("Il report descrive i file della demo v1 (config/hub.js, piani.js, sito.js, corsi-di-laurea.js, profili-studio.js, cv-benchmark.js, tracking.js, simulatore.js; tools/genera_corsi.py, estrai_quiz.py; README.md). Quei file non esistono nelle demo v2, che hanno una struttura diversa (parti 3 e 4): sono citati solo come riferimento di cosa conteneva la demo v1.")


# ============================================================================================ emissione Markdown
def md():
    out = ["# UniLink · Linea guida", "", "_Manuale unico di landing, web app e prodotto. Senza data: si aggiorna rigenerandolo (vedi parte 9)._", "", "> Demo v2 = landing e web app attuali (registro HQ: landing-v%s, webapp-v%s). Demo v1 = demo del report «Dalla vetrina alla piattaforma». Dove report e demo v2 sono discordanti non si sceglie: vedi parte 6." % (LD["versione"]["n"], WD["versione"]["n"]), ""]
    n = 0
    for nodo in DOC:
        k = nodo[0]
        if k == "h1":
            if nodo[3]: n += 1
            out += ["", f"## Parte {n} · {nodo[1]}" if nodo[3] else f"## {nodo[1]}", f"_{nodo[2]}_" if nodo[2] else "", ""]
        elif k == "h2": out += ["", f"### {nodo[1]}", ""]
        elif k == "h3": out += ["", f"#### {nodo[1]}", ""]
        elif k == "p": out += [nodo[1], ""]
        elif k == "ul": out += [f"- {x}" for x in nodo[1]] + [""]
        elif k == "ol": out += [f"{i}. {x}" for i, x in enumerate(nodo[1], 1)] + [""]
        elif k == "call": out += [f"> {nodo[1]}", ""]
        elif k == "tb":
            cols, rows = nodo[1], nodo[2]
            esc = lambda s: s.replace("|", "\\|").replace("\n", " ")
            out += ["| " + " | ".join(esc(c) or " " for c in cols) + " |", "|" + "---|" * len(cols)] + ["| " + " | ".join(esc(c) for c in r) + " |" for r in rows] + [""]
    return "\n".join(out)


# ============================================================================================ emissione Typst
HEADER = r'''// Generato da _src/linea_guida/build_linea_guida.py: non modificare a mano, si rigenera.
#let navy = rgb("#172554")
#let crema = rgb("#f4f1ea")
#let arancio = rgb("#cf7527")
#let ar2 = rgb("#f6e4d1")
#let ar3 = rgb("#9a5417")
#let crema2 = rgb("#ebe4d5")
#let nv2 = rgb("#4b5675")
#let linea = rgb("#e2dccf")
#let nvt = rgb("#dfe4f1")
#set document(title: "UniLink — Linea guida", author: "UniLink")
#set text(font: "Croogla 4F", size: 9.4pt, fill: navy, lang: "it")
#set par(leading: 0.62em, justify: false)
#set list(indent: 4pt, body-indent: 5pt, spacing: 0.5em)
#set enum(indent: 4pt, body-indent: 5pt, spacing: 0.5em)
#set page(paper: "a4", margin: (x: 18mm, top: 20mm, bottom: 18mm),
  header: context { if counter(page).get().first() > 1 [
    #set text(size: 7.5pt, fill: nv2)
    UniLink · Linea guida #h(1fr) Demo v2
  ] },
  footer: context { if counter(page).get().first() > 1 [
    #set text(size: 7.5pt, fill: nv2)
    #h(1fr) #counter(page).display()
  ] })
#let spaziato(t) = text(size: 7.4pt, fill: ar3, tracking: 0.14em, upper(t))
#let cap(n, titolo, sotto) = {
  pagebreak(weak: true)
  block(below: 3pt, spaziato("Parte " + str(n)))
  block(below: 4pt, text(size: 21pt, titolo))
  block(below: 12pt, text(size: 9pt, fill: nv2, sotto))
}
#let cap0(titolo, sotto) = {
  pagebreak(weak: true)
  block(below: 4pt, text(size: 21pt, titolo))
  block(below: 12pt, text(size: 9pt, fill: nv2, sotto))
}
#let sub(t) = block(sticky: true, above: 14pt, below: 6pt, text(size: 12.5pt, t))
#let sub3(t) = block(sticky: true, above: 9pt, below: 3pt, text(size: 9.8pt, fill: ar3, t))
#let nota(body) = block(fill: ar2, radius: 8pt, inset: 10pt, width: 100%, below: 8pt, text(fill: ar3, body))
#let tab(cols, widths, righe) = {
  set text(size: 8.2pt)
  table(columns: widths, stroke: (x, y) => (bottom: 0.5pt + linea), inset: (x: 5pt, y: 4.5pt),
    fill: (x, y) => if y == 0 { crema } else { none },
    ..cols.map(c => text(fill: nv2, size: 7.6pt, c)), ..righe.flatten().map(c => [#c]))
}
'''


def S(s): return json.dumps(str(s), ensure_ascii=False)
def T(s): return f"#{S(s)}"
def A(l): return f"({l[0]},)" if len(l) == 1 else "(" + ", ".join(l) + ")"


def typ():
    t = HEADER
    t += f'''
#page(fill: navy, margin: 22mm, header: none, footer: none)[
  #set text(fill: white)
  #grid(columns: (auto, auto), gutter: 8pt, align: horizon, image("../../demo-landing/img/logo-white.png", width: 26pt), text(size: 22pt)[unilink])
  #v(1fr)
  #text(size: 8pt, fill: arancio, tracking: 0.16em)[LINEA GUIDA · MANUALE UNICO]
  #v(10pt)
  #text(size: 40pt)[UniLink, \\ landing, web app \\ e prodotto.]
  #v(14pt)
  #text(size: 11pt)[Un solo documento, senza data, che tiene insieme il report «Dalla vetrina alla piattaforma», la landing e la web app attuali. Dove dicono cose diverse non sceglie: mostra tutte le versioni e le lascia da decidere.]
  #v(1fr)
  #set text(size: 8pt)
  #grid(columns: (1fr, 1fr, 1fr), gutter: 10pt,
    [Demo v2 \\ landing-v{LD["versione"]["n"]} · webapp-v{WD["versione"]["n"]}], [Per i founder \\ Matteo, Cosimo, Niccolò, Gianmarco], [Da allegare a ogni richiesta \\ anche in Markdown: LINEA\\_GUIDA\\_UNILINK.md])
]
'''
    n = 0
    for nodo in DOC:
        k = nodo[0]
        if k == "h1":
            if nodo[3]:
                n += 1
                t += f"\n#cap({n}, {S(nodo[1])}, {S(nodo[2])})\n"
            else:
                t += f"\n#cap0({S(nodo[1])}, {S(nodo[2])})\n"
        elif k == "h2": t += f"#sub[{T(nodo[1])}]\n"
        elif k == "h3": t += f"#sub3[{T(nodo[1])}]\n"
        elif k == "p": t += f"{T(nodo[1])}\n\n"
        elif k == "ul": t += "\n".join(f"- {T(x)}" for x in nodo[1]) + "\n\n"
        elif k == "ol": t += "\n".join(f"+ {T(x)}" for x in nodo[1]) + "\n\n"
        elif k == "call": t += f"#nota[{T(nodo[1])}]\n"
        elif k == "tb":
            cols, rows, w = nodo[1], nodo[2], nodo[3]
            w = w or ["1fr"] * len(cols)
            t += f"#tab({A([S(c) for c in cols])}, {A(w)}, {A([A([S(c) for c in r]) for r in rows])})\n\n"
    return t


def main():
    parte_0(); parte_1(); parte_2(); parte_3(); parte_4(); parte_5(); parte_6(); parte_7(); parte_8(); parte_9(); parte_10()
    # il «Come si usa» è la parte 1 del documento: la numerazione automatica segue l'ordine delle parti
    open(os.path.join(RADICE, "architettura", "LINEA_GUIDA_UNILINK.md"), "w", encoding="utf-8").write(md())
    os.makedirs(os.path.join(RADICE, "architettura", "linea-guida"), exist_ok=True)
    open(os.path.join(RADICE, "architettura", "linea-guida", "linea-guida.typ"), "w", encoding="utf-8").write(typ())
    import typst
    typst.compile(os.path.join(RADICE, "architettura", "linea-guida", "linea-guida.typ"), output=os.path.join(RADICE, "architettura", "UniLink_Linea_Guida.pdf"), root=RADICE, font_paths=[RADICE])
    print("ok: MD, Typst e PDF generati;", len(DOC), "elementi")


if __name__ == "__main__":
    main()
