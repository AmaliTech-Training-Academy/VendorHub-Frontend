import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerSchema } from "@/schemas/registerSchema";
import { useAuthStore } from "@/store/useAuthStore";
import { registerEmployee, registerVendor, loginUser } from "@/lib/api/auth";
import type { UseUserRegistrationOptions } from "@/types/interfaces";
import type { RegisterFormValues } from "@/types/types";

export const useUserRegistration = ({
  onSuccess,
  onError,
}: UseUserRegistrationOptions = {}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterFormValues>,
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      if (data.role === "VENDOR") {
        await registerVendor({
          email: data.email,
          password: data.password,
          business_name: data.businessName!,
          owner_name: data.ownerName!,
        });
      } else {
        await registerEmployee({
          email: data.email,
          password: data.password,
          full_name: data.fullName!,
        });
      }
      return loginUser({ email: data.email, password: data.password });
    },
    onSuccess: (response, variables) => {
      useAuthStore
        .getState()
        .setAuth(response.role, response.access, response.refresh);
      onSuccess?.(variables);
    },
    onError: (err: Error) => {
      onError?.(err.message || "Registration failed. Please try again.");
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  return {
    register,
    watch,
    setValue,
    errors,
    isLoading: mutation.isPending,
    error: mutation.error?.message,
    handleSubmit: handleSubmit(onSubmit),
  };
};
