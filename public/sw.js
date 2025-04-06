// filepath: d:\dev\games\connections\public\sw.js
// Service Worker for Connections Game - enabling offline play

const CACHE_NAME = 'connections-game-v2'; // Updated version
const CACHE_FILES = [
  '/',
  '/index.html',
  '/games/connections.html',
  '/connections/gameLogic.js',
  '/connections/wordBank.js',
  '/manifest.json',
  '/icons/icon-192x192.svg'
];

// Install event - cache the files needed for offline play
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(CACHE_FILES)
          .catch(error => {
            console.error('Cache addAll error:', error);
            // Continue with whatever files were successfully cached
            return;
          });
      })
  );
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response from the cached version
        if (response) {
          return response;
        }
        
        // Not in cache - fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response - one to return, one to cache
            const responseToCache = networkResponse.clone();
            
            // Add to cache for future offline use
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return networkResponse;
          });
      })
      .catch(() => {
        // If both cache and network fail, show an offline page or handle gracefully
        console.log('Fetch failed - network and cache unavailable');
        
        // Return a fallback for HTML pages if we have it
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Immediately claim all clients so the new service worker takes over right away
  return self.clients.claim();
});