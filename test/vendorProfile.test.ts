import { describe, expect, it } from "vitest";

import {
  vendorProfileResponseSchema,
  vendorProfileSchema,
} from "@/schemas/vendorProfile";

describe("vendorProfileSchema", () => {
  it("accepts trimmed contact data and slogan rows", () => {
    const result = vendorProfileSchema.parse({
      address: "  Ridge Office Park  ",
      phone: "  0241234567  ",
      slogans: [{ value: "  Fresh from the oven  " }],
    });

    expect(result.address).toBe("Ridge Office Park");
    expect(result.phone).toBe("0241234567");
    expect(result.slogans).toEqual([{ value: "Fresh from the oven" }]);
  });

  it("lets a vendor save contact details without any slogans", () => {
    const result = vendorProfileSchema.safeParse({
      address: "Ridge Office Park",
      phone: "0241234567",
      slogans: [],
    });

    expect(result.success).toBe(true);
  });

  it("rejects blank slogans", () => {
    const result = vendorProfileSchema.safeParse({
      address: "Ridge Office Park",
      phone: "0241234567",
      slogans: [{ value: "   " }],
    });

    expect(result.success).toBe(false);
  });

  it("normalizes an empty storefront response for the identity and form UI", () => {
    const profile = vendorProfileResponseSchema.parse({
      address: null,
      phone_number: null,
      slogan: null,
      logo: null,
    });

    expect(profile).toEqual({
      address: "",
      phone: "",
      slogans: [],
      storefrontImageUrl: null,
    });
  });

  it("maps storefront response fields to the profile shape", () => {
    const profile = vendorProfileResponseSchema.parse({
      address: "Ridge Office Park",
      phone_number: "0241234567",
      slogan: "Fresh from the oven",
      logo: "https://example.com/logo.png",
    });

    expect(profile).toEqual({
      address: "Ridge Office Park",
      phone: "0241234567",
      slogans: ["Fresh from the oven"],
      storefrontImageUrl: "https://example.com/logo.png",
    });
  });
});
