"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { UserRoundPen, Trash2, CalendarCheck, Info } from "lucide-react";

// Importa tus tipos
import { Usuario, Turno } from "@/types"; // Asegúrate de que la ruta sea correcta
import UserEditForm from "./UserEditForm"; // Importa el componente UserEditForm
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UserPanelPage() {

    const router = useRouter();
    const { user, token, logout, login } = useAuthStore();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userTurns, setUserTurns] = useState<Turno[]>([]);
    const [loadingTurns, setLoadingTurns] = useState(true);

    useEffect(() => {

        if (typeof window !== "undefined" && !token) {
        router.push("/login");
        toast.error("Debes iniciar sesión para ver esta página.");

        } else if (user) {

        console.log(API_URL)
        console.log(user)
        console.log(token)

        // Si el usuario está logueado, podríamos cargar sus turnos
        // fetchUserTurns(user.id); // Implementa esta función si tienes un endpoint de turnos
        // Por ahora, simulamos datos de turnos

        setTimeout(() => {
            // Asegúrate de que los datos simulados coincidan con la interfaz 'Turno'
            setUserTurns([
            {
                id: 1, // id es number
                fechaHora: "2024-08-15T10:00:00Z", // Formato ISO 8601
                estado: "CONFIRMADO", // Usa los estados definidos en 'Turno'
                descripcion: "Tatuaje de un lobo en el brazo",
                cliente: user, // Asigna el objeto de usuario completo
                dueno: { // Asigna un objeto de usuario completo para el dueño/artista
                    id: 101,
                    nombre: "Juan",
                    apellido: "Pérez",
                    celular: "1112223333",
                    username: "jperez",
                    email: "juan.perez@example.com",
                    role: "DUENO"
                }
            },
            {
                id: 2,
                fechaHora: "2024-09-01T14:30:00Z",
                estado: "SOLICITADO",
                descripcion: "Retoque de diseño floral en la espalda",
                cliente: user,
                dueno: {
                    id: 102,
                    nombre: "María",
                    apellido: "García",
                    celular: "4445556666",
                    username: "mgarcia",
                    email: "maria.garcia@example.com",
                    role: "DUENO"
                }
            },
            ]);
            setLoadingTurns(false);
        }, 1000);
        }
    }, [token, router, user, login]); 


    
    // Actualiza al user con el nuevo patch
    const handleUserUpdate = (updatedUser: Usuario) => {
        if (token) {
        login(token, updatedUser);
        }
        setIsEditDialogOpen(false);
    };

    // Función para eliminar usuario
    const handleDeleteUser = async () => {

        if (!user || !token) return;

        console.log(token)
        console.log(user);

        try {
            const res = await fetch(`${API_URL}/usuarios/${user.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al eliminar usuario");
        }

        toast.success("Tu cuenta ha sido eliminada. Gracias por ser parte!");
        logout();
        router.push("/");

        } catch (err) {
            toast.error("Error al eliminar tu cuenta.");
            console.error(err);

        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black text-white">
                Cargando datos de usuario...
            </div>
        );
    }

    return (

        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-gray-900 to-black text-white">
            
            <header className="w-full p-6 bg-gray-700 flex flex-row justify-between items-center">      
                <Link href="/"><h2 className="text-2xl font-semibold italic text-indigo-400">Instaguera</h2></Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-2/3 mt-8">

                {/* Información de Usuario */}
                <Card className="bg-opacity-10 bg-gray-600 backdrop-filter backdrop-blur-lg border border-indigo-700 text-white shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                        <Info className="h-6 w-6 text-blue-400" /> Tus Datos
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            Información de tu perfil.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>
                            <strong className="text-blue-200">Nombre:</strong> {user.nombre}
                        </p>
                        <p>
                            <strong className="text-blue-200">Apellido:</strong> {user.apellido}
                        </p>
                        <p>
                            <strong className="text-blue-200">Username:</strong> {user.username}
                        </p>
                        <p>
                            <strong className="text-blue-200">Email:</strong> {user.email}
                        </p>
                        <p>
                            <strong className="text-blue-200">Celular:</strong> {user.celular}
                        </p>
                    </CardContent>
                </Card>

                {/* Editar / Eliminar usuario */}
                <Card className="bg-opacity-10 bg-gray-600 backdrop-filter backdrop-blur-lg border border-indigo-700 text-white shadow-lg flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                            Acciones de Cuenta
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            Gestiona tu perfil o elimina tu cuenta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-800 text-white flex items-center gap-2 cursor-pointer">
                            <UserRoundPen className="h-4 w-4" /> Modificar Perfil
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
                            <DialogHeader>
                            <DialogTitle className="text-blue-300">Editar Perfil</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Realiza cambios en tu información. Haz clic en guardar cuando termines.
                            </DialogDescription>
                            </DialogHeader>
                            <UserEditForm
                            userData={user} 
                            onUpdateSuccess={handleUserUpdate}
                            onClose={() => setIsEditDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                            variant="destructive"
                            className="w-full bg-red-700 hover:bg-red-800 text-white flex items-center gap-2 cursor-pointer"
                            >
                            <Trash2 className="h-4 w-4" /> Eliminar Cuenta
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
                            <DialogHeader>
                            <DialogTitle className="text-red-400">Confirmar Eliminación</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.
                            </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                className="text-white hover:bg-gray-700 cursor-pointer"
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteUser}
                                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                            >
                                Sí, Eliminar
                            </Button>
                            </DialogFooter>
                        </DialogContent>

                    </Dialog>
                </CardContent>
                </Card>

            </div>

            {/* Turnos Programados */}
            <div className="w-full my-8 max-w-2/3">
                <Card className="bg-opacity-10 bg-gray-600 backdrop-filter backdrop-blur-lg border-2 border-indigo-700 text-white shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                        <CalendarCheck className="h-6 w-6 text-green-400" /> Tus Próximos Turnos
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                        Aquí puedes ver y gestionar tus citas para tatuajes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loadingTurns ? (
                        <p className="text-gray-400">Cargando turnos...</p>
                        ) : userTurns.length === 0 ? (
                        <p className="text-gray-400">No tienes turnos programados.</p>
                        ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userTurns.map((turno) => (
                            <Card
                                key={turno.id}
                                className="bg-gray-800 border-gray-600 text-white p-4 transition-transform hover:scale-105 duration-200"
                            >
                                <CardTitle className="text-xl text-blue-300 mb-2">
                                {turno.descripcion}
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                Artista: {turno.dueno.nombre} {turno.dueno.apellido}
                                </CardDescription>
                                <p className="mt-2 text-sm">
                                <strong className="text-gray-300">Fecha y Hora:</strong>{" "}
                                {new Date(turno.fechaHora).toLocaleString()}
                                </p>
                                <p className="text-sm">
                                <strong className="text-gray-300">Estado:</strong>{" "}
                                <span
                                    className={`font-semibold ${
                                    turno.estado === "CONFIRMADO"
                                        ? "text-green-400"
                                        : turno.estado === "SOLICITADO"
                                        ? "text-yellow-400"
                                        : "text-red-400"
                                    }`}
                                >
                                    {turno.estado}
                                </span>
                                </p>
                            </Card>
                            ))}
                        </div>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>

    );
}