import { Router } from "express";
import { addUser } from "./controller";

const authRouter = Router();

authRouter.post("/user", addUser);

export default authRouter;
