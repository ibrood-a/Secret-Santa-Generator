import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string | undefined = body?.email?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    const token = process.env.MAILTRAP_API_TOKEN || process.env.MAILTRAP_TOKEN;
    if (user && token) {
      await fetch("https://send.api.mailtrap.io/api/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: { email: process.env.MAIL_FROM_ADDRESS || "invite@giftswap.site", name: "Secret Santa" },
          to: [{ email }],
          subject: "Your Secret Santa username",
          text: `Hi! Your username is: ${user.username}\n\nBuilt by Jacob Kennedy.`,
          category: "Username Lookup"
        })
      });
    }

    // Always respond success to avoid leaking whether the email exists
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("lookup-username failed", err);
    return NextResponse.json({ error: "Unable to process request." }, { status: 500 });
  }
}
