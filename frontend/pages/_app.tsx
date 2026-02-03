import '../styles/globals.css';
import '../styles/components.css';
import type { AppProps } from 'next/app';
import AppShell from '../components/AppShell';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppShell>
      <Component {...pageProps} />
    </AppShell>
  );
}

export default MyApp;