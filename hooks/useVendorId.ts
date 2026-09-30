import { useAuthStore } from "@/store/useAuthStore";

/**
 * The logged-in vendor's id, used to key their cached queries so two accounts
 * on one browser never share data. Empty until a user is logged in, which
 * leaves the id-gated queries disabled.
 */
export function useVendorId(): string {
  const userId = useAuthStore((state) => state.userId);
  return userId === null ? "" : String(userId);
}
