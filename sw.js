self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open('villa-beats-v26').then(c => c.addAll(['./','./index.html?v=26']))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => { if(k!=='villa-beats-v26') return caches.delete(k); })))); self.clients.claim(); });
self.addEventListener('fetch', e => { e.respondWith(fetch(e.request).catch(()=> caches.match(e.request))); });
