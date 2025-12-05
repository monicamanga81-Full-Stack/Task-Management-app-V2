"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
};

export const Button = ({ children, className = "", ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-md bg-blue-600 text-white ${className}`}
    >
      {children}
    </button>
  );
};
