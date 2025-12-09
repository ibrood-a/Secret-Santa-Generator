import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import "./globals.css";
import authOptions from "./lib/authOptions";

export const metadata: Metadata = {
  title: "Secret Santa Drawer",
  description: "Share a link, pick your name, and reveal your Secret Santa match."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body>
        <div className="builder-badge">Built by Jacob Kennedy</div>
        <div style={{ position: "fixed", top: 18, right: 18, zIndex: 90 }}>
          {session?.user ? (
            <div style={{ display: "flex", gap: 8 }}>
              <a href="/dashboard" className="pill" style={{ background: "rgba(92,225,230,0.12)" }}>
                Dashboard
              </a>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="pill"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    cursor: "pointer"
                  }}
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <a href="/login" className="pill" style={{ background: "rgba(255,255,255,0.05)" }}>
              Sign in
            </a>
          )}
        </div>
        {children}
      </body>
    </html>
  );
}
