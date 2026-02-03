import React from 'react';
import { STATUS_CONFIG } from '../utils/constants';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status] || { label: status, description: '', nextAction: '' };
  return (
    <span className={`status-badge status-${status.toLowerCase().replace('_', '-')}`} title={`${config.description} Next: ${config.nextAction}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;