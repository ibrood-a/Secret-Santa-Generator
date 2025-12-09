import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type Params = { params: { gameId: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const game = await prisma.game.findUnique({
      where: { id: params.gameId },
      include: {
        participants: {
          orderBy: { name: "asc" },
          select: { id: true, name: true, hasDrawn: true }
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
