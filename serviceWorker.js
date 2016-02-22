'use strict';

self.addEventListener('install', event => {
  console.log('service worker - install');
  function onInstall () {
    return caches.open('static')
      .then(cache =>
        cache.addAll([
          'hello.js',
          'index.html'
        ])
      );
  }

  event.waitUntil(onInstall(event));
});

self.addEventListener('activate', event => {
  console.log('service worker - activate');
});
