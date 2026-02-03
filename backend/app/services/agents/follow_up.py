from datetime import datetime, timedelta

class FollowUpPlanAgent:
    def run(self, normalized):
        tasks = [
            {
                "role": "rn",
                "title": "Outreach Call",
                "description": "Call patient within 24h",
                "due_at": (datetime.utcnow() + timedelta(hours=24)).isoformat(),
                "priority": "HIGH"
            }
        ]
        return {
            "type": "FOLLOWUP_PLAN",
            "content": {"tasks": tasks},
            "sources_used": []
        }
