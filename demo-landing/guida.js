/* UniLink — pagina Guida (S14): tab per facoltà, percorso a 6 capitoli, un capitolo alla volta.
   Dati in guida-dati.js (window.UL_GUIDA). Stato: ?facolta=… (o l'ultima scelta) e #c-<capitolo>. */
(() => {
  const G = window.UL_GUIDA, root = document.querySelector("[data-guida]");
  if (!G || !root) return;
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const mem = { get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };

  // icone dei capitoli (tratto, 24×24)
  const P = {
    bussola: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    libro: '<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/>',
    aereo: '<path d="M3 13l18-7-5 14-4-6z"/><path d="M12 14l9-8"/>',
    mappa: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
    scala: '<path d="M7 3v18M17 3v18M7 7h10M7 12h10M7 17h10"/>',
    bandiera: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  };
  const ico = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${P[k] || P.bussola}</svg>`;

  const fac = () => {
    const q = new URLSearchParams(location.search).get("facolta") || mem.get("ul-guida-fac") || "economia";
    return G.facolta.find((f) => f.id === q) || G.facolta[0];
  };

  // ───────── blocchi
  const B = {
    cards: (b) => `<div class="g-cards c${b.cols || 2}">${b.items.map((c) => `<div class="g-card">${c.k ? `<span class="g-k">${esc(c.k)}</span>` : ""}<h4>${esc(c.h)}</h4>${c.p ? `<p>${esc(c.p)}</p>` : ""}${c.lista ? `<ul>${c.lista.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</div>`).join("")}</div>`,
    passi: (b) => `<ol class="g-passi ${b.stile || ""}">${b.items.map((x, i) => `<li><span class="g-n">${i + 1}</span><div><h4>${esc(x.h)}</h4><p>${esc(x.p)}</p></div></li>`).join("")}</ol>`,
    tabella: (b) => `<figure class="g-tab">${b.h ? `<figcaption>${esc(b.h)}</figcaption>` : ""}<div class="g-tabw" tabindex="0"><table><thead><tr>${b.head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c, i) => (i ? `<td>${esc(c)}</td>` : `<th scope="row">${esc(c)}</th>`)).join("")}</tr>`).join("")}</tbody></table></div></figure>`,
    frase: (b) => `<blockquote class="g-frase"><span aria-hidden="true">“</span>${esc(b.testo)}</blockquote>`,
    box: (b) => `<aside class="g-box ${b.tono || ""}"><h4>${esc(b.h)}</h4><p>${esc(b.p)}</p></aside>`,
    cta: (b) => `<a class="btn btn-s g-cta" href="${esc(b.href)}">${esc(b.testo)} <span class="freccia">→</span></a>`,
    formula: (b) => `<div class="g-formula"><span class="g-k">${esc(b.h)}</span><b>${esc(b.testo)}</b></div>`,
    fonte: (b) => `<p class="g-fonte">${esc(b.testo)}</p>`,
    lista: (b) => {
      const tit = b.h ? `<h4 class="g-lh">${esc(b.h)}</h4>` : "";
      if (b.stile === "ruoli") return tit + `<div class="g-ruoli">${b.items.map((x) => `<div><h4>${esc(x.h)}</h4><span class="g-k">${esc(x.k)}</span><p>${esc(x.p)}</p></div>`).join("")}</div>`;
      if (b.stile === "citta") return tit + `<div class="g-citta">${b.items.map((x) => `<div><b>${esc(x.h)}</b><p>${esc(x.p)}</p></div>`).join("")}</div>`;
      if (b.stile === "check") return tit + `<ul class="g-check">${b.items.map((x) => `<li>${esc(x.p)}</li>`).join("")}</ul>`;
      if (b.stile === "errori") return tit + `<ol class="g-errori">${b.items.map((x, i) => `<li><span class="g-en">${String(i + 1).padStart(2, "0")}</span><div><h4>${esc(x.h)}</h4><p>${esc(x.p)}</p></div></li>`).join("")}</ol>`;
      if (b.stile === "fonti") return tit + `<ul class="g-fonti">${b.items.map((x) => `<li><a href="${esc(x.href)}" target="_blank" rel="noopener">${esc(x.h)} <span>Apri ↗</span></a></li>`).join("")}</ul>`;
      return tit + `<ul class="g-check">${b.items.map((x) => `<li>${esc(x.p || x.h)}</li>`).join("")}</ul>`;
    },
    mappa: (b) => `<div class="g-mappa ${b.stile || ""}">${b.items.map((x, i) => {
      const dest = x.href || (x.vai ? "#" + x.vai : ""), tag = dest ? "a" : "div";
      return `<${tag} class="g-tile t${i % 4}"${dest ? ` href="${esc(dest)}"${x.vai ? ` data-vai="${esc(x.vai)}"` : ""}` : ""}><span class="g-k">${esc(x.k)}</span><h4>${esc(x.h)}</h4><p>${esc(x.p)}</p>${dest ? '<span class="g-go">→</span>' : ""}</${tag}>`;
    }).join("")}</div>`,
  };
  const blocchi = (l) => (l || []).map((b) => (B[b.t] ? B[b.t](b) : "")).join("");

  // ───────── percorso (6 tappe)
  const percorso = (caps, att, attivo = true) => `<nav class="g-percorso${attivo ? "" : " vuoto"}" aria-label="Capitoli della guida">${caps.map((c) =>
    attivo ? `<a class="g-nodo${c.id === att ? " on" : ""}" href="#c-${c.id}"${c.id === att ? ' aria-current="step"' : ""}><span class="g-ico">${ico(c.ico)}</span><b>${c.n}</b><span class="g-nt">${esc(c.titolo)}</span></a>`
      : `<span class="g-nodo"><span class="g-ico">${ico(c.ico)}</span><b>${c.n}</b><span class="g-nt">${esc(c.titolo)}</span></span>`).join("")}</nav>`;

  const sezione = (s, i) => {
    const id = s.id || "s" + i, testa = `<span class="eyebrow">${esc(s.sotto || "")}</span><h3>${esc(s.titolo)}</h3>`;
    const corpo = `${s.intro ? `<p class="g-intro">${esc(s.intro)}</p>` : ""}${blocchi(s.blocchi)}`;
    return s.apri
      ? `<details class="g-sez g-apri" id="${id}"><summary>${testa}<span class="g-piu" aria-hidden="true">+</span></summary>${corpo}</details>`
      : `<section class="g-sez" id="${id}">${testa}${corpo}</section>`;
  };

  const capitolo = (E, c) => {
    const i = E.capitoli.indexOf(c), prec = E.capitoli[i - 1], succ = E.capitoli[i + 1];
    return `<article class="g-cap" aria-labelledby="g-cap-t">
      <header class="g-ctesta">
        <div><span class="g-big" aria-hidden="true">${c.n}</span><span class="eyebrow">Capitolo ${c.n} di ${String(E.capitoli.length).padStart(2, "0")}</span>
          <h2 id="g-cap-t">${esc(c.titolo)}</h2><p class="g-sotto">${esc(c.sotto)}</p>
          <div class="g-breve"><span class="g-k">In breve</span><ul>${c.breve.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div>
        <div class="g-foto"><img src="img/${esc(c.img)}" alt="" loading="lazy"><span class="g-fico">${ico(c.ico)}</span></div>
      </header>
      <div class="chips g-indice" aria-label="Sezioni del capitolo">${c.sezioni.map((s, j) => `<a class="chip" href="#${esc(s.id || "s" + j)}" data-vai="${esc(s.id || "s" + j)}">${esc(s.titolo)}</a>`).join("")}</div>
      ${c.sezioni.map(sezione).join("")}
      <div class="g-navcap">${prec ? `<a class="btn btn-s" href="#c-${prec.id}">← ${prec.n} ${esc(prec.titolo)}</a>` : "<span></span>"}${succ ? `<a class="btn btn-p" href="#c-${succ.id}">${succ.n} ${esc(succ.titolo)} <span class="freccia">→</span></a>` : `<a class="btn btn-p" href="materiali.html">Vai ai materiali <span class="freccia">→</span></a>`}</div>
    </article>`;
  };

  const completa = (E) => {
    const id = (location.hash.match(/^#c-([\w-]+)/) || [])[1], c = E.capitoli.find((x) => x.id === id) || E.capitoli[0];
    return `<div class="g-uso"><div><span class="g-k">Come usarla</span><ol>${E.uso.map((x) => `<li>${esc(x)}</li>`).join("")}</ol></div><p class="g-obiettivo">${esc(E.obiettivo)}</p></div>
      ${percorso(E.capitoli, c.id)}${capitolo(E, c)}`;
  };

  const architettura = (f) => {
    const E = G.economia, caps = G.schema.map((s, i) => ({ ...s, id: E.capitoli[i].id, ico: E.capitoli[i].ico, titolo: i === 4 && f.dopo ? `Dopo la laurea · ${f.dopo}` : s.titolo }));
    const hub = f.hub ? (window.UL_CFG?.hub || []).find((h) => h.slug === f.hub) : null;
    return `<div class="g-cantiere"><span class="badge">Architettura · contenuti da scrivere</span>
        <h2>Guida <span class="acc">${esc(f.nome)}</span></h2>
        <p>Stessa struttura della guida di Economia: sei capitoli, dal primo giorno a cosa c’è dopo. I testi li scriviamo con chi studia ${esc(f.nome)}, così non sono deduzioni nostre.</p>
        ${hub ? `<a class="btn btn-s" href="${esc(hub.href)}">Vai all’hub ${esc(hub.nome)} <span class="freccia">→</span></a>` : ""}</div>
      ${percorso(caps, "", false)}
      <div class="g-schema">${caps.map((c) => `<div class="g-scard"><span class="g-ico">${ico(c.ico)}</span><b>${c.n}</b><h4>${esc(c.titolo)}</h4><ul>${c.sezioni.map((s) => `<li>${esc(s)}</li>`).join("")}</ul><span class="g-stato">da scrivere</span></div>`).join("")}</div>
      <aside class="g-box nota"><h4>Vuoi scriverla con noi?</h4><p>Cerchiamo studenti di ${esc(f.nome)} per i primi capitoli: metodo per gli esami del corso, sessione, Erasmus e sbocchi. <a href="community.html">Scrivici dalla Community →</a></p></aside>`;
  };

  const disegna = (scroll) => {
    const f = fac();
    $$("[data-g-fac] [data-fac]").forEach((b) => { const on = b.dataset.fac === f.id; b.classList.toggle("on", on); b.setAttribute("aria-selected", on);
      if (on && b.parentElement.scrollWidth > b.parentElement.clientWidth) b.parentElement.scrollLeft = b.offsetLeft - b.parentElement.offsetLeft - 20; });
    $("[data-g-titolo]") && ($("[data-g-titolo]").textContent = f.nome);
    root.innerHTML = f.stato === "completa" ? completa(G[f.id]) : architettura(f);
    if (scroll) $(".g-percorso", root)?.scrollIntoView({ block: "start" });
  };

  // tab facoltà
  const tabs = $("[data-g-fac]");
  if (tabs) {
    tabs.innerHTML = G.facolta.map((f) => `<button type="button" role="tab" class="g-fbtn" data-fac="${f.id}"><span class="g-fi">${esc(f.ico)}</span><span><b>${esc(f.nome)}</b><small>${f.stato === "completa" ? "Guida completa" : "Architettura"}${f.sotto ? " · " + esc(f.sotto) : ""}</small></span></button>`).join("");
    tabs.addEventListener("click", (e) => {
      const b = e.target.closest("[data-fac]"); if (!b) return;
      mem.set("ul-guida-fac", b.dataset.fac);
      const u = new URL(location.href); u.searchParams.set("facolta", b.dataset.fac); u.hash = ""; history.replaceState(null, "", u);
      disegna(false);
    });
  }

  // salti interni: sezioni (apre le <details>) e capitoli
  root.addEventListener("click", (e) => {
    const a = e.target.closest("[data-vai]"); if (!a) return;
    const t = document.getElementById(a.dataset.vai); if (!t) return;
    e.preventDefault(); if (t.tagName === "DETAILS") t.open = true; t.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  addEventListener("hashchange", () => { if (/^#c-/.test(location.hash)) disegna(true); });
  disegna(/^#c-/.test(location.hash));
})();
