// Interface from notion/schema.
// This information is gonna be used for the client.

interface IPlace {
  id: number;
  name: string;
  address: string;
  placeType: IPlaceType;
  location: {
    latitude: number;
    longitude: number;
  };
  etiquettes?: IEtiquettePerPlace[];
  experiences?: IExperience[];
  photos?: IPhoto[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

interface IExperience {
  id: number;
  username: string;
  dateVisited: Date;
  experience: string;
  etiquettes: IEtiquettePerExperience[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

interface IPhoto {
  id: number;
  fileData: string;
  metadata: {
    createdAt: string;
    authorName: string;
  };
}

type IPlaceType = "shrine" | "onsen" | "restaurant";

export enum PlaceType {
  shrine = "SHRINE",
  onsen = "ONSEN",
  restaurant = "RESTAURANT",
}

interface IEtiquette {
  id: number;
  label: string;
}

interface IEtiquettePerPlace extends IEtiquette {
  status: EtiquetteStatus;
}

interface IEtiquettePerExperience extends IEtiquette {}

type EtiquetteStatus = "allowed" | "not-allowed";

interface IEtiquetteVotes {
  etiquetteId: number;
  etiquetteType: string;
  numberOfVotesForAllowed: number;
  numberOfVotesForNotAllowed: number;
}

interface IEtiquetteUsersVote {
  etiquetteId: number;
  etiquetteType: string;
  vote: EtiquetteStatus;
}

interface IPlaceEtiquetteVotesAlias {
  placeId: number;
  userId: string | undefined;
  userHasVoted: boolean;
  etiquetteVotes: IEtiquetteVotes[];
  usersVote: IEtiquetteUsersVote[];
}

interface ApiResponseEtiquetteVotes<T> {
  message: string;
  data: T;
}

export type IPlaceEtiquetteVotes =
  ApiResponseEtiquetteVotes<IPlaceEtiquetteVotesAlias>;

export { IPlaceType, IPlace, IEtiquettePerPlace, IExperience, IEtiquetteVotes };
