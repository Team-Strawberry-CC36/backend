import {Prisma, PrismaClient} from "@prisma/client";
import GoogleClient from "../utils/googleClient";

const apiKey = process.env.GOOGLE_API_KEY;
const googleApi = new GoogleClient(apiKey);
const prisma = new PrismaClient();

async function main() {
  const query = "tokyo onsen";

  const result = await googleApi.textSearch(query);

  if (!result) {
    return null
  }

  for (let place of result) {
    // Validation per place
    const existingPlace = await prisma.places.findUnique({
      where: { google_place_id: place.id },
    });

    // If this element exist, continue in the next iteration
    if (existingPlace) {
      continue;
    }

    // [ ] We need validation!! we don't want data that is not complete in the most important fields.

    // Insert the existing place
    const newPlace = await prisma.places.create({
      data: {
        google_place_id: place.id,
        formatted_address: place.formattedAddress,
        address: place.formattedAddress || "null", // Its the same?
        // Add validation to fields, we don't want this.
        latitude: new Prisma.Decimal(place.location?.latitude),
        longitude: new Prisma.Decimal(place.location?.longitude),
        google_map_uri: place.googleMapsUri,
        website_uri: place.websiteUri,
        name: place.displayName  || "null",
        general_info: "General info not provided", // Google maps provide general info?
      },
    });

    // Who we know if this was created sucesfully?
    // [ ] Add a console log to see how many records with save.

    // 2nd Part. Working with photos
    let photos = place.photos;
    const MAX_PHOTOS = 1;
    if (photos && Array.isArray(photos)) {
      for (const photo of photos.slice(0, MAX_PHOTOS)) {
        const base64_encoded = await googleApi.photoByPlace(photo.name);
        // [ ] Insert the base64 result in their corresponding table.
      }
    }
  }
}

main();
