import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

correlation_id_context = {}

def get_correlation_id():
    return correlation_id_context.get("correlation_id")

class CorrelationIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        correlation_id = request.headers.get("x-correlation-id", str(uuid.uuid4()))
        correlation_id_context["correlation_id"] = correlation_id
        response = await call_next(request)
        response.headers["x-correlation-id"] = correlation_id
        return response