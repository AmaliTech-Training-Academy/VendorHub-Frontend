import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateProducts } from "@/hooks/productQueries";
import { editProduct } from "@/lib/api/products";
import type { ProductFormValues } from "@/types/product";

export function useEditProduct(vendorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductFormValues }) =>
      editProduct(id, input),
    onSuccess: () => invalidateProducts(queryClient, vendorId),
  });
}
