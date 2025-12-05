"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert("Registration successful. Please login.");
      router.push("/login");
    } else {
      const data = await res.json();
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div style={container}>
      <h2>Register</h2>

      <form onSubmit={handleRegister} style={formStyle}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={btnStyle}>
          Register
        </button>
      </form>

      <p style={{ marginTop: 10 }}>
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => router.push("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

/* ---------- STYLES (same as login) ---------- */

const container = {
  maxWidth: 350,
  margin: "50px auto",
  padding: 20,
  border: "1px solid #ddd",
  borderRadius: 10,
  textAlign: "center",
  fontFamily: "Arial",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
};

const inputStyle = {
  padding: 10,
  marginBottom: 10,
  fontSize: 16,
  borderRadius: 5,
  border: "1px solid #ccc",
};

const btnStyle = {
  padding: 10,
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
  fontSize: 16,
};
