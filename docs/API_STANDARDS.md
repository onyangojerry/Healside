# API Standards

## REST Conventions

- Resource-based URLs: /v1/cases/{id}
- HTTP Methods: GET (read), POST (create), PUT (update), DELETE (remove)
- Versioning: URL-based (/v1/), with deprecation notices
- Idempotency: Required for mutations; use request IDs
- Pagination: Standard offset/limit with total count
- Filtering/Sorting: Query params

## Error Model and Codes

- Response Format: JSON { "error": { "code": "INVALID_INPUT", "message": "Detailed description", "details": {} } }
- Codes: 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 422 (Unprocessable Entity), 500 (Internal Error)
- Client errors for validation; server for system issues

## Authentication and Authorization

- Protocol: OAuth2 with JWT tokens
- Scopes: read:cases, write:cases, approve:comms, admin
- Token Expiry: 1 hour; refresh tokens
- Service Auth: API keys or mutual TLS

## Rate Limiting and Quotas

- Per User: 100 requests/minute
- Per IP: 1000 requests/minute
- Headers: X-Rate-Limit-Remaining, X-Rate-Limit-Reset

## OpenAPI Requirements

- All APIs documented in OpenAPI 3.0 spec
- Hosted at /docs
- Validation: Schemas for requests/responses

## Correlation IDs and Tracing

- Headers: X-Correlation-ID (generated if missing)
- Propagated through all services
- Traces: OpenTelemetry integration

## PII/PHI Policy in Payloads

- No PHI in URLs or headers
- Encrypted fields in body for sensitive data
- Redaction in logs

## Webhooks/Events Model

- Events: case.created, approval.needed, sent
- Payload: JSON with event type, data, timestamp
- Security: HMAC signature for verification
- Retry: Exponential backoff