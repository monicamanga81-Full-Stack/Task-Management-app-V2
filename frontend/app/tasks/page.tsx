"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../components/ui/toast';
import { createSocket } from '../../lib/socket';

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
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<Task['status']>('PENDING');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    fetchTasks();
    // setup socket listeners
    const s = createSocket();
    s.on('task.created', (payload: any) => {
      setTasks(prev => [payload, ...prev.filter(p => p.id !== payload.id)]);
      toast({ title: 'Task created (live)', description: payload.title });
    });
    s.on('task.updated', (payload: any) => {
      setTasks(prev => prev.map(p => (p.id === payload.id ? payload : p)));
      toast({ title: 'Task updated (live)', description: payload.title });
    });
    s.on('task.deleted', (payload: any) => {
      setTasks(prev => prev.filter(p => p.id !== payload.id));
      toast({ title: 'Task deleted (live)' });
    });

    return () => {
      s.off('task.created');
      s.off('task.updated');
      s.off('task.deleted');
    };
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

  function startEdit(t: Task) {
    setEditingTaskId(t.id);
    setEditTitle(t.title);
    setEditDescription(t.description || '');
    setEditStatus(t.status);
  }

  function cancelEdit() {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
  }

  async function saveEdit(taskId: string) {
    try {
      const token = localStorage.getItem('token');
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const res = await fetch(`${backend}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: editTitle, description: editDescription, status: editStatus }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Update failed' }));
        toast({ title: 'Update failed', description: err.message });
        return;
      }
      const updated = await res.json();
      setTasks(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      toast({ title: 'Task updated' });
      cancelEdit();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast({ title: 'Network error', description: 'Unable to reach server' });
    }
  }

  async function handleDelete(taskId: string) {
    const ok = window.confirm('Delete this task?');
    if (!ok) return;
    try {
      const token = localStorage.getItem('token');
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const res = await fetch(`${backend}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Delete failed' }));
        toast({ title: 'Delete failed', description: err.message });
        return;
      }
      setTasks(prev => prev.filter(p => p.id !== taskId));
      toast({ title: 'Task deleted' });
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
              {editingTaskId === t.id ? (
                <div>
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ width: '60%', padding: 6, marginBottom: 6 }} />
                  <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} style={{ width: '100%', padding: 6, marginBottom: 6 }} />
                  <div style={{ marginBottom: 8 }}>
                    <select value={editStatus} onChange={e => setEditStatus(e.target.value as Task['status'])}>
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => saveEdit(t.id)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{t.title}</strong>
                    <div style={{ opacity: 0.9 }}>{t.description}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ marginRight: 12 }}>{t.status}</div>
                    <button onClick={() => startEdit(t)}>Edit</button>
                    <button onClick={() => handleDelete(t.id)} style={{ color: 'red' }}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
