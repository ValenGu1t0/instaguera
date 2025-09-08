import { create } from "zustand";
import { Usuario } from "@/types";

interface AuthState {
  token: string | null;
  user: Usuario | null;
  login: (token: string, user: Usuario) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: null, // ⚠️ Podrías restaurarlo también si lo guardás en localStorage
  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));