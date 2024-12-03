import { Etiquette, PrismaClient, PlaceType } from "@prisma/client";

const prisma = new PrismaClient();

async function etiquettes() {
  await prisma.etiquette.deleteMany();
  await prisma.etiquette.createMany({
    data: [
      { place_type: "ONSEN", label: "Tattoos" },
      { place_type: "ONSEN", label: "Reservations" },
      { place_type: "ONSEN", label: "Time slot booking" },
      { place_type: "ONSEN", label: "Towels provided" },
      { place_type: "ONSEN", label: "Swimwear" },
      { place_type: "ONSEN", label: "Tie up long hair" },
      { place_type: "ONSEN", label: "Children" },

      { place_type: "SHRINE", label: "Taking photos" },
      { place_type: "SHRINE", label: "Coin offerings" },
      { place_type: "SHRINE", label: "Clap your hands during prayer" },
      {
        place_type: "SHRINE",
        label: "Touching sacred objects or ropes (shimenawa)",
      },
      { place_type: "SHRINE", label: "Food and drinks" },

      { place_type: "RESTAURANT", label: "Reservation" },
      { place_type: "RESTAURANT", label: "Shoes" },
      { place_type: "RESTAURANT", label: "Smoking" },
      { place_type: "RESTAURANT", label: "Children" },
      { place_type: "RESTAURANT", label: "Pets" },
    ],
  });

  console.log("Seeding completed!");
}

export default etiquettes;
