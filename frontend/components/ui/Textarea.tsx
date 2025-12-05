"use client";

import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export default function Textarea({ label, style, ...props }: TextareaProps) {
  return (
    <div className="mb-3">
      {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
      <textarea {...props} className={`w-full p-2 border rounded min-h-[80px] ${props.className || ''}`} />
    </div>
  );
}
