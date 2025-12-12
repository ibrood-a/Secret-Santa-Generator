import type { Metadata } from "next";
import Link from "next/link";

const title = "How to run a remote Secret Santa that feels personal";
const description =
  "Step-by-step checklist for hosting a remote Secret Santa: invite templates, rules for couples, wish lists, and reveal ideas.";
const canonicalPath = "/guides/remote-secret-santa";
const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_BASE_URL || "http://localhost:3000").replace(
    /\/+$/,
    ""
  );
const fullUrl = `${siteUrl}${canonicalPath}`;
const published = "2023-11-01";
const modified = "2024-11-15";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  datePublished: published,
  dateModified: modified,
  author: {
    "@type": "Person",
    name: "Jacob Kennedy"
  },
  publisher: {
    "@type": "Organization",
    name: "Secret Santa Drawer"
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": fullUrl
  }
};

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "remote secret santa",
    "virtual secret santa",
    "online gift exchange",
    "secret santa rules",
    "secret santa wish list"
  ],
  alternates: { canonical: canonicalPath },
  openGraph: {
    title,
    description,
    url: fullUrl,
    type: "article"
  },
  twitter: {
    card: "summary_large_image",
    title,
    description
  }
};

export default function RemoteSecretSantaGuide() {
  return (
    <main className="page-shell">
      <div className="frosted" style={{ padding: 28, display: "grid", gap: 16 }}>
        <div className="pill" style={{ width: "fit-content" }}>
          <span role="img" aria-label="laptop">
            💻
          </span>
          Remote hosting guide
        </div>
        <h1 style={{ margin: "6px 0 0", fontSize: 34 }}>{title}</h1>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{description}</p>
        <div style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: "8px 0 0" }}>Quick checklist</h2>
          <ul style={{ margin: "0 0 0 18px", color: "var(--muted)", lineHeight: 1.6 }}>
            <li>Pick a budget and reveal date/time that works across time zones.</li>
            <li>Collect emails only—no spreadsheets—and send private invite links.</li>
            <li>Ask for wish lists early so Santas can shop without guesswork.</li>
            <li>Add no-pair rules for couples or repeat matches from last year.</li>
            <li>Agree on shipping deadlines and ask for mailing addresses.</li>
            <li>Do a short video reveal with cameras on for reactions.</li>
          </ul>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: "10px 0 0" }}>Rules that avoid awkward draws</h2>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>
            Make couples and teammates ineligible to draw each other, prevent repeat pairings from last
            year, and hide the full participant list so nobody can reverse-engineer the draw.
          </p>
          <div className="status-grid">
            <div className="status-card" style={{ display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 700 }}>Couples exclusion</div>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Add pairs who shouldn&apos;t match. The draw re-rolls until every restriction is met.
              </p>
            </div>
            <div className="status-card" style={{ display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 700 }}>Pre-assigned matches</div>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Assign before invites go out so guests can reveal instantly—no live randomizer chaos.
              </p>
            </div>
            <div className="status-card" style={{ display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 700 }}>Private links</div>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Each person gets a unique URL. They can&apos;t see anyone else&apos;s match or the full list.
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: "10px 0 0" }}>Wish lists that make gifting easy</h2>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>
            Ask participants for 3–5 ideas with sizes, links, or shipping notes. Encourage budget-friendly
            picks and a “wild card” option so Santas can pick quickly. If you use our app, the giver sees
            the wish list right under their reveal.
          </p>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: "10px 0 0" }}>Sample agenda for a remote reveal</h2>
          <ol style={{ margin: "0 0 0 18px", color: "var(--muted)", lineHeight: 1.6, padding: 0 }}>
            <li>5 min — Quick hello and rules recap.</li>
            <li>10 min — Everyone opens their private link and reveals their match.</li>
            <li>10 min — Share wish lists; Santas ask clarifying questions.</li>
            <li>10 min — Pick a shipping deadline and confirm addresses.</li>
            <li>5 min — Decide on a wrap-up call date for the gift unboxing.</li>
          </ol>
        </div>
        <div className="frosted" style={{ padding: 18, display: "grid", gap: 10 }}>
          <h3 style={{ margin: 0 }}>Ready to run yours?</h3>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Set up your draw, email private links, and collect wish lists in minutes.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="button" href="/">
              Create your Secret Santa
            </Link>
            <Link className="pill" href="/signup" style={{ background: "rgba(255,255,255,0.05)" }}>
              Save your dashboard
            </Link>
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </main>
  );
}
