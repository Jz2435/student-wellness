import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!email || email.indexOf('@') === -1) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Login failed');
      if (!data.token || !data.user) throw new Error('Invalid login response');

      login(data.token, data.user);
      router.push('/dashboard');
    } catch (e: any) {
      setError(e?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #1e3a8a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
          padding: '56px 48px',
          width: '100%',
          maxWidth: '420px',
          textAlign: 'center',
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 6px 14px rgba(16, 185, 129, 0.4)',
            }}
          >
            <span style={{ fontSize: '32px', color: 'white' }}>🌿</span>
          </div>
          <h1
            style={{
              fontSize: '30px',
              fontWeight: 700,
              color: '#1f2937',
              margin: '0 0 10px 0',
              letterSpacing: '-0.5px',
            }}
          >
            Welcome Back
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.6',
              maxWidth: '320px',
              marginInline: 'auto',
            }}
          >
            Sign in to your Student Wellness account and continue tracking your
            wellbeing journey.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSignIn} style={{ width: '100%' }}>
          <div style={{ marginBottom: '28px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '10px',
                textAlign: 'left',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '36px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '10px',
                textAlign: 'left',
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 0',
              fontSize: '16px',
              fontWeight: 600,
              color: 'white',
              backgroundColor: loading ? '#9ca3af' : '#10b981',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: loading
                ? 'none'
                : '0 6px 16px rgba(16, 185, 129, 0.3)',
              marginBottom: '20px',
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 20px rgba(16,185,129,0.35)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 6px 16px rgba(16, 185, 129, 0.3)';
              }
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              padding: '12px 16px',
              marginTop: '18px',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: '#dc2626',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '28px',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}
          >
            Your wellness journey starts here. Track, reflect, and grow stronger
            every day 🌱
          </p>
        </div>
      </div>
    </div>
  );
}
