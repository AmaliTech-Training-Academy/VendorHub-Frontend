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
      }),
    ).toEqual({
      id: 1,
      name: "Vendor Kitchen",
      categories: [],
      deliveryFee: null,
      availableDays: [],
      timeWindows: [],
    });
  });
});
