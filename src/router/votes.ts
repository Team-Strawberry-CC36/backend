import { Router } from "express";
import { prisma } from "@utils/index";

const router = Router();

/**
 * Votes are related to two entities.
 * 1. userId
 * 2. place_Etiquettes!
 * Observe how we can access to that information using the most
 * related entities
 * */

// CRUD OPERATIONS FOR HELPFULLNESS
// Endpoint for retrive all the etiquettes votes in one
// single place.
router.get("/place/:id/votes", async (req, res) => {
  try {
    let id: string | undefined = req.params.id;

    if (!id || typeof id !== "string") {
      throw "Id must be provided and must be valid!";
    }

    let parsedId = parseInt(id);

    const query = await prisma.places.findFirst({
      where: {
        id: parsedId,
      },
      include: {
        etiquettes: true,
      },
    });

    let data = [];

    // For all the etiquettes in a place. get their votes!
    if (query?.etiquettes && query?.etiquettes.length > 0) {
      for (let etiquette of query?.etiquettes) {
        const vote = await prisma.votes.findMany({
          where: {
            place_etiquette_id: etiquette.id,
          },
        });
        data.push(vote);
      }
    }

    // Once we have the place_etiquettes, we can have the votes for each one

    res.send({
      message: "success",
      data: data,
    });
  } catch (e) {
    return res.send({
      message: "Error happens",
      error: e,
    });
  }
});

router.delete("/vote/:id", async (req, res) => {
  try {
    let id: string | undefined = req.params.id;

    if (!id || typeof id !== "string") {
      throw "Id must be provided and must be valid!";
    }

    let parsedId = parseInt(id);

    const query = await prisma.votes.delete({
      where: {
        id: parsedId,
      },
    });

    res.send({
      message: "success",
      data: null,
    });
  } catch (e) {
    return res.send({
      message: "Error happens",
      error: e,
    });
  }
});
