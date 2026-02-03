# Workflow

## End-to-End State Machine

States:
- **NEW**: Case created from discharge event.
- **ELIGIBLE**: Agent confirms HF diagnosis and criteria.
- **DATA_READY**: FHIR and documents fetched.
- **DRAFT_READY**: Summaries and plans drafted.
- **QA_PASSED**: Critic agent validates.
- **HUMAN_REVIEW_REQUIRED**: Pending approval.
- **APPROVED**: Approved by human.
- **SENT/BOOKED**: Actions executed.
- **CLOSED**: Workflow complete.

Failure States:
- **NEEDS_DATA**: Missing info; task created.
- **NEEDS_HUMAN**: Escalation required.
- **BLOCKED_SCHEDULING**: Cannot book; draft request.
- **COMMS_FAILED**: Retry or escalate.

Transitions triggered by agent completion or human action.

## Agent Activation v1 Loop

1. **Data Completeness**: validates bundle completeness and eligibility. Missing data -> `NEEDS_DATA`.
2. **Draft Generation**: produces draft artifacts (SUMMARY, MEDREC, FOLLOWUP_PLAN, SCHEDULING_REQUEST, OUTREACH_DRAFTS).
3. **QA/Policy**: deterministic checks (citations, disclaimer, no advice, no PHI).
   - PASS -> `QA_PASSED` -> `HUMAN_REVIEW_REQUIRED`
   - FAIL -> `HUMAN_REVIEW_REQUIRED`
   - Severe -> `ESCALATION_REQUIRED` (blocks outreach approval)

## Human Approval Gates

- **Summary Draft**: Clinician review for accuracy.
- **Medication Flags**: Pharmacist review.
- **Communications**: Clinician approval before sending.
- **Scheduling**: Scheduler approval for bookings.

## SLA Targets

- Time to first outreach: <24h
- Reach within 72h: >80%
- Follow-up scheduled: Within 7-14 days
- Escalations: <5% of cases

## Operational Runbooks

- **NEEDS_DATA**: Notify data integration team; create task for manual fetch.
- **COMMS_FAILED**: Retry 3 times; then escalate to comms team.
- **BLOCKED_SCHEDULING**: Draft request; assign to scheduler.
- **HUMAN_REVIEW Stuck**: Alert manager after 24h.

## Task Creation

- Tasks assigned to roles: RN (outreach), Pharmacist (med rec), Scheduler (appointments).
