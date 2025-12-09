import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import GameClient from "./GameClient";

export default async function GamePage({ params }: { params: { gameId: string } }) {
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
    notFound();
  }

  return (
    <main className="page-shell">
      <GameClient
        initialGame={{
          id: game.id,
          name: game.name,
          participants: game.participants
        }}
      />
    </main>
  );
}
