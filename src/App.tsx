import { useEffect } from "react";
import { messaging } from "./config/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { Route, Routes } from "react-router-dom";
import { PortfolioRoutes } from "./routes";

function App() {
  const FIREBASE_VAPID_KEY = import.meta.env.VITE_VAPID_KEY;

  useEffect(() => {
    const requestPermissionAndGetToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted.');

          console.log(FIREBASE_VAPID_KEY, "VAPID")

          const currentToken = await getToken(messaging, {
            vapidKey: FIREBASE_VAPID_KEY
          });

          if (currentToken) {
            console.log('FCM registration token:', currentToken);
            // send to server
          } else {
            console.log('No registration token available.');
          }
        } else {
          console.log('Notification permission denied.');
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    requestPermissionAndGetToken();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message:', payload);
      alert(`New message: ${payload.notification?.title} - ${payload.notification?.body}`);
    });

    return () => unsubscribe();
  }, []);

  return (

    <Routes>
      {PortfolioRoutes.map(route =>
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        />
      )}
    </Routes>
  )
}

export default App;