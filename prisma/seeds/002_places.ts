import { PrismaClient } from "@prisma/client";
import GoogleApi from "prisma/utils/googleApi";

const apiKey = process.env.GOOGLE_API_KEY;
const googleApi = new GoogleApi(apiKey);
const prisma = new PrismaClient();

async function main() {
  const query = "tokyo onsen";

  const result = await googleApi.textSearch(query);

  for (let place in result.places) {
    // Validation per place
    const existingPlace = await prisma.places.findUnique({
      where: { google_place_id: place.googlePlaceId },
    });

    // If this element exist, continue in the next iteration
    if (existingPlace) {
      continue;
    }

    // Insert the existing place
    const newPlace = await prisma.places.create({
      data: {
        google_place_id: place.googlePlaceId,
        formatted_address: place.formattedAddress,
        address: result.address,
        latitude: new Prisma.Decimal(place.location.lat),
        longitude: new Prisma.Decimal(place.locatin.log),
        google_map_uri: place.googleMapsUri,
        website_uri: place.websiteUri,
        name: place.name,
        general_info: result.generalInfo || "General info not provided",
      },
    });
  }

  // 2nd Part. Working with photos
  const photos = result.place.photos;
  const MAX_PHOTOS = 5;
  if (photos && Array.isArray(photos)) {
    for (const photo of photos.slice(0, MAX_PHOTOS)) {
      // We don't know how the response looks like yet.
      const image = await googleApi.photoByPlace(photo);
    }
  }
}

main();
