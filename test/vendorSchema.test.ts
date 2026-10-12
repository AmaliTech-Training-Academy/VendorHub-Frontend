import { describe, expect, it } from "vitest";

import { vendorSchema } from "@/schemas/vendorSchema";

describe("vendorSchema", () => {
  it("accepts null optional vendor details and normalizes them for display", () => {
    expect(
      vendorSchema.parse({
        id: 1,
        business_name: "Vendor Kitchen",
        categories: null,
        delivery_fee: null,
        available_days: null,
        delivery_windows: null,
        storefront: null,
      }),
    ).toEqual({
      id: 1,
      name: "Vendor Kitchen",
      categories: [],
      deliveryFee: null,
      availableDays: [],
      timeWindows: [],
      slogans: [],
      address: null,
      phone: null,
      storefrontImageUrl: null,
    });
  });

  it("reads trimmed storefront details when provided", () => {
    const vendor = vendorSchema.parse({
      id: 1,
      business_name: "Vendor Kitchen",
      categories: null,
      delivery_fee: null,
      available_days: null,
      delivery_windows: null,
      storefront: {
        address: "  Ridge Office Park ",
        phone_number: " 0241234567 ",
        slogan: "Fresh from the oven",
        logo: "https://example.com/logo.png",
      },
    });

    expect(vendor.address).toBe("Ridge Office Park");
    expect(vendor.phone).toBe("0241234567");
    expect(vendor.slogans).toEqual(["Fresh from the oven"]);
    expect(vendor.storefrontImageUrl).toBe("https://example.com/logo.png");
  });
});
