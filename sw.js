// public/sw.js

// eslint-disable-next-line no-restricted-globals
const cacheName = 'christian-library-v1';

// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName)
            .then(function(cache) {
                return cache.addAll([
                    '/',
                    '/static/js/bundle.js',
                    '/static/css/main.css',
                    '/manifest.json'
                ]);
            })
    );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
    );
});

// Добавляем активацию для очистки старых кэшей
// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cache) {
                    if (cache !== cacheName) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});