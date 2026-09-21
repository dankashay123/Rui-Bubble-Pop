// Bump this version any time index.html changes.
const CACHE = 'ruis-reef-v11';

// Derive the base path from where this worker lives, so renaming the repo
// does not silently break the precache list.
const BASE = new URL('./', self.location).pathname;
const PAGE = BASE + 'index.html';

const ASSETS = [
  BASE,
  PAGE,
  BASE + 'manifest.json',
  BASE + 'icon-180.png',
  BASE + 'icon-192.png',
  BASE + 'icon-512.png'
];

// The display fonts live on Google's CDN. Without them cached up front, the very
// first launch with no network falls back to a system face.
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Bubblegum+Sans&display=swap';
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

async function precacheFonts(cache) {
  try {
    const res = await fetch(FONT_CSS, { mode: 'cors' });
    if (!res || !res.ok) return;
    const css = await res.clone().text();
    await cache.put(FONT_CSS, res);
    // The stylesheet names the actual font files, and which ones depends on the
    // browser asking, so read them back out rather than guessing.
    const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(m => m[1]);
    await Promise.all(urls.map(async u => {
      try {
        const f = await fetch(u, { mode: 'cors' });
        if (f && f.ok) await cache.put(u, f);
      } catch (e) {}
    }));
  } catch (e) {}
}

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
    await precacheFonts(cache);   // best effort: never fail the install over fonts
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function tellClients(msg) {
  const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  cs.forEach(c => c.postMessage(msg));
}

// Refresh a cache entry in the background. For the page itself, compare the new
// body against the old one so the app can be told an update is waiting.
async function revalidate(cache, key, req, isPage) {
  let res;
  try { res = await fetch(req, { cache: 'no-store' }); } catch (e) { return; }
  if (!res || !res.ok) return;
  if (isPage) {
    const old = await cache.match(key);
    const fresh = await res.clone().text();
    await cache.put(key, res);
    if (old) {
      const prev = await old.text();
      if (prev !== fresh) tellClients({ type: 'update-ready' });
    }
  } else {
    await cache.put(key, res);
  }
}

// Stale-while-revalidate: answer from the cache immediately so the app opens at
// once even on a dead or captive network, then quietly refresh behind it. A
// network-first worker has to wait out a timeout before it can fall back, which
// is the difference between opening instantly and hanging in the car.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }

  const sameOrigin = url.origin === self.location.origin;
  const isFont = FONT_HOSTS.includes(url.hostname);
  if (!sameOrigin && !isFont) return;          // anything else goes straight to the network

  // A navigation to the directory, the page, or any deep link resolves to the
  // one page this app has, so it still opens offline.
  const isPage = req.mode === 'navigate' || url.pathname === PAGE || url.pathname === BASE;
  const key = isPage ? PAGE : req;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(key);
    if (hit) {
      e.waitUntil(revalidate(cache, key, req, isPage));
      return hit;
    }
    try {
      const res = await fetch(req);
      if (res && res.ok) e.waitUntil(cache.put(key, res.clone()).catch(() => {}));
      return res;
    } catch (err) {
      const page = await cache.match(PAGE);
      if (isPage && page) return page;
      return Response.error();
    }
  })());
});
