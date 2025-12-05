"use client";

import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export default function Textarea({ label, style, ...props }: TextareaProps) {
  return (
    <div style={{ marginBottom: 8 }}>
      {label && <label style={{ display: 'block', marginBottom: 6 }}>{label}</label>}
      <textarea {...props} style={{ padding: 8, width: '100%', minHeight: 80, boxSizing: 'border-box', ...(style as any) }} />
    </div>
  );
}
