import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { User, RefreshTokenResponse } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isInitialized: boolean;
}

interface AuthActions {
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  initAuth: () => Promise<void>;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

type AuthStore = AuthState & AuthActions;

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      isInitialized: false,

      // Computed
      isAuthenticated: () => !!get().accessToken,
      isAdmin: () => get().user?.role === "admin",

      // Actions
      setAuth: (user: User, accessToken: string) => set({ user, accessToken }),

      setAccessToken: (accessToken: string) => set({ accessToken }),

      clearAuth: () => set({ user: null, accessToken: null }),

      initAuth: async () => {
        if (get().isInitialized) return;

        try {
          const { data } = await axios.post<RefreshTokenResponse>(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"}/auth/refresh-token`,
            {},
            { withCredentials: true },
          );
          set({ accessToken: data.accessToken });
        } catch {
          set({ user: null, accessToken: null });
        } finally {
          set({ isInitialized: true });
        }
      },
    }),
    {
      name: "florio-auth",
      // Chỉ persist user – KHÔNG persist accessToken (bảo mật)
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
