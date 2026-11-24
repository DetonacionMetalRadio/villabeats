// VILLABEATS - Service Worker v29 - ARREGLA REPRODUCTOR CAIDO
const CACHE_NAME = 'villabeats-v29';
const URLS_TO_CACHE = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
    .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((name) => { if (name !== CACHE_NAME) return caches.delete(name); })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // NO cachear el stream, jefe
  if (url.href.includes('sonocaster') || url.href.includes('stream') || url.href.includes('.mp3') || url.href.includes('icecast') || url.href.includes('shoutcast') || url.href.includes('zeno') || url.href.includes('radio')) {
    return;
  }

  // PARA EL index.html SIEMPRE IR A INTERNET PRIMERO, JEFE
  if (url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request).then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      });
    })
  );
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(self.registration.showNotification(data.title || 'VillaBeats 🎶', {
    body: data.body || '¡Ya estamos al aire en Villa Nueva!',
    icon: './img/logo.png',
    badge: './img/logo.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || './' }
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || './'));
});
