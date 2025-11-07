import type { AppProps } from "next/app";
import React from "react";
import { AuthProvider } from "../hooks/useAuth";
import { NotificationProvider } from "../hooks/useNotifications";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </AuthProvider>
  );
}
