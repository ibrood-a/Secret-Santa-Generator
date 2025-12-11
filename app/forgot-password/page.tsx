import type { Metadata } from "next";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset your Secret Santa password",
  description: "Request a secure password reset link for your Secret Santa Drawer account.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/forgot-password" }
};

export default function ForgotPasswordPage() {
  return (
    <main className="page-shell">
      <div className="frosted" style={{ padding: 28, maxWidth: 560, margin: "0 auto" }}>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
