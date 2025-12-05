"use client";

import './globals.css';
import React from 'react';
import { ToastProvider } from '../components/ui/toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
