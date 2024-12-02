import { Router } from "express";
import { prisma } from "@utils/index";

const router = Router();

/**
 * Helpfullness are related to two entities.
 * 1. userId
 * 2. experience
 */

// CRUD OPERATIONS FOR HELPFULLNESS
// Endpoint for retrive all the helpfullness votes in one
// single experience
router.get("/experience/:id/helpfullness", async (req, res) => {
  try {
    const { id } = req.params;

    const query = await prisma.helpfullness.findMany({
      where: {
        experience_id: id,
      },
    });

    res.send({
      message: "success",
      data: query,
    });
  } catch (e) {
    return res.send({
      message: "Error happens",
      error: e,
    });
  }
});

// For deleting!
router.get("/helpfullness/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = await prisma.helpfullness.delete({
      where: {
        id: id,
      },
    });

    res.send({
      message: "success",
    });
  } catch (e) {
    return res.send({
      message: "Error happens",
      error: e,
    });
  }
});
