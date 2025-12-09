import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "../../../../lib/prisma";

const HASH_ROUNDS = 12;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username: string = body?.username?.trim();
    const email: string = body?.email?.trim().toLowerCase();
    const password: string = body?.password;
    const name: string = body?.name?.trim();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email, and password are required." }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });
    if (existing) {
      return NextResponse.json({ error: "Account with that email or username already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, HASH_ROUNDS);

    const verificationToken = crypto.randomUUID();
    const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    const user = await prisma.user.create({
      data: {
        username,
        email,
        name: name || username,
        passwordHash
      }
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: verificationExpires
      }
    });

    const baseUrl = process.env.APP_BASE_URL || req.headers.get("origin") || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    const token = process.env.MAILTRAP_API_TOKEN || process.env.MAILTRAP_TOKEN;
    if (token) {
      await fetch("https://send.api.mailtrap.io/api/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: { email: process.env.MAIL_FROM_ADDRESS || "invite@giftswap.site", name: process.env.MAIL_FROM_NAME || "Secret Santa" },
          to: [{ email }],
          subject: "Verify your Secret Santa account",
          text: `Hi ${username},\n\nVerify your account: ${verifyUrl}\nThis link expires in 24 hours.\n\nBuilt by Jacob Kennedy.`,
          category: "Account Verification"
        })
      });
    }

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (err) {
    console.error("Register failed", err);
    return NextResponse.json({ error: "Unable to register right now." }, { status: 500 });
  }
}
