"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '../../components/ui/toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // simple client-side validation
    const emailOk = /\S+@\S+\.\S+/.test(email.trim());
    if (!emailOk) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email address' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Weak password', description: 'Password must be at least 6 characters' });
      return;
    }
    setLoading(true);
    try {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const res = await fetch(`${backend}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Login failed' }));
        toast({ title: 'Login failed', description: err.message || 'Unable to login' });
        return;
      }

      const body = await res.json();
      // expect { access_token: '...' } or { token: '...' }
      const token = body.access_token || body.token || body.accessToken;
      if (!token) {
        toast({ title: 'Login failed', description: 'Login did not return a token' });
        return;
      }
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email);
      toast({ title: 'Logged in' });
      router.push('/dashboard');
    } catch (err) {
      // network or unexpected error
      // eslint-disable-next-line no-console
      console.error(err);
      toast({ title: 'Network error', description: 'Unable to reach server. Please try again later.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <div className="text-right">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
      <p className="mt-3 text-sm">
        Don't have an account? <a href="/register" className="text-blue-600">Register</a>
      </p>
    </div>
  );
}
