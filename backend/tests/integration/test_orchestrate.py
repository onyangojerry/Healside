import uuid
import pytest
from sqlalchemy import select

from app.db.models import Case, CaseBundle, Task, AuditEvent, CaseArtifact
from app.services.orchestrator import Orchestrator, TASK_QA_POLICY


@pytest.mark.asyncio
async def test_orchestrate_idempotency_and_audit(db_session):
    case_id = str(uuid.uuid4())
    case = Case(
        id=case_id,
        external_patient_id="p123",
        encounter_id="e123",
        state="NEW",
        assigned_role="rn",
        risk_flags_json=[],
    )
    db_session.add(case)
    bundle = CaseBundle(
        case_id=case_id,
        bundle_json={
            "patient_id": "p123",
            "encounter_id": "e123",
            "conditions": [{"display": "Heart Failure"}],
            "observations": [],
            "home_meds": [{"name": "MedA"}],
            "discharge_meds": [{"name": "MedA"}],
            "document_text": "Discharge summary",
            "contact_preferences": {},
            "preferred_language": "en",
        },
    )
    db_session.add(bundle)
    await db_session.commit()

    orchestrator = Orchestrator(db_session)
    await orchestrator.process_case(case_id)
    await orchestrator.process_case(case_id)

    tasks = await db_session.execute(select(Task).where(Task.case_id == case_id, Task.task_type == TASK_QA_POLICY))
    assert len(tasks.scalars().all()) == 1

    audits = await db_session.execute(select(AuditEvent).where(AuditEvent.case_id == case_id))
    assert len(audits.scalars().all()) > 0

    artifacts = await db_session.execute(select(CaseArtifact).where(CaseArtifact.case_id == case_id))
    assert len(artifacts.scalars().all()) > 0
