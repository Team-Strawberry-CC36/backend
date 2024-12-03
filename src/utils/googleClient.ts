import { v1 } from "@googlemaps/places";
import { google } from "@googlemaps/places/build/protos/protos";
import { GoogleAuth } from "google-auth-library";

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
    type?: string, // For category filtering
    location?: { lat: number; lon: number }
  ): Promise<GooglePlace[]> {
    const FIELD = "places.id,places.location,places.types";
    const defaultLocation = { lat: 35.6764, lon: 139.65 }; // Tokyo center
    const centerLocation = location || defaultLocation;

    try {
      const query = (
        await this.placesClient.searchText(
          {
            textQuery,
            locationBias: {
              circle: {
                center: {
                  latitude: centerLocation.lat,
                  longitude: centerLocation.lon,
                },
                radius: 1000,
              },
            },
            includedType: type,
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
      return query || [];
    } catch (error) {
      console.error(error);
      throw new Error("Failed text search");
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
