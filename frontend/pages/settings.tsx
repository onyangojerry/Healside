import React from 'react';
import Panel from '../components/Panel';
import { useAuth } from '../lib/auth/session';

export default function Settings() {
  const { user } = useAuth();
  const backend = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8000';
  const envName = process.env.NEXT_PUBLIC_ENV_NAME || 'Local';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="muted">Environment information and service links.</p>
        </div>
      </div>
      <Panel title="Environment" footer={<span>Version 1.0</span>}>
        <div className="settings-grid">
          <div>
            <div className="settings-label">Environment</div>
            <div>{envName}</div>
          </div>
          <div>
            <div className="settings-label">Backend base URL</div>
            <div className="mono">{backend}</div>
          </div>
          <div>
            <div className="settings-label">Signed in as</div>
            <div>{user?.username || '—'}</div>
          </div>
          <div>
            <div className="settings-label">Role</div>
            <div>{user?.role || '—'}</div>
          </div>
        </div>
      </Panel>
      <Panel title="Links">
        <div className="settings-links">
          <a href="/cases">Case inbox</a>
          <a href="/settings">Settings</a>
          <a href={`${backend}/v1/health`} target="_blank" rel="noreferrer">
            Backend health
          </a>
        </div>
      </Panel>
    </div>
  );
}
