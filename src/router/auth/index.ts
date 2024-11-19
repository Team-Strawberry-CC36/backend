import express, { Request, Response, NextFunction, Router } from "express";

const authRouter: Router = express.Router();
authRouter.use(express.json());

authRouter.get('/verify-session');

export default authRouter;