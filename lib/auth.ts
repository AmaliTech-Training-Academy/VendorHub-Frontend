import type { UserRole } from "@/types/types";

export function homePathForRole(role: UserRole): string {
  return role === "VENDOR" ? "/dashboard/products" : "/storefront";
}

export function isAccessTokenExpired(accessToken: string): boolean {
  try {
    const encodedPayload = accessToken.split(".")[1];
    if (!encodedPayload) {
      return true;
    }

    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded = atob(paddedBase64);
    const bytes = Uint8Array.from(decoded, (character) => character.charCodeAt(0));
    const payload: unknown = JSON.parse(new TextDecoder().decode(bytes));

    return (
      !payload ||
      typeof payload !== "object" ||
      !("exp" in payload) ||
      typeof payload.exp !== "number" ||
      payload.exp <= Date.now() / 1000
    );
  } catch {
    return true;
  }
}
