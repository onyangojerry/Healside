from app.workers.celery_app import celery_app
from app.services.orchestrator import Orchestrator
from app.db.session import async_session
import asyncio

@celery_app.task
def orchestrate_case(case_id: str):
    async def run():
        async with async_session() as db:
            orchestrator = Orchestrator(db)
            await orchestrator.process_case(case_id)
    asyncio.run(run())