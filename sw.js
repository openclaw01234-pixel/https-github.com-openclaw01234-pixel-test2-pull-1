/* Service Worker for MX Player Pro PWA - offline support */
const CACHE = 'mxpro-v3-' + new Date().toISOString().slice(0, 10);
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './styles/main.css',
  './styles/player.css',
  './styles/components.css',
  './styles/auth.css',
  './scripts/config.js',
  './scripts/data.js',
  './scripts/storage.js',
  './scripts/app.js',
  './scripts/auth.js',
  './scripts/player.js',
  './scripts/ai-features.js',
  './scripts/gestures.js',
  './scripts/watchparty.js',
  './scripts/search.js',
  './scripts/library.js',
  './scripts/vault.js',
  './scripts/init.js',
  './scripts/pwa.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Bypass cache for video streams
  if (e.request.destination === 'video' || url.pathname.endsWith('.mp4')) return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
