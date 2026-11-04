declare class DestinatarioDto {
    codigo: string;
    nombre: string;
    empresa?: string;
}
export declare class CrearRecordatorioDto {
    titulo: string;
    descripcion?: string;
    tipo?: string;
    alcance?: string;
    hora?: string;
    fecha_unica?: string;
    frecuencia?: string;
    dias_semana?: string;
    dia_mes?: number;
    intervalo_dias?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
    sin_fecha_fin?: boolean;
    destinatarios?: DestinatarioDto[];
}
export {};
