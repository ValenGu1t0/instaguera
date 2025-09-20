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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado para el loading del botón
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
      console.log(data.user);
      toast.success("Usuario logueado correctamente!")
      router.push("/");             // home o lo que sea que quiera despues je

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

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-gray-200">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500"
              />
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