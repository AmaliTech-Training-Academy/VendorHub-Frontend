/** Lifecycle of an order, in the order a vendor moves it through. */
export const ORDER_STATUSES = [
  "received",
  "preparing",
  "ready_for_collection",
] as const;

export const VENDOR_PROFILE_ENABLED =
  process.env.NEXT_PUBLIC_VENDOR_PROFILE_ENABLED === "true";
