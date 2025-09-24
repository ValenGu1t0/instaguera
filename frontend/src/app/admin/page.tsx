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
  DialogFooter,
} from "@/components/ui/dialog";
import { UserRoundPen, Trash2, CalendarCheck, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import TurnoAdminForm from "./TurnoAdminForm";
import { Turno } from "@/types"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TATUADOR_ID = 1; // ID constante del tatuador único (Thiago xd)

export default function AdminPanelPage() {

    const router = useRouter();
    const { user, token, logout } = useAuthStore();
    const [allTurns, setAllTurns] = useState<Turno[]>([]); // Para almacenar TODOS los turnos
    const [loadingTurns, setLoadingTurns] = useState(true);

    const [isTurnoFormOpen, setIsTurnoFormOpen] = useState(false); 
    const [editingTurno, setEditingTurno] = useState<Turno | null>(null); 
    const [deletingTurnoId, setDeletingTurnoId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Diálogo de eliminación de turno

    // Función para obtener TODOS los turnos (para el admin)
    const fetchAllTurns = useCallback(async () => {
        if (!token) {
            setLoadingTurns(false);
            return;
        }
        setLoadingTurns(true);
        try {
            const res = await fetch(`${API_URL}/turnos`, { // Este endpoint debería devolver TODOS los turnos
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                if (res.status === 403) { // Prohibido si no tiene rol de admin/dueno
                    toast.error("No tienes permisos para acceder a esta página.");
                    router.push("/"); // Redirigir a la página principal
                    return;
                }
                throw new Error("Error al cargar los turnos.");
            }

            const turns: Turno[] = await res.json();
            setAllTurns(turns);

        } catch (error) {
            toast.error("Hubo un error al cargar todos los turnos.");
            console.error("Error fetching all turns:", error);
            setAllTurns([]);
        } finally {
            setLoadingTurns(false);
        }
    }, [token, router]);

    // useEffect para la autenticación y carga de turnos
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!token) {
                router.push("/login");
                toast.error("Debes iniciar sesión para ver esta página.");
            } else if (user && (user.role === "ADMIN" || user.role === "DUENO")) { // Validar rol
                fetchAllTurns();
            } else if (user) { // Si hay usuario pero no tiene el rol correcto
                toast.error("No tienes permisos para acceder a esta página.");
                router.push("/"); // Redirigir a la página principal
            }
        }
    }, [token, router, user, fetchAllTurns]);

    // Abre el formulario para crear un nuevo turno (si el admin lo necesita)
    const handleOpenCreateTurno = () => {
        setEditingTurno(null); 
        setIsTurnoFormOpen(true);
    };

    // Abre el formulario para editar un turno existente
    const handleOpenEditTurno = (turno: Turno) => {
        setEditingTurno(turno);
        setIsTurnoFormOpen(true);
    };

    // SUBMIT POST / PATCH Turnos (para el admin)
    const handleCreateUpdateTurno = async (turnoData: Partial<Turno>) => {
        if (!token || !user) {
            toast.error("No estás autenticado o no se pudo obtener tu información.");
            return;
        }

        try {
            let res;
            if (editingTurno) {
                // Actualizar turno existente (el admin puede modificar más campos)
                res = await fetch(`${API_URL}/turnos/${editingTurno.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        descripcion: turnoData.descripcion,
                        fechaHora: turnoData.fechaHora,
                        estado: turnoData.estado, // El admin sí puede cambiar el estado
                        // Cliente y dueño no se modifican desde aquí por el admin si no hay una necesidad explícita
                        // Si hubiera varios tatuadores, aquí se podría permitir cambiar el 'dueno'.
                        dueno: { id: TATUADOR_ID }, // Asegurar que el dueño es el tatuador único
                        cliente: turnoData.cliente // Pasar el cliente si se recibe, para que el backend lo use
                    }),
                });
            } else {
                // Crear nuevo turno (el admin puede asignarlo a un cliente específico si tiene un select de clientes)
                // Para simplificar, asumiremos que el admin crea turnos para el tatuador único
                // y el cliente se especificaría si el formulario lo permite, o se dejaría nulo/por defecto.
                // Aquí, si no se especifica cliente, lo haremos para el tatuador y luego se puede asignar.
                res = await fetch(`${API_URL}/turnos`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...turnoData,
                        dueno: { id: TATUADOR_ID }, // El dueño es el tatuador único y constante
                        estado: turnoData.estado || "SOLICITADO", // Puede definir el estado inicial
                        // Si el formulario de admin tuviera un selector de clientes, se agregaría aquí:
                        // cliente: turnoData.cliente ? { id: turnoData.cliente.id } : null, 
                    }),
                });
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Error al ${editingTurno ? 'actualizar' : 'crear'} el turno`);
            }

            toast.success(`Turno ${editingTurno ? 'actualizado' : 'creado'} exitosamente.`);
            fetchAllTurns(); // Recargar TODOS los turnos
            setIsTurnoFormOpen(false); 
            
        } catch (error) {
            toast.error(`Error al ${editingTurno ? 'actualizar' : 'crear'} el turno!`);
            console.error(error);
        }
    };

    // DELETE Turno
    const confirmDeleteTurno = async () => {
        if (!token || !deletingTurnoId) {
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
            fetchAllTurns(); 
            setDeletingTurnoId(null); 
            setIsDeleteDialogOpen(false); 

        } catch (error) {
            toast.error(`Error al eliminar el turno!`);
            console.error(error);
        }
    };

    // Logout desde panel de admin
    const handleLogout = () => {
        toast.error("Sesión de administrador cerrada!");
        logout(); 
        router.push("/");
    };

    if (!user || (!["ADMIN", "DUENO"].includes(user.role))) {
        // Redirigir si no hay usuario o no tiene el rol adecuado
        return (
            <div className="flex justify-center items-center h-screen text-2xl bg-gradient-to-br from-gray-900 to-black text-white">
                Verificando permisos...
            </div>
        );
    }
    
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-gray-900 to-black text-white">

            <header className="w-full p-6 bg-gray-700 flex flex-row justify-between items-center">
                <Link href="/"><h2 className="text-2xl font-semibold italic text-indigo-500 hover:text-indigo-300 transition">Instaguera</h2></Link>
                
                <div className="flex items-center gap-4">
                    <span className="text-gray-300 text-sm hidden sm:block">Bienvenido, {user.nombre} ({user.role})</span>
                    <Button
                        variant="ghost"
                        size="icon" 
                        onClick={handleLogout}
                        className="text-white hover:bg-white/20 hover:text-red-400 cursor-pointer"
                        title="Cerrar Sesión" 
                    >
                        <LogOut className="h-7 w-7" />
                    </Button>
                </div>
            </header>

            {/* Panel de Turnos del Administrador */}
            <div className="w-full my-8 max-w-4/5 px-8">

                <Card className="bg-opacity-10 bg-gray-600 backdrop-filter backdrop-blur-lg border-2 border-indigo-700 text-white shadow-2xl">
                    
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                            <CalendarCheck className="h-6 w-6 text-green-400" /> Gestión de Turnos
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            Administra todos los turnos del estudio.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {loadingTurns ? (
                            <p className="text-gray-400">Cargando todos los turnos...</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {/* Card para crear un nuevo turno (opcional para admin) */}
                                <Card
                                    className="bg-gray-800 border-gray-600 text-white p-4 flex flex-col justify-center items-center transition-transform hover:scale-105 duration-200 cursor-pointer h-48"
                                    onClick={handleOpenCreateTurno}
                                >
                                    <Plus className="h-12 w-12 text-indigo-400" />
                                    <p className="mt-2 text-lg text-indigo-300">Crear Nuevo Turno</p>
                                </Card>

                                {/* Renderizado de TODOS los turnos */}
                                {allTurns.length === 0 && !loadingTurns ? (
                                    <p className="text-gray-400 col-span-full">No hay turnos programados.</p>
                                ) : (
                                    allTurns.map((turno) => (
                                        <Card
                                            key={turno.id}
                                            className="bg-gray-800 border-gray-600 text-white p-6 transition-transform hover:scale-105 duration-200 relative"
                                        >
                                            <CardTitle className="text-xl text-blue-500 mb-2">
                                                Cliente: {turno.cliente?.nombre || "N/A"} {turno.cliente?.apellido || ""}
                                            </CardTitle>
                                            <CardDescription className="text-gray-200 text-md">
                                                Descripción: {turno.descripcion}
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
                                                            : turno.estado === "CANCELADO"
                                                            ? "text-red-400"
                                                            : "text-blue-400" // Para 'COMPLETADO' u otros
                                                    }`}
                                                >
                                                    {turno.estado}
                                                </span>
                                            </p>
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
                                                        setIsDeleteDialogOpen(true); 
                                                    }}
                                                    className="text-gray-400 hover:text-red-400 cursor-pointer"
                                                    title="Eliminar Turno"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        )}
                    
                    </CardContent>
                </Card>

            </div>

            {/* Modal para Crear/Editar Turno (Admin) */}
            <Dialog open={isTurnoFormOpen} onOpenChange={setIsTurnoFormOpen}>
                <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-blue-300">{editingTurno ? "Editar Turno" : "Crear Nuevo Turno"}</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Gestiona los detalles del turno.
                        </DialogDescription>
                    </DialogHeader>
                    <TurnoAdminForm
                        initialData={editingTurno}
                        onSubmitSuccess={handleCreateUpdateTurno}
                        onClose={() => setIsTurnoFormOpen(false)}
                        // Aquí no necesitamos pasar 'canModifyTurno' porque el admin puede modificar todo
                    />
                </DialogContent>
            </Dialog>

            {/* Modal de Eliminar Turno (Admin) */}
            <Dialog open={deletingTurnoId !== null && isDeleteDialogOpen} onOpenChange={(open) => {
                setIsDeleteDialogOpen(open);
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
                                setIsDeleteDialogOpen(false);
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