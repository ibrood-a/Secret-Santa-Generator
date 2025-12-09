/** Client-side form to create a new Secret Santa game. */
"use client";

import { useEffect, useMemo, useState } from "react";

type ParticipantRow = {
  id: string;
  name: string;
  email: string;
  hasDrawn: boolean;
  link: string;
};

type CreatedGame = {
  id: string;
  name: string;
  participants: ParticipantRow[];
};

type RestrictionRow = { id: string; a: string; b: string };

type ParticipantInput = { id: string; name: string; email: string };

const demoList: ParticipantInput[] = [
  { id: crypto.randomUUID(), name: "", email: "" },
  { id: crypto.randomUUID(), name: "", email: "" }
];

export default function CreateGameForm() {
  const [name, setName] = useState("Jacob's Secret Santa Game");
  const [hostName, setHostName] = useState("Jacob Kennedy");
  const [participants, setParticipants] = useState<ParticipantInput[]>(demoList);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<CreatedGame | null>(null);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [restrictions, setRestrictions] = useState<RestrictionRow[]>([]);
  const [restrictionA, setRestrictionA] = useState("");
  const [restrictionB, setRestrictionB] = useState("");
  const [importText, setImportText] = useState("");

  useEffect(() => {
    setShareLink(created ? `${window.location.origin}/game/${created.id}` : "");
  }, [created]);

  const participantNames = useMemo(
    () => participants.map((p) => p.name).filter(Boolean),
    [participants]
  );

  useEffect(() => {
    setRestrictionA(participantNames[0] ?? "");
    setRestrictionB(participantNames[1] ?? "");
    setRestrictions((existing) =>
      existing.filter(
        (r) => participantNames.includes(r.a) && participantNames.includes(r.b) && r.a !== r.b
      )
    );
  }, [participantNames]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCopied(false);
    const cleaned = participants
      .map((p) => ({ ...p, name: p.name.trim(), email: p.email.trim() }))
      .filter((p) => p.name && p.email);
    if (cleaned.length < 2) {
      setError("Add at least two participants with an email address.");
      return;
    }
    const missingEmail = participants.some((p) => p.name && !p.email);
    if (missingEmail) {
      setError("Add emails for every participant so we can send their invite link.");
      return;
    }
    const seenNames = new Set<string>();
    for (const person of cleaned) {
      const key = person.name.toLocaleLowerCase();
      if (seenNames.has(key)) {
        setError("Participant names must be unique.");
        return;
      }
      seenNames.add(key);
    }

    setCreating(true);
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          hostName,
          participants: cleaned,
          restrictions: restrictions.map((r) => [r.a, r.b])
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

  const addRestriction = () => {
    if (!restrictionA || !restrictionB || restrictionA === restrictionB) return;
    const key = [restrictionA, restrictionB].sort().join("|");
    const existingKeys = new Set(
      restrictions.map((r) => [r.a, r.b].sort().join("|"))
    );
    if (existingKeys.has(key)) return;
    setRestrictions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), a: restrictionA, b: restrictionB }
    ]);
  };

  const removeRestriction = (id: string) => {
    setRestrictions((prev) => prev.filter((r) => r.id !== id));
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
        <label htmlFor="hostName">Host name</label>
        <input
          id="hostName"
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
          placeholder="Your name"
          required
        />
      </div>
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
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <label>Participants</label>
            <div style={{ color: "var(--muted)", fontSize: 14 }}>
              Add names and emails. Each gets a private link—no peeking.
            </div>
          </div>
          <button
            type="button"
            className="button"
            style={{ padding: "10px 12px" }}
            onClick={() =>
              setParticipants((prev) => [
                ...prev,
                { id: crypto.randomUUID(), name: "", email: "" }
              ])
            }
          >
            + Add person
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gap: 8,
            padding: "12px 14px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.05)"
          }}
        >
          <label htmlFor="import">Quick import (Name, Email per line)</label>
          <textarea
            id="import"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={3}
            placeholder="Name, email@example.com"
          />
          <button
            type="button"
            className="button"
            style={{ padding: "10px 12px", justifySelf: "flex-start" }}
            onClick={() => {
              const lines = importText.split("\n").map((l) => l.trim()).filter(Boolean);
              const parsed = lines
                .map((line) => {
                  const [rawName, rawEmail] = line.split(",");
                  const nameVal = rawName?.trim() || "";
                  const emailVal = rawEmail?.trim() || "";
                  if (!nameVal || !emailVal) return null;
                  return { id: crypto.randomUUID(), name: nameVal, email: emailVal };
                })
                .filter((v): v is ParticipantInput => Boolean(v));
              if (parsed.length === 0) return;
              // Merge and dedupe by email
              const existingByEmail = new Map<string, ParticipantInput>();
              const merged: ParticipantInput[] = [];
              parsed.forEach((p) => {
                if (!existingByEmail.has(p.email.toLowerCase())) {
                  existingByEmail.set(p.email.toLowerCase(), p);
                  merged.push(p);
                }
              });
              setParticipants(merged);
            }}
          >
            Import list
          </button>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {participants.map((p, idx) => (
            <div
              key={p.id}
              className="status-card"
              style={{
                display: "grid",
                gap: 10,
                gridTemplateColumns: "1fr 1fr auto",
                alignItems: "center"
              }}
            >
              <input
                value={p.name}
                onChange={(e) =>
                  setParticipants((prev) =>
                    prev.map((row) => (row.id === p.id ? { ...row, name: e.target.value } : row))
                  )
                }
                placeholder={`Name ${idx + 1}`}
              />
              <input
                value={p.email}
                onChange={(e) =>
                  setParticipants((prev) =>
                    prev.map((row) => (row.id === p.id ? { ...row, email: e.target.value } : row))
                  )
                }
                placeholder="email@example.com"
                type="email"
              />
              <button
                type="button"
                onClick={() => setParticipants((prev) => prev.filter((row) => row.id !== p.id))}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  color: "var(--text)",
                  padding: "8px 10px",
                  cursor: "pointer"
                }}
                disabled={participants.length <= 2}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
          <span>{participantNames.length} ready to draw</span>
          <span>We pre-assign matches for fast reveals.</span>
        </div>
      </div>
      {participantNames.length >= 2 && (
        <div
          style={{
            display: "grid",
            gap: 12,
            padding: 14,
            background: "rgba(255,255,255,0.03)",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.05)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700 }}>No-pair rules (couples, etc.)</div>
              <div style={{ color: "var(--muted)", fontSize: 14 }}>
                Prevent two people from drawing each other.
              </div>
            </div>
            <button
              type="button"
              className="button"
              style={{ padding: "10px 12px" }}
              onClick={addRestriction}
              disabled={!restrictionA || !restrictionB || restrictionA === restrictionB}
            >
              Add rule
            </button>
          </div>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr", alignItems: "center" }}>
            <div>
              <label htmlFor="restrict-a">Person A</label>
              <select
                id="restrict-a"
                value={restrictionA}
                onChange={(e) => setRestrictionA(e.target.value)}
              >
                {participantNames.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="restrict-b">Cannot be matched with</label>
              <select
                id="restrict-b"
                value={restrictionB}
                onChange={(e) => setRestrictionB(e.target.value)}
              >
                {participantNames.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {restrictions.length > 0 ? (
            <div className="status-grid">
              {restrictions.map((r) => (
                <div key={r.id} className="status-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {r.a} <span style={{ color: "var(--muted)" }}>↔</span> {r.b}
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: 14 }}>Won&apos;t be matched together</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRestriction(r.id)}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 10,
                      color: "var(--text)",
                      padding: "6px 10px",
                      cursor: "pointer"
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "var(--muted)", fontSize: 14 }}>No restrictions added yet.</div>
          )}
        </div>
      )}
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
          <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 14 }}>
            Created by {hostName}
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
            Host dashboard link. We also email each participant their private invite link.
          </div>
          <div className="status-grid" style={{ marginTop: 12 }}>
            {created.participants.map((p) => (
              <div key={p.id} className="status-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: 14 }}>{p.email}</div>
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 14 }}>
                    {p.hasDrawn ? "Already drawn" : "Waiting to draw"}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.04)",
                    fontSize: 13,
                    wordBreak: "break-all"
                  }}
                >
                  {p.link}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
