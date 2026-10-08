// store/useAuthStore.ts
import { create } from "zustand";

import type { AuthState } from "@/types/interfaces";
import type { UserRole } from "@/types/types";

const getInitialAuth = () => {
  if (typeof window === "undefined") {
    return {
      role: null,
      accessToken: null,
      userId: null,
      email: null,
      displayName: null,
    };
  }
  try {
    const role = localStorage.getItem("role") as UserRole | null;
    const accessToken = localStorage.getItem("access_token");
    const storedUserId = localStorage.getItem("user_id");
    const email = localStorage.getItem("user_email");
    const displayName = localStorage.getItem("display_name");
    const userId = storedUserId !== null ? Number(storedUserId) : null;
    return { role, accessToken, userId, email, displayName };
  } catch {
    return {
      role: null,
      accessToken: null,
      userId: null,
      email: null,
      displayName: null,
    };
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialAuth(),

  setAuth: (role, accessToken, refreshToken, userId, email, name) => {
    // Pick whichever name is actually available for this role —
    // vendors have owner_name, employees have full_name.
    const displayName = name;

    if (typeof window !== "undefined") {
      localStorage.setItem("role", role);
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_id", String(userId));
      if (email) {
        localStorage.setItem("user_email", email);
      }
      if (displayName) {
        localStorage.setItem("display_name", displayName);
      }
    }

    set({ role, accessToken, userId, email, displayName });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("role");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_email");
      localStorage.removeItem("display_name");
    }
    set({
      role: null,
      accessToken: null,
      userId: null,
      email: null,
      displayName: null,
    });
  },
}));
