import GoogleClient from "@utils/googleClient";
import { Request, Response, Router } from "express";
import { PrismaClient, PlaceType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

enum StatusCode {
  BadBehavior = 400,
}

type SearchRequest = {
  textQuery?: string;
  loc?: {
    lat: number;
    lon: number;
  };
  category?: string;
};

const tokyoCenterLocation = {
  lat: 35.6764,
  lon: 139.65,
};

const testingRouter = Router();
const googleClient = new GoogleClient(process.env.GOOGLE_API_KEY);
const prisma = new PrismaClient();

// Helper function to valid enum
const PLACE_TYPES: {
  [index: string]: PlaceType;
} = {
  shrine: "SHRINE",
  restaurant: "RESTAURANT",
  onsen: "ONSEN",
};

// Helper function for validation
const validateSearchRequest = (textQuery?: string, category?: string) => {
  if (!textQuery || typeof textQuery !== "string") {
    return "textQuery must be provided and must be a string!";
  }
  if (textQuery.trim().length === 0) {
    return "textQuery cannot be empty!";
  }
  if (!category || !(category in PLACE_TYPES)) {
    return "category must be a category type!";
  }
  return null;
};

// Helper function to process places
const processPlace = async (place: any, category: PlaceType) => {
  const { id, displayName, location, formattedAddress, websiteUri } = place;

  if (!id) return null;

  const existingPlace = await prisma.places.findFirst({
    where: { google_place_id: id },
  });

  if (existingPlace) return existingPlace.id;

  // For onsen
  // "sauna" | "public_bath" | "spa" | "hotel" | "establishment";
  // For shrine
  // 'place_of_worship' | 'point_of_interest' | 'establishment' | "establishment"
  // For restaurant
  // "restaurant" | "food" | "bar" | "establishment" | "japanese_restaurant"

  if (
    !displayName?.text ||
    !formattedAddress ||
    !location?.latitude ||
    !location?.longitude
  ) {
    return null;
  }

  const newPlace = await prisma.places.create({
    data: {
      name: displayName.text,
      google_place_id: id,
      address: formattedAddress,
      latitude: new Decimal(location.latitude),
      longitude: new Decimal(location.longitude),
      place_type: category,
      website_uri: websiteUri || null,
      general_info: "",
    },
  });

  return newPlace.id;
};

//@ts-ignore
testingRouter.post("/search", async (req: Request, res: Response) => {
  try {
    const { textQuery, category }: SearchRequest = req.body;

    const validationError = validateSearchRequest(textQuery, category);
    if (validationError) {
      return res
        .status(StatusCode.BadBehavior)
        .send({ message: validationError });
    }

    const queryResults = await googleClient.textSearch(textQuery!);
    if (!queryResults || queryResults?.length === 0) {
      return res.status(404).send({
        message: queryResults
          ? "The search found nothing"
          : "Error while doing the search!",
        data: [],
      });
    }

    const refIds: number[] = [];
    for (const place of queryResults) {
      const refId = await processPlace(place, PLACE_TYPES[category!]); // Already valid

      if (refId) {
        refIds.push(refId);
        //
        const MAX_PHOTOS = 1;
        if (!place.photos) continue;
        for (let photo of place.photos.slice(0, MAX_PHOTOS)) {
          const base64_encoded = await googleClient.photoByPlace(photo.name!);

          if (!base64_encoded) continue;

          await prisma.images.create({
            data: {
              author_name: "",
              place_id: refId,
              file_data: base64_encoded,
            },
          });
        }
      }
    }

    const output = await prisma.places.findMany({
      where: { id: { in: refIds } },
    });

    res.send({ message: "Successfully response!", data: output });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ message: "An error occurred while processing your request." });
  }
});

export default testingRouter;