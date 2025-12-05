"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

type Toast = { id: string; title: string; description?: string };

const ToastContext = createContext<{ toast: (t: { title: string; description?: string }) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: { title: string; description?: string }) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 9);
    setToasts((s) => [...s, { id, title: t.title, description: t.description }]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ marginBottom: 8, background: '#111', color: '#fff', padding: '12px 16px', borderRadius: 8, minWidth: 240 }}>
            <strong>{t.title}</strong>
            {t.description && <div style={{ marginTop: 6, opacity: 0.9 }}>{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
}
