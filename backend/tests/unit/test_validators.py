from app.services.validators import CitationValidator

def test_citation_validator():
    validator = CitationValidator()
    artifact = {"content": {"sections": [{"citations": ["source1"]}]}}
    assert validator.validate(artifact)