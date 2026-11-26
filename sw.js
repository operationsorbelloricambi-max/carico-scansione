/* Copia di riserva della pagina sul telefono (app installata, 26/11/2026). Regola: si prende SEMPRE prima dalla rete
   (così gli aggiornamenti arrivano subito); solo se la rete non risponde si usa l'ultima copia salvata. */
const COPIA = "carico-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== self.location.origin || u.pathname.endsWith("versione.txt")) return;
  const chiave = u.origin + u.pathname;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(COPIA).then(k => k.put(chiave, c)); }
      return r;
    }).catch(() => caches.match(chiave).then(r => r || Response.error()))
  );
});
