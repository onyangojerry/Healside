import uuid

from app.db.models import AuditEvent
from app.core.correlation_id import get_correlation_id

async def create_audit_event(db, case_id, event_type, actor_type, actor_id, event_json):
    correlation_id = get_correlation_id() or str(uuid.uuid4())
    audit = AuditEvent(
        case_id=case_id,
        event_type=event_type,
        actor_type=actor_type,
        actor_id=actor_id,
        correlation_id=correlation_id,
        event_json=event_json
    )
    db.add(audit)
    await db.commit()
