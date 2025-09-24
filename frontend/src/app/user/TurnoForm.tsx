// ./TurnoForm.tsx

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Turno, Usuario } from "@/types"; 
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth"; 

interface TurnoFormProps {
    initialData?: Turno | null;
    onSubmitSuccess: (turnoData: Partial<Turno>) => void;
    onClose: () => void;
    canModifyTurno: (fechaHora: string) => boolean; 
}

export default function TurnoForm({ initialData, onSubmitSuccess, onClose, canModifyTurno }: TurnoFormProps) {

    const { user } = useAuthStore(); 
    const [fechaHora, setFechaHora] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState<Turno['estado']>("SOLICITADO"); 
    

    useEffect(() => {
        if (initialData) {
            setFechaHora(initialData.fechaHora.substring(0, 16)); 
            setDescripcion(initialData.descripcion);
            setEstado(initialData.estado);
        } else {
            setFechaHora("");
            setDescripcion("");
            setEstado("SOLICITADO"); 
        }
    }, [initialData]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!fechaHora || !descripcion) { 
            toast.error("Por favor, completa todos los campos.");
            return;
        }

        const turnoDate = new Date(fechaHora);
        const now = new Date();
        const diffHours = (turnoDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (!initialData && diffHours < 48) {
            toast.error("Los turnos deben solicitarse con al menos 48 horas de antelación.");
            return;
        }

        if (initialData && !canModifyTurno(initialData.fechaHora)) {
            const initialFechaHoraISO = new Date(initialData.fechaHora).toISOString().substring(0,16);
            const currentFechaHoraISO = new Date(fechaHora).toISOString().substring(0,16);

            if (currentFechaHoraISO !== initialFechaHoraISO) {
                toast.error("No puedes modificar la fecha y hora de un turno con menos de 48 horas de antelación.");
                return;
            }
        }

        onSubmitSuccess({
            fechaHora: new Date(fechaHora).toISOString(), 
            descripcion,
            estado: initialData ? initialData.estado : "SOLICITADO", 
            cliente: user ? { id: user.id } as Usuario : undefined, 
        });
    };
    
    /* const isEditingPast48Hours = initialData && !canModifyTurno(initialData.fechaHora); */

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="fechaHora" className="text-gray-300">Fecha y Hora</Label>
                <Input
                    id="fechaHora"
                    type="datetime-local"
                    value={fechaHora}
                    onChange={(e) => setFechaHora(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-600 text-white"
                    /* disabled={isEditingPast48Hours} */
                    min={!initialData ? new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().substring(0, 16) : undefined}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="descripcion" className="text-gray-300">Descripción del Tatuaje</Label>
                <Textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describe tu idea de tatuaje (ej. 'Lobo aullando en el antebrazo', 'Retoque de flor en la espalda')."
                    required
                    className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
                />
            </div>
            {initialData && ( 
                <div className="grid gap-2">
                    <Label htmlFor="estado" className="text-gray-300">Estado del Turno</Label>
                    <Select
                        onValueChange={(value: Turno['estado']) => setEstado(value)}
                        value={estado}
                        disabled={true} 
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
            )}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="text-white hover:bg-gray-700 cursor-pointer">
                    Cancelar
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-800 text-white cursor-pointer">
                    {initialData ? "Guardar Cambios" : "Sacar Turno"}
                </Button>
            </div>
        </form>
    );
}