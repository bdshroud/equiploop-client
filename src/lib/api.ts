let memoryJwt: string | null = null;
let memoryJwtExpiresAt = 0;

// Resolve API base URL whether NEXT_PUBLIC_API_URL includes "/api" or not
const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE_URL = rawUrl.endsWith("/api")
  ? rawUrl
  : `${rawUrl.replace(/\/+$/, "")}/api`;

/**
 * Retrieves the current user's Better Auth JWT token.
 * Better Auth with jwt() plugin provides an authenticated GET /api/auth/token endpoint.
 */
export async function getJwtToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }

  // Return cached token if valid (cache for 5 minutes)
  if (memoryJwt && Date.now() < memoryJwtExpiresAt) {
    return memoryJwt;
  }

  // Check sessionStorage fallback
  try {
    const stored = window.sessionStorage.getItem("equiploop_jwt_token");
    const storedExp = window.sessionStorage.getItem("equiploop_jwt_exp");
    if (stored && storedExp && Date.now() < Number(storedExp)) {
      memoryJwt = stored;
      memoryJwtExpiresAt = Number(storedExp);
      return stored;
    }
  } catch {
    // Ignore sessionStorage errors
  }

  try {
    const res = await fetch("/api/auth/token", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.token) {
        memoryJwt = data.token;
        memoryJwtExpiresAt = Date.now() + 5 * 60 * 1000; // 5 min TTL
        try {
          window.sessionStorage.setItem("equiploop_jwt_token", data.token);
          window.sessionStorage.setItem("equiploop_jwt_exp", String(memoryJwtExpiresAt));
        } catch {
          // ignore
        }
        return data.token;
      }
    }
  } catch (err) {
    console.warn("[EquipLoop] Failed to fetch JWT token from auth endpoint:", err);
  }

  return null;
}

export function clearCachedJwtToken(): void {
  memoryJwt = null;
  memoryJwtExpiresAt = 0;
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem("equiploop_jwt_token");
      window.sessionStorage.removeItem("equiploop_jwt_exp");
    } catch {
      // ignore
    }
  }
}

export async function getAuthHeader(): Promise<Record<string, string>> {
  const token = await getJwtToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${path}`;
  const authHeader = await getAuthHeader();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...authHeader,
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `API error: ${response.status} ${response.statusText}`);
  }

  return data;
}
