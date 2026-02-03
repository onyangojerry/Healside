from app.services.orchestrator import TASK_DATA_COMPLETENESS, TASK_DRAFT_GENERATION, TASK_QA_POLICY


def test_state_machine_constants():
    assert TASK_DATA_COMPLETENESS == "DATA_COMPLETENESS"
    assert TASK_DRAFT_GENERATION == "DRAFT_GENERATION"
    assert TASK_QA_POLICY == "QA_POLICY"
