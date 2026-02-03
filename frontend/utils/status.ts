export type StatusConfig = {
  label: string;
  description: string;
  nextAction: string;
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'critical';
};

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  NEW: { label: 'New', description: 'Case ingested, awaiting processing.', nextAction: 'Start orchestration.', tone: 'info' },
  ELIGIBLE: { label: 'Eligible', description: 'Meets criteria for follow-up.', nextAction: 'Collect required data.', tone: 'info' },
  DATA_READY: { label: 'Data Ready', description: 'All required data fetched.', nextAction: 'Generate drafts.', tone: 'info' },
  DRAFT_READY: { label: 'Draft Ready', description: 'Draft artifacts generated.', nextAction: 'Run QA checks.', tone: 'info' },
  QA_PASSED: { label: 'QA Passed', description: 'Automated checks complete.', nextAction: 'Human review.', tone: 'success' },
  HUMAN_REVIEW_REQUIRED: { label: 'Human Review', description: 'Awaiting human approval.', nextAction: 'Approve artifacts.', tone: 'warning' },
  APPROVED: { label: 'Approved', description: 'Artifacts approved.', nextAction: 'Close case.', tone: 'success' },
  CLOSED: { label: 'Closed', description: 'Workflow completed.', nextAction: 'No action required.', tone: 'neutral' },
  NEEDS_DATA: { label: 'Needs Data', description: 'Missing required inputs.', nextAction: 'Resolve data gaps.', tone: 'warning' },
  NEEDS_HUMAN: { label: 'Needs Human', description: 'Manual intervention required.', nextAction: 'Assign clinician.', tone: 'warning' },
  BLOCKED_SCHEDULING: { label: 'Blocked Scheduling', description: 'Scheduling could not proceed.', nextAction: 'Resolve blocker.', tone: 'warning' },
  COMMS_FAILED: { label: 'Comms Failed', description: 'Outbound communication failed.', nextAction: 'Retry or escalate.', tone: 'warning' },
  ESCALATION_REQUIRED: { label: 'Escalation Required', description: 'Urgent red flags present.', nextAction: 'Immediate clinician review.', tone: 'critical' },
};

export const ARTIFACT_STATUS: Record<string, StatusConfig> = {
  DRAFT: { label: 'Draft', description: 'Draft awaiting review.', nextAction: 'Review and approve.', tone: 'warning' },
  APPROVED: { label: 'Approved', description: 'Approved for use.', nextAction: 'Proceed.', tone: 'success' },
  REJECTED: { label: 'Rejected', description: 'Rejected by reviewer.', nextAction: 'Revise and resubmit.', tone: 'critical' },
};
