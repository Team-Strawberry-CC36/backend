/*
  Warnings:

  - You are about to drop the column `photos` on the `Places` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_place_id_fkey";

-- AlterTable
ALTER TABLE "Places" DROP COLUMN "photos";

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "Places"("id") ON DELETE CASCADE ON UPDATE CASCADE;
