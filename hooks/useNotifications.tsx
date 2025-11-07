import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useAuth } from "./useAuth";

interface Notification {
  id: number;
  student_id: number;
  title: string;
  message: string;
  is_read: boolean;
  timestamp: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `http://localhost:8001/api/notifications?student_id=${user.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8001/api/notifications/${id}/read`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, is_read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
