/* ../shared/auth.js */
/* Login, registrazione e recupero password condivisi dalle varianti B e C.
   Testi e account demo arrivano da UL.CONFIG.auth e UL.DEMO (array). */
(function () {
  const UL = window.UL;
  const { icon, esc } = UL.ui;
  const A = () => UL.CONFIG.auth;

  function artPanel(title, sub) {
    return `
    <section class="auth-art">
      <a class="brand white" href="https://www.unilinkfirenze.it" target="_blank" rel="noopener"><img src="img/logo-white.png" alt=""><span>unilink</span></a>
      <div>
        <h1>${title}</h1>
        <p style="margin-top:16px;max-width:520px;color:rgba(255,255,255,.82);font-size:17px">${esc(sub)}</p>
        <div class="feats">${A().feats.map((f) => `<div class="feat"><b>${icon(f.i)} ${esc(f.t)}</b>${esc(f.d)}</div>`).join("")}</div>
      </div>
      <p class="small" style="color:rgba(255,255,255,.55)"><a href="https://www.unilinkfirenze.it" target="_blank" rel="noopener" style="color:inherit">unilinkfirenze.it</a> · ©2026 · ${esc(UL.CONFIG.auth.flag || "Demo")}</p>
    </section>`;
  }
  const pwField = (name, label, auto) => `
    <div class="field"><label for="${name}">${label}</label>
      <div class="pw-wrap"><input class="input" id="${name}" name="${name}" type="password" autocomplete="${auto}" required>
      <button type="button" data-showpw aria-label="Mostra password">${icon("eye")}</button></div></div>`;
  function bindPw(root) {
    root.querySelectorAll("[data-showpw]").forEach((b) => b.addEventListener("click", () => {
      const i = b.previousElementSibling;
      i.type = i.type === "password" ? "text" : "password";
      b.innerHTML = icon(i.type === "password" ? "eye" : "eyeoff");
    }));
  }

  UL.views.login = {
    title: "Accedi",
    render: () => `
    <div class="auth">
      ${artPanel(A().title, A().sub)}
      <section class="auth-form-wrap"><div class="auth-card">
        <div class="card">
          <span class="sq-label">Area riservata</span>
          <h2 style="margin:10px 0 20px">Accedi</h2>
          <form class="stack" style="gap:16px" novalidate>
            <div class="field"><label for="email">Email</label><input class="input" id="email" name="email" type="email" autocomplete="username" placeholder="nome.cognome@stud.unifi.it"></div>
            ${pwField("password", "Password", "current-password")}
            <label class="check"><input type="checkbox" name="remember" checked> Ricordami</label>
            <div class="form-err" data-err></div>
            <button class="btn btn-primary btn-arrow btn-block" type="submit">Accedi <span class="arr">${icon("arrow")}</span></button>
          </form>
          <div class="or">oppure</div>
          <a class="btn btn-ghost btn-block" href="#/registrati">Crea un account gratuito</a>
        </div>
        <div class="demo-box">
          <div class="row between"><b class="display small" style="color:var(--navy)">Accesso rapido (demo)</b><button class="btn btn-sm btn-ghost" data-reset style="min-height:30px">Ripristina dati demo</button></div>
          <p class="tiny muted" style="margin-top:4px">Account fittizi. I dati restano solo in questo browser: se crei un account usa una password inventata.</p>
          <div class="row">${UL.DEMO.map((d, i) => `<button class="btn btn-sm btn-white" data-demo="${i}">${icon(d.icon)} ${esc(d.label)}</button>`).join("")}</div>
        </div>
      </div></section>
    </div>`,
    mount(root) {
      bindPw(root);
      const f = root.querySelector("form");
      const err = root.querySelector("[data-err]");
      f.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(f);
        if (!fd.get("email") || !fd.get("password")) { err.textContent = "Inserisci email e password."; return; }
        try { UL.app.afterLogin(await UL.store.login(fd.get("email"), fd.get("password"), !!fd.get("remember"))); }
        catch (ex) { err.textContent = ex.message; }
      });
      root.querySelectorAll("[data-demo]").forEach((b) => b.addEventListener("click", async () => {
        const d = UL.DEMO[Number(b.dataset.demo)];
        try { UL.app.afterLogin(await UL.store.login(d.email, d.password, false)); }
        catch (ex) { err.textContent = ex.message + ' Prova "Ripristina dati demo".'; }
      }));
      root.querySelector("[data-reset]").addEventListener("click", async () => {
        if (!(await UL.ui.confirmBox("Ripristinare i dati demo?", "Gli account creati in questo browser per questa variante verranno cancellati.", "Ripristina", true))) return;
        await UL.store.resetDemo();
        UL.ui.toast("Dati demo ripristinati");
      });
    },
  };

  UL.views.register = {
    title: "Crea account",
    render: () => `
    <div class="auth">
      ${artPanel(A().regTitle, A().regSub)}
      <section class="auth-form-wrap"><div class="auth-card"><div class="card">
        <span class="sq-label">Account gratuito</span>
        <h2 style="margin:10px 0 20px">Registrati</h2>
        <form class="stack" style="gap:14px" novalidate>
          <div class="grid-2">
            <div class="field"><label for="nome">Nome</label><input class="input" id="nome" name="nome" autocomplete="given-name"></div>
            <div class="field"><label for="cognome">Cognome</label><input class="input" id="cognome" name="cognome" autocomplete="family-name"></div>
          </div>
          <div class="field"><label for="email">Email</label><input class="input" id="email" name="email" type="email" autocomplete="email" placeholder="nome.cognome@stud.unifi.it"></div>
          ${UL.CONFIG.skipCdsAtRegister ? "" : `<div class="grid-2">
            <div class="field"><label for="cds">Corso di laurea</label><select class="select" id="cds" name="cds"><option value="">Seleziona…</option><option value="EA">Economia Aziendale</option><option value="EC">Economia e Commercio</option></select></div>
            <div class="field"><label for="anno">Anno</label><select class="select" id="anno" name="anno"><option value="">Seleziona…</option><option value="1">I anno</option><option value="2">II anno</option><option value="3">III anno</option></select></div>
          </div>`}
          ${pwField("password", "Password (min. 8 caratteri)", "new-password")}
          <label class="check small"><input type="checkbox" name="privacy"> Accetto l'informativa privacy di UniLink.</label>
          <div class="form-err" data-err></div>
          <button class="btn btn-primary btn-arrow btn-block" type="submit">Crea account <span class="arr">${icon("arrow")}</span></button>
        </form>
        <p class="small muted" style="margin-top:16px;text-align:center">Hai già un account? <a href="#/login" class="display">Accedi</a></p>
      </div></div></section>
    </div>`,
    mount(root) {
      bindPw(root);
      const f = root.querySelector("form");
      const err = root.querySelector("[data-err]");
      f.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = Object.fromEntries(new FormData(f));
        if (!fd.nome || !fd.cognome) return (err.textContent = "Inserisci nome e cognome.");
        if (!/^\S+@\S+\.\S+$/.test(fd.email || "")) return (err.textContent = "Inserisci un'email valida.");
        if (!UL.CONFIG.skipCdsAtRegister && (!fd.cds || !fd.anno)) return (err.textContent = "Seleziona corso e anno.");
        if ((fd.password || "").length < 8) return (err.textContent = "La password deve avere almeno 8 caratteri.");
        if (!fd.privacy) return (err.textContent = "Devi accettare l'informativa privacy.");
        try {
          const u = await UL.store.register(fd);
          if (!UL.shell.config().onboarding) UL.store.markOnboarded(u);
          UL.ui.toast("Account creato!");
          UL.app.go(UL.shell.config().onboarding ? "#/app/benvenuto" : UL.shell.config().home);
        } catch (ex) { err.textContent = ex.message; }
      });
    },
  };

  UL.views.recover = {
    title: "Recupero password",
    render: () => `
    <div class="auth">
      ${artPanel('Recupera <span class="accent">l\'accesso</span>', "Ti invieremo un link per impostare una nuova password.")}
      <section class="auth-form-wrap"><div class="auth-card"><div class="card">
        <h2 style="margin-bottom:16px">Password dimenticata</h2>
        <form class="stack" style="gap:14px" novalidate>
          <div class="field"><label for="email">Email</label><input class="input" id="email" name="email" type="email"></div>
          <div data-msg></div>
          <button class="btn btn-primary btn-block" type="submit">Invia link</button>
        </form>
        <p class="small" style="margin-top:16px;text-align:center"><a href="#/login" class="display">← Torna al login</a></p>
      </div></div></section>
    </div>`,
    mount(root) {
      root.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        root.querySelector("[data-msg]").innerHTML = `<div class="banner" style="margin:0">${icon("mail")}<span>Demo: nessuna email viene inviata davvero.</span></div>`;
      });
    },
  };
})();

