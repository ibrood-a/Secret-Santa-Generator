import type { Metadata } from "next";
import Link from "next/link";
import CreateGameForm from "../components/CreateGameForm";
import { getServerSession } from "next-auth";
import authOptions from "./lib/authOptions";

export const metadata: Metadata = {
  title: "Secret Santa generator with private invites & wish lists",
  description:
    "Spin up a Secret Santa draw, email unique reveal links, enforce no-repeat rules for couples, and collect wish lists—no spreadsheets needed.",
  alternates: { canonical: "/" }
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = Boolean(session?.user?.id);

  return (
    <main className="page-shell">
      <div style={{ display: "grid", gap: 24, alignItems: "center" }}>
        <div
          className="frosted"
          style={{
            padding: "32px 30px",
            display: "grid",
            gap: 16
          }}
        >
          <div className="pill" style={{ width: "fit-content" }}>
            <span role="img" aria-label="gift">
              🎁
            </span>
            Holiday-ready in minutes
          </div>
          <h1 style={{ margin: "6px 0 0", fontSize: 36, letterSpacing: -0.02 }}>
            Secret Santa generator with private invites & wish lists
          </h1>
          <p style={{ margin: "0", color: "var(--muted)", maxWidth: 820, lineHeight: 1.6 }}>
            Plan a polished gift exchange without spreadsheets. Email every player a unique link,
            prevent couples from drawing each other, and give Santas a wish list so they can shop
            confidently—whether you&apos;re running a family swap or a remote team hang.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <span className="pill" style={{ background: "rgba(92,225,230,0.14)" }}>
              No-repeat matching + couples exclusion
            </span>
            <span className="pill" style={{ background: "rgba(255,255,255,0.07)" }}>
              Private reveal links, no peeking
            </span>
            <span className="pill" style={{ background: "rgba(241,91,181,0.12)" }}>
              Wish lists for every participant
            </span>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {isLoggedIn ? (
              <>
                <a className="button" href="#create-game" style={{ textDecoration: "none" }}>
                  Start a new draw
                </a>
                <Link className="pill" href="/dashboard" style={{ background: "rgba(255,255,255,0.05)" }}>
                  View your dashboard
                </Link>
              </>
            ) : (
              <>
                <Link className="button" href="/signup">
                  Create your game
                </Link>
                <Link className="pill" href="/login" style={{ background: "rgba(255,255,255,0.05)" }}>
                  Already playing? Sign in
                </Link>
              </>
            )}
          </div>
        </div>

        {isLoggedIn ? (
          <div id="create-game" className="frosted" style={{ padding: 28 }}>
            <CreateGameForm />
          </div>
        ) : (
          <div className="frosted" style={{ padding: 24, display: "grid", gap: 12 }}>
            <div className="pill">
              <span role="img" aria-label="sparkles">
                ✨
              </span>
              Built for quick hosting
            </div>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>
              Make an account to save your draws, email invites, and share the host dashboard. We
              pre-assign matches to avoid loops, keep links private, and help guests add the wish
              lists that your Santas will actually read.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="button" href="/signup">
                Sign up free
              </Link>
              <Link className="pill" href="/login" style={{ background: "rgba(255,255,255,0.05)" }}>
                Already invited? Log in
              </Link>
            </div>
          </div>
        )}

        <section style={{ display: "grid", gap: 14 }}>
          <h2 style={{ margin: "4px 0" }}>Why Secret Santa Drawer wins</h2>
          <div className="status-grid">
            <div className="status-card" style={{ display: "grid", gap: 8 }}>
              <div style={{ fontWeight: 700 }}>Private by default</div>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Every participant gets a unique link so nobody can peek at other matches. Hosts
                track status without exposing the draw.
              </p>
            </div>
            <div className="status-card" style={{ display: "grid", gap: 8 }}>
              <div style={{ fontWeight: 700 }}>No-duplicate rules</div>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Avoid awkward repeats—set couples or coworkers who shouldn&apos;t match, and we keep
                drawing until every restriction is satisfied.
              </p>
            </div>
            <div className="status-card" style={{ display: "grid", gap: 8 }}>
              <div style={{ fontWeight: 700 }}>Wish lists included</div>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Guests add a wishlist for their Santa. The host sees progress, while the gift giver
                sees exactly what to buy.
              </p>
            </div>
          </div>
        </section>

        <section className="frosted" style={{ padding: 22, display: "grid", gap: 10 }}>
          <h2 style={{ margin: 0 }}>How it works</h2>
          <ol style={{ margin: "0 0 4px 18px", color: "var(--muted)", lineHeight: 1.6, padding: 0 }}>
            <li>List your players, add emails, and set any couples or no-pair rules.</li>
            <li>We pre-assign matches and email each person their private reveal link.</li>
            <li>Guests reveal with a confetti animation and drop their wish list for their Santa.</li>
            <li>The host dashboard shows draw status and resend-able invite links.</li>
          </ol>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>
            Perfect for teams, friend groups, and families hosting in-person or remote Secret Santas.
          </div>
        </section>

        <section style={{ display: "grid", gap: 12 }}>
          <h2 style={{ margin: "4px 0" }}>Guides and templates</h2>
          <div className="status-grid">
            <Link href="/guides/remote-secret-santa" className="status-card" style={{ display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 700 }}>Run a remote Secret Santa</div>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Checklist for time zones, wish lists, and reveal calls. Built for distributed teams and far-away friends.
              </p>
            </Link>
            <Link
              href="/guides/secret-santa-email-templates"
              className="status-card"
              style={{ display: "grid", gap: 6 }}
            >
              <div style={{ fontWeight: 700 }}>Email scripts you can copy</div>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Invite, reminder, and reveal-day emails that keep everyone on time—no rewrites needed.
              </p>
            </Link>
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "flex-end", color: "var(--muted)" }}>
          <Link href="https://santas.coffee" style={{ opacity: 0.45 }}>
            Need inspiration? Add a personal wish-list link into the notes after drawing.
          </Link>
        </div>
      </div>
    </main>
  );
}
