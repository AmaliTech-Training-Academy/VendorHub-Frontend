import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateProducts } from "@/hooks/productQueries";
import { addProduct } from "@/lib/api/products-mock";
import type { ProductFormValues } from "@/types/product";

export function useAddProduct(vendorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProductFormValues) => addProduct(vendorId, input),
    onSuccess: () => invalidateProducts(queryClient, vendorId),
  });
}
