import React, { useMemo } from 'react';
import { Artifact } from '../lib/api/types';
import { formatDateTime, redactText } from '../utils/format';
import StatusBadge from './StatusBadge';
import SourceViewer from './SourceViewer';

interface ArtifactCardProps {
  artifact: Artifact;
  allowApprove?: boolean;
  onApprove?: () => void;
  blocked?: boolean;
  draftOnly?: boolean;
}

const safeRender = (content: Record<string, unknown>) => {
  const entries = Object.entries(content || {});
  if (entries.length === 0) {
    return <p className="muted">No structured content provided.</p>;
  }

  return (
    <div className="artifact-content">
      {entries.map(([key, value]) => {
        if (typeof value === 'string') {
          return (
            <div key={key} className="artifact-row">
              <div className="artifact-label">{key.replace(/_/g, ' ')}</div>
              <div className="artifact-value">{redactText(value)}</div>
            </div>
          );
        }
        if (Array.isArray(value)) {
          return (
            <div key={key} className="artifact-row">
              <div className="artifact-label">{key.replace(/_/g, ' ')}</div>
              <div className="artifact-value">
                <ul className="artifact-list">
                  {value.map((item, index) => (
                    <li key={`${key}-${index}`}>{redactText(String(item))}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        }
        return (
          <div key={key} className="artifact-row">
            <div className="artifact-label">{key.replace(/_/g, ' ')}</div>
            <div className="artifact-value">{redactText(JSON.stringify(value))}</div>
          </div>
        );
      })}
    </div>
  );
};

const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact, allowApprove, onApprove, blocked, draftOnly }) => {
  const meta = useMemo(() => {
    return `v${artifact.version} • ${formatDateTime(artifact.created_at)}`;
  }, [artifact.version, artifact.created_at]);

  return (
    <div className="artifact-card">
      <div className="artifact-card__header">
        <div>
          <div className="artifact-title">{artifact.type.replace(/_/g, ' ')}</div>
          <div className="artifact-meta">{meta}</div>
        </div>
        <StatusBadge status={artifact.status} kind="artifact" />
      </div>
      <div className="artifact-card__body">
        {draftOnly && <div className="draft-banner">Draft for review — do not share externally.</div>}
        {safeRender(artifact.content)}
      </div>
      <div className="artifact-card__footer">
        <SourceViewer sources={artifact.sources_used || []} artifactId={artifact.id} />
        {allowApprove && (
          <button type="button" className="btn btn-primary" onClick={onApprove} disabled={blocked}>
            {blocked ? 'Approval blocked' : 'Approve draft'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ArtifactCard;
