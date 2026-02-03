# Local Infrastructure Runbook

This directory contains Docker Compose configuration for local development.

## Prerequisites
- Docker and Docker Compose installed.
- Copy `infra/.env.example` to `infra/.env` and set `SECRET_KEY`.

## Running the Stack
1. From the repo root: `docker compose -f infra/docker-compose.yml up --build`
2. Run migrations: `docker compose -f infra/docker-compose.yml exec backend alembic upgrade head`
3. Seed data: `docker compose -f infra/docker-compose.yml exec backend python scripts/seed_cases.py`
4. Access frontend at http://localhost:3000, backend at http://localhost:8000.

## Health Checks
- Backend: http://localhost:8000/v1/health
- Frontend: http://localhost:3000

## Teardown
`docker compose -f infra/docker-compose.yml down -v`