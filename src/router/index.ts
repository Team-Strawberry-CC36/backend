import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

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

//Retrieve all experiences related to a specific place
router.post("/places/:id/experiences", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user_id, selectedEtiquette, experienceText } = req.body;
    const newExperience = await prisma.experiences.create({
      data: {
        user_id: user_id,
        place_id: Number(id),
        experience: experienceText,
        place_etiquette_id: selectedEtiquette
          ? Number(selectedEtiquette)
          : null,
      },
    });
    res.status(201).json(newExperience);
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
      const { expID } = req.params;
      const updateData = req.body;
      const updatedExperience = await prisma.experiences.update({
        where: { id: Number(expID) },
        data: updateData,
      });
      res.json(updatedExperience);
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

export default router;
