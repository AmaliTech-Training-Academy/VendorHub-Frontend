// store/useAuthStore.ts
import { create } from "zustand";
import type { AuthState, User } from "@/types/interfaces";
import type { LoginFormData, RegisterFormValues } from "@/types/types";

const getInitialUsers = (): User[] => {
  try {
    if (typeof window !== "undefined") {
      const savedUsers = localStorage.getItem("users");
      return savedUsers ? JSON.parse(savedUsers) : [];
    }
    return [];
  } catch (error) {
    console.error("Failed to load users from localStorage:", error);
    return [];
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  users: getInitialUsers(),
  isLoading: false,
  error: "",
  role: null,

  register: async (formData: RegisterFormValues) => {
    set({ isLoading: true, error: "" });

    if (!formData.email || !formData.password || !formData.role) {
      set({ error: "Please fill in all required fields", isLoading: false });
      return false;
    }

    // Role-specific required-field checks
    if (
      formData.role === "vendor" &&
      (!formData.businessName || !formData.ownerName)
    ) {
      set({
        error: "Business name and owner name are required",
        isLoading: false,
      });
      return false;
    }

    if (formData.role === "employee" && !formData.fullName) {
      set({ error: "Full name is required", isLoading: false });
      return false;
    }

    const existingUser = get().users.find((u) => u.email === formData.email);
    if (existingUser) {
      set({ error: "A user with this email already exists", isLoading: false });
      return false;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Build the stored user, including whichever role-specific fields apply
    const newUser: User =
      formData.role === "vendor"
        ? {
            id: Math.random().toString(36).substring(2, 9),
            email: formData.email,
            password: formData.password,
            role: "vendor",
            businessName: formData.businessName,
            ownerName: formData.ownerName,
          }
        : {
            id: Math.random().toString(36).substring(2, 9),
            email: formData.email,
            password: formData.password,
            role: "employee",
            fullName: formData.fullName,
          };

    const updatedUsers = [...get().users, newUser];

    if (typeof window !== "undefined") {
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }

    set({
      users: updatedUsers,
      isLoading: false,
      error: "",
    });

    return true;
  },

  login: async (formData: LoginFormData) => {
    set({ isLoading: true, error: "" });

    if (!formData.email || !formData.password) {
      set({ error: "Please fill in all required fields", isLoading: false });
      return false;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const foundUser = get().users.find(
      (u) => u.email === formData.email && u.password === formData.password,
    );

    if (!foundUser) {
      set({ error: "Invalid email or password", isLoading: false });
      return false;
    }

    set({ isLoading: false, error: "", role: foundUser.role });
    return true;
  },
}));
