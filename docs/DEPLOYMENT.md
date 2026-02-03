# Deployment Guide

## Local Development
Use Docker Compose from `infra/docker-compose.yml`. See `infra/README.md` for steps.

## Production (Kubernetes)
Apply manifests from `infra/k8s/`. Use managed Postgres/Redis. Ensure TLS at ingress.

Environment Variables:
- Backend: DATABASE_URL, REDIS_URL, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
- Frontend: NEXT_PUBLIC_BACKEND_BASE_URL

Migrations: Run `alembic upgrade head` in backend container.