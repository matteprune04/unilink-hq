/* ../../02_AreaPersonale/assets/js/data-programmi.js */
/* Programmi Master / MSc — copiati dal tool "Master / Magistrale" di unilinkfirenze.it (163 programmi, ottobre 2026).
   Formato compatto: P(tier, cems, scuola, programma, aree, url, override)
   tier: T = Target, S = Semi-target, R = Regional.  aree: codici AR qui sotto.
   Le scuole con più programmi condividono luogo/durata/retta/test tramite SC. */
(function () {
  const AR = {
    FIN: "Finance / IB / PE", CF: "Corporate Finance / FP&A", Q: "Quant / Risk", CON: "Consulting / Strategy",
    MKT: "Marketing / Sales", DATA: "Data / Analytics", FT: "Fintech / Data", ECO: "Economics / Institutions",
    ENT: "Entrepreneurship", AUD: "Audit / Accounting / Tax", OPS: "Operations / Supply Chain",
  };

  const SC = {
    LSE: { n: "LONDON SCHOOL OF ECONOMICS", loc: "Londra, Regno Unito", d: "10 mesi", f: "£51.000", t: "GMAT Focus 655+ sensato; punteggio forte particolarmente utile da università non-target" },
    LBS: { n: "LONDON BUSINESS SCHOOL", loc: "Londra, Regno Unito", d: "12–16 mesi", f: "£52.950 + £200", t: "Trattalo come necessario: GMAT Focus 655+; internship finance fortemente consigliata" },
    IMP: { n: "IMPERIAL COLLEGE BUSINESS SCHOOL", loc: "Londra, Regno Unito", d: "12 mesi", f: "£51.000", t: "Imperial dichiara che aggiunge peso; media storica GMAT classico 645, minimo utile 600" },
    HEC: { n: "HEC PARIS", loc: "Jouy-en-Josas / Parigi, Francia", d: "18–36 mesi", f: "€57.700 + eventuali €2.950 gap year", t: "GMAT Focus 655+; stage ed extracurricular forti sono parte reale del profilo competitivo" },
    ESSEC: { n: "ESSEC BUSINESS SCHOOL", loc: "Cergy / Parigi, Francia", d: "24–36 mesi", f: "Circa €42.000–48.000", t: "GMAT Focus 625–655+; internship rilevante molto consigliata" },
    ESCP: { n: "ESCP BUSINESS SCHOOL", loc: "Multi-campus Europa, Francia / Europa", d: "24 mesi", f: "€48.600 totali EU", t: "GMAT Focus 615–645+; stage e mobilità internazionale valorizzati" },
    HSG: { n: "UNIVERSITY OF ST.GALLEN", loc: "St. Gallen, Svizzera", d: "18 mesi", f: "Circa CHF 3.300/semestre esteri", t: "GMAT Focus 655+ e internship finance/consulting sono fortemente consigliati" },
    BOC: { n: "UNIVERSITÀ BOCCONI", loc: "Milano, Italia", d: "24 mesi", f: "€18.550/anno", t: "Per esterni, test molto forte + internship; GMAT Focus 625–655+ è un riferimento utile" },
    SSE: { n: "STOCKHOLM SCHOOL OF ECONOMICS", loc: "Stoccolma, Svezia", d: "24 mesi", f: "Nessuna retta UE/EEA", t: "Test molto forte, voti e internship; attività extracurricolari considerate" },
    WHU: { n: "WHU – OTTO BEISHEIM", loc: "Vallendar / Düsseldorf, Germania", d: "17 o 21 mesi", f: "Circa €33.600–€39.900", t: "GMAT Focus 645+ e stage transaction services/IB/consulting" },
    MAN: { n: "UNIVERSITY OF MANNHEIM", loc: "Mannheim, Germania", d: "24 mesi", f: "Nessuna retta UE; contributi", t: "Voti alti, tedesco e internship sono i veri differenziatori" },
    WU: { n: "WU VIENNA", loc: "Vienna, Austria", d: "24 mesi", f: "Circa €364/semestre UE" },
    RSM: { n: "ROTTERDAM SCHOOL OF MANAGEMENT", loc: "Rotterdam, Paesi Bassi", d: "12 mesi", f: "€2.694 EEA | €25.800 non-EEA", t: "GMAT Focus almeno competitivo rispetto alla coorte; per UniFi puntare 605–635+" },
    LUISS: { n: "LUISS GUIDO CARLI", loc: "Roma, Italia", d: "24 mesi", f: "€17.000/anno", t: "Voti, test e internship; inglese alto per placement internazionale" },
    ESADE: { n: "ESADE BUSINESS SCHOOL" },
    NOVA: { n: "NOVA SCHOOL OF BUSINESS & ECONOMICS" },
    NHH: { n: "NORWEGIAN SCHOOL OF ECONOMICS" },
    CORV: { n: "CORVINUS UNIVERSITY OF BUDAPEST" },
    VSE: { n: "PRAGUE UNIVERSITY OF ECONOMICS AND BUSINESS" },
    CEMS: { d: "24 mesi", f: "Dipende dal master host", t: "Voti alti, lingue, leadership, mobilità e internship" },
  };

  const BOC_URL = "https://www.unibocconi.it/en/programs/master-science/";
  const CEMS_URL = "https://www.cems.org/academic-members/school-list";

  const list = [];
  function P(tier, cems, sc, prog, areas, url, o) {
    const base = typeof sc === "string" && SC[sc] ? SC[sc] : {};
    const p = Object.assign({ n: typeof sc === "string" && !SC[sc] ? sc : base.n }, base, o || {});
    list.push({
      id: "p" + (list.length + 1),
      tier, cems: !!cems, school: p.n, program: prog, loc: p.loc, durata: p.d, retta: p.f, lingua: "Inglese",
      aree: areas.split(" ").map((k) => AR[k]), test: p.t, url,
    });
  }
  // Programma CEMS MIM presso una scuola partner
  const C = (school, loc) => P("T", 1, school, "CEMS Master in International Management", "CON MKT CF", CEMS_URL, Object.assign({}, SC.CEMS, { loc }));

  // ——— TARGET ———
  P("T", 0, "LSE", "MSc Finance", "FIN CF Q", "https://www.lse.ac.uk/study-at-lse/graduate/msc-finance-full-time");
  P("T", 0, "LBS", "Masters in Financial Analysis", "FIN CF CON", "https://www.london.edu/masters-degrees/masters-in-financial-analysis");
  P("T", 0, "UNIVERSITY OF OXFORD — SAÏD", "MSc Financial Economics", "FIN CON ECO", "https://www.sbs.ox.ac.uk/programmes/msc-financial-economics", { loc: "Oxford, Regno Unito", d: "9 mesi", f: "£59.360 indicativi", t: "GMAT Focus 655–675+ e profilo accademico eccellente" });
  P("T", 0, "IMP", "MSc Finance", "FIN Q DATA", "https://www.imperial.ac.uk/business-school/masters/finance/");
  P("T", 1, "HEC", "Master in Management — Grande École", "CON FIN MKT", "https://www.hec.edu/en/master-s-programs/master-management");
  P("T", 0, "HEC", "Master in International Finance", "FIN Q CF", "https://www.hec.edu/en/master-s-programs/master-international-finance", { d: "10 mesi", f: "Circa €47.500", t: "GMAT Focus 665+ indicativo; internship finance quasi necessaria per essere competitivo" });
  P("T", 1, "ESSEC", "Master in Management — Grande École", "CON FIN MKT", "https://www.essec.edu/en/program/global-bba/master-in-management/");
  P("T", 0, "ESSEC", "Master in Finance", "FIN Q CF", "https://www.essec.edu/en/program/mscs/master-finance/", { loc: "Cergy / Parigi o Singapore, Francia", d: "12–24 mesi", f: "Circa €42.000", t: "GMAT Focus 645–655+; stage finance molto consigliata" });
  P("T", 0, "ESCP", "Master in Management", "CON FIN MKT", "https://escp.eu/programmes/master-in-management");
  P("T", 0, "ESADE", "MSc in Finance", "FIN CF CON", "https://www.esade.edu/master-of-science/en/program/master-in-finance", { loc: "Barcellona, Spagna", d: "12–18 mesi", f: "Circa €35.000–38.000", t: "GMAT Focus 615–645+; internship utile" });
  P("T", 1, "ESADE", "MSc International Management + CEMS MIM", "CON MKT OPS", "https://www.esade.edu/master-of-science/en/program/master-in-international-management", { loc: "Barcellona + CEMS partner, Spagna", d: "18–24 mesi", f: "Circa €35.000+", t: "GMAT Focus 615–645+ e forte componente internazionale" });
  P("T", 1, "NOVA", "International Master's in Management + CEMS", "CON CF MKT", "https://www.novasbe.unl.pt/en/programs/masters/cems-mim/overview", { loc: "Carcavelos + CEMS partner, Portogallo", d: "24 mesi", f: "€21.000 indicativi", t: "Test solido e profilo internazionale/co-curricular" });
  P("T", 1, "RSM", "MSc International Management / CEMS", "CON CF MKT", "https://www.rsm.nl/education/master/msc-programmes/msc-international-management-cems/", { loc: "Rotterdam + CEMS partner, Paesi Bassi", d: "18 mesi", f: "€2.694 EEA | €25.800 non-EEA circa", t: "GMAT solido; esperienze internazionali/extracurricular molto rilevanti" });
  P("T", 0, "WHU", "MSc Finance", "FIN CF CON", "https://www.whu.edu/en/programs/master-of-science-programs/master-in-finance/");
  P("T", 1, "MAN", "Mannheim Master in Management", "CON FIN MKT", "https://www.bwl.uni-mannheim.de/en/programs/master/mmm/");
  P("T", 1, "WU", "Master International Management / CEMS", "CON MKT CF", "https://www.wu.ac.at/en/programs/masters-programs/international-management-cems/overview", { t: "Leadership, lingue, esperienza internazionale e internship" });
  P("T", 0, "HSG", "Master Banking and Finance", "FIN Q CF", "https://www.unisg.ch/en/studying/programmes/master/banking-and-finance-mbf/");
  P("T", 0, "HSG", "Master Strategy and International Management", "CON CF ENT", "https://www.unisg.ch/en/studying/programmes/master/strategy-and-international-management-sim/", { t: "GMAT molto alto, leadership dimostrabile e internship blue-chip" });
  P("T", 0, "HSG", "Master Accounting and Corporate Finance", "CF AUD CON", "https://www.unisg.ch/en/studying/programmes/master/accounting-and-corporate-finance-macfin/", { t: "Voti forti e internship audit/deals/corporate finance" });
  P("T", 0, "BOC", "MSc Finance", "FIN Q CF", BOC_URL + "finance");
  P("T", 1, "BOC", "International Management + CEMS MIM", "CON MKT CF", BOC_URL + "international-management/im-cems-mim", { t: "Test forte, leadership, lingue e internship" });
  P("T", 1, "SSE", "MSc Finance", "FIN Q CF", "https://www.hhs.se/en/education/msc/mfin/");
  P("T", 1, "NHH", "MSc Economics and Business Administration — Financial Economics", "FIN Q ECO", "https://www.nhh.no/en/study-programmes/msc-in-economics-and-business-administration/", { loc: "Bergen, Norvegia", d: "24 mesi", f: "Nessuna retta UE/EEA/CH", t: "Punteggio sopra il minimo, quant forte e internship nordica" });
  P("T", 1, "CORV", "International Economy and Business + CEMS", "CON CF ECO", "https://www.uni-corvinus.hu/post/landing-page/international-opportunities/cems/?lang=en", { loc: "Budapest, Ungheria", d: "24 mesi", f: "Circa HUF 1,98m/anno EEA", t: "Lingue, leadership e internship internazionale" });
  P("T", 1, "VSE", "Master International Management / CEMS", "CON MKT CF", "https://cemsmim.vse.cz/", { loc: "Praga, Cechia", d: "24 mesi", f: "Circa €5.000/anno", t: "Leadership, lingue e internship" });
  P("T", 0, "BOC", "MSc Accounting and Financial Management", "AUD CF FIN", BOC_URL + "accounting-and-financial-management");
  P("T", 0, "BOC", "MSc International Management — Concentrations", "CON CF MKT", BOC_URL + "international-management");
  P("T", 0, "BOC", "MSc International Management — Global Experience", "CON CF MKT", BOC_URL + "international-management/im-global-experience");
  P("T", 0, "BOC", "MSc International Management — IM Asia", "CON CF MKT", BOC_URL + "international-management/im-asia");
  P("T", 0, "BOC", "MSc International Management — China MIM", "CON CF MKT", BOC_URL + "international-management");
  P("T", 0, "BOC", "MSc IM — ESSEC Luxury Management DD", "MKT DATA CON", BOC_URL + "international-management");
  P("T", 0, "BOC", "MSc Innovation, Technology and Entrepreneurship", "ENT CON DATA", BOC_URL + "innovation-technology-and-entrepreneurship");
  P("T", 0, "BOC", "MSc Marketing Management", "MKT DATA CON", BOC_URL + "marketing-management");
  P("T", 0, "BOC", "MSc Data Science and Business Analytics", "DATA FT Q", BOC_URL + "data-science-and-business-analytics");
  P("T", 0, "BOC", "MSc Artificial Intelligence", "DATA FT Q", BOC_URL + "artificial-intelligence");
  P("T", 0, "BOC", "MSc Economic and Social Sciences", "ECO DATA Q", BOC_URL + "economic-and-social-sciences");
  P("T", 0, "BOC", "MSc Economics and Management in Arts, Culture, Media and Entertainment", "MKT DATA CON", BOC_URL + "economics-and-management-arts-culture-media-and-entertainment");
  P("T", 0, "BOC", "MSc Economics and Management of Government and International Organizations", "ECO DATA Q", BOC_URL + "economics-and-management-government-and-international-organizations");
  P("T", 0, "BOC", "MSc Transformative Sustainability", "CON ECO ENT", BOC_URL + "transformative-sustainability");
  P("T", 0, "HEC", "MSc Strategic Management", "CON CF MKT", "https://www.hec.edu/en/master-s-programs/master-strategic-management");
  P("T", 0, "HEC", "MSc Marketing", "MKT DATA CON", "https://www.hec.edu/en/master-s-programs/master-marketing");
  P("T", 0, "HEC", "MSc Economics & Finance", "ECO DATA Q", "https://www.hec.edu/en/master-s-programs/master-economics-finance");
  P("T", 0, "HEC", "MSc Data Science & AI for Business — X-HEC", "DATA FT Q", "https://www.hec.edu/en/master-s-programs/master-science-data-science-ai-business-x-hec");
  P("T", 0, "HEC", "MSc Sustainability and Social Innovation", "CON ECO ENT", "https://www.hec.edu/en/master-s-programs/master-sustainability-and-social-innovation");
  P("T", 0, "HEC", "MSc X-HEC Entrepreneurs", "ENT CON DATA", "https://www.hec.edu/en/master-s-programs/master-science-x-hec-entrepreneurs");
  P("T", 0, "LSE", "MSc Finance and Economics", "FIN CF Q", "https://www.lse.ac.uk/study-at-lse/graduate/msc-finance-and-economics");
  P("T", 0, "LSE", "MSc Accounting and Finance", "AUD CF FIN", "https://www.lse.ac.uk/study-at-lse/graduate/msc-accounting-and-finance");
  P("T", 0, "LSE", "MSc Economics", "ECO DATA Q", "https://www.lse.ac.uk/study-at-lse/graduate/msc-economics");
  P("T", 0, "LSE", "MSc Econometrics and Mathematical Economics", "ECO DATA Q", "https://www.lse.ac.uk/study-at-lse/graduate/msc-econometrics-and-mathematical-economics");
  P("T", 0, "LSE", "MSc Management", "CON CF MKT", "https://www.lse.ac.uk/study-at-lse/graduate/msc-management");
  P("T", 0, "LSE", "MSc Marketing", "MKT DATA CON", "https://www.lse.ac.uk/study-at-lse/graduate/msc-marketing");
  P("T", 0, "LSE", "MSc Risk and Finance", "FIN CF Q", "https://www.lse.ac.uk/study-at-lse/graduate/msc-risk-and-finance");
  P("T", 0, "LBS", "Masters in Management", "CON CF MKT", "https://www.london.edu/masters-degrees/masters-in-management");
  P("T", 0, "LBS", "Masters in Analytics and Management", "DATA FT Q", "https://www.london.edu/masters-degrees/masters-in-analytics-and-management");
  P("T", 0, "LBS", "Global Masters in Management", "CON CF MKT", "https://www.london.edu/masters-degrees/global-masters-in-management");
  P("T", 0, "IMP", "MSc Financial Technology", "DATA FT Q", "https://www.imperial.ac.uk/business-school/masters/financial-technology/");
  P("T", 0, "IMP", "MSc Business Analytics", "DATA FT Q", "https://www.imperial.ac.uk/business-school/masters/business-analytics/");
  P("T", 0, "IMP", "MSc Management", "CON CF MKT", "https://www.imperial.ac.uk/business-school/masters/management/");
  P("T", 0, "IMP", "MSc Economics and Strategy for Business", "ECO DATA Q", "https://www.imperial.ac.uk/business-school/masters/economics-strategy-business/");
  P("T", 0, "IMP", "MSc Climate Change, Management and Finance", "FIN CON ECO", "https://www.imperial.ac.uk/business-school/masters/climate-change-management-finance/");
  P("T", 0, "IMP", "MSc Risk Management and Financial Engineering", "FIN CF Q", "https://www.imperial.ac.uk/business-school/masters/risk-management-financial-engineering/");
  P("T", 0, "ESSEC", "MSc Data Sciences & Business Analytics", "DATA FT Q", "https://www.essec.edu/en/program/mscs/msc-data-sciences-business-analytics/");
  P("T", 0, "ESSEC", "MSc Marketing Management and Digital", "MKT DATA CON", "https://www.essec.edu/en/program/mscs/msc-marketing-management-digital/");
  P("T", 0, "ESSEC", "MSc Sustainability Transformation", "CON ECO ENT", "https://www.essec.edu/en/program/mscs/msc-sustainability-transformation/");
  P("T", 0, "ESCP", "MSc Finance", "FIN CF Q", "https://escp.eu/programmes/specialised-masters-MScs/MSc-finance");
  P("T", 0, "ESCP", "MSc Big Data and Business Analytics", "DATA FT Q", "https://escp.eu/programmes/specialised-masters-MScs/MSc-big-data-business-analytics");
  P("T", 0, "ESCP", "MSc Marketing and Digital Media", "MKT DATA CON", "https://escp.eu/programmes/specialised-masters-MScs");
  P("T", 0, "HSG", "Master Economics", "ECO DATA Q", "https://www.unisg.ch/en/studying/programmes/master/economics-mecon/");
  P("T", 0, "HSG", "Master Business Innovation", "ENT CON DATA", "https://www.unisg.ch/en/studying/programmes/master/business-innovation-mbi/");
  P("T", 0, "HSG", "Master Marketing Management", "MKT DATA CON", "https://www.unisg.ch/en/studying/programmes/master/marketing-management-mim/");
  P("T", 0, "SSE", "MSc International Business", "CON CF MKT", "https://www.hhs.se/en/education/msc/mib/");
  P("T", 0, "SSE", "MSc Economics", "ECO DATA Q", "https://www.hhs.se/en/education/msc/mecon/");
  P("T", 0, "SSE", "MSc Business & Management", "ENT CON DATA", "https://www.hhs.se/en/education/msc/mbm/");
  P("T", 0, "WHU", "MSc Management", "CON CF MKT", "https://www.whu.edu/en/programs/master-of-science-programs/master-in-management/");
  P("T", 0, "WHU", "MSc Entrepreneurship", "ENT CON DATA", "https://www.whu.edu/en/programs/master-of-science-programs/master-in-entrepreneurship/");
  P("T", 0, "MAN", "MSc Economics", "ECO DATA Q", "https://www.uni-mannheim.de/en/academics/programs/msc-economics/");
  P("T", 0, "MAN", "Mannheim Master in Data Science", "DATA FT Q", "https://www.uni-mannheim.de/en/academics/programs/mannheim-master-in-data-science/");
  C("AALTO UNIVERSITY SCHOOL OF BUSINESS", "Helsinki, Finlandia");
  C("UNIVERSITÀ BOCCONI", "Milano, Italia");
  C("COPENHAGEN BUSINESS SCHOOL", "Copenaghen, Danimarca");
  C("CORNELL SC JOHNSON COLLEGE OF BUSINESS", "Ithaca, Stati Uniti");
  C("CORVINUS UNIVERSITY OF BUDAPEST", "Budapest, Ungheria");
  C("ESADE BUSINESS SCHOOL", "Barcellona, Spagna");
  C("FGV EAESP", "São Paulo, Brasile");
  C("HEC PARIS", "Jouy-en-Josas, Francia");
  C("HKUST BUSINESS SCHOOL", "Hong Kong, Hong Kong");
  C("INDIAN INSTITUTE OF MANAGEMENT CALCUTTA", "Kolkata, India");
  C("IVEY BUSINESS SCHOOL", "London, Ontario, Canada");
  C("KEIO UNIVERSITY", "Tokyo, Giappone");
  C("KOÇ UNIVERSITY GRADUATE SCHOOL OF BUSINESS", "Istanbul, Turchia");
  C("KOREA UNIVERSITY BUSINESS SCHOOL", "Seoul, Corea del Sud");
  C("LOUVAIN SCHOOL OF MANAGEMENT", "Louvain-la-Neuve, Belgio");
  C("NATIONAL UNIVERSITY OF SINGAPORE", "Singapore, Singapore");
  C("NORWEGIAN SCHOOL OF ECONOMICS", "Bergen, Norvegia");
  C("NOVA SCHOOL OF BUSINESS AND ECONOMICS", "Carcavelos, Portogallo");
  C("AUC ONSI SAWIRIS SCHOOL OF BUSINESS", "Cairo, Egitto");
  C("PRAGUE UNIVERSITY OF ECONOMICS AND BUSINESS", "Praga, Cechia");
  C("ROTTERDAM SCHOOL OF MANAGEMENT", "Rotterdam, Paesi Bassi");
  C("SGH WARSAW SCHOOL OF ECONOMICS", "Varsavia, Polonia");
  C("STOCKHOLM SCHOOL OF ECONOMICS", "Stoccolma, Svezia");
  C("LONDON SCHOOL OF ECONOMICS", "Londra, Regno Unito");
  C("UNIVERSITY OF SYDNEY BUSINESS SCHOOL", "Sydney, Australia");
  C("TSINGHUA SEM", "Pechino, Cina");
  C("UCD MICHAEL SMURFIT GRADUATE BUSINESS SCHOOL", "Dublino, Irlanda");
  C("UNIVERSIDAD ADOLFO IBÁÑEZ", "Santiago, Cile");
  C("UNIVERSIDAD DE LOS ANDES SCHOOL OF MANAGEMENT", "Bogotá, Colombia");
  C("UNIVERSITY OF CAPE TOWN GSB", "Cape Town, Sudafrica");
  C("UNIVERSITY OF COLOGNE", "Colonia, Germania");
  C("UNIVERSITY OF ST.GALLEN", "St. Gallen, Svizzera");
  C("WU VIENNA", "Vienna, Austria");
  P("T", 0, "NUS BUSINESS SCHOOL", "MSc Finance", "FIN CF FT", "https://mscfin.nus.edu.sg/", { loc: "Singapore, Singapore", d: "16 mesi indicativi", f: "Verificare fee intake", t: "Test forte, internship e chiara motivazione Asia" });
  P("T", 0, "HKUST BUSINESS SCHOOL", "MSc Finance", "FIN Q FT", "https://mscfin.hkust.edu.hk/", { loc: "Hong Kong, Hong Kong", d: "12 mesi indicativi", f: "Verificare fee intake", t: "Test forte e internship finance; cantonese/mandarino utili per molti ruoli" });
  P("T", 1, "TSINGHUA UNIVERSITY SEM", "Master in Management / Global Management", "CON CF ENT", "https://www.sem.tsinghua.edu.cn/en/Programs/Masters_Programs.htm", { loc: "Pechino, Cina", d: "24 mesi indicativi", f: "Verificare fee intake", t: "Top grades, test forte, leadership e chiaro fit con la Cina" });

  // ——— SEMI-TARGET ———
  P("S", 0, "UNIVERSITY COLLEGE LONDON", "MSc Finance", "FIN Q CF", "https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/finance-msc", { loc: "Londra — Canary Wharf, Regno Unito", d: "12 mesi", f: "£48.250", t: "UCL indica GMAT/GRE almeno 80° percentile o GRE Quant 162+ come elemento di peso" });
  P("S", 0, "WARWICK BUSINESS SCHOOL", "MSc Finance", "FIN CF Q", "https://www.wbs.ac.uk/courses/masters/finance/", { loc: "Coventry + eventi a Londra, Regno Unito", d: "12 mesi", f: "£44.950", t: "Test forte utile da università poco nota; più peso a voto, istituzione e quant fit" });
  P("S", 0, "EDHEC BUSINESS SCHOOL", "MSc in Financial Engineering", "Q FIN DATA", "https://www.edhec.edu/en/programmes/masters-degree/msc-financial-engineering", { loc: "Nizza, Francia", d: "18 mesi circa", f: "Circa €29.000–31.000", t: "Test quant forte utile; internship markets/AM consigliata" });
  P("S", 0, "EMLYON BUSINESS SCHOOL", "Master in Management — Grande École", "ENT CON MKT", "https://em-lyon.com/en/student/master-management-grande-ecole", { loc: "Lione, Francia", d: "24–36 mesi", f: "Circa €42.000–45.000", t: "Test solido + esperienze; target meno estremo di HEC/ESSEC" });
  P("S", 0, "IE BUSINESS SCHOOL", "Master in Finance", "FIN FT CF", "https://www.ie.edu/business-school/programs/masters/master-in-finance/", { loc: "Madrid, Spagna", d: "10–15 mesi", f: "€42.000 + €1.200", t: "GMAT Focus 615–645+; esperienza rilevante consigliata" });
  P("S", 0, "IESE BUSINESS SCHOOL", "Master in Management", "CON CF OPS", "https://www.iese.edu/master-in-management/", { loc: "Madrid, Spagna", d: "11 mesi", f: "€52.000", t: "Test solido e profilo leadership; non è necessario avere esperienza" });
  P("S", 0, "RSM", "MSc Finance & Investments", "FIN CF FT", "https://www.rsm.nl/education/master/msc-programmes/msc-finance-investments/");
  P("S", 0, "RSM", "MScBA Business Analytics & Management", "DATA OPS CON", "https://www.rsm.nl/education/master/msc-programmes/mscba-business-analytics-management/", { t: "Quant score forte e prove di coding/statistica" });
  P("S", 0, "VLERICK BUSINESS SCHOOL", "Masters in General Management", "CON CF MKT", "https://www.vlerick.com/en/programmes/masters-programmes/masters-in-general-management/", { loc: "Bruxelles / Gand / Leuven, Belgio", d: "10 mesi", f: "Circa €19.800", t: "Test solido e internship business rendono il profilo più credibile" });
  P("S", 0, "FRANKFURT SCHOOL", "Master of Finance", "FIN Q CF", "https://www.frankfurt-school.de/en/home/programmes/master/finance", { loc: "Francoforte, Germania", d: "24 mesi", f: "€42.000 + €400", t: "Test forte e internship finance; tedesco aumenta enormemente le opzioni" });
  P("S", 0, "ESMT BERLIN", "MSc Global Management", "CON ENT DATA", "https://esmt.berlin/degrees/masters/global-management", { loc: "Berlino, Germania", d: "24 mesi", f: "Circa €35.000", t: "Stage, leadership e test forte per borse/competitività" });
  P("S", 0, "WU", "MSc Strategy, Innovation and Management Control", "CON CF ENT", "https://www.wu.ac.at/en/programs/masters-programs/strategy-innovation-and-management-control/overview", { t: "Voti, fit curricolare e stage consulting/corporate" });
  P("S", 0, "ETH ZÜRICH + UZH", "MSc Quantitative Finance", "Q FT ECO", "https://ethz.ch/en/studies/master/degree-programmes/natural-sciences-and-mathematics/quantitative-finance.html", { loc: "Zurigo, Svizzera", d: "18 mesi", f: "Circa CHF 900/semestre esteri", t: "Top grades quantitativi; ammissione storicamente circa 15–20%" });
  P("S", 0, "LUISS", "Master's Degree in Finance", "FIN CF FT", "https://www.luiss.it/en/courses-and-masters-programmes/graduate-school/finance");
  P("S", 0, "POLITECNICO DI MILANO", "MSc Management Engineering", "CON OPS DATA", "https://www.polimi.it/en/education/laurea-magistrale-programmes/programme-detail/management-engineering", { loc: "Milano, Italia", d: "24 mesi", f: "Fino a circa €3.900/anno", t: "Voti, fit ECTS e progetti/stage" });
  P("S", 0, "COPENHAGEN BUSINESS SCHOOL", "MSc Finance and Strategic Management", "CF CON FIN", "https://www.cbs.dk/en/study/graduate/msc-in-economics-and-business-administration-finance-and-strategic-management", { loc: "Copenaghen, Danimarca", d: "24 mesi", f: "Nessuna retta UE/EEA", t: "Voti, prerequisiti e internship; danese utile localmente" });
  P("S", 0, "AALTO UNIVERSITY", "MSc Finance", "FIN Q FT", "https://www.aalto.fi/en/study-options/finance-master-of-science-economics-and-business-administration", { loc: "Espoo / Helsinki, Finlandia", d: "24 mesi", f: "Nessuna retta UE; €15.000/anno non-UE", t: "Sopra il minimo e GPA alto" });
  P("S", 0, "BI NORWEGIAN BUSINESS SCHOOL", "MSc Finance", "FIN Q CF", "https://www.bi.edu/programmes-and-individual-courses/master-programmes/finance/", { loc: "Oslo, Norvegia", d: "24 mesi", f: "NOK 128.200/anno indicativi", t: "Test, GPA e internship; norvegese utile" });
  P("S", 0, "WU", "MSc Quantitative Finance", "Q FT ECO", "https://www.wu.ac.at/en/programs/masters-programs/quantitative-finance/overview", { t: "Quant score elevato e transcript matematico forte" });
  P("S", 0, "WU", "MSc Marketing", "MKT DATA CON", "https://www.wu.ac.at/en/programs/masters-programs/marketing/overview", { t: "GPA, analytics e project/internship experience" });
  P("S", 0, "RSM", "MScBA Master in Management", "CON CF MKT", "https://www.rsm.nl/education/master/msc-programmes/master-in-management/");
  P("S", 0, "WU", "MSc Economics", "ECO DATA Q", "https://www.wu.ac.at/en/programs/masters-programs/economics/overview", { t: "Voti, fit curricolare e stage consulting/corporate" });
  P("S", 0, "LUISS", "Master's Degree in Management", "CON CF MKT", "https://www.luiss.it/en/courses-and-masters-programmes/graduate-school/management");
  P("S", 0, "LUISS", "Master's Degree in Marketing", "MKT DATA CON", "https://www.luiss.it/en/courses-and-masters-programmes/graduate-school/marketing");
  P("S", 0, "MAASTRICHT UNIVERSITY SCHOOL OF BUSINESS AND ECONOMICS", "MSc International Business — Strategic Corporate Finance", "CF FIN CON", "https://www.maastrichtuniversity.nl/education/master/programmes/international-business-strategic-corporate-finance", { loc: "Maastricht, Paesi Bassi", d: "12 mesi", f: "Retta statutaria EEA", t: "Voti, fit ECTS e internship finance" });

  // ——— REGIONAL ———
  P("R", 0, "UNIVERSIDAD CARLOS III DE MADRID", "Master in Finance", "FIN Q DATA", "https://www.uc3m.es/master/finance", { loc: "Madrid, Spagna", d: "11 mesi + stage opzionale", f: "Circa €9.000–13.500", t: "GMAT/GRE forte utile per profili internazionali ma non sostituisce i prerequisiti" });
  P("R", 0, "NOVA", "Master's in Finance", "FIN CF Q", "https://www.novasbe.unl.pt/en/programs/masters/finance/overview", { loc: "Carcavelos / Lisbona, Portogallo", d: "18–24 mesi", f: "Circa €15.149 EU/EEA", t: "GMAT Focus 605–635+; internship e international exposure utili" });
  P("R", 0, "CATÓLICA-LISBON SBE", "International MSc in Finance", "FIN CF AUD", "https://www.clsbe.lisboa.ucp.pt/international-msc-finance/overview", { loc: "Lisbona, Portogallo", d: "3–4 semestri", f: "Circa €18.400–24.900", t: "GMAT Focus 595–625+ utile; esperienza non indispensabile" });
  P("R", 0, "UNIVERSITY OF PORTO — FEP", "Master in Finance", "CF FIN AUD", "https://www.up.pt/fep/en/study/masters/finance/", { loc: "Porto, Portogallo", d: "24 mesi", f: "Circa €3.500–5.000/anno", t: "GMAT non necessario salvo obiettivo di differenziazione internazionale" });
  P("R", 0, "ISEG — UNIVERSITY OF LISBON", "MSc in Finance", "FIN CF ECO", "https://www.iseg.ulisboa.pt/study/masters/finance/", { loc: "Lisbona, Portogallo", d: "24 mesi", f: "Circa €9.000–12.000 totali", t: "Buoni voti e quant fit contano più del GMAT" });
  P("R", 0, "UNIVERSITY OF AMSTERDAM", "MSc Business Economics — Finance", "FIN ECO CF", "https://www.uva.nl/en/programmes/masters/business-economics/finance/finance.html", { loc: "Amsterdam, Paesi Bassi", d: "12 mesi", f: "Circa €2.700 EEA", t: "Quant score e GPA importanti; esperienza non sostitutiva" });
  P("R", 0, "TILBURG UNIVERSITY", "MSc Finance", "FIN CF Q", "https://www.tilburguniversity.edu/education/masters-programmes/finance", { loc: "Tilburg, Paesi Bassi", d: "12 mesi", f: "Circa €2.700 EEA", t: "GMAT 565+ vecchia scala spesso usato come soglia; score più alto utile" });
  P("R", 0, "VRIJE UNIVERSITEIT AMSTERDAM", "MSc Finance", "FIN CF Q", "https://vu.nl/en/education/master/finance-finance", { loc: "Amsterdam, Paesi Bassi", d: "12 mesi", f: "Circa €2.700 EEA", t: "Quant profile e voto; GMAT forte utile per honours tracks" });
  P("R", 0, "KU LEUVEN", "MSc Business Economics", "CF MKT CON", "https://www.kuleuven.be/programmes/master-business-economics", { loc: "Leuven, Belgio", d: "12 mesi", f: "Circa €1.200 EEA", t: "Voti e prerequisiti quantitativi contano più del test per profili UE solidi" });
  P("R", 0, "SOLVAY BRUSSELS SCHOOL", "MSc Business Engineering", "CON CF DATA", "https://www.solvay.edu/en/programmes/masters/business-engineering", { loc: "Bruxelles, Belgio", d: "24 mesi", f: "Circa €835–€5.000/anno", t: "Ottimi voti quantitativi e francese utile per mercato locale" });
  P("R", 0, "UNIVERSITY OF LUXEMBOURG", "MSc Finance and Economics", "FIN Q ECO", "https://www.uni.lu/fdef-en/study-programs/master-in-finance-and-economics/", { loc: "Lussemburgo, Lussemburgo", d: "24 mesi", f: "Circa €400/semestre", t: "Quant e lingue aumentano le chance per stage locali" });
  P("R", 0, "UNIVERSITÀ DI FIRENZE", "MSc Finance and Risk Management", "Q CF FIN", "https://www.unifi.it/en/study-us/degree-programs/second-cycle-degree/finance-and-risk-management", { loc: "Firenze, Italia", d: "24 mesi", f: "Contributo per ISEE", t: "Voti quantitativi e internship; certificazione inglese forte" });
  P("R", 0, "SGH WARSAW SCHOOL OF ECONOMICS", "MA Global Business, Finance and Governance", "CF ECO CON", "https://www.sgh.waw.pl/en/second-cycle-studies/master-studies-global-business-finance-and-governance", { loc: "Varsavia, Polonia", d: "24 mesi", f: "€2.400/semestre", t: "Voti, inglese e internship corporate/Big Four" });
  P("R", 0, "KOZMINSKI UNIVERSITY", "Master in Finance and Accounting", "AUD CF FIN", "https://www.kozminski.edu.pl/en/programs/graduate-programs-master/master-finance-and-accounting", { loc: "Varsavia, Polonia", d: "24 mesi", f: "Circa €6.000–€8.000/anno", t: "Certificazioni ACCA/CFA-oriented e internship" });
  P("R", 0, "UNIVERSITY OF ANTWERP", "MSc Business Economics", "CF MKT DATA", "https://www.uantwerpen.be/en/study/programmes/all-programmes/business-economics/", { loc: "Anversa, Belgio", d: "12 mesi", f: "Circa €1.200 EEA", t: "GPA, fit curricolare e internship" });
  P("R", 0, "TECHNICAL UNIVERSITY OF MUNICH", "MSc Management and Technology", "CON OPS DATA", "https://www.tum.de/en/studies/degree-programs/detail/management-and-technology-master-of-science-msc", { loc: "Monaco, Germania", d: "24 mesi", f: "Fee variabile per non-EEA", t: "Fit tecnico, voti e internship in tech/consulting" });
  P("R", 0, "UNIVERSITY OF INNSBRUCK", "MSc Banking and Finance", "FIN Q CF", "https://www.uibk.ac.at/en/programmes/ma-banking-and-finance/", { loc: "Innsbruck, Austria", d: "24 mesi", f: "Circa €364/semestre UE", t: "GPA quantitativo e stage DACH" });
  P("R", 0, "UNIVERSITY OF ZURICH", "MSc Banking and Finance", "FIN Q CF", "https://www.oec.uzh.ch/en/studies/master/it/bf.html", { loc: "Zurigo, Svizzera", d: "24 mesi", f: "Circa CHF 820/semestre", t: "Voti quantitativi, lingue e stage svizzero" });
  P("R", 0, "UNIVERSITÀ DI BOLOGNA", "MSc Economics and Econometrics", "ECO Q DATA", "https://corsi.unibo.it/2cycle/EconomicsEconometrics", { loc: "Bologna, Italia", d: "24 mesi", f: "Contributo per ISEE", t: "Transcript quantitativo forte; GRE utile per PhD internazionali" });
  P("R", 0, "UNIVERSITÀ CATTOLICA", "MSc Banking and Finance", "FIN Q CF", "https://international.unicatt.it/ucscinternational-graduate-programs-banking-and-finance", { loc: "Milano, Italia", d: "24 mesi", f: "Circa €10.000–€16.000/anno", t: "GPA, inglese e internship finance" });
  P("R", 0, "SGH WARSAW SCHOOL OF ECONOMICS", "MA Finance and Accounting — ACCA", "AUD CF FIN", "https://www.sgh.waw.pl/en/second-cycle-studies/master-studies-finance-and-accounting-acca-qualification-practical-profile", { loc: "Varsavia, Polonia", d: "24 mesi", f: "Fee English-track secondo intake", t: "ACCA orientation e internship Big Four" });
  P("R", 0, "CHARLES UNIVERSITY", "Master Economics and Finance", "ECO Q FIN", "https://ies.fsv.cuni.cz/en/admissions/masters-degree-programs/masters-economics-and-finance-mef", { loc: "Praga, Cechia", d: "24 mesi", f: "Circa €7.000/anno", t: "GRE Quant alto e transcript quantitativo" });
  P("R", 0, "UNIVERSITY OF LJUBLJANA — SEB", "Master International Business", "CON MKT CF", "https://www.ef.uni-lj.si/en/study/masters-programmes/international-business", { loc: "Lubiana, Slovenia", d: "24 mesi", f: "Fee secondo status", t: "Lingue, internship e exchange" });
  P("R", 0, "COMILLAS ICADE", "MSc Financial Statement Auditing and Advanced Accounting", "AUD CF", "https://www.comillas.edu/en/postgraduate/official-masters-degree-in-financial-statement-auditing-and-advanced-accounting/", { loc: "Madrid, Spagna", d: "12 mesi", f: "Verificare tariffa intake", t: "Voti, spagnolo e internship audit/accounting" });
  P("R", 0, "UNIVERSITY OF VIENNA", "MSc Banking and Finance", "FIN Q CF", "https://finance.univie.ac.at/en/studies/master-banking-and-finance/", { loc: "Vienna, Austria", d: "24 mesi", f: "Retta pubblica austriaca", t: "Superare il minimo quant e mostrare solide basi di finance/statistics" });

  window.UL_AREE_PROF = Object.values(AR);
  window.UL_PROGRAMMI = list;
})();

