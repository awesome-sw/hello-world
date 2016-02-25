'use strict';

if ('serviceWorker' in navigator) {

  let register = navigator.serviceWorker.register('serviceWorker.js');
  register.catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
  let subscription = register.then(function(registration) {
    console.log('ServiceWorker registration successful with scope: ', registration.scope);

    return registration.pushManager.getSubscription()
    .then(function(subscription) {
      // If a subscription was found, return it.
      if (subscription) {
        return subscription;
      }

      // Otherwise, subscribe the user
    return registration.pushManager.subscribe({ userVisibleOnly: false });
    });
  }).then(function(subscription) {
    // This is the URL of the endpoint we need to call to get a notification
    console.log(subscription.endpoint);

    var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
    var key = rawKey ?
        btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
        '';
    console.log('key: ', key);

    document.getElementById('sw_controller_link').href = "sendNotification.html?endpoint="+encodeURIComponent(subscription.endpoint)+"&key="+encodeURIComponent(key);
  });

  subscription.catch(function(err) {
    console.log('ServiceWorker subscription failed: ', err);
  });

  navigator.serviceWorker.addEventListener('message', function(e) {
      console.log("sw message", e.data);

      var el = document.getElementsByClassName(e.data)[0];
      el.click();
  });
}
