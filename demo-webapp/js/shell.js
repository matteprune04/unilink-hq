/* ../shared/shell.js */
/* ============================================================
   Shell condivisa delle varianti B e C (demo A) — v3: riquadro area/percorso in cima alla sidebar (C.sideHead), colore del cerchio persona.
   Router + protezione rotte + topbar/sidebar configurabili. Solo area personale: si entra dal login.
   Ogni variante chiama UL.shell.start(config) da config.js.
   Nei link si scrive "#/app/esami"; nella barra degli indirizzi diventa "#app.esami"
   (ancora semplice, compatibile con il visualizzatore degli Artifact).
   ============================================================ */
(function () {
  const UL = window.UL;
  const { icon, esc, initials, fullName } = UL.ui;
  UL.views = UL.views || {};

  const SITE = "https://www.unilinkfirenze.it";
  const SITE_LINKS = [{ l: "Dispense", to: SITE + "/dispense" }, { l: "Tools", to: SITE + "/tools" }, { l: "FAQs", to: SITE + "/faq" }];
  const app = { dirty: false, lastHash: "", current: null };
  UL.app = app;
  let C = null;

  const parse = (hash) => (hash || "").replace(/^#\/?/, "").split("/").filter(Boolean);
  const toToken = (path) => "#" + (parse(path).join(".") || "login");
  function currentPath() {
    const h = location.hash || "";
    if (h.startsWith("#/")) return h;
    if (/^#[A-Za-z0-9._~-]+$/.test(h)) return "#/" + h.slice(1).split(".").join("/");
    return "#/login";
  }
  function setUrl(path, replace) {
    try { history[replace ? "replaceState" : "pushState"](null, "", toToken(path)); } catch (e) { /* noop */ }
  }

  async function route(target, force) {
    const hash = target || currentPath();
    if (hash === app.lastHash && !force) return;
    if (app.dirty && hash !== app.lastHash) {
      const ok = await UL.ui.confirmBox("Modifiche non salvate", "Hai modifiche non salvate. Vuoi uscire comunque?", "Esci senza salvare", true);
      if (!ok) { setUrl(app.lastHash, true); return; }
      app.dirty = false;
    }
    app.lastHash = hash;
    setUrl(hash, true);
    document.body.classList.remove("side-open");
    const parts = parse(hash);
    const user = UL.store.currentUser();

    if (parts[0] !== "app") {
      // solo pagine di accesso: la web app parte sempre dal login
      const v = C.publicRoutes[parts[0] || ""] || "login";
      if (user && (v === "login" || v === "register")) return go(user.onboarded || !C.onboarding ? C.home : "#/app/benvenuto");
      return renderPublic(v, user, parts.slice(1));
    }
    if (!user) {
      try { sessionStorage.setItem(C.key + "_after_login", hash); } catch (e) { /* noop */ }
      return go("#/login");
    }
    const page = parts[1] || C.homeKey;
    if (page === "benvenuto" && C.onboarding) return renderPublic(C.onboarding, user, []);
    if (C.onboarding && !user.onboarded) return go("#/app/benvenuto");
    const r = C.appRoutes[page];
    if (!r) return go(C.home);
    if (r.admin && user.role !== "admin") { UL.ui.toast("Sezione riservata al team UniLink", "err"); return go(C.home); }
    renderApp(user, r.view, page, parts.slice(2));
  }

  function go(hash) {
    if (hash !== app.lastHash && !app.dirty) setUrl(hash);
    route(hash, true);
  }
  app.go = go;
  app.refresh = () => route(app.lastHash || currentPath(), true);
  app.afterLogin = (u) => {
    let next = null;
    try { next = sessionStorage.getItem(C.key + "_after_login"); sessionStorage.removeItem(C.key + "_after_login"); } catch (e) { /* noop */ }
    UL.ui.toast(`Bentornato/a, ${u.profile.nome || ""}!`);
    go(C.onboarding && !u.onboarded ? "#/app/benvenuto" : next && next.startsWith("#/app") ? next : C.home);
  };

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#/"]');
    if (a && !e.defaultPrevented && !e.button && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      go(a.getAttribute("href"));
      return;
    }
    const sc = e.target.closest("[data-scroll]");
    if (sc) { e.preventDefault(); const t = document.getElementById(sc.dataset.scroll); t && t.scrollIntoView({ behavior: "smooth", block: "start" }); }
    if (!e.target.closest("[data-dd]")) document.querySelectorAll("[data-dd].open").forEach((x) => x.classList.remove("open"));
    if (document.body.classList.contains("side-open") && !e.target.closest(".sidebar") && !e.target.closest("[data-menu]")) document.body.classList.remove("side-open");
  });

  function renderPublic(key, user, params) {
    const root = document.getElementById("app");
    const v = UL.views[key];
    root.innerHTML = v.render(user, params);
    app.current = null;
    document.title = (typeof v.title === "function" ? v.title(params) : v.title || C.name) + " · unilink";
    v.mount && v.mount(root, user, params);
    bindCommon(root, user);
    window.scrollTo(0, 0);
  }

  function shellHtml(user, active) {
    const p = user.profile;
    const notif = C.notifications ? C.notifications(user) : [];
    const unread = notif.filter((n) => !user.activity.readNotif.includes(n.id)).length;
    const groups = C.nav(user);
    return `
    <header class="topbar">
      <div class="row" style="gap:10px;flex-wrap:nowrap">
        <button class="icon-btn menu-toggle" data-menu aria-label="Apri menu">${icon("menu")}</button>
        <a class="brand" href="${C.home}"><img src="img/logo-blu.png" alt=""><span>unilink</span><small>${esc(C.tag)}</small></a>
      </div>
      <div class="navpill">
        ${SITE_LINKS.map((l) => `<a class="lnk" href="${l.to}" target="_blank" rel="noopener">${esc(l.l)}</a>`).join("")}
        <div class="dropdown" data-dd>
          <button class="icon-btn" style="background:transparent;border-color:rgba(255,255,255,.25);color:#fff" data-dd-btn aria-label="Notifiche">${icon("bell")}${unread ? '<span class="dot"></span>' : ""}</button>
          <div class="dropdown-menu" style="min-width:320px">
            <div class="head"><b class="display" style="color:var(--navy)">Notifiche</b></div>
            ${notif.map((n) => `<a class="notif-item" href="${n.to}" data-nid="${n.id}">${user.activity.readNotif.includes(n.id) ? '<span style="width:8px;flex:none"></span>' : '<span class="b"></span>'}<span>${esc(n.t)}</span></a>`).join("") || '<p class="small muted" style="padding:10px 12px">Nessuna notifica.</p>'}
          </div>
        </div>
        <div class="dropdown" data-dd>
          <button class="user-chip" data-dd-btn><span class="avatar" ${p.colore ? `style="background:${esc(p.colore)}"` : ""}>${esc(initials(p))}</span><span class="nm">${esc(p.nome || "Account")}</span></button>
          <div class="dropdown-menu">
            <div class="head"><b class="display" style="color:var(--navy)">${esc(fullName(p))}</b><div class="small muted">${esc(user.email)}</div>
              ${user.role === "admin" ? '<span class="badge badge-orange" style="margin-top:8px">Admin</span>' : ""}</div>
            ${C.userMenu(user).map((m) => `<a href="${m.to}">${icon(m.i)} ${esc(m.l)}</a>`).join("")}
            <button data-logout>${icon("logout")} Esci</button>
          </div>
        </div>
      </div>
    </header>
    <div class="shell">
      <aside class="sidebar">
        ${C.sideHead ? `<div class="side-foot side-head">${C.sideHead(user)}</div>` : ""}
        <nav class="side-card" aria-label="Sezioni">
          ${groups.map((g) => `<div class="side-group ${g.cls || ""}">${esc(g.g)}</div>${g.items.map((it) => `
            <a class="side-link ${g.cls || ""} ${active === it.k ? "active" : ""}" href="${it.to}">${icon(it.i)}<span>${esc(it.l)}</span>
              ${it.soon ? '<span class="soon">Presto</span>' : ""}${it.badge ? `<span class="cnt">${esc(it.badge)}</span>` : ""}</a>`).join("")}`).join("")}
          <a class="side-link" href="#" data-logout>${icon("logout")}<span>Esci</span></a>
        </nav>
        ${C.sideFoot ? `<div class="side-foot">${C.sideFoot(user)}</div>` : ""}
      </aside>
      <main class="main" id="view"></main>
    </div>
    <div class="draft-flag" title="Demo: i dati restano solo in questo browser">${esc(C.flag)}</div>`;
  }

  function renderApp(user, viewKey, page, params) {
    const root = document.getElementById("app");
    const v = UL.views[viewKey];
    root.innerHTML = shellHtml(user, page);
    const main = root.querySelector("#view");
    main.innerHTML = v.render(user, params);
    document.title = (typeof v.title === "function" ? v.title(params) : v.title) + " · unilink";
    app.current = { viewKey, page, params };
    v.mount && v.mount(main, user, params);
    bindCommon(root, user);
    root.querySelector("[data-menu]").addEventListener("click", () => document.body.classList.toggle("side-open"));
    C.afterRender && C.afterRender(root, user);
    root.querySelectorAll("[data-nid]").forEach((a) => a.addEventListener("click", () => {
      if (!user.activity.readNotif.includes(a.dataset.nid)) { user.activity.readNotif.push(a.dataset.nid); UL.store.save(); }
    }));
    window.scrollTo(0, 0);
  }

  function bindCommon(root, user) {
    root.querySelectorAll("[data-logout]").forEach((b) => b.addEventListener("click", (e) => {
      e.preventDefault();
      UL.store.logout();
      UL.ui.toast("Sei uscito dal tuo account");
      go("#/login");
    }));
    root.querySelectorAll("[data-dd]").forEach((dd) => {
      const b = dd.querySelector("[data-dd-btn]");
      b && b.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = dd.classList.contains("open");
        document.querySelectorAll("[data-dd].open").forEach((x) => x.classList.remove("open"));
        if (!open) dd.classList.add("open");
      });
    });
  }

  window.addEventListener("storage", (e) => { if (e.key && e.key.startsWith(C.key)) app.refresh(); });
  window.addEventListener("hashchange", () => route(currentPath()));
  window.addEventListener("popstate", () => route(currentPath()));
  window.addEventListener("beforeunload", (e) => { if (app.dirty) { e.preventDefault(); e.returnValue = ""; } });

  UL.shell = {
    async start(config) {
      C = config;
      await UL.store.ensureSeed();
      route(currentPath(), true);
    },
    config: () => C,
  };
})();

