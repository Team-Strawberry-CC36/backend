import { Router } from "express";
import { authenticateUser } from "src/views/auth/middlewares";
import userController from "./controller";

const userRouter = Router();

// Middleware
userRouter.use(authenticateUser);

userRouter.get("/user/experiences/", userController.getUserExperiences);

export default userRouter;
