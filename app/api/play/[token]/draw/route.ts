import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

type Params = { params: { token: string } };

export async function POST(_req: Request, { params }: Params) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const participant = await tx.participant.findUnique({
        where: { accessToken: params.token },
        include: { assignedTo: true }
      });

      if (!participant) {
        return { status: 404, error: "Invite not found." } as const;
      }

      if (participant.hasDrawn) {
        return { status: 409, error: "You already drew your person." } as const;
      }

      if (!participant.assignedTo) {
        return { status: 422, error: "Assignment missing for this participant." } as const;
      }

      await tx.participant.update({
        where: { id: participant.id },
        data: { hasDrawn: true }
      });

      return {
        status: 200 as const,
        recipientName: participant.assignedTo.name,
        recipientWishlist: participant.assignedTo.wishlist ?? ""
      };
    });

    if (result.status !== 200) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      recipientName: result.recipientName,
      recipientWishlist: result.recipientWishlist
    });
  } catch (err) {
    console.error("Failed to draw", err);
    return NextResponse.json({ error: "Unable to draw right now." }, { status: 500 });
  }
}
