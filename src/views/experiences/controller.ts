import { Etiquette_per_experiences } from "@prisma/client";
import { prisma } from "@utils/index";
import { Controller } from "src/interfaces/express_shortcuts";

const updateExperience: Controller = async (req, res) => {
  try {
    const { id } = req.params;

    const { data } = req.body;

    if (typeof data !== "string") {
      return res.send({
        message: "Error! data must be provided and needs to be an string",
      });
    }

    // -- Not using for now
    // const formattedEtiquettes = etiquettes?.map(
    //   (etiquette: Etiquette_per_experiences) => ({
    //     id: etiquette.id,
    //     label: etiquette,
    //   })
    // );

    const updatedExperience = await prisma.experiences.update({
      where: { id: Number(id) },
      data: {
        experience: data,
        edited_at: new Date(),
      },
    });

    // Sending an update it response
    // const response = {
    //   id: updatedExperience.id,
    //   user_id: updatedExperience.user_id,
    //   visited_at: new Date(updatedExperience.visited_at),
    //   experience: updatedExperience.experience,
    //   etiquettes: formattedEtiquettes || [],
    //   metadata: {
    //     created_at: updatedExperience.created_at,
    //   },
    // };

    res.status(204).send({
      message: "Success",
      data: null,
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Error while updating an experiences", error });
  }
};

const deleteExperience: Controller = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.send({
        message: "Error. Id must be provieded.",
      });
    }

    await prisma.etiquette_per_experiences.deleteMany({
      where: {
        experience_id: Number(id),
      },
    });

    await prisma.experiences.delete({
      where: { id: Number(id) },
    });

    res.status(204).send({
      message: "Success!",
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while deleting an experience",
    });
  }
};

const experienceController = {
  deleteExperience,
  updateExperience,
};

export default experienceController;
