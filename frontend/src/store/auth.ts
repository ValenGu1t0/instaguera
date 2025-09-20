import { create } from "zustand";
import { Usuario } from "@/types";

interface AuthState {
  token: string | null;
  user: Usuario | null;
  login: (token: string, user: Usuario) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({

  // Podemos importar estas dos variables para autenticación o ruteo
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: null, 
  
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