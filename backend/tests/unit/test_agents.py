import pytest

from app.services.agents.data_completeness import DataCompletenessAgent
from app.services.agents.qa_policy import QAPolicyAgent
from app.services.agents.draft_generation import DraftGenerationAgent


def test_data_completeness_missing_fields():
    agent = DataCompletenessAgent()
    result = agent.run({
        "patient_id": "p1",
        "encounter_id": "e1",
        "conditions": [],
        "home_meds": [],
        "discharge_meds": [],
        "document_text": "",
    })
    assert result["is_complete"] is False
    assert any(b["code"] == "MISSING_FIELD" for b in result["blockers"])


def test_qa_policy_detects_forbidden_language():
    agent = QAPolicyAgent()
    artifacts = [
        {"type": "SUMMARY", "content": {"sections": [{"content": "You should stop taking medication.", "citations": ["SRC"]}]}},
        {"type": "MEDREC", "content": {"discrepancies": ["Stop taking med."]}, "citations": ["SRC"]},
        {"type": "OUTREACH_DRAFTS", "content": {"messages": ["Please contact your care team if you have questions."]}, "citations": ["SRC"]},
    ]
    report = agent.run(artifacts)
    assert report["status"] in ["FAILED", "ESCALATION_REQUIRED"]
    assert "FORBIDDEN_ADVICE_LANGUAGE" in report["findings"]


def test_draft_generation_adds_citations():
    agent = DraftGenerationAgent()
    normalized = {
        "condition_focus": "Heart Failure",
        "home_meds": [{"name": "MedA"}],
        "discharge_meds": [{"name": "MedA"}],
    }
    artifacts = agent.run(normalized)
    assert artifacts
    for artifact in artifacts:
        assert "citations" in artifact
