class DataCompletenessAgent:
    REQUIRED_FIELDS = [
        "patient_id",
        "encounter_id",
        "conditions",
        "home_meds",
        "discharge_meds",
        "document_text",
    ]

    def run(self, bundle):
        blockers = []
        for field in self.REQUIRED_FIELDS:
            value = bundle.get(field)
            if value is None or (isinstance(value, list) and len(value) == 0):
                blockers.append({
                    "code": "MISSING_FIELD",
                    "message": f"Missing required field: {field}",
                    "missing_fields": [field],
                })

        conditions = bundle.get("conditions", [])
        eligible = any("heart failure" in cond.get("display", "").lower() for cond in conditions)
        if not eligible:
            blockers.append({
                "code": "NOT_ELIGIBLE",
                "message": "No heart failure condition present",
                "missing_fields": ["conditions"],
            })

        return {
            "is_complete": len(blockers) == 0,
            "blockers": blockers,
            "eligible": eligible,
        }
