import { Router } from "express";
import { Controller } from "src/interfaces/express_shortcuts";
import { prisma } from "@utils/index";
import { Helpfullness, Votes } from "@prisma/client";
import ExperienceController from "./controller";

const experiencesRouter = Router();

// CHECK

// Helpfullness
// Create
experiencesRouter.post(
  "/experiences/:id/votes",
  ExperienceController.addHFVote
);

// Update
experiencesRouter.patch(
  "/experiences/:id/votes/:id",
  ExperienceController.changeHFStatus
);

// Delete
experiencesRouter.delete(
  "/experiences/:id/votes/:id",
  ExperienceController.deleteHFVote
);
