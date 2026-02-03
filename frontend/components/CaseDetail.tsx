import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiClient } from '../lib/api';
import { CaseDetail as CaseDetailType, Artifact, Task, AuditEvent, ApproveRequest } from '../lib/types';
import Panel from './Panel';
import ArtifactCard from './ArtifactCard';
import AuditTimeline from './AuditTimeline';
import ApprovalPanel from './ApprovalPanel';
import StatusBadge from './StatusBadge';

const CaseDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<CaseDetailType | null>(null);
  const [audit, setAudit] = useState<AuditEvent[]>([]);

  useEffect(() => {
    if (id) {
      apiClient.getCase(id as string).then(setData);
      apiClient.getAudit(id as string).then(res => setAudit(res.events));
    }
  }, [id]);

  const handleOrchestrate = () => {
    apiClient.orchestrateCase(id as string);
  };

  const handleApprove = (req: ApproveRequest) => {
    apiClient.approveCase(id as string, req);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <div className="case-header">
        <h2>Case {data.case.id}</h2>
        <StatusBadge status={data.case.state} />
        <button onClick={handleOrchestrate}>Run Orchestrator</button>
      </div>
      <Panel title="Workflow" status={data.case.state}>
        <p>Current state: {data.case.state}</p>
      </Panel>
      <Panel title="Summary">
        {data.artifacts.filter(a => a.type === 'SUMMARY').map(a => (
          <ArtifactCard key={a.id} artifact={a} onApprove={type => handleApprove({ artifact_type: type, decision: 'APPROVE' })} />
        ))}
      </Panel>
      <Panel title="Medication Reconciliation">
        {data.artifacts.filter(a => a.type === 'MEDREC').map(a => (
          <ArtifactCard key={a.id} artifact={a} />
        ))}
      </Panel>
      <Panel title="Follow-Up Plan">
        {data.tasks.map(t => <p key={t.id}>{t.title}: {t.description}</p>)}
      </Panel>
      <Panel title="Scheduling">
        {data.artifacts.filter(a => a.type === 'SCHEDULING_REQUEST').map(a => (
          <ArtifactCard key={a.id} artifact={a} />
        ))}
      </Panel>
      <Panel title="Outreach">
        {data.artifacts.filter(a => a.type === 'OUTREACH_DRAFTS').map(a => (
          <ArtifactCard key={a.id} artifact={a} onApprove={type => handleApprove({ artifact_type: type, decision: 'APPROVE' })} />
        ))}
      </Panel>
      <Panel title="Audit">
        <AuditTimeline events={audit} />
      </Panel>
    </div>
  );
};

export default CaseDetail;