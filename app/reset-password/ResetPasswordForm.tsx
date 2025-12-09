/** Reset password form. */
"use client";

import { useState } from "react";

type Props = {
  token: string;
  email: string;
};

export default function ResetPasswordForm({ token, email }: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setError("");
    if (!token || !email) {
      setError("Missing reset token. Please request a new reset link.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const resp = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password })
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        setError(data?.error || "Unable to reset password.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError("Unable to reset password.");
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
      <div className="pill" style={{ width: "fit-content" }}>
        <span role="img" aria-label="key">
          🔑
        </span>
        Reset password
      </div>
      <h2 style={{ margin: "4px 0 0" }}>Choose a new password</h2>
      <p style={{ margin: 0, color: "var(--muted)" }}>
        Enter your new password. This link expires after a short time.
      </p>
      <div style={{ display: "grid", gap: 8 }}>
        <label htmlFor="password">New password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="********"
        />
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <label htmlFor="confirm">Confirm password</label>
        <input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
      {status === "success" ? (
        <div
          style={{
            color: "var(--accent-2)",
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(92,225,230,0.08)",
            border: "1px solid rgba(92,225,230,0.3)"
          }}
        >
          Password reset! You can now <a href="/login">sign in</a>.
        </div>
      ) : null}
      <button className="button" type="submit" disabled={submitting}>
        {submitting ? "Resetting..." : "Reset password"}
      </button>
    </form>
  );
}
