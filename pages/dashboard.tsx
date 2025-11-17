import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";
import NotificationBell from "../components/NotificationBell";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SelfReport {
  id: number;
  stress_level: number;
  mood: string;
  sleep_hours: number;
  comments: string;
  timestamp: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<SelfReport[]>([]);

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/api/self-reports?student_id=${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    };

    if (user) {
      fetchReports();
    }
  }, [user]);

  if (!user) return <p>Redirecting...</p>;

  // process data
  const sortedReports = reports.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const labels = sortedReports.map((report) =>
    new Date(report.timestamp).toLocaleDateString()
  );

  const moodToNumber = (mood: string) => {
    switch (mood) {
      case "happy":
        return 3;
      case "neutral":
        return 2;
      case "sad":
        return 1;
      default:
        return 2;
    }
  };

  const stressData = {
    labels,
    datasets: [
      {
        label: "Stress Level",
        data: sortedReports.map((report) => report.stress_level),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.4)",
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const moodData = {
    labels,
    datasets: [
      {
        label: "Mood (1=Sad, 2=Neutral, 3=Happy)",
        data: sortedReports.map((report) => moodToNumber(report.mood)),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.4)",
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const sleepData = {
    labels,
    datasets: [
      {
        label: "Sleep Hours",
        data: sortedReports.map((report) => report.sleep_hours),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.4)",
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Trend Analysis",
        font: { size: 16, weight: "bold" },
        padding: { top: 10, bottom: 10 },
      },
    },
  };

  return (
    <main
      style={{
        padding: "20px",
        maxWidth: 1400,
        margin: "0 auto",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: "20px",
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ flex: "1 1 300px" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#1e3a8a",
              marginBottom: 8,
              lineHeight: 1.2,
            }}
          >
            Welcome, {user.name}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
            {user.email}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <NotificationBell />
          <Link href="/report" legacyBehavior>
            <a
              style={{
                padding: "12px 24px",
                backgroundColor: "#2563eb",
                color: "#fff",
                borderRadius: 8,
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                transition: "all 0.2s",
                display: "inline-block",
                fontSize: "15px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#1d4ed8";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(37,99,235,0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(37,99,235,0.3)";
              }}
            >
              📝 Submit Daily Report
            </a>
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            style={{
              padding: "12px 20px",
              backgroundColor: "#fff",
              color: "#374151",
              border: "2px solid #e5e7eb",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "15px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#f9fafb";
              e.currentTarget.style.borderColor = "#d1d5db";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {reports.length > 0 && (
        <section>
          {/* Quick Stats Section */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                borderLeft: "4px solid #ef4444",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginBottom: 8,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Latest Stress
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#ef4444",
                  margin: 0,
                }}
              >
                {sortedReports[sortedReports.length - 1]?.stress_level || "N/A"}
                <span style={{ fontSize: "16px", color: "#6b7280" }}>/10</span>
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                borderLeft: "4px solid #3b82f6",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginBottom: 8,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Latest Mood
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#3b82f6",
                  margin: 0,
                  textTransform: "capitalize",
                }}
              >
                {sortedReports[sortedReports.length - 1]?.mood || "N/A"}
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                borderLeft: "4px solid #10b981",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginBottom: 8,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Latest Sleep
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#10b981",
                  margin: 0,
                }}
              >
                {sortedReports[sortedReports.length - 1]?.sleep_hours || "N/A"}
                <span style={{ fontSize: "16px", color: "#6b7280" }}> hrs</span>
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                borderLeft: "4px solid #8b5cf6",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginBottom: 8,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Total Reports
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#8b5cf6",
                  margin: 0,
                }}
              >
                {reports.length}
              </p>
            </div>
          </div>

          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#111827",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            📊 Your Health Trends
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: 24,
            }}
          >
            <Link href="/trends/stress" legacyBehavior>
              <a
                style={{
                  display: "block",
                  backgroundColor: "#fff",
                  padding: 20,
                  borderRadius: 12,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                  border: "1px solid #f3f4f6",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0,0,0,0.12)";
                  e.currentTarget.style.borderColor = "#ef4444";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                  e.currentTarget.style.borderColor = "#f3f4f6";
                }}
                aria-label="Open Stress trend details"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    😰 Stress Level
                  </h3>
                  <span
                    style={{
                      color: "#ef4444",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    View →
                  </span>
                </div>
                <Line
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: { display: false },
                    },
                  }}
                  data={stressData}
                />
              </a>
            </Link>

            <Link href="/trends/mood" legacyBehavior>
              <a
                style={{
                  display: "block",
                  backgroundColor: "#fff",
                  padding: 20,
                  borderRadius: 12,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                  border: "1px solid #f3f4f6",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0,0,0,0.12)";
                  e.currentTarget.style.borderColor = "#3b82f6";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                  e.currentTarget.style.borderColor = "#f3f4f6";
                }}
                aria-label="Open Mood trend details"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    😊 Mood Tracker
                  </h3>
                  <span
                    style={{
                      color: "#3b82f6",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    View →
                  </span>
                </div>
                <Line
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: { display: false },
                    },
                  }}
                  data={moodData}
                />
              </a>
            </Link>

            <Link href="/trends/sleep" legacyBehavior>
              <a
                style={{
                  display: "block",
                  backgroundColor: "#fff",
                  padding: 20,
                  borderRadius: 12,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                  border: "1px solid #f3f4f6",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0,0,0,0.12)";
                  e.currentTarget.style.borderColor = "#10b981";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                  e.currentTarget.style.borderColor = "#f3f4f6";
                }}
                aria-label="Open Sleep trend details"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    😴 Sleep Hours
                  </h3>
                  <span
                    style={{
                      color: "#10b981",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    View →
                  </span>
                </div>
                <Line
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: { display: false },
                    },
                  }}
                  data={sleepData}
                />
              </a>
            </Link>
          </div>
        </section>
      )}

      {reports.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>📊</div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "12px",
            }}
          >
            No Reports Yet
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: "16px",
              marginBottom: "24px",
              maxWidth: "500px",
              margin: "0 auto 24px",
              lineHeight: 1.6,
            }}
          >
            Start tracking your wellness journey by submitting your first daily
            report. You'll be able to view trends and insights here.
          </p>
          <Link href="/report" legacyBehavior>
            <a
              style={{
                padding: "12px 32px",
                backgroundColor: "#2563eb",
                color: "#fff",
                borderRadius: 8,
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                transition: "all 0.2s",
                display: "inline-block",
                fontSize: "15px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#1d4ed8";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Submit Your First Report
            </a>
          </Link>
        </div>
      )}
    </main>
  );
}
