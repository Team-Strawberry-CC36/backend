import express, { Request, Response, NextFunction, Router } from "express";
import getPlacesFromGoogleByText from "@utils/getPlacesFromGoogleByText";

const touristsRouter: Router = express.Router();
touristsRouter.use(express.json());

touristsRouter.get("/", (req, res) => {
  res.send("Hi");
});

touristsRouter.post("/description", async (req, res) => {
  const { searchText } = req.body;

  const googlePlacesResult = await getPlacesFromGoogleByText(searchText);
});

export default touristsRouter;
