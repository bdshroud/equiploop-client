import { authClient } from "./auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getAuthHeader(): Promise<Record<string, string>> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    // If authClient has getJwtToken or jwt plugin method
    // In Better Auth client with jwtClient plugin, authClient.getJwtToken() or token from cookie/session
    // @ts-ignore
    const token = await authClient.getJwtToken?.();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch (err) {
    console.warn("Could not retrieve JWT token via getJwtToken:", err);
  }

  return {};
}

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const authHeader = await getAuthHeader();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...authHeader,
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `API error: ${response.status} ${response.statusText}`);
  }

  return data;
}
