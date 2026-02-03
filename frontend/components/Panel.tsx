import React from 'react';
import StatusBadge from './StatusBadge';

interface PanelProps {
  title: string;
  status?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, status, actions, footer, children }) => {
  return (
    <section className="panel">
      <header className="panel__header">
        <div className="panel__title">
          <h2>{title}</h2>
          {status && <StatusBadge status={status} />}
        </div>
        {actions && <div className="panel__actions">{actions}</div>}
      </header>
      <div className="panel__body">{children}</div>
      {footer && <footer className="panel__footer">{footer}</footer>}
    </section>
  );
};

export default Panel;
