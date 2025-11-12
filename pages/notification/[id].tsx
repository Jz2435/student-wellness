import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";

interface Notification {
  id: number;
  student_id: number;
  title: string;
  message: string;
  is_read: boolean;
  timestamp: string;
}

export default function NotificationDetail() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    if (!user) {
      router.replace("/");
      return;
    }

    if (id && typeof id === "string") {
      fetchNotification();
    }
  }, [user, id, router.isReady]);

  const fetchNotification = async () => {
    try {
      const res = await fetch(`http://localhost:8001/api/notifications/${id}`);
      if (res.ok) {
        const data = await res.json();
        setNotification(data);
      } else {
        setError("Notification not found");
      }
    } catch (err) {
      console.error("Failed to fetch notification:", err);
      setError("Failed to load notification");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Redirecting...</p>;

  if (loading) {
    return (
      <main
        style={{
          padding: "40px 60px",
          maxWidth: 800,
          margin: "0 auto",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Loading notification...</p>
      </main>
    );
  }

  if (error || !notification) {
    return (
      <main
        style={{
          padding: "40px 60px",
          maxWidth: 800,
          margin: "0 auto",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#ef4444", marginBottom: "20px" }}>
          {error || "Notification not found"}
        </p>
        <Link href="/alerts" legacyBehavior>
          <a
            style={{
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              color: "#fff",
              borderRadius: 6,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            Back to Notifications
          </a>
        </Link>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: "40px 60px",
        maxWidth: 800,
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
            Notification Details
          </h1>
          <p style={{ color: "#4b5563" }}>Detailed view of your notification</p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/alerts" legacyBehavior>
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
              Back to Notifications
            </a>
          </Link>
        </div>
      </header>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            {notification.title}
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px 24px",
              fontSize: "14px",
              color: "#6b7280",
              marginBottom: "12px",
            }}
          >
            <span>
              <strong>ID:</strong> {notification.id}
            </span>
            <span>
              <strong>Status:</strong>{" "}
              {notification.is_read ? "Read" : "Unread"}
            </span>
            <span>
              <strong>Date:</strong>{" "}
              {new Date(notification.timestamp).toLocaleString()}
            </span>
          </div>
          <hr
            style={{
              margin: "16px 0",
              border: "none",
              borderTop: "1px solid #e5e7eb",
            }}
          />
        </div>

        <div>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#1f2937",
              marginBottom: "12px",
            }}
          >
            Message
          </h3>
          <p
            style={{
              color: "#374151",
              lineHeight: "1.75",
              fontSize: "16px",
              whiteSpace: "pre-line", // preserve \n as line breaks
              wordBreak: "break-word",
              backgroundColor: "#f9fafb",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            {notification.message}
          </p>
        </div>
      </div>
    </main>
  );
}
