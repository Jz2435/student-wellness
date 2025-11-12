import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useNotifications } from "../hooks/useNotifications";
import Link from "next/link";

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const recentNotifications = notifications.slice(0, 5); // Show most recent 5

  const handleNotificationClick = async (id: number) => {
    await markAsRead(id);
    setIsOpen(false);
  };

  const getBadgeText = () => {
    if (unreadCount === 0) return null;
    if (unreadCount > 9) return "9+";
    return unreadCount.toString();
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px",
          borderRadius: "50%",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <IoNotificationsOutline size={24} color="#374151" />
        {getBadgeText() && (
          <span
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              backgroundColor: "#ef4444",
              color: "white",
              borderRadius: "10px",
              padding: "2px 6px",
              fontSize: "10px",
              fontWeight: "bold",
              minWidth: "16px",
              textAlign: "center",
            }}
          >
            {getBadgeText()}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "0",
            width: "320px",
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            zIndex: 1000,
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #e5e7eb",
              fontWeight: "bold",
              color: "#374151",
            }}
          >
            Notifications
          </div>

          {recentNotifications.length === 0 ? (
            <div
              style={{ padding: "16px", color: "#6b7280", textAlign: "center" }}
            >
              No notifications yet
            </div>
          ) : (
            <>
              {recentNotifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={`/notification/${notification.id}`}
                  legacyBehavior
                >
                  <a
                    onClick={() => {
                      markAsRead(notification.id);
                      setIsOpen(false);
                    }}
                    style={{
                      display: "block",
                      padding: "12px 16px",
                      borderBottom: "1px solid #f3f4f6",
                      cursor: "pointer",
                      backgroundColor: notification.is_read
                        ? "white"
                        : "#fef3c7",
                      transition: "background-color 0.2s",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f9fafb")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        notification.is_read ? "white" : "#fef3c7")
                    }
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#374151",
                        marginBottom: "4px",
                      }}
                    >
                      {notification.title}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#6b7280",
                        lineHeight: "1.4",
                      }}
                    >
                      {notification.message}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#9ca3af",
                        marginTop: "4px",
                      }}
                    >
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </div>
                  </a>
                </Link>
              ))}

              <div
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <Link href="/alerts" legacyBehavior>
                  <a
                    style={{
                      color: "#2563eb",
                      textDecoration: "none",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    View all notifications →
                  </a>
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      {/* Overlay to close flyout when clicking outside */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
