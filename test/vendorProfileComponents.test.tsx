import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { ContactDetailsCard } from "@/components/shared/layout/dashboard/ContactDetailsCard";
import { DeliveryDetailsCard } from "@/components/shared/layout/dashboard/DeliveryDetailsCard";
import { SlogansCard } from "@/components/shared/layout/dashboard/SlogansCard";
import { StorefrontImageCard } from "@/components/shared/layout/dashboard/StorefrontImageCard";
import { StoreIdentityCard } from "@/components/shared/layout/dashboard/StoreIdentityCard";
import type { Vendor } from "@/types/vendor";
import type { VendorProfileFormInput } from "@/types/vendorProfile";

const vendor: Vendor = {
  id: 42,
  name: "Corner Bakery",
  categories: ["Bakery"],
  deliveryFee: null,
  availableDays: ["MONDAY"],
  timeWindows: [
    { id: 1, label: "Morning", startTime: "09:00", endTime: "12:00" },
  ],
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
        vendor,
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
      createElement(DeliveryDetailsCard, { vendor, isPending: false }),
    );

    expect(markup).toContain("Delivery details");
    expect(markup).toContain("Not set");
    expect(markup).toContain("Mon");
    expect(markup).toContain("Morning");
  });
});
