import { Etiquette, PrismaClient, PlaceType } from "@prisma/client";

const prisma = new PrismaClient();

async function etiquettes() {
  await prisma.etiquette.createMany({
    data: [
      { place_type: "ONSEN", label: "tattoos" },
      { place_type: "ONSEN", label: "swimming" },

      { place_type: "SHRINE", label: "pray" },
      { place_type: "SHRINE", label: "photos" },

      { place_type: "RESTAURANT", label: "tip" },
      { place_type: "RESTAURANT", label: "phone" },
      { place_type: "RESTAURANT", label: "smokings" },
    ],
  });

  console.log("Seeding completed!");
}

export default etiquettes;
