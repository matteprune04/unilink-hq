/* ../../02_AreaPersonale/assets/js/ui.js */
/* ============================================================
   UI helpers: icone, escape, toast, modali, componenti condivisi
   ============================================================ */
(function () {
  const UL = (window.UL = window.UL || {});

  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6.5A2.5 2.5 0 0 0 4 21.5"/><path d="M19 17v4H6.5"/><path d="M9 7h6"/>',
    cap: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/><path d="M22 9v6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    map: '<path d="m9 4-6 2.5v13L9 17l6 3 6-2.5v-13L15 7z"/><path d="M9 4v13M15 7v13"/>',
    quiz: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
    plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    calc: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v4M8 19h.01M12 19h.01"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    users: '<circle cx="9" cy="8" r="4"/><path d="M2 21c1-3.5 3.8-5.5 7-5.5s6 2 7 5.5"/><path d="M16 4a4 4 0 0 1 0 8M22 21c-.6-2.4-2-4-4-4.8"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="m5 12 5 5L20 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M17.9 17.9A10.4 10.4 0 0 1 12 19c-6.5 0-10-7-10-7a18.5 18.5 0 0 1 5.1-5.9M9.9 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a18.6 18.6 0 0 1-2.2 3.2M14.1 14.1a3 3 0 1 1-4.2-4.2M2 2l20 20"/>',
    ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15h3M7 10h7M7 5h11"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    euro: '<path d="M18 7a7 7 0 1 0 0 10"/><path d="M4 10h9M4 14h9"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    pin: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    lang: '<path d="M4 5h8M8 3v2M5 9c1.5 3 4 5 7 6M11 5c-1 4-3.5 7-7 9"/><path d="m13 21 4-9 4 9M14.5 18h5"/>',
    brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  };
  const icon = (name, cls) => `<svg class="i ${cls || ""}" viewBox="0 0 24 24" aria-hidden="true">${P[name] || ""}</svg>`;

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = (p) => ((p.nome || "?")[0] + (p.cognome || "")[0] || "").toUpperCase();
  const fullName = (p) => [p.nome, p.cognome].filter(Boolean).join(" ") || "Studente";

  function fmtDate(iso, withTime) {
    if (!iso) return "—";
    const d = new Date(iso);
    const opts = { day: "numeric", month: "short", year: "numeric" };
    if (withTime) Object.assign(opts, { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString("it-IT", opts);
  }
  function ago(iso) {
    if (!iso) return "mai";
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return "adesso";
    if (s < 3600) return Math.floor(s / 60) + " min fa";
    if (s < 86400) return Math.floor(s / 3600) + " ore fa";
    const d = Math.floor(s / 86400);
    return d === 1 ? "ieri" : d < 30 ? d + " giorni fa" : fmtDate(iso);
  }
  const num = (x, d = 1) => (x == null || isNaN(x) ? "—" : Number(x).toLocaleString("it-IT", { minimumFractionDigits: d, maximumFractionDigits: d }));

  /* ---------- toast ---------- */
  function toast(msg, kind) {
    let box = document.querySelector(".toasts");
    if (!box) { box = document.createElement("div"); box.className = "toasts"; document.body.appendChild(box); }
    const t = document.createElement("div");
    t.className = "toast " + (kind === "err" ? "err" : "ok");
    t.innerHTML = icon(kind === "err" ? "alert" : "check") + `<span>${esc(msg)}</span>`;
    box.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s"; }, 2600);
    setTimeout(() => t.remove(), 3000);
  }

  /* ---------- modale / drawer ---------- */
  function modal(html, opts) {
    opts = opts || {};
    const ov = document.createElement("div");
    ov.className = "overlay" + (opts.drawer ? " drawer" : "");
    ov.innerHTML = `<div class="modal" role="dialog" aria-modal="true" style="${opts.width ? "max-width:" + opts.width + "px" : ""}">${html}</div>`;
    const close = () => { ov.remove(); document.removeEventListener("keydown", onKey); opts.onClose && opts.onClose(); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    ov.addEventListener("click", (e) => { if (e.target === ov || e.target.closest("[data-close]")) close(); });
    document.addEventListener("keydown", onKey);
    document.body.appendChild(ov);
    const first = ov.querySelector("input, select, textarea, button:not([data-close])");
    first && first.focus();
    return { el: ov, close };
  }
  function confirmBox(title, text, okLabel, danger) {
    return new Promise((res) => {
      const m = modal(`
        <div class="modal-head"><h2>${esc(title)}</h2></div>
        <p class="muted">${text}</p>
        <div class="row" style="justify-content:flex-end;margin-top:22px">
          <button class="btn btn-ghost" data-close>Annulla</button>
          <button class="btn ${danger ? "btn-danger" : "btn-primary"}" data-ok>${esc(okLabel || "Conferma")}</button>
        </div>`, { width: 460, onClose: () => res(false) });
      m.el.querySelector("[data-ok]").addEventListener("click", () => { res(true); m.el.remove(); });
    });
  }

  /* ---------- esporta testo (CSV / JSON) ----------
     Nel visualizzatore di claude.ai i download avviati dalla pagina sono bloccati:
     mostriamo il contenuto con "Copia"; in locale c'è anche "Scarica file". */
  function offerText(title, filename, text, mime) {
    const canDownload = !window.claude;
    const m = modal(`
      <div class="modal-head"><div><h2>${esc(title)}</h2><p class="small muted" style="margin-top:4px">${esc(filename)}</p></div>
        <button class="icon-btn" data-close aria-label="Chiudi">${icon("x")}</button></div>
      <textarea class="textarea" id="export-text" readonly style="min-height:260px;font-family:ui-monospace,Consolas,monospace;font-size:12px">${esc(text)}</textarea>
      <div class="row" style="margin-top:14px">
        <button class="btn btn-primary" data-copy>${icon("file")} Copia</button>
        ${canDownload ? `<button class="btn btn-ghost" data-file>${icon("download")} Scarica file</button>` : ""}
        <span class="small muted" data-msg></span>
      </div>`, { width: 760 });
    const ta = m.el.querySelector("textarea");
    const msg = m.el.querySelector("[data-msg]");
    m.el.querySelector("[data-copy]").addEventListener("click", () => {
      const fallback = () => { ta.focus(); ta.select(); msg.textContent = "Testo selezionato: premi Ctrl+C per copiarlo."; };
      try {
        navigator.clipboard.writeText(text).then(() => (msg.textContent = "Copiato negli appunti."), fallback);
      } catch (e) { fallback(); }
    });
    const f = m.el.querySelector("[data-file]");
    f && f.addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: mime }));
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
  }

  /* ---------- costanti di dominio ---------- */
  const AREE_DISP = [
    { k: "marketing", l: "Marketing" }, { k: "diritto", l: "Diritto" }, { k: "finanza", l: "Finanza" },
    { k: "management", l: "Management" }, { k: "quant", l: "Matematica & Statistica" }, { k: "economia", l: "Economia" },
  ];
  const AREA_ICON = { marketing: "target", diritto: "shield", finanza: "euro", management: "brief", quant: "chart", economia: "globe" };
  const areaLabel = (k) => (AREE_DISP.find((a) => a.k === k) || {}).l || k;
  const ROMAN = { 1: "I", 2: "II", 3: "III" };
  const CDS = { EA: "Economia Aziendale", EC: "Economia e Commercio", ALTRO: "Altro corso" };
  const DOPO = {
    "magistrale-italia": "Magistrale in Italia", "msc-estero": "MSc all'estero", lavoro: "Lavorare subito",
    "master-1": "Master di I livello", indeciso: "Ancora indeciso/a",
  };
  const STATUS = [
    { k: "valutare", l: "Da valutare" }, { k: "preparazione", l: "In preparazione" }, { k: "inviata", l: "Candidatura inviata" },
    { k: "ammesso", l: "Ammesso/a" }, { k: "rifiutato", l: "Non ammesso/a" },
  ];

  /* ---------- card corso (stile card del sito) ---------- */
  function courseCard(c, user) {
    const fav = user.activity.favorites.includes(c.slug);
    const dl = user.activity.downloads.find((d) => d.slug === c.slug);
    const img = c.img ? `<img src="${esc(c.img)}?scale-down-to=512" alt="${esc(c.imgAlt || c.title)}" loading="lazy" onerror="this.remove()">` : "";
    return `
    <article class="course ${c.soon ? "soon" : ""}" data-slug="${esc(c.slug)}">
      <div class="thumb">
        <div class="ph area-${esc(c.area)}">${icon(AREA_ICON[c.area] || "book")}<span>${esc(areaLabel(c.area))}</span></div>${img}
        ${c.soon ? "" : `<button class="fav ${fav ? "on" : ""}" data-act="fav" title="${fav ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}" aria-label="Preferito">${icon("star")}</button>`}
        ${dl ? `<span class="badge badge-green done" title="Scaricata ${ago(dl.at)}">${icon("check")} Scaricata</span>` : ""}
        <span class="badge badge-orange">${ROMAN[c.anno]} anno</span>
      </div>
      <div class="body">
        <div class="row" style="gap:10px"><span class="sq-label">${esc(c.cds)}</span><span class="badge badge-soft">${esc(areaLabel(c.area))}</span></div>
        <h3>${esc(c.title)} ${c.code ? `<span class="code">(${esc(c.code)})</span>` : ""}</h3>
        <div class="meta">
          ${c.cfu ? `<span class="badge badge-soft">${c.cfu} CFU</span>` : ""}
          ${c.diffStars ? `<span class="badge badge-soft" title="Difficoltà dell'esame">Difficoltà <span class="stars">${"★".repeat(c.diffStars)}${"☆".repeat(5 - c.diffStars)}</span></span>` : ""}
          ${c.voto ? `<span class="badge badge-soft" title="Voto ottenuto dall'autore degli appunti">Voto appunti ${esc(c.voto.replace(/\s*\/\s*/g, "/"))}</span>` : ""}
        </div>
        <div class="foot">
          ${c.soon
            ? `<span class="badge badge-yellow">In arrivo</span>`
            : c.pdf
              ? `<a class="btn btn-primary btn-sm btn-arrow" href="${esc(c.pdf)}" target="_blank" rel="noopener" data-act="dl" data-kind="appunti">Scarica dispensa <span class="arr">${icon("download")}</span></a>`
              : `<span class="badge badge-yellow">Upload in corso</span>`}
          <div class="links">
            ${c.mappe ? `<a class="icon-btn" href="${esc(c.mappe)}" target="_blank" rel="noopener" data-act="dl" data-kind="mappe" title="Mappe & Schemi">${icon("map")}</a>` : ""}
            ${c.quiz ? `<a class="icon-btn" href="${esc(c.quiz)}" target="_blank" rel="noopener" data-act="dl" data-kind="quiz" title="Quiz & Simulazioni">${icon("quiz")}</a>` : ""}
            ${c.soon ? "" : `<button class="icon-btn" data-act="info" title="Informazioni utili">${icon("info")}</button>`}
          </div>
        </div>
        <div class="sem">${ROMAN[c.sem] || ""} semestre</div>
      </div>
    </article>`;
  }

  function courseInfo(c) {
    return modal(`
      <div class="modal-head">
        <div><span class="sq-label">${esc(c.cds)} · ${ROMAN[c.anno]} anno · ${ROMAN[c.sem]} semestre</span><h2 style="margin-top:8px">${esc(c.title)}</h2>
        <p class="muted small" style="margin-top:4px">${esc(c.code)} ${c.cfu ? "· " + c.cfu + " CFU" : ""}</p></div>
        <button class="icon-btn" data-close aria-label="Chiudi">${icon("x")}</button>
      </div>
      <div class="syllabus">${c.info || '<p class="muted">Informazioni utili non ancora disponibili per questo corso.</p>'}</div>
      <div class="row" style="margin-top:20px">
        ${c.pdf ? `<a class="btn btn-primary btn-arrow" href="${esc(c.pdf)}" target="_blank" rel="noopener" data-dl="${esc(c.slug)}">Scarica dispensa <span class="arr">${icon("download")}</span></a>` : ""}
        ${c.unifi ? `<a class="btn btn-ghost" href="${esc(c.unifi)}" target="_blank" rel="noopener">${icon("ext")} Scheda UniFi</a>` : ""}
      </div>`, { drawer: true });
  }

  /* ---------- anello punteggio ---------- */
  function ring(pct, size, stroke, color) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--beige)" stroke-width="${stroke}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color || "var(--orange)"}" stroke-width="${stroke}" stroke-linecap="round"
        stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.max(0, Math.min(100, pct)) / 100)}"/></svg>`;
  }

  const FIT = { reach: { l: "Ambizioso", c: "fit-reach" }, match: { l: "In linea", c: "fit-match" }, safe: { l: "Alla portata", c: "fit-safe" } };

  function progCard(r, user, compact) {
    const p = r.p;
    const inList = user.activity.shortlist.some((s) => s.pid === p.id);
    return `
    <article class="prog" data-pid="${p.id}">
      <div class="score" title="Compatibilità con il tuo profilo">${ring(r.score, 72, 7)}<b>${r.score}%</b></div>
      <div>
        <div class="row" style="gap:8px">
          <span class="badge tier-${p.tier}">${UL.reco.TIER[p.tier].label}</span>
          ${p.cems ? '<span class="badge badge-navy">CEMS</span>' : ""}
          <span class="badge ${FIT[r.fit].c}" title="Confronto tra la forza del tuo profilo e la selettività stimata">${FIT[r.fit].l}</span>
        </div>
        <div class="school" style="margin-top:10px">${esc(p.school)}</div>
        <h3>${esc(p.program)}</h3>
        <div class="facts">
          <span>${icon("pin")} ${esc(p.loc)}</span><span>${icon("clock")} ${esc(p.durata)}</span>
          <span>${icon("euro")} ${esc(p.retta)}</span><span>${icon("lang")} ${esc(p.lingua)}</span>
        </div>
        <div class="row" style="gap:6px">${p.aree.map((a) => `<span class="badge badge-soft">${esc(a)}</span>`).join("")}</div>
        ${compact ? "" : `
        <div class="why">
          <div><span class="label">Perché te lo consigliamo</span><ul>${(r.why.length ? r.why : ["Compatibile con il tuo profilo generale"]).map((w) => `<li class="ok">${icon("check")}<span>${esc(w)}</span></li>`).join("")}</ul></div>
          <div><span class="label">Cosa ti serve</span><ul>${(r.todo.length ? r.todo : ["Nessun punto critico evidente"]).map((w) => `<li class="todo">${icon("arrow")}<span>${esc(w)}</span></li>`).join("")}</ul></div>
        </div>
        <div class="test" style="margin-top:12px"><b>TEST / PROFILO</b>${esc(p.test)}</div>`}
      </div>
      <div class="acts">
        <button class="btn btn-sm ${inList ? "btn-orange" : "btn-primary"}" data-act="short">${icon(inList ? "check" : "bookmark")} ${inList ? "In shortlist" : "Salva"}</button>
        <a class="btn btn-sm btn-ghost" href="${esc(p.url)}" target="_blank" rel="noopener">${icon("ext")} Dettagli</a>
      </div>
    </article>`;
  }

  UL.ui = {
    icon, esc, initials, fullName, fmtDate, ago, num, toast, modal, confirmBox, ring, offerText,
    courseCard, courseInfo, progCard, AREE_DISP, areaLabel, ROMAN, CDS, DOPO, STATUS, FIT,
  };
})();

