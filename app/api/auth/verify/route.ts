import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token: string | undefined = body?.token;
    const email: string | undefined = body?.email?.toLowerCase();

    if (!token || !email) {
      return NextResponse.json({ error: "Token and email are required." }, { status: 400 });
    }

    const record = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!record || record.identifier.toLowerCase() !== email) {
      return NextResponse.json({ error: "Invalid verification link." }, { status: 400 });
    }

    if (record.expires < new Date()) {
      return NextResponse.json({ error: "Verification link expired." }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() }
      }),
      prisma.verificationToken.delete({
        where: { token }
      })
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Verify failed", err);
    return NextResponse.json({ error: "Unable to verify right now." }, { status: 500 });
  }
}
