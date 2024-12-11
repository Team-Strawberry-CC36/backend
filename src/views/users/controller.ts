import { Etiquette, PlaceType } from "@prisma/client";
import { Request, Response } from "express";
import { Controller } from "src/interfaces/express_shortcuts";
import IExperience from "src/interfaces/frontend/Experience";
import { VotesPerPlace } from "src/interfaces/frontend/Vote";
import PlaceModel from "src/views/places/model";
import ExperienceController from "../helpfullness/controller";
import UserModel from "./model";

// Types
/**
 * Function in charge of search places and returns the markers
 * @param req
 * @param res
 * @returns
 */
const getUserExperiences: Controller = async (req, res) => {
  try {
    const { userId } = req.body;

    let output = await UserModel.userPlacesVisited(userId);

    return res.send({
      message: "Success",
      data: output,
    });
  } catch (e) {
    return res.send({
      message: "Something happend getting user experiences",
    });
  }
};

const userController = {
  getUserExperiences,
};

export default userController;
