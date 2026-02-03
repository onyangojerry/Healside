# Kubernetes Deployment

This is a minimal production template. For production, use managed Postgres and Redis.

## Prerequisites
- Kubernetes cluster with ingress controller (e.g., nginx).
- TLS termination at ingress/load balancer.

## Deployment
1. Create namespace: `kubectl apply -f namespace.yaml`
2. Apply configs: `kubectl apply -f configmap.yaml -f secrets.yaml` (populate secrets.yaml from secrets.example.yaml)
3. Deploy: `kubectl apply -f postgres.yaml -f redis.yaml -f backend-deployment.yaml -f backend-service.yaml -f worker-deployment.yaml -f frontend-deployment.yaml -f frontend-service.yaml -f ingress.yaml`

## Notes
- Postgres/Redis are for dev/demo; use managed services in prod.
- Secrets must be base64 encoded in secrets.yaml.