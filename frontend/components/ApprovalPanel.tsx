import React, { useState } from 'react';
import { ApproveRequest } from '../lib/types';

interface ApprovalPanelProps {
  caseId: string;
  artifactType: string;
  onApprove: (data: ApproveRequest) => void;
}

const ApprovalPanel: React.FC<ApprovalPanelProps> = ({ caseId, artifactType, onApprove }) => {
  const [decision, setDecision] = useState('APPROVE');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onApprove({ artifact_type: artifactType, decision, notes });
  };

  return (
    <div className="approval-panel">
      <h4>Approve {artifactType}</h4>
      <select value={decision} onChange={e => setDecision(e.target.value)}>
        <option value="APPROVE">Approve</option>
        <option value="REJECT">Reject</option>
      </select>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ApprovalPanel;