import { prisma } from "@utils/index";

// Frontend interface used in Tourist Dashboard
interface IPlaceVisited {
  experienceId: number; // ID of experience from Experiences table: id
  placeName: string; // Name of the place described in the experience
  placeType: string; // Type of the place described in the experience
  experience: string; // The written experience text from Experiences table: experience
  dateVisited: Date; // Visit date from Experiences table: created_at
}

class UserModel {
  static async userPlacesVisited(userId: string): Promise<IPlaceVisited[]> {
    let output: IPlaceVisited[] = [];

    const experiences = await prisma.experiences.findMany({
      where: {
        user_id: userId,
      },
    });

    for (let exp of experiences) {
      const placeObjVisited = await prisma.places.findFirstOrThrow({
        where: {
          id: exp.place_id,
        },
      });

      let placeVisited: IPlaceVisited = {
        experienceId: exp.id,
        placeName: "",
        placeType: placeObjVisited.place_type,
        experience: exp.experience,
        dateVisited: exp.visited_at,
      };

      output.push(placeVisited);
    }

    return output;
  }
}

export default UserModel;