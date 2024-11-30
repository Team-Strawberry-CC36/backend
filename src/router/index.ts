import express, { Request, Response, Router } from "express";
import {
  Etiquette,
  Etiquette_per_experiences,
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();
const router: Router = express.Router();

//Retrieve the Place interfaced object
router.get("/places", async (req: Request, res: Response) => {
  try {
    const places = await prisma.places.findMany({
      include: {
        experiences: true,
        images: true,
      },
    });
    res.json(places);
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
              etiquette: true,
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
          id: e.etiquette.id,
          label: e.etiquette.label,
        })),
      }));

      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
);

// Get all votes from an experience
router.get("/experiences/:id/votes", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    const votes = await prisma.votes.findMany({
      where: { experience_id: parsedId },
      include: {
        users_accounts: true,
      },
    });

    const response = votes.map((vote) => ({
      id: vote.id,
      user: vote.users_accounts.username,
      status: vote.status,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Post a new vote from an user
router.post("/experiences/:id/votes", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    const { user_id, status } = req.body;

    const newVote = await prisma.votes.create({
      data: {
        experience_id: parsedId,
        user_id,
        status,
      },
    });

    res.status(200).json(newVote);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
});

// Change status of a vote
router.post(
  "/experiences/:expId/votes/:voteId",
  async (req: Request, res: Response) => {
    try {
      const { expId, voteId } = req.params;
      const parsedExpId = parseInt(expId, 10);
      const parsedVoteId = parseInt(voteId, 10);

      const { status } = req.body;

      const updatedVote = await prisma.votes.update({
        where: { id: parsedVoteId },
        data: { status },
      });

      res.status(200).json(updatedVote);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
    }
  }
);

// Remove one specify vote
router.delete(
  "/experiences/:expId/votes/:voteId",
  async (req: Request, res: Response) => {
    try {
      const voteID = req.params;
      await prisma.votes.delete({
        where: { id: Number(voteID) },
      });
      res.status(204).send();
    } catch (error) {
      console.error(error);
    }
  }
);
// ---

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

// Voting endpoint
router.post("/vote", (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).json({ message: "success" });
});

export default router;
