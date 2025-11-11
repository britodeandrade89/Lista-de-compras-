const CACHE_NAME = 'compras-do-mes-cache-v2'; // Bumped version
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  // The main script for tailwind is also essential for the app shell
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // addAll is atomic: if one request fails, the whole operation fails.
        return cache.addAll(URLS_TO_CACHE);
      })
      // By removing .catch(), if addAll fails, the promise will reject,
      // and the service worker installation will correctly fail and retry later.
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Let the browser handle non-GET requests and prevent caching of Firestore API calls.
  if (event.request.method !== 'GET' || event.request.url.includes('firestore.googleapis.com')) {
    return;
  }

  // Use a "cache-first, then network" strategy for all other assets.
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If the resource is in the cache, return it.
        if (cachedResponse) {
          return cachedResponse;
        }

        // If the resource is not in the cache, fetch it from the network.
        return fetch(event.request).then(
          (networkResponse) => {
            // A response is a stream and can only be consumed once.
            // We need to clone it to have one copy for the browser and one for the cache.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Cache the fetched resource.
                // This logic correctly handles opaque responses from CDNs.
                cache.put(event.request, responseToCache);
              });

            // Return the network response to the browser.
            return networkResponse;
          }
        );
      })
  );
});