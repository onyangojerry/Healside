import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { apiClient, ApiError } from '../lib/api/client';
import { ApprovalArtifactMap } from '../lib/api/adapter';
import { Artifact, CaseDetailResponse, AuditEvent } from '../lib/api/types';
import { useAuth } from '../lib/auth/session';
import { formatDateTime, formatRole, formatShortId, redactText } from '../utils/format';
import { STATUS_CONFIG } from '../utils/status';
import Panel from './Panel';
import StatusBadge from './StatusBadge';
import ArtifactCard from './ArtifactCard';
import ApprovalPanel from './ApprovalPanel';
import AuditTimeline from './AuditTimeline';
import InlineError from './InlineError';
import { useToast } from './ToastHost';

const CaseDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [data, setData] = useState<CaseDetailResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);

  const fetchDetail = async (caseId: string) => {
    setLoading(true);
    try {
      const detail = await apiClient.getCase(caseId);
      const audit = await apiClient.audit(caseId);
      setData(detail);
      setAuditEvents(audit.events);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof id === 'string') {
      fetchDetail(id);
    }
  }, [id]);

  const caseId = typeof id === 'string' ? id : '';

  const escalationBlocked = data?.case.state === 'ESCALATION_REQUIRED';

  const artifactsByType = useMemo(() => {
    const map: Record<string, Artifact[]> = {};
    data?.artifacts.forEach((artifact) => {
      map[artifact.type] = map[artifact.type] || [];
      map[artifact.type].push(artifact);
    });
    return map;
  }, [data]);

  const handleOrchestrate = async () => {
    if (!caseId) return;
    await apiClient.orchestrate(caseId);
    pushToast({ type: 'success', message: 'Orchestration started.' });
  };

  const handleApprove = async (artifact: Artifact) => {
    const approvalKey = ApprovalArtifactMap[artifact.type];
    if (!approvalKey || !caseId) return;
    await apiClient.approve(caseId, { artifact_type: approvalKey, decision: 'APPROVE', notes: null });
    pushToast({ type: 'success', message: `${artifact.type} approval recorded.` });
    await fetchDetail(caseId);
  };

  const handleCopyError = () => {
    if (!error) return;
    const payload = `Error: ${error.message}\nDetails: ${error.details}\nCorrelation ID: ${error.correlationId}`;
    navigator.clipboard.writeText(payload).then(() => {
      pushToast({ type: 'info', message: 'Error details copied.' });
    });
  };

  if (loading && !data) {
    return <div className="page">Loading case...</div>;
  }

  if (!data) {
    return (
      <div className="page">
        {error && (
          <InlineError
            message={error.details || error.message}
            correlationId={error.correlationId}
            onCopy={handleCopyError}
          />
        )}
      </div>
    );
  }

  const caseSummary = data.case;

  const schedulingArtifacts = artifactsByType.SCHEDULING_REQUEST || artifactsByType.SCHED || [];
  const outreachArtifacts = artifactsByType.OUTREACH_DRAFTS || artifactsByType.OUTREACH || [];

  return (
    <div className="page">
      <div className="case-summary">
        <div>
          <h1>Case {formatShortId(caseSummary.id)}</h1>
          <div className="case-meta">
            <StatusBadge status={caseSummary.state} />
            <span>Discharge: {formatDateTime(caseSummary.created_at)}</span>
            <span>Assigned: {formatRole(caseSummary.assigned_role)}</span>
          </div>
        </div>
        <div className="case-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleOrchestrate}
            disabled={!['clinician', 'admin'].includes(user?.role || '')}
          >
            Run orchestrator
          </button>
          <button type="button" className="btn btn-ghost" disabled>
            Close case (requires approvals)
          </button>
        </div>
      </div>

      <Panel
        title="Workflow"
        status={caseSummary.state}
        footer={<span>Last updated {formatDateTime(caseSummary.updated_at)}</span>}
      >
        <div className="workflow-grid">
          <div>
            <div className="workflow-label">State</div>
            <div className="workflow-value">{STATUS_CONFIG[caseSummary.state]?.label || caseSummary.state}</div>
          </div>
          <div>
            <div className="workflow-label">Blockers</div>
            <div className="workflow-value">
              {caseSummary.state === 'ESCALATION_REQUIRED' ? 'Escalation required' : 'None'}
            </div>
          </div>
          <div>
            <div className="workflow-label">Next action</div>
            <div className="workflow-value">{STATUS_CONFIG[caseSummary.state]?.nextAction || 'Review'}</div>
          </div>
          <div>
            <div className="workflow-label">Risk flags</div>
            <div className="workflow-value">{caseSummary.risk_flags?.length ? caseSummary.risk_flags.join(', ') : 'None'}</div>
          </div>
        </div>
        {caseSummary.state === 'ESCALATION_REQUIRED' && (
          <div className="alert critical">
            Escalation required. Outreach approvals are blocked until clinician review.
          </div>
        )}
      </Panel>

      <Panel title="Summary" status={caseSummary.state}>
        {artifactsByType.SUMMARY?.map((artifact) => (
          <div key={artifact.id} className="artifact-stack">
            <ArtifactCard
              artifact={artifact}
              allowApprove={user?.role === 'clinician'}
              onApprove={() => handleApprove(artifact)}
              draftOnly
            />
            {user?.role === 'clinician' && (
              <ApprovalPanel
                artifact={artifact}
                approvalKey="summary"
                onSubmit={async (request) => {
                  await apiClient.approve(caseId, request);
                  pushToast({ type: 'success', message: 'Summary approval recorded.' });
                  await fetchDetail(caseId);
                }}
              />
            )}
          </div>
        )) || <div className="muted">No summary artifact available.</div>}
      </Panel>

      <Panel title="Medication Reconciliation">
        {artifactsByType.MEDREC?.map((artifact) => (
          <div key={artifact.id} className="artifact-stack">
            <ArtifactCard
              artifact={artifact}
              allowApprove={user?.role === 'pharmacist'}
              onApprove={() => handleApprove(artifact)}
              draftOnly
            />
            {user?.role === 'pharmacist' && (
              <ApprovalPanel
                artifact={artifact}
                approvalKey="medrec"
                onSubmit={async (request) => {
                  await apiClient.approve(caseId, request);
                  pushToast({ type: 'success', message: 'Med rec approval recorded.' });
                  await fetchDetail(caseId);
                }}
              />
            )}
          </div>
        )) || <div className="muted">No medication reconciliation artifact available.</div>}
      </Panel>

      <Panel title="Follow-up Plan">
        <div className="task-list">
          {data.tasks.length === 0 && <div className="muted">No tasks generated.</div>}
          {data.tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-title">{task.title}</div>
              <div className="task-desc">{redactText(task.description)}</div>
              <div className="task-meta">
                Due: {formatDateTime(task.due_at)} • Priority: {task.priority} • Status: {task.status}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Scheduling">
        {schedulingArtifacts.length > 0 ? (
          schedulingArtifacts.map((artifact) => (
            <div key={artifact.id} className="artifact-stack">
              <ArtifactCard
                artifact={artifact}
                allowApprove={user?.role === 'scheduler'}
                onApprove={() => handleApprove(artifact)}
                draftOnly
              />
              {user?.role === 'scheduler' && (
                <ApprovalPanel
                  artifact={artifact}
                  approvalKey="scheduling"
                  onSubmit={async (request) => {
                    await apiClient.approve(caseId, request);
                    pushToast({ type: 'success', message: 'Scheduling approval recorded.' });
                    await fetchDetail(caseId);
                  }}
                />
              )}
            </div>
          ))
        ) : (
          <div className="muted">No scheduling request generated.</div>
        )}
      </Panel>

      <Panel title="Outreach">
        {outreachArtifacts.length > 0 ? (
          outreachArtifacts.map((artifact) => (
            <div key={artifact.id} className="artifact-stack">
              <ArtifactCard
                artifact={artifact}
                allowApprove={user?.role === 'clinician'}
                onApprove={() => handleApprove(artifact)}
                blocked={escalationBlocked}
                draftOnly
              />
              {user?.role === 'clinician' && (
                <ApprovalPanel
                  artifact={artifact}
                  approvalKey="outreach"
                  onSubmit={async (request) => {
                    await apiClient.approve(caseId, request);
                    pushToast({ type: 'success', message: 'Outreach approval recorded.' });
                    await fetchDetail(caseId);
                  }}
                  blocked={escalationBlocked}
                />
              )}
            </div>
          ))
        ) : (
          <div className="muted">No outreach drafts available.</div>
        )}
      </Panel>

      <Panel title="Audit">
        <AuditTimeline events={auditEvents} />
      </Panel>
    </div>
  );
};

export default CaseDetail;
