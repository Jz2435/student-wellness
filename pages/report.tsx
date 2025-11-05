import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ReportPage = () => {
  const router = useRouter();
  const [stressLevel, setStressLevel] = useState(5);
  const [mood, setMood] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mood || !sleepHours) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');

    try {
      const response = await fetch('http://localhost:8001/api/self-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stress_level: stressLevel,
          mood,
          sleep_hours: Number(sleepHours),
          comments,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setStressLevel(5);
        setMood('');
        setSleepHours('');
        setComments('');
        // Redirect to dashboard after showing success message for 2 seconds
        setTimeout(() => {
          router.replace('/dashboard');
        }, 2000);
      } else {
        setError('Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 1000 }}>
        <Link href="/dashboard">
          <button
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
              backgroundColor: '#0070f3',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0059c1')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0070f3')}
          >
            Back to Dashboard
          </button>
        </Link>
      </div>
      <div
        style={{
          padding: '40px 24px',       // more breathing room
          maxWidth: '700px',          // slightly wider container
          margin: '60px auto',        // top/bottom space for visual comfort
          backgroundColor: '#fafafa', // subtle background contrast
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Self-Report</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Stress Level (1-10):
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={stressLevel}
            onChange={(e) => setStressLevel(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <span style={{ marginLeft: '8px', fontWeight: 500 }}>{stressLevel}</span>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Mood:
          </label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          >
            <option value="">Select mood</option>
            <option value="happy">Happy</option>
            <option value="neutral">Neutral</option>
            <option value="sad">Sad</option>
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Sleep Hours:
          </label>
          <input
            type="number"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Comments:
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              minHeight: '100px',
              resize: 'vertical',
            }}
          />
        </div>

        {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginBottom: '16px' }}>Submission successful!</p>}

        <button
          type="submit"
          style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 600,
            color: 'white',
            backgroundColor: '#0070f3',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0059c1')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0070f3')}
        >
          Submit
        </button>
      </form>
    </div>
    </>
  );
};

export default ReportPage;
