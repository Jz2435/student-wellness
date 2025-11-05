import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
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

export default function SleepTrendPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<SelfReport[]>([]);

  useEffect(() => {
    if (!user) {
      router.replace('/');
      return;
    }

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

    fetchReports();
  }, [user, router]);

  if (!user) return <p>Redirecting...</p>;

  const sortedReports = reports.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const labels = sortedReports.map(report => new Date(report.timestamp).toLocaleDateString());

  const sleepData = {
    labels,
    datasets: [
      {
        label: 'Sleep Hours',
        data: sortedReports.map(report => report.sleep_hours),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
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
        position: 'top' as const,
        labels: { boxWidth: 15, font: { size: 14 } },
      },
      title: {
        display: true,
        text: 'Sleep Hours Trend - Detailed View',
        font: { size: 20, weight: 'bold' as const },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context: any) {
            return `Sleep Hours: ${context.parsed.y} hours`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value + 'h';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const recommendedSleep = 8;
  const averageSleep = reports.length > 0 ? reports.reduce((sum, r) => sum + r.sleep_hours, 0) / reports.length : 0;
  const sleepQuality = averageSleep >= recommendedSleep ? 'Good' : averageSleep >= 6 ? 'Fair' : 'Poor';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '40px 60px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        maxWidth: 1400,
        margin: '0 auto 40px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 8 }}>
            <Link href="/dashboard" legacyBehavior>
              <a style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                ← Back to Dashboard
              </a>
            </Link>
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#059669',
            margin: 0
          }}>
            Sleep Trends
          </h1>
          <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>
            Detailed analysis of your sleep patterns over time
          </p>
        </div>

        <div style={{
          backgroundColor: '#ecfdf5',
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid #a7f3d0'
        }}>
          <div style={{ fontSize: '14px', color: '#059669', fontWeight: 600 }}>
            Average Sleep
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#059669' }}>
            {averageSleep.toFixed(1)}h
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Quality: {sleepQuality}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1400, margin: '0 auto' }}>
        {reports.length > 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            marginBottom: 32
          }}>
            <div style={{ height: '500px', marginBottom: '32px' }}>
              <Line options={detailedOptions} data={sleepData} />
            </div>

            {/* Statistics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              marginTop: '32px'
            }}>
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Reports</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#374151' }}>{reports.length}</div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Best Night</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#059669' }}>
                  {Math.max(...reports.map(r => r.sleep_hours))}h
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Shortest Night</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#dc2626' }}>
                  {Math.min(...reports.map(r => r.sleep_hours))}h
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Recommended</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#059669' }}>
                  {recommendedSleep}h
                </div>
              </div>
            </div>

            {/* Sleep Insights */}
            <div style={{
              marginTop: '32px',
              padding: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '16px' }}>
                Sleep Insights
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>
                    <strong>Consistency:</strong> {reports.length > 1 ? 'Varies' : 'N/A'}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    <strong>Trend:</strong> {reports.length > 1 && reports[reports.length - 1].sleep_hours > reports[0].sleep_hours ? 'Improving' : 'Stable'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>
                    <strong>Quality Score:</strong> {sleepQuality}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    <strong>Recommendation:</strong> Aim for 7-9 hours nightly
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>😴</div>
            <h3 style={{ fontSize: '24px', color: '#374151', marginBottom: '8px' }}>No Data Available</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Submit your first sleep report to start tracking your rest patterns.
            </p>
            <Link href="/report" legacyBehavior>
              <a style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#2563eb',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 600
              }}>
                Submit Report
              </a>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}