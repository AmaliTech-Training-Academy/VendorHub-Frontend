/** Mirrors the `status` values React Query reports for a query. */
export const Status = {
  PENDING: "pending",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type Status = (typeof Status)[keyof typeof Status];
