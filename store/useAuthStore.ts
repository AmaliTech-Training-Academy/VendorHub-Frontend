// store/useAuthStore.ts
import { create } from "zustand";

import type { AuthState } from "@/types/interfaces";
import type { UserRole } from "@/types/types";

const getInitialAuth = () => {
  if (typeof window === "undefined") {
    return { role: null, accessToken: null, userId: null, email: null };
  }
  try {
    const role = localStorage.getItem("role") as UserRole | null;
    const accessToken = localStorage.getItem("access_token");
    const storedUserId = localStorage.getItem("user_id");
    const email = localStorage.getItem("user_email");
    const userId = storedUserId !== null ? Number(storedUserId) : null;
    return { role, accessToken, userId, email };
  } catch {
    return { role: null, accessToken: null, userId: null, email: null };
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialAuth(),

  setAuth: (role, accessToken, refreshToken, userId, email) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("role", role);
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_id", String(userId));
      if (email) {
        localStorage.setItem("user_email", email);
      } else {
        localStorage.removeItem("user_email");
      }
    }
    set({ role, accessToken, userId, email: email ?? null });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("role");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_email");
    }
    set({ role: null, accessToken: null, userId: null, email: null });
  },
}));
