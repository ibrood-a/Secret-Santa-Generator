/** Forgot password form. */
"use client";

import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setSubmitting(true);
    try {
      const resp = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!resp.ok) {
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
      <div className="pill" style={{ width: "fit-content" }}>
        <span role="img" aria-label="lock">
          🔒
        </span>
        Forgot password
      </div>
      <h2 style={{ margin: "4px 0 0" }}>Get a reset link</h2>
      <p style={{ margin: 0, color: "var(--muted)" }}>
        Enter your email and we&apos;ll send a password reset link if it exists.
      </p>
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
      {status === "sent" ? (
        <div style={{ color: "var(--accent-2)", fontSize: 14 }}>If that email exists, we sent a reset link.</div>
      ) : status === "error" ? (
        <div style={{ color: "#ffd166", fontSize: 14 }}>Could not send reset link. Try again.</div>
      ) : null}
      <button className="button" type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
