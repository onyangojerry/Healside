# Security

## Threat Model

Using STRIDE methodology:

- **Spoofing**: Mitigated by OAuth2/JWT authentication with short-lived tokens.
- **Tampering**: Encryption in transit (TLS 1.3), at rest (AES-256 via cloud KMS).
- **Repudiation**: Comprehensive audit logging with correlation IDs and tamper-evident design (e.g., log hashing).
- **Information Disclosure**: PHI/PII redaction in logs, least privilege access, data minimization.
- **Denial of Service**: Rate limiting, quotas, and autoscaling.
- **Elevation of Privilege**: Role-Based Access Control (RBAC), service-to-service authentication.

## Data Classification and Handling

- **PHI/PII**: Encrypted at rest and in transit, access restricted to authorized roles, logged for audit.
- **Non-sensitive data**: Standard encryption and access controls.
- Handling: De-identification for dev/test using synthetic data.

## Least Privilege Access Model

- User roles: Care Coordinator (read/write cases), Clinician (approve), Admin (full access).
- Service accounts: Scoped API keys or mutual TLS.

## Encryption

- **In Transit**: TLS 1.3 for all communications.
- **At Rest**: AES-256 encryption using cloud provider KMS.

## Secrets Management

- Centralized vault (e.g., AWS Secrets Manager or HashiCorp Vault).
- No hardcoded secrets; rotation policies.

## Audit Logging

- All user actions, API calls, and agent decisions logged.
- Includes timestamps, user IDs, correlation IDs.
- PHI redacted; logs tamper-evident via cryptographic hashing.
- Retention: 7 years for HIPAA compliance.

## PHI Redaction in Logs

- Automatic redaction of names, dates, MRNs using regex/NLP.
- Reviewed quarterly.

## Incident Response Plan

- **Detection**: Alerts on anomalies (e.g., unauthorized access).
- **Containment**: Isolate affected systems.
- **Eradication**: Patch vulnerabilities.
- **Recovery**: Rollback to clean state.
- **Lessons Learned**: Post-mortem review.

## Compliance Mapping

- **HIPAA Security Rule Safeguards**:
  - Administrative: Policies, training, risk assessments.
  - Technical: Access controls, encryption, integrity checks.
  - Physical: Cloud provider safeguards.
- **SOC2 Controls**: Availability (uptime SLAs), Confidentiality (encryption), Integrity (audits).
- **OWASP ASVS Top Areas**: Authentication, Authorization, Session Management, Data Protection.

## Third-Party Risk Considerations

- **LLM Vendor**: Data processing agreement ensuring no PHI used for training; model hosted in HIPAA-compliant environment.
- **SMS/Email Vendor**: HIPAA-compliant (e.g., Twilio with BAA).
- **Cloud Provider**: SOC2 Type II certified; use of VPCs, firewalls.