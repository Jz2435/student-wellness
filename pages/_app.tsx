import type { AppProps } from 'next/app';
import React from 'react';
import { AuthProvider } from '../hooks/useAuth';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
