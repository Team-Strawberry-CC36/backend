import { PrismaClient } from "@prisma/client";
import etiquettes from "./003_etiquette";

async function main() {
  await etiquettes();
  console.log("Seeding apply");
}

main();
