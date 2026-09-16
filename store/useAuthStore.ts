// store/useAuthStore.ts
import { create } from "zustand";

export type UserRole = "vendor" | "employee";

interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterFormData {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

interface AuthState {
  users: User[];
  isLoading: boolean;
  error: string;
  role: UserRole | null;
  register: (formData: RegisterFormData) => Promise<boolean>;
  login: (formData: LoginFormData) => Promise<boolean>;
}

// 🛡️ Next.js SSR Safety check: Load from localStorage only on the client side
const getInitialUsers = (): User[] => {
  if (typeof window !== "undefined") {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  }
  return [];
};

export const useAuthStore = create<AuthState>((set, get) => ({
  users: getInitialUsers(), // 🔧 Dynamic, safe local state initialization
  isLoading: false,
  error: "",
  role: null,

  register: async (formData: RegisterFormData) => {
    set({ isLoading: true, error: "" });

    if (!formData.email || !formData.password || !formData.role) {
      set({ error: "Please fill in all required fields", isLoading: false });
      return false;
    }

    const existingUser = get().users.find((u) => u.email === formData.email);
    if (existingUser) {
      set({ error: "A user with this email already exists", isLoading: false });
      return false;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    // Calculate the updated users array
    const updatedUsers = [...get().users, newUser];

    // 💾 Save directly to local storage for test persistence
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
