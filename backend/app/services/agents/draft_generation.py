from app.services.agents import SummaryAgent, MedRecAgent, FollowUpPlanAgent, SchedulingAgent, CommsAgent
from app.services.llm_client import get_llm

NO_SOURCE = "NO_SOURCE"

class DraftGenerationAgent:
    def __init__(self):
        self.llm = get_llm()

    def run(self, normalized):
        if not self.llm:
            return self._fallback_run(normalized)

        condition_focus = normalized.get("condition_focus", "the current condition")
        meds = ", ".join([m.get("name", "medication") for m in normalized.get("discharge_meds", [])]) or "medications"

        summary_text = self._safe_invoke(
            f"Write a short, neutral clinical summary draft for {condition_focus}. Avoid medical advice. Keep it factual.",
            f"Patient has {condition_focus}.",
        )
        outreach_text = self._safe_invoke(
            "Write a short patient outreach draft. Must include: 'Please contact your care team if you have questions.' Avoid medical advice.",
            "Please contact your care team if you have questions.",
        )
        scheduling_text = self._safe_invoke(
            "Write a scheduling request draft to arrange follow-up within 7-14 days. Avoid medical advice.",
            "Schedule follow-up appointment within 7-14 days.",
        )

        summary_artifact = {
            "type": "SUMMARY",
            "content": {"sections": [{"title": "Condition", "content": summary_text, "citations": [NO_SOURCE]}]},
            "sources_used": [],
        }
        medrec_artifact = MedRecAgent().run(normalized)
        followup_artifact = FollowUpPlanAgent().run(normalized)
        scheduling_artifact = {
            "type": "SCHEDULING_REQUEST",
            "content": {"request": scheduling_text},
            "sources_used": [],
        }
        comms_artifact = {
            "type": "OUTREACH_DRAFTS",
            "content": {"messages": [outreach_text]},
            "sources_used": [],
        }

        artifacts = []
        for artifact in [summary_artifact, medrec_artifact, followup_artifact, scheduling_artifact, comms_artifact]:
            citations = artifact.get("sources_used") or [NO_SOURCE]
            artifacts.append({
                "type": artifact["type"],
                "content": artifact["content"],
                "sources_used": artifact.get("sources_used", []),
                "citations": citations,
                "qa_metadata": {
                    "has_no_source": NO_SOURCE in citations,
                },
            })
        return artifacts

    def _fallback_run(self, normalized):
        summary_artifact = SummaryAgent().run(normalized)
        medrec_artifact = MedRecAgent().run(normalized)
        followup_artifact = FollowUpPlanAgent().run(normalized)
        scheduling_artifact = SchedulingAgent().run(normalized)
        comms_artifact = CommsAgent().run(normalized)

        artifacts = []
        for artifact in [summary_artifact, medrec_artifact, followup_artifact, scheduling_artifact, comms_artifact]:
            citations = artifact.get("sources_used") or [NO_SOURCE]
            artifacts.append({
                "type": artifact["type"],
                "content": artifact["content"],
                "sources_used": artifact.get("sources_used", []),
                "citations": citations,
                "qa_metadata": {
                    "has_no_source": NO_SOURCE in citations,
                },
            })
        return artifacts

    def _safe_invoke(self, prompt: str, fallback: str) -> str:
        try:
            response = self.llm.invoke(prompt)
            return response.strip() if isinstance(response, str) else fallback
        except Exception:
            return fallback
