"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Dashboard() {
  const router = useRouter();

  // AUTH GUARD
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending"); // Added status state
  // edit modal state
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("pending");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Accessibility: trap focus inside modal and handle Escape to close
  useEffect(() => {
    if (!editingTask) return;

    previouslyFocused.current = document.activeElement as HTMLElement;

    // focus first focusable element inside modal
    const modal = modalRef.current;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusable = modal ? Array.from(modal.querySelectorAll(focusableSelector)) as HTMLElement[] : [];
    if (focusable.length) focusable[0].focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingTask(null);
      }
      if (e.key === 'Tab') {
        if (!modal) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      if (previouslyFocused.current) previouslyFocused.current.focus();
    };
  }, [editingTask]);

  // toast
  const [toastMessage, setToastMessage] = useState("");

  // load tasks
  useEffect(() => {
    setCurrentPage(1);
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:4000/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.log("Not an array:", data);
      setTasks([]);
      return;
    }

    // Normalize backend status values (e.g. PENDING, IN_PROGRESS) to UI-friendly values
    const normalized = data.map((t) => ({
      ...t,
      status: t.status ? t.status.toString().toLowerCase().replace(/_/g, "-") : t.status,
    }));

    let filtered = normalized;
    if (filter !== "all") {
      filtered = normalized.filter((t) => t.status === filter);
    }
    setTasks(filtered);
  };

  // create task
  const handleCreateTask = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // map UI status (e.g. 'in-progress') to backend enum (e.g. 'IN_PROGRESS')
    const mapStatusForBackend = (s) => {
      if (!s) return undefined;
      return s.toString().toUpperCase().replace(/-/g, "_");
    };

    const res = await fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: mapStatusForBackend(status),
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      console.error("Create task failed:", err || res.statusText || res.status);
      alert(`Unable to create task: ${err?.message || res.status}`);
      return;
    }

    // Reset form
    setTitle("");
    setDescription("");
    setDueDate("");
    setStatus("pending"); // Reset status to default

    fetchTasks();
  };

  // edit
  const openEditModal = (task) => {
    setEditingTask(task);
    setEditTitle(task.title || "");
    setEditStatus(task.status || "pending");
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingTask) return;

    const token = localStorage.getItem("token");

    const mapStatusForBackend = (s) => {
      if (!s) return undefined;
      return s.toString().toUpperCase().replace(/-/g, "_");
    };

    const res = await fetch(`http://localhost:4000/tasks/${editingTask.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editTitle, status: mapStatusForBackend(editStatus) }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      console.error("Update task failed:", err || res.statusText || res.status);
      alert(`Unable to update task: ${err?.message || res.status}`);
      return;
    }

    setToastMessage("Task updated");
    setTimeout(() => setToastMessage(""), 3000);

    setEditingTask(null);
    fetchTasks();
  };

  // delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this?")) return;

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:4000/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchTasks();
  };

  // pagination compute
  const totalPages = Math.max(1, Math.ceil(tasks.length / itemsPerPage));
  const paginatedTasks = tasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={styles.container}>
      {/* LOGOUT BUTTON */}
      <button className={styles.logoutBtn}
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
      >
        Logout
      </button>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.intro}>Manage your tasks — add, edit, filter and mark complete.</p>
        </div>
      </div>

      {/* CREATE TASK FORM */}
      <form onSubmit={handleCreateTask} className={styles.formCard}>
        <h3>Add Task</h3>

        <input
          placeholder="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.input}
          style={{ height: 70 }}
        ></textarea>

        <label style={{ display: "block", marginTop: 10 }}>Due Date:</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={styles.input}
        />

        {/* NEW STATUS DROPDOWN */}
        <label style={{ display: "block", marginTop: 10 }}>Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={styles.input}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button type="submit" className={styles.primaryBtn}>
          Add Task
        </button>
      </form>

      {/* FILTER TASKS */}
      <div className={styles.filterCard}>
        <h3 className={styles.filterTitle}>Filter Tasks</h3>
        <button className={filter === "all" ? `${styles.filterBtn} ${styles.filterBtnActive}` : styles.filterBtn} onClick={() => setFilter("all")}>All</button>
        <button className={filter === "pending" ? `${styles.filterBtn} ${styles.filterBtnActive}` : styles.filterBtn} onClick={() => setFilter("pending")}>Pending</button>
        <button className={filter === "in-progress" ? `${styles.filterBtn} ${styles.filterBtnActive}` : styles.filterBtn} onClick={() => setFilter("in-progress")}>In-Progress</button>
        <button className={filter === "completed" ? `${styles.filterBtn} ${styles.filterBtnActive}` : styles.filterBtn} onClick={() => setFilter("completed")}>Completed</button>
        <p className={styles.filterInfo}>Showing: <strong>{filter.charAt(0).toUpperCase() + filter.slice(1)}</strong> Tasks ({tasks.length})</p>
      </div>

      {/* TASK GRID */}
      <div className={styles.grid}>
        {Array.isArray(paginatedTasks) && paginatedTasks.map((task) => (
          <div key={task.id} className={styles.card}>
            <div>
              <h4 style={{ margin: 0 }}>{task.title}</h4>
              <p style={{ color: '#555', marginTop: 8 }}>{task.description}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <small className={styles.status}>{task.status}</small>
              <div className={styles.actions}>
                <button className={styles.editBtn} onClick={() => openEditModal(task)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className={styles.pagination}>
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className={styles.pageBtn}>Prev</button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? `${styles.pageBtn} ${styles.pageBtnActive}` : styles.pageBtn}>{i + 1}</button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className={styles.pageBtn}>Next</button>
      </div>
      {/* Edit Modal */}
      {editingTask && (
        <div className={styles.modalOverlay}>
          <form onSubmit={handleUpdateSubmit} className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="editTaskLabel" ref={(el) => { modalRef.current = el as any; }}>
            <h3 id="editTaskLabel">Edit Task</h3>
            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className={styles.input} />
            <label style={{ display: 'block', marginTop: 10 }}>Status</label>
            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className={styles.input}>
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <button type="button" className={styles.secondaryBtn} style={{ marginRight: 8 }} onClick={() => setEditingTask(null)}>Cancel</button>
              <button type="submit" className={styles.primaryBtn}>Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className={styles.toast}>{toastMessage}</div>
      )}
    </div>
  );
}

// Styles moved to CSS module `page.module.css`.
