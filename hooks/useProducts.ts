import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import {
  addProduct,
  deleteProduct,
  editProduct,
  fetchProducts,
  toggleProductStock,
} from "@/lib/api/products";
import type { Product, ProductFormValues } from "@/types/product";

export function productsQueryKey(vendorId: string) {
  return ["products", vendorId] as const;
}

export function useProducts(vendorId: string) {
  return useQuery({
    queryKey: productsQueryKey(vendorId),
    queryFn: () => fetchProducts(vendorId),
    enabled: Boolean(vendorId),
  });
}

function invalidateProducts(queryClient: QueryClient, vendorId: string) {
  return queryClient.invalidateQueries({ queryKey: productsQueryKey(vendorId) });
}

export function useAddProduct(vendorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProductFormValues) => addProduct(vendorId, input),
    onSuccess: () => invalidateProducts(queryClient, vendorId),
  });
}

export function useEditProduct(vendorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductFormValues }) =>
      editProduct(id, input),
    onSuccess: () => invalidateProducts(queryClient, vendorId),
  });
}

export function useDeleteProduct(vendorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => invalidateProducts(queryClient, vendorId),
  });
}

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
