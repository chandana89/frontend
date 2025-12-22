// Only compat libraries are allowed here
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Hardcoded Firebase config (public info)
firebase.initializeApp({
    apiKey: "AIzaSyCdYN-tijzB6DDb9XiJv0h2HeBdZA2Ldr0",
    authDomain: "web-push-notifications-80b69.firebaseapp.com",
    projectId: "web-push-notifications-80b69",
    storageBucket: "web-push-notifications-80b69.firebasestorage.app",
    messagingSenderId: "186115740402",
    appId: "1:186115740402:web:627fbb02cb0fe30901766b",
    measurementId: "G-ZNRCBYZ5ED"
});

const messaging = firebase.messaging();

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received BG message', payload);

    self.registration.showNotification(
        payload.notification?.title ?? 'New Notification',
        {
            body: payload.notification?.body,
            icon: '/logo.svg',
            data: {
                url: '/chat'
            }
        }
    );
});
