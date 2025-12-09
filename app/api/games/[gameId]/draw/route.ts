import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

type Params = { params: { gameId: string } };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();
    const participantId: string | undefined = body?.participantId;

    if (!participantId) {
      return NextResponse.json({ error: "Participant is required." }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const participant = await tx.participant.findFirst({
        where: { id: participantId, gameId: params.gameId },
        include: { assignedTo: true }
      });

      if (!participant) {
        return { status: 404, error: "Participant not found for this game." } as const;
      }

      if (participant.hasDrawn) {
        return { status: 409, error: "This name already got a match." } as const;
      }

      await tx.participant.update({
        where: { id: participant.id },
        data: { hasDrawn: true }
      });

      if (!participant.assignedTo) {
        return { status: 422, error: "Assignment missing for this participant." } as const;
      }

      return {
        status: 200 as const,
        recipientName: participant.assignedTo.name,
        participantName: participant.name
      };
    });

    if (result.status !== 200) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      recipientName: result.recipientName,
      participantName: result.participantName
    });
  } catch (err) {
    console.error("Failed to draw", err);
    return NextResponse.json({ error: "Unable to draw right now." }, { status: 500 });
  }
}
