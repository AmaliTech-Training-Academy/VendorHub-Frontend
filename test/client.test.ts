import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type * as ClientModule from "../lib/api/client";

const apiUrl = "https://api.vendorhub.test";

describe("apiRequest error messages", () => {
  let apiRequest: typeof ClientModule.apiRequest;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_API_URL", apiUrl);
    vi.stubGlobal("fetch", vi.fn());
    ({ apiRequest } = await import("../lib/api/client"));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  async function messageFor(status: number, body: unknown) {
    vi.mocked(fetch).mockResolvedValue(
      new Response(typeof body === "string" ? body : JSON.stringify(body), { status }),
    );
    return apiRequest("x/", { method: "POST", body: {} }).then(
      () => "no error",
      (err: unknown) => (err as Error).message,
    );
  }

  it("reads a string detail", async () => {
    expect(await messageFor(401, { detail: "No active account found." })).toBe(
      "No active account found.",
    );
  });

  it("joins a detail list", async () => {
    expect(await messageFor(400, { detail: ["First.", "Second."] })).toBe("First. Second.");
  });

  it("uses only detail when auth errors add code/messages", async () => {
    expect(
      await messageFor(401, {
        detail: "Given token not valid for any token type",
        code: "token_not_valid",
        messages: [{ token_class: "AccessToken", token_type: "access", message: "expired" }],
      }),
    ).toBe("Given token not valid for any token type");
  });

  it("labels field errors and groups messages per field", async () => {
    expect(
      await messageFor(400, {
        email: ["user with this email already exists."],
        password: ["This password is too short.", "This password is too common."],
      }),
    ).toBe(
      "Email: user with this email already exists. Password: This password is too short. This password is too common.",
    );
  });

  it("humanizes snake_case field names", async () => {
    expect(await messageFor(400, { delivery_date: ["This field is required."] })).toBe(
      "Delivery date: This field is required.",
    );
  });

  it("leaves non_field_errors unlabelled", async () => {
    expect(await messageFor(400, { non_field_errors: ["Vendor is inactive."] })).toBe(
      "Vendor is inactive.",
    );
  });

  it("reads nested list-serializer errors and skips the empty entries", async () => {
    expect(
      await messageFor(400, {
        items: [{}, { quantity: ["Ensure this value is less than or equal to 100."] }],
      }),
    ).toBe("Items quantity: Ensure this value is less than or equal to 100.");
  });

  it("reads a bare array or string body", async () => {
    expect(await messageFor(400, ["Bad request."])).toBe("Bad request.");
    expect(await messageFor(400, JSON.stringify("Nope."))).toBe("Nope.");
  });

  it("falls back for non-JSON, empty and message-less bodies", async () => {
    expect(await messageFor(500, "<html>Server Error</html>")).toBe("Something went wrong");
    expect(await messageFor(400, {})).toBe("Something went wrong");
    expect(await messageFor(400, { count: 3, ok: false })).toBe("Something went wrong");
  });
});
