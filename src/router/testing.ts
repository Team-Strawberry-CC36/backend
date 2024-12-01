import { Router } from "express";
import PlaceController from "src/controllers/places";

const testingRouter = Router();

testingRouter.get("/places/:id", PlaceController.getPlaceDetails);
testingRouter.post("/search", PlaceController.search);

export default testingRouter;
