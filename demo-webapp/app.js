/* UniLink · Web app (area personale) — demo v1
   Riferimento per lo sviluppo reale (Next.js + Supabase), non codice di produzione.
   Indice: 1 utilità · 2 stato · 3 guscio (sidebar, testata, tab bar) · 4 VISTE sicure · 5 DA DECIDERE · 6 avvio
   Ogni vista è una funzione in VISTE: per aggiungerne una → riga in UL_MODULI (config.js) + funzione qui. */
(function () {
  "use strict";

  /* ---------------- 1 · utilità ---------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const SITO = window.UL_SITO, WA = window.UL_WA, DISP = window.UL_DISPENSE || [];
  const OGGI = new Date("2026-10-06T09:00:00"); // data fissa: la demo racconta sempre lo stesso giorno
  const giorni = (iso) => Math.round((new Date(iso + "T09:00:00") - OGGI) / 864e5);
  const dataIt = (iso, opt = { day: "numeric", month: "short" }) => new Date(iso + "T09:00:00").toLocaleDateString("it-IT", opt);
  const num = (n, d = 1) => Number(n).toFixed(d).replace(".", ",");
  const SOTTO = '<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 13 C 55 4, 130 3, 197 9" stroke="#cf7527" stroke-width="5" fill="none" stroke-linecap="round"/></svg>';
  // «parola accento» della landing: *parola* → arancio sottolineato a mano (una per titolo)
  const acc = (t) => esc(t).replace(/\*(.+?)\*/, '<span class="acc">$1' + SOTTO + "</span>");
  const disp = (slug) => DISP.find((d) => d.slug === slug);
  const cop = (d) => (d && d.cop ? "img/cop/" + d.cop : "");

  const IC = {
    casa: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    libro: '<path d="M4 4h11a3 3 0 0 1 3 3v14H7a3 3 0 0 1-3-3z"/><path d="M4 18a3 3 0 0 1 3-3h11"/>',
    attrezzi: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2"/>',
    utente: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    cantiere: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
    freccia: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    link: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    salva: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    gruppo: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.6-5.5 6.5-5.5s5.5 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c1.8.6 3 2.4 3.5 5.5"/>',
  };
  const ico = (k, cls = "") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k] || ""}</svg>`;

  /* ---------------- 2 · stato (in demo: nel browser; nella app vera: Supabase) ---------------- */
  const KEY = "ul-app-v1";
  const leggi = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
  const S = leggi() || { utente: JSON.parse(JSON.stringify(window.UL_UTENTE)), attesa: {}, dentro: true };
  const salva = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const U = () => S.utente;
  const HUB = () => window.UL_HUB.find((h) => h.slug === U().hub) || window.UL_HUB[0];
  const attivo = () => HUB().stato === "attivo";
  const perHub = (x) => x.hub.includes("tutti") || x.hub.includes(U().hub);

  let toastT;
  const toast = (t) => { const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (el.hidden = true), 2600); };
  const modal = (html) => { const m = $("#modal"); $(".sheet", m).innerHTML = html; m.hidden = false; const f = $("input,select,button", m); f && f.focus(); };
  const chiudi = () => ($("#modal").hidden = true);

  /* ---------------- 3 · guscio ---------------- */
  function guscio(rotta) {
    const sez = rotta[0];
    const nav = window.UL_MODULI.map((m) => `<a href="#/${m.id}" class="${sez === m.id ? "on" : ""}">${ico(m.icona)}<span>${esc(m.nome)}</span>${m.id === "esami" && U().esami.length ? `<span class="pill">${U().esami.length}</span>` : ""}</a>`).join("");
    $("#side").innerHTML = `
      <a class="logo" href="#/oggi"><img src="img/logo-white.png" alt="">unilink</a>
      <div class="hubsel"><label for="hubsel">Il tuo hub</label>
        <select id="hubsel">${window.UL_HUB.map((h) => `<option value="${h.slug}" ${h.slug === U().hub ? "selected" : ""}>${esc(h.nome)}${h.stato === "attivo" ? "" : " · in arrivo"}</option>`).join("")}</select>
        <span class="sub">${esc(HUB().ateneo)} · ${esc(U().corso)}</span></div>
      <div class="navg">Il tuo spazio</div>
      <nav class="navl" aria-label="Sezioni">${nav}</nav>
      <div class="navg">Sezione di lavoro</div>
      <nav class="navl navdec" aria-label="Da decidere"><a href="#/decidere" class="${sez === "decidere" ? "on" : ""}">${ico("cantiere")}<span>Da decidere</span><span class="pill">${window.UL_DA_DECIDERE.length}</span></a></nav>
      <div class="spacer"></div>
      <a class="me" href="#/profilo"><span class="av">${esc(U().nome[0] + U().cognome[0])}</span><span><span class="n">${esc(U().nome + " " + U().cognome)}</span><br><span class="e">Account demo · dati di esempio</span></span></a>
      <div class="ver">Demo v${window.UL_VERSIONE.n} · ${dataIt(window.UL_VERSIONE.data, { day: "numeric", month: "long", year: "numeric" })}</div>`;
    const nome = sez === "decidere" ? "Da decidere" : (window.UL_MODULI.find((m) => m.id === sez) || {}).nome || "";
    $("#top").innerHTML = `
      <button class="burger" data-menu aria-label="Apri il menu">${ico("menu")}</button>
      <a class="mlogo" href="#/oggi"><img src="img/logo-blu.png" alt="">unilink</a>
      <div class="crumb">Il tuo spazio / <b>${esc(nome)}</b></div>
      <div class="dx"><span class="data">${OGGI.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}</span>
        <a class="sito" href="${SITO}" target="_blank" rel="noopener">Sito pubblico</a>
        <a class="mdec" href="#/decidere">Da decidere</a>
        <span class="demoflag" title="Dati di esempio">DEMO</span></div>`;
    $("#tabbar").innerHTML = window.UL_MODULI.filter((m) => m.tab).map((m) => `<a href="#/${m.id}" class="${sez === m.id ? "on" : ""}">${ico(m.icona)}<span>${esc(m.nome.replace("I miei esami", "Esami"))}</span></a>`).join("");
  }

  const testa = (eyebrow, titolo, sotto, azioni = "") => `<div class="ph"><div><div class="eyebrow">${esc(eyebrow)}</div><h1>${acc(titolo)}</h1>${sotto ? `<p>${sotto}</p>` : ""}</div>${azioni}</div>`;
  const rimando = (id, testo) => { const d = window.UL_DA_DECIDERE.find((x) => x.id === id); return d ? `<a class="dec-banner" href="#/decidere/${id}">${ico("cantiere")}<span><b>Da decidere · ${id}</b> — ${esc(testo || d.titolo)}. Apri l'architettura →</span></a>` : ""; };

  /* ---------------- 4 · VISTE sicure ---------------- */
  const VISTE = {};

  // P00 · Accesso (nella app vera: link via email con Supabase Auth, niente password)
  VISTE.accedi = () => `
    <div class="login">
      <div class="sx"><a class="logo" style="display:flex;gap:8px;align-items:center;font-size:26px;color:#fff"><img src="img/logo-white.png" alt="" style="width:34px">unilink</a>
        <div><h1>Il tuo spazio, <span class="acc">UniLink${SOTTO}</span></h1>
          <p style="opacity:.85;margin-top:16px;max-width:460px">Le tue dispense, i tuoi esami e gli strumenti per scegliere, in un posto solo. Da studenti a studenti.</p></div>
        <p class="small" style="color:rgba(244,241,234,.7)">Progetto indipendente, non affiliato all'Università di Firenze.</p></div>
      <div class="dx"><form class="box" id="frm-accedi">
        <div class="eyebrow">Accedi</div><h2>Ti mandiamo un link via email</h2>
        <p class="small">Niente password da ricordare: apri il link e sei dentro.</p>
        <label class="fld">Email<input type="email" name="email" placeholder="nome.cognome@stud.unifi.it" autocomplete="email"></label>
        <button class="btn btn-p" type="submit">Mandami il link</button>
        <button class="btn btn-s" type="button" data-entra>Entra con l'account demo</button>
        <p class="small">Demo: nessuna email viene inviata, i dati restano in questo browser.</p></form></div>
    </div>`;

  // P01 · Oggi
  VISTE.oggi = () => {
    if (!attivo()) return hubInArrivo();
    const es = U().esami.slice().sort((a, b) => a.data.localeCompare(b.data));
    const e = es.find((x) => x.fatti.length < x.argomenti.length);
    const salvate = U().salvate.map(disp).filter(Boolean);
    const tot = es.reduce((s, x) => s + x.argomenti.length, 0), fatti = es.reduce((s, x) => s + x.fatti.length, 0);
    const passo = e ? (() => {
      const i = e.argomenti.findIndex((_, k) => !e.fatti.includes(k)), d = disp(e.slug);
      return `<div class="passo"><span class="badge plain">Il prossimo passo</span>
        <h2>${esc(d ? d.nome : e.slug)} · ${esc(e.argomenti[i])}</h2>
        <p>Appello il ${dataIt(e.data)} · tra ${giorni(e.data)} giorni · obiettivo ${e.obiettivo}/30</p>
        <div class="cta"><button class="btn btn-c" data-fatto="${esc(e.slug)}" data-i="${i}">Segna come ripassato</button>${d ? `<a class="btn btn-o" href="#/dispense/${esc(d.slug)}">Apri la dispensa</a>` : ""}</div></div>`;
    })() : `<div class="passo"><span class="badge plain">Il prossimo passo</span><h2>Aggiungi il tuo prossimo esame</h2><p>Inserisci data e argomenti: ti diciamo ogni giorno da dove ripartire.</p><div class="cta"><a class="btn btn-c" href="#/esami">Vai ai miei esami</a></div></div>`;
    const prossimo = es[0];
    return `${testa("Economia · " + HUB().ateneo + " · il tuo spazio", "Cosa prepari *oggi*, " + U().nome + "?", "Le tue attività, le tue dispense e gli strumenti che usi.")}
      <div class="grid g-main">${passo}
        <div class="grid g2">
          <div class="card stat"><span class="l">Prossimo appello</span><span class="v">${prossimo ? giorni(prossimo.data) + " <small>giorni</small>" : "—"}</span><span class="l">${prossimo ? esc((disp(prossimo.slug) || {}).nome || "") : "Nessun esame"}</span></div>
          <div class="card stat"><span class="l">Argomenti ripassati</span><span class="v">${fatti}<small>/${tot}</small></span><span class="l">Nei tuoi esami</span></div>
          <div class="card stat"><span class="l">Media</span><span class="v">${num(U().media)}<small>/30</small></span><span class="l">Dal tuo profilo</span></div>
          <div class="card stat"><span class="l">Dispense salvate</span><span class="v">${salvate.length}</span><span class="l">Nella tua libreria</span></div>
        </div></div>
      <div class="grid g2">
        <section class="card"><div class="card-h"><h2>I tuoi esami</h2><a class="link" href="#/esami">Gestisci</a></div>
          ${es.length ? es.map((x) => { const d = disp(x.slug), p = Math.round((x.fatti.length / x.argomenti.length) * 100); return `<div class="row"><span class="ini">${esc((d ? d.nome : x.slug).slice(0, 2).toUpperCase())}</span><div class="grow"><div class="t">${esc(d ? d.nome : x.slug)}</div><div class="small">${dataIt(x.data)} · obiettivo ${x.obiettivo}/30 · ${x.fatti.length}/${x.argomenti.length} argomenti</div><div class="bar" style="margin-top:8px"><i style="width:${p}%"></i></div></div></div>`; }).join("") : `<p class="small">Nessun esame ancora.</p>`}</section>
        <section class="card"><div class="card-h"><h2>Le tue dispense</h2><a class="link" href="#/dispense">Catalogo</a></div>
          ${salvate.map((d) => `<a class="row" href="#/dispense/${esc(d.slug)}"><img src="${cop(d)}" alt="" style="width:56px;height:42px;object-fit:cover;border-radius:8px"><div class="grow"><div class="t">${esc(d.nome)}</div><div class="small">${esc(d.anno)} anno · ${esc(d.tipi.join(" · "))}</div></div></a>`).join("")}</section>
      </div>
      <div class="grid g2">
        <section class="card"><div class="card-h"><h2>Strumenti per te</h2><a class="link" href="#/strumenti">Tutti</a></div>
          ${window.UL_STRUMENTI.filter(perHub).slice(0, 3).map(rigaTool).join("")}</section>
        <section class="card" style="background:var(--navy);color:var(--crema)"><div class="eyebrow" style="color:var(--arancio)">Community</div><h2 style="color:#fff;margin:6px 0 8px">Il gruppo di Economia</h2><p style="opacity:.85">Avvisi su dispense nuove, domande e scadenze. È il nostro canale principale.</p><a class="btn btn-c" style="margin-top:16px" href="${WA}" target="_blank" rel="noopener">Apri il gruppo WhatsApp</a></section>
      </div>`;
  };

  // Hub in arrivo: stato REALE di oggi (lista d'attesa) + rimando all'architettura DA DECIDERE
  function hubInArrivo() {
    const h = HUB(), dentro = S.attesa[h.slug];
    return `${testa(h.nome + " · " + h.ateneo + " · in arrivo", "Ciao " + U().nome + ", *" + h.nome + "* sta arrivando", "Non abbiamo ancora materiali per " + esc(h.nome) + ": ti diciamo la verità e ti avvisiamo quando l'hub parte.")}
      <section class="hubtesta" style="background:${h.tinta}"><span class="badge" style="justify-self:start">In arrivo</span>
        <h2>Cosa vorremmo fare</h2>
        <div class="fasi">${h.fasi.map((f) => `<div class="fase"><b>${esc(f[0])}</b><span class="small">${esc(f[1])}</span></div>`).join("")}</div></section>
      <div class="grid g2">
        <section class="card">${dentro ? `<div class="card-h"><h2>Sei in lista d'attesa</h2><span class="badge ok">Iscritto</span></div><p class="small">Ti scriviamo solo quando l'hub parte. Risposta salvata: «${esc(dentro)}».</p><button class="btn btn-s btn-sm" style="margin-top:14px" data-esci-attesa>Annulla l'iscrizione</button>`
          : `<form id="frm-attesa" style="display:grid;gap:14px"><h2>Avvisami quando parte</h2>
            <label class="fld">${esc(h.domanda)}<select name="r" required><option value="">Scegli…</option>${(h.slug === "medicina" ? ["Sì, sono nel semestre filtro", "No, sono più avanti", "Mi devo ancora iscrivere"] : ["I anno", "II anno", "III anno", "IV–V anno", "Mi devo ancora iscrivere"]).map((o) => `<option>${o}</option>`).join("")}</select></label>
            <label class="chk"><input type="checkbox" required> Ho letto l'informativa privacy: usate la mia email solo per avvisarmi quando l'hub parte.</label>
            <button class="btn btn-p" type="submit">Avvisami</button></form>`}</section>
        <section class="card" style="background:var(--ar2)"><div class="eyebrow">Costruiscilo con noi</div><h2 style="margin:6px 0 8px">Studi ${esc(h.nome)}?</h2><p class="muted">Cerchiamo i primi studenti dell'hub: materiali, idee, ambassador. Ogni hub parte quando c'è chi lo costruisce.</p><a class="btn btn-a" style="margin-top:16px" href="${WA}" target="_blank" rel="noopener">Scrivici</a></section>
      </div>
      <section class="card"><div class="card-h"><h2>Intanto, per tutti</h2></div>
        ${window.UL_STRUMENTI.filter((t) => t.hub.includes("tutti")).map(rigaTool).join("")}
        <div class="row"><span class="ini">${ico("calendario")}</span><div class="grow"><div class="t">I miei esami</div><div class="small">Funziona già per ogni corso: inserisci date e argomenti.</div></div><a class="btn btn-s btn-sm" href="#/esami">Apri</a></div></section>
      ${rimando(h.decidere, "Come sarebbe l'hub di " + h.nome + " una volta attivo")}`;
  }

  function rigaTool(t) {
    const href = t.tipo === "interno" ? `#/strumenti/${t.id}` : SITO + t.url;
    return `<a class="row tool" href="${href}" ${t.tipo === "link" ? 'target="_blank" rel="noopener"' : ""}><span class="ic">${ico(t.tipo === "interno" ? "attrezzi" : "link")}</span><div class="grow"><div class="t">${esc(t.nome)}</div><div class="small">${esc(t.desc)}${t.tipo === "link" ? " · sul sito" : ""}</div></div>${ico("freccia", "sr-no")}</a>`;
  }

  // P02 · I miei esami
  VISTE.esami = () => {
    const es = U().esami.slice().sort((a, b) => a.data.localeCompare(b.data));
    const cerchio = (p) => `<svg class="cerchio" viewBox="0 0 64 64" aria-label="${p}% ripassato"><circle cx="32" cy="32" r="27" fill="none" stroke="#ebe4d5" stroke-width="7"/><circle cx="32" cy="32" r="27" fill="none" stroke="#cf7527" stroke-width="7" stroke-linecap="round" stroke-dasharray="${(p / 100) * 169.6} 169.6" transform="rotate(-90 32 32)"/><text x="32" y="37" text-anchor="middle" font-size="14" fill="#172554" font-family="Croogla">${p}%</text></svg>`;
    return `${testa("Studio", "I miei *esami*", "Le date le inserisci tu: controllale sempre sulla pagina ufficiale del corso.", `<button class="btn btn-p" data-nuovo-esame>Aggiungi esame</button>`)}
      ${es.length ? es.map((x) => { const d = disp(x.slug), p = Math.round((x.fatti.length / x.argomenti.length) * 100), g = giorni(x.data);
        return `<section class="card"><div class="esame">${cerchio(p)}
          <div><h2>${esc(d ? d.nome : x.nome || x.slug)}</h2><div class="small">Appello il ${dataIt(x.data, { weekday: "long", day: "numeric", month: "long" })} · ${g >= 0 ? "tra " + g + " giorni" : "passato"} · obiettivo ${x.obiettivo}/30</div></div>
          <div class="azioni">${d ? `<a class="btn btn-s btn-sm" href="#/dispense/${esc(d.slug)}">Dispensa</a>` : ""}<button class="btn btn-s btn-sm" data-rimuovi="${esc(x.slug)}">Rimuovi</button></div></div>
          <div class="args">${x.argomenti.map((a, i) => `<button class="arg ${x.fatti.includes(i) ? "ok" : ""}" data-fatto="${esc(x.slug)}" data-i="${i}" aria-pressed="${x.fatti.includes(i)}">${esc(a)}</button>`).join("")}</div>
          <p class="small" style="margin-top:10px">Tocca un argomento quando l'hai ripassato.</p></section>`; }).join("")
        : `<div class="vuoto"><h3>Nessun esame ancora</h3><p>Aggiungi il prossimo esame con la data e gli argomenti: «Oggi» ti dirà ogni giorno da dove ripartire.</p><button class="btn btn-p" data-nuovo-esame>Aggiungi esame</button></div>`}
      <div class="grid g2">${rimando("D04", "Piano di studio guidato dalla data dell'appello")}${rimando("D08", "Gruppi di studio per esame")}</div>`;
  };

  function nuovoEsame() {
    const opz = attivo() ? DISP.filter((d) => !U().esami.some((e) => e.slug === d.slug)).map((d) => `<option value="${esc(d.slug)}">${esc(d.nome)} · ${d.anno} anno</option>`).join("") : "";
    modal(`<h2>Aggiungi un esame</h2><form id="frm-esame" style="display:grid;gap:14px">
      ${attivo() ? `<label class="fld">Esame<select name="slug" required>${opz}</select></label>` : `<label class="fld">Nome dell'esame<input name="nome" required placeholder="Es. Istituzioni di diritto privato"></label>`}
      <label class="fld">Data dell'appello<input type="date" name="data" required value="2026-12-15" min="2026-10-06"></label>
      <label class="fld">Voto obiettivo<select name="ob">${[30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18].map((v) => `<option ${v === 27 ? "selected" : ""}>${v}</option>`).join("")}</select></label>
      <label class="fld">Argomenti (uno per riga)<textarea name="arg" rows="4" placeholder="Capitolo 1&#10;Capitolo 2"></textarea></label>
      <div style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="btn btn-s" data-chiudi>Annulla</button><button class="btn btn-p" type="submit">Aggiungi</button></div></form>`);
  }

  // P03 · Dispense (catalogo + libreria) e P03a · scheda dispensa
  const F = { q: "", anno: "", area: "" };
  const cardDisp = (d) => `<a class="cdisp" href="#/dispense/${esc(d.slug)}"><div class="cop"><img src="${cop(d)}" alt="" loading="lazy"><span class="badge n plain">${esc(d.anno)} anno</span>
      <button class="save ${U().salvate.includes(d.slug) ? "on" : ""}" data-salva="${esc(d.slug)}" aria-label="Salva">${ico("salva")}</button></div>
      <h3>${esc(d.nome)}</h3><div class="meta">${esc(d.sem)} semestre · ${esc(d.tipi.join(" · "))}</div></a>`;
  VISTE.dispense = (r) => {
    if (!attivo()) return `${testa(HUB().nome + " · in arrivo", "Le tue *dispense*", "")}
      <div class="vuoto"><h3>Le dispense di ${esc(HUB().nome)} non ci sono ancora</h3><p>Stiamo cercando gli studenti che le costruiscono con noi. Iscriviti alla lista d'attesa e ti avvisiamo appena escono le prime.</p><a class="btn btn-p" href="#/oggi">Vai alla lista d'attesa</a></div>
      ${rimando(HUB().decidere, "Come sarebbero le dispense dell'hub attivo")}`;
    if (r[1]) return schedaDispensa(disp(r[1]));
    const sal = U().salvate.map(disp).filter(Boolean);
    const aree = [...new Set(DISP.map((d) => d.area))].sort();
    return `${testa("Studio", "Le tue *dispense*", "Appunti, mappe e quiz per gli esami di Economia UniFi, fatti da studenti.")}
      <section><div class="card-h"><h2>Salvate</h2><span class="small">${sal.length}</span></div>
        ${sal.length ? `<div class="grid g4">${sal.map(cardDisp).join("")}</div>` : `<div class="vuoto"><p>Tocca il segnalibro su una dispensa per ritrovarla qui.</p></div>`}</section>
      <section><div class="card-h"><h2>Catalogo · ${DISP.length} esami</h2></div>
        <div class="filtri" style="margin-bottom:18px"><label class="cerca">${ico("libro")}<input id="q" type="search" placeholder="Cerca il tuo esame" value="${esc(F.q)}" aria-label="Cerca"></label>
          ${["", "I", "II", "III"].map((a) => `<button class="chip ${F.anno === a ? "on" : ""}" data-anno="${a}">${a ? a + " anno" : "Tutti gli anni"}</button>`).join("")}
          <select class="chip" id="area" aria-label="Area"><option value="">Tutte le aree</option>${aree.map((a) => `<option ${F.area === a ? "selected" : ""}>${esc(a)}</option>`).join("")}</select></div>
        <div class="grid g4" id="catalogo"></div></section>`;
  };
  function catalogo() {
    const box = $("#catalogo"); if (!box) return;
    const q = F.q.trim().toLowerCase();
    const l = DISP.filter((d) => (!F.anno || d.anno === F.anno) && (!F.area || d.area === F.area) && (!q || (d.nome + " " + d.codice).toLowerCase().includes(q)));
    box.innerHTML = l.length ? l.map(cardDisp).join("") : `<div class="vuoto" style="grid-column:1/-1"><p>Nessuna dispensa trovata. Manca il tuo esame? Scrivici nel gruppo.</p></div>`;
  }
  function schedaDispensa(d) {
    if (!d) return `<div class="vuoto"><h3>Dispensa non trovata</h3><a class="btn btn-s" href="#/dispense">Torna al catalogo</a></div>`;
    const inEsami = U().esami.some((e) => e.slug === d.slug), sv = U().salvate.includes(d.slug);
    return `<a class="link" href="#/dispense">← Catalogo</a>
      <div class="grid g-main" style="align-items:start">
        <section class="card scheda">
          <div class="cdisp"><div class="cop"><img src="${cop(d)}" alt=""></div></div>
          <div><div class="eyebrow">${esc(d.area)}</div><h1>${esc(d.nome)}</h1>
            ${[["Codice", d.codice], ["Anno", d.anno + " anno"], ["Semestre", d.sem], ["Esame", d.mod], ["Contiene", d.tipi.join(" · ")]].map((r) => `<div class="row"><span class="grow small">${r[0]}</span><span>${esc(r[1])}</span></div>`).join("")}</div></section>
        <section class="card" style="display:grid;gap:12px"><h2>Cosa vuoi fare?</h2>
          <a class="btn btn-p" href="${SITO}/dispense/${encodeURIComponent(d.slug)}" target="_blank" rel="noopener">Apri la scheda sul sito ${ico("link")}</a>
          <button class="btn btn-s" data-salva="${esc(d.slug)}">${sv ? "Salvata ✓" : "Salva nella libreria"}</button>
          ${inEsami ? `<a class="btn btn-s" href="#/esami">È nei tuoi esami →</a>` : `<button class="btn btn-s" data-aggiungi="${esc(d.slug)}">Aggiungi ai miei esami</button>`}
          <p class="small">Oggi le dispense si aprono sul sito. Il lettore dentro la app è da decidere.</p></section></div>
      <div class="grid g2">${rimando("D06", "Lettore protetto dentro la app")}${rimando("D05", "Pacchetti e prezzi")}</div>`;
  }

  // P04 · Strumenti (+ P04a calcolatore voto di laurea, regole di UniLinkVotoLaurea.v5)
  VISTE.strumenti = (r) => {
    if (r[1] === "voto" && attivo()) return calcolatore();
    const l = window.UL_STRUMENTI.filter(perHub);
    return `${testa("Scegliere", "I tuoi *strumenti*", attivo() ? "Calcolatori e guide per Erasmus, laurea e magistrali." : "Per " + esc(HUB().nome) + " oggi ci sono gli strumenti validi per tutti.")}
      <section class="card">${l.map(rigaTool).join("")}</section>
      <div class="grid g2">${rimando("D09", "Career: confronto del CV")}${rimando("D11", "Guida tesi")}</div>`;
  };
  function calcolatore() {
    const st = S.calc || (S.calc = { media: U().media, lodi: U().lodi, tesi: 2, corso: 2 });
    return `<a class="link" href="#/strumenti">← Strumenti</a>
      ${testa("Strumenti · Economia", "Il tuo voto di *laurea*", "Stima indicativa con le regole della Scuola di Economia: decide sempre la commissione.")}
      <section class="card calc" id="calc">
        <div style="display:grid;gap:22px">
          <label>Media ponderata: <b id="c-media" style="font-weight:400">${num(st.media)}</b><input type="range" min="18" max="30" step="0.1" value="${st.media}" data-c="media"></label>
          <label>Lodi: <b id="c-lodi" style="font-weight:400">${st.lodi}</b><input type="range" min="0" max="10" step="1" value="${st.lodi}" data-c="lodi"></label>
          <div class="fld">Punti tesi<div class="seg">${[0, 1, 2, 3].map((v) => `<button type="button" class="${st.tesi === v ? "on" : ""}" data-c="tesi" data-v="${v}">+${v}</button>`).join("")}</div></div>
          <div class="fld">Laurea in corso<div class="seg">${[["Sì · +2", 2], ["No", 0]].map((o) => `<button type="button" class="${st.corso === o[1] ? "on" : ""}" data-c="corso" data-v="${o[1]}">${o[0]}</button>`).join("")}</div></div>
        </div>
        <div class="ris"><span class="small" style="color:rgba(244,241,234,.8)">Voto di presentazione <b id="c-pres" style="font-weight:400"></b></span><span class="v" id="c-fin"></span><span id="c-nota" class="small" style="color:rgba(244,241,234,.8)"></span></div>
      </section>`;
  }
  function aggiornaCalc() {
    const st = S.calc; if (!$("#calc")) return;
    const pres = (st.media * 11) / 3 + st.lodi * 0.333, fin = Math.min(110, pres + st.tesi + st.corso);
    const lode = Math.round(fin) >= 110 && pres >= 104.5 && st.tesi === 3;
    $("#c-media").textContent = num(st.media); $("#c-lodi").textContent = st.lodi; $("#c-pres").textContent = num(pres);
    $("#c-fin").textContent = Math.round(fin) + (lode ? " e lode" : "");
    $("#c-nota").textContent = lode ? "Hai i requisiti per la lode." : Math.round(fin) >= 110 ? "110: per la lode servono presentazione ≥ 104,5 e tesi +3." : "Stima indicativa: decide la commissione.";
  }

  // P05 · Profilo
  VISTE.profilo = () => `${testa("Account", "Il tuo *profilo*", "I dati servono a mostrarti le cose giuste. Non vendiamo e non mostriamo a nessuno cosa scarichi.")}
    <div class="grid g2">
      <section class="card"><form id="frm-profilo" style="display:grid;gap:14px"><h2>I tuoi dati</h2>
        <div class="grid g2" style="gap:12px"><label class="fld">Nome<input name="nome" value="${esc(U().nome)}"></label><label class="fld">Cognome<input name="cognome" value="${esc(U().cognome)}"></label></div>
        <label class="fld">Email<input value="${esc(U().email)}" disabled></label>
        <label class="fld">Hub<select name="hub">${window.UL_HUB.map((h) => `<option value="${h.slug}" ${h.slug === U().hub ? "selected" : ""}>${esc(h.nome)}${h.stato === "attivo" ? "" : " (in arrivo)"}</option>`).join("")}</select></label>
        <div class="grid g2" style="gap:12px"><label class="fld">Corso<input name="corso" value="${esc(U().corso)}"></label><label class="fld">Anno<select name="anno">${["I", "II", "III", "Fuori corso"].map((a) => `<option ${a === U().anno ? "selected" : ""}>${a}</option>`).join("")}</select></label></div>
        <label class="fld">Media (per il calcolatore)<input name="media" type="number" step="0.01" min="18" max="30" value="${U().media}"></label>
        <button class="btn btn-p" type="submit">Salva</button></form></section>
      <div class="grid" style="align-content:start">
        <section class="card" style="display:grid;gap:12px"><h2>Privacy e avvisi</h2>
          <label class="chk"><input type="checkbox" checked> Email quando esce o si aggiorna una dispensa che hai salvato</label>
          <label class="chk"><input type="checkbox"> Email con novità di UniLink (al massimo una al mese)</label>
          <p class="small">Puoi scaricare o cancellare i tuoi dati quando vuoi.</p></section>
        <section class="card" style="display:grid;gap:12px"><h2>Account</h2>
          <a class="btn btn-s" href="#/accedi" data-esci>Esci</a>
          <button class="btn btn-s" data-reset>Ripristina i dati di esempio</button></section>
        ${rimando("D05", "Acquisti e pacchetti")}
      </div></div>`;

  /* ---------------- 5 · DA DECIDERE ---------------- */
  const punti = (n) => `<span class="punti">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
  VISTE.decidere = (r) => {
    if (r[1]) return dettaglioDecidere(window.UL_DA_DECIDERE.find((x) => x.id === r[1]));
    const L = window.UL_DA_DECIDERE, gruppi = [...new Set(L.map((x) => x.gruppo))];
    return `${testa("Sezione di lavoro del team", "Da *decidere*", "Le sezioni della sidebar sono quelle decise e si vedono come saranno. Qui ogni card è una proposta con la sua architettura demo: si apre, si discute in call, si decide.")}
      <div class="dec-banner">${ico("cantiere")}<span><b>Regola.</b> Una card esce da qui solo quando è decisa: allora diventa una voce (o una parte di una voce) del «Tuo spazio», togliendo qualcos'altro se le voci sono già 6. Ogni card ha un codice (D01, D02…) che non cambia: usalo per chiedere modifiche.</span></div>
      ${gruppi.map((g) => { const its = L.filter((x) => x.gruppo === g); return `<div class="dec-gruppo"><h2>${esc(g)}</h2><span class="n">${its.length}</span></div>
        <div class="grid g3">${its.map((x) => `<a class="dcard" href="#/decidere/${x.id}"><span class="id">${x.id} · ${esc(x.origine.split("·")[0].trim())}</span><h3>${esc(x.titolo)}</h3><p>${esc(x.problema)}</p>
          <div class="piede"><span class="badge">${esc(x.stato)}</span><span title="Impatto e sforzo dall'HQ">Impatto ${punti(x.impatto)}</span></div></a>`).join("")}</div>`; }).join("")}`;
  };

  // I blocchi della mini demo: aggiungere un tipo = una riga qui + documentarlo nel PDF (cap. Blocchi)
  const BLOCCHI = {
    hero: (b) => `<div><div class="eyebrow">${esc(b.eyebrow || "")}</div><h1 style="font-size:32px">${acc(b.titolo)}</h1>${b.testo ? `<p class="small" style="margin-top:6px">${esc(b.testo)}</p>` : ""}</div>`,
    navy: (b) => `<div class="passo"><span class="badge plain">${esc(b.badge)}</span><h2>${esc(b.titolo)}</h2><p>${esc(b.testo)}</p><div class="cta">${(b.cta || []).map((c, i) => `<span class="btn ${i ? "btn-o" : "btn-c"}">${esc(c)}</span>`).join("")}</div></div>`,
    stats: (b) => `<div class="grid g3">${b.items.map((s) => `<div class="card stat"><span class="v">${esc(s[0])}</span><span class="l">${esc(s[1])}</span></div>`).join("")}</div>`,
    cards: (b) => `<div>${b.titolo ? `<h3 style="margin-bottom:10px">${esc(b.titolo)}</h3>` : ""}<div class="grid g3">${b.items.map((c) => `<div class="card"><h3>${esc(c[0])}</h3><p class="small">${esc(c[1])}</p></div>`).join("")}</div></div>`,
    list: (b) => `<div class="card">${b.titolo ? `<h3 style="margin-bottom:6px">${esc(b.titolo)}</h3>` : ""}${b.items.map((r) => `<div class="row"><div class="grow"><div class="t">${esc(r[0])}</div><div class="small">${esc(r[1])}</div></div><span class="badge n plain">${esc(r[2])}</span></div>`).join("")}</div>`,
    steps: (b) => `<div class="card">${b.titolo ? `<h3 style="margin-bottom:6px">${esc(b.titolo)}</h3>` : ""}${b.items.map((r) => `<div class="row"><span class="ini">${esc(r[0])}</span><div class="grow t">${esc(r[1])}</div></div>`).join("")}</div>`,
    form: (b) => `<div class="card" style="display:grid;gap:12px"><h3>${esc(b.titolo)}</h3>${b.campi.map((c) => `<label class="fld">${esc(c)}<input disabled placeholder="…"></label>`).join("")}<span class="btn btn-p" style="justify-self:start">${esc(b.cta)}</span></div>`,
    progress: (b) => `<div class="card">${b.titolo ? `<h3 style="margin-bottom:10px">${esc(b.titolo)}</h3>` : ""}${b.items.map((p) => `<div style="margin:10px 0"><div style="display:flex;justify-content:space-between" class="small"><span>${esc(p[0])}</span><span>${p[1]}%</span></div><div class="bar"><i style="width:${p[1]}%"></i></div></div>`).join("")}</div>`,
    quiz: (b) => `<div class="card quiz" data-quiz="${b.giusta}"><h3>${esc(b.domanda)}</h3>${b.opzioni.map((o, i) => `<button data-q="${i}">${esc(o)}</button>`).join("")}</div>`,
    prezzi: (b) => `<div class="grid g3">${b.items.map((p) => `<div class="prezzo ${p.evidenza ? "ev" : ""}"><h3>${esc(p.nome)}</h3><span class="p">DA DECIDERE</span>${p.include.map((i) => `<span class="small">✓ ${esc(i)}</span>`).join("")}<span class="badge n plain" style="justify-self:start">Nascosta</span></div>`).join("")}</div>`,
    chips: (b) => `<div class="filtri">${b.items.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>`,
    nota: (b) => `<div class="dec-banner">${ico("cantiere")}<span>${esc(b.testo)}</span></div>`,
  };
  function dettaglioDecidere(x) {
    if (!x) return `<div class="vuoto"><h3>Card non trovata</h3><a class="btn btn-s" href="#/decidere">Torna a Da decidere</a></div>`;
    const sez = (k, html) => `<div class="dsez"><div class="k">${k}</div><div>${html}</div></div>`;
    const lista = (l) => `<ul>${l.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
    return `<a class="link" href="#/decidere">← Tutte le card da decidere</a>
      ${testa(x.id + " · " + x.gruppo, x.titolo, "", `<span class="badge">${esc(x.stato)}</span>`)}
      <div class="dec-banner">${ico("cantiere")}<span><b>Architettura demo, non decisa.</b> Serve a vedere come risulterebbe. Impatto ${punti(x.impatto)} · Sforzo ${punti(x.sforzo)} (valori dall'HQ).</span></div>
      <section class="card">
        ${sez("Il problema", `<p>${esc(x.problema)}</p>`)}
        ${sez("La proposta", `<p>${esc(x.proposta)}</p>`)}
        ${sez("Dove vivrebbe", `<p>${esc(x.dove)}</p>`)}
        ${sez("Come risulterebbe", `<div class="schermo">${x.schermata.map((b) => (BLOCCHI[b.t] ? BLOCCHI[b.t](b) : "")).join("")}</div>`)}
        ${sez("Cosa serve", lista(x.serve))}
        ${sez("Da decidere", lista(x.domande))}
        ${sez("Origine", `<p>${esc(x.origine)}</p>`)}
        ${sez("Storico richieste", `<div class="storico">${x.storico.map((s) => `<div><span class="small">${dataIt(s[0], { day: "numeric", month: "short", year: "numeric" })}</span><span>${esc(s[1])}</span></div>`).join("")}</div>`)}
      </section>`;
  }

  /* ---------------- 6 · avvio, rotte ed eventi ---------------- */
  function rotta() { return (location.hash.replace(/^#\/?/, "") || "oggi").split("/").filter(Boolean); }
  function disegna() {
    let r = rotta();
    if (!S.dentro && r[0] !== "accedi") r = ["accedi"];
    if (!VISTE[r[0]]) r = ["oggi"];
    document.body.classList.remove("menu");
    const solo = r[0] === "accedi";
    $("#app").hidden = solo; $("#fuori").hidden = !solo; $("#tabbar").hidden = solo;
    if (solo) { $("#fuori").innerHTML = VISTE.accedi(); return; }
    guscio(r);
    $("#page").innerHTML = VISTE[r[0]](r);
    document.title = "UniLink · " + ($(".ph h1") ? $(".ph h1").textContent : "Il tuo spazio");
    catalogo(); aggiornaCalc();
    window.scrollTo(0, 0);
  }
  const ridisegna = () => { const y = window.scrollY; disegna(); window.scrollTo(0, y); };

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-menu],[data-fatto],[data-salva],[data-nuovo-esame],[data-rimuovi],[data-aggiungi],[data-anno],[data-c],[data-q],[data-chiudi],[data-entra],[data-esci],[data-reset],[data-esci-attesa]");
    if (!t) { if (e.target.id === "modal") chiudi(); return; }
    const ds = t.dataset;
    if ("menu" in ds) { document.body.classList.toggle("menu"); return; }
    if ("salva" in ds) { e.preventDefault(); e.stopPropagation(); const l = U().salvate, i = l.indexOf(ds.salva); i >= 0 ? l.splice(i, 1) : l.push(ds.salva); salva(); toast(i >= 0 ? "Tolta dalla libreria" : "Salvata nella libreria"); ridisegna(); return; }
    if ("fatto" in ds) { const x = U().esami.find((y) => y.slug === ds.fatto), i = +ds.i, k = x.fatti.indexOf(i); k >= 0 ? x.fatti.splice(k, 1) : x.fatti.push(i); salva(); if (k < 0) toast("Ripassato: " + x.argomenti[i]); ridisegna(); return; }
    if ("nuovoEsame" in ds) { nuovoEsame(); return; }
    if ("aggiungi" in ds) { nuovoEsame(); const s = $("#frm-esame select[name=slug]"); s && (s.value = ds.aggiungi); return; }
    if ("rimuovi" in ds) { U().esami = U().esami.filter((x) => x.slug !== ds.rimuovi); salva(); toast("Esame rimosso"); ridisegna(); return; }
    if ("anno" in ds) { F.anno = ds.anno; $$("[data-anno]").forEach((b) => b.classList.toggle("on", b.dataset.anno === F.anno)); catalogo(); return; }
    if ("c" in ds && ds.v != null) { S.calc[ds.c] = +ds.v; $$(`[data-c="${ds.c}"][data-v]`).forEach((b) => b.classList.toggle("on", b === t)); salva(); aggiornaCalc(); return; }
    if ("q" in ds) { const box = t.closest("[data-quiz]"), g = +box.dataset.quiz; $$("button", box).forEach((b) => b.classList.remove("giusta", "sbagliata")); t.classList.add(+ds.q === g ? "giusta" : "sbagliata"); if (+ds.q !== g) $$("button", box)[g].classList.add("giusta"); return; }
    if ("chiudi" in ds) { chiudi(); return; }
    if ("entra" in ds) { S.dentro = true; salva(); location.hash = "#/oggi"; return; }
    if ("esci" in ds) { S.dentro = false; salva(); return; }
    if ("reset" in ds) { try { localStorage.removeItem(KEY); } catch (er) {} location.hash = "#/oggi"; location.reload(); return; }
    if ("esciAttesa" in ds) { delete S.attesa[U().hub]; salva(); ridisegna(); return; }
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "q") { F.q = e.target.value; catalogo(); }
    if (e.target.dataset.c && e.target.type === "range") { S.calc[e.target.dataset.c] = +e.target.value; salva(); aggiornaCalc(); }
  });
  document.addEventListener("change", (e) => {
    if (e.target.id === "hubsel") { U().hub = e.target.value; salva(); toast("Anteprima: hub " + HUB().nome); location.hash = "#/oggi"; disegna(); }
    if (e.target.id === "area") { F.area = e.target.value; catalogo(); }
  });
  document.addEventListener("submit", (e) => {
    e.preventDefault(); const f = e.target, v = Object.fromEntries(new FormData(f));
    if (f.id === "frm-accedi") { toast("Demo: nessuna email inviata. Entri con l'account demo."); S.dentro = true; salva(); location.hash = "#/oggi"; }
    if (f.id === "frm-attesa") { S.attesa[U().hub] = v.r; salva(); toast("Fatto: ti avvisiamo quando parte"); ridisegna(); }
    if (f.id === "frm-esame") {
      const args = (v.arg || "").split("\n").map((s) => s.trim()).filter(Boolean);
      const slug = v.slug || "x-" + Date.now().toString(36);
      U().esami.push({ slug, nome: v.nome, data: v.data, obiettivo: +v.ob, argomenti: args.length ? args : ["Ripasso generale"], fatti: [] });
      salva(); chiudi(); toast("Esame aggiunto"); location.hash = "#/esami"; ridisegna();
    }
    if (f.id === "frm-profilo") { Object.assign(U(), { nome: v.nome, cognome: v.cognome, hub: v.hub, corso: v.corso, anno: v.anno, media: +v.media || U().media }); S.calc = null; salva(); toast("Profilo salvato"); ridisegna(); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { chiudi(); document.body.classList.remove("menu"); } });
  window.addEventListener("hashchange", disegna);
  disegna();
})();
