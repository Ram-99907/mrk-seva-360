// Push Notification utilities for MEDI SEVA 360

const VAPID_PUBLIC_KEY = 'BA14q6aFrxSwTVw2PqkwbvcWpLpiGOaNVr7PY3OgmXr0VZrfWTMvx0w6u_gC0Uplm5POCqoWYpegiP1TeURcNjY';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/** Check if push notifications are supported */
export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/** Get current notification permission status */
export function getPermissionStatus(): NotificationPermission {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
}

/** Request notification permission */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  const permission = await Notification.requestPermission();
  return permission;
}

/** Subscribe to push notifications */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // Already subscribed, send to server
      await sendSubscriptionToServer(subscription);
      return subscription;
    }

    // Create new subscription
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
    });

    // Send to server
    await sendSubscriptionToServer(subscription);
    
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push:', error);
    return null;
  }
}

/** Unsubscribe from push */
export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to unsubscribe:', error);
    return false;
  }
}

/** Send subscription to server */
async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
  try {
    await fetch('/api/push-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Failed to send subscription to server:', error);
    // Store locally as fallback
    const subs = JSON.parse(localStorage.getItem('push-subscriptions') || '[]');
    subs.push(subscription.toJSON());
    localStorage.setItem('push-subscriptions', JSON.stringify(subs));
  }
}

/** Send a local notification (on current device) */
export async function sendLocalNotification(title: string, body: string, url?: string): Promise<void> {
  if (Notification.permission !== 'granted') return;
  
  try {
    const registration = await navigator.serviceWorker.ready;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
      body,
      icon: '/logo.jpg',
      badge: '/logo.jpg',
      vibrate: [100, 50, 100],
      tag: 'mediseva-local-' + Date.now(),
      data: { url: url || '/' },
      actions: [
        { action: 'open', title: 'Open' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    };
    await registration.showNotification(title, options);
  } catch {
    // Fallback to basic Notification API
    new Notification(title, {
      body,
      icon: '/logo.jpg',
      tag: 'mediseva-local-' + Date.now(),
    });
  }
}

/** Send push notification to all subscribers via server */
export async function sendPushToAll(title: string, body: string, url?: string): Promise<{ sent: number; failed: number }> {
  try {
    const response = await fetch('/api/push-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, url: url || '/' }),
    });
    
    if (!response.ok) throw new Error('Server error');
    
    const result = await response.json();
    return { sent: result.sent || 0, failed: result.failed || 0 };
  } catch (error) {
    console.error('Failed to send push:', error);
    // Fallback: send local notification
    await sendLocalNotification(title, body, url);
    return { sent: 0, failed: 0 };
  }
}

/** Check if currently subscribed */
export async function isSubscribed(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch {
    return false;
  }
}
