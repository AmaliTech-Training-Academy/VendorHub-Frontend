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
        slogans: null,
        address: null,
        phone: null,
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
    });
  });

  it("keeps address and phone as trimmed strings when provided", () => {
    const vendor = vendorSchema.parse({
      id: 1,
      business_name: "Vendor Kitchen",
      categories: null,
      delivery_fee: null,
      available_days: null,
      delivery_windows: null,
      slogans: null,
      address: "  Ridge Office Park  ",
      phone_number: "0241234567",
    });

    expect(vendor.address).toBe("Ridge Office Park");
    expect(vendor.phone).toBe("0241234567");
  });
});
