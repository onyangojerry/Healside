import asyncio
from typing import Optional

from app.workers.celery_app import celery_app
from app.services.orchestrator import Orchestrator
from app.db.session import async_session
from app.core.correlation_id import set_correlation_id

@celery_app.task
def orchestrate_case(case_id: str, correlation_id: Optional[str] = None):
    async def run():
        async with async_session() as db:
            if correlation_id:
                set_correlation_id(correlation_id)
            orchestrator = Orchestrator(db)
            await orchestrator.process_case(case_id)
    asyncio.run(run())
