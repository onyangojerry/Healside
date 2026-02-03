from pydantic import BaseModel
from typing import List, Optional
from app.core.rbac import Role

class CaseBundle(BaseModel):
    patient_id: str
    encounter_id: str
    conditions: List[dict]
    observations: List[dict]
    home_meds: List[dict]
    discharge_meds: List[dict]
    document_text: str
    contact_preferences: dict
    preferred_language: str

class IngestCaseRequest(BaseModel):
    bundle: CaseBundle

class CaseResponse(BaseModel):
    id: str
    external_patient_id: str
    encounter_id: str
    condition_focus: str
    state: str
    assigned_role: Role
    risk_flags: List[str]
    created_at: str
    updated_at: str

class CaseListResponse(BaseModel):
    cases: List[CaseResponse]
    total: int

class OrchestrateRequest(BaseModel):
    pass

class Artifact(BaseModel):
    id: str
    type: str
    version: int
    status: str
    content: dict
    sources_used: List[str]
    citations: Optional[List[str]] = None
    qa_metadata: Optional[dict] = None
    created_by: str
    created_at: str

class Task(BaseModel):
    id: str
    task_type: Optional[str] = None
    role: Role
    title: str
    description: str
    due_at: Optional[str] = None
    priority: str
    status: str
    started_at: Optional[str] = None
    finished_at: Optional[str] = None
    input_hash: Optional[str] = None
    correlation_id: Optional[str] = None
    error_code: Optional[str] = None
    error_message: Optional[str] = None
    created_at: str

class CaseDetailResponse(BaseModel):
    case: CaseResponse
    artifacts: List[Artifact]
    tasks: List[Task]

class AuditEvent(BaseModel):
    id: str
    event_type: str
    actor_type: str
    actor_id: str
    correlation_id: str
    event_json: dict
    created_at: str

class AuditResponse(BaseModel):
    events: List[AuditEvent]
