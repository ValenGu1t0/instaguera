import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Turno, Usuario } from "@/types"; 
import { toast } from "sonner";

interface TurnoAdminFormProps {
    initialData?: Turno | null;
    onSubmitSuccess: (turnoData: Partial<Turno>) => void;
    onClose: () => void;
}

export default function TurnoAdminForm({ initialData, onSubmitSuccess, onClose }: TurnoAdminFormProps) {

    const [fechaHora, setFechaHora] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState<Turno['estado']>("SOLICITADO"); 
    const [clienteId, setClienteId] = useState<number | null>(null); // Para mostrar/establecer cliente si es necesario

    useEffect(() => {
        if (initialData) {
            setFechaHora(initialData.fechaHora.substring(0, 16)); 
            setDescripcion(initialData.descripcion);
            setEstado(initialData.estado);
            setClienteId(initialData.cliente?.id || null);
        } else {
            // Limpiar formulario para un nuevo turno
            setFechaHora("");
            setDescripcion("");
            setEstado("SOLICITADO"); // Un nuevo turno puede iniciar como 'SOLICITADO' por defecto
            setClienteId(null);
        }
    }, [initialData]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!fechaHora || !descripcion) {
            toast.error("Por favor, completa la fecha, hora y descripción.");
            return;
        }

        // El admin puede modificar la fecha sin la restricción de 48h del cliente.
        // También puede cambiar el estado.

        onSubmitSuccess({
            fechaHora: new Date(fechaHora).toISOString(), 
            descripcion,
            estado, // El admin puede definir o cambiar el estado
            // Si el admin tuviera un selector para asignar el turno a un cliente:
            cliente: clienteId ? { id: clienteId } as Usuario : initialData?.cliente, // Mantener el cliente existente o asignar uno nuevo
            // El dueño sigue siendo el tatuador único, no se necesita enviar desde aquí
        });
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {initialData && initialData.cliente && (
                 <div className="grid gap-2">
                    <Label htmlFor="clienteInfo" className="text-gray-300">Cliente</Label>
                    <Input
                        id="clienteInfo"
                        type="text"
                        value={`${initialData.cliente.nombre} ${initialData.cliente.apellido} (ID: ${initialData.cliente.id})`}
                        disabled
                        className="bg-gray-800 border-gray-600 text-white"
                    />
                </div>
            )}
            <div className="grid gap-2">
                <Label htmlFor="fechaHora" className="text-gray-300">Fecha y Hora</Label>
                <Input
                    id="fechaHora"
                    type="datetime-local"
                    value={fechaHora}
                    onChange={(e) => setFechaHora(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-600 text-white"
                    // El admin no tiene la restricción de 48h para la fecha
                    // Min date podría ser hoy, o no tener mínimo para turnos pasados
                    min={new Date().toISOString().substring(0, 16)} 
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="descripcion" className="text-gray-300">Descripción del Tatuaje</Label>
                <Textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describe la idea del tatuaje."
                    required
                    className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="estado" className="text-gray-300">Estado del Turno</Label>
                <Select
                    onValueChange={(value: Turno['estado']) => setEstado(value)}
                    value={estado}
                    // El admin SÍ puede cambiar el estado
                >
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
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="text-white hover:bg-gray-700">
                    Cancelar
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-800 text-white">
                    {initialData ? "Guardar Cambios" : "Crear Turno"}
                </Button>
            </div>
        </form>
    );
}