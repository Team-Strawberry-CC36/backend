/*
  Warnings:

  - A unique constraint covering the columns `[google_place_id]` on the table `Places` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Places" ADD COLUMN     "formatted_address" VARCHAR(255),
ADD COLUMN     "google_map_uri" TEXT,
ADD COLUMN     "photos" TEXT,
ADD COLUMN     "regular_opening_hours" TEXT,
ADD COLUMN     "website_uri" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Places_google_place_id_key" ON "Places"("google_place_id");
