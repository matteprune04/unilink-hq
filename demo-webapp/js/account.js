/* ../shared/account.js */
/* Profilo e account: condiviso dalle varianti B, C e D.
   I campi accademici si adattano alla variante tramite UL.CONFIG.accountFields(user) (facoltativo). */
(function () {
  const UL = window.UL;
  const { icon, esc } = UL.ui;

  const baseFields = (p) => `
    <div class="field"><label for="ac-nome">Nome</label><input class="input" id="ac-nome" name="nome" value="${esc(p.nome)}"></div>
    <div class="field"><label for="ac-cognome">Cognome</label><input class="input" id="ac-cognome" name="cognome" value="${esc(p.cognome)}"></div>
    <div class="field"><label for="ac-citta">Città</label><input class="input" id="ac-citta" name="citta" value="${esc(p.citta)}"></div>
    <div class="field"><label for="ac-tel">Telefono (facoltativo)</label><input class="input" id="ac-tel" name="telefono" type="tel" value="${esc(p.telefono)}"></div>`;
  const academic = (p) => `
    <div class="field"><label for="ac-cds">Corso di laurea</label><select class="select" id="ac-cds" name="cds">${[["EA", "Economia Aziendale"], ["EC", "Economia e Commercio"]].map(([k, l]) => `<option value="${k}" ${p.cds === k ? "selected" : ""}>${l}</option>`).join("")}</select></div>
    <div class="field"><label for="ac-anno">Anno</label><select class="select" id="ac-anno" name="anno">${[["1", "I anno"], ["2", "II anno"], ["3", "III anno"], ["FC", "Fuori corso"]].map(([k, l]) => `<option value="${k}" ${String(p.anno) === k ? "selected" : ""}>${l}</option>`).join("")}</select></div>
    <div class="field"><label for="ac-matr">Matricola</label><input class="input" id="ac-matr" name="matricola" value="${esc(p.matricola)}" inputmode="numeric"></div>`;

  UL.views.account = {
    title: "Profilo e account",
    render(user) {
      const p = user.profile;
      const extra = UL.CONFIG.accountFields ? UL.CONFIG.accountFields(user) : academic(p);
      return `
      <div class="page-head"><div><div class="eyebrow">${icon("user")} Account</div><h1>Profilo e <span class="accent">account</span></h1><p class="lead">Le tue informazioni personali. Solo tu puoi vederle.</p></div></div>
      <div class="grid g-ov">
        <section class="card c-7"><div class="card-head"><h3>${icon("user")} Informazioni personali</h3></div>
          <form class="grid-2" data-prof>${baseFields(p)}${extra}
            <div class="field span-2"><label>Email</label><input class="input" value="${esc(user.email)}" readonly></div>
            <div><button class="btn btn-primary" type="submit">${icon("check")} Salva</button></div></form></section>
        <section class="c-5 stack">
          <div class="card"><div class="card-head"><h3>${icon("lock")} Cambia password</h3></div>
            <form class="stack" style="gap:12px" data-pw>
              <div class="field"><label for="pw-old">Password attuale</label><input class="input" id="pw-old" type="password" name="old" autocomplete="current-password"></div>
              <div class="field"><label for="pw-n1">Nuova password (min. 8)</label><input class="input" id="pw-n1" type="password" name="n1" autocomplete="new-password"></div>
              <div class="form-err" data-err></div><button class="btn btn-ghost" type="submit">Aggiorna password</button></form></div>
          <div class="card"><div class="card-head"><h3>${icon("db")} I tuoi dati</h3></div>
            <div class="row"><button class="btn btn-ghost btn-sm" data-export>${icon("file")} Esporta i miei dati</button><button class="btn btn-danger btn-sm" data-delete>${icon("trash")} Elimina account</button></div>
            <p class="tiny muted" style="margin-top:12px">Demo: i dati restano solo in questo browser.</p>
            <button class="btn btn-sm btn-ghost" style="margin-top:10px" data-reset>${icon("alert")} Ripristina dati demo</button></div>
        </section>
      </div>`;
    },
    mount(root, user) {
      root.querySelector("[data-prof]").addEventListener("submit", (e) => {
        e.preventDefault();
        Object.assign(user.profile, Object.fromEntries(new FormData(e.target)));
        UL.store.addLog(user, "profilo", "Profilo aggiornato");
        UL.store.save(); UL.ui.toast("Profilo salvato"); UL.app.refresh();
      });
      root.querySelector("[data-pw]").addEventListener("submit", async (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.target));
        const err = root.querySelector("[data-err]");
        if ((d.n1 || "").length < 8) return (err.textContent = "La nuova password deve avere almeno 8 caratteri.");
        try { await UL.store.changePassword(user, d.old, d.n1); e.target.reset(); err.textContent = ""; UL.ui.toast("Password aggiornata"); }
        catch (ex) { err.textContent = ex.message; }
      });
      root.querySelector("[data-export]").addEventListener("click", () => UL.ui.offerText("I tuoi dati", "unilink_i_miei_dati.json", JSON.stringify(UL.store.exportUser(user), null, 2), "application/json"));
      root.querySelector("[data-delete]").addEventListener("click", async () => {
        if (!(await UL.ui.confirmBox("Eliminare l'account?", "Tutti i tuoi dati verranno cancellati definitivamente.", "Elimina", true))) return;
        UL.store.deleteAccount(user); UL.ui.toast("Account eliminato"); UL.app.go("#/login");
      });
      root.querySelector("[data-reset]").addEventListener("click", async () => {
        if (!(await UL.ui.confirmBox("Ripristinare i dati demo?", "Account e modifiche di questa variante verranno sostituiti dagli account demo.", "Ripristina", true))) return;
        await UL.store.resetDemo(); UL.ui.toast("Dati demo ripristinati"); UL.app.go("#/login");
      });
    },
  };
})();


/* v18 (audit UX, C5): gli ordini stanno nel profilo, non in una voce di menu a parte */
(function () {
  const UL = window.UL, A = UL.views.account; if (!A || A._ordini) return;
  const r0 = A.render.bind(A); A._ordini = true;
  A.render = function (u, p) { const AQ = UL.views.acquistiB; if (!AQ) return r0(u, p); const ord = AQ.render(u).replace(/^\s*<div class="page-head">[\s\S]*?<\/div><\/div>/, ""); return r0(u, p) + `<section style="margin-top:28px"><h2 style="margin-bottom:12px">I tuoi <span class="accent">ordini</span></h2>${ord}</section>`; };
})();
