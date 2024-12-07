import {
  PlaceType,
  PrismaClient,
  Places,
  HelpfullnessLevel,
  EtiquetteStatus,
} from "@prisma/client";
import { googleClient, prisma } from "../../utils/index";
import { IPlace, IPlaceType } from "src/interfaces/frontend/Place";
import {
  IEtiquettePerPlace,
  IEtiquetteStatus,
} from "src/interfaces/frontend/Etiquette";
import IExperience from "src/interfaces/frontend/Experience";
import {
  IEtiquetteUsersVote,
  IEtiquetteVotes,
  VotesPerPlace,
} from "src/interfaces/frontend/Vote";
import firebaseAdmin from "@utils/firebase";

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

    const query = await googleClient.textSearch(textQuery, category);

    query.forEach((place) => {
      // Don't do anything
      if (!place.id || !place.location?.latitude || !place.location.longitude) {
        return;
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
    category: PlaceType
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
      const existingPlace = await prisma.places.findFirst({
        where: { google_place_id: query.id },
      });

      if (!existingPlace) {
        // 1. Get default etiquette per places
        const etiquettesPerPlace = await prisma.etiquette.findMany({
          where: {
            place_type: category,
          },
        });

        const placeCreated = await prisma.places.create({
          data: {
            google_place_id: query.id,
            place_type: category,
          },
        });

        // Create relationship between a place and a rule
        const place_etiquette_query = await prisma.place_etiquettes.createMany({
          data: etiquettesPerPlace.map((etiquette) => {
            return {
              place_id: placeCreated.id,
              etiquette_id: etiquette.id,
              status: "ALLOWED",
            };
          }),
        });

        if (!placeCreated) {
          throw "Place created failed.";
        } else {
          temp = placeCreated;
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

        const username = await firebaseAdmin.auth().getUser(item.user_id);

        experiences.push({
          id: item.id,
          username: username.displayName || username.email || "Anonymous User",
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

      const saveLifes = (category: PlaceType): IPlaceType => {
        switch (category) {
          case "ONSEN":
            return "onsen";
          case "RESTAURANT":
            return "restaurant";
          case "SHRINE":
            return "shrine";
        }
      };

      // Parse to Iplace
      const placeFormatted: IPlace = {
        id: temp.id,
        name: query.displayName.text,
        address: query.formattedAddress,
        placeType: saveLifes(category),
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
      console.error(
        "Oops! Something happend in placeModel.processPlace",
        error
      );
    }
  }

  static async getVotesPerPlace(placeId: number, userId: string) {
    // 2. Get etiquettes per place
    const etiquettesPerPlace = await prisma.place_etiquettes.findMany({
      where: {
        place_id: placeId,
      },
      include: {
        etiquette: true,
        votes: {
          include: {
            users_accounts: true,
          },
        },
      },
    });

    // 2.1 construct etiquetteVotes
    let etiquetteVotes: IEtiquetteVotes[] = etiquettesPerPlace.map((item) => {
      let allowed = 0;
      let notAllowed = 0;

      for (let vote of item.votes) {
        if (vote.status === "ALLOWED") {
          allowed++;
        } else if (vote.status === "NOT_ALLOWED") {
          notAllowed++;
        }
      }

      return {
        etiquetteId: item.etiquette_id,
        etiquetteType: item.etiquette.place_type,
        numberOfVotesForAllowed: allowed,
        numberOfVotesForNotAllowed: notAllowed,
      };
    });

    // 3.0 construct usersVote
    const validVoteStatus = (status: string): IEtiquetteStatus => {
      switch (status) {
        case "ALLOWED":
          return "allowed";
        case "NOT-ALLOWED":
          return "not-allowed";
        case "NEUTRAL":
          return undefined;
      }
    };

    let usersVote: IEtiquetteUsersVote[] = etiquettesPerPlace.map((item) => ({
      etiquetteId: item.etiquette_id,
      etiquetteType: item.etiquette.place_type,
      vote: validVoteStatus(item.status),
    }));

    // 3.Construct object
    let finalResult: VotesPerPlace = {
      placeId: placeId,
      userId: userId,
      userHasVoted: false, // bad
      // remaining
      etiquetteVotes: etiquetteVotes,
      usersVote: usersVote,
    };

    return finalResult;
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
