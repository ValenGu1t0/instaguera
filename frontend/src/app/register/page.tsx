"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Register() {

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [celular, setCelular] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // POST Registro
    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                nombre,
                apellido,
                celular,
                username,
                email,
                password,
                role: "CLIENTE", // Fijado como CLIENTE por defecto, según tu comentario
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al registrar usuario");
            }

            // Podria mejorarlo a loguear automaticamente con el register..
            toast.success("Usuario creado correctamente! Ahora, logueate!")
            router.push("/login?success=true");

        } catch (err) {
            setError("Error al registrar. Intenta de nuevo.");
            console.error(err);

        } finally {
            setLoading(false);
        }
    };    

    return (
        <div className="flex flex-col justify-center items-center w-screen bg-gradient-to-br from-gray-900 to-black p-4">

            <Card className="w-full my-16 max-w-lg bg-opacity-10 bg-gray-700 backdrop-filter backdrop-blur-lg border border-gray-700 text-white shadow-lg">
                
                <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-white">Crear Cuenta</CardTitle>
                <CardDescription className="text-white">
                    Únete a nuestra comunidad. ¡Es rápido y fácil!
                </CardDescription>
                </CardHeader>

                <CardContent>
                    {/* Campos del Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Nombre Apellido */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div>
                            <Label htmlFor="nombre" className="text-indigo-100">
                            Nombre
                            </Label>
                            <Input
                            id="nombre"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Tu nombre"
                            required
                            className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500"
                            />
                        </div>

                        {/* Apellido */}
                        <div>
                            <Label htmlFor="apellido" className="text-indigo-100">
                            Apellido
                            </Label>
                            <Input
                            id="apellido"
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            placeholder="Tu apellido"
                            required
                            className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500"
                            />
                        </div>
                        </div>

                        {/* Username Celular */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Username */}
                            <div>
                            <Label htmlFor="username" className="text-indigo-100">
                                Nombre de Usuario
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="nombredeusuario"
                                required
                                className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500"
                            />
                            </div>

                            {/* Celular */}
                            <div>
                            <Label htmlFor="celular" className="text-indigo-100">
                                Celular
                            </Label>
                            <Input
                                id="celular"
                                type="tel" // Tipo 'tel' para móviles
                                value={celular}
                                onChange={(e) => setCelular(e.target.value)}
                                placeholder="Ej: 3001234567"
                                required
                                className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500"
                            />
                            </div>
                        </div>
                        
                        {/* Email */}
                        <div>
                        <Label htmlFor="email" className="text-indigo-100">
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

                        {/* Contraseña */}
                        <div>
                        <Label htmlFor="password" className="text-indigo-100">
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
                        <p className="text-red-300 text-sm text-center" role="alert">
                            {error}
                        </p>
                        )}

                        {/* Submit */}
                        <Button
                        type="submit"
                        className="w-full bg-indigo-700 hover:bg-indigo-900 cursor-pointer text-white font-semibold py-2 rounded-md transition-colors duration-300"
                        disabled={loading}
                        >
                        {loading ? "Registrando..." : "Registrarse"}
                        </Button>
                    </form>

                    {/* Login */}
                    <p className="mt-4 text-center text-indigo-300 text-sm">
                        ¿Ya tienes cuenta?{" "}
                        <a href="/login" className="text-purple-400 hover:underline">
                        Inicia Sesión
                        </a>
                    </p>
                </CardContent>
            </Card>

        </div>
    );
}