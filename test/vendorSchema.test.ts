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
      }),
    ).toEqual({
      id: 1,
      name: "Vendor Kitchen",
      categories: [],
      deliveryFee: null,
      availableDays: [],
      timeWindows: [],
      slogans: [],
    });
  });

  it("preserves vendor-provided slogans when present", () => {
    const vendor = vendorSchema.parse({
      id: 2,
      business_name: "Corner Bakery",
      categories: ["Bakery"],
      delivery_fee: "2.50",
      available_days: ["MONDAY"],
      delivery_windows: [],
      slogans: ["Fresh from the oven", "Made for your break"],
    });

    expect(vendor.slogans).toEqual([
      "Fresh from the oven",
      "Made for your break",
    ]);
  });
});
