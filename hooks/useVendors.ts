import { useQuery } from "@tanstack/react-query";
import { fetchVendorCatalogue } from "@/lib/api/products-mock";
import { fetchVendorById, fetchVendors } from "@/lib/api/vendors-mock";

export function useVendors() {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: fetchVendors,
  });
}

export function useVendor(vendorId: string) {
  return useQuery({
    queryKey: ["vendors", vendorId],
    queryFn: () => fetchVendorById(vendorId),
    enabled: Boolean(vendorId),
  });
}

export function useVendorCatalogue(vendorId: string) {
  return useQuery({
    queryKey: ["vendors", vendorId, "catalogue"],
    queryFn: () => fetchVendorCatalogue(vendorId),
    enabled: Boolean(vendorId),
  });
}
