import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import authOptions from "../lib/authOptions";

export const metadata: Metadata = {
  title: "Secret Santa dashboard",
  description: "View and manage every Secret Santa game you host.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/dashboard" }
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const games = await prisma.game.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      createdAt: true,
      participants: { select: { hasDrawn: true } }
    }
  });

  return (
    <main className="page-shell">
      <div className="frosted" style={{ padding: 26, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="pill">
              <span role="img" aria-label="snowflake">
                ❄️
              </span>
              Your games
            </div>
            <h2 style={{ margin: "10px 0 4px", letterSpacing: -0.02 }}>Dashboard</h2>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Manage every Secret Santa you created.
            </p>
          </div>
          <a className="button" href="/">
            + Create new game
          </a>
        </div>

        {games.length === 0 ? (
          <div style={{ color: "var(--muted)" }}>No games yet. Create your first one!</div>
        ) : (
          <div className="status-grid">
            {games.map((game) => {
              const drawn = game.participants.filter((p) => p.hasDrawn).length;
              const total = game.participants.length;
              return (
                <div key={game.id} className="status-card" style={{ display: "grid", gap: 8 }}>
                  <div style={{ fontWeight: 700 }}>{game.name}</div>
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>
                    {new Date(game.createdAt).toLocaleString()}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>
                    Progress: {drawn}/{total}
                  </div>
                  <a className="button" style={{ padding: "10px 12px", textAlign: "center" }} href={`/game/${game.id}`}>
                    Open host view
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
