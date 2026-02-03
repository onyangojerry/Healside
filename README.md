# Healside: Agentic Post-Discharge Follow-Up for Heart Failure Patients

## Overview

Healside is a production-ready agentic system designed to automate and secure post-discharge follow-up for Heart Failure (HF) patients. The system ensures safety, privacy, and compliance while providing closed-loop workflows for care coordination.

## Architecture Summary

The system consists of:
- **Backend Service**: API and orchestrator for workflow management.
- **Worker System**: Queue-based agents for specialized tasks.
- **Web UI**: Case inbox and review interface for human approvals.
- **Infrastructure**: Docker Compose for local dev, Kubernetes/ECS for production.

For detailed architecture, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Development Workflow

1. Clone the repository.
2. Set up local environment: `docker-compose up` in infra/.
3. Run tests: See [docs/TESTING.md](docs/TESTING.md).
4. Deploy: See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Security and Compliance

All development must adhere to [docs/SECURITY.md](docs/SECURITY.md) and [docs/STANDARD_COMPLIANCE_REPORT.md](docs/STANDARD_COMPLIANCE_REPORT.md).

## Team Roles

See [docs/TEAMROLES.md](docs/TEAMROLES.md) for RACI and responsibilities.

## Technology Stack

See [docs/TECHNOLOGY_STACK.md](docs/TECHNOLOGY_STACK.md).

## License

See LICENSE.