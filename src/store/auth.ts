import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { User, RegisterRequest, ProfileUpdateRequest } from "@/types";
import { authAPI } from "@/lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: ProfileUpdateRequest) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login({ email, password });
          const { access, refresh, user } = response.data;
          Cookies.set("access_token", access, { expires: 1 });
          Cookies.set("refresh_token", refresh, { expires: 7 });
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } } };
          set({
            error: err.response?.data?.message || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(data);
          const { access, refresh, user } = response.data;
          Cookies.set("access_token", access, { expires: 1 });
          Cookies.set("refresh_token", refresh, { expires: 7 });
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } } };
          set({
            error: err.response?.data?.message || "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } finally {
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          set({ user: null, isAuthenticated: false });
        }
      },

      fetchProfile: async () => {
        set({ isLoading: true });
        try {
          const response = await authAPI.getProfile();
          set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.updateProfile(data);
          set({ user: response.data, isLoading: false });
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } } };
          set({
            error: err.response?.data?.message || "Update failed",
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
