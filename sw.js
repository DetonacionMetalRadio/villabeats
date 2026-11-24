// VillaBeats - SW v27 - Con Banner Tarde Navideña
const CACHE = 'villabeats-v27';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './sw.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // No cachear el player de Sonocaster, jefe - siempre en vivo
  if (url.hostname.includes('sonocaster.com')) {
    return e.respondWith(fetch(e.request));
  }
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).then((net) => {
        if (e.request.method === 'GET' && url.origin === location.origin) {
          const copy = net.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return net;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
