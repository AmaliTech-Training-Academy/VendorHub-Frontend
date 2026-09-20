import { useQuery } from "@tanstack/react-query";
import { productsQueryKey } from "@/hooks/productQueries";
import { fetchProducts } from "@/lib/api/products";

export function useProducts(vendorId: string) {
  return useQuery({
    queryKey: productsQueryKey(vendorId),
    queryFn: () => fetchProducts(vendorId),
    enabled: Boolean(vendorId),
  });
}
