const CACHE_NAME = `蛇梯棋-v1`;

// Use the install event to pre-cache all initial resources.
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      //   cache.addAll(["/"]);
    })()
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Get the resource from the cache.
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      } else {
        try {
          // If the resource was not in the cache, try the network.
          const fetchResponse = await fetch(event.request);

          // Save the resource in the cache and return it.
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        } catch (e) {
          // The network failed.
        }
      }
    })()
  );
});
// Listen to push events.
self.addEventListener("push", (event) => {
  // Check if the user has granted permission to display notifications.
  if (Notification.permission === "granted") {
    // Get the notification data from the server.
    const notificationText = event.data.text();

    // Display a notification.
    const showNotificationPromise = self.registration.showNotification(
      "Sample PWA",
      {
        body: notificationText,
        icon: "icon512.png",
      }
    );

    // Keep the service worker running until the notification is displayed.
    event.waitUntil(showNotificationPromise);
  }
});
