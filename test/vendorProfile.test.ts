import { describe, expect, it } from "vitest";
import { vendorProfileSchema } from "@/schemas/vendorProfile";

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

  it("rejects blank slogans", () => {
    const result = vendorProfileSchema.safeParse({
      address: "Ridge Office Park",
      phone: "0241234567",
      slogans: [{ value: "   " }],
    });

    expect(result.success).toBe(false);
  });
});
