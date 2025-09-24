"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Se mantiene para el campo de cliente
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Turno, Usuario } from "@/types";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";

// Nuevo TimePicker usando Select de shadcn
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

interface TurnoAdminFormProps {
    initialData?: Turno | null;
    onSubmitSuccess: (turnoData: Partial<Turno>) => void;
    onClose: () => void;
}

export default function TurnoAdminForm({ initialData, onSubmitSuccess, onClose }: TurnoAdminFormProps) {

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState<Turno['estado']>("SOLICITADO"); // Default inicial para el estado si no hay initialData
    const [clienteId, setClienteId] = useState<number | null>(null);

    useEffect(() => {
        if (initialData) {
            // Modo edición: cargar datos del turno existente
            const initialDate = new Date(initialData.fechaHora);
            setSelectedDate(initialDate);
            setSelectedTime(format(initialDate, "HH:mm")); // Precarga la hora del turno existente
            setDescripcion(initialData.descripcion);
            setEstado(initialData.estado); // Precarga el estado del turno existente
            setClienteId(initialData.cliente?.id || null);
        } else {
            // Modo creación: establecer valores por defecto
            // Precargar la fecha para "hoy" o un día por defecto
            setSelectedDate(new Date()); // Precarga el día actual como fecha por defecto
            // Precargar una hora por defecto si se está creando un nuevo turno
            setSelectedTime("10:00"); // Puedes cambiar "10:00" por la hora que desees como default
            setDescripcion("");
            setEstado("SOLICITADO"); // Precarga el estado a "SOLICITADO" por defecto en creación
            setClienteId(null);
        }
    }, [initialData]);

    // POST Turno del tatuador
    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault();

        if (!selectedDate || !selectedTime || !descripcion) {
            toast.error("Por favor, completa la fecha, hora y descripción.");
            return;
        }

        const [hours, minutes] = selectedTime.split(":").map(Number);
        const fullFechaHora = new Date(selectedDate);
        fullFechaHora.setHours(hours, minutes, 0, 0);

        onSubmitSuccess({
            fechaHora: fullFechaHora.toISOString(),
            descripcion,
            estado,
            cliente: clienteId ? { id: clienteId } as Usuario : initialData?.cliente,
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

            <div className="grid gap-2">
                <Label htmlFor="hora" className="text-gray-300">
                    Hora
                </Label>
                <TimePicker value={selectedTime} onChange={setSelectedTime} />
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
                <Button type="button" variant="outline" onClick={onClose} className="text-white hover:bg-gray-700 cursor-pointer">
                    Cancelar
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-800 text-white cursor-pointer">
                    {initialData ? "Guardar Cambios" : "Crear Turno"}
                </Button>
            </div>
        </form>
    );
}