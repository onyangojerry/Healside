# Testing

Run integration tests with Docker Compose: `docker compose -f infra/docker-compose.yml up -d` then execute tests in backend container.

## Frontend Testing

### Types of Tests
- Unit: Pure functions and helpers.
- Integration: Component flows with mocked API.
- E2E: Critical user paths with Playwright (requires backend running).

### Running Tests
- Unit/Integration: `npm run test` (7 tests passing)
- E2E: `npm run test:e2e` (requires `docker compose -f infra/docker-compose.yml up` first)
- CI: `npm run test:ci`

### Test Coverage
- Login form: successful/failed login
- Case inbox: renders KPI and cases, navigation
- Case detail: renders panels
- Approval controls: approve action
- Correlation ID: header injection

### Adding Tests
Place in /frontend/test/ for unit/integration, /frontend/e2e/ for E2E. Use fixtures for data.

### CI Expectations
All tests pass on PRs; E2E on main merges.

## Agent Activation Tests

Backend tests for agent activation use `TEST_DATABASE_URL` pointing to a disposable Postgres instance.

Example:

```
export TEST_DATABASE_URL=postgresql+asyncpg://user:password@localhost:5433/healside
pytest tests/unit/test_agents.py tests/unit/test_approvals.py tests/integration/test_orchestrate.py
```
