import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

type Params = { params: { token: string } };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();
    const wishlist: string =
      typeof body?.wishlist === "string" ? body.wishlist.trim().slice(0, 1000) : "";

    const participant = await prisma.participant.findUnique({
      where: { accessToken: params.token }
    });

    if (!participant) {
      return NextResponse.json({ error: "Invite not found." }, { status: 404 });
    }

    const updated = await prisma.participant.update({
      where: { id: participant.id },
      data: { wishlist: wishlist || null },
      select: { wishlist: true }
    });

    return NextResponse.json({ wishlist: updated.wishlist ?? "" });
  } catch (err) {
    console.error("Failed to save wishlist", err);
    return NextResponse.json({ error: "Unable to save wishlist right now." }, { status: 500 });
  }
}
