import { RecordatoriosService } from './recordatorios.service';
import { CrearRecordatorioDto } from './dto/crear-recordatorio.dto';
import { ActualizarRecordatorioDto } from './dto/actualizar-recordatorio.dto';
export declare class RecordatoriosController {
    private readonly service;
    constructor(service: RecordatoriosService);
    findAll(estado?: string, tipo?: string, alcance?: string): Promise<{
        data: ({
            destinatarios: {
                empresa: string | null;
                codigo: string;
                nombre: string;
                id: number;
                recordatorioId: number;
                leido: boolean;
            }[];
        } & {
            estado: string;
            id: number;
            titulo: string;
            creadoPor: string;
            fechaCreacion: Date;
            tipo: string;
            descripcion: string | null;
            fechaInicio: Date | null;
            alcance: string;
            fechaUnica: Date | null;
            hora: string | null;
            frecuencia: string | null;
            diasSemana: string | null;
            diaMes: number | null;
            intervalodias: number | null;
            fechaFin: Date | null;
            sinFechaFin: boolean;
            creadoPorNombre: string;
            proximaEjecucion: Date | null;
            ultimaEjecucion: Date | null;
            totalEjecuciones: number;
        })[];
    }>;
    findProximos(limite?: number): Promise<{
        data: ({
            destinatarios: {
                empresa: string | null;
                codigo: string;
                nombre: string;
                id: number;
                recordatorioId: number;
                leido: boolean;
            }[];
        } & {
            estado: string;
            id: number;
            titulo: string;
            creadoPor: string;
            fechaCreacion: Date;
            tipo: string;
            descripcion: string | null;
            fechaInicio: Date | null;
            alcance: string;
            fechaUnica: Date | null;
            hora: string | null;
            frecuencia: string | null;
            diasSemana: string | null;
            diaMes: number | null;
            intervalodias: number | null;
            fechaFin: Date | null;
            sinFechaFin: boolean;
            creadoPorNombre: string;
            proximaEjecucion: Date | null;
            ultimaEjecucion: Date | null;
            totalEjecuciones: number;
        })[];
    }>;
    findNotificaciones(): Promise<{
        data: {
            id: number;
            titulo: string;
            descripcion: string | null;
            leida: boolean;
            recordatorioId: number;
            fechaEjecucion: Date;
            completada: boolean;
        }[];
    }>;
    findOne(id: number): Promise<{
        data: {
            destinatarios: {
                empresa: string | null;
                codigo: string;
                nombre: string;
                id: number;
                recordatorioId: number;
                leido: boolean;
            }[];
        } & {
            estado: string;
            id: number;
            titulo: string;
            creadoPor: string;
            fechaCreacion: Date;
            tipo: string;
            descripcion: string | null;
            fechaInicio: Date | null;
            alcance: string;
            fechaUnica: Date | null;
            hora: string | null;
            frecuencia: string | null;
            diasSemana: string | null;
            diaMes: number | null;
            intervalodias: number | null;
            fechaFin: Date | null;
            sinFechaFin: boolean;
            creadoPorNombre: string;
            proximaEjecucion: Date | null;
            ultimaEjecucion: Date | null;
            totalEjecuciones: number;
        };
    }>;
    create(dto: CrearRecordatorioDto): Promise<{
        data: {
            destinatarios: {
                empresa: string | null;
                codigo: string;
                nombre: string;
                id: number;
                recordatorioId: number;
                leido: boolean;
            }[];
        } & {
            estado: string;
            id: number;
            titulo: string;
            creadoPor: string;
            fechaCreacion: Date;
            tipo: string;
            descripcion: string | null;
            fechaInicio: Date | null;
            alcance: string;
            fechaUnica: Date | null;
            hora: string | null;
            frecuencia: string | null;
            diasSemana: string | null;
            diaMes: number | null;
            intervalodias: number | null;
            fechaFin: Date | null;
            sinFechaFin: boolean;
            creadoPorNombre: string;
            proximaEjecucion: Date | null;
            ultimaEjecucion: Date | null;
            totalEjecuciones: number;
        };
    }>;
    update(id: number, dto: ActualizarRecordatorioDto): Promise<{
        data: {
            destinatarios: {
                empresa: string | null;
                codigo: string;
                nombre: string;
                id: number;
                recordatorioId: number;
                leido: boolean;
            }[];
        } & {
            estado: string;
            id: number;
            titulo: string;
            creadoPor: string;
            fechaCreacion: Date;
            tipo: string;
            descripcion: string | null;
            fechaInicio: Date | null;
            alcance: string;
            fechaUnica: Date | null;
            hora: string | null;
            frecuencia: string | null;
            diasSemana: string | null;
            diaMes: number | null;
            intervalodias: number | null;
            fechaFin: Date | null;
            sinFechaFin: boolean;
            creadoPorNombre: string;
            proximaEjecucion: Date | null;
            ultimaEjecucion: Date | null;
            totalEjecuciones: number;
        };
    }>;
    remove(id: number): Promise<{
        data: {
            estado: string;
            id: number;
            titulo: string;
            creadoPor: string;
            fechaCreacion: Date;
            tipo: string;
            descripcion: string | null;
            fechaInicio: Date | null;
            alcance: string;
            fechaUnica: Date | null;
            hora: string | null;
            frecuencia: string | null;
            diasSemana: string | null;
            diaMes: number | null;
            intervalodias: number | null;
            fechaFin: Date | null;
            sinFechaFin: boolean;
            creadoPorNombre: string;
            proximaEjecucion: Date | null;
            ultimaEjecucion: Date | null;
            totalEjecuciones: number;
        };
    }>;
    completar(id: number): Promise<{
        data: {
            estado: string;
            id: number;
            titulo: string;
            creadoPor: string;
            fechaCreacion: Date;
            tipo: string;
            descripcion: string | null;
            fechaInicio: Date | null;
            alcance: string;
            fechaUnica: Date | null;
            hora: string | null;
            frecuencia: string | null;
            diasSemana: string | null;
            diaMes: number | null;
            intervalodias: number | null;
            fechaFin: Date | null;
            sinFechaFin: boolean;
            creadoPorNombre: string;
            proximaEjecucion: Date | null;
            ultimaEjecucion: Date | null;
            totalEjecuciones: number;
        };
    }>;
    reactivar(id: number): Promise<{
        data: {
            estado: string;
            id: number;
            titulo: string;
            creadoPor: string;
            fechaCreacion: Date;
            tipo: string;
            descripcion: string | null;
            fechaInicio: Date | null;
            alcance: string;
            fechaUnica: Date | null;
            hora: string | null;
            frecuencia: string | null;
            diasSemana: string | null;
            diaMes: number | null;
            intervalodias: number | null;
            fechaFin: Date | null;
            sinFechaFin: boolean;
            creadoPorNombre: string;
            proximaEjecucion: Date | null;
            ultimaEjecucion: Date | null;
            totalEjecuciones: number;
        };
    }>;
    marcarNotificacionLeida(id: number): Promise<{
        data: {
            id: number;
            titulo: string;
            descripcion: string | null;
            leida: boolean;
            recordatorioId: number;
            fechaEjecucion: Date;
            completada: boolean;
        };
    }>;
}
