# Testing

## Test Types

- **Unit Tests**: Individual functions/methods; coverage >80%
- **Integration Tests**: API to DB; contract tests for services
- **E2E Tests**: Full user workflows; Selenium/Cypress for UI
- **Agent Evaluation Suite**:
  - Groundedness: Citation coverage >95%
  - Hallucination: Retrieval diff checks; <1% false positives
  - Safety: Classifier for "advice" phrases; block if detected
  - Regression: Golden test cases

## Security Testing

- **SAST**: Static analysis (SonarQube)
- **DAST**: Dynamic scans (OWASP ZAP)
- **Dependency Scanning**: Snyk or similar
- **Pen Testing**: Quarterly

## Load Testing Plan

- Tool: JMeter or Locust
- Scenarios: 1000 concurrent users; 10k cases/day
- Metrics: Throughput, latency, error rates

## Test Data Strategy

- **Synthetic/De-identified**: Use Faker for PII; no real PHI
- **Golden Datasets**: Fixed cases for regression
- **Environment**: Separate test DB

## Automation

- CI: Run on PR; block merge if fail
- Coverage: Report to dashboard