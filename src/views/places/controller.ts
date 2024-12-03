import { Etiquette, PlaceType } from "@prisma/client";
import { Request, Response } from "express";
import { Controller } from "src/interfaces/express_shortcuts";
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
    const userId: string = req.body.userId;

    // [ ] change dynaimc
    const category = "ONSEN";

    if (!id || typeof id !== "string") {
      return res.status(400).send({
        message: "Error! id must be provided",
        data: null,
      });
    }

    const query = await PlaceModel.getIPlaceById(id, category);
    // Voting data
    let votes: VotesPerPlace[] = [];
    if (query) {
      let votes = await PlaceModel.getVotesPerPlace(query.id, userId);
    }

    res.send({
      message: "success!",
      data: {
        ...query,
        votesPerUser: votes,
      },
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
