import express, { Request, Response, Router } from "express";
// DB
import {
  Etiquette,
  Etiquette_per_experiences,
  PrismaClient,
} from "@prisma/client";
import axios from "axios";
import { authenticateUser } from "@auth/middlewares";

const prisma = new PrismaClient();
const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const MAX_PHOTOS = 3;

router.use(authenticateUser);

// Pull the places data
router.get("/places", async (req: Request, res: Response) => {
  try {
    const places = await prisma.places.findMany({
      include: {
        experiences: true,
      },
    });
    res.send({ message: "", data: places });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

//Add a new place
router.post("/places", async (req: Request, res: Response) => {
  try {
    const placeData = req.body;
    const newPlace = await prisma.places.create({
      data: placeData,
    });
    res.status(201).json(newPlace);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
});

//Update details of specific place
router.patch("/places/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedPlace = await prisma.places.update({
      where: { id: Number(id) },
      data: updateData,
    });
    res.json({ updatedPlace });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
});

// Fetch photos from google API
router.get("/places/:id/photos", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Fetch the place by ID
    const place = await prisma.places.findUniqueOrThrow({
      where: { id: Number(id) },
      select: { google_place_id: true },
    });

    if (!place) {
      res.status(404).json({ message: "Place not found." });
    }

    const google_place_id = place.google_place_id;
    // Use Google Place Details API to fetch photos
    const placeDetailsResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${google_place_id}&key=${GOOGLE_API_KEY}`
    );

    const photos = placeDetailsResponse.data.result.photos;

    if (!photos || photos.length === 0) {
      res.status(404).json({ message: "No photos for this place." });
    }

    // Generate photo URLs using Place Photos API
    const photoUrls = photos.slice(0, MAX_PHOTOS).map((photo: any) => {
      //it might be possible this will not ensure a square image (400x400).
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`;
    });

    res.status(200).send({ data: photoUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

//Remove place by its ID
router.delete("/places/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.places.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
});

// --! Experiences endpoints

// Get experiences from a place.
router.get(
  "/places/:placeId/experiences",
  async (req: Request, res: Response) => {
    try {
      const { placeId } = req.params;
      const parsedPlaceId = parseInt(placeId, 10);

      const experiences = await prisma.experiences.findMany({
        where: { place_id: parsedPlaceId },
        include: {
          etiquettes: {
            include: {
              Place_etiquettes: {
                include: {
                  etiquette: true,
                },
              },
            },
          },
        },
      });

      const response = experiences.map((experience) => ({
        id: experience.id,
        experience: experience.experience,
        dateVisited: experience.visited_at,
        metadata: {
          createdAt: experience.created_at,
          editedAt: experience.edited_at,
        },
        etiquettes: experience.etiquettes.map((e) => ({
          id: e.Place_etiquettes.id,
          label: e.Place_etiquettes.etiquette.label,
        })),
      }));

      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
);

// Adding a new experience
type ExperienceAddPackage = {
  dateVisited: string;
  experience: string;
  etiquetteSelected: {
    etiquette_id: number;
  }[];
};

router.post(
  "/places/:placeId/experiences",
  async (req: Request, res: Response) => {
    try {
      const { placeId } = req.params;

      const userId = req.body.userId;

      // check data
      const { dateVisited, experience, etiquetteSelected } = req.body
        .data as ExperienceAddPackage;

      const newExperience = await prisma.experiences.create({
        data: {
          place_id: parseInt(placeId),
          user_id: userId,
          visited_at: new Date(dateVisited),
          experience: experience,
        },
      });

      for (let etiquette of etiquetteSelected) {
        const insertedEtiquette = await prisma.etiquette_per_experiences.create(
          {
            data: {
              place_etiquette_id: etiquette.etiquette_id,
              experience_id: newExperience.id,
            },
          }
        );
      }

      res.status(201).json({
        message: "Success",
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
    }
  }
);

/**
 *  CODE MOVE IT TO views/experiences/controller
 *
 *
 */
// //Update details of a specific experience
// router.patch(
//   "/places/:id/experiences/:expId",
//   async (req: Request, res: Response) => {
//     try {
//       const { expId } = req.params;
//       const { user_id, visited_at, created_at, experience, etiquettes } =
//         req.body;

//       const formattedEtiquettes = etiquettes?.map(
//         (etiquette: Etiquette_per_experiences) => ({
//           id: etiquette.id,
//           label: etiquette,
//         })
//       );

//       const updatedExperience = await prisma.experiences.update({
//         where: { id: Number(expId) },
//         data: {
//           user_id,
//           visited_at: new Date(visited_at),
//           created_at: new Date(created_at),
//           experience,
//           etiquettes: formattedEtiquettes,
//         },
//       });

//       const response = {
//         id: updatedExperience.id,
//         user_id: updatedExperience.user_id,
//         visited_at: new Date(updatedExperience.visited_at),
//         experience: updatedExperience.experience,
//         etiquettes: formattedEtiquettes || [],
//         metadata: {
//           created_at: updatedExperience.created_at,
//         },
//       };

//       res.status(200).json(response);
//     } catch (error) {
//       console.error(error);
//       res.status(400).json({ error });
//     }
//   }
// );

// //Remove experience by its ID
// router.delete(
//   "/places/:id/experiences/:expId",
//   async (req: Request, res: Response) => {
//     try {
//       const expID = req.params;
//       await prisma.experiences.delete({
//         where: { id: Number(expID) },
//       });
//       res.status(204).send();
//     } catch (error) {
//       res.status(400).json({ error });
//     }
//   }
// );

// --! Voting endpoint

// Retrieve votes for a specific place
router.get("/places/:id/votes", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const placeId = parseInt(id, 10);
    const etiquettes = await prisma.place_etiquettes.findMany({
      where: { place_id: placeId },
      include: {
        votes: true,
        etiquette: true,
      },
    });

    const response = etiquettes.map((etiquette) => {
      const voteCounts = etiquette.votes.reduce(
        (acc: Record<"allowed" | "not_allowed" | "neutral", number>, vote) => {
          const status = vote.status.toLowerCase() as
            | "allowed"
            | "not_allowed"
            | "neutral";
          acc[status] += 1;
          return acc;
        },
        { allowed: 0, not_allowed: 0, neutral: 0 }
      );

      return {
        etiquetteId: etiquette.etiquette_id,
        etiquetteType: etiquette.etiquette.label,
        numberOfVotesForAllowed: voteCounts.allowed,
        numberOfVotesForNotAllowed: voteCounts.not_allowed,
        numberOfVotesForNeutral: voteCounts.neutral,
      };
    });

    res.status(200).json({
      message: "Votes retrieved successfully.",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Insert votes for a place
router.post("/places/:id/votes", async (req: Request, res: Response) => {
  const userId = req.body.user_id;
  const votes = req.body.votes;

  try {
    const processedVotes = votes.map((vote: { id: number; vote: string }) => ({
      place_etiquette_id: vote.id,
      user_id: userId,
      status: vote.vote,
    }));

    const result = await prisma.votes.createMany({
      data: processedVotes,
      skipDuplicates: true,
    });

    res.status(201).json({
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Update a specific vote for a place
router.patch(
  "/places/:id/votes/:voteId",
  async (req: Request, res: Response) => {
    const { voteId } = req.params;
    const { status } = req.body;

    try {
      const updatedVote = await prisma.votes.update({
        where: { id: parseInt(voteId, 10) },
        data: { status },
      });

      res.status(200).json({ data: updatedVote });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
);

// Insert vote for ettiquette
router.post("/places/:id/votes", async (req: Request, res: Response) => {
  try {
    const { votes, userId } = req.body;
    // Might need this for Firebase Auth middleware sets?
    const placeId = parseInt(req.params.id);

    if (!userId || !placeId || !votes) {
      res.status(400).json({ message: "Invalid" });
    }

    // Loop through the votes and create new entries
    const createdVotes = await Promise.all(
      votes.map((vote: any) =>
        prisma.votes.create({
          data: {
            user_id: userId,
            place_etiquette_id: vote.etiquetteId,
            status: vote.vote?.toUpperCase() || "NEUTRAL",
          },
        })
      )
    );

    res.status(201).json({ message: "success", data: createdVotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Update a specific vote for etiquette
router.patch("/places/:id/votes", async (req: Request, res: Response) => {
  try {
    const { votes, userId } = req.body;
    // Might need this for Firebase Auth middleware sets ?
    const placeId = parseInt(req.params.id);

    if (!userId || !placeId || !votes) {
      res.status(400).json({ message: "Invalid" });
    }

    // Loop through the votes and update existing entries
    const updatedVotes = await Promise.all(
      votes.map((vote: any) =>
        prisma.votes.updateMany({
          where: {
            user_id: userId,
            place_etiquette_id: vote.etiquetteId,
          },
          data: {
            status: vote.vote?.toUpperCase() || "NEUTRAL",
          },
        })
      )
    );

    res.status(200).json({ message: "success", data: updatedVotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

export default router;
