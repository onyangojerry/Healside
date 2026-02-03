import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import AppShell from '../components/AppShell';
import { AuthProvider, useAuth } from '../lib/auth/session';
import { ToastProvider } from '../components/ToastHost';
import '../styles/globals.css';

const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (router.pathname === '/login') {
    return <>{children}</>;
  }

  if (loading && !user) {
    return <div className="page">Loading session...</div>;
  }

  return <>{children}</>;
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const showShell = useMemo(() => router.pathname !== '/login', [router.pathname]);

  return (
    <AuthProvider>
      <ToastProvider>
        <RouteGuard>
          {showShell ? (
            <AppShell
              onSearch={(value) => {
                if (!value) return;
                router.push(`/cases?search=${encodeURIComponent(value)}`);
              }}
            >
              <Component {...pageProps} />
            </AppShell>
          ) : (
            <Component {...pageProps} />
          )}
        </RouteGuard>
      </ToastProvider>
    </AuthProvider>
  );
}
