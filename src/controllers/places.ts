import { placeDetails } from "@googlemaps/google-maps-services-js/dist/places/details";
import { PlaceType, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { IPlace, IPlaceType } from "src/interfaces/places";
import PlaceModel from "src/models/places";

const prisma = new PrismaClient();

// Helper function to valid enum
const PLACE_TYPES: {
  [index: string]: PlaceType;
} = {
  shrine: "SHRINE",
  restaurant: "RESTAURANT",
  onsen: "ONSEN",
};

// Types
type Controller = (req: Request, res: Response) => void;

type SearchRequest = {
  textQuery?: string;
  loc?: {
    lat: number;
    lon: number;
  };
  category?: string;
};

/**
 * Function in charge of search places and returns the markers
 * @param req
 * @param res
 * @returns
 */
const search: Controller = async (req, res) => {
  try {
    const { textQuery, category }: SearchRequest = req.body.body;

    validateSearch(textQuery, category);

    // Filtering!
    const enhancedTextQuery = category + " " + textQuery;
    // Already validate it.
    const markers = await PlaceModel.getMarkers(enhancedTextQuery!, category!);

    return res.send({ message: "", data: markers });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ message: "An error occurred while processing your request." });
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
    const { id, category } = req.params;

    if (!id || !category) {
      return res.status(400).send({
        message: "Error! id and category must be provided!",
        data: null,
      });
    }

    const query = await PlaceModel.getPlaceById(id, category);

    res.send({
      message: "success!",
      data: query,
    });
  } catch (e) {
    res.send({
      message: "Error inside getPlaceDetails",
      data: null,
    });
  }
};

// Helper function for validation
const validateSearch = (textQuery?: string, category?: string) => {
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
