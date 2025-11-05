import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/login', { method: 'POST' });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Login failed');
      }
      const data = await res.json();
      if (!data.token || !data.user) throw new Error('Invalid login response');

      login(data.token, data.user);
      router.push('/dashboard');
    } catch (e: any) {
      setError(e?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <main style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <h1>Welcome</h1>
      <p>Please sign in to continue.</p>
      <button onClick={handleLogin} disabled={loading} style={{ padding: '10px 16px', fontSize: 16 }}>
        {loading ? 'Signing in...' : 'Login with University SSO'}
      </button>
      {error && <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>}
    </main>
  );
}
