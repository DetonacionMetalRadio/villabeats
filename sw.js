// VillaBeats - SW v55 - Sin carrusel
const CACHE = 'villabeats-v55';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  if(url.includes('sonocaster') || url.includes('player.html') || url.includes('stream') || url.includes('.mp3')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
