const CACHE_NAME = 'fokus-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './styles.css',
  './app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Cache addAll error:', err);
        return cache.add('./index.html');
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }

      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();

        if (
          event.request.url.includes('.json') ||
          event.request.url.endsWith('/') ||
          event.request.url.endsWith('.html') ||
          event.request.url.endsWith('.css') ||
          event.request.url.endsWith('.js')
        ) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      }).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});
