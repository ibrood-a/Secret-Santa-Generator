import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "../../../lib/prisma";

export default async function GamePage({ params }: { params: { gameId: string } }) {
  const game = await prisma.game.findUnique({
    where: { id: params.gameId },
    select: {
      id: true,
      name: true,
      organizerName: true,
      organizerEmail: true,
      participants: {
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          email: true,
          hasDrawn: true,
          wishlist: true,
          accessToken: true
        }
      }
    }
  });

  if (!game) {
    notFound();
  }

  const headerList = headers();
  const baseUrl =
    headerList.get("origin") ||
    process.env.APP_BASE_URL ||
    `${process.env.VERCEL_URL ? "https://" : "http://"}${process.env.VERCEL_URL ?? "localhost:3000"}`;

  return (
    <main className="page-shell">
      <div className="frosted" style={{ padding: 26, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="pill">
              <span role="img" aria-label="clipboard">
                📋
              </span>
              Host view
            </div>
          <h2 style={{ margin: "10px 0 4px", letterSpacing: -0.02 }}>
            {game.name} participants
          </h2>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Created by {game.organizerName}. Share the unique invite links below. Guests cannot see other
            matches.
          </p>
          <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 13 }}>
            App built by Jacob Kennedy.
          </div>
        </div>
      </div>

        <div className="status-grid">
          {game.participants.map((p) => (
            <div key={p.id} className="status-card" style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>{p.email}</div>
                </div>
                <div style={{ color: "var(--muted)", fontSize: 14 }}>
                  {p.hasDrawn ? "🎉 Drawn" : "⏳ Waiting"}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  flexWrap: "wrap"
                }}
              >
                <code style={{ fontSize: 12, wordBreak: "break-all", flex: "1 1 auto" }}>
                  {`${baseUrl}/play/${p.accessToken}`}
                </code>
              </div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                Wish list: {p.wishlist ? "Added" : "Not yet"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
