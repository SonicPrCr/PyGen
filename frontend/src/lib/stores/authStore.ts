import { create } from "zustand";
import api from "@/lib/api";

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  age: number | null;
  avatar: string | null;
  xp: number;
  current_level: number;
  current_level_color: string;
  total_stars: number;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // true after first fetchMe completes

  // Modal state
  modal: "login" | "register" | null;
  openLogin: () => void;
  openRegister: () => void;
  closeModal: () => void;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  age?: number;
}

function saveTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  modal: null,
  openLogin: () => set({ modal: "login" }),
  openRegister: () => set({ modal: "register" }),
  closeModal: () => set({ modal: null }),

  login: async (email, password) => {
    const { data } = await api.post("/api/auth/login/", { email, password });
    saveTokens(data.tokens.access, data.tokens.refresh);
    set({ user: data.user, isAuthenticated: true, isInitialized: true });
  },

  register: async (payload) => {
    const { data } = await api.post("/api/auth/register/", payload);
    saveTokens(data.tokens.access, data.tokens.refresh);
    set({ user: data.user, isAuthenticated: true, isInitialized: true });
  },

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (!token) {
      set({ isInitialized: true });
      return;
    }
    set({ isLoading: true });
    try {
      const { data } = await api.get("/api/auth/me/");
      set({ user: data, isAuthenticated: true });
    } catch {
      clearTokens();
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },
}));
