import React from 'react';
import { ARTIFACT_STATUS, STATUS_CONFIG } from '../utils/status';

interface StatusBadgeProps {
  status: string;
  kind?: 'case' | 'artifact';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, kind = 'case' }) => {
  const config = (kind === 'artifact' ? ARTIFACT_STATUS : STATUS_CONFIG)[status] || {
    label: status,
    description: '',
    nextAction: '',
    tone: 'neutral',
  };

  return (
    <span
      className={`status-badge status-${config.tone}`}
      title={`${config.description}${config.nextAction ? ` Next: ${config.nextAction}` : ''}`}
      aria-label={`${config.label}. ${config.description} ${config.nextAction}`.trim()}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
