export interface AppNotification {
  title?: string;
  body?: string;
  image?: string;
  receivedAt: number;
}

export interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAllAsRead: () => void;
  addNotification: (notif: AppNotification) => void;
}