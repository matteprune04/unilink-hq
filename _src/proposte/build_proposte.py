# -*- coding: utf-8 -*-
"""Genera il PDF «Proposte» (B): proposte discusse in chat il 7 ottobre 2026, NON idee e NON decisioni definitive.
   architettura/UniLink_Proposte.pdf  ·  architettura/PROPOSTE_UNILINK.md  ·  sorgente Typst in architettura/proposte/proposte.typ
Le immagini dei mockup (architettura/proposte/img/) si rifanno da architettura/proposte/mockup/*.html (screenshot 1,5×).
Uso: python _src/proposte/build_proposte.py   (pip install typst)
Regola di scrittura: il testo di Claude resta com'è; le osservazioni dei founder si AGGIUNGONO (blocco «Osservazione»);
quando un'osservazione cambia la proposta, lo dice il blocco «Deciso in chat»."""
import json
import os

RADICE = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
DOC = []


def H1(t, sotto=""): DOC.append(("h1", t, sotto))
def H2(t): DOC.append(("h2", t))
def H3(t): DOC.append(("h3", t))
def P(t): DOC.append(("p", t))
def UL(l): DOC.append(("ul", list(l)))
def OL(l): DOC.append(("ol", list(l)))
def TB(cols, rows, w=None): DOC.append(("tb", list(cols), [list(map(str, r)) for r in rows], w))
def IMG(f, cap): DOC.append(("img", f, cap))
def OSS(t): DOC.append(("oss", t))       # osservazione dei founder (aggiunta)
def DEC(t): DOC.append(("dec", t))       # deciso in chat (prevale sulla proposta)
def NOTA(t): DOC.append(("nota", t))     # nota di Claude (rischio, limite, verifica)


# ============================================================================================ contenuto
def intro():
    H1("Come leggere queste proposte", "né idee, né decisioni: proposte da approvare")
    P("Questo documento raccoglie le proposte B discusse in chat il 7 ottobre 2026, a partire dai commenti dei founder sulla demo della landing (20 commenti, esportati il 7 ottobre). Una proposta è più di un'idea (ha un perché, dati di mercato, un piano e un modo per misurarla) ma non è ancora una decisione: si approva, si corregge o si scarta.")
    TB(["Blocco", "Cosa significa"], [
        ["Testo normale", "La proposta di Claude, con analisi e dati."],
        ["Osservazione di Matteo", "Ciò che hai aggiunto in chat: si aggiunge alla proposta, non la sostituisce."],
        ["Deciso in chat", "Dove la tua osservazione cambia la proposta: vale questo."],
        ["Nota", "Un rischio, un limite o qualcosa da verificare (legale, tecnico, dati)."],
    ], ["26%", "74%"])
    H2("Le proposte")
    TB(["N.", "Proposta", "Esito in chat"], [
        ["P1", "Gruppi di studio: motore di acquisizione e retention, non prodotto", "Approvata"],
        ["P2", "Listino: singoli, pacchetti e Plus separati, prezzi del report e prezzo fuori sessione", "Approvata, con la convenienza fuori sessione"],
        ["P3", "UniLink Planner: piano standard per esame e fascia di voto, stile TTP", "Approvata con modifiche: calcolato una volta sola"],
        ["P4", "Orientamento: dentro gli hub e generale, nostro", "Approvata: entrambi, nessun rimando esterno"],
        ["P5", "Dopo la laurea e tesi per hub e corso di laurea", "Approvata; B2B rimandato"],
        ["P6", "Strumenti compatti con regole per corso", "Approvata"],
        ["P7", "Barra di navigazione: Hub · Guida · Materiali · Strumenti · Community · Accedi", "Approvata, nome di «Market» da scegliere"],
        ["P8", "Partnership con chi prepara ai test d'ingresso", "Resta idea"],
    ], ["7%", "63%", "30%"])
    H2("Il principio di fondo: tutto per ogni facoltà")
    P("Ogni proposta è pensata per non restare chiusa su Economia, Giurisprudenza e Medicina. UniLink potrà aggiungere altre facoltà e corsi (Ingegneria nei suoi diversi tipi, Fisica, Matematica, Filosofia…). Per questo tutto ciò che dipende dal corso di laurea (regole del voto, tesi, sbocchi, orientamento, metodo di studio) si appoggia a un catalogo unico di corsi con le loro caratteristiche, e le pagine leggono da lì.")
    TB(["Campo del catalogo dei corsi", "Esempio"], [
        ["Area e scuola", "Economia · Scuola di Economia e Management"],
        ["Tipo", "Triennale (180 CFU) · magistrale (120) · ciclo unico (300 o 360)"],
        ["Regole del voto di laurea", "Formula e premi (es. Economia UniFi: media + costante + premio di velocità)"],
        ["Tesi", "Tipi di prova finale, tempi, struttura, template, scadenze"],
        ["Gruppi d'esame", "Quantitativo, modelli, aziendale, giuridico, teorico, laboratorio, clinico…"],
        ["Dopo la laurea", "Magistrali, MSc, esami di Stato, albi, concorsi, specializzazioni"],
        ["Orientamento", "Con cosa si confronta (corsi vicini), per chi è, esiti occupazionali"],
        ["Stato", "Attivo · in arrivo · proposto"],
    ], ["34%", "66%"])


def p1():
    H1("P1 · Gruppi di studio", "motore di acquisizione e retention, non un prodotto da vendere")
    H2("Analisi di mercato")
    UL([
        "Knowunity (20 milioni di utenti in 15 paesi, 45 M€ raccolti): i gruppi di studio sono una funzione dentro un'app freemium; i ricavi vengono dall'abbonamento premium e dall'employer branding (aziende come Vodafone e Porsche).",
        "Docsity (italiana, 14 milioni di utenti registrati): guadagna con abbonamenti a punti (15,99 € al mese, 29,97 € a trimestre, 59,88 € all'anno), documenti in vendita e tutoring. Non con i gruppi.",
        "WhatsApp e Telegram: i gruppi per corso e per anno esistono già, gratis e dominanti. Un «gruppo» in sé non si vende.",
    ])
    H2("Proposta")
    UL([
        "I gruppi sono un motore per acquisire e trattenere studenti, non una voce di ricavo.",
        "Primo passo: un gruppo per esame e per appello, gratuito, creato e moderato dagli ambassador, con i materiali UniLink come base comune.",
        "Dentro Plus: «Studia con altri», cioè il piano condiviso dal gruppo, l'avanzamento di tutti visibile e una sessione settimanale guidata da un ambassador che ha preso 28 o più.",
    ])
    H2("Differenza dal tutoraggio")
    P("Il tutor insegna, uno a uno, a pagamento orario. Nel gruppo si è pari livello, ci si tiene il ritmo a vicenda e la struttura la dà il piano (P3); l'ambassador facilita, non fa lezione.")
    H2("Complicazioni")
    UL(["Partenza a freddo: servono almeno 4–5 persone per esame e appello.", "Moderazione e privacy.", "Si condividono solo materiali UniLink o propri: niente slide dei professori.", "Chi esce da WhatsApp porta via il valore: il gruppo deve vivere anche dentro l'app."])
    H2("Prova a basso costo e regola di stop")
    P("3 esami, un appello. Si misurano iscritti al gruppo, attivi dopo 2 settimane e quanti comprano gli Appunti. Regola di stop: se meno del 30% è attivo dopo 2 settimane, si ferma.")
    OSS("«Mi piace la proposta, ok.» L'idea di partenza era che i gruppi d'esame potessero essere il vero valore di UniLink (scambio di materiali, idee e consigli, tutto con gli appunti UniLink), magari dentro Plus e distinti dal tutoraggio.")


def p2():
    H1("P2 · Listino: singoli, pacchetti e Plus", "base: il report del 4 ottobre; prezzo più basso fuori sessione")
    P("Prezzi proposti, non definitivi. Struttura della pagina: tre blocchi separati, «Singoli esami», «Pacchetti» e «Plus» (il metodo, a parte), più il calcolatore del pacchetto per corso, anno e semestre.")
    TB(["Prodotto", "Fuori sessione", "In sessione", "Cosa include"], [
        ["Account gratuito", "0 €", "0 €", "1 Appunti a scelta tra 3 esami (uno per anno) + 1 Appunti in regalo quando il primo amico invitato conferma l'email"],
        ["Appunti", "4,99 €", "9,99 €", "Appunti/Sbobine di un esame, con filigrana personale"],
        ["Dispensa completa", "12,99 €", "18,99 €", "Appunti + mappe + quiz e simulazioni dell'appello (9,99 € dove le mappe non ci sono)"],
        ["Pacchetto semestre", "29,99 €", "da decidere", "Tutte le dispense complete del semestre (3–4 esami): comprate una per una 38,97–51,96 €"],
        ["Pacchetto anno", "49,99 €", "da decidere", "I due semestri; il momento giusto è settembre–ottobre"],
        ["UniLink Plus", "14,99 € una tantum", "14,99 €", "Planner per tutti gli esami, simulazioni, registro errori, CV benchmark; vale per la sessione; con un pacchetto 10 € in meno"],
        ["Tutoring 1-1", "20 €/ora", "20 €/ora", "Con chi ha preso 30 in quell'esame; pacchetto 3 ore 54 €; 75% al mentor"],
    ], ["18%", "15%", "13%", "54%"])
    IMG("img/listino_l1.jpg", "Mockup della pagina listino (proposta): singoli, pacchetti e Plus separati; prezzo fuori sessione e in sessione; quando conviene comprare.")
    H2("Le mie osservazioni")
    UL([
        "La Completa a 12,99 è credibile solo dove ci sono mappe e quiz (oggi le mappe esistono per 17 corsi su 34): ogni esame mostra cosa include e, dove manca qualcosa, costa 9,99 €.",
        "Plus al lancio non lo venderei: oggi il simulatore copre 2 esami e il planner non esiste. Partirei con singoli e pacchetti e aprirei Plus quando planner e simulatore coprono almeno un semestre.",
        "Confronto: Docsity costa 15,99 € al mese ed è generico; noi siamo per singolo esame UniFi, quindi un prezzo per esame regge.",
        "Dopo la decisione va allineata la web app, che oggi ha 14,99 € per esame e Plus a 4,99 € al mese.",
    ])
    OSS("Mi piace soprattutto la parte di sconto, e soprattutto far vedere la convenienza: durante la sessione il prezzo aumenta, perché aumenta la domanda di appunti.")
    DEC("Il listino mostra due prezzi per prodotto: «fuori sessione» (più basso) e «in sessione» (più alto), con il periodo in cui valgono. La pagina dice chiaramente «compra prima, paghi meno».")
    NOTA("Come dirlo nel modo corretto: annunciare in anticipo il prezzo più alto in sessione è trasparente. Quando, a sessione finita, il prezzo torna basso, non va presentato come «sconto» con prezzo barrato: la regola Omnibus (art. 17-bis del Codice del Consumo) vuole come riferimento il prezzo più basso dei 30 giorni precedenti. Meglio parlare di «prezzo fuori sessione» e «prezzo in sessione». Da far verificare a un consulente prima di pubblicare.")


def p3():
    H1("P3 · UniLink Planner", "il metodo standard per ogni esame e fascia di voto, stile Target Test Prep")
    H2("Cosa fa Target Test Prep (TTP)")
    UL([
        "Si sceglie una fascia di punteggio obiettivo: Good (fino a 525), Very Good (535–575), Advanced (585–635), Expert (645–675), Expert+ (685 o più).",
        "Si inseriscono le ore al giorno e i giorni disponibili: la piattaforma costruisce il piano.",
        "Due modi di seguirlo: a missioni (lineare, argomento per argomento, si completano task) o a calendario (un programma giornaliero sui giorni e le ore disponibili). C'è anche un piano accelerato.",
        "Il metodo è standardizzato perché TTP prepara a un solo esame (il GMAT).",
    ])
    NOTA("Il sito di TTP non è raggiungibile da questo ambiente: le informazioni vengono da pagine pubbliche e recensioni (fonti in fondo). I mockup qui sotto seguono la logica descritta, in stile UniLink, e non copiano schermate di TTP.")
    H2("Proposta di Claude (dalla chat)")
    UL([
        "Due viste, stile TTP: Percorso (fasi → capitoli → sessioni da 45 minuti, a task) e Calendario.",
        "Dati in ingresso: esami, date d'appello, voto obiettivo, sessioni al giorno, giorni di riposo, livello di partenza. Ogni tipo d'esame ha le sue regole (i gruppi del report: quantitativo, modelli economici, aziendale, giuridico, teorico).",
        "Il motore non è AI ed è il 90% del valore: regole precise, prevedibili, spiegabili ed economiche.",
        "Dove serve l'AI (senza allenarne una): trasformare il programma di un esame in capitoli e sessioni (una volta per esame, rivisto dal team); adattare il piano dopo un test andato male; spiegare il piano a parole. Costo: pochi centesimi per studente al mese.",
        "Fattibilità per non tecnici: sì, a fasi. v1 regole e un esame (gratis), v2 multi-esame (Plus), v3 adattamento con AI.",
        "PACRAR/ADC: collaborazione solo con un contratto (co-branding «metodo ispirato a»); senza, nome e metodo nostri.",
        "Nella landing (Durante): un esempio già pronto, solo da guardare, e «Crea il tuo piano» che porta all'area personale (serve la Completa o Plus).",
    ])
    OSS("Non farei il ricalcolo della proiezione: manterrei come in TTP. Con le variabili che ognuno inserisce, il piano viene calcolato e creato una volta sola, standardizzando il metodo per ogni esame e per ogni obiettivo di voto: passare l'esame 18–21, buon punteggio 22–25, ottimo 26–28, massimo possibile 29+, con un disclaimer che non garantiamo punteggi. Sotto, un indicatore di tempo sui giorni messi a disposizione e sulle ore nette al giorno, con uno scarto del 15–20%. La visualizzazione è divisa per fasi e ogni fase per sessioni, in base ai giorni che ognuno definisce. TTP lo fa standardizzato per un solo esame: io lo vorrei così per tutti gli esami (più lungo da fare, ma non complicato). L'architettura tecnica specifica non va ancora sviluppata: è un lavoro complesso se lo vogliamo fare bene. Ora serve l'idea e il design di tutte le sezioni: variabili, calendario, task, completati, da fare. L'AI teniamola presente, ma per ora può non essere fondamentale.")
    DEC("Il piano si calcola una volta sola, alla creazione: niente ricalcolo automatico. Se si salta una sessione le missioni restano in ordine e si mostra il ritardo (rigenerare il piano è una scelta esplicita dello studente). Fasce di voto: Passare 18–21 · Buono 22–25 · Ottimo 26–28 · Massimo 29–30L, con disclaimer. Indicatore di fattibilità: ore che servono (dalla fascia) contro ore utili = giorni × ore nette × (1 − margine del 15–20%). L'AI non è necessaria nella prima versione.")
    H2("Il metodo standard, per ogni esame e fascia")
    P("Per ogni esame si definisce una volta: gruppo d'esame (che fissa lo schema delle sessioni per capitolo), capitoli con le pagine della dispensa, e il numero di sessioni per fascia. Le fasi sono le stesse per tutti: Avvio · Basi · Approfondimento · Allenamento d'esame · Rifinitura. Esempio (dati inventati per il mockup): Microeconomia, 9 CFU.")
    TB(["Fascia", "Voto", "Sessioni da 45′", "Ore", "Cosa cambia"], [
        ["Passare", "18–21", "40", "30 h", "Lezione + un esercizio per capitolo, 2 simulazioni"],
        ["Buono", "22–25", "52", "39 h", "+ ripassi di blocco, 3 simulazioni"],
        ["Ottimo", "26–28", "64", "48 h", "+ seconda sessione di esercizi, 4 simulazioni, registro errori"],
        ["Massimo", "29–30L", "78", "59 h", "+ approfondimenti, domande d'orale, 6 simulazioni"],
    ], ["14%", "11%", "17%", "10%", "48%"])
    P("Le sessioni per fascia sono parametri del metodo da calibrare con i dati veri (ore reali per voto e per gruppo d'esame) e con le interviste a chi ha preso 28 o più.")
    H2("Design di tutte le sezioni (mockup)")
    IMG("img/planner_f1.jpg", "1 · Variabili: esame e appello, fascia di voto (con disclaimer), giorni in cui studi, ore nette al giorno, margine 15–20%. A destra l'indicatore «Ci stai nei tempi?».")
    IMG("img/planner_f2.jpg", "2 · Percorso: le cinque fasi con avanzamento, sessioni fatte, ore studiate, stato rispetto al piano creato, prossima sessione.")
    IMG("img/planner_f3.jpg", "3 · Vista task (missioni): le sessioni della fase in ordine, con tipo e durata; dopo il test «Da rivedere / Così così / Sicuro».")
    IMG("img/planner_f4.jpg", "4 · Calendario: le sessioni previste giorno per giorno, colori per tipo, giorni di riposo, esame. Non si riorganizza da solo.")
    IMG("img/planner_f5.jpg", "5 · Oggi e da fare: le sessioni di oggi, stato del piano e avanzamento della settimana.")
    IMG("img/planner_f6.jpg", "6 · Completate: esito della sessione, errori nel registro, cronologia delle sessioni fatte.")
    H2("Mercato")
    UL([
        "Motion (19 $ al mese, sconto studenti 25%): ripianifica continuamente il calendario, ma è generico.",
        "Shovel: dice se il carico di studio ci sta nel tempo disponibile.",
        "StudySmarter/Vaia: piani con checklist e calendario dinamico, più flashcard.",
        "Exclam: trasforma i PDF d'esame in un piano datato con quiz e flashcard.",
        "Nessuno conosce gli esami UniFi e le vostre dispense. Il vantaggio difendibile: le pagine della dispensa collegate a ogni capitolo (già trovate per 485 capitoli su 580) e il formato reale della prova.",
    ])
    NOTA("La vostra scelta (piano calcolato una volta, nessun ricalcolo) è diversa da Motion e più vicina a TTP: è più semplice da costruire e più chiara per lo studente. Il rischio è che chi resta molto indietro abbandoni: per questo il ritardo va mostrato in modo chiaro, con la possibilità di rigenerare il piano.")


def p4():
    H1("P4 · Orientamento", "dentro ogni hub e generale, costruito da noi")
    P("Mercato: l'orientamento generico è saturo e gratuito (AlmaOrièntati di AlmaLaurea: test di 15 minuti con profilo personale; orientamento degli atenei). Su facoltà dove non siamo presenti non avremmo credibilità.")
    H2("Proposta di Claude (dalla chat)")
    UL([
        "Togliere «Prima» dalla barra e metterla dentro ogni hub come scheda «Stai scegliendo?».",
        "Per Economia: EA contro EC (e più avanti SUSBUS) con esami a confronto, curriculum, sbocchi, voci di studenti e info sul TOLC-E. Per gli altri hub: Giurisprudenza ciclo unico; Medicina e semestre filtro.",
        "Target: studenti di quinta superiore e matricole a settembre; serve per arrivare da Google prima dell'iscrizione.",
    ])
    OSS("Cambiare nome alla scheda. Farei entrambi (dentro gli hub e un orientamento generale) e non rimanderei a nessun link esterno: lo creerei nostro, sulla base dei dati di chi lo ha già fatto. E non chiuso su queste facoltà: deve poter contenere anche Ingegneria (nei suoi diversi tipi), Fisica, Matematica, Filosofia e così via.")
    DEC("Due livelli, entrambi nostri. 1) «Orientati» generale: un percorso a domande (interessi, materie forti, che lavoro immagini, quanto vuoi studiare) che restituisce aree e corsi compatibili con dati veri di esito (occupazione, stipendio, durata reale), presi da fonti pubbliche e dalle risposte dei nostri studenti. 2) Dentro ogni hub, la scheda «Scegliere» confronta i corsi vicini (es. EA contro EC). Entrambi leggono il catalogo unico dei corsi, quindi un corso nuovo si aggiunge senza rifare le pagine. Nessun rimando ad AlmaOrièntati.")
    NOTA("Nome della scheda: proposte «Orientati» (generale) e «Scegliere» (dentro l'hub). I dati di esito vanno citati con la fonte (es. indagini AlmaLaurea su condizione occupazionale) e aggiornati ogni anno.")


def p5():
    H1("P5 · Dopo la laurea e tesi", "una struttura per tutti gli hub, contenuti per corso di laurea")
    UL([
        "Struttura uguale per ogni hub, contenuti diversi: Tesi · Dopo la laurea · Carriera.",
        "Tesi per corso di laurea: regole della prova finale (a Economia UniFi il voto è media + costante + premio di velocità: 2 punti entro il 31/12 del terzo anno, 1 entro il 30/4, poi 0); tipi di tesi, tempi, checklist, calendario delle consegne, template Word e LaTeX per corso.",
        "Prof consigliati: non una classifica (rischio reputazionale con i docenti), ma una guida «Come scegliere il relatore» e domande e risposte con i professori che accettano. Partnership di contenuto, senza soldi.",
        "Dopo la laurea, per hub: Economia con MSc e magistrali (Master finder, 163 programmi); Giurisprudenza con pratica forense, esame da avvocato, notariato, magistratura e studi per il praticantato; Medicina con il concorso di specializzazione e le differenze tra specialità.",
    ])
    H3("Idea B2B (rimandata)")
    UL([
        "Stampa della tesi: il mercato esiste (Mistertesi, Tesi24; circa 0,40 € a pagina a colori, copertina rigida da 12 €; esistono convenzioni universitarie con sconti del 10–25%). Proposta: convenzione con una copisteria vicino a Novoli, con codice sconto e commissione.",
        "Poi correzione bozze e controllo antiplagio. Mai scrittura della tesi su commissione.",
    ])
    OSS("Mi piace. Il B2B aspettiamo: è per un futuro che non abbiamo ancora deciso. Il resto top, ma non renderlo chiuso su queste tre facoltà: va fatto per tutte quelle possibili (Ingegneria nei suoi tipi, Fisica, Matematica, Filosofia…).")
    DEC("Tesi e Dopo la laurea leggono il catalogo unico dei corsi: ogni corso ha le sue regole di prova finale, tipi di tesi, template e percorsi dopo la laurea (magistrali, esami di Stato, albi, concorsi, specializzazioni, dottorati). Le pagine sono generiche e si riempiono per corso. Il B2B resta un'idea, fuori dal primo passo.")


def p6():
    H1("P6 · Strumenti", "compatti, universali, con regole per corso")
    UL([
        "Home: solo strumenti universali, compatti e d'impatto: voto di laurea (con regole per corso di laurea e scelta dell'hub), «Quanto pesa questo esame sulla media», conto alla rovescia per appello e sessione, «Erasmus: sei in tempo?».",
        "Grafica: altezza fissa, schede interne, colori diversi per i dati inseriti e i risultati; a colpo d'occhio si capisce cosa si sta guardando.",
        "Durante: solo media e voto obiettivo, esempio del piano (P3), Erasmus preciso.",
        "Regole per corso: ogni calcolatore legge un archivio di regole per corso di laurea (Economia e Giurisprudenza UniFi hanno documenti ufficiali diversi), verificate a mano.",
        "Bando sempre aggiornato: un controllo automatico mensile della pagina del bando segnala al team se è cambiata; una persona verifica e aggiorna. Il bando si può scaricare. Lettura e aggiornamento al 100% automatici no: un errore su un bando costa caro.",
    ])
    OSS("Sì, metti tutto. In home solo strumenti «for fun» che tutti possono usare, compatti, precisi e vincolati alle regole di ogni corso; il bando (es. Erasmus) scaricabile e sempre aggiornato.")


def p7():
    H1("P7 · Barra di navigazione", "Hub · Guida · Materiali · Strumenti · Community · Accedi")
    P("Proposta A (approvata): Hub ▾ · Guida · [listino] · Strumenti · Community · Accedi, più un menu «Founder» nascosto (Area personale in schermate, Da decidere, Commenti) che non andrà nel sito finale. Prima/Durante/Dopo diventano schede dentro ogni hub (Scegliere · Studiare · Dopo la laurea), perché cambiano per facoltà.")
    OSS("Al posto di «Market» un altro nome, tipo «Piani» o simili: cercane anche tu di migliori.")
    TB(["Nome", "Pro", "Contro"], [
        ["Materiali", "Dice cosa c'è (dispense, pacchetti, Plus); parola che gli studenti usano già.", "Meno esplicito sul fatto che è a pagamento."],
        ["Piani", "Chiaro su pacchetti e abbonamento.", "Si confonde con il «piano di studio» (P3)."],
        ["Dispense", "Il prodotto principale, parola del vostro pubblico.", "Non comprende Plus e tutoring."],
        ["Prezzi", "Il più chiaro in assoluto.", "Freddo, non fa venire voglia."],
        ["Shop", "Immediato.", "Troppo commerciale per «da studenti, per studenti»."],
        ["Studia con UniLink", "Caldo, parla di metodo.", "Lungo per la barra."],
    ], ["22%", "42%", "36%"])
    DEC("Proposta di Claude: «Materiali» (si cambia con una riga di configurazione). La pagina contiene singoli, pacchetti e Plus (P2) e da ogni esame si apre la Preview.")


def p8():
    H1("P8 · Partnership per i test d'ingresso", "resta un'idea")
    UL([
        "Attori: Alpha Test (libri e corsi), Testbusters (corsi, ha acquisito Ammesso.it), CISIA (che gestisce i TOLC). Non ho trovato programmi di affiliazione pubblici: va chiesto direttamente.",
        "Ha senso solo quando avremo traffico prima dell'iscrizione (P4): un link affiliato tracciato, una commissione per iscritto, un solo partner di prova.",
        "Rischio: diluire l'identità «studenti universitari».",
    ])
    OSS("Queste restano idee dentro la proposta.")


def collegamenti():
    H1("Come le proposte guidano le modifiche A", "cosa si costruisce adesso, in funzione delle proposte")
    P("Le modifiche A (richieste chiare dei commenti) si costruiscono in modo da essere già pronte per le proposte B, senza anticipare decisioni non prese.")
    TB(["Modifica A", "Come si appoggia alle proposte"], [
        ["Barra di navigazione", "P7: Hub ▾ · Guida · Materiali · Strumenti · Community · Accedi; menu «Founder» per Area personale, Da decidere, Commenti; voci allineate."],
        ["Materiali e Preview", "P2: singoli, pacchetti e Plus separati, prezzo fuori sessione e in sessione; Preview del singolo esame con solo l'indice, motivi per comprare, «Compra» o «Accedi»; le tips su prof ed esami solo con l'account."],
        ["Catalogo in home (H06)", "P2: diviso per hub con i corsi più scaricati e «Scopri la collezione completa» verso Materiali."],
        ["Prezzi in home", "P2: un blocco «Compra prima, paghi meno» con i tre gruppi e il link a Materiali."],
        ["Guida", "Pagina interattiva con una scheda per facoltà: Economia (triennale) completa dalla Guida essenziale, le altre con la struttura pronta (catalogo unico dei corsi)."],
        ["Hub e fasi", "P4, P5, P7: Prima/Durante/Dopo diventano schede degli hub (Scegliere · Studiare · Dopo la laurea), con struttura generica per ogni corso."],
        ["Strumenti in home (H08)", "P6: strumenti compatti e universali, regole per corso."],
        ["Durante · piano", "P3: esempio già pronto del planner, solo da guardare, e «Crea il tuo piano» verso l'area personale."],
        ["Chi c'è dietro (H09)", "Foto segnaposto, LinkedIn, scheda personale di ogni founder con breve presentazione."],
        ["FAQ (H11)", "Domande che portano ad aprire un account e ad acquistare."],
        ["Hero, numeri, scuole (H02–H04)", "Testi e immagini nuovi; ogni testo e immagine segnato come campo modificabile in Framer."],
        ["Area personale (H06b)", "Il pulsante porta all'accesso alla web app; la galleria va nel menu Founder."],
    ], ["26%", "74%"])


def fonti():
    H1("Fonti", "ricerche fatte il 7 ottobre 2026")
    UL([
        "Knowunity: businessmodelcanvastemplate.com (come funziona); dealroom.co/companies/knowunity.",
        "Docsity: trend-online.com (come funziona); economyup.it (finanziamento).",
        "Target Test Prep: gmat.targettestprep.com/plans; recensioni topconsumerreviews.com e testpreppal.com; GMAT Club.",
        "Planner: mindomax.com (migliori app di pianificazione), Vaia/StudySmarter (App Store), alternativeto.net (Exclam).",
        "Orientamento: AlmaOrièntati (unibs.it), studenti.it.",
        "Prova finale: economia.unifi.it e statistica.unifi.it (regolamenti); giurisprudenza.unifi.it (voto di laurea).",
        "Stampa tesi: universita.it (Tesi24), Trustpilot (Mistertesi), aranzulla.it.",
        "Prezzi barrati: art. 17-bis Codice del Consumo (D.lgs. 26/2023, direttiva Omnibus).",
    ])


# ============================================================================================ emissione
def md():
    out = ["# UniLink · Proposte (B)", "", "_Proposte discusse in chat il 7 ottobre 2026: né idee né decisioni definitive. Le osservazioni dei founder sono aggiunte; «Deciso in chat» prevale._", ""]
    for n in DOC:
        k = n[0]
        if k == "h1": out += ["", f"## {n[1]}", f"_{n[2]}_" if n[2] else "", ""]
        elif k == "h2": out += ["", f"### {n[1]}", ""]
        elif k == "h3": out += ["", f"#### {n[1]}", ""]
        elif k == "p": out += [n[1], ""]
        elif k == "ul": out += [f"- {x}" for x in n[1]] + [""]
        elif k == "ol": out += [f"{i}. {x}" for i, x in enumerate(n[1], 1)] + [""]
        elif k == "oss": out += [f"> **Osservazione di Matteo.** {n[1]}", ""]
        elif k == "dec": out += [f"> **Deciso in chat.** {n[1]}", ""]
        elif k == "nota": out += [f"> **Nota.** {n[1]}", ""]
        elif k == "img": out += [f"![{n[2]}](proposte/{n[1]})", f"_{n[2]}_", ""]
        elif k == "tb":
            e = lambda s: s.replace("|", "\\|")
            out += ["| " + " | ".join(e(c) or " " for c in n[1]) + " |", "|" + "---|" * len(n[1])] + ["| " + " | ".join(e(c) for c in r) + " |" for r in n[2]] + [""]
    return "\n".join(out)


HEADER = r'''// Generato da _src/proposte/build_proposte.py: non modificare a mano.
#let navy = rgb("#172554")
#let crema = rgb("#f4f1ea")
#let arancio = rgb("#cf7527")
#let ar2 = rgb("#f6e4d1")
#let ar3 = rgb("#9a5417")
#let crema2 = rgb("#ebe4d5")
#let nv2 = rgb("#4b5675")
#let linea = rgb("#e2dccf")
#let nvt = rgb("#dfe4f1")
#let verde = rgb("#2f6b4f")
#let verde2 = rgb("#e3efe8")
#set document(title: "UniLink — Proposte", author: "UniLink")
#set text(font: "Croogla 4F", size: 9.4pt, fill: navy, lang: "it")
#set par(leading: 0.62em, justify: false)
#set list(indent: 4pt, body-indent: 5pt, spacing: 0.55em)
#set page(paper: "a4", margin: (x: 18mm, top: 20mm, bottom: 18mm),
  header: context { if counter(page).get().first() > 1 [
    #set text(size: 7.5pt, fill: nv2)
    UniLink · Proposte (B) · non definitive #h(1fr) 7 ottobre 2026
  ] },
  footer: context { if counter(page).get().first() > 1 [
    #set text(size: 7.5pt, fill: nv2)
    #h(1fr) #counter(page).display()
  ] })
#let spaziato(t) = text(size: 7.4pt, fill: ar3, tracking: 0.14em, upper(t))
#let cap(titolo, sotto) = {
  pagebreak(weak: true)
  block(below: 4pt, text(size: 21pt, titolo))
  block(below: 12pt, text(size: 9pt, fill: nv2, sotto))
}
#let sub(t) = block(sticky: true, above: 14pt, below: 6pt, text(size: 12.5pt, t))
#let sub3(t) = block(sticky: true, above: 9pt, below: 3pt, text(size: 9.8pt, fill: ar3, t))
#let riquadro(et, col, sf, body) = block(fill: sf, radius: 8pt, inset: 10pt, width: 100%, below: 9pt, above: 6pt, [#text(size: 7.4pt, fill: col, tracking: 0.12em, upper(et)) \ #body])
#let tab(cols, widths, righe) = {
  set text(size: 8.2pt)
  table(columns: widths, stroke: (x, y) => (bottom: 0.5pt + linea), inset: (x: 5pt, y: 4.5pt),
    fill: (x, y) => if y == 0 { crema } else { none },
    ..cols.map(c => text(fill: nv2, size: 7.6pt, c)), ..righe.flatten().map(c => [#c]))
}
#let fig(path, cap) = block(breakable: false, below: 10pt, above: 6pt, {
  block(stroke: 0.6pt + linea, radius: 6pt, clip: true, image(path, width: 100%))
  v(2pt)
  text(size: 7.8pt, fill: nv2, cap)
})
'''


def S(s): return json.dumps(str(s), ensure_ascii=False)
def T(s): return f"#{S(s)}"
def A(l): return f"({l[0]},)" if len(l) == 1 else "(" + ", ".join(l) + ")"


def typ():
    t = HEADER + r'''
#page(fill: navy, margin: 22mm, header: none, footer: none)[
  #set text(fill: white)
  #grid(columns: (auto, auto), gutter: 8pt, align: horizon, image("../../demo-landing/img/logo-white.png", width: 26pt), text(size: 22pt)[unilink])
  #v(1fr)
  #text(size: 8pt, fill: arancio, tracking: 0.16em)[PROPOSTE · B · NON DEFINITIVE]
  #v(10pt)
  #text(size: 40pt)[Le proposte, \ prima di costruire.]
  #v(14pt)
  #text(size: 11pt)[Gruppi di studio, listino, UniLink Planner, orientamento, tesi e dopo la laurea, strumenti, barra di navigazione. Più di idee, meno di decisioni: da approvare. Con i mockup del planner e del listino.]
  #v(1fr)
  #set text(size: 8pt)
  #grid(columns: (1fr, 1fr, 1fr), gutter: 10pt, [Discusse in chat \ 7 ottobre 2026], [Per i founder \ Matteo, Cosimo, Niccolò, Gianmarco], [Base per le modifiche A \ della landing])
]
'''
    for n in DOC:
        k = n[0]
        if k == "h1": t += f"\n#cap({S(n[1])}, {S(n[2])})\n"
        elif k == "h2": t += f"#sub[{T(n[1])}]\n"
        elif k == "h3": t += f"#sub3[{T(n[1])}]\n"
        elif k == "p": t += f"{T(n[1])}\n\n"
        elif k == "ul": t += "\n".join(f"- {T(x)}" for x in n[1]) + "\n\n"
        elif k == "ol": t += "\n".join(f"+ {T(x)}" for x in n[1]) + "\n\n"
        elif k == "oss": t += f"#riquadro(\"Osservazione di Matteo\", ar3, ar2)[{T(n[1])}]\n"
        elif k == "dec": t += f"#riquadro(\"Deciso in chat\", verde, verde2)[{T(n[1])}]\n"
        elif k == "nota": t += f"#riquadro(\"Nota\", navy, nvt)[{T(n[1])}]\n"
        elif k == "img": t += f"#fig({S(n[1])}, {S(n[2])})\n"
        elif k == "tb":
            w = n[3] or ["1fr"] * len(n[1])
            t += f"#tab({A([S(c) for c in n[1]])}, {A(w)}, {A([A([S(c) for c in r]) for r in n[2]])})\n\n"
    return t


def main():
    intro(); p1(); p2(); p3(); p4(); p5(); p6(); p7(); p8(); collegamenti(); fonti()
    base = os.path.join(RADICE, "architettura")
    open(os.path.join(base, "PROPOSTE_UNILINK.md"), "w", encoding="utf-8").write(md())
    open(os.path.join(base, "proposte", "proposte.typ"), "w", encoding="utf-8").write(typ())
    import typst
    typst.compile(os.path.join(base, "proposte", "proposte.typ"), output=os.path.join(base, "UniLink_Proposte.pdf"), root=RADICE, font_paths=[RADICE])
    print("ok:", len(DOC), "elementi")


if __name__ == "__main__":
    main()
