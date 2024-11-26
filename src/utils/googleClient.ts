import { v1 } from "@googlemaps/places";
import { GoogleAuth } from "google-auth-library";
import { loadConfig } from "tsconfig-paths";

// Format a string "places/:string/photos/:refImg" to get refImg
function formatPath(input: string) {
  const keyword = "photos/";
  const index = input.indexOf(keyword);
  if (index !== -1) {
    return input.substring(index + keyword.length);
  }
  return "";
}

export default class GoogleClient {
  private apiKey!: string;
  // Google places Library for making requests!!
  private placesClient!: v1.PlacesClient;

  constructor(apiKey: string | undefined) {
    // Validation in the constructor.
    if (typeof apiKey !== "string") {
      throw new Error("Google Api kwey must be a value");
    }
    this.apiKey = apiKey;

    // Create the client by using auth!;
    this.placesClient = new v1.PlacesClient({
      authClient: new GoogleAuth().fromAPIKey(this.apiKey),
    });
  }

  async textSearch(textQuery: string, location?: any) {
    // Properties to query
    const fields = [
      "id",
      "formattedAddress",
      "location",
      "googleMapsUri",
      "websiteUri",
      "regularOpeningHours",
      "photos",
    ];

    let formattedFields = fields.map((field) => "places." + field).join(",");

    const query = await this.placesClient.searchText(
      {
        textQuery,
        locationBias: {
          circle: {
            center: {
              latitude: 37,
              longitude: 37,
            },
            radius: 500,
          },
        },
      },
      {
        otherArgs: {
          headers: {
            "X-Goog-FieldMask": formattedFields,
          },
        },
      }
    );

    return query[0].places;
  }

  async photoByPlace(ref: string): Promise<string> {
    const placeId = formatPath(ref);
    const localUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${placeId}&key=${this.apiKey}`;
    const res = await fetch(localUrl, {
      method: "GET",
    });

    const bytes = await res.arrayBuffer();

    // [ ] Convert to base64 and return it

    return null;
  }
}
