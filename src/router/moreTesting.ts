import { Request, Response, Router } from "express";
import { EtiquetteStatus, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const moreTestingRouter: Router = Router();

moreTestingRouter.get(
  "/places/:id/votes",
  async (req: Request, res: Response) => {
    // Please get data prepared in the following example format
    // Interface for data format is in frontend/src/utils/interfaces/PlaceEtiquetteVotes.ts

    // Feel free to change variable name from mockEtiquetteVotesData to something else
    // userID property can be retrieved from firebase authentication
    // const mockEtiquetteVotesData = {
    //     placeId: 1,
    //     userId: "V59GABMzBgS5iamjaa3omOrV07E2",
    //     userHasVoted : false,
    //     etiquetteVotes : [
    //         { etiquetteId: 1, etiquetteType: 'Smoking', numberOfVotesForAllowed: 100, numberOfVotesForNotAllowed: 1000 },
    //         { etiquetteId: 2, etiquetteType: 'Tattoos', numberOfVotesForAllowed: 400, numberOfVotesForNotAllowed: 700 },
    //         { etiquetteId: 3, etiquetteType: 'Towels', numberOfVotesForAllowed: 1050, numberOfVotesForNotAllowed: 50},
    //         { etiquetteId: 4, etiquetteType: 'Swimming', numberOfVotesForAllowed: 550, numberOfVotesForNotAllowed: 550},
    //         { etiquetteId: 5, etiquetteType: 'Existential Dread', numberOfVotesForAllowed: 1100, numberOfVotesForNotAllowed: 0}
    //     ],
    //     usersVote: [
    //         { etiquetteId: 1, etiquetteType: 'Smoking', vote: undefined },
    //         { etiquetteId: 2, etiquetteType: 'Tattoos', vote: undefined },
    //         { etiquetteId: 3, etiquetteType: 'Towels', vote: undefined },
    //         { etiquetteId: 4, etiquetteType: 'Swimming', vote: undefined },
    //         { etiquetteId: 5, etiquetteType: 'Existential Dread', vote: undefined },
    //     ],
    // };

    const googlePlaceId = req.params.id;
    const userId = req.body.userId;

    // Step 1: Get the place and its type
    const place = await prisma.places.findUnique({
      where: { google_place_id: googlePlaceId },
      select: { id: true, place_type: true },
    });

    if (!place) {
      throw new Error("Place not found!");
    }

    console.log("This is the place in step 1:", place);

    const placeId = place.id;
    const placeType = place.place_type;

    // Step 2: Get all etiquettes for the place type
    const etiquettesForPlaceType = await prisma.etiquette.findMany({
      where: { place_type: placeType },
    });

    console.log(
      "These are the etiquette types for this place: ",
      etiquettesForPlaceType
    );
    console.log("************");

    // Step 3: Get all votes for the place and all users
    const placeEtiquettesWithVotes = await prisma.place_etiquettes.findMany({
      where: { place_id: placeId },
      include: {
        etiquette: true,
        votes: true, //{ where: { user_id: userId } },
      },
    });

    console.log(
      "These are the placeEtiquettesWithVotes",
      placeEtiquettesWithVotes
    );

    // Step 4: Process etiquetteVotes (aggregate all user votes for ALLOWED/NOT_ALLOWED)
    const etiquetteVotes = etiquettesForPlaceType.map((etiquette) => {
      const placeEtiquette = placeEtiquettesWithVotes.find(
        (pe) => pe.etiquette_id === etiquette.id
      );

      const numberOfVotesForAllowed = placeEtiquette
        ? placeEtiquette.votes.filter((vote) => vote.status === "ALLOWED")
            .length
        : 0;

      const numberOfVotesForNotAllowed = placeEtiquette
        ? placeEtiquette.votes.filter((vote) => vote.status === "NOT_ALLOWED")
            .length
        : 0;

      return {
        etiquetteId: etiquette.id,
        etiquetteType: etiquette.label,
        numberOfVotesForAllowed,
        numberOfVotesForNotAllowed,
      };
    });

    console.log("These are the etiquette votes: ", etiquetteVotes);

    // Step 5: Build userVotes array
    // First get the votes for the individual user and the selected place
    const usersVote = etiquettesForPlaceType.map((ept) => {
      const placeEtiquette = placeEtiquettesWithVotes.find(
        (pe) => pe.etiquette_id === ept.id
      );

      if (placeEtiquette) {
        const voteRecord = placeEtiquette.votes.filter((vote) => {
          return vote.user_id === userId;
        });

        console.log("This is the voteRecord: ", voteRecord);

        return {
          etiquetteId: ept.id,
          etiquetteType: ept.label,
          vote: voteRecord.length > 0 ? voteRecord[0].status : "neutral",
        };
      }
    });
    console.log("These are the user's vote: ", usersVote);

    // const oldUsersVote = etiquettesForPlaceType.map((etiquette) => {
    //     const voteRecord = placeEtiquettesWithVotes.find(
    //         (pe) => pe.etiquette_id === etiquette.id && pe.votes.length > 0
    //     );

    //     return {
    //         etiquetteId: etiquette.id,
    //         etiquetteType: etiquette.label,
    //         vote: voteRecord ? voteRecord.votes[0].status : undefined, // This was the bug
    //     };
    // });
    // console.log("These are the old user's vote: ", oldUsersVote);

    const userHasVoted = placeEtiquettesWithVotes.some((etiquetteRelation) =>
      etiquetteRelation.votes.some((vote) => vote.user_id === userId)
    );

    const etiquetteVotesData = {
      placeId,
      userId,
      userHasVoted,
      etiquetteVotes,
      usersVote,
    };

    console.log(
      "This is the etiquettes vote data which is sent to the front: ",
      etiquetteVotesData
    );

    // Please make sure that data is returned like this
    res
      .status(200)
      .json({ message: "Hooray, it was a success", data: etiquetteVotesData });
  }
);

moreTestingRouter.post(
  "/places/:id/votes",
  async (req: Request, res: Response) => {
    const { votes, placeId, userId } = req.body;
    const mapVoteStatus = (status: string | undefined): string => {
      switch (status?.toLowerCase()) {
        case "allowed":
          return "ALLOWED";
        case "not-allowed":
          return "NOT_ALLOWED";
        default:
          return "NEUTRAL";
      }
    };

    // Extract the etiquette IDs from the votes
    const etiquetteIds = votes.map((vote: any) => vote.etiquetteId);

    // ensure all place_id and etiquette_id combinates exist in Place_etiquettes table
    const existingPlaceEtiquettes = await prisma.place_etiquettes.findMany({
      where: {
        place_id: placeId,
        etiquette_id: { in: etiquetteIds },
      },
      select: { id: true, etiquette_id: true },
    });

    const existingIds = existingPlaceEtiquettes.map(
      (entry) => entry.etiquette_id
    );
    const idsToInsert = etiquetteIds.filter(
      (id: any) => !existingIds.includes(id)
    );

    // insert the place etiquette ids
    if (idsToInsert.length > 0) {
      await prisma.place_etiquettes.createMany({
        data: idsToInsert.map((etiquetteId: any) => {
          return {
            place_id: placeId,
            etiquette_id: etiquetteId,
            status: "NEUTRAL",
          };
        }),
      });
    }

    // Fetch the updated Place_etiquettes records to get the IDs
    const allPlaceEtiquettes = await prisma.place_etiquettes.findMany({
      where: {
        place_id: placeId,
        etiquette_id: { in: etiquetteIds },
      },
      select: { id: true, etiquette_id: true },
    });

    // Map etiquette IDs to their corresponding place_etiquette IDs
    const etiquetteIdToPlaceEtiquetteId: Record<number, number> = {};
    allPlaceEtiquettes.forEach((entry) => {
      etiquetteIdToPlaceEtiquetteId[entry.etiquette_id] = entry.id;
    });
    console.log(etiquetteIdToPlaceEtiquetteId);

    if (!votes || !placeId || !userId) {
      return res
        .status(400)
        .json({ error: "votes, placeId, and userId are required" });
    }

    const votesData = votes.map((vote: any) => ({
      user_id: userId,
      place_etiquette_id: etiquetteIdToPlaceEtiquetteId[vote.etiquetteId],
      status: mapVoteStatus(vote.vote),
    }));

    try {
      const result = await prisma.votes.createMany({
        data: votesData,
      });
      console.log(`Inserted ${result.count} votes successfully.`);
      res.status(200).json({ message: "Inserted successfully", data: result });
    } catch (error) {
      console.error(`Error creating votes:`, error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
);

moreTestingRouter.patch(
  "/places/:id/votes",
  async (req: Request, res: Response) => {
    const { votes, placeId, userId } = req.body;

    if (!votes || !placeId || !userId) {
      return res
        .status(400)
        .json({ error: "votes, placeId and userId are required" });
    }

    const mapVoteStatus = (status: string | undefined): EtiquetteStatus => {
      switch (status?.toLowerCase()) {
        case "allowed":
          return "ALLOWED";
        case "not-allowed":
          return "NOT_ALLOWED";
        default:
          return "NEUTRAL";
      }
    };

    try {
      // Step 1: Fetch exiting Place_etiquette records
      const etiquetteIds = votes.map((vote: any) => vote.etiquetteId);
      const placeEtiquettes = await prisma.place_etiquettes.findMany({
        where: {
          place_id: placeId,
          etiquette_id: { in: etiquetteIds },
        },
        select: { id: true, etiquette_id: true },
      });

      const etiquetteIdToPlaceEtiquetteId: Record<number, number> = {};
      placeEtiquettes.forEach((entry) => {
        etiquetteIdToPlaceEtiquetteId[entry.etiquette_id] = entry.id;
      });

      // Step 2: Fetch existing votes for the user
      const placeEtiquetteIds = Object.values(etiquetteIdToPlaceEtiquetteId);
      const existingVotes = await prisma.votes.findMany({
        where: {
          user_id: userId,
          place_etiquette_id: { in: placeEtiquetteIds },
        },
        select: { id: true, place_etiquette_id: true },
      });

      const existingVoteMap: Record<number, number> = {};
      existingVotes.forEach((vote) => {
        existingVoteMap[vote.place_etiquette_id] = vote.id;
      });

      const updatePromises = votes
        .filter((vote: any) => {
          const placeEtiquetteId =
            etiquetteIdToPlaceEtiquetteId[vote.etiquetteId];
          console.log("filtering: ", existingVoteMap[placeEtiquetteId]);
          return existingVoteMap[placeEtiquetteId];
        })
        .map((vote: any) => {
          const placeEtiquetteId =
            etiquetteIdToPlaceEtiquetteId[vote.etiquetteId];
          const voteId = existingVoteMap[placeEtiquetteId];
          console.log(
            "The vote status for ",
            voteId,
            " is ",
            mapVoteStatus(vote.vote)
          );

          return prisma.votes.update({
            where: { id: voteId },
            data: { status: mapVoteStatus(vote.vote) },
          });
        });

      const updateResults = await Promise.all(updatePromises);

      return res.status(200).json({
        message: "Votes updated successfully",
        data: updateResults,
      });
    } catch (error) {
      console.error("Error updating votes:", error);
      return res.status(500).json({ message: "Something went wrong!" });
    }
  }
);

export default moreTestingRouter;
