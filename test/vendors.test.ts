import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { ContactDetailsCard } from "@/components/shared/layout/dashboard/ContactDetailsCard";
import { DeliveryDetailsCard } from "@/components/shared/layout/dashboard/DeliveryDetailsCard";
import { SlogansCard } from "@/components/shared/layout/dashboard/SlogansCard";
import { StorefrontImageCard } from "@/components/shared/layout/dashboard/StorefrontImageCard";
import { StoreIdentityCard } from "@/components/shared/layout/dashboard/StoreIdentityCard";
import {
  countVendorsInGroups,
  filterVendorGroups,
  groupVendorsByCategory,
  normalizeFeeRange,
} from "@/lib/vendors";
import type { Vendor } from "@/types/vendor";
import type { VendorProfileFormInput } from "@/types/vendorProfile";

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
  };
}

const sampleVendor: Vendor = {
  id: 42,
  name: "Corner Bakery",
  categories: ["Bakery"],
  deliveryFee: null,
  availableDays: ["MONDAY"],
  timeWindows: [
    { id: 1, label: "Morning", startTime: "09:00", endTime: "12:00" },
  ],
  slogans: [],
  address: null,
  phone: null,
};

function ContactDetailsHarness() {
  const { register } = useForm<VendorProfileFormInput>({
    defaultValues: {
      address: "Ridge Office Park",
      phone: "0241234567",
      slogans: [{ value: "Fresh from the oven" }],
    },
  });

  return createElement(ContactDetailsCard, { register, errors: {} });
}

function SlogansHarness() {
  const { control, register, formState } = useForm<VendorProfileFormInput>({
    defaultValues: {
      address: "Ridge Office Park",
      phone: "0241234567",
      slogans: [{ value: "Fresh from the oven" }],
    },
  });

  return createElement(SlogansCard, {
    control,
    register,
    errors: formState.errors,
  });
}

describe("standalone vendor profile cards", () => {
  it("renders the storefront image upload independently", () => {
    const markup = renderToStaticMarkup(
      createElement(StorefrontImageCard, {
        imagePreview: null,
        errors: {},
        onImageChange: () => undefined,
      }),
    );

    expect(markup).toContain("Storefront image");
    expect(markup).toContain('type="file"');
    expect(markup).toContain("Upload image");
  });

  it("renders registered contact fields independently", () => {
    const markup = renderToStaticMarkup(createElement(ContactDetailsHarness));

    expect(markup).toContain("Contact details");
    expect(markup).toContain('name="address"');
    expect(markup).toContain('name="phone"');
  });

  it("renders a standalone slogans field array", () => {
    const markup = renderToStaticMarkup(createElement(SlogansHarness));

    expect(markup).toContain("Slogans");
    expect(markup).toContain('name="slogans.0.value"');
    expect(markup).toContain("Add slogan");
  });

  it("renders store identity independently", () => {
    const markup = renderToStaticMarkup(
      createElement(StoreIdentityCard, {
        vendor: sampleVendor,
        email: "owner@example.com",
        isPending: false,
        isError: false,
      }),
    );

    expect(markup).toContain("Corner Bakery");
    expect(markup).toContain("owner@example.com");
    expect(markup).toContain("Bakery");
  });

  it("renders delivery details and handles an unavailable fee", () => {
    const markup = renderToStaticMarkup(
      createElement(DeliveryDetailsCard, {
        vendor: sampleVendor,
        isPending: false,
      }),
    );

    expect(markup).toContain("Delivery details");
    expect(markup).toContain("Not set");
    expect(markup).toContain("Mon");
    expect(markup).toContain("Morning");
  });
});

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
