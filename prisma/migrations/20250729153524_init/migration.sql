-- CreateEnum
CREATE TYPE "LangCode" AS ENUM ('fr', 'es', 'en');

-- CreateEnum
CREATE TYPE "WordTypeCode" AS ENUM ('adj', 'n', 'nf', 'nm', 'vi', 'vt', 'adv', 'pron');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "userLanguage" "LangCode" NOT NULL DEFAULT 'en',
    "learnedLanguage" "LangCode" NOT NULL DEFAULT 'es',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "wordFrom" TEXT NOT NULL,
    "wordTo" TEXT NOT NULL,
    "exampleFrom" TEXT NOT NULL,
    "exampleTo" TEXT NOT NULL,
    "langFrom" "LangCode" NOT NULL,
    "langTo" "LangCode" NOT NULL,
    "typeCode" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "lastReviewed" TIMESTAMP(3),
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "mastered" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Word_userId_langFrom_langTo_idx" ON "Word"("userId", "langFrom", "langTo");

-- CreateIndex
CREATE INDEX "Word_userId_typeCode_idx" ON "Word"("userId", "typeCode");

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
