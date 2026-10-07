/** Lifecycle of an order, in the order a vendor moves it through. */
export const ORDER_STATUSES = [
  "received",
  "preparing",
  "ready_for_collection",
] as const;

/**
 * The vendor profile page needs GET/PATCH /api/vendors/me/profile/, which the
 * backend doesn't expose yet. Set NEXT_PUBLIC_VENDOR_PROFILE_ENABLED=true at
 * build time once it does.
 */
export const VENDOR_PROFILE_ENABLED =
  process.env.NEXT_PUBLIC_VENDOR_PROFILE_ENABLED === "true";
