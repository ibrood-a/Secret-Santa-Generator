import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { buildAssignments } from "../../../lib/assignment";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name: string | undefined = body?.name;
    const organizerEmail: string | undefined = body?.organizerEmail;
    const participantNames: string[] = Array.isArray(body?.participants) ? body.participants : [];

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    const sanitizedNames = participantNames
      .map((n) => (typeof n === "string" ? n.trim() : ""))
      .filter(Boolean);
    const uniqueNames = Array.from(new Set(sanitizedNames.map((n) => n.toLocaleLowerCase()))).map(
      (lower) => sanitizedNames.find((n) => n.toLocaleLowerCase() === lower) as string
    );

    if (uniqueNames.length < 2) {
      return NextResponse.json({ error: "Add at least two participants." }, { status: 400 });
    }

    const game = await prisma.$transaction(async (tx) => {
      const createdGame = await tx.game.create({
        data: {
          name: name.trim(),
          organizerEmail: organizerEmail?.trim() || null,
          participants: {
            create: uniqueNames.map((participantName) => ({
              name: participantName
            }))
          }
        },
        include: { participants: true }
      });

      const assignments = buildAssignments(createdGame.participants.map((p) => p.id));
      await Promise.all(
        assignments.map((pair) =>
          tx.participant.update({
            where: { id: pair.drawerId },
            data: { assignedToId: pair.recipientId }
          })
        )
      );

      return createdGame;
    });

    return NextResponse.json({
      id: game.id,
      name: game.name,
      participants: game.participants.map((p) => ({
        id: p.id,
        name: p.name,
        hasDrawn: p.hasDrawn
      }))
    });
  } catch (err) {
    console.error("Failed to create game", err);
    return NextResponse.json(
      { error: "Could not create the game. Please try again." },
      { status: 500 }
    );
  }
}
