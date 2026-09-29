/**
 * Temporary stand-in until real authentication lands. The dashboard treats
 * this as the id of the currently logged-in vendor.
 */
export const MOCK_VENDOR_ID = "vendor-1";

/** Lifecycle of an order, in the order a vendor moves it through. */
export const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "preparing",
  "ready_for_collection",
  "collected",
] as const;
