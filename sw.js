const staticCacheName = "site-static";
const assets = [
  "/",
  "/index.html",
  "/scripte/scripte.js",
  "/scripte/grid.js",
  "/scripte/kalender.js",
  "/css/colors.css",
  "/css/style.css",
  "/icons/home.png",
  "/icons/menu.png",
  "/icons/favicon.ico",
  "/icons/favicon.png",
  "/ics/splan01.ics",
  "/ics/splan01ss23.ics",
  "/ics/splan01ws22.ics",
  "/ics/splan61.ics",
  "/ics/splan61ss23.ics",
  "/ics/splan61ws22.ics",
];

// install event
self.addEventListener("install", (evt) => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener("activate", (evt) => {
  //console.log('service worker activated');
});

// fetch event
self.addEventListener("fetch", (evt) => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      return cacheRes || fetch(evt.request);
    })
  );
});
