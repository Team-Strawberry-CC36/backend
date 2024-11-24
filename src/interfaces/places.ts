// Interface from notion/schema.
// This information is gonna be used for the client.
interface Place {
  id: number;
  name: string;
  address: string;
  generalInfo: "";
  placeType: PlaceType;
  location: {
    latitude: number;
    longitude: number;
  };
  etiquettes: Etiquette[];
  experiences: Experience[];
  photos: Photo[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

interface Etiquette {
  id: number;
  label: string;
}

interface Photo {
  id: number;
  fileData: string;
  metadata: {
    createdAt: string;
    authorName: string;
  };
}

interface Experience {
  id: number;
  placeId: number;
  userId: number;
  experience: string;
  experienceType: string;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

type PlaceType = "shrine" | "onsen" | "restaurant";
