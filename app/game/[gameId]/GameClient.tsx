"use client";

import { useMemo, useState } from "react";

type Participant = {
  id: string;
  name: string;
  hasDrawn: boolean;
};

type GameClientProps = {
  initialGame: {
    id: string;
    name: string;
    participants: Participant[];
  };
};

export default function GameClient({ initialGame }: GameClientProps) {
  const [participants, setParticipants] = useState<Participant[]>(initialGame.participants);
  const [selected, setSelected] = useState<string>(
    initialGame.participants.find((p) => !p.hasDrawn)?.id ??
      initialGame.participants[0]?.id ??
      ""
  );
  const [reveal, setReveal] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [revealing, setRevealing] = useState(false);
  const [burst, setBurst] = useState(0);

  const remaining = useMemo(() => participants.filter((p) => !p.hasDrawn), [participants]);

  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      setError("Pick your name to get a match.");
      return;
    }
    setError("");
    setReveal(null);
    setRevealing(true);
    try {
      const res = await fetch(`/api/games/${initialGame.id}/draw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: selected })
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        setError(msg?.error || "Could not draw. Try again.");
        return;
      }
      const data = await res.json();
      setReveal(data.recipientName as string);
      const updated = participants.map((p) =>
        p.id === selected ? { ...p, hasDrawn: true } : p
      );
      setParticipants(updated);
      const nextAvailable = updated.find((p) => !p.hasDrawn);
      setSelected(nextAvailable?.id ?? "");
      setBurst((b) => b + 1);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setRevealing(false);
    }
  };

  return (
    <div className="frosted" style={{ padding: 26, display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div className="pill">
            <span role="img" aria-label="holly">
              🍬
            </span>
            {initialGame.name}
          </div>
          <h2 style={{ margin: "10px 0 4px", letterSpacing: -0.02 }}>Pick your name to reveal</h2>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Everyone only sees their match. Once you reveal, your name leaves the list.
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>Remaining</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{remaining.length}</div>
        </div>
      </div>

      {participants.length === 0 ? (
        <div style={{ color: "var(--muted)" }}>No participants were added to this game.</div>
      ) : (
        <form onSubmit={handleReveal} style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label htmlFor="participant">Who are you?</label>
            <select
              id="participant"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              disabled={remaining.length === 0}
            >
              {participants.map((p) => (
                <option key={p.id} value={p.id} disabled={p.hasDrawn}>
                  {p.name} {p.hasDrawn ? "— already drawn" : ""}
                </option>
              ))}
            </select>
          </div>
          <button className="button" type="submit" disabled={revealing || remaining.length === 0}>
            {revealing ? "Drawing..." : remaining.length === 0 ? "Everyone is drawn" : "Reveal my person"}
          </button>
        </form>
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

      {reveal && (
        <div className="reveal-stage">
          <div className="reveal-card">
            <div style={{ color: "var(--muted)", textTransform: "uppercase", fontSize: 12, letterSpacing: 1.5 }}>
              Your Secret Santa pick is
            </div>
            <div style={{ marginTop: 8, fontSize: 24 }}>
              <span className="recipient-name">{reveal}</span>
            </div>
            <p style={{ color: "var(--muted)", marginTop: 10 }}>
              Keep it secret, keep it silly. Add a wish-list or gift notes right after you reveal!
            </p>
          </div>
          <ConfettiBurst key={burst} />
        </div>
      )}

      <div className="status-grid">
        {participants.map((p) => (
          <div key={p.id} className="status-card">
            <div style={{ fontWeight: 700 }}>{p.name}</div>
            <div style={{ color: "var(--muted)", fontSize: 14 }}>
              {p.hasDrawn ? "🎉 Drawn" : "⏳ Waiting"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfettiBurst() {
  const colors = ["#f15bb5", "#5ce1e6", "#ffd166", "#b8c1ec", "#f28f3b"];
  const pieces = new Array(22).fill(0).map((_, idx) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 0.35;
    const rotation = Math.random() * 360;
    const color = colors[idx % colors.length];
    return { left, delay, rotation, color };
  });
  return (
    <div className="confetti">
      {pieces.map((piece, idx) => (
        <span
          key={idx}
          style={{
            left: `${piece.left}%`,
            background: piece.color,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg)`
          }}
        />
      ))}
    </div>
  );
}
