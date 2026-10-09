/* career · viste-percorso.js
   Modulo Career · VISTE pianoC (rotta piano), studioC (studio), opportunitaC (opportunita), profiloC (profilo),
   eventiC (eventi), plusC (plus), onboardingC (non usata nella v3: il primo accesso è unico, in views/unilink.js).
   Ogni vista = { title, render(user) → HTML, mount(root, user) → eventi }. Architettura: career/core.js. */
/* Variante C — area personale: piano, studio, opportunità, profilo talento, eventi, Plus */
(function () {
  const UL = window.UL;
  const C = UL.C;
  const D = window.UL_C;
  const { icon, esc, num, ago, fmtDate, ROMAN } = UL.ui;
  const head = (eyebrow, ic, title, lead, right) => `<div class="page-head"><div><div class="eyebrow">${icon(ic)} ${esc(eyebrow)}</div><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}</div>${right || ""}</div>`;
  const logo = (co) => `<span class="logo-sq" style="background:${co.c}">${esc(co.n.split(" ").map((x) => x[0]).slice(0, 2).join(""))}</span>`;

  function jobCard(u, j) {
    const co = C.co(j.co);
    const app = u.activity.applications.find((a) => a.job === j.id);
    return `<article class="job" data-job="${j.id}">${logo(co)}
      <div><div class="row" style="gap:8px"><span class="badge badge-soft">${esc(j.type)}</span>${j.sponsored ? '<span class="sponsored">IN EVIDENZA</span>' : ""}${app ? `<span class="stage ${C.APP_ST[app.st].c}">${C.APP_ST[app.st].l}</span>` : ""}</div>
        <h3>${esc(j.t)}</h3><p class="small muted" style="margin-bottom:8px">${esc(co.n)} · ${esc(co.s)}</p>
        <div class="facts"><span>${icon("pin")} ${esc(j.loc)}</span><span>${icon("clock")} ${esc(j.dur)}</span><span>${icon("target")} ${esc(j.area)}</span><span>${icon("calendar")} scade tra ${j.dl} giorni</span></div>
        <p class="small" style="margin-top:8px">${esc(j.req)}</p></div>
      <div class="stack" style="gap:8px;min-width:150px">${app ? `<span class="small muted">Inviata ${ago(app.at)}</span>` : `<button class="btn btn-primary btn-sm" data-apply="${j.id}">Candidatura rapida</button>`}</div></article>`;
  }

  /* ---------------- ONBOARDING ---------------- */
  UL.views.onboardingC = {
    title: "Benvenuto",
    render: (u) => `
    <div class="auth" style="grid-template-columns:1fr"><section class="auth-form-wrap" style="min-height:100vh"><div style="width:100%;max-width:680px">
      <a class="brand" href="#/app/piano" style="margin-bottom:20px"><img src="img/logo-blu.png" alt=""><span>unilink</span></a>
      <div class="card" style="padding:30px">
        <span class="sq-label">Primo accesso</span><h2 style="margin:10px 0 6px">Ciao ${esc(u.profile.nome)}, dove vuoi arrivare?</h2>
        <p class="muted" style="margin-bottom:18px">Il tuo piano e le opportunità partono da qui. Puoi cambiarlo quando vuoi.</p>
        <p class="label" style="margin-bottom:8px">Dopo la triennale</p>
        <div class="chips" data-single="dopoLaurea">${Object.entries(UL.ui.DOPO).map(([k, v]) => `<span class="chip ${u.profile.dopoLaurea === k ? "on" : ""}" data-v="${k}">${v}</span>`).join("")}</div>
        <p class="label" style="margin:18px 0 8px">Aree che ti interessano</p>
        <div class="chips" data-multi="areeProf">${window.UL_AREE_PROF.map((a) => `<span class="chip ${u.profile.areeProf.includes(a) ? "on" : ""}" data-v="${esc(a)}">${esc(a)}</span>`).join("")}</div>
        <div class="grid-2" style="margin-top:18px"><div class="field"><label for="ob-media">Media attuale</label><input class="input" id="ob-media" inputmode="decimal" placeholder="es. 27,2"></div>
          <div class="field"><label for="ob-eng">Inglese</label><select class="select" id="ob-eng"><option value="">—</option>${["B1", "B2", "C1", "C2"].map((l) => `<option>${l}</option>`).join("")}</select></div></div>
        <div class="row" style="justify-content:flex-end;margin-top:22px"><button class="btn btn-primary btn-arrow" data-go>Crea il mio piano <span class="arr">${icon("arrow")}</span></button></div>
      </div></div></section></div>`,
    mount(root, u) {
      const p = u.profile;
      root.querySelectorAll("[data-single] .chip").forEach((c) => c.addEventListener("click", () => { p.dopoLaurea = c.dataset.v; root.querySelectorAll("[data-single] .chip").forEach((x) => x.classList.toggle("on", x === c)); }));
      root.querySelectorAll("[data-multi] .chip").forEach((c) => c.addEventListener("click", () => { const i = p.areeProf.indexOf(c.dataset.v); i >= 0 ? p.areeProf.splice(i, 1) : p.areeProf.push(c.dataset.v); c.classList.toggle("on"); }));
      root.querySelector("[data-go]").addEventListener("click", () => {
        const m = root.querySelector("#ob-media").value.trim();
        if (m) { p.mediaManuale = m; p.usaLibretto = false; }
        p.inglese = root.querySelector("#ob-eng").value;
        u.activity.referral.code = (p.nome || "UL").toUpperCase().slice(0, 6) + "-" + Math.random().toString(36).slice(2, 5).toUpperCase();
        UL.store.markOnboarded(u);
        UL.app.go("#/app/piano");
      });
    },
  };

  /* ---------------- IL MIO PIANO ---------------- */
  UL.views.pianoC = {
    title: "Il mio piano",
    render(u) {
      const sc = C.score(u);
      const ph = C.phases(u);
      const next = C.nextActions(u);
      const jobs = D.jobs.filter((j) => !u.profile.areeProf.length || u.profile.areeProf.includes(j.area)).slice(0, 3);
      const evs = D.events.slice().sort((a, b) => a.d - b.d).slice(0, 3);
      return `
      ${head("Il mio piano", "target", `Ciao ${esc(u.profile.nome)}, sei nella fase <span class="accent">${esc((ph.find((x) => x.state === "now") || ph[4]).k)}</span>`, "", C.isPlus(u) ? '<span class="badge badge-orange">Plus attivo</span>' : '<a class="btn btn-orange btn-sm" href="#/app/plus">Passa a Plus</a>')}
      <div class="grid g-ov">
        <section class="card c-5">
          <div class="card-head"><h3>${icon("chart")} Career Score</h3></div>
          <div class="strength" style="grid-template-columns:130px 1fr">
            <div class="ring" style="width:130px;height:130px">${UL.ui.ring(sc.total, 130, 11)}<div class="lbl"><div><b>${sc.total}</b><span>su 100</span></div></div></div>
            <div class="bars-mini">${sc.parts.map((x) => `<div class="r"><span>${x.k}</span><span class="t"><i style="width:${(x.v / x.max) * 100}%"></i></span><b>${Math.round(x.v)}/${x.max}</b></div>`).join("")}</div>
          </div>
        </section>
        <section class="card navy c-7">
          <span class="badge badge-orange">Le tue prossime 3 azioni</span>
          <ul class="feed" style="margin-top:12px">${next.map((a) => `<li style="border-color:rgba(255,255,255,.12)"><span class="ic" style="background:rgba(255,255,255,.1);color:#fff">${icon("arrow")}</span><div style="flex:1"><b class="display" style="font-weight:400">${esc(a.t)}</b><time style="color:rgba(255,255,255,.6)">Fase: ${esc(a.ph)}</time></div><a class="btn btn-sm btn-white" href="${a.to}">Vai</a></li>`).join("") || '<li style="border:0">Hai completato tutte le fasi: ottimo lavoro.</li>'}</ul>
        </section>
        <section class="c-12">
          <div class="path">${ph.map((x, i) => `<div class="path-step ${x.state}"><span class="ph">FASE ${i + 1}${x.state === "now" ? " · ORA" : ""}</span><h4>${esc(x.k)}</h4>
            <ul>${x.items.map((it) => `<li class="${it.ok ? "ok" : "no"}">${icon(it.ok ? "check" : "plus")}<span>${esc(it.t)}</span></li>`).join("")}</ul></div>`).join("")}</div>
        </section>
        <section class="card c-7"><div class="card-head"><h3>${icon("brief")} Opportunità per te</h3><a class="more" href="#/app/opportunita">Tutte ${icon("arrow")}</a></div>
          <div class="stack" style="gap:12px" data-jobs>${jobs.map((j) => jobCard(u, j)).join("") || '<p class="small muted">Scegli le tue aree nel profilo per vedere opportunità mirate.</p>'}</div></section>
        <section class="card c-5"><div class="card-head"><h3>${icon("calendar")} Prossimi eventi</h3><a class="more" href="#/app/eventi">Calendario ${icon("arrow")}</a></div>
          <ul class="feed">${evs.map((e) => `<li><span class="ic">${icon("spark")}</span><div>${esc(e.t)}<time>${fmtDate(C.inDays(e.d).toISOString())} · ${e.h} · ${esc(e.place)}${u.activity.rsvp.includes(e.id) ? " · iscritto" : ""}</time></div></li>`).join("")}</ul></section>
      </div>`;
    },
    mount(root, u) { bindApply(root, u); },
  };

  function bindApply(root, u) {
    root.querySelectorAll("[data-apply]").forEach((b) => b.addEventListener("click", () => {
      const j = D.jobs.find((x) => x.id === b.dataset.apply);
      const pct = C.talentPct(u);
      const m = UL.ui.modal(`<div class="modal-head"><div><span class="sq-label">Candidatura rapida</span><h2 style="margin-top:8px">${esc(j.t)}</h2><p class="small muted">${esc(C.co(j.co).n)}</p></div><button class="icon-btn" data-close>${icon("x")}</button></div>
        <p>Invii il tuo profilo talento (completo al <b>${pct}%</b>) con una breve nota.</p>
        ${pct < 80 ? `<div class="banner" style="margin:12px 0 0">${icon("alert")}<span>Un profilo sotto l'80% riceve meno risposte. <a href="#/app/profilo">Completalo prima</a>.</span></div>` : ""}
        <div class="field" style="margin-top:14px"><label for="nota">Perché questa posizione? (facoltativo)</label><textarea class="textarea" id="nota" maxlength="500"></textarea></div>
        <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-ghost" data-close>Annulla</button><button class="btn btn-primary" data-send>Invia candidatura</button></div>`, { width: 560 });
      m.el.querySelector("[data-send]").addEventListener("click", () => {
        u.activity.applications.push({ id: "a" + Date.now().toString(36), job: j.id, st: "inviata", at: new Date().toISOString() });
        UL.store.addLog(u, "opportunita", `Candidatura inviata — ${j.t}`);
        UL.store.save(); m.close(); UL.ui.toast("Candidatura inviata (demo)"); UL.app.refresh();
      });
    }));
  }

  /* ---------------- STUDIO ---------------- */
  UL.views.studioC = {
    title: "Studio",
    render(u) {
      const p = u.profile;
      const list = (window.UL_DISPENSE || []).filter((d) => !d.soon && (!p.cds || d.cds.includes(p.cds)) && (!p.anno || d.anno === Number(p.anno)));
      return `
      ${head("Studio", "book", 'I tuoi <span class="accent">esami</span>', "Le dispense restano gratuite per tutti. Con Plus si aggiungono esercitazioni, simulazioni e ripasso degli errori.")}
      ${C.isPlus(u) ? "" : `<div class="banner">${icon("spark")}<span>Con <b>Plus</b> (${C.eur(D.PLUS.semestre)} a semestre) sblocchi le esercitazioni di tutti gli esami.</span><a class="btn btn-sm btn-orange" href="#/app/plus">Scopri Plus</a></div>`}
      <div class="course-grid" data-courses>${list.map((c) => UL.ui.courseCard(c, u)).join("")}</div>
      <div class="card beige" style="margin-top:20px"><h3>Esercitazioni</h3><p class="small muted" style="margin-top:6px">Quiz con spiegazioni, simulazioni a tempo e ripasso degli errori: ${C.isPlus(u) ? "incluse nel tuo Plus." : "incluse in Plus."} (Vedi la variante B per il funzionamento completo.)</p></div>`;
    },
    mount(root, u) {
      root.querySelector("[data-courses]").addEventListener("click", (e) => {
        const el = e.target.closest("[data-act]");
        if (!el) return;
        const slug = el.closest("[data-slug]").dataset.slug;
        if (el.dataset.act === "fav") { e.preventDefault(); const on = UL.store.toggleFavorite(u, slug); el.classList.toggle("on", on); }
        else if (el.dataset.act === "dl") UL.store.logDownload(u, slug, el.dataset.kind);
        else if (el.dataset.act === "info") UL.ui.courseInfo((window.UL_DISPENSE || []).find((d) => d.slug === slug));
      });
    },
  };

  /* ---------------- OPPORTUNITÀ ---------------- */
  let F = { type: "Tutte", area: "" };
  UL.views.opportunitaC = {
    title: "Opportunità",
    render(u) {
      const types = ["Tutte", "Stage", "Graduate", "Part-time", "Case competition"];
      const list = D.jobs.filter((j) => (F.type === "Tutte" || j.type === F.type) && (!F.area || j.area === F.area));
      const apps = u.activity.applications;
      return `
      ${head("Opportunità", "brief", 'Stage e <span class="accent">opportunità</span>', "Dalle aziende partner. Candidatura rapida con il tuo profilo talento.")}
      <div class="filters"><div class="frow"><div class="seg" data-type>${types.map((t) => `<button class="${F.type === t ? "on" : ""}" data-v="${t}">${t}</button>`).join("")}</div>
        <select class="select" data-area style="width:auto"><option value="">Tutte le aree</option>${[...new Set(D.jobs.map((j) => j.area))].map((a) => `<option ${F.area === a ? "selected" : ""}>${esc(a)}</option>`).join("")}</select></div></div>
      <div class="grid g-ov">
        <div class="c-8 stack" style="gap:12px">${list.map((j) => jobCard(u, j)).join("") || '<div class="card empty">Nessuna opportunità con questi filtri.</div>'}</div>
        <section class="card c-4" style="align-self:start"><div class="card-head"><h3>${icon("layers")} Le mie candidature</h3></div>
          <ul class="feed">${apps.map((a) => { const j = D.jobs.find((x) => x.id === a.job); return j ? `<li><span class="ic">${icon("brief")}</span><div style="flex:1">${esc(j.t)}<time>${esc(C.co(j.co).n)} · ${ago(a.at)}</time></div><span class="stage ${C.APP_ST[a.st].c}">${C.APP_ST[a.st].l}</span></li>` : ""; }).join("") || '<li class="small muted">Nessuna candidatura.</li>'}</ul>
          <p class="tiny muted" style="margin-top:10px">Aziende di esempio: nomi e posizioni sono fittizi.</p></section>
      </div>`;
    },
    mount(root, u) {
      root.querySelectorAll("[data-type] button").forEach((b) => b.addEventListener("click", () => { F.type = b.dataset.v; UL.app.refresh(); }));
      root.querySelector("[data-area]").addEventListener("change", (e) => { F.area = e.target.value; UL.app.refresh(); });
      bindApply(root, u);
    },
  };

  /* ---------------- PROFILO TALENTO ---------------- */
  UL.views.profiloC = {
    title: "Profilo talento",
    render(u) {
      const p = u.profile;
      const c = UL.store.career(p);
      const pct = C.talentPct(u);
      const badges = [
        c.media ? `Media ${num(c.media, 1)} · ${c.cfu || 0} CFU` : null,
        p.certInglese && p.certInglese !== "Nessuna" ? `${p.certInglese} ${p.scoreInglese || ""}`.trim() : null,
        p.gmat ? `GMAT ${p.gmat}` : null,
        p.erasmus === "si" ? `Erasmus${p.erasmusDove ? " · " + p.erasmusDove : ""}` : null,
        ...u.activity.tracks.map((t) => `${C.track(t.id).t} · ${Math.round((t.done.length / C.track(t.id).mods.length) * 100)}%`),
      ].filter(Boolean);
      return `
      ${head("Profilo talento", "user", 'Il tuo <span class="accent">profilo</span>', "È il profilo che invii con le candidature e che le aziende partner vedono, solo se lo rendi visibile.")}
      <div class="grid g-ov">
        <section class="card c-7">
          <div class="card-head"><h3>${icon("edit")} Modifica</h3><span class="small muted">Completo al ${pct}%</span></div>
          <form class="stack" style="gap:14px" data-form>
            <div class="field"><label for="hl">Titolo del profilo</label><input class="input" id="hl" name="headline" value="${esc(p.headline)}" placeholder="es. Studente di Economia orientato a consulting e strategy" maxlength="120"></div>
            <div class="grid-2">
              <div class="field"><label for="md">Media</label><input class="input" id="md" name="mediaManuale" value="${esc(p.mediaManuale)}" inputmode="decimal"></div>
              <div class="field"><label for="cf">CFU</label><input class="input" id="cf" name="cfuManuali" value="${esc(p.cfuManuali)}" inputmode="numeric"></div>
              <div class="field"><label for="en">Inglese</label><select class="select" id="en" name="inglese">${["", "B1", "B2", "C1", "C2", "Madrelingua"].map((l) => `<option ${p.inglese === l ? "selected" : ""} value="${l}">${l || "—"}</option>`).join("")}</select></div>
              <div class="field"><label for="ce">Certificazione</label><select class="select" id="ce" name="certInglese">${["Nessuna", "IELTS", "TOEFL iBT", "Cambridge C1 Advanced", "Cambridge C2 Proficiency"].map((l) => `<option ${p.certInglese === l ? "selected" : ""}>${l}</option>`).join("")}</select></div>
              <div class="field"><label for="gm">GMAT Focus (se sostenuto)</label><input class="input" id="gm" name="gmat" value="${esc(p.gmat)}" inputmode="numeric"></div>
              <div class="field"><label for="er">Erasmus</label><select class="select" id="er" name="erasmus">${[["no", "No"], ["candidatura", "Candidatura in corso"], ["si", "Sì"]].map(([v, l]) => `<option value="${v}" ${p.erasmus === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
            </div>
            <div class="field"><label for="sk">Competenze (separate da virgola)</label><input class="input" id="sk" name="skills" value="${esc((p.skills || []).join(", "))}" placeholder="Excel, PowerPoint, Python, Bilancio"></div>
            <div class="field"><label for="ex">Esperienze extra</label><textarea class="textarea" id="ex" name="extracurricolari">${esc(p.extracurricolari)}</textarea></div>
            <div class="field"><label for="li">LinkedIn</label><input class="input" id="li" name="linkedin" value="${esc(p.linkedin)}" placeholder="linkedin.com/in/..."></div>
            <div><button class="btn btn-primary" type="submit">${icon("check")} Salva profilo</button></div>
          </form>
        </section>
        <section class="c-5 stack">
          <div class="card">
            <div class="row between"><div><b class="display" style="color:var(--navy)">Visibile alle aziende partner</b><p class="small muted" style="margin-top:4px">Puoi cambiare idea in qualsiasi momento.</p></div>
              <label class="check" style="align-items:center"><input type="checkbox" data-visible ${u.activity.talent.visible ? "checked" : ""}><span class="small">${u.activity.talent.visible ? "Attivo" : "Disattivo"}</span></label></div>
          </div>
          <div class="card navy">
            <span class="sq-label" style="color:#fff">Anteprima: come ti vede un'azienda</span>
            <div class="profile-head" style="margin-top:14px"><span class="avatar lg">${esc(UL.ui.initials(p))}</span><div><h3>${esc(UL.ui.fullName(p))}</h3><p class="small" style="color:rgba(255,255,255,.75)">${esc(UL.ui.CDS[p.cds] || "")} · ${ROMAN[p.anno] || ""} anno · UNIFI</p></div></div>
            <p style="margin-top:14px">${esc(p.headline || "Aggiungi un titolo al tuo profilo.")}</p>
            <div class="chips" style="margin-top:12px">${badges.map((b) => `<span class="chip chip-static" style="background:rgba(255,255,255,.1);color:#fff;border-color:rgba(255,255,255,.2)">${icon("shield")} ${esc(b)}</span>`).join("")}</div>
            <div class="chips" style="margin-top:10px">${(p.skills || []).map((s) => `<span class="chip chip-static">${esc(s)}</span>`).join("")}</div>
            <p class="tiny" style="margin-top:14px;color:rgba(255,255,255,.6)">I badge con lo scudo sono verificati da UniLink (libretto, certificazioni, Track completati).</p>
          </div>
          <button class="btn btn-ghost" data-cv>${icon("file")} Genera CV testuale</button>
        </section>
      </div>`;
    },
    mount(root, u) {
      root.querySelector("[data-form]").addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = Object.fromEntries(new FormData(e.target));
        fd.skills = fd.skills.split(",").map((s) => s.trim()).filter(Boolean);
        if (fd.mediaManuale || fd.cfuManuali) fd.usaLibretto = false;
        Object.assign(u.profile, fd);
        UL.store.addLog(u, "profilo", "Profilo talento aggiornato");
        UL.store.save(); UL.ui.toast("Profilo salvato"); UL.app.refresh();
      });
      root.querySelector("[data-visible]").addEventListener("change", (e) => {
        u.activity.talent.visible = e.target.checked;
        UL.store.addLog(u, "profilo", e.target.checked ? "Profilo reso visibile alle aziende partner" : "Visibilità del profilo disattivata");
        UL.store.save(); UL.app.refresh();
      });
      root.querySelector("[data-cv]").addEventListener("click", () => {
        const p = u.profile;
        const c = UL.store.career(p);
        const txt = [UL.ui.fullName(p).toUpperCase(), p.headline, p.linkedin, "", "FORMAZIONE", `Laurea triennale in ${UL.ui.CDS[p.cds] || "Economia"} — Università degli Studi di Firenze (in corso, ${ROMAN[p.anno] || ""} anno)`, c.media ? `Media ponderata ${num(c.media, 2)}/30 · ${c.cfu} CFU` : "", p.erasmus === "si" ? `Erasmus: ${p.erasmusDove || ""}` : "", "", "COMPETENZE", (p.skills || []).join(" · "), "", "LINGUE", `Inglese ${p.inglese || ""} ${p.certInglese && p.certInglese !== "Nessuna" ? "(" + p.certInglese + " " + (p.scoreInglese || "") + ")" : ""}`, p.gmat ? `GMAT Focus ${p.gmat}` : "", "", "ALTRE ESPERIENZE", p.extracurricolari || ""].filter((x) => x !== undefined).join("\n").replace(/\n{3,}/g, "\n\n");
        UL.ui.offerText("Il tuo CV (testo)", "cv_unilink.txt", txt, "text/plain");
      });
    },
  };

  /* ---------------- EVENTI ---------------- */
  UL.views.eventiC = {
    title: "Eventi",
    render(u) {
      return `
      ${head("Eventi", "calendar", 'Eventi e <span class="accent">community</span>', "Workshop, talk, info session e case competition. Gli eventi in evidenza sono sponsorizzati da partner.")}
      <div class="stack" style="gap:12px">${D.events.slice().sort((a, b) => a.d - b.d).map((e) => {
        const d = C.inDays(e.d);
        const on = u.activity.rsvp.includes(e.id);
        return `<article class="job"><span class="logo-sq" style="background:var(--orange);flex-direction:column;font-size:12px;line-height:1.1">${d.getDate()}<br>${d.toLocaleDateString("it-IT", { month: "short" })}</span>
          <div><div class="row" style="gap:8px"><span class="badge badge-soft">${esc(e.type)}</span>${e.sponsored ? '<span class="sponsored">SPONSORIZZATO</span>' : ""}</div><h3>${esc(e.t)}</h3>
            <div class="facts"><span>${icon("clock")} ${e.h}</span><span>${icon("pin")} ${esc(e.place)}</span>${e.co ? `<span>${icon("brief")} ${esc(C.co(e.co).n)}</span>` : ""}</div></div>
          <div><button class="btn btn-sm ${on ? "btn-orange" : "btn-primary"}" data-rsvp="${e.id}">${on ? icon("check") + " Iscritto" : "Iscriviti"}</button></div></article>`;
      }).join("")}</div>
      <p class="tiny muted" style="margin-top:12px">Eventi e aziende di esempio.</p>`;
    },
    mount(root, u) {
      root.querySelectorAll("[data-rsvp]").forEach((b) => b.addEventListener("click", () => {
        const r = u.activity.rsvp;
        const i = r.indexOf(b.dataset.rsvp);
        i >= 0 ? r.splice(i, 1) : r.push(b.dataset.rsvp);
        UL.store.save(); UL.ui.toast(i >= 0 ? "Iscrizione annullata" : "Iscrizione confermata"); UL.app.refresh();
      }));
    },
  };

  /* ---------------- PLUS E INVITI ---------------- */
  UL.views.plusC = {
    title: "Plus e inviti",
    render(u) {
      const pl = u.activity.plus;
      const ref = u.activity.referral;
      return `
      ${head("Abbonamento", "spark", 'UniLink <span class="accent">Plus</span>', "Esercitazioni per tutti gli esami, revisione del CV, priorità su eventi e Track, sconti dei partner.")}
      <div class="grid g-ov">
        <section class="card c-7">
          ${pl.active || u.role === "admin" ? `<span class="badge badge-green">${icon("check")} Plus attivo</span><h2 style="margin:12px 0 6px">Piano ${esc(pl.plan || "team")}</h2><p class="muted">Attivo dal ${fmtDate(pl.since)}. Si rinnova a fine semestre.</p>
            ${u.role === "admin" ? "" : '<button class="btn btn-ghost btn-sm" style="margin-top:14px" data-cancel>Annulla il rinnovo</button>'}`
          : `<h2 style="margin-bottom:12px">Scegli come pagare</h2>
            <div class="pricing three" style="grid-template-columns:repeat(2,1fr)">
              <div class="plan"><h3>Mensile</h3><div class="price">${C.eur(D.PLUS.mese)} <small>/ mese</small></div><button class="btn btn-primary" data-plus="mese">Attiva</button></div>
              <div class="plan hot" data-hot="Conviene"><h3>Semestrale</h3><div class="price">${C.eur(D.PLUS.semestre)} <small>/ semestre</small></div><button class="btn btn-orange" data-plus="semestre">Attiva</button></div>
            </div><p class="tiny muted" style="margin-top:10px">Pagamento simulato: nessun addebito reale.</p>`}
          <hr class="divider"><p class="label" style="margin-bottom:10px">Vantaggi dei partner</p>
          <div class="feature-grid">${D.perks.map((x) => `<div class="feature"><span class="ic">${icon(x.i)}</span><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></div>`).join("")}</div>
        </section>
        <section class="card navy c-5">
          <span class="badge badge-orange">Invita i tuoi compagni</span>
          <h2 style="margin:12px 0 8px">3 amici iscritti = 1 mese di Plus</h2>
          <p style="color:rgba(255,255,255,.78)">Condividi il tuo codice: chi si iscrive riceve il 10% sul primo acquisto.</p>
          <div class="row" style="margin-top:16px"><span class="chip" style="font-size:16px;padding:10px 16px">${esc(ref.code || "—")}</span><button class="btn btn-white btn-sm" data-copy>Copia</button></div>
          <div class="row" style="margin-top:18px;gap:24px"><div><b class="display" style="font-size:30px;font-weight:400">${ref.invited}</b><div class="tiny" style="color:rgba(255,255,255,.65)">amici iscritti</div></div><div><b class="display" style="font-size:30px;font-weight:400">${ref.credits}</b><div class="tiny" style="color:rgba(255,255,255,.65)">mesi guadagnati</div></div></div>
        </section>
      </div>`;
    },
    mount(root, u) {
      root.querySelectorAll("[data-plus]").forEach((b) => b.addEventListener("click", () => {
        u.activity.plus = { active: true, plan: b.dataset.plus === "mese" ? "mensile" : "semestrale", since: new Date().toISOString() };
        UL.store.addLog(u, "plus", "Plus attivato (" + u.activity.plus.plan + ")");
        UL.store.save(); UL.ui.toast("Plus attivato (demo)"); UL.app.refresh();
      }));
      const c = root.querySelector("[data-cancel]");
      c && c.addEventListener("click", () => { u.activity.plus.active = false; UL.store.save(); UL.ui.toast("Rinnovo annullato"); UL.app.refresh(); });
      const cp = root.querySelector("[data-copy]");
      cp && cp.addEventListener("click", () => {
        try { navigator.clipboard.writeText(u.activity.referral.code).then(() => UL.ui.toast("Codice copiato"), () => UL.ui.toast("Copia il codice manualmente", "err")); }
        catch (e) { UL.ui.toast("Copia il codice manualmente", "err"); }
      });
    },
  };
})();

