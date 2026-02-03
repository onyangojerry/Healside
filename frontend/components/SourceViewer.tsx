import React from 'react';

interface SourceViewerProps {
  sources: string[];
}

const SourceViewer: React.FC<SourceViewerProps> = ({ sources }) => {
  return (
    <div className="source-viewer">
      <h4>Sources</h4>
      <ul>
        {sources.map((source, i) => <li key={i}>{source}</li>)}
      </ul>
    </div>
  );
};

export default SourceViewer;