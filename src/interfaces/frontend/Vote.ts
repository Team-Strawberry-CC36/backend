import type { IEtiquetteStatus } from "./Etiquette";

// This rules anyone else
export interface VotesPerPlace {
  placeId: number;
  userId: string | undefined;
  userHasVoted: boolean;
  etiquetteVotes: IEtiquetteVotes[];
  usersVote: IEtiquetteUsersVote[];
}

export interface IEtiquetteVotes {
  etiquetteId: number;
  etiquetteType: string;
  numberOfVotesForAllowed: number;
  numberOfVotesForNotAllowed: number;
}

export interface IEtiquetteUsersVote {
  etiquetteId: number;
  etiquetteType: string;
  vote: IEtiquetteStatus;
}
