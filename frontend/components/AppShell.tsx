import React from 'react';
import LeftNav from './LeftNav';
import TopHeader from './TopHeader';

interface AppShellProps {
  children: React.ReactNode;
  onSearch?: (value: string) => void;
}

const AppShell: React.FC<AppShellProps> = ({ children, onSearch }) => {
  return (
    <div className="app-shell">
      <LeftNav />
      <div className="app-main">
        <TopHeader onSearch={onSearch} />
        <main className="app-content" role="main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
