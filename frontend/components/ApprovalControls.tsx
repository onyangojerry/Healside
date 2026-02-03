import React, { useState } from 'react';
import { ApproveRequest, ApprovalArtifactKey } from '../lib/types';

interface ApprovalControlsProps {
  caseId: string;
  onApprove: (data: ApproveRequest) => void;
}

const ApprovalControls: React.FC<ApprovalControlsProps> = ({ caseId, onApprove }) => {
  const [artifactType, setArtifactType] = useState<ApprovalArtifactKey>('summary');
  const [decision, setDecision] = useState<ApproveRequest['decision']>('APPROVE');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onApprove({ artifact_type: artifactType, decision, notes });
  };

  return (
    <div>
      <select value={artifactType} onChange={e => setArtifactType(e.target.value as ApprovalArtifactKey)}>
        <option value="summary">Summary</option>
        <option value="medrec">Med Rec</option>
        <option value="outreach">Outreach</option>
        <option value="scheduling">Scheduling</option>
      </select>
      <select value={decision} onChange={e => setDecision(e.target.value as ApproveRequest['decision'])}>
        <option value="APPROVE">Approve</option>
        <option value="REJECT">Reject</option>
      </select>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
      <button onClick={handleSubmit}>Approve</button>
    </div>
  );
};

export default ApprovalControls;
