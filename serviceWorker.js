'use strict';

var version = "hello";

self.addEventListener('install', event => {
  console.log('service worker - install | version:', version);
  function onInstall () {
    return caches.open(version)
      .then(cache =>
        cache.addAll([
          'hello.js',
          'index.html',
          '/hello-world/'
        ])
      );
  }

  // Skip waiting. Activate immediately.
  event.waitUntil(
    onInstall()
     .then( () => self.skipWaiting() )
  );
});

self.addEventListener('activate', event => {
  console.log('service worker - activate | version:', version);

  function onActivate() {
    return caches.keys().then(cacheKeys => {
      var oldCacheKeys = cacheKeys.filter(key =>
        key.indexOf(version) !== 0
      );
      var deletePromises = oldCacheKeys.map(oldKey => caches.delete(oldKey));
      return Promise.all(deletePromises);
    });
  }

  event.waitUntil(
    onActivate()
     .then( () => self.clients.claim() ) // This makes the SW take effect immediately
  );
});

function addToCache (cacheKey, request, response) {
  console.log("adding to cache:", request.url, response.ok);
  if (response.ok) {
    // We may get a response, that is not OK.
    // Such as a 404    

    // Create a copy of the response to put in the cache
    var copy = response.clone();
    caches.open(cacheKey).then( cache => {
      cache.put(request, copy);
    });

    // Return the response
    return response;
  }

  // The response is a 404 or other error
}

function fetchFromCache (event) {
  // Search for a response in all caches
  return caches.match(event.request).then(response => {
    if (!response) {
      // A synchronous error that will kick off the catch handler
      throw Error(`${event.request.url} not found in cache`);
    }
    // Return the response
    return response;
  });
}

self.addEventListener('fetch', event => {
  var request            = event.request;
  var url                = new URL(request.url);
  console.log('service worker - fetch', url.href);

  if (url.pathname.indexOf('serviceWorker.js') != -1 ||
      (url.hostname != 'localhost' && url.hostname != 'awesome-sw.github.io'))
    return;

  event.respondWith(
    fetch(request).then(response => addToCache(version, request, response))
                  .catch(() => fetchFromCache(event))
    );
});

self.addEventListener('push', function(event) {
  var payload = event.data ? event.data.text() : 'Hello world';
  console.log('service worker - push', payload);

  if (payload.indexOf('notify:') == 0) {
    payload = payload.slice(7);
    event.waitUntil(
      // There are many other possible options, for an exhaustive list see the specs:
      //   https://notifications.spec.whatwg.org/
      self.registration.showNotification('PragueJS Service workers', {
        body: payload,
        icon: 'logo.png',
        vibrate: [500, 100, 500],
      })
    );
  } else {
    self.clients.matchAll().then(function(clients) {
      clients.forEach(function(client) {
        console.log(client);
        client.postMessage(payload);
      });
    });
  }
});
