import { v1 } from "@googlemaps/places";
import { GoogleAuth } from "google-auth-library";
// import { loadConfig } from "tsconfig-paths";

// Format a string "places/:string/photos/:refImg" to get refImg
function formatPath(input: string) {
  const keyword = "photos/";
  const index = input.indexOf(keyword);
  if (index !== -1) {
    return input.substring(index + keyword.length);
  }
  return "";
}

const tokyoCenterLocation = {
  lat: 35.6764,
  lon: 139.65,
};

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

  async textSearch(textQuery: string, location?: any) {

    // Properties to query
    const fields = [
      "types",
      // lab
      "id",
      "displayName",
      "formattedAddress",
      "location",
      "googleMapsUri",
      "websiteUri",
      "photos",
    ];

    let formattedFields = fields.map((field) => "places." + field).join(",");
    console.log(formattedFields);

    const query = await this.placesClient.searchText(
      {
        textQuery,
        locationBias: {
          circle: {
            center: {
              latitude: tokyoCenterLocation.lat,
              longitude: tokyoCenterLocation.lon,
            },
            radius: 1000,
          },
        },
      },
      {
        otherArgs: {
          headers: {
            "X-Goog-FieldMask": formattedFields
          },
        },
      }
    );
    console.log(query[0].places?.length);
    return query[0].places;
  }

  async photoByPlace(ref: string): Promise<string | null> {
    const placeId = formatPath(ref);
    const localUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${placeId}&key=${this.apiKey}`;

    const res = await fetch(localUrl, {
      method: "GET",
    });

    if (!res.ok) {
      console.error("Error fetching the photo:", res.statusText);
      return null;
    }

    const bytes = await res.arrayBuffer();
    const base64 = arrayBufferToBase64(bytes);

    return base64;
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bufferNode = Buffer.from(buffer);
  return bufferNode.toString("base64");
}
