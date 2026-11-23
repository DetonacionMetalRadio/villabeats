self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open('villa-beats-v25').then(c => c.addAll(['./','./index.html?v=25']))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => { if(k!=='villa-beats-v25') return caches.delete(k); })))); self.clients.claim(); });
self.addEventListener('fetch', e => { e.respondWith(fetch(e.request).catch(()=> caches.match(e.request))); });
