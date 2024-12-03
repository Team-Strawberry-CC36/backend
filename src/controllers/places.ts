import { PlaceType } from "@prisma/client";
import { Request, Response } from "express";
import PlaceModel from "src/models/places";

// Types
type Controller = (req: Request, res: Response) => void;

/**
 * Function in charge of search places and returns the markers
 * @param req
 * @param res
 * @returns
 */
const search: Controller = async (req, res) => {
  try {
    const textQuery = req.body.textQuery as string;
    const category = req.body.category as PlaceType;

    // Throw error if either the query of the category are not correct.
    validateSearch(textQuery, category);

    // Filtering!
    const enhancedTextQuery = category + " " + textQuery;

    // Already validate it.
    const markers = await PlaceModel.getMarkers(enhancedTextQuery!, category!);

    return res.send({ message: "", data: markers });
  } catch (e) {
    return res.status(500).send({
      message: "An error occurred while processing your request.",
      error: e,
    });
  }
};

/**
 * Function who receives an placeId and return the place details
 * @param req
 * @param res
 * @returns
 */
const getPlaceDetails: Controller = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).send({
        message: "Error! id must be provided",
        data: null,
      });
    }

    const query = await PlaceModel.getPlaceById(id);

    res.send({
      message: "success!",
      data: query ? query : null,
    });
  } catch (e) {
    res.send({
      message: "Error inside getPlaceDetails",
      error: e,
    });
  }
};

// Helper function who makes validation for searching queries.
const validateSearch = (textQuery?: string, category?: string) => {
  const PLACE_TYPES: {
    [key: string]: PlaceType;
  } = {
    shrine: "SHRINE",
    restaurant: "RESTAURANT",
    onsen: "ONSEN",
  };

  if (
    !textQuery ||
    typeof textQuery !== "string" ||
    textQuery.trim().length === 0
  ) {
    throw new Error("textQuery must be a non-empty string!");
  }
  if (!category || !(category.toLowerCase() in PLACE_TYPES)) {
    throw new Error(
      `Invalid category! Supported categories: ${Object.keys(PLACE_TYPES).join(
        ", "
      )}`
    );
  }
};

const PlaceController = {
  search,
  getPlaceDetails,
};

export default PlaceController;
