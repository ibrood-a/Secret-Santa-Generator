import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import authOptions from "../lib/authOptions";

export const metadata: Metadata = {
  title: "Sign in to Secret Santa Drawer",
  description: "Access your Secret Santa dashboard and host tools.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/login" }
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect("/dashboard");
  }
  return (
    <main className="page-shell">
      <div className="frosted" style={{ padding: 28, maxWidth: 560, margin: "0 auto" }}>
        <LoginForm />
      </div>
    </main>
  );
}
