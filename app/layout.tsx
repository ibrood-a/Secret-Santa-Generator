import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import "./globals.css";
import authOptions from "./lib/authOptions";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Secret Santa Drawer | Unique links, wish lists, no duplicates",
  description:
    "Host Secret Santa games, email unique invite links, enforce no-pair rules, and reveal with wish lists and animation.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/"
  },
  keywords: [
    "Secret Santa",
    "gift exchange",
    "holiday",
    "Christmas",
    "wish list",
    "random draw",
    "couples exclusion",
    "private links",
    "email invites"
  ],
  openGraph: {
    title: "Secret Santa Drawer | Host and reveal with wish lists",
    description:
      "Create Secret Santa games, send unique invite links, enforce no-pair rules, and reveal with confetti and wish lists.",
    url: siteUrl,
    siteName: "Secret Santa Drawer",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Secret Santa Drawer - built by Jacob Kennedy"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Secret Santa Drawer",
    description:
      "Email unique links, reveal matches privately, and collect wish lists. Built by Jacob Kennedy.",
    images: ["/og-image.svg"]
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Secret Santa Drawer",
              url: siteUrl,
              creator: {
                "@type": "Person",
                name: "Jacob Kennedy"
              },
              description:
                "Host Secret Santa games with unique links, wish lists, and no-pair rules. Built by Jacob Kennedy."
            })
          }}
        />
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
