export declare class CrearTareaDto {
    tableroId: number;
    columnaId: number;
    titulo: string;
    descripcion?: string;
    prioridad?: string;
    posicion?: number;
    fechaInicio?: string;
    fechaVencimiento?: string;
    origen?: string;
    reunionId?: string;
    creadoPor?: string;
    etiquetas?: number[];
    asignados?: string[];
}
