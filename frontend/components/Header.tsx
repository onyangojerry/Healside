import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth/session';

const Header: React.FC = () => {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="top-header" role="banner">
      <div className="muted">Environment: {process.env.NEXT_PUBLIC_ENV_NAME || 'Local'}</div>
      <div className="muted">Role: {user?.role || 'viewer'}</div>
      <button className="btn btn-ghost" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
};

export default Header;
