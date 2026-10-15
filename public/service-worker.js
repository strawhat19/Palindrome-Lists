const cacheName = `palindrome-lists-v2`;
const offlineFiles = [`/`, `/favicon.svg`, `/manifest.webmanifest`, `/brand/half-turn-pink-lime.svg`];

self.addEventListener(`install`, (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(offlineFiles)));
});

self.addEventListener(`activate`, (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith(`palindrome-lists-`) && key !== cacheName)
        .map((key) => caches.delete(key)),
    )).then(() => self.clients.claim()),
  );
});

self.addEventListener(`fetch`, (event) => {
  if (event.request.method !== `GET` || new URL(event.request.url).origin !== self.location.origin) return;

  const url = new URL(event.request.url);
  const publicPages = [`/`, `/about`, `/words`, `/names`, `/phrases`, `/palindromes`, `/guidelines`, `/terms`, `/privacy`, `/pricing`, `/contact`, `/api`];
  const path = url.pathname.replace(/\/$/, ``) || `/`;
  const publicAsset = /^\/(?:_expo\/static|assets|brand)\//.test(path) || [`/favicon.svg`, `/manifest.webmanifest`].includes(path);
  // Never cache future private account/API responses or auth/query URLs.
  if (url.search || (!publicPages.includes(path) && !publicAsset)) return;

  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.ok && (publicAsset || /text\/html/i.test(response.headers.get(`content-type`) || ``)) && !/no-store|private/i.test(response.headers.get(`cache-control`) || ``)) {
        const snapshot = response.clone();
        event.waitUntil(caches.open(cacheName).then((cache) => cache.put(event.request, snapshot)));
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (event.request.mode === `navigate`) {
        const home = await caches.match(`/`);
        if (home) return home;
      }
      return Response.error();
    }),
  );
});
