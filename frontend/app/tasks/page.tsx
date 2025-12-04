"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

import {
  saveOfflineTask,
  getOfflineTasks,
  clearOfflineTasks,
} from "@/lib/offline-tasks";

import { initSocket, disconnectSocket } from "@/lib/socket";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const socketRef = useRef<any>(null);

  // Load all tasks
  async function loadTasks() {
    const token = localStorage.getItem("token");

    if (!token) {
      toast({
        title: "Not logged in",
        description: "Please login first!",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch");
      }

      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.warn("Load tasks failed:", error);
      toast({
        title: "Offline Mode",
        description: "Unable to load tasks (offline).",
      });
    }
  }

  // Create new task
  async function createTask(e: any) {
    e.preventDefault();

    if (!title) {
      toast({ title: "Enter a title", variant: "warning" });
      return;
    }

    const newTask = { title, description, status: 'PENDING' };

    // If offline → save locally
    if (!navigator.onLine) {
      // ensure status matches backend enum format and include a client id for idempotency
      const offlineToSave = {
        ...newTask,
        id: (typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : `client-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        status: String(newTask.status).toUpperCase().replace(/-/g, '_'),
      };
      await saveOfflineTask(offlineToSave);

      toast({
        title: "Saved Offline",
        description: "Task will sync when online.",
      });

      setTitle("");
      setDescription("");

      return;
    }

    // If online → send to backend
    const token = localStorage.getItem("token");

    const bodyToSend = {
      ...newTask,
      id: (typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : `client-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      status: String(newTask.status).toUpperCase().replace(/-/g, '_'),
    };

    const res = await fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyToSend),
    });

    const data = await res.json();

    if (!res.ok) {
      toast({
        title: "Error",
        description: data.message || "Failed to create task",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Task Created",
      description: `${data.title} added.`,
    });

    setTitle("");
    setDescription("");

    loadTasks();
  }

  // Sync offline tasks when online
  useEffect(() => {
    async function syncOffline() {
      if (!navigator.onLine) return;

      const offlineTasks = await getOfflineTasks();
      if (offlineTasks.length === 0) return;

      const token = localStorage.getItem("token");
      setSyncing(true);

      try {
        // Normalize statuses before sending to backend
        const normalized = offlineTasks.map((t: any) => ({
          ...t,
          status: t?.status ? String(t.status).toUpperCase().replace(/-/g, '_') : 'PENDING',
        }));

        const res = await fetch("http://localhost:4000/tasks/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tasks: normalized }),
        });

        if (!res.ok) {
          throw new Error("Sync failed");
        }

        const result = await res.json();

        await clearOfflineTasks();
        setLastSyncTime(new Date().toLocaleTimeString());
        setSyncing(false);

        toast({
          title: "Synced",
          description: `${offlineTasks.length} task(s) synced successfully.`,
        });

        loadTasks();
      } catch (err) {
        console.error("Sync error", err);
        setSyncing(false);
        toast({
          title: "Sync failed",
          description: "Will retry automatically when online",
          variant: "warning",
        });
      }
    }

    window.addEventListener("online", syncOffline);

    // run immediately
    syncOffline();
    loadTasks();

    return () => {
      window.removeEventListener("online", syncOffline);
    };
  }, []);

  // Real-time socket: init and events
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const s = initSocket(token);
    socketRef.current = s;

    if (!s) return;

    // Listen to events emitted by server (task:created, task:updated, task:completed)
    s.on("task:created", (data: any) => {
      toast({ title: "Task created", description: data.title });
      // optional: refresh list to show new item
      loadTasks();
    });

    s.on("task:updated", (data: any) => {
      toast({ title: "Task updated", description: data.title });
      loadTasks();
    });

    s.on("task:completed", (data: any) => {
      toast({ title: "Task completed", description: data.title });
      loadTasks();
    });

    // cleanup on unmount
    return () => {
      try {
        s.off("task:created");
        s.off("task:updated");
        s.off("task:completed");
      } catch (e) {}
      // do not disconnect globally (keeps socket for other pages) — but you can disconnect:
      // disconnectSocket();
    };
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Your Tasks</h1>

      {/* CREATE TASK */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createTask} className="space-y-3">
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button type="submit">Create Task</Button>
          </form>
        </CardContent>
      </Card>

      {/* SYNC STATUS */}
      {syncing && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded text-center">
          <p className="text-sm text-blue-700 font-semibold">Syncing tasks...</p>
        </div>
      )}
      {lastSyncTime && !syncing && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-center">
          <p className="text-xs text-green-700">Last synced: {lastSyncTime}</p>
        </div>
      )}

      {/* TASK LIST */}
      <div className="space-y-4">
        {tasks.length === 0 && (
          <p className="text-gray-500 text-center">No tasks found</p>
        )}

        {tasks.map((task: any) => (
          <Card key={task.id}>
            <CardHeader>
              <CardTitle>{task.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{task.description}</p>
              <p className="text-xs mt-2 text-gray-500">Status: {task.status}</p>
              {task.lastSyncedAt && (
                <p className="text-xs mt-1 text-gray-400">Synced: {new Date(task.lastSyncedAt).toLocaleString()}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
