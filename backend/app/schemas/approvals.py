from pydantic import BaseModel
from typing import Optional

class ApproveRequest(BaseModel):
    artifact_type: str
    decision: str  # APPROVE or REJECT
    notes: Optional[str] = None

class ApproveResponse(BaseModel):
    success: bool
    message: str