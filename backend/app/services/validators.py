class CitationValidator:
    def validate(self, artifact):
        # Check if every summary bullet has citations
        content = artifact.get("content", {})
        sections = content.get("sections", [])
        for section in sections:
            if "citations" not in section or not section["citations"]:
                return False
        return True

class ForbiddenAdviceValidator:
    def validate(self, artifact):
        # Check for advice patterns like "you should"
        content = str(artifact.get("content", ""))
        forbidden = ["you should", "take this", "stop taking"]
        for f in forbidden:
            if f in content.lower():
                return False
        return True