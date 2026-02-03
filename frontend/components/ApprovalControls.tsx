import React, { useState } from 'react';
import { ApproveRequest } from '../lib/types';

interface ApprovalControlsProps {
  caseId: string;
  onApprove: (data: ApproveRequest) => void;
}

const ApprovalControls: React.FC<ApprovalControlsProps> = ({ caseId, onApprove }) => {
  const [artifactType, setArtifactType] = useState('SUMMARY');
  const [decision, setDecision] = useState('APPROVE');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onApprove({ artifact_type: artifactType, decision, notes });
  };

  return (
    <div>
      <select value={artifactType} onChange={e => setArtifactType(e.target.value)}>
        <option value="SUMMARY">Summary</option>
        <option value="OUTREACH_DRAFTS">Outreach</option>
        <option value="SCHEDULING_REQUEST">Scheduling</option>
      </select>
      <select value={decision} onChange={e => setDecision(e.target.value)}>
        <option value="APPROVE">Approve</option>
        <option value="REJECT">Reject</option>
      </select>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
      <button onClick={handleSubmit}>Approve</button>
    </div>
  );
};

export default ApprovalControls;