import type { Metadata } from "next";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set a new Secret Santa password",
  description: "Securely choose a new password for your Secret Santa Drawer account.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/reset-password" }
};

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
