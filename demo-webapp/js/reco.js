/* ../../02_AreaPersonale/assets/js/reco.js */
/* ============================================================
   Motore di raccomandazione Master / MSc
   Incrocia il profilo dello studente (media, test, inglese,
   esperienze, aree e paesi target, budget) con il database
   dei programmi del tool "Master / Magistrale" del sito.
   I pesi sono volutamente semplici e modificabili qui sotto.
   ============================================================ */
(function () {
  const UL = (window.UL = window.UL || {});

  const GEO_OF_COUNTRY = {
    "Regno Unito": "UK & Irlanda", Irlanda: "UK & Irlanda", Francia: "Francia", "Francia / Europa": "Francia",
    Spagna: "Spagna", Portogallo: "Portogallo", "Paesi Bassi": "Olanda", Germania: "Germania", Austria: "Austria",
    Svizzera: "Svizzera", Italia: "Italia", Svezia: "Nordics", Norvegia: "Nordics", Finlandia: "Nordics", Danimarca: "Nordics",
    Ungheria: "East EU", Cechia: "East EU", Polonia: "East EU", Slovenia: "East EU", Belgio: "BELUX", Lussemburgo: "BELUX",
    Singapore: "Asia", "Hong Kong": "Asia", Cina: "Asia", Giappone: "Asia", "Corea del Sud": "Asia", India: "Asia",
  };
  // stesse aree geografiche del filtro sul sito
  const GEO_LIST = ["Italia", "UK & Irlanda", "Francia", "Spagna", "Portogallo", "Olanda", "Germania", "Austria", "Svizzera", "BELUX", "Nordics", "East EU", "Asia", "CEMS", "Resto del mondo"];

  // aree dispense -> aree professionali (usate se lo studente non ha indicato aree target)
  const DISP_TO_PROF = {
    finanza: ["Finance / IB / PE", "Corporate Finance / FP&A"], marketing: ["Marketing / Sales"],
    management: ["Consulting / Strategy", "Operations / Supply Chain", "Entrepreneurship"],
    quant: ["Quant / Risk", "Data / Analytics", "Fintech / Data"], economia: ["Economics / Institutions"], diritto: ["Audit / Accounting / Tax"],
  };

  const LANG_HINTS = [
    { re: /tedesco/i, lingua: "Tedesco" }, { re: /francese/i, lingua: "Francese" }, { re: /spagnolo/i, lingua: "Spagnolo" },
    { re: /norvegese/i, lingua: "Norvegese" }, { re: /danese/i, lingua: "Danese" }, { re: /cantonese|mandarino/i, lingua: "Cinese" },
  ];

  const TIER = { T: { label: "Target", diff: 72, gmat: 645 }, S: { label: "Semi-target", diff: 60, gmat: 615 }, R: { label: "Regional", diff: 46, gmat: 575 } };
  const FX = { "£": 1.17, CHF: 1.06, NOK: 0.085, HUF: 0.0025 };

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  function country(p) { return p.loc.split(", ").pop(); }
  function geo(p) { return GEO_OF_COUNTRY[country(p)] || "Resto del mondo"; }
  function months(p) {
    const s = p.durata;
    const m = s.match(/(\d+)/);
    if (!m) return 24;
    return /semestr/.test(s) ? Number(m[1]) * 6 : Number(m[1]);
  }

  /** Stima della retta TOTALE in euro (null = non determinabile). */
  function feeEUR(p) {
    const s = p.retta;
    if (/Nessuna retta/i.test(s)) return 0;
    if (/ISEE/.test(s)) return 5000;
    if (/Dipende|Verificare|variabile|secondo|statutaria|pubblica/i.test(s)) return null;
    const m = s.match(/(\d{1,3}(?:\.\d{3})+|\d+(?:,\d+)?)\s*(m)?/);
    if (!m) return null;
    let n = m[1].includes(".") ? parseInt(m[1].replace(/\./g, ""), 10) : parseFloat(m[1].replace(",", "."));
    if (m[2]) n *= 1e6;
    let fx = 1;
    for (const k in FX) if (s.includes(k)) fx = FX[k];
    const mo = months(p);
    if (/\/anno/.test(s)) n *= Math.max(1, mo / 12);
    else if (/\/semestre/.test(s)) n *= Math.max(1, mo / 6);
    return Math.round(n * fx);
  }

  /** GMAT Focus di riferimento citato nel campo test (o default per tier). */
  function reqGmat(p) {
    const m = p.test.match(/GMAT Focus\s*(\d{3})/i);
    if (m) return { v: Number(m[1]), explicit: true };
    const c = p.test.match(/GMAT classico\s*(\d{3})/i);
    if (c) return { v: Number(c[1]) + 10, explicit: true };
    return { v: TIER[p.tier].gmat, explicit: false };
  }

  /** GMAT Focus equivalente dello studente (GRE convertito in modo approssimativo). */
  function userGmat(pr) {
    const g = parseInt(pr.gmat, 10);
    if (g >= 205 && g <= 805) return g;
    const gre = parseInt(pr.gre, 10);
    if (gre >= 260 && gre <= 340) return Math.round(clamp(555 + (gre - 300) * 4.6, 205, 805));
    return null;
  }

  /** Forza del profilo 0-100 con scomposizione. */
  function strength(user) {
    const pr = user.profile;
    const c = UL.store.career(pr);
    const media = c.media || 0;
    const gpa = media ? clamp((media - 22) / 8, 0, 1) * 45 : 0;
    const g = userGmat(pr);
    const test = g ? clamp((g - 505) / 200, 0, 1) * 25 : 0;
    const ENG = { A2: 0, B1: 1, B2: 3, C1: 6, C2: 8, Madrelingua: 8 };
    const eng = clamp((ENG[pr.inglese] || 0) + (pr.certInglese && pr.certInglese !== "Nessuna" ? 2 : 0), 0, 10);
    const stage = (pr.stage || []).length;
    const exp = clamp(stage * 6 + (pr.erasmus === "si" ? 4 : 0) + (pr.extracurricolari ? 3 : 0) + Math.min(3, (pr.altreLingue || []).length * 1.5), 0, 20);
    const total = Math.round(gpa + test + eng + exp);
    return {
      total, media, gmat: g,
      parts: [
        { k: "Media voti", v: gpa, max: 45 },
        { k: "Test (GMAT/GRE)", v: test, max: 25 },
        { k: "Inglese", v: eng, max: 10 },
        { k: "Esperienze", v: exp, max: 20 },
      ],
    };
  }

  function userProfAreas(pr) {
    if ((pr.areeProf || []).length) return pr.areeProf;
    const out = [];
    (pr.areeDispense || []).forEach((a) => (DISP_TO_PROF[a] || []).forEach((x) => out.includes(x) || out.push(x)));
    return out;
  }

  function score(p, user, st) {
    const pr = user.profile;
    const areas = userProfAreas(pr);
    const why = [];
    const todo = [];
    let rel = 0;

    // 1) area professionale (max 40)
    if (!areas.length) rel += 18;
    else {
      const hits = p.aree.filter((a) => areas.includes(a));
      const primary = areas[0];
      if (p.aree[0] === primary || (hits.includes(primary))) { rel += 40; why.push(`Forte focus su ${primary}, la tua area n.1`); }
      else if (hits.length) { rel += 24 + hits.length * 4; why.push(`Copre ${hits.join(" e ")}`); }
    }

    // 2) area geografica (max 25)
    const g = geo(p);
    const gsel = pr.geo || [];
    if (!gsel.length) rel += 12;
    else if (gsel.includes(g) || (gsel.includes("CEMS") && p.cems)) { rel += 25; why.push(p.cems && gsel.includes("CEMS") ? "Percorso CEMS, tra le tue preferenze" : `In ${g}, tra i paesi che hai scelto`); }

    // 3) budget (max 15)
    const fee = feeEUR(p);
    const bud = parseInt(pr.budget, 10);
    if (!bud) rel += 8;
    else if (fee === null) rel += 7;
    else if (fee <= bud) { rel += 15; why.push(fee === 0 ? "Nessuna retta per studenti UE" : `Retta stimata ~€${fee.toLocaleString("it-IT")}, dentro il tuo budget`); }
    else if (fee <= bud * 1.3) { rel += 6; todo.push(`Retta stimata ~€${fee.toLocaleString("it-IT")}: poco sopra il budget, cerca borse`); }
    else todo.push(`Retta stimata ~€${fee.toLocaleString("it-IT")}: oltre il tuo budget`);

    // 4) durata (max 5)
    const mo = months(p);
    if (pr.durata === "12") { if (mo <= 13) { rel += 5; why.push("Programma breve (~1 anno), come preferisci"); } }
    else if (pr.durata === "24") { if (mo >= 18) rel += 5; }
    else rel += 4;

    // 5) obiettivo dopo la laurea
    if (pr.dopoLaurea === "magistrale-italia" && g === "Italia") { rel += 10; why.push("In Italia, coerente con il tuo obiettivo"); }
    if (pr.dopoLaurea === "msc-estero" && g !== "Italia") rel += 4;

    // 6) corso di laurea di provenienza
    if (pr.cds === "EC" && p.aree.some((a) => /Economics|Quant/.test(a))) rel += 4;
    if (pr.cds === "EA" && p.aree.some((a) => /Audit|Consulting|Corporate/.test(a))) rel += 4;

    // lingue citate dal programma
    LANG_HINTS.forEach((h) => {
      if (h.re.test(p.test)) {
        const has = (pr.altreLingue || []).some((l) => (l.lingua || "").toLowerCase().startsWith(h.lingua.toLowerCase().slice(0, 5)));
        if (has) { rel += 5; why.push(`Parli ${h.lingua.toLowerCase()}: è un vantaggio esplicito qui`); }
        else todo.push(`Il ${h.lingua.toLowerCase()} aumenta molto le opportunità`);
      }
    });

    // fattibilità: profilo vs selettività
    const rq = reqGmat(p);
    let diff = TIER[p.tier].diff;
    if (st.gmat) diff += clamp((rq.v - st.gmat) / 6, -10, 12);
    const margin = st.total - diff;
    const fit = margin >= 8 ? "safe" : margin >= -6 ? "match" : "reach";

    if (!st.gmat && (p.tier !== "R" || rq.explicit) && /GMAT|GRE|[Tt]est/.test(p.test)) todo.push(`Riferimento test: ${rq.explicit ? "GMAT Focus " + rq.v + "+" : "test forte"} — non hai ancora inserito un punteggio`);
    else if (st.gmat && st.gmat < rq.v) todo.push(`Il tuo GMAT (${st.gmat}) è sotto il riferimento ${rq.v}+`);
    else if (st.gmat && rq.explicit) why.push(`Il tuo GMAT ${st.gmat} è in linea con il riferimento ${rq.v}+`);
    if (/internship|stage/i.test(p.test) && !(pr.stage || []).length) todo.push("Uno stage/internship pertinente è molto consigliato");
    if (st.media && st.media >= 28 && p.tier !== "R") why.push(`Media ${st.media.toFixed(1)}: competitiva per un ${TIER[p.tier].label}`);
    if (!["C1", "C2", "Madrelingua"].includes(pr.inglese)) todo.push("Punta a una certificazione d'inglese C1 (IELTS 7+ / TOEFL 100+)");

    // fattibilità: massima quando il programma è "in linea"; penalità forte se troppo ambizioso,
    // lieve se molto sotto il potenziale dello studente
    const feas = clamp(100 - Math.max(0, -margin) * 4 - Math.max(0, margin - 10) * 1.5, 0, 100);
    const total = Math.round(clamp(rel, 0, 100) * 0.75 + feas * 0.25);
    return { p, score: total, rel: Math.round(rel), fit, margin: Math.round(margin), geo: g, fee, why: why.slice(0, 4), todo: todo.slice(0, 3) };
  }

  function recommend(user, opts) {
    const st = strength(user);
    const list = (window.UL_PROGRAMMI || []).map((p) => score(p, user, st));
    list.sort((a, b) => b.score - a.score || a.p.tier.localeCompare(b.p.tier));
    // evita che una scuola monopolizzi la top list
    if (opts && opts.diversify) {
      const seen = {};
      const top = [];
      const rest = [];
      list.forEach((r) => { seen[r.p.school] = (seen[r.p.school] || 0) + 1; (seen[r.p.school] <= 2 ? top : rest).push(r); });
      return { st, list: top.concat(rest) };
    }
    return { st, list };
  }

  function tips(user, st) {
    const pr = user.profile;
    const out = [];
    if (!st.media) out.push({ t: "Inserisci la tua media (o il libretto esami) per stime affidabili", to: "#/app/profilo/libretto" });
    if (!st.gmat) out.push({ t: "Aggiungi un punteggio GMAT/GRE (anche simulato) — pesa fino a 25 punti", to: "#/app/profilo/lingue" });
    if (!(pr.stage || []).length) out.push({ t: "Uno stage estivo nell'area target è il differenziatore più citato dai programmi", to: "#/app/profilo/esperienze" });
    if (!["C1", "C2", "Madrelingua"].includes(pr.inglese)) out.push({ t: "Una certificazione d'inglese C1 è richiesta da quasi tutti i programmi", to: "#/app/profilo/lingue" });
    if (!(pr.areeProf || []).length) out.push({ t: "Scegli le aree professionali target: sono il criterio principale del match", to: "#/app/master" });
    return out;
  }

  UL.reco = { recommend, strength, feeEUR, geo, months, reqGmat, tips, GEO_LIST, TIER };
})();

