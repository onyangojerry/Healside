import uuid
import pytest
from fastapi import HTTPException

from app.api.approvals import approve
from app.db.models import Case, CaseArtifact, User
from app.schemas.approvals import ApproveRequest
from app.core.auth import get_password_hash


@pytest.mark.asyncio
async def test_escalation_blocks_outreach(db_session):
    case_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())

    user = User(id=user_id, username="clinician", password_hash=get_password_hash("clinician"), role="clinician")
    case = Case(id=case_id, state="ESCALATION_REQUIRED", assigned_role="clinician")
    artifact = CaseArtifact(case_id=case_id, type="OUTREACH_DRAFTS", status="DRAFT", content_json={}, sources_used=[])

    db_session.add_all([user, case, artifact])
    await db_session.commit()

    req = ApproveRequest(artifact_type="outreach", decision="APPROVE")
    with pytest.raises(HTTPException):
        await approve(case_id, req, db_session, {"username": "clinician", "role": "clinician", "user_id": user_id})


@pytest.mark.asyncio
async def test_approval_rbac_enforced(db_session):
    case_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())

    user = User(id=user_id, username="viewer", password_hash=get_password_hash("viewer"), role="viewer")
    case = Case(id=case_id, state="HUMAN_REVIEW_REQUIRED", assigned_role="viewer")
    artifact = CaseArtifact(case_id=case_id, type="SUMMARY", status="DRAFT", content_json={}, sources_used=[])

    db_session.add_all([user, case, artifact])
    await db_session.commit()

    req = ApproveRequest(artifact_type="summary", decision="APPROVE")
    with pytest.raises(HTTPException):
        await approve(case_id, req, db_session, {"username": "viewer", "role": "viewer", "user_id": user_id})
