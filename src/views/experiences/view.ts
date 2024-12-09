import { Router } from "express";
import experienceController from "./controller";

const experienceRouter = Router();

experienceRouter.patch(
  "/experiences/:id",
  experienceController.updateExperience
);
experienceRouter.delete(
  "/experiences/:id",
  experienceController.deleteExperience
);

export default experienceRouter;
