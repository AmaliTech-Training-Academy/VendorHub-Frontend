import { useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type QueryValue = string | number | boolean | undefined;

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const baseUrl = API_URL?.replace(/\/+$/, "") ?? "";
  const cleanPath = path.replace(/^\/+/, "");
  const url = new URL(`${baseUrl}/${cleanPath}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {url.searchParams.set(key, String(value));}
    }
  }
  return url.toString();
}

const GENERIC_ERROR = "Something went wrong";

/** DRF puts these at the top level without naming a field. */
const UNLABELLED_KEYS = new Set(["detail", "non_field_errors"]);

function humanizeField(path: string[]): string {
  const text = path.join(" ").replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Walks DRF's nested error shapes, collecting string leaves under their field path. */
function collectMessages(value: unknown, path: string[], out: Map<string, string[]>) {
  if (typeof value === "string") {
    const label = humanizeField(path);
    out.set(label, [...(out.get(label) ?? []), value]);
  } else if (Array.isArray(value)) {
    for (const item of value) {collectMessages(item, path, out);}
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      collectMessages(item, UNLABELLED_KEYS.has(key) ? path : [...path, key], out);
    }
  }
}

/**
 * Turns a DRF error body into one readable message: {"detail": "..."},
 * {"detail": ["..."]}, and field errors like {"email": ["..."]} (including
 * nested list-serializer errors) all come out as text. When `detail` is
 * present it wins, since auth errors add extra keys ("code", "messages")
 * that aren't meant for the user.
 */
async function parseErrorMessage(res: Response): Promise<string> {
  const errorBody: unknown = await res.json().catch(() => null);
  const source =
    errorBody && typeof errorBody === "object" && "detail" in errorBody
      ? errorBody.detail
      : errorBody;

  const grouped = new Map<string, string[]>();
  collectMessages(source, [], grouped);

  const parts = [...grouped].map(([label, messages]) =>
    label ? `${label}: ${messages.join(" ")}` : messages.join(" "),
  );
  return parts.join(" ") || GENERIC_ERROR;
}

export type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** Attach the logged-in user's bearer token. Every endpoint needs this
   *  except registration and login themselves. Defaults to true. */
  auth?: boolean;
};


export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, query, auth = true } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) {headers["Content-Type"] = "application/json"};
  let accessToken: string | null = null;
  if (auth) {
    accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {headers["Authorization"] = `Bearer ${accessToken}`};
  }

  const res = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    if (
      res.status === 401 &&
      accessToken &&
      useAuthStore.getState().accessToken === accessToken
    ) {
      useAuthStore.getState().logout();
    }
    throw new Error(await parseErrorMessage(res));
  }

  // DELETE (204) and other empty-body responses have nothing to parse.
  if (res.status === 204) {return undefined as T;}
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}
