import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { fetchVendorProfile, updateVendorProfile } from "@/lib/api/vendors";
import { vendorProfileSchema } from "@/schemas/vendorProfile";
import type {
  VendorProfile,
  VendorProfileFormInput,
  VendorProfileFormValues,
} from "@/types/vendorProfile";

type UseVendorProfileOptions = {
  defaultValues?: Partial<VendorProfileFormInput>;
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

function profileToFormValues(profile: VendorProfile): VendorProfileFormInput {
  return {
    address: profile.address,
    phone: profile.phone,
    slogans: profile.slogans.map((value) => ({ value })),
  };
}

export function useVendorProfile({
  onSuccess,
  onError,
}: UseVendorProfileOptions = {}) {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({
    queryKey: ["vendorProfile"],
    queryFn: fetchVendorProfile,
  });
  const form = useForm<
    VendorProfileFormInput,
    unknown,
    VendorProfileFormValues
  >({
    resolver: zodResolver(vendorProfileSchema),
    defaultValues: {
      address: "",
      phone: "",
      slogans: [{ value: "" }],
    },
    values: profileQuery.data
      ? profileToFormValues(profileQuery.data)
      : undefined,
    resetOptions: { keepDirtyValues: true },
  });

  const mutation = useMutation({
    mutationFn: updateVendorProfile,
    onSuccess: async (profile) => {
      queryClient.setQueryData(["vendorProfile"], profile);
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
    profile: profileQuery.data,
    isProfilePending: profileQuery.isPending,
    isProfileError: profileQuery.isError,
    handleSubmit: form.handleSubmit((data) => {
      mutation.mutate(data);
    }),
  };
}

export type VendorProfileController = ReturnType<typeof useVendorProfile>;
