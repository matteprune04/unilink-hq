// UniLink · service worker minimo: serve solo a rendere l'area installabile come app.
// NON salva le dispense né i dati sul telefono (decisione «non scaricabili»): ogni richiesta va in rete.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
