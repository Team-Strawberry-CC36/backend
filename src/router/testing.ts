import { Router } from "express";
import PlaceController from "src/controllers/places";

const testingRouter = Router();

testingRouter.post("/search", PlaceController.search);

export default testingRouter;
