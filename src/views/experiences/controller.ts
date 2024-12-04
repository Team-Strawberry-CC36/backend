import { Helpfullness, HelpfullnessLevel } from "@prisma/client";
import { prisma } from "@utils/index";
import { Controller } from "src/interfaces/express_shortcuts";

// Post a new vote from an user
const addHFVote: Controller = async (req, res) => {
  try {
    const { experienceId } = req.params;
    const { userId, status } = req.body;

    if (!experienceId) throw "Experience ID must be provided";
    if (!userId) throw "User ID must be provided";
    if (status !== "up" && status !== "down") {
      throw "Status must be provided and must be either 'up' or 'down'";
    }
    const parsedExperienceId = parseInt(experienceId, 10);

    // Check if the vote already exists
    const existingVote = await prisma.helpfullness.findFirst({
      where: {
        experience_id: parsedExperienceId,
        user_id: userId,
      },
    });

    // Create a new vote if it doesn't exist
    const newVote: Omit<Helpfullness, "id"> = {
      user_id: userId,
      experience_id: parsedExperienceId,
      status,
    };
    if (existingVote) {
      return res.status(400).json({
        error: "Vote already exists",
      });
    }
    const query = await prisma.helpfullness.create({
      data: newVote,
    });

    res.send({
      message: "new Vote",
      data: query,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error });
  }
};

const changeHFStatus: Controller = async (req, res) => {
  try {
    const { id, voteStatus } = req.params;

    if (!id) throw "Id must be provided";
    if (voteStatus != "UP" && voteStatus != "DOWN")
      throw "status must be up or down";

    const parsedId = parseInt(id);

    const query = await prisma.helpfullness.update({
      where: { id: parsedId },
      data: { status: voteStatus.toLowerCase() as HelpfullnessLevel },
    });

    res.status(200).send({
      message: "success",
      data: query,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
};

const deleteHFVote: Controller = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) throw "Id must be provided";

    const parsedId = parseInt(id);

    const query = await prisma.helpfullness.delete({
      where: { id: parsedId },
    });

    res.status(200).send({
      message: "success",
      data: query,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
};

const ExperienceController = {
  addHFVote,
  changeHFStatus,
  deleteHFVote,
};

export default ExperienceController;
