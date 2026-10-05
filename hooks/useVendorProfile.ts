import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { vendorProfileSchema } from "@/schemas/vendorProfile";
import type {
  VendorProfileFormInput,
  VendorProfileFormValues,
} from "@/types/vendorProfile";

type UseVendorProfileOptions = {
  defaultValues?: Partial<VendorProfileFormValues>;
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

async function updateVendorProfile(data: VendorProfileFormValues) {
  const formData = new FormData();
  formData.append("address", data.address);
  formData.append("phone", data.phone);
  data.slogans.forEach((slogan) => {
    formData.append("slogans", slogan.value);
  });
  if (data.storefrontImage) {
    formData.append("storefront_image", data.storefrontImage);
  }

  // Replace this placeholder with the vendor profile multipart endpoint when available.
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return { success: true };
}

export function useVendorProfile({
  defaultValues,
  onSuccess,
  onError,
}: UseVendorProfileOptions = {}) {
  const queryClient = useQueryClient();
  const form = useForm<
    VendorProfileFormInput,
    unknown,
    VendorProfileFormValues
  >({
    resolver: zodResolver(vendorProfileSchema),
    defaultValues: {
      address: defaultValues?.address ?? "",
      phone: defaultValues?.phone ?? "",
      slogans: defaultValues?.slogans ?? [{ value: "" }],
      storefrontImage: defaultValues?.storefrontImage,
    },
  });

  const mutation = useMutation({
    mutationFn: updateVendorProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vendorProfile"] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error.message || "Profile update failed.");
    },
  });

  return {
    register: form.register,
    control: form.control,
    setValue: form.setValue,
    errors: form.formState.errors,
    isLoading: mutation.isPending,
    handleSubmit: form.handleSubmit((data) => {
      mutation.mutate(data);
    }),
  };
}
