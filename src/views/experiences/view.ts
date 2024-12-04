import { Router } from "express";
import { Controller } from "src/interfaces/express_shortcuts";
import { prisma } from "@utils/index";
import { Helpfullness, Votes } from "@prisma/client";
import ExperienceController from "./controller";

const experiencesRouter = Router();

// CHECK

// Helpfullness
// Get
experiencesRouter.get(
  "/experiences/votes",
  ExperienceController.retrieveHFVote
);

// Create
experiencesRouter.post(
  "/experiences/:exid/votes",
  ExperienceController.addHFVote
);

// Update
experiencesRouter.patch(
  "/experiences/:exid/votes/:vid",
  ExperienceController.changeHFStatus
);

// Delete
experiencesRouter.delete(
  "/experiences/:exid/votes/:vid",
  ExperienceController.deleteHFVote
);

export default experiencesRouter;
