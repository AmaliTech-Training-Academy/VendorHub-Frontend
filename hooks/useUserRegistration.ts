import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schemas/registerSchema";
import { useAuthStore } from "@/store/useAuthStore";
import type { UseUserRegistrationOptions } from "@/types/interfaces";
import type { RegisterFormData } from "@/types/types";

export const useUserRegistration = ({
  onSuccess,
  onError,
}: UseUserRegistrationOptions = {}) => {
  const registerUser = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const success = await registerUser(data);

    if (success && onSuccess) {
      onSuccess(data);
    } else {
      const errorMessage =
        useAuthStore.getState().error ||
        "Registration failed. Please try again.";
      if (onError) onError(errorMessage);
    }
  };

  return {
    register,
    watch,
    setValue,
    errors,
    isLoading,
    error,
    handleSubmit: handleSubmit(onSubmit),
  };
};
