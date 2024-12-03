import { Router } from "express";
import { addUser, getUser } from "./controller";

const authRouter = Router();

//
authRouter.post("/user", addUser);
authRouter.get("/user/:uid", getUser);

export default authRouter;
