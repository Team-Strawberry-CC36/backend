import { Router } from "express";
import userController from "./controller";

const userRouter = Router();

userRouter.get("/user/experiences/", userController.getUserExperiences);

export default userRouter;
