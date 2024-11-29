import { PrismaClient, PlaceType, EtiquetteStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Places
  const place = await prisma.places.create({
    data: {
      place_type: PlaceType.ONSEN,
      name: "CC Onsen",
      address: "3-1-35 B2F, Motoazabu,Minato City, Tokyo,",
      latitude: 35.6895,
      longitude: 139.6917,
      google_place_id: "shrine123",
      website_uri: "https://cconsen.com",
      general_info: "Traditional Japanese Onsen.",
    },
  });

  // Seed Etiquette
  const etiquette = await prisma.etiquette.create({
    data: {
      place_id: 1,
      label: "No Tatoo",
      place_type: PlaceType.ONSEN,
    },
  });

  // Seed Users
  // const user = await prisma.users_accounts.create({
  //   data: {
  //     username: "Test",
  //   },
  // });

  // Seed Experiences
  const experience = await prisma.experiences.create({
    data: {
      place_id: 1,
      user_id: 1,
      experience: "A calming and beautiful place to visit.",
    },
  });

  // Seed Etiquette_per_experiences
  const etiquettePerExperience = await prisma.etiquette_per_experiences.create({
    data: {
      experience_id: 1,
      etiquette_id: 1,
      status: EtiquetteStatus.ALLOWED,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
