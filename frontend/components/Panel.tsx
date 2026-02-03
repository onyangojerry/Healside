import React from 'react';

interface PanelProps {
  title: string;
  status?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, status, children, footer }) => {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>{title}</h3>
        {status && <StatusBadge status={status} />}
      </div>
      <div className="panel-body">
        {children}
      </div>
      {footer && <div className="panel-footer">{footer}</div>}
    </div>
  );
};

export default Panel;