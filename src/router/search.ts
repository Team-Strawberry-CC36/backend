import GoogleClient from "@utils/googleClient";
import { query, Request, Response, Router } from "express";
import { Places, PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

type SearchRequest = {
  textQuery?: string;
  loc?: {
    lat: number;
    lon: number;
  };
};

const tokyoCenterLocation = {
  lat: 35.6764,
  lon: 139.65,
};

const router = Router();

const googleClient = new GoogleClient(process.env.GOOGLE_API_KEY);
const prisma = new PrismaClient();

router.post("/search", async (req: Request, res: Response): Promise<any> => {
  const { textQuery, loc }: SearchRequest = req.body;

  // Validation
  // If we don't have textQuery, and its not an string, we send an error.
  if (!textQuery && typeof textQuery != "string") {
    return res.status(404).send({
      message: "Search text must be provided, and must be and string!",
    });
  }

  // We seet Tokyo Coordinates as default is nothing provide it.
  if (!loc) {
    //
  }

  const query = await googleClient.textSearch(textQuery);

  // 2. Parse data
  if (!query || query.length === 0) {
    return res.status(404).send({
      message: "Error while doing the search!",
    });
  }

  let parsed: Places[] = [];
  let refIds = [];
  for (let place of query) {
    const { id } = place;

    // If there is no id, we continue to the next.
    if (!id) {
      continue;
    }

    const exists = await prisma.places.findFirst({
      where: {
        google_place_id: id,
      },
    });

    // If exists, we push it as a reference
    if (exists) {
      refIds.push(exists.id);
      continue;
    }

    // If don't we continue by inserting to the DB
    // We grab the imporant fields.
    const { displayName, location, formattedAddress } = place;

    if (
      !displayName?.text ||
      !formattedAddress ||
      !location?.latitude ||
      !location.longitude
    ) {
      continue;
    }

    //

    const newPlace: Places = {
      name: displayName.text,
      google_place_id: id,

      address: formattedAddress,
      latitude: new Decimal(location.latitude),
      longitude: new Decimal(location.longitude),
      // place_type: "ONSEN",
      website_uri: place.websiteUri ? place.websiteUri : null,
      // place_type: "SHRINE",
      formatted_address: null,
      general_info: "",
      created_at: undefined,
      edited_at: undefined,
    };
  }
});
