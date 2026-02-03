import pytest
from app.services.orchestrator import Orchestrator

@pytest.mark.asyncio
async def test_orchestrate(db_session):
    # Assume seeded case
    orchestrator = Orchestrator(db_session)
    await orchestrator.process_case("some_id")
    # Assert state