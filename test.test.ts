import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Auth API flow", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_API_URL = "https://example.com/";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  const loadAuthApi = async () => await import("./lib/api/auth");

  it("registerVendor posts vendor registration data to the correct endpoint", async () => {
    const { registerVendor } = await loadAuthApi();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access: "vendor-access-token",
        refresh: "vendor-refresh-token",
        role: "VENDOR",
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await registerVendor({
      email: "vendor@example.com",
      password: "strongpass123",
      business_name: "Akosua Kitchen",
      owner_name: "Akosua Boateng",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/accounts/vendor/register/",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "vendor@example.com",
          password: "strongpass123",
          business_name: "Akosua Kitchen",
          owner_name: "Akosua Boateng",
        }),
      }),
    );

    expect(result).toMatchObject({
      role: "VENDOR",
      access: "vendor-access-token",
      refresh: "vendor-refresh-token",
    });
  });

  it("registerEmployee posts employee registration data to the correct endpoint", async () => {
    const { registerEmployee } = await loadAuthApi();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access: "employee-access-token",
        refresh: "employee-refresh-token",
        role: "EMPLOYEE",
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await registerEmployee({
      email: "employee@example.com",
      password: "strongpass123",
      full_name: "Ama Mensah",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/accounts/employee/register/",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "employee@example.com",
          password: "strongpass123",
          full_name: "Ama Mensah",
        }),
      }),
    );

    expect(result).toMatchObject({
      role: "EMPLOYEE",
      access: "employee-access-token",
      refresh: "employee-refresh-token",
    });
  });

  it("loginUser posts login credentials and returns the token payload", async () => {
    const { loginUser } = await loadAuthApi();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access: "login-access-token",
        refresh: "login-refresh-token",
        role: "VENDOR",
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await loginUser({
      email: "vendor@example.com",
      password: "strongpass123",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/accounts/login/",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "vendor@example.com",
          password: "strongpass123",
        }),
      }),
    );

    expect(result).toMatchObject({
      role: "VENDOR",
      access: "login-access-token",
      refresh: "login-refresh-token",
    });
  });

  it("throws a readable error when the API responds with a failure", async () => {
    const { loginUser } = await loadAuthApi();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ detail: "Invalid credentials" }),
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(
      loginUser({
        email: "wrong@example.com",
        password: "wrongpass",
      }),
    ).rejects.toThrow("Invalid credentials");
  });
});
