class CommsAgent:
    def run(self, normalized):
        message = "Please contact your care team if you have questions."
        return {
            "type": "OUTREACH_DRAFTS",
            "content": {"messages": [message]},
            "sources_used": []
        }