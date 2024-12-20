import {
  PlaceType,
  PrismaClient,
  Places,
  HelpfullnessLevel,
  EtiquetteStatus,
} from "@prisma/client";
import { googleClient, prisma } from "../../utils/index";
import IPlace from "src/interfaces/frontend/Place";
import {
  IEtiquettePerPlace,
  IEtiquetteStatus,
} from "src/interfaces/frontend/Etiquette";
import IExperience from "src/interfaces/frontend/Experience";
import { IEtiquetteVotes, VotesPerPlace } from "src/interfaces/frontend/Vote";

// TEMPORAL Marker
// Interface who represents a Place for the frontend in their minimal state.
interface Marker {
  id: string;
  location: {
    lat: number;
    lon: number;
  };
}

class PlaceModel {
  /**
   * Method who performs the google Text Search and returns
   * an array of markers.
   * @param textQuery
   * @param category
   * @returns
   */
  static async getMarkers(
    textQuery: string,
    category: string
  ): Promise<Marker[]> {
    const markers: Marker[] = [];

    const categoryMap: { [key in PlaceType]: string } = {
      SHRINE: "shrine",
      RESTAURANT: "restaurant",
      ONSEN: "spa",
    };

    const mappedCategory = categoryMap[category as PlaceType];

    // Call GoogleClient.textSearch with the category as type
    const queryResults = await googleClient.textSearch(
      textQuery,
      mappedCategory
    );

    queryResults.forEach((place) => {
      if (
        !place.id ||
        !place.location?.latitude ||
        !place.location?.longitude
      ) {
        return markers;
      }

      // Insert into markers response!
      markers.push({
        id: place.id,
        location: {
          lat: place.location.latitude,
          lon: place.location.longitude,
        },
      });
    });

    return markers;
  }

  /**
   * Method who receives a placeId and returns a IPlace object to the client.
   * @param placeId
   * @returns
   */
  static async getIPlaceById(
    placeId: string,
    category: "ONSEN"
  ): Promise<IPlace | null | undefined> {
    try {
      const query = await googleClient.searchPlaceDetails(placeId);

      if (!query) {
        throw "Error! Query with not results";
      }

      if (
        !query.id ||
        !query.displayName?.text ||
        !query.formattedAddress ||
        !query.location?.latitude ||
        !query.location?.longitude
      ) {
        // This don't work!
        return null;
      }

      let temp: Places;

      // Section who check if the place is already in our DB, or we need to create it
      const existingPlace = await prisma.places.findUnique({
        where: { google_place_id: query.id },
      });

      if (!existingPlace) {
        const placeCreated = await prisma.places.createManyAndReturn({
          data: {
            google_place_id: query.id,
            // NOTE [] This is default it
            place_type: category,
          },
        });

        if (placeCreated.length === 0) {
          throw "Place created failed.";
        } else {
          temp = placeCreated[0];
        }
      } else {
        temp = existingPlace;
      }

      let rawEtiquettes = await prisma.place_etiquettes.findMany({
        where: {
          place_id: temp.id,
        },
        include: {
          etiquette: true,
        },
      });

      let rawExperiences = await prisma.experiences.findMany({
        where: {
          place_id: temp.id,
        },
        include: {
          etiquettes: {
            include: {
              Place_etiquettes: {
                include: {
                  etiquette: true,
                },
              },
            },
          },
        },
      });

      //
      const etiquettes: IEtiquettePerPlace[] = rawEtiquettes.map((item) => {
        return {
          id: item.id,
          status: formatEtiquetteStatus(item.status),
          label: item.etiquette.label,
        };
      });

      let experiences: IExperience[] = [];
      for (let item of rawExperiences) {
        const helpfullnessPerExperience = await prisma.helpfullness.findMany({
          where: {
            experience_id: item.id,
          },
        });

        const helfullness = helpfullnessPerExperience.reduce((acc, current) => {
          return acc + (current.status === "UP" ? 1 : -1);
        }, 0);

        experiences.push({
          id: item.id,
          username: item.user_id,
          experience: item.experience,
          dateVisited: item.visited_at,
          helpfulness: helfullness,
          etiquettes: item.etiquettes.map((e) => {
            return {
              id: e.Place_etiquettes.id,
              status: e.Place_etiquettes.status,
              label: e.Place_etiquettes.etiquette.label,
            };
          }),
          metadata: {
            createdAt: item.created_at,
            updatedAt: item.edited_at,
          },
        });
      }

      // Parse to Iplace
      const placeFormatted: IPlace = {
        id: temp.id,
        name: query.displayName.text,
        address: query.formattedAddress,
        // NOTe  [ ] placeType needs to be dynamic
        placeType: "onsen",
        location: {
          latitude: query.location.latitude,
          longitude: query.location.longitude,
        },
        etiquettes: etiquettes,
        experiences: experiences,
        metadata: {
          createdAt: temp.created_at,
          updatedAt: temp.edited_at,
        },
      };

      return placeFormatted;
    } catch (error) {
      console.error("Oops! Something happend in placeModel.processPlace");
    }
  }
}

function formatEtiquetteStatus(prop: string): IEtiquetteStatus {
  let obj: any = {
    ALLOWED: "allowed",
    "NOT-ALLOWED": "not-allowed",
    NEUTRAL: undefined,
  };

  if (obj[prop] != "allowed" && obj[prop] != "not-allowed") {
    return undefined;
  } else {
    obj[prop];
  }
}

export default PlaceModel;
