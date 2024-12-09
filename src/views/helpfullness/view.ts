import { Router } from "express";
import helpfulnessController from "./controller";

const helpfullnessRouter = Router();

// CHECK
helpfullnessRouter.get(
  "/experiences/votes",
  helpfulnessController.retrieveHFVote
);

// Create
helpfullnessRouter.post(
  "/experiences/:exid/votes",
  helpfulnessController.addHFVote
);

// Update
helpfullnessRouter.patch(
  "/experiences/:exid/votes/:vid",
  helpfulnessController.changeHFStatus
);

// Delete
helpfullnessRouter.delete(
  "/experiences/:exid/votes/:vid",
  helpfulnessController.deleteHFVote
);

export default helpfullnessRouter;
