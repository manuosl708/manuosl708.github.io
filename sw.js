var cacheName = 'hello-pwa';
var filesToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/styles_bookmarks.css',
  '/css/styles_buttons.css',
  '/css/styles_layout.css',
  '/js/main.js',
  '/js/functions.js',
  '/data/click.mp3',
  '/data/confirm.wav',
  '/data/error.wav',
  '/images/click.mp3'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
