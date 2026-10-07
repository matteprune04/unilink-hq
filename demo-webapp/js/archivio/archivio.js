/* js/archivio/archivio.js — ARCHIVIO della web app (solo founder: gruppo arancione «Da decidere» → Archivio, rotta #/app/archivio).
   Qui finisce quello che i founder hanno deciso di togliere: non si cancella, si sposta. Ogni voce dice cosa era, perché è
   stata tolta (con la fonte), dove sta il codice e come si rimette. Le sezioni con una vista si aprono ancora, con un banner.
   Aggiungere una voce: una riga in UL.ARCHIVIO; se ha una vista, il suo file va in js/archivio/ e in index.html. */
(function () {
  const UL = window.UL, B = UL.B;
  const { icon, esc } = UL.ui;
  const MEET = "Meeting dei founder del 7/10/2026 (HQ → Decisioni «MEETING 7/10»)";
  UL.ARCHIVIO = [
    { id: "guida", titolo: "Guida per facoltà", icona: "map", quando: "2026-10-07", fonte: MEET, perche: "«Sezioni mentor/ambassador e guida da togliere» dal sito: tolta anche qui per coerenza con la landing.",
      file: "js/archivio/tesi-cv-guida.js · js/guida-dati.js", rimettere: "Voce «guida» in boot.js (UL.NAV.decise, gruppo Studio) e rotta guida → guidaU.",
      vista: (u, p) => UL.views.guidaU.render(u, p), mount: (r, u, p) => UL.views.guidaU.mount && UL.views.guidaU.mount(r, u, p) },
    { id: "tesi", titolo: "Tesi, tappa per tappa", icona: "file", quando: "2026-10-07", fonte: MEET, perche: "«Tool tesi» tra le idee in stand-by.",
      file: "js/archivio/tesi-cv-guida.js (U.tesiTab)", rimettere: "Tab [\"tesi\", \"Tesi\", \"file\"] in views/percorso.js → TABS.",
      vista: (u) => UL.U.tesiTab(u), mount: (r, u) => UL.U.bindPercorsoV4(r, u) },
    { id: "cv", titolo: "CV benchmark (5 regole gratis, 17 con Plus)", icona: "brief", quando: "2026-10-07", fonte: MEET, perche: "«Curriculum» tra le idee in stand-by. Tolto anche da Plus.",
      file: "js/archivio/tesi-cv-guida.js (U.cvTab)", rimettere: "Tab [\"cv\", \"CV\", \"brief\"] in views/percorso.js → TABS e la riga del CV in config.js → UL.PIANI.dentro.",
      vista: (u) => UL.U.cvTab(u), mount: (r, u) => UL.U.bindPercorsoV4(r, u) },
    { id: "mentor", titolo: "Mentor e ambassador (tutoring 1-1, vecchio programma, inviti)", icona: "users", quando: "2026-10-07", fonte: MEET, perche: "«Tutoraggio a pagamento per ora messo da parte»; ambassador solo a commissione (20%): sostituita dalla sezione «Ambassador».",
      file: "js/archivio/mentor.js (UL.views.mentoringArch)", rimettere: "Voce «mentoring» in boot.js (gruppo Community) con view mentoringArch.",
      vista: (u, p) => UL.views.mentoringArch.render(u, p), mount: (r, u, p) => UL.views.mentoringArch.mount(r, u, p) },
    { id: "appunti", titolo: "Appunti singoli (4,99 € · in sessione 9,99 €) e «1 Appunti gratis tra 3 esami»", icona: "book", quando: "2026-10-07", fonte: MEET, perche: "«Niente appunti singoli»: al loro posto la Simulazione d'esame (4,99 € invece di 9,99 €). Il regalo dell'account diventa Economia Aziendale completa gratis per tutti.",
      file: "config.js → UL.PIANI (versione v6 nel tag webapp-v6 del repository)", rimettere: "Ripristinare UL.PIANI.prezzi.appunti e il livello «appunti» in core.js (B.level)." },
    { id: "anno", titolo: "Pacchetto anno (49,99 €)", icona: "layers", quando: "2026-10-07", fonte: MEET, perche: "«Togliendo il pacchetto annuo»: resta solo il pacchetto semestre, a 29,99 € (3 esami) o 34,99 € (4 esami) per percorso.",
      file: "config.js → UL.PIANI (v6)", rimettere: "B.annoItem in views/scheda.js e la colonna «anno» in UL.PIANI.lista / dentro." },
    { id: "sessione", titolo: "Prezzi «fuori sessione / in sessione»", icona: "calendar", quando: "2026-10-07", fonte: MEET, perche: "«Prezzi comunicati come sconto di lancio, senza dicitura fuori sessione».",
      file: "config.js → UL.PIANI.sessione (v6) · core.js B.inSessione (v6)", rimettere: "Rimettere i mesi di sessione e B.fascia in core.js." },
    { id: "download", titolo: "PDF da scaricare con filigrana", icona: "download", quando: "2026-10-07", fonte: MEET, perche: "«Materiali non scaricabili: consultabili e annotabili solo nell'area personale»: c'è il lettore con le note (views/lettore.js).",
      file: "views/area.js (v6: «Apri dispensa»)", rimettere: "Non previsto." },
  ];

  UL.views.archivioU = {
    title: "Archivio",
    render(u, params) {
      const x = UL.ARCHIVIO.find((a) => a.id === params[0]);
      if (x && x.vista) return `<div class="banner dd-banner">${icon("alert")}<span><b>Archiviata il ${new Date(x.quando).toLocaleDateString("it-IT")}.</b> ${esc(x.perche)} Non è nella sidebar degli studenti: la vedi solo da qui.</span><a class="btn btn-sm btn-ghost" href="#/app/archivio">← Archivio</a></div>
        <div style="margin-top:16px">${x.vista(u, params.slice(1))}</div>`;
      return `<div class="page-head"><div><div class="eyebrow">${icon("alert")} Solo founder · sezione di lavoro</div><h1>Archivio</h1>
          <p class="lead">Le parti tolte dalla web app dopo le decisioni dei founder. Non sono cancellate: qui c'è cosa erano, perché sono state tolte e come si rimettono.</p></div>
          <a class="btn btn-ghost btn-sm" href="../demo-landing/archivio/">Archivio della landing ↗</a></div>
        <div class="grid g-ov">${UL.ARCHIVIO.map((a) => `<section class="card c-6"><div class="card-head"><h3>${icon(a.icona)} ${esc(a.titolo)}</h3><span class="badge badge-soft">${new Date(a.quando).toLocaleDateString("it-IT")}</span></div>
          <p class="small"><b>Perché:</b> ${esc(a.perche)}</p><p class="tiny muted" style="margin-top:6px">Fonte: ${esc(a.fonte)}</p>
          <p class="tiny muted" style="margin-top:6px"><b>Codice:</b> ${esc(a.file)} · <b>Per rimetterla:</b> ${esc(a.rimettere)}</p>
          ${a.vista ? `<a class="btn btn-sm btn-primary" style="margin-top:12px" href="#/app/archivio/${a.id}">Apri la sezione archiviata</a>` : ""}</section>`).join("")}</div>`;
    },
    mount(root, u, params) { const x = UL.ARCHIVIO.find((a) => a.id === params[0]); if (x && x.mount) x.mount(root, u, params.slice(1)); },
  };
  // v8: Aula studio (D45) e Ambassador (D46) sono proposte: si aprono dalle card, con il banner
  const prop = (id, vista) => ({ get title() { return UL.views[vista].title; },
    render: (u, p) => `<div class="banner dd-banner">${icon("alert")}<span><b>Proposta ${id}</b> — tolta dalla sidebar l'8/10 (commenti del team), si vede solo da Da decidere.</span><a class="btn btn-sm btn-orange" href="#/app/decidere/${id}">La proposta</a></div><div style="margin-top:16px">${UL.views[vista].render(u, p)}</div>`,
    mount: (r, u, p) => UL.views[vista].mount && UL.views[vista].mount(r, u, p) });
  UL.views.aulaProp = prop("D45", "aulaU");
  UL.views.ambassadorProp = prop("D46", "ambassadorU");
  UL.views.percorsoProp = prop("D50", "percorsoB");
  // i link interni della Guida archiviata (#/app/guida/…) restano validi, ma si aprono con il banner dell'archivio
  UL.views.guidaArch = { title: "Archivio · Guida", render: (u, p) => UL.views.archivioU.render(u, ["guida"].concat(p)), mount: (r, u, p) => UL.views.archivioU.mount(r, u, ["guida"].concat(p)) };
})();
