import re

FORBIDDEN_PATTERNS = [
    r"\\byou should\\b",
    r"\\bmust take\\b",
    r"\\bstop taking\\b",
    r"\\bdiagnose\\b",
    r"\\bprescribe\\b",
]

DISCLAIMER = "Please contact your care team if you have questions."

PHONE_PATTERN = re.compile(r"\\b\\+?\\d[\\d\\s().-]{7,}\\b")
EMAIL_PATTERN = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}", re.IGNORECASE)
ADDRESS_PATTERN = re.compile(r"\\b\\d+\\s+\\w+\\s+(Street|St|Road|Rd|Ave|Avenue|Blvd|Lane|Ln)\\b", re.IGNORECASE)

class QAPolicyAgent:
    def run(self, artifacts):
        statements = []
        cited = 0
        findings = []
        severe = False

        for artifact in artifacts:
            content = artifact.get("content", {})
            citations = artifact.get("citations", [])

            if artifact.get("type") == "SUMMARY":
                for section in content.get("sections", []):
                    text = section.get("content", "")
                    statements.append(text)
                    if section.get("citations"):
                        cited += 1
            elif artifact.get("type") == "MEDREC":
                for item in content.get("discrepancies", []):
                    statements.append(item)
                    if citations and "NO_SOURCE" not in citations:
                        cited += 1
            elif artifact.get("type") == "OUTREACH_DRAFTS":
                for msg in content.get("messages", []):
                    statements.append(msg)
                    if DISCLAIMER.lower() not in msg.lower():
                        findings.append("OUTREACH_DISCLAIMER_MISSING")
                    if citations and "NO_SOURCE" not in citations:
                        cited += 1

            for text in statements[-3:]:
                if PHONE_PATTERN.search(text) or EMAIL_PATTERN.search(text) or ADDRESS_PATTERN.search(text):
                    findings.append("PHI_DETECTED")
                    severe = True

                for pattern in FORBIDDEN_PATTERNS:
                    if re.search(pattern, text.lower()):
                        findings.append("FORBIDDEN_ADVICE_LANGUAGE")
                        severe = True

        total = len(statements)
        coverage = (cited / total) if total > 0 else 1.0

        if coverage < 0.8:
            findings.append("LOW_CITATION_COVERAGE")

        status = "PASSED"
        if severe:
            status = "ESCALATION_REQUIRED"
        elif findings:
            status = "FAILED"

        report = {
            "status": status,
            "coverage": coverage,
            "total_statements": total,
            "findings": list(set(findings)),
        }

        return report
