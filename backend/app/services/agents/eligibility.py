class EligibilityAgent:
    def run(self, bundle):
        conditions = bundle.get("conditions", [])
        for cond in conditions:
            if "heart failure" in cond.get("display", "").lower():
                return True, "Heart Failure"
        return False, None