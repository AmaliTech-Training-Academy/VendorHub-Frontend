import { describe, expect, it } from "vitest";

import { UserRole } from "@/types/types";

import { homePathForRole, isAccessTokenExpired } from "../lib/auth";

function tokenWithExpiry(exp: number): string {
  const payload = btoa(JSON.stringify({ exp }))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `header.${payload}.signature`;
}

describe("auth routing", () => {
  it("uses the correct landing route for each role", () => {
    expect(homePathForRole(UserRole.VENDOR)).toBe("/dashboard/products");
    expect(homePathForRole(UserRole.EMPLOYEE)).toBe("/storefront");
  });

  it("recognizes expired and active JWT access tokens", () => {
    const now = Date.now() / 1000;
    expect(isAccessTokenExpired(tokenWithExpiry(now - 1))).toBe(true);
    expect(isAccessTokenExpired(tokenWithExpiry(now + 60))).toBe(false);
  });

  it("treats malformed or missing-expiry tokens as expired", () => {
    expect(isAccessTokenExpired("not-a-jwt")).toBe(true);
    expect(
      isAccessTokenExpired(
        `header.${btoa(JSON.stringify({ sub: "user" }))}.signature`,
      ),
    ).toBe(true);
  });
});
