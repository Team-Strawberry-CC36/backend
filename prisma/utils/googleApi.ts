export default class GoogleApi {
  private placesApiURL = "https://places.googleapis.com/v1/places:searchText";
  private apiKey!: string;

  constructor(apiKey: string | undefined) {
    // Validation in the constructor.
    if (typeof apiKey !== "string") {
      throw new Error("Google Api kwey must be a value");
    }
    this.apiKey = apiKey;
  }

  async textSearch(textQuery: string): Promise<any> {
    const fields = [
      "id",
      "formattedAddress",
      "location",
      "googleMapsUri",
      "websiteUri",
      "regularOpeningHours",
      "photos",
    ];

    const formattedFields = fields.map((field) => "places." + field).join(",");

    const headerForGooglePlacesApi = {
      "Content-Type": "application/json",
      "X-Goog-FieldMask": formattedFields,
      "X-Goog-Api-Key": this.apiKey as string,
    };

    // Validate textQuery typo
    const searchcontent: {
      textQuery: string;
    } = {
      textQuery,
    };

    const query = await fetch(this.placesApiURL, {
      method: "POST",
      headers: headerForGooglePlacesApi,
      body: JSON.stringify(searchcontent),
    }).then((res) => {
      return res.json();
    });

    if ("error" in query) {
      console.log(query.error);
    }

    console.log(query);

    return query;
  }

  // Not implemented
  async photoByPlace(url: any): Promise<unknown> {
    return 0;
  }
}
