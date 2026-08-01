import { create } from "zustand";
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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: typeof window !== "undefined" && Boolean(Cookies.get("access_token")),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      const access = response.data.accessToken || response.data.access;
      const refresh = response.data.refreshToken || response.data.refresh;
      const rawUser = response.data.user;

      if (access) {
        Cookies.set("access_token", access, { expires: 1, sameSite: "Lax" });
      }
      if (refresh) {
        Cookies.set("refresh_token", refresh, { expires: 7, sameSite: "Lax" });
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage");
      }

      const user = rawUser
        ? {
            ...rawUser,
            first_name: rawUser.first_name || rawUser.firstName || "User",
            last_name: rawUser.last_name || rawUser.lastName || "",
            phone_number: rawUser.phone_number || rawUser.phoneNumber || "",
          }
        : null;

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
      const access = response.data.accessToken || response.data.access;
      const refresh = response.data.refreshToken || response.data.refresh;
      const rawUser = response.data.user;

      if (access) {
        Cookies.set("access_token", access, { expires: 1, sameSite: "Lax" });
      }
      if (refresh) {
        Cookies.set("refresh_token", refresh, { expires: 7, sameSite: "Lax" });
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage");
      }

      const user = rawUser
        ? {
            ...rawUser,
            first_name: rawUser.first_name || rawUser.firstName || "User",
            last_name: rawUser.last_name || rawUser.lastName || "",
            phone_number: rawUser.phone_number || rawUser.phoneNumber || "",
          }
        : null;

      set({ user, isAuthenticated: Boolean(access), isLoading: false });
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
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage");
      }
      set({ user: null, isAuthenticated: false });
    }
  },

  fetchProfile: async () => {
    const token = Cookies.get("access_token");
    if (!token) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage");
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await authAPI.getProfile();
      const rawUser = response.data;
      const user = rawUser
        ? {
            ...rawUser,
            first_name: rawUser.first_name || rawUser.firstName || "User",
            last_name: rawUser.last_name || rawUser.lastName || "",
            phone_number: rawUser.phone_number || rawUser.phoneNumber || "",
          }
        : null;
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;

      // A 401 that survived the interceptor's refresh means the session really
      // is gone. Anything else (429, 5xx, offline) is transient — keep the
      // session so a blip does not silently sign the user out.
      if (status === 401 || status === 403) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
        }
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

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
}));
