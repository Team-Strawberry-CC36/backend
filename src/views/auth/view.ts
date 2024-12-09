import { Router } from "express";
import { addUser } from "./controller";
import { authenticateUser } from "./middlewares";

const authRouter = Router();

authRouter.post("/user", addUser);

export default authRouter;
