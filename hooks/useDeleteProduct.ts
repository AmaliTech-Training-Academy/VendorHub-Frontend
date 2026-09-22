import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateProducts } from "@/hooks/productQueries";
import { deleteProduct } from "@/lib/api/products-mock";

export function useDeleteProduct(vendorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => invalidateProducts(queryClient, vendorId),
  });
}
