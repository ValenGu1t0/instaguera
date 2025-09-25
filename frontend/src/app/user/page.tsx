"use client";

import { useEffect, useState, useCallback } from "react";
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
import { UserRoundPen, Trash2, CalendarCheck, Info, Plus, LogOut } from "lucide-react";
import UserEditForm from "./UserEditForm"; 
import Link from "next/link";
import TurnoForm from "./TurnoForm";
import { Usuario, Turno } from "@/types"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TATUADOR_ID = 1; // thiago xd

export default function UserPanelPage() {

    const router = useRouter();
    const { user, token, logout, login } = useAuthStore();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false); 
    const [userTurns, setUserTurns] = useState<Turno[]>([]);
    const [loadingTurns, setLoadingTurns] = useState(true);
    const [isTurnoFormOpen, setIsTurnoFormOpen] = useState(false); 
    const [editingTurno, setEditingTurno] = useState<Turno | null>(null); 
    const [deletingTurnoId, setDeletingTurnoId] = useState<number | null>(null);

    // Función para obtener los turnos del usuario - Envuelto en useCallback
    const fetchUserTurns = useCallback(async (userId: number) => {
        if (!token) {
            setLoadingTurns(false);
            return;
        }
        setLoadingTurns(true);
        try {
           
            const res = await fetch(`${API_URL}/turnos?clienteId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Error al cargar los turnos.");
            }

            const allTurns: Turno[] = await res.json();
            const userSpecificTurns = allTurns.filter(turno => turno.cliente?.id === userId); 
            setUserTurns(userSpecificTurns);

        } catch (error) {
            toast.error("Hubo un error al cargar tus turnos.");
            console.error("Error fetching user turns:", error);
            setUserTurns([]);

        } finally {
            setLoadingTurns(false);
        }
    }, [token]);

    // useEffect para la autenticación y carga de turnos
    useEffect(() => {

        if (typeof window !== "undefined") {
            if (!token) {

                router.push("/login");

            } else if (user && user.id) { 
                fetchUserTurns(user.id);
            }
        }

    }, [token, router, user, fetchUserTurns]);


    // Actualiza al user con el nuevo patch (existente)
    const handleUserUpdate = (updatedUser: Usuario) => {
        if (token) {
            login(token, updatedUser);
        }
        setIsEditDialogOpen(false);
    };

    // DELETE Usuario (existente)
    const handleDeleteUser = async () => {

        if (!user || !token) return;

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

            toast.success("Tu cuenta ha sido eliminada. ¡Gracias por ser parte!");
            logout();
            router.push("/");
        } catch (err) {
            toast.error("Error al eliminar tu cuenta.");
            console.error(err);

        } finally {
            setIsDeleteUserDialogOpen(false); 
        }
    };

    // Abre el formulario para crear un nuevo turno
    const handleOpenCreateTurno = () => {
        setEditingTurno(null); 
        setIsTurnoFormOpen(true);
    };

    // Abre el formulario para editar un turno existente
    const handleOpenEditTurno = (turno: Turno) => {
        setEditingTurno(turno);
        setIsTurnoFormOpen(true);
    };

    // SUBMIT POST / PATCH Turnos 
    const handleCreateUpdateTurno = async (turnoData: Partial<Turno>) => {

        if (!token || !user) {
            toast.error("No estás autenticado o no se pudo obtener tu información de usuario.");
            return;
        }

        try {
            let res;
            if (editingTurno) {
               
                res = await fetch(`${API_URL}/turnos/${editingTurno.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    
                    body: JSON.stringify({
                        descripcion: turnoData.descripcion,
                        fechaHora: turnoData.fechaHora, 
                    }),
                });

            } else {

                // Crear nuevo turno
                res = await fetch(`${API_URL}/turnos`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...turnoData,
                        cliente: { id: user.id }, 
                        dueno: { id: TATUADOR_ID }, 
                        estado: "SOLICITADO", 
                    }),
                });
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Error al ${editingTurno ? 'actualizar' : 'crear'} el turno`);
            }

            toast.success(`Turno ${editingTurno ? 'actualizado' : 'creado'} exitosamente.`);
            fetchUserTurns(user.id);
            setIsTurnoFormOpen(false); 
            
        } catch (error) { 
            toast.error("Error al ${editingTurno ? 'actualizar' : 'crear'} el turno.");
            console.error(error);
        }
    };

    // DELETE Turno
    const confirmDeleteTurno = async () => {

        if (!token || !user || !deletingTurnoId) {
            toast.error("No estás autenticado o no hay un turno seleccionado para eliminar.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/turnos/${deletingTurnoId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al eliminar el turno.");
            }

            toast.success("Turno eliminado exitosamente.");
            fetchUserTurns(user.id); 
            setDeletingTurnoId(null); 
            setIsDeleteUserDialogOpen(false);

        } catch (error) {
            toast.error("Error al eliminar el turno");
            console.error(error);
        }
    };

    // Función para verificar si un turno se puede modificar (editar o eliminar) - debe tener al menos 48 horas de antelación
    const canModifyTurno = (fechaHora: string) => {
        const turnoDate = new Date(fechaHora);
        const now = new Date();
        const diffHours = (turnoDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        return diffHours >= 48;
    };

    // Logout desde panel de usuario
    const handleLogout = () => {
        toast.error("Usuario deslogueado!")
        logout(); 
        router.push("/");
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen text-2xl bg-gradient-to-br from-gray-900 to-black text-white">
                Cargando datos de usuario...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-gray-900 to-black text-white">

            {/* NavBar Panel */}
            <header className="w-full px-8 py-6 bg-gray-700 flex flex-row justify-between items-center">
                
                <Link href="/"><h2 className="text-2xl text-white hover:text-indigo-400 transition">Inicio</h2></Link>

                <h3 className="text-3xl text-white ">Panel de Usuario</h3>

                <Button
                    variant="ghost"
                    size="icon" 
                    onClick={handleLogout}
                    className="text-white hover:bg-white/20 hover:text-red-400 cursor-pointer"
                    title="Cerrar Sesión" 
                >
                    <LogOut className="h-7 w-7" />
                </Button>
            </header>

            {/* Cards del Usuario */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-[90%] px-8 mt-8"> {/* Ajuste de max-w y px */}

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

                {/* Editar / Eliminar usuario (EXISTENTE) */}
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
                                <Button className="w-full font-semibold bg-indigo-600 hover:bg-indigo-800 text-white flex items-center gap-2 cursor-pointer">
                                    <UserRoundPen className="h-4 w-4 font-semibold" /> Modificar Perfil
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

                        {/* Diálogo de Eliminación de Usuario (EXISTENTE) */}
                        <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}> 
                            <DialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="w-full font-semibold bg-red-700 hover:bg-red-800 text-white flex items-center gap-2 cursor-pointer"
                                    onClick={() => setIsDeleteUserDialogOpen(true)} 
                                >
                                    <Trash2 className="h-4 w-4 font-semibold" /> Eliminar Cuenta
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
                                        onClick={() => setIsDeleteUserDialogOpen(false)}
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

            {/* Turnos del Usuario */}
            <div className="w-full my-8 max-w-[90%] px-8">

                {/* Card de Turno */}
                <Card className="bg-opacity-10 bg-gray-600 backdrop-filter backdrop-blur-lg border-2 border-indigo-700 text-white shadow-2xl">
                    
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
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {/* Card para sacar un nuevo turno (card fantasma) */}
                                <Card
                                    className="bg-gray-800 border-gray-600 text-white p-4 flex flex-col justify-center items-center transition-transform hover:scale-105 duration-200 cursor-pointer h-48"
                                    onClick={handleOpenCreateTurno}
                                >
                                    <Plus className="h-12 w-12 text-indigo-400" />
                                    <p className="mt-2 text-lg text-indigo-300">Sacar Nuevo Turno</p>
                                </Card>

                                {/* Renderizado de los turnos existentes */}
                                {userTurns.length === 0 && !loadingTurns ? (
                                    // Este mensaje se muestra si no hay turnos y ya terminaron de cargar
                                    <p className="text-gray-400 col-span-full">No tienes turnos programados. ¡Saca uno nuevo!</p>
                                ) : (
                                    userTurns.map((turno) => {
                                        const canModify = canModifyTurno(turno.fechaHora);
                                        return (
                                            <Card
                                                key={turno.id}
                                                className="bg-gray-800 border-gray-600 text-white p-6 transition-transform hover:scale-105 duration-200 relative"
                                            >
                                                <CardTitle className="text-xl text-blue-500 mb-2">
                                                    Artista: Thiago Reis
                                                </CardTitle>
                                                <CardDescription className="text-gray-200 text-md">
                                                    {turno.descripcion}
                                                </CardDescription>
                                                <p className="mt-2 text-lg">
                                                    <strong className="text-gray-300 sm:text-lg">Fecha y Hora:</strong>{" "}
                                                    {new Date(turno.fechaHora).toLocaleString()}
                                                </p>
                                                <p className="text-sm">
                                                    <strong className="text-gray-300 sm:text-md">Estado:</strong>{" "}
                                                    <span
                                                        className={`font-semibold sm:text-md ${
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
                                                {/* Botones de acción solo si se puede modificar */}
                                                {canModify && (
                                                    <div className="absolute top-2 right-2 flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); 
                                                                handleOpenEditTurno(turno);
                                                            }}
                                                            className="text-gray-400 hover:text-indigo-400 cursor-pointer"
                                                            title="Editar Turno"
                                                        >
                                                            <UserRoundPen className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeletingTurnoId(turno.id); 
                                                                setIsDeleteUserDialogOpen(true); 
                                                            }}
                                                            className="text-gray-400 hover:text-red-400 cursor-pointer"
                                                            title="Eliminar Turno"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </Card>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    
                    </CardContent>
                </Card>

            </div>

            {/* Modal para Crear/Editar */}
            <Dialog open={isTurnoFormOpen} onOpenChange={setIsTurnoFormOpen}>
                <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-blue-300">{editingTurno ? "Editar Turno" : "Sacar Nuevo Turno"}</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Completa los detalles para tu cita.
                        </DialogDescription>
                    </DialogHeader>
                    <TurnoForm
                        initialData={editingTurno}
                        onSubmitSuccess={handleCreateUpdateTurno}
                        onClose={() => setIsTurnoFormOpen(false)}
                        canModifyTurno={canModifyTurno}
                    />
                </DialogContent>
            </Dialog>

            {/* Modal de Eliminar Turno */}
            <Dialog open={deletingTurnoId !== null && isDeleteUserDialogOpen} onOpenChange={(open) => {
                setIsDeleteUserDialogOpen(open);
                if (!open) setDeletingTurnoId(null); 
            }}>
                <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-red-400">Confirmar Eliminación de Turno</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            ¿Estás seguro de que quieres eliminar este turno? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteUserDialogOpen(false);
                                setDeletingTurnoId(null);
                            }}
                            className="text-white hover:bg-gray-700 cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteTurno}
                            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        >
                            Sí, Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}