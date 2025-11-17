import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
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

interface Notification {
  id: number;
  student_id: number;
  title: string;
  message: string;
  is_read: boolean;
  timestamp: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [students, setStudents] = useState<{ [key: number]: Student }>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"alerts" | "notifications">(
    "alerts"
  );
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch alerts
      const alertsRes = await fetch("http://localhost:8001/api/alerts");
      const alertsData = await alertsRes.json();
      setAlerts(alertsData);

      // Fetch all students
      const studentsRes = await fetch("http://localhost:8001/api/students");
      const studentsData = await studentsRes.json();

      // Create student mapping
      const studentMap: { [key: number]: Student } = {};
      studentsData.forEach((student: Student) => {
        studentMap[student.id] = student;
      });
      setStudents(studentMap);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAlertStatus = async (id: number, status: string) => {
    try {
      await fetch(`http://localhost:8001/api/alerts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchData(); // Refresh the list
    } catch (error) {
      console.error("Failed to update alert:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "#dc2626";
      case "HIGH":
        return "#ea580c";
      case "MEDIUM":
        return "#d97706";
      case "LOW":
        return "#16a34a";
      default:
        return "#6b7280";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
      case "ACK":
        return { bg: "#fef3c7", color: "#d97706", border: "#fde68a" };
      case "RESOLVED":
        return { bg: "#d1fae5", color: "#065f46", border: "#a7f3d0" };
      default:
        return { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" };
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const statusMatch = filterStatus === "ALL" || alert.status === filterStatus;
    const severityMatch =
      filterSeverity === "ALL" || alert.severity === filterSeverity;
    return statusMatch && severityMatch;
  });

  const alertStats = {
    total: alerts.length,
    open: alerts.filter((a) => a.status === "OPEN").length,
    acknowledged: alerts.filter((a) => a.status === "ACK").length,
    resolved: alerts.filter((a) => a.status === "RESOLVED").length,
    critical: alerts.filter((a) => a.severity === "CRITICAL").length,
    high: alerts.filter((a) => a.severity === "HIGH").length,
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <p style={{ fontSize: "18px", color: "#6b7280" }}>
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <main
      style={{
        padding: "40px 60px",
        maxWidth: 1400,
        margin: "0 auto",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
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
            Admin Dashboard
          </h1>
          <p style={{ color: "#4b5563" }}>
            Monitor all student wellness alerts and notifications
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={fetchData}
            style={{
              padding: "10px 20px",
              backgroundColor: "#10b981",
              color: "#fff",
              borderRadius: 6,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#059669")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#10b981")
            }
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#e5e7eb",
              color: "#374151",
              borderRadius: 6,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Statistics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #3b82f6",
          }}
        >
          <p
            style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" }}
          >
            Total Alerts
          </p>
          <p
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#1e3a8a",
              margin: 0,
            }}
          >
            {alertStats.total}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #dc2626",
          }}
        >
          <p
            style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" }}
          >
            Open Alerts
          </p>
          <p
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#dc2626",
              margin: 0,
            }}
          >
            {alertStats.open}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #d97706",
          }}
        >
          <p
            style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" }}
          >
            Acknowledged
          </p>
          <p
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#d97706",
              margin: 0,
            }}
          >
            {alertStats.acknowledged}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #10b981",
          }}
        >
          <p
            style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" }}
          >
            Resolved
          </p>
          <p
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#10b981",
              margin: 0,
            }}
          >
            {alertStats.resolved}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #dc2626",
          }}
        >
          <p
            style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" }}
          >
            Critical Severity
          </p>
          <p
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#dc2626",
              margin: 0,
            }}
          >
            {alertStats.critical}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #ea580c",
          }}
        >
          <p
            style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0" }}
          >
            High Severity
          </p>
          <p
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#ea580c",
              margin: 0,
            }}
          >
            {alertStats.high}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          marginBottom: 24,
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: "14px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="ACK">Acknowledged</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            Filter by Severity
          </label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: "14px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            Showing Results
          </label>
          <p style={{ fontSize: "16px", color: "#6b7280", margin: 0 }}>
            {filteredAlerts.length} of {alerts.length} alerts
          </p>
        </div>
      </div>

      {/* Alerts List */}
      <section>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: 24,
          }}
        >
          Student Alerts
        </h2>

        {filteredAlerts.length === 0 ? (
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
              {filterStatus !== "ALL" || filterSeverity !== "ALL"
                ? "No alerts match the selected filters"
                : "No alerts yet"}
            </p>
            <p style={{ color: "#9ca3af" }}>
              {filterStatus !== "ALL" || filterSeverity !== "ALL"
                ? "Try adjusting your filters"
                : "Alerts will appear here when risk conditions are met."}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            {filteredAlerts.map((alert) => {
              const statusColors = getStatusBadgeColor(alert.status);
              return (
                <div
                  key={alert.id}
                  onClick={() => router.push(`/admin/alert/${alert.id}`)}
                  style={{
                    backgroundColor: "#fff",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
                    position: "relative",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.12)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.05)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "16px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "8px",
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
                          {students[alert.student_id]?.name ||
                            `Student ${alert.student_id}`}
                        </h3>
                        <span
                          style={{
                            padding: "4px 12px",
                            backgroundColor: statusColors.bg,
                            color: statusColors.color,
                            border: `1px solid ${statusColors.border}`,
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {alert.status}
                        </span>
                        <span
                          style={{
                            padding: "4px 12px",
                            backgroundColor:
                              getSeverityColor(alert.severity) + "20",
                            color: getSeverityColor(alert.severity),
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p
                        style={{
                          color: "#6b7280",
                          margin: "4px 0",
                          fontSize: "14px",
                        }}
                      >
                        Alert ID: #{alert.id} | Student ID: {alert.student_id} |
                        Risk Score:{" "}
                        <strong
                          style={{ color: getSeverityColor(alert.severity) }}
                        >
                          {alert.risk_score.toFixed(2)}
                        </strong>
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {alert.status === "OPEN" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateAlertStatus(alert.id, "ACK");
                          }}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#f59e0b",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: 600,
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
                          Acknowledge
                        </button>
                      )}
                      {alert.status === "ACK" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateAlertStatus(alert.id, "RESOLVED");
                          }}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#10b981",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: 600,
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
                          Resolve
                        </button>
                      )}
                      {alert.status === "RESOLVED" && (
                        <span
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#d1fae5",
                            color: "#065f46",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: 600,
                          }}
                        >
                          ✓ Resolved
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#f9fafb",
                      padding: "16px",
                      borderRadius: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <p
                      style={{
                        color: "#374151",
                        lineHeight: "1.6",
                        margin: "0 0 8px 0",
                        fontSize: "14px",
                      }}
                    >
                      <strong>Trigger Condition:</strong> {alert.condition}
                    </p>
                  </div>

                  <div
                    style={{
                      fontSize: "14px",
                      color: "#2563eb",
                      fontWeight: 600,
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>Click to view full details</span>
                    <span>→</span>
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#9ca3af",
                      display: "flex",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span>
                      <strong>Triggered:</strong>{" "}
                      {new Date(alert.triggered_at).toLocaleString()}
                    </span>
                    {alert.ack_at && (
                      <span>
                        <strong>Acknowledged:</strong>{" "}
                        {new Date(alert.ack_at).toLocaleString()}
                      </span>
                    )}
                    {alert.resolved_at && (
                      <span>
                        <strong>Resolved:</strong>{" "}
                        {new Date(alert.resolved_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
