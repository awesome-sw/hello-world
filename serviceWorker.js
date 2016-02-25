'use strict';

var version = "one";

self.addEventListener('install', event => {
  console.log('service worker - install | version:', version);
  function onInstall () {
    return caches.open(version)
      .then(cache =>
        cache.addAll([
          'hello.js',
          'index.html'
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

self.addEventListener('fetch', event => {
  var request            = event.request;
  var url                = new URL(request.url);
  console.log('service worker - fetch', url.href);
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
