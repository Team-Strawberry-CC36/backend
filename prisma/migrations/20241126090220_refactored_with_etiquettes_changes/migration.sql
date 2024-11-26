/*
  Warnings:

  - You are about to drop the column `experience_type` on the `Experiences` table. All the data in the column will be lost.
  - You are about to drop the column `google_map_uri` on the `Places` table. All the data in the column will be lost.
  - You are about to drop the column `regular_opening_hours` on the `Places` table. All the data in the column will be lost.
  - You are about to drop the `Place_etiquette` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `place_type` to the `Etiquette` table without a default value. This is not possible if the table is not empty.
  - Made the column `google_place_id` on table `Places` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "EtiquetteStatus" AS ENUM ('ALLOWED', 'NOT_ALLOWED');

-- AlterTable
ALTER TABLE "Etiquette" ADD COLUMN     "place_type" "PlaceType" NOT NULL;

-- AlterTable
ALTER TABLE "Experiences" DROP COLUMN "experience_type",
ADD COLUMN     "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Places" DROP COLUMN "google_map_uri",
DROP COLUMN "regular_opening_hours",
ALTER COLUMN "place_type" DROP DEFAULT,
ALTER COLUMN "google_place_id" SET NOT NULL;

-- DropTable
DROP TABLE "Place_etiquette";

-- CreateTable
CREATE TABLE "Etiquettes_per_places" (
    "id" SERIAL NOT NULL,
    "place_id" INTEGER NOT NULL,
    "etiquette_id" INTEGER NOT NULL,
    "status" "EtiquetteStatus" NOT NULL,

    CONSTRAINT "Etiquettes_per_places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Etiquette_per_experiences" (
    "id" SERIAL NOT NULL,
    "experience_id" INTEGER NOT NULL,
    "etiquette_id" INTEGER NOT NULL,

    CONSTRAINT "Etiquette_per_experiences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Etiquettes_per_places" ADD CONSTRAINT "Etiquettes_per_places_etiquette_id_fkey" FOREIGN KEY ("etiquette_id") REFERENCES "Etiquette"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etiquettes_per_places" ADD CONSTRAINT "Etiquettes_per_places_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "Places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etiquette_per_experiences" ADD CONSTRAINT "Etiquette_per_experiences_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "Experiences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etiquette_per_experiences" ADD CONSTRAINT "Etiquette_per_experiences_etiquette_id_fkey" FOREIGN KEY ("etiquette_id") REFERENCES "Etiquette"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
