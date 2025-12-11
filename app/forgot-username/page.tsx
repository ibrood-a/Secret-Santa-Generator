import type { Metadata } from "next";
import ForgotUsernameForm from "./ForgotUsernameForm";

export const metadata: Metadata = {
  title: "Find your Secret Santa username",
  description: "Recover the username tied to your Secret Santa Drawer account.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/forgot-username" }
};

export default function ForgotUsernamePage() {
  return (
    <main className="page-shell">
      <div className="frosted" style={{ padding: 28, maxWidth: 560, margin: "0 auto" }}>
        <ForgotUsernameForm />
      </div>
    </main>
  );
}
