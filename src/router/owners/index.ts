import express, { Request, Response, NextFunction, Router } from "express";

const ownersRouter: Router = express.Router();
ownersRouter.use(express.json());

ownersRouter.get('/');

export default ownersRouter;