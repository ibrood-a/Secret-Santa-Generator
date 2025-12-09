"use client";

import { useState } from "react";

type PlayClientProps = {
  initialData: {
    participant: {
      id: string;
      name: string;
      hasDrawn: boolean;
      wishlist: string | null;
      token: string;
    };
    game: {
      id: string;
      name: string;
      organizerName: string;
    };
  };
};

export default function PlayClient({ initialData }: PlayClientProps) {
  const [hasDrawn, setHasDrawn] = useState(initialData.participant.hasDrawn);
  const [reveal, setReveal] = useState<string | null>(null);
  const [recipientWishlist, setRecipientWishlist] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [revealing, setRevealing] = useState(false);
  const [burst, setBurst] = useState(0);
  const [wishlistInput, setWishlistInput] = useState(initialData.participant.wishlist ?? "");
  const [wishlistSaving, setWishlistSaving] = useState(false);
  const [wishlistSaved, setWishlistSaved] = useState(false);
  const [alreadyDrawn, setAlreadyDrawn] = useState(initialData.participant.hasDrawn);

  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setReveal(null);
    setRecipientWishlist(null);
    setRevealing(true);
    try {
      const res = await fetch(`/api/play/${initialData.participant.token}/draw`, {
        method: "POST"
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        setError(msg?.error || "Could not draw. Try again.");
        return;
      }
      const data = await res.json();
      setReveal(data.recipientName as string);
      setRecipientWishlist((data.recipientWishlist as string) || null);
      setHasDrawn(true);
      setAlreadyDrawn(Boolean(data.alreadyDrawn));
      if (!data.alreadyDrawn) {
        setBurst((b) => b + 1);
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setRevealing(false);
    }
  };

  const handleWishlistSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setWishlistSaving(true);
    setWishlistSaved(false);
    try {
      const res = await fetch(`/api/play/${initialData.participant.token}/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlist: wishlistInput })
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        setError(msg?.error || "Could not save wish list.");
        return;
      }
      setWishlistSaved(true);
      setTimeout(() => setWishlistSaved(false), 2000);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setWishlistSaving(false);
    }
  };

  return (
    <div className="frosted" style={{ padding: 26, display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div className="pill">
            <span role="img" aria-label="gift">
              🎁
            </span>
            {initialData.game.name}
          </div>
          <div className="pill" style={{ background: "rgba(92,225,230,0.12)", marginLeft: "14px" }}>
            Link locked to you
          </div>
          <h2 style={{ margin: "10px 0 4px", letterSpacing: -0.02 }}>Hi {initialData.participant.name}</h2>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Created by {initialData.game.organizerName}. This link is just for you. Reveal your match and add your wish list below.
          </p>
          <div style={{ marginTop: 4, color: "var(--muted)", fontSize: 13 }}>
            App built by Jacob Kennedy.
          </div>
        </div>
      </div>

      <form onSubmit={handleReveal} style={{ display: "grid", gap: 12 }}>
        <button className="button" type="submit" disabled={revealing}>
          {revealing ? "Drawing..." : hasDrawn ? "Show my person" : "Reveal my person"}
        </button>
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
      </form>

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
              Keep it secret, keep it silly. Add your wish list so they know what you love.
            </p>
            {recipientWishlist ? (
              <div
                style={{
                  marginTop: 10,
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  color: "var(--text)"
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Their wish list</div>
                <div style={{ color: "var(--muted)", whiteSpace: "pre-line" }}>{recipientWishlist}</div>
              </div>
            ) : (
              <div style={{ marginTop: 8, color: "var(--muted)", fontSize: 14 }}>
                They haven&apos;t added a wish list yet.
              </div>
            )}
          </div>
          <ConfettiBurst key={burst} />
        </div>
      )}

      <div
        style={{
          padding: 16,
          borderRadius: 14,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "grid",
          gap: 10
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700 }}>Your wish list</div>
            <div style={{ color: "var(--muted)", fontSize: 14 }}>
              Only your Secret Santa sees this after they draw you.
            </div>
          </div>
          {wishlistSaved ? (
            <span className="pill" style={{ background: "rgba(92,225,230,0.1)" }}>
              Saved
            </span>
          ) : null}
        </div>
        <form onSubmit={handleWishlistSave} style={{ display: "grid", gap: 10 }}>
          <textarea
            value={wishlistInput}
            onChange={(e) => setWishlistInput(e.target.value)}
            rows={3}
            placeholder="Links, ideas, sizes..."
          />
          <button className="button" type="submit" disabled={wishlistSaving}>
            {wishlistSaving ? "Saving..." : "Save my wish list"}
          </button>
        </form>
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
