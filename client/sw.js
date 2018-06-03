let staticCacheName = "got-static-v0";
let urlsToCache = [
  "./",
  "./register-sw.js",
  "index.html",
  "js/register-sw.js",
  "js/client.js",
  "styles/styles.css",
  "favicon.ico",
  "manifest.json",
  "img/logo-48.png",
  "img/logo-96.png",
  "img/logo-192.png",
  "img/logo-256.png",
  "img/logo-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(staticCacheName)
      .then(cache => cache.addAll(urlsToCache))
      .then(self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(
            cacheName =>
              cacheName.startsWith("got-") && cacheName !== staticCacheName
          )
          .map(cacheName => {
            console.log(
              `⚙️ ServiceWorker Deleting the cached files from ${cacheName} `
            );
            return caches.delete(cacheName);
          })
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
