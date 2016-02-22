'use strict';

window.addEventListener('install', event => {
  console.log('service worker - install');
  // function onInstall () {
  //   return caches.open('static')
  //     .then(cache =>
  //       cache.addAll([
  //         '/hello.js',
  //         '/'
  //       ])
  //     );
  // }

  // event.waitUntil(onInstall(event));
});

window.addEventListener('activate', event => {
  console.log('service worker - activate');
});