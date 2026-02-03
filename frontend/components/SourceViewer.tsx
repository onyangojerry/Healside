import React, { useState } from 'react';
import { useToast } from './ToastHost';

interface SourceViewerProps {
  sources: string[];
  artifactId: string;
}

const SourceViewer: React.FC<SourceViewerProps> = ({ sources, artifactId }) => {
  const [open, setOpen] = useState(false);
  const { pushToast } = useToast();

  const handleView = () => {
    setOpen(true);
  };

  const handleConfirm = () => {
    console.info('AUDIT_VIEW_SOURCE', { artifactId, sources });
    pushToast({ type: 'info', message: `Source view recorded for artifact ${artifactId}.` });
    setOpen(false);
  };

  return (
    <div className="source-viewer">
      <div className="source-viewer__header">
        <span>Sources</span>
        <button type="button" className="btn btn-ghost" onClick={handleView}>
          View source
        </button>
      </div>
      {sources.length === 0 ? (
        <div className="muted">No sources listed.</div>
      ) : (
        <ul className="source-list">
          {sources.map((source, index) => (
            <li key={`${source}-${index}`}>{source}</li>
          ))}
        </ul>
      )}

      {open && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal__content">
            <div className="modal__header">
              <h3>View source document</h3>
              <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <div className="modal__body">
              <p>
                Viewing source documents may include sensitive content. Continue only if required for review. This action
                will be recorded.
              </p>
              <div className="muted">Full document bodies are not available from the backend in this release.</div>
            </div>
            <div className="modal__footer">
              <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleConfirm}>
                Record view
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceViewer;
