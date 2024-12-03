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
  "/experiences/:id/helpfullness",
  ExperienceController.addHFVote
);

// Update
experiencesRouter.patch(
  "/helpfullness/:id",
  ExperienceController.changeHFStatus
);

// Delete
experiencesRouter.delete("/helpfullness/:id");
