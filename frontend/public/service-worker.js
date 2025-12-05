// Minimal service worker: network-first for navigation, cache static assets
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  // Prefer network for HTML navigations (login/register/dashboard)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/'))
    );
    return;
  }

  // For other requests, try cache first then network
  event.respondWith(
    caches.match(request).then(res => res || fetch(request))
  );
});
