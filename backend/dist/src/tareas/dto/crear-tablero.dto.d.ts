export declare class MiembroInicialDto {
    codigo: string;
    rol?: string;
}
export declare class CrearTableroDto {
    nombre: string;
    descripcion?: string;
    color?: string;
    icono?: string;
    visibilidad?: string;
    equipoId?: number;
    propietario?: string;
    miembros_iniciales?: MiembroInicialDto[];
}
