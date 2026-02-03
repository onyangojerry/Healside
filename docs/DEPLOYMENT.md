# Deployment

## Local Development

- Tool: Docker Compose (infra/docker-compose.yml)
- Services: Backend, Workers, DB, UI
- Setup: `docker-compose up`

## Staging and Production

- Platform: AWS ECS or Kubernetes
- IaC: Terraform for infra/
- Environments: Separate accounts

## CI/CD Pipeline Outline

- Trigger: PR merge
- Steps: Lint (ESLint, Black), Test (Unit/Integration), Build (Docker), Scan (SAST/DAST, Dependency), Deploy (Staging), E2E Test, Promote to Prod

## Environment Configuration Strategy

- Secrets: AWS Secrets Manager
- Config: Env vars, config maps
- Overrides: Per env

## Rollback Strategy

- Blue/Green: Switch traffic
- Rollback Time: <10 min
- Automated: Via pipeline

## Feature Flags

- Tool: LaunchDarkly
- Use: Gradual rollouts, A/B tests

## Observability

- Metrics: Request latency, error rates (Prometheus)
- Logs: Structured, PHI-redacted (CloudWatch)
- Traces: End-to-end (Jaeger)
- SLOs: 99.9% availability, <5s response time
- Alerts: PagerDuty for breaches

## Cost Considerations and Scaling

- Scaling: Horizontal pods based on CPU/memory
- Cost: Optimize instance types; monitor via AWS Cost Explorer
- Limits: Rate limits to prevent overuse