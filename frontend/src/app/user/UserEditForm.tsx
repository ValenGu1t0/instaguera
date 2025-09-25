"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Usuario } from "@/types"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UserEditForm({
    userData,
    onUpdateSuccess,
    onClose,
}: {
    userData: Usuario;
    onUpdateSuccess: (updatedUser: Usuario) => void; 
    onClose: () => void;
}) {
    const { token } = useAuthStore();
    const [nombre, setNombre] = useState(userData.nombre || "");
    const [apellido, setApellido] = useState(userData.apellido || "");
    const [celular, setCelular] = useState(userData.celular || "");
    const [username, setUsername] = useState(userData.username || "");
    const [email, setEmail] = useState(userData.email || "");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // PATCH Datos de usuario
    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/usuarios/${userData.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    celular,
                    username,
                    email,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error("Error interno.")
                throw new Error(errorData.message || "Error interno.");
            }

            const updatedUser: Usuario = await res.json();
            toast.success("Perfil actualizado correctamente!");
            onUpdateSuccess(updatedUser);
            onClose();

            } catch (err) {
                setError("Error al actualizar. Intenta de nuevo.");
                toast.error("Error al actualizar el usuario.")
                console.error(err);

            } finally {
                setLoading(false);
        }
    };
    

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <Label htmlFor="edit-nombre" className="text-gray-700 dark:text-gray-100">Nombre</Label>
                <Input
                    id="edit-nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    required
                    className="mt-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500"
                />
                </div>
                <div>
                <Label htmlFor="edit-apellido" className="text-gray-700 dark:text-gray-100">Apellido</Label>
                <Input
                    id="edit-apellido"
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Tu apellido"
                    required
                    className="mt-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500"
                />
                </div>
            </div>

            <div>
                <Label htmlFor="edit-username" className="text-gray-700 dark:text-gray-100">Nombre de Usuario</Label>
                <Input
                    id="edit-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="nombredeusuario"
                    required
                    className="mt-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500"
                />
            </div>

            <div>
                <Label htmlFor="edit-celular" className="text-gray-700 dark:text-gray-100">Celular</Label>
                <Input
                    id="edit-celular"
                    type="tel"
                    value={celular}
                    onChange={(e) => setCelular(e.target.value)}
                    placeholder="Ej: 3001234567"
                    required
                    className="mt-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500"
                />
            </div>

            <div>
                <Label htmlFor="edit-email" className="text-gray-700 dark:text-gray-100">Email</Label>
                <Input
                    id="edit-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@ejemplo.com"
                    required
                    className="mt-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500"
                />
            </div>

            {error && (
                <p className="text-red-500 text-sm text-center" role="alert">
                {error}
                </p>
            )}

            <DialogFooter className="mt-6">
                <Button
                    type="button"
                    className="cursor-pointer"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                    disabled={loading}
                >
                    {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
            </DialogFooter>
        </form>
  );
}