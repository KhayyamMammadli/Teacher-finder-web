"use client";

import { create } from "zustand";
import type { AuthUser } from "@/lib/types";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  ready: boolean;
  init: () => void;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
}

const TOKEN_KEY = "az_token";
const USER_KEY = "az_user";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  ready: false,
  init: () => {
    if (typeof window === "undefined") {
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    const user = userRaw ? (JSON.parse(userRaw) as AuthUser) : null;
    set({ token, user, ready: true });
  },
  setAuth: (token, user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      document.cookie = `az_token=${token}; path=/; max-age=604800; samesite=lax`;
    }
    set({ token, user, ready: true });
  },
  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      document.cookie = "az_token=; path=/; max-age=0; samesite=lax";
    }
    set({ token: null, user: null, ready: true });
  },
}));
