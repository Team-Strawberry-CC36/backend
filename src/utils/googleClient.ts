import { v1 } from "@googlemaps/places";
import { google } from "@googlemaps/places/build/protos/protos";
import { GoogleAuth } from "google-auth-library";
import { IPlaceType } from "src/interfaces/frontend/Place";

// ALIAS
type GooglePlace = google.maps.places.v1.IPlace;

export default class GoogleClient {
  private apiKey!: string;
  // Google places Library for making requests!!
  private placesClient!: v1.PlacesClient;

  constructor(apiKey: string | undefined) {
    // Validation in the constructor.
    if (typeof apiKey !== "string") {
      throw new Error("Google Api key must be a value");
    }
    this.apiKey = apiKey;

    // Create the client by using auth!;
    this.placesClient = new v1.PlacesClient({
      authClient: new GoogleAuth().fromAPIKey(this.apiKey),
    });
  }

  /**
   * Method who returns the places id with
   * @param textQuery text search value
   * @param location bias if provied
   * @returns array of object with id and location
   */
  async textSearch(
    textQuery: string,
    category: string,
    location?: any
  ): Promise<GooglePlace[]> {
    const FIELD = "places.id,places.location,places.types";

    try {
      const query = (
        await this.placesClient.searchText(
          {
            textQuery,
            locationRestriction: {
              rectangle: {
                low: {
                  latitude: 31.357402,
                  longitude: 128.894464,
                },
                high: {
                  latitude: 45.861283,
                  longitude: 146.861331,
                },
              },
            },
          },
          {
            otherArgs: {
              headers: {
                "X-Goog-FieldMask": FIELD,
              },
            },
          }
        )
      )[0].places;

      let placeTypesRestricted: { [index: string]: Array<string> } = {
        restaurant: ["restaurant"],
        shrine: ["place_of_worship"],
        onsen: ["japanese_bath", "span", "public_bath"],
      };

      if (!query) return [];

      if (!placeTypesRestricted[category]) {
        throw new Error(`Invalid category: ${category}`);
      }

      const filteredQuery = query.filter((place) => {
        // We only care about the ones with types
        if (!place.types) return false;

        // We check if at least one restriction fullfilles
        return placeTypesRestricted[category].some((value) =>
          place.types!.includes(value)
        );
      });

      console.log(filteredQuery);

      return filteredQuery;
    } catch (e) {
      console.log("Error trying to perform google search.");
      return [];
    }
  }

  async searchPlaceDetails(placeId: string): Promise<GooglePlace> {
    const FIELD = "*";

    try {
      return (
        await this.placesClient.getPlace(
          {
            name: `places/${placeId}`,
          },
          {
            otherArgs: {
              headers: {
                "X-Goog-FieldMask": FIELD,
              },
            },
          }
        )
      )[0];
    } catch (e) {
      console.log(e);
      throw "Error inside searchPlaceDetails.";
    }
  }

  async photoByPlace(placeId: string): Promise<string | null> {
    const localUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${placeId}&key=${this.apiKey}`;

    const res = await fetch(localUrl, {
      method: "GET",
    });

    if (!res.ok) {
      console.error("Error fetching the photo:", res.statusText);
      return null;
    }

    const bytes = await res.arrayBuffer();
    const bufferNode = Buffer.from(bytes);
    const base64 = bufferNode.toString("base64");

    return base64;
  }
}
