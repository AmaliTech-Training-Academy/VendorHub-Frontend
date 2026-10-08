import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type * as AuthModule from "../lib/api/auth";

const apiUrl = "https://api.vendorhub.test";

describe("auth API functions", () => {
  let auth: typeof AuthModule;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_API_URL", apiUrl);
    vi.stubGlobal("fetch", vi.fn());
    auth = await import("../lib/api/auth");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("registers a vendor with the vendor endpoint and payload", async () => {
    const data = {
      email: "vendor@example.com",
      password: "secure-password",
      business_name: "Vendor Kitchen",
      owner_name: "Avery Owner",
    };
    const response = { id: 1, email: data.email, role: "VENDOR" };
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(response), { status: 201 }),
    );

    await expect(auth.registerVendor(data)).resolves.toEqual(response);

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/accounts/vendor/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  });

  it("registers an employee with the employee endpoint and payload", async () => {
    const data = {
      email: "employee@example.com",
      password: "secure-password",
      full_name: "Avery Employee",
    };
    const response = { id: 2, email: data.email, role: "EMPLOYEE" };
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(response), { status: 201 }),
    );

    await expect(auth.registerEmployee(data)).resolves.toEqual(response);

    expect(fetch).toHaveBeenCalledWith(
      `${apiUrl}/accounts/employee/register/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
  });

  it("logs in with the login endpoint and returns the token response", async () => {
    const data = { email: "user@example.com", password: "secure-password" };
    const response = {
      access: "access-token",
      refresh: "refresh-token",
      role: "EMPLOYEE",
    };
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(response), { status: 200 }),
    );

    await expect(auth.loginUser(data)).resolves.toEqual(response);

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/accounts/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  });

  it("joins validation details when the request fails", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({ detail: ["Email is taken.", "Try again."] }),
        {
          status: 400,
        },
      ),
    );

    await expect(
      auth.loginUser({ email: "user@example.com", password: "password" }),
    ).rejects.toThrow("Email is taken. Try again.");
  });

  it("uses a fallback message when the error response is not JSON", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response("not-json", { status: 500 }),
    );

    await expect(
      auth.loginUser({ email: "user@example.com", password: "password" }),
    ).rejects.toThrow("Something went wrong");
  });
});