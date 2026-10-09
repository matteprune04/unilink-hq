/* career · dati.js
   Modulo Career · DATI DI ESEMPIO (window.UL_C). Aziende, mentor ed eventi FITTIZI; prezzi = ipotesi della demo C.
   Per i dati veri: stessa forma degli oggetti, caricati da Supabase. Architettura: vedi career/core.js. */
/* Variante C — dati di esempio. Aziende, mentor ed eventi sono FITTIZI (demo). Prezzi = ipotesi da validare. */
window.UL_C = {
  PLUS: { mese: 7.99, semestre: 39 },
  TAKE_RATE: 0.25,

  companies: [
    { id: "acp", n: "Arno Capital Partners", s: "M&A boutique", c: "#172554", city: "Firenze" },
    { id: "lgs", n: "Lungarno Strategy", s: "Consulenza strategica", c: "#1a453c", city: "Milano / Firenze" },
    { id: "faa", n: "Fortezza Audit & Advisory", s: "Audit e advisory", c: "#914809", city: "Firenze" },
    { id: "obr", n: "Oltrarno Brands", s: "Moda e lusso", c: "#cf7527", city: "Firenze" },
    { id: "gdl", n: "Galileo Data Lab", s: "Data & analytics", c: "#2b5c52", city: "Remoto / Pisa" },
    { id: "pbk", n: "Ponte Banca Privata", s: "Private banking", c: "#22346f", city: "Firenze" },
  ],

  jobs: [
    { id: "j1", co: "acp", t: "Summer Analyst — M&A", type: "Stage", area: "Finance / IB / PE", loc: "Firenze", dur: "3 mesi · estate 2027", req: "III anno o magistrale, Excel, inglese C1", dl: 40, sponsored: true },
    { id: "j2", co: "lgs", t: "Business Analyst Intern", type: "Stage", area: "Consulting / Strategy", loc: "Milano", dur: "6 mesi", req: "Laureandi, problem solving, case interview", dl: 25 },
    { id: "j3", co: "faa", t: "Audit Assistant — graduate program", type: "Graduate", area: "Audit / Accounting / Tax", loc: "Firenze", dur: "Tempo indeterminato", req: "Laurea triennale/magistrale, media ≥ 26", dl: 60 },
    { id: "j4", co: "obr", t: "Marketing & E-commerce Intern", type: "Stage", area: "Marketing / Sales", loc: "Firenze", dur: "6 mesi", req: "Interesse per il lusso, inglese C1", dl: 18 },
    { id: "j5", co: "gdl", t: "Junior Data Analyst (part-time)", type: "Part-time", area: "Data / Analytics", loc: "Remoto", dur: "20 h/settimana", req: "Statistica, SQL o Python base", dl: 30 },
    { id: "j6", co: "pbk", t: "Stage in Wealth Management", type: "Stage", area: "Finance / IB / PE", loc: "Firenze", dur: "4 mesi", req: "Banca e mercati finanziari, inglese B2", dl: 45 },
    { id: "j7", co: "lgs", t: "Case competition: strategia per un brand toscano", type: "Case competition", area: "Consulting / Strategy", loc: "Firenze + online", dur: "2 settimane · premio €1.500", req: "Squadre da 3-4 studenti", dl: 12, sponsored: true },
  ],

  tracks: [
    { id: "msc", t: "MSc Track", sub: "Dalla triennale UNIFI a un master target", price: 349, weeks: 10, seats: 20, left: 6, start: 21, i: "cap",
      mods: ["Strategia: scegliere 6-8 programmi (Target, Semi-target, Regional)", "Piano GMAT/GRE e simulazioni", "CV in formato europeo per business school", "Motivation letter: struttura ed esempi", "Due revisioni 1:1 con un mentor ammesso", "Mock interview e lettere di referenza"] },
    { id: "fin", t: "Finance & Consulting Track", sub: "Prepararsi a colloqui IB, PE e consulting", price: 249, weeks: 6, seats: 25, left: 11, start: 14, i: "brief",
      mods: ["Technical: valutazione d'azienda e multipli", "Modellazione in Excel: three-statement model", "Case interview: framework e calcoli", "Fit interview e storytelling", "Due mock interview 1:1", "Candidature con le aziende partner"] },
    { id: "era", t: "Erasmus Track", sub: "Punteggio, destinazioni e Learning Agreement", price: 49, weeks: 3, seats: 60, left: 34, start: 30, i: "plane",
      mods: ["Calcolo del punteggio e soglie storiche", "Scelta delle destinazioni con il piano di studi", "Learning Agreement senza errori"] },
  ],

  mentors: [
    { id: "m1", n: "Francesca L.", r: "UNIFI EA → MSc Finance a Rotterdam", cat: "MSc", price: 45, rating: 4.9, rev: 38 },
    { id: "m2", n: "Andrea P.", r: "UNIFI EC → Analyst in una banca d'affari a Londra", cat: "Finance", price: 70, rating: 5.0, rev: 21 },
    { id: "m3", n: "Giulia M.", r: "UNIFI EA → consulente strategica a Milano", cat: "Consulting", price: 60, rating: 4.8, rev: 27 },
    { id: "m4", n: "Simone R.", r: "UNIFI EA → MSc in una Grande École francese", cat: "MSc", price: 50, rating: 4.7, rev: 19 },
    { id: "m5", n: "Irene T.", r: "Erasmus a Lisbona, ora magistrale a Bologna", cat: "Erasmus", price: 30, rating: 4.9, rev: 44 },
    { id: "m6", n: "Lorenzo B.", r: "III anno EA · 30L in Microeconomia", cat: "Esami", price: 30, rating: 4.9, rev: 31 },
  ],

  events: [
    { id: "e1", t: "Case competition: strategia per un brand toscano", co: "lgs", type: "Case competition", d: 12, h: "18:00", place: "Novoli + online", sponsored: true },
    { id: "e2", t: "Workshop: il tuo primo modello in Excel", co: null, type: "Workshop", d: 6, h: "17:30", place: "Online" },
    { id: "e3", t: "Info session: MSc in Finance (business school partner)", co: null, type: "Info session", d: 9, h: "18:30", place: "Online", sponsored: true },
    { id: "e4", t: "Alumni talk: da UNIFI a una banca d'affari", co: null, type: "Talk", d: 17, h: "18:00", place: "Novoli" },
    { id: "e5", t: "Office hours Big Four: come funzionano i graduate program", co: "faa", type: "Talk", d: 22, h: "17:00", place: "Online", sponsored: true },
  ],

  perks: [
    { t: "Corso GMAT online", d: "−15% per gli iscritti Plus", i: "target" },
    { t: "Certificazione IELTS", d: "Sessioni di preparazione di gruppo", i: "lang" },
    { t: "Alloggi per Erasmus", d: "Ricerca guidata con partner verificati", i: "pin" },
  ],

  // pipeline commerciale di esempio (B2B)
  pipeline: [
    { id: "p1", n: "Arno Capital Partners", k: "Azienda", plan: "Partner annuale", v: 4900, st: "won" },
    { id: "p2", n: "Lungarno Strategy", k: "Azienda", plan: "Case competition", v: 2500, st: "won" },
    { id: "p3", n: "Fortezza Audit & Advisory", k: "Azienda", plan: "Partner annuale", v: 4900, st: "prop" },
    { id: "p4", n: "Oltrarno Brands", k: "Azienda", plan: "3 annunci", v: 870, st: "prop" },
    { id: "p5", n: "Business school partner (esempio)", k: "Business school", plan: "Info session + lead", v: 3100, st: "won" },
    { id: "p6", n: "Ponte Banca Privata", k: "Azienda", plan: "Partner annuale", v: 4900, st: "lead" },
    { id: "p7", n: "Galileo Data Lab", k: "Azienda", plan: "Annuncio singolo", v: 290, st: "lead" },
  ],
};

