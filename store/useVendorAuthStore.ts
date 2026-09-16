// store/useAuthStore.ts
import { create } from "zustand";

export type UserRole = "vendor" | "employee";

export interface RegisterFormData {
  email: string;
  password: string;
  role: UserRole;
}

interface AuthState {
  isLoading: boolean;
  error: string;
  role: UserRole | null;
  register: (formData: RegisterFormData) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: "",
  role: null,

  register: async (formData: RegisterFormData) => {
    set({ isLoading: true, error: "" });

    if (!formData.email || !formData.password || !formData.role) {
      set({ error: "Please fill in all required fields", isLoading: false });
      return false;
    }

    // 🔧 TEMPORARY — fake network delay, standing in for the real Django call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const fakeSuccess = true;

    if (!fakeSuccess) {
      set({
        error: "Registration failed. Please try again.",
        isLoading: false,
      });
      return false;
    }

    set({ isLoading: false, error: "", role: formData.role });
    return true;
  },
}));
