/*
  Warnings:

  - You are about to drop the column `lastReviewed` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `mastered` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Word` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Word" DROP CONSTRAINT "Word_userId_fkey";

-- DropIndex
DROP INDEX "Word_userId_langFrom_langTo_idx";

-- DropIndex
DROP INDEX "Word_userId_typeCode_idx";

-- AlterTable
ALTER TABLE "Word" DROP COLUMN "lastReviewed",
DROP COLUMN "mastered",
DROP COLUMN "reviewCount",
DROP COLUMN "userId",
ADD COLUMN     "tag" TEXT;

-- DropEnum
DROP TYPE "WordTypeCode";

-- CreateTable
CREATE TABLE "UserWord" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "wordId" INTEGER NOT NULL,
    "lastReviewed" TIMESTAMP(3),
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "mastered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserWord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserWord_userId_idx" ON "UserWord"("userId");

-- CreateIndex
CREATE INDEX "UserWord_wordId_idx" ON "UserWord"("wordId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWord_userId_wordId_key" ON "UserWord"("userId", "wordId");

-- CreateIndex
CREATE INDEX "Word_langFrom_langTo_idx" ON "Word"("langFrom", "langTo");

-- CreateIndex
CREATE INDEX "Word_typeCode_idx" ON "Word"("typeCode");

-- AddForeignKey
ALTER TABLE "UserWord" ADD CONSTRAINT "UserWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWord" ADD CONSTRAINT "UserWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
