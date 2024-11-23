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
      const photos = JSON.stringify(googlePlacesResult.photos);

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
          photos: photos,
          name: googlePlacesResult.name || "Default Name",
          general_info:
            googlePlacesResult.generalInfo || "General info not provided",
        },
      });

      res.status(201).json(newPlace);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
);

export default touristsRouter;
