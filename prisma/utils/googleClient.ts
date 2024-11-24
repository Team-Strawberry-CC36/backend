import { PlacesClient } from "@googlemaps/places";
import { GoogleAuth } from "google-auth-library";
import {loadConfig} from "tsconfig-paths";

// Format a string "places/:string/photos/:refImg" to get refImg
function formatPath(input: string) {
  const keyword = "photos/";
  const index = input.indexOf(keyword);
  if (index !== -1) {
    return input.substring(index + keyword.length);
  }
  return "";
}

export default class GoogleApi {
  private apiKey!: string;
  // Google places Library for making requests!!
  private placesClient!: PlacesClient;

  constructor(apiKey: string | undefined) {
    // Validation in the constructor.
    if (typeof apiKey !== "string") {
      throw new Error("Google Api kwey must be a value");
    }
    this.apiKey = apiKey;

    // Create the client by using auth!;
    this.placesClient = new PlacesClient({
      authClient: new GoogleAuth().fromAPIKey(this.apiKey)
    });
  }

  async textSearch(textQuery: string) {
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

    const formattedFields = fields.map((field) => "places." + field).join(",");

    // Validate textQuery typo
    const searchContent: {
      textQuery: string;
    } = {
      textQuery,
    };

    const query = await this.placesClient.searchText(searchContent, {
      otherArgs: {
        headers: {
          "X-Goog-FieldMask": formattedFields
        }
      }
    });

    return query[0].places;
  }


  // Not implemented
  async photoByPlace(ref: string): Promise<string> {
    const placeId = formatPath(ref);
    const localUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${placeId}&key=${this.apiKey}`
    const res = await fetch(localUrl, {
      method: "GET"
    })

    const bytes = await res.arrayBuffer();

    // [ ] Convert to base64 and return it

    return null;
  }
}
