export type Role = "CLIENTE" | "DUENO" | "ADMIN";

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  celular: string;
  username: string;
  email: string;
  role: Role;
}

export interface Turno {
  id: number;
  fechaHora: string;
  estado: "SOLICITADO" | "CONFIRMADO" | "CANCELADO";
  descripcion: string;
  cliente: Usuario;
  dueno: Usuario;
}

export interface AuthResponse {
  token: string;
  user: Usuario;
}