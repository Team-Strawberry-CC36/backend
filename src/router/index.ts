import express, { Request, Response, Router } from "express";
// DB
import {
  Etiquette,
  Etiquette_per_experiences,
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

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

//Retrieve all experiences related to a specific place
router.post("/places/:id/experiences", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user_id, dateVisited, dateCreated, experience, etiquettes } =
      req.body;

    const place = await prisma.places.findUnique({
      where: { id: Number(id) },
    });
    const formattedEtiquettes = etiquettes?.map((etiquette: Etiquette) => ({
      id: etiquette.id,
      label: etiquette.label,
    }));

    const newExperience = await prisma.experiences.create({
      data: {
        place_id: Number(id),
        user_id,
        visited_at: new Date(dateVisited),
        created_at: new Date(dateCreated),
        experience,
        etiquettes: formattedEtiquettes,
      },
    });

    const response = {
      id: newExperience.id,
      visited_at: newExperience.visited_at,
      created_at: newExperience.created_at,
      experience: newExperience.experience,
      etiquettes: formattedEtiquettes || [],
      metadata: {
        visited_at: newExperience.visited_at,
        created_at: newExperience.created_at,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
});

//Update details of a specific experience
router.patch(
  "/places/:id/experiences/:expId",
  async (req: Request, res: Response) => {
    try {
      const { expId } = req.params;
      const { user_id, visited_at, created_at, experience, etiquettes } =
        req.body;

      const formattedEtiquettes = etiquettes?.map(
        (etiquette: Etiquette_per_experiences) => ({
          id: etiquette.id,
          label: etiquette,
        })
      );

      const updatedExperience = await prisma.experiences.update({
        where: { id: Number(expId) },
        data: {
          user_id,
          visited_at: new Date(visited_at),
          created_at: new Date(created_at),
          experience,
          etiquettes: formattedEtiquettes,
        },
      });

      const response = {
        id: updatedExperience.id,
        user_id: updatedExperience.user_id,
        visited_at: new Date(updatedExperience.visited_at),
        experience: updatedExperience.experience,
        etiquettes: formattedEtiquettes || [],
        metadata: {
          created_at: updatedExperience.created_at,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
    }
  }
);

//Remove experience by its ID
router.delete(
  "/places/:id/experiences/:expId",
  async (req: Request, res: Response) => {
    try {
      const expID = req.params;
      await prisma.experiences.delete({
        where: { id: Number(expID) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error });
    }
  }
);

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

export default router;
