import { create } from "zustand";
import { Usuario } from "@/types";

interface AuthState {
  token: string | null;
  user: Usuario | null;
  login: (token: string, user: Usuario) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({

  // Guardamos token y user desde localStorage si existen
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user:
    typeof window !== "undefined" && localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)
      : null,

  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    
    // Esto ya sobrescribe ambos en el PATCH también
    set({ token, user }); 
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));