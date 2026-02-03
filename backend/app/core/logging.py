import logging
import json
from app.core.correlation_id import get_correlation_id

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "msg": record.getMessage(),
            "correlation_id": get_correlation_id(),
        }
        if hasattr(record, 'case_id'):
            log_entry["case_id"] = record.case_id
        if hasattr(record, 'actor_id'):
            log_entry["actor_id"] = record.actor_id
        return json.dumps(log_entry)

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logger.addHandler(handler)