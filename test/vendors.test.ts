import { describe, expect, it } from "vitest";

import {
  countVendorsInGroups,
  filterVendorGroups,
  groupVendorsByCategory,
  normalizeFeeRange,
} from "@/lib/vendors";
import type { Vendor } from "@/types/vendor";

function makeVendor(
  id: number,
  category: string,
  deliveryFee: number | null,
): Vendor {
  return {
    id,
    name: `Vendor ${id}`,
    categories: [category],
    deliveryFee,
    availableDays: [],
    timeWindows: [],
    slogans: [],
    address: null,
    phone: null,
    storefrontImageUrl: null,
  };
}

describe("filterVendorGroups", () => {
  const groups = groupVendorsByCategory([
    makeVendor(1, "Groceries", 2.25),
    makeVendor(2, "Groceries", 5.5),
    makeVendor(3, "Bakery", 8),
    makeVendor(4, "Bakery", null),
  ]);

  it("includes fees on both range boundaries and excludes fees outside them", () => {
    const filtered = filterVendorGroups(groups, null, {
      minimum: 2.25,
      maximum: 5.5,
    });

    expect(
      filtered.flatMap((group) => group.vendors.map((vendor) => vendor.id)),
    ).toEqual([1, 2]);
  });

  it("combines category and fee filters and omits empty groups", () => {
    const filtered = filterVendorGroups(groups, "Bakery", {
      minimum: 0,
      maximum: 8,
    });

    expect(filtered).toEqual([
      { category: "Bakery", vendors: [makeVendor(3, "Bakery", 8)] },
    ]);
  });

  it("keeps vendors with unknown fees until a fee range is applied", () => {
    const unfiltered = filterVendorGroups(groups, null, null);
    const feeFiltered = filterVendorGroups(groups, null, {
      minimum: 0,
      maximum: 10,
    });

    expect(unfiltered.flatMap((group) => group.vendors)).toHaveLength(4);
    expect(feeFiltered.flatMap((group) => group.vendors)).toHaveLength(3);
  });

  it("counts vendors across all groups or within one category", () => {
    expect(countVendorsInGroups(groups)).toBe(4);
    expect(countVendorsInGroups(groups, "Bakery")).toBe(2);
  });
});

describe("normalizeFeeRange", () => {
  it("treats the full span as no filter, so unpriced vendors stay visible", () => {
    expect(normalizeFeeRange({ minimum: 0, maximum: 8 }, 8)).toBeNull();
  });

  it("keeps a narrower range", () => {
    expect(normalizeFeeRange({ minimum: 2, maximum: 8 }, 8)).toEqual({
      minimum: 2,
      maximum: 8,
    });
    expect(normalizeFeeRange({ minimum: 0, maximum: 5 }, 8)).toEqual({
      minimum: 0,
      maximum: 5,
    });
  });
});
