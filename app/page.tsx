import Link from "next/link";
import CreateGameForm from "../components/CreateGameForm";
import {getServerSession} from "next-auth";
import authOptions from "./lib/authOptions";
import {redirect} from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <main className="page-shell">
      <div style={{ display: "grid", gap: 24, alignItems: "center" }}>
        <div
          className="frosted"
          style={{
            padding: "32px 30px",
            display: "grid",
            gap: 14
          }}
        >
          <div className="pill" style={{ width: "fit-content" }}>
            <span role="img" aria-label="gift">
              🎁
            </span>
            Secret Santa in minutes
          </div>
          <h1 style={{ margin: "6px 0 0", fontSize: 36, letterSpacing: -0.02 }}>
            {"Jacob's Secret Santa Generator"}
          </h1>
          <p style={{ margin: "0", color: "var(--muted)", maxWidth: 780 }}>
            Add your players with emails, set no-pair rules for couples, and we&apos;ll send each
            person a private link so they can&apos;t peek at anyone else. Reveal animations plus a
            personal wish list for every participant.
          </p>
        </div>
        <div className="frosted" style={{ padding: 28 }}>
          <CreateGameForm />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", color: "var(--muted)" }}>
          <Link href="https://santas.coffee" style={{ opacity: 0.45 }}>
            Need inspiration? Add a personal wish-list link into the notes after drawing.
          </Link>
        </div>
      </div>
    </main>
  );
}
