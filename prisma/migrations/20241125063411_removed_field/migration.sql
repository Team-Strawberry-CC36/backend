/*
  Warnings:

  - You are about to drop the column `experience_type` on the `Experiences` table. All the data in the column will be lost.
  - You are about to drop the column `google_map_uri` on the `Places` table. All the data in the column will be lost.
  - You are about to drop the column `regular_opening_hours` on the `Places` table. All the data in the column will be lost.
  - Made the column `google_place_id` on table `Places` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Experiences" DROP COLUMN "experience_type",
ADD COLUMN     "place_etiquette_id" INTEGER;

-- AlterTable
ALTER TABLE "Places" DROP COLUMN "google_map_uri",
DROP COLUMN "regular_opening_hours",
ALTER COLUMN "google_place_id" SET NOT NULL;
