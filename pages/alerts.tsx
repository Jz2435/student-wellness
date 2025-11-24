import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";

interface Alert {
  id: number;
  student_id: number;
  risk_score: number;
  severity: string;
  condition: string;
  triggered_at: string;
  status: string;
  ack_at?: string;
  resolved_at?: string;
}

export default function Alerts() {
  const { user } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (!user) {
      router.replace("/");
    } else {
      fetchAlerts();
    }
  }, [user, router]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(
        `http://localhost:8001/api/alerts?student_id=${user?.id}`
      );
      const data = await res.json();
      setAlerts(data);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`http://localhost:8000/api/alerts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchAlerts(); // Refresh the list
    } catch (error) {
      console.error("Failed to update alert:", error);
    }
  };

  if (!user) return <p>Redirecting...</p>;

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
            Alerts
          </h1>
          <p style={{ color: "#4b5563" }}>Monitor and manage wellness alerts</p>
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
        {alerts.length === 0 ? (
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
              No alerts yet
            </p>
            <p style={{ color: "#9ca3af" }}>
              Alerts will appear here when risk conditions are met.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            {alerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  borderLeft: `4px solid ${
                    alert.severity === "CRITICAL"
                      ? "#dc2626"
                      : alert.severity === "HIGH"
                      ? "#ea580c"
                      : alert.severity === "MEDIUM"
                      ? "#d97706"
                      : "#16a34a"
                  }`,
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
                  <div>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#374151",
                        margin: 0,
                      }}
                    >
                      Alert #{alert.id} - {alert.severity}
                    </h3>
                    <p style={{ color: "#6b7280", margin: "4px 0" }}>
                      Student ID: {alert.student_id} | Risk Score:{" "}
                      {alert.risk_score.toFixed(2)}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {alert.status === "OPEN" && (
                      <button
                        onClick={() => updateStatus(alert.id, "ACK")}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#f59e0b",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#d97706")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f59e0b")
                        }
                      >
                        Mark as Acknowledged
                      </button>
                    )}
                    {alert.status === "ACK" && (
                      <button
                        onClick={() => updateStatus(alert.id, "RESOLVED")}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#10b981",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#059669")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "#10b981")
                        }
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>

                <p
                  style={{
                    color: "#6b7280",
                    lineHeight: "1.6",
                    marginBottom: "8px",
                  }}
                >
                  <strong>Condition:</strong> {alert.condition}
                </p>
                <p
                  style={{
                    color: "#6b7280",
                    lineHeight: "1.6",
                    marginBottom: "12px",
                  }}
                >
                  <strong>Status:</strong> {alert.status}
                </p>

                <div
                  style={{
                    fontSize: "14px",
                    color: "#9ca3af",
                  }}
                >
                  Triggered: {new Date(alert.triggered_at).toLocaleString()}
                  {alert.ack_at && (
                    <>
                      {" "}
                      | Acknowledged: {new Date(alert.ack_at).toLocaleString()}
                    </>
                  )}
                  {alert.resolved_at && (
                    <>
                      {" "}
                      | Resolved: {new Date(alert.resolved_at).toLocaleString()}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
