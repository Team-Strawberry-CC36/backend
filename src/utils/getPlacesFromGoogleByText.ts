import dotenv from "dotenv";
dotenv.config();

export default async function getPlacesFromGoogleByText(searchText: string) {
  const apiKey = process.env.GOOGLE_API_KEY as string;

  const fields = [
    "id",
    "formattedAddress",
    "location",
    "googleMapsUri",
    "websiteUri",
    "regularOpeningHours",
    "photos",
  ];

  const uri = "https://places.googleapis.com/v1/places:searchText?";

  const formattedFields = fields.map((field) => "places." + field).join(",");

  const headerForGooglePlacesApi = {
    "Content-Type": "application/json",
    "X-Goog-FieldMask": formattedFields,
    "X-Goog-Api-Key": apiKey,
  };

  const foo = {
    textQuery: searchText,
  };

  const query = await fetch(uri, {
    method: "POST",
    headers: headerForGooglePlacesApi,
    body: JSON.stringify(foo),
  });
  return await query.json();
}
