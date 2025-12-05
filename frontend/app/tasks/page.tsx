"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../components/ui/toast';

type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: string | null;
};

export default function TasksPage() {
  const router = useRouter();
  const toast = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const res = await fetch(`${backend}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to load tasks');
      const data = await res.json();
      setTasks(data || []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast({ title: 'Unable to load tasks' });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const res = await fetch(`${backend}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Create failed' }));
        toast({ title: 'Create failed', description: err.message });
        return;
      }
      const created = await res.json();
      toast({ title: 'Task created' });
      setTitle('');
      setDescription('');
      setTasks(prev => [created, ...prev]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast({ title: 'Network error', description: 'Unable to reach server' });
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '36px auto', padding: 24 }}>
      <h1>Tasks</h1>
      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required style={{ padding: 8, width: '100%', marginBottom: 8 }} />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ padding: 8, width: '100%', marginBottom: 8 }} />
        <div style={{ textAlign: 'right' }}>
          <button type="submit">Create</button>
        </div>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {tasks.map(t => (
            <li key={t.id} style={{ padding: 12, borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{t.title}</strong>
                  <div style={{ opacity: 0.9 }}>{t.description}</div>
                </div>
                <div>{t.status}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
