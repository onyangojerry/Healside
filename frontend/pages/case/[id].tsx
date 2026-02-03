import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CaseLegacyRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (router.query.id) {
      router.replace(`/cases/${router.query.id}`);
    }
  }, [router]);

  return <div className="page">Redirecting...</div>;
}
