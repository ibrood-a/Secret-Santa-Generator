import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignupForm from "./SignupForm";
import authOptions from "../lib/authOptions";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect("/dashboard");
  }
  return (
    <main className="page-shell">
      <div className="frosted" style={{ padding: 28, maxWidth: 560, margin: "0 auto" }}>
        <SignupForm />
      </div>
    </main>
  );
}
