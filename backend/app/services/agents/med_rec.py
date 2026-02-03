class MedRecAgent:
    def run(self, normalized):
        discrepancies = []
        home = {m["name"]: m for m in normalized["home_meds"]}
        discharge = {m["name"]: m for m in normalized["discharge_meds"]}
        for name, med in discharge.items():
            if name not in home:
                discrepancies.append(f"New medication: {name}")
        return {
            "type": "MEDREC",
            "content": {"discrepancies": discrepancies},
            "sources_used": ["BUNDLE:home_meds", "BUNDLE:discharge_meds"]
        }