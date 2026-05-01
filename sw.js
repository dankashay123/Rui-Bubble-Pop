// Bump this version any time you want to force a full cache clear
const CACHE = 'bubble-smash-v5';

const ASSETS = [
  '/Rui-Bubble-Pop/',
  '/Rui-Bubble-Pop/index.html',
  '/Rui-Bubble-Pop/manifest.json',
  '/Rui-Bubble-Pop/icon-192.png',
  '/Rui-Bubble-Pop/icon-512.png'
];

// Install: cache all assets fresh
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  // Take over immediately — don't wait for old SW to die
  self.skipWaiting();
});

// Activate: nuke every old cache
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  // Take control of all open tabs immediately
  self.clients.claim();
});

// Fetch: NETWORK FIRST — always try network, fall back to cache
// This ensures updates are picked up immediately
self.addEventListener('fetch', e => {
  // Only handle GET requests for our own origin
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then(networkResponse => {
        // Got a fresh response — update the cache
        if (networkResponse && networkResponse.status === 200) {
          const cloned = networkResponse.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, cloned));
        }
        return networkResponse;
      })
      .catch(() => {
        // Network failed (offline) — serve from cache
        return caches.match(e.request);
      })
  );
});
