from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import cases, approvals, auth
from app.core import correlation_id

app = FastAPI(
    title="Healside API",
    description="Closed-loop post-discharge follow-up for Heart Failure patients",
    version="1.0.0",
    openapi_tags=[
        {"name": "auth", "description": "Authentication endpoints"},
        {"name": "cases", "description": "Case management"},
        {"name": "approvals", "description": "Approval workflows"},
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(correlation_id.CorrelationIdMiddleware)

app.include_router(auth.router, prefix="/v1/auth", tags=["auth"])
app.include_router(cases.router, prefix="/v1/cases", tags=["cases"])
app.include_router(approvals.router, prefix="/v1/cases", tags=["approvals"])

@app.get("/v1/health", tags=["health"])
def health():
    return {"status": "healthy"}
