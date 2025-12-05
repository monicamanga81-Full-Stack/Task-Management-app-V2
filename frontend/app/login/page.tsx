"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const res = await fetch("http://localhost:4000/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       localStorage.setItem("token", data.token);
//       router.push("/dashboard");
//     } else {
//       alert(data.message || "Login failed");
//     }
//   };
const handleLogin = async (e) => {
  e.preventDefault();

  const res = await fetch("http://localhost:4000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.access_token); // <-- FIX
    router.push("/dashboard");
  } else {
    alert(data.message || "Login failed");
  }
};


  return (
    <div style={container}>
      <h2>Login</h2>

      <form onSubmit={handleLogin} style={formStyle}>
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
          Login
        </button>
      </form>

      <p style={{ marginTop: 10 }}>
        Don’t have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => router.push("/register")}
        >
          Register
        </span>
      </p>
    </div>
  );
}

/* ---------- STYLES ---------- */

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
  background: "#28a745",
  color: "white",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
  fontSize: 16,
};
