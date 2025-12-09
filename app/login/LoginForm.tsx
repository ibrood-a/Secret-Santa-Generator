/** Magic-link login form. */
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupStatus, setLookupStatus] = useState<"idle" | "sent" | "error">("idle");
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState<"idle" | "sent" | "error">("idle");
  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<"idle" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await signIn("credentials", {
      username,
      password,
      callbackUrl: "/dashboard",
      redirect: false
    });
    setSubmitting(false);
    if (res?.error) {
      const message =
        res.error === "CredentialsSignin"
          ? "Username or password is incorrect, or your email is not verified."
          : res.error;
      setError(message || "Could not sign in.");
      return;
    }
    if (res?.ok && res.url) {
      window.location.href = res.url;
    }
  };

  const handleResendLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendStatus("idle");
    try {
      const resp = await fetch("/api/auth/resend-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail })
      });
      if (!resp.ok) {
        setResendStatus("error");
        return;
      }
      const data = await resp.json();
      setResendStatus(data.sent ? "sent" : "error");
    } catch {
      setResendStatus("error");
    }
  };

  const handleLookupUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupStatus("idle");
    try {
      const resp = await fetch("/api/auth/lookup-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: lookupEmail })
      });
      if (!resp.ok) {
        setLookupStatus("error");
        return;
      }
      setLookupStatus("sent");
    } catch {
      setLookupStatus("error");
    }
  };

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus("idle");
    try {
      const resp = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail })
      });
      if (!resp.ok) {
        setResetStatus("error");
        return;
      }
      setResetStatus("sent");
    } catch {
      setResetStatus("error");
    }
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
        <div className="pill" style={{ width: "fit-content" }}>
          <span role="img" aria-label="sparkles">
            🔐
          </span>
          Username & password login
        </div>
        <h2 style={{ margin: "4px 0 0" }}>Sign in to manage your games</h2>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Use your account credentials. Sessions stay active for 30 days.
        </p>
        <div style={{ display: "grid", gap: 2 }}>
          <label htmlFor="username">Username</label>
          <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="your username" />
          <div style={{ fontSize: 13 }}>
            <a href="/forgot-username" style={{ color: "var(--accent-2)" }}>
              Forgot username?
            </a>
          </div>
        </div>
        <div style={{ display: "grid", gap: 2 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
          />
          <div style={{ fontSize: 13 }}>
            <a href="/forgot-password" style={{ color: "var(--accent-2)" }}>
              Forgot password?
            </a>
          </div>
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
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
        <div style={{ marginTop: 8, color: "var(--muted)", fontSize: 14 }}>
          New here? <a href="/signup">Create an account</a>
        </div>
      </form>

      <form
        onSubmit={handleResendLinks}
        style={{ paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)", display: "grid", gap: 10 }}
      >
        <h3 style={{ margin: "0 0 8px" }}>Resend my participant links</h3>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
          Enter your email and we&apos;ll email any active Secret Santa links for you.
        </p>
        <input
          type="email"
          value={resendEmail}
          onChange={(e) => setResendEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <button className="button" type="submit">
          Send me my links
        </button>
        {resendStatus === "sent" ? (
          <div style={{ color: "var(--accent-2)", marginTop: 8, fontSize: 14 }}>Email sent if we found active links.</div>
        ) : resendStatus === "error" ? (
          <div style={{ color: "#ffd166", marginTop: 8, fontSize: 14 }}>Could not send links. Try again.</div>
        ) : null}
      </form>
    </div>
  );
}
