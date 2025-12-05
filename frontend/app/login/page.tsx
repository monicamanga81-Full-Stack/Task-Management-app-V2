"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const res = await fetch(`${backend}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Login failed' }));
        alert(err.message || 'Login failed');
        return;
      }

      const body = await res.json();
      // expect { access_token: '...' } or { token: '...' }
      const token = body.access_token || body.token || body.accessToken;
      if (!token) {
        alert('Login did not return a token');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email);
      router.push('/dashboard');
    } catch (err) {
      // network or unexpected error
      // eslint-disable-next-line no-console
      console.error(err);
      alert('Unable to reach server. Please try again later.');
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '48px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>Login</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
