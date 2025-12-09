import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import PlayClient from "./PlayClient";

export default async function PlayPage({ params }: { params: { token: string } }) {
  const participant = await prisma.participant.findUnique({
    where: { accessToken: params.token },
    include: {
      game: { select: { id: true, name: true, organizerName: true } }
    }
  });

  if (!participant) {
    notFound();
  }

  return (
    <main className="page-shell">
      <PlayClient
        initialData={{
          participant: {
            id: participant.id,
            name: participant.name,
            hasDrawn: participant.hasDrawn,
            wishlist: participant.wishlist,
            token: participant.accessToken
          },
          game: {
            id: participant.game.id,
            name: participant.game.name,
            organizerName: participant.game.organizerName
          }
        }}
      />
    </main>
  );
}
