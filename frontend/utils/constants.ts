export const STATUS_CONFIG: Record<string, { label: string; description: string; nextAction: string }> = {
  NEW: { label: 'New', description: 'Case ingested, awaiting processing.', nextAction: 'Run eligibility check.' },
  ELIGIBLE: { label: 'Eligible', description: 'Meets criteria for follow-up.', nextAction: 'Fetch data.' },
  DATA_READY: { label: 'Data Ready', description: 'All required data fetched.', nextAction: 'Generate drafts.' },
  DRAFT_READY: { label: 'Draft Ready', description: 'Artifacts drafted.', nextAction: 'Run QA.' },
  QA_PASSED: { label: 'QA Passed', description: 'Passed validation.', nextAction: 'Await human review.' },
  HUMAN_REVIEW_REQUIRED: { label: 'Human Review Required', description: 'Requires approval.', nextAction: 'Approve artifacts.' },
  APPROVED: { label: 'Approved', description: 'Artifacts approved.', nextAction: 'Close case.' },
  CLOSED: { label: 'Closed', description: 'Workflow complete.', nextAction: 'None.' },
  NEEDS_DATA: { label: 'Needs Data', description: 'Missing information.', nextAction: 'Escalate to data team.' },
  ESCALATION_REQUIRED: { label: 'Escalation Required', description: 'Urgent red flags.', nextAction: 'Clinician review.' },
  COMMS_FAILED: { label: 'Comms Failed', description: 'Communication error.', nextAction: 'Retry or escalate.' },
};

export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8000';