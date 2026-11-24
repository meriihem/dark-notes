const SHELL_CACHE = "dark-notes-shell-v2";
const FIREBASE_CACHE = "dark-notes-firebase-11-0-2";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key =>
            key.startsWith("dark-notes-shell-") && key !== SHELL_CACHE
          )
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Cache Firebase's versioned browser modules so the app can load them offline
  // after they have been fetched successfully at least once.
  if (
    url.origin === "https://www.gstatic.com" &&
    url.pathname.startsWith("/firebasejs/11.0.2/")
  ) {
    event.respondWith((async () => {
      const cache = await caches.open(FIREBASE_CACHE);
      const cached = await cache.match(request);

      const update = fetch(request).then(response => {
        if (response && response.ok) {
          return cache.put(request, response.clone()).then(() => response);
        }
        return response;
      }).catch(() => null);

      if (cached) {
        event.waitUntil(update.then(() => undefined));
        return cached;
      }

      return (await update) || Response.error();
    })());
    return;
  }

  // App navigation: try the network first, then fall back to the cached app.
  if (url.origin === self.location.origin && request.mode === "navigate") {
    event.respondWith(
      fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          event.waitUntil(
            caches.open(SHELL_CACHE).then(cache => cache.put("./index.html", copy))
          );
        }
        return response;
      }).catch(async () => {
        return (await caches.match("./index.html")) ||
               (await caches.match("./")) ||
               Response.error();
      })
    );
    return;
  }

  // Same-origin static app files: use cache first, then save successful responses.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;

        return fetch(request).then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            event.waitUntil(
              caches.open(SHELL_CACHE).then(cache => cache.put(request, copy))
            );
          }
          return response;
        });
      })
    );
  }
});
