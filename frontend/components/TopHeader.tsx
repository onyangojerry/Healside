import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth/session';

interface TopHeaderProps {
  onSearch?: (value: string) => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onSearch }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const environmentLabel = useMemo(() => {
    const env = process.env.NEXT_PUBLIC_ENV_NAME || 'Local';
    return env.toUpperCase();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch?.(search.trim());
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="top-header" role="banner">
      <form className="top-header__search" onSubmit={handleSubmit} role="search">
        <span className="search-icon" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search by case ID"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search cases by ID"
        />
      </form>

      <div className="top-header__meta">
        <span className="env-indicator">{environmentLabel}</span>
        <div className="user-menu">
          <button
            type="button"
            className="user-menu__trigger"
            onClick={() => setOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <span className="avatar" aria-hidden="true">
              {user?.username?.slice(0, 1).toUpperCase() || 'U'}
            </span>
            <span className="user-meta">
              <span className="user-name">{user?.username || 'User'}</span>
              <span className="user-role">{user?.role || 'viewer'}</span>
            </span>
          </button>
          {open && (
            <div className="user-menu__dropdown" role="menu">
              <button type="button" onClick={handleLogout} role="menuitem">
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
