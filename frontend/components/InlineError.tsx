import React from 'react';

interface InlineErrorProps {
  title?: string;
  message: string;
  correlationId?: string;
  onCopy?: () => void;
}

const InlineError: React.FC<InlineErrorProps> = ({ title = 'Something went wrong', message, correlationId, onCopy }) => {
  return (
    <div className="inline-error" role="alert">
      <div>
        <strong>{title}</strong>
        <div>{message}</div>
        {correlationId && <div className="muted">Correlation ID: {correlationId}</div>}
      </div>
      <button type="button" className="btn btn-ghost" onClick={onCopy}>
        Copy details
      </button>
    </div>
  );
};

export default InlineError;
