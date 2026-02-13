# Deployment Guide

## Local Development
Use Docker Compose from `infra/docker-compose.yml`. See `infra/README.md` for steps.

## Production (Kubernetes)
Apply manifests from `infra/k8s/`. Use managed Postgres/Redis. Ensure TLS at ingress.

Environment Variables:
- Backend: DATABASE_URL, REDIS_URL, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
- Frontend: NEXT_PUBLIC_BACKEND_BASE_URL
 - LLM: LLM_PROVIDER, OLLAMA_BASE_URL, OLLAMA_MODEL

Migrations: Run `alembic upgrade head` in backend container.

## Agent Activation v1

- Orchestration is triggered via `POST /v1/cases/{case_id}/orchestrate`.
- Worker must be running for agent execution:
  - `celery -A app.workers.celery_app worker --loglevel=info`
- When using LLMs, run an Ollama server and set `LLM_PROVIDER=ollama` (default model: `phi3:mini`).
