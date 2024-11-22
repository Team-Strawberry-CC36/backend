/*
  Warnings:

  - You are about to drop the column `usersId` on the `Places` table. All the data in the column will be lost.
  - You are about to drop the `Place_rule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `latitude` to the `Places` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Places` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Experiences" DROP CONSTRAINT "Experiences_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Places" DROP CONSTRAINT "Places_usersId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_place_ruleId_fkey";

-- AlterTable
ALTER TABLE "Places" DROP COLUMN "usersId",
ADD COLUMN     "latitude" DECIMAL(9,6) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(9,6) NOT NULL;

-- DropTable
DROP TABLE "Place_rule";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "users_accounts" (
    "id" SERIAL NOT NULL,
    "user_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Images" (
    "id" SERIAL NOT NULL,
    "place_id" INTEGER NOT NULL,
    "author_name" VARCHAR NOT NULL,
    "file_data" TEXT NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place_etiquette" (
    "id" SERIAL NOT NULL,
    "place_id" INTEGER NOT NULL,
    "etiquette_id" INTEGER NOT NULL,

    CONSTRAINT "Place_etiquette_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Experiences" ADD CONSTRAINT "Experiences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiences" ADD CONSTRAINT "Experiences_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "Places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "Places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
