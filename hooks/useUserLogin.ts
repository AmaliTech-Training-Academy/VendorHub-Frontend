import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/types/loginSchema"; // Adjust path to your login schema
import { useAuthStore } from "@/store/useAuthStore";

interface UseUserLoginOptions {
  onSuccess?: (role: string | null) => void;
  onError?: (error: string) => void;
}

export const useUserLogin = ({
  onSuccess,
  onError,
}: UseUserLoginOptions = {}) => {
  // Grab login, isLoading, and error from the auth store
  const { login, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data);

    if (success) {
      const role = useAuthStore.getState().role;
      if (onSuccess) onSuccess(role);
    } else {
      const errorMessage =
        useAuthStore.getState().error || "Login failed. Please try again.";
      if (onError) onError(errorMessage);
    }
  };

  return {
    register,
    errors,
    isLoading,
    error,
    onSubmit: handleSubmit(onSubmit),
    handleSubmit,
  };
};
