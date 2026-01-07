import { createContext, useCallback, useEffect, useState } from "react";
import { messaging } from "./config/firebase";
import { getToken, MessagePayload, onMessage } from "firebase/messaging";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { PortfolioRoutes } from "./routes";
import { AppNotification, NotificationContextType } from "./models/notification";
import { api } from "./api";
import { AccountStatus, Status } from "./hooks/auth";
import { useStore } from "./store";

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function App() {
  const FIREBASE_VAPID_KEY = import.meta.env.VITE_VAPID_KEY;

  const loc = useLocation();
  const store = useStore();
  const navigate = useNavigate();
  const [authorised, setAuthorised] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {

    //* Exempt routes below from protection as they are public routes
    if (loc.pathname.match(/^\/(login|logout)/)) {
      return;
    }

    switch (Status()) {
      case AccountStatus.LoggedOut:
        navigate('/login');
        break;
      default:
        setAuthorised(true);
    }
  }, [loc.pathname]);

  const markAllAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const addNotification = useCallback((notif: AppNotification) => {
    setNotifications((prev) => [notif, ...prev]);
    setUnreadCount((prev) => prev + 1);
  }, []);

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
          await api.SaveToken(store.user!, currentToken).then(() => {
            console.log('Token sent to server successfully!')
          })
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

  const unsubscribe = onMessage(messaging, (payload: MessagePayload) => {
    const newNotif: AppNotification = {
      title: payload.notification?.title,
      body: payload.notification?.body,
      image: payload.notification?.image,
      receivedAt: Date.now(),
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setUnreadCount((prev) => prev + 1);
  });

  useEffect(() => {
    requestPermissionAndGetToken();
    return () => unsubscribe();
  }, []);

  return (

    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, addNotification }}>
      <Routes>
        {PortfolioRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element({ authorised })}
          />
        ))}
      </Routes>
    </NotificationContext.Provider>
  )
}

export default App;