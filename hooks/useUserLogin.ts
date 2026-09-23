import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/loginSchema";
import { useAuthStore } from "@/store/useAuthStore";
import type { UseUserLoginOptions } from "@/types/interfaces";
import type { LoginFormData } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/lib/api/auth";

export const useUserLogin = ({
  onSuccess,
  onError,
}: UseUserLoginOptions = {}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => loginUser(data),
    onSuccess: (response) => {
      useAuthStore
        .getState()
        .setAuth(response.role, response.access, response.refresh);
      onSuccess?.(response.role);
    },
    onError: (err: Error) => {
      onError?.(err.message || "Login failed. Please try again.");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return {
    register,
    errors,
    isLoading: mutation.isPending,
    error: mutation.error?.message,
    handleSubmit: handleSubmit(onSubmit),
  };
};
