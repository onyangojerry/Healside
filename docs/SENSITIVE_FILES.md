# Sensitive Files and Reversion Guide

This document lists sensitive files in the repository and provides commands to revert changes if needed. Always review and document changes to sensitive files before committing.

## Sensitive Files

### infra/.env.example
- **Purpose**: Template for environment variables, including SECRET_KEY.
- **Sensitivity**: Contains placeholders for secrets; actual values should not be committed.
- **Reversion**: `git checkout infra/.env.example` or `git reset --hard HEAD~1` if committed.

### infra/k8s/secrets.example.yaml
- **Purpose**: Template for Kubernetes secrets.
- **Sensitivity**: Base64 placeholders for SECRET_KEY and POSTGRES_PASSWORD.
- **Reversion**: `git checkout infra/k8s/secrets.example.yaml`.

### backend/requirements.txt
- **Purpose**: Python dependencies.
- **Sensitivity**: None directly, but ensure no hardcoded secrets in dependencies.
- **Reversion**: `git checkout backend/requirements.txt`.

### frontend/package.json
- **Purpose**: Node.js dependencies and scripts.
- **Sensitivity**: Scripts may include test commands; ensure no secrets in scripts. Added devDependencies for msw and playwright.
- **Reversion**: `git checkout frontend/package.json`.
- **Recent Changes**: Added "typecheck", "test:e2e", "test:ci" scripts; added msw and @playwright/test to devDependencies.

### frontend/test/fixtures/*.json
- **Purpose**: Synthetic test data for mocking API responses.
- **Sensitivity**: Contains synthetic data only; no real PHI.
- **Reversion**: `git checkout frontend/test/fixtures/`.

## General Reversion Commands
- Revert unstaged changes: `git checkout <file>`
- Revert staged changes: `git reset HEAD <file>`
- Revert last commit: `git reset --soft HEAD~1` (keeps changes staged)
- Force revert to previous commit: `git reset --hard HEAD~1` (loses changes)

## Checklist Before Changing Sensitive Files
- [ ] Document the change in this file.
- [ ] Ensure no real secrets are included.
- [ ] Test reversion commands.
- [ ] Commit only after review.