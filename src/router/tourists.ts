import express, { Request, Response, NextFunction, Router } from "express";

const touristsRouter: Router = express.Router();
touristsRouter.use(express.json());

touristsRouter.get('/');

export default touristsRouter;