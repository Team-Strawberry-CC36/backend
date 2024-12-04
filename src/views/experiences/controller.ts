import { Helpfullness, HelpfullnessLevel } from "@prisma/client";
import { prisma } from "@utils/index";
import { Controller } from "src/interfaces/express_shortcuts";

const retrieveHFVote: Controller = async (req, res) => {
  try {
    const helpfulnessVoteData = await prisma.helpfullness.findMany({
      where: {
        user_id: req.body.userId,
      },
    });

    const voteLowerCased = helpfulnessVoteData.map((vote) => {
      return {
        vote_id: vote.id,
        user_id: vote.user_id,
        experience_id: vote.experience_id,
        helpfulness: vote.status.toLowerCase(),
      };
    });

    res.send({ message: "Data retrieved", data: voteLowerCased });
    return;
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Post a new vote from an user
const addHFVote: Controller = async (req, res) => {
  try {
    const { exid } = req.params;
    const { userId } = req.body;

    if (!exid) {
      throw "Id must be provided";
    }

    const parsedId = parseInt(exid, 10);

    const { vote } = req.body;

    if (vote != "down" && vote != "up") {
      throw "status must be provided, and need to be either up or down";
    }
    const parsedExperienceId = parseInt(exid, 10);

    // Check if the vote already exists
    const existingVote = await prisma.helpfullness.findFirst({
      where: {
        experience_id: parsedExperienceId,
        user_id: userId,
      },
    });

    // Create a new vote if it doesn't exist
    const newVote: Omit<Helpfullness, "id"> = {
      user_id: req.body.userId,
      experience_id: parsedId,
      status: vote.toUpperCase(),
    };
    if (existingVote) {
      return res.status(400).json({
        error: "Vote already exists",
      });
    }
    const query = await prisma.helpfullness.create({
      data: newVote,
    });

    res.status(201).send({
      message: "New Vote",
      data: query,
    });
  } catch (error) {
    res.status(400).send({ error });
  }
};

const changeHFStatus: Controller = async (req, res) => {
  try {
    const { vid } = req.params;
    const { vote } = req.body;

    if (!vid) throw new Error("ID must be provided");
    if (!vote) throw new Error("Status must be provided");

    const parsedId = parseInt(vid, 10);
    if (isNaN(parsedId)) throw new Error("ID must be a valid number");

    const normalizedVote = vote.toLowerCase();
    if (normalizedVote !== "up" && normalizedVote !== "down")
      throw new Error("Status must be 'up' or 'down'");

    const query = await prisma.helpfullness.update({
      where: { id: parsedId },
      data: { status: normalizedVote.toUpperCase() as HelpfullnessLevel },
    });

    res.status(201).send({
      message: "Successfully edited vote.",
      data: query,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const deleteHFVote: Controller = async (req, res) => {
  try {
    const { vid } = req.params;

    if (!vid) throw "Id must be provided";

    const parsedId = parseInt(vid);

    const query = await prisma.helpfullness.delete({
      where: { id: parsedId },
    });

    res.status(201).send({
      message: "Successfully deleted vote.",
      data: query,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const ExperienceController = {
  retrieveHFVote,
  addHFVote,
  changeHFStatus,
  deleteHFVote,
};

export default ExperienceController;
