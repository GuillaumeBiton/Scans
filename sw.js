// sw.js
const CACHE_NAME = 'inventory-pwa-cache-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/db.js',
    '/js/scanner.js',
    '/js/ui.js',
    'https://unpkg.com/dexie@3/dist/dexie.js',
    'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js'
];

// 1. Installation du Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache ouvert');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

// 2. Interception des requêtes réseau
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si la ressource est dans le cache, on la retourne
                if (response) {
                    return response;
                }
                // Sinon, on effectue la requête réseau
                return fetch(event.request);
            })
    );
});
