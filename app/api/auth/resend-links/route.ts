import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string = body?.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const participants = await prisma.participant.findMany({
      where: { email, hasDrawn: false },
      include: { game: { select: { name: true, id: true } } }
    });

    if (participants.length === 0) {
      return NextResponse.json({ ok: true, sent: false });
    }

    const baseUrl = process.env.APP_BASE_URL || req.headers.get("origin") || "http://localhost:3000";
    const lines = participants.map(
      (p) => `- ${p.game.name}: ${baseUrl}/play/${p.accessToken}`
    );
    const text = `Here are your active Secret Santa links:\n\n${lines.join(
      "\n"
    )}\n\nKeep them secret!`;

    const token = process.env.MAILTRAP_API_TOKEN || process.env.MAILTRAP_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Mail token missing." }, { status: 500 });
    }

    const resp = await fetch("https://send.api.mailtrap.io/api/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: { email: process.env.MAIL_FROM_ADDRESS || "invite@giftswap.site", name: "Secret Santa Links" },
        to: [{ email }],
        subject: "Your active Secret Santa links",
        text,
        category: "Participant Links"
      })
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error("Resend links failed", resp.status, detail);
      return NextResponse.json({ error: "Could not send email." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, sent: true });
  } catch (err) {
    console.error("Resend links failed", err);
    return NextResponse.json({ error: "Unable to resend links right now." }, { status: 500 });
  }
}
