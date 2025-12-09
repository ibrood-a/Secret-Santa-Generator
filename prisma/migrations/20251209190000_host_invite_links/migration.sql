-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "organizerName" TEXT NOT NULL,
ALTER COLUMN "organizerEmail" SET NOT NULL;

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "accessToken" TEXT NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Participant_accessToken_key" ON "Participant"("accessToken");

