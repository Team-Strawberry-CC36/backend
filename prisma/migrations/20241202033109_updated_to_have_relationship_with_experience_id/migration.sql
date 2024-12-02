/*
  Warnings:

  - Added the required column `experience_id` to the `Votes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Votes" ADD COLUMN     "experience_id" INTEGER NOT NULL;
