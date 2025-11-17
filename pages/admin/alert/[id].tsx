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

interface Student {
  id: number;
  name: string;
  email: string;
}

interface SelfReport {
  id: number;
  student_id: number;
  stress_level: number;
  mood: string;
  sleep_hours: number;
  comments: string;
  timestamp: string;
}

export default function AlertDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [alert, setAlert] = useState<Alert | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [recentReports, setRecentReports] = useState<SelfReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAlertDetails();
    }
  }, [id]);

  const fetchAlertDetails = async () => {
    setLoading(true);
    try {
      // Fetch all alerts and find the specific one
      const alertsRes = await fetch("http://localhost:8001/api/alerts");
      const alertsData = await alertsRes.json();
      const currentAlert = alertsData.find(
        (a: Alert) => a.id === parseInt(id as string)
      );

      if (currentAlert) {
        setAlert(currentAlert);

        // Fetch student info
        const studentsRes = await fetch("http://localhost:8001/api/students");
        const studentsData = await studentsRes.json();
        const studentInfo = studentsData.find(
          (s: Student) => s.id === currentAlert.student_id
        );
        setStudent(studentInfo);

        // Fetch recent reports for this student
        const reportsRes = await fetch(
          `http://localhost:8001/api/self-reports?student_id=${currentAlert.student_id}`
        );
        const reportsData = await reportsRes.json();
        // Sort by timestamp descending and take last 10
        const sortedReports = reportsData
          .sort(
            (a: SelfReport, b: SelfReport) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          .slice(0, 10);
        setRecentReports(sortedReports);
      }
    } catch (error) {
      console.error("Failed to fetch alert details:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAlertStatus = async (status: string) => {
    if (!alert) return;

    try {
      await fetch(`http://localhost:8001/api/alerts/${alert.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchAlertDetails(); // Refresh
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

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "happy":
        return "😊";
      case "neutral":
        return "😐";
      case "sad":
        return "😢";
      default:
        return "😐";
    }
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
          Loading alert details...
        </p>
      </div>
    );
  }

  if (!alert || !student) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <p style={{ fontSize: "18px", color: "#6b7280" }}>Alert not found</p>
        <Link href="/admin/dashboard" legacyBehavior>
          <a
            style={{
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              color: "#fff",
              borderRadius: 6,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Back to Dashboard
          </a>
        </Link>
      </div>
    );
  }

  const statusColors = getStatusBadgeColor(alert.status);

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
          <Link href="/admin/dashboard" legacyBehavior>
            <a
              style={{
                fontSize: "14px",
                color: "#6b7280",
                textDecoration: "none",
                display: "inline-block",
                marginBottom: "12px",
              }}
            >
              ← Back to Dashboard
            </a>
          </Link>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 700,
              color: "#1e3a8a",
              marginBottom: 8,
            }}
          >
            Alert Details
          </h1>
          <p style={{ color: "#4b5563" }}>
            Alert #{alert.id} for {student.name}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {alert.status === "OPEN" && (
            <button
              onClick={() => updateAlertStatus("ACK")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f59e0b",
                color: "#fff",
                borderRadius: 6,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              Acknowledge Alert
            </button>
          )}
          {alert.status === "ACK" && (
            <button
              onClick={() => updateAlertStatus("RESOLVED")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#10b981",
                color: "#fff",
                borderRadius: 6,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              Mark as Resolved
            </button>
          )}
        </div>
      </header>

      {/* Alert Summary Card */}
      <section
        style={{
          backgroundColor: "#fff",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          borderLeft: `6px solid ${getSeverityColor(alert.severity)}`,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
            }}
          >
            Alert Summary
          </h2>
          <span
            style={{
              padding: "6px 16px",
              backgroundColor: statusColors.bg,
              color: statusColors.color,
              border: `1px solid ${statusColors.border}`,
              borderRadius: "16px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {alert.status}
          </span>
          <span
            style={{
              padding: "6px 16px",
              backgroundColor: getSeverityColor(alert.severity) + "20",
              color: getSeverityColor(alert.severity),
              borderRadius: "16px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {alert.severity} SEVERITY
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <div>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginBottom: "6px",
              }}
            >
              Risk Score
            </p>
            <p
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: getSeverityColor(alert.severity),
                margin: 0,
              }}
            >
              {alert.risk_score.toFixed(2)}
            </p>
          </div>
          <div>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginBottom: "6px",
              }}
            >
              Triggered At
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#374151",
                margin: 0,
              }}
            >
              {new Date(alert.triggered_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          <p style={{ color: "#374151", fontSize: "15px", margin: 0 }}>
            <strong>Trigger Condition:</strong> {alert.condition}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {alert.ack_at && (
            <div>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "13px",
                  marginBottom: "4px",
                }}
              >
                Acknowledged At
              </p>
              <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>
                {new Date(alert.ack_at).toLocaleString()}
              </p>
            </div>
          )}
          {alert.resolved_at && (
            <div>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "13px",
                  marginBottom: "4px",
                }}
              >
                Resolved At
              </p>
              <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>
                {new Date(alert.resolved_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Student Information */}
      <section
        style={{
          backgroundColor: "#fff",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          marginBottom: 32,
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: 20,
          }}
        >
          Student Information
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          <div>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginBottom: "6px",
              }}
            >
              Student Name
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#374151",
                margin: 0,
              }}
            >
              {student.name}
            </p>
          </div>
          <div>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginBottom: "6px",
              }}
            >
              Student ID
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#374151",
                margin: 0,
              }}
            >
              {student.id}
            </p>
          </div>
          <div>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginBottom: "6px",
              }}
            >
              Email Address
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#374151",
                margin: 0,
              }}
            >
              {student.email}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Reports */}
      <section
        style={{
          backgroundColor: "#fff",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: 20,
          }}
        >
          Recent Wellness Reports ({recentReports.length})
        </h2>

        {recentReports.length === 0 ? (
          <p style={{ color: "#6b7280", fontStyle: "italic" }}>
            No reports found
          </p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {recentReports.map((report) => (
              <div
                key={report.id}
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#374151",
                      margin: 0,
                    }}
                  >
                    {new Date(report.timestamp).toLocaleString()}
                  </p>
                  <p style={{ fontSize: "24px", margin: 0 }}>
                    {getMoodEmoji(report.mood)}
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "16px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Stress Level
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          backgroundColor: "#e5e7eb",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${(report.stress_level / 10) * 100}%`,
                            height: "100%",
                            backgroundColor:
                              report.stress_level >= 8
                                ? "#dc2626"
                                : report.stress_level >= 5
                                ? "#f59e0b"
                                : "#10b981",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        {report.stress_level}/10
                      </span>
                    </div>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Sleep Hours
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#374151",
                        margin: 0,
                      }}
                    >
                      {report.sleep_hours}h
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Mood
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#374151",
                        margin: 0,
                      }}
                    >
                      {report.mood}
                    </p>
                  </div>
                </div>

                {report.comments && (
                  <div style={{ marginTop: "12px" }}>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Comments
                    </p>
                    <p
                      style={{ fontSize: "14px", color: "#374151", margin: 0 }}
                    >
                      {report.comments}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
