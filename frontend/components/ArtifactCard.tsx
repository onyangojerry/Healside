import React from 'react';
import StatusBadge from './StatusBadge';
import { Artifact } from '../lib/types';
import { formatDate } from '../utils/helpers';

interface ArtifactCardProps {
  artifact: Artifact;
  onApprove?: (type: string) => void;
}

const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact, onApprove }) => {
  return (
    <div className="artifact-card">
      <h4>{artifact.type}</h4>
      <StatusBadge status={artifact.status} />
      <p>Version: {artifact.version}</p>
      <p>Created: {formatDate(artifact.created_at)}</p>
      {artifact.status === 'DRAFT' && onApprove && (
        <button onClick={() => onApprove(artifact.type)}>Approve</button>
      )}
    </div>
  );
};

export default ArtifactCard;