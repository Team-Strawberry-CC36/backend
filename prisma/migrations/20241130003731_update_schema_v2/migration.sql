/*
  Warnings:

  - You are about to drop the column `place_id` on the `Etiquette` table. All the data in the column will be lost.
  - You are about to alter the column `label` on the `Etiquette` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to drop the column `etiquette_id` on the `Etiquette_per_experiences` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Etiquette_per_experiences` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Places` table. All the data in the column will be lost.
  - You are about to drop the column `general_info` on the `Places` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Places` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Places` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Places` table. All the data in the column will be lost.
  - You are about to drop the column `website_uri` on the `Places` table. All the data in the column will be lost.
  - The primary key for the `Users_accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `experience_id` on the `Votes` table. All the data in the column will be lost.
  - You are about to drop the `Etiquettes_per_places` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Images` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `place_etiquette_id` to the `Etiquette_per_experiences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_etiquette_id` to the `Votes` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Votes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "HelpfullnessLevel" AS ENUM ('UP', 'DOWN');

-- DropForeignKey
ALTER TABLE "Etiquette_per_experiences" DROP CONSTRAINT "Etiquette_per_experiences_etiquette_id_fkey";

-- DropForeignKey
ALTER TABLE "Etiquettes_per_places" DROP CONSTRAINT "Etiquettes_per_places_etiquette_id_fkey";

-- DropForeignKey
ALTER TABLE "Etiquettes_per_places" DROP CONSTRAINT "Etiquettes_per_places_place_id_fkey";

-- DropForeignKey
ALTER TABLE "Experiences" DROP CONSTRAINT "Experiences_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_place_id_fkey";

-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "Votes_experience_id_fkey";

-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "Votes_user_id_fkey";

-- AlterTable
ALTER TABLE "Etiquette" DROP COLUMN "place_id",
ALTER COLUMN "label" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Etiquette_per_experiences" DROP COLUMN "etiquette_id",
DROP COLUMN "status",
ADD COLUMN     "place_etiquette_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Experiences" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Places" DROP COLUMN "address",
DROP COLUMN "general_info",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "name",
DROP COLUMN "website_uri";

-- AlterTable
ALTER TABLE "Users_accounts" DROP CONSTRAINT "Users_accounts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "Users_accounts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Users_accounts_id_seq";

-- AlterTable
ALTER TABLE "Votes" DROP COLUMN "experience_id",
ADD COLUMN     "place_etiquette_id" INTEGER NOT NULL,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "EtiquetteStatus" NOT NULL;

-- DropTable
DROP TABLE "Etiquettes_per_places";

-- DropTable
DROP TABLE "Images";

-- DropEnum
DROP TYPE "VoteStatus";

-- CreateTable
CREATE TABLE "Place_etiquettes" (
    "id" SERIAL NOT NULL,
    "place_id" INTEGER NOT NULL,
    "etiquette_id" INTEGER NOT NULL,
    "status" "EtiquetteStatus" NOT NULL,

    CONSTRAINT "Place_etiquettes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Helpfullness" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "experience_id" INTEGER NOT NULL,
    "status" "HelpfullnessLevel" NOT NULL,

    CONSTRAINT "Helpfullness_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Experiences" ADD CONSTRAINT "Experiences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place_etiquettes" ADD CONSTRAINT "Place_etiquettes_etiquette_id_fkey" FOREIGN KEY ("etiquette_id") REFERENCES "Etiquette"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place_etiquettes" ADD CONSTRAINT "Place_etiquettes_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "Places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Helpfullness" ADD CONSTRAINT "Helpfullness_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Helpfullness" ADD CONSTRAINT "Helpfullness_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "Experiences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_place_etiquette_id_fkey" FOREIGN KEY ("place_etiquette_id") REFERENCES "Place_etiquettes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etiquette_per_experiences" ADD CONSTRAINT "Etiquette_per_experiences_place_etiquette_id_fkey" FOREIGN KEY ("place_etiquette_id") REFERENCES "Place_etiquettes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
