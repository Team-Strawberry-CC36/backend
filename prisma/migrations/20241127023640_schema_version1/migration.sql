-- CreateEnum
CREATE TYPE "PlaceType" AS ENUM ('SHRINE', 'ONSEN', 'RESTAURANT');

-- CreateEnum
CREATE TYPE "EtiquetteStatus" AS ENUM ('ALLOWED', 'NOT_ALLOWED');

-- CreateTable
CREATE TABLE "Users_accounts" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiences" (
    "id" SERIAL NOT NULL,
    "place_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "experience" TEXT NOT NULL,
    "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Places" (
    "id" SERIAL NOT NULL,
    "place_type" "PlaceType" NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "google_place_id" VARCHAR(255) NOT NULL,
    "website_uri" TEXT,
    "general_info" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Places_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "Etiquette" (
    "id" SERIAL NOT NULL,
    "place_id" INTEGER NOT NULL,
    "label" VARCHAR NOT NULL,
    "place_type" "PlaceType" NOT NULL,

    CONSTRAINT "Etiquette_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Places_google_place_id_key" ON "Places"("google_place_id");

-- AddForeignKey
ALTER TABLE "Experiences" ADD CONSTRAINT "Experiences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiences" ADD CONSTRAINT "Experiences_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "Places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "Places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etiquettes_per_places" ADD CONSTRAINT "Etiquettes_per_places_etiquette_id_fkey" FOREIGN KEY ("etiquette_id") REFERENCES "Etiquette"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etiquettes_per_places" ADD CONSTRAINT "Etiquettes_per_places_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "Places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etiquette_per_experiences" ADD CONSTRAINT "Etiquette_per_experiences_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "Experiences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etiquette_per_experiences" ADD CONSTRAINT "Etiquette_per_experiences_etiquette_id_fkey" FOREIGN KEY ("etiquette_id") REFERENCES "Etiquette"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
