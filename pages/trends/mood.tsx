import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";
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

export default function MoodTrendPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<SelfReport[]>([]);
  const [timeRange, setTimeRange] = useState<"1d" | "1w" | "1m">("1m");

  useEffect(() => {
    if (!user) {
      router.replace("/");
      return;
    }

    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/self-reports");
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    };

    fetchReports();
  }, [user, router]);

  const filterReportsByTimeRange = (
    reports: SelfReport[],
    range: "1d" | "1w" | "1m"
  ) => {
    const now = new Date();
    const cutoff = new Date();

    switch (range) {
      case "1d":
        cutoff.setDate(now.getDate() - 1);
        break;
      case "1w":
        cutoff.setDate(now.getDate() - 7);
        break;
      case "1m":
        cutoff.setMonth(now.getMonth() - 1);
        break;
    }

    return reports.filter((report) => new Date(report.timestamp) >= cutoff);
  };

  if (!user) return <p>Redirecting...</p>;

  const filteredReports = filterReportsByTimeRange(reports, timeRange);
  const sortedReports = filteredReports.sort(
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

  const moodData = {
    labels,
    datasets: [
      {
        label: "Mood Level",
        data: sortedReports.map((report) => moodToNumber(report.mood)),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const detailedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Mood Trend - Detailed View",
        font: { size: 20, weight: "bold" as const },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        callbacks: {
          label: function (context: any) {
            const moodLabels = ["Sad", "Neutral", "Happy"];
            return `Mood: ${moodLabels[context.parsed.y - 1]}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 3,
        ticks: {
          stepSize: 1,
          callback: function (value: any) {
            const labels = ["", "Sad", "Neutral", "Happy"];
            return labels[value] || "";
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  const moodCounts = filteredReports.reduce((acc, report) => {
    acc[report.mood] = (acc[report.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "40px 60px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 40,
          maxWidth: 1400,
          margin: "0 auto 40px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: 8,
            }}
          >
            <Link href="/dashboard" legacyBehavior>
              <a
                style={{
                  color: "#6b7280",
                  textDecoration: "none",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                ← Back to Dashboard
              </a>
            </Link>
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "#2563eb",
              margin: 0,
            }}
          >
            Mood Trends
          </h1>
          <p style={{ color: "#6b7280", margin: "8px 0 0 0" }}>
            Detailed analysis of your mood patterns over time
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#eff6ff",
            padding: "16px 20px",
            borderRadius: "12px",
            border: "1px solid #bfdbfe",
          }}
        >
          <div style={{ fontSize: "14px", color: "#2563eb", fontWeight: 600 }}>
            Most Common Mood
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#2563eb" }}>
            {Object.keys(moodCounts).length > 0
              ? Object.keys(moodCounts).reduce((a, b) =>
                  moodCounts[a] > moodCounts[b] ? a : b
                )
              : "None"}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1400, margin: "0 auto" }}>
        {reports.length > 0 ? (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              marginBottom: 32,
            }}
          >
            {/* Time Range Filter */}
            <div style={{ marginBottom: "24px", textAlign: "center" }}>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "12px",
                }}
              >
                Time Range
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                {[
                  { key: "1d", label: "1 Day" },
                  { key: "1w", label: "1 Week" },
                  { key: "1m", label: "1 Month" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTimeRange(key as "1d" | "1w" | "1m")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: timeRange === key ? "#2563eb" : "white",
                      color: timeRange === key ? "white" : "#374151",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: "500px", marginBottom: "32px" }}>
              <Line options={detailedOptions} data={moodData} />
            </div>

            {/* Statistics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "24px",
                marginTop: "32px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "20px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  Total Reports
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#374151",
                  }}
                >
                  {filteredReports.length}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "20px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  Happy Days
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#059669",
                  }}
                >
                  {moodCounts.happy || 0}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "20px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  Neutral Days
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#d97706",
                  }}
                >
                  {moodCounts.neutral || 0}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "20px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  Sad Days
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#dc2626",
                  }}
                >
                  {moodCounts.sad || 0}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>😊</div>
            <h3
              style={{
                fontSize: "24px",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              No Data Available
            </h3>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              Submit your first mood report to start tracking your emotional
              trends.
            </p>
            <Link href="/report" legacyBehavior>
              <a
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                }}
              >
                Submit Report
              </a>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
