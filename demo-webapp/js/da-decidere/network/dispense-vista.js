/* network · dispense-vista.js
   Modulo Network · VISTA dispenseD (rotta dispense): dispense per ateneo/corso/anno, caricamento → revisione → crediti.
   Architettura: network/core.js. */
/* Variante D — dispense multi-ateneo (ufficiali UniLink per UniFi, community per gli altri) + caricamento con revisione */
(function () {
  const UL = window.UL;
  const D = UL.D;
  const DATA = window.UL_D;
  const { icon, esc, ago } = UL.ui;
  const F = { cds: "", anno: "0", q: "" };

  function card(u, d) {
    const fav = u.activity.favorites.includes(d.id);
    return `<article class="job" data-d="${esc(d.id)}">
      <span class="logo-sq" style="background:${D.uni(d.uni).color}">${icon(d.official ? "shield" : "book")}</span>
      <div><div class="row" style="gap:8px">${d.official ? '<span class="badge badge-navy">Ufficiale UniLink</span>' : '<span class="badge badge-soft">Community</span>'}<span class="badge badge-soft">${esc(d.cds)}</span><span class="badge badge-soft">${d.anno}° anno</span></div>
        <h3>${esc(d.title)} ${d.code ? `<span class="muted" style="font-size:14px">(${esc(d.code)})</span>` : ""}</h3>
        <div class="facts"><span>${icon("user")} ${esc(d.author)}</span>${d.rating ? `<span class="rate" style="color:var(--orange)">★ ${d.rating.toFixed(1)}</span>` : ""}${d.dl != null ? `<span>${icon("download")} ${d.dl}</span>` : ""}${d.pages ? `<span>${icon("file")} ${d.pages} pagine</span>` : ""}</div></div>
      <div class="row">${d.pdf ? `<a class="btn btn-primary btn-sm" href="${esc(d.pdf)}" target="_blank" rel="noopener" data-dl>${icon("download")} Scarica</a>` : `<button class="btn btn-primary btn-sm" data-dl>${icon("download")} Scarica</button>`}
        <button class="icon-btn ${fav ? "on" : ""}" data-fav title="Preferito">${icon("star")}</button>${d.official ? "" : `<button class="icon-btn" data-rev title="Recensisci">${icon("edit")}</button>`}</div></article>`;
  }

  function listHtml(u, uniId) {
    const q = F.q.trim().toLowerCase();
    const list = D.dispense(uniId).filter((d) => (!F.cds || d.cds.includes(F.cds)) && (F.anno === "0" || String(d.anno) === F.anno) && (!q || d.title.toLowerCase().includes(q)));
    return list.map((d) => card(u, d)).join("") || `<div class="card empty">${icon("book")}<p>Nessuna dispensa con questi filtri.</p><a class="btn btn-primary btn-sm" style="margin-top:12px" href="#/app/dispense/carica">Carica la prima</a></div>`;
  }

  function upload(u) {
    const me = D.myUni(u);
    const mine = u.activity.uploads.slice().reverse();
    const ST = { pending: ["In revisione", "badge-yellow"], approved: ["Approvata · +50 crediti", "badge-green"], rejected: ["Non approvata", "badge-red"] };
    return `
      <a href="#/app/dispense" class="small display" style="text-decoration:none">← Dispense</a>
      <div class="page-head" style="margin-top:12px"><div><div class="eyebrow">${icon("plus")} Carica</div><h1>Condividi una <span class="accent">dispensa</span></h1><p class="lead">Ogni dispensa viene controllata dal team del tuo ateneo. Se viene approvata guadagni 50 crediti.</p></div></div>
      <div class="grid g-ov">
        <section class="card c-7"><form class="stack" style="gap:14px" data-up>
          <div class="grid-2">
            <div class="field"><label for="up-uni">Ateneo</label><select class="select" id="up-uni" name="uni">${DATA.unis.map((x) => `<option value="${x.id}" ${x.id === me.id ? "selected" : ""}>${esc(x.n)}</option>`).join("")}</select></div>
            <div class="field"><label for="up-cds">Corso di laurea</label><select class="select" id="up-cds" name="cds">${me.cds.map((c) => `<option ${c === u.profile.corso ? "selected" : ""}>${esc(c)}</option>`).join("")}</select></div>
            <div class="field"><label for="up-anno">Anno</label><select class="select" id="up-anno" name="anno">${[1, 2, 3].map((y) => `<option value="${y}">${y}° anno</option>`).join("")}</select></div>
            <div class="field"><label for="up-pag">Pagine</label><input class="input" id="up-pag" name="pages" inputmode="numeric" placeholder="es. 40"></div>
          </div>
          <div class="field"><label for="up-title">Titolo (esame e tipo di materiale)</label><input class="input" id="up-title" name="title" placeholder="es. Statistica — esercizi d'esame commentati" maxlength="120"></div>
          <div class="field"><label for="up-file">File PDF</label><input class="input" id="up-file" type="file" accept="application/pdf"><span class="hint">Nella demo il file non viene caricato: si simula solo l'invio.</span></div>
          <label class="check small"><input type="checkbox" name="ok"> Ho scritto io questo materiale e non contiene testi o slide coperti da diritti di terzi.</label>
          <div class="form-err" data-err></div>
          <div><button class="btn btn-primary" type="submit">Invia in revisione</button></div>
        </form></section>
        <section class="card c-5"><div class="card-head"><h3>${icon("layers")} I tuoi caricamenti</h3><span class="badge badge-orange">${u.activity.credits} crediti</span></div>
          <ul class="feed">${mine.map((x) => `<li><span class="ic">${icon("file")}</span><div style="flex:1">${esc(x.title)}<time>${esc(D.uni(x.uni).s)} · ${ago(x.at)}</time></div><span class="badge ${ST[x.status][1]}">${ST[x.status][0]}</span></li>`).join("") || '<li class="small muted">Nessun caricamento.</li>'}</ul></section>
      </div>`;
  }

  UL.views.dispenseD = {
    title: "Dispense",
    render(u, params) {
      if (params[0] === "carica") return upload(u);
      const uniId = DATA.unis.some((x) => x.id === params[0]) ? params[0] : u.profile.ateneo;
      const uni = D.uni(uniId);
      if (F._uni !== uniId) { F.cds = uniId === u.profile.ateneo ? u.profile.corso || "" : ""; F._uni = uniId; }
      return `
      <div class="page-head"><div><div class="eyebrow">${icon("book")} Dispense</div><h1>Dispense <span class="accent">${esc(uni.s)}</span></h1>
        <p class="lead">${uniId === "unifi" ? "Catalogo ufficiale UniLink, scritto e revisionato dal team." : "Materiali caricati dagli studenti e verificati dal club del tuo ateneo."}</p></div>
        <a class="btn btn-primary" href="#/app/dispense/carica">${icon("plus")} Carica una dispensa</a></div>
      <div class="chips" style="margin-bottom:16px">${DATA.unis.map((x) => `<a class="chip ${x.id === uniId ? "on" : ""}" href="#/app/dispense/${x.id}">${esc(x.s)}${x.id === u.profile.ateneo ? " · il tuo" : ""}</a>`).join("")}</div>
      ${uni.status === "apertura" ? `<div class="banner">${icon("spark")}<span>Il club UniLink ${esc(uni.s)} è in apertura: le prime dispense e un ambassador lo rendono attivo.</span><a class="btn btn-sm btn-orange" href="#/app/club">Diventa ambassador</a></div>` : ""}
      <div class="filters"><div class="frow">
        <label class="search">${icon("search")}<input class="input" data-q placeholder="Cerca per esame" value="${esc(F.q)}"></label>
        <div class="seg" data-anno>${[["0", "Tutti"], ["1", "1° anno"], ["2", "2° anno"], ["3", "3° anno"]].map(([v, l]) => `<button class="${F.anno === v ? "on" : ""}" data-v="${v}">${l}</button>`).join("")}</div></div>
        <div class="frow"><span class="flabel">Corso di laurea</span><div class="chips" data-cds><span class="chip ${!F.cds ? "on" : ""}" data-v="">Tutti</span>${uni.cds.map((c) => `<span class="chip ${F.cds === c ? "on" : ""}" data-v="${esc(c)}">${esc(c)}</span>`).join("")}</div></div></div>
      <div class="stack" style="gap:12px" data-list>${listHtml(u, uniId)}</div>
      <p class="tiny muted" style="margin-top:12px">Atenei diversi da UniFi: dispense, autori e corsi di laurea di esempio.</p>`;
    },
    mount(root, u, params) {
      if (params[0] === "carica") return mountUpload(root, u);
      const uniId = DATA.unis.some((x) => x.id === params[0]) ? params[0] : u.profile.ateneo;
      const list = root.querySelector("[data-list]");
      const redraw = () => { list.innerHTML = listHtml(u, uniId); };
      root.querySelectorAll("[data-anno] button").forEach((b) => b.addEventListener("click", () => { F.anno = b.dataset.v; root.querySelectorAll("[data-anno] button").forEach((x) => x.classList.toggle("on", x === b)); redraw(); }));
      root.querySelectorAll("[data-cds] .chip").forEach((c) => c.addEventListener("click", () => { F.cds = c.dataset.v; root.querySelectorAll("[data-cds] .chip").forEach((x) => x.classList.toggle("on", x === c)); redraw(); }));
      let t; const q = root.querySelector("[data-q]");
      q.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => { F.q = q.value; redraw(); }, 150); });
      list.addEventListener("click", (e) => {
        const card = e.target.closest("[data-d]");
        if (!card) return;
        const id = card.dataset.d;
        if (e.target.closest("[data-fav]")) {
          const on = UL.store.toggleFavorite(u, id); e.target.closest("[data-fav]").classList.toggle("on", on);
        } else if (e.target.closest("[data-dl]")) {
          const d = D.dispense(uniId).find((x) => x.id === id);
          if (!d.pdf) { e.preventDefault(); UL.ui.toast("Demo: il file di esempio non è disponibile"); }
          UL.store.addLog(u, "dispense", `Scaricata — ${d.title}`); UL.store.save();
        } else if (e.target.closest("[data-rev]")) {
          const m = UL.ui.modal(`<div class="modal-head"><h2>Recensisci</h2><button class="icon-btn" data-close>${icon("x")}</button></div>
            <p class="label" style="margin-bottom:8px">Quanto ti è stata utile?</p><div class="chips" data-stars>${[1, 2, 3, 4, 5].map((n) => `<span class="chip" data-v="${n}">${"★".repeat(n)}</span>`).join("")}</div>
            <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-primary" data-ok disabled>Invia (+5 crediti)</button></div>`, { width: 460 });
          m.el.querySelectorAll("[data-stars] .chip").forEach((c) => c.addEventListener("click", () => { m.el.querySelectorAll("[data-stars] .chip").forEach((x) => x.classList.toggle("on", x === c)); m.el.querySelector("[data-ok]").disabled = false; }));
          m.el.querySelector("[data-ok]").addEventListener("click", () => { D.addCredits(u, 5, "recensione"); UL.store.save(); m.close(); UL.ui.toast("Grazie! +5 crediti"); UL.app.refresh(); });
        }
      });
    },
  };

  function mountUpload(root, u) {
    const uniSel = root.querySelector("#up-uni");
    uniSel.addEventListener("change", () => { root.querySelector("#up-cds").innerHTML = D.uni(uniSel.value).cds.map((c) => `<option>${esc(c)}</option>`).join(""); });
    root.querySelector("[data-up]").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      const err = root.querySelector("[data-err]");
      if ((f.title || "").trim().length < 6) return (err.textContent = "Scrivi un titolo con esame e tipo di materiale.");
      if (!f.ok) return (err.textContent = "Conferma di avere i diritti sul materiale.");
      u.activity.uploads.push({ id: "u" + D.uid(), uni: f.uni, cds: f.cds, anno: Number(f.anno), title: f.title.trim(), pages: Number(f.pages) || null, status: "pending", at: new Date().toISOString() });
      UL.store.addLog(u, "dispense", `Dispensa inviata in revisione — ${f.title.trim()}`);
      UL.store.save(); UL.ui.toast("Inviata in revisione"); UL.app.refresh();
    });
  }
})();

