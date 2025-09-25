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
import { Trash2, LogOut, Users } from "lucide-react";
import Link from "next/link";

// Importar componentes de tabla de shadcn/ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Definir un tipo para el cliente, si no lo tienes ya en `types`
interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    celular: string;
    username: string;
    email: string;
    role: string;
}

export default function AdminPanelPage() {

    const router = useRouter();
    const { user, token, logout } = useAuthStore();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loadingClientes, setLoadingClientes] = useState(true);
    const [deletingClientId, setDeletingClientId] = useState<number | null>(null);
    const [isClientDeleteDialogOpen, setIsClientDeleteDialogOpen] = useState(false);

    // GET de TODOS los clientes
    const fetchAllClients = useCallback(async () => {

        if (!token) {
            setLoadingClientes(false);
            return;
        }

        setLoadingClientes(true);
        try {
            const res = await fetch(`${API_URL}/usuarios/clientes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                if (res.status === 403) {
                    toast.error("No tienes permisos para ver los clientes.");
                    // router.push("/"); // O puedes manejarlo de otra forma si no quieres redirigir
                    return;
                }
                throw new Error("Error al cargar los clientes.");
            }

            const clients: Cliente[] = await res.json();
            setClientes(clients);
        } catch (error) {
            toast.error("Hubo un error al cargar los clientes.");
            console.error("Error fetching clients:", error);
            setClientes([]);
        } finally {
            setLoadingClientes(false);
        }
    }, [token]);


    // useEffect para la autenticación y carga de turnos Y CLIENTES
    useEffect(() => {

        if (typeof window !== "undefined") {

            if (!token) {
                router.push("/login");
                
            } else if (user && (user.role === "ADMIN")) { 

                fetchAllClients(); 

            } else if (user) {

                toast.error("No tienes permisos para acceder a esta página.");
                router.push("/"); 
            }
        }
    }, [token, router, user, fetchAllClients]);


    // DELETE Cliente - solo el admin puede
    const confirmDeleteClient = async () => {
        if (!token || !deletingClientId) {
            toast.error("No estás autenticado o no hay un cliente seleccionado para eliminar.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/usuarios/${deletingClientId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al eliminar el cliente.");
            }

            toast.success("Cliente eliminado exitosamente.");
            fetchAllClients(); // Recargar la lista de clientes
            setDeletingClientId(null);
            setIsClientDeleteDialogOpen(false);

        } catch (error) {
            toast.error(`Error al eliminar el cliente!`);
            console.error(error);
        }
    };

    // Logout desde panel de admin
    const handleLogout = () => {
        toast.error("Sesión de administrador cerrada!");
        router.push("/");
        logout();
    };

    // Validación de rol
    if (!user || (!["ADMIN", "DUENO"].includes(user.role))) {
        return (
            <div className="flex justify-center items-center h-screen text-2xl bg-gradient-to-br from-gray-900 to-black text-white">
                Verificando permisos...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-gray-900 to-black text-white">

            <header className="w-full px-8 py-6 bg-gray-700 flex flex-row justify-between items-center">

                <Link href="/"><h2 className="text-2xl text-white hover:text-indigo-400 transition">Inicio</h2></Link>

                <h3 className="text-3xl text-white ">Panel Administrador</h3>

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

            {/* Panel de Gestión de Clientes */}
            <div className="w-full my-8 max-w-[95%] px-8">
                <Card className="bg-opacity-10 bg-gray-700 backdrop-filter backdrop-blur-lg border-2 border-purple-600 text-white shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                            <Users className="h-6 w-6 text-purple-400" /> Gestión de Clientes
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            Administra todos los clientes de la aplicación.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loadingClientes ? (
                            <p className="text-gray-400">Cargando clientes...</p>
                        ) : (
                            <div className="overflow-x-auto">
                                {clientes.length === 0 ? (
                                    <p className="text-gray-400">No hay clientes registrados.</p>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-800 hover:bg-gray-700">
                                                <TableHead className="text-purple-300">ID</TableHead>
                                                <TableHead className="text-purple-300">Nombre</TableHead>
                                                <TableHead className="text-purple-300">Apellido</TableHead>
                                                <TableHead className="text-purple-300">Email</TableHead>
                                                <TableHead className="text-purple-300">Celular</TableHead>
                                                <TableHead className="text-purple-300">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {clientes.map((cliente) => (
                                                <TableRow key={cliente.id} className="border-gray-700 hover:bg-gray-800">
                                                    <TableCell className="font-medium text-gray-100">{cliente.id}</TableCell>
                                                    <TableCell className="text-gray-200">{cliente.nombre}</TableCell>
                                                    <TableCell className="text-gray-200">{cliente.apellido}</TableCell>
                                                    <TableCell className="text-gray-200">{cliente.email}</TableCell>
                                                    <TableCell className="text-gray-200">{cliente.celular}</TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-purple-400"
                                                                >
                                                                    <span className="sr-only">Abrir menú</span>
                                                                    <Users className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setDeletingClientId(cliente.id);
                                                                        setIsClientDeleteDialogOpen(true);
                                                                    }}
                                                                    className="text-red-400 hover:bg-gray-700 hover:text-red-300 cursor-pointer"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    <span>Eliminar</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Modal de Eliminar Cliente */}
            <Dialog open={deletingClientId !== null && isClientDeleteDialogOpen} onOpenChange={(open) => {
                setIsClientDeleteDialogOpen(open);
                if (!open) setDeletingClientId(null);
            }}>
                <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-red-400">Confirmar Eliminación de Cliente</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            ¿Estás seguro de que quieres eliminar este cliente? Esto también eliminará todos sus datos y turnos asociados. Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsClientDeleteDialogOpen(false);
                                setDeletingClientId(null);
                            }}
                            className="text-white hover:bg-gray-700 cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteClient}
                            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        >
                            Sí, Eliminar Cliente
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}