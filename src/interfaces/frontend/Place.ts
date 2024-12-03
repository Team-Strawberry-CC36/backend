import type { IEtiquettePerPlace } from './Etiquette';
import type IExperience from './Experience';

export default interface IPlace {
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

type IPlaceType = 'shrine' | 'onsen' | 'restaurant';

interface IPhoto {
  id: number;
  fileData: string;
  metadata: {
    createdAt: string;
    authorName: string;
  };
}
