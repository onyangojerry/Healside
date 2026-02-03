# Healside Backend

This is the backend for the Healside system, a closed-loop post-discharge follow-up for Heart Failure patients. It is built with FastAPI, SQLAlchemy, and Celery.

## Setup

1. Ensure Python 3.11 is installed.

2. Install Poetry: `curl -sSL https://install.python-poetry.org | python3 -`

3. Install dependencies: `poetry install`

4. Set up environment variables: Copy `infra/env.example` to `.env` and fill in values.

5. Run database migrations: `alembic upgrade head`

6. Seed synthetic data: `python scripts/seed_cases.py`

7. Run the API server: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

8. Run the Celery worker: `celery -A app.workers.celery_app worker --loglevel=info`

## Environment Variables

- DATABASE_URL: PostgreSQL connection string

- REDIS_URL: Redis connection string

- SECRET_KEY: For JWT signing

- ALGORITHM: HS256

- ACCESS_TOKEN_EXPIRE_MINUTES: 30

## Testing

- Unit tests: `pytest tests/unit/`

- Integration tests: `pytest tests/integration/`

- All tests: `pytest`

- Coverage: `pytest --cov=app --cov-report=html`

## API Documentation

When the server is running, visit `http://localhost:8000/docs` for OpenAPI documentation.

## Development

- Format code: `black .` and `ruff .`

- Lint: `ruff check .`

## Security Notes

- All endpoints require authentication except /v1/health and /v1/auth/login.

- PHI is not logged; correlation IDs are used for tracing.

- Audit events are append-only.