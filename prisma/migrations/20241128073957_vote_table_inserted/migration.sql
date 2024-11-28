/*
  Warnings:

  - Added the required column `status` to the `Etiquette_per_experiences` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoteStatus" AS ENUM ('UP', 'DOWN');

-- AlterEnum
ALTER TYPE "EtiquetteStatus" ADD VALUE 'NEUTRAL';

-- AlterTable
ALTER TABLE "Etiquette_per_experiences" ADD COLUMN     "status" "EtiquetteStatus" NOT NULL;

-- CreateTable
CREATE TABLE "Votes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "experience_id" INTEGER NOT NULL,
    "status" "VoteStatus" NOT NULL,

    CONSTRAINT "Votes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "Experiences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
