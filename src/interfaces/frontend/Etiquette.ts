interface IEtiquette {
  id: number;
  label: string;
}

export interface IEtiquettePerPlace extends IEtiquette {
  status: IEtiquetteStatus;
}

export type IEtiquettePerExperience = IEtiquette;

export type IEtiquetteStatus = "allowed" | "not-allowed" | undefined;
