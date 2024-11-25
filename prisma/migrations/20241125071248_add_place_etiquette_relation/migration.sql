/*
  Warnings:

  - Added the required column `place_id` to the `Etiquette` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Etiquette" ADD COLUMN     "place_id" INTEGER NOT NULL;
