import express, { Request, Response, Router } from "express";
import getPlacesFromGoogleByText from "@utils/getPlacesFromGoogleByText";
import { PrismaClient, Prisma } from "@prisma/client";

const touristsRouter: Router = express.Router();
const prisma = new PrismaClient();

touristsRouter.use(express.json());

touristsRouter.post(
  "/description",
  async (req: Request, res: Response): Promise<void> => {
    const { searchText } = req.body;

    try {
      const googlePlacesResult = await getPlacesFromGoogleByText(searchText);

      const googlePlaceId = googlePlacesResult.placeID;
      const formattedAddress = googlePlacesResult.formattedAddress;
      const latitude = googlePlacesResult.location.lat;
      const longitude = googlePlacesResult.location.lng;
      const googleMapsUri = googlePlacesResult.googleMapsUri;
      const websiteUri = googlePlacesResult.websiteUri;
      const regularOpeningHours = JSON.stringify(
        googlePlacesResult.regularOpeningHours
      );
      const photos = googlePlacesResult.photos;

      // Check if place exist
      const existingPlace = await prisma.places.findUnique({
        where: { google_place_id: googlePlaceId },
      });

      if (existingPlace) {
        res.status(200).json({
          message: "Already existing",
          place: existingPlace,
        });
      }

      const newPlace = await prisma.places.create({
        data: {
          google_place_id: googlePlaceId,
          formatted_address: formattedAddress,
          address: googlePlacesResult.address || "Default Address",
          latitude: new Prisma.Decimal(latitude),
          longitude: new Prisma.Decimal(longitude),
          google_map_uri: googleMapsUri,
          website_uri: websiteUri,
          regular_opening_hours: regularOpeningHours,
          name: googlePlacesResult.name || "Default Name",
          general_info:
            googlePlacesResult.generalInfo || "General info not provided",
        },
      });

      if (photos && Array.isArray(photos)) {
        const maxPhotos = photos.slice(0, 5);
        for (const photo of maxPhotos) {
          const base64Image = await fetchBase64FromUrl(photo.url);
          await prisma.images.create({
            data: {
              place_id: newPlace.id,
              author_name: photo.authorName || "Author",
              file_data: base64Image,
            },
          });
        }
      }

      res.status(201).json(newPlace);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
);

// Utility function
async function fetchBase64FromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

export default touristsRouter;
