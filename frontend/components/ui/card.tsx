"use client";

import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`border rounded-lg shadow p-4 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="mb-3">{children}</div>
);

export const CardContent = ({ children }) => <div>{children}</div>;

export const CardTitle = ({ children }) => (
  <h2 className="text-lg font-bold">{children}</h2>
);
