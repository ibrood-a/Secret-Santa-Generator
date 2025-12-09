import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage({
  searchParams
}: {
  searchParams: { token?: string; email?: string };
}) {
  const token = searchParams.token || "";
  const email = searchParams.email || "";

  return (
    <main className="page-shell">
      <div className="frosted" style={{ padding: 28, maxWidth: 560, margin: "0 auto" }}>
        <ResetPasswordForm token={token} email={email} />
      </div>
    </main>
  );
}
