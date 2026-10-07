import { apiRequest } from "@/lib/api/client";
import {
  deliverySettingsResponseSchema,
  toDeliverySettingsPayload,
} from "@/schemas/deliverySettingsSchema";
import { paginatedSchema } from "@/schemas/paginationSchema";
import { vendorProfileResponseSchema } from "@/schemas/vendorProfile";
import { vendorSchema } from "@/schemas/vendorSchema";
import type {
  DeliverySettings,
  DeliverySettingsFormValues,
} from "@/types/deliverySettings";
import type { Vendor } from "@/types/vendor";
import type {
  VendorProfile,
  VendorProfileFormValues,
} from "@/types/vendorProfile";

const vendorListResponseSchema = paginatedSchema(vendorSchema);

/**
 * GET /api/vendors/. There's no single-vendor detail endpoint, so
 * fetchVendorById (below) fetches this same list and finds the match.
 * page_size is set high since there's no vendor list/detail split to page
 * through in the UI yet — worth revisiting if the vendor count grows.
 */
export async function fetchVendors(): Promise<Vendor[]> {
  const raw = await apiRequest<unknown>("vendors/", {
    query: { page_size: 100 },
  });
  return vendorListResponseSchema.parse(raw).results;
}

export async function fetchVendorById(
  vendorId: string,
): Promise<Vendor | undefined> {
  const vendors = await fetchVendors();
  return vendors.find((vendor) => String(vendor.id) === vendorId);
}

/** GET /api/vendors/me/delivery-settings/. Vendor identity comes from the
 *  JWT, not a path param, so there's no vendorId argument here. */
export async function fetchDeliverySettings(): Promise<DeliverySettings> {
  const raw = await apiRequest<unknown>("vendors/me/delivery-settings/");
  return deliverySettingsResponseSchema.parse(raw);
}

export async function updateDeliverySettings(
  input: DeliverySettingsFormValues,
): Promise<DeliverySettings> {
  const raw = await apiRequest<unknown>("vendors/me/delivery-settings/", {
    method: "PUT",
    body: toDeliverySettingsPayload(input),
  });
  return deliverySettingsResponseSchema.parse(raw);
}

/** GET /api/vendors/me/profile/. The vendor is identified by the JWT. */
export async function fetchVendorProfile(): Promise<VendorProfile> {
  const raw = await apiRequest<unknown>("vendors/me/profile/");
  return vendorProfileResponseSchema.parse(raw);
}

/** PATCH /api/vendors/me/profile/. FormData lets the browser set the multipart boundary. */
export async function updateVendorProfile(
  input: VendorProfileFormValues,
): Promise<VendorProfile> {
  const body = new FormData();
  body.append("address", input.address);
  body.append("phone", input.phone);
  input.slogans.forEach((slogan) => {
    body.append("slogans", slogan.value);
  });
  if (input.storefrontImage) {
    body.append("storefront_image", input.storefrontImage);
  }

  const raw = await apiRequest<unknown>("vendors/me/profile/", {
    method: "PATCH",
    body,
  });
  return vendorProfileResponseSchema.parse(raw);
}
