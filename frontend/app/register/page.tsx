"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '../../components/ui/toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
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
      const res = await fetch(`${backend}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Registration failed' }));
        toast({ title: 'Registration failed', description: err.message || 'Unable to register' });
        return;
      }

      toast({ title: 'Registered', description: 'Please login with your credentials' });
      // On success navigate to login
      router.push('/login');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast({ title: 'Network error', description: 'Unable to reach server. Please try again later.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <div className="text-right">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </div>
      </form>
      <p className="mt-3 text-sm">
        Have an account? <a href="/login" className="text-blue-600">Login</a>
      </p>
    </div>
  );
}
