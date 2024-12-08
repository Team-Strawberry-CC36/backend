import { PlaceType } from "@prisma/client";
import type { IEtiquettePerPlace } from "./Etiquette";
import type IExperience from "./Experience";

export interface IPlace {
  id: number;
  googlePlaceId: string;
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

export type IPlaceType = "shrine" | "onsen" | "restaurant";

interface IPhoto {
  id: number;
  fileData: string;
  metadata: {
    createdAt: string;
    authorName: string;
  };
}
