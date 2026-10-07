/* UniLink · Strumenti (demo della landing)
   Gli strumenti vivono QUI, dentro la demo: nessun link al sito attuale. Oggi li usa solo la landing; sono scritti
   senza dipendenze (usano solo i token dello stile) così potranno essere riusati nella web app: il ramo
   claude/landing-v2-completo contiene una versione già collegata alla web app (v. LEGGIMI).

   AGGIUNGERE UNO STRUMENTO = una voce in UL_TOOLS (metadati) + una funzione in IMPL (cosa fa).
   Campi: id · nome · desc · hub (["tutti"] o slug degli hub) · stato ("live" funziona con regole certe,
   "demo" funziona ma con regole di ESEMPIO da verificare) · dove ("landing" = rapido e pubblico,
   "area" = completo, solo nell'area personale).
   Gli strumenti «solo area» (UL_TOOLS_AREA) sono voci bloccate nella landing: mostrano cosa c'è dopo l'accesso;
   `href` = pagina della web app a cui rimandano (rotte della web app v2: oggi, esami, materiali, erasmus, career…). */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fmt = (n, d = 1) => Number(n).toFixed(d).replace(".", ",");
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const OGGI = new Date("2026-10-06T09:00:00"); // la demo racconta sempre lo stesso giorno
  const giorniA = (iso) => Math.round((new Date(iso + "T09:00:00") - OGGI) / 864e5);

  window.UL_HUB_NOMI = { economia: "Economia", giurisprudenza: "Giurisprudenza", medicina: "Medicina", tutti: "Per tutti" };

  window.UL_TOOLS = [
    { id: "voto", nome: "Voto di laurea", desc: "Dalla media ponderata al voto finale.", hub: ["economia"], stato: "live", dove: "landing", icona: "110" },
    { id: "media", nome: "Media e voto obiettivo", desc: "Che voto serve negli esami che restano.", hub: ["tutti"], stato: "live", dove: "landing", icona: "Ø" },
    { id: "piano", nome: "Piano per l'appello", desc: "Argomenti e giorni: quanto ripassare ogni giorno.", hub: ["tutti"], stato: "live", dove: "landing", icona: "◷" },
    { id: "erasmus", nome: "Punteggio Erasmus", desc: "Una stima del tuo punteggio per il bando.", hub: ["economia"], stato: "demo", dove: "landing", icona: "✈" },
    // strumenti universali della home (proposta P6): compatti, uguali per tutti, regole per corso dove servono
    { id: "voto-cdl", nome: "Voto di laurea", desc: "Scegli il tuo corso: si applicano le sue regole.", hub: ["tutti"], stato: "live", dove: "landing", icona: "110" },
    { id: "peso", nome: "Quanto pesa questo esame", desc: "Come cambia la media con il prossimo voto.", hub: ["tutti"], stato: "live", dove: "landing", icona: "±" },
    { id: "countdown", nome: "Quanto manca all'appello", desc: "Giorni, ore utili e sessioni fino all'esame.", hub: ["tutti"], stato: "live", dove: "landing", icona: "⏳" },
    { id: "voto-lmg", nome: "Voto di laurea · ciclo unico", desc: "Media, tesi e bonus per Giurisprudenza.", hub: ["giurisprudenza"], stato: "demo", dove: "landing", icona: "§" },
    { id: "filtro", nome: "Piano semestre filtro", desc: "Settimane, ore e materie fino all'appello.", hub: ["medicina"], stato: "demo", dove: "landing", icona: "+" },
  ];
  // Solo nell'area personale: nella landing sono vetrina (bloccate), nella app si aprono dalle card Dxx
  window.UL_TOOLS_AREA = [
    { id: "erasmus-pro", nome: "Erasmus completo", desc: "Checklist di scadenze e destinazioni salvate nel tuo profilo.", hub: ["economia"], href: "#/app/percorso/erasmus", icona: "✈" },
    { id: "libretto", nome: "Media e voto di laurea completo", desc: "Esami superati, media pesata e tre scenari di voto di laurea.", hub: ["economia"], href: "#/app/percorso/libretto", icona: "▤" },
  ];

  // ---------- piccoli mattoni ----------
  const range = (id, lab, min, max, step, val, fm) => `<label class="tl-r"><span class="tl-l">${lab} <b id="${id}-o">${fm(val)}</b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
  const seg = (k, lab, opts, cur) => `<div class="tl-r"><span class="tl-l">${lab}</span><div class="tl-seg" data-k="${k}">${opts.map(([v, t]) => `<button type="button" data-v="${v}" class="${String(v) === String(cur) ? "on" : ""}">${t}</button>`).join("")}</div></div>`;
  const nota = (t) => `<p class="tl-nota">${t}</p>`;
  const flagDemo = `<p class="tl-flag">Regole di ESEMPIO: da sostituire con quelle ufficiali prima del lancio.</p>`;
  const paint = (r) => r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min)) * 100 + "%");

  const IMPL = {
    // Regole di UniLinkVotoLaurea.v5: media·110/30, +0,333 per lode, tesi 1-3, in corso +2, lode con pres ≥ 104,5 e tesi Ottimo
    voto(el) {
      const st = { media: 27.4, lodi: 2, tesi: 2, corso: 2 };
      el.innerHTML = `<div class="tl-in">${range("t-media", "Media ponderata", 18, 30, 0.1, st.media, (v) => fmt(v))}${range("t-lodi", "Lodi", 0, 10, 1, st.lodi, (v) => v)}
        ${seg("tesi", "Tesi", [[1, "Sufficiente"], [2, "Buona"], [3, "Ottima"]], st.tesi)}${seg("corso", "Quando ti laurei", [[2, "In corso"], [1, "Semestre dopo"], [0, "Più tardi"]], st.corso)}</div>
        <div class="tl-out"><div class="tl-k"><span>Voto di presentazione</span><b id="t-pres"></b></div><div class="tl-k big"><span>Voto finale stimato</span><b id="t-fin"></b></div><p class="tl-nota" id="t-nota"></p>
        ${nota("Regole della Scuola di Economia (versione compatta). Decide sempre la commissione.")}</div>`;
      const up = () => {
        const pres = (st.media * 11) / 3 + st.lodi * 0.333, fin = Math.min(110, pres + st.tesi + st.corso), lode = Math.round(fin) >= 110 && pres >= 104.5 && st.tesi === 3;
        $("#t-media-o", el).textContent = fmt(st.media); $("#t-lodi-o", el).textContent = st.lodi; $("#t-pres", el).textContent = fmt(pres);
        $("#t-fin", el).textContent = Math.round(fin) + (lode ? " e lode" : "");
        $("#t-nota", el).textContent = lode ? "Hai i requisiti per la lode." : Math.round(fin) >= 110 ? "110: per la lode servono presentazione ≥ 104,5 e tesi Ottima." : "Stima indicativa.";
      };
      $("#t-media", el).oninput = (e) => { st.media = +e.target.value; up(); };
      $("#t-lodi", el).oninput = (e) => { st.lodi = +e.target.value; up(); };
      $$(".tl-seg", el).forEach((g) => $$("button", g).forEach((b) => (b.onclick = () => { $$("button", g).forEach((x) => x.classList.remove("on")); b.classList.add("on"); st[g.dataset.k] = +b.dataset.v; up(); })));
      up();
    },

    // Media ponderata sui CFU e voto necessario nei CFU che restano (matematica esatta)
    media(el) {
      const righe = [[28, 9], [26, 6], [30, 12]];
      const st = { rest: 90, ob: 27 };
      el.innerHTML = `<div class="tl-in"><div class="tl-l">I tuoi esami (voto · CFU)</div><div id="m-righe"></div>
        <button type="button" class="tl-add" id="m-add">+ Aggiungi esame</button>
        ${range("m-rest", "CFU che ti restano", 0, 180, 3, st.rest, (v) => v)}${range("m-ob", "Media obiettivo", 18, 30, 0.1, st.ob, (v) => fmt(v))}</div>
        <div class="tl-out"><div class="tl-k"><span>Media attuale</span><b id="m-att"></b></div><div class="tl-k big"><span>Serve negli esami che restano</span><b id="m-need"></b></div><p class="tl-nota" id="m-nota"></p>
        ${nota("Media ponderata sui CFU. Il voto necessario è la media che devi ottenere nei CFU restanti per arrivare all'obiettivo.")}</div>`;
      const box = $("#m-righe", el);
      const draw = () => {
        box.innerHTML = righe.map((r, i) => `<div class="tl-row"><input type="number" min="18" max="30" value="${r[0]}" data-i="${i}" data-c="0" aria-label="Voto"><input type="number" min="3" max="18" value="${r[1]}" data-i="${i}" data-c="1" aria-label="CFU"><button type="button" data-del="${i}" aria-label="Togli">✕</button></div>`).join("");
        $$("input", box).forEach((x) => (x.oninput = () => { righe[+x.dataset.i][+x.dataset.c] = +x.value || 0; up(); }));
        $$("[data-del]", box).forEach((b) => (b.onclick = () => { righe.splice(+b.dataset.del, 1); draw(); up(); }));
      };
      const up = () => {
        const cfu = righe.reduce((s, r) => s + r[1], 0), somma = righe.reduce((s, r) => s + r[0] * r[1], 0);
        $("#m-att", el).textContent = cfu ? fmt(somma / cfu, 2) : "—";
        $("#m-rest-o", el).textContent = st.rest; $("#m-ob-o", el).textContent = fmt(st.ob);
        let n = "—", t = "";
        if (st.rest > 0 && cfu + st.rest > 0) { const x = (st.ob * (cfu + st.rest) - somma) / st.rest; n = fmt(x, 1); t = x > 30 ? "Con questa media non basta nemmeno con tutti 30: abbassa l'obiettivo." : x < 18 ? "Obiettivo già raggiunto: basta passare gli esami." : "Media da tenere nei prossimi esami."; }
        else t = "Nessun CFU residuo: la media è quella attuale.";
        $("#m-need", el).textContent = n; $("#m-nota", el).textContent = t;
      };
      $("#m-add", el).onclick = () => { righe.push([27, 6]); draw(); up(); };
      ["m-rest", "m-ob"].forEach((id) => ($("#" + id, el).oninput = (e) => { st[id === "m-rest" ? "rest" : "ob"] = +e.target.value; up(); }));
      draw(); up();
    },

    // Piano per l'appello: distribuzione deterministica degli argomenti sui giorni disponibili
    piano(el) {
      const st = { data: "2026-11-03", arg: 7, ripasso: 2 };
      el.innerHTML = `<div class="tl-in"><label class="tl-r"><span class="tl-l">Data dell'appello</span><input type="date" id="p-data" value="${st.data}" min="2026-10-07"></label>
        ${range("p-arg", "Argomenti da studiare", 3, 20, 1, st.arg, (v) => v)}${range("p-rip", "Giorni di ripasso finale", 0, 6, 1, st.ripasso, (v) => v)}</div>
        <div class="tl-out"><div class="tl-k"><span>Giorni all'appello</span><b id="p-gg"></b></div><div class="tl-k big"><span>Ritmo</span><b id="p-rit"></b></div><ol class="tl-plan" id="p-lista"></ol>
        ${nota("Piano a regole semplici: tutti gli argomenti prima, poi i giorni di ripasso. Più avanti diventa adattivo (card D04 / L02).")}</div>`;
      const up = () => {
        const gg = giorniA(st.data), studio = Math.max(0, gg - st.ripasso);
        $("#p-arg-o", el).textContent = st.arg; $("#p-rip-o", el).textContent = st.ripasso; $("#p-gg", el).textContent = gg > 0 ? gg : "—";
        const l = $("#p-lista", el);
        if (gg <= 0) { $("#p-rit", el).textContent = "—"; l.innerHTML = "<li>Scegli una data futura.</li>"; return; }
        if (studio < 1) { $("#p-rit", el).textContent = "Troppo poco"; l.innerHTML = "<li>Meno giorni degli argomenti: riduci il ripasso o sposta l'appello.</li>"; return; }
        const per = st.arg / studio;
        $("#p-rit", el).textContent = per >= 1 ? fmt(per, 1) + " arg/giorno" : "1 arg ogni " + fmt(1 / per, 1) + " gg";
        const per_giorno = {};
        for (let i = 1; i <= st.arg; i++) { const d = Math.floor(((i - 1) * studio) / st.arg) + 1; (per_giorno[d] = per_giorno[d] || []).push(i); }
        const out = Object.entries(per_giorno).map(([d, a]) => `Giorno ${d}: ${a.length === 1 ? "argomento " + a[0] : "argomenti " + a[0] + "–" + a[a.length - 1]}`);
        if (st.ripasso) out.push(`Ultimi ${st.ripasso} ${st.ripasso === 1 ? "giorno" : "giorni"}: ripasso e simulazione`);
        l.innerHTML = out.slice(0, 8).map((x) => `<li>${x}</li>`).join("") + (out.length > 8 ? `<li>… e altri ${out.length - 8} passi</li>` : "");
      };
      $("#p-data", el).oninput = (e) => { st.data = e.target.value; up(); };
      $("#p-arg", el).oninput = (e) => { st.arg = +e.target.value; up(); };
      $("#p-rip", el).oninput = (e) => { st.ripasso = +e.target.value; up(); };
      up();
    },

    // DEMO: formula di esempio, NON il bando
    erasmus(el) {
      const st = { media: 27, cfu: 80, lingua: 2 };
      el.innerHTML = `<div class="tl-in">${range("e-media", "Media", 18, 30, 0.1, st.media, (v) => fmt(v))}${range("e-cfu", "CFU acquisiti", 0, 180, 3, st.cfu, (v) => v)}
        ${seg("lingua", "Certificazione di lingua", [[0, "Nessuna"], [1, "B1"], [2, "B2"], [3, "C1"]], st.lingua)}</div>
        <div class="tl-out"><div class="tl-k big"><span>Punteggio stimato</span><b id="e-pt"></b></div><p class="tl-nota" id="e-nota"></p>${flagDemo}</div>`;
      const up = () => { const pt = clamp(st.media * 2 + st.cfu / 12 + st.lingua * 2, 0, 100); $("#e-media-o", el).textContent = fmt(st.media); $("#e-cfu-o", el).textContent = st.cfu; $("#e-pt", el).textContent = fmt(pt, 1) + " / 100"; $("#e-nota", el).textContent = pt >= 70 ? "Punteggio competitivo (soglia di esempio)." : "Margine per migliorare: media, CFU o lingua."; };
      $("#e-media", el).oninput = (e) => { st.media = +e.target.value; up(); };
      $("#e-cfu", el).oninput = (e) => { st.cfu = +e.target.value; up(); };
      $$(".tl-seg button", el).forEach((b) => (b.onclick = () => { $$(".tl-seg button", el).forEach((x) => x.classList.remove("on")); b.classList.add("on"); st.lingua = +b.dataset.v; up(); }));
      up();
    },

    // DEMO: base 110 su media 30, bonus tesi 0-8 di esempio
    "voto-lmg"(el) {
      const st = { media: 26.5, tesi: 4, corso: 1 };
      el.innerHTML = `<div class="tl-in">${range("g-media", "Media ponderata", 18, 30, 0.1, st.media, (v) => fmt(v))}${range("g-tesi", "Punti tesi", 0, 8, 1, st.tesi, (v) => "+" + v)}
        ${seg("corso", "Laurea in corso", [[1, "Sì · +1"], [0, "No"]], st.corso)}</div>
        <div class="tl-out"><div class="tl-k"><span>Base di partenza</span><b id="g-base"></b></div><div class="tl-k big"><span>Voto finale stimato</span><b id="g-fin"></b></div>${flagDemo}</div>`;
      const up = () => { const base = (st.media * 110) / 30; $("#g-media-o", el).textContent = fmt(st.media); $("#g-tesi-o", el).textContent = "+" + st.tesi; $("#g-base", el).textContent = fmt(base); $("#g-fin", el).textContent = Math.min(110, Math.round(base + st.tesi + st.corso)); };
      $("#g-media", el).oninput = (e) => { st.media = +e.target.value; up(); };
      $("#g-tesi", el).oninput = (e) => { st.tesi = +e.target.value; up(); };
      $$(".tl-seg button", el).forEach((b) => (b.onclick = () => { $$(".tl-seg button", el).forEach((x) => x.classList.remove("on")); b.classList.add("on"); st.corso = +b.dataset.v; up(); }));
      up();
    },

    // DEMO: ripartizione ore sulle tre materie del semestre filtro (date da fonti ufficiali)
    filtro(el) {
      const st = { sett: 9, ore: 24, f: 40, c: 35, b: 25 };
      el.innerHTML = `<div class="tl-in">${range("f-sett", "Settimane all'appello", 1, 20, 1, st.sett, (v) => v)}${range("f-ore", "Ore di studio a settimana", 6, 50, 1, st.ore, (v) => v)}
        <div class="tl-l">Peso delle materie</div>${["f", "c", "b"].map((k, i) => range("f-" + k, ["Fisica", "Chimica", "Biologia"][i], 10, 70, 5, st[k], (v) => v + "%")).join("")}</div>
        <div class="tl-out"><div class="tl-k"><span>Ore totali</span><b id="f-tot"></b></div><div id="f-split" class="tl-split"></div>${flagDemo}</div>`;
      const up = () => {
        const tot = st.sett * st.ore, somma = st.f + st.c + st.b || 1;
        $("#f-sett-o", el).textContent = st.sett; $("#f-ore-o", el).textContent = st.ore; $("#f-tot", el).textContent = tot + " h";
        ["f", "c", "b"].forEach((k) => ($("#f-" + k + "-o", el).textContent = st[k] + "%"));
        $("#f-split", el).innerHTML = [["Fisica", "f"], ["Chimica", "c"], ["Biologia", "b"]].map(([n, k]) => { const h = Math.round((tot * st[k]) / somma); return `<div><span>${n}</span><i style="width:${Math.round((st[k] / somma) * 100)}%"></i><b>${h} h</b></div>`; }).join("");
      };
      [["f-sett", "sett"], ["f-ore", "ore"], ["f-f", "f"], ["f-c", "c"], ["f-b", "b"]].forEach(([id, k]) => ($("#" + id, el).oninput = (e) => { st[k] = +e.target.value; up(); }));
      up();
    },
  };

  // ---------- strumenti universali (P6) ----------
  // Voto di laurea per corso di laurea: ogni corso ha le sue regole; quelle non verificate sono marcate «esempio»
  IMPL["voto-cdl"] = (el) => {
    const CORSI = [["voto", "Economia (EA · EC)", ""], ["voto-lmg", "Giurisprudenza", "esempio"], ["", "Medicina", "in arrivo"], ["", "Altri corsi", "in arrivo"]];
    let cur = "voto";
    el.innerHTML = `<div class="tl-r" style="margin-bottom:6px"><span class="tl-l">Il tuo corso di laurea</span><div class="tl-seg" data-k="cdl">${CORSI.map(([id, t, b]) => `<button type="button" data-v="${id}" class="${id === cur ? "on" : ""}" ${id ? "" : "disabled"}>${t}${b ? ` <small>· ${b}</small>` : ""}</button>`).join("")}</div></div><div class="tl-sub"></div>`;
    const sub = $(".tl-sub", el);
    const mount = () => { sub.innerHTML = ""; IMPL[cur](sub); $$("input[type=range]", sub).forEach((r) => { paint(r); r.addEventListener("input", () => paint(r)); }); };
    $$("[data-k=cdl] button", el).forEach((b) => (b.onclick = () => { if (!b.dataset.v) return; $$("[data-k=cdl] button", el).forEach((x) => x.classList.remove("on")); b.classList.add("on"); cur = b.dataset.v; mount(); }));
    mount();
  };
  // Quanto pesa il prossimo esame sulla media ponderata (e sulla base del voto di laurea, ×110/30)
  IMPL.peso = (el) => {
    const st = { media: 26.5, cfu: 60, voto: 28, cfuE: 9 };
    el.innerHTML = `<div class="tl-in">${range("p-media", "La tua media ora", 18, 30, 0.1, st.media, (v) => fmt(v))}${range("p-cfu", "CFU con voto", 3, 177, 3, st.cfu, (v) => v)}
      ${range("p-voto", "Voto del prossimo esame", 18, 31, 1, st.voto, (v) => (v > 30 ? "30L" : v))}${range("p-cfue", "CFU dell'esame", 3, 18, 1, st.cfuE, (v) => v)}</div>
      <div class="tl-out"><div class="tl-k big"><span>Nuova media</span><b id="p-nuova"></b></div><div class="tl-k"><span>Differenza</span><b id="p-diff"></b></div><div class="tl-k"><span>Base del voto di laurea (×110/30)</span><b id="p-base"></b></div>
      ${nota("Media ponderata sui CFU; la lode conta come 30. La base del voto di laurea è media × 110 / 30: i bonus dipendono dal corso.")}</div>`;
    const up = () => { const v = Math.min(30, st.voto), n = (st.media * st.cfu + v * st.cfuE) / (st.cfu + st.cfuE), d = n - st.media;
      $("#p-media-o", el).textContent = fmt(st.media); $("#p-cfu-o", el).textContent = st.cfu; $("#p-voto-o", el).textContent = st.voto > 30 ? "30L" : st.voto; $("#p-cfue-o", el).textContent = st.cfuE;
      $("#p-nuova", el).textContent = fmt(n, 2); $("#p-diff", el).textContent = (d >= 0 ? "+" : "−") + fmt(Math.abs(d), 2); $("#p-base", el).textContent = fmt((n * 110) / 30); };
    [["p-media", "media"], ["p-cfu", "cfu"], ["p-voto", "voto"], ["p-cfue", "cfuE"]].forEach(([id, k]) => ($("#" + id, el).oninput = (e) => { st[k] = +e.target.value; up(); }));
    up();
  };
  // Quanto manca all'appello: ore utili con margine 15–20% e sessioni da 45 minuti (la stessa logica del planner, P3)
  IMPL.countdown = (el) => {
    const oggi = new Date(); const def = new Date(oggi.getTime() + 28 * 864e5).toISOString().slice(0, 10);
    const st = { data: def, ore: 2.5, giorni: 6 };
    el.innerHTML = `<div class="tl-in"><label class="tl-r"><span class="tl-l">Data dell'appello</span><input type="date" id="c-data" value="${def}" class="tl-date"></label>
      ${range("c-ore", "Ore nette al giorno", 0.5, 8, 0.5, st.ore, (v) => fmt(v))}${range("c-gg", "Giorni di studio a settimana", 1, 7, 1, st.giorni, (v) => v)}</div>
      <div class="tl-out"><div class="tl-k"><span>Giorni all'appello</span><b id="c-giorni"></b></div><div class="tl-k big"><span>Ore utili (margine 18%)</span><b id="c-utili"></b></div><div class="tl-k"><span>Sessioni da 45 minuti</span><b id="c-sess"></b></div>
      ${nota("Margine del 18% per imprevisti (consigliato 15–20%). Il piano completo per fasi e sessioni è il planner dell'area personale.")}</div>`;
    const up = () => { const g = Math.max(0, Math.ceil((new Date(st.data) - new Date(oggi.toDateString())) / 864e5)), studio = Math.floor((g * st.giorni) / 7), ore = studio * st.ore * 0.82;
      $("#c-ore-o", el).textContent = fmt(st.ore); $("#c-gg-o", el).textContent = st.giorni;
      $("#c-giorni", el).textContent = g; $("#c-utili", el).textContent = fmt(ore, 0) + " h"; $("#c-sess", el).textContent = Math.floor(ore / 0.75); };
    $("#c-data", el).oninput = (e) => { st.data = e.target.value; up(); };
    $("#c-ore", el).oninput = (e) => { st.ore = +e.target.value; up(); };
    $("#c-gg", el).oninput = (e) => { st.giorni = +e.target.value; up(); };
    up();
  };

  // API: montare uno strumento in un contenitore (rispetta lo stile della demo che lo ospita)
  window.ULTools = {
    lista(hub) { return window.UL_TOOLS.filter((t) => !hub || t.hub.includes("tutti") || t.hub.includes(hub)); },
    area(hub) { return window.UL_TOOLS_AREA.filter((t) => !hub || t.hub.includes("tutti") || t.hub.includes(hub)); },
    trova(id) { return window.UL_TOOLS.find((t) => t.id === id); },
    monta(el, id) {
      const t = this.trova(id); if (!t || !IMPL[id]) { el.innerHTML = '<p class="tl-nota">Strumento non trovato.</p>'; return; }
      el.className = "tl-box"; el.innerHTML = "";
      const inner = document.createElement("div"); inner.className = "tl-body"; el.appendChild(inner);
      IMPL[id](inner);
      $$("input[type=range]", inner).forEach((r) => { paint(r); r.addEventListener("input", () => paint(r)); });
      // accessibilità: i risultati si annunciano da soli e le scelte dicono quale è attiva
      $$(".tl-out", inner).forEach((o) => { o.setAttribute("role", "status"); o.setAttribute("aria-live", "polite"); });
      const sync = () => $$(".tl-seg button", inner).forEach((b) => b.setAttribute("aria-pressed", b.classList.contains("on") ? "true" : "false"));
      sync(); inner.addEventListener("click", () => setTimeout(sync, 0));
    },
  };
})();
