import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/types/registerSchema";
import { useAuthStore } from "@/store/useAuthStore";

interface UseUserRegistrationOptions {
  onSuccess?: (data: RegisterFormData) => void;
  onError?: (error: string) => void;
}

export const useUserRegistration = ({
  onSuccess,
  onError,
}: UseUserRegistrationOptions = {}) => {
  const { register: registerUser, isLoading, error } = useAuthStore();

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

    if (success) {
      if (onSuccess) onSuccess(data);
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
    onSubmit: handleSubmit(onSubmit),
    handleSubmit,
  };
};
