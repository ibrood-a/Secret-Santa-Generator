import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import "./globals.css";
import authOptions from "./lib/authOptions";

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_BASE_URL || "http://localhost:3000";
const siteUrl = rawSiteUrl.replace(/\/+$/, "");
const siteName = "Secret Santa Drawer";
const siteDescription =
  "Organize Secret Santa games with private email invites, no-repeat rules for couples, wish lists, and fast reveal animations.";
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      inLanguage: "en-US"
    },
    {
      "@type": "WebApplication",
      name: siteName,
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web",
      url: siteUrl,
      featureList: [
        "Private invite links for every participant",
        "Wishlist collection and sharing",
        "Couples and no-repeat match rules",
        "Pre-assigned draws to avoid conflicts",
        "Host dashboard with reveal status"
      ],
      creator: { "@type": "Person", name: "Jacob Kennedy" },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      potentialAction: {
        "@type": "RegisterAction",
        target: `${siteUrl}/signup`,
        name: "Create a Secret Santa game"
      }
    }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Unique links, wish lists, no duplicates`,
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "Jacob Kennedy" }],
  creator: "Jacob Kennedy",
  publisher: "Jacob Kennedy",
  category: "Events",
  alternates: {
    canonical: "/"
  },
  keywords: [
    "secret santa generator",
    "secret santa app",
    "gift exchange organizer",
    "holiday party ideas",
    "wishlist secret santa",
    "no repeat secret santa",
    "couples exclusion",
    "private invite links",
    "email secret santa invites",
    "virtual secret santa"
  ],
  openGraph: {
    title: `${siteName} | Host and reveal with wish lists`,
    description: siteDescription,
    url: siteUrl,
    siteName,
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
    title: siteName,
    description:
      "Email unique links, reveal matches privately, and collect wish lists. Built by Jacob Kennedy.",
    images: ["/og-image.svg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1
    }
  },
  themeColor: "#0b1a2c"
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
            __html: JSON.stringify(structuredData)
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
