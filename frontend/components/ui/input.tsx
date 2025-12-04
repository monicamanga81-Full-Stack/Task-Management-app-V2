"use client";

import React from "react";

export const Input = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`w-full border px-3 py-2 rounded-md ${className}`}
    />
  );
};
