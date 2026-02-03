import React from 'react';
import { AuditEvent } from '../lib/api/types';
import { formatDateTime } from '../utils/format';

interface AuditTimelineProps {
  events: AuditEvent[];
}

const AuditTimeline: React.FC<AuditTimelineProps> = ({ events }) => {
  if (!events.length) {
    return <div className="muted">No audit activity recorded.</div>;
  }

  return (
    <ul className="audit-timeline">
      {events.map((event) => (
        <li key={event.id}>
          <div className="audit-dot" aria-hidden="true" />
          <div className="audit-content">
            <div className="audit-title">{event.event_type}</div>
            <div className="audit-meta">
              {event.actor_type} • {event.actor_id} • {formatDateTime(event.created_at)}
            </div>
            <div className="audit-correlation">Correlation ID: {event.correlation_id || '—'}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default AuditTimeline;
