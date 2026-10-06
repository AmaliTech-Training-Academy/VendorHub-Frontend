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

  it("normalizes a vendor profile response for the identity and form UI", () => {
    const profile = vendorProfileResponseSchema.parse({
      id: 42,
      business_name: "Corner Bakery",
      email: "owner@example.com",
      address: null,
      phone: null,
      categories: null,
      delivery_fee: null,
      available_days: null,
      delivery_windows: null,
      storefront_image: null,
      slogans: null,
    });

    expect(profile).toMatchObject({
      id: 42,
      name: "Corner Bakery",
      email: "owner@example.com",
      address: "",
      phone: "",
      categories: [],
      deliveryFee: null,
      availableDays: [],
      timeWindows: [],
      storefrontImageUrl: null,
      slogans: [],
    });
  });
});
