import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth/session';
import { formatRole } from '../utils/format';

const navItems = [
  { href: '/cases', label: 'Cases', icon: 'inbox' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
];

const LeftNav: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <aside className="left-nav" aria-label="Primary">
      <div className="left-nav__brand">
        <div className="brand-mark" aria-hidden="true">H</div>
        <div>
          <div className="brand-title">Healside</div>
          <div className="brand-subtitle">Clinical Ops</div>
        </div>
      </div>

      <nav className="left-nav__menu">
        {navItems.map((item) => {
          const active = router.pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={active ? 'nav-link is-active' : 'nav-link'}>
              <span className={`nav-icon nav-icon--${item.icon}`} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="left-nav__footer">
        <div className="role-badge">
          <span className="role-label">Role</span>
          <span className="role-value">{formatRole(user?.role)}</span>
        </div>
      </div>
    </aside>
  );
};

export default LeftNav;
