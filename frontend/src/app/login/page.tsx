"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { AuthResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  //POST Login
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);    
    setError("");       

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en login");
      }

      const data: AuthResponse = await res.json();

      login(data.token, data.user);
      toast.success("Usuario logueado correctamente!")
      router.push("/");             

    } catch (err) {

      console.error(err);
      toast.error("Credenciales inválidas")

    } finally {
      setLoading(false); 
    }
  };

  return (
    
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      
      <Card className="w-full p-2 my-16 max-w-md bg-opacity-10 bg-gray-700 backdrop-filter backdrop-blur-lg border border-gray-700 text-white shadow-lg">
        
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">Iniciar Sesión</CardTitle>
          <CardDescription className="text-white">
            Ingresa tus credenciales para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@ejemplo.com"
                required
                className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>

            {/* Contraseña con botón de mostrar/ocultar */}
            <div>
              <Label htmlFor="password" className="text-gray-200">
                Contraseña
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  className="w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400 pr-10 focus:border-blue-500 focus:ring-blue-500" // Añadido 'pr-10' para dejar espacio al icono
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost" 
                  size="sm" 
                  className="absolute inset-y-0.5 cursor-pointer right-0 flex items-center px-3 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-label="Ocultar contraseña" />
                  ) : (
                    <Eye className="h-4 w-4" aria-label="Mostrar contraseña" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center" role="alert">
                {error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-indigo-700 hover:bg-indigo-900 cursor-pointer text-white font-semibold py-2 rounded-md transition-colors duration-300"
              disabled={loading} 
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </Button>
          </form>

          {/* Register */}
          <p className="mt-4 text-center text-gray-400 text-sm">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-indigo-400 hover:underline">
              Regístrate
            </a>
          </p>
        </CardContent>
      
      </Card>
    </div>
  );
}