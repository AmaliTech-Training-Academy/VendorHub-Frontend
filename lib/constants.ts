/** Lifecycle of an order, in the order a vendor moves it through. */
export const ORDER_STATUSES = [
  "received",
  "preparing",
  "ready_for_collection",
] as const;

export const PLACEHOLDER_IMAGE = "/ve1.jpg";
