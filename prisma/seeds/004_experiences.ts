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

  console.log(place);

  // Seed Etiquette
  const etiquette = await prisma.etiquette.create({
    data: {
      place_id: place.id,
      label: "No Tatoo",
      place_type: PlaceType.ONSEN,
    },
  });

  console.log(etiquette);

  // Seed Users
  // const user = await prisma.users_accounts.create({
  //   data: {
  //     username: 'Ai',
  //   },
  // });

  // console.log('User created:', user);

  // Seed Experiences
  const experience = await prisma.experiences.create({
    data: {
      place_id: place.id,
      user_id: id,
      experience: "A calming and beautiful place to visit.",
    },
  });

  console.log(experience);

  // Seed Etiquette_per_experiences
  const etiquettePerExperience = await prisma.etiquette_per_experiences.create({
    data: {
      experience_id: experience.id,
      etiquette_id: etiquette.id,
      status: EtiquetteStatus.ALLOWED,
    },
  });

  console.log(etiquettePerExperience);
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
