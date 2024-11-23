/*
  Warnings:

  - You are about to drop the `users_accounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Experiences" DROP CONSTRAINT "Experiences_user_id_fkey";

-- AlterTable
ALTER TABLE "Places" ADD COLUMN     "google_place_id" VARCHAR(255);

-- DropTable
DROP TABLE "users_accounts";

-- CreateTable
CREATE TABLE "Users_accounts" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_accounts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Experiences" ADD CONSTRAINT "Experiences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
