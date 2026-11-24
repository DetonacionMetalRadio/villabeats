// VillaBeats - SW v40 - No guarda index.html viejo, jefe
const CACHE = 'villabeats-v40';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Siempre de internet, jefe. Nada de caché viejo, jefe.
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
