import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // if no user, send back to login
      router.replace('/');
    }
  }, [user, router]);

  if (!user) return <p>Redirecting...</p>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Signed in as: <strong>{user.name}</strong> ({user.email})</p>
      <button
        onClick={() => {
          logout();
          router.push('/');
        }}
        style={{ marginTop: 16 }}
      >
        Sign out
      </button>
    </main>
  );
}
