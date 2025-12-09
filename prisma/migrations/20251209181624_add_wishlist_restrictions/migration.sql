-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "wishlist" TEXT;

-- CreateTable
CREATE TABLE "Restriction" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "blockedParticipantId" TEXT NOT NULL,

    CONSTRAINT "Restriction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restriction_participantId_blockedParticipantId_key" ON "Restriction"("participantId", "blockedParticipantId");

-- AddForeignKey
ALTER TABLE "Restriction" ADD CONSTRAINT "Restriction_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restriction" ADD CONSTRAINT "Restriction_blockedParticipantId_fkey" FOREIGN KEY ("blockedParticipantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
