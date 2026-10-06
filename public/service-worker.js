const cacheName = `palindrome-lists-v1`;
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

  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.ok) {
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
