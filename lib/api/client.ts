import { useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type QueryValue = string | number | boolean | undefined;

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const baseUrl = API_URL?.replace(/\/+$/, "") ?? "";
  const cleanPath = path.replace(/^\/+/, "");
  const url = new URL(`${baseUrl}/${cleanPath}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function parseErrorMessage(res: Response): Promise<string> {
  const errorBody = await res.json().catch(() => null);
  if (Array.isArray(errorBody?.detail)) return errorBody.detail.join(" ");
  if (typeof errorBody?.detail === "string") return errorBody.detail;
  return "Something went wrong";
}

export type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** Attach the logged-in user's bearer token. Every endpoint needs this
   *  except registration and login themselves. Defaults to true. */
  auth?: boolean;
};

/**
 * Shared fetch wrapper for every real (non-mock) API call: joins the base
 * URL and path regardless of trailing slashes, attaches the Authorization
 * header when authenticated, and normalizes DRF-style error bodies into a
 * single Error message the same way the original auth-only client did.
 */
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, query, auth = true } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = useAuthStore.getState().accessToken;
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }

  // DELETE (204) and other empty-body responses have nothing to parse.
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}
