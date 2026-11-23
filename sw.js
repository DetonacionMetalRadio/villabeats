self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open('villa-beats-v12').then(c => c.addAll(['./','./index.html?v=12']))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => { if(k!=='villa-beats-v12') return caches.delete(k); })))); self.clients.claim(); });
self.addEventListener('fetch', e => { e.respondWith(fetch(e.request).catch(()=> caches.match(e.request))); });
