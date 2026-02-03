import React from 'react';
import Link from 'next/link';

const NavRail: React.FC = () => {
  return (
    <nav className="nav-rail">
      <ul>
        <li><Link href="/cases">Cases</Link></li>
        <li><Link href="/settings">Settings</Link></li>
      </ul>
    </nav>
  );
};

export default NavRail;