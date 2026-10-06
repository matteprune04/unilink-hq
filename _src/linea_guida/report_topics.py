# -*- coding: utf-8 -*-
# Contenuto del report «Dalla vetrina alla piattaforma» (4 ottobre 2026, demo v1), diviso per argomento (T).
# È la fonte da cui sono state generate le card L10–L26 (landing) e D26–D44 (web app) e da cui si genera la «Linea guida».
# Regola: il contenuto è quello del report. Niente deduzioni: dove il report non dice una cosa, il campo resta vuoto o lo dichiara.
# Gli id (L10…, D26…) sono assegnati qui sotto nell'ordine degli argomenti: lo stesso ordine con cui sono state create le card.
import json

REPORT = "Report «Dalla vetrina alla piattaforma» · 4 ottobre 2026"
DATA_REPORT = "2026-10-04"
DATA_AGG = "2026-10-06"


def blk(t, **k):
    d = {"t": t}
    d.update(k)
    return d


def cards(titolo, items): return blk("cards", titolo=titolo, items=items)
def steps(titolo, items): return blk("steps", titolo=titolo, items=items)
def lst(titolo, items): return blk("list", titolo=titolo, items=items)
def nota(testo): return blk("nota", testo=testo)
def stats(items): return blk("stats", items=items)
def chips(items): return blk("chips", items=items)


G_STR = "Report · Struttura e sito"
G_PRZ = "Report · Prezzi e pagamenti"
G_CRE = "Report · Crescita"
G_MIS = "Report · Misure, legale e lancio"
G_ACC = "Report · Accesso e materiali"
G_STU = "Report · Studio e carriera"
G_TEA = "Report · Crescita e team"

T = []


def topic(**k):
    T.append(k)


# ============================================================================================ S1 + S4
topic(
    key="vetrina", sez="1 e 4", titolo="Dalla vetrina alla piattaforma: cosa cambia", lato="LA", gL=G_MIS, gA=G_MIS,
    breve="Il report descrive la demo in tre parti (landing, web app, pannello del team) e i tre cambiamenti di fondo rispetto a unilinkfirenze.it: account, valore oltre il PDF, tracciamento.",
    proposta="La demo è una versione funzionante in locale di come potrebbe diventare UniLink, in tre parti. 1) Landing pubblica: quello che resterebbe su Framer (una landing generale UniLink per tutta l'Università di Firenze, l'hub di Economia con catalogo con anteprime, schede corso e prezzi, le pagine delle altre scuole «in arrivo», l'architettura dei tool, la pagina Plus, ambassador e pagine legali). 2) Web app: l'area personale di ogni studente (dispense con filigrana, simulatore d'esame, piano di studio a sessioni per più esami, libretto e voto con scenari, Career, inviti, profilo). 3) Pannello del team: metriche, controllo del materiale, domanda, ambassador, vendite. Tutto quello che è una scelta di business (prezzi, testi, regole, soglie) sta in file di configurazione separati, così si cambia senza toccare il codice.",
    dove_l="Landing pubblica (Framer): vedi anche la card D26 nella web app.", dove_a="Tutta la piattaforma: landing su Framer, web app su app.unilinkfirenze.it, pannello del team.",
    consiglio="Dal report: la struttura proposta è «landing su Framer, app su app.unilinkfirenze.it» (decisione 1). Framer non gestisce login, pagamenti e dati degli utenti.",
    blocks=[
        cards("I tre cambiamenti di fondo", [
            ["Account e freemium", "Oggi: sito aperto e gratuito, i PDF sono file pubblici su Framer. Nella demo: account con email @stud.unifi.it (gratis) + freemium: 1 dispensa gratis, poi singoli, pacchetti e Plus. Perché: servono ricavi e serve sapere chi usa cosa; le schede restano pubbliche per non perdere Google."],
            ["Il valore non è solo il PDF", "Oggi: il prodotto è il PDF. Nella demo: il PDF ha la filigrana personale, ma il valore sta anche fuori (simulatore, piano di studio, aggiornamenti, Career). Perché: un PDF si può sempre copiare; un account con piano e simulatore no."],
            ["Misurare per decidere", "Oggi: si misurano visite e pagine (GA4). Nella demo: piano di tracciamento completo (funnel, attivazione, ricerche senza risultato, «porte finte», feedback dopo l'esame). Perché: decidere su dati cosa produrre, cosa costruire, quanto far pagare."],
        ]),
        cards("Mappa di cosa cambia (oggi → nella demo → perché)", [
            ["Struttura", "Un sito unico su Framer → landing su Framer + web app su app.unilinkfirenze.it → Framer non gestisce login, pagamenti e dati degli utenti."],
            ["Brand", "UniLink = Economia → landing generale UniLink + un hub per scuola (Economia attiva, 9 in arrivo) → non legarsi a una sola facoltà; misurare la domanda."],
            ["Accesso", "Nessun account → account con email UniFi e link via email → sappiamo chi scarica; solo studenti UniFi."],
            ["Dispense", "PDF pubblici → PDF privati con filigrana personale al download → rendere scomodo e tracciabile girare i file."],
            ["Catalogo", "Schede con informazioni utili → + anteprime, indice, struttura della prova, versione e «aggiornata il» → convincere prima di registrarsi; fiducia."],
            ["Prezzi", "Tutto gratis → 1 gratis su 3 + regalo per invito; singoli, pacchetti, Plus una tantum → ricavi senza perdere chi non paga."],
            ["Studio", "— → simulatore d'esame; piano di studio a sessioni per più esami con calendario e ottimizzatore → valore che un PDF girato non ha."],
            ["Carriera", "Esploratore di carriera (pubblico) → + CV benchmark per carriera, template UniLink, checklist LinkedIn → diventare il metro di «CV fatto bene»."],
            ["Percorso", "Calcolatori separati → libretto con gauge, grafico dei voti, scenari, obiettivo e simulazione; si riempie da solo dal piano → inserire i dati una volta sola."],
            ["Tool", "5 tool su Framer → registro dei tool: universali, di scuola, di livello; tenere, unire, spostare → crescere su altre scuole e sulla magistrale senza rifare tutto."],
            ["Community", "WhatsApp, «Diventa mentor» → + referral con codice fisso, programma ambassador con dashboard → crescere con il passaparola."],
            ["Corsi di laurea", "EA ed EC → + SUSBUS e SECI: iscrizione e richieste → misurare la domanda prima di produrre."],
            ["Misure", "GA4 su pagine → piano di tracciamento + pannello team → decidere con i dati."],
            ["Legale", "— → bozze di privacy, termini, fonti; consenso cookie e recesso → obbligatori quando si vende."],
        ]),
        nota("Cosa la demo del report non è: non è online (gira sul computer, i dati stanno nel browser); non incassa soldi (il checkout è simulato: per incassare serve prima un soggetto legale); non usa l'AI (dove servirebbe, per rifinire il piano, c'è una spiegazione di come funzionerebbe); utenti, ordini e grafici del pannello sono in parte di esempio."),
    ],
    serve=["Un soggetto legale per incassare (vedi «Pagamenti»)", "Un backend per account, dati e PDF (vedi «Per andare online»)"],
    call=["Il sito diventa landing + app separata? (proposta nella demo: sì, landing su Framer, app su app.unilinkfirenze.it)"],
    A=dict(
        dati=["Oggi → nella demo → perché, per 14 aree: struttura, brand, accesso, dispense, catalogo, prezzi, studio, carriera, percorso, tool, community, corsi di laurea, misure, legale (tabella nella card @L:vetrina@ della landing)",
              "Tre parti: landing pubblica, web app, pannello del team"],
        funzioni=["Tutto ciò che è scelta di business (prezzi, testi, regole, soglie) sta in file di configurazione separati: si cambia senza toccare il codice",
                  "Il checkout è simulato, non c'è AI (c'è una spiegazione di come funzionerebbe), il pannello ha dati in parte di esempio (interruttore per nasconderli)"],
        ricavi="—", dipendenze=["Soggetto legale per incassare", "Backend per account, dati e PDF"],
        attivare=["Decidere nella call: struttura landing + app separata (decisione 1)", "Seguire la sequenza «Per andare online» (card @D:online@)"],
        file=["Nel report (demo del 4 ottobre): config/hub.js, config/piani.js, config/sito.js, config/corsi-di-laurea.js, config/profili-studio.js, config/cv-benchmark.js, config/tracking.js, config/simulatore.js"],
    ),
)

# ============================================================================================ S3
topic(
    key="errori", sez="3", titolo="Il sito di oggi: errori da sistemare", lato="L", gL=G_STR, gA=None,
    breve="Analizzando unilinkfirenze.it sono emersi errori da sistemare comunque, indipendenti dalla demo (pulsanti, refusi, contatori, indirizzi, copertine, quiz).",
    proposta="Mentre si analizzava il sito sono emerse alcune cose da sistemare comunque: sono elencate qui sotto con il punto del sito in cui compaiono. Il report li considera indipendenti dalla demo.",
    dove_l="Sito attuale su Framer (unilinkfirenze.it): home, guida, pagine dispense, PDF Appunti e Quiz, Excel dei tool.",
    consiglio="Dal report: sono errori «indipendenti dalla demo»; la decisione 16 chiede solo chi li sistema. I contatori in home devono essere dimostrabili (200+ studenti e 95% di soddisfatti contro 78 iscritti nell'HQ).",
    blocks=[
        cards("Piccoli errori trovati sul sito", [
            ["Home, riquadro «Entra in unilink»", "Il pulsante «Gruppo WhatsApp» porta al catalogo dispense, non al gruppo."],
            ["/tools/calcolatore-voto-di-laurea", "Il sottotitolo del calcolatore voto di laurea è quello dell'Erasmus («…trova la destinazione più adatta a te») e la pagina si chiama «Calcolatore Media»."],
            ["Home e Guida", "Refuso «Quello che avremo voluto sapere» (avremmo)."],
            ["Home", "I contatori in home dicono 200+ studenti e 95% di soddisfatti; nell'HQ risultano 78 iscritti. I numeri pubblici devono essere dimostrabili."],
            ["Pagine dispense", "Indirizzi con refusi o parentesi: economia-dell-imrpresa-agroalimentare, topics-in-management-and-marketing-(), marketing-(principi-e-strumenti), contabilit%C3%A1; nel CSV anche il titolo «Imrpresa»."],
            ["PDF Appunti (Economia Aziendale)", "La copertina riporta il codice B014272, il sito B018991."],
            ["PDF Appunti (Matematica II, Agroalimentare, Economia Finanziaria)", "Le copertine non hanno il codice esame: verificare che siano quelle ufficiali."],
            ["PDF Quiz (Banca; Statistica per le app. aziendali)", "La risposta giusta segue sempre A-D-C-B e le domande sono un glossario (vedi «Simulatore d'esame»)."],
            ["Excel dei tool", "Il foglio Erasmus si chiama «2021-2» e il regolamento della prova finale è del 2017/2018: verificare che siano aggiornati."],
        ]),
        stats([["856", "utenti in 28 giorni (Google Analytics, al 4 ottobre)"], ["7.549", "visualizzazioni in 28 giorni"], ["102", "clic da Google in 28 giorni (erano 17 il mese prima)"], ["18 su 50", "pagine indicizzate"], ["78", "studenti registrati"]]),
        nota("Come girano oggi i materiali: i PDF delle dispense sono caricati su Framer come file pubblici: chi ha il link può scaricarli e girarli per sempre. Nelle pagine corso pubblicate oggi non ci sono pulsanti di download (controllato su Microeconomia ed Economia Aziendale). Non c'è login, non c'è pagamento, e Google Analytics vede le pagine ma non i clic sui pulsanti."),
        cards("Cosa contiene il sito di oggi", [
            ["Home", "Contatori, vetrina dei corsi del 1° anno, guida in PDF, tool, invito al gruppo WhatsApp."],
            ["Dispense", "Catalogo di 34 corsi (EA ed EC) alimentato da un file CSV. Ogni scheda ha le «Informazioni utili» per partizione (modalità d'esame, CFU, prove intermedie, quanto seguire le lezioni, difficoltà, «Il nostro consiglio»)."],
            ["Tools", "Calcolatore voto di laurea, calcolatore Erasmus, destinazioni Erasmus (140 università), Master/Magistrale (163 programmi), Esploratore di carriera (aree e percorsi con stipendi, ore, aziende target)."],
            ["Altro", "Guida (PDF), FAQ, Contatti, Diventa mentor."],
        ]),
    ],
    serve=["Qualcuno che sistemi gli errori elencati (fase 1 di «Per andare online», costo 0 €)"],
    call=["Errori del sito (elencati in «Il sito di oggi»): chi li sistema?"],
)

# ============================================================================================ S5 brand e hub
topic(
    key="hub10", sez="5", titolo="Un brand, tanti hub: le 10 scuole", lato="L", gL=G_STR, gA=None,
    breve="UniLink è il brand per tutta l'Università di Firenze; ogni scuola ha il suo hub. Economia è attiva, le altre 9 sono «in arrivo» con lista d'attesa e invito a fondare l'hub.",
    problema="Se UniLink si fa conoscere solo come «la cosa di Economia», quando vorremo aprire a Ingegneria o Giurisprudenza ripartiremo da zero. Ma se diventa troppo generico, a Economia perdiamo la cosa che oggi funziona: essere specifici sui loro esami.",
    proposta="UniLink è il brand: la landing generale parla a tutta l'Università di Firenze («Studia meglio, ovunque studi»). Ogni scuola ha il suo hub (UniLink Economia, UniLink Ingegneria…): stesso account, stesso piano di studio, stesso libretto e Career, ma appunti e tool propri. Le 10 scuole sono quelle dell'Università di Firenze. Economia è attiva. Le altre sono «in arrivo»: hanno una pagina con le idee di tool, una lista d'attesa e un invito a fondare l'hub (un piccolo gruppo di studenti di quella scuola che diventano ambassador e scelgono i primi esami). Si apre un hub quando ci sono il team e la domanda. I tool universali (voto di laurea, libretto, piano di studio, Erasmus, CV) funzionano da subito per tutti: portano iscritti da ogni scuola prima ancora dei contenuti.",
    dove_l="Landing generale UniLink con la griglia «Scegli la tua scuola»; una pagina per ogni scuola in arrivo (lista d'attesa, idee di tool da votare, «fonda l'hub»).",
    consiglio="Dal report: più avanti, se si esce da Firenze, «UniLink Firenze» diventa una città del brand. Per ora il dominio resta unilinkfirenze.it. Il report indica come criterio per le scuole dopo Economia: quelle con più iscritti in lista d'attesa e un team fondatore.",
    blocks=[
        cards("Le 10 scuole dell'Università di Firenze e i tool pensati per ciascuna", [
            ["Economia · attiva", "Dispense da 30 e lode, simulatore per gli esami a quiz, carriere in finance, consulting e audit."],
            ["Ingegneria · in arrivo", "Esercizi passo passo di Analisi e Fisica, propedeuticità e sbarramenti, progetti di gruppo."],
            ["Giurisprudenza · in arrivo", "Flashcard sugli articoli dei codici, simulazione dell'orale, percorsi dopo la laurea (avvocatura, magistratura, notariato)."],
            ["Medicina e Salute · in arrivo", "Banca domande per gli esami a quiz, tracker di tirocini e frequenze, simulatore del concorso di specializzazione."],
            ["Scienze · in arrivo", "Esercizi guidati, relazioni di laboratorio, dottorati e ricerca."],
            ["Scienze Politiche · in arrivo", "Concorsi pubblici e carriere internazionali (UE, ONG), tirocini."],
            ["Studi Umanistici · in arrivo", "Percorsi abilitanti all'insegnamento, bibliografie e citazioni, tesi."],
            ["Psicologia · in arrivo", "Tirocinio post-laurea ed esame di Stato, magistrali e scuole di specializzazione."],
            ["Architettura · in arrivo", "Calendario di consegne e revisioni, portfolio, concorsi di progettazione."],
            ["Agraria · in arrivo", "Tirocini in azienda, laboratori, sbocchi nell'agroalimentare."],
        ]),
        nota("I nomi delle scuole e le descrizioni dei tool sono letti dalla schermata «Scegli la tua scuola» del report (pagina 10): nel testo del report si cita solo «10 scuole» e gli esempi Ingegneria, Giurisprudenza e Medicina."),
        cards("Cosa fanno le realtà che ci assomigliano (analisi del report)", [
            ["Studocu", "Cosa fa: appunti caricati dagli studenti, organizzati per università e corso, con pagine pubbliche indicizzate. Modello: freemium, circa l'80% gratis, il resto Premium a pagamento o in cambio di documenti caricati. Cosa prendiamo: pagine pubbliche per corso (Google) e premi a chi contribuisce."],
            ["Knowunity", "Cosa fa: appunti e community per studenti, oltre 20 milioni di utenti in 15 paesi. Modello: freemium con abbonamento + employer branding pagato da aziende. Cosa prendiamo: le aziende pagano per farsi conoscere: base per Career."],
            ["Amboss", "Cosa fa: solo medicina, libreria + banca domande, oltre il 60% delle facoltà di medicina tedesche. Modello: abbonamento annuale; oltre 100 milioni di € di ricavi ricorrenti (2023). Cosa prendiamo: un verticale profondo per area vale più di tanti contenuti generici."],
            ["Target Test Prep", "Cosa fa: corso GMAT con capitoli, lezioni, quiz di capitolo, piano personalizzato, registro errori, statistiche. Modello: abbonamento a tempo. Cosa prendiamo: il piano a missioni e calendario (vedi «Piano di studio»)."],
            ["Testbusters", "Cosa fa: preparazione ai test d'ammissione (medicina, professioni sanitarie, IMAT), in 34 città. Modello: corsi, simulazioni, tutor; crescita con acquisizioni (Ammesso.it). Cosa prendiamo: un verticale per tipo di prova, simulazioni come prodotto."],
            ["Uniwhere", "Cosa fa: libretto e carriera per università italiane e tedesche. Modello: le aziende pagano per proporre formazione e opportunità agli studenti profilati. Cosa prendiamo: il libretto come aggancio, le aziende come cliente."],
        ]),
        nota("Il filo comune (dal report): chi funziona ha un marchio unico e contenuti verticali (per corso o per prova). I ricavi arrivano da freemium + abbonamento o pacchetti, e quasi sempre da una seconda gamba B2B (aziende)."),
    ],
    serve=["Il team e la domanda: si apre un hub quando ci sono entrambi", "Un piccolo gruppo di studenti di quella scuola che diventano ambassador e scelgono i primi esami (i «fondatori» dell'hub)"],
    call=["Il brand è «UniLink» con hub per scuola? Quali scuole dopo Economia (proposta: quelle con più iscritti in lista d'attesa e un team fondatore)?",
          "Brand: UniLink con un hub per scuola; Economia attiva, le altre «in arrivo» con lista d'attesa e team fondatore. Quale scuola dopo?"],
)

topic(
    key="economia", sez="5", titolo="L'hub di Economia: «solo landing e poco altro»", lato="L", gL=G_STR, gA=None,
    breve="L'hub di Economia è la landing di oggi rifatta con un solo scopo: far creare l'account. Il «poco altro» sono le pagine che servono a Google e alla fiducia.",
    problema="Le schede corso e i tool sono quello che Google ci porta (102 clic al mese e in crescita). Se le chiudiamo dietro il login perdiamo traffico: tutto si vede, si scarica solo con l'account.",
    proposta="L'hub di Economia è la landing di oggi rifatta con un solo scopo: far creare l'account. Sezioni: promessa e «Inizia gratis», tre passi, vetrina dei corsi, cosa c'è dentro l'account, ultimi aggiornamenti, tool gratuiti, prezzi, ambassador e mentor, FAQ. Il «poco altro» sono le pagine che servono a Google e alla fiducia: catalogo, schede corso, prezzi, Plus, ambassador, tool, pagine legali. La landing resta su Framer (si modifica come oggi). I pulsanti portano all'app con un parametro che dice da dove arrivano (?from=hero, ?from=corso…). La demo riproduce struttura e testi; la grafica definitiva si fa con i componenti Framer già esistenti.",
    dove_l="Landing su Framer: hub di Economia e pagine collegate.",
    consiglio="Alternative scartate (dal report): tutto dentro l'app (si perde Google e la comodità di modificare i testi su Framer); landing minimale senza catalogo (si perde il traffico delle 34 schede); rifare il sito con un framework (costi e competenze che oggi non abbiamo).",
    blocks=[
        steps("Sezioni dell'hub di Economia (in ordine)", [["1", "Promessa e «Inizia gratis»"], ["2", "Tre passi"], ["3", "Vetrina dei corsi"], ["4", "Cosa c'è dentro l'account"], ["5", "Ultimi aggiornamenti"], ["6", "Tool gratuiti"], ["7", "Prezzi"], ["8", "Ambassador e mentor"], ["9", "FAQ"]]),
        chips(["Catalogo", "Schede corso", "Prezzi", "Plus", "Ambassador", "Tool", "Pagine legali"]),
        cards("Pensata prima per il telefono", [["Landing", "Costruita per lo smartphone (lì arrivano i link di WhatsApp e Instagram): pulsanti grandi, menu a tendina, numeri in tre riquadri."], ["Area personale", "Pensata per tablet e computer, dove si studia, ma funziona anche da telefono con una barra di navigazione in basso."]]),
    ],
    serve=["Parametro ?from=… su ogni pulsante verso l'app (hero, corso, prezzi…), letto da Google Tag Manager e salvato dall'app con l'iscrizione", "Componenti Framer già esistenti per la grafica definitiva"],
    call=["Struttura: landing su Framer + app su app.unilinkfirenze.it. Va bene?"],
)

topic(
    key="catalogo", sez="5", titolo="Catalogo e scheda corso con anteprime", lato="L", gL=G_STR, gA=None,
    breve="Catalogo con filtri e scheda corso con anteprima delle prime pagine, com'è la prova, informazioni utili, indice, registro aggiornamenti e riquadro di acquisto.",
    problema="Convincere prima di registrarsi e creare fiducia: anteprime, indice, struttura della prova, versione e «aggiornata il».",
    proposta="Il catalogo ha filtri per corso di laurea, anno, semestre e area. La ricerca senza risultati propone «Chiedi questo esame»: è un dato su cosa manca. Ogni scheda corso mostra: anteprima delle prime pagine (la quarta è sfocata fino all'accesso), com'è la prova (dai PDF Quiz), le informazioni utili prese dal sito, l'indice della dispensa (dai sorgenti), il registro degli aggiornamenti e un riquadro di acquisto che cambia in base a chi guarda (ospite, chi ha già la dispensa, chi ha ancora il gratuito).",
    dove_l="Hub di Economia: pagine catalogo e scheda corso (34 corsi di EA ed EC).",
    consiglio="Dal report: i dati dei 34 corsi si generano da soli con uno script (tools/genera_corsi.py) che legge il CSV del sito, scarica le informazioni utili dalle pagine pubblicate, trova i PDF, conta le pagine, prende la data del file, crea le anteprime e legge i capitoli dai sorgenti Typst.",
    blocks=[
        steps("Cosa mostra la scheda corso", [["1", "Anteprima delle prime pagine (la quarta è sfocata fino all'accesso)"], ["2", "Com'è la prova (dai PDF Quiz)"], ["3", "Informazioni utili, prese dal sito"], ["4", "Indice della dispensa (dai sorgenti)"], ["5", "Registro degli aggiornamenti"], ["6", "Riquadro di acquisto: cambia per ospite, chi ha già la dispensa, chi ha ancora il gratuito"]]),
        cards("Catalogo", [["Filtri", "Per corso di laurea, anno, semestre e area."], ["Ricerca senza risultati", "Propone «Chiedi questo esame»: è un dato su cosa manca."]]),
    ],
    serve=["Script che genera il catalogo da CSV, sito e PDF (nel report: tools/genera_corsi.py)", "Informazioni utili per partizione prese dalle pagine pubblicate"],
    call=["Nel report la scheda corso non ha domande aperte: la decisione 16 («Errori del sito») riguarda, tra l'altro, codici copertina e indirizzi con refusi delle pagine dispense."],
)

# ============================================================================================ S8
topic(
    key="aggiornamento", sez="8", titolo="Ultimo aggiornamento e registro versioni", lato="LA", gL=G_STR, gA=G_ACC,
    breve="Ogni dispensa ha versione e data: «Ultimi aggiornamenti» in landing, registro completo nella scheda corso, «Nuova versione disponibile» nell'area personale.",
    problema="È il modo più economico per creare fiducia e dare un motivo per tornare. Risponde anche alla domanda tipica «ma è aggiornata al programma di quest'anno?».",
    proposta="Ogni dispensa ha versione e data. Nella landing c'è il riquadro «Ultimi aggiornamenti»; nella scheda corso il registro completo; nell'area personale l'avviso «Nuova versione disponibile, riscaricala gratis». Le revisioni vere (es. Marketing Internazionale v1.1 del 7 settembre, allineata al sillabo) si scrivono a mano nel registro aggiornamenti (nel report: config/sito.js).",
    dove_l="Landing (riquadro «Ultimi aggiornamenti», scheda corso) e area personale (avviso).", dove_a="Area personale: avviso «Nuova versione disponibile, riscaricala gratis»; pannello del team: colonna «programma verificato il».",
    consiglio="Alternative scartate (dal report): mostrare solo la data senza versione (non dice cosa è cambiato); notifiche via email a ogni aggiornamento (utili più avanti, quando ci sarà un servizio di email).",
    blocks=[
        nota("Attenzione (dal report): oggi la data «aggiornata il» viene dal file PDF. Per renderla affidabile serve una regola: ogni volta che si ricarica una dispensa si aggiunge una riga al registro con versione e cosa è cambiato. Nel pannello c'è anche una colonna «programma verificato il» da compilare corso per corso."),
        steps("Dove compare", [["1", "Landing: riquadro «Ultimi aggiornamenti»"], ["2", "Scheda corso: registro completo"], ["3", "Area personale: «Nuova versione disponibile, riscaricala gratis»"]]),
    ],
    serve=["La regola del registro: una riga con versione e cosa è cambiato a ogni ricarica", "«Programma verificato il» compilato corso per corso"],
    call=["Concordare la regola: a ogni ricarica di una dispensa si aggiunge una riga al registro con versione e cosa è cambiato (il report la indica come necessaria per rendere affidabile «aggiornata il»)."],
    A=dict(
        dati=["Dispensa: versione, data, cosa è cambiato (registro aggiornamenti)", "Pannello: «programma verificato il» per corso"],
        funzioni=["Landing: riquadro «Ultimi aggiornamenti»; scheda corso: registro completo; area personale: avviso «Nuova versione disponibile, riscaricala gratis»", "Perché: è il modo più economico per creare fiducia e dare un motivo per tornare"],
        ricavi="—", dipendenze=["Regola del registro", "Servizio email (per le notifiche, più avanti)"],
        attivare=["Concordare la regola del registro", "Compilare «programma verificato il» corso per corso"],
        file=["Nel report (demo del 4 ottobre): config/sito.js (registro aggiornamenti), tools/genera_corsi.py"],
    ),
)

# ============================================================================================ S9
topic(
    key="prezzi", sez="9", titolo="Prezzi e piani: la proposta del report", lato="LA", gL=G_PRZ, gA=G_PRZ,
    breve="Account gratuito con 1 Appunti a scelta tra 3 esami, Appunti 4,99 €, Dispensa completa 12,99 €, Semestre 29,99 €, Anno 49,99 €, Plus 14,99 € una tantum, tutoring 20 €/ora.",
    problema="Ricavi senza perdere chi non paga: un account gratuito con 1 dispensa a scelta, poi singoli, pacchetti e Plus. I prezzi vanno confermati col sondaggio.",
    proposta="Listino proposto nel report (ipotesi da validare col sondaggio): account gratuito, Appunti, Dispensa completa 30L, Pacchetto Semestre, Pacchetto Anno, UniLink Plus (una tantum) e Tutoring 1-1. Il pacchetto semestre è il prodotto da spingere (in evidenza nella pagina prezzi). La pagina prezzi calcola il pacchetto per corso, anno e semestre.",
    dove_l="Pagina Prezzi (con calcolo del pacchetto per corso, anno e semestre) e scheda corso.", dove_a="Checkout e area personale (acquisti).",
    consiglio="Dal report (il parere sulla vostra proposta): 4,99 € per gli Appunti è giusto come prezzo d'impulso; 12,99 € per la completa ha senso se dentro ci sono davvero mappe, quiz e simulatore (oggi le mappe esistono per 17 corsi su 34 e il simulatore per 2: o si produce prima il materiale, o per i corsi senza mappe si scende a 9,99 €); pacchetto anno sì; Plus una tantum sì; tutoring in linea con la media di Firenze.",
    blocks=[
        lst("Cosa c'è nella demo del report (prezzi = ipotesi)", [
            ["Account gratuito", "1 Appunti a scelta tra 3 esami (uno per anno: Microeconomia, Macroeconomia, Finanza Aziendale, si cambiano in config) + 1 Appunti in regalo quando il primo amico invitato conferma l'email", "0 €"],
            ["Appunti", "La dispensa Appunti/Sbobine di un esame. Prezzo di lancio, poi 9,99 €", "4,99 €"],
            ["Dispensa completa 30L", "Appunti + Mappe (dove ci sono) + Quiz & Simulazioni + simulatore. Prezzo di lancio, poi 18,99 €", "12,99 €"],
            ["Pacchetto Semestre", "Tutte le dispense complete di un semestre del proprio corso (3–4 esami). Il «invece di» si calcola da solo (38,97–51,96 €)", "29,99 €"],
            ["Pacchetto Anno", "I due semestri. Proposta di Claude: da vendere soprattutto a settembre–ottobre", "49,99 €"],
            ["UniLink Plus", "Piano di studio per tutti gli esami, 30 giorni di esercizi, ripasso errori, CV benchmark completo. Vale fino a fine sessione (28/2, 31/7 o 30/9). Con un pacchetto costa 10 € in meno", "14,99 € una tantum"],
            ["Tutoring 1-1", "Con chi ha preso 30 in quell'esame; pacchetto 3 ore 54 €; 75% al mentor, 25% a UniLink. Proposta di Claude", "20 €/ora"],
        ]),
        steps("Il parere sulla vostra proposta (dal report)", [
            ["1", "4,99 € per gli Appunti: giusto come prezzo d'impulso. Per confronto, Studocu Premium costa circa 3–5 € al mese secondo fonti terze, ma è generico; il nostro è specifico per l'esame UniFi."],
            ["2", "12,99 € per la completa: ha senso se dentro ci sono davvero mappe, quiz e simulatore. Oggi le mappe esistono per 17 corsi su 34 e il simulatore per 2: o si produce prima il materiale, o per i corsi senza mappe si scende a 9,99 €."],
            ["3", "«4,99 invece di 9,99» con il prezzo barrato: per legge (art. 17-bis del Codice del Consumo, direttiva Omnibus) il prezzo barrato deve essere il più basso praticato nei 30 giorni prima. Se non abbiamo mai venduto a 9,99 € non possiamo barrarlo. Si può invece dire «prezzo di lancio fino al 31 dicembre, poi 9,99 €», che è un'eccezione prevista: la demo fa così."],
            ["4", "29,99 € «invece di 54,97»: il confronto è corretto solo se si calcola sui prezzi singoli veri. Con la completa a 12,99 € un semestre da 3–4 esami vale 38,97–51,96 €: la demo lo calcola da sola per ogni semestre."],
            ["5", "Pacchetto anno: sì. Si vende a inizio anno quando la motivazione è alta, incassa subito e fidelizza. Il rischio di «cannibalizzare» il semestre è basso: chi compra l'anno è chi avrebbe comprato due semestri."],
            ["6", "Plus una tantum: sì. Si studia a sessioni: un abbonamento mensile si disdice dopo l'esame e richiede gestione dei rinnovi e dei rimborsi. Una tantum per sessione è più semplice per tutti e si ricompra in modo naturale alla sessione dopo."],
            ["7", "Tutoring: a Firenze la media è circa 21,60 €/ora e gli studenti UniFi su Superprof chiedono 15–18 €/ora. A 20 €/ora con un mentor «certificato UniLink» siamo nella media; la piattaforma tiene il 25%."],
            ["8", "Potere d'acquisto: il pacchetto semestre è il prodotto da spingere (in evidenza nella pagina prezzi). I prezzi vanno comunque confermati col sondaggio."],
        ]),
    ],
    serve=["Sondaggio sui prezzi (vedi «Marketing, posizionamento e sondaggio»)", "Materiale prodotto: mappe (oggi 17 corsi su 34) e simulatore (oggi 2 corsi)", "Soggetto legale per incassare (vedi «Pagamenti»)"],
    call=["Confermate i prezzi di partenza? Quali 3 esami nel gratuito? Il regalo per invito resta 1 o cresce (1 ogni amico, massimo 3)? Plus ha senso già al lancio o dopo, quando il simulatore copre più esami?",
          "Prezzi: 4,99 / 12,99 / 29,99 / 49,99 / Plus 14,99 una tantum / tutoring 20 €/ora. Lanciamo il sondaggio a metà ottobre?",
          "Prezzo di lancio fino al 31/12 al posto del prezzo barrato: d'accordo?",
          "Gratuito: quali 3 esami (uno per anno)? Regalo per invito: 1 o più?"],
    A=dict(
        dati=["Account gratuito — 0 € — 1 Appunti a scelta tra 3 esami (uno per anno: Microeconomia, Macroeconomia, Finanza Aziendale) + 1 Appunti in regalo quando il primo amico invitato conferma l'email",
              "Appunti — 4,99 € (prezzo di lancio, poi 9,99 €) — dispensa Appunti/Sbobine di un esame",
              "Dispensa completa 30L — 12,99 € (prezzo di lancio, poi 18,99 €) — Appunti + Mappe (dove ci sono) + Quiz & Simulazioni + simulatore",
              "Pacchetto Semestre — 29,99 € — tutte le dispense complete di un semestre (3–4 esami); «invece di» calcolato da solo (38,97–51,96 €)",
              "Pacchetto Anno — 49,99 € — i due semestri; da vendere soprattutto a settembre–ottobre (proposta di Claude)",
              "UniLink Plus — 14,99 € una tantum — vale fino a fine sessione (28/2, 31/7 o 30/9); con un pacchetto costa 10 € in meno",
              "Tutoring 1-1 — 20 €/ora — con chi ha preso 30 in quell'esame; pacchetto 3 ore 54 €; 75% al mentor, 25% a UniLink (proposta di Claude)"],
        funzioni=["Prezzo barrato: solo «prezzo di lancio fino al 31 dicembre, poi 9,99 €» oppure prezzi davvero praticati nei 30 giorni prima (art. 17-bis Codice del Consumo)",
                  "Il «invece di» del pacchetto si calcola sui prezzi singoli veri, per ogni semestre",
                  "Plus una tantum per sessione, non abbonamento mensile (si disdice dopo l'esame e richiede gestione di rinnovi e rimborsi)",
                  "Il pacchetto semestre è il prodotto da spingere, in evidenza nella pagina prezzi"],
        ricavi="Prezzi del report (ipotesi da validare col sondaggio): 4,99 / 12,99 / 29,99 / 49,99 € · Plus 14,99 € una tantum · tutoring 20 €/ora (25% a UniLink).",
        dipendenze=["Sondaggio sui prezzi", "Mappe (17 corsi su 34) e simulatore (2 corsi) per giustificare 12,99 €", "Soggetto legale e Stripe"],
        attivare=["Lanciare il sondaggio sui prezzi (da metà ottobre per 10 giorni)", "Decidere i 3 esami gratuiti e la regola del regalo per invito", "Config dei prezzi (nel report: config/piani.js)"],
        file=["Nel report (demo del 4 ottobre): config/piani.js (prezzi, prezzo di lancio, dispensa gratuita, referral, ambassador, sessioni d'esame)"],
    ),
)

# ============================================================================================ S10
topic(
    key="plus", sez="10", titolo="UniLink Plus: il metodo, non i contenuti", lato="LA", gL=G_PRZ, gA=G_PRZ,
    breve="Plus costa 14,99 € una tantum, vale fino a fine sessione e comprende piano di studio multi-esame, test e simulatore, registro errori, esercizi quotidiani e Career completo. Le dispense restano a parte.",
    problema="Le dispense sono il prodotto più facile da copiare; il metodo (piano, test, simulazioni, registro errori, carriera) no. Plus è anche il prodotto che regge l'espansione: è uguale per tutte le scuole.",
    proposta="Plus è il «metodo», non i contenuti: le dispense si comprano a parte. Costa 14,99 € una tantum e vale fino alla fine della sessione; con un pacchetto costa 10 € in meno. Pagina pubblica #/plus con il confronto gratuito/Plus e i vantaggi per Economia; nell'app i limiti sono visibili (es. il piano gratuito segue un esame alla volta, il CV gratuito mostra 5 regole su 17).",
    dove_l="Pagina pubblica «Plus» (#/plus) con il confronto gratuito/Plus.", dove_a="Area personale: limiti visibili del piano gratuito e sblocchi di Plus.",
    consiglio="Alternative scartate (dal report): Plus con dentro le dispense (prezzo alto e confuso); abbonamento mensile (si disdice dopo l'esame); tutto gratis (niente ricavi dalla parte che costa di più costruire).",
    blocks=[
        cards("Gratis e Plus, a confronto", [
            ["Piano di studio", "Gratis: 1 esame alla volta. Plus: tutti gli esami della sessione, calendario unico, ottimizzatore degli obiettivi, coach."],
            ["Test e simulatore", "Gratis: prova da 5 domande. Plus: simulazioni a tempo con il punteggio vero e test dopo ogni capitolo, per tutti gli esami che hai."],
            ["Registro errori", "Gratis: —. Plus: le domande sbagliate tornano finché non le sai, con il motivo dell'errore."],
            ["Esercizi quotidiani", "Gratis: —. Plus: 30 giorni di «missioni» brevi."],
            ["Career", "Gratis: template CV e prime 5 regole. Plus: benchmark completo per 8 carriere, template in inglese, shortlist dei master con scadenze."],
            ["Avvisi", "Gratis: nuove versioni delle dispense. Plus: appelli, bandi Erasmus, scadenze dei master (nel report il testo di Plus è preceduto da «1.»: probabilmente un «+» venuto male, da confermare)."],
        ]),
        steps("Perché conviene a chi studia Economia (dal report)", [
            ["1", "Esami diversissimi nello stesso semestre: matematica, diritto e aziendale insieme. Il piano cambia metodo per ognuno invece di dare lo stesso calendario a tutti."],
            ["2", "Tanti esami a quiz ed esercizi (Statistica, Matematica, Banca, Bilancio): il simulatore con il punteggio vero è l'allenamento più vicino alla prova."],
            ["3", "La media conta per il dopo: magistrali e master (Bocconi, LSE, HEC…) guardano la media; l'ottimizzatore distribuisce il tempo per tenerla più alta possibile."],
            ["4", "Carriere con standard rigidi: finance, consulting e audit scartano i CV fatti male in pochi secondi; il benchmark dice cosa manca."],
        ]),
    ],
    serve=["Piano di studio multi-esame, simulatore, registro errori ed esercizi quotidiani costruiti (vedi le card su simulatore e piano di studio)", "Career completo (CV benchmark per 8 carriere)"],
    call=["Plus: piano multi-esame, test e simulatore, registro errori, Career completo; le dispense restano a parte. D'accordo?",
          "Plus ha senso già al lancio o dopo, quando il simulatore copre più esami?"],
    A=dict(
        dati=["Piano di studio — Gratis: 1 esame alla volta · Plus: tutti gli esami della sessione, calendario unico, ottimizzatore, coach",
              "Test e simulatore — Gratis: prova da 5 domande · Plus: simulazioni a tempo con il punteggio vero e test dopo ogni capitolo",
              "Registro errori — Gratis: — · Plus: le domande sbagliate tornano finché non le sai, con il motivo dell'errore",
              "Esercizi quotidiani — Gratis: — · Plus: 30 giorni di «missioni» brevi",
              "Career — Gratis: template CV e prime 5 regole su 17 · Plus: benchmark completo per 8 carriere, template in inglese, shortlist dei master con scadenze",
              "Avvisi — Gratis: nuove versioni delle dispense · Plus: appelli, bandi Erasmus, scadenze dei master"],
        funzioni=["Plus vale fino alla fine della sessione (28/2, 31/7 o 30/9); con un pacchetto costa 10 € in meno",
                  "Pagina pubblica #/plus con il confronto; nell'app i limiti sono visibili",
                  "Perché: le dispense si copiano facilmente, il metodo no; Plus è uguale per tutte le scuole, quindi regge l'espansione",
                  "Alternative scartate: Plus con dentro le dispense, abbonamento mensile, tutto gratis"],
        ricavi="14,99 € una tantum (ipotesi del report); con un pacchetto 10 € in meno.",
        dipendenze=["Simulatore e piano di studio multi-esame costruiti", "CV benchmark completo"],
        attivare=["Decidere se Plus parte al lancio o dopo, quando il simulatore copre più esami", "Contenuti del config nel report: config/hub.js (contenuti di Plus)"],
        file=["Nel report (demo del 4 ottobre): config/hub.js (contenuti di Plus), config/piani.js"],
    ),
)

# ============================================================================================ S11
topic(
    key="pagamenti", sez="11", titolo="Pagamenti e soggetto legale", lato="LA", gL=G_PRZ, gA=G_PRZ,
    breve="Prima di scegliere come incassare serve chi incassa: oggi UniLink non ha un soggetto legale. Il report propone Stripe Checkout, da decidere con un commercialista.",
    problema="Oggi UniLink non ha un soggetto legale: senza, non si può vendere né pagare ambassador e mentor. Finché non c'è, nella demo il pagamento è simulato.",
    proposta="Le strade tipiche per avere un soggetto sono un'associazione, una partita IVA (regime forfettario) di uno dei founder o una società: ognuna ha costi e obblighi diversi e va scelta con un commercialista. Poi si incassa con Stripe Checkout (consigliato nel report). Nel checkout c'è già la casella per rinunciare al recesso sui contenuti digitali; le pagine «Termini» e «Privacy» sono bozze da far scrivere bene quando esiste il soggetto.",
    dove_l="Checkout e pagine «Termini» e «Privacy».", dove_a="Checkout (con casella di rinuncia al recesso) e acquisti.",
    consiglio="Dal report: Stripe Checkout è l'opzione consigliata. Per i contenuti digitali il diritto di recesso si perde solo se il cliente chiede di riceverli subito e lo accetta espressamente: nel checkout c'è la casella apposita.",
    blocks=[
        cards("Come incassare: le opzioni", [
            ["Stripe Checkout (consigliato)", "Pro: carta, Apple Pay, Google Pay; nessun canone; per le carte europee standard 1,5% + 0,25 € a transazione; si collega a Supabase; esistono anche «payment link» senza codice. Contro: serve un soggetto con conto e dati fiscali."],
            ["PayPal", "Pro: molto conosciuto. Contro: commissioni più alte, esperienza meno fluida."],
            ["Satispay", "Pro: diffuso tra gli studenti italiani. Contro: da aggiungere dopo, non come unico metodo."],
            ["Rivenditori «merchant of record» (es. Paddle, Lemon Squeezy)", "Pro: gestiscono loro IVA e fatture. Contro: commissioni più alte; serve comunque qualcuno che riceva i soldi."],
        ]),
        steps("Strade per avere un soggetto legale", [["1", "Un'associazione"], ["2", "Una partita IVA (regime forfettario) di uno dei founder"], ["3", "Una società"]]),
        nota("Già previsto nella demo del report: per i contenuti digitali il diritto di recesso si perde solo se il cliente chiede di riceverli subito e lo accetta espressamente: nel checkout c'è la casella apposita. Le pagine «Termini» e «Privacy» sono bozze da far scrivere bene quando esiste il soggetto."),
    ],
    serve=["Un soggetto legale (scelto con un commercialista)", "Un conto e dati fiscali per Stripe", "Pagine «Termini» e «Privacy» scritte bene"],
    call=["Chi parla con un commercialista e entro quando? Domande da fare: forma più semplice per vendere contenuti digitali a studenti; IVA sui contenuti digitali; come pagare mentor e ambassador.",
          "Soggetto legale: chi sente un commercialista e entro quando?"],
    A=dict(
        dati=["Stripe Checkout (consigliato) — carta, Apple Pay, Google Pay; nessun canone; carte europee standard 1,5% + 0,25 € a transazione; si collega a Supabase; esistono «payment link» senza codice",
              "PayPal — molto conosciuto; commissioni più alte, esperienza meno fluida",
              "Satispay — diffuso tra gli studenti italiani; da aggiungere dopo, non come unico metodo",
              "Merchant of record (Paddle, Lemon Squeezy) — gestiscono IVA e fatture; commissioni più alte; serve comunque chi riceve i soldi"],
        funzioni=["Checkout con casella di rinuncia al recesso per i contenuti digitali (il recesso si perde solo se il cliente chiede di riceverli subito e lo accetta espressamente)",
                  "Pagine «Termini» e «Privacy»: bozze da far scrivere bene quando esiste il soggetto"],
        ricavi="Stripe: 1,5% + 0,25 € a transazione sulle carte europee standard (dal report).",
        dipendenze=["Soggetto legale (associazione, partita IVA forfettaria di un founder o società)", "Conto e dati fiscali"],
        attivare=["Parlare con un commercialista (forma più semplice per vendere contenuti digitali a studenti; IVA sui contenuti digitali; come pagare mentor e ambassador)", "Poi Stripe Checkout"],
        file=["Nel report: nessun file (nella demo il pagamento è simulato)"],
    ),
)

# ============================================================================================ S12
topic(
    key="referral", sez="12", titolo="Referral e campus ambassador", lato="LA", gL=G_CRE, gA=G_CRE,
    breve="Ogni account ha un codice fisso e un link di invito; gli ambassador hanno una pagina pubblica con candidatura e, nell'area personale, una dashboard con i crediti (20% del venduto).",
    problema="Il canale principale oggi è WhatsApp: le persone che stanno nei gruppi valgono più di qualsiasi pubblicità. Un codice fisso si ricorda e si può stampare su un volantino.",
    proposta="Referral: ogni account ha un codice fisso e unico (es. UL-D96C) e un link …?ref=UL-D96C. Chi si iscrive col link vede chi l'ha invitato; quando conferma l'email UniFi scatta il regalo per chi ha invitato. Un'email, un regalo: non si può barare con account falsi. Ambassador: pagina pubblica con candidatura; nell'area personale l'ambassador vede iscritti, confermati, venduto, i suoi crediti (20% del venduto) e un messaggio pronto per il gruppo WhatsApp col suo codice. Si possono avere più ambassador per anno e corso, ognuno col suo codice. Percorso verso il ruolo di mentor. All'inizio gli ambassador ricevono crediti (dispense, Plus) invece di soldi; quando c'è il soggetto legale si passa alla commissione in denaro con le regole giuste.",
    dove_l="Pagina pubblica «Ambassador» con candidatura; volantini con QR e codice in aula e a Novoli.", dove_a="Area personale: «Invita amici» (codice fisso, link, WhatsApp, avanzamento) e dashboard dell'ambassador.",
    consiglio="Alternative scartate (dal report): codici diversi a ogni invito (più complicati da ricordare); pagare gli ambassador in denaro da subito (senza soggetto legale crea problemi fiscali a loro e a noi); sconti al posto dei regali (abbassano il prezzo percepito).",
    blocks=[
        cards("Come funziona", [
            ["Referral", "Codice fisso e unico per account (es. UL-D96C) e link …?ref=UL-D96C. Chi si iscrive col link vede chi l'ha invitato; quando conferma l'email UniFi scatta il regalo per chi ha invitato. Le regole (quanti amici per un regalo, quanti regali al massimo) sono nel config dei piani."],
            ["Ambassador", "Pagina pubblica con candidatura. Nell'area personale: iscritti, confermati, venduto, crediti (20% del venduto) e messaggio pronto per il gruppo WhatsApp col suo codice. Più ambassador per anno e corso, ognuno col suo codice."],
            ["Crediti", "All'inizio gli ambassador ricevono crediti (dispense, Plus) invece di soldi. Quando c'è il soggetto legale si passa alla commissione in denaro con le regole giuste."],
        ]),
    ],
    serve=["Soggetto legale per passare dai crediti alla commissione in denaro", "Regole del regalo: quanti amici per un regalo, quanti regali al massimo"],
    call=["Ambassador: commissione 20% in crediti finché non si può pagare. Quanti per anno?",
          "Gratuito: quali 3 esami (uno per anno)? Regalo per invito: 1 o più? (1 ogni amico, massimo 3?)"],
    A=dict(
        dati=["Codice fisso e unico per account (es. UL-D96C) e link …?ref=UL-D96C",
              "Ambassador: iscritti, confermati, venduto, crediti (20% del venduto)",
              "Più ambassador per anno e corso, ognuno col suo codice",
              "Candidature da accettare o rifiutare (nel pannello del team)"],
        funzioni=["Chi si iscrive col link vede chi l'ha invitato; il regalo scatta quando conferma l'email UniFi (un'email, un regalo)",
                  "Messaggio pronto per il gruppo WhatsApp con il codice dell'ambassador",
                  "Crediti (dispense, Plus) al posto del denaro finché non c'è il soggetto legale; poi commissione in denaro",
                  "Percorso verso il ruolo di mentor"],
        ricavi="Ambassador: crediti pari al 20% del venduto (all'inizio in crediti, non in denaro).",
        dipendenze=["Soggetto legale per pagare in denaro", "Email UniFi verificata (anti-account falsi)"],
        attivare=["Decidere il numero di ambassador per anno", "Decidere la regola del regalo per invito (1 o 1 ogni amico, massimo 3)", "Regole in config (nel report: config/piani.js)"],
        file=["Nel report (demo del 4 ottobre): config/piani.js (referral, ambassador); schermate «Invita amici» e «Ambassador»"],
    ),
)

# ============================================================================================ S17
topic(
    key="susbus", sez="17", titolo="SUSBUS e SECI: iscrizione e richieste", lato="LA", gL=G_CRE, gA=G_STU,
    breve="Due corsi triennali UniFi diversi da EA ed EC: si scelgono alla registrazione e, nel catalogo, compaiono i loro esami con il pulsante «Chiedi»; le richieste misurano la domanda.",
    problema="Produrre dispense costa molto: prima si misura quanta domanda c'è e per quali esami.",
    proposta="SUSBUS (Sustainable Business for Societal Challenges, B314) è della Scuola di Economia, interamente in inglese, a numero programmato: condivide con EA le basi aziendali (contabilità, diritto, statistica) ma ha esami propri su sostenibilità e impatto. SECI (Sviluppo sostenibile, cooperazione e gestione dei conflitti) è un corso di scienze sociali con tre curricula al terzo anno (Economia Politica, Scienza Politica, Sociologia, Relazioni internazionali, Diritto internazionale): con EA/EC coincide poco. Si possono scegliere alla registrazione. Nel catalogo, scegliendo SUSBUS o SECI compare la lista dei loro esami (dalle pagine ufficiali) con la dispensa UniLink «più vicina» e il pulsante «Chiedi». Le richieste finiscono nel pannello.",
    dove_l="Catalogo (filtro per corso di laurea) e scelta del corso alla registrazione.", dove_a="Registrazione (scelta del corso di laurea) e pannello del team (richieste).",
    consiglio="Alternative scartate (dal report): produrre subito per tutti e due (rischio di lavorare per pochi); ignorarli (si perde un pubblico vicino che è già a Novoli).",
    blocks=[
        cards("I due corsi", [
            ["SUSBUS (B314)", "Sustainable Business for Societal Challenges: Scuola di Economia, interamente in inglese, a numero programmato. Condivide con EA le basi aziendali (contabilità, diritto, statistica); esami propri su sostenibilità e impatto."],
            ["SECI", "Sviluppo sostenibile, cooperazione e gestione dei conflitti: corso di scienze sociali con tre curricula al terzo anno: Economia Politica, Scienza Politica, Sociologia, Relazioni internazionali, Diritto internazionale. Con EA/EC coincide poco."],
        ]),
        steps("Come funziona", [["1", "Il corso si sceglie alla registrazione"], ["2", "Nel catalogo compare la lista degli esami (dalle pagine ufficiali) con la dispensa UniLink «più vicina» e il pulsante «Chiedi»"], ["3", "Le richieste finiscono nel pannello"], ["4", "Quando un esame supera una soglia di richieste, si cercano i materiali e si produce come per gli altri corsi"]]),
    ],
    serve=["Lista degli esami per corso (nel report: config/corsi-di-laurea.js, con EA, EC, SUSBUS, SECI)", "Una soglia di richieste oltre la quale produrre la dispensa"],
    call=["SUSBUS e SECI: richieste ora, dispense quando superano una soglia (quale?)."],
    A=dict(
        dati=["Corso di laurea scelto alla registrazione (EA, EC, SUSBUS, SECI)", "Richieste «Chiedi» per esame (contate nel pannello)"],
        funzioni=["Catalogo filtrato per corso: lista esami dalle pagine ufficiali + dispensa UniLink «più vicina» + «Chiedi»", "Soglia di richieste: oltre la soglia si cercano i materiali e si produce come per gli altri corsi"],
        ricavi="—", dipendenze=["Soglia di richieste da decidere", "Pubblico già a Novoli"],
        attivare=["Elenco esami per corso di laurea", "Decidere la soglia"],
        file=["Nel report (demo del 4 ottobre): config/corsi-di-laurea.js (EA, EC, SUSBUS, SECI con gli esami)"],
    ),
)

# ============================================================================================ S18
topic(
    key="metriche", sez="18", titolo="Metriche e tracciamento", lato="LA", gL=G_MIS, gA=G_TEA,
    breve="Un piano di tracciamento a due livelli (sito Framer anonimo, app con consenso), KPI settimanali e «porte finte» per capire cosa costruire.",
    problema="Il sito carica Google Analytics 4: conta visite, pagine e provenienza, ma non sa quale pulsante viene cliccato, quanti arrivano alla registrazione o cosa succede dopo.",
    proposta="Un piano di tracciamento: per ogni evento dice dove si misura, quando, con quali dati e quale decisione aiuta a prendere. Due livelli: sul sito Framer (anonimo) click sui pulsanti per posizione, apertura delle anteprime, sezione prezzi vista, uso dei tool, provenienza (WhatsApp, Instagram, Google, referral), con Google Tag Manager (due righe nelle impostazioni del sito Framer, sezione Custom Code) più il Cookie Banner di Framer per il consenso; nell'app (con il consenso) registrazione, email confermata, dispensa gratis scelta, download, quiz, piani, sessioni spuntate, questionario dopo l'esame, CV, checkout, acquisti, condivisioni del link, clic sulle «porte finte», richieste di materiale, segnalazioni di errori.",
    dove_l="Sito Framer: Google Tag Manager + Cookie Banner; parametro ?from= sui pulsanti verso l'app.", dove_a="App (con il consenso) e pannello del team (schede «Tracciamento» e «Panoramica»).",
    consiglio="Dal report: il trucco principale è senza codice: ogni pulsante verso l'app ha un parametro (?from=hero, ?from=corso, ?from=prezzi) che Tag Manager legge e che l'app salva con l'iscrizione. Senza consenso alle statistiche gli eventi restano anonimi.",
    blocks=[
        lst("I numeri da guardare ogni settimana (obiettivi iniziali = ipotesi)", [
            ["Conversione landing → account", "iscrizioni / visitatori unici", "> 8%"],
            ["Attivazione", "account con un download entro 24 ore / nuovi account", "> 60%"],
            ["Ritorno a 4 settimane", "attivi nella settimana 4 / iscritti di quella settimana", "> 25%"],
            ["Fattore referral", "amici confermati / utenti che condividono", "> 0,5"],
            ["Conversione a pagamento", "acquirenti / account attivi", "> 5% nella prima sessione"],
            ["North Star", "studenti attivi a settimana (download, quiz o piano)", "crescita costante"],
        ]),
        nota("«Porte finte» (dal report): sono pulsanti di funzioni che non esistono ancora (lettera di presentazione, mentor 1-1, offerte di stage, piano con AI, simulatore per altri esami, tutoring). Chi clicca viene messo in lista d'attesa e il clic viene contato. È il modo più economico per sapere cosa costruire prima di spendere tempo e soldi."),
        cards("I due livelli", [["Sul sito Framer (anonimo)", "Click sui pulsanti per posizione, apertura delle anteprime, sezione prezzi vista, uso dei tool, provenienza (WhatsApp, Instagram, Google, referral)."], ["Nell'app (con il consenso)", "Registrazione, email confermata, dispensa gratis scelta, download, quiz, piani, sessioni spuntate, questionario dopo l'esame, CV, checkout, acquisti, condivisioni del link, clic sulle «porte finte», richieste di materiale, segnalazioni di errori."]]),
    ],
    serve=["Google Tag Manager installato su Framer (due righe in Custom Code)", "Cookie Banner di Framer per il consenso", "Guida passo passo (nel report: docs/framer_tracking.md)"],
    call=["Tracciamento: chi installa Google Tag Manager e il Cookie Banner su Framer?"],
    A=dict(
        dati=["Conversione landing → account = iscrizioni / visitatori unici — obiettivo > 8% (ipotesi)",
              "Attivazione = account con un download entro 24 ore / nuovi account — > 60%",
              "Ritorno a 4 settimane = attivi nella settimana 4 / iscritti di quella settimana — > 25%",
              "Fattore referral = amici confermati / utenti che condividono — > 0,5",
              "Conversione a pagamento = acquirenti / account attivi — > 5% nella prima sessione",
              "North Star = studenti attivi a settimana (download, quiz o piano) — crescita costante",
              "«Porte finte»: lettera di presentazione, mentor 1-1, offerte di stage, piano con AI, simulatore per altri esami, tutoring"],
        funzioni=["Piano di tracciamento: per ogni evento dove si misura, quando, con quali dati e quale decisione aiuta a prendere",
                  "Sul sito Framer (anonimo) con Google Tag Manager + Cookie Banner; nell'app solo con il consenso (senza consenso gli eventi restano anonimi)",
                  "Parametro ?from=hero / ?from=corso / ?from=prezzi: letto da Tag Manager e salvato dall'app con l'iscrizione",
                  "Chi clicca una «porta finta» va in lista d'attesa e il clic viene contato"],
        ricavi="—", dipendenze=["Google Tag Manager e Cookie Banner su Framer", "Consenso (statistiche e marketing facoltativi, separati da termini e privacy)"],
        attivare=["Installare Google Tag Manager (due righe in Custom Code) e il Cookie Banner su Framer", "Aggiungere ?from= ai pulsanti verso l'app"],
        file=["Nel report (demo del 4 ottobre): config/tracking.js (eventi da tracciare e KPI), docs/framer_tracking.md"],
    ),
)

# ============================================================================================ S20
topic(
    key="tool", sez="20", titolo="Architettura dei tool: universali, di scuola, di livello", lato="LA", gL=G_STR, gA=G_TEA,
    breve="I tool sono in un registro: per ognuno si sa a quali scuole e livelli serve, in che stato è e cosa si fa di quelli già esistenti (tenere, unire, spostare).",
    problema="Crescere su altre scuole e sulla magistrale senza rifare tutto: per ogni tool si deve sapere a chi serve, in che stato è e cosa facciamo di quelli che esistono già.",
    proposta="Tre famiglie. Universali: un solo motore, con le regole di ogni scuola (voto di laurea, libretto, piano di studio, Erasmus, CV, scadenze, tasse e borse). Di scuola: utili solo lì, e spesso il valore è il tool stesso (a Economia simulatore e Master finder; a Ingegneria esercizi passo passo e propedeuticità; a Giurisprudenza flashcard sui codici e simulatore d'orale; a Medicina tracker dei tirocini). Di livello: tesi, stage e placement, dottorati, per magistrale e ciclo unico. Nella pagina Tools si filtrano per scuola e per livello; quelli che non esistono ancora sono segnati come «Idea» e hanno un pulsante «Mi serve» che conta l'interesse.",
    dove_l="Pagina Tools (filtri per scuola e per livello; «Idea» con pulsante «Mi serve»).", dove_a="Area personale: libretto, shortlist e scadenze, checklist; pulsante «segnala» al posto del gruppo WhatsApp per i problemi dei tool.",
    consiglio="Dal report: il calcolatore voto di laurea resta pubblico (è il più cercato su Google) e nell'account ricorda i voti; Erasmus + Destinazioni si uniscono in un solo tool; Master/Magistrale resta con consultazione pubblica e shortlist nell'account; la Guida PDF va nell'account (meglio pagine web per Google + checklist nell'account).",
    blocks=[
        cards("Le tre famiglie", [["Universali", "Un solo motore, con le regole di ogni scuola: voto di laurea, libretto, piano di studio, Erasmus, CV, scadenze, tasse e borse."], ["Di scuola", "Utili solo lì: Economia simulatore e Master finder; Ingegneria esercizi passo passo e propedeuticità; Giurisprudenza flashcard sui codici e simulatore d'orale; Medicina tracker dei tirocini."], ["Di livello", "Tesi, stage e placement, dottorati, per magistrale e ciclo unico."]]),
        lst("Tool di oggi: decisione e perché", [
            ["Calcolatore voto di laurea", "Il più cercato su Google: resta pubblico; nell'account ricorda i voti", "Tenere"],
            ["Calcolatore Erasmus + Destinazioni", "Un solo tool «Erasmus»: punteggio, mete compatibili, learning agreement. Lista da aggiornare a ogni bando", "Unire"],
            ["Master / Magistrale", "Consultazione pubblica; shortlist e scadenze nell'account", "Tenere"],
            ["Esploratore di carriera", "Contenuto unico; da collegare al CV benchmark della stessa traiettoria", "Tenere"],
            ["Guida (PDF)", "Meglio pagine web (Google) + checklist nell'account", "Nell'account"],
        ]),
        cards("Da verificare", [["Dati Erasmus", "Il foglio si chiama «2021-2»: aggiornare al bando 2026/27."], ["Prova finale", "Il regolamento usato è del 2017/2018: confermare quello in vigore."], ["Master finder", "Righe incomplete (nell'Excel il ritorno sull'investimento dà errore); spiegare in pagina i criteri delle fasce."], ["Supporto", "«Scrivi sul gruppo WhatsApp» per i problemi dei tool diventa il pulsante «segnala» nell'app."]]),
    ],
    serve=["Registro dei tool (nel report: config/hub.js) con scuole, livelli, stato e decisione", "Le quattro verifiche elencate in «Da verificare»"],
    call=["Nel report l'architettura dei tool non ha una domanda esplicita per la call; le «Da verificare» (dati Erasmus, regolamento prova finale, Master finder, supporto) sono da chiudere."],
    A=dict(
        dati=["Tool di oggi: calcolatore voto di laurea (tenere), calcolatore Erasmus + destinazioni (unire), Master/Magistrale (tenere), esploratore di carriera (tenere), guida PDF (nell'account)",
              "Per ogni tool: scuole e livelli a cui serve, stato, decisione",
              "Da verificare: dati Erasmus «2021-2» → bando 2026/27; regolamento prova finale 2017/2018; Master finder (righe incomplete); supporto → pulsante «segnala»"],
        funzioni=["Famiglie: universali (un motore, regole per scuola), di scuola, di livello (tesi, stage e placement, dottorati)",
                  "Tool non ancora esistenti: «Idea» con pulsante «Mi serve» che conta l'interesse"],
        ricavi="—", dipendenze=["Dati Erasmus aggiornati al bando 2026/27", "Regolamento della prova finale in vigore"],
        attivare=["Chiudere le quattro verifiche", "Collegare l'Esploratore di carriera al CV benchmark della stessa traiettoria"],
        file=["Nel report (demo del 4 ottobre): config/hub.js (scuole, registro dei tool, contenuti di Plus)"],
    ),
)

# ============================================================================================ S21
topic(
    key="marketing", sez="21", titolo="Marketing e sondaggio sui prezzi", lato="L", gL=G_CRE, gA=None,
    breve="Posizionamento «Da studenti per studenti, gli appunti da 30 e lode e un piano per arrivarci», cinque canali in ordine di priorità e un sondaggio sui prezzi (almeno 100 risposte).",
    problema="Servono prezzi fissati su dati veri: capire quale pacchetto preferiscono gli studenti e se Plus interessa.",
    proposta="Posizionamento: «Da studenti per studenti, gli appunti da 30 e lode e un piano per arrivarci». Onesto, mai aziendale (come oggi), ma con una promessa più concreta: non solo materiale, anche metodo. Canali in ordine di priorità: WhatsApp, referral e ambassador, Google, Instagram, in aula e a Novoli. Sondaggio sui prezzi: 12 domande in 3 minuti su Tally (gratuito), con 4 domande «Van Westendorp» sul pacchetto semestre.",
    dove_l="Fuori dal sito: gruppi WhatsApp, Instagram, Google (Search Console), volantini in aula e a Novoli; sondaggio su Tally.",
    consiglio="Dal report: il sondaggio parte da metà ottobre per 10 giorni, analisi entro fine mese, prezzi pronti a novembre, prima della sessione invernale.",
    blocks=[
        steps("Canali, in ordine di priorità", [
            ["1", "WhatsApp: resta il canale principale (libreria messaggi già pronta). Ogni messaggio con utm_source=whatsapp e, per gli ambassador, il loro codice."],
            ["2", "Referral e ambassador: il codice fisso trasforma ogni studente in un canale."],
            ["3", "Google: le schede corso pubbliche; inviare la sitemap a Search Console (oggi 32 pagine su 50 non sono note a Google) e correggere gli indirizzi con refusi."],
            ["4", "Instagram: reel e caroselli brevi del tipo «come si passa Microeconomia», con link alla scheda corso. Il canale dove gli studenti passano più tempo dopo WhatsApp."],
            ["5", "In aula e a Novoli: QR sui volantini con il codice dell'ambassador del corso."],
        ]),
        cards("Sondaggio sui prezzi", [
            ["Perché", "Per fissare i prezzi su dati veri, capire quale pacchetto preferiscono e se Plus interessa."],
            ["Come", "12 domande in 3 minuti su Tally (gratuito); 4 domande «Van Westendorp» sul pacchetto semestre (a che prezzo è troppo economico, un affare, caro ma lo prenderei, troppo caro)."],
            ["Dove", "Gruppi WhatsApp di 1°, 2° e 3° anno, storia Instagram, email ai 78 iscritti, ambassador in aula."],
            ["Quando", "Da metà ottobre per 10 giorni, analisi entro fine mese, prezzi pronti a novembre, prima della sessione invernale."],
            ["Incentivo", "Una dispensa Appunti gratis a chi risponde (porta anche iscrizioni)."],
            ["Obiettivo", "Almeno 100 risposte, almeno 30 per anno. Testo pronto nel report (docs/sondaggio_prezzi.md)."],
        ]),
    ],
    serve=["Tally (gratuito)", "Sitemap inviata a Search Console e indirizzi con refusi corretti", "Libreria di messaggi WhatsApp (già pronta) con utm_source=whatsapp"],
    call=["Prezzi: lanciamo il sondaggio a metà ottobre? (decisione 7 del report)"],
)

# ============================================================================================ S22
topic(
    key="rischi", sez="22", titolo="Rischi e cose legali", lato="LA", gL=G_MIS, gA=G_MIS,
    breve="Nove temi legali e di rischio: soggetto legale, contenuti e diritti, nome e logo UniFi, prezzi barrati, recesso, privacy, numeri pubblici, PACRAR, qualità dei quiz.",
    problema="Obbligatori quando si vende: soggetto legale, privacy, termini, fonti, consenso cookie e recesso.",
    proposta="Il report elenca nove temi con cosa fare per ciascuno (tabella qui sotto). Alcuni sono già nella demo del report (nome UniFi nel footer, casella di recesso, informativa e consensi separati, esportazione e cancellazione dei dati dal profilo).",
    dove_l="Pagine «Termini», «Privacy», «Fonti e diritti», footer, checkout, banner cookie.", dove_a="Registrazione (consensi separati), profilo (esportazione e cancellazione dati), checkout (recesso), termini d'uso.",
    consiglio="Dal report: senza soggetto legale non si può vendere né pagare ambassador e mentor: è la prima cosa da sistemare (vedi «Pagamenti»).",
    blocks=[
        cards("Tema → cosa fare", [
            ["Soggetto legale", "Senza, non si può vendere né pagare ambassador e mentor. Prima cosa da sistemare (vedi «Pagamenti»)."],
            ["Contenuti e diritti", "Le dispense rielaborano programmi e testi dei docenti. Regola: solo rielaborazioni originali, niente copie di slide o capitoli; pagina «Fonti e diritti»; rimozione rapida su segnalazione."],
            ["Nome e logo UniFi", "UniLink è indipendente: dirlo chiaramente (già nel footer della demo). Attenzione all'uso del logo dell'Università nelle copertine e sul sito se si vende."],
            ["Prezzi barrati", "Solo «prezzo di lancio» con aumento annunciato, o prezzi davvero praticati nei 30 giorni prima (art. 17-bis Codice del Consumo)."],
            ["Recesso", "Casella di rinuncia al recesso per i contenuti digitali nel checkout (già nella demo)."],
            ["Privacy (GDPR)", "Informativa, consensi separati, banner cookie con Consent Mode, esportazione e cancellazione dei dati dal profilo (già nella demo). Se in futuro i profili vengono mostrati ad aziende serve un consenso specifico."],
            ["Numeri pubblici", "I contatori in home (200+ studenti, 95% soddisfatti) devono essere dimostrabili."],
            ["PACRAR", "Citare la fonte o chiedere il permesso prima di usare il nome in un prodotto a pagamento."],
            ["Qualità dei quiz", "Correggere sequenza delle risposte e stile delle domande prima di venderli."],
        ]),
    ],
    serve=["Soggetto legale", "Pagine «Termini», «Privacy» e «Fonti e diritti» scritte bene", "Consenso specifico se in futuro i profili vengono mostrati ad aziende"],
    call=["Soggetto legale: chi sente un commercialista e entro quando?", "Piano di studio: contattiamo Alessandro de Concini? (nome PACRAR)"],
    A=dict(
        dati=["Soggetto legale — senza, non si può vendere né pagare ambassador e mentor",
              "Contenuti e diritti — solo rielaborazioni originali, niente copie di slide o capitoli; pagina «Fonti e diritti»; rimozione rapida su segnalazione",
              "Nome e logo UniFi — UniLink è indipendente: dirlo chiaramente; attenzione al logo dell'Università su copertine e sito",
              "Prezzi barrati — solo «prezzo di lancio» con aumento annunciato, o prezzi praticati nei 30 giorni prima (art. 17-bis Codice del Consumo)",
              "Recesso — casella di rinuncia per i contenuti digitali nel checkout",
              "Privacy (GDPR) — informativa, consensi separati, banner cookie con Consent Mode, esportazione e cancellazione dei dati; consenso specifico se i profili vanno ad aziende",
              "Numeri pubblici — contatori in home dimostrabili",
              "PACRAR — citare la fonte o chiedere il permesso",
              "Qualità dei quiz — correggere sequenza delle risposte e stile delle domande prima di venderli"],
        funzioni=["Consensi separati: termini e privacy obbligatori, statistiche e marketing facoltativi; senza consenso alle statistiche gli eventi restano anonimi"],
        ricavi="—", dipendenze=["Soggetto legale", "Commercialista"],
        attivare=["Sistemare per primo il soggetto legale", "Scrivere bene Termini, Privacy e Fonti e diritti"],
        file=["Nel report: bozze di privacy, termini e fonti nella demo del 4 ottobre"],
    ),
)

# ============================================================================================ S23
topic(
    key="online", sez="23", titolo="Per andare online: le sei fasi", lato="LA", gL=G_MIS, gA=G_MIS,
    breve="Sequenza in sei fasi con costo stimato: sistemare il sito di oggi, backend Supabase, web app su app.unilinkfirenze.it, soggetto legale + Stripe, contenuti, AI solo in Plus.",
    problema="La demo del report gira sul computer e i dati stanno nel browser: per andare online servono backend, hosting, soggetto legale e contenuti.",
    proposta="Il report indica sei fasi in ordine, ognuna con il costo stimato (tabella qui sotto). Il codice della demo è pensato per questo passaggio: lo store ha le stesse tabelle che andrebbero su Supabase, le scelte di business sono già in file separati e le pagine non cambiano.",
    dove_l="Fase 1 sul sito Framer (sitemap, Google Tag Manager, Cookie Banner, pulsanti con ?from=).", dove_a="Fasi 2, 3 e 6: Supabase, web app su app.unilinkfirenze.it, AI per piano e CV (solo Plus).",
    consiglio="Dal report: Supabase ha un piano gratuito (50.000 utenti attivi al mese, 500 MB di database, 1 GB di file); attenzione, i progetti gratuiti si mettono in pausa dopo una settimana senza attività.",
    blocks=[
        steps("Le sei fasi", [
            ["1", "Sistemare il sito di oggi: errori elencati in «Il sito di oggi», sitemap, Google Tag Manager e Cookie Banner su Framer, pulsanti con ?from= · Costo stimato: 0 €"],
            ["2", "Backend: Supabase (login con link email, database con le stesse tabelle della demo, storage privato dei PDF, filigrana sul server). Il piano gratuito include 50.000 utenti attivi al mese, 500 MB di database e 1 GB di file; i progetti gratuiti si mettono in pausa dopo una settimana senza attività · Costo stimato: 0 € all'inizio, poi il piano Pro"],
            ["3", "Web app su app.unilinkfirenze.it (hosting statico gratuito, es. GitHub Pages, già usato per l'HQ), partendo dal codice della demo · Costo stimato: 0 € + dominio già nostro"],
            ["4", "Soggetto legale + Stripe · Costo stimato: costi del commercialista e della forma scelta; Stripe solo a commissione"],
            ["5", "Contenuti: quiz corretti, più esami nel simulatore, mappe del 3° anno, Topics in Corporate Finance e Diritto del Lavoro · Costo stimato: tempo"],
            ["6", "AI per rifinire piano e CV, solo in Plus · Costo stimato: pochi centesimi per studente"],
        ]),
    ],
    serve=["Account Supabase", "Dominio app.unilinkfirenze.it (già nostro)", "Soggetto legale + Stripe", "Quiz corretti e più esami nel simulatore"],
    call=["Struttura: landing su Framer + app su app.unilinkfirenze.it. Va bene? (decisione 1 del report)"],
    A=dict(
        dati=["Fase 1 — sistemare il sito di oggi (errori, sitemap, Google Tag Manager, Cookie Banner, pulsanti con ?from=) — 0 €",
              "Fase 2 — backend Supabase (login con link email, database con le stesse tabelle della demo, storage privato dei PDF, filigrana sul server) — 0 € all'inizio, poi il piano Pro",
              "Fase 3 — web app su app.unilinkfirenze.it (hosting statico gratuito, es. GitHub Pages) — 0 € + dominio già nostro",
              "Fase 4 — soggetto legale + Stripe — costi del commercialista e della forma scelta; Stripe solo a commissione",
              "Fase 5 — contenuti: quiz corretti, più esami nel simulatore, mappe del 3° anno, Topics in Corporate Finance e Diritto del Lavoro — tempo",
              "Fase 6 — AI per rifinire piano e CV, solo in Plus — pochi centesimi per studente"],
        funzioni=["Supabase piano gratuito: 50.000 utenti attivi al mese, 500 MB di database, 1 GB di file; i progetti gratuiti si mettono in pausa dopo una settimana senza attività",
                  "Il codice della demo del report è pensato per il passaggio: lo store ha le stesse tabelle che andrebbero su Supabase, le scelte di business sono già in file separati e le pagine non cambiano"],
        ricavi="—", dipendenze=["Supabase", "Soggetto legale + Stripe", "Dominio unilinkfirenze.it"],
        attivare=["Seguire le sei fasi nell'ordine del report"],
        file=["Nel report (demo del 4 ottobre): core/store.js (tabelle per Supabase), tools/genera_corsi.py, tools/estrai_quiz.py"],
    ),
)

# ============================================================================================ S24 + S1 decisioni + S25 fonti
topic(
    key="decisioni", sez="1, 24 e 25", titolo="Decisioni per la call e fonti del report", lato="LA", gL=G_MIS, gA=G_MIS,
    breve="Le 10 decisioni della sintesi e le 16 decisioni per la call del report, con le fonti usate.",
    problema="Il report chiude con le decisioni da prendere nella call: ogni voce ha una proposta già scritta nella demo del report.",
    proposta="Le decisioni per la call sono elencate qui sotto come nel report (sezione 24, 16 voci) e come nella sintesi (sezione 1, 10 voci con la proposta nella demo). In fondo le fonti usate dal report (sezione 25).",
    dove_l="Questa card raccoglie le domande che nel report stanno a fine sezione; ogni voce rimanda alla card della sezione corrispondente.", dove_a="Idem: ogni decisione ha la sua card.",
    consiglio="Dal report: ogni sezione ha un riquadro «Da decidere nella call»; qui sono raccolti in un elenco unico.",
    blocks=[
        steps("Decisioni per la call (sezione 24 del report)", [
            ["1", "Struttura: landing su Framer + app su app.unilinkfirenze.it. Va bene?"],
            ["2", "Brand: UniLink con un hub per scuola; Economia attiva, le altre «in arrivo» con lista d'attesa e team fondatore. Quale scuola dopo?"],
            ["3", "Plus: piano multi-esame, test e simulatore, registro errori, Career completo; le dispense restano a parte. D'accordo?"],
            ["4", "Accesso: email UniFi + link via email. Email personale aggiuntiva per chi si laurea?"],
            ["5", "PDF: filigrana + marcatura invisibile + PDF privati + limite giornaliero. Limite a 15 download al giorno?"],
            ["6", "Gratuito: quali 3 esami (uno per anno)? Regalo per invito: 1 o più?"],
            ["7", "Prezzi: 4,99 / 12,99 / 29,99 / 49,99 / Plus 14,99 una tantum / tutoring 20 €/ora. Lanciamo il sondaggio a metà ottobre?"],
            ["8", "Prezzo di lancio fino al 31/12 al posto del prezzo barrato: d'accordo?"],
            ["9", "Soggetto legale: chi sente un commercialista e entro quando?"],
            ["10", "Ambassador: commissione 20% in crediti finché non si può pagare. Quanti per anno?"],
            ["11", "Simulatore: correggere i PDF Quiz e partire dagli esami a risposta chiusa. Chi se ne occupa?"],
            ["12", "Piano di studio: percorso a sessioni da 45 minuti, voto bloccato dopo l'esame, interviste degli ambassador. Contattiamo Alessandro de Concini?"],
            ["13", "Career: CV benchmark e template subito; lettera, mentor e stage solo se le porte finte lo giustificano."],
            ["14", "SUSBUS e SECI: richieste ora, dispense quando superano una soglia (quale?)."],
            ["15", "Tracciamento: chi installa Google Tag Manager e il Cookie Banner su Framer?"],
            ["16", "Errori del sito (elencati in «Il sito di oggi»): chi li sistema?"],
        ]),
        lst("Le 10 decisioni della sintesi (sezione 1) e la proposta nella demo", [
            ["Il sito diventa landing + app separata?", "Sì: landing su Framer, app su app.unilinkfirenze.it", "1"],
            ["Accesso", "Email universitaria, link via email (niente password)", "2"],
            ["Protezione PDF", "Filigrana + marcatura invisibile + PDF privati + limiti", "3"],
            ["Prezzi", "4,99 / 12,99 / 29,99 / 49,99 / Plus 14,99 una tantum, da validare col sondaggio", "4"],
            ["Soggetto legale e pagamenti", "Decidere la forma con un commercialista, poi Stripe", "5"],
            ["Referral e ambassador", "Codice fisso per account; ambassador pagati in crediti all'inizio", "6"],
            ["Cosa costruire dopo", "Simulatore per gli esami a risposta chiusa, poi piano con AI", "7"],
            ["SUSBUS e SECI", "Iscrizione e richieste di materiale ora, dispense quando c'è domanda", "8"],
            ["Brand e altre scuole", "Un brand UniLink con un hub per scuola; Economia attiva, le altre con lista d'attesa e team fondatore", "9"],
            ["Cosa c'è in Plus", "Piano per tutti gli esami + ottimizzatore, test e simulatore, registro errori, Career completo", "10"],
        ]),
        chips(["Sito attuale: unilinkfirenze.it (analizzato il 4 ottobre 2026)", "CareerSet TU Dublin", "Metodo PACRAR (Alessandro de Concini)", "SUSBUS: pagina ufficiale UniFi", "SECI: Booklet 2026/27", "Prezzi barrati: art. 17-bis Codice del Consumo (D.lgs. 26/2023, direttiva Omnibus)", "Studocu Premium: prezzi secondo fonti terze", "Tutoring a Firenze: Superprof", "Stripe: tariffe area economica europea", "Supabase: limiti del piano gratuito 2026", "Target Test Prep, GMAT Club", "Knowunity, Amboss, Studocu", "Testbusters (Ammesso.it), Uniwhere", "Scuole dell'Università di Firenze: guida ai corsi di laurea", "Framer e Google Tag Manager: guida ufficiale, BRIX Templates"]),
    ],
    serve=["Una persona che porti le decisioni alla call e le registri"],
    call=["Tutte le decisioni dell'elenco, a partire dalla 1 (struttura) e dalla 9 (soggetto legale), che bloccano le altre."],
    A=dict(
        dati=["Le 16 decisioni della sezione 24 e le 10 della sezione 1 (elenco completo nella card @L:decisioni@ della landing)",
              "Fonti usate dal report: sito attuale, CareerSet TU Dublin, metodo PACRAR, SUSBUS (pagina ufficiale UniFi), SECI (Booklet 2026/27), art. 17-bis Codice del Consumo, Studocu, Superprof, Stripe, Supabase, Target Test Prep, Knowunity, Amboss, Testbusters, Uniwhere, guida ai corsi di laurea UniFi, Framer e Google Tag Manager"],
        funzioni=["Ogni decisione ha la sua card in questo registro (@D:primo@–@D:ultimo@) e in quello della landing (@L:primo@–@L:ultimo@)"],
        ricavi="—", dipendenze=["Una call con i founder"],
        attivare=["Decidere nell'ordine del report: struttura, brand, Plus, accesso, PDF, gratuito, prezzi, prezzo di lancio, soggetto legale, ambassador, simulatore, piano di studio, Career, SUSBUS e SECI, tracciamento, errori del sito"],
        file=["Nel report (demo del 4 ottobre): appendice «dove si modifica la demo» (config/*.js, tools/*.py, README.md)"],
    ),
)

# ============================================================================================ SOLO WEB APP
topic(
    key="account", sez="6", titolo="Account e accesso con email UniFi", lato="A", gL=None, gA=G_ACC,
    breve="Registrazione con email universitaria @stud.unifi.it e link via email, senza password; consensi separati; alla prima volta si sceglie la dispensa gratuita.",
    dove_a="Registrazione e login dell'app (app.unilinkfirenze.it).",
    A=dict(
        cosa="Registrazione con nome, email universitaria, corso di laurea, anno, codice invito facoltativo e consensi. Niente password: si riceve un link via email. Al primo accesso lo studente sceglie la dispensa gratuita.",
        dati=["Registrazione: nome, email universitaria (@stud.unifi.it), corso di laurea, anno, codice invito facoltativo, consensi",
              "Consensi separati: termini e privacy obbligatori; statistiche e marketing facoltativi (senza consenso alle statistiche gli eventi restano anonimi)",
              "Dispensa gratuita scelta al primo accesso"],
        funzioni=["Login con link via email (nella versione vera è una funzione già pronta di Supabase, il database consigliato)",
                  "Perché: con @stud.unifi.it entrano solo studenti UniFi, il referral non si può gonfiare con account falsi e non dobbiamo custodire password; lo stesso metodo lo usa CareerSet (la piattaforma CV di TU Dublin)",
                  "Alternative scartate: password (più assistenza «ho perso la password» e più rischi); login con Google (comodo ma non verifica che sei di UniFi); una chiave per ogni utente (si condivide come il PDF); massimo 2 sessioni attive (complicato da gestire e utile poco)"],
        ricavi="—", dipendenze=["Supabase (login con link email)", "Servizio di invio email"],
        attivare=["Decidere se chi si laurea può aggiungere un'email personale dopo la verifica (consigliato sì, per Career e magistrali)", "Registrazione con consensi separati"],
        file=["Nel report (demo del 4 ottobre): schermata «Crea l'account» con email UniFi e consensi separati; core/store.js (tabelle per Supabase)"],
        domande=["Chi si laurea perde l'email @stud.unifi.it: permettiamo di aggiungere un'email personale dopo la verifica? (Consigliato sì, per Career e magistrali.)",
                 "Accesso: email UniFi + link via email. Email personale aggiuntiva per chi si laurea?"],
    ),
)

topic(
    key="pdf", sez="7", titolo="Proteggere i PDF: filigrana, marcatura invisibile, link temporanei", lato="A", gL=None, gA=G_ACC,
    breve="Filigrana personale visibile, marcatura invisibile, PDF in storage privato con link temporanei, limite di download e regole d'uso: il PDF resta scaricabile ma tracciabile.",
    dove_a="Pulsante «Scarica» nell'area personale; server (Edge Function di Supabase) in produzione.",
    A=dict(
        cosa="Una password legata all'account da sola non basta: chi gira il file può girare anche la password, e chi apre il PDF può «stamparlo» in un nuovo PDF senza password in pochi secondi. Il report propone misure gratis o quasi.",
        dati=["Filigrana personale visibile — su ogni pagina: nome, email, codice licenza e data, in diagonale leggera e in una riga in basso; se il file gira, si sa da chi è partito — gratis",
              "Marcatura invisibile — un testo trasparente e i metadati del PDF contengono un codice diverso per ogni copia; resta anche se qualcuno cancella la filigrana visibile — gratis",
              "PDF privati e link temporanei — i PDF escono da Framer e vanno in uno storage privato; l'app genera un link che vale pochi minuti — gratis fino a 1 GB",
              "Limite e allarmi — massimo 15 download al giorno (si cambia); troppi download in poco tempo segnalano l'account — gratis",
              "Regole d'uso — nei termini: condividere significa perdere l'account e i crediti — gratis",
              "Valore fuori dal PDF — simulatore, piano, aggiornamenti e Career esistono solo nell'account"],
        funzioni=["Al clic su «Scarica» l'app prende il PDF vero, aggiunge la filigrana su tutte le pagine (nella demo del report: 31 pagine in mezzo secondo) e lo fa scaricare; nei metadati c'è la riga «Licenza LD96C-… per Nome Cognome»",
                  "In produzione lo stesso codice gira sul server (una «Edge Function» di Supabase: il piano gratuito ne include 500.000 al mese), così il PDF originale non passa mai dal browser",
                  "Alternative scartate: visualizzatori con DRM a pagamento (costosi e scomodi: niente tablet, niente sottolineature); lettura solo online (gli studenti vogliono il PDF per annotarlo sul tablet); password al PDF"],
        ricavi="Protegge i pacchetti a pagamento rendendo scomodo e tracciabile girare i file.",
        dipendenze=["Storage privato (Supabase, gratis fino a 1 GB)", "Edge Function di Supabase"],
        attivare=["Spostare i PDF da Framer a uno storage privato", "Decidere il limite giornaliero (15 download?)", "Scrivere la regola d'uso nei termini"],
        file=["Nel report (demo del 4 ottobre): download con filigrana lato browser; pagina vera di Microeconomia scaricata con filigrana diagonale e riga con licenza"],
        domande=["PDF: filigrana + marcatura invisibile + PDF privati + limite giornaliero. Limite a 15 download al giorno?"],
    ),
)

topic(
    key="simulatore", sez="13", titolo="Simulatore d'esame", lato="A", gL=None, gA=G_STU,
    breve="Quiz rapido con spiegazione, simulazione a tempo con il punteggio vero della prova, registro errori, storico e miglior voto; partire dagli esami a risposta chiusa.",
    dove_a="Area personale: «Simulatore d'esame».",
    A=dict(
        cosa="Un simulatore sul modello del software costruito per il test Bocconi («Aula 28»): quiz rapido con spiegazione, simulazione a tempo con il punteggio vero della prova, registro degli errori (una domanda esce quando la indovini 2 volte di fila), storico e miglior voto.",
        dati=["Banca e Sistema Finanziario — 30 domande in 30 minuti",
              "Statistica per le applicazioni aziendali — 18 domande in 45 minuti, punteggio +2 / −0,5 / 0",
              "114 domande vere dai PDF Quiz dei due esami (estratte con uno script; per ogni nuovo corso basta aggiungere il PDF e il formato della prova)",
              "Per gli altri esami: prova di 5 domande e «lo voglio nel simulatore» (porta finta che conta l'interesse)"],
        funzioni=["Perché: è la parte che un PDF girato non può dare, e quella che giustifica la dispensa completa e Plus",
                  "Il simulatore rimescola le risposte a ogni prova",
                  "Per gli esami con domande aperte o esercizi (la maggioranza): modalità di autovalutazione, lo studente risponde, vede la soluzione e segna giusto/parziale/sbagliato",
                  "Esami da cui partire (risposta chiusa): Banca, Statistica app. aziendali, Matematica II, Matematica Finanziaria, Topics in M&M, Bilancio",
                  "Alternative scartate: comprare una piattaforma di quiz esterna (costa e non conosce i nostri esami); solo PDF di simulazioni (niente correzione, niente statistiche)"],
        ricavi="Giustifica la dispensa completa (12,99 €) e Plus (14,99 € una tantum).",
        dipendenze=["Banca di domande (il vero collo di bottiglia)", "PDF Quiz corretti: oggi la risposta giusta segue sempre la sequenza A, D, C, B, A, D… e le domande sono un glossario (gli stessi concetti ripresi in 2–3 formati, a volte con frasi poco naturali)"],
        attivare=["Correggere i PDF Quiz e riscriverli sul modello delle prove vere (controllare anche il resto dei PDF Quiz a risposta chiusa)", "Partire dagli esami a risposta chiusa", "Aggiungere per ogni nuovo corso il PDF e il formato della prova"],
        file=["Nel report (demo del 4 ottobre): config/simulatore.js (formato della prova dei corsi), tools/estrai_quiz.py (estrae le domande dai PDF Quiz)"],
        domande=["Simulatore: correggere i PDF Quiz e partire dagli esami a risposta chiusa. Chi se ne occupa?"],
    ),
)

topic(
    key="piano", sez="14", titolo="Piano di studio a sessioni (stile Target Test Prep)", lato="A", gL=None, gA=G_STU,
    breve="Ogni esame ha un percorso (fasi → capitoli → sessioni da 45 minuti); più esami finiscono in un calendario unico che si ricalcola; un ottimizzatore propone gli obiettivi di voto.",
    dove_a="Area personale: «Oggi» (sessioni suggerite), «Calendario», «Esami» (attivi, da fare, finiti).",
    A=dict(
        cosa="Ogni esame ha il suo percorso: fasi (Avvio, Basi, Approfondimento, Allenamento d'esame, Rifinitura) → capitoli della dispensa → sessioni da 45 minuti (lezione, esercizi, mappa, ripetizione orale, test di capitolo, ripasso, simulazione, registro errori, vigilia). Più esami insieme finiscono in un calendario unico. Ogni esame è attivo, da fare o finito.",
        dati=["Schema dei capitoli per gruppo d'esame — Quantitativo (matematica, statistica): Lezione → Esercizi → Esercizi → Test di capitolo",
              "Modelli economici (micro, macro): Lezione → Esercizi (grafico + calcolo) → Test di capitolo",
              "Aziendale e contabile: Lezione → Esercizi (scritture, casi) → Test di capitolo",
              "Giuridico: Lezione (con il codice) → Mappa → Ripetizione orale → Test di capitolo",
              "Teorico (management, marketing, storia): Lezione → Mappa → Risposte scritte → Test di capitolo",
              "Ogni 3 capitoli un ripasso di blocco; alla fine simulazioni a tempo alternate al registro errori, poi la vigilia",
              "Ogni lezione indica le pagine da leggere della dispensa (trovate nei PDF veri per 485 capitoli su 580)",
              "Dati passivi: sessioni fatte e quando, «quanto ti senti sicuro» sui test, ritmo reale, aderenza al piano (le ore studiate si calcolano dalle sessioni)",
              "Una sola richiesta attiva: dopo l'appello l'app chiede il voto (o non superato / ritirato); una volta confermato non si può più modificare e finisce nel libretto da solo; due domande facoltative a un clic: «la prova era come la scheda?» e «cosa ti è servito di più?»"],
        funzioni=["Perché (come in Target Test Prep): il percorso è una lista di missioni, il calendario è solo una proiezione; oggi puoi fare 2 sessioni o 10: il calendario si ricalcola, il percorso non si rompe",
                  "Test di capitolo: lo studente segna «da rivedere», «così così» o «sicuro»; con «da rivedere» compare subito un ripasso mirato (con Plus lo farebbe l'AI usando anche gli errori nel simulatore)",
                  "Proiezione: ogni giorno le sessioni disponibili si dividono tra gli esami: prima il minimo che serve a ognuno per finire in tempo, partendo dall'appello più vicino; il tempo che avanza va a chi ha più lavoro per giorno rimasto; la vigilia cade il giorno prima dell'esame",
                  "Stato di ogni esame: «in linea», «in anticipo di N giorni» o «in ritardo: N sessioni non entrano»",
                  "Ottimizzatore: lo studente sceglie il voto ideale per ogni esame; se il tempo non basta prova tutte le combinazioni di obiettivi uguali o più bassi e propone quella con la media ponderata sui CFU più alta che sta nei tempi (esempio: con 4 sessioni al giorno non si tengono 29–30 a Banca; l'app propone 27–28, media attesa 26,9); se nemmeno gli obiettivi minimi ci stanno, dice quante sessioni al giorno servono",
                  "Con 30 risposte per gruppo d'esame il pannello segnala «pronto per ricalibrare»; si aggiungono le interviste degli ambassador (10 minuti con chi ha preso 28+)",
                  "Alternative scartate: calendario rigido giorno per giorno (se salti un giorno si scombina tutto); piano scritto interamente dall'AI (costoso, imprevedibile, sbaglia le date); un piano diverso per ognuno dei 34 esami a mano (non scala)"],
        ricavi="Piano gratuito: un esame alla volta; multi-esame, calendario unico, ottimizzatore e coach in Plus (14,99 € una tantum).",
        dipendenze=["Profili di studio per gruppo d'esame (ore per CFU, obiettivi, livelli di partenza, tipi di sessione, schema dei capitoli, fasi)", "Pagine della dispensa per ogni capitolo", "Interviste degli ambassador"],
        attivare=["Decidere le sessioni da 45 minuti", "Decidere piano gratuito a un esame e multi-esame in Plus", "Chi raccoglie le prime interviste per gruppo d'esame", "Nome PACRAR: nella demo del report il piano è «ispirato a» e le descrizioni sono nostre; usarlo come nome in un prodotto a pagamento senza permesso è rischioso (idea: proporre una collaborazione ad Alessandro de Concini)"],
        file=["Nel report (demo del 4 ottobre): config/profili-studio.js (ore per CFU, obiettivi, livelli di partenza, tipi di sessione, schema dei capitoli per gruppo d'esame, fasi)"],
        domande=["Sessioni da 45 minuti vanno bene? Il piano gratuito segue un esame alla volta e il multi-esame è in Plus: d'accordo? Chi raccoglie le prime interviste per gruppo d'esame?",
                 "Piano di studio: percorso a sessioni da 45 minuti, voto bloccato dopo l'esame, interviste degli ambassador. Contattiamo Alessandro de Concini?"],
    ),
)

topic(
    key="career", sez="15", titolo="Career: il CV benchmark", lato="A", gL=None, gA=G_STU,
    breve="Lo studente sceglie una traiettoria, compila il CV a campi e ottiene un punteggio 0–100 in quattro aree, il profilo tipo e cosa sistemare; 17 regole, le prime 5 gratis.",
    dove_a="Area personale: «Career» (CV benchmark, template UniLink, LinkedIn, In arrivo).",
    A=dict(
        cosa="UniLink diventa il metro con cui uno studente capisce se il suo CV è fatto bene per la carriera che vuole: sceglie una traiettoria, compila il CV a campi e ottiene un punteggio 0–100 in quattro aree, il «profilo tipo» della traiettoria e l'elenco di cosa sistemare prima.",
        dati=["Traiettorie (le aree dell'Esploratore di carriera del sito): Investment Banking, Consulting, Corporate Finance e Controllo, Audit, Marketing, Data, Asset Management, Startup",
              "17 regole in quattro aree, ognuna con la sua fonte dichiarata: «template» (la struttura del template CV, collegato all'Excel «UNILINK Tools x CV»), «convenzione» (regole diffuse: una pagina, verbi d'azione, numeri nei risultati), «ipotesi» (soglie da validare con mentor e CV di chi è entrato davvero)",
              "Versione gratuita: prime 5 regole; Plus: tutte (benchmark completo per 8 carriere, template in inglese)",
              "Tre moduli (da CareerSet): CV (completo nella demo del report), lettera di presentazione («porta finta»), LinkedIn (checklist)",
              "Esempio: CV valutato per Consulting 63/100, con l'elenco di cosa sistemare e lo stesso CV nel template UniLink, pronto da salvare in PDF"],
        funzioni=["Perché: il CV a campi è più facile da valutare di un PDF qualsiasi e produce il template UniLink già pronto da scaricare; è anche la base dati per il futuro «UniLink Career»",
                  "La tab «In arrivo» misura l'interesse per lettera di presentazione, mentor 1-1, offerte di stage e magistrali: ogni clic finisce nel pannello; così si decide se vale la pena costruire «UniLink Career» o «UniLink Network», e per chi (anche per le magistrali, in futuro)",
                  "Da CareerSet (piattaforma CV usata da TU Dublin) abbiamo preso i tre moduli, l'accesso con email universitaria e il link via email; non abbiamo preso il modello di vendita (CareerSet lo comprano le università) né il giudizio automatico con AI, che rimandiamo",
                  "Alternative scartate: un'AI che legge il CV (utile dopo, ma costa a ogni uso e i giudizi non sono spiegabili); matching con offerte di aziende (serve prima avere le aziende)"],
        ricavi="Indiretto: il benchmark completo è in Plus (14,99 € una tantum); base dati per un futuro «UniLink Career».",
        dipendenze=["Soglie «ipotesi» da validare con mentor e CV di chi è entrato davvero", "Excel «UNILINK Tools x CV» (template)", "Aziende (solo per un futuro matching)"],
        attivare=["Partire con CV benchmark e template; lettera, mentor e stage solo se le porte finte lo giustificano"],
        file=["Nel report (demo del 4 ottobre): config/cv-benchmark.js (traiettorie, regole e soglie del CV)"],
        domande=["Career: CV benchmark e template subito; lettera, mentor e stage solo se le porte finte lo giustificano."],
    ),
)

topic(
    key="libretto", sez="16", titolo="Libretto e voto di laurea con scenari", lato="A", gL=None, gA=G_STU,
    breve="Voto di laurea stimato su un indicatore a semicerchio con l'obiettivo, media che hai e che ti serve, tre scenari, bonus della Scuola di Economia, grafico dei voti e simulazione dei prossimi esami.",
    dove_a="Area personale: «Libretto e voto».",
    A=dict(
        cosa="In alto il voto di laurea stimato su un indicatore a semicerchio con l'obiettivo, media ponderata, CFU fatti, lodi ed esami. Poi: la media che hai e quella che ti serve su una scala 18–30, tre scenari (prudente, realistico, ambizioso), i bonus della Scuola di Economia, il grafico dei voti colorato per area con la media nel tempo, la simulazione dei prossimi esami (scegli un voto ipotetico e tutto si aggiorna), «dove vai meglio» per area e il libretto.",
        dati=["Formula (la stessa del calcolatore del sito): media × 110/30 + 0,333 per lode + bonus",
              "Obiettivo e bonus si salvano nel profilo; gli esami ipotetici no",
              "I voti confermati nel piano di studio arrivano da soli nel libretto"],
        funzioni=["Perché: il calcolatore di oggi è utile ma si usa una volta e si dimentica; con obiettivo, scenari e simulazione diventa uno strumento a cui tornare dopo ogni esame",
                  "Il calcolatore pubblico resta gratuito sul sito (porta traffico da Google); la versione nell'account ricorda i dati",
                  "Per le altre scuole cambia solo il regolamento dei bonus",
                  "Alternative scartate: solo il numero finale (non dice cosa fare); previsioni «intelligenti» sui voti futuri (con pochi dati sarebbero inventate; gli scenari sono trasparenti)"],
        ricavi="—", dipendenze=["Regolamento dei bonus della Scuola di Economia (il report segnala che il regolamento della prova finale usato è del 2017/2018: da confermare)", "Voti confermati dal piano di studio"],
        attivare=["Verificare il regolamento della prova finale in vigore"],
        file=["Nel report (demo del 4 ottobre): schermata «Libretto e voto» con stima, obiettivo, scenari, bonus e grafico dei voti"],
        domande=["Nel report il libretto non ha domande aperte per la call."],
    ),
)

topic(
    key="pannello", sez="19", titolo="Pannello del team: metriche, materiale, domanda, ambassador, vendite", lato="A", gL=None, gA=G_TEA,
    breve="Il pannello dove i founder guardano i numeri e il materiale, in sette schede: panoramica, tracciamento, controllo materiale, domanda, profili di studio, ambassador, vendite e prezzi.",
    dove_a="App, ruolo «team» (pannello del team).",
    A=dict(
        cosa="Il pannello è dove i founder guardano i numeri e il materiale. Sette schede: Panoramica, Tracciamento, Controllo materiale, Domanda, Profili di studio, Ambassador, Vendite e prezzi.",
        dati=["Panoramica — nuovi account, attivazione, studenti attivi, ricavi; funnel dalla visita all'acquisto con la percentuale di ogni passo; iscrizioni al giorno; provenienza",
              "Tracciamento — il piano degli eventi con i conteggi e gli ultimi eventi registrati",
              "Controllo materiale — per ogni corso: versione, data, pagine, materiali presenti, «programma verificato il», download, voto degli studenti, segnalazioni aperte, avvisi automatici (codici di copertina diversi, quiz da correggere, indirizzi con refusi)",
              "Domanda — clic sulle porte finte, iscritti per corso di laurea, materiale richiesto, ricerche senza risultato",
              "Profili di studio — per gruppo d'esame: ore stimate contro ore reali, voto medio, quante risposte mancano per ricalibrare",
              "Ambassador — codici, iscritti portati, venduto, crediti; candidature da accettare o rifiutare",
              "Vendite e prezzi — venduto per prodotto, scontrino medio, listino attuale"],
        funzioni=["Utenti, ordini e grafici sono in parte di esempio nella demo del report (interruttore «Includi dati di esempio» per nasconderli)",
                  "La tabella «Controllo materiale» sostituisce le verifiche a mano"],
        ricavi="—", dipendenze=["Piano di tracciamento (card @D:metriche@)", "Registro versioni (card @D:aggiornamento@)"],
        attivare=["Decidere dove vive il pannello (il report lo descrive come terza parte della piattaforma)"],
        file=["Nel report (demo del 4 ottobre): pannello team con le sette schede (…/?demo=u_admin#/app/admin); config/tracking.js"],
        domande=["Nel report il pannello non ha domande aperte per la call."],
    ),
)


# ---- id delle card nate dal report (stesso ordine con cui sono state inserite nei due registri)
LID, AID = {}, {}
_nl, _na = 10, 26
for _t in T:
    if "L" in _t["lato"]:
        LID[_t["key"]] = f"L{_nl:02d}"; _nl += 1
    if "A" in _t["lato"]:
        AID[_t["key"]] = f"D{_na}"; _na += 1
