import React, { useMemo, useState } from 'react';
import { ApproveRequest, Artifact } from '../lib/api/types';
import { formatDateTime, formatRole } from '../utils/format';
import { useAuth } from '../lib/auth/session';

interface ApprovalPanelProps {
  artifact: Artifact;
  approvalKey: ApproveRequest['artifact_type'];
  onSubmit: (request: ApproveRequest) => Promise<void>;
  blocked?: boolean;
}

const ApprovalPanel: React.FC<ApprovalPanelProps> = ({ artifact, approvalKey, onSubmit, blocked }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState('');
  const [open, setOpen] = useState(false);
  const [decision, setDecision] = useState<ApproveRequest['decision']>('APPROVE');
  const [loading, setLoading] = useState(false);

  const details = useMemo(
    () => ({
      artifactType: artifact.type.replace(/_/g, ' '),
      version: artifact.version,
      updatedAt: formatDateTime(artifact.created_at),
      role: formatRole(user?.role),
    }),
    [artifact, user]
  );

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onSubmit({ artifact_type: approvalKey, decision, notes });
      setOpen(false);
      setNotes('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="approval-panel">
      <div className="approval-panel__header">
        <div>
          <div className="approval-title">Approval</div>
          <div className="approval-subtitle">Explicit confirmation required.</div>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setOpen(true)}
          disabled={blocked}
        >
          {blocked ? 'Blocked by escalation' : 'Open approval'}
        </button>
      </div>

      {open && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal__content">
            <div className="modal__header">
              <h3>Confirm approval</h3>
              <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <div className="modal__body">
              <div className="modal-grid">
                <div>
                  <span className="modal-label">Artifact</span>
                  <span>{details.artifactType}</span>
                </div>
                <div>
                  <span className="modal-label">Version</span>
                  <span>v{details.version}</span>
                </div>
                <div>
                  <span className="modal-label">Last updated</span>
                  <span>{details.updatedAt}</span>
                </div>
                <div>
                  <span className="modal-label">Approver role</span>
                  <span>{details.role}</span>
                </div>
              </div>
              <label className="form-label">
                Decision
                <select value={decision} onChange={(event) => setDecision(event.target.value as ApproveRequest['decision'])}>
                  <option value="APPROVE">Approve</option>
                  <option value="REJECT">Reject</option>
                </select>
              </label>
              <label className="form-label">
                Notes (optional)
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
              </label>
            </div>
            <div className="modal__footer">
              <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleConfirm} disabled={loading}>
                {loading ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalPanel;
