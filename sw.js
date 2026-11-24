// VillaBeats - SW v30 - Sí actualiza + Reproductor en su cuadrado
const CACHE = 'villabeats-v30';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
  // JEFE: quité './sw.js' de aquí, jefe.
  // Si lo guardas, el v27, v29 y v30 nunca se actualizan, jefe. Ese era el error.
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      // Borra TODOS los viejos, jefe: v27, v29, etc.
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

  // No cachear el mismo sw.js, jefe - si no, nunca se actualiza
  if (url.pathname.includes('sw.js')) {
    return e.respondWith(fetch(e.request));
  }

  // PARA EL index.html SIEMPRE IR A INTERNET PRIMERO, JEFE
  // Así ya no te sale el reproductor caído viejo, jefe
  if (url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    return e.respondWith(
      fetch(e.request).then((net) => {
        if (e.request.method === 'GET' && url.origin === location.origin) {
          const copy = net.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return net;
      }).catch(() => caches.match('./index.html'))
    );
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
