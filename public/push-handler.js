// Push notification handler - imported by the service worker
self.addEventListener('push', function(event) {
  let data = { title: 'MEDI SEVA 360', body: 'New notification', url: '/' };
  
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    data.body = event.data ? event.data.text() : 'New notification';
  }

  const options = {
    body: data.body || 'New notification from MEDI SEVA 360',
    icon: '/logo.jpg',
    badge: '/logo.jpg',
    vibrate: [100, 50, 100],
    tag: data.tag || 'mediseva-notification-' + Date.now(),
    renotify: true,
    requireInteraction: false,
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
    },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'MEDI SEVA 360', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Focus existing window if available
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', function(event) {
  // Analytics could go here
});
