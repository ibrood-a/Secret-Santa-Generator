import Link from "next/link";
import CreateGameForm from "../components/CreateGameForm";

export default function HomePage() {
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
            Create a Secret Santa draw, share a link, let people reveal with a flourish.
          </h1>
          <p style={{ margin: "0", color: "var(--muted)", maxWidth: 780 }}>
            Paste your players, generate a room link, and each person selects their name to get a
            private match with a playful reveal animation. No logins, just fun.
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
