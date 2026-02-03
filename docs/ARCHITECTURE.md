# Architecture

## Overview

Healside employs a microservices architecture with agentic orchestration to ensure scalability, security, and modularity. The system separates concerns into data plane, control plane, and observability plane.

## High-Level Components

- **Backend Service**: REST API (FastAPI) for external integrations and internal UI. Includes workflow orchestrator (Temporal or similar).
- **Worker System**: Queue-based (Celery/Redis) for asynchronous agent tasks.
- **Web UI**: React/Next.js application for case management and approvals.
- **Infrastructure**: Docker Compose for local, Kubernetes/ECS for production.

## Data Plane

- **Responsibilities**: FHIR data ingestion, document processing, secure storage.
- **Storage**: PostgreSQL for structured data, S3 for documents.
- **Security**: Encryption at rest, access controls.

## Control Plane

- **Responsibilities**: Workflow orchestration, policy enforcement, human approvals.
- **Orchestrator**: Manages state machine, triggers agents.
- **Agents**: Specialized workers for tasks (see [docs/ALGORITHM_RESEARCH.md](docs/ALGORITHM_RESEARCH.md)).

## Observability Plane

- **Responsibilities**: Logging, metrics, tracing, audits.
- **Tools**: OpenTelemetry, Prometheus, Jaeger.
- **Auditability**: Event sourcing for workflows.

## Agent Orchestration Design

- **Planner/Worker/Critic Pattern**: Orchestrator plans, workers execute, critic validates.
- **Tool Calling**: Agents use defined tools (e.g., FHIR query).
- **Guardrails**: Input validation, output checks, refusal for unsafe actions.
- **Human-in-the-Loop**: Approval gates in state machine.

## State Machine

See [docs/WORKFLOW.md](docs/WORKFLOW.md).

## Cloud Architecture

- **Provider**: AWS (HIPAA eligible).
- **Networking**: VPC with subnets, security groups.
- **Compute**: ECS Fargate or EKS.
- **Storage**: RDS for DB, S3 for files.
- **Security**: IAM roles, KMS for encryption.

## Scalability and Reliability

- Horizontal scaling via Kubernetes.
- Circuit breakers, retries.
- Disaster recovery: Multi-AZ, backups.