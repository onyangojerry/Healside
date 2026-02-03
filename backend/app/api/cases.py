from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.cases import IngestCaseRequest, CaseResponse, CaseListResponse, CaseDetailResponse, AuditResponse, OrchestrateRequest
from app.db.models import Case, CaseBundle, CaseArtifact, Task, AuditEvent
from app.core.rbac import has_permission, Role
from app.core.auth import get_current_user
from app.workers.tasks import orchestrate_case
from app.services.audit import create_audit_event
from sqlalchemy import select
import uuid

router = APIRouter()

@router.post("/ingest", response_model=CaseResponse)
async def ingest_case(request: IngestCaseRequest, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if not has_permission(Role(current_user["role"]), [Role.ADMIN, Role.CLINICIAN]):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    case = Case(
        external_patient_id=request.bundle.patient_id,
        encounter_id=request.bundle.encounter_id,
        state="NEW",
        assigned_role="RN"
    )
    db.add(case)
    await db.commit()
    bundle = CaseBundle(case_id=case.id, bundle_json=request.bundle.dict())
    db.add(bundle)
    await db.commit()
    await create_audit_event(db, str(case.id), "CASE_CREATED", "USER", current_user["username"], {"bundle": "redacted"})
    return CaseResponse(
        id=str(case.id),
        external_patient_id=case.external_patient_id,
        encounter_id=case.encounter_id,
        condition_focus=case.condition_focus or "",
        state=case.state,
        assigned_role=Role(case.assigned_role),
        risk_flags=case.risk_flags_json or [],
        created_at=case.created_at.isoformat(),
        updated_at=case.updated_at.isoformat()
    )

@router.get("/", response_model=CaseListResponse)
async def list_cases(state: str = None, assigned_role: str = None, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    query = select(Case)
    if state:
        query = query.where(Case.state == state)
    if assigned_role:
        query = query.where(Case.assigned_role == assigned_role)
    result = await db.execute(query)
    cases = result.scalars().all()
    case_responses = [
        CaseResponse(
            id=str(c.id),
            external_patient_id=c.external_patient_id,
            encounter_id=c.encounter_id,
            condition_focus=c.condition_focus or "",
            state=c.state,
            assigned_role=Role(c.assigned_role),
            risk_flags=c.risk_flags_json or [],
            created_at=c.created_at.isoformat(),
            updated_at=c.updated_at.isoformat()
        ) for c in cases
    ]
    return CaseListResponse(cases=case_responses, total=len(case_responses))

@router.get("/{case_id}", response_model=CaseDetailResponse)
async def get_case(case_id: str, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    case = await db.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    artifacts_result = await db.execute(select(CaseArtifact).where(CaseArtifact.case_id == case_id))
    artifacts = artifacts_result.scalars().all()
    tasks_result = await db.execute(select(Task).where(Task.case_id == case_id))
    tasks = tasks_result.scalars().all()
    return CaseDetailResponse(
        case=CaseResponse(
            id=str(case.id),
            external_patient_id=case.external_patient_id,
            encounter_id=case.encounter_id,
            condition_focus=case.condition_focus or "",
            state=case.state,
            assigned_role=Role(case.assigned_role),
            risk_flags=case.risk_flags_json or [],
            created_at=case.created_at.isoformat(),
            updated_at=case.updated_at.isoformat()
        ),
        artifacts=[
            {
                "id": str(a.id),
                "type": a.type,
                "version": a.version,
                "status": a.status,
                "content": a.content_json,
                "sources_used": a.sources_used,
                "created_by": a.created_by,
                "created_at": a.created_at.isoformat()
            } for a in artifacts
        ],
        tasks=[
            {
                "id": str(t.id),
                "role": Role(t.role),
                "title": t.title,
                "description": t.description,
                "due_at": t.due_at.isoformat() if t.due_at else None,
                "priority": t.priority,
                "status": t.status,
                "created_at": t.created_at.isoformat()
            } for t in tasks
        ]
    )

@router.post("/{case_id}/orchestrate")
async def orchestrate(case_id: str, request: OrchestrateRequest, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if not has_permission(Role(current_user["role"]), [Role.ADMIN, Role.CLINICIAN]):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    case = await db.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    orchestrate_case.delay(case_id)
    return {"message": "Orchestration started"}

@router.get("/{case_id}/audit", response_model=AuditResponse)
async def get_audit(case_id: str, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    result = await db.execute(select(AuditEvent).where(AuditEvent.case_id == case_id).order_by(AuditEvent.created_at))
    events = result.scalars().all()
    return AuditResponse(events=[
        {
            "id": str(e.id),
            "event_type": e.event_type,
            "actor_type": e.actor_type,
            "actor_id": e.actor_id,
            "correlation_id": e.correlation_id,
            "event_json": e.event_json,
            "created_at": e.created_at.isoformat()
        } for e in events
    ])