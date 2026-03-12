import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const normalizeUsername = (value: string) => value.trim();

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      login: (username, password) => {
        const normalizedUsername = normalizeUsername(username);
        const normalizedPassword = password.trim();

        if (!normalizedUsername || !normalizedPassword) {
          return false;
        }

        set({
          isAuthenticated: true,
          username: normalizedUsername,
        });
        return true;
      },
      logout: () =>
        set({
          isAuthenticated: false,
          username: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        username: state.username,
      }),
    },
  ),
);
