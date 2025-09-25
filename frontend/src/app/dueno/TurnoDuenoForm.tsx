"use client"

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Turno, Usuario } from "@/types";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, UserIcon } from "lucide-react"; 
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// TimePicker para horario
interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  disabled?: boolean;
}

// Generador de horarios entre 09:00 y 20:00 en saltos de 15 minutos
const generateTimeOptions = () => {

    const options: string[] = [];

    for (let hour = 9; hour <= 20; hour++) {
        for (const minutes of [0, 15, 30, 45]) {
        if (hour === 20 && minutes > 0) break;
        const h = hour.toString().padStart(2, "0");
        const m = minutes.toString().padStart(2, "0");
        options.push(`${h}:${m}`);
        }
    }
    return options;
};

const timeOptions = generateTimeOptions();

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, disabled }) => {
    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Selecciona una hora" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 text-white max-h-60">
                {timeOptions.map((t) => (
                <SelectItem key={t} value={t}>
                    {t}
                </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

interface TurnoDuenoFormProps {
    initialData?: Turno | null;
    onSubmitSuccess: (turnoData: Partial<Turno>) => void;
    onClose: () => void;
}

export default function TurnoDuenoForm({ initialData, onSubmitSuccess, onClose }: TurnoDuenoFormProps) {

    const router = useRouter(); 
    const { token } = useAuthStore();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState<Turno['estado']>("SOLICITADO");

    // Estados para la gestión de clientes
    const [clientes, setClientes] = useState<Usuario[]>([]);
    const [loadingClientes, setLoadingClientes] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState<Usuario | null>(null);
    const [isClientPopoverOpen, setIsClientPopoverOpen] = useState(false); 

    useEffect(() => {
        if (initialData) {
            const initialDate = new Date(initialData.fechaHora);
            setSelectedDate(initialDate);
            setSelectedTime(format(initialDate, "HH:mm"));
            setDescripcion(initialData.descripcion);
            setEstado(initialData.estado);

            if (initialData.cliente) {
                setSelectedClient(initialData.cliente);
            } else {
                setSelectedClient(null);
            }
        } else {
            setSelectedDate(new Date());
            setSelectedTime("10:00");
            setDescripcion("");
            setEstado("SOLICITADO");
            setSelectedClient(null);
        }
    }, [initialData]);

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
                    router.push("/");
                    return;
                }
                throw new Error("Error al cargar los clientes.");
            }

            const clients: Usuario[] = await res.json();
            setClientes(clients);

        } catch (error) {
            toast.error("Hubo un error al cargar los clientes.");
            console.error("Error fetching clients:", error);
            setClientes([]);

        } finally {
            setLoadingClientes(false);
        }
    }, [token, router]);

    useEffect(() => {
        fetchAllClients();
    }, [fetchAllClients]);

    const filteredClients = searchTerm
        ? clientes.filter(
            (client) =>
                client.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.username?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : clientes;

    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault();

        if (!selectedDate || !selectedTime || !descripcion) {
            toast.error("Por favor, completa la fecha, hora y descripción.");
            return;
        }

        if (!selectedClient) {
            toast.error("Por favor, selecciona un cliente.");
            return;
        }

        const [hours, minutes] = selectedTime.split(":").map(Number);
        const fullFechaHora = new Date(selectedDate);
        fullFechaHora.setHours(hours, minutes, 0, 0);

        onSubmitSuccess({
            fechaHora: fullFechaHora.toISOString(),
            descripcion,
            estado,
            cliente: selectedClient ? { id: selectedClient.id } as Usuario : undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* Input de selección de cliente */}
            <div className="grid gap-2">
                <Label htmlFor="clienteSelect" className="text-gray-300">
                    Cliente
                </Label>
                <Popover open={isClientPopoverOpen} onOpenChange={setIsClientPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={`w-full justify-start text-left font-normal ${
                                !selectedClient && "text-muted-foreground"
                            } bg-gray-800 border-gray-600 text-white`}
                            disabled={loadingClientes}
                        >
                            {loadingClientes ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <UserIcon className="mr-2 h-4 w-4" />
                            )}
                            {selectedClient ? (
                                `${selectedClient.nombre} ${selectedClient.apellido} (${selectedClient.username})`
                            ) : (
                                <span>Selecciona un cliente</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-gray-800 border-gray-700">
                        <div className="p-2">
                            <Input
                                id="clienteSearch"
                                placeholder="Buscar cliente por nombre o username"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mb-2 bg-gray-700 border-gray-600 text-white"
                            />

                            <Select
                                onValueChange={(clientId) => {
                                    const client = clientes.find((c) => c.id === parseInt(clientId));
                                    setSelectedClient(client || null);
                                    setIsClientPopoverOpen(false);
                                }}
                                value={selectedClient?.id?.toString() || ""}
                            >
                                <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
                                    <SelectValue placeholder="Selecciona un cliente" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600 text-white max-h-60">
                                    {loadingClientes && (
                                        <SelectItem value="loading" disabled>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando...
                                        </SelectItem>
                                    )}
                                    {!loadingClientes && filteredClients.length === 0 && (
                                        <SelectItem value="no-clients" disabled>
                                            No se encontraron clientes
                                        </SelectItem>
                                    )}
                                    {filteredClients.map((client) => (
                                        <SelectItem key={client.id} value={client.id.toString()}>
                                            {client.nombre} {client.apellido} ({client.username})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Fecha - Calendario */}
            <div className="grid gap-2">
                <Label htmlFor="fecha" className="text-gray-300">
                    Fecha
                </Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={`w-full justify-start text-left font-normal ${
                                !selectedDate && "text-muted-foreground"
                            } bg-gray-800 border-gray-600 text-white`}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                                format(selectedDate, "PPP", { locale: es })
                            ) : (
                                <span>Selecciona una fecha</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            locale={es}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Hora */}
            <div className="grid gap-2">
                <Label htmlFor="hora" className="text-gray-300">
                    Hora
                </Label>
                <TimePicker value={selectedTime} onChange={setSelectedTime} />
            </div>

            {/* Descripción */}
            <div className="grid gap-2">
                <Label htmlFor="descripcion" className="text-gray-300">
                    Descripción del Tatuaje
                </Label>
                <Textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describe la idea del tatuaje."
                    required
                    className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
                />
            </div>

            {/* Estado del turno */}
            <div className="grid gap-2">
                <Label htmlFor="estado" className="text-gray-300">
                    Estado del Turno
                </Label>
                <Select onValueChange={(value: Turno['estado']) => setEstado(value)} value={estado}>
                    <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Estado del Turno" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                        <SelectItem value="SOLICITADO">Solicitado</SelectItem>
                        <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                        <SelectItem value="CANCELADO">Cancelado</SelectItem>
                        <SelectItem value="COMPLETADO">Completado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="text-white hover:bg-gray-700 cursor-pointer"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-800 text-white cursor-pointer"
                >
                    {initialData ? "Guardar Cambios" : "Crear Turno"}
                </Button>
            </div>
        </form>
    );
}