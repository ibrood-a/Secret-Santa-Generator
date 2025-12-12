import type { Metadata } from "next";
import Link from "next/link";

const title = "Secret Santa email templates for invites, reminders, and reveals";
const description =
  "Copy-paste Secret Santa email scripts for invites, reminders, and wish list follow-ups that keep everyone on track.";
const canonicalPath = "/guides/secret-santa-email-templates";
const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_BASE_URL || "http://localhost:3000").replace(
    /\/+$/,
    ""
  );
const fullUrl = `${siteUrl}${canonicalPath}`;
const published = "2023-11-08";
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
    "secret santa email template",
    "secret santa invite email",
    "secret santa reminder email",
    "gift exchange email",
    "holiday party email"
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

const Block = ({
  label,
  subject,
  body
}: {
  label: string;
  subject: string;
  body: string;
}) => (
  <div className="status-card" style={{ display: "grid", gap: 8 }}>
    <div style={{ fontWeight: 700 }}>{label}</div>
    <div style={{ color: "var(--muted)", fontSize: 14 }}>Subject: {subject}</div>
    <pre
      style={{
        margin: 0,
        whiteSpace: "pre-wrap",
        fontFamily: "Menlo, Consolas, monospace",
        fontSize: 14,
        color: "var(--text)",
        background: "rgba(255,255,255,0.04)",
        borderRadius: 10,
        padding: "12px 14px",
        border: "1px solid rgba(255,255,255,0.05)"
      }}
    >
      {body}
    </pre>
  </div>
);

export default function SecretSantaEmailTemplates() {
  return (
    <main className="page-shell">
      <div className="frosted" style={{ padding: 28, display: "grid", gap: 16 }}>
        <div className="pill" style={{ width: "fit-content" }}>
          <span role="img" aria-label="envelope">
            ✉️
          </span>
          Email scripts
        </div>
        <h1 style={{ margin: "6px 0 0", fontSize: 34 }}>{title}</h1>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{description}</p>
        <div className="status-grid">
          <Block
            label="Invite"
            subject="You’re invited to our Secret Santa!"
            body={`Hi {{name}},

You’re in for Secret Santa this year. Budget: {{budget}}, reveal date: {{reveal_date}}, location/Zoom: {{location}}.

To keep things fair, open your private link to see your match and add a wish list: {{invite_link}}

Rules:
- Please keep your match secret.
- Add 3–5 wish list items with sizes/links by {{wishlist_deadline}}.
- Budget is a guideline; please stay close.

Thanks!
{{host_name}}`}
          />
          <Block
            label="Reminder to add wish list"
            subject="Quick reminder: add your wish list today"
            body={`Hi {{name}},

Friendly nudge: add your wish list for Secret Santa so your giver can shop with confidence.

Your private link: {{invite_link}}

Please add 3–5 ideas with sizes or links. Deadline: {{wishlist_deadline}}.

Thanks!
{{host_name}}`}
          />
          <Block
            label="Shipping info for remote swap"
            subject="Shipping details for Secret Santa"
            body={`Hi {{name}},

If your gift needs shipping, here’s what to include:
- Use the wish list for sizing/links.
- Aim to order by {{ship_by}}.
- Include a note with your recipient’s name (not yours).

Your private link for wish list and match: {{invite_link}}

Happy gifting!
{{host_name}}`}
          />
          <Block
            label="Reveal day logistics"
            subject="Reveal day details"
            body={`Hi {{name}},

Reveal time is {{reveal_date}} at {{reveal_time}}. Join here: {{meeting_link}}.

Bring your gift or tracking number. We’ll do a quick round where Santas share what they picked.

If you can’t make it, DM me and I’ll keep your recipient updated.

See you soon,
{{host_name}}`}
          />
        </div>
        <div className="frosted" style={{ padding: 18, display: "grid", gap: 10 }}>
          <h3 style={{ margin: 0 }}>Send automatically</h3>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            When you create a game here, every participant gets their invite link by email
            automatically, and you can resend from your host dashboard.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="button" href="/">
              Create your Secret Santa
            </Link>
            <Link className="pill" href="/dashboard" style={{ background: "rgba(255,255,255,0.05)" }}>
              View host tools
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
