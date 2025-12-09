/** Account creation with verification email. */
"use client";

import { useState } from "react";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSent(false);
    try {
      const resp = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, name })
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        setError(data?.error || "Could not create account.");
        return;
      }
      setSent(true);
    } catch (err) {
      setError("Unable to create account right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
      <div className="pill" style={{ width: "fit-content" }}>
        <span role="img" aria-label="sparkles">
          🌟
        </span>
        Create your account
      </div>
      <h2 style={{ margin: "4px 0 0" }}>Sign up</h2>
      <p style={{ margin: 0, color: "var(--muted)" }}>
        Verify your email once. Then sign in with username & password for 30 days.
      </p>
      <div style={{ display: "grid", gap: 8 }}>
        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="snowflake.jacob"
        />
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="********"
        />
      </div>
      {error ? (
        <div
          style={{
            color: "#ffd166",
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(255, 209, 102, 0.08)",
            border: "1px solid rgba(255, 209, 102, 0.3)"
          }}
        >
          {error}
        </div>
      ) : null}
      {sent ? (
        <div
          style={{
            color: "var(--accent-2)",
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(92,225,230,0.08)",
            border: "1px solid rgba(92,225,230,0.3)"
          }}
        >
          Check your email to verify your account.
        </div>
      ) : null}
      <button className="button" type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create account"}
      </button>
      <div style={{ marginTop: 8, color: "var(--muted)", fontSize: 14 }}>
        Already have an account? <a href="/login">Sign in</a>
      </div>
    </form>
  );
}
