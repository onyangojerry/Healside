# Technology Stack

## Chosen Technologies

- **Backend**: FastAPI (Python) for API and orchestrator
- **Database**: PostgreSQL for structured data
- **Queue/Workers**: Redis + Celery for async tasks
- **Frontend**: Next.js (React) for web UI
- **Infrastructure**: Docker, Kubernetes/ECS
- **Observability**: OpenTelemetry, Prometheus, Jaeger
- **Security**: OAuth2/JWT, AWS KMS
- **AI/Agents**: OpenAI API or similar for LLMs

## Justifications and Alternatives

- **FastAPI**: High performance, async support, auto-generated OpenAPI docs. Alternatives: Express.js (Node), but Python for AI integration.
- **PostgreSQL**: ACID, JSON support for FHIR. Alternatives: MongoDB (NoSQL), but relational for consistency.
- **Celery/Redis**: Mature Python queue. Alternatives: Temporal (better for workflows).
- **Next.js**: SSR for performance, TypeScript. Alternatives: Vue.js, but React ecosystem.
- **Kubernetes**: Scalable orchestration. Alternatives: ECS for AWS-native.

## Data Storage Approach

- **Primary DB**: PostgreSQL for cases, workflows, users
- **Document Storage**: S3 for PDFs/text
- **Cache**: Redis for sessions, queues

## Infrastructure Approach

- **Local**: Docker Compose
- **Cloud**: AWS (HIPAA eligible); VPC, security groups
- **IaC**: Terraform