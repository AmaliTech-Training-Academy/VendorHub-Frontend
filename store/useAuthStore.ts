// store/useAuthStore.ts
import { create } from "zustand";

import type { AuthState } from "@/types/interfaces";
import type { UserRole } from "@/types/types";

const getInitialAuth = () => {
  if (typeof window === "undefined") {
    return { role: null, accessToken: null, userId: null };
  }
  try {
    const role = localStorage.getItem("role") as UserRole | null;
    const accessToken = localStorage.getItem("access_token");
    const storedUserId = localStorage.getItem("user_id");
    const userId = storedUserId !== null ? Number(storedUserId) : null;
    return { role, accessToken, userId };
  } catch {
    return { role: null, accessToken: null, userId: null };
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialAuth(),

  setAuth: (role, accessToken, refreshToken, userId) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("role", role);
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_id", String(userId));
    }
    set({ role, accessToken, userId });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("role");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
    }
    set({ role: null, accessToken: null, userId: null });
  },
}));
