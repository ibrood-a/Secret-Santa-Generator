import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type Params = { params: Promise<{ gameId: string }> };

export async function GET(_req: NextRequest, context: Params) {
  try {
    const { gameId } = await context.params;
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        participants: {
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            email: true,
            hasDrawn: true,
            wishlist: true,
            accessToken: true
          }
        }
      }
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found." }, { status: 404 });
    }

    return NextResponse.json({
      id: game.id,
      name: game.name,
      participants: game.participants
    });
  } catch (err) {
    console.error("Failed to fetch game", err);
    return NextResponse.json(
      { error: "Unable to load this game right now." },
      { status: 500 }
    );
  }
}
