import { redirect } from "next/navigation";

async function verifyToken(token: string, email: string) {
  const res = await fetch(`${process.env.APP_BASE_URL || ""}/api/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, email })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data?.error || "Invalid link" };
  }
  return { ok: true };
}

export default async function VerifyPage({
  searchParams
}: {
  searchParams: { token?: string; email?: string };
}) {
  const token = searchParams.token;
  const email = searchParams.email;

  if (!token || !email) {
    redirect("/login");
  }

  const result = await verifyToken(token, email);
  if (result.ok) {
    redirect("/login?verified=1");
  }

  return (
    <main className="page-shell">
      <div className="frosted" style={{ padding: 28, maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ margin: "0 0 8px" }}>Verification failed</h2>
        <p style={{ margin: 0, color: "var(--muted)" }}>{result.error}</p>
      </div>
    </main>
  );
}
