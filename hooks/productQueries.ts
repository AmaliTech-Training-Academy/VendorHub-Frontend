import type { QueryClient } from "@tanstack/react-query";

export function productsQueryKey(vendorId: string) {
  return ["products", vendorId] as const;
}

export function invalidateProducts(queryClient: QueryClient, vendorId: string) {
  return queryClient.invalidateQueries({ queryKey: productsQueryKey(vendorId) });
}
