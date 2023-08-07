import { createURL } from "./apiUtils";

export async function fetcher(
  endpoint: string,
  accessToken: string | null,
  data: object,
  onError: (error: any) => void
) {
  const url = createURL(endpoint);
  let headers = new Headers();
  headers.append("Content-Type", "application/json");

  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    const readableResponse = await response.json();

    console.log(readableResponse);

    if (!response.ok) {
      throw readableResponse;
    } else {
      return readableResponse;
    }
  } catch (error) {
    onError(error);
  }
}
