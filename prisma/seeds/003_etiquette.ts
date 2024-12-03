import { Etiquette, PrismaClient, PlaceType } from "@prisma/client";

const prisma = new PrismaClient();

async function etiquettes() {
  await prisma.etiquette.deleteMany();
  await prisma.etiquette.createMany({
    data: [
      { place_type: "ONSEN", label: "tattoos" },
      { place_type: "ONSEN", label: "Reservation" },
      { place_type: "ONSEN", label: "Book time slot" },
      { place_type: "ONSEN", label: "Provided towel" },
      { place_type: "ONSEN", label: "Swimwear and swim hat" },
      { place_type: "ONSEN", label: "Tie up long hair" },
      { place_type: "ONSEN", label: "Bring children into the bath" },

      { place_type: "SHRINE", label: "Take photos everywhere" },
      { place_type: "SHRINE", label: "Throw coins into the offering box" },
      { place_type: "SHRINE", label: "Clap your hands during prayer" },
      {
        place_type: "SHRINE",
        label: "Touch sacred objects or ropes (shimenawa)",
      },
      { place_type: "SHRINE", label: "Eating and drinking" },

      { place_type: "RESTAURANT", label: "Reservation" },
      { place_type: "RESTAURANT", label: "Take off the shoes" },
      { place_type: "RESTAURANT", label: "smokings" },
      { place_type: "RESTAURANT", label: "Bringing children" },
      { place_type: "RESTAURANT", label: "Bringing pets" },
    ],
  });

  console.log("Seeding completed!");
}

export default etiquettes;
