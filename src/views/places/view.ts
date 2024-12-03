import { Router } from "express";
import controller from "./controller";
import { authenticateUser } from "src/views/auth/middlewares";
import PlaceModel from "./model";

const placesRouter = Router();

// Middleware
placesRouter.use(authenticateUser);

// THIS RETURNS THE OBJECT WITH EXPERIENCES
placesRouter.get("/places/:id", controller.getPlaceDetails);
placesRouter.post("/search", controller.search);

export default placesRouter;
