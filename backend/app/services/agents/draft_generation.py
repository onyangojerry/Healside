from app.services.agents import SummaryAgent, MedRecAgent, FollowUpPlanAgent, SchedulingAgent, CommsAgent

NO_SOURCE = "NO_SOURCE"

class DraftGenerationAgent:
    def run(self, normalized):
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
