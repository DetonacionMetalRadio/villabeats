// VillaBeats - SW v38
const CACHE = 'villabeats-v38';
const FILES = ['./','./index.html','./player.html','./manifest.json','./logo.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.hostname.includes('sonocaster.com')) return e.respondWith(fetch(e.request));
  if (url.pathname.includes('sw.js')) return e.respondWith(fetch(e.request));
  if (url.pathname.endsWith('/') || url.pathname.endsWith('index.html') || url.pathname.endsWith('player.html')) {
    return e.respondWith(fetch(e.request).then((net) => {
      if (e.request.method === 'GET' && url.origin === location.origin) {
        const copy = net.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return net;
    }).catch(() => caches.match(e.request)));
  }
  e.respondWith(caches.match(e.request).then((res) => {
    return res || fetch(e.request).then((net) => {
      if (e.request.method === 'GET' && url.origin === location.origin) {
        const copy = net.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return net;
    }).catch(() => caches.match('./index.html'));
  }));
});
