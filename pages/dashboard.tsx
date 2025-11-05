import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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
      router.replace('/');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/self-reports');
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error);
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
  const labels = sortedReports.map(report =>
    new Date(report.timestamp).toLocaleDateString()
  );

  const moodToNumber = (mood: string) => {
    switch (mood) {
      case 'happy':
        return 3;
      case 'neutral':
        return 2;
      case 'sad':
        return 1;
      default:
        return 2;
    }
  };

  const stressData = {
    labels,
    datasets: [
      {
        label: 'Stress Level',
        data: sortedReports.map(report => report.stress_level),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const moodData = {
    labels,
    datasets: [
      {
        label: 'Mood (1=Sad, 2=Neutral, 3=Happy)',
        data: sortedReports.map(report => moodToNumber(report.mood)),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.4)',
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const sleepData = {
    labels,
    datasets: [
      {
        label: 'Sleep Hours',
        data: sortedReports.map(report => report.sleep_hours),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { boxWidth: 12, font: { size: 12 } },
      },
      title: {
        display: true,
        text: 'Trend Analysis',
        font: { size: 16, weight: 'bold' },
        padding: { top: 10, bottom: 10 },
      },
    },
  };

  return (
    <main
      style={{
        padding: '40px 60px',
        maxWidth: 1200,
        margin: '0 auto',
        backgroundColor: '#f9fafb',
        minHeight: '100vh',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 40,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              color: '#1e3a8a',
              marginBottom: 8,
            }}
          >
            Dashboard
          </h1>
          <p style={{ color: '#4b5563' }}>
            Signed in as: <strong>{user.name}</strong> ({user.email})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/report" legacyBehavior>
            <a
              style={{
                padding: '10px 20px',
                backgroundColor: '#2563eb',
                color: '#fff',
                borderRadius: 6,
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={e =>
                (e.currentTarget.style.backgroundColor = '#1d4ed8')
              }
              onMouseOut={e =>
                (e.currentTarget.style.backgroundColor = '#2563eb')
              }
            >
              Submit Daily Report
            </a>
          </Link>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#e5e7eb',
              color: '#374151',
              borderRadius: 6,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {reports.length > 0 && (
        <section>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#111827',
              marginBottom: 24,
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: 8,
            }}
          >
            Health Trends
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 60,
            }}
          >
            <div style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: 16,
                  textAlign: 'center',
                }}
              >
                Stress Level Trend
              </h3>
              <Line
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: true, text: 'Stress Level Over Time' },
                  },
                }}
                data={stressData}
              />
            </div>

            <div style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: 16,
                  textAlign: 'center',
                }}
              >
                Mood Trend
              </h3>
              <Line
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: 'Mood Over Time (1=Sad, 2=Neutral, 3=Happy)',
                    },
                  },
                }}
                data={moodData}
              />
            </div>

            <div style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: 16,
                  textAlign: 'center',
                }}
              >
                Sleep Hours Trend
              </h3>
              <Line
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: true, text: 'Sleep Hours Over Time' },
                  },
                }}
                data={sleepData}
              />
            </div>
          </div>
        </section>
      )}

      {reports.length === 0 && (
        <p style={{ marginTop: 20, color: '#6b7280', fontStyle: 'italic' }}>
          No reports submitted yet. Submit your first report to see trends!
        </p>
      )}
    </main>
  );
}
