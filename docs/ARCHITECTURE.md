# Architecture

Services: Postgres (5432), Redis (6379), Backend (8000), Worker (Celery), Frontend (3000). Internal network in Docker Compose, ClusterIP in K8s.

## Data Flow Diagram

```mermaid
flowchart LR
  user["Clinical Staff (Browser)"] -->|Login / Case actions| fe["Frontend (Next.js)"]
  fe -->|JWT auth, read/write| api["Backend API (FastAPI)"]
  api -->|Read/write| db[(Postgres)]
  api -->|Enqueue orchestration| queue[(Redis)]
  worker["Worker (Celery)"] -->|Dequeue| queue
  worker -->|Generate artifacts, tasks, audit events| db
  api -->|Read artifacts, tasks, audit| db
  api -->|Audit events| db
  fe -->|Correlation ID header| api
```

### Data Notes
- Draft artifacts and tasks are created by the worker and stored in Postgres.
- Approvals and audit events are written by the API.
- Frontend includes correlation IDs in every request for traceability.

## Agent Activation v1 Runtime Topology

1. API receives `/v1/cases/{case_id}/orchestrate` and enqueues a worker task with a correlation ID.
2. Worker executes deterministic agents in order:
   - Data Completeness
   - Draft Generation
   - QA/Policy
3. Artifacts and tasks are persisted with versioning and audit events for every step.
4. State transitions are explicit and stored on the `cases.state` field.

## Scalability and Reliability

- Horizontal scaling via Kubernetes.
- Circuit breakers, retries.
- Disaster recovery: Multi-AZ, backups.
