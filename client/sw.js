let staticCacheName = "got-static-v1";
let urlsToCache = [
  "./",
  "index.html",
  "js/register-sw.js",
  "js/client.js",
  "styles/styles.css",
  "styles/animate.css",
  "manifest.json",
  "img/logo.svg",
  "img/logo-512.png",
  "img/logo-256.png",
  "img/logo-192.png",
  "img/logo-96.png",
  "img/logo-48.png",
  "img/logo-24.png",
  "img/favicon.ico",
  "img/favicon-32x32.png",
  "img/favicon-16x16.png",
  "img/warning.svg",
  "img/trophy.svg",
  "img/loser.svg",
  "img/clapping.svg",
  "img/mario.svg",
  "img/mushroom.svg",
  "fonts/RobotoMono-ThinItalic.ttf",
  "fonts/RobotoMono-Thin.ttf",
  "fonts/RobotoMono-Regular.ttf",
  "fonts/RobotoMono-MediumItalic.ttf",
  "fonts/RobotoMono-Medium.ttf",
  "fonts/RobotoMono-LightItalic.ttf",
  "fonts/RobotoMono-Light.ttf",
  "fonts/RobotoMono-Italic.ttf",
  "fonts/RobotoMono-BoldItalic.ttf",
  "fonts/RobotoMono-Bold.ttf"
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
