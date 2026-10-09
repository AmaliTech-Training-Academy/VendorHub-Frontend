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
 * fetchVendorById fetches this same list and finds the match.
 */
export async function fetchVendors(): Promise<Vendor[]> {
  const raw = await apiRequest<unknown>("vendors/", {
    query: { page_size: 100 },
  });

  const parsed = vendorListResponseSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("VENDOR LIST PARSE FAILED:", parsed.error.issues);
    console.error("RAW RESPONSE WAS:", raw);
    throw parsed.error;
  }
  return parsed.data.results;
}

export async function fetchVendorById(
  vendorId: string,
): Promise<Vendor | undefined> {
  const vendors = await fetchVendors();
  return vendors.find((vendor) => String(vendor.id) === vendorId);
}

/** GET /api/vendors/me/delivery-settings/. Vendor identity comes from the JWT. */
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

/** GET /api/vendors/me/storefront/ */
export async function fetchVendorProfile(): Promise<VendorProfile> {
  const raw = await apiRequest<unknown>("vendors/me/storefront/");
  return vendorProfileResponseSchema.parse(raw);
}

/** PATCH /api/vendors/me/storefront/ */
export async function updateVendorProfile(
  input: VendorProfileFormValues,
): Promise<VendorProfile> {
  const body = new FormData();
  body.append("address", input.address);
  body.append("phone_number", input.phone);
  body.append("slogan", input.slogans[0]?.value ?? ""); // backend has ONE slogan
  if (input.storefrontImage) {
    body.append("logo", input.storefrontImage); // backend field is "logo"
  }

  const raw = await apiRequest<unknown>("vendors/me/storefront/", {
    method: "PATCH",
    body,
  });
  return vendorProfileResponseSchema.parse(raw);
}
