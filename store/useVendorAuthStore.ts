// store/useVendorAuthStore.ts
import { create } from "zustand";

export interface RegisterFormData {
  businessName: string;
  ownerName: string;
  email: string;
  password: string;
}

interface VendorAuthState {
  isLoading: boolean;
  error: string;
  register: (formData: RegisterFormData) => Promise<boolean>;
}

export const useVendorAuthStore = create<VendorAuthState>((set) => ({
  isLoading: false,
  error: "",

  register: async (formData: RegisterFormData) => {
    set({ isLoading: true, error: "" });

    if (!formData.businessName || !formData.email || !formData.password) {
      set({ error: "Please fill in all required fields", isLoading: false });
      return false;
    }

    // 🔧 TEMPORARY — fake network delay, standing in for the real Backend call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const fakeSuccess = true;

    if (!fakeSuccess) {
      set({
        error: "Registration failed. Please try again.",
        isLoading: false,
      });
      return false;
    }

    set({ isLoading: false, error: "" });
    return true;
  },
}));
