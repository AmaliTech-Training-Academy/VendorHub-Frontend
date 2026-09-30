/** Lifecycle of an order, in the order a vendor moves it through. */
export const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "preparing",
  "ready_for_collection",
  "collected",
] as const;
