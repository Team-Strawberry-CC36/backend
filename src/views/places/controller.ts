import { Etiquette, PlaceType } from "@prisma/client";
import { Request, Response } from "express";
import { Controller } from "src/interfaces/express_shortcuts";
import { IPlaceType } from "src/interfaces/frontend/Place";
import { VotesPerPlace } from "src/interfaces/frontend/Vote";
import PlaceModel from "src/views/places/model";

// Types
/**
 * Function in charge of search places and returns the markers
 * @param req
 * @param res
 * @returns
 */
const search: Controller = async (req, res) => {
  try {
    const textQuery = req.body.data.textQuery as string;
    const category = req.body.data.category as PlaceType;

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
    const category = req.query.category as IPlaceType;

    // Validate `id` and `category`.
    if (!id || typeof id !== "string") {
      return res.status(400).send({
        message: "Error! id must be provided and must be a string.",
        data: null,
      });
    }

    if (!category || typeof category !== "string") {
      return res.status(400).send({
        message: "Error! category must be provided and must be a string.",
        data: null,
      });
    }
    // Fetch place details by id and category.
    const query = await PlaceModel.getIPlaceById(
      id,
      category.toUpperCase() as PlaceType
    );

    if (!query) {
      return res.status(404).send({
        message: "Place not found.",
        data: null,
      });
    }

    return res.send({ message: "success", data: query });
  } catch (error) {
    return res.status(500).send({
      message: "Error inside getPlaceDetails.",
      error: error,
    });
  }
};

// Helper function who makes validation for searching queries.
const validateSearch = (textQuery?: string, category?: string) => {
  // Object to validate it the placeType
  const PLACE_TYPES: {
    [index: string]: PlaceType;
  } = {
    shrine: "SHRINE",
    restaurant: "RESTAURANT",
    onsen: "ONSEN",
  };

  if (!textQuery || typeof textQuery !== "string") {
    throw "textQuery must be provided and must be a string!";
  }
  if (textQuery.trim().length === 0) {
    throw "textQuery cannot be empty!";
  }
  if (!category || !(category in PLACE_TYPES)) {
    throw "category must be a category type!";
  }
};

const PlaceController = {
  search,
  getPlaceDetails,
};

export default PlaceController;
