import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

const HASH_ROUNDS = 12;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token: string | undefined = body?.token;
    const email: string | undefined = body?.email?.trim().toLowerCase();
    const password: string | undefined = body?.password;

    if (!token || !email || !password) {
      return NextResponse.json({ error: "Token, email, and password are required." }, { status: 400 });
    }

    const record = await prisma.verificationToken.findUnique({
      where: { token }
    });

    const identifier = `reset:${email}`;

    if (!record || record.identifier !== identifier) {
      return NextResponse.json({ error: "Invalid or expired reset link." }, { status: 400 });
    }

    if (record.expires < new Date()) {
      return NextResponse.json({ error: "Reset link expired." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, HASH_ROUNDS);

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { passwordHash }
      }),
      prisma.verificationToken.delete({
        where: { token }
      })
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("reset-password failed", err);
    return NextResponse.json({ error: "Unable to reset password right now." }, { status: 500 });
  }
}
