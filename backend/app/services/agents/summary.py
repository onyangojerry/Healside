class SummaryAgent:
    def run(self, normalized):
        summary = {
            "sections": [
                {
                    "title": "Condition",
                    "content": f"Patient has {normalized['condition_focus']}",
                    "citations": ["BUNDLE:conditions"]
                }
            ]
        }
        return {
            "type": "SUMMARY",
            "content": summary,
            "sources_used": ["BUNDLE:conditions"]
        }