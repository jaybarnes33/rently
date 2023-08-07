import * as SecureStore from "expo-secure-store";
import { createURL, refreshAccessToken, verifyToken } from "./apiUtils";

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

const getTokens = async (): Promise<{
  access: string | null;
  refresh: string | null;
}> => {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  const refreshToken = await SecureStore.getItemAsync("refreshToken");

  return { access: accessToken, refresh: refreshToken };
};

const setTokens = async (access: string, refresh: string): Promise<void> => {
  await SecureStore.setItemAsync("accessToken", access);
  await SecureStore.setItemAsync("refreshToken", refresh);
};

export const makeSecuredRequest = async (
  path: string,
  options: RequestOptions = {}
): Promise<any> => {
  const tokens = await getTokens();

  const url = createURL(path);

  // Verify the current access token
  const isAccessTokenValid = tokens.access
    ? await verifyToken(tokens.access)
    : false;

  let accessToken = tokens.access;

  if (!isAccessTokenValid && tokens.refresh) {
    // If the access token is not valid, attempt to refresh it
    const newAccessToken = await refreshAccessToken(tokens.refresh);

    if (newAccessToken) {
      accessToken = newAccessToken;
      await setTokens(newAccessToken, tokens.refresh); // save new access token to secure storage
    } else {
      throw new Error("Unable to refresh access token");
    }
  }

  // Add the Authorization header to the request
  options.headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await fetch(url, options);

  if (response.ok) {
    const data = await response.json();

    return data;
  } else {
    throw new Error("Request failed: " + response.status);
  }
};
