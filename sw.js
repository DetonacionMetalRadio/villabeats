self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open('villa-beats-v18').then(c => c.addAll(['./','./index.html?v=18']))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => { if(k!=='villa-beats-v18') return caches.delete(k); })))); self.clients.claim(); });
self.addEventListener('fetch', e => { e.respondWith(fetch(e.request).catch(()=> caches.match(e.request))); });
