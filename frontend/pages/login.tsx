import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth/session';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, error, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError('');
    try {
      await login(username, password);
      router.push('/cases');
    } catch (err) {
      setLocalError('Sign in failed. Check credentials or contact support.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark">H</div>
          <div>
            <div className="brand-title">Healside</div>
            <div className="brand-subtitle">Clinical Operations</div>
          </div>
        </div>
        <h1>Sign in</h1>
        <p className="muted">Authorized clinical staff only. Drafts are not final until approved.</p>
        <form onSubmit={handleSubmit} className="login-form">
          <label className="form-label">
            Username
            <input value={username} onChange={(event) => setUsername(event.target.value)} required />
          </label>
          <label className="form-label">
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {(localError || error) && <div className="inline-error">{localError || error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
