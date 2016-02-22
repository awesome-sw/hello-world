'use strict';

if ('serviceWorker' in navigator) {
  // The scope is by default '.'
  // Trying to register a service worker for / or a parent dir will fail
  navigator.serviceWorker.register('serviceWorker.js', { scope: '.'}).then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}
