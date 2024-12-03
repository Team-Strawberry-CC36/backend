import type { IEtiquettePerExperience } from "./Etiquette";

export default interface IExperience {
  id: number;
  username: string;
  dateVisited: Date;
  //
  experience: string;
  helpfulness: number;
  etiquettes: IEtiquettePerExperience[];
  //
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}
