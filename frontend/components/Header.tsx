import React from 'react';
import { logout } from '../lib/auth';

const Header: React.FC = () => {
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <div>Environment: Local</div>
      <div>Role: Clinician</div>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;