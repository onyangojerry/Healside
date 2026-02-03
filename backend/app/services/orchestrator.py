import hashlib
import json
from datetime import datetime

from sqlalchemy import select

from app.db.models import Case, CaseArtifact, Task, CaseBundle
from app.services.agents import EligibilityAgent, NormalizationAgent, DataCompletenessAgent, DraftGenerationAgent, QAPolicyAgent
from app.services.audit import create_audit_event
from app.core.logging import logger
from app.core.correlation_id import get_correlation_id

AGENT_VERSION = "agent_activation_v1"

TASK_DATA_COMPLETENESS = "DATA_COMPLETENESS"
TASK_DRAFT_GENERATION = "DRAFT_GENERATION"
TASK_QA_POLICY = "QA_POLICY"

TASK_STATUSES = {
    "PENDING": "PENDING",
    "RUNNING": "RUNNING",
    "COMPLETED": "COMPLETED",
    "FAILED": "FAILED",
}

class Orchestrator:
    def __init__(self, db_session):
        self.db = db_session

    async def process_case(self, case_id: str):
        case = await self.db.get(Case, case_id)
        if not case:
            raise ValueError("Case not found")

        correlation_id = get_correlation_id()
        logger.info("Starting orchestration for case", extra={"case_id": case_id, "correlation_id": correlation_id})
        await create_audit_event(self.db, case_id, "ORCHESTRATION_STARTED", "SYSTEM", "orchestrator", {"case_id": case_id})

        bundle_result = await self.db.execute(select(CaseBundle).where(CaseBundle.case_id == case_id))
        bundle = bundle_result.scalar_one_or_none()
        if not bundle:
            case.state = "NEEDS_DATA"
            await self.db.commit()
            await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "NEEDS_DATA"})
            return

        input_hash = self._hash_input(case_id, bundle.bundle_json)

        already_done = await self.db.execute(
            select(Task).where(
                Task.case_id == case_id,
                Task.task_type == TASK_QA_POLICY,
                Task.input_hash == input_hash,
                Task.status == TASK_STATUSES["COMPLETED"],
            )
        )
        if already_done.scalar_one_or_none():
            await create_audit_event(self.db, case_id, "ORCHESTRATION_SKIPPED", "SYSTEM", "orchestrator", {"reason": "idempotent"})
            return

        completeness = await self._run_task(
            case_id,
            TASK_DATA_COMPLETENESS,
            input_hash,
            lambda: DataCompletenessAgent().run(bundle.bundle_json),
        )

        if completeness.get("status") == "SKIPPED":
            completeness = {"is_complete": True, "blockers": [], "eligible": True}

        if not completeness["is_complete"]:
            case.state = "NEEDS_DATA"
            await self.db.commit()
            await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "NEEDS_DATA", "blockers": completeness["blockers"]})
            return

        eligibility_agent = EligibilityAgent()
        eligible, condition_focus = eligibility_agent.run(bundle.bundle_json)
        if not eligible:
            case.state = "NEEDS_DATA"
            await self.db.commit()
            await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "NEEDS_DATA", "blockers": ["NOT_ELIGIBLE"]})
            return
        case.condition_focus = condition_focus
        case.state = "ELIGIBLE"
        await self.db.commit()
        await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "ELIGIBLE"})

        normalized = NormalizationAgent().run(bundle.bundle_json)
        case.state = "DATA_READY"
        await self.db.commit()
        await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "DATA_READY"})

        draft_artifacts = await self._run_task(
            case_id,
            TASK_DRAFT_GENERATION,
            input_hash,
            lambda: DraftGenerationAgent().run(normalized),
        )

        if draft_artifacts.get("status") == "SKIPPED":
            created_artifacts = await self._load_existing_artifacts(case_id)
        else:
            created_artifacts = await self._persist_artifacts(case_id, draft_artifacts)
        case.state = "DRAFT_READY"
        await self.db.commit()
        await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "DRAFT_READY"})

        qa_report = await self._run_task(
            case_id,
            TASK_QA_POLICY,
            input_hash,
            lambda: QAPolicyAgent().run(created_artifacts),
        )

        if qa_report.get("status") == "SKIPPED":
            qa_report = {"status": "PASSED", "coverage": 1.0, "findings": []}

        await self._persist_qa_report(case_id, qa_report)

        if qa_report["status"] == "ESCALATION_REQUIRED":
            case.state = "ESCALATION_REQUIRED"
            await self.db.commit()
            await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "ESCALATION_REQUIRED", "findings": qa_report["findings"]})
            return

        if qa_report["status"] == "PASSED":
            case.state = "QA_PASSED"
            await self.db.commit()
            await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "QA_PASSED"})

        case.state = "HUMAN_REVIEW_REQUIRED"
        await self.db.commit()
        await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "HUMAN_REVIEW_REQUIRED", "qa_status": qa_report["status"]})

    def _hash_input(self, case_id: str, bundle_json: dict) -> str:
        payload = json.dumps({"case_id": case_id, "bundle": bundle_json, "version": AGENT_VERSION}, sort_keys=True)
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    async def _run_task(self, case_id: str, task_type: str, input_hash: str, fn):
        existing = await self.db.execute(
            select(Task).where(
                Task.case_id == case_id,
                Task.task_type == task_type,
                Task.input_hash == input_hash,
                Task.status == TASK_STATUSES["COMPLETED"],
            )
        )
        if existing.scalar_one_or_none():
            return {"status": "SKIPPED"}

        task = Task(
            case_id=case_id,
            task_type=task_type,
            status=TASK_STATUSES["PENDING"],
            input_hash=input_hash,
            correlation_id=get_correlation_id(),
            role="admin",
            title=f"Agent {task_type}",
            description="Agent activation task",
        )
        self.db.add(task)
        await self.db.commit()
        await create_audit_event(self.db, case_id, "TASK_CREATED", "SYSTEM", "orchestrator", {"task_type": task_type, "task_id": str(task.id)})

        try:
            task.status = TASK_STATUSES["RUNNING"]
            task.started_at = datetime.utcnow()
            await self.db.commit()
            result = fn()
            task.status = TASK_STATUSES["COMPLETED"]
            task.finished_at = datetime.utcnow()
            await self.db.commit()
            await create_audit_event(self.db, case_id, "TASK_COMPLETED", "SYSTEM", "orchestrator", {"task_type": task_type, "task_id": str(task.id)})
            return result
        except Exception as exc:
            task.status = TASK_STATUSES["FAILED"]
            task.finished_at = datetime.utcnow()
            task.error_code = "TASK_FAILED"
            task.error_message = str(exc)
            await self.db.commit()
            await create_audit_event(self.db, case_id, "TASK_FAILED", "SYSTEM", "orchestrator", {"task_type": task_type, "task_id": str(task.id)})
            raise

    async def _persist_artifacts(self, case_id: str, artifacts):
        persisted = []
        for artifact in artifacts:
            latest = await self.db.execute(
                select(CaseArtifact).where(
                    CaseArtifact.case_id == case_id,
                    CaseArtifact.type == artifact["type"],
                ).order_by(CaseArtifact.version.desc())
            )
            latest_row = latest.scalars().first()
            version = 1 if not latest_row else (latest_row.version + 1)
            record = CaseArtifact(
                case_id=case_id,
                type=artifact["type"],
                version=version,
                status="DRAFT",
                content_json=artifact["content"],
                sources_used=artifact.get("sources_used", []),
                citations_json=artifact.get("citations", []),
                qa_metadata_json=artifact.get("qa_metadata", {}),
                created_by="system",
            )
            self.db.add(record)
            await self.db.commit()
            await create_audit_event(self.db, case_id, "ARTIFACT_CREATED", "SYSTEM", "orchestrator", {"artifact_type": artifact["type"], "version": version})
            persisted.append({
                "type": record.type,
                "content": record.content_json,
                "citations": record.citations_json,
            })

            if record.type == "FOLLOWUP_PLAN":
                for t in record.content_json.get("tasks", []):
                    due_at = None
                    if t.get("due_at"):
                        try:
                            due_at = datetime.fromisoformat(t["due_at"])
                        except ValueError:
                            due_at = None
                    task = Task(
                        case_id=case_id,
                        task_type="FOLLOWUP",
                        role=t.get("role", "RN"),
                        title=t.get("title", "Follow-up"),
                        description=t.get("description", ""),
                        due_at=due_at,
                        priority=t.get("priority", "MED"),
                        status="OPEN",
                        correlation_id=get_correlation_id(),
                    )
                    self.db.add(task)
                await self.db.commit()
        return persisted

    async def _load_existing_artifacts(self, case_id: str):
        result = await self.db.execute(select(CaseArtifact).where(CaseArtifact.case_id == case_id))
        records = result.scalars().all()
        payload = []
        for record in records:
            payload.append({
                "type": record.type,
                "content": record.content_json,
                "citations": record.citations_json or [],
            })
        return payload

    async def _persist_qa_report(self, case_id: str, report: dict):
        latest = await self.db.execute(
            select(CaseArtifact).where(
                CaseArtifact.case_id == case_id,
                CaseArtifact.type == "QA_REPORT",
            ).order_by(CaseArtifact.version.desc())
        )
        latest_row = latest.scalars().first()
        version = 1 if not latest_row else (latest_row.version + 1)
        record = CaseArtifact(
            case_id=case_id,
            type="QA_REPORT",
            version=version,
            status="DRAFT",
            content_json=report,
            sources_used=[],
            citations_json=[],
            qa_metadata_json={"qa_status": report.get("status")},
            created_by="system",
        )
        self.db.add(record)
        await self.db.commit()
        await create_audit_event(self.db, case_id, "ARTIFACT_CREATED", "SYSTEM", "orchestrator", {"artifact_type": "QA_REPORT", "version": version})
