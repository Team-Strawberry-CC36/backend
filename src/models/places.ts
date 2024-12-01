import { PlaceType, PrismaClient } from "@prisma/client";
import { googleClient, prisma } from "./../utils/index";
import { IPlace } from "src/interfaces/places";

class PlaceModel {
  static async getMarkers(textQuery: string, category: string): Promise<any[]> {
    const query = await googleClient.textSearch(textQuery, category);

    // [ ] Transform query into the markers response. Example.
    const markers = query.map((place: any) => ({
      location: {
        lat: place.lat,
        lon: place.lon,
      },
    }));

    return markers;
  }

  static async getPlaceById(placeId: string, category: PlaceType) {
    try {
      const query = await googleClient.searchPlaceDetails(placeId);

      if (!query || typeof query.id !== "string") {
        throw "Error! Search not found!";
      }

      let temp;

      const existingPlace = await prisma.places.findFirst({
        where: { google_place_id: query.id },
      });

      if (!existingPlace) {
        const placeCreated = await prisma.places.createManyAndReturn({
          data: {
            google_place_id: query.id,
            place_type: category,
          },
        });

        if (!placeCreated) {
          throw new Error("Place created failed.");
        } else {
          temp = placeCreated;
        }
      } else {
        temp = existingPlace;
      }

      return this.parseToIPlace(temp);
    } catch (error) {
      console.error("Oops! Something happend in placeModel.processPlace");
    }
  }

  static parseToIPlace(obj: any): IPlace {
    return 1 as never;
  }
}

export default PlaceModel;
