class SchedulingAgent:
    def run(self, normalized):
        return {
            "type": "SCHEDULING_REQUEST",
            "content": {"request": "Schedule follow-up appointment within 7-14 days"},
            "sources_used": []
        }