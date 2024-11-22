import express, { Request, Response, NextFunction, Router } from "express";
import getPlacesFromGoogleByText from "@utils/getPlacesFromGoogleByText";

const touristsRouter: Router = express.Router();
touristsRouter.use(express.json());

touristsRouter.get("/", (req, res) => {
  res.send("Hi");
});

touristsRouter.post("/descriptions", async (req, res) => {
  const { searchText } = req.body;

  const googlePlacesResult = await getPlacesFromGoogleByText(searchText);
  console.log(googlePlacesResult);
});

export default touristsRouter;
