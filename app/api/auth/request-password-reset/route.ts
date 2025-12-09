import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string | undefined = body?.email?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ ok: true }); // do not leak existence
    }

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    const identifier = `reset:${email}`;

    await prisma.$transaction([
      prisma.verificationToken.deleteMany({ where: { identifier } }),
      prisma.verificationToken.create({
        data: {
          identifier,
          token,
          expires
        }
      })
    ]);

    const baseUrl = process.env.APP_BASE_URL || req.headers.get("origin") || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    const mailToken = process.env.MAILTRAP_API_TOKEN || process.env.MAILTRAP_TOKEN;
    if (mailToken) {
      await fetch("https://send.api.mailtrap.io/api/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mailToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: { email: process.env.MAIL_FROM_ADDRESS || "invite@giftswap.site", name: "Secret Santa" },
          to: [{ email }],
          subject: "Reset your Secret Santa password",
          text: `Hi ${user.username},\n\nReset your password here: ${resetUrl}\nThis link expires in 1 hour.\n\nBuilt by Jacob Kennedy.`,
          category: "Password Reset"
        })
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("request-password-reset failed", err);
    return NextResponse.json({ error: "Unable to process request." }, { status: 500 });
  }
}
