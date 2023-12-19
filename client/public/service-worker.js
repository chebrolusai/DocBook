/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// Load Workbox through importScripts
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// Ensure Workbox is available
if (workbox) {
  console.log(`Workbox is loaded.`);

  // Use Workbox's features via the workbox namespace

  // Clients Claim
  workbox.core.clientsClaim();

  // Precaching
  const manualPrecacheList = [
    '/index.html',
    // other assets you want to precache
  ];
  workbox.precaching.precacheAndRoute(manualPrecacheList);

  // Set up App Shell-style routing
  const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
  workbox.routing.registerRoute(
    ({ request, url }) => {
      if (request.mode !== 'navigate') {
        return false;
      }
      if (url.pathname.startsWith('/_')) {
        return false;
      }
      if (url.pathname.match(fileExtensionRegexp)) {
        return false;
      }
      return true;
    },
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // Caching Images
  workbox.routing.registerRoute(
    ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 50 }),
      ],
    })
  );

  // Caching for Doctor Profiles
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('doctorprofile/doctor/'),
    new workbox.strategies.CacheFirst({
      cacheName: 'doctor-profiles',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 201]
        })
      ]
    })
  );

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'document',
    new workbox.strategies.CacheFirst()
  );

  // Skip Waiting
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  // Custom fetch handling, if needed
  self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('doctorprofile/doctor/')) {
      event.respondWith(
        caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return fetch(event.request).then((response) => {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              const responseToCache = response.clone();
              caches.open('doctor-profiles')
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              return response;
            });
          })
      );
    }
  });

} else {
  console.log(`Workbox didn't load`);
}