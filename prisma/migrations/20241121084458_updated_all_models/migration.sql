/*
  Warnings:

  - You are about to drop the column `user_id` on the `Places` table. All the data in the column will be lost.
  - You are about to alter the column `address` on the `Places` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `role` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Users` table. All the data in the column will be lost.
  - Added the required column `place_ruleId` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlaceType" AS ENUM ('SHRINE', 'RESTAURANT', 'ONSEN');

-- DropForeignKey
ALTER TABLE "Places" DROP CONSTRAINT "Places_user_id_fkey";

-- AlterTable
ALTER TABLE "Places" DROP COLUMN "user_id",
ADD COLUMN     "place_type" "PlaceType" NOT NULL DEFAULT 'ONSEN',
ADD COLUMN     "usersId" INTEGER,
ALTER COLUMN "address" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "role",
DROP COLUMN "updated_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "place_ruleId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Experiences" (
    "id" SERIAL NOT NULL,
    "place_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "experience" TEXT NOT NULL,
    "experience_type" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place_rule" (
    "id" SERIAL NOT NULL,
    "place_id" INTEGER NOT NULL,
    "etiquette" INTEGER NOT NULL,

    CONSTRAINT "Place_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Etiquette" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR NOT NULL,

    CONSTRAINT "Etiquette_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_place_ruleId_fkey" FOREIGN KEY ("place_ruleId") REFERENCES "Place_rule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiences" ADD CONSTRAINT "Experiences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Places" ADD CONSTRAINT "Places_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
