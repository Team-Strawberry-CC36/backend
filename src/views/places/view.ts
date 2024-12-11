import { Router } from "express";
import controller from "./controller";

const placesRouter = Router();

// THIS RETURNS THE OBJECT WITH EXPERIENCES
placesRouter.get("/places/:id", controller.getPlaceDetails);
placesRouter.post("/search", controller.search);

export default placesRouter;
