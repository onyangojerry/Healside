class NormalizationAgent:
    def run(self, bundle):
        return {
            "patient_id": bundle["patient_id"],
            "conditions": bundle["conditions"],
            "home_meds": bundle["home_meds"],
            "discharge_meds": bundle["discharge_meds"],
            "document_text": bundle["document_text"],
            "sources": {
                "conditions": "BUNDLE:conditions",
                "home_meds": "BUNDLE:home_meds",
                "discharge_meds": "BUNDLE:discharge_meds",
                "document": "DOC:discharge_summary"
            }
        }