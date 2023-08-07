export const API_URL =
  // process.env.NODE_ENV === "development"
  //   ? "http://172.20.10.2:8001/api/v1"
  "http://68.183.214.133:8001/api/v1";

/** Creates a complete URL to the API
 * @param path The path to the API endpoint. For example, `/users/login`
 */
export function createURL(path: string) {
  return `${API_URL}${path}`;
}

export const verifyToken = async (token: string) => {
  const url = createURL("/auth/jwt/verify/");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ token }),
  });

  const json = await response.text();
  console.log(json);

  if (response.ok) {
    return true;
  }

  return false;
};

export const refreshAccessToken = async (refresh: string) => {
  const url = createURL("/auth/jwt/refresh/");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (response.ok) {
    const json = await response.json();
    return json.access;
  }

  return null;
};
