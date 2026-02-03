# Architecture

Services: Postgres (5432), Redis (6379), Backend (8000), Worker (Celery), Frontend (3000). Internal network in Docker Compose, ClusterIP in K8s.

## Scalability and Reliability

- Horizontal scaling via Kubernetes.
- Circuit breakers, retries.
- Disaster recovery: Multi-AZ, backups.