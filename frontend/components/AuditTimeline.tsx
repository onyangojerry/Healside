import React from 'react';
import { AuditEvent } from '../lib/types';
import { formatDate } from '../utils/helpers';

interface AuditTimelineProps {
  events: AuditEvent[];
}

const AuditTimeline: React.FC<AuditTimelineProps> = ({ events }) => {
  return (
    <div className="audit-timeline">
      {events.map(event => (
        <div key={event.id} className="audit-event">
          <p>{event.event_type} by {event.actor_id} at {formatDate(event.created_at)}</p>
          <p>{JSON.stringify(event.event_json)}</p>
        </div>
      ))}
    </div>
  );
};

export default AuditTimeline;