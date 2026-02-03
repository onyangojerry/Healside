import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth/session';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, error: authError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      router.push('/cases');
    } catch (err: any) {
      setError(authError || 'Unable to sign in.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      {error && <p>{error}</p>}
      {!error && authError && <p>{authError}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
