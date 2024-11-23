import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class GeneralModel {
  static async getInitialData(): Promise<Place | null> {
    const raw = await prisma.places.findMany({
      include: {
        etiquettes: {
          include: {
            etiquette: true,
          },
        },
        experiences: true,
        images: true,
      },
    });

    const parsedToPlaceModel: Place | null = null;

    return parsedToPlaceModel;
  }
}
