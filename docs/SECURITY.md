# Security

Secrets handled via env vars and Kubernetes secrets. No secrets in code. Containers run as non-root. Postgres/Redis internal only. TLS recommended for production.

## Test Data Rules
Tests use synthetic data only; no PHI. Auth testing verifies UI gating but relies on backend for enforcement.
  - Administrative: Policies, training, risk assessments.
  - Technical: Access controls, encryption, integrity checks.
  - Physical: Cloud provider safeguards.
- **SOC2 Controls**: Availability (uptime SLAs), Confidentiality (encryption), Integrity (audits).
- **OWASP ASVS Top Areas**: Authentication, Authorization, Session Management, Data Protection.

## Third-Party Risk Considerations

- **LLM Vendor**: Data processing agreement ensuring no PHI used for training; model hosted in HIPAA-compliant environment.
- **SMS/Email Vendor**: HIPAA-compliant (e.g., Twilio with BAA).
- **Cloud Provider**: SOC2 Type II certified; use of VPCs, firewalls.