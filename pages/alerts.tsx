import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import Link from "next/link";

export default function Alerts() {
  const { user } = useAuth();
  const router = useRouter();
  const { notifications, markAsRead } = useNotifications();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) return <p>Redirecting...</p>;

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
  };

  return (
    <main
      style={{
        padding: "40px 60px",
        maxWidth: 1200,
        margin: "0 auto",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 700,
              color: "#1e3a8a",
              marginBottom: 8,
            }}
          >
            Notifications
          </h1>
          <p style={{ color: "#4b5563" }}>
            Stay updated with your wellness alerts
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/dashboard" legacyBehavior>
            <a
              style={{
                padding: "10px 20px",
                backgroundColor: "#2563eb",
                color: "#fff",
                borderRadius: 6,
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#1d4ed8")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#2563eb")
              }
            >
              Back to Dashboard
            </a>
          </Link>
        </div>
      </header>

      <section>
        {notifications.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <p
              style={{
                color: "#6b7280",
                fontSize: "18px",
                marginBottom: "16px",
              }}
            >
              No notifications yet
            </p>
            <p style={{ color: "#9ca3af" }}>
              You'll receive notifications about your wellness journey here.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            {notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  borderLeft: notification.is_read
                    ? "4px solid #e5e7eb"
                    : "4px solid #2563eb",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#374151",
                      margin: 0,
                    }}
                  >
                    {notification.title}
                  </h3>
                  {!notification.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      style={{
                        padding: "4px 12px",
                        backgroundColor: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#1d4ed8")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#2563eb")
                      }
                    >
                      Mark as Read
                    </button>
                  )}
                </div>

                <p
                  style={{
                    color: "#6b7280",
                    lineHeight: "1.6",
                    marginBottom: "12px",
                  }}
                >
                  {notification.message}
                </p>

                <div
                  style={{
                    fontSize: "14px",
                    color: "#9ca3af",
                  }}
                >
                  {new Date(notification.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
