/** Client-side form to create a new Secret Santa game. */
"use client";

import { useEffect, useMemo, useState } from "react";

type ParticipantRow = {
  id: string;
  name: string;
  hasDrawn: boolean;
};

type CreatedGame = {
  id: string;
  name: string;
  participants: ParticipantRow[];
};

const demoList = ["Alex", "Sam", "Jordan", "Priya", "Taylor", "Devon"].join("\n");

export default function CreateGameForm() {
  const [name, setName] = useState("Snowflake Exchange");
  const [email, setEmail] = useState("");
  const [participantsInput, setParticipantsInput] = useState(demoList);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<CreatedGame | null>(null);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareLink(created ? `${window.location.origin}/game/${created.id}` : "");
  }, [created]);

  const participantNames = useMemo(() => {
    const names = participantsInput
      .split(/[\n,]/)
      .map((n) => n.trim())
      .filter(Boolean);
    const unique = Array.from(new Set(names.map((n) => n.toLocaleLowerCase())));
    return names.filter((name, idx) => unique.indexOf(name.toLocaleLowerCase()) === idx);
  }, [participantsInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCopied(false);
    if (participantNames.length < 2) {
      setError("Add at least two participants (one per line).");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          organizerEmail: email,
          participants: participantNames
        })
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        setError(msg?.error || "Could not create the game.");
        return;
      }
      const data = (await res.json()) as CreatedGame;
      setCreated(data);
      setShareLink(`${window.location.origin}/game/${data.id}`);
    } catch (err) {
      setError("Could not reach the server. Try again.");
    } finally {
      setCreating(false);
    }
  };

  const copyLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <label htmlFor="name">Game title</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Snowflake Exchange"
          required
        />
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <label htmlFor="email">
          Organizer email <span style={{ color: "var(--muted)" }}>(optional)</span>
        </label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          type="email"
        />
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <label htmlFor="participants">
          Participants <span style={{ color: "var(--muted)" }}>(one per line)</span>
        </label>
        <textarea
          id="participants"
          value={participantsInput}
          onChange={(e) => setParticipantsInput(e.target.value)}
          rows={6}
        />
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
          <span>{participantNames.length} ready to draw</span>
          <span>We pre-assign matches for fast reveals.</span>
        </div>
      </div>
      {error ? (
        <div
          style={{
            color: "#ffd166",
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(255, 209, 102, 0.08)",
            border: "1px solid rgba(255, 209, 102, 0.3)"
          }}
        >
          {error}
        </div>
      ) : null}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          People only see their own match; once they reveal, their name disappears from the list.
        </p>
        <button className="button" type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create game"}
        </button>
      </div>

      {created && (
        <div className="frosted" style={{ padding: 18 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="pill">
              <span role="img" aria-label="sparkles">
                ✨
              </span>
              Game ready!
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "16px 18px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              gap: 14
            }}
          >
            <code style={{ wordBreak: "break-all", fontSize: 14 }}>{shareLink}</code>
            <button type="button" className="button" style={{ padding: "10px 14px" }} onClick={copyLink}>
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
          <div style={{ marginTop: 14, color: "var(--muted)" }}>
            Send this link to your group. They pick their own name and get the reveal animation instantly.
          </div>
          <div className="status-grid" style={{ marginTop: 12 }}>
            {created.participants.map((p) => (
              <div key={p.id} className="status-card">
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ color: "var(--muted)", fontSize: 14 }}>
                  {p.hasDrawn ? "Already drawn" : "Waiting to draw"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
