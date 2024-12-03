import { Helpfullness, HelpfullnessLevel } from "@prisma/client";
import { prisma } from "@utils/index";
import { Controller } from "src/interfaces/express_shortcuts";

const retrieveHFVote: Controller = async (req, res) => {
  try {
    const { experienceId } = req.params;

    if ( !experienceId ) {
      throw "Experience ID not provided."
    }

    const parsedId = parseInt(experienceId, 10);

    const helpfulnessVoteData = await prisma.helpfullness.findMany({
      where: {
        user_id: req.body.userId,
        experience_id: parsedId,
      },
    });

    res.json(helpfulnessVoteData);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
}

// Post a new vote from an user
const addHFVote: Controller = async (req, res) => {
  try {
    const { experienceId } = req.params;

    if (!experienceId) {
      throw "Id must be provided";
    }

    const parsedId = parseInt(experienceId, 10);

    const { status } = req.body;

    if (status != "down" || status != "up") {
      throw "status must be provided, and need to be either up or down";
    }

    const newVote: Omit<Helpfullness, "id"> = {
      user_id: req.body.userId,
      experience_id: parsedId,
      status: status,
    };

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
  retrieveHFVote,
  addHFVote,
  changeHFStatus,
  deleteHFVote,
};

export default ExperienceController;
