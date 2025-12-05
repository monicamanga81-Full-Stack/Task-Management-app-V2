"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setEmail(localStorage.getItem('userEmail'));
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <div style={{ maxWidth: 900, margin: '36px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <div>
          <span style={{ marginRight: 12 }}>{email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <p>Welcome to your dashboard. This is a minimal PWA example.</p>
    </div>
  );
}
