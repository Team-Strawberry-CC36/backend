import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class GeneralModel {
  static async getInitialData(): Promise<Place | null> {
    return null;
  }

  /**
   * Check if a place is stored in our DB
   * @param id Google
   */
  static async isPlacedStored(googlePlaceId: string): Promise<Boolean> {
    const place = await prisma.places.findFirst({
      where: {
        google_place_id: googlePlaceId,
      },
    });

    if (place) {
      return true;
    } else {
      return false;
    }
  }
}
