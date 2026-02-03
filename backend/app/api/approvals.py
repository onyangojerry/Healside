from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.approvals import ApproveRequest, ApproveResponse
from app.db.models import Case, CaseArtifact, Approval
from app.core.rbac import has_permission, Role, APPROVAL_PERMISSIONS
from app.core.auth import get_current_user
from app.services.audit import create_audit_event
from sqlalchemy import select

router = APIRouter()

@router.post("/{case_id}/approve", response_model=ApproveResponse)
async def approve(case_id: str, request: ApproveRequest, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_role = Role(current_user["role"])
    if request.artifact_type not in APPROVAL_PERMISSIONS or not has_permission(user_role, APPROVAL_PERMISSIONS[request.artifact_type]):
        raise HTTPException(status_code=403, detail="Insufficient permissions for this approval type")
    case = await db.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if request.artifact_type == "outreach" and case.state == "ESCALATION_REQUIRED":
        raise HTTPException(status_code=403, detail="Outreach approval blocked due to escalation")
    result = await db.execute(select(CaseArtifact).where(CaseArtifact.case_id == case_id, CaseArtifact.type == request.artifact_type.upper()))
    artifact = result.scalar_one_or_none()
    if not artifact:
        raise HTTPException(status_code=404, detail="Artifact not found")
    approval = Approval(
        case_id=case_id,
        artifact_id=artifact.id,
        approver_user_id=current_user["user_id"],
        approver_role=user_role.value,
        decision=request.decision,
        notes=request.notes
    )
    db.add(approval)
    artifact.status = "APPROVED" if request.decision == "APPROVE" else "REJECTED"
    await db.commit()
    await create_audit_event(db, case_id, "APPROVAL", "USER", current_user["username"], {"artifact_type": request.artifact_type, "decision": request.decision})
    required_types = ["SUMMARY", "MEDREC", "OUTREACH_DRAFTS", "SCHEDULING_REQUEST"]
    approved_count = 0
    for t in required_types:
        result = await db.execute(select(CaseArtifact).where(CaseArtifact.case_id == case_id, CaseArtifact.type == t, CaseArtifact.status == "APPROVED"))
        if result.scalar_one_or_none():
            approved_count += 1
    if approved_count == len(required_types):
        case.state = "APPROVED"
        await db.commit()
        await create_audit_event(db, case_id, "STATE_CHANGE", "SYSTEM", "approval", {"new_state": "APPROVED"})
    return ApproveResponse(success=True, message="Approval recorded")
