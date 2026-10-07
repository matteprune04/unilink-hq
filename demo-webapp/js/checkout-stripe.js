/* checkout-stripe.js — CHECKOUT STRIPE SIMULATO (uguale in demo-landing/ e demo-webapp/js/).
   Mostra come si vedrà il pagamento con Stripe Checkout (proposta «Sistema di pagamento · Stripe»):
   1 l'utente clicca «Acquista» (landing/Framer o area personale) → si apre la pagina di pagamento di Stripe
     (carta, Apple Pay, Google Pay, Klarna);
   2 a pagamento riuscito Stripe manda il webhook «checkout.session.completed» a Supabase;
   3 Supabase registra l'ordine sull'email e sblocca subito la dispensa, il pacchetto o Plus sul profilo.
   Nella demo NON si inseriscono dati veri: la carta è quella di prova di Stripe (4242…), sola lettura; nessun addebito.
   Tariffe (Stripe Italia, carte UE standard, Apple Pay e Google Pay): 1,5% + 0,25 € per transazione, 0 € al mese.
   Si cambiano qui sotto (TARIFFA). Uso: UL_CHECKOUT.apri({ voci: [{ nome, nota, prezzo }], email, cosa, dove, onPagato, dopo }) */
(function () {
  const TARIFFA = { perc: 0.015, fisso: 0.25, mese: 0 };
  const eur = (n) => (Math.round(n * 100) / 100).toFixed(2).replace(".", ",") + " €";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const commissione = (p) => Math.round((p * TARIFFA.perc + TARIFFA.fisso) * 100) / 100;
  const CSS = `
  .sx-bg{position:fixed;inset:0;z-index:9999;background:rgba(23,37,84,.55);display:flex;align-items:center;justify-content:center;padding:16px;font-family:inherit;animation:sxIn .18s ease}
  @keyframes sxIn{from{opacity:0}to{opacity:1}}
  .sx{width:min(920px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#fff;border-radius:22px;display:grid;grid-template-columns:1fr 1.1fr;box-shadow:0 30px 80px rgba(0,0,0,.3);color:#172554}
  .sx *{box-sizing:border-box;font-family:inherit}
  .sx-l{background:#f4f1ea;padding:28px;display:flex;flex-direction:column;gap:14px;border-radius:22px 0 0 22px}
  .sx-r{padding:28px;display:flex;flex-direction:column;gap:14px}
  .sx-top{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .sx-back{border:0;background:none;color:#172554;font-size:15px;cursor:pointer;padding:0}
  .sx-test{background:#cf7527;color:#fff;font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:3px 9px;border-radius:99px}
  .sx-tot{font-size:38px;line-height:1}
  .sx-k{font-size:12px;color:#5b6478;text-transform:uppercase;letter-spacing:.06em}
  .sx-voci{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
  .sx-voci li{display:flex;justify-content:space-between;gap:12px;font-size:14px}
  .sx-voci li>span:last-child,.sx-sum b{white-space:nowrap}
  .sx-voci small{display:block;color:#5b6478;font-size:12px}
  .sx-sum{border-top:1px solid rgba(23,37,84,.15);padding-top:10px;display:flex;justify-content:space-between;font-size:15px}
  .sx-fine{margin-top:auto;font-size:12px;color:#5b6478;line-height:1.5}
  .sx-x{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .sx-pay{height:46px;border-radius:10px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px}
  .sx-apple{background:#000;color:#fff;border:0}.sx-google{background:#fff;color:#3c4043;border:1px solid #dadce0}
  .sx-or{display:flex;align-items:center;gap:10px;color:#5b6478;font-size:12px}.sx-or:before,.sx-or:after{content:"";flex:1;height:1px;background:rgba(23,37,84,.15)}
  .sx label{font-size:13px;display:block;margin-bottom:5px}
  .sx input{width:100%;height:42px;border:1px solid rgba(23,37,84,.2);border-radius:10px;padding:0 12px;font-size:15px;color:#172554;background:#fff}
  .sx input[readonly]{background:#f7f7f9;color:#3a4256}
  .sx-met{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .sx-met button{border:1px solid rgba(23,37,84,.2);background:#fff;border-radius:10px;padding:10px 6px;font-size:13px;cursor:pointer;color:#172554}
  .sx-met button.on{border-color:#172554;box-shadow:0 0 0 1px #172554}
  .sx-carta{display:grid;grid-template-columns:1fr 1fr;gap:0}
  .sx-carta input{border-radius:0}.sx-carta input:first-child{grid-column:1/-1;border-radius:10px 10px 0 0;border-bottom:0}
  .sx-carta input:nth-child(2){border-radius:0 0 0 10px;border-right:0}.sx-carta input:nth-child(3){border-radius:0 0 10px 0}
  .sx-note{font-size:12px;color:#5b6478;line-height:1.45}
  .sx-go{height:50px;border:0;border-radius:99px;background:#172554;color:#fff;font-size:17px;cursor:pointer}
  .sx-go:disabled{opacity:.5;cursor:default}
  .sx-klarna{background:#ffb3c7;color:#17120f;border-radius:12px;padding:14px;font-size:14px}
  .sx-passi{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
  .sx-passi li{display:grid;grid-template-columns:30px 1fr;gap:10px;align-items:start;opacity:.35;transition:opacity .3s}
  .sx-passi li.on{opacity:1}
  .sx-passi i{width:30px;height:30px;border-radius:50%;background:#e8e2d6;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:14px}
  .sx-passi li.ok i{background:#2f8f5b;color:#fff}
  .sx-passi b{font-weight:400;font-size:15px}.sx-passi small{display:block;color:#5b6478;font-size:12px;margin-top:2px}
  .sx-code{font-family:ui-monospace,Consolas,monospace!important;font-size:12px;background:#172554;color:#f4f1ea;border-radius:10px;padding:10px 12px;white-space:pre-wrap;line-height:1.45}
  .sx-dq{background:#fff;border:1px dashed rgba(23,37,84,.3);border-radius:12px;padding:12px;font-size:13px}
  .sx-dq summary{cursor:pointer}
  .sx-dq table{width:100%;border-collapse:collapse;margin-top:8px}.sx-dq td{padding:4px 0;border-bottom:1px solid rgba(23,37,84,.08)}.sx-dq td:last-child{text-align:right}
  @media (max-width:760px){.sx{grid-template-columns:1fr}.sx-l{border-radius:22px 22px 0 0}.sx-tot{font-size:30px}}`;
  let stile = false;
  const metti = () => { if (stile) return; const s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s); stile = true; };

  // riquadro «Dietro le quinte» per i founder: commissione Stripe e incasso netto
  const dietro = (tot, metodo) => `<details class="sx-dq"><summary><b style="font-weight:400">Dietro le quinte · per i founder</b></summary><table>
    <tr><td>Pagato dallo studente</td><td>${eur(tot)}</td></tr>
    <tr><td>Commissione Stripe (${(TARIFFA.perc * 100).toString().replace(".", ",")}% + ${eur(TARIFFA.fisso)})</td><td>− ${eur(commissione(tot))}</td></tr>
    <tr><td><b style="font-weight:400">Incasso netto UniLink</b></td><td><b style="font-weight:400">${eur(tot - commissione(tot))}</b></td></tr></table>
    <p class="sx-note" style="margin-top:8px">${metodo === "klarna" ? "Con Klarna la commissione è più alta di quella delle carte: va verificata sul listino Stripe Italia. " : ""}Una sola transazione anche se nel carrello ci sono più esami: la quota fissa si paga una volta. Canone mensile Stripe: ${eur(TARIFFA.mese)}. Carte premium, aziendali o non UE costano qualcosa in più.</p></details>`;

  function apri(o) {
    metti();
    const voci = o.voci || [], tot = Math.round(voci.reduce((n, v) => n + (+v.prezzo || 0), 0) * 100) / 100;
    let metodo = "carta";
    const bg = document.createElement("div");
    bg.className = "sx-bg"; bg.setAttribute("role", "dialog"); bg.setAttribute("aria-modal", "true"); bg.setAttribute("aria-label", "Pagamento con Stripe (simulato)");
    const chiudi = () => { bg.remove(); document.removeEventListener("keydown", esc_); };
    const esc_ = (e) => { if (e.key === "Escape" && !bg.dataset.lock) { chiudi(); o.onAnnulla && o.onAnnulla(); } };
    const sinistra = `<div class="sx-l"><div class="sx-top"><button type="button" class="sx-back" data-sx-x>← UniLink</button><span class="sx-test">Modalità test · demo</span></div>
      <div><div class="sx-k">Paghi a UniLink</div><div class="sx-tot">${eur(tot)}</div></div>
      <ul class="sx-voci">${voci.map((v) => `<li><span>${esc(v.nome)}${v.nota ? `<small>${esc(v.nota)}</small>` : ""}</span><span>${eur(v.prezzo)}</span></li>`).join("")}</ul>
      <div class="sx-sum"><span>Totale</span><b style="font-weight:400">${eur(tot)}</b></div>
      <p class="sx-note">Pagamento unico, nessun rinnovo automatico. Ricevuta via email.</p>
      <p class="sx-fine">Pagina di pagamento gestita da Stripe: UniLink non vede né salva i dati della carta.<br>Questa è una simulazione della demo: non avviene nessun addebito.</p></div>`;
    const modulo = () => `<div class="sx-x"><button type="button" class="sx-pay sx-apple" data-sx-paga="apple">Apple Pay</button><button type="button" class="sx-pay sx-google" data-sx-paga="google">Google Pay</button></div>
      <div class="sx-or">oppure</div>
      <div><label for="sx-mail">Email</label><input id="sx-mail" type="email" value="${esc(o.email || "")}" ${o.email ? "readonly" : ""} placeholder="nome.cognome@stud.unifi.it" autocomplete="off"></div>
      <div><label>Metodo di pagamento</label><div class="sx-met">${[["carta", "Carta"], ["klarna", "Klarna"], ["paypal", "PayPal"]].map(([k, l]) => `<button type="button" data-sx-m="${k}" class="${metodo === k ? "on" : ""}" ${k === "paypal" ? 'disabled title="Da decidere"' : ""}>${l}${k === "paypal" ? " ·<br><small>da decidere</small>" : ""}</button>`).join("")}</div></div>
      ${metodo === "carta" ? `<div><label>Dati della carta</label><div class="sx-carta"><input readonly value="4242 4242 4242 4242" aria-label="Numero carta di prova"><input readonly value="12 / 34" aria-label="Scadenza"><input readonly value="123" aria-label="CVC"></div>
          <p class="sx-note" style="margin-top:6px">Carta di prova di Stripe, già inserita: nella demo non si scrivono carte vere. Visa, Mastercard, Maestro.</p></div>`
        : `<div class="sx-klarna"><b style="font-weight:400">Paga con Klarna</b><br>Subito oppure in 3 rate senza interessi${tot >= 30 ? ` (3 × ${eur(tot / 3)})` : ""}, se l'importo lo consente: Klarna valuta la richiesta al momento.</div>`}
      <button type="button" class="sx-go" data-sx-paga="${metodo}">Paga ${eur(tot)}</button>
      ${o.dove === "landing" ? '<p class="sx-note">Dopo il pagamento entri (o crei l\'account) con la stessa email: trovi già tutto sbloccato.</p>' : ""}`;
    const disegna = () => { bg.innerHTML = `<div class="sx">${sinistra}<div class="sx-r">${modulo()}</div></div>`; lega(); };
    const lega = () => {
      bg.querySelectorAll("[data-sx-x]").forEach((b) => (b.onclick = () => { chiudi(); o.onAnnulla && o.onAnnulla(); }));
      bg.querySelectorAll("[data-sx-m]").forEach((b) => (b.onclick = () => { metodo = b.dataset.sxM; disegna(); }));
      bg.querySelectorAll("[data-sx-paga]").forEach((b) => (b.onclick = () => {
        const mail = bg.querySelector("#sx-mail"), em = (mail.value || "").trim();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { mail.focus(); mail.style.borderColor = "#cf7527"; return; }
        paga(b.dataset.sxPaga, em);
      }));
    };
    const NOMI = { carta: "carta Visa •••• 4242", apple: "Apple Pay", google: "Google Pay", klarna: "Klarna (3 rate)" };
    function paga(m, email) {
      bg.dataset.lock = "1";
      const r = bg.querySelector(".sx-r");
      r.innerHTML = `<div class="sx-k">Pagamento</div><ul class="sx-passi">
        <li><i>1</i><div><b>Stripe autorizza il pagamento</b><small>${esc(NOMI[m] || m)} · ${eur(tot)}</small></div></li>
        <li><i>2</i><div><b>Webhook a Supabase</b><small>Stripe avvisa il backend della web app: evento «checkout.session.completed»</small></div></li>
        <li><i>3</i><div><b>Sbloccato sul profilo</b><small>${esc(o.cosa || voci.map((v) => v.nome).join(", "))} · ${esc(email)}</small></div></li></ul>
        <div class="sx-code" hidden data-sx-code>POST /functions/v1/stripe-webhook
type: checkout.session.completed
customer_email: ${esc(email)}
amount_total: ${Math.round(tot * 100)} (centesimi) · ${esc(m)}
→ ordini.insert · accessi.sblocca(${esc(voci.map((v) => v.id || v.nome).join(", "))})</div>
        <div data-sx-fine hidden style="display:flex;flex-direction:column;gap:12px"><p style="margin:0;font-size:20px">Pagamento riuscito ✓</p>
        <p class="sx-note" style="margin:0">${o.dove === "landing" ? `Ricevuta inviata a ${esc(email)}. Entra nell'area personale con questa email: è già tutto sbloccato.` : "Ricevuta inviata via email. Lo trovi già nella tua area."}</p>
        ${dietro(tot, m)}
        <button type="button" class="sx-go" data-sx-ok>${esc(o.dopo || "Fatto")}</button></div>`;
      const li = r.querySelectorAll(".sx-passi li"), passo = (i) => { li.forEach((x, k) => { x.classList.toggle("on", k <= i); x.classList.toggle("ok", k < i || i === 3); if (k < i || i === 3) x.querySelector("i").textContent = "✓"; }); };
      passo(0);
      setTimeout(() => passo(1), 700);
      setTimeout(() => { passo(2); r.querySelector("[data-sx-code]").hidden = false; }, 1400);
      setTimeout(() => { passo(3); r.querySelector("[data-sx-fine]").hidden = false; r.querySelector("[data-sx-fine]").style.display = "flex";
        try { o.onPagato && o.onPagato({ metodo: m, email, totale: tot, commissione: commissione(tot) }); } catch (e) { console.error(e); }
        r.querySelector("[data-sx-ok]").onclick = () => { chiudi(); o.onFatto && o.onFatto(); };
        delete bg.dataset.lock; }, 2300);
    }
    document.addEventListener("keydown", esc_);
    disegna();
    document.body.appendChild(bg);
    const f = bg.querySelector(o.email ? ".sx-go" : "#sx-mail"); f && f.focus();
  }
  window.UL_CHECKOUT = { apri, commissione, tariffa: TARIFFA, eur };
})();
