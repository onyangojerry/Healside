from app.db.models import Case, CaseArtifact, Task
from app.services.agents import EligibilityAgent, NormalizationAgent, SummaryAgent, MedRecAgent, FollowUpPlanAgent, SchedulingAgent, CommsAgent, QACriticAgent
from app.services.validators import CitationValidator, ForbiddenAdviceValidator
from app.services.audit import create_audit_event
from app.core.logging import logger
from app.core.correlation_id import get_correlation_id

class Orchestrator:
    def __init__(self, db_session):
        self.db = db_session

    async def process_case(self, case_id: str):
        case = await self.db.get(Case, case_id)
        if not case:
            raise ValueError("Case not found")
        correlation_id = get_correlation_id()
        logger.info("Starting orchestration for case", extra={"case_id": case_id})

        # Get bundle
        bundle = await self.db.execute(select(CaseBundle).where(CaseBundle.case_id == case_id))
        bundle = bundle.scalar_one_or_none()
        if not bundle:
            case.state = "NEEDS_DATA"
            await self.db.commit()
            await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "NEEDS_DATA"})
            return

        # Eligibility
        eligibility_agent = EligibilityAgent()
        eligible, condition_focus = eligibility_agent.run(bundle.bundle_json)
        if not eligible:
            case.state = "NEEDS_DATA"
            await self.db.commit()
            await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "NEEDS_DATA"})
            return
        case.condition_focus = condition_focus
        case.state = "ELIGIBLE"
        await self.db.commit()
        await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "ELIGIBLE"})

        # Normalization
        normalization_agent = NormalizationAgent()
        normalized = normalization_agent.run(bundle.bundle_json)
        case.state = "DATA_READY"
        await self.db.commit()
        await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "DATA_READY"})

        # Draft artifacts
        summary_agent = SummaryAgent()
        summary_artifact = summary_agent.run(normalized)
        artifact = CaseArtifact(case_id=case_id, type="SUMMARY", content_json=summary_artifact["content"], sources_used=summary_artifact["sources_used"], created_by="system")
        self.db.add(artifact)

        medrec_agent = MedRecAgent()
        medrec_artifact = medrec_agent.run(normalized)
        artifact = CaseArtifact(case_id=case_id, type="MEDREC", content_json=medrec_artifact["content"], sources_used=medrec_artifact["sources_used"], created_by="system")
        self.db.add(artifact)

        followup_agent = FollowUpPlanAgent()
        followup_artifact = followup_agent.run(normalized)
        artifact = CaseArtifact(case_id=case_id, type="FOLLOWUP_PLAN", content_json=followup_artifact["content"], sources_used=followup_artifact["sources_used"], created_by="system")
        self.db.add(artifact)

        scheduling_agent = SchedulingAgent()
        scheduling_artifact = scheduling_agent.run(normalized)
        artifact = CaseArtifact(case_id=case_id, type="SCHEDULING_REQUEST", content_json=scheduling_artifact["content"], sources_used=scheduling_artifact["sources_used"], created_by="system")
        self.db.add(artifact)

        comms_agent = CommsAgent()
        comms_artifact = comms_agent.run(normalized)
        artifact = CaseArtifact(case_id=case_id, type="OUTREACH_DRAFTS", content_json=comms_artifact["content"], sources_used=comms_artifact["sources_used"], created_by="system")
        self.db.add(artifact)

        # Create tasks from followup
        for t in followup_artifact["content"]["tasks"]:
            task = Task(case_id=case_id, role=t["role"], title=t["title"], description=t["description"], due_at=t["due_at"], priority=t["priority"])
            self.db.add(task)

        case.state = "DRAFT_READY"
        await self.db.commit()
        await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "DRAFT_READY"})

        # QA
        citation_validator = CitationValidator()
        advice_validator = ForbiddenAdviceValidator()
        artifacts = [summary_artifact, medrec_artifact, comms_artifact]
        qa_pass = all(citation_validator.validate(a) and advice_validator.validate(a) for a in artifacts)
        if not qa_pass:
            case.state = "NEEDS_HUMAN"
            await self.db.commit()
            await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "NEEDS_HUMAN"})
            return
        case.state = "QA_PASSED"
        await self.db.commit()
        await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "QA_PASSED"})

        # Human review required
        case.state = "HUMAN_REVIEW_REQUIRED"
        await self.db.commit()
        await create_audit_event(self.db, case_id, "STATE_CHANGE", "SYSTEM", "orchestrator", {"new_state": "HUMAN_REVIEW_REQUIRED"})