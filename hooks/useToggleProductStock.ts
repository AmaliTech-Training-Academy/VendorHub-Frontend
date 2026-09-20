import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateProducts, productsQueryKey } from "@/hooks/productQueries";
import { toggleProductStock } from "@/lib/api/products";
import type { Product } from "@/types/product";

export function useToggleProductStock(vendorId: string) {
  const queryClient = useQueryClient();
  const queryKey = productsQueryKey(vendorId);

  return useMutation({
    mutationFn: ({ id, inStock }: { id: string; inStock: boolean }) =>
      toggleProductStock(id, inStock),
    onMutate: async ({ id, inStock }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousProducts = queryClient.getQueryData<Product[]>(queryKey);

      queryClient.setQueryData<Product[]>(queryKey, (current) =>
        current?.map((product) =>
          product.id === id ? { ...product, inStock } : product
        )
      );

      return { previousProducts };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKey, context.previousProducts);
      }
    },
    onSettled: () => invalidateProducts(queryClient, vendorId),
  });
}
