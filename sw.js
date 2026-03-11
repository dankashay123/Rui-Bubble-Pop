const CACHE = 'bubble-smash-v1';
const ASSETS = [
  '/Rui-Bubble-Pop/index.html',
  '/Rui-Bubble-Pop/manifest.json',
  '/Rui-Bubble-Pop/icon-192.png',
  '/Rui-Bubble-Pop/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
