// store/useAuthStore.ts
import { create } from "zustand";
import type { UserRole } from "@/types/types";
import { AuthState } from "@/types/interfaces";

const getInitialAuth = () => {
  if (typeof window === "undefined") return { role: null, accessToken: null };
  try {
    const role = localStorage.getItem("role") as UserRole | null;
    const accessToken = localStorage.getItem("access_token");
    return { role, accessToken };
  } catch {
    return { role: null, accessToken: null };
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialAuth(),

  setAuth: (role, accessToken, refreshToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("role", role);
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
    }
    set({ role, accessToken });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("role");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    set({ role: null, accessToken: null });
  },
}));
